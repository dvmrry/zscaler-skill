# How the Python SDK audit log report calls return results and fail (zia.sdk-python.audit-logs-client)
Also called: audit log cancel python; auditlogEntryReport cancel; audit_logs.cancel attributeerror; python sdk audit log returns none; auditlogEntryReport%22; audit log create stray quote

The audit log report calls in the Python SDK follow their own return convention and carry defects in `create` and `cancel`. The report itself is described in [Exporting the ZIA admin audit log through the report API](kb:zia.audit-logs.report-api).

**Return values.** The Python `AuditLogsAPI` methods do not return the usual (result, response, error) tuple: `create` returns the HTTP status from `get_status()` and `cancel` returns `response.status_code`. [zia.sdk-python.audit-logs-client:raw-return-values] Each `AuditLogsAPI` method (`get_status`, `create`, `cancel`, `get_report`) returns a bare None, not the error, when the request cannot be built or fails. [zia.sdk-python.audit-logs-client:errors-return-none]

**Stray quote in the path.** The Python audit log client builds the `create` and `cancel` URLs from a multi-line string whose path line is `/auditlogEntryReport"`, with a stray closing double quote, and `format_url` only strips whitespace from each line. The recorded integration cassette shows the POST and the DELETE sent to `/auditlogEntryReport%22`, while the status GET and the download GET use the clean path. [zia.sdk-python.audit-logs-client:create-cancel-url-stray-quote] Whether the service accepts the quoted path is open [gap:zia.sdk-python.audit-logs-client:quoted-path-accepted].

**Cancel.** [`ZscalerAPIResponse` keeps the HTTP status in `_status`, reads it from the underlying response once in its constructor, and exposes it through `get_status()`.](kb:shared.sdk-python.response-handling:status-accessor) `AuditLogsAPI.cancel` raises AttributeError when the DELETE request succeeds, because it reads `response.status_code` from a `ZscalerAPIResponse`. [zia.sdk-python.audit-logs-client:cancel-attribute-error]

What to check:
1. Whether a cancel call raised or returned None, and whether the report request was in fact cancelled, before trusting the return value.
2. That the status code returned by create is an integer HTTP status, not a result object.

Inferred, not quoted (say so when an answer rests on one):
- [zia.sdk-python.audit-logs-client:cancel-attribute-error] Tier B: Holds if the executor returns a `ZscalerAPIResponse` for this call, as it does by default; derived from reading the code, not from running the call.

Not known (open gaps):
- Whether ZIA accepts the audit report POST and DELETE sent to a path ending in %22 [gap:zia.sdk-python.audit-logs-client:quoted-path-accepted]: settled by lab-test. Blocks: knowing whether the Python audit log create and cancel calls can work at all, or fail with 404

Area: zia.sdk-python, its subjects in references/_meta/spine/zia/zia.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-python.response-handling.md (What the Python SDK does with a response: key casing, models, the response object)
- links-to references/_meta/text/zia/zia.audit-logs.report-api.md (Exporting the ZIA admin audit log through the report API)
