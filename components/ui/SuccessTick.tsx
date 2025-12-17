
import React from 'react';
import { motion } from 'framer-motion';

export const SuccessTick: React.FC = () => (
  <div className="flex items-center gap-2 select-none">
    <div className="relative w-6 h-6 flex items-center justify-center">
      <motion.svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 52 52" 
        className="w-full h-full"
      >
        <motion.circle 
          cx="26" cy="26" r="25" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <motion.path 
          fill="none" 
          d="M14.1 27.2l7.1 7.2 16.7-16.8" 
          stroke="#10b981" 
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
        />
      </motion.svg>
    </div>
  </div>
);
