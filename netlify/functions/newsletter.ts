import { changeNewsletterSubscription, type NewsletterAction } from '../../src/lib/newsletterList';

type FunctionEvent = {
  httpMethod?: string;
  body?: string | null;
};

function json(statusCode: number, payload: { ok?: boolean; error?: string }) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  };
}

function isAction(value: unknown): value is NewsletterAction {
  return value === 'subscribe' || value === 'unsubscribe';
}

export const handler = async (event: FunctionEvent) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let action: unknown;
  let email: unknown;
  try {
    const parsed: unknown = JSON.parse(event.body || '{}');
    if (parsed && typeof parsed === 'object') {
      action = 'action' in parsed ? parsed.action : undefined;
      email = 'email' in parsed ? parsed.email : undefined;
    }
  } catch {
    return json(400, { error: 'Invalid request.' });
  }

  if (!isAction(action) || typeof email !== 'string') {
    return json(400, { error: 'Invalid request.' });
  }

  const result = await changeNewsletterSubscription(
    action,
    email,
    process.env.BUTTONDOWN_API_KEY ?? ''
  );

  if (result.ok) {
    return json(200, { ok: true });
  }
  return json(result.status, { error: result.error });
};
