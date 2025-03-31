import React, { useState, useEffect } from 'react';
import { AlertCircle, X, Cpu, RefreshCw } from 'lucide-react';

const CrashingScreen = ({ onComplete, delay = 4000, stepLabel }) => {
  const [crashStage, setCrashStage] = useState(0);
  
  useEffect(() => {
    // Sequence of crash animations
    const sequence = [
      setTimeout(() => setCrashStage(1), 1000), // Start glitching
      setTimeout(() => setCrashStage(2), 2000), // Show error
      setTimeout(() => setCrashStage(3), 3000), // Show reboot 
      setTimeout(() => onComplete(), delay)     // Complete after specified delay
    ];
    
    return () => sequence.forEach(timeout => clearTimeout(timeout));
  }, [onComplete, delay]);
  
  const errorCodes = [
    'ERR_SYSTEM_FAILURE',
    'MEMORY_ACCESS_VIOLATION',
    'CRITICAL_PROCESS_DIED',
    'IRQL_NOT_LESS_OR_EQUAL',
    'UNEXPECTED_KERNEL_MODE_TRAP'
  ];
  
  const randomErrorCode = errorCodes[Math.floor(Math.random() * errorCodes.length)];
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      {/* First stage - normal display that starts glitching */}
      {crashStage >= 0 && (
        <div className={`w-full ${crashStage >= 1 ? 'animate-glitch' : ''}`}>
          <h2 className={`text-2xl font-bold mb-6 text-yellow-400 ${crashStage >= 1 ? 'animate-glitch-text' : ''}`}>
            Loading Game
          </h2>
          
          <div className="progress-container">
            <div 
              className="progress-bar progress-bar-1"
              style={{ width: `${crashStage >= 1 ? '90%' : '75%'}` }}
            ></div>
          </div>
          
          <div className={`text-gray-300 mb-4 h-8 flex items-center ${crashStage >= 1 ? 'animate-glitch-text' : ''}`}>
            Processing game data...
          </div>
          
          <div className={`${crashStage >= 1 ? 'animate-glitch' : 'animate-spin'} text-yellow-500 mt-4`}>
            <RefreshCw size={32} />
          </div>
        </div>
      )}
      
      {/* Second stage - error message */}
      {crashStage >= 2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90 z-10">
          <div className="bg-gray-800 border-2 border-red-500 rounded-lg p-8 max-w-md w-full animate-bounce-in relative crt-effect">
            <div className="scanline"></div>
            
            <div className="flex items-start space-x-4 mb-4">
              <AlertCircle size={32} className="text-red-500 shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-red-500 mb-2">SYSTEM ERROR</h3>
                <p className="text-gray-300 font-mono text-sm">
                  {randomErrorCode}
                </p>
              </div>
              <X size={24} className="text-gray-400 ml-auto" />
            </div>
            
            <div className="border border-gray-700 bg-gray-900 p-4 mb-4 font-mono text-sm text-gray-300 overflow-auto h-24">
              <p className="animate-glitch-text">
                A critical system error has occurred.
                <br />
                Memory at address 0x00000000 could not be read.
                <br />
                Error code: 0x{Math.floor(Math.random() * 100000000).toString(16).padStart(8, '0')}
                <br />
                The system will now attempt to recover...
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Third stage - reboot message */}
      {crashStage >= 3 && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-20">
          <Cpu size={48} className="text-green-500 mb-6 animate-pulse" />
          
          <div className="font-mono text-green-500 mb-4 typewriter">
            SYSTEM REBOOTING...
          </div>
          
          <div className="w-64 h-4 bg-gray-800 rounded overflow-hidden mt-4">
            <div 
              className="h-full bg-green-500 transition-all duration-1000 ease-in-out"
              style={{ width: '100%', transitionDelay: '1s' }}
            ></div>
          </div>
          
          <p className="text-gray-500 text-sm mt-8 animate-fade-in-delay">
            Restoring game state...
          </p>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-6">
        {stepLabel}
      </div>
    </div>
  );
};

export default CrashingScreen; 