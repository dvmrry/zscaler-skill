# Configuring Forwarding Policies for Source IP Anchoring Using ZPA

**Source:** https://help.zscaler.com/zia/configuring-forwarding-policies-source-ip-anchoring-using-zpa
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Configuring Forwarding Policies for Source IP Anchoring Using ZPA
Internet & SaaS (ZIA)
Configuring Forwarding Policies for Source IP Anchoring Using ZPA
Ask Zscaler

You can configure forwarding policies to forward ZIA traffic through Zscaler Private Access (ZPA) for scanning internal applications and source IP anchoring and for inspecting traffic of certain ZPA application segments with ZIA. Zscaler provides a predefined forwarding rule, ZIA Inspected ZPA Apps, which is enabled by default. This rule forwards all ZPA application segment traffic for ZIA inspection that has the Inspect Traffic with ZIA field enabled in the ZPA Admin Portal. You cannot edit this rule.

The predefined rule is only available if you have ZPA App Inspection. For further assistance, contact Zscaler Support.

To configure a forwarding rule for ZPA:

Go to Policy > Forwarding Control.

Click Add Forwarding Rule.

The Add Forwarding Rule window appears.

In the Add Forwarding Rule window, configure the following rule attributes:
Rule Order: Enter the order of the rule. Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2, and so on), and the rule order reflects this rule's place in the order. You can change the value based on your requirements. However, if you've enabled Admin Rank, your assigned admin rank determines the rule order values you can select.
Rule Name: Enter a user-friendly name for the rule. The Forwarding Control automatically creates a rule name, which you can change. The maximum length is 63 characters.
Rule Status: Enable this option to enforce the rule actively. Disabling this option does not actively enforce the rule and the service skips it and moves to the next rule. However, the rule does not lose its place in the rule order.
Rule Label: Select a rule label to associate with the rule. To learn more, see About Rule Labels.

Forwarding Method: Select the forwarding method to be used for this rule. Choose ZPA to forward the traffic to a ZPA App Connector through the ZPA gateway.

If you select Direct, Zscaler forwards the traffic directly to the destination server using the Zscaler service IP address.

Under the following tabs, configure the appropriate rule attributes:
General

Location/Sublocation: Select Any to apply the rule to all locations, or select up to 32 locations. You can also search for a location or click the Add icon to add a new location. To apply this rule to unauthenticated traffic, the rule must apply to all locations.

If you want to use the IP address mentioned in the XFF header, use this option instead of the Source IPs Groups option under the Source criteria because the sublocation is used to detect the source IP addresses based on the XFF header.
If you want to apply this rule only to remote users’ traffic, select Road Warrior from the Locations field. Rules configured for locations other than Road Warrior also apply to remote user traffic from those locations.

The rules configured for the Road Warrior location apply to Z-Tunnel 1.0 and PAC only when the Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors option is enabled in Advanced Settings.

Location Groups: Select Any to apply the rule to all location groups, or select up to 32 location groups.
Users: Select Any to apply the rule to all users, select General Users to apply the rule to all authenticated users, or select Special Users to apply the rule to all unauthenticated user policies. You can also manually select up to 32 general or special users. You can search for users or click the Add icon to add a new user.
Groups: Select Any to apply the rule to all groups, or select up to 32 groups. You can search for groups or click the Add icon to add a new group.

Departments: Select Any to apply the rule to all departments, or select up to 32 departments. If you've enabled the unauthenticated user policy, you can select Special Departments to apply this rule to all unauthenticated transactions. You can search for departments or click the Add icon to add a new department.

Contact Zscaler Support to increase the limit of Users, Groups, Departments, or Locations.

Device Groups: Select the device groups to which the rule applies. For Zscaler Client Connector traffic, select the appropriate group based on the device platform. Select Cloud Browser Isolation, IoT, or No Client Connector to apply the rule to Isolation traffic, IoT traffic, or traffic that is not tunneled through Zscaler Client Connector, respectively. You can also search for a device group. Selecting no value ignores this criterion in the policy evaluation.

The Cloud Browser Isolation and IoT groups are available only if Zero Trust Browser and IoT discovery are enabled for your organization.

Close
Source
Source IPv4 Groups: Select the source IPv4 groups that you want to control with this rule. You can also add a new Source IPv4 Group by clicking the Add icon.

Source IPv6 Groups: To control source IPv6 addresses with this rule, select the All IPv6 group, which is the default source IPv6 group for all IPv6 addresses.

Custom source IPv6 groups are not currently supported. To learn more, see About Source IP Groups.

IP Addresses: Enter the source IP address (IPv4 only) in any of the following formats:

An individual address, such as 192.0.2.1
A subnet, such as 192.0.2.0/24
An address range, such as 192.0.2.1 - 192.0.2.5

Specifying individual, subnet, or range of IPv6 addresses is not currently supported.

Close
Applications
Application Service Groups: Select any number of application service groups to which the rule applies.
Close
Destination
Application Segment: Select the appropriate application segments that require Source IP Anchoring.
Close

From the Forward to ZPA Gateway drop-down menu, choose the appropriate ZPA gateway. To configure a ZPA gateway, see Configuring ZPA Gateway.

This field is enabled only if you have selected application segments that require Source IP Anchoring in the Application Segment field, and those application segments are associated with a common ZPA gateway. An empty list indicates that there is no common gateway configured for the selected application segments.

(Optional) Enter a description of the rule in the Description field.
Click Save and activate the change.
Was this article helpful? Click an icon below to submit feedback.
