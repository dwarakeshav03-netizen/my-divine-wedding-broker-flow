import React, { useState, useEffect } from 'react';
import { Heart, Plus, Edit, MapPin, Calendar, ExternalLink, X, Camera, Save, Trash2 } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';


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

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/success-stories');
      const result = await response.json();
      if (result.success) {
        setStories(result.data);
      }
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchStories(); 
  }, []);

 
  const handleView = (story: SuccessStory) => {
    setSelectedStory(story);
    setModalMode('VIEW');
    setIsModalOpen(true);
  };

  const handleEdit = (story: SuccessStory) => {
    setSelectedStory(story);
    setModalMode('EDIT');
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedStory({
        couple_name: '',
        location: '',
        wedding_date: '',
        story_photo: '',
        quote: '',
        full_story: ''
    });
    setModalMode('CREATE');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async () => {
    alert(`${modalMode} logic would be called here for ${selectedStory.couple_name}`);
    setIsModalOpen(false);
    fetchStories(); 
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 tracking-tight uppercase">
            <Heart className="text-pink-500" fill="currentColor" /> Success Stories
          </h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Manage couples who found love on My Divine Wedding</p>
        </div>
        <PremiumButton onClick={handleAddNew} icon={<Plus size={16} />}>
          Add New Story
        </PremiumButton>
      </div>

      {/* --- Main Table --- */}
      <div className="bg-white dark:bg-[#121212] rounded-3xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-white/5 text-gray-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="p-5">Couple Details</th>
              <th className="p-5">Location</th>
              <th className="p-5">Wedding Date</th>
              <th className="p-5">Quote Preview</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold italic">Loading stories from database...</td></tr>
            ) : stories.length === 0 ? (
              <tr><td colSpan={5} className="p-20 text-center text-gray-400 font-bold italic">No stories found. Add your first couple!</td></tr>
            ) : (
              stories.map((story) => (
                <tr key={story.id} className="hover:bg-pink-50/30 dark:hover:bg-pink-900/5 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img 
                        src={story.story_photo || 'https://via.placeholder.com/150'} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" 
                        alt={story.couple_name}
                      />
                      <div>
                        <div className="font-bold text-sm text-gray-900 dark:text-white">{story.couple_name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">ID: {story.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-pink-400" />
                      {story.location}
                    </div>
                  </td>
                  <td className="p-5 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-pink-400" />
                      {story.wedding_date}
                    </div>
                  </td>
                  <td className="p-5 text-sm text-gray-400 italic max-w-xs truncate">
                    "{story.quote}"
                  </td>
                  
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                        <button onClick={() => handleView(story)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><ExternalLink size={18} /></button>
                        <button onClick={() => handleEdit(story)} className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl transition-all"><Edit size={18} /></button>
                        <button className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---ADD NEW STORY MODAL--- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#181818] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b dark:border-white/5">
              <div>
                <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter">
                  {modalMode === 'CREATE' ? '🚀 New Love Story' : modalMode === 'EDIT' ? '✏️ Edit Story' : '📖 Viewing Story'}
                </h2>
                <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-1">Divine Admin Control Panel</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              {/* Photo Upload Area */}
              <div className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all 
                ${modalMode === 'VIEW' ? 'bg-gray-50 dark:bg-white/5 border-gray-100' : 'bg-pink-50/50 border-pink-100 hover:border-pink-500 cursor-pointer'}`}>
                {selectedStory?.story_photo ? (
                  <div className="relative group inline-block">
                    <img src={selectedStory.story_photo} className="h-40 w-auto rounded-2xl shadow-xl border-4 border-white" alt="Preview" />
                    {modalMode !== 'VIEW' && <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><Camera className="text-white" /></div>}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto text-pink-600"><Plus size={24}/></div>
                    <p className="text-sm font-bold text-pink-600">Click or Drag to Upload Photo</p>
                    <p className="text-[10px] text-gray-400 uppercase">SVG, PNG, JPG (Max 10MB)</p>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Couple Names</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-medium"
                    placeholder="e.g. Prem & Anjali"
                    disabled={modalMode === 'VIEW'}
                    value={selectedStory?.couple_name}
                    onChange={(e) => setSelectedStory({...selectedStory, couple_name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wedding Location</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-medium"
                    placeholder="e.g. Delhi, India"
                    disabled={modalMode === 'VIEW'}
                    value={selectedStory?.location}
                    onChange={(e) => setSelectedStory({...selectedStory, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wedding Date</label>
                    <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl font-medium"
                    disabled={modalMode === 'VIEW'}
                    value={selectedStory?.wedding_date}
                    onChange={(e) => setSelectedStory({...selectedStory, wedding_date: e.target.value})}
                    />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Quote</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-medium italic"
                    placeholder="A short punchy line..."
                    disabled={modalMode === 'VIEW'}
                    value={selectedStory?.quote}
                    onChange={(e) => setSelectedStory({...selectedStory, quote: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">The Complete Story</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-medium resize-none"
                  placeholder="Tell us about their journey..."
                  disabled={modalMode === 'VIEW'}
                  value={selectedStory?.full_story}
                  onChange={(e) => setSelectedStory({...selectedStory, full_story: e.target.value})}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50 dark:bg-white/5 flex justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 text-xs font-black text-gray-500 uppercase tracking-widest hover:text-gray-800 transition-colors"
              >
                {modalMode === 'VIEW' ? 'Close' : 'Cancel'}
              </button>
              {modalMode !== 'VIEW' && (
                <button 
                  onClick={handleFormSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-pink-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-pink-500/30 transition-all flex items-center gap-2"
                >
                  <Save size={16}/> {modalMode === 'CREATE' ? 'Publish Story' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSuccessStories;