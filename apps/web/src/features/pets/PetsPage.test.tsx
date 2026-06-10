import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PetsPage } from './PetsPage';
import { useGame } from '@/shared/state/gameStore';

describe('PetsPage', () => {
  it('renders all pets and equips one', () => {
    useGame.getState().setPet('byte');
    render(<MemoryRouter><PetsPage /></MemoryRouter>);
    expect(screen.getByText('Byte')).toBeInTheDocument();
    expect(screen.getByText('Cyber Owl')).toBeInTheDocument();
  });
});
