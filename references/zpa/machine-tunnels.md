---
product: zpa
topic: "zpa-machine-tunnels"
title: "ZPA Machine Tunnels — pre-authentication policy and AD connectivity"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "https://help.zscaler.com/zscaler-client-connector/about-machine-tunnels"
  - "vendor/zscaler-help/about-machine-tunnels.md"
  - "vendor/zscaler-help/supported-parameters-zscaler-client-connector-windows.md"
  - "vendor/zscaler-help/supported-parameters-zscaler-client-connector-macos.md"
  - "vendor/zscaler-help/configuring-device-posture-profiles.md"
  - "vendor/zscaler-help/automate-zscaler/api-reference-zcc-overview.md"
  - "vendor/terraform-provider-zpa/docs/data-sources/zpa_machine_group.md"
  - "vendor/zscaler-sdk-python/zscaler/zpa/machine_groups.py"
  - "vendor/zscaler-sdk-python/zscaler/zpa/policies.py"
  - "vendor/zscaler-sdk-go/zscaler/zpa/services/machinegroup/zpa_machine_group.go"
author-status: draft
---

# ZPA Machine Tunnels — pre-authentication policy and AD connectivity

## Overview

A **machine tunnel** allows a Windows or macOS device to establish a ZPA connection *before* the user logs in to Zscaler Client Connector (ZCC). The tunnel runs as a machine-identity session rather than a user-identity session, so it exists even when no user is authenticated to ZCC.

**Why this exists:** Enterprises relying on Active Directory for login and Group Policy require the device to reach a domain controller before Windows (or macOS) can authenticate a cached or new credential, enforce GPO, and complete logon scripts. Without a pre-authentication tunnel, the device is network-isolated from AD at exactly the moment AD connectivity is mandatory.

Key facts from the source documentation:

- Supported platforms: **Windows and macOS only**. iOS, Linux, Android, and Android on ChromeOS are not supported.
- Contact Zscaler Support to enable the feature on **macOS**; it is not self-serve for that platform.
- WebView2 authentication is not supported for machine tunnels.
- An admin-level toggle on the app profile (the `MTAUTHREQUIRED` / `mtAuthRequired` MSI/EXE parameter) optionally requires IdP authentication before the machine tunnel starts, allowing the machine tunnel to be IdP-gated even at the pre-login stage.

**How machine tunnels differ from user tunnels:**

| Dimension | Machine Tunnel | User Tunnel |
|---|---|---|
| Identity | Machine identity (machine token / signing cert) | User identity (IdP authentication) |
| Timing | Starts pre-login, before user authenticates to ZCC | Starts after user authenticates to ZCC |
| Purpose | AD/DC reachability, GPO, cached credential validation | Application access, user-scoped ZPA policy |
| Client Type (policy wire value) | `zpn_client_type_machine_tunnel` | `zpn_client_type_zapp` |
| Platform support | Windows, macOS | Windows, macOS, Linux, iOS, Android |
| IdP auth requirement | Optional (admin-controlled via `mtAuthRequired`) | Always required |

## Architecture

### Layer separation

The machine tunnel involves two distinct layers that are frequently conflated:

1. **Transport layer (ZCC z-tunnel)** — ZCC establishes the tunnel connection using Z-Tunnel 1.0 or 2.0 at the operating-system level before a user session exists. This is covered in [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md); the present document does not repeat that content.

2. **Policy layer (ZPA)** — Once the transport tunnel is up, ZPA evaluates access policy against the machine's identity and decides which application segments the machine can reach. This is the subject of this document.

The `about-machine-tunnels.md` help article describes the ZCC Portal view (monitoring, status tracking, CSV export), which is the ZCC-side operational surface. The ZPA Admin Portal surfaces the policy-side configuration: Machine Groups, Machine Provisioning Keys, and access/forwarding policy rules that reference `Machine Tunnel` as a client type.

### Machine identity establishment

Before a machine tunnel can be evaluated by ZPA policy, the machine must be enrolled and provisioned:

1. **Machine Group** — a named collection of enrolled machines, analogous to a server group. Created in the ZPA Admin Portal.
2. **Machine Provisioning Key** — a token embedded in the ZCC app profile that the machine presents during initial enrollment. After enrollment, the machine receives a machine-specific token that uniquely identifies it within the Machine Group.
3. **Signing Certificate** — the machine's identity anchor. Visible in the `Machines` sub-object in the SDK: `fingerprint`, `issuedCertId`, `signingCert`.

The flow: ZCC (using the provisioning key from the app profile) enrolls the device → ZPA issues a machine token → the device is visible in the Machine Group → ZPA policy can now reference that group.

**Monitoring:** The ZCC Portal's Machine Tunnel page (`Enrolled Devices > Machine Tunnel`) shows enrolled machines with status (Active, Inactive, Removed, Unregistered), hostname, OS, device model, and ZCC version. Admins can search by hostname, machine tunnel token, hardware fingerprint, or ZCC version, and export to CSV. This is a read-only monitoring surface — policy is configured in ZPA, not here.

## Configuration surface

### ZPA Admin Portal

The admin-facing setup requires three objects, created in the ZPA Admin Portal:

1. **Machine Groups** — define the set of machines eligible for machine-tunnel policy. Created under the machine groups section.
2. **Machine Provisioning Keys** — link a machine group to an enrollment certificate. The key is embedded in the ZCC app profile rule for Windows or macOS. The key controls the max number of enrollments and optionally restricts enrollment by source IP ACL.
3. **App Profile configuration** — in the ZCC app profile rule:
   - Set `MTAUTHREQUIRED` / `mtAuthRequired` to 1 to require IdP authentication before the machine tunnel starts. This is distinct from the user-session IdP authentication.
   - Set `POLICYTOKEN` / `policyToken` to specify the pre-enrollment app profile policy (required when `STRICTENFORCEMENT` is also in use and machine tunnel is configured, to ensure a PAC file with IdP bypass is applied before the user enrolls).
4. **Enable ZPA machine tunnel for all** — the global toggle enabling machine tunnels across the tenant. The original "Configuring ZPA Machine Tunnel for All" help article URL redirects as of the capture date; the exact console path for this toggle is an open question (see below).

### API / SDK

**ZPA Management API endpoint:**

```
GET  /zpa/mgmtconfig/v1/admin/customers/{customerId}/machineGroup
GET  /zpa/mgmtconfig/v1/admin/customers/{customerId}/machineGroup/{id}
GET  /zpa/mgmtconfig/v1/admin/customers/{customerId}/machineGroup/summary
```

Machine Groups are **read-only** through the SDK (no Create/Update/Delete functions exist in either the Python SDK or the Go SDK — only Get, GetByName, GetAll, and GetMachineGroupSummary). Enrollment and group membership are managed through ZCC's provisioning flow, not directly through the management API.

**Python SDK** (`zscaler.zpa.machine_groups`):

```python
# List all machine groups
groups, _, err = client.zpa.machine_groups.list_machine_groups(
    query_params={'search': 'MGRP01', 'page': '1', 'page_size': '100'}
)

# Get summary (name + ID only)
summary, _, err = client.zpa.machine_groups.list_machine_group_summary()

# Get a specific group
group, _, err = client.zpa.machine_groups.get_group('999999')
```

The `MachineGroup` model fields: `id`, `name`, `enabled`, `description`, `creation_time`, `modified_time`, `modified_by`. The nested `machines` list is visible in the Go SDK's `MachineGroup.Machines` slice and carries `fingerprint`, `issuedCertId`, `machineTokenId`, and `signingCert` per machine entry.

**Go SDK** (`machinegroup` package):

```go
group, _, err := machinegroup.Get(ctx, service, machineGroupID)
group, _, err := machinegroup.GetByName(ctx, service, "MGRP01")
groups, _, err := machinegroup.GetAll(ctx, service)
summary, _, err := machinegroup.GetMachineGroupSummary(ctx, service)
```

All calls require `common.Filter{MicroTenantID: service.MicroTenantID()}` as with all ZPA SDK calls.

**ZCC API (device removal):**

```
DELETE /zcc/papi/public/v1/devices/machineTunnel
```

This is the only write operation: removing an enrolled machine tunnel device from the ZCC Portal.

### Terraform

There is **no `zpa_machine_group` resource** in the Terraform provider — machine groups are enrollment-driven and cannot be created via Terraform. The provider exposes only a **data source**:

```terraform
data "zpa_machine_group" "example" {
  name = "MGRP01"
}
```

Exported attributes include `id`, `enabled`, `description`, and the nested `machines` list (with `fingerprint`, `issued_cert_id`, `machine_token_id`, `signing_cert`). The data source is used to pull the machine group ID into policy rules.

Provisioning Keys (for App Connector / Service Edge enrollment, not the machine tunnel provisioning key) are a separate `zpa_provisioning_key` resource — not directly applicable here.

## Policy interaction

### Client Type on Access and Forwarding Policy

Machine tunnels surface in ZPA policy as the client type `zpn_client_type_machine_tunnel`. This is the primary mechanism for writing policy that applies to pre-login machine sessions and not to user sessions (or vice versa).

From `policy-precedence.md`, the Client Types criterion on an access policy rule uses an AND relationship across distinct criterion types and an OR relationship within a single criterion block. The full client type enum (as validated in the Python SDK):

```
zpn_client_type_edge_connector
zpn_client_type_branch_connector
zpn_client_type_machine_tunnel
zpn_client_type_zapp            (user ZCC sessions)
zpn_client_type_zapp_partner
```

A rule that includes `zpn_client_type_machine_tunnel` in its `CLIENT_TYPE` operand will match machine tunnel sessions. A rule that includes only `zpn_client_type_zapp` will not match machine tunnel sessions, even on the same device.

**Practical consequence:** access policy rules written for user sessions (client type `zapp`) do not automatically apply to the pre-login machine tunnel. You must write explicit rules for `machine_tunnel` client type, or machine-tunnel sessions will hit the ZPA default (block).

### Machine Groups as a policy criterion

As noted in `policy-precedence.md`, `Machine Groups` is a first-class criterion on access policy rules. A rule can be scoped to a specific Machine Group, giving you the ability to grant different pre-login app access to different machine populations (e.g., laptops vs VDI vs kiosks).

From the Terraform data source: machine group IDs retrieved via `data.zpa_machine_group` can be referenced directly in `zpa_policy_access_rule` resources to scope access rules to that group.

### App Segments

Machine tunnel sessions resolve application segments and undergo policy evaluation exactly like user sessions — using the most-specific-segment-wins matching described in [`./app-segments.md`](./app-segments.md). The segments available to a machine tunnel are constrained by whatever access policy rules match the machine tunnel client type.

**Segment design guidance:** Pre-login connectivity typically requires a narrow set of targets: domain controllers (TCP 389/636, 88, 53, 445, 3268/3269), DNS servers, DHCP, and potentially WSUS or SCCM endpoints. Define dedicated application segments for these targets rather than reusing user-facing segments, so that the machine tunnel's reachable surface is minimized and auditable independently.

### Forwarding Policy

Forwarding Policy evaluates before Access Policy (see [`./policy-precedence.md`](./policy-precedence.md)). A forwarding rule with client type `zpn_client_type_machine_tunnel` can be used to route machine-tunnel traffic to a specific Service Edge group, or to bypass ZPA entirely for certain destinations. The `zpn_client_type_machine_tunnel` value is valid in the forwarding policy's `CLIENT_TYPE` operand.

### Client Forwarding Policy

The Client Forwarding Policy (which decides forwarding profile and ZIA/ZPA service routing for ZCC itself) also accepts `zpn_client_type_machine_tunnel` as a valid client type in its conditions. This is used to direct machine tunnel traffic through specific Service Edges or to enforce specific forwarding behaviors for pre-login sessions distinct from post-login sessions.

### Posture profiles and machine tunnels

Device Posture Profiles have an explicit **Apply to Windows Machine Tunnel** and **Apply to macOS Machine Tunnel** toggle (see `configuring-device-posture-profiles.md`). When selected, the posture type is evaluated against the pre-login machine tunnel session. When not selected, the posture check only applies to regular (post-login) ZPA and ZIA tunnels.

Supported posture types on the **Windows** machine tunnel: Client Certificate, Certificate Trust, File Path, Registry Key, Firewall, Full Disk Encryption, Domain Joined, AzureAD Domain Joined, Server Validated Client Certificate, OS Version, Zscaler Client Connector Version.

Supported posture types on the **macOS** machine tunnel: CrowdStrike ZTA Score, Full Disk Encryption, File Path, Firewall, Domain Joined, OS Version, Zscaler Client Connector Version.

This posture-check capability allows, for example, requiring that a domain-joined certificate exist on the device before the machine tunnel is granted access to domain controllers — enforcing machine identity at the policy level without relying solely on the machine token.

## Common gotchas

### GPO timing and the chicken-and-egg problem

Machine tunnels exist to allow GPO delivery before login. However, Group Policy Application (the `gpupdate /force` path) requires authenticated LDAP connectivity to a domain controller, which requires the machine tunnel to be established and its access policy to allow LDAP/Kerberos traffic. If the machine tunnel policy is misconfigured — or if the tunnel has not finished establishing — GPO delivery fails silently and the user's desktop environment may appear in a degraded state. Symptom: roaming profiles fail, mapped drives are absent, software deployment does not apply. Diagnostic path: confirm the machine is in the correct Machine Group, the Machine Group is referenced in an access policy rule allowing DC destinations for client type `machine_tunnel`, and that the machine tunnel status in the ZCC Portal is Active.

### Certificate-based machine authentication and certificate distribution

Machine tunnels use certificate-based enrollment (via the Machine Provisioning Key and the associated enrollment certificate). The `issuedCertId` and `signingCert` fields on each enrolled machine record the certificate anchor. Deploying a machine provisioning key requires the enrollment certificate's private key to be accessible by ZCC at enrollment time. In MDM-managed environments, this typically means the enrollment certificate is distributed via MDM (Intune, Jamf, etc.) and the provisioning key is baked into the ZCC MSI deployment parameters. Failure to pre-stage the certificate before ZCC installation results in enrollment failure and no machine tunnel registration.

### Machine authentication vs user authentication for the machine tunnel

The `MTAUTHREQUIRED` / `mtAuthRequired` parameter optionally requires IdP authentication before the machine tunnel starts. This is a separate authentication gate on top of the machine certificate enrollment. When enabled, ZCC must be able to reach the IdP login page before the machine tunnel is established — which requires `POLICYTOKEN` / `policyToken` to reference an app profile whose PAC file bypasses the IdP login page. Forgetting to configure the PAC bypass creates a deadlock: the machine tunnel won't start without IdP auth, but the device can't reach the IdP without the machine tunnel.

### Machine vs user policy precedence

After the user logs in and ZCC authenticates the user-identity session (`zpn_client_type_zapp`), both the machine tunnel and the user tunnel can be active simultaneously. ZPA policy evaluation is independent per session type — the machine tunnel continues to evaluate against `machine_tunnel` client-type rules, and the user session evaluates against `zapp` client-type rules. There is no automatic promotion or merger of the two sessions. A segment that should only be reachable post-login must explicitly exclude `zpn_client_type_machine_tunnel` from its access policy rules; otherwise a device with an active machine tunnel can reach it before the user authenticates.

### Narrow platform support

Machine tunnels are supported only on Windows and macOS. A policy rule with client type `machine_tunnel` has no effect on Linux, iOS, or Android devices. Mixed-OS fleets that need pre-login AD connectivity on Windows only should avoid writing machine-tunnel rules that inadvertently include non-Windows application segments.

### macOS requires a Zscaler Support enablement step

The macOS machine tunnel feature is not self-serve in the ZCC Portal. It requires contacting Zscaler Support to enable. Tenants that configure macOS machine tunnel provisioning keys without this enablement step will see the tunnel fail to establish on macOS devices.

### The "configuring ZPA Machine Tunnel for All" console path is not confirmed

The help article at `help.zscaler.com/zscaler-client-connector/configuring-zpa-machine-tunnel-all` redirected to an unrelated NSS page at the time of capture. The existence and exact console path of the "Enable ZPA Machine Tunnel for All" global toggle is therefore unconfirmed from documentation. The `about-machine-tunnels.md` article states the feature must be enabled, but does not detail the exact path. This is logged as an open question below.

## Open questions

1. **Console path for the global "Enable ZPA Machine Tunnel for All" toggle** — the help article (`configuring-zpa-machine-tunnel-all`) has moved or been removed. The exact ZPA Admin Portal navigation path is not confirmed from current documentation. Expected location: somewhere within App Profile or ZPA Global Settings. Requires tenant-level confirmation.

2. **Whether Machine Groups can be created via the ZPA Management API** — both SDKs expose only read operations on Machine Groups. The documentation implies groups are created in the Admin Portal and populated via provisioning enrollment. Whether a direct `POST /machineGroup` endpoint exists is not confirmed.

3. **Machine tunnel behavior during user session transitions** — the help article notes the tunnel is Active before user login and may become Inactive after. The exact lifecycle (does the machine tunnel remain active alongside the user tunnel post-login, or does it hand off?) is not explicitly documented.

4. **Machine tunnel support for macOS-specific MDM enrollment flows** — Jamf and Intune are listed as posture types for macOS. Whether they affect the machine tunnel provisioning flow (e.g., Jamf-issued certificates as the enrollment anchor) is not documented.

5. **ZPA Machine Provisioning Key type for machines** — the `zpa_provisioning_key` TF resource supports `CONNECTOR_GRP` and `SERVICE_EDGE_GRP` association types. Whether machine tunnel provisioning keys use a different mechanism (app profile embedded key rather than a standard ZPA provisioning key resource) is not fully clear from sources.

## Cross-links

- Z-Tunnel transport layer (how the pre-login tunnel connection is physically established) — [`../zcc/z-tunnel.md`](../zcc/z-tunnel.md)
- ZPA access policy evaluation order and first-match semantics — [`./policy-precedence.md`](./policy-precedence.md)
- Application segment matching (most-specific-segment-wins, used by machine tunnel sessions identically to user sessions) — [`./app-segments.md`](./app-segments.md)
- Device posture profiles (the "Apply to Machine Tunnel" toggles) — [`./posture-profiles.md`](./posture-profiles.md)
- Trusted networks (controls On-Trusted vs Off-Trusted forwarding profile branch, which can affect which tunnel version the machine uses) — [`./trusted-networks.md`](./trusted-networks.md)
