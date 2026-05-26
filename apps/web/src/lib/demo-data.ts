export interface AISystem {
  id: string;
  name: string;
  description: string;
  riskLevel: 'HIGH' | 'LIMITED' | 'MINIMAL' | 'PROHIBITED';
  annexReference?: string;
  useCase: string;
  dataTypes: string[];
  modelProvider: string;
  modelName: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLIANT' | 'NON_COMPLIANT' | 'ARCHIVED';
  complianceScore: number;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  systemId?: string;
  systemName?: string;
  type: 'DATA_DRIFT' | 'PERFORMANCE_DEGRADATION' | 'COMPLIANCE_VIOLATION' | 'REGULATORY_UPDATE';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  body: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
  createdAt: string;
}

export interface RegulatoryUpdate {
  id: string;
  source: string;
  jurisdiction: string;
  publishedAt: string;
  title: string;
  summary: string;
  tags: string[];
}

export const demoSystems: AISystem[] = [
  {
    id: "scoring-credit",
    name: "Scoring Crédit Automatisé",
    description: "Évaluation automatique de la solvabilité des demandeurs de crédit à la consommation.",
    riskLevel: "HIGH",
    annexReference: "Annexe III §5",
    useCase: "Scoring de crédit",
    dataTypes: ["Données financières", "Données personnelles"],
    modelProvider: "Interne",
    modelName: "CreditClassifier XGBoost",
    status: "NON_COMPLIANT",
    complianceScore: 45,
    ownerName: "Marc Aubert",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-05-07T14:30:00Z"
  },
  {
    id: "chatbot-support",
    name: "Chatbot Support Client",
    description: "Assistant virtuel conversationnel pour l'aide et le support client de premier niveau.",
    riskLevel: "LIMITED",
    annexReference: "Art. 50 (Transparence)",
    useCase: "Support client",
    dataTypes: ["Logs de conversation", "Données personnelles"],
    modelProvider: "Anthropic",
    modelName: "Claude 3.5 Sonnet",
    status: "COMPLIANT",
    complianceScore: 78,
    ownerName: "Elena Rostova",
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-04-15T11:00:00Z"
  },
  {
    id: "detection-fraude",
    name: "Détection de Fraude",
    description: "Analyse comportementale en temps réel pour détecter les transactions frauduleuses.",
    riskLevel: "HIGH",
    annexReference: "Annexe III §5",
    useCase: "Sécurité financière",
    dataTypes: ["Données financières", "Localisation"],
    modelProvider: "Interne",
    modelName: "AnomalyNet Autoencoder",
    status: "IN_PROGRESS",
    complianceScore: 62,
    ownerName: "Jean DPO",
    createdAt: "2026-03-01T10:00:00Z",
    updatedAt: "2026-04-20T10:00:00Z"
  },
  {
    id: "recommandation-produit",
    name: "Recommandation Produit",
    description: "Moteur de recommandation e-commerce basé sur l'historique d'achat.",
    riskLevel: "MINIMAL",
    useCase: "Recommandation d'achats",
    dataTypes: ["Historique d'achat", "Données personnelles"],
    modelProvider: "Interne",
    modelName: "Collaborative Filter v2",
    status: "COMPLIANT",
    complianceScore: 91,
    ownerName: "Antoine Dubois",
    createdAt: "2025-12-01T08:00:00Z",
    updatedAt: "2026-05-01T15:00:00Z"
  },
  {
    id: "analyse-rh",
    name: "Analyse RH Prédictive",
    description: "Modèle prédictif d'attrition et d'aide au recrutement interne.",
    riskLevel: "HIGH",
    annexReference: "Annexe III §4",
    useCase: "Ressources Humaines",
    dataTypes: ["Données RH", "Données personnelles"],
    modelProvider: "OpenAI",
    modelName: "GPT-4o fine-tuned",
    status: "NON_COMPLIANT",
    complianceScore: 23,
    ownerName: "Sarah Connor",
    createdAt: "2026-01-20T08:00:00Z",
    updatedAt: "2026-04-28T09:00:00Z"
  }
];

export const demoAlerts: Alert[] = [
  {
    id: "alert-1",
    systemId: "talent-screen",
    systemName: "TalentScreen AI",
    type: "DATA_DRIFT",
    severity: "CRITICAL",
    title: "Distribution candidats EN/FR a dérivé de 23 % sur 14 jours",
    body: "La proportion de CV en anglais analysée par le modèle a augmenté de manière anormale, modifiant la performance du tri sur les critères linguistiques.",
    status: "OPEN",
    createdAt: "2026-05-25T14:12:00Z"
  },
  {
    id: "alert-2",
    systemId: "ad-genius",
    systemName: "AdGenius Personalize",
    type: "COMPLIANCE_VIOLATION",
    severity: "CRITICAL",
    title: "Section 'analyse des biais' manquante dans la doc Art. 11",
    body: "L'obligation réglementaire de l'Art. 11 de l'AI Act impose une documentation sur la prévention des biais. Cette section est actuellement non remplie.",
    status: "OPEN",
    createdAt: "2026-05-24T18:05:00Z"
  },
  {
    id: "alert-3",
    systemId: "credit-decision",
    systemName: "CreditDecision Pro",
    type: "PERFORMANCE_DEGRADATION",
    severity: "WARNING",
    title: "AUC passé de 0.91 à 0.83 ce trimestre",
    body: "L'aire sous la courbe ROC (AUC) du modèle de scoring a subi une baisse significative, indiquant une perte de précision sur la détection des profils solvables.",
    status: "OPEN",
    createdAt: "2026-05-23T09:30:00Z"
  },
  {
    id: "alert-4",
    systemId: "support-bot",
    systemName: "SupportBot Atlas",
    type: "DATA_DRIFT",
    severity: "WARNING",
    title: "+18 % conversations multilingues non couvertes",
    body: "Hausse marquée des sollicitations clients en espagnol et italien. Le modèle n'a pas été formellement validé sur la conformité de ces langues.",
    status: "OPEN",
    createdAt: "2026-05-22T16:40:00Z"
  },
  {
    id: "alert-5",
    systemId: "talent-screen",
    systemName: "TalentScreen AI",
    type: "COMPLIANCE_VIOLATION",
    severity: "WARNING",
    title: "Analyse de biais non revue depuis 94 jours",
    body: "L'évaluation périodique des biais algorithmiques sur le tri des candidatures aurait dû être renouvelée sous 90 jours (obligation interne DPO).",
    status: "OPEN",
    createdAt: "2026-05-20T10:15:00Z"
  },
  {
    id: "alert-6",
    type: "REGULATORY_UPDATE",
    severity: "INFO",
    title: "Décret d'application AI Act publié le 12 mai 2026",
    body: "Le Journal Officiel de l'Union Européenne a publié les précisions concernant les sanctions applicables aux systèmes à haut risque non déclarés.",
    status: "OPEN",
    createdAt: "2026-05-12T08:00:00Z"
  },
  {
    id: "alert-7",
    type: "REGULATORY_UPDATE",
    severity: "INFO",
    title: "Lignes directrices CNIL sur l'IA générative mises à jour",
    body: "La CNIL a partagé ses nouvelles recommandations concernant l'entraînement des modèles de fondation sur des données personnelles.",
    status: "OPEN",
    createdAt: "2026-05-08T14:30:00Z"
  },
  {
    id: "alert-8",
    systemId: "mail-guard",
    systemName: "MailGuard Filter",
    type: "PERFORMANCE_DEGRADATION",
    severity: "INFO",
    title: "+2.1 % faux positifs sur 30 jours",
    body: "Légère augmentation des emails légitimes classés comme spams par le modèle Naive Bayes. Aucune action immédiate requise.",
    status: "RESOLVED",
    createdAt: "2026-05-02T11:00:00Z"
  }
];

export const demoRegulatoryUpdates: RegulatoryUpdate[] = [
  {
    id: "reg-1",
    source: "Journal Officiel de l'UE",
    jurisdiction: "Union Européenne",
    publishedAt: "12 mai 2026",
    title: "Décret d'application de l'AI Act concernant l'Annexe III",
    summary: "Publication des fiches méthodologiques et guides de cadrage pour la classification des systèmes à haut risque dans les domaines RH et Éducation.",
    tags: ["AI Act", "Haut Risque", "Obligations"]
  },
  {
    id: "reg-2",
    source: "CNIL",
    jurisdiction: "France",
    publishedAt: "8 mai 2026",
    title: "Recommandations d'usage pour l'IA générative en entreprise",
    summary: "Règles sur le respect du RGPD, la gestion du consentement lors du fine-tuning de modèles, et la sécurisation des prompts contenant des PII.",
    tags: ["RGPD", "CNIL", "Generative AI"]
  },
  {
    id: "reg-3",
    source: "CEPD (EDPB)",
    jurisdiction: "Europe",
    publishedAt: "28 avril 2026",
    title: "Lignes directrices sur la transparence algorithmique (Art. 50)",
    summary: "Clarification des exigences d'affichage et d'information de l'utilisateur final en cas d'interaction avec une intelligence artificielle.",
    tags: ["CEPD", "Transparence", "Art. 50"]
  }
];

export const complianceHistory30Days = [
  { day: "01", score: 71 },
  { day: "03", score: 71 },
  { day: "05", score: 70 },
  { day: "07", score: 72 },
  { day: "09", score: 72 },
  { day: "11", score: 74 },
  { day: "13", score: 73 },
  { day: "15", score: 73 },
  { day: "17", score: 75 },
  { day: "19", score: 75 },
  { day: "21", score: 74 },
  { day: "23", score: 76 },
  { day: "25", score: 76 }
];
