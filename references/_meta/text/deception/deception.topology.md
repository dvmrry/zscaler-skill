# Topology: subnets and interfaces, aggregator sinkholes, ZPA App Connectors and Windows high-interaction VM credentials (deception.topology)

A subnet or VLAN must first be passed to one of the decoy interfaces on the Decoy Connector VM before it is configured in Deception. [deception.topology:subnet-prerequisite] The VLAN ID field is the ID of the VLAN trunked to the selected Decoy Connector NIC and is left blank if the VLAN is untagged or no VLAN is trunked to the interface. [deception.topology:subnet-vlan-id] Gateway/Mask takes the gateway in <Gateway-IP>/<CIDR> form (for example 192.0.2.1/24 or 192.0.2.1/255.255.255.0) and is not required when DHCP is enabled; IPv6 Gateway/Mask takes <Gateway-IPv6>/<CIDR> and is not required when IPv6 DHCP is enabled; IPv6 Enabled allows decoys in IPv6 networks, and DNS Servers is optional. [deception.topology:subnet-addressing] Hub: [Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated](kb:deception.overview).

**Subnet menu path.** The Configuring a Subnet article gives the path as Settings > Interfaces. [deception.topology:interfaces-path-short] The edit/delete subnet article gives the path as Settings > Topology > Interfaces. [deception.topology:interfaces-path-topology]

**Subnet files and managed subnets.** Subnet configuration can be downloaded as a CSV via Config > Download Config and re-uploaded via Config > Upload Config to add several subnets at once. [deception.topology:subnet-csv] Private Access (ZPA) and Threat Intelligence (TI) subnets used to deploy decoys in the Deception cloud cannot be edited or deleted by the customer; Zscaler Support manages them. [deception.topology:subnet-managed-readonly]

**Aggregator sinkholes.** When attackers connect to a decoy, they have no outbound access from it to other systems on the network or the internet; a sinkhole on an aggregator is a single point permitting outbound access from decoys to a few specified IP addresses and ports, for example for AD authentication, C2 traffic analysis or lateral movement in lab environments. [deception.topology:sinkhole-purpose] A sinkhole is configured per aggregator under Settings > Topology > Aggregators with Enabled, a network, an IP within that network segment, and outbound rules of an IP address or CIDR list plus a port. [deception.topology:sinkhole-config]

**ZPA App Connectors.** ZPA App Connectors are hosted by Zscaler, are configured when creating Zero Trust Network decoys, and give a secure interface between the Decoy Connector and the Zero Trust Exchange. [deception.topology:zpa-app-connectors] The ZPA App Connectors page shows ZPA Version (App Connector software), ZPA Manager Version, last connected time to the Deception Admin Portal and ZPA App Connector last connected time to the Private Access cloud. [deception.topology:zpa-app-connectors-columns] What the Version column means for an App Connector is open [gap:deception.topology:app-connector-version]. ZPA App Connector debug logs: recent debug logs are the last 1,000 lines from each log file, all debug logs are the complete log files, the App Connector must be connected to the Admin Portal first, and the download is a .tar.xz file. [deception.topology:zpa-app-connector-debug-logs] A ZPA App Connector can be rebooted from Actions > Reboot, and its update logs are viewed by clicking Logs and selecting View update logs. [deception.topology:zpa-app-connector-actions] Whether the customer configures App Connectors is disputed [divergence:deception.topology:app-connector-ownership].

**Windows high-interaction VM.** Windows high-interaction VMs support Windows Server 2016, 2019 and 2022; credentials are entered as username,password with no spaces and can take up to 30 minutes to be configured by the landmine agent. [deception.topology:windows-hi-vm-credentials] The landmine agent is in [Landmine agent and agentless: install, requirements, proxies, management and OS feature support](kb:deception.landmine-agents).

What to check:
1. Whether the subnet or VLAN was passed to a decoy interface on the Decoy Connector VM before it was configured in Deception.
2. Which menu path an article gives for the subnet page, since Configuring a Subnet says Settings > Interfaces and Editing or Deleting a Subnet says Settings > Topology > Interfaces.
3. Whether a ZPA or TI subnet is being edited by the customer, since those subnets are managed by Zscaler Support.

Sources disagree (name both sides):
- The reboot article describes an App Connector the customer configured in the Admin Portal; the connect article says the customer cannot add or connect App Connectors. [divergence:deception.topology:app-connector-ownership]
  - zscaler-help: A Private Access App Connector is one that you configured in the Admin Portal.
  - zscaler-help: App Connectors and TI Decoy Connectors cannot be added or connected to the Admin Portal by the customer.
  Impact: An answer about whether the customer can configure, add or connect an App Connector cannot be settled from these two pages; the Admin Portal page for ZPA App Connectors says they are configured when creating Zero Trust Network decoys.

Not known (open gaps):
- What the Version column means for a ZPA App Connector [gap:deception.topology:app-connector-version]: settled by lab-test or source-read

Area: deception.topology, its subjects in references/_meta/spine/deception/deception.topology.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/deception/deception.landmine-agents.md (Landmine agent and agentless: install, requirements, proxies, management and OS feature support)
- links-to references/_meta/text/deception/deception.overview.md (Zscaler Deception: decoys and lures, the Private Access integration, roles, and what can be automated)
