---
product: shared
topic: "nss-architecture"
title: "Nanolog Streaming Service (NSS) architecture"
content-type: reasoning
last-verified: "2026-04-24"
confidence: high
source-tier: doc
sources:
  - "vendor/zscaler-help/understanding-nanolog-streaming-service.md"
  - "vendor/zscaler-help/General_Guidelines_for_NSS_Feeds_and_Feed_Formats.pdf"
  - "vendor/zscaler-help/nss-web-logs.csv"
  - "vendor/zscaler-help/nss-firewall-logs.csv"
  - "vendor/zscaler-help/nss-dns-logs.csv"
  - "vendor/zscaler-help/about-nss-feeds.md"
  - "vendor/zscaler-help/about-nss-servers.md"
author-status: draft
last-verified: "2026-04-28"
---

# Nanolog Streaming Service (NSS) architecture

NSS is the **log-egress layer** that carries Zscaler's per-event data to customer SIEMs. Every Web / Firewall / DNS / ZPA LSS log schema documented elsewhere in this skill is *what* NSS emits — this doc covers *how* it emits, *where* it runs, and *what breaks when* connectivity lapses.

## The architectural split

Logs never leave Zscaler's cloud except via NSS. Four moving parts:

```
PSE / App Connector / ZCC    (log generators)
         ↓
     Nanolog                 (Zscaler's central log store; retains originals)
         ↓
  [NSS: VM-based or Cloud]   (streams copies; decompress, filter, format)
         ↓
     Customer SIEM
```

Key invariant: **the Nanolog retains the authoritative originals**. NSS streams **copies**. If an NSS / SIEM is misconfigured or loses connectivity, the Nanolog still has the data — it's the replay buffer (bounded, see below), not the source of truth.

## Two NSS delivery modes

### VM-based NSS

A VM deployed **inside the customer's network**, streaming over a raw TCP connection to an on-prem SIEM receiver.

- Each NSS opens a secure tunnel to the Nanolog.
- Nanolog streams compressed tokenized log records to the NSS.
- NSS decompresses, detokenizes, applies filters, converts to the configured output format, streams to SIEM over raw TCP.
- **Buffers logs in VM memory** for SIEM-side resiliency.

**Subscriptions:**

- **NSS for Web** — web + mobile traffic logs.
- **NSS for Firewall** — firewall logs (incl. DNS and IPS log entries that flow through the firewall module).

### Cloud NSS

An **HTTPS API feed pushed from the Zscaler cloud** directly to a cloud-based SIEM ingestion endpoint (e.g., Splunk HEC, Azure Sentinel HTTPS collector).

- No on-prem VM.
- Customizable HTTPS outbound connector — interoperates with any SIEM exposing a publicly routable HTTPS log-ingestion API with a stateless API contract.
- Format customizable; **Zscaler recommends JSON**.

**Subscriptions:**

- **Cloud NSS for Web**
- **Cloud NSS for Firewall**

Cloud NSS requires a **separate concurrent subscription** from VM-based NSS — not an alternative delivery mode on the same subscription.

## The NSS feed pipeline

For every log record, an NSS performs the same five-step pipeline:

```
Nanolog (tokenized, compressed)
    ↓ decompress
    ↓ detokenize
    ↓ apply filters (exclude unwanted logs)
    ↓ convert to output format (CSV / TSV / JSON / custom)
SIEM
```

**Filtering happens at the NSS**, not the Nanolog. The Nanolog sends a full stream; NSS drops records that don't match filter criteria. Implication: "can NSS pre-filter to save SIEM ingest cost?" → yes, filters are cheap because they run at NSS post-detokenization before format conversion.

**Format conversion** uses feed-format templates (CSV field lists documented in `vendor/zscaler-help/nss-*.csv`, JSON equivalents in *General Guidelines for NSS Feeds and Feed Formats* PDF).

## Reliability + replay

### VM-based NSS → SIEM connection

- **VM memory buffer** — if SIEM is unreachable, NSS buffers locally and replays per the **Duplicate Logs** setting (how aggressively to retry).
- Buffer is bounded by VM memory. Long outages overflow → drop.

### Nanolog → NSS connection (both modes)

- If connectivity between Zscaler cloud and NSS lapses, the NSS misses logs that arrive at the Nanolog during the interruption.
- **One-hour recovery window** — separate Zscaler capability (requires Support ticket to enable) that lets the Nanolog replay logs up to one hour back after connectivity restores.
- **Longer outages = permanent gap** in the SIEM stream. The Nanolog still has the originals; operators must query them separately if needed.

Cloud NSS follows the same one-hour-recovery model — a separate capability for Cloud NSS, also gated by a Support ticket.

## Feed-count limits

| Mode | Per-instance limit |
|---|---|
| VM-based NSS | **16 feeds per NSS server**, split 8 Web + 8 Firewall max |
| Cloud NSS | **1 feed per ZIA log type per Cloud NSS instance** |

The Cloud NSS "1 feed per log type per instance" limit is the practical constraint on multi-SIEM fan-out. Tenants sending the same Web logs to two SIEMs need either two Cloud NSS instances, or a single feed plus a SIEM-side fan-out component.

## NSS Collector (different product, same NSS family)

**NSS Collector is NOT a log-export component** — it's the inverse. Collects logs **from** third-party vendor firewalls and web proxies **into** the Zscaler cloud. Exclusive to **Shadow IT Report**.

| Attribute | Value |
|---|---|
| Deployment | VMware VM on-prem |
| Input format | CEF over TCP syslog |
| User resolution | Via IdP integration; unmanaged users → "Unidentified Users" |
| URL resolution | For cloud-app discovery |
| Transport to Zscaler | HTTPS |
| **Local buffer** | One hour |
| **Older-than-one-hour records** | Dropped (no historical backload) |
| **Rate limit** | 10K events/second — excess dropped |
| Max Collectors per org | 4 |
| Zscaler-side retention | 6 months |

Operators asking about NSS usually mean the export direction; NSS Collector is a separate SKU for the ingestion direction.

## Comparison matrix

| | VM-based NSS | Cloud NSS |
|---|---|---|
| Deployment overhead | VM in customer network | None (Zscaler-hosted) |
| Transport to SIEM | Raw TCP | HTTPS POST |
| On-prem buffer | VM memory | N/A (connection failures = data gap) |
| Nanolog replay on connectivity loss | 1-hour recovery (opt-in) | 1-hour recovery (opt-in) |
| Feed-count limit | 16 per NSS / 8 per type | 1 per log type per instance |
| Format options | Customizable | Customizable; JSON recommended |
| Subscription | Separate from Cloud NSS | Separate from VM-based |
| Monitoring | Customer-operated | CloudOps 24/7 |

---

## NSS feeds — configuration objects

An NSS feed is the configuration object that specifies **which data** from the Nanolog stream is sent to a SIEM, and in what format. Feeds are attached to NSS servers (VM-based) or are Cloud NSS feeds (Zscaler-hosted).

### Feed types

| Feed type | Log content | Available on |
|---|---|---|
| **Web feed** | HTTP/HTTPS transactions (web proxy logs) | VM-based NSS, Cloud NSS |
| **Firewall feed** | Firewall session logs, IPS events, NAT events | VM-based NSS, Cloud NSS |
| **DNS feed** | DNS query/response logs | VM-based NSS (via Firewall subscription) |
| **Tunnel feed** | GRE/IPSec tunnel events | VM-based NSS (via Firewall subscription) |
| **MCAS feed** | Microsoft Cloud App Security integration feed | VM-based NSS |
| **Real-time alert feed** | Alerts for NSS connectivity monitoring | VM-based NSS |

DNS and tunnel logs flow through the Firewall NSS subscription on VM-based NSS. The Cloud NSS "Firewall" subscription covers all firewall-module records including DNS (Tier A — vendor/zscaler-help/about-nss-feeds.md).

### Feed configuration objects

Each NSS feed configures (Tier A — vendor/zscaler-help/about-nss-feeds.md):

| Component | Description |
|---|---|
| **Feed Name** | Identifier for the feed in the admin console |
| **NSS Server** | Which NSS VM instance this feed is attached to (VM-based only) |
| **Status** | Enabled / Disabled |
| **Log Filter** | Which log type (Web, Firewall, etc.) and filter criteria (by user, department, location, client, threat category, etc.) |
| **Feed Output Format** | The template for how records are formatted — CSV field list, TSV, JSON, or custom string with field placeholders |
| **Duplicate Logs** | How aggressively to retry sending logs to SIEM on connection failure (VM-based only) |
| **Time Zone** | Timestamp zone for emitted records |

### Filter criteria per feed

Filters run at the NSS after detokenization, before format conversion. Filtered-out records are never sent to the SIEM — they are dropped permanently from that feed's stream. Filters do not affect the Nanolog original.

Per-feed filter caps (from Ranges & Limitations):

- Users, Departments, Locations, Clients, Threat Names: **1,024 entries each**

Filter criteria are additive per field (OR within a field; AND across fields). A feed filtering on "Location = HQ AND Threat = Malware" emits records that match both conditions.

### Feed output formats

ZIA NSS supports the following output format types:

| Format | Notes |
|---|---|
| **CSV** | Comma-separated field list; configurable field order; standard for on-prem SIEM |
| **TSV** | Tab-separated variant |
| **JSON** | Recommended for Cloud NSS; preserves type information; easier CIM mapping |
| **Custom** | Arbitrary string template with `%field_name%` or `{field_name}` placeholders |

The specific output fields available per log type are documented in the feed format guide (`vendor/zscaler-help/General_Guidelines_for_NSS_Feeds_and_Feed_Formats.pdf`) and in the vendored CSV schemas (`nss-web-logs.csv`, `nss-firewall-logs.csv`, `nss-dns-logs.csv`).

### NSS servers — portal representation

An NSS server in the ZIA Admin Console is the configuration record for a deployed NSS VM. After creating the record, Zscaler issues a client TLS certificate and private key for installation on the NSS VM; the certificate authenticates the VM to the Nanolog stream (Tier A — vendor/zscaler-help/about-nss-servers.md).

Navigation: **Administration > Nanolog Streaming Service** (NSS Servers page)

Per-server operations:
- Add an NSS server record
- Deploy an NSS virtual appliance (link to deployment guide)
- Download MIB files (for SNMP monitoring of NSS health)
- View server name, type, status, health state, SSL certificate download

Per-server feed limits: **16 feeds per NSS server**, split as **8 Web feeds** and **8 Firewall feeds** maximum. This limit is a performance ceiling, not an arbitrary policy — feeding more than 8 of either type per server is unsupported (Tier A — vendor/zscaler-help/about-nss-feeds.md, vendor/zscaler-help/about-nss-servers.md).

### Cloud NSS feeds

Cloud NSS feeds are configured from the same NSS Feeds page but do not require an NSS VM. They are:

- Created as a separate object type ("Add a Cloud NSS feed") from the NSS Feeds page
- Limited to **1 feed per ZIA log type per Cloud NSS instance**
- Pushed from the Zscaler cloud as HTTPS POSTs to a customer-configured SIEM endpoint
- Monitored by Zscaler CloudOps rather than requiring customer-operated VM monitoring

Cloud NSS and VM-based NSS are separate SKUs and require separate subscriptions.

### Portal navigation for feeds

NSS Feeds page: **Logs > Log Streaming > Internet Log Streaming - Nanolog Streaming Service**

Operations available from this page:
- Add a TCP NSS feed (VM-based)
- Add an MCAS NSS feed
- Add a Cloud NSS feed
- Add an NSS Collector server
- Search for an NSS feed
- View feed list with: Feed Overview, Log Filter, Feed Output Format, Feed Attributes
- Edit existing feeds
- Add an NSS server (shortcut from this page)

---

## Log schemas emitted

NSS emits logs per the documented schemas:

- [`../zia/logs/web-log-schema.md`](../zia/logs/web-log-schema.md) — ZIA Web (HTTP / HTTPS transactions).
- [`../zia/logs/firewall-log-schema.md`](../zia/logs/firewall-log-schema.md) — ZIA Firewall, NAT, IPS, DNS module records.
- [`../zia/logs/dns-log-schema.md`](../zia/logs/dns-log-schema.md) — DNS queries.
- [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md) — ZPA LSS User Activity (different streaming path — **LSS is separate from NSS**, see below).

## LSS is not NSS

ZPA's log streaming layer is called **LSS (Log Streaming Service)**, which runs a different architecture: each App Connector emits to an LSS receiver configured per-tenant. It shares concepts (per-event log streaming, customizable format) but is separately configured and billed.

See terminology: [`./terminology.md § NSS vs LSS`](./terminology.md) (add if not present).

## Surprises worth flagging

1. **"One-hour recovery" isn't automatic.** Both VM-NSS and Cloud NSS require a Support ticket to enable the one-hour replay window. Without it, a connectivity gap = permanent SIEM gap, even if the gap was only 10 minutes.

2. **Nanolog retains originals but isn't a customer-queryable store.** "The Nanolog has the log" doesn't mean you can SQL it retroactively from the admin console. The Nanolog is the stream source; the customer's SIEM is the queryable archive. Long retention is the customer's SIEM problem.

3. **Cloud NSS's 1-feed-per-log-type-per-instance cap is the real architectural constraint.** Multi-SIEM fan-out (production + DR SIEM + a dev environment) needs multiple Cloud NSS instances, not multiple feeds.

4. **VM-based NSS buffers but doesn't replay from Nanolog on VM↔SIEM failure.** The buffer is VM-local memory. The one-hour recovery only applies to Nanolog↔NSS connectivity, not NSS↔SIEM. A SIEM that's offline longer than the VM memory buffer = data loss even with one-hour recovery enabled.

5. **Filter order affects ingest volume, not semantic accuracy.** Filters at NSS drop records; tenants using filters to reduce SIEM cost should verify filter criteria catch only what they want, because dropped records never reach SIEM at all. There's no "filtered" vs "unfiltered" dual output.

6. **NSS Collector's 10K events/second rate limit is hard.** Tenants with chatty third-party firewalls feeding into Shadow IT Report can silently lose events when exceeding this rate — nothing warns operators that excess is being dropped. Size third-party log volume against the 4-collector / 10K-per-collector ceiling.

7. **Cloud NSS recommends JSON over CSV.** CSV works but loses type information. JSON gives SIEM parsers a schema they can map to CIM (Common Information Model) fields more reliably. Tenants standardizing on CIM mapping in Splunk or similar should default to JSON.

8. **Throughput ceiling: 1 billion web transactions per Nanolog cluster.** Each NSS VM connects to exactly **one** Nanolog cluster. So a high-volume tenant exceeding 1B web transactions needs additional Nanolog clusters AND additional NSS VMs (one per cluster). Filter caps stack on top: per-feed filters on Users / Departments / Locations / Clients / Threat Names cap at 1,024 entries each. Source: *Ranges and Limitations* lines 119-125.

9. **ZPA LSS retransmit window is 15 minutes — not 60 like NSS.** When connectivity drops between Private Access and an App Connector, LSS can retransmit at most the last 15 minutes of log data after restoration, and **delivery is not guaranteed**. Logs generated during the gap between App Connector and SIEM are NOT retransmitted at all (audit logs are the exception). Operators familiar with NSS's 60-minute opt-in recovery often assume LSS matches; it doesn't. A 30-minute App Connector outage = ~15 minutes of permanent ZPA log gap. Source: *About the Log Streaming Service* lines 61-62.

## Operational questions this unlocks

- **"Why is my SIEM missing logs from last Thursday's outage?"** — If the outage was >1 hour, those logs are in the Nanolog but not replayable to SIEM. One-hour recovery only covers the first 60 minutes.
- **"How do I send the same Web logs to Splunk and to Sentinel?"** — Two Cloud NSS instances (one per destination), or one VM-NSS feed (which can stream to multiple TCP receivers) + one Cloud NSS feed.
- **"Can I filter at NSS before SIEM ingestion?"** — Yes, filters run at NSS post-detokenization. Drop anything the SIEM doesn't need before format conversion.
- **"Why does my Cloud NSS feed only carry Web logs even though I configured Firewall?"** — Cloud NSS subscription is per-log-type. Need both "Cloud NSS for Web" and "Cloud NSS for Firewall" subscriptions as separate SKUs.

## Cross-links

- Log schemas: `references/zia/logs/*.md`, `references/zpa/logs/access-log-schema.md`.
- SPL patterns that query NSS output: [`./splunk-queries.md`](./splunk-queries.md).
- Log-correlation guidance: [`./log-correlation.md`](./log-correlation.md).
- Cloud architecture (where Nanolog fits): [`./cloud-architecture.md`](./cloud-architecture.md).
- ZPA LSS (different streaming layer): [`../zpa/logs/access-log-schema.md`](../zpa/logs/access-log-schema.md).
- Clarifications on NSS: [`log-01`](../_clarifications.md#log-01-nss-feed-format-versions), [`log-02`](../_clarifications.md#log-02-cloud-nss-vs-legacy-nss-divergence).
