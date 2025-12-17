
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, Plus, MoreHorizontal, Shield, Lock, 
  CheckCircle, XCircle, AlertTriangle, Key, Trash2, Mail, User, X,
  Activity, Clock, FileText
} from 'lucide-react';
import { MOCK_SYSTEM_ADMINS, SystemAdmin, MOCK_GLOBAL_AUDIT_LOGS } from '../../utils/adminData';
import { AdminTable, Column } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedSelect } from '../profile/ProfileFormElements';

const AdminManager: React.FC = () => {
  const [admins, setAdmins] = useState<SystemAdmin[]>(MOCK_SYSTEM_ADMINS);
  const [selectedAdmin, setSelectedAdmin] = useState<SystemAdmin | null>(null);
  const [actionType, setActionType] = useState<'Block' | 'Suspend' | 'Activate' | null>(null);
  const [modalView, setModalView] = useState<'details' | 'logs'>('details');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ name: '', email: '', role: 'Support' });

  // Load from LS
  useEffect(() => {
     const stored = localStorage.getItem('mdm_system_admins');
     if (stored) {
         setAdmins(JSON.parse(stored));
     } else {
         setAdmins(MOCK_SYSTEM_ADMINS);
     }
  }, []);

  // ... (rest of the logic: updateAdminStatus, handleCreateAdmin, getAdminLogs remain same) ...
  const updateAdminStatus = (id: string, newStatus: SystemAdmin['status']) => {
     const updated = admins.map(a => a.id === id ? { ...a, status: newStatus } : a);
     setAdmins(updated);
     localStorage.setItem('mdm_system_admins', JSON.stringify(updated));
     const log = {
        id: `GAL-${Date.now()}`,
        actorId: 'SA-001', actorName: 'Super Admin', actorRole: 'Super Admin',
        action: `${newStatus} Admin Account`, target: id, module: 'Admin Mgmt',
        timestamp: new Date().toLocaleString(), severity: 'critical', ip: '127.0.0.1'
     };
     const logs = JSON.parse(localStorage.getItem('mdm_super_admin_logs') || '[]');
     localStorage.setItem('mdm_super_admin_logs', JSON.stringify([log, ...logs]));
     setActionType(null);
     setSelectedAdmin(null);
  };

  const handleCreateAdmin = () => {
     if(!newAdminData.name || !newAdminData.email) return;
     const newAdmin: SystemAdmin = {
        id: `ADM-${Math.floor(Math.random() * 1000)}`,
        name: newAdminData.name,
        email: newAdminData.email,
        role: newAdminData.role as any,
        status: 'Active',
        lastLogin: 'Never',
        actionsCount: 0,
        avatar: `https://ui-avatars.com/api/?name=${newAdminData.name.replace(/\s/g, '+')}&background=random`,
        permissions: []
     };
     const updatedList = [newAdmin, ...admins];
     setAdmins(updatedList);
     localStorage.setItem('mdm_system_admins', JSON.stringify(updatedList));
     const log = {
        id: `GAL-${Date.now()}`,
        actorId: 'SA-001', actorName: 'Super Admin', actorRole: 'Super Admin',
        action: `Created Admin ${newAdminData.role}`, target: newAdmin.id, module: 'Admin Mgmt',
        timestamp: new Date().toLocaleString(), severity: 'medium', ip: '127.0.0.1'
     };
     const logs = JSON.parse(localStorage.getItem('mdm_super_admin_logs') || '[]');
     localStorage.setItem('mdm_super_admin_logs', JSON.stringify([log, ...logs]));
     setShowCreateModal(false);
     setNewAdminData({ name: '', email: '', role: 'Support' });
     alert(`Admin Credential Created.\n\nUser: ${newAdmin.email}\nPass: secure123 (Default)`);
  };

  const getAdminLogs = (adminId: string, adminName: string) => {
      const storedLogs = JSON.parse(localStorage.getItem('mdm_approval_logs') || '[]');
      const globalLogs = JSON.parse(localStorage.getItem('mdm_super_admin_logs') || '[]');
      const approvalActs = storedLogs.filter((l: any) => l.adminName === adminName || l.adminId === adminId);
      const globalActs = globalLogs.filter((l: any) => l.actorId === adminId || l.actorName === adminName);
      const mockActs = MOCK_GLOBAL_AUDIT_LOGS.filter(l => l.actorId === adminId || l.actorName === adminName);
      return [...approvalActs, ...globalActs, ...mockActs].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const columns: Column<SystemAdmin>[] = [
    { key: 'name', label: 'Administrator', sortable: true, render: (_, a) => (
       <div className="flex items-center gap-3">
          <img src={a.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
          <div>
             <div className="font-bold text-white text-sm">{a.name}</div>
             <div className="text-[10px] text-gray-500">{a.email}</div>
          </div>
       </div>
    )},
    { key: 'role', label: 'Role', sortable: true, render: (val) => (
       <span className="px-2 py-1 bg-white/5 rounded-lg border border-white/10 text-xs font-bold text-gray-300">{val}</span>
    )},
    { key: 'status', label: 'Status', sortable: true, render: (val) => (
       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
          val === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
          val === 'Blocked' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
          'bg-amber-500/10 text-amber-500 border border-amber-500/20'
       }`}>
          {val === 'Active' ? <CheckCircle size={10} /> : val === 'Blocked' ? <Lock size={10} /> : <AlertTriangle size={10} />}
          {val}
       </span>
    )},
    { key: 'lastLogin', label: 'Last Active', sortable: true, render: (val) => <span className="text-xs text-gray-500 font-mono">{val}</span> },
    { key: 'actionsCount', label: 'Ops Count', sortable: true, render: (val) => <span className="text-xs font-bold text-white">{val}</span> },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#151621] p-6 rounded-[2rem] border border-white/5">
          <div>
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="text-blue-500" /> Admin Management
             </h2>
             <p className="text-sm text-gray-500 mt-1">Manage system access levels and permissions.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full md:w-auto px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-yellow-500/20"
          >
             <Plus size={18} /> Add New Admin
          </button>
       </div>

       {/* Admin List */}
       <div className="bg-[#151621] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search admins..." className="w-full bg-[#0b0c15] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-yellow-500/50 transition-colors" />
             </div>
             <div className="flex w-full md:w-auto justify-end">
                <button className="p-2 text-gray-500 hover:text-white transition-colors bg-[#0b0c15] rounded-lg border border-white/10"><Filter size={18} /></button>
             </div>
          </div>

          <div className="flex-1 relative h-[85vh] min-h-[600px] overflow-hidden">
             <AdminTable 
                data={admins}
                columns={columns}
                enableSearch={false}
                enableExport={false}
                actions={(admin) => (
                   <div className="flex gap-2 justify-end">
                      <button onClick={() => { setSelectedAdmin(admin); setModalView('details'); }} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="View Details">
                         <MoreHorizontal size={16} />
                      </button>
                   </div>
                )}
             />
          </div>
       </div>

       {/* Admin Detail/Log Modal */}
       <AnimatePresence>
          {selectedAdmin && !actionType && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div 
                   initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                   className="bg-[#1a1b26] border border-white/10 rounded-3xl p-0 max-w-2xl w-full flex flex-col max-h-[80vh] overflow-hidden"
                >
                    {/* Modal Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#151621]">
                        <div className="flex items-center gap-4">
                            <img src={selectedAdmin.avatar} className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                                <h3 className="font-bold text-lg text-white">{selectedAdmin.name}</h3>
                                <p className="text-xs text-gray-500">{selectedAdmin.email} • {selectedAdmin.role}</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedAdmin(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-500"><X size={20} /></button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-2 gap-2 border-b border-white/5 bg-[#151621]">
                        <button onClick={() => setModalView('details')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${modalView === 'details' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Overview</button>
                        <button onClick={() => setModalView('logs')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${modalView === 'logs' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Activity Logs</button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                        {modalView === 'details' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-[#0b0c15] p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                                        <p className={`font-bold mt-1 ${selectedAdmin.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{selectedAdmin.status}</p>
                                    </div>
                                    <div className="bg-[#0b0c15] p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Last Login</p>
                                        <p className="font-bold text-white mt-1">{selectedAdmin.lastLogin}</p>
                                    </div>
                                    <div className="bg-[#0b0c15] p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Actions Performed</p>
                                        <p className="font-bold text-white mt-1">{selectedAdmin.actionsCount}</p>
                                    </div>
                                    <div className="bg-[#0b0c15] p-4 rounded-xl border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase font-bold">ID</p>
                                        <p className="font-mono text-xs text-gray-300 mt-1">{selectedAdmin.id}</p>
                                    </div>
                                </div>
                                
                                <div className="pt-6 border-t border-white/5">
                                    <h4 className="font-bold text-sm text-gray-400 mb-4 uppercase">Management Actions</h4>
                                    <div className="flex gap-3">
                                        {selectedAdmin.status === 'Active' ? (
                                            <>
                                                <button onClick={() => setActionType('Suspend')} className="flex-1 py-3 bg-amber-500/10 text-amber-500 font-bold text-sm rounded-xl border border-amber-500/20 hover:bg-amber-500/20">Suspend</button>
                                                <button onClick={() => setActionType('Block')} className="flex-1 py-3 bg-red-500/10 text-red-500 font-bold text-sm rounded-xl border border-red-500/20 hover:bg-red-500/20">Block</button>
                                            </>
                                        ) : (
                                            <button onClick={() => updateAdminStatus(selectedAdmin.id, 'Active')} className="flex-1 py-3 bg-green-500/10 text-green-500 font-bold text-sm rounded-xl border border-green-500/20 hover:bg-green-500/20">Activate Account</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {modalView === 'logs' && (
                            <div className="space-y-3">
                                {getAdminLogs(selectedAdmin.id, selectedAdmin.name).length === 0 ? (
                                    <p className="text-center text-gray-500 py-10">No activity recorded.</p>
                                ) : (
                                    getAdminLogs(selectedAdmin.id, selectedAdmin.name).map((log: any, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-[#0b0c15] rounded-xl border border-white/5">
                                            <div className="p-2 bg-white/5 rounded-lg text-gray-400 mt-0.5"><Activity size={14} /></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-200">{log.action}</p>
                                                <p className="text-xs text-gray-500">Target: {log.targetName || log.target}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-600 font-mono">{log.timestamp}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>

       {/* Action Confirmation Modal (Block/Suspend) */}
       <AnimatePresence>
          {selectedAdmin && actionType && (
             <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div 
                   initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                   className="bg-[#1a1b26] border border-white/10 rounded-3xl p-8 max-w-md w-full text-center"
                >
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${actionType === 'Block' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                      {actionType === 'Block' ? <Lock size={32} /> : <AlertTriangle size={32} />}
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">{actionType} {selectedAdmin.name}?</h3>
                   <p className="text-gray-400 text-sm mb-8">
                      {actionType === 'Block' ? "This will immediately revoke all access tokens. The admin will be logged out from all active sessions." : "User will be temporarily disabled until manually reactivated."}
                   </p>
                   
                   <div className="flex gap-3">
                      <button onClick={() => setActionType(null)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-bold text-sm hover:bg-white/5 transition-colors">Cancel</button>
                      <button onClick={() => updateAdminStatus(selectedAdmin.id, actionType === 'Block' ? 'Blocked' : 'Suspended')} className={`flex-1 py-3 rounded-xl font-bold text-sm text-black ${actionType === 'Block' ? 'bg-red-500 hover:bg-red-400' : 'bg-amber-500 hover:bg-amber-400'}`}>Confirm {actionType}</button>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>

       {/* Create Admin Modal */}
       <AnimatePresence>
          {showCreateModal && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div 
                   initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                   className="bg-[#1a1b26] border border-white/10 rounded-3xl p-8 max-w-md w-full"
                >
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white">Create Admin Credentials</h3>
                      <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                   </div>
                   <div className="space-y-4">
                      <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Full Name</label><div className="relative"><User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="text" value={newAdminData.name} onChange={e => setNewAdminData({...newAdminData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-yellow-500" placeholder="e.g. John Doe" /></div></div>
                      <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Email Address</label><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="email" value={newAdminData.email} onChange={e => setNewAdminData({...newAdminData, email: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-yellow-500" placeholder="admin@divine.com" /></div></div>
                      <div className="space-y-2"><label className="text-xs font-bold text-gray-400 uppercase">Role Assignment</label><select value={newAdminData.role} onChange={e => setNewAdminData({...newAdminData, role: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-yellow-500 appearance-none"><option value="Admin">Admin (Full Access)</option><option value="Moderator">Moderator (Content & Reports)</option><option value="Support">Support (Tickets & Users)</option><option value="Finance">Finance (Payments Only)</option></select></div>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mt-4"><div className="flex items-center gap-2 text-yellow-500 text-xs font-bold mb-1"><Key size={14} /> Default Password</div><p className="text-xs text-yellow-200/70">The user will be assigned a temporary password: <span className="font-mono text-white">secure123</span></p></div>
                      <PremiumButton onClick={handleCreateAdmin} className="w-full mt-4" variant="gradient">Create Account</PremiumButton>
                   </div>
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  );
};

export default AdminManager;
