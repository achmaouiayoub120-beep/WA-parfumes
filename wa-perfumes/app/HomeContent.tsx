import HeroVideo from '@/components/HeroVideo';
import TrustBanner from '@/components/ui/TrustBanner';
import CollectionShowcase from '@/components/sections/CollectionShowcase';
import PackDiscoverySection from '@/components/sections/PackDiscoverySection';
import MenCollection from '@/components/sections/MenCollection';
import WomenCollection from '@/components/sections/WomenCollection';
import UnisexCollection from '@/components/sections/UnisexCollection';
import Footer from '@/components/sections/Footer';
import SectionWipe from '@/components/animations/SectionWipe';
import ClientPreloader from '@/components/ui/ClientPreloader';

export default function HomeContent() {
  return (
    <>
      <ClientPreloader />
      <HeroVideo />
      
      {/* Bandeau de confiance */}
      <TrustBanner />

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
