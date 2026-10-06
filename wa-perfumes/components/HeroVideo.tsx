"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero WA / W&A Parfumes — Creative Luxury Edition
 * Fichiers : /public/hero/ → hero.mp4, hero.webm, hero-poster.jpg, hero-bg.jpg
 *
 * Desktop  : fond luxueux doré, texte à gauche avec ornements, vidéo portrait à droite
 * Mobile   : vidéo plein écran, texte élégant en bas avec overlay
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
  const [fading, setFading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) videoRef.current?.pause();
    // Trigger entrance animation
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const restart = () => {
    setFading(true);
    window.setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = 0;
      v.play().catch(() => {});
      setFading(false);
    }, 700);
  };

  return (
    <section className={`wa-hero ${loaded ? "is-loaded" : ""}`} aria-label="Accueil">
      {/* Luxury background image */}
      <div className="wa-hero__bg" aria-hidden="true" />

      {/* Animated golden particles overlay */}
      <div className="wa-hero__particles" aria-hidden="true">
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
        <span className="particle p5" />
        <span className="particle p6" />
        <span className="particle p7" />
        <span className="particle p8" />
      </div>

      {/* Text block */}
      <div className="wa-hero__text">
        <div className="wa-hero__ornament-top" aria-hidden="true">
          <svg width="60" height="2" viewBox="0 0 60 2"><rect width="60" height="2" fill="url(#gold-grad)" /><defs><linearGradient id="gold-grad"><stop offset="0%" stopColor="transparent"/><stop offset="50%" stopColor="#c9a96e"/><stop offset="100%" stopColor="transparent"/></linearGradient></defs></svg>
        </div>
        <p className="wa-hero__subtitle">{subtitle}</p>
        <h1>
          <span className="title-line">{title}</span>
        </h1>
        <div className="wa-hero__ornament" aria-hidden="true">
          <svg width="120" height="2" viewBox="0 0 120 2"><rect width="120" height="2" fill="url(#gold-grad2)" /><defs><linearGradient id="gold-grad2"><stop offset="0%" stopColor="transparent"/><stop offset="50%" stopColor="#c9a96e"/><stop offset="100%" stopColor="transparent"/></linearGradient></defs></svg>
        </div>
        <a className="wa-hero__cta" href={href}>
          <span className="cta-text">{cta}</span>
          <span className="cta-arrow">→</span>
        </a>
      </div>

      {/* Video block with golden frame */}
      <div className="wa-hero__media">
        <div className="wa-hero__frame" aria-hidden="true" />
        <video
          ref={videoRef}
          className={fading ? "is-fading" : undefined}
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster="/hero/hero-poster.jpg"
          onEnded={restart}
          aria-hidden="true"
        >
          <source src="/hero/hero.webm" type="video/webm" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Corner decorations */}
      <div className="wa-hero__corner wa-hero__corner--tl" aria-hidden="true" />
      <div className="wa-hero__corner wa-hero__corner--tr" aria-hidden="true" />
      <div className="wa-hero__corner wa-hero__corner--bl" aria-hidden="true" />
      <div className="wa-hero__corner wa-hero__corner--br" aria-hidden="true" />

      <style>{`
        /* ═══════════════════════════════════════════════
           BASE HERO
           ═══════════════════════════════════════════════ */
        .wa-hero {
          position: relative;
          min-height: 100svh;
          overflow: hidden;
          background: #0a0806;
          color: #faf5f0;
          display: grid;
          isolation: isolate;
        }

        /* ── Luxury background image ── */
        .wa-hero__bg {
          position: absolute;
          inset: 0;
          background: url('/hero/hero-bg.jpg') center/cover no-repeat;
          opacity: 0.55;
          z-index: 0;
        }

        /* ── Floating golden particles ── */
        .wa-hero__particles {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #c9a96e, transparent);
          border-radius: 50%;
          opacity: 0;
          animation: floatParticle 6s ease-in-out infinite;
        }
        .p1 { left: 10%; top: 20%; animation-delay: 0s; }
        .p2 { left: 25%; top: 60%; animation-delay: 0.8s; width: 3px; height: 3px; }
        .p3 { left: 40%; top: 35%; animation-delay: 1.6s; width: 5px; height: 5px; }
        .p4 { left: 55%; top: 75%; animation-delay: 2.4s; }
        .p5 { left: 70%; top: 15%; animation-delay: 3.2s; width: 3px; height: 3px; }
        .p6 { left: 85%; top: 50%; animation-delay: 4s; width: 6px; height: 6px; }
        .p7 { left: 15%; top: 80%; animation-delay: 4.8s; }
        .p8 { left: 60%; top: 45%; animation-delay: 5.6s; width: 3px; height: 3px; }

        @keyframes floatParticle {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0.5); }
          25% { opacity: 0.8; }
          50% { opacity: 0.6; transform: translateY(-40px) scale(1); }
          75% { opacity: 0.3; }
        }

        /* ── Corner decorations ── */
        .wa-hero__corner {
          position: absolute;
          width: 60px;
          height: 60px;
          z-index: 5;
          opacity: 0;
          transition: opacity 1.2s ease 0.8s;
        }
        .wa-hero.is-loaded .wa-hero__corner { opacity: 0.4; }

        .wa-hero__corner--tl { top: 24px; left: 24px; border-top: 1px solid #c9a96e; border-left: 1px solid #c9a96e; }
        .wa-hero__corner--tr { top: 24px; right: 24px; border-top: 1px solid #c9a96e; border-right: 1px solid #c9a96e; }
        .wa-hero__corner--bl { bottom: 24px; left: 24px; border-bottom: 1px solid #c9a96e; border-left: 1px solid #c9a96e; }
        .wa-hero__corner--br { bottom: 24px; right: 24px; border-bottom: 1px solid #c9a96e; border-right: 1px solid #c9a96e; }

        /* ═══════════════════════════════════════════════
           VIDEO MEDIA
           ═══════════════════════════════════════════════ */
        .wa-hero__media {
          position: absolute;
          inset: 0;
          z-index: 2;
        }
        .wa-hero__media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: opacity 0.7s ease;
        }
        .wa-hero__media video.is-fading { opacity: 0; }

        /* Golden frame around video (desktop only, see below) */
        .wa-hero__frame {
          display: none;
        }

        /* Mobile : gradient overlay for text readability */
        .wa-hero__media::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10,8,6,.92) 0%,
            rgba(10,8,6,.6) 30%,
            rgba(10,8,6,.15) 55%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* ═══════════════════════════════════════════════
           TEXT BLOCK
           ═══════════════════════════════════════════════ */
        .wa-hero__text {
          position: relative;
          z-index: 10;
          align-self: end;
          padding: 0 1.5rem clamp(3.5rem, 10svh, 6rem);
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          align-items: flex-start;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
        }
        .wa-hero.is-loaded .wa-hero__text {
          opacity: 1;
          transform: translateY(0);
        }

        .wa-hero__subtitle {
          margin: 0;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: #c9a96e;
          font-weight: 400;
        }

        .wa-hero__ornament-top {
          opacity: 0;
          transition: opacity 1.2s ease 0.6s;
        }
        .wa-hero.is-loaded .wa-hero__ornament-top { opacity: 1; }

        .wa-hero h1 {
          margin: 0;
          font-family: var(--font-display, "Cormorant Garamond", Georgia, serif);
          font-weight: 300;
          font-size: clamp(2.8rem, 12vw, 4.8rem);
          line-height: 1.05;
          letter-spacing: 0.03em;
          text-wrap: balance;
          overflow-wrap: normal;
          word-break: normal;
          hyphens: none;
          color: #faf5f0;
        }
        .title-line {
          display: inline;
          background: linear-gradient(135deg, #faf5f0 0%, #e8d5b0 50%, #faf5f0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }

        .wa-hero__ornament {
          opacity: 0;
          transform: scaleX(0);
          transition: opacity 1s ease 0.9s, transform 1s ease 0.9s;
        }
        .wa-hero.is-loaded .wa-hero__ornament {
          opacity: 1;
          transform: scaleX(1);
        }

        /* ── CTA Button ── */
        .wa-hero__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          color: #c9a96e;
          text-decoration: none;
          border: 1px solid rgba(201,169,110,.5);
          padding: 1rem 2rem;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all .4s cubic-bezier(.25,.46,.45,.94);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          background: rgba(201,169,110,.06);
        }
        .wa-hero__cta::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(201,169,110,.15), transparent);
          opacity: 0;
          transition: opacity .4s ease;
        }
        .wa-hero__cta:hover::before,
        .wa-hero__cta:focus-visible::before { opacity: 1; }
        .wa-hero__cta:hover,
        .wa-hero__cta:focus-visible {
          border-color: #c9a96e;
          color: #faf5f0;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201,169,110,.2);
        }
        .wa-hero__cta:focus-visible {
          outline: 2px solid #c9a96e;
          outline-offset: 4px;
        }
        .cta-arrow {
          transition: transform .3s ease;
          font-size: 1.1rem;
        }
        .wa-hero__cta:hover .cta-arrow {
          transform: translateX(4px);
        }

        /* ═══════════════════════════════════════════════
           DESKTOP — 900px+
           ═══════════════════════════════════════════════ */
        @media (min-width: 900px) {
          .wa-hero {
            grid-template-columns: 1.15fr 0.85fr;
            align-items: center;
          }

          /* Background visible on desktop */
          .wa-hero__bg {
            opacity: 0.7;
          }

          /* Video in portrait frame on the right */
          .wa-hero__media {
            position: relative;
            inset: auto;
            grid-column: 2;
            grid-row: 1;
            justify-self: center;
            height: min(88svh, 880px);
            aspect-ratio: 9 / 16;
            border-radius: 4px;
            overflow: hidden;
          }
          .wa-hero__media::after { display: none; }

          /* Golden frame around video */
          .wa-hero__frame {
            display: block;
            position: absolute;
            inset: -1px;
            border: 1px solid rgba(201,169,110,.35);
            border-radius: 4px;
            z-index: 3;
            pointer-events: none;
            box-shadow:
              0 0 60px rgba(201,169,110,.08),
              0 30px 90px rgba(0,0,0,.55),
              inset 0 0 30px rgba(201,169,110,.03);
          }

          /* Text left side */
          .wa-hero__text {
            grid-column: 1;
            grid-row: 1;
            align-self: center;
            padding: 0 clamp(2.5rem, 6vw, 6rem);
          }

          .wa-hero__subtitle {
            font-size: 0.85rem;
            letter-spacing: 0.3em;
          }

          .wa-hero h1 {
            font-size: clamp(3.5rem, 5.5vw, 6rem);
          }

          .wa-hero__corner {
            width: 80px;
            height: 80px;
          }
        }

        /* ═══════════════════════════════════════════════
           LARGE DESKTOP — 1200px+
           ═══════════════════════════════════════════════ */
        @media (min-width: 1200px) {
          .wa-hero h1 {
            font-size: clamp(4rem, 6vw, 6.5rem);
          }
          .wa-hero__corner {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </section>
  );
}
