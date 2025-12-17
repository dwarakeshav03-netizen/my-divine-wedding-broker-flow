
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Search, MessageSquare, Send, Sparkles, User, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { MOCK_TICKETS, SupportTicket } from '../../utils/adminData';
import { GoogleGenAI } from "@google/genai";

const AdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load from LS
  useEffect(() => {
     const load = () => {
         const stored = localStorage.getItem('mdm_support_tickets');
         if (stored) {
             setTickets(JSON.parse(stored));
         } else {
             // Fallback to mocks if LS empty, and initialize LS
             setTickets(MOCK_TICKETS);
             localStorage.setItem('mdm_support_tickets', JSON.stringify(MOCK_TICKETS));
         }
     };
     load();
     const interval = setInterval(load, 2000); // Polling for user updates
     return () => clearInterval(interval);
  }, []);

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  const handleAiReply = async () => {
    if (!selectedTicket) return;
    setAiLoading(true);
    
    try {
       const apiKey = process.env.API_KEY;
       if (apiKey) {
          const ai = new GoogleGenAI({ apiKey });
          const lastMsg = selectedTicket.messages[selectedTicket.messages.length - 1];
          const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: `Generate a polite, professional customer support reply for a matrimony site user. 
             User Name: ${selectedTicket.user}
             Issue Category: ${selectedTicket.category}
             Subject: ${selectedTicket.subject}
             User Message: ${lastMsg ? lastMsg.text : 'Need help'}
             Keep it concise and empathetic.`
          });
          setReply(response.text || "Could not generate reply.");
       } else {
          // Fallback
          setReply(`Hello ${selectedTicket.user},\n\nThank you for reaching out regarding your ${selectedTicket.category.toLowerCase()} issue. We apologize for the inconvenience. Our team is looking into this with priority and will resolve it shortly.\n\nBest Regards,\nSupport Team`);
       }
    } catch (e) {
       console.error(e);
    } finally {
       setAiLoading(false);
    }
  };

  const handleSendReply = () => {
      if (!selectedTicket || !reply.trim()) return;

      const newMessage = {
          sender: 'agent' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedTickets = tickets.map(t => {
          if (t.id === selectedTicket.id) {
              return {
                  ...t,
                  status: 'In Progress' as const, // Auto update status on reply
                  lastUpdated: 'Just now',
                  messages: [...t.messages, newMessage]
              };
          }
          return t;
      });

      setTickets(updatedTickets);
      localStorage.setItem('mdm_support_tickets', JSON.stringify(updatedTickets));
      setReply('');
  };

  const handleCloseTicket = () => {
      if (!selectedTicket) return;
      const updatedTickets = tickets.map(t => 
          t.id === selectedTicket.id ? { ...t, status: 'Resolved' as const, lastUpdated: 'Just now' } : t
      );
      setTickets(updatedTickets);
      localStorage.setItem('mdm_support_tickets', JSON.stringify(updatedTickets));
  };

  const filteredTickets = tickets.filter(t => 
      t.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full gap-6 relative">
       {/* Ticket List - Hidden on mobile if ticket selected */}
       <div className={`w-full md:w-1/3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm flex flex-col overflow-hidden ${selectedTicketId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 dark:border-white/5">
             <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                   type="text" placeholder="Search tickets..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full bg-gray-50 dark:bg-white/5 rounded-xl pl-9 pr-4 py-2 text-sm outline-none"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
             {filteredTickets.map(ticket => (
                <div 
                   key={ticket.id} 
                   onClick={() => setSelectedTicketId(ticket.id)}
                   className={`p-4 rounded-xl cursor-pointer transition-colors border ${selectedTicketId === ticket.id ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                   <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{ticket.user}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ticket.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{ticket.priority}</span>
                   </div>
                   <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">{ticket.subject}</p>
                   <p className="text-xs text-gray-500 truncate">{ticket.messages[ticket.messages.length - 1]?.text || 'No messages'}</p>
                   <div className="flex justify-between items-center mt-2">
                       <span className="text-[10px] text-gray-400">{ticket.id}</span>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{ticket.status}</span>
                   </div>
                </div>
             ))}
          </div>
       </div>

       {/* Conversation Area - Hidden on mobile if no ticket selected */}
       <div className={`w-full md:flex-1 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm flex flex-col overflow-hidden ${!selectedTicketId ? 'hidden md:flex' : 'flex'}`}>
          {selectedTicket ? (
             <>
                <div className="p-4 md:p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                   <div className="flex items-center gap-3">
                      <button onClick={() => setSelectedTicketId(null)} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
                         <ArrowLeft size={20} />
                      </button>
                      <div>
                          <h3 className="font-bold text-lg leading-tight">{selectedTicket.subject}</h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                             <span className="flex items-center gap-1"><User size={12} /> {selectedTicket.user}</span>
                             <span className="flex items-center gap-1"><Clock size={12} /> {selectedTicket.lastUpdated}</span>
                             <span className="bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded hidden sm:inline-block">{selectedTicket.category}</span>
                          </div>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button 
                          onClick={handleCloseTicket}
                          disabled={selectedTicket.status === 'Resolved'}
                          className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold hover:bg-white dark:hover:bg-white/5 disabled:opacity-50 whitespace-nowrap"
                      >
                          {selectedTicket.status === 'Resolved' ? 'Closed' : 'Close Ticket'}
                      </button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/30 dark:bg-black/20">
                   {selectedTicket.messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                         <div className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl text-sm ${
                             msg.sender === 'user' 
                             ? 'bg-white dark:bg-white/10 border border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none' 
                             : 'bg-purple-600 text-white rounded-tr-none'
                         }`}>
                            <p>{msg.text}</p>
                            <span className={`text-[10px] block mt-1 text-right ${msg.sender === 'agent' ? 'text-purple-200' : 'text-gray-400'}`}>{msg.time}</span>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-white/5">
                   <div className="relative">
                      <textarea 
                         value={reply}
                         onChange={(e) => setReply(e.target.value)}
                         placeholder="Type your reply..."
                         className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 pr-12 text-sm outline-none min-h-[100px]"
                      />
                      <div className="absolute bottom-3 right-3 flex gap-2">
                         <button 
                            onClick={handleAiReply}
                            disabled={aiLoading || selectedTicket.status === 'Resolved'}
                            className="p-2 text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                            title="Generate AI Reply"
                         >
                            <Sparkles size={18} className={aiLoading ? 'animate-pulse' : ''} />
                         </button>
                         <button 
                            onClick={handleSendReply}
                            disabled={!reply.trim() || selectedTicket.status === 'Resolved'}
                            className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg disabled:opacity-50"
                         >
                            <Send size={18} />
                         </button>
                      </div>
                   </div>
                </div>
             </>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center">
                <HelpCircle size={48} className="mb-4 opacity-20" />
                <p>Select a ticket to view details</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default AdminSupport;
