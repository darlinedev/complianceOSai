"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert, Mail, Lock, User, ArrowRight, Loader2, Check } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccess(true);
        // Automatically redirect to login or dashboard after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMessage("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background bioluminescent accents */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Authentication Card */}
      <div className="w-full max-w-[420px] bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl flex flex-col gap-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent text-white shadow-xl shadow-accent/20">
            <ShieldAlert size={26} className="stroke-[2.5]" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Créer votre compte
            </h1>
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mt-1">
              AI ACT COMPLIANCE PORTAL
            </p>
          </div>
        </div>

        {success ? (
          /* Success State */
          <div className="py-6 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check size={24} className="stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Inscription réussie !</h3>
              <p className="text-[11px] text-slate-400 leading-normal px-2">
                Un e-mail de confirmation vous a été envoyé. Vous allez être redirigé vers l&apos;écran de connexion dans quelques instants.
              </p>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSignup} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-[11px] font-semibold text-red-400 leading-normal animate-in shake duration-300">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* Full Name field */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Nom complet
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                  <User size={14} />
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-700 rounded-lg text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Adresse E-mail professionnelle
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jean.dupont@entreprise.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-700 rounded-lg text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Créer un mot de passe
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500">
                  <Lock size={14} />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  minLength={8}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-slate-700 rounded-lg text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/15 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-accent hover:bg-accent-hover disabled:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-accent/15"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <ArrowRight size={14} />
              )}
              {loading ? "Création du compte..." : "Créer mon compte"}
            </button>
          </form>
        )}

        {/* Toggle back to Login */}
        <div className="text-center pt-2 border-t border-slate-800/80 text-[11px] font-medium text-slate-400">
          Vous possédez déjà un compte ?{" "}
          <Link
            href="/login"
            className="font-bold text-accent hover:text-accent-hover transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
