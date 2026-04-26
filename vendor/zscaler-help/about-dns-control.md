# About DNS Control

**Source:** https://help.zscaler.com/zia/about-dns-control
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

Watch a video About DNS Control Policy (shows legacy UI)

The Domain Name System (DNS) is a key part of the internet, offering the power of translating quickly between the human language of the URL and the computer language of the IP address. With DNS Control, you can define rules that control DNS requests and responses.

However, DNS traffic often goes unmonitored and does not go through traditional firewalls. Because of this, DNS traffic can be abused through techniques such as tunneling. DNS Control also allows you to detect and prevent DNS tunneling from occurring on your network. To learn more, see Detecting and Controlling DNS Tunnels.

DNS Control provides the following benefits and enables you to:

- Monitor and apply policies to all DNS requests and responses, irrespective of the protocol and the encryption used. This includes UDP, TCP, and DNS over HTTPS (DoH).
- Define granular DNS filtering rules using a number of DNS conditions, such as users, groups, or departments, client locations, categorization of domains and IP addresses, DNS record types, the location of resolved IPs, etc.
- Enforce condition-based actions on DNS traffic, such as allowing or blocking traffic, redirecting requests to specific DNS servers, redirecting users by overwriting DNS responses, etc.
- Detect and prevent DNS-based attacks and data exfiltration through DNS tunnels.
- Enhance your security posture by using Zscaler Trusted DNS Resolver for domain resolution.

To enable DNS Control, you need to configure the firewall for locations. In addition, ensure a Firewall Filtering rule is configured to allow DNS traffic (Network Services condition matches DNS), per the Recommended Firewall Control policy.

Zscaler provides the following predefined DNS Rules:

- UCaaS One Click Rule: Allows traffic from the firewall when you enable any UCaaS application in the Advanced Settings.
- ZPA Resolver for Locations: Forwards location users' source IP anchored traffic to Private Access (ZPA).
- ZPA Resolver for the Road Warrior: Forwards remote users' source IP anchored traffic to Private Access.

If your organization has Extranet Application Support enabled, ZPA Resolver for Extranet Locations is added as a default rule, and it forwards extranet location users' source IP-anchored traffic to Private Access. A default IP pool is created for extranet traffic, and you can configure custom IP pools for extranet traffic. To learn more, see About IP Pool.

To access Extranet Application Support, contact your Zscaler Account team.

You can also disable or modify these predefined rules based on your needs. Zscaler also recommends maintaining these rules in higher rule order (i.e., Rule 1 and Rule 2).

The DNS control policy also has default rules that allow all DNS traffic. These rules always maintain the lowest precedence. You can modify their actions, but you cannot delete them. To learn more, see Modifying the Default DNS Control Rule.

The Zscaler service categorizes domains that are newly registered within the last 30 days or observed for the first time as Newly Registered and Observed Domains (NROD) until a proper classification is available. As Zscaler updates the NROD database at periodic intervals, a latency of about 2 to 36 hours is expected for domains to be classified as NROD depending on whether the domain is newly registered, observed, or newly revived. Moreover, the URL classification might not be available for the first-ever DNS request for such domains due to propagation delays.

## DNS Traffic Control Methods

You can apply the DNS Control policy to recursive and iterative DNS requests with appropriate policy configurations. Iterative DNS requests require additional policy configurations to transit the traffic through the Zscaler service. Depending on your DNS deployment method and configuration options, the Zscaler service can control your DNS traffic in the following ways.

- Traffic from the Client IP Address
- Traffic from the IP Address of the Internal DNS Server

## About the DNS Control Page

On the DNS Control page (Policies > Access Control > Firewall > DNS Control), you can do the following:

- Configure a DNS Filtering policy rule.
- Select one of the following View by option to see the DNS Filtering rules accordingly:
  - Rule Order: Displays the rules based on the rule order. By default, the rules are listed in the ascending rule order.
  - Rule Label: Displays the rules based on the rule labels. The rules are grouped under the associated rule labels. You can expand or collapse all the rule labels using the Expand All or Collapse All buttons.
- Search for a DNS Filtering policy rule.
- View a list of all configured DNS Filtering policy rules. For each rule, you can view:
  - Rule Order: The policy rule's order number. DNS Control policy rules are evaluated in ascending numerical order. You can sort this column.
  - Rule Name: The name of this rule. You can sort this column.
  - Criteria: A description of the different criteria that have been added to this rule.
  - Action: Whether the policy is set to Allow, Block, Redirect Request, or Redirect Response.
  - Label and Description: The label and description of the policy rule, if available.
- Modify the table and its columns.
- Edit or duplicate a DNS Filtering policy rule.
