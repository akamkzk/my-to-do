/* ============================================
   手帐待办 — 数据模型
   ============================================ */

const CATEGORIES = {
  work:      { labelKey: 'catWork',     emoji: '💼', color: '#a8d8ea' },
  personal:  { labelKey: 'catPersonal', emoji: '🏠', color: '#f7b7c4' },
  shopping:  { labelKey: 'catShopping', emoji: '🛒', color: '#b5ead7' },
  health:    { labelKey: 'catHealth',   emoji: '❤️', color: '#ffd3b6' },
  study:     { labelKey: 'catStudy',    emoji: '📚', color: '#d5a6e6' },
};

const PRIORITY_KEYS = {
  high:   'prioHigh',
  medium: 'prioMedium',
  low:    'prioLow',
};

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

function createTodo(text, category = 'personal', priority = 'medium') {
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

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getWeekdayName(date) {
  return I18n.t('weekday')[date.getDay()];
}

function getCategoryInfo(cat) {
  const c = CATEGORIES[cat] || CATEGORIES.personal;
  return { ...c, label: I18n.t(c.labelKey) };
}

function getPriorityLabel(priority) {
  return I18n.t(PRIORITY_KEYS[priority]);
}

function getCategoryInfo(cat) {
  return CATEGORIES[cat] || CATEGORIES.personal;
}

function sortTodos(todos) {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    return b.createdAt - a.createdAt;
  });
}
