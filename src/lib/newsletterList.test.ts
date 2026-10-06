import { describe, expect, it, vi } from 'vitest';
import { changeNewsletterSubscription } from './newsletterList';

function jsonResponse(status: number, body: string): Response {
  return new Response(body, { status });
}

describe('changeNewsletterSubscription', () => {
  it('rejects a bad email before calling the mail service', async () => {
    const fetchImpl = vi.fn();
    const result = await changeNewsletterSubscription('subscribe', 'not-an-email', 'key', fetchImpl);
    expect(result).toEqual({ ok: false, status: 400, error: 'Enter a valid email address.' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('reports when the API key is missing', async () => {
    const result = await changeNewsletterSubscription('subscribe', 'a@b.co', '  ');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(503);
    }
  });

  it('subscribes a new address', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(201, '{}'));
    const result = await changeNewsletterSubscription('subscribe', 'Ada@Example.com', 'secret', fetchImpl);
    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.buttondown.com/v1/subscribers',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email_address: 'ada@example.com', type: 'regular' }),
      })
    );
  });

  it('treats an existing subscriber as success', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse(400, '{"detail":"Subscriber already exists"}')
    );
    const result = await changeNewsletterSubscription('subscribe', 'ada@example.com', 'secret', fetchImpl);
    expect(result).toEqual({ ok: true });
  });

  it('marks an address unsubscribed', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(200, '{}'));
    const result = await changeNewsletterSubscription('unsubscribe', 'ada@example.com', 'secret', fetchImpl);
    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.buttondown.com/v1/subscribers/ada%40example.com',
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('says when the address is not on the list', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(404, '{}'));
    const result = await changeNewsletterSubscription('unsubscribe', 'ada@example.com', 'secret', fetchImpl);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.status).toBe(404);
    }
  });
});
