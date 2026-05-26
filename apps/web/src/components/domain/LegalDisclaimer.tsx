import React from "react";
import { Info } from "lucide-react";

interface LegalDisclaimerProps {
  className?: string;
  variant?: "card" | "text";
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  className = "",
  variant = "card",
}) => {
  const text = "Ce document est une aide à la décision. Il ne constitue pas un conseil juridique.";

  if (variant === "text") {
    return (
      <p className={`text-[11px] text-slate-400 font-medium italic ${className}`}>
        * {text}
      </p>
    );
  }

  return (
    <div
      className={`flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-normal ${className}`}
    >
      <Info size={14} className="text-slate-400 mt-0.5 shrink-0" />
      <div>
        <span className="font-bold text-slate-700">Avis de non-responsabilité :</span> {text}
      </div>
    </div>
  );
};
export default LegalDisclaimer;
