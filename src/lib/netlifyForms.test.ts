import { describe, expect, it } from 'vitest';
import { encodeNetlifyFormBody, CONTACT_FORM_NAME } from './netlifyForms';

describe('encodeNetlifyFormBody', () => {
  it('includes form-name and encoded fields', () => {
    const body = encodeNetlifyFormBody(CONTACT_FORM_NAME, {
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Hello & welcome',
      message: 'Test message',
      inquiryType: 'general',
      phone: undefined,
      newsletter: 'yes',
    });

    expect(body).toContain('form-name=contact');
    expect(body).toContain('name=Jane+Doe');
    expect(body).toContain('email=jane%40example.com');
    expect(body).toContain('subject=Hello+%26+welcome');
    expect(body).not.toContain('phone=');
  });
});
