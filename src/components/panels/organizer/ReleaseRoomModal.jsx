import React from 'react';

const ReleaseRoomModal = ({
  tournament,
  roomData,
  setRoomData,
  onClose,
  onSubmit
}) => {
  if (!tournament) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.4)', borderRadius: '24px', padding: '36px', maxWidth: '500px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '600' }}>Release Room Credentials</h3>
            <p style={{ margin: '4px 0 0 0', color: '#00bfff', fontSize: '13px' }}>{tournament.name}</p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Custom Room ID *</label>
              <input
                type="text"
                required
                value={roomData.roomId}
                onChange={(e) => setRoomData({ ...roomData, roomId: e.target.value })}
                placeholder="e.g. AREANIX_ROOM_9821"
                style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Room Password *</label>
              <input
                type="text"
                required
                value={roomData.roomPassword}
                onChange={(e) => setRoomData({ ...roomData, roomPassword: e.target.value })}
                placeholder="e.g. 789456"
                style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '12px 20px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#94a3b8', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn-primary"
            >
              Release Room Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReleaseRoomModal;
