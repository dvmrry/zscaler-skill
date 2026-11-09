# DLP incident API wire behavior: list envelopes, paging, close, delete, triggers and evidence, and where the SDKs part from the contract (zwa.api.incidents-wire)
Also called: zwa incident search; dlp incident api; FilterIncidentSearch; dlp_incident_search; zwa pagination; fetchTriggerContext; zwa evidence url; DeleteDLPIncident; incident_close; zwa go sdk empty results
Former IDs: zwa-02, zwa-05

These are the incident operations' behaviors beyond the generated paths and methods. The reference is the help API page; both SDKs call the same /dlp/v1/incidents family.

## Lists and paging

In the API reference, incident search and the transaction lookup return an incident list whose members are `cursor` and `incidents`, the tickets operation returns `cursor` and `tickets`, and the audit log search returns `cursor` and `logs`; the getting-started example reads `data["incidents"]` from a transaction lookup. [zwa.api.incidents-wire:list-envelopes] The Go `ReadAllPages` helper decodes each page's items from a `logs` member, and the Go incident search, transaction lookup and ticket lookup use it, as does the audit log search. [zwa.api.incidents-wire:go-pager] The Go pager reads the wrong member for incident lists [divergence:zwa.api.incidents-wire:go-list-member]. Python's `get_incident_transactions` builds one `IncidentDLPDetails` from the whole response body and returns it in a one-element list, while the reference returns an incident list envelope; the model reads incident fields such as `internalId` from the top level, so the incidents are not in the parsed result and must be read from the raw response. [zwa.api.incidents-wire:python-transactions-envelope]

Incident search takes `page` (minimum 0, default 0, not needed when `pageId` is used), `pageSize` (default 10, maximum 100) and `pageId`, a page identifier returned by the first search that later requests can use instead of the page number. [zwa.api.incidents-wire:search-page-params] The Go pager starts at a different page number [divergence:zwa.api.incidents-wire:page-start] and asks for more per page than the documented maximum [divergence:zwa.api.incidents-wire:page-size].

## Search

Incident search filters by exact field value or by time range; the searchable fields are severity, priority, transactionId, status, sourceDLPType, labels, incidentGroupIds and engine, the source DLP types are SaaS Security API, Email, INLINE and ENDPOINT, and a labels filter takes label names with their values. [zwa.api.incidents-wire:search-fields] The API's incident statuses are NEW, INVESTIGATING, VALIDATE_WITH_USER, JUSTIFICATION_RESPONSE_RECEIVED, ESCALATED and RESOLVED. [zwa.api.incidents-wire:status-values]

## Paths

Go puts the incident ID in a different place for notes and tickets [divergence:zwa.api.incidents-wire:go-path-order].

## Closing and deleting

The close request carries an optional `resolutionLabel`, `resolutionCode` and `notes`, and the only resolution code is FALSE_POSITIVE. [zwa.api.incidents-wire:close-request] Python's `incident_close` sends `resolutionLabel`, `resolutionCode` and `notes` and drops any of them left empty. [zwa.api.incidents-wire:python-close] Go's `UpdateIncidentStatus` sets only `Notes` in its close request, whose `resolutionLabel` and `resolutionCode` members carry no omitempty option. [zwa.api.incidents-wire:go-close] So a Go close always sends an empty `resolutionLabel` object and an empty-string `resolutionCode`, which is not one of the documented codes, and cannot close an incident as a false positive. [zwa.api.incidents-wire:go-close-empty-members]

The API reference documents DELETE on an incident as deleting the DLP incident for the given ID, returning a boolean on success, and the Go SDK's `DeleteDLPIncident` calls it. [zwa.api.incidents-wire:delete-operation] The Python SDK's DLP incidents module has no delete method. [zwa.api.incidents-wire:python-no-delete] The portal's deletion is permanent and permission-gated, [Incidents can be deleted in any status, only by admins whose role has delete access permission for the Incidents category, and deletion is permanent: deleted incidents cannot be recovered.](kb:zwa.incidents:delete-permanent); whether the API delete is the same is open [gap:zwa.api.incidents-wire:delete-semantics].

## Triggers and evidence

The v1 triggers operation, which downloads the data that triggered the incident, is marked deprecated; a v2 operation returns the trigger metadata nested by source category. Both take `fetchTriggerContext`, which on v1 adds the prefix and suffix data when true and defaults to false. [zwa.api.incidents-wire:triggers-v1-v2] The Python `get_incident_triggers` takes only `incident_id` and builds a request to the triggers path under its `/zwa/dlp/v1` base with no query parameters; the Go `GetDLPIncidentTriggers` takes only the incident ID and sends a GET to the triggers path under `/dlp/v1/incidents` with nil options. [zwa.api.incidents-wire:sdk-triggers-no-context] So neither SDK can send `fetchTriggerContext`, and both reach only the v1 triggers operation. [zwa.api.incidents-wire:sdk-triggers-no-context-param] How a client should get trigger context is open [gap:zwa.api.incidents-wire:trigger-context].

The evidence operation returns the incident's evidence URL, which views and downloads an XML file with the data that triggered the incident, together with `fileName`, `fileType` and `additionalInfo`. [zwa.api.incidents-wire:evidence] Go types its `additionalInfo` differently from the contract [divergence:zwa.api.incidents-wire:evidence-additional-info]. Oversized evidence files are replaced by placeholders: [If the evidence file for a DLP incident exceeds 100 MB, the service replaces it with a placeholder evidence file that keeps the original name with .txt appended.](kb:zwa.incidents:evidence-placeholder).

What to check:
1. Whether an empty Go incident search or transaction lookup is the pager reading `logs` while the response carries `incidents`.
2. Whether a Go list call skipped the first page, by comparing with a raw request that starts at page 0.
3. Whether a Go close request carried an empty resolution code the API might reject.

Inferred, not quoted (say so when an answer rests on one):
- [zwa.api.incidents-wire:python-transactions-envelope] Tier B: Follows from the model reading per-incident keys at the top level of a body whose top level holds only cursor and incidents per the reference; not observed against a live response.
- [zwa.api.incidents-wire:go-close-empty-members] Tier B: Go's JSON encoder writes every member without omitempty, so the zero-valued label struct and string are sent; how the API treats an empty resolutionCode is not observed.
- [zwa.api.incidents-wire:python-no-delete] Tier B: Rests on every def in zscaler/zwa/dlp_incidents.py at the pin: __init__, get_incident_transactions, get_incident_details, change_history, get_incident_triggers, get_generated_tickets, get_incident_evidence, dlp_incident_search, incident_group_search, assign_labels, incident_notes and incident_close.
- [zwa.api.incidents-wire:sdk-triggers-no-context-param] Tier B: Read from the two functions at the pin: neither takes an argument that becomes a query parameter. Not observed on the wire.

Sources disagree (name both sides):
- The reference returns incident and ticket lists under `incidents` and `tickets`, while the Go pager reads items only from `logs`. [divergence:zwa.api.incidents-wire:go-list-member]
  - zscaler-help: Incident search and transaction lookups return cursor and incidents; ticket lookups return cursor and tickets.
  - sdk-go: The Go pager's page struct maps its items to logs.
  Impact: If responses follow the reference, Go's FilterIncidentSearch, GetIncidentTransactions and GetDLPIncidentTickets return no items with no error, because the JSON decoder ignores the unmatched incidents and tickets members; the audit log search, whose list is logs, is unaffected. Not observed against a live tenant.
- The reference's page numbers start at 0, while the Go pager starts at page 1 unless the caller sets one. [divergence:zwa.api.incidents-wire:page-start]
  - zscaler-help: Incident search's page parameter has minimum 0 and default 0.
  - sdk-go: ReadAllPages starts at page 1 and stops once the page number reaches totalPages minus 1.
  Impact: If pages are numbered from 0, a Go list call without an explicit page skips the first page of results. Not observed.
- Incident search documents a maximum page size of 100, and Python's docstrings say the same for search and audit logs, while the Go pager requests 1000 per page by default. [divergence:zwa.api.incidents-wire:page-size]
  - zscaler-help: The maximum page size is 100.
  - sdk-python: Python documents page_size with Max: 100 for the audit log search.
  - sdk-go: Go defaults to 1000 per page.
  Impact: A Go list call without PageSize asks for 1000 items a page; whether the server caps, rejects or honors it is not observed. The audit log operation in the reference states no maximum.
- Go adds notes at /incidents/notes/{id} and reads tickets at /incidents/tickets/{id}, while the reference and Python put the ID first: /incidents/{id}/notes and /incidents/{id}/tickets. [divergence:zwa.api.incidents-wire:go-path-order]
  - zscaler-help: The reference's note and ticket operations are under the incident ID.
  - sdk-go: Go formats the notes and tickets paths with the ID last.
  Impact: Go's CreateNotes and GetDLPIncidentTickets call paths the reference does not list; unless the server also accepts them, those two functions fail.
- The reference types evidence `additionalInfo` as an object, while Go types it as a string. [divergence:zwa.api.incidents-wire:evidence-additional-info]
  - zscaler-help: additionalInfo is an object.
  - sdk-go: Go's DLPIncidentEvidence declares AdditionalInfo as a string.
  Impact: If the API returns an object, Go's JSON decoding of the evidence response fails with a type error; the incident details' application and content additionalInfo, also strings in Go, appear as objects in the getting-started example. Not observed.

Not known (open gaps):
- Whether the API delete matches the portal's permanent, permission-gated delete [gap:zwa.api.incidents-wire:delete-semantics]: settled by source-read or lab-test. Blocks: deciding whether an API client may delete incidents safely
- How an SDK user gets trigger context, and when to move to v2 triggers [gap:zwa.api.incidents-wire:trigger-context]: settled by source-read or lab-test. Blocks: fetching prefix and suffix trigger context from an SDK

Area: zwa.api, its subjects in references/_meta/spine/zwa/zwa.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.incidents.md (Workflow Automation incidents: where they come from, who gets them, statuses, search limits and closing or deleting)
