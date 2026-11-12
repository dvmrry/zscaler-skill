# Streaming the ZIA admin audit log to a SIEM (Cloud NSS ADMIN_AUDIT) (zia.audit-logs.streaming)
Also called: admin audit nss; ADMIN_AUDIT feed; audit log siem; cloud nss audit; nss_log_type ADMIN_AUDIT; audit_log_type

There are two ways to get the admin audit trail out of ZIA: pull it with the report API ([Exporting the ZIA admin audit log through the report API](kb:zia.audit-logs.report-api)) or push it with a feed.

**Which NSS can push it.** VM-based NSS is offered as NSS for Web (web and mobile traffic logs) and NSS for Firewall (Zscaler Firewall logs). [zia.audit-logs.streaming:vm-nss-subscriptions] Admin audit logs are not listed among the VM-based NSS subscriptions (Web, Firewall). [zia.audit-logs.streaming:vm-nss-no-admin-audit] A TCP NSS feed article lets an admin configure up to 16 TCP NSS feeds for the admin audit logs that the NSS sends to the SIEM, with Log Type Admin Audit; the NSS feed articles also include one for HTTP NSS admin audit feeds. [zia.audit-logs.streaming:vm-feeds-exist] The initial audit log NSS feed can take up to 2 hours to stream to the NSS and the SIEM. With the Authentication Service the initial feed can take up to 5 hours, though that delay does not occur if SCIM logs are already being streamed. The HTTP NSS article says it can take up to two hours. [zia.audit-logs.streaming:initial-delay] If the organization has a policy to block unauthenticated traffic, Zscaler IP addresses must be allowed to prevent streaming issues with admin audit logs, and they are included in the Professional Services URL category. The article also describes configuring a user-defined URL category that includes the custom URL http://kproxy.hdeu1.zdataservices.net/. [zia.audit-logs.streaming:kproxy-allow]

**Cloud NSS.** A Cloud NSS feed can stream admin audit logs: ADMIN_AUDIT is an accepted nss_log_type in the Terraform provider and in the Go SDK's supported feed types. [zia.audit-logs.streaming:cloud-nss-admin-audit] A Cloud NSS feed has an audit_log_type (API field auditLogType) filter whose provider schema description is "Audit log type filter"; the provider declares it as a set of strings. [zia.audit-logs.streaming:audit-log-type-filter] The admin audit feed's Application filter on TCP feeds offers Branch Connector Portal Audit Log, Client Connector Portal Audit Log, ZIA Portal Audit Log and ZIdentity Admin Audit Log; the HTTP and Cloud NSS articles also list Risk360 Admin Portal Audit Log and ZDX Portal Audit Log. [zia.audit-logs.streaming:application-filter] The Go SDK also accepts NSS_ADMIN_AUDIT as a multi-feed type. [zia.audit-logs.streaming:multifeed-admin-audit] What an ADMIN_AUDIT feed's records look like is open [gap:zia.audit-logs.streaming:feed-contents]. Traffic log fields are the generated types [ZIA web log (NSS web feed)](kb:zia/web-log), [ZIA firewall log (NSS firewall feed)](kb:zia/firewall-log) and [ZIA DNS log (NSS DNS feed)](kb:zia/dns-log), with behavior in [What a ZIA web log record is and how its fields are named](kb:zia.logs.web-records) and [What a ZIA firewall log record is: aggregates, action and field names](kb:zia.logs.firewall-records); none describe this feed.

**As code.** The audit report API has no Terraform resource in the ZIA provider; only the Cloud NSS feed resource can carry admin audit data. [zia.audit-logs.streaming:no-terraform-for-report] Provider field behavior for the feed resource is in [ZIA Terraform resource fields that are not sent, not read back, or sent wrongly](kb:zia.terraform.field-fidelity).

What to check:
1. Whether the tenant already sends admin audit to the SIEM: list the Cloud NSS feeds for ADMIN_AUDIT before concluding the trail is, or is not, reaching it.

Inferred, not quoted (say so when an answer rests on one):
- [zia.audit-logs.streaming:vm-nss-no-admin-audit] Tier B: Rests on absence: the page lists only the Web and Firewall subscriptions; no admin audit stream is named. Not observed on a tenant.
- [zia.audit-logs.streaming:no-terraform-for-report] Tier B: Rests on a search: `grep -rli 'auditlogEntryReport\|eventlogEntryReport' vendor/terraform-provider-zia/` returns nothing at the pinned commit.

Not known (open gaps):
- Values accepted by audit_log_type [gap:zia.audit-logs.streaming:audit-log-type-values] (data gap): filled by live; run `zscalerctl zia nss-feeds list`; settled by lab-test or tenant-data or source-read
- Format and fields of an ADMIN_AUDIT feed [gap:zia.audit-logs.streaming:feed-contents] (data gap): filled by live; run `zscalerctl zia nss-feeds list`; settled by lab-test or tenant-data

Area: zia.audit-logs, its subjects in references/_meta/spine/zia/zia.audit-logs.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.nss.delivery-modes.md (VM-based NSS and Cloud NSS: subscriptions, transport and what each needs): Cloud NSS requires a separate concurrent subscription, and its geo-availability and qualifications are obtained from Zscaler Support. [shared.nss.delivery-modes:cloud-subscription]
- links-to references/_meta/text/zia/zia.audit-logs.report-api.md (Exporting the ZIA admin audit log through the report API)
- links-to references/_meta/text/zia/zia.logs.firewall-records.md (What a ZIA firewall log record is: aggregates, action and field names)
- links-to references/_meta/text/zia/zia.logs.web-records.md (What a ZIA web log record is and how its fields are named)
- links-to references/_meta/text/zia/zia.terraform.field-fidelity.md (ZIA Terraform resource fields that are not sent, not read back, or sent wrongly)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/nss-feeds.md (config type)
- configured-via references/_meta/text/zia/zia.api.cloud-nss-feeds.md (Cloud NSS feed settings: HTTPS-only URLs and OAuth fields)
- see-also references/_meta/text/zia/zia.audit-logs.what-is-recorded.md (What the ZIA admin audit log records and how the console shows it)
