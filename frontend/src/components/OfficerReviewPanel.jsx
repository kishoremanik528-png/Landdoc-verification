import React, { useState } from 'react';
import { UserCheck, CheckCircle2, XCircle, AlertTriangle, Send, MessageSquare } from 'lucide-react';
import { submitOfficerReview } from '../services/api';

const OfficerReviewPanel = ({ appId, currentStatus, onReviewSubmitted, officer }) => {
  const [officerName, setOfficerName] = useState(officer?.name || 'Kishore Manik');
  const [officerId, setOfficerId] = useState(officer?.officer_id || 'OFF-TN-9081');
  const [decision, setDecision] = useState('APPROVED');
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [notificationResult, setNotificationResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitOfficerReview(appId, {
        officer_name: officerName,
        officer_id: officerId,
        decision,
        comments,
        findings_accepted: decision === 'APPROVED',
        findings_overridden: decision !== 'APPROVED'
      });
      if (res.success) {
        setReviewed(true);
        setNotificationResult({
          sent: res.request_accepted || res.notification_sent || false,
          message: res.sms_message || null,
          error: res.notification_error || null
        });
        if (onReviewSubmitted) onReviewSubmitted(res.application_status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gov-card" style={{ border: '2px solid #BFDBFE' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ backgroundColor: '#0B3D91', padding: '0.6rem', borderRadius: '10px' }}>
          <UserCheck size={24} color="#FFFFFF" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>Authorized Officer Human-in-the-Loop Review</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>AI recommendations are decision support. Final legal authorization rests with the human officer.</p>
        </div>
      </div>

      {reviewed ? (
        <div style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' }}>
          <CheckCircle2 size={28} color="#16A34A" style={{ margin: '0 auto 0.5rem' }} />
          <h4 style={{ color: '#166534', fontWeight: 800, fontSize: '1.1rem' }}>Officer Review Decision Saved</h4>
          <p style={{ fontSize: '0.85rem', color: '#1E293B', marginTop: '0.2rem' }}>
            Decision '<strong>{decision}</strong>' successfully recorded under Officer {officerName} ({officerId}).
          </p>

          {/* SMS Notification Status */}
          {notificationResult && (
            <div style={{
              marginTop: '0.85rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: notificationResult.sent ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${notificationResult.sent ? '#BBF7D0' : '#FECACA'}`,
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={16} color={notificationResult.sent ? '#16A34A' : '#DC2626'} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: notificationResult.sent ? '#166534' : '#991B1B' }}>
                  {notificationResult.sent 
                    ? '✓ SMS notification request submitted successfully.' 
                    : '⚠ Application updated successfully, but SMS notification could not be sent.'}
                </span>
              </div>
              {notificationResult.error && (
                <span style={{ fontSize: '0.75rem', color: '#DC2626' }}>
                  Details: {notificationResult.error}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Officer Name</label>
              <input
                type="text"
                className="form-input"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Officer ID / Designation</label>
              <input
                type="text"
                className="form-input"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Original Documents Review Row */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
              Original Submitted Documents:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['Sale Deed', 'Patta Copy', 'Chitta Extract', 'Encumbrance Certificate (EC)'].map((docName, idx) => (
                <span key={idx} className="badge badge-info" style={{ fontSize: '0.75rem', cursor: 'pointer' }}>
                  📄 View {docName}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Official Decision Action</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn ${decision === 'APPROVED' ? 'btn-success' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => setDecision('APPROVED')}
              >
                <CheckCircle2 size={16} /> APPROVE
              </button>

              <button
                type="button"
                className={`btn ${decision === 'REJECTED' ? 'btn-danger' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.75rem' }}
                onClick={() => setDecision('REJECTED')}
              >
                <XCircle size={16} /> REJECT
              </button>

              <button
                type="button"
                className={`btn ${decision === 'REQUEST_CHANGES' ? 'btn-warning' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: decision === 'REQUEST_CHANGES' ? '#D97706' : undefined, color: decision === 'REQUEST_CHANGES' ? '#FFFFFF' : undefined }}
                onClick={() => setDecision('REQUEST_CHANGES')}
              >
                <AlertTriangle size={16} /> REQUEST CHANGES
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Officer Verification Remarks & Comments</label>
            <textarea
              rows={3}
              className="form-textarea"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter revenue verification notes, physical site inspection findings, or justification for decision..."
            />
          </div>

          <button
            type="submit"
            className="btn btn-gov"
            disabled={submitting}
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
          >
            <Send size={16} /> {submitting ? 'Submitting Review...' : 'Submit Official Review Decision'}
          </button>
        </form>
      )}
    </div>
  );
};

export default OfficerReviewPanel;
