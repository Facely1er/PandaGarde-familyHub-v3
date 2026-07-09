import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '../../contexts/ThemeContext';
import HubThemeToggle from './HubThemeToggle';
import i18n from '../../i18n';

const renderToggle = () =>
  render(
    <ThemeProvider>
      <HubThemeToggle />
    </ThemeProvider>
  );

describe('HubThemeToggle', () => {
  beforeEach(async () => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach((key) => delete store[key]);
      },
    });
    await i18n.changeLanguage('en');
  });

  it('renders light and dark segments', () => {
    renderToggle();

    expect(screen.getByRole('radiogroup', { name: /theme/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /light mode/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /dark mode/i })).toBeInTheDocument();
  });

  it('selects dark mode when dark segment is clicked', async () => {
    const user = userEvent.setup();
    renderToggle();

    const darkOption = screen.getByRole('radio', { name: /dark mode/i });
    await user.click(darkOption);

    expect(darkOption).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /light mode/i })).toHaveAttribute('aria-checked', 'false');
  });
});
