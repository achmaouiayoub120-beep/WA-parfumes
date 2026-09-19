import type { Metadata } from 'next';
import HomeContent from './HomeContent';

export const metadata: Metadata = {
  title: 'WA Perfumes | Parfums de Luxe Inspirés',
  description: 'Découvrez WA Signature (homme) et WA Elegance (femme) — des parfums de luxe ultra-premium inspirés par les fragrances les plus iconiques. Livraison partout au Maroc.',
};

export default function HomePage() {
  return <HomeContent />;
}
