import { describe, it, expect } from 'vitest';
import { getInterpretation } from './interpretations';
import type { Aspect } from '../types/astrology';

describe('Interpretations Data', () => {

    describe('Sign Interpretations', () => {
        it('should return Sun in Aries interpretation', () => {
            const text = getInterpretation('Aries', 'sun');
            expect(text).toContain('courage');
        });

        it('should return Moon in Taurus interpretation', () => {
            const text = getInterpretation('Taurus', 'moon');
            expect(text).toContain('security');
        });

        it('should return Ascendant in Gemini interpretation', () => {
            const text = getInterpretation('Gemini', 'ascendant');
            expect(text).toContain('witty');
        });
    });

    describe('House Interpretations', () => {
        it('should return Sun in 1st House interpretation', () => {
            const text = getInterpretation(1, 'sun-house');
            expect(text).toContain('self-image');
        });

        it('should return Moon in 4th House interpretation', () => {
            const text = getInterpretation(4, 'moon-house');
            expect(text).toContain('home');
        });
    });

    describe('Aspect Interpretations', () => {
        // We will implement these next
        it('should return correct text for Sun Conjunction Moon', () => {
            // We'll rely on an extended signature for getInterpretation in the future
            // getInterpretation(planet1, planet2, type)
            const text = getInterpretation('Sun', 'Moon', 'Conjunction');
            expect(text).toContain('identities are fused');
        });

        it('should return correct text for Sun Square Mars', () => {
            const text = getInterpretation('Sun', 'Mars', 'Square');
            expect(text).toContain('tension');
        });

        it('should return fallback if no interpretation found', () => {
            const text = getInterpretation('Sun', 'Pluto', 'Sextile');
            expect(text).toContain('productive opportunity');
        });
    });
});
