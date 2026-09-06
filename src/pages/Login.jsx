import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authBgImg from '../assets/ChatGPT Image Aug 12, 2026, 06_37_32 PM.png';

const Login = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Multi-Role Choice State
  const [pendingUserData, setPendingUserData] = useState(null);
  const [userAvailableRoles, setUserAvailableRoles] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const completeLoginWithRole = async (chosenRole, userData) => {
    setLoading(true);
    setShowRoleModal(false);

    try {
      let fetchedAvatar = null;
      let gamerTag = userData.fullname || 'Areanix User';

      if (chosenRole === 'ADMIN') {
        gamerTag = userData.fullname || 'System Admin';
      } else if (chosenRole === 'RECRUITER') {
        try {
          const recRes = await axios.get(`http://localhost:8080/recruiter/getby/${userData.id}`);
          if (recRes.data) {
            if (recRes.data.logoUrl) fetchedAvatar = recRes.data.logoUrl;
            if (recRes.data.organizationName) gamerTag = recRes.data.organizationName;
          }
        } catch (e) { }
      } else if (chosenRole === 'ORGANIZER') {
        try {
          const orgRes = await axios.get(`http://localhost:8080/organizer/getby/${userData.id}`);
          if (orgRes.data) {
            if (orgRes.data.logoUrl) fetchedAvatar = orgRes.data.logoUrl;
            if (orgRes.data.organizationName) gamerTag = orgRes.data.organizationName;
          }
        } catch (e) { }
      } else {
        try {
          const plRes = await axios.get(`http://localhost:8080/player/getby/${userData.id}`);
          if (plRes.data) {
            if (plRes.data.profileImageUrl) fetchedAvatar = plRes.data.profileImageUrl;
            if (plRes.data.gamerTag) gamerTag = plRes.data.gamerTag;
          }
        } catch (e) { }
      }

      const finalAvatar = fetchedAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userData.email}`;

      const profile = {
        isLoggedIn: true,
        userId: userData.id,
        fullname: userData.fullname || 'Areanix User',
        email: userData.email,
        role: chosenRole,
        gamerTag: gamerTag,
        avatarUrl: finalAvatar,
        profileImageUrl: finalAvatar,
        logoUrl: finalAvatar
      };

      if (setUserProfile) {
        setUserProfile(profile);
      }
      localStorage.setItem('areanix_user_profile', JSON.stringify(profile));

      if (setActivePage) {
        setActivePage('home');
      }
    } catch (err) {
      console.error('Role login switch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Call Real Backend Login API (POST /user/login)
      const response = await axios.post('http://localhost:8080/user/login', null, {
        params: { email, password }
      });

      const userData = response.data;
      if (!userData || !userData.id) {
        throw new Error('Invalid login response');
      }

      // 2. Fetch User's Assigned Roles from Database (GET /user/{id}/roles)
      let activeRoles = [];
      try {
        const rolesRes = await axios.get(`http://localhost:8080/user/${userData.id}/roles`);
        activeRoles = rolesRes.data || [];
      } catch (err) { }

      const roleList = activeRoles.map((r) => r.role);

      // If user holds multiple roles (e.g. both PLAYER and RECRUITER), prompt them to pick
      if (roleList.length > 1) {
        setPendingUserData(userData);
        setUserAvailableRoles(roleList);
        setShowRoleModal(true);
        setLoading(false);
        return;
      }

      // Single role account - directly log in
      const singleRole = roleList.length === 1 ? roleList[0] : (userData.role || 'PLAYER');
      await completeLoginWithRole(singleRole, userData);
    } catch (err) {
      setErrorMsg(err.response?.data || err.message || 'Login failed. Please check your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />

      <div
        className="auth-hero-background"
        style={{
          backgroundImage: `url("${authBgImg}")`
        }}
      >
        <div className="auth-center-container">
          <div className="auth-glass-box" style={{ maxWidth: '460px' }}>
            <span className="auth-badge">AREANIX AUTHENTICATION</span>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your Esports Profile or Recruiter Dashboard</p>

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Password</label>
                  <span
                    className="auth-link"
                    style={{ fontSize: '12px' }}
                    onClick={() => setActivePage && setActivePage('forgot-password')}
                  >
                    Forgot Password?
                  </span>
                </div>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '20px' }}>
                {loading ? 'Authenticating...' : 'Sign In →'}
              </button>

              <p className="auth-switch-text">
                Don't have an account?{' '}
                <span className="auth-link" onClick={() => setActivePage && setActivePage('register')}>
                  Register
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Multi-Role Persona Selection Modal */}
      {showRoleModal && pendingUserData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(5, 7, 15, 0.85)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div
            style={{
              width: '90%',
              maxWidth: '500px',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(8, 13, 27, 0.98))',
              border: '1px solid rgba(0, 191, 255, 0.3)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 191, 255, 0.2)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '1.5px',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(0, 191, 255, 0.15)',
                  color: '#00bfff',
                  border: '1px solid rgba(0, 191, 255, 0.3)'
                }}
              >
                MULTI-ROLE ACCOUNT
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', marginTop: '12px', marginBottom: '6px' }}>
                Sign In As
              </h2>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>
                You have multiple roles registered for <strong style={{ color: '#00bfff' }}>{pendingUserData.fullname}</strong>. Choose which persona to launch:
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {userAvailableRoles.includes('PLAYER') && (
                <button
                  type="button"
                  onClick={() => completeLoginWithRole('PLAYER', pendingUserData)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(0, 191, 255, 0.3)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 191, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#00bfff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(0, 191, 255, 0.3)';
                  }}
                >
                  <div style={{ fontSize: '32px' }}>🎮</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: '#00bfff' }}>Esports Player</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Access your player XP, scrims, and match statistics.</div>
                  </div>
                  <div style={{ fontSize: '18px', color: '#00bfff' }}>→</div>
                </button>
              )}

              {userAvailableRoles.includes('RECRUITER') && (
                <button
                  type="button"
                  onClick={() => completeLoginWithRole('RECRUITER', pendingUserData)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#a855f7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                  }}
                >
                  <div style={{ fontSize: '32px' }}>💼</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: '#c084fc' }}>Talent Recruiter</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Scout players, manage shortlists, and issue team offers.</div>
                  </div>
                  <div style={{ fontSize: '18px', color: '#c084fc' }}>→</div>
                </button>
              )}

              {userAvailableRoles.includes('ORGANIZER') && (
                <button
                  type="button"
                  onClick={() => completeLoginWithRole('ORGANIZER', pendingUserData)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(234, 179, 8, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = '#eab308';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.3)';
                  }}
                >
                  <div style={{ fontSize: '32px' }}>🏆</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: '#facc15' }}>Tournament Host</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Host tournaments, release room IDs, and manage brackets.</div>
                  </div>
                  <div style={{ fontSize: '18px', color: '#facc15' }}>→</div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Login;
