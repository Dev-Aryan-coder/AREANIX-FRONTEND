import React, { useState } from 'react';

const PerformanceTab = ({
  xpData,
  winRate,
  kdRatio,
  totalMatches,
  totalKills,
  statsLoading,
  statsList,
  achievementsList,
  handleRecordStat
}) => {
  const [showAddStatModal, setShowAddStatModal] = useState(false);
  const [newStat, setNewStat] = useState({
    game: 'BGMI',
    kills: '',
    deaths: '',
    wins: '',
    matchesPlayed: '1'
  });

  const onSubmitStat = (e) => {
    e.preventDefault();
    if (handleRecordStat) {
      handleRecordStat(newStat, () => setShowAddStatModal(false));
    }
  };

  return (
    <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85), -6px -6px 20px rgba(255,255,255,0.03)' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
          Performance & Progress
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          Live player progress, XP leveling, match statistics, and auto-generated verified achievements.
        </p>
      </div>

      {/* Section 1: PlayerXP & Leveling */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '15px', color: '#00bfff', margin: '0 0 16px 0', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          1. PLAYER XP & LEVELING (PlayerXP)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#12151c', padding: '22px', borderRadius: '16px', border: '1px solid rgba(0, 191, 255, 0.2)', boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.6)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '500', letterSpacing: '0.5px' }}>TOTAL XP</span>
            <h3 style={{ fontSize: '32px', color: '#00bfff', margin: 0, fontWeight: '600' }}>{xpData.xp} <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400' }}>XP</span></h3>
          </div>
          <div style={{ background: '#12151c', padding: '22px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.2)', boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.6)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '500', letterSpacing: '0.5px' }}>CURRENT LEVEL</span>
            <h3 style={{ fontSize: '32px', color: '#f59e0b', margin: 0, fontWeight: '600' }}>Level {xpData.level}</h3>
          </div>
          <div style={{ background: '#12151c', padding: '22px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)', boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.6)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '500', letterSpacing: '0.5px' }}>GLOBAL XP RANK</span>
            <h3 style={{ fontSize: '32px', color: '#10b981', margin: 0, fontWeight: '600' }}>#{xpData.rank}</h3>
          </div>
        </div>
      </div>

      {/* Section 2: Stat Snapshots */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '15px', color: '#00bfff', margin: '0 0 16px 0', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          2. STAT SNAPSHOTS (Statistics)
        </h3>

        {/* Stat Aggregate Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div style={{ background: '#12151c', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.5)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '500' }}>WIN RATE</span>
            <h4 style={{ fontSize: '28px', color: '#10b981', margin: 0, fontWeight: '600' }}>{winRate}%</h4>
          </div>
          <div style={{ background: '#12151c', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.5)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '500' }}>AVERAGE K/D</span>
            <h4 style={{ fontSize: '28px', color: '#00bfff', margin: 0, fontWeight: '600' }}>{kdRatio}</h4>
          </div>
          <div style={{ background: '#12151c', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.5)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '500' }}>MATCHES PLAYED</span>
            <h4 style={{ fontSize: '28px', color: '#ffffff', margin: 0, fontWeight: '600' }}>{totalMatches}</h4>
          </div>
          <div style={{ background: '#12151c', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.5)' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: '500' }}>TOTAL KILLS</span>
            <h4 style={{ fontSize: '28px', color: '#f59e0b', margin: 0, fontWeight: '600' }}>{totalKills}</h4>
          </div>
        </div>

        {/* Snapshots Log List */}
        {statsLoading ? (
          <p style={{ color: '#94a3b8', fontSize: '13px' }}>Loading statistics from Spring Boot backend...</p>
        ) : statsList.length === 0 ? (
          <div style={{ background: '#12151c', padding: '20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '0 0 6px 0', fontWeight: '500' }}>No Verified Match Stat Snapshots Recorded Yet</p>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Statistics are recorded automatically when tournament organizers or match engines submit verified results. Players cannot self-report or fake stats.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {statsList.map((st, idx) => {
              let parsedSnap = {};
              try {
                parsedSnap = typeof st.statSnapshot === 'string' ? JSON.parse(st.statSnapshot) : st.statSnapshot;
              } catch (e) {}

              return (
                <div key={st.id || idx} style={{ background: '#12151c', padding: '14px 18px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid rgba(0, 191, 255, 0.4)', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', fontWeight: '500', marginRight: '10px' }}>
                      {st.game || 'BGMI'}
                    </span>
                    <span style={{ color: '#cbd5e1', fontSize: '13px' }}>
                      Kills: <strong style={{ color: '#fff' }}>{parsedSnap.kills || 0}</strong> | Deaths: <strong style={{ color: '#fff' }}>{parsedSnap.deaths || 0}</strong> | Wins: <strong style={{ color: '#10b981' }}>{parsedSnap.wins || 0}</strong> | Matches: <strong style={{ color: '#fff' }}>{parsedSnap.matchesPlayed || 1}</strong>
                    </span>
                  </div>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>
                    {st.recordedAt ? new Date(st.recordedAt).toLocaleString() : 'Recently Recorded'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 3: Verified Achievements */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '15px', color: '#00bfff', margin: 0, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            3. VERIFIED ACHIEVEMENTS (Achievement)
          </h3>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px' }}>
            AUTO-GENERATED • NEVER SELF-REPORTED (HIGH TRUST WEIGHT)
          </span>
        </div>

        {achievementsList.length === 0 ? (
          <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '0 0 6px 0', fontWeight: '500' }}>No Verified Tournament Achievements Yet</p>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Achievements are auto-awarded by the backend server upon winning or placing top 3 in official Areanix platform tournaments. Players cannot self-report achievements.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {achievementsList.map((ach, idx) => (
              <div key={ach.id || idx} style={{ background: '#12151c', padding: '20px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ color: '#ffffff', margin: 0, fontSize: '16px', fontWeight: '600' }}>{ach.title || 'Tournament Award'}</h4>
                    <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Official Tournament Verification</span>
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{ach.description || 'Awarded for exceptional tournament performance.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Stat Snapshot Modal */}
      {showAddStatModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.35)', borderRadius: '24px', width: '100%', maxWidth: '440px', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.9)', fontFamily: "'Poppins', sans-serif" }}>
            <h3 style={{ color: '#ffffff', margin: '0 0 8px 0', fontSize: '22px', fontWeight: '500' }}>Record Match Stat Snapshot</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px 0' }}>Saves directly to MySQL database via `POST /player/{'{id}'}/statistics`</p>

            <form onSubmit={onSubmitStat} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Game Title</label>
                <select
                  value={newStat.game}
                  onChange={(e) => setNewStat({ ...newStat, game: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#12151c', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}
                >
                  <option value="BGMI">BGMI</option>
                  <option value="FREE FIRE">FREE FIRE</option>
                  <option value="VALORANT">VALORANT</option>
                  <option value="CS2">CS2</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Kills</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 12"
                    value={newStat.kills}
                    onChange={(e) => setNewStat({ ...newStat, kills: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#12151c', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Deaths</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    value={newStat.deaths}
                    onChange={(e) => setNewStat({ ...newStat, deaths: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#12151c', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Wins</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1"
                    value={newStat.wins}
                    onChange={(e) => setNewStat({ ...newStat, wins: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#12151c', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Matches Played</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 1"
                    value={newStat.matchesPlayed}
                    onChange={(e) => setNewStat({ ...newStat, matchesPlayed: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#12151c', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStatModal(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#12151c', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #00bfff, #0055ff)', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '14px' }}
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceTab;
