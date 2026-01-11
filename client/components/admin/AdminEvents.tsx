import React, { useState, useEffect, useRef } from 'react';
import { Eye, Pencil, Plus, X, Shield, Calendar, MapPin, Search, Trash2, Clock, Video, User } from 'lucide-react';
import axios from 'axios';

const AdminEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
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

  
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get(`${API_BASE}/api/v1/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Events API Response:", response.data);

      if (response.data.success) {
       
        const data = response.data.data || response.data.events || [];
        setEvents(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Fetch Events Error:", error);
      setToast({ message: "Failed to load events. Check connection.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000); 
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const getImageUrl = (path: string | null | undefined) => {
  if (!path || path === "") return 'https://via.placeholder.com/600x400?text=No+Event+Banner';
  if (path.startsWith('http') || path.startsWith('blob')) return path;

  
  let cleanPath = path.replace(/\\/g, '/');

  if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);

  
  if (cleanPath.startsWith('uploads/')) {
    return `${API_BASE}/${cleanPath}`;
  } 
  
  return `${API_BASE}/uploads/${cleanPath}`;
};

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
      const token = localStorage.getItem('token');
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
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      
      const result = await response.json();
      if (result.success) {
        setToast({ message: "✨ Changes have been made!", type: 'success' });
        setTimeout(() => {
          closeModal();
          fetchEvents();
        }, 1000);
      } else {
        setToast({ message: "Error: " + result.message, type: 'error' });
      }
    } catch (err) {
      setToast({ message: "Error: Check backend connection.", type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this event?")) return;
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/api/v1/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setToast({ message: "Event deleted", type: 'success' });
          fetchEvents();
        }
    } catch (error) { console.error(error); }
  };

  const filteredEvents = events.filter((e: any) => 
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="p-8 bg-white dark:bg-[#080808] min-h-screen font-sans transition-all duration-500">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <Calendar className="text-purple-600 dark:text-orange-500" size={28} /> EVENT MANAGEMENT
            </h2>
            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Organize and manage community gatherings</p>
          </div>
          <button 
            onClick={() => openModal('CREATE')}
            className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-orange-500 dark:to-pink-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-200 dark:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18}/> Create New Event
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-sm outline-none focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-orange-500/10 bg-white dark:bg-white/5 font-bold text-gray-600 dark:text-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Content */}
        <div className="bg-white dark:bg-[#121212] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 dark:bg-white/5 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100 dark:border-white/5">
              <tr>
                <th className="p-8">Event Details</th>
                <th className="p-8">Type</th>
                <th className="p-8">Venue / Location</th>
                <th className="p-8">Date & Time</th>
                <th className="p-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {loading ? (
                 <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-300 dark:text-gray-600 font-bold animate-pulse uppercase tracking-widest">
                        Fetching events...
                    </td>
                 </tr>
              ) : filteredEvents.length === 0 ? (
                 <tr>
                    <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest">
                        No events found in database
                    </td>
                 </tr>
              ) : filteredEvents.map((event: any) => (
                <tr key={event.id} className="hover:bg-purple-50/10 dark:hover:bg-orange-500/5 transition-all duration-300 group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <img 
                        src={getImageUrl(event.event_photo)} 
                        className="w-16 h-16 rounded-2xl object-cover border-4 border-white dark:border-[#1a1a1a] shadow-md group-hover:scale-110 transition-transform duration-500" 
                        alt=""
                      />
                      <div>
                        <div className="font-black text-gray-800 dark:text-gray-100 text-base uppercase">{event.title}</div>
                        <div className="text-[10px] text-gray-300 dark:text-gray-500 font-mono uppercase tracking-tighter mt-0.5">ID: {event.id?.substring(0,8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                     <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">
                        {event.type === 'Virtual' ? <Video size={14} className="text-blue-300" /> : <User size={14} className="text-purple-300 dark:text-orange-300" />}
                        {event.type || 'In-Person'}
                     </div>
                  </td>
                  <td className="p-8 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">
                    <div className="flex items-center gap-2"><MapPin size={14} className="text-purple-300 dark:text-orange-300" /> {event.location}</div>
                  </td>
                  <td className="p-8 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar size={14} className="text-purple-400 dark:text-orange-400" /> 
                      {new Date(event.event_date).toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'})}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-700 dark:text-gray-400 font-bold tracking-widest uppercase">
                      <Clock size={12}/> {new Date(event.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openModal('VIEW', event)} className="p-3 text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all active:scale-90"><Eye size={20} /></button>
                      <button onClick={() => openModal('EDIT', event)} className="p-3 text-purple-400 dark:text-orange-400 hover:bg-purple-50 dark:hover:bg-orange-900/20 rounded-xl transition-all active:scale-90"><Pencil size={20} /></button>
                      <button onClick={() => handleDelete(event.id)} className="p-3 text-gray-300 hover:text-red-500 rounded-xl transition-all active:scale-90"><Trash2 size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Overlay */}
        {isModalOpen && (
          <div onClick={closeModal} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 dark:bg-black/80 backdrop-blur-sm p-4 cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-[#1a1a1a] rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 cursor-default">
              
              <header className="p-10 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-white dark:bg-[#1a1a1a]">
                <div>
                  <h2 className="text-2xl font-black text-gray-800 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                    {modalMode === 'CREATE' ? <Plus className="text-purple-600 dark:text-orange-500"/> : <Calendar className="text-purple-600 dark:text-orange-500"/>}
                    {modalMode === 'CREATE' ? 'New Event' : modalMode === 'EDIT' ? 'Edit Event' : 'Event Details'}
                  </h2>
                  <p className="text-[9px] font-bold text-purple-500 dark:text-orange-500 uppercase tracking-widest">Divine Admin Control Panel</p>
                </div>
                <button onClick={closeModal} className="group p-3 bg-gray-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-gray-400 hover:text-red-500 transition-all duration-200 active:scale-90 shadow-sm border border-transparent">
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </header>

              <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {/* Photo Upload Area */}
                <div onClick={() => modalMode !== 'VIEW' && fileInputRef.current?.click()}
                     className={`relative h-64 rounded-[2.5rem] flex flex-col items-center justify-center border-4 border-dashed transition-all overflow-hidden
                     ${previewUrl ? 'border-transparent' : 'border-purple-100 dark:border-orange-900/30 bg-purple-50/30 dark:bg-white/5'}
                     ${modalMode !== 'VIEW' ? 'cursor-pointer hover:border-purple-300 dark:hover:border-orange-500/50' : ''}`}>
                  <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                  {previewUrl ? (
                     <img src={getImageUrl(previewUrl)} className="w-full h-full object-cover shadow-2xl" alt="Event" />
                  ) : (
                    <>
                      <div className="bg-white dark:bg-black/40 p-4 rounded-full shadow-lg text-purple-600 dark:text-orange-500 mb-4"><Plus size={32}/></div>
                      <p className="text-sm font-black text-purple-600 dark:text-orange-500">Click to Upload Event Banner</p>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Title Field */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Event Title</label>
                    <input 
                      type="text" 
                      disabled={modalMode === 'VIEW'} 
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all disabled:opacity-50"
                      value={formData.title} 
                      onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    />
                  </div>

                  {/* Type and Location */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Type</label>
                      <select 
                        disabled={modalMode === 'VIEW'} 
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all disabled:opacity-50 appearance-none"
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
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all disabled:opacity-50"
                        value={formData.location} 
                        onChange={(e) => setFormData({...formData, location: e.target.value})} 
                      />
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Date</label>
                      <input 
                        type={modalMode === 'VIEW' ? 'text' : 'date'} 
                        disabled={modalMode === 'VIEW'} 
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all disabled:opacity-80"
                        value={modalMode === 'VIEW' ? new Date(formData.event_date).toLocaleDateString('en-GB') : formData.event_date} 
                        onChange={(e) => setFormData({...formData, event_date: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Time</label>
                      <input 
                        type="time" 
                        disabled={modalMode === 'VIEW'} 
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl font-bold text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all disabled:opacity-80"
                        value={formData.event_time} 
                        onChange={(e) => setFormData({...formData, event_time: e.target.value})} 
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Description</label>
                    <textarea 
                      rows={4} 
                      disabled={modalMode === 'VIEW'} 
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-[2rem] font-medium text-gray-700 dark:text-white outline-none border-2 border-transparent focus:border-purple-200 dark:focus:border-orange-500 transition-all resize-none disabled:opacity-50"
                      value={formData.description} 
                      onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <footer className="p-10 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex justify-end gap-6 items-center">
                <button onClick={closeModal} className="text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors">
                  {modalMode === 'VIEW' ? 'Close View' : 'Cancel'}
                </button>
                {modalMode !== 'VIEW' && (
                  <button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-orange-500 dark:to-pink-500 text-white px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 disabled:grayscale transition-all"
                  >
                    {isSaving ? 'Processing...' : 'Save Changes'}
                  </button>
                )}
              </footer>
            </div>
          </div>
        )}
      </div>

      {/* Custom Toast Notification */}
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-top duration-300">
          <div className={`px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border-2 bg-white dark:bg-[#1a1a1a] ${toast.type === 'success' ? 'border-green-400 text-green-600' : 'border-red-400 text-red-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
              {toast.type === 'success' ? '✅' : '❌'}
            </div>
            <p className="font-black text-xs uppercase tracking-widest">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-2 p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-gray-400">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminEvents;