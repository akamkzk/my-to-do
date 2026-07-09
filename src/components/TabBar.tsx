import { useApp } from '../contexts/AppContext';

const TabBar: React.FC = () => {
  const { activeTab, setActiveTab, t, todos } = useApp();

  const allCount = todos.length;
  const pendingCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  const tabs: { key: typeof activeTab; labelKey: string }[] = [
    { key: 'all', labelKey: 'tabAll' },
    { key: 'pending', labelKey: 'tabPending' },
    { key: 'completed', labelKey: 'tabCompleted' },
    { key: 'stats', labelKey: 'tabStats' },
  ];

  const counts = { all: allCount, pending: pendingCount, completed: completedCount };

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
            <span className="tab-count">{counts[key as keyof typeof counts]}</span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
