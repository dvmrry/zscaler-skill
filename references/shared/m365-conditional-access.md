---
product: shared
topic: m365-conditional-access-sipa
title: "Microsoft 365 Conditional Access via SIPA — IP-based CA policy with Zscaler egress anchoring"
content-type: reasoning
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md"
  - "vendor/zscaler-help/understanding-source-ip-anchoring.md"
  - "vendor/zscaler-help/understanding-source-ip-anchoring-direct.md"
  - "references/shared/source-ip-anchoring.md"
  - "references/zia/forwarding-control.md"
  - "references/zpa/app-connector.md"
author-status: draft
---

# Microsoft 365 Conditional Access via SIPA

Describes the integration pattern that uses Source IP Anchoring (SIPA) to make Microsoft 365 IP-based Conditional Access policies function correctly for users routed through ZIA. Covers intent, architecture, required components, configuration sequence, failure modes, and troubleshooting.

For the SIPA primitive itself — what SIPA is, how it works mechanically, DNS rules, Client Forwarding Policy shape, and the SIPA Direct disaster-recovery variant — see [`./source-ip-anchoring.md`](./source-ip-anchoring.md). This document covers the M365 Conditional Access integration pattern specifically.

---

## 1. Pattern intent

Microsoft Azure AD (Entra ID) Conditional Access supports policies that gate access to M365 applications based on the source IP address of the authentication request. A typical corporate policy marks a set of organization-controlled IP ranges as a Named Location in Azure AD and then requires that users authenticate only from those locations — or applies step-up authentication (MFA) when users are outside them. Some policies outright block authentication from unknown IPs.

Under a normal ZIA deployment, user traffic egresses through Zscaler's shared Public Service Edge (PSE) cloud IPs. Those IPs are not the customer's Named Location IPs. Azure AD evaluates the PSE IP against the Named Locations list, finds no match, and either blocks access or forces unintended MFA step-up — even for users who are physically at a corporate location or connected to the corporate VPN. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)

SIPA resolves this by routing the authentication traffic through a ZPA App Connector with a customer-controlled, stable public IP. Azure AD sees that IP, matches it against the Named Locations list, and evaluates the Conditional Access policy as intended. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)

### Narrow SIPA scope suffices

Only the initial login traffic needs to be SIPA-anchored for this pattern. After a user authenticates successfully, subsequent M365 application traffic uses an authenticated session token; Azure AD does not re-evaluate the source IP on every request. The SIPA application segment therefore only needs to cover the Microsoft identity platform sign-in domains:

- `login.microsoftonline.com`
- `login.windows.net`
- `login.microsoft.com`

Scoping SIPA narrowly to these three FQDNs reduces App Connector load and avoids adding the latency of SIPA-routing to the high-volume post-authentication application traffic (Teams calls, SharePoint access, Exchange, etc.). (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)

---

## 2. Architecture

### End-to-end traffic flow

```
[User endpoint with ZCC]
        |
        | ZCC tunnels all traffic to ZIA
        v
[ZIA Public Service Edge]
  - SSL Inspection (decrypts login.microsoftonline.com)
  - URL Filtering / DLP / other ZIA policy modules
  - Forwarding Control rule matches M365 login App Segment
  - forward_method = ZPA, selects ZPA Gateway
        |
        | ZIA hands off to ZPA plane
        v
[ZPA Gateway (ZIA-side config)]
  - References ZPA Server Group containing the SIPA connector group
        |
        v
[ZPA App Connector]
  - Customer-deployed VM with stable, known public egress IP
  - App Connector's public IP is the source IP visible to Azure AD
        |
        | Connector makes outbound HTTPS request to Microsoft
        v
[login.microsoftonline.com / Azure AD]
  - Receives authentication request
  - Evaluates source IP against Named Locations
  - Grants or denies access per Conditional Access policy
```

### DNS resolution requirement

ZIA's DNS Control rules must return ZPA Synthetic IPs for the sign-in FQDNs so that ZIA routes the traffic through the forwarding rule correctly. Without this, ZIA resolves the real Microsoft IP and traffic bypasses the SIPA forwarding rule entirely, egressing from the PSE with no anchoring. The pre-configured `ZPA Resolver for Road Warrior` and `ZPA Resolver for Locations` rules must be enabled and ordered correctly. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)

### What Azure AD evaluates

Azure AD Conditional Access evaluates the source IP at the time of each authentication request — specifically, the IP of the HTTP client making the `/authorize` and `/token` requests to the identity platform endpoints. In the SIPA pattern, that IP is the ZPA App Connector's public egress IP. The Named Locations entry in Azure AD must contain exactly this IP or CIDR range. (Tier A — pattern derivable from vendor docs; Azure AD CA evaluation mechanics are Microsoft's, not Zscaler's — see "Deferred" note in `references/_clarifications.md`.)

---

## 3. Required components

| Component | Requirement |
|---|---|
| **ZIA tenant** | Active ZIA subscription with Source IP Anchoring subscription add-on. Standard ZIA alone does not include SIPA. |
| **ZPA tenant** | Required for App Connector enrollment and management. A full ZPA license is not required; SIPA subscription allows App Connector deployment solely for SIPA egress without full ZPA entitlement. (Tier A — `vendor/zscaler-help/understanding-source-ip-anchoring.md`) |
| **ZPA App Connectors** | One or more App Connectors with stable, known public egress IPs. The IPs must be static or NAT'd through a fixed address (see Section 5). Connectors must be enrolled and healthy in a named App Connector Group. |
| **ZPA Application Segment** | An application segment covering `login.microsoftonline.com`, `login.windows.net`, `login.microsoft.com`, TCP ports 80 and 443. The `Source IP Anchor` option must be enabled on this segment. |
| **ZPA Server Group + Connector Group** | Server Group associated with the App Connector Group designated for SIPA egress. Referenced by the ZIA ZPA Gateway. |
| **ZPA Client Forwarding Policy** | Rule configured for domain-based app segments: `Bypass ZPA` for ZCC-client-type traffic; `Forward to ZPA` for the `ZIA Service Edge` client type only. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`) |
| **ZPA Access Policy** | Rule that allows the `ZIA Service Edge` client type access to the M365 login App Segment. Must not include user-based SAML/SCIM criteria. |
| **ZIA ZPA Gateway** | ZIA-side resource linking Forwarding Control to ZPA. References the ZPA Server Group and App Segments by external ID. |
| **ZIA Forwarding Control rule** | Rule with `forward_method = ZPA` targeting the M365 login App Segment via the ZPA Gateway. |
| **ZIA DNS Control rules** | `ZPA Resolver for Road Warrior` and `ZPA Resolver for Locations` must be enabled and in correct order (Road Warrior at higher precedence than Locations). |
| **Azure AD Named Locations** | An entry in Azure AD (Entra ID) containing the App Connector's public egress IP(s) or CIDR ranges, tagged as a trusted location. |
| **Azure AD Conditional Access policy** | CA policy referencing the Named Locations entry to enforce IP-based access control on M365 applications. |

---

## 4. Configuration sequence

The following sequence is extracted from the vendor configuration guide. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)

### Step 1 — Initial ZPA Admin Portal setup (if not already done)

If the ZPA tenant is new or App Connectors are not yet enrolled:

1. Update company and administrator information in the ZPA Admin Portal.
2. Configure enrollment certificates for App Connectors.
3. (Optional) Configure Single Sign-On authentication.
4. Deploy and enroll App Connectors into the target connector group.

### Step 2 — ZPA: Application Segment for M365 login

1. Create a new Application Segment.
2. Under Applications, add: `login.microsoftonline.com`. Optionally add `login.windows.net` and `login.microsoft.com` as additional domains.
3. Under TCP Port Ranges, add ports `80` and `443`.
4. Enable the **Source IP Anchor** option on the segment. This is the flag that activates SIPA for this segment. Without it, traffic does not anchor.
5. Set Bypass to `Use Client Forwarding Policy`.

### Step 3 — ZPA: Segment Group and Server Group

1. Create a Segment Group and add the M365 login Application Segment to it.
2. Create or reuse a Server Group, ensuring it is associated with the App Connector Group that will serve as the SIPA egress point.

### Step 4 — ZPA: Client Forwarding Policy

1. Navigate to Policy > Client Forwarding Policy.
2. Create a rule for the SIPA Segment Groups with client type = **all types except ZIA Service Edge**, Action = `Bypass ZPA`. This rule prevents ZCC from routing M365 login traffic through ZPA directly.
3. Create a second rule for the SIPA Segment Groups with client type = **ZIA Service Edge only**, Action = `Forward to ZPA`. This is the rule that makes ZIA-initiated SIPA traffic flow through ZPA.

Rule order matters: place these rules appropriately relative to any other Client Forwarding Policy rules in the tenant.

### Step 5 — ZPA: Access Policy

1. Navigate to Policy > Access Policy.
2. Create a rule that allows access for the **ZIA Service Edge** client type to the M365 login Application Segment.
3. Do not add user-based SAML/SCIM criteria to this rule. User scoping for the SIPA flow is enforced on the ZIA side. Adding user criteria to the ZPA Access Policy causes ZPA to deny traffic because the ZIA Service Edge identity does not carry user attributes. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)

### Step 6 — ZIA: ZPA Gateway

1. Navigate to the ZPA Gateway configuration in the ZIA Admin Portal.
2. Create a ZPA Gateway that references the Server Group created in Step 3, using the ZPA external IDs.

### Step 7 — ZIA: Forwarding Control rule

1. Navigate to Policy > Forwarding Control.
2. Create a forwarding rule:
   - Under Forwarding Rule, select **ZPA** as the Forwarding Method.
   - Under General, set the required source criteria (location, user groups, etc.) as needed for the intended scope.
   - Under Destination, select the M365 login Application Segment created in Step 2.
   - Under Forward to ZPA Gateway, select the ZPA Gateway created in Step 6.

### Step 8 — ZIA: DNS Control rules

1. Navigate to Policy > DNS Control.
2. Enable the **ZPA Resolver for Locations** rule (for corporate location users).
3. Enable the **ZPA Resolver for Road Warrior** rule (for remote ZCC users).
4. Ensure **ZPA Resolver for Road Warrior** is ordered above **ZPA Resolver for Locations** in rule order. If Road Warrior is disabled, remote user SIPA traffic silently falls under the Locations rule and may egress from the wrong IP pool. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)
5. Review the IP Pools associated with each DNS rule under Administration > IP & FQDN Groups > IP Pool. Edit the pools if needed. Changes to IP pools are reflected in the DNS rule Action column.

### Step 9 — Azure AD: Named Locations

1. In Azure AD (Entra ID), navigate to Security > Named Locations.
2. Create an IP ranges location entry containing the public egress IP(s) of the ZPA App Connectors designated for SIPA. Use the exact IPs or CIDR ranges that the connectors use as their public source address.
3. Mark the location as trusted if the CA policy design requires trusted-location evaluation.

### Step 10 — Azure AD: Conditional Access policy

1. Create or update the Conditional Access policy that governs M365 access.
2. Under Conditions > Locations, configure the policy to apply to traffic outside the Named Locations (for MFA step-up) or to block traffic from outside Named Locations.
3. Ensure the Named Locations entry from Step 9 is included in the trusted/allowed set.

---

## 5. Egress IP stability requirement

The core contract of this integration is that Azure AD's Named Locations entry matches the App Connector's public IP. If that IP changes, Azure AD's CA evaluation fails: the connector's traffic arrives from an unknown IP, triggering MFA step-up or block depending on the CA policy. This is a silent failure from the user's perspective — they receive an authentication prompt or block with no Zscaler-visible error.

**Requirements for egress IP stability:**

- App Connectors used for SIPA should be deployed in environments where the outbound IP is static. Cloud providers assign static Elastic IPs (AWS EIP), reserved public IPs (Azure), or static external IPs (GCP) that persist through VM restarts. Use these, not dynamically assigned public IPs.
- If the connector is behind a NAT gateway (common in cloud VPC deployments), the NAT gateway's IP must be static, not the connector VM's IP directly.
- Multiple connectors in the same SIPA connector group should all egress through the same IP or IP range. If connectors in the group have different egress IPs, all of those IPs must be in the Azure AD Named Locations entry.

**Operational risk of dynamic egress IPs:**

- Cloud VM lifecycle events (instance replacement, autoscaling, re-deployment from an updated image) can cause IP reassignment if static IPs are not locked to the instance.
- If a connector is replaced or redeployed without the same static IP assignment, the Named Locations entry becomes stale. CA policy breaks for all users until an admin updates Azure AD.
- The `app_connector_schedule` automated deletion of inactive connectors can retire a connector VM; if the replacement VM gets a new IP, the same staleness problem occurs.

There is no automated mechanism in ZIA, ZPA, or Azure AD that synchronizes App Connector IPs with Named Locations. This is an operator responsibility. (Tier A — pattern derivable from SIPA mechanics; no vendor doc explicitly specifies IP-change alert automation.)

---

## 6. Failure modes

### 6a. Egress IP not in Named Locations

**Symptom:** Users receive MFA prompts or authentication blocks for M365 apps that previously worked, or always receive unexpected prompts.

**Cause:** The IP Azure AD sees does not match any Named Locations entry. This happens when:
- The App Connector's public IP changed (instance replaced, EIP disassociated, NAT gateway re-provisioned).
- The Named Locations entry was created with the wrong IP.
- A new connector group was added for SIPA but its IPs were not added to Named Locations.
- The Conditional Access policy was modified to require Named Location membership and the SIPA IPs were not included.

### 6b. Traffic took a non-SIPA path

**Symptom:** Azure AD CA blocks or challenges access even though SIPA is configured.

**Cause variants:**

- **ZIA Forwarding Control rule not matching.** If the user, location, or device attributes do not match the rule's source criteria, the rule does not fire and traffic falls through to the default ZIA egress path (PSE IP).
- **DNS resolution bypassed.** If the endpoint is not using ZIA's DNS resolver — for example, if the ZCC client is on Z-Tunnel 1.0 without the `Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors` setting enabled — DNS returns the real Microsoft IP and the ZIA forwarding rule does not match the traffic correctly. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)
- **User is off-network without ZCC.** A user whose ZCC is disabled, not installed, or in bypass mode will reach M365 directly from their ISP IP, not through SIPA.
- **Split-tunnel bypass rule.** If an admin has configured a ZCC split-tunnel bypass rule for `login.microsoftonline.com` or the M365 login domain, those connections bypass ZIA entirely and never reach the SIPA forwarding rule.
- **ZPA Resolver DNS rules disabled or misordered.** If the DNS rules are disabled or the Road Warrior rule is below the Locations rule in order, DNS resolution may not return the ZPA Synthetic IP, causing the forwarding rule to not match.

### 6c. Connector group failover to different-IP connector

**Symptom:** CA authentication intermittently fails or triggers step-up MFA.

**Cause:** ZPA distributes connections across all healthy connectors in a connector group. If connectors in the group have different public egress IPs, connections to M365 login will use varying source IPs. Only the IPs in the Named Locations entry pass CA evaluation cleanly; traffic from connectors with unlisted IPs fails.

Mitigation: ensure all connectors designated for SIPA egress through the same IP or IP range, and that all those IPs are enumerated in Named Locations.

### 6d. ZPA App Connector unhealthy

**Symptom:** M365 login attempts fail entirely (connection errors, not CA blocks).

**Cause:** If all connectors in the SIPA server group are unhealthy or disconnected, ZPA cannot forward the traffic. The ZIA predefined `Fallback mode of ZPA Forwarding` rule may route the traffic to a fallback path, but the fallback path uses PSE IPs, so CA policy evaluation changes. (Tier A — `references/zia/forwarding-control.md`; fallback semantics not source-confirmed at detail level — see deferred items.)

### 6e. ZPA Client Forwarding Policy misconfiguration

**Symptom:** M365 login traffic arrives at the App Connector but with the wrong session context, or ZPA denies access.

**Cause:** If the Client Forwarding Policy is configured for IP-based apps rather than domain-based apps (or vice versa), or the ZIA Service Edge client type rule is missing, ZPA either bypasses the connector or denies access. The ZPA Access Policy must explicitly allow the ZIA Service Edge client type and must not include conflicting user-based criteria. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)

---

## 7. Interaction with M365 sign-in tokens and session continuity

Azure AD Conditional Access evaluates the source IP at authentication time — specifically, at the point where the user authenticates and receives an access/refresh token. After successful authentication, subsequent M365 API calls carry the token; Azure AD does not re-check the source IP on every API call. (Tier A — M365 CA sign-in evaluation model; Azure AD-side behavior, not Zscaler's. Cited from pattern described in `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md` line 17: "After successful authentication, the subsequent application traffic uses an authenticated token to access the actual application and hence does not require being redirected through Source IP Anchoring.")

Implications:

- A user who authenticates successfully through SIPA and receives a token will continue to have functional M365 access even if their subsequent application traffic (Teams, SharePoint, Exchange) takes a different egress path (e.g., routes through PSE directly). The session token is valid regardless of ongoing egress IP.
- If the egress IP changes while a user is mid-session and Azure AD issues a token-refresh challenge (as it does periodically, or on policy-required re-authentication), the new source IP must again be in Named Locations for the re-authentication to succeed.
- Users on Azure AD Continuous Access Evaluation (CAE) may have shorter token lifetimes and more frequent re-authentications, increasing the frequency at which source IP is evaluated. Organizations using CAE with strict IP-binding policies should ensure SIPA coverage is reliable and connector IPs are stable.

The practical implication is that SIPA scope can safely stay narrow (login domains only) without impacting ongoing M365 session traffic — this is the explicit vendor recommendation. However, any re-authentication event (token expiry, forced logout, new conditional access challenge) routes back through `login.microsoftonline.com` and does traverse SIPA again.

---

## 8. Known constraints

### SIPA requires ZPA App Connectors or equivalent as the anchor

SIPA is a forwarding-control mechanism. It requires a ZPA App Connector (customer-deployed VM enrolled in a ZPA tenant) to serve as the egress anchor. The following cannot serve as SIPA anchors:

- **Zscaler Cloud Connector** — the outbound-only workload VM for cloud workloads. The forwarding method for Cloud Connector deployments is `ECZPA`, not `ZPA`. ECZPA does not implement SIPA. (Tier A — `references/zia/forwarding-control.md`)
- **Direct internet bypass** — traffic configured with `forward_method = DIRECT` exits through PSE IPs.
- **Dedicated IP gateway (`ENATDEDIP`)** — routes through a Zscaler-provisioned dedicated egress gateway, not a customer App Connector. While this provides a stable customer-attributable IP, it is a distinct product from SIPA and operates differently. (Tier A — `references/shared/source-ip-anchoring.md`)
- **Branch connector or SD-WAN path** — these are not SIPA egress paths.

If an organization does not have ZPA App Connectors deployed, or does not hold a SIPA subscription, this pattern is not available. A `Dedicated IP (ENATDEDIP)` gateway is an alternative approach for stable IP egress but requires a separate ZIA Dedicated IP SKU.

### The SIPA subscription is separate from ZPA

Deploying App Connectors for SIPA does not require a full ZPA license. The SIPA subscription permits App Connector deployment solely as SIPA egress points. Operators who encounter licensing questions or API `400` errors when configuring SIPA forwarding rules should verify that the tenant has the SIPA add-on, not just ZPA. (Tier A — `vendor/zscaler-help/understanding-source-ip-anchoring.md`)

### Browser Access and Double Encryption are incompatible with SIPA segments

A ZPA Application Segment configured with `Source IP Anchor` enabled cannot simultaneously be configured as a Browser Access segment or have Double Encryption enabled. These mutual exclusions are enforced at save time in the ZPA Admin Portal. Operators should architect segments accordingly. (Tier A — `references/shared/source-ip-anchoring.md`)

### Z-Tunnel 1.0 requires additional toggle

For ZCC users on Z-Tunnel 1.0, SIPA forwarding only applies if `Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors` is enabled in ZIA Advanced Settings. Without this, Z-Tunnel 1.0 users bypass the Forwarding Control evaluation and SIPA does not engage. (Tier A — `vendor/zscaler-help/sipa-microsoft-365-conditional-access-config.md`)

---

## 9. Operational checklist for deployment

Use this checklist before declaring the SIPA M365 CA integration production-ready.

**ZPA side:**
- [ ] App Connector(s) deployed, enrolled, and showing as CONNECTED in ZPA Admin Portal.
- [ ] All SIPA-designated App Connectors have confirmed static public egress IPs or are behind a fixed-IP NAT gateway.
- [ ] Public egress IPs documented in a runbook with change-notification process.
- [ ] M365 login Application Segment created with `Source IP Anchor` enabled and `Bypass = Use Client Forwarding Policy`.
- [ ] Application Segment covers `login.microsoftonline.com`, `login.windows.net`, `login.microsoft.com`, ports 80/443.
- [ ] Client Forwarding Policy: `Bypass ZPA` rule for ZCC client types; `Forward to ZPA` rule for `ZIA Service Edge` client type.
- [ ] Access Policy: `Allow` rule for `ZIA Service Edge` client type; no user-based SAML/SCIM criteria on this rule.
- [ ] Server Group associated with the App Connector Group; Server Group referenced by the ZIA ZPA Gateway.

**ZIA side:**
- [ ] ZPA Gateway created, referencing correct ZPA tenant ID, Server Group, and App Segments.
- [ ] Forwarding Control rule created: `forward_method = ZPA`, pointing at M365 login App Segment and ZPA Gateway.
- [ ] Forwarding Control rule scope (user, location criteria) matches the intended population.
- [ ] DNS Control: `ZPA Resolver for Road Warrior` enabled and ordered above `ZPA Resolver for Locations`.
- [ ] DNS Control: `ZPA Resolver for Locations` enabled.
- [ ] IP Pools associated with the DNS rules verified and correct.
- [ ] For Z-Tunnel 1.0 users: `Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors` is on.

**Azure AD side:**
- [ ] Named Locations entry created with all App Connector egress IPs or CIDRs.
- [ ] Named Locations entry marked as trusted (if CA policy references trusted locations).
- [ ] CA policy updated to reference the Named Locations entry correctly.
- [ ] CA policy tested in report-only mode before enforcing, to confirm the SIPA IP is recognized.

**Validation:**
- [ ] From a ZCC-connected device, authenticate to M365 and confirm no unexpected MFA challenge.
- [ ] Capture the IP seen by Azure AD from the sign-in logs (Azure AD > Sign-in logs > location column) and verify it matches the App Connector egress IP.
- [ ] From an off-network device without ZCC, confirm the CA policy behaves as intended (MFA step-up or block, per design).
- [ ] Verify ZIA Insights or log source shows the M365 login traffic with the SIPA-anchored path (destination: `login.microsoftonline.com`, forward method: ZPA).

---

## 10. Troubleshooting decision tree

**Presenting symptom: M365 sign-in blocked or unexpected MFA for users on ZIA**

```
Is the user's ZCC connected and active?
├── NO → The user is off-network or ZCC is in bypass.
│         SIPA does not apply. Check whether the CA policy
│         intentionally blocks or challenges non-corporate IPs.
│         Resolution: ensure ZCC is active before accessing M365,
│         or adjust CA policy for off-network access intent.
│
└── YES → Identify the source IP Azure AD saw for the failed sign-in.
           (Azure AD Sign-in Logs > Authentication details > IP address)
           │
           ├── IP is a Zscaler PSE IP (verify against Zscaler's published
           │   PSE IP ranges) → SIPA is not firing.
           │   Check:
           │   1. Is the ZIA Forwarding Control rule enabled and ordered
           │      correctly? Does it match this user's location/group?
           │   2. Are the ZIA DNS Control rules (ZPA Resolver for Road
           │      Warrior, ZPA Resolver for Locations) enabled and in
           │      correct order?
           │   3. Is the client on Z-Tunnel 1.0? If so, is
           │      "Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors"
           │      enabled in ZIA Advanced Settings?
           │   4. Is there a split-tunnel bypass rule for login.microsoftonline.com?
           │   5. Is ZCC using a PAC file that bypasses M365 login domains?
           │
           ├── IP is an App Connector IP not in Azure AD Named Locations →
           │   SIPA is working but the Named Locations entry is stale or
           │   incomplete.
           │   Resolution:
           │   1. Confirm the App Connector's current public egress IP
           │      (check from the connector host or cloud provider console).
           │   2. Update the Azure AD Named Locations entry to include
           │      the current IP.
           │   3. Review connector group for any recently replaced
           │      connectors with new IPs.
           │
           ├── IP is the correct App Connector IP (in Named Locations) →
           │   The CA policy is not matching Named Locations as expected.
           │   Check:
           │   1. Is the Named Locations entry marked as trusted, and does
           │      the CA policy reference it in the correct condition?
           │   2. Is the Azure AD CA policy in report-only vs enforce mode?
           │   3. Are there overlapping CA policies applying stricter rules?
           │
           └── IP is the user's ISP/raw IP → ZCC is installed but not
               tunneling M365 login traffic.
               Check:
               1. Is the Forwarding Control rule scoped to specific locations
                  or user groups that exclude this user?
               2. Is there an exclude or bypass entry for this user?
               3. Is ZCC App Profile configured to bypass M365?
```

**Secondary symptom: M365 sign-in fails entirely (connection error, not auth error)**

Check:
1. Are App Connectors in the SIPA connector group CONNECTED in ZPA Admin Portal?
2. Can the App Connector VM make outbound HTTPS to `login.microsoftonline.com`? (Check connector host's egress firewall rules.)
3. Is there a ZPA Access Policy rule inadvertently blocking ZIA Service Edge client type for the M365 segment?
4. Does the ZPA Access Policy for the M365 segment contain user-based SAML/SCIM criteria that is blocking the ZIA Service Edge identity?

---

## 11. Cross-links

- SIPA primitive mechanics — [`./source-ip-anchoring.md`](./source-ip-anchoring.md)
- ZIA Forwarding Control rule configuration and forward_method values — [`../zia/forwarding-control.md`](../zia/forwarding-control.md)
- ZPA App Connector deployment, groups, provisioning keys — [`../zpa/app-connector.md`](../zpa/app-connector.md)
- ZPA Application Segments (Source IP Anchor flag, mutual exclusions) — [`../zpa/app-segments.md`](../zpa/app-segments.md)
- ZPA policy precedence (country-code criterion uses PSE IP, not user IP, for SIPA traffic) — [`../zpa/policy-precedence.md`](../zpa/policy-precedence.md)
