"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero W&A Perfumes — Luxury Mobile-First Edition
 * Mobile  : Plein écran 100svh, dégradé sombre en bas, texte ancré avec safe area, CTA 52px pleine largeur
 * Desktop : Fond raffiné, texte éditorial à gauche, vidéo cadrée à droite
 */
type Props = {
  title?: string;
  subtitle?: string;
  cta?: string;
  href?: string;
};

export default function HeroVideo({
  title = "Laissez Votre Signature",
  subtitle = "Parfums de luxe — Élégance intemporelle",
  cta = "Explorer les collections",
  href = "#collections",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) videoRef.current?.pause();
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={`wa-hero ${loaded ? "is-loaded" : ""}`} aria-label="Accueil">
      {/* Luxury ambient background */}
      <div className="wa-hero__bg" aria-hidden="true" />

      {/* Floating subtle particles */}
      <div className="wa-hero__particles hidden sm:block" aria-hidden="true">
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
      </div>

      {/* Video media with gradient overlay */}
      <div className="wa-hero__media">
        <div className="wa-hero__frame" aria-hidden="true" />
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero/hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
        {/* Dark gradient in bottom third for text readability */}
        <div className="wa-hero__overlay" aria-hidden="true" />
      </div>

      {/* Bottom-anchored text block with safe-area support */}
      <div className="wa-hero__text">
        <p className="wa-hero__subtitle">{subtitle}</p>
        <h1 className="wa-hero__title">{title}</h1>
        <div className="wa-hero__cta-wrapper">
          <a className="wa-hero__cta" href={href}>
            <span>{cta}</span>
            <span className="cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <style>{`
        .wa-hero {
          position: relative;
          min-height: 100svh;
          height: 100svh;
          overflow: hidden;
          background: #0E0A10;
          color: #FAF5F0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          isolation: isolate;
        }

        .wa-hero__bg {
          position: absolute;
          inset: 0;
          background: url('/hero/hero-bg.jpg') center/cover no-repeat;
          opacity: 0.4;
          z-index: 0;
        }

        /* ── Video Media ── */
        .wa-hero__media {
          position: absolute;
          inset: 0;
          z-index: 1;
        }
        .wa-hero__media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Dark gradient overlay in lower third */
        .wa-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(14, 10, 16, 0.96) 0%,
            rgba(14, 10, 16, 0.82) 28%,
            rgba(14, 10, 16, 0.4) 55%,
            transparent 75%
          );
          pointer-events: none;
          z-index: 2;
        }

        .wa-hero__frame {
          display: none;
        }

        /* ── Text Block — Anchored at bottom ── */
        .wa-hero__text {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 600px;
          padding: 0 20px calc(24px + env(safe-area-inset-bottom, 0px));
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: flex-start;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
        }
        .wa-hero.is-loaded .wa-hero__text {
          opacity: 1;
          transform: translateY(0);
        }

        .wa-hero__subtitle {
          margin: 0;
          font-size: clamp(0.7rem, 2.8vw, 0.82rem);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--color-silver, #C9CBD3);
          font-weight: 500;
          line-height: 1.4;
          text-wrap: balance;
        }

        .wa-hero__title {
          margin: 0;
          font-family: var(--font-cormorant), "Cormorant Garamond", Georgia, serif;
          font-weight: 300;
          font-size: clamp(2.25rem, 9vw, 3.25rem);
          line-height: 1.08;
          letter-spacing: 0.02em;
          color: #FAF5F0;
          text-wrap: balance;
        }

        .wa-hero__cta-wrapper {
          width: 100%;
          margin-top: 0.5rem;
        }

        /* ── Full width 52px CTA on Mobile ── */
        .wa-hero__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          height: 52px;
          min-height: 52px;
          color: #0E0A10;
          background: #FAF5F0;
          text-decoration: none;
          padding: 0 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: 9999px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }
        @media (hover: hover) and (pointer: fine) {
          .wa-hero__cta:hover {
            background: #C9CBD3;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(201, 203, 211, 0.25);
          }
        }
        .cta-arrow {
          transition: transform 0.3s ease;
          font-size: 1.1rem;
        }
        .wa-hero__cta:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* ── Floating particles ── */
        .wa-hero__particles {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #C9CBD3;
          border-radius: 50%;
          opacity: 0.4;
        }
        .p1 { left: 15%; top: 25%; }
        .p2 { left: 80%; top: 40%; }
        .p3 { left: 30%; top: 70%; }
        .p4 { left: 70%; top: 80%; }

        /* ═══════════════════════════════════════════════
           DESKTOP — 900px+
           ═══════════════════════════════════════════════ */
        @media (min-width: 900px) {
          .wa-hero {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            align-items: center;
            justify-content: stretch;
            padding: 0 4rem;
          }

          .wa-hero__bg {
            opacity: 0.6;
          }

          .wa-hero__media {
            position: relative;
            inset: auto;
            grid-column: 2;
            height: min(82svh, 800px);
            aspect-ratio: 9 / 16;
            margin: auto;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          }

          .wa-hero__overlay {
            display: none;
          }

          .wa-hero__frame {
            display: block;
            position: absolute;
            inset: 0;
            border: 1px solid rgba(201, 203, 211, 0.25);
            border-radius: 12px;
            z-index: 3;
            pointer-events: none;
          }

          .wa-hero__text {
            grid-column: 1;
            align-self: center;
            max-width: 580px;
            padding: 0;
            gap: 1.5rem;
          }

          .wa-hero__title {
            font-size: clamp(3.2rem, 5vw, 4.8rem);
          }

          .wa-hero__cta-wrapper {
            width: auto;
          }

          .wa-hero__cta {
            width: auto;
            display: inline-flex;
            padding: 0 2.5rem;
          }
        }
      `}</style>
    </section>
  );
}
