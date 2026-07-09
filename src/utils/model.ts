import type { CategoryDef, CategoryInfo, Todo } from '../types';

export const CATEGORIES: Record<string, CategoryDef> = {
  work:      { labelKey: 'catWork',     emoji: '💼', color: '#a8d8ea' },
  personal:  { labelKey: 'catPersonal', emoji: '🏠', color: '#f7b7c4' },
  shopping:  { labelKey: 'catShopping', emoji: '🛒', color: '#b5ead7' },
  health:    { labelKey: 'catHealth',   emoji: '❤️', color: '#ffd3b6' },
  study:     { labelKey: 'catStudy',    emoji: '📚', color: '#d5a6e6' },
};

export const PRIORITY_KEYS: Record<string, string> = {
  high:   'prioHigh',
  medium: 'prioMedium',
  low:    'prioLow',
};

export const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function createTodo(text: string, category = 'personal', priority = 'medium') {
  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    category,
    priority,
    createdAt: Date.now(),
    completedAt: null,
  };
}

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function getWeekdayName(_date: Date): string {
  return '';
}

export function getCategoryInfo(cat: string, tFn: (key: string) => string): CategoryInfo {
  const c = CATEGORIES[cat] || CATEGORIES.personal;
  return { ...c, label: tFn(c.labelKey) };
}

export function getPriorityLabel(priority: string, tFn: (key: string) => string): string {
  return tFn(PRIORITY_KEYS[priority]);
}

export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    return b.createdAt - a.createdAt;
  });
}
