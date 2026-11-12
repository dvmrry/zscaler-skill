# Zscaler platform pillars: Zero Trust Exchange, Data Fabric for Security, Agentic SecOps and the customer-segment framing (portfolio.platform)
Also called: zero trust exchange; zte; zscaler zte; zero trust exchange platform; data fabric; data fabric for security; avalor; agentic secops; agentic soc; architectural pillars; platform pillars; zero trust for users; zero trust for workloads; zero trust for branch; zero trust for b2b

Zero Trust Exchange, Data Fabric for Security and Agentic SecOps are marketing pillars, not products; the customer-segment framing sits beside them.

## Zero Trust Exchange

The Zero Trust Exchange page calls the Zero Trust Exchange a comprehensive, integrated platform that enables zero trust security and network transformation for all users, workloads, IoT/OT and B2B partners; it says Zscaler's proxy architecture enables full TLS/SSL inspection at scale and that one-to-one connections are brokered between users and applications based on identity, context and business policies. [portfolio.platform:zte-platform] The Zero Trust Exchange page's Our Zero Trust Approach section lists Verify Identity, Determine Destination, Assess Risk and Enforce Policy. [portfolio.platform:zte-model] The Zero Trust Exchange page's Assess risk entry says it uses AI to determine risk based on context, considering factors like user behavior, device posture, destination and content, third-party intel and more than 500 trillion daily signals. [portfolio.platform:zte-signals]

The Zero Trust Exchange page's Recognition section says 50%+ of the Fortune 500 are Zscaler customers and cites Leader in the 2025 Gartner Magic Quadrant for SSE. [portfolio.platform:zte-market] The Zero Trust Exchange page's Use cases section lists fast, secure and reliable access to the internet, SaaS and private apps for your people; securing workload communications and protecting data at rest within clouds and SaaS apps; IoT device discovery, zero trust connectivity for IoT/OT and privileged remote access to OT; and least-privileged access to SaaS and private apps for business partners. [portfolio.platform:zte-use-cases]

Whether the platform is a unified policy and enforcement plane under every product is open [gap:portfolio.platform:zte-plane].

## Data Fabric for Security

The Data Fabric for Security page says the Data Fabric aggregates and unifies data across all your security tools and business systems. [portfolio.platform:dfs-what] The Data Fabric for Security page says it connects to 150 pre-built inbound and outbound integrations and that new connectors can be developed in one to two weeks on customer request. [portfolio.platform:dfs-integrations] The Data Fabric for Security page lists, with links to CTEM, Asset Exposure Management and Unified Vulnerability Management, a complete view of exposure to drive continuous threat exposure management programs, a complete, accurate and context-rich asset inventory, and accurate vulnerability analysis and risk-based prioritization. [portfolio.platform:dfs-targets] Whether it is built on Avalor technology from a Zscaler acquisition is open [gap:portfolio.platform:dfs-avalor].

The Data Fabric for Security page says the Data Fabric serves as the foundation for the Zscaler Exposure Management portfolio and powers several of the portfolio's products today, naming Asset Exposure Management and Unified Vulnerability Management. [portfolio.platform:dfs-exposure] The Exposure Management products themselves are in [Asset Exposure Management (AEM): the asset inventory, coverage gaps and policies, and what can be automated](kb:aem.overview), [Unified Vulnerability Management (UVM): what it does with findings, and what can be automated](kb:uvm.overview), [Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated](kb:risk360.overview) and [EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages](kb:easm.findings).

## Agentic SecOps

The security operations page is headlined "Outpace AI-Driven Attacks with Agentic SecOps" and says Zscaler's AI agents, trained on over a decade of frontline SOC, MDR and threat hunting experience, provide triage, investigation, verdicts and response recommendations. [portfolio.platform:agsecops-what] The security operations page's FAQ says Zscaler AI agents are trained and tuned on over a decade of real-world threat hunting, MDR investigations and ThreatLabz research, and that, fusing insights from Red Canary MDR operations and 750+ billion daily Zero Trust Exchange transactions, they deliver high context accuracy and reliable remediation recommendations. [portfolio.platform:agsecops-accuracy] Whether Zscaler markets a 99.7% accuracy or 10× speed figure for it is open [gap:portfolio.platform:agsecops-figures].

How Agentic SecOps sits across the suite is in [Security Operations suite: Exposure Management, Threat Management, Red Canary MDR, managed threat hunting and CTEM](kb:portfolio.security-operations).

## Customer segments

The four-pillar segment framing is resolved [gap:portfolio.platform:segment-pillars]: the page has no Branch pillar, and it lists use cases instead [portfolio.platform:zte-use-cases]. The B2B segment is in [Zero Trust Exchange for B2B: site-to-site, partner and B2C access to private applications](kb:portfolio.b2b).

What to check:
1. For a question about what the platform unifies, answer from the platform claims and do not extend them to a policy plane under every product.
2. For a question about Agentic SecOps accuracy, present the page's accuracy wording as what Zscaler markets or claims, not as measured fact, and do not cite the 99.7% figure, which the current page does not state.

Not known (open gaps):
- Whether the Zero Trust Exchange is a unified policy and enforcement plane under every product [gap:portfolio.platform:zte-plane]: settled by source-read
- Whether the Data Fabric for Security is built on Avalor technology [gap:portfolio.platform:dfs-avalor]: settled by source-read
- Whether Zscaler markets a 99.7% threat accuracy figure or a 10× speed figure for Agentic SecOps [gap:portfolio.platform:agsecops-figures]: settled by source-read

Area: portfolio.platform, its subjects in references/_meta/spine/portfolio/portfolio.platform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/aem/aem.overview.md (Asset Exposure Management (AEM): the asset inventory, coverage gaps and policies, and what can be automated)
- links-to references/_meta/text/easm/easm.findings.md (EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages)
- links-to references/_meta/text/portfolio/portfolio.b2b.md (Zero Trust Exchange for B2B: site-to-site, partner and B2C access to private applications)
- links-to references/_meta/text/portfolio/portfolio.security-operations.md (Security Operations suite: Exposure Management, Threat Management, Red Canary MDR, managed threat hunting and CTEM)
- links-to references/_meta/text/risk360/risk360.overview.md (Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated)
- links-to references/_meta/text/uvm/uvm.overview.md (Unified Vulnerability Management (UVM): what it does with findings, and what can be automated)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.cloud-architecture.md (Zscaler cloud architecture)
- see-also references/_meta/text/portfolio/portfolio.secops-platform.md (The Agentic SecOps Platform under AEM, UVM, Agentic SOC and Identity Protection: data fabric, data sources and the Reporting API)
