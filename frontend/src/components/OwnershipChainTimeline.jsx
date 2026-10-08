import React from 'react';
import { GitCommit, AlertTriangle, ArrowRight } from 'lucide-react';

const OwnershipChainTimeline = ({ chainRecords = [] }) => {
  return (
    <div className="gov-card">
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Ownership Chain Sequence Analysis</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Tracking historical title transfers across registered sale deeds</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative' }}>
        {chainRecords.map((item, idx) => {
          const isGap = item.owner_name?.includes("GAP") || item.owner_name?.includes("UNVERIFIED");

          return (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '0.85rem 1rem',
                backgroundColor: isGap ? '#FEF2F2' : '#F8FAFC',
                border: isGap ? '1px dashed #F87171' : '1px solid #E2E8F0',
                borderRadius: '10px'
              }}
            >
              <div style={{
                backgroundColor: isGap ? '#DC2626' : '#2563EB',
                color: '#FFFFFF',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {item.sequence_order || idx + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: isGap ? '#DC2626' : '#0F172A' }}>
                    {item.owner_name}
                  </h4>
                  {isGap && (
                    <span className="badge badge-mismatch">
                      <AlertTriangle size={12} /> UNVERIFIED TRANSFER GAP
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <span>Prev Owner: <strong style={{ color: '#0F172A' }}>{item.previous_owner || 'N/A'}</strong></span>
                  <span>Transfer Date: <strong style={{ color: '#0F172A' }}>{item.transfer_date || 'N/A'}</strong></span>
                  <span>Source: <strong style={{ color: '#0F172A' }}>{item.source_document || 'N/A'}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OwnershipChainTimeline;
