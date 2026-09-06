import React from 'react';

const OrganizerVerificationTab = ({
  organizer,
  isVerified,
  otpSent,
  otpInput,
  verifyingOtp,
  onOtpInputChange,
  onSendOtp,
  onVerifyOtp
}) => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.3)', borderRadius: '24px', padding: '36px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '36px' }}>🛡️</span>
          <div>
            <h2 style={{ fontSize: '24px', color: '#ffffff', margin: 0, fontWeight: '600' }}>
              Organizer Trust & Verification Center
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
              Verify your email and credentials to earn the blue tick Verified Host badge.
            </p>
          </div>
        </div>

        <div style={{ background: '#141414', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#cbd5e1', fontSize: '15px', fontWeight: '600' }}>Host Status:</span>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700',
              background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: isVerified ? '#10b981' : '#f59e0b',
              border: `1px solid ${isVerified ? '#10b981' : '#f59e0b'}`
            }}>
              {isVerified ? 'VERIFIED' : 'PENDING'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#cbd5e1', fontSize: '15px', fontWeight: '600' }}>YouTube / Twitch Channel:</span>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700',
              background: organizer?.channelVerified ? 'rgba(56, 189, 248, 0.15)' : 'rgba(148, 163, 184, 0.15)',
              color: organizer?.channelVerified ? '#38bdf8' : '#94a3b8',
              border: `1px solid ${organizer?.channelVerified ? '#38bdf8' : '#94a3b8'}`
            }}>
              {organizer?.channelVerified ? 'CHANNEL VERIFIED' : 'UNVERIFIED'}
            </span>
          </div>
        </div>

        {isVerified ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '16px 24px', borderRadius: '12px', textAlign: 'center', fontWeight: '600' }}>
            ✓ Official Email Verified & Account Authorized
          </div>
        ) : (
          <div>
            <h3 style={{ fontSize: '18px', color: '#fff', margin: '0 0 8px 0', fontWeight: '600' }}>
              Email OTP Verification
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0' }}>
              Click below to receive a 6-digit verification code sent directly to your organizer account email.
            </p>

            {!otpSent ? (
              <button
                type="button"
                onClick={onSendOtp}
                className="action-btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              >
                Send 6-Digit OTP to Email
              </button>
            ) : (
              <form onSubmit={onVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Enter 6-Digit OTP"
                  value={otpInput}
                  onChange={(e) => onOtpInputChange(e.target.value)}
                  required
                  style={{ padding: '14px 18px', borderRadius: '12px', background: '#141414', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '16px', letterSpacing: '3px', textAlign: 'center' }}
                />
                <button
                  type="submit"
                  disabled={verifyingOtp}
                  className="action-btn-success"
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                >
                  {verifyingOtp ? 'Verifying OTP...' : 'Verify OTP Now'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerVerificationTab;
