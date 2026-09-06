import React from 'react';

const AdminRecruitersTab = ({
  recruiters,
  recruiterFilter,
  setRecruiterFilter,
  fetchRecruiters,
  handleApproveRecruiter,
  openRejectDialog,
  actionLoading
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>Scout and Agency Approvals</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Verify esports organizations and talent recruiters to build ecosystem trust.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {['ALL', 'PENDING'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setRecruiterFilter(f);
                fetchRecruiters(f);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                background: recruiterFilter === f ? '#8b5cf6' : '#1a1f2c',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {f === 'ALL' ? 'All Scouts' : 'Pending Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Recruiters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {recruiters.map((r) => (
          <div
            key={r.id}
            style={{
              background: '#1a1f2c',
              borderRadius: '18px',
              padding: '22px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', background: r.verificationStatus === 'VERIFIED' ? 'rgba(16, 185, 129, 0.2)' : r.verificationStatus === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.2)', color: r.verificationStatus === 'VERIFIED' ? '#10b981' : r.verificationStatus === 'REJECTED' ? '#ef4444' : '#a78bfa' }}>
                  {r.verificationStatus || 'PENDING'}
                </span>

                <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Recruiter ID #{r.id}</span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: '#ffffff' }}>
                {r.organizationName || 'Unnamed Org'}
              </h3>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>User ID: #{r.userId} | Region: {r.region || 'Global'}</div>

              {r.bio && (
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '10px', lineHeight: '1.4' }}>{r.bio}</p>
              )}

              {r.rejectionReason && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#ef4444' }}>
                  <strong>Rejection Reason:</strong> {r.rejectionReason}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {r.verificationStatus !== 'VERIFIED' && (
                <button
                  onClick={() => handleApproveRecruiter(r.id)}
                  disabled={actionLoading}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#10b981', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  Approve
                </button>
              )}

              {r.verificationStatus !== 'REJECTED' && (
                <button
                  onClick={() => openRejectDialog('RECRUITER', r.id, r.organizationName)}
                  disabled={actionLoading}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
        {recruiters.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: '#1a1f2c', borderRadius: '18px', color: '#64748b' }}>
            No recruiter records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecruitersTab;
