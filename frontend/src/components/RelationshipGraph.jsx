import React from 'react';
import { User, MapPin, FileText, Share2 } from 'lucide-react';

const RelationshipGraph = ({ graphData }) => {
  const nodes = graphData?.nodes || [];
  const edges = graphData?.edges || [];

  const getNodeIcon = (type) => {
    switch (type) {
      case 'PERSON':
        return <User size={18} color="#2563EB" />;
      case 'LAND_PARCEL':
        return <MapPin size={18} color="#16A34A" />;
      case 'DOCUMENT':
        return <FileText size={18} color="#D97706" />;
      default:
        return <Share2 size={18} color="#64748B" />;
    }
  };

  return (
    <div className="gov-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>Entity Relationship Graph</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Visualizing relationships between Applicant, Land Parcel, and Documents</p>
        </div>
      </div>

      <div style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '1.25rem',
        minHeight: '200px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {nodes.map((node, idx) => (
          <div 
            key={idx}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              padding: '0.85rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ backgroundColor: '#F1F5F9', padding: '0.5rem', borderRadius: '8px' }}>
              {getNodeIcon(node.type)}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{node.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{node.details}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelationshipGraph;
