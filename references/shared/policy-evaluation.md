---
product: shared
topic: "shared-policy-evaluation"
title: "Zscaler policy evaluation — shared mental model"
content-type: reasoning
last-verified: "2026-04-23"
confidence: medium
source-tier: doc
sources:
  - "https://help.zscaler.com/zia/about-policy-enforcement"
  - "vendor/zscaler-help/Understanding_Policy_Enforcement.pdf"
  - "https://help.zscaler.com/zia/configuring-url-filtering-policy"
  - "vendor/zscaler-help/Configuring_the_URL_Filtering_Policy.pdf"
  - "https://help.zscaler.com/zpa/about-access-policy"
  - "vendor/zscaler-help/About_Access_Policy.pdf"
  - "https://help.zscaler.com/zscaler-deployments-operations/access-policy-deployment-and-operations-guide"
  - "vendor/zscaler-help/Access_Policy_Deployment_and_Operations_Guide.pdf"
  - "https://help.zscaler.com/zpa/configuring-defined-application-segments"
  - "vendor/zscaler-help/Configuring_Defined_Application_Segments.pdf"
  - "https://help.zscaler.com/zpa/about-policies"
  - "vendor/zscaler-help/About_Policies.pdf"
  - "https://help.zscaler.com/zpa/configuring-access-policies"
  - "vendor/zscaler-help/Configuring_Access_Policies.pdf"
author-status: draft
---

# Zscaler policy evaluation — shared mental model

How ZIA and ZPA structure policy evaluation, what they share, and where they diverge. Cited directly from Zscaler's authoritative documentation.

## Summary (side-by-side)

| Dimension | ZIA (web traffic) | ZPA (private application access) |
|---|---|---|
| **Default when no rule matches** | Allow | Block |
| **Where evaluation runs** | Public Service Edge | Client (segment selection) + Public Service Edge / Private Service Edge (policy) |
| **First-order matching** | Firewall module → Web module pipeline | Segment selection (client-side): most-specific FQDN/IP wins |
| **Within a policy layer** | Top-down, first-match | Top-down, first-match within matched-segment rules |
| **Host visibility for HTTPS** | Full URL post-decrypt; SNI/CONNECT-only pre-decrypt | Domain + port (client already knows which app from segment match) |
| **Cross-layer precedence** | Firewall→Web ordered; web module has per-method internal order; CAC-before-URL-filter with cascading flag | Segments carve out: specific FQDN removes that domain from overlapping wildcard segments by default |

**ZIA default-allow vs ZPA default-block** is the single biggest cross-product difference and the most common source of wrong intuitive answers. Always confirm which product's defaults apply to a question before reasoning about rule precedence.

## ZIA evaluation pipeline

From *Understanding Policy Enforcement* pp.1–2:

> Zscaler uses full-featured inline proxies called Public Service Edges for Internet & SaaS, which feature Single Scan Multi-Action (SSMA) technology, to inspect and enforce policies on traffic leaving and coming into your organization.

> All web traffic is first evaluated in the firewall module and only if it passes the firewall module (i.e., if it didn't violate any firewall policies), it's forwarded to the web module where the traffic is evaluated against the web policies.

Traffic flow (from *Understanding Policy Enforcement* p.1):

- **Outbound web traffic** → firewall module → (if not blocked) web module → (if not blocked) internet.
- **Outbound non-web traffic** (ports other than 80/443 or their HTTP/HTTPS equivalents) → firewall module only → (if not blocked) internet.
- **Inbound web traffic** (HTTP or HTTPS responses to prior GET/POST requests) → web module only → (if not blocked) into the organization.

**Firewall-web asymmetry** (*Understanding Policy Enforcement* p.2):

> If your organization's web policy allows a transaction but has a conflicting firewall policy that blocks it, the service applies the firewall policy. For example, if the web Cloud App Control policy allows the application Box.com, but the firewall policy blocks it, the service blocks the transaction.

So a firewall "allow" does not override a subsequent web-module block — both layers must independently pass.

### Web module internal order (HTTP GET)

From *Understanding Policy Enforcement* pp.3–5:

1. Custom Malicious URLs (Advanced Threat Protection)
2. Cloud App Control
3. URL Filtering
4. Security Exceptions
5. Browser Control
6. Country-Based Blocking (ATP)
7. IPS Signature Detection (ATP)
8. Suspicious Content Protection (ATP)
9. P2P Control (ATP)
10. Bandwidth Control

HTTP POST adds Malware Protection, File Type Control, DLP, and P2P at later positions (pp.5–6). HTTP GET/POST Response adds Sandbox and AI/ML Content Categorization (pp.7–9).

**First-violation halts the pass.** Per *Understanding Policy Enforcement* p.3: "when the web module determines that a transaction violates a specific policy, the Public Service Edge immediately blocks that transaction and does not continue enforcing the policies that follow."

### HTTPS two-pass evaluation

From *Understanding Policy Enforcement* pp.11–13:

- **CONNECT/SNI pass** (pre-decrypt, domain-only): evaluates a subset of web-module policies using only the destination domain. The doc enumerates this subset in the order **Known Malicious URLs (ATP) → Cloud App Control → URL Filtering → Bandwidth Control** (same ordering as the full-URL pipeline on p.3–5).
- **SSL Inspection policy decision**: Inspect / Do Not Inspect + Evaluate Other Policies / Do Not Inspect + Bypass Other Policies.
- **Full-URL pass** (only if decrypted): the complete web-module pipeline runs with URL path + headers + body available, using the GET/POST/Response orderings enumerated on pp.3–9.

Direct quote (*Understanding Policy Enforcement* p.13):

> During a CONNECT request or an incoming SSL connection (SNI), only the destination domain is available and not the full URL. So, the Public Service Edge applies only the following set of policies, which are based only on the requested domain and not the full URL or HTTP header. These policies are only a subset of the policies enforced on the HTTP traffic: Known Malicious URLs, Cloud App Control, URL Filtering, Bandwidth Control.

**CAC-before-URL-Filtering precedence applies at both passes.** The subset list enumerates CAC before URL Filtering. Combined with the CAC-wins-on-allow rule from *Configuring the URL Filtering Policy* p.1, a CAC allow for a domain (evaluated on SNI) skips URL Filtering at the SNI pass as well as at the full-URL pass — unless cascading is enabled. See `../zia/cloud-app-control.md` for the allow/block asymmetry under cascading.

### CAC-vs-URL-filter cascading

From *Configuring the URL Filtering Policy* p.1:

> By default, the Cloud App Control policy takes precedence over the URL Filtering policy. If a user requests a cloud app that you explicitly allow with Cloud App Control policy, the service only applies the Cloud App Control policy and not the URL Filtering policy.

> However, this behavior changes if you enable Allow Cascading to URL Filtering in Advanced Settings. If you do, the service applies the URL Filtering policy even if it applies a Cloud App Control policy rule allowing the transaction.

Cascading flips the **allow** path only. A CAC block always wins regardless of cascading.

## ZPA evaluation pipeline

From *About Policies* p.2 (the authoritative "Policy Evaluation Order" section):

> Private Access evaluates policy rules using the most specific application segment and a top-down, first-match principle. For example, when a user requests a specific application, Private Access starts evaluating all of your configured policies, starting with the first rule in a set of policy rules. As soon as it finds a policy that matches the criteria that was specified in a rule, it enforces that policy rule and disregards all other rules that follow, including any potentially conflicting rules.

Two-stage model:

1. **Segment selection** — runs in Zscaler Client Connector. Most-specific FQDN/IP wins. If the destination port is not in the selected segment's port ranges, traffic drops client-side without reaching ZPA. See [`../zpa/app-segments.md`](../zpa/app-segments.md).
2. **Policy evaluation** — runs in the ZPA cloud. Rules that reference the selected segment (directly or via a segment group containing it) evaluate top-down, first-match.

### ZPA policy types

Per *About Policies* p.1, ZPA applies the following policy types, each with its own rule set and default behavior (*About Policies* p.3):

| Policy type | Default when no rule matches | Source |
|---|---|---|
| **Access Policy** | Block Access (implicit) | *About Policies* p.3 |
| **AppProtection Policy** | (not specified in vendored material) | *About Policies* p.2 |
| **Browser Protection Policy** | (not specified in vendored material) | *About Policies* p.2 |
| **Client Forwarding Policy** | Forward to Private Access (implicit) | *About Policies* p.3 |
| **Isolation Policy** | Default isolation policy rule applies | *About Policies* p.3 |
| **Privileged Credentials Policy** (PRA) | (not specified) | *About Policies* p.2 |
| **Privileged Capabilities Policy** (PRA) | (not specified) | *About Policies* p.2 |
| **Timeout Policy** | Default timeout policy rule applies | *About Policies* p.3 |
| **Redirection Policy** | (not specified) | *About Policies* p.2 |

All types share the "most-specific-segment + top-down first-match" evaluation model per p.2. The major defaults differ: Access Policy defaults to block; Client Forwarding defaults to forward-to-ZPA.

### SAML NameID caveat

From *About Policies* p.1:

> Private Access uses the Name Identifier (NameID) within a SAML assertion for IdP configuration and authentication. Using NameID as a SAML attribute within access and timeout policy rules is not supported.

To reference NameID-bound value in policy criteria, configure an IdP-side user attribute (e.g., Email Address, User Name) that duplicates the NameID value, then match on that attribute.

### Carved-out behavior on overlapping segments

From *Using Application Segment Multimatch* p.4 (cited in `../zpa/app-segments.md`):

> After a specific FQDN (Fully Qualified Domain Name) has been configured in an application segment, it is removed from the wildcard application segment by default.

So overlapping segments do **not** fall through to less-specific segments by default — specificity is exclusive unless Multimatch is enabled.

## Shared patterns

Both products share:

- **First-match-by-rule-order semantics** within a policy layer. ZIA (*Configuring the URL Filtering Policy* p.3): "The evaluation of the policy rules stops at the first match." ZPA (*About Access Policy* p.1): "top-down, first-match principle."
- **Disabled rules retain their order position.** Documented for ZIA (*Configuring the URL Filtering Policy* p.3). ZPA-equivalent behavior is not explicitly stated in the vendored material — see [clarification `shared-06`](../_clarifications.md#shared-06-zpa-disabled-rule-semantics).
- **Specificity plays a role in category/segment resolution.** ZIA custom category specificity (*URL Filtering Deployment and Operations Guide* p.2): "More specific custom category entries always take precedence." ZPA segment specificity (*Understanding Application Access* p.1 + *Using Application Segment Multimatch* p.9): most-specific FQDN wins.

## Where the products genuinely differ

Beyond the default-allow vs default-block split:

- **ZIA evaluates a lot of policies for one request.** The web-module pipeline has 10+ enforcement stages (malware, DLP, sandbox, file type, IPS, etc.) per HTTP method. ZPA has a single access-policy engine per request (plus timeout, client forwarding, inspection as separate policy types — but those are orthogonal, not pipelined in the same sense).
- **ZIA does per-request classification** (URL categorization, CAC app identification, threat scoring) and uses those classifications as policy inputs. ZPA uses primarily identity + device-posture + network-location as policy inputs; the "application" is already identified by segment selection.
- **ZIA post-decrypt visibility is optional** (controlled by the SSL Inspection policy). ZPA's segment decides the app before any TLS; the client forwards the TCP/UDP stream without needing to decrypt for policy-input purposes.
- **ZPA evaluation is distributed** (client selects the segment before traffic reaches the cloud). ZIA evaluation is entirely at the Service Edge.

## Edge cases spanning both products

- **Source IP Anchoring (SIPA).** ZPA application segments can enable "Inspect Traffic with ZIA" (*Configuring Defined Application Segments* p.2): "Enable to leverage single posture for securing internet or SaaS and private applications and apply Data Loss Prevention policies to the application segment you are creating." When enabled, ZPA hands internal-app traffic to ZIA for additional inspection. Country-code evaluation in ZPA then uses ZIA's public-IP (per *About Access Policy* p.2).
- **Zscaler Client Connector is in both paths.** For endpoints with the Client Connector installed, a single forwarding profile decides ZIA vs ZPA vs direct vs bypass per destination. Both products see user identity (via Surrogate IP or Client Connector) and device posture consistently.

## Open questions

- ZPA disabled-rule semantics (parity with ZIA unclear from docs) — [clarification `shared-06`](../_clarifications.md#shared-06-zpa-disabled-rule-semantics)
- Policy Evaluation Order article (referenced but not vendored) — would further strengthen both ZIA and ZPA pipeline claims (see zpa-08)

## Cross-links

- **Cross-product integrations dossier** (hooks between ZIA/ZPA/ZCC — silent-miss catalog) — [`./cross-product-integrations.md`](./cross-product-integrations.md)
- Cloud architecture (CA, Service Edges, BC Cloud, tunnel model) — [`./cloud-architecture.md`](./cloud-architecture.md)
- Activation gate (ZIA-only) — [`./activation.md`](./activation.md)
- ZIA URL filtering precedence — [`../zia/url-filtering.md`](../zia/url-filtering.md)
- ZIA Cloud App Control interaction — [`../zia/cloud-app-control.md`](../zia/cloud-app-control.md)
- ZIA SSL inspection ordering — [`../zia/ssl-inspection.md`](../zia/ssl-inspection.md)
- ZPA application segment matching — [`../zpa/app-segments.md`](../zpa/app-segments.md)
- ZPA access policy precedence — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
