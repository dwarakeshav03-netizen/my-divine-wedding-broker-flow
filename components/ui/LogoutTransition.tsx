
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, ShieldCheck } from 'lucide-react';

interface LogoutTransitionProps {
  onComplete: () => void;
}

const LogoutTransition: React.FC<LogoutTransitionProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'secure' | 'fade'>('secure');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('fade'), 2000);
    const timer2 = setTimeout(onComplete, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0f0518]/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-md p-8">
        
        {/* Animated Icon Container */}
        <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
           
           {/* Rotating Outer Glow */}
           <motion.div 
             className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 to-pink-600/30 blur-2xl"
             animate={{ rotate: 360, scale: [1, 1.2, 1] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           />

           {/* Pulse Ring */}
           <motion.div 
             className="absolute inset-4 rounded-full border border-white/10"
             animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
           />

           <AnimatePresence mode="wait">
              {stage === 'secure' && (
                 <motion.div
                    key="lock-anim"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                 >
                    <div className="relative">
                       <Heart size={80} className="fill-purple-900 text-purple-500" strokeWidth={1.5} />
                       <motion.div 
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="absolute inset-0 flex items-center justify-center"
                       >
                          <Lock size={32} className="text-white fill-white/20" />
                       </motion.div>
                    </div>
                 </motion.div>
              )}

              {stage === 'fade' && (
                 <motion.div
                    key="bye-anim"
                    initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                    animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                    className="relative z-10"
                 >
                    <div className="text-center">
                       <ShieldCheck size={64} className="text-green-500 mx-auto mb-2" />
                       <span className="text-xs text-green-400 font-bold uppercase tracking-wider">Session Secured</span>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

        {/* Text Transition */}
        <div className="h-16 relative w-full text-center">
           <AnimatePresence mode="wait">
              {stage === 'secure' ? (
                 <motion.div
                    key="txt1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                 >
                    <h3 className="text-2xl font-display font-bold text-white mb-2">Securing Data</h3>
                    <p className="text-purple-300 text-sm">Saving your preferences safely...</p>
                 </motion.div>
              ) : (
                 <motion.div
                    key="txt2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                 >
                    <h3 className="text-2xl font-display font-bold text-white mb-2">Until Next Time</h3>
                    <p className="text-gray-400 text-sm">Thank you for visiting Divine Connections.</p>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
};

export default LogoutTransition;
