import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import FloatingAssistant from './components/FloatingAssistant';
import NotificationCenter from './components/NotificationCenter';
import DocumentSimplifierModal from './components/DocumentSimplifierModal';
import GovernmentLogo from './components/GovernmentLogo';

import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import DemoScenariosPage from './pages/DemoScenariosPage';
import ApplicantAuthPage from './pages/ApplicantAuthPage';
import ApplicantDashboardPage from './pages/ApplicantDashboardPage';
import ApplicantNewAppPage from './pages/ApplicantNewAppPage';

import { getNotifications } from './services/api';

const OFFICER_STORAGE_KEY = 'landguard_officer';
const APPLICANT_STORAGE_KEY = 'landguard_applicant';

const defaultOfficer = {
  name: "Kishore Manik",
  role: "Verification Officer",
  department: "Revenue & Disaster Management Dept",
  officer_id: "OFF-TN-9081",
  district: "Trichy",
  taluk: "Trichy"
};

const defaultApplicant = {
  name: "Kishore Kumar",
  email: "kishore.kumar@gmail.com",
  phone_number: "9876543210",
  role: "APPLICANT"
};

const App = () => {
  // Portal State: 'selection' | 'applicant' | 'officer'
  const [portal, setPortal] = useState('selection');

  // Officer Session
  const [isOfficerLoggedIn, setIsOfficerLoggedIn] = useState(() => {
    try { return !!localStorage.getItem(OFFICER_STORAGE_KEY); } catch { return false; }
  });
  const [officer, setOfficer] = useState(() => {
    try {
      const saved = localStorage.getItem(OFFICER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultOfficer;
    } catch { return defaultOfficer; }
  });

  // Applicant Session
  const [isApplicantLoggedIn, setIsApplicantLoggedIn] = useState(() => {
    try { return !!localStorage.getItem(APPLICANT_STORAGE_KEY); } catch { return false; }
  });
  const [applicant, setApplicant] = useState(() => {
    try {
      const saved = localStorage.getItem(APPLICANT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultApplicant;
    } catch { return defaultApplicant; }
  });

  // Active Tab for active portal
  const [officerTab, setOfficerTab] = useState('dashboard');
  const [applicantTab, setApplicantTab] = useState('dashboard');

  const [currentAppId, setCurrentAppId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSimplifierOpen, setIsSimplifierOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      if (res.success) setNotifications(res.notifications);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOfficerLoggedIn || isApplicantLoggedIn) {
      fetchNotifs();
    }
  }, [isOfficerLoggedIn, isApplicantLoggedIn]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleOfficerLoginSuccess = (officerData) => {
    setOfficer(officerData);
    setIsOfficerLoggedIn(true);
    setOfficerTab('dashboard');
    try {
      localStorage.setItem(OFFICER_STORAGE_KEY, JSON.stringify(officerData));
    } catch (e) {
      console.error('Failed to save officer session', e);
    }
  };

  const handleOfficerLogout = () => {
    setIsOfficerLoggedIn(false);
    setOfficer(defaultOfficer);
    setOfficerTab('dashboard');
    try { localStorage.removeItem(OFFICER_STORAGE_KEY); } catch {}
  };

  const handleApplicantAuthSuccess = (applicantData) => {
    setApplicant(applicantData);
    setIsApplicantLoggedIn(true);
    setApplicantTab('dashboard');
    try {
      localStorage.setItem(APPLICANT_STORAGE_KEY, JSON.stringify(applicantData));
    } catch (e) {
      console.error('Failed to save applicant session', e);
    }
  };

  const handleApplicantLogout = () => {
    setIsApplicantLoggedIn(false);
    setApplicant(defaultApplicant);
    setApplicantTab('dashboard');
    try { localStorage.removeItem(APPLICANT_STORAGE_KEY); } catch {}
  };

  const handleProcessingStarted = (appId) => {
    setCurrentAppId(appId);
    setOfficerTab('processing');
  };

  const handleProcessingComplete = (appId) => {
    setCurrentAppId(appId);
    setOfficerTab('dashboard');
    fetchNotifs();
  };

  // RENDER 1: SELECTION LANDING PAGE
  if (portal === 'selection') {
    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <GovernmentLogo size={36} showText={true} lightTheme={true} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setPortal('applicant')} style={{ fontSize: '0.85rem' }}>
              Applicant Portal
            </button>
            <button className="btn btn-gov" onClick={() => setPortal('officer')} style={{ fontSize: '0.85rem' }}>
              Officer Portal
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem 1.5rem' }}>
          <LandingPage
            onSelectApplicantPortal={() => setPortal('applicant')}
            onSelectOfficerPortal={() => setPortal('officer')}
            onLaunchDemo={() => { setPortal('officer'); setOfficerTab('demo'); }}
          />
        </main>

        <Footer />
      </div>
    );
  }

  // RENDER 2: APPLICANT PORTAL
  if (portal === 'applicant') {
    if (!isApplicantLoggedIn) {
      return (
        <ApplicantAuthPage
          onAuthSuccess={handleApplicantAuthSuccess}
          onBackToRoleSelection={() => setPortal('selection')}
        />
      );
    }

    return (
      <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Applicant Top Bar */}
        <header style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0.85rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', sticky: 'top', zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <GovernmentLogo size={34} showText={true} lightTheme={true} />
            <span className="badge badge-info" style={{ fontSize: '0.75rem', backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              CITIZEN APPLICANT PORTAL
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setApplicantTab('dashboard')}
              style={{ background: 'none', border: 'none', fontWeight: applicantTab === 'dashboard' ? 800 : 600, color: applicantTab === 'dashboard' ? '#2563EB' : '#64748B', cursor: 'pointer', fontSize: '0.88rem' }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setApplicantTab('new-app')}
              style={{ background: 'none', border: 'none', fontWeight: applicantTab === 'new-app' ? 800 : 600, color: applicantTab === 'new-app' ? '#2563EB' : '#64748B', cursor: 'pointer', fontSize: '0.88rem' }}
            >
              + New Application
            </button>

            <div style={{ height: '20px', width: '1px', backgroundColor: '#CBD5E1' }} />

            <button
              onClick={() => setPortal('selection')}
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', color: '#475569' }}
            >
              Portal Selection Hub
            </button>

            <button
              onClick={handleApplicantLogout}
              style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Logout
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          {applicantTab === 'dashboard' && (
            <ApplicantDashboardPage
              applicant={applicant}
              onStartNewApp={() => setApplicantTab('new-app')}
            />
          )}

          {applicantTab === 'new-app' && (
            <ApplicantNewAppPage
              applicant={applicant}
              onSubmissionSuccess={() => setApplicantTab('dashboard')}
              onCancel={() => setApplicantTab('dashboard')}
            />
          )}
        </main>

        <Footer />
      </div>
    );
  }

  // RENDER 3: GOVERNMENT OFFICER PORTAL
  if (portal === 'officer') {
    if (!isOfficerLoggedIn) {
      return (
        <div>
          <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0.75rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <GovernmentLogo size={32} showText={true} lightTheme={true} />
            <button
              onClick={() => setPortal('selection')}
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', padding: '0.4rem 0.85rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              ← Back to Portal Selection
            </button>
          </div>
          <LoginPage onLoginSuccess={handleOfficerLoginSuccess} />
        </div>
      );
    }

    return (
      <div className="app-container">
        {/* Officer Sidebar Navigation */}
        <Sidebar
          activeTab={officerTab}
          setActiveTab={setOfficerTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenNotifications={() => setIsNotifOpen(prev => !prev)}
          unreadCount={unreadCount}
        />

        <div style={{
          paddingLeft: window.innerWidth > 768 ? '260px' : '0',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'padding-left 0.25s ease-in-out'
        }}>
          {/* Top Header with Portal Switcher */}
          <Navbar
            activeTab={officerTab}
            setActiveTab={setOfficerTab}
            unreadNotificationsCount={unreadCount}
            onOpenNotifications={() => setIsNotifOpen(prev => !prev)}
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
            officer={officer}
            onLogout={handleOfficerLogout}
          />

          {/* Top Bar Switcher Indicator */}
          <div style={{ backgroundColor: '#0B3D91', color: '#FFFFFF', padding: '0.35rem 1.75rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🏛️ GOVERNMENT OFFICER PORTAL — Assigned Jurisdiction: <strong>{officer?.district || 'Trichy'} District / {officer?.taluk || 'Trichy'} Taluk</strong></span>
            <button
              onClick={() => setPortal('selection')}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700 }}
            >
              Switch Portal Hub
            </button>
          </div>

          {/* Notification Center Drawer */}
          <NotificationCenter
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
            notifications={notifications}
            onRefresh={fetchNotifs}
          />

          {/* Main Page Content */}
          <main className="main-content">
            {officerTab === 'upload' && (
              <UploadPage
                onProcessingStarted={handleProcessingStarted}
              />
            )}

            {officerTab === 'processing' && (
              <ProcessingPage
                appId={currentAppId}
                onComplete={handleProcessingComplete}
              />
            )}

            {officerTab === 'dashboard' && (
              <DashboardPage
                appId={currentAppId}
                officer={officer}
              />
            )}

            {officerTab === 'history' && (
              <HistoryPage
                onViewApplication={(appId) => {
                  setCurrentAppId(appId);
                  setOfficerTab('dashboard');
                }}
              />
            )}

            {officerTab === 'demo' && (
              <DemoScenariosPage
                onScenarioExecuted={handleProcessingComplete}
              />
            )}
          </main>

          {/* Document Simplifier Modal */}
          <DocumentSimplifierModal
            isOpen={isSimplifierOpen}
            onClose={() => setIsSimplifierOpen(false)}
          />

          {/* Floating Voice/Conversational Assistant */}
          <FloatingAssistant
            currentAppId={currentAppId}
            onOpenSimplifier={() => setIsSimplifierOpen(true)}
          />

          {/* Footer */}
          <Footer />
        </div>
      </div>
    );
  }

  return null;
};

export default App;

