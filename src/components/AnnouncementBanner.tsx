import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  getAllAnnouncements,
  getUnreadIds,
  markAnnouncementRead,
  markAllAnnouncementsRead,
  isAnnouncementRead,
} from '../utils/announcements';

export default function AnnouncementBanner() {
  const { t } = useApp();
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const announcements = getAllAnnouncements();
  const unreadIds = getUnreadIds();
  const unreadCount = unreadIds.length;

  // 按置顶优先、日期倒序排列
  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.date.localeCompare(a.date);
  });

  const handleDismiss = () => {
    setDismissed(true);
  };

  const handleMarkAllRead = () => {
    markAllAnnouncementsRead();
    handleDismiss();
  };

  const handleReadSingle = (id: string) => {
    markAnnouncementRead(id);
    // 使用最新的数据判断是否还有未读
    const updatedUnread = getUnreadIds();
    if (updatedUnread.length === 0) {
      handleDismiss();
    }
  };

  if (dismissed) return null;

  return (
    <section className="announcement-banner animate-slide-down" aria-label={t('announcementTitle')}>
      <div className="washi-tape washi-pink" style={{ marginTop: 0 }} />

      {/* 未读徽标 — 右上角气泡 */}
      {unreadCount > 0 && (
        <span className="announcement-badge">
          {unreadCount}
          <span className="announcement-badge-new">{t('announcementBadge')}</span>
        </span>
      )}

      {/* 标题行 */}
      <button
        className="announcement-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="announcement-icon">📢</span>
        <span className="announcement-heading">{t('announcementTitle')}</span>
        {unreadCount > 0 && (
          <span className="announcement-unread-dot" aria-hidden="true"></span>
        )}
        <span className={`announcement-chevron ${expanded ? 'open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {/* 公告列表 */}
      {expanded && (
        <div className="announcement-list">
          {sorted.map((ann, i) => {
            const read = isAnnouncementRead(ann.id);
            return (
              <article
                key={ann.id}
                className={`announcement-item${read ? ' read' : ''}${ann.pinned ? ' pinned' : ''}`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {ann.pinned && (
                  <span className="announcement-pinned-tag" aria-label="置顶">📌</span>
                )}
                <div className="announcement-item-header">
                  <h3 className="announcement-item-title">
                    {t(ann.titleKey)}
                  </h3>
                  <span className="announcement-version">
                    {ann.version && `v${ann.version}`}
                  </span>
                </div>
                <p className="announcement-item-date">
                  {ann.date}
                </p>
                <p className="announcement-item-content">
                  {t(ann.contentKey)}
                </p>
                {!read && (
                  <button
                    className="announcement-dismiss-btn"
                    onClick={() => handleReadSingle(ann.id)}
                  >
                    {t('announcementClose')}
                  </button>
                )}
              </article>
            );
          })}

          <div className="announcement-footer">
            <button className="announcement-mark-all-read" onClick={handleMarkAllRead}>
              {t('announcementMarkAllRead')}
            </button>
          </div>
        </div>
      )}

      <div className="washi-tape washi-blue" style={{ marginBottom: 0 }} />
    </section>
  );
}
