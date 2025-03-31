import React from 'react';
import { Award } from 'lucide-react';

const GameHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-4 mb-2">
      <div className="flex items-center mb-1">
        <Award size={36} className="text-yellow-500 mr-3 animate-pulse" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent relative overflow-hidden">
          BAUMAN FAMILY FORTUNE
          <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-100 to-transparent opacity-30 animate-shine"></span>
        </h1>
      </div>
      <div className="text-sm text-yellow-200">The Ultimate Family Game Show</div>
    </div>
  );
};

export default GameHeader; 