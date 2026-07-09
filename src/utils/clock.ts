import { getCurrentLang } from './i18n';

export function getDateString(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const lang = getCurrentLang();
  const weekdays = { ja: ['日', '月', '火', '水', '木', '金', '土'], 'zh-CN': ['日', '一', '二', '三', '四', '五', '六'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
  const wd = weekdays[lang][date.getDay()];
  return `${y}年${m}月${d}日（${wd}）`;
}

export function getHourDegrees(date: Date): number {
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  return hours * 30 + minutes * 0.5;
}

export function getMinuteDegrees(date: Date): number {
  const minutes = date.getMinutes();
  return minutes * 6;
}

export function formatDigitalTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
