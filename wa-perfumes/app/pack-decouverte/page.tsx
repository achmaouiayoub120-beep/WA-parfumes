import type { Metadata } from 'next';
import PackDiscoverySection from '@/components/sections/PackDiscoverySection';

export const metadata: Metadata = {
  title: 'Pack Découverte 5×30ml | WA Perfumes',
  description: 'Composez votre coffret découverte avec 5 parfums au choix (30ml) pour 199 DH. Explorez nos collections WA Signature et WA Elegance.',
};

export default function PackDecouvertePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 bg-[var(--color-bg-elevated)] border-b border-[var(--color-border-subtle)]">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <p className="editorial-subtitle text-[var(--color-gold)] mb-4">L'Édition Spéciale</p>
          <h1 className="heading-display text-5xl md:text-7xl text-[var(--color-text)] mb-6">
            Pack Découverte
          </h1>
          <p className="body-large text-[var(--color-text-muted)] max-w-2xl mx-auto mb-8">
            Plongez dans l'univers de WA Perfumes. Sélectionnez 5 créations parmi nos collections Signature et Elegance pour composer un coffret sur-mesure. Une expérience olfactive luxueuse, conçue pour vous.
          </p>
          <div className="inline-block bg-[var(--color-bg)] border border-[var(--color-gold-muted)] px-8 py-3 rounded-full text-[var(--color-gold)] font-medium tracking-wide">
            5 × 30ml — 199 DH
          </div>
        </div>
      </section>

      {/* Selector Section (reused) */}
      <PackDiscoverySection variant="fullscreen" />
    </main>
  );
}
