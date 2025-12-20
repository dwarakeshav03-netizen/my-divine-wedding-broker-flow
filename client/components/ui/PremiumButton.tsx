
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const M = motion as any;

interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'gradient';
  className?: string;
  icon?: React.ReactNode;
  width?: 'auto' | 'full';
  disabled?: boolean;
}

const PremiumButton: React.FC<PremiumButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  icon,
  width = 'auto',
  disabled
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [hover, setHover] = useState(false);
  
  // Magnetic Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseEnter = () => {
    if (!disabled && ref.current) {
        rectRef.current = ref.current.getBoundingClientRect();
        setHover(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!rectRef.current || disabled) return;
    const width = rectRef.current.width;
    const height = rectRef.current.height;
    const mouseXFromCenter = e.clientX - rectRef.current.left - width / 2;
    const mouseYFromCenter = e.clientY - rectRef.current.top - height / 2;
    
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    setHover(false);
    x.set(0);
    y.set(0);
    rectRef.current = null;
  };

  // Styles based on variant
  const baseStyles = "relative rounded-2xl font-bold tracking-wide overflow-hidden transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 border border-transparent",
    secondary: "bg-white dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 hover:border-purple-500 dark:hover:border-gold-400",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-xl",
    outline: "bg-transparent border-2 border-purple-600 dark:border-gold-400 text-purple-600 dark:text-gold-400 hover:bg-purple-50 dark:hover:bg-gold-400/10",
    gradient: "bg-gradient-to-r from-gold-400 via-orange-500 to-yellow-500 text-purple-950 shadow-lg shadow-gold-500/30"
  };

  const sizeStyles = width === 'full' ? 'w-full py-4' : 'px-8 py-3.5';

  return (
    <M.button
      ref={ref}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: hover ? rotateX : 0,
        rotateY: hover ? rotateY : 0,
        perspective: 1000,
        willChange: 'transform'
      }}
      className={`${baseStyles} ${variants[variant]} ${sizeStyles} ${className}`}
    >
      {/* Background Animations */}
      <div className="absolute inset-0 z-0">
        {variant === 'primary' && !disabled && (
          <div className="absolute inset-0 bg-[length:200%_auto] animate-gradient-x opacity-100" />
        )}
        {variant === 'gradient' && !disabled && (
          <div className="absolute inset-0 bg-gradient-to-r from-gold-300 via-orange-400 to-yellow-400 bg-[length:200%_auto] animate-gradient-x opacity-100" />
        )}
        
        {/* Shine Effect */}
        {!disabled && (
           <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
        )}
        
        {/* Glow on Hover */}
        <M.div 
          animate={{ opacity: hover ? 0.4 : 0 }}
          className="absolute inset-0 bg-white mix-blend-overlay transition-opacity duration-300"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        <div className="relative overflow-hidden h-6 flex flex-col justify-start group">
          <span className="block transform transition-transform duration-300 group-hover:-translate-y-full">
            {children}
          </span>
          <span className="absolute top-0 left-0 block transform translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200">
            {children}
          </span>
        </div>
        
        {icon && (
          <M.span
            animate={{ x: hover ? 3 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </M.span>
        )}
      </div>

      {/* Ripple Container (Visual only, implemented via CSS active states usually, adding a subtle glow here) */}
      {hover && !disabled && (
        <M.div
          layoutId="glow"
          className="absolute -inset-2 bg-purple-500/20 rounded-2xl blur-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </M.button>
  );
};

export default PremiumButton;
