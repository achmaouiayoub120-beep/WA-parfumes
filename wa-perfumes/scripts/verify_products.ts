import { MEN_PRODUCTS } from '../data/products/men';
import { WOMEN_PRODUCTS } from '../data/products/women';
import { UNISEX_PRODUCTS } from '../data/products/unisex';
import { FRAGRANCE_NOTES } from '../data/products/notes';
import { getProductOlfactoryData, getCardNotes, translateNoteId, getNoteIcon } from '../lib/olfactory';

const allProducts = [...MEN_PRODUCTS, ...WOMEN_PRODUCTS, ...UNISEX_PRODUCTS];

console.log(`\n======================================================`);
console.log(`VERIFICATION DES PRODUITS (${allProducts.length} produits trouvés)`);
console.log(`======================================================\n`);

interface ProductSummary {
  id: string;
  name: string;
  inspiredBy: string;
  category: string;
  dataType: 'pyramide' | 'notes principales' | 'aucune';
  topCount: number;
  heartCount: number;
  baseCount: number;
  mainCount: number;
  totalNotes: number;
  untranslatedNotes: string[];
  cardNotes: string[];
}

const summaries: ProductSummary[] = [];
const noDataProducts: {
  id: string;
  name: string;
  inspiredBy: string;
  legacyNotes: { top: string[]; heart: string[]; base: string[] };
}[] = [];

for (const p of allProducts) {
  const cardNotes = getCardNotes(p);
  
  let dataType: 'pyramide' | 'notes principales' | 'aucune' = 'aucune';
  let topCount = 0;
  let heartCount = 0;
  let baseCount = 0;
  let mainCount = 0;
  const untranslated: string[] = [];

  if (p.pyramid) {
    dataType = 'pyramide';
    topCount = p.pyramid.top?.length || 0;
    heartCount = p.pyramid.heart?.length || 0;
    baseCount = p.pyramid.base?.length || 0;
  } else if (p.mainNotes) {
    dataType = 'notes principales';
    mainCount = p.mainNotes.length;
  } else {
    dataType = 'aucune';
    topCount = p.topNotes?.length || 0;
    heartCount = p.heartNotes?.length || 0;
    baseCount = p.baseNotes?.length || 0;
    
    // Check legacy translation
    const allLegacy = [...(p.topNotes || []), ...(p.heartNotes || []), ...(p.baseNotes || [])];
    for (const n of allLegacy) {
      const found = FRAGRANCE_NOTES.find(fn => fn.id === n || fn.name.toLowerCase() === n.toLowerCase());
      if (!found) {
        untranslated.push(n);
      }
    }

    noDataProducts.push({
      id: p.id,
      name: p.name,
      inspiredBy: p.inspiredBy,
      legacyNotes: {
        top: (p.topNotes || []).map(id => translateNoteId(id)),
        heart: (p.heartNotes || []).map(id => translateNoteId(id)),
        base: (p.baseNotes || []).map(id => translateNoteId(id)),
      }
    });
  }

  summaries.push({
    id: p.id,
    name: p.name,
    inspiredBy: p.inspiredBy,
    category: p.category,
    dataType,
    topCount,
    heartCount,
    baseCount,
    mainCount,
    totalNotes: topCount + heartCount + baseCount + mainCount,
    untranslatedNotes: untranslated,
    cardNotes,
  });
}

// Print markdown table
console.log('| ID | Nom | Inspiré de | Type | Tête | Cœur | Fond | Princ. | Notes Cartes (2-3 notes) |');
console.log('|---|---|---|---|:---:|:---:|:---:|:---:|---|');
for (const s of summaries) {
  const t = s.topCount ? s.topCount.toString() : '-';
  const h = s.heartCount ? s.heartCount.toString() : '-';
  const b = s.baseCount ? s.baseCount.toString() : '-';
  const m = s.mainCount ? s.mainCount.toString() : '-';
  console.log(`| \`${s.id}\` | **${s.name}** | ${s.inspiredBy} | \`${s.dataType}\` | ${t} | ${h} | ${b} | ${m} | ${s.cardNotes.join(', ')} |`);
}

console.log('\n--- PRODUITS SANS DONNÉES FOURNIES (wa-uni-02 à wa-uni-07) ---');
for (const nd of noDataProducts) {
  console.log(`\n• **${nd.id}** (${nd.name} - Inspiré de ${nd.inspiredBy}) :`);
  console.log(`  - Notes de tête : ${nd.legacyNotes.top.join(', ')}`);
  console.log(`  - Notes de cœur : ${nd.legacyNotes.heart.join(', ')}`);
  console.log(`  - Notes de fond : ${nd.legacyNotes.base.join(', ')}`);
}

// Scent Finder simulation
console.log('\n======================================================');
console.log('TEST DU SCENT FINDER');
console.log('======================================================\n');

const testCases = [
  { label: 'Homme / Frais (Bergamote, Lavande, Accord Marin)', gender: 'homme', mood: 'fresh', notes: ['bergamot', 'lavender', 'marine'] },
  { label: 'Femme / Gourmand & Floral (Vanille, Jasmin, Rose)', gender: 'femme', mood: 'sweet', notes: ['vanilla', 'jasmine', 'rose'] },
  { label: 'Unisexe / Boisé & Ambré (Santal, Cèdre, Ambre)', gender: 'unisexe', mood: 'woody', notes: ['sandalwood', 'cedarwood', 'amber'] },
  { label: 'Tous genres / Épicé & Chaleureux (Cannelle, Cuir, Oud)', gender: 'all', mood: 'warm', notes: ['cinnamon', 'leather', 'oud'] },
];

for (const tc of testCases) {
  console.log(`\nScénario : ${tc.label}`);
  
  const scored = allProducts
    .filter(p => tc.gender === 'all' || p.gender === tc.gender || p.category === tc.gender || tc.gender === 'unisexe')
    .map(p => {
      let score = 0;
      const allProductNotes = [...(p.topNotes || []), ...(p.heartNotes || []), ...(p.baseNotes || [])];
      for (const n of tc.notes) {
        if (allProductNotes.includes(n)) score += 3;
      }
      if (p.mood?.toLowerCase().includes(tc.mood)) score += 2;
      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score);

  const topMatches = scored.slice(0, 3);
  console.log(`Recommandations trouvées (${topMatches.length}) :`);
  for (const m of topMatches) {
    console.log(`  - ${m.product.name} [${m.product.id}] (Score: ${m.score}) -> Inspiré de: ${m.product.inspiredBy}`);
  }
}
