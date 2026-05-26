"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Save,
  Download,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  MessageSquare,
  User,
  Send,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Play,
  Check,
  ShieldCheck,
  Eye,
  FileText,
  X,
  AlertCircle,
  Database
} from "lucide-react";
import { LegalDisclaimer } from "@/components/domain/LegalDisclaimer";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Section {
  id: number;
  title: string;
  content: string;
  pageNumber: number;
}

interface Gap {
  id: string;
  sectionId: number;
  sectionTitle: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  title: string;
  description: string;
  assignedTo?: string;
  status: "OPEN" | "ASSIGNED" | "RESOLVED";
}

interface Comment {
  id: string;
  author: string;
  role: string;
  avatarColor: string;
  sectionTitle: string;
  text: string;
  timestamp: string;
  task?: {
    assignedTo: string;
    description: string;
    completed: boolean;
  };
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  useEffect(() => {
    console.log("Chargement du document :", params.id);
  }, [params.id]);

  // Static state definition
  const initialSections: Section[] = [
    { id: 1, title: "1. Description générale", content: "Le système TalentScreen AI est un modèle prédictif développé par Skylab Digital. Il a pour but d'analyser, de classer et de présélectionner les candidatures reçues pour les postes techniques de haut niveau. Il traite les curriculum vitæ, les lettres de motivation et les profils publics afin de produire un score d'adéquation candidat de 0 à 100. Les conditions opérationnelles requièrent un filtrage préalable des données nominatives pour assurer le respect du RGPD, bien que le traitement principal repose sur l'analyse sémantique des compétences.", pageNumber: 1 },
    { id: 2, title: "2. Architecture algorithmique", content: "Le modèle s'appuie sur une architecture hybride combinant un modèle de traitement du langage naturel (NLP) basé sur un transformeur pré-entraîné (fine-tuned BERT) et un classifieur de type Gradient Boosting (XGBoost) pour l'agrégation finale des scores. Les hyperparamètres critiques incluent un learning rate de 0.03, une profondeur maximale d'arbre de 6 pour XGBoost et une pénalité L2 régularisée pour éviter le surapprentissage sur les profils d'ingénieurs seniors.", pageNumber: 2 },
    { id: 3, title: "3. Données d'entraînement", content: "Les jeux de données d'entraînement comprennent 45 000 profils anonymisés collectés de 2021 à 2025. La répartition des données montre un déséquilibre sectoriel avec 78% de profils masculins et une forte surreprésentation des candidats issus de métropoles européennes. Les méthodes d'acquisition reposent sur le scraping autorisé et des partenariats universitaires. Le nettoyage exclut les informations d'âge et de genre, mais aucune méthode de suréchantillonnage n'a encore été menée pour équilibrer la distribution.", pageNumber: 3 },
    { id: 4, title: "4. Métriques de performance", content: "Le modèle affiche une précision globale (Accuracy) de 87.4% sur le jeu de test. L'aire sous la courbe ROC (AUC) est de 0.91, et le score F1-moyen s'élève à 0.86. Toutefois, lors des tests de robustesse segmentés par groupes démographiques (âge, origine géographique présumée), des variations significatives de taux d'erreur ont été relevées, allant jusqu'à +12% de faux négatifs sur les profils juniors ou issus de zones rurales.", pageNumber: 4 },
    { id: 5, title: "5. Analyse des biais", content: "L'analyse statistique révèle un biais systématique favorisant les profils contenant des mots-clés typiquement masculins ou associés à de grandes écoles d'ingénieurs parisiennes. La mitigation de ce biais de représentativité est en cours de modélisation. Un rééquilibrage par perte pondérée (Adversarial Debiasing) est envisagé pour pénaliser les dépendances injustes entre les attributs protégés et le score final.", pageNumber: 5 },
    { id: 6, title: "6. Robustesse & Cybersécurité", content: "Le système dispose d'une protection de base contre les injections de mots-clés cachés dans les fichiers PDF (CV gonflés artificiellement). Les tests d'attaque par perturbation sémantique mineure montrent une sensibilité modérée, modifiant le score final de +/- 4 points pour des modifications mineures. Un pipeline de surveillance de la dérive de concept (Concept Drift) analyse quotidiennement la distribution des scores.", pageNumber: 6 },
    { id: 7, title: "7. Transparence & Supervision", content: "Chaque score est accompagné d'un rapport d'explicabilité basé sur les valeurs SHAP (Shapley Additive exPlanations) décrivant les 5 critères ayant le plus influencé la décision. La supervision humaine est assurée par un double contrôle des recruteurs de niveau 2. En cas de désaccord de plus de 20 points entre le recruteur et la prédiction, le cas d'usage est journalisé pour réévaluation.", pageNumber: 7 },
    { id: 8, title: "8. Plan de remédiation", content: "En cas d'anomalie critique ou de détection d'une dérive de biais discriminatoire supérieure à 15%, le système peut être débrayé instantanément via un commutateur d'urgence (kill switch) dans la console d'administration. Le processus de retour arrière (rollback) vers une version antérieure saine prend moins de 5 minutes. Une notification automatique est envoyée au DPO de l'organisation dans la minute.", pageNumber: 8 }
  ];

  const initialGaps: Gap[] = [
    {
      id: "gap-1",
      sectionId: 3,
      sectionTitle: "3. Données d'entraînement",
      severity: "CRITICAL",
      title: "Biais de représentativité critique",
      description: "Le jeu de données contient 78% de profils masculins. Aucun protocole de suréchantillonnage ou de pondération corrective n'a été spécifié pour équilibrer la distribution.",
      status: "OPEN"
    },
    {
      id: "gap-2",
      sectionId: 5,
      sectionTitle: "5. Analyse des biais",
      severity: "HIGH",
      title: "Absence de protocole de mitigation",
      description: "La méthode d'Adversarial Debiasing est simplement 'envisagée'. L'AI Act exige des mécanismes actifs et validés de détection et de correction des biais discriminatoires.",
      status: "OPEN"
    },
    {
      id: "gap-3",
      sectionId: 4,
      sectionTitle: "4. Métriques de performance",
      severity: "MEDIUM",
      title: "Taux d'erreur disproportionné (Juniors)",
      description: "Le taux de faux négatifs augmente de +12% sur les profils juniors. Un seuil d'alerte ou un filtre spécifique doit être mis en place pour éviter la discrimination indirecte.",
      status: "OPEN"
    }
  ];

  const initialComments: Comment[] = [
    {
      id: "c-1",
      author: "Jean-Marc L.",
      role: "DPO & Legal Lead",
      avatarColor: "bg-indigo-500",
      sectionTitle: "3. Données d'entraînement",
      text: "La section 3 doit impérativement détailler la provenance des 45 000 profils pour prouver le consentement RGPD. C'est notre plus grand risque d'audit.",
      timestamp: "Il y a 2 heures",
      task: {
        assignedTo: "Sarah K. (Lead ML)",
        description: "Préciser la source légale des jeux de données d'entraînement",
        completed: false
      }
    },
    {
      id: "c-2",
      author: "Sarah K.",
      role: "Lead Machine Learning",
      avatarColor: "bg-emerald-500",
      sectionTitle: "2. Architecture algorithmique",
      text: "J'ai mis à jour les hyperparamètres clés de XGBoost. Le modèle de production actuel correspond exactement à cette version.",
      timestamp: "Hier, 17:45",
      task: {
        assignedTo: "Jean-Marc L. (DPO)",
        description: "Valider l'adéquation réglementaire de la version v1.3",
        completed: true
      }
    }
  ];

  // Document state
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [activeSectionId, setActiveSectionId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(100);

  // AI Agent Audit state
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [auditCompleted, setAuditCompleted] = useState(false);
  const [gaps, setGaps] = useState<Gap[]>(initialGaps);

  // Collaborative Comments state
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [commentSection, setCommentSection] = useState("1. Description générale");
  const [assignee, setAssignee] = useState("");
  const [taskText, setTaskText] = useState("");

  // Tab State (Right Panel)
  const [activeRightTab, setActiveRightTab] = useState<"audit" | "comments" | "edit">("audit");

  // Save/Download simulation state
  const [saving, setSaving] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showRlsAlert, setShowRlsAlert] = useState(false);

  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Get active section content
  const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];

  // Effect to scroll preview to top when active section changes
  useEffect(() => {
    if (pdfContainerRef.current) {
      pdfContainerRef.current.scrollTop = 0;
    }
  }, [activeSectionId]);

  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 3500);
  };

  const isValidUuid = (val: string): boolean => {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(val);
  };

  useEffect(() => {
    async function loadDocument() {
      try {
        const localDraft = localStorage.getItem(`doc-draft-${params.id}`);
        if (localDraft) {
          const parsed = JSON.parse(localDraft);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSections(parsed);
            triggerToast("Version locale (brouillon sauvegardé) chargée !");
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load local draft:", e);
      }

      const isRealSupabase = 
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url";

      if (!isRealSupabase || !isValidUuid(params.id)) {
        console.log("ComplianceOS running in offline Demo Mode or Mock Identifier detected: Loading mock document sections.");
        return;
      }

      try {
        // Try fetching by primary key document ID first
        const { data: firstDoc, error: firstErr } = await supabase
          .from("documents")
          .select("*")
          .eq("id", params.id)
          .maybeSingle();

        let doc: unknown = firstDoc;

        // If not found by primary key, try fetching by system_id
        if (!doc || firstErr) {
          const { data: altDoc, error: altError } = await supabase
            .from("documents")
            .select("*")
            .eq("system_id", params.id)
            .maybeSingle();
          if (altDoc && !altError) {
            doc = altDoc;
          }
        }

        if (doc && (doc as { sections: unknown }).sections) {
          // Verify sections schema. It should map to Section[]
          const loadedSections = (doc as {
            sections: {
              id: number;
              title: string;
              content: string;
              pageNumber: number;
            }[];
          }).sections;
          if (Array.isArray(loadedSections) && loadedSections.length > 0) {
            setSections(loadedSections);
            triggerToast(`Version ${(doc as { version: string }).version} synchronisée en temps réel avec PostgreSQL !`);
          }
        }
      } catch (err) {
        console.error("Failed to fetch document from database:", err);
      }
    }
    loadDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Handle live edit sync
  const handleContentChange = (val: string) => {
    setSections(prev =>
      prev.map(sec => (sec.id === activeSectionId ? { ...sec, content: val } : sec))
    );
  };

  // Run AI Agent Audit Simulator
  const runAIAudit = () => {
    setAuditRunning(true);
    setAuditProgress(0);
    setAuditCompleted(false);
    setAuditLogs([]);

    const steps = [
      { progress: 15, log: "🔍 Analyse de la structure générale de l'Article 11... Détecté 8/8 chapitres requis." },
      { progress: 35, log: "🧠 Scan sémantique de la section 3 (Données) : Alerte de déséquilibre détectée (78% Masculin / 22% Féminin)." },
      { progress: 55, log: "⚖️ Vérification de la section 5 (Biais) : Non-conformité détectée (absence de correctif actif de mitigation)." },
      { progress: 75, log: "🛡️ Analyse de la robustesse cybersécurité (section 6) : Validée pour le filtrage d'injection de mots-clés." },
      { progress: 90, log: "📈 Examen des métriques (section 4) : Écart de précision significatif (+12% de faux négatifs sur profils Juniors)." },
      { progress: 100, log: "✅ Audit complété. 3 écarts de conformité relevés." }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAuditProgress(step.progress);
        setAuditLogs(prev => [...prev, step.log]);
        if (step.progress === 100) {
          setAuditRunning(false);
          setAuditCompleted(true);
          triggerToast("Analyse par agent IA terminée avec succès !");
        }
      }, (idx + 1) * 800);
    });
  };

  // Assign task from AI Audit
  const handleAssignGap = (gap: Gap, person: string) => {
    // Set gap to assigned
    setGaps(prev =>
      prev.map(g => (g.id === gap.id ? { ...g, status: "ASSIGNED", assignedTo: person } : g))
    );

    // Create a new collaborative comment with task
    const newComment: Comment = {
      id: `c-generated-${Date.now()}`,
      author: "AI Compliance Agent",
      role: "System Auditor",
      avatarColor: "bg-blue-600",
      sectionTitle: gap.sectionTitle,
      text: `⚠️ **Écart détecté et assigné** : ${gap.title}. \n${gap.description}`,
      timestamp: "À l'instant",
      task: {
        assignedTo: person,
        description: `Résoudre : ${gap.title} (Section ${gap.sectionId})`,
        completed: false
      }
    };

    setComments(prev => [newComment, ...prev]);
    triggerToast(`Tâche assignée à ${person} !`);
  };

  // Post a new collaborative comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `c-user-${Date.now()}`,
      author: "Dorian G. (Vous)",
      role: "Compliance Officer",
      avatarColor: "bg-slate-900",
      sectionTitle: commentSection,
      text: commentText,
      timestamp: "À l'instant",
      task: assignee
        ? {
            assignedTo: assignee,
            description: taskText || `Revoir la section : ${commentSection}`,
            completed: false
          }
        : undefined
    };

    setComments(prev => [newComment, ...prev]);
    setCommentText("");
    setAssignee("");
    setTaskText("");
    triggerToast("Commentaire publié avec succès !");
  };

  // Toggle task status
  const toggleTaskCompletion = (commentId: string) => {
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId && c.task) {
          const nextCompleted = !c.task.completed;
          
          // If task completed, also resolve matching gap if any
          if (nextCompleted) {
            setGaps(gapsPrev =>
              gapsPrev.map(g =>
                g.sectionTitle === c.sectionTitle ? { ...g, status: "RESOLVED" } : g
              )
            );
          } else {
            setGaps(gapsPrev =>
              gapsPrev.map(g =>
                g.sectionTitle === c.sectionTitle ? { ...g, status: "OPEN" } : g
              )
            );
          }

          return {
            ...c,
            task: { ...c.task, completed: nextCompleted }
          };
        }
        return c;
      })
    );
    triggerToast("Statut de la tâche mis à jour !");
  };

  // Save draft document
  const handleSave = async () => {
    setSaving(true);

    const isRealSupabase = 
      process.env.NEXT_PUBLIC_SUPABASE_URL && 
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "your-supabase-project-url";

    const isUuid = isValidUuid(params.id);

    if (isRealSupabase && isUuid) {
      try {
        // Try updating by primary key ID first
        const { error } = await supabase
          .from("documents")
          .update({
            sections: sections,
            updated_at: new Date().toISOString()
          })
          .eq("id", params.id);

        if (error) {
          // If primary key fails, try system_id
          const { error: altError } = await supabase
            .from("documents")
            .update({
              sections: sections,
              updated_at: new Date().toISOString()
            })
            .eq("system_id", params.id);

          if (altError) {
            console.error("Failed to persist document to database:", altError.message);
            
            // Backup to localStorage so they never lose data!
            try {
              localStorage.setItem(`doc-draft-${params.id}`, JSON.stringify(sections));
            } catch (err) {
              console.error("Failed to save to localStorage:", err);
            }

            if (altError.message?.toLowerCase().includes("recursion") || altError.message?.toLowerCase().includes("policy")) {
              setShowRlsAlert(true);
              triggerToast("Brouillon sauvegardé localement ! (Erreur RLS récurrente)");
            } else {
              triggerToast("Sauvegarde locale effectuée (Erreur base de données).");
            }
          } else {
            // Clean local backup on successful server sync!
            try {
              localStorage.removeItem(`doc-draft-${params.id}`);
            } catch {}
            triggerToast("Modifications sauvegardées avec succès dans PostgreSQL !");
          }
        } else {
          // Clean local backup on successful server sync!
          try {
            localStorage.removeItem(`doc-draft-${params.id}`);
          } catch {}
          triggerToast("Modifications sauvegardées avec succès dans PostgreSQL !");
        }
      } catch (dbErr) {
        console.error("Exception while persisting document changes:", dbErr);
        
        // Backup to localStorage
        try {
          localStorage.setItem(`doc-draft-${params.id}`, JSON.stringify(sections));
          triggerToast("Brouillon enregistré localement !");
        } catch {
          triggerToast("Erreur lors de la sauvegarde.");
        }
      } finally {
        setSaving(false);
      }
    } else {
      // Local fallback simulation (for offline mode or mock string identifiers)
      setTimeout(() => {
        setSaving(false);
        try {
          localStorage.setItem(`doc-draft-${params.id}`, JSON.stringify(sections));
        } catch {}
        triggerToast("Modifications enregistrées localement (Brouillon démo) !");
      }, 1200);
    }
  };

  // Download raw document text simulation
  const handleDownload = () => {
    // Generate text content of the whole document
    const textContent = sections
      .map(sec => `=== ${sec.title} (Page ${sec.pageNumber}) ===\n\n${sec.content}\n`)
      .join("\n\n");

    const element = document.createElement("a");
    const file = new Blob([textContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `complianceos_talent_screen_art11_v1.3.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("Fichier exporté avec succès sur le disque !");
  };

  // Live text highlight logic for PDF Preview search
  const renderHighlightedContent = (text: string) => {
    if (!searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 text-slate-900 rounded px-0.5 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-110px)] max-h-[1200px]">
      {/* Dynamic Toast Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 bg-slate-950 text-white rounded-xl border border-slate-800 shadow-2xl text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col gap-2 shrink-0">
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors w-fit group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Retour aux documents
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Technical Documentation — TalentScreen AI
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-md">
                DRAFT - v1.3
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Spécification des exigences et fiches d&apos;obligations réglementaires face à l&apos;AI Act Art. 11
            </p>
          </div>
          <div className="flex items-center gap-2 self-start">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <Download size={14} />
              Exporter (.txt)
            </button>
          </div>
        </div>
      </div>

      {/* Split-Screen Interactive Container */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* LEFT COLUMN: Premium PDF / A4 Viewer */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl flex flex-col min-h-0 overflow-hidden shadow-2xl relative">
          
          {/* Viewer Controller Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-900 shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-950 px-2.5 py-1 border border-slate-800 rounded">
                <Eye size={12} className="text-accent" /> PREVIEW PDF
              </span>
              <div className="h-4 w-px bg-slate-800" />
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom(z => Math.max(50, z - 10))}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800/60 transition-colors"
                  title="Zoom arrière"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="text-[10px] font-bold text-slate-300 w-10 text-center select-none">
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom(z => Math.min(150, z + 10))}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800/60 transition-colors"
                  title="Zoom avant"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  onClick={() => setZoom(100)}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800/60 transition-colors"
                  title="Réinitialiser"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Document search input */}
            <div className="relative max-w-[160px] md:max-w-[200px]">
              <span className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-slate-500">
                <Search size={12} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher dans le PDF..."
                className="w-full pl-8 pr-2.5 py-1 bg-slate-950/80 border border-slate-800 focus:border-slate-700 rounded-md text-[11px] font-medium text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* PDF Workstation Canvas */}
          <div
            ref={pdfContainerRef}
            className="flex-1 p-6 md:p-10 overflow-y-auto bg-slate-900/50 flex justify-center items-start scrollbar-thin"
          >
            {/* Elegant A4 Simulated Sheet */}
            <div
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
              className="bg-white shadow-2xl border border-slate-200 rounded p-12 w-full max-w-[700px] min-h-[850px] relative transition-transform duration-100 ease-out select-text flex flex-col justify-between"
            >
              {/* Paper Watermark (Subtle background) */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03]">
                <div className="text-[72px] font-black text-slate-900 rotate-[35deg] tracking-widest uppercase">
                  EU AI ACT COMPLIANT
                </div>
              </div>

              {/* Document Paper Header */}
              <div className="border-b border-slate-200 pb-5 mb-8 flex justify-between items-start text-slate-400 select-none shrink-0">
                <div className="flex flex-col">
                  <span className="text-[9px] font-extrabold text-slate-900 tracking-widest uppercase">
                    COMPLIANCE-OS PLATFORM
                  </span>
                  <span className="text-[8px] font-medium mt-0.5 text-slate-400">
                    Art. 11 Annex IV Technical File
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-extrabold text-red-500 tracking-widest bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    RESTRICTED / DPO ONLY
                  </span>
                </div>
              </div>

              {/* Main Document Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                  <FileText size={12} className="text-slate-400" />
                  CHAPITRE RÉGLEMENTAIRE {activeSection.id} / 8
                </div>

                <h3 className="text-xl font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
                  {activeSection.title}
                </h3>

                {/* Sub-Header details to look extremely official */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200/60 p-3.5 rounded-lg text-[10px] font-medium text-slate-500">
                  <div>
                    <span className="font-bold text-slate-700 block uppercase tracking-wider text-[8px] mb-0.5">
                      Statut d&apos;implémentation
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Rédaction en cours (v1.3)</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700 block uppercase tracking-wider text-[8px] mb-0.5">
                      Dernier audit technique
                    </span>
                    <span>Aujourd&apos;hui, 14:10 par Agent IA</span>
                  </div>
                </div>

                {/* Actual draft content inside PDF preview */}
                <div className="text-slate-700 text-xs leading-relaxed font-normal whitespace-pre-wrap pt-4">
                  {renderHighlightedContent(activeSection.content)}
                </div>

                {/* Simulated remaining text placeholders for PDF style */}
                <div className="pt-8 border-t border-slate-100/80 space-y-2.5 opacity-30 select-none">
                  <div className="h-3.5 bg-slate-200 rounded w-full" />
                  <div className="h-3.5 bg-slate-200 rounded w-11/12" />
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                </div>
              </div>

              {/* Document Paper Footer */}
              <div className="border-t border-slate-200 pt-5 mt-10 flex justify-between items-center text-slate-400 select-none text-[9px] font-semibold tracking-wider uppercase shrink-0">
                <span>TALENTSCREEN AI - COMPLIANCE REPORT</span>
                <span className="text-slate-500 font-bold bg-slate-50 px-2 py-0.5 border border-slate-200 rounded">
                  PAGE {activeSection.pageNumber} SUR 8
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: State-of-the-Art Management Hub */}
        <div className="bg-white border border-slate-200 rounded-2xl flex flex-col min-h-0 shadow-card">
          
          {/* Hub Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-1.5 shrink-0">
            <button
              onClick={() => setActiveRightTab("audit")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeRightTab === "audit"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <Sparkles size={14} className={activeRightTab === "audit" ? "text-accent" : "text-slate-400"} />
              Analyse IA & Écarts
            </button>
            <button
              onClick={() => setActiveRightTab("comments")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeRightTab === "comments"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <MessageSquare size={14} className={activeRightTab === "comments" ? "text-accent" : "text-slate-400"} />
              Discussions & Tâches
              {comments.filter(c => c.task && !c.task.completed).length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
            <button
              onClick={() => setActiveRightTab("edit")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeRightTab === "edit"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <FileText size={14} className={activeRightTab === "edit" ? "text-accent" : "text-slate-400"} />
              Éditeur en Direct
            </button>
          </div>

          {/* Scrollable Tab Panel Content */}
          <div className="flex-1 overflow-y-auto p-5 min-h-0">

            {/* TAB 1: AI Compliance Audit */}
            {activeRightTab === "audit" && (
              <div className="space-y-5">
                {/* AI Agent Console Block */}
                <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 text-white space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-accent animate-pulse" />
                      <span className="text-xs font-extrabold tracking-wider uppercase">
                        AI ACT AUDIT AGENT
                      </span>
                    </div>
                    {!auditRunning && !auditCompleted && (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        PRÊT À L&apos;ANALYSE
                      </span>
                    )}
                    {auditRunning && (
                      <span className="text-[9px] font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded animate-pulse">
                        ANALYSE EN COURS
                      </span>
                    )}
                    {auditCompleted && (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded">
                        AUDIT TERMINÉ
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-normal">
                    Notre agent IA va analyser en profondeur chacun des 8 chapitres rédigés pour détecter les failles juridiques et de conformité face aux exigences strictes de l&apos;AI Act européen.
                  </p>

                  {/* Launch button */}
                  {!auditRunning && (
                    <button
                      onClick={runAIAudit}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md active:scale-[0.98]"
                    >
                      <Play size={12} className="fill-white" />
                      {auditCompleted ? "Re-lancer l'audit de conformité" : "Lancer l'audit de conformité"}
                    </button>
                  )}

                  {/* Running state progress & logs */}
                  {(auditRunning || auditLogs.length > 0) && (
                    <div className="space-y-3.5 pt-2 border-t border-slate-900">
                      {/* Animated Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>Scan réglementaire</span>
                          <span>{auditProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${auditProgress}%` }}
                            className="h-full bg-accent transition-all duration-300 ease-out"
                          />
                        </div>
                      </div>

                      {/* Stream Console Logs */}
                      <div className="bg-slate-900 rounded-lg p-3 font-mono text-[10px] text-slate-300 space-y-1.5 max-h-[140px] overflow-y-auto scrollbar-thin">
                        {auditLogs.map((log, i) => (
                          <div key={i} className="flex gap-1.5 items-start leading-normal">
                            <span className="text-slate-500">{`>`}</span>
                            <span>{log}</span>
                          </div>
                        ))}
                        {auditRunning && (
                          <div className="flex items-center gap-1.5 text-accent animate-pulse font-bold mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                            <span>Calcul de robustesse en cours...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Audit Analysis Results / Compliance Gaps */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                      Écarts de conformité ({gaps.filter(g => g.status !== "RESOLVED").length})
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold italic">
                      AI Act Annexe IV
                    </span>
                  </div>

                  {gaps.map((gap) => (
                    <div
                      key={gap.id}
                      onClick={() => setActiveSectionId(gap.sectionId)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        gap.status === "RESOLVED"
                          ? "bg-slate-50/50 border-slate-200 opacity-60"
                          : gap.severity === "CRITICAL"
                          ? "bg-red-50/30 border-red-200/60 hover:border-red-300"
                          : gap.severity === "HIGH"
                          ? "bg-amber-50/30 border-amber-200/60 hover:border-amber-300"
                          : "bg-blue-50/20 border-blue-200/60 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            {gap.status === "RESOLVED" ? (
                              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            ) : gap.severity === "CRITICAL" ? (
                              <XCircle size={14} className="text-red-500 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                            )}
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {gap.title}
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Section {gap.sectionId} : {gap.sectionTitle}
                          </span>
                        </div>
                        
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            gap.status === "RESOLVED"
                              ? "bg-emerald-50 text-emerald-700"
                              : gap.severity === "CRITICAL"
                              ? "bg-red-50 text-red-700"
                              : gap.severity === "HIGH"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {gap.status === "RESOLVED"
                            ? "RÉSOLU"
                            : gap.status === "ASSIGNED"
                            ? "ASSIGNÉ"
                            : gap.severity}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-2.5 leading-relaxed">
                        {gap.description}
                      </p>

                      {/* Action block for assignment */}
                      {gap.status === "OPEN" && (
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Non résolu. Assigner le correctif ?
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignGap(gap, "Sarah K. (Lead ML)");
                              }}
                              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold rounded"
                            >
                              Sarah (Lead ML)
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignGap(gap, "Jean-Marc (DPO)");
                              }}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded"
                            >
                              Jean (DPO)
                            </button>
                          </div>
                        </div>
                      )}

                      {gap.status === "ASSIGNED" && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium select-none">
                          <User size={12} className="text-slate-400" />
                          <span>Tâche assignée à <strong className="text-slate-700 font-bold">{gap.assignedTo}</strong>. Suivi disponible dans l&apos;onglet Discussions.</span>
                        </div>
                      )}

                      {gap.status === "RESOLVED" && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold select-none">
                          <Check size={12} />
                          <span>Écart résolu et validé dans le rapport v1.3</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Collaborative Comments & Tasks */}
            {activeRightTab === "comments" && (
              <div className="space-y-5 flex flex-col h-full justify-between">
                
                {/* Comments Submission Form */}
                <form
                  onSubmit={handlePostComment}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 shrink-0"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-800">
                      Rédiger une remarque ou assigner un correctif
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    {/* Section link */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500 uppercase tracking-wider text-[8px]">
                        Section ciblée
                      </label>
                      <select
                        value={commentSection}
                        onChange={(e) => setCommentSection(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-medium focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        {sections.map(s => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Task assignee */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500 uppercase tracking-wider text-[8px]">
                        Attribuer un correctif à (Optionnel)
                      </label>
                      <select
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-medium focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        <option value="">-- Personne --</option>
                        <option value="Sarah K. (Lead ML)">Sarah K. (Lead ML)</option>
                        <option value="Jean-Marc L. (DPO)">Jean-Marc L. (DPO)</option>
                        <option value="Alice V. (QA Engineer)">Alice V. (QA Engineer)</option>
                      </select>
                    </div>
                  </div>

                  {assignee && (
                    <div className="space-y-1 text-[10px] animate-in slide-in-from-top-2 duration-200">
                      <label className="font-bold text-slate-500 uppercase tracking-wider text-[8px]">
                        Intitulé de la tâche à accomplir
                      </label>
                      <input
                        type="text"
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        placeholder="Ex : Corriger les pourcentages de genres dans le texte..."
                        className="w-full p-2 bg-white border border-slate-200 rounded font-medium focus:outline-none focus:ring-1 focus:ring-accent placeholder-slate-400"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Votre commentaire ou recommandation..."
                      className="w-full min-h-[70px] p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent placeholder-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all"
                  >
                    <Send size={11} />
                    {assignee ? "Publier & Assigner la tâche" : "Publier le commentaire"}
                  </button>
                </form>

                {/* Comment feeds */}
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                    Fil d&apos;activité collaboratif ({comments.length})
                  </span>

                  <div className="space-y-3">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-full ${comment.avatarColor} text-white flex items-center justify-center text-[10px] font-bold select-none`}
                            >
                              {comment.author.split(" ").map(w => w[0]).join("")}
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 leading-none">
                                {comment.author}
                              </h5>
                              <span className="text-[9px] text-slate-400 font-semibold tracking-wider mt-0.5 block">
                                {comment.role}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {comment.timestamp}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <span className="inline-block text-[9px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                            {comment.sectionTitle}
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {comment.text}
                          </p>
                        </div>

                        {/* Associated task status */}
                        {comment.task && (
                          <div
                            onClick={() => toggleTaskCompletion(comment.id)}
                            className={`p-3 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-all ${
                              comment.task.completed
                                ? "bg-emerald-50/40 border-emerald-100 text-emerald-800"
                                : "bg-red-50/20 border-red-100 hover:bg-red-50/30"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={comment.task.completed}
                              onChange={() => {}} // Controlled by div click
                              className="mt-0.5 rounded border-slate-300 text-accent focus:ring-accent shrink-0 cursor-pointer"
                            />
                            <div className="text-[10px] font-medium leading-normal flex-1">
                              <span className="block font-bold text-slate-700 mb-0.5 uppercase tracking-wider text-[8px]">
                                Tâche pour : {comment.task.assignedTo}
                              </span>
                              <span className={comment.task.completed ? "line-through text-slate-400" : "text-slate-800"}>
                                {comment.task.description}
                              </span>
                              {comment.task.completed && (
                                <span className="block text-[8px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                                  Validée & résolue
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Live Draft Editor */}
            {activeRightTab === "edit" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                    Sélectionner la section réglementaire à corriger
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {sections.map(sec => (
                      <button
                        key={sec.id}
                        onClick={() => setActiveSectionId(sec.id)}
                        className={`px-2.5 py-2 text-left rounded-lg border text-[10px] font-bold transition-all line-clamp-1 ${
                          activeSectionId === sec.id
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                        title={sec.title}
                      >
                        {sec.id}. {sec.title.split(". ")[1]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800">
                      Édition en direct : {activeSection.title}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400">
                      {activeSection.content.length} caractères
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2 border border-slate-200 flex gap-1 items-center shrink-0 text-slate-500">
                    <button type="button" className="p-1 rounded hover:bg-white hover:text-slate-900 text-xs font-bold w-6 h-6 flex items-center justify-center">B</button>
                    <button type="button" className="p-1 rounded hover:bg-white hover:text-slate-900 text-xs italic w-6 h-6 flex items-center justify-center">I</button>
                    <button type="button" className="p-1 rounded hover:bg-white hover:text-slate-900 text-xs underline w-6 h-6 flex items-center justify-center">U</button>
                    <div className="h-4 w-px bg-slate-200 mx-1" />
                    <button type="button" className="p-1 rounded hover:bg-white hover:text-slate-900 text-[10px] font-bold px-2 flex items-center justify-center">Bullet List</button>
                  </div>

                  <textarea
                    className="w-full min-h-[300px] xl:min-h-[400px] p-4 text-xs font-medium text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/15 leading-relaxed resize-none focus:bg-white transition-all"
                    value={activeSection.content}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="Saisissez ou corrigez le contenu technique réglementaire de cette section..."
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                  <LegalDisclaimer variant="text" />
                  <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    <ShieldCheck size={11} /> Synchronisé avec le PDF
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RLS Infinite Recursion DB Troubleshooting Alert Modal */}
      {showRlsAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl border border-slate-200 shadow-raised overflow-hidden flex flex-col animate-fade-in animate-scale-up">
            {/* Header */}
            <div className="px-6 py-4 bg-red-50 border-b border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertCircle size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Erreur RLS détectée</h3>
                  <p className="text-[10px] text-red-600 font-bold uppercase">Infinite Recursion (Profiles Policy)</p>
                </div>
              </div>
              <button 
                onClick={() => setShowRlsAlert(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-650 leading-relaxed">
                Votre modification a été <strong>sauvegardée localement avec succès</strong> dans votre navigateur afin de ne perdre aucun travail. 
              </p>
              <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <Database size={13} /> Diagnostic Technique :
                </h4>
                <p className="text-[11px] text-amber-700 leading-normal font-medium">
                  La règle de sécurité RLS (Row Level Security) sur la table <code>profiles</code> de votre base Supabase fait référence à elle-même, provoquant une boucle récursive lors de la mise à jour des documents liés.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] text-slate-400 font-extrabold uppercase">Solution pour l&apos;Administrateur de Base de Données</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Exécutez la commande SQL suivante dans le <strong>SQL Editor</strong> de votre console Supabase pour corriger la règle d&apos;autorisation RLS de la table <code>profiles</code> :
                </p>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl text-[10px] font-mono overflow-x-auto leading-relaxed border border-slate-900 select-all">
{`CREATE OR REPLACE POLICY "Allow users to read profiles" 
ON profiles FOR SELECT 
USING (auth.uid() = id);`}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-500" /> Brouillon Local Sécurisé
              </span>
              <button
                type="button"
                onClick={() => setShowRlsAlert(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
