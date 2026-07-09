import type { Language, Translations } from '../types';

const translations: Record<Language, Translations> = {
  ja: {
    appTitle: 'マイ・ジャーナル',
    appSubtitle: '手帳スタイル TODO',
    tabAll: 'すべて',
    tabPending: '未完了',
    tabCompleted: '完了',
    tabStats: '統計',
    searchPlaceholder: '🔍 タスクを検索...',
    filterAllCategories: '全カテゴリ',
    filterAllPriorities: '全優先度',
    addPlaceholder: '新しいタスクを入力...',
    addBtn: '＋ 追加',
    catPersonal: '個人',
    catWork: '仕事',
    catShopping: '買い物',
    catHealth: '健康',
    catStudy: '勉強',
    prioHigh: '高',
    prioMedium: '中',
    prioLow: '低',
    emptyText: '今日は何もありません。',
    emptySub: '新しいタスクを追加してください',
    statsTitle: '📊 作業統計',
    statTotal: '合計',
    statCompleted: '完了',
    statPending: '保留中',
    clearCompletedBtn: '🗑 完了タスクをクリア',
    noDataYet: 'まだデータがありません',
    tooltipEdit: '編集',
    tooltipDelete: '削除',
    weekday: ['日', '月', '火', '水', '木', '金', '土'],
    langLabel: '🌐 言語',
  },
  'zh-CN': {
    appTitle: '我的日志',
    appSubtitle: '手帐风格 TODO',
    tabAll: '全部',
    tabPending: '未完成',
    tabCompleted: '已完成',
    tabStats: '统计',
    searchPlaceholder: '🔍 搜索任务...',
    filterAllCategories: '全部分类',
    filterAllPriorities: '全部优先级',
    addPlaceholder: '输入新任务...',
    addBtn: '＋ 添加',
    catPersonal: '个人',
    catWork: '工作',
    catShopping: '购物',
    catHealth: '健康',
    catStudy: '学习',
    prioHigh: '高',
    prioMedium: '中',
    prioLow: '低',
    emptyText: '今天还没有任务。',
    emptySub: '添加一个新任务吧',
    statsTitle: '📊 任务统计',
    statTotal: '总计',
    statCompleted: '已完成',
    statPending: '待完成',
    clearCompletedBtn: '🗑 清除已完成',
    noDataYet: '暂无数据',
    tooltipEdit: '编辑',
    tooltipDelete: '删除',
    weekday: ['日', '一', '二', '三', '四', '五', '六'],
    langLabel: '🌐 语言',
  },
  en: {
    appTitle: 'My Journal',
    appSubtitle: 'Handbook-style TODO',
    tabAll: 'All',
    tabPending: 'Pending',
    tabCompleted: 'Done',
    tabStats: 'Stats',
    searchPlaceholder: '🔍 Search tasks...',
    filterAllCategories: 'All categories',
    filterAllPriorities: 'All priorities',
    addPlaceholder: 'Enter a new task...',
    addBtn: '＋ Add',
    catPersonal: 'Personal',
    catWork: 'Work',
    catShopping: 'Shopping',
    catHealth: 'Health',
    catStudy: 'Study',
    prioHigh: 'High',
    prioMedium: 'Med',
    prioLow: 'Low',
    emptyText: "Nothing on your plate today.",
    emptySub: 'Add a new task to get started',
    statsTitle: '📊 Task Stats',
    statTotal: 'Total',
    statCompleted: 'Done',
    statPending: 'Pending',
    clearCompletedBtn: '🗑 Clear Completed',
    noDataYet: 'No data yet',
    tooltipEdit: 'Edit',
    tooltipDelete: 'Delete',
    weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    langLabel: '🌐 Language',
  },
};

let currentLang: Language = 'ja';

export function t(key: string): string {
  const dict = translations[currentLang];
  if (!dict) return key;
  const val = dict[key as keyof Translations];
  return (typeof val === 'string' ? val : key) ?? key;
}

export function getTranslations(): Record<Language, Translations> {
  return translations;
}

export function setCurrentLang(lang: Language): void {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('todo_journal_lang', lang);
}

export function getCurrentLang(): Language {
  return currentLang;
}

export function loadSavedLang(): Language {
  const saved = localStorage.getItem('todo_journal_lang');
  if (saved && translations[saved as Language]) {
    currentLang = saved as Language;
  }
  return currentLang;
}
