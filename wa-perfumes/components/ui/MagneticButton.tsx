'use client';

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
  as: Component = 'button',
  href,
  style,
}: MagneticButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center overflow-hidden group cursor-pointer';

  const props = {
    className: `${baseClasses} ${className}`,
    onClick,
    style,
    ...(Component === 'a' && href ? { href } : {}),
  };

  return (
    <Component {...props}>
      <span className="relative z-10">
        {children}
      </span>
    </Component>
  );
}
