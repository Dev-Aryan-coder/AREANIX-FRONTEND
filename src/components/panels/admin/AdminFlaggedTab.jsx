import React from 'react';

const AdminFlaggedTab = ({
  flaggedTournaments,
  handleReviewReport,
  handleCancelTournament,
  actionLoading
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>Flagged Tournaments and Reports</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Investigate community reports, mark as reviewed, or cancel rogue tournaments directly.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {flaggedTournaments.map((rep) => (
          <div
            key={rep.id}
            style={{
              background: '#1a1f2c',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                  REPORT #{rep.id}
                </span>
                <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '600' }}>
                  Tournament ID: #{rep.tournamentId}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>Reason: {rep.reason || 'Fraudulent tournament rules'}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Status: <strong style={{ color: rep.status === 'OPEN' ? '#ef4444' : '#10b981' }}>{rep.status}</strong> | Reported by User #{rep.userId}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {rep.status === 'OPEN' && (
                <button
                  onClick={() => handleReviewReport(rep.id)}
                  disabled={actionLoading}
                  style={{ padding: '10px 18px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#10b981', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                >
                  Mark Reviewed
                </button>
              )}

              <button
                onClick={() => handleCancelTournament(rep.tournamentId)}
                disabled={actionLoading}
                style={{ padding: '10px 18px', borderRadius: '10px', background: '#ef4444', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel Tournament
              </button>
            </div>
          </div>
        ))}
        {flaggedTournaments.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', background: '#1a1f2c', borderRadius: '18px', color: '#64748b' }}>
            Zero open tournament reports. All events running normally.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFlaggedTab;
