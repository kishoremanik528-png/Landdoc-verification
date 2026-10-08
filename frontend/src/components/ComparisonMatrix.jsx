import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react';

const ComparisonMatrix = ({ verificationMatrix = [] }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'MATCH':
        return <span className="badge badge-match"><CheckCircle2 size={13} /> MATCH</span>;
      case 'POSSIBLE_MATCH':
        return <span className="badge badge-possible"><AlertCircle size={13} /> REVIEW</span>;
      case 'MISMATCH':
        return <span className="badge badge-mismatch"><XCircle size={13} /> MISMATCH</span>;
      default:
        return <span className="badge badge-info"><HelpCircle size={13} /> NO DATA</span>;
    }
  };

  const getDocValue = (details = {}, docType) => {
    return details[docType] || <span style={{ color: '#94A3B8', italic: 'true' }}>— Not Found —</span>;
  };

  return (
    <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Field-by-Field Cross-Document Verification Matrix</h3>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>Side-by-side comparison of extracted values across Patta, Chitta, Encumbrance Certificate (EC), and Sale Deed.</p>
      </div>

      <div className="gov-table-wrapper" style={{ border: 'none' }}>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Target Field</th>
              <th>Verification Status</th>
              <th>PATTA</th>
              <th>CHITTA</th>
              <th>ENCUMBRANCE (EC)</th>
              <th>SALE DEED</th>
            </tr>
          </thead>
          <tbody>
            {verificationMatrix.map((item, idx) => {
              const isMismatch = item.verification_status === 'MISMATCH';
              return (
                <tr 
                  key={idx} 
                  style={{ 
                    backgroundColor: isMismatch ? '#FEF2F2' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <td style={{ fontWeight: 700, color: isMismatch ? '#991B1B' : '#0F172A' }}>
                    {item.field_name ? item.field_name.replace('_', ' ').toUpperCase() : 'FIELD'}
                  </td>
                  <td>
                    {getStatusBadge(item.verification_status)}
                  </td>
                  <td style={{ fontWeight: 600, color: '#334155' }}>
                    {getDocValue(item.details, 'PATTA')}
                  </td>
                  <td style={{ fontWeight: 600, color: '#334155' }}>
                    {getDocValue(item.details, 'CHITTA')}
                  </td>
                  <td style={{ fontWeight: 600, color: '#334155' }}>
                    {getDocValue(item.details, 'ENCUMBRANCE_CERTIFICATE')}
                  </td>
                  <td style={{ fontWeight: 600, color: isMismatch ? '#DC2626' : '#334155' }}>
                    {getDocValue(item.details, 'SALE_DEED')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonMatrix;
