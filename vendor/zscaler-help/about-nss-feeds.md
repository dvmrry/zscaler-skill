# About NSS Feeds

**Source:** https://help.zscaler.com/zia/about-nss-feeds
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400216, revision 3213821

---

An NSS feed specifies the data from the logs that the NSS sends to your security information and event management (SIEM) system. You can add as many as 16 feeds per NSS server for a TCP NSS and HTTP NSS together. To ensure optimal performance, Web and Firewall log types are each limited to 8 feeds per server and the HTTP logs are restricted to 2 feeds within the total.
NSS feeds provide the following benefits and enable you to:
- Define different filters and fields in each NSS feed for relevant data collection and select your preferred feed output format (e.g., CSV) for actionable reports.
- Add a separate feed for real-time alerts to monitor essential NSS connections to the Zscaler Nanolog and to your SIEM.
# About the NSS Feeds Page
On the NSS Feeds page (Logs > Log Streaming > Internet Log Streaming - Nanolog Streaming Service), you can do the following:
- Add a TCP NSS feed.
- Add an MCAS NSS feed.
- Add an HTTP NSS Feed.
- Search for an NSS feed.
- View a list of all configured NSS feeds. For each feed, you can see:
  - Feed Overview: The general parts of the NSS feed (e.g., Feed Name, NSS Server, Status).
  - Log Filter: The log type and its log type attributes.
  - Feed Output Format: The strings pertaining to the log type. To learn more, see General Guidelines for NSS Feeds and Feed Formats.
  - Feed Attributes: Other feed attributes (e.g., Duplicate Logs, Time Zone).
  - Last Connectivity Test: The time of the last completed connectivity test.
- Modify the table and its columns.
- Test the connectivity to the SIEM. This field is only populated for the HTTP NSS Feeds.
- The feed behaves differently according to HTTP/S response status codes from the SIEM. The following responses are not specific to testing connectivity:
  - HTTP code 200 or 204: The feed considers the batch of logs successfully uploaded.
  - HTTP code 400: The feed considers the batch of logs to have a parsing error and drops the batch.
  - Any other HTTP code (e.g., 401, 403, 501, etc.): The feed repeatedly attempts to upload the same batch until it receives a 200, 204, or 400 response from the SIEM up to one hour. After one hour, the batch is dropped.
- Edit an NSS feed.
- Copy an NSS feed.
- Add an NSS server.
- To learn more about adding NSS servers per platform, see the NSS Deployment Guides.
- Add a Cloud NSS feed.
- Add an NSS Collector server.
