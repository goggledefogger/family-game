import React, { useState, useEffect } from 'react';
import { Frown, Laugh, Calendar, Skull, ThumbsUp } from 'lucide-react';
import TreasureChest from './TreasureChest';

const RevealScreen = ({ playerName, onStartOver }) => {
  const [revealStage, setRevealStage] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [emojis, setEmojis] = useState([]);

  // Emoji collection for April Fools
  const funEmojis = ['🤡', '😂', '🎭', '🎪', '🃏', '😜', '🎯', '🎉', '🎊', '🤪'];

  useEffect(() => {
    // Sequence of reveal animations
    const sequence = [
      setTimeout(() => setRevealStage(1), 1000), // Treasure chest animation
      setTimeout(() => setRevealStage(2), 3000), // Calendar A4 appears
      setTimeout(() => setRevealStage(3), 4500), // Prize cancellation
      setTimeout(() => setRevealStage(4), 6000), // April Fools text
      setTimeout(() => setShowDetails(true), 7500) // Show explanation
    ];

    return () => sequence.forEach(timeout => clearTimeout(timeout));
  }, []);

  // Generate floating emojis when the April Fools text appears
  useEffect(() => {
    if (revealStage >= 4) {
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
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 max-w-lg mx-auto text-center relative min-h-[80vh]">
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

      <div className="relative mb-6 w-full flex justify-center">
        <TreasureChest
          size={revealStage >= 1 ? 240 : 120}
          className={`text-yellow-500 transition-all duration-1000
            ${revealStage === 1 ? 'animate-treasure-shake' : ''}
            ${revealStage >= 1 ? 'scale-125' : ''}
            ${revealStage >= 3 ? 'opacity-50' : ''}`}
        />
        {revealStage >= 2 && (
          <div className="absolute inset-0 flex items-center justify-center animate-grow-in">
            <div className="neon-calendar text-2xl sm:text-3xl p-2 sm:p-3 flex flex-col items-center"
                style={{
                  minWidth: "50px",
                  minHeight: "60px",
                  width: revealStage >= 1 ? "25%" : "20%",
                  maxWidth: "80px"
                }}>
              <div className="text-xs sm:text-sm mb-1">APR</div>
              <div className="font-bold leading-none">4</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 w-full px-4 sm:px-0">
        {revealStage >= 1 && (
          <div className={`animate-slide-in transition-all duration-500 ${revealStage >= 3 ? 'line-through opacity-50' : ''}`}>
            <p className="text-xl sm:text-2xl text-white mb-2">You're the winner of...</p>
            {revealStage >= 3 && (
              <Frown size={32} className="text-gray-400 mx-auto mb-4" />
            )}
          </div>
        )}

        {revealStage >= 4 && (
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-yellow-400 animate-bounce-in">
            APRIL FOOLS!
          </h2>
        )}

        {revealStage >= 4 && (
          <div className="animate-fade-in-delay">
            <p className="text-lg sm:text-xl text-white mb-6">
              Congrats on even making it this far, {playerName}!
            </p>

            <div className="flex justify-center items-center mb-6 space-x-4">
              <Calendar size={24} className="text-red-400" />
              <span className="text-lg sm:text-xl font-bold text-red-400">April 1st</span>
              <Laugh size={24} className="text-yellow-400 animate-pulse" />
            </div>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 sm:p-8 mb-8 max-w-md w-full mx-4 sm:mx-auto animate-fade-in">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-400">You Win Nothing</h3>
            <Skull size={20} className="text-gray-400" />
          </div>

          <p className="text-sm sm:text-base text-gray-300 mb-6 text-left">
            Sorry to disappoint, but April Fools! Believe it or not, there's no Bauman Family Treasure game show, just a series of screens to waste your time and drive you a little crazy.
          </p>

          <div className="border-t border-gray-700 pt-6 mt-6">
            <h4 className="text-md sm:text-lg font-semibold text-gray-200 mb-4 text-left">What Just Happened?</h4>
            <ul className="text-sm sm:text-base text-gray-300 text-left space-y-3 mb-6">
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

          <div className="text-sm sm:text-base text-gray-300 mt-6 flex flex-col justify-between">
            <div className="flex flex-row items-center justify-center">
              <ThumbsUp size={18} className="mr-3 text-yellow-500 mr-2" />
              <span>Hope you had a laugh, and happy April Fools Day 2025!</span>
            </div>
            <div className="mt-2 text-right">-Danny</div>
          </div>
        </div>
      )}

      {showDetails && (
        <div className="flex space-x-4 animate-fade-in-delay-2 w-full justify-center">
          <button
            onClick={onStartOver}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 sm:px-6 rounded-full text-sm sm:text-base"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default RevealScreen;
