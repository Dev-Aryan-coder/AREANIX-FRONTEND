import React, { useState, useEffect, useRef } from 'react';
import './SupportedGames.css';

import bgmiImg from '../assets/BGMI.png';
import valorantImg from '../assets/VALORENT.png';
import freeFireImg from '../assets/FreeFire.png';
import stumbleImg from '../assets/Stumble guys.png';
import forzaImg from '../assets/forza horizan.jpg';
import fallGuysImg from '../assets/fall guys.jpg';
import amongUsImg from '../assets/Among us.jpg';
import minecraftImg from '../assets/minecraft.png';
import mobaLegendsImg from '../assets/moba legends.jpg';
import mortalKombatImg from '../assets/Mortal_Kombat_box_art.png';

const supportedGamesData = [
  {
    id: 'bgmi',
    title: 'BGMI',
    mode: 'Squad & Duo Battle Royale',
    image: bgmiImg,
    gradient: 'linear-gradient(135deg, #ff9900 0%, #cc5500 100%)',
    howItWorks: "In AREANIX, BGMI players join custom room lobbies via Room ID & Password distribution done by Organizer(Streamer/Youtuber). Match scores and kill counts are added by the Organizer & verified by Both Player & Organizer, Player will reveive XP points for the win the players will highlighted on Leaderboard."
  },
  {
    id: 'valorant',
    title: 'Valorant',
    mode: '5v5 Tactical FPS',
    image: valorantImg,
    gradient: 'linear-gradient(135deg, #ff4655 0%, #0055ff 100%)',
    howItWorks: "Add your Riot ID in profile to join official 5v5 Spike Plant tournament brackets. AREANIX provides automated map veto picks, custom server lobby creation, and real-time match result reporting with instant bracket progression.Player will reveive XP points for the win the players will highlighted on Leaderboard."
  },
  {
    id: 'freefire',
    title: 'Free Fire',
    mode: 'Survival Royale & Clash Squad',
    image: freeFireImg,
    gradient: 'linear-gradient(135deg, #ff4655 0%, #b81c28 100%)',
    howItWorks: "Enter fast-paced Battle Royale or Clash Squad custom lobbies. AREANIX coordinates rapid room code sharing, tracks player survival points & kills, Player will reveive XP points for the win the players will highlighted on Leaderboard."
  },
  {
    id: 'stumble',
    title: 'Stumble Guys',
    mode: 'Party Knockout Sprint',
    image: stumbleImg,
    gradient: 'linear-gradient(135deg, #ff0077 0%, #aa0055 100%)',
    howItWorks: "Participate in 32-player knockout party races. Join private custom room codes directly from your AREANIX match portal through Room password and id, sprint through obstacle rounds, Player will reveive XP points for the win the players will highlighted on Leaderboard."
  },
  {
    id: 'forza',
    title: 'Forza Horizon',
    mode: 'Circuit & Sprint Racing',
    image: forzaImg,
    gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
    howItWorks: "Compete in high-octane custom circuit races and time-attack sprints. Organizers share custom convoy/lobby codes on AREANIX, track lap times & finish placements, and award XP points to top drivers highlighted on the global Leaderboard."
  },
  {
    id: 'fallguys',
    title: 'Fall Guys',
    mode: 'Party Royale Knockout',
    image: fallGuysImg,
    gradient: 'linear-gradient(135deg, #ff00cc 0%, #333399 100%)',
    howItWorks: "Compete in custom 60-player obstacle race show lobbies. Streamers share custom match keys on AREANIX, track round eliminations, and award placement XP points to crown the ultimate Fall Guys champion."
  },
  {
    id: 'amongus',
    title: 'Among Us',
    mode: 'Social Deduction Scrims',
    image: amongUsImg,
    gradient: 'linear-gradient(135deg, #c62828 0%, #283593 100%)',
    howItWorks: "Join high-stakes private lobby matches via AREANIX room codes. Track Impostor and Crewmate win rates, submit game stats, and earn community XP points on the leaderboard."
  },
  {
    id: 'minecraft',
    title: 'Minecraft',
    mode: 'BedWars, SkyWars & Speedrun',
    image: minecraftImg,
    gradient: 'linear-gradient(135deg, #2e7d32 0%, #1565c0 100%)',
    howItWorks: "Compete in custom Minecraft BedWars, SkyWars, and Survival Speedrun tournaments. AREANIX connects server IP codes, registers team rosters, and auto-calculates tournament points for winner rewards."
  },
  {
    id: 'mobalegends',
    title: 'Mobile Legends',
    mode: '5v5 MOBA Arena',
    image: mobaLegendsImg,
    gradient: 'linear-gradient(135deg, #f57c00 0%, #7b1fa2 100%)',
    howItWorks: "Form your squad and enter official 5v5 MOBA custom lobby brackets. Organizers manage draft pick bans, track MVP scores, and grant rank XP points to top squads on AREANIX."
  },
  {
    id: 'mortalkombat',
    title: 'Mortal Kombat',
    mode: '1v1 Fighting Bracket',
    image: mortalKombatImg,
    gradient: 'linear-gradient(135deg, #d32f2f 0%, #212121 100%)',
    howItWorks: "Compete in double-elimination 1v1 fighting game brackets. Players report match round scores, organizers verify video proof, and winners advance toward the AREANIX championship belt."
  }
];

const SupportedGames = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef([]);
  const wrapperRef = useRef(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % supportedGamesData.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + supportedGamesData.length) % supportedGamesData.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const activeCard = cardRefs.current[activeIndex];
    const wrapper = wrapperRef.current;
    if (activeCard && wrapper) {
      const cardOffsetLeft = activeCard.offsetLeft;
      const cardWidth = activeCard.offsetWidth;
      const wrapperWidth = wrapper.offsetWidth;
      wrapper.scrollTo({
        left: cardOffsetLeft - wrapperWidth / 2 + cardWidth / 2,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const currentGame = supportedGamesData[activeIndex];

  return (
    <div className="section-container" id="games">
      <div className="section-header">
        <h2 className="section-title">Supported Games of Mobile/PC</h2>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          {[...Array(3)].map((_, loopIdx) => (
            <React.Fragment key={loopIdx}>
              <span className="marquee-item"><span className="marquee-icon">⚡</span> <span className="marquee-tag">AREANIX</span></span>
              <span className="marquee-item"><span className="marquee-icon">🏆</span> ESPORTS</span>
              <span className="marquee-item"><span className="marquee-icon">🎮</span> NON-TRADITIONAL COMPETITIVE GAMES!</span>
              <span className="marquee-item"><span className="marquee-icon">🎯</span> AUTOMATED MATCHMAKING</span>
              <span className="marquee-item"><span className="marquee-icon">📡</span> STREAMERS & YOUTUBERS SCRIMS</span>
              <span className="marquee-item"><span className="marquee-icon">💎</span> DIRECT REWARDS</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="supported-games-layout">
        {/* Left Side: Game Workflow Description */}
        <div className="game-workflow-panel">
          <span className="workflow-badge">How It Works On AREANIX</span>
          <h3 className="workflow-game-title">{currentGame.title}</h3>
          <p className="workflow-game-mode">{currentGame.mode}</p>
          <p className="workflow-desc">{currentGame.howItWorks}</p>

          <div className="carousel-nav-controls">
            <button className="carousel-arrow" onClick={prevSlide} title="Previous Game">&larr;</button>
            <div className="carousel-dots">
              {supportedGamesData.map((_, idx) => (
                <span
                  key={idx}
                  className={`dot ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                />
              ))}
            </div>
            <button className="carousel-arrow" onClick={nextSlide} title="Next Game">&rarr;</button>
          </div>
        </div>

        {/* Right Side: Small Card Carousel */}
        <div className="carousel-container-right">
          <div className="carousel-cards-wrapper" ref={wrapperRef}>
            {supportedGamesData.map((game, idx) => (
              <div
                key={game.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                className={`mini-game-card ${idx === activeIndex ? 'active-card' : ''}`}
                onClick={() => setActiveIndex(idx)}
                style={{
                  background: game.image
                    ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url("${game.image}") center/cover no-repeat`
                    : game.gradient
                }}
              >
                <div className="mini-card-content">
                  <span className="mini-card-title">{game.title}</span>
                  <span className="mini-card-mode">{game.mode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="games-footer-info">
        <p className="games-footer-text">
          Whether you compete in official esports titles or host custom community scrims, AREANIX provides fully automated brackets, custom room match tracking, and instant result processing for all major titles. Organizers, Streamers, and Content Creators can easily launch custom tournaments for their audience—even for non-traditional competitive games!
        </p>
      </div>
    </div>
  );
};

export default SupportedGames;
