"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check,
  Cpu,
  Database,
  Layers,
  Info,
  Loader2
} from "lucide-react";
import Link from "next/link";

export default function NewSystemPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    provider: "custom",
    criticality: "HIGH",
    useCase: "scoring",
    dataTypes: ["finance", "identity"],
    rgpd: "yes",
    architecture: "xgboost",
    retraining: "monthly",
    explainability: "shap"
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const toggleDataType = (type: string) => {
    if (formData.dataTypes.includes(type)) {
      setFormData({
        ...formData,
        dataTypes: formData.dataTypes.filter((t) => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        dataTypes: [...formData.dataTypes, type]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStep(1);

    // Simulate Agent AI regulatory evaluation step-by-step
    setTimeout(() => {
      setSubmitStep(2);
      setTimeout(() => {
        setSubmitStep(3);
        setTimeout(() => {
          setSubmitStep(4);
          setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/systems"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors w-fit"
        >
          <ArrowLeft size={14} /> Retour au registre
        </Link>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Déclarer un système IA</h2>
        <p className="text-xs text-slate-500">
          Enregistrez un nouvel algorithme pour analyser son niveau de risque et de conformité face à l&apos;AI Act.
        </p>
      </div>

      {isSubmitting ? (
        /* Dynamic AI Agent qualification screens */
        <div className="bg-white p-8 rounded-card border border-slate-200 shadow-card flex flex-col items-center justify-center text-center min-h-[400px] space-y-6 animate-in fade-in duration-200">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-accent animate-spin" />
            <Cpu className="absolute text-accent stroke-[1.8]" size={24} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
              Analyse Réglementaire par Agent IA
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Notre agent juridique évalue la conformité de {formData.name || "votre système"} en temps réel...
            </p>
          </div>

          {/* Steps list */}
          <div className="w-full max-w-sm space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
            {[
              { id: 1, text: "Saisie des données et caractéristiques techniques..." },
              { id: 2, text: "Vérification des critères d'impact de l'AI Act (Art. 6 & 52)..." },
              { id: 3, text: "Calcul automatique du niveau de risque..." },
              { id: 4, text: "Initialisation du dossier technique de conformité Article 11..." }
            ].map((s) => {
              const isDone = submitStep > s.id;
              const isActive = submitStep === s.id;
              return (
                <div key={s.id} className="flex items-center gap-2.5 text-xs font-semibold">
                  {isDone ? (
                    <span className="w-4.5 h-4.5 rounded-full bg-green-500 text-white flex items-center justify-center text-[9px]">
                      ✓
                    </span>
                  ) : isActive ? (
                    <Loader2 size={12} className="animate-spin text-accent" />
                  ) : (
                    <span className="w-4.5 h-4.5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[9px] font-bold">
                      {s.id}
                    </span>
                  )}
                  <span className={isDone ? "text-slate-500 line-through" : isActive ? "text-slate-800 font-bold" : "text-slate-400"}>
                    {s.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : submitSuccess ? (
        /* Premium Success Panel showing dynamically calculated risk */
        <div className="bg-white p-8 rounded-card border border-slate-200 shadow-card flex flex-col items-center justify-center text-center min-h-[400px] space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shadow-sm">
            <ShieldCheck size={28} className="stroke-[2.2]" />
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-extrabold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Enregistrement Réussi
            </span>
            <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
              {formData.name} Déclaré avec Succès !
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Votre système IA a été analysé et catégorisé automatiquement au regard des obligations de l&apos;AI Act.
            </p>
          </div>

          {/* Regulatory evaluation receipt card */}
          <div className="w-full max-w-md bg-slate-50 rounded-xl border border-slate-200/80 p-5 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Niveau de risque attribué
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-black text-red-500 uppercase tracking-wider">
                  Haut Risque (HIGH RISK)
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Score Initial de Conformité
              </span>
              <p className="text-xs font-black text-slate-800">
                45% (Incomplet)
              </p>
            </div>

            <div className="space-y-1 border-t border-slate-200/60 pt-3 sm:col-span-2">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Prochaines étapes de conformité
              </span>
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed pt-1">
                La documentation technique réglementaire (**Article 11 v1.0**) a été générée sous forme d&apos;ébauche. Complétez les 8 chapitres requis pour augmenter votre note.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <button
              onClick={() => router.push("/systems")}
              className="w-full sm:w-1/2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors"
            >
              Retour au registre
            </button>
            <button
              onClick={() => router.push("/systems/1")} // Redirects to our high risk scoring system details
              className="w-full sm:w-1/2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              Gérer la conformité
            </button>
          </div>
        </div>
      ) : (
        /* Stateful Wizard Form */
        <div className="space-y-5">
          {/* Steps Progress Indicator */}
          <div className="flex items-center justify-between bg-white px-5 py-3.5 border border-slate-200 rounded-lg shadow-card">
            {[
              { num: 1, label: "Identité", icon: Info },
              { num: 2, label: "Usage & Données", icon: Database },
              { num: 3, label: "Architecture", icon: Layers },
              { num: 4, label: "Vérification", icon: ShieldCheck }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <span
                  className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= s.num ? "bg-accent text-white" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step > s.num ? <Check size={11} className="stroke-[3]" /> : s.num}
                </span>
                <span
                  className={`text-xs font-bold hidden md:inline transition-colors ${
                    step >= s.num ? "text-slate-800" : "text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-card border border-slate-200 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Identité du système
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Définissez les caractéristiques générales et le niveau de risque supposé.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Nom de l&apos;algorithme *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex. CreditDecision Pro"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Description générale</label>
                    <textarea
                      placeholder="Expliquez brièvement le rôle de ce système et son public cible..."
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none leading-relaxed"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Fournisseur du modèle</label>
                      <select
                        className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                        value={formData.provider}
                        onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      >
                        <option value="custom">Développement interne (Custom)</option>
                        <option value="openai">OpenAI (GPT-4o/GPT-3.5)</option>
                        <option value="anthropic">Anthropic (Claude 3.5)</option>
                        <option value="mistral">Mistral AI (Large/Codestral)</option>
                        <option value="huggingface">HuggingFace Open-Source</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700">Niveau de risque pressenti</label>
                      <select
                        className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                        value={formData.criticality}
                        onChange={(e) => setFormData({ ...formData, criticality: e.target.value })}
                      >
                        <option value="MINIMAL">Risque Minimal (Exempte)</option>
                        <option value="LIMITED">Risque Limité (Transparence)</option>
                        <option value="HIGH">Risque Élevé (Obligations strictes)</option>
                        <option value="UNACCEPTABLE">Risque Inacceptable (Interdit)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: USAGE & DATA */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Usage & Données d&apos;apprentissage
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Définissez les domaines d&apos;application et les types de données traitées.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Domaine d&apos;utilisation principal</label>
                    <select
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                      value={formData.useCase}
                      onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                    >
                      <option value="scoring">Scoring de Crédit / Solvabilité financière</option>
                      <option value="hr">Recrutement et Gestion des Ressources Humaines</option>
                      <option value="health">Diagnostic Médical et Santé Publique</option>
                      <option value="biometric">Identification Biométrique / Reconnaissance faciale</option>
                      <option value="customer">Relation client et Modération de contenu</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700">Types de données traitées</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "finance", label: "Données financières / Revenus" },
                        { id: "identity", label: "Données d'identité / Civilité" },
                        { id: "biometrics", label: "Données biométriques / Sensibles" },
                        { id: "health_data", label: "Données de santé / Médicales" },
                        { id: "logs", label: "Traces de navigation / Logs" },
                        { id: "behavioral", label: "Profils de comportement" }
                      ].map((t) => {
                        const active = formData.dataTypes.includes(t.id);
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => toggleDataType(t.id)}
                            className={`p-2.5 rounded-lg border text-left text-xs font-bold transition-all flex items-center justify-between ${
                              active
                                ? "bg-accent/5 border-accent text-accent"
                                : "bg-white border-slate-200 hover:border-slate-350 text-slate-600"
                            }`}
                          >
                            <span>{t.label}</span>
                            {active && <Check size={12} className="stroke-[3.5]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-xs font-bold text-slate-700">Le système est-il soumis au RGPD ?</label>
                    <div className="flex gap-4">
                      {["yes", "no"].map((val) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                          <input
                            type="radio"
                            name="rgpd"
                            value={val}
                            checked={formData.rgpd === val}
                            onChange={(e) => setFormData({ ...formData, rgpd: e.target.value })}
                            className="text-accent focus:ring-accent"
                          />
                          <span>{val === "yes" ? "Oui, traitement de données personnelles" : "Non, données anonymes ou synthétiques"}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ARCHITECTURE & EXPLAINABILITY */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Architecture & Explicabilité
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Précisez la complexité technique du modèle et les mécanismes d&apos;interprétabilité.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Architecture algorithmique</label>
                    <select
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                      value={formData.architecture}
                      onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
                    >
                      <option value="xgboost">Arbres de décision boostés (XGBoost / LightGBM)</option>
                      <option value="cnn">Réseau de neurones profonds (Deep Learning / CNN / RNN)</option>
                      <option value="transformer">Transformer / LLM (Fine-Tuning Local ou Cloud)</option>
                      <option value="linear">Régression Logistique / Modèle linéaire simple</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Fréquence de réentraînement</label>
                    <select
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                      value={formData.retraining}
                      onChange={(e) => setFormData({ ...formData, retraining: e.target.value })}
                    >
                      <option value="weekly">Hebdomadaire (Continuous integration)</option>
                      <option value="monthly">Mensuelle (Planifiée)</option>
                      <option value="yearly">Annuelle / Ponctuelle</option>
                      <option value="never">Modèle figé en production</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700">Mécanisme d&apos;explicabilité intégré</label>
                    <select
                      className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15"
                      value={formData.explainability}
                      onChange={(e) => setFormData({ ...formData, explainability: e.target.value })}
                    >
                      <option value="shap">SHAP (SHapley Additive exPlanations)</option>
                      <option value="lime">LIME (Local Interpretable Model-agnostic Explanations)</option>
                      <option value="native">Modèle intrinsèquement explicable (Arbre simple, Coefficients)</option>
                      <option value="none">Aucun (Boîte noire)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: VERIFICATION & AUDIT ASSURANCE */}
              {step === 4 && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="text-center py-4 space-y-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 text-green-600 border border-green-200 rounded-full shadow-sm">
                      <ShieldCheck size={28} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">Prêt pour la qualification AI Act</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                        Le système sera qualifié automatiquement à l&apos;aide de l&apos;agent d&apos;audit dès sa création.
                      </p>
                    </div>
                  </div>

                  {/* Summary Card before submission */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5 select-none">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Récapitulatif de la déclaration
                    </span>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs leading-normal">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Algorithme</span>
                        <span className="font-extrabold text-slate-700">{formData.name || "CreditDecision Pro"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Niveau pressenti</span>
                        <span className="font-extrabold text-red-500">{formData.criticality} RISK</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Architecture</span>
                        <span className="font-bold text-slate-600 capitalize">{formData.architecture}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Explicabilité</span>
                        <span className="font-bold text-slate-600 uppercase">{formData.explainability}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-[10px] text-slate-500 leading-normal font-semibold bg-blue-50/40 border border-blue-100 p-3 rounded-lg">
                    <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                    <span>
                      En validant, notre agent d&apos;audit juridique se chargera de calculer le niveau de conformité initial et de créer votre documentation technique de l&apos;Article 11.
                    </span>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={step === 1}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors shadow-sm"
                >
                  <ArrowLeft size={14} /> Précédent
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow transition-all"
                  >
                    Suivant <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-md shadow-accent/15 transition-all"
                  >
                    Valider & Déclarer
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
