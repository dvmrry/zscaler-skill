# How the Python SDK builds, pages and retries ZIA requests (zia.sdk-python.request-conventions)
Also called: python sdk search missing object; python sdk page size; enabled state python sdk; python sdk retry 429; edit lock not available retry; enableMistralAIPrompt python; bulk delete 100 python; url lookup chunk

This describes the Python SDK client, not ZIA: what it sends, how it pages and when it retries. Server behavior behind these calls is separate.

## Paging

**One page per call.** A list call returns the first page, held in [Paging through ZIA lists with the Python SDK](kb:zia.sdk-python.pagination). A ZIA response that is a flat list with no paging metadata is treated as complete: `has_next()` returns False for it. [zia.sdk-python.request-conventions:flat-list-complete]

**Next page.** For ZIA responses shaped as a paged object, `has_next()` is true after the first page whenever that page returned any results. On later pages it is true only when the last page filled the page-size limit, or, with no explicit limit, whenever the last page returned any results, which the code says can cost one extra empty request. [zia.sdk-python.request-conventions:has-next-zia] The Python response object keeps a per-service page-size table in which ZIA has a maximum of 10000, and it clamps a caller-supplied page size between the service minimum and maximum to set its internal limit. When the caller gives no page size it returns None and lets the API use its own default. [zia.sdk-python.request-conventions:page-size-validation] What each endpoint accepts is open [gap:zia.sdk-python.request-conventions:page-size-caps].

## Request shaping

**Search.** In list calls such as sandbox rules and URL categories the Python SDK removes `search` from the query parameters before the request, then filters the returned objects by a case-insensitive substring match on `name` (`configured_name` for URL categories). [zia.sdk-python.request-conventions:client-side-search] The admin role, bandwidth class and bandwidth control rule list calls also remove `search` from the query parameters before the request and then keep only the returned objects whose lower-cased name contains the lower-cased search string. [zia.sdk-python.request-conventions:client-search-more-modules] A `search` through these list calls matches only the objects on the page the API returned, so an object on a later page is not found by it. [zia.sdk-python.request-conventions:client-search-page-only]

**Rule state and ID lists.** The Python rule modules for sandbox, URL filtering and SSL inspection rules convert an `enabled` keyword on create and update into `state`, ENABLED for true and DISABLED for false. [zia.sdk-python.request-conventions:enabled-to-state] The same `enabled` to `state` conversion on create is also in the Python bandwidth control, cloud firewall filtering, firewall DNS, firewall IPS, forwarding control, file type control, web DLP rule and CASB DLP rule modules. [zia.sdk-python.request-conventions:enabled-to-state-more-modules] `transform_common_id_fields` pops each listed snake_case key from the request body and rewrites its list of IDs as a list of `{"id": ...}` objects under the wire key, by default coercing numeric strings to integers. The shared list `reformat_params` names keys such as `users`, `groups` and `labels`. [zia.sdk-python.request-conventions:id-list-reshape]

**Key casing.** In the executor's `_prepare_body`, a dictionary request body for an endpoint that is not a ZDX, ZEASM, ZTB or ZCC one takes the generic path: its keys are camel-cased, except that keys inside `featurePermissions` are left as they are. The conversion maps keys listed in an exceptions table and otherwise lower-cases the first segment of a snake_case key and capitalizes each later segment; a key with no underscore is returned unchanged. [zia.sdk-python.request-conventions:camel-case-body] Which services leave or convert bodies differently is in [For a dictionary request body, the request executor camel-cases the keys with `convert_keys_to_camel_case`, except on the ZDX and ZTB legacy clients and on endpoints containing `/zdx/`, `/easm/` or `/ztb/`, whose bodies it sends as given. For `/zcc/` it converts selectively, leaving `WebPolicy.SNAKE_CASE_KEYS` as they are, and a body the ZCC serializer already produced (`_ZccWireBody`) is sent unchanged.](kb:shared.sdk-python.request-handling:body-camel-case). A ZIA request body takes that default branch, so its keys are camel-cased before sending. [zia.sdk-python.request-conventions:zia-body-camel-cased] The Python typed model for the advanced URL filtering and cloud app settings reads and emits eight Gen AI prompt flags: ChatGPT, Microsoft Copilot, Gemini, Poe, Meta, Perplexity, Google AI and QuillBot. [zia.sdk-python.request-conventions:url-settings-model-eight-flags] A snake_case keyword `enable_mistral_ai_prompt` passed to the Python settings update becomes `enableMistralAiPrompt`, not the Go SDK's wire name `enableMistralAIPrompt`; the exact key `enableMistralAIPrompt` passes through unchanged. [zia.sdk-python.request-conventions:mistral-key-casing] The Go side of the same settings write is in [Advanced URL Filtering settings that change outcomes](kb:zia.url-filtering.advanced-settings).

**Batches.** The Python `bulk_delete_locations` and `bulk_delete_vpn_credentials` calls refuse a list of more than 100 IDs by returning a ValueError in the error slot instead of sending part of it. Up to v1.11.2 that slot was the second element of a 2-tuple; from v1.11.3 it is the third element of the (result, response, error) tuple. [zia.sdk-python.request-conventions:bulk-delete-limit] `url_categories.lookup` sends the URLs to `/urlLookup` in chunks of 100, sleeps one second after each chunk, and returns a (results, error) pair rather than the usual three-element tuple. [zia.sdk-python.request-conventions:url-lookup-chunks] The Go helpers behave differently; see [How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes](kb:shared.sdk-go.request-handling).

## Retries

**What is retried.** [The Python executor's retryable-status helper documents 429, 500, 502, 503 and 504 as retryable, but its code tests only 429, 503 and 504, so a 500 or 502 is not retried by it.](kb:shared.sdk-python.retries:retryable-statuses) [The branch that retries the retryable statuses (`TOO_MANY_REQUESTS`, `SERVICE_UNAVAILABLE` and `GATEWAY_TIMEOUT`) is decided by `attempts < max_retries` and `is_retryable_status(response.status_code)`, and `is_retryable_status` takes only the status; the request method is not consulted.](kb:shared.sdk-python.retries:method-not-consulted) The wait, the retry count and the edit-lock backoff are in [ZIA API rate limits and how the Python SDK retries](kb:zia.api.rate-limits).

**Sessions.** [On a 401 the executor clears the OAuth token, fetches a new one and retries while attempts remain; otherwise it returns a token-refresh-exhausted error.](kb:shared.sdk-python.retries:reauth-on-401) The Go retry policy is in [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries).

What to check:
1. Whether a list call returned one page or all of them, and whether the page was full.
2. Whether a `search` argument could have missed an object that sits on a later page.
3. Whether a write was replayed after a retryable status, and whether retries were exhausted.
4. Whether a setting that failed to change was sent under a key the API does not know.

Inferred, not quoted (say so when an answer rests on one):
- [zia.sdk-python.request-conventions:client-search-page-only] Tier B: Applies when the endpoint pages its results and the named object is not on the requested page; endpoints that return a flat list are unaffected.
- [zia.sdk-python.request-conventions:zia-body-camel-cased] Tier B: ZIA endpoints contain none of the four path markers and the legacy-client exceptions name only ZDX and ZTB; the SDK does not name ZIA in this branch.
- [zia.sdk-python.request-conventions:mistral-key-casing] Tier B: Holds because the Python exceptions table has no Mistral entry (a search of helpers.py at the pin finds none) and the generic branch capitalizes each later segment; the Go field tag is the evidence for the wire name.

Not known (open gaps):
- Maximum page size each ZIA list endpoint accepts [gap:zia.sdk-python.request-conventions:page-size-caps] (data gap): filled by operator; settled by lab-test or tenant-data. Blocks: choosing a page size for a complete read through the Python SDK

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.retries.md (How the Python SDK retries: budget, statuses, waits, re-authentication)
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/shared/shared.sdk-python.request-handling.md (How the Python SDK builds a request: body and query key casing, ID lists)
- links-to references/_meta/text/zia/zia.api.rate-limits.md (ZIA API rate limits and how the Python SDK retries)
- links-to references/_meta/text/zia/zia.sdk-python.pagination.md (Paging through ZIA lists with the Python SDK)
- links-to references/_meta/text/zia/zia.url-filtering.advanced-settings.md (Advanced URL Filtering settings that change outcomes)
