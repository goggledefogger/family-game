import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { consentComments } from '../data/consentComments';
import { randomConsentComments } from '../data/randomComments';

const ConsentScreen = ({ playerName, onConsent, showConsentConfirmation, onConfirmConsent, onChangeConsent, stepLabel }) => {
  // Select a random comment when component mounts
  const [commentIndex] = useState(Math.floor(Math.random() * consentComments.length));
  const comment = consentComments[commentIndex];
  
  // Select a random confirmation comment
  const [confirmationComment] = useState(randomConsentComments[Math.floor(Math.random() * randomConsentComments.length)]);
  
  // Get a default name if none is provided
  const displayName = playerName?.trim() || 'User';
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto container-breathe">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400 subtle-rotate">Terms & Conditions for {displayName}</h2>
      
      <div className="w-full max-w-md">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="max-h-80 overflow-y-auto mb-6 text-gray-300 text-sm leading-relaxed px-4 py-2">
            <p className="mb-4">By proceeding with this game, {displayName} agrees to the following terms and conditions:</p>
            
            <ol className="list-decimal pl-5 space-y-4">
              <li className="occasional-glitch" data-text="Game data will be collected for analysis and improvement purposes. This may include your responses, timing, and interaction patterns.">
                Game data will be collected for analysis and improvement purposes. This may include {displayName}'s responses, timing, and interaction patterns.
              </li>
              
              <li className="text-glitch">
                The game provider reserves the right to modify, suspend, or terminate {displayName}'s game experience at any time without prior notice.
              </li>
              
              <li>
                {displayName} acknowledges that any decisions made within this game are solely for entertainment purposes and do not reflect real-world implications or consequences.
              </li>
              
              <li className="color-shift">
                The game provider assumes no responsibility for any emotional distress, confusion, or existential crises that may arise from {displayName}'s participation in this game.
              </li>
              
              <li>
                {displayName} grants permission for gameplay data to be shared with our partner companies, subsidiaries, and any interested aliens who may be studying human behavior.
              </li>
              
              <li className="occasional-glitch" data-text="This game contains nonsensical elements and arbitrary processes designed to confuse and frustrate users, which you willingly accept.">
                This game contains nonsensical elements and arbitrary processes designed to confuse and frustrate users, which {displayName} willingly accepts.
              </li>
              
              <li>
                {displayName} acknowledges that clicking "I Accept" means they haven't actually read these terms in detail, which is exactly what we expected.
              </li>
            </ol>
          </div>
          
          <button 
            onClick={onConsent}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded button-wobble"
            disabled={showConsentConfirmation}
          >
            I Accept
          </button>
        </div>
        
        <div className="text-xs text-gray-500 text-center float">
          <p className="slant-text">{comment}</p>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-6">
        {stepLabel}
      </div>
      
      {/* Confirmation Dialog */}
      {showConsentConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md w-full shadow-xl screen-tilt">
            <h3 className="text-xl font-bold mb-6 text-yellow-400">Are you sure, {displayName}?</h3>
            
            <p className="text-gray-300 mb-8 occasional-glitch" data-text={confirmationComment}>
              {confirmationComment.replace(/you/g, displayName).replace(/You/g, displayName)}
            </p>
            
            <div className="flex justify-between space-x-4">
              <button
                onClick={onChangeConsent}
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded font-medium"
              >
                Let me think...
              </button>
              <button
                onClick={onConfirmConsent}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded"
              >
                Yes, Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentScreen; 