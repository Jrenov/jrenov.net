// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://jrenov.net',
  build: {
    // Génère des fichiers plats (plombier-vannes.html) plutôt que des dossiers,
    // pour conserver exactement les URLs actuelles (avec les pretty URLs Netlify).
    format: 'file',
    inlineStylesheets: 'auto',
  },
});
