
import React, { useState, useEffect, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Stories from './components/Stories';
import Footer from './components/Footer';
import AnimatedBackground from './components/ui/AnimatedBackground';
import LoginOverlay from './components/LoginOverlay';
import AdminLogin from './components/AdminLogin';
import ContactSection from './components/ContactSection';
import ChatBot from './components/ChatBot';
import WelcomeIntro from './components/ui/WelcomeIntro';
import MobileAppShowcase from './components/MobileAppShowcase';
import InvitationPromo from './components/InvitationPromo';
import LoginTransition from './components/ui/LoginTransition';
import LogoutTransition from './components/ui/LogoutTransition';
import useLocalStorage from './hooks/useLocalStorage';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ContentProvider } from './contexts/ContentContext';
import { ChatBotProvider } from './contexts/ChatBotContext';
import WeddingLoader from './components/ui/WeddingLoader';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';


const M = motion as any;



const UserDashboard = React.lazy(() => import('./components/dashboard/UserDashboard'));
const AdminDashboard = React.lazy(() => import('./components/admin/AdminDashboard'));
const SuperAdminDashboard = React.lazy(() => import('./components/superadmin/SuperAdminDashboard'));
const ProfileCreationWizard = React.lazy(() => import('./components/profile/ProfileCreationWizard'));
const FAQPage = React.lazy(() => import('./components/FAQPage'));
const CommunitiesPage = React.lazy(() => import('./components/public/CommunitiesPage'));
const CompanyPage = React.lazy(() => import('./components/public/CompanyPage'));
const SuccessStoriesPage = React.lazy(() => import('./components/public/SuccessStoriesPage'));
const PublicMembership = React.lazy(() => import('./components/public/PublicMembership'));
const DisclaimerPage = React.lazy(() => import('./components/public/DisclaimerPage'));
const PublicMatchingPage = React.lazy(() => import('./components/public/PublicMatchingPage')); 

type AppView = 'landing' | 'dashboard' | 'admin-dashboard' | 'super-admin-dashboard' | 'onboarding' | 'faq' | 'communities' | 'company' | 'stories' | 'membership-public' | 'contact' | 'disclaimer' | 'matching';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  
  const [view, setView] = useLocalStorage<AppView>('mdm_currentView', 'landing');
  
  
  const [introSeen, setIntroSeen] = useLocalStorage<boolean>('mdm_intro_seen', false);
  const [showIntro, setShowIntro] = useState(!introSeen);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [initialAuthView, setInitialAuthView] = useState<'login' | 'register'>('login');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [showLoginTransition, setShowLoginTransition] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

        

  const openLogin = () => {
    setInitialAuthView('login');
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdminLogin = () => {
    setIsLoginOpen(false);
    setIsAdminLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsAdminLoginOpen(false);
    setShowLoginTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowLoginTransition(false);
    
    const role = localStorage.getItem('userRole');
  
    if (role === '3') {
        navigate('/dashboard');
    } else if (role === '2') {
        navigate('/admin');
    } else if (role === '1') {
        navigate('/super-admin');
    } else {
        navigate('/'); 
    }
  };

const handleAdminLoginSuccess = () => {
  console.log("Admin Login Signal Received!"); 
  setIsAdminLoginOpen(false);
  setTimeout(() => {
    navigate('/admin');
  }, 400);
};

const handleSuperAdminLoginSuccess = () => {
  console.log("Super Admin Login Signal Received!"); 
  setIsAdminLoginOpen(false);
  setTimeout(() => {
    navigate('/super-admin');
  }, 400);
};

  const handleRegisterSuccess = () => {
    setIsLoginOpen(false);
    setTimeout(() => {
      setView('onboarding');
    }, 300);
  };


  const completeLogout = () => {
    setIsLoggingOut(false);
    localStorage.removeItem('mdm_user_session');
    setView('landing');
    window.scrollTo(0, 0);
  };

  const handleOnboardingComplete = () => {
    setView('dashboard');
    window.scrollTo(0, 0);
  };

  const handleNavClick = (viewId: string) => {
     setView(viewId as AppView);
     window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPublicView = ['landing', 'faq', 'communities', 'company', 'stories', 'membership-public', 'contact', 'disclaimer', 'matching'].includes(view);

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-white font-sans overflow-x-hidden">
      
      {/* Intro & Transitions */}
      <AnimatePresence>
        {showIntro && (
          <WelcomeIntro onComplete={() => {
            setShowIntro(false);
            setIntroSeen(true);
          }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showLoginTransition && <LoginTransition onComplete={handleTransitionComplete} />}
      </AnimatePresence>
      <AnimatePresence>
        {isLoggingOut && <LogoutTransition onComplete={completeLogout} />}
      </AnimatePresence>

      <ChatBot onNavigate={handleNavClick} />

      {/* Auth Modals */}
      <LoginOverlay 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        initialView={initialAuthView}
        onSwitchToAdmin={openAdminLogin}
        onSwitchToSignup={openRegister}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
      />
      <AdminLogin 
        isOpen={isAdminLoginOpen} 
        onClose={() => setIsAdminLoginOpen(false)} 
        onLoginSuccess={handleAdminLoginSuccess}
        onSuperAdminSuccess={handleSuperAdminLoginSuccess}
      />

      <AnimatePresence mode="wait">

        

        {view === 'onboarding' && (
          <M.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute top-6 right-6 z-50">
               <button onClick={toggleDarkMode} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
                  {isDarkMode ? "☀️" : "🌙"}
               </button>
            </div>
            <Suspense fallback={<WeddingLoader />}>
               <ProfileCreationWizard onComplete={handleOnboardingComplete} onExit={() => setView('landing')} />
            </Suspense>
          </M.div>
        )}

        {isPublicView && (
          <M.div key="public" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Header 
              darkMode={isDarkMode} 
              toggleTheme={toggleDarkMode} 
              onLoginClick={openLogin}
              onAdminClick={openAdminLogin}
              onNavigate={handleNavClick}
            />
            
            <main>
              {view === 'landing' && (
                <>
                  <Hero onAction={openRegister} />
                  <Features />
                  <InvitationPromo onAction={openRegister} />
                  <Stories onAction={openRegister} />
                  <MobileAppShowcase />
                  <ContactSection />
                </>
              )}
              <Suspense fallback={<div className="h-screen flex items-center justify-center"><WeddingLoader /></div>}>
                 {view === 'communities' && <CommunitiesPage onLogin={openLogin} />}
                 {view === 'membership-public' && <PublicMembership onLogin={openLogin} />}
                 {view === 'stories' && <SuccessStoriesPage onLogin={openLogin} />}
                 {view === 'company' && <CompanyPage />}
                 {view === 'faq' && <FAQPage />}
                 {view === 'contact' && <ContactSection />}
                 {view === 'disclaimer' && <DisclaimerPage onBack={() => setView('landing')} />}
                 {view === 'matching' && <PublicMatchingPage />}
              </Suspense>
            </main>

            <Footer onAdminClick={openAdminLogin} onNavigate={handleNavClick} />
            <AnimatedBackground />
          </M.div>
        )}

      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <LanguageProvider>
        <ThemeProvider>
          <ContentProvider>
            <ChatBotProvider>
              <Routes>
                {/* The Landing Page (Home) */}
                <Route path="/" element={<AppContent />} />

                
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={[1, 2, 3]}>
                    <Suspense fallback={<WeddingLoader />}>
                       <UserDashboard onLogout={() => window.location.href = '/'} />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* PROTECTED ADMIN (Role 2) */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={[1, 2]}>
                    <Suspense fallback={<WeddingLoader />}>
                       <AdminDashboard 
                          onLogout={() => window.location.href = '/'} 
                          toggleTheme={() => {}} 
                          darkMode={false} 
                        />
                    </Suspense>
                  </ProtectedRoute>
                } />

                {/* PROTECTED SUPER ADMIN (Role 1) */}
                <Route path="/super-admin" element={
                  <ProtectedRoute allowedRoles={[1]}>
                    <Suspense fallback={<WeddingLoader />}>
                       <SuperAdminDashboard onLogout={() => window.location.href = '/'} />
                    </Suspense>
                  </ProtectedRoute>
                } />
                
                {/* 404 Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ChatBotProvider>
          </ContentProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Router>
  );
};

export default App;