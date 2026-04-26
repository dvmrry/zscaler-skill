# About NSS Feeds

**Source:** https://help.zscaler.com/zia/about-nss-feeds
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

An NSS feed specifies the data from the logs that the NSS sends to your security information and event management (SIEM) system. You can add as many as 16 feeds per NSS server. (Web and Firewall logs are each limited to 8 feeds per server to ensure optimal performance.)

NSS feeds provide the following benefits and enable you to:

- Define different filters and fields in each NSS feed for relevant data collection and select your preferred feed output format (e.g., CSV) for actionable reports.
- Add a separate feed for real-time alerts to monitor essential NSS connections to the Zscaler Nanolog and to your SIEM.

## About the NSS Feeds Page

On the NSS Feeds page (Logs > Log Streaming > Internet Log Streaming - Nanolog Streaming Service), you can do the following:

- Add a TCP NSS feed.
- Add an MCAS NSS feed.
- Search for an NSS feed.
- View a list of all configured NSS feeds. For each feed, you can see:
  - Feed Overview: The general parts of the NSS feed (e.g., Feed Name, NSS Server, Status).
  - Log Filter: The log type and its log type attributes.
  - Feed Output Format: The strings pertaining to the log type. To learn more, see General Guidelines for NSS Feeds and Feed Formats.
  - Feed Attributes: Other feed attributes (e.g., Duplicate Logs, Time Zone).
- Modify the table and its columns.
- Edit an NSS feed.
- Add an NSS server.

To learn more about adding NSS servers per platform, see the NSS Deployment Guides.

- Add a Cloud NSS feed.
- Add an NSS Collector server.
