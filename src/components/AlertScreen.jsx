import React, { useState } from 'react';
import { HelpCircle, Check } from 'lucide-react';
import { gameSteps } from '../data/gameSteps';
import { alertComments } from '../data/alertComments';
import { randomAlertComments } from '../data/randomComments';

const AlertScreen = ({ 
  playerName,
  currentStep, 
  onAlert,
  showAlertConfirmation,
  onConfirmAlert,
  onChangeAlert,
  stepLabel
}) => {
  const hasCommentsForStep = alertComments[currentStep] !== undefined;
  const [randomComment] = useState(randomAlertComments[Math.floor(Math.random() * randomAlertComments.length)]);
  
  // Get a default name if none is provided
  const displayName = playerName?.trim() || 'User';
  
  // Function to get the appropriate comment
  const getComment = () => {
    let comment;
    if (hasCommentsForStep) {
      comment = alertComments[currentStep][Math.floor(Math.random() * alertComments[currentStep].length)];
    } else {
      comment = randomComment;
    }
    
    // Replace placeholders with player name
    return comment?.replace(/you/g, displayName).replace(/You/g, displayName);
  };
  
  // Personalize alert message
  const personalizedMessage = gameSteps[currentStep]?.message?.includes('your')
    ? gameSteps[currentStep].message.replace('your', `${displayName}'s`)
    : gameSteps[currentStep]?.message;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <div className="text-yellow-500 mb-4">
        <HelpCircle size={48} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-yellow-400">System Notice for {displayName}</h2>
      <p className="text-gray-300 mb-8 text-center">{personalizedMessage}</p>
      
      <div className="flex flex-col w-full max-w-md">
        <button 
          onClick={onAlert}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg mb-3 flex items-center justify-center"
          disabled={showAlertConfirmation}
        >
          <Check size={20} className="mr-2" />
          Continue
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mt-6">
        {stepLabel}
      </div>
      
      {/* Confirmation Dialog */}
      {showAlertConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">
              {(() => {
                // Special cases for steps with specific tones
                if (currentStep === 10 || currentStep === 15 || currentStep === 20) {
                  return `Oh, Really, ${displayName}?`; // Always snarky for these
                }
                
                // Default progression
                if (currentStep < 5) {
                  return 'Please Confirm';
                } else if (currentStep < 10) {
                  return `Are You Sure, ${displayName}?`;
                } else {
                  return `Oh, Really, ${displayName}?`;
                }
              })()}
            </h3>
            
            <p className="text-gray-300 mb-8">
              {getComment()}
            </p>
            
            <div className="flex justify-between space-x-4">
              <button
                onClick={onChangeAlert}
                className="btn-cancel py-3 px-6 rounded font-medium w-full"
              >
                {(() => {
                  // Special cases for steps with specific tones
                  if (currentStep === 10 || currentStep === 15 || currentStep === 20) {
                    return 'Wait, What?'; // Always snarky for these
                  }
                  
                  // Default progression
                  if (currentStep < 5) {
                    return 'Go Back';
                  } else if (currentStep < 10) {
                    return 'Let Me Think';
                  } else {
                    return 'Wait, What?';
                  }
                })()}
              </button>
              <button
                onClick={onConfirmAlert}
                className="btn-primary py-3 px-6 rounded w-full"
              >
                {(() => {
                  // Special cases for steps with specific tones
                  if (currentStep === 10 || currentStep === 15 || currentStep === 20) {
                    return 'Whatever, Continue'; // Always snarky for these
                  }
                  
                  // Default progression
                  if (currentStep < 5) {
                    return 'Continue';
                  } else if (currentStep < 10) {
                    return 'Yes, Continue';
                  } else {
                    return 'Whatever, Continue';
                  }
                })()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertScreen; 