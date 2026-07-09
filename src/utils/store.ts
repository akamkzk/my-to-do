import type { Todo, Stats, TabKey } from '../types';
import { sortTodos } from './model';

const STORAGE_KEY = 'todo_journal_data';

type ChangeCallback = () => void;

export class TodoStore {
  private listeners = new Set<ChangeCallback>();

  subscribe(fn: ChangeCallback): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach(fn => fn());
  }

  private load(): Todo[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(todos: Todo[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  add(text: string, category: string, priority: string): Todo {
    const todos = this.load();
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      category: category as Todo['category'],
      priority: priority as Todo['priority'],
      createdAt: Date.now(),
      completedAt: null,
    };
    todos.push(todo);
    this.save(todos);
    this.emit();
    return todo;
  }

  remove(id: string) {
    const todos = this.load().filter(t => t.id !== id);
    this.save(todos);
    this.emit();
  }

  toggle(id: string) {
    const todos = this.load();
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? Date.now() : null;
    this.save(todos);
    this.emit();
  }

  update(id: string, changes: Partial<Pick<Todo, 'text'>>) {
    const todos = this.load();
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    Object.assign(todo, changes);
    this.save(todos);
    this.emit();
  }

  clearCompleted() {
    const todos = this.load().filter(t => !t.completed);
    this.save(todos);
    this.emit();
  }

  getAll(): Todo[] {
    return this.load();
  }

  getPending(): Todo[] {
    return this.load().filter(t => !t.completed);
  }

  getCompleted(): Todo[] {
    return this.load().filter(t => t.completed);
  }

  getToday(): Todo[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.load().filter(t => t.createdAt >= today.getTime());
  }

  search(query: string, tab: TabKey, category: string, priority: string): Todo[] {
    let todos = this.getAll();

    // Tab filter
    if (tab === 'pending') {
      todos = todos.filter(t => !t.completed);
    } else if (tab === 'completed') {
      todos = todos.filter(t => t.completed);
    }
    // 'all' and 'stats' show everything

    // Category filter
    if (category) {
      todos = todos.filter(t => t.category === category);
    }

    // Priority filter
    if (priority) {
      todos = todos.filter(t => t.priority === priority);
    }

    // Search query
    if (query) {
      const q = query.toLowerCase();
      todos = todos.filter(t => t.text.toLowerCase().includes(q));
    }

    return sortTodos(todos);
  }

  getStats(): Stats {
    const todos = this.getAll();
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byCategory: Record<string, { total: number; completed: number }> = {};
    todos.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, completed: 0 };
      byCategory[t.category].total++;
      if (t.completed) byCategory[t.category].completed++;
    });

    return { total, completed, pending, percentage, byCategory };
  }
}

export const store = new TodoStore();
