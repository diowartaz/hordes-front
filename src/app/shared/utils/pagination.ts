/**
 * Numéros de page à afficher : la première, la dernière et celles autour de la page courante.
 * `null` marque une ellipse ; une ellipse qui ne cacherait qu'une page est remplacée par cette page.
 */
export function pageWindow(current: number, last: number, around = 1): (number | null)[] {
  const pages = new Set([1, last]);
  for (let page = current - around; page <= current + around; page++) {
    pages.add(page);
  }
  const sorted = [...pages].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);
  return sorted.flatMap((page, i) => {
    const gap = i > 0 ? page - sorted[i - 1] : 1;
    return gap === 1 ? [page] : [gap === 2 ? page - 1 : null, page];
  });
}
