import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

export default function Logo({
  className = '',
  size = 'md',
  showText = true,
  textClassName = '',
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-sm' },
    md: { icon: 'w-8 h-8', text: 'text-base' },
    lg: { icon: 'w-10 h-10', text: 'text-lg' },
    xl: { icon: 'w-12 h-12', text: 'text-xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Anjaneya Gold Emblem Vector */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSize.icon} flex-shrink-0 transition-transform hover:scale-105`}
      >
        {/* Background shield glow / container */}
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5D061" />
            <stop offset="50%" stopColor="#E5B33A" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>

        {/* Left & Right Figure Head Circles */}
        <circle cx="36" cy="28" r="7" fill="url(#goldGradient)" />
        <circle cx="84" cy="28" r="7" fill="url(#goldGradient)" />

        {/* Outer Shield / Hexagonal Base Frame */}
        <path
          d="M 28 38 L 28 65 L 60 92 L 92 65 L 92 38 L 82 43 L 82 60 L 60 80 L 38 60 L 38 43 Z"
          fill="url(#goldGradient)"
        />

        {/* Central Arch & Flame Body */}
        <path
          d="M 60 22 C 50 36 45 52 45 68 C 45 76 52 82 60 82 C 68 82 75 76 75 68 C 75 52 70 36 60 22 Z"
          fill="url(#goldGradient)"
        />

        {/* Inner Cutout Checkmark */}
        <path
          d="M 52 56 L 58 64 L 68 48"
          stroke="#261035"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {showText && (
        <div className="flex flex-col min-w-0">
          <span className={`font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 ${currentSize.text} ${textClassName}`}>
            ANJANEYA
          </span>
          <span className="text-[9px] font-bold tracking-wider text-amber-500/80 uppercase truncate">
            Event & Volunteer AI
          </span>
        </div>
      )}
    </div>
  );
}
