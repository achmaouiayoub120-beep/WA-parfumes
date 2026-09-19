'use client';

import dynamic from 'next/dynamic';

const Preloader = dynamic(() => import('@/components/ui/Preloader'), { ssr: false });
const HeroSection = dynamic(() => import('@/components/hero/HeroSection'), { ssr: false });
const ScrollStorytelling = dynamic(() => import('@/components/sections/ScrollStorytelling'), { ssr: false });
const CollectionShowcase = dynamic(() => import('@/components/sections/CollectionShowcase'), { ssr: false });
const PackDiscoverySection = dynamic(() => import('@/components/sections/PackDiscoverySection'), { ssr: false });
const MenCollection = dynamic(() => import('@/components/sections/MenCollection'), { ssr: false });
const WomenCollection = dynamic(() => import('@/components/sections/WomenCollection'), { ssr: false });
const Footer = dynamic(() => import('@/components/sections/Footer'), { ssr: false });
const SectionWipe = dynamic(() => import('@/components/animations/SectionWipe'), { ssr: false });

export default function HomeContent() {
  return (
    <>
      <Preloader />
      <HeroSection />
      <section id="story">
        <ScrollStorytelling />
      </section>
      <SectionWipe color="var(--color-bg-elevated)">
        <section id="collections">
          <CollectionShowcase />
        </section>
      </SectionWipe>
      <SectionWipe color="#1A1612">
        <section id="pack-decouverte">
          <PackDiscoverySection />
        </section>
      </SectionWipe>
      <SectionWipe color="#2A1A08">
        <section id="homme">
          <MenCollection />
        </section>
      </SectionWipe>
      <SectionWipe color="#3D2024">
        <section id="femme">
          <WomenCollection />
        </section>
      </SectionWipe>
      <Footer />
    </>
  );
}
