import { FRAGRANCE_NOTES } from '@/data/products/notes';
import type { Pyramid } from '@/data/products/pyramids';

export interface ProductOlfactoryData {
  type: 'pyramid' | 'mainNotes' | 'legacy';
  top: string[];
  heart: string[];
  base: string[];
  mainNotes?: string[];
}

/**
 * Traduit un identifiant de note (ex: 'sandalwood') en français via nameFr de notes.ts.
 */
export function translateNoteId(noteId: string): string {
  if (!noteId) return '';
  const cleanId = noteId.trim().toLowerCase();
  const found = FRAGRANCE_NOTES.find(
    (n) => n.id.toLowerCase() === cleanId || n.name.toLowerCase() === cleanId
  );
  if (found) return found.nameFr;

  // Si non trouvé, formater proprement
  return noteId.charAt(0).toUpperCase() + noteId.slice(1).replace(/-/g, ' ');
}

/**
 * Trouve l'icône (emoji) correspondant à une note (en français ou en identifiant).
 * Si aucune icône n'est trouvée, retourne null (pour afficher un point doré).
 */
export function getNoteIcon(noteStr: string): string | null {
  if (!noteStr) return null;
  const clean = noteStr.trim().toLowerCase();

  // 1. Recherche exacte par ID, nom français ou nom anglais
  const exact = FRAGRANCE_NOTES.find(
    (n) =>
      n.id.toLowerCase() === clean ||
      n.nameFr.toLowerCase() === clean ||
      n.name.toLowerCase() === clean
  );
  if (exact) return exact.icon;

  // 2. Recherche par inclusion de mot-clé (ex: "Lavande de Haute-Provence" -> "Lavande")
  for (const n of FRAGRANCE_NOTES) {
    const fr = n.nameFr.toLowerCase();
    const en = n.name.toLowerCase();
    // Ne matcher que sur des termes de longueur significative (>= 4 caractères) pour éviter les faux positifs
    if (fr.length >= 4 && clean.includes(fr)) return n.icon;
    if (en.length >= 4 && clean.includes(en)) return n.icon;
  }

  // 3. Aucune icône trouvée -> un point doré sera affiché
  return null;
}

/**
 * Extrait les données olfactives complètes d'un produit selon sa configuration.
 * - pyramid : Pyramide officielle complète en 3 niveaux (français)
 * - mainNotes : Notes principales à plat (wa-uni-01 Santal 33)
 * - legacy : Notes historiques traduites en français (wa-uni-02 à wa-uni-07)
 */
export function getProductOlfactoryData(product: {
  pyramid?: Pyramid;
  mainNotes?: string[];
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
}): ProductOlfactoryData {
  if (product.pyramid && product.pyramid.top && product.pyramid.top.length > 0) {
    return {
      type: 'pyramid',
      top: product.pyramid.top,
      heart: product.pyramid.heart || [],
      base: product.pyramid.base || [],
    };
  }

  if (product.mainNotes && product.mainNotes.length > 0) {
    return {
      type: 'mainNotes',
      mainNotes: product.mainNotes,
      top: product.mainNotes.slice(0, 3),
      heart: [],
      base: [],
    };
  }

  return {
    type: 'legacy',
    top: (product.topNotes || []).map(translateNoteId),
    heart: (product.heartNotes || []).map(translateNoteId),
    base: (product.baseNotes || []).map(translateNoteId),
  };
}

/**
 * Retourne 2 à 3 notes de tête (ou notes principales) en français pour les cartes,
 * le méga menu, le panier ou les messages WhatsApp.
 */
export function getCardNotes(
  product: {
    pyramid?: Pyramid;
    mainNotes?: string[];
    topNotes?: string[];
    heartNotes?: string[];
    baseNotes?: string[];
  },
  count = 3
): string[] {
  if (product.pyramid?.top && product.pyramid.top.length > 0) {
    return product.pyramid.top.slice(0, count);
  }

  if (product.mainNotes && product.mainNotes.length > 0) {
    return product.mainNotes.slice(0, count);
  }

  if (product.topNotes && product.topNotes.length > 0) {
    return product.topNotes.map(translateNoteId).slice(0, count);
  }

  return [];
}
