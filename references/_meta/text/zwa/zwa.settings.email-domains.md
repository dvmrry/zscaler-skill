# Workflow Automation custom email domains: the notification sender, DNS verification, statuses and the default domain (zwa.settings.email-domains)
Also called: custom email domain; notifications@zsworkflow.net; envelope sender domain; originating email address

By default Workflow Automation sends its email notifications (notify user, escalate to approver or manager, bulk actions) from notifications@zsworkflow.net; a custom email domain is optional and, once added, can be used as the sender. [zwa.settings.email-domains:default-sender] The wider settings are in [Workflow Automation account settings: notification expiry, digests and reminders, approver domains, user data source, obfuscation and quarantine release](kb:zwa.settings).

**Adding a domain.** Adding a custom email domain takes a Domain Name, an Envelope Sender Domain Name (which improves deliverability and SPF alignment and keeps a consistent sending identity) and an Originating Email Address from which notifications are sent. [zwa.settings.email-domains:domain-fields] Workflow Automation generates DNS records for verification and sets the status to DNS verification pending; the records must be published within 72 hours or the status changes to Expired, after which the DNS records can be regenerated. [zwa.settings.email-domains:dns-verification-window] After the records are published, AWS checks them: valid records give the status Success and the domain can be used for notifications; invalid records, or a technical issue, give the status Failed and the domain is not added, so it must be deleted and added again to regenerate the DNS records. [zwa.settings.email-domains:dns-verification-outcome]

**Statuses.** A custom email domain has one of five statuses: DNS verification pending, Expired, Failed, In Use or Success; only a Success domain can be made the default, and only one domain can be In Use. [zwa.settings.email-domains:statuses] Only one custom email domain can be the default, which sets its status to In Use; a domain with status In Use cannot be deleted until another domain is made the default. [zwa.settings.email-domains:default-and-delete]

**Editing and reverting.** A custom email domain can be edited when its status is Success, In Use or DNS verification pending; for In Use or Success only the Originating Email Address can be edited. [zwa.settings.email-domains:edit-rules] Revert to Zscaler Domain makes zsworkflow.net the originating email domain again; the test email is optional. [zwa.settings.email-domains:revert-and-test]

What to check:
1. Which status the custom email domain shows before expecting notifications from it.

Area: zwa.settings, its subjects in references/_meta/spine/zwa/zwa.settings.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zwa/zwa.settings.md (Workflow Automation account settings: notification expiry, digests and reminders, approver domains, user data source, obfuscation and quarantine release)
