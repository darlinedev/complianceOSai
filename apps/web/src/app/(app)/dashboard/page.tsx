"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  CheckCircle2,
  AlertOctagon,
  Percent,
  TrendingUp,
  MoreVertical,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Eye,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { demoAlerts, Alert } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/client";
import { SeverityBadge } from "@/components/badges/SeverityBadge";
import { ScoreSparkline } from "@/components/charts/ScoreSparkline";
import { LegalDisclaimer } from "@/components/domain/LegalDisclaimer";
import Link from "next/link";

// 8 weeks of data for compliance score
const complianceScoreData = [
  { week: "S-7", score: 50 },
  { week: "S-6", score: 52 },
  { week: "S-5", score: 53 },
  { week: "S-4", score: 55 },
  { week: "S-3", score: 56 },
  { week: "S-2", score: 57 },
  { week: "S-1", score: 57 },
  { week: "Actuelle", score: 59 },
];

// Evolution of systems
const systemEvolutionData = {
  "1-month": [
    { name: "Sem 1", conformes: 1, en_cours: 2, non_conformes: 1 },
    { name: "Sem 2", conformes: 1, en_cours: 3, non_conformes: 1 },
    { name: "Sem 3", conformes: 2, en_cours: 2, non_conformes: 1 },
    { name: "Sem 4", conformes: 2, en_cours: 2, non_conformes: 1 },
  ],
  "3-months": [
    { name: "Mars", conformes: 1, en_cours: 1, non_conformes: 0 },
    { name: "Avril", conformes: 1, en_cours: 2, non_conformes: 1 },
    { name: "Mai", conformes: 2, en_cours: 2, non_conformes: 1 },
  ],
  "6-months": [
    { name: "Déc", conformes: 0, en_cours: 1, non_conformes: 0 },
    { name: "Jan", conformes: 1, en_cours: 1, non_conformes: 0 },
    { name: "Fév", conformes: 1, en_cours: 2, non_conformes: 0 },
    { name: "Mar", conformes: 1, en_cours: 2, non_conformes: 1 },
    { name: "Avr", conformes: 2, en_cours: 2, non_conformes: 1 },
    { name: "Mai", conformes: 2, en_cours: 2, non_conformes: 1 },
  ],
};

export default function Dashboard() {
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [activeAlertTab, setActiveAlertTab] = useState<"ALL" | "CRITICAL" | "WARNING" | "INFO">("ALL");
  const [timeRange, setTimeRange] = useState<"1-month" | "3-months" | "6-months">("3-months");
  const kpiTimeRange = "Cette Année";
  const [activeAlertMenu, setActiveAlertMenu] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(demoAlerts);

  // Prevent Recharts hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real alerts if Supabase is active
  useEffect(() => {
    async function loadAlerts() {
      const isRealSupabase = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url";

      if (!isRealSupabase) return;

      try {
        const { data, error } = await supabase
          .from("alerts")
          .select("*, systems(name)")
          .order("created_at", { ascending: false });

        if (data && !error) {
          const mapped: Alert[] = (data as unknown[]).map((item) => {
            const a = item as {
              id: string;
              system_id?: string;
              systems?: { name: string } | null;
              category?: string;
              severity?: string;
              title: string;
              body?: string;
              status?: string;
              created_at?: string;
            };
            return {
              id: a.id,
              systemId: a.system_id,
              systemName: a.systems?.name || "Global / Externe",
              type: a.category === "DATA_DRIFT" ? "DATA_DRIFT" : "COMPLIANCE_VIOLATION",
              severity: (a.severity as 'CRITICAL' | 'WARNING' | 'INFO') || "INFO",
              title: a.title,
              body: a.body || "Alerte de conformité détectée automatiquement.",
              status: a.status === "ACTIVE" ? "OPEN" : "RESOLVED",
              createdAt: a.created_at || new Date().toISOString(),
            };
          });
          setAlerts(mapped);
        }
      } catch (err) {
        console.error("Failed to load alerts from Supabase:", err);
      }
    }
    loadAlerts();
  }, [supabase]);

  // Filter alerts based on selected tab
  const filteredAlerts = alerts.filter((alert) => {
    if (activeAlertTab === "ALL") return true;
    return alert.severity === activeAlertTab;
  }).slice(0, 5); // display top 5

  const acknowledgedAlert = async (id: string) => {
    // 1. Update UI state instantly
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "RESOLVED" } : a))
    );
    setActiveAlertMenu(null);

    // 2. Persist in database if active
    const isRealSupabase = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url";

    if (!isRealSupabase) {
      console.log("ComplianceOS running in offline Demo Mode: Alert status updated locally.");
      return;
    }

    try {
      const { error } = await supabase
        .from("alerts")
        .update({ status: "RESOLVED" })
        .eq("id", id);

      if (error) {
        console.error("Failed to update alert in Supabase:", error);
      } else {
        console.log(`Alert ${id} successfully marked as RESOLVED in PostgreSQL.`);
      }
    } catch (err) {
      console.error("Error during alert status sync:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Statistics Cards (Replicating Skylab Digital grid styling) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Declared AI Systems */}
        <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card flex flex-col justify-between h-[155px] relative group hover:shadow-raised transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-accent">
              <Cpu size={20} className="stroke-[2.2]" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Systèmes IA</span>
              <h4 className="text-3xl font-extrabold text-slate-900 mt-1">5</h4>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="flex flex-col">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
                <TrendingUp size={14} /> +20%
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">Depuis le mois dernier</span>
            </div>
            <div className="opacity-90">
              <ScoreSparkline data={[2, 3, 3, 4, 4, 5]} color="#2E6BE6" />
            </div>
          </div>
        </div>

        {/* Card 2: Compliant Systems */}
        <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card flex flex-col justify-between h-[155px] relative group hover:shadow-raised transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle2 size={20} className="stroke-[2.2]" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">Conformes</span>
              <h4 className="text-3xl font-extrabold text-slate-900 mt-1">2</h4>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="flex flex-col">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">
                +1 ce mois
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">Sur 3 systèmes évalués</span>
            </div>
            <div className="opacity-90">
              <ScoreSparkline data={[1, 1, 1, 2, 2, 2]} color="#16A34A" />
            </div>
          </div>
        </div>

        {/* Card 3: Active Alerts */}
        <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card flex flex-col justify-between h-[155px] relative group hover:shadow-raised transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <AlertOctagon size={20} className="stroke-[2.2]" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alertes</span>
              <h4 className="text-3xl font-extrabold text-slate-900 mt-1">3</h4>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="flex flex-col">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                2 CRITIQUES
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">Nécessite votre attention</span>
            </div>
            <div className="opacity-90">
              <ScoreSparkline data={[4, 5, 3, 5, 2, 3]} color="#DC2626" />
            </div>
          </div>
        </div>

        {/* Card 4: Average Score */}
        <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card flex flex-col justify-between h-[155px] relative group hover:shadow-raised transition-all duration-300">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Percent size={20} className="stroke-[2.2]" />
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score Moyen</span>
              <h4 className="text-3xl font-extrabold text-slate-900 mt-1">59<span className="text-slate-400 text-lg font-bold">/100</span></h4>
            </div>
          </div>
          <div className="flex justify-between items-end mt-4">
            <div className="flex flex-col">
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-green-600">
                <TrendingUp size={14} /> +2%
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">Depuis la semaine S-1</span>
            </div>
            <div className="opacity-90">
              <ScoreSparkline data={[50, 52, 53, 55, 57, 59]} color="#7C3AED" />
            </div>
          </div>
        </div>
      </div>

      {/* Two side-by-side charts (Skylab Digital layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Bar Chart (Score de conformité) */}
        <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Score de Conformité Global
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Évolution hebdomadaire moyenne par rapport à l&apos;AI Act
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600">
              <Calendar size={14} className="text-slate-400" />
              <span>{kpiTimeRange}</span>
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complianceScoreData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-raised text-xs">
                            <span className="font-semibold text-slate-500">{payload[0].payload.week}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="w-2.5 h-2.5 rounded bg-accent" />
                              <span className="font-bold text-slate-800">Score: {payload[0].value}/100</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={38}>
                    {complianceScoreData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === complianceScoreData.length - 1 ? "#2E6BE6" : "#BFDBFE"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-slate-50 animate-pulse rounded-lg" />
            )}
          </div>
        </div>

        {/* Right: Line Chart (Évolution systèmes) */}
        <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Répartition des Systèmes IA
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Évolution du statut de conformité des algorithmes
              </p>
            </div>
            {/* Period Selector */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as "1-month" | "3-months" | "6-months")}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer"
              >
                <option value="1-month">Ce Mois</option>
                <option value="3-months">3 Derniers Mois</option>
                <option value="6-months">6 Derniers Mois</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1 w-full min-h-0">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={systemEvolutionData[timeRange]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      borderColor: "#E2E8F0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: 500 }} />
                  <Line
                    type="monotone"
                    name="Conformes"
                    dataKey="conformes"
                    stroke="#16A34A"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 1.5, fill: "#FFF" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    name="En cours"
                    dataKey="en_cours"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 1.5, fill: "#FFF" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    name="Non conformes"
                    dataKey="non_conformes"
                    stroke="#DC2626"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 1.5, fill: "#FFF" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-slate-50 animate-pulse rounded-lg" />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Table: Last Active Alerts (Skylab style table with tab headers) */}
      <div className="bg-white rounded-card border border-slate-200 shadow-card flex flex-col overflow-hidden">
        {/* Table Header with Tabs */}
        <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Inbox des Alertes Actives
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Suivi et traitement des dérives et violations de conformité
            </p>
          </div>
          {/* Tabs style pill buttons (Skylab style, active = accent) */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200/60 self-start">
            {[
              { id: "ALL", label: "Toutes" },
              { id: "CRITICAL", label: "Critique" },
              { id: "WARNING", label: "Warning" },
              { id: "INFO", label: "Info" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveAlertTab(tab.id as "ALL" | "CRITICAL" | "WARNING" | "INFO")}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  activeAlertTab === tab.id
                    ? "bg-accent text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Workspace */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                <th className="px-5 py-3.5">Système IA</th>
                <th className="px-5 py-3.5">Type d&apos;alerte</th>
                <th className="px-5 py-3.5">Criticité</th>
                <th className="px-5 py-3.5">Date de détection</th>
                <th className="px-5 py-3.5">Statut</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-400">
                    Aucune alerte active dans cette catégorie.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* IA System */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">
                          {alert.systemName || "Global / Externe"}
                        </span>
                        {alert.systemId && (
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            ID: {alert.systemId}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Alert Type & details */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col max-w-[280px]">
                        <span className="text-xs font-semibold text-slate-700 leading-normal line-clamp-1">
                          {alert.title}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                          {alert.body}
                        </span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="px-5 py-3.5">
                      <SeverityBadge severity={alert.severity} />
                    </td>

                    {/* Detection Date */}
                    <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">
                      {new Date(alert.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          alert.status === "OPEN"
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-green-50 border-green-200 text-green-700"
                        }`}
                      >
                        {alert.status === "OPEN" ? "Non traité" : "Résolue"}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-5 py-3.5 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => acknowledgedAlert(alert.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-accent hover:text-accent-hover hover:bg-blue-50 rounded transition-colors"
                        >
                          Acquitter
                        </button>
                        <button
                          onClick={() =>
                            setActiveAlertMenu(activeAlertMenu === alert.id ? null : alert.id)
                          }
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Dropdown Menu for Actions */}
                      {activeAlertMenu === alert.id && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setActiveAlertMenu(null)}
                          />
                          <div className="absolute right-5 mt-1 w-44 bg-white rounded-lg shadow-raised border border-slate-200 py-1.5 z-40 text-left">
                            <button
                              onClick={() => acknowledgedAlert(alert.id)}
                              className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                              <ShieldCheck size={14} className="text-green-500" />
                              Marquer résolue
                            </button>
                            {alert.systemId && (
                              <Link
                                href={`/systems/${alert.systemId}`}
                                className="w-full px-3 py-1.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 block"
                              >
                                <Eye size={14} className="text-slate-400" />
                                Voir le système IA
                              </Link>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* View All Alerts Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-center flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">
            Affichage de 5 alertes sur 8 au total
          </span>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover transition-colors"
          >
            Consulter l&apos;historique complet <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Persistent Legal Disclaimer */}
      <LegalDisclaimer />
    </div>
  );
}
