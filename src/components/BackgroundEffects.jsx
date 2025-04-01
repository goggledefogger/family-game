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
    const newParticles = Array(12).fill().map(() => ({
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * 100, // position across viewport width (%)
      y: Math.random() * 100, // position across viewport height (%)
      size: Math.random() * 8 + 2, // Smaller size range: 2-10px
      color: getRandomColor(),
      duration: Math.random() * 20 + 15, // Slower animation: 15-35s
      delay: Math.random() * 8, // More varied delays: 0-8s
    }));

    setParticles(newParticles);
  };

  // Generate random more subdued colors
  const getRandomColor = () => {
    const colors = [
      'rgba(255, 215, 0, 0.6)', // gold
      'rgba(255, 99, 71, 0.5)', // tomato
      'rgba(0, 206, 209, 0.5)', // turquoise
      'rgba(147, 112, 219, 0.5)', // purple
      'rgba(50, 205, 50, 0.5)', // lime
      'rgba(255, 105, 180, 0.4)', // pink
      'rgba(30, 144, 255, 0.5)', // blue
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
