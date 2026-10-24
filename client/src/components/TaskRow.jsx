import React from 'react';
import { Check, Calendar, Edit2, Trash2 } from 'lucide-react';

export default function TaskRow({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === 'Completed';

  // Format due date
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    const isToday = new Date().toDateString() === date.toDateString();
    if (isToday) return 'Today';

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue =
    task.dueDate &&
    !isCompleted &&
    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const priorityClass = `badge-priority-${(task.priority || 'medium').toLowerCase()}`;
  const statusClass = `badge-status-${(task.status || 'pending').toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`task-row ${isCompleted ? 'is-completed' : ''}`}>
      {/* Quick Checkbox */}
      <div className="task-checkbox-col">
        <button
          className={`custom-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggleStatus(task)}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        >
          {isCompleted && <Check size={12} strokeWidth={3} />}
        </button>
      </div>

      {/* Task Title & Description */}
      <div className="task-info-col">
        <span className="task-title" title={task.title}>
          {task.title}
        </span>
        {task.description && (
          <span className="task-desc" title={task.description}>
            {task.description}
          </span>
        )}
      </div>

      {/* Status Badge */}
      <div>
        <span className={`badge ${statusClass}`}>
          <span className="badge-dot" />
          <span>{task.status}</span>
        </span>
      </div>

      {/* Priority Badge */}
      <div className="hide-mobile">
        <span className={`badge ${priorityClass}`}>{task.priority}</span>
      </div>

      {/* Due Date */}
      <div className="hide-mobile">
        {task.dueDate ? (
          <span className={`due-date-wrapper ${isOverdue ? 'is-overdue' : ''}`}>
            <Calendar size={12} />
            <span>
              {formatDueDate(task.dueDate)}
              {isOverdue && ' (Overdue)'}
            </span>
          </span>
        ) : (
          <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>—</span>
        )}
      </div>

      {/* Actions */}
      <div className="task-actions-col">
        <button
          className="btn-icon"
          onClick={() => onEdit(task)}
          title="Edit task"
          aria-label={`Edit task ${task.title}`}
        >
          <Edit2 size={13} />
        </button>
        <button
          className="btn-icon"
          onClick={() => onDelete(task)}
          title="Delete task"
          aria-label={`Delete task ${task.title}`}
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-terracotta)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
