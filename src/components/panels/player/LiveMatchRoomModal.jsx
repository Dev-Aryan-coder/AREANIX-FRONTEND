import React, { useState } from 'react';

const LiveMatchRoomModal = ({ tournament, onClose, onRaiseDispute, onLaunchGame }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);

  if (!tournament) return null;

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    if (onLaunchGame) {
      onLaunchGame(tournament);
    }
    setTimeout(() => {
      setIsLaunching(false);
      onClose();
    }, 1000);
  };

  const hostName = tournament.organizer?.organizationName || tournament.organizer?.user?.fullname || (tournament.organizerId ? `Organizer #${tournament.organizerId}` : 'Verified Esports Host');

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1c1c1c', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '24px', padding: '36px', maxWidth: '540px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' }}>
              ● LIVE MATCH IN PROGRESS
            </span>
            <h3 style={{ margin: '8px 0 4px 0', color: '#fff', fontSize: '22px', fontWeight: '600' }}>
              {tournament.name || tournament.title || `Tournament #${tournament.id}`}
            </h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px' }}>
              Host: <strong style={{ color: '#00bfff' }}>{hostName}</strong> &bull; Game: <strong style={{ color: '#fff' }}>{tournament.game || 'Esports'}</strong>
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Room Credentials Card */}
        <div style={{ background: '#141414', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '14px' }}>
            🔑 OFFICIAL CUSTOM LOBBY CREDENTIALS
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Room ID */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1c1c1c', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '11px', display: 'block' }}>ROOM ID</span>
                <strong style={{ color: '#ffffff', fontSize: '16px', letterSpacing: '1px' }}>
                  {tournament.roomId || 'TRYZ_FYRE'}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(tournament.roomId || 'TRYZ_FYRE', 'id')}
                style={{ background: copiedId ? '#10b981' : 'rgba(0, 191, 255, 0.15)', border: copiedId ? 'none' : '1px solid rgba(0, 191, 255, 0.4)', color: copiedId ? '#fff' : '#00bfff', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
              >
                {copiedId ? '✓ Copied!' : '📋 Copy ID'}
              </button>
            </div>

            {/* Room Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1c1c1c', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <span style={{ color: '#94a3b8', fontSize: '11px', display: 'block' }}>ROOM PASSWORD</span>
                <strong style={{ color: '#ffffff', fontSize: '16px', letterSpacing: '1px' }}>
                  {showPass ? (tournament.roomPassword || '741741') : '••••••'}
                </strong>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#94a3b8', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}
                >
                  {showPass ? '👁️ Hide' : '👁️ Show'}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(tournament.roomPassword || '741741', 'pass')}
                  style={{ background: copiedPass ? '#10b981' : 'rgba(0, 191, 255, 0.15)', border: copiedPass ? 'none' : '1px solid rgba(0, 191, 255, 0.4)', color: copiedPass ? '#fff' : '#00bfff', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
                >
                  {copiedPass ? '✓ Copied!' : '📋 Copy Pass'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Match Rules & Live Stream Links */}
        <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tournament.streamLink && (
            <a
              href={tournament.streamLink.startsWith('http') ? tournament.streamLink : `https://${tournament.streamLink}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}
            >
              📺 Watch Official Live Stream ➔
            </a>
          )}

          {tournament.rules && (
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#cbd5e1', maxHeight: '100px', overflowY: 'auto' }}>
              <span style={{ color: '#00bfff', fontWeight: '600', display: 'block', marginBottom: '4px' }}>Match Rules:</span>
              {tournament.rules}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onRaiseDispute) onRaiseDispute(tournament);
            }}
            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            ⚠️ Raise Lobby Dispute
          </button>

          <button
            type="button"
            onClick={handleLaunch}
            className="action-btn-primary"
            style={{
              padding: '10px 24px',
              fontSize: '13px',
              background: isLaunching ? '#10b981' : undefined
            }}
          >
            {isLaunching ? '✓ Registered! Launching...' : 'Got It, Launch Game ➔'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LiveMatchRoomModal;
