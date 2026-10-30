'use client';

import React from 'react';

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  // Lenis disabled for now; will be re-enabled on desktop only in Phase 6
  return <>{children}</>;
}
