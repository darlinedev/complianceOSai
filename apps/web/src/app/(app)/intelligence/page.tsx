"use client";

import React from "react";
import { demoRegulatoryUpdates } from "@/lib/demo-data";
import { Scale, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function IntelligencePage() {
  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Veille Réglementaire Active</h2>
          <p className="text-xs text-slate-500 mt-1">
            Suivi législatif continu du corpus réglementaire européen (AI Act, RGPD, Directive Responsabilité IA).
          </p>
        </div>
        <Link
          href="/intelligence/chat"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-md shadow-accent/15 transition-all self-start sm:self-center"
        >
          <MessageSquare size={14} /> Poser une question juridique
        </Link>
      </div>

      {/* Grid containing updates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Dernières publications de l&apos;UE & CNIL
          </h3>
          <div className="space-y-4">
            {demoRegulatoryUpdates.map((update) => (
              <div key={update.id} className="bg-white p-5 rounded-card border border-slate-200 shadow-card hover:border-slate-300 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {update.source}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{update.publishedAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 leading-snug">{update.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{update.summary}</p>
                </div>

                <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-50">
                  {update.tags.map((tag, i) => (
                    <span key={i} className="text-[9px] font-bold bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-full text-slate-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="bg-brand-dark p-6 rounded-card text-white space-y-6 flex flex-col justify-between h-fit">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-accent">
              <Scale size={20} className="stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wider uppercase text-white">Q&A Réglementaire RAG</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Notre agent de recherche est connecté en temps réel aux bases juridiques de l&apos;Union Européenne pour répondre précisément à vos questions de conformité.
              </p>
            </div>
          </div>

          <Link
            href="/intelligence/chat"
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold transition-all mt-6 shadow-md shadow-accent/15"
          >
            Lancer le Chat IA <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
