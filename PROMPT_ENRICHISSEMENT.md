# Prompt Claude Code — Enrichissement Grand Oral Mercatique

## Contexte

Tu travailles sur l'application **Grand Oral Mercatique** — un outil React (Vite) déployé sur Netlify pour les élèves de Terminale STMG. Le code source est dans `src/App.jsx` (fichier unique tout-en-un). L'app contient 42 fiches concepts, un moteur d'analyse par mots-clés, et une interface style Linked-U (font Outfit, fond crème `#FFFBF5`, palette multicolore).

Avant de coder quoi que ce soit, lis intégralement `src/App.jsx` pour comprendre la structure des données (tableau `F`), le moteur d'analyse (fonctions `tok`, `bi`, `sc`, `search`, `detectIntent`), et les composants UI (`Card`, `Det`, `App`).

---

## MISSION 1 — Enrichir les fiches en profondeur

### Objectif
Chaque fiche du tableau `F` dans `App.jsx` est actuellement résumée de façon trop concise. Tu dois enrichir **chaque fiche** pour qu'elle soit réellement utile à un élève qui prépare son Grand Oral.

### Ce que tu dois faire pour CHAQUE fiche (les 42)

1. **`definition`** — Réécrire en 2-3 phrases complètes, précises, niveau Terminale STMG. Utiliser le vocabulaire exact du programme officiel (BO). Ne pas simplifier à l'excès.

2. **`explicationSimple`** — Garder le ton accessible mais ajouter une analogie ou un exemple du quotidien de l'élève. 2-3 phrases. L'élève doit pouvoir se dire "ah oui je comprends" en lisant.

3. **`mecanismeMarketing`** — Développer en 3-4 phrases minimum. Expliquer le COMMENT concrètement : quels outils, quelles étapes, quelle logique l'entreprise suit. C'est la partie la plus utile pour le Grand Oral car elle donne la matière pour argumenter.

4. **`exemples`** — Chaque fiche doit avoir **minimum 2 exemples concrets** avec des marques connues des élèves (Netflix, Nike, Apple, McDonald's, Zara, Spotify, Amazon, IKEA, Decathlon, Shein, Vinted, TikTok, etc.). Chaque exemple doit faire 2-3 phrases et montrer concrètement comment le concept s'applique.

5. **`pistesDargumentation`** — Chaque fiche doit avoir **minimum 3 pistes**, formulées comme des angles de réponse pour le Grand Oral. Format : "Montrer que...", "Analyser comment...", "Comparer... et...", "Discuter si...". Ces pistes doivent être des VRAIS sujets de Grand Oral possibles.

6. **`motsCles`** — Enrichir significativement :
   - `directs` : minimum 6 mots-clés, incluant le terme exact + ses déclinaisons (singulier/pluriel, verbe/nom)
   - `indirects` : minimum 8 mots-clés périphériques qui pourraient apparaître dans une question d'élève sans nommer directement le concept
   - `synonymes` : minimum 3, incluant les termes anglais utilisés en marketing
   - `notionsProches` : minimum 4 concepts liés dans le programme

7. **`liensAutresConcepts`** — Vérifier que chaque fiche pointe vers au moins 3-4 autres fiches pertinentes (utiliser les `id` existants). Les liens doivent être bidirectionnels : si A pointe vers B, alors B doit aussi pointer vers A.

### Règles de contenu

- Utiliser le vocabulaire du programme officiel (BO Mercatique STMG)
- Les exemples doivent être actuels (2023-2026), pas datés
- Ne pas inventer de concepts hors programme
- Chaque fiche doit être autonome : un élève qui lit une seule fiche doit comprendre le concept sans avoir lu les autres
- Écrire en français, niveau Terminale (ni trop simple ni universitaire)

---

## MISSION 2 — Maillage interne entre concepts

### Objectif
Créer un vrai système de navigation entre les fiches, au-delà du simple listing de `liensAutresConcepts`.

### Ce que tu dois coder

#### A. Section "Concepts liés" améliorée dans le modal de détail (`Det`)

Remplacer la liste actuelle de tags par une section structurée en 3 niveaux :

```
🔗 Maillage des concepts
├── Prérequis : concepts à connaître AVANT celui-ci
├── Complémentaires : concepts du même thème qui enrichissent la compréhension
└── Prolongements : concepts qui UTILISENT celui-ci dans un raisonnement plus large
```

Pour cela, ajouter à chaque fiche du tableau `F` trois nouveaux champs :
- `prerequis: ["id1", "id2"]` — concepts qu'il faut comprendre avant
- `complementaires: ["id3", "id4"]` — concepts du même niveau/thème
- `prolongements: ["id5", "id6"]` — concepts qui vont plus loin

Afficher ces 3 niveaux dans le modal avec des couleurs différentes :
- Prérequis : badge jaune `#FDCB6E`
- Complémentaires : badge violet `#6C5CE7`
- Prolongements : badge lime `#00D2A0`

Chaque badge est cliquable et ouvre le modal du concept lié.

#### B. Vue "Explorer" — Carte de navigation des concepts

Ajouter un bouton "🗺️ Explorer les concepts" dans le header ou sous la barre de recherche (visible quand il n'y a pas de résultats affichés).

Cette vue affiche les 42 concepts organisés par thème, avec les liens visibles entre eux :

```
┌──────────────────────────────────────────────────┐
│  🗺️ Carte des concepts                          │
│                                                  │
│  Filtres : [Tous] [Thème 1] [Thème 2] [Thème 3] │
│                                                  │
│  📦 THÈME 1 — Définition de l'offre             │
│  ┌─────────────────────────────────────────────┐ │
│  │ Q1.1 Personnalisation                       │ │
│  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │ │
│  │ │Segm. │→│Cibl. │→│Posit.│→│Couple│       │ │
│  │ └──────┘ └──────┘ └──────┘ └──────┘       │ │
│  │                                             │ │
│  │ Q1.2 Expérience client                      │ │
│  │ ┌──────┐ ┌──────┐ ┌──────┐                │ │
│  │ │Exp.  │→│Mkt   │→│Valeur│                │ │
│  │ │conso │ │expér.│ │perçue│                │ │
│  │ └──────┘ └──────┘ └──────┘                │ │
│  └─────────────────────────────────────────────┘ │
│  ...                                             │
└──────────────────────────────────────────────────┘
```

Chaque mini-carte est cliquable et ouvre le modal de détail. Afficher les liens entre concepts avec des traits ou des flèches CSS.

#### C. Compteur de liens dans les cartes de résultat

Dans chaque `Card` de résultat, ajouter un petit indicateur :
```
🔗 4 concepts liés
```
pour montrer la richesse du maillage.

---

## MISSION 3 — Système de favoris

### Objectif
Permettre à l'élève de sauvegarder des fiches en favoris, les retrouver facilement, et les télécharger en PDF.

### Ce que tu dois coder

#### A. Bouton favoris sur chaque carte et dans le modal

- Ajouter une icône ★ (étoile) sur chaque `Card` de résultat (coin supérieur droit)
- Ajouter un bouton "★ Ajouter aux favoris" / "★ Retirer des favoris" dans le modal `Det`
- État : toggle étoile vide ☆ / étoile pleine ★
- Couleur de l'étoile active : `#FDCB6E` (jaune soleil du design system)

#### B. Stockage des favoris

- Utiliser `localStorage` avec la clé `"go-favoris"`
- Stocker un tableau d'IDs : `["segmentation", "marque", "fidelisation"]`
- Créer un hook ou un state `favoris` dans le composant `App` avec les fonctions :
  - `toggleFavori(id)` — ajoute ou retire
  - `isFavori(id)` — vérifie si un concept est en favoris

#### C. Vue "Mes favoris"

Ajouter un bouton "★ Mes favoris (N)" dans le header, à côté de "M. SEDDAR".
Le nombre N s'affiche en badge si > 0.

Au clic, afficher une vue dédiée :

```
┌──────────────────────────────────────────────────┐
│  ★ Mes favoris (5 fiches)                        │
│                                                  │
│  [📥 Télécharger en PDF]                         │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ Segm.    │ │ Marque   │ │ Fidélis. │         │
│  │ ★ ☒     │ │ ★ ☒     │ │ ★ ☒     │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│  ...                                             │
│                                                  │
│  Aucun favori ? Analyse une question et clique   │
│  sur ★ pour sauvegarder des concepts !           │
└──────────────────────────────────────────────────┘
```

Les cartes en favoris sont cliquables (ouvrent le modal) et ont un bouton ☒ pour retirer rapidement.

#### D. Export PDF des favoris

Quand l'élève clique "📥 Télécharger en PDF", générer un PDF contenant toutes les fiches en favoris.

Format du PDF pour chaque fiche :
```
═══════════════════════════════════
📌 [Titre du concept]
Thème X · Question X.X · [Sous-thème]
═══════════════════════════════════

📖 DÉFINITION
[definition]

💬 EN SIMPLE
[explicationSimple]

⚙️ MÉCANISME MARKETING
[mecanismeMarketing]

📌 EXEMPLES
• [marque] — [description]
• [marque] — [description]

🎯 PISTES POUR LE GRAND ORAL
→ [piste 1]
→ [piste 2]
→ [piste 3]

🔗 CONCEPTS LIÉS
[liste des concepts liés]

───────────────────────────────────
```

Pour générer le PDF, utiliser la bibliothèque `jspdf` :
```bash
npm install jspdf
```

Import dans `App.jsx` :
```javascript
import { jsPDF } from 'jspdf';
```

La fonction de génération doit :
1. Créer un document A4 portrait
2. Ajouter un titre "Grand Oral Mercatique — Mes fiches de révision"
3. Ajouter la date de génération
4. Ajouter chaque fiche avec mise en page propre
5. Gérer les sauts de page automatiques
6. Nommer le fichier `Grand_Oral_Mercatique_Fiches.pdf`

---

## MISSION 4 — Écran QR Code

### Objectif
Permettre au professeur (M. SEDDAR) de projeter un QR code en classe pour que les élèves accèdent directement à l'app sur leur téléphone.

### Ce que tu dois coder

#### A. Bouton "📱 QR Code" dans le header

Ajouter un bouton/icône dans le header, entre le logo et "M. SEDDAR".
Au clic, afficher un modal plein écran optimisé pour la projection.

#### B. Modal QR Code

```
┌──────────────────────────────────────────────────┐
│                                                  │
│           🎓 Grand Oral Mercatique               │
│                                                  │
│              ┌──────────────┐                    │
│              │              │                    │
│              │   QR CODE    │                    │
│              │   (grand)    │                    │
│              │              │                    │
│              └──────────────┘                    │
│                                                  │
│          Scanne pour accéder à l'app             │
│                                                  │
│     grand-oral-mercatique.netlify.app            │
│                                                  │
│              [✕ Fermer]                          │
│                                                  │
└──────────────────────────────────────────────────┘
```

#### C. Génération du QR Code

Utiliser la bibliothèque `qrcode` pour générer le QR code en SVG :
```bash
npm install qrcode
```

```javascript
import QRCode from 'qrcode';

// Générer en data URL pour afficher dans un <img>
const [qrUrl, setQrUrl] = useState('');
useEffect(() => {
  QRCode.toDataURL('https://grand-oral-mercatique.netlify.app', {
    width: 300,
    margin: 2,
    color: { dark: '#1A1A2E', light: '#FFFFFF' }
  }).then(setQrUrl);
}, []);
```

#### D. Design du modal QR

- Fond : blanc pur avec un léger gradient violet en bas
- QR code : grande taille (300×300 minimum), centré
- Titre : "Grand Oral Mercatique" en Outfit 800
- Sous-titre : "Scanne avec ton téléphone pour accéder à l'app"
- URL affichée en texte sous le QR code (pour ceux qui préfèrent taper)
- Le QR code doit pointer vers l'URL de production Netlify
- Bouton fermer discret en haut à droite

#### E. URL configurable

Stocker l'URL dans une constante en haut du fichier :
```javascript
const APP_URL = 'https://grand-oral-mercatique.netlify.app';
```
Pour pouvoir la changer facilement après déploiement si le domaine change.

---

## MISSION 5 — Améliorations UX mineures

En plus des 4 missions principales, appliquer ces améliorations :

1. **Compteur de thèmes dans les résultats** — Après une recherche, afficher sous la barre de question : "📦 3 concepts Thème 1 · 🚚 1 concept Thème 2 · 📢 2 concepts Thème 3"

2. **Animation de chargement** — Quand l'élève clique "Analyser", afficher une micro-animation de 300ms (3 points qui pulsent) au lieu du texte "..." dans le bouton.

3. **Raccourci clavier** — `Ctrl+K` ou `Cmd+K` pour focus la barre de recherche depuis n'importe où.

4. **Bouton "Copier la question"** — Dans la section résultats, ajouter un petit bouton 📋 à côté de la question pour la copier dans le presse-papier (utile si l'élève veut la coller dans un document).

5. **Compteur de fiches vues** — Afficher dans le footer ou le header "X fiches consultées" basé sur localStorage, pour motiver l'élève à explorer.

---

## Contraintes techniques

- **Tout reste dans `src/App.jsx`** — ne pas éclater en plusieurs fichiers. C'est un choix délibéré pour la simplicité du projet.
- **Pas d'API externe** — tout côté client
- **Les nouvelles dépendances** (`jspdf`, `qrcode`) doivent être ajoutées au `package.json`
- **Tester le build** après chaque mission : `npm run build` doit passer sans erreur
- **Pas de localStorage pour les favoris si on est en navigation privée** — wraper les appels localStorage dans un try/catch
- **Le design doit rester cohérent** avec le système existant : Outfit, palette Linked-U, blobs, cartes arrondies, gradients

## Ordre d'exécution

1. MISSION 2 d'abord (maillage — c'est la structure)
2. MISSION 1 ensuite (enrichir les fiches — le contenu)
3. MISSION 3 (favoris — la fonctionnalité)
4. MISSION 4 (QR code — rapide)
5. MISSION 5 (UX — finitions)

Après chaque mission, faire un commit Git :
```
git add -A && git commit -m "feat: [description de la mission]"
```

À la fin, pousser et redéployer :
```
git push origin main
```
Netlify rebuildera automatiquement.
