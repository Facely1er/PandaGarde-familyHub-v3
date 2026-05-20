# Incident Response Standard

## Purpose

Defines how PandaGarde detects, contains, investigates, and remediates security, privacy, and child safety incidents.

## Incident Classification

| Class | Description | Examples |
|-------|-------------|----------|
| I1 — Critical | Active harm or breach involving children | Exposure of child PII, unsafe AI output acted upon |
| I2 — High | Significant privacy or security compromise | Guardian account takeover, RLS bypass |
| I3 — Medium | Limited impact, contained | Failed moderation rule, non-PII outage |
| I4 — Low | Informational | Scan attempt blocked, dependency advisory |

## Response Phases

1. **Detect** — Monitoring, user report, or automated alert
2. **Triage** — Classify severity within 1 hour (I1/I2) or 4 hours (I3/I4)
3. **Contain** — Disable affected feature, revoke tokens, block endpoint
4. **Investigate** — Root cause analysis with pseudonymized logs only
5. **Remediate** — Patch, config fix, or policy update
6. **Communicate** — Internal stakeholders; external per legal guidance
7. **Review** — Post-incident report within 5 business days (I1/I2)

## Child Safety Incidents

I1 child safety incidents SHALL:

- Trigger immediate feature suspension if ongoing risk exists
- Escalate to platform governance and child safety lead
- Be documented per [CHILD_SAFETY_STANDARD.md](./CHILD_SAFETY_STANDARD.md)
- Never include identifiable child details in widely distributed internal tickets

## Regulatory Notification

Legal counsel determines whether COPPA, FERPA, GDPR, or state breach notification applies. Engineering provides factual timeline and scope only.

## Evidence Handling

- Preserve logs with chain of custody
- Restrict access to need-to-know personnel
- Delete forensic copies after retention period unless legally required
