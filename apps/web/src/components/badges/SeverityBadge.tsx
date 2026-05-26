import React from "react";

interface SeverityBadgeProps {
  severity: "CRITICAL" | "WARNING" | "INFO";
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = "" }) => {
  const configs = {
    CRITICAL: {
      bg: "bg-[#FCEBEB] border-[#F8D7D7] text-[#A32D2D]",
      dot: "bg-[#A32D2D]",
      label: "CRITICAL",
    },
    WARNING: {
      bg: "bg-[#FAEEDA] border-[#F4E0C1] text-[#633806]",
      dot: "bg-[#633806]",
      label: "WARNING",
    },
    INFO: {
      bg: "bg-[#E6F1FB] border-[#C8E1F7] text-[#185FA5]",
      dot: "bg-[#185FA5]",
      label: "INFO",
    },
  };

  const config = configs[severity] || configs.INFO;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
export default SeverityBadge;
