import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Players.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Players = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/player/live')
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setPlayers(data);
        } else if (data && typeof data === 'object') {
          setPlayers([data]);
        } else {
          setPlayers([]);
        }
      })
      .catch((err) => {
        setPlayers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />
      <div className="page-content" style={{ padding: '120px 40px 60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="page-title" style={{ fontFamily: 'Oxanium', color: '#00bfff', fontSize: '36px', textAlign: 'center', marginBottom: '10px' }}>PRO PLAYERS & TALENT DIRECTORY</h1>
        <p className="page-subtitle" style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px' }}>Explore top esports talent and active players</p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#00bfff' }}>Loading player profiles...</p>
        ) : players.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {players.map((p) => (
              <div key={p.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>{p.availabilityStatus || 'AVAILABLE'}</span>
                <h3 style={{ fontFamily: 'Oxanium', fontSize: '22px', margin: '12px 0 6px 0', color: '#fff' }}>{p.gamerTag || p.user?.fullname || `Player #${p.id}`}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Game: <strong style={{ color: '#fff' }}>{p.game || 'BGMI'}</strong></p>
                <p style={{ color: '#38bdf8', fontSize: '14px', margin: '6px 0' }}>Role: <strong>{p.roleInGame || 'Entry Fragger'}</strong></p>
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Region: {p.region || 'Asia'} &bull; Age: {p.age || 'N/A'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.2)', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>No player profiles onboarded yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Players;
