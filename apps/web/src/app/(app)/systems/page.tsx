"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, ChevronDown, X, Loader2, MoreVertical, Eye, AlertTriangle } from "lucide-react";
import { demoSystems, AISystem } from "@/lib/demo-data";
import { RiskBadge } from "@/components/badges/RiskBadge";
import { StatusBadge } from "@/components/badges/StatusBadge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SystemsRegistryPage() {
  const router = useRouter();
  const [systems, setSystems] = useState<AISystem[]>(demoSystems);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [period, setPeriod] = useState("3-months");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    riskLevel: "HIGH" as 'HIGH' | 'LIMITED' | 'MINIMAL',
    useCase: "",
    dataTypes: [] as string[],
    modelName: "",
    ownerName: "", // responsible department
  });

  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const supabase = createClient();

  // Dynamic Supabase data fetching
  useEffect(() => {
    async function loadSystems() {
      const isRealSupabase = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url";

      if (!isRealSupabase) {
        console.log("ComplianceOS running in offline Demo Mode: Loading mock systems.");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("systems")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Failed to load systems from Supabase. Falling back to mock:", error.message);
          return;
        }

        if (data && data.length > 0) {
          const mapped: AISystem[] = (data as {
            id: string;
            name: string;
            description?: string;
            risk_level: string;
            use_case?: string;
            data_types?: string[];
            model_name?: string;
            status: string;
            compliance_score?: number;
            owner_name?: string;
            created_at: string;
          }[]).map((d) => ({
            id: d.id,
            name: d.name,
            description: d.description || "",
            riskLevel: d.risk_level as 'HIGH' | 'LIMITED' | 'MINIMAL',
            useCase: d.use_case || "",
            dataTypes: d.data_types || [],
            modelProvider: "Interne",
            modelName: d.model_name || "Custom Model v1",
            status: d.status as 'COMPLIANT' | 'IN_PROGRESS' | 'NON_COMPLIANT',
            complianceScore: d.compliance_score || 0,
            ownerName: d.owner_name || "Département Général",
            createdAt: d.created_at,
            updatedAt: d.created_at,
          }));
          setSystems(mapped);
        } else {
          // If the real database is empty, seed it with demo systems so the user doesn't get a blank screen!
          console.log("Supabase database systems table is empty. Ready for new inputs.");
          setSystems([]);
        }
      } catch (err) {
        console.error("Systems database fetch failed:", err);
      }
    }

    loadSystems();
  }, [supabase]);

  // Available data types checkboxes
  const availableDataTypes = [
    "Données personnelles",
    "Données de santé",
    "Données financières",
    "Données RH",
    "Autres",
  ];

  // Handle filter buttons
  const filters = [
    { id: "ALL", label: "Tous" },
    { id: "HIGH", label: "HIGH" },
    { id: "LIMITED", label: "LIMITED" },
    { id: "MINIMAL", label: "MINIMAL" },
    { id: "COMPLIANT", label: "COMPLIANT" },
    { id: "IN_PROGRESS", label: "IN_PROGRESS" },
    { id: "NON_COMPLIANT", label: "NON_COMPLIANT" },
  ];

  // Filtering logic
  const filteredSystems = systems.filter((sys) => {
    // Search filter
    const matchesSearch = sys.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sys.useCase.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Filter pill logic
    if (activeFilter === "ALL") return true;
    if (["HIGH", "LIMITED", "MINIMAL"].includes(activeFilter)) {
      return sys.riskLevel === activeFilter;
    }
    if (["COMPLIANT", "IN_PROGRESS", "NON_COMPLIANT"].includes(activeFilter)) {
      return sys.status === activeFilter;
    }
    return true;
  });

  const handleDataTypeChange = (type: string) => {
    setFormData(prev => {
      const dataTypes = prev.dataTypes.includes(type)
        ? prev.dataTypes.filter(t => t !== type)
        : [...prev.dataTypes, type];
      return { ...prev, dataTypes };
    });
  };

  const handleAddSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.useCase) return;

    setIsSubmitting(true);
    
    // Simulate AI audit agent working through stages
    setSubmitStep("Analyse du système...");
    setTimeout(() => {
      setSubmitStep("Qualification du niveau de risque...");
      setTimeout(() => {
        setSubmitStep("Génération des sections de conformité...");
        setTimeout(async () => {
          const isRealSupabase = 
            process.env.NEXT_PUBLIC_SUPABASE_URL && 
            process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url";

          let newSystem: AISystem | null = null;

          if (isRealSupabase) {
            try {
              // 1. Get current logged in user details
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                // 2. Fetch profile organization id
                const { data: profile, error: profileErr } = await supabase
                  .from("profiles")
                  .select("organization_id")
                  .eq("id", user.id)
                  .single();

                if (profile && profile.organization_id) {
                  // 3. Insert real record into PostgreSQL
                  const randomScore = Math.floor(Math.random() * 40) + 30;
                  const { data: insertedRecord, error: insertErr } = await supabase
                    .from("systems")
                    .insert({
                      organization_id: profile.organization_id,
                      name: formData.name,
                      description: formData.description,
                      risk_level: formData.riskLevel,
                      compliance_score: randomScore,
                      status: "IN_PROGRESS",
                      use_case: formData.useCase,
                      data_types: formData.dataTypes,
                      model_name: formData.modelName || "Custom Model v1",
                      owner_name: formData.ownerName || "Département Général",
                    })
                    .select()
                    .single();

                  if (insertErr) {
                    console.error("Failed to insert system to Supabase database:", insertErr.message);
                  } else if (insertedRecord) {
                    newSystem = {
                      id: insertedRecord.id,
                      name: insertedRecord.name,
                      description: insertedRecord.description || "",
                      riskLevel: insertedRecord.risk_level as 'HIGH' | 'LIMITED' | 'MINIMAL',
                      useCase: insertedRecord.use_case || "",
                      dataTypes: insertedRecord.data_types || [],
                      modelProvider: "Interne",
                      modelName: insertedRecord.model_name || "Custom Model v1",
                      status: insertedRecord.status as 'COMPLIANT' | 'IN_PROGRESS' | 'NON_COMPLIANT',
                      complianceScore: insertedRecord.compliance_score || 0,
                      ownerName: insertedRecord.owner_name || "Département Général",
                      createdAt: insertedRecord.created_at,
                      updatedAt: insertedRecord.created_at,
                    };
                    setSystems(prev => [newSystem as AISystem, ...prev]);
                  }
                } else if (profileErr) {
                  console.error("Failed to retrieve user profile organization:", profileErr.message);
                }
              }
            } catch (dbErr) {
              console.error("Exception during database system creation:", dbErr);
            }
          }

          // Fallback if not configured or if database creation failed
          if (!newSystem) {
            newSystem = {
              id: formData.name.toLowerCase().replace(/\s+/g, "-"),
              name: formData.name,
              description: formData.description,
              riskLevel: formData.riskLevel,
              useCase: formData.useCase,
              dataTypes: formData.dataTypes,
              modelProvider: "Interne",
              modelName: formData.modelName || "Custom Model v1",
              status: "IN_PROGRESS",
              complianceScore: Math.floor(Math.random() * 40) + 30,
              ownerName: formData.ownerName || "Département Général",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            setSystems(prev => [newSystem as AISystem, ...prev]);
          }

          setIsSubmitting(false);
          setIsModalOpen(false);
          // Reset form
          setFormData({
            name: "",
            description: "",
            riskLevel: "HIGH",
            useCase: "",
            dataTypes: [],
            modelName: "",
            ownerName: "",
          });
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Registre des Systèmes IA</h2>
          <p className="text-xs text-slate-500 mt-1">
            Cartographie des algorithmes déclarés et qualification de risque selon l&apos;AI Act
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-md shadow-accent/15 transition-all"
        >
          <Plus size={14} /> Déclarer un système
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-card">
        {/* Left: Pill Filters & Search */}
        <div className="flex flex-col xl:flex-row gap-3 flex-1">
          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Rechercher par nom ou cas d'usage..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/15 placeholder:text-slate-400 text-slate-800 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === f.id
                    ? "bg-accent text-white shadow-sm"
                    : "bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Period Dropdown */}
        <div className="relative self-start md:self-auto shrink-0">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/15 cursor-pointer"
          >
            <option value="1-month">Ce mois</option>
            <option value="3-months">3 mois</option>
            <option value="6-months">6 mois</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Systems Table */}
      <div className="bg-white rounded-card border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                <th className="px-5 py-4">Système IA</th>
                <th className="px-5 py-4">Niveau de risque</th>
                <th className="px-5 py-4">Score conformité</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4">Dernier audit</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSystems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-slate-400 font-medium">
                    Aucun système trouvé dans cette configuration.
                  </td>
                </tr>
              ) : (
                filteredSystems.map((sys) => (
                  <tr
                    key={sys.id}
                    onClick={() => router.push(`/systems/${sys.id}`)}
                    className="hover:bg-slate-50/30 transition-all duration-150 cursor-pointer group"
                  >
                    {/* Nom & Description */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-accent transition-colors">
                          {sys.name}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1 line-clamp-1 max-w-[320px] font-medium">
                          {sys.description}
                        </span>
                      </div>
                    </td>

                    {/* Niveau de risque */}
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <RiskBadge level={sys.riskLevel} />
                    </td>

                    {/* Score conformité progress bar */}
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 max-w-[140px]">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              sys.complianceScore < 50
                                ? "bg-red-500"
                                : sys.complianceScore <= 75
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${sys.complianceScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700 w-8 text-right">
                          {sys.complianceScore}%
                        </span>
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={sys.status} />
                    </td>

                    {/* Dernier audit */}
                    <td className="px-5 py-4 text-xs font-semibold text-slate-500">
                      {new Date(sys.updatedAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions dropdown */}
                    <td className="px-5 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/systems/${sys.id}`}
                          className="px-2.5 py-1 text-xs font-bold text-accent hover:text-accent-hover hover:bg-blue-50 rounded transition-colors"
                        >
                          Détails
                        </Link>
                        <button
                          onClick={() => setRowMenuOpen(rowMenuOpen === sys.id ? null : sys.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>

                      {/* Dropdown popup */}
                      {rowMenuOpen === sys.id && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setRowMenuOpen(null)} />
                          <div className="absolute right-5 mt-1 w-40 bg-white rounded-lg shadow-raised border border-slate-200 py-1 z-40 text-left">
                            <Link
                              href={`/systems/${sys.id}`}
                              className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors"
                            >
                              <Eye size={13} /> Voir la fiche
                            </Link>
                            <button
                              onClick={() => {
                                alert(`Audit lancé pour ${sys.name}`);
                                setRowMenuOpen(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors"
                            >
                              <AlertTriangle size={13} /> Lancer un audit
                            </button>
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
      </div>

      {/* Modal Declarer un systeme */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-accent">
                  <Plus size={16} className="stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Déclarer un système IA
                </h3>
              </div>
              <button
                disabled={isSubmitting}
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            {isSubmitting ? (
              <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-4">
                <Loader2 size={36} className="text-accent animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Agent d&apos;Audit ComplianceOS</p>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider animate-pulse">
                    {submitStep}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddSystem} className="flex-1 overflow-y-auto p-6 space-y-4">
                {/* Nom du systeme */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Nom du système *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex. Scoring Crédit Automatisé"
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-accent/15 focus:outline-none placeholder:text-slate-400 text-slate-800"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Description générale</label>
                  <textarea
                    rows={2}
                    placeholder="Décrivez brièvement les fonctionnalités et l'algorithme..."
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-accent/15 focus:outline-none placeholder:text-slate-400 text-slate-800"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Grid for Risk & Model */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Niveau de risque */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Niveau de risque réglementaire</label>
                    <select
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:ring-2 focus:ring-accent/15 focus:outline-none cursor-pointer"
                      value={formData.riskLevel}
                      onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as 'HIGH' | 'LIMITED' | 'MINIMAL' })}
                    >
                      <option value="HIGH">HIGH (Haut Risque)</option>
                      <option value="LIMITED">LIMITED (Risque Limité)</option>
                      <option value="MINIMAL">MINIMAL (Risque Minimal)</option>
                    </select>
                  </div>

                  {/* Modèle IA */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-700">Modèle IA & Version</label>
                    <input
                      type="text"
                      placeholder="Ex. XGBoost Classifier v4.2"
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-accent/15 focus:outline-none placeholder:text-slate-400 text-slate-800"
                      value={formData.modelName}
                      onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Cas d'usage */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Cas d&apos;usage du système *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex. Tri automatique de candidatures"
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-accent/15 focus:outline-none placeholder:text-slate-400 text-slate-800"
                    value={formData.useCase}
                    onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  />
                </div>

                {/* Département responsable */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Département ou Direction Responsable</label>
                  <input
                    type="text"
                    placeholder="Ex. Direction des Risques, Ressources Humaines"
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-accent/15 focus:outline-none placeholder:text-slate-400 text-slate-800"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  />
                </div>

                {/* Checkboxes: Types de données traitées */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700">Types de données traitées</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                    {availableDataTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 text-accent border-slate-300 rounded focus:ring-accent/20 cursor-pointer"
                          checked={formData.dataTypes.includes(type)}
                          onChange={() => handleDataTypeChange(type)}
                        />
                        <span className="text-xs font-medium text-slate-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-bold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-md shadow-accent/15 transition-all"
                  >
                    Déclarer le système
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
