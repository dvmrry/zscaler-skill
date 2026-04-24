---
name: zscaler
description: >
  Answer questions about Zscaler ZIA, ZPA, ZCC (Client Connector), ZDX
  (Digital Experience), ZBI (Zero Trust Browser / Cloud Browser
  Isolation), ZIdentity (unified identity + OneAPI authentication +
  step-up auth), Cloud & Branch Connector (ZTW/ZTC — VM-based
  traffic forwarding for cloud workloads and branch offices), and ZWA
  (Workflow Automation — DLP incident lifecycle management) — URL
  category coverage, URL filtering rule precedence,
  wildcard matching semantics, SSL inspection ordering, cloud app control
  interaction with URL filtering, ZPA app-segment matching and policy
  evaluation order, ZCC forwarding-profile / trusted-network decisions
  (which decide whether traffic reaches ZIA or ZPA in the first place),
  ZDX score / probe / diagnostic-session questions about user experience,
  and browser isolation (Isolate action, Smart Browser Isolation, isolation
  profiles). Use whenever the user mentions Zscaler, ZIA, ZPA, ZCC, ZDX,
  ZBI, Zero Trust Browser, Cloud Browser Isolation, Client Connector, URL
  categories, URL filtering, cloud app control, SSL inspection, app
  segments, forwarding profiles, trusted networks, ZDX score, probes,
  diagnostic sessions / deeptraces, isolation profiles, or asks "is $URL
  covered / blocked / allowed". Also use for "why does this rule win",
  "what happens when these policies overlap", "why is this user's app
  slow", or "what happens when traffic gets isolated" questions, even if
  the user does not explicitly name Zscaler.
---

# Zscaler

A skill for reasoning about Zscaler ZIA and ZPA configuration — what gets matched, what wins, and why.

## What this skill knows

This skill encodes **how Zscaler actually behaves** — rule precedence, wildcard semantics, SSL inspection ordering, and policy evaluation across ZIA and ZPA. That knowledge is the product; live API access alone will give confidently wrong answers about precedence.

Two kinds of question this skill handles:

- **General behavior** — "how do wildcards match?", "what happens when URL filtering and cloud app control both apply?". Answerable anywhere, sourced from `references/`.
- **Tenant-specific lookups** — "is `reddit.com` in a URL category in *our* tenant?". Requires a `snapshot/` populated by the refresh scripts. The public upstream repo ships empty; tenant snapshots live only in private forks.

## Check for a snapshot first

Before answering tenant-specific questions, check whether `snapshot/` (config) has anything beyond `.gitkeep`:

```bash
ls -A snapshot/ | grep -v '^\.gitkeep$'
```

If empty, say so explicitly (see **When to decline**) and still answer the general case where possible. If populated, read the relevant JSON (`snapshot/zia/url-categories.json`, `snapshot/zia/url-filtering-rules.json`, `snapshot/zpa/app-segments.json`, etc.) and cite the specific rule IDs you used.

`logs/` is a separate cache for log-query results (gitignored; populated by `scripts/splunk-query.sh`). Logs are a validation layer, not a primary source — see **When to consult logs** below.

## Question routing

Go straight to the reference file that covers the question shape. Only read more than one if the question genuinely spans them.

| Question shape | Start with |
|---|---|
| Is URL X in a category? Is it blocked/allowed? (no CAC mentioned) | `references/zia/url-filtering.md` |
| Question mentions a Cloud App Control rule (CAC) — e.g. "CAC allows Facebook but URL filter blocks it, what happens?" | **`references/zia/cloud-app-control.md` first**, then `url-filtering.md` for the non-CAC layer. CAC is evaluated before URL Filtering at both the SNI and full-URL passes; start at the layer that fires first. |
| Why does rule A beat rule B? Why didn't a disabled/higher-order rule fire? | `references/zia/url-filtering.md` — see §Rule order and first-match semantics for disabled-rule-holds-its-slot and admin-rank gates; §The specificity rule for the wildcard-vs-exact gotcha. Check `cloud-app-control.md` if either rule is a CAC rule. |
| How do wildcards match (`*.foo.com` vs `.foo.com` vs `foo.com`)? | `references/zia/wildcard-semantics.md`. **Asterisks are not a valid Zscaler wildcard** — see §Asterisk is not a valid wildcard character and [clarification `zia-15`](references/_clarifications.md#zia-15-console-accepts-asterisk-despite-docs-marking-it-invalid) for the operator-vs-doc divergence. |
| Does SSL inspection happen before or after X? | `references/zia/ssl-inspection.md` — URL Filtering evaluates **twice** on inspected HTTPS (pre-decrypt SNI pass and post-decrypt full-URL pass); cite the two-pass model, not a flat "SSL before URL filtering" summary. |
| Cloud app control vs URL filtering interaction | `references/zia/cloud-app-control.md` |
| Why wasn't this file sandboxed / caught by Sandbox? | `references/zia/sandbox.md` — tier scope, SSL-bypass prerequisite, static-analysis fast-path, and the "Malware Protection and ATP have NO API coverage" limit. Script: `scripts/sandbox-check.py`. |
| "Why was this blocked?" and it's NOT URL Filter / CAC / SSL / Firewall — suspect Malware Protection or ATP | `references/zia/malware-and-atp.md` — category shape, Page Risk score, C2/botnet/phishing/XSS/country detections, Blocked Malicious URLs (25K capacity). **Diagnosis is console-only** — skill directs operator to Security Dashboard + Web Insights `Blocked Policy Type` field. |
| ZPA app-segment matching — esp. two overlapping wildcard segments | `references/zpa/app-segments.md`. For two segments with identical specificity, the tiebreaker hits [clarification `zpa-04`](references/_clarifications.md#zpa-04-same-specificity-segment-collision) — answer at **Confidence: medium** until lab-verified. |
| ZPA policy precedence | `references/zpa/policy-precedence.md` |
| "Why didn't ZIA see this traffic?" / "Why did traffic go direct?" / ZCC forwarding-profile questions | `references/zcc/forwarding-profile.md` — per-network-type action branches (TRUSTED/UNTRUSTED), Z-Tunnel vs PAC vs NONE, fail-open, captive portal grace. **Several enum values are inferred, not documented** — answer at `Confidence: medium` and cite clarifications `zcc-01` through `zcc-05` where relevant. |
| Trusted-network detection / "Why is my user classified as untrusted at the office?" | `references/zcc/trusted-networks.md` — DNS, SSID, DHCP, subnet, egress-IP criteria and their combination. |
| ZPA `TRUSTED_NETWORK` access-policy condition not firing | Start at `references/zcc/forwarding-profile.md § ForwardingProfileZpaActions` — the `sendTrustedNetworkResultToZpa` toggle is usually the cause. Then `references/zpa/policy-precedence.md`. |
| Which forwarding profile / web policy does this user get? ZCC password / uninstall-protection / SSL-cert-install questions | `references/zcc/web-policy.md` — scope (user/group/device-group), `forwarding_profile_id` link, per-platform sub-policies (Windows/macOS/Linux/iOS/Android), disaster recovery. |
| ZCC telemetry / log-collection / packet-capture policy | `references/zcc/web-privacy.md` — `collect_user_info`, `collect_machine_hostname`, packet-capture toggles; note `collect_zdx_location` ANDs with entitlements. |
| ZCC device inventory / force-remove / VM-cloning fingerprint issues / "when did this device last check in?" | `references/zcc/devices.md` — Device fields, states, remove vs force-remove, device cleanup, CSV downloads. |
| "User can't reach ZPA" / "ZDX has no data for this user" — entitlement first | `references/zcc/entitlements.md` — `zpa_enable_for_all` trump card, ZPA vs ZDX group lists, Machine Tunnel toggle, ZDX location dual-source dependency. |
| Z-Tunnel 1.0 vs 2.0 / "why isn't this non-web traffic tunneling" / bypass-list behavior / GRE-and-ZCC-2.0 | `references/zcc/z-tunnel.md` — CONNECT-proxy vs DTLS packet-tunnel, single-IP-NAT-or-fallback-to-1.0, 4-layer bypass architecture (VPN Gateway → Destination Exclusions/Inclusions with specificity-wins → Port-based → Domain-based PAC), 3.8+ Windows redirect-web-traffic truth table. |
| Cross-product mental model ("how does policy evaluation work in general?") | `references/shared/policy-evaluation.md` |
| Activation — "I changed a ZIA rule; why isn't it taking effect?" / activation API endpoints / ZIA-vs-ZPA activation-model differences | `references/shared/activation.md` — the staged-vs-live gate (ZIA only; ZPA propagates on write), EUSA acceptance, status enum. |
| Source IP Anchoring (SIPA) — "we need our source IP to show up as customer-controlled for Office 365 / Conditional Access / legacy IP-allowlist apps" / "SIPA traffic is egressing with wrong IP" / SIPA Direct / ZIA DR fallback | `references/shared/source-ip-anchoring.md` — cross-product feature (ZIA forwards → ZPA App Connector delivers), two variants (standard + Direct-for-ZIA-DR), ZPA+ZIA dual-side config, domain-vs-IP-based rule asymmetry, DNS Resolver rule ordering, mutual-exclusion with Browser Access / Double Encryption / Multimatch. |
| Terminology translation — "what's a ZEN?" / "PSEN" / "Z-App" / "App Profile vs Web Policy" / "ZTW vs ZTC" — any Zscaler naming disambiguation | `references/shared/terminology.md` — legacy/current/log-field alias table across all products. |
| "What does Zscaler actually run?" / Central Authority / Service Edge types / Business Continuity Cloud / Z-Tunnel vs M-Tunnel / PKI and cert trust | `references/shared/cloud-architecture.md` — component-level picture. Covers ZIA CA (active-passive) vs ZPA CA (active-active) split, BC Cloud constraints (Z-Tunnel 1.0 / PAC / GRE only — **not 2.0**), the three Service Edge form factors, and the tunnel model. |
| Question spans ZIA + ZPA, or ZCC + a server product — silently-wrong-answer territory | **Start at `references/shared/cross-product-integrations.md`** — catalogues every cross-product hook (ZIA→ZPA `zpa_app_segments`, ZPA→ZIA `inspect_traffic_with_zia`, ZCC→ZPA TRUSTED_NETWORK, ZCC→ZIA install_ssl_certs, shared ZIdentity conditional-access, SSL bypass as cross-policy gate, AI/ML recategorization, activation-model difference, BC-Cloud-is-ZIA-only) with failure-mode hints and a question-shape routing table. |
| "Why is this user's app slow?" / "Is it the network or the app?" / ZDX Score / probes / diagnostic sessions (deeptraces) / alerts | `references/zdx/overview.md` for the Score model; `references/zdx/probes.md` for Web vs Cloud Path measurement; `references/zdx/diagnostics-and-alerts.md` for 1-min-resolution investigation workflow and alert lifecycle. **Terminology: SDK says "deeptrace", admin portal says "Diagnostics Session" — same thing.** |
| ZDX API / SDK methods | `references/zdx/api.md` — `client.zdx.*` surface summary (apps, devices, alerts, troubleshooting, inventory). Mostly read-only; probe/alert configuration is portal-only. |
| Cloud Browser Isolation / Zero Trust Browser / ZBI / URL Filter `Isolate` action / "what happens when isolation fires" | `references/zbi/overview.md` for architecture + rendering (pixel streaming vs Turbo Mode) + session lifecycle; `references/zbi/policy-integration.md` for isolation profiles, Smart Browser Isolation, ZPA Isolation Policy, and the "Miscellaneous & Unknown" limited subscription tier's locked-profile settings. Note: **the product has three names** — Zero Trust Browser (current), Cloud Browser Isolation (URL/SDK path), Zscaler Isolation (legacy) — all the same thing. |
| ZIdentity / "what is ZIdentity?" / SAML vs OIDC / MFA / single sign-on across Zscaler products | `references/zidentity/overview.md` — unified identity service, SAML JIT vs SCIM provisioning, MFA defaults, admin IP restriction. |
| OneAPI authentication / API client creation / client secret vs JWT / ZSCALER_CLIENT_ID setup | `references/zidentity/api-clients.md` — OAuth 2.0 client-credentials flow, role/scope model, token TTL, secret-shown-once pattern, portal-only creation. |
| Step-up authentication / Conditional Access / "why isn't the MFA prompt appearing?" / Authentication Levels | `references/zidentity/step-up-authentication.md` — hierarchical level tree (32 max / depth 4), **OIDC-only** constraint (SAML IdPs don't work), **validity-inversion** gotcha (parent validity MUST be less than child validity), OIDC `acr`-value mapping, ZCC-required prompt delivery. |
| ZIdentity API / `client.zid.*` methods / SCIM-like user provisioning | `references/zidentity/api.md` — Users / Groups / Resource Servers / User Entitlement. Python SDK is read-only on Resource Servers (Go has full CRUD). API Client creation is NOT exposed via API — portal-only. |
| Cloud Connector / Branch Connector / "why isn't my AWS/Azure/GCP workload reaching Zscaler?" / ZTW / ZTC / CBC | `references/cloud-connector/overview.md` — Cloud Connector Group model, primary/secondary/tertiary gateway failover, **fail-close-by-default** (workloads lose internet on outage) vs fail-open. **Product has 5 names**: Cloud Connector / Branch Connector / Zero Trust Gateway / ZTW (Go SDK) / ZTC (TF provider) / CBC (help URL path). |
| Cloud Connector traffic forwarding rules / "why is my workload going direct instead of to ZIA?" / forwarding methods | `references/cloud-connector/forwarding.md` — five methods (ZIA / ZPA / Direct / Drop / Local), rule-order first-match-wins (same as ZIA URL Filter), Application Service Groups (auto-updated by Zscaler), DNS-required-for-wildcard-non-web. |
| Cloud Connector API / SDK / Terraform | `references/cloud-connector/api.md` — Go SDK `client.ztw.*` (Python SDK has NO coverage), TF provider `ztc_*` resources, provisioning template workflow, activation gate (ZIA-style, not ZPA-style). |
| "What happens to DLP incidents after detection?" / Workflow Automation / ZWA / auto-notify / auto-escalate / auto-create-ticket | `references/zwa/overview.md` — 9 predefined workflow templates (auto-close / auto-notify / auto-escalate / auto-create-tickets + variants), custom workflows, workflow mappings, notification channels (email / Slack / Teams), ticketing integration (ServiceNow, Jira). Incident triage runs downstream of ZIA DLP — SSL-must-decrypt dependency applies. |
| ZWA API / incident search / evidence retrieval | `references/zwa/api.md` — ~14 methods across `client.zwa.dlp_incidents` + `client.zwa.audit_logs`. **Workflow configuration is portal-only** — SDKs cover incident lifecycle (search, retrieve, assign labels/notes, close) only. Evidence retrieval returns the actual DLP-matched payload content — treat as sensitive. |
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

If the question shape isn't here, start with `references/shared/policy-evaluation.md` and follow its cross-links.

**Before quoting any reference summary, check `references/_clarifications.md` for the question's domain** — `zia-*`, `zpa-*`, `shared-*`, `log-*`. Summaries distil the doc; clarifications flag where the doc's cheerful prose hides an unresolved ambiguity. Cite the clarification ID in your answer when one applies and adjust confidence accordingly.

## Answer format

Return every non-trivial answer in this shape. It keeps answers grounded, makes uncertainty visible, and gives a future trainer a consistent structure to learn from.

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

For trivial factual questions ("what's a URL category?") you can drop Reasoning and Confidence, but keep Sources.

### Confidence rule when sources disagree

When two vendored sources describe the same behavior in different — even subtly different — ways:

1. **Do not silently pick one.** Report `Confidence: medium` at most, sometimes `low` depending on severity.
2. **Cite both sources** in the `## Sources` section.
3. **Name the divergence explicitly** in `## Reasoning` — one sentence identifying what the two sources say and why it matters for the answer.
4. If the divergence overlaps an open clarification in [`references/_clarifications.md`](references/_clarifications.md), cite the clarification ID.

Concrete example: *Understanding Application Access* p.1 describes the port-mismatch outcome two ways ("bypasses ZPA and sends traffic directly" vs "client connection request is dropped by ZPA"). Those are two perspectives on the same event — reconciled in `references/zpa/app-segments.md § Worked example`. An answer using this material should cite the reconciled section, not either single quote, and report `Confidence: medium` if the user's question hinges on what happens to the traffic after the bypass.

A claim derived by **inference** — extrapolating a stated rule beyond its documented scope — gets `Confidence: low` and an explicit note in Reasoning calling out that it's an extrapolation. Do not dress inferences as quoted fact.

## When to consult logs

Default: answer from config (`snapshot/`) and reference docs. Logs are the **validation layer**, not the first stop — they add latency and cost.

Consult logs when **any** of:

- The user pushes back on a config-derived answer.
- Config is ambiguous (multiple rules could match, wildcard could go either way, segments overlap).
- The question is inherently observational ("when did this start breaking?", "how often does Y happen?").
- You suspect config/reality drift — rules recently changed, or the answer smells wrong.

Do not consult logs for pure semantic questions ("how do wildcards match?") — reasoning docs handle those. See [`references/shared/log-correlation.md`](references/shared/log-correlation.md) for the full decision rule.

When you do query, cite the SPL pattern by name from [`references/shared/splunk-queries.md`](references/shared/splunk-queries.md) rather than inlining it. If logs contradict config, call that drift out explicitly in the Answer — it's the high-signal finding.

## When to decline

- **Tenant state needed, snapshot empty** — say so directly, point to `scripts/snapshot-refresh.py`, and still answer the general case if there is one.
- **Relevant reference is still a stub** (`author-status: stub`, no body yet) — say the skill hasn't written this down yet, describe what you know from the file's TODO headings, and mark **Confidence: low**.
- **Question maps to a known open clarification** — if a reference doc cross-links an entry in [`references/_clarifications.md`](references/_clarifications.md) that covers the user's question, cite the clarification ID (e.g. "this hits `zia-03` — wildcard tokenization is unresolved in our public material"), answer what you can, and flag the gap rather than hallucinating the rest.
- **Out of scope** — this skill covers ZIA, ZPA, ZCC (forwarding profiles, trusted networks, fail-open), ZDX (score, probes, diagnostic sessions, alerts), ZBI (Cloud Browser Isolation / Zero Trust Browser — architecture, policy integration, isolation profiles), ZIdentity (unified identity, OneAPI auth, step-up authentication), Cloud & Branch Connector (ZTW/ZTC — Cloud Connector VM architecture, traffic forwarding rules, SDK/TF surface), and ZWA (Workflow Automation — DLP incident lifecycle management). For ZMS (workload microsegmentation), ZINS, EASM, or Federal Cloud-specific questions, say so and suggest the Zscaler help site. ZCC device-posture rules and on-device web policy are partially in scope — `references/zcc/index.md` lists what's covered and what isn't. ZDX's application-specific call-quality integrations (Microsoft Teams, Zoom deep-dives) are also partially in scope — `references/zdx/index.md` lists the gaps. ZBI's Votiro CDR integration, Sandbox+Isolation, Local Browser Rendering, and end-user UX features are partially in scope — `references/zbi/index.md` lists the gaps. ZIdentity's IdP-specific configurations (Entra, AD FS, Okta) and MFA method configs are partially in scope — `references/zidentity/index.md` lists the gaps.

Do not guess precedence, matching semantics, or evaluation order from first principles. These are exactly the places Zscaler's real behavior diverges from intuition — wrong confident answers here are the failure mode this skill exists to prevent.

## Known open questions

[`references/_clarifications.md`](references/_clarifications.md) is the canonical index of unresolved questions across the skill — each with a stable ID (`zia-03`, `shared-02`, etc.), what resolves it, and which reference doc raised it. When a user's question overlaps a known gap, cite the ID and be explicit that the answer is bounded by that gap.
