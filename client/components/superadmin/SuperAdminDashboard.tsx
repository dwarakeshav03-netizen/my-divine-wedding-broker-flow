
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, LayoutDashboard, Users, Activity, DollarSign, Lock, 
  LogOut, Search, Bell, Menu, X, Globe, Crown, UserCheck, UserPlus, FileText, Flag
} from 'lucide-react';
import Logo from '../ui/Logo';

// Sub-Components
import SuperAdminOverview from './SuperAdminOverview';
import AdminManager from './AdminManager';
import GlobalAuditLogs from './GlobalAuditLogs';
// Reusing robust components
import AdminUserManagement from '../admin/AdminUserManagement';
import AdminPayments from '../admin/AdminPayments';
import AdminReports from '../admin/AdminReports';

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Super Admin Menu
  const menuItems = [
    { id: 'overview', label: 'Governance Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Database (Deep)', icon: UserCheck },
    { id: 'reports', label: 'Reports & Safety', icon: Flag },
    { id: 'admins', label: 'Admin Management', icon: Users },
    { id: 'transactions', label: 'Financial Audit', icon: DollarSign },
    { id: 'audit', label: 'Global System Logs', icon: FileText },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'overview': return <SuperAdminOverview onChangeView={setCurrentView} />;
      case 'users': return <AdminUserManagement initialTab="all" lockTab={false} />; 
      case 'reports': return <AdminReports />;
      case 'admins': return <AdminManager />;
      case 'transactions': return <AdminPayments />;
      case 'audit': return <GlobalAuditLogs />;
      default: return <SuperAdminOverview onChangeView={setCurrentView} />;
    }
  };

  const SidebarContent = () => (
     <div className="flex flex-col h-full bg-[#12131c] border-r border-white/5 relative">
         {/* Logo Area */}
         <div className="h-24 flex items-center px-6 border-b border-white/5 bg-gradient-to-r from-[#12131c] to-[#1a1b26] shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-700 rounded-xl flex items-center justify-center text-black shrink-0 shadow-lg shadow-yellow-500/20">
               <Crown size={24} fill="black" />
            </div>
            {(sidebarOpen || mobileMenuOpen) && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3">
                  <h1 className="font-display font-bold text-lg text-yellow-500 tracking-wide">DIVINE</h1>
                  <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold">Governance</p>
               </motion.div>
            )}
            {mobileMenuOpen && (
               <button onClick={() => setMobileMenuOpen(false)} className="ml-auto p-2 text-gray-400 hover:text-white md:hidden">
                  <X size={20} />
               </button>
            )}
         </div>

         {/* Navigation */}
         <nav className="flex-1 py-8 px-3 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => {
                     setCurrentView(item.id);
                     setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold transition-all group relative overflow-hidden ${
                     currentView === item.id 
                     ? 'bg-gradient-to-r from-yellow-600/20 to-transparent text-yellow-400 border-l-4 border-yellow-500' 
                     : 'text-gray-500 hover:bg-white/5 hover:text-gray-200'
                  }`}
               >
                  <item.icon size={20} className={currentView === item.id ? 'text-yellow-500' : 'text-gray-500 group-hover:text-gray-300'} />
                  {(sidebarOpen || mobileMenuOpen) && <span className="relative z-10">{item.label}</span>}
                  {currentView === item.id && <div className="absolute inset-0 bg-yellow-500/5 z-0" />}
               </button>
            ))}
         </nav>

         {/* Footer */}
         <div className="p-6 border-t border-white/5 bg-[#0f1016] shrink-0">
            <button 
               onClick={onLogout}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 font-bold transition-colors border border-transparent hover:border-red-500/20"
            >
               <LogOut size={20} />
               {(sidebarOpen || mobileMenuOpen) && <span>Secure Logout</span>}
            </button>
         </div>
     </div>
  );

  return (
    <div className="flex h-screen bg-[#0b0c15] text-white font-sans selection:bg-yellow-500/30 overflow-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col z-30 shadow-2xl relative h-full shrink-0"
      >
         <SidebarContent />
      </motion.aside>

      {/* MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
         {mobileMenuOpen && (
            <>
               <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
                  onClick={() => setMobileMenuOpen(false)}
               />
               <motion.div
                  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed inset-y-0 left-0 w-[280px] z-50 md:hidden shadow-2xl"
               >
                  <SidebarContent />
               </motion.div>
            </>
         )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0b0c15] relative h-full">
         {/* Top Header */}
         <header className="h-20 md:h-24 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#0b0c15]/90 backdrop-blur-xl sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-4">
               <button onClick={() => {
                  if (window.innerWidth < 768) setMobileMenuOpen(true);
                  else setSidebarOpen(!sidebarOpen);
               }} className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  <Menu />
               </button>
               <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-white capitalize">{currentView.replace('-', ' ')}</h2>
                  <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" /> System Secure
                  </p>
               </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
               <div className="hidden lg:flex items-center gap-3 bg-[#151621] px-4 py-2 rounded-full border border-white/5">
                  <Globe size={14} className="text-gray-500" />
                  <span className="text-xs font-mono text-gray-300">192.168.1.1 (HQ)</span>
               </div>
               <div className="w-px h-8 bg-white/10 hidden md:block" />
               <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-bold text-yellow-500">Super Admin</p>
                     <p className="text-[10px] text-gray-500 uppercase tracking-wider">Level 1</p>
                  </div>
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold shadow-lg shadow-yellow-500/20">
                     SA
                  </div>
               </div>
            </div>
         </header>

         {/* Content Scroll Area */}
         <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <AnimatePresence mode="wait">
               <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-7xl mx-auto h-full"
               >
                  {renderContent()}
               </motion.div>
            </AnimatePresence>
         </main>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;
