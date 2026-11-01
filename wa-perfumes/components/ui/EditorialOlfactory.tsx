import React from 'react';
import type { Pyramid } from '@/data/products/pyramids';
import { getProductOlfactoryData, getNoteIcon } from '@/lib/olfactory';

interface EditorialOlfactoryProps {
  topNotes?: string[];
  heartNotes?: string[];
  baseNotes?: string[];
  pyramid?: Pyramid;
  mainNotes?: string[];
  accentColor: string;
}

function NoteBadge({ note }: { note: string }) {
  const icon = getNoteIcon(note);
  return (
    <span className="inline-flex items-center gap-1.5 py-0.5">
      {icon ? (
        <span className="text-sm sm:text-base select-none leading-none opacity-90">{icon}</span>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] shrink-0 opacity-80" />
      )}
      <span className="font-[family-name:var(--font-cormorant)] text-xl sm:text-2xl md:text-3xl font-light text-[var(--color-text)]">
        {note}
      </span>
    </span>
  );
}

export default function EditorialOlfactory({
  topNotes = [],
  heartNotes = [],
  baseNotes = [],
  pyramid,
  mainNotes,
  accentColor,
}: EditorialOlfactoryProps) {
  const data = getProductOlfactoryData({
    pyramid,
    mainNotes,
    topNotes,
    heartNotes,
    baseNotes,
  });

  return (
    <div className="relative w-full py-10 md:py-12 overflow-hidden flex flex-col gap-10">
      {/* Watermark Background Element */}
      <div
        className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden z-0"
        aria-hidden="true"
      >
        <span className="font-[family-name:var(--font-cormorant)] text-[10rem] lg:text-[16rem] leading-none opacity-[0.02] text-[var(--color-text)] whitespace-nowrap -rotate-12">
          NOTES
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-10">
        {/* Cas 1 : Notes principales (wa-uni-01 Santal 33, liste plate sans niveaux) */}
        {data.type === 'mainNotes' && data.mainNotes && (
          <div className="flex flex-col items-start text-left ml-2 md:ml-6">
            <span
              className="text-[0.6rem] uppercase tracking-[0.35em] text-[var(--color-text-subtle)] mb-3"
              style={{ color: accentColor }}
            >
              Notes principales
            </span>
            <div className="flex flex-wrap items-center justify-start gap-x-3.5 gap-y-2.5">
              {data.mainNotes.map((note, idx) => (
                <React.Fragment key={note + idx}>
                  {idx > 0 && (
                    <span className="text-[var(--color-text-subtle)] opacity-40 font-serif select-none">
                      •
                    </span>
                  )}
                  <NoteBadge note={note} />
                </React.Fragment>
              ))}
            </div>
            <div
              className="w-full h-px mt-6"
              style={{
                backgroundColor: `color-mix(in srgb, ${accentColor} 40%, transparent)`,
              }}
            />
          </div>
        )}

        {/* Cas 2 : Pyramide complète en 3 niveaux (ou legacy traduite) */}
        {data.type !== 'mainNotes' && (
          <>
            {/* Notes de Tête */}
            <div className="flex flex-col items-end text-right">
              <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[var(--color-text-subtle)] mb-3">
                Notes de tête
              </span>
              <div className="flex flex-wrap items-center justify-end gap-x-3.5 gap-y-2.5">
                {data.top.map((note, idx) => (
                  <React.Fragment key={note + idx}>
                    {idx > 0 && (
                      <span className="text-[var(--color-text-subtle)] opacity-40 font-serif select-none">
                        •
                      </span>
                    )}
                    <NoteBadge note={note} />
                  </React.Fragment>
                ))}
              </div>
              <div
                className="w-2/3 h-px mt-4"
                style={{
                  backgroundColor: `color-mix(in srgb, ${accentColor} 30%, transparent)`,
                }}
              />
            </div>

            {/* Notes de Cœur */}
            <div className="flex flex-col items-start text-left ml-4 md:ml-10">
              <span
                className="text-[0.6rem] uppercase tracking-[0.35em] mb-3"
                style={{ color: accentColor }}
              >
                Notes de cœur
              </span>
              <div className="flex flex-wrap items-center justify-start gap-x-3.5 gap-y-2.5">
                {data.heart.map((note, idx) => (
                  <React.Fragment key={note + idx}>
                    {idx > 0 && (
                      <span className="text-[var(--color-text-subtle)] opacity-40 font-serif select-none">
                        •
                      </span>
                    )}
                    <NoteBadge note={note} />
                  </React.Fragment>
                ))}
              </div>
              <div
                className="w-3/4 h-px mt-4"
                style={{
                  backgroundColor: `color-mix(in srgb, ${accentColor} 50%, transparent)`,
                }}
              />
            </div>

            {/* Notes de Fond */}
            <div className="flex flex-col items-end text-right mr-4 md:mr-8">
              <span className="text-[0.6rem] uppercase tracking-[0.35em] text-[var(--color-text-subtle)] mb-3">
                Notes de fond
              </span>
              <div className="flex flex-wrap items-center justify-end gap-x-3.5 gap-y-2.5">
                {data.base.map((note, idx) => (
                  <React.Fragment key={note + idx}>
                    {idx > 0 && (
                      <span className="text-[var(--color-text-subtle)] opacity-40 font-serif select-none">
                        •
                      </span>
                    )}
                    <NoteBadge note={note} />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
