
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import PremiumButton from './ui/PremiumButton';
import useTranslation from '../hooks/useTranslation';

const M = motion as any;

interface AccessPanelProps {
  onLogin: () => void;
  onRegister: () => void;
}

const AccessPanel: React.FC<AccessPanelProps> = ({ onLogin, onRegister }) => {
  const { t } = useTranslation();

  return (
    <section className="relative py-32 overflow-hidden z-20">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 bg-gray-50/50 dark:bg-[#080808] transition-colors duration-500 -z-20" />
      
      <M.div 
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10"
      />
      <M.div 
        animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl -z-10"
      />

      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative">
          <M.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('access.title')}
          </M.h2>
          <M.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto"
          >
            {t('access.desc')}
          </M.p>
          
          <M.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" 
          />
        </div>

        <div className="flex justify-center items-center">
          
          {/* Primary Action Card - Centered */}
          <M.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-2xl group w-full max-w-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
            
            <div className="flex flex-col h-full items-center text-center space-y-8">
              <div>
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-300 mx-auto">
                  <Heart size={40} className="animate-pulse-slow" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{t('access.soulmate.title')}</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  {t('access.soulmate.desc')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                 <PremiumButton onClick={onRegister} variant="gradient" icon={<ArrowRight size={18} />} className="!px-10">
                   {t('access.create')}
                 </PremiumButton>
                 <PremiumButton onClick={onLogin} variant="secondary" className="!px-10">
                   {t('access.login')}
                 </PremiumButton>
              </div>
            </div>
          </M.div>

        </div>
      </div>
    </section>
  );
};

export default AccessPanel;
