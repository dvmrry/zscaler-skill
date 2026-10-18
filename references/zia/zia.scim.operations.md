Use this when a custom client or a connector misbehaves against the service itself. {{user-operations}} {{group-operations}} {{bulk-and-discovery}}

**Filters and incremental reads.** {{filters}} {{delta-sync}}

**Paging.** The list calls return up to 1,000 entries and advance with startIndex, see the operations above. {{paging}} A client that decides it is finished from totalResults alone can stop early or late on a large directory; the Go SDK helper does that, see [[zia.scim.sdk-coverage]].

**Write shape.** {{patch-example}}

**Rate.** {{rate-limit}} A first sync of many thousands of records is therefore subject to this rate; the Go SDK client sets no limiter of its own, see [[zia.scim.sdk-coverage]]. How large batches should use Bulk is not documented (open question below).

How quickly a pushed change takes effect is in [[zia.scim.propagation]]; what active=false and DELETE do is in [[zia.scim.deactivation]].

What to check: the verb and endpoint the client actually sends, the page size and whether it follows startIndex to the end, and the request rate.
