import React, { useState, useEffect, useRef } from 'react';
import './IntroVideo.css';
import introVideoSrc from '../assets/Video_loading_before_website_202608101223.mp4';

const IntroVideo = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Attempt to autoplay with sound
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Browser blocked autoplay with sound
          setIsBlocked(true);
        });
      }
    }
  }, []);

  const handleVideoEnd = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 500); // Wait for fade out animation to finish
  };

  const handleSkip = () => {
    handleVideoEnd();
  };

  const handleManualPlay = () => {
    setIsBlocked(false);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <div className={`intro-video-container ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="intro-video-frame">
          <video
            ref={videoRef}
            className="intro-video"
            playsInline
            onEnded={handleVideoEnd}
          >
            <source src={introVideoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <button className="intro-skip-btn" onClick={handleSkip}>
            Skip Intro
          </button>
        </div>

      <div className="intro-cutout">
        <button 
          className="intro-play-btn" 
          onClick={handleManualPlay}
        >
          Unleash the Hype
        </button>
      </div>
    </div>
  );
};

export default IntroVideo;
