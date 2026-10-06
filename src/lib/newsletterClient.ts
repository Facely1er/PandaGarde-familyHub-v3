import type { NewsletterAction } from './newsletterList';

export async function requestNewsletterListChange(
  action: NewsletterAction,
  email: string
): Promise<void> {
  const response = await fetch('/.netlify/functions/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, email }),
  });

  if (response.ok) {
    return;
  }

  let message = 'Newsletter request failed. Try again.';
  try {
    const body: unknown = await response.json();
    if (
      body &&
      typeof body === 'object' &&
      'error' in body &&
      typeof body.error === 'string' &&
      body.error
    ) {
      message = body.error;
    }
  } catch {
    if (response.status === 404) {
      message = 'Newsletter signup is unavailable in this preview. It runs on the deployed site.';
    }
  }
  throw new Error(message);
}
