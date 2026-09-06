import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminOverviewTab from './admin/AdminOverviewTab';
import AdminUsersTab from './admin/AdminUsersTab';
import AdminOrganizersTab from './admin/AdminOrganizersTab';
import AdminRecruitersTab from './admin/AdminRecruitersTab';
import AdminFlaggedTab from './admin/AdminFlaggedTab';
import AdminDisputesTab from './admin/AdminDisputesTab';
import AdminRejectModal from './admin/AdminRejectModal';
import './AdminPanel.css';

const AdminPanel = ({ userProfile }) => {
  const userName = userProfile?.fullname || userProfile?.gamerTag || 'System Admin';
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Live Data States
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalRecruiters: 0,
    totalTournaments: 0,
    completedTournaments: 0,
    totalPrizePoolAwarded: 0,
    totalXpAwardedPlatformWide: 0,
    totalAchievementsGenerated: 0,
    newUsersThisWeek: 0,
    pendingOrganizers: 0,
    openReports: 0,
    openDisputes: 0
  });

  // Tab Data States
  const [users, setUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [organizers, setOrganizers] = useState([]);
  const [organizerFilter, setOrganizerFilter] = useState('ALL');
  const [recruiters, setRecruiters] = useState([]);
  const [recruiterFilter, setRecruiterFilter] = useState('ALL');
  const [flaggedTournaments, setFlaggedTournaments] = useState([]);
  const [disputes, setDisputes] = useState([]);

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Rejection Modal State
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    type: '',
    id: null,
    title: '',
    reason: ''
  });

  // -------------------------------------------------------------
  // Data Fetching Functions
  // -------------------------------------------------------------
  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin-login/stats');
      if (res.data) setStats(res.data);
    } catch (err) {
      console.warn('Failed to load stats:', err);
    }
  };

  const fetchUsers = async (query = '') => {
    try {
      const endpoint = query.trim()
        ? `http://localhost:8080/admin-login/users/search?query=${encodeURIComponent(query)}`
        : 'http://localhost:8080/admin-login/users';
      const res = await axios.get(endpoint);
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to load users:', err);
    }
  };

  const fetchOrganizers = async (filter = organizerFilter) => {
    try {
      const endpoint = filter === 'PENDING'
        ? 'http://localhost:8080/admin-login/organizers/pending'
        : 'http://localhost:8080/admin-login/organizers';
      const res = await axios.get(endpoint);
      setOrganizers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to load organizers:', err);
    }
  };

  const fetchRecruiters = async (filter = recruiterFilter) => {
    try {
      const endpoint = filter === 'PENDING'
        ? 'http://localhost:8080/admin-login/recruiters/pending'
        : 'http://localhost:8080/admin-login/recruiters';
      const res = await axios.get(endpoint);
      setRecruiters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to load recruiters:', err);
    }
  };

  const fetchFlagged = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin-login/tournaments/flagged');
      setFlaggedTournaments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to load flagged reports:', err);
    }
  };

  const fetchDisputes = async () => {
    try {
      const res = await axios.get('http://localhost:8080/admin-login/disputes');
      setDisputes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to load disputes:', err);
    }
  };

  const reloadAll = () => {
    setLoading(true);
    Promise.all([
      fetchStats(),
      fetchUsers(userSearchQuery),
      fetchOrganizers(organizerFilter),
      fetchRecruiters(recruiterFilter),
      fetchFlagged(),
      fetchDisputes()
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    reloadAll();
  }, []);

  const triggerToast = (msg, isErr = false) => {
    if (isErr) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4500);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4500);
    }
  };

  // -------------------------------------------------------------
  // Admin Action Handlers
  // -------------------------------------------------------------
  const handleSuspendUser = async (id) => {
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:8080/admin-login/users/${id}/suspend`);
      triggerToast(`User ID #${id} has been suspended (Deactivated).`);
      fetchUsers(userSearchQuery);
      fetchStats();
    } catch (err) {
      triggerToast('Failed to suspend user.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspendUser = async (id) => {
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:8080/admin-login/users/${id}/unsuspend`);
      triggerToast(`User ID #${id} has been re-activated.`);
      fetchUsers(userSearchQuery);
      fetchStats();
    } catch (err) {
      triggerToast('Failed to unsuspend user.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveOrganizer = async (id) => {
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:8080/admin-login/organizers/${id}/approve`);
      triggerToast(`Organizer ID #${id} approved with Verified Host status.`);
      fetchOrganizers(organizerFilter);
      fetchStats();
    } catch (err) {
      triggerToast('Failed to approve organizer.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyChannel = async (id, currentStatus) => {
    setActionLoading(true);
    const newStatus = !currentStatus;
    try {
      await axios.patch(`http://localhost:8080/admin-login/organizers/${id}/verify-channel?verified=${newStatus}`);
      triggerToast(`Organizer ID #${id} YouTube channel ${newStatus ? 'Verified' : 'Unverified'}.`);
      fetchOrganizers(organizerFilter);
    } catch (err) {
      triggerToast('Failed to update channel verification.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveRecruiter = async (id) => {
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:8080/admin-login/recruiters/${id}/approve`);
      triggerToast(`Recruiter ID #${id} approved with Verified Scout status.`);
      fetchRecruiters(recruiterFilter);
      fetchStats();
    } catch (err) {
      triggerToast('Failed to approve recruiter.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectDialog = (type, id, title) => {
    setRejectModal({
      isOpen: true,
      type,
      id,
      title,
      reason: 'Does not meet minimum activity and authenticity criteria.'
    });
  };

  const submitRejection = async () => {
    if (!rejectModal.id || !rejectModal.reason.trim()) return;
    setActionLoading(true);
    const { type, id, reason } = rejectModal;

    try {
      if (type === 'ORGANIZER') {
        await axios.patch(`http://localhost:8080/admin-login/organizers/${id}/reject?reason=${encodeURIComponent(reason)}`);
        triggerToast(`Organizer ID #${id} rejected.`);
        fetchOrganizers(organizerFilter);
      } else if (type === 'RECRUITER') {
        await axios.patch(`http://localhost:8080/admin-login/recruiters/${id}/reject?reason=${encodeURIComponent(reason)}`);
        triggerToast(`Recruiter ID #${id} rejected.`);
        fetchRecruiters(recruiterFilter);
      }
      fetchStats();
      setRejectModal({ isOpen: false, type: '', id: null, title: '', reason: '' });
    } catch (err) {
      triggerToast('Rejection failed.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewReport = async (reportId) => {
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:8080/admin-login/reports/${reportId}/review`);
      triggerToast(`Report #${reportId} marked as REVIEWED.`);
      fetchFlagged();
      fetchStats();
    } catch (err) {
      triggerToast('Failed to update report.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelTournament = async (tournamentId) => {
    if (!window.confirm(`Are you sure you want to CANCEL tournament #${tournamentId}? This will invalidate active brackets.`)) {
      return;
    }
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:8080/admin-login/tournaments/${tournamentId}/cancel`);
      triggerToast(`Tournament #${tournamentId} has been CANCELLED.`);
      fetchFlagged();
      fetchStats();
    } catch (err) {
      triggerToast('Failed to cancel tournament.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveDispute = async (disputeId) => {
    setActionLoading(true);
    try {
      await axios.patch(`http://localhost:8080/admin-login/disputes/${disputeId}/resolve`);
      triggerToast(`Dispute #${disputeId} marked as RESOLVED.`);
      fetchDisputes();
      fetchStats();
    } catch (err) {
      triggerToast('Failed to resolve dispute.', true);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="panel-container admin-panel" style={{ width: '100%', background: '#141414', minHeight: '80vh', fontFamily: "'Poppins', sans-serif", color: '#ffffff' }}>
      
      {/* Welcome Banner Between 2 Neon Lines */}
      <div className="welcome-banner-container" style={{ width: '100%', margin: '20px 0 30px 0' }}>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)', margin: 0 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 32px', maxWidth: '1440px', margin: '0 auto' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              SYSTEM ADMIN COMMAND CENTER
            </div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '42px', color: '#ffffff', margin: 0, fontWeight: '300', letterSpacing: '0.5px', lineHeight: '1.2' }}>
              Welcome, <span style={{ color: '#ef4444', fontWeight: '600' }}>{userName}</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={reloadAll}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Syncing...' : 'Refresh Data'}
            </button>

            <button
              onClick={() => setIsOnline(!isOnline)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 24px',
                borderRadius: '30px',
                border: isOnline ? '1px solid #10b981' : '1px solid #ef4444',
                background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isOnline ? '#10b981' : '#ef4444',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: isOnline ? '0 0 16px rgba(16, 185, 129, 0.35)' : '0 0 16px rgba(239, 68, 68, 0.35)'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 6px currentColor' }}></span>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </button>
          </div>
        </div>

        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(239, 68, 68, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(239, 68, 68, 0.5)', margin: 0 }} />
      </div>

      {/* Toast Feedback */}
      {successMsg && (
        <div style={{ maxWidth: '1440px', margin: '0 auto 20px auto', padding: '14px 20px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: '800' }}>[SUCCESS]</span> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{ maxWidth: '1440px', margin: '0 auto 20px auto', padding: '14px 20px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: '800' }}>[ERROR]</span> {errorMsg}
        </div>
      )}

      {/* Main Layout: Sticky Sidebar + Main Content */}
      <div style={{ display: 'flex', gap: '32px', width: '100%', padding: '0 40px 60px 0', alignItems: 'flex-start' }}>
        
        {/* Left Side Navigation Menu */}
        <div
          style={{
            width: isCollapsed ? '76px' : '300px',
            flexShrink: 0,
            background: '#161a22',
            borderTopRightRadius: '24px',
            borderBottomRightRadius: '24px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '24px 16px',
            boxShadow: '8px 0 32px rgba(0, 0, 0, 0.4)',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'sticky',
            top: '90px'
          }}
        >
          {/* Collapse Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: '24px', padding: '0 8px' }}>
            {!isCollapsed && (
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', color: '#64748b', textTransform: 'uppercase' }}>
                ADMIN CONTROLS
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                padding: '6px',
                borderRadius: '8px'
              }}
            >
              {isCollapsed ? '[+]' : '[-]'}
            </button>
          </div>

          {/* Navigation Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'overview', label: 'Platform Stats', tag: 'KPI', badge: null },
              { id: 'users', label: 'User Management', tag: 'USERS', badge: stats.totalUsers },
              { id: 'organizers', label: 'Host Approvals', tag: 'HOSTS', badge: stats.pendingOrganizers > 0 ? stats.pendingOrganizers : null, badgeColor: '#ef4444' },
              { id: 'recruiters', label: 'Scout Approvals', tag: 'SCOUTS', badge: null },
              { id: 'flagged', label: 'Flagged Reports', tag: 'FLAGS', badge: stats.openReports > 0 ? stats.openReports : null, badgeColor: '#f59e0b' },
              { id: 'disputes', label: 'Disputes Queue', tag: 'DISPUTES', badge: stats.openDisputes > 0 ? stats.openDisputes : null, badgeColor: '#8b5cf6' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '14px',
                  border: activeTab === item.id ? '1px solid #ef4444' : '1px solid transparent',
                  background: activeTab === item.id ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                  color: activeTab === item.id ? '#ef4444' : '#94a3b8',
                  fontSize: '14px',
                  fontWeight: activeTab === item.id ? '700' : '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  justifyContent: isCollapsed ? 'center' : 'flex-start'
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 6px', borderRadius: '6px', background: activeTab === item.id ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)' }}>
                  {item.tag}
                </span>
                {!isCollapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!isCollapsed && item.badge !== null && (
                  <span style={{ fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '10px', background: item.badgeColor || 'rgba(255, 255, 255, 0.1)', color: '#ffffff' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {activeTab === 'overview' && (
            <AdminOverviewTab
              stats={stats}
              setActiveTab={setActiveTab}
              reloadAll={reloadAll}
              loading={loading}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersTab
              users={users}
              userSearchQuery={userSearchQuery}
              setUserSearchQuery={setUserSearchQuery}
              fetchUsers={fetchUsers}
              handleSuspendUser={handleSuspendUser}
              handleUnsuspendUser={handleUnsuspendUser}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === 'organizers' && (
            <AdminOrganizersTab
              organizers={organizers}
              organizerFilter={organizerFilter}
              setOrganizerFilter={setOrganizerFilter}
              fetchOrganizers={fetchOrganizers}
              handleApproveOrganizer={handleApproveOrganizer}
              handleVerifyChannel={handleVerifyChannel}
              openRejectDialog={openRejectDialog}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === 'recruiters' && (
            <AdminRecruitersTab
              recruiters={recruiters}
              recruiterFilter={recruiterFilter}
              setRecruiterFilter={setRecruiterFilter}
              fetchRecruiters={fetchRecruiters}
              handleApproveRecruiter={handleApproveRecruiter}
              openRejectDialog={openRejectDialog}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === 'flagged' && (
            <AdminFlaggedTab
              flaggedTournaments={flaggedTournaments}
              handleReviewReport={handleReviewReport}
              handleCancelTournament={handleCancelTournament}
              actionLoading={actionLoading}
            />
          )}

          {activeTab === 'disputes' && (
            <AdminDisputesTab
              disputes={disputes}
              handleResolveDispute={handleResolveDispute}
              actionLoading={actionLoading}
            />
          )}
        </div>
      </div>

      {/* Modal for Rejections */}
      <AdminRejectModal
        rejectModal={rejectModal}
        setRejectModal={setRejectModal}
        submitRejection={submitRejection}
        actionLoading={actionLoading}
      />

    </div>
  );
};

export default AdminPanel;
