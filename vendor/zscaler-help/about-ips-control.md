# About IPS Control

**Source:** https://help.zscaler.com/zia/about-ips-control
**Captured:** 2026-04-24 via Playwright MCP.

---

Zscaler's Intrusion Prevention System (IPS) uses **signature-based detection** to monitor and protect your network traffic from intrusion over all ports and protocols. Zscaler's IPS Control uses IPS signature rules built and updated by Zscaler's security research team, as well as signatures from industry-leading vendors.

In addition to the signatures used by Zscaler, you can create and deploy **custom IPS signatures** that are specific to your organization's requirements without requiring any additional infrastructure. These signatures should be part of the IPS Control policy using threat categories to be enforced on traffic.

The Zscaler service monitors your traffic in real time using these signatures. As soon as the IPS has examined the contents of your traffic and found a pattern match, it can enforce your security policies inline.

## Benefits

- Use signature-based detection to monitor your network traffic for malicious activities and prevent attacks by enforcing policies in real time.
- Define granular IPS Control rules using conditions: users, groups, departments, locations, threat categories, network services, source IP addresses, destination IP addresses/FQDNs, etc.
- Zscaler provides a **default IPS rule that blocks all traffic**. You can create granular policies of higher precedence (higher admin rank) to explicitly allow specific traffic (e.g., IT Security group traffic matching threats) while blocking all other traffic via the default rule.
- Enforce condition-based actions: allow or block traffic. You can also configure rules to allow specific types of traffic to bypass Zscaler's IPS.
- Use custom IPS signatures built using **industry-standard Snort-like syntax** to detect and mitigate threats specific to your organization's environment and threat landscape.
- Leverage Zscaler logs to investigate threats and build telemetry data for external SIEM tools.

## Protocol coverage

IPS Control enables you to defend your organization against threats from both web traffic and non-web traffic: **HTTP, HTTPS, FTP, DNS, TCP, UDP, and IP-based ports and protocols**.

## Enablement

- IPS Control policies are enabled per-location — see *Enabling the Firewall for Locations*.
- If your organization uses **Z-Tunnel 1.0 or PAC files** to route traffic, ensure that the firewall is enabled for this type of traffic in the Advanced Settings.

## Logging

Threats detected in your network traffic are displayed under **Firewall Insights > Logs**. Threats detected in web-only traffic also appear on the **Security Dashboard**.

## Licensing prerequisite and evaluation order

**IPS Control is available only with Advanced Firewall.**

If you have IPS Control as well as **Advanced Threat Protection (ATP)**, **rules created for Advanced Threat Protection are evaluated first.**

## The IPS Control page (Policy > IPS Control)

You can:

- Configure an IPS Control rule.
- View the recommended IPS Control policy.
- Select a View By option:
  - **Rule Order** — rules listed in ascending rule-order.
  - **Rule Label** — rules grouped by label; expand/collapse all.
- Search for an IPS Control rule.
- Modify the table and its columns.
- Edit, duplicate, or delete a rule.

### Per-rule columns

- **Rule Order** — evaluated in ascending numerical order.
- **Admin Rank** — visible only if admin ranking is enabled in Advanced Settings.
- **Rule Name**.
- **Criteria** — description of the criteria on the rule.
- **Action**.
- **Label and Description**.
