# How the Python SDK pages a list: has_next, next and the per-service branches (shared.sdk-python.pagination)
Also called: python sdk pagination; has_next; resp.next; StopIteration; python sdk page size; next page

One response object (`ZscalerAPIResponse`) pages every service, with a branch per service for how the next page is requested and when the walk stops. The branches are in each product's subject: [For ZIA responses shaped as a paged object, `has_next()` is true after the first page whenever that page returned any results. On later pages it is true only when the last page filled the page-size limit, or, with no explicit limit, whenever the last page returned any results, which the code says can cost one extra empty request.](kb:zia.sdk-python.request-conventions:has-next-zia), [Paging through ZPA lists with the Python SDK](kb:zpa.sdk-python.pagination), [Paging through ZCC lists with the Python SDK](kb:zcc.sdk-python.pagination), [For ZIdentity responses the Python response object keeps the body's `records` and `next_link`; `has_next()` is true whenever `next_link` is not None, and `next()` copies the query string of `next_link` into the request parameters, points the request at `next_link`'s scheme, host and path, and sends a GET.](kb:zidentity.api.pagination:python-next), [The Python response object pages ZDX lists by `next_offset`: `has_next()` is true while a `next_offset` is present, the next request sends it as `offset`, and each page's records are read from the body's `items` key.](kb:zdx.sdk-python.response-models:paging), [The SDK limits ZCell page size to 1 through 100 (default 10) and, for the next page, sends a `page` one less than its 1-based counter, since ZCell pages are 0-based.](kb:zscaler-cellular.api.wire-notes:sdk-paging).

**Every service.** The SDK's next-page request is always a GET built from the response's URL, headers and query parameters; the request it builds has no body key. [shared.sdk-python.pagination:next-is-get] So a list fetched with POST (a search) cannot be continued with `next()`: [Paging forward through a ZCell POST search (SIM search, audit search) with the SDK response's next-page helper sends a GET without the search body, which is not the documented method for those paths.](kb:zscaler-cellular.api.wire-notes:next-page-post-search). `next()` raises `StopIteration("No more pages available.")` when `has_next()` is false, and otherwise returns the tuple (results, response, error). [shared.sdk-python.pagination:next-stopiteration] `next()` raises StopIteration only when `has_next()` is already false; when the page it fetches is empty it returns None with no error instead. [shared.sdk-python.pagination:next-empty-page]

What to check:
1. Whether the list was fetched with POST before paging it with `next()`, which always sends a GET.

Area: shared.sdk-python, its subjects in references/_meta/spine/shared/shared.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.api.wire-notes.md (ZCell wire notes: paging, time windows, SIM search, violations, audit search, SIM lock and tower history)
- links-to references/_meta/text/zcc/zcc.sdk-python.pagination.md (Paging through ZCC lists with the Python SDK)
- links-to references/_meta/text/zdx/zdx.sdk-python.response-models.md (What the Python SDK's ZDX results contain: envelopes, missing fields and paging)
- links-to references/_meta/text/zia/zia.sdk-python.request-conventions.md (How the Python SDK builds, pages and retries ZIA requests)
- links-to references/_meta/text/zidentity/zidentity.api.pagination.md (Paging ZIdentity lists: offset and limit, the list envelope, and how each SDK walks pages)
- links-to references/_meta/text/zpa/zpa.sdk-python.pagination.md (Paging through ZPA lists with the Python SDK)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.sdk-python.response-handling.md (What the Python SDK does with a response: key casing, models, the response object)
