/* ============================================
   手帐待办 — DOM 渲染引擎
   ============================================ */

const Renderer = {
  todoListEl: null,
  emptyStateEl: null,
  statsPanelEl: null,

  init() {
    this.todoListEl = document.getElementById('todoList');
    this.emptyStateEl = document.getElementById('emptyState');
    this.statsPanelEl = document.querySelector('.stats-panel');
  },

  renderTodos(todos) {
    this.todoListEl.innerHTML = '';

    if (todos.length === 0) {
      this.emptyStateEl.style.display = 'block';
      return;
    }

    this.emptyStateEl.style.display = 'none';

    todos.forEach((todo, i) => {
      const el = this.createTodoElement(todo);
      el.style.animationDelay = `${i * 0.05}s`;
      el.classList.add('entering');
      this.todoListEl.appendChild(el);
    });
  },

  createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item${todo.completed ? ' completed' : ''}`;
    li.dataset.id = todo.id;

    const cat = getCategoryInfo(todo.category);

    li.innerHTML = `
      <label class="todo-checkbox">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} />
        <span class="checkbox-visual"></span>
      </label>
      <div class="todo-content">
        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
        <input class="edit-input" type="text" value="${this.escapeHtml(todo.text)}" />
        <div class="todo-meta">
          <span class="category-sticker" style="background:${cat.color}40; color:${cat.color}; border:1px solid ${cat.color}60;">
            ${cat.emoji} ${cat.label}
          </span>
          <span class="priority-badge ${todo.priority}" title="${I18n.t('prioHigh')}: ${getPriorityLabel(todo.priority)}">
            ${getPriorityLabel(todo.priority)}
          </span>
          <span class="todo-date">${formatDate(todo.createdAt)}</span>
        </div>
      </div>
      <div class="todo-actions">
        <button class="btn-icon edit-btn" title="${I18n.t('tooltipEdit')}">✎</button>
        <button class="btn-icon delete-btn" title="${I18n.t('tooltipDelete')}">✕</button>
      </div>
    `;

    // 复选框事件
    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      Store.toggle(todo.id);
    });

    // 编辑按钮
    const editBtn = li.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      li.classList.add('editing');
      const editInput = li.querySelector('.edit-input');
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    });

    // 编辑输入框回车保存
    const editInput = li.querySelector('.edit-input');
    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && editInput.value.trim()) {
        Store.update(todo.id, { text: editInput.value.trim() });
      } else if (e.key === 'Escape') {
        li.classList.remove('editing');
      }
    });
    editInput.addEventListener('blur', () => {
      if (editInput.value.trim() && editInput.value !== todo.text) {
        Store.update(todo.id, { text: editInput.value.trim() });
      } else {
        li.classList.remove('editing');
      }
    });

    // 删除按钮
    const deleteBtn = li.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      li.classList.add('exiting');
      setTimeout(() => Store.remove(todo.id), 300);
    });

    return li;
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  updateEmptyState(show) {
    this.emptyStateEl.style.display = show ? 'block' : 'none';
  },

  updateStats() {
    const stats = Store.getStats();
    const el = this.statsPanelEl;

    el.querySelector('#statTotal').textContent = stats.total;
    el.querySelector('#statCompleted').textContent = stats.completed;
    el.querySelector('#statPending').textContent = stats.pending;

    // 进度环
    const circumference = 2 * Math.PI * 50; // r=50
    const offset = circumference - (stats.percentage / 100) * circumference;
    const ring = el.querySelector('#progressRingCircle');
    if (ring) {
      ring.style.strokeDasharray = circumference;
      ring.style.strokeDashoffset = offset;
    }
    const pctText = el.querySelector('#progressPct');
    if (pctText) pctText.textContent = stats.percentage + '%';

    // 分类详情
    const detailEl = el.querySelector('.stats-detail');
    if (detailEl) {
      detailEl.innerHTML = '';
      const cats = Object.entries(stats.byCategory);
      if (cats.length === 0) {
        detailEl.innerHTML = `<p style="text-align:center;color:var(--kraft-text-light);opacity:0.6;padding:var(--space-lg);">${I18n.t('noDataYet')}</p>`;
        return;
      }
      const maxCount = Math.max(...cats.map(([, v]) => v.total));
      cats.forEach(([key, val]) => {
        const cat = getCategoryInfo(key);
        const pct = Math.round((val.completed / val.total) * 100);
        const row = document.createElement('div');
        row.className = 'stats-category-row';
        row.innerHTML = `
          <span class="stats-category-label">${cat.emoji} ${cat.label}</span>
          <div class="stats-category-bar">
            <div class="stats-category-fill" style="width:${(val.total / maxCount) * 100}%; background:${cat.color};"></div>
          </div>
          <span class="stats-category-count">${val.completed}/${val.total}</span>
        `;
        detailEl.appendChild(row);
      });
    }
  },

  updateTabCounts() {
    const all = Store.getAll();
    const pending = all.filter(t => !t.completed).length;
    const completed = all.filter(t => t.completed).length;

    const allTab = document.querySelector('[data-tab="all"]');
    const pendTab = document.querySelector('[data-tab="pending"]');
    const compTab = document.querySelector('[data-tab="completed"]');

    if (allTab) {
      let cnt = allTab.querySelector('.tab-count');
      if (!cnt) { cnt = document.createElement('span'); cnt.className = 'tab-count'; allTab.appendChild(cnt); }
      cnt.textContent = all.length;
    }
    if (pendTab) {
      let cnt = pendTab.querySelector('.tab-count');
      if (!cnt) { cnt = document.createElement('span'); cnt.className = 'tab-count'; pendTab.appendChild(cnt); }
      cnt.textContent = pending;
    }
    if (compTab) {
      let cnt = compTab.querySelector('.tab-count');
      if (!cnt) { cnt = document.createElement('span'); cnt.className = 'tab-count'; compTab.appendChild(cnt); }
      cnt.textContent = completed;
    }
  },
};
