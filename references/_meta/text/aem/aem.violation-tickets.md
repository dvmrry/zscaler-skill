# AEM violation tickets: the Violation Tickets page, drawer, split and merge, comments and activity log (aem.violation-tickets)
Also called: aem violation ticket; violation tickets page; split violation ticket; merge violation tickets

An AEM violation ticket aggregates related policy violations into a single work item, and tickets can be dispatched to external platforms such as Jira or ServiceNow. [aem.violation-tickets:definition]

**The page.** On the Violation Tickets page the Active view is the system default and shows all violation tickets with at least one active policy violation; tickets can be filtered by Severity, State, Assignee or Policy Violation Count. [aem.violation-tickets:active-view-filters] With the default Active saved view, a violation ticket shows a Severity Score calculated from the severity scores of its policy violations (for example the highest or the average), an SLA deadline, and a Remediation percentage of policy violations resolved. [aem.violation-tickets:columns] Bulk actions on selected violation tickets are Update, Merge and Create 3rd party Issue, and the ticket list can be exported as a CSV file. [aem.violation-tickets:bulk-actions] Severity score calculation is open [gap:aem.violation-tickets:severity-score-formula].

**The drawer.** The actions available in the violation ticket drawer depend on the user role in AEM, and Apply Changes is clicked after updating the ticket. [aem.violation-tickets:drawer-role] A violation ticket has a Comments tab for comments and an Add Attachment icon to attach supporting evidence to a comment. [aem.violation-tickets:comments-attachments] A violation ticket's Activity tab is an audit trail of status changes, assignment changes, ticket updates and system-recorded events, with who performed each action and when. [aem.violation-tickets:activity-log] The drawer's tab contents are open [gap:aem.violation-tickets:drawer-tabs], and so are the role permissions for tickets [gap:aem.violation-tickets:ticket-permissions].

**Split and merge.** Policy violations can be split from a violation ticket into one new ticket or a separate ticket per violation; at least one selected policy violation must be active and inactive selections cannot be split, and the original ticket is listed on the Related Tickets tab of the new ticket. [aem.violation-tickets:split] Selected violation tickets can be merged into a single ticket, for example when tickets contain similar policy violations resolved by the same fix; the merge dialog takes an Assignee and a Status for the new ticket. [aem.violation-tickets:merge] Grouping rule sets are in [AEM grouping rule sets: how policy violations are aggregated into violation tickets](kb:aem.ticket-grouping-rules), and statuses and workflows in [AEM violation ticket lifecycle: status buckets, statuses and ticket workflows](kb:aem.ticket-lifecycle).

Not known (open gaps):
- Which formula an account uses for a violation ticket's severity score [gap:aem.violation-tickets:severity-score-formula]: settled by tenant-data or support-ticket
- Which role permissions gate violation tickets, ticket workflows and AEM dashboards [gap:aem.violation-tickets:ticket-permissions]: settled by source-read or tenant-data
- What the violation ticket drawer tabs contain [gap:aem.violation-tickets:drawer-tabs]: settled by source-read or lab-test

Area: aem.violation-tickets, its subjects in references/_meta/spine/aem/aem.violation-tickets.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/aem/aem.ticket-grouping-rules.md (AEM grouping rule sets: how policy violations are aggregated into violation tickets)
- links-to references/_meta/text/aem/aem.ticket-lifecycle.md (AEM violation ticket lifecycle: status buckets, statuses and ticket workflows)
