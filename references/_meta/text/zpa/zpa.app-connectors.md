# ZPA App Connectors (zpa.app-connectors)
Also called: app connector; zpa app connector; zpa connector; private access connector; app connector overview

The App Connector sits on the application side of every ZPA flow. Questions about it split by what the reader is trying to learn:

1. **Where does it run and how many are needed?** Outbound-only behavior, redundancy, platforms and limits: [App Connector deployment, redundancy and limits](kb:zpa.app-connectors.deployment); per-platform VM and cloud procedures in [App Connector deployment by VM and cloud platform](kb:zpa.app-connectors.platforms); Docker, Kubernetes and OpenShift in [App Connectors on Docker, Kubernetes and OpenShift](kb:zpa.app-connectors.containers).
2. **Which group does it belong to and what does the group control?** Membership, DNS option, version profile, enrollment certificate and user codes: [App Connector groups](kb:zpa.app-connectors.connector-groups).
3. **How does it enroll?** Methods, certificates, re-enrollment and what blocks a new connector: [App Connector enrollment, certificates and re-enrollment](kb:zpa.app-connectors.enrollment); the key itself in [App Connector provisioning keys](kb:zpa.app-connectors.provisioning-keys), and how SDKs and tools model it in [Provisioning key fields and tool behavior across SDKs, provider and MCP](kb:zpa.app-connectors.provisioning-key-tooling).
4. **When and how is it updated?** Group schedule, statuses, failures and host OS: [App Connector software and host OS updates](kb:zpa.app-connectors.upgrades).
5. **Is it healthy?** Status values, log fields, pause state and streaming limits: [App Connector health, status values and telemetry](kb:zpa.app-connectors.health). CPU, memory, throughput, source port, application target, disk and file descriptor monitoring: [Monitoring App Connector performance: CPU, memory, throughput, source ports, application targets, disk and file descriptors](kb:zpa.app-connectors.performance).
6. **Which connector serves a session?** Selection inputs, stickiness and a zero connector ID: [How a session is assigned to an App Connector](kb:zpa.app-connectors.selection).

Provider and SDK defects that touch connectors and groups are in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects), [ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps](kb:zpa.terraform.resource-fidelity) and [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes). The Network Connector of VPN (for Legacy Apps) is covered in [Network Connectors and Network Connector groups (VPN for Legacy Apps)](kb:zpa.vpn.network-connectors). The Manager software, OAuth enrollment rules, network settings and STIG images that App Connectors share with the other software components are in [ZPA software components: Manager software, OAuth enrollment, network settings and STIG images](kb:zpa.software-components).

Area: zpa.app-connectors, its subjects in references/_meta/spine/zpa/zpa.app-connectors.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.app-connectors.provisioning-keys.md (App Connector provisioning keys): A provisioning key is a text string that enrolls an App Connector; it works as the connector's credential, letting the Private Access cloud verify the connector and complete deployment. [zpa.app-connectors.provisioning-keys:key-enrolls-connector]
- logged-in references/_meta/text/zpa/zpa.logs.app-connector-metrics.md (What the ZPA App Connector Metrics log reports and what it leaves open): The App Connector Metrics log reports TargetCount, the targets configured for access via the connector, and AliveTargetCount, the targets alive for access via it. [zpa.app-connectors.health:metrics-target-counts]
- logged-in references/_meta/text/zpa/zpa.logs.control-session-status.md (ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers): The App Connector Status log's SessionType is ZPN_ASSISTANT_BROKER_CONTROL, the session from the connector to the closest Public Service Edge, and SessionStatus is one of ZPN_STATUS_AUTHENTICATED, ZPN_STATUS_AUTH_FAILED or ZPN_STATUS_DISCONNECTED. [zpa.app-connectors.health:status-log-control-session]
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups)
- links-to references/_meta/text/zpa/zpa.app-connectors.containers.md (App Connectors on Docker, Kubernetes and OpenShift)
- links-to references/_meta/text/zpa/zpa.app-connectors.deployment.md (App Connector deployment, redundancy and limits)
- links-to references/_meta/text/zpa/zpa.app-connectors.enrollment.md (App Connector enrollment, certificates and re-enrollment)
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)
- links-to references/_meta/text/zpa/zpa.app-connectors.performance.md (Monitoring App Connector performance: CPU, memory, throughput, source ports, application targets, disk and file descriptors)
- links-to references/_meta/text/zpa/zpa.app-connectors.platforms.md (App Connector deployment by VM and cloud platform)
- links-to references/_meta/text/zpa/zpa.app-connectors.provisioning-key-tooling.md (Provisioning key fields and tool behavior across SDKs, provider and MCP)
- links-to references/_meta/text/zpa/zpa.app-connectors.selection.md (How a session is assigned to an App Connector)
- links-to references/_meta/text/zpa/zpa.app-connectors.upgrades.md (App Connector software and host OS updates)
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.software-components.md (ZPA software components: Manager software, OAuth enrollment, network settings and STIG images)
- links-to references/_meta/text/zpa/zpa.terraform.resource-fidelity.md (ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps)
- links-to references/_meta/text/zpa/zpa.vpn.network-connectors.md (Network Connectors and Network Connector groups (VPN for Legacy Apps))
