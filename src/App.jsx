import { useState, useRef, useCallback, useEffect } from "react";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

/* ═══════════════════════════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════════════════════════ */
const APP_URL = "https://grand-oral-mercatique.netlify.app";

/* ═══════════════════════════════════════════════════════════════
   BASE DE CONNAISSANCES — 42 FICHES MERCATIQUE STMG
   Enrichies + maillage (prerequis, complementaires, prolongements)
   ═══════════════════════════════════════════════════════════════ */
const F = [
  /* ──────────── THÈME 1 — Q1.1 Personnalisation ──────────── */
  {
    id: "segmentation",
    titre: "La segmentation du marché",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Personnalisation de l'offre",
    definition: "La segmentation consiste à découper le marché en sous-ensembles de consommateurs (segments) présentant des comportements d'achat ou des besoins homogènes, afin d'adapter l'action commerciale à chaque groupe. Elle repose sur des critères sociodemographiques, géographiques, psychographiques ou comportementaux. C'est la première étape de la démarche SCP (Segmenter-Cibler-Positionner).",
    explicationSimple: "Imagine une classe de 30 élèves : certains adorent le sport, d'autres la musique, d'autres les jeux vidéo. Si tu veux vendre des places de concert, tu ne t'adresses pas à tout le monde de la même façon. La segmentation, c'est regrouper ceux qui se ressemblent pour mieux leur parler et leur proposer ce qu'ils veulent vraiment.",
    mecanismeMarketing: "L'entreprise collecte des données sur ses clients (âge, revenus, habitudes d'achat, centres d'intérêt) via des enquêtes, le CRM ou les données numériques. Elle analyse ensuite ces données pour identifier des groupes homogènes. Chaque segment doit être mesurable, accessible, rentable et distinct des autres. Une fois les segments identifiés, l'entreprise adapte son mix marketing (produit, prix, communication, distribution) à chaque cible retenue.",
    exemples: [
      { marque: "Nespresso", description: "Nespresso segmente son marche en plusieurs niveaux : capsules Original pour les puristes de l'expresso, gamme Vertuo pour les amateurs de grandes tasses, et Nespresso Professional pour les entreprises et hôtels. Chaque segment à son propre catalogue, ses prix et sa communication dédiée." },
      { marque: "Netflix", description: "Netflix segmente par comportement de visionnage grâce à ses algorithmes. Le service identifié des micro-segments (amateurs de thrillers coreens, fans de documentaires nature, etc.) et crée des contenus originaux cibles pour chaque groupe, maximisant ainsi l'engagement et réduisant le churn." },
      { marque: "Decathlon", description: "Decathlon segmente par niveau de pratique sportive : débutant, regulier, expert. Sa marque Quechua propose des tentes à 20 euros pour les débutants et des modèles techniques à 400 euros pour les alpinistes, avec des rayons dédiés en magasin." }
    ],
    liensAutresConcepts: ["ciblage", "positionnement", "couple-produit-marche", "marketing-masse-differencie"],
    prerequis: [],
    complementaires: ["ciblage", "positionnement"],
    prolongements: ["couple-produit-marche", "marketing-masse-differencie", "crm"],
    pistesDargumentation: [
      "Montrer que la segmentation est indispensable face à la diversité croissante des attentes des consommateurs",
      "Comparer une entreprise qui segmente (Nike) vs une qui pratique le marketing de masse (Bic) et analyser les resultats",
      "Discuter des limites de la segmentation : sur-segmentation, coûts élèves, risque de discrimination",
      "Analyser comment le numérique et le big data ont transforme les pratiques de segmentation"
    ],
    motsCles: {
      directs: ["segmentation", "segment", "segments", "segmenter", "decoupage", "criteres de segmentation", "groupes homogenes", "sous-ensembles"],
      indirects: ["marche", "consommateurs", "comportement", "profil client", "cible", "demande", "besoins", "attentes", "donnees", "criteres", "analyse"],
      synonymes: ["decoupage du marche", "market segmentation", "clustering"],
      notionsProches: ["ciblage", "positionnement", "personnalisation", "marketing differencie", "CRM"]
    }
  },
  {
    id: "ciblage",
    titre: "Le ciblage",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Personnalisation de l'offre",
    definition: "Le ciblage est l'action de choisir un ou plusieurs segments de marché sur lesquels l'entreprise va concentrer ses efforts commerciaux et marketing. C'est la deuxième étape de la démarche SCP. Il existe trois stratégies principales : indifferenciee (tout le marché), differenciee (plusieurs segments) et concentree (un seul segment).",
    explicationSimple: "Apres avoir identifié les différents groupes de clients, l'entreprise doit choisir lesquels elle veut servir. C'est comme au restaurant : le chef ne peut pas cuisiner tous les plats du monde, il choisit sa spécialité et ses clients ideaux. Le ciblage, c'est dire 'voila les clients que je veux toucher en priorite'.",
    mecanismeMarketing: "L'entreprise évalue chaque segment selon sa taille, sa croissance, sa rentabilité potentielle et la concurrence presente. Elle compare ensuite ces critères avec ses propres forces et ressources. La stratégie choisie (indifferenciee, differenciee ou concentree) détermine l'allocation du budget marketing et la conception de l'offre. Le ciblage conditionne toutes les décisions du mix marketing.",
    exemples: [
      { marque: "Apple", description: "Apple cible les consommateurs à fort pouvoir d'achat, sensibles au design et à l'innovation technologique (stratégie concentree haut de gamme). Toute sa communication, ses prix premium et ses boutiques epurees renforcent ce positionnement aupres de cette cible precise." },
      { marque: "Lidl", description: "Lidl cible les consommateurs sensibles au prix avec une stratégie de hard discount, mais elargit progressivement sa cible en montant en gamme (gamme Deluxe, vins recompenses). C'est un exemple d'évolution du ciblage dans le temps." },
      { marque: "Shein", description: "Shein cible les 16-25 ans, ultra-connectes, qui veulent renouveler leur garde-robe frequemment à petit prix. L'entreprise utilise les données TikTok et Instagram pour affiner en permanence son ciblage comportemental." }
    ],
    liensAutresConcepts: ["segmentation", "positionnement", "marketing-masse-differencie", "couple-produit-marche"],
    prerequis: ["segmentation"],
    complementaires: ["positionnement", "couple-produit-marche"],
    prolongements: ["marketing-masse-differencie", "composantes-offre"],
    pistesDargumentation: [
      "Expliquer pourquoi une entreprise ne peut pas cibler tout le monde : ressources limitees et efficacité",
      "Montrer le lien entre ciblage et allocation des ressources marketing à travers un exemple concret",
      "Comparer les 3 stratégies de ciblage (indifferenciee, differenciee, concentree) avec des exemples",
      "Analyser comment le ciblage numérique (cookies, algorithmes) transforme la relation marque-consommateur"
    ],
    motsCles: {
      directs: ["ciblage", "cible", "cibler", "segment cible", "coeur de cible", "cible principale", "cible secondaire", "strategie de ciblage"],
      indirects: ["clients", "consommateurs", "marche", "strategie", "choix", "audience", "prospects", "rentabilite", "ressources"],
      synonymes: ["targeting", "selection de la cible", "market targeting"],
      notionsProches: ["segmentation", "positionnement", "mix marketing", "couple produit-marche"]
    }
  },
  {
    id: "positionnement",
    titre: "Le positionnement",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Personnalisation de l'offre",
    definition: "Le positionnement correspond à la place qu'un produit ou une marque occupe dans l'esprit des consommateurs, par rapport à ses concurrents. Il se definit par des attributs distinctifs (qualité, prix, innovation, éthique) et se visualise grâce à une carte perceptuelle (mapping). Le positionnement voulu par l'entreprise peut differer du positionnement perçu par le consommateur.",
    explicationSimple: "C'est l'image mentale que tu as d'une marque. Quand on dit Tesla, tu penses 'voiture électrique innovante'. Quand on dit IKEA, tu penses 'meubles accessibles et design'. Chaque marque essaie d'occuper une case unique dans ta tête pour que tu la choisisses plutôt qu'une autre.",
    mecanismeMarketing: "L'entreprise choisit 2 ou 3 attributs distinctifs (le triangle d'or du positionnement : attentes clients, atouts du produit, positionnement des concurrents). Elle les traduit dans tout son mix marketing : le produit, le prix, la communication et la distribution doivent être cohérents. Le mapping positionnel permet de visualiser la place de chaque marque sur 2 axes (ex : prix/qualité). Un bon positionnement est crédible, attractif, durable et différenciant.",
    exemples: [
      { marque: "Tesla", description: "Tesla s'est positionnee comme la marque automobile de l'innovation électrique premium. Son positionnement repose sur 3 piliers : technologie de pointe (autopilot), design futuriste et engagement écologique. Ce positionnement clair lui permet de justifier des prix élèves sans être comparee aux constructeurs traditionnels." },
      { marque: "Decathlon", description: "Decathlon se positionne sur le sport accessible à tous, avec un excellent rapport qualité-prix. Sa signature 'A fond la forme' et ses marques propres (Quechua, Domyos, Kipsta) incarnent ce positionnement. Sur un mapping prix/qualité, Decathlon occupe une position unique entre le bas de gamme et les marques techniques premium." },
      { marque: "Action", description: "Action se positionne comme le magasin des petits prix surprenants avec un assortiment non alimentaire en rotation constante. Son positionnement prix/surprise attire une clientele large qui vient 'faire des découvertes', ce qui le différencié des discounters classiques." }
    ],
    liensAutresConcepts: ["segmentation", "ciblage", "marque", "composantes-offre"],
    prerequis: ["segmentation", "ciblage"],
    complementaires: ["marque", "composantes-offre"],
    prolongements: ["packaging-design", "politiques-prix"],
    pistesDargumentation: [
      "Montrer qu'un positionnement clair est indispensable pour se différencier dans un marché concurrentiel",
      "Analyser les risques d'un repositionnement à travers l'exemple d'une marque (ex : Burberry qui est passee de marque des hooligans a marque de luxe)",
      "Comparer positionnement voulu par l'entreprise et positionnement perçu par le consommateur",
      "Discuter si un positionnement peut durer dans le temps face aux evolutions du marché"
    ],
    motsCles: {
      directs: ["positionnement", "positionner", "position", "carte perceptuelle", "mapping", "repositionnement", "triangle d'or"],
      indirects: ["image", "perception", "differenciation", "concurrence", "identite", "place", "esprit", "attributs", "distinctif"],
      synonymes: ["positioning", "image de marque", "brand positioning"],
      notionsProches: ["segmentation", "ciblage", "marque", "differenciation", "composantes de l'offre"]
    }
  },
  {
    id: "couple-produit-marche",
    titre: "Le couple produit/marché",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Personnalisation de l'offre",
    definition: "Le couple produit/marche désigne l'association entre un produit (ou service) et le segment de marché auquel il est spécifiquement destine. Cette notion implique que le produit est conçu en fonction des besoins identifiés sur un marché cible, et non l'inverse. C'est le fondement de la démarche marketing orientée client.",
    explicationSimple: "Plutot que de fabriquer un produit et chercher ensuite à qui le vendre, l'entreprise part des besoins d'un groupe de clients pour créer le produit ideal. C'est comme un cuisinier qui demande d'abord à ses clients ce qu'ils veulent manger avant de preparer le menu. Le bon couple produit/marche, c'est le bon produit pour les bonnes personnes.",
    mecanismeMarketing: "L'entreprise identifié un besoin non satisfait ou mal satisfait sur un segment de marché. Elle conçoit ensuite une offre adaptée (produit + services associés) à ce segment. La matrice d'Ansoff permet de structurer les choix stratégiques : pénétration de marché, développement de produit, développement de marché ou diversification. Le couple produit/marche est valide par des études de marché et des tests avant le lancement.",
    exemples: [
      { marque: "Dacia Spring", description: "Dacia a identifié un marché : les conducteurs urbains à petit budget qui veulent passer à l'électrique mais ne peuvent pas investir 30 000 euros. La Spring, voiture électrique la moins chere du marché europeen, répond parfaitement à ce couple produit/marche." },
      { marque: "Spotify", description: "Spotify a identifié que les jeunes voulaient accéder à la musique partout, sans la posseder, pour un coût modique. Le couple produit/marche est parfait : streaming illimite avec pub (gratuit) ou premium à prix etudiant. Le produit est ne du marché, pas l'inverse." }
    ],
    liensAutresConcepts: ["segmentation", "ciblage", "positionnement", "offre-globale"],
    prerequis: ["segmentation", "ciblage"],
    complementaires: ["positionnement", "offre-globale"],
    prolongements: ["composantes-offre", "b2b-b2c"],
    pistesDargumentation: [
      "Montrer la logique inversee du marketing : partir du marché pour créer le produit plutôt que l'inverse",
      "Analyser les risques d'une inadequation produit/marche à travers un échec commercial (Google Glass, Juicero)",
      "Discuter si le product market fit est un facteur cle de succes pour les startups",
      "Comparer la démarche couple produit/marche avec une approche produit-centree"
    ],
    motsCles: {
      directs: ["couple produit marche", "produit marche", "adequation", "product market fit", "matrice ansoff", "ajustement"],
      indirects: ["offre", "demande", "besoin", "adaptation", "conception", "lancement", "innovation", "client"],
      synonymes: ["product market fit", "adequation offre-demande"],
      notionsProches: ["segmentation", "ciblage", "offre globale", "positionnement"]
    }
  },
  {
    id: "marketing-masse-differencie",
    titre: "Du marketing de masse au marketing individualisé",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Stratégies marketing",
    definition: "Les stratégies marketing evoluent du marketing de masse (un produit unique pour tous) au marketing individualise (one-to-one), en passant par le marketing différencié (offres adaptées à plusieurs segments) et le marketing concentre (un seul segment vise). Cette évolution est accélérée par le numérique et le big data qui permettent une personnalisation à grande échelle.",
    explicationSimple: "Autrefois, la même pub passait à la tele pour tout le monde et on vendait un produit identique à tous. Aujourd'hui, Netflix te recommande DES films, Spotify te crée TA playlist et Nike te laisse designer TES baskets. On est passe du 'un pour tous' au 'un pour chacun' grâce à la technologie.",
    mecanismeMarketing: "Le marketing de masse permet des économies d'échelle mais ignore les différences entre clients. Le marketing différencié adapte l'offre à plusieurs segments (coût plus élevé mais meilleure satisfaction). Le marketing concentre se focalise sur un creneau (niche). Le marketing individualise utilise les données clients (CRM, cookies, IA) pour personnaliser l'offre, le prix et la communication en temps réel. La tendance actuelle est à l'hyper-personnalisation grâce aux algorithmes.",
    exemples: [
      { marque: "Coca-Cola", description: "Coca-Cola illustre l'évolution : marketing de masse historique (une seule boisson pour le monde entier), puis différencié avec le lancement de Zero, Light, Cherry, Vanilla, et même individualise avec la campagne 'Partagez un Coca avec [prenom]' qui personnalisait les bouteilles." },
      { marque: "Nike By You", description: "Nike By You permet au client de personnaliser entièrement ses baskets : couleurs, matériaux, texte grave. C'est du marketing individualise pur, rendu possible par l'outil de configuration en ligne et une production flexible. Le prix est plus élevé mais la satisfaction client maximale." },
      { marque: "Amazon", description: "Amazon pratique l'hyper-personnalisation algorithmique : chaque page d'accueil est unique, les recommandations sont basées sur l'historique de navigation et d'achat, les prix peuvent varier selon le profil. C'est le marketing individualise à l'échelle industrielle." }
    ],
    liensAutresConcepts: ["segmentation", "ciblage", "positionnement", "crm"],
    prerequis: ["segmentation", "ciblage"],
    complementaires: ["couple-produit-marche", "composantes-offre"],
    prolongements: ["crm", "parcours-client-digital"],
    pistesDargumentation: [
      "Analyser l'évolution historique de la personnalisation du marketing de masse au one-to-one",
      "Montrer comment le numérique et le big data rendent possible le passage au marketing individualise",
      "Discuter des limites : coût de la personnalisation, respect de la vie privée (RGPD), effet 'bulle de filtre'",
      "Debattre si la personnalisation est reellement un avantage pour le consommateur ou une forme de manipulation"
    ],
    motsCles: {
      directs: ["marketing de masse", "marketing differencie", "marketing concentre", "marketing individualise", "one to one", "personnalisation", "hyper-personnalisation"],
      indirects: ["strategie", "offre", "adaptation", "sur mesure", "niche", "algorithme", "donnees", "IA", "big data"],
      synonymes: ["mass marketing", "marketing personnalise", "one-to-one marketing", "customization"],
      notionsProches: ["segmentation", "ciblage", "big data", "CRM", "RGPD"]
    }
  },
  {
    id: "composantes-offre",
    titre: "Les composantes de l'offre",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Construction de l'offre",
    definition: "L'offre est constituée de composantes matérielles (le produit physique, son conditionnement, ses caractéristiques techniques) et de composantes immatérielles (la marque, le design, l'image, la qualité perçue, les services associés). L'ensemble forme la valeur globale de l'offre perçue par le consommateur.",
    explicationSimple: "Un produit, ce n'est pas juste l'objet que tu achetes. Quand tu achetes des AirPods, tu achetes des ecouteurs (matériel), mais aussi la marque Apple, le design épuré, le statut social, le service apres-vente (immatériel). Souvent, c'est l'immatériel qui fait la difference entre deux produits similaires.",
    mecanismeMarketing: "L'entreprise conçoit son offre en combinant les dimensions matérielles et immatérielles de façon cohérente avec son positionnement. Les composantes matérielles satisfont les besoins fonctionnels (utilité, qualité, durabilité). Les composantes immatérielles répondent aux besoins psychologiques et sociaux (appartenance, estime, plaisir). La cohérence entre toutes ces composantes est essentielle : un packaging luxueux sur un produit bas de gamme créerait de la dissonance.",
    exemples: [
      { marque: "Veja", description: "Chez Veja, la valeur vient autant du design épuré (matériel) que de l'engagement écoresponsable, de la transparence sur la chaîne de production et du storytelling de la marque (immatériel). Les baskets coutent plus cher que chez Nike, mais les composantes immatérielles justifient ce premium aux yeux des consommateurs engages." },
      { marque: "Dyson", description: "Dyson combine des composantes matérielles superieures (moteur cyclonique brevetee, matériaux premium) avec des composantes immatérielles fortes (image d'innovation, design futuriste, marque synonyme de technologie). Un aspirateur Dyson à 500 euros se justifie par la cohérence de l'ensemble." }
    ],
    liensAutresConcepts: ["packaging-design", "marque", "valeur-percue", "positionnement"],
    prerequis: ["positionnement"],
    complementaires: ["packaging-design", "marque"],
    prolongements: ["offre-globale", "valeur-percue"],
    pistesDargumentation: [
      "Montrer que l'immatériel peut valoir plus que le matériel dans la perception du consommateur",
      "Analyser la cohérence nécessaire entre toutes les composantes de l'offre à travers un exemple",
      "Discuter si un produit peut réussir avec des composantes matérielles faibles mais un immatériel fort (et inversement)",
      "Comparer les composantes de l'offre d'un produit de luxe vs un produit de grande consommation"
    ],
    motsCles: {
      directs: ["composantes", "offre", "materiel", "immateriel", "produit", "composantes materielles", "composantes immaterielles"],
      indirects: ["valeur", "qualite", "image", "conditionnement", "service", "caracteristiques", "fonctionnel", "psychologique"],
      synonymes: ["elements de l'offre", "attributs du produit", "product attributes"],
      notionsProches: ["packaging", "design", "marque", "valeur percue", "positionnement"]
    }
  },
  {
    id: "packaging-design",
    titre: "Le packaging et la stylique (design)",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Construction de l'offre",
    definition: "Le packaging (conditionnement et emballage) remplit des fonctions techniques (protection, conservation, transport) et des fonctions commerciales (attirer le regard, informer, séduire, véhiculer l'image de marque). La stylique (design) donne au produit son identité visuelle unique et participe à la différenciation.",
    explicationSimple: "Le packaging, c'est le 'vendeur muet' du produit : en rayon, il n'y a personne pour te convaincre, c'est l'emballage qui fait le travail. Il doit à la fois proteger le produit et te donner envie de l'acheter en moins de 3 secondes. Pense aux pots Bonne Maman avec leur couvercle Vichy : tu les reconnais instantanement.",
    mecanismeMarketing: "Le packaging agit à 3 niveaux : l'emballage primaire (au contact du produit), l'emballage secondaire (la boite) et l'emballage tertiaire (le carton de transport). Le design combine forme, couleurs, typographie et matériaux pour créer une identité visuelle distinctive. Le packaging doit être cohérent avec le positionnement et évoluer avec les tendances (éco-conception, minimalisme, QR codes). En GMS, le packaging à 0,3 seconde pour capter l'attention du consommateur.",
    exemples: [
      { marque: "Bonne Maman", description: "Le pot avec couvercle vichy rouge et blanc et l'étiquette qui imite l'ecriture manuscrite creent un univers 'fait maison' authentique. Ce packaging iconique n'a quasiment pas change depuis 1971 et fait partie de l'identité de la marque. Il justifie un prix supérieur aux MDD." },
      { marque: "Apple", description: "Le packaging Apple est un élément central de l'expérience client : boite blanche minimaliste, ouverture lente calculee pour créer un moment de suspense, rangement parfait de chaque accessoire. Le unboxing est devenu un genre vidéo a part entière sur YouTube, preuve que le packaging fait partie de la valeur perçue." },
      { marque: "Innocent", description: "Innocent utilise un packaging decale (bouteilles avec des bonnets tricotes en hiver, textes humoristiques) qui crée un lien émotionnel avec le consommateur et véhicule les valeurs de la marque : authenticite, humour et engagement social." }
    ],
    liensAutresConcepts: ["composantes-offre", "marque", "valeur-percue"],
    prerequis: ["composantes-offre"],
    complementaires: ["marque", "positionnement"],
    prolongements: ["valeur-percue", "experience-consommation"],
    pistesDargumentation: [
      "Montrer que le packaging est un véritable outil de différenciation et de vente silencieuse",
      "Analyser l'évolution du packaging face aux exigences environnementales (éco-conception, vrac, consigne)",
      "Discuter le rôle du unboxing et du packaging dans l'expérience client à l'ere du e-commerce",
      "Comparer l'impact du packaging en grande distribution physique vs en ligne"
    ],
    motsCles: {
      directs: ["packaging", "emballage", "conditionnement", "design", "stylique", "eco-conception", "unboxing"],
      indirects: ["apparence", "visuel", "forme", "couleur", "identite", "vendeur muet", "rayon", "protection"],
      synonymes: ["design produit", "habillage", "product design", "package design"],
      notionsProches: ["composantes de l'offre", "marque", "valeur percue", "experience client"]
    }
  },
  {
    id: "marque",
    titre: "La marque",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Construction de l'offre",
    definition: "La marque est un signe distinctif (nom, logo, symbole, son) qui identifié et différencié les produits ou services d'une entreprise de ceux de ses concurrents. Elle possède une dimension patrimoniale : c'est un actif immatériel de l'entreprise dont la valeur financière peut être considérable. Il existe differentes politiques de marque : marque ombrelle, marque produit et marque caution.",
    explicationSimple: "La marque, c'est ce qui fait qu'entre deux t-shirts identiques, tu es prêt à payer 3 fois plus cher celui qui porte le logo Nike. C'est un capital de confiance construit dans le temps. Quand tu vois la pomme croquee d'Apple, tu penses immediatement 'qualité, innovation, design'. C'est ca la puissance d'une marque.",
    mecanismeMarketing: "L'entreprise choisit une politique de marque selon sa stratégie. La marque ombrelle couvre tous les produits sous un même nom (Samsung). La marque produit donne un nom unique à chaque produit (Procter & Gamble : Ariel, Pampers, Gillette). La marque caution apporte sa garantie à des marques filles (Danone cautionne Activia, Actimel). La marque crée de la confiance, facilite la fidélisation et peut justifier un prix premium. Son capital (brand equity) se mesure en notoriété, image et fidélité.",
    exemples: [
      { marque: "Danone", description: "Danone utilise une stratégie de marque caution : la marque mere Danone apporte sa crédibilité à des marques filles comme Activia, Evian, Alpro. Chaque marque fille à son propre positionnement mais bénéficie de la confiance associee a Danone." },
      { marque: "Louis Vuitton", description: "Chez LVMH, la marque est le principal vecteur de valeur. Un sac Louis Vuitton coûte des milliers d'euros alors que le coût de fabrication est bien moindre. La difference, c'est la valeur de la marque : heritage, exclusivite, savoir-faire. La marque LV vaut plus de 50 milliards de dollars." },
      { marque: "MDD (Marques De Distributeur)", description: "Les MDD (Marque Repere chez Leclerc, Reflets de France chez Carrefour) montrent que la marque distributeur peut concurrencer les grandes marques nationales en proposant un rapport qualité-prix attractif, jouant sur la confiance envers l'enseigne." }
    ],
    liensAutresConcepts: ["positionnement", "composantes-offre", "fidelisation", "e-reputation"],
    prerequis: ["positionnement", "composantes-offre"],
    complementaires: ["packaging-design", "valeur-percue"],
    prolongements: ["fidelisation", "e-reputation", "communication-commerciale"],
    pistesDargumentation: [
      "Montrer que la marque est un actif immatériel majeur dont la valeur peut dépasser celle des actifs physiques",
      "Analyser la dimension patrimoniale de la marque : comment se construit et se protege un capital marque",
      "Comparer les stratégies de marque ombrelle, marque produit et marque caution avec leurs avantages et risques",
      "Discuter si les marques de distributeur (MDD) menacent les grandes marques nationales"
    ],
    motsCles: {
      directs: ["marque", "brand", "branding", "politique de marque", "marque ombrelle", "marque produit", "marque caution", "capital marque", "brand equity"],
      indirects: ["logo", "nom", "identite", "notoriete", "image", "confiance", "reputation", "patrimoine", "MDD", "signe distinctif"],
      synonymes: ["brand", "enseigne", "griffe", "label"],
      notionsProches: ["positionnement", "fidelisation", "capital marque", "e-reputation", "valeur percue"]
    }
  },
  {
    id: "offre-globale",
    titre: "L'offre globale et la gamme",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Construction de l'offre",
    definition: "L'offre globale combine le produit principal et les services ou produits associés (garantie, livraison, SAV, accessoires). La gamme désigne l'ensemble des produits proposes par une entreprise, caracterisee par sa largeur (nombre de lignes), sa profondeur (variantes par ligne) et sa longueur (nombre total de références).",
    explicationSimple: "Quand tu achetes un iPhone, tu n'achetes pas juste un téléphone : tu accedes a iCloud, à l'Apple Store, au SAV Genius Bar, à la garantie, aux coques et chargeurs. C'est l'offre globale. Et la gamme, c'est toute la palette : iPhone 15, 15 Pro, 15 Pro Max, SE... avec differentes capacites de stockage.",
    mecanismeMarketing: "L'offre globale ajoute de la valeur perçue en proposant des services complementaires (livraison, installation, formation, garantie etendue). La gestion de gamme est un équilibre delicat : une gamme longue couvre plus de besoins mais coûte plus cher à gérer. Le produit d'appel attire les clients, le produit leader génère le plus de CA, et le produit de prestige valorise l'image. Les entreprises rationalisent régulièrement leur gamme pour eliminer les références peu rentables.",
    exemples: [
      { marque: "Free", description: "Free propose une offre globale intégrée : box internet + TV + téléphone fixe + mobile + cloud. L'abonnement unique combine plusieurs services, creant une valeur perçue supérieure à la somme de chaque élément. La gamme reste volontairement courte (2-3 forfaits) pour la lisibilite." },
      { marque: "L'Oreal", description: "L'Oreal possède une gamme extremement large (maquillage, soins, capillaire, parfums) et profonde (des dizaines de références par ligne). La stratégie couvre tous les segments de prix : L'Oreal Paris (grande diffusion), Lancome (premium), Giorgio Armani Beauty (luxe)." }
    ],
    liensAutresConcepts: ["composantes-offre", "couple-produit-marche", "marque", "b2b-b2c"],
    prerequis: ["composantes-offre", "positionnement"],
    complementaires: ["marque", "couple-produit-marche"],
    prolongements: ["politiques-prix", "canaux-distribution"],
    pistesDargumentation: [
      "Analyser l'intérêt stratégique de l'offre globale pour créer de la valeur et fidéliser",
      "Comparer les avantages et inconvenients d'une gamme longue vs une gamme courte",
      "Montrer comment le produit d'appel, le produit leader et le produit de prestige structurent une gamme",
      "Discuter si l'elargissement de gamme est toujours positif ou peut diluer l'image de marque"
    ],
    motsCles: {
      directs: ["offre globale", "gamme", "ligne de produits", "largeur", "profondeur", "longueur", "produit d'appel", "produit leader"],
      indirects: ["catalogue", "assortiment", "services associes", "garantie", "SAV", "reference", "rationalisation"],
      synonymes: ["product line", "product range", "product mix"],
      notionsProches: ["composantes de l'offre", "marque", "positionnement", "politique de prix"]
    }
  },
  {
    id: "b2b-b2c",
    titre: "B2B et B2C",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.1",
    questionLabel: "La personnalisation de l'offre est-elle incontournable ?",
    sousTheme: "Construction de l'offre",
    definition: "Le B2B (Business to Business) désigne les échanges commerciaux entre entreprises. Le B2C (Business to Consumer) désigne les échanges entre une entreprise et le consommateur final. Ces deux marches différent fondamentalement dans le processus de décision, le volume des transactions, le cycle d'achat et la relation commerciale.",
    explicationSimple: "Quand tu achetes un sandwich chez Subway, c'est du B2C : l'entreprise te vend a toi, le consommateur. Mais quand Subway acheté son pain à un fournisseur industriel, c'est du B2B : une entreprise vend à une autre entreprise. Les regles du jeu sont completement differentes entre les deux.",
    mecanismeMarketing: "En B2B, la décision d'achat est collective (centre d'achat : prescripteur, decideur, acheteur, utilisateur), rationnelle (cahier des charges, appels d'offres) et le cycle est long. En B2C, la décision est souvent individuelle, plus émotionnelle et le cycle est court. Le B2B met l'accent sur la relation commerciale durable, le B2C sur l'expérience client et la communication de masse. Certaines entreprises operent sur les deux marches simultanement (ex : Samsung vend des téléphones aux particuliers et des composants aux constructeurs).",
    exemples: [
      { marque: "Salesforce", description: "Salesforce est un exemple pur de B2B : l'entreprise vend des logiciels CRM exclusivement a d'autres entreprises. Le cycle de vente est long (démonstrations, périodes d'essai, négociations), la décision implique plusieurs interlocuteurs (DSI, direction commerciale, direction generale) et les contrats se chiffrent en milliers d'euros annuels." },
      { marque: "Amazon", description: "Amazon illustre parfaitement le double marché : Amazon.fr est B2C (vente aux particuliers), tandis qu'Amazon Business est B2B (vente aux entreprises avec factures, commandes groupees, tarifs dégressifs). Amazon Web Services (AWS) est aussi du B2B pur, fournissant de l'infrastructure cloud aux entreprises." }
    ],
    liensAutresConcepts: ["segmentation", "canaux-distribution", "communication-commerciale"],
    prerequis: ["segmentation"],
    complementaires: ["offre-globale", "canaux-distribution"],
    prolongements: ["communication-commerciale", "politiques-distribution"],
    pistesDargumentation: [
      "Comparer les processus de décision d'achat en B2B et en B2C à travers des exemples concrets",
      "Analyser comment une même entreprise peut opérer avec succes sur les deux marches",
      "Montrer que le marketing B2B est en train de se rapprocher du B2C avec la digitalisation",
      "Discuter si l'émotion à sa place dans le marketing B2B ou si seule la rationalite compte"
    ],
    motsCles: {
      directs: ["b2b", "b2c", "business to business", "business to consumer", "B to B", "B to C", "marche professionnel"],
      indirects: ["entreprise", "professionnel", "particulier", "fournisseur", "client", "centre d'achat", "cahier des charges"],
      synonymes: ["commerce interentreprises", "commerce de detail", "B-to-B", "B-to-C"],
      notionsProches: ["segmentation", "distribution", "communication commerciale", "canaux de distribution"]
    }
  },

  /* ──────────── THÈME 1 — Q1.2 Expérience client ──────────── */
  {
    id: "experience-consommation",
    titre: "L'expérience de consommation",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.2",
    questionLabel: "Toute consommation crée-t-elle de l'expérience ?",
    sousTheme: "Expérience client",
    definition: "L'expérience de consommation désigne l'ensemble des interactions et émotions vecues par le consommateur avant, pendant et apres l'achat d'un produit ou service. Elle comporte trois phases : l'anticipation (recherche, excitation avant l'achat), l'achat lui-même (expérience en magasin ou en ligne) et le souvenir (satisfaction, recommandation). Cette expérience est subjective et chargee d'émotions.",
    explicationSimple: "Acheter, ce n'est pas juste echanger de l'argent contre un produit. C'est vivre quelque chose. Pense au Black Friday : l'excitation de chercher les bonnes affaires (anticipation), le plaisir de trouver LA promo (achat), et la fierte de raconter tes trouvailles a tes amis (souvenir). Chaque achat, même banal, crée une mini-expérience.",
    mecanismeMarketing: "Les entreprises cherchent à optimiser chaque phase de l'expérience. L'anticipation est stimulee par le teasing, les pre-commandes et les listes d'attente (Apple crée des files d'attente pour ses lancements). L'expérience d'achat est améliorée par l'ambiance, le parcours client et le service. Le souvenir est entretenu par le suivi post-achat, les programmes de fidélité et les incitations au partage sur les réseaux sociaux. L'objectif est de transformer chaque interaction en moment mémorable et positif.",
    exemples: [
      { marque: "IKEA", description: "IKEA a conçu tout son parcours magasin comme une expérience : le chemin fleche invite a découvrir des mises en situation de pieces completes, le restaurant suedois est une pause gourmande, l'espace enfants Smaland libere les parents. Meme les hot-dogs a 1 euro en sortie prolongent l'expérience positive." },
      { marque: "Disney", description: "Disney est le maitre de l'expérience de consommation. Avant la visite, les vidéos et le site web creent l'anticipation. Pendant la visite, chaque détail est pense (musique, odeurs, cast members souriants). Apres, les photos, souvenirs et la magie du retour à la maison prolongent le souvenir. Disney appelle cela 'la magie'." },
      { marque: "Vinted", description: "Vinted transforme l'achat de vetements d'occasion en expérience ludique : le plaisir de la chasse aux bonnes affaires (anticipation), la négociation avec le vendeur (interaction), la découverte du colis (unboxing). L'expérience est aussi sociale : tu peux suivre des vendeurs et partager tes trouvailles." }
    ],
    liensAutresConcepts: ["marketing-experientiel", "valeur-percue", "satisfaction-client", "parcours-client-digital"],
    prerequis: [],
    complementaires: ["marketing-experientiel", "valeur-percue"],
    prolongements: ["satisfaction-client", "fidelisation"],
    pistesDargumentation: [
      "Montrer que l'expérience de consommation est devenue un facteur cle de différenciation à l'ere du tout-produit-similaire",
      "Analyser les 3 phases de l'expérience avec un exemple concret (avant, pendant, apres)",
      "Comparer l'expérience d'un achat banal (courses au supermarche) vs un achat impliquant (voyage, smartphone)",
      "Discuter si la recherche d'expérience permanente ne mene pas à une forme de surconsommation"
    ],
    motsCles: {
      directs: ["experience de consommation", "experience client", "experience d'achat", "parcours client", "anticipation", "souvenir"],
      indirects: ["emotion", "vecu", "plaisir", "souvenir", "interaction", "ressenti", "ambiance", "moment", "satisfaction"],
      synonymes: ["customer experience", "CX", "experience utilisateur"],
      notionsProches: ["marketing experientiel", "valeur percue", "satisfaction", "parcours client digital"]
    }
  },
  {
    id: "marketing-experientiel",
    titre: "Le marketing expérientiel",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.2",
    questionLabel: "Toute consommation crée-t-elle de l'expérience ?",
    sousTheme: "Expérience client",
    definition: "Le marketing expérientiel vise à plonger le consommateur dans l'univers de la marque en sollicitant ses sens et ses émotions. Il repose sur la théâtralisation du point de vente, le marketing sensoriel (stimulation des 5 sens), le marketing immersif (realite virtuelle, pop-up stores) et la creation d'un lien émotionnel fort entre le consommateur et la marque.",
    explicationSimple: "Le marketing expérientiel, c'est transformer un achat banal en moment mémorable. Au lieu de juste vendre du parfum, Lush te fait plonger les mains dans des bains de couleurs, sentir des bombes de bain et tester des produits frais. Tu ne viens pas acheter, tu viens VIVRE quelque chose. C'est ca le réenchantement de la consommation.",
    mecanismeMarketing: "La théâtralisation transforme le point de vente en lieu de spectacle (decor, eclairages, mise en scene). Le marketing sensoriel active les 5 sens : la vue (couleurs, design), l'ouie (musique d'ambiance), l'odorat (diffusion de parfums), le toucher (matériaux, textures) et le gout (degustations). Le marketing immersif utilise la technologie (VR, AR, écrans interactifs) pour créer des expériences uniques. L'objectif est de générer des émotions positives qui s'associent durablement à la marque dans la mémoire du consommateur.",
    exemples: [
      { marque: "Lush", description: "Lush est l'exemple type du marketing sensoriel total : les produits sont presentes comme sur un marché de fruits et legumes, les vendeurs font des démonstrations en direct, l'odeur est identifiable à des metres du magasin. Chaque visite est une expérience multisensorielle qui crée un lien émotionnel fort avec la marque." },
      { marque: "Starbucks", description: "Starbucks ne vend pas du cafe, il vend un 'troisieme lieu' entre la maison et le bureau. Musique soigneusement selectionnee, fauteuils confortables, Wi-Fi gratuit, prenom inscrit sur le gobelet : chaque détail crée une expérience de consommation qui justifie un cafe à 5 euros." },
      { marque: "Nike House of Innovation", description: "Les flagships Nike proposent des expériences immersives : personnalisation de chaussures en temps réel, essai de produits sur un terrain de basket indoor, analyse de la foulee par des capteurs. Le magasin est un lieu d'expérience, pas juste de vente." }
    ],
    liensAutresConcepts: ["experience-consommation", "valeur-percue", "satisfaction-client", "fidelisation"],
    prerequis: ["experience-consommation"],
    complementaires: ["valeur-percue", "packaging-design"],
    prolongements: ["satisfaction-client", "fidelisation", "community-management"],
    pistesDargumentation: [
      "Analyser comment le marketing expérientiel permet le réenchantement de la consommation face à la banalisation des produits",
      "Montrer l'efficacité du marketing sensoriel sur le comportement d'achat (exemples chiffres)",
      "Discuter les limites : manipulation des émotions, greenwashing sensoriel, coût des dispositifs",
      "Comparer le marketing expérientiel en magasin physique et en ligne (est-ce possible sur Internet ?)"
    ],
    motsCles: {
      directs: ["marketing experientiel", "theatralisation", "marketing sensoriel", "marketing immersif", "reenchantement", "pop-up store"],
      indirects: ["emotion", "sens", "ambiance", "immersion", "mise en scene", "spectacle", "plaisir", "memoire"],
      synonymes: ["experiential marketing", "marketing des experiences", "sensory marketing"],
      notionsProches: ["experience de consommation", "valeur percue", "satisfaction client", "fidelisation"]
    }
  },
  {
    id: "valeur-percue",
    titre: "La valeur perçue",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.2",
    questionLabel: "Toute consommation crée-t-elle de l'expérience ?",
    sousTheme: "Expérience client",
    definition: "La valeur perçue représente la perception globale par le client de ce qu'il obtient (bénéfices fonctionnels, emotionnels, sociaux et symboliques) par rapport à ce qu'il sacrifie (prix paye, temps consacre, effort fourni). Elle est subjective, variable selon les individus et determinante dans la décision d'achat.",
    explicationSimple: "C'est le calcul mental que tu fais : 'est-ce que ce que j'ai recu vaut ce que ca m'a coûte ?'. Un etudiant trouve qu'un sac Vuitton a 1500 euros n'en vaut pas la peine, mais pour un autre, le prestige social vaut chaque centime. La valeur perçue n'est pas objective, elle est dans la tête du client.",
    mecanismeMarketing: "La valeur perçue combine 4 dimensions : fonctionnelle (le produit remplit-il sa fonction ?), émotionnelle (procure-t-il du plaisir ?), sociale (que pensent les autres de mon choix ?) et symbolique (que dit-il de moi ?). L'entreprise peut agir sur la valeur perçue en augmentant les bénéfices (qualité, services, image) ou en réduisant les coûts percus (simplification de l'achat, livraison gratuité, essai sans engagement). Le rapport qualité/prix est la dimension la plus frequemment evaluee, mais ce n'est pas la seule.",
    exemples: [
      { marque: "Dyson", description: "Un aspirateur Dyson coûte 3 à 5 fois plus cher qu'un modèle classique, mais les clients percoivent une valeur supérieure grâce à l'innovation technologique (cyclone sans sac), le design distinctif et l'image de marque premium. Le bénéfice perçu dépasse largement le coût pour la cible visee." },
      { marque: "IKEA", description: "IKEA maximise la valeur perçue en jouant sur les deux leviers : bénéfices élèves (design scandinave attrayant, mises en situation inspirantes) et coûts reduits (prix bas, self-service, montage par le client). Le client à l'impression d'en obtenir beaucoup pour peu." },
      { marque: "Supreme", description: "Supreme vend des t-shirts basiques à plus de 100 euros. La valeur fonctionnelle est faible, mais la valeur symbolique et sociale est immense : porter Supreme signifie appartenir à une communauté, être 'dans le coup'. La rareté organisee (drops limites) amplifie encore la valeur perçue." }
    ],
    liensAutresConcepts: ["experience-consommation", "satisfaction-client", "positionnement", "politiques-prix"],
    prerequis: ["experience-consommation", "composantes-offre"],
    complementaires: ["satisfaction-client", "positionnement"],
    prolongements: ["politiques-prix", "fixation-prix", "fidelisation"],
    pistesDargumentation: [
      "Montrer que la valeur perçue est subjective et variable selon les individus et les contextes",
      "Analyser comment une entreprise peut augmenter la valeur perçue sans baisser ses prix",
      "Discuter le lien entre valeur perçue et prix : un prix élevé augmente-t-il ou diminue-t-il la valeur perçue ?",
      "Comparer la valeur perçue d'un produit de luxe vs un produit low cost"
    ],
    motsCles: {
      directs: ["valeur percue", "benefices percus", "couts percus", "valeur", "rapport qualite prix", "valeur fonctionnelle", "valeur emotionnelle"],
      indirects: ["perception", "utilite", "prix", "qualite", "satisfaction", "sacrifice", "effort", "avantage"],
      synonymes: ["perceived value", "customer perceived value", "valeur client"],
      notionsProches: ["satisfaction", "prix", "qualite", "positionnement", "experience de consommation"]
    }
  },
  {
    id: "satisfaction-client",
    titre: "La satisfaction client",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.2",
    questionLabel: "Toute consommation crée-t-elle de l'expérience ?",
    sousTheme: "Expérience client",
    definition: "La satisfaction client resulte de la comparaison entre les attentes du client avant l'achat et la performance perçue du produit ou service apres utilisation. Si la performance dépasse les attentes, le client est satisfait (voire enchante). Si elle est inferieure, il est insatisfait. La satisfaction est un indicateur cle de la performance marketing et un déterminant de la fidélité.",
    explicationSimple: "C'est simple : si tu t'attends à un restaurant 'correct' et que c'est delicieux, tu es satisfait. Si on te promet le meilleur restaurant du monde et que c'est juste 'bien', tu es déçu. La satisfaction, ce n'est pas la qualité objective du produit, c'est l'ecart entre ce que tu attendais et ce que tu as recu.",
    mecanismeMarketing: "Les entreprises mesurent la satisfaction par des enquêtes, le Net Promoter Score (NPS : 'recommanderiez-vous ce produit ?'), les avis en ligne et le taux de réclamation. Un client satisfait rachete (fidélité), recommande (bouche-a-oreille positif) et coûte moins cher a garder qu'un nouveau client a conquerir (ratio 1 pour 5). Un client insatisfait, en revanche, partage son mécontentement aupres de 10 à 15 personnes en moyenne et peut générer un bad buzz destructeur sur les réseaux sociaux.",
    exemples: [
      { marque: "Amazon", description: "Amazon a bati son empire sur la satisfaction client : livraison ultra-rapide (souvent en 24h), politique de retour sans condition pendant 30 jours, service client réactif. Jeff Bezos a fixe comme mission 'être l'entreprise la plus centree sur le client au monde'. Le resultat : un NPS parmi les plus élèves du e-commerce." },
      { marque: "Decathlon", description: "Decathlon obtient régulièrement les meilleurs scores de satisfaction dans le secteur sport grâce à sa politique de retour ultra-souple (365 jours, sans question), ses prix bas et la qualité de ses marques propres. L'entreprise a aussi mis en place un système d'avis clients directement sur chaque fiche produit." }
    ],
    liensAutresConcepts: ["valeur-percue", "experience-consommation", "fidelisation", "e-reputation"],
    prerequis: ["valeur-percue", "experience-consommation"],
    complementaires: ["fidelisation", "e-reputation"],
    prolongements: ["crm", "community-management"],
    pistesDargumentation: [
      "Montrer le cercle vertueux satisfaction - fidélité - rentabilité avec des exemples chiffres",
      "Analyser les dangers d'un client insatisfait à l'ere des réseaux sociaux (bad buzz, viralité)",
      "Comparer les outils de mesure de la satisfaction (NPS, CSAT, avis en ligne) et leur fiabilite",
      "Discuter si la sur-promesse marketing est un risque pour la satisfaction client"
    ],
    motsCles: {
      directs: ["satisfaction", "satisfaction client", "insatisfaction", "attentes", "NPS", "net promoter score", "reclamation"],
      indirects: ["qualite", "fidelite", "recommandation", "avis", "performance", "ecart", "service client"],
      synonymes: ["customer satisfaction", "CSAT", "contentement client"],
      notionsProches: ["valeur percue", "fidelisation", "e-reputation", "experience client"]
    }
  },

  /* ──────────── THÈME 1 — Q1.3 Prix ──────────── */
  {
    id: "politiques-prix",
    titre: "Les politiques tarifaires",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.3",
    questionLabel: "Le prix, entre raison et illusion ?",
    sousTheme: "Politique de prix",
    definition: "Les politiques tarifaires definissent la manière dont l'entreprise fixe et gere ses prix. On distingue le prix unique (même prix pour tous), le prix différencié (prix variable selon le client, le moment ou le lieu), le prix forfaitaire (pack ou abonnement) et le yield management (tarification dynamique en temps réel). Chaque politique répond à des objectifs stratégiques différents.",
    explicationSimple: "Le prix, ce n'est pas qu'un chiffre. C'est une stratégie. Un cinema peut faire payer tout le monde 12 euros (prix unique), faire des tarifs etudiants (différencié), proposer un abonnement illimite (forfaitaire), ou changer les prix selon l'horaire (yield management). Le choix de la politique de prix influence directement qui acheté et combien.",
    mecanismeMarketing: "Le prix unique simplifie la gestion mais ne s'adapte pas aux différences de pouvoir d'achat. Le prix différencié maximise le chiffre d'affaires en adaptant le prix à la disposition à payer de chaque segment (tarifs jeunes, seniors, professionnels). Le prix forfaitaire crée un effet 'bonne affaire' (menus McDonald's). Le yield management utilise des algorithmes pour ajuster les prix en temps réel selon la demande (compagnies aeriennes, hôtels). Le choix de la politique doit être cohérent avec le positionnement et la stratégie globale de l'entreprise.",
    exemples: [
      { marque: "SNCF", description: "La SNCF cumule plusieurs politiques : prix differencies (tarifs jeunes, seniors, familles, abonnes), yield management sur les TGV (le même trajet peut coûter de 19 a 150 euros selon la date de réservation et le remplissage), et forfaits (carte Avantage). Un même billet peut avoir 10 prix différents." },
      { marque: "McDonald's", description: "McDonald's utilise le prix forfaitaire avec ses menus (hamburger + frites + boisson à prix réduit vs achats separes). Le client à l'impression de faire une bonne affaire tout en augmentant son panier moyen. L'entreprise utilise aussi le prix différencié selon les pays et les zones géographiques." }
    ],
    liensAutresConcepts: ["yield-management", "fixation-prix", "sensibilite-prix", "valeur-percue"],
    prerequis: ["positionnement", "valeur-percue"],
    complementaires: ["yield-management", "fixation-prix"],
    prolongements: ["sensibilite-prix", "modeles-gratuite"],
    pistesDargumentation: [
      "Comparer les differentes politiques tarifaires et leurs effets sur le comportement du consommateur",
      "Analyser la cohérence nécessaire entre politique de prix et positionnement de marque",
      "Discuter si le prix différencié est une forme de discrimination ou d'adaptation intelligente au marché",
      "Montrer comment le numérique a transforme les politiques tarifaires (dynamic pricing, comparateurs)"
    ],
    motsCles: {
      directs: ["politique de prix", "politique tarifaire", "prix unique", "prix differencie", "prix forfaitaire", "tarif", "tarification", "strategie de prix"],
      indirects: ["cout", "marge", "remise", "promotion", "abonnement", "panier moyen", "pouvoir d'achat"],
      synonymes: ["pricing", "pricing strategy", "strategie tarifaire"],
      notionsProches: ["yield management", "fixation du prix", "sensibilite prix", "valeur percue"]
    }
  },
  {
    id: "yield-management",
    titre: "Le yield management",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.3",
    questionLabel: "Le prix, entre raison et illusion ?",
    sousTheme: "Politique de prix",
    definition: "Le yield management (ou revenue management) est une technique de tarification dynamique qui consiste à ajuster les prix en temps réel en fonction de la demande, du taux de remplissage et du moment de réservation. Il s'applique principalement aux secteurs à capacité limitee et périssable (transport, hotellerie, spectacles). L'objectif est de maximiser le revenu total en vendant le bon produit, au bon prix, au bon client, au bon moment.",
    explicationSimple: "C'est le principe du billet d'avion : plus tu reserves tard, plus c'est cher. Et si tout le monde veut partir au même moment, les prix explosent. Un algorithme ajuste les prix en permanence selon l'offre restante et la demande. C'est comme les prix Uber en heure de pointe : quand tout le monde veut une voiture, le prix monte automatiquement.",
    mecanismeMarketing: "Des algorithmes analysent en continu les données historiques de vente, les reservations en cours, les événements a venir et le comportement de la concurrence. Ils ajustent les prix à la hausse ou à la baisse pour maximiser le taux de remplissage ET le revenu par unite. Les conditions sont : capacité fixe (places limitees), demande fluctuante, possibilite de segmentation temporelle et un système de réservation. Le yield management peut générer 5 a 10% de revenus supplémentaires par rapport à un prix fixe.",
    exemples: [
      { marque: "Air France", description: "Air France modifie les prix de ses billets plusieurs fois par jour en fonction du remplissage de chaque vol, de la période, de la demande et des prix concurrents. Un Paris-New York peut coûter 300 euros reserve 6 mois à l'avance ou 1500 euros la veille du depart." },
      { marque: "Uber", description: "Uber utilise le surge pricing (prix dynamique) : quand la demande de courses dépasse l'offre de chauffeurs (heures de pointe, pluie, événements), le prix est multiplie par 1,5 a 3. Le système ajuste en temps réel pour equilibrer offre et demande, incitant plus de chauffeurs a se connecter." }
    ],
    liensAutresConcepts: ["politiques-prix", "fixation-prix", "sensibilite-prix", "e-commerce"],
    prerequis: ["politiques-prix"],
    complementaires: ["sensibilite-prix", "fixation-prix"],
    prolongements: ["e-commerce", "kpi-communication"],
    pistesDargumentation: [
      "Analyser si le yield management est juste pour le consommateur ou s'il favorise les plus riches et les mieux informes",
      "Montrer comment les algorithmes optimisent les revenus dans les secteurs à capacité limitee",
      "Discuter les limites ethiques de la tarification dynamique (transparence, acceptabilité sociale)",
      "Comparer le yield management dans l'aérien et dans d'autres secteurs (hotellerie, spectacles, VTC)"
    ],
    motsCles: {
      directs: ["yield management", "revenue management", "tarification dynamique", "prix dynamique", "dynamic pricing", "surge pricing"],
      indirects: ["algorithme", "demande", "remplissage", "reservation", "temps reel", "optimisation", "revenu"],
      synonymes: ["gestion du rendement", "revenue optimization", "dynamic pricing"],
      notionsProches: ["politique de prix", "fixation du prix", "sensibilite prix", "e-commerce"]
    }
  },
  {
    id: "modeles-gratuite",
    titre: "Les modèles de gratuité",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.3",
    questionLabel: "Le prix, entre raison et illusion ?",
    sousTheme: "Politique de prix",
    definition: "Les modèles de gratuité proposent un acces gratuit à un produit ou service, finances par d'autres sources de revenus. Les principaux modèles sont le freemium (version gratuité limitee + version payante premium), le modèle publicitaire (contenu gratuit finance par la publicite) et le modèle de données (service gratuit en échange de données personnelles monétisees).",
    explicationSimple: "Quand c'est gratuit, c'est toi le produit. Spotify gratuit, c'est de la musique avec des pubs : tu paies avec ton temps d'attention et tes données. Google est 'gratuit' parce que tes recherches permettent de te cibler avec de la pub. Le freemium, c'est la drogue gratuité pour te rendre accro avant de payer : Fortnite est gratuit mais les skins sont payants.",
    mecanismeMarketing: "Le freemium convertit 2 a 5% des utilisateurs gratuits en payants, mais les utilisateurs gratuits servent de base de masse (effet réseau, bouche-a-oreille). Le modèle publicitaire monétise l'audience aupres d'annonceurs. Le modèle de données collecte et revend les informations personnelles à des tiers. Ces modèles creent un coût de transfert psychologique (switching cost) : une fois habitue au service gratuit, le consommateur est reluctant à changer. La question éthique du 'prix cache' (perte de vie privée, attention captee) est de plus en plus debattue.",
    exemples: [
      { marque: "Spotify", description: "Spotify illustre parfaitement le freemium : version gratuité avec publicites et lecture aleatoire, version Premium a 10,99 euros/mois sans pub avec toutes les fonctionnalités. L'objectif est de convertir les utilisateurs gratuits en abonnes payants. Environ 45% des utilisateurs sont premium, un taux exceptionnel pour du freemium." },
      { marque: "TikTok", description: "TikTok est entièrement gratuit pour les utilisateurs, finance par la publicite (publicites dans le fil, challenges sponsorises, shopping intégré). En échange, l'application collecte enormement de données sur les preferences et comportements des utilisateurs pour affiner le ciblage publicitaire et son algorithme de recommandation." }
    ],
    liensAutresConcepts: ["politiques-prix", "e-commerce", "kpi-communication", "community-management"],
    prerequis: ["politiques-prix"],
    complementaires: ["fixation-prix", "sensibilite-prix"],
    prolongements: ["e-commerce", "parcours-client-digital"],
    pistesDargumentation: [
      "Analyser si la gratuité est un vrai modèle economique viable ou une illusion financière",
      "Montrer que 'quand c'est gratuit, c'est toi le produit' : le vrai prix de la gratuité (données, attention)",
      "Comparer les différents modèles de gratuité (freemium vs publicitaire vs données) et leurs limites",
      "Discuter les enjeux ethiques de la monétisation des données personnelles"
    ],
    motsCles: {
      directs: ["gratuite", "freemium", "modele gratuit", "free", "premium", "gratuit", "modele publicitaire"],
      indirects: ["donnees", "publicite", "abonnement", "conversion", "monetisation", "audience", "attention"],
      synonymes: ["free model", "freemium model", "ad-supported model"],
      notionsProches: ["politique de prix", "e-commerce", "RGPD", "donnees personnelles"]
    }
  },
  {
    id: "fixation-prix",
    titre: "La fixation du prix (coûts, marge, prix cible)",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.3",
    questionLabel: "Le prix, entre raison et illusion ?",
    sousTheme: "Politique de prix",
    definition: "La fixation du prix repose sur trois approches complementaires : par les coûts (prix de revient + marge souhaitee), par la demande (prix psychologique ou prix d'acceptabilité que le consommateur est prêt à payer) et par la concurrence (alignement, pénétration ou écrémage). Le prix cible part du prix que le marché est prêt à payer pour remonter vers le coût de production acceptable.",
    explicationSimple: "Pour fixer un prix, l'entreprise à 3 boussoles. Les coûts : combien ca coûte a fabriquer ? La demande : combien le client est prêt à payer ? La concurrence : a combien les autres vendent ? Le prix ideal est au croisement de ces 3 logiques. Si tu vends trop cher, personne n'acheté. Trop pas cher, tu perds de l'argent.",
    mecanismeMarketing: "L'approche par les coûts calcule : prix = coût de revient + marge. L'approche par la demande utilise des études de prix psychologique (en dessous, le produit parait 'suspect', au-dessus, il est trop cher). L'approche concurrentielle definit un prix relatif : en dessous (pénétration, conquete de parts de marché), au même niveau (alignement) ou au-dessus (écrémage, image premium). Le prix cible (target costing) inverse la logique : on part du prix que le marché accepte et on conçoit le produit pour que le coût tienne dans cette enveloppe.",
    exemples: [
      { marque: "Zara", description: "Zara utilise une approche prix cible : le departement design conçoit des vetements en partant du prix que la cible (jeunes urbains) est prete à payer. Les équipes de production doivent ensuite fabriquer dans cette enveloppe budgetaire. C'est le prix qui guide la conception, pas l'inverse." },
      { marque: "Apple", description: "Apple pratique l'écrémage : prix élèves au lancement (iPhone à plus de 1000 euros) pour capter les early adopters à forte disposition à payer, puis réduction progressive. Le prix élevé renforce aussi la perception premium de la marque." }
    ],
    liensAutresConcepts: ["politiques-prix", "sensibilite-prix", "valeur-percue", "positionnement"],
    prerequis: ["politiques-prix", "valeur-percue"],
    complementaires: ["sensibilite-prix", "yield-management"],
    prolongements: ["modeles-gratuite"],
    pistesDargumentation: [
      "Comparer les 3 approches de fixation du prix (coûts, demande, concurrence) et leurs limites respectives",
      "Analyser la methode du prix cible (target costing) avec un exemple concret (Zara, Dacia)",
      "Montrer que le prix est un signal de qualité pour le consommateur (prix élevé = meilleur produit ?)",
      "Discuter si la stratégie d'écrémage est toujours justifiee ou si elle exclut des consommateurs"
    ],
    motsCles: {
      directs: ["fixation du prix", "cout de revient", "marge", "prix cible", "prix psychologique", "ecremage", "penetration", "target costing"],
      indirects: ["rentabilite", "benefice", "seuil de rentabilite", "prix d'acceptabilite", "disposition a payer"],
      synonymes: ["pricing", "price setting", "price fixation"],
      notionsProches: ["politique de prix", "sensibilite prix", "valeur percue", "positionnement"]
    }
  },
  {
    id: "sensibilite-prix",
    titre: "La sensibilité-prix et l'élasticité",
    theme: "theme1",
    themeLabel: "Définition de l'offre",
    question: "Q1.3",
    questionLabel: "Le prix, entre raison et illusion ?",
    sousTheme: "Politique de prix",
    definition: "La sensibilité-prix mesure l'importance que le consommateur accorde au prix dans sa décision d'achat. L'élasticité-prix de la demande mesure la variation de la demande en réponse à une variation du prix. Une demande élastique (|e|>1) reagit fortement aux changements de prix. Une demande inélastique (|e|<1) reagit peu, car le produit est perçu comme indispensable, unique ou fortement différencié.",
    explicationSimple: "Si le prix du pain augmente de 20%, tu continues a en acheter (demande inélastique, produit de première nécessite). Mais si le prix d'un jean Levi's augmente de 20%, tu risques d'acheter une autre marque (demande élastique, beaucoup d'alternatives). La sensibilité-prix depend du produit, du consommateur et de la situation.",
    mecanismeMarketing: "Les facteurs qui reduisent la sensibilité-prix sont : la différenciation forte (Apple), l'absence de substituts (medicaments), la faible part dans le budget total (chewing-gum), l'urgence du besoin, l'attachement à la marque et la qualité perçue élevée. Les entreprises cherchent à réduire la sensibilité-prix de leurs clients en travaillant sur la différenciation, la marque et l'expérience. Le e-commerce et les comparateurs de prix ont globalement augmente la sensibilité-prix car ils facilitent la comparaison.",
    exemples: [
      { marque: "Apple", description: "La sensibilité-prix des clients Apple est tres faible : malgre des prix 30 a 50% supérieurs à la concurrence, les clients restent fidèles. L'écosystème (iCloud, AirDrop, compatibilite entre appareils), la marque forte et la différenciation perçue rendent la demande inélastique. Une hausse de prix a peu d'impact sur les ventes." },
      { marque: "Ryanair", description: "Les clients de Ryanair ont une sensibilité-prix tres élevée : ils choisissent la compagnie uniquement pour le prix bas. La moindre hausse de tarif les fait basculer vers EasyJet ou le train. La demande est tres élastique car le transport aérien low cost est perçu comme un produit banal et interchangeable." }
    ],
    liensAutresConcepts: ["politiques-prix", "fixation-prix", "valeur-percue", "marque"],
    prerequis: ["politiques-prix", "fixation-prix"],
    complementaires: ["valeur-percue", "marque"],
    prolongements: ["yield-management", "promotion-ventes"],
    pistesDargumentation: [
      "Analyser les facteurs qui influencent la sensibilité-prix du consommateur avec des exemples concrets",
      "Montrer comment une entreprise peut réduire la sensibilité-prix de ses clients (différenciation, marque, fidélisation)",
      "Discuter l'impact des comparateurs de prix et du e-commerce sur la sensibilité-prix des consommateurs",
      "Comparer la sensibilité-prix pour un produit de luxe vs un produit de grande consommation"
    ],
    motsCles: {
      directs: ["sensibilite prix", "elasticite", "elasticite prix", "elastique", "inelastique", "sensibilite au prix"],
      indirects: ["demande", "variation", "pouvoir d'achat", "substitut", "comparateur", "budget", "prix"],
      synonymes: ["price sensitivity", "price elasticity", "elasticite de la demande"],
      notionsProches: ["politique de prix", "fixation du prix", "valeur percue", "marque", "promotion"]
    }
  },

  /* ──────────── THÈME 2 — Q2.1 Distribution ──────────── */
  {
    id: "canaux-distribution",
    titre: "Les canaux de distribution",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.1",
    questionLabel: "La grande distribution est-elle incontournable ?",
    sousTheme: "Canaux et circuits",
    definition: "Un canal de distribution est le chemin emprunte par un produit pour aller du producteur au consommateur final. On distingue le canal direct (producteur → consommateur), le canal court (producteur → détaillant → consommateur) et le canal long (producteur → grossiste → détaillant → consommateur). Le circuit de distribution combine plusieurs canaux.",
    explicationSimple: "C'est le chemin que prend un produit pour arriver dans tes mains. Un agriculteur qui vend ses legumes au marché, c'est un canal direct. S'il passe par un supermarche, c'est un canal court. S'il passe par un grossiste puis un supermarche, c'est un canal long. Plus le canal est long, plus il y a d'intermédiaires qui prennent une marge.",
    mecanismeMarketing: "Le choix du canal depend du type de produit, du volume de production, de la cible visee et des coûts logistiques. Le canal direct offre un contrôle total et une marge maximale mais limite la couverture géographique. Le canal long maximise la couverture mais réduit la marge et le contrôle. La tendance est au multicanal (combiner plusieurs canaux) et au direct-to-consumer (DTC) qui supprime les intermédiaires grace au numérique.",
    exemples: [
      { marque: "Nespresso", description: "Nespresso utilise principalement le canal direct (boutiques propres + site internet) pour garder le contrôle de l'expérience client et des marges. Ce choix stratégique renforce l'image premium et evite la banalisation en grande distribution, même si cela limite la couverture géographique." },
      { marque: "Leclerc", description: "Leclerc est un intermédiaire majeur du canal court et long : les magasins referencent des milliers de produits de centaines de producteurs. Le groupement négocie les prix d'achat pour obtenir les meilleurs tarifs et les repercuter aux consommateurs. Leclerc est aussi devenu un acteur digital avec le drive et la livraison." }
    ],
    liensAutresConcepts: ["intermediation", "politiques-distribution", "e-commerce", "ropo-omnicanal"],
    prerequis: [],
    complementaires: ["intermediation", "politiques-distribution"],
    prolongements: ["ropo-omnicanal", "e-commerce", "marketplace"],
    pistesDargumentation: [
      "Comparer les avantages et inconvenients des canaux direct, court et long pour le producteur ET le consommateur",
      "Analyser comment le numérique bouleverse les canaux de distribution traditionnels (DTC, e-commerce)",
      "Discuter si la vente directe (sans intermédiaires) est toujours avantageuse pour le producteur",
      "Montrer l'évolution vers le multicanal et ses implications stratégiques"
    ],
    motsCles: {
      directs: ["canal de distribution", "canaux", "circuit de distribution", "canal direct", "canal court", "canal long", "intermediaire"],
      indirects: ["distribution", "grossiste", "detaillant", "logistique", "couverture", "marge", "producteur", "consommateur"],
      synonymes: ["distribution channel", "circuit", "filiere"],
      notionsProches: ["intermediation", "politique de distribution", "e-commerce", "omnicanalite"]
    }
  },
  {
    id: "intermediation",
    titre: "Intermédiation et désintermédiation",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.1",
    questionLabel: "La grande distribution est-elle incontournable ?",
    sousTheme: "Canaux et circuits",
    definition: "L'intermédiation est le rôle joue par un acteur (grossiste, détaillant, plateforme) qui se place entre le producteur et le consommateur pour faciliter l'échange. La désintermédiation consiste à supprimer ces intermédiaires pour vendre directement au client final. La réintermédiation désigne l'apparition de nouveaux intermédiaires numériques (plateformes, marketplaces) qui remplacent les anciens.",
    explicationSimple: "Un intermédiaire, c'est le 'middleman'. Longtemps, les artisans avaient besoin de boutiques pour vendre. Avec Internet, un createur peut vendre directement sur Instagram (désintermédiation). Mais de nouvelles plateformes comme Etsy ou Amazon s'intercalent a nouveau entre vendeur et acheteur (réintermédiation). Les intermédiaires changent, mais ne disparaissent jamais completement.",
    mecanismeMarketing: "La désintermédiation est rendue possible par le numérique (sites e-commerce, réseaux sociaux, vente directe en ligne). Elle permet au producteur de récupérer la marge des intermédiaires et de contrôler la relation client. Mais elle impose de gérer la logistique, le service client et la visibilité. La réintermédiation numérique (Amazon, Uber Eats, Booking) crée de nouveaux gatekeepers qui captent une part importante de la valeur en échange de leur audience et de leur infrastructure.",
    exemples: [
      { marque: "Le Slip Francais", description: "Le Slip Francais est ne en vente directe (DTC) sur son site internet, supprimant les intermédiaires traditionnels (grossistes, boutiques multimarques). Cette désintermédiation permet des marges plus elevees et un contrôle total de l'image de marque, même si l'entreprise a ensuite ouvert des boutiques propres." },
      { marque: "Uber Eats", description: "Uber Eats est un cas typique de réintermédiation : les restaurants vendaient directement à leurs clients, puis Uber Eats s'est interpose comme nouvel intermédiaire numérique. La plateforme prend 15 a 30% de commission mais apporte visibilité et livraison. Les restaurateurs sont dépendantts de ce nouvel intermédiaire." }
    ],
    liensAutresConcepts: ["canaux-distribution", "e-commerce", "marketplace", "relations-prod-distrib"],
    prerequis: ["canaux-distribution"],
    complementaires: ["e-commerce", "marketplace"],
    prolongements: ["relations-prod-distrib", "distribution-collaborative"],
    pistesDargumentation: [
      "Analyser comment Internet a provoque une vague de désintermédiation puis de réintermédiation",
      "Discuter si la désintermédiation profite vraiment au consommateur (prix plus bas ?) ou au producteur (marges plus elevees ?)",
      "Montrer que les plateformes numériques sont les nouveaux intermédiaires incontournables du 21e siecle",
      "Comparer le pouvoir des anciens intermédiaires (grande distribution) vs les nouveaux (GAFAM, plateformes)"
    ],
    motsCles: {
      directs: ["intermediation", "desintermediation", "reintermediation", "intermediaire", "DTC", "direct to consumer"],
      indirects: ["plateforme", "grossiste", "detaillant", "commission", "marge", "vente directe", "numerique"],
      synonymes: ["intermediary", "middleman", "disintermediation"],
      notionsProches: ["canaux de distribution", "e-commerce", "marketplace", "relations producteurs-distributeurs"]
    }
  },
  {
    id: "politiques-distribution",
    titre: "Les politiques de distribution",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.1",
    questionLabel: "La grande distribution est-elle incontournable ?",
    sousTheme: "Canaux et circuits",
    definition: "Les politiques de distribution definissent le degré de couverture du marché choisi par l'entreprise. La distribution intensive vise le maximum de points de vente. La distribution sélective choisit des revendeurs repondant à des critères qualitatifs. La distribution exclusive reserve la vente à un nombre tres limite de distributeurs sur une zone géographique.",
    explicationSimple: "C'est le choix stratégique : ou veux-tu que ton produit soit vendu ? Coca-Cola est partout (intensif : supermarches, bars, distributeurs). Les parfums Chanel sont en parfumerie selectionnee (sélectif). Rolex n'est vendu que chez des horlogers agrees (exclusif). Plus c'est rare, plus ca renforce l'image premium.",
    mecanismeMarketing: "La distribution intensive maximise la couverture et les volumes mais dilue l'image et réduit le contrôle sur les conditions de vente. La distribution sélective permet de contrôler l'image et le service tout en maintenant une bonne couverture. La distribution exclusive protege l'image de marque, garantit un service premium mais limite les volumes. Le choix depend du positionnement, du type de produit et de la stratégie de marque.",
    exemples: [
      { marque: "Coca-Cola", description: "Coca-Cola pratique la distribution intensive la plus poussee au monde : le produit est disponible dans plus de 200 pays, dans les supermarches, les bars, les restaurants, les distributeurs automatiques, les stations-service. L'objectif est d'être 'a portee de main' du consommateur en toute circonstance." },
      { marque: "Rolex", description: "Rolex pratique la distribution exclusive : seuls les horlogers officiellement agrees peuvent vendre des montres Rolex. Chaque détaillant est sélectionné pour son prestige, son emplacement et sa capacité à offrir un service premium. Cette rareté maîtrisée renforce l'image de luxe et la désirabilité de la marque." }
    ],
    liensAutresConcepts: ["canaux-distribution", "positionnement", "marque", "relations-prod-distrib"],
    prerequis: ["canaux-distribution", "positionnement"],
    complementaires: ["relations-prod-distrib", "ecr"],
    prolongements: ["digitalisation-uc", "ropo-omnicanal"],
    pistesDargumentation: [
      "Comparer les 3 politiques de distribution et leurs impacts sur l'image de marque",
      "Analyser pourquoi les marques de luxe privilegient la distribution sélective ou exclusive",
      "Discuter si le e-commerce remet en cause les stratégies de distribution sélective (ventes grises, contrefacons)",
      "Montrer le lien entre politique de distribution et positionnement de marque"
    ],
    motsCles: {
      directs: ["distribution intensive", "distribution selective", "distribution exclusive", "politique de distribution", "couverture", "referencement"],
      indirects: ["point de vente", "reseau", "detaillant", "franchise", "concession", "agrement", "maillage"],
      synonymes: ["distribution strategy", "distribution policy", "strategie de distribution"],
      notionsProches: ["canaux de distribution", "positionnement", "marque", "relations producteurs-distributeurs"]
    }
  },
  {
    id: "relations-prod-distrib",
    titre: "Les relations producteurs-distributeurs",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.1",
    questionLabel: "La grande distribution est-elle incontournable ?",
    sousTheme: "Canaux et circuits",
    definition: "Les relations entre producteurs et distributeurs oscillent entre cooperation et conflit. Elles se structurent autour de la négociation commerciale (prix, conditions de vente, marges arriere), du référencement (acces aux lineaires), du rapport de force (loi Egalim) et des partenariats (trade marketing, MDD). Le cadre legal encadre ces relations pour proteger les parties les plus faibles.",
    explicationSimple: "C'est un rapport de force permanent. Les grandes surfaces (Leclerc, Carrefour) ont un pouvoir enorme car elles decidement quels produits sont en rayon. Les producteurs ont besoin de cette visibilité pour vendre. Cette tension se traduit par des négociations annuelles tres dures sur les prix. La loi Egalim essaie d'equilibrer ce rapport de force pour proteger les agriculteurs et les PME.",
    mecanismeMarketing: "Le producteur négocie le référencement (acces aux rayons), l'emplacement en linéaire (tête de gondole = visibilité maximale), les conditions commerciales (prix, remises, promotions) et les marges arriere. Le distributeur utilise son pouvoir de marché pour obtenir les meilleurs prix. Le trade marketing crée des synergies entre les deux parties (operations conjointes, données partagees). Les MDD (marques de distributeur) sont un levier de pouvoir supplémentaire pour le distributeur.",
    exemples: [
      { marque: "Lactalis vs Leclerc", description: "Les négociations annuelles entre les geants du lait (Lactalis, Danone) et de la distribution (Leclerc, Carrefour) sont legendaires. En 2024, Leclerc a derefence temporairement des produits Pepsi pour faire pression sur les prix. Ces conflits illustrent le rapport de force déséquilibre au detriment des producteurs." },
      { marque: "C'est qui le patron ?!", description: "La marque 'C'est qui le patron ?!' est nee en réaction au déséquilibre des relations producteurs-distributeurs. Les consommateurs votent pour definir le prix du lait qui garantit une juste rémunération aux agriculteurs. C'est un modèle unique de cooperation tripartite producteur-distributeur-consommateur." }
    ],
    liensAutresConcepts: ["politiques-distribution", "canaux-distribution", "ecr", "intermediation"],
    prerequis: ["canaux-distribution", "politiques-distribution"],
    complementaires: ["ecr", "intermediation"],
    prolongements: ["distribution-collaborative"],
    pistesDargumentation: [
      "Analyser le rapport de force entre producteurs et grande distribution et ses consequences",
      "Montrer comment la loi Egalim tente de rééquilibrer les négociations commerciales",
      "Discuter le rôle des MDD dans les relations producteurs-distributeurs",
      "Comparer les modèles de relations cooperatives vs conflictuelles et leurs impacts"
    ],
    motsCles: {
      directs: ["relations producteurs distributeurs", "negociation commerciale", "referencement", "deferencement", "loi egalim", "marge arriere", "trade marketing"],
      indirects: ["rapport de force", "grande distribution", "lineaire", "tete de gondole", "conditions commerciales", "MDD"],
      synonymes: ["supplier-retailer relationship", "negociations commerciales"],
      notionsProches: ["politique de distribution", "canaux de distribution", "ECR", "intermediation"]
    }
  },
  {
    id: "ecr",
    titre: "L'ECR (Efficient Consumer Response)",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.1",
    questionLabel: "La grande distribution est-elle incontournable ?",
    sousTheme: "Canaux et circuits",
    definition: "L'ECR (Reponse Efficace au Consommateur) est une stratégie de cooperation entre producteurs et distributeurs visant à optimiser la chaîne d'approvisionnement pour mieux satisfaire le consommateur final. Elle repose sur 4 piliers : assortiment efficient, réapprovisionnement efficient, promotions efficientes et lancement efficient de nouveaux produits. L'ECR utilise des outils comme l'EDI (échange de données informatisees) et le category management.",
    explicationSimple: "L'ECR, c'est quand Coca-Cola et Carrefour arretent de se battre et cooperent pour que le bon produit soit au bon endroit, au bon moment, au bon prix. Plutot que de négocier durement chacun de leur cote, ils partagent des données (ventes, stocks) pour éviter les ruptures de stock et optimiser les promotions. Tout le monde y gagne, surtout le consommateur.",
    mecanismeMarketing: "L'ECR partage des données en temps réel entre producteur et distributeur via l'EDI (codes-barres, flux logistiques automatises). Le category management organise les rayons par categories de besoins du consommateur plutôt que par type de produit. Le réapprovisionnement automatique (GPA - Gestion Partagee des Approvisionnements) evite les ruptures et le surstockage. L'ensemble réduit les coûts logistiques de 2 a 5% et amélioré la satisfaction client par une meilleure disponibilité des produits.",
    exemples: [
      { marque: "Procter & Gamble / Walmart", description: "Le partenariat P&G-Walmart est le cas d'ecole de l'ECR : les deux entreprises partagent leurs données de vente en temps réel, les stocks sont reapprovisionnes automatiquement et les promotions sont coordonnees. Ce partenariat a réduit les coûts logistiques de 10% et les ruptures de stock de 70%." },
      { marque: "Unilever / Carrefour", description: "Unilever et Carrefour pratiquent le category management conjoint : les rayons hygiene-beaute sont organises selon les parcours d'achat des consommateurs (par besoin : soin du visage, capillaire, etc.) plutôt que par marque, augmentant les ventes de la categorie de 8%." }
    ],
    liensAutresConcepts: ["relations-prod-distrib", "canaux-distribution", "digitalisation-uc"],
    prerequis: ["relations-prod-distrib", "canaux-distribution"],
    complementaires: ["politiques-distribution", "digitalisation-uc"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser comment l'ECR transforme des relations conflictuelles en partenariats gagnant-gagnant",
      "Montrer les bénéfices concrets de l'ECR pour le consommateur (disponibilité, prix, fraicheur)",
      "Discuter les limites de l'ECR : dépendantce technologique, partage de données sensibles, asymetrie de pouvoir",
      "Comparer un rayon organise en category management vs un rayon traditionnel"
    ],
    motsCles: {
      directs: ["ECR", "efficient consumer response", "category management", "EDI", "GPA", "reapprovisionnement", "gestion partagee"],
      indirects: ["cooperation", "chaine d'approvisionnement", "supply chain", "optimisation", "rupture de stock", "logistique"],
      synonymes: ["reponse efficace au consommateur", "supply chain management"],
      notionsProches: ["relations producteurs-distributeurs", "digitalisation", "logistique"]
    }
  },

  /* ──────────── THÈME 2 — Q2.2 Numérique & distribution ──────────── */
  {
    id: "ropo-omnicanal",
    titre: "ROPO et omnicanalité",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.2",
    questionLabel: "Le numérique redéfinit-il les frontières du point de vente ?",
    sousTheme: "Distribution numérique",
    definition: "ROPO (Research Online, Purchase Offline) désigne le comportement du consommateur qui recherche des informations en ligne avant d'acheter en magasin. L'omnicanalite est une stratégie de distribution qui intégré tous les canaux (magasin, site web, appli, réseaux sociaux) dans une expérience client fluide et cohérente, sans rupture quel que soit le point de contact.",
    explicationSimple: "Tu cherches un smartphone sur Internet, tu compares les prix, tu lis les avis (Research Online)... puis tu vas l'acheter chez Fnac pour le voir en vrai (Purchase Offline). C'est le ROPO. L'omnicanalite, c'est quand Fnac te permet de commencer en ligne, tester en magasin, commander sur l'appli et te faire livrer chez toi, le tout avec une expérience cohérente.",
    mecanismeMarketing: "Le ROPO concerne 60 a 80% des achats en magasin (le consommateur se renseigne d'abord en ligne). L'omnicanalite exige que tous les canaux soient interconnectes : stock unifie (disponible en ligne = disponible en magasin), click and collect, retour en magasin d'un achat en ligne, historique client unique. L'inverse du ROPO existe aussi : le showrooming (voir en magasin, acheter en ligne moins cher). L'enjeu est d'offrir une expérience sans couture (seamless) entre le physique et le digital.",
    exemples: [
      { marque: "Fnac", description: "Fnac est un modèle d'omnicanalite : le client peut verifier le stock en ligne, reserver un produit pour le retirer en 1h (click and collect), comparer les prix, lire les avis des vendeurs et des clients, et retourner en magasin un achat fait en ligne. L'appli Fnac fait le lien entre tous ces canaux." },
      { marque: "Zara", description: "Zara intégré le ROPO dans sa stratégie : l'appli permet de scanner un article en magasin pour voir les tailles disponibles, de commander en ligne un produit en rupture, et de retourner les achats web en boutique. Le stock est unifie entre les canaux, offrant une expérience sans rupture." }
    ],
    liensAutresConcepts: ["canaux-distribution", "e-commerce", "parcours-client-digital", "digitalisation-uc"],
    prerequis: ["canaux-distribution", "parcours-client-digital"],
    complementaires: ["e-commerce", "digitalisation-uc"],
    prolongements: ["distribution-collaborative"],
    pistesDargumentation: [
      "Montrer comment le ROPO a transforme le rôle du magasin physique (de lieu de vente a showroom)",
      "Analyser les defis de la mise en place d'une stratégie omnicanale pour une enseigne traditionnelle",
      "Discuter si le showrooming menace les magasins physiques ou les pousse à se réinventer",
      "Comparer une expérience multicanale (canaux separes) vs omnicanale (canaux integres)"
    ],
    motsCles: {
      directs: ["ROPO", "research online purchase offline", "omnicanalite", "omnicanal", "click and collect", "showrooming", "cross-canal"],
      indirects: ["en ligne", "magasin", "web to store", "phygital", "parcours", "experience", "sans couture"],
      synonymes: ["omnichannel", "web-to-store", "seamless experience"],
      notionsProches: ["canaux de distribution", "e-commerce", "parcours client digital", "digitalisation"]
    }
  },
  {
    id: "distribution-collaborative",
    titre: "La distribution collaborative",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.2",
    questionLabel: "Le numérique redéfinit-il les frontières du point de vente ?",
    sousTheme: "Distribution numérique",
    definition: "La distribution collaborative s'appuie sur l'économie du partage et les plateformes numériques pour créer de nouveaux modes de distribution entre particuliers (C2C) ou entre communautés. Elle inclut le co-voiturage, la location entre particuliers, la revente d'occasion, le financement participatif et les circuits courts collaboratifs.",
    explicationSimple: "C'est la distribution par et pour les gens, sans entreprise traditionnelle au milieu. Vinted, c'est toi qui vends à un autre particulier. BlaBlaCar, c'est toi qui proposes un trajet. Airbnb, c'est toi qui loues ton appartement. Les plateformes connectent les gens entre eux et prennent une petite commission au passage.",
    mecanismeMarketing: "Les plateformes collaboratives creent un marché a deux faces (two-sided market) : elles doivent attirer à la fois les offreurs et les demandeurs pour générer un effet réseau. La confiance est assuree par les systemes d'avis, de notation et de paiement sécurisé. Le modèle economique repose sur la commission (% sur chaque transaction), l'abonnement ou la publicite. La distribution collaborative bouleverse les secteurs traditionnels (hotelerie, taxi, commerce) en démocratisant l'accès à l'offre.",
    exemples: [
      { marque: "Vinted", description: "Vinted a revolutionne la distribution de vetements d'occasion en creant une plateforme C2C (Consumer to Consumer) sans commission pour le vendeur. L'effet réseau (50 millions d'utilisateurs en Europe) rend la plateforme incontournable. Vinted illustre comment la distribution collaborative cannibalise la fast fashion traditionnelle." },
      { marque: "BlaBlaCar", description: "BlaBlaCar est le leader mondial du covoiturage longue distance. La plateforme met en relation conducteurs et passagers, creant un nouveau canal de distribution pour le transport de personnes. Le système de notation bidirectionnelle garantit la confiance. Le modèle prend une commission de 20% sur chaque trajet." }
    ],
    liensAutresConcepts: ["e-commerce", "marketplace", "intermediation", "ropo-omnicanal"],
    prerequis: ["intermediation", "e-commerce"],
    complementaires: ["marketplace", "ropo-omnicanal"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser comment l'économie collaborative bouleverse les modèles de distribution traditionnels",
      "Montrer les avantages et limites de la distribution collaborative pour le consommateur",
      "Discuter si Uber, Airbnb et Vinted sont de la vraie économie collaborative ou du capitalisme de plateforme",
      "Comparer l'impact environnemental de la distribution collaborative vs la distribution traditionnelle"
    ],
    motsCles: {
      directs: ["distribution collaborative", "economie collaborative", "economie du partage", "C2C", "peer to peer", "plateforme"],
      indirects: ["partage", "communaute", "occasion", "location", "covoiturage", "financement participatif"],
      synonymes: ["collaborative economy", "sharing economy", "peer-to-peer economy"],
      notionsProches: ["e-commerce", "marketplace", "intermediation", "economie circulaire"]
    }
  },

  /* ──────────── THÈME 2 — Q2.3 Digitalisation ──────────── */
  {
    id: "digitalisation-uc",
    titre: "La digitalisation des unités commerciales",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.3",
    questionLabel: "Le numérique redéfinit-il les frontières du point de vente ?",
    sousTheme: "Digitalisation",
    definition: "La digitalisation des unites commerciales consiste à intégrer des technologies numériques dans les points de vente physiques pour enrichir l'expérience client, optimiser la gestion et créer des synergies entre le online et le offline. On parle de 'phygital' (physique + digital). Les outils incluent les bornes interactives, le paiement mobile, les écrans dynamiques, les QR codes, la realite augmentee et les capteurs IoT.",
    explicationSimple: "C'est le magasin du futur qui est déjà la. Chez Decathlon, tu passes en caisse en posant tout ton panier sur un tapis RFID qui scanne automatiquement tes articles. Chez Sephora, tu essaies du maquillage en realite augmentee. Le magasin physique devient 'phygital' : il combine le meilleur du physique (toucher, essayer) et du digital (rapidité, personnalisation).",
    mecanismeMarketing: "La digitalisation agit à 3 niveaux. Cote client : bornes de commande (McDonald's), miroirs connectes, tablettes vendeurs, click and collect, paiement sans contact. Cote gestion : inventaire RFID en temps réel, planogrammes optimises par IA, étiquettes électroniques de prix. Cote expérience : écrans geants, ambiance personnalisée, gamification. L'objectif est de générer du trafic en magasin (drive-to-store), d'augmenter le panier moyen et de collecter des données sur le comportement en magasin.",
    exemples: [
      { marque: "Decathlon", description: "Decathlon est un pionnier de la digitalisation : caisses RFID automatiques, click and collect en 1h, bornes de consultation du stock en temps réel, étiquettes électroniques, application de scan en magasin. Le taux de satisfaction en caisse a bondi de 35% grace au passage à la RFID." },
      { marque: "Amazon Go", description: "Amazon Go est le concept le plus radical de digitalisation : zero caisse, zero file d'attente. Des centaines de cameras et capteurs identifient les produits que le client prend en rayon et debitent automatiquement son compte Amazon à la sortie. Le magasin est entièrement automatise, offrant l'expérience d'achat la plus fluide possible." }
    ],
    liensAutresConcepts: ["ropo-omnicanal", "e-commerce", "experience-consommation", "parcours-client-digital"],
    prerequis: ["canaux-distribution", "ropo-omnicanal"],
    complementaires: ["e-commerce", "parcours-client-digital"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser comment le phygital reconcilie les avantages du magasin physique et du numérique",
      "Montrer les bénéfices de la digitalisation pour l'enseigne (productivité, données) ET le consommateur (expérience, rapidité)",
      "Discuter si la digitalisation des magasins ne menace pas l'emploi dans le commerce de détail",
      "Comparer les niveaux de digitalisation de differentes enseignes (Decathlon, Amazon Go, boutique traditionnelle)"
    ],
    motsCles: {
      directs: ["digitalisation", "phygital", "unite commerciale", "magasin connecte", "borne interactive", "RFID", "etiquette electronique"],
      indirects: ["technologie", "caisse automatique", "paiement mobile", "sans contact", "capteurs", "IoT", "donnees"],
      synonymes: ["digital transformation", "smart retail", "connected store"],
      notionsProches: ["ROPO", "omnicanalite", "e-commerce", "experience client"]
    }
  },
  {
    id: "e-commerce",
    titre: "E-commerce et m-commerce",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.3",
    questionLabel: "Le numérique redéfinit-il les frontières du point de vente ?",
    sousTheme: "Digitalisation",
    definition: "Le e-commerce désigne la vente de biens et services sur Internet. Le m-commerce (mobile commerce) est sa declinaison sur smartphones et tablettes. Ces canaux numériques représentent une part croissante du commerce total et offrent des avantages spécifiques : accessibilite 24/7, choix illimite, comparaison facilitee et personnalisation par les données.",
    explicationSimple: "Acheter en ligne depuis ton canape ou ton téléphone, c'est le e-commerce et le m-commerce. C'est devenu tellement banal que tu ne te rends même plus compte que tu utilises un canal de distribution totalement différent du magasin physique. En France, le e-commerce représente désormais plus de 15% du commerce de détail.",
    mecanismeMarketing: "Le e-commerce fonctionne sur un tunnel de conversion : attraction (SEO, publicite), consideration (fiche produit, avis), conversion (panier, paiement), fidélisation (email, recommandations). Le m-commerce ajoute des specificites : geolocalisation, notifications push, paiement par empreinte, achat social (via Instagram, TikTok). Les enjeux cles sont : le taux de conversion (2-3% en moyenne), le panier moyen, le taux de retour et la dernière-mile (livraison du dernier kilometre, la plus coûteuse).",
    exemples: [
      { marque: "Amazon", description: "Amazon est le leader mondial du e-commerce avec un CA de plus de 500 milliards de dollars. Son avantage compétitif repose sur 3 piliers : le choix (des centaines de millions de références), la livraison (Prime en 24h) et la technologie (algorithmes de recommandation qui generent 35% des ventes). Amazon a réduit la friction d'achat au minimum avec le paiement en 1 clic." },
      { marque: "Shein", description: "Shein est le champion du m-commerce : 80% de ses ventes se font sur l'application mobile. Le modèle 'test and repeat' utilise les données de l'appli pour lancer des centaines de nouvelles références par jour, ne produire en masse que celles qui fonctionnent, et les livrer en 7-10 jours. L'appli est gamifiee (points, roue de la fortune) pour maximiser l'engagement." }
    ],
    liensAutresConcepts: ["canaux-distribution", "marketplace", "ropo-omnicanal", "parcours-client-digital"],
    prerequis: ["canaux-distribution"],
    complementaires: ["marketplace", "ropo-omnicanal"],
    prolongements: ["kpi-communication", "modeles-gratuite"],
    pistesDargumentation: [
      "Analyser les avantages et inconvenients du e-commerce pour le consommateur et pour le distributeur",
      "Montrer comment le m-commerce transforme les habitudes d'achat (achat impulsif, social commerce)",
      "Discuter l'impact environnemental du e-commerce (livraisons, retours, emballages) vs le commerce physique",
      "Comparer les modèles e-commerce purs (Amazon) vs les stratégies omnicanales (Fnac)"
    ],
    motsCles: {
      directs: ["e-commerce", "m-commerce", "commerce en ligne", "vente en ligne", "boutique en ligne", "mobile commerce", "social commerce"],
      indirects: ["Internet", "livraison", "paiement en ligne", "panier", "taux de conversion", "retour", "derniere mile"],
      synonymes: ["commerce electronique", "online shopping", "digital commerce"],
      notionsProches: ["marketplace", "ROPO", "omnicanalite", "parcours client digital"]
    }
  },
  {
    id: "marketplace",
    titre: "Les places de marché (marketplaces)",
    theme: "theme2",
    themeLabel: "Distribution de l'offre",
    question: "Q2.3",
    questionLabel: "Le numérique redéfinit-il les frontières du point de vente ?",
    sousTheme: "Digitalisation",
    definition: "Une marketplace (place de marché) est une plateforme numérique qui met en relation des vendeurs tiers et des acheteurs, sans détenir elle-même les produits en stock. Elle se remunere par une commission sur chaque transaction. Les marketplaces beneficient d'effets de réseau : plus il y a de vendeurs, plus l'offre attire d'acheteurs, et inversement.",
    explicationSimple: "Imagine un enorme marche en plein air, mais en ligne. Amazon Marketplace, c'est comme un marché ou des milliers de vendeurs indépendants installent leur stand. Amazon fournit le lieu (la plateforme), la sécurité (le paiement), la visibilité (le trafic) et prend une commission sur chaque vente. Le vendeur n'a pas besoin de créer son propre site.",
    mecanismeMarketing: "La marketplace crée un marché a deux faces : elle doit atteindre une masse critique de vendeurs pour attirer les acheteurs (et inversement). Le modèle economique repose sur les commissions (8 a 25% selon les plateformes), les abonnements vendeurs, les publicites sponsorisees et les services logistiques (Fulfillment by Amazon). L'avantage pour le vendeur est l'accès à une audience massive. L'inconvenient est la dépendantce à la plateforme et la pression sur les marges. L'effet 'winner takes all' tend à créer des monopoles de plateforme.",
    exemples: [
      { marque: "Amazon Marketplace", description: "Amazon Marketplace heberge plus de 2 millions de vendeurs tiers qui représentent 60% des ventes totales d'Amazon. Les vendeurs paient une commission de 8 a 15% selon la categorie et peuvent utiliser FBA (Fulfillment by Amazon) pour la logistique. Le système d'avis et le badge 'Amazon's Choice' orientent les achats." },
      { marque: "Etsy", description: "Etsy est une marketplace spécialisée dans l'artisanat, le vintage et les creations uniques. Elle se différencié d'Amazon par son positionnement de niche et sa communauté de createurs. Le modèle illustre qu'une marketplace peut prosperer en ciblant un segment spécifique plutôt qu'en visant le marché de masse." }
    ],
    liensAutresConcepts: ["e-commerce", "intermediation", "canaux-distribution", "distribution-collaborative"],
    prerequis: ["e-commerce", "intermediation"],
    complementaires: ["distribution-collaborative", "canaux-distribution"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser le modèle economique des marketplaces et les effets de réseau qui les rendent dominantes",
      "Montrer les avantages et les risques pour un vendeur de dependre d'une marketplace (Amazon, Etsy)",
      "Discuter si les marketplaces creent un monopole de plateforme dangereux pour la concurrence",
      "Comparer une marketplace generaliste (Amazon) vs une marketplace de niche (Etsy, Vinted)"
    ],
    motsCles: {
      directs: ["marketplace", "place de marche", "plateforme", "vendeur tiers", "commission", "FBA", "fulfillment"],
      indirects: ["intermediaire", "reseau", "trafic", "visibilite", "avis", "notation", "effet de reseau", "masse critique"],
      synonymes: ["online marketplace", "digital marketplace", "e-marketplace"],
      notionsProches: ["e-commerce", "intermediation", "distribution collaborative", "canaux de distribution"]
    }
  },

  /* ──────────── THÈME 3 — Q3.1 Communication ──────────── */
  {
    id: "communication-commerciale",
    titre: "La communication commerciale",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.1",
    questionLabel: "Les actions de communication sont-elles un__(e) levier efficace ?",
    sousTheme: "Communication",
    definition: "La communication commerciale regroupe l'ensemble des actions par lesquelles une entreprise transmet un message à ses cibles (clients, prospects) pour les informer, les persuader ou les inciter à l'achat. Elle comprend la communication media (publicite TV, radio, presse, affichage, cinema, digital) et la communication hors-media (promotion des ventes, relations publiques, marketing direct, événementiel, parrainage).",
    explicationSimple: "C'est tout ce que fait une entreprise pour se faire connaître et donner envie d'acheter. La pub Nike à la tele, c'est de la communication media. Le code promo -20% que tu recois par email, c'est du hors-media. Une campagne TikTok avec un influenceur, c'est du digital. L'objectif est toujours le même : toucher la bonne personne avec le bon message au bon moment.",
    mecanismeMarketing: "La communication commerciale suit un processus structure : definition des objectifs (notoriété, image, action), identification de la cible, elaboration du message (promesse, ton, preuves), choix des médias et supports, planification (mediaplanning), execution et mesure des resultats. Le budget est alloue entre media et hors-media selon les objectifs. Le modèle AIDA (Attention, Interet, Desir, Action) structure la construction du message publicitaire.",
    exemples: [
      { marque: "Nike", description: "Nike excelle en communication commerciale multi-canal : publicites TV emotionnelles avec des athletes stars (media), campagnes virales sur les réseaux sociaux comme 'Just Do It' (digital), événements sportifs sponsorises (hors-media), application Nike Training Club (marketing direct). La cohérence entre tous ces messages construit une image de marque puissante." },
      { marque: "Burger King", description: "Burger King se distingue par une communication decalee et provocatrice : tacle direct de McDonald's dans ses publicites, tweets viraux, campagnes interactives. Le ton humoristique et compétitif crée de l'engagement et du bouche-a-oreille gratuit sur les réseaux sociaux." }
    ],
    liensAutresConcepts: ["copie-strategie", "medias-supports", "poem", "promotion-ventes"],
    prerequis: ["positionnement", "ciblage"],
    complementaires: ["copie-strategie", "medias-supports"],
    prolongements: ["poem", "promotion-ventes", "community-management"],
    pistesDargumentation: [
      "Comparer l'efficacité de la communication media vs hors-media dans différents contextes",
      "Analyser comment le digital a transforme la communication commerciale (ciblage, mesure, interaction)",
      "Discuter si la communication commerciale influence reellement les comportements d'achat ou si le consommateur est devenu insensible à la publicite",
      "Montrer l'importance de la cohérence entre tous les messages de communication d'une marque"
    ],
    motsCles: {
      directs: ["communication commerciale", "publicite", "communication media", "hors media", "campagne", "message", "media planning"],
      indirects: ["notoriete", "image", "persuasion", "audience", "cible", "budget", "AIDA", "annonceur"],
      synonymes: ["advertising", "commercial communication", "promotion"],
      notionsProches: ["copie strategie", "medias et supports", "POEM", "promotion des ventes"]
    }
  },
  {
    id: "copie-strategie",
    titre: "La copie stratégie",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.1",
    questionLabel: "Les actions de communication sont-elles un levier efficace ?",
    sousTheme: "Communication",
    definition: "La copie stratégie (ou copy strategy) est le document de référence qui guide la creation publicitaire. Elle definit la promesse (bénéfice principal pour le consommateur), la preuve (justification de la promesse), le bénéfice consommateur (ce qu'il gagne concrètement), le ton (style de la communication) et la contrainte (éléments obligatoires). C'est le cahier des charges creatif entre l'annonceur et l'agence.",
    explicationSimple: "C'est la recette de la publicite. Avant de créer un spot ou une affiche, l'agence doit savoir : quelle est la promesse faite au consommateur ? Quelle preuve pour y croire ? Quel ton adopter ? Par exemple, pour Dove : promesse = beaute naturelle, preuve = produits sans chimie agressive, ton = bienveillant et inclusif. Sans copie stratégie, la pub part dans tous les sens.",
    mecanismeMarketing: "La copie stratégie est elaboree par l'annonceur et/ou l'agence de communication. La promesse doit être unique, crédible et attractive (USP - Unique Selling Proposition). La preuve peut être factuelle (test, chiffre), institutionnelle (heritage, expertise) ou testimoniale (avis client, star). Le bénéfice consommateur traduit la promesse en avantage concret. Le ton definit l'ambiance (serieux, humoristique, provocateur, émotionnel). Les équipes creatives (DA, redacteurs) traduisent ensuite cette stratégie en creation publicitaire (visuels, textes, vidéos).",
    exemples: [
      { marque: "Dove", description: "La copie stratégie de Dove est un cas d'ecole : promesse = 'la vraie beaute', preuve = utilisation de vraies femmes (pas de mannequins), bénéfice = se sentir belle telle qu'on est, ton = bienveillant et inclusif. La campagne 'Real Beauty' a transforme la marque et revolutionne la publicite cosmetique." },
      { marque: "Red Bull", description: "Red Bull : promesse = energie et dépassement de soi, preuve = sponsoring d'athletes extremes et événements spectaculaires (saut de Baumgartner depuis la stratosphere), bénéfice = se sentir energise et audacieux, ton = extreme, cool, jeune. Le slogan 'Red Bull donne des ailes' resume parfaitement la copie stratégie." }
    ],
    liensAutresConcepts: ["communication-commerciale", "medias-supports", "positionnement", "marque"],
    prerequis: ["communication-commerciale", "positionnement"],
    complementaires: ["medias-supports", "poem"],
    prolongements: ["community-management", "kpi-communication"],
    pistesDargumentation: [
      "Analyser la copie stratégie d'une marque celebre et montrer comment elle se traduit dans toutes les communications",
      "Montrer l'importance de la cohérence entre la promesse publicitaire et la realite du produit",
      "Discuter si la copie stratégie est toujours pertinente à l'ere des réseaux sociaux et du contenu éphémère",
      "Comparer l'USP (promesse unique) de 2 marques concurrentes (Coca vs Pepsi, Nike vs Adidas)"
    ],
    motsCles: {
      directs: ["copie strategie", "copy strategy", "promesse", "preuve", "benefice consommateur", "ton", "USP", "creation publicitaire"],
      indirects: ["agence", "annonceur", "brief", "creation", "message", "slogan", "baseline"],
      synonymes: ["copy strat", "brief creatif", "creative brief"],
      notionsProches: ["communication commerciale", "positionnement", "marque", "medias et supports"]
    }
  },
  {
    id: "medias-supports",
    titre: "Médias, supports et hors-média",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.1",
    questionLabel: "Les actions de communication sont-elles un levier efficace ?",
    sousTheme: "Communication",
    definition: "Un media est un canal de diffusion de masse (TV, radio, presse, affichage, cinema, Internet). Un support est un véhicule spécifique au sein d'un media (TF1, France Inter, Le Monde, JCDecaux, Instagram). Le hors-media regroupe les actions de communication qui n'utilisent pas les grands médias traditionnels : promotion des ventes, marketing direct, relations publiques, événementiel, parrainage.",
    explicationSimple: "Le media, c'est la route. Le support, c'est le véhicule. Si le media est 'la television', le support est 'TF1' ou 'M6'. Si le media est 'Internet', le support est 'Instagram' ou 'YouTube'. Le hors-media, c'est tout le reste : les promos en magasin, les emails, les salons professionnels, les événements. Aujourd'hui, le digital brouille les frontières entre media et hors-media.",
    mecanismeMarketing: "Le mediaplanning consiste à choisir la combinaison optimale de médias et supports pour atteindre la cible au meilleur coût. Les critères de choix sont : la couverture (nombre de personnes touchees), la repetition (nombre d'expositions), l'affinite (adequation avec la cible), le coût pour 1000 contacts (CPM) et le contexte de reception. Le hors-media permet un contact plus direct et personnalisé : le marketing direct (emailing, SMS) cible individuellement, la promotion des ventes déclenché l'achat immediat, les RP construisent la crédibilité.",
    exemples: [
      { marque: "L'Oreal", description: "L'Oreal est le plus gros annonceur mondial avec un budget media de plus de 10 milliards d'euros. La marque utilise tous les médias : TV pour la notoriété de masse, presse femme pour l'affinite, digital pour le ciblage et les tutoriels YouTube, Instagram pour les influenceurs. Le mix media evolue chaque annee vers plus de digital." },
      { marque: "Decathlon", description: "Decathlon privilegiait historiquement le hors-media (catalogues, événements sportifs locaux, parrainage de clubs). L'enseigne a bascule vers le digital avec des tutoriels YouTube, des campagnes Instagram et du marketing de contenu. Le bouche-a-oreille (avis clients) reste son media le plus puissant, sans aucun coût." }
    ],
    liensAutresConcepts: ["communication-commerciale", "copie-strategie", "poem", "kpi-communication"],
    prerequis: ["communication-commerciale"],
    complementaires: ["copie-strategie", "poem"],
    prolongements: ["promotion-ventes", "community-management", "kpi-communication"],
    pistesDargumentation: [
      "Comparer l'efficacité des médias traditionnels (TV, presse) vs les médias digitaux pour toucher les jeunes",
      "Analyser l'évolution du mediaplanning face à la fragmentation des audiences (multiplication des supports)",
      "Discuter si le hors-media est plus efficace que le media pour déclenchér l'achat",
      "Montrer comment le digital brouille la frontière entre media et hors-media"
    ],
    motsCles: {
      directs: ["media", "support", "hors media", "mediaplanning", "plan media", "TV", "radio", "presse", "affichage", "digital"],
      indirects: ["audience", "couverture", "CPM", "affinite", "repetition", "annonceur", "regie", "investissement"],
      synonymes: ["media planning", "media buying", "above the line", "below the line"],
      notionsProches: ["communication commerciale", "copie strategie", "POEM", "promotion des ventes"]
    }
  },
  {
    id: "poem",
    titre: "L'approche POEM",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.1",
    questionLabel: "Les actions de communication sont-elles un levier efficace ?",
    sousTheme: "Communication",
    definition: "POEM est un modèle qui classe les canaux de communication en 3 categories. Paid media : espaces publicitaires achetes (pub TV, Google Ads, posts sponsorises). Owned media : supports detenus par la marque (site web, appli, newsletter, réseaux sociaux propres). Earned media : visibilité gratuité gagnee grâce à la qualité du contenu (partages, avis, articles de presse, bouche-a-oreille).",
    explicationSimple: "Imagine 3 facons de faire parler de toi. Le Paid, c'est payer une pub (comme acheter un panneau publicitaire). Le Owned, c'est ton propre terrain (comme ton compte Instagram perso). Le Earned, c'est quand les autres parlent de toi naturellement parce que tu es interessant (comme quand un ami recommande un resto). Le Graal du marketing, c'est le Earned : la visibilité gratuité et crédible.",
    mecanismeMarketing: "Le Paid media offre une couverture rapide et controlee mais coûte cher et est perçu comme intrusif. Le Owned media est gratuit mais nécessite de créer du contenu régulièrement et sa portee est limitee aux abonnes. Le Earned media est le plus crédible (les consommateurs font davantage confiance aux avis qu'aux pubs) mais il est incontrolable et impredictible. Une stratégie efficace combine les 3 : le Paid génère de la visibilité, le Owned la capitalise, et le Earned la demultiplie. Le digital a considérablement elargi le Earned media via les réseaux sociaux.",
    exemples: [
      { marque: "GoPro", description: "GoPro illustre parfaitement le POEM. Paid : publicites YouTube et Instagram. Owned : site web, appli GoPro, chaîne YouTube officielle. Earned : des millions de vidéos tournees par les utilisateurs eux-mêmes, partagees sur les réseaux sociaux. Le Earned media de GoPro (contenu génère par les utilisateurs) est bien plus puissant que son Paid media." },
      { marque: "Tesla", description: "Tesla à un budget publicite de quasiment 0 euro (pas de Paid media traditionnel). Toute sa communication repose sur le Owned media (site web, compte Twitter d'Elon Musk) et le Earned media (buzz mediatique, fans qui evangelisent, couverture presse gratuité). C'est la preuve qu'un produit exceptionnel peut générer enormement de Earned media." }
    ],
    liensAutresConcepts: ["communication-commerciale", "medias-supports", "community-management", "buzz-viral"],
    prerequis: ["communication-commerciale", "medias-supports"],
    complementaires: ["community-management", "marketing-influence"],
    prolongements: ["buzz-viral", "e-reputation"],
    pistesDargumentation: [
      "Analyser la stratégie POEM d'une marque et montrer comment les 3 piliers s'articulent",
      "Montrer que le Earned media est le plus crédible mais le plus difficile à obtenir et a maîtriser",
      "Discuter si une entreprise peut se passer de Paid media grâce à un Earned media fort (cas Tesla)",
      "Comparer le rapport coût/efficacité des 3 types de media pour une marque"
    ],
    motsCles: {
      directs: ["POEM", "paid media", "owned media", "earned media", "paid owned earned", "media paye", "media possede", "media gagne"],
      indirects: ["publicite", "contenu", "avis", "bouche a oreille", "partage", "visibilite", "credibilite"],
      synonymes: ["paid owned earned model", "POE media", "triple media model"],
      notionsProches: ["communication commerciale", "community management", "buzz", "e-reputation"]
    }
  },
  {
    id: "promotion-ventes",
    titre: "La promotion des ventes",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.1",
    questionLabel: "Les actions de communication sont-elles un levier efficace ?",
    sousTheme: "Communication",
    definition: "La promotion des ventes regroupe les techniques visant à stimuler les ventes à court terme par un avantage temporaire offert au consommateur ou au distributeur. Les techniques consommateur incluent les reductions de prix, les bons de réduction, les ventes flash, les lots, les échantillons, les jeux-concours et les offres de remboursement. Les techniques distributeur incluent les remises, les primes et les PLV (publicite sur le lieu de vente).",
    explicationSimple: "C'est tout ce qui te pousse à acheter MAINTENANT au lieu d'attendre. Les soldes, le Black Friday, les codes promo '-20%', les '1 acheté = 1 offert', les ventes privees... La promo crée un sentiment d'urgence et de bonne affaire. C'est redoutablement efficace à court terme, mais attention : si tout est toujours en promo, le consommateur ne paie plus jamais le prix normal.",
    mecanismeMarketing: "La promotion agit sur 3 leviers psychologiques : l'urgence (offre limitee dans le temps), la rareté (stocks limites) et l'avantage perçu (économie realisee). Les promotions push (vers le distributeur) visent à obtenir plus de visibilité en rayon. Les promotions pull (vers le consommateur) visent a déclenchér l'achat. L'efficacité se mesure en taux d'écoulement et en CA incrementiel (ventes supplémentaires generees). Le risque principal est l'accoutumance : le consommateur attend les promos et ne paie plus jamais plein tarif (cercle vicieux promotionnel).",
    exemples: [
      { marque: "Amazon Prime Day", description: "Amazon Prime Day est devenu un événement promotionnel mondial : 48h de ventes flash exclusives aux membres Prime. En 2024, plus de 12 milliards de dollars de ventes. Le mécanisme combine urgence (durée limitee), exclusivite (reservee aux membres) et avantage perçu (reductions de 20 a 50%). C'est la promotion des ventes à l'échelle planetaire." },
      { marque: "Sephora", description: "Sephora maîtrise la promotion multi-canal : soldes en magasin, ventes privees pour les membres Gold, offres flash sur l'application, échantillons gratuits dans chaque commande, programme de points echangeables contre des mini-produits. Chaque technique de promotion est ciblee selon le profil et le niveau de fidélité du client." }
    ],
    liensAutresConcepts: ["communication-commerciale", "sensibilite-prix", "fidelisation", "medias-supports"],
    prerequis: ["communication-commerciale", "politiques-prix"],
    complementaires: ["sensibilite-prix", "fidelisation"],
    prolongements: ["kpi-communication"],
    pistesDargumentation: [
      "Analyser les mécanismes psychologiques de la promotion des ventes (urgence, rareté, ancrage de prix)",
      "Discuter si les promotions permanentes ne degradent pas la valeur perçue de la marque",
      "Comparer l'efficacité des differentes techniques promotionnelles (réduction, lot, échantillon, jeu-concours)",
      "Montrer les risques du cercle vicieux promotionnel pour les marques"
    ],
    motsCles: {
      directs: ["promotion des ventes", "promotion", "reduction", "bon de reduction", "vente flash", "echantillon", "jeu concours", "PLV", "soldes"],
      indirects: ["remise", "offre speciale", "bonne affaire", "urgence", "code promo", "pourcentage", "Black Friday"],
      synonymes: ["sales promotion", "promo", "promotional offer"],
      notionsProches: ["communication commerciale", "sensibilite prix", "fidelisation", "politique de prix"]
    }
  },

  /* ──────────── THÈME 3 — Q3.2 Relation client numérique ──────────── */
  {
    id: "fidelisation",
    titre: "Les stratégies de fidélisation",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.2",
    questionLabel: "Comment enrichir la relation client grâce au numérique ?",
    sousTheme: "Relation client",
    definition: "La fidélisation vise à inciter le client à réacheter et à rester fidèle à la marque dans la durée. On distingue la fidélisation induite (le client reste par contrainte : engagement, écosystème fermé, coût de transfert) et la fidélisation recherchée (le client reste par satisfaction : programmes de fidélité, avantages, qualité de service). La valeur vie client (LTV - LifeTime Value) mesure les revenus qu'un client génère sur toute la durée de sa relation avec l'entreprise.",
    explicationSimple: "Fideliser, c'est faire revenir le client encore et encore. Il y a deux facons : la contrainte (tu restes chez Apple parce que changer d'écosystème serait trop complique = fidélisation induite) ou le plaisir (tu restes chez Sephora pour les points de fidélité et les cadeaux = fidélisation recherchée). La regle d'or du marketing : fidéliser un client existant coûte 5 à 7 fois moins cher que d'en conquerir un nouveau.",
    mecanismeMarketing: "Les programmes de fidélité fonctionnent selon plusieurs mécanismes : accumulation de points echangeables, statuts par paliers (bronze, argent, or) avec avantages croissants, cashback, avantages exclusifs (ventes privees, acces anticipe). La fidélisation induite utilise les coûts de transfert (switching costs) : écosystème technologique (Apple), contrat d'engagement (opérateurs), habitude (réseau social). Le CRM permet de personnaliser les actions de fidélisation grace aux données clients. La LTV justifie l'investissement en fidélisation : un client fidèle qui génère 500 euros/an pendant 10 ans vaut 5000 euros.",
    exemples: [
      { marque: "Sephora", description: "Le programme Beauty Insider de Sephora est un modèle de fidélisation à paliers : Insider (gratuit), VIB (350 euros/an), Rouge (1000 euros/an). Chaque palier debloq des avantages croissants : remises exclusives, livraison gratuité, acces aux ventes privees, cadeaux d'anniversaire. Le programme fidelise 25 millions de membres qui generent 80% du CA." },
      { marque: "Apple", description: "Apple pratique la fidélisation induite par excellence : l'écosystème fermé (iPhone, Mac, iPad, Apple Watch, AirPods, iCloud) crée des coûts de transfert enorme. Changer pour Android impliquerait de perdre ses photos iCloud, ses applis payantes, la compatibilite entre appareils. Le taux de retention des utilisateurs iPhone dépasse 90%." }
    ],
    liensAutresConcepts: ["satisfaction-client", "crm", "valeur-percue", "promotion-ventes"],
    prerequis: ["satisfaction-client", "valeur-percue"],
    complementaires: ["crm", "promotion-ventes"],
    prolongements: ["parcours-client-digital", "community-management"],
    pistesDargumentation: [
      "Comparer fidélisation induite et fidélisation recherchée : laquelle est la plus durable et éthique ?",
      "Montrer que fidéliser un client coûte 5 à 7 fois moins cher que d'en acquerir un nouveau (chiffres et exemples)",
      "Analyser le concept de valeur vie client (LTV) et son impact sur les investissements marketing",
      "Discuter si les programmes de fidélité a points sont encore efficaces ou si le consommateur est lasse"
    ],
    motsCles: {
      directs: ["fidelisation", "fidelite", "programme de fidelite", "carte de fidelite", "valeur vie client", "life time value", "LTV", "retention", "fidelisation induite", "fidelisation recherchee"],
      indirects: ["client", "relation", "durable", "engagement", "reachat", "loyaute", "cout de transfert", "switching cost"],
      synonymes: ["loyalty", "customer retention", "loyalty program"],
      notionsProches: ["satisfaction", "CRM", "valeur percue", "promotion des ventes"]
    }
  },
  {
    id: "crm",
    titre: "La gestion de la relation client (CRM)",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.2",
    questionLabel: "Comment enrichir la relation client grâce au numérique ?",
    sousTheme: "Relation client",
    definition: "Le CRM (Customer Relationship Management) désigne l'ensemble des stratégies, outils et technologies utilises pour gérer et analyser les interactions avec les clients tout au long de leur cycle de vie. L'objectif est de centraliser les informations clients, personnaliser la relation et optimiser la satisfaction et la fidélité. Le CRM est à la fois une philosophie (orientation client) et un outil technologique (logiciel de base de données).",
    explicationSimple: "Le CRM, c'est le cerveau de la relation client. C'est un système qui se souvient de tout : ce que tu as acheté, quand, combien, ce que tu as demande au service client, tes preferences. Grace à ces données, l'entreprise peut t'envoyer la bonne offre au bon moment. Quand Amazon te dit 'les clients qui ont acheté ceci ont aussi acheté cela', c'est du CRM.",
    mecanismeMarketing: "Le CRM fonctionne en 4 étapes : collecte des données (achats, navigation, interactions service client, réseaux sociaux), stockage centralise (base de données unifiee), analyse (segmentation, scoring, predictions par IA) et action (campagnes personnalisées, offres ciblees, alertes). Les solutions CRM leaders (Salesforce, HubSpot, Microsoft Dynamics) permettent de gérer des millions de contacts et d'automatiser les campagnes marketing. Le CRM pose des enjeux de protection des données personnelles reglementes par le RGPD en Europe.",
    exemples: [
      { marque: "Salesforce", description: "Salesforce est le leader mondial du CRM avec plus de 150 000 entreprises clientes. La plateforme centralise les contacts, les opportunites commerciales, les interactions et permet d'automatiser les campagnes marketing. Son IA (Einstein) predit les comportements d'achat et recommande les meilleures actions commerciales. Salesforce illustre que le CRM est devenu un outil stratégique indispensable." },
      { marque: "Netflix", description: "Netflix utilise un CRM ultra-sophistique base sur l'IA : chaque interaction (film regarde, pause, rewind, abandon) alimente l'algorithme de recommandation. Le système personnalisé non seulement les recommandations, mais aussi les vignettes affichees (une même serie à des visuels différents selon ton profil). Ce CRM algorithmique réduit le churn de 30%." }
    ],
    liensAutresConcepts: ["fidelisation", "marketing-masse-differencie", "parcours-client-digital", "satisfaction-client"],
    prerequis: ["fidelisation", "segmentation"],
    complementaires: ["parcours-client-digital", "marketing-masse-differencie"],
    prolongements: ["kpi-communication", "community-management"],
    pistesDargumentation: [
      "Montrer comment le CRM permet la personnalisation à grande échelle de la relation client",
      "Analyser le rôle du big data et de l'IA dans l'évolution du CRM (CRM predictif, conversationnel)",
      "Discuter les enjeux RGPD lies à la collecte et l'utilisation des données personnelles par les CRM",
      "Comparer un CRM basique (tableur Excel) vs un CRM avance (Salesforce avec IA) et leur impact sur la relation client"
    ],
    motsCles: {
      directs: ["CRM", "gestion de la relation client", "customer relationship management", "base de donnees", "base clients", "GRC", "CRM predictif"],
      indirects: ["donnees", "personnalisation", "big data", "historique", "segmentation", "automatisation", "RGPD"],
      synonymes: ["GRC", "relation client", "customer management"],
      notionsProches: ["fidelisation", "big data", "RGPD", "marketing individualise", "satisfaction"]
    }
  },
  {
    id: "parcours-client-digital",
    titre: "Le parcours client digital",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.2",
    questionLabel: "Comment enrichir la relation client grâce au numérique ?",
    sousTheme: "Relation client",
    definition: "Le parcours client digital decrit les differentes étapes que traverse le consommateur en ligne, du besoin initial à l'apres-achat. Il comporte 5 phases : reconnaissance du besoin, recherche d'informations, evaluation des alternatives, décision d'achat et comportement post-achat. A chaque étape, des outils digitaux accompagnent et influencent le consommateur (moteurs de recherche, réseaux sociaux, comparateurs, chatbots, emails).",
    explicationSimple: "C'est tout le chemin que tu fais en ligne quand tu achetes quelque chose. Tu as besoin de nouveaux ecouteurs (besoin), tu cherches sur Google et YouTube (recherche), tu compares sur Amazon et tu lis les avis (evaluation), tu achetes (décision), et ensuite tu laisses un avis et tu recois des emails de recommandation (post-achat). A chaque étape, des outils digitaux sont la pour te guider.",
    mecanismeMarketing: "A chaque phase, l'entreprise utilise des leviers digitaux spécifiques. Phase besoin : publicite display, réseaux sociaux, SEA. Phase recherche : SEO, blog, tutoriels YouTube, avis en ligne. Phase evaluation : comparateurs, retargeting, chatbot, avis detailles. Phase achat : UX du site, facilite de paiement, promotions. Phase post-achat : email de suivi, demande d'avis, cross-selling, programme de fidélité. Le tunnel de conversion (funnel) permet de mesurer le taux de passage d'une étape à l'autre et d'identifier les points de friction. L'objectif est de réduire les abandons à chaque étape.",
    exemples: [
      { marque: "Airbnb", description: "Le parcours Airbnb est entièrement digital : inspiration sur Instagram (besoin), recherche sur l'appli avec filtres precis (recherche), comparaison des annonces et lecture des avis (evaluation), réservation instantanee avec paiement sécurisé (achat), puis avis reciproque hote-voyageur et recommendations personnalisées (post-achat). Chaque étape est optimisee pour réduire la friction." },
      { marque: "Zalando", description: "Zalando accompagne tout le parcours digital : publicites Instagram ciblees (besoin), moteur de recherche par style et IA de recommandation (recherche), zoom haute definition et avis detailles (evaluation), essayage gratuit a domicile et retour sous 100 jours (achat), puis campagnes emailing personnalisées et programme Zalando Plus (post-achat)." }
    ],
    liensAutresConcepts: ["ropo-omnicanal", "experience-consommation", "crm", "e-commerce"],
    prerequis: ["experience-consommation", "e-commerce"],
    complementaires: ["ropo-omnicanal", "crm"],
    prolongements: ["kpi-communication", "community-management"],
    pistesDargumentation: [
      "Decrire les 5 phases du parcours client digital avec un exemple concret d'achat",
      "Analyser les outils digitaux qui accompagnent le consommateur à chaque étape du parcours",
      "Montrer comment les entreprises utilisent le tracking et les cookies pour optimiser le parcours (et les enjeux RGPD)",
      "Discuter si le parcours client digital est linéaire ou s'il est devenu chaotique (messy middle de Google)"
    ],
    motsCles: {
      directs: ["parcours client", "parcours digital", "tunnel de conversion", "funnel", "parcours d'achat", "customer journey"],
      indirects: ["etapes", "recherche", "avis", "achat", "conversion", "retargeting", "chatbot", "tracking", "cookie"],
      synonymes: ["customer journey", "digital journey", "conversion funnel"],
      notionsProches: ["ROPO", "omnicanalite", "CRM", "e-commerce", "experience de consommation"]
    }
  },
  {
    id: "community-management",
    titre: "Le community management",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.2",
    questionLabel: "Comment enrichir la relation client grâce au numérique ?",
    sousTheme: "Relation client",
    definition: "Le community management consiste à gérer et animer la communauté d'une marque sur les réseaux sociaux et les espaces en ligne. Il englobe le brand content (creation de contenu de valeur au nom de la marque), le storytelling (raconter une histoire pour créer un lien émotionnel), le social selling (utiliser les réseaux sociaux pour vendre) et l'inbound marketing (attirer les clients par du contenu plutôt que par de la publicite intrusive).",
    explicationSimple: "Le community manager, c'est la voix de la marque sur les réseaux sociaux. Il poste du contenu, répond aux commentaires, crée du buzz et gere les crises. Quand Netflix France fait une blague sur Twitter qui fait 50 000 likes, c'est du community management réussi. L'objectif : créer une communauté engagee qui parle de la marque spontanement.",
    mecanismeMarketing: "Le brand content crée de la valeur pour l'audience (tutoriels, behind the scenes, humour) sans être directement promotionnel. Le storytelling construit un recit autour de la marque qui suscite l'identification et l'émotion. Le social selling utilise les réseaux pour générer des leads et des ventes (via Instagram Shopping, TikTok Shop). L'inbound marketing attire naturellement les prospects par du contenu SEO, des articles de blog, des newsletters. Le community manager mesure son impact en termes d'engagement (likes, commentaires, partages), de portee et de sentiment.",
    exemples: [
      { marque: "Netflix France", description: "Le community management de Netflix France est un cas d'ecole : ton humoristique et decale, références à la pop culture, interactions avec les abonnes, threads creatifs. Le compte Twitter génère des millions d'impressions gratuites (earned media) grâce à la viralité des posts. Le CM de Netflix est devenu une star a part entière." },
      { marque: "GoPro", description: "GoPro a bati sa stratégie de community management sur le User Generated Content (UGC) : la marque repartage les vidéos tournees par ses utilisateurs avec la hashtag #GoPro. Resultat : des millions de contenus gratuits, authentiques et inspirants qui sont plus credibles que n'importe quelle publicite. La communauté GoPro est à la fois cliente et ambassadrice." }
    ],
    liensAutresConcepts: ["e-reputation", "marketing-influence", "buzz-viral", "poem"],
    prerequis: ["communication-commerciale", "poem"],
    complementaires: ["marketing-influence", "e-reputation"],
    prolongements: ["buzz-viral", "kpi-communication"],
    pistesDargumentation: [
      "Analyser le rôle du community manager dans la construction de l'image de marque sur les réseaux sociaux",
      "Montrer comment le brand content crée de la valeur sans être directement promotionnel",
      "Discuter la frontière entre contenu et publicite deguisee : le community management est-il de la manipulation ?",
      "Comparer les stratégies de community management de 2 marques concurrentes (ex : Netflix vs Disney+)"
    ],
    motsCles: {
      directs: ["community management", "community manager", "brand content", "storytelling", "social selling", "inbound marketing", "UGC", "contenu de marque"],
      indirects: ["reseaux sociaux", "contenu", "engagement", "communaute", "followers", "likes", "partages", "hashtag"],
      synonymes: ["gestion de communaute", "social media management", "CM"],
      notionsProches: ["e-reputation", "marketing d'influence", "POEM", "buzz"]
    }
  },
  {
    id: "marketing-influence",
    titre: "Le marketing d'influence",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.2",
    questionLabel: "Comment enrichir la relation client grâce au numérique ?",
    sousTheme: "Relation client",
    definition: "Le marketing d'influence consiste à collaborer avec des personnalites influentes sur les réseaux sociaux (influenceurs) pour promouvoir un produit ou service aupres de leur communauté. On distingue les macro-influenceurs (+ de 100 000 abonnes, forte portee), les micro-influenceurs (10 000 à 100 000, fort engagement) et les nano-influenceurs (moins de 10 000, tres forte proximité). L'influenceur agit comme un prescripteur crédible car sa recommandation est perçue comme authentique.",
    explicationSimple: "Les marques paient des influenceurs pour recommander leurs produits parce que quand ton YouTubeur prefere dit 'ce produit est genial', tu y crois plus que si tu le vois dans une pub TV. L'influenceur, c'est le nouveau prescripteur. Mais attention, depuis 2023, la loi en France oblige a afficher clairement quand c'est un partenariat paye (#pub, #ad).",
    mecanismeMarketing: "La marque identifié des influenceurs dont l'audience correspond à sa cible, négocie un partenariat (produit offert, rémunération, code promo, affiliation) et co-crée du contenu (test produit, unboxing, tutoriel, placement). Les micro-influenceurs ont souvent un meilleur ROI car leur taux d'engagement est plus élevé (5-10% vs 1-3% pour les macro). La loi francaise du 9 juin 2023 encadre l'influence commerciale : obligation de mention 'publicite', interdiction de promouvoir certains produits (chirurgie esthetique, paris sportifs aux mineurs). Le marche mondial du marketing d'influence est estime à plus de 20 milliards de dollars.",
    exemples: [
      { marque: "Daniel Wellington", description: "Daniel Wellington est devenue une marque horlogere mondiale quasi exclusivement grace au marketing d'influence. La stratégie : envoyer des montres gratuites à des milliers de micro-influenceurs Instagram avec un code promo personnalisé. Zero pub TV, zero magasin physique, mais un CA de plus de 200 millions d'euros grace aux influenceurs." },
      { marque: "Maybelline x TikTok", description: "Maybelline a lance un mascara devenu viral grace aux influenceuses beaute TikTok. Un seul post de la macro-influenceuse Mikayla Nogueira a génère plus de 50 millions de vues. La stratégie combinait macro-influenceuses pour la portee et micro-influenceuses pour la crédibilité, creant un effet 'tout le monde en parle'." }
    ],
    liensAutresConcepts: ["community-management", "buzz-viral", "e-reputation", "poem"],
    prerequis: ["community-management", "poem"],
    complementaires: ["buzz-viral", "e-reputation"],
    prolongements: ["kpi-communication"],
    pistesDargumentation: [
      "Comparer l'efficacité du marketing d'influence vs la publicite traditionnelle pour toucher les jeunes",
      "Analyser les enjeux de transparence et d'éthique du marketing d'influence (loi du 9 juin 2023)",
      "Montrer pourquoi les micro-influenceurs ont souvent un meilleur ROI que les macro-influenceurs",
      "Discuter si le marketing d'influence est encore crédible quand les consommateurs savent que l'influenceur est paye"
    ],
    motsCles: {
      directs: ["marketing d'influence", "influenceur", "influence", "micro-influenceur", "macro-influenceur", "nano-influenceur", "prescripteur", "KOL"],
      indirects: ["Instagram", "TikTok", "YouTube", "recommandation", "partenariat", "sponsorisation", "placement", "authenticite"],
      synonymes: ["influence marketing", "influencer marketing", "marketing d'influenceurs"],
      notionsProches: ["community management", "earned media", "buzz", "e-reputation"]
    }
  },
  {
    id: "buzz-viral",
    titre: "Le buzz et le marketing viral",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.2",
    questionLabel: "Comment enrichir la relation client grâce au numérique ?",
    sousTheme: "Relation client",
    definition: "Le buzz désigne un phénomène de bouche-a-oreille amplifie, souvent déclenché par un événement spectaculaire ou surprenant. Le marketing viral vise à créer un contenu qui se propage 'comme un virus' de personne a personne sur les réseaux sociaux. Le bouche-a-oreille (word of mouth) reste la source d'information la plus fiable pour les consommateurs, mais il comporte un risque : le bad buzz, propagation negative et incontrolable.",
    explicationSimple: "Le buzz, c'est quand tout le monde parle de quelque chose en même temps. Ca peut être positif (la vidéo Old Spice qui fait 60 millions de vues) ou negatif (un bad buzz quand une marque fait une gaffe). Le marketing viral, c'est le reve de toute marque : créer un contenu tellement bon/drole/choquant que les gens le partagent spontanement. C'est de la pub gratuité, mais on ne peut pas forcer la viralité.",
    mecanismeMarketing: "Le contenu viral repose sur des déclenchéurs emotionnels : humour, surprise, indignation, inspiration, identification. Les mécanismes de propagation sont le partage social (réseaux sociaux), le forwarding (email, messagerie) et le bouche-a-oreille physique. Le buzz peut être planifie (campagne desisnee pour devenir virale) ou spontane (réaction imprevue du public). Le bad buzz se propage 7 fois plus vite qu'un buzz positif. La gestion de crise est essentielle : répondre vite, être transparent et ne pas tenter d'etouffer le bad buzz.",
    exemples: [
      { marque: "Old Spice", description: "La campagne 'The Man Your Man Could Smell Like' d'Old Spice est un cas d'ecole de marketing viral : une vidéo humoristique avec Isaiah Mustafa qui a cumule plus de 60 millions de vues sur YouTube. La marque a ensuite repondu en vidéo aux commentaires des internautes, creant un buzz viral interactif qui a booste les ventes de 107%." },
      { marque: "Balenciaga", description: "Balenciaga génère régulièrement du buzz (positif ou negatif) avec des produits volontairement provocants : sac poubelle a 1800 euros, baskets 'detruites' a 1250 euros. La stratégie est délibérée : chaque polemique génère des millions d'impressions gratuites et renforce le positionnement avant-gardiste de la marque. Mais le bad buzz de la campagne mettant en scene des enfants en 2022 a montre les limites de cette stratégie." }
    ],
    liensAutresConcepts: ["e-reputation", "community-management", "marketing-influence", "poem"],
    prerequis: ["community-management", "poem"],
    complementaires: ["marketing-influence", "e-reputation"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser les ingredients d'un buzz réussi et les mécanismes de la viralité en ligne",
      "Comparer buzz positif et bad buzz : comment une marque peut-elle se remettre d'un bad buzz ?",
      "Montrer que le bouche-a-oreille reste la source d'information la plus crédible pour les consommateurs",
      "Discuter si le buzz peut être planifie ou s'il est par nature impredictible"
    ],
    motsCles: {
      directs: ["buzz", "marketing viral", "bouche a oreille", "viral", "bad buzz", "viralite", "word of mouth", "WOM"],
      indirects: ["partage", "propagation", "reseaux sociaux", "video", "meme", "defi", "hashtag", "trending"],
      synonymes: ["word of mouth marketing", "viral marketing", "WOMM"],
      notionsProches: ["e-reputation", "community management", "earned media", "marketing d'influence"]
    }
  },
  {
    id: "e-reputation",
    titre: "L'e-réputation et la communication de crise",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.2",
    questionLabel: "Comment enrichir la relation client grâce au numérique ?",
    sousTheme: "Relation client",
    definition: "L'e-réputation désigne l'image d'une personne, d'une marque ou d'une organisation sur Internet, construite par l'ensemble des contenus publies en ligne (avis, articles, réseaux sociaux, forums). La communication de crise regroupe les stratégies mises en place pour gérer un bad buzz ou un événement negatif qui menace la réputation. Les ad-blockers temoignent de la défiance croissante des consommateurs envers la publicite en ligne.",
    explicationSimple: "Ton e-réputation, c'est ce que Google dit de toi quand on tape ton nom. Pour une marque, c'est pareil : les avis TripAdvisor, les commentaires Instagram, les articles de presse en ligne forment son image numérique. Un seul bad buzz peut detruire des annees de travail en quelques heures. C'est pourquoi les marques surveillent leur e-réputation 24h/24.",
    mecanismeMarketing: "La veille e-reputationnelle utilise des outils (Google Alerts, Mention, Brandwatch) pour surveiller ce qui se dit de la marque en temps réel. En situation normale, la marque encourage les avis positifs, répond aux avis negatifs et produit du contenu de qualité. En situation de crise, 3 stratégies s'offrent : reconnaitre et s'excuser (la plus efficace), denier (risque), ou faire diversion (temporaire). Le temps de réaction est crucial : les premieres 24h determinent souvent l'issue de la crise. L'utilisation croissante d'ad-blockers (plus de 40% des internautes) montre une défiance envers la publicite en ligne.",
    exemples: [
      { marque: "United Airlines", description: "En 2017, la vidéo d'un passager traine de force hors d'un avion United Airlines en surreservation est devenue virale en quelques heures. La première réaction de la compagnie (minimiser l'incident) a aggrave le bad buzz. L'action a perdu 1,4 milliard de dollars en bourse en 24h. C'est un cas d'ecole de crise d'e-réputation mal geree." },
      { marque: "Decathlon / hijab", description: "Quand Decathlon a annonce la vente d'un hijab de running en 2019, un bad buzz massif a eclate en France. L'enseigne a finalement retire le produit du marché francais. Ce cas illustre comment un choix commercial peut déclenchér une crise d'e-réputation qui dépasse le cadre marketing et entre dans le debat sociétal." }
    ],
    liensAutresConcepts: ["buzz-viral", "community-management", "satisfaction-client", "marque"],
    prerequis: ["community-management", "buzz-viral"],
    complementaires: ["satisfaction-client", "marque"],
    prolongements: ["kpi-communication"],
    pistesDargumentation: [
      "Montrer que l'e-réputation est un actif stratégique aussi important que la réputation physique",
      "Analyser une crise d'e-réputation et les stratégies de réponse utilisees (cas United Airlines, H&M, Balenciaga)",
      "Discuter l'impact des ad-blockers sur les stratégies de communication digitale des marques",
      "Comparer la gestion d'une crise d'e-réputation dans le secteur du luxe vs le secteur de la grande consommation"
    ],
    motsCles: {
      directs: ["e-reputation", "reputation en ligne", "communication de crise", "bad buzz", "ad-blocker", "avis en ligne", "veille"],
      indirects: ["image", "reputation", "internet", "crise", "veille", "Google", "TripAdvisor", "Trustpilot", "notation"],
      synonymes: ["online reputation", "digital reputation", "reputation numerique"],
      notionsProches: ["buzz", "community management", "RGPD", "satisfaction client", "marque"]
    }
  },
  {
    id: "kpi-communication",
    titre: "Les KPI de la communication numérique",
    theme: "theme3",
    themeLabel: "Communication de l'offre",
    question: "Q3.2",
    questionLabel: "Comment enrichir la relation client grâce au numérique ?",
    sousTheme: "Relation client",
    definition: "Les KPI (Key Performance Indicators) de la communication numérique sont des indicateurs mesurables qui permettent d'évaluer l'efficacité des actions marketing en ligne. Les principaux sont : le taux d'ouverture (emailing), le taux de clic (CTR), le taux de conversion, le coût par lead (CPL), le coût par acquisition (CPA), le ROI (retour sur investissement), l'engagement sur les réseaux sociaux (likes, partages, commentaires) et le nombre de followers.",
    explicationSimple: "Les KPI, ce sont les notes de ta communication. Tu as envoye un email ? Le taux d'ouverture te dit combien de personnes l'ont lu. Tu as fait une pub Instagram ? Le taux de clic te dit combien ont clique. Tu as un site e-commerce ? Le taux de conversion te dit combien de visiteurs ont acheté. Tout se mesure en digital, c'est la grande difference avec la pub TV ou l'affichage.",
    mecanismeMarketing: "Les KPI permettent d'optimiser les campagnes en temps réel (A/B testing, ajustement du budget, modification du ciblage). Le taux de conversion moyen en e-commerce est de 2-3% (sur 100 visiteurs, 2-3 achetent). Le CTR moyen d'un email marketing est de 2-5%. Le CPL varie enormement selon le secteur (5 euros en B2C, 50-200 euros en B2B). Le ROI = (gains - investissement) / investissement x 100. Google Analytics, les tableaux de bord des réseaux sociaux et les outils de marketing automation fournissent ces KPI en temps réel. L'enjeu est de choisir les bons KPI selon l'objectif (notoriété = impressions, engagement = interactions, conversion = ventes).",
    exemples: [
      { marque: "Google Analytics", description: "Google Analytics est l'outil de mesure de KPI le plus utilise au monde : il fournit en temps réel le nombre de visiteurs, leur provenance, les pages les plus vues, le taux de rebond, le taux de conversion et le parcours de navigation. Ces données permettent d'optimiser le site et les campagnes en continu." },
      { marque: "Spotify Wrapped", description: "Spotify Wrapped est un cas brillant ou les KPI deviennent un outil marketing. Chaque annee, Spotify transforme les données d'ecoute de ses utilisateurs en contenu partageable (ton artiste le plus ecoute, tes minutes d'ecoute, etc.). Les KPI internes deviennent du contenu viral qui génère des millions de partages gratuits sur les réseaux sociaux." }
    ],
    liensAutresConcepts: ["communication-commerciale", "community-management", "e-commerce", "crm"],
    prerequis: ["communication-commerciale", "e-commerce"],
    complementaires: ["community-management", "crm"],
    prolongements: [],
    pistesDargumentation: [
      "Montrer comment les KPI permettent d'optimiser les campagnes de communication en temps réel",
      "Comparer les KPI pertinents selon l'objectif de communication (notoriété vs engagement vs conversion)",
      "Discuter la fiabilite des KPI : un nombre élevé de likes signifie-t-il reellement un succes commercial ?",
      "Analyser les limites de la mesure : correlation vs causalite, vanity metrics, impact des ad-blockers sur la mesure"
    ],
    motsCles: {
      directs: ["KPI", "indicateur", "taux d'ouverture", "taux de conversion", "CPL", "CPA", "ROI", "CTR", "performance", "taux de clic"],
      indirects: ["mesure", "efficacite", "like", "follower", "clic", "engagement", "impression", "portee", "analytics"],
      synonymes: ["indicateurs cles de performance", "key performance indicators", "metriques"],
      notionsProches: ["communication numerique", "CRM", "e-commerce", "community management"]
    }
  }
];

/* ═══════════════════════════════════════════════════════════════
   MOTEUR D'ANALYSE
   ═══════════════════════════════════════════════════════════════ */
const SW = new Set("le la les un une des de du d l au aux ce ces cette mon ma mes ton ta tes son sa ses notre nos votre vos leur leurs je tu il elle nous vous ils elles on qui que qu quoi dont ou me te se en y et ou mais donc or ni car si ne pas plus moins tres trop aussi bien mal peu beaucoup tout toute tous toutes quel quelle quels quelles autre autres meme memes dans par pour avec sans sur sous entre vers chez est sont a ont fait etre avoir faire dire aller voir savoir pouvoir vouloir falloir devoir peut doit faut comment pourquoi quand est-ce c s n j t m".split(" "));
const norm = t => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/['']/g, " ").replace(/[-\u2013—]/g, " ").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
const tok = t => norm(t).split(" ").filter(w => w.length > 1 && !SW.has(w));
const bi = ts => { const b = []; for (let i = 0; i < ts.length - 1; i++) b.push(ts[i] + " " + ts[i + 1]); return b; };

function detectIntent(t) {
  const l = t.toLowerCase(), r = [];
  if (/pourquoi|raison|cause|expliqu/.test(l)) r.push({ type: "expliquer", label: "Expliquer / Justifier", icon: "💡" });
  if (/comment|de quelle mani|par quel|proc/.test(l)) r.push({ type: "mecanisme", label: "Décrire un mécanisme", icon: "⚙️" });
  if (/compar|diff[eé]ren|oppos|versus|vs/.test(l)) r.push({ type: "comparer", label: "Comparer", icon: "⚖️" });
  if (/exemple|illustr|cas|concr/.test(l)) r.push({ type: "illustrer", label: "Illustrer", icon: "📌" });
  if (/quel|impact|cons[eé]quence|effet|influence|r[oô]le/.test(l)) r.push({ type: "analyser", label: "Analyser", icon: "🔍" });
  if (/peut-on|faut-il|doit-on|est-il|est-ce/.test(l)) r.push({ type: "debattre", label: "Débattre", icon: "💬" });
  if (!r.length) r.push({ type: "general", label: "Explorer", icon: "🧭" });
  return r;
}

function sc(f, qt, qb) {
  let s = 0;
  const mc = f.motsCles;
  const ad = mc.directs.map(norm), ai = mc.indirects.map(norm), as = mc.synonymes.map(norm), ap = mc.notionsProches.map(norm);
  const nt = norm(f.titre), nd = norm(f.definition);
  for (const t of qt) {
    if (ad.some(k => k.includes(t) || t.includes(k))) s += 3;
    if (ai.some(k => k.includes(t) || t.includes(k))) s += 2;
    if (as.some(k => k.includes(t) || t.includes(k))) s += 1.5;
    if (ap.some(k => k.includes(t) || t.includes(k))) s += 1;
    if (nt.includes(t)) s += 2;
    if (nd.includes(t)) s += 0.5;
  }
  for (const b of qb) {
    if (ad.some(k => k.includes(b) || b.includes(k))) s += 4;
    if (ai.some(k => k.includes(b) || b.includes(k))) s += 2.5;
  }
  return s;
}

function search(q) {
  const ts = tok(q), bs = bi(ts), intents = detectIntent(q);
  let r = F.map(f => ({ ...f, score: sc(f, ts, bs) })).filter(f => f.score > 0).sort((a, b) => b.score - a.score);
  const mx = r[0]?.score || 1;
  r = r.map(x => ({ ...x, rel: Math.min(100, Math.round(x.score / mx * 100)) }));
  const p = r.slice(0, 5), pids = new Set(p.map(x => x.id)), rids = new Set();
  p.forEach(x => (x.liensAutresConcepts || []).forEach(id => { if (!pids.has(id)) rids.add(id); }));
  const sec = F.filter(f => rids.has(f.id) && !pids.has(f.id)).slice(0, 4);
  const pi = [];
  p.forEach(x => (x.pistesDargumentation || []).forEach(a => { if (!pi.includes(a)) pi.push(a); }));
  return { principaux: p, secondaires: sec, intents, pistes: pi.slice(0, 6), total: r.length };
}

/* ═══════════════════════════════════════════════════════════════
   LINKED-U DESIGN SYSTEM
   ═══════════════════════════════════════════════════════════════ */
const TC = {
  theme1: { label: "Définition de l'offre", color: "#6C5CE7", bg: "#EDE9FF", grad: "linear-gradient(135deg,#6C5CE7,#A29BFE)", icon: "📦" },
  theme2: { label: "Distribution de l'offre", color: "#00B894", bg: "#E0FFF5", grad: "linear-gradient(135deg,#00D2A0,#74B9FF)", icon: "🚚" },
  theme3: { label: "Communication de l'offre", color: "#E17055", bg: "#FFE8E8", grad: "linear-gradient(135deg,#FD79A8,#FDCB6E)", icon: "📢" },
};
const EX = [
  "Comment une marque peut-elle creer de la confiance ?",
  "Pourquoi les entreprises personnalisent-elles leur offre ?",
  "Quel est le role du packaging dans l'acte d'achat ?",
  "Comment le numerique transforme-t-il la distribution ?",
  "La gratuite est-elle un bon modele economique ?",
  "Comment fideliser ses clients grace aux reseaux sociaux ?",
  "Le yield management est-il juste pour le consommateur ?",
  "Pourquoi les avis en ligne influencent-ils nos achats ?"
];

/* ═══════════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════════ */
const G = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');*{margin:0;padding:0;box-sizing:border-box}:root{--bg:#FFFBF5;--sf:#fff;--bd:#F0E8DD;--ink:#1A1A2E;--ink2:#4A4A6A;--ink3:#8888A8;--el:#6C5CE7;--co:#FF6B6B;--li:#00D2A0;--su:#FDCB6E;--sk:#74B9FF;--pk:#FD79A8}body,input,button{font-family:'Outfit',system-ui,sans-serif}@keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}@keyframes dots{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}input:focus{outline:none}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#DDD;border-radius:3px}`;

/* ═══════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
function Bd({ theme }) {
  const c = TC[theme];
  return c ? <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: c.color, background: c.bg, padding: "4px 12px", borderRadius: 20 }}>{c.icon} {c.label}</span> : null;
}
function IT({ i }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--ink)", background: "#F0E8DD", padding: "5px 14px", borderRadius: 20 }}>{i.icon} {i.label}</span>;
}
function Bar({ v }) {
  const c = v > 70 ? "var(--li)" : v > 40 ? "var(--su)" : "var(--ink3)";
  return <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 50, height: 5, background: "#F0E8DD", borderRadius: 3, overflow: "hidden" }}><div style={{ width: `${v}%`, height: "100%", background: c, borderRadius: 3, transition: "width .5s ease" }} /></div><span style={{ fontSize: 11, color: "var(--ink3)", fontWeight: 700 }}>{v}%</span></div>;
}
function LoadDots() {
  return <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", animation: `dots 1s ease-in-out ${i * 0.16}s infinite` }} />)}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   CARD
   ═══════════════════════════════════════════════════════════════ */
function Card({ f, i, onClick, isFav, onToggleFav }) {
  const [h, setH] = useState(false);
  const c = TC[f.theme];
  const linkCount = (f.prerequis?.length || 0) + (f.complementaires?.length || 0) + (f.prolongements?.length || 0);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: "var(--sf)", borderRadius: 20, padding: "22px 24px", cursor: "pointer", border: `2px solid ${h ? c?.color || "var(--el)" : "var(--bd)"}`, boxShadow: h ? "0 12px 40px rgba(108,92,231,.15)" : "0 2px 8px rgba(108,92,231,.06)", transition: "all .25s ease", transform: h ? "translateY(-4px)" : "none", animation: `fu .4s ease ${i * 0.07}s both`, display: "flex", flexDirection: "column", gap: 10, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: c?.grad, borderRadius: "20px 20px 0 0", opacity: h ? 1 : 0.5, transition: "opacity .2s" }} />
      {onToggleFav && <button onClick={e => { e.stopPropagation(); onToggleFav(f.id); }} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", cursor: "pointer", fontSize: 18, color: isFav ? "#FDCB6E" : "var(--bd)", transition: "color .2s", zIndex: 2 }}>{isFav ? "\u2605" : "\u2606"}</button>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 4, paddingRight: onToggleFav ? 28 : 0 }}>
        <Bd theme={f.theme} />
        {f.rel !== undefined && <Bar v={f.rel} />}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>{f.titre}</h3>
      <p style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.55, flex: 1 }}>{f.explicationSimple.length > 150 ? f.explicationSimple.slice(0, 150) + "..." : f.explicationSimple}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, color: "var(--ink3)", fontWeight: 500 }}>{f.question} · {f.sousTheme}</div>
        {linkCount > 0 && <div style={{ fontSize: 11, color: "var(--el)", fontWeight: 600 }}>🔗 {linkCount} concepts liés</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DETAIL MODAL (with 3-level maillage)
   ═══════════════════════════════════════════════════════════════ */
function Det({ f, onClose, onOpenFiche, isFav, onToggleFav }) {
  if (!f) return null;
  const c = TC[f.theme];

  const renderLinks = (ids, color, label) => {
    if (!ids || ids.length === 0) return null;
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink3)", marginBottom: 6 }}>{label}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ids.map(id => {
            const lk = F.find(x => x.id === id);
            return lk ? <button key={id} onClick={() => onOpenFiche(lk)} style={{ fontSize: 12, color, background: color + "18", padding: "4px 12px", borderRadius: 20, fontWeight: 600, border: `1px solid ${color}40`, cursor: "pointer", transition: "all .15s" }} onMouseEnter={e => { e.target.style.background = color + "30"; }} onMouseLeave={e => { e.target.style.background = color + "18"; }}>{lk.titre}</button> : null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(26,26,46,.5)", backdropFilter: "blur(8px)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: "var(--sf)", borderRadius: 24, maxWidth: 640, width: "100%", maxHeight: "85vh", overflow: "auto", padding: 32, boxShadow: "0 25px 60px rgba(108,92,231,.2)", animation: "fu .3s ease" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 5, background: c?.grad, borderRadius: "24px 24px 0 0" }} />
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
          <button onClick={() => generatePDF([f])} title="Télécharger cette fiche en PDF" style={{ background: "#F0E8DD", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink3)" }}>📥</button>
          {onToggleFav && <button onClick={() => onToggleFav(f.id)} style={{ background: "#F0E8DD", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: isFav ? "#FDCB6E" : "var(--ink3)" }}>{isFav ? "\u2605" : "\u2606"}</button>}
          <button onClick={onClose} style={{ background: "#F0E8DD", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink2)", fontWeight: 700 }}>{"\u2715"}</button>
        </div>
        <div style={{ paddingTop: 8 }}><Bd theme={f.theme} /></div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", margin: "14px 0 4px" }}>{f.titre}</h2>
        <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 20 }}>{f.questionLabel} · {f.sousTheme}</div>

        <Sc t="📖 Définition" tx={f.definition} cl={c?.color} />
        <Sc t="💬 En simple" tx={f.explicationSimple} cl={c?.color} />
        <Sc t="⚙️ Mécanisme marketing" tx={f.mecanismeMarketing} cl={c?.color} />

        {f.exemples?.length > 0 && <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c?.color, marginBottom: 8 }}>📌 Exemples concrets</div>
          {f.exemples.map((e, i) => <div key={i} style={{ background: "var(--bg)", borderRadius: 14, padding: "14px 16px", marginBottom: 8, borderLeft: `4px solid ${c?.color}` }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "var(--ink)", marginBottom: 3 }}>{e.marque}</div>
            <div style={{ fontSize: 13, color: "var(--ink2)", lineHeight: 1.5 }}>{e.description}</div>
          </div>)}
        </div>}

        {f.pistesDargumentation?.length > 0 && <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c?.color, marginBottom: 8 }}>🎯 Pistes pour ton oral</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {f.pistesDargumentation.map((p, i) => <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--ink)", lineHeight: 1.5 }}><span style={{ color: c?.color, fontWeight: 800, flexShrink: 0 }}>{"\u2192"}</span>{p}</div>)}
          </div>
        </div>}

        {/* MAILLAGE 3 NIVEAUX */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c?.color, marginBottom: 10 }}>🔗 Maillage des concepts</div>
          {renderLinks(f.prerequis, "#FDCB6E", "Prérequis — à connaêtre avant")}
          {renderLinks(f.complementaires, "#6C5CE7", "Complémentaires — même niveau")}
          {renderLinks(f.prolongements, "#00D2A0", "Prolongements — pour aller plus loin")}
          {(!f.prerequis?.length && !f.complementaires?.length && !f.prolongements?.length) && <div style={{ fontSize: 13, color: "var(--ink3)" }}>Concept fondamental, pas de prérequis spécifiques.</div>}
        </div>
      </div>
    </div>
  );
}

function Sc({ t, tx, cl }) {
  return <div style={{ marginBottom: 18 }}><div style={{ fontSize: 14, fontWeight: 700, color: cl, marginBottom: 6 }}>{t}</div><p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.65 }}>{tx}</p></div>;
}

/* ═══════════════════════════════════════════════════════════════
   EXPLORER VIEW (Carte des concepts)
   ═══════════════════════════════════════════════════════════════ */
function Explorer({ onSelectFiche, isFav, onToggleFav }) {
  const [filter, setFilter] = useState("all");
  const themes = [
    { key: "all", label: "Tous", icon: "🎓" },
    { key: "theme1", label: "Thème 1", icon: "📦" },
    { key: "theme2", label: "Thème 2", icon: "🚚" },
    { key: "theme3", label: "Thème 3", icon: "📢" },
  ];
  const filtered = filter === "all" ? F : F.filter(f => f.theme === filter);
  const grouped = {};
  filtered.forEach(f => {
    const key = f.question + " " + f.questionLabel;
    if (!grouped[key]) grouped[key] = { question: f.question, label: f.questionLabel, theme: f.theme, fiches: [] };
    grouped[key].fiches.push(f);
  });

  return (
    <div style={{ animation: "fu .4s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", marginBottom: 8 }}>🗺️ Carte des concepts</div>
        <div style={{ fontSize: 14, color: "var(--ink2)" }}>{F.length} concepts organisés par thème et question</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        {themes.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} style={{ padding: "8px 18px", fontSize: 13, fontWeight: 600, borderRadius: 24, border: filter === t.key ? "2px solid var(--el)" : "2px solid var(--bd)", background: filter === t.key ? "var(--el)" : "var(--sf)", color: filter === t.key ? "#fff" : "var(--ink2)", cursor: "pointer", transition: "all .2s" }}>{t.icon} {t.label}</button>
        ))}
      </div>
      {Object.values(grouped).map((g, gi) => {
        const tc = TC[g.theme];
        return (
          <div key={gi} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 4, height: 28, borderRadius: 2, background: tc?.grad }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>{g.question}</div>
                <div style={{ fontSize: 13, color: "var(--ink2)" }}>{g.label}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
              {g.fiches.map(f => {
                const linkCount = (f.prerequis?.length || 0) + (f.complementaires?.length || 0) + (f.prolongements?.length || 0);
                return (
                  <button key={f.id} onClick={() => onSelectFiche(f)} style={{ padding: "14px 16px", background: "var(--sf)", border: `1.5px solid var(--bd)`, borderRadius: 14, cursor: "pointer", textAlign: "left", transition: "all .2s", display: "flex", flexDirection: "column", gap: 4 }} onMouseEnter={e => { e.currentTarget.style.borderColor = tc?.color; e.currentTarget.style.boxShadow = "0 4px 16px rgba(108,92,231,.12)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bd)"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>{f.titre}</div>
                    <div style={{ fontSize: 11, color: "var(--ink3)" }}>{f.sousTheme}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2 }}>
                      {linkCount > 0 && <span style={{ fontSize: 10, color: "var(--el)", fontWeight: 600 }}>🔗 {linkCount}</span>}
                      {isFav(f.id) && <span style={{ fontSize: 12, color: "#FDCB6E" }}>{"\u2605"}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FAVORIS VIEW
   ═══════════════════════════════════════════════════════════════ */
function generatePDF(fiches) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;
  const maxW = pageW - margin * 2;
  let y = margin;

  const addText = (text, size, style, color, lineH) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    if (color) doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxW);
    const h = lines.length * (lineH || size * 0.5);
    if (y + h > 280) { doc.addPage(); y = margin; }
    doc.text(lines, margin, y);
    y += h + 2;
  };

  fiches.forEach((f, idx) => {
    if (idx > 0) { doc.addPage(); y = margin; }
    addText(f.titre.toUpperCase(), 16, "bold", [108, 92, 231]);
    addText(`${f.themeLabel}  |  ${f.question}  |  ${f.sousTheme}`, 10, "normal", [136, 136, 168]);
    addText(f.questionLabel, 10, "italic", [136, 136, 168]);
    y += 4;
    y += 4;
    addText("DEFINITION", 10, "bold", [108, 92, 231]);
    addText(f.definition, 10, "normal", [74, 74, 106], 4);
    y += 2;
    addText("EN SIMPLE", 10, "bold", [108, 92, 231]);
    addText(f.explicationSimple, 10, "normal", [74, 74, 106], 4);
    y += 2;
    addText("MECANISME MARKETING", 10, "bold", [108, 92, 231]);
    addText(f.mecanismeMarketing, 10, "normal", [74, 74, 106], 4);
    y += 2;
    if (f.exemples?.length) {
      addText("EXEMPLES", 10, "bold", [108, 92, 231]);
      f.exemples.forEach(ex => {
        addText(`${ex.marque} : ${ex.description}`, 9, "normal", [74, 74, 106], 4);
      });
    }
    y += 2;
    if (f.pistesDargumentation?.length) {
      addText("PISTES POUR LE GRAND ORAL", 10, "bold", [108, 92, 231]);
      f.pistesDargumentation.forEach(p => {
        addText("-> " + p, 9, "normal", [74, 74, 106], 4);
      });
    }
  });

  const filename = fiches.length === 1
    ? `Fiche_${fiches[0].titre.replace(/[^a-zA-Z0-9\u00C0-\u024F ]/g, "").replace(/\s+/g, "_")}.pdf`
    : "Grand_Oral_Mercatique_Fiches.pdf";
  doc.save(filename);
}

function FavorisView({ favoris, onSelectFiche, onToggleFav, onClearAll }) {
  const fiches = favoris.map(id => F.find(f => f.id === id)).filter(Boolean);
  const [confirmClear, setConfirmClear] = useState(false);
  return (
    <div style={{ animation: "fu .4s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)" }}>{"\u2605"} Mes favoris ({fiches.length} fiche{fiches.length > 1 ? "s" : ""})</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {fiches.length > 0 && !confirmClear && <button onClick={() => setConfirmClear(true)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: 700, background: "var(--sf)", color: "var(--co)", border: "2px solid var(--co)", borderRadius: 14, cursor: "pointer", transition: "all .2s" }}>Tout supprimer</button>}
          {confirmClear && <div style={{ display: "flex", gap: 6, alignItems: "center", background: "#FFF0F0", padding: "8px 14px", borderRadius: 14, border: "2px solid var(--co)" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--co)" }}>Supprimer les {fiches.length} favoris ?</span>
            <button onClick={() => { onClearAll(); setConfirmClear(false); }} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, background: "var(--co)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer" }}>Oui, supprimer</button>
            <button onClick={() => setConfirmClear(false)} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 700, background: "var(--sf)", color: "var(--ink2)", border: "1px solid var(--bd)", borderRadius: 10, cursor: "pointer" }}>Annuler</button>
          </div>}
          {fiches.length > 0 && <button onClick={() => generatePDF(fiches)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: 700, background: "linear-gradient(135deg,#6C5CE7,#A29BFE)", color: "#fff", border: "none", borderRadius: 14, cursor: "pointer", transition: "all .2s" }}>📥 Télécharger en PDF</button>}
        </div>
      </div>
      {fiches.length === 0 ? (
        <div style={{ background: "var(--sf)", borderRadius: 20, padding: "48px 24px", textAlign: "center", border: "1px solid var(--bd)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{"\u2606"}</div>
          <div style={{ fontSize: 15, color: "var(--ink2)" }}>Aucun favori. Analyse une question et clique sur {"\u2606"} pour sauvegarder des concepts !</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
          {fiches.map((f, i) => (
            <Card key={f.id} f={f} i={i} onClick={() => onSelectFiche(f)} isFav={true} onToggleFav={onToggleFav} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QR CODE MODAL
   ═══════════════════════════════════════════════════════════════ */
function QRModal({ onClose }) {
  const [qrUrl, setQrUrl] = useState("");
  useEffect(() => {
    QRCode.toDataURL(APP_URL, { width: 300, margin: 2, color: { dark: "#1A1A2E", light: "#FFFFFF" } }).then(setQrUrl);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,.97)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", textAlign: "center", padding: 48, animation: "fu .3s ease" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 0, right: 0, background: "#F0E8DD", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink2)" }}>{"\u2715"}</button>
        <div style={{ fontSize: 28, fontWeight: 900, color: "var(--ink)", marginBottom: 8 }}>🎓 Grand Oral <span style={{ color: "var(--el)" }}>Mercatique</span></div>
        <div style={{ fontSize: 14, color: "var(--ink2)", marginBottom: 24 }}>Scanne avec ton telephone pour acceder a l'app</div>
        {qrUrl && <img src={qrUrl} alt="QR Code" style={{ width: 280, height: 280, borderRadius: 16, boxShadow: "0 8px 32px rgba(108,92,231,.15)", marginBottom: 20 }} />}
        <div style={{ fontSize: 14, color: "var(--ink3)", fontWeight: 600, wordBreak: "break-all" }}>{APP_URL}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INFO MODAL
   ═══════════════════════════════════════════════════════════════ */
function InfoModal({ onClose }) {
  const sH = { fontSize: 16, fontWeight: 700, color: "var(--ink)", marginTop: 20, marginBottom: 6 };
  const sP = { fontSize: 14, color: "var(--ink2)", lineHeight: 1.65 };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(26,26,46,.5)", backdropFilter: "blur(8px)" }} />
      <div onClick={e => e.stopPropagation()} style={{ position: "relative", background: "var(--sf)", borderRadius: 24, maxWidth: 560, width: "100%", maxHeight: "85vh", overflow: "auto", padding: "36px 36px 32px", boxShadow: "0 25px 60px rgba(108,92,231,.2)", animation: "fu .3s ease" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "#F0E8DD", border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink2)", fontWeight: 700 }}>{"\u2715"}</button>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>INFORMATIONS</h2>

        <div style={sH}>{"É"}diteur</div>
        <p style={sP}>
          Rachid Seddar (M. SEDDAR)
        </p>

        <div style={sH}>H{"é"}bergement</div>
        <p style={sP}>Netlify - serveur CDN mondial.</p>

        <div style={sH}>Donn{"é"}es personnelles & confidentialit{"é"}</div>
        <p style={sP}>
          Cet outil ne collecte, ne transmet et ne traite <strong>aucune donn{"é"}e personnelle</strong>.
          Toutes les informations (historique de recherche, favoris, fiches consult{"é"}es) sont
          enregistr{"é"}es <strong>uniquement en local</strong> dans votre navigateur via <code style={{ background: "#F0E8DD", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>localStorage</code> et ne quittent jamais votre appareil.
        </p>
        <p style={{ ...sP, marginTop: 8 }}>
          Aucun cookie de tra{"ç"}age, aucune analytics, aucun serveur ne re{"ç"}oit vos donn{"é"}es.
        </p>

        <div style={sH}>Utilisation</div>
        <p style={sP}>
          Outil gratuit, libre d'utilisation dans le cadre {"é"}ducatif. Aucune inscription requise.
        </p>

        <div style={sH}>Contenu p{"é"}dagogique</div>
        <p style={sP}>
          Les 42 fiches concepts sont bas{"é"}es sur le programme officiel du Bulletin Officiel (BO) de Mercatique STMG
          et le manuel Delagrave (16 chapitres de synth{"è"}se). Le contenu est destin{"é"} {"à"} la pr{"é"}paration du Grand Oral.
        </p>

        <div style={sH}>Licence</div>
        <p style={sP}>
          Ce site est publi{"é"} sous licence <strong>Creative Commons BY-NC-SA 4.0</strong> : vous
          pouvez le partager librement en citant l'auteur, sans usage commercial, et
          en conservant la m{"ême"} licence pour toute version modifi{"é"}e.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["CC", "BY", "NC", "SA"].map(t => (
              <span key={t} style={{ width: 28, height: 28, borderRadius: "50%", background: t === "CC" ? "#888" : "#E17055", color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{t}</span>
            ))}
          </div>
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "var(--el)", fontWeight: 600 }}>CC BY-NC-SA 4.0</a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState(null);
  const [sel, setSel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [view, setView] = useState("home"); // home | explorer | favoris
  const [showQR, setShowQR] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [hist, setHist] = useState(() => { try { return JSON.parse(window.localStorage?.getItem?.("go-h") || "[]"); } catch { return []; } });
  const [favoris, setFavoris] = useState(() => { try { return JSON.parse(window.localStorage?.getItem?.("go-favoris") || "[]"); } catch { return []; } });
  const [viewed, setViewed] = useState(() => { try { return JSON.parse(window.localStorage?.getItem?.("go-viewed") || "[]"); } catch { return []; } });
  const iR = useRef(null), rR = useRef(null);

  const toggleFav = useCallback(id => {
    setFavoris(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { window.localStorage?.setItem?.("go-favoris", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);
  const isFav = useCallback(id => favoris.includes(id), [favoris]);
  const clearAllFavoris = useCallback(() => {
    setFavoris([]);
    try { window.localStorage?.setItem?.("go-favoris", "[]"); } catch {}
  }, []);

  const trackView = useCallback(id => {
    setViewed(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try { window.localStorage?.setItem?.("go-viewed", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const go = useCallback(qr => {
    const s = qr || q;
    if (!s.trim()) return;
    setBusy(true);
    setView("home");
    setTimeout(() => {
      const r = search(s);
      setRes(r);
      setBusy(false);
      const nh = [s, ...hist.filter(h => h !== s)].slice(0, 10);
      setHist(nh);
      try { window.localStorage?.setItem?.("go-h", JSON.stringify(nh)); } catch {}
      setTimeout(() => rR.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 300);
  }, [q, hist]);

  const tap = qr => { setQ(qr); go(qr); };

  const openFiche = f => {
    trackView(f.id);
    setSel(f);
  };

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = e => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setView("home");
        setRes(null);
        setTimeout(() => iR.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const copyQ = () => {
    navigator.clipboard?.writeText?.(q);
  };

  // Theme counter for results
  const themeCount = res ? (() => {
    const counts = { theme1: 0, theme2: 0, theme3: 0 };
    [...res.principaux, ...res.secondaires].forEach(f => { if (counts[f.theme] !== undefined) counts[f.theme]++; });
    return counts;
  })() : null;

  const showHome = view === "home";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      <style>{G}</style>

      {/* BLOBS */}
      <div style={{ position: "fixed", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(108,92,231,.12),transparent 70%)", pointerEvents: "none", animation: "fl 8s ease infinite" }} />
      <div style={{ position: "fixed", bottom: -100, left: -80, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(253,121,168,.1),transparent 70%)", pointerEvents: "none", animation: "fl 10s ease infinite 2s" }} />
      <div style={{ position: "fixed", top: "40%", left: "60%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(253,203,110,.08),transparent 70%)", pointerEvents: "none", animation: "fl 12s ease infinite 4s" }} />

      {/* HEADER */}
      <header style={{ background: "rgba(255,251,245,.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--bd)", padding: "14px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => { setView("home"); setRes(null); setQ(""); }}>
            <div style={{ width: 38, height: 38, background: "linear-gradient(135deg,#6C5CE7,#FD79A8)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#fff", fontWeight: 800 }}>GO</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "var(--ink)" }}>Grand Oral <span style={{ color: "var(--el)" }}>Mercatique</span></div>
              <div style={{ fontSize: 11, color: "var(--ink3)" }}>Terminale STMG · {F.length} concepts</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { setView(view === "explorer" ? "home" : "explorer"); setRes(null); }} style={{ fontSize: 12, color: view === "explorer" ? "#fff" : "var(--ink3)", background: view === "explorer" ? "var(--el)" : "var(--sf)", padding: "6px 14px", borderRadius: 20, border: "1px solid var(--bd)", fontWeight: 600, cursor: "pointer", transition: "all .2s" }}>🗺️ Explorer</button>
            <button onClick={() => { setView(view === "favoris" ? "home" : "favoris"); setRes(null); }} style={{ fontSize: 12, color: view === "favoris" ? "#fff" : "var(--ink3)", background: view === "favoris" ? "var(--el)" : "var(--sf)", padding: "6px 14px", borderRadius: 20, border: "1px solid var(--bd)", fontWeight: 600, cursor: "pointer", transition: "all .2s", position: "relative" }}>
              {"\u2605"} Favoris{favoris.length > 0 && <span style={{ background: "#FF6B6B", color: "#fff", fontSize: 10, fontWeight: 800, borderRadius: 10, padding: "1px 6px", marginLeft: 4 }}>{favoris.length}</span>}
            </button>
            <button onClick={() => setShowQR(true)} style={{ fontSize: 12, color: "var(--ink3)", background: "var(--sf)", padding: "6px 14px", borderRadius: 20, border: "1px solid var(--bd)", fontWeight: 600, cursor: "pointer" }}>📱 QR</button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 24px 32px", position: "relative", zIndex: 1 }}>

        {/* EXPLORER VIEW */}
        {view === "explorer" && <Explorer onSelectFiche={openFiche} isFav={isFav} onToggleFav={toggleFav} />}

        {/* FAVORIS VIEW */}
        {view === "favoris" && <FavorisView favoris={favoris} onSelectFiche={openFiche} onToggleFav={toggleFav} onClearAll={clearAllFavoris} />}

        {/* HOME VIEW */}
        {showHome && <>
          {!res && <div style={{ textAlign: "center", marginBottom: 40, animation: "fu .5s ease" }}>
            <div style={{ display: "inline-block", background: "linear-gradient(135deg,#6C5CE7,#FD79A8,#FDCB6E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 12 }}>Prépare ton épreuve</div>
            <h1 style={{ fontSize: 34, fontWeight: 900, color: "var(--ink)", lineHeight: 1.15, marginBottom: 10 }}>Entre ta question,<br />découvre les <span style={{ color: "var(--el)" }}>concepts clés</span></h1>
            <p style={{ fontSize: 16, color: "var(--ink2)", maxWidth: 500, margin: "0 auto" }}>Analyse intelligente des notions, mécanismes et exemples du programme de Mercatique</p>
          </div>}

          <div style={{ display: "flex", gap: 10, marginBottom: res ? 10 : 28, animation: "fu .4s ease .1s both" }}>
            <div style={{ flex: 1 }}>
              <input ref={iR} type="text" value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && go()} placeholder="Entre ta question ici..." style={{ width: "100%", padding: "15px 22px", fontSize: 15, border: "2px solid var(--bd)", borderRadius: 16, background: "var(--sf)", color: "var(--ink)", fontWeight: 500, transition: "border-color .2s" }} onFocus={e => e.target.style.borderColor = "var(--el)"} onBlur={e => e.target.style.borderColor = "var(--bd)"} />
            </div>
            <button onClick={() => go()} disabled={!q.trim() || busy} style={{ padding: "15px 30px", background: q.trim() ? "linear-gradient(135deg,#6C5CE7,#A29BFE)" : "#DDD", color: "#fff", border: "none", borderRadius: 16, fontWeight: 700, fontSize: 14, cursor: q.trim() ? "pointer" : "default", transition: "all .2s", whiteSpace: "nowrap", opacity: busy ? 0.7 : 1, minWidth: 120 }}>
              {busy ? <LoadDots /> : "Analyser 🔍"}
            </button>
          </div>

          {!res && <div style={{ animation: "fu .4s ease .2s both" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink3)", marginBottom: 10 }}>💡 Essaie par exemple :</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {EX.map((x, i) => <button key={i} onClick={() => tap(x)} style={{ padding: "9px 16px", fontSize: 13, background: "var(--sf)", color: "var(--ink2)", border: "1.5px solid var(--bd)", borderRadius: 24, cursor: "pointer", fontWeight: 500, transition: "all .15s" }} onMouseEnter={e => { e.target.style.borderColor = "var(--el)"; e.target.style.color = "var(--el)"; e.target.style.background = "#EDE9FF"; }} onMouseLeave={e => { e.target.style.borderColor = "var(--bd)"; e.target.style.color = "var(--ink2)"; e.target.style.background = "var(--sf)"; }}>{x}</button>)}
            </div>
          </div>}

          {!res && hist.length > 0 && <div style={{ marginTop: 24, animation: "fu .4s ease .3s both" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink3)", marginBottom: 8 }}>🕐 Historique</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {hist.slice(0, 5).map((x, i) => <button key={i} onClick={() => tap(x)} style={{ padding: "6px 14px", fontSize: 12, background: "var(--bg)", color: "var(--ink3)", border: "1px solid var(--bd)", borderRadius: 20, cursor: "pointer", fontWeight: 500 }}>{x.length > 45 ? x.slice(0, 45) + "\u2026" : x}</button>)}
            </div>
          </div>}
        </>}
      </div>

      {/* RESULTS */}
      {showHome && res && <div ref={rR} style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "var(--sf)", borderRadius: 20, padding: "22px 26px", border: "1px solid var(--bd)", marginBottom: 24, animation: "fu .3s ease", boxShadow: "0 2px 8px rgba(108,92,231,.06)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink3)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>Ta question</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--ink)", flex: 1 }}>{"\u00AB"} {q} {"\u00BB"}</div>
            <button onClick={copyQ} title="Copier la question" style={{ background: "#F0E8DD", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink3)", flexShrink: 0 }}>📋</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--ink3)" }}>Intention :</span>
            {res.intents.map((x, i) => <IT key={i} i={x} />)}
            <span style={{ fontSize: 12, color: "var(--ink3)", marginLeft: 8 }}>· {res.total} concept{res.total > 1 ? "s" : ""}</span>
          </div>
          {/* Theme counter */}
          {themeCount && <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "var(--ink3)" }}>
            {themeCount.theme1 > 0 && <span>📦 {themeCount.theme1} Thème 1</span>}
            {themeCount.theme2 > 0 && <span>🚚 {themeCount.theme2} Thème 2</span>}
            {themeCount.theme3 > 0 && <span>📢 {themeCount.theme3} Thème 3</span>}
          </div>}
        </div>

        {res.principaux.length > 0 ? <>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 26, height: 26, background: "linear-gradient(135deg,#6C5CE7,#FD79A8)", color: "#fff", borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>{"\u2605"}</span>
            Concepts principaux
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14, marginBottom: 28 }}>
            {res.principaux.map((f, i) => <Card key={f.id} f={f} i={i} onClick={() => openFiche(f)} isFav={isFav(f.id)} onToggleFav={toggleFav} />)}
          </div>
        </> : <div style={{ background: "var(--sf)", borderRadius: 20, padding: "48px 24px", textAlign: "center", border: "1px solid var(--bd)", marginBottom: 24 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🤔</div>
          <div style={{ fontSize: 15, color: "var(--ink2)" }}>Aucun concept trouvé. Reformule avec des termes du programme Mercatique.</div>
        </div>}

        {res.secondaires.length > 0 && <>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink3)", marginBottom: 12 }}>🔗 A explorer aussi</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {res.secondaires.map(f => <button key={f.id} onClick={() => openFiche(f)} style={{ padding: "9px 18px", fontSize: 13, background: "var(--sf)", color: "var(--ink2)", border: "1.5px solid var(--bd)", borderRadius: 24, cursor: "pointer", fontWeight: 600, transition: "all .15s" }} onMouseEnter={e => { e.target.style.borderColor = "var(--el)"; e.target.style.color = "var(--el)"; }} onMouseLeave={e => { e.target.style.borderColor = "var(--bd)"; e.target.style.color = "var(--ink2)"; }}>{f.titre}</button>)}
          </div>
        </>}

        {res.pistes.length > 0 && <div style={{ background: "linear-gradient(135deg,#EDE9FF,#FFE8F0)", borderRadius: 20, padding: "26px 30px", border: "1px solid #DDD5F3", animation: "fu .4s ease .3s both", marginBottom: 28 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "var(--el)", marginBottom: 14 }}>🎯 Pistes pour ton Grand Oral</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {res.pistes.map((p, i) => <div key={i} style={{ display: "flex", gap: 10 }}><span style={{ color: "var(--co)", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{"\u2192"}</span><span style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.55 }}>{p}</span></div>)}
          </div>
        </div>}

        <div style={{ background: "var(--sf)", borderRadius: 20, padding: "22px 26px", border: "1px solid var(--bd)", boxShadow: "0 2px 8px rgba(108,92,231,.06)" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink3)", marginBottom: 12 }}>📝 Criteres d'evaluation du Grand Oral (/20)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8 }}>
            {[{ l: "Qualite orale", c: "var(--el)" }, { l: "Prise de parole", c: "var(--co)" }, { l: "Connaissances", c: "var(--li)" }, { l: "Interaction", c: "var(--su)" }, { l: "Argumentation", c: "var(--pk)" }].map((x, i) => <div key={i} style={{ textAlign: "center", padding: "12px 8px", background: "var(--bg)", borderRadius: 14, borderTop: `3px solid ${x.c}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>{x.l}</div>
              <div style={{ fontSize: 11, color: "var(--ink3)", fontWeight: 600 }}>4 pts</div>
            </div>)}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button onClick={() => { setRes(null); setQ(""); setTimeout(() => iR.current?.focus(), 100); }} style={{ padding: "12px 28px", fontSize: 14, background: "var(--sf)", color: "var(--el)", border: "2px solid var(--el)", borderRadius: 14, cursor: "pointer", fontWeight: 700, transition: "all .2s" }} onMouseEnter={e => { e.target.style.background = "var(--el)"; e.target.style.color = "#fff"; }} onMouseLeave={e => { e.target.style.background = "var(--sf)"; e.target.style.color = "var(--el)"; }}>{"\u2190"} Nouvelle question</button>
        </div>
      </div>}

      {/* MODALS */}
      {sel && <Det f={sel} onClose={() => setSel(null)} onOpenFiche={openFiche} isFav={isFav(sel.id)} onToggleFav={toggleFav} />}
      {showQR && <QRModal onClose={() => setShowQR(false)} />}
      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {/* FOOTER */}
      <footer style={{ textAlign: "center", padding: "24px", fontSize: 12, color: "var(--ink3)", borderTop: "1px solid var(--bd)", position: "relative", zIndex: 1 }}>
        <div>Grand Oral Mercatique — Terminale STMG · {F.length} concepts · Programme officiel BO
        {viewed.length > 0 && <span style={{ marginLeft: 12, color: "var(--el)", fontWeight: 600 }}>· {viewed.length} fiche{viewed.length > 1 ? "s" : ""} consultée{viewed.length > 1 ? "s" : ""}</span>}</div>
        <button onClick={() => setShowInfo(true)} style={{ background: "none", border: "none", color: "var(--ink3)", fontSize: 11, cursor: "pointer", marginTop: 6, textDecoration: "underline", opacity: 0.7 }}>Mentions légales & informations</button>
      </footer>
    </div>
  );
}
