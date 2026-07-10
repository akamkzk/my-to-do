import type { CategoryDef, CategoryInfo, Todo, StudySubjectKey, StudyGoal, VirtualStudent } from '../types';
import { getCurrentLang } from './i18n';

export const CATEGORIES: Record<string, CategoryDef> = {
  work:      { labelKey: 'catWork',     emoji: '💼', color: '#a8d8ea' },
  personal:  { labelKey: 'catPersonal', emoji: '🏠', color: '#f7b7c4' },
  shopping:  { labelKey: 'catShopping', emoji: '🛒', color: '#b5ead7' },
  health:    { labelKey: 'catHealth',   emoji: '❤️', color: '#ffd3b6' },
  study:     { labelKey: 'catStudy',    emoji: '📚', color: '#d5a6e6' },
};

export const PRIORITY_KEYS: Record<string, string> = {
  high:   'prioHigh',
  medium: 'prioMedium',
  low:    'prioLow',
};

export const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export function createTodo(text: string, category = 'personal', priority = 'medium') {
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

export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function getWeekdayName(_date: Date): string {
  return '';
}

export function getCategoryInfo(cat: string, tFn: (key: string) => string): CategoryInfo {
  const c = CATEGORIES[cat] || CATEGORIES.personal;
  return { ...c, label: tFn(c.labelKey) };
}

export function getPriorityLabel(priority: string, tFn: (key: string) => string): string {
  return tFn(PRIORITY_KEYS[priority]);
}

export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }
    return b.createdAt - a.createdAt;
  });
}

// ============================================
// Study room constants and models
// ============================================

export const STUDY_SUBJECTS: Record<StudySubjectKey, { emoji: string; color: string }> = {
  math:      { emoji: '🔢', color: '#a8d8ea' },
  language:  { emoji: '📖', color: '#f7b7c4' },
  science:   { emoji: '🔬', color: '#b5ead7' },
  literature:{ emoji: '✍️', color: '#ffd3b6' },
  coding:    { emoji: '💻', color: '#d5a6e6' },
  art:       { emoji: '🎨', color: '#ffeaa7' },
  other:     { emoji: '📝', color: '#adb5bd' },
};

export const DEFAULT_STUDY_GOAL: StudyGoal = { dailyTargetMinutes: 120 };

const AVATAR_EMOJIS = ['🦊', '🐱', '🐶', '🐰', '🐼', '🐨', '🦁', '🐯', '🐸', '🐧'];

const NAMES_JA = ['たかし', 'みさき', 'ゆうき', 'あかり', 'けんた', 'さくら', 'りく', 'ひなた', 'まお', 'れん'];
const NAMES_ZH = ['小明', '小花', '大伟', '小红', '李华', '张梅', '王芳', '刘洋', '陈静', '周杰'];
const NAMES_EN = ['Alex', 'May', 'Sam', 'Lily', 'Tom', 'Emma', 'Leo', 'Mia', 'Jack', 'Zoe'];

export function getVirtualStudentPool(): Omit<VirtualStudent, 'studyDuration' | 'joinedAt'>[] {
  const lang = getCurrentLang();
  const names = lang === 'ja' ? NAMES_JA : lang === 'zh-CN' ? NAMES_ZH : NAMES_EN;
  const subjects: StudySubjectKey[] = Object.keys(STUDY_SUBJECTS) as StudySubjectKey[];

  const shuffled = [...names].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 8);

  return selected.map((name, i) => ({
    id: `${name}-${subjects[i % subjects.length]}`,
    avatar: AVATAR_EMOJIS[i % AVATAR_EMOJIS.length],
    name,
    subject: subjects[i % subjects.length],
  }));
}

export function generateInitialVirtualStudents(): VirtualStudent[] {
  const pool = getVirtualStudentPool();
  const count = Math.min(4, pool.length);
  const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, count);

  return shuffled.map(s => ({
    ...s,
    studyDuration: Math.floor(Math.random() * 120) + 5,
    joinedAt: Date.now() - Math.floor(Math.random() * 3600000),
  }));
}
