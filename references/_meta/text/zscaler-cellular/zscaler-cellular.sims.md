# Zscaler SIMs and eSIMs: inventory fields, status versus connection, and the Inventory state (zscaler-cellular.sims)
Also called: zscaler sim status; sim connection inventory; esim inventory state; sim offline online; iccid imei imsi msisdn; sim stale connection

The SIMs page is the inventory of every Zscaler SIM provisioned to the organization; the dashboard widgets that link to it are in [Zscaler Cellular Dashboard: what each widget shows and where its numbers link](kb:zscaler-cellular.dashboard).

**Inventory.** Zscaler SIMs include physical SIMs and eSIMs, and are viewed and managed in the Zscaler Admin Console. [zscaler-cellular.sims:sim-kinds] The SIMs page lists, per SIM, ICCID, EID (for eSIMs), IMEI, IMSI, MSISDN, IP address, form factor, device manufacturer, model and type, operating system, usage, status, country, tags and connection. [zscaler-cellular.sims:inventory-columns]

**Status and connection.** Status and connection are separate: status is Active (available for use) or Inactive (not in use), while connection is Online, Offline or Inventory (ready for assignment or awaiting profile registration; eSIMs only). [zscaler-cellular.sims:status-vs-connection] Inventory applies only to eSIMs and means the eSIM is ready for assignment, or assigned and awaiting profile registration on a device. [zscaler-cellular.sims:inventory-state] When an eSIM assigned to a user is released back to inventory, its connection state may not update on the SIMs page; viewing the eSIM's details refreshes it. [zscaler-cellular.sims:stale-connection] The details page's connection description disagrees with this list [divergence:zscaler-cellular.sims:connection-values].

**Actions.** Status or IMEI can be updated for several selected SIMs at once, and the current view (with its filters) can be downloaded as CSV; the Total Usage figure covers only SIMs matching the applied filters. [zscaler-cellular.sims:bulk-actions] A single SIM's status, IMEI and tags can be edited, and its detailed information viewed. [zscaler-cellular.sims:per-sim-edits] The status of physical SIMs and eSIMs can be changed from the SIMs page, and SIMs selected for a bulk status update must be of the same status. [zscaler-cellular.sims:status-change] The API equivalents (SIM search, lock and status update) are in [ZCell wire notes: paging, time windows, SIM search, violations, audit search, SIM lock and tower history](kb:zscaler-cellular.api.wire-notes).

**SIM details.** The SIM Details page's SIM Info section shows ICCID, Connection (described there as online or offline), APN, MSISDN (the SIM's mobile number, if applicable), Country, EID (for eSIMs), Operator, IP Address, IMEI, IMSI, Tags, Activation Date and Last Usage Updated; clicking a tag filters the SIMs page to SIMs with that tag. [zscaler-cellular.sims:details-sim-info] The SIM Details page's Device Info section shows the device's manufacturer, type (for example router, modem, IoT gateway), operating system, model and model name. [zscaler-cellular.sims:details-device-info] The SIM Details page's Current Data Usage widget shows cumulative data usage for the date range selected in the Usage Chart, and the date range is a default (Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month) or a custom range. [zscaler-cellular.sims:details-usage-chart] The SIM Details Location History widget shows blue map pins for SIM activity, and hovering over a pin shows the event's date and time, type, operator, MCC, MNC and Cell ID; a separate timeline bar shows the total number of location events and moves from oldest to newest. [zscaler-cellular.sims:details-location-history] A backend feature flag decides the map content: when enabled it shows the SIM's location history over the selected timeframe, and when disabled only the current location; changing it needs Zscaler Support. [zscaler-cellular.sims:location-feature-flag]

**IMEI association.** In the Update IMEI Lock/Unlock drawer, for a single SIM or for several selected SIMs, IMEI values go in the IMEI Lock Value field separated by commas; enabling Lock locks the SIM to the IMEI and disabling Lock unlocks it. [zscaler-cellular.sims:imei-lock-input] After an IMEI lock is saved for a single SIM or for several selected SIMs, the lock is not immediate: the SIM enters a pending lock state and might take approximately 15 to 30 minutes to reach the locked state. [zscaler-cellular.sims:imei-lock-delay] The lock status of an existing IMEI association can be updated without changing the IMEI value. [zscaler-cellular.sims:imei-lock-status-only] The limits and what the locked state enforces are open [gap:zscaler-cellular.sims:imei-lock-limits].

**eSIMs.** The eSIM Info widget on the SIM Details page appears only for eSIMs. [zscaler-cellular.sims:esim-info-widget] Managing eSIM assignment and activation is in limited availability; access is through the Zscaler Account team. [zscaler-cellular.sims:esim-limited-availability] An eSIM is assigned to a user from the eSIM Info widget on its SIM Details page by entering the recipient's name or email address; reassigning to a new user needs the eSIM on the previous user's device manually uninstalled first. [zscaler-cellular.sims:esim-assign] An assigned eSIM must be activated by scanning the QR code shown under View QR Details in the eSIM Info widget from the device, or by entering the copied activation code manually on the device. [zscaler-cellular.sims:esim-activate] What happens when the previous eSIM is not uninstalled is open [gap:zscaler-cellular.sims:esim-reassign-not-uninstalled].

**Tags.** A SIM gets an existing tag by typing part of its name in the Tags field and selecting it, or a new tag by entering a new name and clicking Add New Tag; clicking a tag on the SIMs or SIM Details page shows all SIMs with that tag. [zscaler-cellular.sims:tags]

What to check:
1. Whether the SIM is Inactive (status) or Offline (connection): they are separate fields.
2. For an eSIM showing an unexpected connection state after being returned to inventory, whether its details were opened to refresh it.

Sources disagree (name both sides):
- The SIM Details page describes Connection as online or offline; the SIMs page lists Online, Offline and, for eSIMs, Inventory. [divergence:zscaler-cellular.sims:connection-values]
  - zscaler-help: Connection on the SIM Details page indicates online or offline.
  - zscaler-help: Connection can also be Inventory, for eSIMs only.
  Impact: Whether an eSIM in Inventory shows that value or a blank or online/offline value on its SIM Details page is not settled; the SIMs page value is the one the status-vs-connection claim rests on.

Not known (open gaps):
- IMEI lock unlock delay, IMEI count limit and what the locked state enforces [gap:zscaler-cellular.sims:imei-lock-limits]: settled by lab-test or support-ticket
- What happens when the previous eSIM is not uninstalled before reassignment [gap:zscaler-cellular.sims:esim-reassign-not-uninstalled]: settled by lab-test or support-ticket

Area: zscaler-cellular.sims, its subjects in references/_meta/spine/zscaler-cellular/zscaler-cellular.sims.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.api.wire-notes.md (ZCell wire notes: paging, time windows, SIM search, violations, audit search, SIM lock and tower history)
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.dashboard.md (Zscaler Cellular Dashboard: what each widget shows and where its numbers link)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zscaler-cellular/zscaler-cellular.overview.md (Zscaler Cellular: Zscaler SIM, Cellular Edge and how SIM traffic reaches ZIA and ZPA policy)
