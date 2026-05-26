"use client";

import React from "react";
import { Download, Plus } from "lucide-react";
import Link from "next/link";

const demoDocs = [
  {
    id: "doc-talent-screen",
    systemId: "talent-screen",
    systemName: "TalentScreen AI",
    kind: "ART_11_TECHNICAL_DOC",
    version: "v1.3",
    status: "DRAFT",
    updatedAt: "2026-05-20",
  },
  {
    id: "doc-credit-decision",
    systemId: "credit-decision",
    systemName: "CreditDecision Pro",
    kind: "ART_11_TECHNICAL_DOC",
    version: "v2.1",
    status: "FINAL",
    updatedAt: "2026-05-24",
  },
  {
    id: "doc-support-bot",
    systemId: "support-bot",
    systemName: "SupportBot Atlas",
    kind: "ART_11_TECHNICAL_DOC",
    version: "v1.0",
    status: "IN_REVIEW",
    updatedAt: "2026-05-22",
  },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Fiches de Documentation Art. 11</h2>
          <p className="text-xs text-slate-500 mt-1">
            Génération et maintenance de la documentation technique obligatoire pour les systèmes à haut risque
          </p>
        </div>
        <button
          onClick={() => alert("Génération du document démarrée (Simulé)")}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow transition-all"
        >
          <Plus size={14} /> Générer Art. 11
        </button>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {demoDocs.map((doc) => (
          <div key={doc.id} className="bg-white p-5 rounded-card border border-slate-200 shadow-card flex flex-col justify-between h-[180px] hover:shadow-raised transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                  {doc.version}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    doc.status === "FINAL"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : doc.status === "IN_REVIEW"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  {doc.status}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{doc.systemName}</h4>
                <p className="text-xs text-slate-400 mt-1 font-medium">Documentation Technique de l&apos;Art. 11</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
              <span className="text-[10px] text-slate-400 font-semibold">Mis à jour le {doc.updatedAt}</span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/documents/${doc.id}`}
                  className="px-2.5 py-1 text-xs font-bold text-accent hover:text-accent-hover hover:bg-blue-50 rounded transition-colors"
                >
                  Éditer
                </Link>
                <button
                  onClick={() => alert("Téléchargement PDF démarré")}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
