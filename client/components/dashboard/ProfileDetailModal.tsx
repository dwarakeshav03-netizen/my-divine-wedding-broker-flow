
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Briefcase, BookOpen, Heart, Star, MessageCircle, Shield, CheckCircle, Ruler, Home, Coffee, Moon, Sun, Lock, ChevronRight, ChevronLeft, Sparkles, Loader2, UserPlus, Mail, Phone, Building2, Ban, EyeOff, UserCheck, ScrollText, Flag, AlertTriangle, Calendar, Globe, Hash, Clock, Users, Crown, BadgeCheck } from 'lucide-react';
import { Profile } from '../../utils/mockData';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedTextArea, AnimatedSelect } from '../profile/ProfileFormElements';
import { ReportTicket } from '../../utils/adminData';

interface ProfileDetailModalProps {
  profile: Profile;
  onClose: () => void;
  onConnect?: (profile: Profile) => void;
  onInterest?: (profile: Profile) => void;
  onShortlist?: (profile: Profile) => void;
  connectionStatus?: 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'rejected';
}

const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ 
  profile, 
  onClose, 
  onConnect, 
  onInterest, 
  onShortlist, 
  connectionStatus = 'none' 
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'career' | 'family' | 'horoscope'>('personal');
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [connecting, setConnecting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  
  // Reporting State
  const [reportReason, setReportReason] = useState('');
  const [reportCategory, setReportCategory] = useState('Fake Profile');
  const [blockUser, setBlockUser] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  // Check Approval for Visibility
  const isApproved = profile.isApproved !== false; // Default true for mocks if undefined
  
  useEffect(() => {
     // Notify admin/owner mock
     console.log(`Notification: User viewed profile ${profile.id}`);
  }, [profile.id]);

  const handleConnect = () => {
    if (connectionStatus !== 'none') return;
    setConnecting(true);
    setTimeout(() => {
        if(onConnect) onConnect(profile);
        setConnecting(false);
    }, 1000);
  };

  const handleReportSubmit = () => {
    if (!reportReason.trim()) {
        alert("Please provide a reason for the report.");
        return;
    }
    setIsReporting(true);

    const currentUserEmail = localStorage.getItem('mdm_user_session') || localStorage.getItem('mdm_email');
    const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
    const currentUser = users.find((u:any) => u.email === currentUserEmail);
    const reporterId = currentUser ? currentUser.id : 'GUEST';
    const reporterName = currentUser ? currentUser.name : 'Guest User';
    
    // 1. Create Report Ticket
    const newReport: ReportTicket = {
        id: `RPT-${Date.now()}`,
        reporter: reporterName,
        reporterId: reporterId,
        reportedUser: profile.name,
        reportedUserId: profile.id,
        reportedUserAvatar: profile.img,
        reason: reportReason,
        category: reportCategory as any,
        severity: 'medium',
        status: 'open',
        timestamp: new Date().toLocaleString(),
        aiFlag: false,
        aiRiskScore: 0
    };

    const existingReports = JSON.parse(localStorage.getItem('mdm_reports') || '[]');
    localStorage.setItem('mdm_reports', JSON.stringify([newReport, ...existingReports]));

    // 2. Handle Block
    if (blockUser) {
        const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
        
        // Remove existing relationship if present to override with block
        const filteredRels = rels.filter((r: any) => 
            !((r.fromUserId === reporterId && r.toUserId === profile.id) || 
              (r.fromUserId === profile.id && r.toUserId === reporterId))
        );

        const blockRel = {
            id: `BLK-${Date.now()}`,
            fromUserId: reporterId, 
            toUserId: profile.id,
            fromUserName: reporterName,
            toUserName: profile.name,
            fromUserImg: currentUser?.avatar,
            toUserImg: profile.img,
            status: 'blocked',
            timestamp: new Date().toISOString()
        };
        // Add blocking relationship
        localStorage.setItem('mdm_relationships', JSON.stringify([blockRel, ...filteredRels]));
    }

    setTimeout(() => {
        setIsReporting(false);
        alert(`Report submitted.${blockUser ? ' User blocked.' : ''}`);
        setShowReportModal(false);
        onClose(); // Close profile view
    }, 1000);
  };

  const LockedOverlay = ({ title }: { title: string }) => (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 p-6 text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-4 text-gray-500">
              <Lock size={32} />
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title} Locked</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              To view {profile.name}'s {title.toLowerCase()} details, you must connect with them first.
          </p>
          {connectionStatus === 'none' && (
             <div className="mt-6">
                <PremiumButton onClick={handleConnect} variant="gradient" className="!py-2 !px-6 !text-xs">
                   Send Connection Request
                </PremiumButton>
             </div>
          )}
      </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 select-none">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 50 }}
        className="relative w-full h-full md:h-[90vh] md:max-w-6xl bg-white dark:bg-[#0a0a0a] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/10"
      >
        {/* Close & Report Buttons */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button onClick={() => setShowReportModal(true)} className="p-2 bg-black/50 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors" title="Report / Block">
               <Flag size={20} />
            </button>
            <button onClick={onClose} className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors">
               <X size={20} />
            </button>
        </div>

        {/* LEFT SIDE: Photos */}
        <div className="w-full md:w-2/5 h-[45vh] md:h-auto relative bg-black group shrink-0 overflow-hidden">
          <div className="absolute inset-0 z-40 bg-transparent" onContextMenu={(e) => e.preventDefault()} />
          
          <AnimatePresence mode="wait">
             {profile.images && profile.images.length > 0 ? (
                <motion.img 
                  key={currentPhoto}
                  src={profile.images[currentPhoto]} 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className={`w-full h-full object-cover ${!isApproved ? 'blur-xl' : ''}`}
                />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
             )}
          </AnimatePresence>

          {!isApproved && (
             <div className="absolute inset-0 flex items-center justify-center z-50">
                <div className="bg-black/80 px-6 py-3 rounded-xl text-white text-center">
                   <Lock className="mx-auto mb-2" />
                   <p className="font-bold">Pending Approval</p>
                   <p className="text-xs text-gray-400">Profile under review</p>
                </div>
             </div>
          )}

          <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 text-white z-30 bg-gradient-to-t from-black/90 to-transparent">
             <div className="flex flex-col gap-1 mb-1">
                <div className="flex items-center gap-2">
                   <h2 className="text-xl md:text-3xl font-display font-bold truncate">{profile.name}</h2>
                   {profile.isVerified && <BadgeCheck size={24} className="text-blue-500 fill-white" />}
                   {connectionStatus === 'connected' && <CheckCircle size={20} className="text-green-500" />}
                </div>
                {profile.plan && profile.plan.toLowerCase() !== 'free' && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit
                        ${profile.plan.toLowerCase() === 'platinum' ? 'bg-gradient-to-r from-slate-700 to-black text-white border border-slate-500' : 
                          profile.plan.toLowerCase() === 'diamond' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' : 
                          'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'}
                    `}>
                        <Crown size={12} className={profile.plan.toLowerCase() === 'gold' ? 'fill-black' : 'fill-white'} />
                        {profile.plan} Member
                    </div>
                )}
             </div>
             <p className="text-sm opacity-90 mt-2">{profile.age} Yrs • {profile.religion}</p>
          </div>
        </div>

        {/* RIGHT SIDE: Details */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#0a0a0a] overflow-hidden">
           {!isApproved ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
                 <AlertTriangle size={48} className="mb-4 opacity-50" />
                 <h3 className="text-xl font-bold">Profile Not Approved</h3>
                 <p>This user is currently under admin review. Full details are hidden.</p>
              </div>
           ) : (
              <>
                 <div className="shrink-0 z-20 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-4 md:px-6 pt-4">
                    <div className="flex gap-4 md:gap-6 overflow-x-auto pb-3 hide-scrollbar">
                       {['personal', 'career', 'family', 'horoscope'].map((tab) => (
                          <button key={tab} onClick={() => setActiveTab(tab as any)} className={`relative pb-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === tab ? 'text-purple-600 dark:text-gold-400' : 'text-gray-400 hover:text-gray-600'}`}>
                             {tab} Details
                             {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-gold-400" />}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="p-4 md:p-8 space-y-8 pb-20 md:pb-8 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Content Based on Tab */}
                    {activeTab === 'personal' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold flex items-center gap-2"><User /> Basic Information</h3>
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                               <DetailItem icon={<User />} label="Name" value={profile.name} />
                               <DetailItem icon={<Calendar />} label="DOB" value={profile.dob || 'N/A'} />
                               <DetailItem icon={<Ruler />} label="Height" value={profile.height} />
                               <DetailItem icon={<Heart />} label="Marital Status" value={profile.maritalStatus} />
                               <DetailItem icon={<MessageCircle />} label="Mother Tongue" value={profile.motherTongue} />
                               <DetailItem icon={<Shield />} label="Religion" value={profile.religion} />
                               <DetailItem icon={<Users />} label="Caste" value={profile.caste} />
                               <DetailItem icon={<MapPin />} label="Location" value={profile.location} />
                            </div>
                            
                            <h3 className="text-lg font-bold flex items-center gap-2 mt-6"><Coffee /> Lifestyle</h3>
                            <div className="grid grid-cols-1 xs:grid-cols-3 gap-4">
                               <DetailItem icon={<Coffee />} label="Diet" value={profile.diet} />
                               <DetailItem icon={<Coffee />} label="Drink" value={profile.drinking} />
                               <DetailItem icon={<Coffee />} label="Smoke" value={profile.smoking} />
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                               <p className="text-xs font-bold uppercase text-gray-500 mb-2">About Me</p>
                               <p className="text-sm leading-relaxed">{profile.about}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'career' && (
                        <div className="space-y-6">
                           <h3 className="text-lg font-bold flex items-center gap-2"><Briefcase /> Education & Career</h3>
                           <div className="grid grid-cols-1 gap-4">
                               <DetailItem icon={<BookOpen />} label="Education" value={profile.education} />
                               <DetailItem icon={<Briefcase />} label="Occupation" value={profile.occupation} highlighted />
                               <DetailItem icon={<Building2 />} label="Company" value={profile.company || 'Not Specified'} />
                               <DetailItem icon={<Star />} label="Income" value={profile.income} />
                           </div>
                        </div>
                    )}

                    {activeTab === 'family' && (
                        <div className="space-y-6">
                           <h3 className="text-lg font-bold flex items-center gap-2"><Home /> Family Details</h3>
                           {connectionStatus === 'connected' ? (
                             <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                                <DetailItem icon={<User />} label="Father's Job" value={profile.fatherJob} />
                                {/* Add Father Contact */}
                                <DetailItem icon={<Phone />} label="Father Contact" value={profile.fatherName ? (profile as any).fatherMobile || 'N/A' : 'N/A'} />
                                <DetailItem icon={<Mail />} label="Father Email" value={profile.fatherName ? (profile as any).fatherEmail || 'N/A' : 'N/A'} />
                                
                                <DetailItem icon={<User />} label="Mother's Job" value={profile.motherOccupation || 'Homemaker'} />
                                {/* Add Mother Contact */}
                                <DetailItem icon={<Phone />} label="Mother Contact" value={profile.motherName ? (profile as any).motherMobile || 'N/A' : 'N/A'} />
                                <DetailItem icon={<Mail />} label="Mother Email" value={profile.motherName ? (profile as any).motherEmail || 'N/A' : 'N/A'} />
                                
                                <DetailItem icon={<Users />} label="Siblings" value={profile.siblingsCount || '0'} />
                                <DetailItem icon={<Home />} label="Family Type" value={profile.familyType} />
                                <DetailItem icon={<Home />} label="Native Place" value={profile.poorviham || 'Not Specified'} />
                             </div>
                           ) : (
                             <LockedOverlay title="Family" />
                           )}
                        </div>
                    )}

                    {activeTab === 'horoscope' && (
                        <div className="space-y-6">
                           <h3 className="text-lg font-bold flex items-center gap-2"><Moon /> Horoscope Details</h3>
                           {connectionStatus === 'connected' ? (
                              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                                 <DetailItem icon={<Star />} label="Raasi" value={profile.raasi} highlighted />
                                 <DetailItem icon={<Star />} label="Nakshatra" value={profile.nakshatra} highlighted />
                                 <DetailItem icon={<Moon />} label="Gothram" value={profile.gothram} />
                                 <DetailItem icon={<Shield />} label="Dosham" value={profile.dosham || 'No'} />
                                 <DetailItem icon={<Clock />} label="Time of Birth" value={profile.timeOfBirth || 'N/A'} />
                                 <DetailItem icon={<MapPin />} label="Place of Birth" value={profile.placeOfBirth || 'N/A'} />
                              </div>
                           ) : (
                              <LockedOverlay title="Horoscope" />
                           )}
                        </div>
                    )}
                 </div>
              </>
           )}
        </div>
      </motion.div>

      {/* REPORT & BLOCK MODAL */}
      <AnimatePresence>
         {showReportModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReportModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
               <motion.div 
                  initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                  className="bg-white dark:bg-[#1a1a1a] p-6 rounded-3xl w-full max-w-md shadow-2xl relative z-10 border border-red-500/20"
               >
                  <h3 className="text-xl font-bold text-red-600 flex items-center gap-2 mb-4">
                     <AlertTriangle size={24} /> Report User
                  </h3>
                  
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">Reason</label>
                        <select 
                           value={reportCategory} 
                           onChange={(e) => setReportCategory(e.target.value)}
                           className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none"
                        >
                           <option>Fake Profile</option>
                           <option>Harassment / Abuse</option>
                           <option>Spam / Scam</option>
                           <option>Inappropriate Content</option>
                           <option>Other</option>
                        </select>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">Details</label>
                        <textarea 
                           value={reportReason} 
                           onChange={(e) => setReportReason(e.target.value)}
                           className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none min-h-[100px]"
                           placeholder="Please describe the issue..."
                        />
                     </div>

                     <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center justify-between">
                        <div>
                           <p className="text-sm font-bold text-red-700 dark:text-red-400">Block this User?</p>
                           <p className="text-xs text-red-600/70 dark:text-red-400/70">They won't be able to contact you.</p>
                        </div>
                        <input 
                           type="checkbox" 
                           checked={blockUser} 
                           onChange={(e) => setBlockUser(e.target.checked)} 
                           className="w-5 h-5 accent-red-600"
                        />
                     </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                     <button onClick={() => setShowReportModal(false)} className="flex-1 py-3 bg-gray-100 dark:bg-white/10 rounded-xl font-bold text-gray-600 dark:text-gray-300 text-sm">Cancel</button>
                     <button onClick={handleReportSubmit} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                        {isReporting ? <Loader2 className="animate-spin" size={16} /> : <Flag size={16} />}
                        Submit Report
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string, highlighted?: boolean }> = ({ icon, label, value, highlighted }) => (
  <div className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${highlighted ? 'bg-green-50 dark:bg-green-900/10 border border-green-200' : 'bg-gray-50 dark:bg-white/5'}`}>
     <div className={`${highlighted ? 'text-green-600' : 'text-gray-400'} mt-0.5`}>{icon}</div>
     <div>
        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">{value}</p>
     </div>
  </div>
);

// Helper Icons
const User = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

export default ProfileDetailModal;
