'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Eagerly loaded components (above the fold)
import HeroSection from '@/components/hero/HeroSection';
const Preloader = dynamic(() => import('@/components/ui/Preloader'), { ssr: false });

// Lazy loaded components (below the fold)
const ScrollStorytelling = dynamic(() => import('@/components/sections/ScrollStorytelling'), { ssr: false });
const CollectionShowcase = dynamic(() => import('@/components/sections/CollectionShowcase'), { ssr: false });
const PackDiscoverySection = dynamic(() => import('@/components/sections/PackDiscoverySection'), { ssr: false });
const MenCollection = dynamic(() => import('@/components/sections/MenCollection'), { ssr: false });
const WomenCollection = dynamic(() => import('@/components/sections/WomenCollection'), { ssr: false });
const Footer = dynamic(() => import('@/components/sections/Footer'), { ssr: false });
import SectionWipe from '@/components/animations/SectionWipe';

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  return (
    <>
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Hero — always rendered, animations trigger after preloader */}
      <HeroSection />

      {/* Olfactory Worlds — scroll storytelling */}
      <section id="story">
        <ScrollStorytelling />
      </section>

      {/* Collections Showcase — horizontal scroll */}
      <SectionWipe color="var(--color-bg-elevated)">
        <section id="collections">
          <CollectionShowcase />
        </section>
      </SectionWipe>

      {/* Pack Découverte — 5×30ml offer */}
      <SectionWipe color="#1A1612">
        <section id="pack-decouverte">
          <PackDiscoverySection />
        </section>
      </SectionWipe>

      {/* W&A Homme — Men's Collection */}
      <SectionWipe color="#2A1A08">
        <section id="homme">
          <MenCollection />
        </section>
      </SectionWipe>

      {/* W&A Femme — Women's Collection */}
      <SectionWipe color="#3D2024">
        <section id="femme">
          <WomenCollection />
        </section>
      </SectionWipe>

      {/* Footer */}
      <Footer />
    </>
  );
}
