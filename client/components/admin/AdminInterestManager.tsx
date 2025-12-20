
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, CheckCircle, Clock, XCircle, ArrowRight, User, Star, Check 
} from 'lucide-react';
import { AdminTable, Column } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';

interface RelationshipItem {
    id: string;
    fromUserId: string;
    toUserId: string;
    fromUserName: string;
    toUserName: string;
    fromUserImg: string;
    toUserImg: string;
    status: 'pending_admin' | 'approved_by_admin' | 'accepted_by_user' | 'rejected_by_user' | 'shortlisted_by_admin';
    timestamp: string;
}

const AdminInterestManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'review' | 'tracking' | 'finalize'>('review');
  const [relationships, setRelationships] = useState<RelationshipItem[]>([]);

  useEffect(() => {
     // Load relationships from LocalStorage
     const load = () => {
         const stored = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
         setRelationships(stored);
     };
     load();
     const interval = setInterval(load, 2000);
     return () => clearInterval(interval);
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
     const updated = relationships.map(r => r.id === id ? { ...r, status: newStatus } : r);
     // @ts-ignore
     localStorage.setItem('mdm_relationships', JSON.stringify(updated));
     setRelationships(updated as RelationshipItem[]);
     
     // Log action
     const log = {
         id: `LOG-${Date.now()}`,
         adminName: 'Super Admin',
         targetId: id,
         targetName: 'Interest Request',
         action: newStatus.includes('approved') ? 'Approved' : 'Shortlisted',
         type: 'Interest Workflow',
         timestamp: new Date().toLocaleString(),
         reason: `Changed status to ${newStatus}`
     };
     const existingLogs = JSON.parse(localStorage.getItem('mdm_approval_logs') || '[]');
     localStorage.setItem('mdm_approval_logs', JSON.stringify([log, ...existingLogs]));
  };

  // --- FILTERS ---
  const pendingReviews = relationships.filter(r => r.status === 'pending_admin');
  const trackingItems = relationships.filter(r => r.status === 'approved_by_admin');
  const readyToFinalize = relationships.filter(r => r.status === 'accepted_by_user');

  // --- COLUMNS ---
  const columns: Column<RelationshipItem>[] = [
    { key: 'fromUserName', label: 'Sender', render: (_, r) => (
       <div className="flex items-center gap-3">
          <img src={r.fromUserImg} className="w-8 h-8 rounded-full object-cover" />
          <div className="text-sm font-bold">{r.fromUserName}</div>
       </div>
    )},
    { key: 'id', label: 'Match', render: () => (
       <div className="text-purple-300 font-bold px-2">→</div>
    )},
    { key: 'toUserName', label: 'Receiver', render: (_, r) => (
       <div className="flex items-center gap-3">
          <img src={r.toUserImg} className="w-8 h-8 rounded-full object-cover" />
          <div className="text-sm font-bold">{r.toUserName}</div>
       </div>
    )},
    { key: 'timestamp', label: 'Time', render: (val) => <span className="text-xs text-gray-500">{val}</span> },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
       
       {/* HEADER */}
       <div className="flex justify-between items-center bg-white dark:bg-[#121212] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
          <div>
             <h2 className="text-2xl font-bold flex items-center gap-2"><Heart className="text-pink-500" /> Interest Workflow</h2>
             <p className="text-sm text-gray-500">Manage user interest requests and finalize matches.</p>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
             <button onClick={() => setActiveTab('review')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'review' ? 'bg-white dark:bg-gray-800 shadow text-purple-600' : 'text-gray-500'}`}>
                Review ({pendingReviews.length})
             </button>
             <button onClick={() => setActiveTab('tracking')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'tracking' ? 'bg-white dark:bg-gray-800 shadow text-purple-600' : 'text-gray-500'}`}>
                Tracking ({trackingItems.length})
             </button>
             <button onClick={() => setActiveTab('finalize')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'finalize' ? 'bg-white dark:bg-gray-800 shadow text-purple-600' : 'text-gray-500'}`}>
                Finalize ({readyToFinalize.length})
             </button>
          </div>
       </div>

       {/* CONTENT */}
       <div className="flex-1 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
          
          {activeTab === 'review' && (
             <div className="flex-1 overflow-hidden">
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300 text-sm font-bold border-b border-amber-100 dark:border-amber-900/30 flex items-center gap-2">
                   <Clock size={16} /> Pending Admin Approval: User A wants to connect with User B.
                </div>
                <AdminTable 
                   data={pendingReviews}
                   columns={columns}
                   actions={(r) => (
                      <div className="flex gap-2">
                         <button 
                            onClick={() => updateStatus(r.id, 'approved_by_admin')}
                            className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 flex items-center gap-1"
                         >
                            <CheckCircle size={12} /> Approve to User
                         </button>
                         <button className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200">Reject</button>
                      </div>
                   )}
                />
             </div>
          )}

          {activeTab === 'tracking' && (
             <div className="flex-1 overflow-hidden">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 text-sm font-bold border-b border-blue-100 dark:border-blue-900/30 flex items-center gap-2">
                   <ArrowRight size={16} /> Awaiting User Acceptance: Interest sent to receiver. Waiting for them to accept.
                </div>
                <AdminTable 
                   data={trackingItems}
                   columns={columns}
                   actions={() => <span className="text-xs text-gray-400 italic">Waiting for Receiver...</span>}
                />
             </div>
          )}

          {activeTab === 'finalize' && (
             <div className="flex-1 overflow-hidden">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 text-sm font-bold border-b border-purple-100 dark:border-purple-900/30 flex items-center gap-2">
                   <Star size={16} /> Mutual Interest Confirmed: Both users accepted. Ready to Shortlist/Pair.
                </div>
                <AdminTable 
                   data={readyToFinalize}
                   columns={columns}
                   actions={(r) => (
                      <PremiumButton 
                         onClick={() => updateStatus(r.id, 'shortlisted_by_admin')}
                         className="!py-1.5 !px-3 !text-xs !rounded-lg"
                         icon={<Check size={12} />}
                      >
                         Finalize Shortlist
                      </PremiumButton>
                   )}
                />
             </div>
          )}

       </div>
    </div>
  );
};

export default AdminInterestManager;
