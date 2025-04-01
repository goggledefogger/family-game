import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2 } from 'lucide-react';

const AudioPlayer = ({ audioSrc }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Delay making the button visible for a smoother entry
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    if (audioRef.current) {
      audioRef.current.loop = true;

      // Attempt to play when component mounts
      const playPromise = audioRef.current.play();

      // Handle autoplay restrictions
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay started successfully
          })
          .catch(error => {
            // Autoplay was prevented, we'll need user interaction
            console.log('Autoplay prevented:', error);
            setIsMuted(true); // Set to muted if autoplay fails
          });
      }
    }

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioSrc]);

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.muted = false;
        audioRef.current.play();
      } else {
        audioRef.current.muted = true;
      }
      setIsMuted(!isMuted);
    }
  };

  if (!isVisible) return <audio ref={audioRef} src={audioSrc} loop muted={isMuted} />;

  return (
    <div className="fixed bottom-4 right-4 z-50 audio-button-enter">
      <audio ref={audioRef} src={audioSrc} loop muted={isMuted} />
      <button
        onClick={toggleMute}
        className={`bg-gray-800 hover:bg-gray-700 p-3 rounded-full flex items-center justify-center transition-colors shadow-lg border border-gray-700 ${!isMuted ? 'audio-button-active' : ''}`}
        aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      >
        {isMuted ? (
          <Music size={20} className="text-gray-300" style={{ opacity: 0.5 }} />
        ) : (
          <Music size={20} className="text-yellow-400" />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
