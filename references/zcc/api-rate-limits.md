---
product: zcc
topic: api-rate-limits
title: "ZCC API Rate Limits — endpoint tiers, headers, retry semantics"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md"
  - "vendor/zscaler-sdk-python/zscaler/zcc/legacy.py"
  - "vendor/zscaler-sdk-python/zscaler/zcc/devices.py"
  - "references/zcc/api.md"
  - "references/zcc/sdk.md"
  - "references/shared/oneapi.md"
author-status: draft
---

# ZCC API Rate Limits

This document covers rate limiting for the Zscaler Client Connector (ZCC) portal API. The ZCC API has the tightest rate limits in the OneAPI suite and uses a flat, tenant-wide cap rather than the weight-based or per-IP models used by other Zscaler products.

## 1. Scope

These limits apply to the ZCC portal API at `/zcc/papi/public/v1`. They govern both the legacy ZCC token path (`apiKey` + `secretKey` → JWT) and the modern OneAPI path (ZIdentity OAuth 2.0 with `zcc.*` scopes). Both auth paths share the same server-enforced rate limits.

The ZCC limits are distinct from:

- **ZIA**: weight-based (100 calls/hour per IP for general endpoints; 1,000 GET calls/hour; 400 POST/PUT calls/hour). ZIA uses `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset` headers.
- **ZPA**: per-IP window (20 GET / 10 write per 10-second window). ZPA returns a `retry-after` header on 429.
- **ZDX**: tier-based by license count (1,000–9,000 calls/hour depending on tier). ZDX uses `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` headers.

ZCC does not share a rate-limit pool with ZIA or ZPA. API calls to `/zia/api/v1` and `/zpa/mgmtconfig/v1` are counted separately.

Source: `vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md`; `references/shared/oneapi.md § ZCC — flat tenant-wide`.

## 2. Endpoint-tier table

ZCC enforces two distinct tiers. The general tier covers all endpoints not listed in the restricted tier.

| Endpoint pattern | HTTP method(s) | Limit per hour | Limit per day | Burst behavior | Scope |
|---|---|---|---|---|---|
| All endpoints not listed below | GET, POST, PUT, DELETE | 100 calls/hour | — | Calls can occur more than once per second up to the hourly cap | Per IP address, per organization |
| `/downloadDevices` | GET | — | 3 calls/day | No burst — daily hard cap | Per IP address, per organization |
| `/downloadServiceStatus` | GET | — | 3 calls/day | No burst — daily hard cap | Per IP address, per organization |
| `/downloadDisableReasons` | GET | — | 3 calls/day | No burst — daily hard cap | Per IP address, per organization |

Notes:
- The 100 calls/hour general limit applies at the tenant level, scoped to the calling IP address. Two API clients originating from the same IP address share the same hourly bucket.
- The 3 calls/day cap on the three download endpoints is independent of the 100 calls/hour general limit. Consuming all three daily download calls does not reduce the general hourly budget, and vice versa.
- The vendor documentation does not publish a per-minute sub-limit for the general tier. The statement that "calls can occur more than once per second" confirms there is no sub-second or per-minute cap; only the hourly ceiling is enforced.
- No per-API-key scoping is documented. The limit is keyed to the source IP address, not to the credential pair used.

Source: `vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md`.

## 3. Rate-limit response headers

ZCC uses a distinct header naming scheme from ZIA and ZDX. The exact header names are:

| Header | Type | Description |
|---|---|---|
| `X-Rate-Limit-Remaining` | Integer | Number of API requests remaining in the current rate-limit window. |
| `X-Rate-Limit-Retry-After-Seconds` | Integer (seconds) | Number of seconds the client must wait before making another API call after the rate limit has been exceeded. Present only when the limit is exceeded (i.e., on 429 responses). |

These headers use the `X-Rate-Limit-*` form. This differs from:
- ZIA, which uses lowercase `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`.
- ZDX, which uses `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`.

A header corresponding to the limit ceiling (analogous to ZIA's `x-ratelimit-limit`) is not documented for ZCC. Callers should not rely on a `X-Rate-Limit-Limit` header being present.

A reset timestamp header analogous to ZIA's `x-ratelimit-reset` or ZDX's `RateLimit-Reset` (epoch seconds) is not documented for ZCC. The `X-Rate-Limit-Retry-After-Seconds` is a relative delay, not an absolute timestamp.

Source: `vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md`; `references/shared/oneapi.md § Surprises worth flagging`.

## 4. HTTP 429 response shape

When a ZCC API call exceeds a rate limit, the server returns HTTP 429 (Too Many Requests). The vendor documentation does not publish a canonical 429 JSON body schema for the ZCC API. The `X-Rate-Limit-Retry-After-Seconds` header is present on 429 responses and gives the wait duration.

For comparison:
- ZPA returns a JSON body with `content-type`, `date`, and `retry-after` on 429.
- Cloud & Branch Connector returns `{ "message": "Rate Limit (1/SECOND) exceeded", "Retry-After": "0 seconds" }`.

The ZCC 429 body shape is unconfirmed from available sources. Callers should parse the `X-Rate-Limit-Retry-After-Seconds` header for the wait signal rather than relying on a body field. See [`_clarifications.md` `zcc-08`](../_clarifications.md#zcc-08--zcc-429-response-body-shape) for the outstanding question.

## 5. Retry strategy

### Server-recommended behavior

The vendor documentation states: "Clients subject to rate limits must back off exponentially to proceed further." No specific base delay, multiplier, or maximum retry count is published in the ZCC rate-limit documentation.

Source: `vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md`.

### SDK behavior — legacy client (`LegacyZCCClientHelper`)

The Python SDK's `LegacyZCCClientHelper` (`vendor/zscaler-sdk-python/zscaler/zcc/legacy.py`) implements the following retry logic:

- **General endpoints (non-download):** Up to 3 retries on 429. The retry delay is read from the `X-Rate-Limit-Retry-After-Seconds` response header. If the header is absent, the client defaults to a 60-second wait.
- **Download endpoints (`/downloadDevices`, `/downloadServiceStatus`, `/downloadDisableReasons`):** The client raises `ValueError` immediately on 429 for these endpoints. It does not retry. This matches the 3-calls/day hard cap behavior — a 429 on a download endpoint signals the daily quota is exhausted.

Source: `references/zcc/sdk.md § Client construction — Python`; `references/zcc/sdk.md § CSV download endpoints`.

### SDK behavior — OneAPI path (`ZCCService` / `ZscalerClient`)

The modern OneAPI client path uses the shared `RequestExecutor` from the Python SDK. Whether the `RequestExecutor` automatically honors `X-Rate-Limit-Retry-After-Seconds` headers from ZCC responses is not confirmed from available sources. The `RequestExecutor` is documented to handle retry logic centrally for ZIA and ZPA; ZCC-specific behavior in the modern path is unconfirmed.

See `references/zcc/sdk.md § Open questions` (Q6) and [`_clarifications.md` `zcc-12`](../_clarifications.md#zcc-12--requestexecutor-zcc-rate-limit-retry-behavior).

### Recommended retry pattern for direct HTTP callers

```
1. Issue the API call.
2. On HTTP 429:
   a. Read X-Rate-Limit-Retry-After-Seconds from the response headers.
   b. If the endpoint is /downloadDevices, /downloadServiceStatus, or
      /downloadDisableReasons, do not retry within the same calendar day.
      Log the exhaustion and alert the operator.
   c. For all other endpoints: wait the duration from the header (default
      to 60 seconds if the header is absent), then retry.
   d. Apply exponential backoff with jitter on successive retries:
      wait = base * (2 ^ attempt) + random_jitter
   e. Cap retries at 3 attempts for scripted automation; surface the
      error to the operator on final failure.
3. On HTTP 200 after retry: resume normal operation. Reset the retry counter.
```

Jitter prevents thundering-herd behavior when multiple automation processes hit the limit simultaneously and retry at the same instant.

## 6. Tenant-wide vs per-key vs per-endpoint scope

### Scoping model

The ZCC rate limit is scoped per IP address, per organization (tenant). This means:

- All API credentials (API key + secret key combinations, or OneAPI OAuth clients) originating from the same IP share the 100 calls/hour budget.
- Different tenants do not share a rate-limit pool — each organization has its own 100 calls/hour.
- There is no documented per-API-key sub-bucket. Two automation scripts using different credentials but the same egress IP address compete for the same 100 calls/hour.

### Window start

The rate-limit window starts at the first API call in that window, not at the top of the hour. This means if an automation script starts at 14:47, the first 100-call window runs until approximately 15:47.

Source: `vendor/zscaler-help/legacy-understanding-rate-limiting-zcc.md` ("All rate limits start as soon as the first call is executed").

### Implication for multi-tenant operations

MSPs or operators managing multiple tenants from a shared egress IP should be aware that each tenant has its own 100 calls/hour allocation (limits are per-org, not shared across orgs). However, the single-egress-IP model means a script that loops across tenants from the same host could inadvertently exhaust limits for an individual tenant before completing all intended operations.

## 7. ZCC API paths: legacy vs OneAPI

ZCC supports two coexisting API paths, and the rate-limit contract applies to both:

| Auth path | Base URL | Rate-limit enforcement |
|---|---|---|
| Legacy (ZCC portal token) | `https://api.zsapi.net/zcc/papi/auth/v1/login` → JWT | Server-enforced 100/hour + 3/day download; legacy SDK client also enforces client-side |
| OneAPI (ZIdentity OAuth 2.0) | `https://<vanity>.zslogin.net/oauth2/v1/token` → Bearer | Server-enforced 100/hour + 3/day download; OneAPI path SDK retry behavior unconfirmed |

The server-enforced limits are identical for both paths. The difference lies in whether the SDK client-layer applies additional client-side enforcement and retry logic.

The ZCC API surface has not been fragmented between legacy and OneAPI limits — there is no documented case where a specific ZCC endpoint follows the OneAPI unified gateway limits instead of the ZCC-specific 100/hour cap. The OneAPI gateway fronts the ZCC API at `api.zsapi.net` for modern tenants, but the ZCC rate-limit model (100/hour flat) is applied at the product layer, not at the OneAPI gateway layer.

Source: `references/shared/oneapi.md § ZCC — flat tenant-wide`; `references/zcc/api.md § Authentication paths — OneAPI vs ZCC legacy`.

## 8. Pagination interaction

High-volume list endpoints — device inventory, admin users, web policies, trusted networks — can consume the hourly budget quickly when iterating large datasets without pagination discipline.

### Recommended page sizes

List endpoints accept `page` (1-indexed) and `page_size` (default 50, maximum 5000) as query parameters.

| Scenario | Recommended `page_size` |
|---|---|
| Single-page retrieval, small fleet (<500 devices) | Default (50) or up to 500 |
| Full fleet sync, large tenant (>5,000 devices) | 5000 (maximum) — reduces page count from 100+ to 1–2 calls |
| Polling loop at high cadence | Smallest viable page size to minimize per-call payload; pair with result caching |

With 100 calls/hour available and the maximum `page_size` of 5000, a full sync of up to 500,000 device records can theoretically complete in two API calls (2% of the hourly budget). In practice, list calls for devices, web policies, trusted networks, and other resources each consume separate calls. Plan the total call count across all list operations, not just for one resource type.

The `list_devices` endpoint under `client.zcc.devices` filters by `os_type`, `username`, `page`, and `page_size`. Using OS-type filters to split large device lists into per-platform queries is one way to process results incrementally without exhausting the budget in a single burst.

Source: `references/zcc/sdk.md § Pagination — Python`; `references/zcc/sdk.md § Pagination — Go`.

## 9. Bulk operations

ZCC does not publish a dedicated bulk endpoint with relaxed rate limits. All device management operations — individual removals, force-removals, machine tunnel removals — each count as one API call against the 100 calls/hour budget.

The only operations that accept batched input arrays are:
- `POST /forceRemoveDevices` — accepts `udids: [str]` (list of UDIDs). This sends one HTTP request that acts on multiple devices simultaneously, counting as a single API call.
- `POST /removeDevices` — similarly accepts `udids: [str]`.

For operators removing large numbers of devices, batching UDIDs into a single `forceRemoveDevices` call is the most efficient approach. The exact maximum number of UDIDs per call is not documented.

Admin sync endpoints (`/syncZiaZdxAdminUsers`, `/syncZpaAdminUsers`) each count as one call but trigger background server-side synchronization. They do not iterate one admin user per call.

Source: `references/zcc/sdk.md § devices — DevicesAPI`; `references/zcc/sdk.md § remove_devices vs force_remove_devices`.

## 10. Common operator scenarios that hit limits

### Initial sync of a large device fleet

An operator scripting an initial inventory pull across all OS types will issue at minimum one `GET /getDevices` call per OS type (5 OS types × 1 call with large `page_size`) plus one `GET /getDeviceDetails` call for any device needing extended metadata. At 100 calls/hour, an initial multi-resource sync (devices, admin users, policies, trusted networks, entitlements) across a tenant with thousands of devices can be completed within a single hourly window with disciplined `page_size` usage — but only if each resource type is retrieved in a single call.

If the script also calls `GET /downloadDevices` for a CSV snapshot during the initial sync, it consumes one of the three daily download credits.

### Periodic export jobs

Jobs that export device and service-status snapshots via `/downloadDevices`, `/downloadServiceStatus`, and `/downloadDisableReasons` are hard-limited to 3 calls per day across all three endpoints combined (the vendor doc describes 3 calls/day per endpoint; the SDK treats all three as individually capped at 3 calls/day).

A job that runs hourly and calls all three export endpoints will exhaust all three download quotas within the first three hours of the day. Operators should schedule these exports to run at most 3 times per day per endpoint, spread across the calendar day.

### Status polling at high frequency

Scripts that poll device connectivity or service status at sub-minute intervals will exhaust the 100 calls/hour general budget in less than 2 minutes (100 calls at 1 call per second ≈ 1 minute 40 seconds). ZCC is not designed for high-frequency polling. Polling intervals shorter than ~36 seconds (100 calls/hour ÷ 3600 seconds ≈ 1 call per 36 seconds) will hit the hourly cap.

### Admin sync automation

`POST /syncZiaZdxAdminUsers` and `POST /syncZpaAdminUsers` each consume one call. Running both on a schedule (e.g., every 15 minutes) adds 8 calls/hour just for admin sync, leaving 92 calls/hour for other operations.

## 11. Mitigation

### Caching

Cache read responses locally for the duration of a script run. Device lists, policy configurations, trusted network definitions, and admin user lists change infrequently compared to the polling intervals automation scripts may use. A 10-minute cache on read responses reduces per-hour call count substantially.

### Reducing polling cadence

Design monitoring and export jobs to run at the minimum cadence required for the operational use case. For device status monitoring, consider ZDX as the appropriate product (ZDX provides higher-cadence device telemetry with its own higher rate limits) rather than polling the ZCC device list.

### Requesting a limit increase

ZCC rate limits are enforced server-side and set per tenant. Operators who legitimately require higher throughput (e.g., MSPs managing very large fleets during onboarding) should open a Zscaler support case to request a rate-limit increase. No self-service mechanism is documented.

### Batching UDIDs in removal operations

When removing or force-removing multiple devices, pass the full list of UDIDs in a single API call rather than looping one device per call. The `/forceRemoveDevices` and `/removeDevices` endpoints each accept an array of UDIDs and count as a single call.

### Staggering multi-tenant automation

MSPs running automation across multiple tenants should stagger runs across tenants to avoid concentrating calls into the same minute. Even though each tenant has its own 100 calls/hour, the source-IP scoping means that all calls from a single egress host contribute to each tenant's bucket.

### Download endpoint scheduling

Schedule the three CSV-export download endpoints to run at most once per 8-hour block across the day (e.g., 06:00, 14:00, 22:00 UTC). This uses all three daily credits while distributing coverage across the 24-hour window.

## 12. Cross-links

- ZCC API surface (endpoints, wire format, SDK methods): [`zcc/api.md`](api.md)
- ZCC SDK reference (Python and Go): [`zcc/sdk.md`](sdk.md)
- OneAPI unified gateway, auth flows, and cross-product rate limit comparison: [`shared/oneapi.md`](../shared/oneapi.md)
