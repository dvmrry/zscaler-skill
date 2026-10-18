# About NAT Control

**Source:** https://help.zscaler.com/zia/about-nat-control
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399906, revision 3243711

---

Watch a video about Firewall Control (shows legacy UI).
You can create rules that enable the Zscaler Firewall to perform destination NAT and redirect traffic to specific IP addresses and ports. You cannot, however, select network applications within your NAT Control rules.
Zscaler provides a predefined NAT rule, Zscaler Trusted DNS Resolver, which is enabled by default. This rule directs your standard DNS traffic (dest:53) to the Zscaler Trusted DNS resolver but drops the iterative DNS queries as they are not supported. However, you can configure a separate NAT rule with a higher rank that redirects the iterative queries to an external DNS resolver.
You can also disable the predefined rule if you want to resolve all your standard DNS traffic using an external DNS provider that supports both iterative and recursive DNS queries (e.g., 8.8.8.8:53).
NAT Control policy provides the following benefits and enables you to:
- Define granular NAT Control rules to redirect network traffic based on customizable conditions to configurable internet destinations by performing destination NAT.
- Enhance your DNS performance by redirecting your users' DNS traffic to the Zscaler Trusted DNS Resolver to perform DNS resolution.
NAT policy-related activities are recorded and displayed in Firewall Insights Logs for all types of traffic, except for DNS traffic. NAT logs for DNS traffic are displayed in DNS Insights Logs. To learn more, see About Insights Logs.
The Zscaler service does not monitor the health or the availability status of an endpoint to which NAT rules forward traffic. This means that NAT rules forward traffic to the specified destination irrespective of whether the destination endpoint is reachable or not. So, ensure that the NAT destination endpoint is always available to prevent connection failures.
# About the NAT Control Policy Page
On the NAT Control Policy page (Internet Access > Policy > NAT Control Policy), you can do the following:
- Search for a NAT Control policy rule.
- Click **Recommended Policy** to view the policy Zscaler recommends.
- Add a NAT Control rule.
- Modify the table and its columns.
- Choose whether you want to show or hide the filters available on the NAT Control Policy page.
- Filter the NAT Control policy rules by **Rule Label** to view the rules grouped under the selected labels. By default, the rules are listed in the ascending rule order.
- Applying Rule Labels
  - Click **Rule Label**.
  - From the drop-down menu, select rule labels to view the rules associated with them. You can also search for rule labels.
  - Click **Apply**.
  - The associated rules populate in the NAT Control policy table.
- Click **Clear** to remove all rule label selection.
- View a list of all configured and predefined NAT Control policies. For each rule, you can view the following information.
- Policy Rule Details
  - **Rule Order**: The policy rule order number. NAT Control policy rules are evaluated in ascending numerical order. You can sort this column.
  - **Admin Rank**: The admin rank for the rule. This is only visible if you have enabled it in the Advanced Settings. You can sort this column.
  - **Rule Name**: The name of the rule. You can sort this column.
  - **Source IP Addresses**: The source IP addresses included in the rule.
  - **Network Services**: The network services included in the rule.
  - **Destination Addresses**: The destination addresses included in the rule.
  - **Action**: The action configured for the policy rule to redirect matched traffic to the specified destination and port.
  - **Destination IP Categories**: The destination URL categories included in the rule.
  - **Destination Countries**: The destination countries included in the rule.
  - **Destination IPv4 Groups**: The destination IPv4 groups included in the rule.
  - **Destination IPv6 Groups**: The destination IPv6 groups included in the rule.
  - **Network Service Groups**: The network service groups included in the rule.
  - **Source IPv4 Groups**: The source IPv4 groups included in the rule.
  - **Source IPv6 Groups**: The source IPv6 groups included in the rule.
  - **Departments**: The departments included in the rule.
  - **Groups**: The user groups included in the rule.
  - **Location Groups**: The location groups included in the rule.
  - **Locations**: The locations included in the rule.
  - **Time**: The time period during which the rule applies.
  - **Users**: The users included in the rule.
  - **Label**: The label associated with the rule.
  - **Description**: The description of the policy rule, if available.
  - **Actions**: The actions you can perform on a rule, such as editing, duplicating, and deleting.
- Edit, duplicate, or delete a NAT Control policy rule.
- The NAT Control rules are paginated with up to 500 rules displayed per page.
- Go to the Firewall Filtering Policy page.
