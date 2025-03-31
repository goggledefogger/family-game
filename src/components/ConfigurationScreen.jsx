import React from 'react';
import { ChevronRight } from 'lucide-react';
import { gameSteps } from '../data/gameSteps';
import { configComments } from '../data/configComments';

const ConfigurationScreen = ({ 
  currentStep, 
  onConfigOption, 
  handleButtonHover, 
  movingButtonIndex,
  showConfigConfirmation,
  selectedConfigIndex,
  onConfirmConfig,
  onChangeConfig
}) => {
  const configStep = gameSteps[currentStep];
  const hasCommentsForStep = configComments[currentStep] !== undefined;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Game Configuration</h2>
      
      <div className="w-full max-w-md mb-6">
        <p className="text-white text-lg mb-6">{configStep.message}</p>
        
        <div className="space-y-3">
          {configStep.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onConfigOption(index)}
              onMouseEnter={() => index === 2 && handleButtonHover(index)}
              className={`w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white flex items-center transition-colors ${
                movingButtonIndex === index ? 'transform translate-y-12 translate-x-6' : ''
              }`}
              style={{ 
                transitionProperty: movingButtonIndex === index ? 'transform' : 'background-color',
                transitionDuration: movingButtonIndex === index ? '0.2s' : '0.15s'
              }}
              disabled={showConfigConfirmation}
            >
              <span className="mr-2">{index + 1}.</span>
              {option}
              <ChevronRight size={16} className="ml-auto" />
            </button>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-4">
        Step {currentStep + 1} of {gameSteps.length}
      </div>
      
      {/* Confirmation Dialog */}
      {showConfigConfirmation && selectedConfigIndex !== null && hasCommentsForStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-yellow-400">Interesting Choice...</h3>
            
            <p className="text-gray-300 mb-6">
              {configComments[currentStep][selectedConfigIndex]}
            </p>
            
            <div className="flex justify-between">
              <button
                onClick={onChangeConfig}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Reconsider
              </button>
              <button
                onClick={onConfirmConfig}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
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