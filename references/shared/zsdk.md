---
product: shared
topic: zsdk
title: "Zscaler SDK for Mobile Apps (ZSDK) — architecture, configuration objects, limits, error codes"
content-type: reference
last-verified: "2026-04-28"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/zsdk-what-zscaler-sdk-mobile-apps.md"
  - "vendor/zscaler-help/zsdk-developer-reference.md"
  - "vendor/zscaler-help/zsdk-about-access-policy.md"
  - "vendor/zscaler-help/zsdk-about-segment-groups.md"
  - "vendor/zscaler-help/zsdk-about-app-connectors.md"
  - "vendor/zscaler-help/zsdk-about-registered-apps.md"
  - "vendor/zscaler-help/zsdk-register-your-app.md"
  - "vendor/zscaler-help/zsdk-step-step-configuration-guide-zsdk.md"
  - "vendor/zscaler-help/zsdk-understanding-zsdk-cloud-architecture.md"
  - "vendor/zscaler-help/zsdk-best-practices.md"
  - "vendor/zscaler-help/zsdk-ranges-limitations.md"
  - "vendor/zscaler-help/zsdk-understanding-zsdk-error-codes.md"
author-status: draft
---

# Zscaler SDK for Mobile Apps (ZSDK) — architecture, configuration objects, limits, error codes

## What ZSDK is and who uses it

Zscaler SDK for Mobile Apps (ZSDK) is a ZTNA product embedded directly into consumer or enterprise mobile applications (iOS and Android). It is **not** an admin or IT product — the primary users are **mobile app developers** at organizations that own the app source code and want to enforce Zero Trust access control without requiring end users to install a separate security client (Tier A — vendor/zscaler-help/zsdk-what-zscaler-sdk-mobile-apps.md).

The value proposition: back-end APIs and services are deployed behind App Connectors and are invisible to the public internet. The mobile app, with ZSDK embedded, establishes mTLS microtunnels through the ZSDK cloud to reach those services. No VPN client, no ZCC install.

### ZSDK vs ZCC vs ZPA — key distinctions

| Dimension | ZSDK | ZCC | ZPA (direct) |
|---|---|---|---|
| Who installs it | App developer embeds SDK in app | IT deploys agent to managed device | IT deploys App Connector; user accesses via ZCC or browser |
| Target user | Consumer mobile app user | Enterprise employee | Enterprise employee |
| Admin portal | `admin.zsdkone.net` (ZSDK-specific cloud) | ZCC Portal | ZPA Admin Portal |
| Terraform / SDK support | None — portal-only | ZCC SDK (Python/Go); no Terraform provider | ZPA SDK (Python/Go); Terraform provider |
| mTLS tunnel | App Connector → ZSDK Public Service Edge | Z-Tunnel to ZIA PSE / ZPA microtunnel | App Connector → ZPA cloud |
| Platform scope | iOS, Android native + hybrid apps | Windows, macOS, Linux, iOS, Android, ChromeOS | Any client via ZCC or browser (Browser Access) |

**ZSDK is out of scope for SDK/Terraform automation work** — there is no ZSDK Terraform provider, no ZSDK Python SDK, and no ZSDK Go SDK in the vendor sources. All ZSDK configuration is portal-only via `admin.zsdkone.net`.

---

## The ZSDK admin cloud

ZSDK runs on a dedicated multi-tenant infrastructure separate from ZPA and ZIA. Admin portal: `admin.zsdkone.net` (Tier A — vendor/zscaler-help/zsdk-understanding-zsdk-cloud-architecture.md).

Architecture components:

- **ZSDK Public Service Edges (PSEs)** — Zscaler-operated cloud nodes; the ZSDK app tunnels connect here. Analogous to ZPA Public Service Edges.
- **ZSDK Private Service Edges** — customer-hosted equivalent; analogous to ZPA Private Service Edges.
- **App Connectors** — customer-deployed; sit between the ZSDK cloud and the customer's back-end servers. Same concept as ZPA App Connectors but provisioned against the ZSDK cloud.
- **Mobile Client SDK** — the library embedded in the mobile app.

All communication is end-to-end encrypted. Multi-tenant isolation is enforced at the cloud level.

---

## How authentication and tunnels work

### Access token flow

1. The mobile app authenticates the user via the customer's Identity Provider and obtains a JWT access token.
2. The embedded ZSDK library verifies the token's signature against the security certificate and validates required JWT claims.
3. After identity verification succeeds, ZSDK calls `startZeroTrustTunnel()` with the access token.
4. ZSDK creates an mTLS microtunnel to the ZSDK Public Service Edge. The PSE acts as broker and routes requests through the App Connector's outbound microtunnel to the back-end service.

The App Connector establishes outbound-only connections to the ZSDK cloud — no inbound ports required (Tier A — vendor/zscaler-help/zsdk-about-app-connectors.md).

### Token validation and trust binding

Each registered app has a **Trust Binding** setting that controls device re-enrollment frequency:

| Trust Binding | Behavior |
|---|---|
| Strong | More frequent device re-enrollment; higher security |
| Loose | Longer intervals between re-enrollments |

Authentication Type is always **One Identity** (the ZSDK-specific IdP connector). The JWT is verified against the security certificate at every tunnel establishment (Tier A — vendor/zscaler-help/zsdk-about-registered-apps.md).

---

## Configuration objects

### Registered Apps

A registered app is the first provisioning step. It produces an **app key** that the developer embeds in the mobile app's source code. Without a published app key, the SDK cannot establish any tunnel.

Registration fields:

| Field | Notes |
|---|---|
| Name | Mobile app name — for admin reference only |
| Description | Optional |
| Authentication Type | Always "One Identity" |
| Trust Binding | Strong or Loose (see above) |

After creation, the app key must be **Published** to activate it. Once published, the key cannot be edited or deleted — only Revoked. Revoking an app key immediately invalidates all SDK tunnels for that app (Tier A — vendor/zscaler-help/zsdk-about-registered-apps.md, vendor/zscaler-help/zsdk-register-your-app.md).

Navigation: Configuration & Control > Apps > Registered Apps

### App Connectors and App Connector Groups

App Connectors are VMs or Linux packages deployed in the customer's data center, private cloud, or public cloud (AWS EC2, etc.). They establish outbound mTLS tunnels to the ZSDK cloud.

Key properties:

- Co-located with the back-end applications or deployed anywhere with network access to them.
- ZSDK selects the closest App Connector based on user location and App Connector-to-application latency.
- Always-active; deployed in redundant pairs (App Connectors do not communicate with each other).
- Outbound-only — no inbound ports needed.

Navigation: Configuration & Control > Private Infrastructure > App Connector Management > App Connectors (Tier A — vendor/zscaler-help/zsdk-about-app-connectors.md)

### Application Segments

Application segments define the back-end destinations (IP addresses, FQDNs, ports) that the ZSDK cloud will route to via App Connectors. Each application segment must be placed in a **Segment Group**.

### Segment Groups

Segment groups logically group application segments. Access policy rules reference either individual application segments or segment groups. Using segment groups simplifies policy: a single policy rule with a segment group covers all applications in that group (Tier A — vendor/zscaler-help/zsdk-about-segment-groups.md).

Navigation: Resource Management > Application Management > Segment Groups

### Access Policy

Access policy rules define which client groups (authenticated users / device profiles) can reach which application segments or segment groups. Rules are evaluated in order; the first matching rule applies.

Rule components:

- **Criteria** — conditions that must be true (user attributes, device profile, client type, etc.)
- **Boolean Operators** — how criteria combine (AND/OR logic)
- **Rule Action** — Allow Access, Block Access, or Require Approval

Policy configuration: Policy > Access Policy (Tier A — vendor/zscaler-help/zsdk-about-access-policy.md)

---

## Configuration workflow (canonical order)

From the step-by-step guide (Tier A — vendor/zscaler-help/zsdk-step-step-configuration-guide-zsdk.md):

1. Register your app → obtain an app key
2. Configure a Token Validator (validates the JWT claims from the IdP)
3. Add App Connectors (create the records in the portal)
4. Deploy App Connectors (install and provision the VMs/packages)
5. Define Application Segments (back-end destinations)
6. Add Access Policy (who can reach what)
7. Integrate ZSDK into the mobile app source code

---

## Key limits

All limits are per organization unless noted (Tier A — vendor/zscaler-help/zsdk-ranges-limitations.md):

| Category | Feature | Limit |
|---|---|---|
| Administration | Admins | 1,000 |
| Administration | Roles | 100 |
| App Connector Management | App Connectors | 100 |
| App Connector Management | App Connector Groups | 100 |
| App Connector Management | Provisioning Keys | 100 |
| Application Management | Applications total | 6,000 |
| Application Management | Applications per segment | 2,000 |
| Application Management | IP addresses / domains per segment | 2,000 (wildcards count against this) |
| Application Management | DNS TXT records per lookup | 100 max; excess ignored |
| Application Management | DNS resolutions per domain on App Connector | 200 IP addresses |
| Application Management | Segment Groups | 200 |
| Application Management | Application Segments | 6,000 |
| Application Management | DNS Suffixes | 50 |
| Application Management | Servers | 10,000 |
| Application Management | Server Groups | 1,000 |
| Authentication | IdP Configurations | 10 |
| Authentication | SAML Attributes | 100 |
| Certificate Management | Web server certificates | 1,000 |
| Certificate Management | Enrollment certificates | 1,000 |
| Access Policies | Policy rules | 2,000 |
| Access Policies | Application segments per rule | 1,000 |
| Access Policies | App Connector groups per rule | 48 (applies even when "All groups" is selected) |
| Device Profiles | Device profiles | 200 |
| Device Profiles | UUIDs per profile | 50 |
| Device Profiles | Other attributes per profile | 10 |
| Private Service Edges | Private Service Edges | 100 |
| Private Service Edges | PSE Groups | 100 |
| Private Service Edges | PSE Provisioning Keys | 100 |
| Organization | Admin password length | 100 characters |

---

## Developer SDK classes and notifications

The ZSDK library exposes four classes (Tier A — vendor/zscaler-help/zsdk-developer-reference.md):

- `ZscalerSDK` — the shared singleton; use the shared instance throughout the app
- `ZscalerConfiguration` — configure before calling any tunnel methods
- `ZscalerProxyInfo` — proxy configuration
- `ZscalerError` (iOS) / `ZscalerSDKException` (Android) — error handling

### Tunnel lifecycle notifications

| Android enum | iOS NSNotification | Meaning |
|---|---|---|
| `ZSCALERSDK_TUNNEL_CONNECTED` | `ZscalerSDKTunnelConnected` | Tunnel up; app can send HTTPS and WebView traffic |
| `ZSCALERSDK_TUNNEL_DISCONNECTED` | `ZscalerSDKTunnelDisconnected` | Tunnel stopped |
| `ZSCALERSDK_TUNNEL_RECONNECTING` | `ZscalerSDKTunnelReconnecting` | Connection attempt to PSE in progress |
| `ZSCALERSDK_TUNNEL_AUTHENTICATION_REQUIRED` | `ZscalerSDKTunnelAuthenticationRequired` | Client certificate or access token expired — call `startZeroTrustTunnel()` with a fresh token |
| `ZSCALERSDK_TUNNEL_RESOURCE_BLOCKED` | `ZscalerSDKTunnelResourceBlocked` | Access blocked by access policy |
| `ZSCALERSDK_PROXY_START_FAILED` | `ZscalerSDKProxyStartFailed` | Proxy initialization failed |

### Developer best practices (Tier A — vendor/zscaler-help/zsdk-best-practices.md)

- Use the shared `ZscalerSDK` instance for consistency.
- Configure `ZscalerConfiguration` before starting tunnels.
- Implement error handling with `ZscalerError` / `ZscalerSDKException`.
- Call `suspend()` when app enters background (Android) or before suspension (iOS); call `resume()` on foreground return. Ensure network ops complete before suspension.
- Subscribe to ZSDK notifications via `BroadcastReceiver` (Android) or `NSNotification` (iOS) to monitor tunnel state.
- Export and clear logs as needed for debugging.

---

## Error codes

### ZSDK error codes (Tier A — vendor/zscaler-help/zsdk-understanding-zsdk-error-codes.md)

| Code | Name | Description |
|---|---|---|
| 9001 | unknown | Unknown error |
| 9002 | invalidParameter | Invalid input parameter |
| 9101 | noNetwork | Network unavailable when starting tunnel |
| 9102 | timeOut | Request timed out |
| 9103 | dnsFailure | DNS issue while connecting tunnel |
| 9301 | permissionDenied | ZSDK permission not granted to user |
| 9302 | sdkNotInitialized | ZSDK not initialized — call `ZscalerSDK.init()` first |
| 9303 | sdkSecureInitFailed | SDK initialized but initialization issue |
| 9304 | invalidProxyPort | Proxy port invalid |
| 9305 | proxyConnectFailed | Connection to proxy server failed |
| 9306 | setWebViewProxyFailed | Set proxy in WebView failed — update Android WebView |
| 9307 | clearWebViewProxyFailed | Clear proxy in WebView failed — update Android WebView |
| 9308 | startTunnelPendingInSDK | Pending `startTunnel` call — wait for it to finish |
| 9309 | proxyAuthFailed | Proxy authorization failed |
| 9310 | proxyAuthNotSupportedInAutomaticConfig | Proxy auth not supported in Automatic Configuration mode |
| 9401 | dataParsingError | Data parsing failed at server |
| 9402 | invalidToken | Invalid token sent to server |
| 9403 | badRequest | Server received a bad request |
| 9501 | tunnelError | Error starting tunnel |
| 9502 | tunnelAlreadyRunning | Tunnel already running |
| 9503 | tunnelAuthenticationFailed | Authentication failed due to configuration error |
| 9504 | connectionTerminatedWhileUpgrading | Connection terminated during upgrade to Zero Trust tunnel; existing Prelogin tunnel stopped |
| 9505 | tunnelUpgradeFailed | Upgrade to Zero Trust tunnel failed; Prelogin tunnel remains active |

### API error codes

Errors 2001–2025 relate to authentication and certificate operations at the ZSDK API layer:

| Code | Name | Description |
|---|---|---|
| 2001 | csrSignFailure | CSR signing failed |
| 2002 | invalidTenantName | Invalid tenant name |
| 2003 | noZpaService | No ZPA service registered |
| 2004 | multipleZpaService | Multiple ZPA services registered |
| 2005 | revokeCertFailed | Certificate revocation failed |
| 2006 | tokenConfigNotFound | Token configuration for tenant not found |
| 2007 | jwkParseFailed | JSON Web Key parse failed |
| 2008 | customerKeyNotPresent | Customer key missing |
| 2009 | customerKeyParseFailed | Customer key parse failed |
| 2010 | unsupportedKeyType | Unsupported key type |
| 2011 | failedSignatureValidation | Signature validation failed |
| 2012 | tokenExpired | Access token expired |
| 2013 | tokenValidationFailed | Access token validation failed |
| 2014 | tokenClaimValidationFailed | Token claim validation failed |
| 2015 | missingCertificateIdOauth2Client | `certificate_id` missing from OAuth2 client |
| 2016 | missingPrivateKeyOAuth2Client | Private key missing from OAuth2 client |
| 2017 | failureGeneratingClientAssertion | Client assertion generation failed |
| 2018 | failureGeneratingSamlAssertion | SAML assertion generation failed |
| 2019 | failureSigningSamlAssertion | SAML assertion signing failed |
| 2020 | failureSerializingSamlAssertion | SAML assertion serialization failed |
| 2021 | missingCertificateIdSamlConfig | `certificate_id` missing in SAML config |
| 2022 | unsupportedCustomerTokenType | JWT type unsupported |
| 2023 | hmacSecretFailed | Failed to fetch HMAC secret from ZPA |
| 2024 | hmacValidationFailed | HMAC payload validation failed |
| 2025 | missingSubInAccessToken | `sub` claim missing from access token |

---

## Scope within this skill — what is and isn't covered

ZSDK is **portal-only** from an automation perspective. There is no Terraform provider, Python SDK, or Go SDK for ZSDK in the vendor sources. Questions about Terraform resources or SDK methods for ZSDK configuration cannot be answered from this skill's source material.

ZSDK shares the App Connector concept with ZPA but is administered through a separate portal (`admin.zsdkone.net`) and managed independently. ZSDK App Connectors are not the same as ZPA App Connectors — they are registered against different clouds and cannot be shared between products.

---

## Cross-links

- ZPA App Connectors (conceptually similar, separately managed) — [`../zpa/app-connector.md`](../zpa/app-connector.md)
- ZPA access policy and segment groups (parallel concepts in the ZPA product) — [`../zpa/app-segments.md`](../zpa/app-segments.md), [`../zpa/segment-groups.md`](../zpa/segment-groups.md)
- ZCC forwarding profile (separate — ZCC is an agent product, not an embedded SDK) — [`../zcc/forwarding-profile.md`](../zcc/forwarding-profile.md)
- OneAPI authentication (does not apply to ZSDK) — [`./oneapi.md`](./oneapi.md)
