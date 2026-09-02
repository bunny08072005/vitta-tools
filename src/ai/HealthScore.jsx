import { useEffect, useRef, useState } from 'react';

export default function HealthScore({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const duration = 1200;
    const start = Date.now();
    const target = score.score;

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setAnimatedScore(current);
      drawGauge(current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    animate();
  }, [score]);

  const drawGauge = (current) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 180;
    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    const cx = size / 2;
    const cy = size / 2 + 8;
    const radius = 64;
    const startAngle = Math.PI * 0.8;
    const endAngle = Math.PI * 2.2;
    const progressAngle = startAngle + (endAngle - startAngle) * (current / 100);

    ctx.clearRect(0, 0, size, size + 16);

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Progress arc
    if (current > 0) {
      const gradient = ctx.createLinearGradient(0, 0, size, 0);
      if (current >= 70) {
        gradient.addColorStop(0, '#1B6B3A');
        gradient.addColorStop(1, '#10b981');
      } else if (current >= 40) {
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(1, '#d97706');
      } else {
        gradient.addColorStop(0, '#f43f5e');
        gradient.addColorStop(1, '#e11d48');
      }
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, progressAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const getColor = (s) => s >= 70 ? 'var(--green)' : s >= 40 ? 'var(--amber)' : 'var(--red)';

  const breakdownItems = Object.values(score.breakdown);

  return (
    <div className="hs-card glass-card" id="health-score">
      <h3>Financial Health</h3>

      <div className="hs-gauge">
        <canvas ref={canvasRef} className="hs-canvas" />
        <div className="hs-center">
          <span className="hs-number mono" style={{ color: getColor(animatedScore) }}>{animatedScore}</span>
          <span className="hs-grade" style={{ color: getColor(animatedScore) }}>{score.grade}</span>
          <span className="hs-label">{score.label}</span>
        </div>
      </div>

      <div className="hs-breakdown">
        {breakdownItems.map((item) => (
          <div className="hs-row" key={item.label}>
            <div className="hs-row-top">
              <span className="hs-row-label">{item.label}</span>
              <span className="hs-row-score mono">{item.score}<span className="hs-row-max">/{item.max}</span></span>
            </div>
            <div className="hs-bar">
              <div className="hs-bar-fill" style={{
                width: `${(item.score / item.max) * 100}%`,
                background: item.score >= item.max * 0.7 ? 'var(--green)' : item.score >= item.max * 0.4 ? 'var(--amber)' : 'var(--red)',
              }} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .hs-card { padding: 24px; }
        .hs-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
        .hs-gauge { position: relative; width: 180px; height: 140px; margin: 0 auto; }
        .hs-canvas { width: 180px; height: 180px; position: absolute; top: -8px; left: 0; }
        .hs-center { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); text-align: center; }
        .hs-number { font-size: 2.2rem; font-weight: 800; display: block; line-height: 1; letter-spacing: -0.03em; }
        .hs-grade { font-size: 0.75rem; font-weight: 700; display: block; margin-top: 1px; }
        .hs-label { font-size: 0.7rem; color: var(--text-muted); display: block; margin-top: 1px; }
        .hs-breakdown { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
        .hs-row-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
        .hs-row-label { font-size: 0.72rem; color: var(--text-muted); font-weight: 450; }
        .hs-row-score { font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); }
        .hs-row-max { color: var(--text-muted); font-weight: 400; }
        .hs-bar { height: 4px; background: var(--glass); border-radius: 2px; overflow: hidden; }
        .hs-bar-fill { height: 100%; border-radius: 2px; transition: width 0.8s var(--ease-out); }
      `}</style>
    </div>
  );
}
