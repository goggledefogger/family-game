import React from 'react';

const TreasureChest = ({ size = 24, className = "", ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none"
      className={className}
      {...props}
    >
      {/* Defs for the glowing and animation effects */}
      <defs>
        <radialGradient id="glowingLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.9">
            <animate attributeName="stopColor" values="#FFF7D6;#FFE08A;#FFF7D6" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="30%" stopColor="#FFEAA7" stopOpacity="0.6">
            <animate attributeName="stopColor" values="#FFEAA7;#FFD700;#FFEAA7" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>
      </defs>
      
      {/* Whole chest container with subtle shake animation */}
      <g id="chest">
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="0,0; 0.3,0.2; 0,-0.2; -0.3,0.1; 0,0" 
          dur="5s" 
          repeatCount="indefinite" 
        />
        
        {/* Chest bottom */}
        <path d="M22 42 L22 80 C22 82, 24 84, 26 84 L74 84 C76 84, 78 82, 78 80 L78 42" fill="#614124" stroke="currentColor" strokeWidth="2.5" />
        
        {/* Light glow coming from inside the chest with pulsing animation */}
        <ellipse cx="50" cy="42" rx="25" ry="10" fill="url(#glowingLight)" filter="url(#blur)">
          <animate 
            attributeName="ry" 
            values="10;12;10" 
            dur="2.5s" 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            values="0.8;1;0.8" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </ellipse>
        
        {/* Subtle light beams with flickering animation */}
        <path d="M38 38 L35 30" stroke="#FFEAA7" strokeWidth="0.7" opacity="0.6">
          <animate 
            attributeName="opacity" 
            values="0.3;0.7;0.3" 
            dur="3.7s" 
            repeatCount="indefinite" 
          />
        </path>
        <path d="M50 38 L50 28" stroke="#FFEAA7" strokeWidth="0.7" opacity="0.6">
          <animate 
            attributeName="opacity" 
            values="0.4;0.8;0.4" 
            dur="2.9s" 
            repeatCount="indefinite" 
          />
        </path>
        <path d="M62 38 L65 30" stroke="#FFEAA7" strokeWidth="0.7" opacity="0.6">
          <animate 
            attributeName="opacity" 
            values="0.5;0.7;0.5" 
            dur="3.3s" 
            repeatCount="indefinite" 
          />
        </path>
        
        {/* Slightly open lid with subtle movement */}
        <path d="M22 42 C22 30, 78 30, 78 42" fill="#472D1C" stroke="currentColor" strokeWidth="2.5" transform="rotate(-5 50 42)">
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            values="-5 50 42;-5.5 50 42;-5 50 42" 
            dur="4s" 
            repeatCount="indefinite" 
            additive="sum"
          />
        </path>
        
        {/* Inner edge of the lid opening with glowing effect */}
        <path d="M25 42 L75 42" stroke="#FFEAA7" strokeWidth="1" opacity="0.8">
          <animate 
            attributeName="opacity" 
            values="0.6;0.9;0.6" 
            dur="2s" 
            repeatCount="indefinite" 
          />
        </path>
        
        {/* Faded/worn metal band */}
        <path d="M22 62 L78 62" stroke="#8A7256" strokeWidth="3" strokeDasharray="2,1" />
        
        {/* Ancient lock with mysterious symbol */}
        <rect x="45" y="37" width="10" height="15" rx="1" ry="1" fill="#8A7256" stroke="currentColor" strokeWidth="1" transform="rotate(-5 50 42)">
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            values="-5 50 42;-5.5 50 42;-5 50 42" 
            dur="4s" 
            repeatCount="indefinite" 
            additive="sum"
          />
        </rect>
        <path d="M48 45 L52 45 M50 42 L50 48" stroke="currentColor" strokeWidth="1" transform="rotate(-5 50 42)">
          <animateTransform 
            attributeName="transform" 
            type="rotate" 
            values="-5 50 42;-5.5 50 42;-5 50 42" 
            dur="4s" 
            repeatCount="indefinite" 
            additive="sum"
          />
        </path>
        
        {/* Mysterious rune-like engravings on chest with subtle glowing */}
        <path d="M30 51 L35 51 M32.5 48 L32.5 54" stroke="#8A7256" strokeWidth="1">
          <animate 
            attributeName="stroke" 
            values="#8A7256;#A69779;#8A7256" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </path>
        <path d="M65 51 L70 51 M67.5 48 L67.5 54" stroke="#8A7256" strokeWidth="1">
          <animate 
            attributeName="stroke" 
            values="#8A7256;#A69779;#8A7256" 
            dur="3.5s" 
            repeatCount="indefinite" 
          />
        </path>
        
        {/* Subtle crack in the wood */}
        <path d="M55 62 L58 70" stroke="#472D1C" strokeWidth="0.7" strokeDasharray="2,1" />
        
        {/* Ancient coin, with subtle glow from the chest light */}
        <circle cx="50" cy="70" r="6" fill="#C9A66B" stroke="#8A7256" strokeWidth="1">
          <animate 
            attributeName="fill" 
            values="#C9A66B;#DDBA7D;#C9A66B" 
            dur="3s" 
            repeatCount="indefinite" 
          />
        </circle>
        <path d="M48 70 L52 70 M50 68 L50 72" stroke="#472D1C" strokeWidth="0.7" />
      </g>
      
      {/* Occasional mystical particle effects */}
      <circle cx="50" cy="40" r="0.5" fill="#FFFFFF">
        <animate 
          attributeName="cy" 
          from="42" 
          to="30" 
          dur="4s" 
          begin="1s"
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="opacity" 
          from="1" 
          to="0" 
          dur="4s" 
          begin="1s"
          repeatCount="indefinite" 
        />
      </circle>
      
      <circle cx="45" cy="40" r="0.5" fill="#FFFFFF">
        <animate 
          attributeName="cy" 
          from="42" 
          to="32" 
          dur="5s" 
          begin="2s"
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="opacity" 
          from="1" 
          to="0" 
          dur="5s" 
          begin="2s"
          repeatCount="indefinite" 
        />
      </circle>
      
      <circle cx="55" cy="40" r="0.5" fill="#FFFFFF">
        <animate 
          attributeName="cy" 
          from="42" 
          to="34" 
          dur="3.5s" 
          begin="0.5s"
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="opacity" 
          from="1" 
          to="0" 
          dur="3.5s" 
          begin="0.5s"
          repeatCount="indefinite" 
        />
      </circle>
    </svg>
  );
};

export default TreasureChest; 