---
product: zcc
topic: troubleshooting
title: "ZCC Troubleshooting — error codes, common failure modes, and diagnostic workflow"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/legacy-about-error-codes-zcc.md"
  - "vendor/zscaler-help/legacy-api-response-codes-and-error-messages.md"
  - "vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md"
  - "vendor/zscaler-help/configuring-fail-open-settings-zscaler-client-connector.md"
  - "vendor/zscaler-help/about-device-posture-profiles.md"
  - "vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md"
  - "vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md"
  - "vendor/zscaler-help/configuring-end-user-notifications-zscaler-client-connector.md"
  - "vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md"
  - "references/zcc/forwarding-profile.md"
  - "references/zcc/z-tunnel.md"
  - "references/zcc/install-parameters.md"
  - "references/zcc/devices.md"
  - "references/zcc/web-policy.md"
  - "references/zcc/sdk.md"
  - "references/zidentity/step-up-authentication.md"
  - "references/shared/scim-provisioning.md"
author-status: draft
---

# ZCC Troubleshooting — error codes, common failure modes, and diagnostic workflow

## 1. Scope

This document covers:

- Every HTTP error code returned by the Zscaler Client Connector (ZCC) portal API, extracted from the vendor source.
- End-user-visible error states and notifications surfaced by ZCC on device.
- Failure taxonomy grouped by surface area, with root cause and remediation for each code.
- A diagnostic decision tree for the most common ZCC symptom patterns.
- Data-collection procedure for log bundles and OS-level logs.
- Escalation matrix — which errors are user-resolvable, help-desk-resolvable, or require Zscaler Support.
- Version-specific behavior differences called out by vendor documentation.

**What this document does not cover**: ZIA URL-filter block pages, ZPA access-denied policy results, or ZDX diagnostic data — those are evaluated and rendered by the cloud, not by ZCC, and are documented in their respective product references.

---

## 2. Error code table — ZCC portal API (HTTP)

The ZCC portal API (`/zcc/papi/public/v1`) returns standard HTTP status codes. The following table enumerates every code documented in the vendor source.

Source: `vendor/zscaler-help/legacy-about-error-codes-zcc.md`.

| HTTP Code | Surface area | Short message | Root cause | Primary remediation | Escalation criteria |
|---|---|---|---|---|---|
| **200** | API | Successful | Request processed normally. | None. | — |
| **400** | API | Bad Request | Malformed request body, missing required field, or invalid parameter value. | Inspect request payload; check required fields for the endpoint. Cross-reference SDK model for field names and types. | Escalate if 400 persists on a well-formed payload — may indicate API regression. |
| **401** | API / Auth | Unauthorized | Session token absent, expired, or invalid. For legacy ZCC API: `jwtToken` has expired (not refreshed). For OneAPI: OAuth2 access token expired or `zcc.*` scope not granted to the API client. | Re-authenticate. For legacy: confirm token refresh logic in `LegacyZCCClientHelper`. For OneAPI: verify API client has ZCC scope in ZIdentity. | Escalate if token refresh is failing despite valid credentials. |
| **403** | API / Auth | Forbidden | The authenticated caller has insufficient privileges for the requested operation. Causes: (a) API key disabled by service provider; (b) admin role lacks functional scope for this resource; (c) required SKU/subscription absent; (d) write operation attempted during portal maintenance window. | (a/b) Check admin role permissions in ZCC Portal. (c) Confirm tenant SKU includes ZCC API access. (d) Retry after maintenance window. | Escalate to Zscaler Support if subscription is confirmed and 403 persists. |
| **404** | API | Not Found | Resource does not exist at the referenced ID. Device UDID, forwarding profile ID, or web policy ID is wrong, or the object was deleted. | Verify object IDs via a `list_*` call before operating on a specific ID. Check for orphaned references (forwarding profile deleted but still referenced by a web policy). | Escalate if 404 is returned on an ID just created (timing or replication lag). |
| **415** | API | Unsupported Media Type | Request body sent without `Content-Type: application/json` header, or with a conflicting media type. | Add `Content-Type: application/json` to the request header. | — |
| **429** | API / Rate limit | Too Many Requests | Rate limit exceeded. General limit: 100 API calls per hour per IP address per organization. Special limit for `/downloadDevices`, `/downloadServiceStatus`, `/downloadDisableReasons`: 3 calls per day. | Back off using exponential retry. Inspect `X-Rate-Limit-Retry-After-Seconds` response header for the required wait interval. `X-Rate-Limit-Remaining` reports how many calls remain in the current window. The Python `LegacyZCCClientHelper` retries automatically on 429 (up to 3 times) using the retry-after header; callers using direct HTTP must implement this themselves. | Escalate if rate limits are hit consistently despite correct back-off — may indicate a polling loop consuming quota unnecessarily. |
| **500** | API | Not Implemented | Unexpected server error or unimplemented endpoint variant. | Retry once after a brief delay. If persistent, capture the request/response for Zscaler Support. | Any consistent 500 warrants a Zscaler Support ticket with request details. |

### Additional HTTP codes documented in the legacy ZIA/ZPA API reference

The ZCC portal API shares HTTP semantics with the broader Zscaler API platform. The following codes are documented in `vendor/zscaler-help/legacy-api-response-codes-and-error-messages.md` and apply when the ZCC API behaves as part of the broader platform:

| HTTP Code | Short message | Notes |
|---|---|---|
| **204** | No content | Successful operation with no response body (typically DELETE). |
| **405** | Method not allowed | HTTP method (GET/POST/PUT/DELETE) not supported on this endpoint path. |
| **409** | Conflict | Edit conflict — two admins saving the same resource simultaneously. Retry after a short delay. |
| **503** | Service unavailable | Portal temporarily unavailable (maintenance or overload). Retry with back-off. |

---

## 3. Error codes by surface area

### 3.1 Authentication / SSO errors

These manifest as ZCC being stuck on "Signing In", an authentication loop, or an immediate error after IdP redirect.

| Code / State | Trigger | Root cause | Remediation |
|---|---|---|---|
| HTTP 401 (API) | API call with expired or absent token | Session not established or token not refreshed | Re-authenticate; verify token refresh logic |
| HTTP 403 (API) | API call by admin with insufficient role | Role lacks ZCC API scope | Grant appropriate admin role in ZCC Portal |
| HTTP 403 (API) | API call during portal maintenance | Admin portal in read-only maintenance mode | Retry after maintenance window |
| "Stuck on Signing In" (end-user UI) | ZCC cannot reach IdP or SAML flow fails | (1) `USERDOMAIN` misconfigured; (2) IdP redirected to an unreachable URL; (3) Strict Enforcement (`STRICTENFORCEMENT=1`) blocks the IdP before policy is downloaded; (4) SAML `nameID` / SCIM `userName` mismatch | (1) Verify `USERDOMAIN` install parameter matches SAML `nameID` domain; (2) Confirm IdP URL reachable; (3) Verify `policyToken` App Profile PAC includes bypass for IdP; (4) Align SCIM `userName` with SAML `nameID` |
| Step-up auth not triggered (UI silent) | User hits Conditional rule via non-ZCC forwarding path | Step-up requires ZCC tunnel; GRE/IPSec/PAC-only users receive no prompt | Ensure user is forwarding via ZCC tunnel; SAML IdPs do not support step-up (OIDC required) |
| ZPA reauth notification loop | ZPA session expired; ZCC prompts repeatedly | `reauth_period` on Web Policy set too short, or ZPA ticket renewal failing | Adjust `reauth_period`; confirm ZPA IdP reachable; check ZPA reauthentication notification interval (2–1440 min, configurable per App Profile) |
| Okta ZPA initial SCIM sync — no users visible | SCIM enabled but `PROVISION_OUT_OF_SYNC_USERS` not set in Okta | Okta does not sync users before SCIM is enabled | Enable `PROVISION_OUT_OF_SYNC_USERS` in Okta; unassign and reassign Zscaler Private Access in Okta |

### 3.2 Tunnel establishment errors

These manifest as ZCC showing "Connected" but with a degraded or non-functional tunnel, or falling back silently.

| Code / State | Trigger | Root cause | Remediation |
|---|---|---|---|
| Z-Tunnel 2.0 falls back to 1.0 silently | DTLS handshake fails or session splits across Service Edges | NAT is not single-IP (multiple egress IPs per device); Z-Tunnel 2.0 requires single-IP NAT | Confirm NAT architecture ensures all connections from one device egress through the same public IP; inspect `trusted_egress_ips` in forwarding profile against actual egress IPs in Service Edge logs |
| Tunnel establishment timeout → fail-open | ZIA Public Service Edges unreachable after `tunnelFailureRetryCount` retries | Firewall blocking outbound DTLS (UDP 443) or TLS (TCP 443) to PSE; captive portal intercepting; network reachability issue | Check firewall rules for outbound UDP 443 and TCP 443; check fail-open policy `tunnelFailureRetryCount` setting; check captive portal state |
| Tunnel mid-session failure | Z-Tunnel 2.0 session drops after establishment | Network path instability; PSE failover; MTU issue | Confirm `allowTLSFallback` in forwarding profile; check `optimiseForUnstableConnections` flag; inspect MTU (`mtuForZadapter`) |
| "ZCC connected but no traffic" | Tunnel shows as up but traffic is not passing | (1) Fail-open path activated and traffic going direct; (2) Forwarding profile `actionType` set to `NONE` on active network branch; (3) `evaluate_trusted_network` is false and TRUSTED action is `NONE` | Check active forwarding profile action for the current network type; verify `enableFailOpen` state; check fail-open policy |
| GRE + Z-Tunnel 2.0 performance degradation | Double-encapsulation overhead | Z-Tunnel 2.0 traffic routed through existing GRE tunnel | Configure forwarding profile to use Z-Tunnel 1.0 on trusted (LAN) networks, or add policy-based route to exclude Z-Tunnel 2.0 traffic from GRE |
| Machine tunnel unavailable at Windows login | ZPA resources unreachable pre-login | `LWFBOOTSTART=0` (LWF driver loads after user session) | Set `LWFBOOTSTART=1` at install time; requires reinstall |

### 3.3 Posture-check errors

Posture failures result in ZPA access denied or ZIA posture trust-level downgrade. ZCC evaluates posture on the endpoint and reports results to ZIA/ZPA.

| Code / State | Trigger | Root cause | Remediation |
|---|---|---|---|
| Posture check fails — ZPA access denied | Posture profile criteria not met | (1) Required software not installed or version below threshold; (2) Firewall or disk encryption not enabled; (3) Domain join state incorrect; (4) EDR agent not running or score below threshold | Identify failing criterion from ZPA access logs; remediate on device; ZCC re-evaluates posture every 15 minutes by default |
| Posture result stale after remediation | Device fixed posture issue but access still denied | ZCC has not re-evaluated since remediation; default cadence is 15 minutes | Trigger a network event (disconnect/reconnect, sleep/wake) to force re-evaluation; on Windows 4.4+, cadence is configurable |
| Posture check not triggering | ZCC restarts, reboots, network changes — posture re-evaluates; but no change event occurred | Posture evaluates on: ZCC restart, device reboot, network join, wake from hibernation, domain-join state change, Wi-Fi network change | Force a qualifying network change to trigger immediate re-evaluation |
| CrowdStrike ZTA score below threshold | CrowdStrike ZTA API returns low score | Device does not meet CrowdStrike sensor, OS, or setting score requirements | Remediate CrowdStrike posture on device; score typically updates within minutes in CrowdStrike; ZCC will pick up new score on next evaluation |

### 3.4 Trusted Network detection errors

Trusted network misclassification causes the wrong forwarding profile action branch to activate.

| Code / State | Trigger | Root cause | Remediation |
|---|---|---|---|
| User treated as untrusted on corporate LAN | Trusted network criteria not matching | (1) `evaluate_trusted_network = false` on active forwarding profile; (2) Inline criteria (DNS servers, subnets, gateways) do not match actual network; (3) `condition_type` set to AND — all criteria required but only some match | Check `evaluateTrustedNetwork` flag; compare `dnsServers`, `trustedSubnets`, `trustedGateways` against device's actual network config; review `conditionType` (AND vs OR) |
| User treated as trusted on home Wi-Fi | Trusted network criteria too broad | `trustedSubnets` or `trustedDhcpServers` includes common consumer ranges (e.g., `192.168.1.0/24`) | Audit trusted criteria for specificity; remove or narrow overlapping ranges |
| ZPA TRUSTED_NETWORK policy rule never fires | ZCC not sending trusted network result to ZPA | `sendTrustedNetworkResultToZpa = false` in forwarding profile ZPA actions, or `evaluateTrustedNetwork = false` at the profile level | Enable `sendTrustedNetworkResultToZpa`; confirm `evaluateTrustedNetwork` is true |
| App profile policy update not reflected on device | Policy change deployed in admin console but device still uses old settings | ZCC downloads app profile updates only on logout/login or device restart — no continuous polling | Inform users to log out and back in, or restart; policy propagation is not real-time for currently-connected devices |

### 3.5 Certificate / TLS errors

Certificate errors appear in the user's browser as untrusted certificate warnings on inspected HTTPS traffic.

| Code / State | Trigger | Root cause | Remediation |
|---|---|---|---|
| Browser cert error on inspected HTTPS | Zscaler root CA not installed on device | `install_ssl_certs = false` in per-platform Web Policy sub-policy, or automatic install failed | Enable `install_ssl_certs` in the applicable per-platform App Profile policy; for manual install, deploy Zscaler root CA via MDM |
| macOS users get cert errors, Windows users do not | Per-platform `install_ssl_certs` inconsistency | `macPolicy.install_ssl_certs` is false while `windowsPolicy.install_ssl_certs` is true | Check per-platform sub-policies independently — a `None` sub-policy means "no policy defined for this platform," not "inherit defaults" |
| DTLS handshake failure | ZCC cannot negotiate DTLS for Z-Tunnel 2.0 | Firewall blocking UDP 443; middlebox stripping DTLS; certificate validation failure at the PSE | Enable `allowTLSFallback` in forwarding profile to fall back to TLS; check firewall for UDP 443 to Zscaler PSE IPs; confirm no TLS interception appliance decrypting the ZCC-to-PSE connection |
| Step-up `acr` mismatch | OIDC token returned with `acr` value that does not match ZIdentity authentication level mapping | External IdP team changed OIDC configuration without coordinating with ZIdentity admin | Inspect actual `acr` claim in OIDC token; compare against ZIdentity authentication level mappings; realign `acr` values |

### 3.6 PAC / forwarding errors

PAC errors cause incorrect traffic routing — bypassed traffic or mis-routed requests.

| Code / State | Trigger | Root cause | Remediation |
|---|---|---|---|
| PAC not applying | PAC URL configured in Web Policy but traffic not matching PAC rules | (1) `allow_unreachable_pac = true` and PAC URL is unreachable — traffic passes direct; (2) Z-Tunnel 2.0 is active — PAC-based network bypasses do not apply to 2.0 traffic; (3) App profile update not yet downloaded | Confirm PAC URL is reachable; for Z-Tunnel 2.0 bypasses, use VPN Gateway Bypasses or Destination Exclusions on the App Profile instead of PAC |
| Tunnel 2.0 bypass not taking effect | Network bypass added to PAC file on a Z-Tunnel 2.0 profile | Z-Tunnel 2.0 ignores PAC-based network bypasses | Move bypasses to App Profile Destination Exclusions or VPN Gateway Bypasses |
| Traffic bypasses ZIA unexpectedly | Forwarding profile TRUSTED branch action is `NONE` | `actionType = NONE` on TRUSTED branch sends Internet traffic direct (no ZIA) when on a trusted network | Review TRUSTED branch action; change to TUNNEL or PAC if ZIA inspection is required on trusted networks |
| Captive portal blocks user | Captive portal grace period expired before user completed portal auth | `captivePortalWebSecDisableMinutes` too short; user took longer than the grace period to complete portal auth | Increase grace period (1–60 minutes; set as low as operationally feasible); confirm `enableCaptivePortalDetection = true` in App Fail-Open settings |

### 3.7 Install / system-extension errors

Install errors appear during ZCC deployment or on first launch.

| Code / State | Trigger | Root cause | Remediation |
|---|---|---|---|
| Strict Enforcement blocks device's own auth path | `STRICTENFORCEMENT=1` + misconfigured `policyToken` | Policy token invalid, expired, or referenced App Profile has no PAC bypass for the IdP | Reinstall with corrected `POLICYTOKEN`; validate token in test environment before fleet rollout |
| `STRICTENFORCEMENT` has no effect | Forwarding profile action is PAC or Direct, not Tunnel | Strict Enforcement only applies when action is Tunnel or Tunnel with Local Proxy | Change forwarding profile action to Tunnel, or document that strict enforcement is intentionally limited |
| iOS strict enforcement blocks MDM access | `strictEnforcement=1` without `excludeList` | MDM server and auth endpoints unreachable because all traffic is blocked pre-enrollment | Add MDM server domain and ZPA auth endpoint (`authsp.prod.zpath.net`) to `excludeList` |
| Android auto-enroll fails silently | `autoEnrollWithMDM=1` set without all required companion parameters | `deviceToken`, `cloudName`, and `userDomain` must all be present when `autoEnrollWithMDM` is non-zero | Ensure all four parameters (`autoEnrollWithMDM`, `deviceToken`, `cloudName`, `userDomain`) are set together |
| LWF driver behavior overrides admin console | `USELWFDRIVER=1` set at install time | MSI parameter `USELWFDRIVER` forces the packet-filter driver regardless of Tunnel Driver Type in the forwarding profile; admin console change is silently ignored | Confirm `USELWFDRIVER` value at install; reversing requires reinstall |
| SE Fail Close config not loading | `IMPORTSEFAILCLOSECONFIG` set without companion parameter | Both `IMPORTSEFAILCLOSECONFIG` and `SEFAILCLOSECONFIGTHUMBPRINT` must be present; neither works alone | Provide both parameters together; Windows ZCC 4.6+ only |

### 3.8 Network reachability errors

These appear as ZCC showing degraded state or as user-reported "ZCC says connected but sites are unreachable."

| Code / State | Trigger | Root cause | Remediation |
|---|---|---|---|
| HTTP 429 (API) — rate limit | API polling loop consuming ZCC portal API quota | 100 calls/hour/IP limit exceeded; typically a misconfigured automation | Implement exponential back-off; use `X-Rate-Limit-Retry-After-Seconds` header; reduce polling frequency |
| HTTP 429 (API) — CSV download limit | More than 3 `/downloadDevices` or `/downloadServiceStatus` calls per day | 3-call/day per-IP rate limit on those endpoints | Spread downloads across days; cache results |
| ZIA Service Edge unreachable | All PSEs for the user's region unreachable | Network path issue, firewall blocking PSE IPs, or PSE maintenance | Check fail-open policy (`enableFailOpen`); verify outbound connectivity to PSE IPs; confirm `tunnelFailureRetryCount` is set appropriately |
| Push MFA (Duo/Authenticator) works on cellular, fails on corporate Wi-Fi | APNs (iOS) or FCM (Android) traffic tunneled into ZCC | Z-Tunnel 2.0 carries all protocols; APNs requires direct persistent connection to Apple servers (proxy-incompatible per Apple documentation) | Add Destination Exclusions: `17.0.0.0/8` TCP 443/5223 for APNs (iOS); `fcm.googleapis.com` TCP 443 for FCM (Android) |
| IPv6-only application fails on ZCC | ZCC dropping IPv6 traffic | `dropIpv6Traffic`, `dropIpv6TrafficInIpv6Network`, or `dropIpv6IncludeTrafficInT2` flags active on forwarding profile | Inspect these flags on the active forwarding profile; defaults may silently drop IPv6 on some configurations |

---

## 4. Diagnostic decision tree

### 4.1 "ZCC shows Connected but no traffic is flowing"

```
Is the tunnel state actually "Connected"?
  Yes → Check forwarding profile action for the current network type:
           Is the TRUSTED branch action set to NONE (bypass)?
             Yes → User is on a "trusted" network with ZIA bypassed by design. Check if
                   trusted-network criteria are matching incorrectly (see §3.4).
             No  → Is fail-open active? (enableFailOpen = true + cloud unreachable)
                     Yes → All traffic going direct. Check PSE reachability; check
                           tunnelFailureRetryCount.
                     No  → Check local firewall for UDP 443 (DTLS) to PSE IPs. Enable
                           TLS fallback (allowTLSFallback). Capture ZCC debug log.
  No  → ZCC is in a degraded state. Proceed to §4.2 (stuck on Signing In) or
         §4.3 (tunnel up but blocked) based on displayed status.
```

### 4.2 "ZCC is stuck on Signing In"

```
Can the device reach the IdP login URL in a browser (with ZCC disabled)?
  No  → Network connectivity issue before ZCC. Resolve network path first.
  Yes → Is STRICTENFORCEMENT enabled on this install?
          Yes → Verify policyToken is valid and referenced App Profile's PAC includes
                a bypass for the IdP URL. Invalid token requires reinstall.
          No  → Check USERDOMAIN install parameter — must match SAML nameID domain.
               Does the SAML assertion contain a valid nameID?
                 Yes → Check SCIM: is the user provisioned in the ZCC tenant?
                        (SCIM userName must match SAML nameID for ZPA.)
                 No  → IdP SAML configuration issue. Check attribute mapping in IdP.
```

### 4.3 "Tunnel is up but every URL shows a block page"

```
Is the block page a Zscaler ZIA block page (Zscaler branding)?
  Yes → The ZIA URL filter is blocking. This is not a ZCC error — diagnose in ZIA.
         Check URL category, URL filter rule order, and user/group membership in ZIA.
  No  → Is it a certificate error page ("Your connection is not private")?
          Yes → Zscaler root CA not installed. Check install_ssl_certs in App Profile
                per-platform sub-policy (§3.5). Deploy CA via MDM if needed.
          No  → Is it the captive portal detection page?
                  Yes → Captive portal active. ZCC will re-enable after grace period.
                        Adjust captivePortalWebSecDisableMinutes if too short.
                  No  → Capture ZCC debug log and review active forwarding profile
                         action. Check if a posture failure is gating ZPA access (§3.3).
```

### 4.4 "PAC is not applying"

```
What tunnel mode is active on this device?
  Z-Tunnel 2.0 → PAC-based network bypasses do not apply to 2.0 traffic.
                  Move bypasses to App Profile Destination Exclusions or VPN Gateway
                  Bypasses. See references/zcc/z-tunnel.md §Bypass semantics.
  Z-Tunnel 1.0 / PAC mode → Is the PAC URL reachable from the device?
                               No  → allowUnreachablePac = true allows direct access
                                     when PAC is down. Check network path to PAC host.
                               Yes → Has the app profile been updated and downloaded?
                                      (Changes only propagate on logout/login or restart.)
                                     Check the active profile via devices.policy_name.
                                     Check PAC syntax — test via PAC evaluator tool.
```

---

## 5. Diagnostic data collection

### 5.1 ZCC log bundle (all platforms)

The primary support artifact is the encrypted log bundle sent via "Report an Issue" within ZCC.

**User-initiated (preferred)**:

1. In ZCC, open the "More" menu (system tray icon on Windows/macOS, or hamburger menu on mobile).
2. Select "Report an Issue."
3. Fill in the description and submit. An email with encrypted logs attached is sent to the admin email configured in App Supportability settings.
4. If "Enable End User Ticket Submission to Zscaler" is enabled, a ticket is automatically opened with Zscaler Support.

Only Zscaler can decrypt logs submitted through this path. Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

**Admin-initiated log fetch** (Client Connector Portal):

1. In the ZCC Portal, navigate to Enrolled Devices.
2. Open the Device Details tab for the target device.
3. Click "Fetch Logs."

This pulls a log bundle from the enrolled device directly into the portal. Source: `vendor/zscaler-help/configuring-user-access-support-options-zscaler-client-connector.md`.

**Log mode levels** (set per App Profile, or changed by user if logging controls are not hidden):

| Level | What is captured |
|---|---|
| Error | Application errors with functional impact only |
| Warn | Potential issues + Error conditions |
| Info | General activity + Warn conditions |
| Debug | All activity useful for Zscaler Support debugging + Info conditions |
| Verbose | All of Debug + events triggered by Firebase Push Notification or Mobile Manager flags (Android 1.5+ only) |

For active troubleshooting, set log mode to Debug before reproducing the issue. Source: `vendor/zscaler-help/configuring-user-access-logging-controls-zscaler-client-connector.md`.

### 5.2 Windows — OS-level logs

- **Windows Event Log**: Application and System logs contain ZCC service start/stop, driver events, and enrollment status. Filter by source "Zscaler" or "ZscalerApp."
- **ZCC log file location**: `%ProgramData%\Zscaler\logs\` — contains `ZCC.log` and rotation. ZIP the entire directory for support.
- **LWF driver events**: Device Manager → View → Show Hidden Devices → Network Adapters → "Zscaler Network Adapter." Driver errors surface in Device Manager and System event log.
- **DTLS/TLS packet capture**: if a tunnel-level issue is suspected, a Wireshark capture of outbound UDP 443 to PSE IPs can confirm whether DTLS handshake is occurring or being dropped.

### 5.3 macOS — OS-level logs

- **Unified Log** (macOS 10.12+): `log stream --predicate 'subsystem == "com.zscaler"'` in Terminal captures real-time ZCC log output to the macOS Unified Logging subsystem.
- **Log export**: `log collect --predicate 'subsystem == "com.zscaler"' --output ~/Desktop/zcc_logs.logarchive` for a time-bounded archive.
- **System Extensions**: ZCC uses a Network Extension (macOS 11+). Check System Settings → Privacy & Security → Network Extensions to confirm ZCC extension is enabled and not blocked by MDM or Gatekeeper.
- **ZCC log file location**: `/Library/Application Support/Zscaler/logs/` — ZIP directory for support.

### 5.4 iOS

- **ZCC in-app logs**: "Report an Issue" path as in §5.1.
- **Apple Console** (via Xcode Devices window or `cfgutil`): filter by process name "ZscalerApp" for real-time log streaming. Requires developer tools.
- **MDM device logs**: Intune, Jamf, or AirWatch device-level log collection will capture some ZCC events; check platform-specific MDM docs.

### 5.5 Android

- **Android logcat**: `adb logcat -s ZscalerApp:V` (requires USB debugging or MDM-allowed adb). Captures ZCC events tagged "ZscalerApp" at Verbose level.
- **ZCC in-app**: "Report an Issue" from ZCC menu (if enabled by admin).
- **Firebase-triggered Verbose logging**: Verbose log mode (Android 1.5+) enables extra output triggered by Firebase push events — useful for push-MFA or enrollment flow issues.

### 5.6 What to include with a Zscaler Support ticket

| Item | Why needed |
|---|---|
| ZCC version (exact, including build number) | Narrows version-specific behavior |
| OS version and edition | Platform-specific codepath |
| Encrypted log bundle from "Report an Issue" | Primary diagnostic source; only Zscaler can decrypt |
| Active forwarding profile name and ID | Identifies tunnel/bypass configuration |
| Active Web Policy / App Profile name | Identifies PAC, SSL cert install, fail-open settings |
| Timestamps of symptom occurrence (with timezone) | Correlates to PSE logs on Zscaler side |
| Steps to reproduce | Consistent reproduction significantly reduces TTR |
| Screenshot of ZCC status screen | Shows displayed status at time of failure |

---

## 6. Escalation matrix

| Error / symptom | User-resolvable | Help-desk (L2) | Zscaler Support |
|---|---|---|---|
| Captive portal — waiting for grace period | Yes — complete portal auth before grace period expires | If grace period is too short: adjust `captivePortalWebSecDisableMinutes` | If captive portal detection itself is failing |
| "Report an Issue" submission | Yes — user submits form | Help-desk receives encrypted log bundle | Escalate to Zscaler if ticket auto-submission is enabled and issue persists |
| Cert error — Zscaler root CA not trusted | User can manually trust CA (emergency only) | Enable `install_ssl_certs` in App Profile; push via MDM | If CA push fails across fleet |
| Fail-open (traffic going direct) | No — user cannot change fail-open policy | Check fail-open policy settings in ZCC Portal; verify PSE reachability | If PSE is confirmed unreachable from Zscaler side |
| Push MFA fails on corporate Wi-Fi | No | Add APNs/FCM Destination Exclusions in App Profile | If exclusion addition does not resolve |
| HTTP 401 / 403 on API call | No | Check admin role and token scope | If scope is correct and 403 persists |
| HTTP 429 rate limit | Caller-resolvable — implement back-off | Review automation frequency | — |
| HTTP 500 persistent | No | Capture request/response | Always escalate persistent 500s |
| Device stuck in duplicate fingerprint state | No | `force_remove_devices` on duplicate UDID via ZCC Portal API | If force-remove does not clear state |
| Z-Tunnel 2.0 falling back to 1.0 (NAT issue) | No | Confirm NAT architecture with network team | If single-IP NAT is confirmed and fallback persists |
| Posture check failing — software not installed | User — install required software | Help-desk — verify software deployment via MDM | If posture evaluation not updating after software install |
| Strict Enforcement blocking device | No | Reinstall ZCC with corrected `POLICYTOKEN` | If token is correct and enforcement persists |
| SCIM / auth failure at ZPA first login (Okta) | No | Enable `PROVISION_OUT_OF_SYNC_USERS` in Okta; re-sync | If sync does not populate users |

---

## 7. Known regressions and version-specific behavior

The following version-specific behavior differences are documented in vendor sources.

| Platform | Version | Behavior change | Source |
|---|---|---|---|
| Windows | 4.4+ | Device posture evaluation cadence is configurable (default: 15 min); earlier versions have a fixed 15-minute cadence | `vendor/zscaler-help/about-device-posture-profiles.md` |
| Windows | 4.5+ | Captive portal detection moved from tenant-global App Fail-Open to per-App-Profile configuration; global setting still applies to older ZCC versions | `vendor/zscaler-help/configuring-fail-open-settings-zscaler-client-connector.md` |
| Windows | 4.5+ | Additional fail-close enforcement options exposed for STRICT ENFORCEMENT mode | `references/zcc/forwarding-profile.md` |
| Windows | 4.6+ | SE Fail Close feature available: `IMPORTSEFAILCLOSECONFIG` + `SEFAILCLOSECONFIGTHUMBPRINT` install parameters; fail-open settings configurable per App Profile (take precedence over global) | `references/zcc/install-parameters.md`; `vendor/zscaler-help/configuring-fail-open-settings-zscaler-client-connector.md` |
| Windows | 4.6+ | Business Continuity Planning (BCP) parameters available: `BCPCONFIGFILEPATH` + `BCPMAPUBKEYHASH` for ZPA BCP | `references/zcc/install-parameters.md` |
| Windows | 4.2.1+ | Silent uninstall (`UNINSTALLPASSWORDCMDLINE`) and silent revert (`REVERTPASSWORDCMDLINE`) support added | `references/zcc/install-parameters.md` |
| macOS | 4.6+ | Captive portal detection improvements; per-App-Profile captive portal overrides | `references/zcc/forwarding-profile.md` |
| macOS | 4.8+ | Additional unified-tunnel handling; updated Z-Tunnel 2.0 fallback semantics | `references/zcc/forwarding-profile.md` |
| iOS | Any | One-VPN-at-a-time enforced by Apple; APNs requires direct persistent connection — ZCC VPN profile must exclude `17.0.0.0/8` TCP 443/5223 for push notifications to work | `references/zcc/z-tunnel.md` |
| Android | 3.7+ | `externalDeviceId` parameter supported; `allowRunningOnRootedDevice` and `allowRunningOnEmulator` parameters available | `references/zcc/install-parameters.md` |
| Windows (ZCC 3.7 and earlier) | ≤3.7 | Z-Tunnel 2.0 domain-based bypasses require dual PAC (forwarding profile PAC + app profile PAC); 3.8+ uses forwarding-profile options instead | `references/zcc/z-tunnel.md` |
| Windows (ZCC 3.8+) | 3.8+ | "Redirect Web Traffic to ZCC Listening Proxy" and "Use Z-Tunnel 2.0 for Proxied Web Traffic" options available in forwarding profile; change bypass semantics for web traffic on Z-Tunnel 2.0 | `references/zcc/z-tunnel.md` |

---

## 8. Cross-links

- Forwarding profile — tunnel selection, fail-open policy, trusted-network evaluation: [`./forwarding-profile.md`](./forwarding-profile.md)
- Z-Tunnel 1.0 vs 2.0 — bypass architecture, fallback behavior, migration: [`./z-tunnel.md`](./z-tunnel.md)
- Install parameters — STRICTENFORCEMENT, POLICYTOKEN, LWFBOOTSTART, BCP, FIPS: [`./install-parameters.md`](./install-parameters.md)
- ZIdentity step-up authentication — OIDC requirement, authentication levels, acr mapping: [`../zidentity/step-up-authentication.md`](../zidentity/step-up-authentication.md)
- Device posture — check types, evaluation cadence, per-OS specifics: [`./device-posture.md`](./device-posture.md)
- Web Policy / App Profile — PAC URL, forwarding profile assignment, per-platform cert install: [`./web-policy.md`](./web-policy.md)
- Devices — UDID, device states, force-remove, duplicate fingerprints: [`./devices.md`](./devices.md)
- Trusted networks — criteria types, AND/OR evaluation: [`./trusted-networks.md`](./trusted-networks.md)
- SCIM provisioning — userName/nameID alignment, Okta first-sync: [`../shared/scim-provisioning.md`](../shared/scim-provisioning.md)
