---
description: Zscaler knowledge routing - dynamically load relevant reference docs based on question shape
---

# Zscaler Knowledge Workflow

This workflow routes Zscaler questions to the appropriate reference documentation, loading only what's needed rather than the entire skill.

## Step 1: Check for tenant-specific data

Before answering tenant-specific questions, check whether `snapshot/` has data:

```bash
ls -A snapshot/ | grep -v '^\.gitkeep$'
```

If empty, note this explicitly - you can answer general behavior questions but not tenant-specific lookups.

Also check if `iac/` has production IaC (different from reference IaC under `vendor/`):

```bash
ls -A iac/ | grep -v '^\.gitkeep$'
```

## Step 2: Route based on question shape

Read the appropriate reference file based on the user's question. Start with ONLY the most relevant file - don't read multiple unless the question genuinely spans domains.

| Question shape | Read this file |
|---|---|
| Is URL X in a category? Is it blocked/allowed? (no CAC mentioned) | `references/zia/url-filtering.md` |
| Question mentions Cloud App Control rule (CAC) | `references/zia/cloud-app-control.md` first, then `url-filtering.md` if needed |
| Why does rule A beat rule B? Why didn't a disabled/higher-order rule fire? | `references/zia/url-filtering.md` |
| How do wildcards match (`*.foo.com` vs `.foo.com` vs `foo.com`)? | `references/zia/wildcard-semantics.md` |
| Does SSL inspection happen before or after X? | `references/zia/ssl-inspection.md` |
| Cloud app control vs URL filtering interaction | `references/zia/cloud-app-control.md` |
| Why wasn't this file sandboxed / caught by Sandbox? | `references/zia/sandbox.md` |
| "Why was this blocked?" and it's NOT URL Filter / CAC / SSL / Firewall | `references/zia/malware-and-atp.md` |
| DLP / data loss prevention / "why didn't DLP catch this?" | `references/zia/dlp.md` |
| ZPA app-segment matching (esp. overlapping wildcard segments) | `references/zpa/app-segments.md` |
| ZPA App Connector enrollment / provisioning / health | `references/zpa/app-connector.md` |
| SCIM provisioning / automated user-group lifecycle | `references/shared/scim-provisioning.md` |
| ZPA policy precedence | `references/zpa/policy-precedence.md` |
| "Why didn't ZIA see this traffic?" / ZCC forwarding-profile questions | `references/zcc/forwarding-profile.md` |
| Trusted-network detection / "Why is my user classified as untrusted?" | `references/zcc/trusted-networks.md` |
| ZPA TRUSTED_NETWORK access-policy condition not firing | Start at `references/zcc/forwarding-profile.md` (sendTrustedNetworkResultToZpa toggle) |
| Which forwarding profile / web policy does this user get? | `references/zcc/web-policy.md` |
| ZCC telemetry / log-collection / packet-capture policy | `references/zcc/web-privacy.md` |
| ZCC device inventory / force-remove / VM-cloning fingerprint | `references/zcc/devices.md` |
| "User can't reach ZPA" / "ZDX has no data for this user" | `references/zcc/entitlements.md` |
| Z-Tunnel 1.0 vs 2.0 / "why isn't this non-web traffic tunneling" | `references/zcc/z-tunnel.md` |
| Cross-product mental model ("how does policy evaluation work in general?") | `references/shared/policy-evaluation.md` |
| Activation - "I changed a ZIA rule; why isn't it taking effect?" | `references/shared/activation.md` |
| Source IP Anchoring (SIPA) | `references/shared/source-ip-anchoring.md` |
| Terminology translation ("what's a ZEN?" / "PSEN" / "Z-App") | `references/shared/terminology.md` |
| "What does Zscaler actually run?" / Central Authority / Service Edge types | `references/shared/cloud-architecture.md` |
| PAC files - `${GATEWAY}` / Kerberos-PAC / custom PAC upload | `references/shared/pac-files.md` |
| ZIA Locations, sublocations, Location Groups | `references/zia/locations.md` |
| Device Posture - posture profiles / evaluation cadence | `references/shared/device-posture.md` |
| ZIA Firewall Control - "why was this blocked and it's not a URL Filter rule?" | `references/zia/firewall.md` |
| ZPA Browser Access - contractor access without ZCC | `references/zpa/browser-access.md` |
| ZPA Privileged Remote Access (PRA) - RDP / SSH / VNC / jump host | `references/zpa/privileged-remote-access.md` |
| Subclouds - "why is my traffic going to the wrong region" | `references/shared/subclouds.md` |
| NSS / Cloud NSS / log streaming / "why did my SIEM miss logs" | `references/shared/nss-architecture.md` |
| ZIA Bandwidth Control - bandwidth classes / contention enforcement | `references/zia/bandwidth-control.md` |
| FTP / File Type / SSH - content inspection beyond URL/CAC/DLP | `references/zia/content-inspection-extras.md` |
| Admin RBAC / admin users / roles / scopes / audit | `references/shared/admin-rbac.md` |
| OneAPI / "how do I authenticate to Zscaler APIs?" / token endpoint | `references/shared/oneapi.md` |
| Question spans ZIA + ZPA, or ZCC + a server product | `references/shared/cross-product-integrations.md` |
| "Why is this user's app slow?" / ZDX Score / probes / diagnostic sessions | `references/zdx/overview.md` for Score model; `references/zdx/probes.md` for measurement |
| ZDX API / SDK methods | `references/zdx/api.md` |
| Cloud Browser Isolation / Zero Trust Browser / ZBI / URL Filter `Isolate` action | `references/zbi/overview.md` for architecture; `references/zbi/policy-integration.md` for profiles |
| ZIdentity / "what is ZIdentity?" / SAML vs OIDC / MFA | `references/zidentity/overview.md` |
| OneAPI authentication / API client creation | `references/zidentity/api-clients.md` |
| Step-up authentication / Conditional Access / Authentication Levels | `references/zidentity/step-up-authentication.md` |
| ZIdentity API / SCIM-like user provisioning | `references/zidentity/api.md` |
| Cloud Connector / Branch Connector / "why isn't my AWS/Azure/GCP workload reaching Zscaler?" | `references/cloud-connector/overview.md` |
| Cloud Connector traffic forwarding rules | `references/cloud-connector/forwarding.md` |
| Cloud Connector API / SDK / Terraform | `references/cloud-connector/api.md` |
| "What happens to DLP incidents after detection?" / Workflow Automation / ZWA | `references/zwa/overview.md` |
| ZWA API / incident search / evidence retrieval | `references/zwa/api.md` |
| Zscaler Deception / decoys / honeypots / "what is Deception?" | `references/deception/overview.md` |
| ZPA AppProtection / ZPA Inspection / WAF for private apps | `references/zpa/appprotection.md` |
| Risk360 / cyber risk quantification / Monte Carlo / CISO board reporting | `references/risk360/overview.md` |
| AI Security family / AI Guard / AI Guardrails / prompt injection / LLM guardrails | `references/ai-security/overview.md` |
| ZMS / Zscaler Microsegmentation / east-west traffic / workload-to-workflow policy | `references/zms/overview.md` |
| ZIA API endpoint or response shape | `references/zia/api.md` |
| ZPA API endpoint or response shape | `references/zpa/api.md` |
| ZCC API endpoint or response shape | `references/zcc/api.md` |
| Terraform provider resource or schema | `references/terraform.md` |
| ZIA web log fields / what NSS reports | `references/zia/logs/web-log-schema.md` |
| ZIA firewall log fields | `references/zia/logs/firewall-log-schema.md` |
| ZIA DNS log fields | `references/zia/logs/dns-log-schema.md` |
| ZPA LSS access log fields | `references/zpa/logs/access-log-schema.md` |
| SPL patterns / "how do I query for X?" | `references/shared/splunk-queries.md` |
| "should I check logs here?" / validation guidance | `references/shared/log-correlation.md` |

## Step 3: Handle special routing cases

**For breadth questions** ("does Zscaler have a product for X?", "what is Risk360?", "is AppProtection part of ZPA?"):
- Start with `references/_portfolio-map.md` - single-page index of every Zscaler product with coverage depth

**For prerequisite-knowledge questions** ("what's a proxy?", "what's the difference between SAML and OIDC?", "what does zero trust actually mean?"):
- Start with `references/_primer/` - five primer docs covering generic networking, forwarding paradigms, zero-trust philosophy, identity protocols, and Zscaler platform shape

**For meta-questions about the skill itself**:
- See `references/_layering-model.md` - the three-layer framing (general / tenant / SME tribal)

**For AI agents needing diagnostic functions**:
- Prefer `references/_agent-patterns.md` over prose runbooks - contains typed Python functions for diagnostic/recovery flows

**For "would this URL be blocked?" questions**:
- Use the policy simulator at `references/_policy-simulation.md` - pure-function ZIA URL filter evaluator

**For actionable / procedural questions** ("which auth path should I use?", "how do I detect if this is a gov cloud?", troubleshooting 401/rate-limit/activation):
- Start at `references/_runbooks.md` - authentication selection decision tree, diagnostic procedures, troubleshooting flows

**For verifying findings before threading into the skill**:
- Apply `references/_verification-protocol.md` - four-tier model (source-verified / behavior-verified / operator-reported / inferred)

## Step 4: Check clarifications

Before quoting any reference summary, check `references/_clarifications.md` for the question's domain (zia-*, zpa-*, shared-*, log-*). Clarifications flag where the doc's cheerful prose hides an unresolved ambiguity. Cite the clarification ID in your answer when one applies.

## Step 5: Consult snapshot if available

If the question is tenant-specific (e.g., "is reddit.com in a URL category in OUR tenant?") and `snapshot/` is populated:
- Read the relevant JSON file (e.g., `snapshot/zia/url-categories.json`, `snapshot/zia/url-filtering-rules.json`, `snapshot/zpa/app-segments.json`)
- Cite the specific rule IDs you used

## Step 6: Format the answer

Return non-trivial answers in this structure:

```markdown
## Answer
<direct answer in 1–3 sentences; lead with the conclusion>

## Reasoning
<why, citing the specific mechanics — rule order, match type, evaluation stage>

## Sources
- references/zia/url-filtering.md (§ section you used)
- snapshot/zia/url-filtering-rules.json (rule IDs 42, 47 — only if snapshot was consulted)

## Confidence
high | medium | low — <one-line reason; e.g. "stub reference, inferred from Zscaler KB">
```

For trivial factual questions ("what's a URL category?"), you can drop Reasoning and Confidence, but keep Sources.

### Confidence rule when sources disagree

When two vendored sources describe the same behavior differently:
1. Report `Confidence: medium` at most, sometimes `low` depending on severity
2. Cite both sources in the `## Sources` section
3. Name the divergence explicitly in `## Reasoning`
4. If the divergence overlaps an open clarification in `references/_clarifications.md`, cite the clarification ID
