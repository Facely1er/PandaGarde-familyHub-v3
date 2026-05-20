# Secure Coding Standard

## Requirements

- TypeScript strict mode
- No secrets in frontend
- CSP enforcement
- Dependency scanning
- Input validation
- Output encoding
- RBAC enforcement
- Secure session handling

## Prohibited

- hardcoded credentials
- unsafe eval
- insecure local storage of secrets
- unvalidated user input

## FamilyHub v3 Practices

- Use `familyHubSecurity.secureStorage` for TTL-wrapped client data
- Sanitize user-generated content before render
- Run `npm audit` and address high/critical findings before release
- Disable Supabase client when credentials are absent (no-backend mode)
- Log security events via `logSecurityEvent` without child PII
