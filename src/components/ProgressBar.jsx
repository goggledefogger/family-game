import React from 'react';

const ProgressBar = ({ progress, progressBarType, isMelting, isReversingProgress }) => {
  let progressBarClass = 'progress-bar';
  
  // Add type-specific styling
  switch (progressBarType) {
    case 1:
      progressBarClass += ' progress-bar-1';
      break;
    case 2:
      progressBarClass += ' progress-bar-2';
      break;
    case 3:
      progressBarClass += ' progress-bar-3';
      break;
    case 4:
      progressBarClass += ' progress-bar-4';
      break;
    default:
      break;
  }
  
  // Add pulsing effect for certain conditions
  if (progress > 75 || isReversingProgress) {
    progressBarClass += ' progress-bar-pulse';
  }
  
  return (
    <div className={`progress-container ${isMelting ? 'melting-ui' : ''}`}>
      <div 
        className={progressBarClass}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar; 