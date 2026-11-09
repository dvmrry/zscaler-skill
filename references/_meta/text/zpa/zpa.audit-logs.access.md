# Who can read and download ZPA audit logs (zpa.audit-logs.access)
Also called: zpa admin roles audit; who can download zpa audit logs; zpa read only administrator; log streaming permission

Reading the audit log depends on the admin's Private Access role.

**Roles.** Private Access has two predefined admin roles: ZPA Administrator, with read, add, edit and delete privileges, and ZPA Read Only Administrator, with read privileges only. [zpa.audit-logs.access:predefined-roles] An admin with ZPA Administrator privileges can create custom admin roles for specific Private Access features, and can manage and add only custom roles with equal or lower privileges than their own. [zpa.audit-logs.access:custom-roles]

**Download.** Only admins with the Private Access Administrator role can download audit logs from the Audit Logs page. [zpa.audit-logs.access:csv-role] The downloaded CSV holds only the records for the selected time range and filters, lists timestamps in UTC whatever the account time setting is, and separates the content of the Post-Configuration Change Value column with a dollar sign. [zpa.audit-logs.access:csv-contents]

What a custom role needs to manage log streaming, and how fast a role change applies, are not sourced [gap:zpa.audit-logs.access:log-streaming-permission] [gap:zpa.audit-logs.access:role-change-delay].

What to check:
1. Whether the admin holds the Private Access Administrator role when the Download option is missing.
2. Whether a custom role exists and was created by an admin with equal or greater privileges.
3. What the role's Log Streaming permission is before assuming it governs receiver access.

Area: zpa.audit-logs, its subjects in references/_meta/spine/zpa/zpa.audit-logs.json

Linked (open a file only if the answer needs it):
- scoped-by references/_meta/text/shared/shared.admin-rbac.zpa.md (ZPA admin roles: feature permissions, effective access and propagation delay): Private Access has two predefined admin roles: ZPA Administrator, with read, add, edit and delete privileges, and ZPA Read Only Administrator, with read privileges only. [zpa.audit-logs.access:predefined-roles]
- depends-on references/_meta/text/zpa/zpa.log-receivers.md (ZPA log receivers and the Log Streaming Service), from zpa.audit-logs: A log receiver's source log type for audit logs is `zpn_audit_log`; the Python SDK reaches it through the `audit_logs` key. [zpa.audit-logs.streaming:audit-source-type]
