# ZSDK Client Monitoring and Global Insights dashboards (shared.zsdk.dashboards)
Also called: zsdk client monitoring dashboard; zsdk global insights dashboard; zsdk uplink health; zsdk isp leaderboard; zsdk global session heatmap

## Client Monitoring

The Client Monitoring dashboard (Dashboard > Client Monitoring) summarizes device usage across users and mobile devices: locations, operating systems, bandwidth usage, device usage, device models and hardware manufacturer; the time duration can be selected. [shared.zsdk.dashboards:client-monitoring-overview] Client Monitoring shows up to the top 10 locations by policy blocks, up to the top 10 by devices, and top locations by bandwidth usage (up to the top 10). [shared.zsdk.dashboards:client-monitoring-location-panels] Client Monitoring has a Device Trend Results line chart comparing high mobile device usage with a normal baseline, plus percentage pie charts of mobile devices for Operating System Version, Operating System, Device Model and Hardware Manufacturer. [shared.zsdk.dashboards:client-monitoring-charts]

## Global Insights

On the Global Insights dashboard a device is impacted when it participates in a Zscaler-secured application session during the selected time range, and the time range can go up to the previous three days. [shared.zsdk.dashboards:global-insights-scope] The Global Insights overview shows Total Sessions across all devices and up to the top 5 cities with sessions, top 5 locations with high latency and top 5 ISPs with high latency. [shared.zsdk.dashboards:global-insights-overview-panels] Uplink Health by Region compares Wi-Fi and cellular health from impacted devices per region, showing uplink type, Latency (P90 ms), top ISP, health and the Android/iOS device OS split; health is Good at or below 200 ms, Okay from 201 to 600 ms and Bad above 600 ms. [shared.zsdk.dashboards:global-insights-uplink-health]

The ISP Leaderboard lists the most impacted ISPs with regions affected, P90 latency, session share (the percentage of application sessions sending traffic through the ISP) and health. [shared.zsdk.dashboards:global-insights-isp-leaderboard] The Global Session Heatmap colours latency experience green (best), yellow (average) and red (worst), and the Network Path section shows Sankey visualizations of network paths between Zscaler and App Connectors. [shared.zsdk.dashboards:global-insights-heatmap-network-path]

## History

Release notes dated December 12, 2025 record that the Global Insights dashboard gained a Wi-Fi vs cellular comparison table and an ISP Leaderboard and lost the interactive Threat Detector map; notes dated February 13, 2026 record Sankey visualizations of network paths and renamed fields (Wi-Fi vs. Cellular Health by Region to Uplink Health by Region, Device Share to Session Share). [shared.zsdk.dashboards:dashboard-release-history] The dates of the Client Monitoring, Browser Access and Device Profile entries are not recorded here [gap:shared.zsdk.dashboards:release-note-dates], and retention and export are not stated [gap:shared.zsdk.dashboards:retention-and-export].

What to check:
1. Whether the Global Insights time range is within the previous three days.
2. Which network latency band a reading falls in on Uplink Health by Region: Good at or below 200 ms, Okay from 201 to 600 ms, Bad above 600 ms.

Not known (open gaps):
- Which release date the Client Monitoring, Browser Access and Device Profile release note entries belong to [gap:shared.zsdk.dashboards:release-note-dates]: settled by source-read
- Data retention and export for the Client Monitoring and Global Insights dashboards [gap:shared.zsdk.dashboards:retention-and-export]: settled by source-read or lab-test

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json
