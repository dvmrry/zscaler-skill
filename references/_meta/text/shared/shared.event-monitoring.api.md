# The Event Monitoring & Notification API: what it does, access, headers and limits (shared.event-monitoring.api)
Also called: event monitoring api; event monitoring notification api; x-em-cloud; x-em-tenant; event monitoring subscribe role; zpa connector down notification api; event subscriptions oneapi

The Event Monitoring & Notification API is a shared service for monitoring, alerting and automated response across Zscaler products, including ZIA, ZPA and Data Protection, delivering notifications by email, webhook or Amazon SNS. [shared.event-monitoring.api:what-it-is] It offers a service catalog of sources, source types and source events navigated through HATEOAS links, and subscriptions to specific events; the catalog is hierarchical, Sources, then Source Types, then Source Events. [shared.event-monitoring.api:capabilities]

**Where it lives.** Its OneAPI base URL is `https://api.zsapi.net/event-monitoring`. [shared.event-monitoring.api:base-path] The repository's structural validation of the captured contract counts 15 operations on 12 paths for Event Monitoring, including catalog reads under `/catalog/sources`. [shared.event-monitoring.api:operations]

**Access.** The service must be enabled for the tenant by the Zscaler account team, and the API client needs the Event Monitoring Subscribe role (view-only on the catalog, full access to subscriptions) plus a role from the product resource whose notifications it subscribes to. [shared.event-monitoring.api:prerequisites] The guide says notifications can currently be subscribed for ZPA, so a ZPA product-resource role is required. [shared.event-monitoring.api:zpa-only-today]

**Tenant headers.** Every subscription call needs `x-em-cloud` (the product tenant's cloud, for example prod.zpath.net) and `x-em-tenant` (the product tenant ID); monitoring several product tenants takes separate subscriptions with different headers. [shared.event-monitoring.api:tenant-headers]

**Limits and errors.** All Event Monitoring endpoints are limited to 1,000 calls per second per tenant; responses carry `x-ratelimit-limit`, `x-ratelimit-remaining` and `x-ratelimit-reset`, documented here as Unix epoch seconds. [shared.event-monitoring.api:rate-limit] It returns 400 `BAD_REQUEST` for malformed JSON or missing subscription fields (name, description, scope, channels, enabled), 401 `UNAUTHORIZED`, 403 `FORBIDDEN` for an insufficient role, 404 `NOT_FOUND` for an unknown source key or subscription ID, 429 `RATE_LIMITED` and 500 `INTERNAL_ERROR`, for which the guide says to report the response's correlation_id to Zscaler Support. [shared.event-monitoring.api:error-codes]

**Audit.** All operations log the tenant ID, trace ID, API client ID, client IP address and the change details. [shared.event-monitoring.api:audit-logging]

**Clients.** None of the pinned Python SDK, Go SDK, MCP server, ZIA provider or ZPA provider references the Event Monitoring paths, so the API is reached only by direct HTTP calls. [shared.event-monitoring.api:no-client-support] Notification channels, SNS setup and verification are in [Event Monitoring notification channels: email, webhook and Amazon SNS setup and verification](kb:shared.event-monitoring.channels).

What to check:
1. Whether the tenant has the service enabled and the API client holds both the Event Monitoring Subscribe role and a role from the monitored product's resource.
2. Whether every subscription call carries x-em-cloud and x-em-tenant for the product tenant being monitored.

Inferred, not quoted (say so when an answer rests on one):
- [shared.event-monitoring.api:no-client-support] Tier B: Search of each submodule at its pin for 'event-monitoring' and 'subscriptions/channels' found no file; an absence by search.

Area: shared.event-monitoring, its subjects in references/_meta/spine/shared/shared.event-monitoring.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token): The service must be enabled for the tenant by the Zscaler account team, and the API client needs the Event Monitoring Subscribe role (view-only on the catalog, full access to subscriptions) plus a role from the product resource whose notifications it subscribes to. [shared.event-monitoring.api:prerequisites]
- links-to references/_meta/text/shared/shared.event-monitoring.channels.md (Event Monitoring notification channels: email, webhook and Amazon SNS setup and verification)
