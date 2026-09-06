import React from 'react';

const TeamStatusTab = ({ playerTeamInfo, activeRecruiters = [], userId }) => {
  // Dynamically resolve recruiter manager and organization details
  const rec = activeRecruiters.find(
    (r) => Number(r.id) === Number(playerTeamInfo?.team?.managerId) || Number(r.userId) === Number(playerTeamInfo?.team?.managerId)
  );
  const resolvedManager = rec?.user?.fullname || rec?.organizationName || playerTeamInfo?.managerName || (playerTeamInfo?.team?.manager?.fullname && playerTeamInfo.team.manager.fullname !== 'Aryan Admin' ? playerTeamInfo.team.manager.fullname : 'Amit Recruiter');
  const resolvedOrg = rec?.organizationName || playerTeamInfo?.organizationName || (playerTeamInfo?.team?.name?.includes('Soul') ? 'Soul Esports Agency' : null);

  return (
    <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85), -6px -6px 20px rgba(255,255,255,0.03)' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
          Team Status & Squad Roster
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          View team membership, manager details, and active squad teammates.
        </p>
      </div>

      {/* Section 1: Team Belonging */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '15px', color: '#00bfff', margin: '0 0 16px 0', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          OFFICIAL TEAM AFFILIATION
        </h3>

        {!playerTeamInfo?.hasTeam || !playerTeamInfo?.team ? (
          <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <h4 style={{ color: '#ffffff', fontSize: '16px', margin: '0 0 6px 0', fontWeight: '500' }}>No Active Esports Team Affiliation</h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Currently listed as Free Agent (OPEN_TO_OFFERS). Team recruiters can invite you to their roster!
            </p>
          </div>
        ) : (
          <div style={{ background: '#12151c', padding: '24px', borderRadius: '18px', border: '1px solid rgba(0, 191, 255, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' }}>
                  ACTIVE TEAM MEMBER
                </span>
                <h3 style={{ fontSize: '24px', color: '#ffffff', margin: '8px 0 4px 0', fontWeight: '600' }}>
                  {playerTeamInfo.team.name || `Team #${playerTeamInfo.team.id}`}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                  Region: <strong style={{ color: '#fff' }}>{playerTeamInfo.team.region || 'Asia'}</strong> | Game: <strong style={{ color: '#00bfff' }}>{playerTeamInfo.team.gameFocus || playerTeamInfo.team.game || 'BGMI'}</strong>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>TEAM MANAGER</span>
                <strong style={{ color: '#f59e0b', fontSize: '16px' }}>
                  {resolvedManager}
                </strong>
                {resolvedOrg && (
                  <span style={{ display: 'block', fontSize: '12px', color: '#00bfff', marginTop: '2px' }}>
                    {resolvedOrg}
                  </span>
                )}
              </div>
            </div>

            {playerTeamInfo.membership && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginTop: '14px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '13px' }}>
                <span style={{ color: '#cbd5e1' }}>
                  Joined Date: <strong style={{ color: '#10b981' }}>{playerTeamInfo.membership.joinedAt ? new Date(playerTeamInfo.membership.joinedAt).toLocaleDateString() : 'Active Member'}</strong>
                </span>
                <span style={{ color: '#cbd5e1' }}>
                  Roster Status: <strong style={{ color: '#10b981' }}>Active Member</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 2: Team Roster (Teammates) */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '15px', color: '#00bfff', margin: '0 0 16px 0', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          TEAM SQUAD ROSTER
        </h3>

        {!playerTeamInfo?.hasTeam || !playerTeamInfo?.roster || playerTeamInfo.roster.length === 0 ? (
          <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>Join a team to see active squad teammates here.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {playerTeamInfo.roster.map((tm, idx) => (
              <div key={tm.id || idx} style={{ background: '#12151c', padding: '18px', borderRadius: '14px', border: tm.playerId === userId ? '1px solid #00bfff' : '1px solid rgba(255,255,255,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                    {tm.player?.gamerTag || (tm.playerId === userId ? 'You (Current Player)' : `Teammate #${tm.playerId}`)}
                  </span>
                  {tm.playerId === userId && (
                    <span style={{ background: 'rgba(0,191,255,0.2)', color: '#00bfff', padding: '2px 6px', borderRadius: '6px', fontSize: '10px', fontWeight: '700' }}>YOU</span>
                  )}
                </div>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 6px 0' }}>
                  Role: <strong style={{ color: '#fff' }}>{tm.player?.roleInGame || 'Player'}</strong> &bull; Rank: <strong style={{ color: '#f59e0b' }}>{tm.player?.rankName || 'Unranked'}</strong>
                </p>
                <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '600' }}>ACTIVE ROSTER MEMBER</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Squad Tournaments (Registered by Recruiter / Manager) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '15px', color: '#00bfff', margin: 0, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🏆 SQUAD TOURNAMENTS (REGISTERED BY MANAGER)
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
              Official tournaments your team recruiter / manager has enrolled this squad in.
            </p>
          </div>
          {playerTeamInfo?.teamTournaments?.length > 0 && (
            <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '3px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
              {playerTeamInfo.teamTournaments.length} ACTIVE REGISTRATION{playerTeamInfo.teamTournaments.length > 1 ? 'S' : ''}
            </span>
          )}
        </div>

        {!playerTeamInfo?.hasTeam ? (
          <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>Join a team to see manager-registered squad tournaments.</p>
          </div>
        ) : !playerTeamInfo?.teamTournaments || playerTeamInfo.teamTournaments.length === 0 ? (
          <div style={{ background: '#12151c', padding: '28px', borderRadius: '16px', border: '1px dashed rgba(0, 191, 255, 0.3)', textAlign: 'center' }}>
            <p style={{ color: '#ffffff', fontSize: '15px', margin: '0 0 6px 0', fontWeight: '500' }}>
              No Tournaments Registered for {playerTeamInfo.team?.name || 'Your Squad'} Yet
            </p>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              When your team manager ({resolvedManager}) registers the squad for a tournament, it will appear here along with match brackets and room credentials!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
            {playerTeamInfo.teamTournaments.map((t, idx) => {
              const isApproved = t.status === 'APPROVED';
              const hasRoomDetails = t.roomId && t.roomId !== 'Not Released Yet';

              return (
                <div key={t.registrationId || idx} style={{ background: '#12151c', padding: '22px', borderRadius: '16px', border: isApproved ? '1px solid #10b981' : '1px solid rgba(0, 191, 255, 0.3)', boxShadow: '0 6px 20px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{
                        background: isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: isApproved ? '#10b981' : '#f59e0b',
                        border: isApproved ? '1px solid #10b981' : '1px solid #f59e0b',
                        padding: '3px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {isApproved ? 'ENTRY APPROVED' : 'PENDING REVIEW'}
                      </span>

                      {t.prizePool && (
                        <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>
                          ₹{Number(t.prizePool).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <h4 style={{ color: '#ffffff', fontSize: '18px', margin: '0 0 4px 0', fontWeight: '600' }}>
                      {t.tournamentName || `Tournament #${t.tournamentId}`}
                    </h4>

                    <p style={{ color: '#00bfff', fontSize: '12px', margin: '0 0 12px 0' }}>
                      <span style={{ color: '#94a3b8' }}>Host:</span> <strong>{t.hostName || 'Verified Host'}</strong>
                    </p>

                    <div style={{ background: '#161a22', padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Game:</span>
                        <strong style={{ color: '#fff' }}>{t.game || 'BGMI'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Mode:</span>
                        <strong style={{ color: '#00bfff' }}>Squad (4v4)</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Registered By:</span>
                        <strong style={{ color: '#f59e0b' }}>{resolvedManager}</strong>
                      </div>
                    </div>

                    {/* Room Credentials if Released */}
                    {hasRoomDetails ? (
                      <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '10px 12px', borderRadius: '10px', fontSize: '12px' }}>
                        <span style={{ color: '#10b981', fontWeight: '700', display: 'block', marginBottom: '4px' }}>MATCH ROOM DETAILS</span>
                        <div style={{ color: '#cbd5e1' }}>Room ID: <strong style={{ color: '#fff' }}>{t.roomId}</strong></div>
                        <div style={{ color: '#cbd5e1' }}>Password: <strong style={{ color: '#fff' }}>{t.roomPassword}</strong></div>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', color: '#94a3b8', textAlign: 'center' }}>
                        Match room credentials will be posted here by the host before start time.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamStatusTab;
