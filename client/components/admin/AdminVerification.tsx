

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, CheckCircle, XCircle, AlertTriangle, Eye, ZoomIn, 
  RotateCcw, FileText, User, Camera, Calendar, Clock, Filter, Search,
  ChevronRight, Play, File, ChevronLeft, EyeOff
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';

const AdminVerification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [isAdminSuper, setIsAdminSuper] = useState(false);

  useEffect(() => {
      // Check Admin Role
      const role = localStorage.getItem('mdm_admin_role');
      setIsAdminSuper(role === 'Super Admin');

      const loadData = () => {
          const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
          const reqs = users
              .filter((u: any) => u.verificationStatus && u.verificationStatus !== 'idle')
              .map((u: any) => ({
                  id: u.id,
                  userId: u.id,
                  userName: u.name,
                  docType: u.idType || 'Aadhaar',
                  docNumber: u.idNumber,
                  status: u.verificationStatus,
                  submittedAt: u.submittedAt || 'Today',
                  avatar: u.avatar,
                  images: { front: u.idUrlFront || '', back: u.idUrlBack || '' }
              }));
          setVerifications(reqs);
      };
      loadData();
  }, []);

  const handleApprove = (id: string) => {
    const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
    const updated = users.map((u: any) => {
        if (u.id === id) return { ...u, verificationStatus: 'verified', verified: true, isApproved: true }; // Approve profile visibility too
        return u;
    });
    localStorage.setItem('mdm_users', JSON.stringify(updated));
    alert(`Verified User ${id}`);
    setSelectedReq(null);
  };

  const handleReject = (id: string) => {
    const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
    const updated = users.map((u: any) => {
        if (u.id === id) return { ...u, verificationStatus: 'rejected', verified: false };
        return u;
    });
    localStorage.setItem('mdm_users', JSON.stringify(updated));
    alert(`Rejected User ${id}`);
    setSelectedReq(null);
  };

  const maskAadhaar = (num: string) => {
      if (!num) return '';
      if (isAdminSuper) return num; // Show full to Super Admin
      return num.replace(/\d(?=\d{4})/g, "X"); // Mask first 8 digits
  };

  const filteredData = verifications.filter(item => 
      activeTab === 'pending' ? item.status === 'pending' : (item.status === 'verified' || item.status === 'rejected')
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-fit">
         <button onClick={() => setActiveTab('pending')} className={`px-6 py-2 rounded-lg text-sm font-bold ${activeTab === 'pending' ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}>Pending</button>
         <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-lg text-sm font-bold ${activeTab === 'history' ? 'bg-white shadow text-purple-600' : 'text-gray-500'}`}>History</button>
      </div>

      <div className="flex-1 overflow-y-auto">
         {filteredData.map((item) => (
             <div key={item.id} className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 mb-4 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                     <img src={item.avatar} className="w-12 h-12 rounded-full object-cover" />
                     <div>
                         <h4 className="font-bold text-sm">{item.userName}</h4>
                         <p className="text-xs text-gray-500">{item.docType}</p>
                     </div>
                 </div>
                 <button onClick={() => setSelectedReq(item)} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200">
                     Review
                 </button>
             </div>
         ))}
      </div>

      <AnimatePresence>
        {selectedReq && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between mb-6">
                     <h2 className="text-2xl font-bold">Verification Review</h2>
                     <button onClick={() => setSelectedReq(null)}><XCircle /></button>
                 </div>
                 
                 <div className="grid md:grid-cols-2 gap-8">
                     <div>
                         <div className="bg-gray-100 p-4 rounded-xl mb-4">
                             <p className="text-xs font-bold uppercase text-gray-500">ID Number</p>
                             <div className="text-xl font-mono font-bold flex items-center gap-2">
                                 {maskAadhaar(selectedReq.docNumber)}
                                 {!isAdminSuper && <EyeOff size={16} className="text-gray-400" title="Masked for security" />}
                             </div>
                         </div>
                         <div className="space-y-4">
                             <img src={selectedReq.images.front} className="w-full h-48 object-contain bg-black/5 rounded-xl border" />
                             <img src={selectedReq.images.back} className="w-full h-48 object-contain bg-black/5 rounded-xl border" />
                         </div>
                     </div>
                     <div className="flex flex-col justify-center gap-4">
                         <div className="p-4 bg-blue-50 text-blue-700 text-sm rounded-xl mb-4">
                            <strong>Note:</strong> Ensure name and photo match the profile details.
                         </div>
                         <PremiumButton onClick={() => handleApprove(selectedReq.id)} icon={<CheckCircle />}>Approve Verified</PremiumButton>
                         <button onClick={() => handleReject(selectedReq.id)} className="py-3 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50">Reject ID</button>
                     </div>
                 </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminVerification;
