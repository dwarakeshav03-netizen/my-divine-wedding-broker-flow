
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Shield, CheckCircle, XCircle, Search, Filter, 
  Flag, MessageSquare, UserX, Eye, Lock, ChevronRight, Activity, 
  BarChart2, Clock, Trash2, Ban, UserCheck, User, Mail, Phone, MapPin, Briefcase, Home, Unlock, Power
} from 'lucide-react';
import { AdminTable, Column } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';
import { KpiCard } from './AdminWidgets';
import { MOCK_REPORTS, ReportTicket, SAFETY_ANALYTICS, AdminUser } from '../../utils/adminData';

const AdminReports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'open' | 'investigating' | 'resolved'>('open');
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState<ReportTicket[]>([]);
  const [users, setUsers] = useState<any[]>([]); 
  
  // Viewer State
  const [viewingUser, setViewingUser] = useState<AdminUser | null>(null);
  const [viewerRole, setViewerRole] = useState<'Admin' | 'Super Admin'>('Admin');
  
  // Chat Modal State
  const [chatUser, setChatUser] = useState<string | null>(null);

  // Load Reports & Users
  useEffect(() => {
     const role = localStorage.getItem('mdm_admin_role');
     setViewerRole(role === 'Super Admin' ? 'Super Admin' : 'Admin');

     const loadData = () => {
         // Reports
         const storedReports = JSON.parse(localStorage.getItem('mdm_reports') || '[]');
         const combined = [...storedReports, ...MOCK_REPORTS];
         // Dedupe reports by ID
         const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
         setReports(unique);

         // Users
         const storedUsers = JSON.parse(localStorage.getItem('mdm_users') || '[]');
         setUsers(storedUsers);
     };
     loadData();
     
     // Poll less frequently to avoid overwriting optimistic updates immediately, 
     // but enough to keep sync. 
     const interval = setInterval(loadData, 5000); 
     return () => clearInterval(interval);
  }, []);

  const openUserProfile = (userId: string, fallbackName: string, fallbackAvatar: string) => {
      const found = users.find((u: any) => u.id === userId);
      if (found) {
          setViewingUser(found);
      } else {
          // Construct partial user from available info
          setViewingUser({
              id: userId,
              name: fallbackName,
              email: 'N/A', // Admin shouldn't see if not found
              mobile: 'N/A',
              role: 'user',
              status: 'active',
              plan: 'free',
              joinedDate: 'Unknown',
              lastActive: 'Unknown',
              verified: false,
              reports: 0,
              safetyScore: 50,
              religion: 'Unknown',
              caste: 'Unknown',
              age: 0,
              gender: 'Unknown',
              location: 'Unknown',
              avatar: fallbackAvatar,
              profileScore: 0
          });
      }
  };

  const handleBlockToggle = (userId: string) => {
     // 1. Get fresh copy to modify
     const currentUsers = [...users];
     const userIndex = currentUsers.findIndex(u => u.id === userId);
     
     let targetUser;
     let isNewEntry = false;

     if (userIndex === -1) {
         // User not in DB (Phantom Report), create mock shell
         const report = reports.find(r => r.reportedUserId === userId);
         targetUser = {
             id: userId,
             name: report?.reportedUser || 'Unknown User',
             email: `user_${userId}@divine.com`,
             mobile: 'N/A',
             role: 'user',
             status: 'active', // Default before toggle
             plan: 'free',
             joinedDate: new Date().toISOString(),
             lastActive: 'Now',
             verified: false,
             reports: 0,
             safetyScore: 50,
             religion: 'Unknown',
             caste: 'Unknown',
             age: 25,
             gender: 'Unknown',
             location: 'Unknown',
             avatar: report?.reportedUserAvatar || 'https://ui-avatars.com/api/?name=Unknown',
             profileScore: 0
         };
         isNewEntry = true;
     } else {
         targetUser = { ...currentUsers[userIndex] }; // Shallow copy item
     }
     
     const isBlocked = targetUser.status === 'blocked';
     const newStatus = isBlocked ? 'active' : 'blocked';
     const actionText = isBlocked ? 'UNBLOCK' : 'BLOCK';

     if(confirm(`Are you sure you want to ${actionText} user ${userId}?`)) {
         // Update status on the object
         targetUser.status = newStatus;

         if (isNewEntry) {
             currentUsers.push(targetUser);
         } else {
             currentUsers[userIndex] = targetUser;
         }
         
         // Save and Update State
         localStorage.setItem('mdm_users', JSON.stringify(currentUsers));
         setUsers(currentUsers); // Triggers re-render
         
         // Optional: Visual Feedback via Alert
         // alert(`User ${userId} has been ${newStatus}.`);
     }
  };

  const handleSuspendToggle = (userId: string) => {
     const currentUsers = [...users];
     const userIndex = currentUsers.findIndex(u => u.id === userId);
     
     let targetUser;
     let isNewEntry = false;

     if (userIndex === -1) {
         const report = reports.find(r => r.reportedUserId === userId);
         targetUser = {
             id: userId,
             name: report?.reportedUser || 'Unknown User',
             email: `user_${userId}@divine.com`,
             status: 'active',
             // ... minimal required fields ...
             avatar: report?.reportedUserAvatar || 'https://ui-avatars.com/api/?name=Unknown',
         };
         isNewEntry = true;
     } else {
         targetUser = { ...currentUsers[userIndex] };
     }

     const isSuspended = targetUser.status === 'suspended';
     const newStatus = isSuspended ? 'active' : 'suspended';
     const actionText = isSuspended ? 'ACTIVATE' : 'SUSPEND';

     if(confirm(`Are you sure you want to ${actionText} user ${userId}?`)) {
         targetUser.status = newStatus;
         
         if (isNewEntry) {
             currentUsers.push(targetUser);
         } else {
             currentUsers[userIndex] = targetUser;
         }
         
         localStorage.setItem('mdm_users', JSON.stringify(currentUsers));
         setUsers(currentUsers);
     }
  };

  const maskAadhaar = (num?: string) => {
      if (!num) return 'N/A';
      if (viewerRole === 'Super Admin') return num.replace(/\d(?=\d{4})/g, "X"); // Mask first 8 digits
      return 'HIDDEN'; // Extra safety
  };

  // Filtering
  const filteredReports = reports.filter(r => {
    const matchesTab = activeTab === 'open' 
        ? (r.status === 'open' || r.status === 'investigating') 
        : r.status === activeTab;
        
    const matchesSearch = r.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const columns: Column<ReportTicket>[] = [
    { key: 'timestamp', label: 'Date & Time', sortable: true, render: (val) => <span className="text-xs font-mono text-gray-500 whitespace-nowrap">{val}</span> },
    { key: 'reporter', label: 'Reporter', render: (_, r) => (
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => openUserProfile(r.reporterId || '', r.reporter, 'https://ui-avatars.com/api/?background=random')}>
            <div className="relative shrink-0">
                <img src={`https://ui-avatars.com/api/?name=${r.reporter}&background=random`} className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-white/10" />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">{r.reporter}</span>
                <span className="text-[10px] text-gray-500">{r.reporterId || 'Guest'}</span>
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); setChatUser(r.reporter); }}
                className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Support Chat"
            >
                <MessageSquare size={12} />
            </button>
        </div>
    )},
    { key: 'reportedUser', label: 'Reported Profile', render: (_, r) => (
       <div className="flex items-center gap-2 group cursor-pointer" onClick={() => openUserProfile(r.reportedUserId, r.reportedUser, r.reportedUserAvatar)}>
          <div className="relative shrink-0">
              <img src={r.reportedUserAvatar} className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-white/10" />
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-red-600 transition-colors">{r.reportedUser}</span>
             <span className="text-[10px] text-gray-500">{r.reportedUserId}</span>
          </div>
          <button 
                onClick={(e) => { e.stopPropagation(); setChatUser(r.reportedUser); }}
                className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Support Chat"
          >
                <MessageSquare size={12} />
          </button>
       </div>
    )},
    { key: 'category', label: 'Type', sortable: true, render: (val) => (
       <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-gray-700 dark:text-gray-300">{val}</span>
    )},
    { key: 'reason', label: 'Reason', render: (val) => (
        <div className="max-w-[150px] truncate text-xs text-gray-500 dark:text-gray-400" title={val as string}>{val}</div>
    )},
    { key: 'id', label: 'Actions', render: (_, r) => {
        // Look up actual user status from the CURRENT users state
        const targetUser = users.find(u => u.id === r.reportedUserId);
        const currentStatus = targetUser ? targetUser.status : 'active';
        
        return (
            <div className="flex gap-2">
                {/* Block Toggle */}
                <button 
                    onClick={(e) => { e.stopPropagation(); handleBlockToggle(r.reportedUserId); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border flex items-center gap-1 min-w-[80px] justify-center ${
                        currentStatus === 'blocked'
                        ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                        : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                    }`}
                >
                    {currentStatus === 'blocked' ? <Unlock size={12} /> : <Ban size={12} />}
                    {currentStatus === 'blocked' ? 'Unblock' : 'Block'}
                </button>
                
                {/* Suspend Toggle */}
                <button 
                    onClick={(e) => { e.stopPropagation(); handleSuspendToggle(r.reportedUserId); }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border flex items-center gap-1 min-w-[85px] justify-center ${
                        currentStatus === 'suspended'
                        ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                        : 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'
                    }`}
                >
                    {currentStatus === 'suspended' ? <Power size={12} /> : <UserX size={12} />}
                    {currentStatus === 'suspended' ? 'Activate' : 'Suspend'}
                </button>
            </div>
        );
    }}
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* 1. Header & KPIs */}
      <div className="flex flex-col md:flex-row gap-6">
          <KpiCard 
             title="Active Reports" value={reports.filter(r => r.status === 'open').length.toString()} trend="+2" icon={<Flag size={24} />} color="red" 
             onClick={() => setActiveTab('open')}
          />
          <KpiCard 
             title="Resolved Today" value="5" trend="+15%" icon={<CheckCircle size={24} />} color="green" 
             onClick={() => setActiveTab('resolved')}
          />
          <KpiCard 
             title="Safe Users" value="98.5%" trend="+0.2%" icon={<Shield size={24} />} color="blue" 
             onClick={() => {}}
          />
      </div>

      {/* 2. Main Report List */}
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
         
         {/* Filter Bar */}
         <div className="p-5 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-white/[0.02]">
            <div className="flex gap-2 bg-gray-200/50 dark:bg-white/5 p-1 rounded-xl">
               {['open', 'resolved', 'dismissed'].map(tab => (
                  <button 
                     key={tab} 
                     onClick={() => setActiveTab(tab as any)}
                     className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${
                        activeTab === tab 
                        ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                     }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            
            <div className="relative w-full md:w-72">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <input 
                  type="text" 
                  placeholder="Search user, ID, reason..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500 transition-colors"
               />
            </div>
         </div>

         {/* Table Area - Container height updated for better visibility and internal scrolling */}
         <div className="flex-1 relative h-[85vh] min-h-[600px] bg-white dark:bg-[#121212] overflow-hidden">
            {filteredReports.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} className="opacity-30" />
                    </div>
                    <p className="font-medium">No {activeTab} reports found.</p>
                </div>
            ) : (
                <AdminTable 
                   data={filteredReports}
                   columns={columns}
                   enableSearch={false}
                   enableExport={false}
                   itemsPerPage={10} 
                />
            )}
         </div>
      </div>

      {/* Profile Viewer Modal */}
      <AnimatePresence>
          {viewingUser && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                  <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-md"
                      onClick={() => setViewingUser(null)}
                  />
                  <motion.div
                      initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
                      className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-[2rem] shadow-2xl overflow-hidden border border-white/10"
                  >
                      <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                          <h3 className="text-lg font-bold">User Profile</h3>
                          <button onClick={() => setViewingUser(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full"><XCircle size={20} /></button>
                      </div>

                      <div className="p-6 space-y-6">
                          <div className="flex items-center gap-4">
                              <img src={viewingUser.avatar} className="w-20 h-20 rounded-full object-cover border-4 border-gray-100 dark:border-white/5" />
                              <div>
                                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{viewingUser.name}</h2>
                                  <p className="text-xs text-gray-500 font-mono">{viewingUser.id}</p>
                                  <div className="mt-2">
                                     <button 
                                        onClick={() => { setViewingUser(null); setChatUser(viewingUser.name); }}
                                        className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                     >
                                        <MessageSquare size={14} /> Start Chat
                                     </button>
                                  </div>
                              </div>
                          </div>
                          
                          {/* Visibility Logic: Super Admin sees everything, Admin limited */}
                          {viewerRole === 'Super Admin' ? (
                              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                  <div className="grid grid-cols-2 gap-4">
                                      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                          <label className="text-[10px] font-bold text-gray-400 uppercase">Email</label>
                                          <p className="text-sm font-bold">{viewingUser.email}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                          <label className="text-[10px] font-bold text-gray-400 uppercase">Mobile</label>
                                          <p className="text-sm font-bold">{viewingUser.mobile}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                          <label className="text-[10px] font-bold text-gray-400 uppercase">Plan</label>
                                          <p className="text-sm font-bold capitalize">{viewingUser.plan}</p>
                                      </div>
                                      <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                          <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                                          <p className={`text-sm font-bold uppercase ${viewingUser.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{viewingUser.status}</p>
                                      </div>
                                      <div className="col-span-2 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-900/30">
                                          <label className="text-[10px] font-bold text-yellow-700 dark:text-yellow-400 uppercase flex items-center gap-1"><Lock size={10} /> Aadhaar Number</label>
                                          <p className="text-sm font-mono font-bold text-yellow-900 dark:text-yellow-100">{maskAadhaar(viewingUser.idNumber)}</p>
                                      </div>
                                  </div>
                              </div>
                          ) : (
                              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-center text-gray-500 text-sm italic">
                                  <Shield size={24} className="mx-auto mb-2 opacity-50" />
                                  Full profile details (Email, Mobile, ID) are restricted to Super Admin.
                                  <br/>
                                  You can only view basic info and chat.
                              </div>
                          )}
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      {/* Chat Modal */}
      <AnimatePresence>
          {chatUser && (
              <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setChatUser(null)} />
                   <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-[#151515] p-6 rounded-2xl shadow-xl w-full max-w-sm text-center relative z-10">
                       <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                           <MessageSquare size={32} />
                       </div>
                       <h3 className="text-lg font-bold mb-2">Chat with {chatUser}</h3>
                       <p className="text-sm text-gray-500 mb-6">Support session initiated. Redirecting to communication center...</p>
                       <button onClick={() => setChatUser(null)} className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold">Open Chat</button>
                   </motion.div>
              </div>
          )}
      </AnimatePresence>

    </div>
  );
};

export default AdminReports;
