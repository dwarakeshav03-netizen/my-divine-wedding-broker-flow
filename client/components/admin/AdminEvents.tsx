import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Plus, Filter, Search, MoreHorizontal, X, Save, Trash2, Image as ImageIcon, Clock } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedTextArea, FileUpload, AnimatedSelect } from '../profile/ProfileFormElements';

interface AdminEvent {
  id: string;
  title: string;
  description: string;
  type: string;
  event_date: string; // Changed to match backend
  location: string;
  attendees: number;
  status: string;
  event_photo: string; // Changed to match Mani Sir's request
}

const AdminEvents: React.FC = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState<AdminEvent[]>([]);

  // Form State
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    time: '',
    type: 'In-Person',
    imageFile: null as File | null,
    imageUrl: ''
  });

  // Load events from your Real Backend API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('accessToken'); 
        const response = await fetch('http://localhost:5000/api/v1/events', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        if (result.success) {
          setEvents(result.data);
        }
      } catch (error) {
        console.error("Connection to backend failed:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setNewEvent(prev => ({ ...prev, imageFile: file, imageUrl: url }));
  };

  //  Fixed handleCreateEvent
  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.venue) {
        alert("Please fill in required fields.");
        return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const eventData = {
          title: newEvent.title,
          description: newEvent.description,
          location: newEvent.venue,
          event_date: `${newEvent.date} ${newEvent.time || '00:00'}:00`,
          event_photo: newEvent.imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop'
      };

      const response = await fetch('http://localhost:5000/api/v1/events', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(eventData)
      });
      
      const result = await response.json();

      if (result.success) {
          alert("Success! Event saved to MySQL Database.");
          setShowCreateModal(false);
          window.location.reload(); 
      } else {
          alert("Server error: " + result.message);
      }
    } catch (error) {
      alert("Could not connect to the backend server.");
    }
  };

  const handleDeleteEvent = (id: string) => {
      if(confirm('Are you sure you want to delete this event?')) {
          // In a real app, you'd call a DELETE API here
          const updatedEvents = events.filter(e => e.id !== id);
          setEvents(updatedEvents);
      }
  }

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center shrink-0">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Calendar className="text-orange-500" /> Event Management</h2>
        <div className="flex gap-2">
           <PremiumButton onClick={() => setShowCreateModal(true)} icon={<Plus size={16} />} className="!py-2 !px-4 !text-sm">Create Event</PremiumButton>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white dark:bg-[#121212] p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
         <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            <button onClick={() => setView('list')} className={`px-4 py-2 rounded-lg text-sm font-bold ${view === 'list' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-500'}`}>List View</button>
            <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-lg text-sm font-bold ${view === 'calendar' ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-500'}`}>Calendar</button>
         </div>
         <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
               type="text" 
               placeholder="Search events..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm outline-none"
            />
         </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
         {filteredEvents.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                 <Calendar size={48} className="opacity-20 mb-4" />
                 <p>No events found. Create one to get started.</p>
             </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                <div key={event.id} className="group bg-white dark:bg-[#121212] rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                    <div className="h-48 relative overflow-hidden">
                        <img src={event.event_photo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            {event.type || 'In-Person'}
                        </div>
                        <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-4">{event.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-8">{event.description || "No description provided."}</p>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar size={16} /> {new Date(event.event_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin size={16} /> {event.location}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 py-2 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors">Edit</button>
                            <button className="flex-1 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl text-xs font-bold hover:bg-purple-100 transition-colors">RSVPs ({event.attendees || 0})</button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
         )}
      </div>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-[#1a1a1a] p-8 rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2"><Plus className="text-purple-500" /> Create New Event</h3>
                        <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-dashed border-gray-300 dark:border-white/20 text-center">
                             {newEvent.imageUrl ? (
                                 <div className="relative h-40 w-full rounded-lg overflow-hidden group">
                                     <img src={newEvent.imageUrl} className="w-full h-full object-cover" />
                                     <button 
                                        onClick={() => setNewEvent({...newEvent, imageUrl: '', imageFile: null})}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                     >
                                         <X size={24} /> Remove
                                     </button>
                                 </div>
                             ) : (
                                <FileUpload label="Event Banner Image" accept="image/*" onFileSelect={handleImageUpload} />
                             )}
                        </div>

                        <AnimatedInput label="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <AnimatedSelect 
                                label="Event Type" 
                                value={newEvent.type} 
                                options={[{value:'In-Person', label:'In-Person'}, {value:'Virtual', label:'Virtual'}, {value:'Webinar', label:'Webinar'}]}
                                onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                            />
                             <AnimatedInput label="Date" type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <AnimatedInput label="Time" type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                             <AnimatedInput label="Venue / Link" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} icon={<MapPin size={18} />} />
                        </div>

                        <AnimatedTextArea label="Description" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Event details, agenda, etc..." />

                        <div className="pt-4 flex gap-3">
                            <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl">Cancel</button>
                            <PremiumButton onClick={handleCreateEvent} className="flex-1" icon={<Save size={18} />}>Publish Event</PremiumButton>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEvents;