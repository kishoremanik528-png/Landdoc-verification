import React from 'react';

const GovernmentLogo = ({ size = 48, showText = true, lightTheme = false }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      {/* Tamil Nadu Government Seal Emblem SVG */}
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: lightTheme ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
      >
        <circle cx="50" cy="50" r="46" fill="#0B3D91" stroke="#FFD700" strokeWidth="3" />
        <circle cx="50" cy="50" r="38" fill="none" stroke="#FFD700" strokeWidth="1" strokeDasharray="3 3" />
        
        {/* Gopuram Temple Tower Motif */}
        <path d="M50 18 L58 35 L42 35 Z" fill="#FFD700" />
        <rect x="44" y="35" width="12" height="28" fill="#FFD700" stroke="#0B3D91" strokeWidth="0.5" />
        <rect x="40" y="63" width="20" height="15" fill="#FFD700" />
        <rect x="47" y="68" width="6" height="10" fill="#0B3D91" />
        
        {/* Laurel Wreath Grain Ears */}
        <path d="M22 50 Q18 30 35 22" fill="none" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M78 50 Q82 30 65 22" fill="none" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />

        {/* Tamil Nadu Text Ring */}
        <text x="50" y="90" textAnchor="middle" fill="#FFD700" fontSize="7" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.5">
          தமிழ்நாடு அரசு
        </text>
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            fontSize: size > 40 ? '0.85rem' : '0.75rem', 
            fontWeight: 800, 
            color: lightTheme ? '#0F172A' : '#FFFFFF', 
            letterSpacing: '0.02em',
            lineHeight: 1.1 
          }}>
            Government of Tamil Nadu
          </span>
          <span style={{ 
            fontSize: size > 40 ? '0.7rem' : '0.65rem', 
            color: lightTheme ? '#475569' : '#93C5FD', 
            fontWeight: 600 
          }}>
            Revenue & Registration Department
          </span>
        </div>
      )}
    </div>
  );
};

export default GovernmentLogo;
