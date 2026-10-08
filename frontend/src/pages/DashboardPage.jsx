import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  User, 
  RefreshCw, 
  FilePlus, 
  History, 
  ArrowRight,
  Download,
  Activity,
  CheckCircle,
  AlertOctagon,
  Clock
} from 'lucide-react';
import RiskScoreBadge from '../components/RiskScoreBadge';
import ComparisonMatrix from '../components/ComparisonMatrix';
import RelationshipGraph from '../components/RelationshipGraph';
import OwnershipChainTimeline from '../components/OwnershipChainTimeline';
import GisMapView from '../components/GisMapView';
import OfficerReviewPanel from '../components/OfficerReviewPanel';
import { getVerificationResults, getApplicationSummary, getApplications } from '../services/api';

const DashboardPage = ({ appId, officer }) => {
  const [data, setData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchResults = async (targetId) => {
    if (!targetId) return;
    setLoading(true);
    try {
      const res = await getVerificationResults(targetId);
      const sumRes = await getApplicationSummary(targetId);
      if (res.success) setData(res);
      if (sumRes.success) setSummaryData(sumRes.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentApplications = async (overrideDistrict, overrideTaluk) => {
    try {
      const dist = overrideDistrict !== undefined ? overrideDistrict : (officer?.district || 'Trichy');
      const tlk = overrideTaluk !== undefined ? overrideTaluk : (officer?.taluk || 'Trichy');
      const res = await getApplications(dist, tlk);
      if (res.success && res.applications) {
        setRecentApps(res.applications);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecentApplications();
    if (appId) {
      fetchResults(appId);
    }
  }, [appId, officer]);

  const handleDownloadPDF = async () => {
    const targetAppId = data?.application_id || appId;
    if (!targetAppId) return;
    setPdfLoading(true);
    try {
      window.open(`http://127.0.0.1:5000/api/applications/${targetAppId}/document`, '_blank');
    } catch (e) {
      console.error("PDF download failed", e);
    } finally {
      setPdfLoading(false);
    }
  };

  // IF NO APPLICATION SELECTED — SHOW OFFICER DASHBOARD HOME
  if (!appId && !data) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Welcome Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0B3D91 0%, #1E3A8A 100%)',
          borderRadius: '16px',
          padding: '1.75rem 2rem',
          color: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(11, 61, 145, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#2563EB', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                GOVERNMENT OFFICER PORTAL
              </span>
              <span style={{ backgroundColor: '#059669', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                📍 Assigned Jurisdiction: {officer?.district || 'Trichy'} / {officer?.taluk || 'Trichy'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#93C5FD', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle size={12} /> AI System Online
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Good Day, {officer?.name || 'Kishore Manik'}
            </h1>
            <p style={{ color: '#DBEAFE', fontSize: '0.9rem', marginTop: '0.35rem', maxWidth: '650px' }}>
              Viewing location-assigned applications for {officer?.district || 'Trichy'} District. AI-assisted cross-matching assists revenue officers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <select
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}
              onChange={(e) => fetchRecentApplications(e.target.value, 'All')}
              defaultValue={officer?.district || 'Trichy'}
            >
              <option value="Trichy" style={{ color: '#000' }}>Filter: Trichy District</option>
              <option value="Chengalpattu" style={{ color: '#000' }}>Filter: Chengalpattu</option>
              <option value="Madurai" style={{ color: '#000' }}>Filter: Madurai</option>
              <option value="Coimbatore" style={{ color: '#000' }}>Filter: Coimbatore</option>
              <option value="All" style={{ color: '#000' }}>Show All Jurisdictions</option>
            </select>

            <button 
              className="btn"
              onClick={() => fetchRecentApplications()}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
              <RefreshCw size={16} /> Refresh Queue
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Grid */}
        <div className="grid-4">
          <div className="gov-card" style={{ borderLeft: '4px solid #2563EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Applications</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>1,248</div>
                <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>+12% this month</span>
              </div>
              <div style={{ background: '#EFF6FF', padding: '0.6rem', borderRadius: '10px', color: '#2563EB' }}>
                <FileText size={22} />
              </div>
            </div>
          </div>

          <div className="gov-card" style={{ borderLeft: '4px solid #D97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Pending Review</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706', marginTop: '0.25rem' }}>32</div>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Requires Officer Action</span>
              </div>
              <div style={{ background: '#FEF3C7', padding: '0.6rem', borderRadius: '10px', color: '#D97706' }}>
                <Clock size={22} />
              </div>
            </div>
          </div>

          <div className="gov-card" style={{ borderLeft: '4px solid #DC2626' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>High Risk Cases</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#DC2626', marginTop: '0.25rem' }}>5</div>
                <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>Survey/Tampering Flags</span>
              </div>
              <div style={{ background: '#FEE2E2', padding: '0.6rem', borderRadius: '10px', color: '#DC2626' }}>
                <AlertOctagon size={22} />
              </div>
            </div>
          </div>

          <div className="gov-card" style={{ borderLeft: '4px solid #16A34A' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Verified Today</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16A34A', marginTop: '0.25rem' }}>42</div>
                <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>100% Officer Approved</span>
              </div>
              <div style={{ background: '#DCFCE7', padding: '0.6rem', borderRadius: '10px', color: '#16A34A' }}>
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* AI System Performance Metrics */}
        <div className="gov-card">
          <div className="gov-card-header">
            <span className="gov-card-title">
              <Activity size={20} color="#2563EB" /> AI System & Verification Accuracy Overview
            </span>
            <span className="badge badge-info">OPERATIONAL</span>
          </div>

          <div className="grid-3">
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>CROSS-VERIFICATION ACCURACY</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>94.8%</div>
              <div style={{ height: '6px', width: '100%', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '94.8%', height: '100%', background: '#2563EB' }} />
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>OCR EXTRACTION CONFIDENCE</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>92.4%</div>
              <div style={{ height: '6px', width: '100%', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '92.4%', height: '100%', background: '#16A34A' }} />
              </div>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>AVERAGE PROCESSING SPEED</span>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: '0.2rem 0' }}>1.4 Seconds</div>
              <div style={{ height: '6px', width: '100%', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: '#0284C7' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications Queue Table */}
        <div className="gov-card">
          <div className="gov-card-header">
            <span className="gov-card-title">
              <History size={20} color="#0B3D91" /> Recent Land Applications Queue
            </span>
          </div>

          <div className="gov-table-wrapper">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Application Ref</th>
                  <th>Applicant Name</th>
                  <th>Status</th>
                  <th>Risk Score</th>
                  <th>Risk Level</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.length > 0 ? (
                  recentApps.map(app => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 700, color: '#0B3D91' }}>{app.application_id}</td>
                      <td style={{ fontWeight: 600 }}>{app.applicant_name || 'Manik Baasha'}</td>
                      <td>
                        <span className={`badge ${app.status === 'VERIFIED' ? 'badge-match' : app.status === 'REVIEW_REQUIRED' ? 'badge-possible' : 'badge-info'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{app.risk_score || 0}/100</td>
                      <td>
                        <span className={`badge ${app.risk_level === 'HIGH' || app.risk_level === 'CRITICAL' ? 'badge-high' : app.risk_level === 'MEDIUM' ? 'badge-medium' : 'badge-low'}`}>
                          {app.risk_level || 'LOW'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => fetchResults(app.application_id)}
                        >
                          Review Case <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#64748B', padding: '2rem' }}>
                      No applications loaded yet. Click <strong>Demo Scenarios</strong> in the left sidebar to run a demo case!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <RefreshCw size={36} color="#2563EB" style={{ animation: 'spin 1s linear infinite' }} />
        <h3 style={{ color: '#0F172A', marginTop: '1rem' }}>Loading AI Verification Analysis...</h3>
        <p style={{ color: '#64748B' }}>Processing documents for Application {appId}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="gov-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <AlertTriangle size={36} color="#DC2626" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ color: '#0F172A' }}>No Verification Results Found</h3>
        <p style={{ color: '#64748B', margin: '0.5rem 0 1.5rem' }}>Select an application from history or execute a demo scenario.</p>
      </div>
    );
  }

  const ra = data.risk_analysis || {};
  const explanations = summaryData?.explanations || {};
  const summaryInfo = summaryData?.summary || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700, letterSpacing: '0.05em' }}>CASE VERIFICATION REPORT</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0.1rem 0' }}>Application {data.application_id}</h1>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>
            Applicant: <strong style={{ color: '#0F172A' }}>{data.applicant_name}</strong>
            {data.phone_number && (
              <span style={{ marginLeft: '0.75rem', color: '#64748B', fontSize: '0.82rem' }}>
                📱 {'*'.repeat(Math.max(0, data.phone_number.length - 4)) + data.phone_number.slice(-4)}
              </span>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className={`badge ${data.status === 'APPROVED' || data.status === 'VERIFIED' ? 'badge-match' : data.status === 'REJECTED' ? 'badge-mismatch' : 'badge-possible'}`} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            STATUS: {data.status}
          </span>

          <button className="btn btn-secondary" onClick={() => fetchResults(data.application_id)}>
            <RefreshCw size={16} /> Refresh
          </button>

          <button 
            className="btn btn-gov" 
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
          >
            <Download size={16} /> {pdfLoading ? 'Generating...' : 'Download 4-Page PDF'}
          </button>
        </div>
      </div>

      {/* Mandatory Official Disclaimer */}
      <div className="disclaimer-banner">
        <AlertTriangle size={20} className="disclaimer-icon" />
        <span>
          <strong>OFFICIAL NOTICE:</strong> AI recommendations are decision-support tools only. Final decisions remain with authorized human officers.
        </span>
      </div>

      {/* Top Row: Risk Score Badge & Case Summary */}
      <div className="grid-2">
        <RiskScoreBadge 
          score={data.risk_score} 
          level={data.risk_level} 
          factors={ra.risk_factors} 
        />

        <div className="gov-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>Executive Case Summary</h3>
            <div style={{ display: 'flex', gap: '1.5rem', margin: '0.85rem 0', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>FIELDS VERIFIED</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>{summaryInfo.fields_verified || 7}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>MATCHES</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16A34A' }}>{summaryInfo.matches_count || 0}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>ISSUES FOUND</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: summaryInfo.issues_found > 0 ? '#DC2626' : '#16A34A' }}>
                  {summaryInfo.issues_found || 0}
                </div>
              </div>
            </div>
            
            <p style={{ fontSize: '0.88rem', color: '#334155', background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <strong>Summary:</strong> {explanations.short_explanation || "Evaluation completed cleanly."}
            </p>
          </div>

          <div style={{ marginTop: '1rem', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.75rem 1rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: '#1D4ED8', fontWeight: 700 }}>SMART ACTION ADVISOR:</span>
            <p style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: 600, marginTop: '0.2rem' }}>
              {summaryInfo.recommended_action || "Proceed with standard review."}
            </p>
          </div>
        </div>
      </div>

      {/* Field-by-Field Comparison Matrix */}
      <ComparisonMatrix verificationMatrix={data.verification_matrix} />

      {/* Security & Integrity Checks */}
      <div className="grid-2">
        <div className="gov-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Security & Integrity Checks</h3>

          {/* Duplicate Card */}
          <div style={{ background: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Duplicate Application Detector</span>
              <span className={`badge ${data.duplicate_result?.possible_duplicate ? 'badge-mismatch' : 'badge-match'}`}>
                {data.duplicate_result?.duplicate_status || 'NO_DUPLICATE'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569' }}>
              {data.duplicate_result?.explanation || 'No duplicate records found.'}
            </p>
          </div>

          {/* Tampering Card */}
          <div style={{ background: '#F8FAFC', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>Document Integrity & Tampering</span>
              <span className={`badge ${data.tampering_result?.tampering_suspected ? 'badge-mismatch' : 'badge-match'}`}>
                {data.tampering_result?.tampering_suspected ? 'ALTERATION SUSPECTED' : 'PASSED INTEGRITY'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#475569' }}>
              {data.tampering_result?.explanation || 'All files passed basic metadata checks.'}
            </p>
          </div>
        </div>

        {/* GIS Map View */}
        <GisMapView gisData={data.gis_validation} />
      </div>

      {/* Relationship Graph & Ownership Timeline */}
      <div className="grid-2">
        <RelationshipGraph graphData={data.relationship_graph} />
        <OwnershipChainTimeline chainRecords={data.ownership_chain} />
      </div>

      {/* Officer Explanation Card */}
      <div className="gov-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0B3D91' }}>Detailed Officer Natural Language Explanation</h3>
        <pre style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
          fontSize: '0.88rem',
          color: '#334155',
          background: '#F8FAFC',
          padding: '1rem',
          borderRadius: '10px',
          border: '1px solid #E2E8F0'
        }}>
          {explanations.detailed_explanation || "Verification analysis completed cleanly."}
        </pre>
      </div>

      {/* Officer Human-in-the-Loop Review Panel */}
      <OfficerReviewPanel 
        appId={data.application_id} 
        currentStatus={data.status} 
        onReviewSubmitted={(newStatus) => setData(prev => ({ ...prev, status: newStatus }))} 
        officer={officer}
      />
    </div>
  );
};

export default DashboardPage;
