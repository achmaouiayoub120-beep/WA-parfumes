"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero WA / W&A Parfumes — Creative Luxury Edition
 * Desktop  : 100% Original luxury layout — gold ornaments, particles, 2 columns, framed video
 * Mobile   : 100svh fullscreen video, bottom-anchored text with safe-area, 52px CTA, no text clipping
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

      {/* Animated golden particles overlay (Desktop only) */}
      <div className="wa-hero__particles hidden md:block" aria-hidden="true">
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
        <span className="particle p5" />
        <span className="particle p6" />
        <span className="particle p7" />
        <span className="particle p8" />
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
        {/* Mobile dark gradient overlay in lower third */}
        <div className="wa-hero__overlay md:hidden" aria-hidden="true" />
      </div>

      {/* Text block */}
      <div className="wa-hero__text">
        <div className="wa-hero__ornament-top hidden md:block" aria-hidden="true">
          <svg width="60" height="2" viewBox="0 0 60 2">
            <rect width="60" height="2" fill="url(#gold-grad)" />
            <defs>
              <linearGradient id="gold-grad">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#c9a96e" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <p className="wa-hero__subtitle">{subtitle}</p>

        <h1 className="wa-hero__heading">
          <span className="title-line">{title}</span>
        </h1>

        <div className="wa-hero__ornament hidden md:block" aria-hidden="true">
          <svg width="120" height="2" viewBox="0 0 120 2">
            <rect width="120" height="2" fill="url(#gold-grad2)" />
            <defs>
              <linearGradient id="gold-grad2">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#c9a96e" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="wa-hero__cta-wrapper">
          <a className="wa-hero__cta" href={href}>
            <span className="cta-text">{cta}</span>
            <span className="cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* Corner decorations (Desktop only) */}
      <div className="wa-hero__corner wa-hero__corner--tl hidden md:block" aria-hidden="true" />
      <div className="wa-hero__corner wa-hero__corner--tr hidden md:block" aria-hidden="true" />
      <div className="wa-hero__corner wa-hero__corner--bl hidden md:block" aria-hidden="true" />
      <div className="wa-hero__corner wa-hero__corner--br hidden md:block" aria-hidden="true" />

      <style>{`
        /* ═══════════════════════════════════════════════
           BASE HERO (MOBILE < 768px)
           ═══════════════════════════════════════════════ */
        .wa-hero {
          position: relative;
          min-height: calc(100svh - var(--announce-h, 0px));
          height: calc(100svh - var(--announce-h, 0px));
          overflow: hidden;
          background: #0a0806;
          color: #faf5f0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          isolation: isolate;
        }

        /* ── Background image ── */
        .wa-hero__bg {
          position: absolute;
          inset: 0;
          background: url('/hero/hero-bg.jpg') center/cover no-repeat;
          opacity: 0.55;
          z-index: 0;
        }

        /* ── Video Media ── */
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

        /* Mobile gradient overlay for text readability */
        .wa-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10,8,6,0.96) 0%,
            rgba(10,8,6,0.75) 35%,
            rgba(10,8,6,0.2) 60%,
            transparent 75%
          );
          pointer-events: none;
          z-index: 3;
        }

        .wa-hero__frame {
          display: none;
        }

        /* ── Mobile Text Block (Anchored at bottom) ── */
        .wa-hero__text {
          position: relative;
          z-index: 10;
          padding: 0 20px calc(24px + env(safe-area-inset-bottom, 0px));
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          align-items: flex-start;
          width: 100%;
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
          font-size: clamp(0.72rem, 3vw, 0.8rem);
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: #c9a96e;
          font-weight: 500;
          text-wrap: balance;
          line-height: 1.4;
        }

        .wa-hero__heading {
          margin: 0;
          font-family: var(--font-display, "Cormorant Garamond", Georgia, serif);
          font-weight: 300;
          font-size: clamp(2.25rem, 9vw, 3.25rem);
          line-height: 1.08;
          letter-spacing: 0.02em;
          text-wrap: balance;
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

        .wa-hero__cta-wrapper {
          width: 100%;
          margin-top: 0.25rem;
        }

        /* ── Mobile CTA: 52px full width, touch friendly ── */
        .wa-hero__cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          width: 100%;
          height: 52px;
          min-height: 52px;
          color: #c9a96e;
          text-decoration: none;
          border: 1px solid rgba(201,169,110,.6);
          padding: 0 1.5rem;
          font-size: 0.85rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all .3s cubic-bezier(.25,.46,.45,.94);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          background: rgba(201,169,110,.1);
          border-radius: 9999px;
        }

        .cta-arrow {
          transition: transform .3s ease;
          font-size: 1.1rem;
        }

        /* ═══════════════════════════════════════════════
           DESKTOP & TABLET — 768px+ (100% ORIGINAL LUXURY LAYOUT)
           ═══════════════════════════════════════════════ */
        @media (min-width: 768px) {
          .wa-hero {
            display: grid;
            grid-template-columns: 1.15fr 0.85fr;
            align-items: center;
            justify-content: stretch;
            min-height: 100svh;
            height: 100svh;
            padding: 0;
          }

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
            max-width: none;
            width: auto;
            gap: 1.25rem;
          }

          .wa-hero__subtitle {
            font-size: 0.85rem;
            letter-spacing: 0.3em;
          }

          .wa-hero__heading {
            font-size: clamp(3.5rem, 5.5vw, 6rem);
            line-height: 1.05;
          }

          .wa-hero__cta-wrapper {
            width: auto;
            margin-top: 0;
          }

          .wa-hero__cta {
            display: inline-flex;
            width: auto;
            border-radius: 0;
            padding: 1rem 2rem;
            background: rgba(201,169,110,.06);
          }

          .wa-hero__cta:hover {
            border-color: #c9a96e;
            color: #faf5f0;
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(201,169,110,.2);
          }

          .wa-hero__cta:hover .cta-arrow {
            transform: translateX(4px);
          }

          .wa-hero__ornament-top {
            opacity: 0;
            transition: opacity 1.2s ease 0.6s;
          }
          .wa-hero.is-loaded .wa-hero__ornament-top { opacity: 1; }

          .wa-hero__ornament {
            opacity: 0;
            transform: scaleX(0);
            transition: opacity 1s ease 0.9s, transform 1s ease 0.9s;
          }
          .wa-hero.is-loaded .wa-hero__ornament {
            opacity: 1;
            transform: scaleX(1);
          }

          /* Floating golden particles */
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

          /* Corner decorations */
          .wa-hero__corner {
            position: absolute;
            width: 80px;
            height: 80px;
            z-index: 5;
            opacity: 0;
            transition: opacity 1.2s ease 0.8s;
          }
          .wa-hero.is-loaded .wa-hero__corner { opacity: 0.4; }
          .wa-hero__corner--tl { top: 24px; left: 24px; border-top: 1px solid #c9a96e; border-left: 1px solid #c9a96e; }
          .wa-hero__corner--tr { top: 24px; right: 24px; border-top: 1px solid #c9a96e; border-right: 1px solid #c9a96e; }
          .wa-hero__corner--bl { bottom: 24px; left: 24px; border-bottom: 1px solid #c9a96e; border-left: 1px solid #c9a96e; }
          .wa-hero__corner--br { bottom: 24px; right: 24px; border-bottom: 1px solid #c9a96e; border-right: 1px solid #c9a96e; }
        }

        @media (min-width: 1200px) {
          .wa-hero__heading {
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
