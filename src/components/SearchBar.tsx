import React from 'react';
import { CATEGORIES } from '../utils/model';
import { useApp } from '../contexts/AppContext';

const SearchBar: React.FC = () => {
  const { searchQuery, filterCategory, filterPriority, setSearchQuery, setFilterCategory, setFilterPriority, t } = useApp();
  const isComposing = React.useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Always update searchQuery to keep the controlled input responsive.
    // During IME composition, intermediate values (pinyin, kana, etc.)
    // are written to searchQuery but will be overwritten by the final
    // composed text in handleCompositionEnd, so partial IME state never
    // leaks into the filtered results.
    setSearchQuery(e.target.value);
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: React.SyntheticEvent<HTMLInputElement, Event>) => {
    isComposing.current = false;
    // Overwrite with the browser's settled composed value.
    setSearchQuery((e.currentTarget as HTMLInputElement).value);
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
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
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
