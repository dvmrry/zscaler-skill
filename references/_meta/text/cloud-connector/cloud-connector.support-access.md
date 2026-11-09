# Zscaler Support access to Cloud & Branch Connector: Admin Console remote assistance and the zssupport tunnel into connector VMs (cloud-connector.support-access)
Also called: cloud connector remote assistance; branch connector remote access; zssupport tunnel start; zssupport; ecsupport.log; cloud connector support tunnel; allow remote assistance cloud connector; cloud connector port 12002

Zscaler Support can reach a Cloud & Branch Connector deployment in two separate ways: through the Admin Console, and through the connector VM. Remote assistance lets Zscaler Support log in to the portal with either view-only or full admin privileges until the specified date; it is set at Help > Tools & Resources > Remote Assistance by selecting Allow Remote Assistance, then View Only, Full Access (Read/Write), or both. [cloud-connector.support-access:console-remote-assistance] An admin can request remote access and allow Zscaler Support to log in to their Cloud or Branch Connector VM instance without opening a firewall connection for inbound traffic; the feature is disabled by default and must be explicitly enabled for the duration of the support assistance. [cloud-connector.support-access:vm-remote-access]

**Admin Console remote assistance.** Zscaler recommends a length of at least one year when choosing view-only access and at least two days when choosing full access. [cloud-connector.support-access:durations] Obfuscate Data is off by default, and admins with Remote Assistance Management enabled for their role can make changes in the Remote Assistance window. [cloud-connector.support-access:obfuscate] Who may change the setting is a role permission: [Remote Assistance Management lets admins allow Zscaler Support to log in to the Admin Console; the page lists the levels Full and View Only for it.](kb:shared.admin-rbac.cloud-connector:remote-assistance-perm).

**VM remote access.** The zssupport tunnel has a command that creates a long-lived SSH tunnel to the Zscaler cloud with remote port forwarding, which needs outbound SSH traffic allowed on port 12002 because the support servers monitor through this port; another brings the tunnel and all remote connections down, a third checks its status, and every command must include sudo. [cloud-connector.support-access:zssupport-commands] If the admin is using AWS Session Manager, the path environment variable is exported (including /home/zsroot/bin) before running sudo zssupport tunnel start. [cloud-connector.support-access:ssm-path] If the support tunnel enablement fails, the logs at /var/log/zscaler/ecsupport/ecsupport.log are to be attached for debugging. [cloud-connector.support-access:support-log] The firewall requirements are at https://config.zscaler.com/<Zscaler Cloud Name>/cloud-branch-connector, where the cloud name is the one in the URL used to log in to the Admin Console. [cloud-connector.support-access:firewall-url]

**Open.** What Obfuscate Data hides, the longest allowed duration and the host the zssupport tunnel connects to are not given [gap:cloud-connector.support-access:remote-assistance-details].

What to check:
1. For a support tunnel that will not start, that outbound SSH on port 12002 is allowed, that every command was run with sudo, and the ecsupport log for the failure.
2. For Support that cannot log in to the VM, that the support tunnel was explicitly enabled, since the feature is disabled by default.
3. For Support that cannot reach the Admin Console, whether the Remote Assistance window is still open and the access level selected.

Not known (open gaps):
- What Obfuscate Data hides, the longest remote assistance duration and the zssupport tunnel host [gap:cloud-connector.support-access:remote-assistance-details]: settled by support-ticket or source-read

Area: cloud-connector.support-access, its subjects in references/_meta/spine/cloud-connector/cloud-connector.support-access.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.admin-rbac.cloud-connector.md (Cloud & Branch Connector admin roles: super admin, the eleven permission categories and Unified RBAC)
