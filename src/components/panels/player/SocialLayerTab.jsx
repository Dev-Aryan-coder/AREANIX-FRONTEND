import React from 'react';

const SocialLayerTab = ({
  socialSubTab,
  setSocialSubTab,
  socialMessage,
  allPlayersList,
  pendingFriendRequests,
  friendsList,
  userId,
  handleOpenProfileModal,
  handleSendFriendRequest,
  handleAcceptFriendRequest,
  handleRejectFriendRequest
}) => {
  return (
    <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85), -6px -6px 20px rgba(255,255,255,0.03)' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
          Social Layer & Friend Network
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          Discover players, view public gamer profiles, send friend requests, and respond to incoming friend invites.
        </p>
      </div>

      {/* Toast Message Notification */}
      {socialMessage && (
        <div style={{ background: 'rgba(0, 191, 255, 0.15)', border: '1px solid #00bfff', color: '#00bfff', padding: '12px 18px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{socialMessage}</span>
        </div>
      )}

      {/* 3 Social Sub-Tabs Filter */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setSocialSubTab('directory')}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: socialSubTab === 'directory' ? '1px solid rgba(0, 191, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            background: socialSubTab === 'directory' ? '#1c2330' : '#12151c',
            color: socialSubTab === 'directory' ? '#00bfff' : '#94a3b8',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '13px',
            fontWeight: socialSubTab === 'directory' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          1. All Players Directory ({allPlayersList.length})
        </button>

        <button
          type="button"
          onClick={() => setSocialSubTab('invites')}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: socialSubTab === 'invites' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            background: socialSubTab === 'invites' ? 'rgba(245, 158, 11, 0.15)' : '#12151c',
            color: socialSubTab === 'invites' ? '#f59e0b' : '#94a3b8',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '13px',
            fontWeight: socialSubTab === 'invites' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          2. Received Friend Invites ({pendingFriendRequests.length})
        </button>

        <button
          type="button"
          onClick={() => setSocialSubTab('friends')}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: socialSubTab === 'friends' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            background: socialSubTab === 'friends' ? 'rgba(16, 185, 129, 0.15)' : '#12151c',
            color: socialSubTab === 'friends' ? '#10b981' : '#94a3b8',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '13px',
            fontWeight: socialSubTab === 'friends' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          3. My Friends ({friendsList.length})
        </button>
      </div>

      {/* Sub-Tab 1: All Players Directory */}
      {socialSubTab === 'directory' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#ffffff', margin: '0 0 16px 0', fontWeight: '500' }}>Active Player Directory (`GET /player/all`)</h3>
          {allPlayersList.length === 0 ? (
            <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>No players registered in the global directory.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {allPlayersList.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: '#12151c',
                    padding: '20px',
                    borderRadius: '16px',
                    border: p.id === userId ? '1px solid #00bfff' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid rgba(0, 191, 255, 0.4)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>
                        {p.game || 'BGMI'}
                      </span>
                      {p.id === userId && (
                        <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '700' }}>YOU</span>
                      )}
                    </div>
                    <h4 style={{ color: '#ffffff', fontSize: '18px', margin: '0 0 4px 0', fontWeight: '600' }}>{p.gamerTag || `Player #${p.id}`}</h4>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 14px 0' }}>
                      Rank: <strong style={{ color: '#f59e0b' }}>{p.rankName || 'Conqueror'}</strong> | Role: <strong style={{ color: '#fff' }}>{p.roleInGame || 'Entry Fragger'}</strong>
                    </p>
                  </div>

                    {/* Action Buttons: View Profile + Handshake Friend Request */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenProfileModal(p)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '10px',
                        background: '#1c2330',
                        border: '1px solid rgba(0, 191, 255, 0.4)',
                        color: '#00bfff',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif",
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Profile
                    </button>

                    {(p.userId || p.user?.id || p.id) !== userId && (
                      <button
                        type="button"
                        onClick={() => handleSendFriendRequest(p.userId || p.user?.id || p.id)}
                        title="Send Friend Request"
                        style={{
                          padding: '9px 14px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontFamily: "'Poppins', sans-serif",
                          boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: Received Friend Invites */}
      {socialSubTab === 'invites' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#ffffff', margin: '0 0 16px 0', fontWeight: '500' }}>Incoming Friend Invites</h3>
          {pendingFriendRequests.length === 0 ? (
            <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>No pending friend requests at the moment.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pendingFriendRequests.map((req) => {
                const senderPlayer = allPlayersList.find(
                  (p) => Number(p.userId) === Number(req.userId1) || Number(p.user?.id) === Number(req.userId1) || Number(p.id) === Number(req.userId1)
                );
                const senderName = senderPlayer?.gamerTag || senderPlayer?.user?.fullname || `Player #${req.userId1}`;

                return (
                  <div key={req.id} style={{ background: '#12151c', padding: '18px 24px', borderRadius: '16px', border: '1px solid rgba(0, 191, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div>
                        <h4 style={{ color: '#ffffff', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                          <span style={{ color: '#00bfff' }}>{senderName}</span>
                        </h4>
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                          {senderPlayer?.game ? `${senderPlayer.game} • ` : ''}Sent you a friend connection request
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleAcceptFriendRequest(req.id)}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          color: '#fff',
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontFamily: "'Poppins', sans-serif"
                        }}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectFriendRequest(req.id)}
                        style={{
                          padding: '8px 18px',
                          borderRadius: '10px',
                          background: 'transparent',
                          border: '1px solid #ef4444',
                          color: '#ef4444',
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontFamily: "'Poppins', sans-serif"
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: My Friends List */}
      {socialSubTab === 'friends' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#ffffff', margin: '0 0 16px 0', fontWeight: '500' }}>My Friends</h3>
          {friendsList.length === 0 ? (
            <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>No accepted friends yet. Send friend requests from the All Players Directory!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {friendsList.map((fr) => {
                const friendUserId = Number(fr.userId1) === Number(userId) ? fr.userId2 : fr.userId1;
                const friendPlayer = allPlayersList.find(
                  (p) => Number(p.userId) === Number(friendUserId) || Number(p.user?.id) === Number(friendUserId) || Number(p.id) === Number(friendUserId)
                );
                const friendName = friendPlayer?.gamerTag || friendPlayer?.user?.fullname || `Player #${friendUserId}`;

                return (
                  <div key={fr.id} style={{ background: '#12151c', padding: '18px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div>
                        <h4 style={{ color: '#ffffff', margin: 0, fontSize: '15px', fontWeight: '600' }}>
                          {friendName}
                        </h4>
                        <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '600' }}>
                          {friendPlayer?.rankName ? `${friendPlayer.rankName} • ` : ''}CONNECTED FRIEND
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialLayerTab;
