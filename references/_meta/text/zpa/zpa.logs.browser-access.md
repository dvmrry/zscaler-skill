# What a ZPA Browser Access log record says and does not say (zpa.logs.browser-access)
Also called: zpn_http_trans_log record; browser access log fields; ConnectionReason browser access; TotalTimeServerResponse; TotalTimeConnectionSetup; CorsToken Origin; Exporter unset; browser access nameid vs username

The Browser Access log is the HTTP-level log for clientless access; its log type and NameID identity field are in [Browser Access in LSS: log type and identity field](kb:zpa.browser-access.logs). The record is only loosely specified and its example departs from its table.

**Granularity and identity.** What one record represents is open [gap:zpa.logs.browser-access:record-granularity]. How NameID relates to a ZCC username is open [gap:zpa.logs.browser-access:identity-vs-activity]. The record carries ClientPublicIp (public IP of the user's device), ClientPublicPort (source port used by the user's device) and ClientPrivateIp (private IP of the user's device), with XFF as the X-Forwarded-For HTTP header; the example has an empty XFF. [zpa.logs.browser-access:clientip-fields]

**Status.** In the example record ConnectionStatus and ConnectionReason are both empty strings, and the field table describes them only as the status of the connection and the internal reason. [zpa.logs.browser-access:status-reason-empty-sample] The value sets are open [gap:zpa.logs.browser-access:connection-status-values].

**Timing.** TotalTimeConnectionSetup is the time from receipt of the first byte of the HTTP request from the browser to transmission of the first byte towards the web server, and TotalTimeServerResponse is the time from transmission of the last byte of the request towards the web server to receipt of the first byte of the response. [zpa.logs.browser-access:phase-time-definitions] The TotalTime* descriptions state no unit; in the example TotalTimeConnectionSetup is 66995 while TimestampRequestReceiveStart (05:12:25.723Z) and TimestampRequestTransmitStart (05:12:25.790Z) fall in the same second, at .723 and .790. [zpa.logs.browser-access:time-unit-sample] Timestamps are described in microseconds but shown as ISO strings, which the default template produces with the :iso8601 modifier [divergence:zpa.logs.browser-access:timestamp-format]. Attributing the intervals to the proxy or the backend is open [gap:zpa.logs.browser-access:latency-attribution].

**Other fields.** Exporter is described as the Browser Access service instance to the Public Service Edge for Private Access or Private Service Edge for Private Access instance, and the example record has the literal value unset. [zpa.logs.browser-access:exporter-field] Protocol is described as the HTTP protocol, and the example record has Protocol HTTPS. [zpa.logs.browser-access:protocol-sample] The example record ends with two unlabeled, unquoted values, https://example.com and token_created, after ConnectionReason; the table gives CorsToken as the token from the CORS request and Origin as the Browser Access domain that led to the CORS request, and the Browser Access (zpn_http_trans_log) JSON format in the LSS API article's example response for all log formats ends with ConnectionReason, then Origin, then CorsToken, each labelled, which places https://example.com as Origin and token_created as CorsToken. [zpa.logs.browser-access:cors-values-unlabeled] When the CORS fields appear is open [gap:zpa.logs.browser-access:cors-presence], as is the size measurement point [gap:zpa.logs.browser-access:size-measurement].

What to check:
1. Whether a SIEM rule routes on a ConnectionStatus or ConnectionReason value that no capture lists.
2. Whether a latency conclusion used the interval definitions as seen by the Browser Access service.

Sources disagree (name both sides):
- Browser Access timestamps described in microseconds versus shown as ISO 8601 strings [divergence:zpa.logs.browser-access:timestamp-format]
  - zscaler-help: The Timestamp* fields are described as timestamps in microseconds.
  - zscaler-help: The example shows them as ISO 8601 strings with millisecond precision.
  - zscaler-help: The default Browser Access template writes the Timestamp* fields with the :iso8601 modifier ([[zpa/browser-access-log]]).
  - zscaler-help: The content-format article shows the :iso8601 modifier rendering a timestamp field as an ISO 8601 string: %s{startrx_us:iso8601} appears as 2017-09-05T09:44:06.363Z.
  Impact: The default template renders the Timestamp* fields with :iso8601, so a default-format record carries ISO 8601 strings, as the example shows. A custom template that writes them without :iso8601 may produce another form; read the format from the receiver's template rather than assuming microsecond integers.

Not known (open gaps):
- ConnectionStatus and ConnectionReason value sets for Browser Access [gap:zpa.logs.browser-access:connection-status-values]: settled by tenant-data or lab-test or support-ticket. Blocks: routing SIEM rules on Browser Access failure types
- Whether a Browser Access record is one HTTP request and response [gap:zpa.logs.browser-access:record-granularity]: settled by tenant-data or lab-test. Blocks: counting requests or transactions from Browser Access records
- Reading TotalTimeConnectionSetup as proxy overhead and TotalTimeServerResponse as backend latency [gap:zpa.logs.browser-access:latency-attribution]: settled by lab-test. Blocks: attributing slowness to the backend or to the Private Access path
- When CorsToken and Origin appear in Browser Access records [gap:zpa.logs.browser-access:cors-presence]: settled by tenant-data. Blocks: parsing Browser Access records that are not CORS requests
- Where RequestSize and ResponseSize are measured and how compression is counted [gap:zpa.logs.browser-access:size-measurement]: settled by lab-test or support-ticket. Blocks: comparing Browser Access sizes with other byte counts
- Whether NameID and the User Activity Username identify the same user [gap:zpa.logs.browser-access:identity-vs-activity]: settled by tenant-data. Blocks: correlating Browser Access sessions with ZCC-based User Activity records

Area: zpa.logs, its subjects in references/_meta/spine/zpa/zpa.logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.browser-access.logs.md (Browser Access in LSS: log type and identity field)
