
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Eye, Heart, Star, Sparkles, ChevronRight, ArrowUpRight, Lock, Shield, 
  CheckCircle, Zap, Calendar, X, PenTool, LogOut, UserPlus, Ban
} from 'lucide-react';
import { DashboardSidebar, DashboardHeader, MatchCard, StatCard, RequestCard, EventCard, SectionHeader } from './DashboardWidgets';
import ProfileSetupWizard from './ProfileSetupWizard';
import PhotosVideoModule from './PhotosVideoModule';
import MatchesView from './MatchesView';
import HoroscopePage from './HoroscopePage';
import ProfileEnhancement from './ProfileEnhancement';
import MatchSearch from './BasicSearch'; 
import CommunicationCenter from './CommunicationCenter';
import MembershipPage from './MembershipPage';
import ProfileDetailModal from './ProfileDetailModal';
import InvitationMaker from './InvitationMaker';
import UserSettings from './UserSettings';
import SupportChat from './SupportChat'; 
import { ConnectionsView, InterestsView, ShortlistView, ActivityView, EventsView, VisitorsView, BlockedUsersView } from './InteractionViews';
import PremiumButton from '../ui/PremiumButton';
import { generateMockProfiles, MOCK_REQUESTS, MOCK_EVENTS, Profile, ActivityLog } from '../../utils/mockData';
import useLocalStorage from '../../hooks/useLocalStorage';
import useTranslation from '../../hooks/useTranslation';

const M = motion as any;

interface UserDashboardProps {
  onLogout: () => void;
  toggleTheme: () => void;
  darkMode: boolean;
}

// Simple Toast Notification Component
const Toast: React.FC<{ message: string, onClose: () => void }> = ({ message, onClose }) => (
   <M.div 
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
   >
      <CheckCircle size={20} className="text-green-500" />
      <span className="font-bold text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100"><X size={16} /></button>
   </M.div>
);

const UserDashboard: React.FC<UserDashboardProps> = ({ onLogout, toggleTheme, darkMode }) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'photos' | 'matches' | 'search' | 'keyword-search' | 'community-search' | 'messages' | 'horoscope' | 'enhancements' | 'membership' | 'connections' | 'interests' | 'shortlist' | 'activity' | 'events' | 'visitors' | 'invitations' | 'support' | 'settings' | 'blocked'>('overview');
  
  // Data States with Persistence
  const [activeMatchTab, setActiveMatchTab] = useState<'daily' | 'premium' | 'new'>('daily');
  const [matches, setMatches] = useState<Profile[]>([]);
  
  // User Plan State (Lifted for global access)
  const [userPlan, setUserPlan] = useLocalStorage<string>('mdm_user_plan', 'Free');

  // Persisted States - Using localStorage for Relationships/Requests simulation
  const [requests, setRequests] = useLocalStorage('mdm_requests', MOCK_REQUESTS); // Legacy mock for demo init
  const [shortlisted, setShortlisted] = useLocalStorage<Profile[]>('mdm_shortlisted', []); 
  
  // Persist Activity Log
  const [activityLog, setActivityLog] = useLocalStorage<ActivityLog[]>('mdm_activity_log', []);
  const [viewProfile, setViewProfile] = useState<Profile | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  // New State for initiating chat from profile/shortlist
  const [chatTarget, setChatTarget] = useState<Profile | null>(null);

  // Check for Password Reset Requirement
  const [requiresReset, setRequiresReset] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [greeting, setGreeting] = useState('');

  // Helper: Get Time-based Greeting (India Time)
  const getGreeting = () => {
    const now = new Date();
    // Convert to IST (UTC + 5:30)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utc + istOffset);
    const hour = istDate.getHours();

    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  // Helper: Calculate Profile Score
  const calculateProfileScore = (user: any) => {
    if (!user) return 0;
    let score = 50; // Increased base score since ID verification step is removed from user flow

    // 2. Horoscope (20%)
    if (user.horoscopeFile) score += 20;

    // 3. Basic Details (30%)
    if (user.education && user.occupation) score += 10;
    if (user.about && user.about.length > 20) score += 10;
    if (user.location) score += 5;
    if (user.avatar && !user.avatar.includes('pravatar')) score += 5; // Custom photo check

    return Math.min(100, score);
  };

  // Initialize & Security Check
  useEffect(() => {
    setGreeting(getGreeting());
    const email = localStorage.getItem('mdm_email');
    
    // 1. Verify Status Consistency (Anti-Tamper check) & Load Current User
    const storedUsers = JSON.parse(localStorage.getItem('mdm_users') || '[]');
    const user = storedUsers.find((u: any) => u.email === email);
    
    if (user) {
        if (user.status === 'pending') {
            // Force logout if somehow got here while pending
            onLogout();
            return;
        }
        setCurrentUser(user);
        // Sync plan from user profile if available, otherwise keep local state
        if (user.plan) setUserPlan(user.plan);
    } else {
        // Fallback for demo logins without registration
        setCurrentUser({ id: 'USR-DEMO', name: 'Demo User', email: email, avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=random' });
    }

    // 2. Check Reset Flag - STRICT LOCKOUT
    const resetFlag = localStorage.getItem('mdm_requires_reset');
    if (resetFlag === 'true') {
        setRequiresReset(true);
    }

    const pool = generateMockProfiles(30);
    const scored = pool.map(p => ({...p, matchScore: Math.floor(Math.random() * (98 - 70) + 70)}));
    setMatches(scored);
  }, []);

  // Recalculate score when user changes
  useEffect(() => {
      if (currentUser) {
          const score = calculateProfileScore(currentUser);
          setProfileCompletion(score);
      }
  }, [currentUser]);

  // Handler for password reset success
  const handlePasswordResetSuccess = () => {
     localStorage.removeItem('mdm_requires_reset');
     // Force logout immediately
     onLogout();
  };

  // --- ACTIONS ---
  const showToast = (msg: string) => {
     setToast(msg);
     setTimeout(() => setToast(null), 3000);
  };

  const logActivity = (type: ActivityLog['type'], description: string, profile?: Profile) => {
     const newLog: ActivityLog = {
        id: Date.now().toString(),
        type,
        description,
        timestamp: new Date().toLocaleTimeString(),
        profileImage: profile?.img,
        profileName: profile?.name
     };
     setActivityLog(prev => [newLog, ...prev]);
  };

  const handlePlanUpgrade = (newPlan: string) => {
     setUserPlan(newPlan);
     
     // Update user record in local storage as well
     if (currentUser) {
        const storedUsers = JSON.parse(localStorage.getItem('mdm_users') || '[]');
        const updatedUsers = storedUsers.map((u: any) => {
           if (u.id === currentUser.id) return { ...u, plan: newPlan.toLowerCase() };
           return u;
        });
        localStorage.setItem('mdm_users', JSON.stringify(updatedUsers));
     }

     showToast(`Successfully upgraded to ${newPlan} Plan!`);
     setCurrentView('overview'); // Go back to overview to see changes
     
     // Log activity
     logActivity('system', `Upgraded membership to ${newPlan}`);
  };


  // --- CONNECT / INTEREST LOGIC ---
  const getConnectionStatus = (targetId: string): 'none' | 'pending_sent' | 'pending_received' | 'connected' | 'rejected' => {
      if (!currentUser) return 'none';
      const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
      const outgoing = rels.find((r: any) => r.fromUserId === currentUser.id && r.toUserId === targetId);
      if (outgoing) {
          if (outgoing.status === 'connected') return 'connected';
          if (outgoing.status === 'rejected') return 'rejected';
          if (outgoing.status === 'pending_admin') return 'pending_sent'; // Treat admin pending as sent
          return 'pending_sent';
      }
      const incoming = rels.find((r: any) => r.fromUserId === targetId && r.toUserId === currentUser.id);
      if (incoming) {
          if (incoming.status === 'connected') return 'connected';
          return 'pending_received';
      }
      return 'none';
  };

  const handleConnect = (profile: Profile) => {
     if (!currentUser) return;
     const status = getConnectionStatus(profile.id);
     if (status !== 'none') {
         showToast("Connection already exists or pending.");
         return;
     }

     const newRelationship = {
         id: `REL-${Date.now()}`,
         fromUserId: currentUser.id,
         toUserId: profile.id,
         fromUserName: currentUser.name,
         toUserName: profile.name,
         fromUserImg: currentUser.avatar,
         toUserImg: profile.img,
         status: 'pending', // Initial State (Direct user-to-user for general connect)
         timestamp: new Date().toLocaleString()
     };

     const existingRels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
     localStorage.setItem('mdm_relationships', JSON.stringify([newRelationship, ...existingRels]));
     
     logActivity('connect', `Sent connection request to ${profile.name}`, profile);
     showToast(`Connection Request Sent to ${profile.name}`);
     
     if (viewProfile && viewProfile.id === profile.id) {
         setViewProfile({...profile}); 
     }
  };

  const handleInterest = (profile: Profile) => {
     if (!currentUser) return;
     const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
     
     // Check if already sent
     const exists = rels.find((r: any) => 
        (r.fromUserId === currentUser.id && r.toUserId === profile.id) ||
        (r.fromUserId === profile.id && r.toUserId === currentUser.id)
     );
     
     if (exists) {
         showToast("Interest/Connection already exists.");
         return;
     }

     // Create Relationship with 'pending_admin' status for Interest Workflow
     const newInterest = {
         id: `INT-${Date.now()}`,
         fromUserId: currentUser.id,
         toUserId: profile.id,
         fromUserName: currentUser.name,
         toUserName: profile.name,
         fromUserImg: currentUser.avatar,
         toUserImg: profile.img,
         status: 'pending_admin', // Goes to Admin first
         timestamp: new Date().toLocaleString()
     };

     const updatedRels = [newInterest, ...rels];
     localStorage.setItem('mdm_relationships', JSON.stringify(updatedRels));

     logActivity('interest', `Sent Interest to ${profile.name}`, profile);
     showToast(`Interest Sent for Admin Approval`);
  };

  const handleShortlist = (profile: Profile) => {
     const exists = shortlisted.find(p => p.id === profile.id);
     if (exists) {
        setShortlisted(prev => prev.filter(p => p.id !== profile.id));
        showToast(`Removed ${profile.name} from bookmarks`);
     } else {
        setShortlisted(prev => [profile, ...prev]);
        logActivity('shortlist', `Bookmarked ${profile.name}`, profile);
        showToast(`Bookmarked ${profile.name}`);
     }
  };

  // --- MESSAGING LOGIC ---
  const handleInitiateChat = (profile: Profile) => {
      setChatTarget(profile);
      setCurrentView('messages');
      if (viewProfile) setViewProfile(null); // Close modal if open
  };

  const handleViewProfile = (profile: Profile) => {
     setViewProfile(profile);
     logActivity('view', `Viewed profile of ${profile.name}`, profile);
  };
  
  // Unblock Handler
  const handleUnblock = (blockedId: string) => {
      if (!currentUser) return;
      const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
      const updatedRels = rels.filter((r: any) => 
          !(r.fromUserId === currentUser.id && r.toUserId === blockedId && r.status === 'blocked')
      );
      localStorage.setItem('mdm_relationships', JSON.stringify(updatedRels));
      showToast("User unblocked successfully.");
      // Force re-render of current view if needed is handled by internal state of BlockedUsersView
  };

  const incomingRequests = React.useMemo(() => {
      if (!currentUser) return requests;
      const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
      const myPending = rels.filter((r: any) => r.toUserId === currentUser.id && r.status === 'pending');
      // Also fetch approved interests (sent by admin to user)
      const myApprovedInterests = rels.filter((r: any) => r.toUserId === currentUser.id && r.status === 'approved_by_admin');
      
      const mapped = [...myPending, ...myApprovedInterests].map((r: any) => ({
          id: r.fromUserId,
          name: r.fromUserName,
          img: r.fromUserImg,
          age: 25, 
          profession: 'Professional',
          location: 'Location',
          compatibility: 85,
          time: r.timestamp,
          status: r.status // Pass status to distinguish source
      }));
      
      return mapped;
  }, [currentUser, requests, currentView]); 

  // Computed interests count for stats
  const sentInterestsCount = React.useMemo(() => {
      if (!currentUser) return 0;
      const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
      return rels.filter((r: any) => r.fromUserId === currentUser.id && (r.status.includes('admin') || r.status.includes('accepted'))).length;
  }, [currentUser, currentView]);


  const handleAcceptRequest = (fromUserId: string) => {
    const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
    const updatedRels = rels.map((r: any) => {
        if (r.fromUserId === fromUserId && r.toUserId === currentUser.id) {
            // If it was an interest (approved_by_admin), mark as accepted_by_user for admin to finalize
            if (r.status === 'approved_by_admin') return { ...r, status: 'accepted_by_user' };
            // Standard connect
            return { ...r, status: 'connected' };
        }
        return r;
    });
    localStorage.setItem('mdm_relationships', JSON.stringify(updatedRels));
    
    // Force re-render
    setRequests(prev => [...prev]); 
    
    logActivity('connect', 'Accepted connection request');
    showToast('Accepted'); 
  };

  const handleDeclineRequest = (fromUserId: string) => {
    const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
    const updatedRels = rels.map((r: any) => {
        if (r.fromUserId === fromUserId && r.toUserId === currentUser.id) {
            return { ...r, status: 'rejected' };
        }
        return r;
    });
    localStorage.setItem('mdm_relationships', JSON.stringify(updatedRels));
    
    setRequests(prev => [...prev]);
    showToast('Request Declined');
  };

  // --- RENDER CONTENT SWITCHER ---
  const renderContent = () => {
    if (requiresReset) {
        return (
           <UserSettings 
              isMandatoryReset={true} 
              onResetComplete={handlePasswordResetSuccess} 
           />
        );
    }

    if (showSetupWizard) {
      return <ProfileSetupWizard onComplete={() => setShowSetupWizard(false)} onExit={() => setShowSetupWizard(false)} />;
    }

    if (currentView === 'invitations') {
       return <InvitationMaker onBack={() => setCurrentView('overview')} />;
    }

    switch (currentView) {
       case 'photos': return <PhotosVideoModule />;
       case 'matches': return <MatchesView onConnect={handleConnect} onInterest={handleInterest} onShortlist={handleShortlist} onViewProfile={handleViewProfile} />;
       case 'search': return <MatchSearch initialMode="default" />;
       case 'keyword-search': return <MatchSearch initialMode="keyword" />;
       case 'community-search': return <MatchSearch initialMode="community" />;
       case 'horoscope': return <HoroscopePage />;
       case 'enhancements': return <ProfileEnhancement />;
       case 'messages': return <CommunicationCenter currentUser={currentUser} initialChatPartner={chatTarget} />;
       case 'membership': return <MembershipPage currentPlan={userPlan} onUpgrade={handlePlanUpgrade} currentUser={currentUser} />;
       
       case 'connections': return (
          <ConnectionsView 
             currentUserId={currentUser?.id} 
             requests={incomingRequests} 
             onAccept={handleAcceptRequest} 
             onDecline={handleDeclineRequest} 
             onViewProfile={handleViewProfile} 
          />
       );
       
       case 'blocked': return (
          <BlockedUsersView 
             currentUserId={currentUser?.id} 
             onUnblock={handleUnblock}
          />
       );
       
       case 'interests': return (
            <InterestsView 
                currentUserId={currentUser?.id} 
                onViewProfile={handleViewProfile} 
            />
       );
       
       case 'shortlist': return (
            <ShortlistView 
                currentUserId={currentUser?.id}
                bookmarkedProfiles={shortlisted}
                onViewProfile={handleViewProfile}
                onMessage={handleInitiateChat} 
            />
       );
       
       case 'activity': return <ActivityView activityLog={activityLog} />;
       case 'events': return <EventsView />;
       case 'visitors': return <VisitorsView visitors={generateMockProfiles(10).map((p, i) => ({ id: i.toString(), profile: p, visitTime: `${i+2}h ago`, visitCount: 1 }))} />;
       case 'support': return <SupportChat />;
       case 'settings': return <UserSettings />;
       default:
          // OVERVIEW DASHBOARD
          return (
            <div className="space-y-8 md:space-y-12 pb-20">
              {/* 1. HERO WELCOME SECTION */}
              <M.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden p-6 md:p-12 text-white shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 animate-gradient-x bg-[length:200%_auto]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                    <M.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/20"
                    >
                      <Sparkles size={12} /> {userPlan} Member
                    </M.div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">
                      {greeting}, <br/> {currentUser?.name || 'Guest'}
                    </h1>
                    <p className="text-purple-100 max-w-lg text-base md:text-lg leading-relaxed opacity-90">
                      You have <strong>{incomingRequests.length} {t('dash.newReq')}</strong> and <strong>{matches.length} {t('dash.newMatch')}</strong> waiting for you today.
                    </p>
                  </div>

                  <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl shrink-0">
                      <div className="text-center">
                        <span className="block text-3xl font-bold">{profileCompletion}%</span>
                        <span className="text-[10px] uppercase opacity-80 tracking-wide">Completed</span>
                      </div>
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <M.circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                        <M.circle 
                          cx="50%" cy="50%" r="48%" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: profileCompletion / 100 }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        />
                      </svg>
                  </div>
                </div>
              </M.section>

              {/* 2. STATS GRID */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                 {/* Updated Request Count */}
                <div onClick={() => setCurrentView('connections')} className="cursor-pointer">
                   <StatCard label={t('dash.requests')} value={incomingRequests.length} trend="Live" icon={<UserPlus size={24} />} color="bg-blue-500" />
                </div>
                <div onClick={() => setCurrentView('interests')} className="cursor-pointer">
                   <StatCard label={t('dash.interests')} value={sentInterestsCount} trend="+2" icon={<Heart size={24} />} color="bg-pink-500" />
                </div>
                <div onClick={() => setCurrentView('invitations')} className="cursor-pointer group">
                   <M.div 
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-purple-500 to-indigo-600 p-5 rounded-3xl border border-transparent shadow-lg relative overflow-hidden text-white h-full"
                   >
                      <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
                      <div className="flex justify-between items-start mb-4 relative z-10">
                         <div className="p-3 rounded-2xl bg-white/20"><PenTool size={24} /></div>
                         <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">New</span>
                      </div>
                      <h4 className="text-xl font-display font-bold mb-1">Create Invite</h4>
                      <p className="text-xs text-purple-100">Design digital cards</p>
                   </M.div>
                </div>
                <div onClick={() => setCurrentView('matches')} className="cursor-pointer">
                   <StatCard label={t('dash.matches')} value={matches.length} icon={<Users size={24} />} color="bg-purple-500" />
                </div>
              </section>

              {/* 3. PENDING REQUESTS */}
              <section>
                 <SectionHeader title={t('dash.pending')} subtitle="People who want to connect with you" action={t('common.viewAll')} onAction={() => setCurrentView('connections')} />
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                       {incomingRequests.length > 0 ? (
                          incomingRequests.slice(0, 3).map((req: any) => (
                             <RequestCard 
                                key={req.id} 
                                request={req} 
                                onAccept={() => handleAcceptRequest(req.id.toString())} 
                                onDecline={() => handleDeclineRequest(req.id.toString())} 
                             />
                          ))
                       ) : (
                          <div className="col-span-1 md:col-span-3 text-center py-8 text-gray-500 bg-white/40 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                             <p>No pending requests.</p>
                          </div>
                       )}
                    </AnimatePresence>
                 </div>
              </section>
            </div>
          );
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fa] dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-purple-50 selection:text-white transition-colors duration-500 overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
         {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Profile Detail Modal */}
      <AnimatePresence>
         {viewProfile && (
            <ProfileDetailModal 
               profile={viewProfile} 
               onClose={() => setViewProfile(null)}
               onConnect={handleConnect}
               onInterest={handleInterest}
               onShortlist={handleShortlist}
               connectionStatus={getConnectionStatus(viewProfile.id)}
            />
         )}
      </AnimatePresence>

      {/* Sidebar - Fixed Height, Scrollable internally */}
      {!requiresReset && (
         <div className="flex-shrink-0 h-full">
            <DashboardSidebar 
                collapsed={collapsed} 
                toggleCollapse={() => setCollapsed(!collapsed)} 
                onLogout={onLogout}
                currentView={currentView}
                onViewChange={(view) => setCurrentView(view as any)}
                isMobileOpen={mobileMenuOpen}
                closeMobile={() => setMobileMenuOpen(false)}
            />
         </div>
      )}

      {/* Main Content - Scrollable independently */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <DashboardHeader 
           toggleTheme={toggleTheme} 
           darkMode={darkMode} 
           onMenuClick={() => setMobileMenuOpen(true)}
           onProfileClick={() => !requiresReset && setCurrentView('settings')}
           userPlan={userPlan}
           userName={currentUser?.name}
           userAvatar={currentUser?.avatar}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl 3xl:max-w-screen-2xl mx-auto h-full pb-20">
            <AnimatePresence mode="wait">
              <M.div 
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderContent()}
              </M.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
