'use client';

interface SparklineProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

export default function Sparkline({
  data,
  isPositive,
  width = 100,
  height = 40,
}: SparklineProps) {
  if (!data || data.length === 0) return null;

  // Normalize data points to fit SVG canvas dimensions
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Sample data to keep path smooth and light (taking every 4th point if data is dense)
  const sampledData = data.filter((_, index) => index % 4 === 0);

  const points = sampledData
    .map((val, idx) => {
      const x = (idx / (sampledData.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4; // 4px vertical padding
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}