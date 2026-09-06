import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authBgImg from '../assets/ChatGPT Image Aug 12, 2026, 06_37_32 PM.png';

const Register = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Create Base User in MySQL (POST /user/register)
      await axios.post('http://localhost:8080/user/register', {
        fullname,
        email,
        password
      });

      // 2. Log In to retrieve generated user_id
      const loginRes = await axios.post('http://localhost:8080/user/login', null, {
        params: { email, password }
      });

      const userData = loginRes.data;
      const assignedUserId = userData?.id || 1;

      const profile = {
        isLoggedIn: true,
        userId: assignedUserId,
        fullname: fullname,
        gamerTag: fullname,
        email: email,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
      };

      if (setUserProfile) {
        setUserProfile(profile);
      }
      localStorage.setItem('areanix_user_profile', JSON.stringify(profile));

      // 3. Immediately redirect to Role Selection & Onboarding Page
      if (setActivePage) {
        setActivePage('role');
      }
    } catch (err) {
      setErrorMsg(err.response?.data || err.message || 'Registration failed. Email may already exist.');
    } finally {
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
          <div className="auth-glass-box" style={{ maxWidth: '480px' }}>
            <span className="auth-badge">AREANIX REGISTRATION</span>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join the Premier Esports Arena & Scouting Network</p>

            {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading} style={{ marginTop: '20px' }}>
                {loading ? 'Creating Account...' : 'Continue to Select Role →'}
              </button>

              <p className="auth-switch-text">
                Already have an account?{' '}
                <span className="auth-link" onClick={() => setActivePage && setActivePage('login')}>
                  Log In
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
