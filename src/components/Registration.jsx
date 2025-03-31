import React from 'react';
import { User } from 'lucide-react';

const Registration = ({ playerName, setPlayerName, onSubmit }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Player Registration</h2>
      
      <div className="w-full max-w-md">
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Your Name:</label>
          <input 
            type="text" 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            placeholder="Enter your name"
          />
        </div>
        
        <button 
          onClick={onSubmit}
          disabled={!playerName.trim()}
          className={`w-full flex items-center justify-center py-3 px-6 rounded font-bold ${
            playerName.trim() ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          <User size={20} className="mr-2" />
          Register Player
        </button>
      </div>
    </div>
  );
};

export default Registration; 