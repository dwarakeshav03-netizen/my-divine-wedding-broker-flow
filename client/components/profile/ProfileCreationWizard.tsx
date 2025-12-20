
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, MapPin, Phone, Camera, CheckCircle, ArrowLeft, ArrowRight, 
  Sparkles, Star, Heart, Moon, Shield, Calendar, Home, Mail, Lock, 
  ChevronDown, Crown, Check, Users, Zap
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { 
  AnimatedInput, AnimatedSelect, FileUpload, AnimatedPhoneInput, AnimatedTextArea, 
  EmailOtpVerifier, MobileOtpVerifier, AadhaarVerifier 
} from '../profile/ProfileFormElements';
import { validateField, calculateAge } from '../../utils/validation';
import { RAASI_LIST, NAKSHATRA_LIST } from '../../constants';
import Logo from '../ui/Logo';
import useTranslation from '../../hooks/useTranslation';

// ... interface and constants ...
interface ProfileCreationWizardProps {
  onComplete: () => void;
  onExit?: () => void; 
}

// --- CONFIGURATION ---
const STEPS = [
  { id: 'intent', title: 'The Purpose', icon: Heart },
  { id: 'identity', title: 'Basic Identity', icon: User },
  { id: 'contact', title: 'Secure Contact', icon: Lock },
  { id: 'roots', title: 'Cultural Roots', icon: Home },
  { id: 'astrology', title: 'Divine Chart', icon: Moon },
  { id: 'context', title: 'Life Context', icon: Sparkles },
  { id: 'trust', title: 'Trust & Safety', icon: Shield },
];

const INTENT_OPTIONS = [
  { id: 'Myself', label: 'Myself', icon: User, desc: 'Searching for my soulmate' },
  { id: 'Son', label: 'My Son', icon: Crown, desc: 'Seeking a bride for my son' },
  { id: 'Daughter', label: 'My Daughter', icon: Crown, desc: 'Seeking a groom for my daughter' },
  { id: 'Friend', label: 'A Friend', icon: Heart, desc: 'Helping a dear friend' },
  { id: 'Relative', label: 'Relative', icon: Users, desc: 'For a family member' }, 
];

const MARITAL_STATUS_OPTIONS = [
  { value: 'Never Married', label: 'Never Married', desc: 'First time' },
  { value: 'Late Marriage', label: 'Late Marriage', desc: 'Waiting for the right one' },
  { value: 'Divorced', label: 'Divorced', desc: 'Ready for a new chapter' },
  { value: 'Widowed', label: 'Widowed', desc: 'Seeking companionship' }
];

const ProfileCreationWizard: React.FC<ProfileCreationWizardProps> = ({ onComplete, onExit }) => {
  const { t } = useTranslation();
  
  // Navigation State
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    createdFor: '',
    firstName: '', 
    lastName: '', 
    dob: '', 
    age: 0,
    gender: '', 
    location: '', 
    address: '',
    
    // Contact
    email: '', 
    mobileCode: '+91', 
    mobile: '', 
    
    // Astrology
    timeOfBirth: '', 
    placeOfBirth: '', 
    star: '', 
    raasi: '', 
    lagnam: '',
    
    // Roots
    religion: '', 
    caste: '', 
    subCaste: '', 
    community: '', 
    poorviham: '',
    kuladeivam: '',
    
    // Context
    maritalStatus: '',
    disabilities: 'No', 
    disabilityDetails: '',
    
    // Trust
    photo: null as File | null,
    aadhaarNumber: '',
  });

  // Verification States
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIdx]);

  // DEMO FILL FUNCTION
  const handleDemoFill = () => {
    setFormData({
      createdFor: 'Myself',
      firstName: 'Karthik', 
      lastName: 'Ramaswamy', 
      dob: '1995-08-20', 
      age: 29,
      gender: 'Male', 
      location: 'Chennai', 
      address: '12, South Boag Road, T. Nagar, Chennai',
      
      // Contact
      email: 'karthik.demo@divine.com', 
      mobileCode: '+91', 
      mobile: '9876543210', 
      
      // Astrology
      timeOfBirth: '10:30', 
      placeOfBirth: 'Chennai', 
      star: 'Rohini', 
      raasi: 'Rishabam', 
      lagnam: 'Simha',
      
      // Roots
      religion: 'Hindu', 
      caste: 'Iyer', 
      subCaste: 'Vadakalai', 
      community: 'Brahmin', 
      poorviham: 'Thanjavur',
      kuladeivam: 'Madurai Veeran',
      
      // Context
      maritalStatus: 'Never Married',
      disabilities: 'No', 
      disabilityDetails: '',
      
      // Trust
      photo: null, 
      aadhaarNumber: '4521 8956 3214',
    });

    // Bypass verifications
    setEmailVerified(true);
    setMobileVerified(true);
    setAadhaarVerified(true);
    
    setErrors({});
  };

  // Handlers
  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const updates: any = { [field]: value };
      if (field === 'dob') updates.age = calculateAge(value);
      return { ...prev, ...updates };
    });
    
    if (errors[field]) {
      setErrors(prev => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Skip validating optional fields on blur unless they have specific format requirements
    if (['caste', 'subCaste', 'community', 'poorviham', 'kuladeivam', 'timeOfBirth', 'placeOfBirth', 'lagnam'].includes(field)) return;

    const error = validateField(field, formData[field as keyof typeof formData] as string);
    if (error) setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Validation Logic per Step
  const validateStep = (idx: number) => {
    const newErrors: Record<string, string> = {};
    const stepId = STEPS[idx].id;

    if (stepId === 'intent' && !formData.createdFor) {
       return false;
    }

    if (stepId === 'identity') {
       if (!formData.firstName) newErrors.firstName = "Required";
       if (!formData.lastName) newErrors.lastName = "Required";
       if (!formData.dob) newErrors.dob = "Required";
       if (!formData.gender) newErrors.gender = "Required"; // STRICTLY REQUIRED
       if (!formData.location) newErrors.location = "Required";
       if (!formData.address) newErrors.address = "Required";
    }

    if (stepId === 'contact') {
       if (!emailVerified) newErrors.email = "Please verify email";
       if (!mobileVerified) newErrors.mobile = "Please verify mobile";
    }

    if (stepId === 'roots') {
       if (!formData.religion) newErrors.religion = "Required";
       // Caste is Optional
    }
    
    // Astrology is Optional
    // if (stepId === 'astrology') {} 

    if (stepId === 'context') {
        if (!formData.maritalStatus) newErrors.maritalStatus = "Required";
        if (formData.disabilities === 'Yes' && !formData.disabilityDetails) newErrors.disabilityDetails = "Please specify";
    }

    if (stepId === 'trust') {
        if (!aadhaarVerified) newErrors.aadhaarNumber = "Aadhaar verification is mandatory for safety.";
    }

    if (Object.keys(newErrors).length > 0) {
       setErrors(newErrors);
       setTouched(Object.keys(newErrors).reduce((acc, k) => ({...acc, [k]: true}), {}));
       return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStepIdx)) {
       setDirection(1);
       if (currentStepIdx === STEPS.length - 1) {
          handleSubmit();
       } else {
          setCurrentStepIdx(prev => prev + 1);
       }
    }
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStepIdx(prev => prev - 1);
  };

  const handleSubmit = async () => {
     setIsSubmitting(true);
     // Simulate API
     await new Promise(r => setTimeout(r, 2000));
     
     const fullName = `${formData.firstName} ${formData.lastName}`;
     // Save Mock Data
     const newUser = {
        id: `USR-${Date.now()}`,
        name: fullName,
        email: formData.email,
        mobile: `${formData.mobileCode} ${formData.mobile}`,
        role: 'user',
        status: 'active',
        plan: 'free',
        verified: aadhaarVerified, // SAVE VERIFICATION STATUS
        isVerified: aadhaarVerified, // Duplicate for safety in some components
        avatar: formData.photo ? URL.createObjectURL(formData.photo) : `https://ui-avatars.com/api/?name=${fullName.replace(/\s/g, '+')}&background=random&color=fff`,
        ...formData
     };
     
     const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
     localStorage.setItem('mdm_users', JSON.stringify([newUser, ...users]));
     localStorage.setItem('mdm_user_session', newUser.email);

     setIsSubmitting(false);
     setIsSuccess(true);
  };

  // --- ANIMATION VARIANTS ---
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 50 : -50, opacity: 0 }),
  };

  if (isSuccess) {
     return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-[#050505] flex items-center justify-center p-4">
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }} 
             animate={{ scale: 1, opacity: 1 }} 
             className="max-w-md w-full text-center"
           >
              <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                 className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30"
              >
                 <CheckCircle size={48} className="text-white" strokeWidth={3} />
              </motion.div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-8">Profile Created Successfully</h2>
              <PremiumButton onClick={onComplete} width="full" variant="gradient">Enter Dashboard</PremiumButton>
           </motion.div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#050505] pt-24 pb-12 transition-colors duration-500">
       {/* ... Ambient Background and Header Progress (same as original) ... */}
       <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[100px]" />
       </div>

       <div className="container mx-auto px-4 max-w-4xl relative z-10">
          
          {/* Header Progress */}
          <div className="flex items-center justify-between mb-8">
             {currentStepIdx > 0 ? (
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                   <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
             ) : (
                <div className="w-10" />
             )}
             
             <div className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-gold-400 mb-1">
                   Step {currentStepIdx + 1} of {STEPS.length}
                </span>
                <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                   {STEPS[currentStepIdx].title}
                </h2>
             </div>

             <div className="flex items-center gap-2">
                 <button 
                    onClick={handleDemoFill}
                    className="hidden md:flex items-center gap-1 text-xs font-bold bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-lg hover:bg-yellow-200 transition-colors"
                    title="Auto-fill mock data for testing"
                 >
                    <Zap size={14} /> Demo Fill
                 </button>

                 <button onClick={onExit} className="text-sm font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    Exit
                 </button>
             </div>
          </div>

          <div className="h-1 w-full bg-gray-200 dark:bg-white/10 rounded-full mb-12 overflow-hidden">
             <motion.div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStepIdx + 1) / STEPS.length) * 100}%` }}
                transition={{ duration: 0.5 }}
             />
          </div>

          {/* Main Card Content */}
          <div className="min-h-[500px] relative">
             <AnimatePresence custom={direction} mode="wait">
                <motion.div
                   key={currentStepIdx}
                   custom={direction}
                   variants={variants}
                   initial="enter"
                   animate="center"
                   exit="exit"
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   className="w-full"
                >
                   
                   {/* STEP 1: INTENT */}
                   {STEPS[currentStepIdx].id === 'intent' && (
                      <div className="space-y-8">
                         <div className="text-center mb-10">
                            <h3 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
                               Who is this profile for?
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                               We'll customize the experience based on your selection.
                            </p>
                         </div>
                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {INTENT_OPTIONS.map((opt) => (
                               <motion.button
                                  key={opt.id}
                                  whileHover={{ y: -5, scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => { handleChange('createdFor', opt.id); handleNext(); }}
                                  className={`
                                     flex flex-col items-center p-6 rounded-[2rem] border-2 transition-all duration-300 h-full
                                     ${formData.createdFor === opt.id 
                                        ? 'bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-500/30' 
                                        : 'bg-white dark:bg-white/5 border-transparent hover:border-purple-200 dark:hover:border-white/20 text-gray-600 dark:text-gray-300'}
                                  `}
                               >
                                  <div className={`p-4 rounded-full mb-4 ${formData.createdFor === opt.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'}`}>
                                     <opt.icon size={24} />
                                  </div>
                                  <span className="font-bold text-sm mb-1">{opt.label}</span>
                                  <span className={`text-[10px] text-center leading-tight ${formData.createdFor === opt.id ? 'text-purple-200' : 'text-gray-400'}`}>
                                     {opt.desc}
                                  </span>
                               </motion.button>
                            ))}
                         </div>
                      </div>
                   )}

                   {/* STEP 2: IDENTITY */}
                   {STEPS[currentStepIdx].id === 'identity' && (
                      <div className="max-w-2xl mx-auto space-y-6">
                         <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                               <User className="text-purple-600" /> Identity Details
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                               <AnimatedInput label="First Name" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} onBlur={() => handleBlur('firstName')} error={touched.firstName ? errors.firstName : undefined} required />
                               <AnimatedInput label="Last Name" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} onBlur={() => handleBlur('lastName')} error={touched.lastName ? errors.lastName : undefined} required />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                               <AnimatedInput label="Date of Birth" type="date" value={formData.dob} onChange={e => handleChange('dob', e.target.value)} onBlur={() => handleBlur('dob')} error={touched.dob ? errors.dob : undefined} required />
                               <div className="space-y-2">
                                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gender <span className="text-red-500">*</span></label>
                                  <div className="flex bg-white dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                                     {['Male', 'Female'].map(g => (
                                        <button 
                                           key={g} 
                                           onClick={() => handleChange('gender', g)}
                                           className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${formData.gender === g ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                        >
                                           {g}
                                        </button>
                                     ))}
                                  </div>
                                  {errors.gender && <p className="text-xs text-red-500 font-bold ml-1">{errors.gender}</p>}
                               </div>
                            </div>
                            <AnimatedInput label="Current Location (City)" value={formData.location} onChange={e => handleChange('location', e.target.value)} error={touched.location ? errors.location : undefined} icon={<MapPin size={18} />} required />
                            <AnimatedTextArea label="Full Address" value={formData.address} onChange={e => handleChange('address', e.target.value)} error={touched.address ? errors.address : undefined} required />
                         </div>
                      </div>
                   )}

                   {/* STEP 3: CONTACT VERIFICATION */}
                   {STEPS[currentStepIdx].id === 'contact' && (
                      <div className="max-w-2xl mx-auto space-y-6">
                         <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                               <Lock className="text-green-600" /> Secure Verification
                            </h3>
                            <p className="text-sm text-gray-500 mb-8">
                               We verify contact details to ensure a safe community. Your details are private by default.
                            </p>
                            
                            <MobileOtpVerifier 
                               mobile={formData.mobile} 
                               mobileCode={formData.mobileCode}
                               onMobileChange={v => handleChange('mobile', v)}
                               onCodeChange={v => handleChange('mobileCode', v)}
                               onVerified={setMobileVerified}
                               verified={mobileVerified}
                               error={errors.mobile}
                            />

                            <div className="my-6 border-t border-gray-200 dark:border-white/10" />

                            <EmailOtpVerifier 
                               email={formData.email}
                               onEmailChange={v => handleChange('email', v)}
                               onVerified={setEmailVerified}
                               verified={emailVerified}
                               error={errors.email}
                            />
                         </div>
                      </div>
                   )}

                   {/* STEP 4: ROOTS */}
                   {STEPS[currentStepIdx].id === 'roots' && (
                      <div className="max-w-2xl mx-auto space-y-6">
                         <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                               <Home className="text-orange-600" /> Cultural Background
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                               <AnimatedSelect 
                                  label="Religion" 
                                  value={formData.religion}
                                  onChange={e => handleChange('religion', e.target.value)}
                                  options={['Hindu', 'Christian', 'Muslim', 'Jain', 'Sikh', 'Buddhist'].map(r => ({ label: r, value: r }))}
                                  error={touched.religion ? errors.religion : undefined}
                                  required
                               />
                               <AnimatedInput 
                                  label="Caste (Optional)" 
                                  value={formData.caste} 
                                  onChange={e => handleChange('caste', e.target.value)}
                                  error={touched.caste ? errors.caste : undefined}
                               />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                               <AnimatedInput label="Sub Caste (Optional)" value={formData.subCaste} onChange={e => handleChange('subCaste', e.target.value)} />
                               <AnimatedInput label="Community / Sect (Optional)" value={formData.community} onChange={e => handleChange('community', e.target.value)} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                               <AnimatedInput label="Poorviham (Optional)" value={formData.poorviham} onChange={e => handleChange('poorviham', e.target.value)} />
                               <AnimatedInput label="Kuladeivam (Optional)" value={formData.kuladeivam} onChange={e => handleChange('kuladeivam', e.target.value)} />
                            </div>
                         </div>
                      </div>
                   )}

                   {/* STEP 5: ASTROLOGY */}
                   {STEPS[currentStepIdx].id === 'astrology' && (
                      <div className="max-w-2xl mx-auto space-y-6">
                         <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                               <Moon className="text-purple-600" /> Horoscope Details
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">Essential for accurate matching compatibility.</p>

                            <div className="grid md:grid-cols-2 gap-6">
                               <AnimatedInput 
                                  label="Time of Birth (Optional)" type="time" 
                                  value={formData.timeOfBirth} 
                                  onChange={e => handleChange('timeOfBirth', e.target.value)}
                               />
                               <AnimatedInput 
                                  label="Place of Birth (Optional)" 
                                  value={formData.placeOfBirth} 
                                  onChange={e => handleChange('placeOfBirth', e.target.value)}
                                  icon={<MapPin size={18} />}
                               />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mt-4">
                               <AnimatedSelect 
                                  label="Raasi (Moon Sign) - Optional"
                                  value={formData.raasi}
                                  onChange={e => handleChange('raasi', e.target.value)}
                                  options={RAASI_LIST.map(r => ({ label: `${r.english} (${r.tamil})`, value: r.english }))}
                               />
                               <AnimatedSelect 
                                  label="Nakshatra (Star) - Optional"
                                  value={formData.star}
                                  onChange={e => handleChange('star', e.target.value)}
                                  options={NAKSHATRA_LIST.map(n => ({ label: n.english, value: n.english }))}
                               />
                            </div>
                            
                            <AnimatedInput label="Lagnam (Ascendant) - Optional" value={formData.lagnam} onChange={e => handleChange('lagnam', e.target.value)} />
                         </div>
                      </div>
                   )}

                   {/* STEP 6: CONTEXT */}
                   {STEPS[currentStepIdx].id === 'context' && (
                      <div className="max-w-2xl mx-auto space-y-6">
                         <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                               <Sparkles className="text-pink-600" /> Life Context
                            </h3>
                            
                            <div className="space-y-4 mb-8">
                               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Marital Status <span className="text-red-500">*</span></label>
                               <div className="grid grid-cols-2 gap-3">
                                  {MARITAL_STATUS_OPTIONS.map(opt => (
                                     <button
                                        key={opt.value}
                                        onClick={() => handleChange('maritalStatus', opt.value)}
                                        className={`p-4 rounded-2xl border text-left transition-all ${
                                           formData.maritalStatus === opt.value
                                           ? 'bg-purple-600 border-purple-600 text-white shadow-lg'
                                           : 'bg-white dark:bg-black/20 border-gray-200 dark:border-white/10 hover:border-purple-300'
                                        }`}
                                     >
                                        <div className="font-bold text-sm">{opt.label}</div>
                                        <div className={`text-[10px] mt-1 ${formData.maritalStatus === opt.value ? 'text-purple-200' : 'text-gray-400'}`}>{opt.desc}</div>
                                     </button>
                                  ))}
                               </div>
                               {errors.maritalStatus && <p className="text-xs text-red-500 font-bold ml-1">{errors.maritalStatus}</p>}
                            </div>

                            <div className="space-y-4">
                               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Person with Disability?</label>
                               <div className="flex gap-4">
                                  {['No', 'Yes'].map(opt => (
                                     <label key={opt} className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 flex-1 hover:border-purple-400 transition-colors">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.disabilities === opt ? 'border-purple-600' : 'border-gray-400'}`}>
                                           {formData.disabilities === opt && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                                        </div>
                                        <span className="font-bold text-sm">{opt}</span>
                                        <input type="radio" className="hidden" checked={formData.disabilities === opt} onChange={() => handleChange('disabilities', opt)} />
                                     </label>
                                  ))}
                               </div>
                            </div>
                            
                            <AnimatePresence>
                               {formData.disabilities === 'Yes' && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }} 
                                    animate={{ height: 'auto', opacity: 1 }} 
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-4"
                                  >
                                     <AnimatedTextArea 
                                        label="Please describe disability details (Empathetic view)" 
                                        value={formData.disabilityDetails} 
                                        onChange={e => handleChange('disabilityDetails', e.target.value)}
                                        error={errors.disabilityDetails}
                                     />
                                  </motion.div>
                               )}
                            </AnimatePresence>
                         </div>
                      </div>
                   )}

                   {/* STEP 7: TRUST */}
                   {STEPS[currentStepIdx].id === 'trust' && (
                      <div className="max-w-2xl mx-auto space-y-6">
                         <div className="bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                               <Shield className="text-green-600" /> Trust & Authenticity
                            </h3>
                            <p className="text-sm text-gray-500 mb-8">
                               We require valid identification to maintain a safe platform. Your ID details are encrypted and never shown to others.
                            </p>
                            
                            <div className="mb-8">
                               <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Profile Photo</h4>
                               <div className="flex items-center gap-6">
                                  <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center overflow-hidden relative">
                                     {formData.photo ? (
                                        <img src={URL.createObjectURL(formData.photo)} className="w-full h-full object-cover" />
                                     ) : (
                                        <Camera className="text-gray-400" />
                                     )}
                                  </div>
                                  <div className="flex-1">
                                     <FileUpload 
                                        label="Upload Photo" 
                                        accept="image/*" 
                                        onFileSelect={f => handleChange('photo', f)} 
                                        error={errors.photo}
                                     />
                                     <p className="text-[10px] text-gray-400 mt-1">
                                        Photos build trust. Profiles with photos get 10x more responses.
                                     </p>
                                  </div>
                               </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                               <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">Government ID</h4>
                               <AadhaarVerifier 
                                  aadhaar={formData.aadhaarNumber} 
                                  onChange={v => handleChange('aadhaarNumber', v)}
                                  onVerified={setAadhaarVerified}
                                  verified={aadhaarVerified}
                                  error={errors.aadhaarNumber}
                                  required // Ensure indicator shows up here if needed by prop drilling
                               />
                            </div>
                         </div>
                      </div>
                   )}

                </motion.div>
             </AnimatePresence>
             
             {/* Sticky Footer Navigation */}
             <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-lg border-t border-gray-200 dark:border-white/10 z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                   {currentStepIdx > 0 ? (
                      <button 
                         onClick={handleBack}
                         className="px-6 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 transition-colors"
                      >
                         Back
                      </button>
                   ) : (
                      <div />
                   )}
                   
                   <PremiumButton 
                      onClick={handleNext} 
                      disabled={isSubmitting}
                      className="!px-10 !py-3 shadow-xl shadow-purple-500/20"
                      variant="gradient"
                      icon={currentStepIdx === STEPS.length - 1 ? (isSubmitting ? <span className="animate-spin">⏳</span> : <CheckCircle />) : <ArrowRight />}
                   >
                      {currentStepIdx === STEPS.length - 1 ? (isSubmitting ? 'Creating...' : 'Create Profile') : 'Next Step'}
                   </PremiumButton>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};

export default ProfileCreationWizard;
