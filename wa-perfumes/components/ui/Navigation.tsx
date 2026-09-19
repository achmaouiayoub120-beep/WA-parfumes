'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useUIStore } from '@/store/useUIStore';
import { useCartStore } from '@/store/useCartStore';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { MEN_PRODUCTS } from '@/data/products/men';
import { WOMEN_PRODUCTS } from '@/data/products/women';
import { FRAGRANCE_FAMILIES } from '@/data/products/categories';

const NAV_LINKS = [
  { label: 'Collections', href: '/#collections' },
  { label: 'W&A Homme', href: '/#homme', megaMenu: 'homme' as const },
  { label: 'W&A Femme', href: '/#femme', megaMenu: 'femme' as const },
  { label: 'Pack Découverte', href: '/#pack-decouverte' },
  { label: 'Notre Histoire', href: '/#story' },
];

// Helper: get unique fragrance families for a collection
function getFamilies(products: typeof MEN_PRODUCTS) {
  const ids = new Set(products.map(p => p.fragranceFamily));
  return FRAGRANCE_FAMILIES.filter(f => ids.has(f.id));
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<'homme' | 'femme' | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeHash, setActiveHash] = useState('');
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { resolvedTheme } = useTheme();
  
  const pathname = usePathname();
  const openCart = useUIStore((s) => s.openCart);
  const cartCount = useCartStore((s) => s.getCartCount());

  useEffect(() => {
    setMounted(true);
    setActiveHash(window.location.hash);
    
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
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

  const handleMegaEnter = useCallback((type: 'homme' | 'femme') => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
    setActiveMega(type);
  }, []);

  const handleMegaLeave = useCallback(() => {
    megaTimeoutRef.current = setTimeout(() => {
      setActiveMega(null);
    }, 200);
  }, []);

  const handleMegaPanelEnter = useCallback(() => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current);
  }, []);

  // Mega menu data
  const megaData = activeMega === 'homme'
    ? { products: MEN_PRODUCTS, label: 'W&A Homme', href: '/#homme', accent: 'var(--color-gold)' }
    : activeMega === 'femme'
    ? { products: WOMEN_PRODUCTS, label: 'W&A Femme', href: '/#femme', accent: 'var(--color-accent-rose)' }
    : null;

  const featuredProducts = megaData ? megaData.products.filter(p => p.isBestseller || p.isNew).slice(0, 3) : [];
  if (featuredProducts.length === 0 && megaData) {
    featuredProducts.push(...megaData.products.slice(0, 3));
  }
  const families = megaData ? getFamilies(megaData.products) : [];

  return (
    <>
      {/* Sticky Pill Header */}
      <div className="sticky top-0 z-50 w-full flex justify-center">
        <header
          ref={headerRef}
          className="w-[95%] max-w-7xl rounded-full transition-all duration-500 backdrop-blur-xl flex items-center justify-between px-6 h-20 shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] mt-0 border border-white/20 dark:border-white/10"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--color-bg) 40%, transparent)'
          }}
        >
        {/* Logo (Left) */}
        <Link href="/" className="relative z-[101] flex items-center hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo.png"
            alt="WA Perfumes"
            width={140}
            height={70}
            className="object-contain w-auto h-10 sm:h-12 scale-110"
            style={mounted && resolvedTheme === 'light' ? {
              filter: 'brightness(0.15) sepia(1) saturate(0.5) hue-rotate(10deg)',
            } : undefined}
            priority
          />
        </Link>

        {/* Desktop Navigation (Center) */}
        <nav 
          className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 z-[100]"
          onMouseLeave={() => setHoveredPath(null)}
        >
          {NAV_LINKS.map((link) => {
            // Check active state
            const isHovered = hoveredPath === link.href;
            const isMatchHash = activeHash === link.href.replace('/', '');
            const isActive = isHovered || (!hoveredPath && (pathname === link.href || (pathname === '/' && isMatchHash)));
            const isReallyActive = pathname === link.href || (pathname === '/' && isMatchHash);

            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => {
                  setHoveredPath(link.href);
                  if (link.megaMenu) handleMegaEnter(link.megaMenu);
                }}
                onMouseLeave={() => {
                  if (link.megaMenu) handleMegaLeave();
                }}
              >
                {/* Framer Motion Active Pill */}
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--color-gold) 10%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--color-gold) 20%, transparent)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                
                <Link
                  href={link.href}
                  className="relative z-10 block px-5 py-2.5 rounded-full whitespace-nowrap text-xs uppercase tracking-[0.15em] font-medium transition-colors duration-300 hover:bg-black/5 dark:hover:bg-white/10"
                  style={{
                    color: activeMega === link.megaMenu || isReallyActive ? 'var(--color-gold)' : 'var(--color-text)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
                  onMouseLeave={(e) => {
                    if (activeMega !== link.megaMenu && !isReallyActive) {
                      e.currentTarget.style.color = 'var(--color-text)';
                    }
                  }}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4 sm:gap-6 relative z-[101]">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="relative transition-colors duration-300 hover:text-amber-500/90"
            style={{ color: 'var(--color-text)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text)')}
            aria-label="Open cart"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {mounted && cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 bg-amber-600 text-white text-[10px] rounded-full flex items-center justify-center font-semibold shadow-md"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-[5px] items-end group lg:hidden"
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
      </header>
      </div>

      {/* ═══════════════ GLASSMORPHISM MEGA-MENU ═══════════════ */}
      {activeMega && megaData && (
        <div
          ref={megaMenuRef}
          className="fixed left-0 right-0 z-[99] hidden lg:block"
          style={{ top: scrolled ? '64px' : '96px' }}
          onMouseEnter={handleMegaPanelEnter}
          onMouseLeave={handleMegaLeave}
        >
          <div
            className="mx-auto max-w-[1440px] px-6 md:px-10"
          >
            <div
              className="rounded-b-2xl p-8 transition-all duration-300"
              style={{
                background: 'color-mix(in srgb, var(--color-bg) 75%, transparent)',
                backdropFilter: 'blur(24px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                border: '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)',
                borderTop: 'none',
                boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)',
              }}
            >
              <div className="grid grid-cols-12 gap-8">
                {/* Left — Categories & Families */}
                <div className="col-span-3">
                  <p className="text-[0.5rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)] mb-5">
                    Familles Olfactives
                  </p>
                  <div className="flex flex-col gap-2">
                    {families.map((family) => (
                      <Link
                        key={family.id}
                        href={`/#${activeMega}`}
                        className="flex items-center gap-3 py-2 px-3 rounded-lg transition-colors duration-200 hover:bg-[var(--color-bg-elevated)]"
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: family.color }}
                        />
                        <span className="text-[0.7rem] text-[var(--color-text-muted)] tracking-wide">
                          {family.nameFr}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--color-border-faint)]">
                    <Link
                      href={megaData.href}
                      className="text-[0.6rem] uppercase tracking-[0.25em] transition-colors duration-300 hover:text-[var(--color-gold)]"
                      style={{ color: megaData.accent }}
                    >
                      Voir toute la collection
                    </Link>
                  </div>
                </div>

                {/* Right — Featured Products */}
                <div className="col-span-9">
                  <p className="text-[0.5rem] uppercase tracking-[0.4em] text-[var(--color-text-subtle)] mb-5">
                    Nos Coups de Cœur
                  </p>
                  <div className="grid grid-cols-3 gap-6">
                    {featuredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group flex flex-col"
                        onClick={() => setActiveMega(null)}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-[var(--color-bg-elevated)]">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="200px"
                          />
                          {/* Hover overlay */}
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                              background: `linear-gradient(to top, color-mix(in srgb, ${megaData.accent} 15%, transparent), transparent 60%)`,
                            }}
                          />
                          {product.isBestseller && (
                            <span
                              className="absolute top-2 right-2 text-[0.45rem] uppercase tracking-[0.2em] px-2 py-1 rounded-sm backdrop-blur-sm"
                              style={{
                                color: megaData.accent,
                                background: 'color-mix(in srgb, var(--color-bg) 60%, transparent)',
                                border: `1px solid color-mix(in srgb, ${megaData.accent} 30%, transparent)`,
                              }}
                            >
                              Best-seller
                            </span>
                          )}
                        </div>
                        <p className="text-[0.65rem] text-[var(--color-text)] tracking-wide group-hover:text-[var(--color-gold)] transition-colors duration-300">
                          {product.name}
                        </p>
                        <p className="text-[0.55rem] text-[var(--color-text-subtle)] italic mt-0.5">
                          Inspiré par {product.inspiredBy}
                        </p>
                        <p className="text-[0.6rem] mt-1.5 tracking-wider" style={{ color: megaData.accent }}>
                          {product.price} DH
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              { label: 'Accueil', href: '/' },
              ...NAV_LINKS,
              { label: 'Trouvez Votre Parfum', href: '/finder' },
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
          <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4">
            <Link 
              href="https://www.instagram.com/w_a_perfume/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.65rem] uppercase tracking-[0.2em] transition-colors hover:text-[var(--color-gold)]"
              style={{ color: 'var(--color-text)' }}
            >
              Instagram
            </Link>
            <p
              className="text-[0.65rem] uppercase tracking-[0.4em]"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              Laissez Votre Signature
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
