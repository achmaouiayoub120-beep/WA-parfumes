'use client';

export default function TrustBanner() {
  const items = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      title: 'Livraison au Maroc',
      desc: 'Partout au Royaume en 24h/48h',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
      title: 'Paiement à la Livraison',
      desc: 'Réglez en toute sérénité',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      title: 'Conseils WhatsApp',
      desc: 'Assistance dédiée 7j/7',
    },
  ];

  return (
    <div className="md:hidden w-full border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] py-4">
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="flex flex-col gap-3 text-center">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-center gap-3">
              <span className="text-[var(--color-silver)] shrink-0 opacity-80">
                {item.icon}
              </span>
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text)]">
                  {item.title}
                </p>
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
