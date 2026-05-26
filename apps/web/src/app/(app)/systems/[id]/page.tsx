"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { demoSystems } from "@/lib/demo-data";
import { RiskBadge } from "@/components/badges/RiskBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import { SeverityBadge } from "@/components/badges/SeverityBadge";
import { ComplianceGauge } from "@/components/charts/ComplianceGauge";
import {
  ArrowLeft,
  Layers,
  FileText,
  Activity,
  Clock,
  Play,
  FileDown,
  Edit2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  X,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Gaps mock data
interface Gap {
  id: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  title: string;
  actionRequired: string;
}

// Past audits mock data
interface AuditHistory {
  date: string;
  score: number;
  gapsCount: number;
  auditor: "IA (Agent)" | "Manuel";
  reportUrl: string;
}

// 8 Sections of Art 11 Technical Document
const art11Sections = [
  { id: "sec-1", title: "1. Description générale du système d'IA", content: "Cette section fournit une vue d'ensemble complète du système d'IA, y compris son utilisation prévue, son architecture, ses intrants et ses extrants." },
  { id: "sec-2", title: "2. Spécifications et architecture technique", content: "Détails sur l'architecture du modèle (ex. XGBoost Classifier, hyperparamètres, configurations d'entraînement) et les ressources de calcul utilisées." },
  { id: "sec-3", title: "3. Flux de données & Gouvernance des données", content: "Description des pipelines de données, de la provenance des données d'entraînement, des étapes de nettoyage, de filtrage et des analyses d'équité démographique menées." },
  { id: "sec-4", title: "4. Système de gestion des risques", content: "Registre exhaustif des risques identifiés (biais, dérive, cyberattaques), de leur probabilité et des mécanismes d'atténuation techniques ou organisationnels mis en place." },
  { id: "sec-5", title: "5. Robustesse, sécurité et précision", content: "Indicateurs clés de performance du modèle (Accuracy, AUC, F1-score), robustesse face aux attaques contradictoires et redondance des infrastructures." },
  { id: "sec-6", title: "6. Explicabilité et transparence", content: "Mécanismes d'explicabilité utilisés (ex. valeurs SHAP, arbres de décision explicables) et guide d'information destiné aux déployeurs finaux." },
  { id: "sec-7", title: "7. Contrôle humain (Human-in-the-loop)", content: "Procédures opérationnelles garantissant qu'une personne physique qualifiée peut surveiller, interrompre ou contourner les décisions du système." },
  { id: "sec-8", title: "8. Déclaration de conformité de l'UE", content: "Attestation de conformité officielle listant les normes harmonisées appliquées et l'historique des audits menés." },
];

export default function SystemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "docs" | "alerts" | "history">("overview");
  
  // Doc Generator States
  const [isGeneratingDoc, setIsGeneratingDoc] = useState(false);
  const [docGenerationStep, setDocGenerationStep] = useState("");
  const [docVersion, setDocVersion] = useState("v1.2");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // System Details States & Real-Time Sync
  const systemId = params.id as string;
  const initialSystem = demoSystems.find((s) => s.id === systemId);
  const [system, setSystem] = useState(initialSystem);
  const [complianceScore, setComplianceScore] = useState(initialSystem?.complianceScore || 50);

  // AI Agent Audit States
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState("");

  // Edit Modal State & Form Values
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    useCase: "",
    modelName: "",
    modelProvider: "",
    ownerName: "",
  });

  // Toast Notification State
  const [showToast, setShowToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Sync edit form with system state when opened
  useEffect(() => {
    if (system) {
      setEditForm({
        name: system.name,
        description: system.description,
        useCase: system.useCase,
        modelName: system.modelName,
        modelProvider: system.modelProvider,
        ownerName: system.ownerName,
      });
    }
  }, [system, isEditOpen]);

  // Prevent Recharts hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real system details from Supabase if online
  useEffect(() => {
    async function loadSystem() {
      const isRealSupabase = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url";

      if (!isRealSupabase) return;

      try {
        const { data, error } = await supabase
          .from("systems")
          .select("*")
          .eq("id", systemId)
          .single();

        if (data && !error) {
          setSystem({
            id: data.id,
            name: data.name,
            description: data.description || "",
            riskLevel: data.risk_level || "HIGH",
            annexReference: data.annex_reference || "",
            useCase: data.use_case || "",
            dataTypes: data.data_types || [],
            modelProvider: data.model_provider || "",
            modelName: data.model_name || "",
            status: data.status || "IN_PROGRESS",
            complianceScore: data.compliance_score || 50,
            ownerName: data.owner_name || "",
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          });
          setComplianceScore(data.compliance_score || 50);
        }
      } catch (err) {
        console.error("Failed to load system from Supabase:", err);
      }
    }
    loadSystem();
  }, [systemId, supabase]);

  if (!system) {
    return (
      <div className="text-center py-12 bg-white rounded-card border border-slate-200 p-8 max-w-md mx-auto mt-12">
        <h3 className="text-base font-bold text-slate-800">Système IA non trouvé</h3>
        <p className="text-xs text-slate-500 mt-2">Le système spécifié n&apos;existe pas ou a été archivé.</p>
        <button
          onClick={() => router.push("/systems")}
          className="mt-4 px-4 py-2 bg-accent text-white text-xs font-bold rounded-lg shadow"
        >
          Retour au registre
        </button>
      </div>
    );
  }

  // Custom mock data for gaps and details depending on risk level
  const gaps: Gap[] = system.riskLevel === "HIGH" 
    ? [
        {
          id: "gap-1",
          priority: "CRITICAL",
          title: "Analyse d'équité démographique manquante",
          actionRequired: "Réaliser un test de biais exhaustif sur les segments d'âge et de genre."
        },
        {
          id: "gap-2",
          priority: "HIGH",
          title: "Registre des données d'entraînement incomplet",
          actionRequired: "Renseigner précisément la provenance et les critères d'exclusion des jeux de données dans l'Art. 11."
        },
        {
          id: "gap-3",
          priority: "MEDIUM",
          title: "Procédure de contrôle humain non formalisée",
          actionRequired: "Définir les habilitations et les rôles de contrôle en direct (Human-in-the-loop)."
        }
      ]
    : [
        {
          id: "gap-1",
          priority: "MEDIUM",
          title: "Bannière de transparence à optimiser",
          actionRequired: "Rendre le libellé d'interaction IA plus visible lors du premier contact utilisateur."
        }
      ];

  const recentAlerts = [
    {
      id: "al-1",
      severity: "CRITICAL" as const,
      title: "Data drift détecté sur segment clé",
      body: "La proportion d'utilisateurs qualifiés a varié de 18% par rapport à l'entraînement original.",
      date: "14 mai 2026"
    },
    {
      id: "al-2",
      severity: "WARNING" as const,
      title: "Temps de réponse supérieur à 450ms",
      body: "Le p95 de latence a dépassé les objectifs internes (SLA 300ms).",
      date: "11 mai 2026"
    },
    {
      id: "al-3",
      severity: "INFO" as const,
      title: "Documentation technique consultée",
      body: "Accès de consultation enregistré par l'auditeur externe.",
      date: "10 mai 2026"
    }
  ];

  const generatedDocs = [
    {
      title: `Doc Technique Art. 11 - ${system.name}`,
      version: docVersion,
      date: "07/05/2026",
      status: system.status === "COMPLIANT" ? "VALIDATED" as const : "DRAFT" as const
    }
  ];

  const audits: AuditHistory[] = [
    {
      date: "07/05/2026",
      score: system.complianceScore,
      gapsCount: gaps.length,
      auditor: "IA (Agent)",
      reportUrl: "#"
    },
    {
      date: "15/03/2026",
      score: Math.max(10, system.complianceScore - 12),
      gapsCount: gaps.length + 2,
      auditor: "IA (Agent)",
      reportUrl: "#"
    }
  ];

  // 30 days drift chart data points
  const driftChartData = [
    { name: "Jour 1", drift: 0.02 },
    { name: "Jour 5", drift: 0.04 },
    { name: "Jour 10", drift: 0.03 },
    { name: "Jour 15", drift: 0.08 },
    { name: "Jour 20", drift: 0.09 },
    { name: "Jour 25", drift: 0.11 },
    { name: "Jour 30", drift: 0.13 }
  ];

  const handleGenerateDoc = () => {
    setActiveTab("docs");
    setIsGeneratingDoc(true);
    setDocGenerationStep("Analyse du système et extraction des logs...");
    
    setTimeout(() => {
      setDocGenerationStep("Génération des sections de l'Article 11...");
      
      setTimeout(() => {
        setDocGenerationStep("Finalisation de la fiche de conformité...");
        
        setTimeout(() => {
          setIsGeneratingDoc(false);
          setDocVersion("v1.3");
          setShowToast({
            show: true,
            title: "Documentation Générée",
            message: "La documentation technique Art. 11 (v1.3) a été rédigée avec succès par l'agent.",
            type: "success"
          });
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const handleLaunchAudit = () => {
    setIsAuditing(true);
    setAuditStep("Chargement des données de télémétrie du modèle...");
    
    setTimeout(() => {
      setAuditStep("Calcul des métriques de drift et de performance...");
      
      setTimeout(() => {
        setAuditStep("Validation des critères réglementaires de l'AI Act...");
        
        setTimeout(() => {
          setIsAuditing(false);
          const newScore = Math.min(100, complianceScore + 7);
          setComplianceScore(newScore);
          
          setShowToast({
            show: true,
            title: "Audit Terminé",
            message: `L'audit de conformité est terminé avec succès. Nouveau score : ${newScore}% !`,
            type: "success"
          });
        }, 1500);
      }, 1500);
    }, 1500);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (system) {
      const updatedSystem = {
        ...system,
        name: editForm.name,
        description: editForm.description,
        useCase: editForm.useCase,
        modelName: editForm.modelName,
        modelProvider: editForm.modelProvider,
        ownerName: editForm.ownerName,
      };
      setSystem(updatedSystem);
    }
    
    setIsEditOpen(false);
    
    setShowToast({
      show: true,
      title: "Métadonnées Enregistrées",
      message: "Les modifications apportées au système d'IA ont été enregistrées avec succès.",
      type: "success"
    });

    const isRealSupabase = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url";

    if (!isRealSupabase) return;

    try {
      const { error } = await supabase
        .from("systems")
        .update({
          name: editForm.name,
          description: editForm.description,
          use_case: editForm.useCase,
          model_name: editForm.modelName,
          model_provider: editForm.modelProvider,
          owner_name: editForm.ownerName,
        })
        .eq("id", systemId);

      if (error) {
        console.error("Failed to sync system update in Supabase:", error);
      }
    } catch (err) {
      console.error("Error updating system:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/systems"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
        >
          <ArrowLeft size={14} /> Retour au registre
        </Link>

        {/* Header Grid: Metadata left, circular gauge right */}
        <div className="bg-white p-6 rounded-card border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center flex-wrap gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{system.name}</h2>
                <RiskBadge level={system.riskLevel} />
                <StatusBadge status={system.status} />
              </div>
              <p className="text-xs text-slate-500 max-w-2xl font-medium leading-relaxed">
                {system.description}
              </p>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleLaunchAudit}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                <Play size={13} className="fill-white" /> Lancer un audit
              </button>
              <button
                onClick={handleGenerateDoc}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                <FileText size={13} /> Générer documentation
              </button>
              <button
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition-all"
              >
                <Edit2 size={13} /> Modifier
              </button>
            </div>
          </div>

          {/* Large Compliance Gauge */}
          <div className="shrink-0 self-center">
            <ComplianceGauge score={complianceScore} size={130} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-6">
        {[
          { id: "overview", label: "Vue d'ensemble", icon: Layers },
          { id: "docs", label: "Documentation", icon: FileText },
          { id: "alerts", label: "Monitoring", icon: Activity },
          { id: "history", label: "Historique audits", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "overview" | "docs" | "alerts" | "history")}
              className={`flex items-center gap-1.5 pb-3 text-xs font-bold transition-all relative ${
                activeTab === tab.id
                  ? "text-accent border-b-2 border-accent"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {/* 1. Vue d'ensemble */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Grid & Gaps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Grid d'infos */}
            <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-4">
                Fiche Technique
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Cas d&apos;usage</span>
                  <p className="text-xs font-bold text-slate-700">{system.useCase}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Département responsable</span>
                  <p className="text-xs font-bold text-slate-700">{system.ownerName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Modèle IA utilisé</span>
                  <p className="text-xs font-bold text-slate-700">{system.modelName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Modèle Provider</span>
                  <p className="text-xs font-bold text-slate-700">{system.modelProvider}</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Données traitées</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {system.dataTypes.map((type, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600 rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gaps de conformité */}
            <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-4">
                Gaps de conformité
              </h3>
              <div className="space-y-3">
                {gaps.map((gap) => (
                  <div
                    key={gap.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                            gap.priority === "CRITICAL"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : gap.priority === "HIGH"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {gap.priority}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800">{gap.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-normal">
                        <strong className="text-slate-600">Action requise :</strong> {gap.actionRequired}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Dernières alertes */}
          <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card space-y-4 h-fit">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
              Dernières alertes
            </h3>
            <div className="space-y-3">
              {recentAlerts.map((al) => (
                <div key={al.id} className="p-3 border border-slate-100 rounded-lg space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <SeverityBadge severity={al.severity} />
                    <span className="text-[10px] text-slate-400 font-medium">{al.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-800">{al.title}</h4>
                  <p className="text-slate-500 leading-normal font-medium">{al.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Documentation */}
      {activeTab === "docs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left panel: Generated doc list & dynamic loader */}
          <div className="lg:col-span-1 space-y-6 flex flex-col">
            <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Documents Générés
                  </h3>
                  <button
                    disabled={isGeneratingDoc}
                    onClick={handleGenerateDoc}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50"
                  >
                    {isGeneratingDoc ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Plus size={13} />
                    )}
                    Générer
                  </button>
                </div>

                {isGeneratingDoc ? (
                  <div className="p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3">
                    <Loader2 className="text-accent animate-spin" size={24} />
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-800">Génération par agent ComplianceOS</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase animate-pulse">
                        {docGenerationStep}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {generatedDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-slate-100 bg-slate-50/40 rounded-lg flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-800 leading-normal line-clamp-1">
                            {doc.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                            <span>{doc.version}</span>
                            <span>•</span>
                            <span>{doc.date}</span>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded border ${
                            doc.status === "VALIDATED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 font-semibold leading-relaxed">
                Les documents d&apos;audit générés sont basés sur le cahier des charges officiel exigé par l&apos;Article 11 du règlement européen sur l&apos;IA.
              </div>
            </div>
          </div>

          {/* Right panel: Live Preview of Art 11 Sections */}
          <div className="lg:col-span-2 bg-white p-5 rounded-card border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                  Preview Document Technique (Art. 11)
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">Affichage des 8 sections officielles</p>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase">Version {docVersion}</span>
            </div>

            {/* Accordions */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {art11Sections.map((sec) => (
                <div key={sec.id} className="border border-slate-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === sec.id ? null : sec.id)}
                    className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between text-left"
                  >
                    <span className="text-xs font-bold text-slate-800">{sec.title}</span>
                    {expandedSection === sec.id ? (
                      <ChevronUp size={14} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={14} className="text-slate-400" />
                    )}
                  </button>
                  {expandedSection === sec.id && (
                    <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed font-medium bg-white">
                      {sec.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Monitoring */}
      {activeTab === "alerts" && (
        <div className="space-y-6">
          {/* Drift Chart over 30 days */}
          <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-4">
              Mesure du Drift de données (30 Jours)
            </h3>
            <div className="h-[220px] w-full">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={driftChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: "bold" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: "bold" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                        fontSize: "11px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="drift"
                      stroke="#2E6BE6"
                      strokeWidth={3}
                      dot={{ r: 4, stroke: "#2E6BE6", strokeWidth: 2, fill: "#FFF" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  Chargement du graphique...
                </div>
              )}
            </div>
          </div>

          {/* Timeline of events */}
          <div className="bg-white p-5 rounded-card border border-slate-200 shadow-card">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 mb-4">
              Timeline des alertes & événements
            </h3>
            <div className="relative border-l border-slate-200 ml-3 pl-6 space-y-6">
              {recentAlerts.map((al, idx) => (
                <div key={idx} className="relative">
                  {/* Bullet */}
                  <span
                    className={`absolute -left-[30px] top-0.5 w-3.5 h-3.5 rounded-full border bg-white flex items-center justify-center ${
                      al.severity === "CRITICAL"
                        ? "border-red-500 text-red-500"
                        : al.severity === "WARNING"
                        ? "border-amber-500 text-amber-500"
                        : "border-blue-500 text-blue-500"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        al.severity === "CRITICAL"
                          ? "bg-red-500"
                          : al.severity === "WARNING"
                          ? "bg-amber-500"
                          : "bg-blue-500"
                      }`}
                    />
                  </span>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{al.date}</span>
                    <h4 className="text-xs font-bold text-slate-800 leading-normal">{al.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-normal">{al.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Historique audits */}
      {activeTab === "history" && (
        <div className="bg-white rounded-card border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                  <th className="px-5 py-3.5">Date de l&apos;audit</th>
                  <th className="px-5 py-3.5">Score obtenu</th>
                  <th className="px-5 py-3.5">Nb gaps identifiés</th>
                  <th className="px-5 py-3.5">Auditeur</th>
                  <th className="px-5 py-3.5 text-right">Rapport</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {audits.map((audit, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-800">{audit.date}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          audit.score >= 75
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : audit.score >= 50
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {audit.score}%
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-500">{audit.gapsCount} gaps</td>
                    <td className="px-5 py-4 font-semibold text-slate-500">{audit.auditor}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => alert("Téléchargement du rapport PDF démarré (Simulé)")}
                        className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover hover:underline"
                      >
                        <FileDown size={14} /> Télécharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Premium glassmorphic Edit Drawer / Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 shadow-raised overflow-hidden flex flex-col max-h-[90vh] animate-fade-in animate-scale-up">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center text-accent">
                  <Edit2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Modifier le système IA</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Mise à jour des métadonnées</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* System Name */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-extrabold">Nom du Système IA</label>
                <input 
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all"
                />
              </div>

              {/* System Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-extrabold">Description</label>
                <textarea 
                  rows={3}
                  required
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-3 py-2 text-xs font-medium text-slate-705 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Use Case */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold">Cas d&apos;usage</label>
                  <input 
                    type="text"
                    required
                    value={editForm.useCase}
                    onChange={(e) => setEditForm({ ...editForm, useCase: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all"
                  />
                </div>

                {/* Owner Name */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold">Responsable / Propriétaire</label>
                  <input 
                    type="text"
                    required
                    value={editForm.ownerName}
                    onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all"
                  />
                </div>

                {/* Model Name */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold">Modèle IA</label>
                  <input 
                    type="text"
                    required
                    value={editForm.modelName}
                    onChange={(e) => setEditForm({ ...editForm, modelName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all"
                  />
                </div>

                {/* Model Provider */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-extrabold">Fournisseur / Provider</label>
                  <input 
                    type="text"
                    required
                    value={editForm.modelProvider}
                    onChange={(e) => setEditForm({ ...editForm, modelProvider: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-accent focus:ring-1 focus:ring-accent rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Agent Audit Progress Overlay */}
      {isAuditing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-2xl border border-slate-200 shadow-raised flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-accent animate-spin" />
              <Activity size={24} className="text-accent animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">AI compliance audit</h3>
              <p className="text-xs font-bold text-slate-500 uppercase animate-pulse">{auditStep}</p>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
              L&apos;agent autonome analyse la conformité par rapport à l&apos;AI Act européen et calcule votre score final.
            </p>
          </div>
        </div>
      )}

      {/* Premium Toast Notification */}
      {showToast && showToast.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-white/95 backdrop-blur border border-slate-200/80 p-4 rounded-xl shadow-raised flex items-start gap-3 animate-fade-in animate-slide-up">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <ShieldCheck size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 leading-none">{showToast.title}</h4>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{showToast.message}</p>
          </div>
          <button 
            onClick={() => setShowToast(null)}
            className="text-slate-400 hover:text-slate-600 shrink-0 self-start ml-2"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
