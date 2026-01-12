import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, AlertTriangle, Search, Mail, Phone, Calendar, 
  MapPin, Shield, Lock, Eye, RefreshCw, Copy, Check, Send, Filter, Users, Key,
  Briefcase, Heart, Home, Coffee, BookOpen, FileText, Download, Crown, Edit3,
  Ruler, Globe, Sun, Moon, ExternalLink, CreditCard, DollarSign, Activity, MessageSquare, Headphones, List, User, X,
  Printer, Upload, Image as ImageIcon
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { MOCK_COMMUNICATION_LOGS, MOCK_TICKETS } from '../../utils/adminData';
import { RAASI_LIST } from '../../constants';
import axios from 'axios';


interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  plan: 'free' | 'gold' | 'diamond' | 'platinum';
  joinedDate: string;
  verified: boolean;
  avatar: string;
  requiresReset?: boolean;
  resetCompleted?: boolean;
  password?: string;
  
  // Verification Fields
  verificationStatus?: 'idle' | 'pending' | 'under_review' | 'verified' | 'rejected';
  idType?: string;
  idNumber?: string;
  idUrlFront?: string;
  idUrlBack?: string;

  // Identity & Location
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  motherTongue?: string;
  address?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  // Religious & Horoscope
  religion?: string;
  caste?: string;
  subCaste?: string;
  gothram?: string;
  dosham?: string;
  raasi?: string;
  nakshatra?: string;
  star?: string;
  lagnam?: string;
  poorviham?: string; // Native
  kulaDeivam?: string;
  timeOfBirth?: string;
  placeOfBirth?: string;

  // Physical
  height?: string;
  weight?: string;
  bodyType?: string;
  complexion?: string;
  physicalStatus?: string;

  // Career & Employment
  education?: string;
  college?: string;
  occupation?: string; 
  employmentStatus?: string;
  employmentCategory?: string; 
  company?: string; 
  designation?: string;
  workType?: string;
  income?: string; 
  monthlySalary?: string;
  officialAddress?: string;
  
  // Govt Specific
  govtType?: string;
  department?: string;
  post?: string;

  // Family
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string; 
  motherOccupation?: string; 
  fatherMobile?: string;
  fatherEmail?: string;
  motherMobile?: string;
  motherEmail?: string;
  siblings?: string; 
  siblingsDetails?: { name: string; gender: string; occupation: string; maritalStatus: string }[];
  familyType?: string;
  familyValues?: string;
  nativePlace?: string;

  // Lifestyle
  diet?: string;
  smoking?: string;
  drinking?: string;
  hobbies?: string[] | string;
  skills?: string;
  extraCurricular?: string;
  wakeUpTime?: string;
  sleepTime?: string;
  about?: string; 
  
  // Uploads
  photos?: string[]; 
  horoscopeFile?: string;
  bioDataFile?: string;
  bioDataText?: string;
  familyPhoto?: string;
  
  profileScore?: number; 
}

interface AdminUserManagementProps {
    initialTab?: 'pending' | 'all';
    lockTab?: boolean;
}

const AdminUserManagement: React.FC<AdminUserManagementProps> = ({ initialTab = 'pending', lockTab = false }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [generatedCreds, setGeneratedCreds] = useState<{username: string, pass: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>(initialTab);
  
  // Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
      gender: 'all',
      religion: 'all',
      caste: '',
      raasi: 'all',
      location: '',
      occupation: '',
      minScore: 0
  });
  
  // Modal Tab State
  const [modalTab, setModalTab] = useState<'profile' | 'activity' | 'interactions' | 'messages' | 'support' | 'finance'>('profile');
  const [editingPlan, setEditingPlan] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const loadRealUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/v1/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setUsers(response.data.data);
          console.log("Successfully loaded users from MySQL Database");
        }
      } catch (err) {
        console.error("Failed to load users from DB", err);
      }
    };

    loadRealUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
      let matchesTab = true;
      if (activeTab === 'pending') {
          matchesTab = u.status === 'pending';
      }

      const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (u.mobile && u.mobile.includes(searchTerm));

      
      let matchesAdvanced = true;
      if (showFilters) {
          if (filters.gender !== 'all' && u.gender?.toLowerCase() !== filters.gender.toLowerCase()) matchesAdvanced = false;
          if (filters.religion !== 'all' && u.religion?.toLowerCase() !== filters.religion.toLowerCase()) matchesAdvanced = false;
          if (filters.raasi !== 'all' && u.raasi?.toLowerCase() !== filters.raasi.toLowerCase()) matchesAdvanced = false;
          if (filters.caste && !u.caste?.toLowerCase().includes(filters.caste.toLowerCase())) matchesAdvanced = false;
          if (filters.location && !u.location?.toLowerCase().includes(filters.location.toLowerCase())) matchesAdvanced = false;
          if (filters.occupation && !u.occupation?.toLowerCase().includes(filters.occupation.toLowerCase())) matchesAdvanced = false;
          if (filters.minScore > 0 && (u.profileScore || 0) < filters.minScore) matchesAdvanced = false;
      }

      return matchesTab && matchesSearch && matchesAdvanced;
  });

  const clearFilters = () => {
      setFilters({
          gender: 'all', religion: 'all', caste: '', raasi: 'all', location: '', occupation: '', minScore: 0
      });
      setSearchTerm('');
  };

  
  const logApprovalAction = (action: 'Approved' | 'Rejected', user: AdminUser, type: string) => {
      const newLog = {
          id: `LOG-${Date.now()}`,
          adminName: localStorage.getItem('mdm_admin_name') || 'Admin',
          targetId: user.id,
          targetName: user.name,
          action: action,
          type: type,
          timestamp: new Date().toLocaleString(),
          reason: action === 'Approved' ? 'Manual Verification' : 'Criteria not met'
      };
      const existingLogs = JSON.parse(localStorage.getItem('mdm_approval_logs') || '[]');
      localStorage.setItem('mdm_approval_logs', JSON.stringify([newLog, ...existingLogs]));
  };

  const handleApprove = async () => {
      if (!selectedUser) return;
      setIsProcessing(true);

      try {
          const token = localStorage.getItem('token');
          const response = await axios.patch(`http://localhost:5000/api/v1/users/status/${selectedUser.id}`, 
            { status: 'active' },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success) {

              setGeneratedCreds({ 
                username: selectedUser.email, 
                pass: response.data.temporaryPassword || 'Check DB' 
              });
              
              const stored = localStorage.getItem('mdm_users');
              if (stored) {
                  setUsers(JSON.parse(stored));
              }
              logApprovalAction('Approved', selectedUser, 'User Registration');
          }
      } catch (error) {
          alert("Failed to approve user in database");
      } finally {
          setIsProcessing(false);
      }
  };
  
  const handleUpdatePlan = (newPlan: 'free' | 'gold' | 'diamond' | 'platinum') => {
      if (!selectedUser) return;
      const updatedUsers = users.map(u => {
          if (u.id === selectedUser.id) {
              return { ...u, plan: newPlan };
          }
          return u;
      });
      localStorage.setItem('mdm_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      setSelectedUser({ ...selectedUser, plan: newPlan });
      setEditingPlan(false);
      alert(`User plan updated to ${newPlan.toUpperCase()}`);
  };
  

  const handleVerifyId = () => {
      if (!selectedUser) return;
      if (window.confirm(`Approve ${selectedUser.idType} for ${selectedUser.name}?`)) {
          const updatedUsers = users.map(u => {
              if (u.id === selectedUser.id) {
                  return { ...u, verificationStatus: 'verified' as const, verified: true };
              }
              return u;
          });
          localStorage.setItem('mdm_users', JSON.stringify(updatedUsers));
          
          // Log ID Verification
          logApprovalAction('Approved', selectedUser, 'ID Verification');

          setUsers(updatedUsers);
          alert("ID Verified Successfully! User notified.");
      }
  };

  const handleRejectId = () => {
      if (!selectedUser) return;
      if (window.confirm(`Reject ID verification for ${selectedUser.name}?`)) {
          const updatedUsers = users.map(u => {
              if (u.id === selectedUser.id) {
                  return { ...u, verificationStatus: 'rejected' as const, verified: false };
              }
              return u;
          });
          localStorage.setItem('mdm_users', JSON.stringify(updatedUsers));
          
          // Log ID Rejection
          logApprovalAction('Rejected', selectedUser, 'ID Verification');

          setUsers(updatedUsers);
          alert("ID Rejected. User will be asked to re-upload.");
      }
  };

  const handleReject = async (e?: React.MouseEvent) => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (!selectedUser) return;
      
      if (window.confirm(`Reject application for ${selectedUser.name}?`)) {
          try {
              const token = localStorage.getItem('token');
              await axios.patch(`http://localhost:5000/api/v1/users/status/${selectedUser.id}`, 
                { status: 'rejected' },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              
              const stored = localStorage.getItem('mdm_users');
              if (stored) {
                  setUsers(JSON.parse(stored));
              }
              setSelectedUser(null);
              logApprovalAction('Rejected', selectedUser, 'User Registration');
          } catch (error) {
              alert("Error updating status in DB");
          }
      }
  };

  const handleCloseModal = () => {
      setSelectedUser(null);
      setGeneratedCreds(null);
      setEditingPlan(false);
      setModalTab('profile');
  };
  
  
  const getUserTransactions = () => {
     if (!selectedUser) return [];
     const allTxns = JSON.parse(localStorage.getItem('mdm_transactions') || '[]');
     return allTxns.filter((t: any) => t.userId === selectedUser.id);
  };

  const getUserActivity = () => {
     const activities = [
        { type: 'Login', desc: 'User logged in', time: '2 hours ago' },
        { type: 'Update', desc: 'Updated horoscope details', time: 'Yesterday' },
        { type: 'Plan', desc: `Viewed Membership Plans`, time: '3 days ago' }
     ];
     return activities;
  };
  
  const getViewedProfiles = () => {
      if (!selectedUser) return [];
      const otherUsers = users.filter(u => u.id !== selectedUser.id);
      const viewed = otherUsers.slice(0, 5).map((u, i) => ({
          ...u,
          viewedAt: `${i + 2} hours ago`
      }));
      return viewed;
  };

  const getUserInteractions = () => {
      return MOCK_COMMUNICATION_LOGS.filter(l => (l.senderId === selectedUser?.id || l.receiverId === selectedUser?.id) && l.type === 'interest');
  };

  const getUserMessages = () => {
      return MOCK_COMMUNICATION_LOGS.filter(l => (l.senderId === selectedUser?.id || l.receiverId === selectedUser?.id) && l.type === 'chat');
  };

  const getUserTickets = () => {
      const tickets = JSON.parse(localStorage.getItem('mdm_support_tickets') || '[]');
      const mockTickets = MOCK_TICKETS;
      const all = [...tickets, ...mockTickets];
      return all.filter((t: any) => t.userId === selectedUser?.id || t.user === selectedUser?.name);
  };
  
  // --- PDF GENERATION ---
  const generatePDF = async () => {
      if (!reportRef.current || !window.html2canvas) {
          alert("Report Generator is initializing. Please try again.");
          return;
      }
      try {
          const canvas = await window.html2canvas(reportRef.current, { scale: 2, useCORS: true, allowTaint: true });
          const imgData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `BioData_${selectedUser.name.replace(/\s/g, '_')}_${selectedUser.id}.png`; 
          link.click();
      } catch (err) {
          console.error(err);
          alert("Failed to generate report.");
      }
  };

  // Helper for displaying fields
  const DetailRow = ({ label, value, icon, fullWidth = false, className = '' }: { label: string, value?: string | number, icon?: React.ReactNode, fullWidth?: boolean, className?: string }) => (
      <div className={`flex flex-col ${fullWidth ? 'col-span-full' : ''}`}>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              {icon} {label}
          </label>
          <div className={`text-sm font-medium text-gray-900 dark:text-gray-200 break-words whitespace-pre-wrap ${className}`}>
              {value || '-'}
          </div>
      </div>
  );

  const SectionHeader = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-white/5 pb-2 mb-4 mt-6 first:mt-0">
          <span className="text-purple-600 dark:text-gold-400">{icon}</span>
          <h4 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">{title}</h4>
      </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
       {/* Top Bar with Filters */}
       <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm space-y-4 shrink-0">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-full md:w-auto shrink-0">
                {lockTab ? (
                     <div className="px-6 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm flex items-center justify-center gap-2">
                        {activeTab === 'pending' ? 'New Accounts' : 'User Database'}
                        {activeTab === 'pending' && users.filter(u => u.status === 'pending').length > 0 && (
                            <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] min-w-[20px] text-center">{users.filter(u => u.status === 'pending').length}</span>
                        )}
                     </div>
                ) : (
                    <>
                        <button 
                            onClick={() => setActiveTab('pending')}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'pending' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            New Accounts
                            {users.filter(u => u.status === 'pending').length > 0 && (
                                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded-full text-[10px] min-w-[20px] text-center">{users.filter(u => u.status === 'pending').length}</span>
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('all')}
                            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                        >
                            User Database
                        </button>
                    </>
                )}
              </div>
              
              <div className="flex gap-2 w-full">
                 <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search Name, ID, Phone..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors"
                    />
                 </div>
                 <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2.5 rounded-xl border transition-colors flex items-center gap-2 text-sm font-bold ${showFilters ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 text-purple-700' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                 >
                    <Filter size={16} /> Filters
                 </button>
              </div>
          </div>

          {/* ADVANCED FILTER PANEL */}
          <AnimatePresence>
             {showFilters && (
                <motion.div 
                   initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden"
                >
                   <div className="pt-4 border-t border-gray-100 dark:border-white/5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* ... Filters UI ... */}
                      <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-gray-400">Gender</label><select value={filters.gender} onChange={(e) => setFilters(prev => ({...prev, gender: e.target.value}))} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none"><option value="all">All</option><option value="male">Groom</option><option value="female">Bride</option></select></div>
                      <div className="space-y-1"><label className="text-[10px] uppercase font-bold text-gray-400">Religion</label><select value={filters.religion} onChange={(e) => setFilters(prev => ({...prev, religion: e.target.value}))} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-2 text-sm outline-none"><option value="all">All</option><option value="Hindu">Hindu</option><option value="Christian">Christian</option><option value="Muslim">Muslim</option></select></div>
                      <div className="flex items-end"><button onClick={clearFilters} className="w-full py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">Reset Filters</button></div>
                   </div>
                </motion.div>
             )}
          </AnimatePresence>
       </div>

       {/* Grid Content */}
       <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
          <AnimatePresence>
             {filteredUsers.length === 0 ? (
                 <div className="col-span-full py-20 text-center text-gray-400 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4"><Users size={32} className="opacity-40" /></div>
                    <p className="text-lg font-medium">No {activeTab === 'pending' ? 'pending requests' : 'active users'} found</p>
                 </div>
             ) : (
                 filteredUsers.map((user) => (
                    <motion.div 
                       layout
                       key={user.id}
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       onClick={() => setSelectedUser(user)}
                       className="group bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden h-[180px] flex flex-col justify-between"
                    >
                       <div className={`absolute top-0 left-0 w-1.5 h-full ${user.status === 'pending' ? 'bg-amber-500' : user.status === 'rejected' ? 'bg-red-500' : 'bg-green-500'}`} />
                       <div className="flex justify-between items-start mb-2 pl-3">
                          <div className="flex items-center gap-3">
                             <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover border border-gray-100 dark:border-white/10" />
                             <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[120px]">{user.name}</h3>
                                <p className="text-xs text-gray-500 font-mono">{user.id}</p>
                             </div>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${user.status === 'pending' ? 'bg-amber-100 text-amber-700' : user.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{user.status}</span>
                       </div>
                       <div className="space-y-2 pl-3 mb-2 flex-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><Mail size={12} /> <span className="truncate max-w-[180px]">{user.email}</span></div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"><Phone size={12} /> {user.mobile}</div>
                       </div>
                       <div className="pl-3 pt-2 border-t border-gray-100 dark:border-white/5 flex justify-end mt-auto">
                           <span className="text-xs font-bold text-purple-600 group-hover:underline flex items-center gap-1 transition-all group-hover:translate-x-1">View Details <Eye size={12} /></span>
                       </div>
                    </motion.div>
                 ))
             )}
          </AnimatePresence>
         </div>
       </div>

       {/* Approval / Details Modal */}
       <AnimatePresence>
          {selectedUser && (
             <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div 
                   initial={{ scale: 0.95, y: 20, opacity: 0 }} 
                   animate={{ scale: 1, y: 0, opacity: 1 }}
                   exit={{ scale: 0.95, y: 20, opacity: 0 }}
                   className="bg-white dark:bg-[#1a1a1a] w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 h-[90vh] flex flex-col"
                >
                   {/* Modal Header */}
                   <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center shrink-0">
                      <div>
                         <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {generatedCreds ? 'Account Approved' : 'User Profile Details'}
                         </h2>
                         <p className="text-sm text-gray-500 flex items-center gap-2">
                             ID: <span className="font-mono">{selectedUser.id}</span>
                         </p>
                      </div>
                      <div className="flex gap-2">
                         {!generatedCreds && (
                            <button onClick={generatePDF} className="px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-xl text-xs font-bold hover:bg-gray-200 flex items-center gap-2">
                               <Printer size={16} /> Generate Report
                            </button>
                         )}
                         <button onClick={handleCloseModal} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                            <XCircle size={24} className="text-gray-400 hover:text-gray-600 dark:hover:text-white" />
                         </button>
                      </div>
                   </div>

                   <div className="flex-1 overflow-hidden flex flex-col">
                      {/* ... (Existing modal content logic remains identical to previous snippet) ... */}
                      {!generatedCreds ? (
                         <>
                            {/* Tab Navigation */}
                            <div className="px-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#1a1a1a]">
                               <div className="flex gap-4 overflow-x-auto custom-scrollbar">
                                  {[{ id: 'profile', label: 'Profile & Bio', icon: User }, { id: 'activity', label: 'Activity Logs', icon: Activity }, { id: 'interactions', label: 'Interactions', icon: Heart }, { id: 'messages', label: 'Messages', icon: MessageSquare }, { id: 'support', label: 'Support History', icon: Headphones }, { id: 'finance', label: 'Transactions', icon: DollarSign }].map(tab => (
                                     <button key={tab.id} onClick={() => setModalTab(tab.id as any)} className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${modalTab === tab.id ? 'border-purple-600 text-purple-600 dark:text-purple-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                                        <tab.icon size={16} /> {tab.label}
                                     </button>
                                  ))}
                               </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                               
                               {/* 1. PROFILE TAB (Enhanced) */}
                               {modalTab === 'profile' && (
                                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                     {/* Basic Identity & Status */}
                                     <div className="flex flex-col md:flex-row items-start gap-8">
                                        <div className="shrink-0">
                                            <img src={selectedUser.avatar} className="w-32 h-32 rounded-3xl object-cover shadow-lg border-4 border-white dark:border-white/5" />
                                            <div className="mt-4 flex flex-col gap-2">
                                                <span className={`text-xs font-bold text-center py-1 rounded-lg uppercase ${selectedUser.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{selectedUser.verified ? 'Verified' : 'Unverified'}</span>
                                                <span className={`text-xs font-bold text-center py-1 rounded-lg uppercase ${selectedUser.status === 'active' ? 'bg-blue-100 text-blue-700' : selectedUser.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{selectedUser.status}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full space-y-6">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                                                <DetailRow label="Full Name" value={selectedUser.name} icon={<User size={12}/>} />
                                                <DetailRow label="Role" value={selectedUser.role} />
                                                <DetailRow label="Mobile" value={selectedUser.mobile} icon={<Phone size={12}/>} />
                                                <DetailRow label="Email" value={selectedUser.email} icon={<Mail size={12}/>} />
                                                <div className="col-span-full h-px bg-gray-200 dark:bg-white/5 my-2" />
                                                <DetailRow label="DOB" value={selectedUser.dob} icon={<Calendar size={12}/>} />
                                                <DetailRow label="Gender" value={selectedUser.gender} />
                                                <DetailRow label="Marital Status" value={selectedUser.maritalStatus} />
                                                <DetailRow label="Mother Tongue" value={selectedUser.motherTongue} icon={<Globe size={12}/>} />
                                            </div>

                                            <div className="bg-white dark:bg-black/20 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                                                <SectionHeader title="Location & Contact" icon={<MapPin size={18} />} />
                                                <div className="grid grid-cols-3 gap-6">
                                                    <DetailRow label="Address" value={selectedUser.address} fullWidth />
                                                    <DetailRow label="City" value={selectedUser.city} />
                                                    <DetailRow label="State" value={selectedUser.state} />
                                                    <DetailRow label="Country" value={selectedUser.country} />
                                                    <DetailRow label="Pincode" value={selectedUser.pincode} />
                                                    <DetailRow label="District" value={selectedUser.district} />
                                                </div>
                                            </div>
                                            
                                            {/* Plan Edit */}
                                            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-white/5">
                                                <div>
                                                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Current Membership</p>
                                                    <div className="flex items-center gap-2">
                                                        <Crown size={18} className="text-purple-600" />
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white capitalize">{selectedUser.plan} Plan</span>
                                                    </div>
                                                </div>
                                                {editingPlan ? (
                                                    <select className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-bold outline-none" value={selectedUser.plan} onChange={(e) => handleUpdatePlan(e.target.value as any)} onBlur={() => setEditingPlan(false)} autoFocus>
                                                        <option value="free">Free</option><option value="gold">Gold</option><option value="diamond">Diamond</option><option value="platinum">Platinum</option>
                                                    </select>
                                                ) : (
                                                    <button onClick={() => setEditingPlan(true)} className="px-4 py-2 bg-white dark:bg-white/10 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-200 hover:text-purple-600 hover:shadow-sm transition-all flex items-center gap-2"><Edit3 size={14} /> Change Plan</button>
                                                )}
                                            </div>
                                        </div>
                                     </div>

                                     {/* Expanded Sections */}
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                         {/* Professional */}
                                         <div className="bg-white dark:bg-black/20 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                                            <SectionHeader title="Education & Career" icon={<Briefcase size={18} />} />
                                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                               <DetailRow label="Education" value={selectedUser.education} icon={<BookOpen size={12} />} />
                                               <DetailRow label="Occupation" value={selectedUser.occupation} />
                                               <DetailRow label="Employment Type" value={`${selectedUser.employmentStatus} - ${selectedUser.employmentCategory}`} />
                                               <DetailRow label="Company" value={selectedUser.company} />
                                               <DetailRow label="Designation" value={selectedUser.designation || selectedUser.post} />
                                               <DetailRow label="Annual Income" value={selectedUser.income || selectedUser.annualSalary} icon={<span className="text-xs">₹</span>} />
                                               {selectedUser.officialAddress && <DetailRow label="Official Address" value={selectedUser.officialAddress} fullWidth />}
                                            </div>
                                         </div>

                                         {/* Horoscope */}
                                         <div className="bg-white dark:bg-black/20 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                                            <SectionHeader title="Religious & Horoscope" icon={<Moon size={18} />} />
                                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                               <DetailRow label="Religion" value={selectedUser.religion} />
                                               <DetailRow label="Caste / SubCaste" value={`${selectedUser.caste} ${selectedUser.subCaste ? `(${selectedUser.subCaste})` : ''}`} />
                                               <DetailRow label="Gothram" value={selectedUser.gothram} />
                                               <DetailRow label="Raasi" value={selectedUser.raasi} />
                                               <DetailRow label="Star / Nakshatra" value={selectedUser.star || selectedUser.nakshatra} icon={<Users size={12} />} />
                                               <DetailRow label="Lagnam" value={selectedUser.lagnam} />
                                               <DetailRow label="Dosham" value={selectedUser.dosham} />
                                               <DetailRow label="Birth Time/Place" value={`${selectedUser.timeOfBirth || '-'}, ${selectedUser.placeOfBirth || '-'}`} fullWidth />
                                            </div>
                                         </div>

                                         {/* Family */}
                                         <div className="bg-white dark:bg-black/20 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                                            <SectionHeader title="Family Details" icon={<Home size={18} />} />
                                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                               <DetailRow label="Father" value={`${selectedUser.fatherName} (${selectedUser.fatherOccupation || selectedUser.fatherStatus})`} />
                                               <DetailRow label="Father Contact" value={selectedUser.fatherMobile} icon={<Phone size={12}/>} />
                                               <DetailRow label="Father Email" value={selectedUser.fatherEmail} icon={<Mail size={12}/>} fullWidth />
                                               
                                               <div className="col-span-full h-px bg-gray-100 dark:bg-white/5 my-2" />

                                               <DetailRow label="Mother" value={`${selectedUser.motherName} (${selectedUser.motherOccupation || selectedUser.motherStatus})`} />
                                               <DetailRow label="Mother Contact" value={selectedUser.motherMobile} icon={<Phone size={12}/>} />
                                               <DetailRow label="Mother Email" value={selectedUser.motherEmail} icon={<Mail size={12}/>} fullWidth />
                                               
                                               <div className="col-span-full h-px bg-gray-100 dark:bg-white/5 my-2" />
                                               
                                               <DetailRow label="Family Type" value={`${selectedUser.familyType}, ${selectedUser.familyValues}`} />
                                               <DetailRow label="Native Place" value={selectedUser.nativePlace || selectedUser.poorviham} />
                                               <DetailRow label="Siblings" value={selectedUser.siblings} />
                                               {selectedUser.siblingsDetails && selectedUser.siblingsDetails.length > 0 && (
                                                   <div className="col-span-full mt-2">
                                                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sibling Details</p>
                                                       <div className="space-y-2">
                                                           {selectedUser.siblingsDetails.map((sib, i) => (
                                                               <div key={i} className="text-xs bg-gray-50 dark:bg-white/5 p-2 rounded border border-gray-100 dark:border-white/5">
                                                                   <span className="font-bold">{sib.name}</span> ({sib.gender}) - {sib.occupation}, {sib.maritalStatus}
                                                               </div>
                                                           ))}
                                                       </div>
                                                   </div>
                                               )}
                                            </div>
                                         </div>

                                         {/* Lifestyle & Bio */}
                                         <div className="bg-white dark:bg-black/20 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                                            <SectionHeader title="Lifestyle & Bio" icon={<Coffee size={18} />} />
                                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                               <DetailRow label="Diet" value={selectedUser.diet} />
                                               <DetailRow label="Smoke / Drink" value={`${selectedUser.smoking} / ${selectedUser.drinking}`} />
                                               <DetailRow label="Height / Weight" value={`${selectedUser.height} / ${selectedUser.weight}kg`} icon={<Ruler size={12} />} />
                                               <DetailRow label="Body Type" value={`${selectedUser.bodyType}, ${selectedUser.complexion}`} />
                                               <DetailRow label="Physical Status" value={selectedUser.physicalStatus} />
                                               <DetailRow label="Hobbies" value={Array.isArray(selectedUser.hobbies) ? selectedUser.hobbies.join(', ') : selectedUser.hobbies} fullWidth />
                                               <DetailRow label="About" value={selectedUser.about} fullWidth className="text-xs leading-relaxed" />
                                            </div>
                                         </div>
                                     </div>

                                     {/* Documents & Media Section */}
                                     <div className="bg-white dark:bg-black/20 rounded-2xl p-6 border border-gray-200 dark:border-white/5">
                                         <SectionHeader title="Documents & Media" icon={<Upload size={18} />} />
                                         
                                         <div className="grid md:grid-cols-2 gap-8">
                                             {/* Photos */}
                                             <div>
                                                 <p className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><ImageIcon size={12} /> Profile Photos</p>
                                                 <div className="flex gap-4 overflow-x-auto pb-2">
                                                     {selectedUser.photos && selectedUser.photos.length > 0 ? (
                                                         selectedUser.photos.map((photo, i) => (
                                                             <img key={i} src={photo} className="w-24 h-24 rounded-lg object-cover border border-gray-200 dark:border-white/10" />
                                                         ))
                                                     ) : (
                                                         <div className="text-sm text-gray-500 italic">No additional photos uploaded</div>
                                                     )}
                                                 </div>
                                                 {selectedUser.familyPhoto && (
                                                     <div className="mt-4">
                                                         <p className="text-xs font-bold text-gray-400 uppercase mb-2">Family Photo</p>
                                                         <img src={selectedUser.familyPhoto} className="w-32 h-24 rounded-lg object-cover border border-gray-200 dark:border-white/10" />
                                                     </div>
                                                 )}
                                             </div>

                                             {/* Documents */}
                                             <div className="space-y-4">
                                                 <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2"><FileText size={12} /> Documents</p>
                                                 
                                                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                                                     <span className="text-sm font-medium">Jathagam (Horoscope)</span>
                                                     {selectedUser.horoscopeFile ? (
                                                         <a href={selectedUser.horoscopeFile} target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline"><Download size={12} /> View</a>
                                                     ) : <span className="text-xs text-gray-400">Not Uploaded</span>}
                                                 </div>

                                                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                                                     <span className="text-sm font-medium">Bio-Data File</span>
                                                     {selectedUser.bioDataFile ? (
                                                         <a href={selectedUser.bioDataFile} target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline"><Download size={12} /> View</a>
                                                     ) : <span className="text-xs text-gray-400">Not Uploaded</span>}
                                                 </div>
                                                 
                                                 {/* ID Proofs (Admin Only) */}
                                                 <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                                                     <div>
                                                         <span className="text-sm font-medium block">ID Proof ({selectedUser.idType || 'Aadhaar'})</span>
                                                         <span className="text-[10px] text-gray-500">{selectedUser.idNumber || 'Not provided'}</span>
                                                     </div>
                                                     <div className="flex gap-2">
                                                         {selectedUser.idUrlFront && <a href={selectedUser.idUrlFront} target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-600 hover:underline">Front</a>}
                                                         {selectedUser.idUrlBack && <a href={selectedUser.idUrlBack} target="_blank" rel="noreferrer" className="text-xs font-bold text-purple-600 hover:underline">Back</a>}
                                                         {!selectedUser.idUrlFront && <span className="text-xs text-gray-400">Not Uploaded</span>}
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>

                                     {/* Hidden container for PDF Generation */}
                                     <div className="absolute top-[-9999px] left-[-9999px] w-[800px] bg-white text-black p-10" ref={reportRef}>
                                        <h1 className="text-3xl font-bold text-center mb-6 border-b pb-4">Matrimonial Bio-Data</h1>
                                        <div className="flex gap-8 mb-8">
                                            <div className="w-1/3"><img src={selectedUser.avatar} className="w-full rounded-lg border" crossOrigin="anonymous" /></div>
                                            <div className="w-2/3 space-y-2">
                                                <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                                                <p><strong>Profile ID:</strong> {selectedUser.id}</p>
                                                <p><strong>Age / DOB:</strong> {selectedUser.dob} ({selectedUser.gender})</p>
                                                <p><strong>Height:</strong> {selectedUser.height}</p>
                                                <p><strong>Education:</strong> {selectedUser.education}</p>
                                                <p><strong>Occupation:</strong> {selectedUser.occupation} ({selectedUser.employmentCategory})</p>
                                                <p><strong>Income:</strong> {selectedUser.income}</p>
                                                <p><strong>Location:</strong> {selectedUser.city}, {selectedUser.state}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 text-sm">
                                            <div className="border p-4 rounded">
                                                <h3 className="font-bold mb-2 text-lg border-b pb-1">Family Details</h3>
                                                <p><strong>Father:</strong> {selectedUser.fatherName} ({selectedUser.fatherOccupation})</p>
                                                <p><strong>Mother:</strong> {selectedUser.motherName} ({selectedUser.motherOccupation})</p>
                                                <p><strong>Siblings:</strong> {selectedUser.siblings}</p>
                                                <p><strong>Native:</strong> {selectedUser.nativePlace}</p>
                                            </div>
                                            <div className="border p-4 rounded">
                                                <h3 className="font-bold mb-2 text-lg border-b pb-1">Horoscope Details</h3>
                                                <p><strong>Raasi:</strong> {selectedUser.raasi}</p>
                                                <p><strong>Nakshatra:</strong> {selectedUser.nakshatra || selectedUser.star}</p>
                                                <p><strong>Lagnam:</strong> {selectedUser.lagnam}</p>
                                                <p><strong>Gothram:</strong> {selectedUser.gothram}</p>
                                                <p><strong>Dosham:</strong> {selectedUser.dosham}</p>
                                            </div>
                                        </div>
                                     </div>

                                  </div>
                               )}
                               
                               {/* ... other tabs like activity etc ... */}
                               {modalTab === 'activity' && (
                                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                                     <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-6 border border-purple-100 dark:border-white/5">
                                         <h4 className="font-bold text-sm text-purple-900 dark:text-white mb-4 flex items-center gap-2">
                                             <Eye size={16} /> Profiles Viewed by User
                                         </h4>
                                         <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                                             {getViewedProfiles().length === 0 ? (
                                                 <p className="text-xs text-gray-500 italic">No profiles viewed yet.</p>
                                             ) : (
                                                 getViewedProfiles().map((p: any, i: number) => (
                                                     <div key={i} className="min-w-[140px] bg-white dark:bg-[#151515] p-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                                         <img src={p.avatar} className="w-12 h-12 rounded-full mx-auto mb-2 object-cover" />
                                                         <div className="text-center">
                                                             <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{p.name}</p>
                                                             <p className="text-[10px] text-gray-500">{p.id}</p>
                                                             <p className="text-[9px] text-purple-500 mt-1 font-medium">{p.viewedAt}</p>
                                                         </div>
                                                     </div>
                                                 ))
                                             )}
                                         </div>
                                     </div>

                                     <h3 className="text-lg font-bold">User Activity Logs</h3>
                                     <div className="space-y-3">
                                        {getUserActivity().map((log, i) => (
                                           <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                              <div className="flex items-center gap-3">
                                                 <div className={`p-2 rounded-lg ${log.type === 'Login' ? 'bg-blue-100 text-blue-600' : log.type === 'View' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                                    <Activity size={16} />
                                                 </div>
                                                 <div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{log.type}</p>
                                                    <p className="text-xs text-gray-500">{log.desc}</p>
                                                 </div>
                                              </div>
                                              <span className="text-xs font-mono text-gray-400">{log.time}</span>
                                           </div>
                                        ))}
                                     </div>
                                  </div>
                               )}
                               
                               {/* ... other modal tabs (interactions, messages, etc) if needed ... */}
                            </div>
                         </>
                      ) : (
                         <div className="text-center space-y-6 py-10 flex flex-col justify-center h-full">
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-xl shadow-green-500/20 mb-6">
                               <Send size={48} />
                            </div>
                            <div>
                               <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">Account Activated!</h3>
                               <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                  Login credentials have been generated for <strong>{selectedUser.email}</strong>. Share these with the user.
                               </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-black/40 p-8 rounded-3xl text-left border border-gray-200 dark:border-white/10 relative overflow-hidden max-w-md mx-auto">
                               <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">One-Time Use</div>
                               <div className="space-y-6">
                                  <div>
                                     <label className="text-[10px] font-bold text-gray-400 uppercase">Username / Email</label>
                                     <div className="font-mono font-bold text-xl select-all text-gray-900 dark:text-white mt-1">{generatedCreds.username}</div>
                                  </div>
                                  <div>
                                     <label className="text-[10px] font-bold text-gray-400 uppercase">Temporary Password</label>
                                     <div className="flex items-center gap-3 mt-1">
                                        <div className="font-mono font-bold text-2xl select-all text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-xl border border-purple-100 dark:border-purple-900/50">
                                            {generatedCreds.pass}
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-3 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl">
                                            <Copy size={20} />
                                        </button>
                                     </div>
                                  </div>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl text-xs text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2 max-w-md mx-auto">
                               <Lock size={16} /> User will be prompted to change this password on first login.
                            </div>

                            <div className="max-w-md mx-auto pt-4 w-full">
                                <PremiumButton onClick={handleCloseModal} width="full" className="!py-4">Done</PremiumButton>
                            </div>
                         </div>
                      )}
                   </div>
                   
                   {/* Footer Actions - Only show if not generated creds */}
                   {!generatedCreds && (
                        <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex gap-4 shrink-0 justify-end">
                            {selectedUser.status === 'pending' ? (
                                <>
                                    <button 
                                        type="button"
                                        onClick={handleReject} 
                                        className="px-8 py-3 rounded-xl border-2 border-red-100 dark:border-red-900/30 text-red-600 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                    >
                                        Reject Application
                                    </button>
                                    <PremiumButton 
                                        onClick={handleApprove} 
                                        disabled={isProcessing}
                                        className="shadow-xl shadow-purple-500/20 px-10"
                                        icon={isProcessing ? <RefreshCw className="animate-spin" /> : <CheckCircle />}
                                    >
                                        {isProcessing ? 'Activating...' : 'Approve & Activate'}
                                    </PremiumButton>
                                </>
                            ) : (
                                <button onClick={handleCloseModal} className="px-8 py-3 rounded-xl bg-gray-200 dark:bg-white/10 font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">
                                    Close Details
                                </button>
                            )}
                        </div>
                   )}
                </motion.div>
             </div>
          )}
       </AnimatePresence>
    </div>
  );
};

export default AdminUserManagement;
