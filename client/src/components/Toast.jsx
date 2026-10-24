import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast ${isError ? 'toast-error' : 'toast-success'}`}>
        {isError ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            marginLeft: 8,
            color: 'inherit',
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Dismiss notification"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
