import React from 'react';

const OrganizerOverviewTab = ({
  dashboardData,
  recentTourneys,
  onOpenCreateModal,
  onSelectTournamentForRoom,
  onStartTournament,
  onCompleteTournament,
  onMarkPrizePaid,
  onViewAllTournaments
}) => {
  return (
    <div>
      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        
        <div className="organizer-kpi-card">
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            TOURNAMENTS HOSTED
          </span>
          <h2 style={{ fontSize: '42px', color: '#00bfff', margin: 0, fontWeight: '700' }}>
            {dashboardData?.totalTournamentsHosted || 0} <span style={{ fontSize: '18px', color: '#94a3b8' }}>Total</span>
          </h2>
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
              Upcoming: {dashboardData?.tournamentsByStatus?.UPCOMING || 0}
            </span>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
              Ongoing: {dashboardData?.tournamentsByStatus?.ONGOING || 0}
            </span>
            <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
              Completed: {dashboardData?.tournamentsByStatus?.COMPLETED || 0}
            </span>
          </div>
        </div>

        <div className="organizer-kpi-card">
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            PRIZE POOL AWARDED
          </span>
          <h2 style={{ fontSize: '42px', color: '#10b981', margin: 0, fontWeight: '700' }}>
            ₹{(dashboardData?.totalPrizePoolAwarded || 0).toLocaleString()}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '10px 0 0 0' }}>
            Total prize distributed across completed tournaments
          </p>
        </div>

        <div className="organizer-kpi-card">
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            PLAYERS REACHED
          </span>
          <h2 style={{ fontSize: '42px', color: '#f59e0b', margin: 0, fontWeight: '700' }}>
            {dashboardData?.totalPlayersReached || 0} <span style={{ fontSize: '18px', color: '#94a3b8' }}>Players</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '10px 0 0 0' }}>
            Approved tournament registrations across all events
          </p>
        </div>

        <div className="organizer-kpi-card">
          <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            OPEN DISPUTES
          </span>
          <h2 style={{ fontSize: '42px', color: (dashboardData?.openDisputeCount || 0) > 0 ? '#ef4444' : '#10b981', margin: 0, fontWeight: '700' }}>
            {dashboardData?.openDisputeCount || 0} <span style={{ fontSize: '18px', color: '#94a3b8' }}>Open</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '10px 0 0 0' }}>
            {(dashboardData?.openDisputeCount || 0) > 0 ? 'Requires organizer / admin resolution' : 'Zero disputes pending! Clean record'}
          </p>
        </div>
      </div>

      {/* Recent Tournaments Section */}
      <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '24px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '22px', color: '#ffffff', margin: 0, fontWeight: '600' }}>
            Recent Tournaments
          </h3>
          <button
            onClick={onViewAllTournaments}
            style={{ background: 'transparent', border: 'none', color: '#00bfff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
          >
            View All Tournaments →
          </button>
        </div>

        {recentTourneys.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <p style={{ fontSize: '16px', margin: '0 0 16px 0' }}>No tournaments hosted yet.</p>
            <button
              onClick={onOpenCreateModal}
              className="action-btn-primary"
            >
              + Host Your First Tournament
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentTourneys.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#141414',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>{t.name}</h4>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                      background: t.status === 'ONGOING' ? 'rgba(16, 185, 129, 0.2)' : t.status === 'COMPLETED' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                      color: t.status === 'ONGOING' ? '#10b981' : t.status === 'COMPLETED' ? '#c084fc' : '#38bdf8',
                      border: `1px solid ${t.status === 'ONGOING' ? '#10b981' : t.status === 'COMPLETED' ? '#c084fc' : '#38bdf8'}`
                    }}>
                      {t.status}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
                    Game: <strong style={{ color: '#fff' }}>{t.game}</strong> &bull; Region: {t.region} &bull; Prize: <strong style={{ color: '#10b981' }}>₹{t.prizePool?.toLocaleString()}</strong>
                    {t.roomId && <span> &bull; Room: <strong style={{ color: '#00bfff' }}>{t.roomId}</strong></span>}
                    {t.prizePoolPaid && <span style={{ color: '#10b981', marginLeft: '8px' }}>✓ Prize Paid</span>}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {t.status === 'UPCOMING' && (
                    <button
                      onClick={() => onStartTournament(t.id)}
                      className="action-btn-success"
                      style={{ fontSize: '13px', padding: '8px 16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff' }}
                    >
                      ▶️ Start Match (Go Live)
                    </button>
                  )}

                  {t.status !== 'COMPLETED' && (
                    <button
                      onClick={() => onSelectTournamentForRoom(t)}
                      className="action-btn-primary"
                      style={{ fontSize: '13px', padding: '8px 16px' }}
                    >
                      🔑 {t.roomId ? 'Update Room' : 'Release Room'}
                    </button>
                  )}

                  {t.status === 'ONGOING' && (
                    <button
                      onClick={() => onCompleteTournament(t)}
                      className="action-btn-success"
                      style={{ fontSize: '13px', padding: '8px 16px' }}
                    >
                      🏁 Complete & Declare Winner
                    </button>
                  )}

                  {t.status === 'COMPLETED' && !t.prizePoolPaid && (
                    <button
                      onClick={() => onMarkPrizePaid(t.id)}
                      className="action-btn-success"
                      style={{ fontSize: '13px', padding: '8px 16px' }}
                    >
                      💰 Mark Prize Paid
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerOverviewTab;
