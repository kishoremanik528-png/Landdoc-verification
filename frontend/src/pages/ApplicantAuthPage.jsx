import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Mail, Lock, Phone, User, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { applicantLogin, applicantRegister } from '../services/api';

const ApplicantAuthPage = ({ onAuthSuccess, onBackToRoleSelection }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('Kishore Kumar');
  const [email, setEmail] = useState('kishore.kumar@gmail.com');
  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePhone = (p) => {
    const cleaned = p.replace(/[\s\-]/g, '');
    if (!cleaned) return 'Mobile number is required for SMS notifications.';
    if (!/^(\+91|91)?[6-9]\d{9}$/.test(cleaned)) {
      return 'Please enter a valid 10-digit Indian mobile number.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pErr = validatePhone(phone);
    if (pErr) {
      setPhoneError(pErr);
      return;
    }
    setPhoneError('');

    if (isRegister && password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await applicantRegister({ name: fullName, email, phone_number: phone });
      } else {
        await applicantLogin({ email, name: fullName, phone_number: phone });
      }
      if (onAuthSuccess) {
        onAuthSuccess({
          name: fullName || 'Kishore Kumar',
          email: email || 'applicant@example.com',
          phone_number: phone.replace(/[\s\-]/g, ''),
          role: 'APPLICANT'
        });
      }
    } catch (err) {
      console.error(err);
      alert('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '950px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '1.1fr 1fr' : '1fr',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(37, 99, 235, 0.12)',
        border: '1px solid #BFDBFE',
        backgroundColor: '#FFFFFF'
      }}>
        {/* LEFT PANEL — APPLICANT CITIZEN SERVICE BRANDING */}
        <div style={{
          background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 60%, #3B82F6 100%)',
          color: '#FFFFFF',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          <div>
            <button
              onClick={onBackToRoleSelection}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                marginBottom: '1.5rem'
              }}
            >
              <ArrowLeft size={14} /> Back to Portal Selection
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#DBEAFE', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>
              <UserCheck size={14} /> CITIZEN SERVICES PORTAL
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.15 }}>
              LandGuard <span style={{ color: '#93C5FD' }}>Applicant Portal</span>
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#DBEAFE', marginTop: '0.5rem', lineHeight: 1.5 }}>
              Submit land verification applications online, track review status live, and receive automated SMS updates on your registered mobile phone.
            </p>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#EFF6FF' }}>
                <CheckCircle2 size={18} color="#93C5FD" /> Multi-Step Document Upload Stepper
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#EFF6FF' }}>
                <CheckCircle2 size={18} color="#93C5FD" /> Instant SMS Notifications via Twilio
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#EFF6FF' }}>
                <CheckCircle2 size={18} color="#93C5FD" /> Explainable AI Verification Insights
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#EFF6FF' }}>
                <CheckCircle2 size={18} color="#93C5FD" /> Approved Verified Application PDF Download
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem', marginTop: '2rem', fontSize: '0.75rem', color: '#DBEAFE' }}>
            Tamil Nadu e-Governance Land Verification Initiative
          </div>
        </div>

        {/* RIGHT PANEL — AUTH FORM */}
        <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>
                {isRegister ? 'Applicant Registration' : 'Applicant Login'}
              </h2>
              <button
                onClick={() => setIsRegister(!isRegister)}
                style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                {isRegister ? 'Already registered? Login' : 'New user? Register'}
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kishore Kumar"
                    required
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mobile Phone Number (for SMS) *</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#2563EB" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
                    placeholder="10-digit Indian mobile number"
                    maxLength={13}
                    required
                    style={{ paddingLeft: '2.4rem', borderColor: phoneError ? '#DC2626' : undefined }}
                  />
                </div>
                {phoneError && (
                  <span style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.25rem', display: 'block' }}>
                    {phoneError}
                  </span>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    required
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              {isRegister && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      className="form-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {loading ? 'Processing...' : (isRegister ? 'Register Account' : 'Login to Applicant Portal')} <ArrowRight size={18} />
              </button>
            </form>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.78rem', color: '#64748B' }}>
            Need help? Contact Citizen Helpline at 1800-425-1000
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantAuthPage;
