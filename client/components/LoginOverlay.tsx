
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, ChevronLeft, Shield, Check, AlertCircle, Unlock, Smartphone, Lock, Loader2, MessageSquare } from 'lucide-react';
import Logo from './ui/Logo';
import { AuthService } from '../utils/authService';
import { COUNTRY_CODES } from '../utils/validation';

const M = motion as any;

// --- ANIMATION CONFIG ---
const TRANSITION = { duration: 0.4, ease: [0.22, 1, 0.36, 1] };

interface LoginOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToAdmin?: () => void;
  onSwitchToSignup?: () => void;
  onLoginSuccess: () => void;
  onRegisterSuccess: () => void;
  initialView?: 'login' | 'register';
}

type AuthView = 'phone_input' | 'otp_verify' | 'email_login';

// --- SUB-COMPONENTS ---
const PremiumInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode, label: string }> = ({ icon, label, ...props }) => (
  <div className="relative group mb-4">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors z-10">
      {icon}
    </div>
    <input 
      {...props}
      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-black transition-all shadow-sm focus:shadow-lg focus:shadow-purple-500/10 peer"
      placeholder={label}
    />
    <label className="absolute left-12 top-4 text-xs font-bold text-gray-400 uppercase tracking-wider -translate-y-3 scale-90 origin-left transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-90 peer-focus:text-purple-600 pointer-events-none">
      {label}
    </label>
  </div>
);

// --- MAIN COMPONENT ---
const LoginOverlay: React.FC<LoginOverlayProps> = ({ isOpen, onClose, onSwitchToAdmin, onSwitchToSignup, onLoginSuccess, initialView = 'login' }) => {
  const [view, setView] = useState<AuthView>('phone_input');
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Data State
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  
  useEffect(() => {
    if (isOpen) {
      setView('phone_input');
      setIsSuccess(false);
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <M.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <M.div 
            key="card"
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
            transition={TRANSITION} 
            className="relative w-full max-w-[420px] bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl overflow-visible z-10 border border-white/20 dark:border-white/5"
          >
             {/* Decorative Top Gradient - Inside Card Overflow Hidden Wrapper */}
             <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-transparent pointer-events-none" />
             </div>
             
             {/* Close Button */}
             <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors z-20 text-gray-400 hover:text-gray-900 dark:hover:text-white">
               <X size={20} />
             </button>

             <div className="p-8 pt-12 relative z-10">
                {/* Header Logo */}
                <div className="text-center mb-10">
                   <M.div 
                      initial={{ scale: 0.8 }} animate={{ scale: 1 }} 
                      className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-purple-500/30"
                   >
                      <Logo className="w-10 h-10" />
                   </M.div>
                   <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                      Welcome Back
                   </h2>
                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {view === 'otp_verify' ? 'Enter the code sent to your mobile' : 'Login to find your perfect match'}
                   </p>
                </div>

                <AnimatePresence mode="wait">
                   {view === 'phone_input' && (
                      <PhoneLoginView 
                         key="phone"
                         mobile={mobile}
                         setMobile={setMobile}
                         countryCode={countryCode}
                         setCountryCode={setCountryCode}
                         onNext={() => setView('otp_verify')}
                         onSwitchToEmail={() => setView('email_login')}
                         onRegister={onSwitchToSignup}
                      />
                   )}
                   
                   {view === 'otp_verify' && (
                      <OtpVerifyView 
                         key="otp"
                         mobile={`${countryCode} ${mobile}`}
                         onBack={() => setView('phone_input')}
                         onSuccess={() => { setIsSuccess(true); setTimeout(onLoginSuccess, 1500); }}
                      />
                   )}

                   {view === 'email_login' && (
                      <EmailLoginView 
                         key="email"
                         onBack={() => setView('phone_input')}
                         onSuccess={() => { setIsSuccess(true); setTimeout(onLoginSuccess, 1500); }}
                      />
                   )}
                </AnimatePresence>

                {/* Footer Admin Link */}
                {view !== 'otp_verify' && (
                   <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
                      <button 
                         onClick={onSwitchToAdmin} 
                         className="text-[10px] uppercase font-bold text-gray-300 dark:text-gray-600 hover:text-purple-600 transition-colors flex items-center justify-center gap-2 mx-auto"
                      >
                         <Shield size={12} /> Admin Access
                      </button>
                   </div>
                )}
             </div>
          </M.div>
        ) : (
          <SuccessTransition key="success" />
        )}
      </AnimatePresence>
    </div>
  );
};

// ... Rest of the file (PhoneLoginView, OtpVerifyView, EmailLoginView, SuccessTransition) remains unchanged ...
// --- VIEW 1: PHONE INPUT ---
const PhoneLoginView: React.FC<{ 
  mobile: string, setMobile: (v: string) => void, 
  countryCode: string, setCountryCode: (v: string) => void,
  onNext: () => void,
  onSwitchToEmail: () => void,
  onRegister?: () => void
}> = ({ mobile, setMobile, countryCode, setCountryCode, onNext, onSwitchToEmail, onRegister }) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const handleSendOtp = async (e: React.FormEvent) => {
      e.preventDefault();
      if(mobile.length < 10) {
         setError('Please enter a valid mobile number');
         return;
      }
      setLoading(true);
      setError('');
      
      // Optimistic UI: Transition immediately, assume success for better UX
      onNext();
      
      // Fire API call in background
      AuthService.sendMobileOtp(mobile, countryCode).catch(err => {
         console.error("Failed to send OTP", err);
         // Error handling would ideally happen in the next view or revert state
      });
      setLoading(false);
   };

   return (
      <M.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={TRANSITION}>
         <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Mobile Number</label>
               <div className="flex gap-3">
                  <div className="relative w-24 shrink-0 group">
                     <select 
                        value={countryCode} 
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full appearance-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-4 pr-8 text-gray-900 dark:text-white font-bold focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                     >
                        {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                     </select>
                  </div>
                  <div className="relative flex-1 group">
                     <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" size={20} />
                     <input 
                        type="tel" 
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white font-bold text-lg tracking-wide placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all shadow-sm focus:shadow-lg focus:shadow-purple-500/10"
                        placeholder="98765 43210"
                        autoFocus
                     />
                  </div>
               </div>
               {error && <p className="text-xs text-red-500 font-bold ml-1 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
            </div>

            <button 
               type="submit" 
               disabled={loading || mobile.length < 10}
               className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group transform active:scale-95"
            >
               {loading ? <Loader2 className="animate-spin" /> : <>Get OTP <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>}
            </button>
         </form>

         <div className="mt-8 space-y-6">
            <div className="relative text-center">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-white/10"></div></div>
               <span className="relative bg-white dark:bg-[#0a0a0a] px-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Or connect with</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Google</span>
               </button>
               <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                  <svg className="w-5 h-5 text-black dark:text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.05-.48-3.24.02-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-.99 4.31-.74c.51.02 2.19.18 3.54 1.96-3.23 1.74-2.61 5.95 1.07 7.24-.67 1.67-1.59 3.24-2.66 4.31-.54.53-1.15 1.15-1.34 1.46zm-2.93-16c.86-1.04 1.55-2.57 1.34-4.08-1.51.13-3.1.88-3.92 1.83-.8.93-1.48 2.44-1.31 3.9 1.63.13 3.09-.76 3.89-1.65z"/></svg>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Apple</span>
               </button>
            </div>

            <div className="text-center space-y-4">
               <button onClick={onSwitchToEmail} className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline transition-colors">
                  Login with Email & Password
               </button>
               <p className="text-xs text-gray-400">
                  New here? <button onClick={onRegister} className="text-gray-900 dark:text-white font-bold hover:underline">Create an account</button>
               </p>
            </div>
         </div>
      </M.div>
   );
};

// --- VIEW 2: OTP VERIFY ---
const OtpVerifyView: React.FC<{ mobile: string, onBack: () => void, onSuccess: () => void }> = ({ mobile, onBack, onSuccess }) => {
   const [otp, setOtp] = useState(['', '', '', '', '', '']);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [showDemoNotification, setShowDemoNotification] = useState(false);
   const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

   useEffect(() => {
     // Simulate SMS arrival
     const timer = setTimeout(() => setShowDemoNotification(true), 1500);
     const hideTimer = setTimeout(() => setShowDemoNotification(false), 6000);
     return () => { clearTimeout(timer); clearTimeout(hideTimer); };
   }, []);

   const handleOtpChange = (index: number, value: string) => {
      if (isNaN(Number(value))) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputsRef.current[index + 1]?.focus();
   };

   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) inputsRef.current[index - 1]?.focus();
   };

   const handleVerify = async () => {
      const code = otp.join('');
      if (code.length < 6) return;
      setLoading(true);
      setError('');
      
      try {
         // Use existing Mock Logic but adapt to find user
         await new Promise(resolve => setTimeout(resolve, 1500));
         
         const cleanMobile = mobile.replace(/\s+/g, '');
         const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
         
         // Mock: Find user or use demo logic
         let user = users.find((u: any) => u.mobile.replace(/\s+/g, '') === cleanMobile);
         
         // Special case for demo numbers or if code matches demo code
         if (!user && (mobile.includes('9876543210') || mobile.includes('9087549000'))) {
             user = { email: 'user@divine.com' };
         }

         if (user || code === '123456') { // Allow any user in demo with correct code
             const demoUser = user || { email: 'demo@user.com' };
             localStorage.setItem('mdm_user_session', demoUser.email);
             onSuccess();
         } else {
             setError('Account not found. Please register first.');
         }
      } catch (err) {
         setError('Invalid Code');
      } finally {
         setLoading(false);
      }
   };

   return (
      <M.div 
         initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={TRANSITION}
         className="relative"
      >
         {/* Demo Notification Pop-up - Positioned Absolutely relative to container */}
         <AnimatePresence>
            {showDemoNotification && (
               <M.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  className="absolute -top-32 left-0 right-0 mx-auto w-max z-50 pointer-events-none"
               >
                  <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md text-gray-800 dark:text-white px-5 py-3 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 flex items-center gap-4">
                     <div className="bg-green-100 dark:bg-green-900/30 p-2.5 rounded-full text-green-600 dark:text-green-400">
                        <MessageSquare size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">Messages • Now</p>
                        <p className="text-sm font-bold">Your OTP is <span className="text-purple-600 dark:text-purple-400 font-mono text-base">123456</span></p>
                     </div>
                  </div>
               </M.div>
            )}
         </AnimatePresence>

         <div className="mb-8">
            <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 mb-4 transition-colors">
               <ChevronLeft size={14} /> Change Number
            </button>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Verify Phone</h3>
            <p className="text-sm text-gray-500 mt-1">Code sent to <span className="text-gray-900 dark:text-white font-bold">{mobile}</span></p>
         </div>

         {/* OTP Grid Layout for Better Responsiveness */}
         <div className="grid grid-cols-6 gap-2 mb-8">
            {otp.map((digit, idx) => (
               <input
                  key={idx}
                  ref={el => { inputsRef.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-full h-12 md:h-14 text-center text-xl md:text-2xl font-bold rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 focus:border-purple-600 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-purple-500/10 outline-none transition-all caret-purple-600 shadow-sm"
                  autoFocus={idx === 0}
               />
            ))}
         </div>

         {error && <p className="text-xs text-center text-red-500 font-bold mb-6 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20">{error}</p>}

         <button 
            onClick={handleVerify}
            disabled={loading || otp.join('').length < 6}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
         >
            {loading ? <Loader2 className="animate-spin" /> : 'Verify & Login'}
         </button>

         <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
               Didn't receive code? <button className="text-purple-600 font-bold hover:underline transition-colors">Resend in 30s</button>
            </p>
         </div>
      </M.div>
   );
};

// --- VIEW 3: LEGACY EMAIL LOGIN ---
const EmailLoginView: React.FC<any> = ({ onBack, onSuccess }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      await new Promise(r => setTimeout(r, 1500)); // Mock delay

      const storedUsers = JSON.parse(localStorage.getItem('mdm_users') || '[]');
      const user = storedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      
      if ((user && user.password === password) || (email === 'user@divine.com' && password === 'password')) {
          localStorage.setItem('mdm_user_session', email);
          onSuccess();
      } else {
          setError('Invalid credentials');
          setLoading(false);
      }
   };

   return (
      <M.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={TRANSITION}>
         <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
            <ChevronLeft size={14} /> Back to Phone Login
         </button>
         
         <form onSubmit={handleLogin} className="space-y-4">
            <PremiumInput 
               label="Email Address" 
               type="email" 
               value={email} 
               onChange={e => setEmail(e.target.value)} 
               icon={<Mail size={18} />} 
            />
            <PremiumInput 
               label="Password" 
               type="password" 
               value={password} 
               onChange={e => setPassword(e.target.value)} 
               icon={<Lock size={18} />} 
            />
            
            <div className="flex justify-end">
               <button type="button" className="text-xs text-purple-600 font-bold hover:underline">Forgot Password?</button>
            </div>

            {error && <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2"><AlertCircle size={14} /> {error}</div>}

            <button 
               type="submit"
               disabled={loading}
               className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-95"
            >
               {loading ? <Loader2 className="animate-spin" /> : 'Login'}
            </button>
         </form>

         <div className="mt-8 text-center pt-6 border-t border-gray-100 dark:border-white/5">
             <button onClick={() => { setEmail('user@divine.com'); setPassword('password'); }} className="text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors">
                <Unlock size={12} /> Use Demo Credentials
             </button>
         </div>
      </M.div>
   );
};

// --- SUCCESS ANIMATION ---
const SuccessTransition = () => (
   <M.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-[110] flex flex-col items-center justify-center text-white p-10 min-h-[400px]">
      <M.div 
         initial={{ scale: 0 }} 
         animate={{ scale: 1 }} 
         transition={{ type: "spring", stiffness: 200, damping: 15 }} 
         className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] mb-8"
      >
         <Check size={48} strokeWidth={3} />
      </M.div>
      <M.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-display font-bold mb-2 text-center text-gray-900 dark:text-white">
         Login Successful
      </M.h2>
      <M.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-gray-500 dark:text-gray-400 text-center">
         Redirecting to your dashboard...
      </M.p>
   </M.div>
);

export default LoginOverlay;
