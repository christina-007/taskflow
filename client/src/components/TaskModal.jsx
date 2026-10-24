import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSubmit, initialTask = null, isSaving = false }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'Medium',
        status: initialTask.status || 'Pending',
        dueDate: initialTask.dueDate ? initialTask.dueDate.substring(0, 10) : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        dueDate: '',
      });
    }
    setErrors({});
  }, [initialTask, isOpen]);

  // Focus title input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (formData.title.trim().length > 140) {
      newErrors.title = 'Title cannot exceed 140 characters.';
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    });
  };

  const isEdit = Boolean(initialTask);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Task' : 'New Task'}</h2>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isSaving}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="task-title" className="form-label">
                Title <span className="required-mark">*</span>
              </label>
              <input
                id="task-title"
                ref={titleInputRef}
                type="text"
                className={`form-input ${errors.title ? 'has-error' : ''}`}
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
                disabled={isSaving}
                maxLength={140}
              />
              {errors.title && <span className="form-error-msg">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="task-desc" className="form-label">
                Description
              </label>
              <textarea
                id="task-desc"
                className={`form-textarea ${errors.description ? 'has-error' : ''}`}
                placeholder="Add context, notes, or subtasks..."
                rows={3}
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: null });
                }}
                disabled={isSaving}
                maxLength={2000}
              />
              {errors.description && <span className="form-error-msg">{errors.description}</span>}
            </div>

            {/* Row: Status & Priority */}
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="task-status" className="form-label">
                  Status
                </label>
                <select
                  id="task-status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  disabled={isSaving}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-priority" className="form-label">
                  Priority
                </label>
                <select
                  id="task-priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  disabled={isSaving}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label htmlFor="task-duedate" className="form-label">
                Due Date
              </label>
              <input
                id="task-duedate"
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving && <Loader2 size={13} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />}
              <span>{isEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
