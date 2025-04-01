import React from 'react';

const TreasureChest = ({ size = 24, className = "", ...props }) => {
  return (
    <img
      src="/gamelogo.svg"
      width={size}
      height={size}
      className={className}
      {...props}
      alt="Treasure chest"
    />
  );
};

export default TreasureChest;
