# Security Operations suite: Exposure Management, Threat Management, Red Canary MDR, managed threat hunting and CTEM (portfolio.security-operations)
Also called: security operations; security operations suite; secops suite; secops; exposure management; exposure management suite; threat management; ctem; continuous threat exposure management; mdr; red canary; red canary mdr; managed threat hunting; threat hunting; agentic soc

The security operations page says Zscaler connects exposure management and threat management in a single platform, and that Zscaler Agentic SecOps applies unified threat and exposure management, zero trust telemetry, agentic workflows and closed-loop enforcement to transform security operations. [portfolio.security-operations:suite-brand] Whether EASM is a component of the suite rather than a standalone product is open [gap:portfolio.security-operations:easm-placement].

## Exposure Management

The page's Exposure Management tab says Zscaler Exposure Management correlates data across Zscaler telemetry and third-party security tools to maintain a trusted asset inventory, prioritize critical exposures with business context and orchestrate AI-driven remediation workflows, and lists its key offerings as Complete Asset Inventory, Unified Exposure Prioritization, KPI and SLA Reporting, AI-Powered Remediation Workflows, Identity Risk Visibility and SOC Alert Prioritization with Exposure Context. [portfolio.security-operations:exposure-components] The Data Fabric page names Asset Exposure Management and Unified Vulnerability Management among the Exposure Management portfolio products [The Data Fabric for Security page says the Data Fabric serves as the foundation for the Zscaler Exposure Management portfolio and powers several of the portfolio's products today, naming Asset Exposure Management and Unified Vulnerability Management.](kb:portfolio.platform:dfs-exposure); which products make up the portfolio is open [gap:portfolio.security-operations:exposure-members]. The UVM marketing page's Product Details include a CTEM accelerator section that says "Build and scale your continuous threat exposure management program with ease." [portfolio.security-operations:uvm-ctem] What the CTEM program spans is open [gap:portfolio.security-operations:ctem-scope].

Whether CTEM stages map onto the suite's products is open [gap:portfolio.security-operations:ctem-stages]. Whether customers buy CTEM as a bundle is open [gap:portfolio.security-operations:ctem-bundle]. Whether CTEM has an SDK of its own is open [gap:portfolio.security-operations:ctem-sdk].

The product entries are [Asset Exposure Management (AEM): the asset inventory, coverage gaps and policies, and what can be automated](kb:aem.overview), [Unified Vulnerability Management (UVM): what it does with findings, and what can be automated](kb:uvm.overview), [Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated](kb:risk360.overview) and [EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages](kb:easm.findings); the shared data layer is in [The Agentic SecOps Platform under AEM, UVM, Agentic SOC and Identity Protection: data fabric, data sources and the Reporting API](kb:portfolio.secops-platform).

## Threat Management

The page's Solution Details tabs are Agentic SOC, Deception, Exposure Management, Threat Hunting and Managed Detection and Response; it describes Deception as realistic decoys and lures spanning endpoints, cloud, identity and AI environments. [portfolio.security-operations:threat-components] The page's Threat Hunting tab says Zscaler Threat Hunting leverages first-party ZIA telemetry to reveal covert adversary behavior hiding inside trusted traffic, and lists Continuous Expert-Led Hunting: 24/7 proactive hunting for anomalies and advanced threats across internet and SaaS traffic. [portfolio.security-operations:mth-hunting] Deception's product entry is [Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated](kb:deception.overview).

Whether managed threat hunting targets TTPs that automated detection misses is open [gap:portfolio.security-operations:mth-scope]. Whether it is the human-expertise component within Red Canary MDR is open [gap:portfolio.security-operations:mth-within-mdr]. Whether it is delivered only as a managed service through the account team is open [gap:portfolio.security-operations:mth-delivery].

The page says that in Zscaler Managed Detection & Response its team, fusing Red Canary MDR operational intelligence with Zscaler inline telemetry, validates complex threats, drives rapid investigations and executes guided containment around the clock, and lists AI + Human Expert Triage: automated enrichment and investigation while experts handle advanced attacks and escalation. [portfolio.security-operations:red-canary-combined] Whether Red Canary operates as a separate business unit within Zscaler is open [gap:portfolio.security-operations:red-canary-unit].

Integration with the rest of the suite is open [gap:portfolio.security-operations:red-canary-integration], and so is any customer SDK or delivery model [gap:portfolio.security-operations:red-canary-delivery].

## Other SecOps products

Identity Protection, SOC Workbench and Breach Predictor are in [Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated](kb:identity-protection.overview), [SOC Workbench (Agentic SOC): alert unification, correlation and prioritization, and what can be automated](kb:soc-workbench.overview) and [Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with](kb:breach-predictor.overview). Agentic SecOps is described in [Zscaler platform pillars: Zero Trust Exchange, Data Fabric for Security, Agentic SecOps and the customer-segment framing](kb:portfolio.platform).

What to check:
1. For a question about which SecOps product fits a need, route to that product's overview and answer from its claims; the suite page only groups the products.
2. For Red Canary delivery or integration questions, say the answer is open and do not infer an SDK, portal or account process.
3. For CTEM stage mapping, say the mapping is open and do not assign suite products to CTEM stages.

Not known (open gaps):
- How the five CTEM stages map onto the suite's products [gap:portfolio.security-operations:ctem-stages]: settled by source-read
- Whether customers buy CTEM as a multi-product bundle [gap:portfolio.security-operations:ctem-bundle]: settled by source-read or operator-experience
- Whether Managed Threat Hunting sits inside Red Canary MDR [gap:portfolio.security-operations:mth-within-mdr]: settled by source-read
- Whether managed threat hunting targets TTPs that automated detection misses [gap:portfolio.security-operations:mth-scope]: settled by source-read
- How managed threat hunting is delivered and engaged [gap:portfolio.security-operations:mth-delivery]: settled by source-read or operator-experience
- How Red Canary MDR integrates with the rest of the suite [gap:portfolio.security-operations:red-canary-integration]: settled by source-read or support-ticket
- Whether Red Canary MDR has a customer SDK or portal surface [gap:portfolio.security-operations:red-canary-delivery]: settled by source-read or support-ticket
- Whether CTEM has an SDK surface of its own [gap:portfolio.security-operations:ctem-sdk]: settled by source-read
- Whether EASM is positioned as a component of the Security Operations portfolio rather than a standalone product [gap:portfolio.security-operations:easm-placement]: settled by source-read
- Which products make up Zscaler's Exposure Management portfolio [gap:portfolio.security-operations:exposure-members]: settled by source-read
- What Zscaler's CTEM program spans [gap:portfolio.security-operations:ctem-scope]: settled by source-read
- Whether Red Canary MDR operates as a separate business unit within Zscaler [gap:portfolio.security-operations:red-canary-unit]: settled by source-read

Area: portfolio.security-operations, its subjects in references/_meta/spine/portfolio/portfolio.security-operations.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/portfolio/portfolio.platform.md (Zscaler platform pillars: Zero Trust Exchange, Data Fabric for Security, Agentic SecOps and the customer-segment framing)
- links-to references/_meta/text/aem/aem.overview.md (Asset Exposure Management (AEM): the asset inventory, coverage gaps and policies, and what can be automated)
- links-to references/_meta/text/breach-predictor/breach-predictor.overview.md (Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with)
- links-to references/_meta/text/deception/deception.overview.md (Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated)
- links-to references/_meta/text/easm/easm.findings.md (EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages)
- links-to references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)
- links-to references/_meta/text/portfolio/portfolio.secops-platform.md (The Agentic SecOps Platform under AEM, UVM, Agentic SOC and Identity Protection: data fabric, data sources and the Reporting API)
- links-to references/_meta/text/risk360/risk360.overview.md (Risk360: what it measures, which data it uses, how long it keeps logs, and what can be automated)
- links-to references/_meta/text/soc-workbench/soc-workbench.overview.md (SOC Workbench (Agentic SOC): alert unification, correlation and prioritization, and what can be automated)
- links-to references/_meta/text/uvm/uvm.overview.md (Unified Vulnerability Management (UVM): what it does with findings, and what can be automated)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/portfolio/portfolio.saas-security-report.md (Shadow IT Report (also SaaS Security Report, ZINS): shadow IT discovery, risk index and API surface)
