import { describe, it, expect } from 'vitest';
import { getBoundRuler } from './bounds';

describe('Bounds (Terms)', () => {
    it('returns Jupiter for Aries 0-6', () => {
        expect(getBoundRuler('Aries', 0)).toBe('Jupiter');
        expect(getBoundRuler('Aries', 5.99)).toBe('Jupiter');
    });

    it('returns Venus for Aries 6-12', () => {
        expect(getBoundRuler('Aries', 6.01)).toBe('Venus');
        expect(getBoundRuler('Aries', 11.99)).toBe('Venus');
    });

    it('returns Saturn for Aries 25-30', () => {
        expect(getBoundRuler('Aries', 25.1)).toBe('Saturn');
        expect(getBoundRuler('Aries', 29.9)).toBe('Saturn');
    });

    it('handles boundary conditions correctly (less than)', () => {
        // If logic is < endDegree
        // Aries Jupiter ends at 6. So 6.0 should be Venus?
        // Usually 0 <= x < 6 is Jupiter
        expect(getBoundRuler('Aries', 6)).toBe('Venus');
    });
});
