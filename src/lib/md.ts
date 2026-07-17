import { marked } from "marked";

// Rendu au build : le contenu vient du dépôt (édité via le CMS par des
// utilisateurs authentifiés), donc de confiance — pas de sanitisation requise.
marked.setOptions({ gfm: true, breaks: false });

/** Rendu markdown « bloc » : produit des <p>, <ul>, etc. */
export function md(src: string | undefined | null): string {
  if (!src) return "";
  return marked.parse(String(src), { async: false }) as string;
}

/** Rendu markdown « inline » : pas de <p> englobant (gras, liens…). */
export function mdInline(src: string | undefined | null): string {
  if (!src) return "";
  return marked.parseInline(String(src), { async: false }) as string;
}
