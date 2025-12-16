
import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Filter, Shield, Clock, MapPin, Download 
} from 'lucide-react';
import { MOCK_GLOBAL_AUDIT_LOGS, GlobalAuditLog } from '../../utils/adminData';
import { AdminTable, Column } from '../ui/AdminTable';

const GlobalAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<GlobalAuditLog[]>(MOCK_GLOBAL_AUDIT_LOGS);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
     // Load persisted logs
     const stored = localStorage.getItem('mdm_super_admin_logs');
     if (stored) {
         setLogs([...JSON.parse(stored), ...MOCK_GLOBAL_AUDIT_LOGS]);
     }
  }, []);

  const filteredLogs = logs.filter(l => 
    l.actorName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<GlobalAuditLog>[] = [
    { key: 'timestamp', label: 'Time (UTC)', sortable: true, render: (val) => <span className="text-xs font-mono text-gray-500">{val}</span> },
    { key: 'actorName', label: 'Admin', sortable: true, render: (_, log) => (
       <div>
          <div className="text-sm font-bold text-white">{log.actorName}</div>
          <div className="text-[10px] text-gray-500">{log.actorRole} • {log.actorId}</div>
       </div>
    )},
    { key: 'action', label: 'Action', sortable: true, render: (val) => <span className="text-sm text-gray-300 font-medium">{val}</span> },
    { key: 'module', label: 'Module', sortable: true, render: (val) => (
       <span className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase font-bold text-gray-400 border border-white/10">{val}</span>
    )},
    { key: 'severity', label: 'Severity', sortable: true, render: (val) => (
       <span className={`text-[10px] font-bold uppercase ${
          val === 'critical' ? 'text-red-500' : val === 'medium' ? 'text-amber-500' : 'text-green-500'
       }`}>
          {val}
       </span>
    )},
    { key: 'ip', label: 'Origin IP', render: (val) => <span className="text-xs font-mono text-gray-500">{val}</span> },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
       
       <div className="flex justify-between items-center bg-[#151621] p-6 rounded-[2rem] border border-white/5">
          <div>
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="text-yellow-500" /> Immutable Audit Trail
             </h2>
             <p className="text-sm text-gray-500 mt-1">Read-only record of all administrative actions.</p>
          </div>
          <button className="px-4 py-2 border border-white/10 rounded-xl text-gray-400 text-sm font-bold hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors">
             <Download size={16} /> Export Logs
          </button>
       </div>

       <div className="flex-1 bg-[#151621] border border-white/5 rounded-[2rem] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex gap-4">
             <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                   type="text" 
                   placeholder="Search by Admin, Action, or Module..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full bg-[#0b0c15] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white outline-none focus:border-yellow-500/50 transition-colors" 
                />
             </div>
             <button className="p-2.5 bg-[#0b0c15] border border-white/10 rounded-xl text-gray-500 hover:text-white transition-colors">
                <Filter size={18} />
             </button>
          </div>
          
          <div className="flex-1 overflow-hidden">
             <AdminTable 
                data={filteredLogs}
                columns={columns}
                enableSearch={false}
                enableExport={false}
             />
          </div>
       </div>
    </div>
  );
};

export default GlobalAuditLogs;
