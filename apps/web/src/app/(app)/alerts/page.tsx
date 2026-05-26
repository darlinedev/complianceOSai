"use client";

import React, { useState } from "react";
import { demoAlerts } from "@/lib/demo-data";
import { SeverityBadge } from "@/components/badges/SeverityBadge";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function AlertsPage() {
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">("ALL");
  const [alertsList, setAlertsList] = useState(demoAlerts);

  const filteredAlerts = alertsList.filter((a) => {
    if (filter === "ALL") return true;
    return a.severity === filter;
  });

  const handleAcknowledge = (id: string) => {
    setAlertsList(prev =>
      prev.map(a => (a.id === id ? { ...a, status: "RESOLVED" as const } : a))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inbox de Supervision (Monitoring)</h2>
          <p className="text-xs text-slate-500 mt-1">
            Surveillance en temps réel des risques algorithmiques : dérive de données, dégradation de performance, failles de sécurité.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 p-1 border border-slate-200 rounded-lg self-start">
          {[
            { id: "ALL", label: "Toutes" },
            { id: "CRITICAL", label: "Critique" },
            { id: "WARNING", label: "Warning" },
            { id: "INFO", label: "Info" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as "ALL" | "CRITICAL" | "WARNING" | "INFO")}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                filter === tab.id
                  ? "bg-accent text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 bg-white border rounded-card shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
              alert.status === "RESOLVED" ? "opacity-60" : "hover:border-slate-300"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  alert.severity === "CRITICAL"
                    ? "bg-red-50 text-red-600"
                    : alert.severity === "WARNING"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <AlertCircle size={18} className="stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {alert.systemName || "Global / Législatif"}
                  </span>
                  <SeverityBadge severity={alert.severity} />
                </div>
                <h4 className="text-sm font-bold text-slate-800">{alert.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">{alert.body}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 shrink-0">
              <span className="text-xs text-slate-400 font-medium">
                {new Date(alert.createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              {alert.status === "OPEN" ? (
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Acquitter l&apos;alerte
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                  <CheckCircle size={14} /> Traitée
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
