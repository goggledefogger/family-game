import React, { useEffect, useState } from 'react';

const BackgroundEffects = ({ isPlaying }) => {
  const [particles, setParticles] = useState([]);
  const [treasures, setTreasures] = useState([]);

  // Generate particles and treasures only once on mount
  useEffect(() => {
    // Initial generation
    generateParticles();
    generateTreasures();

    // Refresh interval
    const refreshInterval = setInterval(() => {
      generateParticles();
      generateTreasures();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []); // Empty dependency array means this only runs once on mount

  // Function to generate new particles
  const generateParticles = () => {
    const newParticles = Array(20).fill().map(() => ({
      id: Math.random().toString(36).substring(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 12 + 4,
      color: getRandomColor(),
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 8,
    }));

    setParticles(newParticles);
  };

  // Function to generate treasures and coins
  const generateTreasures = () => {
    const treasureEmojis = ['💰', '🪙', '💎', '👑', '✨', '🏆', '🔮'];
    const count = 12;

    const newTreasures = Array(count).fill().map(() => ({
      id: Math.random().toString(36).substring(2, 9),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 18 + 8,
      emoji: treasureEmojis[Math.floor(Math.random() * treasureEmojis.length)],
      rotation: Math.random() * 360,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 15,
    }));

    setTreasures(newTreasures);
  };

  // Generate random colors
  const getRandomColor = () => {
    const colors = [
      'rgba(255, 215, 0, 0.75)', // gold
      'rgba(255, 99, 71, 0.7)',  // tomato
      'rgba(0, 206, 209, 0.7)',  // turquoise
      'rgba(147, 112, 219, 0.7)', // purple
      'rgba(50, 205, 50, 0.7)',  // lime
      'rgba(255, 105, 180, 0.65)', // pink
      'rgba(30, 144, 255, 0.7)',  // blue
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className={`background-effects ${isPlaying ? 'effects-active' : 'effects-muted'}`}>
      {/* Regular particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      {/* Treasure elements */}
      {treasures.map((treasure, index) => (
        <div
          key={treasure.id}
          className={`treasure-item ${!isPlaying && index >= 8 ? 'treasure-hidden' : ''}`}
          style={{
            left: `${treasure.x}%`,
            top: `${treasure.y}%`,
            fontSize: `${treasure.size}px`,
            transform: `rotate(${treasure.rotation}deg)`,
            animationDuration: `${treasure.duration}s`,
            animationDelay: `${treasure.delay}s`,
          }}
        >
          {treasure.emoji}
        </div>
      ))}
    </div>
  );
};

export default BackgroundEffects;
