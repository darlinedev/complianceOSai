"use client";

import React, { useState } from "react";
import { UserPlus, Check, X, Loader2, AlertTriangle } from "lucide-react";

interface TeamMember {
  name: string;
  email: string;
  role: "OWNER" | "COMPLIANCE_MANAGER" | "AUDITOR";
  status: "Active" | "Invité";
}

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "Jean DPO", email: "jean.dpo@acme.eu", role: "COMPLIANCE_MANAGER", status: "Active" },
    { name: "Marc Aubert", email: "marc.risk@acme.eu", role: "AUDITOR", status: "Active" },
    { name: "Sarah Connor", email: "sarah.connor@acme.eu", role: "OWNER", status: "Active" },
  ]);

  // Invite member modal states
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"OWNER" | "COMPLIANCE_MANAGER" | "AUDITOR">("AUDITOR");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom remove member modal states
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);

    // Simulate sending email invitation via API
    setTimeout(() => {
      const newMember: TeamMember = {
        name,
        email,
        role,
        status: "Invité",
      };
      setMembers((prev) => [...prev, newMember]);
      setIsSubmitting(false);
      setIsOpen(false);
      
      // Reset form
      setName("");
      setEmail("");
      setRole("AUDITOR");
    }, 1200);
  };

  const executeRemoveMember = () => {
    if (!memberToRemove) return;
    setIsRemoving(true);

    // Simulate remote server sync delete
    setTimeout(() => {
      setMembers((prev) => prev.filter((m) => m.email !== memberToRemove.email));
      setIsRemoving(false);
      setMemberToRemove(null);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Paramètres d&apos;Équipe & Rôles</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les collaborateurs accédant à ComplianceOS et définissez leurs droits d&apos;accès RBAC.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-md shadow-accent/15 transition-all self-start"
        >
          <UserPlus size={14} /> Inviter un membre
        </button>
      </div>

      {/* Members Registry Table */}
      <div className="bg-white rounded-card border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                <th className="px-5 py-4">Collaborateur</th>
                <th className="px-5 py-4">Rôle RBAC</th>
                <th className="px-5 py-4">Statut</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-xs text-slate-400 font-medium">
                    Aucun collaborateur enregistré dans cette organisation.
                  </td>
                </tr>
              ) : (
                members.map((member, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{member.name}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 font-medium">{member.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold border px-2.5 py-0.5 rounded-full ${
                          member.status === "Active"
                            ? "text-green-600 bg-green-50 border-green-200"
                            : "text-amber-600 bg-amber-50 border-amber-200"
                        }`}
                      >
                        {member.status === "Active" && <Check size={11} className="stroke-[2.5]" />}
                        {member.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setMemberToRemove(member)}
                        className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline transition-all"
                      >
                        Retirer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-accent">
                  <UserPlus size={16} className="stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Inviter un collaborateur
                </h3>
              </div>
              <button
                disabled={isSubmitting}
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            {isSubmitting ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 size={32} className="text-accent animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Envoi de l&apos;invitation...</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider animate-pulse">
                    Génération des droits RBAC sécurisés
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="p-6 space-y-4">
                {/* Full name */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex. Marc Aubert"
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-accent/15 focus:outline-none placeholder:text-slate-400 text-slate-800"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Email address */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Adresse email *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex. marc.aubert@acme.eu"
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-accent/15 focus:outline-none placeholder:text-slate-400 text-slate-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Role selection */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-700">Rôle RBAC</label>
                  <select
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:ring-2 focus:ring-accent/15 focus:outline-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'OWNER' | 'COMPLIANCE_MANAGER' | 'AUDITOR')}
                  >
                    <option value="COMPLIANCE_MANAGER">COMPLIANCE_MANAGER (Gestionnaire)</option>
                    <option value="AUDITOR">AUDITOR (Auditeur externe)</option>
                    <option value="OWNER">OWNER (Propriétaire d&apos;organisation)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 leading-normal font-semibold mt-1">
                    Les gestionnaires peuvent déclarer des systèmes et générer la documentation. Les auditeurs disposent de droits de lecture et de téléchargement.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-bold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-md shadow-accent/15 transition-all"
                  >
                    Envoyer l&apos;invitation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {memberToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <AlertTriangle size={16} className="stroke-[2.5]" />
                </div>
                <h3 className="text-xs font-extrabold text-red-600 uppercase tracking-wider">
                  Retirer le collaborateur ?
                </h3>
              </div>
              <button
                disabled={isRemoving}
                onClick={() => setMemberToRemove(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            {isRemoving ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 size={32} className="text-red-600 animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">Retrait en cours...</p>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider animate-pulse">
                    Révocation des accès RBAC
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Êtes-vous absolument sûr de vouloir retirer <strong className="text-slate-800">{memberToRemove.name}</strong> ({memberToRemove.email}) de votre organisation ?
                </p>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed bg-slate-50 border border-slate-150 p-2.5 rounded-lg">
                  ⚠️ Cette action est immédiate. Cette personne perdra immédiatement tous ses accès RBAC et ne pourra plus consulter votre registre ComplianceOS.
                </p>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setMemberToRemove(null)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-bold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={executeRemoveMember}
                    className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white rounded-lg text-xs font-bold shadow-md shadow-red-600/15 transition-all"
                  >
                    Confirmer le retrait
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
