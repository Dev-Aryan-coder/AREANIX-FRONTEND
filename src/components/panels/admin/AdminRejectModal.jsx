import React from 'react';

const AdminRejectModal = ({
  rejectModal,
  setRejectModal,
  submitRejection,
  actionLoading
}) => {
  if (!rejectModal.isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '480px',
          background: '#1a1f2c',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
        }}
      >
        <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
          Reject {rejectModal.type === 'ORGANIZER' ? 'Host' : 'Recruiter'}: {rejectModal.title}
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0' }}>
          Provide a clear reason for rejecting this application (will be stored in database audit).
        </p>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#cbd5e1', marginBottom: '8px' }}>
            Rejection Reason *
          </label>
          <textarea
            rows="3"
            value={rejectModal.reason}
            onChange={(e) => setRejectModal((prev) => ({ ...prev, reason: e.target.value }))}
            style={{ width: '100%', padding: '12px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#ffffff', fontSize: '13px', fontFamily: "'Poppins', sans-serif" }}
            required
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setRejectModal({ isOpen: false, type: '', id: null, title: '', reason: '' })}
            style={{ padding: '10px 18px', borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#ffffff', cursor: 'pointer', fontWeight: '600' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitRejection}
            disabled={actionLoading}
            style={{ padding: '10px 22px', borderRadius: '10px', background: '#ef4444', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: '700' }}
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRejectModal;
