# Authentication levels: the level tree, validity periods, acr mapping and the message to users (zidentity.step-up.levels)
Also called: authentication levels; AL1; AL2; AL4; authentication level tree; authentication level validity; sub-level validity must be greater; acr mapping; message to the user step-up
Former IDs: zid-28, zid-30

Policies ask for a level, and a level sits in a tree. The help gives AL1 to AL4 as an example of authentication levels, representing increasing strength; each level's name is entered by the admin when the level is created. [zidentity.step-up.levels:al-naming]

**What a level holds.** A level has a name, a validity period, a description and an optional message shown to users through Zscaler Client Connector notifications when they access resources that require the level; sub-levels are created beneath a level with the same fields, and several sub-levels form a tree. [zidentity.step-up.levels:level-fields]

**Limits.** [Each level has a validity period in minutes, hours or days, and a parent level's validity must be less than that of any of its sub-levels. A tree of levels can hold at most 32 levels and no branch can be deeper than 4.](kb:zia.authentication.step-up:level-limits) So in the tree a parent level is the stronger one: authenticating at it satisfies policies that require its sub-levels, and its validity must be shorter than theirs. A tree whose root is the weakest level, with longer validity on the stronger levels beneath it, reads the help the wrong way round. [zidentity.step-up.levels:parent-stronger] Whether the console rejects a tree that breaks these limits at save is not documented [gap:zidentity.step-up.levels:save-validation].

**After the levels.** After the levels are configured, access policies that use them have to be created in the supported Zscaler services. [zidentity.step-up.levels:policies-next] With an OIDC external IdP each level is mapped to its acr value in the IdP: [Step-up authentication is supported only with OIDC-based external IdP integrations; when an external IdP is used via OIDC, each authentication level must be mapped to its acr value in the IdP.](kb:zia.authentication.step-up:oidc-only). In Levels to Authentication Context Mapping the Auth0 guide has the ACR claim value entered for each authentication level, following the hierarchy of the levels, with the highest level mapped to the ACR claim value for the strongest context; the Configuring Step-Up Authentication page gives the same mapping rule. [zidentity.step-up.levels:acr-hierarchy] What happens when the IdP's acr values and the mapping disagree is open [gap:zidentity.step-up.levels:acr-mismatch].

**One tree or several.** Whether levels are one tenant-wide tree shared by every product is open [gap:zidentity.step-up.levels:per-product], and whether the message to users can be localized is open [gap:zidentity.step-up.levels:message-localization].

**From the ZPA API.** ZPA's SDKs can only read the levels: [The Go step_up_auth service's `GetStepupAuthLevel` and the Python stepup_auth_level module's `get_step_up_auth_levels` read the /stepupauthlevel path, and the OpenAPI document has no route at that path.](kb:zpa.api.legacy-endpoints:stepup-no-writes), with a shape disagreement in [ZPA policy rule wire behavior: routes, request fields and ordering](kb:zpa.api.policy-wire).

What to check:
1. When a tree will not save, whether each parent's validity is shorter than every sub-level's, the tree has at most 32 levels and no branch is deeper than 4.
2. Whether each level is mapped to the acr value the IdP actually issues.

Inferred, not quoted (say so when an answer rests on one):
- [zidentity.step-up.levels:parent-stronger] Tier B: The help does not say in one sentence that a parent is stronger than its sub-levels. It says authenticating at a higher level satisfies policies that require a sub-level, and that a parent's validity must be less than its sub-levels'; read together they put the stronger, shorter-lived level above.

Not known (open gaps):
- Whether the console rejects a level tree that breaks the limits [gap:zidentity.step-up.levels:save-validation]: settled by lab-test. Blocks: explaining a failed save of authentication levels
- What happens when the IdP's acr value does not match the level mapping [gap:zidentity.step-up.levels:acr-mismatch]: settled by lab-test. Blocks: diagnosing a user who completes MFA but is still denied
- Whether authentication levels are one tenant-wide tree or can differ per product [gap:zidentity.step-up.levels:per-product]: settled by tenant-data or source-read. Blocks: designing levels for ZIA and ZPA separately
- Whether the message to users can be localized [gap:zidentity.step-up.levels:message-localization]: settled by tenant-data or source-read. Blocks: planning step-up notifications for a multilingual workforce

Area: zidentity.step-up, its subjects in references/_meta/spine/zidentity/zidentity.step-up.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.authentication.step-up.md (Step-up authentication and ZIdentity authentication levels): Step-up authentication prompts a user to reauthenticate with a higher assurance level (for example, using MFA) when accessing specific resources. It is configured with authentication levels that are hierarchical: higher levels are stronger, and a user authenticated at a higher level satisfies policies requiring a sub-level. The levels are mapped to access policies in supported Zscaler services. [zia.authentication.step-up:what-it-is]
- interacts-with references/_meta/text/zpa/zpa.policy.actions.md (Rule actions on ZPA policy types): Conditional Access applies step-up authentication, is available only with an Authentication Service subscription, and prompts the user to reinforce their authentication if they are not at the defined level. [zpa.policy.actions:conditional-access-step-up]
- interacts-with references/_meta/text/zia/zia.url-filtering.actions.md (URL Filtering actions and their prerequisites), from zidentity.step-up: Conditional enforces step-up authentication before access. It needs Authentication Service for end users and Client Connector forwarding; through Private or Virtual Service Edges the category is blocked instead, and it does not apply to isolation traffic. [zia.url-filtering.actions:conditional-prereqs]
- depends-on references/_meta/text/zidentity/zidentity.overview.external-idps.md (External IdPs in Authentication Service: OIDC and SAML, primary and secondary, limits and retention), from zidentity.step-up: Step-up authentication is supported only with OIDC-based external IdP integrations; when an external IdP is used via OIDC, each authentication level must be mapped to its acr value in the IdP. [zia.authentication.step-up:oidc-only]
- links-to references/_meta/text/zpa/zpa.api.legacy-endpoints.md (ZPA legacy endpoint wiring: shared paths, schedules, user codes and step-up levels)
- links-to references/_meta/text/zpa/zpa.api.policy-wire.md (ZPA policy rule wire behavior: routes, request fields and ordering)
