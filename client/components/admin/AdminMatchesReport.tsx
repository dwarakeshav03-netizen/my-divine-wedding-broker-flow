import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Crown, Users, User, Calendar, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminMatchesReport = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');


  const today = new Date();
  const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/v1/matches/today-report?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) setMatches(res.data.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const filteredMatches = (matches || []).filter(m => 
    (m.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.caste || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.religion || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-gray-500 animate-pulse uppercase tracking-widest text-[10px]">Synchronizing Matches...</p>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-[1600px] mx-auto font-sans">
      
      
      <div className="space-y-8">
        
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
               <Calendar size={28} className="text-purple-600" />
            </div>
            <div>
               <h2 className="text-2xl md:text-3xl font-black text-[#1a1c2e] dark:text-white uppercase tracking-tight">Matches Report</h2>
               <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Tracking and managing user connections • {formattedDate}</p>
            </div>
          </div>

          
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-purple-500/20 flex items-center gap-2 uppercase tracking-wider cursor-default">
             <Users size={18} /> {filteredMatches.length} Matches Found
          </div>
        </div>

        
        <div className="relative max-w-lg group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Search matches by name, caste, religion..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-full py-4 pl-14 pr-6 dark:text-white font-bold outline-none shadow-sm focus:border-purple-500 transition-all placeholder:text-gray-400"
            />
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredMatches.map((person: any) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              key={person.id} 
              className="group bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-[3rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              
              <div className="absolute top-8 right-8 flex flex-col items-center">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border-2 mb-2 ${
                    person.plan?.toLowerCase() === 'platinum' ? 'bg-indigo-700 border-indigo-400 text-white' : 
                    person.plan?.toLowerCase() === 'diamond' ? 'bg-cyan-500 border-cyan-200 text-white' : 
                    'bg-amber-400 border-yellow-200 text-amber-950'
                 }`}>
                    <Crown size={30} className="fill-current" />
                 </div>
                 <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                     person.plan?.toLowerCase() === 'platinum' ? 'bg-indigo-100 text-indigo-700' :
                     person.plan?.toLowerCase() === 'diamond' ? 'bg-cyan-100 text-cyan-700' :
                     'bg-amber-100 text-amber-700'
                 }`}>
                    {person.plan || 'GOLD'}
                 </span>
              </div>

              
              <div className="mb-8 relative w-max">
                  <img 
                    src={person.avatar} 
                    className="w-28 h-28 rounded-[2.5rem] object-cover border-4 border-white dark:border-black shadow-2xl group-hover:scale-105 transition-transform" 
                    onError={(e: any) => e.target.src = `https://ui-avatars.com/api/?name=${person.firstName}`}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-[#121212] rounded-full shadow-lg" />
              </div>

              <div className="space-y-6">
                 <div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-2 truncate max-w-[180px]">{person.firstName} {person.lastName || ''}</h3>
                    <div className="flex items-center gap-2 text-purple-600 dark:text-pink-500 font-bold text-sm">
                      <span>{person.age || 28} Years</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="capitalize">{person.gender || 'Male'}</span>
                    </div>
                 </div>

                 {/* DETAIL ROWS */}
                 <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-purple-600 shadow-inner"><BookOpen size={20}/></div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Education</p>
                          <p className="text-base font-bold text-gray-800 dark:text-gray-200">{person.education || 'Graduate'}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-blue-500 shadow-inner"><User size={20}/></div>
                       <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Community</p>
                          <p className="text-base font-bold text-gray-800 dark:text-gray-200">{person.religion || 'Hindu'} • {person.caste || 'Community'}</p>
                       </div>
                    </div>
                 </div>

                 <p className="text-[10px] font-mono text-gray-400 opacity-50 flex items-center gap-1">
                   <MapPin size={10} /> {person.id.substring(0, 18)}...
                 </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminMatchesReport;