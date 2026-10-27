import { formatCompact } from './format';

describe('formatCompact', () => {
  it('garde les petits nombres tels quels', () => {
    expect(formatCompact(0)).toBe('0');
    expect(formatCompact(999)).toBe('999');
  });

  it('abrège les milliers et les millions avec au plus une décimale', () => {
    expect(formatCompact(1200)).toBe('1.2K');
    expect(formatCompact(10000)).toBe('10K');
    expect(formatCompact(12345)).toBe('12.3K');
    expect(formatCompact(1500000)).toBe('1.5M');
  });
});
