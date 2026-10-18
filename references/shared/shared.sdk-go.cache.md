The SDK can cache GET responses and collapse identical GETs into one request. Providers that turn this on inherit its behavior on every read. {{zia-provider-enables-cache}}

Deduplication has three client-side weaknesses. {{waiters-ignore-cancellation}} {{owner-error-not-shared}} {{two-owners-possible}} During API failures or rate limiting, the second one turns one failed request into one request per waiter.

Invalidation on writes is where stale reads come from. {{write-invalidates-but-inflight-get-repopulates}} The vendor has already met one form of this problem. {{parent-collection-invalidation}} So when a tool mutates and immediately re-reads (rule reordering is the main case), a stale result within the cache lifetime is a known possibility, not evidence of a server problem.

Two smaller defects. {{prefix-invalidation-over-broad}} {{cached-body-read-errors-ignored}}
