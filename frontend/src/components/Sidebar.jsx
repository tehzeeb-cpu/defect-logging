import React from 'react';
import { 
  Settings, 
  ClipboardCheck, 
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const isDefectLoggingActive = currentView === 'thresholds' || currentView === 'report';

  return (
    <aside className="sidebar sidebar-sobha-dark">
      {/* SOBHA Brand Header */}
      <div className="sidebar-header">
        <h2 className="sobha-logo-gold">SOBHA</h2>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">MAIN MENU</div>
        <nav className="sidebar-nav">
          {/* Admin Configuration */}
          <button 
            type="button" 
            className="nav-item-sobha"
            onClick={() => setCurrentView('activities')}
          >
            <Settings size={19} className="nav-icon" />
            <span>Admin Configuration</span>
          </button>

          {/* Inspection Requests */}
          <button 
            type="button" 
            className={`nav-item-sobha ${currentView === 'activities' ? 'active-menu-item' : ''}`}
            onClick={() => setCurrentView('activities')}
          >
            <ClipboardCheck size={19} className="nav-icon" />
            <span>Inspection Requests</span>
            <span className="nav-badge-white">+19</span>
          </button>

          {/* Defect Logging */}
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
              <div className="exclamation-circle-icon">
                <span>!</span>
              </div>
              <span className="nav-label">Defect Logging</span>
            </button>

            {/* Sub-Views for Defect Management */}
            {isDefectLoggingActive && (
              <div className="defect-sub-tabs">
                <button
                  type="button"
                  className={`defect-sub-tab-btn ${currentView === 'thresholds' ? 'active-sub' : ''}`}
                  onClick={() => setCurrentView('thresholds')}
                >
                  <SlidersHorizontal size={14} />
                  <span>Threshold Mapping</span>
                </button>
                <button
                  type="button"
                  className={`defect-sub-tab-btn ${currentView === 'report' ? 'active-sub' : ''}`}
                  onClick={() => setCurrentView('report')}
                >
                  <FileSpreadsheet size={14} />
                  <span>Defects Report</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}
