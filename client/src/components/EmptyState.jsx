import React from 'react';
import { Inbox, Plus, RotateCcw } from 'lucide-react';

export default function EmptyState({ isFiltered, onResetFilters, onOpenNewTask }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Inbox size={22} strokeWidth={1.8} />
      </div>
      <h3 className="empty-state-title">
        {isFiltered ? 'No tasks match your filters' : 'No tasks created yet'}
      </h3>
      <p className="empty-state-desc">
        {isFiltered
          ? 'Try adjusting your search query, priority, or status filters to find what you are looking for.'
          : 'Stay organized and focused. Create your first task to track progress.'}
      </p>

      {isFiltered ? (
        <button className="btn btn-secondary" onClick={onResetFilters} style={{ marginTop: 4 }}>
          <RotateCcw size={13} />
          <span>Reset Filters</span>
        </button>
      ) : (
        <button className="btn btn-primary" onClick={onOpenNewTask} style={{ marginTop: 4 }}>
          <Plus size={14} />
          <span>Create Task</span>
        </button>
      )}
    </div>
  );
}
