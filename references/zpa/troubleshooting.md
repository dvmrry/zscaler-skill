---
product: zpa
topic: "zpa-troubleshooting"
title: "ZPA access troubleshooting — verification workflow and signal sources"
content-type: reasoning
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-private-access-architecture.md"
  - "vendor/zscaler-help/about-app-connectors.md"
  - "vendor/zscaler-help/zpa-about-connector-groups.md"
  - "vendor/zscaler-help/about-log-streaming-service.md"
  - "vendor/zscaler-help/about-scim-zpa.md"
  - "vendor/zscaler-help/zsdk-about-segment-groups.md"
  - "vendor/zscaler-help/about-browser-access.md"
  - "vendor/zscaler-help/using-wildcard-certificates-browser-access-applications.md"
  - "vendor/zscaler-help/understanding-connector-software-updates.md"
  - "vendor/zscaler-help/about-z-tunnel-1.0-z-tunnel-2.0.md"
  - "vendor/zscaler-help/verifying-access-to-applications.md"
  - "vendor/zscaler-help/Understanding_User_Activity_Log_Fields.txt"
  - "vendor/zscaler-help/Understanding_User_Status_Log_Fields.txt"
  - "vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.txt"
  - "vendor/zscaler-help/Understanding_the_Log_Stream_Content_Format.txt"
  - "references/zpa/policy-precedence.md"
  - "references/zpa/app-segments.md"
  - "references/zpa/app-connector.md"
  - "references/zpa/posture-profiles.md"
  - "references/zpa/logs/access-log-schema.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/app_connectors.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/application_segment.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/posture_profiles.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/applicationsegment/zpa_application_segment.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/policysetcontrollerv2/policysetcontrollerv2.go"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/postureprofile/zpa_posture_profile.go"
author-status: draft
---

# ZPA access troubleshooting — verification workflow and signal sources

Operator-oriented reference for diagnosing "user cannot reach application" reports in ZPA. The document covers the decision tree from initial symptom to signal sources, specific verification steps for each layer of the access path, common failure modes, and read-side API/SDK calls that automation can use to triage programmatically.

This document does not cover ZIA-side issues except where ZIA cross-product integrations (Source IP Anchoring, ZIA-ZPA SSL inspection) interact with the ZPA path.

---

## 1. Decision tree — symptom to first signal

### Symptom: "Can't reach app at all"

1. Confirm ZCC is enrolled and the Z-Tunnel is established. ZCC must show the Private Access state as active, not disconnected or in bypass.
2. If ZCC is connected, determine whether the domain name is even intercepted by ZCC. ZCC intercepts traffic only for domains and ports that appear in a configured application segment. If the destination is not in any segment, ZCC sends traffic directly, and ZPA is never in the path. Check segment domain list first.
3. If the domain is in a segment but the request still fails, pull the LSS User Activity log for that user and destination to identify the `ConnectionStatus` and `Policy` fields. A `Close` or absent record combined with a policy block name is the typical signal. If no LSS record exists at all, the request was dropped client-side before reaching the ZPA Service Edge.
4. If an LSS record exists with `ConnectionStatus = Close`, look at the `InternalReason` field and `Policy` field together:
   - A named block rule in `Policy` → access policy denied the request. Proceed to policy verification (section 4).
   - Empty `Policy` field or a reason pointing to connector or server → the policy allowed but the path from the App Connector to the application server failed. Proceed to connector and server group checks.
5. If there is no LSS record, the request never reached the ZPA Service Edge. Check:
   - Segment-level `bypass_type`. If any segment covering the FQDN has `bypass_type = Always`, ZCC sends traffic directly and ZPA records nothing.
   - Port mismatch. If the destination port is not in the matched segment's `tcp_port_ranges`, ZCC drops the packet client-side and ZPA never sees it. See [`./app-segments.md`](./app-segments.md) for the specificity-wins carve-out rule.

### Symptom: "Intermittent failures"

1. Corroborate with LSS User Activity stream: look for sessions with `ConnectionStatus = Close` interleaved with `Open` or `Active` sessions for the same `Host`.
2. Check App Connector status in the ZPA console: a connector cycling between connected and disconnected during the failure window is a strong indicator. The `ConnectorZEN` field in LSS shows which Public Service Edge the connector was using at connection time; variance here is expected but a single connector going absent explains correlation.
3. Check App Connector software update schedule. A 4-hour update window restarts connectors one at a time. Intermittent failures during an update window that resolve on retry are normal if the group has more than one connector for failover.
4. Check whether `select_connector_close_to_app = false` (round-robin) or proximity-based connector selection is active. A connector geographically distant from the app server has higher `ConnectionSetupTime`; LSS timing fields expose this.
5. If intermittency correlates with device posture re-evaluation timing (default 15-minute cadence on ZCC), consider that a posture check result may have expired and a timeout or forwarding policy with a posture condition is periodically blocking the session.

### Symptom: "App is slow"

1. Use LSS timing fields on User Activity records: `AppLearnTime`, `CAProcessingTime`, `ConnectorZENSetupTime`, `ConnectionSetupTime`, `ServerSetupTime`. Identify which phase is anomalously high.
2. High `AppLearnTime`: the App Connectors have not recently received a reachability probe result for the application. Check `health_reporting` on the segment — if `NONE`, connectors only learn at access time. Switch to `ON_ACCESS` or `CONTINUOUS` for production segments.
3. High `ConnectionSetupTime`: the App Connector is taking a long time to establish its connection to the application server. Likely network latency or the application server is under load. Validate that the App Connector group is associated with connectors close to the application servers.
4. High `ConnectorZENSetupTime`: latency between the App Connector and the ZPA Service Edge. May indicate the App Connector is connecting to a Service Edge that is geographically distant. Check the `ConnectorZEN` field and compare to the connector's expected closest Service Edge.
5. High `CAProcessingTime`: Central Authority processing time. Intermittently elevated CA times are a ZPA platform issue; sustained elevation should be escalated to Zscaler Support.
6. Byte counter fields (`ZENBytesRxClient`, `ZENBytesTxConnector`, etc.) in the LSS User Activity log measure incremental bytes per log interval. Sustained low values combined with high `ConnectionSetupTime` indicate a slow or stalled application-side connection rather than a ZPA policy or routing issue.

### Symptom: "Authentication fails / step-up prompt loops"

1. Confirm the user's IdP SAML assertion is reaching ZPA correctly. ZCC prompts the user through the configured IdP as part of enrollment. If the SAML assertion is stale or the IdP session expired, ZCC re-authenticates.
2. If the user receives a step-up prompt (ZCC version 4.6+ on Windows, 4.7+ on macOS), an Access Policy rule with `action = Conditional Access` matched. This requires a ZIdentity subscription and OIDC IdP. Check whether the user is expected to satisfy step-up or whether the rule should not be matching. See [`./policy-precedence.md § Rule actions`](./policy-precedence.md).
3. If the user is blocked by a SCIM group policy and was recently added to the group in the IdP, allow up to 48 hours for the initial SCIM sync to propagate. Per the ZPA SCIM documentation, policy evaluation against users not yet in the SCIM database results in a block by default. The policy-precedence edge case on SCIM timing is documented in [`./policy-precedence.md § Edge cases`](./policy-precedence.md).
4. If the IdP domain overlaps with an application domain configured in an application segment, ZCC may intercept IdP traffic and cause authentication loops. The segment must be bypassed for the IdP domain, or the IdP's Authentication Timeout in the timeout policy must be set to `Never`. This is documented as an edge case in [`./app-segments.md § Edge cases`](./app-segments.md).

---

## 2. Signal sources

### 2.1 ZPA admin console

| Location | Signal |
|---|---|
| Infrastructure > Private Access > Component > App Connectors | Per-connector connection status (Connected / Disconnected), software version, update status (Scheduled / Success / Failure), last connection timestamp, Public Service Edge the connector reports to |
| Infrastructure > Private Access > Component > App Connector Groups | Group-level enabled status, connector count, next scheduled update window |
| Resource Management > Application Management > Application Segments | Segment enabled/disabled, domain list, port ranges, segment group, server group links, `bypass_type`, `health_reporting`, `match_style` |
| Resource Management > Application Management > Segment Groups | Which segments belong to which group; incomplete-configuration icon appears if segment is missing required config |
| Policies > Access Control > Access Policy | Policy rule list in evaluation order; `Policy` field in LSS log maps to a rule name here |
| Logs > Log Streaming > Log Receivers | LSS receiver configuration; check that the receiver is active and the log type includes User Activity |

The admin console retains User Activity, User Status, and App Connector log information for a rolling 14-day period. For logs beyond 14 days, LSS output to a SIEM is required.

### 2.2 ZCC client — signals visible to the end user or local admin

- **Z-Tunnel state**: ZCC must be in an active tunnel state for Private Access traffic interception. A user-accessible tunnel state indicator is available in the ZCC application. Z-Tunnel 2.0 (DTLS or TLS) supports all ports and protocols; Z-Tunnel 1.0 (CONNECT proxy) handles only proxy-aware traffic and ports 80/443, depending on the forwarding profile.
- **Posture report**: ZCC reports device posture on a configurable cadence (default 15 minutes). If a posture check profile referenced in a ZPA policy has not been evaluated, the profile result is absent from the tunnel's posture report. Absent results are distinct from a failed result — see [`./posture-profiles.md § Gotchas`](./posture-profiles.md).
- **Step-up verification prompt**: ZCC 4.6+/4.7+ displays a "Verify Now" prompt when a Conditional Access policy matches. If the prompt appears unexpectedly, a policy rule is matching the user to a step-up condition that the user should not be subject to.
- **Error codes from ZCC**: ZCC exposes local error codes on connection failure. These are ZCC-level diagnostics and are outside the ZPA admin console view. Consult the legacy error-codes article (`vendor/zscaler-help/legacy-about-error-codes-zcc.md`) for the current code catalog.

### 2.3 App Connector logs

App Connector logs are the on-host record of what the connector did for each request it received. Key signals:

- **Enrollment log entries**: enrollment failures produce a literal `error:Login request failed - http status(401)` in the enrollment log, indicating a bad, truncated, or utilization-exhausted provisioning key.
- **Application reachability**: the connector performs DNS and TCP reachability checks for applications at access time (or continuously if `health_reporting = CONTINUOUS`). Connection failures to the application server surface in connector logs as TCP or TLS errors against the application's IP/port.
- **Certificate errors**: if the application server's certificate chain fails validation by the connector (relevant for double-encrypted segments), the connector logs a TLS handshake failure. This is distinct from the user-facing certificate error visible in a browser — the connector's error is server-side.

LSS App Connector Status and App Connector Metrics log types stream connector health data to the configured SIEM. The LSS retransmit window after a connectivity gap is at most 15 minutes; logs generated during longer outages are permanently lost. See [`./app-connector.md § Logging`](./app-connector.md).

---

## 3. Architecture path summary

Every ZPA access request traverses the following path. Failures can occur at each hop.

```
User device (ZCC)
  └─ [Z-Tunnel / Microtunnel → ZPA Public or Private Service Edge]
       └─ [Central Authority: policy evaluation — Access Policy, Timeout Policy]
            └─ [App Connector Group selection]
                 ├─ Phase 1: eligibility filter (CONNECTED status,
                 │           target reachability via AliveTargetCount,
                 │           Server Group → Connector Group association)
                 └─ Phase 2: latency-based selection from survivors
                      └─ [Selected App Connector]
                           └─ [TCP/TLS connection → Application Server]
```

A failure or misconfiguration at any layer produces a distinct evidence pattern. The decision tree in section 1 maps symptoms to layers; section 4 provides step-by-step verification for each layer.

**Eligibility-vs-selection distinction**: connector health and target reachability gate eligibility *before* a connector is ever picked. An LSS record with `ConnectionStatus = Close` and an **empty `Connector` field** means eligibility filtering rejected every candidate — no connector was assigned, so there's no connector-to-app hop to investigate. Hypotheses like "the assigned connector tried to reach the app and failed" don't apply to this evidence pattern; the fix is on the eligibility side. See [`./app-connector.md § How sessions are assigned to App Connectors`](./app-connector.md#how-sessions-are-assigned-to-app-connectors).

---

## 4. Specific verification steps

### 4.1 Application segment — domain and port match

The first layer of ZPA processing runs client-side inside ZCC. If the domain is not in any segment, or if the port does not match the segment that wins the specificity race, ZCC never forwards the request to ZPA and no log record is created.

**Verification steps:**

1. Identify the exact FQDN and destination port the user is accessing. These must both appear in an enabled application segment.
2. In the ZPA console, navigate to Application Segments and search for the FQDN. If multiple segments contain the FQDN, identify which one wins by specificity: `server1.example.com` > `*.example.com` > `*.com`. An exact hostname segment beats a wildcard segment. Port narrowness does not affect specificity ranking.
3. Confirm the destination port is in `tcp_port_ranges` (or `udp_port_ranges`) of the winning segment. If the port is missing, ZCC sends the traffic directly and ZPA logs nothing.
4. Confirm the segment is enabled (`enabled = true`).
5. Confirm `bypass_type`. If any segment covering the same FQDN has `bypass_type = Always`, that segment wins over all specificity-based rules and ZCC sends traffic direct. Per [`./app-segments.md § Bypass precedence`](./app-segments.md).
6. If a specific-FQDN segment was recently created for a host that was previously covered only by a wildcard segment, confirm the wildcard segment is still covering other ports needed by the same host. Per the "carved out" default behavior, configuring a specific FQDN segment removes that FQDN from the wildcard segment for all ports — not just the ports defined in the specific segment. See [`./app-segments.md § The carved-out default behavior`](./app-segments.md).

**SDK verification (Python):**

```python
# List all segments and find those whose domain_names contain the target FQDN
segments, _, err = client.zpa.application_segments.list_segments()
matching = [s for s in segments if any(target_fqdn in d for d in (s.domain_names or []))]
```

**SDK verification (Go):**

```go
segments, _, err := applicationsegment.GetAll(ctx, service)
// iterate and check DomainNames slice for the target FQDN
```

### 4.2 Segment group membership

Access policy rules reference either specific application segments or segment groups. A segment that is not assigned to any segment group cannot be targeted by a policy rule that references segment groups. Each application segment belongs to exactly one segment group.

**Verification steps:**

1. Identify the `segment_group_id` on the application segment.
2. Confirm the segment group is enabled.
3. Confirm the access policy rule that is supposed to allow the user references either the specific segment directly or the segment group the segment belongs to.
4. If the segment group field shows an incomplete-configuration icon in the console, the segment group is missing required configuration and should be treated as misconfigured.

**API call (Go):**

```go
// GetPolicyByApplication returns all policy rules that reference a given application segment
rules, _, err := policysetcontrollerv2.GetPolicyByApplication(ctx, service, "ACCESS_POLICY", applicationSegmentID)
```

This call is the most direct way to enumerate which policy rules reference a segment, which is otherwise tedious to determine by inspection when there are many rules.

### 4.3 Server group and App Connector group reachability

An application segment references one or more server groups. Each server group references one or more App Connector groups. The App Connectors in those groups must have network connectivity to the application server at the destination IP and port.

**Verification steps:**

1. From the segment's server group references, identify which App Connector groups serve the application.
2. In the console (Infrastructure > App Connector Groups), confirm at least one connector in each group shows `Connected` status. A group with all connectors disconnected cannot serve traffic for any segment it is associated with.
3. Confirm the App Connector group is associated with at least one server group and one provisioning key. A group with neither cannot serve traffic — the console does not flag this partial configuration as invalid. Per [`./app-connector.md § Edge cases`](./app-connector.md).
4. For each connected connector, confirm it can reach the application server. This requires either reviewing connector logs for TCP errors against the application host or using a network path test from the connector VM itself.
5. If the connector is connected to ZPA but cannot reach the application server (DNS failure, routing gap, firewall rule), the LSS User Activity log will show `ConnectionStatus = Close` with an `InternalReason` indicating a connector-to-server setup failure, and `ConnectionSetupTime` will be disproportionately high.

**SDK verification (Python):**

```python
# Check per-connector status
connectors, _, err = client.zpa.app_connectors.list_connectors()
down = [c for c in connectors if c.connection_state != "CONNECTED"]
```

**SDK verification (Go):**

```go
connectors, _, err := appconnectorcontroller.GetAll(ctx, service)
// inspect ConnectionState field per connector
```

### 4.4 Access policy match

ZPA access policy evaluates top-down, first-match across rules that reference the matched segment. The default when no rule matches is block. See [`./policy-precedence.md`](./policy-precedence.md) for the full evaluation model.

**Verification steps:**

1. Look up the `Policy` field in the LSS User Activity log for the failed session. If the field contains a rule name, that rule fired. If the action was block, the rule name identifies which rule to inspect.
2. If `Policy` is empty and the session was blocked, one of two things happened: (a) the forwarding policy bypassed ZPA before access policy evaluated, or (b) the segment was not in any policy rule's scope.
3. Confirm the forwarding policy is not set to `BYPASS` for the application's traffic. A forwarding rule with `BYPASS` action sends traffic direct before access policy evaluates. A `BYPASS` forwarding rule combined with a `BLOCK` access rule is a common misconfiguration where the block never fires. Per [`./policy-precedence.md § Policy order`](./policy-precedence.md).
4. Confirm the access policy rule intended to allow the user references the correct application segment or segment group, and that the user satisfies all criteria (SAML attributes, SCIM groups, platform, posture).
5. Confirm rule order. If a broad-allow rule appears above a narrow-block rule, the broad-allow fires first. Top-down first-match means the more-specific rule must appear earlier in the list. Per [`./policy-precedence.md § The specificity-vs-top-down precedence quirk`](./policy-precedence.md).
6. If the policy uses SCIM group criteria, confirm the SCIM sync is complete and the user appears in the SCIM database. Policies evaluated against out-of-sync users default to block.

**SDK verification (Go):**

```go
// Fetch all access policy rules
rules, _, err := policysetcontrollerv2.GetAllByType(ctx, service, "ACCESS_POLICY")
// Inspect rule order, actions, and conditions
```

```go
// Look up rules that reference a specific application segment
rules, _, err := policysetcontrollerv2.GetPolicyByApplication(ctx, service, "ACCESS_POLICY", applicationSegmentID)
```

### 4.5 Posture and timeout policy

Device posture is evaluated by ZCC on a configurable cadence (default approximately 15 minutes). ZPA policy rules consume the last-reported result per posture profile via the `POSTURE` operand condition.

**Verification steps:**

1. Identify whether any access policy or timeout policy rule applying to this user contains a `POSTURE` condition.
2. Confirm the posture profile `posture_udid` referenced in the policy operand matches the intended profile. Using the profile `id` instead of `posture_udid` as the `lhs` produces a condition that silently never matches. Per [`./posture-profiles.md § Gotchas`](./posture-profiles.md).
3. Confirm the device has evaluated the posture profile. A profile that has never been reported is not the same as a failed profile — a device that never ran the check produces no `POSTURE` result. Combine a `POSTURE` condition with a `CLIENT_TYPE` condition to ensure the rule only applies to devices expected to run the check.
4. If the user is blocked by `rhs = "false"` (non-compliant device) posture conditions in a timeout policy, check whether the timeout policy is applying a shorter session duration to non-compliant devices than the user expects. Per [`./policy-precedence.md § Timeout policy specifics`](./policy-precedence.md), default session timeout is 2 days and idle timeout is 10 minutes.
5. If a posture check is failing silently, confirm the `devicePostureFailureNotificationEnabled` flag is set on the access policy rule. When this flag is false, users receive no notification when posture causes a denial.

**SDK verification (Python):**

```python
# Enumerate available posture profiles and their posture_udids
profiles, _, err = client.zpa.posture_profiles.list_posture_profiles()
for p in profiles:
    print(p.name, p.posture_udid)
```

**SDK verification (Go):**

```go
profiles, _, err := postureprofile.GetAll(ctx, service)
// match profile name to policy operand lhs values
```

### 4.6 Certificate trust — Browser Access and double-encrypted segments

Certificate trust failures produce different errors depending on the access method.

**Browser Access:**

- Browser Access requires a TLS certificate for the external-facing hostname (the CNAME that users resolve).
- If the external hostname and internal hostname differ, the internal application server's certificate may not match the external hostname. This is expected behavior and produces a server-certificate warning visible to the end user. It does not block ZPA policy evaluation.
- Wildcard certificates cover only one level of subdomain. A `*.example.com` certificate covers `app.example.com` but not `app.sub.example.com`. If the application hostname has more levels, a separate application segment with a matching certificate is required. Per `vendor/zscaler-help/using-wildcard-certificates-browser-access-applications.md`.

**Double Encryption:**

- Double-encrypted segments add a second layer of TLS between the ZPA Service Edge and the App Connector. The App Connector must be able to terminate this second TLS layer.
- If the App Connector cannot verify the ZPA Service Edge's certificate (unusual, since the certificate chain is Zscaler-signed), the connector-side TLS handshake fails and the user sees a connection failure.
- Double Encryption is mutually exclusive with Browser Access and Source IP Anchoring on the same segment. Per [`./app-segments.md § Edge cases`](./app-segments.md).

**Certificate-pinned clients:**

- Some client applications (mobile apps, thick clients) pin their TLS certificates and refuse to connect through any TLS intermediary including ZPA. This is distinct from ZPA misconfiguration. The symptom is a TLS handshake failure visible in the application, while ZPA itself shows a successful policy match and connector handoff. The `DoubleEncryption` field in the LSS log and `ConnectorZENSetupTime` can confirm ZPA completed its side of the handshake while the client rejected the server certificate.

---

## 5. Common failure modes

### 5.1 Segment not in segment group

An application segment created without a segment group assignment cannot be referenced by any policy rule that addresses segment groups. If the policy rule references only segment groups (not specific segments), traffic from users matching that rule will not match the segment, and the default-block applies.

**How to identify**: In the admin console, the segment group page shows an incomplete-configuration icon next to segments missing group assignment. Programmatically, retrieve the segment and check `segment_group_id` is non-empty.

### 5.2 Double-encrypted segment with mismatched or missing certificate

A segment with Double Encryption enabled requires a valid certificate chain that the App Connector can verify. If the certificate is self-signed or the chain is incomplete, the App Connector's TLS layer terminates with a handshake error even though ZPA policy allowed the connection. The user sees a generic connection failure; the App Connector logs show TLS errors against the application server.

**How to identify**: Enable connector logging and look for TLS handshake failure messages. Cross-check segment configuration: `DoubleEncryption` field in the LSS log and segment-level double-encryption setting in the console.

### 5.3 Posture failing silently

If a ZPA policy rule blocks on `POSTURE` with `rhs = "false"` and `devicePostureFailureNotificationEnabled = false` (the SDK/wire-format field; Go wire format is camelCase `devicePostureFailureNotificationEnabled`), the user receives no notification. The user experiences the same symptom as any other policy block — the application is simply unreachable.

**How to identify**: Pull the LSS User Activity log. The `Policy` field names the blocking rule. If the rule name is a posture-related rule, confirm the posture condition and notification flag.

### 5.4 IdP group not synced (SCIM delay)

SCIM group membership changes in the IdP propagate to ZPA on an IdP-controlled push schedule. After the initial SCIM activation, Zscaler recommends waiting a minimum of 48 hours (sometimes up to a week) before enabling SCIM-group-based policies, as users not yet in the SCIM database default to block.

Symptom: user is a member of the required group in the IdP but is blocked by a SCIM group policy in ZPA. The LSS log `Policy` field names the blocking rule; the rule's conditions reference a SCIM group the user is not yet visible in.

**How to identify**: Compare the user's SCIM group memberships visible at Administration > Identity > SCIM Attributes against the group referenced in the policy rule. Per `references/zpa/policy-precedence.md § Edge cases (SCIM sync timing)`.

### 5.5 Wildcard segment shadowing specific segment

When a specific-FQDN application segment is created for a host that was previously covered only by a wildcard segment, the specific-FQDN segment wins the specificity race for all requests to that host. Any port not defined in the specific segment is dropped client-side by ZCC — ZCC does not fall back to the wildcard segment. This is the "carved out" default behavior.

Example: wildcard segment covers `*.internal.corp` on TCP 1-65535. A new specific segment covers `db.internal.corp` on TCP 5432 only. A user attempting `db.internal.corp:22` now gets a direct-bypass (or drop) because the specific segment does not include port 22 and the wildcard segment is no longer evaluated for that host.

**How to identify**: Confirm the specific-FQDN segment includes all ports the application needs. If the wildcard segment needs to serve as a catch-all for ports not defined in the specific segment, enable Multimatch (`match_style = INCLUSIVE`) on both segments consistently. Per [`./app-segments.md § The carved-out default behavior`](./app-segments.md).

### 5.6 Certificate-pinned client

Client applications that pin their server's TLS certificate reject the ZPA Service Edge's certificate regardless of whether the certificate chain is otherwise valid. ZPA logs a successful connection handoff to the App Connector, but the end-application fails to establish its own TLS session. From the user's perspective the application is unreachable; from ZPA's perspective the connection succeeded.

**How to identify**: The `ConnectionSetupTime` in LSS is normal or low, and the connector reports no errors. The client application log (if accessible) shows a TLS handshake failure or a pinned-certificate mismatch. Resolution requires either disabling certificate pinning in the client (usually requires an application update) or exempting the application from ZPA interception via a forwarding policy `BYPASS` rule for that specific segment — accepting that the app goes direct.

---

## 6. Read-side API and SDK calls for automated triage

The following calls support read-only triage automation. None of them modify ZPA configuration.

### 6.1 Application segment status

**Python SDK:**

```python
# Get a specific segment by name
seg, _, err = client.zpa.application_segments.get_segment(segment_id)
# List segments with a search filter
segs, _, err = client.zpa.application_segments.list_segments(
    query_params={"search": "db.internal.corp"}
)
```

**Go SDK:**

```go
// List all segments
segs, _, err := applicationsegment.GetAll(ctx, service)

// Get by name
seg, _, err := applicationsegment.GetByName(ctx, service, "DB Segment")

// Get policy rules referencing a specific segment (most useful for triage)
rules, _, err := applicationsegment.GetApplicationMappings(ctx, service, segmentID)
// ApplicationMappings returns {Name, Type} pairs identifying which objects reference the segment
```

### 6.2 App Connector health

**Python SDK:**

```python
# All connectors
connectors, _, err = client.zpa.app_connectors.list_connectors()

# Single connector
connector, _, err = client.zpa.app_connectors.get_connector(connector_id)

# All groups (summary: count, status, update window)
groups, _, err = client.zpa.app_connector_groups.list_connector_groups_summary()
```

**Go SDK:**

```go
// Single connector
connector, _, err := appconnectorcontroller.Get(ctx, service, connectorID)
// Inspect: connector.ConnectionState, connector.CurrentVersion, connector.UpgradeStatus

// All connectors — filter for disconnected
connectors, _, err := appconnectorcontroller.GetAll(ctx, service)
```

Key fields to check per connector: `connection_state` (must be `CONNECTED`), `current_version` vs `expected_version` (version lag), `upgrade_status` (`Scheduled` / `Success` / `Failure`).

### 6.3 Policy rules referencing a segment or application

**Go SDK:**

```go
// All access policy rules in evaluation order
rules, _, err := policysetcontrollerv2.GetAllByType(ctx, service, "ACCESS_POLICY")

// Rules specifically referencing an application segment
appRules, _, err := policysetcontrollerv2.GetPolicyByApplication(ctx, service, "ACCESS_POLICY", applicationSegmentID)

// Forwarding policy rules (check for BYPASS before examining access policy)
fwdRules, _, err := policysetcontrollerv2.GetAllByType(ctx, service, "CLIENT_FORWARDING_POLICY")
```

Examine each rule for: `action` (ALLOW / BLOCK / BYPASS / RE_AUTH), `rule_order`, and the conditions tree (operand `object_type`, `values` or `entry_values`).

### 6.4 Posture profile lookup

When verifying that a policy condition references the correct posture profile:

**Python SDK:**

```python
profiles, _, err = client.zpa.posture_profiles.list_posture_profiles()
# Match by posture_udid to the lhs value in the policy operand
target = next((p for p in profiles if p.posture_udid == suspected_udid), None)
```

**Go SDK:**

```go
profile, _, err := postureprofile.GetByPostureUDID(ctx, service, suspectedUDID)
// Confirms the UDID resolves to a valid profile; returns nil if not found
```

### 6.5 LSS log query pattern (Splunk example)

Assuming User Activity logs are streaming to Splunk:

```spl
index=zpa sourcetype=zpa_user_activity
  Username="user@example.com"
  Host="db.internal.corp"
| table LogTimestamp, ConnectionStatus, Policy, InternalReason, Connector, ServerIP, ServerPort, ConnectionSetupTime, AppLearnTime
| sort -LogTimestamp
```

Fields to examine:

| Field | What it tells you |
|---|---|
| `ConnectionStatus` | `Open` = established; `Close` = ended; `Active` = in-progress at log time |
| `Policy` | Name of the access policy rule that matched — empty if no rule matched (default block) |
| `InternalReason` | Internal reason code for the status — useful for connector-side failures |
| `Connector` | Name of the App Connector that handled the session |
| `ServerIP` / `ServerPort` | Destination the connector reached |
| `ConnectionSetupTime` | Microseconds from connector notification to server connection — high values indicate application-side slowness |
| `AppLearnTime` | Microseconds for connectors to learn the application — high values indicate health-reporting gaps |

See [`./logs/access-log-schema.md`](./logs/access-log-schema.md) for the full field inventory.

---

## 7. Open questions register

- **`InternalReason` field value catalog** — the LSS User Activity log field `InternalReason` is described as "internal reason for the status of the transaction" but no public enumeration of its values is documented. Mapping specific `InternalReason` values to root causes requires empirical observation or Zscaler Support input. Treat any specific value as undocumented for purposes of automated triage.
- **Posture result for "never evaluated" vs "failed"** — the distinction between a device that has never run a posture check and one that ran it and failed is not documented in SDK source or help articles. The policy condition `rhs = "false"` is documented to match "device failed this posture check" but the handling of "profile not evaluated" is unconfirmed. See [`./posture-profiles.md § Gotchas`](./posture-profiles.md).
- **App Connector certificate validity window** — the validity period of the TLS client certificate generated during App Connector enrollment is not publicly documented. Operators with long-running connectors should confirm expiry dates and re-enrollment procedures with Zscaler Support. See [`./app-connector.md § Open questions`](./app-connector.md).
- **Connector-to-app latency probe cadence** — ZPA continuously measures App Connector-to-application latency for connector selection, but the re-measurement interval is not documented. Relevant for "our network path changed; how long until ZPA reroutes?" questions. See [`./app-connector.md § Open questions`](./app-connector.md).
- **LSS multi-segment match representation** — when Multimatch is enabled and multiple segments match a single request, it is not documented whether the `Application` and `AppGroup` fields in the LSS User Activity log carry all matched segments or only the primary one. See [`./logs/access-log-schema.md § Open questions`](./logs/access-log-schema.md) for clarification `zpa-01`.

---

## Cross-links

- Application segment matching and the carved-out / Multimatch behavior — [`./app-segments.md`](./app-segments.md)
- Access policy evaluation order, rule actions, SCIM sync timing, forwarding policy precedence — [`./policy-precedence.md`](./policy-precedence.md)
- App Connector architecture, provisioning keys, enrollment errors, software update schedule, LSS retransmit window — [`./app-connector.md`](./app-connector.md)
- Posture Profile field schema, `posture_udid` vs `id` distinction, silent-failure gotchas — [`./posture-profiles.md`](./posture-profiles.md)
- LSS User Activity log field inventory (all timing, byte counter, and session identity fields) — [`./logs/access-log-schema.md`](./logs/access-log-schema.md)
