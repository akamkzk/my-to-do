export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: CategoryKey;
  priority: PriorityKey;
  createdAt: number;
  completedAt: number | null;
}

export type CategoryKey = 'work' | 'personal' | 'shopping' | 'health' | 'study';
export type PriorityKey = 'high' | 'medium' | 'low';
export type TabKey = 'all' | 'pending' | 'completed' | 'stats' | 'focus';
export type Language = 'ja' | 'zh-CN' | 'en';

export interface CategoryDef {
  labelKey: string;
  emoji: string;
  color: string;
}

export interface CategoryInfo extends CategoryDef {
  label: string; // translated label
}

export interface Stats {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
  byCategory: Record<CategoryKey, { total: number; completed: number }>;
}

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  tabAll: string;
  tabPending: string;
  tabCompleted: string;
  tabStats: string;
  tabFocus: string;
  searchPlaceholder: string;
  filterAllCategories: string;
  filterAllPriorities: string;
  addPlaceholder: string;
  addBtn: string;
  catPersonal: string;
  catWork: string;
  catShopping: string;
  catHealth: string;
  catStudy: string;
  prioHigh: string;
  prioMedium: string;
  prioLow: string;
  emptyText: string;
  emptySub: string;
  statsTitle: string;
  statTotal: string;
  statCompleted: string;
  statPending: string;
  clearCompletedBtn: string;
  noDataYet: string;
  tooltipEdit: string;
  tooltipDelete: string;
  weekday: string[];
  langLabel: string;
  // Focus panel
  focusTitle: string;
  focusBreakTitle: string;
  focusStart: string;
  focusPause: string;
  focusResume: string;
  focusReset: string;
  focusSessions: string;
  focusWorking: string;
  focusPaused: string;
  focusReady: string;
  focusBreakLabel: string;
  focusStartBreak: string;
  focusBackToIdle: string;
  focusCustomPlaceholder: string;
  focusApply: string;
  focusDone: string;
  focusCompleted: string;
  focusEnableNotifications: string;
  focusSkipBreak: string;
}

export interface SearchFilters {
  tab?: TabKey;
  category?: string;
  priority?: string;
}
