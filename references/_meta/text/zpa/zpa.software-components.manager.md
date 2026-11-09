# The Manager software and its updates on ZPA software components (zpa.software-components.manager)
Also called: manager software; zpa-connector-child; zpa-service-edge-child; zpa-pcc-child; np-connector-child; manager update failure; manager update column

The Manager is the software on each software component VM that supervises the component's own software.

**Services.** The VMs run a service called zpa-connector for App Connectors, zpa-service-edge for Private Service Edges, zpa-pcc for Private Cloud Controllers and np-connector for Network Connectors; this Manager software supervises and controls the child software (zpa-connector-child, zpa-service-edge-child, zpa-pcc-child and np-connector-child respectively), which it downloads and which establishes Microtunnels (M-Tunnels) and talks to the internal applications. [zpa.software-components.manager:services] App Connector upgrades mean upgrading the zpa-connector-child software, Private Service Edge upgrades the zpa-service-edge-child software, Private Cloud Controller upgrades the zpa-pcc-child software and Network Connector upgrades the np-connector-child software. [zpa.software-components.manager:component-upgrade-is-child] The scheduled child-software update for App Connectors is in [App Connector software and host OS updates](kb:zpa.app-connectors.upgrades).

**Trust and upgrades.** The Manager software uses the OS trusted Certificate Authority (CA) bundle to establish the TLS connection that downloads software. The article gives the path /etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem and, to update the CentOS CA bundle, sudo update-ca-trust. [zpa.software-components.manager:ca-bundle] Whether the CentOS path applies to current images is open [gap:zpa.software-components.manager:ca-bundle-rhel9]. With Linux software packages the Manager software must be upgraded manually in the software component's console. The article's first command upgrades all software packages on the server, including the Manager software; a command naming one package (for example sudo yum upgrade zpa-connector) also includes the Manager upgrade. The Manager software is also included in upgrades to the host operating system, which the article describes with sudo yum update -y. [zpa.software-components.manager:manager-upgrade]

**When an automated update fails.** The article on troubleshooting Manager software and OS updates requires a minimum Manager software version of 25.46.3 and a minimum App Connector, Private Service Edge, Private Cloud Controller or Network Connector software version of 25.46.3. Failed updates are found by results with Failure in the Software Update or Manager Update columns, or with the filter options above the table. [zpa.software-components.manager:troubleshooting-minimums] The update troubleshooting steps check the Available column for free disk space, where less than 150MB is limited space, and the general RAM statistics with the free command (total, used, free and cached memory). [zpa.software-components.manager:disk-and-ram] The further update troubleshooting steps include verifying a broken package dependency, yum remove --oldinstallonly, yum clean all, considering kill -9 on the process that holds the yum lock (found with lsof /var/run/yum.pid or cat /var/run/yum.pid) if the lock is not released, and for the RPM database error rpm -v --rebuilddb. [zpa.software-components.manager:yum-and-rpm]

The service names as they appear in OAuth enrollment troubleshooting are in [OAuth 2.0 enrollment for ZPA software components and its troubleshooting](kb:zpa.software-components.oauth-enrollment). The other shared subjects are under [ZPA software components: Manager software, OAuth enrollment, network settings and STIG images](kb:zpa.software-components).

What to check:
1. Which service and child process belong to the component type before reading its logs or restarting it.
2. Whether the Manager and component software are both at least 25.46.3 before using the update troubleshooting steps.
3. Free space on /var, RAM, yum dependencies, old kernels, caches, the yum lock and the RPM database for a failed update.

Not known (open gaps):
- Whether the CentOS CA bundle path applies to current images [gap:zpa.software-components.manager:ca-bundle-rhel9]: settled by lab-test or support-ticket

Area: zpa.software-components, its subjects in references/_meta/spine/zpa/zpa.software-components.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-connectors.upgrades.md (App Connector software and host OS updates)
- links-to references/_meta/text/zpa/zpa.software-components.md (ZPA software components: Manager software, OAuth enrollment, network settings and STIG images)
- links-to references/_meta/text/zpa/zpa.software-components.oauth-enrollment.md (OAuth 2.0 enrollment for ZPA software components and its troubleshooting)
