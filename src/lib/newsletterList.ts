/**
 * Buttondown list changes. Called only from the Netlify function so the API key
 * never ships to the browser. Publishing an issue is done in Buttondown.
 */
export type NewsletterAction = 'subscribe' | 'unsubscribe';

export type NewsletterListResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

const SUBSCRIBERS_URL = 'https://api.buttondown.com/v1/subscribers';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function headers(apiKey: string): HeadersInit {
  return {
    Authorization: `Token ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

export async function changeNewsletterSubscription(
  action: NewsletterAction,
  email: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch
): Promise<NewsletterListResult> {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_PATTERN.test(normalized)) {
    return { ok: false, status: 400, error: 'Enter a valid email address.' };
  }
  if (!apiKey.trim()) {
    return { ok: false, status: 503, error: 'Newsletter mailing is not configured yet.' };
  }

  if (action === 'subscribe') {
    const response = await fetchImpl(SUBSCRIBERS_URL, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({ email_address: normalized, type: 'regular' }),
    });
    if (response.ok) {
      return { ok: true };
    }
    const text = await response.text();
    if (response.status === 400 && /already/i.test(text)) {
      return { ok: true };
    }
    return { ok: false, status: response.status, error: 'Could not add that address. Try again.' };
  }

  const response = await fetchImpl(`${SUBSCRIBERS_URL}/${encodeURIComponent(normalized)}`, {
    method: 'PATCH',
    headers: headers(apiKey),
    body: JSON.stringify({ type: 'unsubscribed' }),
  });
  if (response.ok) {
    return { ok: true };
  }
  if (response.status === 404) {
    return { ok: false, status: 404, error: 'That address is not on the newsletter list.' };
  }
  return { ok: false, status: response.status, error: 'Could not unsubscribe. Try again.' };
}
