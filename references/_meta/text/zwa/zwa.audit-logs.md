# Workflow Automation audit logs: the customer audit search, what it records, and how the SDKs read it (zwa.audit-logs)
Also called: zwa audit logs; workflow automation audit; customer audit; GetCustomerAudit; client.zwa.audit_logs; oldRowJson; zwa audit retention
Former IDs: zwa-03

Workflow Automation's admin audit trail is a search API, listed with the other products' audit paths in [Admin audit logs across Zscaler products: what exists and how to get it](kb:shared.audit-logs). The audit log search filters by time range and field values and returns audit information for every action admins take in the Workflow Automation Admin Portal and every action made through the APIs; the supported filter fields are Action, Resource, Admin and Module. [zwa.audit-logs:what-recorded]

**Audit Logs page.** The Audit Logs page (Data Explorer > Audit Logs > Workflow Automation) records the actions admins perform in Workflow Automation and the actions that occur through the Workflow Automation APIs. [zwa.audit-logs:page-scope] The Audit Logs page takes a date range, filters by admin, action, module or resource, and offers search. [zwa.audit-logs:page-filters] The Admin ID column holds the login ID of the admin who performed the action, and displays no value when the admin has a shared login ID. [zwa.audit-logs:page-admin-id] Clicking the View icon next to an audit log entry opens a Change window highlighting the differences between the configuration before and after the change; the icon is not available for Read entries, and Insert, Update and Delete entries can be viewed. [zwa.audit-logs:page-change-view]

**Page values.** On the Audit Logs page, the potential actions are Delete, Insert, Update and Read. [zwa.audit-logs:page-actions] On the Audit Logs page, the potential modules are API Keys, CSV Upload, Customers, DLP, Incident, Incident Group, Integrations, Template Mapping and Workflow; Privacy and Security changes under Account Settings appear with the Customers module, and Generate Presigned Link clicks on the Incident Details page appear with the Incident module. [zwa.audit-logs:page-modules] On the Audit Logs page, the potential resources are Admin Configuration, API Key, CSV User Data, Customer, Evidence Data, Incident Group, Incident Group Mapping, Integration Configuration, Template Mapping, Workflow Definition and Workflow Definition Mapping. [zwa.audit-logs:page-resources] [divergence:zwa.audit-logs:action-list]

**Records.** Each audit record has `action`, `module` (where the action was performed), `resource` (the audited entity) and `changedAt`, all required, and may carry `changedBy` (the admin), `oldRowJson` and `newRowJson` (the entity's previous and current values, typed as objects) and `changeNote`. [zwa.audit-logs:record-fields] The action is one of INSERT, UPDATE, DELETE, CHECKPOINT and UNDEFINED. [zwa.audit-logs:action-values] [divergence:zwa.audit-logs:action-list]

**Paging.** The audit search takes `page` (minimum 0, default 0), `pageSize` (default 10, no stated maximum) and `pageId`. [zwa.audit-logs:page-params] The Go client shares the incident pager, with its page-start and page-size differences: [zwa.api.incidents-wire:page-start](kb:zwa.api.incidents-wire:page-start), [zwa.api.incidents-wire:page-size](kb:zwa.api.incidents-wire:page-size).

**SDK models.** Python's audit model keeps `cursor` and `logs`, and each log entry reads only `action`, `module` and `resource`, so `changedAt`, `changedBy`, `oldRowJson`, `newRowJson` and `changeNote` are not attributes of the parsed result; Go's `AuditLog` struct carries all eight. [zwa.audit-logs:python-model] Go types the before and after values differently from the contract [divergence:zwa.audit-logs:row-json-type].

**Retention and export.** Retention is not documented for Workflow Automation, as for several other products: [Audit retention outside ZIA, ZPA and the ZDX, Cloud & Branch Connector, Client Connector and Experience Center console logs](kb:shared.audit-logs:other-retention). Whether the log can be streamed anywhere is open [gap:zwa.audit-logs:retention-and-streaming], and so is whether the API's module and resource filters accept the strings the page lists [gap:zwa.audit-logs:filter-values]; whether the page's Admin ID is the record's `changedBy` is open too [gap:zwa.audit-logs:admin-id-changed-by].

What to check:
1. Whether a Python caller needs changedAt, changedBy or the before and after values, which the Python model does not expose.
2. Whether a Go audit search error is a decode failure on oldRowJson or newRowJson.

Inferred, not quoted (say so when an answer rests on one):
- [zwa.audit-logs:python-model] Tier B: Rests on the whole Logs class at the pin, whose __init__ sets only action, module and resource; the raw response object still holds the other members.

Sources disagree (name both sides):
- The help page's list of potential actions has Read and no CHECKPOINT or UNDEFINED, while the contract's action enum has CHECKPOINT and UNDEFINED and no Read. [divergence:zwa.audit-logs:action-list]
  - zscaler-help: The potential actions on the Audit Logs page are Delete, Insert, Update and Read.
  - zscaler-help: The contract's action is one of INSERT, UPDATE, DELETE, CHECKPOINT and UNDEFINED.
  Impact: A client that filters or branches on the action cannot tell whether Read entries come through the API, or what CHECKPOINT and UNDEFINED entries show as on the page. Not observed.
- The contract types `oldRowJson` and `newRowJson` as objects, while Go declares them as strings. [divergence:zwa.audit-logs:row-json-type]
  - zscaler-help: oldRowJson is an object holding the previous value of the audited entity.
  - sdk-go: Go's AuditLog declares OldRowJSON and NewRowJSON as strings.
  Impact: If the API sends objects, Go's decoding of an audit page fails with a type error, failing the whole GetCustomerAudit call; if it sends JSON text, Go works and the contract is wrong. Not observed.

Not known (open gaps):
- Retention of Workflow Automation audit logs and whether they can be streamed [gap:zwa.audit-logs:retention-and-streaming]: settled by source-read or support-ticket. Blocks: planning audit collection for Workflow Automation
- Whether the page's Admin ID and the record's changedBy are the same value [gap:zwa.audit-logs:admin-id-changed-by]: settled by tenant-data or source-read. Blocks: correlating API audit records with the console's Admin ID column
- Values accepted by the Module, Resource and Admin audit filters [gap:zwa.audit-logs:filter-values]: settled by tenant-data or source-read. Blocks: writing an audit search filtered by module or resource

Area: zwa.audit-logs, its subjects in references/_meta/spine/zwa/zwa.audit-logs.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.audit-logs.md (Admin audit logs across Zscaler products: what exists and how to get it)
- links-to references/_meta/text/zwa/zwa.api.incidents-wire.md (DLP incident API wire behavior: list envelopes, paging, close, delete, triggers and evidence, and where the SDKs part from the contract)
