# Which applications support tenant profiles, and what each profile identifies (zia.tenant-profiles.applications)
Also called: tenant profile supported apps; tenant restriction applications; MSLOGINSERVICES; CHATGPT_AI; CLAUDE_AI; app_type; appType; Docusign tenant profile; Claude tenant profile

Which applications a profile can be created for depends on whether you ask the console or the API, and they differ.

**Console.** The Help form offers fifteen cloud applications: Amazon Web Services, ChatGPT, Claude, Docusign, Dropbox, GitHub, Google, Google Cloud Platform, IBM SmartCloud, Microsoft Login Services, Slack, Webex Login Services, YouTube, Zoho Login Services and Zoom. [zia.tenant-profiles.applications:help-app-list]

**API.** The API `appType` accepts sixteen values: YOUTUBE, GOOGLE, MSLOGINSERVICES, SLACK, BOX, FACEBOOK, AWS, DROPBOX, WEBEX_LOGIN_SERVICES, AMAZON_S3, ZOHO_LOGIN_SERVICES, GOOGLE_CLOUD_PLATFORM, ZOOM, IBMSMARTCLOUD, GITHUB and CHATGPT_AI. The Go SDK declares the field as `AppType string` and the Terraform provider schema declares `app_type` as `schema.TypeString`; the Python model reads it from `appType`. [zia.tenant-profiles.applications:api-app-enum] No API `appType` value exists for Claude or Docusign, so an API, SDK or Terraform client cannot name them in the sixteen-value list. Do not infer `CLAUDE_AI` or `DOCUSIGN` from the Help labels. [zia.tenant-profiles.applications:no-claude-docusign-token] The two application lists disagree [divergence:zia.tenant-profiles.applications:help-vs-api-apps].

**What a profile identifies.** The Help form asks for a different identifier per application: AWS account IDs; ChatGPT and Claude workspace IDs; Docusign account IDs; Dropbox team IDs; GitHub enterprise slug; Google domains; Google Cloud Platform allowed organization IDs; IBM account IDs; Microsoft Tenant Directory ID with tenants (Version 1) or Tenant Directory ID:Policy ID (Version 2); Slack Workspace ID and Allowed Workspace IDs; Webex tenants; Zoho ID; Zoom policy label; and for YouTube category, channel or school IDs. [zia.tenant-profiles.applications:identifier-per-app]

**How that is stored.** A profile's identifiers are stored in the same API members whatever the application: `itemTypePrimary` and `itemDataPrimary`, `itemTypeSecondary` and `itemDataSecondary`, plus `itemValue` for YouTube categories. [zia.tenant-profiles.applications:shared-item-members] Which `itemType` token each Help field maps to is not published, and only Microsoft has a confirmed pairing, in [Microsoft Login Services tenant profiles: v1, v2, personal accounts](kb:zia.tenant-profiles.microsoft) [gap:zia.tenant-profiles.applications:item-type-per-app].

The AI & ML rule flow, where ChatGPT profiles surface in the rule UI, is covered in [AI & ML Applications rules: granular actions, prompt capture, tenant profiles](kb:zia.cloud-app-control.ai-ml-rules). Per-application options and traps: [Per-application options and traps in tenant profiles](kb:zia.tenant-profiles.app-specifics). Caps per application: [Tenant profile limits: per rule,, per organization](kb:zia.tenant-profiles.limits). Wire format: [Tenant profile API, SDK and Terraform behavior](kb:zia.tenant-profiles.api-surface).

What to check:
1. The item type token for an application not covered here, read from an existing profile with the read-only zscalerctl list.

Inferred, not quoted (say so when an answer rests on one):
- [zia.tenant-profiles.applications:no-claude-docusign-token] Tier B: Absence from the captured OpenAPI enum and the SDK docstring list. A newer API version may add them.

Sources disagree (name both sides):
- Which applications a tenant profile can be created for [divergence:zia.tenant-profiles.applications:help-vs-api-apps]
  - zscaler-help: The Help form offers Claude and Docusign, and does not mention Box, Facebook or Amazon S3.
  - api-specs: The API enum has BOX, FACEBOOK and AMAZON_S3, and no Claude or Docusign value.
  Impact: An automation built from the API enum cannot create the Claude or Docusign profiles the console offers, and a console-only reading hides three API values (BOX, FACEBOOK, AMAZON_S3) that may still be live.

Not known (open gaps):
- Which itemType token each application's profile uses [gap:zia.tenant-profiles.applications:item-type-per-app] (data gap): filled by live; run `zscalerctl zia tenancy-restriction-profiles list`; settled by tenant-data or operator-experience. Blocks: writing a profile for any application other than Microsoft without trial and error

Area: zia.tenant-profiles, its subjects in references/_meta/spine/zia/zia.tenant-profiles.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.cloud-app-control.ai-ml-rules.md (AI & ML Applications rules: granular actions, prompt capture, tenant profiles), from zia.tenant-profiles: In the AI/ML rule UI, Tenant Profiles appears only when ChatGPT is the selected cloud application, and the applications selected under the tenant profiles must not be exempted from SSL/TLS Inspection. [zia.cloud-app-control.ai-ml-rules:tenant-profiles-visibility]
- depends-on references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control), from zia.tenant-profiles: Tenancy restriction lets you restrict access to personal accounts, business accounts, or both for certain cloud applications. It has two parts: creating tenant profiles, and associating them with Cloud App Control policy rules. [zia.tenant-profiles:what-it-is]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies), from zia.tenant-profiles: Allowing a specific tenant automatically blocks other tenants for most cloud applications, and subsequent policies are not evaluated. [zia.tenant-profiles:allow-blocks-others]
- depends-on references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.tenant-profiles: Header insertion into HTTPS needs the request decrypted, so a tenant restriction can work only where the SSL/TLS inspection rule covers the login service. [zia.tenant-profiles.wire-mechanic:needs-decrypted-traffic]
- depends-on references/_meta/text/zia/zia.tenant-profiles.ssl-prerequisite.md (SSL/TLS inspection rules a tenant profile depends on), from zia.tenant-profiles: When a tenant profile is associated with a cloud application rule, the application must be selected as a criterion in an SSL/TLS Inspection rule. [zia.tenant-profiles.ssl-prerequisite:ssl-rule-required]
- links-to references/_meta/text/zia/zia.tenant-profiles.api-surface.md (Tenant profile API, SDK and Terraform behavior)
- links-to references/_meta/text/zia/zia.tenant-profiles.app-specifics.md (Per-application options and traps in tenant profiles)
- links-to references/_meta/text/zia/zia.tenant-profiles.limits.md (Tenant profile limits: per rule,, per organization)
- links-to references/_meta/text/zia/zia.tenant-profiles.microsoft.md (Microsoft Login Services tenant profiles: v1, v2, personal accounts)
