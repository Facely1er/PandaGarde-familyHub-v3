# Privacy Engineering Standard

## Mandatory Principles

- Privacy by Design
- Data Minimization
- Purpose Limitation
- Security by Default
- Zero Behavioral Advertising

## Engineering Requirements

- Client-side processing preferred
- Pseudonymization required
- RLS mandatory
- No hidden telemetry
- No invasive analytics

## Implementation Checklist

- [ ] Data inventory documented per feature
- [ ] Consent gates before new data collection
- [ ] Local encryption for family PII where stored in browser
- [ ] Log scrubbing for child identifiers
- [ ] Third-party script review with no behavioral tracking SDKs
- [ ] Privacy impact assessment for schema or API changes
