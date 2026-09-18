import React, { createContext, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type Lang = "fr" | "en";

interface LanguageContextValue {
  lang: Lang;
  toggleLang: () => void;
  localizePath: (path: string, targetLang?: Lang) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Removes a leading "/en" prefix from a path, if present.
export const stripLangPrefix = (pathname: string): string => {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
};

export const detectLangFromPath = (pathname: string): Lang =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = detectLangFromPath(location.pathname);

  const localizePath = useCallback(
    (path: string, targetLang: Lang = lang): string => {
      const base = stripLangPrefix(path);
      return targetLang === "en" ? (base === "/" ? "/en" : `/en${base}`) : base;
    },
    [lang]
  );

  const toggleLang = useCallback(() => {
    const target: Lang = lang === "fr" ? "en" : "fr";
    navigate(localizePath(location.pathname, target) + location.search);
  }, [lang, localizePath, navigate, location.pathname, location.search]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, localizePath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
};
