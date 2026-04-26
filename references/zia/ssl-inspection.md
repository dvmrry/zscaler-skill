---
product: zia
topic: "zia-ssl-inspection"
title: "ZIA SSL/TLS inspection — pipeline position and policy semantics"
content-type: reasoning
last-verified: "2026-04-25"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zia/about-policy-enforcement"
  - "vendor/zscaler-help/Understanding_Policy_Enforcement.pdf"
  - "https://help.zscaler.com/zia/configuring-ssltls-inspection-policy"
  - "vendor/zscaler-help/configuring-ssl-tls-inspection-policy.md"
  - "https://help.zscaler.com/zscaler-deployments-operations/ssl-inspection-deployment-and-operations-guide"
  - "vendor/zscaler-help/SSL_Inspection_Deployment_and_Operations_Guide.pdf"
  - "https://help.zscaler.com/zscaler-deployments-operations/zia-ssl-inspection-leading-practices-guide"
  - "vendor/zscaler-help/ZIA_SSL_Inspection_Leading_Practices_Guide.pdf"
  - "https://help.zscaler.com/zia/best-practices-testing-and-rolling-out-ssltls-inspection"
  - "vendor/zscaler-help/Best_Practices_for_Testing_and_Rolling_Out_SSL_TLS_Inspection.pdf"
  - "https://help.zscaler.com/zia/about-ssl-tls-inspection-policy"
  - "vendor/zscaler-help/About_SSL_TLS_Inspection_Policy.pdf"
  - "https://help.zscaler.com/zia/configuring-url-filtering-policy"
  - "vendor/zscaler-help/Configuring_the_URL_Filtering_Policy.pdf"
  - "https://duo.com/docs/duo-desktop"
  - "https://help.duo.com/s/article/9585"
author-status: draft
---

# ZIA SSL/TLS inspection — pipeline position and policy semantics

Where SSL/TLS inspection sits relative to URL filtering and Cloud App Control, how Do Not Inspect actions compose with downstream policy, and what happens when inspection is impossible.

## Summary

SSL inspection sits in a **two-pass model** documented in *Understanding Policy Enforcement* (pp.11–13):

1. **CONNECT/SNI-level pass** — URL Filtering, Cloud App Control, known-malicious-URL ATP check, and Bandwidth Control evaluate using only the destination domain (from the CONNECT header in explicit mode, from the SNI in transparent mode). A block at this stage ends the connection immediately — 403 for CONNECT blocks, TCP reset for SNI blocks.
2. **SSL Inspection policy decision** — inspect, do-not-inspect-evaluate-others, or do-not-inspect-bypass-others. Top-down, first-match rule evaluation.
3. **Full-URL pass** — only if decrypted. The complete web-module pipeline re-evaluates using the full URL + HTTP headers + payload: URL Filtering, CAC, ATP (custom malicious → country blocking → IPS → suspicious content → P2P), Browser Control, plus POST-only layers (Malware, File Type, DLP) and response-only layers (Sandbox, AI/ML categorization).

So URL Filtering effectively evaluates **twice** on inspected HTTPS traffic — once domain-only at the SNI/CONNECT stage, and again full-URL post-decrypt. Cloud App Control likewise. Firewall module runs before any of this for outbound traffic (firewall "allow" does not supersede a web-module block — both layers must pass).

"Does SSL inspection happen before URL filtering?" — URL Filtering evaluates first on the domain, then SSL inspection decides whether to decrypt, then URL Filtering evaluates again on the full URL. The **Do Not Inspect variant** determines what survives:

- **Inspect** → two-pass (domain + full-URL). All decrypt-dependent features run (DLP, sandbox, malware, file-type, IPS against decrypted content).
- **Do Not Inspect + Evaluate Other Policies** → domain-only pass still runs; URL Filtering can still block on SNI match; decrypt-dependent features don't run.
- **Do Not Inspect + Bypass Other Policies** → short-circuits the entire policy chain. Traffic passes untouched, no SNI-level URL Filtering, no CAC, no anything. Rarely the right choice.

## Mechanics

### Pipeline position (the corrected picture)

From *Understanding Policy Enforcement* (pp.1–2):

> All web traffic is first evaluated in the firewall module and only if it passes the firewall module (i.e., if it didn't violate any firewall policies), it's forwarded to the web module where the traffic is evaluated against the web policies.

Full flow for outbound HTTPS:

1. **Firewall module.** If the traffic violates a firewall policy, it blocks the transaction without the web module seeing it. Firewall "allow" does not override web-module block — both layers must independently pass. (Policy Enforcement, p.14, Example 1: firewall allows Box.net + web blocks Box.net → user is blocked.)
2. **Web module — CONNECT/SNI pass** (domain-only):
   - Explicit proxy mode: URL Filtering + Cloud App Control evaluated against the first CONNECT request.
   - Transparent proxy mode: URL Filtering + CAC + ATP + Bandwidth evaluated on the SSL Client Hello SNI.
   - The policy subset available pre-decrypt (Policy Enforcement p.13): Known Malicious URLs (ATP), Cloud App Control, URL Filtering, Bandwidth Control. Policies requiring URL path, HTTP headers, or request body are deferred to the full-URL pass.
3. **SSL Inspection policy decision** — evaluated against CONNECT / SNI. Determines whether to decrypt.
4. **Full-URL pass** (only if Inspect): TLS is intercepted, traffic decrypted. The full web-module pipeline runs. GET request order from Policy Enforcement p.3–5: Custom Malicious URLs → Cloud App Control → URL Filtering → Security Exceptions → Browser Control → Country Blocking → IPS → Suspicious Content → P2P → Bandwidth. POST adds Malware + File Type + DLP. Response adds Sandbox + AI/ML Content Categorization.

**A block at any step halts that pass.** Standard first-violation-wins. Firewall→Web and SNI-pass→Full-URL-pass transitions only happen on not-blocked.

**Decrypt-dependent features**: DLP, sandbox, malware, file-type control, inline CASB, and IPS signature detection against decrypted content all live exclusively in the full-URL pass. If SSL Inspection did not Inspect, they do not fire. (*ZIA SSL Inspection Leading Practices Guide*, p.4.)

### The two "Do Not Inspect" variants — read this carefully

From the *ZIA SSL Inspection Leading Practices Guide*, p.23:

> Avoid Bypass Other Policies for any custom exemption rules. This feature bypasses the SSL inspection engines, the URL Filtering policies, and Cloud App Control policies. Any traffic matching the criteria isn't access controlled later, even if it is policy-dictated.

Reformulating:

| Action | What happens | URL Filtering runs? | CAC runs? | DLP / Sandbox / IPS run? |
|---|---|---|---|---|
| Inspect | Decrypt, inspect, continue | Yes (full URL visibility) | Yes (full visibility) | Yes |
| Do Not Inspect + **Evaluate Other Policies** | Don't decrypt; continue policy chain on pre-decrypt info | Yes (SNI-only, or SNI+IP in transparent mode) | Yes (SNI-only) | No (they need decrypted traffic) |
| Do Not Inspect + **Bypass Other Policies** | Don't decrypt; short-circuit policy chain | **No** | **No** | No |

"Bypass Other Policies" is an "allow and forget" escape hatch. The Leading Practices guide explicitly recommends against using it for custom exemptions — prefer Evaluate Other Policies.

The predefined **Zscaler Recommended Exemptions** rule uses Evaluate Other Policies by default (*About SSL/TLS Inspection Policy*, p.1; *Leading Practices Guide* p.9 rule 1). The predefined **Microsoft 365 Click-to-Run** rule uses Bypass Other Policies (*Leading Practices Guide* p.10 rule 3) — a documented exception because those URLs would break under URL filtering too.

### Transparent vs explicit traffic forwarding — what the SSL rule matches on

From *Best Practices for Testing and Rolling Out SSL/TLS Inspection*, p.2:

> In transparent mode, policies on both SNI and IP addresses are evaluated for exemption from SSL/TLS Inspection. Exempting SSL/TLS Inspection for the Miscellaneous or Unknown category exempts almost all traffic from SSL/TLS Inspection as most IP addresses are categorized as miscellaneous or unknown. However, in the case of explicit traffic forwarding, Zscaler evaluates the policies only based on SNI and does not exempt traffic from SSL/TLS Inspection based on IP address categories.

**Practical consequence**: an SSL Do Not Inspect rule that references "Miscellaneous or Unknown" as its category criterion:

- Under **transparent forwarding** (GRE tunnels, IPSec, etc. without explicit proxy): matches on SNI *or* destination IP. Since most public IPs have no URL-category classification and default to Miscellaneous, this pattern silently exempts most traffic from inspection.
- Under **explicit forwarding** (Zscaler Client Connector PAC file): matches on SNI only. Miscellaneous exemption only affects the handful of actual unknown-SNI destinations.

If an operator adds "Miscellaneous or Unknown" to a do-not-inspect list thinking it means "unknown *SNI*s", they may unintentionally exempt nearly everything under transparent forwarding.

### Per-rule inspection knobs

Each SSL rule carries detailed settings that affect what gets through. From *Configuring SSL/TLS Inspection Policy* (`vendor/zscaler-help/configuring-ssl-tls-inspection-policy.md`) and *Leading Practices Guide* pp.9–13:

- **Override Default Intermediate CA Certificate** (Inspect action) — use a custom intermediate CA instead of the default.
- **Untrusted Server Certificates** — on Inspect action, three options: **Allow** (warnings only for expired certs), **Pass Through** (warnings shown; user can proceed), **Block** (deny). On Do-Not-Inspect+Evaluate-Other-Policies, only Allow and Block are available. Zscaler recommends Block on inspect rules.
- **Block No Server Name Indication (SNI)** — block any handshake without an SNI in the Client Hello. Disabled by default. Available on both Inspect and Do-Not-Inspect+Evaluate actions.
- **OCSP Revocation Check** — check server cert revocation status via OCSP. On failure, the Untrusted Server Certificates action is applied. On Do-Not-Inspect+Evaluate, uses OCSP stapling.
- **Block Undecryptable Traffic** (Inspect only) — drops traffic using non-standard encryption methods or requiring mutual TLS authentication.
- **Minimum Client TLS Version** / **Minimum Server TLS Version** — connections below the threshold are blocked. On Do-Not-Inspect+Evaluate there's a single combined **Minimum TLS Version**.
- **Enable HTTP/2** (Inspect only) — makes HTTP/2 the web protocol. Feature must be enabled org-wide. **Falls back to HTTP/1.1 for locations where Bandwidth Control is also enabled**, even if HTTP/2 is on in the SSL/TLS rule.
- **Show End User Notifications** (Block action) / **Show Notifications for Blocked Traffic** (Do-Not-Inspect+Evaluate) — when enabled, displays the EUN page on block. Requires the Zscaler root CA in the client truststore; otherwise the browser shows an invalid-certificate warning. When disabled, the service resets the connection with a generic failure message.

These settings operate **per-rule**, so an exemption rule can carry weaker TLS requirements than the catch-all Inspect rule underneath it.

### Rule criteria (from *Configuring SSL/TLS Inspection Policy*)

The complete logical-operator tree on an SSL/TLS rule:

```
Source IP Groups (AND)
[URL Categories (OR) Cloud Applications (OR) Destination Groups (OR) Forwarding Gateways] (AND)
ZPA Application Segment (AND)
[Location Groups (OR) Locations] (AND)
[Users (OR) Groups (OR) Departments] (AND)
[Device Groups (OR) Devices (OR) Remote Users with Kerberos] (AND)
Device Trust Level (AND)
CONNECT User-Agent
```

Two non-obvious criterion behaviors worth calling out:

- **IP-based destination groups get ignored when SNI is present.** From *Configuring SSL/TLS Inspection Policy*: "During policy evaluation, IP address-based destination groups in the rule criteria are ignored if an SNI value is present in HTTPS requests." A rule scoped by IP destination group will not match ordinary HTTPS traffic (which carries SNI) — it only matches the edge cases where SNI is absent.
- **CONNECT User-Agent only works in explicit proxy mode.** "This criterion applies only to SSL/TLS traffic forwarded in explicit proxy mode (PAC or PAC over tunnel) and not to traffic forwarded via a transparent proxy (tunnel) or Z-Tunnel 1.0 due to lack of user agent context." User-agent-scoped SSL rules silently don't match transparent-proxy traffic.
- **ZPA Application Segment criterion only shows Source-IP-Anchor-enabled segments.** Rule list is filtered to segments with the Source IP Anchor option enabled. Up to 255. At the API level, this is the `zpa_app_segments` list (`zscaler/zia/models/ssl_inspection_rules.py:113-115`) — a cross-product reference from ZIA into ZPA. Absent from URL Filtering and CAC rules. See [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md) for why only SIPA-enabled segments appear here.
- **Platforms criterion is SSL-inspection-specific.** The SDK exposes a `platforms` list filtering by client OS (`zscaler/zia/ssl_inspection_rules.py:159-160`). Enum values: `SCAN_IOS`, `SCAN_ANDROID`, `SCAN_MACOS`, `SCAN_WINDOWS`, `SCAN_LINUX`, `NO_CLIENT_CONNECTOR`. The console surfaces this as "Device Groups" but at the API level, SSL rules distinguish OS-level scans independently of the generic Device Groups criterion. `NO_CLIENT_CONNECTOR` specifically matches traffic that isn't forwarded via ZCC — useful for "always inspect on-CC devices; exempt non-CC" patterns.
- **`road_warrior_for_kerberos` applies to remote PAC + Kerberos.** When `true` on an SSL rule, the rule applies to remote PAC users authenticating via Kerberos. Not available on URL Filtering or CAC rules — SSL-inspection-specific. (`zscaler/zia/models/ssl_inspection_rules.py:70`.)

### Action structure at the API level

What the console surfaces as "Action: Do Not Inspect + Evaluate Other Policies" (and similar) is a **nested object** at the API/SDK level, not a flat string. Useful when reading snapshot JSON or writing `jq` queries:

```
action: {
  type: DECRYPT | DO_NOT_DECRYPT | BLOCK
  decryptSubActions: { ... }           // only when type = DECRYPT
  doNotDecryptSubActions: { ... }      // only when type = DO_NOT_DECRYPT
}
```

Three top-level action types — `DECRYPT`, `DO_NOT_DECRYPT`, and `BLOCK`. The Go SDK's `validateSSLInspectionRule()` (`vendor/zscaler-sdk-go/zscaler/zia/services/sslinspection/sslinspection.go:241-300`) enforces per-type constraints:

- **`DECRYPT`** — takes a `decryptSubActions` block. Full inspection path.
- **`DO_NOT_DECRYPT`** — takes a `doNotDecryptSubActions` block. The "Evaluate Other Policies" vs "Bypass Other Policies" distinction lives in sub-fields.
- **`BLOCK`** — no sub-actions allowed. `showEUNATP` (end-user notification) must be false. `sslInterceptionCert` is conditional on other criteria; attempting to attach it unnecessarily fails validation.

**`decryptSubActions`** contains (per Go SDK `sslinspection.go:140-175` and `zscaler/zia/models/ssl_inspection_rules.py:395-399, 454-474`) — **camelCase on the wire**:

- `minClientTLSVersion` — minimum TLS version enforced between client and the Public Service Edge.
- `minServerTLSVersion` — minimum TLS version enforced between the Public Service Edge and the origin server. **These are independent** — you can require TLS 1.2 client-side but accept TLS 1.0 server-side if forced by an upstream partner.
- `http2Enabled` — enable HTTP/2 inspection.
- `blockUndecrypt` — block traffic that cannot be decrypted.
- `serverCertificates` — action to take on untrusted server certs (`ALLOW` / `BLOCK` / `PASSTHROUGH`).
- `ocspCheck` — enable OCSP revocation check.
- `blockSslTrafficWithNoSniEnabled` — block handshakes that don't include an SNI in the Client Hello.

**`doNotDecryptSubActions`** contains:

- `minTLSVersion` — single TLS floor for bypass traffic (not split client/server).
- `serverCertificates`, `ocspCheck`, `blockSslTrafficWithNoSniEnabled` — same semantics as the decrypt path's equivalents.

**Python SDK name warning.** The Python SDK uses snake_case kwargs (`http2_enabled`, `block_undecrypt`) that pass through to the wire as camelCase. Operators writing `jq` queries against snapshot JSON must use the camelCase field names above; snake_case returns no matches.

**Type-mismatch validation.** Sending `decryptSubActions` when `type=DO_NOT_DECRYPT` (or vice versa) is validated on the Go SDK side — the wrong sub-object is rejected with an explicit error. Python SDK's kwargs pattern may pass it silently to the wire; behavior there is still unverified. When debugging "why isn't my TLS floor enforced?", check the `type` first, then confirm the sub-object matches.

### Default rule and predefined markers

Both `default_rule` (bool) and `predefined` (bool) are first-class SSL-rule fields. Built-in rules (Zscaler Recommended Exemptions, Microsoft 365 Click-to-Run, IoT Classifications) carry `predefined=true`; the terminal Inspect-All rule carries `default_rule=true`. Both are server-set and **echoed back on PUT** — don't strip them when updating rules programmatically. (`zscaler/zia/models/ssl_inspection_rules.py:123-125,208`.)

**`accessControl` field** is read-only on predefined rules (`zscaler/zia/models/ssl_inspection_rules.py:51`; called out in TF provider CLAUDE.md as a strip-on-reorder field). It surfaces system-managed access permissions and should be treated as opaque on PUT — strip from update payloads when reordering predefined rules to avoid validation rejection.

**Wire-casing ambiguity on `showEUN` / `showEUNATP`** — the Python SDK's `Action.request_format()` emits these uppercase, but the init code accepts mixed-case aliases (`show_eun`, `showEun`, `showEUN`, `showEunatp`). This suggests the API may **return** `showEunatp` on reads and **expect** `showEUNATP` on writes — a read/write asymmetry similar to the `tz` field in locations. Not currently confirmed against a live API. Use uppercase on writes; tolerate mixed-case on reads.

## Trust mechanics — what Zscaler presents to clients

When inspecting, **the ZIA Public Service Edge acts as a short-lived intermediate CA** — it issues a per-connection certificate on demand for the requested application and signs it with the configured intermediate CA. (*Leading Practices Guide*, p.33.) The client receives a fresh leaf cert per session, signed by Zscaler's CA, valid for the destination's hostname/SAN. There is no long-lived "Zscaler-as-the-server" cert; each connection gets its own ephemeral leaf.

For this to work without browser warnings, **the signing CA must be in the client's trust store**. Two intermediate-CA options exist (*Leading Practices Guide*, pp.6, 33):

| Option | What it is | Cost / requirement |
|---|---|---|
| **Default Zscaler intermediate CA** | Zscaler-managed root + intermediate, distributed by Zscaler | Included; no extra subscription |
| **Customer's existing PKI as the intermediate** | Customer uploads their own intermediate CA + private key (or HSM-backed key) to Zscaler | **Requires an additional Zscaler subscription** |

**Customer-PKI option also supports HSM** — private keys can live in a cloud hardware security module rather than being uploaded directly. (*SSL Inspection Deployment & Operations Guide*, p.3.) This addresses the "I don't want to upload my private key" objection without forcing the default-CA path.

**In-memory inspection** — *SSL Inspection Deployment & Operations Guide* p.3 states: "Web transaction content inspection takes place in memory and is never written to disk." Useful for privacy/legal objections to TLS inspection.

## What depends on SSL inspection

These ZIA security features require decrypted traffic to function at all (*Leading Practices Guide*, p.4):

- Anti-Virus / Malware
- Cloud Sandbox
- Advanced Threat Prevention
- Isolation
- Data Loss Prevention (DLP)
- File Type Control
- Inline CASB
- Intrusion Prevention System (IPS)

**URL filtering and CAC are partial exceptions** — they can do SNI-level matching on non-inspected traffic, but any policy criterion that depends on URL path, HTTP method, request body, or post-decrypt app identity silently stops evaluating when SSL is bypassed. (This is the behavior captured in `references/zia/url-filtering.md` where we noted "Rules with Request Method or Protocol criteria are not processed as expected" on uninspected traffic.)

## What can't be inspected

Even with SSL inspection enabled, certain traffic resists interception:

- **Certificate-pinned apps** — application has the expected server certificate (or CA bundle) hard-coded; rejects any other cert. Two flavors:
  - **Leaf/key pinning** — most iOS/Android apps, Adobe products, Cisco WebEx app, Dropbox app, many Microsoft 365 components. (*Leading Practices Guide*, p.22.)
  - **CA-bundle pinning** — the application embeds a specific set of trusted CAs and ignores the OS trust store. **Duo Desktop**, **Duo Mobile**, and the **Duo Authentication Proxy** all do this — Duo's documentation states explicitly: "Proxy connections that perform HTTPS inspection or filtering from endpoints are not supported." (`duo.com/docs/duo-desktop`; Duo KB 9585.)
  Options: bypass via custom URL category, replace the app, or deny. Recommended: deny unless business-critical.
- **Client authentication certificates** — when the server requires the *client* to present a cert, the Public Service Edge can't impersonate the client. (*Leading Practices Guide*, p.4.)
- **Unsupported ciphers** — rare; typically a signal the site is using broken or custom crypto. (*Leading Practices Guide*, p.24.) Zscaler recommends blocking undecryptable traffic rather than passing it.
- **QUIC (HTTP/3)** — uses UDP, skips TCP handshake; Zscaler's TLS inspection relies on TCP session state. Recommendation: **block QUIC at the firewall so browsers fall back to TCP/TLS**, which can then be inspected. (*Leading Practices Guide*, p.24; also noted as a CAC troubleshooting item in the *CAC Deployment Guide*.)
- **IoT / OT / BYOD / guest networks** — typically can't install the Zscaler root certificate on the endpoint. Segment off; inspect only the managed-device paths. (*Leading Practices Guide*, pp.25–26.)
- **Developer environments with custom trust stores** — Python, Node, some IDEs ship their own cert stores. Need explicit cert installation or a scoped bypass. (*Leading Practices Guide*, pp.25–26.) See § Trust store deployment below for the per-toolchain catalog.

## Trust store deployment

Beyond the OS trust store, several application classes maintain their own — installing the Zscaler root in the OS isn't enough. (*Leading Practices Guide*, pp.6, 24, 25–26; *SSL Inspection Deployment & Operations Guide*, p.2; Zscaler "SSL Inspection in Developer Environments" blog.)

| Class | What needs configuring | Mechanism |
|---|---|---|
| **Firefox** | Mozilla's own NSS-based trust store | Separate import; or `security.enterprise_roots.enabled = true` to honor the OS store |
| **Python / pip / requests** | `certifi` bundle (not OS store) | `PIP_CERT`, `REQUESTS_CA_BUNDLE` env var, or patch `certifi` |
| **Node.js / npm** | Bundled OpenSSL CA bundle | `NODE_EXTRA_CA_CERTS=/path/to/zscaler.crt`; `cafile` in `~/.npmrc` |
| **Git over HTTPS** | libcurl with own CA bundle | `git config --global http.sslCAInfo /path/to/zscaler.crt` |
| **Java (JDK / Maven / Gradle)** | JRE `cacerts` keystore | `keytool -import` to `$JAVA_HOME/lib/security/cacerts` |
| **Docker** | Per-registry trust under `/etc/docker/certs.d/` | Copy CA file + restart daemon |
| **Duo Desktop / Mobile / Auth Proxy** | Embedded CA bundle, Duo-managed | **No deployment path.** Bypass at the network or SSL layer. (`duo.com/docs/duo-desktop`.) |
| **ChromeOS** | OS-level Google traffic trusts only Google CAs | **Cannot be reconfigured.** OS-level traffic must be exempted; user traffic can be inspected once the cert is pushed via Google Admin. (*Leading Practices Guide*, p.25.) |

**Deployment paths Zscaler explicitly mentions:**
- **Microsoft SCCM** for desktop trust-store push (*Leading Practices Guide*, p.24)
- **MDM** (Intune, Jamf, Android EMM) for mobile + ZCC bundling — installing the cert and deploying ZCC are typically bundled tasks (*Leading Practices Guide*, p.25)
- **GPO** is the implicit default for AD-joined Windows but the Leading Practices guide does not enumerate the GPO-specific path

**Server networks should be deferred from initial rollout** — the primary challenge is getting the root CA installed on hosts plus all containers and custom-trust-store apps running on them. Restrict server-side internet access to permitted destinations while inspection is being rolled out. (*Leading Practices Guide*, p.26.)

**BYOD/guest networks** must be physically/logically segmented — exemption alone isn't enough; "no chance of accessing anything other than the internet." (*Leading Practices Guide*, p.26.)

## SSL bypass is a cross-policy gate

SSL bypass doesn't just skip TLS inspection — it **breaks or disables multiple downstream security features**. A skill answering "why wasn't this caught?" should check SSL bypass status first whenever any of the following features is involved:

| Feature | Effect of SSL bypass |
|---|---|
| DLP (Web DLP, Inline CASB, Endpoint DLP sync) | **Completely ineffective for HTTPS traffic** — DLP engines need decrypted content. |
| Sandbox | **Does not see files** delivered over bypassed traffic. See [`./sandbox.md`](./sandbox.md). |
| Malware Protection | Can't scan payloads; reduced to URL/reputation matching only. |
| File Type Control | MIME-type sniffing falls back to host/path heuristics; reliability drops. |
| ATP content-based rules | Known-bad-URL still matches; deep-content detection doesn't. |
| Certificate-pinned apps | Bypass is **required** for these apps — they reject Zscaler's intercept cert. |

The inverse failure mode: **an SSL Inspection rule with `Do Not Inspect + Bypass Other Policies`** also skips URL Filtering and Cloud App Control. See the "Do Not Inspect variants" section above for that distinction — it's the extra-dangerous flavor.

## Bypass rule hygiene — anti-patterns

Distilled from *Leading Practices Guide* pp.23–24:

- **Use FQDNs, not IPs.** IPs change; CDN backings rotate; tomorrow's `52.x.x.x` may be a different tenant.
- **Use specific subdomains, not wildcards** — especially for shared CDNs.
- **Don't add file paths** to bypass rules — bypass acts at the connection level, paths don't matter.
- **Prefer Cloud Application criterion over domain** when one exists. Tightly scoped, vendor-tracked, less prone to drift.
- **Document every bypass entry.** Audit rubric below depends on knowing why each rule exists.

**The CDN wildcard danger** (*Leading Practices Guide*, pp.23–24) — these patterns are explicitly called out as anti-patterns:

| Pattern | Why it's dangerous |
|---|---|
| `*.s3.amazonaws.com` | Any AWS account holder gets their own S3 subdomain. Bypass = Zscaler-allowlisted exfiltration channel. |
| `*.blob.core.windows.net` | Same shape, Azure Blob Storage. |
| `*.cloudfront.net` | CloudFront distribution names are user-chosen. |
| `*.googleusercontent.com` | Google Drive shared content lives under user-suffixed subdomains. |

If a specific S3 bucket / Blob container / CloudFront distribution must be bypassed, name it explicitly: `mybucket.s3.amazonaws.com`, not the parent.

**Use Evaluate Other Policies, not Bypass Other Policies** for any custom exemption. The exception is the predefined **Microsoft 365 Click-to-Run** rule, which Zscaler ships with `Bypass Other Policies` because the URLs would break under URL Filtering too. Don't replicate that pattern for new rules. (*Leading Practices Guide*, p.10.)

## Audit rubric for SSL bypass rules

Distilled from the MCP server's `commands/audit-ssl.md` and `skills/zia/audit-ssl-inspection-bypass/` reasoning. Use this when classifying a tenant's bypass rules by risk.

| Risk | Indicators |
|---|---|
| **CRITICAL** | Bypass covers broad uncategorized categories (Miscellaneous or Unknown, `ANY`), or AI/ML categories; **AND scope = All Users / All Locations**. Under transparent forwarding, adds the IP-based over-exemption footgun. |
| **HIGH** | Bypass covers sensitive cloud-app categories (Finance, Health, Webmail, File Sharing) with wide scope, or scope is a large department / location group. |
| **MEDIUM** | Bypass justified by certificate pinning (known-app lists from *Leading Practices Guide* p.22) and scope is narrow — specific cloud app, specific location, specific device group. |
| **LOW** | OS updates, system services, Microsoft 365 Optimize categories, or other well-known bypasses; scope is further narrowed by Device Group = `Client Connector` / high trust level. |

**When auditing, also flag:**

- **Predefined / default rules** — `predefined=true` or `default_rule=true` cannot be modified or deleted via API. Any audit finding that recommends changing a predefined rule must note this (operator must open a Zscaler Support request).
- **Disabled bypass rules** — they still hold their order slot and can be silently re-enabled. Recommend deletion rather than just disabling when the intent is "permanently remove this bypass."
- **Transparent-forwarding exposure** — if the tenant has transparent forwarding AND the rule category includes Miscellaneous or Unknown, flag the IP-based over-exemption risk (see "Transparent vs explicit" section above).

## Edge cases

- **Transparent-mode IP-based over-exemption.** As above — a do-not-inspect rule on Miscellaneous Or Unknown can wildcard nearly all traffic under transparent forwarding without admins realizing.
- **Predefined exemption actions differ.** Zscaler Recommended Exemptions uses Evaluate Other Policies (URL filtering still runs); Microsoft 365 Click-to-Run uses Bypass Other Policies (URL filtering does not). Operators writing their own exemption rules often copy the pattern of whichever predefined rule they saw first, without noticing the downstream-policy difference. (*Leading Practices Guide*, pp.9–10.)
- **TLS minimum too strict.** A legitimate partner site stuck on TLS 1.0 plus an Inspect rule requiring TLS 1.2 → the connection fails with an SSL handshake error. User sees a block. (*SSL Inspection Deployment and Operations Guide*, p.3 troubleshooting.)
- **User / device criteria require Client Connector (or Surrogate IP).** SSL Inspection rules that match on User, Group, Department, or Device Group only fire correctly when traffic is forwarded via Zscaler Client Connector (or GRE/IPSec with Enforce Surrogate IP). Under plain GRE/IPSec without surrogate-IP, user identity isn't available pre-inspection, so identity-based SSL rules silently miss. (*Leading Practices Guide*, p.14.)
- **Untrusted-cert Caution vs Block.** "Caution" lets users click through past a cert warning — but on an untrusted server cert this means letting them continue to a potentially malicious destination. Leading Practices recommends Block.
- **OCSP check timing.** OCSP revocation check happens *after* the cert chain validates as syntactically correct. A cert that's correctly structured but recently revoked is caught only if OCSP is enabled. Disabled by default on exemption rules.
- **Show-Notifications dependency chain.** Three options compose conditionally:
  - `Show Notifications for Blocked Traffic` (parent) — requires Zscaler/enterprise root CA in client truststore, otherwise users see invalid-cert warning instead of EUN.
  - `Show Notification for ATP Blocks` only appears when the parent is enabled.
  - `Override Default Intermediate CA Certificate` only appears when the parent is enabled.
  Configuring ATP-block notifications without first enabling the parent gives no UI path to the toggle. When the parent is **disabled**, the service resets the connection with a generic failed-connection message — no EUN at all. (*Configuring SSL/TLS Inspection Policy* lines 61–67.)

## Limits

- **255 SSL Inspection rules total** = 245 custom + 10 predefined. Tighter than DLP (1,024) and several other policy types; large enterprises with hundreds of per-application exemption rules hit this cap and need to consolidate via destination groups rather than file a support ticket. The cap is NOT raisable.
- **Rule name max length: 31 characters.** Lower than most other ZIA policies (which allow 128+). Automation scripts that generate descriptive rule names from app metadata will silently truncate — names get rejected at rule-save time. Source: *Configuring SSL/TLS Inspection Policy* line 27.

## Worked example (covers eval Q4)

Scenario: a user visits `https://evil.example.com`, which falls into the Miscellaneous Or Unknown category.

**Case A — Inspect All rule is active, Miscellaneous is not exempted:**

1. SSL Inspection policy evaluates. No exemption rule matches `evil.example.com`. The terminal Inspect All rule fires → decrypt.
2. URL filtering evaluates on the decrypted request. If a URL filtering rule targets Miscellaneous Or Unknown (or otherwise matches), it fires.
3. If URL filtering blocks, the user sees the block page.
4. Downstream (DLP, sandbox, malware) all run on the decrypted payload.

**Case B — An SSL exemption rule matches Miscellaneous with Evaluate Other Policies, under explicit forwarding:**

1. SSL Inspection policy evaluates on SNI only (explicit mode). `evil.example.com` is in Miscellaneous → exemption rule fires.
2. Traffic is not decrypted.
3. URL filtering evaluates against SNI only. A URL filtering Block rule on Miscellaneous *does* still match (SNI-level is enough) and blocks.
4. DLP / sandbox / malware do not run — they need decrypted payloads.
5. **Result: blocked at URL filtering, but no payload-level inspection happened.**

**Case C — Same exemption rule under transparent forwarding:**

1. SSL Inspection policy evaluates on SNI *and* destination IP (transparent mode). The destination IP is almost certainly classified as Miscellaneous → exemption fires even if the SNI is clean.
2. Identical downstream to Case B.
3. **Result: a much larger fraction of traffic exempted than the operator may have intended.**

**Case D — Exemption rule uses Bypass Other Policies:**

1. SSL Inspection exemption fires (either mode).
2. URL filtering does **not** evaluate. CAC does **not** evaluate.
3. **Result: request passes untouched regardless of downstream policy.** The Block rule on Miscellaneous does not fire. This is the common footgun.

The "before or after" question in Q4 resolves to: **URL Filtering evaluates twice on inspected HTTPS — once pre-decrypt on the SNI/CONNECT domain, once post-decrypt on the full URL — with the SSL Inspection decision in between.** The SSL decision doesn't precede URL Filtering as a whole; it gates the second pass (what URL Filtering can *see*) and, in the Bypass Other Policies variant, gates whether URL Filtering runs at all. Answers that collapse this to "SSL inspection happens before URL filtering" lose the first-pass behavior — which is exactly how an SNI-match Block rule can still fire on a do-not-inspect target.

## Open questions

- Transparent vs explicit forwarding edge cases when a user mixes modes — [clarification `zia-11`](../_clarifications.md#zia-11-transparent-vs-explicit-forwarding-mixed-mode)
- Exact behavior of SSL decision on the URL filtering default rule — if SSL says "Do Not Inspect + Evaluate Other Policies" and URL filtering has no matching rule, does the default URL-filtering action still fire? — [clarification `zia-12`](../_clarifications.md#zia-12-ssl-bypass-interaction-with-url-filtering-default-rule) (partially resolved by Policy Enforcement doc; edge case still open)

Resolved while writing this doc: pipeline-order explicit sourcing (see [clarification `zia-13`](../_clarifications.md#zia-13-explicit-pipeline-order-sourcing) — marked resolved with answer from `Understanding_Policy_Enforcement.pdf`).

## Cross-links

- URL filtering rule precedence (the next layer) — [`./url-filtering.md`](./url-filtering.md)
- Cloud App Control (evaluated after SSL in the pipeline) — [`./cloud-app-control.md`](./cloud-app-control.md)
- Cross-product policy evaluation model — [`../shared/policy-evaluation.md`](../shared/policy-evaluation.md)
- SPL pattern for observing what SSL decision actually fired — `ssl-inspection-observed` in [`../shared/splunk-queries.md`](../shared/splunk-queries.md)
