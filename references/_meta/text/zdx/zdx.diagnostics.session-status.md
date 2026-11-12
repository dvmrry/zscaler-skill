# What a Diagnostics Session's status means, in the console and in the API (zdx.diagnostics.session-status)
Also called: diagnostics session status; diagnostics session expired; diagnostics session incomplete; abort initiated; deep trace status; deeptrace not_started; why did my diagnostics session expire
Former IDs: zdx-30

A session moves through statuses shown in two console tables, and the API reports its own, shorter set.

**In progress.** A session in the In Progress table is Created (an admin created it), Started (Client Connector confirmed the request and probe execution will begin; the change from Created can take a few minutes) or In Progress (Client Connector is executing it, and it provides updated session data every minute). [zdx.diagnostics.session-status:in-progress-statuses] How often information is collected during a session is in [During a Diagnostics session information is collected every minute for the Web probe and the Cloud Path probe, as well as device statistics.](kb:zdx.diagnostics:session-collection-interval); how often the probes themselves run is only partly answered [gap:zdx.diagnostics.session-status:probe-cadence-during-session].

**History.** A session in the History table is Abort Initiated (an admin canceled it and the request was forwarded to Client Connector), Aborted (Client Connector acknowledged; the update can take a few minutes), Expired (the start request timed out without a Client Connector response, possibly because the device is offline or has network issues), Failed (after restarting, Client Connector could not run the scheduled probes because of internal errors), Incomplete (pipeline issues; partial data is displayed) or Completed. [zdx.diagnostics.session-status:history-statuses] Whether the reason for an abort is recorded anywhere is open [gap:zdx.diagnostics.session-status:abort-reason]. In a session's results, the data of an In Progress session is updated every minute, a Completed session shows complete session data, all other sessions show partial session data, and an Expired session shows no data in the session report; each configured session has a version compatibility that must be met to view the results. [zdx.diagnostics.session-status:results-by-status]

**The API's statuses.** The API reports a deep trace's `status` as one of `not_started`, `in_progress`, `error` and `done`. [zdx.diagnostics.session-status:api-statuses] How they map to the console's statuses is open [gap:zdx.diagnostics.session-status:status-mapping].

**Unverified edge cases.** Two older statements about session data are unconfirmed: a newly enrolled device [gap:zdx.diagnostics.session-status:new-device-baseline] and a network change during a session [gap:zdx.diagnostics.session-status:network-transition].

What to check:
1. Whether an Expired session's device was offline or cut off from the cloud when the session was requested.
2. Whether an Incomplete session's partial data is still usable before discarding it.
3. Which status vocabulary the reader is looking at: the console's names or the API's four values.

Not known (open gaps):
- How the API's four deep-trace statuses map to the console's nine session statuses [gap:zdx.diagnostics.session-status:status-mapping]: settled by lab-test or tenant-data. Blocks: explaining an API-read session status in console terms
- How often probes run during a Diagnostics Session [gap:zdx.diagnostics.session-status:probe-cadence-during-session]: settled by source-read or lab-test. Blocks: telling an operator what resolution a session's probe data has
- Whether the reason for an aborted session is recorded [gap:zdx.diagnostics.session-status:abort-reason]: settled by source-read or tenant-data. Blocks: finding who stopped a session and why
- What a session on a newly enrolled device shows [gap:zdx.diagnostics.session-status:new-device-baseline]: settled by source-read or lab-test. Blocks: interpreting a session's score on a new device
- What session data shows when the device changes network mid-session [gap:zdx.diagnostics.session-status:network-transition]: settled by lab-test. Blocks: explaining a gap in a session's data

Area: zdx.diagnostics, its subjects in references/_meta/spine/zdx/zdx.diagnostics.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.diagnostics.md (ZDX Diagnostics Sessions (deep traces): what they are and where each part is covered)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zdx/zdx.diagnostics.session-records.md (Reading and deleting a deep trace through the API: the session record and its keys)
