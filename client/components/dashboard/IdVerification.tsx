

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle, Upload, FileText, Lock, RefreshCw, User, Check, XCircle
} from 'lucide-react';
import PremiumButton from '../ui/PremiumButton';
import { FileUpload, AnimatedInput } from '../profile/ProfileFormElements';
import { validateField } from '../../utils/validation';

type IdType = 'aadhaar'; // Restricted
type VerificationStatus = 'idle' | 'pending' | 'under_review' | 'verified' | 'rejected';

interface IdVerificationProps {
  currentStatus?: VerificationStatus;
  onStatusChange?: (status: VerificationStatus) => void;
}

const IdVerification: React.FC<IdVerificationProps> = ({ currentStatus, onStatusChange }) => {
  const [activeId, setActiveId] = useState<IdType>('aadhaar');
  
  // Local State
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const [idNumber, setIdNumber] = useState('');
  const [nameOnId, setNameOnId] = useState('');
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
     const email = localStorage.getItem('mdm_user_session') || localStorage.getItem('mdm_email');
     if (email) {
        const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
        const user = users.find((u: any) => u.email === email);
        if (user) {
           if (user.verificationStatus) {
              setStatus(user.verificationStatus);
              if (onStatusChange) onStatusChange(user.verificationStatus);
           }
           if (user.idNumber) setIdNumber(user.idNumber);
        }
     }
  }, []);

  const handleIdUpload = (file: File, side: 'front' | 'back') => {
    if (side === 'front') setIdFront(file);
    else setIdBack(file);
    if (errors[`id${side === 'front' ? 'Front' : 'Back'}`]) {
        setErrors(prev => {
            const newErr = { ...prev };
            delete newErr[`id${side === 'front' ? 'Front' : 'Back'}`];
            return newErr;
        });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const idErr = validateField('aadhaar', idNumber);
    if (idErr) errs.idNumber = idErr;
    if (!nameOnId.trim()) errs.nameOnId = "Name on Aadhaar is required";
    if (!idFront) errs.idFront = "Front side is required";
    if (!idBack) errs.idBack = "Back side is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setStatus('pending');
    
    // Save to LS
    const email = localStorage.getItem('mdm_user_session') || localStorage.getItem('mdm_email');
    if (email) {
       const users = JSON.parse(localStorage.getItem('mdm_users') || '[]');
       const updatedUsers = users.map((u: any) => {
          if (u.email === email) {
             return {
                ...u,
                verificationStatus: 'pending',
                idType: 'aadhaar',
                idNumber: idNumber,
                nameOnId: nameOnId,
                idUrlFront: idFront ? URL.createObjectURL(idFront) : null,
                idUrlBack: idBack ? URL.createObjectURL(idBack) : null,
                submittedAt: new Date().toLocaleDateString()
             };
          }
          return u;
       });
       localStorage.setItem('mdm_users', JSON.stringify(updatedUsers));
    }
  };

  // --- VIEWS ---

  if (status === 'verified') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] border border-white/20">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-xl">
          <Shield size={48} />
        </div>
        <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">Identity Verified</h2>
        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/20 w-full max-w-md">
            <span className="text-green-600 font-bold text-lg uppercase">Aadhaar Verified</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
             <Shield className="text-purple-600" /> Aadhaar Verification
          </h2>
          <p className="text-gray-500 mt-2">Mandatory government ID verification for profile visibility.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl mb-8">
             <button className="flex-1 py-3 rounded-lg text-sm font-bold bg-white dark:bg-gray-800 text-purple-600 shadow-sm">
                Aadhaar Card
             </button>
          </div>

          <div className="space-y-6">
             <div className="grid md:grid-cols-2 gap-6">
                <AnimatedInput 
                    label="Aadhaar Number" 
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="0000 0000 0000"
                    error={errors.idNumber}
                />
                <AnimatedInput 
                    label="Name on Aadhaar" 
                    value={nameOnId} 
                    onChange={(e) => setNameOnId(e.target.value)}
                    placeholder="Full Name"
                    error={errors.nameOnId}
                />
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <div>
                   <FileUpload 
                      label="Aadhaar Front Side" 
                      accept="image/*" 
                      onFileSelect={(f) => handleIdUpload(f, 'front')} 
                      error={errors.idFront}
                   />
                   {idFront && <div className="mt-2 text-xs text-green-600 font-bold"><Check size={12} /> Uploaded</div>}
                </div>
                <div>
                   <FileUpload 
                      label="Aadhaar Back Side" 
                      accept="image/*" 
                      onFileSelect={(f) => handleIdUpload(f, 'back')} 
                      error={errors.idBack}
                   />
                   {idBack && <div className="mt-2 text-xs text-green-600 font-bold"><Check size={12} /> Uploaded</div>}
                </div>
             </div>

             <div className="pt-6">
                <PremiumButton onClick={handleSubmit} width="full" variant="gradient" icon={<Check />}>
                  {status === 'pending' ? 'Verification Pending...' : 'Submit Aadhaar'}
                </PremiumButton>
             </div>
          </div>
       </div>
    </div>
  );
};

export default IdVerification;
