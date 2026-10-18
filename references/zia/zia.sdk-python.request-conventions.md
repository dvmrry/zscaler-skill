This describes the Python SDK client, not ZIA: what it sends, how it pages and when it retries. Server behavior behind these calls is separate.

## Paging

**One page per call.** A list call returns the first page, held in [[zia.sdk-python.pagination]]. {{flat-list-complete}}

**Next page.** {{has-next-zia}} {{page-size-validation}} What each endpoint accepts is open {{gap:page-size-caps}}.

## Request shaping

**Search.** {{client-side-search}} {{client-search-more-modules}} {{client-search-page-only}}

**Rule state and ID lists.** {{enabled-to-state}} {{enabled-to-state-more-modules}} {{id-list-reshape}}

**Key casing.** {{camel-case-body}} {{url-settings-model-eight-flags}} {{mistral-key-casing}} The Go side of the same settings write is in [[zia.url-filtering.advanced-settings]].

**Batches.** {{bulk-delete-limit}} {{url-lookup-chunks}} The Go helpers behave differently; see [[shared.sdk-go.request-handling]].

## Retries

**What is retried.** {{retry-statuses-docstring-mismatch}} {{retry-by-status-only}} The wait, the retry count and the edit-lock backoff are in [[zia.api.rate-limits]].

**Sessions.** {{reauth-on-401}} The Go retry policy is in [[shared.sdk-go.retries]].
