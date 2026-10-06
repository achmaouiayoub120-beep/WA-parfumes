'use client';

import dynamic from 'next/dynamic';

import HeroVideo from "@/components/HeroVideo";
const Preloader = dynamic(() => import('@/components/ui/Preloader'), { ssr: false });
const CollectionShowcase = dynamic(() => import('@/components/sections/CollectionShowcase'), { ssr: false });
const PackDiscoverySection = dynamic(() => import('@/components/sections/PackDiscoverySection'), { ssr: false });
const MenCollection = dynamic(() => import('@/components/sections/MenCollection'), { ssr: false });
const WomenCollection = dynamic(() => import('@/components/sections/WomenCollection'), { ssr: false });
const UnisexCollection = dynamic(() => import('@/components/sections/UnisexCollection'), { ssr: false });
const Footer = dynamic(() => import('@/components/sections/Footer'), { ssr: false });
const SectionWipe = dynamic(() => import('@/components/animations/SectionWipe'), { ssr: false });

export default function HomeContent() {
  return (
    <>
      <Preloader />
      <HeroVideo />
      <SectionWipe color="var(--color-bg-elevated)">
        <section id="collections">
          <CollectionShowcase />
        </section>
      </SectionWipe>
      <SectionWipe color="#1A1020">
        <section id="pack-decouverte">
          <PackDiscoverySection />
        </section>
      </SectionWipe>
      <SectionWipe color="#241323">
        <section id="homme">
          <MenCollection />
        </section>
      </SectionWipe>
      <SectionWipe color="#3D1530">
        <section id="femme">
          <WomenCollection />
        </section>
      </SectionWipe>
      <SectionWipe color="#1A1025">
        <section id="unisexe">
          <UnisexCollection />
        </section>
      </SectionWipe>
      <Footer />
    </>
  );
}
