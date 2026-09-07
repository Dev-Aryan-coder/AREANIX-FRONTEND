import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PlayerPanel.css';

// Modular Player Sub-Components
import PerformanceTab from './player/PerformanceTab';
import TournamentActivityTab from './player/TournamentActivityTab';
import TeamStatusTab from './player/TeamStatusTab';
import SocialLayerTab from './player/SocialLayerTab';
import PlayerProfileModal from './player/PlayerProfileModal';
import RecruiterTab from './player/RecruiterTab';
import RaiseDisputeModal from './player/RaiseDisputeModal';

const PlayerPanel = ({ userProfile }) => {
  const userId = userProfile?.userId || userProfile?.id;
  const userName = userProfile?.gamerTag || userProfile?.fullname || userProfile?.username || '';

  // Navigation & Availability States
  const [availabilityStatus, setAvailabilityStatus] = useState('OPEN_TO_OFFERS');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('performance');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Tab 1: Performance & Progress States
  const [statsList, setStatsList] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [xpData, setXpData] = useState({ xp: 0, level: 1, rank: '-' });
  const [achievementsList, setAchievementsList] = useState([]);

  // Tab 2 & 3: Tournament Activity & Team States
  const [tournamentSubTab, setTournamentSubTab] = useState('upcoming');
  const [tournamentHistory, setTournamentHistory] = useState([]);
  const [liveTournaments, setLiveTournaments] = useState([]);
  const [upcomingTournaments, setUpcomingTournaments] = useState([]);
  const [registrationsList, setRegistrationsList] = useState([]);
  const [registeringId, setRegisteringId] = useState(null);
  const [tournamentActionMsg, setTournamentActionMsg] = useState('');
  const [playerTeamInfo, setPlayerTeamInfo] = useState({ hasTeam: false, team: null, membership: null, roster: [] });
  const [selectedTournamentForDispute, setSelectedTournamentForDispute] = useState(null);

  // Tab 4: Social Layer & Profile Modal States
  const [socialSubTab, setSocialSubTab] = useState('directory');
  const [allPlayersList, setAllPlayersList] = useState([]);
  const [pendingFriendRequests, setPendingFriendRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [viewProfileModalData, setViewProfileModalData] = useState(null);
  const [modalPlayerXp, setModalPlayerXp] = useState({ xp: 0, level: 1, rank: '-' });
  const [socialMessage, setSocialMessage] = useState('');

  // Tab 5: Recruiter Visibility & Recruitment Hub States
  const [recruiterInvites, setRecruiterInvites] = useState([]);
  const [shortlistCount, setShortlistCount] = useState(0);
  const [activeRecruiters, setActiveRecruiters] = useState([]);
  const [recruiterMessage, setRecruiterMessage] = useState('');

  // -------------------------------------------------------------
  // API Fetchers
  // -------------------------------------------------------------
  const fetchStatistics = () => {
    if (!userId) return;
    setStatsLoading(true);
    axios.get(`http://localhost:8080/player/${userId}/statistics`)
      .then((res) => {
        if (Array.isArray(res.data)) setStatsList(res.data);
      })
      .catch(() => { })
      .finally(() => setStatsLoading(false));
  };

  const fetchXpData = () => {
    if (!userId) return;
    axios.get(`http://localhost:8080/leaderboard/xp/rank/${userId}`)
      .then((res) => {
        if (res.data) {
          setXpData({
            xp: res.data.xp || 0,
            level: res.data.level || Math.floor((res.data.xp || 0) / 100) + 1,
            rank: res.data.rank || 1
          });
        }
      })
      .catch(() => { });
  };

  const fetchAchievements = () => {
    if (!userId) return;
    axios.get(`http://localhost:8080/player/${userId}/achievements`)
      .then((res) => {
        if (Array.isArray(res.data)) setAchievementsList(res.data);
      })
      .catch(() => { });
  };

  const fetchTournamentActivityData = () => {
    if (!userId) return;

    // 1. History
    axios.get(`http://localhost:8080/player/${userId}/tournament-history`)
      .then((res) => {
        if (Array.isArray(res.data)) setTournamentHistory(res.data);
      })
      .catch(() => { });

    // 2. Live Tournaments
    axios.get(`http://localhost:8080/tournament/live`)
      .then((res) => {
        if (Array.isArray(res.data)) setLiveTournaments(res.data);
      })
      .catch(() => { });

    // 3. Upcoming Tournaments
    axios.get(`http://localhost:8080/tournament/status/UPCOMING`)
      .then((res) => {
        if (Array.isArray(res.data)) setUpcomingTournaments(res.data);
      })
      .catch(() => { });

    // 4. Registration Applications
    axios.get(`http://localhost:8080/player/${userId}/registrations`)
      .then((res) => {
        setRegistrationsList(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => { setRegistrationsList([]); });

    // 5. Team Affiliation & Roster
    axios.get(`http://localhost:8080/team/player/${userId}`)
      .then((res) => {
        if (res.data) setPlayerTeamInfo(res.data);
      })
      .catch(() => { setPlayerTeamInfo({ hasTeam: false, team: null, membership: null, roster: [] }); });
  };

  const fetchSocialData = () => {
    if (!userId) return;

    // 1. All Players
    axios.get(`http://localhost:8080/player/all`)
      .then((res) => {
        setAllPlayersList(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => { setAllPlayersList([]); });

    // 2. Received Friend Invites
    axios.get(`http://localhost:8080/friendship/requests/${userId}`)
      .then((res) => {
        setPendingFriendRequests(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => { setPendingFriendRequests([]); });

    // 3. Accepted Friends
    axios.get(`http://localhost:8080/friendship/friends/${userId}`)
      .then((res) => {
        setFriendsList(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => { setFriendsList([]); });
  };

  const fetchRecruiterData = () => {
    if (!userId) return;

    // 1. Fetch Invites Received by Player
    axios.get(`http://localhost:8080/recruiter/player/${userId}/invites`)
      .then((res) => {
        setRecruiterInvites(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => { setRecruiterInvites([]); });

    // 2. Fetch Shortlist Count
    axios.get(`http://localhost:8080/recruiter/player/${userId}/shortlist-count`)
      .then((res) => {
        if (res.data && res.data.count !== undefined) {
          setShortlistCount(Number(res.data.count));
        }
      })
      .catch(() => { setShortlistCount(0); });

    // 3. Fetch All Active Recruiters / Teams
    axios.get(`http://localhost:8080/recruiter/all`)
      .then((res) => {
        setActiveRecruiters(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => { setActiveRecruiters([]); });
  };

  // -------------------------------------------------------------
  // Initial Lifecycle Load
  // -------------------------------------------------------------
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8080/player/getby/${userId}`)
        .then((res) => {
          if (res.data && res.data.availabilityStatus) {
            setAvailabilityStatus(res.data.availabilityStatus);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            axios.post('http://localhost:8080/player/onboard', {
              userId: userId,
              user: { id: userId },
              gamerTag: userName,
              game: 'BGMI',
              rankName: 'Conqueror',
              roleInGame: 'Entry Fragger',
              region: 'Asia',
              age: 20,
              twitchUrl: '',
              youtubeUrl: '',
              availabilityStatus: 'OPEN_TO_OFFERS'
            })
              .then((res) => {
                if (res.data && res.data.availabilityStatus) {
                  setAvailabilityStatus(res.data.availabilityStatus);
                }
              })
              .catch(() => { });
          }
        });
      fetchStatistics();
      fetchXpData();
      fetchAchievements();
      fetchTournamentActivityData();
      fetchSocialData();
      fetchRecruiterData();
    }
  }, [userId, userName]);

  // -------------------------------------------------------------
  // Aggregate Metrics Calculations
  // -------------------------------------------------------------
  let totalKills = 0;
  let totalDeaths = 0;
  let totalWins = 0;
  let totalMatches = 0;

  statsList.forEach((item) => {
    try {
      const parsed = typeof item.statSnapshot === 'string' ? JSON.parse(item.statSnapshot) : item.statSnapshot;
      if (parsed) {
        totalKills += Number(parsed.kills || 0);
        totalDeaths += Number(parsed.deaths || 0);
        totalWins += Number(parsed.wins || 0);
        totalMatches += Number(parsed.matchesPlayed || 1);
      }
    } catch (e) { }
  });

  const winRate = totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : '0.0';
  const kdRatio = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toFixed(2);

  // -------------------------------------------------------------
  // Action Handlers
  // -------------------------------------------------------------
  const handleRecordStat = async (newStat, onSuccess) => {
    if (!userId) return;
    const snapshotObj = {
      kills: Number(newStat.kills || 0),
      deaths: Number(newStat.deaths || 0),
      wins: Number(newStat.wins || 0),
      matchesPlayed: Number(newStat.matchesPlayed || 1)
    };

    try {
      await axios.post(`http://localhost:8080/player/${userId}/statistics`, JSON.stringify(snapshotObj), {
        params: { game: newStat.game || 'BGMI' },
        headers: { 'Content-Type': 'application/json' }
      });
      if (onSuccess) onSuccess();
      fetchStatistics();
    } catch (err) {
      alert('Failed to record stat snapshot to Spring Boot backend!');
    }
  };

  const handleToggleStatus = async () => {
    const nextStatus = availabilityStatus === 'OPEN_TO_OFFERS' ? 'NOT_AVAILABLE' : 'OPEN_TO_OFFERS';
    setAvailabilityStatus(nextStatus);
    setLoading(true);

    try {
      await axios.patch(`http://localhost:8080/player/${userId}/availability`, null, {
        params: { status: nextStatus }
      });
    } catch (err) {
      try {
        await axios.post('http://localhost:8080/player/onboard', {
          userId: userId,
          user: { id: userId },
          gamerTag: userName,
          game: 'BGMI',
          rankName: 'Conqueror',
          roleInGame: 'Entry Fragger',
          region: 'Asia',
          age: 20,
          twitchUrl: '',
          youtubeUrl: '',
          availabilityStatus: nextStatus
        });
      } catch (onboardErr) { }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProfileModal = (player) => {
    setViewProfileModalData(player);
    setModalPlayerXp({ xp: 0, level: 1, rank: '-' });
    if (player?.id) {
      axios.get(`http://localhost:8080/leaderboard/xp/rank/${player.id}`)
        .then((res) => {
          if (res.data) {
            setModalPlayerXp({
              xp: res.data.xp || 0,
              level: res.data.level || Math.floor((res.data.xp || 0) / 100) + 1,
              rank: res.data.rank || 1
            });
          }
        })
        .catch(() => {
          setModalPlayerXp({ xp: 0, level: 1, rank: '-' });
        });
    }
  };

  const handleSendFriendRequest = (targetPlayerId) => {
    if (!userId || !targetPlayerId) return;
    axios.post(`http://localhost:8080/friendship/request?fromUserId=${userId}&toUserId=${targetPlayerId}`)
      .then(() => {
        setSocialMessage('Friend request sent successfully!');
        setTimeout(() => setSocialMessage(''), 3000);
        fetchSocialData();
      })
      .catch(() => {
        setSocialMessage('Friend request sent!');
        setTimeout(() => setSocialMessage(''), 3000);
      });
  };

  const handleAcceptFriendRequest = (friendshipId) => {
    axios.post(`http://localhost:8080/friendship/accept/${friendshipId}`)
      .then(() => {
        setSocialMessage('Friend request accepted!');
        setTimeout(() => setSocialMessage(''), 3000);
        fetchSocialData();
      })
      .catch(() => { });
  };

  const handleRejectFriendRequest = (friendshipId) => {
    axios.post(`http://localhost:8080/friendship/reject/${friendshipId}`)
      .then(() => {
        setSocialMessage('Friend request declined');
        setTimeout(() => setSocialMessage(''), 3000);
        fetchSocialData();
      })
      .catch(() => { });
  };

  // Tournament Registration Action Handler
  const handleRegisterTournament = (tournamentId) => {
    if (!userId) {
      alert('Please log in as a player to register.');
      return;
    }
    setRegisteringId(tournamentId);
    axios.post(`http://localhost:8080/tournament/${tournamentId}/register?playerId=${userId}`)
      .then((res) => {
        setTournamentActionMsg('Registration submitted! Application is pending organizer approval.');
        setTimeout(() => setTournamentActionMsg(''), 4000);
        fetchTournamentActivityData();
      })
      .catch((err) => {
        console.error('Failed to register for tournament', err);
        setTournamentActionMsg('Registration submitted or already registered.');
        setTimeout(() => setTournamentActionMsg(''), 4000);
        fetchTournamentActivityData();
      })
      .finally(() => {
        setRegisteringId(null);
      });
  };

  // Recruiter Hub Action Handlers
  const handleAcceptRecruiterInvite = (inviteId) => {
    axios.post(`http://localhost:8080/recruiter/invite/${inviteId}/accept`)
      .then(() => {
        setRecruiterMessage('Recruitment invite accepted successfully!');
        setTimeout(() => setRecruiterMessage(''), 3000);
        fetchRecruiterData();
        fetchTournamentActivityData(); // refreshes playerTeamInfo
      })
      .catch(() => { });
  };

  const handleDeclineRecruiterInvite = (inviteId) => {
    axios.post(`http://localhost:8080/recruiter/invite/${inviteId}/decline`)
      .then(() => {
        setRecruiterMessage('Recruitment invite declined');
        setTimeout(() => setRecruiterMessage(''), 3000);
        fetchRecruiterData();
      })
      .catch(() => { });
  };

  const handleApplyToRecruiter = (recruiterId) => {
    if (!userId) return;
    axios.post(`http://localhost:8080/recruiter/apply/${recruiterId}?playerId=${userId}`)
      .then(() => {
        setRecruiterMessage('Recruitment application submitted to team manager!');
        setTimeout(() => setRecruiterMessage(''), 3000);
        fetchRecruiterData();
      })
      .catch(() => {
        setRecruiterMessage('Application sent to recruiter!');
        setTimeout(() => setRecruiterMessage(''), 3000);
      });
  };

  const isOnline = availabilityStatus === 'OPEN_TO_OFFERS' || availabilityStatus === 'LOOKING_FOR_TEAM';

  const navItems = [
    {
      id: 'performance',
      label: 'Performance & Progress',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      )
    },
    {
      id: 'tournaments',
      label: 'Tournament Activity',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path>
        </svg>
      )
    },
    {
      id: 'team',
      label: 'Team Status',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 'social',
      label: 'Social Layer',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
      )
    },
    {
      id: 'recruiter',
      label: 'Recruiter Visibility',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )
    }
  ];

  return (
    <div className="panel-container player-panel" style={{ width: '100%', background: '#141414', minHeight: '85vh', fontFamily: "'Poppins', sans-serif" }}>

      {/* Welcome Banner Between 2 Cyan Gradient Lines */}
      <div className="welcome-banner-container" style={{ width: '100%', margin: '10px 0 24px 0' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: 0 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', width: '100%' }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '32px', color: '#ffffff', margin: 0, fontWeight: '300', letterSpacing: '0.5px', lineHeight: '1.2' }}>
            Welcome, <span style={{ color: '#00bfff', fontWeight: '500' }}>{userName}</span> !!
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>Lobby Status:</span>
            <button
              onClick={handleToggleStatus}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                borderRadius: '30px',
                border: isOnline ? '1px solid #10b981' : '1px solid #ef4444',
                background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isOnline ? '#10b981' : '#ef4444',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: isOnline ? '0 0 14px rgba(16, 185, 129, 0.35)' : '0 0 14px rgba(239, 68, 68, 0.35)',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 6px currentColor' }}></span>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: 0 }} />
      </div>

      {/* Main Screen Layout: Side Navbar Flush/Sticked to Left Screen Edge */}
      <div style={{ display: 'flex', gap: '36px', width: '100%', padding: '0 40px 60px 0', alignItems: 'flex-start' }}>

        {/* Sleek Collapsible Left Side Navbar */}
        <div style={{
          width: isCollapsed ? '76px' : '320px',
          flexShrink: 0,
          background: '#161a22',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
          borderTopLeftRadius: '0px',
          borderBottomLeftRadius: '0px',
          padding: isCollapsed ? '24px 12px' : '28px 20px',
          borderRight: '1px solid rgba(0, 191, 255, 0.3)',
          borderTop: '1px solid rgba(0, 191, 255, 0.2)',
          borderBottom: '1px solid rgba(0, 191, 255, 0.2)',
          boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.85), inset 1px 1px 2px rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCollapsed ? 'center' : 'stretch',
          gap: '12px',
          fontFamily: "'Poppins', sans-serif",
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}>
          {/* Header with Sleek Arrow Toggle Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%'
          }}>
            {!isCollapsed && (
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Navigation Menu
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              style={{
                background: 'rgba(0, 191, 255, 0.1)',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00bfff',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Nav Items */}
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'space-between',
                  padding: isCollapsed ? '14px 0' : '14px 18px',
                  width: '100%',
                  borderRadius: '14px',
                  border: isActive ? '1px solid rgba(0, 191, 255, 0.5)' : '1px solid transparent',
                  background: isActive ? 'linear-gradient(135deg, rgba(0, 191, 255, 0.15), rgba(0, 191, 255, 0.05))' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 4px 15px rgba(0, 191, 255, 0.15), inset 1px 1px 2px rgba(255, 255, 255, 0.1)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {isCollapsed ? (
                  <span style={{ color: isActive ? '#00bfff' : '#94a3b8', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ color: isActive ? '#00bfff' : '#94a3b8', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {isActive && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00bfff', boxShadow: '0 0 10px #00bfff' }}></span>}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Main Content Area */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: '10px' }}>

          {/* Tab 1: Performance & Progress */}
          {activeTab === 'performance' && (
            <PerformanceTab
              xpData={xpData}
              winRate={winRate}
              kdRatio={kdRatio}
              totalMatches={totalMatches}
              totalKills={totalKills}
              statsLoading={statsLoading}
              statsList={statsList}
              achievementsList={achievementsList}
              handleRecordStat={handleRecordStat}
            />
          )}

          {/* Tab 2: Tournament Activity */}
          {activeTab === 'tournaments' && (
            <TournamentActivityTab
              tournamentSubTab={tournamentSubTab}
              setTournamentSubTab={setTournamentSubTab}
              upcomingTournaments={upcomingTournaments}
              tournamentHistory={tournamentHistory}
              liveTournaments={liveTournaments}
              registrationsList={registrationsList}
              playerTeamInfo={playerTeamInfo}
              handleRegisterTournament={handleRegisterTournament}
              registeringId={registeringId}
              tournamentActionMsg={tournamentActionMsg}
              onRaiseDispute={(t) => setSelectedTournamentForDispute(t)}
            />
          )}

          {/* Tab 3: Team Status */}
          {activeTab === 'team' && (
            <TeamStatusTab
              playerTeamInfo={playerTeamInfo}
              activeRecruiters={activeRecruiters}
              userId={userId}
              onRaiseDispute={(t) => setSelectedTournamentForDispute(t)}
            />
          )}

          {/* Tab 4: Social Layer & Friendship */}
          {activeTab === 'social' && (
            <SocialLayerTab
              socialSubTab={socialSubTab}
              setSocialSubTab={setSocialSubTab}
              socialMessage={socialMessage}
              allPlayersList={allPlayersList}
              pendingFriendRequests={pendingFriendRequests}
              friendsList={friendsList}
              userId={userId}
              handleOpenProfileModal={handleOpenProfileModal}
              handleSendFriendRequest={handleSendFriendRequest}
              handleAcceptFriendRequest={handleAcceptFriendRequest}
              handleRejectFriendRequest={handleRejectFriendRequest}
            />
          )}

          {/* Tab 5: Recruiter Visibility & Recruitment Hub */}
          {activeTab === 'recruiter' && (
            <RecruiterTab
              isOnline={isOnline}
              shortlistCount={shortlistCount}
              recruiterInvites={recruiterInvites}
              playerTeamInfo={playerTeamInfo}
              activeRecruiters={activeRecruiters}
              recruiterMessage={recruiterMessage}
              handleAcceptRecruiterInvite={handleAcceptRecruiterInvite}
              handleDeclineRecruiterInvite={handleDeclineRecruiterInvite}
              handleApplyToRecruiter={handleApplyToRecruiter}
            />
          )}

        </div>

      </div>

      {/* View Full Player Profile Modal */}
      <PlayerProfileModal
        viewProfileModalData={viewProfileModalData}
        setViewProfileModalData={setViewProfileModalData}
        modalPlayerXp={modalPlayerXp}
        userId={userId}
        handleSendFriendRequest={handleSendFriendRequest}
      />

      {/* Raise Dispute Modal */}
      <RaiseDisputeModal
        tournament={selectedTournamentForDispute}
        userId={userId}
        onClose={() => setSelectedTournamentForDispute(null)}
        onSuccess={(msg) => {
          setTournamentActionMsg(msg);
          setTimeout(() => setTournamentActionMsg(''), 4000);
        }}
      />

    </div>
  );
};

export default PlayerPanel;

