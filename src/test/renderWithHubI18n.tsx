import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

export function renderWithHubI18n(ui: React.ReactElement, options?: RenderOptions) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>, options);
}
