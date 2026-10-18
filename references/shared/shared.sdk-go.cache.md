The SDK can cache GET responses and collapse identical GETs into one request. Providers that turn this on inherit its behavior on every read. {{zia-provider-enables-cache}}

**Deduplication.** {{waiters-ignore-cancellation}} {{owner-error-not-shared}} {{two-owners-possible}}

**Invalidation on writes.** {{write-invalidates-but-inflight-get-repopulates}} {{parent-collection-invalidation}}

**Smaller defects.** {{prefix-invalidation-over-broad}} {{cached-body-read-errors-ignored}}
