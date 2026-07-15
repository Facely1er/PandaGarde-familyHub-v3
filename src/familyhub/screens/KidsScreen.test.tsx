import { describe, expect, it, beforeEach, vi } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { FamilyProvider } from '../../contexts/FamilyContext';
import { FamilyProgressProvider } from '../../contexts/FamilyProgressContext';
import { HubFamilyProvider } from '../../contexts/HubFamilyContext';
import KidsScreen from './KidsScreen';
import { renderWithHubI18n } from '../../test/renderWithHubI18n';

vi.mock('../hubFamilySync', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../hubFamilySync')>();
  return {
    ...actual,
    reconcileHubAndContext: vi.fn(async () => actual.loadHubMembers()),
  };
});

vi.mock('../../utils/localStorageManager', async (importOriginal) => {
  return importOriginal<typeof import('../../utils/localStorageManager')>();
});

const renderScreen = () =>
  renderWithHubI18n(
    <MemoryRouter>
      <FamilyProvider>
        <FamilyProgressProvider>
          <HubFamilyProvider>
            <KidsScreen />
          </HubFamilyProvider>
        </FamilyProgressProvider>
      </FamilyProvider>
    </MemoryRouter>
  );

describe('KidsScreen', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('shows age-matched preview in add dialog for ages 5–17 without crashing', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: /add your first member/i }));
    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'Alex' } });
    fireEvent.change(screen.getByLabelText(/^age$/i), { target: { value: '9' } });

    expect(screen.getByText(/age-matched activities/i)).toBeInTheDocument();
    expect(screen.queryByText(/navigation error/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument();
  });

  it('shows validation errors instead of failing silently', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: /add your first member/i }));
    await user.click(screen.getByRole('button', { name: /^add member$/i }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
  });
});
