# About FTP Control

**Source:** https://help.zscaler.com/zia/about-ftp-control
**Captured:** 2026-04-24 via Playwright MCP.

---

By default, the Zscaler service doesn't allow users from a location to upload or download files from FTP sites that use **FTP over HTTP**. Only native FTP traffic is allowed. With FTP Control, Zscaler provides access control for both native FTP and FTP over HTTP traffic. This can be particularly useful if you are using a Zscaler Client Connector (formerly known as Zscaler App or Z App) or PAC based deployment, as they only support FTP over HTTP traffic. FTP Control also **extracts files and runs a security scan**.

## Benefits

- Manage your organization's FTP traffic by monitoring users' access to FTP servers using FTP (passive FTP only), FTPS, and FTP over HTTPS protocols.
- Inspect FTP traffic — passive FTP, FTPS, and FTP over HTTPS — and protect the traffic against malicious software using the Malware Protection policy.
- Control FTP traffic using protocol-based conditions in Data Loss Prevention (DLP), Sandbox, File Type Control, URL Filtering, and Bandwidth Control policies.
- Complete FTP logging in Firewall Insights.

## Multiple levels of FTP Control

1. **FTP Control policy** — allow access to specific FTP sites.
2. **Malware Protection** — scan FTP over HTTP and native FTP traffic in real time.
3. **DLP / Sandbox / File Type Control / URL Filtering / Bandwidth Control** — configure rules using protocol-based conditions (FTP over HTTP and native FTP).

## Constraints

- **Service supports passive FTP only.** If the destination server does not support passive FTP, the service generates an alert message in the end user's browser.
- **FTPS (FTP over TLS) supported in passive mode** — implicit or explicit. For explicit FTPS, set a proxy in the FTP client.
- **URL Filtering policy rules take precedence over FTP Control policy.**
- FTP Control policy applies to traffic from **known locations**. Supports FTP over HTTP via dedicated ports for remote users.

## Where it sits

**Firewall module** — Policies > Firewall > FTP Control. Part of the firewall's traffic-control capabilities; evaluates before web-module policies for non-web FTP traffic.
