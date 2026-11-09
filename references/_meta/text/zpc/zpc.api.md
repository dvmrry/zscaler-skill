# How the ZPC API is reached, authenticated, rate limited and queried for alerts (zpc.api)
Also called: ZPC API; x-api-key; api.zpccloud.net

The ZPC API gives programmatic access to retrieve cloud alerts for ZPC. [zpc.api:api-purpose] Using the ZPC API requires an API key and either an API management tool or the Zscaler Help Portal. [zpc.api:prerequisites] The hub is [What Zscaler Posture Control (ZPC) is to administer: portal access, setup order, notifications and audit logs](kb:zpc.overview). Whether the service is still available is open [gap:zpc.api:service-status].

**Server and authentication.** The ZPC API server is api.zpccloud.net/v1 for organizations in the USA and api.eu.zpccloud.net/v1 for organizations in the EU. [zpc.api:server-urls] The client authenticates by sending the API key as the value of the x-api-key header. [zpc.api:authentication] The Getting Started page gives the base URL form as <protocol>://<host>/v1/alerts, with /v1/alerts as the base URL. [zpc.api:base-url-format] The Getting Started page example request is GET /api/v1/alerts/cloud with Host api.zpccloud.net. [zpc.api:getting-started-example-request]

**Rate limits.** The API rate limits an endpoint called from a given IP more than 5 times in a second or 5,000 times in an hour for a GET call; limits start at the first call. [zpc.api:rate-limits] Rate limits throttle API calls for basic CRUD operations, and Zscaler recommends waiting to proceed if subject to rate limiting. [zpc.api:rate-limit-scope] The limits for calls other than GET are open [gap:zpc.api:rate-limits-get-only].

**Status codes.** The API returns 200 Successful, 403 Forbidden and 429 for exceeding the rate limit or quota. [zpc.api:status-codes-basic] A 304 empty response is returned when an Etag identifier is passed in an If-None-Match header on a GET and matches the cached entry; a non-matching Etag returns 200 with new data. [zpc.api:status-304] 400 is returned for an API key name that already exists, an invalid group name, or an invalid request format from invalid parameters or values; 401 is returned for a revoked API key or a corrupted JWT token. [zpc.api:status-400-401] A 500 Internal Server Error carries a correlation ID in the x-correlation-id response header and in the response body, to be given to Zscaler Support. [zpc.api:status-500] The cause of 403 is open [gap:zpc.api:forbidden-cause].

**Alerts.** Cloud alerts are retrieved by sending a GET request to the endpoint /alerts/cloud. [zpc.api:cloud-alerts-endpoint] IaC alerts come from GET /alerts/iac; in that section limit is the page size, defaulting to 100 with a maximum of 100. [zpc.api:alerts-endpoints-paging] With the created[start], created[end], updated[start] and updated[end] parameters (epoch seconds), alerts default to the last 48 hours when no times are given; a start alone gives up to 48 hours from it, an end alone gives the 48 hours before it. [zpc.api:alerts-time-window] The alerts filters include cloud_account_type (AWS, GCP, AZURE, KUBERNETES), alert_status (OPEN, CLOSED, RESOLVED, IGNORED) and risk_level (LOW, MEDIUM, HIGH, CRITICAL). [zpc.api:alerts-filters] The order_by values listed under the IaC alerts parameters include severity:asc, severity:desc, created:desc, updated:asc and alert_status:asc. [zpc.api:alerts-order-by] Documented field values: csp (AWS, GCP, AZURE, KUBERNETES, OCI), theme (Compliance, Security Events, Security Exposure), alert_focus (Asset, Identity) and kubernetes cluster type (EKS, AKS, GKE). [zpc.api:alerts-fields-values] The Getting Started example response shows total_count, prev_link and next_link, and an alert_status_description for an alert closed automatically because the cloud resource is deleted. [zpc.api:alerts-response-example] The alert status values are open [gap:zpc.api:alert-status-values]. The Alerts reference is open [gap:zpc.api:alerts-reference-swagger].

What to check:
1. The API key goes in the x-api-key header, and the ZPC API server is api.zpccloud.net/v1 for organizations in the USA and api.eu.zpccloud.net/v1 for organizations in the EU.
2. A 429 is returned for exceeding the rate limit or quota; the limits stated are for a GET call.

Not known (open gaps):
- Whether the ZPC API these pages describe is still available [gap:zpc.api:service-status]: settled by source-read
- Rate limits for calls other than GET [gap:zpc.api:rate-limits-get-only]: settled by source-read or support-ticket
- What causes a 403 Forbidden [gap:zpc.api:forbidden-cause]: settled by support-ticket or lab-test
- Which alert status values the API uses [gap:zpc.api:alert-status-values]: settled by lab-test or source-read
- What the Alerts reference Swagger capture says [gap:zpc.api:alerts-reference-swagger]: settled by source-read

Area: zpc.api, its subjects in references/_meta/spine/zpc/zpc.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpc/zpc.overview.md (What Zscaler Posture Control (ZPC) is to administer: portal access, setup order, notifications and audit logs)
