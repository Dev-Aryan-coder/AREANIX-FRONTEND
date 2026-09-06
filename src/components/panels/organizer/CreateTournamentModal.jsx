import React from 'react';

const CreateTournamentModal = ({
  show,
  onClose,
  tournamentForm,
  setTournamentForm,
  onSubmit
}) => {
  if (!show) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1c1c1c', border: '1px solid rgba(0, 191, 255, 0.4)', borderRadius: '24px', padding: '36px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '22px', fontWeight: '600' }}>Host New Tournament</h2>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '22px', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Tournament Name *</label>
              <input
                type="text"
                required
                value={tournamentForm.name}
                onChange={(e) => setTournamentForm({ ...tournamentForm, name: e.target.value })}
                placeholder="e.g. Areanix Masters Invitational Season 1"
                style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Game *</label>
                <select
                  value={tournamentForm.game}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, game: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
                >
                  <option value="BGMI">BGMI</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Free Fire">Free Fire</option>
                  <option value="CS2">CS2</option>
                  <option value="Call of Duty">Call of Duty</option>
                  <option value="Pokemon UNITE">Pokemon UNITE</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Prize Pool (₹) *</label>
                <input
                  type="number"
                  required
                  value={tournamentForm.prizePool}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, prizePool: e.target.value })}
                  style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Format</label>
                <input
                  type="text"
                  value={tournamentForm.format}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, format: e.target.value })}
                  placeholder="e.g. 5v5 Single Elimination"
                  style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Region *</label>
                <input
                  type="text"
                  required
                  value={tournamentForm.region}
                  onChange={(e) => setTournamentForm({ ...tournamentForm, region: e.target.value })}
                  placeholder="e.g. Asia / India"
                  style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Live Stream Link (YouTube / Twitch)</label>
              <input
                type="url"
                value={tournamentForm.streamLink}
                onChange={(e) => setTournamentForm({ ...tournamentForm, streamLink: e.target.value })}
                placeholder="https://youtube.com/live/..."
                style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Tournament Rules & Guidelines</label>
              <textarea
                rows={3}
                value={tournamentForm.rules}
                onChange={(e) => setTournamentForm({ ...tournamentForm, rules: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px', resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '28px' }}>
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
              Launch Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentModal;
