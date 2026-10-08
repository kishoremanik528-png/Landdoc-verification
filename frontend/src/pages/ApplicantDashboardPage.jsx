import React, { useState, useEffect } from 'react';
import { UserCheck, FileText, Download, CheckCircle2, Clock, XCircle, AlertTriangle, Plus, Eye, Phone } from 'lucide-react';
import { getApplicationsHistory } from '../services/api';
import ApplicantStatusStepper from '../components/ApplicantStatusStepper';

const ApplicantDashboardPage = ({ applicant, onStartNewApp }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await getApplicationsHistory();
      if (res.success) {
        setApplications(res.applications || []);
        if (res.applications && res.applications.length > 0) {
          setSelectedApp(res.applications[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const totalApps = applications.length;
  const submittedCount = applications.filter(a => a.status === 'CREATED' || a.status === 'PENDING').length;
  const aiVerificationCount = applications.filter(a => a.processing_status === 'IN_PROGRESS' || a.processing_status === 'OCR_DONE').length;
  const officerReviewCount = applications.filter(a => a.status === 'REVIEW_REQUIRED' || (a.processing_status === 'COMPLETED' && a.status !== 'APPROVED' && a.status !== 'REJECTED' && a.status !== 'CHANGES_REQUESTED')).length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;
  const changesRequestedCount = applications.filter(a => a.status === 'CHANGES_REQUESTED').length;

  const handleDownloadPDF = (appId) => {
    const url = `http://127.0.0.1:5000/api/applications/${appId}/document`;
    window.open(url, '_blank');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return <span className="badge badge-match"><CheckCircle2 size={12} /> Approved</span>;
      case 'REJECTED':
        return <span className="badge badge-mismatch"><XCircle size={12} /> Rejected</span>;
      case 'CHANGES_REQUESTED':
        return <span className="badge badge-warning" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}><AlertTriangle size={12} /> Changes Requested</span>;
      case 'REVIEW_REQUIRED':
        return <span className="badge badge-info"><Clock size={12} /> Officer Review</span>;
      default:
        return <span className="badge badge-secondary"><Clock size={12} /> Processing</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)',
        borderRadius: '20px',
        padding: '2rem',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.15)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.25rem 0.75rem', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <UserCheck size={14} /> APPLICANT DASHBOARD
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF' }}>
            Welcome, {applicant?.name || 'Kishore Kumar'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#DBEAFE', marginTop: '0.2rem' }}>
            Registered Mobile: <strong>{applicant?.phone_number || '9876543210'}</strong> (SMS Notifications Active)
          </p>
        </div>

        <button
          className="btn btn-gov"
          onClick={onStartNewApp}
          style={{ backgroundColor: '#FFFFFF', color: '#1D4ED8', fontWeight: 800, padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> New Land Verification
        </button>
      </div>

      {/* Summary Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
        <div className="gov-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{totalApps}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total Applications</div>
        </div>

        <div className="gov-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563EB' }}>{submittedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Submitted</div>
        </div>

        <div className="gov-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284C7' }}>{aiVerificationCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>AI Verifying</div>
        </div>

        <div className="gov-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#D97706' }}>{officerReviewCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Officer Review</div>
        </div>

        <div className="gov-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '4px solid #16A34A' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16A34A' }}>{approvedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Approved</div>
        </div>

        <div className="gov-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '4px solid #DC2626' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#DC2626' }}>{rejectedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Rejected</div>
        </div>

        <div className="gov-card" style={{ padding: '1rem', textAlign: 'center', borderTop: '4px solid #D97706' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#D97706' }}>{changesRequestedCount}</div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Changes Req.</div>
        </div>
      </div>

      {/* Selected Application Progress Stepper */}
      {selectedApp && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
              Selected Application Status: <span style={{ color: '#2563EB' }}>{selectedApp.application_id}</span>
            </h3>
            {selectedApp.status === 'APPROVED' && (
              <button
                className="btn btn-success"
                onClick={() => handleDownloadPDF(selectedApp.application_id)}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Download size={16} /> DOWNLOAD VERIFIED APPLICATION PDF
              </button>
            )}
          </div>
          <ApplicantStatusStepper status={selectedApp.status} processingStatus={selectedApp.processing_status} />
        </div>
      )}

      {/* Recent Applications List */}
      <div className="gov-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>My Land Applications</h3>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Showing real backend records</span>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>Loading your applications...</div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
            No applications submitted yet. Click <strong>"New Land Verification"</strong> to submit your first application.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>District / Taluk</th>
                  <th>Survey No</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const isSelected = selectedApp?.application_id === app.application_id;
                  return (
                    <tr
                      key={app.id}
                      style={{ backgroundColor: isSelected ? '#EFF6FF' : undefined, cursor: 'pointer' }}
                      onClick={() => setSelectedApp(app)}
                    >
                      <td style={{ fontWeight: 700, color: '#1D4ED8' }}>{app.application_id}</td>
                      <td>{app.district || 'Trichy'} / {app.taluk || 'Trichy'}</td>
                      <td>{app.survey_number || '123/4A'}</td>
                      <td>{app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Today'}</td>
                      <td>{getStatusBadge(app.status)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}
                            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                          >
                            <Eye size={12} /> View Status
                          </button>
                          {app.status === 'APPROVED' && (
                            <button
                              className="btn btn-success"
                              onClick={(e) => { e.stopPropagation(); handleDownloadPDF(app.application_id); }}
                              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <Download size={12} /> PDF
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDashboardPage;
