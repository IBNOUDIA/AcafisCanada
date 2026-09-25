import { BureauMember, Activity, ProjectPhase, ServiceItem, DocumentItem, BoutiqueItem, MajorProject, Localized } from "../types";
import programmeHiver from "../assets/images/programme-hiver.jpg";
import programmePrintemps from "../assets/images/programme-printemps.jpg";
import programmeEte from "../assets/images/programme-ete.jpg";
import programmeAutomne from "../assets/images/programme-automne.jpg";
import recipiendairesGroupe from "../assets/images/recipiendaires-groupe.jpg";
import espaceJeuneColonie from "../assets/images/espace-jeune-colonie.jpg";
import partnerRgsc from "../assets/images/partner-rgsc.png";
import partnerAfroleck from "../assets/images/partner-afroleck.png";
import partnerCdnNdg from "../assets/images/partner-cdn-ndg.jpg";

const L = (fr: string, en: string): Localized => ({ fr, en });
const LA = (fr: string[], en: string[]): Localized<string[]> => ({ fr, en });

export const BUREAU_MEMBERS: BureauMember[] = [
  {
    id: "moustapha-sane",
    name: "Moustapha Sane",
    role: L("Président", "President"),
    category: "presidence",
    subCategory: L("Présidence Exécutive", "Executive Presidency"),
    bio: L(
      "Supervise la vision stratégique, les relations institutionnelles Canada-Sénégal et le déploiement des grands projets communautaires.",
      "Oversees the strategic vision, Canada-Senegal institutional relations, and the rollout of major community projects."
    ),
    email: "taphasane1910@gmail.com",
    phone: "+1 (514) 250-7209",
  },
  {
    id: "omar-cisse",
    name: "Omar Cisse",
    role: L("Adjoint (VP)", "Deputy (VP)"),
    category: "presidence",
    subCategory: L("Vice-Présidence", "Vice-Presidency"),
    bio: L(
      "Appuie le Président dans la gouvernance générale et coordonne les comités d'action opérationnelle.",
      "Supports the President in overall governance and coordinates operational action committees."
    ),
    email: "vp@acafis.ca",
  },
  {
    id: "ablaye-diatta",
    name: "Ablaye Diatta",
    role: L("Secrétaire Général", "Secretary General"),
    category: "admin_finances",
    subCategory: L("Secrétariat", "Secretariat"),
    bio: L(
      "Assure la tenue des registres légaux, les procès-verbaux, les convocations et les correspondances officielles.",
      "Maintains legal records, meeting minutes, notices of meeting, and official correspondence."
    ),
    email: "abdou.diatta9@gmail.com",
  },
  {
    id: "adama-sow",
    name: "Adama Sow",
    role: L("Secrétaire Général Adjoint", "Deputy Secretary General"),
    category: "admin_finances",
    subCategory: L("Secrétariat", "Secretariat"),
    bio: L(
      "Soutient les fonctions de secrétariat et la gestion administrative quotidienne des membres.",
      "Supports secretarial functions and the day-to-day administrative management of members."
    ),
  },
  {
    id: "landiata-dieme",
    name: "Landiata Dieme",
    role: L("Trésorier Général", "Treasurer General"),
    category: "admin_finances",
    subCategory: L("Trésorerie", "Treasury"),
    bio: L(
      "Responsable de la comptabilité générale, des cotisations annuelles et de la gestion budgétaire transparente.",
      "Responsible for general accounting, annual membership fees, and transparent budget management."
    ),
    email: "acafisfinance2@gmail.com",
  },
  {
    id: "pa-sonko",
    name: "Pa Sonko",
    role: L("Trésorier Adjoint", "Deputy Treasurer"),
    category: "admin_finances",
    subCategory: L("Trésorerie", "Treasury"),
    bio: L(
      "Assiste la trésorerie générale dans les rapprochements bancaires et le suivi des virements de cotisations.",
      "Assists the treasury general with bank reconciliations and tracking membership fee transfers."
    ),
  },
  {
    id: "ibrahima-diop",
    name: "Ibrahima Diop",
    role: L("Controller", "Controller"),
    category: "admin_finances",
    subCategory: L("Contrôle & Support", "Control & Support"),
    bio: L(
      "Veille à la conformité financière, aux audits internes et à l'application rigoureuse des statuts de l'association.",
      "Oversees financial compliance, internal audits, and rigorous enforcement of the association's bylaws."
    ),
  },
  {
    id: "ibnou-amar-dia",
    name: "Ibnou Amar Dia",
    role: L("Assistant Contrôle & Support", "Control & Support Assistant"),
    category: "admin_finances",
    subCategory: L("Contrôle & Support", "Control & Support"),
    bio: L(
      "Soutient les vérifications de conformité et l'assurance qualité des programmes d'ACAFIS Canada.",
      "Supports compliance reviews and quality assurance of ACAFIS Canada's programs."
    ),
  },
  {
    id: "mounirou-dieme",
    name: "Mounirou Dieme",
    role: L("Président Com. Organisation", "Organization Committee Chair"),
    category: "commissions",
    subCategory: L("Organisation d'Événements", "Event Organization"),
    bio: L(
      "Pilote la logistique des assemblées, des grands barbecues estivaux et des galas annuels de solidarité.",
      "Leads the logistics of assemblies, summer barbecues, and annual solidarity galas."
    ),
  },
  {
    id: "ngoma-dhiediou",
    name: "Ngoma Dhiediou",
    role: L("Présidente Commission Féminine", "Chair, Women's Commission"),
    category: "commissions",
    subCategory: L("Commission Féminine", "Women's Commission"),
    bio: L(
      "Encourage le leadership des femmes de la diaspora, les initiatives d'entraide familiale et de cohésion sociale.",
      "Encourages leadership among diaspora women, family mutual-aid initiatives, and social cohesion."
    ),
  },
  {
    id: "sire-aw",
    name: "Sire Aw",
    role: L("Responsable Communication", "Communications Officer"),
    category: "communication",
    subCategory: L("Communication & Relations Publiques", "Communications & Public Relations"),
    bio: L(
      "Gère les canaux numériques, les relations médias, la visibilité de la marque ACAFIS et l'engagement communautaire.",
      "Manages digital channels, media relations, the ACAFIS brand's visibility, and community engagement."
    ),
    email: "communication@acafis.ca",
  },
];

export const SERVICES_MISSIONS: ServiceItem[] = [
  {
    id: "developpement-solidaire",
    title: L("Pont Solidaire Diaspora - Sénégal", "Diaspora-Senegal Solidarity Bridge"),
    shortDesc: L(
      "Canaliser l'énergie et l'épargne de la diaspora pour créer des retombées directes et durables.",
      "Channeling the diaspora's energy and savings to create direct, lasting impact."
    ),
    description: L(
      "ACAFIS agit comme une passerelle privilégiée entre le Canada et le Sénégal. Nous transformons la solidarité de la diaspora en projets concrets de santé, d'infrastructures locales et d'échanges culturels mutuels.",
      "ACAFIS acts as a privileged bridge between Canada and Senegal. We turn the diaspora's solidarity into concrete health projects, local infrastructure, and mutual cultural exchange."
    ),
    iconName: "Globe2",
    category: "diaspora",
    deliverables: LA(
      [
        "Facilitation de projets d'entraide communautaire",
        "Partenariats institutionnels Canada - Sénégal",
        "Renforcement des liens intergénérationnels",
        "Valorisation des expertises de la diaspora",
      ],
      [
        "Facilitating community mutual-aid projects",
        "Canada-Senegal institutional partnerships",
        "Strengthening intergenerational ties",
        "Showcasing diaspora expertise",
      ]
    ),
  },
  {
    id: "cite-jardin-coop",
    title: L("ACAFIS Cité Jardin & Coop-ACAFIS", "ACAFIS Cité Jardin & Coop-ACAFIS"),
    shortDesc: L(
      "Accès sécurisé à la propriété foncière éco-responsable et investissement communautaire.",
      "Secure access to eco-responsible land ownership and community investment."
    ),
    description: L(
      "Un projet d'habitat solidaire et novateur à Ndianda au Sénégal. Grâce à notre modèle coopératif transparent, les membres de la diaspora investissent en toute confiance dans un cadre de vie durable et respectueux de l'environnement.",
      "An innovative, solidarity-based housing project in Ndianda, Senegal. Through our transparent cooperative model, diaspora members invest with confidence in a sustainable, environmentally-friendly living environment."
    ),
    iconName: "Home",
    category: "habitat",
    deliverables: LA(
      [
        "Sécurisation juridique des titres fonciers",
        "Lotissement écologique moderne à Ndianda",
        "Mutualisation des coûts de construction",
        "Développement agro-écologique intégré",
      ],
      [
        "Legal security of land titles",
        "Modern eco-friendly subdivision in Ndianda",
        "Pooling of construction costs",
        "Integrated agro-ecological development",
      ]
    ),
  },
  {
    id: "education-ntic",
    title: L("Éducation, Soutien Scolaire & nTIC", "Education, Academic Support & ICT"),
    shortDesc: L(
      "Propulser la réussite des enfants de la diaspora avec Le Mentor IA et des ateliers technologiques.",
      "Driving the success of diaspora children with the AI Mentor and technology workshops."
    ),
    description: L(
      "La réussite de nos enfants est la priorité absolue. Nous allions soutien académique classique et apprentissage des technologies d'avenir (IA, programmation, robotique) ainsi qu'un ancrage dans nos riches racines culturelles.",
      "Our children's success is the absolute priority. We combine classic academic support with learning tomorrow's technologies (AI, programming, robotics) alongside a strong grounding in our rich cultural roots."
    ),
    iconName: "GraduationCap",
    category: "education",
    deliverables: LA(
      [
        "Plateforme intelligente 'Le Mentor ACAFIS'",
        "Aide aux devoirs et séances de tutorat",
        "Initiation au Code & IA (Python, Scratch)",
        "Orientation académique et bourses d'études",
      ],
      [
        "The 'ACAFIS Mentor' smart platform",
        "Homework help and tutoring sessions",
        "Introduction to coding & AI (Python, Scratch)",
        "Academic guidance and scholarships",
      ]
    ),
  },
  {
    id: "integration-accueil",
    title: L("Accueil & Intégration au Canada", "Welcome & Integration in Canada"),
    shortDesc: L(
      "Guider et soutenir les nouveaux arrivants pour une installation sereine et épanouie.",
      "Guiding and supporting newcomers for a smooth, fulfilling settlement."
    ),
    description: L(
      "De l'arrivée à l'aéroport à l'insertion professionnelle, ACAFIS déploie un réseau chaleureux d'entraide pour faciliter le logement, les démarches administratives et le réseautage professionnel des familles et étudiants.",
      "From the airport arrival to professional integration, ACAFIS deploys a warm mutual-aid network to help with housing, administrative procedures, and professional networking for families and students."
    ),
    iconName: "Users2",
    category: "solidarity",
    deliverables: LA(
      [
        "Parrainage par des membres chevronnés",
        "Séances d'information administrative et fiscale",
        "Réseautage professionnel et mentorat de carrière",
        "Entraide matérielle et solidarité d'urgence",
      ],
      [
        "Mentorship from seasoned members",
        "Administrative and tax information sessions",
        "Professional networking and career mentoring",
        "Material mutual aid and emergency solidarity",
      ]
    ),
  },
  {
    id: "centre-communautaire",
    title: L("Acquisition d'un Centre Communautaire ACAFIS", "Acquiring an ACAFIS Community Centre"),
    shortDesc: L(
      "Un local bien à nous : centre de formation pour nos jeunes et lieu d'accueil pour les nouveaux arrivants.",
      "A place of our own: a training centre for our youth and a welcome space for newcomers."
    ),
    description: L(
      "ACAFIS travaille à l'acquisition d'un local permanent — bien plus qu'un centre de formation pour nos jeunes, un véritable lieu d'accueil où suivre et conseiller les nouveaux arrivants. Un espace de brassage, d'entraide et de culture où se rencontrent toutes les générations de la diaspora.",
      "ACAFIS is working to acquire a permanent space — much more than a training centre for our youth, a true welcome space to guide and advise newcomers. A place of mixing, mutual aid, and culture where every generation of the diaspora meets."
    ),
    iconName: "Building",
    category: "solidarity",
    deliverables: LA(
      [
        "Salle de formation & ateliers pour les jeunes (nTIC, soutien scolaire, code)",
        "Bureau d'accueil et de suivi-conseil pour les nouveaux arrivants",
        "Espace de rencontres interculturelles et d'entraide communautaire",
        "Local permanent pour les réunions du Bureau et des commissions",
      ],
      [
        "Training room & workshops for youth (ICT, academic support, coding)",
        "Welcome desk and follow-up counselling for newcomers",
        "Space for intercultural gatherings and community mutual aid",
        "Permanent space for Board and committee meetings",
      ]
    ),
  },
  {
    id: "activites-culturelles",
    title: L("Culture, Rassemblements & Mémoire", "Culture, Gatherings & Memory"),
    shortDesc: L(
      "Faire vivre la Teranga sénégalaise au cœur de la société canadienne.",
      "Keeping Senegalese Teranga alive at the heart of Canadian society."
    ),
    description: L(
      "Nous célébrons nos traditions vivantes à travers des rencontres chaleureuses : grandes journées culturelles, pique-niques familiaux, galas de solidarité et projets de transmission mémorielle pour les jeunes.",
      "We celebrate our living traditions through warm gatherings: large cultural days, family picnics, solidarity galas, and memorial-transmission projects for youth."
    ),
    iconName: "Sparkles",
    category: "diaspora",
    deliverables: LA(
      [
        "Journée annuelle ACAFIS & Assemblée Générale",
        "Grand BBQ estival familial Montréal/Ottawa",
        "Gala caritatif annuel de levée de fonds",
        "Colonie de vacances 'Racines & Avenir'",
      ],
      [
        "Annual ACAFIS Day & General Assembly",
        "Big summer family BBQ in Montreal/Ottawa",
        "Annual charity fundraising gala",
        "'Roots & Future' summer camp",
      ]
    ),
  },
];

export const ANNUAL_PROGRAM: Activity[] = [
  {
    id: "hiver",
    season: L("Hiver (Jan-Mars)", "Winter (Jan-Mar)"),
    title: L("AG Ordinaire & Journée ACAFIS", "ACAFIS Annual Meeting & Community Day"),
    subtitle: L("Rassemblement communautaire & Gouvernance", "Community Gathering & Governance"),
    description: L(
      "Bilan annuel d'exercice, présentation des états financiers par le Bureau, renouvellement transparent des instances et grande journée culturelle de retrouvailles sous le signe de la fraternité.",
      "Annual review, presentation of financial statements by the Board, transparent renewal of officers, and a big cultural reunion day under the sign of brotherhood."
    ),
    location: "Montréal, QC (Hybride / Salle communautaire)",
    tags: LA(
      ["Gouvernance", "Bilan Annuel", "Culture", "Teranga"],
      ["Governance", "Annual Report", "Culture", "Teranga"]
    ),
    photo: programmeHiver,
  },
  {
    id: "printemps",
    season: L("Printemps (Avril-Juin)", "Spring (Apr-Jun)"),
    title: L("Conférences & Ateliers Thématiques", "Conferences & Themed Workshops"),
    subtitle: L("Investissement immobilier & Entrepreneuriat", "Real Estate Investment & Entrepreneurship"),
    description: L(
      "Série de talks interactifs animés par des experts sur l'investissement immobilier au Sénégal, l'accès au crédit, la sécurisation foncière, les projets de la Coop-ACAFIS et l'entrepreneuriat de la diaspora.",
      "A series of interactive expert talks on real estate investment in Senegal, access to credit, land security, Coop-ACAFIS projects, and diaspora entrepreneurship."
    ),
    location: "En ligne & Salons d'affaires à Ottawa / Montréal",
    tags: LA(
      ["Investissement", "Coop-ACAFIS", "Immobilier", "Entrepreneuriat"],
      ["Investment", "Coop-ACAFIS", "Real Estate", "Entrepreneurship"]
    ),
    photo: programmePrintemps,
  },
  {
    id: "ete",
    season: L("Été (Juillet-Sept)", "Summer (Jul-Sep)"),
    title: L("Grand BBQ & Sorties Plein Air", "Big BBQ & Outdoor Outings"),
    subtitle: L("La grande fête estivale des familles", "The big summer family celebration"),
    description: L(
      "Pique-nique familial géant dans un grand parc de Montréal/Ottawa avec grillades, tournoi de football amical, jeux pour enfants, musique traditionnelle et échanges chaleureux entre toutes les générations.",
      "A giant family picnic in a big Montreal/Ottawa park with grilling, a friendly soccer tournament, children's games, traditional music, and warm exchanges across every generation."
    ),
    location: "Parc Angrignon (Montréal) / Parc de la Gatineau (Ottawa)",
    tags: LA(["Famille", "Pique-nique", "Jeunesse", "Sport"], ["Family", "Picnic", "Youth", "Sport"]),
    photo: programmeEte,
  },
  {
    id: "automne",
    season: L("Automne (Oct-Déc)", "Fall (Oct-Dec)"),
    title: L("Gala de Solidarité ACAFIS", "ACAFIS Solidarity Gala"),
    subtitle: L("Soirée de prestige & Levée de fonds", "A prestigious evening & Fundraiser"),
    description: L(
      "Soirée solennelle de gala rassemblant la communauté, les dignitaires et les partenaires. Levée de fonds pour financer les programmes éducatifs, les projets sociaux et le développement de la Cité Jardin.",
      "A solemn gala evening bringing together the community, dignitaries, and partners. Funds raised support educational programs, social projects, and the development of the Cité Jardin."
    ),
    location: "Grande salle de réception métropolitaine",
    tags: LA(
      ["Gala", "Levée de fonds", "Cité Jardin", "Partenariats"],
      ["Gala", "Fundraiser", "Cité Jardin", "Partnerships"]
    ),
    photo: programmeAutomne,
  },
  {
    id: "reveillon",
    season: L("Réveillon (31-Déc)", "Year-End (Dec-31)"),
    title: L("ACAFIS Célébration Fin d'Année 2025", "ACAFIS Year-End Celebration 2025"),
    subtitle: L(
      "Réveillon communautaire — le 31 décembre en famille",
      "Community New Year's Eve — December 31st with family"
    ),
    description: L(
      "Notre grande tradition du 31 décembre : toutes les familles ACAFIS réunies pour accueillir la nouvelle année ensemble. Moment fort de la soirée, le jeune qui célèbre ses 18 ans cette année prononce un discours au nom des enfants, pour sa dernière année à recevoir un cadeau — une émotion partagée par toute la communauté.",
      "Our great December 31st tradition: every ACAFIS family gathered to welcome the new year together. The evening's highlight: the young person turning 18 that year gives a speech on behalf of the children, for their last year receiving a gift — a moment of emotion shared by the whole community."
    ),
    location: "Café le Cheval — 5320 Chem. Queen Mary, Montréal, QC H3X 1T7",
    tags: LA(
      ["Réveillon", "Famille", "Nouvel An", "Tradition"],
      ["New Year's Eve", "Family", "New Year", "Tradition"]
    ),
    photo: recipiendairesGroupe,
  },
];

export const COLONIE_ROADMAP: ProjectPhase[] = [
  {
    phase: L("Phase 1", "Phase 1"),
    title: L("Conception, Cadrage & Partenariats", "Design, Scoping & Partnerships"),
    period: L("2025 - Début 2026", "2025 - Early 2026"),
    status: "in_progress",
    details: LA(
      [
        "Constitution du comité de pilotage pédagogique et logistique",
        "Accords de partenariat avec les institutions sénégalaises (Gorée, Musée des Civilisations Noires)",
        "Aménagement des espaces d'accueil et des dortoirs sécurisés à la Cité Jardin Ndianda",
        "Élaboration du protocole d'encadrement biculturel et sécuritaire Canada-Sénégal",
      ],
      [
        "Forming the pedagogical and logistics steering committee",
        "Partnership agreements with Senegalese institutions (Gorée, Museum of Black Civilizations)",
        "Setting up welcome areas and secure dormitories at the Cité Jardin Ndianda",
        "Developing the Canada-Senegal bicultural and safety supervision protocol",
      ]
    ),
  },
  {
    phase: L("Phase 2", "Phase 2"),
    title: L("Inscriptions & Ateliers Préparatoires", "Registrations & Prep Workshops"),
    period: L("2027 - 2029", "2027 - 2029"),
    status: "upcoming",
    details: LA(
      [
        "Ouverture des candidatures pour 50 jeunes de la diaspora (10-17 ans)",
        "Sessions préparatoires à Montréal et Ottawa (histoire, us et coutumes, nTIC)",
        "Levée de fonds et attribution de bourses solidaires pour l'égalité d'accès",
        "Organisation des réservations de vols groupés et assurances internationales",
      ],
      [
        "Applications open for 50 diaspora youth (ages 10-17)",
        "Prep sessions in Montreal and Ottawa (history, customs, ICT)",
        "Fundraising and solidarity scholarships for equal access",
        "Organizing group flight bookings and international insurance",
      ]
    ),
  },
  {
    phase: L("Phase 3", "Phase 3"),
    title: L(
      "Déploiement de la Colonie 'Racines & Avenir'",
      "Rollout of the 'Roots & Future' Summer Camp"
    ),
    period: L("Été 2030 (3 Semaines d'immersion)", "Summer 2030 (3-week immersion)"),
    status: "upcoming",
    details: LA(
      [
        "Semaine 1 : Tourisme mémoriel d'exception (Île de Gorée, Maison des Esclaves, Musée des Civilisations Noires de Dakar)",
        "Semaine 2 : Immersion à la Cité Jardin à Ndianda (ateliers AgriTech, écologie et permaculture)",
        "Semaine 3 : Tech Camp nTIC (initiation au code, intelligence artificielle, mini-projets numériques) & soirée de gala de restitution",
      ],
      [
        "Week 1: Exceptional memorial tourism (Gorée Island, House of Slaves, Museum of Black Civilizations in Dakar)",
        "Week 2: Immersion at the Cité Jardin in Ndianda (AgriTech, ecology and permaculture workshops)",
        "Week 3: ICT Tech Camp (intro to coding, AI, mini digital projects) & closing gala evening",
      ]
    ),
  },
];

export type AcafisVideoCategory = "temoignage" | "jeunesse" | "education" | "communaute";

export interface AcafisVideo {
  id: string;
  name: Localized;
  role: Localized;
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
    name: L("Témoignage d'un membre ACAFIS", "An ACAFIS Member's Testimonial"),
    role: L("Membre de la communauté", "Community member"),
    url: "https://www.facebook.com/share/v/1HNVdo48mq/",
    category: "temoignage",
  },
  {
    id: "video-2",
    name: L("Naby", "Naby"),
    role: L("Jeune de la diaspora", "Diaspora youth"),
    url: "https://www.facebook.com/reel/1109297139670569",
    category: "jeunesse",
  },
  {
    id: "video-3",
    name: L("Conférence ACAFIS", "ACAFIS Conference"),
    role: L("Séance d'information communautaire", "Community information session"),
    url: "https://www.facebook.com/share/r/19PK9Vnhod/",
    category: "communaute",
  },
  {
    id: "video-4",
    name: L("Landiata Dieme", "Landiata Dieme"),
    role: L("Trésorier Général — Grand BBQ", "Treasurer General — Big BBQ"),
    url: "https://www.facebook.com/reel/1320472491816811",
    category: "temoignage",
  },
  {
    id: "video-5",
    name: L("Sortie ACAFIS — Super Aqua Club", "ACAFIS Outing — Super Aqua Club"),
    role: L("Vidéo souvenir de sortie jeunesse", "Youth outing memory video"),
    url: "https://www.facebook.com/reel/4760068570760905",
    category: "jeunesse",
  },
  {
    id: "video-6",
    name: L("Panel sur l'Éducation", "Education Panel"),
    role: L("Conférence communautaire", "Community conference"),
    url: "https://www.facebook.com/share/v/19E6VQiCzA/",
    category: "education",
  },
  {
    id: "video-7",
    name: L("Sire Aw", "Sire Aw"),
    role: L("Responsable Communication — Intervenant", "Communications Officer — Speaker"),
    url: "https://www.facebook.com/reel/1241179694066171",
    category: "temoignage",
  },
  {
    id: "video-8",
    name: L("Système Scolaire Québécois & Orientations", "Quebec School System & Guidance"),
    role: L(
      "Panel : directions d'école, TES, psychologue, enseignant — Côte-des-Neiges",
      "Panel: school principals, special education technician, psychologist, teacher — Côte-des-Neiges"
    ),
    url: "https://www.facebook.com/reel/1124423316680352",
    category: "education",
  },
  {
    id: "video-9",
    name: L("Conférence sur l'Intimidation (2011)", "Conference on Bullying (2011)"),
    role: L(
      "Intervenant : Moustapha Sane — Modérateur : Ibrahima Diop",
      "Speaker: Moustapha Sane — Moderator: Ibrahima Diop"
    ),
    url: "https://www.youtube.com/watch?v=fLNdkgQUvNc",
    category: "education",
    platform: "youtube",
  },
  {
    id: "video-10",
    name: L(
      "Fête du 31 Décembre chez Ngone (Laval) — Partie 1",
      "December 31st Celebration at Ngone's (Laval) — Part 1"
    ),
    role: L(
      "Familles réunies pour la remise des cadeaux aux enfants",
      "Families gathered for the children's gift-giving"
    ),
    url: "https://youtu.be/FxnTz2dVKyQ",
    category: "jeunesse",
    platform: "youtube",
  },
  {
    id: "video-11",
    name: L(
      "Fête du 31 Décembre chez Ngone (Laval) — Partie 2",
      "December 31st Celebration at Ngone's (Laval) — Part 2"
    ),
    role: L(
      "Suite de la soirée : vœux de bonne année en famille",
      "Rest of the evening: family New Year's wishes"
    ),
    url: "https://youtu.be/ImCiMrF4ioM",
    category: "jeunesse",
    platform: "youtube",
  },
];

export interface Recipiendaire {
  id: string;
  name: string;
  year: number;
  quote: Localized;
}

// Chaque 31 décembre, ACAFIS célèbre ses enfants ; le jeune qui atteint 18 ans
// cette année-là prononce un discours au nom des enfants, pour sa dernière
// année à recevoir un cadeau. Ajoutez ici les vrais récipiendaires au fil du temps.
export const RECIPIENDAIRES: Recipiendaire[] = [];

export interface FormerPresident {
  id: string;
  name: string;
  organization: "ACAFIS" | "Coop-ACAFIS";
  years: Localized;
  tribute?: Localized;
}

// Hommage aux presidents successifs, depuis la fondation.
export const FORMER_PRESIDENTS: FormerPresident[] = [
  { id: "acafis-1", name: "Landiata Dieme", organization: "ACAFIS", years: L("Ancien Président", "Former President") },
  { id: "acafis-2", name: "Ibrahima Diop", organization: "ACAFIS", years: L("Ancien Président", "Former President") },
  { id: "acafis-3", name: "Omar Cisse", organization: "ACAFIS", years: L("Ancien Président", "Former President") },
  { id: "acafis-4", name: "Ibnou Amar Dia", organization: "ACAFIS", years: L("Ancien Président", "Former President") },
  { id: "acafis-5", name: "Moustapha Sane", organization: "ACAFIS", years: L("Président actuel", "Current President") },
  { id: "coop-1", name: "Omar Sarr", organization: "Coop-ACAFIS", years: L("Ancien Président", "Former President") },
  { id: "coop-2", name: "Souleymane Diallo", organization: "Coop-ACAFIS", years: L("Ancien Président", "Former President") },
  {
    id: "coop-3",
    name: "Omar Sarr",
    organization: "Coop-ACAFIS",
    years: L("Président actuel — depuis 2024", "Current President — since 2024"),
  },
];

export const OFFICIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "statuts",
    title: L("Statuts Officiels ACAFIS Canada", "ACAFIS Canada Official Bylaws"),
    type: L("Document Fondateur (PDF certifié)", "Founding Document (certified PDF)"),
    size: "1.4 Mo",
    description: L(
      "Cadre légal régissant l'association, ses objectifs non lucratifs, la composition des instances électives et les droits des membres.",
      "Legal framework governing the association, its non-profit objectives, the makeup of elected bodies, and members' rights."
    ),
    contentSummary: LA(
      [
        "Dénomination, siège social et objet de solidarité internationale",
        "Critères d'adhésion, droits de vote et cotisations statutaires",
        "Pouvoirs du Bureau Exécutif (11 membres) et mandats",
        "Règles de convocation de l'Assemblée Générale annuelle ordinaire",
      ],
      [
        "Name, head office, and international solidarity purpose",
        "Membership criteria, voting rights, and statutory fees",
        "Powers of the Executive Board (11 members) and terms",
        "Rules for calling the annual ordinary General Assembly",
      ]
    ),
  },
  {
    id: "reglement",
    title: L("Règlement Intérieur ACAFIS Canada", "ACAFIS Canada Internal Regulations"),
    type: L("Normes Opérationnelles (PDF certifié)", "Operating Standards (certified PDF)"),
    size: "950 Ko",
    description: L(
      "Guide pratique d'application des statuts, code de déontologie, gestion des commissions spécialisées et transparence financière.",
      "Practical guide for applying the bylaws, code of ethics, management of specialized commissions, and financial transparency."
    ),
    contentSummary: LA(
      [
        "Modalités pratiques de versement et de gestion des cotisations (25 CAD)",
        "Attribution des rôles au sein des comités (Organisation, Femmes, Tech)",
        "Processus de contrôle financier et audits réguliers",
        "Engagements mutuels lors des événements et de la colonie de vacances",
      ],
      [
        "Practical terms for paying and managing membership fees ($25 CAD)",
        "Assignment of roles within committees (Organization, Women, Tech)",
        "Financial control process and regular audits",
        "Mutual commitments during events and the summer camp",
      ]
    ),
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

// Registraire des entreprises du Québec (REQ) business number — ACAFIS is
// registered as a non-profit under the Loi sur la publicité légale des
// entreprises. From the official REZ-630 annual update notice.
export const ORGANIZATION_NEQ = "1167888842";

export const PAYMENT_INTERAC_INFO = {
  email: "acafisfinance2@gmail.com",
  secretQuestion: L("Pays ?", "Country?"),
  secretAnswer: "Senegal",
  annualFeeCAD: 25,
  recipient: L("ACAFIS Canada (Trésorerie Générale)", "ACAFIS Canada (Treasury General)"),
  memoInstruction: L(
    "Indiquez votre Nom, Prénom et mention 'Cotisation 2026' dans la note du virement.",
    "Include your last name, first name, and the note 'Cotisation 2026' (2026 dues) in the transfer memo."
  ),
};

export const PARTNERS_LIST = [
  { name: "Regroupement Général des Sénégalais du Canada (RGSC)", role: L("Partenaire Fédérateur", "Founding Partner"), logo: partnerRgsc },
  { name: "Arrondissement de Côte-des-Neiges–Notre-Dame-de-Grâce", role: L("Partenaire Municipal", "Municipal Partner"), logo: partnerCdnNdg },
  { name: "Afroleck", role: L("Partenaire Commanditaire", "Sponsoring Partner"), logo: partnerAfroleck },
];

// Major, multi-year ACAFIS undertakings — each with its own phased roadmap to
// help members understand exactly where things stand and how to get involved,
// the same way the Colonie de Vacances already does.
export const MAJOR_PROJECTS: MajorProject[] = [
  {
    id: "centre-communautaire",
    title: L("Acquisition d'un Centre Communautaire ACAFIS", "Acquiring an ACAFIS Community Centre"),
    tagline: L("Un local bien à nous, pour toutes nos activités", "A place of our own, for all our activities"),
    description: L(
      "Aujourd'hui, ACAFIS n'a pas de local permanent : réunions, ateliers et accueil des nouveaux arrivants se font au gré des salles disponibles. L'objectif est d'acquérir un espace fixe qui serve à la fois de centre de formation pour nos jeunes et de lieu d'accueil-conseil pour les nouveaux arrivants — un véritable lieu de brassage, d'entraide et de culture.",
      "Today, ACAFIS has no permanent space: meetings, workshops, and newcomer welcome happen wherever a room is available. The goal is to acquire a fixed space that serves both as a training centre for our youth and a welcome-and-advice space for newcomers — a true place of mixing, mutual aid, and culture."
    ),
    roadmap: [
      {
        phase: L("Étape 1", "Step 1"),
        title: L("Comité & Cahier des charges", "Committee & Requirements"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          [
            "Constituer un comité dédié « Centre Communautaire »",
            "Définir les besoins réels (superficie, activités à héberger, capacité d'accueil)",
            "Chiffrer un budget prévisionnel (achat ou location, aménagement, entretien annuel)",
          ],
          [
            "Form a dedicated 'Community Centre' committee",
            "Define real needs (size, activities to host, capacity)",
            "Estimate a projected budget (purchase or lease, fit-out, annual upkeep)",
          ]
        ),
      },
      {
        phase: L("Étape 2", "Step 2"),
        title: L("Financement", "Financing"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          [
            "Lancer une campagne de dons ciblée auprès des membres",
            "Identifier les subventions municipales et provinciales pour organismes communautaires",
            "Explorer des partenariats avec la Coop-ACAFIS ou des mécènes",
          ],
          [
            "Launch a targeted donation campaign among members",
            "Identify municipal and provincial grants for community organizations",
            "Explore partnerships with Coop-ACAFIS or patrons",
          ]
        ),
      },
      {
        phase: L("Étape 3", "Step 3"),
        title: L("Repérage & Acquisition", "Site Search & Acquisition"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          [
            "Visiter des locaux disponibles à Montréal (achat ou bail longue durée)",
            "Négocier et signer une entente",
            "Obtenir les permis municipaux nécessaires",
          ],
          [
            "Tour available spaces in Montreal (purchase or long-term lease)",
            "Negotiate and sign an agreement",
            "Obtain the necessary municipal permits",
          ]
        ),
      },
      {
        phase: L("Étape 4", "Step 4"),
        title: L("Aménagement & Ouverture", "Fit-Out & Opening"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          [
            "Travaux d'aménagement (salle de formation, bureau d'accueil, espace commun)",
            "Recruter et former les bénévoles responsables du lieu",
            "Grande inauguration communautaire",
          ],
          [
            "Fit-out work (training room, welcome desk, common space)",
            "Recruit and train the volunteers responsible for the space",
            "Big community grand opening",
          ]
        ),
      },
    ],
    howToHelp: LA(
      [
        "Rejoindre le comité Centre Communautaire",
        "Faire un don pour la campagne de financement",
        "Signaler un local disponible à Montréal qui pourrait convenir",
      ],
      [
        "Join the Community Centre committee",
        "Donate to the fundraising campaign",
        "Point out an available space in Montreal that could work",
      ]
    ),
    cta: { label: L("Rejoindre le comité", "Join the committee"), type: "contact", target: "adhesion" },
  },
  {
    id: "cite-jardin-coop",
    title: L("Cité-Jardin ACAFIS & Coop-ACAFIS", "Cité-Jardin ACAFIS & Coop-ACAFIS"),
    tagline: L("320 logements solidaires à Ndianda, Sénégal", "320 solidarity homes in Ndianda, Senegal"),
    description: L(
      "Portée par la Coop-ACAFIS (coopérative sœur, fondée en 2014 à Montréal), la Cité-Jardin est un projet d'habitat solidaire pour la diaspora à Ndianda et Mbodiène, près de Mbour au Sénégal — 320 logements sur environ 14 hectares, avec sécurisation foncière et financement bancaire sur 20 ans.",
      "Led by Coop-ACAFIS (a sister cooperative founded in 2014 in Montreal), the Cité-Jardin is a solidarity housing project for the diaspora in Ndianda and Mbodiène, near Mbour, Senegal — 320 homes on about 14 hectares, with secured land titles and 20-year bank financing."
    ),
    roadmap: [
      {
        phase: L("2018-2024", "2018-2024"),
        title: L("Fondations légales & foncières", "Legal & Land Foundations"),
        period: L("Terminé", "Completed"),
        status: "completed",
        details: LA(
          [
            "Agrément interministériel de l'État du Sénégal obtenu (N° 018485, 2018)",
            "Sécurisation de 14 hectares à Ndianda (10,5 ha) et Mbodiène (3,5 ha)",
            "Reconnaissance légale au Canada (NEQ, Loi sur les compagnies du Québec)",
          ],
          [
            "Interministerial approval obtained from the State of Senegal (No. 018485, 2018)",
            "Securing of 14 hectares in Ndianda (10.5 ha) and Mbodiène (3.5 ha)",
            "Legal recognition in Canada (NEQ, Quebec Companies Act)",
          ]
        ),
      },
      {
        phase: L("2025-2027", "2025-2027"),
        title: L("Financement & Construction", "Financing & Construction"),
        period: L("En cours", "In progress"),
        status: "in_progress",
        details: LA(
          [
            "Permis de construire et activation du financement bancaire BHS (20 ans)",
            "Lancement du chantier par Ridwan Engineering (conception Studio SAAMS)",
            "48 acquéreurs déjà engagés dans le projet",
          ],
          [
            "Building permits and activation of BHS bank financing (20 years)",
            "Groundbreaking by Ridwan Engineering (design by Studio SAAMS)",
            "48 buyers already committed to the project",
          ]
        ),
      },
      {
        phase: L("2028-2030", "2028-2030"),
        title: L("Livraison des logements", "Delivery of Homes"),
        period: L("À venir", "Upcoming"),
        status: "upcoming",
        details: LA(
          [
            "Livraison des premières villas dès 2028",
            "Poursuite de la construction des 6 types de villas (F3 à F6)",
            "Clôture du projet avec les 320 logements livrés d'ici 2030",
          ],
          [
            "First villas delivered starting 2028",
            "Continued construction of the 6 villa types (F3 to F6)",
            "Project completion with all 320 homes delivered by 2030",
          ]
        ),
      },
    ],
    howToHelp: LA(
      [
        "Devenir acquéreur d'une villa à la Cité-Jardin",
        "Investir dans les parts sociales de la Coop-ACAFIS",
        "Suivre l'avancement sur coop-acafis.com",
      ],
      [
        "Become a buyer of a villa at the Cité-Jardin",
        "Invest in Coop-ACAFIS share capital",
        "Follow progress at coop-acafis.com",
      ]
    ),
    cta: { label: L("Découvrir Coop-ACAFIS", "Discover Coop-ACAFIS"), type: "external", target: "https://coop-acafis.com" },
  },
  {
    id: "colonie-vacances",
    title: L("Colonie de Vacances « Racines & Avenir »", "'Roots & Future' Summer Camp"),
    tagline: L("Immersion mémorielle et technologique pour nos jeunes", "A memorial and technological immersion for our youth"),
    description: L(
      "Un programme d'immersion complet pour les jeunes de la diaspora (10-17 ans), combinant tourisme mémoriel au Sénégal (Gorée, Musée des Civilisations Noires) et ateliers technologiques (code, IA, AgriTech) à la Cité-Jardin de Ndianda.",
      "A complete immersion program for diaspora youth (ages 10-17), combining memorial tourism in Senegal (Gorée, Museum of Black Civilizations) and technology workshops (coding, AI, AgriTech) at the Cité-Jardin in Ndianda."
    ),
    roadmap: COLONIE_ROADMAP,
    howToHelp: LA(
      [
        "Manifester l'intérêt de votre enfant pour une place",
        "Devenir partenaire éducatif ou mécène de la colonie",
        "Contacter le comité jeunesse pour vous impliquer",
      ],
      [
        "Express your child's interest in a spot",
        "Become an educational partner or patron of the camp",
        "Contact the youth committee to get involved",
      ]
    ),
    cta: { label: L("Voir tous les détails", "See all the details"), type: "internal", target: "espace-jeune" },
    photo: espaceJeuneColonie,
  },
  {
    id: "equipe-soccer",
    title: L("Mise sur Pied d'une Équipe de Soccer Ados", "Setting Up a Teen Soccer Team"),
    tagline: L("Le sport comme vecteur de cohésion et de santé pour nos jeunes", "Sport as a driver of cohesion and health for our youth"),
    description: L(
      "Structurer une véritable équipe de soccer pour les adolescents de la diaspora (13-17 ans), au-delà des tournois amicaux improvisés lors du Grand BBQ estival — entraînements réguliers, esprit d'équipe et fierté ACAFIS.",
      "Building a real soccer team for diaspora teens (ages 13-17), beyond the impromptu friendly tournaments at the summer BBQ — regular practices, team spirit, and ACAFIS pride."
    ),
    roadmap: [
      {
        phase: L("Étape 1", "Step 1"),
        title: L("Mobilisation & Recrutement", "Outreach & Recruitment"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          [
            "Sonder l'intérêt des familles pour leurs ados (13-17 ans)",
            "Recruter un entraîneur ou une entraîneuse bénévole",
            "Constituer une première liste de joueurs et joueuses",
          ],
          [
            "Survey families' interest for their teens (ages 13-17)",
            "Recruit a volunteer coach",
            "Build an initial roster of players",
          ]
        ),
      },
      {
        phase: L("Étape 2", "Step 2"),
        title: L("Structuration", "Structuring"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          [
            "Choisir un format (récréatif ou ligue compétitive locale)",
            "Acquérir l'équipement (maillots, ballons, matériel d'entraînement)",
            "Souscrire les assurances nécessaires",
          ],
          [
            "Choose a format (recreational or local competitive league)",
            "Acquire equipment (jerseys, balls, training gear)",
            "Take out the necessary insurance",
          ]
        ),
      },
      {
        phase: L("Étape 3", "Step 3"),
        title: L("Terrain & Calendrier", "Field & Schedule"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          [
            "Réserver un terrain municipal pour des entraînements réguliers",
            "Établir un calendrier de la saison (entraînements et matchs amicaux)",
          ],
          [
            "Book a municipal field for regular practices",
            "Set the season schedule (practices and friendly matches)",
          ]
        ),
      },
      {
        phase: L("Étape 4", "Step 4"),
        title: L("Lancement", "Launch"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          ["Match inaugural de l'équipe ACAFIS", "Intégration au programme jeunesse annuel"],
          ["ACAFIS team's inaugural match", "Integration into the annual youth program"]
        ),
      },
    ],
    howToHelp: LA(
      [
        "Devenir entraîneur ou assistant bénévole",
        "Inscrire votre ado (13-17 ans)",
        "Faire don d'équipement sportif",
      ],
      ["Become a volunteer coach or assistant", "Register your teen (ages 13-17)", "Donate sports equipment"]
    ),
    cta: { label: L("Manifester mon intérêt", "Express my interest"), type: "contact", target: "adhesion" },
  },
  {
    id: "projet-culinaire",
    title: L("Projet Culinaire ACAFIS", "ACAFIS Culinary Project"),
    tagline: L("Transmettre et faire rayonner la cuisine sénégalaise", "Passing on and showcasing Senegalese cuisine"),
    description: L(
      "Initié l'an dernier lors de nos soirées communautaires (Ndogou, Grand BBQ), ce projet vise à transmettre les recettes traditionnelles sénégalaises entre générations et, à terme, à en faire rayonner la richesse au-delà de nos membres.",
      "Launched last year during our community evenings (Ndogou, Big BBQ), this project aims to pass on traditional Senegalese recipes between generations and, eventually, to showcase their richness beyond our members."
    ),
    roadmap: [
      {
        phase: L("Phase 1", "Phase 1"),
        title: L("Lancement", "Launch"),
        period: L("2025", "2025"),
        status: "completed",
        details: LA(
          [
            "Premiers ateliers culinaires lors des soirées communautaires (Ndogou, BBQ)",
            "Recueil des premières recettes traditionnelles auprès des aînées",
          ],
          [
            "First culinary workshops during community evenings (Ndogou, BBQ)",
            "Collecting the first traditional recipes from our elder women",
          ]
        ),
      },
      {
        phase: L("Phase 2", "Phase 2"),
        title: L("Structuration", "Structuring"),
        period: L("En cours", "In progress"),
        status: "in_progress",
        details: LA(
          [
            "Mettre en place un calendrier régulier d'ateliers culinaires",
            "Identifier des cheffes et chefs bénévoles pour animer les sessions",
            "Constituer un recueil écrit des recettes partagées",
          ],
          [
            "Setting up a regular schedule of culinary workshops",
            "Identifying volunteer chefs to lead the sessions",
            "Compiling a written collection of shared recipes",
          ]
        ),
      },
      {
        phase: L("Phase 3", "Phase 3"),
        title: L("Rayonnement", "Outreach"),
        period: L("À venir", "Upcoming"),
        status: "upcoming",
        details: LA(
          [
            "Envisager un livre de recettes ACAFIS ou un service traiteur solidaire",
            "Ouvrir certains ateliers au grand public pour faire rayonner la culture sénégalaise",
          ],
          [
            "Considering an ACAFIS recipe book or a solidarity catering service",
            "Opening some workshops to the public to showcase Senegalese culture",
          ]
        ),
      },
    ],
    howToHelp: LA(
      [
        "Partager une recette traditionnelle",
        "Participer aux ateliers culinaires",
        "Devenir cheffe ou chef bénévole animateur",
      ],
      ["Share a traditional recipe", "Take part in the culinary workshops", "Become a volunteer chef facilitator"]
    ),
    cta: { label: L("Partager ma recette", "Share my recipe"), type: "contact", target: "adhesion" },
  },
  {
    id: "foyer-ndianda",
    title: L("Foyer Socio-Culturel de Ndianda", "Ndianda Socio-Cultural Centre"),
    tagline: L("Un lieu de vie communautaire au cœur de la Cité-Jardin", "A community gathering place at the heart of the Cité-Jardin"),
    description: L(
      "Distinct des logements de la Cité-Jardin, ce foyer serait un espace commun à Ndianda dédié aux activités socio-culturelles — pour la communauté locale et pour les familles de la diaspora en visite, dans le même esprit de brassage et d'entraide que le futur Centre Communautaire au Canada.",
      "Separate from the Cité-Jardin's homes, this centre would be a shared space in Ndianda dedicated to socio-cultural activities — for the local community and for visiting diaspora families, in the same spirit of mixing and mutual aid as the future Community Centre in Canada."
    ),
    roadmap: [
      {
        phase: L("Étape 1", "Step 1"),
        title: L("Définition du projet", "Defining the Project"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          [
            "Consulter la communauté locale de Ndianda sur les besoins réels",
            "Définir la vocation du foyer (salle polyvalente, bibliothèque, espace jeunesse)",
          ],
          [
            "Consult the local Ndianda community on real needs",
            "Define the centre's purpose (multipurpose room, library, youth space)",
          ]
        ),
      },
      {
        phase: L("Étape 2", "Step 2"),
        title: L("Partenariat avec Coop-ACAFIS", "Partnership with Coop-ACAFIS"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          [
            "Identifier un terrain disponible au sein ou à proximité de la Cité-Jardin",
            "Articuler le projet avec le calendrier de développement de la Coop-ACAFIS",
          ],
          [
            "Identify available land within or near the Cité-Jardin",
            "Align the project with Coop-ACAFIS's development timeline",
          ]
        ),
      },
      {
        phase: L("Étape 3", "Step 3"),
        title: L("Financement", "Financing"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          ["Lancer une collecte de fonds dédiée", "Explorer des partenariats avec des institutions culturelles sénégalaises"],
          ["Launch a dedicated fundraiser", "Explore partnerships with Senegalese cultural institutions"]
        ),
      },
      {
        phase: L("Étape 4", "Step 4"),
        title: L("Construction & Ouverture", "Construction & Opening"),
        period: L("À initier", "To be started"),
        status: "upcoming",
        details: LA(
          ["Construction du foyer", "Programmation des premières activités socio-culturelles"],
          ["Building the centre", "Programming the first socio-cultural activities"]
        ),
      },
    ],
    howToHelp: LA(
      [
        "Contribuer à la collecte de fonds dédiée",
        "Partager vos idées pour la vocation du foyer",
        "Vous impliquer via le comité Cité-Jardin",
      ],
      [
        "Contribute to the dedicated fundraiser",
        "Share your ideas for the centre's purpose",
        "Get involved through the Cité-Jardin committee",
      ]
    ),
    cta: { label: L("Proposer une idée", "Suggest an idea"), type: "contact", target: "adhesion" },
  },
];
