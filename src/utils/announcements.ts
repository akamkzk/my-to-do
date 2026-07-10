import type { Announcement } from '../types';

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'v0.1.5',
    titleKey: 'ann_v015_title',
    contentKey: 'ann_v015_content',
    date: '2026-07-10',
    pinned: true,
    version: 'v0.1.5',
  },
  {
    id: 'v0.1.4',
    titleKey: 'ann_v014_title',
    contentKey: 'ann_v014_content',
    date: '2026-07-01',
    pinned: false,
    version: 'v0.1.4',
  },
  {
    id: 'v0.1.3',
    titleKey: 'ann_v013_title',
    contentKey: 'ann_v013_content',
    date: '2026-06-15',
    pinned: false,
    version: 'v0.1.3',
  },
];

const STORAGE_KEY = 'todo_journal_announcements_read';

function getReadIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReadIds(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

/** 获取所有公告（按日期倒序） */
export function getAllAnnouncements(): Announcement[] {
  return [...ANNOUNCEMENTS].sort((a, b) => b.date.localeCompare(a.date));
}

/** 获取未读公告 ID 列表 */
export function getUnreadIds(): string[] {
  const readIds = getReadIds();
  return ANNOUNCEMENTS
    .filter(a => !readIds.includes(a.id))
    .map(a => a.id);
}

/** 判断是否有未读公告 */
export function hasUnreadAnnouncements(): boolean {
  return getUnreadIds().length > 0;
}

/** 标记某条公告为已读 */
export function markAnnouncementRead(id: string): void {
  const readIds = getReadIds();
  if (!readIds.includes(id)) {
    readIds.push(id);
    saveReadIds(readIds);
  }
}

/** 标记所有公告为已读 */
export function markAllAnnouncementsRead(): void {
  const readIds = getReadIds();
  ANNOUNCEMENTS.forEach(a => {
    if (!readIds.includes(a.id)) {
      readIds.push(a.id);
    }
  });
  saveReadIds(readIds);
}

/** 检查某条公告是否已读 */
export function isAnnouncementRead(id: string): boolean {
  return getReadIds().includes(id);
}
