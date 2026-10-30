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
import { UNISEX_PRODUCTS } from '@/data/products/unisex';
import { FRAGRANCE_FAMILIES } from '@/data/products/categories';
import { useIsMounted } from '@/hooks/useIsMounted';

const NAV_LINKS = [
  { label: 'Collections', href: '/#collections' },
  { label: 'W&A Homme', href: '/#homme', megaMenu: 'homme' as const },
  { label: 'W&A Femme', href: '/#femme', megaMenu: 'femme' as const },
  { label: 'W&A Unisexe', href: '/#unisexe', megaMenu: 'unisexe' as const },
  { label: 'Pack Découverte', href: '/#pack-decouverte' },
  { label: 'Notre Histoire', href: '/#story' },
];

// Short labels for mobile fullscreen menu
const MOBILE_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Collections', href: '/#collections' },
  { label: 'Homme', href: '/#homme' },
  { label: 'Femme', href: '/#femme' },
  { label: 'Unisexe', href: '/#unisexe' },
  { label: 'Pack Découverte', href: '/#pack-decouverte' },
  { label: 'Notre Histoire', href: '/#story' },
  { label: 'Trouver mon parfum', href: '/finder' },
];

// Helper: get unique fragrance families for a collection
function getFamilies(products: typeof MEN_PRODUCTS) {
  const ids = new Set(products.map(p => p.fragranceFamily));
  return FRAGRANCE_FAMILIES.filter(f => ids.has(f.id));
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const menuOpen = useUIStore((s) => s.isMobileMenuOpen);
  const setMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const [activeMega, setActiveMega] = useState<'homme' | 'femme' | 'unisexe' | null>(null);
  const mounted = useIsMounted();
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
    const handleHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [menuOpen]);

  // Animate menu open/close
  useEffect(() => {
    if (!menuRef.current) return;

    if (menuOpen) {
      const links = menuLinksRef.current ? menuLinksRef.current.querySelectorAll('.menu-link') : [];
      
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.5,
        ease: 'power3.inOut',
      });
      if (links.length > 0) {
        gsap.fromTo(links, 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, delay: 0.2, ease: 'power2.out' }
        );
      }
    } else {
      gsap.to(menuRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 0.4,
        ease: 'power3.inOut',
      });
    }
  }, [menuOpen]);

  const handleMegaEnter = useCallback((type: 'homme' | 'femme' | 'unisexe') => {
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
    ? { products: MEN_PRODUCTS, label: 'W&A Homme', href: '/#homme', accent: 'var(--color-silver)' }
    : activeMega === 'femme'
    ? { products: WOMEN_PRODUCTS, label: 'W&A Femme', href: '/#femme', accent: 'var(--color-accent-rose)' }
    : activeMega === 'unisexe'
    ? { products: UNISEX_PRODUCTS, label: 'W&A Unisexe', href: '/#unisexe', accent: 'var(--color-violet)' }
    : null;

  const featuredProducts = megaData ? megaData.products.filter(p => p.isBestseller || p.isNew).slice(0, 3) : [];
  if (featuredProducts.length === 0 && megaData) {
    featuredProducts.push(...megaData.products.slice(0, 3));
  }
  const families = megaData ? getFamilies(megaData.products) : [];

  return (
    <>
      {/* Fixed Header — max 60px, transparent on hero, 92% opaque on scroll */}
      <header
        ref={headerRef}
        className="fixed left-0 right-0 z-50 transition-all duration-400"
        style={{
          top: 'var(--announce-h, 0px)',
          height: '60px',
          backgroundColor: scrolled 
            ? (mounted && resolvedTheme === 'light' ? 'rgba(250, 245, 240, 0.94)' : 'rgba(14, 10, 16, 0.94)')
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled 
            ? '1px solid var(--color-border-subtle)' 
            : '1px solid transparent',
        }}
      >
        <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
          {/* Logo (Left) — monogram ≥28px */}
          <Link 
            href="/" 
            className="relative z-[101] flex items-center shrink-0 min-h-[44px] min-w-[44px]"
            aria-label="Accueil W&A Perfumes"
          >
            <Image
              src="/logo.png"
              alt="W&A Perfumes"
              width={110}
              height={55}
              className="object-contain w-auto h-7 sm:h-8 lg:h-9"
              style={mounted && resolvedTheme === 'light' ? {
                filter: 'brightness(0.15) sepia(1) saturate(0.5) hue-rotate(10deg)',
              } : undefined}
              priority
            />
          </Link>

          {/* Desktop Navigation (Center) */}
          <nav 
            className="hidden lg:flex items-center gap-1 xl:gap-2 absolute left-1/2 -translate-x-1/2 z-[100]"
            onMouseLeave={() => setHoveredPath(null)}
          >
            {NAV_LINKS.map((link) => {
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
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)',
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  
                  <Link
                    href={link.href}
                    className="relative z-10 block px-3.5 py-2 rounded-full whitespace-nowrap text-xs uppercase tracking-[0.12em] font-medium transition-colors duration-300"
                    style={{
                      color: activeMega === link.megaMenu || isReallyActive ? 'var(--color-accent)' : 'var(--color-text)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
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

          {/* Right Actions — 44px touch targets */}
          <div className="flex items-center gap-1 sm:gap-2 relative z-[101]">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart Button — 44×44 touch target */}
            <button
              onClick={openCart}
              className="relative w-11 h-11 flex items-center justify-center transition-colors duration-300 rounded-full hover:bg-[var(--color-accent-bg-subtle)]"
              style={{ color: 'var(--color-text)' }}
              aria-label="Ouvrir le panier"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {mounted && cartCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-4 h-4 bg-[var(--color-badge-bg)] text-[var(--color-badge-text)] text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Burger Menu Toggle — 44×44 touch target, single menu entry point */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 lg:hidden rounded-full hover:bg-[var(--color-accent-bg-subtle)]"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
            >
              <span
                className={`block h-[1.5px] rounded-full transition-all duration-300 ease-out ${
                  menuOpen ? 'w-5 rotate-45 translate-y-[3.75px]' : 'w-5'
                }`}
                style={{ backgroundColor: 'var(--color-text)' }}
              />
              <span
                className={`block h-[1.5px] rounded-full transition-all duration-300 ease-out ${
                  menuOpen ? 'w-5 -rotate-45 -translate-y-[3.75px]' : 'w-3.5 self-end mr-3'
                }`}
                style={{ backgroundColor: 'var(--color-text)' }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════ GLASSMORPHISM MEGA-MENU (Desktop only) ═══════════════ */}
      {activeMega && megaData && (
        <div
          ref={megaMenuRef}
          className="fixed left-0 right-0 z-[99] hidden lg:block"
          style={{ top: '60px' }}
          onMouseEnter={handleMegaPanelEnter}
          onMouseLeave={handleMegaLeave}
        >
          <div className="mx-auto max-w-[1440px] px-6 md:px-10">
            <div
              className="rounded-b-2xl p-8 transition-all duration-300"
              style={{
                background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
                backdropFilter: 'blur(24px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                border: '1px solid color-mix(in srgb, var(--color-border) 40%, transparent)',
                borderTop: 'none',
                boxShadow: '0 20px 60px -10px rgba(0,0,0,0.2)',
              }}
            >
              <div className="grid grid-cols-12 gap-8">
                {/* Left — Categories & Families */}
                <div className="col-span-3">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-text-subtle)] mb-5">
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
                        <span className="text-[0.75rem] text-[var(--color-text-muted)] tracking-wide">
                          {family.nameFr}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-[var(--color-border-faint)]">
                    <Link
                      href={megaData.href}
                      className="text-[0.65rem] uppercase tracking-[0.25em] transition-colors duration-300 hover:text-[var(--color-accent)]"
                      style={{ color: megaData.accent }}
                    >
                      Voir toute la collection →
                    </Link>
                  </div>
                </div>

                {/* Right — Featured Products */}
                <div className="col-span-9">
                  <p className="text-[0.6rem] uppercase tracking-[0.3em] text-[var(--color-text-subtle)] mb-5">
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
                            sizes="240px"
                          />
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                              background: `linear-gradient(to top, color-mix(in srgb, ${megaData.accent} 20%, transparent), transparent 60%)`,
                            }}
                          />
                          {product.isBestseller && (
                            <span
                              className="absolute top-2 right-2 text-[0.5rem] uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm backdrop-blur-sm"
                              style={{
                                color: megaData.accent,
                                background: 'color-mix(in srgb, var(--color-bg) 70%, transparent)',
                                border: `1px solid color-mix(in srgb, ${megaData.accent} 30%, transparent)`,
                              }}
                            >
                              Best-seller
                            </span>
                          )}
                        </div>
                        <p className="text-[0.75rem] text-[var(--color-text)] tracking-wide group-hover:text-[var(--color-accent)] transition-colors duration-300">
                          {product.name}
                        </p>
                        <p className="text-[0.65rem] text-[var(--color-text-subtle)] italic mt-0.5">
                          Inspiré par {product.inspiredBy}
                        </p>
                        <p className="text-[0.7rem] mt-1.5 font-medium tracking-wider" style={{ color: megaData.accent }}>
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

      {/* ═══════════════ FULLSCREEN MOBILE MENU (100dvh) ═══════════════ */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[200] lg:hidden"
        style={{
          clipPath: 'inset(0% 0% 100% 0%)',
          backgroundColor: 'var(--color-bg)',
          height: '100dvh',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        aria-hidden={!menuOpen}
      >
        {/* Top bar with W&A monogram and 44x44px close button */}
        <div 
          className="flex items-center justify-between px-5 h-[60px] border-b border-[var(--color-border-subtle)]"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        >
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="W&A Perfumes"
              width={90}
              height={45}
              className="object-contain w-auto h-7"
              style={mounted && resolvedTheme === 'light' ? {
                filter: 'brightness(0.15) sepia(1) saturate(0.5) hue-rotate(10deg)',
              } : undefined}
            />
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[var(--color-accent-bg-subtle)] transition-colors"
            aria-label="Fermer le menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" style={{ color: 'var(--color-text)' }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable links list */}
        <div 
          className="flex flex-col justify-between overflow-y-auto px-6"
          style={{ 
            height: 'calc(100dvh - 60px - env(safe-area-inset-top, 0px))',
            paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div ref={menuLinksRef} className="flex flex-col items-center py-6 gap-1 w-full max-w-sm mx-auto">
            {MOBILE_LINKS.map((link) => (
              <div key={link.href} className="w-full text-center overflow-hidden">
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="menu-link block py-2.5 font-[family-name:var(--font-cormorant)] uppercase tracking-[0.06em] transition-colors duration-300 text-center"
                  style={{ 
                    color: pathname === link.href ? 'var(--color-accent)' : 'var(--color-text)',
                    fontSize: 'clamp(1.4rem, 6.5vw, 2.1rem)',
                    lineHeight: '1.25',
                    textWrap: 'balance',
                  }}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Menu Footer */}
          <div className="flex flex-col items-center gap-3 pt-4 border-t border-[var(--color-border-subtle)] mt-auto">
            <Link 
              href="https://www.instagram.com/w_a_perfume/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.75rem] uppercase tracking-[0.2em] font-medium py-2 px-4 rounded-full transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Instagram @w_a_perfume
            </Link>
            <p
              className="text-[0.65rem] uppercase tracking-[0.3em] text-center"
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
