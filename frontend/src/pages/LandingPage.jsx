import React from 'react';
import { UserCheck, ShieldCheck, ArrowRight, FileCheck, Landmark, CheckCircle2 } from 'lucide-react';
import GovernmentLogo from '../components/GovernmentLogo';

const LandingPage = ({ onSelectApplicantPortal, onSelectOfficerPortal, onLaunchDemo }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1100px', margin: '0 auto', padding: '1rem 0' }}>
      {/* Header / Hero Banner */}
      <section style={{
        textAlign: 'center',
        padding: '3.5rem 2rem',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: '24px',
        color: '#FFFFFF',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(#FFFFFF 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <GovernmentLogo size={64} lightTheme={false} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(96, 165, 250, 0.3)', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <ShieldCheck size={14} /> Official Government Verification Platform
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '0.75rem' }}>
            LANDGUARD <span style={{ color: '#60A5FA' }}>AI</span>
          </h1>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#93C5FD', marginBottom: '1rem' }}>
            AI-Assisted Land Document Verification System
          </h3>

          <p style={{ maxWidth: '740px', margin: '0 auto 1.5rem', color: '#94A3B8', fontSize: '1.05rem', lineHeight: 1.6 }}>
            A secure state platform where citizens submit land documents for verification and authorized government revenue officers review AI-assisted cross-document verification results.
          </p>

          {onLaunchDemo && (
            <button
              onClick={onLaunchDemo}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#E2E8F0',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🚀 Launch Demo Scenarios
            </button>
          )}
        </div>
      </section>

      {/* Main Role Selection Cards */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>Select Your Portal to Continue</h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Choose your role to access dedicated workflow, verification tracking, and portal services.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {/* Card 1: APPLICANT PORTAL */}
          <div 
            className="gov-card"
            style={{
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '6px solid #2563EB',
              boxShadow: '0 10px 30px rgba(37, 99, 235, 0.08)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              cursor: 'pointer'
            }}
            onClick={onSelectApplicantPortal}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.85rem', borderRadius: '16px', border: '1px solid #BFDBFE' }}>
                  <UserCheck size={32} />
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>FOR CITIZENS</span>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                APPLICANT PORTAL
              </h3>

              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                For citizens submitting land document verification applications, checking application status, and downloading approved verification certificates.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#16A34A" /> Submit Patta, Chitta, EC & Sale Deeds
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#16A34A" /> Multi-Step Application Wizard
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#16A34A" /> Track Real-time Verification Status
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#16A34A" /> Download Approved Application PDF
                </div>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={(e) => { e.stopPropagation(); onSelectApplicantPortal(); }}
            >
              Enter Applicant Portal <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 2: GOVERNMENT OFFICER PORTAL */}
          <div 
            className="gov-card"
            style={{
              padding: '2.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '6px solid #0B3D91',
              backgroundColor: '#FAFAFE',
              boxShadow: '0 10px 30px rgba(11, 61, 145, 0.08)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              cursor: 'pointer'
            }}
            onClick={onSelectOfficerPortal}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: '#F0F4FF', color: '#0B3D91', padding: '0.85rem', borderRadius: '16px', border: '1px solid #C7D2FE' }}>
                  <Landmark size={32} />
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.75rem', backgroundColor: '#FEF3C7', color: '#92400E' }}>AUTHORIZED OFFICERS ONLY</span>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                GOVERNMENT OFFICER PORTAL
              </h3>

              <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                For authorized revenue officers (VAO, RI, Tahsildar) reviewing location-assigned land applications with AI cross-document verification reports.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#0B3D91" /> District & Taluk Location Queueing
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#0B3D91" /> AI Cross-Verification Matrix Report
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#0B3D91" /> Approve, Reject, or Request Changes
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155' }}>
                  <CheckCircle2 size={16} color="#0B3D91" /> Automated Twilio SMS Triggering
                </div>
              </div>
            </div>

            <button 
              className="btn btn-gov"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={(e) => { e.stopPropagation(); onSelectOfficerPortal(); }}
            >
              Enter Officer Portal <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Security Disclaimer Banner */}
      <div style={{
        backgroundColor: '#F1F5F9',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileCheck size={24} color="#0B3D91" />
          <div style={{ fontSize: '0.85rem', color: '#334155' }}>
            <strong>Human-in-the-Loop AI Policy:</strong> LANDGUARD AI provides explainable cross-document decision support. Final approval or rejection authority remains strictly with human revenue officers.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
