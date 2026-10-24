import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

export default function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  onResetFilters,
}) {
  const hasActiveFilters = search || status !== 'All' || priority !== 'All' || sort !== 'createdAt_desc';

  return (
    <div className="filters-wrapper">
      <div className="search-input-group">
        <Search size={14} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks by title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search tasks"
        />
        {search && (
          <button
            className="clear-search-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="filter-controls">
        <select
          className="select-control"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          className="select-control"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          aria-label="Filter by priority"
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          className="select-control"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort tasks"
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="dueDate_asc">Due Date (Soonest)</option>
          <option value="dueDate_desc">Due Date (Latest)</option>
        </select>

        {hasActiveFilters && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={onResetFilters}
            title="Reset all filters"
            style={{ fontSize: 12, padding: '6px 10px' }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
