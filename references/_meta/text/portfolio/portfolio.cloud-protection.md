# Zscaler Posture Control (ZPC) and Cloud Protection: what ZPC covered, and its end of life (portfolio.cloud-protection)
Also called: cloud protection; zero trust cloud; cnapp; posture control; zscaler posture control; cloud native application protection platform; cspm; ciem; cloud security posture management; cloud workload protection

Zscaler Posture Control (ZPC) is a multi-tenant software-as-a-service (SaaS) platform that detects and responds to cloud security risks, and is part of Zscaler Cloud Protection, which the page describes as a multi-cloud security platform covering misconfigurations, entitlements, exposed attack surfaces, lateral threat movement and data loss. [portfolio.cloud-protection:zpc-what] ZPC comprises functionality previously covered by several point products, including Cloud Security Posture Management (CSPM), Cloud Infrastructure Entitlement Management (CIEM), Security and Compliance, Infrastructure-as-Code (IaC) Security and Vulnerability Management. [portfolio.cloud-protection:zpc-point-products] What else Posture Control converges is open [gap:portfolio.cloud-protection:cnapp-convergence].

**End of life.** Zscaler announced on December 17, 2024 the End-of-Sale of ZPC on March 15, 2025 and its End-of-Life planned for March 15, 2026, with existing tenants supported until the EOL, and recommends that ZPC users consider a migration plan to Zscaler Data Security Posture Management (DSPM). [portfolio.cloud-protection:zpc-eos-eol] Zscaler Cloud Security Posture Management (ZCSPM) reached End-of-Sale on October 18, 2022 and End-of-Life on March 31, 2024; its notice pointed ZCSPM users to ZPC as the new generation platform covering ZCSPM functionality. [portfolio.cloud-protection:zcspm-eos-eol] The DSPM offering it points to is in [Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated](kb:dspm.overview). Whether the product messaging narrowed with it is open [gap:portfolio.cloud-protection:cnapp-redirect].

**How it works.** ZPC works with read-only access to AWS, Azure and Google Cloud environments, with read-write permission needed for vulnerability scanning, and scans container images in registries and VMs in production with an API-based, agentless approach. The page's introduction says ZPC continuously monitors cloud resources and detects vulnerabilities, DevOps misconfigurations and threats once business applications are deployed in the cloud infrastructure across AWS, Microsoft Azure, Google Cloud Platform and Kubernetes. [portfolio.cloud-protection:zpc-access-and-scanning] Whether it covers clouds beyond those named is open [gap:portfolio.cloud-protection:cnapp-agentless]. The page says ZPC integrates with the existing security operations (SecOps) ecosystem and IT service management (ITSM), and monitors automated deployment processes, alerting on critical security issues in CI/CD tools such as Jenkins and GitHub Actions and code repositories such as GitLab and GitHub. [portfolio.cloud-protection:zpc-integrations] How each integration works is open [gap:portfolio.cloud-protection:cnapp-integration]. ZPC uses threat intelligence from the Zscaler ThreatLabz research team to block malicious activity and future attack paths. [portfolio.cloud-protection:zpc-threat-intel] Whether it correlates misconfigurations into attack paths is open [gap:portfolio.cloud-protection:cnapp-attack-paths].

**Cloud Protection.** Whether Cloud Protection is a pillar that combines CSPM, microsegmentation and workload traffic security is open [gap:portfolio.cloud-protection:cp-pillar]. Whether it differs from Cloud Connector by scanning configuration rather than forwarding traffic is open [gap:portfolio.cloud-protection:cp-vs-connector]. The Cloud & Branch Connector product is in [Cloud & Branch Connector: what Cloud Connector is and where each area is described](kb:cloud-connector.overview). Where these captures came from is recorded in [gap:portfolio.cloud-protection:cp-capture].

What to check:
1. Do not attribute CNAPP or posture-control behavior to DSPM or Cloud Connector; answer that the behavior is open and name the gap.

Not known (open gaps):
- Whether Cloud Protection is a platform pillar combining CSPM, microsegmentation and workload traffic [gap:portfolio.cloud-protection:cp-pillar]: settled by source-read
- How Cloud Protection differs from Cloud Connector [gap:portfolio.cloud-protection:cp-vs-connector]: settled by source-read
- What the Posture Control CNAPP converges [gap:portfolio.cloud-protection:cnapp-convergence]: settled by source-read
- Whether Posture Control scans agentlessly across four clouds [gap:portfolio.cloud-protection:cnapp-agentless]: settled by source-read
- Whether Posture Control correlates misconfigurations into attack paths [gap:portfolio.cloud-protection:cnapp-attack-paths]: settled by source-read
- Whether Posture Control's identity has narrowed into DSPM and CNAPP messaging [gap:portfolio.cloud-protection:cnapp-redirect]: settled by source-read
- How Posture Control integrates with customer environments [gap:portfolio.cloud-protection:cnapp-integration]: settled by source-read or support-ticket

Area: portfolio.cloud-protection, its subjects in references/_meta/spine/portfolio/portfolio.cloud-protection.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.md (Cloud & Branch Connector: what Cloud Connector is and where each area is described)
- links-to references/_meta/text/dspm/dspm.overview.md (Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/portfolio/portfolio.platform.md (Zscaler platform pillars: Zero Trust Exchange, Data Fabric for Security, Agentic SecOps and the customer-segment framing)
