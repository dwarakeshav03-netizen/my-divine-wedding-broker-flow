
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Moon, Calendar, Clock, MapPin, Calculator, ArrowRight, CheckCircle, XCircle, RotateCcw, Sparkles, Info } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedSelect } from '../profile/ProfileFormElements';
import { STARS, calculatePorutham, MatchReport } from '../../utils/astrologyUtils';
import KattamChartGenerator from './KattamChartGenerator';
import useTranslation from '../../hooks/useTranslation';

const PublicMatchingPage: React.FC = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'star' | 'birth'>('star');
  const [result, setResult] = useState<MatchReport | null>(null);
  const [loading, setLoading] = useState(false);

  // Form States
  const [groom, setGroom] = useState({ name: '', star: '', padam: '1', date: '', time: '', place: '' });
  const [bride, setBride] = useState({ name: '', star: '', padam: '1', date: '', time: '', place: '' });

  const handleMatch = () => {
     setLoading(true);
     // Simulate calculation delay
     setTimeout(() => {
        // Logic for Star Match
        if (mode === 'star') {
           if (!groom.star || !bride.star) {
              alert("Please select stars for both");
              setLoading(false);
              return;
           }
           const report = calculatePorutham(groom.star, bride.star);
           setResult(report);
        } else {
           // Logic for Birth Match (Mocked for demo as accurate calc needs library)
           // In real app: Calculate Star from Date/Time here
           const mockGroomStar = STARS[Math.floor(Math.random() * STARS.length)].name;
           const mockBrideStar = STARS[Math.floor(Math.random() * STARS.length)].name;
           const report = calculatePorutham(mockGroomStar, mockBrideStar);
           setResult(report);
        }
        setLoading(false);
     }, 1500);
  };

  const reset = () => {
     setResult(null);
     setGroom({ name: '', star: '', padam: '1', date: '', time: '', place: '' });
     setBride({ name: '', star: '', padam: '1', date: '', time: '', place: '' });
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
       
       <div className="text-center mb-12">
          <motion.div 
             initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-sm font-bold uppercase tracking-wider mb-4"
          >
             <Star size={16} /> Free Service
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-4">
             Horoscope <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Matching</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg flex flex-col items-center gap-2">
             Check marriage compatibility using the traditional South Indian 10 Porutham system.
             <span className="text-sm bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-900/20 flex items-center gap-2 mt-2">
                <Info size={16} /> Disclaimer: Results are system-generated and may not be fully accurate. For precise guidance, consult our astrologer.
             </span>
          </p>
       </div>

       {/* Mode Switcher */}
       {!result && (
          <div className="flex justify-center mb-12">
             <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-1 rounded-xl border border-gray-200 dark:border-white/10 flex shadow-lg">
                <button 
                   onClick={() => setMode('star')}
                   className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'star' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                   <Star size={16} /> Match by Star
                </button>
                <button 
                   onClick={() => setMode('birth')}
                   className={`px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${mode === 'birth' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                   <Calendar size={16} /> Match by Birth
                </button>
             </div>
          </div>
       )}

       <AnimatePresence mode="wait">
          {!result ? (
             <motion.div 
                key="input"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
             >
                {/* Groom Input */}
                <div className="bg-white/80 dark:bg-[#121212] p-8 rounded-[2.5rem] shadow-xl border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                         <UserIcon />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-gray-900 dark:text-white">Groom Details</h3>
                         <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Male</p>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <AnimatedInput label="Name" value={groom.name} onChange={e => setGroom({...groom, name: e.target.value})} placeholder="Enter Name" />
                      
                      {mode === 'star' ? (
                         <>
                            <AnimatedSelect 
                               label="Star (Nakshatra)" 
                               value={groom.star} 
                               onChange={e => setGroom({...groom, star: e.target.value})}
                               options={STARS.map(s => ({ value: s.name, label: s.name }))}
                            />
                            <AnimatedSelect 
                               label="Padam" 
                               value={groom.padam} 
                               onChange={e => setGroom({...groom, padam: e.target.value})}
                               options={[1,2,3,4].map(p => ({ value: p, label: `Padam ${p}` }))}
                            />
                         </>
                      ) : (
                         <>
                            <div className="grid grid-cols-2 gap-4">
                               <AnimatedInput label="Date" type="date" value={groom.date} onChange={e => setGroom({...groom, date: e.target.value})} />
                               <AnimatedInput label="Time" type="time" value={groom.time} onChange={e => setGroom({...groom, time: e.target.value})} />
                            </div>
                            <AnimatedInput label="Place of Birth" value={groom.place} onChange={e => setGroom({...groom, place: e.target.value})} icon={<MapPin size={18} />} />
                         </>
                      )}
                   </div>
                </div>

                {/* Bride Input */}
                <div className="bg-white/80 dark:bg-[#121212] p-8 rounded-[2.5rem] shadow-xl border border-pink-100 dark:border-pink-900/30 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                   <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                         <UserIcon />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bride Details</h3>
                         <p className="text-xs text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider">Female</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <AnimatedInput label="Name" value={bride.name} onChange={e => setBride({...bride, name: e.target.value})} placeholder="Enter Name" />
                      
                      {mode === 'star' ? (
                         <>
                            <AnimatedSelect 
                               label="Star (Nakshatra)" 
                               value={bride.star} 
                               onChange={e => setBride({...bride, star: e.target.value})}
                               options={STARS.map(s => ({ value: s.name, label: s.name }))}
                            />
                            <AnimatedSelect 
                               label="Padam" 
                               value={bride.padam} 
                               onChange={e => setBride({...bride, padam: e.target.value})}
                               options={[1,2,3,4].map(p => ({ value: p, label: `Padam ${p}` }))}
                            />
                         </>
                      ) : (
                         <>
                            <div className="grid grid-cols-2 gap-4">
                               <AnimatedInput label="Date" type="date" value={bride.date} onChange={e => setBride({...bride, date: e.target.value})} />
                               <AnimatedInput label="Time" type="time" value={bride.time} onChange={e => setBride({...bride, time: e.target.value})} />
                            </div>
                            <AnimatedInput label="Place of Birth" value={bride.place} onChange={e => setBride({...bride, place: e.target.value})} icon={<MapPin size={18} />} />
                         </>
                      )}
                   </div>
                </div>

                <div className="md:col-span-2 flex justify-center mt-4">
                   <PremiumButton 
                      onClick={handleMatch} 
                      disabled={loading}
                      className="!px-12 !py-4 text-lg shadow-2xl shadow-purple-500/30"
                      variant="gradient"
                      icon={loading ? <Calculator className="animate-spin" /> : <Sparkles />}
                   >
                      {loading ? 'Calculating...' : 'Check Compatibility'}
                   </PremiumButton>
                </div>
             </motion.div>
          ) : (
             <motion.div 
                key="result"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="max-w-6xl mx-auto"
             >
                <div className="grid lg:grid-cols-3 gap-8">
                   
                   {/* Left: Charts */}
                   <div className="space-y-6">
                      <div className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-lg">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600"><UserIcon /></div>
                            <div>
                               <h3 className="font-bold">{groom.name || 'Groom'}</h3>
                               <p className="text-xs text-gray-500">{result.groomStar.name} • {result.groomStar.rashi}</p>
                            </div>
                         </div>
                         <KattamChartGenerator 
                            title="Groom's Rasi" 
                            highlightRasi={result.groomStar.rashi} 
                            labels={[{ rasi: result.groomStar.rashi, label: 'Star' }]}
                         />
                      </div>

                      <div className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-lg">
                         <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full text-pink-600"><UserIcon /></div>
                            <div>
                               <h3 className="font-bold">{bride.name || 'Bride'}</h3>
                               <p className="text-xs text-gray-500">{result.brideStar.name} • {result.brideStar.rashi}</p>
                            </div>
                         </div>
                         <KattamChartGenerator 
                            title="Bride's Rasi" 
                            highlightRasi={result.brideStar.rashi}
                            labels={[{ rasi: result.brideStar.rashi, label: 'Star' }]}
                         />
                      </div>
                   </div>

                   {/* Center & Right: Report */}
                   <div className="lg:col-span-2 space-y-6">
                      
                      {/* Verdict Banner */}
                      <div className={`p-8 rounded-[2.5rem] text-center border-4 border-double ${result.totalScore > 5 ? 'bg-green-50 dark:bg-green-900/20 border-green-200' : 'bg-red-50 dark:bg-red-900/20 border-red-200'}`}>
                         <h2 className="text-3xl font-display font-bold mb-2">{result.verdict}</h2>
                         <p className="text-lg font-medium opacity-80">Total Score: {result.totalScore} / 10</p>
                      </div>

                      {/* 10 Porutham Grid */}
                      <div className="bg-white/60 dark:bg-[#121212] backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                         <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Moon className="text-purple-600" /> 10 Porutham Analysis
                         </h3>
                         
                         <div className="grid md:grid-cols-2 gap-4">
                            {result.results.map((res, i) => (
                               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                  <div>
                                     <h4 className="font-bold text-sm text-gray-900 dark:text-white">{res.name}</h4>
                                     <p className="text-xs text-gray-500">{res.description}</p>
                                  </div>
                                  <div className="text-right">
                                     <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                        res.status === 'Uthamam' ? 'bg-green-100 text-green-700' : 
                                        res.status === 'Mathiyamam' ? 'bg-amber-100 text-amber-700' : 
                                        'bg-red-100 text-red-700'
                                     }`}>
                                        {res.status}
                                     </span>
                                     <p className="text-xs font-mono mt-1">{res.score} pt</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="flex justify-center">
                         <PremiumButton onClick={reset} variant="outline" icon={<RotateCcw size={18} />}>
                            Check Another Match
                         </PremiumButton>
                      </div>
                   </div>

                </div>
             </motion.div>
          )}
       </AnimatePresence>

    </div>
  );
};

const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default PublicMatchingPage;
