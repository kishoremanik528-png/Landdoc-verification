import React, { useState } from 'react';
import { 
  FileCheck2, 
  FileSearch, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  User, 
  Building2,
  Globe,
  CheckCircle2
} from 'lucide-react';
import GovernmentLogo from '../components/GovernmentLogo';

const LoginPage = ({ onLoginSuccess }) => {
  const [officerName, setOfficerName] = useState('Kishore Manik');
  const [officerId, setOfficerId] = useState('OFF-TN-9081');
  const [role, setRole] = useState('Verification Officer');
  const [district, setDistrict] = useState('Trichy');
  const [taluk, setTaluk] = useState('Trichy');
  const [password, setPassword] = useState('••••••••');
  const [department, setDepartment] = useState('Revenue Department');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({
          id: officerId,
          name: officerName.trim() || "Kishore Manik",
          role: role || "Verification Officer",
          department: department,
          officer_id: officerId,
          district: district,
          taluk: taluk,
          email: `${(officerName.trim() || "officer").toLowerCase().replace(/\s+/g, '.')}@tn.gov.in`
        });
      }
    }, 500);
  };

  const featureCards = [
    { title: "Verify Patta", desc: "Automated survey & ownership lookup", icon: FileCheck2 },
    { title: "Cross-check Chitta", desc: "Land classification & extent verification", icon: FileSearch },
    { title: "Validate Sale Deed", desc: "Cross-document discrepancy detection", icon: FileText },
    { title: "Check Encumbrance (EC)", desc: "Title transfer & transaction history", icon: ShieldCheck }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F4F8FB',
      padding: '1.5rem'
    }}>
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(11, 61, 145, 0.15)',
        border: '1px solid #CBD5E1',
        backgroundColor: '#FFFFFF'
      }}>
        {/* LEFT PANEL — TAMIL NADU GOVERNMENT BRANDING */}
        <div style={{
          background: 'linear-gradient(135deg, #0B3D91 0%, #1E3A8A 60%, #082F70 100%)',
          color: '#FFFFFF',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative'
        }}>
          {/* Subtle Background Pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <GovernmentLogo size={52} lightTheme={false} />

            <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#93C5FD', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Secure Land | Stronger Tamil Nadu
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                LandGuard <span style={{ color: '#60A5FA' }}>AI</span>
              </h1>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#DBEAFE', marginTop: '0.35rem' }}>
                AI-Assisted Land Document Verification System
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#BFDBFE', marginTop: '0.5rem', fontWeight: 500 }}>
                Transparent Records | Trusted Ownership | Smarter Governance
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginTop: '2rem' }}>
              {featureCards.map((fc, idx) => {
                const Icon = fc.icon;
                return (
                  <div 
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <Icon size={20} color="#60A5FA" style={{ marginBottom: '0.35rem' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>{fc.title}</div>
                    <div style={{ fontSize: '0.7rem', color: '#BFDBFE', marginTop: '0.2rem' }}>{fc.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, marginTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 700 }}>People's Land • People's Trust</span>
            <span style={{ fontSize: '0.7rem', color: '#DBEAFE' }}>v2.4 Government Edition</span>
          </div>
        </div>

        {/* RIGHT PANEL — OFFICER LOGIN FORM */}
        <div style={{
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          {/* Top Bar: Language Selector */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748B' }}>
            <Globe size={14} />
            <span>Language:</span>
            <button 
              onClick={() => setLanguage('en')} 
              style={{ border: 'none', background: language === 'en' ? '#EFF6FF' : 'none', color: language === 'en' ? '#1D4ED8' : '#64748B', fontWeight: language === 'en' ? 700 : 500, padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              English
            </button>
            <span>|</span>
            <button 
              onClick={() => setLanguage('ta')} 
              style={{ border: 'none', background: language === 'ta' ? '#EFF6FF' : 'none', color: language === 'ta' ? '#1D4ED8' : '#64748B', fontWeight: language === 'ta' ? 700 : 500, padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
            >
              தமிழ்
            </button>
          </div>

          {/* Form Header */}
          <div style={{ margin: '1.5rem 0 1rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>Welcome Back</h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Login to access the Land Document Verification System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Officer Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="e.g. Your Name"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Officer ID / Reference Number *</label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="form-input"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. OFF-TN-9081"
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Government Department *</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <select
                  className="form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                >
                  <option value="Revenue Department">Revenue & Disaster Management Dept</option>
                  <option value="Registration Department">Registration Department</option>
                  <option value="Survey Department">Survey & Land Records Dept</option>
                  <option value="VAO Office">VAO (Village Administrative) Office</option>
                  <option value="Tahsildar Office">Tahsildar Office</option>
                  <option value="DTCP Office">DTCP / Planning Department</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assigned District *</label>
                <select className="form-select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                  <option value="Trichy">Trichy</option>
                  <option value="Chengalpattu">Chengalpattu</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="All">All Districts</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assigned Taluk *</label>
                <select className="form-select" value={taluk} onChange={(e) => setTaluk(e.target.value)}>
                  <option value="Trichy">Trichy Taluk</option>
                  <option value="Lalgudi">Lalgudi</option>
                  <option value="Tambaram">Tambaram</option>
                  <option value="Madurai North">Madurai North</option>
                  <option value="Coimbatore North">Coimbatore North</option>
                  <option value="All">All Taluks</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Remember Officer Credentials
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Please contact system admin to reset credentials."); }} style={{ color: '#2563EB', fontWeight: 600 }}>Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="btn btn-gov"
              disabled={loading}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating Officer...' : 'Officer Login'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Security Banner & Footer Links */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '0.6rem 0.85rem',
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#1D4ED8',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle2 size={14} /> Secure • Government Use Only • Authenticated Access
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748B', marginTop: '1rem' }}>
              <a href="#help" onClick={(e) => e.preventDefault()}>Help</a>
              <span>•</span>
              <a href="#contact" onClick={(e) => e.preventDefault()}>Contact Support</a>
              <span>•</span>
              <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
