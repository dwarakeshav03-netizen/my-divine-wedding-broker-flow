
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
   Settings, UserPlus
} from 'lucide-react';
import { AdminSidebar, AdminHeader } from './AdminWidgets';
import AdminUserManagement from './AdminUserManagement';
import AdminVerification from './AdminVerification';
import AdminApprovalLogs from './AdminApprovalLogs';
import AdminInterestManager from './AdminInterestManager';
import AdminSettings from './AdminSettings';
import AdminAppManagement from './AdminAppManagement';
import AdminReports from './AdminReports';
import AdminPayments from './AdminPayments';
import AdminSupport from './AdminSupport';
import AdminChatbotManager from './AdminChatbotManager'; 
import AdminEvents from './AdminEvents';
import AdminSuccessStories from './AdminSuccessStories';
import AstrologerDashboard from './astrology/AstrologerDashboard';
import { ROLE_PERMISSIONS } from '../../utils/adminData';

interface AdminDashboardProps {
  onLogout: () => void;
  toggleTheme: () => void;
  darkMode: boolean;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, toggleTheme, darkMode }) => {
  const [currentView, setCurrentView] = useState('');
  const [role, setRole] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const numericRole = localStorage.getItem('userRole');
    
    
    let currentRole = 'User'; 
    
    if (numericRole === '1') {
      currentRole = 'Super Admin';
    } else if (numericRole === '2') {
      currentRole = 'Admin';
    } else if (numericRole === '4') { 
      currentRole = 'Astrologer';
    }

    setRole(currentRole);
    console.log("Mapped Role:", currentRole);
  }, []); 

  useEffect(() => {
    if (!role || role === 'User') return;
    const permissions = ROLE_PERMISSIONS[role] || [];
    
    if (permissions.includes('*')) {
      setCurrentView('overview');
    } else if (permissions.includes('user-management')) {
      setCurrentView('user-management');
    } else if (permissions.includes('events')) {
      setCurrentView('events');
    } else if (permissions.includes('astrology-dashboard')) {
      setCurrentView('astrology-dashboard');
    } else {
      setCurrentView('user-management'); 
    }
  }, [role]);

  if (role === 'Astrologer') {
     return <AstrologerDashboard onLogout={onLogout} />;
  }

  const renderContent = () => {
     switch(currentView) {
        // 'new-accounts' removed for Admin, accessible only to Super Admin or if perm added back
        case 'new-accounts': return <AdminUserManagement initialTab="pending" />;
        // 'user-database' is the main view for Admins now. lockTab prevents switching to pending.
        case 'user-database': return <AdminUserManagement initialTab="all" lockTab={true} />;
        
        // 'verification' removed for Admin, accessible only to Super Admin
        case 'verification': return <AdminVerification />;
        
        case 'approvals-log': return <AdminApprovalLogs />;
        case 'interests': return <AdminInterestManager />;
        case 'settings': return <AdminSettings />;
        case 'app-management': return <AdminAppManagement />;
        case 'chatbot-manager': return <AdminChatbotManager />;
        case 'reports': return <AdminReports />;
        case 'events': return <AdminEvents />;
        case 'success-stories': return <AdminSuccessStories />;
        
        // 'payments' accessible if role has permission (e.g. Finance)
        case 'payments': return <AdminPayments />;
        
        case 'support': return <AdminSupport />;
        default: return <div className="p-10 text-center text-gray-500">Select an option from the menu</div>;
     }
  };

  return (
    <div className="flex h-screen bg-[#f4f5f7] dark:bg-[#050505] text-gray-900 dark:text-white font-sans overflow-hidden transition-colors duration-500">
       
       <AdminSidebar 
          currentView={currentView} 
          onChangeView={setCurrentView} 
          onLogout={onLogout}
          isMobileOpen={mobileMenuOpen}
          closeMobile={() => setMobileMenuOpen(false)}
       />

       <div className="flex-1 flex flex-col min-w-0 bg-[#f8f9fa] dark:bg-black/40 relative">
          <AdminHeader 
             toggleTheme={toggleTheme} 
             darkMode={darkMode} 
             title={currentView}
             onMenuClick={() => setMobileMenuOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
             <div className="max-w-7xl mx-auto h-full">
                <AnimatePresence mode="wait">
                   <motion.div 
                     key={currentView}
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                     className="h-full"
                   >
                      {renderContent()}
                   </motion.div>
                </AnimatePresence>
             </div>
          </main>
       </div>

    </div>
  );
};

export default AdminDashboard;
