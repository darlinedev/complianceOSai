import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ComplianceOS — Plateforme de conformité AI Act",
  description: "Cartographiez vos systèmes IA, qualifiez leur niveau de risque, produisez la documentation technique requise par l'Art. 11 de l'AI Act et détectez les dérives.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body className="font-sans text-slate-900 bg-surface min-h-screen">
        {children}
      </body>
    </html>
  );
}
