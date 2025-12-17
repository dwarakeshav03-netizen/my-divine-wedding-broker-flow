
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Phone, Video, Search, MoreVertical, Send, Plus, 
  ArrowLeft, Shield, Lock, MicOff, PhoneOff, VideoOff, AlertTriangle, Sparkles, User, FileText, Calendar, PenTool, Users,
  UserPlus, CheckCheck, Ban
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import AudioProfile from './AudioProfile';
import { AnimatedInput, AnimatedTextArea } from '../profile/ProfileFormElements';
import PremiumButton from '../ui/PremiumButton';
import { Profile } from '../../utils/mockData';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'call_log';
  read: boolean;
}

interface Thread {
  id: string;
  user: { 
    id: string;
    name: string; 
    role: string; 
    img: string; 
    online: boolean; 
  };
  lastMessage: string;
  time: string;
  unread: number;
  isUrgent: boolean;
  status: 'active' | 'scheduled';
  messages: Message[];
}

interface CommunicationCenterProps {
  mode?: 'user' | 'parent';
  currentUser?: any;
  initialChatPartner?: Profile | null;
}

const CommunicationCenter: React.FC<CommunicationCenterProps> = ({ mode = 'user', currentUser, initialChatPartner }) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
  const [activeThreadId, setActiveThreadId] = useState<string | null>(initialChatPartner?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCall, setActiveCall] = useState<{ type: 'audio' | 'video', user: any, status: 'ringing' | 'connected' } | null>(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(false); // Default closed on small screens
  const [messageInput, setMessageInput] = useState('');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load Data
  useEffect(() => {
    if (!currentUser) return;

    const loadChats = () => {
      const allMessages: Message[] = JSON.parse(localStorage.getItem('mdm_messages') || '[]');
      const allUsers = JSON.parse(localStorage.getItem('mdm_users') || '[]');
      
      const partnerIds = new Set<string>();
      allMessages.forEach(m => {
        if (m.senderId === currentUser.id) partnerIds.add(m.receiverId);
        if (m.receiverId === currentUser.id) partnerIds.add(m.senderId);
      });

      const loadedThreads: Thread[] = Array.from(partnerIds).map(partnerId => {
        const partner = allUsers.find((u: any) => u.id === partnerId) || { id: partnerId, name: 'Unknown', avatar: '' };
        const threadMessages = allMessages.filter(m => 
          (m.senderId === currentUser.id && m.receiverId === partnerId) || 
          (m.senderId === partnerId && m.receiverId === currentUser.id)
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const lastMsg = threadMessages[threadMessages.length - 1];
        const unreadCount = threadMessages.filter(m => m.receiverId === currentUser.id && !m.read).length;

        return {
          id: partnerId,
          user: {
            id: partner.id,
            name: partner.name,
            role: 'Match',
            img: partner.avatar || `https://ui-avatars.com/api/?name=${partner.name || 'Unknown'}&background=random`,
            online: Math.random() > 0.5
          },
          lastMessage: lastMsg ? lastMsg.text : 'Start conversation',
          time: lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          unread: unreadCount,
          isUrgent: false,
          status: 'active',
          messages: threadMessages
        };
      });

      if (initialChatPartner && !loadedThreads.find(t => t.id === initialChatPartner.id)) {
        loadedThreads.unshift({
           id: initialChatPartner.id,
           user: {
             id: initialChatPartner.id,
             name: initialChatPartner.name,
             role: 'Match',
             img: initialChatPartner.img,
             online: true
           },
           lastMessage: 'Start a conversation',
           time: 'Now',
           unread: 0,
           isUrgent: false,
           status: 'active',
           messages: []
        });
      }

      setThreads(loadedThreads);
    };

    loadChats();
    const interval = setInterval(loadChats, 3000);
    return () => clearInterval(interval);

  }, [currentUser, initialChatPartner]);

  useEffect(() => {
    if (initialChatPartner) {
        setActiveThreadId(initialChatPartner.id);
    }
  }, [initialChatPartner]);

  useEffect(() => {
     if(activeThreadId && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
     }
  }, [threads, activeThreadId]);

  const activeThread = threads.find(t => t.id === activeThreadId);
  const filteredThreads = threads.filter(t => t.user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const isBlocked = useMemo(() => {
    if (!currentUser || !activeThreadId) return false;
    const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
    return rels.some((r: any) => 
        r.fromUserId === currentUser.id && 
        r.toUserId === activeThreadId && 
        r.status === 'blocked'
    );
  }, [currentUser, activeThreadId]);

  const handleSendMessage = () => {
      if (!messageInput.trim() || !currentUser || !activeThreadId || isBlocked) return;

      const newMessage: Message = {
          id: Date.now().toString(),
          senderId: currentUser.id,
          receiverId: activeThreadId,
          text: messageInput,
          timestamp: new Date().toISOString(),
          type: 'text',
          read: false
      };

      const updatedThreads = threads.map(t => {
          if(t.id === activeThreadId) {
             return { ...t, messages: [...t.messages, newMessage], lastMessage: newMessage.text, time: 'Just now' };
          }
          return t;
      });
      setThreads(updatedThreads);
      setMessageInput('');

      const allMessages = JSON.parse(localStorage.getItem('mdm_messages') || '[]');
      localStorage.setItem('mdm_messages', JSON.stringify([...allMessages, newMessage]));
  };

  const startCall = (type: 'audio' | 'video', user: any) => {
    if (isBlocked) {
        alert("You cannot call a blocked user.");
        return;
    }
    setActiveCall({ type, user, status: 'ringing' });
    const callMsg: Message = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        receiverId: user.id,
        text: `${type === 'video' ? 'Video' : 'Audio'} call started`,
        timestamp: new Date().toISOString(),
        type: 'call_log',
        read: true
    };
    const allMessages = JSON.parse(localStorage.getItem('mdm_messages') || '[]');
    localStorage.setItem('mdm_messages', JSON.stringify([...allMessages, callMsg]));

    setTimeout(() => {
        setActiveCall(prev => prev ? { ...prev, status: 'connected' } : null);
    }, 3000); 
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const generateAiReply = async () => {
      if (!activeThread || activeThread.messages.length === 0 || isBlocked) return;
      setAiLoading(true);
      try {
          const apiKey = process.env.API_KEY;
          if (apiKey) {
              const ai = new GoogleGenAI({ apiKey });
              const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
              const lastPartnerMsg = [...activeThread.messages].reverse().find(m => m.senderId !== currentUser.id);
              if(lastPartnerMsg) {
                 const prompt = `Act as a user on a matrimony site. Draft a polite reply to: "${lastPartnerMsg.text}". Keep it under 2 sentences.`;
                 const result = await model.generateContent(prompt);
                 setMessageInput(result.response.text());
              }
          } else {
              setMessageInput("That sounds great! I would love to discuss further.");
          }
      } catch (e) {
          console.error(e);
      } finally {
          setAiLoading(false);
      }
  };

  const tabs = [
    { id: 'chats', icon: MessageSquare, label: 'Chats' },
    { id: 'requests', icon: UserPlus, label: 'Requests' }
  ];

  return (
    // Use dvh for mobile viewport height to handle address bars correctly
    <div className="flex flex-col md:flex-row h-[calc(100dvh-120px)] md:h-[calc(100vh-140px)] min-h-[500px] bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative">
      
      {/* SIDEBAR LIST - Hidden on mobile if thread active */}
      <div className={`
        w-full md:w-80 flex-col border-r border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20
        ${activeThreadId ? 'hidden md:flex' : 'flex'}
      `}>
        {/* Header Tabs */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10">
           <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl mb-4 overflow-x-auto">
              {tabs.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex-1 min-w-[70px] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                      activeTab === tab.id 
                      ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                   }`}
                 >
                    <tab.icon size={14} /> {tab.label}
                 </button>
              ))}
           </div>
           
           <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-purple-500/50 transition-colors"
              />
           </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {activeTab === 'chats' && (
              <div className="p-2 space-y-1">
                {filteredThreads.length === 0 && (
                   <div className="text-center p-8 text-gray-500 text-sm">No conversations yet. Start connecting!</div>
                )}
                {filteredThreads.map(thread => (
                   <div 
                      key={thread.id}
                      onClick={() => setActiveThreadId(thread.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all hover:bg-white dark:hover:bg-white/5 border border-transparent ${activeThreadId === thread.id ? 'bg-white dark:bg-white/5 shadow-sm border-gray-200 dark:border-white/5' : ''}`}
                   >
                      <div className="flex justify-between items-start mb-1">
                         <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${thread.unread > 0 ? 'bg-purple-500' : 'bg-transparent'}`} />
                            <h4 className={`text-sm font-bold ${thread.unread > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{thread.user.name}</h4>
                            {thread.isUrgent && <AlertTriangle size={12} className="text-red-500" />}
                         </div>
                         <span className="text-[10px] text-gray-400">{thread.time}</span>
                      </div>
                      <div className="flex items-start gap-3 pl-4">
                         <img src={thread.user.img} className="w-10 h-10 rounded-full object-cover shrink-0" />
                         <div className="min-w-0">
                            <p className={`text-xs truncate ${thread.unread > 0 ? 'font-bold text-gray-800 dark:text-gray-200' : 'font-medium text-gray-500'}`}>
                               {thread.lastMessage}
                            </p>
                         </div>
                      </div>
                   </div>
                ))}
              </div>
           )}
           {activeTab === 'requests' && <RequestList />}
        </div>
      </div>

      {/* ACTIVE VIEW (Chat Interface) */}
      <div className={`
         flex-1 flex-col bg-white/30 dark:bg-transparent h-full
         ${!activeThreadId ? 'hidden md:flex' : 'flex'}
      `}>
         {activeThread ? (
            <ChatInterface 
               activeThread={activeThread}
               onBack={() => setActiveThreadId(null)}
               messageInput={messageInput}
               setMessageInput={setMessageInput}
               handleSendMessage={handleSendMessage}
               generateAiReply={generateAiReply}
               aiLoading={aiLoading}
               rightPanelOpen={rightPanelOpen}
               setRightPanelOpen={setRightPanelOpen}
               startCall={startCall}
               isParent={mode === 'parent'}
               currentUser={currentUser}
               isBlocked={isBlocked}
            />
         ) : activeTab === 'requests' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-600 mb-4">
                  <UserPlus size={40} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Connection Requests</h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">Manage incoming interests here. Accept to start a conversation.</p>
            </div>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
               <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <MessageSquare size={40} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select a conversation</h3>
               <p className="text-gray-500 dark:text-gray-400 mt-2">Choose a chat from the list or start a new one.</p>
            </div>
         )}
      </div>

      {/* RIGHT: Context Panel (Desktop Only for now) */}
      <AnimatePresence>
         {activeThread && rightPanelOpen && (
            <motion.div 
               initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
               className="hidden lg:flex flex-col border-l border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20 overflow-hidden"
            >
               <div className="p-6 border-b border-gray-200 dark:border-white/10 text-center">
                  <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden mb-4 shadow-lg">
                     <img src={activeThread.user.img} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg">{activeThread.user.name}</h3>
                  <p className="text-xs text-gray-500">{activeThread.user.id} • {activeThread.user.role}</p>
                  <div className="flex justify-center gap-2 mt-4">
                     <button className="p-2 bg-white dark:bg-white/5 rounded-lg text-purple-600 hover:scale-110 transition-transform"><User size={18} /></button>
                     <button className="p-2 bg-white dark:bg-white/5 rounded-lg text-purple-600 hover:scale-110 transition-transform"><FileText size={18} /></button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Notes */}
                  <div>
                     <h4 className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1"><PenTool size={12} /> Private Notes</h4>
                     <textarea 
                        className="w-full h-24 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-xl p-3 text-xs text-gray-700 dark:text-gray-300 resize-none outline-none focus:border-yellow-400"
                        placeholder="Add notes about this match..."
                     />
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* OVERLAY: ACTIVE CALL */}
      <AnimatePresence>
         {activeCall && (
            <CallOverlay 
               type={activeCall.type} 
               user={activeCall.user} 
               status={activeCall.status} 
               onEnd={endCall} 
               isParent={mode === 'parent'}
            />
         )}
      </AnimatePresence>

    </div>
  );
};

// --- SUB-COMPONENTS ---

const RequestList: React.FC = () => {
   const requests = [
      { id: 1, name: "Arun K", profession: "Engineer", location: "Bangalore", img: "https://ui-avatars.com/api/?name=Arun+K&background=random" },
      { id: 2, name: "Vijay S", profession: "Doctor", location: "Chennai", img: "https://ui-avatars.com/api/?name=Vijay+S&background=random" }
   ];

   return (
      <div className="p-2 space-y-3">
         {requests.map(req => (
            <div key={req.id} className="bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
               <div className="flex items-center gap-3 mb-3">
                  <img src={req.img} alt={req.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                     <h4 className="font-bold text-sm text-gray-900 dark:text-white">{req.name}</h4>
                     <p className="text-xs text-gray-500">{req.profession}, {req.location}</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700">Accept</button>
                  <button className="flex-1 py-1.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg hover:bg-gray-200">Decline</button>
               </div>
            </div>
         ))}
      </div>
   );
};

interface ChatInterfaceProps {
    activeThread: Thread;
    onBack: () => void;
    messageInput: string;
    setMessageInput: (val: string) => void;
    handleSendMessage: () => void;
    generateAiReply: () => void;
    aiLoading: boolean;
    rightPanelOpen: boolean;
    setRightPanelOpen: (val: boolean) => void;
    startCall: (type: 'audio' | 'video', user: any) => void;
    isParent?: boolean;
    currentUser: any;
    isBlocked?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
    activeThread, onBack, messageInput, setMessageInput, handleSendMessage, 
    generateAiReply, aiLoading, rightPanelOpen, setRightPanelOpen, startCall, isParent, currentUser, isBlocked
}) => {
   const messagesEndRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [activeThread.messages]);

   return (
      <div className="flex flex-col h-full w-full">
         {/* Chat Header */}
         <div className="h-16 border-b border-gray-200 dark:border-white/10 flex justify-between items-center px-4 md:px-6 shrink-0 bg-white/50 dark:bg-black/20 backdrop-blur-md">
            <div className="flex items-center gap-3">
               <button onClick={onBack} className="md:hidden p-2 -ml-2 text-gray-500 hover:text-purple-600 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"><ArrowLeft size={20} /></button>
               <div className="relative">
                  <img src={activeThread.user.img} alt={activeThread.user.name} className="w-10 h-10 rounded-full object-cover" />
                  {activeThread.user.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full" />}
               </div>
               <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight truncate">{activeThread.user.name}</h3>
                  <p className="text-xs text-green-500 font-medium">{activeThread.user.online ? 'Online' : 'Offline'}</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => startCall('audio', activeThread.user)} disabled={isBlocked} className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50">
                    <Phone size={18} />
                </button>
                <button onClick={() => startCall('video', activeThread.user)} disabled={isBlocked} className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50">
                    <Video size={18} />
                </button>
               <button onClick={() => setRightPanelOpen(!rightPanelOpen)} className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full hidden lg:block transition-colors">
                  <MoreVertical size={18} />
               </button>
            </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/30 dark:bg-black/10">
            {/* System Notice */}
            <div className="flex justify-center">
               <span className="text-[10px] bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full border border-yellow-100 dark:border-yellow-900/20 flex items-center gap-1">
                  <Shield size={10} /> Secure & Private
               </span>
            </div>

            {isParent && (
               <div className="flex justify-center my-2">
                  <span className="text-[10px] bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/20">
                     Parent Mode Active
                  </span>
               </div>
            )}

            {activeThread.messages.map((msg: Message) => (
               msg.type === 'call_log' ? (
                  <div key={msg.id} className="flex justify-center my-4">
                     <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 dark:bg-white/5 px-4 py-1.5 rounded-full">
                        <Phone size={12} /> {msg.text}
                     </div>
                  </div>
               ) : (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                        msg.senderId === currentUser.id 
                        ? 'bg-purple-600 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5'
                     }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <div className={`flex items-center gap-1 justify-end mt-1 text-[10px] ${msg.senderId === currentUser.id ? 'text-purple-200' : 'text-gray-400'}`}>
                           <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           {msg.senderId === currentUser.id && (
                              <CheckCheck size={12} />
                           )}
                        </div>
                     </div>
                  </div>
               )
            ))}
            <div ref={messagesEndRef} />
         </div>

         {/* Input Area */}
         {isBlocked ? (
            <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 text-red-500 font-bold mb-1">
                    <Ban size={18} /> Blocked
                </div>
                <p className="text-xs text-gray-500">You cannot contact this user.</p>
            </div>
         ) : (
            <div className="p-3 md:p-4 bg-white dark:bg-black/20 border-t border-gray-200 dark:border-white/10">
                {/* AI & Quick Actions */}
                <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar pb-1">
                    <button 
                    onClick={generateAiReply}
                    disabled={aiLoading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold whitespace-nowrap hover:shadow-sm transition-all shrink-0"
                    >
                    <Sparkles size={12} className={aiLoading ? 'animate-spin' : ''} />
                    {aiLoading ? 'Drafting...' : 'Magic Reply'}
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-gray-200 shrink-0">
                        <Calendar size={12} /> Schedule
                    </button>
                </div>

                <div className="flex items-end gap-2 bg-gray-100 dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/5 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
                    <button className="p-2 text-gray-400 hover:text-purple-600 shrink-0"><Plus size={20} /></button>
                    <textarea 
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none outline-none text-sm resize-none max-h-32 py-2 text-gray-900 dark:text-white placeholder-gray-400 min-h-[40px]"
                        rows={1}
                    />
                    <div className="flex gap-1 shrink-0">
                        <button onClick={handleSendMessage} className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-500/30 transition-all active:scale-95">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>
         )}
      </div>
  );
};

const CallOverlay: React.FC<{ type: 'audio' | 'video', user: any, status: string, onEnd: () => void, isParent?: boolean }> = ({ type, user, status, onEnd, isParent }) => {
   return (
      <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
         className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-white"
      >
         <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20 mb-6 relative z-10">
               <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
            </div>
            {status === 'ringing' && (
               <>
                  <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 rounded-full bg-purple-500/50 -z-10" />
                  <motion.div animate={{ scale: [1, 2], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} className="absolute inset-0 rounded-full bg-purple-500/30 -z-10" />
               </>
            )}
         </div>

         {isParent && (
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-4 animate-pulse">
               Parent-to-Parent Call
            </div>
         )}

         <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">{user.name}</h2>
         <p className="text-purple-300 animate-pulse mb-12 capitalize">{status}...</p>

         <div className="flex items-center gap-6">
            <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"><MicOff size={24} /></button>
            <button 
               onClick={onEnd}
               className="p-6 rounded-full bg-red-500 hover:bg-red-600 shadow-xl shadow-red-500/30 transform hover:scale-110 transition-all"
            >
               <PhoneOff size={32} fill="currentColor" />
            </button>
            <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
               {type === 'video' ? <VideoOff size={24} /> : <User size={24} />}
            </button>
         </div>
         
         <div className="absolute bottom-8 text-xs text-white/30 flex items-center gap-2">
            <Shield size={12} /> Secure Line • End-to-end encrypted
         </div>
      </motion.div>
   )
}

export default CommunicationCenter;
