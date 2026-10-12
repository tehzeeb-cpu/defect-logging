import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ActivitiesView from './components/ActivitiesView';
import ThresholdMappingView from './components/ThresholdMappingView';
import DefectsReportView from './components/DefectsReportView';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const getInitialView = () => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view && ['activities', 'thresholds', 'report'].includes(view)) {
      return view;
    }
    return 'activities';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
  const [filterOptions, setFilterOptions] = useState({
    projects: [],
    divisions: [],
    sub_divisions: [],
    activities: [],
    sub_activities: [],
    defect_types: [],
    years: [2025, 2024, 2023],
    severities: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    controls: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  });

  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch('/api/filter-options');
        if (res.ok) {
          const data = await res.json();
          setFilterOptions(data);
        }
      } catch (err) {
        console.error('Error fetching global filter options:', err);
      }
    };
    fetchOptions();
  }, []);

  return (
    <div className="app-container">
      {/* Sobha Luxury Dark Sidebar */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Content Area */}
      <main className="main-wrapper">
        {currentView === 'activities' && (
          <ActivitiesView 
            filterOptions={filterOptions} 
            showToast={showToast} 
          />
        )}

        {currentView === 'thresholds' && (
          <ThresholdMappingView 
            filterOptions={filterOptions} 
            showToast={showToast} 
          />
        )}

        {currentView === 'report' && (
          <DefectsReportView 
            filterOptions={filterOptions} 
            showToast={showToast} 
          />
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className="toast-msg">
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
