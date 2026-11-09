# Troubleshooting Client Connector for VDI: registration, authentication and data-path causes and actions (cloud-connector.vdi.troubleshooting)
Also called: client connector for vdi troubleshooting; vdi location fetch errors; vdi registration failing; vdi authentication failing

The vendor's troubleshooting article groups causes into registration, authentication and data-path tables; its flow charts are images and are not captured [gap:cloud-connector.vdi.troubleshooting:location-fetch-and-charts]. Session insights, which one row points to, are in [Cloud Connector Insights pages and Insights logs: time range, aggregation and limits](kb:cloud-connector.insights.analytics).

## Registration

- **Location fetch errors.** In the registration table, location fetch errors in Client Connector for VDI can occur for multiple reasons, and the action is to collect its logs and contact Zscaler Support. [cloud-connector.vdi.troubleshooting:registration-location-fetch]
- **Service interface.** In the registration table, when the Cloud & Branch Connector service interface is unreachable or Cloud & Branch Connector is displayed inactive, the action is to test whether the service interface is reachable with and without Client Connector for VDI. [cloud-connector.vdi.troubleshooting:registration-service-interface]
- **Onboard parameter.** In the registration table, when the onboard parameter is not set, the action is to set the onboarding behavior to 1 or 0; the default is 1, which allows Client Connector for VDI to onboard itself to the Workload Communications (WLC) tenant. [cloud-connector.vdi.troubleshooting:registration-onboard] The parameter is described in [Installing Client Connector for VDI: download, MSI options, golden images, OnboardOnStart, Intune and processes to allowlist](kb:cloud-connector.vdi.install).
- **Route to the VIP.** In the registration table, when routing is not configured for 185.46.212.80, the action is to ensure a route for that destination points toward the Cloud Connector, Branch Connector or a load balancer; by default Client Connector for VDI connects to 185.46.212.80. [cloud-connector.vdi.troubleshooting:registration-vip-route]

## Authentication

- **Roaming profile.** In the authentication table, when the VDI environment completes a backup and restoration of the roaming profile, Client Connector for VDI stores and reads the user configuration file in the roaming profile; if the VM loads more slowly than Client Connector for VDI, a timeout issue might occur, and the action is to configure CONFIGREADTIMEOUT so it waits a minimum of 0 and a maximum of 300 seconds for profiles to restore. The MSI install-options article says CONFIGREADTIMEOUT is only supported on Client Connector for VDI version 1.1.0.8 and later. [cloud-connector.vdi.troubleshooting:auth-roaming-profile]
- **IWA.** In the authentication table, the article says IWA relies on browser and/or Internet settings, so the configured settings are reviewed against the Microsoft documentation. [cloud-connector.vdi.troubleshooting:auth-iwa]
- **Bypasses.** In the authentication table, the actions are to ensure the backup and restore IP addresses are bypassed; to ensure all FSLogix IP addresses are bypassed; when Client Connector for VDI cannot reach the identity provider, to ensure there is a bypass from the Zscaler Admin Console and FQDN bypasses from the Cloud Connector; and to ensure all Zscaler authentication domains are bypassed. [cloud-connector.vdi.troubleshooting:auth-bypasses] The profile's bypass entries are in [VDI forwarding profiles: include and exclude lists, refresh, Private Access and DNS inclusion, Azure, FSLogix and Citrix bypasses](kb:cloud-connector.vdi.forwarding-profiles).
- **Wrong user.** In the authentication table, when the correct user is not shown at ip.zscaler.com, the action is to ensure that all bypasses and authentications are functioning, and to collect packet captures and ensure that traffic is tunneled properly. [cloud-connector.vdi.troubleshooting:auth-wrong-user]

## Internet & SaaS data path

In the Internet & SaaS data-path table, a cause is that the incorrect tunnel mode is configured; an action cell states that A2A tunneling mode is not recommended and is being deprecated; other actions include reviewing the Cloud Connector session insights to verify whether the traffic is forwarded to Internet & SaaS, ensuring workload routes send the traffic to Cloud Connector and the traffic forwarding rule sends it to Internet & SaaS, and, for an incorrect policy, checking the Internet & SaaS insights logs and matching them with the rule preceding the correct rule. [cloud-connector.vdi.troubleshooting:internet-data-path]

## Private Access data path

In the Private Access data-path table, SMB, Kerberos, Windows network, DNS, ICMP and NFS traffic are treated as system user traffic by Client Connector for VDI, so Private Access needs a correct access policy for the system user; the article says this is a Windows limitation, not a Zscaler limitation. [cloud-connector.vdi.troubleshooting:private-system-traffic] In the Private Access data-path table, the access policy is configured with the client type Client Connector for VDI; if the access policy contains user attributes, SCIM must be enabled, and the article adds that SAML is not supported. [cloud-connector.vdi.troubleshooting:private-access-policy] Which part SAML is not supported for is open [gap:cloud-connector.vdi.troubleshooting:saml-scope]. In the Private Access data-path table, the actions are to ensure workload routes send the traffic to Cloud Connector and the traffic forwarding rule sends traffic to Private Access, to ensure the VDI forwarding policy includes the synthetic IP pools in the Include list, and to ensure Cloud Connector is seeing DNS requests and able to match them to the Private Access application or FQDN. [cloud-connector.vdi.troubleshooting:private-routing-dns-pool]

Not known (open gaps):
- Location fetch error causes and the troubleshooting flow charts [gap:cloud-connector.vdi.troubleshooting:location-fetch-and-charts]: settled by support-ticket or source-read
- What SAML is not supported for in the Private Access access policy row [gap:cloud-connector.vdi.troubleshooting:saml-scope]: settled by support-ticket or lab-test

Area: cloud-connector.vdi, its subjects in references/_meta/spine/cloud-connector/cloud-connector.vdi.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.insights.analytics.md (Cloud Connector Insights pages and Insights logs: time range, aggregation and limits)
- links-to references/_meta/text/cloud-connector/cloud-connector.vdi.forwarding-profiles.md (VDI forwarding profiles: include and exclude lists, refresh, Private Access and DNS inclusion, Azure, FSLogix and Citrix bypasses)
- links-to references/_meta/text/cloud-connector/cloud-connector.vdi.install.md (Installing Client Connector for VDI: download, MSI options, golden images, OnboardOnStart, Intune and processes to allowlist)
