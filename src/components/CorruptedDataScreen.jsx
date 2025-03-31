import React, { useState, useEffect } from 'react';
import { FileWarning, ShieldAlert, FileX, FileCog } from 'lucide-react';

const CorruptedDataScreen = ({ stepMessage, loadingProgress, onComplete, delay = 5000 }) => {
  const [corruptionLevel, setCorruptionLevel] = useState(0);
  const [showRepair, setShowRepair] = useState(false);
  
  useEffect(() => {
    // Sequence animation for corruption
    const sequence = [
      setTimeout(() => setCorruptionLevel(1), 1000),
      setTimeout(() => setCorruptionLevel(2), 2000),
      setTimeout(() => setCorruptionLevel(3), 3000),
      setTimeout(() => setShowRepair(true), 3500),
      setTimeout(() => onComplete(), delay)
    ];
    
    return () => sequence.forEach(timeout => clearTimeout(timeout));
  }, [onComplete, delay]);
  
  // Generate corrupted text
  const corruptText = (text, level) => {
    if (level === 0) return text;
    
    const special = "!@#$%^&*()_+-=[]{}|;:'\",./<>?`~".split('');
    const chars = text.split('');
    
    return chars.map((char, index) => {
      // Chance of corruption increases with level
      const corruptChance = 0.05 * level;
      
      if (Math.random() < corruptChance) {
        if (Math.random() < 0.5) {
          // Replace with special character
          return special[Math.floor(Math.random() * special.length)];
        } else {
          // Replace with random letter
          return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        }
      }
      
      return char;
    }).join('');
  };
  
  // Array of data corruption messages
  const corruptionMessages = [
    { message: "Warning: Data integrity check failed", severity: "warning" },
    { message: "Error: Game data files corrupted", severity: "error" },
    { message: "Critical: System32.dll memory access violation", severity: "critical" },
    { message: "Alert: Game assets checksum mismatch", severity: "warning" },
    { message: "Error: Memory allocation failure at 0x00A4F2D1", severity: "error" },
    { message: "Warning: Database indices corrupted", severity: "warning" }
  ];
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <div className={`w-full ${corruptionLevel >= 2 ? 'crt-effect' : ''}`}>
        <div className="flex items-center mb-4">
          {corruptionLevel < 2 ? (
            <FileWarning size={28} className="text-yellow-500 mr-2" />
          ) : corruptionLevel < 3 ? (
            <ShieldAlert size={28} className="text-red-500 mr-2" />
          ) : (
            <FileX size={28} className="text-red-500 mr-2 animate-pulse" />
          )}
          
          <h2 className={`text-2xl font-bold ${
            corruptionLevel < 2 
              ? 'text-yellow-400' 
              : corruptionLevel < 3 
                ? 'text-red-400' 
                : 'text-red-500 animate-glitch-text'
          }`}>
            {corruptionLevel < 2 
              ? "Data Verification" 
              : corruptionLevel < 3 
                ? "Data Corruption Detected" 
                : "CRITICAL DATA ERROR"}
          </h2>
        </div>
        
        <div className="progress-container mb-6">
          <div 
            className={`progress-bar ${
              corruptionLevel < 2 
                ? 'bg-yellow-500' 
                : corruptionLevel < 3 
                  ? 'bg-red-500' 
                  : 'bg-red-700 animate-pulse'
            }`}
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
        
        <div className={`text-gray-300 mb-6 ${corruptionLevel >= 2 ? 'animate-glitch-text' : ''}`}>
          {corruptText(stepMessage, corruptionLevel)}
        </div>
        
        <div className={`bg-gray-800 border ${
          corruptionLevel < 2 
            ? 'border-yellow-600' 
            : 'border-red-600'
        } rounded-lg p-8 mb-6`}>
          <h3 className={`font-bold mb-4 ${
            corruptionLevel < 2 
              ? 'text-yellow-400' 
              : 'text-red-400'
          }`}>
            Data Diagnostic Results:
          </h3>
          
          <div className="space-y-2 font-mono text-sm max-h-32 overflow-y-auto">
            {corruptionMessages.slice(0, corruptionLevel + 2).map((item, index) => (
              <div 
                key={index} 
                className={`flex items-start ${
                  item.severity === 'warning' 
                    ? 'text-yellow-400' 
                    : item.severity === 'error' 
                      ? 'text-red-400' 
                      : 'text-red-600 font-bold'
                } ${corruptionLevel >= 3 ? 'animate-glitch-text' : ''}`}
              >
                <span className="mr-3">•</span>
                <span>{corruptText(item.message, corruptionLevel * 0.5)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {showRepair && (
          <div className="bg-gray-800 border border-blue-600 rounded-lg p-8 mb-4 animate-fade-in">
            <div className="flex items-center mb-4">
              <FileCog size={20} className="text-blue-400 mr-3 animate-spin" />
              <h3 className="text-blue-400 font-bold">Attempting Data Repair</h3>
            </div>
            
            <div className="mt-4 text-sm text-gray-300">
              <p className="typewriter mb-4">Rebuilding corrupted indices...</p>
              <div className="h-1 bg-gray-700 mt-2">
                <div className="h-full bg-blue-500 animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CorruptedDataScreen; 