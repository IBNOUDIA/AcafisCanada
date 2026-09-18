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
  { id: "projets", path: "/projets", label: "Grands Projets" },
  { id: "acafis-mentor", path: "/acafis-mentor", label: "Acafis Mentor" },
  { id: "bureau", path: "/bureau", label: "Bureau" },
  { id: "temoignages", path: "/temoignages", label: "Témoignages" },
  { id: "adhesion", path: "/adhesion", label: "Adhésion & Contact" },
];

// French path for a given section id (canonical, unprefixed).
export const pathForId = (id: string): string =>
  PAGE_ROUTES.find((r) => r.id === id)?.path ?? "/";

// Section id for a path — strips a leading "/en" prefix first, so both
// "/programme" and "/en/programme" resolve to the same "programme" id.
export const idForPath = (path: string): string => {
  const stripped = path === "/en" || path.startsWith("/en/") ? path.slice(3) || "/" : path;
  return PAGE_ROUTES.find((r) => r.path === stripped)?.id ?? "accueil";
};
