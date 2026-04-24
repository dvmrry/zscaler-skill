# Zscaler Digital Experience (ZDX) API Overview | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/zdx/zscaler-digital-experience-api
**Captured:** 2026-04-24 via Playwright MCP.

---

## Version: 1.0.0

Base URL: `https://api.zsapi.net/zdx/v1`

## Authentication (ZDX-Specific)

ZDX uses its own token endpoint:

**POST** `https://api.zsapi.net/zdx/v1/oauth/token`

```json
{
  "key_id": "your-api-key-id",
  "key_secret": "SHA256(secret_key:timestamp)",
  "timestamp": 1643829184
}
```

- `key_secret` must be SHA256 of `<secret_key>:<timestamp>`
- Requests sent >15 minutes after timestamp are invalid
- Token is valid for 3600 seconds

## Endpoints by Category

### Administration
- `GET /zdx/v1/administration/departments` — Get departments
- `GET /zdx/v1/administration/locations` — Get locations

### Alerts
- `GET /zdx/v1/alerts/{alertId}` — Get alert by ID
- `GET /zdx/v1/alerts/{alertId}/affectedDevices` — Get affected devices for alert
- `GET /zdx/v1/alerts/historical` — Get historical alerts
- `GET /zdx/v1/alerts/ongoing` — Get ongoing alerts

### API Authentication
- `POST /zdx/v1/oauth/token` — Authenticate using API key ID and secret key
- `GET /zdx/v1/oauth/validate` — Check if JWT token is valid
- `GET /zdx/v1/oauth/jwks` — Get JWKS public keys

### Inventory
- `GET /zdx/v1/inventory/software` — Get software inventory
- `GET /zdx/v1/inventory/softwares/{softwareKey}` — Get software by key

### Reports
- `GET /zdx/v1/activeGeo` — Get active geographic data
- `GET /zdx/v1/apps` — Get all applications
- `GET /zdx/v1/apps/{appId}` — Get specific application
- `GET /zdx/v1/apps/{appId}/metrics` — Get application metrics
- `GET /zdx/v1/apps/{appId}/score` — Get application score
- `GET /zdx/v1/apps/{appId}/users` — Get users for application
- `GET /zdx/v1/apps/{appId}/users/{userId}` — Get specific user for application
- `GET /zdx/v1/devices` — Get all devices
- `GET /zdx/v1/devices/{deviceId}` — Get specific device
- `GET /zdx/v1/devices/{deviceId}/apps` — Get applications for device
- `GET /zdx/v1/devices/{deviceId}/apps/{appId}` — Get specific app for device
- `GET /zdx/v1/devices/{deviceId}/apps/{appId}/callQualityMetrics` — Get call quality metrics
- `GET /zdx/v1/devices/{deviceId}/apps/{appId}/cloudpathProbes` — Get cloud path probes
- `GET /zdx/v1/devices/{deviceId}/apps/{appId}/cloudpathProbes/{probeId}` — Get specific probe
- `GET /zdx/v1/devices/{deviceId}/apps/{appId}/cloudpathProbes/{probeId}/cloudpath` — Get cloud path
- `GET /zdx/v1/devices/{deviceId}/apps/{appId}/webProbes` — Get web probes
- `GET /zdx/v1/devices/{deviceId}/apps/{appId}/webProbes/{probeId}` — Get specific web probe
- `GET /zdx/v1/devices/{deviceId}/events` — Get device events
- `GET /zdx/v1/devices/{deviceId}/healthMetrics` — Get device health metrics
- `GET /zdx/v1/users` — Get all users
- `GET /zdx/v1/users/{userId}` — Get specific user

### Troubleshooting
- `POST /zdx/v1/devices/{deviceId}/deeptraces` — Start deep trace session
- `GET /zdx/v1/devices/{deviceId}/deeptraces` — Get deep traces
- `GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}` — Get specific deep trace
- `DELETE /zdx/v1/devices/{deviceId}/deeptraces/{traceId}` — Delete deep trace
- `GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/cloudpath` — Get cloud path from trace
- `GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/cloudpathMetrics` — Get cloud path metrics
- `GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/events` — Get trace events
- `GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/healthMetrics` — Get health metrics from trace
- `GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/topProcesses` — Get top processes from trace
- `GET /zdx/v1/devices/{deviceId}/deeptraces/{traceId}/webprobeMetrics` — Get web probe metrics
- `POST /zdx/v1/analysis` — Start analysis session
- `GET /zdx/v1/analysis/{analysisId}` — Get analysis result
- `DELETE /zdx/v1/analysis/{analysisId}` — Delete analysis

### Snapshots
- `POST /zdx/v1/snapshots/alerts` — Create snapshot alert

## Rate Limits

ZDX rate limits are tier-based (by number of licenses):

| Tier | Licenses | Req/sec | Req/min | Req/hour | Req/day |
|------|----------|---------|---------|---------|---------|
| 1 | 5,000 | 5 | 30 | 1,000 | 10,000 |
| 2 | 20,000 | 5 | 60 | 3,000 | 15,000 |
| 3 | 100,000 | 5 | 120 | 6,000 | 30,000 |
| 4 | >100,000 | 5 | 180 | 9,000 | 60,000 |

Rate limit response headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`

## Example: Start Deep Trace

```python
url = "https://api.zsapi.net/zdx/v1/devices/{device_id}/deeptraces"
payload = {
  "session_name": "my-trace-session",
  "session_length_minutes": 5,
  "probe_device": True
}
headers = {"Authorization": "Bearer <Access Token>"}
response = requests.post(url, headers=headers, json=payload)
# Response: {"trace_id": 0, "status": "not_started", "expected_time": 0}
```
