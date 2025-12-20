
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, Star, Calendar, LogOut, Search, Clock, CheckCircle, 
  ChevronRight, AlertCircle, FileText, User, Sparkles
} from 'lucide-react';
import HoroscopeAnalyzer from './HoroscopeAnalyzer';
import { MOCK_ASTRO_REQUESTS, AstroMatchRequest } from '../../../utils/adminData';
import PremiumButton from '../../ui/PremiumButton';
import Logo from '../../ui/Logo';

interface AstrologerDashboardProps {
  onLogout: () => void;
}

const AstrologerDashboard: React.FC<AstrologerDashboardProps> = ({ onLogout }) => {
  const [view, setView] = useState<'list' | 'analyze'>('list');
  const [selectedRequest, setSelectedRequest] = useState<AstroMatchRequest | null>(null);

  const handleOpenRequest = (req: AstroMatchRequest) => {
    setSelectedRequest(req);
    setView('analyze');
  };

  const handleBack = () => {
    setSelectedRequest(null);
    setView('list');
  };

  if (view === 'analyze' && selectedRequest) {
    return <HoroscopeAnalyzer request={selectedRequest} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-[#0c0a09] font-sans text-stone-200 selection:bg-amber-500/30">
       
       {/* Background Ambience */}
       <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10" />
       </div>

       {/* Top Navigation Bar */}
       <header className="h-24 bg-[#1c1917]/80 backdrop-blur-xl border-b border-white/5 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30 shadow-lg">
          <div className="flex items-center gap-4">
             <Logo className="w-10 h-10" />
             <div>
                <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">Divine Astrology Portal</h1>
                <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-bold">Authorized Personnel Only</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 shadow-inner">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                <span className="text-xs font-bold text-stone-300">Live Server</span>
             </div>
             <button onClick={onLogout} className="text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors">
                <LogOut size={16} /> Logout
             </button>
          </div>
       </header>

       <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
          
          {/* Welcome Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
             <h2 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-3">
                Pranam, Guruji <Sparkles className="text-amber-500 w-6 h-6" />
             </h2>
             <p className="text-stone-400 text-lg">
                You have <span className="font-bold text-amber-400 border-b border-amber-400/50 pb-0.5">{MOCK_ASTRO_REQUESTS.filter(r => r.status === 'Pending').length} pending</span> horoscope matches awaiting your divine insight.
             </p>
          </motion.div>

          {/* Task Board */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Pending Column */}
             <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center mb-2 px-1">
                   <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                      <Clock size={18} className="text-amber-500" /> Priority Queue
                   </h3>
                   <div className="relative group">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 group-focus-within:text-amber-500 transition-colors" />
                      <input 
                         type="text" 
                         placeholder="Search ID..." 
                         className="pl-9 pr-4 py-2 text-xs bg-[#292524] border border-white/5 rounded-full outline-none focus:border-amber-500/50 focus:bg-[#292524]/80 transition-all w-48 text-white placeholder-stone-600" 
                      />
                   </div>
                </div>

                <div className="grid gap-4">
                  {MOCK_ASTRO_REQUESTS.map((req, idx) => (
                     <motion.div 
                        key={req.id}
                        layoutId={req.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => handleOpenRequest(req)}
                        className="bg-[#1c1917]/80 border border-white/5 rounded-2xl p-6 shadow-lg hover:shadow-amber-900/20 hover:border-amber-500/30 transition-all cursor-pointer group relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                           <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${
                                 req.priority === 'High' 
                                 ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                 : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}>
                                 {req.priority} Priority
                              </span>
                              <span className="text-xs text-stone-500 font-mono tracking-wide">{req.id}</span>
                           </div>
                           <span className="text-xs text-stone-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">{req.requestedBy}</span>
                        </div>

                        <div className="flex items-center justify-between gap-6 relative z-10">
                           {/* Groom */}
                           <div className="flex-1 flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center text-stone-500 shrink-0">
                                 <User size={24} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-base text-white">{req.groomName}</h4>
                                 <div className="flex flex-col text-xs text-stone-400 mt-1">
                                    <span><span className="text-stone-600">Star:</span> {req.groomDetails.star}</span>
                                    <span><span className="text-stone-600">Raasi:</span> {req.groomDetails.raasi}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="text-stone-600 font-serif italic text-lg">vs</div>

                           {/* Bride */}
                           <div className="flex-1 flex items-center justify-end gap-4 text-right">
                              <div>
                                 <h4 className="font-bold text-base text-white">{req.brideName}</h4>
                                 <div className="flex flex-col text-xs text-stone-400 mt-1">
                                    <span>{req.brideDetails.star} <span className="text-stone-600">:Star</span></span>
                                    <span>{req.brideDetails.raasi} <span className="text-stone-600">:Raasi</span></span>
                                 </div>
                              </div>
                              <div className="w-14 h-14 rounded-full bg-stone-800 border-2 border-stone-700 flex items-center justify-center text-stone-500 shrink-0">
                                 <User size={24} />
                              </div>
                           </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                           <div className="flex gap-2">
                               <div className="px-3 py-1 bg-[#0c0a09] rounded-full border border-white/5 text-[10px] text-stone-400">
                                  Status: <span className="font-bold text-amber-500">{req.status}</span>
                               </div>
                           </div>
                           <button className="text-xs font-bold text-amber-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                              Start Analysis <ChevronRight size={14} />
                           </button>
                        </div>
                     </motion.div>
                  ))}
                </div>
             </div>

             {/* Right Sidebar: Summary */}
             <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden border border-amber-500/30">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                   
                   <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2 relative z-10">
                      <Star className="fill-white text-white" size={20} /> Daily Panchangam
                   </h3>
                   
                   <div className="space-y-4 relative z-10 text-sm">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                         <span className="text-amber-100/80">Tithi</span> 
                         <span className="font-bold">Shukla Paksha Dashami</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                         <span className="text-amber-100/80">Nakshatra</span> 
                         <span className="font-bold">Rohini</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                         <span className="text-amber-100/80">Yogam</span> 
                         <span className="font-bold">Siddha</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-amber-100/80">Rahukalam</span> 
                         <span className="font-bold bg-black/20 px-2 py-0.5 rounded">10:30 - 12:00</span>
                      </div>
                   </div>
                </div>

                <div className="bg-[#1c1917] rounded-[2rem] border border-white/5 p-6 shadow-lg">
                   <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-500" /> Completed Recently
                   </h3>
                   <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                         <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-[#292524] border border-white/5 hover:border-white/10 transition-colors group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-sm font-bold border border-green-500/20">8.5</div>
                            <div className="flex-1 min-w-0">
                               <p className="text-sm font-bold text-gray-200 truncate">Suresh & Meena</p>
                               <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold group-hover:text-green-400 transition-colors">Suitable Match</p>
                            </div>
                            <FileText size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                         </div>
                      ))}
                   </div>
                   <button className="w-full mt-6 py-3 border border-white/5 rounded-xl text-xs font-bold text-stone-400 hover:bg-white/5 hover:text-white transition-all">
                      View History
                   </button>
                </div>
             </div>

          </div>
       </main>

    </div>
  );
};

export default AstrologerDashboard;
