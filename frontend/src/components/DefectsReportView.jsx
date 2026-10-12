import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export default function DefectsReportView({ filterOptions, showToast }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filter bar states
  const [filters, setFilters] = useState({
    project: 'Project',
    division: 'Division',
    subDivision: 'Sub-Division',
    activity: 'Activity',
    subActivity: 'Sub-Activity',
    defectType: 'Defect Type',
    year: '2025'
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filters.project && filters.project !== 'Project') params.append('project', filters.project);
      if (filters.division && filters.division !== 'Division') params.append('division', filters.division);
      if (filters.subDivision && filters.subDivision !== 'Sub-Division') params.append('sub_division', filters.subDivision);
      if (filters.activity && filters.activity !== 'Activity') params.append('activity', filters.activity);
      if (filters.subActivity && filters.subActivity !== 'Sub-Activity') params.append('sub_activity', filters.subActivity);
      if (filters.defectType && filters.defectType !== 'Defect Type') params.append('defect_type', filters.defectType);
      if (filters.year && filters.year !== 'Year') params.append('year', filters.year);

      const res = await fetch(`/api/defects-report?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [search, filters]);

  const handleDownload = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filters.project && filters.project !== 'Project') params.append('project', filters.project);
    if (filters.division && filters.division !== 'Division') params.append('division', filters.division);
    if (filters.subDivision && filters.subDivision !== 'Sub-Division') params.append('sub_division', filters.subDivision);
    if (filters.activity && filters.activity !== 'Activity') params.append('activity', filters.activity);
    if (filters.subActivity && filters.subActivity !== 'Sub-Activity') params.append('sub_activity', filters.subActivity);
    if (filters.defectType && filters.defectType !== 'Defect Type') params.append('defect_type', filters.defectType);
    if (filters.year && filters.year !== 'Year') params.append('year', filters.year);

    window.open(`/api/defects-report/export?${params.toString()}`, '_blank');
    showToast('Defects Report download initiated!');
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="top-header">
        <h1 className="page-title">Defects Report</h1>
        <div className="header-right">
          <div className="search-box">
            <Search size={16} color="#9CA3AF" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button 
            type="button" 
            className="btn-black"
            onClick={handleDownload}
          >
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Filter Bar matching Defect report.png */}
      <div className="filter-bar">
        <span className="filter-label">Filter By</span>

        <select 
          className="filter-select"
          value={filters.project}
          onChange={e => setFilters({...filters, project: e.target.value})}
        >
          <option value="Project">Project</option>
          {filterOptions.projects?.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <select 
          className="filter-select"
          value={filters.division}
          onChange={e => setFilters({...filters, division: e.target.value})}
        >
          <option value="Division">Division</option>
          {filterOptions.divisions?.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select 
          className="filter-select"
          value={filters.subDivision}
          onChange={e => setFilters({...filters, subDivision: e.target.value})}
        >
          <option value="Sub-Division">Sub-Division</option>
          {filterOptions.sub_divisions?.map(sd => <option key={sd} value={sd}>{sd}</option>)}
        </select>

        <select 
          className="filter-select"
          value={filters.activity}
          onChange={e => setFilters({...filters, activity: e.target.value})}
        >
          <option value="Activity">Activity</option>
          {filterOptions.activities?.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select 
          className="filter-select"
          value={filters.subActivity}
          onChange={e => setFilters({...filters, subActivity: e.target.value})}
        >
          <option value="Sub-Activity">Sub-Activity</option>
          {filterOptions.sub_activities?.map(sa => <option key={sa} value={sa}>{sa}</option>)}
        </select>

        <select 
          className="filter-select"
          value={filters.defectType}
          onChange={e => setFilters({...filters, defectType: e.target.value})}
        >
          <option value="Defect Type">Defect Type</option>
          {filterOptions.defect_types?.map(dt => <option key={dt} value={dt}>{dt}</option>)}
        </select>

        <select 
          className="filter-select"
          value={filters.year}
          onChange={e => setFilters({...filters, year: e.target.value})}
        >
          <option value="2025">Year - 2025</option>
          <option value="2024">Year - 2024</option>
          <option value="2023">Year - 2023</option>
        </select>
      </div>

      {/* Defects Report Table */}
      <div className="data-table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>SOU</th>
              <th style={{ width: '16%' }}>Projects</th>
              <th style={{ width: '15%' }}>Division</th>
              <th style={{ width: '12%' }}>Sub-Division</th>
              <th style={{ width: '14%' }}>Activity</th>
              <th style={{ width: '14%' }}>Sub-Activity</th>
              <th style={{ width: '11%' }}>Defect Type</th>
              <th style={{ width: '11%', textAlign: 'center' }}>Defect Threshold</th>
              <th style={{ width: '11%', textAlign: 'center' }}>Yearly Count</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                  Loading defect analytics report...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                  No defect logging records found for selected filters.
                </td>
              </tr>
            ) : (
              reports.map(row => {
                const isOverThreshold = row.yearly_count >= row.defect_threshold;
                return (
                  <tr key={row.id}>
                    <td style={{ fontWeight: '500', color: '#1F2937' }}>{row.sou}</td>
                    <td style={{ fontWeight: '500' }}>{row.project_name}</td>
                    <td>{row.division_name}</td>
                    <td>{row.sub_division_name}</td>
                    <td>{row.activity_name}</td>
                    <td>{row.sub_activity_name}</td>
                    <td style={{ fontWeight: '500' }}>{row.defect_type}</td>
                    <td style={{ textAlign: 'center', fontWeight: '600' }}>
                      {row.defect_threshold}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '600' }}>
                      <span 
                        style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          backgroundColor: isOverThreshold ? '#FEE2E2' : '#F3F4F6',
                          color: isOverThreshold ? '#DC2626' : '#1F2937'
                        }}
                      >
                        {row.yearly_count}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
