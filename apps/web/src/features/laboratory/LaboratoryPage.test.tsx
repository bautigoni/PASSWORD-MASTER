import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LaboratoryPage } from './LaboratoryPage';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual };
});

describe('LaboratoryPage', () => {
  it('shows entropy when typing', () => {
    render(<MemoryRouter><LaboratoryPage /></MemoryRouter>);
    const input = screen.getByPlaceholderText('Escribe una contraseña…');
    fireEvent.change(input, { target: { value: 'Tr0p!c4l-2026' } });
    expect(screen.getByText(/bits/i)).toBeInTheDocument();
  });
});
