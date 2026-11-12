# Python SDK Log Streaming helpers: client types, log formats and status codes (zpa.sdk-python.lss-helpers)
Also called: get_client_types python; get_log_formats does not exist; get_all_log_formats; get_status_codes log_type; add_lss_config default format; lss helper returns None; client_type lss policy rule python

These are claims about the Python SDK's LSS receiver helpers. The source log type map is in [Log types a ZPA log receiver can carry, and their codes](kb:zpa.log-receivers.log-types).

**Helpers that call the API.** `get_client_types` makes a GET to the `clientTypes` path under the LSS config endpoint, and returns a map from each display name, lower-cased with spaces turned to underscores, to its code; it is an API call, not a built-in table. [zpa.sdk-python.lss-helpers:client-types-call] Building an LSS policy rule with a `client_type` condition calls `get_client_types()` once for each client-type value in the condition and looks the value up in the result, so each value costs an extra request. When that lookup fails, `get_client_types` returns None and the subscript raises TypeError. [zpa.sdk-python.lss-helpers:client-types-client-type-rule]

**Bare return values.** `get_client_types`, `get_all_log_formats` and `get_status_codes` return a dictionary or None, not the usual three-element tuple, and return None when the request cannot be built or fails. [zpa.sdk-python.lss-helpers:helpers-bare-return]

**Creating a receiver.** `add_lss_config` takes the receiver format from `log_stream_content` if given and otherwise fetches all log formats and indexes them by source log code and `source_log_format`, which defaults to csv; if that fetch returned None the indexing fails inside the SDK. [zpa.sdk-python.lss-helpers:add-fetches-default-format] When `policy_rules` is given, `add_lss_config` looks up the SIEM_POLICY policy set and puts its ID in the rule's `policySetId`; the rule name defaults to SIEM_POLICY. [zpa.sdk-python.lss-helpers:add-policy-set-lookup]

**Status codes.** `get_status_codes` with a log type other than all keeps the codes whose `log_types` include the source log code mapped from that key, and raises ValueError for a key not in the source log map. [zpa.sdk-python.lss-helpers:status-codes-filter]

What to check:
1. Whether a receiver create failed on a helper that returned None, since the helpers hide the error and the create then fails inside the SDK.
2. Whether a client_type rule used the display names the lookup builds (lower-case, underscores).

Area: zpa.sdk-python, its subjects in references/_meta/spine/zpa/zpa.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.log-receivers.formats.md (Log stream format and content templates for a ZPA log receiver)
- see-also references/_meta/text/zpa/zpa.sdk-python.return-shapes.md (What Python SDK ZPA calls return: model objects, snake_case dictionaries, bare values and raised errors)
