# Authentications and the on-premises Zscaler gateway for Agentic SecOps Platform data sources and outegrations (unified.secops-platform.data.authentication-gateway)
Also called: authentications page; zscaler gateway; reverse ssh tunnel; zscaler-gateway.sh

## Authentications

An authentication can be created during data source or outegration setup (in the Retrieval section, or the Details section of the Connect step) or directly from the Authentications page. [unified.secops-platform.data.authentication-gateway:auth-where-created] An authentication can be reused across multiple integrations as long as it has the required access permissions; missing or insufficient scopes can cause failed authentication or incomplete data ingestion. [unified.secops-platform.data.authentication-gateway:auth-reuse-scopes] The authentication Name is displayed on the integration setup page, so it should identify the specific authentication instance; the page's example is CrowdStrike Vulnerabilities for the Vulnerabilities stream. [unified.secops-platform.data.authentication-gateway:auth-name]

**Managing them.** The Authentications page shows each authentication's name, vendor, an In Use count of the data sources and outegrations using it, who created it, when it was last updated and who updated it last. [unified.secops-platform.data.authentication-gateway:auth-list-columns] The Authentications page offers Edit and Delete actions, and the help warns that careless management can cause service disruptions, failed data ingestion or access issues. [unified.secops-platform.data.authentication-gateway:auth-actions] Access to authentications requires a role with the Read, Create, Edit and Delete permissions under the Platform - Authentications resource. [unified.secops-platform.data.authentication-gateway:auth-role]

## The Zscaler gateway

The Zscaler gateway connects on-premises outegrations and data sources to the platform at the account level, and is selected in the Retrieval section when creating a data source or in the Details section of the Jira Data Center outegration. [unified.secops-platform.data.authentication-gateway:gw-purpose] The gateway page names only Jira Data Center among outegrations, but other connector guides also offer a gateway [divergence:unified.secops-platform.data.authentication-gateway:gw-connector-list] [gap:unified.secops-platform.data.authentication-gateway:gw-connector-scope].

**The VM.** The gateway VM should run Ubuntu, Red Hat Enterprise Linux, Centos or Amazon-Linux. [unified.secops-platform.data.authentication-gateway:gw-vm-os] The gateway VM needs at least 2 vCPUs and 4 GB of RAM, must listen on port 22 for incoming SSH connections, and should be deployed in a private subnet with a dedicated vNIC. [unified.secops-platform.data.authentication-gateway:gw-vm-size] [divergence:unified.secops-platform.data.authentication-gateway:gw-vm-network] The gateway VM must be dedicated to running the reverse SSH tunnel rather than a local computer, and the on-premises service must be reachable from it. [unified.secops-platform.data.authentication-gateway:gw-vm-dedicated]

**Setup.** Gateway setup: the customer shares the public SSH key, VM public IP and gateway IP addresses with Zscaler; Zscaler creates a representative instance; the customer reruns the script to establish the reverse SSH tunnel; Zscaler then sets up the gateway in the platform. [unified.secops-platform.data.authentication-gateway:gw-flow] The zscaler-gateway.sh script checks for an existing SSH key pair and creates one if none exists, installs autossh if needed, and configures a service to establish the reverse SSH tunnel. [unified.secops-platform.data.authentication-gateway:gw-script] The step bodies and the script are not in the capture [gap:unified.secops-platform.data.authentication-gateway:gw-steps-not-captured].

**Troubleshooting.** A 'Host key verification failed' error during gateway setup typically means the Zscaler gateway has not yet been authorized for its initial SSH connection; the documented fix is to authorize the server with an ssh command using StrictHostKeyChecking=no, run as the user that created the service under /etc/systemd/system/. [unified.secops-platform.data.authentication-gateway:gw-hostkey]

Sources disagree (name both sides):
- The gateway page lists only the Jira Data Center outegration among outegrations that select a gateway; the Tenable Security Center outegration guide and the Aqua Security connector guide also have a Gateway field. [divergence:unified.secops-platform.data.authentication-gateway:gw-connector-list]
  - zscaler-help: Among outegrations, the gateway page names Jira Data Center as the one that selects a gateway.
  - zscaler-help: The Tenable outegration guide has a Gateway field for Tenable Security Center.
  - zscaler-help: The Aqua Security connector guide has a Gateway field.
  Impact: Do not give Jira Data Center as the only connector that accepts a gateway.
- The gateway page says to deploy the VM in a private subnet and also has the customer share the VM's public IP address with Zscaler. [divergence:unified.secops-platform.data.authentication-gateway:gw-vm-network]
  - zscaler-help: The instance is deployed in a private subnet.
  - zscaler-help: The VM's public IP address is shared with Zscaler.
  Impact: The page does not say how a VM in a private subnet has the public IP it shares; do not state the VM's network placement beyond the quoted lines.

Not known (open gaps):
- Which connectors can use the Zscaler gateway [gap:unified.secops-platform.data.authentication-gateway:gw-connector-scope]: settled by source-read
- Gateway setup steps 1 to 5 and the zscaler-gateway.sh script body [gap:unified.secops-platform.data.authentication-gateway:gw-steps-not-captured]: settled by source-read

Area: unified.secops-platform, its subjects in references/_meta/spine/unified/unified.secops-platform.json
