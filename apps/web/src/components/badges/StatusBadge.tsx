import React from "react";

interface StatusBadgeProps {
  status: "DRAFT" | "IN_PROGRESS" | "COMPLIANT" | "NON_COMPLIANT" | "ARCHIVED";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const configs = {
    COMPLIANT: {
      bg: "bg-green-50 border-green-200 text-green-700",
      dot: "bg-green-500",
      label: "Conforme",
    },
    IN_PROGRESS: {
      bg: "bg-amber-50 border-amber-200 text-amber-700",
      dot: "bg-amber-500",
      label: "En cours",
    },
    NON_COMPLIANT: {
      bg: "bg-red-50 border-red-200 text-red-700",
      dot: "bg-red-500",
      label: "Non conforme",
    },
    DRAFT: {
      bg: "bg-slate-50 border-slate-200 text-slate-600",
      dot: "bg-slate-400",
      label: "Brouillon",
    },
    ARCHIVED: {
      bg: "bg-slate-100 border-slate-200 text-slate-500",
      dot: "bg-slate-400",
      label: "Archivé",
    },
  };

  const config = configs[status] || configs.DRAFT;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
export default StatusBadge;
