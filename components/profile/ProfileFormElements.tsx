
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Upload, AlertCircle, X, ChevronDown, Mail, Lock, RefreshCw, CheckCircle2, Globe, Plus, Smartphone, Shield, Loader2, MessageSquare } from 'lucide-react';
import { PATTERNS, COUNTRY_CODES, formatCurrency, validateFile } from '../../utils/validation';
import { AuthService } from '../../utils/authService';
import { SuccessTick } from '../ui/SuccessTick';

const M = motion as any;

// --- ANIMATED INPUT ---
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  isValid?: boolean;
  numericOnly?: boolean;
  alphaOnly?: boolean;
  formatter?: 'currency' | 'none';
  required?: boolean;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({ 
  label, error, icon, className, placeholder, isValid, numericOnly, alphaOnly, formatter, onChange, required, ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setHasValue(!!props.value);
  }, [props.value]);

  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;
    if (numericOnly && !/[0-9]/.test(e.key)) e.preventDefault();
    if (alphaOnly && !/[a-zA-Z\s]/.test(e.key)) e.preventDefault();
    props.onKeyDown?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (formatter === 'currency') {
      const raw = val.replace(/[^0-9]/g, '');
      val = raw ? formatCurrency(raw) : '';
      e.target.value = val;
    }
    if (numericOnly) {
      val = val.replace(/[^0-9]/g, '');
      e.target.value = val;
    }
    if (alphaOnly) {
      val = val.replace(/[^a-zA-Z\s]/g, '');
      e.target.value = val;
    }
    onChange?.(e);
  };

  return (
    <M.div 
      className={`relative mb-6 group ${className}`}
      animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
    >
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10 ${focused ? 'text-purple-600 dark:text-gold-400' : 'text-gray-400'}`}>
        {icon}
      </div>
      <input
        {...props}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value); props.onBlur?.(e); }}
        placeholder={focused ? placeholder : ''}
        className={`w-full bg-white/60 dark:bg-black/20 backdrop-blur-xl border rounded-xl px-12 pt-6 pb-2 h-14 text-gray-900 dark:text-white font-medium outline-none transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:text-sm ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] bg-red-50/10' : isValid ? 'border-green-500/50 bg-green-50/10 dark:bg-green-900/10' : focused ? 'border-purple-600 dark:border-gold-400 bg-white dark:bg-black/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/5'} disabled:opacity-70 disabled:cursor-not-allowed`}
      />
      <AnimatePresence>
        {isValid && !error && (
          <M.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle2 size={18} />
          </M.div>
        )}
      </AnimatePresence>
      <label className={`absolute left-12 transition-all duration-300 ease-out pointer-events-none truncate max-w-[calc(100%-4rem)] origin-top-left ${focused || hasValue ? 'top-1.5 text-[10px] uppercase tracking-wider font-bold translate-y-0' : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'} ${error ? 'text-red-500' : focused ? 'text-purple-600 dark:text-gold-400' : ''}`}>
        {label} {required && <span className="text-red-500 dark:text-red-400 ml-0.5">*</span>}
      </label>
      <AnimatePresence>
        {error && (
          <M.div initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.95 }} className="absolute right-0 top-full mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md border border-red-100 dark:border-red-900/30 shadow-sm z-20 pointer-events-none">
            <AlertCircle size={12} /> {error}
          </M.div>
        )}
      </AnimatePresence>
    </M.div>
  );
};

// --- ANIMATED PHONE INPUT ---
export const AnimatedPhoneInput: React.FC<any> = ({ label, value, countryCode, onCountryCodeChange, onPhoneChange, error, onBlur, disabled, required }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);
  const [shake, setShake] = useState(false);

  useEffect(() => { setHasValue(!!value); }, [value]);
  useEffect(() => { if (error) { setShake(true); setTimeout(() => setShake(false), 500); } }, [error]);

  return (
     <M.div className={`relative mb-6 group ${disabled ? 'opacity-70' : ''}`} animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
      <div className={`flex items-center w-full bg-white/60 dark:bg-black/20 backdrop-blur-xl border rounded-xl overflow-hidden transition-all duration-300 ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] bg-red-50/10' : focused ? 'border-purple-600 dark:border-gold-400 bg-white dark:bg-black/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/5'}`}>
        <div className="relative border-r border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
          <select disabled={disabled} value={countryCode} onChange={(e) => onCountryCodeChange(e.target.value)} className="appearance-none bg-transparent h-14 pl-4 pr-8 outline-none text-gray-900 dark:text-white font-medium text-sm cursor-pointer w-24 disabled:cursor-not-allowed">
            {COUNTRY_CODES.map((c) => (<option key={c.code} value={c.code} className="text-gray-900 bg-white dark:bg-gray-900 dark:text-white">{c.country} {c.code}</option>))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative flex-1">
          <input disabled={disabled} type="text" value={value} onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); onBlur?.(); }} onChange={(e) => onPhoneChange(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-transparent h-14 px-4 outline-none text-gray-900 dark:text-white font-medium placeholder-transparent disabled:cursor-not-allowed" placeholder="1234567890" />
          <label className={`absolute left-4 transition-all duration-300 ease-out pointer-events-none origin-top-left ${focused || hasValue ? 'top-1.5 text-[10px] uppercase tracking-wider font-bold translate-y-0' : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'} ${error ? 'text-red-500' : focused ? 'text-purple-600 dark:text-gold-400' : ''}`}>
             {label} {required && <span className="text-red-500 dark:text-red-400 ml-0.5">*</span>}
          </label>
        </div>
      </div>
      <AnimatePresence>{error && (<M.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute right-0 top-full mt-1.5 flex items-center gap-1.5 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md border border-red-100 dark:border-red-900/30 shadow-sm z-20 pointer-events-none"><AlertCircle size={12} /> {error}</M.div>)}</AnimatePresence>
     </M.div>
  );
}

// --- OTP VERIFIER BASE ---
const OtpInput: React.FC<{ 
  onVerify: (otp: string) => void, 
  onCancel: () => void,
  target: string,
  isVerifying: boolean
}> = ({ onVerify, onCancel, target, isVerifying }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 minutes
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [showDemoNotification, setShowDemoNotification] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Demo notification for usability - Triggers on mount
  useEffect(() => {
     setShowDemoNotification(true);
     const hideTimer = setTimeout(() => setShowDemoNotification(false), 5000);
     return () => clearTimeout(hideTimer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <M.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/30 relative mt-4">
      
      {/* Demo Notification Pop-up */}
      <AnimatePresence>
        {showDemoNotification && (
            <M.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute -top-16 left-0 right-0 mx-auto w-max z-50 pointer-events-none"
            >
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md text-gray-800 dark:text-white px-4 py-2.5 rounded-xl shadow-xl border border-gray-200 dark:border-white/10 flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full text-green-600 dark:text-green-400">
                    <MessageSquare size={16} />
                    </div>
                    <div>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-0.5">SMS • Now</p>
                    <p className="text-xs font-bold">Your OTP is <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">123456</span></p>
                    </div>
                </div>
            </M.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300">Verify {target}</h4>
        <button onClick={onCancel} className="text-xs text-purple-600 hover:underline">Change</button>
      </div>
      <p className="text-xs text-gray-500 mb-2">Enter the 6-digit code sent to your device.</p>
      
      <p className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded w-fit mb-4 font-mono font-bold">
         Demo Code: 123456
      </p>
      
      <div className="grid grid-cols-6 gap-2 mb-6">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={el => { inputsRef.current[idx] = el; }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-full h-12 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 focus:border-purple-600 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-purple-500/10 outline-none transition-all caret-purple-600 shadow-sm"
            disabled={isVerifying}
          />
        ))}
      </div>
      
      <button
        onClick={() => onVerify(otp.join(''))}
        disabled={isVerifying || otp.some(d => d === '')}
        className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex justify-center items-center gap-2"
      >
        {isVerifying && <Loader2 className="animate-spin" size={16} />}
        {isVerifying ? 'Verifying...' : 'Verify OTP'}
      </button>

      <div className="flex justify-between items-center text-xs">
        <span className={timer < 60 ? 'text-red-500 font-bold' : 'text-gray-500'}>
          Expires in {formatTime(timer)}
        </span>
        <button 
          type="button"
          disabled={timer > 0} 
          onClick={() => { setTimer(300); setShowDemoNotification(true); setTimeout(() => setShowDemoNotification(false), 5000); }} 
          className={`font-bold ${timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:underline'}`}
        >
          Resend Code
        </button>
      </div>
    </M.div>
  );
};

export const EmailOtpVerifier: React.FC<any> = ({ email, onEmailChange, onVerified, error, verified }) => {
  const [step, setStep] = useState<'input' | 'verify' | 'verified'>('input');
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => { if(verified) setStep('verified'); }, [verified]);

  const handleSendOtp = async () => {
    if (!PATTERNS.EMAIL.test(email)) return;
    setApiError(null);
    setStep('verify');
    
    try {
        await AuthService.sendEmailOtp(email);
    } catch (err: any) {
        setApiError(err.message || 'Failed to send OTP');
    }
  };

  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    setApiError(null);

    if (code === '123456') {
        setTimeout(() => {
            setStep('verified');
            onVerified(true);
            setIsVerifying(false);
        }, 500); 
        return;
    }

    try {
        await AuthService.verifyEmailOtp(email, code);
        setStep('verified');
        onVerified(true);
    } catch (err: any) {
        setApiError(err.message || 'Verification failed');
    } finally {
        setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {step === 'input' && (
        <div className="flex gap-2 items-start">
          <div className="flex-1">
             <AnimatedInput 
               label="Email Address" 
               placeholder="name@example.com" 
               icon={<Mail size={18} />} 
               value={email}
               onChange={(e) => { onEmailChange(e.target.value); onVerified(false); }}
               error={error || apiError || undefined}
               required
             />
          </div>
          <button 
            type="button"
            onClick={handleSendOtp}
            disabled={!PATTERNS.EMAIL.test(email)}
            className="mt-2 h-10 px-4 rounded-xl bg-purple-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30 whitespace-nowrap flex items-center justify-center gap-2"
           >
             Send OTP
          </button>
        </div>
      )}

      {step === 'verify' && (
        <>
            {apiError && <div className="text-red-500 text-xs font-bold px-4 mb-2">{apiError}</div>}
            <OtpInput 
              onVerify={handleVerify} 
              onCancel={() => setStep('input')} 
              target={email}
              isVerifying={isVerifying}
            />
        </>
      )}

      {step === 'verified' && (
        <M.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
          <div className="flex items-center gap-3">
             <SuccessTick />
             <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white">Email Address</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
             </div>
          </div>
        </M.div>
      )}
    </div>
  );
};

export const MobileOtpVerifier: React.FC<any> = ({ mobile, mobileCode, onMobileChange, onCodeChange, onVerified, error, verified }) => {
   const [step, setStep] = useState<'input' | 'verify' | 'verified'>('input');
   const [isVerifying, setIsVerifying] = useState(false);
   const [apiError, setApiError] = useState<string | null>(null);
 
   useEffect(() => { if(verified) setStep('verified'); }, [verified]);
 
   const handleSendOtp = async () => {
     if (mobile.length < 10) return;
     setApiError(null);
     setStep('verify');
     
     try {
         await AuthService.sendMobileOtp(mobile, mobileCode);
     } catch (err: any) {
         setApiError(err.message || 'Failed to send SMS');
     }
   };
 
   const handleVerify = async (code: string) => {
     setIsVerifying(true);
     setApiError(null);

    if (code === '123456') {
        setTimeout(() => {
            setStep('verified');
            onVerified(true);
            setIsVerifying(false);
        }, 500);
        return;
    }

     try {
         await AuthService.verifyMobileOtp(mobile, code);
         setStep('verified');
         onVerified(true);
     } catch (err: any) {
         setApiError(err.message || 'Invalid code');
     } finally {
         setIsVerifying(false);
     }
   };
 
   return (
     <div className="space-y-4 mb-6">
       {step === 'input' && (
         <div className="flex gap-2 items-start">
           <div className="flex-1">
              <AnimatedPhoneInput 
                label="Mobile Number" 
                value={mobile}
                countryCode={mobileCode}
                onCountryCodeChange={onCodeChange}
                onPhoneChange={onMobileChange}
                error={error || apiError || undefined}
                required
              />
           </div>
           <button 
             type="button"
             onClick={handleSendOtp}
             disabled={mobile.length < 10}
             className="mt-2 h-10 px-4 rounded-xl bg-purple-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/30 whitespace-nowrap flex items-center justify-center gap-2"
           >
              Send OTP
           </button>
         </div>
       )}
 
       {step === 'verify' && (
         <>
             {apiError && <div className="text-red-500 text-xs font-bold px-4 mb-2">{apiError}</div>}
             <OtpInput 
               onVerify={handleVerify} 
               onCancel={() => setStep('input')} 
               target={`${mobileCode} ${mobile}`} 
               isVerifying={isVerifying}
             />
         </>
       )}
 
       {step === 'verified' && (
         <M.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
           <div className="flex items-center gap-3">
              <SuccessTick />
              <div className="flex-1">
                 <p className="text-sm font-bold text-gray-900 dark:text-white">Mobile Number</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{mobileCode} {mobile}</p>
              </div>
           </div>
         </M.div>
       )}
     </div>
   );
 };

export const AadhaarVerifier: React.FC<any> = ({ aadhaar, onChange, onVerified, error, verified }) => {
   const [step, setStep] = useState<'input' | 'verify' | 'verified'>('input');
   const [isVerifying, setIsVerifying] = useState(false);
   const [apiError, setApiError] = useState<string | null>(null);
 
   useEffect(() => { if(verified) setStep('verified'); }, [verified]);
 
   const handleSendOtp = async () => {
     if (aadhaar.replace(/\s/g, '').length !== 12) return;
     setApiError(null);
     setStep('verify');
     
     try {
         await AuthService.sendAadhaarOtp(aadhaar.replace(/\s/g, ''));
     } catch (err: any) {
         setApiError(err.message || 'UIDAI Connection Failed');
     }
   };
 
   const handleVerify = async (code: string) => {
     setIsVerifying(true);
     setApiError(null);

    if (code === '123456') {
        setTimeout(() => {
            setStep('verified');
            onVerified(true);
            setIsVerifying(false);
        }, 500);
        return;
    }

     try {
         await AuthService.verifyAadhaarOtp(aadhaar.replace(/\s/g, ''), code);
         setStep('verified');
         onVerified(true);
     } catch (err: any) {
         setApiError(err.message || 'Invalid Aadhaar OTP');
     } finally {
         setIsVerifying(false);
     }
   };
 
   return (
     <div className="space-y-4 mb-6">
       {step === 'input' && (
         <div className="flex gap-2 items-start">
           <div className="flex-1">
              <AnimatedInput 
                label="Aadhaar Number (12 Digits)" 
                placeholder="XXXX XXXX XXXX" 
                icon={<Shield size={18} />} 
                value={aadhaar}
                onChange={(e) => {
                   const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                   onChange(val);
                   onVerified(false);
                }}
                error={error || apiError || undefined}
                required
              />
           </div>
           <button 
             type="button"
             onClick={handleSendOtp}
             disabled={aadhaar.length !== 12}
             className="mt-2 h-10 px-4 rounded-xl bg-orange-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-500/30 whitespace-nowrap flex items-center justify-center gap-2"
           >
              Verify ID
           </button>
         </div>
       )}
 
       {step === 'verify' && (
         <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30">
             <h4 className="text-sm font-bold text-orange-900 dark:text-orange-300 mb-2">Aadhaar Authentication</h4>
             {apiError && <div className="text-red-500 text-xs font-bold mb-2">{apiError}</div>}
             <OtpInput 
               onVerify={handleVerify} 
               onCancel={() => setStep('input')} 
               target={`UIDAI ending ${aadhaar.slice(-4)}`} 
               isVerifying={isVerifying}
             />
         </div>
       )}
 
       {step === 'verified' && (
         <M.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-900/30">
            <div className="flex items-center gap-3">
              <SuccessTick />
              <div className="flex-1">
                 <p className="text-sm font-bold text-gray-900 dark:text-white">Aadhaar Card</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">XXXX-XXXX-{aadhaar.slice(-4)}</p>
              </div>
            </div>
            <div className="text-xs text-green-600 font-bold px-2 py-1 bg-green-100 rounded">Trusted</div>
         </M.div>
       )}
     </div>
   );
 };

// --- ANIMATED SELECT ---
export const AnimatedSelect: React.FC<any & { required?: boolean }> = ({ label, options, error, icon, className, isValid, required, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);
  const [shake, setShake] = useState(false);

  useEffect(() => { setHasValue(!!props.value); }, [props.value]);
  useEffect(() => { if (error) { setShake(true); setTimeout(() => setShake(false), 500); } }, [error]);

  return (
    <M.div className={`relative mb-6 group ${className}`} animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10 ${focused ? 'text-purple-600 dark:text-gold-400' : 'text-gray-400'}`}>{icon}</div>
      <select {...props} onFocus={(e) => { setFocused(true); props.onFocus?.(e); }} onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value); props.onBlur?.(e); }} className={`w-full bg-white/60 dark:bg-black/20 backdrop-blur-xl border rounded-xl pl-12 pr-10 pt-6 pb-2 h-14 text-gray-900 dark:text-white font-medium outline-none appearance-none cursor-pointer transition-all duration-300 ${error ? 'border-red-500 shadow-sm' : isValid ? 'border-green-500/50 bg-green-50/10 dark:bg-green-900/10' : focused ? 'border-purple-600 dark:border-gold-400 bg-white dark:bg-black/40' : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/5'}`}>
        <option value="" disabled hidden></option>
        {options.map((opt:any) => (<option key={opt.value} value={opt.value} className="text-gray-900 bg-white dark:bg-gray-900 dark:text-white">{opt.label}</option>))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      <label className={`absolute left-12 transition-all duration-300 ease-out pointer-events-none origin-top-left ${focused || hasValue ? 'top-1.5 text-[10px] uppercase tracking-wider font-bold translate-y-0' : 'top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'} ${error ? 'text-red-500' : focused ? 'text-purple-600 dark:text-gold-400' : ''}`}>
         {label} {required && <span className="text-red-500 dark:text-red-400 ml-0.5">*</span>}
      </label>
       <AnimatePresence>{error && (<M.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute right-0 top-full mt-1 flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded z-20 pointer-events-none"><AlertCircle size={12} /> {error}</M.div>)}</AnimatePresence>
    </M.div>
  );
};

export const AnimatedTextArea: React.FC<any & { required?: boolean }> = ({ label, error, placeholder, isValid, required, ...props }) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value);
  const [shake, setShake] = useState(false);

  useEffect(() => { setHasValue(!!props.value); }, [props.value]);
  useEffect(() => { if (error) { setShake(true); setTimeout(() => setShake(false), 500); } }, [error]);

  return (
    <M.div className="relative mb-6" animate={{ x: shake ? [-10, 10, -10, 10, 0] : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
      <textarea {...props} onFocus={(e) => { setFocused(true); props.onFocus?.(e); }} onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value); props.onBlur?.(e); }} placeholder={focused ? placeholder : ''} className={`w-full bg-white/60 dark:bg-black/20 backdrop-blur-xl border rounded-xl px-5 pt-7 pb-3 min-h-[120px] text-gray-900 dark:text-white outline-none transition-all duration-300 focus:bg-white dark:focus:bg-black/40 placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:text-sm ${error ? 'border-red-500 shadow-sm' : isValid ? 'border-green-500/50 bg-green-50/10' : focused ? 'border-purple-600 dark:border-gold-400' : 'border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/30 hover:bg-white/80 dark:hover:bg-white/5'}`} />
      <label className={`absolute left-5 transition-all duration-300 ease-out pointer-events-none origin-top-left ${focused || hasValue ? 'top-2 text-[10px] uppercase tracking-wider font-bold translate-y-0' : 'top-4 text-sm text-gray-500 dark:text-gray-400'} ${error ? 'text-red-500' : focused ? 'text-purple-600 dark:text-gold-400' : ''}`}>
         {label} {required && <span className="text-red-500 dark:text-red-400 ml-0.5">*</span>}
      </label>
      <AnimatePresence>{error && (<M.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute right-0 top-full mt-1 flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded z-20 pointer-events-none"><AlertCircle size={12} /> {error}</M.div>)}</AnimatePresence>
    </M.div>
  );
};

// --- FILE UPLOAD ---
export const FileUpload: React.FC<{ 
  label: string; 
  accept?: string; 
  multiple?: boolean; 
  onFileSelect: (file: File) => void; 
  error?: string;
}> = ({ label, accept, multiple, onFileSelect, error }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (multiple) {
         Array.from(e.target.files).forEach(file => onFileSelect(file));
         setFileName(`${e.target.files.length} files selected`);
      } else {
         const file = e.target.files[0];
         setFileName(file.name);
         onFileSelect(file);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-white/20 hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept={accept} 
          multiple={multiple} 
          onChange={handleFileChange}
        />
        <div className="p-3 bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 group-hover:text-purple-600 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors mb-2">
           <Upload size={24} />
        </div>
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 text-center">
           {fileName || 'Click or Drag to Upload'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
           {fileName ? 'Change Selection' : 'SVG, PNG, JPG or PDF (Max 10MB)'}
        </p>
      </div>
      {error && <p className="text-xs text-red-500 font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
    </div>
  );
};

// --- TAG SELECTOR ---
export const TagSelector: React.FC<{
  label: string;
  options: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
  error?: string;
}> = ({ label, options, selected = [], onChange, error }) => {
  const toggleTag = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selected.includes(tag)
              ? 'bg-purple-600 text-white border-purple-600 shadow-md'
              : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-purple-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{error}</p>}
    </div>
  );
};

// --- RADIO GROUP ---
export const RadioGroup: React.FC<{
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}> = ({ label, options, value, onChange, error }) => {
  return (
    <div className="mb-6">
      <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{label}</label>
      <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              value === opt.value
              ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 font-bold mt-1 ml-1">{error}</p>}
    </div>
  );
};
