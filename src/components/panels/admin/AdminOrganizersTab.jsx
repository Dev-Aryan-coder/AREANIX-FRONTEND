import React from 'react';

const AdminOrganizersTab = ({
  organizers,
  organizerFilter,
  setOrganizerFilter,
  fetchOrganizers,
  handleApproveOrganizer,
  handleVerifyChannel,
  openRejectDialog,
  actionLoading
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>Tournament Host Approvals</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Review organizer applications, approve verified badges, or verify streaming channels.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {['ALL', 'PENDING'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setOrganizerFilter(f);
                fetchOrganizers(f);
              }}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                background: organizerFilter === f ? '#ef4444' : '#1a1f2c',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {f === 'ALL' ? 'All Hosts' : 'Pending Only'}
            </button>
          ))}
        </div>
      </div>

      {/* Organizers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {organizers.map((o) => (
          <div
            key={o.id}
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
                <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', background: o.verificationStatus === 'VERIFIED' ? 'rgba(16, 185, 129, 0.2)' : o.verificationStatus === 'REJECTED' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: o.verificationStatus === 'VERIFIED' ? '#10b981' : o.verificationStatus === 'REJECTED' ? '#ef4444' : '#f59e0b' }}>
                  {o.verificationStatus || 'PENDING'}
                </span>

                <span style={{ color: '#64748b', fontSize: '12px', fontWeight: '600' }}>Host ID #{o.id}</span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px 0', color: '#ffffff' }}>
                {o.organizationName || 'Unnamed Host'}
              </h3>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>User ID: #{o.userId} | Phone: {o.phoneNumber || 'N/A'}</div>

              {o.youtubeChannelUrl && (
                <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Channel Link</div>
                  <a href={o.youtubeChannelUrl} target="_blank" rel="noreferrer" style={{ color: '#00bfff', fontSize: '13px', textDecoration: 'none', wordBreak: 'break-all' }}>
                    {o.youtubeChannelUrl}
                  </a>
                </div>
              )}

              {o.rejectionReason && (
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#ef4444' }}>
                  <strong>Rejection Reason:</strong> {o.rejectionReason}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {o.verificationStatus !== 'VERIFIED' && (
                <button
                  onClick={() => handleApproveOrganizer(o.id)}
                  disabled={actionLoading}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', background: '#10b981', border: 'none', color: '#ffffff', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  Approve
                </button>
              )}

              {o.verificationStatus !== 'REJECTED' && (
                <button
                  onClick={() => openRejectDialog('ORGANIZER', o.id, o.organizationName)}
                  disabled={actionLoading}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
                >
                  Reject
                </button>
              )}

              <button
                onClick={() => handleVerifyChannel(o.id, o.channelVerified)}
                disabled={actionLoading}
                style={{ width: '100%', padding: '8px', borderRadius: '10px', background: o.channelVerified ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(56, 189, 248, 0.3)', color: o.channelVerified ? '#38bdf8' : '#94a3b8', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
              >
                {o.channelVerified ? 'Channel Verified (Revoke)' : 'Verify YouTube Channel'}
              </button>
            </div>
          </div>
        ))}
        {organizers.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: '#1a1f2c', borderRadius: '18px', color: '#64748b' }}>
            No organizer records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrganizersTab;
