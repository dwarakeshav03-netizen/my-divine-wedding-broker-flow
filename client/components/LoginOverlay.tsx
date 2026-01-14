import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, ChevronLeft, Shield, Check, AlertCircle, Smartphone, Lock, Loader2, MessageSquare, Unlock } from 'lucide-react';
import axios from 'axios';
import Logo from './ui/Logo';

const M = motion as any;
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

type AuthView = 'phone_input' | 'code_verify' | 'email_login';

const LoginOverlay: React.FC<LoginOverlayProps> = ({ isOpen, onClose, onSwitchToAdmin, onSwitchToSignup, onLoginSuccess }) => {
  const [view, setView] = useState<AuthView>('phone_input');
  const [isSuccess, setIsSuccess] = useState(false);
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('+91');

  useEffect(() => {
    if (isOpen) {
      setView('phone_input');
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <M.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <M.div key="card" initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-[420px] bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl z-10 border border-white/20 overflow-hidden">
             
             <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 z-20 text-gray-400">
               <X size={20} />
             </button>

             <div className="p-8 pt-12">
                <div className="text-center mb-8">
                   <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                      <Logo className="w-10 h-10" />
                   </div>
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Welcome Back</h2>
                   <p className="text-sm text-gray-500 mt-2">Login to find your perfect match</p>
                </div>

                <AnimatePresence mode="wait">
                   {view === 'phone_input' && (
                      <PhoneLoginView 
                         mobile={mobile} setMobile={setMobile}
                         countryCode={countryCode} setCountryCode={setCountryCode}
                         onNext={() => setView('code_verify')}
                         onSwitchToEmail={() => setView('email_login')}
                         onRegister={onSwitchToSignup}
                      />
                   )}
                   {view === 'code_verify' && (
                      <CodeVerifyView 
                         mobile={`${countryCode}${mobile}`}
                         onBack={() => setView('phone_input')}
                         onSuccess={() => { setIsSuccess(true); setTimeout(onLoginSuccess, 1500); }}
                      />
                   )}
                   {view === 'email_login' && (
                      <EmailLoginView 
                         onBack={() => setView('phone_input')}
                         onSuccess={() => { setIsSuccess(true); setTimeout(onLoginSuccess, 1500); }}
                      />
                   )}
       </AnimatePresence>

       {view !== 'code_verify' && (
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 text-center">
             <button 
                onClick={onSwitchToAdmin} 
                className="text-[10px] uppercase font-bold text-gray-300 dark:text-gray-600 hover:text-purple-600 active:text-purple-700 transition-colors flex items-center justify-center gap-2 mx-auto group"
             >
                <Shield size={12} className="group-hover:scale-110 transition-transform" /> 
                Admin Access
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

const PhoneLoginView: React.FC<any> = ({ mobile, setMobile, countryCode, setCountryCode, onNext, onSwitchToEmail, onRegister }) => {
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
 
   const isReady = mobile.length === 10;

   const handleSendCode = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isReady) return;
      
      setLoading(true);
      setError('');
      try {
         
         const response = await axios.post('http://localhost:5000/api/v1/auth/request-code', { 
            mobileNumber: mobile 
         });
         
         if (response.data.success) {
            (window as any).temp_code = response.data.code; 
            onNext();
         }
      } catch (err) {
         setError('Number not found in database');
      } finally { setLoading(false); }
   };

   return (
      <M.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
         <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
               <div className="flex gap-3">
                  
                  <div className="w-20 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 flex items-center justify-center font-bold text-gray-900 dark:text-white shadow-sm">
                     {countryCode}
                  </div>
                  
                 
                  <div className="relative flex-1 group">
                     <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                     <input 
                        type="tel" 
                        maxLength={10}
                        value={mobile} 
                        onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} 
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 font-bold text-lg outline-none focus:border-purple-500 transition-all shadow-sm" 
                        placeholder="98765 10000" 
                     />
                  </div>
               </div>
               {error && <p className="text-[10px] text-red-500 font-bold ml-1 text-center">{error}</p>}
            </div>

            
            <button 
               type="submit" 
               disabled={!isReady || loading} 
               className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all duration-500 ${
                  isReady 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer hover:shadow-purple-500/30' 
                  : 'bg-purple-500/20 text-purple-400/40 cursor-not-allowed border border-purple-500/10'
               }`}
            >
               {loading ? <Loader2 className="animate-spin" /> : <>Get Code <ArrowRight size={18} /></>}
            </button>
         </form>

         <div className="mt-8 space-y-6">
            <div className="relative text-center">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-white/10"></div></div>
               <span className="relative bg-white dark:bg-[#0a0a0a] px-3 text-[10px] text-gray-400 uppercase font-bold tracking-widest">Or Connect With</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button type="button" className="flex items-center justify-center gap-3 py-3.5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Google</span>
               </button>
               <button type="button" className="flex items-center justify-center gap-3 py-3.5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-5 h-5 dark:invert group-hover:scale-110 transition-transform" alt="Apple" />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Apple</span>
               </button>
            </div>

            <div className="text-center space-y-3">
               <button onClick={onSwitchToEmail} className="text-[11px] font-bold text-purple-600 hover:text-purple-700 underline underline-offset-4">
                  Login with Email & Password
               </button>
               <p className="text-[11px] text-gray-400">
                  New here? <button onClick={onRegister} className="text-gray-900 dark:text-white font-bold hover:underline">Create an account</button>
               </p>
            </div>
         </div>
      </M.div>
   );
};

// --- ALPHANUMERIC CODE VERIFY  ---
const CodeVerifyView: React.FC<any> = ({ mobile, onBack, onSuccess }) => {
   const [codeParts, setCodeParts] = useState(['', '', '', '', '', '']);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [showPopup, setShowPopup] = useState(false);
   const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

   useEffect(() => {
      const t = setTimeout(() => setShowPopup(true), 1000);
      return () => clearTimeout(t);
   }, []);

   const handleChange = (idx: number, val: string) => {
      const char = val.slice(-1).toUpperCase();
      const newCode = [...codeParts];
      newCode[idx] = char;
      setCodeParts(newCode);
      if (char && idx < 5) inputsRef.current[idx + 1]?.focus();
   };

   const handleVerify = async () => {
      const fullCode = codeParts.join('');
      if (fullCode.length < 6) return;
      setLoading(true);
      try {
         const res = await axios.post('http://localhost:5000/api/v1/auth/verify-code', { mobileNumber: mobile, code: fullCode });
         if (res.data.success) {
            localStorage.setItem('token', res.data.data.accessToken);
            localStorage.setItem('userRole', res.data.data.role.toString()); 
            onSuccess();
         }
      } catch (err) { setError('Incorrect Code'); }
      finally { setLoading(false); }
   };

   return (
      <M.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative">
         <AnimatePresence>
            {showPopup && (
               <div className="absolute -top-32 left-0 right-0 mx-auto w-max z-50">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-purple-100">
                     <MessageSquare className="text-purple-500" size={18} />
                     <p className="text-sm font-bold">Your code is <span className="text-purple-600 font-mono">{(window as any).temp_code || 'A1B2C3'}</span></p>
                  </div>
               </div>
            )}
         </AnimatePresence>

         <button onClick={onBack} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 mb-4 uppercase"><ChevronLeft size={14} /> Change Number</button>
         <h3 className="font-bold text-lg text-gray-900 dark:text-white">Verify Phone</h3>
         <p className="text-sm text-gray-500 mt-1 mb-6">Code sent to <span className="font-bold text-gray-900 dark:text-white">{mobile}</span></p>

         <div className="grid grid-cols-6 gap-2 mb-8">
            {codeParts.map((char, i) => (
               <input key={i} ref={el => { inputsRef.current[i] = el; }} type="text" value={char} onChange={e => handleChange(i, e.target.value)} className="w-full h-12 text-center text-xl font-bold rounded-xl border border-gray-200 dark:bg-white/5 outline-none focus:border-purple-600" />
            ))}
         </div>

         {error && <p className="text-xs text-center text-red-500 font-bold mb-4">{error}</p>}
         <button onClick={handleVerify} disabled={loading} className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg">
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Verify & Login'}
         </button>
      </M.div>
   );
};

const EmailLoginView: React.FC<{ onBack: () => void, onSuccess: () => void }> = ({ onBack, onSuccess }) => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      
      try {
         
         const response = await axios.post('http://localhost:5000/api/v1/auth/login', { 
            email: email, 
            password: password 
         });

         if (response.data.success) {
            const { accessToken, role } = response.data.data;
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userRole', role.toString()); 
            localStorage.setItem('mdm_user_session', email);
            onSuccess(); 
         }
      } catch (err: any) {
         setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <M.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={TRANSITION}>
         <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
            <ChevronLeft size={14} /> Back to Phone Login
         </button>
         
         <form onSubmit={handleLogin} className="space-y-6">
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

// --- PREMIUM INPUT COMPONENT ---
const PremiumInput: React.FC<{ label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; icon: React.ReactNode }> = ({ label, type, value, onChange, icon }) => (
   <div className="space-y-2">
      <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase ml-1 block">{label}</label>
      <div className="relative">
         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
         </div>
         <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 font-medium outline-none focus:border-purple-500 transition-colors" 
         />
      </div>
   </div>
);

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
