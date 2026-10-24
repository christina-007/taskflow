import React from 'react';
import {
  CheckSquare,
  Layers,
  Clock,
  CircleDashed,
  CheckCircle2,
  AlertCircle,
  X,
  Database,
  User,
} from 'lucide-react';

export default function Sidebar({
  activeStatus,
  activePriority,
  onSelectFilter,
  stats = {},
  isOpen,
  onClose,
  currentUser,
}) {
  const isFilterActive = (status, priority) => {
    return activeStatus === status && activePriority === priority;
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <CheckSquare size={16} strokeWidth={2.2} />
            </div>
            <span className="brand-title">TaskFlow</span>
          </div>
          <button
            className="btn-icon mobile-menu-toggle"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-section-title">Views</div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${isFilterActive('All', 'All') ? 'active' : ''}`}
            onClick={() => {
              onSelectFilter('All', 'All');
              if (isOpen) onClose();
            }}
          >
            <div className="nav-item-left">
              <Layers size={15} />
              <span>All Tasks</span>
            </div>
            <span className="nav-badge">{stats.total ?? 0}</span>
          </button>

          <button
            className={`nav-item ${isFilterActive('In Progress', 'All') ? 'active' : ''}`}
            onClick={() => {
              onSelectFilter('In Progress', 'All');
              if (isOpen) onClose();
            }}
          >
            <div className="nav-item-left">
              <Clock size={15} />
              <span>In Progress</span>
            </div>
            <span className="nav-badge">{stats.inProgress ?? 0}</span>
          </button>

          <button
            className={`nav-item ${isFilterActive('Pending', 'All') ? 'active' : ''}`}
            onClick={() => {
              onSelectFilter('Pending', 'All');
              if (isOpen) onClose();
            }}
          >
            <div className="nav-item-left">
              <CircleDashed size={15} />
              <span>Pending</span>
            </div>
            <span className="nav-badge">{stats.pending ?? 0}</span>
          </button>

          <button
            className={`nav-item ${isFilterActive('Completed', 'All') ? 'active' : ''}`}
            onClick={() => {
              onSelectFilter('Completed', 'All');
              if (isOpen) onClose();
            }}
          >
            <div className="nav-item-left">
              <CheckCircle2 size={15} />
              <span>Completed</span>
            </div>
            <span className="nav-badge">{stats.completed ?? 0}</span>
          </button>

          <div className="sidebar-section-title" style={{ paddingLeft: 8, marginTop: 8 }}>
            Priorities
          </div>

          <button
            className={`nav-item ${isFilterActive('All', 'High') ? 'active' : ''}`}
            onClick={() => {
              onSelectFilter('All', 'High');
              if (isOpen) onClose();
            }}
          >
            <div className="nav-item-left">
              <AlertCircle size={15} color="#C87558" />
              <span>High Priority</span>
            </div>
            <span className="nav-badge">{stats.highPriority ?? 0}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          {currentUser && (
            <div style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--text-inverse)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {currentUser.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--text-tertiary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Database size={13} color="#6B6960" />
            <span style={{ fontSize: 11, fontWeight: 500, color: '#6B6960' }}>Database</span>
          </div>
          <div className="backend-pill">
            <span className="backend-indicator" />
            <span>MongoDB Atlas Active</span>
          </div>
        </div>
      </aside>
    </>
  );
}
