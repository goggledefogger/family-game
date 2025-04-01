import React, { useState, useEffect } from 'react';
import { X, Frown, Laugh, Calendar, Skull, ThumbsUp } from 'lucide-react';
import TreasureChest from './TreasureChest';

const RevealScreen = ({ playerName, onStartOver }) => {
  const [revealStage, setRevealStage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const currentDate = new Date();
  const isActuallyAprilFirst = currentDate.getMonth() === 3 && currentDate.getDate() === 1;
  
  // Emoji collection for April Fools
  const funEmojis = ['🤡', '😂', '🎭', '🎪', '🃏', '😜', '🎯', '🎉', '🎊', '🤪'];
  
  useEffect(() => {
    // Sequence of reveal animations
    const sequence = [
      setTimeout(() => setRevealStage(1), 1000), // Initial X appears
      setTimeout(() => setRevealStage(2), 2500), // Prize cancellation
      setTimeout(() => setRevealStage(3), 4000), // April Fools text
      setTimeout(() => setShowDetails(true), 5500) // Show explanation
    ];
    
    return () => sequence.forEach(timeout => clearTimeout(timeout));
  }, []);
  
  // Generate floating emojis when the April Fools text appears
  useEffect(() => {
    if (revealStage >= 3) {
      // Generate random emojis
      const newEmojis = Array(15).fill().map(() => ({
        id: Math.random().toString(36).substring(7),
        emoji: funEmojis[Math.floor(Math.random() * funEmojis.length)],
        x: Math.random() * 95, // 0-95% viewport width
        y: Math.random() * 95, // 0-95% viewport height
        size: Math.random() * 1.5 + 1, // Size multiplier between 1-2.5
        animDuration: Math.random() * 20 + 10, // Animation length 10-30s
        animDelay: Math.random() * 5, // Delay 0-5s
        opacity: Math.random() * 0.7 + 0.3, // Opacity 0.3-1
      }));
      
      setEmojis(newEmojis);
    }
  }, [revealStage]);
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto text-center relative min-h-[80vh]">
      {/* Fun floating emojis */}
      {emojis.map(emoji => (
        <div 
          key={emoji.id}
          className="fixed pointer-events-none opacity-0 animate-float-emoji z-10"
          style={{
            left: `${emoji.x}%`,
            top: `${emoji.y}%`,
            fontSize: `${emoji.size}rem`,
            opacity: emoji.opacity,
            animationDuration: `${emoji.animDuration}s`,
            animationDelay: `${emoji.animDelay}s`
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      <div className="relative mb-6">
        <TreasureChest size={120} className={`text-yellow-500 ${revealStage >= 2 ? 'opacity-50' : ''}`} />
        {revealStage >= 1 && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 animate-grow-in">
            <X size={100} strokeWidth={1.5} />
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {revealStage >= 2 && (
          <div className="animate-slide-in">
            <p className="text-xl text-white line-through opacity-50 mb-2">Congratulations on winning the grand prize!</p>
            <Frown size={32} className="text-gray-400 mx-auto mb-4" />
          </div>
        )}
        
        {revealStage >= 3 && (
          <h2 className="text-4xl font-bold mb-4 text-yellow-400 animate-bounce-in">
            APRIL FOOLS!
          </h2>
        )}
        
        {revealStage >= 3 && (
          <div className="animate-fade-in-delay">
            <p className="text-xl text-white mb-6">
              There is no game show, {playerName}!
            </p>
            
            <div className="flex justify-center items-center mb-6 space-x-4">
              <Calendar size={24} className="text-red-400" />
              <span className="text-xl font-bold text-red-400">April 1st</span>
              <Laugh size={24} className="text-yellow-400 animate-pulse" />
            </div>
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-8 max-w-md animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-yellow-400">You Win Nothing</h3>
            <Skull size={20} className="text-gray-400" />
          </div>
          
          <p className="text-gray-300 mb-6 text-left">
            Sorry to disappoint, but April Fools! Believe it or not, there's no Bauman Family Treasure game show, just a series of screens to waste your time and drive you a little crazy.
          </p>
          
          <div className="border-t border-gray-700 pt-6 mt-6">
            <h4 className="text-lg font-semibold text-gray-200 mb-4 text-left">What Just Happened?</h4>
            <ul className="text-gray-300 text-left space-y-3 mb-6">
              <li className="flex items-start">
                <span className="mr-3 mt-1">•</span>
                <span>You spent time answering meaningless questions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1">•</span>
                <span>You watched progress bars that went nowhere</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-1">•</span>
                <span>You fixed mysterious errors and technical issues</span>
              </li>
            </ul>
          </div>
          
          <div className="text-gray-300 mt-6 flex flex-col justify-between">
            <div className="flex flex-row items-center justify-center">
              <ThumbsUp size={18} className="mr-3 text-yellow-500 mr-2" />
              <span>Hope you had a laugh, and happy April Fools' Day!</span>
            </div>
            <div className="mt-2 text-right">-Danny</div>
          </div>
        </div>
      )}
      
      {showDetails && (
        <div className="flex space-x-4 animate-fade-in-delay-2">
          <button 
            onClick={onStartOver}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default RevealScreen; 