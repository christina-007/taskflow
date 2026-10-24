import React from 'react';
import TaskRow from './TaskRow';
import EmptyState from './EmptyState';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function TaskTable({
  tasks = [],
  isLoading,
  error,
  onRetry,
  onToggleStatus,
  onEdit,
  onDelete,
  isFiltered,
  onResetFilters,
  onOpenNewTask,
}) {
  if (isLoading) {
    return (
      <div className="task-list-card">
        <div className="loading-container">
          <div className="spinner" />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list-card">
        <div className="loading-container" style={{ padding: '40px 24px' }}>
          <AlertCircle size={28} color="var(--accent-terracotta)" />
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
            Unable to load tasks
          </span>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', maxWidth: 400, textAlign: 'center' }}>
            {error}
          </span>
          <button className="btn btn-secondary" onClick={onRetry} style={{ marginTop: 8 }}>
            <RefreshCw size={13} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-card">
        <EmptyState
          isFiltered={isFiltered}
          onResetFilters={onResetFilters}
          onOpenNewTask={onOpenNewTask}
        />
      </div>
    );
  }

  return (
    <div className="task-list-card">
      <div className="task-table-header">
        <div />
        <div>Task</div>
        <div>Status</div>
        <div className="hide-mobile">Priority</div>
        <div className="hide-mobile">Due Date</div>
        <div style={{ textAlign: 'right' }}>Actions</div>
      </div>

      <div className="task-table-body">
        {tasks.map((task) => (
          <TaskRow
            key={task._id}
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
