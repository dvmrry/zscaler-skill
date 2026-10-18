Use this when a custom client or a connector misbehaves against the service itself. {{user-operations}} {{group-operations}} {{bulk-and-discovery}}

**Filters and incremental reads.** {{filters}} {{delta-sync}}

**Paging.** {{paging}} The Go SDK helper decides it is finished from totalResults, see [[zia.scim.sdk-coverage]].

**Write shape.** {{patch-example}}

**Rate.** {{rate-limit}} {{first-sync-rate-bound}} The Go SDK client sets no limiter of its own, see [[zia.scim.sdk-coverage]]. How large batches should use Bulk is open {{gap:bulk-limits}}.

How quickly a pushed change takes effect is in [[zia.scim.propagation]]; what active=false and DELETE do is in [[zia.scim.deactivation]].
