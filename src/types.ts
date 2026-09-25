// A value that reads differently in French vs English — real prose content
// (bios, descriptions, roadmap steps...) uses this instead of a plain string
// so every component can resolve it with `field[lang]`. Proper names, email
// addresses, phone numbers and other language-independent facts stay plain
// strings.
export interface Localized<T = string> {
  fr: T;
  en: T;
}

export interface BureauMember {
  id: string;
  name: string;
  role: Localized;
  category: "presidence" | "admin_finances" | "commissions" | "communication";
  subCategory?: Localized;
  bio?: Localized;
  email?: string;
  phone?: string;
}

export interface Activity {
  id: string;
  season: Localized;
  title: Localized;
  subtitle: Localized;
  description: Localized;
  location: string;
  tags: Localized<string[]>;
  photo?: string;
}

export interface ProjectPhase {
  phase: Localized;
  title: Localized;
  period: Localized;
  status: "completed" | "in_progress" | "upcoming";
  details: Localized<string[]>;
}

// A major, multi-year ACAFIS undertaking (habitat, infrastructure, etc.) —
// distinct from the recurring "missions" on the Services page, which don't
// have a completion arc. Each one gets its own phased roadmap, like the
// Colonie de Vacances already has.
export interface MajorProject {
  id: string;
  title: Localized;
  tagline: Localized;
  description: Localized;
  roadmap: ProjectPhase[];
  howToHelp: Localized<string[]>;
  cta: { label: Localized; type: "internal" | "external" | "contact"; target: string };
  photo?: string;
}

export interface ServiceItem {
  id: string;
  title: Localized;
  shortDesc: Localized;
  description: Localized;
  iconName: string;
  category: "diaspora" | "education" | "habitat" | "solidarity";
  deliverables: Localized<string[]>;
}

export interface Testimonial {
  id: string;
  name: string;
  role: Localized;
  city: string;
  avatar: string;
  quote: Localized;
  highlight: Localized;
  rating: number;
}

export interface DocumentItem {
  id: string;
  title: Localized;
  type: Localized;
  size: string;
  description: Localized;
  contentSummary: Localized<string[]>;
}

export interface BoutiqueItem {
  id: string;
  name: string;
  priceCAD: number;
  category: string;
  badge?: string;
  description: string;
  image: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
  topic?: string;
  attachmentName?: string;
}

export interface MemberRecord {
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  membershipYear: number;
  annualFee: string;
  issuedAt: string;
  status: string;
  paymentStatus?: "pending" | "paid";
  coopInterest?: boolean;
}

// A child under 18 declared by a member for the family census (youth
// activity planning + beneficiary count). Name is optional by design.
export interface MemberChild {
  id: string;
  firstName: string | null;
  birthYear: number;
  gender: "feminin" | "masculin" | "autre";
}

// A members-only document (AG minutes, annual financial report...) — the
// actual file lives wherever the secretariat already hosts it (Drive,
// Dropbox...); this just points to it.
export interface MemberDocument {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  publishedAt: string;
}
