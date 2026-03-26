# Prompt Claude Code — Déploiement Grand Oral Mercatique

## Contexte

Ce dossier contient une application React (Vite) prête à déployer sur Netlify.
C'est un outil de préparation au Grand Oral pour les élèves de Terminale STMG spécialité Mercatique.

## Structure du projet

```
grand-oral-mercatique/
├── index.html              ← point d'entrée HTML
├── package.json            ← dépendances (React 18 + Vite 6)
├── vite.config.js          ← config Vite + plugin React
├── netlify.toml            ← config Netlify (build + redirects SPA)
├── .gitignore
└── src/
    ├── main.jsx            ← point d'entrée React
    └── App.jsx             ← APPLICATION COMPLÈTE (tout-en-un)
```

## Ce que contient l'application

- **42 fiches concepts** couvrant les 3 thèmes du BO officiel Mercatique STMG
  - Thème 1 : Définition de l'offre (19 fiches)
  - Thème 2 : Distribution de l'offre (10 fiches)
  - Thème 3 : Communication de l'offre (13 fiches)
- **Moteur d'analyse** côté client (JS pur, zéro API) :
  - Tokenisation + stop words français
  - Extraction bigrammes
  - Détection d'intention (expliquer, comparer, débattre, etc.)
  - Scoring pondéré (mots-clés directs ×3, indirects ×2, synonymes ×1.5)
- **Interface** : barre de recherche, cartes résultats, modal de détail, pistes d'argumentation, grille d'évaluation Grand Oral
- **Design** : palette Linked-U (Outfit, fond crème #FFFBF5, violet #6C5CE7, corail #FF6B6B, lime #00D2A0, rose #FD79A8, jaune #FDCB6E, blobs flottants)
- **Persistance** : historique des questions en localStorage

## Tâche : Déployer sur Netlify

### Étape 1 — Initialiser le repo Git

```bash
cd grand-oral-mercatique
git init
git add -A
git commit -m "Grand Oral Mercatique — v1.0"
```

### Étape 2 — Créer le repo GitHub

```bash
gh repo create racsed/grand-oral-mercatique --public --source=. --push
```

### Étape 3 — Installer les dépendances et tester le build

```bash
npm install
npm run build
```

Vérifier que le dossier `dist/` est bien généré avec `index.html` + assets.

### Étape 4 — Déployer sur Netlify

Option A — Via CLI Netlify :
```bash
npx netlify-cli deploy --prod --dir=dist
```

Option B — Via le dashboard Netlify :
1. Aller sur https://app.netlify.com
2. Import existing project → GitHub → racsed/grand-oral-mercatique
3. Build command : `npm run build`
4. Publish directory : `dist`
5. Deploy

### Étape 5 — Configurer le domaine (optionnel)

Si un domaine personnalisé est souhaité (ex: `grand-oral.netlify.app` ou un custom domain), le configurer dans Netlify > Domain settings.

## Règles importantes

- Le fichier `App.jsx` contient TOUT : données, moteur, composants, styles. C'est volontaire — single-file pour la simplicité.
- La mention **M. SEDDAR** apparaît dans le header (coin droit).
- Les fiches sont basées sur le programme officiel du BO + le manuel Delagrave (16 chapitres de synthèse).
- Aucune API externe n'est utilisée. Tout fonctionne côté client.
- La font **Outfit** est chargée via Google Fonts dans le CSS inline (balise `<style>` dans le composant).

## Si tu dois modifier quelque chose

- **Ajouter/modifier des fiches** : éditer le tableau `F` dans `App.jsx`. Chaque fiche suit le schéma : `{id, titre, theme, themeLabel, question, questionLabel, sousTheme, definition, explicationSimple, mecanismeMarketing, exemples[], liensAutresConcepts[], pistesDargumentation[], motsCles{directs[], indirects[], synonymes[], notionsProches[]}}`.
- **Changer les couleurs** : les CSS variables sont dans la string `G` (constante CSS) et dans l'objet `TC` (config par thème).
- **Changer le nom du prof** : chercher `M. SEDDAR` dans le header.
