import React from 'react';
import './PlatformFeatures.css';
import arenaImg from '../assets/qudos_bank_arena_sydney.avif';

const PlatformFeatures = () => {
  return (
    <div className="who-we-are-container">
      <div className="who-we-are-image-wrapper">
        <img
          src={arenaImg}
          alt="Qudos Bank Arena Sydney Esports"
          className="who-we-are-img"
        />
      </div>

      <div className="who-we-are-divider" />

      <div className="who-we-are-content">
        <h2 className="who-we-are-title">Who we are ?</h2>
        <p className="who-we-are-desc">
          Areanix is India's Premier Esports Ecosystem designed for the next generation of competitive gamers.
          We connect amateur and semi-professional athletes through a seamless tournament platform,
          providing organized competition, automated matchmaking, and direct reward distribution.
          We provide platform to all the gamer's who wants to play competitive game's and show case their hidden talent through our platform.
          No matter you are newbie or pro , we are here to provide you the best platform to compete and grow.
        </p>
      </div>
    </div>
  );
};

export default PlatformFeatures;
