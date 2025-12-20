
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, TrendingUp, DollarSign, Calendar, Search, Filter, 
  CheckCircle, XCircle, AlertCircle, Download, MoreHorizontal, 
  RefreshCw, RotateCcw, Crown, ChevronRight, PieChart, ShieldCheck
} from 'lucide-react';
import { AdminTable, Column } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';
import { KpiCard } from './AdminWidgets';
import { MOCK_TRANSACTIONS, Transaction } from '../../utils/adminData';

const AdminPayments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [activeAction, setActiveAction] = useState<'refund' | 'cancel' | 'grant' | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load Transactions from LocalStorage
  useEffect(() => {
      const loadTransactions = () => {
          const storedTxns = JSON.parse(localStorage.getItem('mdm_transactions') || '[]');
          
          // Combine persistent store with static mocks for demo population
          // We prioritize stored transactions (newer ones) at the top
          const combined = [...storedTxns, ...MOCK_TRANSACTIONS];
          
          // Simple deduplication based on ID
          const seen = new Set();
          const uniqueTxns = combined.filter(item => {
             const duplicate = seen.has(item.id);
             seen.add(item.id);
             return !duplicate;
          });
          
          setTransactions(uniqueTxns);
      };
      
      loadTransactions();
      const interval = setInterval(loadTransactions, 2000); // Polling for updates
      return () => clearInterval(interval);
  }, []);

  // Filter Data
  const filteredData = transactions.filter(t => {
    const matchesSearch = t.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleAction = () => {
    if (activeAction === 'grant') {
        alert(`Access granted for ${selectedTxn?.plan} Plan to ${selectedTxn?.userName}`);
    } else {
        alert(`${activeAction === 'refund' ? 'Refund initiated' : 'Subscription cancelled'} for ${selectedTxn?.id}`);
    }
    setSelectedTxn(null);
    setActiveAction(null);
  };

  const columns: Column<Transaction>[] = [
    { key: 'id', label: 'Transaction ID', sortable: true, render: (val) => <span className="font-mono text-xs text-gray-500">{val}</span> },
    { key: 'userName', label: 'User', sortable: true, render: (_, t) => (
       <div className="flex items-center gap-3">
          <img src={t.userAvatar} className="w-8 h-8 rounded-full object-cover" />
          <div>
             <div className="font-bold text-gray-900 dark:text-white text-sm">{t.userName}</div>
             <div className="text-[10px] text-gray-500">{t.userId}</div>
          </div>
       </div>
    )},
    { key: 'plan', label: 'Plan', sortable: true, render: (val) => (
       <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
          ${val === 'Platinum' ? 'bg-slate-100 text-slate-700 border border-slate-300' : 
            val === 'Diamond' ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' : 
            val === 'Gold' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-gray-100 text-gray-500'}
       `}>
          {val}
       </span>
    )},
    { key: 'amount', label: 'Amount', sortable: true, render: (val) => <span className="font-bold text-gray-900 dark:text-white">{val}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (val) => {
       const status = val.toLowerCase();
       return (
       <span className={`flex items-center gap-1 text-xs font-bold capitalize
          ${status === 'success' ? 'text-green-600' : status === 'failed' ? 'text-red-600' : 'text-amber-600'}
       `}>
          {status === 'success' ? <CheckCircle size={14} /> : status === 'failed' ? <XCircle size={14} /> : <RotateCcw size={14} />}
          {val}
       </span>
       );
    }},
    { key: 'date', label: 'Date', sortable: true, render: (val) => <span className="text-xs text-gray-500">{val}</span> },
    { key: 'method', label: 'Method', render: (val) => <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">{val}</span> }
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
         <KpiCard title="Total Revenue" value="₹45.2L" trend="+12.5%" icon={<DollarSign size={24} />} color="bg-green-500" />
         <KpiCard title="Active Subs" value="3,210" trend="+5.2%" icon={<Crown size={24} />} color="bg-purple-500" />
         <KpiCard title="Avg. Order Value" value="₹5,400" trend="+1.2%" icon={<TrendingUp size={24} />} color="bg-blue-500" />
         <KpiCard title="Refund Rate" value="0.4%" trend="-0.1%" icon={<RotateCcw size={24} />} color="bg-amber-500" />
      </div>

      {/* Transactions Table Section - Graphs Removed */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm overflow-hidden">
         {/* Controls */}
         <div className="p-5 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
            <h3 className="font-bold text-lg flex items-center gap-2">
               <CreditCard size={20} className="text-purple-600" /> Transaction History
            </h3>
            
            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                     type="text" 
                     placeholder="Search Transaction ID or User..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500"
                  />
               </div>
               <div className="relative group">
                  <button className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-purple-600">
                     <Filter size={18} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl hidden group-hover:block z-10 p-1">
                     {['all', 'success', 'pending', 'failed', 'refunded'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)} className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg capitalize hover:bg-gray-100 dark:hover:bg-white/10">
                           {s}
                        </button>
                     ))}
                  </div>
               </div>
               <button className="p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-500 hover:text-purple-600">
                  <Download size={18} />
               </button>
            </div>
         </div>

         {/* Table */}
         <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 relative">
            <AdminTable 
               data={filteredData}
               columns={columns}
               enableSearch={false} // Handled externally
               enableExport={false}
               actions={(item) => (
                  <div className="p-2 space-y-1 min-w-[140px]">
                     <button 
                        onClick={() => setSelectedTxn(item)} 
                        className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded flex items-center gap-2"
                     >
                        <AlertCircle size={14} /> Manage
                     </button>
                     <button className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded flex items-center gap-2">
                        <Download size={14} /> Invoice
                     </button>
                  </div>
               )}
            />
         </div>
      </div>

      {/* Action Modal */}
      <AnimatePresence>
         {selectedTxn && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  onClick={() => { setSelectedTxn(null); setActiveAction(null); }}
               />
               <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden"
               >
                  {!activeAction ? (
                     <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <h3 className="font-bold text-lg">Manage Subscription</h3>
                              <p className="text-xs text-gray-500">Transaction #{selectedTxn.id}</p>
                           </div>
                           <button onClick={() => setSelectedTxn(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><XCircle size={20} /></button>
                        </div>

                        <div className="space-y-4 mb-6">
                           <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                              <img src={selectedTxn.userAvatar} className="w-10 h-10 rounded-full" />
                              <div>
                                 <p className="font-bold text-sm">{selectedTxn.userName}</p>
                                 <p className="text-xs text-gray-500">{selectedTxn.plan} Member</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 border rounded-xl">
                                 <p className="text-[10px] uppercase text-gray-500 font-bold">Amount</p>
                                 <p className="font-bold">{selectedTxn.amount}</p>
                              </div>
                              <div className="p-3 border rounded-xl">
                                 <p className="text-[10px] uppercase text-gray-500 font-bold">Expires</p>
                                 <p className="font-bold text-green-600">{selectedTxn.expiryDate}</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-3">
                           <div className="grid grid-cols-2 gap-3">
                              <button 
                                 onClick={() => setActiveAction('refund')}
                                 className="py-3 border border-red-200 text-red-600 font-bold text-sm rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                              >
                                 <RotateCcw size={16} /> Refund
                              </button>
                              <button 
                                 onClick={() => setActiveAction('cancel')}
                                 className="py-3 border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                              >
                                 <XCircle size={16} /> Cancel Sub
                              </button>
                           </div>
                           
                           {/* Plan Grant Action */}
                           <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                               <p className="text-xs font-bold uppercase text-gray-500 mb-2">Plan Provisioning</p>
                               <button 
                                  onClick={() => setActiveAction('grant')}
                                  className="w-full py-3 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                               >
                                  <ShieldCheck size={16} /> Grant {selectedTxn.plan} Access
                               </button>
                               <p className="text-[10px] text-gray-400 mt-2 text-center">Manually override plan status for this user.</p>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="p-6 text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${activeAction === 'grant' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                           {activeAction === 'grant' ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                        </div>
                        <h3 className="font-bold text-lg mb-2">
                            {activeAction === 'grant' ? `Enable ${selectedTxn.plan} Access?` : `Confirm ${activeAction === 'refund' ? 'Refund' : 'Cancellation'}?`}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                           {activeAction === 'grant' 
                              ? "The user will immediately receive all benefits associated with this plan." 
                              : "This action cannot be undone. The user will be notified immediately via email."}
                        </p>
                        <div className="flex gap-3">
                           <button onClick={() => setActiveAction(null)} className="flex-1 py-2 font-bold text-sm text-gray-500 hover:bg-gray-100 rounded-xl">Back</button>
                           <button 
                                onClick={handleAction} 
                                className={`flex-1 py-2 font-bold text-sm text-white rounded-xl shadow-lg ${activeAction === 'grant' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                           >
                               Confirm
                           </button>
                        </div>
                     </div>
                  )}
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default AdminPayments;
