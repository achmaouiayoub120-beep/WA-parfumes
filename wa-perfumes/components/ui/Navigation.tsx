'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useTheme } from 'next-themes';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import ThemeToggle from '@/components/ui/ThemeToggle';

const NAV_LINKS = [
  { label: 'Collections', href: '/#collections' },
  { label: 'WA Signature', href: '/#signature' },
  { label: 'WA Elegance', href: '/#elegance' },
  { label: 'Pack Découverte', href: '/#pack-decouverte' },
  { label: 'Our Story', href: '/#story' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  
  const openCart = useUIStore((s) => s.openCart);
  const cartCount = useCartStore((s) => s.getCartCount());

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate menu open/close
  useEffect(() => {
    if (!menuRef.current || !menuLinksRef.current) return;

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      const links = menuLinksRef.current.querySelectorAll('.menu-link');
      
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.8,
        ease: 'power4.inOut',
      });
      gsap.fromTo(links, 
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.4, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.6,
        ease: 'power3.inOut',
      });
    }
  }, [menuOpen]);

  return (
    <>
      {/* Fixed Header */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'py-3 backdrop-blur-xl'
            : 'py-6 bg-transparent'
        }`}
        style={scrolled ? {
          backgroundColor: 'var(--color-bg-overlay)',
          borderBottom: '1px solid var(--color-border)',
        } : undefined}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-[101] flex items-center">
            <Image
              src="/logo.png"
              alt="WA Perfumes"
              width={200}
              height={100}
              className={`transition-all duration-500 object-contain ${scrolled ? 'w-32 h-16' : 'w-48 h-24'}`}
              style={mounted && resolvedTheme === 'light' ? {
                filter: 'brightness(0.15) sepia(1) saturate(0.5) hue-rotate(10deg)',
              } : undefined}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.7rem] uppercase tracking-[0.25em] transition-colors duration-300 font-[family-name:var(--font-sans)]"
                style={{
                  color: 'var(--color-text-muted)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 relative z-[101]">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative transition-colors duration-300"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
              aria-label="Open cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {mounted && cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-semibold rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--color-badge-bg)',
                    color: 'var(--color-badge-text)',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-[5px] items-end group"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <span
                className={`block h-[1px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? 'w-6 rotate-45 translate-y-[3px]' : 'w-6 group-hover:w-8'
                }`}
                style={{ backgroundColor: 'var(--color-text)' }}
              />
              <span
                className={`block h-[1px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  menuOpen ? 'w-6 -rotate-45 -translate-y-[3px]' : 'w-4 group-hover:w-8'
                }`}
                style={{ backgroundColor: 'var(--color-text)' }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Menu Overlay */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[99]"
        style={{
          clipPath: 'inset(0% 0% 100% 0%)',
          backgroundColor: 'var(--color-bg)',
        }}
      >
        <div className="h-full flex flex-col items-center justify-center px-6">
          <div ref={menuLinksRef} className="flex flex-col items-center gap-6 md:gap-8">
            {/* Theme Toggle in mobile menu */}
            <div className="mb-4">
              <ThemeToggle />
            </div>

            {[
              { label: 'Home', href: '/' },
              ...NAV_LINKS,
              { label: 'Scent Finder', href: '/finder' },
            ].map((link) => (
              <div key={link.href} className="overflow-hidden">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="menu-link block font-[family-name:var(--font-cormorant)] text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.08em] transition-colors duration-300 uppercase"
                  style={{ color: 'var(--color-text)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Menu Footer */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <p
              className="text-[0.65rem] uppercase tracking-[0.4em]"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              Leave Your Signature
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
