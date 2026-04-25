# What Is Microsegmentation? | Zscaler

**Source:** https://help.zscaler.com/zpa/what-is-microsegmentation
**Captured:** 2026-04-24 via Playwright MCP.

---

Zscaler Microsegmentation is a platform within the Zscaler Admin Console that provides the capability to visualize traffic flows within private applications and segment them on a fractional level, reducing the attack surface and preventing lateral movement of any threats on your network. It is a multi-tenant software-as-a-service solution optimized for security, reliability, and scale, using a system divided into the Zscaler cloud and deployed agents. The Zscaler cloud and agents work together to collect and analyze application flow and telemetry data and also monitor the health of all managed systems.

The deployed agents sit on Windows or Linux hosts in your environment and collect information about application activity. Agents are deployed to your servers, whether they are virtual or physical, cloud based, or in your data center. The agents are responsible for downloading the latest access policies from the Zscaler cloud and translating them to rules that are specific to local OS enforcement points (e.g., Windows Filtering Platform and Linux nftables). You can create agent groups and AppZones that group together specific machines and their applications that you want to monitor for certain data flows.

You can enable Microsegmentation for organizations that have Zscaler Private Access (ZPA). The backend framework is hosted and managed by the Zscaler cloud and is available across the US region. The data collection is localized to the region of choice of the administrator, and the data retention cycle is a 14-day rolling period. You can deploy the managed resources to any other region. The installed agents operate in continuous mode.

If you want Microsegmentation provisioned for your organization, contact your Zscaler Account team.

## Related Articles
- What Is Microsegmentation?
- Supported Versions & OS Compatibility for Microsegmentation
