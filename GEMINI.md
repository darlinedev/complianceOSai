# 🛡️ ComplianceOS — Fiche de Synthèse & Documentation Projet

Ce document sert de guide de référence complet pour **ComplianceOS**, la plateforme SaaS de référence pour la conformité à l'**AI Act européen**. Il récapitule les objectifs de l'application, les fonctionnalités implémentées, la structure technique du code, les choix de design esthétique et fournit des directives détaillées pour guider un futur modèle d'IA dans le développement des prochaines étapes.

---

## 📖 1. Ce que fait l'application

**ComplianceOS** est un SaaS multi-tenant conçu pour aider les DPO (Data Protection Officers), les responsables juridiques et les ingénieurs IA à mettre leurs systèmes en conformité avec l'AI Act de l'Union Européenne (obligations progressives de 2025 à 2026).

La plateforme résout quatre défis critiques :
1. **Cartographie du Parc IA** : Déclarer et qualifier le niveau de risque des systèmes IA (Minimal, Limited, High, Unacceptable).
2. **Génération Documentaire (Article 11)** : Produire la documentation technique obligatoire pour les systèmes à haut risque sous la forme d'un dossier structuré en 8 chapitres.
3. **Monitoring continu & Surveillance** : Suivre les performances des modèles, détecter la dérive des données (Data Drift) et lever des alertes de non-conformité.
4. **Gouvernance & Administration** : Administrer les collaborateurs (RBAC) et suivre la facturation ainsi que les quotas d'audit.

---

## 🛠️ 2. Fonctionnalités Implémentées

### 📊 Page 1 : Le Tableau de Bord Global (`/dashboard`)
* **KPIs Directs** : Nombre de modèles qualifiés, score moyen de conformité du parc, statut des alertes actives.
* **Graphiques Statistiques** : Répartition des systèmes par niveau de risque et progression de la conformité globale.
* **Flux d'Alertes en direct** : Visualisation chronologique des dérives détectées sur les modèles de production.

### 🗂️ Page 2 : Le Registre des Systèmes IA (`/systems`)
* **Filtres par Piles Interactives** : Filtrage instantané des systèmes par niveau de risque (`HIGH` | `LIMITED` | `MINIMAL`) ou par statut de conformité.
* **Barre de Recherche Dynamique** : Recherche textuelle instantanée par nom ou par description de modèle.
* **Barre de Progression de Conformité** : Rendu dynamique coloré (Rouge < 50%, Orange 50-75%, Vert > 75%).
* **Modal "Déclarer un système"** : Formulaire guidé pour intégrer de nouveaux modèles dans le registre.

### 🔬 Page 3 : Fiche Détail du Système IA (`/systems/[id]`)
* **Jauge Circulaire de Conformité SVG** : SVG circulaire dynamique adaptant sa couleur selon le score de conformité.
* **4 Onglets Interactifs** :
  1. **Vue d'ensemble** : Carte d'identité technique, Gaps prioritaires et journal des alertes.
  2. **Documentation (Art. 11)** : Accordéons interactifs pour les 8 chapitres officiels. Intègre un **Simulateur d'Agent IA de rédaction** avec spinner et étapes textuelles dynamiques (versioning passant de `v1.2` à `v1.3` lors du succès).
  3. **Surveillance & Dérives (Monitoring)** : Graphique temporel interactif de Data Drift sur 30 jours conçu avec **Recharts** (tooltips soignés et survol fluide).
  4. **Historique des Audits** : Tableau des audits automatiques et manuels menés sur ce système d'IA avec leurs scores et liens de téléchargement.

### 👥 Page 4 : Paramètres d'Équipe (`/settings/team`)
* **Modale d'Invitation Collaborateur** : Fenêtre modale centrée avec effet de floutage d'arrière-plan, sélecteur de rôle RBAC, spinner de chargement et insertion dynamique instantanée dans la grille.
* **Modale de Retrait Collaborateur** : Modale d'alerte personnalisée rouge décrivant les conséquences de la révocation des accès RBAC, remplaçant les popups `confirm()` génériques du navigateur pour préserver la sécurité et l'esthétique.

### 💳 Page 5 : Abonnement & Facturation (`/settings/billing`)
* **Changement de Plan Dynamique** : Sélection entre les plans *Gratuit*, *Starter* (149 €/mois) et *Professional* (490 €/mois) mettant instantanément à jour la carte d'abonnement principale, les quotas de systèmes et l'état des grilles tarifaires.
* **Devis Enterprise** : Modale de contact préremplie avec le profil utilisateur et l'organisation, qualifiant le volume et les besoins en hébergement VPC/Souverain.
* **Simulateur de Portail Client Stripe Connect** :
  - **Moyen de paiement** : Affiche les informations de carte de crédit actives.
  - **Éditeur de Carte Bancaire Stateful** : Saisie de carte avec validation, formatteurs automatiques de numéros et d'expiration, et **détection automatique de la marque de carte** (commençant par `4` -> VISA, `5` -> MASTERCARD, `3` -> AMEX).
  - **Historique des Factures interactif** : Clique sur une ligne de facture pour ouvrir la **modale d'aperçu de reçu** calculant automatiquement le prix HT, le taux de TVA à 20,0 % et affichant le mode de règlement actif.
  - **Téléchargement physique** : Bouton de téléchargement générant un véritable fichier texte structuré (`facture-ACME-XXXXX.txt`) sur le disque de l'utilisateur.
  - **Impression** : Bouton d'impression exploitant `window.print()`.

---

## 📁 3. Structure des Fichiers (SaaS Web app)

L'application Next.js est structurée de manière modulaire au sein de notre monorepo :

```text
apps/web/src/
├── app/
│   ├── (app)/
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Tableau de bord global
│   │   ├── systems/
│   │   │   ├── page.tsx           # Registre des systèmes
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx       # Onglets : Overview, Doc, Drift & Audits
│   │   │   └── new/
│   │   │       └── page.tsx       # Formulaire de déclaration (Optionnel/Modal)
│   │   ├── settings/
│   │   │   ├── team/
│   │   │   │   └── page.tsx       # Gestion RBAC des membres, invitations & suppressions
│   │   │   └── billing/
│   │   │       └── page.tsx       # Tarification, Devis, Portail Stripe, Reçus & Édition CB
│   │   ├── alerts/
│   │   │   └── page.tsx           # Journal complet des alertes de non-conformité
│   │   ├── intelligence/
│   │   │   ├── page.tsx           # Veille réglementaire (AI Act, RGPD, NIS2)
│   │   │   └── chat/
│   │   │       └── page.tsx       # Chat interactif avec l'agent juridique
│   │   └── layout.tsx             # Barre latérale (Sidebar) et Layout d'application connecté
│   ├── layout.tsx                 # Layout racine HTML5, Polices Inter, Outfit
│   └── globals.css                # Variables CSS & Design tokens Skylab Digital
```

---

## 💎 4. Technologies Utilisées

* **Core Framework** : Next.js 14.2 (App Router) + React 18
* **Langage & Typage** : TypeScript (Strict Mode, zéro `any` résiduel pour garantir la stabilité de production)
* **Styling (CSS)** : Tailwind CSS v3 (utilisé pour les transitions fluides, les flous d'arrière-plan `backdrop-blur-sm` et les animations `animate-in`)
* **Librairie d'icônes** : Lucide React (CreditCard, Check, Printer, FileText, Loader2, UserPlus, etc.)
* **Visualisation de Données (Dataviz)** : Recharts (LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer)
* **Monorepo Manager** : pnpm

---

## 🎨 5. Décisions de Design (Charte *Skylab Digital* / *Vapor Clinic*)

* **Palette Chromatique** :
  - *Fonds & Conteneurs* : Nuances de gris ultra-propres et lumineuses (`bg-slate-50`, `bg-white`) contrastant avec des panels foncés premium pour le portail Stripe (`bg-slate-950`, `border-slate-800`).
  - *Couleurs Accent* : Bleu cobalt moderne (`text-accent`, `bg-accent` : `#2563eb`), vert émeraude pour la conformité et le succès, orange ambre pour les avertissements, rouge écarlate pour le niveau critique.
* **Typographie** : Combinaison de la police système moderne **Inter** pour les lectures fluides et **Outfit** pour les en-têtes et badges RBAC en majuscules avec espacement étendu (`tracking-wider`).
* **Interactions & Micro-Animations** :
  - Effets de survol (`hover:bg-slate-50`, `transition-all`) et états désactivés semi-transparents.
  - Fenêtres modales dotées de transitions fluides d'apparition (`animate-in fade-in zoom-in-95 duration-200`) et de flous de fond (`backdrop-blur-sm`).

---

## 🤖 6. Instructions pour un futur modèle d'IA

Si vous êtes un modèle d'IA reprenant le développement de ComplianceOS, lisez attentivement ces instructions pour maintenir la qualité et la continuité du projet :

### 🚨 Règle d'Or : Préservation de l'Élégance Visuelle (Skylab Digital)
Ne dégradez pas le design actuel. Tout nouveau composant doit utiliser des bordures fines (`border-slate-200/slate-100`), des typographies en majuscules semi-grasses pour les petits libellés (`text-[10px] font-extrabold text-slate-400 uppercase tracking-wider`) et des états d'interaction soignés.

### 📄 Étape Suivante Prioritaire : La Fiche Document (`/dashboard/documents/[id]`)
Le projet requiert le développement de la page de prévisualisation des documents d'audit avec un **Split-Screen Interactif** :
1. **Partie Gauche (Preview PDF)** : Affichage d'une liseuse de document technique (simulant l'Article 11) avec possibilité de zoomer, de naviguer entre les pages et de rechercher du texte.
2. **Partie Droite (Analyse de Conformité)** :
   - Flux d'audit mené par agent IA qui scanne les sections et surligne les failles juridiques détectées.
   - Système de commentaires collaboratifs permettant d'assigner des tâches de correction aux collaborateurs (ex: *"Jean DPO, veuillez compléter la section 3 sur les données d'entraînement"*).

### 🛠️ Directives de Code TypeScript :
* **Pas de `any`** : Déclarez des types ou des interfaces strictes pour chaque structure de données manipulée.
* **Résilience SSR** : Les graphiques interactifs (Recharts) ou les composants s'appuyant sur des APIs du navigateur doivent utiliser un état de montage (`mounted`) pour éviter les erreurs d'hydratation Next.js.
* **Fichiers annexes** : Évitez d'utiliser des template strings multilignes trop complexes ou contenant des commentaires imbriqués dans les déclarations de fonctions du corps des composants pour ne pas perturber les expressions SWC. Déclarez les tableaux statiques en dehors de la fonction ou joignez-les via un tableau de chaînes `.join("\n")`.
