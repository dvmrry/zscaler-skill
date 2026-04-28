# Understanding Browser Access Log Fields

Source: https://help.zscaler.com/zpa/understanding-browser-access-log-fields
Fetched: 2026-04-28

The Log Streaming Service (LSS) can send HTTP log information related to Browser Access to any third-party log analytics tool. By default, the log type, Browser Access, includes the fields listed in the table below for each log template (i.e., CSV, JSON, TSV). While configuring your log receiver, you can edit the default log stream content to capture only specific fields, and create a custom log template.

## Field Table

| Field | Description | Supported Field Format Specifications |
|---|---|---|
| LogTimestamp | The timestamp when the log was generated | %[OPT]s, %[OPT]j, %[OPT]J |
| ConnectionID | The application connection ID | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| Exporter | The Browser Access service instance to the Public Service Edge for Private Access or Private Service Edge for Private Access instance | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| TimestampRequestReceiveStart | The timestamp in microseconds when the Browser Access service receives the first byte of the HTTP request from web browser | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampRequestReceiveHeaderFinish | The timestamp in microseconds when the Browser Access service receives the last byte of the HTTP header corresponding to the request from web browser | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampRequestReceiveFinish | The timestamp in microseconds when the Browser Access service receives the last byte of the HTTP request from web browser | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampRequestTransmitStart | The timestamp in microseconds when the Browser Access service sends the first byte of the HTTP request to the web server | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampRequestTransmitFinish | The timestamp in microseconds when the Browser Access service sends the last byte of the HTTP request to the web server | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampResponseReceiveStart | The timestamp in microseconds when the Browser Access service receives the first byte of the HTTP response from the web server | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampResponseReceiveFinish | The timestamp in microseconds when the Browser Access service receives the last byte of the HTTP response from the web server | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampResponseTransmitStart | The timestamp in microseconds when the Browser Access service sends the first byte of the HTTP response to the web browser | %[OPT]s, %[OPT]j, %[OPT]J |
| TimestampResponseTransmitFinish | The timestamp in microseconds when the Browser Access service sends the last byte of the HTTP response to the web browser | %[OPT]s, %[OPT]j, %[OPT]J |
| TotalTimeRequestReceive | The time difference between reception of the first and last byte of the HTTP request from the web browser as seen by the Browser Access service | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| TotalTimeRequestTransmit | The time difference between transmission of the first and last byte of the HTTP request towards the web server as seen by the Browser Access service | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| TotalTimeResponseReceive | The time difference between reception of the first and last byte of the HTTP response from the web server as seen by the Browser Access service | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| TotalTimeResponseTransmit | The time difference between transmission of the first and last byte of the HTTP response towards the web browser as seen by the Browser Access service | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| TotalTimeConnectionSetup | The time difference between reception of the first byte of the HTTP request from web browser and transmission of the first byte towards the web server, as seen by the Browser Access service | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| TotalTimeServerResponse | The time difference between transmission of the last byte of the HTTP request towards the web server and reception of the first byte of the HTTP response from web server, as seen by the Browser Access service | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| Method | The HTTP request method | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| Protocol | The HTTP protocol | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| Host | The web application | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| URL | The URL requested by the user | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| UserAgent | The user agent string as specified in the HTTP host request header | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| XFF | The X-Forwarded-For (XFF) HTTP header | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| NameID | The NameID received by Private Access in the SAML assertion from the IdP | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| StatusCode | The HTTP status code | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| RequestSize | The size of the HTTP request | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| ResponseSize | The size of the HTTP response | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| ApplicationPort | The application port on the web server | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| ClientPublicIp | The public IP address of the user's device | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| ClientPublicPort | The source port used by the user's device | %[OPT]d, %[OPT]x, %[OPT]f, %[OPT]o |
| ClientPrivateIp | The private IP address of the user's device | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| Customer | The name of the customer | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| ConnectionStatus | The status of the connection | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| ConnectionReason | The internal reason | %[OPT]s, %[OPT]j, %[OPT]J, %[OPT]o |
| CorsToken | The token from the CORS request | %[OPT]s |
| Origin | The Browser Access domain that led to the origination of the CORS request | %[OPT]s |
