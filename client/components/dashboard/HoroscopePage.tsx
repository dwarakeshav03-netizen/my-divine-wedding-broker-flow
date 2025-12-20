

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, Upload, FileText, Sparkles, CheckCircle, AlertTriangle, 
  ChevronRight, RefreshCw, Star, Sun, Shield, Lock, Download, ScrollText, Calendar, Clock, MapPin
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { FileUpload, AnimatedInput, AnimatedSelect } from '../profile/ProfileFormElements';
import { RAASI_LIST, NAKSHATRA_LIST } from '../../constants';
import { extractHoroscopeData, compareHoroscopes, HoroscopeData, MatchReport } from '../../utils/mockAI';

const HoroscopePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'create' | 'match' | 'report'>('upload');
  
  // Generation State
  const [genData, setGenData] = useState({ date: '', time: '', place: '' });
  const [generated, setGenerated] = useState(false);
  const [myReport, setMyReport] = useState<any>(null);

  useEffect(() => {
     const email = localStorage.getItem('mdm_user_session');
     const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
     const currentUser = users.find((u: any) => u.email === email);
     if (currentUser) {
         const reports = JSON.parse(localStorage.getItem('mdm_astro_reports') || '{}');
         if (reports[currentUser.id]) {
             setMyReport(reports[currentUser.id]);
         }
     }
  }, []);

  const handleGenerate = () => {
      if(!genData.date || !genData.time || !genData.place) return;
      setGenerated(true);
      // Logic to actually generate/save would go here
  };

  return (
    <div className="bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-2xl min-h-[600px]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Moon className="text-purple-600 dark:text-gold-400" />
            Horoscope & Star Matching
          </h2>
        </div>
        
        <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-full md:w-auto overflow-x-auto">
           {['upload', 'create', 'match'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                   activeTab === tab 
                   ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' 
                   : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                 {tab === 'upload' ? 'Upload Jathagam' : tab === 'create' ? 'Generate Chart' : 'Star Match'}
              </button>
           ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
         {activeTab === 'upload' && <UploadView key="upload" />}
         
         {activeTab === 'create' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                 <h3 className="text-xl font-bold mb-6">Generate Horoscope</h3>
                 <div className="grid md:grid-cols-2 gap-6 mb-6">
                     <AnimatedInput label="Date of Birth" type="date" value={genData.date} onChange={e => setGenData({...genData, date: e.target.value})} icon={<Calendar size={18} />} />
                     <AnimatedInput label="Time of Birth" type="time" value={genData.time} onChange={e => setGenData({...genData, time: e.target.value})} icon={<Clock size={18} />} />
                     <AnimatedInput label="Place of Birth" value={genData.place} onChange={e => setGenData({...genData, place: e.target.value})} icon={<MapPin size={18} />} />
                 </div>
                 <PremiumButton onClick={handleGenerate} width="full" variant="gradient">Generate Chart</PremiumButton>
                 
                 {generated && (
                     <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-white/5 text-center">
                         <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
                         <p className="font-bold">Horoscope Generated Successfully!</p>
                         <p className="text-sm text-gray-500">Your Raasi and Nakshatra have been updated.</p>
                     </div>
                 )}
             </motion.div>
         )}

         {activeTab === 'match' && <MatchView key="match" />}
      </AnimatePresence>

    </div>
  );
};

const UploadView: React.FC = () => {
   const [file, setFile] = useState<File | null>(null);
   const [isScanning, setIsScanning] = useState(false);
   const [data, setData] = useState<HoroscopeData | null>(null);

   const handleUpload = async (f: File) => {
      setFile(f);
      setIsScanning(true);
      const res = await extractHoroscopeData(f);
      setData(res);
      setIsScanning(false);
   };

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
         {!data ? (
            <div className="bg-white/60 dark:bg-white/5 rounded-2xl p-8 border border-dashed border-gray-300 dark:border-white/20">
               {isScanning ? (
                  <div className="flex flex-col items-center py-10">
                     <RefreshCw size={40} className="text-purple-600 animate-spin mb-4" />
                     <p className="font-bold">Analyzing Horoscope...</p>
                  </div>
               ) : (
                  <FileUpload label="Select Horoscope File" accept=".pdf,.jpg,.jpeg,.png" onFileSelect={handleUpload} />
               )}
            </div>
         ) : (
            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-2xl p-8 border border-purple-100 dark:border-white/10">
               <div className="flex items-center gap-3 mb-6 text-green-600 font-bold">
                  <CheckCircle size={24} /> Successfully Extracted
               </div>
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                     <p className="text-xs text-gray-500 uppercase font-bold">Raasi</p>
                     <p className="text-lg font-bold capitalize">{data.raasi}</p>
                  </div>
                  <div className="bg-white dark:bg-black/20 p-4 rounded-xl">
                     <p className="text-xs text-gray-500 uppercase font-bold">Nakshatra</p>
                     <p className="text-lg font-bold capitalize">{data.nakshatra}</p>
                  </div>
               </div>
               <PremiumButton onClick={() => { setData(null); setFile(null); }} variant="outline">Re-upload</PremiumButton>
            </div>
         )}
      </motion.div>
   );
};

const MatchView: React.FC = () => {
   const [isMatching, setIsMatching] = useState(false);
   const [report, setReport] = useState<MatchReport | null>(null);

   const handleMatch = async () => {
      setIsMatching(true);
      setReport(null);
      const res = await compareHoroscopes({}, {});
      setIsMatching(false);
      setReport(res);
   };

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-center">
         {!report ? (
            <div className="py-10">
               <p className="mb-6">Check compatibility based on Star Matching logic.</p>
               <PremiumButton onClick={handleMatch} variant="gradient" disabled={isMatching}>
                  {isMatching ? 'Calculating...' : 'Check Compatibility'}
               </PremiumButton>
            </div>
         ) : (
            <div className="bg-white/60 dark:bg-white/5 rounded-3xl p-8 border border-white/20 shadow-xl">
               <h3 className="text-2xl font-bold mb-4">Match Score: {report.totalScore}/10</h3>
               <p className="text-lg">{report.verdict}</p>
               <PremiumButton onClick={() => setReport(null)} variant="outline" className="mt-6">New Check</PremiumButton>
            </div>
         )}
      </motion.div>
   );
};

export default HoroscopePage;
