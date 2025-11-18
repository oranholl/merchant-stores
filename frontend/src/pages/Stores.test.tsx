import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Stores } from '../pages/Stores';
import * as api from '../services/api';

vi.mock('../services/api');

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Stores', () => {
  const mockStores = {
    data: {
      data: [
        {
          _id: '1',
          name: 'Tech Haven',
          description: 'Electronics store',
          city: 'New York',
          cityType: 'big' as const,
          address: '123 Main St',
          phone: '555-0101',
          email: 'info@techhaven.com',
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          _id: '2',
          name: 'Fashion Central',
          description: 'Fashion store',
          city: 'Los Angeles',
          cityType: 'big' as const,
          isActive: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays loading state initially', () => {
    vi.mocked(api.getStores).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<Stores />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders stores after successful fetch', async () => {
    vi.mocked(api.getStores).mockResolvedValue(mockStores as any);

    renderWithRouter(<Stores />);

    await waitFor(() => {
      expect(screen.getByText('Tech Haven')).toBeInTheDocument();
      expect(screen.getByText('Fashion Central')).toBeInTheDocument();
    });
  });

  it('shows empty state when no stores exist', async () => {
    vi.mocked(api.getStores).mockResolvedValue({ data: { data: [] } } as any);

    renderWithRouter(<Stores />);

    await waitFor(() => {
      expect(screen.getByText(/No stores yet. Create your first store!/i)).toBeInTheDocument();
    });
  });

  it('displays create store form when New Store button clicked', async () => {
    vi.mocked(api.getStores).mockResolvedValue(mockStores as any);
    const user = userEvent.setup();

    renderWithRouter(<Stores />);

    await waitFor(() => {
      expect(screen.getByText('Tech Haven')).toBeInTheDocument();
    });

    const newStoreButton = screen.getByText('+ New Store');
    await user.click(newStoreButton);

    expect(screen.getByText('Create New Store')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Store Name')).toBeInTheDocument();
  });

  it('creates a new store when form submitted', async () => {
    vi.mocked(api.getStores).mockResolvedValue(mockStores as any);
    vi.mocked(api.createStore).mockResolvedValue({ data: { data: mockStores.data.data[0] } } as any);
    const user = userEvent.setup();

    renderWithRouter(<Stores />);

    await waitFor(() => {
      expect(screen.getByText('+ New Store')).toBeInTheDocument();
    });

    await user.click(screen.getByText('+ New Store'));

    await user.type(screen.getByPlaceholderText('Store Name'), 'New Store');
    await user.type(screen.getByPlaceholderText('Description'), 'New Description');
    await user.type(screen.getByPlaceholderText('City'), 'Chicago');

    await user.click(screen.getByText('Create Store'));

    await waitFor(() => {
      expect(api.createStore).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Store',
          description: 'New Description',
          city: 'Chicago',
        })
      );
    });
  });

  it('shows edit form when Edit button clicked', async () => {
    vi.mocked(api.getStores).mockResolvedValue(mockStores as any);
    const user = userEvent.setup();

    renderWithRouter(<Stores />);

    await waitFor(() => {
      expect(screen.getByText('Tech Haven')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    expect(screen.getByText('Edit Store')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Tech Haven')).toBeInTheDocument();
  });

  it('updates store when edit form submitted', async () => {
    vi.mocked(api.getStores).mockResolvedValue(mockStores as any);
    vi.mocked(api.updateStore).mockResolvedValue({ data: { data: mockStores.data.data[0] } } as any);
    const user = userEvent.setup();

    renderWithRouter(<Stores />);

    await waitFor(() => {
      expect(screen.getByText('Tech Haven')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    await user.click(editButtons[0]);

    const nameInput = screen.getByDisplayValue('Tech Haven');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Store Name');

    await user.click(screen.getByText('Update Store'));

    await waitFor(() => {
      expect(api.updateStore).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          name: 'Updated Store Name',
        })
      );
    });
  });

  it('deletes store when Delete button clicked and confirmed', async () => {
    vi.mocked(api.getStores).mockResolvedValue(mockStores as any);
    vi.mocked(api.deleteStore).mockResolvedValue({} as any);
    
    window.confirm = vi.fn(() => true);

    renderWithRouter(<Stores />);

    await waitFor(() => {
      expect(screen.getByText('Tech Haven')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(api.deleteStore).toHaveBeenCalledWith('1');
    });
  });

  it('does not delete store when deletion cancelled', async () => {
    vi.mocked(api.getStores).mockResolvedValue(mockStores as any);
    
    window.confirm = vi.fn(() => false);

    renderWithRouter(<Stores />);

    await waitFor(() => {
      expect(screen.getByText('Tech Haven')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(api.deleteStore).not.toHaveBeenCalled();
  });

  it('displays store details correctly', async () => {
    vi.mocked(api.getStores).mockResolvedValue(mockStores as any);

    renderWithRouter(<Stores />);

    await waitFor(() => {
      expect(screen.getByText('Tech Haven')).toBeInTheDocument();
      expect(screen.getByText('Electronics store')).toBeInTheDocument();
      expect(screen.getByText(/New York/)).toBeInTheDocument();
      expect(screen.getByText(/Address:/)).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
  });
});
