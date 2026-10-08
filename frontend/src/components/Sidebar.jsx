import React from 'react';
import { 
  LayoutDashboard, 
  FilePlus, 
  History, 
  PlayCircle, 
  Cpu, 
  FileText, 
  Bell, 
  UserCheck, 
  ChevronRight, 
  X,
  Bot
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, onOpenNotifications, unreadCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Officer Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'New Verification', icon: FilePlus },
    { id: 'history', label: 'Application Queue', icon: History },
    { id: 'demo', label: 'Demo Scenarios', icon: PlayCircle },
    { id: 'processing', label: 'AI Processing Stepper', icon: Cpu },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            zIndex: 90,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0B3D91',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 100,
        transition: 'transform 0.25s ease-in-out',
        transform: isOpen || window.innerWidth > 768 ? 'translateX(0)' : 'translateX(-100%)',
        boxShadow: '4px 0 15px rgba(11, 61, 145, 0.15)'
      }}>
        {/* Top Brand Header */}
        <div style={{
          padding: '1.25rem 1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: '#2563EB',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)'
            }}>
              <UserCheck size={22} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em', color: '#FFFFFF', lineHeight: 1.2 }}>
                LANDGUARD <span style={{ color: '#60A5FA' }}>AI</span>
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#93C5FD', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Officer Portal
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: window.innerWidth <= 768 ? 'block' : 'none'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav style={{ flex: 1, padding: '1.25rem 0.75rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem 0.75rem 0.75rem' }}>
            Main Operations
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth <= 768) onClose();
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.35rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease-in-out',
                  backgroundColor: isActive ? '#2563EB' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#DBEAFE',
                  boxShadow: isActive ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none'
                }}
              >
                <Icon size={18} color={isActive ? '#FFFFFF' : '#93C5FD'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <ChevronRight size={16} color="#FFFFFF" />}
              </button>
            );
          })}

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)', margin: '1rem 0.75rem' }} />

          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.75rem 0.75rem 0.75rem' }}>
            Officer Tools
          </div>

          <button
            onClick={() => {
              onOpenNotifications();
              if (window.innerWidth <= 768) onClose();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              marginBottom: '0.35rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: '#DBEAFE'
            }}
          >
            <Bell size={18} color="#93C5FD" />
            <span style={{ flex: 1 }}>Notifications</span>
            {unreadCount > 0 && (
              <span style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '0.15rem 0.5rem',
                fontSize: '0.7rem',
                fontWeight: 700
              }}>
                {unreadCount}
              </span>
            )}
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
