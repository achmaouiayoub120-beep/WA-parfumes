// ============================================================================
// WA PERFUMES — Fragrance Notes Database
// ============================================================================
// Complete catalog of all fragrance notes used across products.
// Organized by olfactory family for the Perfume Finder and product pages.
// ============================================================================

export interface FragranceNote {
  id: string;
  name: string;
  nameFr: string;
  family: NoteFamily;
  description: string;
  icon: string; // emoji for visual representation
}

export type NoteFamily =
  | 'woody'
  | 'oriental'
  | 'floral'
  | 'fresh'
  | 'citrus'
  | 'spicy'
  | 'gourmand'
  | 'aquatic'
  | 'green'
  | 'musky'
  | 'amber'
  | 'fruity'
  | 'aromatic';

export const NOTE_FAMILIES: Record<NoteFamily, { label: string; labelFr: string; color: string }> = {
  woody:    { label: 'Woody',    labelFr: 'Boisé',     color: '#8B6914' },
  oriental: { label: 'Oriental', labelFr: 'Oriental',   color: '#B8860B' },
  floral:   { label: 'Floral',   labelFr: 'Floral',    color: '#C97B84' },
  fresh:    { label: 'Fresh',    labelFr: 'Frais',     color: '#87CEEB' },
  citrus:   { label: 'Citrus',   labelFr: 'Agrumes',   color: '#FFD700' },
  spicy:    { label: 'Spicy',    labelFr: 'Épicé',     color: '#CD5C5C' },
  gourmand: { label: 'Gourmand', labelFr: 'Gourmand',  color: '#D2691E' },
  aquatic:  { label: 'Aquatic',  labelFr: 'Aquatique', color: '#4682B4' },
  green:    { label: 'Green',    labelFr: 'Vert',      color: '#2E8B57' },
  musky:    { label: 'Musky',    labelFr: 'Musqué',    color: '#C4AEAD' },
  amber:    { label: 'Amber',    labelFr: 'Ambré',     color: '#FFBF00' },
  fruity:   { label: 'Fruity',   labelFr: 'Fruité',    color: '#FF6B6B' },
  aromatic: { label: 'Aromatic', labelFr: 'Aromatique', color: '#6B8E23' },
};

export const FRAGRANCE_NOTES: FragranceNote[] = [
  // ── WOODY ─────────────────────────────────────────────────────
  { id: 'sandalwood',     name: 'Sandalwood',      nameFr: 'Bois de Santal',    family: 'woody',    description: 'Creamy, warm, and exotic wood', icon: '🪵' },
  { id: 'cedar',          name: 'Cedarwood',       nameFr: 'Cèdre',             family: 'woody',    description: 'Dry, pencil-shaving warmth',    icon: '🌲' },
  { id: 'vetiver',        name: 'Vetiver',         nameFr: 'Vétiver',           family: 'woody',    description: 'Earthy, smoky, and complex',     icon: '🌿' },
  { id: 'oud',            name: 'Oud',             nameFr: 'Oud',               family: 'woody',    description: 'Rich, dark, and animalic wood',  icon: '🪵' },
  { id: 'patchouli',      name: 'Patchouli',       nameFr: 'Patchouli',         family: 'woody',    description: 'Dark, earthy, slightly sweet',   icon: '🍂' },
  { id: 'guaiac',         name: 'Guaiac Wood',     nameFr: 'Bois de Gaïac',     family: 'woody',    description: 'Smoky, resinous wood',           icon: '🪵' },
  { id: 'guaiac-wood',    name: 'Guaiac Wood',     nameFr: 'Bois de Gaïac',     family: 'woody',    description: 'Smoky, resinous wood',           icon: '🪵' },
  { id: 'cedarwood',      name: 'Cedarwood',       nameFr: 'Cèdre',             family: 'woody',    description: 'Dry, pencil-shaving warmth',    icon: '🌲' },
  { id: 'wood',           name: 'Woody Notes',     nameFr: 'Notes Boisées',     family: 'woody',    description: 'Warm, dry wood accords',        icon: '🪵' },
  { id: 'iso-e-super',    name: 'Iso E Super',     nameFr: 'Iso E Super',       family: 'woody',    description: 'Velvety cedar-amber skin scent', icon: '🪵' },
  { id: 'birch',          name: 'Birch',           nameFr: 'Bouleau',           family: 'woody',    description: 'Smoky leather-like wood',         icon: '🌳' },

  // ── ORIENTAL ──────────────────────────────────────────────────
  { id: 'amber',          name: 'Amber',           nameFr: 'Ambre',             family: 'oriental', description: 'Warm, resinous, honeyed',        icon: '✨' },
  { id: 'incense',        name: 'Incense',         nameFr: 'Encens',            family: 'oriental', description: 'Sacred, smoky, mystical',         icon: '🕯️' },
  { id: 'myrrh',          name: 'Myrrh',           nameFr: 'Myrrhe',            family: 'oriental', description: 'Balsamic, warm, slightly bitter', icon: '🫧' },
  { id: 'benzoin',        name: 'Benzoin',         nameFr: 'Benjoin',           family: 'oriental', description: 'Sweet balsamic vanilla',          icon: '🍯' },
  { id: 'tobacco',        name: 'Tobacco',         nameFr: 'Tabac',             family: 'oriental', description: 'Warm, sweet, smoky leaves',      icon: '🍂' },
  { id: 'labdanum',       name: 'Labdanum',        nameFr: 'Labdanum',          family: 'oriental', description: 'Deep, resinous, warm ambery note', icon: '✨' },
  { id: 'ambroxan',       name: 'Ambroxan',        nameFr: 'Ambroxan',          family: 'oriental', description: 'Sensual, velvety ambery warmth',  icon: '✨' },

  // ── FLORAL ────────────────────────────────────────────────────
  { id: 'rose',           name: 'Rose',            nameFr: 'Rose',              family: 'floral',   description: 'Classic, romantic, velvety',      icon: '🌹' },
  { id: 'jasmine',        name: 'Jasmine',         nameFr: 'Jasmin',            family: 'floral',   description: 'Rich, intoxicating white floral', icon: '🌸' },
  { id: 'tuberose',       name: 'Tuberose',        nameFr: 'Tubéreuse',         family: 'floral',   description: 'Creamy, heady, narcotic',         icon: '🌺' },
  { id: 'iris',           name: 'Iris',            nameFr: 'Iris',              family: 'floral',   description: 'Powdery, elegant, refined',       icon: '💜' },
  { id: 'violet',         name: 'Violet',          nameFr: 'Violette',          family: 'floral',   description: 'Delicate, powdery floral',        icon: '💜' },
  { id: 'lavender',       name: 'Lavender',        nameFr: 'Lavande',           family: 'floral',   description: 'Herbal, clean, aromatic',         icon: '💐' },
  { id: 'orange-blossom', name: 'Orange Blossom',  nameFr: 'Fleur d\'Oranger',  family: 'floral',   description: 'Fresh, creamy, honeyed floral',   icon: '🌼' },
  { id: 'neroli',         name: 'Neroli',          nameFr: 'Néroli',            family: 'floral',   description: 'Radiant, fresh bitter-orange blossoms', icon: '🌼' },
  { id: 'ylang-ylang',    name: 'Ylang-Ylang',     nameFr: 'Ylang-Ylang',       family: 'floral',   description: 'Exotic, sweet, tropical floral',  icon: '🌺' },
  { id: 'peony',          name: 'Peony',           nameFr: 'Pivoine',           family: 'floral',   description: 'Soft, fresh, light floral',       icon: '🌸' },
  { id: 'geranium',       name: 'Geranium',        nameFr: 'Géranium',          family: 'floral',   description: 'Aromatic, green rosy floral',     icon: '🌸' },

  // ── FRESH ─────────────────────────────────────────────────────
  { id: 'mint',           name: 'Mint',            nameFr: 'Menthe',            family: 'fresh',    description: 'Cool, invigorating, clean',       icon: '🍃' },
  { id: 'eucalyptus',     name: 'Eucalyptus',      nameFr: 'Eucalyptus',        family: 'fresh',    description: 'Camphoraceous, clean, sharp',     icon: '🌿' },
  { id: 'flint',          name: 'Flint',           nameFr: 'Silex',             family: 'fresh',    description: 'Mineral, flinty, earthy stone',   icon: '🪨' },
  { id: 'aldehydes',      name: 'Aldehydes',       nameFr: 'Aldéhydes',         family: 'fresh',    description: 'Sparkling, airy, crystalline',    icon: '✨' },

  // ── CITRUS ────────────────────────────────────────────────────
  { id: 'bergamot',       name: 'Bergamot',        nameFr: 'Bergamote',         family: 'citrus',   description: 'Bright, bitter-sweet citrus',     icon: '🍊' },
  { id: 'lemon',          name: 'Lemon',           nameFr: 'Citron',            family: 'citrus',   description: 'Sharp, zesty, sparkling',         icon: '🍋' },
  { id: 'citron',         name: 'Citron',          nameFr: 'Cédrat',            family: 'citrus',   description: 'Dry, elegant, sun-drenched citrus', icon: '🍋' },
  { id: 'grapefruit',     name: 'Grapefruit',      nameFr: 'Pamplemousse',      family: 'citrus',   description: 'Tart, juicy, energizing',         icon: '🍊' },
  { id: 'mandarin',       name: 'Mandarin',        nameFr: 'Mandarine',         family: 'citrus',   description: 'Sweet, juicy, tangy',             icon: '🍊' },
  { id: 'blood-orange',   name: 'Blood Orange',    nameFr: 'Orange Sanguine',   family: 'citrus',   description: 'Rich, slightly bitter citrus',    icon: '🍊' },

  // ── SPICY ─────────────────────────────────────────────────────
  { id: 'cinnamon',       name: 'Cinnamon',        nameFr: 'Cannelle',          family: 'spicy',    description: 'Warm, sweet, fiery spice',        icon: '🫚' },
  { id: 'cardamom',       name: 'Cardamom',        nameFr: 'Cardamome',         family: 'spicy',    description: 'Aromatic, warm, slightly sweet',  icon: '🌿' },
  { id: 'pepper',         name: 'Black Pepper',    nameFr: 'Poivre Noir',       family: 'spicy',    description: 'Sharp, warm, pungent',            icon: '🌶️' },
  { id: 'pink-pepper',    name: 'Pink Pepper',     nameFr: 'Poivre Rose',       family: 'spicy',    description: 'Spicy, sparkling, berry-like',    icon: '🌸' },
  { id: 'saffron',        name: 'Saffron',         nameFr: 'Safran',            family: 'spicy',    description: 'Metallic, leathery, exotic',      icon: '🧡' },
  { id: 'ginger',         name: 'Ginger',          nameFr: 'Gingembre',         family: 'spicy',    description: 'Fresh, spicy, slightly sweet',    icon: '🫚' },
  { id: 'nutmeg',         name: 'Nutmeg',          nameFr: 'Muscade',           family: 'spicy',    description: 'Warm, sweet, aromatic',            icon: '🥜' },
  { id: 'clove',          name: 'Clove',           nameFr: 'Girofle',           family: 'spicy',    description: 'Warm, sweet, numbing spice',      icon: '🌿' },
  { id: 'spices',         name: 'Spices',          nameFr: 'Épices',            family: 'spicy',    description: 'Rich, warm, aromatic spice blend', icon: '🌶️' },

  // ── GOURMAND ──────────────────────────────────────────────────
  { id: 'vanilla',        name: 'Vanilla',         nameFr: 'Vanille',           family: 'gourmand', description: 'Sweet, creamy, comforting',       icon: '🍦' },
  { id: 'tonka',          name: 'Tonka Bean',      nameFr: 'Fève Tonka',        family: 'gourmand', description: 'Almond-like, warm, sweet',        icon: '🫘' },
  { id: 'caramel',        name: 'Caramel',         nameFr: 'Caramel',           family: 'gourmand', description: 'Buttery, sweet, indulgent',       icon: '🍬' },
  { id: 'chocolate',      name: 'Chocolate',       nameFr: 'Chocolat',          family: 'gourmand', description: 'Rich, bitter-sweet, luxurious',   icon: '🍫' },
  { id: 'cacao',          name: 'Cacao',           nameFr: 'Cacao',             family: 'gourmand', description: 'Raw, bitter, aromatic cocoa',     icon: '🍫' },
  { id: 'coffee',         name: 'Coffee',          nameFr: 'Café',              family: 'gourmand', description: 'Dark, roasted, energizing',       icon: '☕' },
  { id: 'honey',          name: 'Honey',           nameFr: 'Miel',              family: 'gourmand', description: 'Sweet, warm, golden',             icon: '🍯' },
  { id: 'praline',        name: 'Praline',         nameFr: 'Praliné',           family: 'gourmand', description: 'Nutty, caramelized, sweet',       icon: '🥜' },
  { id: 'coconut',        name: 'Coconut',         nameFr: 'Noix de Coco',      family: 'gourmand', description: 'Tropical, creamy, sweet',         icon: '🥥' },

  // ── AQUATIC ───────────────────────────────────────────────────
  { id: 'sea-salt',       name: 'Sea Salt',        nameFr: 'Sel Marin',         family: 'aquatic',  description: 'Mineral, briny, fresh',           icon: '🌊' },
  { id: 'marine',         name: 'Marine Accord',   nameFr: 'Accord Marin',      family: 'aquatic',  description: 'Oceanic, breezy, clean',          icon: '🌊' },
  { id: 'ambergris',      name: 'Ambergris',       nameFr: 'Ambre Gris',        family: 'aquatic',  description: 'Salty, musky, oceanic warmth',    icon: '🐚' },

  // ── GREEN ─────────────────────────────────────────────────────
  { id: 'green-apple',    name: 'Green Apple',     nameFr: 'Pomme Verte',       family: 'green',    description: 'Crisp, fresh, juicy',             icon: '🍏' },
  { id: 'basil',          name: 'Basil',           nameFr: 'Basilic',           family: 'green',    description: 'Aromatic, herbal, slightly sweet', icon: '🌿' },
  { id: 'fig-leaf',       name: 'Fig Leaf',        nameFr: 'Feuille de Figuier', family: 'green',   description: 'Green, milky, woody',             icon: '🍃' },

  // ── MUSKY ─────────────────────────────────────────────────────
  { id: 'musk',           name: 'White Musk',      nameFr: 'Musc Blanc',        family: 'musky',    description: 'Clean, soft, skin-like',          icon: '🤍' },
  { id: 'cashmeran',      name: 'Cashmeran',       nameFr: 'Cashméran',         family: 'musky',    description: 'Warm, woody-musky, velvety',      icon: '🧶' },
  { id: 'leather',        name: 'Leather',         nameFr: 'Cuir',              family: 'musky',    description: 'Smoky, animalic, refined',        icon: '👞' },
  { id: 'suede',          name: 'Suede',           nameFr: 'Daim',              family: 'musky',    description: 'Soft, powdery, velvety leather',  icon: '🤎' },

  // ── FRUITY ────────────────────────────────────────────────────
  { id: 'raspberry',      name: 'Raspberry',       nameFr: 'Framboise',         family: 'fruity',   description: 'Sweet, tart, juicy berry',        icon: '🍇' },
  { id: 'peach',          name: 'Peach',           nameFr: 'Pêche',             family: 'fruity',   description: 'Juicy, sweet, velvety',           icon: '🍑' },
  { id: 'pear',           name: 'Pear',            nameFr: 'Poire',             family: 'fruity',   description: 'Crisp, sweet, delicate',          icon: '🍐' },
  { id: 'blackcurrant',   name: 'Blackcurrant',    nameFr: 'Cassis',            family: 'fruity',   description: 'Tart, deep, berry sweetness',     icon: '🫐' },
  { id: 'plum',           name: 'Plum',            nameFr: 'Prune',             family: 'fruity',   description: 'Rich, sweet, slightly tart',      icon: '🍇' },
  { id: 'apple',          name: 'Apple',           nameFr: 'Pomme',             family: 'fruity',   description: 'Crisp, fresh, fruity',            icon: '🍎' },
  { id: 'lychee',         name: 'Lychee',          nameFr: 'Litchi',            family: 'fruity',   description: 'Sweet, exotic, floral-fruity',    icon: '🍒' },
  { id: 'dried-fruits',   name: 'Dried Fruits',    nameFr: 'Fruits Secs',       family: 'fruity',   description: 'Sweet, rich concentrated fruits', icon: '🍇' },

  // ── AROMATIC ──────────────────────────────────────────────────
  { id: 'rosemary',       name: 'Rosemary',        nameFr: 'Romarin',           family: 'aromatic', description: 'Fresh, herbaceous, pine-like',   icon: '🌿' },
];

// Helper function to get notes by IDs
export function getNotesByIds(ids: string[]): FragranceNote[] {
  return ids.map(id => FRAGRANCE_NOTES.find(n => n.id === id)).filter(Boolean) as FragranceNote[];
}

// Helper function to get notes by family
export function getNotesByFamily(family: NoteFamily): FragranceNote[] {
  return FRAGRANCE_NOTES.filter(n => n.family === family);
}
