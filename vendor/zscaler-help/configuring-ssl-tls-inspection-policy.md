# Configuring SSL/TLS Inspection Policy

**Source:** https://help.zscaler.com/zia/configuring-ssltls-inspection-policy
**Captured:** 2026-04-23 via Playwright MCP.

---

Internet & SaaS (ZIA) Help — Policies — SSL/TLS Inspection — Configuring SSL/TLS Inspection Policy

You can configure Secure Sockets Layer (SSL)/Transport Layer Security (TLS) Inspection policies to perform scanning of the SSL/TLS traffic based on the source and destination of the traffic. Using these policies, you can simplify the deployment and ongoing operations of SSL/TLS Inspection and address the compliance and operational environmental requirements.

## Policy Execution

The SSL/TLS Inspection rules consist of a series of logical operators between their criteria. The rules are triggered based on the result of the following logical operations between the criteria:

```
Source IP Groups (AND) [URL Categories (OR) Cloud Applications (OR) Destination Groups (OR)
Forwarding Gateways] (AND) ZPA Application Segment (AND) [Location Groups (OR) Locations] (AND)
[Users (OR) Groups (OR) Departments] (AND) [Device Groups (OR) Devices (OR) Remote Users with Kerberos]
(AND) Device Trust Level (AND) CONNECT User-Agent
```

## Rule attributes

- **Rule Order**: Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2, and so on), and the rule order reflects this rule's place in the order. You can change the value, but if you've enabled admin rank, your assigned admin rank determines the rule order values you can select.
- **Admin Rank**: Enter a value from 0 to 7 (0 is the highest rank). Your assigned admin rank determines the values you can select. You cannot select a rank that is higher than your own. The rule's admin rank determines the value you can select in the rule order, so that a rule with a higher admin rank always precedes a rule with a lower admin rank.
- **Rule Name**: Enter a user-friendly name for the rule. The maximum length is 31 characters.
- **Rule Status**: Enable this option to actively enforce the rule. Disabling this option does not actively enforce the rule, and the service skips it and moves to the next rule. However, the rule does not lose its place in the rule order.
- **Rule Label**: Select a rule label to associate it with the rule.

## Criteria notes

- **Destination Groups**: supported group types are IP, FQDN, and Wildcard FQDN. Countries and custom categories configured in destination groups are ignored. **During policy evaluation, IP address-based destination groups in the rule criteria are ignored if an SNI value is present in HTTPS requests.**
- **ZPA Application Segment**: The list displays only those ZPA application segments that have the Source IP Anchor option enabled. Select up to 255.
- **Locations / Location Groups / Users / Groups / Departments**: up to 32 each (contact Zscaler Support to increase limits).
- **Remote Users with Kerberos**: applies only to remote user traffic with Kerberos authentication, forwarded via PAC files (not via Zscaler Client Connector).
- **Device Trust Level**: High Trust / Medium Trust / Low Trust only apply to Zscaler Client Connector traffic. Unknown applies to all traffic.
- **CONNECT User-Agent**: applies only to SSL/TLS traffic forwarded in explicit proxy mode (PAC or PAC over tunnel). Not applied to traffic forwarded via transparent proxy (tunnel) or Z-Tunnel 1.0 due to lack of user-agent context.

## Action: Inspect

- **Override Default Intermediate CA Certificate**: Select Yes to override the default intermediate CA certificate.
- **Intermediate CA Certificate**: Choose an intermediate CA from the list (only if Override is Yes).
- **Untrusted Server Certificates**: three options —
  - **Allow**: service allows access; warnings only on expired certificates.
  - **Pass Through**: certificate warnings displayed; user can proceed.
  - **Block**: blocks access to sites with untrusted certificates.
- **Block No Server Name Indication (SNI)**: Enable to block any traffic that does not contain the SNI in the Client Hello message. Disabled by default.
- **OCSP Revocation Check**: Enable to include certificate revocation check in untrusted server certificate validation. Uses OCSP. On OCSP failure, action is determined by the Untrusted Server Certificates setting.
- **Block Undecryptable Traffic**: Enable to block traffic from servers using non-standard encryption methods or requiring mutual TLS authentication.
- **Minimum Client TLS Version** / **Minimum Server TLS Version**: blocks connections below threshold.
- **Enable HTTP/2**: Enable to make HTTP/2 the web protocol. Available only if enabled for the organization. Does not work for a location if Bandwidth Control is enabled on that location — service falls back to HTTP/1.1.

## Action: Do Not Inspect

Two sub-variants:

- **Evaluate Other Policies** — configurable sub-settings:
  - Untrusted Server Certificates: Allow (browser sees invalid-cert warning) / Block (resets TCP connection).
  - Block No SNI: same as above.
  - Show Notifications for Blocked Traffic: if enabled, display EUN for traffic blocked by other web policies. Requires Zscaler or enterprise root CA in client truststore to avoid invalid-cert warning. If disabled, service resets connection with generic failed-connection message.
  - Show Notification for ATP Blocks: available only when Show Notifications for Blocked Traffic is enabled.
  - Override Default Intermediate CA Certificate / Intermediate CA Certificate: available only with Show Notifications enabled.
  - OCSP Revocation Check: uses OCSP stapling; on failure, action follows Untrusted Server Certificates.
  - Minimum TLS Version: blocks below threshold.
- **Bypass Other Policies** — "bypasses web policies (URL Filtering and Cloud App Control) for the TLS traffic." No further sub-configuration.

## Action: Block

- **Show End User Notifications**: Enable to display EUN. Requires root CA in truststore. Disabled = resets connection with generic message.
- **Override Default Intermediate CA Certificate** / **Intermediate CA Certificate**: available only with Show End User Notifications enabled.
