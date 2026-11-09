# Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with (breach-predictor.overview)
Also called: breach predictor; zscaler breach predictor; breach probability score; overall breach probability; breach predictor siem; breach predictor splunk; breach predictor integrations; breach predictor api; predr

Breach Predictor anticipates threats, provides context about them, and helps prevent threat actors from accessing sensitive data; its benefits are listed as Enhanced Attack Visibility, Proactive Breach Risk Reduction and Improved Security Posture. [breach-predictor.overview:what-it-is] It is designed to supplement, rather than replace, reactive security tools. [breach-predictor.overview:supplements]

**Data it reads.** Its data sources are logs from ZIA, Zscaler Sandbox and CrowdStrike, ThreatLabz threat intelligence focused on attack indicators, and existing policy recommendations based on peers and best practices. [breach-predictor.overview:data-sources] It uses generative AI to find patterns, new threats and indicators of compromise, and gives a probability for where threats will move. [breach-predictor.overview:generative-ai]

## How it shows risk

It uses machine learning to give real-time insight into threat activity affecting users, mapped to MITRE ATT&CK techniques, from Zscaler and third-party data. [breach-predictor.overview:mitre-mapping] MITRE ATT&CK techniques map to four attack stages: Discover Attack (Reconnaissance, Resource Development), Compromise (Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion), Lateral Movement (Credential Access, Discovery, Lateral Movement, Collection) and Data Loss (Command and Control, Exfiltration, Impact). [breach-predictor.overview:stage-mapping] The Dashboard's Overall Breach Probability score takes into account the number of observed malware families, their position on the MITRE ATT&CK matrix and the number of affected users; a higher score means a higher probability of a breach. [breach-predictor.overview:breach-probability] See [On the Dashboard page, the Overall Breach Probability score factors in the organization's placement in the MITRE ATT&CK matrix and the number of affected users; a higher score indicates a higher risk of a data breach.](kb:breach-predictor.dashboard:score-inputs). The Dashboard's main Sankey chart shows how many users are at risk, which threats affect them, and which attack stage they are likely in. [breach-predictor.overview:sankey] It focuses on the attack path instead of on individual users and individual alerts; for example, it aggregates all users exposed at a suspect URL. [breach-predictor.overview:attack-path]

**Acting on it.** The portal's pages include the Dashboard (Overall Breach Probability score and a list of the highest-value policy updates), Findings (malware families and affected users, with attack-path data), Users (by department, threat type and region) and Threat Landscape (ThreatLabz data about the biggest current security threats). [breach-predictor.overview:pages] It provides threat context and information about the specific policies that enabled the activity, so that problem policies can be fixed before threats move to the next stage. [breach-predictor.overview:policy-context] Findings may call for policy remediation (for example File Type Control, SSL Inspection, URL Filtering), planned from right to left in the MITRE ATT&CK matrix, and the policy recommendations can be logged as Jira tickets. [breach-predictor.overview:remediation-workflow]

## Integrations

- **SIEM.** Event data can be sent to CrowdStrike Next-Gen SIEM or Splunk; once the integration is configured, every new event on the tenant is sent automatically. [breach-predictor.overview:siem-forwarding] The Splunk integration uses an HTTP Event Collector token and an index; because events are shared as JSON, the Splunk URL must include an endpoint parameter such as /services/collector/event, and without a specified index Splunk uses a pre-existing one. [breach-predictor.overview:splunk-json] On integration Breach Predictor sends all available event data to CrowdStrike Next-Gen SIEM, but events older than that SIEM's default retention (7 to 14 days) are not available there; the CrowdStrike side uses a connector with a JSON parser, whose generated API key and API URL are entered in Breach Predictor. [breach-predictor.overview:crowdstrike-retention]
- **Ticketing.** Ticketing integrations include Jira and ServiceNow, each configured with a Domain Key and Token Key; to receive the Domain Key and Token Key for your organization, the page says to contact your Zscaler Account team. [breach-predictor.overview:ticketing]
- **Zscaler Sandbox.** The Zscaler Sandbox integration takes a Secret Key, provided by the account team, that lets Breach Predictor access the organization's Sandbox tenant. [breach-predictor.overview:sandbox]

## Page-level reference

[Breach Predictor portal: licensing, ZIA prerequisite, sign-in, profile and theme](kb:breach-predictor.portal), [Breach Predictor Dashboard views and the Threat Landscape page](kb:breach-predictor.dashboard), [Breach Predictor Findings: the MITRE ATT&CK Mapping page, the Threat page, severity scores and attack stages](kb:breach-predictor.findings), [Breach Predictor Events page and User Threat Profile page: filters, columns and detail panels](kb:breach-predictor.events-and-users), [Breach Predictor Request and Support tickets: how they are created and what the Tickets page lists](kb:breach-predictor.tickets) and [Breach Predictor AI Assist dashboard and its AI agents](kb:breach-predictor.ai-assist).

It is part of the SecOps platform's preemptive detection strategy with Deception: [The platform natively integrates External Attack Surface Management, whose scanned assets and findings are merged into AEM and UVM, and integrates with Zscaler Deception and Breach Predictor for Preemptive Detection and Response.](kb:portfolio.secops-platform:easm-and-predr).

## Automation

No vendored client covers Breach Predictor: the Go and Python SDKs, the Terraform providers, the Ansible collections, the MCP server, the OneAPI Postman collection and the captured Automate contract have no Breach Predictor service. [breach-predictor.overview:no-client-surface] Any API beyond these push integrations is open [gap:breach-predictor.overview:api-surface].

What to check:
1. For Breach Predictor events in a SIEM, use the SIEM integration (CrowdStrike Next-Gen SIEM or Splunk HEC), which pushes every new event; no pull API is documented.
2. When older Breach Predictor events are missing from CrowdStrike Next-Gen SIEM, compare their age with that SIEM's retention period.
3. Whether the Splunk URL in the integration ends with a JSON event endpoint such as /services/collector/event.

Inferred, not quoted (say so when an answer rests on one):
- [breach-predictor.overview:no-client-surface] Tier B: Rests on an absence. The Python README's product list (introduced by the quoted line) names no Breach Predictor API, and at the pins `git grep -i -E 'breach.?predictor'` finds nothing in the Go or Python SDKs, the ZIA, ZPA, ZCC or ZTC providers, the Ansible collections or the MCP server; the Postman collection has no match.

Not known (open gaps):
- Whether Breach Predictor has an API beyond its push integrations [gap:breach-predictor.overview:api-surface]: settled by source-read or support-ticket. Blocks: pulling breach probability or findings programmatically, or parsing its SIEM events

Area: breach-predictor.overview, its subjects in references/_meta/spine/breach-predictor/breach-predictor.overview.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/breach-predictor/breach-predictor.dashboard.md (Breach Predictor Dashboard views and the Threat Landscape page)
- depends-on references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named): Its data sources are logs from ZIA, Zscaler Sandbox and CrowdStrike, ThreatLabz threat intelligence focused on attack indicators, and existing policy recommendations based on peers and best practices. [breach-predictor.overview:data-sources]
- depends-on references/_meta/text/zia/zia.sandbox.md (ZIA Sandbox): The Zscaler Sandbox integration takes a Secret Key, provided by the account team, that lets Breach Predictor access the organization's Sandbox tenant. [breach-predictor.overview:sandbox]
- links-to references/_meta/text/breach-predictor/breach-predictor.ai-assist.md (Breach Predictor AI Assist dashboard and its AI agents)
- links-to references/_meta/text/breach-predictor/breach-predictor.events-and-users.md (Breach Predictor Events page and User Threat Profile page: filters, columns and detail panels)
- links-to references/_meta/text/breach-predictor/breach-predictor.findings.md (Breach Predictor Findings: the MITRE ATT&CK Mapping page, the Threat page, severity scores and attack stages)
- links-to references/_meta/text/breach-predictor/breach-predictor.portal.md (Breach Predictor portal: licensing, ZIA prerequisite, sign-in, profile and theme)
- links-to references/_meta/text/breach-predictor/breach-predictor.tickets.md (Breach Predictor Request and Support tickets: how they are created and what the Tickets page lists)
- links-to references/_meta/text/portfolio/portfolio.secops-platform.md (The Agentic SecOps Platform under AEM, UVM, Agentic SOC and Identity Protection: data fabric, data sources and the Reporting API)
