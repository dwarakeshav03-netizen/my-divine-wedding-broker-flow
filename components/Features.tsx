
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Star, Users, Sparkles } from 'lucide-react';
import useTranslation from '../hooks/useTranslation';

const M = motion as any;

const Features: React.FC = () => {
  const { t } = useTranslation();

  const FEATURES = [
    {
      icon: <Shield className="w-8 h-8 text-gold-500" />,
      title: t('feat.1.title'),
      description: t('feat.1.desc'),
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-500" />,
      title: t('feat.4.title'),
      description: t('feat.4.desc'),
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 relative z-10 overflow-hidden">
      
      {/* Infinite Marquee Banner */}
      <div className="w-full overflow-hidden mb-16 pointer-events-none select-none relative opacity-70">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent blur-xl" />
        <M.div 
          className="flex whitespace-nowrap"
          animate={{ x: [0, "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
        >
          {[...Array(12)].map((_, i) => (
            <span key={i} className="text-xl md:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-gray-400 to-purple-400 dark:from-white/40 dark:via-white/60 dark:to-white/40 px-8 uppercase tracking-[0.2em]">
               {t('app.name').toUpperCase()} — {t('hero.badge').toUpperCase()} — 
            </span>
          ))}
        </M.div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <M.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 text-purple-600 dark:text-gold-400 font-bold tracking-widest uppercase text-xs mb-4 shadow-sm"
          >
            <Star size={12} className="fill-current" /> {t('feat.badge')}
          </M.div>
          <M.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6"
          >
            {t('feat.title')}
          </M.h2>
          <M.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1 }}
            className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto" 
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {FEATURES.map((feature, idx) => (
            <M.div
              key={idx}
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-8 md:p-10 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 dark:hover:border-gold-500/30 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white dark:bg-white/5 border border-purple-100 dark:border-white/10 flex items-center justify-center mb-8 shadow-xl shadow-purple-500/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative z-10">
                {feature.icon}
              </div>
              
              <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 dark:text-white mb-4 relative z-10">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10">
                {feature.description}
              </p>
            </M.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
