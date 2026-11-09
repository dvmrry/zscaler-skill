# EASM Jira integration: personal access token, connection, ticket fields and synchronization limits (easm.jira-integration)

Jira can be integrated with one or more EASM organizations, and admins with full permission to the organization can create tickets for different projects and issue types such as Task, Story and Bug. [easm.jira-integration:scope] Configuring the Jira integration requires admin privileges to the EASM organization and permission in Jira to create a personal access token. [easm.jira-integration:prerequisites]

## Personal access token

Jira displays the personal access token only once and it cannot be viewed again after clicking Close. [easm.jira-integration:pat-shown-once] A Jira token's permissions are set at the creator's current access level by default, and an expiry period can be required or optional depending on admin configuration. [easm.jira-integration:pat-permissions-expiry] The personal access token must be valid when the integration is configured and when admins create Jira tickets from EASM. [easm.jira-integration:pat-validity]

## Connecting

Connecting Jira in EASM takes the organization's Jira domain and a personal access token. [easm.jira-integration:connect-fields] When the connection succeeds, the Jira tile displays a Connected badge and the token expiration time. [easm.jira-integration:connected-badge] The domain and token can be edited with the Edit button, which re-establishes the connection on save, and the connection is revoked with Disconnect from the Jira tile menu. [easm.jira-integration:edit-disconnect] Ticket synchronization between Jira and EASM takes place until the Jira token expires, after which the integration must be reconfigured with a new token. [easm.jira-integration:sync-until-expiry]

## Creating tickets

The Create Jira Ticket window has Ticket Name, Project, Issue Type, Component, Assignee, Priority and Description, and fields with predefined values are populated automatically from Jira. [easm.jira-integration:ticket-fields] A created ticket is added to Jira along with the finding details and any attachment files present for the finding in EASM. [easm.jira-integration:ticket-contents] The Tickets tab lists tickets with the ticket ID, status and created and updated times fetched from Jira. [easm.jira-integration:tickets-tab] The finding's Tickets tab is available if Jira integration is enabled for the organization the finding is associated with. [easm.jira-integration:tickets-tab-availability]

The finding the ticket is created from is in [EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages](kb:easm.findings). The token lifetime default, the Jira permission scopes and the synchronized fields beyond those cited are open [gap:easm.jira-integration:jira-details].

What to check:
1. Whether the Jira personal access token has expired before asking why tickets stopped synchronizing or cannot be created.

Not known (open gaps):
- Token lifetime default, required Jira permission scopes and the full set of synchronized fields [gap:easm.jira-integration:jira-details]: settled by source-read or lab-test

Area: easm.jira-integration, its subjects in references/_meta/spine/easm/easm.jira-integration.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/easm/easm.findings.md (EASM findings: the three drill-down levels, what the risk fields mean, statuses, ROI and the Admin Portal pages)
