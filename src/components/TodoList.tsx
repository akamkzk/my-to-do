import React from 'react';
import TodoItem from './TodoItem';
import type { Todo } from '../types';
import { useApp } from '../contexts/AppContext';

interface TodoListProps {
  todos: Todo[];
}

const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const { t } = useApp();

  if (todos.length === 0) {
    return (
      <div className="empty-state" id="emptyState">
        <div className="empty-icon">📝</div>
        <p className="empty-text">{t('emptyText')}</p>
        <p className="empty-sub">{t('emptySub')}</p>
      </div>
    );
  }

  return (
    <ul className="todo-list" id="todoList">
      {todos.map((todo, i) => (
        <TodoItem key={todo.id} todo={todo} index={i} />
      ))}
    </ul>
  );
};

export default TodoList;
