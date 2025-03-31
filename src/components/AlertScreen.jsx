import React from 'react';
import { HelpCircle, Check } from 'lucide-react';
import { gameSteps } from '../data/gameSteps';
import { alertComments } from '../data/alertComments';

const AlertScreen = ({ 
  currentStep, 
  onAlert,
  showAlertConfirmation,
  onConfirmAlert,
  onChangeAlert
}) => {
  const hasCommentsForStep = alertComments[currentStep] !== undefined;
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <div className="text-yellow-500 mb-4">
        <HelpCircle size={48} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-yellow-400">System Notice</h2>
      <p className="text-gray-300 mb-8 text-center">{gameSteps[currentStep].message}</p>
      
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
      
      {/* Confirmation Dialog */}
      {showAlertConfirmation && hasCommentsForStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Oh, Really?</h3>
            
            <p className="text-gray-300 mb-8">
              {alertComments[currentStep][Math.floor(Math.random() * alertComments[currentStep].length)]}
            </p>
            
            <div className="flex justify-between space-x-4">
              <button
                onClick={onChangeAlert}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded font-medium"
              >
                Wait, What?
              </button>
              <button
                onClick={onConfirmAlert}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded"
              >
                Whatever, Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertScreen; 