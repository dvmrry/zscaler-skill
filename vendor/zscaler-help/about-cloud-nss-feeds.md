# About Cloud NSS Feeds

**Source:** https://help.zscaler.com/zia/about-cloud-nss-feeds
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Watch a video about Cloud NSS feeds (shows legacy UI).

Cloud NSS allows you to instantly stream logs from the Zscaler cloud directly into a compatible cloud-based security information and event management (SIEM) system without the need to deploy an NSS virtual machine (VM) for Web or Firewall. To learn more, see Understanding Nanolog Streaming Service (NSS).

A Cloud NSS feed specifies the data from the logs that Cloud NSS sends to your SIEM. You can configure one Cloud NSS feed per log type (e.g., SaaS Security) per Cloud NSS instance. The feed is automatically assigned to Cloud NSS when you configure the feed. Also, you can use Cloud NSS feeds to configure SIEM connectivity across cloud-based SIEMs.

Cloud NSS feeds provide the following benefits and enable you to:

- Support robust and extensive cloud-to-cloud logging by creating a feed for supported log types (e.g., Web, Tunnel).
- Define different filters and fields in each Cloud NSS feed for relevant data collection and select your preferred feed output format (e.g., JSON) for actionable reports.

## About the Cloud NSS Feeds Page

On the Cloud NSS Feeds page (Logs > Log Streaming > Internet Log Streaming - Nanolog Streaming Service), you can do the following:

- Add a Cloud NSS feed.
- Search for a Cloud NSS feed.
- View a list of all configured Cloud NSS feeds. For each feed, you can see:
  - Feed Overview: The general parts of the Cloud NSS feed (e.g., Feed Name, Status).
  - Log Filter: The log type and its log type attributes.
  - Feed Output Format: The strings pertaining to the log type. To learn more, see General Guidelines for NSS Feeds and Feed Formats.
  - Feed Attributes: Other feed attributes (e.g., Time Zone, Max Batch Size).
  - Last Connectivity Test: The time of the last completed connectivity test.
- Modify the table and its columns.
- Test the connectivity to the SIEM.

A Cloud NSS feed behaves differently according to HTTP/S response status codes from the SIEM. The following responses are not specific to testing connectivity:

- HTTP code 200 or 204: The feed considers the batch of logs successfully uploaded.
- HTTP code 400: The feed considers the batch of logs to have a parsing error and drops the batch.
- Any other HTTP code (e.g., 401, 403, 501): The feed repeatedly attempts to upload the same batch until it receives a 200, 204, or 400 response from the SIEM up to one hour. After one hour, the batch is dropped.

- Edit a Cloud NSS feed.
- Add an NSS server.
- Add an NSS feed.
- Add an NSS Collector server.
