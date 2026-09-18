import { useLanguage } from "./LanguageContext";

// Phase 1 of the bilingual rollout: navigation chrome, footer, homepage,
// and page titles — the content nearly every visitor sees regardless of
// which page they land on. Deeper page content (bios, project roadmaps,
// mission descriptions...) stays French-only for now and is translated in
// a later pass; those pages simply render their existing French content
// under the /en/* URLs in the meantime.

const fr = {
  "nav.accueil": "Accueil",
  "nav.espace-jeune": "Espace Jeune",
  "nav.programme": "Programme",
  "nav.media": "Média",
  "nav.mission-service": "Missions & Services",
  "nav.projets": "Grands Projets",
  "nav.acafis-mentor": "Acafis Mentor",
  "nav.bureau": "Bureau",
  "nav.temoignages": "Témoignages",
  "nav.adhesion": "Adhésion & Contact",
  "nav.boutique": "Boutique",
  "nav.coop-acafis": "Coop-ACAFIS",
  "nav.topbar.tagline": "Le cœur battant de la diaspora pour le développement solidaire",
  "nav.topbar.membership": "Carte membre : 25$ CAD",
  "nav.topbar.copy": "Copié !",
  "nav.topbar.payment": "Paiement 25$",
  "nav.mentorBtn": "Acafis Mentor",
  "nav.mentorBtnShort": "Mentor",
  "nav.membershipBtn": "Adhésion (25$)",
  "nav.loginBtn": "Espace Membre",
  "nav.loginBtnFull": "Espace Membre / Connexion",
  "nav.paymentBtnMobile": "Paiement Interac",
  "nav.langSwitch": "English",
  "nav.ariaOpenMenu": "Ouvrir le menu",

  "footer.tagline": "Le cœur battant de la diaspora pour le développement solidaire entre le Canada et le Sénégal.",
  "footer.quickLinks": "Liens Rapides",
  "footer.statutes": "Statuts & Règlement",
  "footer.joinUs": "Nous Rejoindre",
  "footer.membershipCard": "Carte de Membre",
  "footer.copyright": "© 2026 ACAFIS Canada",
  "footer.paymentInterac": "Paiement Interac",
  "footer.contact": "Contact",
  "footer.developedBy": "Développé par : www.amardia.ca",

  "hero.tag": "Le Cœur Battant de la Diaspora",
  "hero.headline1": "L'alliance de la diaspora pour un",
  "hero.headlineHighlight": "développement solidaire",
  "hero.headline2": "et durable.",
  "hero.subhead1": "Fiers des valeurs de la",
  "hero.subheadTeranga": "Teranga",
  "hero.subhead2": "et engagés pour l'avenir : de l'habitat durable à la",
  "hero.subheadCite": "Cité Jardin Ndianda",
  "hero.subhead3": "au soutien scolaire avec notre",
  "hero.subheadMentor": "Mentor IA",
  "hero.subhead4": ".",
  "hero.highlight1": "Habitat sécurisé avec",
  "hero.highlight2": "Colonie 2030 à la",
  "hero.highlight3": "Soutien scolaire & code avec",
  "hero.highlight4": "Cotisation solidaire :",
  "hero.ctaMembership": "Devenir Membre (25$ CAD)",
  "hero.ctaServices": "Nos Missions & Services",
  "hero.ctaMentor": "Acafis Mentor 🎓",
  "hero.interacLabel": "Virement Interac (Canada) :",
  "hero.interacCopied": "Copié dans le presse-papier !",
  "hero.interacModalities": "Modalités 25$ CAD",
  "hero.cardTitle": "Cité Jardin • Ndianda",
  "hero.cardSubtitle": "Colonie 2030 « Racines & Avenir »",
  "hero.cardAgeRange": "10 - 17 Ans",
  "hero.impactLabel": "Impact Concret d'une Adhésion",
  "hero.impactConversion": "25$ CAD = 11 250 FCFA",
  "hero.highlightMemorial": "Tourisme Mémoriel :",
  "hero.highlightMemorialDesc": "Gorée & Musée des Civilisations Noires.",
  "hero.highlightTech": "Tech & Agro-Écologie :",
  "hero.highlightTechDesc": "Ateliers IA et maraîchage durable.",
  "hero.discoverEspaceJeune": "Découvrir l'Espace Jeune & Cité Jardin",
  "hero.barometerMembers": "Membres Élus",
  "hero.barometerFee": "Cotisation / An",
  "hero.barometerSeasons": "D'Activités",
  "hero.barometerSeasonsValue": "4 Saisons",
  "hero.photoCaption": "📸 Grand rassemblement communautaire ACAFIS",

  "page.title.accueil": "ACAFIS Canada",
  "page.title.espace-jeune": "Espace Jeune — ACAFIS Canada",
  "page.title.programme": "Programme — ACAFIS Canada",
  "page.title.media": "Média — ACAFIS Canada",
  "page.title.mission-service": "Missions & Services — ACAFIS Canada",
  "page.title.projets": "Grands Projets — ACAFIS Canada",
  "page.title.acafis-mentor": "Acafis Mentor — ACAFIS Canada",
  "page.title.bureau": "Bureau — ACAFIS Canada",
  "page.title.temoignages": "Témoignages — ACAFIS Canada",
  "page.title.adhesion": "Adhésion & Contact — ACAFIS Canada",
};

const en: typeof fr = {
  "nav.accueil": "Home",
  "nav.espace-jeune": "Youth Space",
  "nav.programme": "Programs",
  "nav.media": "Media",
  "nav.mission-service": "Missions & Services",
  "nav.projets": "Major Projects",
  "nav.acafis-mentor": "Acafis Mentor",
  "nav.bureau": "Board",
  "nav.temoignages": "Testimonials",
  "nav.adhesion": "Membership & Contact",
  "nav.boutique": "Shop",
  "nav.coop-acafis": "Coop-ACAFIS",
  "nav.topbar.tagline": "The beating heart of the diaspora for solidarity-driven development",
  "nav.topbar.membership": "Membership card: $25 CAD",
  "nav.topbar.copy": "Copied!",
  "nav.topbar.payment": "Payment $25",
  "nav.mentorBtn": "Acafis Mentor",
  "nav.mentorBtnShort": "Mentor",
  "nav.membershipBtn": "Membership ($25)",
  "nav.loginBtn": "Member Area",
  "nav.loginBtnFull": "Member Area / Log In",
  "nav.paymentBtnMobile": "Interac Payment",
  "nav.langSwitch": "Français",
  "nav.ariaOpenMenu": "Open menu",

  "footer.tagline": "The beating heart of the diaspora for solidarity-driven development between Canada and Senegal.",
  "footer.quickLinks": "Quick Links",
  "footer.statutes": "Bylaws & Regulations",
  "footer.joinUs": "Join Us",
  "footer.membershipCard": "Membership Card",
  "footer.copyright": "© 2026 ACAFIS Canada",
  "footer.paymentInterac": "Interac Payment",
  "footer.contact": "Contact",
  "footer.developedBy": "Built by: www.amardia.ca",

  "hero.tag": "The Beating Heart of the Diaspora",
  "hero.headline1": "The diaspora's alliance for",
  "hero.headlineHighlight": "solidarity-driven development",
  "hero.headline2": "that lasts.",
  "hero.subhead1": "Proud of the values of",
  "hero.subheadTeranga": "Teranga",
  "hero.subhead2": "and committed to the future: from sustainable housing at the",
  "hero.subheadCite": "Cité Jardin Ndianda",
  "hero.subhead3": "to academic support with our",
  "hero.subheadMentor": "AI Mentor",
  "hero.subhead4": ".",
  "hero.highlight1": "Secure housing with",
  "hero.highlight2": "2030 Summer Camp at the",
  "hero.highlight3": "Academic support & coding with",
  "hero.highlight4": "Solidarity membership fee:",
  "hero.ctaMembership": "Become a Member ($25 CAD)",
  "hero.ctaServices": "Our Missions & Services",
  "hero.ctaMentor": "Acafis Mentor 🎓",
  "hero.interacLabel": "Interac e-Transfer (Canada):",
  "hero.interacCopied": "Copied to clipboard!",
  "hero.interacModalities": "$25 CAD Details",
  "hero.cardTitle": "Cité Jardin • Ndianda",
  "hero.cardSubtitle": "2030 Summer Camp « Roots & Future »",
  "hero.cardAgeRange": "Ages 10 - 17",
  "hero.impactLabel": "The Concrete Impact of a Membership",
  "hero.impactConversion": "$25 CAD = 11,250 FCFA",
  "hero.highlightMemorial": "Memorial Tourism:",
  "hero.highlightMemorialDesc": "Gorée Island & Museum of Black Civilizations.",
  "hero.highlightTech": "Tech & Agro-Ecology:",
  "hero.highlightTechDesc": "AI workshops and sustainable market gardening.",
  "hero.discoverEspaceJeune": "Discover the Youth Space & Cité Jardin",
  "hero.barometerMembers": "Elected Members",
  "hero.barometerFee": "Fee / Year",
  "hero.barometerSeasons": "of Activities",
  "hero.barometerSeasonsValue": "4 Seasons",
  "hero.photoCaption": "📸 Large ACAFIS community gathering",

  "page.title.accueil": "ACAFIS Canada",
  "page.title.espace-jeune": "Youth Space — ACAFIS Canada",
  "page.title.programme": "Programs — ACAFIS Canada",
  "page.title.media": "Media — ACAFIS Canada",
  "page.title.mission-service": "Missions & Services — ACAFIS Canada",
  "page.title.projets": "Major Projects — ACAFIS Canada",
  "page.title.acafis-mentor": "Acafis Mentor — ACAFIS Canada",
  "page.title.bureau": "Board — ACAFIS Canada",
  "page.title.temoignages": "Testimonials — ACAFIS Canada",
  "page.title.adhesion": "Membership & Contact — ACAFIS Canada",
};

export const translations = { fr, en };
export type TranslationKey = keyof typeof fr;

export interface ImpactExample {
  title: string;
  desc: string;
  icon: string;
  category: string;
  highlightColor: string;
}

const heroImpactExamplesFr: ImpactExample[] = [
  {
    title: "1 Kit Scolaire & Pédagogique",
    desc: "Fournitures et manuels distribués aux écoliers des zones partenaires à Ndianda.",
    icon: "📚",
    category: "Éducation & Jeunesse",
    highlightColor: "text-amber-300",
  },
  {
    title: "Atelier Code & IA pour un Jeune",
    desc: "Prise en charge d'un mois de tutorat numérique et accès aux sessions Acafis Mentor.",
    icon: "💻",
    category: "Technologies & Avenir",
    highlightColor: "text-emerald-300",
  },
  {
    title: "3 Arbres Fruitiers • Cité Jardin",
    desc: "Plantation et irrigation agro-écologique sur le domaine foncier de Ndianda.",
    icon: "🌱",
    category: "Environnement & Teranga",
    highlightColor: "text-sky-300",
  },
];

const heroImpactExamplesEn: ImpactExample[] = [
  {
    title: "1 School & Educational Kit",
    desc: "Supplies and textbooks distributed to schoolchildren in partner areas of Ndianda.",
    icon: "📚",
    category: "Education & Youth",
    highlightColor: "text-amber-300",
  },
  {
    title: "Code & AI Workshop for a Youth",
    desc: "One month of digital tutoring and access to Acafis Mentor sessions.",
    icon: "💻",
    category: "Technology & Future",
    highlightColor: "text-emerald-300",
  },
  {
    title: "3 Fruit Trees • Cité Jardin",
    desc: "Planting and agro-ecological irrigation on the Ndianda land.",
    icon: "🌱",
    category: "Environment & Teranga",
    highlightColor: "text-sky-300",
  },
];

export const HERO_IMPACT_EXAMPLES: Record<"fr" | "en", ImpactExample[]> = {
  fr: heroImpactExamplesFr,
  en: heroImpactExamplesEn,
};

export const useTranslation = () => {
  const { lang } = useLanguage();
  const t = (key: TranslationKey): string => translations[lang][key] ?? translations.fr[key] ?? key;
  return { t, lang };
};
