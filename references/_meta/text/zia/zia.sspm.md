# SaaS Security Posture Management (SSPM): the Admin Console policy page and Advanced SSPM (zia.sspm)
Also called: sspm; saas security posture management; saas security posture; advanced sspm; advanced posture management; posture management; sspm scan

SaaS Security Posture Management (SSPM) is the practice of systematically assessing, monitoring and improving the security posture of SaaS applications in an organization, and is described as a collection of recommended security policies. [zia.sspm:what-sspm-is] The SSPM policy page in the Zscaler Admin Console is reached from the navigation menu at Data Security > SaaS Security > Posture Management. [zia.sspm:policy-page-location] The policies, their statuses and compliance types are in [The SSPM policy page: predefined policies, compliance types, risk levels and statuses](kb:zia.sspm.policies).

**Advanced SSPM.** Advanced SaaS Security Posture Management (SSPM) is described as a unified solution for security across SaaS apps and platforms, from data visibility to posture and governance. It helps identify and mitigate risky misconfigurations, control SaaS sprawl, reduce third-party access and identify users at risk, and lets you vet third-party integrations, revoke risky connections and ensure least-privileged SaaS access. [zia.sspm:advanced-what] Subscribers to the Advanced SSPM service reach it from the Zscaler Admin Console with single sign-on, at Analytics > Reports > SaaS Security Report > Posture Management. The Compliance page says that subscribers to the Advanced SSPM service can access it. [zia.sspm:advanced-access] If Advanced Posture Management is enabled by a license, the Posture Management page redirects to the 3rd-Party App Governance Admin Portal. [zia.sspm:advanced-redirects-to-app-governance] SSPM Essentials, in contrast to Advanced SSPM, offers limited features, including security control, standalone platform reporting and polling frequency, and will not have additional features introduced aside from security updates; Advanced SSPM instead has varied offerings such as security controls, modular polling frequency, multiple polling methods (for example API and Nativescripting) and an integrated experience (for example App Governance, Posture, Identity, Data). Without an Advanced Posture Management license the Posture Management page (SSPM Essentials) is visible with an upgrade banner. [zia.sspm:essentials-vs-advanced] Its Posture, Control Panel and Compliance pages are in [Advanced SSPM Posture, Control Panel and Compliance pages: control and asset statuses, severity, complexity](kb:zia.sspm.posture), and the platforms with their own connection pages are in [Connecting platforms to Advanced SSPM: the platforms the connect page lists and what each needs](kb:zia.sspm.platforms).

**Onboarding.** The permissions and admin role each SaaS application needs for the SSPM scan are in [Permissions and admin roles needed to onboard each SaaS application for SSPM](kb:zia.sspm.permissions). Advanced SSPM supports API-based platforms that are onboarded from the Zscaler Admin Console or the 3rd-Party App Governance Admin Portal, listed as Airtable, Bitbucket, Bitwarden, Box, Confluence, Databricks, Docusign, Dropbox, GitHub, GitLab, Google Workspace, Jira, JumpCloud, Lucid, Microsoft 365, Microsoft Copilot, Okta, OneLogin, OpenAI, Oracle Financials Cloud, Salesforce, Sentry, ServiceNow, ShareFile, Slack, Smartsheet, Snowflake, Trello, Twilio, Webex Teams, Workday, Zendesk and Zoom. [zia.sspm:advanced-platforms] The vendor's pages list the supported applications differently [divergence:zia.sspm:application-lists], and whether the lists cover different tiers is open [gap:zia.sspm:list-tiers].

**Licensing.** How the Advanced SSPM subscription relates to the 3rd-Party App Governance subscription is open [gap:zia.sspm:license-relationship]. The sibling product is [3rd-Party App Governance: governing third-party apps, add-ons and extensions connected to SaaS platforms, and its portal, roles and dashboard](kb:zia.app-governance).

**Not this product.** Data-at-rest scanning of SaaS files is [ZIA CASB (SaaS Security API): scanning data at rest in sanctioned SaaS applications](kb:zia.casb). Data security posture management is [Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated](kb:dspm.overview). The cloud workload posture product is [Zscaler Posture Control (ZPC) and Cloud Protection: what ZPC covered, and its end of life](kb:portfolio.cloud-protection).

What to check:
1. Which tier a question is about, the Admin Console SSPM policy page or Advanced SSPM, before quoting an application list.

Sources disagree (name both sides):
- The vendor's pages give three different lists of SaaS applications for SSPM: the SSPM policy page, the onboarding permissions page and the Advanced SSPM page. [divergence:zia.sspm:application-lists]
  - zscaler-help: The SSPM policy page lists nine applications for configuring SSPM while onboarding tenants: Bitbucket, Confluence, GitHub, Google Workspace, Jira, Microsoft 365, Okta, Salesforce and ServiceNow.
  - zscaler-help: The onboarding permissions page has onboarding requirements for applications that include Box, Webex Teams and Zoom, which the policy page does not list.
  - zscaler-help: The Advanced SSPM page lists API-based platforms that include Smartsheet, Snowflake, Trello, Twilio, Webex Teams, Workday and Zendesk, which the policy page does not list.
  Impact: An answer about which applications SSPM covers differs by page. Whether the pages describe different tiers is not stated by any of them, so a question has to say which tier and console it concerns.

Not known (open gaps):
- Whether the three SSPM application lists cover different tiers [gap:zia.sspm:list-tiers]: settled by support-ticket or tenant-data
- How the Advanced SSPM and 3rd-Party App Governance licenses relate [gap:zia.sspm:license-relationship]: settled by source-read or support-ticket

Area: zia.sspm, its subjects in references/_meta/spine/zia/zia.sspm.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/dspm/dspm.overview.md (Data Security Posture Management (DSPM): what it finds in stored data, how it differs from inline DLP, and what can be automated)
- links-to references/_meta/text/portfolio/portfolio.cloud-protection.md (Zscaler Posture Control (ZPC) and Cloud Protection: what ZPC covered, and its end of life)
- links-to references/_meta/text/zia/zia.app-governance.md (3rd-Party App Governance: governing third-party apps, add-ons and extensions connected to SaaS platforms, and its portal, roles and dashboard)
- links-to references/_meta/text/zia/zia.casb.md (ZIA CASB (SaaS Security API): scanning data at rest in sanctioned SaaS applications)
- links-to references/_meta/text/zia/zia.sspm.permissions.md (Permissions and admin roles needed to onboard each SaaS application for SSPM)
- links-to references/_meta/text/zia/zia.sspm.platforms.md (Connecting platforms to Advanced SSPM: the platforms the connect page lists and what each needs)
- links-to references/_meta/text/zia/zia.sspm.policies.md (The SSPM policy page: predefined policies, compliance types, risk levels and statuses)
- links-to references/_meta/text/zia/zia.sspm.posture.md (Advanced SSPM Posture, Control Panel and Compliance pages: control and asset statuses, severity, complexity)
