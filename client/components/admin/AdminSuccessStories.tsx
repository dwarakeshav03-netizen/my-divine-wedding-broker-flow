import React, { useState, useEffect, useRef } from 'react';
import { Heart, Plus, Edit, MapPin, Calendar, ExternalLink, X, Trash2 } from 'lucide-react';

interface SuccessStory {
  id: string;
  couple_name: string; 
  location: string;
  wedding_date: string;
  story_photo: string; 
  quote: string;
  full_story: string;
}

const AdminSuccessStories: React.FC = () => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT' | 'CREATE'>('VIEW');
  const [selectedStory, setSelectedStory] = useState<Partial<SuccessStory>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = "http://localhost:5000";

  
  const formatDateForInput = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; 
    } catch (e) { return ''; }
  };

  const formatDisplayDate = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).toUpperCase();
  };

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (path.startsWith('http') || path.startsWith('blob')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    const separator = cleanPath.startsWith('/') ? '' : '/';
    return `${API_BASE}${separator}${cleanPath}`;
  };

  
  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/success-stories`);
      const result = await response.json();
      if (result.success) setStories(result.data);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  
  useEffect(() => { fetchStories(); }, []);

  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const openModal = (mode: 'VIEW' | 'EDIT' | 'CREATE', story: any = null) => {
    setModalMode(mode);
    if (story) {
      setSelectedStory({ ...story, wedding_date: formatDateForInput(story.wedding_date) });
      setPreviewUrl(story.story_photo);
    } else {
      setSelectedStory({ couple_name: '', location: '', wedding_date: '', quote: '', full_story: '' });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('couple_name', selectedStory.couple_name || '');
      formData.append('location', selectedStory.location || '');
      formData.append('wedding_date', selectedStory.wedding_date || '');
      formData.append('quote', selectedStory.quote || '');
      formData.append('full_story', selectedStory.full_story || '');
      
      if (selectedFile) formData.append('story_photo', selectedFile);

      const url = modalMode === 'CREATE' 
        ? `${API_BASE}/api/v1/success-stories` 
        : `${API_BASE}/api/v1/success-stories/${selectedStory.id}`;

      const response = await fetch(url, {
        method: modalMode === 'CREATE' ? 'POST' : 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        setToast({ message: "✨ Love Story Saved!", type: 'success' });
        setTimeout(() => { closeModal(); fetchStories(); }, 1000);
      }
    } catch (error) {
      setToast({ message: "Connection Error", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this story?")) return;
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/v1/success-stories/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) fetchStories();
    } catch (error) { console.error(error); }
  };

  return (
    <>
      <div className="p-8 bg-white dark:bg-[#080808] min-h-screen font-sans transition-colors duration-500">
        
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <Heart className="text-purple-600 dark:text-orange-500" fill="currentColor" size={28} /> SUCCESS STORIES
            </h2>
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Manage couples who found love on my divine wedding</p>
          </div>
          <button 
            onClick={() => openModal('CREATE')} 
            className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-orange-500 dark:to-pink-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={18}/> Add New Story
          </button>
        </div>

        
        <div className="bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="p-8">Couple Details</th>
                <th className="p-8">Location</th>
                <th className="p-8">Wedding Date</th>
                <th className="p-8">Quote Preview</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-8"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5" /><div className="space-y-2"><div className="h-4 w-32 bg-gray-100 dark:bg-white/5 rounded" /><div className="h-2 w-16 bg-gray-100 dark:bg-white/5 rounded" /></div></div></td>
                    <td className="p-8"><div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded" /></td>
                    <td className="p-8"><div className="h-4 w-24 bg-gray-100 dark:bg-white/5 rounded" /></td>
                    <td className="p-8"><div className="h-3 w-40 bg-gray-100 dark:bg-white/5 rounded" /></td>
                    <td className="p-8"><div className="h-8 w-20 bg-gray-100 dark:bg-white/5 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : stories.map((story) => (
                <tr key={story.id} className="hover:bg-purple-50/10 dark:hover:bg-orange-500/5 transition-all group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={getImageUrl(story.story_photo)} 
                          loading="lazy"
                          className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-[#1a1a1a] shadow-md group-hover:scale-110 transition-transform duration-500" 
                          alt=""
                        />
                        <div className="absolute -bottom-1 -right-1 bg-purple-500 dark:bg-orange-500 p-1 rounded-full border-2 border-white dark:border-[#1a1a1a]"><Heart size={8} className="text-white" fill="currentColor"/></div>
                      </div>
                      <div>
                        <div className="font-black text-gray-800 dark:text-gray-100 text-base">{story.couple_name}</div>
                        <div className="text-[10px] text-gray-300 dark:text-gray-500 font-bold uppercase tracking-widest">ID: {story.id?.substring(0,8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">
                    <span className="text-purple-400 dark:text-orange-400 mr-2">📍</span>{story.location}
                  </td>
                  <td className="p-8 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">
                    <span className="text-purple-400 dark:text-orange-400 mr-2">🗓️</span>{formatDisplayDate(story.wedding_date)}
                  </td>
                  <td className="p-8 text-sm italic text-gray-400 dark:text-gray-500 font-medium truncate max-w-[200px]">"{story.quote}"</td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal('VIEW', story)} className="p-3 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"><ExternalLink size={20}/></button>
                      <button onClick={() => openModal('EDIT', story)} className="p-3 text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl transition-all"><Edit size={20}/></button>
                      <button onClick={() => handleDelete(story.id)} className="p-3 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={20}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        {isModalOpen && (
          <div onClick={closeModal} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 dark:bg-black/80 backdrop-blur-sm p-4 cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl bg-white dark:bg-[#1a1a1a] rounded-[3rem] shadow-2xl overflow-hidden cursor-default animate-in zoom-in duration-300">
              
              <div className="p-10 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#1a1a1a]">
                 <div>
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">
                      {modalMode === 'CREATE' ? '🚀 New Love Story' : modalMode === 'EDIT' ? '🖊️ Edit Story' : '📖 Viewing Story'}
                    </h2>
                    <p className="text-[9px] font-bold text-purple-500 dark:text-orange-500 uppercase tracking-widest">Divine Admin Control Panel</p>
                 </div>
                 <button onClick={closeModal} className="group p-3 bg-gray-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-gray-400 hover:text-red-500 transition-all">
                   <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                 </button>
              </div>

              <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                <div onClick={() => modalMode !== 'VIEW' && fileInputRef.current?.click()} 
                     className={`relative h-64 rounded-[2.5rem] flex flex-col items-center justify-center border-4 border-dashed transition-all overflow-hidden
                     ${previewUrl ? 'border-transparent' : 'border-purple-100 dark:border-orange-900/30 bg-purple-50/30 dark:bg-white/5'}
                     ${modalMode !== 'VIEW' ? 'cursor-pointer hover:border-purple-300 dark:hover:border-orange-500' : ''}`}>
                  {previewUrl ? (
                    <img src={getImageUrl(previewUrl)} className="w-full h-full object-cover shadow-2xl" alt=""/>
                  ) : (
                    <>
                      <div className="bg-white dark:bg-black/40 p-4 rounded-full shadow-lg text-purple-500 dark:text-orange-500 mb-4"><Plus size={32}/></div>
                      <p className="text-sm font-black text-purple-600 dark:text-orange-500">Click to Upload Photo</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Couple Names</label>
                    <input className="w-full p-5 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all disabled:opacity-50"
                           value={selectedStory?.couple_name} disabled={modalMode==='VIEW'} onChange={e=>setSelectedStory({...selectedStory, couple_name: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Wedding Location</label>
                    <input className="w-full p-5 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all disabled:opacity-50"
                           value={selectedStory?.location} disabled={modalMode==='VIEW'} onChange={e=>setSelectedStory({...selectedStory, location: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Wedding Date</label>
                    <input 
                      type={modalMode === 'VIEW' ? "text" : "date"}
                      className="w-full p-5 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all disabled:opacity-80"
                      value={modalMode === 'VIEW' ? formatDisplayDate(selectedStory?.wedding_date) : selectedStory?.wedding_date} 
                      disabled={modalMode==='VIEW'} 
                      onChange={e=>setSelectedStory({...selectedStory, wedding_date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Main Quote</label>
                    <input className="w-full p-5 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold text-gray-700 dark:text-white italic outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all disabled:opacity-50"
                           value={selectedStory?.quote} disabled={modalMode==='VIEW'} onChange={e=>setSelectedStory({...selectedStory, quote: e.target.value})}/>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">The Full Story</label>
                  <textarea rows={4} className="w-full p-5 bg-gray-50 dark:bg-white/5 rounded-3xl font-medium text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all resize-none disabled:opacity-50"
                          value={selectedStory?.full_story} disabled={modalMode==='VIEW'} onChange={e=>setSelectedStory({...selectedStory, full_story: e.target.value})}/>
                </div>
              </div>

              <div className="p-10 bg-gray-50/50 dark:bg-white/[0.02] flex justify-end gap-6 items-center border-t border-gray-100 dark:border-white/5">
                <button onClick={closeModal} className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors">
                  {modalMode === 'VIEW' ? 'CLOSE VIEW' : 'CANCEL'}
                </button>
                {modalMode !== 'VIEW' && (
                  <button onClick={handleFormSubmit} disabled={isSaving} className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-orange-500 dark:to-pink-500 text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all disabled:grayscale">
                    {isSaving ? 'Saving...' : modalMode === 'CREATE' ? 'PUBLISH STORY' : 'SAVE CHANGES'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

     
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top duration-300">
          <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 bg-white dark:bg-[#1a1a1a] backdrop-blur-md ${toast.type === 'success' ? 'border-green-400 text-green-600' : 'border-red-400 text-red-600'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toast.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              {toast.type === 'success' ? '✅' : '❌'}
            </div>
            <p className="font-black text-xs uppercase tracking-widest">{toast.message}</p>
            <button 
              onClick={() => setToast(null)} 
              className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSuccessStories;