export interface PageRoute {
  id: string;
  path: string;
  label: string;
}

// Real, bookmarkable pages — one per section, flat (no submenus).
export const PAGE_ROUTES: PageRoute[] = [
  { id: "accueil", path: "/", label: "Accueil" },
  { id: "espace-jeune", path: "/espace-jeune", label: "Espace Jeune" },
  { id: "programme", path: "/programme", label: "Programme" },
  { id: "media", path: "/media", label: "Média" },
  { id: "mission-service", path: "/mission-service", label: "Missions & Services" },
  { id: "acafis-mentor", path: "/acafis-mentor", label: "Acafis Mentor" },
  { id: "bureau", path: "/bureau", label: "Bureau" },
  { id: "temoignages", path: "/temoignages", label: "Témoignages" },
  { id: "adhesion", path: "/adhesion", label: "Adhésion" },
  { id: "contact", path: "/contact", label: "Contact" },
];

export const pathForId = (id: string): string =>
  PAGE_ROUTES.find((r) => r.id === id)?.path ?? "/";

export const idForPath = (path: string): string =>
  PAGE_ROUTES.find((r) => r.path === path)?.id ?? "accueil";
