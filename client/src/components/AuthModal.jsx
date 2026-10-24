import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Mail, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { login, register } from '../api/authService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initialInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setServerError('');
      setErrors({});
      setTimeout(() => {
        initialInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (mode === 'register') {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters.';
      }
    }

    if (!formData.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      let response;
      if (mode === 'login') {
        response = await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      } else {
        response = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
      }

      onAuthSuccess(response.user);
      onClose();
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ padding: '16px 20px 12px 20px' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              className={`btn btn-sm ${mode === 'login' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{
                fontSize: 13,
                fontWeight: mode === 'login' ? 600 : 500,
                borderColor: mode === 'login' ? 'var(--border-strong)' : 'transparent',
              }}
              onClick={() => {
                setMode('login');
                setServerError('');
                setErrors({});
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`btn btn-sm ${mode === 'register' ? 'btn-secondary' : 'btn-ghost'}`}
              style={{
                fontSize: 13,
                fontWeight: mode === 'register' ? 600 : 500,
                borderColor: mode === 'register' ? 'var(--border-strong)' : 'transparent',
              }}
              onClick={() => {
                setMode('register');
                setServerError('');
                setErrors({});
              }}
            >
              Create Account
            </button>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isLoading}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '18px 20px', gap: 14 }}>
            {serverError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--accent-terracotta-subtle)',
                  border: '1px solid var(--accent-terracotta)',
                  color: 'var(--accent-terracotta-text)',
                  fontSize: 12.5,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">
                  Full Name <span className="required-mark">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={14}
                    style={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-tertiary)',
                    }}
                  />
                  <input
                    ref={initialInputRef}
                    type="text"
                    className={`form-input ${errors.name ? 'has-error' : ''}`}
                    placeholder="e.g. Christina Joseph"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    disabled={isLoading}
                    style={{ paddingLeft: 32 }}
                  />
                </div>
                {errors.name && <span className="form-error-msg">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Email Address <span className="required-mark">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={14}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  ref={mode === 'login' ? initialInputRef : null}
                  type="email"
                  className={`form-input ${errors.email ? 'has-error' : ''}`}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  disabled={isLoading}
                  style={{ paddingLeft: 32 }}
                />
              </div>
              {errors.email && <span className="form-error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Password <span className="required-mark">*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={14}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type="password"
                  className={`form-input ${errors.password ? 'has-error' : ''}`}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  disabled={isLoading}
                  style={{ paddingLeft: 32 }}
                />
              </div>
              {errors.password && <span className="form-error-msg">{errors.password}</span>}
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '12px 20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 size={13} className="spinner" />
              ) : (
                <ArrowRight size={13} />
              )}
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
