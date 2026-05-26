"use client";

import React, { useState } from "react";
import { ArrowLeft, Send, Sparkles, User, Library } from "lucide-react";
import { LegalDisclaimer } from "@/components/domain/LegalDisclaimer";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { source: string; article: string; text: string }[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      role: "assistant",
      content: "Bonjour Jean. Je suis votre conseiller juridique expert en IA Act. Posez-moi toute question concernant vos obligations réglementaires.",
    },
    {
      id: "msg-2",
      role: "user",
      content: "Quelles sont les obligations de transparence pour un chatbot de support client ?",
    },
    {
      id: "msg-3",
      role: "assistant",
      content: "Selon l'AI Act européen, les chatbots (systèmes d'IA conçus pour interagir directement avec des personnes physiques) sont soumis à des obligations spécifiques de transparence (principalement régies par l'Article 50).\n\n1. **Obligation d'information** : Vous devez informer les utilisateurs de manière claire et explicite qu'ils interagissent avec un système d'IA, sauf si cela ressort clairement des circonstances et du contexte d'utilisation.\n2. **Conformité technique** : Veillez à ce que cette information soit présentée de façon lisible et compréhensible au plus tard au moment de la première interaction.",
      citations: [
        {
          source: "AI Act de l'UE",
          article: "Article 50(1)",
          text: "Les fournisseurs veillent à ce que les systèmes d'IA destinés à interagir avec des personnes physiques soient conçus et développés de telle sorte que ces personnes soient informées qu'elles interagissent avec un système d'IA..."
        },
        {
          source: "Lignes Directrices CNIL",
          article: "Transparence IA",
          text: "Les concepteurs d'outils conversationnels doivent veiller à informer de manière proactive et compréhensible l'utilisateur final du recours à une IA."
        }
      ]
    }
  ]);

  const [input, setInput] = useState("");
  const [activeCitation, setActiveCitation] = useState<{ source: string; article: string; text: string } | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate Agent RAG Q&A response
    setTimeout(() => {
      const replyMsg: Message = {
        id: `reply-${Date.now()}`,
        role: "assistant",
        content: `J'ai bien reçu votre question : "${input}". En Mode Démo, l'agent RAG simulé formule cette réponse en s'appuyant sur le corpus juridique indexé.`,
        citations: [
          {
            source: "AI Act Officiel",
            article: "Article 10 (Données)",
            text: "Les systèmes d'IA à haut risque qui utilisent des techniques impliquant l'entraînement de modèles avec des données font l'objet d'une gouvernance et de pratiques de gestion des données appropriées..."
          }
        ]
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Return Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <Link
          href="/intelligence"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={14} /> Retour à la veille
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
          <Sparkles size={14} className="text-purple-500" />
          <span>Agent Claude-3.5-Sonnet (RAG Actif)</span>
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        <div className="lg:col-span-3 flex flex-col justify-between bg-white border border-slate-200 rounded-card shadow-card min-h-[500px] overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[420px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    msg.role === "user"
                      ? "bg-slate-200 text-slate-700"
                      : "bg-accent text-white"
                  }`}
                >
                  {msg.role === "user" ? <User size={14} /> : <Library size={14} />}
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-3 rounded-lg text-xs leading-relaxed font-medium whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-slate-100 text-slate-800"
                        : "bg-slate-50 border border-slate-200/60 text-slate-800"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Render citations if any */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Citations:</span>
                      {msg.citations.map((cit, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveCitation(cit)}
                          className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[10px] font-bold text-accent rounded transition-colors"
                        >
                          {cit.article}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form input and persistent legal warning */}
          <div className="border-t border-slate-200 bg-slate-50 p-4 space-y-3">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-accent/15 focus:outline-none"
                placeholder="Posez votre question réglementaire (ex: obligations haut-risque)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <Send size={14} /> Envoyer
              </button>
            </form>
            <LegalDisclaimer variant="text" />
          </div>
        </div>

        {/* Citations Inspector Panel */}
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-card flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Library size={16} className="text-slate-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Inspecteur RAG</h3>
            </div>

            {activeCitation ? (
              <div className="space-y-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold text-accent uppercase tracking-widest">{activeCitation.source}</span>
                  <span className="text-xs font-bold text-slate-800">{activeCitation.article}</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60 italic">
                  &ldquo;{activeCitation.text}&rdquo;
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium leading-normal">
                Cliquez sur une citation dans les réponses de l&apos;agent pour consulter les extraits de textes officiels.
              </p>
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-medium mt-4">
            Base documentaire : AI Act FR (fév 2025), RGPD, Lignes directrices CNIL.
          </div>
        </div>
      </div>
    </div>
  );
}
