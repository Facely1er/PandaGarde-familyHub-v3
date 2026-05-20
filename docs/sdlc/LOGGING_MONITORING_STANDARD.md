# Logging & Monitoring Standard

## Requirements

- security event logging
- moderation event logging
- operational monitoring
- uptime monitoring

## Restrictions

- no sensitive child data in logs
- pseudonymization required

## Log Categories

| Category | Examples | Retention |
|----------|----------|-----------|
| Security | auth failures, permission denials | 90 days pseudonymized |
| Moderation | flagged content, AI blocks | 1 year pseudonymized |
| Operational | uptime, build deploy | 30 days |
| Audit | consent changes, data export | 1 year |

## Alerting

- S1 child safety events: immediate on-call notification
- Production downtime: 15-minute escalation
- Dependency CVE critical: block release until mitigated or accepted risk documented
