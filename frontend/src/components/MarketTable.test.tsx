import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketTable } from '../components/MarketTable';

describe('MarketTable', () => {
  const mockCities = [
    {
      city: 'New York',
      storeCount: 3,
      categories: [
        { category: 'Electronics' },
        { category: 'Fashion' },
        { category: 'Food' },
      ],
    },
    {
      city: 'Los Angeles',
      storeCount: 2,
      categories: [
        { category: 'Fashion' },
        { category: 'Food' },
      ],
    },
  ];

  it('renders table headers correctly', () => {
    render(<MarketTable cities={mockCities} />);

    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.getByText('Stores')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('renders city data rows', () => {
    render(<MarketTable cities={mockCities} />);

    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('displays first 3 categories and shows ellipsis for more', () => {
    const cityWithManyCategories = [
      {
        city: 'Chicago',
        storeCount: 5,
        categories: [
          { category: 'Electronics' },
          { category: 'Fashion' },
          { category: 'Food' },
          { category: 'Tools' },
          { category: 'Sports' },
        ],
      },
    ];

    render(<MarketTable cities={cityWithManyCategories} />);

    const categoriesText = screen.getByText(/Electronics, Fashion, Food.../);
    expect(categoriesText).toBeInTheDocument();
  });

  it('renders empty table when no cities provided', () => {
    render(<MarketTable cities={[]} />);

    expect(screen.getByText('City')).toBeInTheDocument();
    expect(screen.queryByText('New York')).not.toBeInTheDocument();
  });

  it('applies correct table CSS classes', () => {
    const { container } = render(<MarketTable cities={mockCities} />);

    const table = container.querySelector('.market-table');
    expect(table).toBeInTheDocument();
  });
});
