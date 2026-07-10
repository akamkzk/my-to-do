import type { Language, Translations } from '../types';

const translations: Record<Language, Translations> = {
  ja: {
    appTitle: 'マイ・ジャーナル',
    appSubtitle: '手帳スタイル TODO',
    tabAll: 'すべて',
    tabPending: '未完了',
    tabCompleted: '完了',
    tabStats: '統計',
    tabFocus: 'フォーカス',
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
    // Focus panel
    focusTitle: '🎯 集中タイマー',
    focusBreakTitle: '☕ ブレイク時間',
    focusStart: '開始',
    focusPause: '一時停止',
    focusResume: '再開',
    focusReset: 'リセット',
    focusSessions: 'セッション',
    focusWorking: '集中中',
    focusPaused: '一時停止中',
    focusReady: '準備完了',
    focusBreakLabel: '休憩中',
    focusStartBreak: 'ブレイク開始',
    focusBackToIdle: '戻る',
    focusCustomPlaceholder: 'カスタム分',
    focusApply: '適用',
    focusDone: '集中タイムが完了しました！',
    focusCompleted: '休憩時間が終わりました！',
    focusEnableNotifications: '🔔 通知を許可',
    focusSkipBreak: 'スキップ',
  },
  'zh-CN': {
    appTitle: '我的日志',
    appSubtitle: '手帐风格 TODO',
    tabAll: '全部',
    tabPending: '未完成',
    tabCompleted: '已完成',
    tabStats: '統計',
    tabFocus: '专注',
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
    // Focus panel
    focusTitle: '🎯 专注计时',
    focusBreakTitle: '☕ 休息时间',
    focusStart: '开始',
    focusPause: '暂停',
    focusResume: '继续',
    focusReset: '重置',
    focusSessions: '轮',
    focusWorking: '专注中',
    focusPaused: '已暂停',
    focusReady: '准备就绪',
    focusBreakLabel: '休息中',
    focusStartBreak: '开始休息',
    focusBackToIdle: '返回',
    focusCustomPlaceholder: '自定义分钟',
    focusApply: '应用',
    focusDone: '专注时间完成！',
    focusCompleted: '休息时间结束！',
    focusEnableNotifications: '🔔 启用通知',
    focusSkipBreak: '跳过休息',
  },
  en: {
    appTitle: 'My Journal',
    appSubtitle: 'Handbook-style TODO',
    tabAll: 'All',
    tabPending: 'Pending',
    tabCompleted: 'Done',
    tabStats: 'Stats',
    tabFocus: 'Focus',
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
    // Focus panel
    focusTitle: '🎯 Focus Timer',
    focusBreakTitle: '☕ Break Time',
    focusStart: 'Start',
    focusPause: 'Pause',
    focusResume: 'Resume',
    focusReset: 'Reset',
    focusSessions: 'sessions',
    focusWorking: 'Focusing',
    focusPaused: 'Paused',
    focusReady: 'Ready',
    focusBreakLabel: 'Break',
    focusStartBreak: 'Start Break',
    focusBackToIdle: 'Back',
    focusCustomPlaceholder: 'Custom min',
    focusApply: 'Apply',
    focusDone: 'Focus session complete!',
    focusCompleted: 'Break time over!',
    focusEnableNotifications: '🔔 Enable Notifications',
    focusSkipBreak: 'Skip Break',
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
