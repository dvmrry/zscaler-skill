# What restoring a ZIA restore point does and does not revert (zia.backup-restore.restore-semantics)
Also called: restore point overwrite; zia restore removes; backup restore dlp edm idm; what does zia restore cover; golden restore point restore

A restore is destructive, and its reach is smaller than "everything".

Before restoring: A restore point's stored policies can be selected by type (for example Sandbox, Firewall Control, DLP) to see their rules before restoring, and all the stored policies shown there are read-only. [zia.backup-restore.restore-semantics:stored-policies-read-only] In the Verify & Restore window the restore point is verified for any error message or warning before Confirm; the verification checks certain conditions, for example that all provisioned static IP addresses in the restore point are still associated with the current tenant and the expiration timestamp of the certificates persisted in the restore point, before the restore point is applied. [zia.backup-restore.restore-semantics:verify-before-restore]

What it does: Restoring a restore point overwrites all current policies and configuration settings, including all rules and their components such as URL categories and time intervals; it is a replacement, not a merge. [zia.backup-restore.restore-semantics:overwrites-all] A component present in the current configuration but absent from the selected restore point is removed by the restore, so a component created after the point was taken is removed. [zia.backup-restore.restore-semantics:absent-removed] A restore point created before some of the additional features were introduced can only be used to restore the policies and configurations persisted in it; applying it does not override policies and configurations that were not supported in the platform version when it was created. [zia.backup-restore.restore-semantics:legacy-restore-point] Which features make a restore point legacy, and how to tell one apart, is not stated [gap:zia.backup-restore.restore-semantics:legacy-features]. Rule components that belong to other areas move with it; URL categories used by rules are part of the replacement, see [ZIA URL Filtering](kb:zia.url-filtering).

What it covers: The backup covers these policy families: Advanced Threat Protection, Bandwidth Control, Browser Control, Cloud App Control, Data Loss Prevention, DNS Control, File Type Control, Firewall Control, Forwarding Control, FTP Control, IPS Control, Malware Protection, Mobile App Store Control, Mobile Malware Protection, SaaS Security API DLP, SaaS Security API Malware Detection, Sandbox, SSL Inspection and URL Filtering. [zia.backup-restore.restore-semantics:included-policies] The list is of policy families only [gap:zia.backup-restore.restore-semantics:configuration-settings]. Whether backup and restore is available through the API, SDKs, Terraform or MCP is open [gap:zia.backup-restore.restore-semantics:api-surface].

What it does not restore: For organizations with Exact Data Match (EDM) or Indexed Document Match (IDM) enabled, Backup and Restore does not restore Data Loss Prevention policies, so a successful restore is not evidence that DLP policy state was restored. [zia.backup-restore.restore-semantics:dlp-edm-idm] DLP behavior is in [ZIA Data Loss Prevention](kb:zia.dlp).

What to check:
1. What was created after the chosen restore point, since a restore removes it.
2. Whether a tenant with EDM or IDM needs its DLP policies put back by hand, since a restore does not restore DLP for those tenants.

Not known (open gaps):
- Which features make a restore point legacy, and how to tell one apart [gap:zia.backup-restore.restore-semantics:legacy-features]: settled by support-ticket or lab-test
- Which non-policy configuration settings a restore point holds [gap:zia.backup-restore.restore-semantics:configuration-settings]: settled by lab-test or support-ticket. Blocks: telling an admin what a restore will revert outside the listed policies
- Whether backup and restore is available through the API, SDKs, Terraform or MCP [gap:zia.backup-restore.restore-semantics:api-surface]: settled by source-read or support-ticket

Area: zia.backup-restore, its subjects in references/_meta/spine/zia/zia.backup-restore.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.dlp.md (ZIA Data Loss Prevention): For organizations with Exact Data Match (EDM) or Indexed Document Match (IDM) enabled, Backup and Restore does not restore Data Loss Prevention policies, so a successful restore is not evidence that DLP policy state was restored. [zia.backup-restore.restore-semantics:dlp-edm-idm]
- interacts-with references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering): Restoring a restore point overwrites all current policies and configuration settings, including all rules and their components such as URL categories and time intervals; it is a replacement, not a merge. [zia.backup-restore.restore-semantics:overwrites-all]
- logged-in references/_meta/text/zia/zia.audit-logs.what-is-recorded.md (What the ZIA admin audit log records and how the console shows it), from zia.backup-restore: Category is the location in the Admin Console where an action was performed, and its potential values include Activation, Backup & Restore and Audit Logs (among others), so actions taken in the activation and Backup & Restore areas are logged under those categories. [zia.audit-logs.what-is-recorded:category-values]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.backup-restore.restore-points.md (ZIA restore point limits, golden point and scheduled eviction)
