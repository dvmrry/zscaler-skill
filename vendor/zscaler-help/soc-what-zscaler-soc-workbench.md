# What Is Zscaler SOC Workbench?

**Source:** https://help.zscaler.com/soc-workbench/what-zscaler-soc-workbench
**Captured:** 2026-04-28 via Playwright MCP

---

Security Operations Center (SOC) teams face a daily battle, wading through endless alerts coming from disparate tools—networks, endpoints, cloud environments, email security applications, identity platforms, and more. Bringing together all of these isolated alerts to understand the full picture of an attack is challenging, tedious, and often error prone. As a result, SOC analysts are overwhelmed with alert fatigue, wasting precious time chasing false positives instead of remediating real threats.

SOC Workbench provides rich, context-driven data to help your SOC teams achieve faster, more efficient, and more confident threat detection and response. SOC Workbench is a unified platform to prioritize and triage threats so that you can rapidly resolve business-critical incidents. Unlike other tools that simply provide a list of incidents, SOC Workbench provides risk-based prioritization that focuses not only on a threat but also its business context. Additionally, SOC Workbench uses advanced AI-driven capabilities to seamlessly narrow gaps between proactive threat detection and reactive incident response.

## Key Benefits

- **Risk-Based Threat Prioritization**: Consolidates business intelligence and threat context to help you understand all critical threats in your environment.
- **Automated Correlation**: Ties multiple alerts into threats by correlating and aggregating entities to drive historical attack patterns and contextual data.
- **Built-In Context Enrichment**: Provides deeper insights into each alert with information such as geographic locations, user roles, asset criticality, vulnerability data, and threat intelligence.
- **Efficiency Gains with Actionable Incidents**: Focuses analyst time on business-critical threats, reducing noise around alerts to drive quicker remediation.
- **Proactive Attack Prediction**: Surfaces attack paths with related Indicators of Compromise and possible attack progressions, allowing analysts to stop threats before they lead to a data breach.

# Understanding Zscaler SOC Workbench

**Source:** https://help.zscaler.com/soc-workbench/understanding-zscaler-soc-workbench
**Captured:** 2026-04-28 via Playwright MCP

---

Zscaler SOC Workbench is specifically built to eliminate gaps that traditional Security Operations Center (SOC) tools ignore. Powered by the Zscaler Data Fabric for Security, SOC Workbench transforms isolated alerts from across your security stack into a prioritized, holistic view of threats. Seamless integration with the Zero Trust Exchange (ZTE) platform provides additional threat context and initiates inline controls to automatically mitigate risk.

As part of the Zscaler Security Operations (SecOps) portfolio, SOC Workbench also connects exposure insights with threat prioritization, ensuring that vulnerable assets and identities are factored into weighted results. It also enables the real-world threat activity that your SOC team sees to inform which vulnerabilities they should address first.

At a high level, SOC Workbench provides three main value propositions:

1. **It unifies all alerts**: SOC Workbench lets you track not only Zscaler alerts, but also alerts from third-party applications (e.g., Gmail, CrowdStrike) in a single console, unifying alerts from disparate sources with rich context.
2. **It focuses on threats, not alerts**: SOC Workbench's AI-driven threat analysis transforms raw alerts into contextualized, actionable threats. SOC Workbench focuses on providing the right business context, understanding the threats associated with alerts, and leveraging historical attack patterns to identify the first 5 things you must address in your environment.
3. **It helps stop the biggest threats**: With the ability to accelerate investigations by providing all threat details on a single page, as well as the ability to search logs from one unified location, understand the asset impact within the same screen, streamline investigations, and enable faster, better, and proportional responses.

## Core Day-to-Day Capabilities

- Ingesting Vast Amounts of Data
- Providing Enriched Alerts
- Correlating Alerts
- Prioritizing Actionable Threats
- Facilitating Investigation
- Driving Resolution

## Data Sources / Connectors

The platform supports connectors for: CrowdStrike, CrowdStrike Identity Protection, Microsoft Defender for Cloud, Microsoft Defender for Endpoint, Microsoft Entra ID, SentinelOne, Snyk, Wiz, Azure Blob, Azure Cloud Assets, ZCC Devices, ZIA Devices and Users, AnySource (generic file ingestion via AWS S3, GCP, webhook, upload file API).

## Outegrations (SOC Workbench term for outbound integrations)

Jira, ServiceNow (with webhook support).

## Key Platform Concepts

- **Data Unification**: Entity resolution and field normalization across disparate sources
- **Suppression Rules**: Filter out known-good or low-fidelity alerts
- **Incident Rules**: Correlate alerts into higher-level incidents
- **Alert Scores**: Configurable scoring system
- **Custom Dashboards**: Widget-based dashboards with templates
- **Queries Library**: Saved searches for log analysis
- **Report Export via API**: `Triggering Report Export Through an API` is a documented capability
