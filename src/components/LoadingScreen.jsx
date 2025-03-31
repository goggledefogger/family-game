import React from 'react';
import { Loader } from 'lucide-react';
import ProgressBar from './ProgressBar';

const LoadingScreen = ({ 
  stepMessage, 
  loadingProgress, 
  progressBarType, 
  isMelting, 
  isReversingProgress,
  currentStep,
  stepLabel 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 max-w-lg mx-auto ${isMelting ? 'melting-ui' : ''}`}>
      <div className={`text-yellow-500 mb-6 ${isMelting ? 'melting-spinner' : ''}`}>
        <Loader size={48} className="animate-spin" />
      </div>
      
      <h2 className={`text-2xl font-bold mb-6 text-yellow-400 ${isMelting ? 'melting-text' : ''}`}>
        Loading Game Data
      </h2>
      
      <p className={`text-gray-300 mb-8 text-center ${isMelting ? 'melting-text-subtle' : ''}`}>
        {stepMessage}
      </p>
      
      <div className="progress-container mb-6 w-full">
        <div 
          className={`progress-bar progress-bar-${progressBarType} ${
            isReversingProgress ? 'bg-red-500' : ''
          } ${isMelting ? 'melting-ui' : ''}`}
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      
      <p className="text-gray-400 text-sm">
        {isReversingProgress 
          ? 'Error detected, restoring data...' 
          : `${Math.floor(loadingProgress)}% complete`
        }
      </p>
      
      <div className="text-xs text-gray-500 mt-6">
        {stepLabel}
      </div>
    </div>
  );
};

export default LoadingScreen; 