import React from 'react';
import { UserRound, ArrowRight } from 'lucide-react';

const Registration = ({ playerName, setPlayerName, onSubmit, stepLabel }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Player Registration</h2>
      
      <div className="w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="playerName" className="block text-gray-300 mb-2">Enter your name to begin:</label>
          <div className="flex">
            <div className="bg-gray-800 border border-gray-600 rounded-l p-2 flex items-center">
              <UserRound size={24} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-gray-800 border-t border-r border-b border-gray-600 rounded-r p-2 text-white focus:outline-none focus:border-yellow-400"
              placeholder="Your name"
            />
          </div>
        </div>
        
        <button 
          onClick={onSubmit}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center"
          disabled={!playerName.trim()}
        >
          <span>Start Game</span>
          <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
      
      <div className="text-xs text-gray-500 mt-6">
        {stepLabel}
      </div>
    </div>
  );
};

export default Registration; 