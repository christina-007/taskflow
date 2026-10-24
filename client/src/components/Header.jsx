import React from 'react';
import { Menu, Plus } from 'lucide-react';

export default function Header({ onOpenNewTask, onToggleMobileMenu }) {
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
        <button className="btn btn-primary" onClick={onOpenNewTask}>
          <Plus size={15} strokeWidth={2.4} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
