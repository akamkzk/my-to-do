import React, { useState, useRef, useEffect } from 'react';
import type { Todo } from '../types';
import { getCategoryInfo, getPriorityLabel, formatDate } from '../utils/model';
import { useApp } from '../contexts/AppContext';

interface TodoItemProps {
  todo: Todo;
  index: number;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, index }) => {
  const { t, toggleTodo, removeTodo, updateTodo } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.setSelectionRange(editInputRef.current.value.length, editInputRef.current.value.length);
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      updateTodo(todo.id, { text: trimmed });
    }
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editText.trim()) {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  const cat = getCategoryInfo(todo.category, t);
  const priorityLabel = getPriorityLabel(todo.priority, t);
  const prioKey = todo.priority === 'high' ? 'prioHigh' : todo.priority === 'medium' ? 'prioMedium' : 'prioLow';

  return (
    <li
      className={`todo-item${todo.completed ? ' completed' : ''}`}
      data-testid={todo.id}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <label className="todo-checkbox">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <span className="checkbox-visual"></span>
      </label>
      <div className="todo-content">
        {!isEditing ? (
          <span className="todo-text">{todo.text}</span>
        ) : (
          <input
            className="edit-input"
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            ref={editInputRef}
          />
        )}
        <div className="todo-meta">
          <span
            className="category-sticker"
            style={{
              background: `${cat.color}40`,
              color: cat.color,
              border: `1px solid ${cat.color}60`,
            }}
          >
            {cat.emoji} {cat.label}
          </span>
          <span
            className={`priority-badge ${todo.priority}`}
            title={`${t(prioKey)}: ${priorityLabel}`}
          >
            {priorityLabel}
          </span>
          <span className="todo-date">{formatDate(todo.createdAt)}</span>
        </div>
      </div>
      <div className="todo-actions">
        <button
          className="btn-icon edit-btn"
          title={t('tooltipEdit')}
          onClick={() => {
            setIsEditing(true);
            setEditText(todo.text);
          }}
        >
          ✎
        </button>
        <button
          className="btn-icon delete-btn"
          title={t('tooltipDelete')}
          onClick={() => {
            const el = editInputRef.current?.closest('li');
            if (el) {
              el.classList.add('exiting');
              setTimeout(() => removeTodo(todo.id), 300);
            } else {
              removeTodo(todo.id);
            }
          }}
        >
          ✕
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
