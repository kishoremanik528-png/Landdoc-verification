import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid #E2E8F0',
      backgroundColor: '#FFFFFF',
      padding: '1.5rem 0',
      marginTop: '3rem',
      color: '#64748B',
      fontSize: '0.85rem'
    }}>
      <div style={{
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#D97706', fontWeight: 600 }}>
          <AlertCircle size={16} />
          <span>Official AI Decision Support Notice</span>
        </div>
        <p style={{ maxWidth: '800px', color: '#475569', fontSize: '0.825rem' }}>
          AI recommendations are for verification assistance only. Final decisions remain with authorized human officers.
          LANDGUARD AI does not perform legal identity validation or auto-issue ownership titles.
        </p>
        <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
          Department of Revenue & Land Records • Built for 24-Hour Hackathon Demo Platform
        </p>
      </div>
    </footer>
  );
};

export default Footer;
