import React from 'react';
import { Layers, Clock, CircleDashed, CheckCircle2 } from 'lucide-react';

export default function StatsOverview({ stats = {}, currentStatus, onSelectStatus }) {
  const cards = [
    {
      id: 'All',
      label: 'Total Tasks',
      value: stats.total ?? 0,
      icon: Layers,
    },
    {
      id: 'Pending',
      label: 'Pending',
      value: stats.pending ?? 0,
      icon: CircleDashed,
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      value: stats.inProgress ?? 0,
      icon: Clock,
    },
    {
      id: 'Completed',
      label: 'Completed',
      value: stats.completed ?? 0,
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="stats-grid" aria-label="Dashboard statistics">
      {cards.map((card) => {
        const IconComponent = card.icon;
        const isActive = currentStatus === card.id;

        return (
          <div
            key={card.id}
            className={`stat-card ${isActive ? 'active-filter' : ''}`}
            onClick={() => onSelectStatus(card.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectStatus(card.id);
              }
            }}
            title={`Filter by ${card.label}`}
          >
            <div className="stat-card-header">
              <span className="stat-label">{card.label}</span>
              <IconComponent size={15} className="stat-icon" />
            </div>
            <div className="stat-value">{card.value}</div>
          </div>
        );
      })}
    </section>
  );
}
