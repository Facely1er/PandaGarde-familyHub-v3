import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { FamilyProvider } from '../../contexts/FamilyContext';
import AppShell from './AppShell';

const renderShell = (initialEntry = '/family-hub/dashboard') =>
  render(
    <ThemeProvider>
      <FamilyProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/family-hub" element={<AppShell />}>
              <Route path="dashboard" element={<div>Dashboard Page</div>} />
              <Route path="journey" element={<div>Journey Page</div>} />
              <Route path="kids" element={<div>Kids Page</div>} />
              <Route path="activities" element={<div>Activities Page</div>} />
              <Route path="settings" element={<div>Settings Page</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </FamilyProvider>
    </ThemeProvider>
  );

describe('AppShell navigation', () => {
  it('marks the current route with aria-current', () => {
    renderShell('/family-hub/dashboard');

    expect(screen.getByRole('link', { name: /Dashboard — today/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /Family profiles/i })).not.toHaveAttribute('aria-current');
  });

  it('opens settings from the header', async () => {
    const user = userEvent.setup();
    renderShell('/family-hub/dashboard');

    await user.click(screen.getByRole('link', { name: /Settings and help/i }));

    expect(screen.getByText('Settings Page')).toBeInTheDocument();
  });

  it('supports keyboard arrow navigation between tabs', () => {
    renderShell('/family-hub/dashboard');

    const nav = screen.getByRole('navigation', { name: /primary family hub navigation/i });
    const dashboardLink = screen.getByRole('link', { name: /Dashboard — today/i });
    const journeyLink = screen.getByRole('link', { name: /Mission progress/i });

    dashboardLink.focus();
    fireEvent.keyDown(nav, { key: 'ArrowRight' });

    expect(journeyLink).toHaveFocus();
  });

  it('navigates when a tab is selected', async () => {
    const user = userEvent.setup();
    renderShell('/family-hub/dashboard');

    await user.click(screen.getByRole('link', { name: /Privacy missions for your family/i }));

    expect(screen.getByText('Activities Page')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Privacy missions for your family/i })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
