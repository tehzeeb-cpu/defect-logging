import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Pencil, 
  Eye, 
  Trash2, 
  Calendar,
  X,
  Check
} from 'lucide-react';

export default function ActivitiesView({ filterOptions, showToast }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedParent, setSelectedParent] = useState('All');
  const [expandedId, setExpandedId] = useState(1); // Default Site Preparation expanded as in Image 5

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    sub_name: '',
    sub_description: '',
    sub_count: 10
  });

  const [editSubModal, setEditSubModal] = useState(null);
  const [viewSubModal, setViewSubModal] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedParent && selectedParent !== 'All') params.append('parent_activity', selectedParent);

      const res = await fetch(`/api/activities?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Failed to fetch activities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [search, selectedParent]);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    if (!newActivity.name.trim()) return;

    try {
      const payload = {
        name: newActivity.name,
        description: newActivity.description || 'Standard Quality Assured Construction Activity',
        sub_activities: newActivity.sub_name ? [
          {
            name: newActivity.sub_name,
            description: newActivity.sub_description || 'Operational Sub-Activity Specification',
            inspection_request_count: Number(newActivity.sub_count) || 0
          }
        ] : []
      };

      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast('Activity successfully created!');
        setShowAddModal(false);
        setNewActivity({ name: '', description: '', sub_name: '', sub_description: '', sub_count: 10 });
        fetchActivities();
      }
    } catch (err) {
      console.error(err);
      showToast('Error creating activity');
    }
  };

  const handleUpdateSubActivity = async (e) => {
    e.preventDefault();
    if (!editSubModal) return;

    try {
      const res = await fetch(`/api/sub-activities/${editSubModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editSubModal.name,
          description: editSubModal.description,
          inspection_request_count: Number(editSubModal.inspection_request_count)
        })
      });

      if (res.ok) {
        showToast('Sub-activity updated successfully!');
        setEditSubModal(null);
        fetchActivities();
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating sub-activity');
    }
  };

  const handleDeleteSubActivity = async (subId) => {
    if (!window.confirm('Are you sure you want to delete this sub-activity?')) return;
    try {
      const res = await fetch(`/api/sub-activities/${subId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Sub-activity deleted');
        fetchActivities();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '1 Dec 2023 | 11:00PM';
    const d = new Date(dateStr);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month} ${year} | ${hours}:${minutes}${ampm}`;
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="top-header">
        <h1 className="page-title">All Activities</h1>
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
            <span>Add New Activity</span>
          </button>
          <div className="avatar-circle">TH</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <span className="filter-label">Filter By</span>
        
        <select 
          className="filter-select"
          value={selectedParent}
          onChange={(e) => setSelectedParent(e.target.value)}
        >
          <option value="All">Parent Activity</option>
          {filterOptions.activities?.map(act => (
            <option key={act} value={act}>{act}</option>
          ))}
        </select>

        <div className="filter-date-badge">
          <span>1 Dec 2023</span>
          <Calendar size={15} color="#4B5563" />
        </div>
      </div>

      {/* Activities Accordion Table */}
      <div className="data-table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>Activity</th>
              <th style={{ width: '32%' }}>Description</th>
              <th style={{ width: '18%' }}>Total Sub Activities</th>
              <th style={{ width: '20%' }}>Date & Time</th>
              <th style={{ width: '8%', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                  Loading Sobha activities...
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                  No activities found matching criteria.
                </td>
              </tr>
            ) : (
              activities.map(act => {
                const isExpanded = expandedId === act.id;
                return (
                  <React.Fragment key={act.id}>
                    <tr 
                      className={`activity-row ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleExpand(act.id)}
                    >
                      <td style={{ fontWeight: '600', color: '#111827' }}>{act.name}</td>
                      <td style={{ color: '#4B5563' }}>{act.description}</td>
                      <td style={{ fontWeight: '600' }}>
                        {act.sub_activities_count || (act.name === 'Site Preparation' ? 14 : 14)}
                      </td>
                      <td style={{ color: '#374151', fontSize: '13px' }}>
                        {formatDate(act.created_at)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          type="button" 
                          className="icon-btn" 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(act.id);
                          }}
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Nested Sub-Activities Card */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="5" style={{ padding: '0 8px 16px 8px', backgroundColor: '#FAFAFC' }}>
                          <div className="nested-sub-card">
                            <table className="nested-table">
                              <thead>
                                <tr>
                                  <th style={{ width: '22%' }}>Sub Activity</th>
                                  <th style={{ width: '36%' }}>Description</th>
                                  <th style={{ width: '16%' }}>Insp. Req. Count</th>
                                  <th style={{ width: '18%' }}>Date</th>
                                  <th style={{ width: '8%', textAlign: 'center' }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {act.sub_activities && act.sub_activities.length > 0 ? (
                                  act.sub_activities.map(sub => (
                                    <tr key={sub.id}>
                                      <td style={{ fontWeight: '500', color: '#1F2937' }}>{sub.name}</td>
                                      <td>{sub.description}</td>
                                      <td style={{ fontWeight: '600', color: '#111827' }}>
                                        {sub.inspection_request_count}
                                      </td>
                                      <td>{formatDate(sub.created_at)}</td>
                                      <td style={{ textAlign: 'center' }}>
                                        <div className="action-icons" style={{ justifyContent: 'center' }}>
                                          <button 
                                            type="button" 
                                            className="icon-btn"
                                            title="Edit Sub Activity"
                                            onClick={() => setEditSubModal(sub)}
                                          >
                                            <Pencil size={15} />
                                          </button>
                                          <span className="action-divider">|</span>
                                          <button 
                                            type="button" 
                                            className="icon-btn"
                                            title="View Details"
                                            onClick={() => setViewSubModal(sub)}
                                          >
                                            <Eye size={15} />
                                          </button>
                                          <span className="action-divider">|</span>
                                          <button 
                                            type="button" 
                                            className="icon-btn delete"
                                            title="Delete"
                                            onClick={() => handleDeleteSubActivity(sub.id)}
                                          >
                                            <Trash2 size={15} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF' }}>
                                      No sub-activities registered yet for this activity.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Activity Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Construction Activity</h3>
              <button type="button" className="icon-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateActivity}>
              <div className="form-group">
                <label className="form-label">Activity Name *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Waterproofing Works"
                  required
                  value={newActivity.name}
                  onChange={e => setNewActivity({...newActivity, name: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Operational scope, technical specifications, QA/QC standards..."
                  value={newActivity.description}
                  onChange={e => setNewActivity({...newActivity, description: e.target.value})}
                />
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', marginTop: '16px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                  Initial Sub-Activity (Optional)
                </h4>
                <div className="form-group">
                  <label className="form-label">Sub-Activity Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Surface Cleaning & Primer"
                    value={newActivity.sub_name}
                    onChange={e => setNewActivity({...newActivity, sub_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Inspection Request Count</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="45"
                    value={newActivity.sub_count}
                    onChange={e => setNewActivity({...newActivity, sub_count: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-black">
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sub-Activity Modal */}
      {editSubModal && (
        <div className="modal-overlay" onClick={() => setEditSubModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Sub-Activity</h3>
              <button type="button" className="icon-btn" onClick={() => setEditSubModal(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateSubActivity}>
              <div className="form-group">
                <label className="form-label">Sub-Activity Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editSubModal.name}
                  onChange={e => setEditSubModal({...editSubModal, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea" 
                  value={editSubModal.description}
                  onChange={e => setEditSubModal({...editSubModal, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Inspection Request Count</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editSubModal.inspection_request_count}
                  onChange={e => setEditSubModal({...editSubModal, inspection_request_count: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditSubModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-black">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Sub-Activity Details Modal */}
      {viewSubModal && (
        <div className="modal-overlay" onClick={() => setViewSubModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Sub-Activity Inspection Specification</h3>
              <button type="button" className="icon-btn" onClick={() => setViewSubModal(null)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
              <div>
                <span style={{ color: '#6B7280', display: 'block', fontSize: '12px' }}>Name</span>
                <strong style={{ fontSize: '15px', color: '#111827' }}>{viewSubModal.name}</strong>
              </div>
              <div>
                <span style={{ color: '#6B7280', display: 'block', fontSize: '12px' }}>Description</span>
                <p style={{ marginTop: '4px', lineHeight: '1.5' }}>{viewSubModal.description}</p>
              </div>
              <div>
                <span style={{ color: '#6B7280', display: 'block', fontSize: '12px' }}>Total Inspection Requests</span>
                <span style={{ display: 'inline-block', marginTop: '4px', background: '#F3F4F6', padding: '4px 10px', borderRadius: '6px', fontWeight: '700' }}>
                  {viewSubModal.inspection_request_count} Requests
                </span>
              </div>
              <div>
                <span style={{ color: '#6B7280', display: 'block', fontSize: '12px' }}>Timestamp</span>
                <span>{formatDate(viewSubModal.created_at)}</span>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-black" onClick={() => setViewSubModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
