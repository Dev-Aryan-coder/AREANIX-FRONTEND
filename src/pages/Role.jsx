import React, { useState } from 'react';
import axios from 'axios';
import './Role.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import authBgImg from '../assets/ChatGPT Image Aug 12, 2026, 06_37_32 PM.png';

const Role = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const [selectedRole, setSelectedRole] = useState(userProfile?.role || 'PLAYER');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Primary Role - Player Fields
  const [gamerTag, setGamerTag] = useState(userProfile?.gamerTag || userProfile?.fullname || '');
  const [game, setGame] = useState('BGMI');
  const [rankName, setRankName] = useState('Conqueror');
  const [roleInGame, setRoleInGame] = useState('Entry Fragger');
  const [region, setRegion] = useState('Asia');
  const [age, setAge] = useState('20');
  const [availabilityStatus, setAvailabilityStatus] = useState('OPEN_TO_OFFERS');
  const [twitchUrl, setTwitchUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Primary Role - Recruiter / Organizer fields
  const [organizationName, setOrganizationName] = useState(userProfile?.fullname ? `${userProfile.fullname} Esports` : '');
  const [youtubeChannelUrl, setYoutubeChannelUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Dual-Role / Multi-Role Optional Selection
  const [alsoAddSecondaryRole, setAlsoAddSecondaryRole] = useState(false);
  const [secondaryOrgName, setSecondaryOrgName] = useState(userProfile?.fullname ? `${userProfile.fullname} Esports` : '');
  const [secondaryGamerTag, setSecondaryGamerTag] = useState(userProfile?.fullname || '');
  const [secondaryGame, setSecondaryGame] = useState('BGMI');

  // Public Role Options (System Admin is hidden for security)
  const roles = [
    {
      id: 'PLAYER',
      title: 'Esports Player',
      icon: '🎮',
      desc: 'Build your XP rank, join pro rosters, compete in tournaments, and get scouted by agencies.',
      badge: 'POPULAR'
    },
    {
      id: 'RECRUITER',
      title: 'Talent Recruiter',
      icon: '💼',
      desc: 'Scout top gaming talent, shortlist high-KD players, and issue pro team contracts.',
      badge: 'SCOUT'
    },
    {
      id: 'ORGANIZER',
      title: 'Streamer / Organizer',
      icon: '🏆',
      desc: 'Host tournaments, release custom Room IDs & Passwords, and earn verified streamer status.',
      badge: 'VERIFIED'
    }
  ];

  const handleSubmitOnboarding = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const userId = userProfile?.userId || userProfile?.id || 1;

    try {
      // 1. Set Primary Role in Backend Database
      try {
        await axios.post(`http://localhost:8080/user/${userId}/setrole/${selectedRole}`);
      } catch (rErr) {
        console.warn('Set role note:', rErr);
      }

      // 2. Save Primary Role Profile
      if (selectedRole === 'PLAYER') {
        await axios.post('http://localhost:8080/player/onboard', {
          userId: userId,
          gamerTag: gamerTag || userProfile?.fullname || 'Player',
          game: game || 'BGMI',
          rankName: rankName || 'Conqueror',
          roleInGame: roleInGame || 'Entry Fragger',
          region: region || 'Asia',
          age: parseInt(age, 10) || 20,
          twitchUrl: twitchUrl,
          youtubeUrl: youtubeUrl,
          availabilityStatus: availabilityStatus
        });
      } else if (selectedRole === 'RECRUITER') {
        await axios.post('http://localhost:8080/recruiter/onboard', {
          userId: userId,
          organizationName: organizationName || `${userProfile?.fullname || 'Org'} Esports`,
          region: region || 'Asia'
        });
      } else if (selectedRole === 'ORGANIZER') {
        await axios.post('http://localhost:8080/organizer/onboard', {
          userId: userId,
          organizationName: organizationName || `${userProfile?.fullname || 'Org'} League`,
          phoneNumber: phoneNumber || `987${String(userId).padStart(7, '0')}`,
          youtubeChannelUrl: youtubeChannelUrl || 'https://youtube.com/@areanix'
        });

        try {
          await axios.post(`http://localhost:8080/organizer/${userId}/send-otp`);
        } catch (oErr) {}
      }

      // 3. If User Opted for Dual-Role: Add and Save Secondary Role in Database
      if (alsoAddSecondaryRole) {
        if (selectedRole === 'PLAYER') {
          // Secondary role: RECRUITER
          try {
            await axios.post(`http://localhost:8080/user/${userId}/addrole/RECRUITER`);
            await axios.post('http://localhost:8080/recruiter/onboard', {
              userId: userId,
              organizationName: secondaryOrgName || `${userProfile?.fullname || 'Player'} Esports`,
              region: region || 'Asia'
            });
          } catch (secErr) {
            console.warn('Secondary recruiter creation note:', secErr);
          }
        } else if (selectedRole === 'RECRUITER') {
          // Secondary role: PLAYER
          try {
            await axios.post(`http://localhost:8080/user/${userId}/addrole/PLAYER`);
            await axios.post('http://localhost:8080/player/onboard', {
              userId: userId,
              gamerTag: secondaryGamerTag || userProfile?.fullname || 'ScoutPlayer',
              game: secondaryGame || 'BGMI',
              rankName: 'Ace Master',
              roleInGame: 'IGL',
              region: region || 'Asia',
              age: 20
            });
          } catch (secErr) {
            console.warn('Secondary player creation note:', secErr);
          }
        }
      }

      // 4. Update Profile in Local State
      const avatarSeed = gamerTag || userProfile?.fullname || userProfile?.email || 'User';
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed}`;

      const updatedProfile = {
        ...userProfile,
        isLoggedIn: true,
        userId: userId,
        role: selectedRole,
        fullname: userProfile?.fullname || gamerTag || 'Esports User',
        gamerTag: gamerTag || userProfile?.fullname || 'Player',
        game,
        rankName,
        roleInGame,
        region,
        age,
        availabilityStatus,
        twitchUrl,
        youtubeUrl,
        avatarUrl
      };

      if (setUserProfile) {
        setUserProfile(updatedProfile);
      }
      localStorage.setItem('areanix_user_profile', JSON.stringify(updatedProfile));

      // 5. Navigate to Home
      if (setActivePage) {
        setActivePage('home');
      }
    } catch (err) {
      console.error('Onboarding error:', err);
      const profileData = {
        ...userProfile,
        isLoggedIn: true,
        userId: userId,
        role: selectedRole
      };
      if (setUserProfile) setUserProfile(profileData);
      localStorage.setItem('areanix_user_profile', JSON.stringify(profileData));
      if (setActivePage) setActivePage('home');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-page-container">
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />

      <div
        className="role-hero-background"
        style={{
          backgroundImage: `url("${authBgImg}")`
        }}
      >
        <div className="role-center-container">
          <div className="role-glass-box">
            <span className="role-badge">STEP 2 OF 2: CHOOSE YOUR ROLE</span>
            <h1 className="role-title">Select Your Primary Role</h1>
            <p className="role-subtitle">
              Welcome, <span style={{ color: '#00bfff', fontWeight: '700' }}>{userProfile?.fullname || 'Player'}</span>! Choose your main role and customize your profile.
            </p>

            {errorMsg && <div className="role-error-banner">{errorMsg}</div>}

            <form className="role-form" onSubmit={handleSubmitOnboarding}>
              {/* Role Selector Cards */}
              <div className="role-cards-grid">
                {roles.map((r) => (
                  <div
                    key={r.id}
                    className={`role-card ${selectedRole === r.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedRole(r.id);
                      setAlsoAddSecondaryRole(false);
                    }}
                  >
                    <span className="role-card-badge">{r.badge}</span>
                    <div className="role-card-icon">{r.icon}</div>
                    <h3 className="role-card-title">{r.title}</h3>
                    <p className="role-card-desc">{r.desc}</p>
                    <div className="role-card-radio">
                      <div className={`radio-inner ${selectedRole === r.id ? 'checked' : ''}`}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Onboarding Fields based on Selected Role */}
              <div className="onboarding-fields-container">
                <h4 className="onboarding-section-title">
                  {selectedRole === 'PLAYER' && '🎮 Player In-Game Details'}
                  {selectedRole === 'RECRUITER' && '💼 Recruiter Organization Details'}
                  {selectedRole === 'ORGANIZER' && '🏆 Host Channel Details'}
                </h4>

                {selectedRole === 'PLAYER' && (
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Gamer Tag *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Aryan_Viper"
                        value={gamerTag}
                        onChange={(e) => setGamerTag(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Main Game</label>
                      <select className="form-input" value={game} onChange={(e) => setGame(e.target.value)}>
                        <option value="BGMI">BGMI (Battlegrounds Mobile India)</option>
                        <option value="Valorant">Valorant</option>
                        <option value="Free Fire">Free Fire</option>
                        <option value="CS2">Counter-Strike 2</option>
                        <option value="Call of Duty">Call of Duty</option>
                        <option value="Pokemon UNITE">Pokemon UNITE</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Current Rank *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Conqueror / Radiant"
                        value={rankName}
                        onChange={(e) => setRankName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">In-Game Role</label>
                      <select className="form-input" value={roleInGame} onChange={(e) => setRoleInGame(e.target.value)}>
                        <option value="Entry Fragger">Entry Fragger</option>
                        <option value="IGL">IGL (In-Game Leader)</option>
                        <option value="Sniper">Sniper</option>
                        <option value="Support">Support</option>
                        <option value="Assaulter">Assaulter</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Region</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Asia / India"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Age *</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="e.g. 20"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        min="13"
                        max="99"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'RECRUITER' && (
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Organization Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Team Soul Esports"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Recruiting Region</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Asia / India"
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'ORGANIZER' && (
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Organization / Brand Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Areanix Masters League"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. +91 9876543210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">YouTube Channel URL *</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://youtube.com/@yourchannel"
                        value={youtubeChannelUrl}
                        onChange={(e) => setYoutubeChannelUrl(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Optional Multi-Role Dual Card */}
                {selectedRole === 'PLAYER' && (
                  <div
                    style={{
                      marginTop: '20px',
                      padding: '16px',
                      borderRadius: '12px',
                      background: alsoAddSecondaryRole ? 'rgba(0, 191, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: alsoAddSecondaryRole ? '1px solid #00bfff' : '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={alsoAddSecondaryRole}
                        onChange={(e) => setAlsoAddSecondaryRole(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#00bfff', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '14px' }}>
                          💼 Also register as a Talent Recruiter?
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                          Scout top players and manage esports rosters alongside playing. (You can switch roles on login).
                        </div>
                      </div>
                    </label>

                    {alsoAddSecondaryRole && (
                      <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <label className="form-label">Recruiting Organization Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Aryan Esports Org"
                          value={secondaryOrgName}
                          onChange={(e) => setSecondaryOrgName(e.target.value)}
                          required={alsoAddSecondaryRole}
                        />
                      </div>
                    )}
                  </div>
                )}

                {selectedRole === 'RECRUITER' && (
                  <div
                    style={{
                      marginTop: '20px',
                      padding: '16px',
                      borderRadius: '12px',
                      background: alsoAddSecondaryRole ? 'rgba(0, 191, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                      border: alsoAddSecondaryRole ? '1px solid #00bfff' : '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={alsoAddSecondaryRole}
                        onChange={(e) => setAlsoAddSecondaryRole(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#00bfff', cursor: 'pointer' }}
                      />
                      <div>
                        <div style={{ color: '#ffffff', fontWeight: '700', fontSize: '14px' }}>
                          🎮 Also register as an Esports Player?
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>
                          Compete in tournaments, earn XP rank, and build player stats alongside recruiting.
                        </div>
                      </div>
                    </label>

                    {alsoAddSecondaryRole && (
                      <div className="form-grid-2" style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div className="form-group">
                          <label className="form-label">Player Gamer Tag</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Aryan_Viper"
                            value={secondaryGamerTag}
                            onChange={(e) => setSecondaryGamerTag(e.target.value)}
                            required={alsoAddSecondaryRole}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Primary Game</label>
                          <select className="form-input" value={secondaryGame} onChange={(e) => setSecondaryGame(e.target.value)}>
                            <option value="BGMI">BGMI</option>
                            <option value="Valorant">Valorant</option>
                            <option value="Free Fire">Free Fire</option>
                            <option value="CS2">Counter-Strike 2</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button type="submit" className="role-submit-btn" disabled={loading}>
                {loading ? 'Saving Profiles to Database...' : `Complete Onboarding as ${selectedRole}${alsoAddSecondaryRole ? ' + Dual Role' : ''} →`}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Role;
