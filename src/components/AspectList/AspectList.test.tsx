import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AspectList } from './AspectList';
import type { ChartData } from '../../types/astrology';

// Mock getInterpretation
vi.mock('../../data/interpretations', () => ({
    getInterpretation: (p1: string, p2: string, type: string) => `Mock reading for ${p1} ${type} ${p2}`
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>
    }
}));

const mockData: ChartData = {
    planets: [],
    houses: [],
    angles: { asc: 0, mc: 0, dsc: 0, ic: 0 },
    aspects: [
        { planet1: 'Sun', planet2: 'Moon', type: 'Conjunction', orb: 2 },
        { planet1: 'Venus', planet2: 'Mars', type: 'Square', orb: 4 }
    ],
    meta: {
        isDayChart: true,
        date: new Date(),
        location: { lat: 0, long: 0 }
    }
};

describe('AspectList', () => {
    it('renders list of aspects', () => {
        render(<AspectList data={mockData} />);
        expect(screen.getByText('Sun Conjunction Moon')).toBeInTheDocument();
        expect(screen.getByText('Venus Square Mars')).toBeInTheDocument();
    });

    it('displays interpretation text', () => {
        render(<AspectList data={mockData} />);
        expect(screen.getByText('Mock reading for Sun Conjunction Moon')).toBeInTheDocument();
    });

    it('renders empty state if no aspects', () => {
        const emptyData = { ...mockData, aspects: [] };
        render(<AspectList data={emptyData} />);
        expect(screen.queryByText(/Conjunction/)).not.toBeInTheDocument();
        // Maybe check for a "No major aspects" message? Or just nothing.
        // For now, let's assume it renders nothing or just header.
    });
});
