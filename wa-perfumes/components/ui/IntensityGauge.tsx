'use client';

import React from 'react';
import type { Longevity, Projection } from '@/data/products/categories';
import type { Product } from '@/data/products/men';

export interface IntensityGaugeProps {
  label: string;
  value: number;
  maxValue?: number;
  accentColor?: string;
  className?: string;
}

const LONGEVITY_MAP: Record<Longevity, number> = {
  beast: 5,
  'very-long': 4,
  long: 3,
  moderate: 2,
  light: 1,
};

const PROJECTION_MAP: Record<Projection, number> = {
  enormous: 5,
  strong: 4,
  moderate: 3,
  intimate: 2,
};

export function IntensityGauge({
  label,
  value,
  maxValue = 5,
  accentColor = 'var(--color-accent)',
  className = '',
}: IntensityGaugeProps) {
  const clampedValue = Math.max(0, Math.min(value, maxValue));

  return (
    <div className={`flex items-center justify-between w-full gap-4 ${className}`}>
      <span className="text-[0.6rem] tracking-[0.3em] uppercase text-[var(--color-text-subtle)] font-medium select-none">
        {label}
      </span>
      <div
        className="flex items-center gap-1.5"
        aria-label={`${label}: ${clampedValue} of ${maxValue}`}
      >
        {Array.from({ length: maxValue }, (_, index) => {
          const isFilled = index < clampedValue;
          return (
            <span
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isFilled ? '' : 'border opacity-30'
              }`}
              style={
                isFilled
                  ? { backgroundColor: accentColor }
                  : { borderColor: accentColor }
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export interface ProductMetricsProps {
  product: Pick<Product, 'longevity' | 'projection'> | { longevity: Longevity; projection: Projection };
  className?: string;
  accentColor?: string;
}

export function ProductMetrics({
  product,
  className = 'space-y-3 w-full',
  accentColor,
}: ProductMetricsProps) {
  const longevityValue = LONGEVITY_MAP[product.longevity] ?? 3;
  const projectionValue = PROJECTION_MAP[product.projection] ?? 3;

  return (
    <div className={className}>
      <IntensityGauge
        label="Longevity"
        value={longevityValue}
        accentColor={accentColor}
      />
      <IntensityGauge
        label="Projection"
        value={projectionValue}
        accentColor={accentColor}
      />
    </div>
  );
}

export default IntensityGauge;
