import React, { useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const TabBar: React.FC = () => {
  const { activeTab, setActiveTab, t, todos } = useApp();
  const prevCountsRef = useRef<{ all: number; pending: number; completed: number }>({
    all: 0, pending: 0, completed: 0,
  });
  const bumpedRef = useRef<Record<string, boolean>>({});

  const allCount = todos.length;
  const pendingCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  const counts = { all: allCount, pending: pendingCount, completed: completedCount };

  useEffect(() => {
    const prev = prevCountsRef.current;
    bumpedRef.current = {};
    if (counts.all !== prev.all) bumpedRef.current.all = true;
    if (counts.pending !== prev.pending) bumpedRef.current.pending = true;
    if (counts.completed !== prev.completed) bumpedRef.current.completed = true;
    prevCountsRef.current = counts;
  }, [counts]);

  const tabs: { key: typeof activeTab; labelKey: string }[] = [
    { key: 'all', labelKey: 'tabAll' },
    { key: 'pending', labelKey: 'tabPending' },
    { key: 'completed', labelKey: 'tabCompleted' },
    { key: 'stats', labelKey: 'tabStats' },
  ];

  return (
    <nav className="tab-bar" role="tablist">
      {tabs.map(({ key, labelKey }) => (
        <button
          key={key}
          className={`tab${activeTab === key ? ' active' : ''}`}
          data-tab={key}
          onClick={() => setActiveTab(key)}
          role="tab"
          aria-selected={activeTab === key}
        >
          {t(labelKey)}
          {key !== 'stats' && (
            <span className={`tab-count${bumpedRef.current[key] ? ' bump' : ''}`}>
              {counts[key as keyof typeof counts]}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
