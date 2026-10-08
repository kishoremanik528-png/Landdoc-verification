import React from 'react';
import { AlertOctagon, ShieldAlert, ShieldCheck, Info } from 'lucide-react';

const RiskScoreBadge = ({ score = 0, level = 'LOW', factors = [] }) => {
  let color = '#16A34A';
  let Icon = ShieldCheck;
  let bg = '#F0FDF4';
  let borderColor = '#86EFAC';

  if (level === 'CRITICAL' || score >= 75) {
    color = '#991B1B';
    Icon = AlertOctagon;
    bg = '#FEE2E2';
    borderColor = '#F87171';
  } else if (level === 'HIGH' || score >= 50) {
    color = '#DC2626';
    Icon = ShieldAlert;
    bg = '#FEE2E2';
    borderColor = '#FCA5A5';
  } else if (level === 'MEDIUM' || score >= 25) {
    color = '#D97706';
    Icon = Info;
    bg = '#FEF3C7';
    borderColor = '#FDE68A';
  }

  return (
    <div className="gov-card" style={{ backgroundColor: bg, borderColor: borderColor }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '0.6rem', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <Icon size={28} color={color} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Transparent Risk Engine</h3>
            <p style={{ fontSize: '0.8rem', color: '#475569' }}>Weighted Anomaly Score (0–100)</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: color, lineHeight: 1 }}>
            {score}<span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 500 }}>/100</span>
          </div>
          <span className="badge" style={{ backgroundColor: '#FFFFFF', color: color, borderColor: borderColor, marginTop: '0.35rem' }}>
            {level} RISK
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)', height: '10px', borderRadius: '5px', overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{
          width: `${Math.min(score, 100)}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '5px',
          transition: 'width 0.8s ease-in-out'
        }} />
      </div>

      {/* Factors List */}
      {factors && factors.length > 0 && (
        <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '0.85rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 700, marginBottom: '0.4rem' }}>Identified Risk Factors:</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {factors.map((factor, idx) => (
              <li key={idx} style={{ fontSize: '0.82rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                <span style={{ color: color }}>•</span> {factor}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RiskScoreBadge;
