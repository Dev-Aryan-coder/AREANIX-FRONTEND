import React from 'react';

const RecruiterTab = ({
  isOnline,
  shortlistCount,
  recruiterInvites,
  playerTeamInfo,
  activeRecruiters,
  recruiterMessage,
  handleAcceptRecruiterInvite,
  handleDeclineRecruiterInvite,
  handleApplyToRecruiter
}) => {
  return (
    <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85), -6px -6px 20px rgba(255,255,255,0.03)' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
          Recruiter Visibility & Recruitment Hub
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          Manage recruiter discovery, view shortlists, respond to incoming team invitations, and apply to active esports scouts.
        </p>
      </div>

      {/* Toast Feedback */}
      {recruiterMessage && (
        <div style={{ background: 'rgba(0, 191, 255, 0.15)', border: '1px solid #00bfff', color: '#00bfff', padding: '12px 18px', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>{recruiterMessage}</span>
        </div>
      )}

      {/* Section 1: Motivational Metrics Cards (3 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '36px' }}>
        
        {/* Card 1: Shortlists Metric */}
        <div style={{ background: '#12151c', padding: '22px', borderRadius: '18px', border: '1px solid rgba(0, 191, 255, 0.3)', boxShadow: '0 4px 18px rgba(0,0,0,0.4)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            SHORTLISTED BY RECRUITERS
          </span>
          <h3 style={{ fontSize: '32px', color: '#00bfff', margin: 0, fontWeight: '700' }}>
            {shortlistCount} <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: '400' }}>Scouts</span>
          </h3>
          <p style={{ fontSize: '12px', color: '#10b981', margin: '8px 0 0 0', fontWeight: '500' }}>
            {shortlistCount > 0 ? `${shortlistCount} teams have shortlisted your player profile!` : 'Turn on Lobby to get shortlisted'}
          </p>
        </div>

        {/* Card 2: Received Invites Metric */}
        <div style={{ background: '#12151c', padding: '22px', borderRadius: '18px', border: '1px solid rgba(245, 158, 11, 0.25)', boxShadow: '0 4px 18px rgba(0,0,0,0.4)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            TEAM INVITES RECEIVED
          </span>
          <h3 style={{ fontSize: '32px', color: '#f59e0b', margin: 0, fontWeight: '700' }}>
            {recruiterInvites.length} <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: '400' }}>Offers</span>
          </h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 0 0' }}>
            From verified esports team managers
          </p>
        </div>

        {/* Card 3: Lobby Availability */}
        <div style={{ background: '#12151c', padding: '22px', borderRadius: '18px', border: isOnline ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 4px 18px rgba(0,0,0,0.4)' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            SCOUTING VISIBILITY
          </span>
          <h3 style={{ fontSize: '24px', color: isOnline ? '#10b981' : '#ef4444', margin: 0, fontWeight: '700' }}>
            {isOnline ? 'DISCOVERABLE' : 'HIDDEN'}
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '8px 0 0 0' }}>
            {isOnline ? 'Active on Global Recruiter Feeds' : 'Turn status to Online to appear in feeds'}
          </p>
        </div>

      </div>

      {/* Section 2: Incoming Recruiter & Team Invites */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '15px', color: '#00bfff', margin: 0, fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
            INCOMING RECRUITMENT INVITES
          </h3>
          <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid rgba(0, 191, 255, 0.4)', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
            {recruiterInvites.length} TOTAL
          </span>
        </div>

        {recruiterInvites.length === 0 ? (
          <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '0 0 4px 0', fontWeight: '500' }}>No Incoming Recruiter Invites Currently</p>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Ensure your Lobby Status is set to ONLINE to receive roster invitations from team scouts.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recruiterInvites.map((inv) => {
              const isPending = inv.status === 'PENDING';
              const isAccepted = inv.status === 'ACCEPTED';
              const isDeclined = inv.status === 'DECLINED';

              // Look up recruiter organization details from activeRecruiters list
              const recObj = activeRecruiters.find(
                (r) => Number(r.id) === Number(inv.recruiterId) || Number(r.userId) === Number(inv.recruiterId)
              );
              const orgName = recObj?.organizationName || recObj?.user?.fullname || `Recruiter Org #${inv.recruiterId}`;
              const scoutName = recObj?.user?.fullname && recObj.user.fullname !== orgName ? recObj.user.fullname : null;

              return (
                <div
                  key={inv.id}
                  style={{
                    background: '#12151c',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 191, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid #f59e0b', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>
                        TEAM INVITATION #{inv.id}
                      </span>
                      {recObj?.region && (
                        <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid rgba(0, 191, 255, 0.4)', padding: '2px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>
                          {recObj.region}
                        </span>
                      )}
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                        Sent: {inv.createdAt ? new Date(inv.createdAt).toLocaleString() : 'Recently'}
                      </span>
                    </div>

                    <h4 style={{ color: '#ffffff', margin: 0, fontSize: '17px', fontWeight: '600' }}>
                      Official Roster Offer from <span style={{ color: '#00bfff' }}>{orgName}</span>
                    </h4>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                      {scoutName && (
                        <span style={{ color: '#cbd5e1', fontSize: '13px' }}>
                          Scout: <strong style={{ color: '#fff' }}>{scoutName}</strong>
                        </span>
                      )}
                      {recObj?.gamesRecruiting && (
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                          Games: <span style={{ color: '#10b981' }}>{recObj.gamesRecruiting}</span>
                        </span>
                      )}
                      <span style={{ color: '#94a3b8', fontSize: '13px' }}>
                        Status: <strong style={{ color: isAccepted ? '#10b981' : isDeclined ? '#ef4444' : '#f59e0b' }}>{inv.status || 'PENDING'}</strong>
                      </span>
                    </div>
                  </div>

                  {isPending ? (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleAcceptRecruiterInvite(inv.id)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          border: 'none',
                          color: '#ffffff',
                          fontWeight: '600',
                          fontSize: '13px',
                          cursor: 'pointer',
                          fontFamily: "'Poppins', sans-serif",
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        Accept Offer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeclineRecruiterInvite(inv.id)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '12px',
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
                  ) : (
                    <span style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      background: isAccepted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: isAccepted ? '#10b981' : '#ef4444',
                      border: isAccepted ? '1px solid #10b981' : '1px solid #ef4444'
                    }}>
                      {isAccepted ? 'OFFER ACCEPTED' : 'OFFER DECLINED'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 3: Joined Team Summary */}
      <div style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '15px', color: '#00bfff', margin: '0 0 16px 0', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          CURRENT TEAM AFFILIATION
        </h3>

        {!playerTeamInfo?.hasTeam || !playerTeamInfo?.team ? (
          <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <h4 style={{ color: '#ffffff', fontSize: '16px', margin: '0 0 6px 0', fontWeight: '500' }}>Free Agent (Not Currently In A Team)</h4>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Apply to active recruiting teams below or accept incoming recruiter invitations to join a squad.
            </p>
          </div>
        ) : (
          <div style={{ background: '#12151c', padding: '24px', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px' }}>
                  OFFICIALLY JOINED
                </span>
                <h3 style={{ fontSize: '24px', color: '#ffffff', margin: '8px 0 4px 0', fontWeight: '600' }}>
                  {playerTeamInfo.team.name || `Team #${playerTeamInfo.team.id}`}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
                  Region: <strong style={{ color: '#fff' }}>{playerTeamInfo.team.region || 'Asia'}</strong> &bull; Game: <strong style={{ color: '#00bfff' }}>{playerTeamInfo.team.game || 'BGMI'}</strong>
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>TEAM SQUAD SIZE</span>
                <strong style={{ color: '#00bfff', fontSize: '18px' }}>{playerTeamInfo.roster?.length || 1} Players</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 4: Active Recruiting Teams & Scouts */}
      <div>
        <h3 style={{ fontSize: '15px', color: '#00bfff', margin: '0 0 16px 0', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
          ACTIVE RECRUITING ORGANIZATIONS & SCOUTS
        </h3>

        {activeRecruiters.length === 0 ? (
          <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>No active recruiting organizations listed right now.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {activeRecruiters.map((rec) => (
              <div key={rec.id} style={{ background: '#12151c', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid rgba(0, 191, 255, 0.4)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '700' }}>
                      {rec.region || 'Asia'}
                    </span>
                    <span style={{ color: '#10b981', fontSize: '11px', fontWeight: '600' }}>RECRUITING NOW</span>
                  </div>
                  <h4 style={{ color: '#ffffff', fontSize: '18px', margin: '0 0 6px 0', fontWeight: '600' }}>
                    {rec.organizationName || `Esports Org #${rec.id}`}
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 14px 0' }}>
                    {rec.user?.fullname && <span>Scout: <strong style={{ color: '#fff' }}>{rec.user.fullname}</strong> &bull; </span>}
                    {rec.gamesRecruiting && <span style={{ color: '#00bfff' }}>{rec.gamesRecruiting}</span>}
                    {rec.websiteUrl && <span style={{ color: '#94a3b8' }}> &bull; {rec.websiteUrl}</span>}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyToRecruiter(rec.id)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #00bfff, #0055ff)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: '0 4px 14px rgba(0, 191, 255, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Apply to Roster
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default RecruiterTab;
