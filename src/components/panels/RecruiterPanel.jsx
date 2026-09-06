import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecruiterPanel.css';

const RecruiterPanel = ({ userProfile }) => {
  const userId = userProfile?.userId || userProfile?.id || 1;
  const userName = userProfile?.fullname || userProfile?.gamerTag || 'Talent Recruiter';
  
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('scout');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Recruiter Profile State
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const recruiterId = recruiterProfile?.id;

  // Tab 1: Scout & Search Players State (with DTO & Pagination)
  const [searchFilters, setSearchFilters] = useState({
    game: '',
    region: '',
    rank: '',
    roleInGame: '',
    minAge: '',
    maxAge: ''
  });
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [playersList, setPlayersList] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  // Tab 2: Shortlisted Talent State
  const [shortlist, setShortlist] = useState([]);
  const [notInvitedOnly, setNotInvitedOnly] = useState(false);

  // Tab 3: Sent Invites State
  const [sentInvites, setSentInvites] = useState([]);
  const [playersMap, setPlayersMap] = useState({});

  // Tab 4: Managed Team State
  const [managedTeam, setManagedTeam] = useState(null);
  const [teamRoster, setTeamRoster] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(false);

  // Tab 5: Squad Tournaments State
  const [tournaments, setTournaments] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [registeredTournaments, setRegisteredTournaments] = useState({});
  const [registeringTournamentId, setRegisteringTournamentId] = useState(null);
  const [roomDetailsMap, setRoomDetailsMap] = useState({});
  const [loadingRoomId, setLoadingRoomId] = useState(null);

  // Tab 5: OTP Verification State
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchPlayersDirectory = () => {
    axios.get('http://localhost:8080/player/all')
      .then((res) => {
        if (Array.isArray(res.data)) {
          const map = {};
          res.data.forEach((p) => {
            map[p.id] = p;
          });
          setPlayersMap(map);
        }
      })
      .catch(() => {});
  };

  // -------------------------------------------------------------
  // Initial Lifecycle Load & Profile Resolution
  // -------------------------------------------------------------
  const fetchRecruiterProfile = () => {
    if (!userId) return;
    fetchPlayersDirectory();
    axios.get('http://localhost:8080/recruiter/all')
      .then((res) => {
        if (Array.isArray(res.data)) {
          const found = res.data.find((r) => r.userId === userId);
          if (found) {
            setRecruiterProfile(found);
          } else {
            // Auto-onboard recruiter profile if missing
            axios.post('http://localhost:8080/recruiter/onboard', {
              userId: userId,
              organizationName: userName.includes(' ') ? userName : `${userName} Esports`,
              region: 'Asia',
              websiteUrl: 'https://areanix.gg',
              logoUrl: '',
              gamesRecruiting: 'BGMI, Valorant, CS2',
              bio: 'Active recruiter scouting tier-1 and tier-2 esports prospects.'
            })
              .then(() => {
                axios.get('http://localhost:8080/recruiter/all')
                  .then((allRes) => {
                    const created = allRes.data?.find((r) => r.userId === userId);
                    if (created) setRecruiterProfile(created);
                  })
                  .catch(() => {});
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchRecruiterProfile();
  }, [userId, userName]);

  // -------------------------------------------------------------
  // Data Fetchers
  // -------------------------------------------------------------
  const fetchPlayers = (currentPage = 0) => {
    setLoadingPlayers(true);
    const params = {
      page: currentPage,
      size: size
    };
    if (searchFilters.game) params.game = searchFilters.game;
    if (searchFilters.region) params.region = searchFilters.region;
    if (searchFilters.rank) params.rank = searchFilters.rank;
    if (searchFilters.roleInGame) params.roleInGame = searchFilters.roleInGame;
    if (searchFilters.minAge) params.minAge = searchFilters.minAge;
    if (searchFilters.maxAge) params.maxAge = searchFilters.maxAge;

    axios.get('http://localhost:8080/recruiter/search', { params })
      .then((res) => {
        if (res.data) {
          setPlayersList(res.data.content || []);
          setTotalPages(res.data.totalPages || 0);
          setTotalElements(res.data.totalElements || 0);
        }
      })
      .catch(() => {
        setPlayersList([]);
      })
      .finally(() => setLoadingPlayers(false));
  };

  const fetchShortlist = () => {
    if (!recruiterId) return;
    fetchPlayersDirectory();
    axios.get(`http://localhost:8080/recruiter/${recruiterId}/shortlist`, {
      params: { notInvitedOnly }
    })
      .then((res) => {
        setShortlist(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setShortlist([]));
  };

  const fetchSentInvites = () => {
    if (!recruiterId) return;
    fetchPlayersDirectory();
    axios.get(`http://localhost:8080/recruiter/${recruiterId}/invites`)
      .then((res) => {
        setSentInvites(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setSentInvites([]));
  };

  const fetchTeamRoster = (teamId) => {
    if (!teamId) return;
    axios.get(`http://localhost:8080/team/${teamId}/roster`)
      .then((res) => {
        setTeamRoster(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setTeamRoster([]));
  };

  const fetchManagedTeam = () => {
    if (!userId && !recruiterId) return;
    setLoadingTeam(true);
    fetchPlayersDirectory();

    const targetId = userId || recruiterId;
    axios.get(`http://localhost:8080/recruiter/${targetId}/managed-team`)
      .then((res) => {
        if (res.data && res.data.id) {
          setManagedTeam(res.data);
          fetchTeamRoster(res.data.id);
        } else if (recruiterId && recruiterId !== targetId) {
          axios.get(`http://localhost:8080/recruiter/${recruiterId}/managed-team`)
            .then((rRes) => {
              if (rRes.data && rRes.data.id) {
                setManagedTeam(rRes.data);
                fetchTeamRoster(rRes.data.id);
              } else {
                setManagedTeam(null);
                setTeamRoster([]);
              }
            })
            .catch(() => {
              setManagedTeam(null);
              setTeamRoster([]);
            });
        } else {
          setManagedTeam(null);
          setTeamRoster([]);
        }
      })
      .catch(() => {
        if (recruiterId && recruiterId !== targetId) {
          axios.get(`http://localhost:8080/recruiter/${recruiterId}/managed-team`)
            .then((rRes) => {
              if (rRes.data && rRes.data.id) {
                setManagedTeam(rRes.data);
                fetchTeamRoster(rRes.data.id);
              } else {
                setManagedTeam(null);
                setTeamRoster([]);
              }
            })
            .catch(() => {
              setManagedTeam(null);
              setTeamRoster([]);
            });
        } else {
          setManagedTeam(null);
          setTeamRoster([]);
        }
      })
      .finally(() => setLoadingTeam(false));
  };

  const handleRemoveMember = (teamId, playerId) => {
    if (!teamId || !playerId) return;
    axios.delete(`http://localhost:8080/team/${teamId}/removemember/${playerId}`)
      .then(() => {
        showToast('Player removed from team roster.');
        fetchTeamRoster(teamId);
      })
      .catch(() => showToast('Failed to remove player from roster.'));
  };

  const fetchTournaments = () => {
    setLoadingTournaments(true);
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
    }).finally(() => setLoadingTournaments(false));
  };

  const handleRegisterSquad = (tournamentId) => {
    if (!managedTeam || !managedTeam.id) {
      showToast('Please create or link a managed squad first before registering.');
      return;
    }
    setRegisteringTournamentId(tournamentId);
    axios.post(`http://localhost:8080/tournament/${tournamentId}/register?teamId=${managedTeam.id}`)
      .then(() => {
        showToast(`Squad "${managedTeam.name || 'Team'}" registered successfully for tournament #${tournamentId}!`);
        setRegisteredTournaments(prev => ({ ...prev, [tournamentId]: 'PENDING' }));
        fetchTournaments();
      })
      .catch((err) => {
        const msg = err.response?.data || 'Failed to register squad.';
        showToast(typeof msg === 'string' ? msg : 'Failed to register squad.');
      })
      .finally(() => setRegisteringTournamentId(null));
  };

  const fetchRoomDetails = (tournamentId) => {
    setLoadingRoomId(tournamentId);
    axios.get(`http://localhost:8080/tournament/${tournamentId}/detail`)
      .then((res) => {
        if (res.data) {
          setRoomDetailsMap(prev => ({
            ...prev,
            [tournamentId]: {
              roomId: res.data.roomId || 'Not Released Yet',
              roomPassword: res.data.roomPassword || 'Not Released Yet'
            }
          }));
        }
      })
      .catch(() => showToast('Could not fetch tournament room details.'))
      .finally(() => setLoadingRoomId(null));
  };

  useEffect(() => {
    if (activeTab === 'scout') {
      fetchPlayers(page);
    } else if (activeTab === 'shortlist') {
      fetchShortlist();
    } else if (activeTab === 'invites') {
      fetchSentInvites();
    } else if (activeTab === 'team') {
      fetchManagedTeam();
    } else if (activeTab === 'tournaments') {
      fetchManagedTeam();
      fetchTournaments();
    }
  }, [activeTab, recruiterId, notInvitedOnly, page]);

  // -------------------------------------------------------------
  // Actions: Shortlist, Invite, Remove, Withdraw, OTP
  // -------------------------------------------------------------
  const handleShortlistPlayer = (playerId) => {
    if (!recruiterId) {
      showToast('Recruiter profile loading. Please try again.');
      return;
    }
    axios.post(`http://localhost:8080/recruiter/${recruiterId}/shortlist/${playerId}`)
      .then(() => {
        showToast('Player shortlisted successfully!');
        fetchPlayers(page);
      })
      .catch(() => showToast('Player already in shortlist.'));
  };

  const handleRemoveShortlist = (playerId) => {
    if (!recruiterId) return;
    axios.delete(`http://localhost:8080/recruiter/${recruiterId}/shortlist/${playerId}`)
      .then(() => {
        showToast('Player removed from shortlist.');
        fetchShortlist();
      })
      .catch(() => showToast('Failed to remove player from shortlist.'));
  };

  const handleSendInvite = (playerId) => {
    if (!recruiterId) return;
    axios.post(`http://localhost:8080/recruiter/${recruiterId}/invite/${playerId}`)
      .then(() => {
        showToast('Official recruitment invite sent!');
        fetchSentInvites();
        if (activeTab === 'shortlist') fetchShortlist();
      })
      .catch(() => showToast('Invite sent to player.'));
  };

  const handleWithdrawInvite = (inviteId) => {
    axios.delete(`http://localhost:8080/recruiter/invite/${inviteId}`)
      .then(() => {
        showToast('Invite withdrawn successfully.');
        fetchSentInvites();
      })
      .catch((err) => {
        const msg = err.response?.data || 'Cannot withdraw invite.';
        showToast(typeof msg === 'string' ? msg : 'Cannot withdraw this invite.');
      });
  };

  const handleSendOtp = () => {
    if (!recruiterId) return;
    axios.post(`http://localhost:8080/recruiter/${recruiterId}/send-otp`)
      .then(() => {
        setOtpSent(true);
        showToast('Verification OTP sent to your registered email address!');
      })
      .catch(() => showToast('Failed to send OTP. Verify account email.'));
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!recruiterId || !otpInput) return;
    setVerifyingOtp(true);
    axios.post(`http://localhost:8080/recruiter/${recruiterId}/verify-otp?otp=${otpInput}`)
      .then((res) => {
        setRecruiterProfile(res.data);
        showToast('Congratulations! Recruiter profile officially VERIFIED.');
        setOtpInput('');
      })
      .catch(() => showToast('Invalid or expired OTP. Please try again.'))
      .finally(() => setVerifyingOtp(false));
  };

  const isVerified = recruiterProfile?.verificationStatus === 'VERIFIED';

  const navItems = [
    {
      id: 'scout',
      label: 'Scout Players',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      )
    },
    {
      id: 'shortlist',
      label: 'Shortlisted Talent',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      )
    },
    {
      id: 'invites',
      label: 'Sent Invites',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      )
    },
    {
      id: 'team',
      label: 'Managed Team',
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
      id: 'tournaments',
      label: 'Squad Tournaments',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"></circle>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
        </svg>
      )
    },
    {
      id: 'verify',
      label: 'Org Verification',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="panel-container recruiter-panel" style={{ width: '100%', background: '#141414', minHeight: '85vh', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Welcome Banner Between 2 Cyan Gradient Lines */}
      <div className="welcome-banner-container" style={{ width: '100%', margin: '10px 0 24px 0' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: 0 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', width: '100%' }}>
          <div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '32px', color: '#ffffff', margin: 0, fontWeight: '300', letterSpacing: '0.5px', lineHeight: '1.2' }}>
              Welcome, <span style={{ color: '#00bfff', fontWeight: '500' }}>{recruiterProfile?.organizationName || userName}</span> !!
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
              Esports Talent Scouting & Recruitment Management System
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '13px', color: '#94a3b8', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Org Trust Status:
            </span>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '30px',
              border: isVerified ? '1px solid #10b981' : '1px solid #f59e0b',
              background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isVerified ? '#10b981' : '#f59e0b',
              fontWeight: '600',
              fontSize: '13px',
              boxShadow: isVerified ? '0 0 14px rgba(16, 185, 129, 0.35)' : '0 0 14px rgba(245, 158, 11, 0.35)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 6px currentColor' }}></span>
              {isVerified ? 'VERIFIED RECRUITER' : 'PENDING VERIFICATION'}
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: 0 }} />
      </div>

      {/* Main Screen Layout */}
      <div style={{ display: 'flex', gap: '36px', width: '100%', padding: '0 40px 60px 0', alignItems: 'flex-start' }}>
        
        {/* Left Side Navbar */}
        <div style={{
          width: isCollapsed ? '76px' : '300px',
          flexShrink: 0,
          background: '#161a22',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
          padding: isCollapsed ? '24px 12px' : '28px 20px',
          borderRight: '1px solid rgba(0, 191, 255, 0.3)',
          borderTop: '1px solid rgba(0, 191, 255, 0.2)',
          borderBottom: '1px solid rgba(0, 191, 255, 0.2)',
          boxShadow: '10px 10px 30px rgba(0, 0, 0, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isCollapsed ? 'center' : 'stretch',
          gap: '12px',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}>
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
                Recruiter Menu
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
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
                cursor: 'pointer'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isCollapsed ? (
                  <span style={{ color: isActive ? '#00bfff' : '#94a3b8' }}>{item.icon}</span>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ color: isActive ? '#00bfff' : '#94a3b8' }}>{item.icon}</span>
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
          
          {/* Toast Notification */}
          {toastMessage && (
            <div style={{ background: 'rgba(0, 191, 255, 0.15)', border: '1px solid #00bfff', color: '#00bfff', padding: '14px 20px', borderRadius: '14px', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>
              {toastMessage}
            </div>
          )}

          {/* TAB 1: Scout & Search Players */}
          {activeTab === 'scout' && (
            <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
                    Talent Scouting Database
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                    Filtered search with live XP leveling, verified achievements, and shortlist social proof metrics.
                  </p>
                </div>
                <span style={{ color: '#00bfff', fontSize: '14px', fontWeight: '600' }}>
                  {totalElements} Players Found
                </span>
              </div>

              {/* Filter Controls Bar */}
              <div style={{ background: '#12151c', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                <input
                  type="text"
                  placeholder="Game (e.g. BGMI)"
                  value={searchFilters.game}
                  onChange={(e) => setSearchFilters({ ...searchFilters, game: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', background: '#161a22', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder="Region (e.g. Asia)"
                  value={searchFilters.region}
                  onChange={(e) => setSearchFilters({ ...searchFilters, region: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', background: '#161a22', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder="Rank (e.g. Conqueror)"
                  value={searchFilters.rank}
                  onChange={(e) => setSearchFilters({ ...searchFilters, rank: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', background: '#161a22', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder="Role (e.g. IGL)"
                  value={searchFilters.roleInGame}
                  onChange={(e) => setSearchFilters({ ...searchFilters, roleInGame: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '10px', background: '#161a22', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px' }}
                />
                <button
                  type="button"
                  onClick={() => { setPage(0); fetchPlayers(0); }}
                  style={{ padding: '10px 18px', borderRadius: '10px', background: 'linear-gradient(135deg, #00bfff, #0055ff)', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                >
                  Apply Filters
                </button>
              </div>

              {/* Players Grid (PlayerSearchResultDto) */}
              {loadingPlayers ? (
                <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>Searching platform players...</p>
              ) : playersList.length === 0 ? (
                <div style={{ background: '#12151c', padding: '36px', borderRadius: '18px', textAlign: 'center' }}>
                  <p style={{ color: '#cbd5e1', fontSize: '15px', margin: 0 }}>No players matched your filter criteria.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                  {playersList.map((p) => (
                    <div key={p.id} style={{ background: '#12151c', padding: '24px', borderRadius: '18px', border: '1px solid rgba(0, 191, 255, 0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 18px rgba(0,0,0,0.5)' }}>
                      <div>
                        {/* Top Badges */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid rgba(0, 191, 255, 0.4)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                            {p.game || 'BGMI'}
                          </span>
                          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600' }}>
                            {p.shortlistCount} Scouts Shortlisted
                          </span>
                        </div>

                        {/* Player Header */}
                        <h3 style={{ color: '#ffffff', fontSize: '20px', margin: '0 0 6px 0', fontWeight: '600' }}>
                          {p.gamerTag || `Player #${p.id}`}
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 14px 0' }}>
                          Rank: <strong style={{ color: '#f59e0b' }}>{p.rankName || 'Conqueror'}</strong> | Role: <strong style={{ color: '#fff' }}>{p.roleInGame || 'Entry Fragger'}</strong>
                        </p>

                        {/* Performance Metrics Stats Row */}
                        <div style={{ background: '#161a22', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>TOTAL XP</span>
                            <strong style={{ color: '#00bfff', fontSize: '14px' }}>{p.totalXp || 0} XP</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>LEVEL</span>
                            <strong style={{ color: '#f59e0b', fontSize: '14px' }}>Level {p.currentLevel || 1}</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>REGION</span>
                            <strong style={{ color: '#fff', fontSize: '14px' }}>{p.region || 'Asia'}</strong>
                          </div>
                        </div>

                        {/* Achievements Tags */}
                        {p.achievements && p.achievements.length > 0 && (
                          <div style={{ marginBottom: '16px' }}>
                            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>
                              Verified Achievements:
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {p.achievements.map((achTitle, idx) => (
                                <span key={idx} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '500' }}>
                                  {achTitle}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={() => handleShortlistPlayer(p.id)}
                          style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#1c2330', border: '1px solid rgba(0, 191, 255, 0.4)', color: '#00bfff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                        >
                          Shortlist
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendInvite(p.id)}
                          style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                        >
                          Send Invite
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    style={{ padding: '8px 16px', borderRadius: '10px', background: '#1c2330', border: '1px solid rgba(255,255,255,0.1)', color: page === 0 ? '#64748b' : '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
                  >
                    &larr; Previous
                  </button>
                  <span style={{ color: '#94a3b8', fontSize: '14px' }}>
                    Page <strong style={{ color: '#fff' }}>{page + 1}</strong> of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    style={{ padding: '8px 16px', borderRadius: '10px', background: '#1c2330', border: '1px solid rgba(255,255,255,0.1)', color: page >= totalPages - 1 ? '#64748b' : '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Shortlisted Talent */}
          {activeTab === 'shortlist' && (
            <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
                    Shortlisted Prospects
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                    Manage prospects you have shortlisted for upcoming roster auditions and trials.
                  </p>
                </div>

                {/* Filter toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notInvitedOnly}
                    onChange={(e) => setNotInvitedOnly(e.target.checked)}
                  />
                  Show Only Players Not Yet Invited
                </label>
              </div>

              {shortlist.length === 0 ? (
                <div style={{ background: '#12151c', padding: '36px', borderRadius: '18px', textAlign: 'center' }}>
                  <p style={{ color: '#cbd5e1', fontSize: '15px', margin: 0 }}>No players currently in your shortlist.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                  {shortlist.map((sp) => {
                    const player = playersMap[sp.playerId];
                    const avatar = player?.profileImageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${player?.gamerTag || sp.playerId}`;

                    return (
                      <div key={sp.id} style={{ background: '#12151c', padding: '22px', borderRadius: '16px', border: '1px solid rgba(0, 191, 255, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 18px rgba(0,0,0,0.4)' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                            <img
                              src={avatar}
                              alt="Player Avatar"
                              style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #00bfff', objectFit: 'cover', background: '#161a22' }}
                            />
                            <div>
                              <h4 style={{ color: '#ffffff', fontSize: '18px', margin: '0 0 2px 0', fontWeight: '600' }}>
                                {player?.gamerTag || `Player #${sp.playerId}`}
                              </h4>
                              <span style={{ color: '#00bfff', fontSize: '12px', fontWeight: '600' }}>
                                {player?.game || 'BGMI'} &bull; <span style={{ color: '#f59e0b' }}>{player?.rankName || 'Conqueror'}</span>
                              </span>
                            </div>
                          </div>

                          <div style={{ background: '#161a22', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ color: '#94a3b8' }}>Role: <strong style={{ color: '#fff' }}>{player?.roleInGame || 'Entry Fragger'}</strong></span>
                            <span style={{ color: '#94a3b8' }}>Region: <strong style={{ color: '#fff' }}>{player?.region || 'Asia'}</strong></span>
                          </div>

                          <span style={{ color: '#64748b', fontSize: '11px' }}>
                            Shortlisted: {sp.createdAt ? new Date(sp.createdAt).toLocaleDateString() : 'Recently'}
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                          <button
                            type="button"
                            onClick={() => handleSendInvite(sp.playerId)}
                            style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Send Invite
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveShortlist(sp.playerId)}
                            style={{ padding: '10px 14px', borderRadius: '10px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Sent Invites */}
          {activeTab === 'invites' && (
            <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85)' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
                  Sent Recruitment Offers
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                  Track response status and withdraw pending offers if plans change.
                </p>
              </div>

              {sentInvites.length === 0 ? (
                <div style={{ background: '#12151c', padding: '36px', borderRadius: '18px', textAlign: 'center' }}>
                  <p style={{ color: '#cbd5e1', fontSize: '15px', margin: 0 }}>No invites sent yet. Find players on the Scout tab!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {sentInvites.map((inv) => {
                    const isPending = inv.status === 'PENDING';
                    const isAccepted = inv.status === 'ACCEPTED';
                    const isDeclined = inv.status === 'DECLINED';
                    const player = playersMap[inv.playerId];
                    const avatar = player?.profileImageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${player?.gamerTag || inv.playerId}`;

                    return (
                      <div key={inv.id} style={{ background: '#12151c', padding: '20px 24px', borderRadius: '16px', border: '1px solid rgba(0, 191, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 18px rgba(0,0,0,0.4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                          <img
                            src={avatar}
                            alt="Player Avatar"
                            style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #00bfff', objectFit: 'cover', background: '#161a22' }}
                          />

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <h4 style={{ color: '#ffffff', margin: 0, fontSize: '18px', fontWeight: '600' }}>
                                {player?.gamerTag || `Player #${inv.playerId}`}
                              </h4>
                              <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid rgba(0, 191, 255, 0.4)', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>
                                {player?.game || 'BGMI'}
                              </span>
                              <span style={{
                                padding: '2px 10px',
                                borderRadius: '10px',
                                fontSize: '11px',
                                fontWeight: '700',
                                background: isAccepted ? 'rgba(16, 185, 129, 0.15)' : isPending ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: isAccepted ? '#10b981' : isPending ? '#f59e0b' : '#ef4444',
                                border: isAccepted ? '1px solid #10b981' : isPending ? '1px solid #f59e0b' : '1px solid #ef4444'
                              }}>
                                {isAccepted ? 'OFFER ACCEPTED' : isPending ? 'PENDING RESPONSE' : isDeclined ? 'OFFER DECLINED' : inv.status}
                              </span>
                            </div>

                            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '2px 0 6px 0' }}>
                              Rank: <strong style={{ color: '#f59e0b' }}>{player?.rankName || 'Conqueror'}</strong> &bull; Role: <strong style={{ color: '#fff' }}>{player?.roleInGame || 'Entry Fragger'}</strong> &bull; Region: <strong style={{ color: '#fff' }}>{player?.region || 'Asia'}</strong>
                            </p>

                            <span style={{ color: '#64748b', fontSize: '12px' }}>
                              Sent Date: {inv.createdAt ? new Date(inv.createdAt).toLocaleString() : 'Recently'}
                            </span>
                          </div>
                        </div>

                        {isPending && (
                          <button
                            type="button"
                            onClick={() => handleWithdrawInvite(inv.id)}
                            style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                          >
                            Withdraw Offer
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Managed Team */}
          {activeTab === 'team' && (
            <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
                    Managed Esports Organization / Team
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                    Active squad and competitive roster managed by this recruiter account.
                  </p>
                </div>
                {managedTeam && (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tournaments')}
                      style={{ padding: '10px 18px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
                    >
                      🏆 Participate in Tournaments
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('scout')}
                      style={{ padding: '10px 18px', borderRadius: '12px', background: 'rgba(0, 191, 255, 0.15)', border: '1px solid #00bfff', color: '#00bfff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                    >
                      + Scout More Talent
                    </button>
                  </div>
                )}
              </div>

              {loadingTeam ? (
                <div style={{ background: '#12151c', padding: '36px', borderRadius: '18px', textAlign: 'center' }}>
                  <p style={{ color: '#00bfff', fontSize: '15px', margin: 0 }}>Loading managed squad and roster data...</p>
                </div>
              ) : !managedTeam ? (
                <div style={{ background: '#12151c', padding: '36px', borderRadius: '18px', textAlign: 'center' }}>
                  <p style={{ color: '#cbd5e1', fontSize: '15px', margin: '0 0 8px 0', fontWeight: '500' }}>No Esports Team Registered Under Manager ID #{userId}</p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Create or register your squad in the Teams module to link roster management directly here.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Team Overview Card */}
                  <div style={{ background: '#12151c', padding: '28px', borderRadius: '18px', border: '1px solid rgba(0, 191, 255, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
                      <div>
                        <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid #00bfff', padding: '3px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>
                          OFFICIAL SQUAD
                        </span>
                        <h3 style={{ fontSize: '26px', color: '#ffffff', margin: '8px 0 4px 0', fontWeight: '700' }}>
                          {managedTeam.name || `Team #${managedTeam.id}`}
                        </h3>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                          Game Focus: <strong style={{ color: '#fff' }}>{managedTeam.game || managedTeam.gameFocus || 'BGMI'}</strong> &bull; Region: <strong style={{ color: '#00bfff' }}>{managedTeam.region || 'Asia'}</strong>
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block' }}>TEAM IDENTIFIER</span>
                        <strong style={{ color: '#f59e0b', fontSize: '22px' }}>#{managedTeam.id}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Active Roster List */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ color: '#ffffff', fontSize: '18px', margin: 0, fontWeight: '600' }}>
                        Active Squad Roster ({teamRoster.length} Players)
                      </h4>
                      <span style={{ color: '#64748b', fontSize: '13px' }}>
                        Enrolled via platform recruitment offers
                      </span>
                    </div>

                    {teamRoster.length === 0 ? (
                      <div style={{ background: '#12151c', padding: '32px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 12px 0' }}>
                          No players currently active on this roster.
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('scout')}
                          style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(0, 191, 255, 0.15)', border: '1px solid #00bfff', color: '#00bfff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Find Talent & Send Invites &rarr;
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                        {teamRoster.map((m) => {
                          const player = playersMap[m.playerId];
                          const avatar = player?.profileImageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${player?.gamerTag || m.playerId}`;

                          return (
                            <div key={m.id} style={{ background: '#12151c', padding: '22px', borderRadius: '16px', border: '1px solid rgba(0, 191, 255, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 18px rgba(0,0,0,0.4)' }}>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                                  <img
                                    src={avatar}
                                    alt="Roster Player"
                                    style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #00bfff', objectFit: 'cover', background: '#161a22' }}
                                  />
                                  <div>
                                    <h5 style={{ color: '#ffffff', fontSize: '17px', margin: '0 0 2px 0', fontWeight: '700' }}>
                                      {player?.gamerTag || `Player #${m.playerId}`}
                                    </h5>
                                    <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '700', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                                      ACTIVE SQUAD MEMBER
                                    </span>
                                  </div>
                                </div>

                                <div style={{ background: '#161a22', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#94a3b8' }}>Game:</span>
                                    <strong style={{ color: '#00bfff' }}>{player?.game || managedTeam.game || 'BGMI'}</strong>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#94a3b8' }}>Rank:</span>
                                    <strong style={{ color: '#f59e0b' }}>{player?.rankName || 'Conqueror'}</strong>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#94a3b8' }}>Role:</span>
                                    <strong style={{ color: '#fff' }}>{player?.roleInGame || 'Entry Fragger'}</strong>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#94a3b8' }}>Region:</span>
                                    <strong style={{ color: '#fff' }}>{player?.region || 'Asia'}</strong>
                                  </div>
                                </div>

                                <span style={{ color: '#64748b', fontSize: '11px' }}>
                                  Joined: {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : 'Recently'}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveMember(managedTeam.id, m.playerId)}
                                style={{ marginTop: '16px', padding: '9px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
                              >
                                Remove from Roster
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Squad Tournaments Participation */}
          {activeTab === 'tournaments' && (
            <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
                    Squad Tournament Participation
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                    Enroll your active esports lineup into official tournaments and access live match room details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchTournaments}
                  style={{ padding: '10px 18px', borderRadius: '12px', background: 'rgba(0, 191, 255, 0.15)', border: '1px solid #00bfff', color: '#00bfff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                >
                  ↻ Refresh Tournaments
                </button>
              </div>

              {/* Squad Readiness Banner */}
              {managedTeam ? (
                <div style={{ background: 'linear-gradient(135deg, rgba(0, 191, 255, 0.1), rgba(0, 85, 255, 0.05))', border: '1px solid rgba(0, 191, 255, 0.35)', borderRadius: '18px', padding: '22px 28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981', padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                      REGISTERING AS ACTIVE SQUAD
                    </span>
                    <h3 style={{ color: '#fff', fontSize: '22px', margin: '8px 0 2px 0', fontWeight: '700' }}>
                      {managedTeam.name || `Team #${managedTeam.id}`}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                      Active Roster: <strong style={{ color: '#00bfff' }}>{teamRoster.length} Players</strong> &bull; Game Focus: <strong style={{ color: '#fff' }}>{managedTeam.game || managedTeam.gameFocus || 'BGMI'}</strong>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block' }}>TEAM SQUAD ID</span>
                    <strong style={{ color: '#f59e0b', fontSize: '22px' }}>#{managedTeam.id}</strong>
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
                  <p style={{ color: '#f59e0b', margin: 0, fontSize: '14px', fontWeight: '600' }}>
                    ⚠️ No active managed team found. Please check the Managed Team tab first to register or link your team roster before registering for tournaments.
                  </p>
                </div>
              )}

              {/* Tournament Listings */}
              {loadingTournaments ? (
                <div style={{ background: '#12151c', padding: '36px', borderRadius: '18px', textAlign: 'center' }}>
                  <p style={{ color: '#00bfff', fontSize: '15px', margin: 0 }}>Discovering active & upcoming tournaments...</p>
                </div>
              ) : tournaments.length === 0 ? (
                <div style={{ background: '#12151c', padding: '36px', borderRadius: '18px', textAlign: 'center' }}>
                  <p style={{ color: '#cbd5e1', fontSize: '15px', margin: '0 0 6px 0' }}>No active or upcoming tournaments hosted yet.</p>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Check back shortly as tournament organizers publish upcoming brackets.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {tournaments.map((t) => {
                    const isRegistered = registeredTournaments[t.id];
                    const isRegistering = registeringTournamentId === t.id;
                    const roomInfo = roomDetailsMap[t.id];

                    return (
                      <div key={t.id} style={{ background: '#12151c', padding: '24px', borderRadius: '18px', border: '1px solid rgba(0, 191, 255, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 6px 22px rgba(0,0,0,0.45)' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{
                              background: t.status === 'ONGOING' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 191, 255, 0.15)',
                              color: t.status === 'ONGOING' ? '#ef4444' : '#00bfff',
                              border: t.status === 'ONGOING' ? '1px solid #ef4444' : '1px solid #00bfff',
                              padding: '3px 10px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              fontWeight: '700'
                            }}>
                              {t.status || 'UPCOMING'}
                            </span>

                            <span style={{ color: '#10b981', fontWeight: '700', fontSize: '15px' }}>
                              ₹{t.prizePool?.toLocaleString() || 'TBD'}
                            </span>
                          </div>

                          <h4 style={{ color: '#ffffff', fontSize: '19px', margin: '0 0 6px 0', fontWeight: '600' }}>
                            {t.name || t.title || `Tournament #${t.id}`}
                          </h4>

                          <p style={{ color: '#00bfff', fontSize: '13px', margin: '0 0 12px 0' }}>
                            <span style={{ color: '#94a3b8' }}>Host:</span> <strong>{t.organizer?.organizationName || t.organizer?.user?.fullname || (t.organizerId ? `Organizer #${t.organizerId}` : 'Verified Host')}</strong>
                          </p>

                          <div style={{ background: '#161a22', padding: '12px 14px', borderRadius: '12px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#94a3b8' }}>Game:</span>
                              <strong style={{ color: '#fff' }}>{t.game || t.gameFocus || 'BGMI'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ color: '#94a3b8' }}>Region / Mode:</span>
                              <strong style={{ color: '#00bfff' }}>{t.region || 'Asia'} &bull; Squad</strong>
                            </div>
                            {t.startDate && (
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8' }}>Starts:</span>
                                <strong style={{ color: '#f59e0b' }}>{new Date(t.startDate).toLocaleDateString()}</strong>
                              </div>
                            )}
                          </div>

                          {/* Room Credentials Viewer */}
                          {roomInfo && (
                            <div style={{ background: 'rgba(0, 191, 255, 0.08)', border: '1px solid rgba(0, 191, 255, 0.3)', padding: '12px', borderRadius: '10px', marginBottom: '14px', fontSize: '12px' }}>
                              <span style={{ color: '#00bfff', fontWeight: '700', display: 'block', marginBottom: '4px' }}>ROOM CREDENTIALS</span>
                              <div style={{ color: '#cbd5e1' }}>Room ID: <strong style={{ color: '#fff' }}>{roomInfo.roomId}</strong></div>
                              <div style={{ color: '#cbd5e1' }}>Password: <strong style={{ color: '#fff' }}>{roomInfo.roomPassword}</strong></div>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                          {isRegistered ? (
                            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', textAlign: 'center' }}>
                              ✓ SQUAD REGISTERED (PENDING REVIEW)
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled={!managedTeam || isRegistering}
                              onClick={() => handleRegisterSquad(t.id)}
                              style={{
                                width: '100%',
                                padding: '11px',
                                borderRadius: '10px',
                                background: !managedTeam ? '#334155' : 'linear-gradient(135deg, #00bfff, #0055ff)',
                                border: 'none',
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: '13px',
                                cursor: !managedTeam ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {isRegistering ? 'Registering Squad...' : `Register Squad (${managedTeam?.name || 'Squad'}) →`}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => fetchRoomDetails(t.id)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              borderRadius: '10px',
                              background: 'transparent',
                              border: '1px solid rgba(255,255,255,0.12)',
                              color: '#94a3b8',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            {loadingRoomId === t.id ? 'Checking Room...' : 'View Match Room Details'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Org Verification */}
          {activeTab === 'verify' && (
            <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85)' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
                  Recruiter Trust & Email OTP Verification
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                  Verify your recruiter account to display official platform trust badges to players and managers.
                </p>
              </div>

              <div style={{ background: '#12151c', padding: '28px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', maxWidth: '520px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <span style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: '500' }}>Verification Status:</span>
                  <strong style={{ color: isVerified ? '#10b981' : '#f59e0b', fontSize: '14px' }}>
                    {recruiterProfile?.verificationStatus || 'PENDING'}
                  </strong>
                </div>

                {isVerified ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '16px', borderRadius: '12px', color: '#10b981', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>
                    Your Recruiter Account is Officially Verified!
                  </div>
                ) : (
                  <div>
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #00bfff, #0055ff)', border: 'none', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
                      >
                        Send Verification OTP to Email
                      </button>
                    ) : (
                      <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <input
                          type="text"
                          placeholder="Enter 6-Digit Email OTP"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          required
                          style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#161a22', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', textAlign: 'center', letterSpacing: '3px' }}
                        />
                        <button
                          type="submit"
                          disabled={verifyingOtp}
                          style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
                        >
                          {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default RecruiterPanel;
