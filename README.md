# Jrenov — site vitrine

Site de **Jrenov** (Jean René Drouet), artisan dépanneur et rénovation à Vannes
(56). Construit avec [Astro](https://astro.build) (statique), déployé sur
**Netlify**, éditable sans code via **Sveltia CMS** sur `/admin`.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/
npm run preview  # prévisualise le build
```

## Contenu & CMS

- Le contenu est dans `src/data/*.json` (lu par les pages Astro au build).
- Édition sans code : **/admin** (Sveltia CMS, auth GitHub).
- Guide éditeur (non technique) : [`docs/GUIDE-JEAN-RENE.md`](docs/GUIDE-JEAN-RENE.md)
- Mise en place technique du CMS : [`docs/CMS-SETUP.md`](docs/CMS-SETUP.md)

## Pages

`/` (accueil) · `/plombier-vannes` · `/electricien-vannes` · `/serrurier-vannes`
· `/debouchage-canalisation-vannes` · `/renovation-vannes` · `/mentions-legales`

Les 4 pages de dépannage disposent d'un **emplacement photo** éditable via le CMS
(masqué tant qu'aucune photo n'est ajoutée).
