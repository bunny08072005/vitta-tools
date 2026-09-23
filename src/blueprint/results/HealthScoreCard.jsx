import { useEffect, useRef, useState } from 'react';

// Same animated gauge concept as src/ai/HealthScore.jsx, kept local to the
// Blueprint tool (own class names) rather than imported, per the "standalone"
// design — the pillars scored are goal-based here, not retirement-only.
export default function HealthScoreCard({ score }) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    if (current > 0) {
      const gradient = ctx.createLinearGradient(0, 0, size, 0);
      if (current >= 70) { gradient.addColorStop(0, '#1B6B3A'); gradient.addColorStop(1, '#10b981'); }
      else if (current >= 40) { gradient.addColorStop(0, '#f59e0b'); gradient.addColorStop(1, '#d97706'); }
      else { gradient.addColorStop(0, '#f43f5e'); gradient.addColorStop(1, '#e11d48'); }
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, progressAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  };

  const getColor = (s) => (s >= 70 ? 'var(--green)' : s >= 40 ? 'var(--amber)' : 'var(--red)');
  const breakdownItems = Object.values(score.breakdown);

  return (
    <div className="bp-hs-card glass-card" id="bp-health-score">
      <h3>Financial Health</h3>
      <div className="bp-hs-gauge">
        <canvas ref={canvasRef} className="bp-hs-canvas" />
        <div className="bp-hs-center">
          <span className="bp-hs-number mono" style={{ color: getColor(animatedScore) }}>{animatedScore}</span>
          <span className="bp-hs-grade" style={{ color: getColor(animatedScore) }}>{score.grade}</span>
          <span className="bp-hs-label">{score.label}</span>
        </div>
      </div>
      <div className="bp-hs-breakdown">
        {breakdownItems.map((item) => (
          <div className="bp-hs-row" key={item.label}>
            <div className="bp-hs-row-top">
              <span className="bp-hs-row-label">{item.label}</span>
              <span className="bp-hs-row-score mono">{item.score}<span className="bp-hs-row-max">/{item.max}</span></span>
            </div>
            <div className="bp-hs-bar">
              <div className="bp-hs-bar-fill" style={{
                width: `${(item.score / item.max) * 100}%`,
                background: item.score >= item.max * 0.7 ? 'var(--green)' : item.score >= item.max * 0.4 ? 'var(--amber)' : 'var(--red)',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
