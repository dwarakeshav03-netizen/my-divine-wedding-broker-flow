import React, { useState, useEffect, useRef } from 'react';
import { Eye, Pencil, Plus, X, Upload, CheckCircle, Calendar, MapPin, Search, Trash2, Clock, Heart, Video, User } from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'VIEW' | 'EDIT' | 'CREATE'>('VIEW');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    event_time: '',
    type: 'In-Person',
    event_photo: ''
  });

  const API_BASE = "http://localhost:5000";

  
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [toast]);

  
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Event+Banner';
    if (path.startsWith('http') || path.startsWith('blob')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/v1/events`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const result = await response.json();
      if (result.success) setEvents(result.data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const openModal = (mode: 'VIEW' | 'EDIT' | 'CREATE', event: any = null) => {
    setModalMode(mode);
    if (event) {
      setSelectedEvent(event);
      const dt = new Date(event.event_date);
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      
      setFormData({
        ...event,
        event_date: `${year}-${month}-${day}`,
        event_time: dt.toTimeString().split(' ')[0].substring(0, 5)
      });
      setPreviewUrl(event.event_photo);
    } else {
      setFormData({ title: '', description: '', location: '', event_date: '', event_time: '', type: 'In-Person', event_photo: '' });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('event_date', `${formData.event_date} ${formData.event_time}:00`);
      data.append('type', formData.type);
      
      if (selectedFile) data.append('event_photo', selectedFile);

      const url = modalMode === 'CREATE' ? `${API_BASE}/api/v1/events` : `${API_BASE}/api/v1/events/${selectedEvent.id}`;
      const method = modalMode === 'CREATE' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
        body: data
      });
      
      const result = await response.json();
      if (result.success) {
        
        setToast({ message: "✨ Changes have been made!", type: 'success' });
        setTimeout(() => {
          closeModal();
          fetchEvents();
        }, 1500);
      } else {
        setToast({ message: " Error: " + result.message, type: 'error' });
      }
    } catch (err) {
      setToast({ message: " Error: Check backend connection.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanent delete this event?")) return;
    try {
        const response = await fetch(`${API_BASE}/api/v1/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        if (response.ok) fetchEvents();
    } catch (error) { console.error(error); }
  };

  const filteredEvents = events.filter((e: any) => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-8 bg-white min-h-screen font-sans">
        
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-3">
              <Calendar className="text-purple-600" size={28} /> EVENT MANAGEMENT
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Organize and manage community gatherings</p>
          </div>
          <button 
            onClick={() => openModal('CREATE')}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18}/> Create New Event
          </button>
        </div>

        
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border border-gray-100 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 bg-white font-bold text-gray-600 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

       
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100">
              <tr>
                <th className="p-8">Event Details</th>
                <th className="p-8">Type</th>
                <th className="p-8">Venue / Location</th>
                <th className="p-8">Date & Time</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                 <tr><td colSpan={5} className="p-20 text-center text-gray-300 font-bold animate-pulse uppercase tracking-widest">Fetching events...</td></tr>
              ) : filteredEvents.map((event: any) => (
                <tr key={event.id} className="hover:bg-purple-50/10 transition-all duration-300 group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <img 
                        src={getImageUrl(event.event_photo)} 
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-md group-hover:scale-110 transition-transform duration-500" 
                        alt=""
                      />
                      <div>
                        <div className="font-black text-gray-800 text-base uppercase">{event.title}</div>
                        <div className="text-[10px] text-gray-300 font-mono uppercase tracking-tighter mt-0.5">ID: {event.id.substring(0,8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                     
                     <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase whitespace-nowrap">
                        {event.type === 'Virtual' ? <Video size={14} className="text-blue-300" /> : <User size={14} className="text-pink-300" />}
                        {event.type || 'In-Person'}
                     </div>
                  </td>
                  <td className="p-8 text-sm font-bold text-gray-500 uppercase">
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-purple-300" /> {event.location}</div>
                  </td>
                  <td className="p-8 text-sm font-bold text-gray-500 uppercase">
                    <div className="flex items-center gap-2 text-gray-700"><Calendar size={14} className="text-purple-400" /> {new Date(event.event_date).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'})}</div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-700 font-bold tracking-widest uppercase"><Clock size={12}/> {new Date(event.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openModal('VIEW', event)} className="p-3 text-blue-400 hover:bg-blue-50 rounded-xl transition-all active:scale-90"><Eye size={20} /></button>
                      <button onClick={() => openModal('EDIT', event)} className="p-3 text-orange-400 hover:bg-orange-50 rounded-xl transition-all active:scale-90"><Pencil size={20} /></button>
                      <button onClick={() => handleDelete(event.id)} className="p-3 text-gray-300 hover:text-red-500 rounded-xl transition-all active:scale-90"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MODAL WINDOW --- */}
        {isModalOpen && (
          <div 
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 cursor-pointer"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 cursor-default"
            >
              <header className="p-10 border-b border-gray-50 flex justify-between items-center bg-white">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-3">
                    {modalMode === 'CREATE' ? <Plus className="text-purple-600"/> : <Calendar className="text-purple-600"/>}
                    {modalMode === 'CREATE' ? 'New Event' : modalMode === 'EDIT' ? 'Edit Event' : 'Event Details'}
                  </h2>
                  <p className="text-[9px] font-bold text-pink-500 uppercase tracking-widest">Divine Admin Control Panel</p>
                </div>
                
                <button 
                  onClick={closeModal} 
                  className="group p-3 bg-gray-50 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-all duration-200 active:scale-90 shadow-sm"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </header>

              <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div 
                  onClick={() => modalMode !== 'VIEW' && fileInputRef.current?.click()}
                  className={`relative h-64 rounded-[2.5rem] flex flex-col items-center justify-center border-4 border-dashed transition-all overflow-hidden
                  ${previewUrl ? 'border-transparent' : 'border-purple-100 bg-purple-50/30'}
                  ${modalMode !== 'VIEW' ? 'cursor-pointer hover:border-purple-300' : ''}`}
                >
                  <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                  
                  {previewUrl ? (
                     <img src={getImageUrl(previewUrl)} className="w-full h-full object-cover shadow-2xl" alt="Event" />
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-full shadow-lg text-purple-600 mb-4"><Plus size={32}/></div>
                      <p className="text-sm font-black text-purple-600">Click to Upload Event Banner</p>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Event Title</label>
                    <input 
                      type="text" 
                      disabled={modalMode === 'VIEW'}
                      className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-2 border-transparent focus:border-purple-200 transition-all disabled:opacity-50"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Type</label>
                      <select 
                        disabled={modalMode === 'VIEW'}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-2 border-transparent focus:border-purple-200 transition-all disabled:opacity-50"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="In-Person">In-Person</option>
                        <option value="Virtual">Virtual</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Venue / Link</label>
                      <input 
                        type="text" 
                        disabled={modalMode === 'VIEW'}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-2 border-transparent focus:border-purple-200 transition-all disabled:opacity-50"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Date</label>
                      <input 
                        type={modalMode === 'VIEW' ? 'text' : 'date'} 
                        disabled={modalMode === 'VIEW'}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-2 border-transparent focus:border-purple-200 transition-all disabled:opacity-80"
                        value={modalMode === 'VIEW' ? new Date(formData.event_date).toLocaleDateString('en-GB') : formData.event_date}
                        onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Time</label>
                      <input 
                        type="time" 
                        disabled={modalMode === 'VIEW'}
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl font-bold text-gray-700 outline-none border-2 border-transparent focus:border-purple-200 transition-all disabled:opacity-80"
                        value={formData.event_time}
                        onChange={(e) => setFormData({...formData, event_time: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Description</label>
                    <textarea 
                      rows={4}
                      disabled={modalMode === 'VIEW'}
                      className="w-full px-6 py-4 bg-gray-50 rounded-[2rem] font-medium text-gray-700 outline-none border-2 border-transparent focus:border-purple-200 transition-all resize-none disabled:opacity-50"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <footer className="p-10 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-6 items-center">
                <button 
                  onClick={closeModal} 
                  className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors active:scale-95"
                >
                  {modalMode === 'VIEW' ? 'Close View' : 'Cancel'}
                </button>
                {modalMode !== 'VIEW' && (
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 disabled:bg-gray-300 transition-all"
                  >
                    {isSaving ? 'Processing...' : 'Save Changes'}
                  </button>
                )}
              </footer>
            </div>
          </div>
        )}
      </div>

      
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top duration-300">
          <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 bg-white ${toast.type === 'success' ? 'border-green-400 text-green-600' : 'border-red-400 text-red-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {toast.type === 'success' ? '✅' : '❌'}
            </div>
            <p className="font-black text-xs uppercase tracking-widest">{toast.message}</p>
            
            <button 
              onClick={() => setToast(null)} 
              className="ml-2 p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all active:scale-90"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEvents;