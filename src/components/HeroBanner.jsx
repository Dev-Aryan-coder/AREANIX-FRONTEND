import React, { useState, useRef } from 'react';
import './HeroBanner.css';
import heroVideoSrc from '../assets/Electric_blue_light_band_background_202608111514.mp4';
import anthemAudioSrc from '../assets/Metal and Stone.mp3';

const HeroBanner = ({ setActivePage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const lyrics = [
    { section: 'Intro', text: ['(Areanix)', '(Areanix)', 'Step up'] },
    { section: 'Chorus', text: ['Areanix, claim the throne', 'I am metal, I am stone', 'Areanix, claim the throne', 'I am metal, I am stone', 'Cold blood, heavy hands', 'Rule the floor, rule these lands', 'Cold blood, heavy hands', 'Rule the floor, rule these lands'] },
    { section: 'Verse', text: ["I was soft, now I'm steel", 'Face the pressure, make it real', 'Fast pace, high speed', 'Cut the line, take the lead', 'Areanix, feel the power', 'This is my final hour', 'No weakness, no delay', 'Sweep the rivals all away', "Areanix, we don't play", "Areanix, we don't play"] },
    { section: 'Outro', text: ['(Areanix)', 'I am stone', '(Areanix)', 'Claim the throne', 'Shut them down', 'Shut them down'] }
  ];

  return (
    <div className="hero-banner">
      <video
        className="hero-banner-video"
        src={heroVideoSrc}
        autoPlay
        loop
        muted
        playsInline
      />

      <audio
        ref={audioRef}
        src={anthemAudioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
      />

      <div className="hero-banner-overlay">
        <div className="hero-banner-content">
          <div className="hero-anthem-badge">
            <span className="badge-pulse"></span>
            AREANIX OFFICIAL ANTHEM &bull; METAL AND STONE
          </div>

          <h1 className="hero-banner-title">
            Start your Journey with<br />
            <span className="hero-title-brand">AREANIX</span>
          </h1>
          <p className="hero-banner-subtitle">
            Guiding You Towards Unprecedented Success with Strategies and GamePlay
          </p>

          <div className="hero-actions-container">
            <button
              className="hero-banner-btn primary-btn"
              onClick={() => setActivePage && setActivePage('register')}
            >
              Sign Up <span className="hero-btn-arrow">&rarr;</span>
            </button>

            <button
              className={`hero-banner-btn audio-btn ${isPlaying ? 'playing' : ''}`}
              onClick={toggleAudio}
            >
              <span className="audio-icon">{isPlaying ? '⏸' : '▶'}</span>
              <span>{isPlaying ? 'Pause Anthem' : 'Play Song'}</span>
              {isPlaying && (
                <div className="equalizer-visualizer">
                  <span></span><span></span><span></span>
                </div>
              )}
            </button>

            <button
              className="hero-banner-btn lyrics-btn"
              onClick={() => setShowLyrics(!showLyrics)}
            >
              <span className="lyrics-icon">📜</span>
              <span>{showLyrics ? 'Hide Lyrics' : 'View Lyrics'}</span>
            </button>
          </div>

          {/* Persistent Floating Audio Bar when music is playing */}
          {isPlaying && (
            <div className="hero-mini-player-bar">
              <span className="player-track-name">🎵 Metal and Stone</span>
              <div className="player-progress-container">
                <span className="time-text">{formatTime(currentTime)}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="time-text">{formatTime(duration)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Glassmorphic Lyrics Overlay Drawer */}
      {showLyrics && (
        <div className="lyrics-modal-backdrop" onClick={() => setShowLyrics(false)}>
          <div className="lyrics-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="lyrics-close-btn" onClick={() => setShowLyrics(false)}>&times;</button>
            <div className="lyrics-header">
              <span className="anthem-tag">AREANIX OFFICIAL ANTHEM</span>
              <h2>Metal and Stone</h2>
              <p>Rule the floor, rule these lands</p>
            </div>
            <div className="lyrics-body">
              {lyrics.map((block, idx) => (
                <div key={idx} className="lyrics-block">
                  <h4 className="lyrics-section-title">[{block.section}]</h4>
                  {block.text.map((line, lineIdx) => (
                    <p key={lineIdx} className="lyrics-line">{line}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="hero-banner-bottom-fade" />
    </div>
  );
};

export default HeroBanner;

