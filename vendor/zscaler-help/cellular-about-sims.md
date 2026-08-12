# About SIMs

**Source:** https://help.zscaler.com/zscaler-cellular/about-sims
**Captured:** 2026-08-12 via Zscaler Help `/zapi/fetch-data` JSON (`body.content`) extraction.

---

Physical Zscaler SIMs and eSIMs provide cellular-connected devices a path to
the Zero Trust Exchange. They are data-only SIMs intended for devices where an
endpoint agent is not feasible.

## Inventory and state

The **Infrastructure > Connectors > Cellular > SIMs** page exposes identifiers
and inventory fields including ICCID, IMEI, IMSI, MSISDN, IP address, form
factor, device manufacturer/model/type, operating system, data usage, country,
and tags.

- Administrative status is **Active** or **Inactive**.
- Connection state is **Online**, **Offline**, or **Inventory**.
- **Inventory** applies only to eSIMs and means that the eSIM is ready for
  assignment or, if assigned, is awaiting profile registration on a device.
- An eSIM returned to inventory can show stale connection state until an
  administrator opens its detail view to refresh the state.

The page also supports filters, CSV download for the current filtered view,
bulk status or IMEI updates, tag updates, and per-SIM detail views.
