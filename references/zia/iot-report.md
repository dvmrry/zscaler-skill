---
product: zia
topic: zia-iot-report
title: "ZIA IoT Report — device visibility, classification, policy"
content-type: reference
last-verified: "2026-06-15"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/about-iot-report.md"
  - "vendor/terraform-provider-zia/zia/resource_zia_location_management.go"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/location/locationmanagement/locationmanagement.go"
  - "vendor/zscaler-help/adding-rules-cloud-app-control-policy.md"
  - "vendor/zscaler-help/configuring-dynamic-location-groups.md"
  - "vendor/terraform-provider-zia/zia/resource_zia_firewall_dns_rules.go"
  - "vendor/zscaler-sdk-python/tests/integration/zia/test_iot_report.py"
  - "vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md"
  - "vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md"
  - "vendor/zscaler-help/automate-zscaler/guides-analytics-api.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/iot_report.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/iotreport.py"
  - "vendor/zscaler-sdk-python/zscaler/zins/iot.py"
  - "vendor/zscaler-sdk-python/zscaler/zins/models/inputs.py"
  - "vendor/zscaler-sdk-go/zscaler/zia/services/iotreport/iotreport.go"
  - "vendor/zscaler-mcp-server/zscaler_mcp/tools/zins/iot.py"
author-status: draft
---

# ZIA IoT Report — device visibility, classification, policy

Source: `vendor/zscaler-help/about-iot-report.md`; `vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md`; `vendor/zscaler-sdk-python/zscaler/zia/iot_report.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/iotreport/iotreport.go`.

The IoT Report is ZIA's passive device-discovery surface. It does not require agents or DHCP integration. It observes unauthenticated traffic flowing through Zscaler and uses an AI/ML fingerprinting engine to classify each source device into a three-level taxonomy (type → category → classification). The report is read-only from a policy perspective — no ZIA enforcement rule natively consumes IoT classification as a criteria object — but the output can drive adjacent controls indirectly through location type, location group, and Cloud App Control pre-built rules.

---

## 1. Overview

Source: `vendor/zscaler-help/about-iot-report.md`.

### What the report covers

The IoT Report shows the **device inventory discovered from unauthenticated web traffic**. The AI/ML engine evaluates every unauthenticated flow and assigns the source IP to one of four device types:

| Device type | Meaning |
|---|---|
| **IoT Devices** | Devices identified as internet-of-things endpoints (cameras, printers, building systems, smart-TVs, etc.) |
| **User Devices (Unmanaged)** | Laptops / phones whose traffic does not flow via Zscaler Client Connector |
| **Servers** | Server-class hosts |
| **Unknown** | Insufficient signal for the AI/ML engine to classify |

The report refreshes every **6 hours**. Data reflects devices active in the **last 24 hours**.

### Where the data comes from

What Zscaler documents: classification is derived from **unauthenticated web traffic**, and "Zscaler's AI/ML engine classifies all unauthenticated devices automatically" (`vendor/zscaler-help/about-iot-report.md:8`). The report covers devices "discovered from unauthenticated web traffic" (`about-iot-report.md:8`). The specific input signals the engine consumes are **not stated in any cited Zscaler source** — the help doc names none of them. Visibility is bounded by what the help doc implies: only traffic that reaches Zscaler is observed, since the report is built from web-traffic discovery rather than a network sensor or endpoint agent.

The particular fingerprinting mechanics one would expect from a device-inference engine (HTTP User-Agent parsing, DHCP option fingerprinting, DNS-query signatures, TLS client-hello / JA3 correlation, traffic-behavior weighting) are general-networking inference, **not Zscaler-stated fact**. They are recorded as inferred-not-sourced in the [Open questions register](#6-open-questions-register) rather than presented here as documented behavior.

### Prerequisite: location must have IoT enabled

The report only shows data for locations where IoT discovery is explicitly enabled on the Location Management page (`vendor/zscaler-help/about-iot-report.md:22`). Newly enabled locations take **24 hours** to produce their first report, and adding or removing locations from the filter can take **up to 24 hours** to reflect in the UI filter list (`about-iot-report.md:22`).

The location schema exposes **two** distinct per-location IoT toggles, not one:

| Flag (TF) | Go SDK field / JSON | Type | Documented meaning |
|---|---|---|---|
| `iot_discovery_enabled` | `IOTDiscoveryEnabled` / `iotDiscoveryEnabled` | bool (Optional+Computed) | "Enable IOT Discovery at the location" — this is the toggle the help doc's "ensure IoT is enabled for that location" refers to (`vendor/terraform-provider-zia/zia/resource_zia_location_management.go:257-261`; `vendor/zscaler-sdk-go/zscaler/zia/services/location/locationmanagement/locationmanagement.go:90-91`) |
| `iot_enforce_policy_set` | `IOTEnforcePolicySet` / `iotEnforcePolicySet` | bool (Optional+Computed) | Description is **empty** in both the TF schema and the Go model — its precise meaning is not source-stated (`resource_zia_location_management.go:263-267`; `locationmanagement.go:93`) |

The two flags are read and written independently in the provider (`resource_zia_location_management.go:537-538`, `:729-730`). The distinction between "discover IoT devices here" and "enforce the IoT policy set here" bears directly on what the report's policy-status widget reflects — see [open question #6](#6-open-questions-register).

---

## 2. Device categorization

Source: `vendor/zscaler-help/about-iot-report.md`; `vendor/zscaler-sdk-python/zscaler/zia/models/iotreport.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/iotreport/iotreport.go`.

### Three-level taxonomy

Zscaler uses a UUID-based taxonomy with three levels. Each level is a strict parent-child tree:

```
Device Type   (top)   — broadest bucket (IoT, User Device, Server, Unknown)
  └─ Category         — device family (e.g., "Camera", "Printer", "Smart TV")
       └─ Classification  — specific make/model or function label
```

Every discovered device carries:
- `deviceTypeUuid` — UUID of the type
- `categoryUuid` — UUID of the category (parent: type)
- `classificationUuid` — UUID of the classification (parent: category)
- `autoLabel` — human-readable label generated by the AI/ML engine describing the device's prominent characteristics

The UUID-to-name mappings are served by three dedicated read-only REST endpoints (see section 4).

### Fingerprinting signals

**Mechanism not documented by Zscaler.** The only sourced statement is that "Zscaler's AI/ML engine classifies all unauthenticated devices automatically" (`vendor/zscaler-help/about-iot-report.md:8`); the help doc names no input signals. The specific signal mechanics (HTTP User-Agent strings, DHCP option 55/60 fingerprinting, DNS-query signatures, TLS/JA3 client-hello correlation, traffic-behavior weighting) are general fingerprinting-engine inference, **not vendor fact**, and are not present in any cited source. They are tracked as inferred-not-sourced in [open question #5](#6-open-questions-register).

What is sourced: devices the engine cannot classify "due to limited information for the AI/ML engine" land in **Unknown** (`about-iot-report.md:31`).

### Flow observation window

Each device record carries `flowStartTime` and `flowEndTime` in epoch seconds, marking the window of weblog records the AI/ML engine evaluated. This is not a persistent device registry — a device disappears from the active view if it generates no traffic for 24 hours.

---

## 3. Reporting surface

Source: `vendor/zscaler-help/about-iot-report.md`; `vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md`; `vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md`; `vendor/zscaler-help/automate-zscaler/guides-analytics-api.md`; `vendor/zscaler-sdk-python/zscaler/zia/iot_report.py`; `vendor/zscaler-sdk-python/zscaler/zins/iot.py`; `vendor/zscaler-sdk-go/zscaler/zia/services/iotreport/iotreport.go`.

### Console navigation

```
Analytics
  └─ (toggle: Switch to Existing Reports)
       └─ Internet & SaaS > Analytics > IoT Report
```

The IoT Report page presents:

- **IoT Device Classification** — top classifications with device counts; click a classification to drill into Discovered Devices.
- **IoT Device Distribution by Policy Status** — bar chart showing total discovered, those with IoT policies applied, and those with no policies (`vendor/zscaler-help/about-iot-report.md:26`). The help doc does not define what "policy applied" maps to; see [open question #6](#6-open-questions-register) for the `iot_enforce_policy_set` location-flag hypothesis.
- **Device Type Distribution** — pie chart across all four device types (IoT, User Devices, Servers, Unknown).
- **Top User Device Classification** — similar breakdown for unmanaged-user device types.
- **Devices Location** — geographic map of device counts by city; hovering shows city name, state, country, and device count.

The page can be exported to PDF. The location filter is limited to locations with IoT discovery enabled.

Up to 12 classifications appear directly; a carousel allows scrolling for larger inventories.

### API / SDK retrieval — ZIA REST (IoT Discovery)

Four read-only REST endpoints under `/zia/api/v1/iotDiscovery`:

| Endpoint | Description | Returns |
|---|---|---|
| `GET /iotDiscovery/deviceTypes` | UUID-to-name map for all supported device types | `{ uuid, name, parent_uuid }` per type |
| `GET /iotDiscovery/categories` | UUID-to-name map for all device categories | `{ uuid, name, parent_uuid }` per category |
| `GET /iotDiscovery/classifications` | UUID-to-name map for all device classifications | `{ uuid, name, parent_uuid }` per classification |
| `GET /iotDiscovery/deviceList` | Full discovered device inventory | `{ cloudName, customerId, devices[] }` |

The `deviceList` response contains one object per discovered device with the fields:

| Field | Type | Meaning |
|---|---|---|
| `locationId` | string | ZIA location where device was seen |
| `deviceUuid` | string | Zscaler-assigned device UUID |
| `ipAddress` | string | Source IP address |
| `deviceTypeUuid` | string | Ref to `/deviceTypes` |
| `autoLabel` | string | AI/ML generated descriptor |
| `classificationUuid` | string | Ref to `/classifications` |
| `categoryUuid` | string | Ref to `/categories` |
| `flowStartTime` | int (epoch s) | Start of evaluation window |
| `flowEndTime` | int (epoch s) | End of evaluation window |

The exact endpoint paths are hardcoded in the SDK service layer: `/zia/api/v1/iotDiscovery/deviceTypes`, `/categories`, `/classifications`, and `/deviceList` (`vendor/zscaler-sdk-go/zscaler/zia/services/iotreport/iotreport.go:10-13`; `vendor/zscaler-sdk-python/zscaler/zia/iot_report.py:28,55-56,97-98,139-140,180-181`). They are **not** listed in the cited OneAPI endpoint catalog — the catalog's ZIA section is truncated (`vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md:344`) and `IoT` appears there only as a GraphQL analytics domain (`api-endpoint-catalog.md:432`), not as REST `/iotDiscovery/*` paths.

**Python SDK** (`client.zia.iot_report`):

```python
# Get all device UUIDs and their type names
device_types, response, err = client.zia.iot_report.get_device_types()

# Get category taxonomy
categories, response, err = client.zia.iot_report.get_categories()

# Get classification taxonomy
classifications, response, err = client.zia.iot_report.get_classifications()

# Get the full device list
devices, response, err = client.zia.iot_report.get_device_list()
if err is None:
    for device in devices["devices"]:
        print(device["ipAddress"], device["autoLabel"])
```

**Go SDK** (`iotreport` package):

```go
import "github.com/zscaler/zscaler-sdk-go/v3/zscaler/zia/services/iotreport"

deviceTypes, err := iotreport.GetDeviceTypes(ctx, service)
categories, err  := iotreport.GetIOTCategories(ctx, service)
classifs, err    := iotreport.GetIOTClassifications(ctx, service)
deviceList, err  := iotreport.GetIOTDeviceList(ctx, service)
```

Note: the `CommonIOTReport` struct returned by the taxonomy endpoints carries `UUID`, `Name`, and `ParentUuid`. All four functions are read-only; there are no create/update/delete operations for IoT data.

**Terraform provider:** No Terraform resource or data source exists for IoT Report. It is read-only analytics data; Terraform manages configuration, not telemetry.

### API / SDK retrieval — Z-Insights GraphQL (analytics aggregate)

The Z-Insights GraphQL API (`POST https://api.zsapi.net/zins/graphql`) exposes an `IOT` domain with one query: `device_stats`. This returns aggregate counts and a per-classification breakdown. Unlike the REST `deviceList`, it does not return per-device IP-level records — it returns statistical summaries.

**Schema fields returned by `device_stats`:**

| Field | Meaning |
|---|---|
| `devices_count` | Total devices observed |
| `iot_devices_count` | Subset classified as IoT |
| `user_devices_count` | Unmanaged user devices |
| `server_devices_count` | Servers |
| `un_classified_devices_count` | Unknown / insufficient signal |
| `entries[]` | Per-classification breakdown (see below) |

Each entry in `entries[]` carries:
- `classifications` — classification name string
- `classification_uuid` — UUID
- `category` — parent category name
- `total` — device count for this classification

**GraphQL query (minimal)**:

```graphql
query IoTDeviceStats($limit: Int, $filter_by: IoTDeviceFilterBy, $order_by: [IoTDeviceOrderBy]) {
    IOT {
        device_stats {
            devices_count
            iot_devices_count
            user_devices_count
            server_devices_count
            un_classified_devices_count
            entries(limit: $limit, filter_by: $filter_by, order_by: $order_by) {
                classifications
                classification_uuid
                category
                total
            }
        }
    }
}
```

The `filter_by` input (`IoTDeviceFilterBy`) supports filtering entries by `classifications` (name), `classification_uuid`, and `category`, each accepting a `StringFilter` (`eq`, `ne`, `in`, `nin`). The `order_by` input (`IoTDeviceOrderBy`) supports sorting by `classifications`, `classification_uuid`, `category`, or `total`.

Unlike the other Z-Insights domains, the `IOT` domain query does **not** require `start_time` / `end_time` variables — device stats reflect current state, not a time-windowed log slice.

**Python SDK** (`client.zins.iot`):

```python
from zscaler.zins.models.inputs import IoTDeviceFilterBy, StringFilter

# All stats
stats, response, err = client.zins.iot.get_device_stats(limit=50)

# Filter to Camera category only
filter_by = IoTDeviceFilterBy(category=StringFilter(eq="Camera"))
stats, response, err = client.zins.iot.get_device_stats(limit=20, filter_by=filter_by)

if err is None:
    print(f"Total: {stats['devices_count']}, IoT: {stats['iot_devices_count']}")
    for entry in stats.get("entries", []):
        print(f"  {entry['category']} / {entry['classifications']}: {entry['total']}")
```

**MCP tool** (Zscaler MCP Server, Z-Insights service):

```text
zins_get_iot_device_stats(limit=100)
```

Returns counts and classification entries. Requires the `zins` service to be enabled; requires OneAPI credentials with the `Zscaler Insights Reader` role.

---

## 4. Policy interaction

Source: `vendor/zscaler-help/about-iot-report.md`; `vendor/zscaler-help/adding-rules-cloud-app-control-policy.md`; `vendor/zscaler-help/configuring-dynamic-location-groups.md`; `vendor/terraform-provider-zia/zia/resource_zia_firewall_dns_rules.go`.

### What IoT classification cannot do (directly)

IoT classification UUIDs and auto-labels from the IoT Report are **not available as matching criteria** in any ZIA policy rule type. You cannot write a Firewall Filtering rule that says "if device is IoT / classificationUuid = X, then block." The IoT Report is observation-only; its output does not propagate into the rule evaluation engine as a first-class criterion.

This is the most important thing to understand about this feature: it is a visibility and inventory tool, not a dynamic policy segmentation mechanism.

### What you can do: location type as an IoT proxy

When configuring a ZIA location, you set a **Location Type**. One of the supported types is **IoT traffic**. Locations typed as IoT traffic are automatically assigned to the predefined **IoT Traffic Group** dynamic location group.

This means you can write policy rules scoped to the IoT Traffic Group location group. Any rule that accepts a Location / Location Group criterion (Firewall Filtering, URL Filtering, SSL Inspection, Bandwidth Control, Cloud App Control) can target the IoT Traffic Group. This is the correct enforcement pattern when IoT devices share a dedicated subnet or VLAN that is forwarded via a GRE/IPSec location typed as "IoT traffic."

Limitations:
- This is a static grouping based on network topology, not device classification. A managed laptop on the IoT subnet gets the same policy as a camera on that subnet.
- A single location can only have one type. Mixed populations (IoT + corporate users) on the same location require sublocations or separate locations.
- The IoT Traffic Group is predefined and view-only; you cannot create custom dynamic groups based on IoT classification criteria.

### Cloud App Control: IoT classification rules

Cloud App Control (CAC) is the one place where IoT classification directly appears in ZIA policy — as a set of **predefined rules** that Zscaler ships with every tenant.

Zscaler provides **"Allow Unauthenticated Traffic for IoT Classifications"** predefined rules for each cloud application category. These rules are:
- Disabled by default
- Cannot be deleted
- Editable only for: Rule Order, Rule Status, Rule Label, and Description
- Designed to **temporarily allow unauthenticated traffic** so the AI/ML engine can accumulate enough signal to classify devices

In other words, CAC ships with IoT exception rules that you opt into — not rules that react to IoT classification to enforce different behavior. The direction of causation is: allow traffic first → enable classification → then act on the Discovered Devices data out-of-band.

### Firewall rules

ZIA Firewall Filtering rules have no IoT-specific criteria. You can scope rules to:
- Location / Location Group (use IoT Traffic Group as a proxy)
- Source IP address / IP groups (if IoT devices have known, static IPs)
- Network service (port/protocol) — useful for blocking IoT protocols (MQTT port 1883, CoAP port 5683) coming from non-IoT locations

There is no integration between the IoT Report's device classification data and Firewall rule evaluation.

### URL Filtering

Same situation as Firewall. URL Filtering rules can be scoped to the IoT Traffic Group location group but cannot reference device classification directly.

### Summary of policy capabilities

| Control surface | IoT classification as criteria | IoT Traffic Group (location) as criteria | Notes |
|---|---|---|---|
| Firewall Filtering | No | Yes | Most practical enforcement path for dedicated IoT VLANs |
| URL Filtering | No | Yes | Can block specific categories for IoT network segments |
| Cloud App Control | Indirect (predefined allow rules) | Yes | Predefined IoT rules enable classification bootstrap |
| SSL Inspection | No | Yes | Can bypass SSL inspection for IoT segments (many devices reject interception) |
| Bandwidth Control | No | Yes | Can rate-limit IoT location groups |
| DNS Control | No | Yes | DNS filtering rules accept a `location_groups` criterion (`vendor/terraform-provider-zia/zia/resource_zia_firewall_dns_rules.go:195`) |
| DLP | No | Yes | Can apply data-in-motion DLP to IoT segment traffic |

---

## 5. Common gotchas

Source: `vendor/zscaler-help/about-iot-report.md`; `vendor/zscaler-help/adding-rules-cloud-app-control-policy.md`; `vendor/zscaler-help/configuring-dynamic-location-groups.md`; `vendor/zscaler-sdk-python/zscaler/zins/iot.py`; `vendor/zscaler-sdk-python/tests/integration/zia/test_iot_report.py`; `vendor/zscaler-help/automate-zscaler/guides-analytics-api.md`.

### Classification accuracy degrades without sufficient traffic

The AI/ML engine needs enough weblog records in the observation window to form a confident classification. Devices that generate very little HTTP/HTTPS traffic (e.g., a temperature sensor that calls home once per hour) may remain Unknown or get a low-confidence classification. The 24-hour active-device window means sporadic devices appear and disappear.

### Proxy-mode deployments may carry less signal (inference, not sourced)

Inference, not vendor-stated: if the engine relies on layer-2/3 signals such as DHCP frames (which is itself unconfirmed — see [open question #5](#6-open-questions-register)), then a PAC-file proxy deployment, where the client is explicitly proxied and those frames are neither tunneled nor visible to Zscaler, would lose them, whereas GRE/IPSec tunnel forwarding would preserve inner-traffic visibility. Because Zscaler does not document the input signals at all, treat this as a plausible operational expectation rather than confirmed behavior. The one sourced fact is that the report is built from unauthenticated **web** traffic reaching Zscaler (`vendor/zscaler-help/about-iot-report.md:8`).

### Mobile devices misclassified as IoT

Smartphones running OS versions with non-standard User-Agents (custom firmware, privacy browsers, enterprise MDM configurations that modify UA strings) can be misclassified as IoT devices, especially if the device also generates traffic patterns similar to embedded hardware. The Device Type Distribution chart distinguishes "User Devices (Unmanaged)" from "IoT Devices," but the boundary is probabilistic.

### BYOD laptops on shared locations appear in IoT report

Any unauthenticated traffic — including BYOD laptops that bypass ZCC — appears in the IoT report data set. The engine classifies these as User Devices (Unmanaged), not IoT Devices, but they still populate the discovered-device inventory. If the organization has significant unmanaged-laptop population, the "Unknown" and "User Device" counts can be large and noisy relative to actual IoT device counts.

### "Devices with no policies" is not a reliable security signal on its own

The IoT Device Distribution by Policy Status widget shows devices with and without policies applied (`vendor/zscaler-help/about-iot-report.md:26`). Whatever "no policy" maps to internally (see [open question #6](#6-open-questions-register)), it does **not** mean the device is unrestricted — the device may still be governed by catch-all Firewall or URL Filtering rules. Do not interpret "no policy" as "no protection."

### IoT discovery must be enabled per-location

The feature is not on by default globally. Each location must have IoT enabled in Location Management. Forgetting this is the most common reason a newly deployed location fails to appear in the IoT Report filter. Allow 24 hours after enabling before expecting data.

### API permission restriction

The SDK integration test for all four IoT Report REST calls explicitly comments "may fail due to permission restrictions" (`vendor/zscaler-sdk-python/tests/integration/zia/test_iot_report.py:39,45,50,55`), and the test is written to swallow a non-nil error rather than fail. This is a strong signal that the `/iotDiscovery/*` endpoints are gated behind an entitlement or role not present in a baseline ZIA credential. If API calls return a permission error, verify the tenant has the IoT Report feature enabled and the API credential has sufficient role. For the Z-Insights GraphQL (Analytics API) path, ZIdentity provides a default **Zscaler Insights Reader** role (`vendor/zscaler-help/automate-zscaler/guides-analytics-api.md:27`). The exact role/entitlement required for the ZIA REST `/iotDiscovery/*` path is **not stated in any cited source** — see [open question #7](#6-open-questions-register).

---

## 6. Open questions register

Source: `vendor/zscaler-help/about-iot-report.md`; `vendor/zscaler-help/automate-zscaler/api-endpoint-catalog.md`; `vendor/zscaler-help/automate-zscaler/analytics-graphql-api.md`; `vendor/zscaler-sdk-python/zscaler/zia/iot_report.py`; `vendor/zscaler-sdk-python/zscaler/zins/iot.py`.

1. **Classification taxonomy versioning.** The UUID-to-name mappings from `/iotDiscovery/deviceTypes`, `/categories`, and `/classifications` are returned dynamically. It is unclear whether UUIDs are stable across Zscaler ML model updates or whether stored UUIDs can silently become stale. If UUIDs change, any downstream automation that stores them will break silently.

2. **Per-device historical records.** The `deviceList` endpoint returns a snapshot of currently-active devices (last 24 hours). It is unclear whether Zscaler retains historical device-to-classification records beyond the 24-hour window, or whether NSS/log export is the only way to build a longer-term device inventory.

3. **NSS log schema for IoT fields.** It is not confirmed whether NSS web logs or firewall logs carry IoT classification fields (e.g., `autoLabel`, `deviceTypeUuid`) for individual transactions. If they do, SIEM-based workflows could correlate per-transaction logs to classification. This needs verification against the full NSS output format documentation (the `nss-dns-logs.csv` schema in vendor docs does not include IoT fields).

4. **Dynamic policy integration roadmap.** The current gap — classification is available in the report but not as a first-class rule criterion — appears to be a product limitation, not a configuration gap. It is unknown whether Zscaler plans to expose IoT classification as a criteria type in Firewall Filtering or a new IoT Policy engine (similar to how ZIA has a standalone Cloud App Control policy for app-level classification). The predefined CAC rules suggest this is directionally intended but not fully realized.

5. **Which input signals the AI/ML engine actually consumes (inferred, not sourced).** Zscaler documents only that the engine "classifies all unauthenticated devices automatically" from unauthenticated web traffic (`vendor/zscaler-help/about-iot-report.md:8`); it names **no** input signals. The following are general fingerprinting-engine inference, recorded here because they shape operational expectations but are **not confirmed by any cited source**: HTTP User-Agent strings (e.g. manufacturer tokens like `Axis/`, `HP LaserJet`); DHCP option 55 (parameter request list) and option 60 (vendor class identifier); DNS-query signatures against vendor/update endpoints; traffic-behavior features (port usage, request cadence, payload-size distribution) used as tie-breakers; and TLS client-hello / JA3(S) fingerprints correlated to device OS and version. The extent to which any of these — particularly TLS/JA3 for encrypted traffic without decryption — is used is undocumented. For IoT devices that use non-HTTP protocols or pinned certificates that prevent SSL inspection, whatever signal the engine relies on may degrade significantly. Verifying this against Zscaler documentation is an open item.

6. **What "IoT policy applied" means in the IoT Device Distribution by Policy Status widget.** The widget reports devices with policies applied vs. no policies (`vendor/zscaler-help/about-iot-report.md:26`), but the help doc never defines what constitutes an "IoT policy." Candidate definitions: the predefined CAC IoT rules, any rule targeting an IoT Traffic Group location, or something else. A concrete, source-backed lead narrows this: the location schema carries a distinct per-location boolean `iot_enforce_policy_set` / `IOTEnforcePolicySet` separate from `iot_discovery_enabled` (`vendor/terraform-provider-zia/zia/resource_zia_location_management.go:263` — Optional+Computed bool; `vendor/zscaler-sdk-go/zscaler/zia/services/location/locationmanagement/locationmanagement.go:93`). Its name maps almost exactly onto the widget's distinction: "enforce the IoT policy *set*" at a location is plausibly what flips a device's status from "no policy" to "policy applied." Testable hypothesis: the widget's "policy applied" status reflects `iot_enforce_policy_set` at the location level, not (only) whether predefined CAC IoT rules exist. Caveat: the flag's description is **empty** in both the TF schema and the Go model, so its precise meaning is not source-stated — the hypothesis needs confirmation against tenant behavior or fuller documentation. The existence of two separate location flags is itself hard evidence that the original framing conflated two real configuration signals.

7. **Role/entitlement required for the ZIA REST `/iotDiscovery/*` path.** The SDK integration test wraps all four IoT Report REST calls with "may fail due to permission restrictions" and is written to tolerate a non-nil error (`vendor/zscaler-sdk-python/tests/integration/zia/test_iot_report.py:39,45,50,55`), which indicates the endpoints are gated by an entitlement or role beyond a baseline ZIA credential. No cited source names that role or entitlement. The `Zscaler Insights Reader` role is documented for the separate Analytics/GraphQL (Z-Insights) path (`vendor/zscaler-help/automate-zscaler/guides-analytics-api.md:27`), not the ZIA REST path. Verifying which role unlocks the REST endpoints is an open item.
