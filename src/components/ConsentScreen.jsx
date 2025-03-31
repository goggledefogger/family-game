import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import { consentComments } from '../data/consentComments';
import { randomConsentComments } from '../data/randomComments';

const ConsentScreen = ({ playerName, onConsent, showConsentConfirmation, onConfirmConsent, onChangeConsent, stepLabel }) => {
  // Select a random comment when component mounts
  const [commentIndex] = useState(Math.floor(Math.random() * consentComments.length));
  const comment = consentComments[commentIndex];
  
  // Select a random confirmation comment
  const [confirmationComment] = useState(randomConsentComments[Math.floor(Math.random() * randomConsentComments.length)]);
  
  // Track if user has scrolled to the bottom
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  
  // Reference to the scrollable content element
  const termsContentRef = useRef(null);
  
  // Get a default name if none is provided
  const displayName = playerName?.trim() || 'User';
  
  // Handle scroll event in the terms content
  const handleScroll = (e) => {
    const element = e.target;
    
    // Check if user has scrolled to the bottom (with a small buffer)
    const isAtBottom = 
      element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };
  
  // Ensure the terms content is scrolled to the top when component mounts
  useEffect(() => {
    if (termsContentRef.current) {
      termsContentRef.current.scrollTop = 0;
      setHasScrolledToBottom(false);
    }
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto container-breathe">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400 subtle-rotate">Terms & Conditions for {displayName}</h2>
      
      <div className="w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <div 
            ref={termsContentRef}
            onScroll={handleScroll}
            className="max-h-80 overflow-y-auto mb-4 text-gray-300 text-sm leading-relaxed px-2 py-1"
          >
            <p className="mb-3">By proceeding with this game, {displayName} agrees to the following terms and conditions:</p>
            
            <ol className="list-decimal pl-4 space-y-3">
              <li>
                Game data will be collected for analysis and improvement purposes. This may include {displayName}'s responses, timing, and interaction patterns.
              </li>
              
              <li>
                The game provider reserves the right to modify, suspend, or terminate {displayName}'s game experience at any time without prior notice.
              </li>
              
              <li className="occasional-glitch" data-text="You acknowledge that any decisions made within this game are solely for entertainment purposes and do not reflect real-world implications or consequences.">
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
              
              <li className="text-glitch">
                {displayName} acknowledges that clicking "I Accept" means they haven't actually read these terms in detail, which is exactly what we expected.
              </li>
            </ol>
            
            <div className="text-center text-yellow-400 mt-4 mb-2 font-semibold">
              {!hasScrolledToBottom && 'Please scroll to review all terms'}
            </div>
          </div>
          
          <button 
            onClick={onConsent}
            className={`w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded button-wobble ${!hasScrolledToBottom ? 'opacity-50' : ''}`}
            disabled={showConsentConfirmation || !hasScrolledToBottom}
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
                className="btn-cancel py-3 px-6 rounded font-medium w-full"
              >
                Let me think...
              </button>
              <button
                onClick={onConfirmConsent}
                className="btn-primary py-3 px-6 rounded w-full"
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