---
role: soc
artifact: grounding
title: "SOC security taxonomy - evidence-first finding classification"
content-type: prompt
last-verified: "2026-05-23"
confidence: high
source-tier: practice
sources:
  - "https://www.nist.gov/cyberframework"
  - "https://www.cisa.gov/resources-tools/resources/zero-trust-maturity-model"
  - "https://attack.mitre.org/"
  - "https://owasp.org/www-project-top-ten/"
  - "https://cwe.mitre.org/"
dependencies: []
author-status: draft
---

# SOC security taxonomy - evidence-first finding classification

Use this taxonomy after tenant evidence exists. Standards classify a finding;
they do not prove it. A SOC finding starts with tenant configuration, logs,
snapshot data, SIEM output, API response, or user-provided evidence. Framework
tags are added only after the evidence shows the exposure.

## Output discipline

Use the taxonomy as a response template for declared findings. The header is
metadata for the human reader; it is not a separate scan artifact.

```markdown
### <finding title>

- Severity: <Critical / High / Medium / Low / Info>
- Record type: finding
- Category: <finding family or SOC subtype>
- Taxonomy: <CWE / OWASP / NIST / CISA / MITRE labels, if applicable>
- Source: <tenant snapshot path, SIEM query result, API response, log, or user evidence>
- Confidence: <high / medium / low / open>
- Status: <Open / Acknowledged / Acceptable / Resolved / Wontfix>

**What to fix**
<operator-facing remediation>

**Evidence and taxonomy mapping**
...
```

Do not add scanner-specific metadata such as run ID, commit, branch, owner,
owner-source, or scan status unless the user explicitly supplies that context
and asks for it.

Every SOC finding that uses a framework tag must include:

- **Evidence** - the observed tenant fact, with source path, log, query result,
  API response, or vendor reference.
- **Framework mapping** - the NIST / CISA / MITRE / OWASP / CWE label, if one
  helps classify the risk.
- **Why the mapping applies** - the specific control weakness or attack
  precondition shown by the evidence.
- **Confidence** - high, medium, low, or open, based on evidence quality.
- **What would disprove it** - the tenant fact, log, or control state that would
  remove or downgrade the finding.

Do not cite OWASP, NIST, MITRE, CISA, or CWE as the only source for a tenant
finding. If the only support is a framework page, write a threat-model note, not
a finding.

## Mapping table

| Finding family | Use when | Do not use when | Framework tags | Evidence required | Example analog |
|---|---|---|---|---|---|
| Secret exposure | Provisioning keys, API credentials, VPN secrets, IdP secrets, or private keys are stored in retrievable snapshots, comments, exports, code, tickets, or logs. | A document merely mentions that a secret exists, or the value is already redacted and no exposure path is shown. | CWE-798; OWASP A02 Cryptographic Failures; NIST CSF Protect; CISA Zero Trust Data / Identity | Exact field or artifact path, redaction status, exposure audience, rotation state, and whether the secret is still valid. | ZPA provisioning keys or VPN credentials present in exported tenant snapshots. |
| Overbroad access / authorization | A rule, role, group, segment, client, or policy grants more access than the stated business scope requires. | The access is broad but explicitly approved, time-bounded, and covered by compensating controls. | CWE-284; CWE-266; OWASP A01 Broken Access Control; NIST CSF Protect; CISA Zero Trust Identity / Application | Principal or scope, granted capability, intended scope, affected resources, last-use or activity evidence if available. | Emergency Access role grants full admin rights without narrower justification. |
| Missing or bypassed enforcement | A control expected to inspect, block, isolate, sandbox, posture-check, or require MFA can be bypassed or is disabled for the relevant path. | The control is intentionally out of path and another equivalent control is documented for the same threat. | CWE-693; OWASP A05 Security Misconfiguration; NIST CSF Protect / Detect; MITRE ATT&CK defense evasion mapping when a concrete technique fits. | Control path, bypass condition, policy order or forwarding evidence, affected traffic/users/apps, and compensating controls. | Sandbox allow bypass permits uninspected risky file types. |
| Telemetry blind spot | Events needed to detect or investigate the threat model are not generated, exported, retained, or queryable. | Logs exist but no alert has been written yet; missing detection logic alone is weaker than missing source telemetry. | NIST CSF Detect; CISA Zero Trust Visibility and Analytics; MITRE ATT&CK data source mapping when applicable. | Expected event class, configured feed/export state, SIEM sourcetype/index evidence, retention, field coverage, and sample query result. | ZPA policy changes are not present in audit log export or SIEM for the reviewed period. |
| Unvalidated trust boundary | Tenant state trusts user-controlled input, unmanaged devices, external networks, source IPs, headers, or app identity without enough validation for the stated threat model. | The trust boundary is documented and constrained by stronger identity, posture, or network controls. | OWASP A01 / A05; CWE-287 or CWE-346 when specific; CISA Zero Trust Network / Device / Application | Boundary, trusted signal, validation control, bypass path, affected apps/users, and proof that the control is missing or weak. | Policy trusts broad source IP ranges without device posture or identity condition. |

## Severity calibration

- **Critical** - exposed secret or control bypass enables tenant-wide or
  cross-product compromise, and evidence shows little or no compensating
  control.
- **High** - privilege, enforcement, or telemetry weakness affects sensitive
  apps, admin paths, broad user groups, or externally reachable paths.
- **Medium** - real weakness with bounded scope, partial compensating controls,
  or incomplete impact evidence.
- **Low / Info** - hygiene issue, weak signal, or standards-mapping note without
  enough tenant evidence for a stronger finding.

Prefer the lowest severity that fits the evidence. Framework severity language
does not override tenant scope.
