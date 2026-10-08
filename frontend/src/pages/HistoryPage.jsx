import React, { useEffect, useState } from 'react';
import { History, Search, Eye, Filter, RefreshCw, FileText } from 'lucide-react';
import { getApplicationsHistory } from '../services/api';

const HistoryPage = ({ onViewApplication }) => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getApplicationsHistory();
      if (res.success) setApplications(res.applications);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.application_id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (app.applicant_name && app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRisk = filterRisk === 'ALL' || app.risk_level === filterRisk;
    return matchesSearch && matchesRisk;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>Application Queue & History</h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Database of registered land verification cases and officer review statuses.</p>
        </div>

        <button className="btn btn-secondary" onClick={fetchHistory}>
          <RefreshCw size={16} /> Refresh Records
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="gov-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '1rem 1.25rem' }}>
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Application Ref ID or Applicant Name..."
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="#64748B" />
          <select
            className="form-select"
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            style={{ minWidth: '160px' }}
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="gov-card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>Loading application records...</div>
        ) : filteredApps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>No matching applications found in database.</div>
        ) : (
          <div className="gov-table-wrapper" style={{ border: 'none' }}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Application Ref</th>
                  <th>Applicant Name</th>
                  <th>Documents</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 700, color: '#0B3D91' }}>{app.application_id}</td>
                    <td style={{ fontWeight: 600 }}>{app.applicant_name || 'N/A'}</td>
                    <td>{app.document_count} Documents</td>
                    <td>
                      <span className={`badge ${app.risk_level === 'LOW' ? 'badge-low' : app.risk_level === 'MEDIUM' ? 'badge-medium' : 'badge-high'}`}>
                        {app.risk_score}/100 ({app.risk_level})
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${app.status === 'VERIFIED' ? 'badge-match' : 'badge-info'}`}>{app.status}</span>
                    </td>
                    <td style={{ color: '#64748B', fontSize: '0.82rem' }}>
                      {app.created_at ? app.created_at.split('T')[0] : 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onViewApplication(app.application_id)}
                      >
                        <Eye size={14} /> Review Case
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
