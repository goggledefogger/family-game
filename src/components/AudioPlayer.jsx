import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Music } from 'lucide-react';
import BackgroundEffects from './BackgroundEffects';

const AudioPlayer = forwardRef(({ audioSrc, onMusicChange = () => {} }, ref) => {
  const [isMuted, setIsMuted] = useState(true); // Start muted to avoid autoplay issues
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);
  const hasInitialized = useRef(false);

  // Expose functions to parent components
  useImperativeHandle(ref, () => ({
    unmute: () => {
      if (isMuted) {
        toggleMute();
      }
    }
  }));

  // Initial setup only once
  useEffect(() => {
    console.log("AudioPlayer mounted");

    // Show button after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        console.log("Cleaning up audio");
        audioRef.current.pause();
      }
    };
  }, []);

  // Setup audio element when ref is attached
  useEffect(() => {
    if (audioRef.current && !hasInitialized.current) {
      console.log("Initializing audio element");

      // Set basic properties
      audioRef.current.loop = true;
      audioRef.current.volume = 1.0;
      audioRef.current.muted = true; // Start muted

      // Load the audio
      audioRef.current.load();

      // Try to play (will likely be blocked)
      try {
        audioRef.current.play()
          .then(() => {
            console.log("Audio autoplay succeeded");
            onMusicChange(true);
          })
          .catch(error => {
            console.log("Audio autoplay blocked:", error);
            // Already muted by default
            onMusicChange(false);
          });
      } catch (e) {
        console.log("Audio play error:", e);
      }

      hasInitialized.current = true;
    }
  }, [audioSrc, onMusicChange]);

  // Simple toggle function
  const toggleMute = () => {
    console.log("Toggle mute clicked, current state:", isMuted);

    if (!audioRef.current) {
      console.log("Audio element not found");
      return;
    }

    const newMutedState = !isMuted;
    console.log("Setting new muted state:", newMutedState);

    // Set the muted state on the audio element
    audioRef.current.muted = newMutedState;

    // If we're unmuting, make sure it's playing
    if (!newMutedState) {
      console.log("Unmuting, attempting to play");
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.log("Play after unmute failed:", e);
          });
        }
      } catch (e) {
        console.log("Play error:", e);
      }
      onMusicChange(true);
    } else {
      onMusicChange(false);
    }

    // Update state
    setIsMuted(newMutedState);
  };

  return (
    <>
      {/* Background effects always visible with varying intensity */}
      <BackgroundEffects isPlaying={!isMuted} />

      {/* Audio element - always present, never removed from DOM */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        muted={isMuted}
        preload="auto"
      />

      {/* Button with absolute positioning to ensure it stays in the bottom right */}
      {isVisible && (
        <div
          className="audio-button-enter"
          style={{
            position: 'fixed',
            bottom: '8px',
            right: '8px',
            zIndex: 50,
          }}
        >
          <button
            onClick={toggleMute}
            className={`bg-gray-800 hover:bg-gray-700 p-2 rounded-full flex items-center justify-center transition-colors shadow-lg border border-gray-700 ${!isMuted ? 'audio-button-active' : ''}`}
            aria-label={isMuted ? "Unmute background music" : "Mute background music"}
          >
            {isMuted ? (
              <Music size={18} className="text-gray-300" style={{ opacity: 0.5 }} />
            ) : (
              <Music size={18} className="text-yellow-400" />
            )}
          </button>
        </div>
      )}
    </>
  );
});

export default AudioPlayer;
