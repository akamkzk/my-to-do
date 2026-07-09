/* ============================================
   手帐待办 — 国际化 (i18n)
   ============================================ */

const I18n = {
  current: 'ja', // 默认日语

  translations: {
    ja: {
      // 标题
      appTitle: 'マイ・ジャーナル',
      appSubtitle: '手帳スタイル TODO',

      // Tab 标签
      tabAll: 'すべて',
      tabPending: '未完了',
      tabCompleted: '完了',
      tabStats: '統計',

      // 搜索 & 过滤
      searchPlaceholder: '🔍 タスクを検索...',
      filterAllCategories: '全カテゴリ',
      filterAllPriorities: '全優先度',

      // 添加表单
      addPlaceholder: '新しいタスクを入力...',
      addBtn: '＋ 追加',

      // 分类
      catPersonal: '個人',
      catWork: '仕事',
      catShopping: '買い物',
      catHealth: '健康',
      catStudy: '勉強',

      // 优先级
      prioHigh: '高',
      prioMedium: '中',
      prioLow: '低',

      // 空状态
      emptyText: '今日は何もありません。',
      emptySub: '新しいタスクを追加してください',

      // 统计
      statsTitle: '📊 作業統計',
      statTotal: '合計',
      statCompleted: '完了',
      statPending: '保留中',
      clearCompletedBtn: '🗑 完了タスクをクリア',
      noDataYet: '暂无数据',

      // 工具提示
      tooltipEdit: '編集',
      tooltipDelete: '削除',

      // 日期
      weekday: ['日', '月', '火', '水', '木', '金', '土'],

      // 语言选择器
      langLabel: '🌐 言語',
    },
    'zh-CN': {
      // 标题
      appTitle: '我的日志',
      appSubtitle: '手帐风格 TODO',

      // Tab 标签
      tabAll: '全部',
      tabPending: '未完成',
      tabCompleted: '已完成',
      tabStats: '统计',

      // 搜索 & 过滤
      searchPlaceholder: '🔍 搜索任务...',
      filterAllCategories: '全部分类',
      filterAllPriorities: '全部优先级',

      // 添加表单
      addPlaceholder: '输入新任务...',
      addBtn: '＋ 添加',

      // 分类
      catPersonal: '个人',
      catWork: '工作',
      catShopping: '购物',
      catHealth: '健康',
      catStudy: '学习',

      // 优先级
      prioHigh: '高',
      prioMedium: '中',
      prioLow: '低',

      // 空状态
      emptyText: '今天还没有任务。',
      emptySub: '添加一个新任务吧',

      // 统计
      statsTitle: '📊 任务统计',
      statTotal: '总计',
      statCompleted: '已完成',
      statPending: '待完成',
      clearCompletedBtn: '🗑 清除已完成',
      noDataYet: '暂无数据',

      // 工具提示
      tooltipEdit: '编辑',
      tooltipDelete: '删除',

      // 日期
      weekday: ['日', '一', '二', '三', '四', '五', '六'],

      // 语言选择器
      langLabel: '🌐 语言',
    },
    en: {
      // 标题
      appTitle: 'My Journal',
      appSubtitle: 'Handbook-style TODO',

      // Tab 标签
      tabAll: 'All',
      tabPending: 'Pending',
      tabCompleted: 'Done',
      tabStats: 'Stats',

      // 搜索 & 过滤
      searchPlaceholder: '🔍 Search tasks...',
      filterAllCategories: 'All categories',
      filterAllPriorities: 'All priorities',

      // 添加表单
      addPlaceholder: 'Enter a new task...',
      addBtn: '＋ Add',

      // 分类
      catPersonal: 'Personal',
      catWork: 'Work',
      catShopping: 'Shopping',
      catHealth: 'Health',
      catStudy: 'Study',

      // 优先级
      prioHigh: 'High',
      prioMedium: 'Med',
      prioLow: 'Low',

      // 空状态
      emptyText: "Nothing on your plate today.",
      emptySub: 'Add a new task to get started',

      // 统计
      statsTitle: '📊 Task Stats',
      statTotal: 'Total',
      statCompleted: 'Done',
      statPending: 'Pending',
      clearCompletedBtn: '🗑 Clear Completed',
      noDataYet: 'No data yet',

      // 工具提示
      tooltipEdit: 'Edit',
      tooltipDelete: 'Delete',

      // 日期
      weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

      // 语言选择器
      langLabel: '🌐 Language',
    },
  },

  t(key) {
    const dict = this.translations[this.current];
    if (!dict) return key;
    return dict[key] ?? key;
  },

  // 获取当前语言的分类标签
  catLabel(catKey) {
    const key = 'cat' + catKey.charAt(0).toUpperCase() + catKey.slice(1);
    return this.t(key);
  },

  // 获取当前语言的优先级标签
  prioLabel(prioKey) {
    const key = 'prio' + prioKey.charAt(0).toUpperCase() + prioKey.slice(1);
    return this.t(key);
  },

  // 切换语言
  set(lang) {
    if (!this.translations[lang]) return;
    this.current = lang;
    localStorage.setItem('todo_journal_lang', lang);
    this.apply();
  },

  // 应用翻译到 DOM
  apply() {
    // 标题
    const titleEl = document.querySelector('.journal-title');
    if (titleEl) titleEl.textContent = this.t('appTitle');

    // Tab 文字
    document.querySelectorAll('.tab').forEach(tab => {
      const key = 'tab' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1);
      const label = this.t(key);
      // 保留计数 span
      const cnt = tab.querySelector('.tab-count');
      tab.textContent = label;
      if (cnt) tab.appendChild(cnt);
    });

    // 搜索占位符
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = this.t('searchPlaceholder');

    // 分类 & 优先级过滤器的选项
    const filterCat = document.getElementById('filterCategory');
    if (filterCat) {
      filterCat.options[0].text = this.t('filterAllCategories');
    }
    const filterPrio = document.getElementById('filterPriority');
    if (filterPrio) {
      filterPrio.options[0].text = this.t('filterAllPriorities');
      filterPrio.options[1].text = this.t('prioHigh');
      filterPrio.options[2].text = this.t('prioMedium');
      filterPrio.options[3].text = this.t('prioLow');
    }

    // 重新填充分类下拉（添加表单 + 过滤器）
    if (typeof UI !== 'undefined' && UI.populateCategories) {
      UI.populateCategories();
    }

    // 添加表单
    const addInput = document.getElementById('newTodoText');
    if (addInput) addInput.placeholder = this.t('addPlaceholder');
    const addBtn = document.querySelector('.add-btn');
    if (addBtn) addBtn.textContent = this.t('addBtn');

    // 空状态
    const emptyText = document.querySelector('.empty-text');
    if (emptyText) emptyText.textContent = this.t('emptyText');
    const emptySub = document.querySelector('.empty-sub');
    if (emptySub) emptySub.textContent = this.t('emptySub');

    // 统计面板
    const statsTitle = document.querySelector('.stats-panel h2');
    if (statsTitle) statsTitle.textContent = this.t('statsTitle');
    const statTotalLabel = document.querySelector('#statTotal + .stat-label');
    if (statTotalLabel) statTotalLabel.textContent = this.t('statTotal');
    const statCompletedLabel = document.querySelector('#statCompleted + .stat-label');
    if (statCompletedLabel) statCompletedLabel.textContent = this.t('statCompleted');
    const statPendingLabel = document.querySelector('#statPending + .stat-label');
    if (statPendingLabel) statPendingLabel.textContent = this.t('statPending');
    const clearBtn = document.getElementById('clearCompletedBtn');
    if (clearBtn) clearBtn.textContent = this.t('clearCompletedBtn');

    // 无数据统计
    const noData = document.querySelector('.stats-detail p');
    if (noData) noData.textContent = this.t('noDataYet');

    // 重新渲染 TODO 列表（更新分类/优先级标签）
    if (typeof UI !== 'undefined' && UI.render) {
      UI.render();
    }

    // 更新语言选择器下拉框高亮
    const langSel = document.getElementById('langSelect');
    if (langSel) langSel.value = this.current;

    // 更新页面 lang 属性
    const langMap = { ja: 'ja', 'zh-CN': 'zh', en: 'en' };
    document.documentElement.lang = langMap[this.current] || 'ja';
  },

  // 初始化语言选择器
  initSelector() {
    const headerTop = document.querySelector('.header-top');
    if (!headerTop) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'lang-wrapper';
    wrapper.innerHTML = `
      <select id="langSelect" class="lang-select" aria-label="Language">
        <option value="ja">日本語</option>
        <option value="zh-CN">简体中文</option>
        <option value="en">English</option>
      </select>
    `;

    const dateStamp = document.getElementById('dateStamp');
    if (dateStamp) {
      headerTop.insertBefore(wrapper, dateStamp);
    } else {
      headerTop.appendChild(wrapper);
    }

    const sel = document.getElementById('langSelect');
    sel.addEventListener('change', () => {
      this.set(sel.value);
    });
  },

  // 加载已保存的语言
  loadSaved() {
    const saved = localStorage.getItem('todo_journal_lang');
    if (saved && this.translations[saved]) {
      this.current = saved;
    }
  },
};
