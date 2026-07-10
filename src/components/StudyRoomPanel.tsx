import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';
import type { StudySubjectKey, StudySession, VirtualStudent } from '../types';
import { STUDY_SUBJECTS, DEFAULT_STUDY_GOAL, getVirtualStudentPool, generateInitialVirtualStudents } from '../utils/model';

type TimerPhase = 'idle' | 'running' | 'paused';

const STORAGE_KEY_SESSIONS = 'todo_study_sessions';
const STORAGE_KEY_GOALS = 'todo_study_goals';

const PRESETS = [
  { label: '25', minutes: 25 },
  { label: '45', minutes: 45 },
  { label: '60', minutes: 60 },
  { label: '90', minutes: 90 },
];

const SUBJECT_PRESETS: Record<StudySubjectKey, number> = {
  math: 45,
  language: 30,
  science: 45,
  literature: 60,
  coding: 60,
  art: 45,
  other: 30,
};

// --- Helpers ---

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadSessions(): StudySession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (raw) {
      const parsed = JSON.parse(raw) as StudySession[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return [];
}

function saveSessions(sessions: StudySession[]) {
  // Prune sessions older than 90 days
  const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const trimmed = sessions.filter(s => s.startedAt >= ninetyDaysAgo);
  try {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(trimmed));
  } catch { /* ignore */ }
}

function loadStudyGoal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GOALS);
    if (raw) {
      const parsed = JSON.parse(raw) as { dailyTargetMinutes: number };
      if (typeof parsed.dailyTargetMinutes === 'number' && parsed.dailyTargetMinutes > 0) {
        return parsed.dailyTargetMinutes;
      }
    }
  } catch { /* ignore */ }
  return DEFAULT_STUDY_GOAL.dailyTargetMinutes;
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch { /* silently fail */ }
}

async function requestNotificationPermission() {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  } catch { /* silently fail */ }
}

async function sendNotification(title: string, body: string) {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  } catch { /* silently fail */ }
}

// --- Sub-components ---

function SubjectSelector({
  selected, onSelect, disabled, t,
}: {
  selected: StudySubjectKey;
  onSelect: (s: StudySubjectKey) => void;
  disabled: boolean;
  t: (key: string) => string;
}) {
  const subjectKeys = Object.keys(STUDY_SUBJECTS) as StudySubjectKey[];
  return (
    <div className="study-subjects-row">
      {subjectKeys.map(key => {
        const def = STUDY_SUBJECTS[key];
        return (
          <button
            key={key}
            className={`study-subject-btn${selected === key ? ' active' : ''}`}
            style={{ '--subject-color': def.color } as React.CSSProperties}
            onClick={() => onSelect(key)}
            disabled={disabled}
            title={t(`studySubject${key.charAt(0).toUpperCase() + key.slice(1)}`)}
          >
            <span>{def.emoji}</span>
            <span>{t(`studySubject${key.charAt(0).toUpperCase() + key.slice(1)}`)}</span>
          </button>
        );
      })}
    </div>
  );
}

function PresetDurationRow({
  presets, selected, onSelect, disabled, t,
}: {
  presets: { label: string; minutes: number }[];
  selected: number;
  onSelect: (m: number) => void;
  disabled: boolean;
  t: (key: string) => string;
}) {
  return (
    <div className="focus-presets">
      <span style={{ fontSize: '0.8rem', color: 'var(--kraft-text-light)', marginRight: '4px' }}>{t('studyPreset')}:</span>
      {presets.map(p => (
        <button
          key={p.minutes}
          className={`preset-btn${selected === p.minutes ? ' active' : ''}`}
          onClick={() => onSelect(p.minutes)}
          disabled={disabled}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function SVGRingTimer({
  remainingSeconds, totalSeconds, phase, t, selectedSubject,
}: {
  remainingSeconds: number;
  totalSeconds: number;
  phase: TimerPhase;
  t: (key: string) => string;
  selectedSubject: StudySubjectKey;
}) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (progress / 100) * circumference;
  const subjectDef = STUDY_SUBJECTS[selectedSubject];

  return (
    <div className="focus-timer-ring">
      <svg className="focus-svg" viewBox="0 0 200 200">
        <circle
          className="focus-ring-bg"
          cx="100" cy="100" r="80"
        />
        <circle
          className="focus-ring-progress"
          cx="100" cy="100" r="80"
          stroke={subjectDef.color}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="focus-time-display">
        <span className="focus-time-value">{formatTime(remainingSeconds)}</span>
        <span className="focus-phase-label">
          {phase === 'idle'
            ? t('studyReady')
            : phase === 'paused'
              ? t('studyPaused')
              : t('studyInSession')
          }
        </span>
      </div>
    </div>
  );
}

function TimerControls({
  phase, onStart, onPauseResume, onReset, onComplete, t,
}: {
  phase: TimerPhase;
  onStart: () => void;
  onPauseResume: () => void;
  onReset: () => void;
  onComplete: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="focus-controls">
      {phase === 'idle' && (
        <button className="focus-btn focus-btn-primary" onClick={onStart}>
          {t('studyStart')}
        </button>
      )}
      {phase === 'paused' && (
        <button className="focus-btn focus-btn-primary" onClick={onPauseResume}>
          {t('studyResume')}
        </button>
      )}
      {phase === 'running' && (
        <button className="focus-btn focus-btn-secondary" onClick={onPauseResume}>
          {t('studyPause')}
        </button>
      )}
      {(phase === 'running' || phase === 'paused') && (
        <button className="focus-btn focus-btn-danger" onClick={onReset}>
          {t('studyReset')}
        </button>
      )}
      {phase === 'running' && (
        <button className="focus-btn focus-btn-secondary" onClick={onComplete} style={{ color: 'var(--sticker-low)', borderColor: 'var(--sticker-low)' }}>
          {t('studyComplete')}
        </button>
      )}
    </div>
  );
}

// --- Calendar helpers ---

function buildSessionMap(
  sessions: StudySession[],
  year: number,
  month: number,
): Record<string, { totalMinutes: number; subjects: Set<StudySubjectKey> }> {
  const map: Record<string, { totalMinutes: number; subjects: Set<StudySubjectKey> }> = {};
  sessions.forEach(s => {
    if (!s.completedAt) return;
    const d = new Date(s.completedAt);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.toISOString().slice(0, 10);
      if (!map[key]) map[key] = { totalMinutes: 0, subjects: new Set() };
      map[key].totalMinutes += s.durationMinutes;
      map[key].subjects.add(s.subject);
    }
  });
  return map;
}

function calcStreak(sessions: StudySession[]): number {
  const dates = new Set<string>();
  sessions.forEach(s => {
    if (s.completedAt) dates.add(new Date(s.completedAt).toISOString().slice(0, 10));
  });
  if (dates.size === 0) return 0;

  let streak = 0;
  const d = new Date();
  // Start from today (or yesterday if no sessions today)
  if (!dates.has(getTodayKey())) d.setDate(d.getDate() - 1);

  while (true) {
    const key = d.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function calcMonthTotal(sessions: StudySession[], year: number, month: number): number {
  return sessions
    .filter(s => {
      if (!s.completedAt) return false;
      const d = new Date(s.completedAt);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

function calcTodayTotal(sessions: StudySession[]): number {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return sessions
    .filter(s => s.completedAt && s.completedAt >= todayStart.getTime())
    .reduce((sum, s) => sum + s.durationMinutes, 0);
}

function calcSubjectBreakdown(sessions: StudySession[]): Record<StudySubjectKey, number> {
  const breakdown: Record<StudySubjectKey, number> = {
    math: 0, language: 0, science: 0, literature: 0,
    coding: 0, art: 0, other: 0,
  };
  sessions.forEach(s => {
    if (s.completedAt) breakdown[s.subject] += s.durationMinutes;
  });
  return breakdown;
}

function calcWeeklyTrend(sessions: StudySession[]): { label: string; minutes: number }[] {
  const weekdayShort = ['日', '一', '二', '三', '四', '五', '土'];
  const lang = typeof document !== 'undefined' ? document.documentElement.lang : 'ja';
  const labels = lang === 'zh-CN'
    ? ['日', '一', '二', '三', '四', '五', '六']
    : lang === 'en'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : weekdayShort;

  const days: { label: string; minutes: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const mins = sessions
      .filter(s => s.completedAt && s.completedAt >= dayStart && s.completedAt < dayEnd)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    days.push({ label: labels[d.getDay()], minutes: mins });
  }
  return days;
}

// --- Main Component ---

export default function StudyRoomPanel() {
  const { t } = useApp();

  // Timer state
  const [timerPhase, setTimerPhase] = useState<TimerPhase>('idle');
  const [selectedSubject, setSelectedSubject] = useState<StudySubjectKey>('math');
  const [presetMinutes, setPresetMinutes] = useState(SUBJECT_PRESETS.math);
  const [totalSeconds, setTotalSeconds] = useState(SUBJECT_PRESETS.math * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(SUBJECT_PRESETS.math * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Data state
  const [sessions, setSessions] = useState<StudySession[]>(loadSessions);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(loadStudyGoal);

  // Virtual students
  const [virtualStudents, setVirtualStudents] = useState<VirtualStudent[]>([]);

  // Wake lock
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // --- Init ---
  useEffect(() => {
    setVirtualStudents(generateInitialVirtualStudents());
  }, []);

  // --- Cleanup ---
  useEffect(() => {
    return () => {
      clearTimer();
      releaseWakeLock();
    };
  }, []);

  // --- Virtual student simulation ---
  useEffect(() => {
    const interval = setInterval(() => {
      setVirtualStudents(prev => {
        const next = prev.map(s => ({
          ...s,
          studyDuration: s.studyDuration + Math.floor(Math.random() * 3) + 1,
        }));
        const pool = getVirtualStudentPool();

        // Add new student (15% chance)
        if (next.length < pool.length && Math.random() < 0.15) {
          const available = pool.filter(p => !next.some(n => n.id === p.id));
          if (available.length > 0) {
            const candidate = available[Math.floor(Math.random() * available.length)];
            next.push({
              ...candidate,
              studyDuration: 0,
              joinedAt: Date.now(),
            });
          }
        }

        // Remove student (3% chance, never below 2)
        if (next.length > 2 && Math.random() < 0.03) {
          const idx = Math.floor(Math.random() * next.length);
          next.splice(idx, 1);
        }

        return next;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // --- Wake lock ---
  const acquireWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<WakeLockSentinel> } }).wakeLock.request('screen');
      }
    } catch { /* silently fail */ }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) {
        await (wakeLockRef.current as unknown as { release?: () => Promise<void> }).release?.();
        wakeLockRef.current = null;
      }
    } catch { /* ignore */ }
  }, []);

  // --- Timer actions ---
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    const secs = presetMinutes * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setElapsedSeconds(0);
    setTimerPhase('running');
    startTimeRef.current = Date.now();
    acquireWakeLock();
    requestNotificationPermission();

    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }, [presetMinutes, clearTimer, acquireWakeLock]);

  const pauseResume = useCallback(() => {
    if (timerPhase === 'running') {
      clearTimer();
      setTimerPhase('paused');
      releaseWakeLock();
    } else if (timerPhase === 'paused') {
      setTimerPhase('running');
      acquireWakeLock();
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
  }, [timerPhase, clearTimer, releaseWakeLock, acquireWakeLock]);

  const resetTimer = useCallback(() => {
    clearTimer();
    releaseWakeLock();
    setTimerPhase('idle');
    setRemainingSeconds(presetMinutes * 60);
    setElapsedSeconds(0);
  }, [clearTimer, releaseWakeLock, presetMinutes]);

  const completeTimer = useCallback(() => {
    clearTimer();
    releaseWakeLock();

    const durationMin = Math.round(elapsedSeconds / 60);
    if (durationMin < 1) return;

    const session: StudySession = {
      id: crypto.randomUUID(),
      subject: selectedSubject,
      durationMinutes: durationMin,
      startedAt: startTimeRef.current,
      completedAt: Date.now(),
      goalMet: false,
    };

    const updated = [...sessions, session];
    setSessions(updated);
    saveSessions(updated);

    playNotificationSound();
    sendNotification(
      t('studySessionComplete'),
      t('studySessionSummary').replace('XXX', t(`studySubject${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)}`)).replace('XX', String(durationMin))
    );

    setTimerPhase('idle');
    setRemainingSeconds(presetMinutes * 60);
    setElapsedSeconds(0);
  }, [clearTimer, releaseWakeLock, elapsedSeconds, sessions, selectedSubject, presetMinutes, t]);

  // Auto-complete when timer reaches 0
  useEffect(() => {
    if (remainingSeconds === 0 && timerPhase === 'running' && elapsedSeconds > 0) {
      completeTimer();
    }
  }, [remainingSeconds, timerPhase, elapsedSeconds, completeTimer]);

  // --- Subject change ---
  const handleSubjectChange = useCallback((subject: StudySubjectKey) => {
    if (timerPhase !== 'idle' && timerPhase !== 'paused') return;
    setSelectedSubject(subject);
    const defaultPreset = SUBJECT_PRESETS[subject];
    setPresetMinutes(defaultPreset);
    setTotalSeconds(defaultPreset * 60);
    setRemainingSeconds(defaultPreset * 60);
    setElapsedSeconds(0);
  }, [timerPhase]);

  // --- Preset change ---
  const handlePresetChange = useCallback((minutes: number) => {
    if (timerPhase === 'running') return;
    setPresetMinutes(minutes);
    setTotalSeconds(minutes * 60);
    setRemainingSeconds(minutes * 60);
    setElapsedSeconds(0);
  }, [timerPhase]);

  // --- Goal management ---
  const handleGoalChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (val >= 5 && val <= 720) {
      setDailyGoalMinutes(val);
    }
  }, []);

  const handleGoalSave = useCallback(() => {
    if (dailyGoalMinutes < 5 || dailyGoalMinutes > 720) return;
    try {
      localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify({ dailyTargetMinutes: dailyGoalMinutes }));
    } catch { /* ignore */ }
  }, [dailyGoalMinutes]);

  // --- Computed values ---
  const todayTotal = calcTodayTotal(sessions);
  const goalPercentage = Math.min(100, (todayTotal / dailyGoalMinutes) * 100);
  const goalMet = todayTotal >= dailyGoalMinutes;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const sessionMap = buildSessionMap(sessions, year, month);
  const streak = calcStreak(sessions);
  const monthTotal = calcMonthTotal(sessions, year, month);
  const breakdown = calcSubjectBreakdown(sessions);
  const weeklyTrend = calcWeeklyTrend(sessions);
  const maxWeeklyMin = Math.max(...weeklyTrend.map(d => d.minutes), 1);
  const maxSubjectMin = Math.max(...Object.values(breakdown), 1);

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = now.getDate();
  const weekdayLabels = (() => {
    const lang = document.documentElement.lang || 'ja';
    if (lang === 'zh-CN') return ['日', '一', '二', '三', '四', '五', '六'];
    if (lang === 'en') return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return ['日', '月', '火', '水', '木', '金', '土'];
  })();

  const calendarCells: React.ReactNode[] = [];
  // Weekday headers
  weekdayLabels.forEach(label => {
    calendarCells.push(
      <div key={`hdr-${label}`} className="cal-day cal-day-empty" style={{ fontWeight: 700, fontSize: '0.65rem' }}>
        {label}
      </div>
    );
  });
  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="cal-day cal-day-empty" />);
  }
  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const info = sessionMap[dateKey];
    const isCurrent = d === todayDate;
    const subjectColors = info ? Array.from(info.subjects).map(sk => STUDY_SUBJECTS[sk].color) : [];
    const dotColor = subjectColors[0] || 'var(--washi-purple)';

    calendarCells.push(
      <div
        key={d}
        className={`cal-day${info ? ' cal-day-active' : ''}${isCurrent ? ' cal-day-current' : ''}`}
      >
        <span>{d}</span>
        {info && <span className="cal-dot" style={{ background: dotColor }} />}
      </div>
    );
  }

  return (
    <div className="paper-card sketch-frame breathe-shadow studyroom-panel">
      <div className="washi-tape washi-purple" style={{ marginTop: 0 }} />
      <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-lg)', fontSize: '1.2rem' }}>
        {t('studyRoomTitle')}
      </h2>

      {/* === 自习计时区 === */}
      <div className="studyroom-section">
        <div className="studyroom-section-title">
          <span>⏱</span>
          <span>{t('studyRoomMyFocus')}</span>
        </div>

        <SubjectSelector
          selected={selectedSubject}
          onSelect={handleSubjectChange}
          disabled={timerPhase === 'running'}
          t={t}
        />

        <PresetDurationRow
          presets={PRESETS}
          selected={presetMinutes}
          onSelect={handlePresetChange}
          disabled={timerPhase === 'running'}
          t={t}
        />

        <SVGRingTimer
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          phase={timerPhase}
          t={t}
          selectedSubject={selectedSubject}
        />

        <TimerControls
          phase={timerPhase}
          onStart={startTimer}
          onPauseResume={pauseResume}
          onReset={resetTimer}
          onComplete={completeTimer}
          t={t}
        />
      </div>

      {/* === 打卡日历区 === */}
      <div className="studyroom-section">
        <div className="studyroom-section-title">
          <span>📅</span>
          <span>{t('studyRoomStudyCalendar')}</span>
        </div>

        <div className="studyroom-calendar-grid">{calendarCells}</div>

        <div className="study-stats-row">
          <div className="study-stat-card">
            <span className="study-stat-number">{streak}</span>
            <span className="study-stat-label">{t('studyStreak')} ({t('studyDays')})</span>
          </div>
          <div className="study-stat-card">
            <span className="study-stat-number">{monthTotal}</span>
            <span className="study-stat-label">{t('studyTotalMinutes')}</span>
          </div>
        </div>
      </div>

      {/* === 学习目标区 === */}
      <div className="studyroom-section">
        <div className="studyroom-section-title">
          <span>🎯</span>
          <span>{t('studyRoomGoals')}</span>
        </div>

        <div className="study-goal-row">
          <label style={{ fontSize: '0.85rem', color: 'var(--kraft-text-light)' }}>
            {t('studyDailyGoal')}
          </label>
          <input
            type="number"
            className="study-goal-input"
            value={dailyGoalMinutes}
            onChange={handleGoalChange}
            min={5}
            max={720}
          />
          <button className="study-goal-save-btn" onClick={handleGoalSave}>
            {t('studySaveGoal')}
          </button>
        </div>

        <div className="study-goal-bar">
          <div
            className={`study-goal-fill${goalMet ? ' complete' : ''}`}
            style={{ width: `${goalPercentage}%` }}
          />
        </div>
        <div className="study-goal-text">
          {goalMet
            ? `${t('studyGoalProgress')}: ${todayTotal}/${dailyGoalMinutes} ${t('studyGoalMet')}!`
            : `${t('studyGoalProgress')}: ${todayTotal}/${dailyGoalMinutes} ${t('studyGoalOf')}`}
        </div>
      </div>

      {/* === 自习统计区 === */}
      <div className="studyroom-section">
        <div className="studyroom-section-title">
          <span>📊</span>
          <span>{t('studyRoomStatistics')}</span>
        </div>

        {/* Subject breakdown */}
        <div className="study-subject-breakdown">
          {(Object.keys(breakdown) as StudySubjectKey[])
            .filter(k => breakdown[k] > 0)
            .sort((a, b) => breakdown[b] - breakdown[a])
            .map(key => {
              const def = STUDY_SUBJECTS[key];
              const pct = maxSubjectMin > 0 ? (breakdown[key] / maxSubjectMin) * 100 : 0;
              return (
                <div key={key} className="breakdown-row">
                  <span className="breakdown-emoji">{def.emoji}</span>
                  <span className="breakdown-label">{t(`studySubject${key.charAt(0).toUpperCase() + key.slice(1)}`)}</span>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-fill"
                      style={{ width: `${pct}%`, background: def.color }}
                    />
                  </div>
                  <span className="breakdown-minutes">{breakdown[key]}m</span>
                </div>
              );
            })}
        </div>

        {/* Weekly trend */}
        <div className="trend-bars">
          {weeklyTrend.map((d, i) => (
            <div key={i} className="trend-bar-wrap">
              <span className="trend-value">{d.minutes > 0 ? `${d.minutes}m` : ''}</span>
              <div
                className={`trend-bar${d.minutes > 0 ? ' has-data' : ''}`}
                style={{ height: `${maxWeeklyMin > 0 ? (d.minutes / maxWeeklyMin) * 100 : 0}%` }}
              />
              <span className="trend-label">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* === 虚拟自习者区 === */}
      <div className="studyroom-section">
        <div className="studyroom-section-title">
          <span>👥</span>
          <span>{t('studyRoomVirtualStudents')}</span>
        </div>

        {virtualStudents.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--kraft-text-light)', fontSize: '0.85rem', padding: 'var(--space-md)' }}>
            {t('studyNoSessions')}<br />{t('studyClickToStart')}
          </div>
        ) : (
          <div className="virtual-students-grid">
            {virtualStudents.map(student => (
              <div key={student.id} className="student-avatar-card">
                <span className="student-avatar-emoji">{student.avatar}</span>
                <span className="student-avatar-name">{student.name}</span>
                <span className="student-avatar-subject">
                  {STUDY_SUBJECTS[student.subject].emoji}{' '}
                  {t(`studySubject${student.subject.charAt(0).toUpperCase() + student.subject.slice(1)}`)}
                </span>
                <span className="student-avatar-duration">
                  {Math.floor(student.studyDuration / 60)}h {student.studyDuration % 60}{t('studyMinutes')}
                </span>
                <span className="student-status-badge">
                  <span className="student-status-dot" />
                  {t('studyStudying')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="washi-tape washi-blue" style={{ marginBottom: 0 }} />
    </div>
  );
}
