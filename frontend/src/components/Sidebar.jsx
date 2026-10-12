import React from 'react';
import { 
  Settings, 
  ClipboardCheck, 
  AlertCircle,
  Activity,
  Layers,
  Building2,
  HardHat,
  HelpCircle,
  LayoutDashboard
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, sidebarTheme = 'sobha-dark' }) {
  // If in 'activity-light' mode matching Image 5 Activity.png
  if (sidebarTheme === 'activity-light') {
    return (
      <aside className="sidebar sidebar-light">
        <div className="sidebar-header" style={{ padding: '24px 24px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#000000' }} />
            <span style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B' }}>Logo</span>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-heading" style={{ color: '#94A3B8' }}>MAIN MENU</div>
          <nav className="sidebar-nav">
            <button type="button" className="nav-item nav-item-light">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button type="button" className="nav-item nav-item-light active-black">
              <ClipboardCheck size={18} />
              <span>Insp. Request</span>
              <span className="nav-badge-white">+19</span>
            </button>

            <button 
              type="button" 
              className={`nav-item nav-item-light ${currentView === 'activities' ? 'active-light-item' : ''}`}
              onClick={() => setCurrentView('activities')}
            >
              <Activity size={18} />
              <span>Activity</span>
            </button>

            <button type="button" className="nav-item nav-item-light">
              <Layers size={18} />
              <span>Division</span>
            </button>

            <button 
              type="button" 
              className="nav-item nav-item-light"
              onClick={() => setCurrentView('report')}
            >
              <Building2 size={18} />
              <span>Projects</span>
            </button>

            <button type="button" className="nav-item nav-item-light">
              <HardHat size={18} />
              <span>Foreman</span>
            </button>
          </nav>
        </div>

        <div className="sidebar-section" style={{ marginTop: 'auto' }}>
          <div className="sidebar-heading" style={{ color: '#94A3B8' }}>HELP & SUPPORT</div>
          <nav className="sidebar-nav">
            <button type="button" className="nav-item nav-item-light">
              <HelpCircle size={18} />
              <span>Help & Center</span>
            </button>
            <button type="button" className="nav-item nav-item-light">
              <Settings size={18} />
              <span>Setting</span>
            </button>
          </nav>
        </div>
      </aside>
    );
  }

  // Exact SOBHA Dark Sidebar matching Image 4 (Defect Threshold Mapping) & Defect Report.png
  const isDefectLoggingActive = currentView === 'thresholds' || currentView === 'report';

  return (
    <aside className="sidebar sidebar-sobha-dark">
      {/* Exact SOBHA Gold Serif Logo */}
      <div className="sidebar-header">
        <h2 className="sobha-logo-gold">SOBHA</h2>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">MAIN MENU</div>
        <nav className="sidebar-nav">
          {/* 1. Admin Configuration */}
          <button 
            type="button" 
            className="nav-item-sobha"
            onClick={() => setCurrentView('activities')}
          >
            <Settings size={19} className="nav-icon" />
            <span>Admin Configuration</span>
          </button>

          {/* 2. Inspection Requests */}
          <button 
            type="button" 
            className="nav-item-sobha"
            onClick={() => setCurrentView('activities')}
          >
            <ClipboardCheck size={19} className="nav-icon" />
            <span>Inspection Requests</span>
          </button>

          {/* 3. Defect Logging (Exact Tan Pill Button from mockups) */}
          <div className="defect-logging-wrapper">
            <button 
              type="button" 
              className={`nav-item-sobha defect-logging-btn ${isDefectLoggingActive ? 'active-tan-pill' : ''}`}
              onClick={() => {
                if (currentView === 'activities') {
                  setCurrentView('thresholds');
                }
              }}
            >
              {/* Exclamation point inside circle icon (!), matching screenshot */}
              <div className="exclamation-circle-icon">
                <span>!</span>
              </div>
              <span className="nav-label">Defect Logging</span>
            </button>

            {/* Seamless Sub-View Tabs for the 2 Defect Logging Screens */}
            {isDefectLoggingActive && (
              <div className="defect-sub-tabs">
                <button
                  type="button"
                  className={`defect-sub-tab-btn ${currentView === 'thresholds' ? 'active-sub' : ''}`}
                  onClick={() => setCurrentView('thresholds')}
                >
                  <span className="dot" />
                  <span>Threshold Mapping</span>
                </button>
                <button
                  type="button"
                  className={`defect-sub-tab-btn ${currentView === 'report' ? 'active-sub' : ''}`}
                  onClick={() => setCurrentView('report')}
                >
                  <span className="dot" />
                  <span>Defects Report</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Module Navigation Switcher at the bottom */}
      <div className="sidebar-bottom-switch">
        <div className="module-switch-title">SWITCH MOCKUP SCREEN</div>
        <div className="module-pills">
          <button
            type="button"
            className={`pill-btn ${currentView === 'thresholds' ? 'active' : ''}`}
            onClick={() => setCurrentView('thresholds')}
          >
            1. Threshold Mapping (Image 4)
          </button>
          <button
            type="button"
            className={`pill-btn ${currentView === 'report' ? 'active' : ''}`}
            onClick={() => setCurrentView('report')}
          >
            2. Defects Report (Image 1)
          </button>
          <button
            type="button"
            className={`pill-btn ${currentView === 'activities' ? 'active' : ''}`}
            onClick={() => setCurrentView('activities')}
          >
            3. All Activities (Image 5)
          </button>
        </div>

        <div style={{ marginTop: '12px' }}>
          <button
            type="button"
            style={{
              width: '100%',
              background: 'transparent',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
              color: '#C5A059',
              padding: '6px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              cursor: 'pointer'
            }}
            onClick={() => setSidebarTheme(sidebarTheme === 'sobha-dark' ? 'activity-light' : 'sobha-dark')}
          >
            Toggle {sidebarTheme === 'sobha-dark' ? 'Image 5 Light Sidebar' : 'Sobha Dark Sidebar'}
          </button>
        </div>
      </div>
    </aside>
  );
}
