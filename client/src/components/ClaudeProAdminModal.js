import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { Sparkles, Search, Check, X, Clock, Award, Filter, RefreshCw } from 'lucide-react';
import './ClaudeProAdminModal.css';

export default function ClaudeProAdminModal({ isOpen, onClose }) {
  const [applicants, setApplicants] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('applied');
  const [sortBy, setSortBy] = useState('score');
  const [order, setOrder] = useState('desc');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '25',
        status: statusFilter,
        sortBy,
        order,
        ...(search ? { search } : {}),
      });
      const res = await api(`/learn/claude-pro/applicants?${params.toString()}`);
      if (res?.data) {
        setApplicants(res.data.applicants || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load Claude Pro applicants:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sortBy, order, search]);

  useEffect(() => {
    if (isOpen) {
      fetchApplicants();
    }
  }, [isOpen, fetchApplicants]);

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await api(`/learn/claude-pro/applicants/${id}`, {
        method: 'PATCH',
        body: { status: newStatus },
      });
      // Update local state
      setApplicants((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert(err.message || 'Failed to update applicant');
    } finally {
      setActionLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cp-admin-backdrop" role="dialog" aria-modal="true" aria-labelledby="cp-admin-title">
      <div className="cp-admin-modal">
        {/* Header */}
        <div className="cp-admin-header">
          <div className="cp-admin-head-left">
            <span className="cp-admin-icon-wrap" aria-hidden="true">
              <Sparkles size={18} />
            </span>
            <div>
              <h2 id="cp-admin-title" className="cp-admin-title">
                Claude Pro <em>Selection Portal</em>
              </h2>
              <p className="cp-admin-sub">
                Stored learner telemetry &middot; {total} total candidates registered
              </p>
            </div>
          </div>
          <button
            type="button"
            className="cp-admin-close-btn"
            onClick={onClose}
            aria-label="Close applicant portal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter bar */}
        <div className="cp-admin-bar">
          <div className="cp-admin-search-wrap">
            <Search size={15} className="cp-admin-search-icon" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="cp-admin-search-input"
            />
          </div>

          <div className="cp-admin-filters">
            <div className="cp-admin-filter-group">
              <Filter size={13} className="text-ink-3" aria-hidden="true" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="cp-admin-select"
              >
                <option value="applied">Status: Applied (Pending)</option>
                <option value="awarded">Status: Awarded Claude Pro</option>
                <option value="selected">Status: Shortlisted</option>
                <option value="rejected">Status: Rejected</option>
                <option value="all">All Records</option>
              </select>
            </div>

            <div className="cp-admin-filter-group">
              <Clock size={13} className="text-ink-3" aria-hidden="true" />
              <select
                value={`${sortBy}-${order}`}
                onChange={(e) => {
                  const [sb, ord] = e.target.value.split('-');
                  setSortBy(sb);
                  setOrder(ord);
                  setPage(1);
                }}
                className="cp-admin-select"
              >
                <option value="score-desc">Highest Score First</option>
                <option value="timeSpent-desc">Most Time Studied</option>
                <option value="appliedAt-desc">Most Recent Application</option>
                <option value="score-asc">Lowest Score First</option>
              </select>
            </div>

            <button
              type="button"
              className="cp-admin-refresh-btn"
              onClick={fetchApplicants}
              title="Refresh list"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Table list */}
        <div className="cp-admin-table-container">
          {loading ? (
            <div className="cp-admin-loading">
              <span className="cp-admin-spinner" />
              <span>Loading applicants from database...</span>
            </div>
          ) : applicants.length === 0 ? (
            <div className="cp-admin-empty">
              <Award size={36} className="cp-admin-empty-icon" />
              <h3>No candidates found</h3>
              <p>Try changing filters or search terms. Candidates appear automatically when they complete a course.</p>
            </div>
          ) : (
            <table className="cp-admin-table">
              <thead>
                <tr>
                  <th>Learner Details</th>
                  <th>Course</th>
                  <th>Final Score</th>
                  <th>Study Time</th>
                  <th>Status</th>
                  <th>Admin Selection</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app) => (
                  <tr key={app.id} className={`cp-row cp-row-${app.status}`}>
                    <td>
                      <div className="cp-learner-info">
                        <strong className="cp-learner-name">{app.userName}</strong>
                        <span className="cp-learner-email">{app.userEmail}</span>
                      </div>
                    </td>
                    <td>
                      <span className="cp-course-name" title={app.courseTitle}>
                        {app.courseTitle}
                      </span>
                    </td>
                    <td>
                      <span className="cp-score-badge">
                        {app.score}/{app.totalMarks}
                      </span>
                    </td>
                    <td>
                      <span className="cp-time-badge">
                        <Clock size={12} />
                        {app.timeSpentFormatted || `${Math.round(app.timeSpentSeconds / 60)}m`}
                      </span>
                    </td>
                    <td>
                      <span className={`cp-status-pill cp-status-${app.status}`}>
                        {app.status === 'applied'
                          ? 'Applied'
                          : app.status === 'awarded'
                          ? 'Awarded Claude Pro'
                          : app.status === 'selected'
                          ? 'Shortlisted'
                          : app.status}
                      </span>
                    </td>
                    <td>
                      <div className="cp-action-btns">
                        {app.status !== 'awarded' ? (
                          <button
                            type="button"
                            className="cp-btn cp-btn-award"
                            disabled={actionLoading === app.id}
                            onClick={() => handleUpdateStatus(app.id, 'awarded')}
                            title="Award 1-Month Free Claude Pro subscription"
                          >
                            <Check size={13} />
                            <span>Award Claude</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="cp-btn cp-btn-revoke"
                            disabled={actionLoading === app.id}
                            onClick={() => handleUpdateStatus(app.id, 'applied')}
                          >
                            Reset
                          </button>
                        )}
                        {app.status === 'applied' && (
                          <button
                            type="button"
                            className="cp-btn cp-btn-select"
                            disabled={actionLoading === app.id}
                            onClick={() => handleUpdateStatus(app.id, 'selected')}
                          >
                            Shortlist
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer pagination */}
        <div className="cp-admin-footer">
          <span className="cp-admin-count">
            Showing {applicants.length} of {total} applicants
          </span>
          <div className="cp-admin-pagination">
            <button
              type="button"
              className="cp-page-btn"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="cp-page-num">Page {page}</span>
            <button
              type="button"
              className="cp-page-btn"
              disabled={applicants.length < 25 || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
