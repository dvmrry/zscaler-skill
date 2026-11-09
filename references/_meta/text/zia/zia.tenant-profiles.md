# Tenant Profiles: SaaS tenant restriction (zia.tenant-profiles)
Also called: tenant profile; tenant profiles; tenancy restriction; tenant restriction; SaaS tenant restriction; corporate-only access; tenancyRestrictionProfile; zia_tenant_restriction_profile; tenancy_profile_ids; block personal accounts

"Can users still sign in to a personal or third-party tenant of this SaaS app?" is answered by a tenant profile and the Cloud App Control (CAC) rule that uses it. Tenancy restriction lets you restrict access to personal accounts, business accounts, or both for certain cloud applications. It has two parts: creating tenant profiles, and associating them with Cloud App Control policy rules. [zia.tenant-profiles:what-it-is] Despite the name, this is not a multi-tenancy feature. A tenant profile is a SaaS-application tenant object. It is not a ZIA sub-tenant, microtenant or MSP-scoping setting. [zia.tenant-profiles:not-microtenants]

**What a profile is.** Each tenant profile is created for one cloud application; the Tenant Profiles page lists a Cloud Application and its configuration details for every profile. [zia.tenant-profiles:one-app-per-profile] A tenant profile needs a unique name, which is the label shown when configuring Cloud App Control rules. The description is optional and cannot exceed 10,240 characters. [zia.tenant-profiles:create-form] The profile does nothing until a CAC rule references it: A Cloud App Control rule holds its tenant profiles in `tenancyProfileIds` (Terraform `tenancy_profile_ids`), a list of profile references. [zia.tenant-profiles:rule-reference-field] How a rule's criteria combine is in [A Cloud App Control rule matches on the logical expression: [Cloud Applications OR Cloud Application Instances OR Cloud Application Risk Profile] AND [Groups OR Users OR Departments] AND [Location Groups OR Locations] AND Time AND [Devices OR Device Groups OR Device Trust Level OR CONNECT User-Agent OR User Risk Profile].](kb:zia.cloud-app-control.rule-criteria:criteria-expression), rule order in [Within Cloud App Control, rules evaluate top-down in ascending order, and a disabled rule is skipped while keeping its place, the same as URL Filtering.](kb:zia.cloud-app-control.precedence:cac-rule-order), and the per-category rule cap in [The Cloud App Control rule limit is 127 rules per cloud app category (raisable to 2,048 through Zscaler support), not a tenant-wide cap.](kb:zia.cloud-app-control.rule-types:rule-cap-per-category).

**What an allow rule does.** Allowing a specific tenant automatically blocks other tenants for most cloud applications, and subsequent policies are not evaluated. [zia.tenant-profiles:allow-blocks-others] For YouTube and Amazon Web Services, subsequent policies are still evaluated after the allow, so an explicit block policy is required to block other tenants. [zia.tenant-profiles:youtube-aws-explicit-block]

**Where to look next.**
- Why the restriction works at all, and which headers ZIA adds: [How a tenant profile is enforced: the headers ZIA inserts](kb:zia.tenant-profiles.wire-mechanic).
- The SSL/TLS inspection rules the restriction needs, per application: [SSL/TLS inspection rules a tenant profile depends on](kb:zia.tenant-profiles.ssl-prerequisite).
- Which applications are supported and what each profile holds: [Which applications support tenant profiles, and what each profile identifies](kb:zia.tenant-profiles.applications), with per-application options in [Per-application options and traps in tenant profiles](kb:zia.tenant-profiles.app-specifics) and Microsoft's two versions in [Microsoft Login Services tenant profiles: v1, v2, personal accounts](kb:zia.tenant-profiles.microsoft).
- Caps per rule, profile and organization: [Tenant profile limits: per rule,, per organization](kb:zia.tenant-profiles.limits).
- API, SDK and Terraform behavior, including the older provider cap: [Tenant profile API, SDK and Terraform behavior](kb:zia.tenant-profiles.api-surface).
- The AI & ML rule flow, where Tenant Profiles appears for ChatGPT: [In the AI/ML rule UI, Tenant Profiles appears only when ChatGPT is the selected cloud application, and the applications selected under the tenant profiles must not be exempted from SSL/TLS Inspection.](kb:zia.cloud-app-control.ai-ml-rules:tenant-profiles-visibility).

**Open points.** What deleting a profile that a rule uses does is open [gap:zia.tenant-profiles:delete-referenced-profile]. What a stale identifier does after a tenant change is open [gap:zia.tenant-profiles:identity-change-staleness].

What to check:
1. Which CAC rules reference a profile, before deleting it.
2. Whether a tenant identifier change, such as a tenant migration, requires re-reading the profile.
3. Whether an explicit block rule exists for other tenants on YouTube and Amazon Web Services.

Inferred, not quoted (say so when an answer rests on one):
- [zia.tenant-profiles:not-microtenants] Tier B: No source contrasts tenant profiles with microtenants. This follows from the definition: the profile names a cloud application and identifiers inside it.

Not known (open gaps):
- What happens when a tenant profile in use by a rule is deleted [gap:zia.tenant-profiles:delete-referenced-profile]: settled by lab-test. Blocks: advising whether a profile can be deleted before detaching it from rules
- What a stale tenant identifier does after a tenant migration or domain rename [gap:zia.tenant-profiles:identity-change-staleness]: settled by lab-test. Blocks: knowing whether a wrong identifier fails closed or open

Area: zia.tenant-profiles, its subjects in references/_meta/spine/zia/zia.tenant-profiles.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.cloud-app-control.ai-ml-rules.md (AI & ML Applications rules: granular actions, prompt capture, tenant profiles): In the AI/ML rule UI, Tenant Profiles appears only when ChatGPT is the selected cloud application, and the applications selected under the tenant profiles must not be exempted from SSL/TLS Inspection. [zia.cloud-app-control.ai-ml-rules:tenant-profiles-visibility]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies): Allowing a specific tenant automatically blocks other tenants for most cloud applications, and subsequent policies are not evaluated. [zia.tenant-profiles:allow-blocks-others]
- depends-on references/_meta/text/zia/zia.tenant-profiles.ssl-prerequisite.md (SSL/TLS inspection rules a tenant profile depends on): When a tenant profile is associated with a cloud application rule, the application must be selected as a criterion in an SSL/TLS Inspection rule. [zia.tenant-profiles.ssl-prerequisite:ssl-rule-required]
- depends-on references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control): Tenancy restriction lets you restrict access to personal accounts, business accounts, or both for certain cloud applications. It has two parts: creating tenant profiles, and associating them with Cloud App Control policy rules. [zia.tenant-profiles:what-it-is]
- depends-on references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)): Header insertion into HTTPS needs the request decrypted, so a tenant restriction can work only where the SSL/TLS inspection rule covers the login service. [zia.tenant-profiles.wire-mechanic:needs-decrypted-traffic]
- links-to references/_meta/text/zia/zia.cloud-app-control.rule-criteria.md (What a Cloud App Control rule matches on)
- links-to references/_meta/text/zia/zia.cloud-app-control.rule-types.md (Cloud App Control categories (rule types), limits and predefined rules)
- links-to references/_meta/text/zia/zia.tenant-profiles.api-surface.md (Tenant profile API, SDK and Terraform behavior)
- links-to references/_meta/text/zia/zia.tenant-profiles.app-specifics.md (Per-application options and traps in tenant profiles)
- links-to references/_meta/text/zia/zia.tenant-profiles.applications.md (Which applications support tenant profiles, and what each profile identifies)
- links-to references/_meta/text/zia/zia.tenant-profiles.limits.md (Tenant profile limits: per rule,, per organization)
- links-to references/_meta/text/zia/zia.tenant-profiles.microsoft.md (Microsoft Login Services tenant profiles: v1, v2, personal accounts)
- links-to references/_meta/text/zia/zia.tenant-profiles.wire-mechanic.md (How a tenant profile is enforced: the headers ZIA inserts)
