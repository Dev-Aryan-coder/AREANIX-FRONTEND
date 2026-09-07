import React from 'react';

const TournamentActivityTab = ({
  tournamentSubTab,
  setTournamentSubTab,
  upcomingTournaments = [],
  tournamentHistory = [],
  liveTournaments = [],
  registrationsList = [],
  playerTeamInfo = null,
  handleRegisterTournament,
  registeringId,
  tournamentActionMsg,
  onRaiseDispute
}) => {
  return (
    <div style={{ background: '#161a22', border: '1px solid rgba(0, 191, 255, 0.25)', borderRadius: '24px', padding: '36px', boxShadow: '12px 12px 30px rgba(0,0,0,0.85), -6px -6px 20px rgba(255,255,255,0.03)' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', color: '#ffffff', margin: '0 0 6px 0', fontWeight: '400' }}>
          Tournament Activity
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          View upcoming tournaments, apply for competitions, check match brackets, and track registration status.
        </p>
      </div>

      {/* Action Notification Banner */}
      {tournamentActionMsg && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 20px',
          borderRadius: '12px',
          background: 'rgba(0, 191, 255, 0.15)',
          border: '1px solid #00bfff',
          color: '#00bfff',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>✦</span>
          <span>{tournamentActionMsg}</span>
        </div>
      )}

      {/* 4 Sub-Tab Filter Navigation Buttons */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '16px' }}>
        <button
          type="button"
          onClick={() => setTournamentSubTab('upcoming')}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: tournamentSubTab === 'upcoming' ? '1px solid rgba(0, 191, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            background: tournamentSubTab === 'upcoming' ? '#1c2330' : '#12151c',
            color: tournamentSubTab === 'upcoming' ? '#00bfff' : '#94a3b8',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '13px',
            fontWeight: tournamentSubTab === 'upcoming' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          1. Upcoming Tournaments ({upcomingTournaments.length})
        </button>

        <button
          type="button"
          onClick={() => setTournamentSubTab('history')}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: tournamentSubTab === 'history' ? '1px solid rgba(0, 191, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            background: tournamentSubTab === 'history' ? '#1c2330' : '#12151c',
            color: tournamentSubTab === 'history' ? '#00bfff' : '#94a3b8',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '13px',
            fontWeight: tournamentSubTab === 'history' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          2. Tournament History ({tournamentHistory.length})
        </button>

        <button
          type="button"
          onClick={() => setTournamentSubTab('live')}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: tournamentSubTab === 'live' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            background: tournamentSubTab === 'live' ? 'rgba(16, 185, 129, 0.15)' : '#12151c',
            color: tournamentSubTab === 'live' ? '#10b981' : '#94a3b8',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '13px',
            fontWeight: tournamentSubTab === 'live' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          3. Live Tournaments ({liveTournaments.length})
        </button>

        <button
          type="button"
          onClick={() => setTournamentSubTab('registrations')}
          style={{
            padding: '10px 18px',
            borderRadius: '12px',
            border: tournamentSubTab === 'registrations' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
            background: tournamentSubTab === 'registrations' ? 'rgba(245, 158, 11, 0.15)' : '#12151c',
            color: tournamentSubTab === 'registrations' ? '#f59e0b' : '#94a3b8',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '13px',
            fontWeight: tournamentSubTab === 'registrations' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          4. My Registrations ({registrationsList.length})
        </button>
      </div>

      {/* Sub-Tab 1: Upcoming Tournaments & Apply Button */}
      {tournamentSubTab === 'upcoming' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#ffffff', margin: '0 0 16px 0', fontWeight: '500' }}>
            Available Upcoming Tournaments
          </h3>
          {upcomingTournaments.length === 0 ? (
            <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>No upcoming tournaments currently scheduled.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {upcomingTournaments.map((t) => {
                const userRegistration = registrationsList.find((r) => r.tournamentId === t.id);
                const isRegistered = Boolean(userRegistration);
                const regStatus = userRegistration?.status || 'PENDING';
                const isApproved = regStatus === 'APPROVED';
                const isRejected = regStatus === 'REJECTED';

                return (
                  <div key={t.id} style={{
                    background: '#12151c',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(0, 191, 255, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ background: 'rgba(0, 191, 255, 0.15)', color: '#00bfff', border: '1px solid rgba(0, 191, 255, 0.4)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' }}>
                          {t.game || t.format || 'TOURNAMENT'}
                        </span>
                        <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>● UPCOMING</span>
                      </div>

                      <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 8px 0', fontWeight: '600' }}>
                        {t.name || t.title || `Tournament #${t.id}`}
                      </h4>
                      <p style={{ color: '#00bfff', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#94a3b8' }}>Host:</span>
                        <span style={{ color: '#ffffff', fontWeight: '600' }}>
                          {t.organizer?.organizationName || t.organizer?.user?.fullname || (t.organizerId ? `Organizer #${t.organizerId}` : 'Verified Host')}
                        </span>
                        {t.organizer?.channelVerified && (
                          <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1px 6px', borderRadius: '8px', fontSize: '10px' }}>✓ VERIFIED</span>
                        )}
                      </p>
                      <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
                        Region: <span style={{ color: '#fff' }}>{t.region || 'Asia'}</span> | Prize Pool: <span style={{ color: '#f59e0b', fontWeight: '600' }}>₹{t.prizePool || '10,000'}</span>
                      </p>
                    </div>

                    {/* Registration Status Badge OR Apply Button */}
                    <div style={{ marginTop: '12px' }}>
                      {isRegistered ? (
                        <div style={{
                          padding: '10px',
                          borderRadius: '10px',
                          textAlign: 'center',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: isApproved ? 'rgba(16, 185, 129, 0.15)' : isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isApproved ? '#10b981' : isRejected ? '#ef4444' : '#f59e0b',
                          border: isApproved ? '1px solid #10b981' : isRejected ? '1px solid #ef4444' : '1px solid #f59e0b'
                        }}>
                          {isApproved ? '✓ REGISTRATION APPROVED' : isRejected ? '✕ REGISTRATION REJECTED' : '⏳ APPLICATION PENDING APPROVAL'}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRegisterTournament && handleRegisterTournament(t.id)}
                          disabled={registeringId === t.id}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #00bfff, #0080ff)',
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: '600',
                            cursor: registeringId === t.id ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                            fontFamily: "'Poppins', sans-serif",
                            boxShadow: '0 4px 15px rgba(0, 191, 255, 0.3)',
                            transition: 'all 0.2s ease',
                            opacity: registeringId === t.id ? 0.7 : 1
                          }}
                        >
                          {registeringId === t.id ? 'Submitting Registration...' : 'Apply for Tournament ➔'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 2: Tournament History */}
      {tournamentSubTab === 'history' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#ffffff', margin: '0 0 16px 0', fontWeight: '500' }}>Tournament History & Results</h3>
          {tournamentHistory.length === 0 ? (
            <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>No completed tournament match results logged yet for this player.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tournamentHistory.map((res, idx) => (
                <div key={res.id || idx} style={{ background: '#12151c', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span style={{ background: res.placement === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 191, 255, 0.15)', color: res.placement === 1 ? '#f59e0b' : '#00bfff', border: res.placement === 1 ? '1px solid #f59e0b' : '1px solid #00bfff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginRight: '12px' }}>
                      {res.placement === 1 ? '1ST PLACE CHAMPION' : `PLACEMENT #${res.placement}`}
                    </span>
                    <span style={{ color: '#ffffff', fontSize: '14px', fontWeight: '500' }}>Tournament ID: #{res.tournamentId}</span>
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '12px' }}>Verified Platform Result</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: Live/Ongoing Tournaments */}
      {tournamentSubTab === 'live' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#ffffff', margin: '0 0 16px 0', fontWeight: '500' }}>Live / Ongoing Tournaments</h3>
          {liveTournaments.length === 0 ? (
            <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>No live or ongoing tournaments currently active.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {liveTournaments.map((t) => (
                <div key={t.id} style={{ background: '#12151c', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                    LIVE NOW
                  </span>
                  <h4 style={{ color: '#fff', fontSize: '16px', margin: '10px 0 4px 0', fontWeight: '600' }}>{t.name || t.title || `Live Tournament #${t.id}`}</h4>
                  <p style={{ color: '#00bfff', fontSize: '12px', margin: '0 0 8px 0', fontWeight: '500' }}>
                    <span style={{ color: '#94a3b8' }}>Host:</span> {t.organizer?.organizationName || t.organizer?.user?.fullname || (t.organizerId ? `Organizer #${t.organizerId}` : 'Verified Host')}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 12px 0' }}>Room ID: {t.roomId || 'Locked'} | Room Pass: {t.roomPassword ? '••••' : 'Locked'}</p>
                  <button
                    type="button"
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#10b981', border: 'none', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '13px', fontFamily: "'Poppins', sans-serif" }}
                  >
                    Join Live Match →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 4: Registration Status Tracker */}
      {tournamentSubTab === 'registrations' && (
        <div>
          <h3 style={{ fontSize: '16px', color: '#ffffff', margin: '0 0 16px 0', fontWeight: '500' }}>Registration Status & Applications</h3>
          
          {/* Section A: Manager-Registered Squad Tournaments */}
          {playerTeamInfo?.teamTournaments?.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', color: '#00bfff', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                🏆 SQUAD REGISTRATIONS (ENROLLED BY TEAM MANAGER)
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {playerTeamInfo.teamTournaments.map((t, idx) => {
                  const isApproved = t.status === 'APPROVED';
                  return (
                    <div key={t.registrationId || idx} style={{ background: '#12151c', padding: '16px 20px', borderRadius: '14px', border: isApproved ? '1px solid #10b981' : '1px solid rgba(0, 191, 255, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                          {t.tournamentName || `Tournament #${t.tournamentId}`} (Team: {playerTeamInfo.team?.name || 'Squad'})
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                          Host: <strong style={{ color: '#00bfff' }}>{t.hostName || 'Verified Host'}</strong> &bull; Mode: Squad (4v4)
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '4px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isApproved ? '#10b981' : '#f59e0b',
                          border: isApproved ? '1px solid #10b981' : '1px solid #f59e0b'
                        }}>
                          {isApproved ? '✓ SQUAD APPROVED' : '⏳ PENDING REVIEW'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRaiseDispute && onRaiseDispute({ id: t.tournamentId, name: t.tournamentName })}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          ⚠️ Dispute
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section B: Individual Player Registrations */}
          <div>
            {playerTeamInfo?.teamTournaments?.length > 0 && (
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                INDIVIDUAL REGISTRATIONS
              </span>
            )}
            {registrationsList.length === 0 && (!playerTeamInfo?.teamTournaments || playerTeamInfo.teamTournaments.length === 0) ? (
              <div style={{ background: '#12151c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>No active tournament registration applications found for this player.</p>
              </div>
            ) : registrationsList.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No individual registrations submitted.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {registrationsList.map((reg) => {
                  const isApproved = reg.status === 'APPROVED';
                  const isRejected = reg.status === 'REJECTED';

                  return (
                    <div key={reg.id} style={{ background: '#12151c', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>
                          Tournament Registration ID: #{reg.id} (Tournament #{reg.tournamentId})
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Player ID: {reg.playerId}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '4px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: isApproved ? 'rgba(16, 185, 129, 0.15)' : isRejected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isApproved ? '#10b981' : isRejected ? '#ef4444' : '#f59e0b',
                          border: isApproved ? '1px solid #10b981' : isRejected ? '1px solid #ef4444' : '1px solid #f59e0b'
                        }}>
                          {isApproved ? '✓ APPROVED' : isRejected ? '✕ REJECTED' : '⏳ PENDING APPROVAL'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onRaiseDispute && onRaiseDispute({ id: reg.tournamentId, name: `Tournament #${reg.tournamentId}` })}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          ⚠️ Dispute
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TournamentActivityTab;
