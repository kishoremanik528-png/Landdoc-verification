import React from 'react';
import { CheckCircle2, Clock, FileCheck, ShieldCheck, XCircle, AlertTriangle } from 'lucide-react';

const ApplicantStatusStepper = ({ status, processingStatus }) => {
  // Stepper steps: 1. Application Submitted, 2. Documents Uploaded, 3. AI Verification Completed, 4. Officer Review, 5. Final Decision

  let currentStep = 1;
  let decisionStatus = null; // APPROVED, REJECTED, CHANGES_REQUESTED

  if (status === 'APPROVED' || status === 'REJECTED' || status === 'CHANGES_REQUESTED') {
    currentStep = 5;
    decisionStatus = status;
  } else if (status === 'REVIEW_REQUIRED' || processingStatus === 'COMPLETED') {
    currentStep = 4;
  } else if (processingStatus === 'IN_PROGRESS' || processingStatus === 'OCR_DONE') {
    currentStep = 3;
  } else if (processingStatus === 'NOT_STARTED' || processingStatus === 'PENDING') {
    currentStep = 2;
  }

  const steps = [
    { title: "Application Submitted", label: "Submitted" },
    { title: "Documents Uploaded", label: "Uploaded" },
    { title: "AI Cross-Verification", label: processingStatus === 'IN_PROGRESS' ? "AI Processing..." : "AI Complete" },
    { title: "Officer Review", label: currentStep === 4 ? "Under Review" : (currentStep > 4 ? "Reviewed" : "Pending") },
    { title: "Final Decision", label: decisionStatus ? decisionStatus : "Awaiting Decision" }
  ];

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      marginBottom: '1.5rem'
    }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Live Application Progress
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: '1rem' }}>
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep || (stepNum === 5 && decisionStatus);
          const isCurrent = stepNum === currentStep && !decisionStatus;

          let stepColor = '#CBD5E1';
          let icon = <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{stepNum}</span>;

          if (isDone) {
            if (stepNum === 5 && decisionStatus === 'REJECTED') {
              stepColor = '#DC2626';
              icon = <XCircle size={18} color="#FFFFFF" />;
            } else if (stepNum === 5 && decisionStatus === 'CHANGES_REQUESTED') {
              stepColor = '#D97706';
              icon = <AlertTriangle size={18} color="#FFFFFF" />;
            } else {
              stepColor = '#16A34A';
              icon = <CheckCircle2 size={18} color="#FFFFFF" />;
            }
          } else if (isCurrent) {
            stepColor = '#2563EB';
            icon = <Clock size={18} color="#FFFFFF" />;
          }

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: '110px', textAlign: 'center', zIndex: 2 }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: stepColor,
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem',
                boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : undefined,
                transition: 'all 0.3s ease'
              }}>
                {icon}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isCurrent ? '#1D4ED8' : '#0F172A' }}>
                {step.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicantStatusStepper;
