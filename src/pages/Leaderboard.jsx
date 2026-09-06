import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Leaderboard = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/leaderboard/xp')
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setRankings(data);
        } else if (data && typeof data === 'object') {
          setRankings([data]);
        } else {
          setRankings([]);
        }
      })
      .catch((err) => {
        setError(err.message);
        setRankings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />
      <div className="page-content" style={{ padding: '120px 40px 60px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="page-title" style={{ fontFamily: 'Oxanium', color: '#00bfff', fontSize: '36px', textAlign: 'center', marginBottom: '10px' }}>GLOBAL XP LEADERBOARD</h1>
        <p className="page-subtitle" style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px' }}>Global player rankings based on total XP</p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#00bfff', fontSize: '18px' }}>⚡ Loading XP standings...</p>
        ) : rankings.length > 0 ? (
          <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontFamily: 'Montserrat' }}>
              <thead>
                <tr style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Rank</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Player / Gamer Tag</th>
                  <th style={{ padding: '16px', textAlign: 'left' }}>Game</th>
                  <th style={{ padding: '16px', textAlign: 'right' }}>Total XP</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '16px', fontWeight: '800', color: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : '#fff' }}>#{r.rank || idx + 1}</td>
                    <td style={{ padding: '16px', fontWeight: '700' }}>{r.gamerTag || r.player?.gamerTag || r.user?.fullname || `Player #${r.id || idx+1}`}</td>
                    <td style={{ padding: '16px', color: '#38bdf8' }}>{r.game || r.player?.game || 'BGMI'}</td>
                    <td style={{ padding: '16px', textAlign: 'right', fontWeight: '800', color: '#10b981' }}>{r.totalXp || r.xp || 0} XP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.2)', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>
              No XP standings recorded yet. Register a player and play matches to earn XP!
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;
