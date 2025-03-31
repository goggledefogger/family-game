import React, { useState, useEffect } from 'react';
import { Database, Code } from 'lucide-react';

const BinaryLoadingScreen = ({ stepMessage, loadingProgress, onComplete, delay = 5000 }) => {
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
      <div className="w-full binary-rain relative min-h-[300px]">
        {/* Binary rain background */}
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
        
        {/* Content on top of binary rain */}
        <div className="relative z-10 bg-black bg-opacity-70 p-6 rounded-lg border border-green-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-mono text-green-400">System Analysis</h2>
            <Code size={24} className="text-green-500" />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-green-300 font-mono text-sm">Processing:</span>
              <span className="text-green-300 font-mono text-sm">{loadingProgress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="font-mono text-green-300 text-sm mb-4">
            {stepMessage}
          </div>
          
          <div className="font-mono text-green-800 text-xs h-24 overflow-hidden border border-green-900 bg-black bg-opacity-50 p-2">
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
          
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center">
              <Database size={16} className="text-green-500 mr-2" />
              <span className="text-green-300 font-mono text-xs">System v4.01</span>
            </div>
            <span className="text-green-300 font-mono text-xs animate-pulse">Processing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryLoadingScreen; 