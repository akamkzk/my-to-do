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
export type TabKey = 'all' | 'pending' | 'completed' | 'stats' | 'focus' | 'studyroom';

// Study room subject keys (separate from TODO categories)
export type StudySubjectKey = 'math' | 'language' | 'science' | 'literature' | 'coding' | 'art' | 'other';
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
  // Study room
  tabStudyRoom: string;
  studyRoomTitle: string;
  studyRoomMyFocus: string;
  studyRoomStudyCalendar: string;
  studyRoomVirtualStudents: string;
  studyRoomGoals: string;
  studyRoomStatistics: string;
  studySelectSubject: string;
  studyPreset: string;
  studyStart: string;
  studyPause: string;
  studyResume: string;
  studyReset: string;
  studyComplete: string;
  studyInSession: string;
  studyPaused: string;
  studyReady: string;
  studyGoalProgress: string;
  studyGoalOf: string;
  studyGoalMet: string;
  studyGoalNotMet: string;
  studySubjectMath: string;
  studySubjectLanguage: string;
  studySubjectScience: string;
  studySubjectLiterature: string;
  studySubjectCoding: string;
  studySubjectArt: string;
  studySubjectOther: string;
  studyCalendarMonth: string;
  studyStreak: string;
  studyDays: string;
  studyTotalMinutes: string;
  studyNoSessions: string;
  studyClickToStart: string;
  studyDailyGoal: string;
  studySaveGoal: string;
  studyGoalUpdated: string;
  studyOnline: string;
  studyStudying: string;
  studyMinutes: string;
  studySessionComplete: string;
  studySessionSummary: string;
}

export interface SearchFilters {
  tab?: TabKey;
  category?: string;
  priority?: string;
}

// Study room types

export interface StudySubjectDef {
  key: StudySubjectKey;
  labelKey: string;
  emoji: string;
  color: string;
}

export interface StudySession {
  id: string;
  subject: StudySubjectKey;
  durationMinutes: number;
  startedAt: number;
  completedAt: number | null;
  goalMet: boolean;
}

export interface StudyGoal {
  dailyTargetMinutes: number;
}

export interface VirtualStudent {
  id: string;
  avatar: string;
  name: string;
  subject: StudySubjectKey;
  studyDuration: number;
  joinedAt: number;
}
