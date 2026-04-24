# Configuring Traffic Forwarding Rules (Cloud & Branch Connector)

**Source:** https://help.zscaler.com/cloud-branch-connector/configuring-traffic-forwarding-rule
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Zscaler Cloud & Branch Connector Help 
Forwarding 
Traffic Forwarding 
Configuring Traffic Forwarding Rules
Cloud & Branch Connector
Configuring Traffic Forwarding Rules
Ask Zscaler

Watch a video on Traffic Forwarding.

You can configure a traffic forwarding rule to forward select traffic to specific endpoints by different forwarding methods based on your requirements. You can forward specific traffic through Zscaler Internet Access (ZIA) or application traffic through Zscaler Private Access (ZPA). You can also use the direct, drop, or local forwarding methods to forward your traffic. The local forwarding method is only available for Cloud Connector and Zscaler Zero Trust Gateways.

To use traffic forwarding rules that use wildcard domains and/or FQDNs, design your network where workloads, servers, and endpoints are deployed to route DNS queries through the Cloud Connector or Branch Connector. If you are forwarding HTTP/HTTPS traffic, DNS is not required for wildcard domain and FQDN traffic. However, UDP and non-web traffic requires DNS to function.

Configuring Forwarding Rules Using ZIA

A default forwarding rule with a default gateway is predefined for ZIA. To configure rules to forward specific traffic through the ZIA gateway:

Go to Forwarding > Traffic Forwarding.

Click Add Traffic Forwarding Rule.

The Add Traffic Forwarding Rules window appears.

In the Add Traffic Forwarding Rules window:
In the Forwarding Rule section, configure the following:
Rule Order: Enter the order of the rule. Zscaler evaluates forwarding rules in ascending numerical order (Rule 1 before Rule 2, and so on). The rule order setting reflects this rule's place in the order. You can change the value based on your requirement.
Rule Name: Enter a user-friendly name for the rule. The forwarding control feature automatically creates a rule name, which you can change. The maximum length is 31 characters.
Rule Status: Enable this option to actively enforce the rule. If you disable this option, the service skips the rule and moves to the next one. However, the rule does not lose its place in the rule order.

Forwarding Method: From the drop-down menu, select the forwarding method to be used for this rule. Select ZIA. This method forwards internet-bound traffic that matches a ZIA rule to ZIA gateways over a configurable encrypted or unencrypted tunnel.

See image.

Close

In the Criteria section, configure the following:
General
Location/Sublocation: Select up to 8 locations or sublocations. If you do not select a location, the rule applies to all locations.

Cloud & Branch Connector Groups: Select up to 32 Cloud Connector or Branch Connector groups to apply this rule to. If you do not select a group, the rule applies to all Cloud Connector or Branch Connector groups.

See image.

Close

Close
Services
Network Services: Select any number of network services. If you do not select a network service, the rule applies to all network services.

Network Services Group: Select any number of predefined or custom network services groups. If you do not select a network services group, the rule applies to all network service groups.

See image.

Close

Close
Applications

Application Service Groups: Application service groups allow you to configure traffic forwarding rules based on the predefined application service groups that Zscaler provides. They also allow you to enforce condition-based actions on your network traffic, such as allowing or blocking traffic and forwarding traffic to specific destinations. Select items from the drop-down menu to use as criteria when configuring traffic forwarding rules:

Office365
Zoom
Webex
RingCentral
LogMeIn
BlueJeans
Amazon Web Services
Azure
GCP
Zscaler Cloud Endpoints
Talk_Desk

See image.

Close

Close
Source

Source IP Groups: Select any number of source IP address groups or App Connector source IP addresses. If a source IP address group is not selected, the rule applies to all source IP address groups.
Source IP Addresses: Enter source IP addresses in any of the following formats:
An individual IP address (e.g., 192.0.2.1)
A subnet (e.g., 192.0.2.0/24)
An IP address range (e.g., 192.0.2.1-192.0.2.5)

Source Workload Groups: Select any number of source workload groups, which are applied to security policies for your cloud workloads deployed on the public cloud service provider. They can be referenced as a source object for the Local, Direct, ZIA, and ZPA criteria. Firewall rules that forward traffic to the internet can include and extend to the forwarding policy. Source workload groups are only applicable to Cloud Connector traffic forwarding policies. To learn more about workload groups, see Understanding Workload Groups.

Source workload groups are only available if you have the workload discovery service enabled. To learn more about the workload discovery service, see Configuring Workload Discovery for Workloads in Amazon Web Services, Configuring the Workload Discovery Service for Microsoft Azure Accounts, and Configuring Workload Discovery for Workloads in Google Cloud Platform.

See image.

Close

Close
Destination
Destination IPv4 Groups: Select any number of destination IPv4 groups. If you do not select a destination IPv4 group, the rule applies to all destination IP address groups.

IP Address Or WildCard FQDN: If the domain has multiple destination IP addresses or if its IP addresses may change, enter IP addresses, wildcard domains, and/or fully qualified domain names (FQDNs). For IP addresses, you can enter individual IP addresses, subnets, or address ranges. If adding multiple items, press Enter after each entry. Your Cloud or Branch Connector does not allow you to distinguish between multi-home servers, which are the same destination IP hosts with more than one FQDN.

A wildcard domain is a record, specified by an asterisk, within DNS that matches requests for nonexistent domain names. An example is *.example.com. Examples of invalid wildcard domains are *abc.example.com and abs.*.example.com. Zscaler cannot match invalid items. FQDNs are the full name of a system. The hostname is a shortened version of the full name of the system. For example, venera.isi.edu is an FQDN and venera is a hostname. Wildcard domains and FQDNs are limited to 16K per organization and 8,000 per rule.

For wildcard domain or FQDN support, forward workload DNS traffic through the Cloud or Branch Connector.

See image.

Close

Close

In the Action section, configure the following:

Forward to Proxy Gateway: (Optional) From the drop-down menu, select a proxy gateway​​​.

WAN Selection: This field is set to None by default. If None is selected, the wide-area network (WAN) is set to the configuration selected in the Traffic Distribution section of Configuring a Branch Configuration Template. To distribute traffic evenly, select Balanced. To always forward the traffic via the best-performing WAN link, select Best Link.

WAN selection is only applicable when configuring a hardware device deployed in gateway mode. In the Cloud & Branch Connector group column, ensure that the Branch Connector group or location is only for devices deployed in gateway mode.

See image.

Close

(Optional) In the Description field, enter a description for the rule.
Click Save and activate the change.
Close
Configuring Forwarding Rules Using ZPA

The following default forwarding rules are predefined for ZPA:

ZPA Forwarding Rule with a default gateway is created when you are subscribed to the ZPA license.
ZPA Pool For Stray Traffic with the forwarding method set to Drop is automatically created with view-only access when you enable a ZPA server's SKU on your Cloud or Branch Connector.

To configure rules to forward application traffic through ZPA:

Go to Forwarding > Traffic Forwarding.

Click Add Traffic Forwarding Rule.

The Add Traffic Forwarding Rules window appears.

In the Add Traffic Forwarding Rules window:
In the Forwarding Rule section, configure the following:
Rule Order: Enter the order of the rule. Zscaler evaluates forwarding rules in ascending numerical order (Rule 1 before Rule 2, and so on). The rule order setting reflects this rule's place in the order. You can change the value based on your requirement.
Rule Name: Enter a user-friendly name for the rule. The forwarding control feature automatically creates a rule name, which you can change. The maximum length is 31 characters.
Rule Status: Enable this option to actively enforce the rule. If you disable this option, the service skips the rule and moves to the next one. However, the rule does not lose its place in the rule order.

Forwarding Method: Select the forwarding method to be used for this rule. Select ZPA. This method forwards the private application traffic that matches a ZPA rule to ZPA over an encrypted tunnel.

You cannot configure a forwarding gateway for ZPA. You can only use the default gateway as the forwarding gateway for ZPA.

See image.

Close

In the Criteria section, configure the following:
General
Location/Sublocation: Select up to 8 locations or sublocations. If you do not select a location, the rule applies to all locations.

Cloud & Branch Connector Groups: Select up to 32 Cloud Connector or Branch Connector groups to apply this rule to. If you do not select a group, the rule applies to all Cloud Connector or Branch Connector groups.

See image.

Close

Close
Source

Source IP Groups: Select any number of source IP address groups or App Connector source IP addresses. If you do not select a source IP address group, the rule applies to all source IP address groups.
Source IP Addresses: Enter source IP addresses in any of the following formats:
An individual IP address (e.g., 192.0.2.1)
A subnet (e.g., 192.0.2.0/24)
An IP address range (e.g., 192.0.2.1-192.0.2.5)

Source Workload Groups: Select any number of source workload groups, which are applied to security policies for your cloud workloads deployed on the public cloud service provider. They can be referenced as a source object for the Local, Direct, ZIA, and ZPA criteria. Firewall rules that forward traffic to the internet can include and extend to the forwarding policy. Source workload groups are only applicable to Cloud Connector traffic forwarding policies. To learn more about workload groups, see Understanding Workload Groups.

Source workload groups are only available if you have the workload discovery service enabled. To learn more about the workload discovery service, see Configuring Workload Discovery for Workloads in Amazon Web Services, Configuring the Workload Discovery Service for Microsoft Azure Accounts, and Configuring Workload Discovery for Workloads in Google Cloud Platform.

To prevent App Connector looping, exclude IP addresses that your App Connector device uses to open connections or include IP addresses of all non-App Connector devices.

See image.

Close

Close
Destination

Apply to All App Segments: Enable this setting to apply the traffic forwarding rule to all existing and future App Segments that are created. Disable this setting to configure the following settings:

Application Segments: Select the application segments to which to apply the traffic forwarding rule. There is no limit to how many you can select. If you do not select any segments, the rule is not applied to any segments.
Segment Groups: Select the segment groups to which to apply the traffic forwarding rule. There is no limit to how many you can select. If you do not select any groups, the rule is not applied to any groups.

See image.

Close

Close
In the Action section, configure the following:
Forward to ZPA Gateway: This field is set to Default Gateway and cannot be configured.

WAN Selection: This field is set to None by default. If None is selected, the wide-area network (WAN) is set to the configuration selected in the Traffic Distribution section of Configuring a Branch Configuration Template. To distribute traffic evenly, select Balanced. To always forward the traffic via the best-performing WAN link, select Best Link.

WAN selection is only applicable when configuring a hardware device deployed in gateway mode. In the Cloud & Branch Connector group column, ensure that the Branch Connector group or location is only for devices deployed in gateway mode.

See image.

Close

(Optional) In the Description field, enter a description for the rule.
Click Save and activate the change.
Close
Configuring Forwarding Rules Using Direct

To configure the forwarding rules to forward traffic directly to the destination server:

Go to Forwarding > Traffic Forwarding.

Click Add Traffic Forwarding Rule.

The Add Traffic Forwarding Rules window appears.

In the Add Traffic Forwarding Rules window:
In the Forwarding Rule section, configure the following:
Rule Order: Enter the order of the rule. Zscaler evaluates forwarding rules in ascending numerical order (Rule 1 before Rule 2, and so on). The rule order reflects this rule's place in the order. You can change the value based on your requirement.
Rule Name: Enter a user-friendly name for the rule. The forwarding control feature automatically creates a rule name, which you can change. The maximum length is 31 characters.
Rule Status: Enable this option to actively enforce the rule. If you disable this option, the service skips the rule and moves to the next one. However, the rule does not lose its place in the rule order.

Forwarding Method: Select the forwarding method to be used for this rule. Select Direct. This method bypasses ZIA/ZPA and forwards traffic directly to the destination server using the Zscaler service IP address.

See image.

Close

In the Criteria section, configure the following:
General
Location/Sublocation: Select up to 8 locations or sublocations. If you do not select a location, the rule applies to all locations.

Cloud & Branch Connector Groups: Select up to 32 Cloud Connector or Branch Connector groups to apply this rule to. If you do not select a group, the rule applies to all Cloud Connector or Branch Connector groups.

See image.

Close

Close
Services
Network Services: Select any number of network services. If you do not select a network service, the rule applies to all network services.

Network Services Group: Select any number of predefined or custom network services groups. If you do not select a network services group, the rule applies to all network service groups.

See image.

Close

Close
Application

Application Service Groups: Application service groups allow you to configure traffic forwarding rules based on the predefined application service groups that Zscaler provides. They also allow you to enforce condition-based actions on your network traffic, such as allowing or blocking traffic and forwarding traffic to specific destinations. Select items from the drop-down menu to use as criteria when configuring traffic forwarding rules:

Office365
Zoom
Webex
RingCentral
LogMeIn
BlueJeans
Amazon Web Services
Azure
GCP
Zscaler Cloud Endpoints
Talk_Desk

See image.

Close

Close
Source

Source IP Groups: Select any number of source IP address groups or App Connector source IP addresses. If you do not select a source IP address group, the rule applies to all source IP address groups.
Source IP Addresses: Enter source IP addresses in any of the following formats:
An individual IP address (e.g., 192.0.2.1)
A subnet (e.g., 192.0.2.0/24)
An IP address range (e.g., 192.0.2.1-192.0.2.5)

Source Workload Groups: Select any number of source workload groups, which are applied to security policies for your cloud workloads deployed on the public cloud service provider. They can be referenced as a source object for the Local, Direct, ZIA, and ZPA criteria. Firewall rules that forward traffic to the internet can include and extend to the forwarding policy. Source workload groups are only applicable to Cloud Connector traffic forwarding policies. To learn more about workload groups, see Understanding Workload Groups.

Source workload groups are only available if you have the workload discovery service enabled. To learn more about the workload discovery service, see Configuring Workload Discovery for Workloads in Amazon Web Services, Configuring the Workload Discovery Service for Microsoft Azure Accounts, and Configuring Workload Discovery for Workloads in Google Cloud Platform.

To prevent App Connector looping, exclude IP addresses that your App Connector device uses to open connections or include IP addresses of all non-App Connector devices.

See image.

Close

Close
Destination
Destination IPv4 Groups: Select any number of destination IPv4 groups. If you do not select a destination IPv4 group, the rule applies to all destination IP address groups.

IP Address Or WildCard FQDN: If the domain has multiple destination IP addresses or if its IP addresses may change, enter IP addresses, wildcard domains, and/or fully qualified domain names (FQDNs). For IP addresses, you can enter individual IP addresses, subnets, or address ranges. If adding multiple items, press Enter after each entry. Your Cloud or Branch Connector does not allow you to distinguish between multi-home servers, which are the same destination IP hosts with more than one FQDN.

A wildcard domain is a record, specified by an asterisk, within DNS that matches requests for nonexistent domain names. An example is *.example.com. Examples of invalid wildcard domains are *abc.example.com and abs.*.example.com. Zscaler cannot match invalid items. FQDNs are the full name of a system. The hostname is a shortened version of the full name of the system. For example, venera.isi.edu is an FQDN and venera is a hostname. Wildcard domains and FQDNs are limited to 16K per organization and 8,000 per rule.

For wildcard domain or FQDN support, forward workload DNS traffic through the Cloud or Branch Connector.

See image.

Close

Close

In the Action section, from the WAN Selection drop-down menu, None is set by default. If None is selected, the WAN is set to the configuration selected in the Traffic Distribution section of Configuring a Branch Configuration Template. Select Balanced for the traffic to be evenly distributed or select Best Link for the traffic to always be forwarded via the best-performing WAN link.

See image.

Close

WAN selection is only applicable when configuring a hardware device deployed in gateway mode. In the Cloud & Branch Connector group column, ensure that the Branch Connector group or location is only for devices deployed in gateway mode.

(Optional) In the Description field, enter a description for the rule.
Click Save and activate the change.
Close
Configuring Forwarding Rules Using Drop

To configure the forwarding rules to drop traffic:

Go to Forwarding > Traffic Forwarding.

Click Add Traffic Forwarding Rule.

The Add Traffic Forwarding Rules window appears.

In the Add Traffic Forwarding Rules window:
In the Forwarding Rule section, configure the following:
Rule Order: Enter the order of the rule. Zscaler evaluates forwarding rules in ascending numerical order (Rule 1 before Rule 2, and so on). The rule order reflects this rule's place in the order. You can change the value based on your requirement.
Rule Name: Enter a user-friendly name for the rule. The forwarding control feature automatically creates a rule name, which you can change. The maximum length is 31 characters.
Rule Status: Enable this option to actively enforce the rule. If you disable this option, the service skips the rule and moves to the next one. However, the rule does not lose its place in the rule order.

Forwarding Method: Select the forwarding method to be used for this rule. Select Drop. This method drops all traffic matching the configured forwarding rule. The Cloud or Branch Connector appliance discards packets matching the Drop rule. The discarded packets appear in the Sessions Logs of the Zscaler Cloud & Branch Connector Admin Portal.

See image.

Close

In the Criteria section, configure the following:
General
Location: Select up to 8 locations. If you do not select a location, the rule applies to all locations.

Cloud & Branch Connector Groups: Select up to 32 Cloud Connector groups to apply this rule to. If you do not select a group, the rule applies to all Cloud Connector groups.

See image.

Close

Close
Services
Network Services: Select any number of network services. If you do not select a network service, the rule applies to all network services.

Network Services Group: Select any number of predefined or custom network services groups. If you do not select a network services group, the rule applies to all network service groups.

See image.

Close

Close
Applications

Application Service Groups: Application service groups allow you to configure traffic forwarding rules based on the predefined application service groups that Zscaler provides. They also allow you to enforce condition-based actions on your network traffic, such as allowing or blocking traffic and forwarding traffic to specific destinations. Select items from the drop-down menu to use as criteria when configuring traffic forwarding rules:

Office365
Zoom
Webex
RingCentral
LogMeIn
BlueJeans
Amazon Web Services
Azure
GCP
Zscaler Cloud Endpoints
Talk_Desk

See image.

Close

Close
Source

Source IP Groups: Select any number of source IP address groups or App Connector source IP addresses. If you do not select a source IP address group, the rule applies to all source IP address groups.
Source IP Addresses: Enter source IP addresses in any of the following formats:
An individual IP address (e.g., 192.0.2.1)
A subnet (e.g., 192.0.2.0/24)
An IP address range (e.g., 192.0.2.1-192.0.2.5)

Source Workload Groups: Select any number of source workload groups, which are applied to security policies for your cloud workloads deployed on the public cloud service provider. They can be referenced as a source object for the Local, Direct, ZIA, and ZPA criteria. Firewall rules that forward traffic to the internet can include and extend to the forwarding policy. Source workload groups are only applicable to Cloud Connector traffic forwarding policies. To learn more about workload groups, see Understanding Workload Groups.

Source workload groups are only available if you have the workload discovery service enabled. To learn more about the workload discovery service, see Configuring Workload Discovery for Workloads in Amazon Web Services, Configuring the Workload Discovery Service for Microsoft Azure Accounts, and Configuring Workload Discovery for Workloads in Google Cloud Platform.

To prevent App Connector looping, exclude IP addresses that your App Connector device uses to open connections or include IP addresses of all non-App Connector devices.

See image.

Close

Close
Destination
Apply to All App Segments: Enable this setting to apply the traffic forwarding rule to all existing and future App Segments that are created. Disable this setting to configure the following settings:
Application Segments: Select the application segments to which to apply the traffic forwarding rule. There is no limit to how many you can select. If you do not select any segments, the rule is not applied to any segments.
Segment Groups: Select the segment groups to which to apply the traffic forwarding rule. There is no limit to how many you can select. If you do not select any groups, the rule is not applied to any groups.
Destination IPv4 Groups: Select any number of destination IPv4 groups. If you do not select a destination IPv4 group, the rule applies to all destination IP address groups.

IP Address Or WildCard FQDN: If the domain has multiple destination IP addresses or if its IP addresses may change, enter IP addresses, wildcard domains, and/or fully qualified domain names (FQDNs). For IP addresses, you can enter individual IP addresses, subnets, or address ranges. If adding multiple items, press Enter after each entry. Your Cloud or Branch Connector does not allow you to distinguish between multi-home servers, which are the same destination IP hosts with more than one FQDN.

A wildcard domain is a record, specified by an asterisk, within DNS that matches requests for nonexistent domain names. An example is *.example.com. Examples of invalid wildcard domains are *abc.example.com and abs.*.example.com. Zscaler cannot match invalid items. FQDNs are the full name of a system. The hostname is a shortened version of the full name of the system. For example, venera.isi.edu is an FQDN and venera is a hostname. Wildcard domains and FQDNs are limited to 16K per organization and 8,000 per rule.

For wildcard domain or FQDN support, forward workload DNS traffic through the Cloud or Branch Connector.

Destination Workload Groups: Select any number of destination workload groups, which create tags to define the criteria for a VPC and traffic within your AWS network. Destination workload groups can only be applied to Cloud Connector traffic forwarding policies and are only applicable to the Local traffic forwarding method.

Destination workload groups are only available if you have the workload discovery service enabled. To learn more about the workload discovery service, see Configuring Workload Discovery for Workloads in Amazon Web Services.

See image.

Close

Close
(Optional) In the Description field, enter a description for the rule.
Click Save and activate the change.
Close
Configuring Forwarding Rules Using Local

The local forwarding method facilitates subnet-to-subnet or virtual private cloud (VPC)-to-VPC communication across Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP), allowing you to permit ingress traffic to publicly hosted applications in AWS. To configure the rules to forward traffic back to its origin or control traffic for east-west segmentation and macrosegmentation using 5-tuples:

Go to Forwarding > Traffic Forwarding.

Click Add Traffic Forwarding Rule.

The Add Traffic Forwarding Rules window appears.

In the Add Traffic Forwarding Rules window:
In the Forwarding Rule section, configure the following:
Rule Order: Enter the order of the rule. Zscaler evaluates forwarding rules in ascending numerical order (Rule 1 before Rule 2, and so on). The rule order setting reflects this rule's place in the order. You can change the value based on your requirement.
Rule Name: Enter a user-friendly name for the rule. The forwarding control feature automatically creates a rule name, which you can change. The maximum length is 31 characters.
Rule Status: Enable this option to actively enforce the rule. If you disable this option, the service skips the rule and moves to the next one. However, the rule does not lose its place in the rule order.

Forwarding Method: From the drop-down menu, select the forwarding method to be used for this rule. Select Local. This method forwards traffic locally in the public cloud to the intended destination, such as an IP address or tag. Traffic does not egress out of the public cloud and can be forwarded from any IP address or tag in a VPC to another IP address or tag in the same or a different VPC while preserving the original client IP address. The local forwarding method is only available for Cloud Connector and Zero Trust Gateways.

See image.

Close

In the Criteria section, configure the following:
General

Location/Sublocation: Select up to 8 locations or sublocations. If you do not select a location, the rule applies to all locations.

Cloud & Branch Connector Groups: Select up to 32 Cloud Connector groups to apply this rule to. If you do not select a group, the rule applies to all Cloud Connector groups.

See image.

Close

Close
Services

Network Services: Select any number of network services. If you do not select a network service, the rule applies to all network services.

Network Services Group: Select any number of predefined or custom network services groups. If you do not select a network services group, the rule applies to all network service groups.

See image.

Close

Close
Applications

Application Service Groups: Application service groups allow you to configure traffic forwarding rules based on the predefined application service groups that Zscaler provides. They also allow you to enforce condition-based actions on your network traffic, such as allowing or blocking traffic and forwarding traffic to specific destinations. Select items from the drop-down menu to use as criteria when configuring traffic forwarding rules:

Office365
Zoom
Webex
RingCentral
LogMeIn
BlueJeans
Amazon Web Services
Azure
GCP
Zscaler Cloud Endpoints

Talk_Desk

See image.

Close

Close
Source

Source IP Groups: Select any number of source IP address groups or App Connector source IP addresses. If you do not select a source IP address group, the rule applies to all source IP address groups.
Source IP Addresses: Enter source IP addresses in any of the following formats:
An individual IP address (e.g., 192.0.2.1)
A subnet (e.g., 192.0.2.0/24)
An IP address range (e.g., 192.0.2.1-192.0.2.5)

Source Workload Groups: Select any number of source workload groups, which are applied to security policies for your cloud workloads deployed on the public cloud service provider. They can be referenced as a source object for the Local, Direct, ZIA, and ZPA criteria. Firewall rules that forward traffic to the internet can include and extend to the forwarding policy. Source workload groups are only applicable to Cloud Connector traffic forwarding policies. To learn more about workload groups, see Understanding Workload Groups.

Source workload groups are only available if you have the workload discovery service enabled. To learn more about the workload discovery service, see Configuring Workload Discovery for Workloads in Amazon Web Services, Configuring the Workload Discovery Service for Microsoft Azure Accounts, and Configuring Workload Discovery for Workloads in Google Cloud Platform.

To prevent App Connector looping, exclude IP addresses that your App Connector device uses to open connections or include IP addresses of all non-App Connector devices.

See image.

Close

Close
Destination

Destination IPv4 Groups: Select any number of destination IPv4 groups. If you do not select a destination IPv4 group, the rule applies to all destination IP address groups.

IP Address Or WildCard FQDN: If the domain has multiple destination IP addresses or if its IP addresses may change, enter IP addresses, wildcard domains, and/or fully qualified domain names (FQDNs). For IP addresses, you can enter individual IP addresses, subnets, or address ranges. If adding multiple items, press Enter after each entry. Your Cloud Connector does not allow you to distinguish between multi-home servers, which are the same destination IP hosts with more than one FQDN.

A wildcard domain is a record, specified by an asterisk, within DNS that matches requests for nonexistent domain names. An example is *.example.com. Examples of invalid wildcard domains are *abc.example.com and abs.*.example.com. Zscaler cannot match invalid items. FQDNs are the full name of a system. The hostname is a shortened version of the full name of the system. For example, venera.isi.edu is an FQDN and venera is a hostname. Wildcard domains and FQDNs are limited to 16K per organization and 8,000 per rule.

For wildcard domain or FQDN support, forward workload DNS traffic through the Cloud Connector.

Destination Workload Groups: Select any number of destination workload groups, which create tags to define the criteria for a VPC and traffic within your AWS network. Destination workload groups can only be applied to Cloud Connector traffic forwarding policies and are only applicable to the Local traffic forwarding method.

Destination workload groups are only available if you have the workload discovery service enabled. To learn more about the workload discovery service, see Configuring Workload Discovery for Workloads in Amazon Web Services.

See image.

Close

Close
(Optional) In the Description field, enter a description for the rule.
Click Save and activate the change.
Close

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Traffic Forwarding
Configuring Traffic Forwarding Rules
