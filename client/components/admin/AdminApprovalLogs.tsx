
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Search, Filter, Calendar, Clock, User, FileText, Download 
} from 'lucide-react';
import { AdminTable, Column } from '../ui/AdminTable';

interface ApprovalLog {
  id: string;
  adminName: string;
  targetId: string;
  targetName: string;
  action: 'Approved' | 'Rejected';
  type: 'User Registration' | 'ID Verification';
  timestamp: string;
  reason?: string;
}

const AdminApprovalLogs: React.FC = () => {
  const [logs, setLogs] = useState<ApprovalLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
     // Load logs from LocalStorage
     const storedLogs = JSON.parse(localStorage.getItem('mdm_approval_logs') || '[]');
     setLogs(storedLogs);

     // Poll for updates (in case actions happen in other tabs)
     const interval = setInterval(() => {
         const freshLogs = JSON.parse(localStorage.getItem('mdm_approval_logs') || '[]');
         if (freshLogs.length !== logs.length) {
             setLogs(freshLogs);
         }
     }, 3000);

     return () => clearInterval(interval);
  }, [logs.length]);

  const filteredLogs = logs.filter(log => {
      const matchesSearch = log.targetName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            log.targetId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || log.type === filterType;
      return matchesSearch && matchesType;
  });

  const columns: Column<ApprovalLog>[] = [
    { key: 'timestamp', label: 'Date & Time', sortable: true, render: (val) => (
       <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
          <Calendar size={12} /> {val}
       </div>
    )},
    { key: 'action', label: 'Action', sortable: true, render: (val) => (
       <span className={`px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 w-fit ${
          val === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
       }`}>
          {val === 'Approved' ? <CheckCircle size={12} /> : <XCircle size={12} />}
          {val}
       </span>
    )},
    { key: 'type', label: 'Module', sortable: true, render: (val) => (
       <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{val}</span>
    )},
    { key: 'targetName', label: 'Target User', sortable: true, render: (_, log) => (
       <div className="flex flex-col">
          <span className="font-bold text-gray-900 dark:text-white text-sm">{log.targetName}</span>
          <span className="text-[10px] text-gray-500">{log.targetId}</span>
       </div>
    )},
    { key: 'reason', label: 'Details / Reason', render: (val) => (
       <span className="text-xs text-gray-500 italic truncate max-w-[200px] block" title={val as string}>{val}</span>
    )},
    { key: 'adminName', label: 'Admin', render: (val) => (
       <div className="flex items-center gap-1 text-xs text-gray-500">
          <User size={12} /> {val}
       </div>
    )}
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
       
       {/* Header & Controls */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
          <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="text-purple-600" /> Approval Logs
             </h2>
             <p className="text-sm text-gray-500">Audit trail of all administrative decisions.</p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                   type="text" 
                   placeholder="Search Logs..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500"
                />
             </div>
             <div className="relative group">
                <button className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-purple-600">
                   <Filter size={18} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl hidden group-hover:block z-10 p-1">
                   {['all', 'User Registration', 'ID Verification'].map(t => (
                      <button key={t} onClick={() => setFilterType(t)} className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg capitalize hover:bg-gray-100 dark:hover:bg-white/10">
                         {t}
                      </button>
                   ))}
                </div>
             </div>
             <button className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-purple-600">
                <Download size={18} />
             </button>
          </div>
       </div>

       {/* Log Table */}
       <div className="flex-1 overflow-hidden bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm">
          {logs.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Clock size={48} className="mb-4 opacity-20" />
                <p>No approval history found.</p>
             </div>
          ) : (
             <AdminTable 
                data={filteredLogs}
                columns={columns}
                enableSearch={false}
                enableExport={false}
             />
          )}
       </div>

    </div>
  );
};

export default AdminApprovalLogs;
