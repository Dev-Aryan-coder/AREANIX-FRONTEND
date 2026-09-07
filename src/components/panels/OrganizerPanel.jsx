import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrganizerPanel.css';

// Modular Organizer Sub-Components
import OrganizerOverviewTab from './organizer/OrganizerOverviewTab';
import OrganizerTournamentsTab from './organizer/OrganizerTournamentsTab';
import OrganizerRegistrationsTab from './organizer/OrganizerRegistrationsTab';
import OrganizerDisputesTab from './organizer/OrganizerDisputesTab';
import OrganizerVerificationTab from './organizer/OrganizerVerificationTab';
import CreateTournamentModal from './organizer/CreateTournamentModal';
import ReleaseRoomModal from './organizer/ReleaseRoomModal';

const OrganizerPanel = ({ userProfile }) => {
  const userId = userProfile?.userId || userProfile?.id || 1;
  const userName = userProfile?.fullname || userProfile?.gamerTag || 'Organizer Host';

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, tournaments, registrations, disputes, verification

  // Live Organizer & Dashboard Data
  const [organizer, setOrganizer] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [playersMap, setPlayersMap] = useState({});

  // UI / Status States
  const [isLiveHosting, setIsLiveHosting] = useState(true);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Create Tournament Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tournamentForm, setTournamentForm] = useState({
    name: '',
    game: 'BGMI',
    format: 'Battle Royale Squad',
    region: 'Asia',
    prizePool: 10000,
    streamLink: '',
    rules: '1. Standard competitive rules apply.\n2. No third-party emulator cheats allowed.\n3. Join room 15 mins before scheduled match.'
  });

  // Release Room Modal State
  const [selectedTournamentForRoom, setSelectedTournamentForRoom] = useState(null);
  const [roomData, setRoomData] = useState({ roomId: '', roomPassword: '' });

  // Verification OTP States
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // -----------------------------------------------------------------
  // Initial Data Fetching
  // -----------------------------------------------------------------
  const fetchAllOrganizerData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Players map for rich name & avatar resolution
      try {
        const pRes = await axios.get('http://localhost:8080/player/all');
        if (Array.isArray(pRes.data)) {
          const map = {};
          pRes.data.forEach((p) => { map[p.id] = p; });
          setPlayersMap(map);
        }
      } catch (err) {}

      // 2. Fetch Organizer Profile by userId
      let orgData = null;
      try {
        const orgRes = await axios.get(`http://localhost:8080/organizer/getby/${userId}`);
        orgData = orgRes.data;
      } catch (e) {
        // Auto-onboard if not existing
        try {
          const defaultPhone = `987${String(userId).padStart(7, '0')}`;
          await axios.post('http://localhost:8080/organizer/onboard', {
            userId: userId,
            phoneNumber: defaultPhone,
            youtubeChannelUrl: 'https://youtube.com/@areanix',
            organizationName: userName.includes(' ') ? userName : `${userName} League`
          });
          const res2 = await axios.get(`http://localhost:8080/organizer/getby/${userId}`);
          orgData = res2.data;
        } catch (e2) {}
      }

      if (orgData) {
        setOrganizer(orgData);
        const orgId = orgData.id;

        // 3. Fetch Dashboard Summary
        try {
          const dashRes = await axios.get(`http://localhost:8080/organizer/${orgId}/dashboard`);
          setDashboardData(dashRes.data);
        } catch (err) {}

        // 4. Fetch Pending Registrations
        try {
          const regRes = await axios.get(`http://localhost:8080/organizer/${orgId}/pending-registrations`);
          setPendingRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
        } catch (err) {}

        // 5. Fetch Disputes
        try {
          const dispRes = await axios.get(`http://localhost:8080/organizer/${orgId}/disputes`);
          setDisputes(Array.isArray(dispRes.data) ? dispRes.data : []);
        } catch (err) {}
      }
    } catch (err) {
      console.error('Failed to load organizer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllOrganizerData();
    }
  }, [userId]);

  // -----------------------------------------------------------------
  // Handlers: Create Tournament
  // -----------------------------------------------------------------
  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!organizer?.id) return;

    try {
      await axios.post('http://localhost:8080/tournament/create', {
        ...tournamentForm,
        organizerId: organizer.id,
        prizePool: parseFloat(tournamentForm.prizePool) || 0
      });

      setSuccessMsg('Tournament created successfully and listed on global arena!');
      setShowCreateModal(false);
      setTournamentForm({
        name: '',
        game: 'BGMI',
        format: 'Battle Royale Squad',
        region: 'Asia',
        prizePool: 10000,
        streamLink: '',
        rules: ''
      });
      fetchAllOrganizerData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to create tournament. Please verify all required fields.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // -----------------------------------------------------------------
  // Handlers: Release Room Details
  // -----------------------------------------------------------------
  const handleReleaseRoom = async (e) => {
    e.preventDefault();
    if (!selectedTournamentForRoom) return;

    try {
      await axios.patch(`http://localhost:8080/tournament/${selectedTournamentForRoom.id}/release-room`, null, {
        params: {
          roomId: roomData.roomId,
          roomPassword: roomData.roomPassword
        }
      });
      setSuccessMsg(`Room credentials released for ${selectedTournamentForRoom.name}!`);
      setSelectedTournamentForRoom(null);
      setRoomData({ roomId: '', roomPassword: '' });
      fetchAllOrganizerData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to release room details.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // -----------------------------------------------------------------
  // Handlers: Mark Prize Paid
  // -----------------------------------------------------------------
  const handleMarkPrizePaid = async (tournamentId) => {
    try {
      await axios.patch(`http://localhost:8080/tournament/${tournamentId}/mark-prize-paid`);
      setSuccessMsg('Tournament prize pool marked as PAID OUT to champions!');
      fetchAllOrganizerData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to mark prize pool as paid.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // -----------------------------------------------------------------
  // Handlers: Start Tournament (Go Live -> ONGOING)
  // -----------------------------------------------------------------
  const handleStartTournament = async (tournamentId) => {
    try {
      await axios.patch(`http://localhost:8080/tournament/${tournamentId}/start`);
      setSuccessMsg('Tournament started! Match is now LIVE (ONGOING).');
      fetchAllOrganizerData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to start tournament.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // -----------------------------------------------------------------
  // Handlers: Complete Tournament & Award XP
  // -----------------------------------------------------------------
  const handleCompleteTournament = async (tournamentId) => {
    if (!window.confirm('Are you sure you want to mark this tournament as COMPLETED? This will distribute XP to participants and champions.')) return;

    try {
      await axios.patch(`http://localhost:8080/tournament/${tournamentId}/complete`);
      setSuccessMsg('Tournament successfully COMPLETED! XP & achievements awarded to participants.');
      fetchAllOrganizerData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to complete tournament.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // -----------------------------------------------------------------
  // Handlers: Registration Approval & Rejection
  // -----------------------------------------------------------------
  const handleApproveRegistration = async (regId) => {
    try {
      await axios.patch(`http://localhost:8080/tournament/registration/${regId}/approve`);
      setSuccessMsg('Registration APPROVED! Player added to official tournament bracket.');
      fetchAllOrganizerData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to approve registration.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleRejectRegistration = async (regId) => {
    try {
      await axios.patch(`http://localhost:8080/tournament/registration/${regId}/reject`);
      setSuccessMsg('Registration rejected.');
      fetchAllOrganizerData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to reject registration.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // -----------------------------------------------------------------
  // Handlers: OTP Verification
  // -----------------------------------------------------------------
  const handleSendOtp = async () => {
    if (!organizer?.id) return;
    try {
      await axios.post(`http://localhost:8080/organizer/${organizer.id}/send-otp`);
      setOtpSent(true);
      setSuccessMsg('Verification OTP sent to your registered email address!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to send OTP. Check your account email.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!organizer?.id || !otpInput) return;
    setVerifyingOtp(true);
    try {
      const res = await axios.post(`http://localhost:8080/organizer/${organizer.id}/verify-otp?otp=${otpInput}`);
      setOrganizer(res.data);
      setSuccessMsg('Organizer account verified! Verified Host status active.');
      setOtpInput('');
      fetchAllOrganizerData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Invalid or expired OTP.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const isVerified = organizer?.verificationStatus === 'VERIFIED';
  const orgName = organizer?.organizationName || userName;
  const recentTourneys = dashboardData?.recentTournaments || [];

  return (
    <div className="panel-container organizer-panel" style={{ width: '100%', background: '#141414', minHeight: '80vh', fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Welcome Banner Between 2 Cyan Gradient Lines */}
      <div className="welcome-banner-container" style={{ width: '100%', margin: '20px 0 30px 0' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: 0 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 32px', maxWidth: '1400px', margin: '0 auto', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '48px', color: '#ffffff', margin: 0, fontWeight: '300', letterSpacing: '0.5px', lineHeight: '1.2' }}>
              Welcome, <span style={{ color: '#ff0077', fontWeight: '400' }}>{orgName}</span> !!
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '6px 0 0 0' }}>
              Esports Tournament Host Dashboard & Operations Control Center
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #00bfff, #0055ff)',
                border: 'none',
                color: '#fff',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(0, 191, 255, 0.4)'
              }}
            >
              + Host New Tournament
            </button>

            <button
              onClick={() => setIsLiveHosting(!isLiveHosting)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 26px',
                borderRadius: '30px',
                border: isLiveHosting ? '1px solid #10b981' : '1px solid #ef4444',
                background: isLiveHosting ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isLiveHosting ? '#10b981' : '#ef4444',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: isLiveHosting ? '0 0 18px rgba(16, 185, 129, 0.35)' : '0 0 18px rgba(239, 68, 68, 0.35)',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 8px currentColor' }}></span>
              {isLiveHosting ? 'LIVE HOSTING' : 'IDLE'}
            </button>
          </div>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: 0 }} />
      </div>

      <div className="organizer-panel-wrapper">
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '16px', marginBottom: '32px', overflowX: 'auto' }}>
          <button
            className={`organizer-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Analytics & Dashboard
          </button>
          <button
            className={`organizer-tab-btn ${activeTab === 'tournaments' ? 'active' : ''}`}
            onClick={() => setActiveTab('tournaments')}
          >
            🏆 Manage Tournaments ({dashboardData?.totalTournamentsHosted || 0})
          </button>
          <button
            className={`organizer-tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            📋 Pending Registrations ({pendingRegistrations.length})
          </button>
          <button
            className={`organizer-tab-btn ${activeTab === 'disputes' ? 'active' : ''}`}
            onClick={() => setActiveTab('disputes')}
          >
            ⚠️ Disputes Hub ({dashboardData?.openDisputeCount || disputes.length})
          </button>
          <button
            className={`organizer-tab-btn ${activeTab === 'verification' ? 'active' : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            🛡️ Host Verification
          </button>
        </div>

        {/* Global Feedback Notifications */}
        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', fontWeight: '600', textAlign: 'center' }}>
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px', fontWeight: '600', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        {/* TAB 1: OVERVIEW & DASHBOARD METRICS */}
        {activeTab === 'overview' && (
          <OrganizerOverviewTab
            dashboardData={dashboardData}
            recentTourneys={recentTourneys}
            onOpenCreateModal={() => setShowCreateModal(true)}
            onSelectTournamentForRoom={(t) => { setSelectedTournamentForRoom(t); setRoomData({ roomId: t.roomId || '', roomPassword: t.roomPassword || '' }); }}
            onStartTournament={handleStartTournament}
            onCompleteTournament={handleCompleteTournament}
            onMarkPrizePaid={handleMarkPrizePaid}
            onViewAllTournaments={() => setActiveTab('tournaments')}
          />
        )}

        {/* TAB 2: MANAGE TOURNAMENTS */}
        {activeTab === 'tournaments' && (
          <OrganizerTournamentsTab
            tournaments={recentTourneys}
            onOpenCreateModal={() => setShowCreateModal(true)}
            onSelectTournamentForRoom={(t) => { setSelectedTournamentForRoom(t); setRoomData({ roomId: t.roomId || '', roomPassword: t.roomPassword || '' }); }}
            onStartTournament={handleStartTournament}
            onCompleteTournament={handleCompleteTournament}
            onMarkPrizePaid={handleMarkPrizePaid}
          />
        )}

        {/* TAB 3: PENDING REGISTRATIONS HUB */}
        {activeTab === 'registrations' && (
          <OrganizerRegistrationsTab
            pendingRegistrations={pendingRegistrations}
            playersMap={playersMap}
            onApproveRegistration={handleApproveRegistration}
            onRejectRegistration={handleRejectRegistration}
          />
        )}

        {/* TAB 4: DISPUTES & RESOLUTIONS HUB */}
        {activeTab === 'disputes' && (
          <OrganizerDisputesTab
            disputes={disputes}
          />
        )}

        {/* TAB 5: HOST VERIFICATION & OTP */}
        {activeTab === 'verification' && (
          <OrganizerVerificationTab
            organizer={organizer}
            isVerified={isVerified}
            otpSent={otpSent}
            otpInput={otpInput}
            verifyingOtp={verifyingOtp}
            onOtpInputChange={setOtpInput}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
          />
        )}

      </div>

      {/* MODAL: CREATE TOURNAMENT */}
      <CreateTournamentModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        tournamentForm={tournamentForm}
        setTournamentForm={setTournamentForm}
        onSubmit={handleCreateTournament}
      />

      {/* MODAL: RELEASE ROOM DETAILS */}
      <ReleaseRoomModal
        tournament={selectedTournamentForRoom}
        roomData={roomData}
        setRoomData={setRoomData}
        onClose={() => setSelectedTournamentForRoom(null)}
        onSubmit={handleReleaseRoom}
      />

    </div>
  );
};

export default OrganizerPanel;
