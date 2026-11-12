# What the Python SDK returns: result, response and error, and why try/except misses API errors (zia.sdk-python.response-shape)
Also called: python sdk tuple; result response error; sdk does not raise; try except sdk zia; resp.search jmespath; mock sdk tuple

The Python SDK reports API errors in its return value by default, though some calls raise regardless. How its pages are walked is in [Paging through ZIA lists with the Python SDK](kb:zia.sdk-python.pagination), and its retry and rate-limit behavior is in [ZIA API rate limits and how the Python SDK retries](kb:zia.api.rate-limits).

**Return shape.** [Python SDK methods return a three-element tuple of result, response and error rather than a bare result.](kb:shared.sdk-python.response-handling:tuple-return) Assigning a call to a single name therefore binds the whole tuple, not the list or object, so iterating it yields the result, response and error. [zia.sdk-python.response-shape:single-assignment-yields-tuple] A result model exposes snake_case attributes; its request_format output uses the API's camelCase keys, and as_dict converts those keys to snake_case and leaves out None values. The URL category model reads customCategory into custom_category, and its request_format writes it back as customCategory. [zia.sdk-python.response-shape:result-models-snake-case-attrs]

**Errors are values.** The URL filtering `list_rules` call catches exceptions raised while building its result models and returns them in the third slot with a None result, instead of raising. [zia.sdk-python.response-shape:errors-in-third-slot] The SDK's own pre-send validation also comes back as an error value: updating the advanced URL filter settings with CIPA compliance and a mutually exclusive setting both true returns a ValueError in the tuple. [zia.sdk-python.response-shape:validation-errors-returned] So a try/except around a ZIA SDK call does not catch API errors; the caller has to test the error value of every returned tuple, and a test double has to return tuples rather than raise. [zia.sdk-python.response-shape:callers-must-check-error] Whether a later SDK release will raise instead is open [gap:zia.sdk-python.response-shape:raise-proposal].

**Filtering.** [The response object's search method applies a JMESPath expression to the current page of results only, so filtering across a collection means searching each page.](kb:shared.sdk-python.response-handling:search-current-page)

What to check:
1. Whether the call site unpacks all three values and tests the error value before using the result.
2. Whether a test double returns a tuple rather than raising, since a raising mock does not match the SDK.
3. Whether a configuration rejected by the SDK came back as an error value rather than an exception.

Inferred, not quoted (say so when an answer rests on one):
- [zia.sdk-python.response-shape:callers-must-check-error] Tier B: Holds with the default `raiseException=False` (with True, the same API errors are raised as `ZscalerAPIException`: raise-exception), for calls that complete the request path as the ZIA methods read at the pin do; construction errors and the page iterator can still raise. API errors reach the error slot because the request executor hands a non-2xx response back there as a `ZscalerAPIError` (api-error-object). errors-in-third-slot is quoted from one method, URL filtering `list_rules`, and covers only exceptions raised while building its result models; that every other ZIA method catches those the same way is not quoted.
- [zia.sdk-python.response-shape:single-assignment-yields-tuple] Tier B: Follows directly from the return shape.

Not known (open gaps):
- Whether the SDK maintainers will change the SDK to raise on errors [gap:zia.sdk-python.response-shape:raise-proposal]: settled by source-read. Blocks: Whether to rely on try/except in scripts written against a newer SDK release.

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.response-handling.md (What the Python SDK does with a response: key casing, models, the response object)
- links-to references/_meta/text/zia/zia.api.rate-limits.md (ZIA API rate limits and how the Python SDK retries)
- links-to references/_meta/text/zia/zia.sdk-python.pagination.md (Paging through ZIA lists with the Python SDK)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.api.md (The ZIA API from a client's side: activation, limits, SDK coverage and wire notes)
- see-also references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
