import React, { useState, useEffect, useRef } from 'react';
import './CompetitiveCategories.css';

import freeFireImg from '../assets/FreeFire.png';
import bgmiImg from '../assets/BGMI.png';
import valorantImg from '../assets/VALORENT.png';
import stumbleImg from '../assets/Stumble guys.png';
import codImg from '../assets/call of duty.jpg';
import miniMilitiaImg from '../assets/MINI MILITIA.jpg';

const cardsData = [
  {
    id: 1,
    title: 'FREE FIRE',
    tag: 'MOBILE ROYALE',
    desc: 'Engage in intense 50-player battle royale clashes, custom squad tournaments, and fast-paced Clash Squad ladders designed for tactical mobile gamers.',
    image: freeFireImg,
    gradient: 'linear-gradient(135deg, #ff4655 0%, #b81c28 100%)'
  },
  {
    id: 2,
    title: 'BGMI',
    tag: 'BATTLE ROYALE',
    desc: 'Compete in official Battlegrounds Mobile India ladders, ranked squad tournaments, and custom room showdowns with real-time leaderboard ranking.',
    image: bgmiImg,
    gradient: 'linear-gradient(135deg, #ff9900 0%, #cc5500 100%)'
  },
  {
    id: 3,
    title: 'VALORANT',
    tag: '5v5 TACTICAL FPS',
    desc: 'Master high-stakes 5v5 tactical shooter brackets, agent lineups, and custom Spike Plant tournaments with verified match result analytics.',
    image: valorantImg,
    gradient: 'linear-gradient(135deg, #00bfff 0%, #0055ff 100%)'
  },
  {
    id: 4,
    title: 'CALL OF DUTY',
    tag: 'FPS COMBAT',
    desc: 'Dominate Search & Destroy tactical brackets and Warzone battle royale series across Mobile & PC esports ladders.',
    image: codImg,
    gradient: 'linear-gradient(135deg, #3a4a58 0%, #15222e 100%)'
  },
  {
    id: 5,
    title: 'STUMBLE GUYS',
    tag: 'PARTY KNOCKOUT',
    desc: 'Battle through chaotic 32-player obstacle sprint tournaments, knockout party races, and fast-action casual competitive cups.',
    image: stumbleImg,
    gradient: 'linear-gradient(135deg, #ff0077 0%, #aa0055 100%)'
  },
  {
    id: 6,
    title: 'MINI MILITIA & FORZA',
    tag: 'MULTIPLAYER CLASSICS',
    desc: 'Test your skills in nostalgic 2D Doodle Army skirmishes or high-octane Forza Horizon circuit racing tournaments.',
    image: miniMilitiaImg,
    gradient: 'linear-gradient(135deg, #00e5ff 0%, #0088cc 100%)'
  },
  {
    id: 7,
    title: 'BROWSE MORE GAMES',
    tag: 'ALL TOURNAMENTS',
    desc: 'Explore 10+ official gaming ladders, open community tournaments, weekend cups, and custom esports brackets across all major platforms.',
    gradient: 'linear-gradient(135deg, #9933ff 0%, #5500aa 100%)',
    isBrowse: true
  }
];

const CompetitiveCategories = () => {
  const [order, setOrder] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const cycleNext = () => {
    setOrder((prevOrder) => {
      const next = [...prevOrder];
      const front = next.shift();
      next.push(front);
      return next;
    });
  };

  const cyclePrev = () => {
    setOrder((prevOrder) => {
      const next = [...prevOrder];
      const back = next.pop();
      next.unshift(back);
      return next;
    });
  };

  const bringToFront = (targetIndex) => {
    setOrder((prevOrder) => {
      const pos = prevOrder.indexOf(targetIndex);
      if (pos === 0) return prevOrder;
      const next = [...prevOrder];
      const moved = next.splice(pos, 1)[0];
      next.unshift(moved);
      return next;
    });
  };

  useEffect(() => {
    if (isHovered) {
      intervalRef.current = setInterval(cycleNext, 1800);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered]);

  const activeCard = cardsData[order[0]];

  return (
    <div className="section-container" id="tournaments">
      <div className="section-header">
        <h2 className="section-title">Competitive Categories</h2>
        <p className="section-subtitle">
          Hover or click cards to cycle through our 7 active game ladders and tournament hubs.
        </p>
      </div>

      <div className="category-stack-section">
        {/* Left Side: Active Card Info & Controls */}
        <div className="active-card-info">
          <h3 className="info-category-tag">{activeCard.tag}</h3>
          <div className="info-game-title">Featured Game: {activeCard.title}</div>
          <p className="info-desc">{activeCard.desc}</p>

          <div className="stack-controls">
            <button className="ctrl-btn" onClick={cyclePrev} title="Previous Card">
              &larr;
            </button>
            <span className="card-counter">
              0{cardsData.indexOf(activeCard) + 1} / 07
            </span>
            <button className="ctrl-btn" onClick={cycleNext} title="Next Card">
              &rarr;
            </button>
          </div>

          <button className="explore-btn">
            {activeCard.isBrowse ? 'Browse All Games & Tournaments →' : `Explore ${activeCard.tag} Ladders →`}
          </button>
        </div>

        {/* Right Side: 7-Card Looping Stack Carousel */}
        <div
          className="loop-hover-zone"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="loop-stack">
            {cardsData.map((card, cardIdx) => {
              const pos = order.indexOf(cardIdx);
              return (
                <div
                  key={card.id}
                  className={`loop-layer pos-${pos} ${card.isBrowse ? 'card-browse' : ''}`}
                  onClick={() => bringToFront(cardIdx)}
                  style={{
                    background: card.image ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(${card.image}) center/cover no-repeat` : card.gradient
                  }}
                >
                  <div className="card-content">
                    <span className="card-category-tag">{card.tag}</span>
                    <span className="card-game-title">{card.title}</span>
                    {card.isBrowse && <span className="browse-arrow">&rarr;</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveCategories;
