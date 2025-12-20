
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, RefreshCw, Layout, Smartphone, Monitor, Zap, Sparkles, Moon, Sun, Flag, Edit3 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { THEMES, ThemeConfig } from '../../utils/themeDefinitions';
import PremiumButton from '../ui/PremiumButton';
import AdminContentEditor from './AdminContentEditor';

const AdminAppManagement: React.FC = () => {
  const { currentTheme, setTheme, resetTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<'themes' | 'content'>('themes');

  // Group themes by category
  const categories = Array.from(new Set(THEMES.map(t => t.category)));

  const handleThemeSelect = (theme: ThemeConfig) => {
    setTheme(theme.id);
  };

  const getCategoryIcon = (cat: string) => {
      switch(cat) {
          case 'Modern': return <Zap size={18} />;
          case 'Festival': return <Sparkles size={18} />;
          case 'Abstract': return <Palette size={18} />;
          default: return <Layout size={18} />;
      }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#121212] p-4 rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <Layout className="text-purple-600" /> App Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">Control visual themes and website content.</p>
        </div>
        
        <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
           <button 
             onClick={() => setActiveSection('themes')}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeSection === 'themes' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500'}`}
           >
              Themes
           </button>
           <button 
             onClick={() => setActiveSection('content')}
             className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeSection === 'content' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm' : 'text-gray-500'}`}
           >
              Content CMS
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSection === 'content' ? (
           <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <AdminContentEditor />
           </motion.div>
        ) : (
           <motion.div key="themes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              {/* Theme Live Preview Banner */}
              <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                 
                 {/* Animated Overlay for Framer Vibes */}
                 <motion.div 
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }} 
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none"
                 />

                 <div className="relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div>
                       <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase mb-4">
                          <Layout size={12} /> Global Propagation
                       </div>
                       <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">Instant Visual Transformation</h3>
                       <p className="text-purple-200 text-base md:text-lg leading-relaxed mb-6">
                          Select a theme below to instantly update the entire platform ecosystem including User Portals, Broker Dashboards, and Public Pages.
                       </p>
                       <div className="flex gap-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                             <Monitor size={16} /> Web
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                             <Smartphone size={16} /> Mobile
                          </div>
                       </div>
                    </div>
                    
                    {/* Pseudo-Browser Preview */}
                    <div className="relative h-48 md:h-64 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-4 md:p-6 flex flex-col gap-4 overflow-hidden shadow-2xl group">
                       <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                             <div className="h-3 w-3 rounded-full bg-red-500/80" />
                             <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                             <div className="h-3 w-3 rounded-full bg-green-500/80" />
                          </div>
                          <div className="h-2 w-24 bg-white/20 rounded-full" />
                       </div>
                       <div className="h-24 md:h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-white/5 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                          <span className="text-purple-300 text-sm font-bold relative z-10 flex items-center gap-2">
                             <Sparkles size={14} /> Theme Preview
                          </span>
                       </div>
                       <div className="space-y-2">
                          <div className="h-2 w-full bg-white/10 rounded-full" />
                          <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Theme Grid */}
              <div className="space-y-12">
                 {categories.map(category => (
                    <div key={category}>
                       <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                          <span className="p-2 bg-gray-100 dark:bg-white/10 rounded-lg text-purple-600 dark:text-white">
                             {getCategoryIcon(category)}
                          </span>
                          {category} Themes
                       </h3>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {THEMES.filter(t => t.category === category).map(theme => (
                             <motion.div
                                key={theme.id}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={() => handleThemeSelect(theme)}
                                className={`
                                   cursor-pointer rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 relative group shadow-lg
                                   ${currentTheme === theme.id 
                                      ? 'border-purple-600 ring-4 ring-purple-500/20 shadow-purple-500/30' 
                                      : 'border-gray-200 dark:border-white/5 hover:border-purple-400 dark:hover:border-purple-500/50'
                                   }
                                `}
                             >
                                <div className="h-36 relative overflow-hidden" style={{ background: theme.assets?.overlayPattern && theme.assets.overlayPattern.startsWith('linear') ? theme.assets.overlayPattern : theme.colors.background }}>
                                   {theme.assets?.overlayPattern && !theme.assets.overlayPattern.startsWith('linear') && (
                                      <div 
                                        className="absolute inset-0 opacity-10" 
                                        style={{ backgroundImage: theme.assets.overlayPattern.startsWith('http') ? `url('${theme.assets.overlayPattern}')` : theme.assets.overlayPattern }} 
                                      />
                                   )}
                                   <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                      <div className="flex gap-2">
                                         <div className="w-8 h-8 rounded-lg shadow-sm flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.colors.surface, color: theme.colors.text }}>Aa</div>
                                         <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: theme.colors.primary }} />
                                         <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: theme.colors.secondary }} />
                                      </div>
                                      <div className="h-10 w-full rounded-lg shadow-sm flex items-center px-3 gap-2" style={{ backgroundColor: theme.colors.surface }}>
                                         <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                                         <div className="h-1.5 w-16 rounded-full opacity-50" style={{ backgroundColor: theme.colors.text }} />
                                      </div>
                                   </div>
                                   {currentTheme === theme.id && (
                                      <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg z-10">
                                         <Check size={16} strokeWidth={3} />
                                      </div>
                                   )}
                                </div>
                                
                                <div className="p-5 bg-white dark:bg-[#151515]">
                                   <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{theme.name}</h4>
                                      {theme.isDark && <Moon size={14} className="text-gray-400 mt-1" />}
                                   </div>
                                   <div className="flex gap-2 mt-3">
                                      {theme.animation?.type === 'smooth' && (
                                         <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-1 rounded">Smooth Motion</span>
                                      )}
                                      {theme.category === 'Festival' && (
                                         <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-900/20 text-orange-600 px-2 py-1 rounded">Celebration</span>
                                      )}
                                   </div>
                                </div>
                             </motion.div>
                          ))}
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminAppManagement;
