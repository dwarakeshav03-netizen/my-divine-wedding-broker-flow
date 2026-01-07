import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Heart, Calendar, MapPin, Loader2 } from 'lucide-react';
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

interface SuccessStoriesPageProps {
  onLogin: () => void;
}

const SuccessStoriesPage: React.FC<SuccessStoriesPageProps> = ({ onLogin }) => {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:5000";

  
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070';
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  
  const formatDisplayDate = (dateStr: string) => {
    try {
      return "Married " + new Date(dateStr).toLocaleDateString('en-GB', {
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  
  useEffect(() => {
    const fetchPublicStories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/v1/success-stories`);
        const result = await response.json();
        if (result.success) {
          setStories(result.data);
        }
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicStories();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      
      <div className="text-center mb-16 space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Heart size={32} className="fill-pink-600" />
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white">
          Happily <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Ever After</span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Read the inspiring stories of couples who found their soulmates on Divine Matrimony.
        </p>
      </div>

      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-pink-500" size={48} />
          <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Connecting to database...</p>
        </div>
      ) : (
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 dark:border-white/10 hover:shadow-2xl transition-all duration-500"
            >
              
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={getImageUrl(story.story_photo)} 
                  alt={story.couple_name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-display font-bold">{story.couple_name}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium opacity-90 mt-1 uppercase tracking-wider">
                    <MapPin size={12} className="text-pink-400" /> {story.location}
                  </div>
                </div>
              </div>

              
              <div className="p-8">
                <Quote className="text-pink-500 mb-4 opacity-50" size={32} />
                <p className="text-gray-600 dark:text-gray-300 italic mb-6 leading-relaxed">
                  "{story.quote}"
                </p>
                
                <div className="pt-6 border-t border-gray-100 dark:border-white/10">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3">
                    {story.full_story}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[10px] font-black text-purple-600 dark:text-pink-400 bg-purple-50 dark:bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest">
                      <Calendar size={12} /> {formatDisplayDate(story.wedding_date)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      
      {!loading && stories.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[3rem]">
          <p className="text-gray-400 font-bold uppercase tracking-widest">No stories found in the database.</p>
        </div>
      )}

      
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Your story could be next</h2>
        <PremiumButton onClick={onLogin} variant="gradient" className="!px-10 !py-4 text-lg font-black uppercase tracking-widest">
          Create Your Profile Today
        </PremiumButton>
      </div>

    </div>
  );
};

export default SuccessStoriesPage;