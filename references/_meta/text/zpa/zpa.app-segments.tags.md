# Tag Management for application segments: namespaces, tags and tag groups (zpa.app-segments.tags)
Also called: Tag Management; namespaces and tags; tag groups; tag namespace

Tag Management adds metadata to resources, so that keys and values can be defined and associated with them. It involves creating namespaces and tags to classify and group resources in Private Access, which can then be added to defined application segments. [zpa.app-segments.tags:what-it-is]

**Namespaces and tags.** A namespace is a container used to organize and group related tags defined within Private Access. Namespaces allow the same tag names and values to be reused and managed according to different needs. [zpa.app-segments.tags:namespace] Predefined namespaces and tags cannot be edited or deleted. [zpa.app-segments.tags:predefined-locked] A tag takes a Key, a Status (Enabled or Disabled), an optional Description, and Values, for example High, Critical, San Jose and HQ. Previously assigned values can also be edited or deleted. [zpa.app-segments.tags:tag-fields]

**Tag groups.** Tag groups are created by grouping tags from different namespaces; each entry selects a Namespace, a Key for that namespace and the Values to add to the tag group. [zpa.app-segments.tags:tag-groups] The Tag Groups and Tag Value policy criteria are in [Criteria available on ZPA access policy rules](kb:zpa.policy.criteria).

**On a segment.** A defined application segment lists the Namespaces, Keys and Values associated with it, and, on the Tag Management page, tags can be filtered by origin or status. [zpa.app-segments.tags:on-segment] The limits, the origin values and the effect on policy beyond those criteria are open [gap:zpa.app-segments.tags:tag-limits-origin-policy].

The segment hub is [ZPA application segments](kb:zpa.app-segments).

What to check:
1. Whether the namespace or tag is predefined, since predefined namespaces and tags cannot be edited or deleted.
2. Which namespace a tag group entry takes its key and values from.

Not known (open gaps):
- Tag limits, the values of the origin filter and the effect of tags on policy [gap:zpa.app-segments.tags:tag-limits-origin-policy]: settled by source-read

Area: zpa.app-segments, its subjects in references/_meta/spine/zpa/zpa.app-segments.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks), from zpa.app-segments: The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- decided-by references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap), from zpa.app-segments: Granularity is judged on the domain or address: an exact host is more specific than a wildcard that contains it, and for IPs a /32 host is more specific than the /24 that contains it. [zpa.app-segments.matching:granularity-ranking]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.app-segments: When a request arrives, Private Access identifies the matching rule first, choosing the rule that corresponds to the most specific application segment for the domain name or IP address if segments are part of the criteria. [zpa.policy.evaluation-order:segment-then-rules]
- decided-by references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch), from zpa.app-segments: Multiple matches apply from the most specific application to the least specific, and multimatching stops at the first application that does not support Multimatch. [zpa.policy.multimatch:match-order]
- links-to references/_meta/text/zpa/zpa.app-segments.md (ZPA application segments)
- links-to references/_meta/text/zpa/zpa.policy.criteria.md (Criteria available on ZPA access policy rules)
