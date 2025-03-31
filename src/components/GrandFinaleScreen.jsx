import React, { useState, useEffect } from 'react';
import { Trophy, Star, PartyPopper, Gift, Sparkles, Crown, Confetti } from 'lucide-react';

const GrandFinaleScreen = ({ playerName, onComplete }) => {
  const [stage, setStage] = useState(0);
  const [stars, setStars] = useState([]);
  
  // Generate star at random position
  const generateStar = () => {
    const size = Math.floor(Math.random() * 24) + 16;
    return {
      id: Math.random().toString(36).substring(7),
      x: Math.random() * 90 + 5, // 5-95% of width
      y: Math.random() * 90 + 5, // 5-95% of height
      size,
      delay: Math.random() * 1.5,
      duration: Math.random() * 1.5 + 1.5,
    };
  };
  
  // Start animation sequence when component mounts
  useEffect(() => {
    // Generate initial stars
    const initialStars = Array(15).fill().map(generateStar);
    setStars(initialStars);
    
    // Stage 1: congratulations
    const timer1 = setTimeout(() => setStage(1), 2000);
    
    // Stage 2: grand prize announcement
    const timer2 = setTimeout(() => setStage(2), 4000);
    
    // Stage 3: prize details
    const timer3 = setTimeout(() => setStage(3), 6000);
    
    // Stage 4: final celebration
    const timer4 = setTimeout(() => setStage(4), 8000);
    
    // Clean up timers
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);
  
  // Add stars periodically
  useEffect(() => {
    if (stage < 1) return;
    
    const interval = setInterval(() => {
      setStars(prev => [...prev.slice(-20), generateStar()]);
    }, 800);
    
    return () => clearInterval(interval);
  }, [stage]);
  
  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-lg mx-auto relative min-h-[80vh]">
      {/* Background stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        >
          <Star 
            size={star.size} 
            className="text-yellow-300 fill-yellow-300" 
          />
        </div>
      ))}
      
      {/* Stage 0: Initial Animation */}
      <div className={`transition-all duration-500 ${stage > 0 ? 'scale-[0.5] opacity-50 mb-8' : 'scale-100'}`}>
        <div className="animate-scale-in text-center">
          <Trophy size={80} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl text-white font-bold mb-2">CONGRATULATIONS!</h2>
          <p className="text-xl text-gray-300">Your Application is Complete</p>
        </div>
      </div>
      
      {/* Stage 1: Show grand prize */}
      {stage >= 1 && (
        <div className={`transition-all duration-500 ${stage > 1 ? 'scale-[0.8] opacity-80 mb-4' : 'scale-100'}`}>
          <div className="animate-scale-in bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-lg shadow-lg text-center border-2 border-yellow-400">
            <Crown size={48} className="text-yellow-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-white mb-2">Grand Prize Winner!</h3>
            <p className="text-gray-300">
              {playerName || 'Player'}, you've been selected for our exclusive reward!
            </p>
          </div>
        </div>
      )}
      
      {/* Stage 2: Show prize details */}
      {stage >= 2 && (
        <div className="animate-slide-in bg-black bg-opacity-80 p-6 rounded-lg shadow-lg border border-yellow-600 max-w-md mx-auto text-center">
          <div className="flex justify-center mb-4">
            <Gift size={48} className="text-red-500 mr-2" />
            <Sparkles size={48} className="text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Your PRIZE includes:</h3>
          <ul className="text-left space-y-3 mb-4">
            <li className="flex items-center text-gray-200">
              <span className="mr-2 text-yellow-400">•</span>
              A once-in-a-lifetime opportunity
            </li>
            <li className="flex items-center text-gray-200">
              <span className="mr-2 text-yellow-400">•</span>
              Exclusive access to premium content
            </li>
            <li className="flex items-center text-gray-200">
              <span className="mr-2 text-yellow-400">•</span>
              Recognition from our entire team
            </li>
          </ul>
        </div>
      )}
      
      {/* Stage 3: Final celebration */}
      {stage >= 3 && (
        <div className="animate-fade-in mt-6 text-center">
          <div className="flex justify-center mb-4">
            <PartyPopper size={32} className="text-pink-500 mr-4 animate-bounce" />
            <Confetti size={32} className="text-green-400 animate-bounce" />
          </div>
          <p className="text-xl text-white font-bold">
            Click below to claim your reward!
          </p>
        </div>
      )}
      
      {/* Continue button */}
      {stage >= 4 && (
        <button
          onClick={onComplete}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-105 animate-pulse"
        >
          CLAIM MY PRIZE
        </button>
      )}
      
      {/* Confetti effects for later stages */}
      {stage >= 2 && (
        <>
          <div className="absolute top-0 left-[10%] animate-float-slow">
            <Confetti size={24} className="text-yellow-400" />
          </div>
          <div className="absolute top-[5%] right-[15%] animate-float-medium">
            <Confetti size={20} className="text-pink-500" />
          </div>
          <div className="absolute bottom-[10%] left-[20%] animate-float-fast">
            <Confetti size={16} className="text-blue-400" />
          </div>
          <div className="absolute bottom-[15%] right-[10%] animate-float-medium">
            <Confetti size={22} className="text-green-400" />
          </div>
        </>
      )}
    </div>
  );
};

export default GrandFinaleScreen; 