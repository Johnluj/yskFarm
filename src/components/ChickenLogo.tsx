import React from 'react';

interface ChickenLogoProps {
  className?: string;
  headColorClass?: string;
}

export const ChickenLogo: React.FC<ChickenLogoProps> = ({ 
  className = "w-8 h-8", 
  headColorClass = "text-primary-900" 
}) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      id="chicken-head-logo"
    >
      {/* Red Comb */}
      <path 
        d="M30 35C25 22 38 12 45 24C50 12 60 16 62 26C70 16 78 24 75 35" 
        fill="#e11d48" 
      />
      {/* Beak (Amber) */}
      <path 
        d="M70 42L86 48L68 54V42Z" 
        fill="#f59e0b" 
      />
      {/* Head and Neck Profile */}
      <path 
        d="M25 80C25 60 30 40 45 34C60 28 72 32 75 42C78 52 74 66 65 80H25Z" 
        className={headColorClass}
        fill="currentColor"
      />
      {/* Crimson Wattle */}
      <path 
        d="M62 52C67 56 65 66 58 66C51 66 53 56 62 52Z" 
        fill="#be123c" 
      />
      {/* Eye Outer */}
      <circle 
        cx="54" 
        cy="42" 
        r="4.5" 
        fill="#ffffff" 
      />
      {/* Eye Pupil */}
      <circle 
        cx="54.5" 
        cy="42.5" 
        r="2" 
        fill="#0f172a" 
      />
    </svg>
  );
};
