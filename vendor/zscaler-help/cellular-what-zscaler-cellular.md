# What Is Zscaler Cellular?

**Source:** https://help.zscaler.com/zscaler-cellular/what-zscaler-cellular
**Captured:** 2026-04-28 via Playwright MCP

---

Zscaler Cellular is a comprehensive solution designed to provide secure, scalable, and efficient connectivity for IoT and mobile devices on a Zero Trust architecture. It includes two key products: **Zscaler SIM** and **Zscaler Cellular Edge**.

## How Does Zscaler SIM Work?

1. **Device Connection**: An IoT or mobile device equipped with Zscaler SIM connects to public 4G/5G networks.
2. **Traffic Forwarding**: Zscaler SIM routes cellular traffic to the nearest Zscaler Cellular Edge, which acts as the bridge between the telecom network and Zscaler. The Cellular Edge then forwards traffic to the ZTE, which inspects and enforces security policies.
3. **Policy Application**: Traffic is subjected to ZIA or ZPA policies based on predefined constructs (e.g., IP address, IMEI, and IMSI).
4. **Visibility and Control**: Administrators access centralized dashboards to monitor traffic, enforce policies, and generate reports.

## Key Features

- Near-Instant Deployment (streamlined provisioning, minimal telecom infrastructure changes)
- No Client-Side Software (no agents on endpoints)
- Granular Control (policy enforcement for SIM-connected devices)
- Full Traffic Visibility (SIM activity telemetry, anomaly detection)
- Eliminated Attack Surface (Zero Trust principles enforced)
- Improved Performance (optimized routing for reduced latency)

## Policy Constructs

Policy enforcement based on: IP address, IMEI (hardware identifier), or IMSI (SIM identifier).

## Use Cases by Industry

- Critical Infrastructure (railway systems, power grids, OT)
- Industrial IoT (telemetry for connected machinery and logistics equipment)
- Retail (POS systems, kiosks)
- Mobility (connected vehicles, EV chargers)
- Logistics/Transportation (telemetry data, connected cabins)

# Understanding the Zscaler Cellular Architecture

**Source:** https://help.zscaler.com/zscaler-cellular/understanding-zscaler-cellular-architecture
**Captured:** 2026-04-28 via Playwright MCP

---

## Key Architectural Components

### Zscaler SIM

A data-only SIM card that integrates directly with the ZTE, providing seamless security for IoT devices such as vending machines, EV chargers, machinery, and tablets/kiosks where agent-based solutions are not feasible.

- Secure Traffic Forwarding to ZTE for inspection, policy enforcement, and visibility
- Agentless Security — no software agents required
- Policy Enforcement via ZIA and ZPA based on IP address, IMEI, or IMSI
- Anomaly Detection using telemetry data

### Zscaler Cellular Edge

An intelligent mechanism to forward traffic from or to a Zscaler SIM to the ZTE. Acts as an egress point to funnel cellular traffic to the Zero Trust Exchange.

- Traffic Aggregation
- Bidirectional Traffic Control
- High Availability with failover infrastructure
- Telemetry Insights for detailed analytics

## Admin Portal

Administered via the Zscaler Cellular Admin Portal. Key admin capabilities: SIM management (view details, change status, change IMEI association, manage tags), eSIM assignment and activation, network events, anomaly detection, SIM location groups, geofence anomaly detection policies, cellular edge deployment and monitoring.
