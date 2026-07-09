import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LanguageSwitcher from './LanguageSwitcher';
import i18n from '../i18n';

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders selectable language segments with labels', () => {
    render(<LanguageSwitcher variant="segmented" />);

    expect(screen.getByRole('radiogroup', { name: /select language/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'English' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Français' })).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByRole('radio', { name: 'Español' })).toHaveAttribute('aria-checked', 'false');
  });

  it('changes language when a segment is selected', async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher variant="segmented" />);

    await user.click(screen.getByRole('radio', { name: 'Français' }));

    expect(i18n.resolvedLanguage?.startsWith('fr')).toBe(true);
    expect(screen.getByRole('radio', { name: 'Français' })).toHaveAttribute('aria-checked', 'true');
  });

  it('cycles language from hub header toggle', async () => {
    const user = userEvent.setup();
    await i18n.changeLanguage('en');
    render(<LanguageSwitcher variant="hub" />);

    const toggle = screen.getByRole('button', { name: /english/i });
    expect(toggle).toHaveTextContent('🇺🇸');

    await user.click(toggle);
    expect(i18n.resolvedLanguage?.startsWith('fr')).toBe(true);
    expect(screen.getByRole('button', { name: /français/i })).toHaveTextContent('🇫🇷');

    await user.click(screen.getByRole('button', { name: /français/i }));
    expect(i18n.resolvedLanguage?.startsWith('es')).toBe(true);
  });
});
