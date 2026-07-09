import { useApp } from '../contexts/AppContext';

export function useTodos() {
  const {
    todos,
    activeTab,
    searchQuery,
    filterCategory,
    filterPriority,
    filteredTodos,
    setActiveTab,
    setSearchQuery,
    setFilterCategory,
    setFilterPriority,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    getStats,
  } = useApp();

  return {
    todos,
    activeTab,
    searchQuery,
    filterCategory,
    filterPriority,
    filteredTodos,
    setActiveTab,
    setSearchQuery,
    setFilterCategory,
    setFilterPriority,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    getStats,
  };
}
