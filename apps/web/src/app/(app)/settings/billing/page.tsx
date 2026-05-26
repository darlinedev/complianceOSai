"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Check,
  ArrowRight,
  CheckCircle,
  X,
  Loader2,
  Download,
  Building,
  Mail,
  User,
  ExternalLink,
  Printer,
  FileText
} from "lucide-react";

interface InvoiceData {
  date: string;
  amount: string;
  id: string;
  priceNum: number;
}

// Keep file download helper outside component to guarantee zero SWC JSX desynchronization issues
function triggerInvoiceDownload(inv: InvoiceData, activePlanName: string, cardBrand: string, cardLast4: string) {
  const priceHT = inv.priceNum / 1.2;
  const priceVAT = inv.priceNum - priceHT;

  const content = [
    "==================================================",
    "                 COMPLIANCEOS SAAS",
    "==================================================",
    `FACTURE N° : ${inv.id}`,
    `Date d'émission : ${inv.date}`,
    `Statut : PAYÉE (Règlement ${cardBrand} **** ${cardLast4})`,
    "",
    "ÉMETTEUR :",
    "ComplianceOS Europe SAS",
    "42 Rue de la Loi",
    "1000 Bruxelles, Belgique",
    "TVA : BE 0987.654.321",
    "",
    "DESTINATAIRE :",
    "ACME Corp",
    "Attn : Jean DPO",
    "jean.dpo@acme.eu",
    "",
    "--------------------------------------------------",
    "DÉSIGNATION                    MONTANT (TTC)",
    "--------------------------------------------------",
    `Abonnement ComplianceOS SaaS     ${inv.amount}`,
    `Formule : ${activePlanName} (Mensuel)`,
    "",
    "--------------------------------------------------",
    "RÉCAPITULATIF FINANCIER",
    "--------------------------------------------------",
    `TOTAL HT :                     ${priceHT.toFixed(2).replace(".", ",")} €`,
    `TVA (20,0%) :                  ${priceVAT.toFixed(2).replace(".", ",")} €`,
    `TOTAL TTC :                    ${inv.amount}`,
    "",
    "==================================================",
    "                FACTURÉ & PAYÉ",
    "==================================================",
    "Merci pour votre confiance.",
    "ComplianceOS - Plateforme de conformité AI Act"
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `facture-${inv.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BillingSettingsPage() {
  const [activePlan, setActivePlan] = useState("STARTER");
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [isEnterpriseOpen, setIsEnterpriseOpen] = useState(false);
  const [isChangingPlan, setIsChangingPlan] = useState<string | null>(null);

  // Stripe Card States
  const [cardLast4, setCardLast4] = useState("4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardBrand, setCardBrand] = useState("VISA");
  const [cardName, setCardName] = useState("ACME Corp");
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  // Edit card form states
  const [editCardNum, setEditCardNum] = useState("");
  const [editCardExpiry, setEditCardExpiry] = useState("");
  const [editCardCvc, setEditCardCvc] = useState("");
  const [editCardName, setEditCardName] = useState("");

  // Stripe Portal States
  const [isUpdatingCard, setIsUpdatingCard] = useState(false);
  const [cardSuccess, setCardSuccess] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<InvoiceData | null>(null);

  // Enterprise form states
  const enterpriseName = "Jean DPO";
  const enterpriseEmail = "jean.dpo@acme.eu";
  const enterpriseOrg = "ACME Corp";
  const [enterpriseMsg, setEnterpriseMsg] = useState("");
  const [isEnterpriseSubmitting, setIsEnterpriseSubmitting] = useState(false);
  const [enterpriseSuccess, setEnterpriseSuccess] = useState(false);

  const getPlanDetails = (name: string) => {
    switch (name) {
      case "GRATUIT":
        return {
          name: "GRATUIT",
          price: "0 €",
          limits: "1 système IA maximum, 1 document technique Art. 11, sans monitoring",
          status: "Actif",
          renewsAt: "Sans renouvellement (Plan Gratuit)",
          priceNum: 0
        };
      case "STARTER":
        return {
          name: "STARTER",
          price: "149 €/mois",
          limits: "Jusqu'à 3 systèmes, documentation illimitée, veille hebdo",
          status: "Actif",
          renewsAt: "25 juin 2026",
          priceNum: 149
        };
      case "PROFESSIONAL":
        return {
          name: "PROFESSIONAL",
          price: "490 €/mois",
          limits: "Jusqu'à 15 systèmes, monitoring continu, veille quotidienne",
          status: "Actif",
          renewsAt: "25 juin 2026",
          priceNum: 490
        };
      default:
        return {
          name: "STARTER",
          price: "149 €/mois",
          limits: "Jusqu'à 3 systèmes, documentation illimitée, veille hebdo",
          status: "Actif",
          renewsAt: "25 juin 2026",
          priceNum: 149
        };
    }
  };

  const currentPlan = getPlanDetails(activePlan);
  const activePriceNum = currentPlan.priceNum;
  const activeAmountStr = activePriceNum.toFixed(2).replace(".", ",") + " €";

  const plans = [
    {
      name: "GRATUIT",
      price: "0 €",
      period: "",
      desc: "Idéal pour évaluer ComplianceOS et qualifier votre premier modèle",
      features: ["1 système IA maximum", "1 document technique Art. 11", "Sans monitoring continu", "Support par email basique"],
      ctaText: "Plan actuel gratuit"
    },
    {
      name: "STARTER",
      price: "149 €",
      period: "/ mois",
      desc: "Pour les équipes gérant quelques applications IA régulées",
      features: ["Jusqu'à 3 systèmes IA", "Documentation Art. 11 illimitée", "Veille réglementaire hebdo", "Support prioritaire"],
      ctaText: "Plan Actuel"
    },
    {
      name: "PROFESSIONAL",
      price: "490 €",
      period: "/ mois",
      desc: "Solution complète pour surveiller et maintenir votre conformité",
      features: ["Jusqu'à 15 systèmes IA", "Monitoring continu du drift", "Veille réglementaire quotidienne", "Support 24/7 & Slack dédié"],
      ctaText: "Choisir ce plan"
    },
    {
      name: "ENTERPRISE",
      price: "Sur devis",
      period: "",
      desc: "Pour les grandes entreprises avec des parcs complexes",
      features: ["Systèmes IA illimités", "CSM dédié (Customer Success)", "SLA contractuel & support critique", "Déploiement sur-mesure (On-Premise/VPC)"],
      ctaText: "Contacter les ventes"
    }
  ];

  const handleSelectPlan = (planName: string) => {
    if (planName === "ENTERPRISE") {
      setIsEnterpriseOpen(true);
      return;
    }

    setIsChangingPlan(planName);

    // Simulate API update call with loader
    setTimeout(() => {
      setActivePlan(planName);
      setIsChangingPlan(null);
    }, 1000);
  };

  const handleOpenCardModal = () => {
    setEditCardNum("");
    setEditCardExpiry("");
    setEditCardCvc("");
    setEditCardName(cardName);
    setIsCardModalOpen(true);
  };

  const handleCardNumChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    const formatted = digits.match(/.{1,4}/g)?.join(" ") || digits;
    setEditCardNum(formatted.slice(0, 19));
  };

  const handleExpiryChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length <= 2) {
      setEditCardExpiry(digits);
    } else {
      setEditCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2, 4)}`);
    }
  };

  const handleCvcChange = (val: string) => {
    setEditCardCvc(val.replace(/\D/g, "").slice(0, 4));
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingCard(true);

    setTimeout(() => {
      setIsUpdatingCard(false);

      const rawDigits = editCardNum.replace(/\s+/g, "");
      const cleanLast4 = rawDigits.slice(-4).replace(/\D/g, "") || "4242";
      setCardLast4(cleanLast4.length === 4 ? cleanLast4 : "4242");
      
      setCardExpiry(editCardExpiry || "12/28");
      setCardName(editCardName || "ACME Corp");

      const firstDigit = rawDigits.charAt(0);
      if (firstDigit === "4") {
        setCardBrand("VISA");
      } else if (firstDigit === "5") {
        setCardBrand("MASTERCARD");
      } else if (firstDigit === "3") {
        setCardBrand("AMEX");
      } else {
        setCardBrand("CB");
      }

      setCardSuccess(true);
      setIsCardModalOpen(false);

      setTimeout(() => setCardSuccess(false), 3000);
    }, 1500);
  };

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnterpriseSubmitting(true);

    setTimeout(() => {
      setIsEnterpriseSubmitting(false);
      setEnterpriseSuccess(true);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Abonnement & Facturation</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les quotas de votre organisation, mettez à jour votre carte bancaire ou changez de formule tarifaire.
          </p>
        </div>
      </div>

      {/* Current plan card */}
      <div className="bg-white p-6 rounded-card border border-slate-200 shadow-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-white bg-accent px-2.5 py-0.5 rounded tracking-wider uppercase">
              Formule {currentPlan.name}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {currentPlan.status}
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-800">{currentPlan.price}</h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-lg">
            <strong className="text-slate-600">Inclus :</strong> {currentPlan.limits}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-start md:items-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold">Prochaine facturation : {currentPlan.renewsAt}</span>
          <button
            onClick={() => setIsStripeOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            <CreditCard size={14} /> Gérer la facturation sur Stripe
          </button>
        </div>
      </div>

      {/* Pricing comparison */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Plans Disponibles & Tarifs
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Choisissez la formule la plus adaptée au volume de vos projets d&apos;IA
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p, i) => {
            const isActive = p.name === activePlan;
            const isUpgrading = isChangingPlan === p.name;
            return (
              <div
                key={i}
                className={`bg-white p-5 rounded-card border shadow-card flex flex-col justify-between min-h-[380px] transition-all relative ${
                  isActive
                    ? "border-accent ring-2 ring-accent/15"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2.5 right-4 bg-accent text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Plan Actuel
                  </span>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                      {p.name}
                    </span>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-extrabold text-slate-900">{p.price}</span>
                      <span className="text-[10px] font-bold text-slate-400">{p.period}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1 select-none">
                      {p.desc}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100" />

                  {/* Features List */}
                  <ul className="space-y-2.5">
                    {p.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[11px] font-semibold text-slate-600 leading-normal select-none">
                        <CheckCircle size={12} className="text-accent shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="pt-6">
                  {isUpgrading ? (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed"
                    >
                      <Loader2 size={13} className="animate-spin text-accent" /> Activation...
                    </button>
                  ) : isActive ? (
                    <span className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg cursor-default select-none border border-slate-200/60">
                      <Check size={14} className="stroke-[2.5]" /> Actuel
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(p.name)}
                      className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                        p.name === "PROFESSIONAL"
                          ? "bg-accent hover:bg-accent-hover text-white shadow-accent/10"
                          : "border border-slate-200 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {p.ctaText} <ArrowRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Stripe Customer Portal Drawer/Modal */}
      {isStripeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Dark Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm tracking-wider">
                  S
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Portail Client Stripe
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    Espace de facturation sécurisé pour ACME Corp
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStripeOpen(false)}
                className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Simulated Portal Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950">
              {/* Left Column: Plan & Card Details */}
              <div className="space-y-5">
                <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl space-y-3">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">
                    Formule en cours
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-white uppercase tracking-wide">
                      {activePlan}
                    </h4>
                    <p className="text-xs font-bold text-slate-400">{currentPlan.price}</p>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Facturé le 25 de chaque mois. {currentPlan.renewsAt}
                  </p>
                </div>

                <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl space-y-3">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">
                    Moyen de paiement
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-black text-white tracking-widest uppercase">
                      {cardBrand}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        {cardBrand.charAt(0) + cardBrand.slice(1).toLowerCase()} terminant par {cardLast4}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Expire le {cardExpiry}</p>
                    </div>
                  </div>

                  {cardSuccess ? (
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg w-full justify-center">
                      <CheckCircle size={12} /> Carte mise à jour !
                    </div>
                  ) : (
                    <button
                      onClick={handleOpenCardModal}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg border border-slate-700 transition-colors shadow-sm"
                    >
                      Mettre à jour la carte bancaire
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Invoice History */}
              <div className="space-y-3">
                <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">
                  Historique des factures (Cliquez pour visualiser)
                </span>
                
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
                  <div className="overflow-y-auto max-h-[175px] divide-y divide-slate-800/60">
                    {[
                      { date: "25/05/2026", amount: activeAmountStr, status: "Payée" },
                      { date: "25/04/2026", amount: activeAmountStr, status: "Payée" },
                      { date: "25/03/2026", amount: activeAmountStr, status: "Payée" }
                    ].map((inv, idx) => (
                      <div
                        key={idx}
                        onClick={() => setViewingInvoice({
                          date: inv.date,
                          amount: inv.amount,
                          id: `ACME-${idx + 10948}`,
                          priceNum: activePriceNum
                        })}
                        className="p-3 flex items-center justify-between hover:bg-slate-800/30 cursor-pointer transition-colors"
                        title="Visualiser la facture"
                      >
                        <div>
                          <p className="text-[10px] font-bold text-slate-200">Facture du {inv.date}</p>
                          <p className="text-[9px] text-slate-500 font-semibold mt-0.5">ACME-{idx + 10948}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">
                            {inv.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerInvoiceDownload({
                                date: inv.date,
                                amount: inv.amount,
                                id: `ACME-${idx + 10948}`,
                                priceNum: activePriceNum
                              }, activePlan, cardBrand, cardLast4);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 rounded border border-slate-700/60 transition-colors"
                            title="Télécharger la facture"
                          >
                            <Download size={11} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-bold bg-slate-900/15 border border-slate-850 p-2.5 rounded-lg leading-relaxed select-none">
                  <ExternalLink size={12} className="shrink-0" />
                  <span>
                    Cliquez sur une ligne pour visualiser la facture ou sur l&apos;icône pour la télécharger.
                  </span>
                </div>
              </div>
            </div>

            {/* Dark Footer */}
            <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end bg-slate-950">
              <button
                onClick={() => setIsStripeOpen(false)}
                className="px-4 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-750 text-white text-[11px] font-bold rounded-lg transition-colors"
              >
                Fermer le portail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stateful Card Editor Dialog (Overlay Modal inside Stripe Portal) */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl max-w-sm w-full overflow-hidden text-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <CreditCard size={15} className="text-blue-500" />
                <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  Mettre à Jour la Carte
                </h4>
              </div>
              <button
                onClick={() => setIsCardModalOpen(false)}
                className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Card Editor Form */}
            <form onSubmit={handleSaveCard} className="p-5 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Nom du titulaire
                </label>
                <input
                  required
                  type="text"
                  placeholder="ACME Corp"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white focus:border-blue-500 focus:outline-none placeholder:text-slate-600"
                  value={editCardName}
                  onChange={(e) => setEditCardName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Numéro de carte bancaire
                </label>
                <div className="relative flex items-center">
                  <input
                    required
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white focus:border-blue-500 focus:outline-none placeholder:text-slate-600"
                    value={editCardNum}
                    onChange={(e) => handleCardNumChange(e.target.value)}
                  />
                  <span className="absolute right-3 text-[9px] font-black text-slate-500 select-none">
                    {editCardNum.charAt(0) === "4" ? "VISA" : editCardNum.charAt(0) === "5" ? "MC" : editCardNum.charAt(0) === "3" ? "AMEX" : "CARD"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Date d&apos;expiration
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white text-center focus:border-blue-500 focus:outline-none placeholder:text-slate-600"
                    value={editCardExpiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                    CVC / Cryptogramme
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="•••"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-white text-center focus:border-blue-500 focus:outline-none placeholder:text-slate-600"
                    value={editCardCvc}
                    onChange={(e) => handleCvcChange(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-850 text-[10px] font-bold rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingCard}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-bold rounded-lg shadow-md shadow-blue-500/10 transition-colors inline-flex items-center gap-1.5"
                >
                  {isUpdatingCard ? (
                    <>
                      <Loader2 size={11} className="animate-spin" /> Enregistrement...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Invoice Visualizer Overlay Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            {/* Invoice Top ToolBar */}
            <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-accent" />
                <span className="text-xs font-bold text-slate-700">Facture {viewingInvoice.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerInvoiceDownload(viewingInvoice, activePlan, cardBrand, cardLast4)}
                  className="p-1.5 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Télécharger la facture TXT"
                >
                  <Download size={14} />
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Imprimer"
                >
                  <Printer size={14} />
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Simulated Invoice Layout */}
            <div className="p-8 space-y-6 bg-white max-h-[80vh] overflow-y-auto">
              {/* Invoice Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-base font-black text-slate-900 tracking-tight">ComplianceOS</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                    ComplianceOS Europe SAS<br />
                    42 Rue de la Loi, 1000 Bruxelles<br />
                    TVA: BE 0987.654.321
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <span className="inline-block text-[10px] font-extrabold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full uppercase tracking-wider">
                    Facture Payée
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight pt-1">
                    {viewingInvoice.id}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Émise le {viewingInvoice.date}
                  </p>
                </div>
              </div>

              {/* Addresses section */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4">
                <div className="space-y-1 select-none">
                  <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Facturé À :
                  </h4>
                  <p className="text-xs font-bold text-slate-800">
                    ACME Corp
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                    Attn: Jean DPO<br />
                    jean.dpo@acme.eu
                  </p>
                </div>

                <div className="space-y-1 select-none">
                  <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Mode de Règlement :
                  </h4>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-black text-slate-600 tracking-wider uppercase">
                      {cardBrand}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      terminant par {cardLast4}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="pb-2">Description</th>
                      <th className="pb-2 text-right">Quantité</th>
                      <th className="pb-2 text-right">Montant (TTC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-700">
                      <td className="py-3 pr-4">
                        <span className="font-bold text-slate-900 block">
                          Abonnement SaaS ComplianceOS - Plan {activePlan}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Période : Mensuel ({viewingInvoice.date} - 25/{parseInt(viewingInvoice.date.split("/")[1]) + 1}/{viewingInvoice.date.split("/")[2]})
                        </span>
                      </td>
                      <td className="py-3 text-right">1</td>
                      <td className="py-3 text-right font-bold text-slate-900">{viewingInvoice.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end pt-2">
                <div className="w-56 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500 font-semibold select-none">
                    <span>Total HT :</span>
                    <span className="font-bold text-slate-800">
                      {(viewingInvoice.priceNum / 1.2).toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 font-semibold select-none">
                    <span>TVA (20,0%) :</span>
                    <span className="font-bold text-slate-800">
                      {(viewingInvoice.priceNum - viewingInvoice.priceNum / 1.2).toFixed(2).replace(".", ",")} €
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-extrabold text-slate-900 text-sm select-none">
                    <span>Montant TTC :</span>
                    <span>{viewingInvoice.amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-[10px] text-slate-400 font-bold leading-normal select-none">
                ComplianceOS sécurise votre abonnement AI Act.
              </span>
              <button
                onClick={() => setViewingInvoice(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-350 text-slate-600 text-[11px] font-bold rounded-lg transition-colors"
              >
                Fermer l&apos;aperçu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Contact Form Modal */}
      {isEnterpriseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-accent">
                  <Building size={16} className="stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Demande de Devis Enterprise
                </h3>
              </div>
              <button
                disabled={isEnterpriseSubmitting}
                onClick={() => {
                  setIsEnterpriseOpen(false);
                  setEnterpriseSuccess(false);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            {enterpriseSuccess ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 animate-bounce">
                  <CheckCircle size={28} className="stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">Demande envoyée avec succès !</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xs mt-1">
                    Notre équipe commerciale et votre futur CSM dédié vous contacteront sous 4 heures ouvrées.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEnterpriseOpen(false);
                    setEnterpriseSuccess(false);
                  }}
                  className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors mt-2"
                >
                  Fermer
                </button>
              </div>
            ) : isEnterpriseSubmitting ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 size={32} className="text-accent animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Transmission de la demande...</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider animate-pulse">
                    Qualification du volume et de l&apos;accord SLA
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnterpriseSubmit} className="p-6 space-y-4">
                {/* Prefilled User details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Contact principal
                    </label>
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 select-none">
                      <User size={13} /> {enterpriseName}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Organisation
                    </label>
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 select-none">
                      <Building size={13} /> {enterpriseOrg}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Adresse email professionnelle</label>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 select-none">
                    <Mail size={13} /> {enterpriseEmail}
                  </div>
                </div>

                {/* Custom message */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Besoins spécifiques & volume d&apos;IA *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Ex. 25 modèles haut risque à déclarer d'ici fin 2026, intégrations Jira et déploiement sur notre VPC AWS..."
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-accent/15 focus:outline-none placeholder:text-slate-400 text-slate-800 leading-normal"
                    value={enterpriseMsg}
                    onChange={(e) => setEnterpriseMsg(e.target.value)}
                  />
                </div>

                <p className="text-[10px] text-slate-400 leading-normal font-semibold">
                  SLA garanti à 99,9%, onboarding technique de vos équipes, conformité ISO 27001 et hébergement souverain inclus.
                </p>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEnterpriseOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-bold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-md shadow-accent/15 transition-all"
                  >
                    Demander le devis
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
