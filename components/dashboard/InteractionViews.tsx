
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Heart, Star, Clock, Calendar, Eye, UserCheck, X, Check, 
  MessageCircle, MapPin, Filter, Search, ArrowRight, UserPlus, CheckCircle,
  Sparkles, Send, Ban, Shield, Lock, Unlock, Inbox
} from 'lucide-react';
import { Profile, ActivityLog, Visitor } from '../../utils/mockData';
import { MatchCard, EventCard } from './DashboardWidgets'; // Added EventCard import here if not already present in your setup, assumed shared widget
import PremiumButton from '../ui/PremiumButton';

// --- SHARED HEADER ---
const PageHeader: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div>
      <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
        {icon} {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">{subtitle}</p>
    </div>
  </div>
);

// ... ConnectionsView code remains unchanged ...
// --- CONNECTIONS VIEW (Updated for Sent Requests Tracking) ---
export const ConnectionsView: React.FC<{ 
  currentUserId?: string;
  requests: any[]; 
  onAccept: (id: string) => void; 
  onDecline: (id: string) => void;
  onViewProfile: (profile: Profile) => void;
}> = ({ currentUserId, requests, onAccept, onDecline, onViewProfile }) => {
  const [tab, setTab] = useState<'active' | 'received' | 'sent'>('active');
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [activeConnections, setActiveConnections] = useState<any[]>([]);

  // Load Sent Requests and Active Connections from LocalStorage
  useEffect(() => {
     if (!currentUserId) return;

     const loadData = () => {
         const allRels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
         
         // 1. Sent Requests
         const sent = allRels.filter((r: any) => r.fromUserId === currentUserId && r.status !== 'blocked' && r.status !== 'connected');
         const sentMapped = sent.map((r: any) => ({
             id: r.toUserId,
             name: r.toUserName, 
             img: r.toUserImg,
             status: r.status,
             time: r.timestamp
         }));
         setSentRequests(sentMapped);

         // 2. Active Connections
         const active = allRels.filter((r: any) => 
            (r.fromUserId === currentUserId || r.toUserId === currentUserId) && 
            r.status === 'connected'
         );
         const activeMapped = active.map((r: any) => {
             // Determine partner details
             const isMeSender = r.fromUserId === currentUserId;
             return {
                 id: isMeSender ? r.toUserId : r.fromUserId,
                 name: isMeSender ? r.toUserName : r.fromUserName,
                 img: isMeSender ? r.toUserImg : r.fromUserImg,
                 status: 'connected',
                 time: r.timestamp
             };
         });
         setActiveConnections(activeMapped);
     };

     loadData();
     const interval = setInterval(loadData, 3000); 
     return () => clearInterval(interval);
  }, [currentUserId]);

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'connected': 
              return <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1"><CheckCircle size={12} /> Accepted</span>;
          case 'rejected':
              return <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-1"><Ban size={12} /> Declined</span>;
          case 'pending_admin':
              return <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center gap-1"><Shield size={12} /> Admin Review</span>;
          default:
              return <span className="text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full flex items-center gap-1"><Clock size={12} /> Pending</span>;
      }
  };
  
  // Filter out any requests that might have slipped through that aren't pending
  const pendingReceived = requests.filter(r => r.status === undefined || r.status === 'pending');

  return (
    <div className="space-y-6">
      <PageHeader title="Connections" subtitle="Manage your network and requests." icon={<Users className="text-purple-600 dark:text-gold-400" size={32} />} />
      
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit overflow-x-auto">
        <button onClick={() => setTab('active')} className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${tab === 'active' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow' : 'text-gray-500'}`}>Active ({activeConnections.length})</button>
        <button onClick={() => setTab('received')} className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${tab === 'received' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow' : 'text-gray-500'}`}>Received ({pendingReceived.length})</button>
        <button onClick={() => setTab('sent')} className={`px-6 py-2 rounded-lg text-sm font-bold whitespace-nowrap ${tab === 'sent' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow' : 'text-gray-500'}`}>Sent ({sentRequests.length})</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* ACTIVE CONNECTIONS TAB */}
        {tab === 'active' && (
           activeConnections.length === 0 ? (
               <div className="col-span-full py-20 text-center text-gray-500 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>You have no active connections yet.</p>
                  <p className="text-xs mt-2">Start accepting requests to build your network!</p>
               </div>
           ) : (
               activeConnections.map((conn) => (
                   <motion.div 
                      key={conn.id}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center gap-4 hover:shadow-md transition-all group"
                   >
                      <img src={conn.img || 'https://i.pravatar.cc/150'} className="w-16 h-16 rounded-full object-cover border-2 border-green-500/20" onClick={() => onViewProfile(conn)} />
                      <div className="flex-1">
                         <h4 className="font-bold text-gray-900 dark:text-white">{conn.name || 'User'}</h4>
                         <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-2 flex items-center gap-1"><CheckCircle size={10} /> Connected</p>
                         <div className="flex gap-2">
                             <button onClick={() => onViewProfile(conn)} className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 text-xs font-bold rounded-lg hover:bg-purple-100 transition-colors flex-1">View Profile</button>
                             <button className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors flex-1">Message</button>
                         </div>
                      </div>
                   </motion.div>
               ))
           )
        )}

        {/* RECEIVED TAB */}
        {tab === 'received' && pendingReceived.length === 0 && (
           <div className="col-span-full py-20 text-center text-gray-500 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
              <UserPlus size={48} className="mx-auto mb-4 opacity-50" />
              <p>No new requests.</p>
           </div>
        )}
        {tab === 'received' && pendingReceived.map((req) => (
          <motion.div 
            key={req.id} 
            layout
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="flex gap-4">
              <img src={req.img} alt={req.name} className="w-16 h-16 rounded-xl object-cover cursor-pointer" onClick={() => onViewProfile(req)} />
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{req.name}, {req.age}</h4>
                <p className="text-xs text-gray-500">{req.profession}</p>
                <p className="text-xs text-gray-400">{req.location}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => onAccept(req.id)} className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors">Accept</button>
              <button onClick={() => onDecline(req.id)} className="flex-1 py-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors">Decline</button>
            </div>
          </motion.div>
        ))}

        {/* SENT TAB */}
        {tab === 'sent' && (
           sentRequests.length === 0 ? (
               <div className="col-span-full py-20 text-center text-gray-500 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                  <Send size={48} className="mx-auto mb-4 opacity-50" />
                  <p>You haven't sent any requests yet.</p>
                  <p className="text-xs mt-2">Start searching to find matches!</p>
               </div>
           ) : (
               sentRequests.map((req) => (
                   <motion.div 
                      key={req.id}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center gap-4 hover:shadow-md transition-all"
                   >
                      <img src={req.img || 'https://i.pravatar.cc/150'} className="w-16 h-16 rounded-full object-cover" />
                      <div className="flex-1">
                         <h4 className="font-bold text-gray-900 dark:text-white">{req.name || 'Unknown User'}</h4>
                         <p className="text-xs text-gray-500 mb-2">{req.time}</p>
                         {getStatusBadge(req.status)}
                      </div>
                   </motion.div>
               ))
           )
        )}
      </div>
    </div>
  );
};

// ... BlockedUsersView, InterestsView, ShortlistView, ActivityView remain unchanged ...
// --- BLOCKED USERS VIEW ---
export const BlockedUsersView: React.FC<{
    currentUserId?: string;
    onUnblock: (id: string) => void;
}> = ({ currentUserId, onUnblock }) => {
    const [blockedList, setBlockedList] = useState<any[]>([]);

    useEffect(() => {
        if (!currentUserId) return;
        const loadBlocked = () => {
            const allRels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
            const blocked = allRels.filter((r: any) => r.fromUserId === currentUserId && r.status === 'blocked');
            
            const mapped = blocked.map((r: any) => ({
                id: r.toUserId,
                name: r.toUserName || 'Blocked User',
                img: r.toUserImg || 'https://i.pravatar.cc/150?u=blocked',
                date: r.timestamp
            }));
            setBlockedList(mapped);
        };
        loadBlocked();
    }, [currentUserId]);

    return (
        <div className="space-y-6">
            <PageHeader title="Blocked Profiles" subtitle="Manage users you have blocked." icon={<Ban className="text-red-500" size={32} />} />
            
            <div className="bg-white/60 dark:bg-white/5 rounded-[2.5rem] p-6 shadow-xl border border-white/20 dark:border-white/10 min-h-[400px]">
                {blockedList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
                        <Shield size={48} className="mb-4 opacity-20" />
                        <p>You haven't blocked anyone yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blockedList.map((user) => (
                            <motion.div 
                                key={user.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-4 p-4 bg-white dark:bg-black/20 rounded-2xl border border-red-100 dark:border-red-900/20"
                            >
                                <img src={user.img} className="w-12 h-12 rounded-full object-cover grayscale" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{user.name}</h4>
                                    <p className="text-xs text-gray-500">Blocked on {new Date(user.date).toLocaleDateString()}</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        onUnblock(user.id);
                                        setBlockedList(prev => prev.filter(b => b.id !== user.id));
                                    }}
                                    className="p-2 text-sm font-bold text-gray-500 hover:text-green-600 bg-gray-100 hover:bg-green-50 dark:bg-white/5 dark:hover:bg-green-900/20 rounded-xl transition-colors flex items-center gap-1"
                                >
                                    <Unlock size={14} /> Unblock
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// ... InterestsView, ShortlistView, ActivityView code remains unchanged ...
// --- INTERESTS VIEW (UPDATED LOGIC) ---
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

export const InterestsView: React.FC<{ 
  currentUserId?: string;
  onViewProfile: (profile: Profile) => void; 
}> = ({ currentUserId, onViewProfile }) => {
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [relationships, setRelationships] = useState<RelationshipItem[]>([]);

  useEffect(() => {
      const loadRelationships = () => {
          const allRels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
          setRelationships(allRels);
      };
      loadRelationships();
      const interval = setInterval(loadRelationships, 2000); // Poll for admin updates
      return () => clearInterval(interval);
  }, []);

  const handleAcceptInterest = (relId: string) => {
      const updated = relationships.map(r => r.id === relId ? { ...r, status: 'accepted_by_user' as const } : r);
      localStorage.setItem('mdm_relationships', JSON.stringify(updated));
      setRelationships(updated);
      alert("Interest Accepted! Waiting for Admin to Shortlist.");
  };

  const myReceived = relationships.filter(r => r.toUserId === currentUserId && (r.status === 'approved_by_admin' || r.status === 'accepted_by_user'));
  const mySent = relationships.filter(r => r.fromUserId === currentUserId && (r.status.includes('admin') || r.status.includes('accepted') || r.status.includes('shortlist')));

  return (
    <div className="space-y-6">
      <PageHeader title="Interests" subtitle="Track interests approved by admin." icon={<Heart className="text-pink-500" size={32} />} />
      
      <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
        <button onClick={() => setTab('received')} className={`px-6 py-2 rounded-lg text-sm font-bold ${tab === 'received' ? 'bg-white dark:bg-gray-800 text-pink-600 dark:text-white shadow' : 'text-gray-500'}`}>Received</button>
        <button onClick={() => setTab('sent')} className={`px-6 py-2 rounded-lg text-sm font-bold ${tab === 'sent' ? 'bg-white dark:bg-gray-800 text-pink-600 dark:text-white shadow' : 'text-gray-500'}`}>Sent</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {/* RECEIVED TAB */}
         {tab === 'received' && (
             myReceived.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500 bg-white/40 dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                   <Heart size={48} className="mx-auto mb-4 opacity-50 text-pink-400" />
                   <p>No new interests approved by Admin yet.</p>
                </div>
             ) : (
                myReceived.map((rel) => (
                   <motion.div 
                      key={rel.id}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center gap-4 hover:shadow-md transition-all"
                   >
                      <img src={rel.fromUserImg} className="w-16 h-16 rounded-full object-cover" />
                      <div className="flex-1">
                         <h4 className="font-bold text-gray-900 dark:text-white">{rel.fromUserName}</h4>
                         <p className="text-xs text-gray-500">{rel.timestamp}</p>
                         
                         {rel.status === 'approved_by_admin' ? (
                             <div className="flex gap-2 mt-2">
                                <button onClick={() => handleAcceptInterest(rel.id)} className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600">Accept</button>
                                <button className="px-3 py-1 bg-gray-200 dark:bg-white/10 text-gray-600 text-xs font-bold rounded-lg">Ignore</button>
                             </div>
                         ) : (
                             <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold mt-2 inline-block flex items-center gap-1 w-fit">
                                <CheckCircle size={10} /> Waiting for Admin
                             </span>
                         )}
                      </div>
                   </motion.div>
                ))
             )
         )}

         {/* SENT TAB */}
         {tab === 'sent' && (
             mySent.length === 0 ? (
                <div className="col-span-full py-20 text-center text-gray-500">No interests sent yet.</div>
             ) : (
                mySent.map((rel) => (
                   <motion.div key={rel.id} className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
                      <img src={rel.toUserImg} className="w-16 h-16 rounded-full object-cover" />
                      <div>
                         <h4 className="font-bold text-gray-900 dark:text-white">{rel.toUserName}</h4>
                         <div className="mt-2">
                            {rel.status === 'pending_admin' && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold flex items-center gap-1"><Shield size={10} /> Admin Review</span>}
                            {rel.status === 'approved_by_admin' && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">Sent to User</span>}
                            {rel.status === 'accepted_by_user' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">User Accepted</span>}
                            {rel.status === 'shortlisted_by_admin' && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">Match Shortlisted!</span>}
                         </div>
                      </div>
                   </motion.div>
                ))
             )
         )}
      </div>
    </div>
  );
};

// ... ShortlistView code remains unchanged ...
// --- SHORTLIST VIEW (UPDATED LOGIC) ---
export const ShortlistView: React.FC<{ 
  currentUserId?: string;
  bookmarkedProfiles: Profile[];
  onViewProfile: (p: Profile) => void;
  onMessage?: (p: Profile) => void; // New Prop
}> = ({ currentUserId, bookmarkedProfiles, onViewProfile, onMessage }) => {
  const [adminMatches, setAdminMatches] = useState<RelationshipItem[]>([]);

  useEffect(() => {
     if(!currentUserId) return;
     const allRels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
     const matches = allRels.filter((r: RelationshipItem) => 
        r.status === 'shortlisted_by_admin' && 
        (r.fromUserId === currentUserId || r.toUserId === currentUserId)
     );
     setAdminMatches(matches);
  }, [currentUserId]);

  const convertToProfile = (match: RelationshipItem): Profile => {
     const isSender = match.fromUserId === currentUserId;
     return {
         id: isSender ? match.toUserId : match.fromUserId,
         name: isSender ? match.toUserName : match.fromUserName,
         img: isSender ? match.toUserImg : match.fromUserImg,
         age: 26, // Mock default if not stored in relation
         occupation: 'Matched Profile',
         location: 'Visible in Profile',
         matchScore: 95,
         // ... rest of defaults for type safety
         height: '', heightCm: 0, education: '', income: '', religion: '', caste: '', gothram: '', raasi: '', nakshatra: '', maritalStatus: '', motherTongue: '', diet: '', smoking: '', drinking: '', about: '', hobbies: [], familyType: '', fatherJob: '', images: [], isPremium: true, isVerified: true, lastActive: ''
     };
  };

  return (
    <div className="space-y-8">
      
      {/* 1. ADMIN FINALIZED MATCHES */}
      <div>
          <PageHeader title="It's a Match!" subtitle="Profiles shortlisted by Admin for you." icon={<Sparkles className="text-purple-500" size={32} />} />
          
          {adminMatches.length === 0 ? (
             <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30 text-center">
                <p className="text-purple-800 dark:text-purple-200 text-sm font-medium">No admin-finalized matches yet. Keep interacting!</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminMatches.map(match => {
                   const isSender = match.fromUserId === currentUserId;
                   const partnerName = isSender ? match.toUserName : match.fromUserName;
                   const partnerImg = isSender ? match.toUserImg : match.fromUserImg;
                   
                   return (
                      <div key={match.id} className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                         <div className="flex items-center gap-4 relative z-10">
                            <img src={partnerImg} className="w-16 h-16 rounded-full border-4 border-white/20" />
                            <div>
                               <h3 className="font-bold text-lg">{partnerName}</h3>
                               <p className="text-xs text-purple-200">Official Match</p>
                            </div>
                         </div>
                         <div className="mt-6 pt-4 border-t border-white/10 flex gap-2 relative z-10">
                             <button 
                                onClick={() => onMessage && onMessage(convertToProfile(match))}
                                className="flex-1 py-2 bg-white text-purple-900 font-bold rounded-lg text-xs hover:bg-purple-50"
                             >
                                Message
                             </button>
                             <button 
                                onClick={() => onViewProfile(convertToProfile(match))}
                                className="flex-1 py-2 bg-purple-800 text-white font-bold rounded-lg text-xs hover:bg-purple-900"
                             >
                                View Profile
                             </button>
                         </div>
                      </div>
                   )
                })}
             </div>
          )}
      </div>

      {/* 2. USER BOOKMARKS (Legacy) */}
      <div className="pt-8 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Star size={20} className="text-amber-500" /> Your Bookmarks</h3>
          
          {bookmarkedProfiles.length === 0 ? (
             <p className="text-gray-500 text-sm">You haven't bookmarked any profiles manually.</p>
          ) : (
             <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {bookmarkedProfiles.map((profile, idx) => (
                   <MatchCard 
                      key={profile.id} 
                      match={{...profile, job: profile.occupation, image: profile.img}} 
                      delay={idx * 0.05}
                      onConnect={() => {}} // Disabled in bookmark view usually, or can pass handler
                      onViewProfile={() => onViewProfile(profile)}
                   />
                ))}
             </div>
          )}
      </div>
    </div>
  );
};

// ... ActivityView code remains unchanged ...
export const ActivityView: React.FC<{ activityLog: ActivityLog[] }> = ({ activityLog }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader title="Activity Timeline" subtitle="Your recent interactions and history." icon={<Clock className="text-blue-500" size={32} />} />
      
      <div className="bg-white/60 dark:bg-white/5 rounded-[2.5rem] p-8 border border-white/20 dark:border-white/10 shadow-xl relative">
         <div className="absolute top-8 left-8 bottom-8 w-0.5 bg-gray-200 dark:bg-white/10" />
         
         <div className="space-y-8">
            {activityLog.length === 0 && <p className="text-center text-gray-500 pl-8">No activity recorded yet.</p>}
            {activityLog.map((log) => (
               <motion.div 
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="relative pl-10 group"
               >
                  <div className={`absolute left-[-5px] top-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                     log.type === 'connect' ? 'bg-purple-600' : 
                     log.type === 'interest' ? 'bg-pink-500' :
                     log.type === 'shortlist' ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                  
                  <div className="bg-white dark:bg-black/20 p-4 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-purple-200 transition-colors">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                           {log.profileImage && <img src={log.profileImage} className="w-10 h-10 rounded-full object-cover" />}
                           <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                 {log.description} 
                                 {log.profileName && <span className="text-purple-600 dark:text-gold-400"> • {log.profileName}</span>}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{log.type}</p>
                           </div>
                        </div>
                        <span className="text-xs font-mono text-gray-400">{log.timestamp}</span>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};

// --- EVENTS VIEW ---
export const EventsView: React.FC = () => {
   const [events, setEvents] = useState<any[]>([]);

   useEffect(() => {
     // Fetch from LocalStorage
     const loadEvents = () => {
        const storedEvents = JSON.parse(localStorage.getItem('mdm_events') || '[]');
        setEvents(storedEvents);
     };
     loadEvents();
     // Simple polling to update if admin adds something
     const interval = setInterval(loadEvents, 5000);
     return () => clearInterval(interval);
   }, []);

   return (
      <div className="space-y-8">
         <PageHeader title="Community Events" subtitle="Meetups, webinars, and gatherings." icon={<Calendar className="text-orange-500" size={32} />} />
         
         {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
                <Inbox size={48} className="opacity-20 mb-4" />
                <p>No upcoming events at the moment.</p>
                <p className="text-xs">Check back later for community gatherings.</p>
            </div>
         ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, idx) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    >
                        <EventCard event={event} />
                    </motion.div>
                ))}
            </div>
         )}
      </div>
   );
};

// ... VisitorsView code remains unchanged ...
// --- VISITORS VIEW ---
export const VisitorsView: React.FC<{ visitors: Visitor[] }> = ({ visitors }) => {
   return (
      <div className="space-y-6">
         <PageHeader title="Recent Visitors" subtitle="See who viewed your profile." icon={<Eye className="text-blue-500" size={32} />} />
         
         <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-6 shadow-xl">
            <div className="overflow-x-auto">
               <table className="w-full">
                  <thead>
                     <tr className="border-b border-gray-200 dark:border-white/10 text-left text-xs font-bold uppercase text-gray-500">
                        <th className="pb-4 pl-4">Profile</th>
                        <th className="pb-4">Details</th>
                        <th className="pb-4">Visit Time</th>
                        <th className="pb-4">Count</th>
                        <th className="pb-4">Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {visitors.map((v) => (
                        <tr key={v.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors group">
                           <td className="py-4 pl-4">
                              <div className="flex items-center gap-3">
                                 <img src={v.profile.img} className="w-12 h-12 rounded-full object-cover" />
                                 <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{v.profile.name}</p>
                                    <p className="text-xs text-gray-500">{v.profile.id}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-4 text-sm text-gray-600 dark:text-gray-300">
                              {v.profile.age} Yrs, {v.profile.occupation}
                           </td>
                           <td className="py-4 text-sm text-gray-500 font-mono">
                              {v.visitTime}
                           </td>
                           <td className="py-4 text-sm font-bold text-purple-600 dark:text-gold-400">
                              {v.visitCount}x
                           </td>
                           <td className="py-4">
                              <button className="text-xs font-bold text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                 View Profile
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};
