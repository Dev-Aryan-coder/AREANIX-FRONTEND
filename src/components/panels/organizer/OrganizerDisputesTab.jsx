import React from 'react';

const OrganizerDisputesTab = ({ disputes, onResolveDispute }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', color: '#fff', margin: 0, fontWeight: '600' }}>
            Tournament Disputes & Incident Reports
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Disputes and payout claims raised by players against tournaments hosted by your organization.
          </p>
        </div>
      </div>

      {disputes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#1c1c1c', borderRadius: '20px', color: '#94a3b8' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🏆</span>
          <p style={{ fontSize: '18px', color: '#ffffff', margin: '0 0 8px 0', fontWeight: '600' }}>Zero Disputes Active!</p>
          <p style={{ fontSize: '14px', margin: 0 }}>All your tournaments have concluded smoothly with zero player contestations.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {disputes.map((d) => (
            <div
              key={d.id}
              style={{
                background: '#1c1c1c',
                border: d.status === 'OPEN' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  background: d.status === 'OPEN' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: d.status === 'OPEN' ? '#ef4444' : '#10b981',
                  border: `1px solid ${d.status === 'OPEN' ? '#ef4444' : '#10b981'}`
                }}>
                  {d.status} DISPUTE
                </span>
                <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                  Tournament #{d.tournamentId} &bull; Raised by User #{d.raisedBy}
                </span>
              </div>

              <p style={{ color: '#ffffff', fontSize: '15px', margin: '0 0 14px 0', lineHeight: '1.5' }}>
                "{d.description}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ color: '#64748b', fontSize: '12px' }}>
                  Logged at: {d.createdAt ? new Date(d.createdAt).toLocaleString() : 'Recent'}
                </div>

                {d.status === 'OPEN' && onResolveDispute && (
                  <button
                    type="button"
                    onClick={() => onResolveDispute(d.id)}
                    className="action-btn-success"
                    style={{ padding: '6px 16px', fontSize: '12px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    ✅ Mark Resolved
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

export default OrganizerDisputesTab;
