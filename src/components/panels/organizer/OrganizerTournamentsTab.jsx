import React from 'react';

const OrganizerTournamentsTab = ({
  tournaments,
  onOpenCreateModal,
  onSelectTournamentForRoom,
  onCompleteTournament,
  onMarkPrizePaid
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', color: '#fff', margin: 0, fontWeight: '600' }}>
          All Tournaments Hosted
        </h2>
        <button
          onClick={onOpenCreateModal}
          className="action-btn-primary"
        >
          + Host New Tournament
        </button>
      </div>

      {tournaments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#1c1c1c', borderRadius: '20px', color: '#94a3b8' }}>
          <p style={{ fontSize: '18px' }}>No tournaments created yet.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {tournaments.map((t) => (
            <div key={t.id} className="tournament-management-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <span style={{
                  padding: '4px 12px',
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
                <span style={{ color: '#10b981', fontWeight: '700', fontSize: '18px' }}>
                  ₹{t.prizePool?.toLocaleString()}
                </span>
              </div>

              <h3 style={{ fontSize: '20px', color: '#ffffff', margin: '0 0 8px 0', fontWeight: '600' }}>
                {t.name}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
                Game: <strong style={{ color: '#00bfff' }}>{t.game}</strong> &bull; Region: {t.region} &bull; Format: {t.format || 'Standard'}
              </p>

              {t.rules && (
                <div style={{ background: '#141414', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#94a3b8', marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                  <strong>Rules:</strong> {t.rules.substring(0, 120)}...
                </div>
              )}

              {t.roomId ? (
                <div style={{ background: 'rgba(0, 191, 255, 0.1)', border: '1px solid rgba(0, 191, 255, 0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', color: '#38bdf8', marginBottom: '16px' }}>
                  <strong>Room ID:</strong> {t.roomId} | <strong>Pass:</strong> {t.roomPassword}
                </div>
              ) : (
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#f59e0b', marginBottom: '16px' }}>
                  Room credentials not yet released.
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
                {t.status !== 'COMPLETED' && (
                  <button
                    onClick={() => onSelectTournamentForRoom(t)}
                    className="action-btn-primary"
                    style={{ flex: 1, textAlign: 'center', fontSize: '12px' }}
                  >
                    🔑 Release Room
                  </button>
                )}

                {t.status === 'ONGOING' && (
                  <button
                    onClick={() => onCompleteTournament(t.id)}
                    className="action-btn-success"
                    style={{ flex: 1, textAlign: 'center', fontSize: '12px' }}
                  >
                    🏁 Complete
                  </button>
                )}

                {t.status === 'COMPLETED' && !t.prizePoolPaid && (
                  <button
                    onClick={() => onMarkPrizePaid(t.id)}
                    className="action-btn-success"
                    style={{ flex: 1, textAlign: 'center', fontSize: '12px' }}
                  >
                    💰 Pay Prize Pool
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerTournamentsTab;
