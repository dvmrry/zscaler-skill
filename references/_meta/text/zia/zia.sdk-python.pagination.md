# Paging through ZIA lists with the Python SDK (zia.sdk-python.pagination)
Also called: python sdk pagination zia; has_next next; list returns only first page; StopIteration next; pagination bugs python sdk; N-1 records list_users

Python SDK lists come back one page at a time, so a single call is not the whole collection. The Go equivalents are [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination), and the URL Filtering specifics are in [Listing URL Filtering rules and URL categories without truncation](kb:zia.url-filtering.list-pagination).

**Walking pages.** A Python SDK list method that supports pagination returns only the first page of results initially. [zia.sdk-python.pagination:first-page-only] The response object carries has_next and next methods to fetch the following pages. [zia.sdk-python.pagination:has-next-next] The README says paging stops when fewer results than the page size are returned; in code, for ZIA, that applies only after the first page and only when the caller supplied a page size; otherwise paging continues while a page returns results and stops on an empty page. [zia.sdk-python.pagination:stops-on-short-page] The code-level rule is in [For ZIA responses shaped as a paged object, `has_next()` is true after the first page whenever that page returned any results. On later pages it is true only when the last page filled the page-size limit, or, with no explicit limit, whenever the last page returned any results, which the code says can cost one extra empty request.](kb:zia.sdk-python.request-conventions:has-next-zia). Calling next when there is no further page raises StopIteration rather than returning an error value. [zia.sdk-python.pagination:stopiteration-at-end]

**Page size.** Since release 1.8.4 the SDK no longer forces a default page size and uses each API's native default, which the changelog gives as 100 for ZIA. [zia.sdk-python.pagination:zia-default-page-size]

**History.** The Python changelog records several pagination fixes: ZIA pagination using the wrong page parameter names (PR 393), has_next returning True forever on flat-list responses (PR 426), and ZIA has_next returning False after the first page on flat-list endpoints (PR 478). [zia.sdk-python.pagination:pagination-fix-history] Whether the user and group lists still lose a record is open [gap:zia.sdk-python.pagination:n-minus-1-regression].

What to check:
1. Whether the caller loops on has_next and stops cleanly, instead of assuming the first call returned the whole collection.
2. Whether the total matches a count the tenant knows (console count, expected size) after a bulk read, given the SDK's pagination fix history.

Not known (open gaps):
- Whether list_users and list_groups still drop a record across pages [gap:zia.sdk-python.pagination:n-minus-1-regression]: settled by lab-test or tenant-data. Blocks: Whether a bulk list read of users or groups can be trusted without a count check.

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/zia/zia.sdk-python.request-conventions.md (How the Python SDK builds, pages and retries ZIA requests)
- links-to references/_meta/text/zia/zia.url-filtering.list-pagination.md (Listing URL Filtering rules and URL categories without truncation)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.api.md (The ZIA API from a client's side: activation, limits, SDK coverage and wire notes)
- see-also references/_meta/text/zia/zia.sdk-python.response-shape.md (What the Python SDK returns: result, response and error, and why try/except misses API errors)
