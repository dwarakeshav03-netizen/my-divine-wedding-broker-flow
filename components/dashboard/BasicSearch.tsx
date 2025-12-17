
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, MapPin, X, ChevronDown, RotateCcw, Crosshair, ArrowUpRight, CheckCircle
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import GradientRangeSlider from '../ui/GradientRangeSlider';
import { MatchCard } from './DashboardWidgets';
import { generateMockProfiles, Profile } from '../../utils/mockData';
import { RAASI_LIST, NAKSHATRA_LIST } from '../../constants';
import ProfileDetailModal from './ProfileDetailModal';

interface MatchSearchProps {
  initialMode?: 'default' | 'keyword' | 'community';
}

// Filter Categories
const SECTIONS = {
  BASIC: 'Basic Details',
  LOCATION: 'Location & GPS',
  PROFESSIONAL: 'Education & Career',
  CULTURAL: 'Religion & Horoscope',
  LIFESTYLE: 'Lifestyle & Habits'
};

const MatchSearch: React.FC<MatchSearchProps> = ({ initialMode = 'default' }) => {
  // --- STATE MANAGEMENT ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Mobile sidebar toggle
  const [expandedSection, setExpandedSection] = useState<string>(
    initialMode === 'community' ? SECTIONS.CULTURAL : SECTIONS.BASIC
  );
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  
  // Sorting
  const [sortBy, setSortBy] = useState('relevance');

  // Filters State
  const [filters, setFilters] = useState({
    age: [21, 35] as [number, number],
    height: [150, 180] as [number, number], // cm
    gender: 'female',
    maritalStatus: [] as string[],
    
    // Location
    country: 'India',
    state: '',
    gpsEnabled: false,
    gpsCoordinates: null as { lat: number, lng: number } | null,
    gpsRadius: 50, // km
    
    // Cultural
    religion: [] as string[],
    caste: [] as string[],
    raasi: [] as string[],
    nakshatra: [] as string[],
    
    // Professional
    education: [] as string[],
    profession: [] as string[],
    income: [5, 50] as [number, number], // Lakhs PA
    
    // Lifestyle
    diet: [] as string[],
    familyType: [] as string[],
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Focus search bar if entering via Keyword Search nav
    if (initialMode === 'keyword' && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Trigger initial load
    handleSearch();
  }, [initialMode]);

  // --- HANDLERS ---

  const handleInputChange = (section: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [section]: value }));
  };

  const toggleArraySelection = (section: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[section] as string[];
      const exists = current.includes(value);
      return {
        ...prev,
        [section]: exists ? current.filter(i => i !== value) : [...current, value]
      };
    });
  };

  const handleGPSDetect = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFilters(prev => ({
            ...prev,
            gpsEnabled: true,
            gpsCoordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude }
          }));
        },
        (err) => alert("Location access denied. Please enable GPS.")
      );
    }
  };

  // --- INTERACTIONS (Connect/Interest/Shortlist) ---
  const currentUserEmail = localStorage.getItem('mdm_user_session') || localStorage.getItem('mdm_email');
  const currentUser = JSON.parse(localStorage.getItem('mdm_users') || '[]').find((u:any) => u.email === currentUserEmail);
  const currentUserId = currentUser?.id || 'GUEST';

  const getConnectionStatus = (targetId: string) => {
     const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
     const rel = rels.find((r: any) => 
        (r.fromUserId === currentUserId && r.toUserId === targetId) ||
        (r.fromUserId === targetId && r.toUserId === currentUserId)
     );
     // If blocked, treat as none so user might try to interact and get block message or we can hide actions
     if (rel && rel.status === 'blocked') return 'none'; 
     return rel ? rel.status : 'none';
  };

  const handleConnect = (profile: Profile) => {
     if(!currentUserEmail) { alert("Please login to connect"); return; }
     
     const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
     if (rels.find((r:any) => r.fromUserId === currentUserId && r.toUserId === profile.id)) {
        alert("Already connected/requested.");
        return;
     }

     const newRel = {
         id: `REL-${Date.now()}`,
         fromUserId: currentUserId,
         toUserId: profile.id,
         fromUserName: currentUser?.name || 'You',
         toUserName: profile.name,
         fromUserImg: currentUser?.avatar,
         toUserImg: profile.img,
         status: 'pending',
         timestamp: new Date().toLocaleString()
     };
     localStorage.setItem('mdm_relationships', JSON.stringify([newRel, ...rels]));
     alert(`Connection request sent to ${profile.name}`);
     
     // Refresh modal status if open
     if(selectedProfile?.id === profile.id) {
         setSelectedProfile({...profile});
     }
  };

  const handleInterest = (profile: Profile) => {
      if(!currentUserEmail) { alert("Please login to send interest"); return; }
      
      const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
      const newInt = {
         id: `INT-${Date.now()}`,
         fromUserId: currentUserId,
         toUserId: profile.id,
         fromUserName: currentUser?.name || 'You',
         toUserName: profile.name,
         fromUserImg: currentUser?.avatar,
         toUserImg: profile.img,
         status: 'pending_admin',
         timestamp: new Date().toLocaleString()
      };
      localStorage.setItem('mdm_relationships', JSON.stringify([newInt, ...rels]));
      alert(`Interest sent to ${profile.name}`);
  };

  const handleShortlist = (profile: Profile) => {
      const currentShortlist = JSON.parse(localStorage.getItem('mdm_shortlisted') || '[]');
      if (!currentShortlist.find((p:Profile) => p.id === profile.id)) {
          localStorage.setItem('mdm_shortlisted', JSON.stringify([profile, ...currentShortlist]));
          alert(`Added ${profile.name} to shortlist.`);
      } else {
          alert(`${profile.name} is already shortlisted.`);
      }
  };

  const handleSearch = () => {
    setLoading(true);
    
    // Simulate Search Algorithm with Delay
    setTimeout(() => {
      let pool = generateMockProfiles(40); // Generate larger pool for filtering
      
      // Get blocked users to exclude
      const rels = JSON.parse(localStorage.getItem('mdm_relationships') || '[]');
      const blockedIds = rels
        .filter((r:any) => (r.fromUserId === currentUserId || r.toUserId === currentUserId) && r.status === 'blocked')
        .map((r:any) => r.fromUserId === currentUserId ? r.toUserId : r.fromUserId);

      // 1. Keyword Search
      if (query) {
        const q = query.toLowerCase();
        pool = pool.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.occupation.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.education.toLowerCase().includes(q) ||
          p.caste.toLowerCase().includes(q)
        );
      }

      // 2. Apply Filters
      pool = pool.filter(p => {
        if (blockedIds.includes(p.id)) return false;

        // Basic
        if (p.age < filters.age[0] || p.age > filters.age[1]) return false;
        if (p.heightCm < filters.height[0] || p.heightCm > filters.height[1]) return false;
        
        // Cultural (Exact match if filter selected)
        if (filters.religion.length > 0 && !filters.religion.includes(p.religion)) return false;
        if (filters.caste.length > 0 && !filters.caste.includes(p.caste)) return false;
        if (filters.raasi.length > 0 && !filters.raasi.includes(p.raasi)) return false;

        // Professional
        const pIncome = parseInt(p.income.replace(/[^0-9]/g, '')) || 10;
        if (pIncome < filters.income[0] || pIncome > filters.income[1]) return false;

        return true;
      });

      // 3. Sorting
      if (sortBy === 'income') pool.sort((a, b) => parseInt(b.income) - parseInt(a.income));
      if (sortBy === 'newest') pool.sort((a, b) => (a.isNew ? -1 : 1));
      if (sortBy === 'relevance') {
         // Mock Score Sort
         pool = pool.map(p => ({ ...p, matchScore: Math.floor(Math.random() * (98 - 60) + 60) }));
         pool.sort((a, b) => b.matchScore - a.matchScore);
      }

      setResults(pool);
      setLoading(false);
    }, 800);
  };

  const clearFilters = () => {
    setFilters({
      age: [21, 35], height: [150, 180], gender: 'female', maritalStatus: [],
      country: 'India', state: '', gpsEnabled: false, gpsCoordinates: null, gpsRadius: 50,
      religion: [], caste: [], raasi: [], nakshatra: [],
      education: [], profession: [], income: [5, 50],
      diet: [], familyType: []
    });
    setQuery('');
    handleSearch();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 relative items-start">
      
      {/* --- FILTER SIDEBAR --- */}
      <AnimatePresence>
        {(showFilters || window.innerWidth >= 1024) && (
           <motion.aside
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                 fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-80 
                 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl 
                 lg:bg-white/60 lg:dark:bg-black/20 
                 border-r lg:border lg:border-white/20 lg:dark:border-white/10
                 p-0 flex flex-col h-full lg:h-[calc(100vh-140px)] lg:rounded-[2rem] shadow-2xl lg:shadow-none
                 ${!showFilters ? 'hidden lg:flex' : 'flex'}
              `}
           >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-white/50 dark:bg-white/[0.02] shrink-0">
                 <h3 className="text-xl font-bold flex items-center gap-2 font-display">
                    <Filter size={20} className="text-purple-600" /> Filters
                 </h3>
                 <button 
                    onClick={clearFilters}
                    className="text-xs font-bold text-gray-500 hover:text-purple-600 flex items-center gap-1"
                 >
                    <RotateCcw size={12} /> Reset
                 </button>
                 <button onClick={() => setShowFilters(false)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                    <X size={20} />
                 </button>
              </div>

              {/* Filter Sections - Scrollable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                 
                 {/* 1. Basic Details */}
                 <FilterSection 
                    title={SECTIONS.BASIC} 
                    isOpen={expandedSection === SECTIONS.BASIC} 
                    onToggle={() => setExpandedSection(expandedSection === SECTIONS.BASIC ? '' : SECTIONS.BASIC)}
                 >
                    <div className="space-y-6 pt-4">
                       <div>
                          <FilterLabel label="Age Range" value={`${filters.age[0]} - ${filters.age[1]} Yrs`} />
                          <GradientRangeSlider min={18} max={60} value={filters.age} onChange={(v) => handleInputChange('age', v)} />
                       </div>
                       <div>
                          <FilterLabel label="Height" value={`${filters.height[0]} - ${filters.height[1]} cm`} />
                          <GradientRangeSlider min={140} max={210} value={filters.height} onChange={(v) => handleInputChange('height', v)} />
                       </div>
                       <div>
                          <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Marital Status</label>
                          <div className="flex flex-wrap gap-2">
                             {['Never Married', 'Divorced', 'Widowed'].map(s => (
                                <Chip 
                                   key={s} label={s} 
                                   selected={filters.maritalStatus.includes(s)} 
                                   onClick={() => toggleArraySelection('maritalStatus', s)} 
                                />
                             ))}
                          </div>
                       </div>
                    </div>
                 </FilterSection>

                 {/* 2. Location & GPS */}
                 <FilterSection 
                    title={SECTIONS.LOCATION} 
                    isOpen={expandedSection === SECTIONS.LOCATION}
                    onToggle={() => setExpandedSection(expandedSection === SECTIONS.LOCATION ? '' : SECTIONS.LOCATION)}
                 >
                    <div className="space-y-4 pt-4">
                       <button 
                          onClick={handleGPSDetect}
                          className={`w-full py-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                             filters.gpsEnabled 
                             ? 'border-green-500 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400' 
                             : 'border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
                          }`}
                       >
                          {filters.gpsEnabled ? <CheckCircle size={16} /> : <Crosshair size={16} />}
                          {filters.gpsEnabled ? 'GPS Active' : 'Use Current Location'}
                       </button>

                       {filters.gpsEnabled && (
                          <div className="space-y-2">
                             <FilterLabel label="Search Radius" value={`${filters.gpsRadius} km`} />
                             <input 
                                type="range" min="10" max="500" value={filters.gpsRadius} 
                                onChange={(e) => handleInputChange('gpsRadius', parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                             />
                          </div>
                       )}
                    </div>
                 </FilterSection>

                 {/* 3. Cultural */}
                 <FilterSection
                    title={SECTIONS.CULTURAL}
                    isOpen={expandedSection === SECTIONS.CULTURAL}
                    onToggle={() => setExpandedSection(expandedSection === SECTIONS.CULTURAL ? '' : SECTIONS.CULTURAL)}
                 >
                    <div className="space-y-4 pt-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Religion</label>
                          <div className="flex flex-wrap gap-2">
                             {['Hindu', 'Christian', 'Muslim', 'Jain'].map(r => (
                                <Chip key={r} label={r} selected={filters.religion.includes(r)} onClick={() => toggleArraySelection('religion', r)} />
                             ))}
                          </div>
                       </div>
                       <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 uppercase">Caste</label>
                           <div className="flex flex-wrap gap-2">
                              {['Iyer', 'Iyengar', 'Mudaliar', 'Nadar', 'Vanniyar'].map(c => (
                                 <Chip key={c} label={c} selected={filters.caste.includes(c)} onClick={() => toggleArraySelection('caste', c)} />
                              ))}
                           </div>
                       </div>
                    </div>
                 </FilterSection>

                 {/* 4. Professional */}
                 <FilterSection
                    title={SECTIONS.PROFESSIONAL}
                    isOpen={expandedSection === SECTIONS.PROFESSIONAL}
                    onToggle={() => setExpandedSection(expandedSection === SECTIONS.PROFESSIONAL ? '' : SECTIONS.PROFESSIONAL)}
                 >
                    <div className="space-y-6 pt-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase">Education</label>
                          <div className="flex flex-wrap gap-2">
                             {['B.Tech', 'M.Tech', 'MBA', 'MBBS', 'CA', 'Ph.D'].map(e => (
                                <Chip key={e} label={e} selected={filters.education.includes(e)} onClick={() => toggleArraySelection('education', e)} />
                             ))}
                          </div>
                       </div>
                       <div>
                          <FilterLabel label="Annual Income" value={`${filters.income[0]}L - ${filters.income[1]}L PA`} />
                          <GradientRangeSlider min={0} max={100} value={filters.income} onChange={(v) => handleInputChange('income', v)} />
                       </div>
                    </div>
                 </FilterSection>
              </div>

              {/* Mobile Sidebar Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-white/10 lg:hidden shrink-0">
                 <PremiumButton onClick={() => { setShowFilters(false); handleSearch(); }} width="full">Apply Filters</PremiumButton>
              </div>
           </motion.aside>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 w-full min-w-0">
         
         {/* Search Header */}
         <div className="mb-6 flex flex-col gap-4 px-1">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
                     Match Search
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                     Find your perfect partner using smart filters and keywords.
                  </p>
               </div>
               <button 
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden p-3 bg-purple-600 text-white rounded-xl shadow-lg flex items-center gap-2"
               >
                  <Filter size={18} /> Filters
               </button>
            </div>

            {/* Main Search Bar */}
            <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
               <div className="relative flex items-center bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-2xl p-2 shadow-sm transition-all focus-within:shadow-lg focus-within:border-purple-500/50">
                  <Search className="ml-4 text-gray-400" size={24} />
                  <input 
                     ref={searchInputRef}
                     type="text" 
                     placeholder="Search by Name, Company, Profession, or Native Place..." 
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                     className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 text-base font-medium"
                  />
                  <div className="flex items-center gap-2 pr-2">
                     {query && (
                        <button onClick={() => setQuery('')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400 transition-colors">
                           <X size={18} />
                        </button>
                     )}
                     <PremiumButton onClick={handleSearch} className="!py-2.5 !px-6 !rounded-xl !text-sm">
                        Search
                     </PremiumButton>
                  </div>
               </div>
            </div>

            {/* Quick Stats & Sort */}
            <div className="flex justify-between items-center px-1">
               <div className="flex gap-2">
                  {loading ? (
                     <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                  ) : (
                     <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                        {results.length > 0 ? `${results.length} Profiles Found` : 'Start your search'}
                     </span>
                  )}
               </div>
               
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 uppercase">Sort By:</span>
                  <div className="relative">
                     <select 
                        value={sortBy} 
                        onChange={(e) => { setSortBy(e.target.value); handleSearch(); }}
                        className="bg-transparent text-sm font-bold text-purple-600 dark:text-gold-400 outline-none cursor-pointer pr-4 appearance-none"
                     >
                        <option value="relevance">Relevance (AI)</option>
                        <option value="newest">Newest First</option>
                        <option value="lastActive">Last Active</option>
                        <option value="income">Income (High-Low)</option>
                        {filters.gpsEnabled && <option value="distance">Distance</option>}
                     </select>
                     <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none" />
                  </div>
               </div>
            </div>
         </div>

         {/* Results Grid - Using natural layout (no forced overflow hidden/scroll) */}
         <div className="p-2 pb-24">
            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="aspect-[4/5] bg-gray-100 dark:bg-white/5 rounded-[2rem] animate-pulse" />
                  ))}
               </div>
            ) : results.length > 0 ? (
               <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
               >
                  {results.map((profile, idx) => (
                     <MatchCard 
                        key={profile.id}
                        match={{
                           ...profile,
                           job: profile.occupation,
                           image: profile.img
                        }} 
                        delay={idx * 0.05}
                        onConnect={() => handleConnect(profile)}
                        onInterest={() => handleInterest(profile)}
                        onShortlist={() => handleShortlist(profile)}
                        onViewProfile={() => setSelectedProfile(profile)}
                     />
                  ))}
               </motion.div>
            ) : (
               <div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-gray-300 dark:border-white/10">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400 mb-6">
                     <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Profiles Found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                     Try adjusting your filters or use broader keywords like "Engineer" or "Chennai".
                  </p>
                  <button onClick={clearFilters} className="mt-6 text-purple-600 font-bold hover:underline">Clear all filters</button>
               </div>
            )}
         </div>

      </div>

      {/* Profile Detail Modal */}
      <AnimatePresence>
         {selectedProfile && (
            <ProfileDetailModal 
               profile={selectedProfile}
               onClose={() => setSelectedProfile(null)}
               onConnect={handleConnect}
               onInterest={handleInterest}
               onShortlist={handleShortlist}
               connectionStatus={getConnectionStatus(selectedProfile.id)}
            />
         )}
      </AnimatePresence>

    </div>
  );
};

// --- SUB-COMPONENTS ---

const FilterSection: React.FC<{ title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }> = ({ title, children, isOpen, onToggle }) => (
   <div className="border-b border-gray-100 dark:border-white/5 pb-6 last:border-0">
      <button onClick={onToggle} className="w-full flex justify-between items-center group">
         <h4 className={`text-sm font-bold uppercase tracking-wider transition-colors ${isOpen ? 'text-purple-600 dark:text-gold-400' : 'text-gray-500'}`}>{title}</h4>
         <div className={`p-1 rounded-full transition-all ${isOpen ? 'bg-purple-100 text-purple-600 rotate-180' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
            <ChevronDown size={16} />
         </div>
      </button>
      <AnimatePresence>
         {isOpen && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }} 
               animate={{ height: 'auto', opacity: 1 }} 
               exit={{ height: 0, opacity: 0 }} 
               className="overflow-hidden"
            >
               {children}
            </motion.div>
         )}
      </AnimatePresence>
   </div>
);

const FilterLabel: React.FC<{ label: string, value?: string }> = ({ label, value }) => (
   <div className="flex justify-between items-center mb-2">
      <label className="text-xs font-bold text-gray-700 dark:text-gray-300">{label}</label>
      {value && <span className="text-xs font-bold text-purple-600 dark:text-gold-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded">{value}</span>}
   </div>
);

const Chip: React.FC<{ label: string, selected: boolean, onClick: () => void }> = ({ label, selected, onClick }) => (
   <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
         selected 
         ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/30' 
         : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-purple-300'
      }`}
   >
      {label}
   </button>
);

export default MatchSearch;
