# The Defined Application Segments page: delete and edit locks, status, configuration warnings and filters (zpa.app-segments.admin-console)
Also called: Defined Application Segments page; why can't I delete an application segment; application segment delete unavailable; configuration warnings; Caution icon application segment; disable application segment

The segments themselves are covered in [ZPA application segments](kb:zpa.app-segments).

**Why delete is unavailable.** If an application segment is referenced in a segment group and has a policy configured, the delete action is unavailable. An admin must manually review and remove the link to the policy to delete the segment. [zpa.app-segments.admin-console:delete-locked-by-policy] If an application segment is referenced by Internet & SaaS for Source IP Anchoring, the delete action is unavailable. [zpa.app-segments.admin-console:delete-locked-by-sipa] If an application segment is configured using Zscaler Deception, the copy, edit and delete options are unavailable. [zpa.app-segments.admin-console:deception-locked] Source IP Anchoring on a segment is in [Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring](kb:zpa.app-segments.settings); the matching lock on segment groups is in [Segment group limits, microtenant scope and managed groups](kb:zpa.segment-groups.scope).

**Disabling.** If an application segment's Status is Disabled, the applications defined within it, whether explicitly defined or dynamically discovered, are inaccessible to users until it is re-enabled. [zpa.app-segments.admin-console:status-disabled]

**Icons and warnings.** A segment that is missing required settings shows the yellow Caution icon, and editing the segment resolves the configuration issues. A Source IP Anchoring-enabled segment shows the Information icon. [zpa.app-segments.admin-console:caution-icon] By default, configuration warnings appear for application segments to notify of an error or existing issue, and the setting is enabled by default. If configuration warnings are disabled, no messaging about an error or issue appears for segments. The page's example is a warning when a more specific segment, www.example.com, is added next to an existing wildcard segment, .example.com. [zpa.app-segments.admin-console:configuration-warnings] Which warnings exist and what counts as a missing required setting is open [gap:zpa.app-segments.admin-console:warnings-and-required-settings].

**Filters and download.** The configuration file that can be downloaded from the page lists the application segments based on the selected table filters. [zpa.app-segments.admin-console:csv-follows-filters] Within a Microtenant the Configured within Microtenant filter option is applied by default, with options by access type of Global, Configured within Microtenant, Shared to this Microtenant and Shared from this Microtenant. Within the Default Microtenant, the Configured within Microtenant and Shared to this Microtenant options are supported. Separately, the Federated By filter option is set to My Tenant by default and applied to the application segments federated by the tenant. [zpa.app-segments.admin-console:microtenant-filter]

**Server groups on edit.** What the editing page says about saving several server groups, and how that fits the load balancing page, is in [Several server groups on one application segment](kb:zpa.server-groups.multiple-on-segment).

What to check:
1. Whether the segment is referenced in a segment group with a policy configured, by Internet & SaaS for Source IP Anchoring, or configured using Zscaler Deception, which make the delete action unavailable.
2. Whether the segment's Status is Disabled before treating its applications as reachable.
3. Whether configuration warnings are disabled, in which case no messaging about an error or issue appears for segments.

Not known (open gaps):
- Which configuration warnings exist and what counts as a missing required setting [gap:zpa.app-segments.admin-console:warnings-and-required-settings]: settled by lab-test or support-ticket

Area: zpa.app-segments, its subjects in references/_meta/spine/zpa/zpa.app-segments.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks), from zpa.app-segments: The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- decided-by references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap), from zpa.app-segments: Granularity is judged on the domain or address: an exact host is more specific than a wildcard that contains it, and for IPs a /32 host is more specific than the /24 that contains it. [zpa.app-segments.matching:granularity-ranking]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.app-segments: When a request arrives, Private Access identifies the matching rule first, choosing the rule that corresponds to the most specific application segment for the domain name or IP address if segments are part of the criteria. [zpa.policy.evaluation-order:segment-then-rules]
- decided-by references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch), from zpa.app-segments: Multiple matches apply from the most specific application to the least specific, and multimatching stops at the first application that does not support Multimatch. [zpa.policy.multimatch:match-order]
- links-to references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments)
- links-to references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring)
- links-to references/_meta/text/zpa/zpa.segment-groups.scope.md (Segment group limits, microtenant scope and managed groups)
- links-to references/_meta/text/zpa/zpa.server-groups.multiple-on-segment.md (Several server groups on one application segment)
