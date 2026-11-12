# How the Python SDK reports errors: the error slot, exception classes, raiseException (shared.sdk-python.errors)
Also called: ZscalerAPIError; ZscalerAPIException; raiseException; python sdk error tuple; python sdk exceptions

Python SDK methods return `(result, response, error)` and, by default, put an API failure in the error slot rather than raising it.

**The error slot.** A non-2xx REST response is turned into a `ZscalerAPIError` built from the URL, the response and the parsed body, and the request executor hands it back in the error slot. A response whose Content-Type is JSON but whose body does not parse is returned as an `HTTPError` carrying the status code and body text. [shared.sdk-python.errors:api-error-object] The executor's `execute` catches exceptions from firing the request and from the response error check, and returns them as the error element instead of raising. [shared.sdk-python.errors:errors-returned]

**Raising instead.** The client setting `raiseException` defaults to False. When it is true the same API errors are raised as `ZscalerAPIException` (or `HTTPException`) instead of being returned in the error slot. [shared.sdk-python.errors:raise-exception] The Python SDK defines its own exception classes: `HTTPError` and `ZscalerAPIError` in `zscaler/errors`, `ZscalerAPIException` and `HTTPException` in `zscaler/exceptions`, and `RateLimitExceededError` in `zscaler/utils.py`. [shared.sdk-python.errors:exception-classes]

What to check:
1. That the caller checks the error element of the returned tuple, unless the client was built with raiseException.

Area: shared.sdk-python, its subjects in references/_meta/spine/shared/shared.sdk-python.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/shared/shared.sdk-python.retries.md (How the Python SDK retries: budget, statuses, waits, re-authentication)
