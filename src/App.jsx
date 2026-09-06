import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import IntroVideo from './components/IntroVideo';
import Home from './pages/Home';
import PanelsDashboard from './pages/PanelsDashboard';
import UserProfile from './pages/UserProfile';
import Tournaments from './pages/Tournaments';
import Players from './pages/Players';
import Teams from './pages/Teams';
import Communities from './pages/Communities';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Role from './pages/Role';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Check session intro status
    const hasPlayed = sessionStorage.getItem('introPlayed');
    if (hasPlayed) {
      setShowIntro(false);
    }

    // Check saved user profile in localStorage and re-sync live from MySQL
    const savedProfile = localStorage.getItem('areanix_user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);

        if (parsed.userId) {
          if (parsed.role === 'RECRUITER') {
            axios.get(`http://localhost:8080/recruiter/getby/${parsed.userId}`)
              .then((res) => {
                if (res.data) {
                  const updated = {
                    ...parsed,
                    avatarUrl: res.data.logoUrl || parsed.avatarUrl,
                    profileImageUrl: res.data.logoUrl || parsed.profileImageUrl,
                    logoUrl: res.data.logoUrl || parsed.logoUrl,
                    gamerTag: res.data.organizationName || parsed.gamerTag
                  };
                  setUserProfile(updated);
                  localStorage.setItem('areanix_user_profile', JSON.stringify(updated));
                }
              })
              .catch(() => {});
          } else if (parsed.role === 'ORGANIZER') {
            axios.get(`http://localhost:8080/organizer/getby/${parsed.userId}`)
              .then((res) => {
                if (res.data) {
                  const updated = {
                    ...parsed,
                    avatarUrl: res.data.logoUrl || parsed.avatarUrl,
                    profileImageUrl: res.data.logoUrl || parsed.profileImageUrl,
                    logoUrl: res.data.logoUrl || parsed.logoUrl,
                    gamerTag: res.data.organizationName || parsed.gamerTag
                  };
                  setUserProfile(updated);
                  localStorage.setItem('areanix_user_profile', JSON.stringify(updated));
                }
              })
              .catch(() => {});
          } else {
            axios.get(`http://localhost:8080/player/getby/${parsed.userId}`)
              .then((res) => {
                if (res.data) {
                  const updated = {
                    ...parsed,
                    avatarUrl: res.data.profileImageUrl || parsed.avatarUrl,
                    profileImageUrl: res.data.profileImageUrl || parsed.profileImageUrl,
                    gamerTag: res.data.gamerTag || parsed.gamerTag
                  };
                  setUserProfile(updated);
                  localStorage.setItem('areanix_user_profile', JSON.stringify(updated));
                }
              })
              .catch(() => {});
          }
        }
      } catch (e) {}
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('introPlayed', 'true');
  };

  const renderPage = () => {
    const commonProps = {
      activePage,
      setActivePage,
      userProfile,
      setUserProfile
    };

    switch (activePage) {
      case 'dashboard':
        return <PanelsDashboard {...commonProps} />;
      case 'profile':
        return <UserProfile {...commonProps} />;
      case 'tournaments':
        return <Tournaments {...commonProps} />;
      case 'players':
        return <Players {...commonProps} />;
      case 'teams':
        return <Teams {...commonProps} />;
      case 'communities':
        return <Communities {...commonProps} />;
      case 'leaderboard':
        return <Leaderboard {...commonProps} />;
      case 'login':
        return <Login {...commonProps} />;
      case 'register':
        return <Register {...commonProps} />;
      case 'role':
        return <Role {...commonProps} />;
      case 'home':
      default:
        return <Home {...commonProps} />;
    }
  };

  return (
    <div className="App">
      {showIntro ? (
        <IntroVideo onComplete={handleIntroComplete} />
      ) : (
        renderPage()
      )}
    </div>
  );
}

export default App;
