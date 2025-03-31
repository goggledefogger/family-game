import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { gameSteps } from '../data/gameSteps';
import { configComments } from '../data/configComments';
import { randomConfigComments } from '../data/randomComments';

const ConfigurationScreen = ({ 
  currentStep, 
  onConfigOption, 
  handleButtonHover, 
  movingButtonIndex,
  showConfigConfirmation,
  selectedConfigIndex,
  onConfirmConfig,
  onChangeConfig,
  stepLabel
}) => {
  const configStep = gameSteps[currentStep];
  const hasCommentsForStep = configComments[currentStep] !== undefined;
  const [lastMoveDirection, setLastMoveDirection] = useState({ x: 0, y: 0 });
  const [randomComment] = useState(randomConfigComments[Math.floor(Math.random() * randomConfigComments.length)]);
  
  // Function to generate random movement when hovering over joke button
  const handleJokeButtonHover = (index) => {
    handleButtonHover(index);
    
    // Generate a new random direction that's different from the last one
    const generateNewDirection = () => {
      const directions = [
        { x: -16, y: 0 },    // left
        { x: 16, y: 0 },     // right
        { x: 0, y: -16 },    // up
        { x: 0, y: 16 },     // down
        { x: -12, y: -12 },  // up-left
        { x: 12, y: -12 },   // up-right
        { x: -12, y: 12 },   // down-left
        { x: 12, y: 12 }     // down-right
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
    
    // Temporarily store this direction
    const moveDirection = generateNewDirection();
    
    // Return the direction for use in the inline style
    return moveDirection;
  };
  
  // State to track the current position of the joke button
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  
  // Function to get the appropriate comment
  const getComment = () => {
    if (hasCommentsForStep && selectedConfigIndex !== null) {
      return configComments[currentStep][selectedConfigIndex];
    }
    return randomComment;
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto screen-tilt">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400 subtle-rotate">Game Configuration</h2>
      
      <div className="w-full max-w-md mb-6 container-breathe">
        <p className="text-white text-lg mb-6 occasional-glitch" data-text={configStep.message}>{configStep.message}</p>
        
        <div className="space-y-3">
          {configStep.options.map((option, index) => (
            <button
              key={index}
              onClick={() => index !== 2 && onConfigOption(index)}
              onMouseEnter={() => {
                if (index === 2) {
                  const newPos = handleJokeButtonHover(index);
                  setButtonPosition(newPos);
                }
              }}
              className={`w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white flex items-center transition-all ${
                movingButtonIndex === index && index === 2 ? 'transform' : ''
              } ${index === 1 ? 'button-wobble' : ''}`}
              style={{ 
                transform: movingButtonIndex === index && index === 2 
                  ? `translate(${buttonPosition.x}px, ${buttonPosition.y}px)` 
                  : 'none',
                transitionProperty: 'transform, background-color',
                transitionDuration: '0.15s',
                cursor: index === 2 ? 'not-allowed' : 'pointer'
              }}
              disabled={showConfigConfirmation}
            >
              <span className="mr-2">{index + 1}.</span>
              <span className={index === 0 ? 'text-glitch' : ''}>{option}</span>
              <ChevronRight size={16} className="ml-auto" />
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-4 slant-text">
        {stepLabel}
      </div>
      
      {/* Confirmation Dialog */}
      {showConfigConfirmation && selectedConfigIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Interesting Choice...</h3>
            
            <p className="text-gray-300 mb-8">
              {getComment()}
            </p>
            
            <div className="flex justify-between space-x-4">
              <button
                onClick={onChangeConfig}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded font-medium"
              >
                Reconsider
              </button>
              <button
                onClick={onConfirmConfig}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded"
              >
                Proceed Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurationScreen; 