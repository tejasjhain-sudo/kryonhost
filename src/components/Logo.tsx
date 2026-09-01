import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official KryonHost Logo Emblem */}
      <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="logoCyanLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0096C7" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="logoNavyLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E2D44" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Top Navy Polygon Facet */}
          <path d="M24 20 L44 20 L32 40 L18 40 Z" fill="url(#logoNavyLight)" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Vibrant Electric Cyan Chevron Slash */}
          <path d="M16 43 L30 52 L72 20 L62 30 L30 62 L16 52 Z" fill="url(#logoCyanLight)" stroke="#0096C7" strokeWidth="1" />
          
          {/* Lower Navy Chevron */}
          <path d="M15 56 L30 66 L76 22 L77 32 L30 75 L14 65 Z" fill="url(#logoNavyLight)" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Bottom Right Arm */}
          <path d="M38 60 L70 85 L52 85 L38 72 Z" fill="url(#logoNavyLight)" stroke="#0F172A" strokeWidth="1.5" />
          
          {/* Lower Left Segment */}
          <path d="M13 69 L30 79 L25 86 L13 77 Z" fill="url(#logoNavyLight)" stroke="#0F172A" strokeWidth="1.5" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight text-[#0F172A] ${textClasses[size]}`}>
            Kryon<span className="text-[#0096C7]">Host</span>
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-[#E0F2FE] text-[#0096C7] border border-[#0096C7]/30 rounded">
            PRE-LAUNCH
          </span>
        </div>
      )}
    </div>
  );
};
