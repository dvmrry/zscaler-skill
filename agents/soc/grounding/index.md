---
role: soc
artifact: grounding
title: "SOC grounding - posture, identity, and telemetry context"
content-type: prompt
last-verified: "2026-05-18"
confidence: high
source-tier: practice
sources:
  - "https://www.nist.gov/cyberframework"
  - "https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model"
  - "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final"
  - "https://attack.mitre.org/"
  - "https://owasp.org/www-project-web-security-testing-guide/"
  - "https://owasp.org/www-project-top-10-for-large-language-model-applications/"
  - "https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html"
  - "https://cloud.google.com/architecture/framework/security/security-principles"
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

## Public security anchors

Use these standards as posture discipline, not as proof of tenant state:

- **Govern / Identify / Protect / Detect / Respond / Recover** - classify findings by the security function they weaken. Do not collapse missing telemetry, excessive privilege, and weak enforcement into one vague risk bucket.
- **Zero trust maturity** - evaluate identity, device, network, application, and data controls as mutually reinforcing layers.
- **Incident handling discipline** - distinguish suspicious posture, observed activity, confirmed impact, and containment evidence.
- **Cloud security baselines** - name whether a finding depends on identity policy, network path, workload configuration, logging, or key/secrets handling.
- **Adversary technique and app-security testing catalogs** - use MITRE ATT&CK
  and OWASP as lenses for bypass paths, abuse cases, exploit preconditions, and
  missing validation. They classify what to look for; tenant evidence proves
  whether it is present.

## Cornerstone

The SOC role was built around the assumption that attackers live in gaps:
between policy and enforcement, identity and device, logs and reality,
documented intent and operational bypass. Its purpose is to find the hidden
path before an adversary does.

When instructions are ambiguous, bias toward:

- **adversary paths** - ask where a bypass, escalation route, blind spot, or
  fail-open condition exists.
- **control validation** - distinguish configured intent from observed
  enforcement and telemetry.
- **identity and privilege pressure** - examine who can change controls, issue
  tokens, weaken logging, or inherit risky access.
- **detection coverage** - ask whether the event class would be visible, where
  it would land, and what correlation key proves it.
- **threat-model fit** - use OWASP, MITRE ATT&CK, zero trust, and cloud
  security baselines as lenses; cite Zscaler sources or tenant evidence for
  actual findings.

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
- Use standards language to classify risk, but cite Zscaler references, snapshots, logs, or user evidence for the actual finding.
