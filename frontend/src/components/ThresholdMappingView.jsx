import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Pencil, 
  Trash2, 
  Plus, 
  ChevronRight,
  X,
  Check,
  Save
} from 'lucide-react';

export default function ThresholdMappingView({ filterOptions, showToast }) {
  const [mappings, setMappings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filter bar states
  const [filters, setFilters] = useState({
    project: 'Project',
    division: 'Division',
    subDivision: 'Sub-Division',
    activity: 'Activity',
    subActivity: 'Sub-Activity',
    severity: 'Severity',
    control: 'Control'
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDefect, setNewDefect] = useState({
    defect_type: '',
    defect_threshold: 50,
    sporadic_threshold: 5,
    chronic_threshold: 15,
    severity_index: 5,
    control_index: 5
  });

  const [editModal, setEditModal] = useState(null);

  const fetchMappings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filters.severity && filters.severity !== 'Severity') params.append('severity', filters.severity);
      if (filters.control && filters.control !== 'Control') params.append('control', filters.control);

      const res = await fetch(`/api/threshold-mappings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMappings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, [search]);

  const handleFilterSubmit = () => {
    fetchMappings();
    showToast('Filters applied');
  };

  const handleInputChange = (id, field, value) => {
    const numVal = parseInt(value, 10);
    setMappings(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: isNaN(numVal) ? 0 : numVal } : item))
    );
  };

  const handleSetAll = async () => {
    try {
      const payload = {
        items: mappings.map(m => ({
          id: m.id,
          defect_threshold: m.defect_threshold,
          sporadic_threshold: m.sporadic_threshold,
          chronic_threshold: m.chronic_threshold,
          severity_index: m.severity_index,
          control_index: m.control_index
        }))
      };

      const res = await fetch('/api/threshold-mappings/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        showToast(result.message || 'All defect threshold mappings updated!');
      } else {
        showToast('Error saving thresholds');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error while saving');
    }
  };

  const handleDeleteMapping = async (id) => {
    if (!window.confirm('Delete this defect threshold mapping?')) return;
    try {
      const res = await fetch(`/api/threshold-mappings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Defect threshold deleted');
        setMappings(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newDefect.defect_type.trim()) return;

    try {
      const res = await fetch('/api/threshold-mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDefect)
      });

      if (res.ok) {
        showToast('Defect mapping added successfully!');
        setShowAddModal(false);
        setNewDefect({
          defect_type: '',
          defect_threshold: 50,
          sporadic_threshold: 5,
          chronic_threshold: 15,
          severity_index: 5,
          control_index: 5
        });
        fetchMappings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditModalSubmit = async (e) => {
    e.preventDefault();
    if (!editModal) return;

    try {
      const res = await fetch(`/api/threshold-mappings/${editModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editModal)
      });

      if (res.ok) {
        showToast('Threshold mapping updated');
        setEditModal(null);
        fetchMappings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="top-header">
        <h1 className="page-title">Defect Threshold Mapping</h1>
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
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            <span>Add Defect Type</span>
          </button>
          <div className="avatar-circle">TH</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
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
          value={filters.severity}
          onChange={e => setFilters({...filters, severity: e.target.value})}
        >
          <option value="Severity">Severity</option>
          {filterOptions.severities?.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select 
          className="filter-select"
          value={filters.control}
          onChange={e => setFilters({...filters, control: e.target.value})}
        >
          <option value="Control">Control</option>
          {filterOptions.controls?.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button 
          type="button" 
          className="btn-black"
          style={{ padding: '7px 24px', borderRadius: '8px' }}
          onClick={handleFilterSubmit}
        >
          Filter
        </button>
      </div>

      {/* Threshold Mapping Table */}
      <div className="data-table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '26%' }}>Defect Type</th>
              <th style={{ width: '13%', textAlign: 'center' }}>Defect Threshold</th>
              <th style={{ width: '14%', textAlign: 'center' }}>Sporadic Threshold</th>
              <th style={{ width: '14%', textAlign: 'center' }}>Chronic Threshold</th>
              <th style={{ width: '12%', textAlign: 'center' }}>Severity Index</th>
              <th style={{ width: '12%', textAlign: 'center' }}>Control Index</th>
              <th style={{ width: '9%', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                  Loading threshold mapping metrics...
                </td>
              </tr>
            ) : mappings.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                  No threshold mappings found matching filter criteria.
                </td>
              </tr>
            ) : (
              mappings.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: '500', color: '#111827' }}>
                    {item.defect_type}
                  </td>
                  
                  {/* Defect Threshold Pill Input */}
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="number"
                      className="threshold-pill-input"
                      value={item.defect_threshold}
                      onChange={e => handleInputChange(item.id, 'defect_threshold', e.target.value)}
                    />
                  </td>

                  {/* Sporadic Threshold Pill Input */}
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="number"
                      className="threshold-pill-input"
                      value={item.sporadic_threshold}
                      onChange={e => handleInputChange(item.id, 'sporadic_threshold', e.target.value)}
                    />
                  </td>

                  {/* Chronic Threshold Pill Input */}
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="number"
                      className="threshold-pill-input"
                      value={item.chronic_threshold}
                      onChange={e => handleInputChange(item.id, 'chronic_threshold', e.target.value)}
                    />
                  </td>

                  {/* Severity Index Pill Input */}
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="number"
                      className="threshold-pill-input"
                      min="1"
                      max="10"
                      value={item.severity_index}
                      onChange={e => handleInputChange(item.id, 'severity_index', e.target.value)}
                    />
                  </td>

                  {/* Control Index Pill Input */}
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="number"
                      className="threshold-pill-input"
                      min="1"
                      max="10"
                      value={item.control_index}
                      onChange={e => handleInputChange(item.id, 'control_index', e.target.value)}
                    />
                  </td>

                  {/* Action Column */}
                  <td style={{ textAlign: 'center' }}>
                    <div className="action-icons" style={{ justifyContent: 'center' }}>
                      <button 
                        type="button" 
                        className="icon-btn"
                        title="Edit Row"
                        onClick={() => setEditModal(item)}
                      >
                        <Pencil size={15} />
                      </button>
                      <span className="action-divider">|</span>
                      <button 
                        type="button" 
                        className="icon-btn delete"
                        title="Delete"
                        onClick={() => handleDeleteMapping(item.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Batch Persistence Action */}
      <div className="bottom-actions">
        <button 
          type="button" 
          className="btn-bottom-pill"
          onClick={handleSetAll}
        >
          <span>Set All</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Add New Defect Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Defect Threshold Mapping</h3>
              <button type="button" className="icon-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Defect Type *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Paint blister or Tile crack"
                  required
                  value={newDefect.defect_type}
                  onChange={e => setNewDefect({...newDefect, defect_type: e.target.value})}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Defect Threshold</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newDefect.defect_threshold}
                    onChange={e => setNewDefect({...newDefect, defect_threshold: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sporadic Threshold</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newDefect.sporadic_threshold}
                    onChange={e => setNewDefect({...newDefect, sporadic_threshold: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Chronic Threshold</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={newDefect.chronic_threshold}
                    onChange={e => setNewDefect({...newDefect, chronic_threshold: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Severity Index (1-10)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    className="form-input" 
                    value={newDefect.severity_index}
                    onChange={e => setNewDefect({...newDefect, severity_index: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Control Index (1-10)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  className="form-input" 
                  value={newDefect.control_index}
                  onChange={e => setNewDefect({...newDefect, control_index: Number(e.target.value)})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-black">
                  Save Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Threshold Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Threshold Parameters</h3>
              <button type="button" className="icon-btn" onClick={() => setEditModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditModalSubmit}>
              <div className="form-group">
                <label className="form-label">Defect Type</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editModal.defect_type}
                  onChange={e => setEditModal({...editModal, defect_type: e.target.value})}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Defect Threshold</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editModal.defect_threshold}
                    onChange={e => setEditModal({...editModal, defect_threshold: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sporadic Threshold</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editModal.sporadic_threshold}
                    onChange={e => setEditModal({...editModal, sporadic_threshold: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Chronic Threshold</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editModal.chronic_threshold}
                    onChange={e => setEditModal({...editModal, chronic_threshold: Number(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Severity Index (1-10)</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    className="form-input" 
                    value={editModal.severity_index}
                    onChange={e => setEditModal({...editModal, severity_index: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Control Index (1-10)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="10" 
                  className="form-input" 
                  value={editModal.control_index}
                  onChange={e => setEditModal({...editModal, control_index: Number(e.target.value)})}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-black">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
