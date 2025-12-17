
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';

interface DisclaimerPageProps {
  onBack: () => void;
}

const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="text-center mb-12">
          <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20"
          >
             <ShieldAlert size={40} />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Disclaimer & Code of Conduct
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto rounded-full" />
        </div>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-lg text-justify font-light">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            This matrimony platform is intended solely for individuals seeking genuine matrimonial alliances. By registering and using this website, users agree to provide accurate, complete, and truthful information and to conduct themselves respectfully and responsibly at all times. Any form of misrepresentation, impersonation, fraudulent activity, harassment, abusive language, obscene content, solicitation, or misuse of the platform is strictly prohibited.
          </motion.p>
          
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            The platform maintains a zero-tolerance policy toward misconduct. Profiles found to be involved in inappropriate behavior, including but not limited to fake identity creation, misleading personal or professional details, repeated unsolicited communication, financial manipulation, threats, or violation of community standards, may be temporarily suspended or permanently blocked without prior notice. The platform reserves the right to remove any content or profile that compromises the safety, trust, or integrity of the community.
          </motion.p>
          
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            All interactions between members occur at their own discretion and responsibility. The platform does not guarantee the authenticity, intent, or outcome of any interaction and shall not be held liable for personal, emotional, financial, or legal consequences arising from user communications or meetings. Users are strongly advised to exercise due diligence, avoid sharing sensitive personal or financial information, and report suspicious activity immediately.
          </motion.p>
          
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            The platform reserves the right to monitor activity, investigate complaints, and take appropriate action—including account restriction, suspension, or termination—to ensure a safe and respectful environment for all members. Continued use of the service constitutes acceptance of these terms and ongoing compliance with platform policies.
          </motion.p>
        </div>

        <div className="mt-12 flex justify-center pt-8 border-t border-gray-200 dark:border-white/10">
           <PremiumButton onClick={onBack} variant="outline" className="!px-10">
              Back to Home
           </PremiumButton>
        </div>
      </motion.div>
    </div>
  );
};

export default DisclaimerPage;
