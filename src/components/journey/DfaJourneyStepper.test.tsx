import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DfaJourneyStepper from './DfaJourneyStepper';
import { DFA_JOURNEY_STORAGE_KEY, getDfaJourneySnapshot } from '../../lib/dfaJourney';

describe('DfaJourneyStepper', () => {
  beforeEach(() => {
    window.localStorage.clear();
    getDfaJourneySnapshot();
  });

  it('renders default journey copy when no progress exists', () => {
    render(
      <MemoryRouter>
        <DfaJourneyStepper currentKey="profile" />
      </MemoryRouter>
    );

    expect(screen.getByText('Your DFA journey')).toBeInTheDocument();
    expect(screen.getByText('0% complete')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start journey/i })).toHaveAttribute('href', '/service-catalog');
  });

  it('renders persisted progress and custom CTA when local progress exists', () => {
    window.localStorage.setItem(
      DFA_JOURNEY_STORAGE_KEY,
      JSON.stringify({
        phases: [
          { key: 'profile', id: 1, visited: true, completed: true },
          { key: 'dfa', id: 2, visited: true, completed: false },
          { key: 'plan', id: 3, visited: false, completed: false },
          { key: 'hub', id: 4, visited: false, completed: false },
        ],
        resumePath: '/digital-footprint',
      })
    );

    render(
      <MemoryRouter>
        <DfaJourneyStepper currentKey="dfa" ctaHref="/stories" ctaLabel="Read Privacy Panda story" />
      </MemoryRouter>
    );

    expect(screen.getByText('50% complete')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /read privacy panda story/i })).toHaveAttribute('href', '/stories');
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('In progress')).toBeInTheDocument();
  });

  it('renders strip variant without full card title', () => {
    render(
      <MemoryRouter>
        <DfaJourneyStepper variant="strip" currentKey="dfa" ctaHref="/stories" ctaLabel="Read Privacy Panda story" />
      </MemoryRouter>
    );

    expect(screen.queryByText('Your DFA journey')).not.toBeInTheDocument();
    expect(screen.getByLabelText('DFA journey progress')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /read privacy panda story/i })).toHaveAttribute('href', '/stories');
    expect(screen.getByRole('link', { name: /run digital footprint analysis/i })).toHaveAttribute('aria-current', 'step');
  });
});
