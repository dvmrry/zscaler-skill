# NSS servers: the VM record, its certificate, platforms and Nanolog capacity (shared.nss.servers)
Also called: nss server; nss vm; nss virtual appliance; nss certificate; nss deployment platforms; nanolog cluster capacity; 1 billion web transactions; nss mib

An NSS server is the representation of the NSS VM in the Admin Console; after a server is created, Zscaler issues a client certificate and private key to install on the NSS VM so that it can authenticate to the Zscaler service. [shared.nss.servers:server-record]

**Deploying it.** VM-based NSS requires a virtual appliance; deployment guides cover Amazon Web Services, Google Cloud Platform, Hyper-V, Microsoft Azure, Nutanix and VMware vSphere, and the architecture is the same whichever is used. [shared.nss.servers:appliance-platforms] Each platform's steps are in [Deploying the NSS VM on AWS, GCP, Azure, Hyper-V, Nutanix and vSphere](kb:shared.nss.vm-platforms). After deployment the NSS requires minimal administration and automatically polls the Zscaler service for updates and installs them. [shared.nss.servers:auto-update]

**Managing it.** The NSS Servers page lets an administrator add a server, deploy an NSS virtual appliance, download MIB files, and download or add an SSL certificate for a server; it lists each server's name, type, status and health state. [shared.nss.servers:servers-page] A new NSS server's Type has the NSS for Web type selected by default, and NSS for Firewall is selected to configure NSS for firewall logs; with Zscaler Cloud & Branch Connector, the NSS for Firewall type is displayed as NSS for Firewall, Cloud & Branch Connector. State is the health of the NSS server and cannot be configured. [shared.nss.servers:server-type-options] In the Edit NSS Server window, under the SSL Certificate field, an admin can either download the SSL certificate or generate a new certificate for that NSS server, and can upload the SSL certificate to the desired platform. [shared.nss.servers:certificate-regenerate] The New Client Certificate window has an optional Download Config for the configuration script of the new certificate, and an Upload Provisioning Blob choice of entering the blob data in the text field or uploading the blob file. [shared.nss.servers:new-client-certificate] The feeds a server carries are in [NSS feeds: limits, log types, filters and the output format string](kb:shared.nss.feeds).

**Capacity.** A Nanolog cluster is listed at 1 billion web transactions, beyond which additional Nanolog clusters are required; an NSS VM server takes 1 Nanolog cluster, so additional clusters require an adequate number of NSS VM servers. [shared.nss.servers:nanolog-capacity] A tenant whose web traffic needs more than one Nanolog cluster also needs at least one NSS VM server per cluster for a VM-based NSS export to cover all of it. [shared.nss.servers:scale-out]

Cloud & Branch Connector NSS deployments have their own server and feed limits: [NSS for Cloud & Branch Connector: how connector logs reach a SIEM](kb:cloud-connector.nss-va).

What to check:
1. Whether the NSS VM holds the client certificate issued for its server record.
2. For a high-volume tenant, how many Nanolog clusters it has, since each needs its own NSS VM server.

Inferred, not quoted (say so when an answer rests on one):
- [shared.nss.servers:scale-out] Tier B: Follows from one cluster per NSS VM server; the help does not say how a tenant's logs are divided between clusters or over what period the transaction count is measured.

Area: shared.nss, its subjects in references/_meta/spine/shared/shared.nss.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.nss-va.md (NSS for Cloud & Branch Connector: how connector logs reach a SIEM)
- links-to references/_meta/text/shared/shared.nss.feeds.md (NSS feeds: limits, log types, filters and the output format string)
- links-to references/_meta/text/shared/shared.nss.vm-platforms.md (Deploying the NSS VM on AWS, GCP, Azure, Hyper-V, Nutanix and vSphere)
