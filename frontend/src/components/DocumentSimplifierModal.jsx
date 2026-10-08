import React, { useState } from 'react';
import { X, Languages, FileText } from 'lucide-react';
import { simplifyText } from '../services/api';

const DocumentSimplifierModal = ({ isOpen, onClose }) => {
  const [selectedTerm, setSelectedTerm] = useState('survey number');
  const [simplifiedData, setSimplifiedData] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSimplify = async (term) => {
    setSelectedTerm(term);
    setLoading(true);
    try {
      const res = await simplifyText('', term);
      if (res.success) {
        setSimplifiedData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(6px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '16px',
        maxWidth: '560px',
        width: '100%',
        padding: '1.5rem',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ backgroundColor: '#0B3D91', padding: '0.5rem', borderRadius: '8px' }}>
              <Languages size={20} color="#FFFFFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Land Document Legalese Simplifier</h3>
              <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Tamil & English Legal Terminology Assistant</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Term buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {['survey number', 'patta', 'chitta', 'encumbrance', 'subdivision'].map((t) => (
            <button
              key={t}
              className={`btn ${selectedTerm === t ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', textTransform: 'capitalize' }}
              onClick={() => handleSimplify(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Simplified Result */}
        <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0B3D91', marginBottom: '0.75rem', textTransform: 'capitalize' }}>
            Term: {selectedTerm}
          </h4>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#2563EB', fontWeight: 700 }}>ENGLISH SIMPLE EXPLANATION</div>
            <p style={{ fontSize: '0.9rem', color: '#0F172A', marginTop: '0.2rem' }}>
              {simplifiedData?.english_simple || "Unique land parcel registration code assigned by government land records department."}
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700 }}>TAMIL SIMPLE EXPLANATION (தமிழ் எளிய விளக்கம்)</div>
            <p style={{ fontSize: '0.9rem', color: '#0F172A', marginTop: '0.2rem' }}>
              {simplifiedData?.tamil_simple || "அரசாங்கத்தால் வழங்கப்பட்ட நிலத்தின் தனித்துவமான புல எண்."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSimplifierModal;
