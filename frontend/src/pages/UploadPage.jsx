import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Trash2, ArrowRight, Play, UserCheck, MapPin, Building, ShieldCheck, Phone } from 'lucide-react';
import { createApplication, uploadDocument, triggerProcessing } from '../services/api';

const UploadPage = ({ onProcessingStarted }) => {
  const [applicantName, setApplicantName] = useState('Kishore Kumar');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [surveyNo, setSurveyNo] = useState('123/2A');
  const [subdivision, setSubdivision] = useState('1A');
  const [village, setVillage] = useState('Velachery');
  const [taluk, setTaluk] = useState('Tambaram');
  const [district, setDistrict] = useState('Chengalpattu');
  const [extent, setExtent] = useState('2.50 acres');

  const [appId, setAppId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('PATTA');
  const [uploading, setUploading] = useState(false);
  const [creatingApp, setCreatingApp] = useState(false);

  const validatePhoneNumber = (phone) => {
    const cleaned = phone.replace(/[\s\-]/g, '');
    if (!cleaned) return 'Please enter the applicant\'s mobile number.';
    const pattern = /^(\+91|91)?[6-9]\d{9}$/;
    if (!pattern.test(cleaned)) return 'Please enter a valid 10-digit Indian mobile number.';
    return '';
  };

  const handleCreateApp = async () => {
    if (!applicantName.trim()) {
      alert("Please enter Applicant Name");
      return;
    }
    const phoneErr = validatePhoneNumber(phoneNumber);
    if (phoneErr) {
      setPhoneError(phoneErr);
      return;
    }
    setPhoneError('');
    setCreatingApp(true);
    try {
      const cleanedPhone = phoneNumber.replace(/[\s\-]/g, '');
      const res = await createApplication(applicantName, cleanedPhone);
      if (res.success && res.application) {
        setAppId(res.application.application_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingApp(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!appId) {
      alert("Please initiate an Application Case ID first.");
      return;
    }

    setUploading(true);
    try {
      const res = await uploadDocument(appId, file, selectedDocType);
      if (res.success && res.document) {
        setDocuments(prev => [...prev, res.document]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleStartProcessing = async () => {
    if (!appId) return;
    try {
      await triggerProcessing(appId);
      if (onProcessingStarted) {
        onProcessingStarted(appId);
      }
    } catch (err) {
      alert("Failed to start processing.");
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#E0F2FE', color: '#0284C7', padding: '0.3rem 0.85rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <ShieldCheck size={14} /> OFFICER CASE INITIATION
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>New Verification Case & Document Upload</h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Upload Pattas, Chittas, ECs, and Sale Deeds for automatic AI extraction and cross-verification.</p>
      </div>

      {/* Step 1: Form Details */}
      {!appId ? (
        <div className="gov-card" style={{ padding: '2rem' }}>
          <div className="gov-card-header">
            <span className="gov-card-title">
              <UserCheck size={20} color="#2563EB" /> Step 1: Initiate Application Reference & Parcel Metadata
            </span>
            <span className="badge badge-info">OFFICER ENTRY</span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Applicant / Landowner Name *</label>
              <input
                type="text"
                className="form-input"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g. Kishore Kumar"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={14} color="#2563EB" /> Applicant Mobile Number *
              </label>
              <input
                type="tel"
                className="form-input"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); setPhoneError(''); }}
                placeholder="Enter 10-digit mobile number"
                maxLength={13}
                style={phoneError ? { borderColor: '#DC2626', boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)' } : {}}
              />
              {phoneError && (
                <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600, marginTop: '0.3rem', display: 'block' }}>
                  {phoneError}
                </span>
              )}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Land Extent (Acres / Cents)</label>
              <input
                type="text"
                className="form-input"
                value={extent}
                onChange={(e) => setExtent(e.target.value)}
                placeholder="e.g. 2.50 acres"
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Survey Number</label>
              <input
                type="text"
                className="form-input"
                value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subdivision Number</label>
              <input
                type="text"
                className="form-input"
                value={subdivision}
                onChange={(e) => setSubdivision(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Village</label>
              <input
                type="text"
                className="form-input"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Taluk</label>
              <input
                type="text"
                className="form-input"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">District</label>
              <input
                type="text"
                className="form-input"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>

          <button 
            className="btn btn-gov" 
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }} 
            onClick={handleCreateApp} 
            disabled={creatingApp}
          >
            {creatingApp ? 'Generating Case Reference...' : 'Initiate Verification Case'}
          </button>
        </div>
      ) : (
        /* Step 2: Upload Files */
        <div className="gov-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', backgroundColor: '#EFF6FF', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#1E3A8A', fontWeight: 700 }}>ACTIVE CASE REFERENCE</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1D4ED8' }}>{appId}</h3>
            </div>
            <span className="badge badge-match">Applicant: {applicantName}</span>
          </div>

          {/* Doc Type Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Select Document Category to Upload:</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['PATTA', 'CHITTA', 'ENCUMBRANCE_CERTIFICATE', 'SALE_DEED'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`btn ${selectedDocType === t ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  onClick={() => setSelectedDocType(t)}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div style={{
            border: '2px dashed #93C5FD',
            borderRadius: '16px',
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            marginBottom: '1.5rem'
          }}>
            <Upload size={40} color="#2563EB" style={{ margin: '0 auto 0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.3rem' }}>
              Upload {selectedDocType.replace('_', ' ')} Document Copy
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Supports PDF, PNG, JPG, JPEG (Max 16 MB)
            </p>

            <input
              type="file"
              id="file-input"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-input" className="btn btn-primary" style={{ cursor: 'pointer' }}>
              {uploading ? 'Uploading File...' : 'Choose File to Upload'}
            </label>
          </div>

          {/* Documents List */}
          {documents.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem' }}>
                Uploaded Documents ({documents.length}):
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {documents.map((doc, idx) => (
                  <div 
                    key={idx}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText size={22} color="#2563EB" />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{doc.original_file_name}</div>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{doc.document_type}</span>
                      </div>
                    </div>
                    <CheckCircle size={20} color="#16A34A" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trigger Process Button */}
          <button
            className="btn btn-success"
            style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
            onClick={handleStartProcessing}
          >
            <Play size={18} /> Start AI Cross-Verification & Risk Engine
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPage;
