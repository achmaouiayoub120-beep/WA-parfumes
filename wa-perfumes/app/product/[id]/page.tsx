import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductById, getAllProductIds } from '@/lib/products';
import { UNISEX_PRODUCTS } from '@/data/products/unisex';
import ProductShowroom from './ProductShowroom';

// Static generation for all product pages
export async function generateStaticParams() {
  const ids = getAllProductIds();
  const unisexSlugs = UNISEX_PRODUCTS.map((p) => p.slug);
  const allParams = Array.from(new Set([...ids, ...unisexSlugs]));
  return allParams.map((id) => ({ id }));
}

// Dynamic metadata per product
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} — ${
      product.collection === 'homme'
        ? 'W&A Homme'
        : product.collection === 'unisexe'
        ? 'W&A Unisexe'
        : 'W&A Femme'
    }`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return <ProductShowroom product={product} />;
}
