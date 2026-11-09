# ZIA email alerts: event classes, thresholds, severities, subscriptions and the resend interval (zia.alerts)
Also called: alerts; alert subscriptions; Define Alerts; alert class; Minimum Occurrences; Within Time Interval; resending alerts; Global Configuration alerts; Policy Violation alert

ZIA alerts email chosen recipients when chosen events occur, for example malware detected in either direction or a policy violation; an organization can create up to 128 alerts, and a received alert is investigated through the event's logs in Analytics. [zia.alerts:purpose-and-limit] Events are grouped into classes, available depending on the organization's subscriptions: Security Alerts; Access Control Alerts (Chat File Transfer, Social Network Post, Streaming Upload, Streaming View/Listen, URL Filtering Blocked Sites, Webmail File Attachment); System Alerts (ADP Schedule Update Failure, Auth Bridge Down, LDAP Connection Down, LDAP Failure, LDAP Success, Traffic Decrease, Traffic Increase, Policy Violation); Data Loss Prevention Alerts (Custom Engine Violation, GLBA Violation, HIPAA Violation, IDM Schedule Update Failure, PCI Violation); and Patient 0 Alerts (Patient 0, which requires Advanced Sandbox). [zia.alerts:classes]

**Defining an alert.** An alert definition's Alert Class is filled in from the chosen Alert Name and cannot be edited. The alert is triggered when the event occurs Minimum Occurrences times (1, 5, 10, 100 or 1,000) within the Within Time Interval (5 minutes, 15 minutes, 30 minutes, 1 hour or 1 day). Applies To scopes it to the organization, a location, department or user, and Severity is Critical, Major, Minor, Info or Debug. Comments are limited to 10,240 characters. [zia.alerts:definition] The Policy Violation event sends an alert if the total number of events from all other classes and categories reaches the configured threshold. [zia.alerts:policy-violation-event] The severity setting is useful for creating several alerts for the same kind of event, such as detection of outbound viruses or data leakage, with different thresholds for each. [zia.alerts:severity-tiers] The page's worked example uses an occurrence count the field does not offer [divergence:zia.alerts:severity-example-count]. Disabling an alert stops the Admin Console sending its alert notifications. [zia.alerts:disable]

**Security events and logged fields.** For building the same alerts in a SIEM fed by NSS, the page's Security Alerts table gives each event's logged field and value. Most events match a URL Category value: Advanced Security, Spyware Callback (for Adware/Spyware), Adware/Spyware Sites, Botnet Callback, Browser Exploit, Cross-site Scripting, Crypto Mining & Blockchain, Malicious Content, Peer-to-peer, Phishing, Suspicious Content, Suspicious Destination, Unauthorized Communication and Web Spam. The incoming/outgoing malware, spyware and virus events and the Sandbox Adware, Anonymizer, Malware, Offensive Security Tools and Ransomware events match Threat Category/Malware Category values, and Incoming/Outgoing Unscannable Files matches the Policy Reason 'Not allowed to upload/download unscannable file formats'. [zia.alerts:security-events-and-log-fields]

**Who receives them.** Alerts are received through subscriptions: each is an email address with an optional description of up to 10,240 characters and, for each alert class (Patient 0, Security, Access Control, Data Loss Prevention, System), the severities Critical, Minor, Major, Info or Debug that the recipient receives. [zia.alerts:subscriptions] Which subscriptions enable which classes is not mapped [gap:zia.alerts:subscription-class-map]. In the Edit Global Configuration drawer, the admin chooses the interval at which the service sends an alert after the first one if the event continues to occur: 30 Minutes, 1 Hour, 6 Hours, 12 Hours or 24 Hours. [zia.alerts:resend-interval] The default interval, and whether resending can be turned off, are not stated [gap:zia.alerts:resend-default].

**Lists.** The Define Alerts list shows, per alert, Triggered By (the number of event occurrences for a given time period) and is paginated with up to 500 alerts per page; the alert subscriptions list is also paginated with up to 500 per page. [zia.alerts:pages] Only email delivery is described on these pages; the Alerts dashboard, Alert Rules and Webhooks that the admin role page mentions are in [Security & UEBA alerts: ongoing alerts, alert history and alert details](kb:zia.alerts.security-ueba) and [Security & UEBA alert rules: alert types, triggers, exceptions and webhooks](kb:zia.alerts.rules) [gap:zia.alerts:alerts-dashboard-and-webhooks]. Whether the Policy Violation total is counted per Applies To scope is not stated [gap:zia.alerts:policy-violation-scope], and the OpenAPI, SDKs and Terraform were not checked for an alert API [gap:zia.alerts:api-surface].

What to check:
1. Which occurrence counts and intervals the form offers, rather than the 500 in the page's example.
2. Whether the recipient's subscription includes the alert's class at the alert's severity.

Sources disagree (name both sides):
- The Managing Alerts page's severity example sets the severity of an event with 500 occurrences in 5 minutes to Critical, but the same page's Minimum Occurrences field offers only 1, 5, 10, 100 or 1,000. [divergence:zia.alerts:severity-example-count]
  - zscaler-help: The example uses 5 occurrences for Minor and 500 occurrences for Critical, both within 5 minutes.
  - zscaler-help: The Minimum Occurrences field offers 1, 5, 10, 100 or 1,000; 500 is not among them.
  Impact: The 500 in the example is not a value the form accepts, so it should not be copied as a threshold; the page does not say whether the example is illustrative or the list is incomplete.

Not known (open gaps):
- Default resend interval and whether resending can be turned off [gap:zia.alerts:resend-default]: settled by lab-test or source-read
- Which subscriptions enable which alert classes [gap:zia.alerts:subscription-class-map]: settled by source-read or tenant-data
- Whether the Policy Violation total is counted per Applies To scope [gap:zia.alerts:policy-violation-scope]: settled by lab-test
- Whether alert definitions and subscriptions are available through an API [gap:zia.alerts:api-surface]: settled by source-read

Area: zia.alerts, its subjects in references/_meta/spine/zia/zia.alerts.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.alerts.rules.md (Security & UEBA alert rules: alert types, triggers, exceptions and webhooks)
- links-to references/_meta/text/zia/zia.alerts.security-ueba.md (Security & UEBA alerts: ongoing alerts, alert history and alert details)
