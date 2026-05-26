import React from "react";

interface ComplianceGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export const ComplianceGauge: React.FC<ComplianceGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 12,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  // Determine color based on score
  const getColor = (val: number) => {
    if (val >= 80) return "#16A34A"; // Green (Compliant)
    if (val >= 60) return "#F59E0B"; // Amber (In Progress)
    return "#DC2626"; // Red (Non Compliant / High Risk)
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90 overflow-visible">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Absolute text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{score}</span>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-0.5">SCORE</span>
      </div>
    </div>
  );
};
export default ComplianceGauge;
