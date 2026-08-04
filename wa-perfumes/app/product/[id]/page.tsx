import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductById, getAllProductIds } from '@/lib/products';
import ProductShowroom from './ProductShowroom';

// Static generation for all product pages
export async function generateStaticParams() {
  const ids = getAllProductIds();
  return ids.map((id) => ({ id }));
}

// Dynamic metadata per product
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} — ${product.collection === 'homme' ? 'W&A Homme' : 'W&A Femme'}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return <ProductShowroom product={product} />;
}
