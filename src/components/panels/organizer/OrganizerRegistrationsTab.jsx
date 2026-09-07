import React from 'react';

const OrganizerRegistrationsTab = ({
  pendingRegistrations,
  playersMap,
  onApproveRegistration,
  onRejectRegistration
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', color: '#fff', margin: 0, fontWeight: '600' }}>
            Pending Registrations Hub
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Review and approve player/squad applications across all your hosted tournaments.
          </p>
        </div>
        <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
          {pendingRegistrations.length} PENDING APPROVAL
        </span>
      </div>

      {pendingRegistrations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#1c1c1c', borderRadius: '20px', color: '#94a3b8' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>✨</span>
          <p style={{ fontSize: '18px', color: '#ffffff', margin: '0 0 8px 0', fontWeight: '600' }}>All clear!</p>
          <p style={{ fontSize: '14px', margin: 0 }}>No pending tournament registrations at this time.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {pendingRegistrations.map((reg) => {
            const player = reg.playerId ? playersMap[reg.playerId] : null;
            const displayName = player?.gamerTag || `Player #${reg.playerId || 'N/A'}`;
            const avatar = player?.profileImageUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${reg.id}`;

            return (
              <div
                key={reg.id}
                style={{
                  background: '#1c1c1c',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '20px',
                  padding: '24px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <img
                    src={avatar}
                    alt="Applicant"
                    style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #f59e0b', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, color: '#ffffff', fontSize: '17px', fontWeight: '600' }}>{displayName}</h4>
                    <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>
                      Tournament ID: <strong style={{ color: '#00bfff' }}>#{reg.tournamentId}</strong>
                      {reg.teamId && <span> &bull; Team ID: #{reg.teamId}</span>}
                    </p>
                  </div>
                </div>

                {player && (
                  <div style={{ background: '#141414', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#94a3b8', marginBottom: '18px' }}>
                    Game: <strong style={{ color: '#fff' }}>{player.game}</strong> &bull; Rank: <strong style={{ color: '#10b981' }}>{player.rankName}</strong> &bull; Role: {player.roleInGame}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => onApproveRegistration(reg.id)}
                    className="action-btn-success"
                    style={{ flex: 1, textAlign: 'center', padding: '10px 14px', fontSize: '13px', fontWeight: '600' }}
                  >
                    ✓ Approve & Allow to Play
                  </button>
                  <button
                    onClick={() => onRejectRegistration(reg.id)}
                    className="action-btn-danger"
                    style={{ flex: 1, textAlign: 'center', padding: '10px 14px', fontSize: '13px', fontWeight: '600' }}
                  >
                    ✕ Reject Application
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrganizerRegistrationsTab;
