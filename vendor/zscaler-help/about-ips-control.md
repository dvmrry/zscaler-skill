# About IPS Control

**Source:** https://help.zscaler.com/zia/about-ips-control
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400966, revision 3239918

---

Watch a video about IPS Control policy rules as well as how to configure them.
Zscaler's Intrusion Prevention System (IPS) uses signature-based detection to monitor and protect your network traffic from intrusion over all ports and protocols. Zscaler's IPS Control uses IPS signature rules built and updated by Zscaler's security research team, as well as signatures from industry-leading vendors. In addition to the signatures used by Zscaler, you can create and deploy custom IPS signatures that are specific to your organization's requirements without requiring any additional infrastructure, and inspect your traffic using these signatures. These signatures should be part of the IPS Control policy using threat categories to be enforced on traffic. To learn more, see About Custom IPS Signature Rules. The Zscaler service monitors your traffic in real time using these signatures. As soon as the IPS has examined the contents of your traffic and found a pattern match, it can enforce your security policies inline.
IPS Control provides the following benefits and enables you to:
- Use signature-based detection to monitor your network traffic for malicious activities and prevent attacks by enforcing policies in real time.
- Define granular IPS Control rules using a number of conditions, such as users, groups, or departments, locations, threat categories, network services, source IP addresses, destination IP addresses/FQDNs, etc. Zscaler provides a default IPS rule that blocks all traffic. You can create granular policies of higher precedence (i.e., higher admin rank) than the default rule to explicitly allow specific traffic (e.g., IT Security group traffic matching threats) while blocking all other traffic via the default rule.
- Enforce condition-based actions on your network traffic, such as allowing or blocking traffic. You can also configure rules to allow specific types of traffic to bypass Zscaler's IPS.
- Enhance your security posture by employing custom IPS signatures, built using the industry-standard Snort-like syntax, to detect and mitigate threats that are specific to your organization's environment and threat landscape.
- Leverage Zscaler logs to investigate and analyze threats detected in your network and build telemetry data for external systems, such as cloud security information and event management (SIEM) tools.
IPS Control enables you to defend your organization against threats from both web and non-web traffic. This includes protection for HTTP, HTTPS, FTP, DNS, TCP, UDP, and IP-based ports and protocols. IPS Control also enables you to create granular rules for specific users, groups, departments, and so on.
You can enable IPS Control policies for specific locations by configuring the appropriate option for the location. To learn more, see Enabling the Firewall for Locations. If your organization uses Z-Tunnel 1.0 or PAC files to route traffic, ensure that the firewall is enabled for this type of traffic in the Advanced Settings. Threats detected in your network traffic are displayed under Firewall Insights > Logs. Threats detected in web-only traffic also appear on the Security dashboard.
IPS Control is available only with Advanced Firewall. To learn more, see Understanding Firewall Capabilities. If you have IPS Control as well as Advanced Threat Protection, rules created for Advanced Threat Protection are evaluated first.
# About the IPS Control Page
On the IPS Control page (Cyberthreat Protection > Policy > IPS Control), you can do the following:
- Click Recommended Policy to view the policy Zscaler recommends.
- Add an IPS Control policy rule.
- Filter the IPS Control policy rules by Rule Label to view the rules grouped under the selected labels. By default, the rules are listed in the ascending rule order.
- Applying Rule Labels
  - Click Rule Label.
  - From the drop-down menu, select rule labels to view the rules associated with them. You can also search for rule labels.
  - Click Apply.
  - The associated rules populate in the IPS Control policy table.
- Click Clear to remove all rule label selection.
- Search for an IPS Control rule.
- Modify the table and its columns.
- View a list of all configured IPS Control policy rules. For each rule you can view the following information.
- Policy Rule Details
  - Rule Order: The policy rule order number. IPS Control policy rules are evaluated in ascending numerical order. You can sort this column.
  - Admin Rank: The admin rank for this rule. This is only visible if you have enabled it in the Advanced Settings. You can sort this column.
  - Rule Name: The name of this rule. You can sort this column.
  - Description: The description of the rule.
  - Action: The action configured for the policy rule to allow or block traffic, or bypass IPS.
  - Label: The label associated with the rule.
  - Users: The users included in the rule.
  - Groups: The user groups included in the rule.
  - Departments: The departments included in the rule.
  - Locations: The locations included in the rule.
  - Time: The time period during which the rule applies.
  - Network Services: The network services included in the rule.
  - Network Service Groups: The network service groups included in the rule.
  - Source IPv4 Groups: The source IPv4 groups included in the rule.
  - Source IP Addresses: The source IP addresses included in the rule.
  - Destination Addresses: The destination addresses included in the rule.
  - Destination Countries: The destination countries included in the rule.
  - Destination IPv4 Groups: The destination IPv4 groups included in the rule.
  - Location Groups: The location groups included in the rule.
  - Source IPv6 Groups: The source IPv6 groups included in the rule.
  - Destination IPv6 Groups: The destination IPv6 groups included in the rule.
  - Destination IP Categories: The destination URL categories included in the rule.
  - Application Segments: The application segments included in the rule.
  - Application Service Groups: The application service groups included in the rule.
  - Advanced Threat Categories: The threat categories included in the rule.
  - Actions: The actions you can perform on a rule, such as editing, duplicating, and deleting.
- Edit, duplicate, or delete an IPS Control rule.
- The IPS Control policy rules are paginated with up to 500 rules displayed per page.
