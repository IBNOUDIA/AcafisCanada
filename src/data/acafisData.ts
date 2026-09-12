import { BureauMember, Activity, ProjectPhase, ServiceItem, DocumentItem, BoutiqueItem } from "../types";

export const BUREAU_MEMBERS: BureauMember[] = [
  {
    id: "moustapha-sane",
    name: "Moustapha Sane",
    role: "Président",
    category: "presidence",
    subCategory: "Présidence Exécutive",
    bio: "Supervise la vision stratégique, les relations institutionnelles Canada-Sénégal et le déploiement des grands projets communautaires.",
    email: "president@acafis.ca",
  },
  {
    id: "omar-cisse",
    name: "Omar Cisse",
    role: "Adjoint (VP)",
    category: "presidence",
    subCategory: "Vice-Présidence",
    bio: "Appuie le Président dans la gouvernance générale et coordonne les comités d'action opérationnelle.",
    email: "vp@acafis.ca",
  },
  {
    id: "ablaye-diatta",
    name: "Ablaye Diatta",
    role: "Secrétaire Général",
    category: "admin_finances",
    subCategory: "Secrétariat",
    bio: "Assure la tenue des registres légaux, les procès-verbaux, les convocations et les correspondances officielles.",
    email: "secretariat@acafis.ca",
  },
  {
    id: "adama-sow",
    name: "Adama Sow",
    role: "Secrétaire Général Adjoint",
    category: "admin_finances",
    subCategory: "Secrétariat",
    bio: "Soutient les fonctions de secrétariat et la gestion administrative quotidienne des membres.",
  },
  {
    id: "landiata-dieme",
    name: "Landiata Dieme",
    role: "Trésorier Général",
    category: "admin_finances",
    subCategory: "Trésorerie",
    bio: "Responsable de la comptabilité générale, des cotisations annuelles et de la gestion budgétaire transparente.",
    email: "finance@acafis.ca",
  },
  {
    id: "pa-sonko",
    name: "Pa Sonko",
    role: "Trésorier Adjoint",
    category: "admin_finances",
    subCategory: "Trésorerie",
    bio: "Assiste la trésorerie générale dans les rapprochements bancaires et le suivi des virements de cotisations.",
  },
  {
    id: "ibrahima-diop",
    name: "Ibrahima Diop",
    role: "Controller",
    category: "admin_finances",
    subCategory: "Contrôle & Support",
    bio: "Veille à la conformité financière, aux audits internes et à l'application rigoureuse des statuts de l'association.",
  },
  {
    id: "ibnou-amar-dia",
    name: "Ibnou Amar Dia",
    role: "Assistant Contrôle & Support",
    category: "admin_finances",
    subCategory: "Contrôle & Support",
    bio: "Soutient les vérifications de conformité et l'assurance qualité des programmes d'ACAFIS Canada.",
  },
  {
    id: "mounirou-dieme",
    name: "Mounirou Dieme",
    role: "Président Com. Organisation",
    category: "commissions",
    subCategory: "Organisation d'Événements",
    bio: "Pilote la logistique des assemblées, des grands barbecues estivaux et des galas annuels de solidarité.",
  },
  {
    id: "ngoma-dhiediou",
    name: "Ngoma Dhiediou",
    role: "Présidente Com. Femme",
    category: "commissions",
    subCategory: "Action Féminine & Famille",
    bio: "Encourage le leadership des femmes de la diaspora, les initiatives d'entraide familiale et de cohésion sociale.",
  },
  {
    id: "sire-aw",
    name: "Sire Aw",
    role: "Responsable Communication",
    category: "communication",
    subCategory: "Communication & Relations Publiques",
    bio: "Gère les canaux numériques, les relations médias, la visibilité de la marque ACAFIS et l'engagement communautaire.",
    email: "communication@acafis.ca",
  },
];

export const SERVICES_MISSIONS: ServiceItem[] = [
  {
    id: "developpement-solidaire",
    title: "Pont Solidaire Diaspora - Sénégal",
    shortDesc: "Canaliser l'énergie et l'épargne de la diaspora pour créer des retombées directes et durables.",
    description: "ACAFIS agit comme une passerelle privilégiée entre le Canada et le Sénégal. Nous transformons la solidarité de la diaspora en projets concrets de santé, d'infrastructures locales et d'échanges culturels mutuels.",
    iconName: "Globe2",
    category: "diaspora",
    deliverables: [
      "Facilitation de projets d'entraide communautaire",
      "Partenariats institutionnels Canada - Sénégal",
      "Renforcement des liens intergénérationnels",
      "Valorisation des expertises de la diaspora",
    ],
  },
  {
    id: "cite-jardin-coop",
    title: "ACAFIS Cité Jardin & Coop-ACAFIS",
    shortDesc: "Accès sécurisé à la propriété foncière éco-responsable et investissement communautaire.",
    description: "Un projet d'habitat solidaire et novateur à Ndianda au Sénégal. Grâce à notre modèle coopératif transparent, les membres de la diaspora investissent en toute confiance dans un cadre de vie durable et respectueux de l'environnement.",
    iconName: "Home",
    category: "habitat",
    deliverables: [
      "Sécurisation juridique des titres fonciers",
      "Lotissement écologique moderne à Ndianda",
      "Mutualisation des coûts de construction",
      "Développement agro-écologique intégré",
    ],
  },
  {
    id: "education-ntic",
    title: "Éducation, Soutien Scolaire & nTIC",
    shortDesc: "Propulser la réussite des enfants de la diaspora avec Le Mentor IA et des ateliers technologiques.",
    description: "La réussite de nos enfants est la priorité absolue. Nous allions soutien académique classique et apprentissage des technologies d'avenir (IA, programmation, robotique) ainsi qu'un ancrage dans nos riches racines culturelles.",
    iconName: "GraduationCap",
    category: "education",
    deliverables: [
      "Plateforme intelligente 'Le Mentor ACAFIS'",
      "Aide aux devoirs et séances de tutorat",
      "Initiation au Code & IA (Python, Scratch)",
      "Orientation académique et bourses d'études",
    ],
  },
  {
    id: "integration-accueil",
    title: "Accueil & Intégration au Canada",
    shortDesc: "Guider et soutenir les nouveaux arrivants pour une installation sereine et épanouie.",
    description: "De l'arrivée à l'aéroport à l'insertion professionnelle, ACAFIS déploie un réseau chaleureux d'entraide pour faciliter le logement, les démarches administratives et le réseautage professionnel des familles et étudiants.",
    iconName: "Users2",
    category: "solidarity",
    deliverables: [
      "Parrainage par des membres chevronnés",
      "Séances d'information administrative et fiscale",
      "Réseautage professionnel et mentorat de carrière",
      "Entraide matérielle et solidarité d'urgence",
    ],
  },
  {
    id: "activites-culturelles",
    title: "Culture, Rassemblements & Mémoire",
    shortDesc: "Faire vivre la Teranga sénégalaise au cœur de la société canadienne.",
    description: "Nous célébrons nos traditions vivantes à travers des rencontres chaleureuses : grandes journées culturelles, pique-niques familiaux, galas de solidarité et projets de transmission mémorielle pour les jeunes.",
    iconName: "Sparkles",
    category: "diaspora",
    deliverables: [
      "Journée annuelle ACAFIS & Assemblée Générale",
      "Grand BBQ estival familial Montréal/Ottawa",
      "Gala caritatif annuel de levée de fonds",
      "Colonie de vacances 'Racines & Avenir'",
    ],
  },
];

export const ANNUAL_PROGRAM: Activity[] = [
  {
    id: "hiver",
    season: "Hiver (Jan-Mars)",
    title: "AG Ordinaire & Journée ACAFIS",
    subtitle: "Rassemblement communautaire & Gouvernance",
    description: "Bilan annuel d'exercice, présentation des états financiers par le Bureau, renouvellement transparent des instances et grande journée culturelle de retrouvailles sous le signe de la fraternité.",
    location: "Montréal, QC (Hybride / Salle communautaire)",
    tags: ["Gouvernance", "Bilan Annuel", "Culture", "Teranga"],
  },
  {
    id: "printemps",
    season: "Printemps (Avril-Juin)",
    title: "Conférences & Ateliers Thématiques",
    subtitle: "Investissement immobilier & Entrepreneuriat",
    description: "Série de talks interactifs animés par des experts sur l'investissement immobilier au Sénégal, l'accès au crédit, la sécurisation foncière, les projets de la Coop-ACAFIS et l'entrepreneuriat de la diaspora.",
    location: "En ligne & Salons d'affaires à Ottawa / Montréal",
    tags: ["Investissement", "Coop-ACAFIS", "Immobilier", "Entrepreneuriat"],
  },
  {
    id: "ete",
    season: "Été (Juillet-Sept)",
    title: "Grand BBQ & Sorties Plein Air",
    subtitle: "La grande fête estivale des familles",
    description: "Pique-nique familial géant dans un grand parc de Montréal/Ottawa avec grillades, tournoi de football amical, jeux pour enfants, musique traditionnelle et échanges chaleureux entre toutes les générations.",
    location: "Parc Angrignon (Montréal) / Parc de la Gatineau (Ottawa)",
    tags: ["Famille", "Pique-nique", "Jeunesse", "Sport"],
  },
  {
    id: "automne",
    season: "Automne (Oct-Déc)",
    title: "Gala de Solidarité ACAFIS",
    subtitle: "Soirée de prestige & Levée de fonds",
    description: "Soirée solennelle de gala rassemblant la communauté, les dignitaires et les partenaires. Levée de fonds pour financer les programmes éducatifs, les projets sociaux et le développement de la Cité Jardin.",
    location: "Grande salle de réception métropolitaine",
    tags: ["Gala", "Levée de fonds", "Cité Jardin", "Partenariats"],
  },
];

export const COLONIE_ROADMAP: ProjectPhase[] = [
  {
    phase: "Phase 1",
    title: "Conception, Cadrage & Partenariats",
    period: "2025 - Début 2026",
    status: "in_progress",
    details: [
      "Constitution du comité de pilotage pédagogique et logistique",
      "Accords de partenariat avec les institutions sénégalaises (Gorée, Musée des Civilisations Noires)",
      "Aménagement des espaces d'accueil et des dortoirs sécurisés à la Cité Jardin Ndianda",
      "Élaboration du protocole d'encadrement biculturel et sécuritaire Canada-Sénégal",
    ],
  },
  {
    phase: "Phase 2",
    title: "Inscriptions & Ateliers Préparatoires",
    period: "2027 - 2029",
    status: "upcoming",
    details: [
      "Ouverture des candidatures pour 50 jeunes de la diaspora (10-17 ans)",
      "Sessions préparatoires à Montréal et Ottawa (histoire, us et coutumes, nTIC)",
      "Levée de fonds et attribution de bourses solidaires pour l'égalité d'accès",
      "Organisation des réservations de vols groupés et assurances internationales",
    ],
  },
  {
    phase: "Phase 3",
    title: "Déploiement de la Colonie 'Racines & Avenir'",
    period: "Été 2030 (3 Semaines d'immersion)",
    status: "upcoming",
    details: [
      "Semaine 1 : Tourisme mémoriel d'exception (Île de Gorée, Maison des Esclaves, Musée des Civilisations Noires de Dakar)",
      "Semaine 2 : Immersion à la Cité Jardin à Ndianda (ateliers AgriTech, écologie et permaculture)",
      "Semaine 3 : Tech Camp nTIC (initiation au code, intelligence artificielle, mini-projets numériques) & soirée de gala de restitution",
    ],
  },
];

export interface VideoTestimonial {
  id: string;
  name: string;
  role: string;
  url: string;
}

// Real member video testimonials, shared publicly on Facebook.
export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "video-1",
    name: "Témoignage d'un membre ACAFIS",
    role: "Membre de la communauté",
    url: "https://www.facebook.com/share/v/1HNVdo48mq/",
  },
  {
    id: "video-2",
    name: "Naby",
    role: "Jeune de la diaspora",
    url: "https://www.facebook.com/reel/1109297139670569",
  },
  {
    id: "video-3",
    name: "Conférence ACAFIS",
    role: "Séance d'information communautaire",
    url: "https://www.facebook.com/share/r/19PK9Vnhod/",
  },
  {
    id: "video-4",
    name: "Landiata Dieme",
    role: "Trésorier Général — Grand BBQ",
    url: "https://www.facebook.com/reel/1320472491816811",
  },
  {
    id: "video-5",
    name: "Sortie ACAFIS — Super Aqua Club",
    role: "Vidéo souvenir de sortie jeunesse",
    url: "https://www.facebook.com/reel/4760068570760905",
  },
  {
    id: "video-6",
    name: "Panel sur l'Éducation",
    role: "Conférence communautaire",
    url: "https://www.facebook.com/share/v/19E6VQiCzA/",
  },
  {
    id: "video-7",
    name: "Sire Aw",
    role: "Responsable Communication — Intervenant",
    url: "https://www.facebook.com/reel/1241179694066171",
  },
];

export interface Recipiendaire {
  id: string;
  name: string;
  year: number;
  quote: string;
}

// Chaque 31 décembre, ACAFIS célèbre ses enfants ; le jeune qui atteint 18 ans
// cette année-là prononce un discours au nom des enfants, pour sa dernière
// année à recevoir un cadeau. Ajoutez ici les vrais récipiendaires au fil du temps.
export const RECIPIENDAIRES: Recipiendaire[] = [];

export interface FormerPresident {
  id: string;
  name: string;
  organization: "ACAFIS" | "Coop-ACAFIS";
  years: string;
  tribute?: string;
}

// Hommage aux presidents successifs, depuis la fondation. A completer avec
// les vrais noms et annees de mandat de chaque organisation.
export const FORMER_PRESIDENTS: FormerPresident[] = [];

export const OFFICIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "statuts",
    title: "Statuts Officiels ACAFIS Canada",
    type: "Document Fondateur (PDF certifié)",
    size: "1.4 Mo",
    description: "Cadre légal régissant l'association, ses objectifs non lucratifs, la composition des instances électives et les droits des membres.",
    contentSummary: [
      "Dénomination, siège social et objet de solidarité internationale",
      "Critères d'adhésion, droits de vote et cotisations statutaires",
      "Pouvoirs du Bureau Exécutif (11 membres) et mandats",
      "Règles de convocation de l'Assemblée Générale annuelle ordinaire",
    ],
  },
  {
    id: "reglement",
    title: "Règlement Intérieur ACAFIS Canada",
    type: "Normes Opérationnelles (PDF certifié)",
    size: "950 Ko",
    description: "Guide pratique d'application des statuts, code de déontologie, gestion des commissions spécialisées et transparence financière.",
    contentSummary: [
      "Modalités pratiques de versement et de gestion des cotisations (25 CAD)",
      "Attribution des rôles au sein des comités (Organisation, Femmes, Tech)",
      "Processus de contrôle financier et audits réguliers",
      "Engagements mutuels lors des événements et de la colonie de vacances",
    ],
  },
];

export const EXTERNAL_LINKS = {
  coopAcafis: "https://coop-acafis.com",
  boutique: "https://boutique-acafis.vercel.app",
};

export const BOUTIQUE_ITEMS: BoutiqueItem[] = [
  {
    id: "tshirt-acafis",
    name: "T-Shirt Officiel ACAFIS Canada",
    priceCAD: 25,
    category: "Vêtements",
    badge: "100% Coton Solidaire",
    description: "T-shirt premium brodé aux couleurs d'ACAFIS Canada. Tous les bénéfices financent les bourses jeunesse.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "casquette-diaspora",
    name: "Casquette Teranga Broderie Or",
    priceCAD: 20,
    category: "Accessoires",
    badge: "Populaire",
    description: "Casquette ajustable haute qualité avec broderie du logo ACAFIS et devise de solidarité.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "artisanat-panier",
    name: "Panier d'Artisanat Casamançais",
    priceCAD: 45,
    category: "Artisanat",
    badge: "Commerce Équitable",
    description: "Vannerie traditionnelle tressée à la main par les coopératives de femmes partenaires au Sénégal.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "mug-mentor",
    name: "Mug 'Acafis Mentor 🎓'",
    priceCAD: 15,
    category: "Accessoires",
    description: "Tasse en céramique pour les passionnés d'études, de code et d'avenir.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80",
  },
];

export const PAYMENT_INTERAC_INFO = {
  email: "finance@acafis.ca",
  secretQuestion: "Pays ?",
  secretAnswer: "Senegal",
  annualFeeCAD: 25,
  recipient: "ACAFIS Canada (Trésorerie Générale)",
  memoInstruction: "Indiquez votre Nom, Prénom et mention 'Cotisation 2026' dans la note du virement.",
};

export const PARTNERS_LIST = [
  { name: "Regroupement Général des Sénégalais du Canada (RGSC)", role: "Partenaire Fédérateur" },
  { name: "Coop-Habitat Ndianda Sénégal", role: "Partenaire Foncier Cité Jardin" },
  { name: "Fédération des Associations de Casamance", role: "Partenaire Culturel" },
  { name: "Club Jeunesse & Tech Diaspora", role: "Partenaire Éducatif" },
  { name: "Chambre de Commerce Canada-Afrique", role: "Partenaire Économique" },
];
