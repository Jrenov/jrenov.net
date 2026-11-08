# Mise en place du CMS (Sveltia) — guide technique

Le site est un projet **Astro** (statique) déployé sur **Netlify**. Le contenu
vit dans `src/data/*.json` et les pages Astro le lisent au build. L'édition sans
code passe par **Sveltia CMS** sur **/admin** (authentification GitHub).

Une sauvegarde dans le CMS = un commit sur `main` → Netlify rebuild → le HTML est
régénéré (donc le SEO reste solide, y compris les données structurées).

## Développement local

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/
npm run preview  # prévisualise le build
```

## Architecture

```
src/
  data/                Contenu éditable (JSON, géré par le CMS)
    site.json          Coordonnées & marque
    home.json          Page d'accueil
    services/*.json    Pages plombier / électricien / serrurier / débouchage
    renovation.json    Page rénovation
    legal.json         Mentions légales
    pages/*.json       Pages supplémentaires créées depuis l'admin (1 fichier = 1 page)
    seo.json           Données structurées techniques (PAS éditées via le CMS)
  components/          Header, SiteNav, Faq, ContactSection, ServicePhoto, carrousel…
  layouts/Base.astro   Layout commun (head/SEO, header, nav, footer)
  lib/                 md.ts (markdown), jsonld.ts (données structurées), site.ts…
  pages/               index, [service] (4 pages dépannage), renovation-vannes, mentions-legales,
                       [...page] (pages supplémentaires), sitemap.xml.ts (sitemap auto)
public/
  images/              Images du site (+ images/uploads = téléversements CMS)
  admin/               Sveltia CMS (index.html + config.yml) + guide.html (guide éditeur)
netlify/functions/     auth.mjs + callback.mjs (OAuth GitHub du CMS)
```

## Configuration de l'authentification GitHub (à faire une fois)

Le CMS écrit dans le dépôt `Jrenov/jrenov.net` via l'API GitHub. Il faut une **OAuth
App GitHub** + deux variables d'environnement Netlify.

### 1. Créer l'OAuth App GitHub

GitHub → *Settings → Developer settings → OAuth Apps → New OAuth App* :

- **Application name** : `Jrenov CMS`
- **Homepage URL** : `https://jrenov.net`
- **Authorization callback URL** : `https://jrenov.net/api/callback`

Récupère le **Client ID** et génère un **Client Secret**.

### 2. Variables d'environnement Netlify

Netlify → *Site settings → Environment variables* :

| Variable | Valeur |
|---|---|
| `OAUTH_GITHUB_CLIENT_ID` | le Client ID de l'OAuth App |
| `OAUTH_GITHUB_CLIENT_SECRET` | le Client Secret de l'OAuth App |

### 3. Donner accès à l'éditeur

Pour que **Jean René** puisse se connecter, l'ajouter comme **collaborateur** du
dépôt `Jrenov/jrenov.net` (GitHub → Settings → Collaborators) avec un accès en
écriture. Il lui faut un compte GitHub.

## Déploiement Netlify

`netlify.toml` est configuré : `command = "npm run build"`, `publish = "dist"`,
dossier des fonctions `netlify/functions`, redirections `/api/auth` et
`/api/callback`.

Le formulaire de contact utilise **Netlify Forms** (aucun backend) : les
soumissions arrivent dans *Site settings → Forms*. Penser à y ajouter une
notification e-mail vers `jrenov56@gmail.com`.

## Images

- Les images téléversées via le CMS vont dans `public/images/uploads/`.
- Le composant `ServicePhoto.astro` sert les photos via le **CDN d'images
  Netlify** (`/.netlify/images`, redimensionnement + webp). Ce CDN ne fonctionne
  qu'une fois déployé sur Netlify (en local, l'image brute est servie).
- Les pages de dépannage ont un **emplacement photo** masqué tant qu'aucune
  photo n'est renseignée (voir `docs/GUIDE-JEAN-RENE.md`).

## Note SEO

Comme le contenu est régénéré au build, les modifications faites dans le CMS
(textes, FAQ, coordonnées) sont rendues en HTML statique **et** répercutées dans
les données structurées (JSON-LD) — pas de désynchronisation entre l'affichage et
le SEO.

## Pages supplémentaires (créées depuis l'admin)

- Collection CMS **« Pages supplémentaires »** (dossier `src/data/pages/`, un JSON par page).
- Rendu par `src/pages/[...page].astro`, logique dans `src/lib/pages.ts`.
- Champ `published` = brouillon / en ligne ; `linkPlacement` = menu du haut, pied de page ou aucun lien.
- Les adresses des pages fixes sont **réservées** (`RESERVED` dans `src/lib/pages.ts` + `pattern` du champ `url`
  dans `config.yml`) : une page qui tenterait de les réutiliser est ignorée au build (warning), le site
  continue de se construire. **Si tu ajoutes une page fixe, ajoute son adresse aux deux endroits.**
- Le sitemap (`/sitemap.xml`) est généré au build et inclut automatiquement les pages publiées.
- Formulaire de contact de ces pages : Netlify Form `contact-pages`, avec un champ caché `page` (titre de la page).
- `src/data/pages/exemple-page-modele.json` est un exemple **non publié**, à dupliquer.
