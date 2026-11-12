# Per-application options and traps in tenant profiles (zia.tenant-profiles.app-specifics)
Also called: google consumer access; allow_google_consumers; allow_google_visitors; allow_gcp_cloud_storage_read; slack workspace id; aws cli tenant restriction; youtube channel restriction; dropbox network control

Each application has options or traps that the general model hides.

**Google.** A Google profile has two options, both defaulting to No: Allow Consumer Access (consumer access to the profile's domains) and Allow Visitor Access (visitor access to them). The API flags are `allowGoogleConsumers` and `allowGoogleVisitors`. [zia.tenant-profiles.app-specifics:google-consumer-visitor] The meaning of a visitor session is open [gap:zia.tenant-profiles.app-specifics:google-visitor-meaning]. A Google Cloud Platform profile has Allow Cloud Storage Resources (default No), which lets users access public cloud storage resources. The API flag is `allowGcpCloudStorageRead`, described as allowing or disallowing cloud storage resources for GCP. [zia.tenant-profiles.app-specifics:gcp-cloud-storage]

**AWS.** ZIA supports tenancy restriction for AWS console sign-in (root or IAM user), federated identity sign-in, and AWS CLI or programmatic sign-in. Through the CLI it is not supported for a list of named services that the Help article enumerates, among them Amazon S3, Amazon Bedrock and AWS Identity and Access Management. [zia.tenant-profiles.app-specifics:aws-login-methods] The Help says tenancy restriction via CLI is not supported for those services; see also the explicit block rule needed for AWS in [Tenant Profiles: SaaS tenant restriction](kb:zia.tenant-profiles).

**Slack.** A wrong value in the Slack Your Workspace ID field can let Slack traffic through to any Slack workspace, a security gap. [zia.tenant-profiles.app-specifics:slack-wrong-workspace]

**Dropbox.** The Dropbox header value is the business account's team ID, which comes from the network control section of the Dropbox Business admin console. [zia.tenant-profiles.app-specifics:dropbox-team-id-source] Network control must be on in Dropbox; see [How a tenant profile is enforced: the headers ZIA inserts](kb:zia.tenant-profiles.wire-mechanic).

**GitHub and Zoom.** A GitHub profile holds one enterprise slug, and only one Zoom tenant profile can be associated with a Cloud App Control rule. [zia.tenant-profiles.app-specifics:github-zoom-singletons]

**YouTube.** A YouTube profile is configured as one of three types: YouTube Category ID (a pick-list of categories, any number), YouTube Channel ID, or YouTube School ID. The API carries categories in `itemValue`. [zia.tenant-profiles.app-specifics:youtube-config] YouTube also needs an explicit block rule for other tenants; see [Tenant Profiles: SaaS tenant restriction](kb:zia.tenant-profiles).

Per-application counts are in [Tenant profile limits: per rule,, per organization](kb:zia.tenant-profiles.limits). The identifiers each profile takes are in [Which applications support tenant profiles, and what each profile identifies](kb:zia.tenant-profiles.applications).

Not known (open gaps):
- What a Google visitor session is [gap:zia.tenant-profiles.app-specifics:google-visitor-meaning]: settled by source-read or lab-test

Area: zia.tenant-profiles, its subjects in references/_meta/spine/zia/zia.tenant-profiles.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.tenant-profiles.md (Tenant Profiles: SaaS tenant restriction)
- depends-on references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control), from zia.tenant-profiles: Tenancy restriction lets you restrict access to personal accounts, business accounts, or both for certain cloud applications. It has two parts: creating tenant profiles, and associating them with Cloud App Control policy rules. [zia.tenant-profiles:what-it-is]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.ai-ml-rules.md (AI & ML Applications rules: granular actions, prompt capture, tenant profiles), from zia.tenant-profiles: In the AI/ML rule UI, Tenant Profiles appears only when ChatGPT is the selected cloud application, and the applications selected under the tenant profiles must not be exempted from SSL/TLS Inspection. [zia.cloud-app-control.ai-ml-rules:tenant-profiles-visibility]
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies), from zia.tenant-profiles: Allowing a specific tenant automatically blocks other tenants for most cloud applications, and subsequent policies are not evaluated. [zia.tenant-profiles:allow-blocks-others]
- depends-on references/_meta/text/zia/zia.ssl-inspection.pipeline.md (Where SSL inspection sits in ZIA web policy evaluation (the two passes)), from zia.tenant-profiles: Header insertion into HTTPS needs the request decrypted, so a tenant restriction can work only where the SSL/TLS inspection rule covers the login service. [zia.tenant-profiles.wire-mechanic:needs-decrypted-traffic]
- depends-on references/_meta/text/zia/zia.tenant-profiles.ssl-prerequisite.md (SSL/TLS inspection rules a tenant profile depends on), from zia.tenant-profiles: When a tenant profile is associated with a cloud application rule, the application must be selected as a criterion in an SSL/TLS Inspection rule. [zia.tenant-profiles.ssl-prerequisite:ssl-rule-required]
- links-to references/_meta/text/zia/zia.tenant-profiles.applications.md (Which applications support tenant profiles, and what each profile identifies)
- links-to references/_meta/text/zia/zia.tenant-profiles.limits.md (Tenant profile limits: per rule,, per organization)
- links-to references/_meta/text/zia/zia.tenant-profiles.wire-mechanic.md (How a tenant profile is enforced: the headers ZIA inserts)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/tenancy-restriction-profiles.md (config type)
