'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  as?: 'button' | 'a';
  href?: string;
  style?: React.CSSProperties;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 0.35,
  as: Component = 'button',
  href,
  style,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn) return;

    const { left, top, width, height } = btn.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) * strength;
    const y = (e.clientY - (top + height / 2)) * strength;

    gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
    if (text) {
      gsap.to(text, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn) return;

    gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    if (text) {
      gsap.to(text, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    }
  };

  const baseClasses =
    'relative inline-flex items-center justify-center overflow-hidden group cursor-pointer';

  const props = {
    ref: btnRef as React.RefObject<any>,
    className: `${baseClasses} ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    style,
    ...(Component === 'a' && href ? { href } : {}),
  };

  return (
    <Component {...props}>
      <span ref={textRef} className="relative z-10">
        {children}
      </span>
    </Component>
  );
}
