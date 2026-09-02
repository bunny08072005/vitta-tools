import { useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

const defaultColors = [
  '#1B6B3A', '#06b6d4', '#C5A55A', '#f43f5e', '#10b981',
  '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6',
];

const formatINR = (val) => {
  const abs = Math.abs(val);
  if (abs >= 1e7) return `₹${(val / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(val / 1e5).toFixed(2)} L`;
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
};

// Crosshair plugin
const crosshairPlugin = {
  id: 'crosshair',
  afterDraw(chart) {
    if (chart.config.type !== 'line') return;
    const tooltip = chart.tooltip;
    if (!tooltip || !tooltip.getActiveElements().length) return;
    const ctx = chart.ctx;
    const x = tooltip.caretX;
    const topY = chart.scales.y.top;
    const bottomY = chart.scales.y.bottom;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, topY);
    ctx.lineTo(x, bottomY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(27, 107, 58, 0.35)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  },
};

ChartJS.register(crosshairPlugin);

// Detect current theme
function getThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  return {
    tooltipBg: isDark ? 'rgba(10, 12, 11, 0.95)' : 'rgba(255, 255, 255, 0.96)',
    tooltipTitle: isDark ? '#e8ede9' : '#1a2a1e',
    tooltipBody: isDark ? '#8a9a8e' : '#4a6050',
    tooltipBorder: isDark ? 'rgba(27, 107, 58, 0.3)' : 'rgba(27, 107, 58, 0.15)',
    legendColor: isDark ? '#8a9a8e' : '#4a6050',
    gridColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
    tickColor: isDark ? '#4a5a4e' : '#8a9a90',
  };
}

export default function ChartDisplay({ type = 'doughnut', data, options = {}, height = 400 }) {
  const chartRef = useRef(null);
  const tc = getThemeColors();

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: type === 'line' ? 'index' : 'nearest',
      intersect: false,
    },
    plugins: {
      legend: {
        position: type === 'doughnut' ? 'bottom' : 'top',
        labels: {
          color: tc.legendColor,
          font: { family: "'Inter', sans-serif", size: 14, weight: '500' },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: tc.tooltipBg,
        titleColor: tc.tooltipTitle,
        bodyColor: tc.tooltipBody,
        borderColor: tc.tooltipBorder,
        borderWidth: 1,
        cornerRadius: 10,
        padding: { top: 10, bottom: 10, left: 14, right: 14 },
        bodyFont: { family: "'Inter', sans-serif", size: 14, weight: '500' },
        titleFont: { family: "'Inter', sans-serif", size: 14, weight: '600' },
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          title: (items) => items[0]?.label || '',
          label: (context) => {
            const val = context.parsed.y ?? context.parsed;
            if (typeof val === 'number') {
              return ` ${context.dataset.label || context.label}: ${formatINR(val)}`;
            }
            return context.formattedValue;
          },
          afterBody: (items) => {
            if (type !== 'line' || items.length < 2) return '';
            const corpus = items[0]?.parsed?.y || 0;
            const invested = items[1]?.parsed?.y || 0;
            const gains = corpus - invested;
            if (gains > 0) return `\n  Wealth gained: ${formatINR(gains)}`;
            return '';
          },
        },
      },
    },
    ...(type !== 'doughnut' && {
      scales: {
        x: {
          grid: { color: tc.gridColor, drawBorder: false },
          ticks: { color: tc.tickColor, font: { family: "'Inter', sans-serif", size: 13, weight: '500' }, maxRotation: 0 },
          border: { display: false },
        },
        y: {
          grid: { color: tc.gridColor, drawBorder: false },
          border: { display: false },
          ticks: {
            color: tc.tickColor,
            font: { family: "'Inter', sans-serif", size: 13 },
            padding: 8,
            callback: (val) => {
              if (val >= 1e7) return `₹${(val / 1e7).toFixed(1)}Cr`;
              if (val >= 1e5) return `₹${(val / 1e5).toFixed(0)}L`;
              if (val >= 1e3) return `₹${(val / 1e3).toFixed(0)}K`;
              return `₹${val}`;
            }
          },
        },
      },
    }),
  };

  const mergedOptions = { ...baseOptions, ...options };
  if (options.scales) mergedOptions.scales = { ...baseOptions.scales, ...options.scales };
  if (options.plugins) mergedOptions.plugins = { ...baseOptions.plugins, ...options.plugins };

  const enhancedData = {
    ...data,
    datasets: data.datasets.map((ds) => ({
      ...ds,
      backgroundColor: ds.backgroundColor || (type === 'doughnut' ? defaultColors : 'rgba(27, 107, 58, 0.12)'),
      borderColor: ds.borderColor || (type === 'doughnut' ? 'rgba(8,10,11,0.8)' : '#1B6B3A'),
      borderWidth: ds.borderWidth ?? (type === 'doughnut' ? 2 : 2),
      ...(type === 'line' && {
        tension: 0.35,
        fill: ds.fill ?? true,
        pointRadius: ds.pointRadius ?? 0,
        pointHoverRadius: ds.pointHoverRadius ?? 6,
        pointHoverBackgroundColor: ds.borderColor || '#1B6B3A',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      }),
      ...(type === 'bar' && {
        borderRadius: 6,
        borderSkipped: false,
      }),
    })),
  };

  if (type === 'doughnut') {
    return (
      <div className="chart-wrapper" style={{ height }}>
        <Doughnut ref={chartRef} data={enhancedData} options={{
          ...mergedOptions, cutout: '68%',
          interaction: { mode: 'nearest', intersect: true },
        }} />
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className="chart-wrapper" style={{ height }}>
        <Bar ref={chartRef} data={enhancedData} options={mergedOptions} />
      </div>
    );
  }

  return (
    <div className="chart-wrapper" style={{ height }}>
      <Line ref={chartRef} data={enhancedData} options={mergedOptions} />
    </div>
  );
}
