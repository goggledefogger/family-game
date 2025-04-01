import React from 'react';
import TreasureChest from './TreasureChest';

const GameHeader = () => {
  return (
    <header className="text-center py-4 mb-2">
      <div className="flex flex-row items-center justify-center">
        <div className="mr-4 md:mr-6">
          <TreasureChest size={80} className="md:w-[120px] md:h-[120px] w-[80px] h-[80px] text-yellow-500" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent relative overflow-hidden animate-glisten">
            BAUMAN FAMILY TREASURE
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-100 to-transparent opacity-30 animate-shine"></span>
          </h1>
          <div className="text-sm text-yellow-200 mt-1">The Ultimate Family Game Show</div>
        </div>
      </div>
    </header>
  );
};

export default GameHeader; 