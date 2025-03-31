import React from 'react';
import { Check } from 'lucide-react';
import { consentComments } from '../data/consentComments';

const ConsentScreen = ({ onConsent, showConsentConfirmation, onConfirmConsent, onChangeConsent }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">User Agreement</h2>
      
      <div className="w-full max-w-md mb-6 bg-gray-800 border border-gray-700 rounded-lg p-4 h-48 overflow-y-auto text-gray-300 text-sm">
        <p className="mb-3">By clicking "I Accept" below, you agree to the following terms and conditions for Family Fortune Game:</p>
        <p className="mb-3">1. You grant us permission to collect non-identifiable gameplay data.</p>
        <p className="mb-3">2. You acknowledge that all in-game prizes are virtual and have no monetary value.</p>
        <p className="mb-3">3. You agree to maintain a positive attitude regardless of game outcome.</p>
        <p className="mb-3">4. You agree not to share game questions with other family members.</p>
        <p className="mb-3">5. You confirm you are playing this game of your own free will and recognize that Family Fortune is for entertainment purposes only.</p>
      </div>
      
      <div className="flex flex-col w-full max-w-md">
        <button 
          onClick={onConsent}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg mb-3 flex items-center justify-center"
          disabled={showConsentConfirmation}
        >
          <Check size={20} className="mr-2" />
          I Accept
        </button>
      </div>
      
      {/* Confirmation Dialog */}
      {showConsentConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Terms Accepted</h3>
            
            <p className="text-gray-300 mb-8">
              {consentComments[Math.floor(Math.random() * consentComments.length)]}
            </p>
            
            <div className="flex justify-between space-x-4">
              <button
                onClick={onChangeConsent}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded font-medium"
              >
                Wait, Let Me Read Again
              </button>
              <button
                onClick={onConfirmConsent}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded"
              >
                Yes, I Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentScreen; 