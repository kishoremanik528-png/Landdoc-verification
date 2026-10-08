import React from 'react';
import { 
  Bell, 
  Menu, 
  PlayCircle
} from 'lucide-react';
import GovernmentLogo from './GovernmentLogo';
import OfficerProfileDropdown from './OfficerProfileDropdown';

const Navbar = ({ activeTab, setActiveTab, unreadNotificationsCount, onOpenNotifications, onToggleSidebar, officer, onLogout }) => {

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: 0,
      zIndex: 80,
      boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.05)'
    }}>
      <div style={{
        padding: '0.75rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Left: Mobile Menu Toggle & Tamil Nadu Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onToggleSidebar}
            style={{
              background: 'transparent',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155'
            }}
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>

          <GovernmentLogo size={36} showText={true} lightTheme={true} />
        </div>

        {/* Right: Quick Actions & Officer Profile Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Hackathon Demo Button */}
          <button 
            onClick={() => setActiveTab('demo')}
            style={{
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              border: '1px solid #BFDBFE',
              padding: '0.45rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
          >
            <PlayCircle size={14} /> Demo Scenarios
          </button>

          {/* Notifications Trigger */}
          <button 
            onClick={onOpenNotifications}
            style={{
              position: 'relative',
              backgroundColor: '#F1F5F9',
              border: '1px solid #CBD5E1',
              padding: '0.5rem',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadNotificationsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '9999px',
                width: '18px',
                height: '18px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 2px #FFFFFF'
              }}>
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }} />

          {/* Officer Account Profile Dropdown */}
          <OfficerProfileDropdown officer={officer} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
