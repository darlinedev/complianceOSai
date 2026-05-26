"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Map route pathnames to descriptive titles and subtitles
  const getHeaderInfo = (path: string) => {
    if (path === "/dashboard" || path === "/") {
      return {
        title: "Dashboard",
        subtitle: "Suivi, analyse et score de conformité de votre parc d'IA",
      };
    }
    if (path.startsWith("/systems")) {
      if (path === "/systems/new") {
        return {
          title: "Déclarer un système IA",
          subtitle: "Qualification guidée du niveau de risque et de conformité",
        };
      }
      return {
        title: "Systèmes IA",
        subtitle: "Cartographie et classification des risques réglementaires",
      };
    }
    if (path.startsWith("/documents")) {
      return {
        title: "Documentation Art. 11",
        subtitle: "Génération automatique et édition de fiches de conformité",
      };
    }
    if (path.startsWith("/alerts")) {
      return {
        title: "Monitoring & Alertes",
        subtitle: "Détection en continu des dérives et anomalies de performance",
      };
    }
    if (path.startsWith("/intelligence")) {
      return {
        title: "Veille Réglementaire",
        subtitle: "Suivi en temps réel des textes officiels de l'AI Act et RGPD",
      };
    }
    if (path.startsWith("/settings/billing")) {
      return {
        title: "Facturation",
        subtitle: "Gestion de votre abonnement SaaS et sièges de l'organisation",
      };
    }
    if (path.startsWith("/settings/team")) {
      return {
        title: "Paramètres d'équipe",
        subtitle: "Gestion des utilisateurs, des rôles RBAC et des invitations",
      };
    }
    return {
      title: "ComplianceOS",
      subtitle: "Conformité réglementaire européenne simplifiée par IA",
    };
  };

  const headerInfo = getHeaderInfo(pathname);

  return (
    <div className="min-h-screen bg-surface">
      {/* Sidebar for navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-col lg:pl-[240px] min-h-screen">
        {/* TopBar for notifications and search */}
        <TopBar
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          onMenuOpen={() => setSidebarOpen(true)}
        />

        {/* Primary Page Canvas */}
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
