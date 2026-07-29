'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function FloatingWhatsApp() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gentle floating animation
      gsap.to(buttonRef.current, {
        y: -8,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 0.5 // Offset from Instagram
      });
      
      // Initial pop-in for tooltip
      gsap.fromTo(tooltipRef.current, 
        { opacity: 0, x: -10, scale: 0.9 },
        { opacity: 1, x: 0, scale: 1, duration: 0.8, delay: 2, ease: "back.out(1.5)" }
      );
      
      // Hide tooltip after a while automatically, but show on hover
      gsap.to(tooltipRef.current, {
        opacity: 0,
        x: -5,
        duration: 0.5,
        delay: 7,
        ease: "power2.in"
      });
    }, buttonRef);

    return () => ctx.revert();
  }, []);

  return (
    <a
      ref={buttonRef}
      href="https://wa.me/212707525317?text=Bonjour%2C%20je%20souhaite%20avoir%20plus%20d'informations%20sur%20WA%20Perfumes."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 md:bottom-8 md:left-10 z-[90] flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-[rgba(37,211,102,0.15)] backdrop-blur-md border border-[rgba(37,211,102,0.4)] shadow-[0_0_20px_rgba(37,211,102,0.3)] text-[#25D366] hover:bg-[#25D366] hover:text-white hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-500 group"
      aria-label="Contact us on WhatsApp"
      onMouseEnter={() => {
        gsap.to(tooltipRef.current, { opacity: 1, x: 0, scale: 1, duration: 0.3, overwrite: true });
      }}
      onMouseLeave={() => {
        gsap.to(tooltipRef.current, { opacity: 0, x: -5, duration: 0.3 });
      }}
    >
      {/* Ripple Ping Effect for high conversion */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 group-hover:opacity-0 animate-ping" style={{ animationDuration: '3s' }}></span>
      
      {/* Background glow sweep effect on hover */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      
      {/* Tooltip */}
      <div 
        ref={tooltipRef}
        className="absolute left-full ml-4 px-4 py-2 bg-[var(--color-bg-overlay)] backdrop-blur-md border border-[#25D366]/30 rounded-lg whitespace-nowrap text-sm font-medium text-[var(--color-text)] opacity-0 pointer-events-none shadow-xl flex flex-col"
      >
        <span className="text-[#25D366] font-semibold text-xs tracking-wider uppercase mb-0.5">Besoin d'aide ?</span>
        <span>Discutez avec nous</span>
        
        {/* Triangle pointer */}
        <div className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2 w-3 h-3 border-l border-b border-[#25D366]/30 bg-[var(--color-bg-overlay)] rotate-45"></div>
      </div>

      {/* Official WhatsApp Icon SVG */}
      <svg className="relative z-10 w-7 h-7 md:w-8 md:h-8 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.571c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
}
