import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  return (
    <div className="section-container" id="why-choose-us">
      <div className="why-choose-wrapper">
        <div className="section-header">
          <span className="why-choose-badge">EXCELLENCE IN ESPORTS</span>
          <h2 className="section-title">Why Choose AREANIX ?</h2>
        </div>

        <div className="why-choose-content-box">
          <p className="why-choose-paragraph">
            AREANIX is built from the ground up to revolutionize India’s esports landscape by empowering players, team recruiters, and community content creators within a single unified ecosystem. Whether you are an aspiring player seeking verified XP rankings and tournament glory, an esports recruiter scouting top-tier gaming talent, or a streamer & YouTuber launching custom community scrims with embedded live streams, AREANIX provides automated room distribution, real-time leaderboard tracking, and verified reward distribution. By bridging the gap between casual custom matches and professional esports circuits, AREANIX gives every gamer the platform they need to compete, grow, and get recognized.
          </p>

          <div className="why-choose-highlights">
            <div className="highlight-pill">
              <span className="highlight-icon">⚡</span>
              <span className="highlight-text">Automated Matchmaking & Room ID Sharing</span>
            </div>
            <div className="highlight-pill">
              <span className="highlight-icon">🏆</span>
              <span className="highlight-text">Verified XP Points & Live Leaderboards</span>
            </div>
            <div className="highlight-pill">
              <span className="highlight-icon">📡</span>
              <span className="highlight-text">Streamer & YouTuber Scrim Embeds</span>
            </div>
            <div className="highlight-pill">
              <span className="highlight-icon">🛡️</span>
              <span className="highlight-text">Esports Scout & Talent Recruitment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
