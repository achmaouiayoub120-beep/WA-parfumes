'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * EasterEgg — Konami Code listener
 * 
 * Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
 * Triggers: Accent particle burst (Canvas 2D, not WebGL)
 * Duration: ~3s then auto-cleanup
 */
const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export default function EasterEgg() {
  const sequenceRef = useRef<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animatingRef = useRef(false);

  const triggerExplosion = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;

    // Create fullscreen canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '999998';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) { animatingRef.current = false; return; }

    // Generate particles
    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string; rotation: number; rotSpeed: number;
    }[] = [];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const accentColors = [
      '#C9CBD3', '#8B5CF6', '#C66A91', '#EFC7B8', '#641B3A',
      '#F6EFE8', '#E2E3E8', '#9A9CA5', '#A78BFA', '#DB7093'
    ];

    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // slight upward bias
        size: 2 + Math.random() * 6,
        alpha: 1,
        color: accentColors[Math.floor(Math.random() * accentColors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
      });
    }

    const startTime = Date.now();
    const duration = 3000;

    function animate() {
      if (!ctx || !canvasRef.current) return;
      const elapsed = Date.now() - startTime;
      
      if (elapsed > duration) {
        // Cleanup
        canvasRef.current.remove();
        canvasRef.current = null;
        animatingRef.current = false;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.alpha -= 0.008;
        p.rotation += p.rotSpeed;
        p.vx *= 0.995; // air friction

        if (p.alpha <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;

        // Mix of shapes: circles and small diamonds
        if (p.size > 5) {
          // Diamond shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.6, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.6, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          // Circle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      sequenceRef.current.push(e.code);
      
      // Keep only the last N keys
      if (sequenceRef.current.length > KONAMI.length) {
        sequenceRef.current = sequenceRef.current.slice(-KONAMI.length);
      }

      // Check if sequence matches
      if (sequenceRef.current.length === KONAMI.length &&
          sequenceRef.current.every((key, i) => key === KONAMI[i])) {
        sequenceRef.current = [];
        triggerExplosion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerExplosion]);

  // Renders nothing — purely event-driven
  return null;
}
