---
product: zpa
topic: "browser-access"
title: "Browser Access — clientless ZPA via a web browser"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
sources:
  - "vendor/zscaler-help/about-browser-access.md"
  - "vendor/zscaler-help/using-wildcard-certificates-browser-access-applications.md"
  - "vendor/terraform-provider-zpa/zpa/resource_zpa_application_segment_browser_access.go"
author-status: draft
---

# Browser Access — clientless ZPA via a web browser

**Browser Access** is ZPA's clientless web-app access path. A user on any device with a modern browser (no ZCC required) authenticates via the customer's IdP, then reaches internal web apps through a Zscaler-managed HTTPS ingress. It's the standard answer for "how do we give a contractor / partner / BYOD user access to our internal app without installing ZCC?"

## When to use Browser Access vs. ZCC

| Scenario | Choice |
|---|---|
| Contractor with personal laptop, needs internal wiki | **Browser Access** — no install on their device |
| Linux workstation where ZCC isn't supported for that OS version | **Browser Access** — ZCC OS-coverage gap |
| Employee on corporate device | **ZCC** — full traffic coverage, device posture, non-web apps |
| SSH / RDP / VNC | **PRA** (see [`./privileged-remote-access.md`](./privileged-remote-access.md)) — Browser Access does not cover these |
| Native non-web protocols beyond HTTP/HTTPS | **ZCC** — Browser Access is HTTP/HTTPS only |

Browser Access and ZCC are **not mutually exclusive** — enabling Browser Access on an application within a segment **automatically enables ZCC access too**. This is the dual-access model: the segment can be reached either way, and the user's device dictates which path.

## Traffic path

```
browser ──(HTTPS public CNAME)──▶ Zscaler ingress ──(mTLS to App Connector)──▶ App Connector ──(to internal app)
```

1. Browser resolves the published CNAME (e.g., `wiki.example.bazscaler.net`) to a Zscaler-managed ingress IP.
2. TLS 1.2 handshake with the ingress using the Browser Access certificate (CN must match the external FQDN, or users see a cert error).
3. User authenticates via the configured IdP (SAML / OIDC through ZIdentity).
4. Ingress forwards the request over ZPA's App Connector mesh to the internal app server.
5. App Connector presents the request to the backend; backend response flows the reverse path.

**Cipher suite constraint**: `ECDHE-RSA-AES128-GCM-SHA256` on TLS 1.2. Older browsers that don't negotiate this cipher silently fail.

**CORS support**: Private Access accepts CORS requests with the right `Access-Control-*` headers and honors valid `OPTIONS` preflight. Supported browsers (captured from help doc): Firefox 81.0+, Chrome 64/65 and 86.0.4240.75+, Edge 86.0.622.43+, Safari 12.0/13.0.

**Via header**: ZPA inserts a `Via` header in HTTP requests. Backend apps that strip or reject `Via` will break under Browser Access.

## The external vs. internal hostname decision

When you configure a Browser Access application you choose whether external and internal hostnames match:

- **Different hostnames** (e.g., `wiki.example.bazscaler.net` external, `wiki.internal` internal):
  - Internal hostname stays private — no public DNS exposure.
  - **Backend SSL can't be validated** — browser shows a cert warning because the Zscaler-presented cert matches the *external* FQDN, not the *internal* one the backend serves. Operationally resolved by also installing a cert on the backend whose CN matches the external name, or by using Zscaler-managed certificates throughout.
- **Same hostname** (`wiki.example.com` both sides):
  - Internal hostname **is** exposed on public DNS (it's the same record the browser resolves).
  - Backend SSL validates cleanly because the FQDN matches.

Most tenants use same-hostname for simplicity when the internal domain is already routable; different-hostname for genuine air-gap patterns.

## Certificate model

### Shape of the cert

- Zscaler-issued or customer-uploaded. Customer-uploaded is the more common path for regulated tenants.
- One certificate per Browser Access application (logical object in the segment). A wildcard cert can cover multiple apps.

### Wildcard certificate semantics — the one-level gotcha

A wildcard **application segment** like `*.example.com` matches at any depth — `app.example.com`, `deep.sub.example.com`, etc. A wildcard **certificate** `*.example.com` only matches **one level**:

| FQDN | Matches `*.example.com` cert? |
|---|---|
| `app.example.com` | ✓ |
| `wiki.example.com` | ✓ |
| `app.local.example.com` | ✗ — two levels down |

**Implication:** a wildcard app segment `*.example.com` paired with a wildcard cert `*.example.com` works for one-level subdomains only. For `app1.local.example.com` you must create a separate app segment `*.local.example.com` with a cert `*.local.example.com`. Don't assume one wildcard cert covers your entire tree.

### Per-app cert / CNAME / domain shown on the admin page

On **Policies > Access Control > Clientless > Access Methods > Browser Access** each row shows: Name, Segment Group, Server Groups, Canonical Name (CNAME), Certificate, Domain (FQDN), Status, Application Protocol (HTTP / HTTPS), Application Port.

## Session and auth lifecycle

- **Session cookies only** — cleared when the browser session terminates. No long-lived local token.
- Users must authenticate on first access.
- **Periodic reauth** based on the segment's **Authentication Timeout** (part of the Timeout Policy in `references/zpa/policy-precedence.md`). When it expires, the user bounces through IdP again — the session cookie alone doesn't refresh.
- Forcing a reauth by closing the browser is an operator technique when a session sticks to a stale identity.

## Mutual exclusions and constraints

From captured help docs + existing skill reference material:

- **Double Encryption is not supported** when Browser Access is enabled on any application in the segment. (*ZPA User-to-App Segmentation Reference Architecture* p.12.)
- **Source IP Anchoring (SIPA) is mutually exclusive** with Browser Access on the same segment. See [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md). The reason: SIPA requires the backend to see a ZPA App Connector IP; Browser Access terminates TLS at the Zscaler ingress before handing off, breaking the SIPA guarantee.
- **Multimatch is not supported** when Browser Access is enabled on any application in the segment. (From the same reference arch p.10 quote threaded into `./app-segments.md`.)
- **Port range must include the Browser Access port.** If a segment's port range is 443 only, the BA application on port 443 works; on port 8443 it won't.
- **TCP only** — Browser Access requires TCP port ranges. UDP port ranges don't apply.
- **`is_cname_enabled` has no effect on Browser Access segments.** Per *User-to-App Segmentation Reference Architecture* p.16: "This setting is not applicable for Browser Access applications, and Private Access functions as if the option is disabled."

## Terraform-level schema constraints

From `resource_zpa_application_segment_browser_access.go`:

- The resource is its own type: `zpa_application_segment_browser_access` (separate from the base `zpa_application_segment`). Treat them as different resources even though they share most fields.
- **`certificate_id` conflicts with `ext_label` + `ext_domain`.** If you configure a custom external label/domain, you can't also pin a certificate ID — Zscaler computes the cert binding from the domain config. Attempting both is rejected at `apply` time.
- **`select_connector_close_to_app` is `ForceNew`** (same as base segment). Toggling this on an existing Browser Access segment destroys and recreates it. Plan for user-session interruption.
- LSS log subtype: `zpa_lss_web_browser` is the Browser Access log source, distinct from `zpa_lss_user_activity` for ZCC sessions. Query accordingly when debugging BA-specific issues.

## Operational gotchas

1. **Users without ZCC and without Browser Access = no access.** Some tenants enable BA on only a subset of apps; the others are effectively ZCC-only. Browser Access is opt-in per application inside a segment; it's not a segment-level bundle.

2. **Backend SSL warnings on different-hostname configs are not a bug.** They're the cert-mismatch described above. Either accept them (and document), or switch to same-hostname, or put a Zscaler-managed cert on the backend.

3. **Browser cipher-support drift.** A browser that fails TLS to the Zscaler ingress usually means the cipher suite `ECDHE-RSA-AES128-GCM-SHA256` isn't in its preferred list. Rare on modern browsers; common on ancient embedded browsers (old IE in legacy VDIs, some appliance WebKit builds).

4. **Session-cookie reset = full re-auth.** Closing a tab (but not the browser session) usually retains the cookie. Closing the browser entirely forces re-auth. Incognito mode always forces re-auth.

5. **`Via` header interactions.** If the backend is a hop-counting proxy (e.g., Squid) it may treat the ZPA-inserted `Via` as an upstream hop and reject or loop. Rare but maddening when it hits.

6. **Public CNAME is visible.** The Browser Access CNAME (`wiki.example.bazscaler.net`-style) is a real DNS record that anyone can resolve. It's not a secret — security comes from IdP auth at the ingress, not from CNAME obscurity. Tenants with strong perimeter-secrecy requirements often use customer-managed CNAMEs (`wiki.example.com` → CNAME → Zscaler ingress) to avoid revealing the Zscaler relationship.

## Answer patterns this unlocks

- "How do I give a partner access to our internal app without installing ZCC?" → BA segment, IdP federated or guest user, published CNAME.
- "Why is the user seeing a cert error?" → different external vs internal hostname + backend presenting internal cert; check CN match or switch to same-hostname config.
- "Why isn't my wildcard cert covering `app1.sub.example.com`?" → one-level rule; create a separate `*.sub.example.com` cert + segment.
- "Why is Double Encryption failing on this segment?" → BA is enabled somewhere in the segment; mutually exclusive.
- "Can BA do SSH?" → No, HTTP/HTTPS only. Use PRA.

## Cross-links

- Application segment container: [`./app-segments.md`](./app-segments.md).
- PRA for non-HTTP protocols (RDP/SSH/VNC/console): [`./privileged-remote-access.md`](./privileged-remote-access.md).
- Mutual-exclusion with SIPA: [`../shared/source-ip-anchoring.md`](../shared/source-ip-anchoring.md).
- Timeout policies driving BA reauth: [`./policy-precedence.md § Timeout policies`](./policy-precedence.md).
- Terraform resource: [`../terraform.md`](../terraform.md) §`zpa_application_segment_browser_access`.
