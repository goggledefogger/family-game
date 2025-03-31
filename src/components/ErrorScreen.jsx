import React, { useState, useEffect } from 'react';
import { AlertCircle, XCircle, RefreshCw } from 'lucide-react';
import { errors } from '../data/errors';

const ErrorScreen = ({ 
  errorType, 
  updateCount, 
  onErrorAction, 
  handleButtonHover, 
  movingButtonIndex,
  stepLabel
}) => {
  const [attempts, setAttempts] = useState(1);
  const error = errors[errorType];
  const [isButtonMoving, setIsButtonMoving] = useState(false);
  const [lastMoveDirection, setLastMoveDirection] = useState({ x: 0, y: 0 });
  
  // Random glitch intervals for text
  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger a re-render occasionally for glitch effects
      setAttempts(prev => prev);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to generate random movement when hovering over button
  const handleErrorButtonHover = () => {
    handleButtonHover(0);
    
    // If the button is already moving, don't change direction
    if (isButtonMoving) return lastMoveDirection;
    
    setIsButtonMoving(true);
    
    // Clear the moving state after a short delay
    setTimeout(() => {
      setIsButtonMoving(false);
    }, 300);
    
    // Generate a new random direction that's different from the last one
    const directions = [
      { x: -20, y: 0 },    // left
      { x: 20, y: 0 },     // right
      { x: 0, y: -20 },    // up
      { x: 0, y: 20 },     // down
      { x: -15, y: -15 },  // up-left
      { x: 15, y: -15 },   // up-right
      { x: -15, y: 15 },   // down-left
      { x: 15, y: 15 }     // down-right
    ];
    
    // Filter out the last direction to avoid repeating
    const availableDirections = directions.filter(
      dir => dir.x !== lastMoveDirection.x || dir.y !== lastMoveDirection.y
    );
    
    // Pick a random direction
    const newDirection = availableDirections[Math.floor(Math.random() * availableDirections.length)];
    setLastMoveDirection(newDirection);
    
    return newDirection;
  };
  
  // State to track the current position of the button
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  
  const handleAttempt = () => {
    setAttempts(attempts + 1);
    onErrorAction();
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-md mx-auto screen-tilt">
      <div className="text-red-500 mb-6 float">
        <XCircle size={48} className="animate-pulse" />
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-red-400 occasional-glitch" data-text="System Error">System Error</h2>
      
      <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-8 mb-8 w-full container-breathe">
        <div className="flex items-start mb-6">
          <AlertCircle size={24} className="text-red-500 mr-3 flex-shrink-0 mt-1" />
          <div>
            <p className="text-white mb-2 text-glitch">Error Code: {error.code}</p>
            <p className="text-gray-300">{error.message}</p>
          </div>
        </div>
        
        <div className="h-1 bg-gray-700 mb-6">
          <div className="h-full bg-red-500" style={{ width: `${Math.min(attempts * 25, 100)}%` }}></div>
        </div>
        
        <p className="text-sm text-gray-400 mb-4 color-shift">
          Attempted fixes: <span className="text-red-400 font-bold">{attempts}</span> of 4
        </p>
      </div>
      
      <button 
        onClick={handleAttempt}
        onMouseEnter={() => {
          const newPos = handleErrorButtonHover();
          setButtonPosition(newPos);
        }}
        className={`bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg flex items-center justify-center ${
          movingButtonIndex === 0 ? 'transform' : ''
        }`}
        style={{ 
          transform: movingButtonIndex === 0 
            ? `translate(${buttonPosition.x}px, ${buttonPosition.y}px)` 
            : 'none',
          transitionProperty: 'transform, background-color',
          transitionDuration: '0.15s'
        }}
      >
        <RefreshCw size={20} className="mr-2" />
        <span className="slant-text">{updateCount >= 2 ? "Try One Last Fix" : "Attempt Automatic Fix"}</span>
      </button>
      
      <div className="text-xs text-gray-500 mt-6">
        {stepLabel}
      </div>
    </div>
  );
};

export default ErrorScreen; 