# Breach Predictor Request and Support tickets: how they are created and what the Tickets page lists (breach-predictor.tickets)

Breach Predictor has Request tickets and Support tickets: Request tickets are created from policy recommendations, and the navigation page says Support tickets are created for other improvements that do not involve policy updates; other pages describe Support tickets as covering suggestions, problems with the software, or software bugs. [breach-predictor.tickets:types]

## Request tickets

Request tickets are created from the Findings page; Breach Predictor analyzes existing policies (for example File Type Control, SSL Inspection, URL Filtering) and automatically populates the ticket with the threat family, its MITRE ATT&CK placement and the policies that require updates. [breach-predictor.tickets:request-origin] From the Threat section of Findings, Jira tickets can be created so that Zscaler Support can make policy updates to remediate threats. [breach-predictor.tickets:jira-policy-tickets] Creating a Request ticket: Update Policy on the Threat page opens the Recommendation panel; Create Ticket opens a panel where the policies to update are selected and a name and details are provided, followed by a Confirm Update window. [breach-predictor.tickets:request-steps]

## Support tickets

A Support ticket request is created from the Support tab on the Tickets page, and Zscaler Support uses the information provided to create a ServiceNow ticket as needed. [breach-predictor.tickets:support-origin] The Support ticket system differs between pages [divergence:breach-predictor.tickets:support-ticket-system]. A Support ticket request is submitted through the Describe your issue field; a Zscaler Support team member follows up with more information and a ticket number if a ticket is created. [breach-predictor.tickets:support-submit]

## Tickets page

Ticket creation requires that Breach Predictor be integrated with Jira and ServiceNow; the Tickets page links to the instance of Jira or ServiceNow in a separate browser tab. [breach-predictor.tickets:integration-required-and] To see the tickets filed by the organization, Breach Predictor must be integrated with Jira or ServiceNow. [breach-predictor.tickets:integration-required-or] The integration requirement is worded differently across pages [divergence:breach-predictor.tickets:integration-requirement].

- **Request tab.** The Request tab lists Ticket ID (the Jira number), Priority (assigned by Zscaler Support), Assignee, Created Date, Ticket Name and Status (the current workflow status) for each Request ticket. [breach-predictor.tickets:request-columns]
- **Support tab.** The Support tab lists Ticket ID (the Jira number), Requested, Description, Created Date (when Zscaler Support created the ticket) and Status (the current workflow status) for each Support ticket. [breach-predictor.tickets:support-columns]

Priority and status values are open [gap:breach-predictor.tickets:ticket-values].

Sources disagree (name both sides):
- The Tickets page labels the Support ticket ID as a Jira number, while the Requesting Updates article and the 2025-02-03 release entry have Support tickets created in ServiceNow. [divergence:breach-predictor.tickets:support-ticket-system]
  - zscaler-help: The Support tab's Ticket ID is the Jira number of the Support ticket.
  - zscaler-help: Zscaler Support creates a ServiceNow ticket for a Support ticket request.
  - zscaler-help: The February 03, 2025 release entry calls them Support (ServiceNow) tickets, against Request (Jira) tickets.
  Impact: Do not state which system holds a Support ticket, or what its Ticket ID refers to, as settled.
- The captures state the ticketing integration requirement three ways: Jira and ServiceNow for ticket creation, Jira or ServiceNow to see tickets, and Jira and ServiceNow to log tickets for policy changes. [divergence:breach-predictor.tickets:integration-requirement]
  - zscaler-help: Ticket creation requires integrating Breach Predictor with both Jira and ServiceNow.
  - zscaler-help: Seeing the organization's tickets requires integrating with Jira or ServiceNow.
  - zscaler-help: The navigation page lists Jira and ServiceNow as the integrations used to log tickets for policy changes.
  Impact: Do not state that both systems, or only one, must be integrated as settled; check the integrations on the Profile page's Integration tab.

Not known (open gaps):
- Which ticket priority values and workflow status values exist [gap:breach-predictor.tickets:ticket-values]: settled by source-read or support-ticket

Area: breach-predictor.tickets, its subjects in references/_meta/spine/breach-predictor/breach-predictor.tickets.json

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/breach-predictor/breach-predictor.overview.md (Breach Predictor: what it predicts, which data it reads, how it maps attacks, and what it integrates with)
- see-also references/_meta/text/breach-predictor/breach-predictor.findings.md (Breach Predictor Findings: the MITRE ATT&CK Mapping page, the Threat page, severity scores and attack stages)
- see-also references/_meta/text/breach-predictor/breach-predictor.portal.md (Breach Predictor portal: licensing, ZIA prerequisite, sign-in, profile and theme)
