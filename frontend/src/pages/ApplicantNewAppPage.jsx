import React, { useState } from 'react';
import { UserCheck, MapPin, Home, FileText, CheckCircle2, Upload, Trash2, ArrowRight, ArrowLeft, Phone, ShieldCheck, Download } from 'lucide-react';
import { createApplication, uploadDocument, triggerProcessing } from '../services/api';

const ApplicantNewAppPage = ({ applicant, onSubmissionSuccess, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Personal Info
  const [applicantName, setApplicantName] = useState(applicant?.name || 'Kishore Kumar');
  const [guardianName, setGuardianName] = useState('M. Sundaram');
  const [phoneNumber, setPhoneNumber] = useState(applicant?.phone_number || '9876543210');
  const [phoneError, setPhoneError] = useState('');

  // Step 2: Property Location
  const [district, setDistrict] = useState('Trichy');
  const [taluk, setTaluk] = useState('Trichy');
  const [village, setVillage] = useState('Kallakudi');

  // Step 3: Property Details
  const [surveyNo, setSurveyNo] = useState('123/4A');
  const [subdivision, setSubdivision] = useState('2B');
  const [extent, setExtent] = useState('2.50 acres');
  const [propertyType, setPropertyType] = useState('Agricultural');

  // Step 4: Document Uploads
  const [appId, setAppId] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocType, setSelectedDocType] = useState('PATTA');
  const [uploading, setUploading] = useState(false);

  // Step 5: Submit Confirmation
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  const validatePhone = (p) => {
    const cleaned = p.replace(/[\s\-]/g, '');
    if (!cleaned) return 'Mobile number is required for SMS notifications.';
    if (!/^(\+91|91)?[6-9]\d{9}$/.test(cleaned)) {
      return 'Please enter a valid 10-digit Indian mobile number.';
    }
    return '';
  };

  const handleNextFromStep1 = () => {
    if (!applicantName.trim()) {
      alert("Please enter Applicant Full Name");
      return;
    }
    const pErr = validatePhone(phoneNumber);
    if (pErr) {
      setPhoneError(pErr);
      return;
    }
    setPhoneError('');
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!district || !taluk || !village) {
      alert("Please fill in District, Taluk, and Village.");
      return;
    }
    setCurrentStep(3);
  };

  const handleNextFromStep3 = async () => {
    if (!surveyNo) {
      alert("Please enter Survey Number.");
      return;
    }
    // Create Application in DB if not created already
    if (!appId) {
      setSubmitting(true);
      try {
        const cleanedPhone = phoneNumber.replace(/[\s\-]/g, '');
        const res = await createApplication({
          applicant_name: applicantName,
          guardian_name: guardianName,
          phone_number: cleanedPhone,
          district,
          taluk,
          village,
          survey_number: surveyNo,
          subdivision_number: subdivision,
          extent,
          property_type: propertyType
        });
        if (res.success && res.application) {
          setAppId(res.application.application_id);
          setSubmittedApp(res.application);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to initiate application.");
        return;
      } finally {
        setSubmitting(false);
      }
    }
    setCurrentStep(4);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !appId) return;

    setUploading(true);
    try {
      const res = await uploadDocument(appId, file, selectedDocType);
      if (res.success && res.document) {
        setDocuments(prev => [...prev, res.document]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Document upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDoc = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleFinalSubmit = async () => {
    if (!confirmed) {
      alert("Please confirm the verification statement checkbox.");
      return;
    }
    if (!appId) return;

    setSubmitting(true);
    try {
      await triggerProcessing(appId);
      if (onSubmissionSuccess) {
        onSubmissionSuccess(appId);
      }
    } catch (err) {
      alert("Application submitted, but background processing trigger had an issue.");
      if (onSubmissionSuccess) {
        onSubmissionSuccess(appId);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const docCategories = [
    { key: 'SALE_DEED', title: 'Sale Deed', req: 'Required' },
    { key: 'PATTA', title: 'Patta Copy', req: 'Required' },
    { key: 'CHITTA', title: 'Chitta Extract', req: 'Required' },
    { key: 'ENCUMBRANCE_CERTIFICATE', title: 'Encumbrance Certificate (EC)', req: 'Required' },
    { key: 'SUPPORTING_DOC', title: 'Other Supporting Document', req: 'Optional' }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Stepper Navigation Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>New Land Document Verification Application</h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Submit land documents for location-based government officer review & AI cross-verification.</p>
      </div>

      {/* Visual Stepper */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        {[
          { step: 1, label: "Personal Info" },
          { step: 2, label: "Location" },
          { step: 3, label: "Property Details" },
          { step: 4, label: "Document Upload" },
          { step: 5, label: "Review & Submit" }
        ].map((s) => {
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;
          return (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: isDone ? '#16A34A' : (isActive ? '#2563EB' : '#E2E8F0'),
                color: (isDone || isActive) ? '#FFFFFF' : '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {isDone ? '✓' : s.step}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#1D4ED8' : '#64748B', display: window.innerWidth > 600 ? 'inline' : 'none' }}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* STEP 1: PERSONAL INFORMATION */}
      {currentStep === 1 && (
        <div className="gov-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserCheck size={22} color="#2563EB" /> Step 1: Applicant Personal Information
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Applicant Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g. Kishore Kumar"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Father's / Guardian Name</label>
              <input
                type="text"
                className="form-input"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. M. Sundaram"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Phone size={16} color="#2563EB" /> Applicant Mobile Phone Number (for SMS Alerts) *
            </label>
            <input
              type="tel"
              className="form-input"
              value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value); setPhoneError(''); }}
              placeholder="Enter 10-digit mobile number"
              maxLength={13}
              style={phoneError ? { borderColor: '#DC2626' } : {}}
            />
            {phoneError ? (
              <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600, marginTop: '0.25rem', display: 'block' }}>
                {phoneError}
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem', display: 'block' }}>
                Officer review updates (Approved, Rejected, Changes Requested) will be sent to this number.
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={handleNextFromStep1} style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Next: Property Location <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PROPERTY LOCATION */}
      {currentStep === 2 && (
        <div className="gov-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={22} color="#2563EB" /> Step 2: Property Location & Office Routing
          </h3>

          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.85rem 1rem', borderRadius: '10px', fontSize: '0.82rem', color: '#1E40AF', marginBottom: '1.25rem' }}>
            <strong>Officer Assignment Note:</strong> The selected District and Taluk determine which government revenue office handles your verification.
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">District *</label>
              <select className="form-select" value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="Trichy">Trichy (Tiruchirappalli)</option>
                <option value="Chengalpattu">Chengalpattu</option>
                <option value="Madurai">Madurai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Thanjavur">Thanjavur</option>
                <option value="Salem">Salem</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Taluk *</label>
              <select className="form-select" value={taluk} onChange={(e) => setTaluk(e.target.value)}>
                <option value="Trichy">Trichy Taluk</option>
                <option value="Lalgudi">Lalgudi</option>
                <option value="Tambaram">Tambaram</option>
                <option value="Madurai North">Madurai North</option>
                <option value="Coimbatore North">Coimbatore North</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Village *</label>
              <input
                type="text"
                className="form-input"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Kallakudi"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(1)} style={{ padding: '0.75rem 1.25rem' }}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" onClick={handleNextFromStep2} style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Next: Property Details <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PROPERTY DETAILS */}
      {currentStep === 3 && (
        <div className="gov-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={22} color="#2563EB" /> Step 3: Land Parcel Details
          </h3>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Survey Number *</label>
              <input
                type="text"
                className="form-input"
                value={surveyNo}
                onChange={(e) => setSurveyNo(e.target.value)}
                placeholder="e.g. 123/4A"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subdivision Number</label>
              <input
                type="text"
                className="form-input"
                value={subdivision}
                onChange={(e) => setSubdivision(e.target.value)}
                placeholder="e.g. 2B"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Land Extent / Area</label>
              <input
                type="text"
                className="form-input"
                value={extent}
                onChange={(e) => setExtent(e.target.value)}
                placeholder="e.g. 2.50 acres / 1200 sq.ft"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select className="form-select" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                <option value="Agricultural">Agricultural Land</option>
                <option value="Residential">Residential Plot</option>
                <option value="Commercial">Commercial Property</option>
                <option value="Industrial">Industrial Site</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(2)} style={{ padding: '0.75rem 1.25rem' }}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" onClick={handleNextFromStep3} disabled={submitting} style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {submitting ? 'Initiating Application...' : 'Next: Upload Documents'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DOCUMENT UPLOAD */}
      {currentStep === 4 && (
        <div className="gov-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} color="#2563EB" /> Step 4: Upload Land Documents
            </h3>
            {appId && <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>Ref: {appId}</span>}
          </div>

          {/* Doc Category Cards */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {docCategories.map(cat => (
              <button
                key={cat.key}
                type="button"
                className={`btn ${selectedDocType === cat.key ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                onClick={() => setSelectedDocType(cat.key)}
              >
                {cat.title} ({cat.req})
              </button>
            ))}
          </div>

          {/* Upload Area */}
          <div style={{
            border: '2px dashed #93C5FD',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            marginBottom: '1.5rem'
          }}>
            <Upload size={36} color="#2563EB" style={{ margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
              Upload {docCategories.find(c => c.key === selectedDocType)?.title}
            </h4>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>
              Supports PDF, PNG, JPG (Max 16 MB)
            </p>

            <input
              type="file"
              id="applicant-file-input"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="applicant-file-input" className="btn btn-primary" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
              {uploading ? 'Uploading...' : 'Choose Document File'}
            </label>
          </div>

          {/* Uploaded Files Table */}
          {documents.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                Uploaded Documents ({documents.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {documents.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.65rem 1rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <CheckCircle2 size={18} color="#16A34A" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>{doc.original_file_name}</span>
                      <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{doc.document_type}</span>
                    </div>
                    <button onClick={() => handleRemoveDoc(doc.id)} style={{ border: 'none', background: 'none', color: '#DC2626', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(3)} style={{ padding: '0.75rem 1.25rem' }}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn btn-primary" onClick={() => setCurrentStep(5)} style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Next: Review & Submit <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW AND SUBMIT */}
      {currentStep === 5 && (
        <div className="gov-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={22} color="#2563EB" /> Step 5: Application Summary Review
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>APPLICANT INFORMATION</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{applicantName}</div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>Guardian: {guardianName}</div>
              <div style={{ fontSize: '0.82rem', color: '#2563EB', fontWeight: 600, marginTop: '0.2rem' }}>Mobile: {phoneNumber}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>PROPERTY LOCATION</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{district} District</div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>{taluk} Taluk, {village} Village</div>
            </div>

            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #E2E8F0', paddingTop: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>PARCEL DETAILS</div>
              <div style={{ fontSize: '0.85rem', color: '#0F172A', marginTop: '0.2rem' }}>
                Survey No: <strong>{surveyNo}</strong> | Subdivision: <strong>{subdivision}</strong> | Extent: <strong>{extent}</strong> ({propertyType})
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
              Attached Documents ({documents.length}):
            </div>
            {documents.length === 0 ? (
              <span style={{ fontSize: '0.8rem', color: '#D97706' }}>⚠ No document files uploaded yet. You can submit and upload later or attach now.</span>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {documents.map((d, i) => (
                  <span key={i} className="badge badge-info" style={{ fontSize: '0.75rem' }}>{d.document_type}: {d.original_file_name}</span>
                ))}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: '#1E3A8A', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                style={{ marginTop: '0.25rem' }}
              />
              <span>
                I hereby confirm that all information provided is accurate and correct. I understand that government revenue officers will cross-verify these details against registered records.
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(4)} style={{ padding: '0.75rem 1.25rem' }}>
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className="btn btn-success"
              onClick={handleFinalSubmit}
              disabled={submitting || !confirmed}
              style={{ padding: '0.85rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {submitting ? 'Submitting Application...' : 'SUBMIT APPLICATION'} <CheckCircle2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantNewAppPage;
