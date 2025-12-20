
import React from 'react';
import { motion } from 'framer-motion';

const WeddingLoader: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Rings Container */}
        <div className="relative w-48 h-32 mb-12">
           
           {/* Ring 1 (Left) */}
           <motion.div
              initial={{ x: -100, opacity: 0, rotate: -45 }}
              animate={{ x: -15, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-1/2 top-0 w-24 h-24 rounded-full border-[6px] border-gold-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
              style={{ x: '-50%' }} // Initial center offset
           >
              {/* Diamond */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-[0_0_15px_rgba(255,255,255,0.9)]" />
           </motion.div>

           {/* Ring 2 (Right) */}
           <motion.div
              initial={{ x: 100, opacity: 0, rotate: 45 }}
              animate={{ x: 15, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="absolute left-1/2 top-0 w-24 h-24 rounded-full border-[6px] border-gold-300 shadow-[0_0_20px_rgba(251,191,36,0.6)]"
              style={{ x: '-50%' }}
           />
           
           {/* Sparkle Burst at Intersection */}
           <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="absolute top-2 left-1/2 -translate-x-1/2 text-white text-4xl"
           >
              ✨
           </motion.div>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 1, duration: 0.8 }}
             className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-yellow-200 to-gold-400"
           >
              Creating Your Profile
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.5, duration: 0.8 }}
             className="text-purple-200 text-sm font-light tracking-wider uppercase"
           >
              Prepare for a Divine Connection...
           </motion.p>
        </div>

        {/* Loading Bar */}
        <motion.div 
           className="mt-8 w-64 h-1 bg-white/10 rounded-full overflow-hidden"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
        >
           <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-gold-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
           />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeddingLoader;
