import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Analytics } from '../pages/Analytics';
import * as api from '../services/api';

vi.mock('../services/api');

describe('Analytics', () => {
  const mockAnalyticsData = {
    data: {
      opportunities: [
        {
          category: 'Electronics',
          cityType: 'small',
          reason: 'No stores offering Electronics in small locations',
        },
      ],
      byCities: [
        {
          city: 'New York',
          storeCount: 3,
          categories: [{ category: 'Electronics' }],
        },
      ],
      categoryGaps: [
        {
          cityType: 'small',
          missingCategories: ['Electronics', 'Fashion'],
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(api.getMarketDensity).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<Analytics />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders analytics data after successful fetch', async () => {
    vi.mocked(api.getMarketDensity).mockResolvedValue(mockAnalyticsData as any);

    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('Market Intelligence')).toBeInTheDocument();
    });

    expect(screen.getByText('💡 Opportunities')).toBeInTheDocument();
    expect(screen.getByText('🏙️ Markets')).toBeInTheDocument();
    expect(screen.getByText('📍 What\'s Missing')).toBeInTheDocument();
  });

  it('displays error message when API fails', async () => {
    vi.mocked(api.getMarketDensity).mockRejectedValue(new Error('API Error'));

    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load analytics data')).toBeInTheDocument();
    });
  });

  it('shows empty state when no data available', async () => {
    vi.mocked(api.getMarketDensity).mockResolvedValue({
      data: {
        opportunities: [],
        byCities: [],
        categoryGaps: [],
      },
    } as any);

    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(/No analytics data available/i)).toBeInTheDocument();
    });
  });

  it('renders opportunities section when opportunities exist', async () => {
    vi.mocked(api.getMarketDensity).mockResolvedValue(mockAnalyticsData as any);

    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText(/Open a Electronics store in small area/i)).toBeInTheDocument();
    });
  });

  it('renders markets table when city data exists', async () => {
    vi.mocked(api.getMarketDensity).mockResolvedValue(mockAnalyticsData as any);

    render(<Analytics />);

    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('limits opportunities to first 5', async () => {
    const manyOpportunities = {
      data: {
        opportunities: Array(10).fill({
          category: 'Electronics',
          cityType: 'small',
          reason: 'Test reason',
        }),
        byCities: [],
        categoryGaps: [],
      },
    };

    vi.mocked(api.getMarketDensity).mockResolvedValue(manyOpportunities as any);

    render(<Analytics />);

    await waitFor(() => {
      const cards = screen.getAllByText(/Open a Electronics store/i);
      expect(cards).toHaveLength(5);
    });
  });
});
