import React, { useEffect, useState } from 'react';

const BackgroundEffects = ({ isPlaying }) => {
  const [particles, setParticles] = useState([]);

  // Generate particles only once on mount, not when audio state changes
  useEffect(() => {
    // Generate initial set of particles
    generateParticles();

    // Set up a refresh interval to regenerate particles occasionally
    // This keeps animations fresh regardless of audio state
    const refreshInterval = setInterval(() => {
      generateParticles();
    }, 30000); // Refresh particles every 30 seconds

    return () => {
      clearInterval(refreshInterval);
    };
  }, []); // Only run once on mount

  // Function to generate new particles
  const generateParticles = () => {
    const newParticles = Array(30).fill().map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100, // position across viewport width (%)
      y: Math.random() * 100, // position across viewport height (%)
      size: Math.random() * 15 + 5, // size between 5-20px
      color: getRandomColor(),
      duration: Math.random() * 15 + 10, // animation duration 10-25s
      delay: Math.random() * 5, // delay 0-5s
    }));

    setParticles(newParticles);
  };

  // Generate random vibrant colors
  const getRandomColor = () => {
    const colors = [
      '#FFD700', // gold
      '#FF6347', // tomato
      '#00CED1', // dark turquoise
      '#9370DB', // medium purple
      '#32CD32', // lime green
      '#FF69B4', // hot pink
      '#1E90FF', // dodger blue
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className={`background-effects ${isPlaying ? 'effects-active' : 'effects-muted'}`}>
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
    </div>
  );
};

export default BackgroundEffects;
