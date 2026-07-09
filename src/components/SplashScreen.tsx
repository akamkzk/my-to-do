import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 600);
    }, 3200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`splash-screen ${visible ? 'visible' : 'hidden'}`}>
      {/* 背景层 — 与 kraft-paper.css 完全一致 */}
      <div className="splash-bg" />

      {/* 飞行光点 — 沿轨迹曲线飞行 */}
      <div className="splash-airplane" aria-hidden="true">
        <svg viewBox="0 0 40 40" className="airplane-svg">
          {/* 外发光 */}
          <circle cx="20" cy="20" r="14" fill="rgba(139,109,70,0.12)" />
          {/* 核心亮点 */}
          <circle cx="20" cy="20" r="5" fill="#8b6d46" />
          {/* 十字星芒 */}
          <line x1="20" y1="6" x2="20" y2="12" stroke="#8b6d46" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="28" x2="20" y2="34" stroke="#8b6d46" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="20" x2="12" y2="20" stroke="#8b6d46" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="28" y1="20" x2="34" y2="20" stroke="#8b6d46" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* 飞行尾迹 */}
      <svg className="splash-trail" viewBox="0 0 800 300" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b6d46" stopOpacity="0" />
            <stop offset="60%" stopColor="#8b6d46" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b6d46" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M -20 200 C 150 220, 250 80, 400 120 C 550 160, 600 60, 820 80"
          fill="none"
          stroke="url(#trailGrad)"
          strokeWidth="2"
          strokeDasharray="800"
          strokeDashoffset="800"
          className="trail-path"
        />
      </svg>

      {/* 软件名称 */}
      <div className="splash-title-group">
        <svg className="splash-title-svg" viewBox="0 0 600 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3e2f1c" stopOpacity="0" />
              <stop offset="30%" stopColor="#3e2f1c" stopOpacity="1" />
              <stop offset="70%" stopColor="#3e2f1c" stopOpacity="1" />
              <stop offset="100%" stopColor="#3e2f1c" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* 日文主标题 — 描边动画 */}
          <text
            x="300"
            y="48"
            textAnchor="middle"
            className="splash-title-ja"
            fill="url(#textGrad)"
          >
            マイ・ジャーナル
          </text>
          {/* 中文副标题 */}
          <text
            x="300"
            y="78"
            textAnchor="middle"
            className="splash-subtitle"
            fill="#6b5a45"
            fontSize="18"
            fontFamily="var(--font-main)"
          >
            我的日志
          </text>
        </svg>
      </div>

      {/* 粒子特效 — 沿轨迹散布 */}
      <div className="particles" aria-hidden="true">
        {[...Array(14)].map((_, i) => (
          <span key={i} className="particle" />
        ))}
      </div>
    </div>
  );
}
