import React from 'react';
import { Menu, Plus, LogIn, LogOut, User } from 'lucide-react';

export default function Header({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenNewTask,
  onToggleMobileMenu,
}) {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <button
          className="btn-icon mobile-menu-toggle"
          onClick={onToggleMobileMenu}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="page-heading">Tasks Overview</h1>
        </div>
      </div>

      <div className="top-bar-actions">
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
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
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  maxWidth: 120,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {currentUser.name}
              </span>
            </div>

            <button
              className="btn btn-ghost"
              onClick={onLogout}
              title="Sign out"
              style={{ padding: '6px 10px', fontSize: 12.5 }}
            >
              <LogOut size={13} />
              <span className="hide-mobile">Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={onOpenAuth}
            style={{ fontSize: 13 }}
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </button>
        )}

        <button
          className="btn btn-primary"
          onClick={currentUser ? onOpenNewTask : onOpenAuth}
        >
          <Plus size={15} strokeWidth={2.4} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
