import React, { useState } from 'react';
import axios from 'axios';

const RaiseDisputeModal = ({ tournament, userId, onClose, onSuccess }) => {
  const [category, setCategory] = useState('Cheating / Emulator Abuse');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!tournament) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) {
      setError('Please provide specific details about your dispute.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const fullDescription = `[${category}] ${details.trim()}`;
      await axios.post(`http://localhost:8080/tournament/${tournament.id || tournament.tournamentId}/dispute`, null, {
        params: {
          userId: userId || 1,
          description: fullDescription
        }
      });

      onSuccess(`Dispute submitted successfully to the tournament organizer!`);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to submit dispute. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#1c1c1c', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '24px', padding: '36px', maxWidth: '520px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.9)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ Raise Tournament Dispute
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#ef4444', fontSize: '13px', fontWeight: '500' }}>
              {tournament.name || tournament.tournamentName || `Tournament #${tournament.id || tournament.tournamentId}`}
            </p>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            
            {/* Category Select */}
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Dispute Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '14px', outline: 'none' }}
              >
                <option value="Cheating / Emulator Abuse">Cheating / Emulator / Third-Party Abuse</option>
                <option value="Incorrect Placement / Results">Incorrect Match Placements / Standings</option>
                <option value="Prize Pool Payout Issue">Prize Pool / Reward Distribution Issue</option>
                <option value="Room Credentials / Lobby Mismatch">Match Room Credentials / Access Issue</option>
                <option value="Host Misconduct / Rule Violation">Host Misconduct / Unfair Disqualification</option>
                <option value="Other Contest / Grievance">Other Grievance / Rule Dispute</option>
              </select>
            </div>

            {/* Evidence & Details */}
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                Description & Match Evidence *
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain the incident with match round, player gamertags, screenshots / video links, or specific timestamps..."
                style={{ width: '100%', padding: '12px 16px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff', fontSize: '13px', resize: 'vertical', outline: 'none' }}
              />
            </div>
          </div>

          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 20px 0', lineHeight: '1.4' }}>
            🔒 This dispute will be forwarded directly to the tournament host's <strong>Disputes Hub</strong> and flagged for platform moderation.
          </p>

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
              disabled={submitting || !details.trim()}
              className="action-btn-danger"
              style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', border: 'none', color: '#fff', fontWeight: '700', borderRadius: '10px', cursor: 'pointer' }}
            >
              {submitting ? 'Submitting Dispute...' : '⚠️ Submit Official Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaiseDisputeModal;
