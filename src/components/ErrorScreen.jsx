import React, { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { errors } from '../data/errors';

const ErrorScreen = ({ errorType, updateCount, onErrorAction, handleButtonHover, movingButtonIndex }) => {
  const error = errors[errorType];
  const [clickAttempts, setClickAttempts] = useState(0);
  
  // Try to click the moving button
  const handleButtonClick = () => {
    // Increment click attempts
    setClickAttempts(clickAttempts + 1);
    
    // Only allow the action after multiple attempts
    if (clickAttempts >= 3) {
      onErrorAction();
      setClickAttempts(0);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <div className="text-red-500 mb-4">
        <AlertTriangle size={48} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-red-400">{error.title}</h2>
      <p className="text-gray-300 mb-8 text-center">{error.message}</p>
      
      <div className="flex flex-col w-full max-w-md">
        <div className="relative h-16 mb-4">
          <button 
            onClick={handleButtonClick}
            onMouseEnter={() => handleButtonHover(0)}
            onMouseMove={() => handleButtonHover(0)}
            className={`absolute bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all ${
              movingButtonIndex === 0 ? 'transform -translate-x-20 translate-y-4' : ''
            }`}
            style={{ 
              transitionProperty: 'transform, background-color',
              transitionDuration: '0.15s',
              cursor: 'default'
            }}
          >
            <RefreshCw size={20} className="mr-2" />
            {error.buttonText}
          </button>
        </div>
        
        {clickAttempts > 0 && (
          <p className="text-gray-400 text-center text-sm mb-4">
            Keep trying... {4 - clickAttempts} more clicks needed
          </p>
        )}
        
        <div className="text-sm text-gray-400 text-center mt-4">
          <p>Error Code: AF-{Math.floor(Math.random() * 900) + 100}</p>
          <p className="mt-1">Attempts: {updateCount + 1}/3</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen; 