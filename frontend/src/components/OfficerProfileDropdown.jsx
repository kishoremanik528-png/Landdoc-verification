import React, { useState, useRef, useEffect } from 'react';
import { User, Shield, Building, ChevronDown, LogOut, Settings, Bell } from 'lucide-react';

const OfficerProfileDropdown = ({ officer, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const defaultOfficer = {
    name: "Kishore Manik",
    role: "Verification Officer",
    department: "Revenue and Disaster Management Dept",
    officer_id: "OFF-TN-2026-9081"
  };

  const activeOfficer = officer || defaultOfficer;

  const getInitials = (name) => {
    if (!name) return 'OF';
    const clean = name.replace(/[^a-zA-Z\s]/g, ' ').trim();
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return name.slice(0, 2).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Officer Profile Pill Header Trigger */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: '#FFFFFF',
          border: '1px solid #CBD5E1',
          padding: '0.35rem 0.75rem 0.35rem 0.4rem',
          borderRadius: '30px',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#0B3D91',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '0.8rem',
          border: '2px solid #60A5FA'
        }}>
          {getInitials(activeOfficer.name)}
        </div>

        <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
            {activeOfficer.name}
          </div>
          <div style={{ fontSize: '0.68rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <span>{activeOfficer.role || 'Verification Officer'}</span>
          </div>
        </div>

        <ChevronDown size={14} color="#64748B" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '120%',
          right: 0,
          width: '260px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
          zIndex: 200,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>{activeOfficer.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>{activeOfficer.role}</div>
            <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.2rem' }}>{activeOfficer.department}</div>
            <div style={{ fontSize: '0.7rem', color: '#0B3D91', fontWeight: 700, marginTop: '0.2rem' }}>ID: {activeOfficer.officer_id}</div>
          </div>

          <div style={{ padding: '0.4rem 0' }}>
            <button 
              onClick={() => { alert(`Officer Profile:\nName: ${activeOfficer.name}\nRole: ${activeOfficer.role}\nDept: ${activeOfficer.department}\nID: ${activeOfficer.officer_id}`); setIsOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', border: 'none', background: 'none', textAlign: 'left', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}
            >
              <User size={16} color="#64748B" /> My Profile & Credentials
            </button>

            <button 
              onClick={() => { alert(`Department Info:\n${activeOfficer.department}\nGovernment of Tamil Nadu`); setIsOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', border: 'none', background: 'none', textAlign: 'left', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}
            >
              <Building size={16} color="#64748B" /> Department Portal
            </button>

            <button 
              onClick={() => { alert("Settings page"); setIsOpen(false); }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', border: 'none', background: 'none', textAlign: 'left', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}
            >
              <Settings size={16} color="#64748B" /> Security Settings
            </button>
          </div>

          <div style={{ borderTop: '1px solid #E2E8F0', padding: '0.4rem 0' }}>
            <button 
              onClick={() => {
                setIsOpen(false);
                if (onLogout) onLogout();
              }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', border: 'none', background: 'none', textAlign: 'left', fontSize: '0.85rem', color: '#DC2626', fontWeight: 600, cursor: 'pointer' }}
            >
              <LogOut size={16} color="#DC2626" /> Officer Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerProfileDropdown;
