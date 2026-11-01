// ============================================================================
// W&A PERFUMES — Pyramides olfactives (français)
// ============================================================================
// Clé = id produit (data/products/*.ts). 22 produits sur 29 sont couverts.
// NON COUVERTS (pas de données fournies, ne rien inventer) :
//   wa-uni-02 Oud Satin Mood | wa-uni-03 Neroli Portofino | wa-uni-04 Tobacco Vanille
//   wa-uni-05 Ambre Nuit | wa-uni-06 Terre d'Hermès | wa-uni-07 Not A Perfume
//   (wa-uni-01 Santal 33 : liste de notes SANS niveaux, voir FLAT_NOTES en bas,
//    car la marque ne publie pas de pyramide officielle.)
// Corrections de forme appliquées : fautes de frappe (« Saffran » → « Safran »),
// noms d'ingrédients techniques simplifiés (Ambrofix → Ambre, Serenolide → Musc,
// Amberxtreme → Ambre). Les descriptions courtes sont reformulées sans citer
// de marque ni de produit tiers.
// ============================================================================

export interface Pyramid {
  top: string[];
  heart: string[];
  base: string[];
  /** Famille olfactive, si fournie */
  family?: string;
  /** Ambiance / style, si fourni */
  style?: string;
  /** Description courte neutre, si fournie */
  description?: string;
}

export const PYRAMIDS: Record<string, Pyramid> = {
  // ───────────────────────── HOMME (WA Signature) ─────────────────────────
  "wa-sig-01": {
    top: ["Poivre rose", "Genévrier", "Violette"],
    heart: ["Toffee (caramel)", "Cannelle", "Lavande", "Sauge"],
    base: ["Vanille", "Fève tonka", "Ambre", "Suède"],
  },
  "wa-sig-02": {
    top: ["Lavande", "Menthe"],
    heart: ["Vanille", "Benjoin"],
    base: ["Miel", "Fève tonka", "Tabac"],
  },
  "wa-sig-03": {
    top: ["Poivre noir", "Pamplemousse"],
    heart: ["Cannelle", "Cumin", "Safran"],
    base: ["Vanille", "Tabac", "Notes boisées (cèdre)", "Ambre"],
  },
  "wa-sig-04": {
    top: ["Eau de coco", "Menthe aquatique", "Gingembre", "Notes vertes"],
    heart: ["Figue", "Sel marin", "Fleur d'oranger"],
    base: ["Bois de santal", "Tonka", "Ambre gris"],
  },
  "wa-sig-05": {
    top: ["Cardamome", "Pamplemousse"],
    heart: ["Cuir", "Lavande", "Sauge sclarée"],
    base: ["Tonka", "Bois de santal", "Patchouli", "Vétiver"],
  },
  "wa-sig-06": {
    top: ["Jasmin grandiflorum d'Égypte", "Safran"],
    heart: ["Bois de cèdre", "Accord ambre gris (Ambroxan)"],
    base: ["Accord boisé résineux (sapin baumier)", "Note ambrée boisée"],
  },
  "wa-sig-07": {
    top: ["Lavande de Haute-Provence"],
    heart: ["Iris de Toscane", "Ambrette", "Poire"],
    base: ["Cèdre de Virginie", "Vétiver"],
  },
  "wa-sig-08": {
    top: ["Gingembre rouge"],
    heart: ["Notes boisées"],
    base: ["Absolu de vanille bourbon"],
  },
  "wa-sig-09": {
    top: ["Mandarine", "Pamplemousse"],
    heart: ["Eau de mer", "Genévrier"],
    base: ["Bois d'ambre", "Musc"],
  },
  "wa-sig-10": {
    top: ["Prune mirabelle"],
    heart: ["Châtaigne"],
    base: ["Bois de santal"],
  },
  "wa-sig-11": {
    top: ["Pomme verte", "Davana"],
    heart: ["Rose de Damas", "Osmanthus", "Bois de cèdre"],
    base: ["Absolu de vanille noire", "Fève tonka", "Patchouli"],
  },
  "wa-sig-12": {
    top: ["Cédrat de Calabre", "Bergamote de Calabre", "Orange de Sicile"],
    heart: ["Gingembre du Nigeria", "Néroli de Tunisie", "Cannelle de Ceylan"],
    base: ["Ambroxan", "Thé noir de Chine (Fujian)", "Bois de gaïac", "Encens"],
  },
  "wa-sig-13": {
    top: ["Accords cuirés", "Encens"],
    heart: ["Davana", "Essence de patchouli"],
    base: ["Bois de cèdre", "Myrrhe"],
  },

  // ───────────────────────── FEMME (WA Elegance) ──────────────────────────
  "wa-ele-01": {
    top: ["Fraise", "Mûre"],
    heart: ["Jasmin"],
    base: ["Vanille", "Ambre", "Bois de santal"],
  },
  "wa-ele-02": {
    top: ["Citron de Sicile", "Pomme Granny Smith"],
    heart: ["Souci", "Jasmin"],
    base: ["Bois d'ambre", "Musc"],
  },
  "wa-ele-03": {
    family: "Gourmand boisé",
    style: "Chaleureux, envoûtant, riche et réconfortant",
    top: ["Orchidée de vanille", "Jasmin d'eau"],
    heart: ["Sucre brun", "Notes de bois ambrés"],
    base: ["Gousse de vanille", "Amberwood", "Musc", "Fève tonka", "Patchouli"],
    description:
      "Un chef-d'œuvre gourmand et sophistiqué : l'alliance envoûtante de la vanille riche et du sucre brun fondu, sublimée par la chaleur du bois ambré et la douceur du musc.",
  },
  "wa-ele-04": {
    family: "Ambré floral",
    style: "Sensuel, ardent, sulfureux et mystérieux",
    top: ["Orange sanguine", "Gingembre"],
    heart: ["Tubéreuse", "Fleur d'oranger", "Jasmin"],
    base: ["Feuille de piment", "Patchouli", "Bois de santal"],
    description:
      "Une version incandescente et captivante : un accord rouge épicé de feuille de piment et de gingembre vient enflammer un bouquet de fleurs blanches charnelles (tubéreuse et jasmin), le tout ancré dans un fond boisé profond.",
  },
  "wa-ele-05": {
    top: ["Kiwi", "Rhubarbe", "Poivre rose"],
    heart: ["Pastèque", "Cyclamen", "Jasmin"],
    base: ["Citronnier", "Musc", "Bois de santal"],
  },
  "wa-ele-06": {
    top: ["Poire", "Néroli", "Bergamote"],
    heart: ["Mousse de chêne", "Jasmin", "Fleur d'oranger"],
    base: ["Ambre", "Musc", "Vanille Bourbon", "Accord boisé"],
  },
  "wa-ele-07": {
    top: ["Pêche", "Litchi", "Mandarine", "Bergamote"],
    heart: ["Lys blanc", "Prune", "Jasmin", "Muguet"],
    base: ["Vanille", "Ambre", "Musc", "Vétiver"],
  },
  "wa-ele-08": {
    top: ["Noix de coco", "Pêche blanche"],
    heart: ["Fleur de tiaré", "Ylang-ylang", "Jasmin d'Égypte"],
    base: ["Vanille de Madagascar", "Musc blanc", "Notes boisées"],
  },
  "wa-ele-09": {
    family: "Ambré boisé",
    style: "Envoûtant, élégant, sensuel et affirmé",
    top: ["Orange de Sicile", "Bergamote de Calabre", "Citron"],
    heart: ["Rose", "Jasmin", "Notes fruitées"],
    base: [
      "Patchouli d'Indonésie",
      "Fève tonka",
      "Vanille de Madagascar",
      "Labdanum",
      "Musc blanc",
    ],
    description:
      "Une dose intense de patchouli, enveloppée par la chaleur de la vanille et de la fève tonka, et magnifiée par un cœur floral noble.",
  },
};

// Données fournies mais sans produit correspondant dans le catalogue actuel.
// Non branchées : à utiliser seulement si ces produits sont créés.
export const UNMAPPED_PYRAMIDS: Record<string, Pyramid> = {
  "yum-boujee-marshmallow-81": {
    style: "Gourmand, fruité, crémeux et sucré",
    top: ["Fraise", "Nectarine", "Citron vert"],
    heart: ["Guimauve", "Crème chantilly", "Vanille"],
    base: ["Sucre rose", "Vanille de Madagascar", "Bois de santal"],
  },
  "bleu-parfum": {
    family: "Boisé aromatique",
    style: "Élégant, profond, intense et sophistiqué",
    top: ["Zeste de citron", "Bergamote", "Menthe"],
    heart: ["Lavande", "Géranium", "Notes vertes"],
    base: [
      "Bois de santal de Nouvelle-Calédonie",
      "Cèdre",
      "Bois d'ambre",
      "Fève tonka",
    ],
    description:
      "Une envolée d'agrumes frais qui s'adoucit pour révéler un cœur aromatique noble, sur un fond de bois de santal riche, crémeux et envoûtant.",
  },
};

// Liste de notes sans niveaux (tête / cœur / fond), pour les parfums dont la
// marque ne publie pas de pyramide officielle et dont les sources se contredisent.
// À afficher comme « Notes principales ».
export const FLAT_NOTES: Record<string, string[]> = {
  "wa-uni-01": [
    "Cardamome",
    "Iris",
    "Violette",
    "Ambroxan",
    "Santal d'Australie",
    "Papyrus",
    "Cèdre",
    "Cuir",
  ],
};
