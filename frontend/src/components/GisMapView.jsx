import React from 'react';
import { MapPin, Compass, CheckCircle } from 'lucide-react';

const GisMapView = ({ gisData }) => {
  const coords = gisData?.coordinates || { lat: 12.9750, lng: 80.2206 };
  const village = gisData?.village || "Velachery";
  const surveyNo = gisData?.survey_number || "123/2A";
  const verified = gisData?.boundary_verified !== false;

  return (
    <div className="gov-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>GIS Geospatial Parcel Validation</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Revenue Village Spatial Survey Coordinates & Boundary Overlay</p>
        </div>
        <span className={`badge ${verified ? 'badge-match' : 'badge-possible'}`}>
          <CheckCircle size={13} /> {verified ? 'SPATIAL BOUNDARY VALIDATED' : 'REGIONAL PARCEL MARKER'}
        </span>
      </div>

      <div style={{
        height: '180px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #0B3D91 0%, #1E3A8A 100%)',
        border: '1px solid #BFDBFE',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(11, 61, 145, 0.15)'
      }}>
        {/* Spatial Grid Effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 0)',
          backgroundSize: '20px 20px',
          opacity: 0.6
        }} />

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '50%',
          padding: '0.75rem',
          zIndex: 2,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <MapPin size={28} color="#2563EB" />
        </div>

        <div style={{ zIndex: 2, textAlign: 'center', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>
            Survey {surveyNo} — {village} Village
          </div>
          <div style={{ fontSize: '0.8rem', color: '#93C5FD', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            <Compass size={14} /> Coordinates: {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
          </div>
        </div>
      </div>
    </div>
  );
};

export default GisMapView;
