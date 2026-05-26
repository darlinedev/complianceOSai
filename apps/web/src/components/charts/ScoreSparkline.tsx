import React from "react";

interface ScoreSparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export const ScoreSparkline: React.FC<ScoreSparklineProps> = ({
  data,
  color = "#2E6BE6",
  width = 120,
  height = 40,
}) => {
  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data
    .map((val, index) => {
      const x = (index / (data.length - 1)) * width;
      // Invert Y so higher score is at the top of the SVG
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Background soft shadow gradient of the line */}
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      
      {/* Area under the path */}
      <path
        d={`M 0,${height} L ${points} L ${width},${height} Z`}
        fill={`url(#gradient-${color})`}
      />
      
      {/* Smooth curve line */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      
      {/* Dot on the last point */}
      {data.length > 0 && (
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 6) - 3}
          r="3.5"
          fill={color}
          stroke="#FFFFFF"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
};
export default ScoreSparkline;
