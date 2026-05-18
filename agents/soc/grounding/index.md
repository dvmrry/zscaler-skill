---
role: soc
artifact: grounding
title: "SOC grounding - posture, identity, and telemetry context"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "references/shared/admin-rbac.md"
  - "references/shared/audit-logs.md"
  - "references/shared/siem-log-mapping.md"
  - "references/zidentity/admin-rbac.md"
  - "references/zia/ssl-inspection.md"
  - "references/zia/cloud-app-control.md"
dependencies: []
author-status: draft
---

# SOC grounding - posture, identity, and telemetry context

Use this grounding index before `/z-soc` turns a scope into posture findings.

## Always load for SOC review

- [`references/shared/admin-rbac.md`](../../../references/shared/admin-rbac.md) - cross-product admin role posture
- [`references/shared/audit-logs.md`](../../../references/shared/audit-logs.md) - audit-log availability and limits
- [`references/shared/siem-log-mapping.md`](../../../references/shared/siem-log-mapping.md) - telemetry source mapping

## Load by subtype

### `access`

- [`references/zidentity/admin-rbac.md`](../../../references/zidentity/admin-rbac.md)
- [`references/zidentity/api-clients.md`](../../../references/zidentity/api-clients.md)
- [`references/zidentity/user-entitlements.md`](../../../references/zidentity/user-entitlements.md)
- [`references/zidentity/step-up-authentication.md`](../../../references/zidentity/step-up-authentication.md)

### `policy`

- [`references/zia/url-filtering.md`](../../../references/zia/url-filtering.md)
- [`references/zia/ssl-inspection.md`](../../../references/zia/ssl-inspection.md)
- [`references/zia/cloud-app-control.md`](../../../references/zia/cloud-app-control.md)
- [`references/zpa/app-segments.md`](../../../references/zpa/app-segments.md)
- [`references/zpa/policy-precedence.md`](../../../references/zpa/policy-precedence.md)

### `coverage` or `activity`

- [`references/shared/siem-log-mapping.md`](../../../references/shared/siem-log-mapping.md)
- [`references/zia/audit-logs.md`](../../../references/zia/audit-logs.md)
- [`references/zpa/audit-logs.md`](../../../references/zpa/audit-logs.md)
- [`references/zwa/audit-logs.md`](../../../references/zwa/audit-logs.md)

## Discipline

- A posture exposure is not proof of exploitation.
- Severity is based on blast radius, control family, and visibility, not on how ugly the config looks.
- Missing telemetry is a finding only when the relevant event class should be observable for the stated threat model.
