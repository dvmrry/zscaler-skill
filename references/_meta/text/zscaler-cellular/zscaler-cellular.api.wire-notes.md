# ZCell wire notes: paging, time windows, SIM search, violations, audit search, SIM lock and tower history (zscaler-cellular.api.wire-notes)
Also called: zcell pagination; zcell sims search page size; zcell violations empty; zcell tower locations; tower-location history; zcell days parameter; zcell sim lock imei; zcell audit search body; tower location history
Former IDs: zscaler-cellular-02, zscaler-cellular-03

These are the ZCell request and response details that decide whether a call returns what was asked for; field lists are in the contract.

**Paging.** The ZCell anomaly-policy violations operation (`GET /api/v1/customers/{id}/anomaly-policy/{policyId}/violations`) takes `page` (0-based, default 0) and `size` (1 to 100, default 10) as query parameters, and returns an envelope of `content`, `size`, `totalElements` and `totalPages`. [zscaler-cellular.api.wire-notes:paging-contract] The SDK limits ZCell page size to 1 through 100 (default 10) and, for the next page, sends a `page` one less than its 1-based counter, since ZCell pages are 0-based. [zscaler-cellular.api.wire-notes:sdk-paging] [The SDK's next-page request is always a GET built from the response's URL, headers and query parameters; the request it builds has no body key.](kb:shared.sdk-python.pagination:next-is-get) Paging forward through a ZCell POST search (SIM search, audit search) with the SDK response's next-page helper sends a GET without the search body, which is not the documented method for those paths. [zscaler-cellular.api.wire-notes:next-page-post-search] The Postman collection documents these default `sortBy` values: `policyName` for anomaly policies, `timestamp` (with `sortDir` default `DESC`) for a SIM's violation details, `iccid` for SIM search, `usage` for the SIM CSV export, and `name` for SIM location groups and tags. [zscaler-cellular.api.wire-notes:sort-defaults]

**Time windows.** The SDK's `days` shorthand for ZCell sets the window to now minus `days` times 86400 through now, in epoch seconds computed on the client; an explicit start or end value wins, and the helper places the window in the query, the body or the path depending on the endpoint. [zscaler-cellular.api.wire-notes:time-window-helper]

**SIM search.** The SDK's `create_sims_search` has no query-parameter argument and sends every keyword argument as the request body. [zscaler-cellular.api.wire-notes:sim-search-body] The contract and the clients disagree on where paging goes [divergence:zscaler-cellular.api.wire-notes:sim-search-pagination], and what the backend accepts is open [gap:zscaler-cellular.api.wire-notes:sim-search-paging].

**Anomaly violations.** The anomaly-policy violations operation returns `content` as an array of strings, and requires `startDateTime` and `endDateTime` query parameters. [zscaler-cellular.api.wire-notes:violations-content-strings] Listing the SIMs with violations of an anomaly policy accepts `sortBy` and `sortDir` but ignores them, as the contract says. [zscaler-cellular.api.wire-notes:violations-sort-ignored] The SDK's ZCell response handling takes a page's items from `content` and keeps only dictionary items, logging and skipping anything else, and the violations method builds an `AnomalyPolicy` from each kept item. [zscaler-cellular.api.wire-notes:sdk-drops-non-dict] If the server returns violations as the contract documents, a list of ICCID strings, the SDK's `list_anomaly_policy_violations` returns an empty list, and so does the MCP tool built on it. [zscaler-cellular.api.wire-notes:violations-lost] [divergence:zscaler-cellular.api.wire-notes:violation-items] What a live response holds is open [gap:zscaler-cellular.api.wire-notes:violation-shape].

**Audit search.** Audit search is a POST whose body carries `startDate`/`endDate` (epoch), `operationType` (Create, Update, Delete, Export), `objectId` (int64), `id` for a single entry, `visibility` (Customer, Root) and a `customerId` filter that applies only to root tenants; sorting is by query `sortBy` (default creationTime) and `sortDir` (default DESC). [zscaler-cellular.api.wire-notes:audit-search-contract] How the MCP audit tool narrows this is in [The Zscaler MCP server's ZCell tools: 20 reads, the customer ID, time windows, prompts and gaps](kb:zscaler-cellular.mcp).

**SIM lock.** SIM lock takes `simLockDetails` entries with required `iccid` and `imei` (one or more 15-digit IMEIs as a comma-separated string) and an optional per-SIM `locked`; the top-level `dataAuthorize` is deprecated in favor of `locked`. [zscaler-cellular.api.wire-notes:sim-lock]

**Tower-location history.** Tower-location history (`/sims/{iccid}/tower-locations`) returns a SIM's cell-tower points sourced from network events, newest first; its `days` lookback (1 to 60, default 30) is deprecated and ignored when `startDate` and `endDate` (epoch seconds) are given, while each point's `timestamp` is in Unix epoch milliseconds. [zscaler-cellular.api.wire-notes:tower-history] Neither the Python SDK nor the MCP server calls tower-location history; it is reachable only by a raw API call. [zscaler-cellular.api.wire-notes:tower-no-client]

What to check:
1. For an SDK or MCP SIM search that keeps returning the same 10 SIMs, whether the page and size reached the query string.
2. For an empty violations list, whether the raw API response has ICCID strings that the SDK dropped.
3. For tower history, whether startDate and endDate are epoch seconds while the returned timestamps are milliseconds.

Inferred, not quoted (say so when an answer rests on one):
- [zscaler-cellular.api.wire-notes:next-page-post-search] Tier B: Follows from next-page-get and the contract listing those searches as POST only; not observed against a tenant.
- [zscaler-cellular.api.wire-notes:violations-lost] Tier B: Follows from violations-content-strings and sdk-drops-non-dict; not confirmed against a live or mocked response.
- [zscaler-cellular.api.wire-notes:tower-no-client] Tier B: Rests on the generated surface for zcell, whose Python sim_handling methods do not map to the tower-locations path, and on the MCP toolsets table listing no tower tool.

Sources disagree (name both sides):
- The contract puts SIM search paging and sorting in the query string; the SDK and MCP put page and size in the POST body. [divergence:zscaler-cellular.api.wire-notes:sim-search-pagination]
  - api-specs: `page`, `size`, `sortBy` and `sortDir` are query parameters of the SIM search.
  - sdk-python: The SDK sends every keyword argument of `create_sims_search` as the body.
  - mcp-server: The MCP SIM list tool passes page and size into that body.
  Impact: Through the SDK or MCP, SIM search may ignore the requested page and size and return the first page of 10; sorting cannot be requested at all.
- The contract returns violation items as ICCID strings; the SDK keeps only dictionary items. [divergence:zscaler-cellular.api.wire-notes:violation-items]
  - api-specs: Violations `content` is an array of strings.
  - sdk-python: Non-dictionary page items are skipped.
  Impact: The offending ICCIDs of an anomaly policy may never reach an SDK or MCP caller; read the raw response to see them.

Not known (open gaps):
- What the violations endpoint returns in practice [gap:zscaler-cellular.api.wire-notes:violation-shape]: settled by lab-test or tenant-data. Blocks: trusting an empty violations list from the SDK or MCP
- Whether SIM search honors page and size in the body [gap:zscaler-cellular.api.wire-notes:sim-search-paging]: settled by lab-test or tenant-data. Blocks: paging a SIM inventory larger than one page through the SDK or MCP

Area: zscaler-cellular.api, its subjects in references/_meta/spine/zscaler-cellular/zscaler-cellular.api.json

Linked (open a file only if the answer needs it):
- reached-via references/_meta/text/shared/shared.oneapi.base-urls.md (OneAPI hosts and per-product base paths), from zscaler-cellular.api: The OneAPI Postman collection sets `{{ZCellBaseUrl}}` to `{{oneAPIBaseUrl}}/zcell/config` and appends `/api/v1/...` to it, with the customer ID as the `:id` path variable, for example `{{ZCellBaseUrl}}/api/v1/customers/:id/sims/search`. [zscaler-cellular.api:postman-base-url]
- links-to references/_meta/text/shared/shared.sdk-python.pagination.md (How the Python SDK pages a list: has_next, next and the per-service branches)
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.mcp.md (The Zscaler MCP server's ZCell tools: 20 reads, the customer ID, time windows, prompts and gaps)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zscaler-cellular/zscaler-cellular.api.md (The Zscaler Cellular (ZCell) API: customer scoping, clients and where the contract and SDK disagree)
