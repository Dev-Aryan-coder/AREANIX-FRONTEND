import React from 'react';

const AdminUsersTab = ({
  users,
  userSearchQuery,
  setUserSearchQuery,
  fetchUsers,
  handleSuspendUser,
  handleUnsuspendUser,
  actionLoading
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>User Account Moderation</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>View all registered accounts, perform instant search, or suspend/reactivate access.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={userSearchQuery}
            onChange={(e) => {
              setUserSearchQuery(e.target.value);
              fetchUsers(e.target.value);
            }}
            style={{ width: '280px', padding: '12px 18px', background: '#1a1f2c', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', color: '#ffffff', fontSize: '14px' }}
          />
          {userSearchQuery && (
            <button
              onClick={() => { setUserSearchQuery(''); fetchUsers(''); }}
              style={{ padding: '12px 16px', background: 'rgba(255, 255, 255, 0.08)', border: 'none', borderRadius: '12px', color: '#ffffff', cursor: 'pointer' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div style={{ background: '#1a1f2c', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <th style={{ padding: '16px 20px' }}>User ID</th>
              <th style={{ padding: '16px 20px' }}>Account Info</th>
              <th style={{ padding: '16px 20px' }}>Role</th>
              <th style={{ padding: '16px 20px' }}>Status</th>
              <th style={{ padding: '16px 20px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s ease' }}>
                <td style={{ padding: '16px 20px', color: '#64748b', fontWeight: '700' }}>#{u.id}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: '700', color: '#ffffff' }}>{u.fullname}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{u.email}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', borderRadius: '12px', background: u.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.2)' : u.role === 'ORGANIZER' ? 'rgba(245, 158, 11, 0.2)' : u.role === 'RECRUITER' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(0, 191, 255, 0.2)', color: u.role === 'ADMIN' ? '#ef4444' : u.role === 'ORGANIZER' ? '#f59e0b' : u.role === 'RECRUITER' ? '#a78bfa' : '#38bdf8' }}>
                    {u.role || 'PLAYER'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  {u.active ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: '600', fontSize: '13px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span> ACTIVE
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: '600', fontSize: '13px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span> SUSPENDED
                    </span>
                  )}
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  {u.active ? (
                    <button
                      onClick={() => handleSuspendUser(u.id)}
                      disabled={actionLoading || u.role === 'ADMIN'}
                      style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontWeight: '600', fontSize: '12px', cursor: u.role === 'ADMIN' ? 'not-allowed' : 'pointer' }}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnsuspendUser(u.id)}
                      disabled={actionLoading}
                      style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Un-suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No users found matching query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersTab;
