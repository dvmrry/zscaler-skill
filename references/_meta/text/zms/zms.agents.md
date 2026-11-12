# How Microsegmentation agents are installed, edited, deleted and protected against tampering (zms.agents)
Also called: zms agent manager; microsegmentation agent install; eyez agent; microsegmentation anti-tamper; zms agent uninstall; zep anti-tamper

Agents are installed on server workloads (virtual machines, bare metal servers or Kubernetes clusters) and can be installed with configuration management tools that handle Windows .msi files or Linux .deb and .rpm files. [zms.agents:install-tooling]

**Agent list.** The Agents page lists each agent's Name, Type, Current Software Version, Connection Status and Admin Status. [zms.agents:agents-columns]

**Agent manager.** Before installing the agent manager a signing certificate for Microsegmentation agents must exist; a common practice is a new intermediate certificate named Microsegmentation with the root as parent and Client Certificate Type set to None. [zms.agents:manager-prereq-cert] After the agent manager is installed it automatically downloads and installs the agent version in the agent group's version profile, and the agent then connects to the Zscaler Zero Trust Exchange. [zms.agents:manager-installs-agent] If the agent service fails to start or the agent fails to register with the ZTE, the documented likely cause is a firewall or security appliance interfering with its outbound mTLS connection; the fix is to permit outbound port 443 without DPI or similar measures. [zms.agents:install-failure-mtls] The agent and agent manager are removed on Debian with `apt remove -y eyez-agentmanager eyez-agent`, on RPM systems with `yum remove -y eyez-agentmanager eyez-agent`, and on Windows by uninstalling EyezAgent and EyezAgentManager. [zms.agents:uninstall-commands]

**Editing and deleting.** An agent can be edited for name, Admin Status (Enabled, Disabled or Inherit From Group), Tamper Protection Status (Disabled or Inherit From Group), Policy Status and description; the additional information cannot be edited. [zms.agents:edit-fields] Deleting an agent only unregisters it: it stays in the Agent list, and unless the agent is manually uninstalled from the workload the resource it reported is marked as Deleted. [zms.agents:delete-unregisters] Deleted resources might appear in the Application Map when viewing historical flows until the logs roll over every 14 days. [zms.agents:deleted-resources-14d]

**Anti-tamper protection.** Anti-tamper protection ensures agent functionality such as reporting, enforcement and upgrades cannot be maliciously disabled or altered, including by an untrusted actor with admin privileges; its notifications are logged on the Agent Telemetry page. [zms.agents:anti-tamper-scope] Agent version 1.12.2 is the minimum supported version for anti-tamper protection. [zms.agents:anti-tamper-min-version] Anti-tamper protection supports Windows Server 2022/2025, Ubuntu/Debian Linux with kernel 5.7 and later, and RHEL-like Linux with kernel 4.18.0-372 and later. [zms.agents:anti-tamper-platforms] Microsegmentation implements anti-tamper through Zscaler Endpoint Protection (ZEP), which installs as part of the Zscaler Client Connector installation but is also available standalone as ZEPInstaller.exe. [zms.agents:anti-tamper-zep] Anti-tamper protection can be enabled on an agent group (the preferred method) or per agent, where the agent setting Inherit From Group (Enabled) suits phased rollout, exceptions or targeted enforcement. [zms.agents:anti-tamper-enable-levels]

**Open questions.** How ZEP's installation with Client Connector fits the host rule is open [gap:zms.agents:anti-tamper-zcc], as is anti-tamper on compatible OS releases outside its list [gap:zms.agents:anti-tamper-windows]. The OS compatibility page lists Windows Server 2012 R2, 2016, 2019, 2022 and 2025, RHEL 7.9 (minimum kernel 3.10.0-1160.160.1.el7.x86_64), SLES 15 and 16, and Amazon Linux AL2 and AL 2023 as compatible with Microsegmentation. [zms.agents:os-compat-windows-linux]

**Related.** Agent groups are in [How Microsegmentation agent groups are configured, aged out, upgraded and managed](kb:zms.agent-groups) and provisioning keys in [Microsegmentation agent provisioning keys (nonces): portal, fields and API](kb:zms.provisioning-keys).

What to check:
1. Whether the agent is at least version 1.12.2 and on a listed platform before expecting anti-tamper protection.
2. Whether outbound port 443 from the host is permitted and not subject to DPI when the service fails to start or register.

Not known (open gaps):
- How ZEP shipping with Zscaler Client Connector fits the rule against both on one host [gap:zms.agents:anti-tamper-zcc]: settled by source-read
- Whether compatible OS releases outside the anti-tamper list lack anti-tamper [gap:zms.agents:anti-tamper-windows]: settled by source-read

Area: zms.agents, its subjects in references/_meta/spine/zms/zms.agents.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zms/zms.agent-groups.md (How Microsegmentation agent groups are configured, aged out, upgraded and managed)
- links-to references/_meta/text/zms/zms.provisioning-keys.md (Microsegmentation agent provisioning keys (nonces): portal, fields and API)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zms/zms.overview.md (Zscaler Microsegmentation (ZMS): agents, local enforcement, region and provisioning)
- see-also references/_meta/text/zms/zms.dashboards.md (What the Microsegmentation Flow, Agent and Overview dashboards and the Application Map show)
- see-also references/_meta/text/zms/zms.analytics.md (What the Microsegmentation Data Explorer log pages list: flow logs, aggregations, connection status, telemetry and events)
