# Tenant profile limits: per rule,, per organization (zia.tenant-profiles.limits)
Also called: tenant profile limits; how many tenant profiles per rule; max workspace ids; tenant profile capacity; 16 tenant profiles per rule

There are three levels of cap: per rule, per profile, and per organization or across profiles.

**Per rule.** A Cloud App Control rule can have up to 16 tenant profiles associated with it. [zia.tenant-profiles.limits:per-rule-cap] Do not confuse this with a different row: The '16 tenants per SaaS application' limit sits in the SaaS Application Tenants section and concerns sanctioned SaaS application tenants; it is separate from the Tenant Profiles per Rule row under URL Filtering and Cloud App Control. [zia.tenant-profiles.limits:saas-tenants-not-profiles]

**Per profile and across profiles, by application.**
- AWS: 256 account IDs, each 12 digits, and at most 2,048 across all profiles. [zia.tenant-profiles.limits:aws]
- ChatGPT: 128 workspace IDs, each up to 64 characters, and a rule can associate at most 16 tenant profiles or 20 workspace IDs. [zia.tenant-profiles.limits:chatgpt]
- Claude: 16 workspace IDs, each up to 64 characters, and at most 64 workspace IDs per organization. [zia.tenant-profiles.limits:claude]
- Docusign: 16 account IDs, each up to 64 characters, and at most 64 account IDs per organization. [zia.tenant-profiles.limits:docusign]
- Dropbox: 100 team IDs, each up to 64 characters. [zia.tenant-profiles.limits:dropbox]
- GitHub: one enterprise slug, up to 256 characters, at most 100 GitHub profiles per organization, and one GitHub profile per rule. [zia.tenant-profiles.limits:github]
- Google apps: 100 domains, each up to 160 characters, and at most 2,048 across all profiles. [zia.tenant-profiles.limits:google-domains]
- Google Cloud Platform: 100 organization IDs, each up to 64 characters, and at most 2,048 across all profiles. [zia.tenant-profiles.limits:gcp]
- IBM SmartCloud: 100 account IDs, each up to 64 characters, at most 100 per rule and 256 across all profiles. [zia.tenant-profiles.limits:ibm]
- Microsoft Login Services: Version 1 takes one tenant directory (up to 64 characters) and up to 500 Microsoft 365 tenants or tenant IDs (each up to 64 characters). Version 2 takes one Tenant Directory ID:Policy ID value of up to 256 characters. [zia.tenant-profiles.limits:microsoft]
- Slack: 100 workspace IDs in Your Workspace ID and 256 in Allowed Workspace ID, each up to 64 characters. [zia.tenant-profiles.limits:slack]
- YouTube: 200 channel IDs (up to 100 characters each) and 100 school IDs (up to 127 characters each). [zia.tenant-profiles.limits:youtube]
- Webex: 100 tenants and at most 250 across all profiles. [zia.tenant-profiles.limits:webex]
- Zoho: 120 Zoho IDs, each up to 127 characters, and at most 2,048 across all profiles. [zia.tenant-profiles.limits:zoho]
- Zoom: one policy label, up to 64 characters. [zia.tenant-profiles.limits:zoom]

**Two pages disagree.** The Adding Tenant Profiles form states some counts differently from this table [divergence:zia.tenant-profiles.limits:adding-vs-limits-page]. How many identifiers of a type are already in use across profiles is open [gap:zia.tenant-profiles.limits:live-count-vs-cap]; the call that returns it is in [Tenant profile API, SDK and Terraform behavior](kb:zia.tenant-profiles.api-surface).

The rule-level cap applies to the CAC rule, whose own count limits are in [Cloud App Control categories (rule types), limits and predefined rules](kb:zia.cloud-app-control.rule-types). A Terraform provider older than 4.7.23 stopped lower; see [Tenant profile API, SDK and Terraform behavior](kb:zia.tenant-profiles.api-surface).

What to check:
1. How many identifiers an application already has in use across profiles, checked before loading more.

Inferred, not quoted (say so when an answer rests on one):
- [zia.tenant-profiles.limits:saas-tenants-not-profiles] Tier B: Read from the section heading the row sits under; the row does not mention tenant profiles.

Sources disagree (name both sides):
- Per-profile identifier counts for AWS, ChatGPT and Zoho [divergence:zia.tenant-profiles.limits:adding-vs-limits-page]
  - zscaler-help: The Adding Tenant Profiles form allows 512 AWS account IDs and 128 Zoho IDs.
  - zscaler-help: The same form allows 16 ChatGPT workspace IDs.
  - zscaler-help: The Ranges and Limitations table gives 256 AWS account IDs and 120 Zoho IDs.
  - zscaler-help: The same table gives 128 ChatGPT workspace IDs.
  Impact: A bulk load sized to one page may be rejected or may succeed against the other. Check the live count with the app-item-count call before loading, and do not quote either number as the cap without saying which page it came from.

Not known (open gaps):
- How many identifiers of a type are already in use across profiles [gap:zia.tenant-profiles.limits:live-count-vs-cap] (data gap): filled by operator; settled by tenant-data

Area: zia.tenant-profiles, its subjects in references/_meta/spine/zia/zia.tenant-profiles.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.tenant-profiles.api-surface.md (Tenant profile API, SDK and Terraform behavior)
- depends-on references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control), from zia.tenant-profiles: Tenancy restriction lets you restrict access to personal accounts, business accounts, or both for certain cloud applications. It has two parts: creating tenant profiles, and associating them with Cloud App Control policy rules. [zia.tenant-profiles:what-it-is]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.ai-ml-rules.md (AI & ML Applications rules: granular actions, prompt capture, tenant profiles), from zia.tenant-profiles: In the AI/ML rule UI, Tenant Profiles appears only when ChatGPT is the selected cloud application, and the applications selected under the tenant profiles must not be exempted from SSL/TLS Inspection. [zia.cloud-app-control.ai-ml-rules:tenant-profiles-visibility]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies), from zia.tenant-profiles: Allowing a specific tenant automatically blocks other tenants for most cloud applications, and subsequent policies are not evaluated. [zia.tenant-profiles:allow-blocks-others]
- depends-on references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.tenant-profiles: Header insertion into HTTPS needs the request decrypted, so a tenant restriction can work only where the SSL/TLS inspection rule covers the login service. [zia.tenant-profiles.wire-mechanic:needs-decrypted-traffic]
- depends-on references/_meta/text/zia/zia.tenant-profiles.ssl-prerequisite.md (SSL/TLS inspection rules a tenant profile depends on), from zia.tenant-profiles: When a tenant profile is associated with a cloud application rule, the application must be selected as a criterion in an SSL/TLS Inspection rule. [zia.tenant-profiles.ssl-prerequisite:ssl-rule-required]
- links-to references/_meta/text/zia/zia.cloud-app-control.rule-types.md (Cloud App Control categories (rule types), limits and predefined rules)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.tenant-profiles.md (Tenant Profiles: SaaS tenant restriction)
