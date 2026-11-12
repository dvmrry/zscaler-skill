# The zpa_service_edge_group resource for Private Service Edge groups (zpa.private-service-edges.terraform)
Also called: zpa_service_edge_group; service_edges block; terraform private service edge group; terraform service edge import; zpa_service_edge_controller data source; zpa_private_cloud_group enrollment

The provider models a Private Service Edge group as one resource and Private Service Edge instances only as a data source.

**Arguments.** In the resource schema, name, latitude, longitude and location are required, city_country is optional and country_code is optional and computed, although the provider docs list city_country and country_code under Required. enabled defaults to true and is_public to false. [zpa.private-service-edges.terraform:tf-required-args] grace_distance_value and grace_distance_value_unit are RequiredWith grace_distance_enabled in the schema, and each is RequiredWith the other, so setting either value or unit requires the other two fields. [zpa.private-service-edges.terraform:zpa-terraform-grace] Only the first trusted_networks block is sent [divergence:zpa.private-service-edges.terraform:trusted-networks-max-items]. Wrapper modules: [Reference Terraform modules for Private Service Edges on AWS and Azure](kb:zpa.private-service-edges.reference-modules).

**Membership.** When the service_edges block is omitted Terraform ignores service edge membership completely; when specified it enforces exact membership and reports any discrepancy as drift. Membership is typically managed outside Terraform. [zpa.private-service-edges.terraform:service-edges-block] The service_edges block carries a deprecation notice: it will be deprecated in a future release. [zpa.private-service-edges.terraform:service-edges-deprecation]

**Import and managed groups.** A Service Edge group can be imported using its ID or its name as the import ID. [zpa.private-service-edges.terraform:import-by-id-or-name] The group type carries readOnly and zscalerManaged flags, and Zscaler-managed groups are read only in the console. [zpa.private-service-edges.terraform:managed-flags] Importing a managed group is unverified [gap:zpa.private-service-edges.terraform:import-managed-group].

**Related resources.** In zpa_private_cloud_group, enrollment_cert_id is optional, with auto-resolution of the "Connector" enrollment certificate by name when omitted, and the user_codes attribute enables OAuth2 user code enrollment. [zpa.private-service-edges.terraform:private-cloud-group-enrollment] The provider has a zpa_service_edge_controller data source that looks up a service edge controller by name, and a service_edge_group resource; the documentation lists no resource for individual Private Service Edge instances. [zpa.private-service-edges.terraform:controller-data-source]

Provider defects: [ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps](kb:zpa.terraform.resource-fidelity), [What ZPA Terraform data sources return, drop, or get wrong](kb:zpa.terraform.data-source-fidelity), and first-block-only association reads in [The same first-block-only read is in the other association expanders in `common.go` (app connector groups, app server groups, service edge groups), which feed the v1 and v2 access policy rules, the redirection rule and the server group resource, and in the server group, service edge group (`trusted_networks`) and user portal link expanders, where the schema allows several blocks (the private cloud and `service_edges` expanders are single-block by schema).](kb:zpa.terraform.app-segment-lifecycle:association-block-first-only-places). Enrollment fields: [Enrolling a Private Service Edge](kb:zpa.private-service-edges.enrollment).

The Terraform Service Edge group resource declares service_edges optional and computed with a warning that membership is managed externally, and suppresses any diff on it unless the field is set in configuration. [zpa.private-service-edges.terraform:service-edges-diff-suppressed-when-unset]

The Terraform Service Edge group resource treats grace_distance_value as unchanged when old and new values are equal after formatting to one decimal place. [zpa.private-service-edges.terraform:grace-distance-value-one-decimal]

What to check:
1. Whether a configuration manages membership: when service_edges is omitted Terraform ignores membership entirely, so drift in members is not reported.
2. Whether the plan sets grace_distance_enabled without the value and unit, which the schema rejects.
3. Whether a group Terraform wants to change is Zscaler-managed, which is read only.
4. Whether the data source returning an empty Private Service Edge list is the provider defect rather than an empty group.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.private-service-edges.terraform:managed-flags] Tier B: Inferred link: the flag names match the console's read-only, Zscaler-managed groups; no source states that the flags drive that behavior.
- [zpa.private-service-edges.terraform:controller-data-source] Tier B: Absence: listing docs/resources at the pin shows zpa_service_edge_group and zpa_service_edge_assistant_schedule but no resource for a single Service Edge instance.

Sources disagree (name both sides):
- The docs allow one trusted_networks block, but the schema sets no limit and the provider reads only the first block. [divergence:zpa.private-service-edges.terraform:trusted-networks-max-items]
  - tf-zpa: The resource docs say trusted_networks allows at most one block.
  - tf-zpa: The schema declares trusted_networks as an optional list with its MaxItems line commented out, so several blocks pass validation.
  - tf-zpa: The expander sends only the IDs in the first trusted_networks block.
  Impact: A configuration with several trusted_networks blocks plans without error, but only the first block's IDs reach the API; put every trusted network ID in one block.

Not known (open gaps):
- Importing a Zscaler-managed Private Service Edge group [gap:zpa.private-service-edges.terraform:import-managed-group]: settled by lab-test. Blocks: advising whether a managed group may be imported

Area: zpa.private-service-edges, its subjects in references/_meta/spine/zpa/zpa.private-service-edges.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.private-service-edges.enrollment.md (Enrolling a Private Service Edge), from zpa.private-service-edges: Configuring a Private Service Edge involves adding it in the Admin Console, which includes applying enrollment tokens (preferred) or obtaining a Private Service Edge provisioning key, and then deploying it on a supported platform. [zpa.private-service-edges.enrollment:enrollment-tokens-preferred]
- logged-in references/_meta/text/zpa/zpa.logs.control-session-status.md (ZPA status logs for connectors, Private Service Edges and Private Cloud Controllers), from zpa.private-service-edges: For Private Service Edge Status and Private Cloud Controller Status logs the expected SessionType is ZPN_TUNNEL_CONTROL, the session from the Private Service Edge or Private Cloud Controller towards the closest Public Service Edge for Private Access; the App Connector Status value is ZPN_ASSISTANT_BROKER_CONTROL (see zpa.app-connectors.health). [zpa.logs.control-session-status:tunnel-control-session]
- logged-in references/_meta/text/zpa/zpa.logs.service-edge-metrics.md (Private Service Edge and Private Cloud Controller Metrics logs), from zpa.private-service-edges: In Private Service Edge and Private Cloud Controller Metrics logs CPUUtilization is the maximum CPU usage in the past 5 minutes. [zpa.logs.service-edge-metrics:cpu-peak-window]
- scoped-by references/_meta/text/zpa/zpa.private-service-edges.client-selection.md (How clients are steered to a Private Service Edge and which country policy applies), from zpa.private-service-edges: A Private Service Edge group can be mapped to the organization's trusted networks; the mapping prioritizes Private Service Edges matching a trusted network when users connect from it. [zpa.private-service-edges.client-selection:trusted-network-priority]
- reached-via references/_meta/text/zpa/zpa.private-service-edges.data-path.md (Tunnels, certificates and firewall requirements on the Private Service Edge path), from zpa.private-service-edges: An M-Tunnel originates in Zscaler Client Connector, extends to the Private or Public Service Edge using a tag Client Connector created, extends to the App Connector using a different tag the connector chose, and the App Connector connects it to the application server. At no point is actual IP identification data passed. [zpa.private-service-edges.data-path:mtunnel-stitching]
- depends-on references/_meta/text/zpa/zpa.private-service-edges.deployment.md (Private Service Edge platforms, host OS maintenance, capacity and limits), from zpa.private-service-edges: A platform needs Intel x86_64/AMD64, systemd, root or sudo, DNS resolution, a provisioning key or OAuth token, and a static MAC address. [zpa.private-service-edges.deployment:platform-prereqs]
- interacts-with references/_meta/text/zpa/zpa.private-service-edges.disaster-recovery.md (Disaster recovery mode and Private Service Edge groups), from zpa.private-service-edges: To provide application access during a global outage, designated application segments, Private Service Edges and App Connectors must be enabled for disaster recovery, and a disaster recovery domain name must be configured in the Disaster Recovery Settings and the Client Connector profiles. [zpa.private-service-edges.disaster-recovery:dr-designation]
- depends-on references/_meta/text/zpa/zpa.private-service-edges.groups.md (Private Service Edge groups: membership, software updates and version profiles), from zpa.private-service-edges: Every Private Service Edge belongs to exactly one group; groups organize Private Service Edges by region or functional area, hold the location, the automated update schedule, the version profile and disaster recovery, and a new group can be created when a Private Service Edge is added with a new provisioning key. [zpa.private-service-edges.groups:group-membership]
- logged-in references/_meta/text/zpa/zpa.private-service-edges.logging.md (Private Service Edge logs in the Log Streaming Service), from zpa.private-service-edges: The Log Streaming Service has two Private Service Edge log types: Private Service Edge Status, with source log type zpn_sys_auth_log, and Private Service Edge Metrics, with source log type zpn_pbroker_comprehensive_stats. [zpa.private-service-edges.logging:lss-log-types]
- interacts-with references/_meta/text/zpa/zpa.public-service-edges.md (ZPA Public Service Edges), from zpa.private-service-edges: A tenant's Private Service Edge groups sit alongside Public Service Edges: a group can be configured to be prioritized over a closer Public Service Edge. [zpa.private-service-edges.what-it-is:coexists-with-public]
- links-to references/_meta/text/zpa/zpa.private-service-edges.reference-modules.md (Reference Terraform modules for Private Service Edges on AWS and Azure)
- links-to references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zpa/zpa.terraform.resource-fidelity.md (ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.private-service-edges.md (ZPA Private Service Edges)
