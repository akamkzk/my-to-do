import { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../contexts/AppContext';

type FocusPhase = 'idle' | 'running' | 'paused' | 'break';

interface SessionHistory {
  total: number;
  date: string;
}

const STORAGE_KEY = 'todo_focus_sessions';

const PRESETS = [
  { label: '25', minutes: 25 },
  { label: '15', minutes: 15 },
  { label: '10', minutes: 10 },
  { label: '5', minutes: 5 },
];

const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

// --- Helpers ---

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadSessionHistory(): SessionHistory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SessionHistory;
      if (parsed.date === getTodayKey()) return parsed;
    }
  } catch { /* ignore */ }
  return { total: 0, date: getTodayKey() };
}

function saveSessionHistory(history: SessionHistory) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch { /* ignore */ }
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
      new Notification(title, { body, icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/><text y="22" font-size="22">🎯</text>' });
    }
  } catch { /* silently fail */ }
}

export default function FocusPanel() {
  const { t } = useApp();
  const [phase, setPhase] = useState<FocusPhase>('idle');
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [customMinutesStr, setCustomMinutesStr] = useState('');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [justFinished, setJustFinished] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historyRef = useRef(loadSessionHistory());

  // Wake lock
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Release wake lock
  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) {
        await (wakeLockRef.current as unknown as { release?: () => Promise<void> }).release?.();
        wakeLockRef.current = null;
      }
    } catch { /* ignore */ }
  }, []);

  // Request wake lock
  const acquireWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await (navigator as unknown as { wakeLock: { request: (type: string) => Promise<WakeLockSentinel> } }).wakeLock.request('screen');
      }
    } catch { /* silently fail */ }
  }, []);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationGranted(true);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
      releaseWakeLock();
    };
  }, [clearTimer, releaseWakeLock]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleTimerComplete = useCallback(() => {
    clearTimer();
    releaseWakeLock();
    setJustFinished(true);
    playNotificationSound();

    // Update session history
    const history = historyRef.current;
    history.total += 1;
    history.date = getTodayKey();
    saveSessionHistory(history);
    setSessionsCompleted(history.total);

    // Send notification
    sendNotification(
      phase === 'break' ? t('focusBreakTitle') : t('focusTitle'),
      phase === 'break' ? t('focusCompleted') : t('focusDone')
    );

    // Auto transition
    if (phase === 'running') {
      // Focus session completed → auto start break
      setTimeout(() => {
        setPhase('break');
        setTotalSeconds(BREAK_DURATION);
        setRemainingSeconds(BREAK_DURATION);
        setJustFinished(false);
        requestNotificationPermission();
      }, 500);
    } else {
      // Break completed → back to idle
      setTimeout(() => {
        setPhase('idle');
        setRemainingSeconds(selectedMinutes * 60);
        setJustFinished(false);
      }, 500);
    }
  }, [clearTimer, releaseWakeLock, phase, selectedMinutes, t]);

  const startFocus = () => {
    clearTimer();
    setJustFinished(false);
    const secs = selectedMinutes * 60;
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setPhase('running');
    acquireWakeLock();
    requestNotificationPermission();

    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseResume = () => {
    if (phase === 'running') {
      clearTimer();
      setPhase('paused');
      releaseWakeLock();
    } else if (phase === 'paused') {
      setPhase('running');
      acquireWakeLock();
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const reset = () => {
    clearTimer();
    releaseWakeLock();
    setJustFinished(false);
    setPhase('idle');
    setRemainingSeconds(selectedMinutes * 60);
  };

  const startBreak = () => {
    clearTimer();
    setJustFinished(false);
    setPhase('running');
    setTotalSeconds(BREAK_DURATION);
    setRemainingSeconds(BREAK_DURATION);
    acquireWakeLock();
    requestNotificationPermission();

    intervalRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const skipBreak = () => {
    clearTimer();
    setPhase('idle');
    setJustFinished(false);
    setRemainingSeconds(selectedMinutes * 60);
  };

  // Handle timer reaching 0
  useEffect(() => {
    if (remainingSeconds === 0 && (phase === 'running')) {
      handleTimerComplete();
    }
  }, [remainingSeconds, phase, handleTimerComplete]);

  // Handle custom minutes input
  const handleCustomMinutes = () => {
    const val = parseInt(customMinutesStr, 10);
    if (val >= 1 && val <= 120) {
      setSelectedMinutes(val);
      setRemainingSeconds(val * 60);
      if (phase === 'idle') {
        setTotalSeconds(val * 60);
      }
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomMinutes();
    }
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const circumference = 2 * Math.PI * 80;
  const dashOffset = circumference - (progress / 100) * circumference;

  const isBreak = phase === 'break';
  const isRunning = phase === 'running';

  return (
    <div className="paper-card sketch-frame breathe-shadow focus-panel">
      <div className={`washi-tape ${isBreak ? 'washi-green' : 'washi-purple'}`} style={{ marginTop: 0 }} />
      <h2 style={{ textAlign: 'center', marginBottom: 'var(--space-lg)', fontSize: '1.2rem' }}>
        {isBreak ? t('focusBreakTitle') : t('focusTitle')}
      </h2>

      {/* Preset durations */}
      <div className="focus-presets">
        {PRESETS.map(p => (
          <button
            key={p.minutes}
            className={`preset-btn${selectedMinutes === p.minutes ? ' active' : ''}`}
            onClick={() => {
              setSelectedMinutes(p.minutes);
              setCustomMinutesStr('');
              setRemainingSeconds(p.minutes * 60);
              if (phase === 'idle') {
                setTotalSeconds(p.minutes * 60);
              }
            }}
            disabled={isRunning}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom duration input */}
      <div className="focus-custom-input">
        <input
          type="number"
          className="form-input focus-custom-input-field"
          placeholder={t('focusCustomPlaceholder')}
          value={customMinutesStr}
          onChange={e => setCustomMinutesStr(e.target.value)}
          onKeyDown={handleCustomKeyDown}
          min={1}
          max={120}
          disabled={isRunning}
        />
        <button
          className="focus-custom-input-btn"
          onClick={handleCustomMinutes}
          disabled={isRunning || !customMinutesStr}
        >
          {t('focusApply')}
        </button>
      </div>

      {/* Timer circle */}
      <div className={`focus-timer-ring${justFinished ? ' pulse' : ''}`}>
        <svg className="focus-svg" viewBox="0 0 200 200">
          <circle
            className="focus-ring-bg"
            cx="100" cy="100" r="80"
          />
          <circle
            className="focus-ring-progress"
            cx="100" cy="100" r="80"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="focus-time-display">
          <span className="focus-time-value">{formatTime(remainingSeconds)}</span>
          <span className="focus-phase-label">
            {isBreak
              ? t('focusBreakLabel')
              : phase === 'idle'
                ? t('focusReady')
                : phase === 'paused'
                  ? t('focusPaused')
                  : t('focusWorking')
            }
          </span>
        </div>
      </div>

      {/* Session count */}
      {sessionsCompleted > 0 && (
        <div className="focus-sessions">
          <span className="focus-session-icon">🍅</span>
          <span>{sessionsCompleted} {t('focusSessions')}</span>
        </div>
      )}

      {/* Notification permission hint */}
      {!notificationGranted && phase === 'idle' && (
        <div className="focus-notification-hint">
          <button className="focus-btn focus-btn-secondary" onClick={() => { requestNotificationPermission().then(() => setNotificationGranted(true)); }}>
            {t('focusEnableNotifications')}
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="focus-controls">
        {phase === 'idle' && (
          <button className="focus-btn focus-btn-primary" onClick={startFocus}>
            {t('focusStart')}
          </button>
        )}

        {phase === 'paused' && (
          <button className="focus-btn focus-btn-primary" onClick={pauseResume}>
            {t('focusResume')}
          </button>
        )}

        {isRunning && (
          <button className="focus-btn focus-btn-secondary" onClick={pauseResume}>
            {t('focusPause')}
          </button>
        )}

        {(isRunning || phase === 'paused') && (
          <button className="focus-btn focus-btn-danger" onClick={reset}>
            {t('focusReset')}
          </button>
        )}

        {isBreak && isRunning && (
          <button className="focus-btn focus-btn-secondary" onClick={skipBreak}>
            {t('focusSkipBreak')}
          </button>
        )}

        {phase === 'break' && remainingSeconds === 0 && !isRunning && (
          <button className="focus-btn focus-btn-primary" onClick={startBreak}>
            {t('focusStartBreak')}
          </button>
        )}
      </div>

      <div className="washi-tape washi-blue" style={{ marginBottom: 0 }} />
    </div>
  );
}
