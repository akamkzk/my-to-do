import React, { createContext, useContext, useCallback, useEffect, useReducer } from 'react';
import type { Todo, TabKey, Language } from '../types';
import { store } from '../utils/store';
import { sortTodos } from '../utils/model';
import { loadSavedLang, setCurrentLang, t } from '../utils/i18n';

interface AppState {
  todos: Todo[];
  activeTab: TabKey;
  searchQuery: string;
  filterCategory: string;
  filterPriority: string;
  language: Language;
}

type Action =
  | { type: 'SET_TAB'; tab: TabKey }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'SET_CATEGORY'; category: string }
  | { type: 'SET_PRIORITY'; priority: string }
  | { type: 'SET_LANGUAGE'; lang: Language }
  | { type: 'SYNC_TODOS'; todos: Todo[] };

const initialState: AppState = {
  todos: [],
  activeTab: 'all',
  searchQuery: '',
  filterCategory: '',
  filterPriority: '',
  language: loadSavedLang(),
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TAB': return { ...state, activeTab: action.tab };
    case 'SET_SEARCH': return { ...state, searchQuery: action.query };
    case 'SET_CATEGORY': return { ...state, filterCategory: action.category };
    case 'SET_PRIORITY': return { ...state, filterPriority: action.priority };
    case 'SET_LANGUAGE': return { ...state, language: action.lang };
    case 'SYNC_TODOS': return { ...state, todos: action.todos };
    default: return state;
  }
}

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
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    dispatch({ type: 'SYNC_TODOS', todos: store.getAll() });
  }, []);

  // Subscribe to store changes
  useEffect(() => {
    return store.subscribe(() => {
      dispatch({ type: 'SYNC_TODOS', todos: store.getAll() });
    });
  }, []);

  // Computed filtered todos — memoized independently from context value
  const filteredTodos = React.useMemo(() => {
    let result = [...state.todos];

    // Tab filter
    if (state.activeTab === 'pending') {
      result = result.filter(t => !t.completed);
    } else if (state.activeTab === 'completed') {
      result = result.filter(t => t.completed);
    }

    // Category filter
    if (state.filterCategory) {
      result = result.filter(t => t.category === state.filterCategory);
    }

    // Priority filter
    if (state.filterPriority) {
      result = result.filter(t => t.priority === state.filterPriority);
    }

    // Search query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      result = result.filter(t => t.text.toLowerCase().includes(q));
    }

    return sortTodos(result);
  }, [state.todos, state.activeTab, state.filterCategory, state.filterPriority, state.searchQuery]);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLang(lang);
    dispatch({ type: 'SET_LANGUAGE', lang });
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
    ...state,
    filteredTodos,
    setActiveTab: (tab: TabKey) => dispatch({ type: 'SET_TAB', tab }),
    setSearchQuery: (q: string) => dispatch({ type: 'SET_SEARCH', query: q }),
    setFilterCategory: (cat: string) => dispatch({ type: 'SET_CATEGORY', category: cat }),
    setFilterPriority: (prio: string) => dispatch({ type: 'SET_PRIORITY', priority: prio }),
    setLanguage,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    getStats,
    t,
  }), [state, filteredTodos, setLanguage, addTodo, removeTodo, toggleTodo, updateTodo, clearCompleted, getStats]);

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
