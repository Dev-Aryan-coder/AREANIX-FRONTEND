import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Teams.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Teams = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/team/search', {
      params: { query: '' }
    })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setTeams(data);
        } else if (data && typeof data === 'object') {
          setTeams([data]);
        } else {
          setTeams([]);
        }
      })
      .catch((err) => {
        setTeams([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />
      <div className="page-content" style={{ padding: '120px 40px 60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="page-title" style={{ fontFamily: 'Oxanium', color: '#00bfff', fontSize: '36px', textAlign: 'center', marginBottom: '10px' }}>PRO ESPORTS TEAMS</h1>
        <p className="page-subtitle" style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px' }}>Browse verified pro teams and rosters</p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#00bfff' }}>Loading teams...</p>
        ) : teams.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {teams.map((t) => (
              <div key={t.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                <span style={{ background: 'rgba(0,191,255,0.2)', color: '#38bdf8', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>TEAM #{t.id}</span>
                <h3 style={{ fontFamily: 'Oxanium', fontSize: '22px', margin: '12px 0 6px 0', color: '#fff' }}>{t.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Game Focus: <strong style={{ color: '#fff' }}>{t.gameFocus || 'BGMI'}</strong></p>
                <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '6px 0' }}>Region: {t.region || 'Asia'}</p>
                <button style={{ width: '100%', marginTop: '12px', background: 'transparent', border: '1px solid #00bfff', color: '#00bfff', padding: '10px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>View Team Roster</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.2)', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>No teams created yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Teams;
