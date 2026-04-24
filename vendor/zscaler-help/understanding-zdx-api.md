# Understanding the ZDX API

**Source:** https://help.zscaler.com/legacy-apis/understanding-zdx-api
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Legacy Zscaler APIs Help 
ZDX API 
Understanding the ZDX API
Understanding the ZDX API
API Developer & Reference Guide
Understanding the ZDX API

The ZDX API gives you programmatic access to ZDX features:

Authentication

Returns the authentication token for access to ZDX API.

Close
Administration

Lists the active locations and departments for a tenant.

Close
Alerts

Retrieves alert details such as device, application, network performance, and ZDX Score.

Some Alert API endpoints require a 2-hour time range to provide 2 hours of data. If more data is required for a longer duration, another request with a different 2-hour time frame must be sent. For example, you cannot send an API request from 12:00 PM to 4:00 PM as this exceeds 2 hours. You must send an API request with a time range from 12:00 PM to 2:00 PM and another one from 2:00 PM to 4:00 PM.

The following endpoints do not require a time range:

/alerts/{alert_id}
/alerts/{alert_id}/affected_devices
Close
Inventory

Retrieve the distribution of software information across your organization.

Close
Reports

Retrieves ZDX Scores for applications and specific device health metrics and events.

Most Report API endpoints require a 2-hour time range to provide 2 hours of data. If more data is required for a longer duration, another request with a different 2-hour time frame must be sent. For example, you cannot send an API request from 12:00 PM to 4:00 PM as this exceeds 2 hours. You must send an API request with a time range from 12:00 PM to 2:00 PM and another one from 2:00 PM to 4:00 PM.

The endpoint, /devices/{deviceid}/events, does not require a time range.

Close
Troubleshooting

Start deep tracing on a specific user and their respective device.

Close

If you are using ZDX API, be aware of the caveats:

Inconsistency in data

The data returned by the ZDX API might not exactly match the data on the ZDX UI. The difference between the data is a marginal 2% because the aggregated metrics compute using approximate functions. The ZDX API does this in order to maximize performance.

For example, the Page Fetch Time (PFT) for a Web probe on the ZDX UI is 89ms while the API shows PFT as 90ms.

Close
Delay in data

Zscaler Client Connector does the hard work of collecting all the telemetry and reporting. This can cause a delay from collection to reporting, which is estimated to be 20 minutes. To get the full data for an hour, ensure that you use the correct timestamp and adjust for this delay.

Close
ZDX Score value of -1

If you receive a ZDX Score of -1 on the ZDX API, then there is no data available.

Close

Prior to the use of API, Zscaler recommends reviewing Getting Started for information regarding prerequisites, authentication, and making API calls.

For information on rate limits, see Understanding Rate Limiting. To learn more about HTTP status codes, see Understanding Error Codes. If you encounter any issues with the ZDX API, contact Zscaler Support.

Was this article helpful? Click an icon below to submit feedback.
