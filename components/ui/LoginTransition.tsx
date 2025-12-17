
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Gem } from 'lucide-react';

interface LoginTransitionProps {
  onComplete: () => void;
}

const LoginTransition: React.FC<LoginTransitionProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'intro' | 'unite' | 'celebrate'>('intro');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('unite'), 1000);
    const timer2 = setTimeout(() => setStage('celebrate'), 2500);
    const timer3 = setTimeout(onComplete, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Flower Petal Particles
  const petals = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    color: Math.random() > 0.5 ? '#F472B6' : '#FBBF24', // Pink or Gold
  }));

  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#0f0518]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      {/* Background Gradient & Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-[#1a0b2e] to-black opacity-90" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      
      {/* Falling Petals */}
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute top-[-10%]"
          style={{ left: `${petal.x}%`, width: '10px', height: '10px', backgroundColor: petal.color, borderRadius: '50% 0 50% 0' }}
          animate={{ 
            y: '110vh', 
            rotate: 360,
            x: [0, Math.random() * 50 - 25, 0] 
          }}
          transition={{ 
            duration: petal.duration, 
            repeat: Infinity, 
            delay: petal.delay,
            ease: "linear"
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        
        {/* ANIMATED RINGS CONTAINER */}
        <div className="relative w-64 h-48 mb-8 flex items-center justify-center">
          
          {/* Ring 1 (Gold) */}
          <motion.div
            initial={{ x: -100, opacity: 0, rotate: -45 }}
            animate={
              stage === 'intro' ? { x: -40, opacity: 1, rotate: -20 } :
              stage === 'unite' ? { x: -15, rotate: 0, scale: 1.1 } :
              { x: -15, rotate: 0, scale: 1, filter: "drop-shadow(0 0 20px rgba(251,191,36,0.5))" }
            }
            transition={{ duration: 1.5, type: "spring", bounce: 0.4 }}
            className="absolute w-32 h-32 rounded-full border-[6px] border-gold-400 z-10"
            style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)' }}
          >
             {/* Gemstone */}
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-[0_0_15px_rgba(255,255,255,0.9)]" />
          </motion.div>

          {/* Ring 2 (Platinum/Silver) */}
          <motion.div
            initial={{ x: 100, opacity: 0, rotate: 45 }}
            animate={
              stage === 'intro' ? { x: 40, opacity: 1, rotate: 20 } :
              stage === 'unite' ? { x: 15, rotate: 0, scale: 1.1 } :
              { x: 15, rotate: 0, scale: 1, filter: "drop-shadow(0 0 20px rgba(168,85,247,0.5))" }
            }
            transition={{ duration: 1.5, type: "spring", bounce: 0.4, delay: 0.2 }}
            className="absolute w-32 h-32 rounded-full border-[6px] border-purple-300 z-0"
            style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.3)' }}
          />
          
          {/* Burst Effect on Unite */}
          <AnimatePresence>
            {stage === 'celebrate' && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute text-white z-20"
              >
                <Sparkles size={64} className="text-gold-200 animate-spin-slow" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heart Popup */}
          <AnimatePresence>
             {stage === 'celebrate' && (
                <motion.div
                   initial={{ scale: 0, y: 20 }}
                   animate={{ scale: 1, y: -40 }}
                   transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                   className="absolute z-30"
                >
                   <Heart size={48} className="fill-red-500 text-red-600 drop-shadow-2xl" />
                </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* Text Animations */}
        <div className="text-center h-24 relative overflow-hidden w-full max-w-md px-4">
           <AnimatePresence mode="wait">
              {stage === 'intro' && (
                 <motion.div
                    key="text1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center"
                 >
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Authenticating</h2>
                    <p className="text-purple-200 text-sm">Verifying your credentials...</p>
                 </motion.div>
              )}
              {stage === 'unite' && (
                 <motion.div
                    key="text2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center"
                 >
                    <h2 className="text-3xl font-display font-bold text-gold-400 mb-2">Perfect Match</h2>
                    <p className="text-white/80 text-sm">Preparing your dashboard...</p>
                 </motion.div>
              )}
              {stage === 'celebrate' && (
                 <motion.div
                    key="text3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center"
                 >
                    <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-white to-gold-300 mb-2 drop-shadow-sm">
                       Welcome Back
                    </h2>
                    <p className="text-purple-200 text-sm tracking-widest uppercase">Your journey continues</p>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};

export default LoginTransition;
