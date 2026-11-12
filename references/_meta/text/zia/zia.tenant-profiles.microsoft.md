# Microsoft Login Services tenant profiles: v1, v2, personal accounts (zia.tenant-profiles.microsoft)
Also called: microsoft tenant restriction; ms_login_services_tr_v2; restrict_personal_o365_domains; tenant restrictions v2; Tenant Directory ID; Policy ID; login.live.com personal accounts; office 365 tenant restriction
Former IDs: zia-67

Microsoft Login Services is the profile with the most settings.

**Two versions.** A Microsoft Login Services profile is Version 1 or Version 2. Version 1 takes a Tenant Directory ID plus Office 365 tenant names or IDs. Version 2 takes a Tenant Directory ID:Policy ID value, the tenant directory ID followed by the policy ID with a colon in between. [zia.tenant-profiles.microsoft:two-versions] The version of a Microsoft tenant profile can be changed only while the profile is not associated with any policy. [zia.tenant-profiles.microsoft:version-lock] How the two differ on the wire is open [gap:zia.tenant-profiles.microsoft:v1-v2-semantics]; the Help limits table only shows that the identifiers have different lengths, see [Tenant profile limits: per rule,, per organization](kb:zia.tenant-profiles.limits). Whether a Version 1 profile on a Version 2 tenant fails open is open [gap:zia.tenant-profiles.microsoft:v1-for-v2-tenant-fails-open].

**Finding the IDs.** The Version 2 Policy ID is found by calling `/crosstenantaccesspolicy/default` and using the `id` field of the response; the Tenant Directory ID comes from the Azure Active Directory portal Properties page. [zia.tenant-profiles.microsoft:v2-policy-id-source]

**Personal accounts.** Allow Personal Office 365 Domains defaults to Yes. Setting it to No blocks personal Microsoft accounts, by inserting the `sec-Restrict-Tenant-Access-Policy` header on login.live.com traffic. [zia.tenant-profiles.microsoft:personal-domains-default] The headers that result are in [How a tenant profile is enforced: the headers ZIA inserts](kb:zia.tenant-profiles.wire-mechanic). The API carries the settings as booleans: The API carries the two Microsoft options as booleans on the profile: `restrictPersonalO365Domains` (restrict personal Office 365 domains) and `msLoginServicesTrV2` (choose between v1 and v2 for tenant restriction on MSLOGINSERVICES). [zia.tenant-profiles.microsoft:api-flags] The console's Allow Personal Office 365 Domains = No corresponds to `restrictPersonalO365Domains = true`; the two read in opposite directions. [zia.tenant-profiles.microsoft:ui-to-api-inversion] Note the Go SDK drops a false flag; see [Tenant profile API, SDK and Terraform behavior](kb:zia.tenant-profiles.api-surface).

**Rules to follow.** A Microsoft Login Services profile takes only one tenant directory ID, does not allow wildcard domains, and several profiles may be associated with one rule only if their tenant directory IDs are the same. [zia.tenant-profiles.microsoft:caveats] The authentication caveat for Version 1 and the Office 365 inspection rule order are in [SSL/TLS inspection rules a tenant profile depends on](kb:zia.tenant-profiles.ssl-prerequisite).

**In code.** The Python SDK's documented Microsoft example creates the profile with `TENANT_RESTRICTION_TENANT_DIRECTORY` as the primary item type (the directory ID) and `TENANT_RESTRICTION_TENANT_NAME` as the secondary (the tenant domain names). [zia.tenant-profiles.microsoft:sdk-example-tokens]

What to check:
1. Whether the profile version matches the tenant, since whether a Version 1 profile on a Version 2 tenant fails open is an open question.
2. Whether every profile associated with one rule shares one tenant directory ID.
3. Whether the login services are decrypted, before reading the profile.

Inferred, not quoted (say so when an answer rests on one):
- [zia.tenant-profiles.microsoft:ui-to-api-inversion] Tier B: Mapped from the field names and descriptions; no source states the correspondence.

Not known (open gaps):
- What Version 1 and Version 2 differ in, and which Microsoft tenants need Version 2 [gap:zia.tenant-profiles.microsoft:v1-v2-semantics]: settled by support-ticket or lab-test. Blocks: choosing a version for a tenant, and diagnosing a v1/v2 mismatch
- Whether a Version 1 profile on a Version 2 tenant fails open [gap:zia.tenant-profiles.microsoft:v1-for-v2-tenant-fails-open]: settled by lab-test. Blocks: a confident diagnosis of a restriction that allows other tenants

Area: zia.tenant-profiles, its subjects in references/_meta/spine/zia/zia.tenant-profiles.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.tenant-profiles.ssl-prerequisite.md (SSL/TLS inspection rules a tenant profile depends on): For Office 365, the SSL/TLS Inspection rule selects Microsoft Login Services as the cloud application and must sit at a rule order higher than the Office 365 One Click Rule. [zia.tenant-profiles.ssl-prerequisite:office365-rule]
- interacts-with references/_meta/text/zia/zia.authentication.exemptions.md (Destinations that skip authentication): For the Microsoft Version 1 profile, the Help form says not to exempt the tenant domains from authentication. [zia.tenant-profiles.ssl-prerequisite:microsoft-no-auth-exemption]
- depends-on references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control), from zia.tenant-profiles: Tenancy restriction lets you restrict access to personal accounts, business accounts, or both for certain cloud applications. It has two parts: creating tenant profiles, and associating them with Cloud App Control policy rules. [zia.tenant-profiles:what-it-is]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.ai-ml-rules.md (AI & ML Applications rules: granular actions, prompt capture, tenant profiles), from zia.tenant-profiles: In the AI/ML rule UI, Tenant Profiles appears only when ChatGPT is the selected cloud application, and the applications selected under the tenant profiles must not be exempted from SSL/TLS Inspection. [zia.cloud-app-control.ai-ml-rules:tenant-profiles-visibility]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies), from zia.tenant-profiles: Allowing a specific tenant automatically blocks other tenants for most cloud applications, and subsequent policies are not evaluated. [zia.tenant-profiles:allow-blocks-others]
- interacts-with references/_meta/text/zia/zia.saas-apps.tenant-restriction-order.md (Tenant restriction does nothing: bypass rule ahead of the login inspection rule): If a Do Not Inspect rule for Microsoft 365 traffic (the O365 One Click rule, or the Click-to-Run exemption) sits earlier in the SSL Inspection order than the Microsoft Login Services inspection rule and matches the login request, the login is not decrypted, so Microsoft's tenant-restriction headers cannot be inserted and the tenant profile has no effect. [zia.saas-apps.tenant-restriction-order:bypass-first-disables-restriction]
- depends-on references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.tenant-profiles: Header insertion into HTTPS needs the request decrypted, so a tenant restriction can work only where the SSL/TLS inspection rule covers the login service. [zia.tenant-profiles.wire-mechanic:needs-decrypted-traffic]
- links-to references/_meta/text/zia/zia.tenant-profiles.api-surface.md (Tenant profile API, SDK and Terraform behavior)
- links-to references/_meta/text/zia/zia.tenant-profiles.limits.md (Tenant profile limits: per rule,, per organization)
- links-to references/_meta/text/zia/zia.tenant-profiles.wire-mechanic.md (How a tenant profile is enforced: the headers ZIA inserts)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/tenancy-restriction-profiles.md (config type)
- see-also references/_meta/text/zia/zia.tenant-profiles.md (Tenant Profiles: SaaS tenant restriction)
