import React from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { markNotificationRead } from '../services/api';

const NotificationCenter = ({ isOpen, onClose, notifications = [], onRefresh }) => {
  if (!isOpen) return null;

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    if (onRefresh) onRefresh();
  };

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '24px',
      width: '360px',
      maxHeight: '480px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #CBD5E1',
      borderRadius: '16px',
      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '1rem 1.25rem',
        backgroundColor: '#0B3D91',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={18} color="#FFFFFF" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>Proactive Notification Center</h4>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', backgroundColor: '#F8FAFC' }}>
        {notifications.length === 0 ? (
          <p style={{ color: '#64748B', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No unread notifications.</p>
        ) : (
          notifications.map((n, idx) => (
            <div 
              key={idx}
              onClick={() => handleMarkRead(n.id)}
              style={{
                backgroundColor: n.is_read ? '#FFFFFF' : '#EFF6FF',
                border: n.is_read ? '1px solid #E2E8F0' : '1px solid #BFDBFE',
                borderRadius: '10px',
                padding: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: n.notification_type === 'HIGH_RISK' ? '#DC2626' : '#0F172A' }}>
                  {n.title}
                </h5>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  {n.created_at ? n.created_at.split('T')[0] : 'Just now'}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#334155' }}>{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
