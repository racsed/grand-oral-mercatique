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
    definition: "La segmentation consiste a decouper le marche en sous-ensembles de consommateurs (segments) presentant des comportements d'achat ou des besoins homogenes, afin d'adapter l'action commerciale a chaque groupe. Elle repose sur des criteres sociodemographiques, geographiques, psychographiques ou comportementaux. C'est la premiere etape de la demarche SCP (Segmenter-Cibler-Positionner).",
    explicationSimple: "Imagine une classe de 30 eleves : certains adorent le sport, d'autres la musique, d'autres les jeux video. Si tu veux vendre des places de concert, tu ne t'adresses pas a tout le monde de la meme facon. La segmentation, c'est regrouper ceux qui se ressemblent pour mieux leur parler et leur proposer ce qu'ils veulent vraiment.",
    mecanismeMarketing: "L'entreprise collecte des donnees sur ses clients (age, revenus, habitudes d'achat, centres d'interet) via des enquetes, le CRM ou les donnees numeriques. Elle analyse ensuite ces donnees pour identifier des groupes homogenes. Chaque segment doit etre mesurable, accessible, rentable et distinct des autres. Une fois les segments identifies, l'entreprise adapte son mix marketing (produit, prix, communication, distribution) a chaque cible retenue.",
    exemples: [
      { marque: "Nespresso", description: "Nespresso segmente son marche en plusieurs niveaux : capsules Original pour les puristes de l'expresso, gamme Vertuo pour les amateurs de grandes tasses, et Nespresso Professional pour les entreprises et hotels. Chaque segment a son propre catalogue, ses prix et sa communication dediee." },
      { marque: "Netflix", description: "Netflix segmente par comportement de visionnage grace a ses algorithmes. Le service identifie des micro-segments (amateurs de thrillers coreens, fans de documentaires nature, etc.) et cree des contenus originaux cibles pour chaque groupe, maximisant ainsi l'engagement et reduisant le churn." },
      { marque: "Decathlon", description: "Decathlon segmente par niveau de pratique sportive : debutant, regulier, expert. Sa marque Quechua propose des tentes a 20 euros pour les debutants et des modeles techniques a 400 euros pour les alpinistes, avec des rayons dedies en magasin." }
    ],
    liensAutresConcepts: ["ciblage", "positionnement", "couple-produit-marche", "marketing-masse-differencie"],
    prerequis: [],
    complementaires: ["ciblage", "positionnement"],
    prolongements: ["couple-produit-marche", "marketing-masse-differencie", "crm"],
    pistesDargumentation: [
      "Montrer que la segmentation est indispensable face a la diversite croissante des attentes des consommateurs",
      "Comparer une entreprise qui segmente (Nike) vs une qui pratique le marketing de masse (Bic) et analyser les resultats",
      "Discuter des limites de la segmentation : sur-segmentation, couts eleves, risque de discrimination",
      "Analyser comment le numerique et le big data ont transforme les pratiques de segmentation"
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
    definition: "Le ciblage est l'action de choisir un ou plusieurs segments de marche sur lesquels l'entreprise va concentrer ses efforts commerciaux et marketing. C'est la deuxieme etape de la demarche SCP. Il existe trois strategies principales : indifferenciee (tout le marche), differenciee (plusieurs segments) et concentree (un seul segment).",
    explicationSimple: "Apres avoir identifie les differents groupes de clients, l'entreprise doit choisir lesquels elle veut servir. C'est comme au restaurant : le chef ne peut pas cuisiner tous les plats du monde, il choisit sa specialite et ses clients ideaux. Le ciblage, c'est dire 'voila les clients que je veux toucher en priorite'.",
    mecanismeMarketing: "L'entreprise evalue chaque segment selon sa taille, sa croissance, sa rentabilite potentielle et la concurrence presente. Elle compare ensuite ces criteres avec ses propres forces et ressources. La strategie choisie (indifferenciee, differenciee ou concentree) determine l'allocation du budget marketing et la conception de l'offre. Le ciblage conditionne toutes les decisions du mix marketing.",
    exemples: [
      { marque: "Apple", description: "Apple cible les consommateurs a fort pouvoir d'achat, sensibles au design et a l'innovation technologique (strategie concentree haut de gamme). Toute sa communication, ses prix premium et ses boutiques epurees renforcent ce positionnement aupres de cette cible precise." },
      { marque: "Lidl", description: "Lidl cible les consommateurs sensibles au prix avec une strategie de hard discount, mais elargit progressivement sa cible en montant en gamme (gamme Deluxe, vins recompenses). C'est un exemple d'evolution du ciblage dans le temps." },
      { marque: "Shein", description: "Shein cible les 16-25 ans, ultra-connectes, qui veulent renouveler leur garde-robe frequemment a petit prix. L'entreprise utilise les donnees TikTok et Instagram pour affiner en permanence son ciblage comportemental." }
    ],
    liensAutresConcepts: ["segmentation", "positionnement", "marketing-masse-differencie", "couple-produit-marche"],
    prerequis: ["segmentation"],
    complementaires: ["positionnement", "couple-produit-marche"],
    prolongements: ["marketing-masse-differencie", "composantes-offre"],
    pistesDargumentation: [
      "Expliquer pourquoi une entreprise ne peut pas cibler tout le monde : ressources limitees et efficacite",
      "Montrer le lien entre ciblage et allocation des ressources marketing a travers un exemple concret",
      "Comparer les 3 strategies de ciblage (indifferenciee, differenciee, concentree) avec des exemples",
      "Analyser comment le ciblage numerique (cookies, algorithmes) transforme la relation marque-consommateur"
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
    definition: "Le positionnement correspond a la place qu'un produit ou une marque occupe dans l'esprit des consommateurs, par rapport a ses concurrents. Il se definit par des attributs distinctifs (qualite, prix, innovation, ethique) et se visualise grace a une carte perceptuelle (mapping). Le positionnement voulu par l'entreprise peut differer du positionnement percu par le consommateur.",
    explicationSimple: "C'est l'image mentale que tu as d'une marque. Quand on dit Tesla, tu penses 'voiture electrique innovante'. Quand on dit IKEA, tu penses 'meubles accessibles et design'. Chaque marque essaie d'occuper une case unique dans ta tete pour que tu la choisisses plutot qu'une autre.",
    mecanismeMarketing: "L'entreprise choisit 2 ou 3 attributs distinctifs (le triangle d'or du positionnement : attentes clients, atouts du produit, positionnement des concurrents). Elle les traduit dans tout son mix marketing : le produit, le prix, la communication et la distribution doivent etre coherents. Le mapping positionnel permet de visualiser la place de chaque marque sur 2 axes (ex : prix/qualite). Un bon positionnement est credible, attractif, durable et differenciant.",
    exemples: [
      { marque: "Tesla", description: "Tesla s'est positionnee comme la marque automobile de l'innovation electrique premium. Son positionnement repose sur 3 piliers : technologie de pointe (autopilot), design futuriste et engagement ecologique. Ce positionnement clair lui permet de justifier des prix eleves sans etre comparee aux constructeurs traditionnels." },
      { marque: "Decathlon", description: "Decathlon se positionne sur le sport accessible a tous, avec un excellent rapport qualite-prix. Sa signature 'A fond la forme' et ses marques propres (Quechua, Domyos, Kipsta) incarnent ce positionnement. Sur un mapping prix/qualite, Decathlon occupe une position unique entre le bas de gamme et les marques techniques premium." },
      { marque: "Action", description: "Action se positionne comme le magasin des petits prix surprenants avec un assortiment non alimentaire en rotation constante. Son positionnement prix/surprise attire une clientele large qui vient 'faire des decouvertes', ce qui le differencie des discounters classiques." }
    ],
    liensAutresConcepts: ["segmentation", "ciblage", "marque", "composantes-offre"],
    prerequis: ["segmentation", "ciblage"],
    complementaires: ["marque", "composantes-offre"],
    prolongements: ["packaging-design", "politiques-prix"],
    pistesDargumentation: [
      "Montrer qu'un positionnement clair est indispensable pour se differencier dans un marche concurrentiel",
      "Analyser les risques d'un repositionnement a travers l'exemple d'une marque (ex : Burberry qui est passee de marque des hooligans a marque de luxe)",
      "Comparer positionnement voulu par l'entreprise et positionnement percu par le consommateur",
      "Discuter si un positionnement peut durer dans le temps face aux evolutions du marche"
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
    definition: "Le couple produit/marche designe l'association entre un produit (ou service) et le segment de marche auquel il est specifiquement destine. Cette notion implique que le produit est concu en fonction des besoins identifies sur un marche cible, et non l'inverse. C'est le fondement de la demarche marketing orientee client.",
    explicationSimple: "Plutot que de fabriquer un produit et chercher ensuite a qui le vendre, l'entreprise part des besoins d'un groupe de clients pour creer le produit ideal. C'est comme un cuisinier qui demande d'abord a ses clients ce qu'ils veulent manger avant de preparer le menu. Le bon couple produit/marche, c'est le bon produit pour les bonnes personnes.",
    mecanismeMarketing: "L'entreprise identifie un besoin non satisfait ou mal satisfait sur un segment de marche. Elle conçoit ensuite une offre adaptee (produit + services associes) a ce segment. La matrice d'Ansoff permet de structurer les choix strategiques : penetration de marche, developpement de produit, developpement de marche ou diversification. Le couple produit/marche est valide par des etudes de marche et des tests avant le lancement.",
    exemples: [
      { marque: "Dacia Spring", description: "Dacia a identifie un marche : les conducteurs urbains a petit budget qui veulent passer a l'electrique mais ne peuvent pas investir 30 000 euros. La Spring, voiture electrique la moins chere du marche europeen, repond parfaitement a ce couple produit/marche." },
      { marque: "Spotify", description: "Spotify a identifie que les jeunes voulaient acceder a la musique partout, sans la posseder, pour un cout modique. Le couple produit/marche est parfait : streaming illimite avec pub (gratuit) ou premium a prix etudiant. Le produit est ne du marche, pas l'inverse." }
    ],
    liensAutresConcepts: ["segmentation", "ciblage", "positionnement", "offre-globale"],
    prerequis: ["segmentation", "ciblage"],
    complementaires: ["positionnement", "offre-globale"],
    prolongements: ["composantes-offre", "b2b-b2c"],
    pistesDargumentation: [
      "Montrer la logique inversee du marketing : partir du marche pour creer le produit plutot que l'inverse",
      "Analyser les risques d'une inadequation produit/marche a travers un echec commercial (Google Glass, Juicero)",
      "Discuter si le product market fit est un facteur cle de succes pour les startups",
      "Comparer la demarche couple produit/marche avec une approche produit-centree"
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
    definition: "Les strategies marketing evoluent du marketing de masse (un produit unique pour tous) au marketing individualise (one-to-one), en passant par le marketing differencie (offres adaptees a plusieurs segments) et le marketing concentre (un seul segment vise). Cette evolution est acceleree par le numerique et le big data qui permettent une personnalisation a grande echelle.",
    explicationSimple: "Autrefois, la meme pub passait a la tele pour tout le monde et on vendait un produit identique a tous. Aujourd'hui, Netflix te recommande DES films, Spotify te cree TA playlist et Nike te laisse designer TES baskets. On est passe du 'un pour tous' au 'un pour chacun' grace a la technologie.",
    mecanismeMarketing: "Le marketing de masse permet des economies d'echelle mais ignore les differences entre clients. Le marketing differencie adapte l'offre a plusieurs segments (cout plus eleve mais meilleure satisfaction). Le marketing concentre se focalise sur un creneau (niche). Le marketing individualise utilise les donnees clients (CRM, cookies, IA) pour personnaliser l'offre, le prix et la communication en temps reel. La tendance actuelle est a l'hyper-personnalisation grâce aux algorithmes.",
    exemples: [
      { marque: "Coca-Cola", description: "Coca-Cola illustre l'evolution : marketing de masse historique (une seule boisson pour le monde entier), puis differencie avec le lancement de Zero, Light, Cherry, Vanilla, et meme individualise avec la campagne 'Partagez un Coca avec [prenom]' qui personnalisait les bouteilles." },
      { marque: "Nike By You", description: "Nike By You permet au client de personnaliser entierement ses baskets : couleurs, materiaux, texte grave. C'est du marketing individualise pur, rendu possible par l'outil de configuration en ligne et une production flexible. Le prix est plus eleve mais la satisfaction client maximale." },
      { marque: "Amazon", description: "Amazon pratique l'hyper-personnalisation algorithmique : chaque page d'accueil est unique, les recommandations sont basees sur l'historique de navigation et d'achat, les prix peuvent varier selon le profil. C'est le marketing individualise a l'echelle industrielle." }
    ],
    liensAutresConcepts: ["segmentation", "ciblage", "positionnement", "crm"],
    prerequis: ["segmentation", "ciblage"],
    complementaires: ["couple-produit-marche", "composantes-offre"],
    prolongements: ["crm", "parcours-client-digital"],
    pistesDargumentation: [
      "Analyser l'evolution historique de la personnalisation du marketing de masse au one-to-one",
      "Montrer comment le numerique et le big data rendent possible le passage au marketing individualise",
      "Discuter des limites : cout de la personnalisation, respect de la vie privee (RGPD), effet 'bulle de filtre'",
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
    definition: "L'offre est constituee de composantes materielles (le produit physique, son conditionnement, ses caracteristiques techniques) et de composantes immaterielles (la marque, le design, l'image, la qualite percue, les services associes). L'ensemble forme la valeur globale de l'offre percue par le consommateur.",
    explicationSimple: "Un produit, ce n'est pas juste l'objet que tu achetes. Quand tu achetes des AirPods, tu achetes des ecouteurs (materiel), mais aussi la marque Apple, le design epure, le statut social, le service apres-vente (immateriel). Souvent, c'est l'immateriel qui fait la difference entre deux produits similaires.",
    mecanismeMarketing: "L'entreprise conçoit son offre en combinant les dimensions materielles et immaterielles de facon coherente avec son positionnement. Les composantes materielles satisfont les besoins fonctionnels (utilite, qualite, durabilite). Les composantes immaterielles repondent aux besoins psychologiques et sociaux (appartenance, estime, plaisir). La coherence entre toutes ces composantes est essentielle : un packaging luxueux sur un produit bas de gamme creerait de la dissonance.",
    exemples: [
      { marque: "Veja", description: "Chez Veja, la valeur vient autant du design epure (materiel) que de l'engagement ecoresponsable, de la transparence sur la chaine de production et du storytelling de la marque (immateriel). Les baskets coutent plus cher que chez Nike, mais les composantes immaterielles justifient ce premium aux yeux des consommateurs engages." },
      { marque: "Dyson", description: "Dyson combine des composantes materielles superieures (moteur cyclonique brevetee, materiaux premium) avec des composantes immaterielles fortes (image d'innovation, design futuriste, marque synonyme de technologie). Un aspirateur Dyson a 500 euros se justifie par la coherence de l'ensemble." }
    ],
    liensAutresConcepts: ["packaging-design", "marque", "valeur-percue", "positionnement"],
    prerequis: ["positionnement"],
    complementaires: ["packaging-design", "marque"],
    prolongements: ["offre-globale", "valeur-percue"],
    pistesDargumentation: [
      "Montrer que l'immateriel peut valoir plus que le materiel dans la perception du consommateur",
      "Analyser la coherence necessaire entre toutes les composantes de l'offre a travers un exemple",
      "Discuter si un produit peut reussir avec des composantes materielles faibles mais un immateriel fort (et inversement)",
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
    definition: "Le packaging (conditionnement et emballage) remplit des fonctions techniques (protection, conservation, transport) et des fonctions commerciales (attirer le regard, informer, seduire, vehiculer l'image de marque). La stylique (design) donne au produit son identite visuelle unique et participe a la differenciation.",
    explicationSimple: "Le packaging, c'est le 'vendeur muet' du produit : en rayon, il n'y a personne pour te convaincre, c'est l'emballage qui fait le travail. Il doit a la fois proteger le produit et te donner envie de l'acheter en moins de 3 secondes. Pense aux pots Bonne Maman avec leur couvercle Vichy : tu les reconnais instantanement.",
    mecanismeMarketing: "Le packaging agit a 3 niveaux : l'emballage primaire (au contact du produit), l'emballage secondaire (la boite) et l'emballage tertiaire (le carton de transport). Le design combine forme, couleurs, typographie et materiaux pour creer une identite visuelle distinctive. Le packaging doit etre coherent avec le positionnement et evoluer avec les tendances (eco-conception, minimalisme, QR codes). En GMS, le packaging a 0,3 seconde pour capter l'attention du consommateur.",
    exemples: [
      { marque: "Bonne Maman", description: "Le pot avec couvercle vichy rouge et blanc et l'etiquette qui imite l'ecriture manuscrite creent un univers 'fait maison' authentique. Ce packaging iconique n'a quasiment pas change depuis 1971 et fait partie de l'identite de la marque. Il justifie un prix superieur aux MDD." },
      { marque: "Apple", description: "Le packaging Apple est un element central de l'experience client : boite blanche minimaliste, ouverture lente calculee pour creer un moment de suspense, rangement parfait de chaque accessoire. Le unboxing est devenu un genre video a part entiere sur YouTube, preuve que le packaging fait partie de la valeur percue." },
      { marque: "Innocent", description: "Innocent utilise un packaging decale (bouteilles avec des bonnets tricotes en hiver, textes humoristiques) qui cree un lien emotionnel avec le consommateur et vehicule les valeurs de la marque : authenticite, humour et engagement social." }
    ],
    liensAutresConcepts: ["composantes-offre", "marque", "valeur-percue"],
    prerequis: ["composantes-offre"],
    complementaires: ["marque", "positionnement"],
    prolongements: ["valeur-percue", "experience-consommation"],
    pistesDargumentation: [
      "Montrer que le packaging est un veritable outil de differenciation et de vente silencieuse",
      "Analyser l'evolution du packaging face aux exigences environnementales (eco-conception, vrac, consigne)",
      "Discuter le role du unboxing et du packaging dans l'experience client a l'ere du e-commerce",
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
    definition: "La marque est un signe distinctif (nom, logo, symbole, son) qui identifie et differencie les produits ou services d'une entreprise de ceux de ses concurrents. Elle possede une dimension patrimoniale : c'est un actif immateriel de l'entreprise dont la valeur financiere peut etre considerable. Il existe differentes politiques de marque : marque ombrelle, marque produit et marque caution.",
    explicationSimple: "La marque, c'est ce qui fait qu'entre deux t-shirts identiques, tu es pret a payer 3 fois plus cher celui qui porte le logo Nike. C'est un capital de confiance construit dans le temps. Quand tu vois la pomme croquee d'Apple, tu penses immediatement 'qualite, innovation, design'. C'est ca la puissance d'une marque.",
    mecanismeMarketing: "L'entreprise choisit une politique de marque selon sa strategie. La marque ombrelle couvre tous les produits sous un meme nom (Samsung). La marque produit donne un nom unique a chaque produit (Procter & Gamble : Ariel, Pampers, Gillette). La marque caution apporte sa garantie a des marques filles (Danone cautionne Activia, Actimel). La marque cree de la confiance, facilite la fidelisation et peut justifier un prix premium. Son capital (brand equity) se mesure en notoriete, image et fidelite.",
    exemples: [
      { marque: "Danone", description: "Danone utilise une strategie de marque caution : la marque mere Danone apporte sa credibilite a des marques filles comme Activia, Evian, Alpro. Chaque marque fille a son propre positionnement mais beneficie de la confiance associee a Danone." },
      { marque: "Louis Vuitton", description: "Chez LVMH, la marque est le principal vecteur de valeur. Un sac Louis Vuitton coute des milliers d'euros alors que le cout de fabrication est bien moindre. La difference, c'est la valeur de la marque : heritage, exclusivite, savoir-faire. La marque LV vaut plus de 50 milliards de dollars." },
      { marque: "MDD (Marques De Distributeur)", description: "Les MDD (Marque Repere chez Leclerc, Reflets de France chez Carrefour) montrent que la marque distributeur peut concurrencer les grandes marques nationales en proposant un rapport qualite-prix attractif, jouant sur la confiance envers l'enseigne." }
    ],
    liensAutresConcepts: ["positionnement", "composantes-offre", "fidelisation", "e-reputation"],
    prerequis: ["positionnement", "composantes-offre"],
    complementaires: ["packaging-design", "valeur-percue"],
    prolongements: ["fidelisation", "e-reputation", "communication-commerciale"],
    pistesDargumentation: [
      "Montrer que la marque est un actif immateriel majeur dont la valeur peut depasser celle des actifs physiques",
      "Analyser la dimension patrimoniale de la marque : comment se construit et se protege un capital marque",
      "Comparer les strategies de marque ombrelle, marque produit et marque caution avec leurs avantages et risques",
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
    definition: "L'offre globale combine le produit principal et les services ou produits associes (garantie, livraison, SAV, accessoires). La gamme designe l'ensemble des produits proposes par une entreprise, caracterisee par sa largeur (nombre de lignes), sa profondeur (variantes par ligne) et sa longueur (nombre total de references).",
    explicationSimple: "Quand tu achetes un iPhone, tu n'achetes pas juste un telephone : tu accedes a iCloud, a l'Apple Store, au SAV Genius Bar, a la garantie, aux coques et chargeurs. C'est l'offre globale. Et la gamme, c'est toute la palette : iPhone 15, 15 Pro, 15 Pro Max, SE... avec differentes capacites de stockage.",
    mecanismeMarketing: "L'offre globale ajoute de la valeur percue en proposant des services complementaires (livraison, installation, formation, garantie etendue). La gestion de gamme est un equilibre delicat : une gamme longue couvre plus de besoins mais coute plus cher a gerer. Le produit d'appel attire les clients, le produit leader genere le plus de CA, et le produit de prestige valorise l'image. Les entreprises rationalisent regulierement leur gamme pour eliminer les references peu rentables.",
    exemples: [
      { marque: "Free", description: "Free propose une offre globale integree : box internet + TV + telephone fixe + mobile + cloud. L'abonnement unique combine plusieurs services, creant une valeur percue superieure a la somme de chaque element. La gamme reste volontairement courte (2-3 forfaits) pour la lisibilite." },
      { marque: "L'Oreal", description: "L'Oreal possede une gamme extremement large (maquillage, soins, capillaire, parfums) et profonde (des dizaines de references par ligne). La strategie couvre tous les segments de prix : L'Oreal Paris (grande diffusion), Lancome (premium), Giorgio Armani Beauty (luxe)." }
    ],
    liensAutresConcepts: ["composantes-offre", "couple-produit-marche", "marque", "b2b-b2c"],
    prerequis: ["composantes-offre", "positionnement"],
    complementaires: ["marque", "couple-produit-marche"],
    prolongements: ["politiques-prix", "canaux-distribution"],
    pistesDargumentation: [
      "Analyser l'interet strategique de l'offre globale pour creer de la valeur et fideliser",
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
    definition: "Le B2B (Business to Business) designe les echanges commerciaux entre entreprises. Le B2C (Business to Consumer) designe les echanges entre une entreprise et le consommateur final. Ces deux marches different fondamentalement dans le processus de decision, le volume des transactions, le cycle d'achat et la relation commerciale.",
    explicationSimple: "Quand tu achetes un sandwich chez Subway, c'est du B2C : l'entreprise te vend a toi, le consommateur. Mais quand Subway achete son pain a un fournisseur industriel, c'est du B2B : une entreprise vend a une autre entreprise. Les regles du jeu sont completement differentes entre les deux.",
    mecanismeMarketing: "En B2B, la decision d'achat est collective (centre d'achat : prescripteur, decideur, acheteur, utilisateur), rationnelle (cahier des charges, appels d'offres) et le cycle est long. En B2C, la decision est souvent individuelle, plus emotionnelle et le cycle est court. Le B2B met l'accent sur la relation commerciale durable, le B2C sur l'experience client et la communication de masse. Certaines entreprises operent sur les deux marches simultanement (ex : Samsung vend des telephones aux particuliers et des composants aux constructeurs).",
    exemples: [
      { marque: "Salesforce", description: "Salesforce est un exemple pur de B2B : l'entreprise vend des logiciels CRM exclusivement a d'autres entreprises. Le cycle de vente est long (demonstrations, periodes d'essai, negociations), la decision implique plusieurs interlocuteurs (DSI, direction commerciale, direction generale) et les contrats se chiffrent en milliers d'euros annuels." },
      { marque: "Amazon", description: "Amazon illustre parfaitement le double marche : Amazon.fr est B2C (vente aux particuliers), tandis qu'Amazon Business est B2B (vente aux entreprises avec factures, commandes groupees, tarifs degressifs). Amazon Web Services (AWS) est aussi du B2B pur, fournissant de l'infrastructure cloud aux entreprises." }
    ],
    liensAutresConcepts: ["segmentation", "canaux-distribution", "communication-commerciale"],
    prerequis: ["segmentation"],
    complementaires: ["offre-globale", "canaux-distribution"],
    prolongements: ["communication-commerciale", "politiques-distribution"],
    pistesDargumentation: [
      "Comparer les processus de decision d'achat en B2B et en B2C a travers des exemples concrets",
      "Analyser comment une meme entreprise peut operer avec succes sur les deux marches",
      "Montrer que le marketing B2B est en train de se rapprocher du B2C avec la digitalisation",
      "Discuter si l'emotion a sa place dans le marketing B2B ou si seule la rationalite compte"
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
    definition: "L'experience de consommation designe l'ensemble des interactions et emotions vecues par le consommateur avant, pendant et apres l'achat d'un produit ou service. Elle comporte trois phases : l'anticipation (recherche, excitation avant l'achat), l'achat lui-meme (experience en magasin ou en ligne) et le souvenir (satisfaction, recommandation). Cette experience est subjective et chargee d'emotions.",
    explicationSimple: "Acheter, ce n'est pas juste echanger de l'argent contre un produit. C'est vivre quelque chose. Pense au Black Friday : l'excitation de chercher les bonnes affaires (anticipation), le plaisir de trouver LA promo (achat), et la fierte de raconter tes trouvailles a tes amis (souvenir). Chaque achat, meme banal, cree une mini-experience.",
    mecanismeMarketing: "Les entreprises cherchent a optimiser chaque phase de l'experience. L'anticipation est stimulee par le teasing, les pre-commandes et les listes d'attente (Apple cree des files d'attente pour ses lancements). L'experience d'achat est amelioree par l'ambiance, le parcours client et le service. Le souvenir est entretenu par le suivi post-achat, les programmes de fidelite et les incitations au partage sur les reseaux sociaux. L'objectif est de transformer chaque interaction en moment memorable et positif.",
    exemples: [
      { marque: "IKEA", description: "IKEA a concu tout son parcours magasin comme une experience : le chemin fleche invite a decouvrir des mises en situation de pieces completes, le restaurant suedois est une pause gourmande, l'espace enfants Smaland libere les parents. Meme les hot-dogs a 1 euro en sortie prolongent l'experience positive." },
      { marque: "Disney", description: "Disney est le maitre de l'experience de consommation. Avant la visite, les videos et le site web creent l'anticipation. Pendant la visite, chaque detail est pense (musique, odeurs, cast members souriants). Apres, les photos, souvenirs et la magie du retour a la maison prolongent le souvenir. Disney appelle cela 'la magie'." },
      { marque: "Vinted", description: "Vinted transforme l'achat de vetements d'occasion en experience ludique : le plaisir de la chasse aux bonnes affaires (anticipation), la negociation avec le vendeur (interaction), la decouverte du colis (unboxing). L'experience est aussi sociale : tu peux suivre des vendeurs et partager tes trouvailles." }
    ],
    liensAutresConcepts: ["marketing-experientiel", "valeur-percue", "satisfaction-client", "parcours-client-digital"],
    prerequis: [],
    complementaires: ["marketing-experientiel", "valeur-percue"],
    prolongements: ["satisfaction-client", "fidelisation"],
    pistesDargumentation: [
      "Montrer que l'experience de consommation est devenue un facteur cle de differenciation a l'ere du tout-produit-similaire",
      "Analyser les 3 phases de l'experience avec un exemple concret (avant, pendant, apres)",
      "Comparer l'experience d'un achat banal (courses au supermarche) vs un achat impliquant (voyage, smartphone)",
      "Discuter si la recherche d'experience permanente ne mene pas a une forme de surconsommation"
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
    definition: "Le marketing experientiel vise a plonger le consommateur dans l'univers de la marque en sollicitant ses sens et ses emotions. Il repose sur la theatralisation du point de vente, le marketing sensoriel (stimulation des 5 sens), le marketing immersif (realite virtuelle, pop-up stores) et la creation d'un lien emotionnel fort entre le consommateur et la marque.",
    explicationSimple: "Le marketing experientiel, c'est transformer un achat banal en moment memorable. Au lieu de juste vendre du parfum, Lush te fait plonger les mains dans des bains de couleurs, sentir des bombes de bain et tester des produits frais. Tu ne viens pas acheter, tu viens VIVRE quelque chose. C'est ca le reenchantement de la consommation.",
    mecanismeMarketing: "La theatralisation transforme le point de vente en lieu de spectacle (decor, eclairages, mise en scene). Le marketing sensoriel active les 5 sens : la vue (couleurs, design), l'ouie (musique d'ambiance), l'odorat (diffusion de parfums), le toucher (materiaux, textures) et le gout (degustations). Le marketing immersif utilise la technologie (VR, AR, ecrans interactifs) pour creer des experiences uniques. L'objectif est de generer des emotions positives qui s'associent durablement a la marque dans la memoire du consommateur.",
    exemples: [
      { marque: "Lush", description: "Lush est l'exemple type du marketing sensoriel total : les produits sont presentes comme sur un marche de fruits et legumes, les vendeurs font des demonstrations en direct, l'odeur est identifiable a des metres du magasin. Chaque visite est une experience multisensorielle qui cree un lien emotionnel fort avec la marque." },
      { marque: "Starbucks", description: "Starbucks ne vend pas du cafe, il vend un 'troisieme lieu' entre la maison et le bureau. Musique soigneusement selectionnee, fauteuils confortables, Wi-Fi gratuit, prenom inscrit sur le gobelet : chaque detail cree une experience de consommation qui justifie un cafe a 5 euros." },
      { marque: "Nike House of Innovation", description: "Les flagships Nike proposent des experiences immersives : personnalisation de chaussures en temps reel, essai de produits sur un terrain de basket indoor, analyse de la foulee par des capteurs. Le magasin est un lieu d'experience, pas juste de vente." }
    ],
    liensAutresConcepts: ["experience-consommation", "valeur-percue", "satisfaction-client", "fidelisation"],
    prerequis: ["experience-consommation"],
    complementaires: ["valeur-percue", "packaging-design"],
    prolongements: ["satisfaction-client", "fidelisation", "community-management"],
    pistesDargumentation: [
      "Analyser comment le marketing experientiel permet le reenchantement de la consommation face a la banalisation des produits",
      "Montrer l'efficacite du marketing sensoriel sur le comportement d'achat (exemples chiffres)",
      "Discuter les limites : manipulation des emotions, greenwashing sensoriel, cout des dispositifs",
      "Comparer le marketing experientiel en magasin physique et en ligne (est-ce possible sur Internet ?)"
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
    definition: "La valeur percue represente la perception globale par le client de ce qu'il obtient (benefices fonctionnels, emotionnels, sociaux et symboliques) par rapport a ce qu'il sacrifie (prix paye, temps consacre, effort fourni). Elle est subjective, variable selon les individus et determinante dans la decision d'achat.",
    explicationSimple: "C'est le calcul mental que tu fais : 'est-ce que ce que j'ai recu vaut ce que ca m'a coute ?'. Un etudiant trouve qu'un sac Vuitton a 1500 euros n'en vaut pas la peine, mais pour un autre, le prestige social vaut chaque centime. La valeur percue n'est pas objective, elle est dans la tete du client.",
    mecanismeMarketing: "La valeur percue combine 4 dimensions : fonctionnelle (le produit remplit-il sa fonction ?), emotionnelle (procure-t-il du plaisir ?), sociale (que pensent les autres de mon choix ?) et symbolique (que dit-il de moi ?). L'entreprise peut agir sur la valeur percue en augmentant les benefices (qualite, services, image) ou en reduisant les couts percus (simplification de l'achat, livraison gratuite, essai sans engagement). Le rapport qualite/prix est la dimension la plus frequemment evaluee, mais ce n'est pas la seule.",
    exemples: [
      { marque: "Dyson", description: "Un aspirateur Dyson coute 3 a 5 fois plus cher qu'un modele classique, mais les clients percoivent une valeur superieure grace a l'innovation technologique (cyclone sans sac), le design distinctif et l'image de marque premium. Le benefice percu depasse largement le cout pour la cible visee." },
      { marque: "IKEA", description: "IKEA maximise la valeur percue en jouant sur les deux leviers : benefices eleves (design scandinave attrayant, mises en situation inspirantes) et couts reduits (prix bas, self-service, montage par le client). Le client a l'impression d'en obtenir beaucoup pour peu." },
      { marque: "Supreme", description: "Supreme vend des t-shirts basiques a plus de 100 euros. La valeur fonctionnelle est faible, mais la valeur symbolique et sociale est immense : porter Supreme signifie appartenir a une communaute, etre 'dans le coup'. La rarete organisee (drops limites) amplifie encore la valeur percue." }
    ],
    liensAutresConcepts: ["experience-consommation", "satisfaction-client", "positionnement", "politiques-prix"],
    prerequis: ["experience-consommation", "composantes-offre"],
    complementaires: ["satisfaction-client", "positionnement"],
    prolongements: ["politiques-prix", "fixation-prix", "fidelisation"],
    pistesDargumentation: [
      "Montrer que la valeur percue est subjective et variable selon les individus et les contextes",
      "Analyser comment une entreprise peut augmenter la valeur percue sans baisser ses prix",
      "Discuter le lien entre valeur percue et prix : un prix eleve augmente-t-il ou diminue-t-il la valeur percue ?",
      "Comparer la valeur percue d'un produit de luxe vs un produit low cost"
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
    definition: "La satisfaction client resulte de la comparaison entre les attentes du client avant l'achat et la performance percue du produit ou service apres utilisation. Si la performance depasse les attentes, le client est satisfait (voire enchante). Si elle est inferieure, il est insatisfait. La satisfaction est un indicateur cle de la performance marketing et un determinant de la fidelite.",
    explicationSimple: "C'est simple : si tu t'attends a un restaurant 'correct' et que c'est delicieux, tu es satisfait. Si on te promet le meilleur restaurant du monde et que c'est juste 'bien', tu es decu. La satisfaction, ce n'est pas la qualite objective du produit, c'est l'ecart entre ce que tu attendais et ce que tu as recu.",
    mecanismeMarketing: "Les entreprises mesurent la satisfaction par des enquetes, le Net Promoter Score (NPS : 'recommanderiez-vous ce produit ?'), les avis en ligne et le taux de reclamation. Un client satisfait rachete (fidelite), recommande (bouche-a-oreille positif) et coute moins cher a garder qu'un nouveau client a conquerir (ratio 1 pour 5). Un client insatisfait, en revanche, partage son mecontentement aupres de 10 a 15 personnes en moyenne et peut generer un bad buzz destructeur sur les reseaux sociaux.",
    exemples: [
      { marque: "Amazon", description: "Amazon a bati son empire sur la satisfaction client : livraison ultra-rapide (souvent en 24h), politique de retour sans condition pendant 30 jours, service client reactif. Jeff Bezos a fixe comme mission 'etre l'entreprise la plus centree sur le client au monde'. Le resultat : un NPS parmi les plus eleves du e-commerce." },
      { marque: "Decathlon", description: "Decathlon obtient regulierement les meilleurs scores de satisfaction dans le secteur sport grace a sa politique de retour ultra-souple (365 jours, sans question), ses prix bas et la qualite de ses marques propres. L'entreprise a aussi mis en place un systeme d'avis clients directement sur chaque fiche produit." }
    ],
    liensAutresConcepts: ["valeur-percue", "experience-consommation", "fidelisation", "e-reputation"],
    prerequis: ["valeur-percue", "experience-consommation"],
    complementaires: ["fidelisation", "e-reputation"],
    prolongements: ["crm", "community-management"],
    pistesDargumentation: [
      "Montrer le cercle vertueux satisfaction - fidelite - rentabilite avec des exemples chiffres",
      "Analyser les dangers d'un client insatisfait a l'ere des reseaux sociaux (bad buzz, viralite)",
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
    definition: "Les politiques tarifaires definissent la maniere dont l'entreprise fixe et gere ses prix. On distingue le prix unique (meme prix pour tous), le prix differencie (prix variable selon le client, le moment ou le lieu), le prix forfaitaire (pack ou abonnement) et le yield management (tarification dynamique en temps reel). Chaque politique repond a des objectifs strategiques differents.",
    explicationSimple: "Le prix, ce n'est pas qu'un chiffre. C'est une strategie. Un cinema peut faire payer tout le monde 12 euros (prix unique), faire des tarifs etudiants (differencie), proposer un abonnement illimite (forfaitaire), ou changer les prix selon l'horaire (yield management). Le choix de la politique de prix influence directement qui achete et combien.",
    mecanismeMarketing: "Le prix unique simplifie la gestion mais ne s'adapte pas aux differences de pouvoir d'achat. Le prix differencie maximise le chiffre d'affaires en adaptant le prix a la disposition a payer de chaque segment (tarifs jeunes, seniors, professionnels). Le prix forfaitaire cree un effet 'bonne affaire' (menus McDonald's). Le yield management utilise des algorithmes pour ajuster les prix en temps reel selon la demande (compagnies aeriennes, hotels). Le choix de la politique doit etre coherent avec le positionnement et la strategie globale de l'entreprise.",
    exemples: [
      { marque: "SNCF", description: "La SNCF cumule plusieurs politiques : prix differencies (tarifs jeunes, seniors, familles, abonnes), yield management sur les TGV (le meme trajet peut couter de 19 a 150 euros selon la date de reservation et le remplissage), et forfaits (carte Avantage). Un meme billet peut avoir 10 prix differents." },
      { marque: "McDonald's", description: "McDonald's utilise le prix forfaitaire avec ses menus (hamburger + frites + boisson a prix reduit vs achats separes). Le client a l'impression de faire une bonne affaire tout en augmentant son panier moyen. L'entreprise utilise aussi le prix differencie selon les pays et les zones geographiques." }
    ],
    liensAutresConcepts: ["yield-management", "fixation-prix", "sensibilite-prix", "valeur-percue"],
    prerequis: ["positionnement", "valeur-percue"],
    complementaires: ["yield-management", "fixation-prix"],
    prolongements: ["sensibilite-prix", "modeles-gratuite"],
    pistesDargumentation: [
      "Comparer les differentes politiques tarifaires et leurs effets sur le comportement du consommateur",
      "Analyser la coherence necessaire entre politique de prix et positionnement de marque",
      "Discuter si le prix differencie est une forme de discrimination ou d'adaptation intelligente au marche",
      "Montrer comment le numerique a transforme les politiques tarifaires (dynamic pricing, comparateurs)"
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
    definition: "Le yield management (ou revenue management) est une technique de tarification dynamique qui consiste a ajuster les prix en temps reel en fonction de la demande, du taux de remplissage et du moment de reservation. Il s'applique principalement aux secteurs a capacite limitee et perissable (transport, hotellerie, spectacles). L'objectif est de maximiser le revenu total en vendant le bon produit, au bon prix, au bon client, au bon moment.",
    explicationSimple: "C'est le principe du billet d'avion : plus tu reserves tard, plus c'est cher. Et si tout le monde veut partir au meme moment, les prix explosent. Un algorithme ajuste les prix en permanence selon l'offre restante et la demande. C'est comme les prix Uber en heure de pointe : quand tout le monde veut une voiture, le prix monte automatiquement.",
    mecanismeMarketing: "Des algorithmes analysent en continu les donnees historiques de vente, les reservations en cours, les evenements a venir et le comportement de la concurrence. Ils ajustent les prix a la hausse ou a la baisse pour maximiser le taux de remplissage ET le revenu par unite. Les conditions sont : capacite fixe (places limitees), demande fluctuante, possibilite de segmentation temporelle et un systeme de reservation. Le yield management peut generer 5 a 10% de revenus supplementaires par rapport a un prix fixe.",
    exemples: [
      { marque: "Air France", description: "Air France modifie les prix de ses billets plusieurs fois par jour en fonction du remplissage de chaque vol, de la periode, de la demande et des prix concurrents. Un Paris-New York peut couter 300 euros reserve 6 mois a l'avance ou 1500 euros la veille du depart." },
      { marque: "Uber", description: "Uber utilise le surge pricing (prix dynamique) : quand la demande de courses depasse l'offre de chauffeurs (heures de pointe, pluie, evenements), le prix est multiplie par 1,5 a 3. Le systeme ajuste en temps reel pour equilibrer offre et demande, incitant plus de chauffeurs a se connecter." }
    ],
    liensAutresConcepts: ["politiques-prix", "fixation-prix", "sensibilite-prix", "e-commerce"],
    prerequis: ["politiques-prix"],
    complementaires: ["sensibilite-prix", "fixation-prix"],
    prolongements: ["e-commerce", "kpi-communication"],
    pistesDargumentation: [
      "Analyser si le yield management est juste pour le consommateur ou s'il favorise les plus riches et les mieux informes",
      "Montrer comment les algorithmes optimisent les revenus dans les secteurs a capacite limitee",
      "Discuter les limites ethiques de la tarification dynamique (transparence, acceptabilite sociale)",
      "Comparer le yield management dans l'aerien et dans d'autres secteurs (hotellerie, spectacles, VTC)"
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
    definition: "Les modeles de gratuite proposent un acces gratuit a un produit ou service, finances par d'autres sources de revenus. Les principaux modeles sont le freemium (version gratuite limitee + version payante premium), le modele publicitaire (contenu gratuit finance par la publicite) et le modele de donnees (service gratuit en echange de donnees personnelles monetisees).",
    explicationSimple: "Quand c'est gratuit, c'est toi le produit. Spotify gratuit, c'est de la musique avec des pubs : tu paies avec ton temps d'attention et tes donnees. Google est 'gratuit' parce que tes recherches permettent de te cibler avec de la pub. Le freemium, c'est la drogue gratuite pour te rendre accro avant de payer : Fortnite est gratuit mais les skins sont payants.",
    mecanismeMarketing: "Le freemium convertit 2 a 5% des utilisateurs gratuits en payants, mais les utilisateurs gratuits servent de base de masse (effet reseau, bouche-a-oreille). Le modele publicitaire monetise l'audience aupres d'annonceurs. Le modele de donnees collecte et revend les informations personnelles a des tiers. Ces modeles creent un cout de transfert psychologique (switching cost) : une fois habitue au service gratuit, le consommateur est reluctant a changer. La question ethique du 'prix cache' (perte de vie privee, attention captee) est de plus en plus debattue.",
    exemples: [
      { marque: "Spotify", description: "Spotify illustre parfaitement le freemium : version gratuite avec publicites et lecture aleatoire, version Premium a 10,99 euros/mois sans pub avec toutes les fonctionnalites. L'objectif est de convertir les utilisateurs gratuits en abonnes payants. Environ 45% des utilisateurs sont premium, un taux exceptionnel pour du freemium." },
      { marque: "TikTok", description: "TikTok est entierement gratuit pour les utilisateurs, finance par la publicite (publicites dans le fil, challenges sponsorises, shopping integre). En echange, l'application collecte enormement de donnees sur les preferences et comportements des utilisateurs pour affiner le ciblage publicitaire et son algorithme de recommandation." }
    ],
    liensAutresConcepts: ["politiques-prix", "e-commerce", "kpi-communication", "community-management"],
    prerequis: ["politiques-prix"],
    complementaires: ["fixation-prix", "sensibilite-prix"],
    prolongements: ["e-commerce", "parcours-client-digital"],
    pistesDargumentation: [
      "Analyser si la gratuite est un vrai modele economique viable ou une illusion financiere",
      "Montrer que 'quand c'est gratuit, c'est toi le produit' : le vrai prix de la gratuite (donnees, attention)",
      "Comparer les differents modeles de gratuite (freemium vs publicitaire vs donnees) et leurs limites",
      "Discuter les enjeux ethiques de la monetisation des donnees personnelles"
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
    definition: "La fixation du prix repose sur trois approches complementaires : par les couts (prix de revient + marge souhaitee), par la demande (prix psychologique ou prix d'acceptabilite que le consommateur est pret a payer) et par la concurrence (alignement, penetration ou ecremage). Le prix cible part du prix que le marche est pret a payer pour remonter vers le cout de production acceptable.",
    explicationSimple: "Pour fixer un prix, l'entreprise a 3 boussoles. Les couts : combien ca coute a fabriquer ? La demande : combien le client est pret a payer ? La concurrence : a combien les autres vendent ? Le prix ideal est au croisement de ces 3 logiques. Si tu vends trop cher, personne n'achete. Trop pas cher, tu perds de l'argent.",
    mecanismeMarketing: "L'approche par les couts calcule : prix = cout de revient + marge. L'approche par la demande utilise des etudes de prix psychologique (en dessous, le produit parait 'suspect', au-dessus, il est trop cher). L'approche concurrentielle definit un prix relatif : en dessous (penetration, conquete de parts de marche), au meme niveau (alignement) ou au-dessus (ecremage, image premium). Le prix cible (target costing) inverse la logique : on part du prix que le marche accepte et on conçoit le produit pour que le cout tienne dans cette enveloppe.",
    exemples: [
      { marque: "Zara", description: "Zara utilise une approche prix cible : le departement design conçoit des vetements en partant du prix que la cible (jeunes urbains) est prete a payer. Les equipes de production doivent ensuite fabriquer dans cette enveloppe budgetaire. C'est le prix qui guide la conception, pas l'inverse." },
      { marque: "Apple", description: "Apple pratique l'ecremage : prix eleves au lancement (iPhone a plus de 1000 euros) pour capter les early adopters a forte disposition a payer, puis reduction progressive. Le prix eleve renforce aussi la perception premium de la marque." }
    ],
    liensAutresConcepts: ["politiques-prix", "sensibilite-prix", "valeur-percue", "positionnement"],
    prerequis: ["politiques-prix", "valeur-percue"],
    complementaires: ["sensibilite-prix", "yield-management"],
    prolongements: ["modeles-gratuite"],
    pistesDargumentation: [
      "Comparer les 3 approches de fixation du prix (couts, demande, concurrence) et leurs limites respectives",
      "Analyser la methode du prix cible (target costing) avec un exemple concret (Zara, Dacia)",
      "Montrer que le prix est un signal de qualite pour le consommateur (prix eleve = meilleur produit ?)",
      "Discuter si la strategie d'ecremage est toujours justifiee ou si elle exclut des consommateurs"
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
    definition: "La sensibilite-prix mesure l'importance que le consommateur accorde au prix dans sa decision d'achat. L'elasticite-prix de la demande mesure la variation de la demande en reponse a une variation du prix. Une demande elastique (|e|>1) reagit fortement aux changements de prix. Une demande inelastique (|e|<1) reagit peu, car le produit est percu comme indispensable, unique ou fortement differencie.",
    explicationSimple: "Si le prix du pain augmente de 20%, tu continues a en acheter (demande inelastique, produit de premiere necessite). Mais si le prix d'un jean Levi's augmente de 20%, tu risques d'acheter une autre marque (demande elastique, beaucoup d'alternatives). La sensibilite-prix depend du produit, du consommateur et de la situation.",
    mecanismeMarketing: "Les facteurs qui reduisent la sensibilite-prix sont : la differenciation forte (Apple), l'absence de substituts (medicaments), la faible part dans le budget total (chewing-gum), l'urgence du besoin, l'attachement a la marque et la qualite percue elevee. Les entreprises cherchent a reduire la sensibilite-prix de leurs clients en travaillant sur la differenciation, la marque et l'experience. Le e-commerce et les comparateurs de prix ont globalement augmente la sensibilite-prix car ils facilitent la comparaison.",
    exemples: [
      { marque: "Apple", description: "La sensibilite-prix des clients Apple est tres faible : malgre des prix 30 a 50% superieurs a la concurrence, les clients restent fideles. L'ecosysteme (iCloud, AirDrop, compatibilite entre appareils), la marque forte et la differenciation percue rendent la demande inelastique. Une hausse de prix a peu d'impact sur les ventes." },
      { marque: "Ryanair", description: "Les clients de Ryanair ont une sensibilite-prix tres elevee : ils choisissent la compagnie uniquement pour le prix bas. La moindre hausse de tarif les fait basculer vers EasyJet ou le train. La demande est tres elastique car le transport aerien low cost est percu comme un produit banal et interchangeable." }
    ],
    liensAutresConcepts: ["politiques-prix", "fixation-prix", "valeur-percue", "marque"],
    prerequis: ["politiques-prix", "fixation-prix"],
    complementaires: ["valeur-percue", "marque"],
    prolongements: ["yield-management", "promotion-ventes"],
    pistesDargumentation: [
      "Analyser les facteurs qui influencent la sensibilite-prix du consommateur avec des exemples concrets",
      "Montrer comment une entreprise peut reduire la sensibilite-prix de ses clients (differenciation, marque, fidelisation)",
      "Discuter l'impact des comparateurs de prix et du e-commerce sur la sensibilite-prix des consommateurs",
      "Comparer la sensibilite-prix pour un produit de luxe vs un produit de grande consommation"
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
    definition: "Un canal de distribution est le chemin emprunte par un produit pour aller du producteur au consommateur final. On distingue le canal direct (producteur → consommateur), le canal court (producteur → detaillant → consommateur) et le canal long (producteur → grossiste → detaillant → consommateur). Le circuit de distribution combine plusieurs canaux.",
    explicationSimple: "C'est le chemin que prend un produit pour arriver dans tes mains. Un agriculteur qui vend ses legumes au marche, c'est un canal direct. S'il passe par un supermarche, c'est un canal court. S'il passe par un grossiste puis un supermarche, c'est un canal long. Plus le canal est long, plus il y a d'intermediaires qui prennent une marge.",
    mecanismeMarketing: "Le choix du canal depend du type de produit, du volume de production, de la cible visee et des couts logistiques. Le canal direct offre un controle total et une marge maximale mais limite la couverture geographique. Le canal long maximise la couverture mais reduit la marge et le controle. La tendance est au multicanal (combiner plusieurs canaux) et au direct-to-consumer (DTC) qui supprime les intermediaires grace au numerique.",
    exemples: [
      { marque: "Nespresso", description: "Nespresso utilise principalement le canal direct (boutiques propres + site internet) pour garder le controle de l'experience client et des marges. Ce choix strategique renforce l'image premium et evite la banalisation en grande distribution, meme si cela limite la couverture geographique." },
      { marque: "Leclerc", description: "Leclerc est un intermediaire majeur du canal court et long : les magasins referencent des milliers de produits de centaines de producteurs. Le groupement negocie les prix d'achat pour obtenir les meilleurs tarifs et les repercuter aux consommateurs. Leclerc est aussi devenu un acteur digital avec le drive et la livraison." }
    ],
    liensAutresConcepts: ["intermediation", "politiques-distribution", "e-commerce", "ropo-omnicanal"],
    prerequis: [],
    complementaires: ["intermediation", "politiques-distribution"],
    prolongements: ["ropo-omnicanal", "e-commerce", "marketplace"],
    pistesDargumentation: [
      "Comparer les avantages et inconvenients des canaux direct, court et long pour le producteur ET le consommateur",
      "Analyser comment le numerique bouleverse les canaux de distribution traditionnels (DTC, e-commerce)",
      "Discuter si la vente directe (sans intermediaires) est toujours avantageuse pour le producteur",
      "Montrer l'evolution vers le multicanal et ses implications strategiques"
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
    definition: "L'intermediation est le role joue par un acteur (grossiste, detaillant, plateforme) qui se place entre le producteur et le consommateur pour faciliter l'echange. La desintermediation consiste a supprimer ces intermediaires pour vendre directement au client final. La reintermediation designe l'apparition de nouveaux intermediaires numeriques (plateformes, marketplaces) qui remplacent les anciens.",
    explicationSimple: "Un intermediaire, c'est le 'middleman'. Longtemps, les artisans avaient besoin de boutiques pour vendre. Avec Internet, un createur peut vendre directement sur Instagram (desintermediation). Mais de nouvelles plateformes comme Etsy ou Amazon s'intercalent a nouveau entre vendeur et acheteur (reintermediation). Les intermediaires changent, mais ne disparaissent jamais completement.",
    mecanismeMarketing: "La desintermediation est rendue possible par le numerique (sites e-commerce, reseaux sociaux, vente directe en ligne). Elle permet au producteur de recuperer la marge des intermediaires et de controler la relation client. Mais elle impose de gerer la logistique, le service client et la visibilite. La reintermediation numerique (Amazon, Uber Eats, Booking) cree de nouveaux gatekeepers qui captent une part importante de la valeur en echange de leur audience et de leur infrastructure.",
    exemples: [
      { marque: "Le Slip Francais", description: "Le Slip Francais est ne en vente directe (DTC) sur son site internet, supprimant les intermediaires traditionnels (grossistes, boutiques multimarques). Cette desintermediation permet des marges plus elevees et un controle total de l'image de marque, meme si l'entreprise a ensuite ouvert des boutiques propres." },
      { marque: "Uber Eats", description: "Uber Eats est un cas typique de reintermediation : les restaurants vendaient directement a leurs clients, puis Uber Eats s'est interpose comme nouvel intermediaire numerique. La plateforme prend 15 a 30% de commission mais apporte visibilite et livraison. Les restaurateurs sont dependants de ce nouvel intermediaire." }
    ],
    liensAutresConcepts: ["canaux-distribution", "e-commerce", "marketplace", "relations-prod-distrib"],
    prerequis: ["canaux-distribution"],
    complementaires: ["e-commerce", "marketplace"],
    prolongements: ["relations-prod-distrib", "distribution-collaborative"],
    pistesDargumentation: [
      "Analyser comment Internet a provoque une vague de desintermediation puis de reintermediation",
      "Discuter si la desintermediation profite vraiment au consommateur (prix plus bas ?) ou au producteur (marges plus elevees ?)",
      "Montrer que les plateformes numeriques sont les nouveaux intermediaires incontournables du 21e siecle",
      "Comparer le pouvoir des anciens intermediaires (grande distribution) vs les nouveaux (GAFAM, plateformes)"
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
    definition: "Les politiques de distribution definissent le degre de couverture du marche choisi par l'entreprise. La distribution intensive vise le maximum de points de vente. La distribution selective choisit des revendeurs repondant a des criteres qualitatifs. La distribution exclusive reserve la vente a un nombre tres limite de distributeurs sur une zone geographique.",
    explicationSimple: "C'est le choix strategique : ou veux-tu que ton produit soit vendu ? Coca-Cola est partout (intensif : supermarches, bars, distributeurs). Les parfums Chanel sont en parfumerie selectionnee (selectif). Rolex n'est vendu que chez des horlogers agrees (exclusif). Plus c'est rare, plus ca renforce l'image premium.",
    mecanismeMarketing: "La distribution intensive maximise la couverture et les volumes mais dilue l'image et reduit le controle sur les conditions de vente. La distribution selective permet de controler l'image et le service tout en maintenant une bonne couverture. La distribution exclusive protege l'image de marque, garantit un service premium mais limite les volumes. Le choix depend du positionnement, du type de produit et de la strategie de marque.",
    exemples: [
      { marque: "Coca-Cola", description: "Coca-Cola pratique la distribution intensive la plus poussee au monde : le produit est disponible dans plus de 200 pays, dans les supermarches, les bars, les restaurants, les distributeurs automatiques, les stations-service. L'objectif est d'etre 'a portee de main' du consommateur en toute circonstance." },
      { marque: "Rolex", description: "Rolex pratique la distribution exclusive : seuls les horlogers officiellement agrees peuvent vendre des montres Rolex. Chaque detaillant est selectionne pour son prestige, son emplacement et sa capacite a offrir un service premium. Cette rarete maitrisee renforce l'image de luxe et la desirabilite de la marque." }
    ],
    liensAutresConcepts: ["canaux-distribution", "positionnement", "marque", "relations-prod-distrib"],
    prerequis: ["canaux-distribution", "positionnement"],
    complementaires: ["relations-prod-distrib", "ecr"],
    prolongements: ["digitalisation-uc", "ropo-omnicanal"],
    pistesDargumentation: [
      "Comparer les 3 politiques de distribution et leurs impacts sur l'image de marque",
      "Analyser pourquoi les marques de luxe privilegient la distribution selective ou exclusive",
      "Discuter si le e-commerce remet en cause les strategies de distribution selective (ventes grises, contrefacons)",
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
    definition: "Les relations entre producteurs et distributeurs oscillent entre cooperation et conflit. Elles se structurent autour de la negociation commerciale (prix, conditions de vente, marges arriere), du referencement (acces aux lineaires), du rapport de force (loi Egalim) et des partenariats (trade marketing, MDD). Le cadre legal encadre ces relations pour proteger les parties les plus faibles.",
    explicationSimple: "C'est un rapport de force permanent. Les grandes surfaces (Leclerc, Carrefour) ont un pouvoir enorme car elles decidement quels produits sont en rayon. Les producteurs ont besoin de cette visibilite pour vendre. Cette tension se traduit par des negociations annuelles tres dures sur les prix. La loi Egalim essaie d'equilibrer ce rapport de force pour proteger les agriculteurs et les PME.",
    mecanismeMarketing: "Le producteur negocie le referencement (acces aux rayons), l'emplacement en lineaire (tete de gondole = visibilite maximale), les conditions commerciales (prix, remises, promotions) et les marges arriere. Le distributeur utilise son pouvoir de marche pour obtenir les meilleurs prix. Le trade marketing cree des synergies entre les deux parties (operations conjointes, donnees partagees). Les MDD (marques de distributeur) sont un levier de pouvoir supplementaire pour le distributeur.",
    exemples: [
      { marque: "Lactalis vs Leclerc", description: "Les negociations annuelles entre les geants du lait (Lactalis, Danone) et de la distribution (Leclerc, Carrefour) sont legendaires. En 2024, Leclerc a derefence temporairement des produits Pepsi pour faire pression sur les prix. Ces conflits illustrent le rapport de force desequilibre au detriment des producteurs." },
      { marque: "C'est qui le patron ?!", description: "La marque 'C'est qui le patron ?!' est nee en reaction au desequilibre des relations producteurs-distributeurs. Les consommateurs votent pour definir le prix du lait qui garantit une juste remuneration aux agriculteurs. C'est un modele unique de cooperation tripartite producteur-distributeur-consommateur." }
    ],
    liensAutresConcepts: ["politiques-distribution", "canaux-distribution", "ecr", "intermediation"],
    prerequis: ["canaux-distribution", "politiques-distribution"],
    complementaires: ["ecr", "intermediation"],
    prolongements: ["distribution-collaborative"],
    pistesDargumentation: [
      "Analyser le rapport de force entre producteurs et grande distribution et ses consequences",
      "Montrer comment la loi Egalim tente de reequilibrer les negociations commerciales",
      "Discuter le role des MDD dans les relations producteurs-distributeurs",
      "Comparer les modeles de relations cooperatives vs conflictuelles et leurs impacts"
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
    definition: "L'ECR (Reponse Efficace au Consommateur) est une strategie de cooperation entre producteurs et distributeurs visant a optimiser la chaine d'approvisionnement pour mieux satisfaire le consommateur final. Elle repose sur 4 piliers : assortiment efficient, reapprovisionnement efficient, promotions efficientes et lancement efficient de nouveaux produits. L'ECR utilise des outils comme l'EDI (echange de donnees informatisees) et le category management.",
    explicationSimple: "L'ECR, c'est quand Coca-Cola et Carrefour arretent de se battre et cooperent pour que le bon produit soit au bon endroit, au bon moment, au bon prix. Plutot que de negocier durement chacun de leur cote, ils partagent des donnees (ventes, stocks) pour eviter les ruptures de stock et optimiser les promotions. Tout le monde y gagne, surtout le consommateur.",
    mecanismeMarketing: "L'ECR partage des donnees en temps reel entre producteur et distributeur via l'EDI (codes-barres, flux logistiques automatises). Le category management organise les rayons par categories de besoins du consommateur plutot que par type de produit. Le reapprovisionnement automatique (GPA - Gestion Partagee des Approvisionnements) evite les ruptures et le surstockage. L'ensemble reduit les couts logistiques de 2 a 5% et ameliore la satisfaction client par une meilleure disponibilite des produits.",
    exemples: [
      { marque: "Procter & Gamble / Walmart", description: "Le partenariat P&G-Walmart est le cas d'ecole de l'ECR : les deux entreprises partagent leurs donnees de vente en temps reel, les stocks sont reapprovisionnes automatiquement et les promotions sont coordonnees. Ce partenariat a reduit les couts logistiques de 10% et les ruptures de stock de 70%." },
      { marque: "Unilever / Carrefour", description: "Unilever et Carrefour pratiquent le category management conjoint : les rayons hygiene-beaute sont organises selon les parcours d'achat des consommateurs (par besoin : soin du visage, capillaire, etc.) plutot que par marque, augmentant les ventes de la categorie de 8%." }
    ],
    liensAutresConcepts: ["relations-prod-distrib", "canaux-distribution", "digitalisation-uc"],
    prerequis: ["relations-prod-distrib", "canaux-distribution"],
    complementaires: ["politiques-distribution", "digitalisation-uc"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser comment l'ECR transforme des relations conflictuelles en partenariats gagnant-gagnant",
      "Montrer les benefices concrets de l'ECR pour le consommateur (disponibilite, prix, fraicheur)",
      "Discuter les limites de l'ECR : dependance technologique, partage de donnees sensibles, asymetrie de pouvoir",
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
    definition: "ROPO (Research Online, Purchase Offline) designe le comportement du consommateur qui recherche des informations en ligne avant d'acheter en magasin. L'omnicanalite est une strategie de distribution qui integre tous les canaux (magasin, site web, appli, reseaux sociaux) dans une experience client fluide et coherente, sans rupture quel que soit le point de contact.",
    explicationSimple: "Tu cherches un smartphone sur Internet, tu compares les prix, tu lis les avis (Research Online)... puis tu vas l'acheter chez Fnac pour le voir en vrai (Purchase Offline). C'est le ROPO. L'omnicanalite, c'est quand Fnac te permet de commencer en ligne, tester en magasin, commander sur l'appli et te faire livrer chez toi, le tout avec une experience coherente.",
    mecanismeMarketing: "Le ROPO concerne 60 a 80% des achats en magasin (le consommateur se renseigne d'abord en ligne). L'omnicanalite exige que tous les canaux soient interconnectes : stock unifie (disponible en ligne = disponible en magasin), click and collect, retour en magasin d'un achat en ligne, historique client unique. L'inverse du ROPO existe aussi : le showrooming (voir en magasin, acheter en ligne moins cher). L'enjeu est d'offrir une experience sans couture (seamless) entre le physique et le digital.",
    exemples: [
      { marque: "Fnac", description: "Fnac est un modele d'omnicanalite : le client peut verifier le stock en ligne, reserver un produit pour le retirer en 1h (click and collect), comparer les prix, lire les avis des vendeurs et des clients, et retourner en magasin un achat fait en ligne. L'appli Fnac fait le lien entre tous ces canaux." },
      { marque: "Zara", description: "Zara integre le ROPO dans sa strategie : l'appli permet de scanner un article en magasin pour voir les tailles disponibles, de commander en ligne un produit en rupture, et de retourner les achats web en boutique. Le stock est unifie entre les canaux, offrant une experience sans rupture." }
    ],
    liensAutresConcepts: ["canaux-distribution", "e-commerce", "parcours-client-digital", "digitalisation-uc"],
    prerequis: ["canaux-distribution", "parcours-client-digital"],
    complementaires: ["e-commerce", "digitalisation-uc"],
    prolongements: ["distribution-collaborative"],
    pistesDargumentation: [
      "Montrer comment le ROPO a transforme le role du magasin physique (de lieu de vente a showroom)",
      "Analyser les defis de la mise en place d'une strategie omnicanale pour une enseigne traditionnelle",
      "Discuter si le showrooming menace les magasins physiques ou les pousse a se reinventer",
      "Comparer une experience multicanale (canaux separes) vs omnicanale (canaux integres)"
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
    definition: "La distribution collaborative s'appuie sur l'economie du partage et les plateformes numeriques pour creer de nouveaux modes de distribution entre particuliers (C2C) ou entre communautes. Elle inclut le co-voiturage, la location entre particuliers, la revente d'occasion, le financement participatif et les circuits courts collaboratifs.",
    explicationSimple: "C'est la distribution par et pour les gens, sans entreprise traditionnelle au milieu. Vinted, c'est toi qui vends a un autre particulier. BlaBlaCar, c'est toi qui proposes un trajet. Airbnb, c'est toi qui loues ton appartement. Les plateformes connectent les gens entre eux et prennent une petite commission au passage.",
    mecanismeMarketing: "Les plateformes collaboratives creent un marche a deux faces (two-sided market) : elles doivent attirer a la fois les offreurs et les demandeurs pour generer un effet reseau. La confiance est assuree par les systemes d'avis, de notation et de paiement securise. Le modele economique repose sur la commission (% sur chaque transaction), l'abonnement ou la publicite. La distribution collaborative bouleverse les secteurs traditionnels (hotelerie, taxi, commerce) en democratisant l'acces a l'offre.",
    exemples: [
      { marque: "Vinted", description: "Vinted a revolutionne la distribution de vetements d'occasion en creant une plateforme C2C (Consumer to Consumer) sans commission pour le vendeur. L'effet reseau (50 millions d'utilisateurs en Europe) rend la plateforme incontournable. Vinted illustre comment la distribution collaborative cannibalise la fast fashion traditionnelle." },
      { marque: "BlaBlaCar", description: "BlaBlaCar est le leader mondial du covoiturage longue distance. La plateforme met en relation conducteurs et passagers, creant un nouveau canal de distribution pour le transport de personnes. Le systeme de notation bidirectionnelle garantit la confiance. Le modele prend une commission de 20% sur chaque trajet." }
    ],
    liensAutresConcepts: ["e-commerce", "marketplace", "intermediation", "ropo-omnicanal"],
    prerequis: ["intermediation", "e-commerce"],
    complementaires: ["marketplace", "ropo-omnicanal"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser comment l'economie collaborative bouleverse les modeles de distribution traditionnels",
      "Montrer les avantages et limites de la distribution collaborative pour le consommateur",
      "Discuter si Uber, Airbnb et Vinted sont de la vraie economie collaborative ou du capitalisme de plateforme",
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
    definition: "La digitalisation des unites commerciales consiste a integrer des technologies numeriques dans les points de vente physiques pour enrichir l'experience client, optimiser la gestion et creer des synergies entre le online et le offline. On parle de 'phygital' (physique + digital). Les outils incluent les bornes interactives, le paiement mobile, les ecrans dynamiques, les QR codes, la realite augmentee et les capteurs IoT.",
    explicationSimple: "C'est le magasin du futur qui est deja la. Chez Decathlon, tu passes en caisse en posant tout ton panier sur un tapis RFID qui scanne automatiquement tes articles. Chez Sephora, tu essaies du maquillage en realite augmentee. Le magasin physique devient 'phygital' : il combine le meilleur du physique (toucher, essayer) et du digital (rapidite, personnalisation).",
    mecanismeMarketing: "La digitalisation agit a 3 niveaux. Cote client : bornes de commande (McDonald's), miroirs connectes, tablettes vendeurs, click and collect, paiement sans contact. Cote gestion : inventaire RFID en temps reel, planogrammes optimises par IA, etiquettes electroniques de prix. Cote experience : ecrans geants, ambiance personnalisee, gamification. L'objectif est de generer du trafic en magasin (drive-to-store), d'augmenter le panier moyen et de collecter des donnees sur le comportement en magasin.",
    exemples: [
      { marque: "Decathlon", description: "Decathlon est un pionnier de la digitalisation : caisses RFID automatiques, click and collect en 1h, bornes de consultation du stock en temps reel, etiquettes electroniques, application de scan en magasin. Le taux de satisfaction en caisse a bondi de 35% grace au passage a la RFID." },
      { marque: "Amazon Go", description: "Amazon Go est le concept le plus radical de digitalisation : zero caisse, zero file d'attente. Des centaines de cameras et capteurs identifient les produits que le client prend en rayon et debitent automatiquement son compte Amazon a la sortie. Le magasin est entierement automatise, offrant l'experience d'achat la plus fluide possible." }
    ],
    liensAutresConcepts: ["ropo-omnicanal", "e-commerce", "experience-consommation", "parcours-client-digital"],
    prerequis: ["canaux-distribution", "ropo-omnicanal"],
    complementaires: ["e-commerce", "parcours-client-digital"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser comment le phygital reconcilie les avantages du magasin physique et du numerique",
      "Montrer les benefices de la digitalisation pour l'enseigne (productivite, donnees) ET le consommateur (experience, rapidite)",
      "Discuter si la digitalisation des magasins ne menace pas l'emploi dans le commerce de detail",
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
    definition: "Le e-commerce designe la vente de biens et services sur Internet. Le m-commerce (mobile commerce) est sa declinaison sur smartphones et tablettes. Ces canaux numeriques representent une part croissante du commerce total et offrent des avantages specifiques : accessibilite 24/7, choix illimite, comparaison facilitee et personnalisation par les donnees.",
    explicationSimple: "Acheter en ligne depuis ton canape ou ton telephone, c'est le e-commerce et le m-commerce. C'est devenu tellement banal que tu ne te rends meme plus compte que tu utilises un canal de distribution totalement different du magasin physique. En France, le e-commerce represente desormais plus de 15% du commerce de detail.",
    mecanismeMarketing: "Le e-commerce fonctionne sur un tunnel de conversion : attraction (SEO, publicite), consideration (fiche produit, avis), conversion (panier, paiement), fidelisation (email, recommandations). Le m-commerce ajoute des specificites : geolocalisation, notifications push, paiement par empreinte, achat social (via Instagram, TikTok). Les enjeux cles sont : le taux de conversion (2-3% en moyenne), le panier moyen, le taux de retour et la derniere-mile (livraison du dernier kilometre, la plus couteuse).",
    exemples: [
      { marque: "Amazon", description: "Amazon est le leader mondial du e-commerce avec un CA de plus de 500 milliards de dollars. Son avantage competitif repose sur 3 piliers : le choix (des centaines de millions de references), la livraison (Prime en 24h) et la technologie (algorithmes de recommandation qui generent 35% des ventes). Amazon a reduit la friction d'achat au minimum avec le paiement en 1 clic." },
      { marque: "Shein", description: "Shein est le champion du m-commerce : 80% de ses ventes se font sur l'application mobile. Le modele 'test and repeat' utilise les donnees de l'appli pour lancer des centaines de nouvelles references par jour, ne produire en masse que celles qui fonctionnent, et les livrer en 7-10 jours. L'appli est gamifiee (points, roue de la fortune) pour maximiser l'engagement." }
    ],
    liensAutresConcepts: ["canaux-distribution", "marketplace", "ropo-omnicanal", "parcours-client-digital"],
    prerequis: ["canaux-distribution"],
    complementaires: ["marketplace", "ropo-omnicanal"],
    prolongements: ["kpi-communication", "modeles-gratuite"],
    pistesDargumentation: [
      "Analyser les avantages et inconvenients du e-commerce pour le consommateur et pour le distributeur",
      "Montrer comment le m-commerce transforme les habitudes d'achat (achat impulsif, social commerce)",
      "Discuter l'impact environnemental du e-commerce (livraisons, retours, emballages) vs le commerce physique",
      "Comparer les modeles e-commerce purs (Amazon) vs les strategies omnicanales (Fnac)"
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
    definition: "Une marketplace (place de marche) est une plateforme numerique qui met en relation des vendeurs tiers et des acheteurs, sans detenir elle-meme les produits en stock. Elle se remunere par une commission sur chaque transaction. Les marketplaces beneficient d'effets de reseau : plus il y a de vendeurs, plus l'offre attire d'acheteurs, et inversement.",
    explicationSimple: "Imagine un enorme marche en plein air, mais en ligne. Amazon Marketplace, c'est comme un marche ou des milliers de vendeurs independants installent leur stand. Amazon fournit le lieu (la plateforme), la securite (le paiement), la visibilite (le trafic) et prend une commission sur chaque vente. Le vendeur n'a pas besoin de creer son propre site.",
    mecanismeMarketing: "La marketplace cree un marche a deux faces : elle doit atteindre une masse critique de vendeurs pour attirer les acheteurs (et inversement). Le modele economique repose sur les commissions (8 a 25% selon les plateformes), les abonnements vendeurs, les publicites sponsorisees et les services logistiques (Fulfillment by Amazon). L'avantage pour le vendeur est l'acces a une audience massive. L'inconvenient est la dependance a la plateforme et la pression sur les marges. L'effet 'winner takes all' tend a creer des monopoles de plateforme.",
    exemples: [
      { marque: "Amazon Marketplace", description: "Amazon Marketplace heberge plus de 2 millions de vendeurs tiers qui representent 60% des ventes totales d'Amazon. Les vendeurs paient une commission de 8 a 15% selon la categorie et peuvent utiliser FBA (Fulfillment by Amazon) pour la logistique. Le systeme d'avis et le badge 'Amazon's Choice' orientent les achats." },
      { marque: "Etsy", description: "Etsy est une marketplace specialisee dans l'artisanat, le vintage et les creations uniques. Elle se differencie d'Amazon par son positionnement de niche et sa communaute de createurs. Le modele illustre qu'une marketplace peut prosperer en ciblant un segment specifique plutot qu'en visant le marche de masse." }
    ],
    liensAutresConcepts: ["e-commerce", "intermediation", "canaux-distribution", "distribution-collaborative"],
    prerequis: ["e-commerce", "intermediation"],
    complementaires: ["distribution-collaborative", "canaux-distribution"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser le modele economique des marketplaces et les effets de reseau qui les rendent dominantes",
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
    definition: "La communication commerciale regroupe l'ensemble des actions par lesquelles une entreprise transmet un message a ses cibles (clients, prospects) pour les informer, les persuader ou les inciter a l'achat. Elle comprend la communication media (publicite TV, radio, presse, affichage, cinema, digital) et la communication hors-media (promotion des ventes, relations publiques, marketing direct, evenementiel, parrainage).",
    explicationSimple: "C'est tout ce que fait une entreprise pour se faire connaitre et donner envie d'acheter. La pub Nike a la tele, c'est de la communication media. Le code promo -20% que tu recois par email, c'est du hors-media. Une campagne TikTok avec un influenceur, c'est du digital. L'objectif est toujours le meme : toucher la bonne personne avec le bon message au bon moment.",
    mecanismeMarketing: "La communication commerciale suit un processus structure : definition des objectifs (notoriete, image, action), identification de la cible, elaboration du message (promesse, ton, preuves), choix des medias et supports, planification (mediaplanning), execution et mesure des resultats. Le budget est alloue entre media et hors-media selon les objectifs. Le modele AIDA (Attention, Interet, Desir, Action) structure la construction du message publicitaire.",
    exemples: [
      { marque: "Nike", description: "Nike excelle en communication commerciale multi-canal : publicites TV emotionnelles avec des athletes stars (media), campagnes virales sur les reseaux sociaux comme 'Just Do It' (digital), evenements sportifs sponsorises (hors-media), application Nike Training Club (marketing direct). La coherence entre tous ces messages construit une image de marque puissante." },
      { marque: "Burger King", description: "Burger King se distingue par une communication decalee et provocatrice : tacle direct de McDonald's dans ses publicites, tweets viraux, campagnes interactives. Le ton humoristique et competitif cree de l'engagement et du bouche-a-oreille gratuit sur les reseaux sociaux." }
    ],
    liensAutresConcepts: ["copie-strategie", "medias-supports", "poem", "promotion-ventes"],
    prerequis: ["positionnement", "ciblage"],
    complementaires: ["copie-strategie", "medias-supports"],
    prolongements: ["poem", "promotion-ventes", "community-management"],
    pistesDargumentation: [
      "Comparer l'efficacite de la communication media vs hors-media dans differents contextes",
      "Analyser comment le digital a transforme la communication commerciale (ciblage, mesure, interaction)",
      "Discuter si la communication commerciale influence reellement les comportements d'achat ou si le consommateur est devenu insensible a la publicite",
      "Montrer l'importance de la coherence entre tous les messages de communication d'une marque"
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
    definition: "La copie strategie (ou copy strategy) est le document de reference qui guide la creation publicitaire. Elle definit la promesse (benefice principal pour le consommateur), la preuve (justification de la promesse), le benefice consommateur (ce qu'il gagne concretement), le ton (style de la communication) et la contrainte (elements obligatoires). C'est le cahier des charges creatif entre l'annonceur et l'agence.",
    explicationSimple: "C'est la recette de la publicite. Avant de creer un spot ou une affiche, l'agence doit savoir : quelle est la promesse faite au consommateur ? Quelle preuve pour y croire ? Quel ton adopter ? Par exemple, pour Dove : promesse = beaute naturelle, preuve = produits sans chimie agressive, ton = bienveillant et inclusif. Sans copie strategie, la pub part dans tous les sens.",
    mecanismeMarketing: "La copie strategie est elaboree par l'annonceur et/ou l'agence de communication. La promesse doit etre unique, credible et attractive (USP - Unique Selling Proposition). La preuve peut etre factuelle (test, chiffre), institutionnelle (heritage, expertise) ou testimoniale (avis client, star). Le benefice consommateur traduit la promesse en avantage concret. Le ton definit l'ambiance (serieux, humoristique, provocateur, emotionnel). Les equipes creatives (DA, redacteurs) traduisent ensuite cette strategie en creation publicitaire (visuels, textes, videos).",
    exemples: [
      { marque: "Dove", description: "La copie strategie de Dove est un cas d'ecole : promesse = 'la vraie beaute', preuve = utilisation de vraies femmes (pas de mannequins), benefice = se sentir belle telle qu'on est, ton = bienveillant et inclusif. La campagne 'Real Beauty' a transforme la marque et revolutionne la publicite cosmetique." },
      { marque: "Red Bull", description: "Red Bull : promesse = energie et depassement de soi, preuve = sponsoring d'athletes extremes et evenements spectaculaires (saut de Baumgartner depuis la stratosphere), benefice = se sentir energise et audacieux, ton = extreme, cool, jeune. Le slogan 'Red Bull donne des ailes' resume parfaitement la copie strategie." }
    ],
    liensAutresConcepts: ["communication-commerciale", "medias-supports", "positionnement", "marque"],
    prerequis: ["communication-commerciale", "positionnement"],
    complementaires: ["medias-supports", "poem"],
    prolongements: ["community-management", "kpi-communication"],
    pistesDargumentation: [
      "Analyser la copie strategie d'une marque celebre et montrer comment elle se traduit dans toutes les communications",
      "Montrer l'importance de la coherence entre la promesse publicitaire et la realite du produit",
      "Discuter si la copie strategie est toujours pertinente a l'ere des reseaux sociaux et du contenu ephemere",
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
    definition: "Un media est un canal de diffusion de masse (TV, radio, presse, affichage, cinema, Internet). Un support est un vehicule specifique au sein d'un media (TF1, France Inter, Le Monde, JCDecaux, Instagram). Le hors-media regroupe les actions de communication qui n'utilisent pas les grands medias traditionnels : promotion des ventes, marketing direct, relations publiques, evenementiel, parrainage.",
    explicationSimple: "Le media, c'est la route. Le support, c'est le vehicule. Si le media est 'la television', le support est 'TF1' ou 'M6'. Si le media est 'Internet', le support est 'Instagram' ou 'YouTube'. Le hors-media, c'est tout le reste : les promos en magasin, les emails, les salons professionnels, les evenements. Aujourd'hui, le digital brouille les frontieres entre media et hors-media.",
    mecanismeMarketing: "Le mediaplanning consiste a choisir la combinaison optimale de medias et supports pour atteindre la cible au meilleur cout. Les criteres de choix sont : la couverture (nombre de personnes touchees), la repetition (nombre d'expositions), l'affinite (adequation avec la cible), le cout pour 1000 contacts (CPM) et le contexte de reception. Le hors-media permet un contact plus direct et personnalise : le marketing direct (emailing, SMS) cible individuellement, la promotion des ventes declenche l'achat immediat, les RP construisent la credibilite.",
    exemples: [
      { marque: "L'Oreal", description: "L'Oreal est le plus gros annonceur mondial avec un budget media de plus de 10 milliards d'euros. La marque utilise tous les medias : TV pour la notoriete de masse, presse femme pour l'affinite, digital pour le ciblage et les tutoriels YouTube, Instagram pour les influenceurs. Le mix media evolue chaque annee vers plus de digital." },
      { marque: "Decathlon", description: "Decathlon privilegiait historiquement le hors-media (catalogues, evenements sportifs locaux, parrainage de clubs). L'enseigne a bascule vers le digital avec des tutoriels YouTube, des campagnes Instagram et du marketing de contenu. Le bouche-a-oreille (avis clients) reste son media le plus puissant, sans aucun cout." }
    ],
    liensAutresConcepts: ["communication-commerciale", "copie-strategie", "poem", "kpi-communication"],
    prerequis: ["communication-commerciale"],
    complementaires: ["copie-strategie", "poem"],
    prolongements: ["promotion-ventes", "community-management", "kpi-communication"],
    pistesDargumentation: [
      "Comparer l'efficacite des medias traditionnels (TV, presse) vs les medias digitaux pour toucher les jeunes",
      "Analyser l'evolution du mediaplanning face a la fragmentation des audiences (multiplication des supports)",
      "Discuter si le hors-media est plus efficace que le media pour declencher l'achat",
      "Montrer comment le digital brouille la frontiere entre media et hors-media"
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
    definition: "POEM est un modele qui classe les canaux de communication en 3 categories. Paid media : espaces publicitaires achetes (pub TV, Google Ads, posts sponsorises). Owned media : supports detenus par la marque (site web, appli, newsletter, reseaux sociaux propres). Earned media : visibilite gratuite gagnee grace a la qualite du contenu (partages, avis, articles de presse, bouche-a-oreille).",
    explicationSimple: "Imagine 3 facons de faire parler de toi. Le Paid, c'est payer une pub (comme acheter un panneau publicitaire). Le Owned, c'est ton propre terrain (comme ton compte Instagram perso). Le Earned, c'est quand les autres parlent de toi naturellement parce que tu es interessant (comme quand un ami recommande un resto). Le Graal du marketing, c'est le Earned : la visibilite gratuite et credible.",
    mecanismeMarketing: "Le Paid media offre une couverture rapide et controlee mais coute cher et est percu comme intrusif. Le Owned media est gratuit mais necessite de creer du contenu regulierement et sa portee est limitee aux abonnes. Le Earned media est le plus credible (les consommateurs font davantage confiance aux avis qu'aux pubs) mais il est incontrolable et impredictible. Une strategie efficace combine les 3 : le Paid genere de la visibilite, le Owned la capitalise, et le Earned la demultiplie. Le digital a considérablement elargi le Earned media via les reseaux sociaux.",
    exemples: [
      { marque: "GoPro", description: "GoPro illustre parfaitement le POEM. Paid : publicites YouTube et Instagram. Owned : site web, appli GoPro, chaine YouTube officielle. Earned : des millions de videos tournees par les utilisateurs eux-memes, partagees sur les reseaux sociaux. Le Earned media de GoPro (contenu genere par les utilisateurs) est bien plus puissant que son Paid media." },
      { marque: "Tesla", description: "Tesla a un budget publicite de quasiment 0 euro (pas de Paid media traditionnel). Toute sa communication repose sur le Owned media (site web, compte Twitter d'Elon Musk) et le Earned media (buzz mediatique, fans qui evangelisent, couverture presse gratuite). C'est la preuve qu'un produit exceptionnel peut generer enormement de Earned media." }
    ],
    liensAutresConcepts: ["communication-commerciale", "medias-supports", "community-management", "buzz-viral"],
    prerequis: ["communication-commerciale", "medias-supports"],
    complementaires: ["community-management", "marketing-influence"],
    prolongements: ["buzz-viral", "e-reputation"],
    pistesDargumentation: [
      "Analyser la strategie POEM d'une marque et montrer comment les 3 piliers s'articulent",
      "Montrer que le Earned media est le plus credible mais le plus difficile a obtenir et a maitriser",
      "Discuter si une entreprise peut se passer de Paid media grace a un Earned media fort (cas Tesla)",
      "Comparer le rapport cout/efficacite des 3 types de media pour une marque"
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
    definition: "La promotion des ventes regroupe les techniques visant a stimuler les ventes a court terme par un avantage temporaire offert au consommateur ou au distributeur. Les techniques consommateur incluent les reductions de prix, les bons de reduction, les ventes flash, les lots, les echantillons, les jeux-concours et les offres de remboursement. Les techniques distributeur incluent les remises, les primes et les PLV (publicite sur le lieu de vente).",
    explicationSimple: "C'est tout ce qui te pousse a acheter MAINTENANT au lieu d'attendre. Les soldes, le Black Friday, les codes promo '-20%', les '1 achete = 1 offert', les ventes privees... La promo cree un sentiment d'urgence et de bonne affaire. C'est redoutablement efficace a court terme, mais attention : si tout est toujours en promo, le consommateur ne paie plus jamais le prix normal.",
    mecanismeMarketing: "La promotion agit sur 3 leviers psychologiques : l'urgence (offre limitee dans le temps), la rarete (stocks limites) et l'avantage percu (economie realisee). Les promotions push (vers le distributeur) visent a obtenir plus de visibilite en rayon. Les promotions pull (vers le consommateur) visent a declencher l'achat. L'efficacite se mesure en taux d'ecoulement et en CA incrementiel (ventes supplementaires generees). Le risque principal est l'accoutumance : le consommateur attend les promos et ne paie plus jamais plein tarif (cercle vicieux promotionnel).",
    exemples: [
      { marque: "Amazon Prime Day", description: "Amazon Prime Day est devenu un evenement promotionnel mondial : 48h de ventes flash exclusives aux membres Prime. En 2024, plus de 12 milliards de dollars de ventes. Le mecanisme combine urgence (duree limitee), exclusivite (reservee aux membres) et avantage percu (reductions de 20 a 50%). C'est la promotion des ventes a l'echelle planetaire." },
      { marque: "Sephora", description: "Sephora maitrise la promotion multi-canal : soldes en magasin, ventes privees pour les membres Gold, offres flash sur l'application, echantillons gratuits dans chaque commande, programme de points echangeables contre des mini-produits. Chaque technique de promotion est ciblee selon le profil et le niveau de fidelite du client." }
    ],
    liensAutresConcepts: ["communication-commerciale", "sensibilite-prix", "fidelisation", "medias-supports"],
    prerequis: ["communication-commerciale", "politiques-prix"],
    complementaires: ["sensibilite-prix", "fidelisation"],
    prolongements: ["kpi-communication"],
    pistesDargumentation: [
      "Analyser les mecanismes psychologiques de la promotion des ventes (urgence, rarete, ancrage de prix)",
      "Discuter si les promotions permanentes ne degradent pas la valeur percue de la marque",
      "Comparer l'efficacite des differentes techniques promotionnelles (reduction, lot, echantillon, jeu-concours)",
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
    definition: "La fidelisation vise a inciter le client a reacheter et a rester fidele a la marque dans la duree. On distingue la fidelisation induite (le client reste par contrainte : engagement, ecosysteme ferme, cout de transfert) et la fidelisation recherchee (le client reste par satisfaction : programmes de fidelite, avantages, qualite de service). La valeur vie client (LTV - LifeTime Value) mesure les revenus qu'un client genere sur toute la duree de sa relation avec l'entreprise.",
    explicationSimple: "Fideliser, c'est faire revenir le client encore et encore. Il y a deux facons : la contrainte (tu restes chez Apple parce que changer d'ecosysteme serait trop complique = fidelisation induite) ou le plaisir (tu restes chez Sephora pour les points de fidelite et les cadeaux = fidelisation recherchee). La regle d'or du marketing : fideliser un client existant coute 5 a 7 fois moins cher que d'en conquerir un nouveau.",
    mecanismeMarketing: "Les programmes de fidelite fonctionnent selon plusieurs mecanismes : accumulation de points echangeables, statuts par paliers (bronze, argent, or) avec avantages croissants, cashback, avantages exclusifs (ventes privees, acces anticipe). La fidelisation induite utilise les couts de transfert (switching costs) : ecosysteme technologique (Apple), contrat d'engagement (operateurs), habitude (reseau social). Le CRM permet de personnaliser les actions de fidelisation grace aux donnees clients. La LTV justifie l'investissement en fidelisation : un client fidele qui genere 500 euros/an pendant 10 ans vaut 5000 euros.",
    exemples: [
      { marque: "Sephora", description: "Le programme Beauty Insider de Sephora est un modele de fidelisation a paliers : Insider (gratuit), VIB (350 euros/an), Rouge (1000 euros/an). Chaque palier debloq des avantages croissants : remises exclusives, livraison gratuite, acces aux ventes privees, cadeaux d'anniversaire. Le programme fidelise 25 millions de membres qui generent 80% du CA." },
      { marque: "Apple", description: "Apple pratique la fidelisation induite par excellence : l'ecosysteme ferme (iPhone, Mac, iPad, Apple Watch, AirPods, iCloud) cree des couts de transfert enorme. Changer pour Android impliquerait de perdre ses photos iCloud, ses applis payantes, la compatibilite entre appareils. Le taux de retention des utilisateurs iPhone depasse 90%." }
    ],
    liensAutresConcepts: ["satisfaction-client", "crm", "valeur-percue", "promotion-ventes"],
    prerequis: ["satisfaction-client", "valeur-percue"],
    complementaires: ["crm", "promotion-ventes"],
    prolongements: ["parcours-client-digital", "community-management"],
    pistesDargumentation: [
      "Comparer fidelisation induite et fidelisation recherchee : laquelle est la plus durable et ethique ?",
      "Montrer que fideliser un client coute 5 a 7 fois moins cher que d'en acquerir un nouveau (chiffres et exemples)",
      "Analyser le concept de valeur vie client (LTV) et son impact sur les investissements marketing",
      "Discuter si les programmes de fidelite a points sont encore efficaces ou si le consommateur est lasse"
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
    definition: "Le CRM (Customer Relationship Management) designe l'ensemble des strategies, outils et technologies utilises pour gerer et analyser les interactions avec les clients tout au long de leur cycle de vie. L'objectif est de centraliser les informations clients, personnaliser la relation et optimiser la satisfaction et la fidelite. Le CRM est a la fois une philosophie (orientation client) et un outil technologique (logiciel de base de donnees).",
    explicationSimple: "Le CRM, c'est le cerveau de la relation client. C'est un systeme qui se souvient de tout : ce que tu as achete, quand, combien, ce que tu as demande au service client, tes preferences. Grace a ces donnees, l'entreprise peut t'envoyer la bonne offre au bon moment. Quand Amazon te dit 'les clients qui ont achete ceci ont aussi achete cela', c'est du CRM.",
    mecanismeMarketing: "Le CRM fonctionne en 4 etapes : collecte des donnees (achats, navigation, interactions service client, reseaux sociaux), stockage centralise (base de donnees unifiee), analyse (segmentation, scoring, predictions par IA) et action (campagnes personnalisees, offres ciblees, alertes). Les solutions CRM leaders (Salesforce, HubSpot, Microsoft Dynamics) permettent de gerer des millions de contacts et d'automatiser les campagnes marketing. Le CRM pose des enjeux de protection des donnees personnelles reglementes par le RGPD en Europe.",
    exemples: [
      { marque: "Salesforce", description: "Salesforce est le leader mondial du CRM avec plus de 150 000 entreprises clientes. La plateforme centralise les contacts, les opportunites commerciales, les interactions et permet d'automatiser les campagnes marketing. Son IA (Einstein) predit les comportements d'achat et recommande les meilleures actions commerciales. Salesforce illustre que le CRM est devenu un outil strategique indispensable." },
      { marque: "Netflix", description: "Netflix utilise un CRM ultra-sophistique base sur l'IA : chaque interaction (film regarde, pause, rewind, abandon) alimente l'algorithme de recommandation. Le systeme personnalise non seulement les recommandations, mais aussi les vignettes affichees (une meme serie a des visuels differents selon ton profil). Ce CRM algorithmique reduit le churn de 30%." }
    ],
    liensAutresConcepts: ["fidelisation", "marketing-masse-differencie", "parcours-client-digital", "satisfaction-client"],
    prerequis: ["fidelisation", "segmentation"],
    complementaires: ["parcours-client-digital", "marketing-masse-differencie"],
    prolongements: ["kpi-communication", "community-management"],
    pistesDargumentation: [
      "Montrer comment le CRM permet la personnalisation a grande echelle de la relation client",
      "Analyser le role du big data et de l'IA dans l'evolution du CRM (CRM predictif, conversationnel)",
      "Discuter les enjeux RGPD lies a la collecte et l'utilisation des donnees personnelles par les CRM",
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
    definition: "Le parcours client digital decrit les differentes etapes que traverse le consommateur en ligne, du besoin initial a l'apres-achat. Il comporte 5 phases : reconnaissance du besoin, recherche d'informations, evaluation des alternatives, decision d'achat et comportement post-achat. A chaque etape, des outils digitaux accompagnent et influencent le consommateur (moteurs de recherche, reseaux sociaux, comparateurs, chatbots, emails).",
    explicationSimple: "C'est tout le chemin que tu fais en ligne quand tu achetes quelque chose. Tu as besoin de nouveaux ecouteurs (besoin), tu cherches sur Google et YouTube (recherche), tu compares sur Amazon et tu lis les avis (evaluation), tu achetes (decision), et ensuite tu laisses un avis et tu recois des emails de recommandation (post-achat). A chaque etape, des outils digitaux sont la pour te guider.",
    mecanismeMarketing: "A chaque phase, l'entreprise utilise des leviers digitaux specifiques. Phase besoin : publicite display, reseaux sociaux, SEA. Phase recherche : SEO, blog, tutoriels YouTube, avis en ligne. Phase evaluation : comparateurs, retargeting, chatbot, avis detailles. Phase achat : UX du site, facilite de paiement, promotions. Phase post-achat : email de suivi, demande d'avis, cross-selling, programme de fidelite. Le tunnel de conversion (funnel) permet de mesurer le taux de passage d'une etape a l'autre et d'identifier les points de friction. L'objectif est de reduire les abandons a chaque etape.",
    exemples: [
      { marque: "Airbnb", description: "Le parcours Airbnb est entierement digital : inspiration sur Instagram (besoin), recherche sur l'appli avec filtres precis (recherche), comparaison des annonces et lecture des avis (evaluation), reservation instantanee avec paiement securise (achat), puis avis reciproque hote-voyageur et recommendations personnalisees (post-achat). Chaque etape est optimisee pour reduire la friction." },
      { marque: "Zalando", description: "Zalando accompagne tout le parcours digital : publicites Instagram ciblees (besoin), moteur de recherche par style et IA de recommandation (recherche), zoom haute definition et avis detailles (evaluation), essayage gratuit a domicile et retour sous 100 jours (achat), puis campagnes emailing personnalisees et programme Zalando Plus (post-achat)." }
    ],
    liensAutresConcepts: ["ropo-omnicanal", "experience-consommation", "crm", "e-commerce"],
    prerequis: ["experience-consommation", "e-commerce"],
    complementaires: ["ropo-omnicanal", "crm"],
    prolongements: ["kpi-communication", "community-management"],
    pistesDargumentation: [
      "Decrire les 5 phases du parcours client digital avec un exemple concret d'achat",
      "Analyser les outils digitaux qui accompagnent le consommateur a chaque etape du parcours",
      "Montrer comment les entreprises utilisent le tracking et les cookies pour optimiser le parcours (et les enjeux RGPD)",
      "Discuter si le parcours client digital est lineaire ou s'il est devenu chaotique (messy middle de Google)"
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
    definition: "Le community management consiste a gerer et animer la communaute d'une marque sur les reseaux sociaux et les espaces en ligne. Il englobe le brand content (creation de contenu de valeur au nom de la marque), le storytelling (raconter une histoire pour creer un lien emotionnel), le social selling (utiliser les reseaux sociaux pour vendre) et l'inbound marketing (attirer les clients par du contenu plutot que par de la publicite intrusive).",
    explicationSimple: "Le community manager, c'est la voix de la marque sur les reseaux sociaux. Il poste du contenu, repond aux commentaires, cree du buzz et gere les crises. Quand Netflix France fait une blague sur Twitter qui fait 50 000 likes, c'est du community management reussi. L'objectif : creer une communaute engagee qui parle de la marque spontanement.",
    mecanismeMarketing: "Le brand content cree de la valeur pour l'audience (tutoriels, behind the scenes, humour) sans etre directement promotionnel. Le storytelling construit un recit autour de la marque qui suscite l'identification et l'emotion. Le social selling utilise les reseaux pour generer des leads et des ventes (via Instagram Shopping, TikTok Shop). L'inbound marketing attire naturellement les prospects par du contenu SEO, des articles de blog, des newsletters. Le community manager mesure son impact en termes d'engagement (likes, commentaires, partages), de portee et de sentiment.",
    exemples: [
      { marque: "Netflix France", description: "Le community management de Netflix France est un cas d'ecole : ton humoristique et decale, references a la pop culture, interactions avec les abonnes, threads creatifs. Le compte Twitter genere des millions d'impressions gratuites (earned media) grace a la viralite des posts. Le CM de Netflix est devenu une star a part entiere." },
      { marque: "GoPro", description: "GoPro a bati sa strategie de community management sur le User Generated Content (UGC) : la marque repartage les videos tournees par ses utilisateurs avec la hashtag #GoPro. Resultat : des millions de contenus gratuits, authentiques et inspirants qui sont plus credibles que n'importe quelle publicite. La communaute GoPro est a la fois cliente et ambassadrice." }
    ],
    liensAutresConcepts: ["e-reputation", "marketing-influence", "buzz-viral", "poem"],
    prerequis: ["communication-commerciale", "poem"],
    complementaires: ["marketing-influence", "e-reputation"],
    prolongements: ["buzz-viral", "kpi-communication"],
    pistesDargumentation: [
      "Analyser le role du community manager dans la construction de l'image de marque sur les reseaux sociaux",
      "Montrer comment le brand content cree de la valeur sans etre directement promotionnel",
      "Discuter la frontiere entre contenu et publicite deguisee : le community management est-il de la manipulation ?",
      "Comparer les strategies de community management de 2 marques concurrentes (ex : Netflix vs Disney+)"
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
    definition: "Le marketing d'influence consiste a collaborer avec des personnalites influentes sur les reseaux sociaux (influenceurs) pour promouvoir un produit ou service aupres de leur communaute. On distingue les macro-influenceurs (+ de 100 000 abonnes, forte portee), les micro-influenceurs (10 000 a 100 000, fort engagement) et les nano-influenceurs (moins de 10 000, tres forte proximite). L'influenceur agit comme un prescripteur credible car sa recommandation est percue comme authentique.",
    explicationSimple: "Les marques paient des influenceurs pour recommander leurs produits parce que quand ton YouTubeur prefere dit 'ce produit est genial', tu y crois plus que si tu le vois dans une pub TV. L'influenceur, c'est le nouveau prescripteur. Mais attention, depuis 2023, la loi en France oblige a afficher clairement quand c'est un partenariat paye (#pub, #ad).",
    mecanismeMarketing: "La marque identifie des influenceurs dont l'audience correspond a sa cible, negocie un partenariat (produit offert, remuneration, code promo, affiliation) et co-cree du contenu (test produit, unboxing, tutoriel, placement). Les micro-influenceurs ont souvent un meilleur ROI car leur taux d'engagement est plus eleve (5-10% vs 1-3% pour les macro). La loi francaise du 9 juin 2023 encadre l'influence commerciale : obligation de mention 'publicite', interdiction de promouvoir certains produits (chirurgie esthetique, paris sportifs aux mineurs). Le marche mondial du marketing d'influence est estime a plus de 20 milliards de dollars.",
    exemples: [
      { marque: "Daniel Wellington", description: "Daniel Wellington est devenue une marque horlogere mondiale quasi exclusivement grace au marketing d'influence. La strategie : envoyer des montres gratuites a des milliers de micro-influenceurs Instagram avec un code promo personnalise. Zero pub TV, zero magasin physique, mais un CA de plus de 200 millions d'euros grace aux influenceurs." },
      { marque: "Maybelline x TikTok", description: "Maybelline a lance un mascara devenu viral grace aux influenceuses beaute TikTok. Un seul post de la macro-influenceuse Mikayla Nogueira a genere plus de 50 millions de vues. La strategie combinait macro-influenceuses pour la portee et micro-influenceuses pour la credibilite, creant un effet 'tout le monde en parle'." }
    ],
    liensAutresConcepts: ["community-management", "buzz-viral", "e-reputation", "poem"],
    prerequis: ["community-management", "poem"],
    complementaires: ["buzz-viral", "e-reputation"],
    prolongements: ["kpi-communication"],
    pistesDargumentation: [
      "Comparer l'efficacite du marketing d'influence vs la publicite traditionnelle pour toucher les jeunes",
      "Analyser les enjeux de transparence et d'ethique du marketing d'influence (loi du 9 juin 2023)",
      "Montrer pourquoi les micro-influenceurs ont souvent un meilleur ROI que les macro-influenceurs",
      "Discuter si le marketing d'influence est encore credible quand les consommateurs savent que l'influenceur est paye"
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
    definition: "Le buzz designe un phenomene de bouche-a-oreille amplifie, souvent declenche par un evenement spectaculaire ou surprenant. Le marketing viral vise a creer un contenu qui se propage 'comme un virus' de personne a personne sur les reseaux sociaux. Le bouche-a-oreille (word of mouth) reste la source d'information la plus fiable pour les consommateurs, mais il comporte un risque : le bad buzz, propagation negative et incontrolable.",
    explicationSimple: "Le buzz, c'est quand tout le monde parle de quelque chose en meme temps. Ca peut etre positif (la video Old Spice qui fait 60 millions de vues) ou negatif (un bad buzz quand une marque fait une gaffe). Le marketing viral, c'est le reve de toute marque : creer un contenu tellement bon/drole/choquant que les gens le partagent spontanement. C'est de la pub gratuite, mais on ne peut pas forcer la viralite.",
    mecanismeMarketing: "Le contenu viral repose sur des declencheurs emotionnels : humour, surprise, indignation, inspiration, identification. Les mecanismes de propagation sont le partage social (reseaux sociaux), le forwarding (email, messagerie) et le bouche-a-oreille physique. Le buzz peut etre planifie (campagne desisnee pour devenir virale) ou spontane (reaction imprevue du public). Le bad buzz se propage 7 fois plus vite qu'un buzz positif. La gestion de crise est essentielle : repondre vite, etre transparent et ne pas tenter d'etouffer le bad buzz.",
    exemples: [
      { marque: "Old Spice", description: "La campagne 'The Man Your Man Could Smell Like' d'Old Spice est un cas d'ecole de marketing viral : une video humoristique avec Isaiah Mustafa qui a cumule plus de 60 millions de vues sur YouTube. La marque a ensuite repondu en video aux commentaires des internautes, creant un buzz viral interactif qui a booste les ventes de 107%." },
      { marque: "Balenciaga", description: "Balenciaga genere regulierement du buzz (positif ou negatif) avec des produits volontairement provocants : sac poubelle a 1800 euros, baskets 'detruites' a 1250 euros. La strategie est deliberee : chaque polemique genere des millions d'impressions gratuites et renforce le positionnement avant-gardiste de la marque. Mais le bad buzz de la campagne mettant en scene des enfants en 2022 a montre les limites de cette strategie." }
    ],
    liensAutresConcepts: ["e-reputation", "community-management", "marketing-influence", "poem"],
    prerequis: ["community-management", "poem"],
    complementaires: ["marketing-influence", "e-reputation"],
    prolongements: [],
    pistesDargumentation: [
      "Analyser les ingredients d'un buzz reussi et les mecanismes de la viralite en ligne",
      "Comparer buzz positif et bad buzz : comment une marque peut-elle se remettre d'un bad buzz ?",
      "Montrer que le bouche-a-oreille reste la source d'information la plus credible pour les consommateurs",
      "Discuter si le buzz peut etre planifie ou s'il est par nature impredictible"
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
    definition: "L'e-reputation designe l'image d'une personne, d'une marque ou d'une organisation sur Internet, construite par l'ensemble des contenus publies en ligne (avis, articles, reseaux sociaux, forums). La communication de crise regroupe les strategies mises en place pour gerer un bad buzz ou un evenement negatif qui menace la reputation. Les ad-blockers temoignent de la defiance croissante des consommateurs envers la publicite en ligne.",
    explicationSimple: "Ton e-reputation, c'est ce que Google dit de toi quand on tape ton nom. Pour une marque, c'est pareil : les avis TripAdvisor, les commentaires Instagram, les articles de presse en ligne forment son image numerique. Un seul bad buzz peut detruire des annees de travail en quelques heures. C'est pourquoi les marques surveillent leur e-reputation 24h/24.",
    mecanismeMarketing: "La veille e-reputationnelle utilise des outils (Google Alerts, Mention, Brandwatch) pour surveiller ce qui se dit de la marque en temps reel. En situation normale, la marque encourage les avis positifs, repond aux avis negatifs et produit du contenu de qualite. En situation de crise, 3 strategies s'offrent : reconnaitre et s'excuser (la plus efficace), denier (risque), ou faire diversion (temporaire). Le temps de reaction est crucial : les premieres 24h determinent souvent l'issue de la crise. L'utilisation croissante d'ad-blockers (plus de 40% des internautes) montre une defiance envers la publicite en ligne.",
    exemples: [
      { marque: "United Airlines", description: "En 2017, la video d'un passager traine de force hors d'un avion United Airlines en surreservation est devenue virale en quelques heures. La premiere reaction de la compagnie (minimiser l'incident) a aggrave le bad buzz. L'action a perdu 1,4 milliard de dollars en bourse en 24h. C'est un cas d'ecole de crise d'e-reputation mal geree." },
      { marque: "Decathlon / hijab", description: "Quand Decathlon a annonce la vente d'un hijab de running en 2019, un bad buzz massif a eclate en France. L'enseigne a finalement retire le produit du marche francais. Ce cas illustre comment un choix commercial peut declencher une crise d'e-reputation qui depasse le cadre marketing et entre dans le debat societal." }
    ],
    liensAutresConcepts: ["buzz-viral", "community-management", "satisfaction-client", "marque"],
    prerequis: ["community-management", "buzz-viral"],
    complementaires: ["satisfaction-client", "marque"],
    prolongements: ["kpi-communication"],
    pistesDargumentation: [
      "Montrer que l'e-reputation est un actif strategique aussi important que la reputation physique",
      "Analyser une crise d'e-reputation et les strategies de reponse utilisees (cas United Airlines, H&M, Balenciaga)",
      "Discuter l'impact des ad-blockers sur les strategies de communication digitale des marques",
      "Comparer la gestion d'une crise d'e-reputation dans le secteur du luxe vs le secteur de la grande consommation"
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
    definition: "Les KPI (Key Performance Indicators) de la communication numerique sont des indicateurs mesurables qui permettent d'evaluer l'efficacite des actions marketing en ligne. Les principaux sont : le taux d'ouverture (emailing), le taux de clic (CTR), le taux de conversion, le cout par lead (CPL), le cout par acquisition (CPA), le ROI (retour sur investissement), l'engagement sur les reseaux sociaux (likes, partages, commentaires) et le nombre de followers.",
    explicationSimple: "Les KPI, ce sont les notes de ta communication. Tu as envoye un email ? Le taux d'ouverture te dit combien de personnes l'ont lu. Tu as fait une pub Instagram ? Le taux de clic te dit combien ont clique. Tu as un site e-commerce ? Le taux de conversion te dit combien de visiteurs ont achete. Tout se mesure en digital, c'est la grande difference avec la pub TV ou l'affichage.",
    mecanismeMarketing: "Les KPI permettent d'optimiser les campagnes en temps reel (A/B testing, ajustement du budget, modification du ciblage). Le taux de conversion moyen en e-commerce est de 2-3% (sur 100 visiteurs, 2-3 achetent). Le CTR moyen d'un email marketing est de 2-5%. Le CPL varie enormement selon le secteur (5 euros en B2C, 50-200 euros en B2B). Le ROI = (gains - investissement) / investissement x 100. Google Analytics, les tableaux de bord des reseaux sociaux et les outils de marketing automation fournissent ces KPI en temps reel. L'enjeu est de choisir les bons KPI selon l'objectif (notoriete = impressions, engagement = interactions, conversion = ventes).",
    exemples: [
      { marque: "Google Analytics", description: "Google Analytics est l'outil de mesure de KPI le plus utilise au monde : il fournit en temps reel le nombre de visiteurs, leur provenance, les pages les plus vues, le taux de rebond, le taux de conversion et le parcours de navigation. Ces donnees permettent d'optimiser le site et les campagnes en continu." },
      { marque: "Spotify Wrapped", description: "Spotify Wrapped est un cas brillant ou les KPI deviennent un outil marketing. Chaque annee, Spotify transforme les donnees d'ecoute de ses utilisateurs en contenu partageable (ton artiste le plus ecoute, tes minutes d'ecoute, etc.). Les KPI internes deviennent du contenu viral qui genere des millions de partages gratuits sur les reseaux sociaux." }
    ],
    liensAutresConcepts: ["communication-commerciale", "community-management", "e-commerce", "crm"],
    prerequis: ["communication-commerciale", "e-commerce"],
    complementaires: ["community-management", "crm"],
    prolongements: [],
    pistesDargumentation: [
      "Montrer comment les KPI permettent d'optimiser les campagnes de communication en temps reel",
      "Comparer les KPI pertinents selon l'objectif de communication (notoriete vs engagement vs conversion)",
      "Discuter la fiabilite des KPI : un nombre eleve de likes signifie-t-il reellement un succes commercial ?",
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
