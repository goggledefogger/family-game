import React, { useState, useEffect } from 'react';
import { Database, Code } from 'lucide-react';

const BinaryLoadingScreen = ({ stepMessage, loadingProgress, onComplete, delay = 5000, stepLabel }) => {
  const [binaryDigits, setBinaryDigits] = useState([]);
  
  // Generate binary rain effect
  useEffect(() => {
    const createBinaryDigit = () => {
      if (binaryDigits.length > 50) return; // Limit the number of digits
      
      const digit = {
        id: Math.random(),
        value: Math.round(Math.random()),
        x: Math.random() * 100,
        y: -10,
        size: Math.random() * 12 + 10,
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.5
      };
      
      setBinaryDigits(prevDigits => [...prevDigits, digit]);
    };
    
    // Create new binary digits at random intervals
    const interval = setInterval(createBinaryDigit, 200);
    
    // Move existing digits down
    const animationInterval = setInterval(() => {
      setBinaryDigits(prevDigits => 
        prevDigits
          .map(digit => ({
            ...digit,
            y: digit.y + digit.speed
          }))
          .filter(digit => digit.y < 110) // Remove digits that are off-screen
      );
    }, 50);
    
    // Complete after specified delay
    const timeout = setTimeout(() => onComplete(), delay);
    
    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
      clearTimeout(timeout);
    };
  }, [onComplete, delay, binaryDigits.length]);
  
  // Create a string of binary code
  const generateBinaryString = (length) => {
    return Array.from({ length }, () => Math.round(Math.random())).join('');
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      {/* Falling binary background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {binaryDigits.map((digit) => (
          <div
            key={digit.id}
            className="binary-digit absolute"
            style={{
              left: `${digit.x}%`,
              top: `${digit.y}%`,
              fontSize: `${digit.size}px`,
              opacity: digit.opacity,
              color: digit.value ? '#0f0' : '#0a0',
              animationDuration: `${10 / digit.speed}s`
            }}
          >
            {digit.value}
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 bg-black bg-opacity-70 p-8 rounded-lg border border-green-500">
        <div className="mb-6 flex justify-center">
          <Database size={48} className="text-green-500 animate-pulse" />
        </div>
        
        <h2 className="text-xl font-mono text-green-400 mb-6 text-center">SYSTEM OPERATION</h2>
        
        <div className="progress-container mb-6">
          <div 
            className="progress-bar bg-green-500"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        
        <p className="text-green-400 font-mono mb-6 text-center">
          {stepMessage}
        </p>
        
        <div className="font-mono text-green-800 text-xs h-24 overflow-hidden border border-green-900 bg-black bg-opacity-50 p-4 mb-2">
          <div>
            <p>&gt; INITIALIZING DATA STREAM</p>
            <p>&gt; {generateBinaryString(32)}</p>
            <p>&gt; {generateBinaryString(32)}</p>
            <p>&gt; ANALYZING USER DATA</p>
            <p>&gt; {generateBinaryString(32)}</p>
            <p>&gt; {generateBinaryString(32)}</p>
            <p>&gt; ACCESSING MAIN FRAME</p>
            <p>&gt; {generateBinaryString(32)}</p>
          </div>
        </div>
        
        <div className="text-right text-green-600 text-sm font-mono">
          {Math.floor(loadingProgress)}% complete
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-6">
        {stepLabel}
      </div>
    </div>
  );
};

export default BinaryLoadingScreen; 