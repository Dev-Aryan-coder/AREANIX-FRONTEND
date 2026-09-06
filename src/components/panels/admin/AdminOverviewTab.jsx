import React from 'react';

const AdminOverviewTab = ({ stats, setActiveTab, reloadAll, loading }) => {
  const kpiItems = [
    { label: 'Total Registered Users', val: stats.totalUsers, tag: 'USERS', color: '#00bfff' },
    { label: 'New Signups (7 Days)', val: stats.newUsersThisWeek, tag: 'NEW', color: '#10b981' },
    { label: 'Verified Organizers', val: stats.totalOrganizers, tag: 'HOSTS', color: '#f59e0b' },
    { label: 'Pending Host Queue', val: stats.pendingOrganizers, tag: 'QUEUE', color: '#ef4444' },
    { label: 'Active Recruiters', val: stats.totalRecruiters, tag: 'SCOUTS', color: '#8b5cf6' },
    { label: 'Total Tournaments', val: stats.totalTournaments, tag: 'EVENTS', color: '#ec4899' },
    { label: 'Completed Tournaments', val: stats.completedTournaments, tag: 'FINISHED', color: '#10b981' },
    { label: 'Prize Pool Awarded', val: `INR ${(stats.totalPrizePoolAwarded || 0).toLocaleString()}`, tag: 'POOL', color: '#22c55e' },
    { label: 'Platform XP Awarded', val: `${(stats.totalXpAwardedPlatformWide || 0).toLocaleString()} XP`, tag: 'XP', color: '#38bdf8' },
    { label: 'Achievements Unlocked', val: stats.totalAchievementsGenerated, tag: 'BADGES', color: '#fbbf24' },
    { label: 'Open Flagged Reports', val: stats.openReports, tag: 'FLAGS', color: '#f87171' },
    { label: 'Unresolved Disputes', val: stats.openDisputes, tag: 'DISPUTES', color: '#a78bfa' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 6px 0' }}>Platform Global Metrics</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Real-time aggregated health and activity across Areanix esports ecosystem.</p>
      </div>

      {/* 12 Metric KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
        {kpiItems.map((kpi, idx) => (
          <div
            key={idx}
            style={{
              background: '#1a1f2c',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{ width: '56px', height: '48px', borderRadius: '12px', background: `${kpi.color}15`, border: `1px solid ${kpi.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: kpi.color, letterSpacing: '0.5px' }}>
              {kpi.tag}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{kpi.label}</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: kpi.color, marginTop: '2px' }}>{kpi.val}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(15, 23, 42, 0.6))', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>System Security and Live MySQL Database Active</h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>Direct connection to Spring Boot 4.1 backend with real-time audit capabilities.</p>
        </div>
        <button
          onClick={() => setActiveTab('organizers')}
          style={{ padding: '12px 24px', borderRadius: '12px', background: '#ef4444', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
        >
          Review Pending Queue ({stats.pendingOrganizers})
        </button>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
