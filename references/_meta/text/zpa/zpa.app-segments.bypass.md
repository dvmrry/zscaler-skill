# The application segment Bypass setting and how it ranks (zpa.app-segments.bypass)
Also called: bypass always; bypass on corporate network; use client forwarding policy; bypass_type; bypass during reauthentication; bypass_on_reauth; ON_NET

The Bypass setting lets users reach an application without Private Access, and ranks against client forwarding policy and against other segments.

**Options.** The Bypass setting offers Use Client Forwarding Policy (the default), Always, and On Corporate Network, which lets users bypass Private Access from a trusted network defined in the Zscaler Client Connector forwarding profile. [zpa.app-segments.bypass:bypass-options] With Use Client Forwarding Policy, if none of the client forwarding policy rules apply, or none are defined, access to the application is implicitly Forward to ZPA. [zpa.app-segments.bypass:cfp-implicit-forward] Which console option each API value stands for is open [gap:zpa.app-segments.bypass:label-to-api-mapping]. The API and the Terraform schema accept three `bypassType` values: `ALWAYS`, `NEVER` and `ON_NET`. [zpa.app-segments.bypass:bypass-api-values]

**Precedence.** The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp] The Bypass setting is applied at the domain level; Private Access first evaluates the forwarding profile, and when the profile specifies that the user must use Private Access, it checks the application's Bypass setting. [zpa.app-segments.bypass:bypass-domain-level] If the same FQDN is defined in multiple application segments and one of them has Bypass set to Always, that application segment takes precedence. [zpa.app-segments.bypass:same-fqdn-always] Whether Always also outranks a more granular segment with a different FQDN is open [gap:zpa.app-segments.bypass:always-across-different-fqdns]. How granularity is decided otherwise: [Which application segment a destination maps to when several overlap](kb:zpa.app-segments.matching).

**Reauthentication.** Bypass during Reauthentication, when Enabled, makes application access during reauthentication bypass Private Access, and is the API field `bypassOnReauth`. [zpa.app-segments.bypass:reauth-bypass] The Client Connector platforms it needs differ between pages [divergence:zpa.app-segments.bypass:reauth-bypass-platforms]. The AI-Powered Recommendations page's segment form says that if you select Always for the Bypass option, then Bypass during Reauthentication is automatically disabled and cannot be enabled. [zpa.app-segments.bypass:always-disables-reauth-bypass] How the SDKs serialize the field: [What the Python and Go SDKs send for application segments](kb:zpa.app-segments.sdk-behavior).

What to check:
1. Whether any segment covering the same FQDN has Bypass set to Always, since that segment takes precedence over the others.
2. Whether the forwarding profile sends the user to Private Access at all, since Private Access evaluates the forwarding profile first and checks the application's Bypass setting when the profile specifies that the user must use Private Access.
3. Which of the API values ALWAYS, NEVER and ON_NET the tenant holds, read from the segment's bypassType.

Sources disagree (name both sides):
- Two live pages name different Client Connector platforms for Bypass during Reauthentication: the Defined Application Segments page (the newer revision) and the AI-Powered Recommendations page, which embeds a copy of the segment form. [divergence:zpa.app-segments.bypass:reauth-bypass-platforms]
  - zscaler-help: Bypass during Reauthentication requires Client Connector 4.3 or later for Windows, macOS and iOS.
  - zscaler-help: Bypass during Reauthentication requires Client Connector 4.3 or later for Windows and macOS, with no mention of iOS.
  Impact: Whether the setting applies to iOS clients is not settled; both pages give 4.3 as the minimum for Windows and macOS.

Not known (open gaps):
- How the console Bypass options map to the API values ALWAYS, NEVER and ON_NET [gap:zpa.app-segments.bypass:label-to-api-mapping]: settled by tenant-data or lab-test. Blocks: reading a segment's bypassType as a console setting
- Whether Bypass Always outranks a more granular segment that has a different FQDN [gap:zpa.app-segments.bypass:always-across-different-fqdns]: settled by lab-test. Blocks: deciding between a wildcard segment set to Always and a specific-FQDN segment under it

Area: zpa.app-segments, its subjects in references/_meta/spine/zpa/zpa.app-segments.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap): If the same FQDN is defined in multiple application segments and one of them has Bypass set to Always, that application segment takes precedence. [zpa.app-segments.bypass:same-fqdn-always]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types): If a forwarding rule bypasses the traffic, the access policy rule is never evaluated for it, so a bypass for an application defeats an access rule that would block it. [zpa.policy.evaluation-order:bypass-skips-access]
- scoped-by references/_meta/text/zcc/zcc.forwarding-profiles.private-access-actions.md (Forwarding profile actions for Private Access (ZPA): Tunnel or None per network type): The Bypass setting is applied at the domain level; Private Access first evaluates the forwarding profile, and when the profile specifies that the user must use Private Access, it checks the application's Bypass setting. [zpa.app-segments.bypass:bypass-domain-level]
- decided-by references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch), from zpa.app-segments: Multiple matches apply from the most specific application to the least specific, and multimatching stops at the first application that does not support Multimatch. [zpa.policy.multimatch:match-order]
- links-to references/_meta/text/zpa/zpa.app-segments.sdk-behavior.md (What the Python and Go SDKs send for application segments)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zpa/application-segments.md (config type)
