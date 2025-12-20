
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, Bell, Shield, Sliders, LogOut, Save, 
  Mail, Phone, Globe, ChevronDown, CheckCircle, 
  Briefcase, Heart, Coffee, Moon, Camera, FileText, Upload, Calendar, AlertTriangle, File, Key, MapPin, Building2, Eye, UserCheck, Loader2, Home, Printer, Download
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { AnimatedInput, AnimatedTextArea, AnimatedSelect, FileUpload, TagSelector, RadioGroup, AnimatedPhoneInput } from '../profile/ProfileFormElements';
import GradientRangeSlider from '../ui/GradientRangeSlider';
import { RAASI_LIST, NAKSHATRA_LIST } from '../../constants';

interface UserSettingsProps {
    isMandatoryReset?: boolean;
    onResetComplete?: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ isMandatoryReset = false, onResetComplete }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'privacy' | 'security' | 'notifications' | 'preferences'>('profile');
  
  // Password Reset State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Save Animation State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Identity State (LOCKED FIELDS)
  const [identity, setIdentity] = useState({
      name: '', email: '', mobile: '', dob: '', gender: '', profileId: ''
  });
  
  // Avatar & Files
  const [avatar, setAvatar] = useState('');
  const [horoscopeFile, setHoroscopeFile] = useState<string | null>(null);
  const [bioDataFile, setBioDataFile] = useState<File | null>(null);
  const [familyPhoto, setFamilyPhoto] = useState<File | null>(null);

  // Full Profile Form State
  const [profileData, setProfileData] = useState<any>({
     // Address
     address: '', district: '', country: 'India', city: '', state: '', pincode: '',
     
     // Education
     education: '', 
     
     // Employment
     employmentStatus: 'Employed',
     employmentCategory: 'Private', // Private, Government, Business
     // Private
     designation: '', companyName: '', monthlySalary: '', annualSalary: '', officialAddress: '',
     // Govt
     govtType: 'State', department: '', post: '',
     // Business
     companyScale: 'Small Scale', businessType: 'Sole Proprietorship',
     
     // Horoscope
     star: '', lagnam: '', raasi: '', poorviham: '', kulaDeivam: '', timeOfBirth: '', placeOfBirth: '', dateOfBirth: '',
     
     // Optional
     caste: '', subCaste: '', community: '', religion: '', gothram: '',
     
     // Family
     fatherName: '', motherName: '', fatherOccupation: '', motherOccupation: '',
     fatherMobile: '', fatherEmail: '', motherMobile: '', motherEmail: '', // New fields
     fatherMobileCode: '+91', motherMobileCode: '+91', // Codes
     siblingsCount: '0', 
     siblingsDetails: [], // Array of objects
     
     // Lifestyle
     diet: 'Non-Veg', smoking: 'No', drinking: 'No', wakeUpTime: '', sleepTime: '',
     hobbies: '', skills: '', extraCurricular: '',
     
     bioDataText: '',
     
     // Declaration
     declarationChecked: false
  });

  const [siblingsList, setSiblingsList] = useState<any[]>([]);

  // Refs for PDF Generation
  const reportRef = useRef<HTMLDivElement>(null);

  // Load User Data
  useEffect(() => {
      const email = localStorage.getItem('mdm_user_session') || localStorage.getItem('mdm_email');
      if (email) {
          const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
          const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
          if (user) {
              setIdentity({
                  name: user.name || '',
                  email: user.email || '',
                  mobile: user.mobile || '',
                  dob: user.dob || '',
                  gender: user.gender || '',
                  profileId: user.id || 'MDM-UNKNOWN'
              });
              
              setAvatar(user.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop");
              setHoroscopeFile(user.horoscopeFile || null);

              // Merging user data
              setProfileData(prev => ({
                  ...prev,
                  ...user,
                  employmentStatus: user.employmentStatus || 'Employed',
                  employmentCategory: user.employmentCategory || 'Private',
                  fatherMobileCode: user.fatherMobileCode || '+91',
                  motherMobileCode: user.motherMobileCode || '+91',
                  declarationChecked: true // Assume checked for existing users
              }));
              
              if (user.siblingsDetails) {
                  setSiblingsList(user.siblingsDetails);
              }
          }
      }
  }, []);
  
  // Calculate Annual Salary
  useEffect(() => {
      if (profileData.monthlySalary) {
          const monthly = parseFloat(profileData.monthlySalary) || 0;
          setProfileData((prev: any) => ({ ...prev, annualSalary: (monthly * 12).toFixed(0) }));
      }
  }, [profileData.monthlySalary]);

  // Handle Sibling Count Change
  const handleSiblingsCountChange = (val: string) => {
      const count = parseInt(val) || 0;
      const newList = Array(count).fill(null).map((_, i) => siblingsList[i] || { name: '', gender: 'Male', occupation: '', maritalStatus: 'Unmarried' });
      setSiblingsList(newList);
      setProfileData((prev: any) => ({ ...prev, siblingsCount: val }));
  };

  const handleSiblingDetailChange = (index: number, field: string, val: string) => {
      const newList = [...siblingsList];
      newList[index] = { ...newList[index], [field]: val };
      setSiblingsList(newList);
  };

  const handleChange = (name: string, value: any) => {
      setProfileData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
      if (!profileData.declarationChecked) {
          alert("Please check the declaration box before saving.");
          return;
      }

      setIsSaving(true);
      setTimeout(() => {
          const email = localStorage.getItem('mdm_user_session') || localStorage.getItem('mdm_email');
          if (!email) { setIsSaving(false); return; }

          const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
          const updatedUsers = users.map((u: any) => {
              if (u.email.toLowerCase() === email.toLowerCase()) {
                  return { 
                      ...u, 
                      ...profileData,
                      siblingsDetails: siblingsList,
                      avatar: avatar,
                      horoscopeFile: horoscopeFile,
                      lastActive: 'Just now'
                  };
              }
              return u;
          });

          localStorage.setItem('mdm_users', JSON.stringify(updatedUsers));
          setIsSaving(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2500);
      }, 1500);
  };

  const generatePDF = async () => {
      if (!reportRef.current || !window.html2canvas) {
          alert("PDF Generator is initializing. Please try again.");
          return;
      }
      
      try {
          const canvas = await window.html2canvas(reportRef.current, { 
            scale: 2,
            useCORS: true, // IMPORTANT: Enables loading cross-origin images (e.g. Unsplash/Pravatar)
            allowTaint: true
          });
          const imgData = canvas.toDataURL('image/png');
          
          // Download
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `Profile_Report_${identity.name.replace(/\s/g, '_')}.png`; // Simulating PDF as Image for browser simplicity
          link.click();
          
          // "Save" to profile logic
          alert("Report Generated and Downloaded.");
          
      } catch (err) {
          console.error(err);
          alert("Failed to generate report.");
      }
  };

  // ... (Password handlers for mandatory reset) ...
  const handleMandatoryReset = () => { if(onResetComplete) onResetComplete(); };
  const handlePasswordChange = () => { setResetSuccess(true); setTimeout(() => setResetSuccess(false), 2000); };
  
  if (isMandatoryReset) {
      return (
         <div className="flex items-center justify-center min-h-[80vh]">
             <div className="p-8 bg-white dark:bg-[#121212] rounded-3xl border border-red-200">
                <h2 className="text-2xl font-bold mb-4">Security Update</h2>
                <AnimatedInput label="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" required />
                <PremiumButton onClick={handleMandatoryReset} width="full" className="mt-4">Update Password</PremiumButton>
             </div>
         </div>
      )
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full pb-20 relative">
       
       {/* Sidebar */}
       <div className="w-full md:w-72 bg-white dark:bg-[#121212] rounded-[2rem] border border-gray-200 dark:border-white/5 p-6 h-fit shrink-0 shadow-sm sticky top-24 z-20">
          <div className="flex flex-col items-center mb-8">
             <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-purple-100 dark:border-purple-900/30 mb-3 shadow-lg">
                <img src={avatar} className="w-full h-full object-cover" alt="Profile" />
             </div>
             <h3 className="font-bold text-lg text-gray-900 dark:text-white text-center">{identity.name || 'User'}</h3>
             <p className="text-xs text-gray-500 font-mono">{identity.profileId}</p>
          </div>

          <nav className="space-y-1">
             {[
               { id: 'profile', label: 'Edit Profile', icon: User },
               { id: 'privacy', label: 'Privacy & Visibility', icon: Lock },
               { id: 'security', label: 'Security', icon: Shield },
             ].map(item => (
                <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id as any)}
                   className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                      activeTab === item.id 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                      : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'
                   }`}
                >
                   <item.icon size={18} /> {item.label}
                </button>
             ))}
          </nav>
       </div>

       {/* Content Area */}
       <div className="flex-1 bg-white/60 dark:bg-[#121212]/60 backdrop-blur-xl rounded-[2.5rem] border border-gray-200 dark:border-white/5 shadow-xl overflow-hidden min-h-[800px] relative">
          <AnimatePresence mode="wait">
             
             {/* PROFILE TAB */}
             {activeTab === 'profile' && (
                <motion.div 
                   key="profile"
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} 
                   className="h-full flex flex-col"
                >
                   <div className="p-8 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center bg-white/40 dark:bg-white/[0.02] gap-4">
                      <div>
                         <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Full Profile Update</h2>
                         <p className="text-xs text-gray-500">Ensure all details are accurate.</p>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={generatePDF} className="px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors">
                            <Printer size={16} /> Generate Report
                         </button>
                         <PremiumButton 
                            onClick={handleSaveChanges} 
                            disabled={isSaving}
                            icon={isSaving ? <Loader2 className="animate-spin" size={16} /> : saveSuccess ? <CheckCircle size={16} /> : <Save size={16} />} 
                         >
                            {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Update'}
                         </PremiumButton>
                      </div>
                   </div>

                   <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                      
                      {/* Locked Identity Section */}
                      <div className="bg-gray-100 dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/5 relative">
                         <div className="absolute top-0 right-0 p-3 text-gray-400"><Lock size={16} /></div>
                         <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-500 uppercase text-xs tracking-widest"><Shield size={14} /> Pre-Filled Identity (Locked)</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80 pointer-events-none">
                            <AnimatedInput label="Full Name" value={identity.name} disabled />
                            <AnimatedInput label="Date of Birth" value={identity.dob} disabled />
                            <AnimatedInput label="Gender" value={identity.gender} disabled />
                         </div>
                      </div>

                      {/* 1. Location Details */}
                      <ProfileSection title="Address & Location" icon={<MapPin size={20} />}>
                           <div className="grid md:grid-cols-2 gap-6">
                              <div className="md:col-span-2 relative">
                                  <AnimatedTextArea label="Current Address" value={profileData.address} onChange={e => handleChange('address', e.target.value)} required />
                              </div>
                              <AnimatedInput label="City" value={profileData.city} onChange={e => handleChange('city', e.target.value)} required />
                              <AnimatedInput label="District" value={profileData.district} onChange={e => handleChange('district', e.target.value)} required />
                              <AnimatedInput label="State" value={profileData.state} onChange={e => handleChange('state', e.target.value)} required />
                              <AnimatedInput label="Country" value={profileData.country} onChange={e => handleChange('country', e.target.value)} required />
                              <AnimatedInput label="Pincode" value={profileData.pincode} onChange={e => handleChange('pincode', e.target.value)} numericOnly required />
                           </div>
                      </ProfileSection>

                      {/* 2. Professional */}
                      <ProfileSection title="Education & Employment" icon={<Briefcase size={20} />}>
                           <div className="space-y-6">
                               <AnimatedInput label="Education (All Degrees)" value={profileData.education} onChange={e => handleChange('education', e.target.value)} placeholder="e.g. B.Tech, MBA" required />
                               
                               <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                   <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Employment Status</label>
                                   <div className="flex gap-4">
                                      {['Employed', 'Unemployed'].map(s => (
                                          <label key={s} className="flex items-center gap-2 cursor-pointer">
                                              <input type="radio" checked={profileData.employmentStatus === s} onChange={() => handleChange('employmentStatus', s)} className="accent-purple-600" />
                                              <span className="text-sm font-bold">{s}</span>
                                          </label>
                                      ))}
                                   </div>
                               </div>

                               {profileData.employmentStatus === 'Employed' && (
                                   <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                       <AnimatedSelect 
                                          label="Sector" 
                                          value={profileData.employmentCategory} 
                                          options={[{value:'Private', label:'Private'}, {value:'Government', label:'Government'}, {value:'Business', label:'Business / Entrepreneur'}]} 
                                          onChange={e => handleChange('employmentCategory', e.target.value)} 
                                       />

                                       {/* Private Sector Fields */}
                                       {profileData.employmentCategory === 'Private' && (
                                           <div className="grid md:grid-cols-2 gap-6 p-4 border border-dashed border-gray-300 dark:border-white/10 rounded-xl">
                                               <AnimatedInput label="Designation" value={profileData.designation} onChange={e => handleChange('designation', e.target.value)} required />
                                               <AnimatedInput label="Company Name" value={profileData.companyName} onChange={e => handleChange('companyName', e.target.value)} required />
                                               <AnimatedInput label="Monthly Salary" value={profileData.monthlySalary} onChange={e => handleChange('monthlySalary', e.target.value)} numericOnly required />
                                               <AnimatedInput label="Annual Salary (Auto)" value={profileData.annualSalary} disabled />
                                               <div className="md:col-span-2">
                                                   <AnimatedTextArea label="Official Address" value={profileData.officialAddress} onChange={e => handleChange('officialAddress', e.target.value)} />
                                               </div>
                                           </div>
                                       )}

                                       {/* Govt Sector Fields */}
                                       {profileData.employmentCategory === 'Government' && (
                                           <div className="grid md:grid-cols-2 gap-6 p-4 border border-dashed border-blue-300 dark:border-blue-900/30 rounded-xl bg-blue-50/50 dark:bg-blue-900/10">
                                               <AnimatedSelect label="Type" value={profileData.govtType} options={[{value:'State',label:'State Govt'}, {value:'Central',label:'Central Govt'}]} onChange={e => handleChange('govtType', e.target.value)} required />
                                               <AnimatedInput label="Department" value={profileData.department} onChange={e => handleChange('department', e.target.value)} required />
                                               <AnimatedInput label="Post / Designation" value={profileData.post} onChange={e => handleChange('post', e.target.value)} required />
                                               <AnimatedInput label="Monthly Salary" value={profileData.monthlySalary} onChange={e => handleChange('monthlySalary', e.target.value)} numericOnly required />
                                               <AnimatedInput label="Annual Salary (Auto)" value={profileData.annualSalary} disabled />
                                               <div className="md:col-span-2">
                                                   <AnimatedTextArea label="Official Address" value={profileData.officialAddress} onChange={e => handleChange('officialAddress', e.target.value)} />
                                               </div>
                                           </div>
                                       )}

                                       {/* Business Fields */}
                                       {profileData.employmentCategory === 'Business' && (
                                           <div className="grid md:grid-cols-2 gap-6 p-4 border border-dashed border-amber-300 dark:border-amber-900/30 rounded-xl bg-amber-50/50 dark:bg-amber-900/10">
                                               <AnimatedInput label="Business Name" value={profileData.companyName} onChange={e => handleChange('companyName', e.target.value)} required />
                                               <AnimatedSelect label="Business Scale" value={profileData.companyScale} options={[{value:'Small Scale',label:'Small Scale'}, {value:'Medium Scale',label:'Medium Scale'}, {value:'Large Scale',label:'Large Scale'}, {value:'Multinational',label:'Multinational'}]} onChange={e => handleChange('companyScale', e.target.value)} />
                                               <AnimatedSelect label="Type" value={profileData.businessType} options={[{value:'Sole Proprietorship',label:'Sole Proprietorship'}, {value:'Partnership',label:'Partnership'}]} onChange={e => handleChange('businessType', e.target.value)} />
                                               <div className="md:col-span-2">
                                                   <AnimatedTextArea label="Official Address" value={profileData.officialAddress} onChange={e => handleChange('officialAddress', e.target.value)} />
                                               </div>
                                           </div>
                                       )}
                                   </div>
                               )}
                           </div>
                      </ProfileSection>

                      {/* 3. Horoscope (Detailed) */}
                      <ProfileSection title="Horoscope / Jathagam" icon={<Moon size={20} />}>
                           <div className="grid md:grid-cols-2 gap-6">
                              <AnimatedInput label="Star / Nakshatram" value={profileData.star} onChange={e => handleChange('star', e.target.value)} required />
                              <AnimatedInput label="Raasi" value={profileData.raasi} onChange={e => handleChange('raasi', e.target.value)} required />
                              <AnimatedInput label="Lagnam" value={profileData.lagnam} onChange={e => handleChange('lagnam', e.target.value)} />
                              <AnimatedInput label="Poorviham (Native)" value={profileData.poorviham} onChange={e => handleChange('poorviham', e.target.value)} />
                              <AnimatedInput label="Kuladeivam (Optional)" value={profileData.kulaDeivam} onChange={e => handleChange('kulaDeivam', e.target.value)} />
                              <AnimatedInput label="Time of Birth" type="time" value={profileData.timeOfBirth} onChange={e => handleChange('timeOfBirth', e.target.value)} />
                              <AnimatedInput label="Place of Birth" value={profileData.placeOfBirth} onChange={e => handleChange('placeOfBirth', e.target.value)} />
                              <AnimatedInput label="Date of Birth" type="date" value={profileData.dateOfBirth || identity.dob} onChange={e => handleChange('dateOfBirth', e.target.value)} required />
                           </div>
                           
                           <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                               <p className="text-xs font-bold text-gray-400 uppercase mb-4">Cultural Info (Optional)</p>
                               <div className="grid md:grid-cols-3 gap-6">
                                  <AnimatedInput label="Caste" value={profileData.caste} onChange={e => handleChange('caste', e.target.value)} required />
                                  <AnimatedInput label="Subcaste" value={profileData.subCaste} onChange={e => handleChange('subCaste', e.target.value)} />
                                  <AnimatedInput label="Gothram" value={profileData.gothram} onChange={e => handleChange('gothram', e.target.value)} />
                                  <AnimatedInput label="Religion" value={profileData.religion} onChange={e => handleChange('religion', e.target.value)} required />
                               </div>
                           </div>
                      </ProfileSection>
                      
                      {/* 4. Family */}
                      <ProfileSection title="Family Background" icon={<Home size={20} />}>
                           <div className="grid md:grid-cols-2 gap-6">
                              <AnimatedInput label="Father's Name" value={profileData.fatherName} onChange={e => handleChange('fatherName', e.target.value)} required />
                              <AnimatedInput label="Father's Occupation" value={profileData.fatherOccupation} onChange={e => handleChange('fatherOccupation', e.target.value)} required />
                              
                              <AnimatedPhoneInput 
                                 label="Father's Contact" 
                                 value={profileData.fatherMobile} 
                                 countryCode={profileData.fatherMobileCode}
                                 onCountryCodeChange={c => handleChange('fatherMobileCode', c)}
                                 onPhoneChange={p => handleChange('fatherMobile', p)}
                                 required
                              />
                              <AnimatedInput label="Father's Email (Optional)" value={profileData.fatherEmail} onChange={e => handleChange('fatherEmail', e.target.value)} />

                              <AnimatedInput label="Mother's Name" value={profileData.motherName} onChange={e => handleChange('motherName', e.target.value)} required />
                              <AnimatedInput label="Mother's Occupation" value={profileData.motherOccupation} onChange={e => handleChange('motherOccupation', e.target.value)} />
                              
                              <AnimatedPhoneInput 
                                 label="Mother's Contact" 
                                 value={profileData.motherMobile} 
                                 countryCode={profileData.motherMobileCode}
                                 onCountryCodeChange={c => handleChange('motherMobileCode', c)}
                                 onPhoneChange={p => handleChange('motherMobile', p)}
                                 required
                              />
                              <AnimatedInput label="Mother's Email (Optional)" value={profileData.motherEmail} onChange={e => handleChange('motherEmail', e.target.value)} />
                           </div>

                           <div className="mt-6 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                               <div className="flex items-center justify-between mb-4">
                                  <label className="text-sm font-bold">Siblings?</label>
                                  <div className="flex items-center gap-4">
                                     <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="hasSiblings" checked={parseInt(profileData.siblingsCount) > 0} onChange={() => handleSiblingsCountChange('1')} /> Yes</label>
                                     <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="hasSiblings" checked={parseInt(profileData.siblingsCount) === 0} onChange={() => handleSiblingsCountChange('0')} /> No</label>
                                  </div>
                               </div>
                               
                               {parseInt(profileData.siblingsCount) > 0 && (
                                  <div className="space-y-4 animate-in fade-in">
                                      <AnimatedInput label="Count" type="number" value={profileData.siblingsCount} onChange={e => handleSiblingsCountChange(e.target.value)} />
                                      {siblingsList.map((sib, idx) => (
                                          <div key={idx} className="p-3 border border-dashed border-gray-300 dark:border-white/10 rounded-lg grid md:grid-cols-4 gap-2">
                                              <input placeholder="Name" className="bg-transparent border-b border-gray-200 p-2 text-sm outline-none" value={sib.name} onChange={e => handleSiblingDetailChange(idx, 'name', e.target.value)} />
                                              <select className="bg-transparent border-b border-gray-200 p-2 text-sm outline-none" value={sib.gender} onChange={e => handleSiblingDetailChange(idx, 'gender', e.target.value)}><option>Male</option><option>Female</option></select>
                                              <input placeholder="Occupation" className="bg-transparent border-b border-gray-200 p-2 text-sm outline-none" value={sib.occupation} onChange={e => handleSiblingDetailChange(idx, 'occupation', e.target.value)} />
                                              <select className="bg-transparent border-b border-gray-200 p-2 text-sm outline-none" value={sib.maritalStatus} onChange={e => handleSiblingDetailChange(idx, 'maritalStatus', e.target.value)}><option>Unmarried</option><option>Married</option></select>
                                          </div>
                                      ))}
                                  </div>
                               )}
                           </div>
                      </ProfileSection>

                      {/* 5. Lifestyle */}
                      <ProfileSection title="Lifestyle & Hobbies" icon={<Coffee size={20} />}>
                           <div className="grid md:grid-cols-3 gap-6 mb-4">
                              <AnimatedSelect label="Diet" value={profileData.diet} options={[{value:'Veg',label:'Veg'}, {value:'Non-Veg',label:'Non-Veg'}]} onChange={e => handleChange('diet', e.target.value)} required />
                              <AnimatedSelect label="Smoking" value={profileData.smoking} options={[{value:'No',label:'No'}, {value:'Yes',label:'Yes'}, {value:'Occasionally',label:'Occasionally'}]} onChange={e => handleChange('smoking', e.target.value)} required />
                              <AnimatedSelect label="Drinking" value={profileData.drinking} options={[{value:'No',label:'No'}, {value:'Yes',label:'Yes'}, {value:'Occasionally',label:'Occasionally'}]} onChange={e => handleChange('drinking', e.target.value)} required />
                           </div>
                           <div className="grid md:grid-cols-2 gap-6 mb-6">
                              <AnimatedInput label="Wake Up Time" type="time" value={profileData.wakeUpTime} onChange={e => handleChange('wakeUpTime', e.target.value)} />
                              <AnimatedInput label="Sleep Time" type="time" value={profileData.sleepTime} onChange={e => handleChange('sleepTime', e.target.value)} />
                           </div>
                           <AnimatedTextArea label="Hobbies" value={profileData.hobbies} onChange={e => handleChange('hobbies', e.target.value)} placeholder="Enter hobbies..." />
                           <AnimatedInput label="Skills" value={profileData.skills} onChange={e => handleChange('skills', e.target.value)} />
                           <AnimatedInput label="Extra Curricular" value={profileData.extraCurricular} onChange={e => handleChange('extraCurricular', e.target.value)} />
                      </ProfileSection>

                      {/* 6. Uploads */}
                      <ProfileSection title="Documents & Media" icon={<Upload size={20} />}>
                          <div className="grid md:grid-cols-2 gap-6">
                              <FileUpload label="Horoscope / Jathagam" accept=".pdf,.jpg" onFileSelect={(f) => {}} />
                              <FileUpload label="Bio Data (PDF/Doc)" accept=".pdf,.doc" onFileSelect={(f) => {}} />
                              <div className="md:col-span-2">
                                  <AnimatedTextArea label="Or Type Bio Data Paragraph" value={profileData.bioDataText} onChange={e => handleChange('bioDataText', e.target.value)} />
                              </div>
                              <FileUpload label="Profile Photos (3)" multiple accept="image/*" onFileSelect={(f) => {}} />
                              <FileUpload label="Family Photo" accept="image/*" onFileSelect={(f) => {}} />
                          </div>
                      </ProfileSection>

                      {/* Declaration */}
                      <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-white/5 rounded-xl">
                          <input type="checkbox" className="w-5 h-5 accent-purple-600" checked={profileData.declarationChecked} onChange={e => handleChange('declarationChecked', e.target.checked)} />
                          <p className="text-xs font-bold text-gray-700 dark:text-gray-300">My details given all are correct to the best of my knowledge.</p>
                      </div>

                   </div>
                </motion.div>
             )}
             
             {/* SECURITY TAB (Reused) */}
             {activeTab === 'security' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8">
                   <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
                   <div className="space-y-4 max-w-md">
                      <AnimatedInput label="Current Password" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                      <AnimatedInput label="New Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                      <AnimatedInput label="Confirm" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                      <PremiumButton onClick={handlePasswordChange}>Update Password</PremiumButton>
                   </div>
                </motion.div>
             )}

             {/* Hidden Report Container for Generation */}
             <div className="absolute top-[-9999px] left-[-9999px] w-[800px] bg-white text-black p-10" ref={reportRef}>
                <h1 className="text-3xl font-bold text-center mb-6 border-b pb-4">Bio-Data</h1>
                <div className="flex gap-8 mb-8">
                   <div className="w-1/3"><img src={avatar} className="w-full rounded-lg border" /></div>
                   <div className="w-2/3 space-y-2">
                      <p><strong>Name:</strong> {identity.name}</p>
                      <p><strong>DOB:</strong> {identity.dob} ({profileData.timeOfBirth})</p>
                      <p><strong>Height:</strong> {profileData.height}</p>
                      <p><strong>Education:</strong> {profileData.education}</p>
                      <p><strong>Occupation:</strong> {profileData.occupation}</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div className="border p-4">
                      <h3 className="font-bold mb-2">Family</h3>
                      <p>Father: {profileData.fatherName} ({profileData.fatherOccupation})</p>
                      <p>Mother: {profileData.motherName} ({profileData.motherOccupation})</p>
                      <p>Siblings: {profileData.siblingsCount}</p>
                   </div>
                   <div className="border p-4">
                      <h3 className="font-bold mb-2">Horoscope</h3>
                      <p>Raasi: {profileData.raasi}</p>
                      <p>Nakshatra: {profileData.nakshatra}</p>
                      <p>Gothram: {profileData.gothram}</p>
                   </div>
                </div>
             </div>

          </AnimatePresence>
       </div>
    </div>
  );
};

const ProfileSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <div className="border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden mb-4 bg-white dark:bg-white/5">
         <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
               <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600">{icon}</div>
               <h4 className="font-bold text-gray-900 dark:text-white text-base md:text-lg">{title}</h4>
            </div>
            <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
         </button>
         <AnimatePresence>
            {isOpen && (
               <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  className="overflow-hidden"
               >
                  <div className="p-6 pt-0 border-t border-gray-100 dark:border-white/5">
                     <div className="pt-6">{children}</div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default UserSettings;
