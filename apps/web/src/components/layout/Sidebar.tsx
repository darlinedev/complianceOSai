"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  Cpu,
  FileText,
  Activity,
  Scale,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "GÉNÉRAL",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          name: "Systèmes IA",
          href: "/systems",
          icon: Cpu,
        },
        {
          name: "Documentation",
          href: "/documents",
          icon: FileText,
        },
      ],
    },
    {
      title: "SURVEILLANCE",
      items: [
        {
          name: "Monitoring",
          href: "/alerts",
          icon: Activity,
          badge: 3, // Number of active alerts
        },
        {
          name: "Veille réglementaire",
          href: "/intelligence",
          icon: Scale,
        },
      ],
    },
    {
      title: "COMPTE & SÉCURITÉ",
      items: [
        {
          name: "Facturation",
          href: "/settings/billing",
          icon: CreditCard,
        },
        {
          name: "Paramètres",
          href: "/settings/team",
          icon: Settings,
        },
      ],
    },
  ];

  const bottomItems = [
    {
      name: "Centre d'aide",
      href: "/support",
      icon: HelpCircle,
    },
    {
      name: "Déconnexion",
      href: "/login",
      icon: LogOut,
      className: "text-red-400 hover:text-red-300 hover:bg-red-950/20",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-[240px] bg-brand-dark border-r border-slate-800 text-slate-300 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-white shadow-lg shadow-accent/20">
              <ShieldAlert size={18} className="stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white text-base leading-none tracking-tight">
                ComplianceOS
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                AI ACT PLATFORM
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                {group.title}
              </h3>
              <ul className="space-y-1 mt-2">
                {group.items.map((item, itemIdx) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={itemIdx}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                          active
                            ? "bg-accent text-white shadow-md shadow-accent/15"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            size={18}
                            className={`transition-colors ${
                              active ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span
                            className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
                              active ? "bg-white text-accent" : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/20 space-y-1">
          {bottomItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors ${
                  item.className || ""
                }`}
              >
                <Icon size={18} className="text-slate-500" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
