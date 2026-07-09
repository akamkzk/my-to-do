import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Todo, TabKey, Language } from '../types';
import { store } from '../utils/store';
import { sortTodos } from '../utils/model';
import { loadSavedLang, setCurrentLang, t } from '../utils/i18n';

interface AppContextValue {
  todos: Todo[];
  activeTab: TabKey;
  searchQuery: string;
  filterCategory: string;
  filterPriority: string;
  language: Language;
  filteredTodos: Todo[];
  setActiveTab: (tab: TabKey) => void;
  setSearchQuery: (q: string) => void;
  setFilterCategory: (cat: string) => void;
  setFilterPriority: (prio: string) => void;
  setLanguage: (lang: Language) => void;
  addTodo: (text: string, category: string, priority: string) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (id: string, changes: Partial<Pick<Todo, 'text'>>) => void;
  clearCompleted: () => void;
  getStats: () => { total: number; completed: number; pending: number; percentage: number; byCategory: Record<string, { total: number; completed: number }> };
  t: (key: string) => string;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [language, setLanguageState] = useState<Language>(() => loadSavedLang());

  // Load initial data
  useEffect(() => {
    setTodos(store.getAll());
  }, []);

  // Subscribe to store changes
  useEffect(() => {
    return store.subscribe(() => {
      setTodos(store.getAll());
    });
  }, []);

  // Computed filtered todos
  const filteredTodos = React.useMemo(() => {
    let result = [...todos];

    // Tab filter
    if (activeTab === 'pending') {
      result = result.filter(t => !t.completed);
    } else if (activeTab === 'completed') {
      result = result.filter(t => t.completed);
    }
    // 'all' and 'stats' show everything

    // Category filter
    if (filterCategory) {
      result = result.filter(t => t.category === filterCategory);
    }

    // Priority filter
    if (filterPriority) {
      result = result.filter(t => t.priority === filterPriority);
    }

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.text.toLowerCase().includes(q));
    }

    return sortTodos(result);
  }, [todos, activeTab, filterCategory, filterPriority, searchQuery]);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLang(lang);
    setLanguageState(lang);
    document.documentElement.lang = lang === 'zh-CN' ? 'zh' : lang;
  }, []);

  const addTodo = useCallback((text: string, category: string, priority: string) => {
    store.add(text, category, priority);
  }, []);

  const removeTodo = useCallback((id: string) => {
    store.remove(id);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    store.toggle(id);
  }, []);

  const updateTodo = useCallback((id: string, changes: Partial<Pick<Todo, 'text'>>) => {
    store.update(id, changes);
  }, []);

  const clearCompleted = useCallback(() => {
    store.clearCompleted();
  }, []);

  const getStats = useCallback(() => {
    return store.getStats();
  }, []);

  const value = React.useMemo<AppContextValue>(() => ({
    todos,
    activeTab,
    searchQuery,
    filterCategory,
    filterPriority,
    language,
    filteredTodos,
    setActiveTab,
    setSearchQuery,
    setFilterCategory,
    setFilterPriority,
    setLanguage,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    getStats,
    t,
  }), [todos, activeTab, searchQuery, filterCategory, filterPriority, language, filteredTodos, setLanguage, addTodo, removeTodo, toggleTodo, updateTodo, clearCompleted, getStats]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
