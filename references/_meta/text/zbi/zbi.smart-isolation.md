# Smart Browser Isolation: AI/ML isolation of suspicious sites, its SSL/TLS rule and its Malware Protection prerequisite (zbi.smart-isolation)
Also called: smart browser isolation; smart isolation; ai ml isolation; smart isolate; smart isolation not working; smart isolation ssl rule

A Smart Browser Isolation policy automatically isolates potentially malicious web content using AI/ML models: it identifies suspicious websites, decrypts them using SSL/TLS Inspection, and shows the user a rendition of the site in a remote browser through Zero Trust Browser. [zbi.smart-isolation:purpose]

**Prerequisites.** For the Smart Browser Isolation policy to work, the Inspect Inbound Traffic and Inspect Outbound Traffic toggles must be enabled on the Malware Protection page. [zbi.smart-isolation:malware-toggles] Enabling AI/ML based Smart Browser Isolation automatically creates an editable SSL/TLS Inspection rule to decrypt suspicious websites. [zbi.smart-isolation:ssl-rule-created] Features that need decryption are listed in [These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System.](kb:zia.ssl-inspection.bypass-impact:dependent-features). What an admin sees when either prerequisite is missing or the created rule is changed is open [gap:zbi.smart-isolation:failure-signals].

**Scope and profile.** The policy can be scoped to up to 32 users and up to 32 groups; Zscaler Support can raise either limit. [zbi.smart-isolation:scope-limits] If no users are selected, policy evaluation ignores the Users criterion, and likewise for Groups. [zbi.smart-isolation:empty-criteria] The policy names one isolation profile, chosen from the profiles already created for the organization in the Zscaler Admin Console. [zbi.smart-isolation:profile-choice] The Internet & SaaS isolation profile article says that when configuring a Smart Isolation Policy you must create isolation profiles. [zbi.smart-isolation:profiles-required]

**Automation.** The Terraform provider writes Smart Isolation through a second endpoint, [The browser control policy resource writes its settings with one PUT to the base browser control endpoint and then, only when Smart Isolation is configured or changed, a second PUT to the `/smartIsolation` endpoint. This is the same on create and on update, and an error from the second write is returned after the first was sent.](kb:zia.terraform.multi-step-writes:browser-control-two-endpoint-write), and sends a profile only when it holds a real value, [The browser control resource treats a `smart_isolation_profile` as configured only when its `id`, `name` or `url` is non-empty, because the service reports an all-zero profile object on tenants that have none and a bare block in HCL flattens to empty strings.](kb:zia.terraform.settings:profile-needs-real-value). The Python SDK names its user and group keyword arguments two ways: [zia.sdk-python.service-behaviors:smart-isolation-kwarg-names](kb:zia.sdk-python.service-behaviors:smart-isolation-kwarg-names).

Whether the classifier is the one Advanced Threat Protection uses is open [gap:zbi.smart-isolation:classifier-identity].

What to check:
1. Whether Inspect Inbound Traffic and Inspect Outbound Traffic are both on in the Malware Protection policy.
2. Whether the SSL/TLS Inspection rule created when Smart Isolation was enabled still decrypts suspicious sites.
3. Whether the user or one of the user's groups is in the policy's scope, or the scope is empty.

Not known (open gaps):
- What an admin sees when Smart Isolation's prerequisites are missing or its SSL rule is changed [gap:zbi.smart-isolation:failure-signals]: settled by lab-test or tenant-data. Blocks: diagnosing a tenant where Smart Isolation is enabled but never isolates
- Whether Smart Isolation uses the same AI/ML classifier as Advanced Threat Protection [gap:zbi.smart-isolation:classifier-identity]: settled by source-read or support-ticket. Blocks: predicting whether a site ATP flags will also be smart-isolated

Area: zbi.smart-isolation, its subjects in references/_meta/spine/zbi/zbi.smart-isolation.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.ssl-inspection.bypass-impact.md (What stops working when traffic bypasses SSL/TLS inspection): These ZIA security features need decrypted traffic to work on encrypted transactions: Anti-Virus/Malware, Cloud Sandbox, Advanced Threat Prevention, Isolation, Data Loss Prevention, File Type Control, Inline CASB and the Intrusion Prevention System. [zia.ssl-inspection.bypass-impact:dependent-features]
- depends-on references/_meta/text/zia/zia.malware-protection.md (ZIA Malware Protection): For the Smart Browser Isolation policy to work, the Inspect Inbound Traffic and Inspect Outbound Traffic toggles must be enabled on the Malware Protection page. [zbi.smart-isolation:malware-toggles]
- interacts-with references/_meta/text/zia/zia.ssl-inspection.rules.md (SSL/TLS inspection rule order, predefined and default rules, limits): Enabling AI/ML based Smart Browser Isolation automatically creates an editable SSL/TLS Inspection rule to decrypt suspicious websites. [zbi.smart-isolation:ssl-rule-created]
- links-to references/_meta/text/zia/zia.sdk-python.service-behaviors.md (Python SDK service-specific behavior for ZIA: admin, AppTotal, browser control, smart isolation and GRE tunnel VIPs)
- links-to references/_meta/text/zia/zia.terraform.multi-step-writes.md (ZIA Terraform operations that take several API writes with no rollback)
- links-to references/_meta/text/zia/zia.terraform.settings.md (Terraform global settings resources: URL lists, end user notification and browser control)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zbi/zbi.policy.md (What sends traffic to Cloud Browser: Internet & SaaS rules, Smart Isolation and the Private Access isolation policy)
