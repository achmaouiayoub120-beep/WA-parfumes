'use client';

import dynamic from 'next/dynamic';

const EasterEgg = dynamic(() => import('@/components/effects/EasterEgg'), { ssr: false });

/**
 * ClientEffects — Wrapper for client-only visual effects
 * that require ssr: false (not allowed in Server Components).
 */
export default function ClientEffects() {
  return (
    <>
      <EasterEgg />
    </>
  );
}
