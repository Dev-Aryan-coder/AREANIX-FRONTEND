import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Communities.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Communities = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/community/search', {
      params: { query: '' }
    })
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setCommunities(data);
        } else if (data && typeof data === 'object') {
          setCommunities([data]);
        } else {
          setCommunities([]);
        }
      })
      .catch((err) => {
        setCommunities([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />
      <div className="page-content" style={{ padding: '120px 40px 60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="page-title" style={{ fontFamily: 'Oxanium', color: '#00bfff', fontSize: '36px', textAlign: 'center', marginBottom: '10px' }}>GAMING COMMUNITIES</h1>
        <p className="page-subtitle" style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px' }}>Join official gaming hubs and scrim groups</p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#00bfff' }}>Loading communities...</p>
        ) : communities.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {communities.map((c) => (
              <div key={c.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
                <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>{c.visibility || 'PUBLIC'}</span>
                <h3 style={{ fontFamily: 'Oxanium', fontSize: '22px', margin: '12px 0 6px 0', color: '#fff' }}>{c.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>{c.description || 'Community Hub'}</p>
                <button style={{ width: '100%', background: 'linear-gradient(135deg, #00bfff, #0055ff)', border: 'none', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>Join Community</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.2)', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>No gaming communities created yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Communities;
