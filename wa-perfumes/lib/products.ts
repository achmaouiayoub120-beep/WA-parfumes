import { MEN_PRODUCTS } from '@/data/products/men';
import { WOMEN_PRODUCTS } from '@/data/products/women';
import { UNISEX_PRODUCTS } from '@/data/products/unisex';
import { Product } from '@/data/products/men';

export function getProductById(id: string): Product | undefined {
  const allProducts = [...MEN_PRODUCTS, ...WOMEN_PRODUCTS, ...UNISEX_PRODUCTS];
  return allProducts.find((p) => p.id === id || p.slug === id);
}

export function getAllProductIds(): string[] {
  const allProducts = [...MEN_PRODUCTS, ...WOMEN_PRODUCTS, ...UNISEX_PRODUCTS];
  const ids = allProducts.map((p) => p.id);
  const slugs = allProducts.map((p) => p.slug).filter(Boolean);
  return Array.from(new Set([...ids, ...slugs]));
}

