import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
  const playerSteps = [
    {
      num: '01',
      badge: '👤 REGISTRATION',
      title: 'Register & Select "Player"',
      desc: 'Register your account on AREANIX, select the "PLAYER" role, and fill in your basic profile details.'
    },
    {
      num: '02',
      badge: '🎮 GAME IDENTITY',
      title: 'Add Game Names & IDs',
      desc: 'Link your actual in-game names (IGN) and unique Game UIDs for supported titles like BGMI, Valorant, and Free Fire.'
    },
    {
      num: '03',
      badge: '⚔️ COMPETITION',
      title: 'Participate in Tournaments',
      desc: 'Browse open brackets, join custom room scrims with organizer Room IDs & Passwords, and play competitive matches.'
    },
    {
      num: '04',
      badge: '🏆 REWARDS & RANK',
      title: 'Earn XP & Climb Leaderboard',
      desc: 'Secure victories, earn XP points for every win, and compete to dominate the top ranks on the AREANIX Leaderboard.'
    }
  ];

  const recruiterSteps = [
    {
      num: '01',
      badge: '💼 RECRUITER SETUP',
      title: 'Register & Select "Recruiter"',
      desc: 'Create your AREANIX account, select the "RECRUITER" role, and set up your organization or team profile.'
    },
    {
      num: '02',
      badge: '🔍 SCOUT TALENT',
      title: 'Scout Top Gamers',
      desc: 'Explore verified player profiles, inspect actual in-game IDs, match statistics, and leaderboard XP rankings.'
    },
    {
      num: '03',
      badge: '🛡️ TEAM BUILDING',
      title: 'Recruit & Build Roster',
      desc: 'Send team invites to top talent, recruit star players, and assemble your official esports squad.'
    },
    {
      num: '04',
      badge: '⚔️ SQUAD TOURNAMENTS',
      title: 'Enter Team Tournaments',
      desc: 'Register your recruited squad into major tournaments, compete for team glory, and dominate the team leaderboard!'
    }
  ];

  const organizerSteps = [
    {
      num: '01',
      badge: '📡 ORGANIZER SETUP',
      title: 'Register & Select "Organizer"',
      desc: 'Sign up on AREANIX, select the "ORGANIZER" role (Streamers & YouTubers), and link your channel details.'
    },
    {
      num: '02',
      badge: '🏆 CREATE TOURNAMENT',
      title: 'Publish Tournaments & Media',
      desc: 'Create custom tournaments, upload video thumbnail images, attach YouTube URLs, and set Room IDs & Passwords.'
    },
    {
      num: '03',
      badge: '🎥 LIVE STREAM SCRIMS',
      title: 'Host & Broadcast Scrims',
      desc: 'Host competitive custom rooms for Solo, Duo, or Squad play and stream live directly to your community audience.'
    },
    {
      num: '04',
      badge: '🎁 AWARD XP POINTS',
      title: 'Verify & Reward Winners',
      desc: 'Award XP points to winning Solo, Duo, or Squad champions post-match to highlight top performers on the Leaderboard.'
    }
  ];

  return (
    <div className="section-container" id="how-it-works">
      {/* Player Section */}
      <div className="section-block">
        <div className="section-header">
          <h2 className="section-title">How AREANIX Works For Players</h2>
          <p className="section-subtitle">
            From registration to leaderboard glory—your 4-step journey to competitive esports success.
          </p>
        </div>

        <div className="steps-grid">
          {playerSteps.map((step, idx) => (
            <div key={idx} className="step-card player-card">
              <span className="step-badge player-badge">{step.badge}</span>
              <div className="step-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="how-it-works-divider" />

      {/* Recruiter Section */}
      <div className="section-block recruiter-block">
        <div className="section-header">
          <h2 className="section-title recruiter-title">How AREANIX Works For Recruiters</h2>
          <p className="section-subtitle">
            Scout top talent, build dream esports rosters, and enter official team tournaments.
          </p>
        </div>

        <div className="steps-grid">
          {recruiterSteps.map((step, idx) => (
            <div key={idx} className="step-card recruiter-card">
              <span className="step-badge recruiter-badge">{step.badge}</span>
              <div className="step-number recruiter-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="how-it-works-divider" />

      {/* Organizer Section */}
      <div className="section-block organizer-block">
        <div className="section-header">
          <h2 className="section-title organizer-title">How AREANIX Works For Organizers (Streamers/YouTubers)</h2>
          <p className="section-subtitle">
            Host custom tournaments, embed YouTube stream videos, distribute room credentials, and reward winning players with XP points.
          </p>
        </div>

        <div className="steps-grid">
          {organizerSteps.map((step, idx) => (
            <div key={idx} className="step-card organizer-card">
              <span className="step-badge organizer-badge">{step.badge}</span>
              <div className="step-number organizer-number">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
