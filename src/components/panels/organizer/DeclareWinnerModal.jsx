import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeclareWinnerModal = ({ tournament, onClose, onSuccess }) => {
  const [participants, setParticipants] = useState([]);
  const [playersMap, setPlayersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rank1, setRank1] = useState('');
  const [rank2, setRank2] = useState('');
  const [rank3, setRank3] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tournament) return;
    setLoading(true);
    setError('');

    Promise.allSettled([
      axios.get(`http://localhost:8080/tournament/${tournament.id}/registrations`),
      axios.get('http://localhost:8080/player/all'),
      axios.get('http://localhost:8080/team/all')
    ]).then(([regsRes, playersRes, teamsRes]) => {
      // Build players dictionary
      const pMap = {};
      if (playersRes.status === 'fulfilled' && Array.isArray(playersRes.value.data)) {
        playersRes.value.data.forEach((p) => {
          const key = p.id || p.userId;
          pMap[key] = p;
        });
      }
      setPlayersMap(pMap);

      // Process registrations
      const list = regsRes.status === 'fulfilled' && Array.isArray(regsRes.value.data) ? regsRes.value.data : [];
      setParticipants(list);

      if (list.length > 0) {
        const firstVal = list[0].playerId ? `player_${list[0].playerId}` : (list[0].teamId ? `team_${list[0].teamId}` : '');
        setRank1(firstVal);
      }
    }).catch(() => {
      setParticipants([]);
    }).finally(() => {
      setLoading(false);
    });
  }, [tournament]);

  const getParticipantLabel = (p) => {
    if (p.playerId) {
      const pl = playersMap[p.playerId];
      const name = pl?.gamerTag || pl?.user?.fullname || pl?.user?.username || `Player #${p.playerId}`;
      const rank = pl?.rankName ? ` (${pl.rankName})` : '';
      return `${name}${rank} - Solo Registration`;
    }
    if (p.teamId) {
      return `Squad Team #${p.teamId} - 4v4 Roster`;
    }
    return `Applicant #${p.id}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // 1. Submit Rank 1
      if (rank1) {
        const [type, id] = rank1.split('_');
        const param = type === 'team' ? `teamId=${id}` : `playerId=${id}`;
        await axios.post(`http://localhost:8080/tournament/${tournament.id}/enter-result?${param}&placement=1`);
      }

      // 2. Submit Rank 2 (if selected)
      if (rank2 && rank2 !== rank1) {
        const [type, id] = rank2.split('_');
        const param = type === 'team' ? `teamId=${id}` : `playerId=${id}`;
        await axios.post(`http://localhost:8080/tournament/${tournament.id}/enter-result?${param}&placement=2`);
      }

      // 3. Submit Rank 3 (if selected)
      if (rank3 && rank3 !== rank1 && rank3 !== rank2) {
        const [type, id] = rank3.split('_');
        const param = type === 'team' ? `teamId=${id}` : `playerId=${id}`;
        await axios.post(`http://localhost:8080/tournament/${tournament.id}/enter-result?${param}&placement=3`);
      }

      // 4. Complete tournament & trigger XP distribution
      await axios.patch(`http://localhost:8080/tournament/${tournament.id}/complete`);

      onSuccess(`Tournament completed! 1st Place Champion declared & XP awarded successfully.`);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to record results and complete tournament. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!tournament) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1c1c1c', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '24px', padding: '36px', maxWidth: '540px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '22px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏆 Declare Tournament Winners
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#10b981', fontSize: '13px' }}>
              {tournament.name || tournament.title} &bull; Prize Pool: ₹{tournament.prizePool?.toLocaleString()}
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>Loading registered participants...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 18px 0', lineHeight: '1.5' }}>
              Select the final standings from tournament participants. The <strong>1st Place Champion</strong> receives <strong>500 XP</strong> & Champion Badge! All other participants receive <strong>100 XP</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {/* Rank 1 */}
              <div>
                <label style={{ display: 'block', color: '#10b981', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>
                  🥇 1st Place (Tournament Champion) *
                </label>
                <select
                  required
                  value={rank1}
                  onChange={(e) => setRank1(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid #10b981', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}
                >
                  <option value="">-- Select 1st Place Winner --</option>
                  {participants.length > 0 ? (
                    participants.map((p) => {
                      const val = p.playerId ? `player_${p.playerId}` : `team_${p.teamId}`;
                      return <option key={p.id} value={val}>{getParticipantLabel(p)}</option>;
                    })
                  ) : (
                    Object.values(playersMap).map((pl) => (
                      <option key={pl.id || pl.userId} value={`player_${pl.id || pl.userId}`}>
                        {pl.gamerTag || pl.user?.fullname || `Player #${pl.id || pl.userId}`} ({pl.rankName || 'Competitor'}) - Solo
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Rank 2 */}
              <div>
                <label style={{ display: 'block', color: '#38bdf8', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  🥈 2nd Place (Runner Up - Optional)
                </label>
                <select
                  value={rank2}
                  onChange={(e) => setRank2(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}
                >
                  <option value="">-- Select 2nd Place (Optional) --</option>
                  {participants.length > 0 ? (
                    participants.filter(p => (p.playerId ? `player_${p.playerId}` : `team_${p.teamId}`) !== rank1).map((p) => {
                      const val = p.playerId ? `player_${p.playerId}` : `team_${p.teamId}`;
                      return <option key={p.id} value={val}>{getParticipantLabel(p)}</option>;
                    })
                  ) : (
                    Object.values(playersMap).filter(pl => `player_${pl.id || pl.userId}` !== rank1).map((pl) => (
                      <option key={pl.id || pl.userId} value={`player_${pl.id || pl.userId}`}>
                        {pl.gamerTag || pl.user?.fullname || `Player #${pl.id || pl.userId}`}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Rank 3 */}
              <div>
                <label style={{ display: 'block', color: '#f59e0b', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  🥉 3rd Place (Third Place - Optional)
                </label>
                <select
                  value={rank3}
                  onChange={(e) => setRank3(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}
                >
                  <option value="">-- Select 3rd Place (Optional) --</option>
                  {participants.length > 0 ? (
                    participants.filter(p => {
                      const val = p.playerId ? `player_${p.playerId}` : `team_${p.teamId}`;
                      return val !== rank1 && val !== rank2;
                    }).map((p) => {
                      const val = p.playerId ? `player_${p.playerId}` : `team_${p.teamId}`;
                      return <option key={p.id} value={val}>{getParticipantLabel(p)}</option>;
                    })
                  ) : (
                    Object.values(playersMap).filter(pl => {
                      const val = `player_${pl.id || pl.userId}`;
                      return val !== rank1 && val !== rank2;
                    }).map((pl) => (
                      <option key={pl.id || pl.userId} value={`player_${pl.id || pl.userId}`}>
                        {pl.gamerTag || pl.user?.fullname || `Player #${pl.id || pl.userId}`}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                style={{ padding: '12px 20px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#94a3b8', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !rank1}
                className="action-btn-success"
                style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', color: '#fff', fontWeight: '700', borderRadius: '10px', cursor: 'pointer' }}
              >
                {submitting ? 'Awarding XP...' : '🏁 Confirm Winner & Award XP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default DeclareWinnerModal;
