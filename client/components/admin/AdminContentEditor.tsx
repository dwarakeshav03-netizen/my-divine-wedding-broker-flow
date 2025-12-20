
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, Image, FileText, Phone, MapPin, Save, RefreshCw, Layout, AlignLeft } from 'lucide-react';
import { useContent, SiteContent } from '../../contexts/ContentContext';
import PremiumButton from '../ui/PremiumButton';

const AdminContentEditor: React.FC = () => {
  const { content, updateContent, resetContent } = useContent();
  const [activeTab, setActiveTab] = useState<keyof SiteContent>('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save delay for feedback
    setTimeout(() => setIsSaving(false), 800);
  };

  const sections: { id: keyof SiteContent; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General & Branding', icon: <Layout size={18} /> },
    { id: 'hero', label: 'Hero Section', icon: <Image size={18} /> },
    { id: 'features', label: 'Why Choose Us', icon: <StarIcon size={18} /> },
    { id: 'stories', label: 'Success Stories', icon: <HeartIcon size={18} /> },
    { id: 'company', label: 'Company / About', icon: <FileText size={18} /> },
    { id: 'contact', label: 'Contact Info', icon: <Phone size={18} /> },
    { id: 'footer', label: 'Footer', icon: <AlignLeft size={18} /> },
    { id: 'faq', label: 'FAQ Page', icon: <HelpIcon size={18} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
       
       {/* Sidebar Navigation */}
       <div className="w-full md:w-64 bg-white dark:bg-[#121212] rounded-3xl border border-gray-200 dark:border-white/5 p-4 h-fit shrink-0">
          <h3 className="font-bold text-lg px-4 mb-4 text-gray-900 dark:text-white">Content Manager</h3>
          <nav className="flex md:block overflow-x-auto md:overflow-visible gap-2 md:gap-0 pb-2 md:pb-0 space-y-0 md:space-y-1">
             {sections.map(item => (
                <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`flex-shrink-0 w-auto md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === item.id 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                   }`}
                >
                   {item.icon} {item.label}
                </button>
             ))}
          </nav>
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 px-2 hidden md:block">
              <button 
                onClick={() => { if(confirm('Reset all content to defaults?')) resetContent(); }}
                className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center justify-center gap-2"
              >
                  <RefreshCw size={14} /> Reset Defaults
              </button>
          </div>
       </div>

       {/* Form Area */}
       <div className="flex-1 bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col min-h-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
          
          <div className="flex justify-between items-center mb-8 shrink-0">
              <h2 className="text-xl md:text-2xl font-bold capitalize">{activeTab} Settings</h2>
              <PremiumButton 
                 onClick={handleSave} 
                 icon={isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                 className="!py-2 !px-4 md:!px-6 !text-xs md:!text-sm"
              >
                 {isSaving ? 'Saving...' : 'Publish'}
              </PremiumButton>
          </div>

          <div className="space-y-6 max-w-3xl overflow-y-auto custom-scrollbar flex-1 pb-4">
             <AnimatePresence mode="wait">
                <motion.div
                   key={activeTab}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-6"
                >
                   {Object.entries(content[activeTab]).map(([key, value]) => (
                      <div key={key}>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                         </label>
                         {String(value).length > 60 ? (
                             <textarea 
                                value={value as string}
                                onChange={(e) => updateContent(activeTab, { [key]: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 min-h-[100px] transition-all"
                             />
                         ) : (
                             <input 
                                type="text"
                                value={value as string}
                                onChange={(e) => updateContent(activeTab, { [key]: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all"
                             />
                         )}
                      </div>
                   ))}
                </motion.div>
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
};

// Icons
const StarIcon = ({size}:{size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const HeartIcon = ({size}:{size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const HelpIcon = ({size}:{size:number}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

export default AdminContentEditor;
