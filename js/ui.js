/* ============================================
   手帐待办 — 事件处理 & UI 逻辑
   ============================================ */

const UI = {
  currentTab: 'all',
  searchQuery: '',
  filterCategory: '',
  filterPriority: '',
  filterStatus: '',
  searchTimer: null,

  init() {
    // 添加表单
    const form = document.getElementById('addTodoForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newTodoText');
      const category = document.getElementById('newTodoCategory').value;
      const priority = document.getElementById('newTodoPriority').value;

      if (!input.value.trim()) return;

      Store.add(input.value, category, priority);
      input.value = '';
      input.focus();
    });

    // 标签切换
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentTab = tab.dataset.tab;
        this.render();
      });
    });

    // 搜索输入（防抖）
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.searchQuery = searchInput.value.trim();
        this.render();
      }, 300);
    });

    // 过滤器
    ['filterCategory', 'filterPriority', 'filterStatus'].forEach(id => {
      const sel = document.getElementById(id);
      sel.addEventListener('change', () => {
        this[id.replace('filter', '').toLowerCase()] = sel.value;
        this.render();
      });
    });

    // 清空已完成
    const clearBtn = document.getElementById('clearCompletedBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        Store.clearCompleted();
      });
    }

    // 监听 store 变化
    Store.on(() => {
      this.render();
    });

    // 初始化分类下拉
    this.populateCategories();
  },

  populateCategories() {
    const addCat = document.getElementById('newTodoCategory');
    const filterCat = document.getElementById('filterCategory');

    // Clear and rebuild add category dropdown
    addCat.innerHTML = '';
    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      const label = I18n.t(cat.labelKey);
      addCat.innerHTML += `<option value="${key}">${cat.emoji} ${label}</option>`;
    });

    // Preserve the first "all categories" option in filter dropdown
    if (filterCat) {
      const allOption = filterCat.options[0]?.text || I18n.t('filterAllCategories');
      filterCat.innerHTML = '';
      const opt0 = document.createElement('option');
      opt0.value = '';
      opt0.textContent = allOption;
      filterCat.appendChild(opt0);
      Object.entries(CATEGORIES).forEach(([key, cat]) => {
        const label = I18n.t(cat.labelKey);
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = `${cat.emoji} ${label}`;
        filterCat.appendChild(opt);
      });
    }
  },

  render() {
    const todos = Store.search(this.searchQuery, {
      tab: this.currentTab,
      category: this.filterCategory,
      priority: this.filterPriority,
      status: this.filterStatus,
    });

    Renderer.renderTodos(todos);
    Renderer.updateStats();
    Renderer.updateTabCounts();
  },
};
