import React, { useEffect } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  task,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !task) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        style={{ maxWidth: 440 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} color="var(--accent-terracotta)" />
            <h2 className="modal-title">Delete Task</h2>
          </div>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
            Are you sure you want to delete this task?
          </p>
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          >
            "{task.title}"
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            This action cannot be undone and will permanently remove this task from MongoDB.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 size={13} className="spinner" />}
            <span>Delete Task</span>
          </button>
        </div>
      </div>
    </div>
  );
}
