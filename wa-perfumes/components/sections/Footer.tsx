'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  { label: 'Collections', href: '/#collections' },
  { label: 'W&A Homme', href: '/#homme' },
  { label: 'W&A Femme', href: '/#femme' },
  { label: 'W&A Unisexe', href: '/#unisexe' },
  { label: 'Scent Finder', href: '/finder' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background or other animations can go here if needed
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative border-t border-[var(--color-border-faint)]">
      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-24 pb-16">
        {/* Large Brand Title */}
        <div className="flex justify-center mb-16">
          <Image
            src="/logo.png"
            alt="WA Perfumes Logo"
            width={320}
            height={160}
            className="object-contain w-56 h-28 md:w-80 md:h-40"
          />
        </div>

        {/* Tagline */}
        <p className="text-center text-[0.65rem] uppercase tracking-[0.5em] text-[var(--color-accent)] mb-12">
          Leave Your Signature
        </p>

        {/* Accent Divider */}
        <div className="divider-gold max-w-xs mx-auto mb-12" />

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center gap-8 mb-12">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-text-subtle)] hover:text-[var(--color-accent)] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-6 mb-16">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/w_a_perfume/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-subtle)] hover:text-[var(--color-accent)] transition-colors duration-300"
            aria-label="Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/message/JKNKD5ZOFPR2A1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-subtle)] hover:text-[var(--color-accent)] transition-colors duration-300"
            aria-label="WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.67-1.22A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.244 0-4.327-.73-6.013-1.966l-.42-.312-2.727.713.743-2.614-.343-.453A9.964 9.964 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-border-faint)] py-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        {/* Subtle glow effect for the signature */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-[var(--color-accent)] opacity-5 blur-[30px] pointer-events-none" />
        
        <p className="text-center text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-text-subtle)]">
          © {new Date().getFullYear()} WA Perfumes. All rights reserved.
        </p>
        
        {/* Creative Signature */}
        <a 
          href="#"
          className="group flex items-center justify-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-700"
        >
          <span className="w-4 h-[1px] bg-gradient-to-r from-transparent to-[var(--color-accent-muted)] group-hover:w-8 transition-all duration-700" />
          <span className="text-[0.55rem] uppercase tracking-[0.3em] text-[var(--color-text-subtle)]">
            Crafted with <span className="text-[var(--color-accent)]">✦</span> by{' '}
            <span 
              className="font-[family-name:var(--font-cormorant)] text-[0.75rem] italic tracking-widest text-[var(--color-text)] transition-colors duration-500 group-hover:text-[var(--color-accent)] ml-1"
              style={{ textShadow: '0 0 10px rgba(201,203,211,0)' }}
            >
              ayoubachtec
            </span>
          </span>
          <span className="w-4 h-[1px] bg-gradient-to-l from-transparent to-[var(--color-accent-muted)] group-hover:w-8 transition-all duration-700" />
        </a>
      </div>
    </footer>
  );
}
