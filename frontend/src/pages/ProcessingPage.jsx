import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2, ShieldCheck, Activity } from 'lucide-react';

const ProcessingPage = ({ appId, onComplete }) => {
  const [step, setStep] = useState(0);

  const stepsList = [
    "Documents Ingested & File Paths Validated",
    "Tamil & English OCR Text Extraction Completed",
    "Field Label Mapping & Normalization Applied",
    "Field-by-Field Cross-Verification Matrix Calculated",
    "Duplicate Application & Metadata Tampering Analyzed",
    "Ownership Chain Sequence & GIS Boundaries Verified",
    "Weighted Risk Score & Explainable Report Generated"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => {
        if (prev < stepsList.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            if (onComplete) onComplete(appId);
          }, 800);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(timer);
  }, [appId, onComplete]);

  return (
    <div style={{ maxWidth: '680px', margin: '3rem auto' }}>
      <div className="gov-card" style={{ padding: '3rem 2.5rem' }}>
        <div style={{
          backgroundColor: '#EFF6FF',
          padding: '1.25rem',
          borderRadius: '50%',
          width: 'fit-content',
          margin: '0 auto 1.5rem',
          border: '2px solid #BFDBFE',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
        }}>
          <Cpu size={44} color="#2563EB" style={{ animation: 'spin 3s linear infinite' }} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI ORCHESTRATOR PIPELINE
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
            Executing Land Cross-Verification Engine
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Processing Application Reference <strong style={{ color: '#0B3D91' }}>{appId || 'APP-2024-8891'}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {stepsList.map((stText, idx) => {
            const isCompleted = idx < step;
            const isCurrent = idx === step;

            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1.1rem',
                  borderRadius: '10px',
                  backgroundColor: isCurrent ? '#EFF6FF' : isCompleted ? '#F0FDF4' : '#F8FAFC',
                  border: isCurrent ? '1.5px solid #2563EB' : isCompleted ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                  color: isCompleted ? '#166534' : isCurrent ? '#1E3A8A' : '#64748B',
                  fontSize: '0.9rem',
                  fontWeight: isCurrent ? 700 : 500,
                  transition: 'all 0.25s ease-in-out',
                  boxShadow: isCurrent ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none'
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 size={20} color="#16A34A" />
                ) : isCurrent ? (
                  <Loader2 size={20} color="#2563EB" style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #CBD5E1' }} />
                )}
                <span style={{ flex: 1 }}>{stText}</span>
                {isCompleted && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>DONE</span>}
                {isCurrent && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>RUNNING</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
