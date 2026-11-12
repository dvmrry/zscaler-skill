# What sends traffic to Cloud Browser: Internet & SaaS rules, Smart Isolation and the Private Access isolation policy (zbi.policy)
Also called: isolate action; browser isolation policy; how to isolate traffic; zbi policy integration; cloud browser configuration; isolate rule not working; isolation prerequisites; enable cloud browser
Former IDs: zbi-01

Zero Trust Browser has no policy engine of its own in the captured sources: other products' rules send traffic to it, each naming an isolation profile. The Cloud Browser configuration guide's prerequisites are access to an Internet & SaaS or Private Access tenant, a Zero Trust Browser subscription, supporting Private Access infrastructure such as App Connector, and an identity provider with conditional access capabilities; Cloud Browser is enabled for an organization by contacting Zscaler Support. [zbi.policy:enable-prereqs] After creating isolation profiles, the guide maps policies to them: for Internet & SaaS, configuring Internet & SaaS for Cloud Browser, the Cloud App Control policy, the Smart Browser Isolation policy and the Sandbox integration; for Private Access, learning about the isolation policy, configuring isolation policies, the access policy for Cloud Browser and secure SaaS access from unmanaged devices through the User Portal. [zbi.policy:policy-steps]

## Internet & SaaS

Before configuring the Internet & SaaS URL Filtering Isolate rule, Zero Trust Browser must be licensed for the organization, and admins use isolation profiles to configure the Internet & SaaS policies. [zbi.policy:prerequisite-licensed-profiles] The Isolate action in an Internet & SaaS URL Filtering rule can be enabled only if the protocol is HTTP, HTTPS or both, the HTTP method is limited to CONNECT, GET, TRACE or HEAD, and the user agent is made up of at least one known browser; these parameters are set automatically once the organization enables Zero Trust Browser. [zbi.policy:isolate-action-conditions] Users must be authenticated before traffic and web requests are redirected to Zero Trust Browser; the Internet & SaaS isolation profile article adds that unauthenticated traffic, or traffic from locations with authentication disabled, is not subjected to isolation policies. [zbi.policy:authentication-required] Bandwidth Control is disabled for all traffic from the isolated browser to the Internet & SaaS Public Service Edges. [zbi.policy:bandwidth-control-off] For HTTPS web pages to be isolated through an Internet & SaaS isolation profile, the Zscaler service must be configured to inspect SSL traffic, because the isolation container cannot run properly without SSL inspection. [zbi.policy:https-needs-ssl-inspection]

URL Filtering's Isolate action: [Isolate sends matching traffic through a remote browser using a chosen isolation profile, and exists only when Zero Trust Browser is enabled for the organization.](kb:zia.url-filtering.actions:isolate-needs-zbi), with the provider's checks on such a rule in [For an ISOLATE rule the provider requires a cbi_profile, rejects the user agent type OTHER, and allows only HTTP and HTTPS protocols.](kb:zia.terraform.url-filtering-rules:isolate-validation). Cloud App Control's Isolate actions and their restriction: [An AI & ML applications rule for Cloud App Control offers the console actions Allow, Caution, Block, Conditional and Isolate; Isolate is available only if Zero Trust Browser is enabled for the organization.](kb:zia.cloud-app-control.actions:console-actions), [ISOLATE actions cannot be combined with other actions in one rule, and a rule using them needs a Cloud Browser Isolation profile (`cbiProfile`).](kb:zia.cloud-app-control.actions:isolate-not-mixed). The Device Groups criterion has a Cloud Browser Isolation choice: [The Device Groups criterion has an IoT choice that applies a rule to IoT traffic, alongside Cloud Browser Isolation and No Client Connector. It appears in URL Filtering, Cloud App Control, SSL/TLS Inspection and Forwarding Control rules.](kb:zia.iot.policy-use:iot-device-group).

AI/ML-driven isolation of suspicious sites is in [Smart Browser Isolation: AI/ML isolation of suspicious sites, its SSL/TLS rule and its Malware Protection prerequisite](kb:zbi.smart-isolation). Whether a manual Isolate rule needs SSL/TLS inspection on HTTPS is partly answered [gap:zbi.policy:manual-isolate-ssl].

## Private Access

Private application requests are sent to isolation by the isolation policy, which also needs an access policy: [Private Access isolation policy: when private application requests go to isolation, and what else they need](kb:zbi.private-access-isolation).

## Profiles and subscription

The profile objects every rule names are in [Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions](kb:zbi.isolation-profiles); a tenant whose subscription covers only the Miscellaneous & Unknown category gets a fixed profile and rule, in [The Miscellaneous & Unknown subscription: a preconfigured profile, an automatic rule and five editable settings](kb:zbi.misc-unknown-subscription). Sandbox and Votiro in isolation: [Sandbox and Votiro CDR integration with isolation: flow, prerequisites and profile settings](kb:zbi.file-scanning).

What to check:
1. Whether Cloud Browser is enabled for the organization and an isolation profile exists for the rule to name.
2. Whether HTTPS traffic meant for isolation is decrypted, or matched a Do Not Inspect rule first.

Not known (open gaps):
- Whether a manual URL Filtering Isolate rule needs SSL/TLS inspection for HTTPS [gap:zbi.policy:manual-isolate-ssl]: settled by lab-test or source-read. Blocks: saying whether an Isolate rule failing on HTTPS is caused by an SSL inspection bypass

Area: zbi.policy, its subjects in references/_meta/spine/zbi/zbi.policy.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.url-filtering.actions.md (URL Filtering actions and their prerequisites): Isolate sends matching traffic through a remote browser using a chosen isolation profile, and exists only when Zero Trust Browser is enabled for the organization. [zia.url-filtering.actions:isolate-needs-zbi]
- links-to references/_meta/text/zia/zia.cloud-app-control.actions.md (Cloud App Control actions and action discovery)
- depends-on references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection): These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System. [zia.ssl-inspection.bypass-impact:dependent-features]
- decided-by references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types): Private Access has separate policy types, including access, client forwarding, isolation, timeout, redirection, AppProtection and Browser Protection policy. [zpa.policy.evaluation-order:policy-types]
- links-to references/_meta/text/zbi/zbi.file-scanning.md (Sandbox and Votiro CDR integration with isolation: flow, prerequisites and profile settings)
- links-to references/_meta/text/zbi/zbi.isolation-profiles.md (Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions)
- links-to references/_meta/text/zbi/zbi.misc-unknown-subscription.md (The Miscellaneous & Unknown subscription: a preconfigured profile, an automatic rule and five editable settings)
- links-to references/_meta/text/zbi/zbi.private-access-isolation.md (Private Access isolation policy: when private application requests go to isolation, and what else they need)
- links-to references/_meta/text/zbi/zbi.smart-isolation.md (Smart Browser Isolation: AI/ML isolation of suspicious sites, its SSL/TLS rule and its Malware Protection prerequisite)
- links-to references/_meta/text/zia/zia.iot.policy-use.md (How IoT traffic is targeted by policy)
- links-to references/_meta/text/zia/zia.terraform.url-filtering-rules.md (Terraform user agent validation and isolation on URL Filtering rules)
