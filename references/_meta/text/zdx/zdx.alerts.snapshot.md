# Sharing a ZDX snapshot of an alert or a user: the contract, the Python client and the path question (zdx.alerts.snapshot)
Also called: share_snapshot; zdx snapshot; share alert snapshot; snapshot obfuscation; snapshot expiry; user snapshot; snapshot/alert; client.zdx.snapshot
Former IDs: zdx-35, zdx-44

A snapshot is a shareable, expiring view of one alert, or of one user's experience with an application on a device. Only the Python SDK calls the alert form, and only as a POST.

**The contract.** The contract's alert snapshot takes `name` and `alert_id` (required, both strings), `expiry` as a Unix epoch in seconds that defaults to 2 hours and must fall between 2 hours and 90 days, and `obfuscation`, a list of fields to mask drawn from `USER_NAME`, `LOCATION`, `DEVICE_NAME`, `IP_ADDRESS` and `WIFI_NAME`. [zdx.alerts.snapshot:contract-alert-request] The contract also has a user snapshot for a given user, device and application, requiring `name`, `user_id`, `device_id` and `app_id`, whose 'from' must be no older than 14 days and whose 'from' to 'to' span must be between 15 minutes and 48 hours. [zdx.alerts.snapshot:contract-user-request] A created snapshot answers with its `id`, `name`, `expiry`, `status` and the `url` to access it. [zdx.alerts.snapshot:contract-response] Who can open that URL is only partly settled [gap:zdx.alerts.snapshot:share-url-access].

**In the console.** The ZDX Snapshot feature captures the current state of a UI page and provides a URL that admins can share with ZDX users or other admins for view-only access. It enables users without Digital Experience login access to view a subset of ZDX features while bypassing the login authentication process, and the help says to share snapshots only with trusted recipients to avoid inadvertent disclosure of data. [zdx.alerts.snapshot:console-snapshot] Sharing snapshots needs a ZDX subscription level that supports it and an admin role configured to share them; the subscription table lists ZDX Snapshots as not supported on Standard and Microsoft 365 and supported on Advanced and Advanced Plus, with 90 days of data retention on those two tiers. Snapshots can be shared from user details, the Applications Overview, application details, alert details, Diagnostics details and incident details. [zdx.alerts.snapshot:console-snapshot-sources] In the console a snapshot's Valid For period is selected in increments from 2 Hours to 90 Days, and Obfuscate Data can be enabled to hide the data types chosen from the Obfuscation menu from the recipient. [zdx.alerts.snapshot:console-snapshot-validity] Digital Experience > Reports > Snapshots shows a history of ZDX Snapshots from an accrued list of generated URLs, each of which can be copied or deleted. A snapshot's Status is Expired or Active, and after expiration the snapshot is no longer valid and a message confirms the URL is not found if one attempts to share it. [zdx.alerts.snapshot:console-snapshot-history] For the user details page the Share Snapshot link is enabled only when an application has been selected, and only for the selected device; in a snapshot of that page, user interaction is disabled by default for the time range filter, drop-down menu filters, device selection, applications other than the one selected, other root cause analysis data points, Web Probe Metrics and the Cloud Path. [zdx.alerts.snapshot:console-snapshot-user-page]

**Where it lives.** The contract places both snapshot operations at `/snapshot/alert` and `/snapshot/user` under the server `https://api.zsapi.net/zdx`, without the `/v1` segment its other ZDX paths carry; the capture's validation report flags both as path-prefix anomalies. [zdx.alerts.snapshot:contract-path] The Python `share_snapshot` posts to its ZDX base `/zdx/v1` plus `/snapshot/alert`. [zdx.alerts.snapshot:python-path] The two prefixes differ [divergence:zdx.alerts.snapshot:snapshot-base-path], and which one a live tenant accepts is open [gap:zdx.alerts.snapshot:snapshot-path-live].

**What the Python client sends.** The Python `share_snapshot` takes `expiry` in hours (documented as defaulting to 2 and ranging from 2 hours to 90 days) and sends the absolute epoch time now plus that many hours. [zdx.alerts.snapshot:python-expiry-hours] The Python `share_snapshot` builds its body from `name`, `alert_id` and the converted `expiry` only; the decorator moves `expiry` into the query parameters first, and the method pops it back out. [zdx.alerts.snapshot:python-body] So an `obfuscation` list passed to the Python `share_snapshot` never reaches the API: the method documents it but neither copies it into the body nor maps it through the decorator. [zdx.alerts.snapshot:obfuscation-not-sent] The earlier question about obfuscation is closed by this reading [gap:zdx.alerts.snapshot:obfuscation-transmission].

What to check:
1. Whether a snapshot shared through the Python SDK was meant to mask fields: its obfuscation list is not sent, so the shared snapshot is unmasked unless the API defaults otherwise.
2. Which path the client posted to, the SDK's `/zdx/v1/snapshot/alert` or the contract's `/snapshot/alert`, when a snapshot call fails with not-found.

Inferred, not quoted (say so when an answer rests on one):
- [zdx.alerts.snapshot:obfuscation-not-sent] Tier B: Read from the method and the `zdx_params` mapping list at the pin; no captured request shows it.

Sources disagree (name both sides):
- The alert snapshot's path: the contract has `/snapshot/alert` under the `/zdx` server root; the Python SDK posts to `/zdx/v1/snapshot/alert`. [divergence:zdx.alerts.snapshot:snapshot-base-path]
  - api-specs: POST `/snapshot/alert` under `https://api.zsapi.net/zdx`, without `/v1`.
  - sdk-python: POST `/zdx/v1/snapshot/alert`.
  Impact: One of the two paths may not exist on the gateway; a hand-written client that copies the other source's path can get a not-found error. The capture's own validation flags the contract's path as an anomaly, so neither source settles it.

Not known (open gaps):
- Which base path a live tenant accepts for the snapshot routes [gap:zdx.alerts.snapshot:snapshot-path-live]: settled by lab-test or source-read. Blocks: telling a caller which snapshot path to use
- Who can open a snapshot's URL [gap:zdx.alerts.snapshot:share-url-access]: settled by lab-test or support-ticket. Blocks: advising whether a snapshot link can be shared outside the organization

Area: zdx.alerts, its subjects in references/_meta/spine/zdx/zdx.alerts.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zdx/zdx.score.md (The ZDX Score: scale, bands, score types and what lowers it), from zdx.alerts: ZDX alerts monitor device, application, network performance and ZDX Score; admins create alert rules that trigger when a preset threshold is reached, and triggered alert details are sent by email or webhook. [zdx.alerts:about]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.alerts.md (ZDX alerts: how rules trigger, what an alert's status means, and reading alerts through the API)
- see-also references/_meta/text/zdx/zdx.api.client-coverage.md (Which ZDX API operations the Python and Go SDKs cover, and the configuration API neither calls)
