
import React from 'react';

interface StampProps {
  stamp: string;
  top: string;
}

const Stamp: React.FC<StampProps> = ({ stamp, top }) => {
  return (
    <div
      className="absolute text-4xl md:text-5xl whitespace-nowrap animate-fly-across"
      style={{
        top,
        right: '0',
        transform: 'translateX(100%)',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
      }}
    >
      {stamp}
    </div>
  );
};

export default Stamp;
