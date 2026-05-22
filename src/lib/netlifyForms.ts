import { logger } from './logger';

/** Netlify form name — must match the hidden form in index.html */
export const CONTACT_FORM_NAME = 'contact';

function shouldSubmitToNetlify(): boolean {
  if (import.meta.env.PROD) return true;
  return import.meta.env.VITE_NETLIFY_FORMS_DEV === 'true';
}

export function encodeNetlifyFormBody(
  formName: string,
  fields: Record<string, string | undefined>
): string {
  const params = new URLSearchParams();
  params.set('form-name', formName);
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== '') {
      params.set(key, value);
    }
  }
  return params.toString();
}

/**
 * POST to Netlify Forms (SPA workflow). Requires a static form in index.html
 * with the same name and field names so Netlify detects the form at build time.
 */
export async function submitNetlifyForm(
  formName: string,
  fields: Record<string, string | undefined>
): Promise<void> {
  if (!shouldSubmitToNetlify()) {
    logger.debug('Netlify form skipped (local dev)', { formName, fields });
    return;
  }

  const body = encodeNetlifyFormBody(formName, fields);
  const response = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    throw new Error(`Netlify form submission failed (${response.status})`);
  }
}

export async function submitContactNetlifyForm(fields: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType: string;
  ageGroup?: string;
  newsletter?: boolean;
  botField?: string;
}): Promise<void> {
  if (fields.botField?.trim()) {
    logger.debug('Contact form honeypot triggered — skipping submission');
    return;
  }

  await submitNetlifyForm(CONTACT_FORM_NAME, {
    name: fields.name.trim(),
    email: fields.email.trim(),
    phone: fields.phone?.trim(),
    subject: fields.subject.trim(),
    inquiryType: fields.inquiryType,
    ageGroup: fields.ageGroup?.trim(),
    message: fields.message.trim(),
    newsletter: fields.newsletter ? 'yes' : undefined,
  });
}
