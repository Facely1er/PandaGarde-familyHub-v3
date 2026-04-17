import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppShell from './AppShell';

const renderShell = (initialEntry = '/family-hub/dashboard') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/family-hub" element={<AppShell />}>
          <Route path="dashboard" element={<div>Dashboard Page</div>} />
          <Route path="kids" element={<div>Kids Page</div>} />
          <Route path="activities" element={<div>Activities Page</div>} />
          <Route path="progress" element={<div>Progress Page</div>} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe('AppShell navigation', () => {
  it('marks the current route with aria-current', () => {
    renderShell('/family-hub/dashboard');

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Kids' })).not.toHaveAttribute('aria-current');
  });

  it('supports keyboard arrow navigation between tabs', () => {
    renderShell('/family-hub/dashboard');

    const nav = screen.getByRole('navigation', { name: /primary family hub navigation/i });
    const dashboardLink = screen.getByRole('link', { name: 'Dashboard' });
    const kidsLink = screen.getByRole('link', { name: 'Kids' });

    dashboardLink.focus();
    fireEvent.keyDown(nav, { key: 'ArrowRight' });

    expect(kidsLink).toHaveFocus();
  });

  it('navigates when a tab is selected', async () => {
    const user = userEvent.setup();
    renderShell('/family-hub/dashboard');

    await user.click(screen.getByRole('link', { name: 'Activities' }));

    expect(screen.getByText('Activities Page')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Activities' })).toHaveAttribute('aria-current', 'page');
  });
});

