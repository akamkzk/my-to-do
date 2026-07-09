import React from 'react';
import { useClock } from '../hooks/useClock';
import { useI18n } from '../hooks/useI18n';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useI18n();
  const clock = useClock();

  return (
    <header className="journal-header">
      <div className="header-top">
        <h1 className="journal-title">{t('appTitle')}</h1>
        <div className="lang-wrapper">
          <select
            id="langSelect"
            className="lang-select"
            aria-label={t('langLabel')}
            value={language}
            onChange={e => setLanguage(e.target.value as typeof language)}
          >
            <option value="ja">日本語</option>
            <option value="zh-CN">简体中文</option>
            <option value="en">English</option>
          </select>
        </div>
        <span className="date-stamp" id="dateStamp">{clock.dateString}</span>
      </div>
      <div className="clock-widget">
        <div className="analog-clock">
          <div className="clock-center"></div>
          <div
            className="clock-hand hour"
            id="hourHand"
            style={{ transform: `rotate(${clock.hourDegrees}deg)` }}
          ></div>
          <div
            className="clock-hand minute"
            id="minuteHand"
            style={{ transform: `rotate(${clock.minuteDegrees}deg)` }}
          ></div>
        </div>
        <span className="digital-time" id="digitalTime">{clock.digitalTime}</span>
      </div>
    </header>
  );
};

export default Header;
