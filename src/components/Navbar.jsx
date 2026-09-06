import React, { useState } from 'react';
import './Navbar.css';
import logo from '../assets/ChatGPT Image Aug 11, 2026, 03_32_46 PM.png';

const Navbar = ({ activePage = 'home', setActivePage, userProfile, setUserProfile }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Robust check: User is logged in if userProfile object exists with email/userId/isLoggedIn
  const isLoggedIn = Boolean(userProfile && (userProfile.isLoggedIn || userProfile.email || userProfile.userId));

  // Dynamically show Dashboard ONLY when user is logged in
  const navItems = [
    { name: 'Home', id: 'home' },
    ...(isLoggedIn ? [{ name: 'Dashboard', id: 'dashboard' }] : []),
    { name: 'Tournaments', id: 'tournaments' },
    { name: 'Players', id: 'players' },
    { name: 'Teams', id: 'teams' },
    { name: 'Communities', id: 'communities' },
    { name: 'Leaderboard', id: 'leaderboard' }
  ];

  const handleLogout = () => {
    if (setUserProfile) {
      setUserProfile(null);
    }
    localStorage.removeItem('areanix_user_profile');
    setShowDropdown(false);
    if (setActivePage) {
      setActivePage('home');
    }
  };

  const handleNavClick = (itemId) => {
    // Protected route check for Dashboard
    if (itemId === 'dashboard' && !isLoggedIn) {
      if (setActivePage) setActivePage('login');
      return;
    }
    if (setActivePage) {
      setActivePage(itemId);
    }
  };

  return (
    <nav className="skeuo-navbar-container">
      <div className="skeuo-navbar-wrapper">
        {/* Brand Logo */}
        <div
          className="skeuo-logo-container"
          onClick={() => setActivePage && setActivePage('home')}
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} alt="Areanix Logo" className="skeuo-logo" />
        </div>

        {/* Navigation Bar Links */}
        <ul className="skeuo-navbar">
          {navItems.map((item) => (
            <li key={item.id} className="skeuo-nav-item">
              <button
                className={`skeuo-nav-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>

        {/* Top Right Auth / Profile Avatar Area */}
        <div className="skeuo-auth-container">
          {isLoggedIn ? (
            <div className="navbar-profile-badge-container">
              <div
                className="navbar-profile-card"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="avatar-wrapper">
                  <img
                    src={userProfile.profileImageUrl || userProfile.logoUrl || userProfile.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${userProfile.email || 'Apex'}`}
                    alt="User Profile Logo"
                    className="user-profile-avatar"
                  />
                  <span className="online-indicator"></span>
                </div>
                <div className="profile-text-info">
                  <span className="profile-name">{userProfile.gamerTag || userProfile.fullname || 'ApexNinja_99'}</span>
                  <span className="profile-role-badge">[{userProfile.role || 'PLAYER'}]</span>
                </div>
                <span className="dropdown-arrow">▼</span>
              </div>

              {/* Profile Dropdown Menu */}
              {showDropdown && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-header">
                    <p className="user-email-text">{userProfile.email || 'user@areanix.com'}</p>
                    <p className="user-status-text">Status: <span className="status-highlight">ONLINE</span></p>
                  </div>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item-btn"
                    onClick={() => {
                      setShowDropdown(false);
                      setActivePage && setActivePage('dashboard');
                    }}
                  >
                    Go to {userProfile.role || 'PLAYER'} Panel
                  </button>
                  <button
                    className="dropdown-item-btn"
                    onClick={() => {
                      setShowDropdown(false);
                      setActivePage && setActivePage('profile');
                    }}
                  >
                    My Profile Panel
                  </button>
                  <hr className="dropdown-divider" />
                  <button className="dropdown-item-btn logout-btn" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className={`skeuo-btn skeuo-btn-login ${activePage === 'login' ? 'active' : ''}`}
                onClick={() => setActivePage && setActivePage('login')}
              >
                Log In
              </button>
              <button
                className={`skeuo-btn skeuo-btn-signup ${activePage === 'register' ? 'active' : ''}`}
                onClick={() => setActivePage && setActivePage('register')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
