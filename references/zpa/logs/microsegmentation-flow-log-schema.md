---
product: zpa
topic: "_data/logs/microsegmentation-flow-log-schema"
title: "ZPA LSS Microsegmentation Flow log — field reference"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: doc
sources:
  - "https://help.zscaler.com/zpa/understanding-microsegmentation-flow-log-fields"
author-status: draft
---

# ZPA LSS Microsegmentation Flow log — field reference

Microsegmentation Flow logs are emitted by LSS for network connections observed by the ZPA Microsegmentation agent running on workloads. Each record describes an aggregated set of connections sharing the same source/destination/protocol/port tuple — allowing compact reporting of repeated connection attempts within a collection window. The log captures identity context (agent, resource, AppZone), network flow details (source/destination IP, ports, protocol), application context (process path), and the microsegmentation policy decision (action and disposition). Unlike User Activity logs, which record ZPA application access by end users, Microsegmentation Flow logs record lateral movement and east-west traffic between resources participating in ZPA microsegmentation policy enforcement.

## Example log record

```json
{
  "LogTimestamp": "Fri Oct  8 14:22:00 2021",
  "Customer": "Acme Corp",
  "AgentID": "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
  "AgentName": "prod-web-01",
  "ResourceID": "f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1",
  "ResourceName": "prod-web-01",
  "AppZoneID": "c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4",
  "AppZoneName": "Production-Web-Tier",
  "ConnectionStartTime": "1633700500000000",
  "SourceIP": "10.20.1.50",
  "DestinationIP": "10.20.2.100",
  "SourcePorts": "54321",
  "DestinationPort": "5432",
  "Protocol": "6",
  "AppName": "psql",
  "AppExecutablePath": "/usr/bin/psql",
  "Direction": "OUTBOUND",
  "PolicyID": "pol-0123456789abcdef",
  "PolicyName": "Block-DB-from-Web-Tier",
  "EnforcementReason": "RULE",
  "EnforcementAction": "BLOCK",
  "EnforcementDisposition": "DROPPED"
}
```

## Field reference

| Field | Type | Description |
|---|---|---|
| `LogTimestamp` | string | Timestamp when the log was generated. Format specifiers: `s`, `j`. |
| `Customer` | string | The customer (tenant) name. Format specifiers: `s`, `j`. |
| `AgentID` | string | Microsegmentation agent identifier (192-bit string). Uniquely identifies the agent instance. Format specifiers: `s`, `j`. |
| `AgentName` | string | Human-readable name of the Microsegmentation agent. Format specifiers: `s`, `j`. |
| `ResourceID` | string | Resource ID associated with the agent generating this flow log (192-bit string). Format specifiers: `s`, `j`. |
| `ResourceName` | string | Resource name associated with the agent. Format specifiers: `s`, `j`. |
| `AppZoneID` | string | AppZone identifier the agent belongs to (192-bit string). Format specifiers: `s`, `j`. |
| `AppZoneName` | string | AppZone name the agent belongs to or is a member of. Format specifiers: `s`, `j`. |
| `ConnectionStartTime` | string | Timestamp when the earliest connection in this aggregated set was initiated. Format specifiers: `s`, `j`. |
| `SourceIP` | string | Source IP address used in the connection. Format specifiers: `s`, `j`. |
| `DestinationIP` | string | Destination IP address used in the connection. Format specifiers: `s`, `j`. |
| `SourcePorts` | number | Source port(s). When multiple connections with the same 4-tuple are aggregated, this contains a list of source ports. Format specifiers: `d`. |
| `DestinationPort` | number | Destination port used in the connection. Format specifiers: `d`. |
| `Protocol` | number | IP transport protocol number (e.g., `6` = TCP, `17` = UDP). Format specifiers: `d`. |
| `AppName` | string | Name of the application (process) generating the connection. Format specifiers: `s`, `j`. |
| `AppExecutablePath` | string | Filesystem path of the application executable generating the connection. Format specifiers: `s`, `j`. |
| `Direction` | string | Connection direction from the agent's perspective. Enum: `UNKNOWN`, `INBOUND`, `OUTBOUND`. Format specifiers: `s`, `j`. |
| `PolicyID` | string | ID of the microsegmentation policy evaluated for this flow. Format specifiers: `s`, `j`. |
| `PolicyName` | string | Name of the microsegmentation policy evaluated. Format specifiers: `s`, `j`. |
| `EnforcementReason` | string | Why enforcement was applied. Enum: `POLICY_DISABLED` (policy exists but is in monitor mode), `RULE` (a specific rule matched), `NO_POLICY_EXISTS` (no applicable policy found), `FORCED` (enforcement forced regardless of rules). Format specifiers: `s`, `j`. |
| `EnforcementAction` | string | Configured action of the matched rule. Enum: `ALLOW`, `BLOCK`, `SIMBLOCK` (block in simulation mode only). Format specifiers: `s`, `j`. |
| `EnforcementDisposition` | string | Actual outcome of policy enforcement. Enum: `UNKNOWN`, `CONNECTED` (allowed), `REJECTED` (TCP reset sent), `DROPPED` (silently dropped). Format specifiers: `s`, `j`. |

## Splunk SPL patterns

### `microseg-blocked-flows`

**Purpose:** Find blocked east-west flows by destination port and AppZone — identify which workloads are attempting disallowed lateral connections.

```spl
index=$INDEX_ZPA_MICROSEG EnforcementDisposition IN ("REJECTED","DROPPED") earliest=-1h
| stats
    count as blocked_attempts
    dc(SourceIP) as unique_sources
    values(AppExecutablePath) as processes
    by AppZoneName DestinationIP DestinationPort PolicyName
| sort -blocked_attempts
| rename blocked_attempts as "Blocked", unique_sources as "Unique Sources"
```

High counts for a specific `DestinationPort` from multiple sources within the same `AppZoneName` may indicate a lateral movement attempt, a misconfigured application, or a policy that is too restrictive.

### `microseg-simblock-candidates`

**Purpose:** Review `SIMBLOCK` flows — connections that would be blocked in enforcement mode but are currently only simulated. Use before flipping policy from simulation to enforce.

```spl
index=$INDEX_ZPA_MICROSEG EnforcementAction=SIMBLOCK earliest=-7d
| stats
    count as sim_blocked
    dc(SourceIP) as unique_sources
    dc(AgentName) as affected_agents
    by PolicyName DestinationPort AppName
| sort -sim_blocked
| rename sim_blocked as "Would-Be Blocks"
```

## Cross-links

- ZPA User Activity log schema (user application access; different log type) — [`./access-log-schema.md`](./access-log-schema.md)
- ZPA App Connector Status log schema (connector control-plane events) — [`./app-connector-status.md`](./app-connector-status.md)
- ZPA App Connector Metrics log schema (connector resource telemetry) — [`./app-connector-metrics.md`](./app-connector-metrics.md)
