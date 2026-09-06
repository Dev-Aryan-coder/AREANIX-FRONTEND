import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './UserProfile.css';

const UserProfile = ({ activePage, setActivePage, userProfile, setUserProfile }) => {
  const userId = userProfile?.userId || userProfile?.id;
  const userName = userProfile?.gamerTag || userProfile?.fullname || userProfile?.username || '';
  const email = userProfile?.email || '';
  const role = (userProfile?.role || 'PLAYER').toUpperCase();
  const isRecruiter = role === 'RECRUITER';
  const isOrganizer = role === 'ORGANIZER';

  // -------------------------------------------------------------
  // Player Profile States
  // -------------------------------------------------------------
  const [profileId, setProfileId] = useState(null);
  const [playerFormData, setPlayerFormData] = useState({
    gamerTag: userName || '',
    game: 'BGMI',
    rankName: 'Conqueror',
    roleInGame: 'Entry Fragger',
    region: 'Asia',
    age: 20,
    twitchUrl: '',
    youtubeUrl: '',
    profileImageUrl: userProfile?.avatarUrl || userProfile?.profileImageUrl || '',
    availabilityStatus: 'OPEN_TO_OFFERS'
  });
  const [xp, setXp] = useState(0);

  // -------------------------------------------------------------
  // Recruiter Profile States
  // -------------------------------------------------------------
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [recruiterFormData, setRecruiterFormData] = useState({
    organizationName: userName.includes(' ') ? userName : `${userName} Esports`,
    region: 'Asia',
    websiteUrl: 'https://areanix.gg',
    logoUrl: userProfile?.avatarUrl || '',
    gamesRecruiting: 'BGMI, Valorant, CS2',
    bio: 'Scouting tier-1 and tier-2 esports prospects for platform tournaments.'
  });
  const [managedTeam, setManagedTeam] = useState(null);
  const [shortlistCount, setShortlistCount] = useState(0);
  const [sentInvitesCount, setSentInvitesCount] = useState(0);

  // -------------------------------------------------------------
  // Organizer Profile States
  // -------------------------------------------------------------
  const [organizerProfile, setOrganizerProfile] = useState(null);
  const [organizerFormData, setOrganizerFormData] = useState({
    organizationName: userName.includes(' ') ? userName : `${userName} League`,
    phoneNumber: '',
    youtubeChannelUrl: '',
    discordUrl: '',
    twitterUrl: '',
    twitchUrl: '',
    subscriberCount: 0,
    bio: 'Organizing premier competitive gaming tournaments and community scrims.',
    logoUrl: userProfile?.avatarUrl || userProfile?.profileImageUrl || '',
    bannerUrl: ''
  });
  const [organizerDashboard, setOrganizerDashboard] = useState({
    totalTournamentsHosted: 0,
    totalPlayersReached: 0,
    totalPrizePoolAwarded: 0,
    openDisputeCount: 0,
    tournamentsByStatus: {}
  });

  // OTP Verification States
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // UI / Action Feedback States
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // -------------------------------------------------------------
  // Data Fetching
  // -------------------------------------------------------------
  useEffect(() => {
    if (!userId) return;

    if (isRecruiter) {
      // Fetch Recruiter Profile
      axios.get(`http://localhost:8080/recruiter/getby/${userId}`)
        .then((res) => {
          if (res.data) {
            setRecruiterProfile(res.data);
            setRecruiterFormData({
              organizationName: res.data.organizationName || userName,
              region: res.data.region || 'Asia',
              websiteUrl: res.data.websiteUrl || '',
              logoUrl: res.data.logoUrl || '',
              gamesRecruiting: res.data.gamesRecruiting || 'BGMI, Valorant',
              bio: res.data.bio || ''
            });

            if (res.data.logoUrl && setUserProfile) {
              setUserProfile((prev) => {
                const updated = {
                  ...prev,
                  avatarUrl: res.data.logoUrl,
                  profileImageUrl: res.data.logoUrl,
                  logoUrl: res.data.logoUrl,
                  gamerTag: res.data.organizationName || prev?.gamerTag
                };
                localStorage.setItem('areanix_user_profile', JSON.stringify(updated));
                return updated;
              });
            }

            if (res.data.id) {
              axios.get(`http://localhost:8080/recruiter/${res.data.id}/shortlist`)
                .then((sRes) => setShortlistCount(Array.isArray(sRes.data) ? sRes.data.length : 0))
                .catch(() => {});

              axios.get(`http://localhost:8080/recruiter/${res.data.id}/invites`)
                .then((iRes) => setSentInvitesCount(Array.isArray(iRes.data) ? iRes.data.length : 0))
                .catch(() => {});
            }
          }
        })
        .catch(() => {
          axios.post('http://localhost:8080/recruiter/onboard', {
            userId: userId,
            organizationName: userName.includes(' ') ? userName : `${userName} Esports`,
            region: 'Asia',
            websiteUrl: 'https://areanix.gg',
            logoUrl: '',
            gamesRecruiting: 'BGMI, Valorant, CS2',
            bio: 'Scouting tier-1 and tier-2 esports prospects.'
          })
            .then(() => {
              axios.get(`http://localhost:8080/recruiter/getby/${userId}`)
                .then((res2) => {
                  if (res2.data) setRecruiterProfile(res2.data);
                })
                .catch(() => {});
            })
            .catch(() => {});
        });

      // Fetch Managed Team
      axios.get(`http://localhost:8080/recruiter/${userId}/managed-team`)
        .then((res) => setManagedTeam(res.data))
        .catch(() => setManagedTeam(null));

    } else if (isOrganizer) {
      // Fetch Organizer Profile & Dashboard Summary
      axios.get(`http://localhost:8080/organizer/getby/${userId}`)
        .then((res) => {
          if (res.data) {
            setOrganizerProfile(res.data);
            setOrganizerFormData({
              organizationName: res.data.organizationName || userName,
              phoneNumber: res.data.phoneNumber || '',
              youtubeChannelUrl: res.data.youtubeChannelUrl || '',
              discordUrl: res.data.discordUrl || '',
              twitterUrl: res.data.twitterUrl || '',
              twitchUrl: res.data.twitchUrl || '',
              subscriberCount: res.data.subscriberCount || 0,
              bio: res.data.bio || 'Organizing premier competitive gaming tournaments and community scrims.',
              logoUrl: res.data.logoUrl || '',
              bannerUrl: res.data.bannerUrl || ''
            });

            if (res.data.logoUrl && setUserProfile) {
              setUserProfile((prev) => {
                const updated = {
                  ...prev,
                  avatarUrl: res.data.logoUrl,
                  profileImageUrl: res.data.logoUrl,
                  logoUrl: res.data.logoUrl,
                  gamerTag: res.data.organizationName || prev?.gamerTag
                };
                localStorage.setItem('areanix_user_profile', JSON.stringify(updated));
                return updated;
              });
            }

            if (res.data.id) {
              axios.get(`http://localhost:8080/organizer/${res.data.id}/dashboard`)
                .then((dRes) => {
                  if (dRes.data) setOrganizerDashboard(dRes.data);
                })
                .catch(() => {});
            }
          }
        })
        .catch(() => {
          // Auto-onboard organizer if record doesn't exist
          const defaultPhone = `987${String(userId).padStart(7, '0')}`;
          axios.post('http://localhost:8080/organizer/onboard', {
            userId: userId,
            phoneNumber: defaultPhone,
            youtubeChannelUrl: 'https://youtube.com/@areanix',
            organizationName: userName.includes(' ') ? userName : `${userName} League`
          }).then(() => {
            axios.get(`http://localhost:8080/organizer/getby/${userId}`)
              .then((res2) => {
                if (res2.data) setOrganizerProfile(res2.data);
              }).catch(() => {});
          }).catch(() => {});
        });

    } else {
      // Fetch Player Profile & XP
      axios.get(`http://localhost:8080/player/getby/${userId}`)
        .then((res) => {
          if (res.data) {
            if (res.data.id) setProfileId(res.data.id);
            const fetchedImg = res.data.profileImageUrl || res.data.profileImage || res.data.avatarUrl || '';
            setPlayerFormData({
              gamerTag: res.data.gamerTag || userName,
              game: res.data.game || 'BGMI',
              rankName: res.data.rankName || 'Conqueror',
              roleInGame: res.data.roleInGame || 'Entry Fragger',
              region: res.data.region || 'Asia',
              age: res.data.age || 20,
              twitchUrl: res.data.twitchUrl || '',
              youtubeUrl: res.data.youtubeUrl || '',
              profileImageUrl: fetchedImg,
              availabilityStatus: res.data.availabilityStatus || 'OPEN_TO_OFFERS'
            });
            if (fetchedImg && setUserProfile) {
              setUserProfile((prev) => {
                const updated = {
                  ...prev,
                  avatarUrl: fetchedImg,
                  profileImageUrl: fetchedImg,
                  gamerTag: res.data.gamerTag || prev?.gamerTag
                };
                localStorage.setItem('areanix_user_profile', JSON.stringify(updated));
                return updated;
              });
            }
            if (typeof res.data.xp === 'number') {
              setXp(res.data.xp);
            }
          }
        })
        .catch(() => {});

      axios.get(`http://localhost:8080/leaderboard/xp/rank/${userId}`)
        .then((res) => {
          if (res.data && typeof res.data.xp === 'number') {
            setXp(res.data.xp);
          }
        })
        .catch(() => {});
    }
  }, [userId, userName, isRecruiter, isOrganizer]);

  // -------------------------------------------------------------
  // Handlers: Player Form
  // -------------------------------------------------------------
  const handlePlayerChange = (e) => {
    const { name, value } = e.target;
    setPlayerFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? (parseInt(value, 10) || 0) : value
    }));
  };

  const handleToggleStatus = async () => {
    const nextStatus = playerFormData.availabilityStatus === 'OPEN_TO_OFFERS' ? 'NOT_AVAILABLE' : 'OPEN_TO_OFFERS';
    setPlayerFormData((prev) => ({ ...prev, availabilityStatus: nextStatus }));

    try {
      await axios.patch(`http://localhost:8080/player/${userId}/availability`, null, {
        params: { status: nextStatus }
      });
    } catch (err) {
      try {
        await axios.post('http://localhost:8080/player/onboard', {
          ...playerFormData,
          id: profileId,
          userId: userId,
          user: { id: userId },
          availabilityStatus: nextStatus
        });
      } catch (e) {}
    }
  };

  const handleSavePlayerProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const payload = {
      ...playerFormData,
      id: profileId,
      userId: userId,
      user: { id: userId },
      age: parseInt(playerFormData.age, 10) || 20
    };

    try {
      if (profileId) {
        await axios.put(`http://localhost:8080/player/${profileId}`, payload);
      } else {
        const res = await axios.post('http://localhost:8080/player/onboard', payload);
        if (res.data?.id) setProfileId(res.data.id);
      }

      const updatedProfile = {
        ...userProfile,
        gamerTag: playerFormData.gamerTag,
        fullname: playerFormData.gamerTag,
        avatarUrl: playerFormData.profileImageUrl,
        profileImageUrl: playerFormData.profileImageUrl
      };
      if (setUserProfile) setUserProfile(updatedProfile);
      localStorage.setItem('areanix_user_profile', JSON.stringify(updatedProfile));

      setSuccessMsg('Player Profile updated successfully live in MySQL database!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to update player profile.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Handlers: Recruiter Form
  // -------------------------------------------------------------
  const handleRecruiterChange = (e) => {
    const { name, value } = e.target;
    setRecruiterFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveRecruiterProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      if (recruiterProfile?.id) {
        const res = await axios.put(`http://localhost:8080/recruiter/${recruiterProfile.id}`, {
          ...recruiterFormData,
          id: recruiterProfile.id,
          userId: userId
        });
        if (res.data) setRecruiterProfile(res.data);
      } else {
        await axios.post('http://localhost:8080/recruiter/onboard', {
          ...recruiterFormData,
          userId: userId
        });
        const res2 = await axios.get(`http://localhost:8080/recruiter/getby/${userId}`);
        if (res2.data) setRecruiterProfile(res2.data);
      }
      setSuccessMsg('Recruiter profile updated successfully in MySQL database!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to update recruiter profile.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Handlers: Organizer Form
  // -------------------------------------------------------------
  const handleOrganizerChange = (e) => {
    const { name, value } = e.target;
    setOrganizerFormData((prev) => ({
      ...prev,
      [name]: name === 'subscriberCount' ? value.replace(/\D/g, '') : value
    }));
  };

  const handleSaveOrganizerProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const targetId = organizerProfile?.id || userId;
    try {
      const res = await axios.patch(`http://localhost:8080/organizer/${targetId}/profile`, {
        ...organizerFormData,
        subscriberCount: Number(organizerFormData.subscriberCount || 0)
      });
      if (res.data) setOrganizerProfile(res.data);

      const updated = {
        ...userProfile,
        gamerTag: organizerFormData.organizationName || userProfile?.gamerTag,
        fullname: organizerFormData.organizationName || userProfile?.fullname,
        avatarUrl: organizerFormData.logoUrl || userProfile?.avatarUrl,
        profileImageUrl: organizerFormData.logoUrl || userProfile?.profileImageUrl,
        logoUrl: organizerFormData.logoUrl || userProfile?.logoUrl
      };
      if (setUserProfile) setUserProfile(updated);
      localStorage.setItem('areanix_user_profile', JSON.stringify(updated));

      setSuccessMsg('Organizer profile updated successfully live in MySQL database!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to update organizer profile.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // OTP Verification Handlers (Recruiter & Organizer)
  // -------------------------------------------------------------
  const handleSendOtp = () => {
    const targetEndpoint = isOrganizer
      ? `http://localhost:8080/organizer/${organizerProfile?.id || userId}/send-otp`
      : `http://localhost:8080/recruiter/${recruiterProfile?.id || userId}/send-otp`;

    axios.post(targetEndpoint)
      .then(() => {
        setOtpSent(true);
        setSuccessMsg('Verification OTP sent to your registered email!');
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch(() => {
        setErrorMsg('Failed to send OTP. Please check your account email.');
        setTimeout(() => setErrorMsg(''), 4000);
      });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otpInput) return;
    setVerifyingOtp(true);

    const targetEndpoint = isOrganizer
      ? `http://localhost:8080/organizer/${organizerProfile?.id || userId}/verify-otp?otp=${otpInput}`
      : `http://localhost:8080/recruiter/${recruiterProfile?.id || userId}/verify-otp?otp=${otpInput}`;

    axios.post(targetEndpoint)
      .then((res) => {
        if (isOrganizer) setOrganizerProfile(res.data);
        else setRecruiterProfile(res.data);
        setSuccessMsg('Congratulations! Profile officially VERIFIED in MySQL database.');
        setOtpInput('');
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch(() => {
        setErrorMsg('Invalid or expired OTP. Please try again.');
        setTimeout(() => setErrorMsg(''), 4000);
      })
      .finally(() => setVerifyingOtp(false));
  };

  // Image Upload / Manage Handler
  const handleSaveImage = (url) => {
    const finalUrl = url || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`;

    if (isOrganizer) {
      const targetId = organizerProfile?.id || userId;
      setOrganizerFormData((prev) => ({ ...prev, logoUrl: url }));
      axios.patch(`http://localhost:8080/organizer/${targetId}/profile`, { logoUrl: url })
        .then((res) => { if (res.data) setOrganizerProfile(res.data); })
        .catch(() => {});

      if (setUserProfile) {
        setUserProfile((prev) => {
          const updated = { ...prev, avatarUrl: finalUrl, profileImageUrl: finalUrl, logoUrl: finalUrl };
          localStorage.setItem('areanix_user_profile', JSON.stringify(updated));
          return updated;
        });
      }
    } else if (isRecruiter) {
      const targetId = recruiterProfile?.id || userId;
      setRecruiterFormData((prev) => ({ ...prev, logoUrl: url }));
      axios.patch(`http://localhost:8080/recruiter/${targetId}/image`, null, { params: { imageUrl: url } })
        .then((res) => { if (res.data) setRecruiterProfile(res.data); })
        .catch(() => {
          axios.put(`http://localhost:8080/recruiter/${targetId}`, { ...recruiterFormData, logoUrl: url }).catch(() => {});
        });

      if (setUserProfile) {
        setUserProfile((prev) => {
          const updated = { ...prev, avatarUrl: finalUrl, profileImageUrl: finalUrl, logoUrl: finalUrl };
          localStorage.setItem('areanix_user_profile', JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      const targetId = profileId || userId;
      setPlayerFormData((prev) => ({ ...prev, profileImageUrl: url }));
      axios.patch(`http://localhost:8080/player/${targetId}/image`, null, { params: { imageUrl: url } })
        .catch(() => {
          axios.put(`http://localhost:8080/player/${targetId}`, { ...playerFormData, profileImageUrl: url }).catch(() => {});
        });

      if (setUserProfile) {
        setUserProfile((prev) => {
          const updated = { ...prev, avatarUrl: finalUrl, profileImageUrl: finalUrl, logoUrl: finalUrl };
          localStorage.setItem('areanix_user_profile', JSON.stringify(updated));
          return updated;
        });
      }
    }
    setShowImageModal(false);
    setImageUrlInput('');
    setSuccessMsg('Profile image updated and saved to MySQL database!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const isOnline = isRecruiter || isOrganizer ? true : (playerFormData.availabilityStatus === 'OPEN_TO_OFFERS' || playerFormData.availabilityStatus === 'LOOKING_FOR_TEAM');
  const isVerified = isOrganizer
    ? organizerProfile?.verificationStatus === 'VERIFIED'
    : recruiterProfile?.verificationStatus === 'VERIFIED';
  const isChannelVerified = organizerProfile?.channelVerified;
  const currentRank = xp === 0 ? 'Unranked' : `#1`;

  const displayAvatar = isOrganizer
    ? (organizerFormData.logoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`)
    : isRecruiter
    ? (recruiterFormData.logoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`)
    : (playerFormData.profileImageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`);

  const displayName = isOrganizer
    ? (organizerFormData.organizationName || userName)
    : isRecruiter
    ? (recruiterFormData.organizationName || userName)
    : (playerFormData.gamerTag || userName);

  return (
    <div className="user-profile-page-container" style={{ background: '#141414', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} userProfile={userProfile} setUserProfile={setUserProfile} />

      <div className="profile-content-wrapper" style={{ padding: '110px 24px 80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Top Header Banner Between 2 Cyan Gradient Lines */}
        <div style={{ margin: '20px 0 40px 0' }}>
          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: 0 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 16px', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={displayAvatar}
                  alt="Profile Avatar"
                  style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid #00bfff', boxShadow: '0 0 25px rgba(0, 191, 255, 0.4)', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => setShowImageModal(true)}
                  style={{ position: 'absolute', bottom: '0', right: '0', background: '#00bfff', border: 'none', borderRadius: '50%', width: '28px', height: '28px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
              </div>

              <div>
                <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '52px', color: '#ffffff', margin: 0, fontWeight: '300', letterSpacing: '0.5px', lineHeight: '1.2' }}>
                  {displayName}
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
                  {email} &bull; Role: <strong style={{ color: '#00bfff' }}>{role}</strong>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {isOrganizer ? (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    border: isVerified ? '1px solid #10b981' : '1px solid #f59e0b',
                    background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: isVerified ? '#10b981' : '#f59e0b',
                    fontWeight: '600',
                    fontSize: '14px',
                    boxShadow: isVerified ? '0 0 18px rgba(16, 185, 129, 0.35)' : '0 0 18px rgba(245, 158, 11, 0.35)'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 8px currentColor' }}></span>
                    {isVerified ? 'VERIFIED HOST' : 'PENDING APPROVAL'}
                  </div>

                  {isChannelVerified && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 20px',
                      borderRadius: '30px',
                      border: '1px solid #38bdf8',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 0 18px rgba(56, 189, 248, 0.35)'
                    }}>
                      📺 CHANNEL VERIFIED
                    </div>
                  )}
                </div>
              ) : role === 'ADMIN' ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  border: '1px solid #ef4444',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  fontWeight: '700',
                  fontSize: '14px',
                  boxShadow: '0 0 18px rgba(239, 68, 68, 0.35)'
                }}>
                  SUPER ADMIN ACCESS
                </div>
              ) : isRecruiter ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '30px',
                  border: isVerified ? '1px solid #10b981' : '1px solid #f59e0b',
                  background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isVerified ? '#10b981' : '#f59e0b',
                  fontWeight: '600',
                  fontSize: '15px',
                  boxShadow: isVerified ? '0 0 18px rgba(16, 185, 129, 0.35)' : '0 0 18px rgba(245, 158, 11, 0.35)'
                }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 8px currentColor' }}></span>
                  {isVerified ? 'VERIFIED SCOUT' : 'PENDING VERIFICATION'}
                </div>
              ) : (
                <>
                  <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', color: '#94a3b8', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>Lobby Status:</span>
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 28px',
                      borderRadius: '30px',
                      border: isOnline ? '1px solid #10b981' : '1px solid #ef4444',
                      background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: isOnline ? '#10b981' : '#ef4444',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: '600',
                      fontSize: '15px',
                      cursor: 'pointer',
                      boxShadow: isOnline ? '0 0 18px rgba(16, 185, 129, 0.35)' : '0 0 18px rgba(239, 68, 68, 0.35)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 8px currentColor' }}></span>
                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                  </button>
                </>
              )}
            </div>
          </div>

          <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: 0 }} />
        </div>

        {/* Modal for Managing Profile/Logo Image */}
        {showImageModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.4)', borderRadius: '24px', padding: '36px', maxWidth: '500px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '600' }}>Manage Profile Picture</h3>
                <button type="button" onClick={() => setShowImageModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <img src={displayAvatar} alt="Current Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '3px solid #00bfff', objectFit: 'cover' }} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                  Paste New Image URL (logoUrl / profileImageUrl)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/my-avatar.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => handleSaveImage('')}
                  style={{ padding: '12px 20px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Delete Image
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveImage(imageUrlInput)}
                  style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #00bfff, #0055ff)', border: 'none', color: '#fff', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save New Image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alerts */}
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '16px 24px', borderRadius: '12px', marginBottom: '30px', fontWeight: '600', fontSize: '15px', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '16px 24px', borderRadius: '12px', marginBottom: '30px', fontWeight: '600', fontSize: '15px', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        {/* ========================================================= */}
        {/* ADMIN VIEW                                                */}
        {/* ========================================================= */}
        {role === 'ADMIN' ? (
          <div style={{ margin: '30px 0 60px 0' }}>
            <div style={{ background: '#1c1c1c', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '24px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '800', padding: '4px 12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Root Administrator
                  </span>
                  <h2 style={{ fontSize: '28px', color: '#ffffff', margin: '12px 0 6px 0', fontWeight: '700' }}>
                    System Administration & Moderation
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                    You have global administrative access to manage users, approve host applications, moderate tournaments, and resolve platform disputes.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePage && setActivePage('dashboard')}
                  style={{
                    padding: '14px 32px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  Open Admin Command Center
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '30px' }}>
                <div style={{ background: '#141414', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#00bfff', marginBottom: '8px', letterSpacing: '1px' }}>[USERS]</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>User Control</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Suspend or reactivate accounts across platform.</div>
                </div>

                <div style={{ background: '#141414', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#f59e0b', marginBottom: '8px', letterSpacing: '1px' }}>[HOSTS]</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>Host Approvals</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Verify organizers and YouTube channels.</div>
                </div>

                <div style={{ background: '#141414', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#ef4444', marginBottom: '8px', letterSpacing: '1px' }}>[MODERATION]</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>Moderation</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Review reports and cancel rogue tournaments.</div>
                </div>
              </div>
            </div>
          </div>
        ) : isOrganizer ? (
          <div>
            {/* Organizer Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', margin: '30px 0 50px 0' }}>
              <div style={{ background: '#1c1c1c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>TOURNAMENTS HOSTED</span>
                <h2 style={{ fontSize: '42px', color: '#00bfff', margin: 0, fontWeight: '700' }}>
                  {organizerDashboard.totalTournamentsHosted || 0} <span style={{ fontSize: '18px', color: '#94a3b8' }}>Events</span>
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '10px 0 0 0' }}>
                  Upcoming: {organizerDashboard.tournamentsByStatus?.UPCOMING || 0} &bull; Ongoing: {organizerDashboard.tournamentsByStatus?.ONGOING || 0} &bull; Completed: {organizerDashboard.tournamentsByStatus?.COMPLETED || 0}
                </p>
              </div>

              <div style={{ background: '#1c1c1c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>PRIZE POOL AWARDED</span>
                <h2 style={{ fontSize: '42px', color: '#10b981', margin: 0, fontWeight: '700' }}>
                  ₹{(organizerDashboard.totalPrizePoolAwarded || 0).toLocaleString()}
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '10px 0 0 0' }}>Total distributed to tournament champions</p>
              </div>

              <div style={{ background: '#1c1c1c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>PLAYERS REACHED</span>
                <h2 style={{ fontSize: '42px', color: '#f59e0b', margin: 0, fontWeight: '700' }}>
                  {organizerDashboard.totalPlayersReached || 0} <span style={{ fontSize: '18px', color: '#94a3b8' }}>Players</span>
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '10px 0 0 0' }}>Approved tournament participants</p>
              </div>
            </div>

            {/* Email OTP Verification Section */}
            <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', color: '#ffffff', margin: '0 0 8px 0', fontWeight: '600' }}>
                Official Organizer Email Verification
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0' }}>
                Verifying your official organizer email grants the Verified Host badge to build community trust.
              </p>

              {isVerified ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '14px 24px', borderRadius: '12px', fontWeight: '600', display: 'inline-block' }}>
                  Official Email Verified ({email})
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #00bfff, #0055ff)', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Send Verification OTP to Email
                    </button>
                  ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Enter 6-Digit OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        required
                        style={{ padding: '12px 18px', borderRadius: '12px', background: '#141414', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '15px', letterSpacing: '2px' }}
                      />
                      <button
                        type="submit"
                        disabled={verifyingOtp}
                        style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                      >
                        {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Organizer Edit Form */}
            <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', color: '#ffffff', margin: 0, fontWeight: '600' }}>
                    Edit Organizer & Organization Profile
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '6px 0 0 0' }}>
                    Update tournament organization brand, social streaming channels, subscriber reach, and bio.
                  </p>
                </div>
                <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  MYSQL ORGANIZER FORM
                </span>
              </div>

              <form onSubmit={handleSaveOrganizerProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Organization / Brand Name (organizationName) *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      maxLength={50}
                      value={organizerFormData.organizationName}
                      onChange={handleOrganizerChange}
                      required
                      placeholder="e.g. Areanix Esports League"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Phone Number (phoneNumber) *
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={organizerFormData.phoneNumber}
                      onChange={handleOrganizerChange}
                      required
                      placeholder="e.g. +91 9876543210"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      YouTube Channel URL (youtubeChannelUrl) *
                    </label>
                    <input
                      type="url"
                      name="youtubeChannelUrl"
                      value={organizerFormData.youtubeChannelUrl}
                      onChange={handleOrganizerChange}
                      required
                      placeholder="https://youtube.com/@yourchannel"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Subscriber / Follower Count (subscriberCount)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      name="subscriberCount"
                      value={organizerFormData.subscriberCount ?? ''}
                      onChange={handleOrganizerChange}
                      placeholder="e.g. 250000"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Discord Server Invite (discordUrl)
                    </label>
                    <input
                      type="url"
                      name="discordUrl"
                      value={organizerFormData.discordUrl}
                      onChange={handleOrganizerChange}
                      placeholder="https://discord.gg/yourserver"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Twitch Channel URL (twitchUrl)
                    </label>
                    <input
                      type="url"
                      name="twitchUrl"
                      value={organizerFormData.twitchUrl}
                      onChange={handleOrganizerChange}
                      placeholder="https://twitch.tv/yourchannel"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Twitter / X Profile URL (twitterUrl)
                    </label>
                    <input
                      type="url"
                      name="twitterUrl"
                      value={organizerFormData.twitterUrl}
                      onChange={handleOrganizerChange}
                      placeholder="https://twitter.com/yourhandle"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Banner Image URL (bannerUrl)
                    </label>
                    <input
                      type="url"
                      name="bannerUrl"
                      value={organizerFormData.bannerUrl}
                      onChange={handleOrganizerChange}
                      placeholder="https://example.com/banner.jpg"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Organizer Bio & Hosting Details (bio) (Max 500 characters)
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    maxLength={500}
                    value={organizerFormData.bio}
                    onChange={handleOrganizerChange}
                    placeholder="Describe the tournaments you run, target esports titles, and prize distribution policies..."
                    style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif", resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginTop: '36px', textAlign: 'right' }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: '14px 38px',
                      background: 'linear-gradient(135deg, #00bfff, #0055ff)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 0 25px rgba(0, 191, 255, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {saving ? 'Saving to Database...' : 'Save Organizer Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : isRecruiter ? (
          /* ========================================================= */
          /* RECRUITER VIEW                                            */
          /* ========================================================= */
          <div>
            {/* Recruiter Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', margin: '30px 0 50px 0' }}>
              <div style={{ background: '#1c1c1c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>MANAGED SQUAD</span>
                <h3 style={{ fontSize: '28px', color: '#ffffff', margin: 0, fontWeight: '600' }}>
                  {managedTeam?.name || 'Free Recruiter'}
                </h3>
                <p style={{ fontSize: '13px', color: '#00bfff', margin: '10px 0 0 0' }}>{managedTeam ? `Game: ${managedTeam.game || 'BGMI'} | ${managedTeam.region || 'Asia'}` : 'Register team to link squad'}</p>
              </div>

              <div style={{ background: '#1c1c1c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>SENT INVITATIONS</span>
                <h2 style={{ fontSize: '42px', color: '#f59e0b', margin: 0, fontWeight: '700' }}>
                  {sentInvitesCount} <span style={{ fontSize: '18px', color: '#94a3b8' }}>Offers</span>
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '10px 0 0 0' }}>Track responses on Recruiter Panel</p>
              </div>

              <div style={{ background: '#1c1c1c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>SHORTLISTED TALENT</span>
                <h2 style={{ fontSize: '42px', color: '#10b981', margin: 0, fontWeight: '700' }}>
                  {shortlistCount} <span style={{ fontSize: '18px', color: '#94a3b8' }}>Prospects</span>
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '10px 0 0 0' }}>Prospects queued for team roster trials</p>
              </div>
            </div>

            {/* Email OTP Verification Section */}
            <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '24px', padding: '32px', marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', color: '#ffffff', margin: '0 0 8px 0', fontWeight: '600' }}>
                Official Recruiter Email Verification
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0' }}>
                Verifying your official email provides trust credentials to players on global scouting feeds.
              </p>

              {isVerified ? (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '14px 24px', borderRadius: '12px', fontWeight: '600', display: 'inline-block' }}>
                  Official Email Verified ({email})
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #00bfff, #0055ff)', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                    >
                      Send Verification OTP to Email
                    </button>
                  ) : (
                    <form onSubmit={handleVerifyOtp} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Enter 6-Digit OTP"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        required
                        style={{ padding: '12px 18px', borderRadius: '12px', background: '#141414', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '15px', letterSpacing: '2px' }}
                      />
                      <button
                        type="submit"
                        disabled={verifyingOtp}
                        style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer' }}
                      >
                        {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Recruiter Edit Form */}
            <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', color: '#ffffff', margin: 0, fontWeight: '600' }}>
                    Edit Recruiter & Organization Profile
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '6px 0 0 0' }}>
                    Update organization branding, target recruiting games, website, and recruiter bio.
                  </p>
                </div>
                <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  MYSQL RECRUITER FORM
                </span>
              </div>

              <form onSubmit={handleSaveRecruiterProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Organization Name (organization_name) *
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={recruiterFormData.organizationName}
                      onChange={handleRecruiterChange}
                      required
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Operating Region (region) *
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={recruiterFormData.region}
                      onChange={handleRecruiterChange}
                      required
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Official Website URL (website_url)
                    </label>
                    <input
                      type="url"
                      name="websiteUrl"
                      value={recruiterFormData.websiteUrl}
                      onChange={handleRecruiterChange}
                      placeholder="https://team.gg"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Scouting Games (games_recruiting)
                    </label>
                    <input
                      type="text"
                      name="gamesRecruiting"
                      value={recruiterFormData.gamesRecruiting}
                      onChange={handleRecruiterChange}
                      placeholder="BGMI, Valorant, CS2"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Organization Bio / Mission Statement (bio) (Max 500 characters)
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    maxLength={500}
                    value={recruiterFormData.bio}
                    onChange={handleRecruiterChange}
                    placeholder="Describe your esports organization, coaching infrastructure, and player requirements..."
                    style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif", resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginTop: '36px', textAlign: 'right' }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: '14px 38px',
                      background: 'linear-gradient(135deg, #00bfff, #0055ff)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 0 25px rgba(0, 191, 255, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {saving ? 'Saving to Database...' : 'Save Recruiter Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* ORIGINAL 100% PLAYER PROFILE VIEW & FORM                  */
          /* ========================================================= */
          <div>
            {/* Stats Grid Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', margin: '30px 0 50px 0' }}>
              <div style={{ background: '#1c1c1c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>PLAYER XP STATS</span>
                </div>
                <h2 style={{ fontSize: '42px', color: '#00bfff', margin: 0, fontWeight: '700' }}>{xp} <span style={{ fontSize: '18px', color: '#94a3b8' }}>XP</span></h2>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', margin: '20px 0 10px 0', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(xp / 10, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #00bfff, #0055ff)', borderRadius: '4px' }}></div>
                </div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Next Rank Milestone at 1,000 XP</span>
              </div>

              <div style={{ background: '#1c1c1c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>GLOBAL LEADERBOARD RANK</span>
                </div>
                <h2 style={{ fontSize: '42px', color: '#10b981', margin: 0, fontWeight: '700' }}>{currentRank}</h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '14px 0 0 0' }}>Compete in Ladders & Tournaments to increase rank</p>
              </div>

              <div style={{ background: '#1c1c1c', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px', padding: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>PRIMARY GAME & ROLE</span>
                </div>
                <h3 style={{ fontSize: '24px', color: '#ffffff', margin: 0, fontWeight: '600' }}>{playerFormData.game || 'BGMI'}</h3>
                <p style={{ fontSize: '14px', color: '#00bfff', margin: '6px 0 0 0', fontWeight: '500' }}>Role: {playerFormData.roleInGame || 'Entry Fragger'} &bull; {playerFormData.region || 'Asia'}</p>
              </div>
            </div>

            {/* Real Player Profile Edit Form */}
            <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '24px', padding: '40px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div>
                  <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', color: '#ffffff', margin: 0, fontWeight: '600' }}>
                    Edit Player Profile Form
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', margin: '6px 0 0 0' }}>
                    Update your gamer tag, rank, game role, profile picture URL, and streaming links in your MySQL database profile.
                  </p>
                </div>
                <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  MYSQL LIVE FORM
                </span>
              </div>

              <form onSubmit={handleSavePlayerProfile}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Gamer Tag (gamer_tag) *
                    </label>
                    <input
                      type="text"
                      name="gamerTag"
                      value={playerFormData.gamerTag || ''}
                      onChange={handlePlayerChange}
                      required
                      placeholder="e.g. Pillu_Player"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Profile Image URL (profile_image_url)
                    </label>
                    <input
                      type="text"
                      name="profileImageUrl"
                      value={playerFormData.profileImageUrl || ''}
                      onChange={handlePlayerChange}
                      placeholder="https://example.com/avatar.jpg"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Main Game (game) *
                    </label>
                    <select
                      name="game"
                      value={playerFormData.game || 'BGMI'}
                      onChange={handlePlayerChange}
                      required
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    >
                      <option value="BGMI">BGMI (Battlegrounds Mobile India)</option>
                      <option value="Valorant">Valorant</option>
                      <option value="Free Fire">Free Fire</option>
                      <option value="CS2">Counter-Strike 2</option>
                      <option value="Call of Duty">Call of Duty</option>
                      <option value="Pokemon UNITE">Pokemon UNITE</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Rank Name (rank_name) *
                    </label>
                    <input
                      type="text"
                      name="rankName"
                      value={playerFormData.rankName || ''}
                      onChange={handlePlayerChange}
                      required
                      placeholder="e.g. Conqueror / Radiant"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Role in Game (role_in_game) *
                    </label>
                    <select
                      name="roleInGame"
                      value={playerFormData.roleInGame || 'Entry Fragger'}
                      onChange={handlePlayerChange}
                      required
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    >
                      <option value="Entry Fragger">Entry Fragger</option>
                      <option value="IGL">IGL (In-Game Leader)</option>
                      <option value="Sniper">Sniper</option>
                      <option value="Support">Support</option>
                      <option value="Assaulter">Assaulter</option>
                      <option value="Duelist">Duelist</option>
                      <option value="Controller">Controller</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Region (region) *
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={playerFormData.region || ''}
                      onChange={handlePlayerChange}
                      required
                      placeholder="e.g. Asia / India"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Age (age) *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={playerFormData.age}
                      onChange={handlePlayerChange}
                      required
                      min="13"
                      max="99"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      Twitch URL (twitch_url)
                    </label>
                    <input
                      type="text"
                      name="twitchUrl"
                      value={playerFormData.twitchUrl || ''}
                      onChange={handlePlayerChange}
                      placeholder="https://twitch.tv/yourchannel"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                      YouTube URL (youtube_url)
                    </label>
                    <input
                      type="text"
                      name="youtubeUrl"
                      value={playerFormData.youtubeUrl || ''}
                      onChange={handlePlayerChange}
                      placeholder="https://youtube.com/@yourchannel"
                      style={{ width: '100%', padding: '14px 18px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#fff', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '36px', textAlign: 'right' }}>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: '14px 38px',
                      background: 'linear-gradient(135deg, #00bfff, #0055ff)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      boxShadow: '0 0 25px rgba(0, 191, 255, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {saving ? 'Saving to Database...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>

      <Footer setActivePage={setActivePage} />
    </div>
  );
};

export default UserProfile;
