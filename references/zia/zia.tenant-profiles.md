"Can users still sign in to a personal or third-party tenant of this SaaS app?" is answered by a tenant profile and the Cloud App Control (CAC) rule that uses it. {{what-it-is}} Despite the name, this is not a multi-tenancy feature. {{not-microtenants}}

**What a profile is.** {{one-app-per-profile}} {{create-form}} The profile does nothing until a CAC rule references it: {{rule-reference-field}} How a rule's criteria combine is in [[zia.cloud-app-control.rule-criteria:criteria-expression]], rule order in [[zia.cloud-app-control.precedence:cac-rule-order]], and the per-category rule cap in [[zia.cloud-app-control.rule-types:rule-cap-per-category]].

**What an allow rule does.** {{allow-blocks-others}} {{youtube-aws-explicit-block}} For those two, check that an explicit block rule exists; otherwise other tenants stay reachable.

**Where to look next.**

- Why the restriction works at all, and which headers ZIA adds: [[zia.tenant-profiles.wire-mechanic]].
- The SSL/TLS inspection rules the restriction needs, per application: [[zia.tenant-profiles.ssl-prerequisite]].
- Which applications are supported and what each profile holds: [[zia.tenant-profiles.applications]], with per-application options in [[zia.tenant-profiles.app-specifics]] and Microsoft's two versions in [[zia.tenant-profiles.microsoft]].
- Caps per rule, profile and organization: [[zia.tenant-profiles.limits]].
- API, SDK and Terraform behavior, including the older provider cap: [[zia.tenant-profiles.api-surface]].
- The AI & ML rule flow, where Tenant Profiles appears for ChatGPT: [[zia.cloud-app-control.ai-ml-rules:tenant-profiles-visibility]].

**Open points.** Two statements from the old guide have no source: what deleting a profile that a rule uses does (gap `delete-referenced-profile`), and what a stale identifier does after a tenant change (gap `identity-change-staleness`). Audit dependent rules before deleting a profile, and treat an identifier change as a reason to re-read the profile.
