/* ============================================
   手帐待办 — 存储层
   ============================================ */

const Store = {
  KEY: 'todo_journal_data',

  _listeners: [],

  _emit() {
    document.dispatchEvent(new CustomEvent('store-changed'));
  },

  on(fn) {
    this._listeners.push(fn);
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  save(todos) {
    localStorage.setItem(this.KEY, JSON.stringify(todos));
  },

  add(text, category, priority) {
    const todos = this.load();
    const todo = createTodo(text, category, priority);
    todos.push(todo);
    this.save(todos);
    this._emit();
    return todo;
  },

  remove(id) {
    const todos = this.load().filter(t => t.id !== id);
    this.save(todos);
    this._emit();
  },

  toggle(id) {
    const todos = this.load();
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;
    todo.completedAt = todo.completed ? Date.now() : null;
    this.save(todos);
    this._emit();
  },

  update(id, changes) {
    const todos = this.load();
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    Object.assign(todo, changes);
    this.save(todos);
    this._emit();
  },

  clearCompleted() {
    const todos = this.load().filter(t => !t.completed);
    this.save(todos);
    this._emit();
  },

  getAll() {
    return this.load();
  },

  getPending() {
    return this.load().filter(t => !t.completed);
  },

  getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.load().filter(t => t.createdAt >= today.getTime());
  },

  getCompleted() {
    return this.load().filter(t => t.completed);
  },

  search(query, filters = {}) {
    let todos = this.getAll();

    // 标签过滤
    if (filters.tab) {
      switch (filters.tab) {
        case 'today': todos = this.getToday(); break;
        case 'completed': todos = this.getCompleted(); break;
        case 'pending': todos = this.getPending(); break;
      }
    }

    // 分类过滤
    if (filters.category) {
      todos = todos.filter(t => t.category === filters.category);
    }

    // 优先级过滤
    if (filters.priority) {
      todos = todos.filter(t => t.priority === filters.priority);
    }

    // 状态过滤
    if (filters.status) {
      if (filters.status === 'pending') todos = todos.filter(t => !t.completed);
      if (filters.status === 'completed') todos = todos.filter(t => t.completed);
    }

    // 搜索关键词
    if (query) {
      const q = query.toLowerCase();
      todos = todos.filter(t => t.text.toLowerCase().includes(q));
    }

    return sortTodos(todos);
  },

  getStats() {
    const todos = this.getAll();
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byCategory = {};
    todos.forEach(t => {
      if (!byCategory[t.category]) byCategory[t.category] = { total: 0, completed: 0 };
      byCategory[t.category].total++;
      if (t.completed) byCategory[t.category].completed++;
    });

    return { total, completed, pending, percentage, byCategory };
  },
};
