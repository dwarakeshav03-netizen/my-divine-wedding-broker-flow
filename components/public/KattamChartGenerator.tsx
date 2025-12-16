
import React from 'react';
import { motion } from 'framer-motion';

interface KattamChartGeneratorProps {
  highlightRasi?: string; // e.g., 'Mesha', 'Rishaba'
  title?: string;
  labels?: { rasi: string, label: string }[]; // Optional overrides for cell content
}

const RASI_GRID = [
  { id: 'Meena', label: 'Pisces', pos: 'col-start-1 row-start-1', corners: 'rounded-tl-xl' },
  { id: 'Mesha', label: 'Aries', pos: 'col-start-2 row-start-1' },
  { id: 'Rishaba', label: 'Taurus', pos: 'col-start-3 row-start-1' },
  { id: 'Mithuna', label: 'Gemini', pos: 'col-start-4 row-start-1', corners: 'rounded-tr-xl' },
  
  { id: 'Kumbha', label: 'Aquarius', pos: 'col-start-1 row-start-2' },
  { id: 'Kataka', label: 'Cancer', pos: 'col-start-4 row-start-2' },
  
  { id: 'Makara', label: 'Capricorn', pos: 'col-start-1 row-start-3' },
  { id: 'Simha', label: 'Leo', pos: 'col-start-4 row-start-3' },
  
  { id: 'Dhanusu', label: 'Sagittarius', pos: 'col-start-1 row-start-4', corners: 'rounded-bl-xl' },
  { id: 'Vrishchika', label: 'Scorpio', pos: 'col-start-2 row-start-4' },
  { id: 'Thula', label: 'Libra', pos: 'col-start-3 row-start-4' },
  { id: 'Kanya', label: 'Virgo', pos: 'col-start-4 row-start-4', corners: 'rounded-br-xl' },
];

const KattamChartGenerator: React.FC<KattamChartGeneratorProps> = ({ highlightRasi, title, labels }) => {
  
  const getCellContent = (rasiId: string) => {
     const custom = labels?.find(l => l.rasi === rasiId);
     return custom ? custom.label : '';
  };

  return (
    <div className="w-full max-w-[320px] mx-auto">
      {title && <h4 className="text-center font-bold text-amber-600 dark:text-amber-400 mb-2 uppercase tracking-widest text-xs">{title}</h4>}
      
      <div className="aspect-square bg-amber-900/10 dark:bg-white/5 border-2 border-amber-600/50 rounded-xl p-1 shadow-inner relative">
         <div className="grid grid-cols-4 grid-rows-4 gap-[2px] h-full w-full bg-amber-600/20">
            
            {/* Center Box - Rasi Chakra */}
            <div className="col-start-2 col-span-2 row-start-2 row-span-2 bg-white dark:bg-[#1a1a1a] flex flex-col items-center justify-center p-2 text-center">
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Rasi</span>
               <div className="text-2xl mt-1">🕉️</div>
            </div>

            {RASI_GRID.map((cell) => {
               const isHighlighted = highlightRasi === cell.id;
               const content = getCellContent(cell.id);

               return (
                  <div 
                     key={cell.id}
                     className={`
                        ${cell.pos} ${cell.corners || ''}
                        bg-white dark:bg-[#121212] p-1 relative flex flex-col justify-between
                        transition-all duration-300
                        ${isHighlighted ? 'bg-amber-100 dark:bg-amber-900/30 ring-inset ring-2 ring-amber-500' : ''}
                     `}
                  >
                     <span className={`text-[8px] font-bold uppercase ${isHighlighted ? 'text-amber-700 dark:text-amber-400' : 'text-gray-400'}`}>
                        {cell.label.slice(0, 3)}
                     </span>
                     
                     {/* Dynamic Content (e.g. "Lagnam", "Moon") */}
                     {content && (
                        <motion.span 
                           initial={{ scale: 0 }} animate={{ scale: 1 }}
                           className="text-[10px] font-bold text-center text-purple-600 dark:text-purple-400 break-words leading-tight"
                        >
                           {content}
                        </motion.span>
                     )}

                     {isHighlighted && !content && (
                        <motion.div layoutId="highlight" className="w-1.5 h-1.5 bg-amber-500 rounded-full self-end" />
                     )}
                  </div>
               );
            })}
         </div>
      </div>
    </div>
  );
};

export default KattamChartGenerator;
