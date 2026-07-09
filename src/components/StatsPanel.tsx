import React from 'react';
import { useApp } from '../contexts/AppContext';

const StatsPanel: React.FC = () => {
  const { t, getStats, clearCompleted } = useApp();

  const stats = getStats();
  const circumference = 2 * Math.PI * 50; // r=50
  const offset = circumference - (stats.percentage / 100) * circumference;

  const cats = Object.entries(stats.byCategory);
  const maxCount = cats.length > 0 ? Math.max(...cats.map(([, v]) => v.total)) : 0;

  return (
    <div className="paper-card stats-panel sketch-frame breathe-shadow">
      <div className="washi-tape washi-blue" style={{ marginTop: 0 }} />
      <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-lg)', fontSize: '1.2rem' }}>
        {t('statsTitle')}
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">{t('statTotal')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.completed}</span>
          <span className="stat-label">{t('statCompleted')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.pending}</span>
          <span className="stat-label">{t('statPending')}</span>
        </div>
      </div>

      <div className="progress-ring-container">
        <svg className="progress-ring" viewBox="0 0 120 120">
          <circle className="progress-ring-bg" cx="60" cy="60" r="50" />
          <circle
            className="progress-ring-fill"
            cx="60"
            cy="60"
            r="50"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="progress-ring-text">{stats.percentage}%</span>
      </div>

      <div className="stats-detail">
        {cats.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--kraft-text-light)', opacity: 0.6, padding: 'var(--space-lg)' }}>
            {t('noDataYet')}
          </p>
        ) : (
          cats.map(([key, val]) => {
            const catEmoji = { work: '💼', personal: '🏠', shopping: '🛒', health: '❤️', study: '📚' }[key] || '📋';
            const catColor = { work: '#a8d8ea', personal: '#f7b7c4', shopping: '#b5ead7', health: '#ffd3b6', study: '#d5a6e6' }[key] || '#ccc';
            const catLabelKey = `cat${key.charAt(0).toUpperCase()}${key.slice(1)}`;
            const catLabel = t(catLabelKey as 'catPersonal');
            return (
              <div key={key} className="stats-category-row">
                <span className="stats-category-label">{catEmoji} {catLabel}</span>
                <div className="stats-category-bar">
                  <div
                    className="stats-category-fill"
                    style={{
                      width: maxCount > 0 ? `${(val.total / maxCount) * 100}%` : '0%',
                      background: catColor,
                    }}
                  />
                </div>
                <span className="stats-category-count">{val.completed}/{val.total}</span>
              </div>
            );
          })
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
        <button id="clearCompletedBtn" className="confirm-btn" style={{ fontSize: '0.85rem' }} onClick={clearCompleted}>
          {t('clearCompletedBtn')}
        </button>
      </div>

      <div className="washi-tape washi-green" style={{ marginBottom: 0 }} />
    </div>
  );
};

export default StatsPanel;
