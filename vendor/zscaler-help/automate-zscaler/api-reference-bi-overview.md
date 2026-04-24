# Business Insights (BI) API Overview | Zscaler Automation Hub

**Source:** https://automate.zscaler.com/docs/api-reference-and-guides/api-reference/bi/business-insights-api
**Captured:** 2026-04-24 via Playwright MCP.

---

## Version: 1.0

Base URL: `https://api.zsapi.net/bi/api/v1`

## Authentication

Uses standard OneAPI OAuth 2.0 flow via ZIdentity.

## Rate Limits

| Tier | Req/sec | Req/hour | Applies To |
|------|---------|---------|-----------|
| Heavy | 1 | 400 | Custom Applications (CRUD), Report Configurations (CRUD) |
| Light | 2 | 1,000 | Reports (List All, Download) |

Rate limit error (429):
```json
{
  "errorCode": "RATE_LIMIT_EXCEEDED",
  "errorDetails": "Rate limit exceeded. Maximum 2 requests per second and 1000 requests per hour is allowed.",
  "timestamp": 1772573283919
}
```

## Endpoints

### Custom Applications
- `GET /bi/api/v1/customApps` — List custom applications
- `POST /bi/api/v1/customApps` — Create custom application
- `PUT /bi/api/v1/customApps/{id}` — Update custom application
- `DELETE /bi/api/v1/customApps/{id}` — Delete custom application

### Report Configurations
- `GET /bi/api/v1/reportConfigurations` — List report configurations
- `POST /bi/api/v1/reportConfigurations` — Create report configuration
- `PUT /bi/api/v1/reportConfigurations/{id}` — Update report configuration
- `DELETE /bi/api/v1/reportConfigurations/{id}` — Delete report configuration

### Reports
- `GET /bi/api/v1/report/all` — List all reports
- `GET /bi/api/v1/report/download` — Download a report

## List All Reports - Details

**GET** `https://api.zsapi.net/bi/api/v1/report/all`

Query Parameters:
- `reportType` (string): `APPLICATION`, `DATA_EXPLORER`, or `WORKPLACE`. Default: `APPLICATION`
- `subType` (string): `CustomDataFeed`, `ScheduledReports`, or `SaveAndSchedule`. Default: `CustomDataFeed`
- `startTime` (int64): Unix timestamp seconds. Default: midnight UTC 1st day of previous month
- `endTime` (int64): Unix timestamp seconds. Default: current time
- `reportName` (string): Filter by report name (optional)

Report Type Descriptions:
- `APPLICATION` - For Application Reports
- `WORKPLACE` - For Workplace Reports
- `DATA_EXPLORER` - For Data Explorer Reports

Sub-type Descriptions:
- `CustomDataFeed` - For custom Apps list and download
- `ScheduledReports` - For scheduled reports list and download
- `SaveAndSchedule` - For data explorer save and schedule reports list and download

Response Schema:
```json
{
  "reportType": "DATA_EXPLORER",
  "startTime": "2025-07-26",
  "endTime": "2025-12-29",
  "cloud": "zsprotect.net",
  "orgId": "8xx9",
  "reports": [
    {
      "fileName": "...",
      "reportName": "...",
      "reportDate": "2025-07-31",
      "subType": "SAVE_AND_SCHEDULE",
      "size": 9424,
      "appName": "...",
      "reportId": "100111",
      "appId": "82449"
    }
  ]
}
```

## Example: List All Reports

```python
import http.client

conn = http.client.HTTPSConnection("api.zsapi.net")
headers = {'Authorization': 'Bearer <Bearer Token>'}
conn.request(
  "GET",
  "/bi/api/v1/report/all?reportType=DATA_EXPLORER&subType=SaveAndSchedule&startTime=1753560715&endTime=1765405024",
  '',
  headers
)
res = conn.getresponse()
data = res.read()
print(data.decode("utf-8"))
```
