import React from 'react';

const AdminDisputesTab = ({
  disputes,
  handleResolveDispute,
  actionLoading
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>Prize and Match Disputes</h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Review prize payout complaints, score cheating claims, and resolve disputes.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {disputes.map((d) => (
          <div
            key={d.id}
            style={{
              background: '#1a1f2c',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid rgba(167, 139, 250, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}>
                  DISPUTE #{d.id}
                </span>
                <span style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: '600' }}>
                  Tournament ID: #{d.tournamentId}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>Claim: {d.reason || 'Unpaid tournament prize pool'}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Status: <strong style={{ color: d.status === 'OPEN' ? '#ef4444' : '#10b981' }}>{d.status}</strong> | Raised by User #{d.raisedByUserId || d.userId}
              </div>
            </div>

            <div>
              {d.status === 'OPEN' && (
                <button
                  onClick={() => handleResolveDispute(d.id)}
                  disabled={actionLoading}
                  style={{ padding: '10px 20px', borderRadius: '10px', background: '#10b981', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
        {disputes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px', background: '#1a1f2c', borderRadius: '18px', color: '#64748b' }}>
            No open disputes in queue.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDisputesTab;
