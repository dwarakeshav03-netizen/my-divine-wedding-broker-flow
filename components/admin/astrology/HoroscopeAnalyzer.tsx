
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, User, Star, Save, Calculator, CheckCircle, XCircle, Clock, MapPin, Globe, Award, Download
} from 'lucide-react';
import { AstroMatchRequest } from '../../../utils/adminData';
import { calculatePorutham, MatchReport, STARS } from '../../../utils/astrologyUtils';
import PremiumButton from '../../ui/PremiumButton';
import KattamChart from './KattamChart';

interface HoroscopeAnalyzerProps {
  request: AstroMatchRequest;
  onBack: () => void;
}

// Helper to simulate calculating star from date (Deterministic mock)
const getStarFromDate = (dateStr: string) => {
    if(!dateStr) return STARS[0];
    const day = new Date(dateStr).getDate();
    return STARS[day % STARS.length]; // Deterministic mock mapping
};

const HoroscopeAnalyzer: React.FC<HoroscopeAnalyzerProps> = ({ request, onBack }) => {
  const [inputMode, setInputMode] = useState<'birth' | 'star'>('birth'); // Default to birth as per request
  const [report, setReport] = useState<MatchReport | null>(null);
  
  // --- STAR MODE STATE ---
  const [groomStarData, setGroomStarData] = useState({ 
     star: request.groomDetails.star || STARS[0].name, 
     raasi: request.groomDetails.raasi || STARS[0].rashi,
     padam: '1'
  });
  const [brideStarData, setBrideStarData] = useState({ 
     star: request.brideDetails.star || STARS[0].name, 
     raasi: request.brideDetails.raasi || STARS[0].rashi,
     padam: '1'
  });

  // --- BIRTH DATE MODE STATE ---
  const [groomBirth, setGroomBirth] = useState({
      date: '15', month: '08', year: '1995',
      hour: '09', minute: '30', sec: '00', ampm: 'AM',
      country: 'India (GMT+05:30)', location: 'Chennai'
  });
  const [brideBirth, setBrideBirth] = useState({
      date: '20', month: '05', year: '1998',
      hour: '10', minute: '15', sec: '00', ampm: 'AM',
      country: 'India (GMT+05:30)', location: 'Bangalore'
  });
  
  const [adminNotes, setAdminNotes] = useState('');
  const [finalVerdict, setFinalVerdict] = useState('Select Verdict');
  const [calculating, setCalculating] = useState(false);

  // Calculation Effect
  useEffect(() => {
     setCalculating(true);
     const timer = setTimeout(() => {
        let gStarName = groomStarData.star;
        let bStarName = brideStarData.star;

        // If in Birth Mode, simulate calculation
        if (inputMode === 'birth') {
            const gDate = `${groomBirth.year}-${groomBirth.month}-${groomBirth.date}`;
            const bDate = `${brideBirth.year}-${brideBirth.month}-${brideBirth.date}`;
            
            const gDerived = getStarFromDate(gDate);
            const bDerived = getStarFromDate(bDate);
            
            gStarName = gDerived.name;
            bStarName = bDerived.name;
        }

        const res = calculatePorutham(gStarName, bStarName);
        setReport(res);
        setCalculating(false);
     }, 800);

     return () => clearTimeout(timer);
  }, [groomStarData, brideStarData, groomBirth, brideBirth, inputMode]);

  const handleStarChange = (person: 'groom' | 'bride', starName: string) => {
     const starObj = STARS.find(s => s.name === starName);
     if (starObj) {
         if (person === 'groom') setGroomStarData(p => ({ ...p, star: starName, raasi: starObj.rashi }));
         else setBrideStarData(p => ({ ...p, star: starName, raasi: starObj.rashi }));
     }
  };

  const handleSave = () => {
      // 1. Construct Report Object
      const reportData = {
          requestId: request.id,
          groomId: request.groomId,
          brideId: request.brideId,
          groomName: request.groomName,
          brideName: request.brideName,
          verdict: finalVerdict,
          remarks: adminNotes,
          score: report?.totalScore || 0,
          timestamp: new Date().toISOString(),
          adminName: 'Dr. Guruji'
      };

      // 2. Save to LocalStorage (Simulating DB Update)
      const existingReports = JSON.parse(localStorage.getItem('mdm_astro_reports') || '{}');
      
      existingReports[request.groomId] = { ...reportData, partnerName: request.brideName };
      existingReports[request.brideId] = { ...reportData, partnerName: request.groomName };
      
      localStorage.setItem('mdm_astro_reports', JSON.stringify(existingReports));

      alert("Report Published Successfully! Verdict visible to users.");
      onBack();
  };

  // Reusable Birth Input Component
  const BirthInputGroup = ({ data, setData }: { data: any, setData: any }) => (
    <div className="grid grid-cols-3 gap-2 p-4 bg-[#292524]/50 rounded-xl border border-white/5">
        <div className="col-span-1 space-y-1">
            <label className="text-[9px] font-bold uppercase text-stone-500">Date</label>
            <input type="text" value={data.date} onChange={e => setData({...data, date: e.target.value})} className="w-full bg-[#1c1917] border border-white/10 rounded p-2 text-xs font-bold text-center text-white focus:border-amber-500 outline-none" placeholder="DD" />
        </div>
        <div className="col-span-1 space-y-1">
            <label className="text-[9px] font-bold uppercase text-stone-500">Month</label>
            <input type="text" value={data.month} onChange={e => setData({...data, month: e.target.value})} className="w-full bg-[#1c1917] border border-white/10 rounded p-2 text-xs font-bold text-center text-white focus:border-amber-500 outline-none" placeholder="MM" />
        </div>
        <div className="col-span-1 space-y-1">
            <label className="text-[9px] font-bold uppercase text-stone-500">Year</label>
            <input type="text" value={data.year} onChange={e => setData({...data, year: e.target.value})} className="w-full bg-[#1c1917] border border-white/10 rounded p-2 text-xs font-bold text-center text-white focus:border-amber-500 outline-none" placeholder="YYYY" />
        </div>

        <div className="col-span-3 pt-2 space-y-1">
             <label className="text-[9px] font-bold uppercase text-stone-500">Birth Time</label>
             <div className="flex gap-1">
                 <input type="text" value={data.hour} onChange={e => setData({...data, hour: e.target.value})} className="flex-1 bg-[#1c1917] border border-white/10 rounded p-2 text-xs font-bold text-center text-white focus:border-amber-500 outline-none" placeholder="HH" />
                 <input type="text" value={data.minute} onChange={e => setData({...data, minute: e.target.value})} className="flex-1 bg-[#1c1917] border border-white/10 rounded p-2 text-xs font-bold text-center text-white focus:border-amber-500 outline-none" placeholder="MM" />
                 <input type="text" value={data.sec} onChange={e => setData({...data, sec: e.target.value})} className="flex-1 bg-[#1c1917] border border-white/10 rounded p-2 text-xs font-bold text-center text-white focus:border-amber-500 outline-none" placeholder="SS" />
                 <select value={data.ampm} onChange={e => setData({...data, ampm: e.target.value})} className="flex-1 bg-[#1c1917] border border-white/10 rounded p-2 text-xs font-bold text-center appearance-none text-white focus:border-amber-500 outline-none">
                    <option>AM</option><option>PM</option>
                 </select>
             </div>
        </div>

        <div className="col-span-3 pt-2 space-y-1">
            <label className="text-[9px] font-bold uppercase text-stone-500">Standard Time</label>
            <select className="w-full bg-[#1c1917] border border-white/10 rounded p-2 text-xs font-bold text-white focus:border-amber-500 outline-none">
                <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                <option>(GMT+00:00) London</option>
                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
            </select>
        </div>
        
        <div className="col-span-3 pt-1 space-y-1">
            <label className="text-[9px] font-bold uppercase text-stone-500">Place of Birth</label>
            <div className="flex items-center gap-2 bg-[#1c1917] border border-white/10 rounded p-2 focus-within:border-amber-500 transition-colors">
                <MapPin size={12} className="text-stone-500" />
                <input type="text" value={data.location} onChange={e => setData({...data, location: e.target.value})} className="w-full bg-transparent text-xs font-bold outline-none text-white placeholder-stone-600" placeholder="City" />
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0c0a09] flex flex-col font-sans">
       
       {/* Toolbar */}
       <div className="h-20 bg-[#1c1917]/80 backdrop-blur-xl border-b border-white/5 px-6 flex justify-between items-center sticky top-0 z-40 shadow-lg">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-stone-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
             </button>
             <div>
                <h2 className="font-display font-bold text-white text-lg tracking-wide">Compatibility Analysis</h2>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-mono">{request.id}</span>
                    <span className="w-1 h-1 rounded-full bg-stone-600" />
                    <span>Requested by {request.requestedBy}</span>
                </div>
             </div>
          </div>
          
          <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
             <button 
                onClick={() => setInputMode('birth')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${inputMode === 'birth' ? 'bg-[#292524] shadow-lg text-amber-500 border border-white/5' : 'text-stone-500 hover:text-stone-300'}`}
             >
                <Calendar size={14} /> Birth Data
             </button>
             <button 
                onClick={() => setInputMode('star')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${inputMode === 'star' ? 'bg-[#292524] shadow-lg text-amber-500 border border-white/5' : 'text-stone-500 hover:text-stone-300'}`}
             >
                <Star size={14} /> Star Entry
             </button>
          </div>

          <div className="flex gap-3">
             <PremiumButton onClick={handleSave} variant="gradient" className="!py-2.5 !px-6 !text-xs !rounded-xl shadow-amber-900/20" icon={<Award size={16} />}>
                Finalize Verdict
             </PremiumButton>
          </div>
       </div>

       <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* LEFT: INPUTS & CHARTS */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-10">
             
             {/* Side by Side Profiles */}
             <div className="grid grid-cols-2 gap-8">
                {/* Groom */}
                <div className="bg-[#1c1917] p-1 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
                   <div className="p-6">
                       <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                             <User size={24} />
                          </div>
                          <div>
                             <h3 className="font-bold text-white text-lg">{request.groomName}</h3>
                             <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Groom</p>
                          </div>
                       </div>

                       <div className="space-y-6">
                          {inputMode === 'birth' ? (
                              <BirthInputGroup data={groomBirth} setData={setGroomBirth} />
                          ) : (
                             <div className="p-4 bg-[#292524]/50 rounded-xl border border-white/5 space-y-4">
                                <div className="space-y-1">
                                   <label className="text-[10px] font-bold text-stone-500 uppercase">Nakshatra</label>
                                   <select 
                                      value={groomStarData.star}
                                      onChange={(e) => handleStarChange('groom', e.target.value)}
                                      className="w-full bg-[#1c1917] border border-white/10 rounded-lg p-2 text-sm outline-none font-bold text-white focus:border-blue-500 transition-colors"
                                   >
                                      {STARS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                   </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-stone-500 uppercase">Raasi</label>
                                      <input type="text" value={groomStarData.raasi} readOnly className="w-full bg-[#1c1917] border border-white/5 rounded-lg p-2 text-sm font-bold text-stone-400 cursor-not-allowed" />
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-stone-500 uppercase">Paadam</label>
                                      <select 
                                         value={groomStarData.padam}
                                         onChange={(e) => setGroomStarData({...groomStarData, padam: e.target.value})}
                                         className="w-full bg-[#1c1917] border border-white/10 rounded-lg p-2 text-sm outline-none font-bold text-white focus:border-blue-500"
                                      >
                                         {[1,2,3,4].map(p => <option key={p} value={p}>{p}</option>)}
                                      </select>
                                   </div>
                                </div>
                             </div>
                          )}
                       </div>
                       
                       <div className="mt-8">
                          <KattamChart rasi={inputMode === 'birth' ? getStarFromDate(`${groomBirth.year}-${groomBirth.month}-${groomBirth.date}`).rashi : groomStarData.raasi} title="Groom's Rasi" />
                       </div>
                   </div>
                </div>

                {/* Bride */}
                <div className="bg-[#1c1917] p-1 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-600" />
                   <div className="p-6">
                       <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                             <User size={24} />
                          </div>
                          <div>
                             <h3 className="font-bold text-white text-lg">{request.brideName}</h3>
                             <p className="text-xs text-pink-400 font-bold uppercase tracking-wider">Bride</p>
                          </div>
                       </div>

                       <div className="space-y-6">
                          {inputMode === 'birth' ? (
                              <BirthInputGroup data={brideBirth} setData={setBrideBirth} />
                          ) : (
                             <div className="p-4 bg-[#292524]/50 rounded-xl border border-white/5 space-y-4">
                                <div className="space-y-1">
                                   <label className="text-[10px] font-bold text-stone-500 uppercase">Nakshatra</label>
                                   <select 
                                      value={brideStarData.star}
                                      onChange={(e) => handleStarChange('bride', e.target.value)}
                                      className="w-full bg-[#1c1917] border border-white/10 rounded-lg p-2 text-sm outline-none font-bold text-white focus:border-pink-500 transition-colors"
                                   >
                                      {STARS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                                   </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-stone-500 uppercase">Raasi</label>
                                      <input type="text" value={brideStarData.raasi} readOnly className="w-full bg-[#1c1917] border border-white/5 rounded-lg p-2 text-sm font-bold text-stone-400 cursor-not-allowed" />
                                   </div>
                                   <div className="space-y-1">
                                      <label className="text-[10px] font-bold text-stone-500 uppercase">Paadam</label>
                                      <select 
                                         value={brideStarData.padam}
                                         onChange={(e) => setBrideStarData({...brideStarData, padam: e.target.value})}
                                         className="w-full bg-[#1c1917] border border-white/10 rounded-lg p-2 text-sm outline-none font-bold text-white focus:border-pink-500"
                                      >
                                         {[1,2,3,4].map(p => <option key={p} value={p}>{p}</option>)}
                                      </select>
                                   </div>
                                </div>
                             </div>
                          )}
                       </div>

                       <div className="mt-8">
                          <KattamChart rasi={inputMode === 'birth' ? getStarFromDate(`${brideBirth.year}-${brideBirth.month}-${brideBirth.date}`).rashi : brideStarData.raasi} title="Bride's Rasi" />
                       </div>
                   </div>
                </div>
             </div>
          </div>

          {/* RIGHT: RESULTS PANEL */}
          <div className="w-full lg:w-[400px] bg-[#151515] border-l border-white/5 flex flex-col shadow-2xl z-30 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
             
             {/* Score Header */}
             <div className="p-8 border-b border-white/5 bg-[#1a1a1a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center justify-between mb-6 relative z-10">
                   <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      <Calculator size={18} className="text-amber-500" /> Porutham Report
                   </h3>
                   {calculating && <div className="text-xs text-amber-500 animate-pulse font-bold">Calculating...</div>}
                </div>
                
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 text-center relative z-10 backdrop-blur-sm">
                   <div className="text-[10px] font-bold uppercase text-stone-500 mb-2 tracking-widest">Compatibility Score</div>
                   <div className="flex items-baseline justify-center gap-2">
                      <motion.span 
                         key={report?.totalScore}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className={`text-5xl font-display font-bold ${report?.totalScore || 0 > 6 ? 'text-green-500' : report?.totalScore || 0 > 4 ? 'text-amber-500' : 'text-red-500'}`}
                      >
                         {report?.totalScore}
                      </motion.span>
                      <span className="text-xl text-stone-600 font-sans font-normal">/ 10</span>
                   </div>
                   <div className={`inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                      report?.totalScore || 0 > 6 
                      ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                      : report?.totalScore || 0 > 4 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                      : 'bg-red-500/10 text-red-500 border-red-500/20'
                   }`}>
                      {report?.verdict}
                   </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3 relative z-10">
                {report?.results.map((res, idx) => (
                   <motion.div 
                      key={res.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors group"
                   >
                      <div>
                         <div className="font-bold text-sm text-stone-300 group-hover:text-white transition-colors">{res.name}</div>
                         <div className="text-[10px] text-stone-500 group-hover:text-stone-400">{res.description}</div>
                      </div>
                      <div className="flex flex-col items-end">
                         {res.score > 0 ? (
                            <div className="flex items-center gap-1.5 text-green-500 font-bold text-xs bg-green-500/10 px-2 py-0.5 rounded border border-green-500/10">
                               <CheckCircle size={10} /> {res.status}
                            </div>
                         ) : (
                            <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs bg-red-500/10 px-2 py-0.5 rounded border border-red-500/10">
                               <XCircle size={10} /> {res.status}
                            </div>
                         )}
                         <span className="text-[9px] text-stone-600 font-mono mt-1">{res.score} pts</span>
                      </div>
                   </motion.div>
                ))}
             </div>

             <div className="p-6 border-t border-white/5 bg-[#1c1917] space-y-5 relative z-10">
                <div>
                   <label className="text-[10px] font-bold text-stone-500 uppercase mb-2 block tracking-widest">Astrologer's Remarks</label>
                   <textarea 
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-stone-600 outline-none resize-none focus:border-amber-500/50 transition-colors"
                      rows={3}
                      placeholder="Add specific observations, pariharams, or warnings..."
                   />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Final Verdict</label>
                    <select 
                       value={finalVerdict}
                       onChange={(e) => setFinalVerdict(e.target.value)}
                       className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm font-bold text-white outline-none focus:border-amber-500/50 appearance-none"
                    >
                       <option disabled>Select Verdict</option>
                       <option value="Highly Suitable">Highly Suitable (Uthamam)</option>
                       <option value="Suitable">Suitable (Madhyamam)</option>
                       <option value="Average">Average</option>
                       <option value="Not Recommended">Not Recommended (Athamam)</option>
                    </select>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};

export default HoroscopeAnalyzer;
