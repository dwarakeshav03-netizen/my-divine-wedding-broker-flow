
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Key, Eye, EyeOff, X, Fingerprint, ChevronRight, Activity, CheckCircle, AlertTriangle, Crown } from 'lucide-react';
import { MOCK_SYSTEM_ADMINS } from '../utils/adminData';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void; // Standard Admin success
  onSuperAdminSuccess?: () => void; // New Super Admin success
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onLoginSuccess, onSuperAdminSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'super_success'>('idle');
  const [adminId, setAdminId] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [detectedRole, setDetectedRole] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Polygonal Background Animation
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    interface Point {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
    }

    const points: Point[] = [];
    const POINT_COUNT = 60;
    const CONNECTION_DISTANCE = 150;

    for (let i = 0; i < POINT_COUNT; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: 'rgba(100, 255, 218, 0.5)'
      });
    }

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      points.forEach((point, i) => {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;

        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dx = point.x - p2.x;
          const dy = point.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.strokeStyle = point.color.replace('0.5', `${0.1 * (1 - dist / CONNECTION_DISTANCE)}`);
            ctx.lineWidth = 1;
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setDetectedRole(null);
    
    setTimeout(() => {
      // 1. Check Super Admin Hardcoded
      if (adminId === 'SUPER_ADMIN' && adminKey === 'godmode123') {
          setStatus('super_success');
          localStorage.setItem('mdm_admin_role', 'Super Admin');
          setTimeout(() => {
            resetForm();
            if (onSuperAdminSuccess) onSuperAdminSuccess();
            else onClose();
          }, 1500);
          return;
      }
      
      // 2. Check against MOCK_SYSTEM_ADMINS
      const foundAdmin = MOCK_SYSTEM_ADMINS.find(
          (a) => (a.email === adminId || a.id === adminId) && (a.password === adminKey || adminKey === 'secure123')
      );

      if (foundAdmin) {
          if (foundAdmin.status !== 'Active') {
              setStatus('error');
              setIsLoading(false);
              alert("Account is " + foundAdmin.status);
              return;
          }

          setStatus('success');
          setDetectedRole(foundAdmin.role);
          localStorage.setItem('mdm_admin_role', foundAdmin.role);
          localStorage.setItem('mdm_admin_name', foundAdmin.name);
          
          setTimeout(() => {
            resetForm();
            if (onLoginSuccess) onLoginSuccess();
            else onClose();
          }, 1500);
      } else {
        setStatus('error');
        setIsLoading(false);
      }
    }, 1500);
  };

  const resetForm = () => {
    setIsLoading(false);
    setStatus('idle');
    setAdminId('');
    setAdminKey('');
    setDetectedRole(null);
  };

  const fillDemo = (email: string) => {
    setAdminId(email);
    setAdminKey('password123');
  };
  
  const fillSuperDemo = () => {
    setAdminId('SUPER_ADMIN');
    setAdminKey('godmode123');
  }

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 text-white font-sans"
      >
        {/* Animated Background */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-0 pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Login Card */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.8, bounce: 0.2 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Decorative Security Elements */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 text-cyan-400/50">
             <Shield size={16} /> <span className="text-xs tracking-[0.3em] uppercase">Secure Admin Gateway</span>
          </div>

          <div className={`backdrop-blur-xl border rounded-2xl p-8 shadow-2xl relative overflow-hidden group transition-colors duration-500 ${status === 'super_success' ? 'bg-[#1a1a00]/80 border-yellow-500/30' : 'bg-[#0a0a0a]/80 border-white/10'}`}>
            
            {/* Scanning Light Effect */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-transparent opacity-50 animate-shine ${status === 'super_success' ? 'via-yellow-500' : 'via-cyan-500'}`} />
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 pointer-events-none" />

            {/* Header */}
            <div className="mb-10 text-center relative">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 relative ${
                    status === 'super_success' ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-cyan-900/20 border border-cyan-500/30'
                }`}
              >
                {status === 'success' || status === 'super_success' ? (
                  <CheckCircle className={`${status === 'super_success' ? 'text-yellow-500' : 'text-green-500'} w-8 h-8`} />
                ) : (
                  <Fingerprint className="text-cyan-400 w-8 h-8" />
                )}
                <div className={`absolute inset-0 rounded-full border ${status === 'super_success' ? 'border-yellow-500/20' : 'border-cyan-500/20'} ${isLoading ? 'animate-ping' : ''}`} />
              </motion.div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                 {status === 'super_success' ? <span className="text-yellow-500">SUPER ADMIN</span> : 'Admin Portal'}
              </h2>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <Activity size={12} className="text-green-500" /> System Operational
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Administrator ID / Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                    <Shield size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all duration-300"
                    placeholder="Enter Secure ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Access Key</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                    <Key size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-900/5 transition-all duration-300"
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {status === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-red-400 text-xs justify-center bg-red-900/10 p-2 rounded"
                >
                  <AlertTriangle size={14} /> Access Denied. Invalid Credentials.
                </motion.div>
              )}
              
              {(status === 'success' || status === 'super_success') && (
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className={`flex flex-col items-center justify-center gap-1 p-3 font-bold tracking-wider uppercase ${status === 'super_success' ? 'text-yellow-400' : 'text-green-400'}`}
                >
                   <div className="flex items-center gap-2">
                      {status === 'super_success' ? <Crown size={18} /> : <CheckCircle size={18} />} Access Granted
                   </div>
                   {detectedRole && <span className="text-[10px] opacity-70">Role: {detectedRole}</span>}
                </motion.div>
              )}

              {/* Submit Button */}
              {status !== 'success' && status !== 'super_success' && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className={`w-full relative py-3.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {isLoading ? (
                    <span className="animate-pulse">Authenticating...</span>
                  ) : (
                    <>
                      <span>Authenticate</span> <ChevronRight size={16} />
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                </motion.button>
              )}

            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-[9px] text-gray-600 uppercase tracking-widest">Select Demo Role</p>
              <div className="grid grid-cols-2 gap-2">
                 <button type="button" onClick={() => fillDemo('admin@divine.com')} className="demo-btn text-cyan-400 border-cyan-500/30 bg-cyan-950/30">Admin</button>
                 <button type="button" onClick={fillSuperDemo} className="demo-btn text-yellow-400 border-yellow-500/30 bg-yellow-950/30">Super Admin</button>
              </div>
            </div>

            <style>{`
              .demo-btn {
                @apply px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all duration-300 hover:brightness-125
              }
            `}</style>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminLogin;
