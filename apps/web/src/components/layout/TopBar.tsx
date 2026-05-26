"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, Search, Menu, User, ShieldCheck, ChevronDown } from "lucide-react";
import { demoAlerts } from "@/lib/demo-data";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuOpen?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, subtitle, onMenuOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Active alerts count
  const activeAlerts = demoAlerts.filter(a => a.status === "OPEN" && a.severity === "CRITICAL");

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200">
      {/* Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        {onMenuOpen && (
          <button
            onClick={onMenuOpen}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-900 md:text-xl leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 hidden md:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-4">
        {/* Search Bar - Desktop */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-slate-400 text-slate-800"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[9px] font-medium text-slate-400">
            ⌘K
          </kbd>
        </div>

        {/* Banner Mode Démo Indicator (when appropriate) */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Mode Démo
        </div>

        {/* Notifications Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors relative"
          >
            <Bell size={18} />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-40 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Notifications critiques</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                    {activeAlerts.length}
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {activeAlerts.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-400">
                      Aucune notification critique en attente.
                    </div>
                  ) : (
                    activeAlerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex flex-col gap-1 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                            {alert.systemName || "RÉGLEMENTATION"}
                          </span>
                          <span className="text-[9px] text-slate-400">À l&apos;instant</span>
                        </div>
                        <span className="font-semibold text-xs text-slate-800 line-clamp-1">
                          {alert.title}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {alert.body}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-center">
                  <Link
                    href="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-accent hover:text-accent-hover"
                  >
                    Voir toutes les alertes
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 border border-slate-300 font-bold text-xs text-slate-700">
              JD
            </div>
            <div className="hidden md:flex flex-col items-start text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                Jean DPO
              </span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-wider">
                COMPLIANCE MGR
              </span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40">
                <div className="px-4 py-2 border-b border-slate-100 flex flex-col">
                  <span className="font-bold text-sm text-slate-900">Jean DPO</span>
                  <span className="text-xs text-slate-500">jean.dpo@acme.eu</span>
                </div>
                <div className="py-1">
                  <Link
                    href="/settings/team"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <User size={14} className="text-slate-400" />
                    Mon Profil
                  </Link>
                  <Link
                    href="/settings/billing"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <ShieldCheck size={14} className="text-slate-400" />
                    ACME Corp (STARTER)
                  </Link>
                </div>
                <div className="border-t border-slate-100 pt-1 mt-1">
                  <Link
                    href="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Déconnexion
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default TopBar;
