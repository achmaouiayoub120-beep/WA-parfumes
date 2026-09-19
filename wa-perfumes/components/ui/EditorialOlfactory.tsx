import React from 'react';

interface EditorialOlfactoryProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  accentColor: string;
}

export default function EditorialOlfactory({
  topNotes,
  heartNotes,
  baseNotes,
  accentColor,
}: EditorialOlfactoryProps) {
  return (
    <div className="relative w-full py-12 overflow-hidden flex flex-col gap-12">
      {/* Watermark Background Element */}
      <div 
        className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden z-0"
        aria-hidden="true"
      >
        <span 
          className="font-[family-name:var(--font-cormorant)] text-[12rem] lg:text-[18rem] leading-none opacity-[0.02] text-[var(--color-text)] whitespace-nowrap -rotate-12"
        >
          NOTES
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-10">
        
        {/* Tête */}
        <div className="flex flex-col items-end text-right">
          <span className="text-[0.55rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)] mb-2">Tête</span>
          <p className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl font-light text-[var(--color-text)]">
            {topNotes.join(' • ')}
          </p>
          <div className="w-2/3 h-px mt-4" style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 30%, transparent)` }} />
        </div>

        {/* Cœur */}
        <div className="flex flex-col items-start text-left ml-4 md:ml-12">
          <span className="text-[0.55rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)] mb-2" style={{ color: accentColor }}>Cœur</span>
          <p className="font-[family-name:var(--font-cormorant)] text-3xl md:text-4xl font-light text-[var(--color-text)]">
            {heartNotes.join(' • ')}
          </p>
          <div className="w-3/4 h-px mt-4" style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 50%, transparent)` }} />
        </div>

        {/* Fond */}
        <div className="flex flex-col items-end text-right mr-4 md:mr-8">
          <span className="text-[0.55rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)] mb-2">Fond</span>
          <p className="font-[family-name:var(--font-cormorant)] text-2xl md:text-3xl font-light text-[var(--color-text)]">
            {baseNotes.join(' • ')}
          </p>
        </div>

      </div>
    </div>
  );
}
