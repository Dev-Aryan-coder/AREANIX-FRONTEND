import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tournaments.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Tournaments = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredMap, setRegisteredMap] = useState({});
  const [registeringId, setRegisteringId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const userId = userProfile?.userId || userProfile?.id;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const fetchAllTournaments = () => {
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:8080/tournament/status/UPCOMING').catch(() => ({ data: [] })),
      axios.get('http://localhost:8080/tournament/live').catch(() => ({ data: [] }))
    ]).then(([upcomingRes, liveRes]) => {
      const upcoming = Array.isArray(upcomingRes.data) ? upcomingRes.data : [];
      const live = Array.isArray(liveRes.data) ? liveRes.data : [];
      const map = new Map();
      [...live, ...upcoming].forEach(t => {
        if (t && t.id) map.set(t.id, t);
      });
      setTournaments(Array.from(map.values()));
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAllTournaments();
  }, []);

  const handleRegister = async (tournamentId) => {
    if (!userId) {
      showToast('Please log in to register your squad.');
      return;
    }

    setRegisteringId(tournamentId);

    try {
      // 1. Check if user is recruiter / manager with a managed team
      let teamId = null;
      try {
        const teamRes = await axios.get(`http://localhost:8080/recruiter/${userId}/managed-team`);
        if (teamRes.data && teamRes.data.id) {
          teamId = teamRes.data.id;
        }
      } catch {}

      // 2. If not found, check player team
      if (!teamId) {
        try {
          const pTeamRes = await axios.get(`http://localhost:8080/team/player/${userId}`);
          if (pTeamRes.data && pTeamRes.data.team && pTeamRes.data.team.id) {
            teamId = pTeamRes.data.team.id;
          }
        } catch {}
      }

      // 3. Submit registration with teamId or playerId
      const params = teamId ? `teamId=${teamId}` : `playerId=${userId}`;
      await axios.post(`http://localhost:8080/tournament/${tournamentId}/register?${params}`);
      
      showToast('Squad registered successfully! Pending organizer review.');
      setRegisteredMap(prev => ({ ...prev, [tournamentId]: true }));
      fetchAllTournaments();
    } catch (err) {
      const msg = err.response?.data || 'Failed to submit registration.';
      showToast(typeof msg === 'string' ? msg : 'Registration submitted.');
      setRegisteredMap(prev => ({ ...prev, [tournamentId]: true }));
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="page-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />
      
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'linear-gradient(135deg, #00bfff, #0055ff)',
          color: '#fff',
          padding: '14px 24px',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '14px',
          zIndex: 9999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
        }}>
          {toastMsg}
        </div>
      )}

      <div className="page-content" style={{ padding: '120px 40px 60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 className="page-title" style={{ fontFamily: 'Oxanium', color: '#00bfff', fontSize: '36px', textAlign: 'center', marginBottom: '10px' }}>LIVE & UPCOMING TOURNAMENTS</h1>
        <p className="page-subtitle" style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '40px' }}>Discover and register your squad for competitive esports events</p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#00bfff' }}>Loading tournaments...</p>
        ) : tournaments.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {tournaments.map((t) => {
              const isRegistered = registeredMap[t.id];
              const isRegistering = registeringId === t.id;

              return (
                <div key={t.id} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{
                        background: t.status === 'ONGOING' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,191,255,0.2)',
                        color: t.status === 'ONGOING' ? '#ef4444' : '#38bdf8',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '800'
                      }}>
                        {t.status || 'UPCOMING'}
                      </span>
                      <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '16px' }}>₹{t.prizePool?.toLocaleString() || 'TBD'}</span>
                    </div>

                    <h3 style={{ fontFamily: 'Oxanium', fontSize: '20px', margin: '12px 0 8px 0', color: '#fff' }}>{t.name || t.title || `Tournament #${t.id}`}</h3>
                    <p style={{ color: '#00bfff', fontSize: '13px', margin: '4px 0 8px 0' }}>
                      <span style={{ color: '#94a3b8' }}>Host:</span> <strong>{t.organizer?.organizationName || t.organizer?.user?.fullname || (t.organizerId ? `Organizer #${t.organizerId}` : 'Verified Host')}</strong>
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0' }}>Game: <strong style={{ color: '#fff' }}>{t.game || t.gameFocus || 'BGMI'}</strong> &bull; Mode: <strong style={{ color: '#00bfff' }}>Squad</strong></p>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    {isRegistered ? (
                      <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', textAlign: 'center' }}>
                        ✓ SQUAD REGISTRATION SUBMITTED
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isRegistering}
                        onClick={() => handleRegister(t.id)}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #00bfff, #0055ff)',
                          border: 'none',
                          color: '#fff',
                          padding: '12px',
                          borderRadius: '8px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isRegistering ? 'Registering Squad...' : 'Register Squad →'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px dashed rgba(255, 255, 255, 0.2)', padding: '40px', borderRadius: '16px', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: '16px' }}>No active or upcoming tournaments hosted yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Tournaments;

