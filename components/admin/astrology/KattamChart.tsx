
import React from 'react';
import { motion } from 'framer-motion';

// Mapping linear index to grid area string for CSS Grid
// 1  2  3  4
// 5        6
// 7        8
// 9 10 11 12
// Top Row: Meena, Mesha, Rishaba, Mithuna
// Right Col (down): Kataka, Simha
// Bottom Row (right to left): Kanni, Thula, Vrischika, Dhanusu
// Left Col (up): Makara, Kumbha

interface KattamChartProps {
  rasi?: string; // Highlight Rasi
  title?: string;
}

const GRID_MAP = [
   { rasi: 'Meena', label: 'Pisces', pos: 'col-start-1 row-start-1', corner: 'tl' },
   { rasi: 'Mesha', label: 'Aries', pos: 'col-start-2 row-start-1' },
   { rasi: 'Rishaba', label: 'Taurus', pos: 'col-start-3 row-start-1' },
   { rasi: 'Mithuna', label: 'Gemini', pos: 'col-start-4 row-start-1', corner: 'tr' },
   
   { rasi: 'Kumbha', label: 'Aquarius', pos: 'col-start-1 row-start-2' },
   { rasi: 'Kataka', label: 'Cancer', pos: 'col-start-4 row-start-2' },
   
   { rasi: 'Makara', label: 'Capricorn', pos: 'col-start-1 row-start-3' },
   { rasi: 'Simha', label: 'Leo', pos: 'col-start-4 row-start-3' },
   
   { rasi: 'Dhanusu', label: 'Sagittarius', pos: 'col-start-1 row-start-4', corner: 'bl' },
   { rasi: 'Vrishchika', label: 'Scorpio', pos: 'col-start-2 row-start-4' },
   { rasi: 'Thula', label: 'Libra', pos: 'col-start-3 row-start-4' },
   { rasi: 'Kanya', label: 'Virgo', pos: 'col-start-4 row-start-4', corner: 'br' }, 
];

const KattamChart: React.FC<KattamChartProps> = ({ rasi, title }) => {
  return (
    <div className="bg-[#292524]/50 p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
       {/* Decorative Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

       {title && (
          <div className="text-center mb-6 relative z-10">
             <h4 className="text-amber-500 font-bold uppercase tracking-[0.3em] text-[10px]">{title}</h4>
             <div className="w-8 h-0.5 bg-amber-500/30 mx-auto mt-2 rounded-full" />
          </div>
       )}
       
       <div className="relative max-w-[320px] mx-auto aspect-square p-1 bg-gradient-to-br from-amber-700/50 via-amber-900/50 to-amber-950/50 rounded-lg shadow-inner">
          <div className="grid grid-cols-4 grid-rows-4 gap-0.5 bg-amber-900/30 h-full w-full border-2 border-amber-800/50 rounded shadow-2xl">
              
              {/* Center Info Box (Merged Cells) */}
              <div className="col-start-2 col-span-2 row-start-2 row-span-2 bg-[#1c1917] flex flex-col items-center justify-center p-2 text-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-5" />
                 <span className="text-[9px] text-stone-500 font-bold uppercase tracking-widest relative z-10">Rasi Chakra</span>
                 
                 <div className="mt-3 relative z-10">
                    <span className="text-3xl text-amber-500">🕉️</span>
                 </div>
                 
                 <div className="mt-3 px-3 py-1 bg-amber-900/20 rounded border border-amber-500/10 relative z-10">
                    <span className="text-xs font-serif font-bold text-amber-100">{rasi || 'Select'}</span>
                 </div>
              </div>

              {/* Rasi Boxes */}
              {GRID_MAP.map((box) => {
                 const isHighlighted = rasi?.toLowerCase().includes(box.rasi.toLowerCase());
                 
                 // Corner radius logic for outer styling
                 let roundedClass = '';
                 if (box.corner === 'tl') roundedClass = 'rounded-tl';
                 if (box.corner === 'tr') roundedClass = 'rounded-tr';
                 if (box.corner === 'bl') roundedClass = 'rounded-bl';
                 if (box.corner === 'br') roundedClass = 'rounded-br';

                 return (
                    <div 
                       key={box.rasi} 
                       className={`
                          ${box.pos} ${roundedClass}
                          bg-[#0c0a09] p-2 relative flex flex-col justify-between 
                          transition-all duration-500 border border-white/[0.02]
                          ${isHighlighted ? 'bg-amber-900/20 border-amber-500/30 shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]' : 'hover:bg-[#151515]'}
                       `}
                    >
                       <span className={`text-[8px] font-bold uppercase tracking-wider transition-colors ${isHighlighted ? 'text-amber-500' : 'text-stone-600'}`}>
                          {box.label.substring(0,3)}
                       </span>
                       
                       <span className="text-[9px] text-stone-500 absolute bottom-1 right-1 opacity-40 select-none">
                          {box.rasi.substring(0,2)}
                       </span>

                       {isHighlighted && (
                          <motion.div 
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="self-center mb-1"
                          >
                             <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                          </motion.div>
                       )}
                    </div>
                 )
              })}
          </div>
       </div>
    </div>
  );
};

export default KattamChart;
