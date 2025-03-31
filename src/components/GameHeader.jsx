import React from 'react';
import { Award } from 'lucide-react';

const GameHeader = () => {
  return (
    <header className="text-center py-4 mb-2">
      <div className="inline-flex items-center justify-center">
        <Award size={30} className="text-yellow-500 animate-pulse mr-3" />
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent relative overflow-hidden animate-glisten">
          BAUMAN FAMILY FORTUNE
          <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-100 to-transparent opacity-30 animate-shine"></span>
        </h1>
      </div>
      <div className="text-sm text-yellow-200 mt-1">The Ultimate Family Game Show</div>
    </header>
  );
};

export default GameHeader; 