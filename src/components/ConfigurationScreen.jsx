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
              onClick={() => index !== 2 && onConfigOption(index)}
              onMouseEnter={() => index === 2 && handleButtonHover(index)}
              onMouseMove={() => index === 2 && handleButtonHover(index)}
              className={`w-full text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white flex items-center transition-colors ${
                movingButtonIndex === index ? (index === 2 ? 'transform translate-y-16 translate-x-12' : '') : ''
              }`}
              style={{ 
                transitionProperty: movingButtonIndex === index ? 'transform' : 'background-color',
                transitionDuration: movingButtonIndex === index ? '0.15s' : '0.15s',
                cursor: index === 2 ? 'not-allowed' : 'pointer'
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Interesting Choice...</h3>
            
            <p className="text-gray-300 mb-8">
              {configComments[currentStep][selectedConfigIndex]}
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