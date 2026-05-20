# API Standard

## Principles

- RESTful APIs
- minimal data exposure
- authenticated access
- rate limiting
- audit logging

## Security

- JWT validation
- RBAC enforcement
- encrypted transport
- request validation

## Versioning and Contracts

- APIs SHALL be versioned in the path (`/v1/...`) or via explicit Accept headers
- Breaking changes require a new major version and migration guide
- OpenAPI or equivalent schema SHALL be published for external integrators

## Error Handling

- Return generic messages to clients; log detailed errors server-side
- Never include stack traces or internal IDs in child-facing responses
- Use standard HTTP status codes consistently

## Rate Limiting

- Authenticated guardians: reasonable per-family limits
- Anonymous endpoints: strict IP-based throttling
- School tenant APIs: per-tenant quotas
