import React from 'react';
import { RefreshCw } from 'lucide-react';
import ProgressBar from './ProgressBar';

const LoadingScreen = ({ stepMessage, loadingProgress, progressBarType, isMelting, isReversingProgress, currentStep }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 max-w-lg mx-auto ${isMelting ? 'melting-ui' : ''}`}>
      <h2 className={`text-2xl font-bold mb-6 text-yellow-400 ${isMelting ? 'melting-text' : ''}`}>Loading Game</h2>
      
      <ProgressBar 
        progress={loadingProgress} 
        progressBarType={progressBarType} 
        isMelting={isMelting} 
        isReversingProgress={isReversingProgress} 
      />
      
      <div className={`text-gray-300 mb-4 h-8 flex items-center ${isMelting ? 'melting-text' : ''}`}>
        {stepMessage}
      </div>
      
      <div className={`${isMelting ? 'melting-spinner' : 'animate-spin'} text-yellow-500 mt-4`}>
        <RefreshCw size={32} />
      </div>
      
      <div className={`text-xs text-gray-500 mt-8 ${isMelting ? 'melting-text-subtle' : ''}`}>
        {currentStep > 2 && "Please do not close this window..."}
      </div>
    </div>
  );
};

export default LoadingScreen; 