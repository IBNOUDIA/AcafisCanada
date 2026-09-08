export interface BureauMember {
  id: string;
  name: string;
  role: string;
  category: "presidence" | "admin_finances" | "commissions" | "communication";
  subCategory?: string;
  bio?: string;
  email?: string;
}

export interface Activity {
  id: string;
  season: "Hiver (Jan-Mars)" | "Printemps (Avril-Juin)" | "Été (Juillet-Sept)" | "Automne (Oct-Déc)";
  title: string;
  subtitle: string;
  description: string;
  location: string;
  tags: string[];
}

export interface ProjectPhase {
  phase: string;
  title: string;
  period: string;
  status: "completed" | "in_progress" | "upcoming";
  details: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  iconName: string;
  category: "diaspora" | "education" | "habitat" | "solidarity";
  deliverables: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  city: string;
  avatar: string;
  quote: string;
  highlight: string;
  rating: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  size: string;
  description: string;
  contentSummary: string[];
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
}
