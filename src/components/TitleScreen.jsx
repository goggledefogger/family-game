import React from 'react';
import { Play, Award } from 'lucide-react';

const TitleScreen = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
      <div className="mb-8 text-yellow-500 animate-pulse">
        <Award size={64} />
      </div>
      <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">FAMILY FORTUNE</h1>
      <h2 className="text-xl mb-8 text-yellow-200">The Ultimate Family Game Show</h2>
      
      <p className="mb-8 text-gray-300">Compete with family members for amazing prizes in this turn-based game of skill, luck, and family knowledge!</p>
      
      <button 
        onClick={onStartGame}
        className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
      >
        <Play size={24} className="mr-2" />
        Start Game
      </button>
      
      <div className="mt-8 text-sm text-gray-400">
        <p>Version 1.4.2 • © 2025 Family Games Inc.</p>
      </div>
    </div>
  );
};

export default TitleScreen; 