# Cross-product hooks: where ZIA, ZPA and Client Connector reach into each other (shared.integrations)
Also called: cross-product integrations; cross product dependency; zia zpa integration; zcc feeds zpa policy; rule does not match because of another product; which product owns this behavior; risk score in zpa access policy; how do these products fit together

The products are configured separately, but a field or decision in one often depends on state in another, and a question framed around one product can resolve in another. This subject maps those hooks by direction and points at where each is held.

## Internet & SaaS reaching into Private Access

| Hook | Held in |
| --- | --- |
| SSL/TLS inspection rules can scope by Private Access application segment | [The ZPA Application Segment criterion lists only segments that have Source IP Anchor enabled (up to 255 selectable); in the API it is the `zpaAppSegments` list, documented as Source IP Anchoring-enabled segments.](kb:zia.ssl-inspection.criteria:zpa-segments-sipa-only); whether URL Filtering and Cloud App Control lack the criterion is open: [Whether road_warrior_for_kerberos and zpaAppSegments are absent from URL Filtering and Cloud App Control rules](kb:zia.ssl-inspection.criteria:absent-from-url-filtering-and-cac) |
| Forwarding Control sends anchored traffic to an App Connector through a Private Access gateway | [Source IP Anchoring: what it needs on each side](kb:zia.forwarding-control.sipa), [The Private Access gateway object in ZIA](kb:zia.forwarding-control.zpa-gateway), [Source IP Anchoring across ZIA and Private Access: path, pieces and interactions](kb:shared.source-ip-anchoring) |
| Country criteria see the edge's address for anchored traffic | [For Cloud Connectors, Source IP Anchoring traffic and Private Access multi-hop, the country criterion uses the last NATed layer 3 public IP address, so SIPA traffic takes its country from the Internet & SaaS Public Service Edge's public IP.](kb:zpa.policy.criteria:country-last-nat-ip) |
| Segment features that exclude anchoring | [Source IP Anchor and Inspect Traffic with ZIA cannot both be enabled on a segment; Source IP Anchor must be disabled first.](kb:zpa.app-segments.settings:sipa-inspect-zia-exclusive), [Double Encryption cannot be enabled when Browser Access or Source IP Anchoring is selected for any application, and should be disabled for extranet application segments.](kb:zpa.app-segments.settings:double-encryption-exclusions), [Multimatch is not supported for applications that have Source IP Anchoring enabled, and with Multimatch enabled the Health Reporting of an application segment can only be On Access or None.](kb:zpa.app-segments.multimatch-requirements:sipa-health-reporting) |
| Anchoring during Internet & SaaS disaster recovery | [Two access policy patterns prevent Source IP Anchoring Direct from working: any rule that blocks access to Zscaler Client Connector, and any rule that results in the Default Rule. Zscaler recommends an access policy that allows access to the applications from Zscaler Client Connector.](kb:zia.forwarding-control.sipa-direct:access-blockers) |

## Private Access reaching into Internet & SaaS

| Hook | Held in |
| --- | --- |
| A segment can send its traffic to Internet & SaaS for inspection | [Inspect Traffic with ZIA lets a segment use a single posture for securing internet or SaaS and private applications and applies Data Loss Prevention policies to it.](kb:zpa.app-segments.settings:inspect-zia-purpose), [ZIA Inspected ZPA Apps is a predefined Forwarding rule, enabled by default, that sends Private Access application segment traffic whose Inspect Traffic with ZIA field is enabled to ZIA for inspection. It cannot be edited, and exists only with Private Access App Inspection.](kb:zia.forwarding-control.predefined-rules:inspected-zpa-apps); whether it blocks Multimatch is open: [The complete list of features that block Multimatch for a segment](kb:zpa.app-segments.multimatch-requirements:multimatch-feature-matrix) |
| Access rules can use a user risk score from Internet & SaaS | Private Access access policy has a Risk Scores criterion: user risk scores from a risk source, Internet & SaaS being the vendor's example. [shared.integrations:risk-score-source] [A RISK_FACTOR_TYPE operand has lhs ZIA and rhs one of UNKNOWN, LOW, MEDIUM, HIGH or CRITICAL.](kb:zpa.policy.conditions:risk-factor-entry); the score levels on the Internet & SaaS side: [The console's User Risk Profile criterion selects user risk score levels (by default Low 0–29, Medium 30–59, High 60–79, Critical 80–100). The API carries it as `userRiskScoreLevels`.](kb:zia.url-filtering.criteria:user-risk-score-levels); what a user with no score matches is open [gap:shared.integrations:risk-score-without-history] |

## Client Connector feeding Private Access

| Hook | Held in |
| --- | --- |
| Trusted network result sent to Private Access | [A Client Connector forwarding profile's ZPA action has a Send Trusted Network Result to ZPA setting, described by the Client Connector API as indicating whether it is enabled.](kb:zpa.trusted-networks.zcc-relationship:send-result-setting); whether trusted network conditions stop matching when it is off is open: [Whether ZPA trusted network conditions stop matching when Send Trusted Network Result to ZPA is off](kb:zcc.forwarding-profiles.private-access-actions:send-result-effect) |
| Private Access entitlement | [With the default off, no user has Private Access unless groups are selected, and then only the selected groups do; by default no user groups are selected.](kb:zcc.entitlements.zpa:configurations); what a user who is not entitled looks like is open: [What a user who is not entitled to Private Access looks like in logs](kb:zcc.entitlements:not-entitled-signals) |
| Machine tunnel switch | [With Enable Machine Tunnel For All on, all users whose app profile has a machine token can connect to Private Access without being logged in, on Windows or macOS.](kb:zcc.entitlements.zpa:machine-tunnel-for-all) |
| Device posture | [Device posture across products: Client Connector evaluates, Private Access and Internet & SaaS consume](kb:shared.device-posture) |

## Client Connector shaping what Internet & SaaS sees

| Hook | Held in |
| --- | --- |
| Root certificate install for SSL/TLS inspection | [With Install Zscaler SSL Certificate enabled, the app installs the Zscaler certificate automatically, or the organization's custom certificate if one was uploaded; deployments using the app for Private Access only skip the option.](kb:zcc.app-profiles.ssl-certificate:install-option), [Install Zscaler SSL Certificate is not supported on devices running macOS Big Sur (11) and later.](kb:zcc.ssl-inspection.certificate-install:big-sur), [With the default Zscaler intermediate certificate every client must have the Zscaler root certificate installed; otherwise browsers and applications show warnings or the traffic cannot be inspected properly.](kb:zia.ssl-inspection.certificates:root-must-be-trusted) |
| PAC file the app follows | [A PAC file reaches the profile through the system proxy settings, as PAC URL Location: a PAC URL (at most 512 characters, https:// when Enforce Secure PAC URLs is on) that the app downloads directly, or a registry key on the device that holds the URL.](kb:zcc.forwarding-profiles.internet-actions:pac-url-location), [ZCC app profiles (web policies)](kb:zcc.app-profiles) |
| Internet & SaaS posture profile and trust levels | [Internet & SaaS device trust levels: how posture becomes a policy criterion](kb:shared.device-posture.trust-levels) |
| Forwarding action None on a trusted network | [A profile whose On-Trusted action is None sends nothing through the app on any network classified On-Trusted, so a device that matches the trusted network criteria away from the office reaches the internet without the app's tunnel, with no policy change involved.](kb:zcc.forwarding-profiles.internet-actions:trusted-none-skips-zia) |

## Step-up authentication shared by both

URL Filtering's Conditional action: [Conditional enforces step-up authentication before access. It needs Authentication Service for end users and Client Connector forwarding; through Private or Virtual Service Edges the category is blocked instead, and it does not apply to isolation traffic.](kb:zia.url-filtering.actions:conditional-prereqs) Private Access's Conditional Access action: [Conditional Access applies step-up authentication, is available only with an Authentication Service subscription, and prompts the user to reinforce their authentication if they are not at the defined level.](kb:zpa.policy.actions:conditional-access-step-up), whose name differs between articles: [zpa.policy.actions:require-approval-name](kb:zpa.policy.actions:require-approval-name). Both are OIDC-only: [Step-up authentication is supported only with OIDC-based external IdP integrations; when an external IdP is used via OIDC, each authentication level must be mapped to its acr value in the IdP.](kb:zia.authentication.step-up:oidc-only), [Step-up authentication is supported only with OIDC-based external IdP integrations.](kb:zpa.policy.actions:step-up-oidc-only). Authentication levels and their validity rules are in [Step-up authentication: when Authentication Service asks for a stronger login, and why a prompt may not appear](kb:zidentity.step-up).

## Inside Internet & SaaS: one feature gating another

| Hook | Held in |
| --- | --- |
| Content-based features need decryption | [These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System.](kb:zia.ssl-inspection.bypass-impact:dependent-features), [On Do Not Inspect with Evaluate Other Policies, URL Filtering and Cloud App Control still evaluate the destination domain, so a block on the domain fires while path-, method- and payload-based rules do not; Do Not Inspect with Bypass Other Policies skips both entirely.](kb:zia.ssl-inspection.bypass-impact:evaluate-variant-keeps-domain-checks) |
| AI/ML recategorization changes URL Filtering's input | [A URL that was uncategorized or Miscellaneous or Unknown, and so not blocked, can start to be blocked after the AI/ML tools move it into a Botnet or Phishing category whose toggle is set to Block, with no admin edit to any policy.](kb:zia.atp.ai-ml-recategorization:blocking-can-change-without-edit) |
| DLP incidents feeding Workflow Automation | [Workflow Automation integrates with ZIA to capture the Data Protection incidents generated from the DLP policies defined in ZIA, and its Incidents page covers Inline, Endpoint, Email and SaaS Security DLP.](kb:zia.dlp.incident-forwarding:zwa-captures-incidents); ingested through a DLP application integration: [On AWS, the DLP application integration uses Zscaler's incident-forwarding methods, Zscaler Incident Receiver or Cloud-to-Cloud Incident Forwarding, which send information about policy violations to the organization's S3 buckets.](kb:zwa.incidents:integration-methods); scan limits: [DLP file size, archive and text limits: why DLP did not catch a large file](kb:zia.dlp.inspection-limits); [Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting](kb:zwa.incidents) |
| Isolate action handing off to Cloud Browser Isolation | [Isolate sends matching traffic through a remote browser using a chosen isolation profile, and exists only when Zero Trust Browser is enabled for the organization.](kb:zia.url-filtering.actions:isolate-needs-zbi), [What sends traffic to Cloud Browser: Internet & SaaS rules, Smart Isolation and the Private Access isolation policy](kb:zbi.policy) |

## Control-plane and platform differences

| Difference | Held in |
| --- | --- |
| Activation | [The vendor's URL Categories API guide says to activate configuration changes after making them, by sending a POST request to /status.](kb:zia.api.activation:saved-not-live); whether a Private Access write is live without activation is open: [Whether a ZPA write is live without an activation call](kb:zpa.api.activation:write-takes-effect); [Which Zscaler products stage changes behind an activation](kb:shared.activation) |
| Business continuity | [Zscaler Tunnel 2.0 is not supported in business continuity mode.](kb:zia.private-service-edge.business-continuity:z-tunnel-2-unsupported), [Zscaler cloud architecture](kb:shared.cloud-architecture) |
| Separate log streams | [What a ZIA web log record is and how its fields are named](kb:zia.logs.web-records), [What a ZPA User Activity log record says and does not say](kb:zpa.logs.user-activity), [Correlating ZIA, ZPA and Client Connector logs](kb:shared.log-correlation) |
| Workload forwarding through Cloud Connector | [Cloud & Branch Connector: what Cloud Connector is and where each area is described](kb:cloud-connector.overview), [Cloud Connector traffic forwarding](kb:cloud-connector.forwarding) |
| OneAPI authentication | [OneAPI: Zscaler's unified API gateway, and where each part of calling it is covered](kb:shared.oneapi), [ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime](kb:zidentity.api-clients) |
| Digital Experience entitlement and data | [With the default off, no user has ZDX unless groups are selected, and then only the selected groups do; no groups are selected by default.](kb:zcc.entitlements.zdx:configurations), [ZDX at a glance: what it measures and which subject answers each question](kb:zdx.overview), [ZDX probes: Web and Cloud Path probes, what they measure and how they run](kb:zdx.probes) |
| Directory data shared across products | [What ZIdentity (Authentication Service) is, and where each part of it is covered](kb:zidentity.overview) |

What to check:
1. For an SSL/TLS rule that does not list or match a Private Access segment: whether Source IP Anchor is enabled on the segment.
2. For a TRUSTED_NETWORK access condition that never matches: whether Send Trusted Network Result to ZPA is on in the user's active forwarding profile.
3. For a user who reaches no Private Access application: the user's (and device group's) Private Access entitlement before any access rule.
4. For a risk-score access rule that does not fire for a user: the user's current risk score level, including Unknown.
5. For DLP, Sandbox, malware or Cloud App Control misses on HTTPS: whether the traffic matched a Do Not Inspect rule.
6. For certificate errors on one platform only: the Install Zscaler SSL Certificate setting of that platform's app profile, and the macOS version.
7. For a URL newly blocked with no rule change: whether ATP's AI/ML tools moved it into a Botnet or Phishing category.
8. For a change that took effect in one product and not the other: whether the Internet & SaaS change was activated.

Not known (open gaps):
- Which risk level a user with no Internet & SaaS risk score matches, and what feeds the score [gap:shared.integrations:risk-score-without-history]: settled by lab-test or source-read. Blocks: predicting whether a risk-score rule applies to a user with little Internet & SaaS traffic

Area: shared.integrations, its subjects in references/_meta/spine/shared/shared.integrations.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring)
- links-to references/_meta/text/zpa/zpa.policy.actions.md (Rule actions on ZPA policy types)
- links-to references/_meta/text/zcc/zcc.entitlements.zpa.md (Private Access entitlement and the machine tunnel switch)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.internet-actions.md (Forwarding profile actions for Internet & SaaS (ZIA): Tunnel, Tunnel with Local Proxy, Enforce Proxy, None)
- links-to references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection)
- links-to references/_meta/text/zia/zia.ssl-inspection.criteria.md (SSL/TLS inspection rule criteria and the ones that silently don't match)
- links-to references/_meta/text/zia/zia.url-filtering.actions.md (URL Filtering actions and their prerequisites)
- links-to references/_meta/text/zpa/zpa.app-segments.multimatch-requirements.md (Multimatch prerequisites, restrictions and App Connector selection)
- links-to references/_meta/text/zwa/zwa.incidents.md (Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting)
- links-to references/_meta/text/cloud-connector/cloud-connector.forwarding.md (Cloud Connector traffic forwarding)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.md (Cloud & Branch Connector: what Cloud Connector is and where each area is described)
- links-to references/_meta/text/shared/shared.activation.md (Which Zscaler products stage changes behind an activation)
- links-to references/_meta/text/shared/shared.cloud-architecture.md (Zscaler cloud architecture)
- links-to references/_meta/text/shared/shared.device-posture.md (Device posture across products: Client Connector evaluates, Private Access and Internet & SaaS consume)
- links-to references/_meta/text/shared/shared.device-posture.trust-levels.md (Internet & SaaS device trust levels: how posture becomes a policy criterion)
- links-to references/_meta/text/shared/shared.log-correlation.md (Correlating ZIA, ZPA and Client Connector logs)
- links-to references/_meta/text/shared/shared.oneapi.md (OneAPI: Zscaler's unified API gateway, and where each part of calling it is covered)
- links-to references/_meta/text/shared/shared.source-ip-anchoring.md (Source IP Anchoring across ZIA and Private Access: path, pieces and interactions)
- links-to references/_meta/text/zbi/zbi.policy.md (What sends traffic to Cloud Browser: Internet & SaaS rules, Smart Isolation and the Private Access isolation policy)
- links-to references/_meta/text/zcc/zcc.app-profiles.md (ZCC app profiles (web policies))
- links-to references/_meta/text/zcc/zcc.app-profiles.ssl-certificate.md (Whether Client Connector installs the Zscaler root certificate)
- links-to references/_meta/text/zcc/zcc.entitlements.md (ZCC service entitlement: who gets Private Access, ZDX, Deception and Internet & SaaS, by user group or device group)
- links-to references/_meta/text/zcc/zcc.entitlements.zdx.md (Digital Experience (ZDX) entitlement)
- links-to references/_meta/text/zcc/zcc.forwarding-profiles.private-access-actions.md (Forwarding profile actions for Private Access (ZPA): Tunnel or None per network type)
- links-to references/_meta/text/zcc/zcc.ssl-inspection.certificate-install.md (Who installs the SSL inspection certificate on Client Connector devices, per platform)
- links-to references/_meta/text/zdx/zdx.overview.md (ZDX at a glance: what it measures and which subject answers each question)
- links-to references/_meta/text/zdx/zdx.probes.md (ZDX probes: Web and Cloud Path probes, what they measure and how they run)
- links-to references/_meta/text/zia/zia.api.activation.md (How ZIA API changes become live: saving versus activating)
- links-to references/_meta/text/zia/zia.atp.ai-ml-recategorization.md (ATP AI/ML recategorization: why a URL can start blocking with no policy change)
- links-to references/_meta/text/zia/zia.authentication.step-up.md (Step-up authentication and ZIdentity authentication levels)
- links-to references/_meta/text/zia/zia.dlp.incident-forwarding.md (Where a DLP match goes: notification, ICAP, Incident Receiver and Cloud-to-Cloud)
- links-to references/_meta/text/zia/zia.dlp.inspection-limits.md (DLP file size, archive and text limits: why DLP did not catch a large file)
- links-to references/_meta/text/zia/zia.forwarding-control.predefined-rules.md (Predefined Forwarding Control rules)
- links-to references/_meta/text/zia/zia.forwarding-control.sipa.md (Source IP Anchoring: what it needs on each side)
- links-to references/_meta/text/zia/zia.forwarding-control.sipa-direct.md (Source IP Anchoring Direct during ZIA disaster recovery)
- links-to references/_meta/text/zia/zia.forwarding-control.zpa-gateway.md (The Private Access gateway object in ZIA)
- links-to references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)
- links-to references/_meta/text/zia/zia.private-service-edge.business-continuity.md (Private Service Edges in the Business Continuity Cloud)
- links-to references/_meta/text/zia/zia.ssl-inspection.certificates.md (SSL/TLS inspection certificates: who signs, and where the root must be trusted)
- links-to references/_meta/text/zia/zia.url-filtering.criteria.md (How URL Filtering rule criteria combine)
- links-to references/_meta/text/zidentity/zidentity.api-clients.md (ZIdentity API clients: what one is, how it authenticates, its resources and scopes, and its token lifetime)
- links-to references/_meta/text/zidentity/zidentity.overview.md (What ZIdentity (Authentication Service) is, and where each part of it is covered)
- links-to references/_meta/text/zidentity/zidentity.step-up.md (Step-up authentication: when Authentication Service asks for a stronger login, and why a prompt may not appear)
- links-to references/_meta/text/zpa/zpa.api.activation.md (Whether ZPA changes need an activation step)
- links-to references/_meta/text/zpa/zpa.logs.user-activity.md (What a ZPA User Activity log record says and does not say)
- links-to references/_meta/text/zpa/zpa.policy.conditions.md (Boolean logic and operand forms of ZPA policy conditions)
- links-to references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules)
- links-to references/_meta/text/zpa/zpa.trusted-networks.zcc-relationship.md (Trusted networks in ZPA and in Client Connector)
