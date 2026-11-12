# How UVM exception requests work: roles, statuses, review, permissions and settings (uvm.exceptions)
Also called: uvm exception request; exceptions manager; request exception button; sla extension request

The exception process has an Exceptions Manager (configures settings, permissions and reviewer assignment rules), a Requester (typically a remediation owner) and a Reviewer who approves or denies. [uvm.exceptions:personas] A submitted exception is created in the Exceptions View with the Requested status and linked to its ticket; approval changes the status to Approved and automatically defers the ticket's due date to the new date, while denial leaves the original timeline in effect. [uvm.exceptions:lifecycle]

**Requesting.** An exception applies to the entire ticket, not to individual findings, so a subset of findings must be split into a separate ticket, and findings across tickets must be merged first. [uvm.exceptions:exception-per-ticket] The Request Exception dialog asks for a Reason and a Requested SLA date, may show additional fields depending on organization settings, and accepts optional attachments; if Exceptions is enabled in the account, requesters can submit exception requests. [uvm.exceptions:request-fields] If no designated reviewers are assigned in the account, the Reviewer field remains empty by default, which typically means all users with reviewer permissions review exceptions; the approved SLA is auto-populated with the requested SLA by default. [uvm.exceptions:reviewer-default]

**Statuses.** The Requesting Exceptions page lists the exception statuses Approved (ticket SLA updated and ticket locked to prevent new findings), Denied (original SLA unchanged) and Cancelled (automatic, when the ticket's SLA is updated to a later date than requested); requesters cannot cancel manually. [uvm.exceptions:statuses] Causes of automatic cancellation include a manual change of the ticket SLA to a later date, a new lower-severity finding added to the ticket pushing the SLA date, and critical or high severity findings split from the ticket to a new ticket. [uvm.exceptions:cancel-causes]

**Reviewing.** Reviewing exceptions requires a role with Read, Create, Edit, Delete and Audit permissions under the Vulnerabilities App > Exception Operational View resource. [uvm.exceptions:review-permission] When auditing, Approved SLA defaults to the requested SLA but can be changed; Original SLA is the first SLA date assigned to the ticket and Current SLA the SLA currently assigned, which can differ because of new findings or previously approved exceptions. [uvm.exceptions:audit-fields] To approve with a modified date, change the Approved SLA, click Apply Changes and then Approve; approval extends the ticket SLA and locks the ticket, and the request is cancelled automatically if the ticket SLA is extended past the requested SLA. [uvm.exceptions:approve-modified] The Exceptions page has charts Exceptions by Ticket Severity, Active Tickets by Exception Status Buckets and Exceptions by Requester, and a table that by default shows each request's ID, Status, Reason and Requested SLA. [uvm.exceptions:exceptions-page]

**Settings.** Exception settings require Read and Edit under the Vulnerabilities App > Exception Settings resource, and selecting Enable at the top of the page activates the Request Exception button in the ticket drawer. [uvm.exceptions:settings-permission] [gap:uvm.exceptions:settings-steps]

**External sync.** An exception request can be synced to an external system such as ServiceNow IRM through an outegration, by selecting the exception request in the table and clicking Create <Outegration> Ticket. [uvm.exceptions:external-sync]

**Related.** [Unified Vulnerability Management (UVM): what it does with findings, and what can be automated](kb:uvm.overview) [How UVM tickets work: the Tickets page, manual split and merge, automatic grouping rules, status buckets and ticket workflows](kb:uvm.tickets)

Not known (open gaps):
- What the Exception Settings steps for the request form, reviewer assignment and email notifications configure [gap:uvm.exceptions:settings-steps]: settled by source-read

Area: uvm.exceptions, its subjects in references/_meta/spine/uvm/uvm.exceptions.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/uvm/uvm.overview.md (Unified Vulnerability Management (UVM): what it does with findings, and what can be automated)
- links-to references/_meta/text/uvm/uvm.tickets.md (How UVM tickets work: the Tickets page, manual split and merge, automatic grouping rules, status buckets and ticket workflows)
