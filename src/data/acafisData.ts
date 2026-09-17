import { BureauMember, Activity, ProjectPhase, ServiceItem, DocumentItem, BoutiqueItem, MajorProject } from "../types";
import programmeHiver from "../assets/images/programme-hiver.jpg";
import programmePrintemps from "../assets/images/programme-printemps.jpg";
import programmeEte from "../assets/images/programme-ete.jpg";
import programmeAutomne from "../assets/images/programme-automne.jpg";
import recipiendairesGroupe from "../assets/images/recipiendaires-groupe.jpg";
import espaceJeuneColonie from "../assets/images/espace-jeune-colonie.jpg";

export const BUREAU_MEMBERS: BureauMember[] = [
  {
    id: "moustapha-sane",
    name: "Moustapha Sane",
    role: "Président",
    category: "presidence",
    subCategory: "Présidence Exécutive",
    bio: "Supervise la vision stratégique, les relations institutionnelles Canada-Sénégal et le déploiement des grands projets communautaires.",
    email: "taphasane1910@gmail.com",
    phone: "+1 (514) 250-7209",
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
    email: "abdou.diatta9@gmail.com",
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
    email: "acafisfinance2@gmail.com",
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
    role: "Présidente Commission Féminine",
    category: "commissions",
    subCategory: "Commission Féminine",
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
    id: "centre-communautaire",
    title: "Acquisition d'un Centre Communautaire ACAFIS",
    shortDesc: "Un local bien à nous : centre de formation pour nos jeunes et lieu d'accueil pour les nouveaux arrivants.",
    description: "ACAFIS travaille à l'acquisition d'un local permanent — bien plus qu'un centre de formation pour nos jeunes, un véritable lieu d'accueil où suivre et conseiller les nouveaux arrivants. Un espace de brassage, d'entraide et de culture où se rencontrent toutes les générations de la diaspora.",
    iconName: "Building",
    category: "solidarity",
    deliverables: [
      "Salle de formation & ateliers pour les jeunes (nTIC, soutien scolaire, code)",
      "Bureau d'accueil et de suivi-conseil pour les nouveaux arrivants",
      "Espace de rencontres interculturelles et d'entraide communautaire",
      "Local permanent pour les réunions du Bureau et des commissions",
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
    photo: programmeHiver,
  },
  {
    id: "printemps",
    season: "Printemps (Avril-Juin)",
    title: "Conférences & Ateliers Thématiques",
    subtitle: "Investissement immobilier & Entrepreneuriat",
    description: "Série de talks interactifs animés par des experts sur l'investissement immobilier au Sénégal, l'accès au crédit, la sécurisation foncière, les projets de la Coop-ACAFIS et l'entrepreneuriat de la diaspora.",
    location: "En ligne & Salons d'affaires à Ottawa / Montréal",
    tags: ["Investissement", "Coop-ACAFIS", "Immobilier", "Entrepreneuriat"],
    photo: programmePrintemps,
  },
  {
    id: "ete",
    season: "Été (Juillet-Sept)",
    title: "Grand BBQ & Sorties Plein Air",
    subtitle: "La grande fête estivale des familles",
    description: "Pique-nique familial géant dans un grand parc de Montréal/Ottawa avec grillades, tournoi de football amical, jeux pour enfants, musique traditionnelle et échanges chaleureux entre toutes les générations.",
    location: "Parc Angrignon (Montréal) / Parc de la Gatineau (Ottawa)",
    tags: ["Famille", "Pique-nique", "Jeunesse", "Sport"],
    photo: programmeEte,
  },
  {
    id: "automne",
    season: "Automne (Oct-Déc)",
    title: "Gala de Solidarité ACAFIS",
    subtitle: "Soirée de prestige & Levée de fonds",
    description: "Soirée solennelle de gala rassemblant la communauté, les dignitaires et les partenaires. Levée de fonds pour financer les programmes éducatifs, les projets sociaux et le développement de la Cité Jardin.",
    location: "Grande salle de réception métropolitaine",
    tags: ["Gala", "Levée de fonds", "Cité Jardin", "Partenariats"],
    photo: programmeAutomne,
  },
  {
    id: "reveillon",
    season: "Réveillon (31-Déc)",
    title: "ACAFIS Célébration Fin d'Année 2025",
    subtitle: "Réveillon communautaire — le 31 décembre en famille",
    description: "Notre grande tradition du 31 décembre : toutes les familles ACAFIS réunies pour accueillir la nouvelle année ensemble. Moment fort de la soirée, le jeune qui célèbre ses 18 ans cette année prononce un discours au nom des enfants, pour sa dernière année à recevoir un cadeau — une émotion partagée par toute la communauté.",
    location: "Café le Cheval — 5320 Chem. Queen Mary, Montréal, QC H3X 1T7",
    tags: ["Réveillon", "Famille", "Nouvel An", "Tradition"],
    photo: recipiendairesGroupe,
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

export type AcafisVideoCategory = "temoignage" | "jeunesse" | "education" | "communaute";

export interface AcafisVideo {
  id: string;
  name: string;
  role: string;
  url: string;
  category: AcafisVideoCategory;
  platform?: "facebook" | "youtube";
}

// Real ACAFIS videos, shared publicly on Facebook. Each is dispatched to the
// site page matching its theme via `category`, instead of all living in one place:
// temoignage -> page Témoignages, jeunesse -> page Espace Jeune,
// education -> page Missions & Services, communaute -> page Média.
export const ACAFIS_VIDEOS: AcafisVideo[] = [
  {
    id: "video-1",
    name: "Témoignage d'un membre ACAFIS",
    role: "Membre de la communauté",
    url: "https://www.facebook.com/share/v/1HNVdo48mq/",
    category: "temoignage",
  },
  {
    id: "video-2",
    name: "Naby",
    role: "Jeune de la diaspora",
    url: "https://www.facebook.com/reel/1109297139670569",
    category: "jeunesse",
  },
  {
    id: "video-3",
    name: "Conférence ACAFIS",
    role: "Séance d'information communautaire",
    url: "https://www.facebook.com/share/r/19PK9Vnhod/",
    category: "communaute",
  },
  {
    id: "video-4",
    name: "Landiata Dieme",
    role: "Trésorier Général — Grand BBQ",
    url: "https://www.facebook.com/reel/1320472491816811",
    category: "temoignage",
  },
  {
    id: "video-5",
    name: "Sortie ACAFIS — Super Aqua Club",
    role: "Vidéo souvenir de sortie jeunesse",
    url: "https://www.facebook.com/reel/4760068570760905",
    category: "jeunesse",
  },
  {
    id: "video-6",
    name: "Panel sur l'Éducation",
    role: "Conférence communautaire",
    url: "https://www.facebook.com/share/v/19E6VQiCzA/",
    category: "education",
  },
  {
    id: "video-7",
    name: "Sire Aw",
    role: "Responsable Communication — Intervenant",
    url: "https://www.facebook.com/reel/1241179694066171",
    category: "temoignage",
  },
  {
    id: "video-8",
    name: "Système Scolaire Québécois & Orientations",
    role: "Panel : directions d'école, TES, psychologue, enseignant — Côte-des-Neiges",
    url: "https://www.facebook.com/reel/1124423316680352",
    category: "education",
  },
  {
    id: "video-9",
    name: "Conférence sur l'Intimidation (2011)",
    role: "Intervenant : Moustapha Sane — Modérateur : Ibrahima Diop",
    url: "https://www.youtube.com/watch?v=fLNdkgQUvNc",
    category: "education",
    platform: "youtube",
  },
  {
    id: "video-10",
    name: "Fête du 31 Décembre chez Ngone (Laval) — Partie 1",
    role: "Familles réunies pour la remise des cadeaux aux enfants",
    url: "https://youtu.be/FxnTz2dVKyQ",
    category: "jeunesse",
    platform: "youtube",
  },
  {
    id: "video-11",
    name: "Fête du 31 Décembre chez Ngone (Laval) — Partie 2",
    role: "Suite de la soirée : vœux de bonne année en famille",
    url: "https://youtu.be/ImCiMrF4ioM",
    category: "jeunesse",
    platform: "youtube",
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

// Hommage aux presidents successifs, depuis la fondation.
export const FORMER_PRESIDENTS: FormerPresident[] = [
  { id: "acafis-1", name: "Landiata Dieme", organization: "ACAFIS", years: "Ancien Président" },
  { id: "acafis-2", name: "Ibrahima Diop", organization: "ACAFIS", years: "Ancien Président" },
  { id: "acafis-3", name: "Omar Cisse", organization: "ACAFIS", years: "Ancien Président" },
  { id: "acafis-4", name: "Ibnou Amar Dia", organization: "ACAFIS", years: "Ancien Président" },
  { id: "acafis-5", name: "Moustapha Sane", organization: "ACAFIS", years: "Président actuel" },
  { id: "coop-1", name: "Omar Sarr", organization: "Coop-ACAFIS", years: "Ancien Président" },
  { id: "coop-2", name: "Souleymane Diallo", organization: "Coop-ACAFIS", years: "Ancien Président" },
  { id: "coop-3", name: "Omar Sarr", organization: "Coop-ACAFIS", years: "Président actuel — depuis 2024" },
];

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
  email: "acafisfinance2@gmail.com",
  secretQuestion: "Pays ?",
  secretAnswer: "Senegal",
  annualFeeCAD: 25,
  recipient: "ACAFIS Canada (Trésorerie Générale)",
  memoInstruction: "Indiquez votre Nom, Prénom et mention 'Cotisation 2026' dans la note du virement.",
};

export const PARTNERS_LIST = [
  { name: "Regroupement Général des Sénégalais du Canada (RGSC)", role: "Partenaire Fédérateur" },
  { name: "Arrondissement de Côte-des-Neiges", role: "Partenaire Municipal" },
  { name: "Afroleck", role: "Partenaire Commanditaire" },
];

// Major, multi-year ACAFIS undertakings — each with its own phased roadmap to
// help members understand exactly where things stand and how to get involved,
// the same way the Colonie de Vacances already does.
export const MAJOR_PROJECTS: MajorProject[] = [
  {
    id: "centre-communautaire",
    title: "Acquisition d'un Centre Communautaire ACAFIS",
    tagline: "Un local bien à nous, pour toutes nos activités",
    description: "Aujourd'hui, ACAFIS n'a pas de local permanent : réunions, ateliers et accueil des nouveaux arrivants se font au gré des salles disponibles. L'objectif est d'acquérir un espace fixe qui serve à la fois de centre de formation pour nos jeunes et de lieu d'accueil-conseil pour les nouveaux arrivants — un véritable lieu de brassage, d'entraide et de culture.",
    roadmap: [
      {
        phase: "Étape 1",
        title: "Comité & Cahier des charges",
        period: "À initier",
        status: "upcoming",
        details: [
          "Constituer un comité dédié « Centre Communautaire »",
          "Définir les besoins réels (superficie, activités à héberger, capacité d'accueil)",
          "Chiffrer un budget prévisionnel (achat ou location, aménagement, entretien annuel)",
        ],
      },
      {
        phase: "Étape 2",
        title: "Financement",
        period: "À initier",
        status: "upcoming",
        details: [
          "Lancer une campagne de dons ciblée auprès des membres",
          "Identifier les subventions municipales et provinciales pour organismes communautaires",
          "Explorer des partenariats avec la Coop-ACAFIS ou des mécènes",
        ],
      },
      {
        phase: "Étape 3",
        title: "Repérage & Acquisition",
        period: "À initier",
        status: "upcoming",
        details: [
          "Visiter des locaux disponibles à Montréal (achat ou bail longue durée)",
          "Négocier et signer une entente",
          "Obtenir les permis municipaux nécessaires",
        ],
      },
      {
        phase: "Étape 4",
        title: "Aménagement & Ouverture",
        period: "À initier",
        status: "upcoming",
        details: [
          "Travaux d'aménagement (salle de formation, bureau d'accueil, espace commun)",
          "Recruter et former les bénévoles responsables du lieu",
          "Grande inauguration communautaire",
        ],
      },
    ],
    howToHelp: [
      "Rejoindre le comité Centre Communautaire",
      "Faire un don pour la campagne de financement",
      "Signaler un local disponible à Montréal qui pourrait convenir",
    ],
    cta: { label: "Rejoindre le comité", type: "contact", target: "adhesion" },
  },
  {
    id: "cite-jardin-coop",
    title: "Cité-Jardin ACAFIS & Coop-ACAFIS",
    tagline: "320 logements solidaires à Ndianda, Sénégal",
    description: "Portée par la Coop-ACAFIS (coopérative sœur, fondée en 2014 à Montréal), la Cité-Jardin est un projet d'habitat solidaire pour la diaspora à Ndianda et Mbodiène, près de Mbour au Sénégal — 320 logements sur environ 14 hectares, avec sécurisation foncière et financement bancaire sur 20 ans.",
    roadmap: [
      {
        phase: "2018-2024",
        title: "Fondations légales & foncières",
        period: "Terminé",
        status: "completed",
        details: [
          "Agrément interministériel de l'État du Sénégal obtenu (N° 018485, 2018)",
          "Sécurisation de 14 hectares à Ndianda (10,5 ha) et Mbodiène (3,5 ha)",
          "Reconnaissance légale au Canada (NEQ, Loi sur les compagnies du Québec)",
        ],
      },
      {
        phase: "2025-2027",
        title: "Financement & Construction",
        period: "En cours",
        status: "in_progress",
        details: [
          "Permis de construire et activation du financement bancaire BHS (20 ans)",
          "Lancement du chantier par Ridwan Engineering (conception Studio SAAMS)",
          "48 acquéreurs déjà engagés dans le projet",
        ],
      },
      {
        phase: "2028-2030",
        title: "Livraison des logements",
        period: "À venir",
        status: "upcoming",
        details: [
          "Livraison des premières villas dès 2028",
          "Poursuite de la construction des 6 types de villas (F3 à F6)",
          "Clôture du projet avec les 320 logements livrés d'ici 2030",
        ],
      },
    ],
    howToHelp: [
      "Devenir acquéreur d'une villa à la Cité-Jardin",
      "Investir dans les parts sociales de la Coop-ACAFIS",
      "Suivre l'avancement sur coop-acafis.com",
    ],
    cta: { label: "Découvrir Coop-ACAFIS", type: "external", target: "https://coop-acafis.com" },
  },
  {
    id: "colonie-vacances",
    title: "Colonie de Vacances « Racines & Avenir »",
    tagline: "Immersion mémorielle et technologique pour nos jeunes",
    description: "Un programme d'immersion complet pour les jeunes de la diaspora (10-17 ans), combinant tourisme mémoriel au Sénégal (Gorée, Musée des Civilisations Noires) et ateliers technologiques (code, IA, AgriTech) à la Cité-Jardin de Ndianda.",
    roadmap: COLONIE_ROADMAP,
    howToHelp: [
      "Manifester l'intérêt de votre enfant pour une place",
      "Devenir partenaire éducatif ou mécène de la colonie",
      "Contacter le comité jeunesse pour vous impliquer",
    ],
    cta: { label: "Voir tous les détails", type: "internal", target: "espace-jeune" },
    photo: espaceJeuneColonie,
  },
  {
    id: "equipe-soccer",
    title: "Mise sur Pied d'une Équipe de Soccer Ados",
    tagline: "Le sport comme vecteur de cohésion et de santé pour nos jeunes",
    description: "Structurer une véritable équipe de soccer pour les adolescents de la diaspora (13-17 ans), au-delà des tournois amicaux improvisés lors du Grand BBQ estival — entraînements réguliers, esprit d'équipe et fierté ACAFIS.",
    roadmap: [
      {
        phase: "Étape 1",
        title: "Mobilisation & Recrutement",
        period: "À initier",
        status: "upcoming",
        details: [
          "Sonder l'intérêt des familles pour leurs ados (13-17 ans)",
          "Recruter un entraîneur ou une entraîneuse bénévole",
          "Constituer une première liste de joueurs et joueuses",
        ],
      },
      {
        phase: "Étape 2",
        title: "Structuration",
        period: "À initier",
        status: "upcoming",
        details: [
          "Choisir un format (récréatif ou ligue compétitive locale)",
          "Acquérir l'équipement (maillots, ballons, matériel d'entraînement)",
          "Souscrire les assurances nécessaires",
        ],
      },
      {
        phase: "Étape 3",
        title: "Terrain & Calendrier",
        period: "À initier",
        status: "upcoming",
        details: [
          "Réserver un terrain municipal pour des entraînements réguliers",
          "Établir un calendrier de la saison (entraînements et matchs amicaux)",
        ],
      },
      {
        phase: "Étape 4",
        title: "Lancement",
        period: "À initier",
        status: "upcoming",
        details: [
          "Match inaugural de l'équipe ACAFIS",
          "Intégration au programme jeunesse annuel",
        ],
      },
    ],
    howToHelp: [
      "Devenir entraîneur ou assistant bénévole",
      "Inscrire votre ado (13-17 ans)",
      "Faire don d'équipement sportif",
    ],
    cta: { label: "Manifester mon intérêt", type: "contact", target: "adhesion" },
  },
  {
    id: "projet-culinaire",
    title: "Projet Culinaire ACAFIS",
    tagline: "Transmettre et faire rayonner la cuisine sénégalaise",
    description: "Initié l'an dernier lors de nos soirées communautaires (Ndogou, Grand BBQ), ce projet vise à transmettre les recettes traditionnelles sénégalaises entre générations et, à terme, à en faire rayonner la richesse au-delà de nos membres.",
    roadmap: [
      {
        phase: "Phase 1",
        title: "Lancement",
        period: "2025",
        status: "completed",
        details: [
          "Premiers ateliers culinaires lors des soirées communautaires (Ndogou, BBQ)",
          "Recueil des premières recettes traditionnelles auprès des aînées",
        ],
      },
      {
        phase: "Phase 2",
        title: "Structuration",
        period: "En cours",
        status: "in_progress",
        details: [
          "Mettre en place un calendrier régulier d'ateliers culinaires",
          "Identifier des cheffes et chefs bénévoles pour animer les sessions",
          "Constituer un recueil écrit des recettes partagées",
        ],
      },
      {
        phase: "Phase 3",
        title: "Rayonnement",
        period: "À venir",
        status: "upcoming",
        details: [
          "Envisager un livre de recettes ACAFIS ou un service traiteur solidaire",
          "Ouvrir certains ateliers au grand public pour faire rayonner la culture sénégalaise",
        ],
      },
    ],
    howToHelp: [
      "Partager une recette traditionnelle",
      "Participer aux ateliers culinaires",
      "Devenir cheffe ou chef bénévole animateur",
    ],
    cta: { label: "Partager ma recette", type: "contact", target: "adhesion" },
  },
  {
    id: "foyer-ndianda",
    title: "Foyer Socio-Culturel de Ndianda",
    tagline: "Un lieu de vie communautaire au cœur de la Cité-Jardin",
    description: "Distinct des logements de la Cité-Jardin, ce foyer serait un espace commun à Ndianda dédié aux activités socio-culturelles — pour la communauté locale et pour les familles de la diaspora en visite, dans le même esprit de brassage et d'entraide que le futur Centre Communautaire au Canada.",
    roadmap: [
      {
        phase: "Étape 1",
        title: "Définition du projet",
        period: "À initier",
        status: "upcoming",
        details: [
          "Consulter la communauté locale de Ndianda sur les besoins réels",
          "Définir la vocation du foyer (salle polyvalente, bibliothèque, espace jeunesse)",
        ],
      },
      {
        phase: "Étape 2",
        title: "Partenariat avec Coop-ACAFIS",
        period: "À initier",
        status: "upcoming",
        details: [
          "Identifier un terrain disponible au sein ou à proximité de la Cité-Jardin",
          "Articuler le projet avec le calendrier de développement de la Coop-ACAFIS",
        ],
      },
      {
        phase: "Étape 3",
        title: "Financement",
        period: "À initier",
        status: "upcoming",
        details: [
          "Lancer une collecte de fonds dédiée",
          "Explorer des partenariats avec des institutions culturelles sénégalaises",
        ],
      },
      {
        phase: "Étape 4",
        title: "Construction & Ouverture",
        period: "À initier",
        status: "upcoming",
        details: [
          "Construction du foyer",
          "Programmation des premières activités socio-culturelles",
        ],
      },
    ],
    howToHelp: [
      "Contribuer à la collecte de fonds dédiée",
      "Partager vos idées pour la vocation du foyer",
      "Vous impliquer via le comité Cité-Jardin",
    ],
    cta: { label: "Proposer une idée", type: "contact", target: "adhesion" },
  },
];
