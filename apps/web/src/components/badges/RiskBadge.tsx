import React from "react";

interface RiskBadgeProps {
  level: "HIGH" | "LIMITED" | "MINIMAL" | "PROHIBITED";
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className = "" }) => {
  const configs = {
    HIGH: {
      bg: "bg-red-50 border-red-200 text-red-700",
      dot: "bg-red-500",
      label: "Haut Risque",
    },
    LIMITED: {
      bg: "bg-amber-50 border-amber-200 text-amber-700",
      dot: "bg-amber-500",
      label: "Risque Limité",
    },
    MINIMAL: {
      bg: "bg-green-50 border-green-200 text-green-700",
      dot: "bg-green-500",
      label: "Risque Minimal",
    },
    PROHIBITED: {
      bg: "bg-red-100 border-red-300 text-red-900",
      dot: "bg-red-800",
      label: "Inacceptable / Interdit",
    },
  };

  const config = configs[level] || configs.MINIMAL;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
export default RiskBadge;
