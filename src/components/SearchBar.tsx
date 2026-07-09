import React from 'react';
import { CATEGORIES } from '../utils/model';
import { useApp } from '../contexts/AppContext';

const SearchBar: React.FC = () => {
  const { searchQuery, filterCategory, filterPriority, setSearchQuery, setFilterCategory, setFilterPriority, t } = useApp();

  const debouncedFn = React.useRef<((q: string) => void) | null>(null);
  if (!debouncedFn.current) {
    let timer: ReturnType<typeof setTimeout> | null = null;
    debouncedFn.current = (q: string) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setSearchQuery(q), 300);
    };
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debouncedFn.current) debouncedFn.current(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterCategory(e.target.value);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterPriority(e.target.value);
  };

  return (
    <div className="search-bar" style={{ marginBottom: 'var(--space-md)' }}>
      <input
        type="text"
        id="searchInput"
        className="form-input search-input"
        placeholder={t('searchPlaceholder')}
        value={searchQuery}
        onChange={handleSearchInput}
      />
      <select id="filterCategory" className="filter-select" value={filterCategory} onChange={handleCategoryChange}>
        <option value="">{t('filterAllCategories')}</option>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <option key={key} value={key}>{cat.emoji} {t(cat.labelKey)}</option>
        ))}
      </select>
      <select id="filterPriority" className="filter-select" value={filterPriority} onChange={handlePriorityChange}>
        <option value="">{t('filterAllPriorities')}</option>
        <option value="high">{t('prioHigh')}</option>
        <option value="medium">{t('prioMedium')}</option>
        <option value="low">{t('prioLow')}</option>
      </select>
    </div>
  );
};

export default SearchBar;
