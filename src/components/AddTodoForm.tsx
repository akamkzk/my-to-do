import React, { useState } from 'react';
import { CATEGORIES } from '../utils/model';
import { useApp } from '../contexts/AppContext';

const AddTodoForm: React.FC = () => {
  const { t, addTodo } = useApp();
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('newTodoText') as HTMLInputElement;
    const category = form.elements.namedItem('newTodoCategory') as HTMLSelectElement;
    const prio = form.elements.namedItem('newTodoPriority') as HTMLSelectElement;

    const text = input.value.trim();
    if (!text) return;

    addTodo(text, category.value, prio.value);
    input.value = '';
    input.focus();
  };

  return (
    <form className="add-todo-form" id="addTodoForm" onSubmit={handleSubmit}>
      <div className="form-group" style={{ flex: 1, minWidth: 180 }}>
        <input
          type="text"
          id="newTodoText"
          name="newTodoText"
          className="form-input"
          placeholder={t('addPlaceholder')}
          required
        />
      </div>
      <div className="form-group">
        <select id="newTodoCategory" name="newTodoCategory" className="form-select">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>{cat.emoji} {t(cat.labelKey)}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <select id="newTodoPriority" name="newTodoPriority" className="form-select" value={priority} onChange={e => setPriority(e.target.value as typeof priority)}>
          <option value="high">🔴 {t('prioHigh')}</option>
          <option value="medium">🟡 {t('prioMedium')}</option>
          <option value="low">🟢 {t('prioLow')}</option>
        </select>
      </div>
      <button type="submit" className="add-btn">{t('addBtn')}</button>
    </form>
  );
};

export default AddTodoForm;
