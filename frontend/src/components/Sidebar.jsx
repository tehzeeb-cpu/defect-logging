import React from 'react';
import { 
  Settings, 
  ClipboardCheck, 
  AlertTriangle, 
  Activity, 
  Layers, 
  Building2, 
  HardHat, 
  HelpCircle, 
  SlidersHorizontal,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sobha-brand-logo">
          SOBHA
          <span className="tag">QUALITY</span>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">MAIN MENU</div>
        <nav className="sidebar-nav">
          <button 
            type="button" 
            className="nav-item"
            onClick={() => setCurrentView('activities')}
          >
            <Settings size={18} />
            <span>Admin Configuration</span>
          </button>

          <button 
            type="button" 
            className="nav-item"
            onClick={() => setCurrentView('activities')}
          >
            <ClipboardCheck size={18} />
            <span>Inspection Requests</span>
            <span className="nav-badge">+19</span>
          </button>

          {/* Defect Management Section / Views */}
          <div style={{ marginTop: '6px', marginBottom: '4px' }}>
            <div 
              style={{
                fontSize: '11px',
                color: '#C59F59',
                fontWeight: '700',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase'
              }}
            >
              <AlertTriangle size={14} color="#C59F59" />
              <span>Defect Logging</span>
            </div>

            <button 
              type="button" 
              className={`nav-item ${currentView === 'activities' ? 'active' : ''}`}
              onClick={() => setCurrentView('activities')}
              style={{ paddingLeft: '28px' }}
            >
              <Activity size={16} />
              <span>All Activities</span>
            </button>

            <button 
              type="button" 
              className={`nav-item ${currentView === 'thresholds' ? 'active' : ''}`}
              onClick={() => setCurrentView('thresholds')}
              style={{ paddingLeft: '28px' }}
            >
              <SlidersHorizontal size={16} />
              <span>Threshold Mapping</span>
            </button>

            <button 
              type="button" 
              className={`nav-item ${currentView === 'report' ? 'active' : ''}`}
              onClick={() => setCurrentView('report')}
              style={{ paddingLeft: '28px' }}
            >
              <FileSpreadsheet size={16} />
              <span>Defects Report</span>
            </button>
          </div>

          <button 
            type="button" 
            className="nav-item"
            onClick={() => setCurrentView('activities')}
          >
            <Layers size={18} />
            <span>Division</span>
          </button>

          <button 
            type="button" 
            className="nav-item"
            onClick={() => setCurrentView('report')}
          >
            <Building2 size={18} />
            <span>Projects</span>
          </button>

          <button 
            type="button" 
            className="nav-item"
          >
            <HardHat size={18} />
            <span>Foreman</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-section" style={{ marginTop: 'auto' }}>
        <div className="sidebar-heading">HELP & SUPPORT</div>
        <nav className="sidebar-nav">
          <button type="button" className="nav-item">
            <HelpCircle size={18} />
            <span>Help & Center</span>
          </button>
          <button type="button" className="nav-item">
            <Settings size={18} />
            <span>Setting</span>
          </button>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="avatar-circle" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
            TH
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              Tehzeeb Hussain
            </div>
            <div style={{ fontSize: '11px', color: '#8E9299' }}>Quality Lead</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
