# Deception and ITDR Service Connectors: built-in and external connectors, API tokens, command line and deletion (deception.service-connectors)
Also called: itdr service connectors; deception service connectors; service connector; siem connector

This subject covers the Deception and Identity Protection (ITDR) Service Connector pages ([Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated](kb:deception.overview), [Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated](kb:identity-protection.overview)). A Service Connector is an application that communicates with the admin portal and sends events and audit logs to SIEM solutions, and one Service Connector can feed one or multiple SIEMs; the Deception page adds that a Service Connector must be configured before integrating with a SIEM. [deception.service-connectors:connector-definition]

**Built-in and external connectors.** By default Service Connectors are configured automatically in the Deception Admin Portal and in each Decoy Connector, always run and cannot be deleted; external ones can be configured from Windows or Linux executables downloaded from the portal. The ITDR page says the automatically configured ones (in the ITDR Admin Portal) cannot be edited or deleted. [deception.service-connectors:builtin-connectors] The Service Connectors page lists each connector's Name, Version, Syslog Receiver Source (the configured syslog receiver type) and Syslog Receiver Allowed IPs (addresses allowed inbound from a configured syslog receiver). [deception.service-connectors:connector-list-columns] Configuring a Service Connector on a Windows or Linux system by running the executables from the portal needs an always-on system or endpoint to run the executable, network reachability from it to the admin portal, and network reachability from it to the SIEM (Deception page). [deception.service-connectors:connector-external-prereqs]

**Token and command line.** A new Service Connector's API token is copied from the Windows or Linux tab of the API Token generated window and is not displayed again after closing it; the Windows and Linux executables are run with --host=<Deception Admin Portal instance> and --api=<API Token> options, a --proxy=http://<username:password@proxy-server:proxy-port> option is shown for proxy use, and a service or daemon can be configured to start the connector at boot (Deception page). [deception.service-connectors:connector-token-and-command] When forwarding events from an IBM QRadar SIEM server to the Deception Service Connector, a syslog Source Type is selected and the SIEM servers' IP addresses are added to the Source Allowed IPs list. [deception.service-connectors:qradar-syslog-receiver]

**Deleting.** Deleting a Service Connector deletes all SIEM integrations that use it (Deception page). [deception.service-connectors:connector-delete-cascade]

What to check:
1. Before deleting a Service Connector, that the SIEM integrations using it are deleted with it.
2. For an external Service Connector that does not start sending, the reachability prerequisites to the admin portal and to the SIEM.

Area: deception.service-connectors, its subjects in references/_meta/spine/deception/deception.service-connectors.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/deception/deception.overview.md (Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated)
- links-to references/_meta/text/identity-protection/identity-protection.overview.md (Identity Protection (ITDR): how it reads identity stores and endpoints, what it needs, and what can be automated)
