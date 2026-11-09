# Cloud & Branch Connector: what Cloud Connector is and where each area is described (cloud-connector.overview)
Also called: cloud connector; cloud & branch connector; cloud and branch connector; ztw; ztc; edge connector; what is cloud connector; cloud connector architecture; cloud connector overview; cloud connector not registering; cloud connector fails to come up after deployment

Zscaler Cloud Connector is a virtual machine that simplifies traffic forwarding to Zscaler services, extending Internet & SaaS (ZIA) and Private Access (ZPA) to cloud-native workloads. [cloud-connector.overview:what-it-is] Internet & SaaS is used when a private workload communicates with a public workload through the Zero Trust Exchange; Private Access is used when two private workloads communicate with each other through it. [cloud-connector.overview:internet-vs-private]

Cloud Connector provides Layer 4 controls for east-west traffic, including subnet-to-subnet and VPC-to-VPC traffic across AWS, Azure and GCP, and for ingress traffic to public applications hosted there, with tag-based policies. [cloud-connector.overview:l4-controls] Cloud Connector is one of the ways to forward traffic to the Zero Trust Exchange, alongside Zscaler Client Connector, Branch Connector, and PAC files, GRE tunnels and IPSec tunnels (the last three for Internet & SaaS only). [cloud-connector.overview:onramps]

**Reference architectures.** The Azure workloads reference architecture lists Cloud Connector as available as a virtual appliance in AWS and Microsoft Azure and as VMs for on-premises deployment, and that it enforces a security policy for cloud-to-cloud traffic; the Cloud Connector groups page says groups are created when deploying in AWS, Azure or GCP. [cloud-connector.overview:reference-architecture-azure] The Branch Connector reference architecture says Branch Connector starts from a Zero Trust approach to the branch using the SASE model, leveraging ZIA and ZPA so users gain access to applications, not networks. [cloud-connector.overview:branch-connector-model]

**Configuration guide.** The Cloud Connector step-by-step guide orders configuration as: administrators and roles, provisioning template, locations, Cloud Connector VM deployment, firewall filtering, gateways, forwarding methods, then analytics. [cloud-connector.overview:config-step-order] [gap:cloud-connector.overview:template-before-locations] The guide says provisioning templates create the provisioning URLs used to deploy a Cloud Connector as a VM. [cloud-connector.overview:provisioning-template-urls] The guide says firewall filtering policies are made of source IP groups, destination IP groups, IP pools and network services. [cloud-connector.overview:firewall-filtering-components]

## How it is built and kept running

- **Groups.** Connectors are managed, scaled and upgraded as groups: [Cloud Connector groups: what they are for, autoscaling names, status and disabling](kb:cloud-connector.overview.groups); upgrades: [Cloud & Branch Connector software upgrades: weekly window, stagger and release channels](kb:cloud-connector.upgrades).
- **Load balancing.** Cloud load balancers probe each Connector and route around unhealthy ones: [How cloud load balancers spread traffic across Cloud Connectors and take unhealthy ones out](kb:cloud-connector.overview.load-balancing).
- **Tunnels to Zscaler.** Primary, secondary and tertiary Service Edges, fail-close and fail-open, and Private Access enrollment: [Cloud Connector tunnels to Service Edges: primary, secondary, tertiary, fail-close and fail-open](kb:cloud-connector.overview.gateway-failover).
- **Interfaces and flows.** The management and service interfaces and the flows each carries: [Cloud Connector management and service interfaces: which flows each carries](kb:cloud-connector.overview.network-flows).
- **Locations.** Locations created from location templates: [Cloud & Branch Connector locations and location templates: automatic creation, the default template and template settings](kb:cloud-connector.overview.locations).
- **Zero Trust Gateways.** The Zscaler-managed alternative to running Connector VMs: [Zero Trust Gateways versus Cloud Connectors: who runs what, and where it is available](kb:cloud-connector.overview.zero-trust-gateways), with GCP detail in [GCP Zero Trust Gateway: managed service boundary and restrictions](kb:cloud-connector.gcp-ztg).
- **Regions.** Three different region lists: [Cloud & Branch Connector regions: three region lists that must not be conflated](kb:cloud-connector.regions).

## Deploying in each cloud

- **AWS.** Traffic steering, Gateway Load Balancer and autoscaling: [Cloud Connector on AWS: steering workload traffic by route table, ENI or GWLB endpoint](kb:cloud-connector.aws.traffic-steering), [Cloud Connector behind AWS Gateway Load Balancer: target group, health probe, stickiness, cross-zone](kb:cloud-connector.aws.gwlb), [Cloud Connector Auto Scaling groups on AWS: scaling metric, policy, capacity limits](kb:cloud-connector.aws.autoscaling).
- **Azure.** [Cloud Connector on Azure: deployment methods, prerequisites and provisioning](kb:cloud-connector.azure).
- **GCP.** [Cloud Connector on GCP: deployment, service accounts and network shape](kb:cloud-connector.gcp).
- **Branch and SD-WAN devices.** [Zero Trust SD-WAN: what Zscaler means by it and what the sources leave open](kb:cloud-connector.sdwan).
- **Users on shared virtual desktops.** The multi-session Windows agent that tunnels to a Connector: [Client Connector for VDI: the multi-session Windows agent that tunnels users' traffic to Cloud and Branch Connector](kb:cloud-connector.vdi).
- **A Connector that never registers.** AWS: [Cloud Connector on AWS: provisioning template, URL, Secrets Manager credentials, user data](kb:cloud-connector.aws.provisioning) and [Troubleshooting Cloud Connector on AWS: not registering, inactive, no tunnel, no Private Access](kb:cloud-connector.aws.troubleshooting); Azure: [For a deployed Cloud Connector that does not appear in the Admin Console, Help's checks include user data and Key Vault entries (api-key, username, password, provisioning URL format), Get and List on the Key Vault for the user-managed identity, and the identity's privilege to enumerate network interfaces: Network Contributor or Microsoft.Network/networkInterfaces/read, with a scope that includes the appliance.](kb:cloud-connector.azure:missing-from-console-checks); GCP's credentials and service accounts: [Cloud Connector on GCP: deployment, service accounts and network shape](kb:cloud-connector.gcp).

## Policy

- **Traffic forwarding.** Which rule sends a flow to ZIA, ZPA, direct, drop or local: [Cloud Connector traffic forwarding](kb:cloud-connector.forwarding).
- **DNS.** DNS policies and gateways: [Cloud & Branch Connector DNS handling: DNS policies and DNS gateways](kb:cloud-connector.dns).
- **Workloads and sources.** Tag-based workload discovery and source IP groups: [AWS workload discovery for Cloud Connector: what it is and how the pieces fit](kb:cloud-connector.workload-discovery), [Cloud Connector source IP groups: what they are and what is unknown about them](kb:cloud-connector.source-ip-groups); on the ZIA side, Connector traffic arrives at workload locations and can be scoped by workload groups: [AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace)](kb:zia.locations.workload-scopes), [ZIA Workload Groups: scoping rules to cloud workloads](kb:zia.workload-groups).

## Visibility

- **Logs.** Log records, and their path to a SIEM through NSS virtual appliances: [Cloud Connector logs: which log types exist and where to read them](kb:cloud-connector.logs), [NSS for Cloud & Branch Connector: how connector logs reach a SIEM](kb:cloud-connector.nss-va).
- **Monitoring.** Insights and Connector status: [Monitoring Cloud Connectors: which surface answers which question](kb:cloud-connector.insights).

## Administration

- **Admin roles.** The default super admin and the permission categories: [Cloud & Branch Connector admin roles: super admin, the eleven permission categories and Unified RBAC](kb:shared.admin-rbac.cloud-connector).
- **Admin sign-in.** SAML SSO for admins and the Okta, Azure AD and AD FS settings: [SAML SSO for Cloud & Branch Connector admins: IdP-initiated sign-in, the break-glass super admin and the Okta, Azure AD and AD FS settings](kb:cloud-connector.admin-sso).
- **Audit logs.** The console's record of admin sign-ins and changes: [Cloud & Branch Connector audit logs in the console: what is recorded, retention, lockout, filters and CSV](kb:cloud-connector.audit-logs).
- **Support access.** Remote assistance for Zscaler Support and the zssupport tunnel: [Zscaler Support access to Cloud & Branch Connector: Admin Console remote assistance and the zssupport tunnel into connector VMs](kb:cloud-connector.support-access).

## Automation

- **API.** [The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes](kb:cloud-connector.api).
- **SDKs.** [What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation](kb:cloud-connector.sdk-go.coverage), [Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects](kb:cloud-connector.sdk-go.service-defects), [What the Python SDK's ZTW modules cover beyond the Go SDK, and where they stop](kb:cloud-connector.sdk-python.coverage).
- **Terraform.** [What the ZTC Terraform provider covers, and how existing objects are imported](kb:cloud-connector.terraform.coverage), [ZTC Terraform provider: configuration, field handling and read behavior](kb:cloud-connector.terraform.provider-behavior), [How the ZTC (Cloud Connector) Terraform provider applies rule order](kb:cloud-connector.terraform.rule-order).

What to check:
1. For a Connector that never registers after deployment, the cloud's provisioning inputs first: a provisioning template for that cloud and its URL in the deployment, an autoscaling template only for an autoscaling deployment, the credentials secret, and the instance identity's permissions to read it.

Not known (open gaps):
- Must the provisioning template be configured before locations? [gap:cloud-connector.overview:template-before-locations]: settled by lab-test

Area: cloud-connector.overview, its subjects in references/_meta/spine/cloud-connector/cloud-connector.overview.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/cloud-connector/cloud-connector.forwarding.md (Cloud Connector traffic forwarding): Traffic Forwarding forwards selected traffic to specific destinations: through Internet & SaaS or Private Access, bypassing them for a portion of workload traffic, or dropping selected workload traffic, configured as rules. [cloud-connector.forwarding:purpose]
- logged-in references/_meta/text/cloud-connector/cloud-connector.logs.md (Cloud Connector logs: which log types exist and where to read them): Cloud & Branch Connector logs are stored for 180 days in the Zscaler Nanolog servers. [cloud-connector.logs:nanolog-180]
- scoped-by references/_meta/text/cloud-connector/cloud-connector.overview.groups.md (Cloud Connector groups: what they are for, autoscaling names, status and disabling): Groups let you apply policies to a set of deployed Cloud Connectors and upgrade the Cloud Connectors in a group while keeping redundancy during the upgrade. [cloud-connector.overview.groups:group-purpose]
- links-to references/_meta/text/cloud-connector/cloud-connector.azure.md (Cloud Connector on Azure: deployment methods, prerequisites and provisioning)
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp.md (Cloud Connector on GCP: deployment, service accounts and network shape)
- depends-on references/_meta/text/cloud-connector/cloud-connector.api.provisioning-wire.md (Cloud Connector provisioning URLs on the wire: what the template sets, VM size and cloud provider fields): The cloud provisioning URL is a prerequisite for deploying Cloud Connector as a VM in AWS, Azure and GCP, and is obtained by configuring a provisioning template; the same URL can be used multiple times. [cloud-connector.api.provisioning-wire:url-prerequisite]
- decided-by references/_meta/text/cloud-connector/cloud-connector.dns.policies.md (Cloud & Branch Connector DNS policies: scope, criteria, actions, predefined rules): DNS policies monitor and apply policy to all DNS requests and responses whatever the protocol and encryption, including UDP, TCP and DNS over HTTPS (DoH). [cloud-connector.dns.policies:scope-doh]
- links-to references/_meta/text/cloud-connector/cloud-connector.admin-sso.md (SAML SSO for Cloud & Branch Connector admins: IdP-initiated sign-in, the break-glass super admin and the Okta, Azure AD and AD FS settings)
- links-to references/_meta/text/cloud-connector/cloud-connector.api.md (The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes)
- links-to references/_meta/text/cloud-connector/cloud-connector.audit-logs.md (Cloud & Branch Connector audit logs in the console: what is recorded, retention, lockout, filters and CSV)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.autoscaling.md (Cloud Connector Auto Scaling groups on AWS: scaling metric, policy, capacity limits)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.gwlb.md (Cloud Connector behind AWS Gateway Load Balancer: target group, health probe, stickiness, cross-zone)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.provisioning.md (Cloud Connector on AWS: provisioning template, URL, Secrets Manager credentials, user data)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.traffic-steering.md (Cloud Connector on AWS: steering workload traffic by route table, ENI or GWLB endpoint)
- links-to references/_meta/text/cloud-connector/cloud-connector.aws.troubleshooting.md (Troubleshooting Cloud Connector on AWS: not registering, inactive, no tunnel, no Private Access)
- links-to references/_meta/text/cloud-connector/cloud-connector.dns.md (Cloud & Branch Connector DNS handling: DNS policies and DNS gateways)
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.md (GCP Zero Trust Gateway: managed service boundary and restrictions)
- links-to references/_meta/text/cloud-connector/cloud-connector.insights.md (Monitoring Cloud Connectors: which surface answers which question)
- links-to references/_meta/text/cloud-connector/cloud-connector.nss-va.md (NSS for Cloud & Branch Connector: how connector logs reach a SIEM)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.gateway-failover.md (Cloud Connector tunnels to Service Edges: primary, secondary, tertiary, fail-close and fail-open)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.load-balancing.md (How cloud load balancers spread traffic across Cloud Connectors and take unhealthy ones out)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.locations.md (Cloud & Branch Connector locations and location templates: automatic creation, the default template and template settings)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.network-flows.md (Cloud Connector management and service interfaces: which flows each carries)
- links-to references/_meta/text/cloud-connector/cloud-connector.overview.zero-trust-gateways.md (Zero Trust Gateways versus Cloud Connectors: who runs what, and where it is available)
- links-to references/_meta/text/cloud-connector/cloud-connector.regions.md (Cloud & Branch Connector regions: three region lists that must not be conflated)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.coverage.md (What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.service-defects.md (Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-python.coverage.md (What the Python SDK's ZTW modules cover beyond the Go SDK, and where they stop)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdwan.md (Zero Trust SD-WAN: what Zscaler means by it and what the sources leave open)
- links-to references/_meta/text/cloud-connector/cloud-connector.source-ip-groups.md (Cloud Connector source IP groups: what they are and what is unknown about them)
- links-to references/_meta/text/cloud-connector/cloud-connector.support-access.md (Zscaler Support access to Cloud & Branch Connector: Admin Console remote assistance and the zssupport tunnel into connector VMs)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.coverage.md (What the ZTC Terraform provider covers, and how existing objects are imported)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-behavior.md (ZTC Terraform provider: configuration, field handling and read behavior)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.rule-order.md (How the ZTC (Cloud Connector) Terraform provider applies rule order)
- links-to references/_meta/text/cloud-connector/cloud-connector.upgrades.md (Cloud & Branch Connector software upgrades: weekly window, stagger and release channels)
- links-to references/_meta/text/cloud-connector/cloud-connector.vdi.md (Client Connector for VDI: the multi-session Windows agent that tunnels users' traffic to Cloud and Branch Connector)
- links-to references/_meta/text/cloud-connector/cloud-connector.workload-discovery.md (AWS workload discovery for Cloud Connector: what it is and how the pieces fit)
- links-to references/_meta/text/shared/shared.admin-rbac.cloud-connector.md (Cloud & Branch Connector admin roles: super admin, the eleven permission categories and Unified RBAC)
- links-to references/_meta/text/zia/zia.locations.workload-scopes.md (AWS workload sublocation scopes (VPC endpoint, VPC, account, namespace))
- links-to references/_meta/text/zia/zia.workload-groups.md (ZIA Workload Groups: scoping rules to cloud workloads)
