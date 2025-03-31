import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { errors } from '../data/errors';

const ErrorScreen = ({ errorType, updateCount, onErrorAction, handleButtonHover, movingButtonIndex }) => {
  const error = errors[errorType];
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <div className="text-red-500 mb-4">
        <AlertTriangle size={48} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-red-400">{error.title}</h2>
      <p className="text-gray-300 mb-8 text-center">{error.message}</p>
      
      <div className="flex flex-col w-full max-w-md">
        <button 
          onClick={onErrorAction}
          onMouseEnter={() => handleButtonHover(0)}
          className={`bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg mb-3 flex items-center justify-center ${
            movingButtonIndex === 0 ? 'transform -translate-x-12' : ''
          }`}
          style={{ 
            transitionProperty: movingButtonIndex === 0 ? 'transform' : 'background-color',
            transitionDuration: movingButtonIndex === 0 ? '0.3s' : '0.15s'
          }}
        >
          <RefreshCw size={20} className="mr-2" />
          {error.buttonText}
        </button>
        
        <div className="text-sm text-gray-400 text-center mt-4">
          <p>Error Code: AF-{Math.floor(Math.random() * 900) + 100}</p>
          <p className="mt-1">Attempts: {updateCount + 1}/3</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen; 