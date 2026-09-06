import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlayerPanel from '../components/panels/PlayerPanel';
import RecruiterPanel from '../components/panels/RecruiterPanel';
import OrganizerPanel from '../components/panels/OrganizerPanel';
import AdminPanel from '../components/panels/AdminPanel';
import './PanelsDashboard.css';

const PanelsDashboard = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const userRole = (userProfile?.role || 'PLAYER').toUpperCase();
  const isLoggedIn = Boolean(userProfile && (userProfile.isLoggedIn || userProfile.email || userProfile.userId));

  return (
    <div className="dashboard-page-container" style={{ background: '#141414', minHeight: '100vh' }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />

      <div className="dashboard-content-wrapper" style={{ padding: '80px 0px 40px 0px', minHeight: '80vh', width: '100%', maxWidth: '100%' }}>
        {!isLoggedIn ? (
          <div className="auth-required-glass-box" style={{ maxWidth: '600px', margin: '40px auto', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '24px', padding: '50px 30px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔒</span>
            <span className="dashboard-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: '800', letterSpacing: '2px' }}>AUTHENTICATION REQUIRED</span>
            <h1 className="dashboard-title" style={{ fontFamily: 'Oxanium', color: '#ffffff', fontSize: '28px', marginTop: '12px' }}>Please Log In to Access Dashboard</h1>
            <p className="dashboard-subtitle" style={{ color: '#94a3b8', fontSize: '14px', margin: '16px 0 30px 0' }}>
              You need an active Areanix account to access your customized Player, Recruiter, Organizer, or Admin panel.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                className="auth-submit-btn"
                style={{ width: 'auto', padding: '12px 30px', background: 'linear-gradient(135deg, #00bfff, #0055ff)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '800', cursor: 'pointer' }}
                onClick={() => setActivePage && setActivePage('login')}
              >
                Log In Now →
              </button>
              <button
                className="auth-submit-btn"
                style={{ width: 'auto', padding: '12px 30px', background: 'transparent', border: '1px solid #00bfff', borderRadius: '10px', color: '#00bfff', fontWeight: '800', cursor: 'pointer' }}
                onClick={() => setActivePage && setActivePage('register')}
              >
                Create Account
              </button>
            </div>
          </div>
        ) : (
          <div className="single-panel-container" style={{ width: '100%' }}>
            {userRole === 'PLAYER' && <PlayerPanel userProfile={userProfile} />}
            {userRole === 'RECRUITER' && <RecruiterPanel userProfile={userProfile} />}
            {userRole === 'ORGANIZER' && <OrganizerPanel userProfile={userProfile} />}
            {userRole === 'ADMIN' && <AdminPanel userProfile={userProfile} />}
          </div>
        )}
      </div>

      <Footer setActivePage={setActivePage} />
    </div>
  );
};

export default PanelsDashboard;
