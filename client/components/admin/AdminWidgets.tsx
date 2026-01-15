
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Shield, LogOut, Search, Sun, Moon, 
  Bell, CheckCircle, Clock, UserPlus, Settings, Heart, Palette,
  FileText, DollarSign, Flag, Headphones, Menu, X, MessageSquare, Calendar
} from 'lucide-react';
import Logo from '../ui/Logo';
import useTranslation from '../../hooks/useTranslation';
import { ROLE_PERMISSIONS } from '../../utils/adminData';


interface AdminSidebarProps {
  currentView: string;
  onChangeView: (view: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onChangeView, onLogout, isMobileOpen, closeMobile }) => {
  const { t } = useTranslation();
  const [role, setRole] = useState('Manager');

  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
     
     const numericRole = localStorage.getItem('userRole');
     let userRole = 'User';
     
     
     if (numericRole === '1') userRole = 'Super Admin';
     else if (numericRole === '2') userRole = 'Admin';
     else if (numericRole === '4') userRole = 'Astrologer';
     
     setRole(userRole);
     setPermissions(ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS] || []);
  }, []);

  const fullMenu = [
    { 
        section: t('admin.workspace'), 
        requiredPermissions: ['new-accounts', 'user-database', 'events','success-stories'],
        items: [
            { id: 'new-accounts', label: t('admin.newAccounts'), icon: UserPlus, badge: 'High Priority', perm: 'new-accounts' },
            { id: 'user-database', label: t('admin.userDb'), icon: Users, perm: 'user-database' },
            { id: 'events', label: 'Event Management', icon: Calendar, perm: 'events' },
            { id: 'success-stories', label: 'Success Stories', icon: Heart, perm: 'success-stories' },
            { id: 'matches-report', label: "Matches", icon: FileText, perm: 'reports' }
        ]
    },
    { 
        section: t('admin.approvals'), 
        requiredPermissions: ['verification', 'interests', 'approvals-log'],
        items: [
            { id: 'verification', label: t('admin.idVerify'), icon: Shield, perm: 'verification' },
            { id: 'interests', label: t('admin.interestReq'), icon: Heart, perm: 'interests' },
            { id: 'approvals-log', label: t('admin.approvalLog'), icon: CheckCircle, perm: 'approvals-log' },
        ]
    },
    {
        section: t('admin.support'),
        requiredPermissions: ['reports', 'support'],
        items: [
            { id: 'reports', label: t('admin.reports'), icon: Flag, perm: 'reports' },
            { id: 'support', label: t('admin.tickets'), icon: Headphones, perm: 'support' },
        ]
    },
    {
        section: t('admin.finance'),
        requiredPermissions: ['payments'],
        items: [
            { id: 'payments', label: t('admin.transactions'), icon: DollarSign, perm: 'payments' },
        ]
    },
    { 
        section: t('admin.system'), 
        requiredPermissions: ['app-management', 'settings', 'chatbot'],
        items: [
            { id: 'app-management', label: t('admin.appManage'), icon: Palette, perm: 'app-management' },
            { id: 'chatbot-manager', label: 'Chatbot Manager', icon: MessageSquare, perm: 'chatbot' },
            { id: 'settings', label: t('admin.settings'), icon: Settings, perm: 'settings' }, 
        ]
    }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/95 dark:bg-[#080808]/95 backdrop-blur-xl border-r border-gray-200 dark:border-white/5 transition-colors duration-300">
      <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4">
           <Logo className="w-10 h-10" />
           <div>
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white block leading-none">{t('admin.title')}</span>
              <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-gold-400 tracking-widest">{role}</span>
           </div>
        </div>
        <button onClick={closeMobile} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
           <X size={20} />
        </button>
      </div>

      <div className="flex-1 py-8 px-4 space-y-8 overflow-y-auto custom-scrollbar">
        {fullMenu.map((section, idx) => {
           const hasAccess = (perms: string[]) => perms.some(p => permissions.includes('*') || permissions.includes(p));
           if (!hasAccess(section.requiredPermissions)) return null;

           return (
              <div key={idx}>
                 <h4 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{section.section}</h4>
                 <div className="space-y-2">
                    {section.items.map((item) => {
                       if (!permissions.includes('*') && !permissions.includes(item.perm)) return null;
                       
                       return (
                          <button
                             key={item.id}
                             onClick={() => {
                               onChangeView(item.id);
                               closeMobile();
                             }}
                             className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden ${
                                currentView === item.id 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                             }`}
                          >
                             <item.icon size={18} className={`transition-colors ${currentView === item.id ? 'text-white' : 'text-gray-400 group-hover:text-purple-500 dark:group-hover:text-gold-400'}`} />
                             <span className="relative z-10">{item.label}</span>
                             {item.badge && (
                                <span className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                   currentView === item.id ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                                   {item.badge === 'High Priority' ? '!' : item.badge}
                                </span>
                             )}
                          </button>
                       );
                    })}
                 </div>
              </div>
           );
        })}
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02]">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors font-medium text-sm border border-transparent hover:border-red-100 dark:hover:border-red-900/20">
          <LogOut size={18} /> {t('admin.logout')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block w-72 h-screen sticky top-0 z-40">
        <SidebarContent />
      </div>
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={closeMobile}
               className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
            />
            <motion.div
               initial={{ x: '-100%' }}
               animate={{ x: 0 }}
               exit={{ x: '-100%' }}
               transition={{ type: "spring", damping: 25, stiffness: 200 }}
               className="fixed inset-y-0 left-0 z-[70] w-[80vw] sm:w-[300px] lg:hidden shadow-2xl"
            >
               <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export interface AdminHeaderProps {
  toggleTheme: () => void;
  darkMode: boolean;
  title: string;
  onMenuClick: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleTheme, darkMode, title, onMenuClick }) => {
  const [name, setName] = useState('Admin');
  const [role, setRole] = useState('User');
  const { t } = useTranslation();

  useEffect(() => {
     setName(localStorage.getItem('mdm_admin_name') || 'Admin');
     setRole(localStorage.getItem('mdm_admin_role') || 'User');
  }, []);

  
  const formatTitle = (id: string) => {
      
      return id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <header className="h-20 md:h-24 border-b border-gray-200 dark:border-white/5 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
         <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500">
            <Menu size={24} />
         </button>
         <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 dark:text-white capitalize">{formatTitle(title)}</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5 md:mt-1 flex items-center gap-2">
               <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" /> {t('common.loading').replace('...', ' ')} System Operational
            </p>
         </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="hidden md:flex items-center gap-3 bg-white dark:bg-black/40 p-2 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm w-80">
          <Search className="text-gray-400 ml-2" size={18} />
          <input 
            type="text" 
            placeholder={t('common.search')}
            className="w-full bg-transparent border-none py-1 text-sm outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
          <div className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-lg text-[10px] font-bold text-gray-500 border border-gray-200 dark:border-white/5">/</div>
        </div>

        <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden md:block" />

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2.5 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10">
            {darkMode ? <Sun size={20} className="text-gold-400" /> : <Moon size={20} className="text-purple-600" />}
          </button>
          
          <div className="flex items-center gap-3 pl-1 md:pl-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{name}</p>
              <p className="text-xs text-purple-600 dark:text-gold-400 font-bold uppercase tracking-wider">{role}</p>
            </div>
            <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-display font-bold shadow-lg shadow-purple-500/20">
              {name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const KpiCard: React.FC<{ 
  title: string; 
  value: string; 
  trend: string; 
  icon: React.ReactNode; 
  color: string; 
  onClick?: () => void;
}> = ({ title, value, trend, icon, color, onClick }) => {
  
  const getColorStyles = (c: string) => {
    if (c.includes('green')) return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
    if (c.includes('blue')) return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
    if (c.includes('red')) return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400';
    if (c.includes('purple')) return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
    if (c.includes('amber') || c.includes('yellow')) return 'bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
  };
  const trendColor = trend.startsWith('+') ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : trend.startsWith('-') ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-white/5';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-white dark:bg-[#121212] p-6 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-sm flex flex-col justify-between group h-full cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${getColorStyles(color)}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendColor}`}>
          {trend}
        </span>
      </div>
      <div>
        <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">{value}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{title}</p>
      </div>
    </motion.div>
  );
};
export const SimpleBarChart: React.FC = () => null;
