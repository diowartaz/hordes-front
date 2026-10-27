const compactFormat = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

/** Nombre court pour les espaces étroits : 950, 1.2K, 10K, 1.5M */
export function formatCompact(value: number): string {
  return compactFormat.format(value);
}
