import React from 'react';

const PlayerProfileModal = ({
  viewProfileModalData,
  setViewProfileModalData,
  modalPlayerXp,
  userId,
  handleSendFriendRequest
}) => {
  if (!viewProfileModalData) return null;

  const isAvailable = viewProfileModalData.availabilityStatus === 'OPEN_TO_OFFERS' || viewProfileModalData.availabilityStatus === 'LOOKING_FOR_TEAM';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.35)', borderRadius: '28px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '36px 32px', boxShadow: '0 25px 60px rgba(0,0,0,0.95), 0 0 35px rgba(0, 191, 255, 0.15)', fontFamily: "'Poppins', sans-serif", position: 'relative' }}>
        
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={() => setViewProfileModalData(null)}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '50%', width: '36px', height: '36px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#00bfff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Top Cyan Divider Line */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: '0 0 24px 0' }} />

        {/* Hero Profile Banner Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', paddingBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Large Profile Picture with Glow and Status Dot */}
            <div style={{ position: 'relative' }}>
              <img
                src={viewProfileModalData.profileImageUrl || viewProfileModalData.profileImage || viewProfileModalData.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${viewProfileModalData.gamerTag || viewProfileModalData.id}`}
                alt="Player Avatar"
                style={{ width: '95px', height: '95px', borderRadius: '50%', border: '3px solid #00bfff', boxShadow: '0 0 25px rgba(0, 191, 255, 0.4)', objectFit: 'cover', background: '#12151c' }}
              />
              <span style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                backgroundColor: isAvailable ? '#10b981' : '#ef4444',
                border: '3px solid #161a22',
                borderRadius: '50%',
                boxShadow: isAvailable ? '0 0 10px #10b981' : '0 0 10px #ef4444'
              }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid rgba(0, 191, 255, 0.5)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' }}>
                  {viewProfileModalData.game || 'BGMI'}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Player ID: <strong style={{ color: '#00bfff' }}>#{viewProfileModalData.id}</strong></span>
              </div>
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '36px', color: '#ffffff', margin: 0, fontWeight: '600', letterSpacing: '0.5px', lineHeight: '1.2' }}>
                {viewProfileModalData.gamerTag || `Player #${viewProfileModalData.id}`}
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
                Role: <strong style={{ color: '#00bfff' }}>{viewProfileModalData.roleInGame || 'Entry Fragger'}</strong> &bull; Region: <strong style={{ color: '#fff' }}>{viewProfileModalData.region || 'Asia'}</strong>
              </p>
            </div>
          </div>

          {/* Lobby Availability Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '30px',
              border: isAvailable ? '1px solid #10b981' : '1px solid #ef4444',
              background: isAvailable ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isAvailable ? '#10b981' : '#ef4444',
              fontWeight: '600',
              fontSize: '13px',
              boxShadow: isAvailable ? '0 0 14px rgba(16, 185, 129, 0.35)' : '0 0 14px rgba(239, 68, 68, 0.35)'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'currentColor', boxShadow: '0 0 6px currentColor' }} />
              {isAvailable ? 'OPEN TO OFFERS' : 'NOT AVAILABLE'}
            </div>
          </div>
        </div>

        {/* Bottom Cyan Divider Line */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(0, 191, 255, 0.8) 50%, transparent 100%)', boxShadow: '0 0 12px rgba(0, 191, 255, 0.5)', margin: '0 0 28px 0' }} />

        {/* Detailed Stats Grid (4 Cards: XP, Rank, Rank Name, Role & Region) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          
          {/* Card 1: Player XP Status & Level */}
          <div style={{ background: '#12151c', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              PLAYER XP & LEVEL
            </span>
            <h3 style={{ fontSize: '26px', color: '#00bfff', margin: 0, fontWeight: '700' }}>
              {modalPlayerXp.xp} <span style={{ fontSize: '14px', color: '#94a3b8' }}>XP</span>
            </h3>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', margin: '10px 0 6px 0', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(modalPlayerXp.xp / 10, 100)}%`, height: '100%', background: 'linear-gradient(90deg, #00bfff, #0055ff)', borderRadius: '3px' }}></div>
            </div>
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>Level {modalPlayerXp.level}</span>
          </div>

          {/* Card 2: Global Leaderboard Rank */}
          <div style={{ background: '#12151c', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              LEADERBOARD RANK
            </span>
            <h3 style={{ fontSize: '26px', color: '#10b981', margin: 0, fontWeight: '700' }}>
              {modalPlayerXp.rank !== '-' ? `#${modalPlayerXp.rank}` : '#1'}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 0 0' }}>
              Global Competitive Standing
            </p>
          </div>

          {/* Card 3: Rank Name & Game */}
          <div style={{ background: '#12151c', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              RANK NAME
            </span>
            <h3 style={{ fontSize: '22px', color: '#f59e0b', margin: 0, fontWeight: '700' }}>
              {viewProfileModalData.rankName || 'Conqueror'}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 0 0' }}>
              Game: {viewProfileModalData.game || 'BGMI'}
            </p>
          </div>

          {/* Card 4: Role In Game & Region */}
          <div style={{ background: '#12151c', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              ROLE IN GAME
            </span>
            <h3 style={{ fontSize: '18px', color: '#ffffff', margin: 0, fontWeight: '600' }}>
              {viewProfileModalData.roleInGame || 'Entry Fragger'}
            </h3>
            <p style={{ fontSize: '12px', color: '#00bfff', margin: '8px 0 0 0', fontWeight: '500' }}>
              Region: {viewProfileModalData.region || 'Asia'}
            </p>
          </div>

        </div>

        {/* Streaming & Social Channels Details (Shows actual URL or explicit 'No URL linked' text) */}
        <div style={{ background: '#12151c', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '22px 24px', marginBottom: '28px' }}>
          <h4 style={{ color: '#ffffff', margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Streaming & Media Channels
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Twitch Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'rgba(145, 70, 255, 0.15)', border: '1px solid #9146FF', color: '#9146FF', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                  Twitch
                </span>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Channel URL:</span>
              </div>

              {viewProfileModalData.twitchUrl ? (
                <a
                  href={viewProfileModalData.twitchUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#9146FF', fontSize: '13px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{viewProfileModalData.twitchUrl}</span>
                  <span style={{ fontSize: '11px' }}>&rarr;</span>
                </a>
              ) : (
                <span style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
                  No Twitch URL linked
                </span>
              )}
            </div>

            {/* YouTube Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ background: 'rgba(255, 0, 0, 0.15)', border: '1px solid #FF0000', color: '#FF4444', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>
                  YouTube
                </span>
                <span style={{ color: '#94a3b8', fontSize: '13px' }}>Channel URL:</span>
              </div>

              {viewProfileModalData.youtubeUrl ? (
                <a
                  href={viewProfileModalData.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#FF4444', fontSize: '13px', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>{viewProfileModalData.youtubeUrl}</span>
                  <span style={{ fontSize: '11px' }}>&rarr;</span>
                </a>
              ) : (
                <span style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>
                  No YouTube channel linked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div style={{ display: 'flex', gap: '14px', paddingTop: '6px' }}>
          {(viewProfileModalData.userId || viewProfileModalData.user?.id || viewProfileModalData.id) !== userId && (
            <button
              type="button"
              onClick={() => {
                handleSendFriendRequest(viewProfileModalData.userId || viewProfileModalData.user?.id || viewProfileModalData.id);
                setViewProfileModalData(null);
              }}
              style={{
                flex: 1,
                padding: '14px 24px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 4px 18px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              Send Friend Request
            </button>
          )}
          <button
            type="button"
            onClick={() => setViewProfileModalData(null)}
            style={{
              flex: (viewProfileModalData.userId || viewProfileModalData.user?.id || viewProfileModalData.id) === userId ? 1 : '0 0 160px',
              padding: '14px 24px',
              borderRadius: '14px',
              background: '#1c2330',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              fontWeight: '600',
              fontSize: '15px',
              cursor: 'pointer',
              fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.2s ease'
            }}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default PlayerProfileModal;
