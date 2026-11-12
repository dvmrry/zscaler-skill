# Log stream format and content templates for a ZPA log receiver (zpa.log-receivers.formats)
Also called: log stream content; lss format csv json tsv; custom log template; lss format string; zpa_lss_config_log_type_formats; restore default content

A receiver's format is the log stream content template, taken from a per-type list of CSV, TSV and JSON templates and editable into a custom one.

**Templates.** The formats endpoint returns the pre-configured log formats for a requested log type; the Go SDK models the response as tsv, csv and json strings, and the Terraform data source exposes them as tsv, csv and json attributes. [zpa.log-receivers.formats:formats-endpoint] In the Admin Console the Log Template is CSV (comma-separated), TSV (tab-separated), JSON, or Custom, which appears when the Log Stream Content field is edited; the Log Stream Content shown changes with the log type and template chosen. [zpa.log-receivers.formats:console-templates] The format field of a receiver is the format of the log type as given by the formats API, which is the template string with field specifiers. [zpa.log-receivers.formats:format-is-template] The provider documentation words it differently [divergence:zpa.log-receivers.formats:format-enum-vs-template].

**Tools.** [`add_lss_config` takes the receiver format from `log_stream_content` if given and otherwise fetches all log formats and indexes them by source log code and `source_log_format`, which defaults to csv; if that fetch returned None the indexing fails inside the SDK.](kb:zpa.sdk-python.lss-helpers:add-fetches-default-format) In the Python SDK's update, the format is rebuilt from the formats endpoint when source_log_type is passed without log_stream_content, and is left out of the body (so unchanged on the server) when neither is passed. [zpa.log-receivers.formats:python-update-refetch] The Terraform resource requires format to be given explicitly in each receiver; the format data source supplies the template to pass. [zpa.log-receivers.formats:tf-explicit-format]

**Custom content.** The log stream content can be edited in the text field to capture specific fields, which creates a Custom log template; you can click Restore Default Content once it is changed. [zpa.log-receivers.formats:custom-content] The field format string takes the specifiers %s (string), %j (JSON string with quotation marks), %J (JSON string without quotation marks), %d (decimal integer), %x (hexadecimal), %f (float) and %o (256-bit one-way hash), each with an optional width or precision. [zpa.log-receivers.formats:format-specifiers] Field names in a format string are case sensitive, and the default content adds a newline after the last field, so modified content must append at least one newline character after the last field. [zpa.log-receivers.formats:field-names-newline]

Changing the log type without changing the format is not sourced for the provider [gap:zpa.log-receivers.formats:format-type-mismatch].

The Log Stream Content Format article lists sixteen log types its field format specifications apply to: Audit Logs, App Connector Metrics, App Connector Status, Browser Access, Business Continuity Event Logs, KRB Inspection Logs, LDAP Inspection Logs, Microsegmentation Flow, Private Cloud Controller Metrics, Private Cloud Controller Status, Private Service Edge Metrics, Private Service Edge Status, SMB Inspection Logs, User Activity, User Status and Web Inspection. [zpa.log-receivers.formats:format-page-log-types]

ConnectionLogType can be added as a custom field to tell AppProtection and event records apart [The App Connector Status header suggests adding ConnectionLogType as a custom log field to distinguish AppProtection logs from event logs, with expected values event_log and inspection_log.](kb:zpa.logs.control-session-status:connection-log-type).

What to check:
1. That format holds a template string for the receiver's log type, fetched from the formats endpoint, and not just the word CSV, JSON or TSV.
2. Whether the template was edited into a custom one and still ends each record with a newline.
3. Whether the SDK refetched the template when the log type was changed, and whether the provider was given the matching template.

Sources disagree (name both sides):
- What the format argument holds: the provider documentation calls it the format (JSON, CSV or TSV), while the provider schema and the API article describe it as the template string returned by the formats endpoint. [divergence:zpa.log-receivers.formats:format-enum-vs-template]
  - tf-zpa: format is one of JSON, CSV or TSV.
  - zscaler-help: format is the template from the formats endpoint.
  Impact: The provider's own example passes the data source's json attribute, which is a template string; a bare JSON, CSV or TSV word is not what the API article describes.

Not known (open gaps):
- Changing the log type without the format [gap:zpa.log-receivers.formats:format-type-mismatch]: settled by lab-test

Area: zpa.log-receivers, its subjects in references/_meta/spine/zpa/zpa.log-receivers.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.md (ZPA App Connectors), from zpa.log-receivers: App Connectors must be deployed before a log receiver is configured. [zpa.log-receivers.architecture:connectors-first]
- links-to references/_meta/text/zpa/zpa.logs.control-session-status.md (ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers)
- links-to references/_meta/text/zpa/zpa.sdk-python.lss-helpers.md (Python SDK Log Streaming helpers: client types, log formats and status codes)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.log-receivers.configuration.md (What a ZPA log receiver holds and which fields are required)
- see-also references/_meta/text/zpa/zpa.log-receivers.log-types.md (Log types a ZPA log receiver can carry, and their codes)
- see-also references/_meta/text/zpa/zpa.audit-logs.streaming.md (Streaming ZPA audit logs to a SIEM: log type, fields, filtering)
