
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Plus, ArrowLeft, Send, Paperclip, 
  CheckCircle, Clock, MoreVertical, X, Headphones, FileText, ChevronRight 
} from 'lucide-react';
import { MOCK_TICKETS, SupportTicket } from '../../utils/adminData';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedSelect, AnimatedTextArea } from '../profile/ProfileFormElements';
import { GoogleGenAI } from "@google/genai";

const SupportChat: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  // New Ticket Form State
  const [newTicket, setNewTicket] = useState({ subject: '', category: 'General', message: '' });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Tickets from LS (Shared with Admin)
  useEffect(() => {
    const loadTickets = () => {
      const stored = localStorage.getItem('mdm_support_tickets');
      if (stored) {
        setTickets(JSON.parse(stored));
      } else {
        // Initialize with mocks if empty
        localStorage.setItem('mdm_support_tickets', JSON.stringify(MOCK_TICKETS));
        setTickets(MOCK_TICKETS);
      }
    };
    loadTickets();
    
    // Poll for updates (simulating real-time admin replies)
    const interval = setInterval(loadTickets, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (selectedTicketId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicketId, tickets]);

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.message) return;

    const ticket: SupportTicket = {
      id: `TKT-${Date.now().toString().slice(-6)}`,
      user: 'You', // In real app, get from auth context
      userId: 'USR-ME',
      subject: newTicket.subject,
      category: newTicket.category as any,
      priority: 'Medium',
      status: 'Open',
      lastUpdated: 'Just now',
      messages: [
        { sender: 'user', text: newTicket.message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    };

    const updatedTickets = [ticket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('mdm_support_tickets', JSON.stringify(updatedTickets));
    
    setIsCreating(false);
    setNewTicket({ subject: '', category: 'General', message: '' });
    setSelectedTicketId(ticket.id);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = () => {
    if ((!messageInput.trim() && !attachedImage) || !activeTicket) return;

    const newMessage = {
      sender: 'user' as const,
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: attachedImage || undefined
    };

    const updatedTickets = tickets.map(t => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          lastUpdated: 'Just now',
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    localStorage.setItem('mdm_support_tickets', JSON.stringify(updatedTickets));
    setMessageInput('');
    setAttachedImage(null);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] min-h-[600px] bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2.5rem] shadow-xl overflow-hidden relative">
      
      {/* LEFT: Ticket List */}
      <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 ${selectedTicketId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 border-b border-gray-200 dark:border-white/5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <Headphones className="text-purple-600" /> Support
            </h2>
            <button 
              onClick={() => setIsCreating(true)}
              className="p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            >
               <Plus size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500">View your active tickets or raise a new issue.</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
           {tickets.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                 <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
                 <p className="text-sm">No tickets found.</p>
              </div>
           ) : (
              tickets.map(ticket => (
                 <div 
                   key={ticket.id}
                   onClick={() => setSelectedTicketId(ticket.id)}
                   className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      selectedTicketId === ticket.id 
                      ? 'bg-white dark:bg-white/10 border-purple-200 dark:border-purple-500/30 shadow-md' 
                      : 'bg-transparent border-transparent hover:bg-white dark:hover:bg-white/5'
                   }`}
                 >
                    <div className="flex justify-between items-start mb-1">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ticket.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                          {ticket.status}
                       </span>
                       <span className="text-[10px] text-gray-400">{ticket.lastUpdated}</span>
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1 truncate">{ticket.subject}</h4>
                    <p className="text-xs text-gray-500 truncate">{ticket.messages[ticket.messages.length - 1]?.text}</p>
                 </div>
              ))
           )}
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className={`flex-1 flex flex-col bg-white dark:bg-[#0a0a0a] ${!selectedTicketId ? 'hidden md:flex' : 'flex'}`}>
         {activeTicket ? (
            <>
               {/* Chat Header */}
               <div className="h-16 border-b border-gray-200 dark:border-white/5 flex justify-between items-center px-6 shrink-0 bg-white/80 dark:bg-black/40 backdrop-blur-xl z-10">
                  <div className="flex items-center gap-3">
                     <button onClick={() => setSelectedTicketId(null)} className="md:hidden p-1 -ml-2 text-gray-500"><ArrowLeft size={20} /></button>
                     <div>
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                           {activeTicket.subject}
                           <span className="text-xs font-normal text-gray-500 px-2 py-0.5 bg-gray-100 dark:bg-white/10 rounded-md">#{activeTicket.id}</span>
                        </h3>
                        <p className="text-xs text-gray-500">{activeTicket.category} • {activeTicket.status}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${activeTicket.status === 'Open' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                     <span className="text-xs font-bold text-gray-500">{activeTicket.status}</span>
                  </div>
               </div>

               {/* Messages */}
               <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-black/20 custom-scrollbar">
                  {/* Ticket Started Banner */}
                  <div className="flex justify-center my-4">
                     <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-4 py-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                        <FileText size={12} /> Ticket Created: {activeTicket.id}
                     </div>
                  </div>

                  {activeTicket.messages.map((msg, idx) => (
                     <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                     >
                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed relative ${
                           msg.sender === 'user' 
                           ? 'bg-purple-600 text-white rounded-tr-none' 
                           : 'bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 rounded-tl-none'
                        }`}>
                           {msg.image && (
                              <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                                 <img src={msg.image} alt="attachment" className="max-w-full max-h-48 object-contain" />
                              </div>
                           )}
                           <p>{msg.text}</p>
                           <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-purple-200' : 'text-gray-400'}`}>
                              {msg.time}
                           </div>
                        </div>
                     </motion.div>
                  ))}
                  
                  {activeTicket.status === 'Resolved' && (
                      <div className="flex justify-center my-6">
                         <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                            <CheckCircle size={14} /> This ticket has been marked as resolved.
                         </div>
                      </div>
                  )}
                  <div ref={messagesEndRef} />
               </div>

               {/* Input Area */}
               {activeTicket.status !== 'Resolved' && (
                  <div className="p-4 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10">
                     
                     {/* Image Preview */}
                     <AnimatePresence>
                       {attachedImage && (
                          <motion.div 
                             initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                             className="mb-2 flex items-center gap-2"
                          >
                             <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                                <img src={attachedImage} className="h-full w-full object-cover" />
                                <button onClick={() => setAttachedImage(null)} className="absolute top-0 right-0 bg-black/50 text-white p-0.5 rounded-bl-md hover:bg-red-500 transition-colors">
                                   <X size={12} />
                                </button>
                             </div>
                             <span className="text-xs text-gray-500">Image attached</span>
                          </motion.div>
                       )}
                     </AnimatePresence>

                     <div className="flex items-end gap-2 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-200 dark:border-white/5 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500/20 transition-all">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                        <button 
                           onClick={() => fileInputRef.current?.click()}
                           className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        >
                           <Paperclip size={20} />
                        </button>
                        <textarea 
                           value={messageInput}
                           onChange={(e) => setMessageInput(e.target.value)}
                           placeholder="Type your reply..."
                           className="flex-1 bg-transparent border-none outline-none text-sm resize-none max-h-32 py-2 text-gray-900 dark:text-white placeholder-gray-400"
                           rows={1}
                           onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                 e.preventDefault();
                                 handleSendMessage();
                              }
                           }}
                        />
                        <button 
                           onClick={handleSendMessage}
                           disabled={(!messageInput.trim() && !attachedImage)}
                           className="p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                           <Send size={18} />
                        </button>
                     </div>
                  </div>
               )}
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
               <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Headphones size={48} className="opacity-20" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">How can we help?</h3>
               <p className="max-w-xs mx-auto">Select an existing ticket to view the conversation or create a new one.</p>
               <PremiumButton 
                  onClick={() => setIsCreating(true)}
                  className="mt-6"
                  variant="outline"
               >
                  Raise New Ticket
               </PremiumButton>
            </div>
         )}
      </div>

      {/* Create Ticket Modal */}
      <AnimatePresence>
         {isCreating && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white dark:bg-[#1a1a1a] p-6 rounded-3xl shadow-2xl w-full max-w-md border border-white/10"
               >
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-bold">New Support Ticket</h3>
                     <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="space-y-4">
                     <AnimatedInput 
                        label="Subject" 
                        value={newTicket.subject} 
                        onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})} 
                        placeholder="Brief summary of the issue"
                     />
                     <AnimatedSelect 
                        label="Category" 
                        options={[
                           { value: 'General', label: 'General Inquiry' },
                           { value: 'Billing', label: 'Billing & Payments' },
                           { value: 'Technical', label: 'Technical Issue' },
                           { value: 'Report', label: 'Report Profile/Abuse' },
                           { value: 'Account', label: 'Account Settings' }
                        ]}
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                     />
                     <AnimatedTextArea 
                        label="Message" 
                        value={newTicket.message} 
                        onChange={(e) => setNewTicket({...newTicket, message: e.target.value})} 
                        placeholder="Describe your issue in detail..."
                     />

                     <div className="pt-2">
                        <PremiumButton onClick={handleCreateTicket} width="full" variant="gradient">
                           Submit Ticket
                        </PremiumButton>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default SupportChat;
