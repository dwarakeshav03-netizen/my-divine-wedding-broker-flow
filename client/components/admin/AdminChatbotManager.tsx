
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Save, Trash2, Globe, Database, Navigation } from 'lucide-react';
import { useChatBotData, KnowledgeEntry, NavCommand } from '../../contexts/ChatBotContext';
import { AdminTable, Column } from '../ui/AdminTable';
import PremiumButton from '../ui/PremiumButton';

const AdminChatbotManager: React.FC = () => {
  const { chatData, addKnowledgeEntry, deleteKnowledgeEntry, addNavCommand, deleteNavCommand, resetToDefaults } = useChatBotData();
  const [activeLang, setActiveLang] = useState('en');
  const [activeTab, setActiveTab] = useState<'knowledge' | 'navigation'>('knowledge');
  
  // Forms
  const [newKb, setNewKb] = useState({ keywords: '', answer: '' });
  const [newNav, setNewNav] = useState({ keywords: '', view: 'landing', resp: '' });

  const currentDataSet = chatData[activeLang] || { knowledgeBase: [], navCommands: [] };

  const handleAddKb = (e: React.MouseEvent) => {
    e.preventDefault();
    if(!newKb.keywords.trim() || !newKb.answer.trim()) return;
    
    addKnowledgeEntry(activeLang, {
        keywords: newKb.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
        answer: newKb.answer
    });
    setNewKb({ keywords: '', answer: '' });
  };

  const handleAddNav = (e: React.MouseEvent) => {
    e.preventDefault();
    if(!newNav.keywords.trim() || !newNav.view) return;
    
    addNavCommand(activeLang, {
        keywords: newNav.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
        view: newNav.view,
        resp: newNav.resp
    });
    setNewNav({ keywords: '', view: 'landing', resp: '' });
  };

  const kbColumns: Column<KnowledgeEntry>[] = [
    { key: 'keywords', label: 'Keywords', render: (val) => (val as string[]).join(', ') },
    { key: 'answer', label: 'Response', render: (val) => <span className="truncate block max-w-xs">{val}</span> },
  ];

  const navColumns: Column<NavCommand>[] = [
    { key: 'keywords', label: 'Keywords', render: (val) => (val as string[]).join(', ') },
    { key: 'view', label: 'Target View', render: (val) => <span className="font-mono text-xs bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">{val}</span> },
    { key: 'resp', label: 'Spoken Response', render: (val) => <span className="truncate block max-w-xs">{val}</span> },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
       
       {/* HEADER */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
          <div>
             <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="text-purple-600" /> Chatbot Manager
             </h2>
             <p className="text-sm text-gray-500">Train the AI with custom datasets and navigation rules.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-lg p-1">
                {['en', 'ta'].map(lang => (
                   <button 
                      key={lang} 
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${activeLang === lang ? 'bg-white dark:bg-gray-800 shadow text-purple-600' : 'text-gray-500'}`}
                   >
                      {lang}
                   </button>
                ))}
             </div>
             <button onClick={resetToDefaults} className="text-xs font-bold text-red-500 hover:underline">Reset Defaults</button>
          </div>
       </div>

       {/* TABS */}
       <div className="flex gap-2">
          <button 
             onClick={() => setActiveTab('knowledge')}
             className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'knowledge' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-white/5 text-gray-500'}`}
          >
             <Database size={16} /> Knowledge Base
          </button>
          <button 
             onClick={() => setActiveTab('navigation')}
             className={`px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeTab === 'navigation' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-white/5 text-gray-500'}`}
          >
             <Navigation size={16} /> Navigation Commands
          </button>
       </div>

       {/* CONTENT AREA */}
       <div className="flex-1 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-[2rem] shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-6 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
             {activeTab === 'knowledge' ? (
                <div className="flex gap-4 items-end">
                   <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Keywords (Comma Separated)</label>
                      <input 
                         type="text" 
                         className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500"
                         placeholder="e.g. pricing, cost, plans"
                         value={newKb.keywords}
                         onChange={e => setNewKb({...newKb, keywords: e.target.value})}
                      />
                   </div>
                   <div className="flex-[2] space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Bot Answer</label>
                      <input 
                         type="text" 
                         className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500"
                         placeholder="e.g. We have Gold and Platinum plans..."
                         value={newKb.answer}
                         onChange={e => setNewKb({...newKb, answer: e.target.value})}
                      />
                   </div>
                   <div className="h-full flex items-end">
                        <button 
                            type="button"
                            onClick={handleAddKb}
                            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2 h-[38px]"
                        >
                            <Plus size={16} /> Add Rule
                        </button>
                   </div>
                </div>
             ) : (
                <div className="flex gap-4 items-end">
                   <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Keywords</label>
                      <input 
                         type="text" 
                         className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500"
                         value={newNav.keywords}
                         onChange={e => setNewNav({...newNav, keywords: e.target.value})}
                      />
                   </div>
                   <div className="w-48 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Target View ID</label>
                      <select 
                         className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500"
                         value={newNav.view}
                         onChange={e => setNewNav({...newNav, view: e.target.value})}
                      >
                         <option value="landing">Home</option>
                         <option value="dashboard">Dashboard</option>
                         <option value="membership-public">Membership</option>
                         <option value="contact">Contact</option>
                         <option value="stories">Stories</option>
                         <option value="communities">Communities</option>
                      </select>
                   </div>
                   <div className="flex-[2] space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Confirmation Response</label>
                      <input 
                         type="text" 
                         className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-500"
                         value={newNav.resp}
                         onChange={e => setNewNav({...newNav, resp: e.target.value})}
                      />
                   </div>
                   <div className="h-full flex items-end">
                        <button 
                            type="button"
                            onClick={handleAddNav}
                            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-purple-700 transition-colors flex items-center gap-2 h-[38px]"
                        >
                            <Plus size={16} /> Add Nav
                        </button>
                   </div>
                </div>
             )}
          </div>

          <div className="flex-1 overflow-hidden">
             {activeTab === 'knowledge' ? (
                <AdminTable 
                   data={currentDataSet.knowledgeBase}
                   columns={kbColumns}
                   actions={(item) => (
                      <button onClick={() => deleteKnowledgeEntry(activeLang, item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                         <Trash2 size={16} />
                      </button>
                   )}
                />
             ) : (
                <AdminTable 
                   data={currentDataSet.navCommands}
                   columns={navColumns}
                   actions={(item) => (
                      <button onClick={() => deleteNavCommand(activeLang, item.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                         <Trash2 size={16} />
                      </button>
                   )}
                />
             )}
          </div>
       </div>
    </div>
  );
};

export default AdminChatbotManager;
