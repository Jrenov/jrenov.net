/**
 * Pages libres créées par l'éditeur via le CMS (collection « Pages
 * supplémentaires »). Chaque page = un fichier src/data/pages/<nom>.json.
 */
import { services } from "./services.ts";

export interface PageSection {
  heading?: string;
  text?: string;
  image?: string;
  imageAlt?: string;
}

export interface CustomPage {
  title: string;
  url: string;
  published: boolean;
  linkPlacement: "menu" | "footer" | "none";
  menuLabel?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
  photo?: string;
  photoAlt?: string;
  sections?: PageSection[];
  showCallButton?: boolean;
  showContactForm?: boolean;
  contactHeading?: string;
}

// Adresses déjà utilisées par les pages « fixes » du site : une page libre ne
// peut pas les écraser (le CMS l'empêche aussi, c'est un second filet).
export const RESERVED = new Set([
  "",
  "index",
  "admin",
  "api",
  "images",
  "sitemap",
  "mentions-legales",
  "renovation-vannes",
  ...services.map((s) => s.slug),
]);

/** Normalise une adresse saisie à la main : « Ma Page » → « ma-page ». */
export function cleanUrl(raw: string): string {
  return String(raw ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const files = import.meta.glob<{ default: CustomPage }>("../data/pages/*.json", { eager: true });

const all: CustomPage[] = Object.entries(files).map(([path, mod]) => {
  const p = mod.default;
  return { ...p, url: cleanUrl(p.url || path.split("/").pop()!.replace(/\.json$/, "")) };
});

const seen = new Set<string>();
/** Pages publiées, valides et sans doublon d'adresse. */
export const pages: CustomPage[] = all.filter((p) => {
  if (!p.published) return false;
  if (!p.url || RESERVED.has(p.url)) {
    console.warn(`[pages] « ${p.title} » ignorée : adresse « ${p.url} » réservée ou vide.`);
    return false;
  }
  if (seen.has(p.url)) {
    console.warn(`[pages] « ${p.title} » ignorée : adresse « ${p.url} » déjà utilisée.`);
    return false;
  }
  seen.add(p.url);
  return true;
});

export const menuPages = pages.filter((p) => p.linkPlacement === "menu");
export const footerPages = pages.filter((p) => p.linkPlacement === "footer");
