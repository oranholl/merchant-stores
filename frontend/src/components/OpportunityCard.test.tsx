import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OpportunityCard } from '../components/OpportunityCard';

describe('OpportunityCard', () => {
  it('renders opportunity with category and city type', () => {
    render(
      <OpportunityCard
        category="Electronics"
        cityType="small"
        reason="No stores offering Electronics in small locations"
      />
    );

    expect(screen.getByText(/Open a Electronics store in small area/i)).toBeInTheDocument();
    expect(screen.getByText(/No stores offering Electronics in small locations/i)).toBeInTheDocument();
  });

  it('displays the reason text', () => {
    const reason = 'Great market opportunity';
    render(
      <OpportunityCard
        category="Fashion"
        cityType="big"
        reason={reason}
      />
    );

    expect(screen.getByText(reason)).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <OpportunityCard
        category="Food"
        cityType="small"
        reason="Test reason"
      />
    );

    const card = container.querySelector('.opportunity-card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('opportunity-card');
  });
});
