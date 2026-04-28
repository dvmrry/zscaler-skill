---
product: zpa
topic: "browser-access"
title: "Browser Access — clientless ZPA via a web browser"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: mixed
sources:
  - "vendor/zscaler-help/about-browser-access.md"
  - "vendor/zscaler-help/using-wildcard-certificates-browser-access-applications.md"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_browser_access.go"
  - "vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/app_segments_ba_v2.py"
author-status: draft
---

# Browser Access — clientless ZPA via a web browser

**Browser Access** is ZPA's clientless web-app access path. A user on any device with a modern browser (no ZCC required) authenticates via the customer's IdP, then reaches internal web apps through a Zscaler-managed HTTPS ingress. It is the standard answer for "how do we give a contractor / partner / BYOD user access to our internal app without installing ZCC?"

---

## 1. Architectural difference from ZPA mTLS (ZCC path)

ZPA with ZCC uses **mutual TLS (mTLS)** between the ZCC client and the ZPA Public Service Edge (or Private Service Edge). The device certificate is part of authentication; the tunnel is established at the OS level; non-HTTP protocols are supported.

Browser Access does **none of this**:

| Dimension | ZCC (mTLS) path | Browser Access |
|---|---|---|
| Client requirement | ZCC installed on device | Any modern browser; no install |
| Protocol | mTLS — any TCP app | HTTPS / HTTP only |
| Authentication | IdP SSO + device cert (mTLS) | IdP SSO via browser redirect |
| Session persistence | OS-level tunnel; survives tab close | Session cookie; cleared on browser close |
| Device posture | Full ZCC posture evaluation | No posture — device is unmanaged |
| Non-HTTP protocols (SSH, RDP) | Supported via ZPA tunnel | Not supported — use PRA |
| Double Encryption | Supported | Not supported (mutually exclusive) |
| Source IP Anchoring (SIPA) | Supported | Not supported (mutually exclusive) |

The traffic path for Browser Access:

```
browser ─(HTTPS, public CNAME)─▶ Zscaler ingress ─(mTLS to App Connector)─▶ App Connector ─▶ internal app
```

The Zscaler ingress terminates TLS with the browser using the Browser Access certificate. The App Connector side still uses mTLS — only the browser-facing leg is "clientless."

---

## 2. When to use Browser Access vs ZCC vs PRA

| Scenario | Choice |
|---|---|
| Contractor with personal laptop, needs internal wiki | Browser Access — no install on their device |
| Linux workstation where ZCC isn't supported for that distro | Browser Access — ZCC OS-coverage gap |
| Employee on corporate device | ZCC — full traffic coverage, device posture, non-web apps |
| SSH / RDP / VNC (privileged access) | PRA — Browser Access does not cover these |
| Native non-HTTP protocols | ZCC — Browser Access is HTTP/HTTPS only |
| BYOD user needing access to a web portal | Browser Access — no client agent required |

Browser Access and ZCC are **not mutually exclusive**. When Browser Access is enabled on an application within an application segment, **ZCC access is automatically applied as well** (Tier A — vendor doc, `about-browser-access.md`). The segment is reachable both ways; the user's device dictates which path is used.

---

## 3. Supported application types and constraints

Browser Access supports: **HTTP and HTTPS protocols only** (Tier A — vendor doc).

Additional requirements:
- The application server must support TLS 1.2 encryption.
- The browser must support TLS 1.2 with cipher suite `ECDHE-RSA-AES128-GCM-SHA256`. Older browsers that don't negotiate this cipher silently fail.
- ZPA inserts a `Via` header in HTTP requests. Backend apps that strip or reject `Via` will break under Browser Access.
- ZPA accepts CORS requests with correct `Access-Control-*` headers and valid `OPTIONS` preflight requests.

**Supported browsers for CORS** (Tier A — vendor doc): Firefox 81.0, Chrome 64/65, Google Chrome 86.0.4240.75, Microsoft Edge 86.0.622.43, Safari 12.0, Safari 13.0.

**Not supported over Browser Access:**
- SSH, RDP, VNC — use PRA (`./privileged-remote-access.md`).
- Non-HTTP/HTTPS protocols — use ZCC.
- WebSocket support: not explicitly confirmed from vendor source; treat as unsupported until confirmed.

---

## 4. Certificate requirements

### 4.1 Certificate shape

- Zscaler-issued or customer-uploaded. Customer-uploaded is the common path for regulated tenants.
- One certificate per Browser Access application (logical object in the segment). A wildcard cert can cover multiple apps across multiple segments.

### 4.2 Wildcard certificate — the one-level rule (Tier A — vendor doc)

A wildcard **application segment** like `*.example.com` matches at any depth — `app.example.com`, `deep.sub.example.com`, etc. A wildcard **certificate** `*.example.com` only matches **one level**:

| FQDN | Matches `*.example.com` cert? |
|---|---|
| `app.example.com` | Yes |
| `wiki.example.com` | Yes |
| `app.local.example.com` | No — two levels down |

**Implication:** a wildcard app segment `*.example.com` paired with a wildcard cert `*.example.com` works for one-level subdomains only. For `app1.local.example.com`, create a separate app segment `*.local.example.com` with a cert `*.local.example.com`. One wildcard cert does not cover an entire subdomain tree.

ZPA will not consider the wildcard certificate valid for the second-level subdomain — the Browser Access app will fail to load for those URLs.

### 4.3 Wildcard cert across multiple app segments

The same wildcard certificate can be assigned to multiple fully qualified domain names (FQDNs) within a single app segment or across multiple app segments. Example: two segments, `app1.example.com` and `app2.example.com`, both using `*.example.com`. Valid — one cert object covers both.

---

## 5. External vs internal hostname

When configuring a Browser Access app, the operator chooses whether external and internal hostnames match:

**Different hostnames** (e.g., `wiki.example.bazscaler.net` external, `wiki.internal` internal):
- Internal hostname stays private — no public DNS exposure of the internal domain.
- Backend SSL **cannot be validated** — users see a web server certificate error because the Zscaler-presented cert matches the external FQDN but the backend serves the internal name. This is **documented expected behavior**, not a bug. (Tier A — vendor doc, `about-browser-access.md`.)
- Resolution options: (a) accept and document; (b) switch to same hostname; (c) install a cert on the backend whose CN matches the external name.

**Same hostname** (`wiki.example.com` both sides):
- Internal hostname **is** exposed on public DNS.
- Backend SSL validates cleanly — FQDN matches.
- Common choice when the internal domain is already public-DNS-routable.

Most tenants use same-hostname for simplicity; different-hostname for genuine air-gap patterns where internal hostnames must not appear in public DNS.

---

## 6. Session and auth lifecycle

- **Session cookies only** — cleared when the browser session terminates (Tier A — vendor doc). Incognito mode always forces re-auth. Closing a tab (not the browser) usually retains the cookie.
- Users must authenticate via the configured IdP before accessing applications.
- **Periodic reauthentication** based on the ZPA Timeout Policy's **Authentication Timeout** setting. When it expires, the user is bounced through IdP again — the session cookie alone does not refresh the auth.
- Forcing a reauth by closing the browser is an operator technique when a session sticks to a stale identity.

---

## 7. Policy interaction with ZPA access policy

Browser Access apps are subject to the same ZPA access policy as ZCC-accessed apps in the same segment. The access policy conditions (user, group, SAML attribute, SCIM group, posture, client type) apply equally to browser-based sessions.

**Client type condition:** the client type for Browser Access sessions is `zpn_client_type_browser_isolation` (distinct from `zpn_client_type_zapp` for ZCC). Policy rules that scope by client type can target or exclude Browser Access users specifically.

**Posture conditions in Browser Access:** because the browser has no ZCC agent, posture signals are unavailable. A policy rule with a posture condition (`POSTURE` operand) will never match for Browser Access sessions — the posture result is absent, which is treated as failure. If the access policy requires posture for access, Browser Access users are effectively blocked regardless of other conditions.

---

## 8. App Segment configuration differences for Browser Access

Browser Access apps are configured as a sub-object (`clientlessApps`) within a standard application segment. Each Browser Access app within the segment gets its own:
- External FQDN (domain)
- Application protocol (HTTP or HTTPS)
- Application port
- Browser Access certificate
- CNAME (Zscaler-managed or customer-managed)

The **Browser Access page** (Policies > Access Control > Clientless > Access Methods > Browser Access) shows all configured BA apps with: Name, Segment Group, Server Groups, Canonical Name (CNAME), Certificate, Domain (FQDN), Status, Application Protocol, Application Port.

**Constraints on app segments hosting Browser Access apps:**
- **Double Encryption** is not supported when Browser Access is enabled on any application in the segment.
- **Source IP Anchoring (SIPA)** is mutually exclusive with Browser Access on the same segment. SIPA requires the backend to see a ZPA App Connector IP; Browser Access terminates TLS at the Zscaler ingress before handing off, breaking the SIPA guarantee.
- **Multimatch** is not supported when Browser Access is enabled on any application in the segment.
- **`is_cname_enabled` has no effect** on Browser Access segments — Private Access functions as if the option is disabled.
- **Port range must include the Browser Access port.** If a segment's port range covers only 443, a BA app on port 8443 will not work.
- **TCP only** — Browser Access requires TCP port ranges. UDP port ranges do not apply.

---

## 9. API and SDK surface

### 9.1 Python SDK — `app_segments_ba` and `app_segments_ba_v2`

Two SDK services cover Browser Access app segments:

| Property | Class | File | Version |
|---|---|---|---|
| `client.zpa.app_segments_ba` | `ApplicationSegmentBAAPI` | `app_segments_ba.py` | v1 |
| `client.zpa.app_segments_ba_v2` | `AppSegmentsBAV2API` | `app_segments_ba_v2.py` | v2 |

Both share the same underlying `/application` endpoint as the base `ApplicationSegmentAPI`, but provide a separate client object and named methods for the Browser Access context. For new integrations, prefer `app_segments_ba_v2`.

**Methods (both versions):**

| Method | Notes |
|---|---|
| `list_segments_ba(query_params=None)` | Lists BA segments |
| `get_segment_ba(segment_id)` | Returns single BA segment |
| `add_segment_ba(**kwargs)` | Creates a BA segment; same required params as base segment (`name`, `domain_names`, `segment_group_id`, `server_group_ids`) plus `clientless_app_ids` |
| `update_segment_ba(segment_id, **kwargs)` | On update, resolves `clientless_app_ids` by matching on `domain` + `app_id` against `BROWSER_ACCESS` type segments |
| `delete_segment_ba(segment_id, force_delete=False, microtenant_id=None)` | |

Go SDK parity: `applicationsegmentbrowseraccess/` package.

### 9.2 Certificates API

Browser Access certificates are managed via `client.zpa.certificates` (`CertificatesAPI`). Uses both v1 and v2 endpoints.

| Method | Notes |
|---|---|
| `list_certificates(query_params=None)` | Lists all BA certificates |
| `get_certificate(certificate_id)` | Returns single cert |
| `add_certificate(**kwargs)` | Upload customer cert |
| `delete_certificate(certificate_id, microtenant_id=None)` | |

### 9.3 Terraform resource

Resource type: `zpa_application_segment_browser_access`. This is a separate Terraform resource from the base `zpa_application_segment` — treat them as distinct even though they share most fields.

Key Terraform constraints:
- **`certificate_id` conflicts with `ext_label` + `ext_domain`**. If a custom external label/domain is configured, pinning a certificate ID is rejected at apply time.
- **`select_connector_close_to_app` is `ForceNew`** — toggling this on an existing BA segment destroys and recreates it. Plan for session interruption.

---

## 10. Common pitfalls

**1. Auth loop on different-hostname configs.** When external and internal hostnames differ, users see a web server certificate error on the backend (expected behavior). Help-desk tickets routinely report "internal app via Browser Access shows cert error" — this is documented, not a misconfiguration.

**2. Backend rejects `Via` header.** ZPA inserts a `Via` header in HTTP requests. Backends that are hop-counting proxies (e.g., Squid) may reject or loop on this header. Rare but confusing when it occurs.

**3. Browser cipher support drift.** Browsers that fail TLS to the Zscaler ingress usually cannot negotiate `ECDHE-RSA-AES128-GCM-SHA256`. Rare on modern browsers; common on embedded browsers in legacy VDIs or appliances.

**4. Posture conditions block Browser Access silently.** A ZPA access policy rule with a posture condition (`rhs = "true"`) will never match for Browser Access sessions — the device has no ZCC agent to report posture. The user gets a generic deny response with no explanation that posture is the cause.

**5. Wildcard cert one-level limit.** A wildcard cert `*.example.com` does not cover `app1.sub.example.com`. A second-level deep app must have its own `*.sub.example.com` cert and corresponding segment.

**6. Public CNAME is visible.** The Browser Access CNAME is a real DNS record resolvable by anyone. Security comes from IdP auth at the ingress, not from CNAME obscurity. Tenants with perimeter-secrecy requirements use customer-managed CNAMEs (`wiki.example.com` → CNAME → Zscaler ingress) to hide the Zscaler relationship.

**7. Cookie handling edge cases.** Session-cookie reset = full re-auth. Closing a tab (not the browser) usually retains the cookie; closing the browser entirely forces re-auth. Incognito always forces re-auth.

**8. LSS log subtype.** Browser Access sessions appear in LSS under log source type `browser_access` / `zpn_http_trans_log` — distinct from ZCC sessions (`user_activity` / `zpn_trans_log`). Query accordingly when debugging BA-specific issues.

---

## 11. Answer patterns this unlocks

- "How do I give a partner access to our internal app without installing ZCC?" → BA segment, IdP federated or guest user, published CNAME.
- "Why is the user seeing a cert error?" → Different external vs internal hostname + backend presenting internal cert; check CN match or switch to same-hostname config.
- "Why isn't my wildcard cert covering `app1.sub.example.com`?" → One-level rule; create a separate `*.sub.example.com` cert + segment.
- "Why is Double Encryption failing on this segment?" → BA is enabled somewhere in the segment; mutually exclusive.
- "Can BA do SSH?" → No, HTTP/HTTPS only. Use PRA.
- "Why is a user with failed posture still getting a deny on a BA app even though posture isn't in the rule?" → If a posture condition IS in the rule, it silently never matches for agentless users.

---

## Cross-links

- Application segment container — [`./app-segments.md`](./app-segments.md)
- PRA for non-HTTP protocols (RDP/SSH/VNC/console) — [`./privileged-remote-access.md`](./privileged-remote-access.md)
- Mutual-exclusion with SIPA — [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md)
- Timeout policies driving BA reauth — [`./policy-precedence.md § Timeout policies`](./policy-precedence.md)
- Terraform resource — [`../terraform.md`](../terraform.md) `§zpa_application_segment_browser_access`
- SDK method catalog for BA segments — [`./sdk.md §2.3 ApplicationSegmentBAAPI`](./sdk.md) and [`./sdk.md §2.4 AppSegmentsBAV2API`](./sdk.md)
