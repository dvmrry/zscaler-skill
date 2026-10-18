# About DNS Control

**Source:** https://help.zscaler.com/zia/about-dns-control
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399916, revision 3239860

---

Watch a video About DNS Control Policy.
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
The DNS control policy also has default rules that allow all DNS traffic. These rules always maintain the lowest precedence. You can modify their actions, but you cannot delete them. To learn more, see Modifying the Predefined DNS Control Rules.
The Zscaler service categorizes domains that are newly registered within the last 30 days or observed for the first time as Newly Registered and Observed Domains (NROD) until a proper classification is available. As Zscaler updates the NROD database at periodic intervals, a latency of about 2 to 36 hours is expected for domains to be classified as NROD depending on whether the domain is newly registered, observed, or newly revived. Moreover, the URL classification might not be available for the first-ever DNS request for such domains due to propagation delays.
# DNS Traffic Control Methods
You can apply the DNS Control policy to recursive and iterative DNS requests with appropriate policy configurations. Iterative DNS requests require additional policy configurations to transit the traffic through the Zscaler service. Depending on your DNS deployment method and configuration options, the Zscaler service can control your DNS traffic in the following ways:
- Traffic from the Client IP Address
- The Zscaler service directs users' DNS requests forwarded via GRE tunnels, IPSec tunnels, or Zscaler Client Connector (using Zscaler Tunnel (Z-Tunnel) 2.0) to a public DNS service (e.g., Google Public DNS 8.8.8.8) or a private service hosted publicly (e.g., AWS or Azure).
- Alternatively, you can use the predefined NAT rule, Zscaler Trusted DNS Resolver, to redirect all your standard DNS traffic (dest:53) to the Zscaler Trusted DNS Resolver. To learn more about the predefined NAT rule, see About NAT Control. If Zscaler Trusted DNS Resolver fails to resolve DNS requests due to DNS cluster failure in Zscaler data centers, the DNS requests are forwarded to a public DNS service (e.g., Google Public DNS 8.8.8.8). DNS requests that time out or fail with the following response codes are redirected: SERVFAIL or REFUSED. The DNS requests are routed to an anycast DNS server that is geographically closest. In DNS Insights Logs, you can view the DNS server that was used to resolve the DNS requests. To learn more, see DNS Insights Logs: Columns.
- As the traffic originates from the client IP address, the Zscaler service can identify the user, group, and department the DNS request is coming from. This allows you to define and apply policies by user, group, department, location, and time.
- Traffic from the IP Address of the Internal DNS Server
- The Zscaler service can control traffic from the internal DNS server that acts as a DNS forwarder or an iterative DNS resolver.
  - Forwarded DNS Requests: Zscaler's predefined NAT rule (Zscaler Trusted DNS Resolver) redirects all your standard DNS traffic (dest:53), including requests forwarded by the DNS server, to the Zscaler Trusted DNS Resolver. To learn more about the predefined NAT rule, see About NAT Control.
  - If Zscaler Trusted DNS Resolver fails to resolve DNS requests due to DNS cluster failure in Zscaler data centers, the DNS requests are forwarded to a public DNS service (e.g., Google Public DNS 8.8.8.8). DNS requests that time out or fail with the following response codes are redirected: SERVFAIL or REFUSED. The DNS requests are routed to an anycast DNS server that is geographically closest. In DNS Insights Logs, you can view the DNS server that was used to resolve the DNS requests. To learn more, see DNS Insights Logs: Columns.
  - Iterative DNS Requests: DNS requests from an iterative DNS resolver must transit through the Zscaler service to an external DNS server that might support responses to the iterative DNS queries. Zscaler's predefined NAT rule (Zscaler Trusted DNS Resolver) redirects all your standard DNS traffic (dest:53) to the Zscaler Trusted DNS Resolver but drops the iterative DNS queries. So, if the predefined rule is enabled, you need to create a separate NAT rule with a higher rank to direct your iterative queries to an external DNS server. You can disable the predefined rule if your entire DNS traffic reaching Internet & SaaS (ZIA) is only iterative or if you intend to direct all your standard DNS queries to an external DNS provider (e.g., 8.8.8.8).
  - Irrespective of whether the predefined NAT rule is enabled or disabled, the DNS over HTTPS (DoH) traffic (dest:443) always transits to the external DNS provider specified. However, if you define a redirect rule in the DNS Control policy, the DoH traffic gets redirected and inspected by Internet & SaaS as standard DNS over UDP traffic (dest:53).
- For DNS requests that come from the internal DNS server, you can only apply policies based on location and time.
# About the DNS Control Page
On the DNS Control page (Internet Access > Policy > DNS Control), you can do the following:
- Add a DNS Filtering policy rule.
- Filter the DNS policy rules by Rule Label to view the rules grouped under the selected labels. By default, the rules are listed in the ascending rule order.
- Applying Rule Labels
  - Click Rule Label.
  - From the drop-down menu, select rule labels to view the rules associated with them. You can also search for rule labels.
  - Click Apply.
  - The associated rules populate in the DNS Control policy table.
- See image.
- Click Clear to remove all rule label selections.
- Search for a DNS Filtering policy rule.
- Modify the column options to view the DNS Filtering policy rules accordingly.
- View a list of all configured DNS Filtering policy rules. For each rule, you can view the following information.
- Policy Rule Details
  - Rule Order: The rule order number. DNS policy rules are evaluated in ascending numerical order. You can sort this column.
  - Admin Rank: The admin rank for this rule. This is only visible if you have enabled it in the Advanced Settings. You can sort this column.
  - Rule Name: The name of the rule. You can sort this column.
  - Label: The label associated with the rule.
  - Users: The users included in the rule.
  - Groups: The user groups included in the rule.
  - Departments: The departments included in the rule.
  - Locations: The locations included in the rule.
  - Location Groups: The location groups included in the rule.
  - Time: The time period during which the rule applies.
  - Source IPv4 Groups: The source IPv4 groups included in the rule.
  - Source IPv6 Groups: The source IPv6 groups included in the rule.
  - Source IP Addresses: The source IP addresses included in the rule.
  - Destination IPv4 Groups: The destination IPv4 groups included in the rule.
  - Destination IPv6 Groups: The destination IPv6 groups included in the rule.
  - Destination Addresses: The destination addresses included in the rule.
  - DNS Tunnels & Network Apps: The DNS tunnels and network applications included in the rule.
  - DNS Application Group: The DNS application groups included in the rule.
  - Destination Countries: The destination countries included in the rule.
  - Request/Response Categories: The DNS request and response URL categories included in the rule.
  - DNS Request Type: The DNS request types included in the rule.
  - Protocols: The DNS protocols included in the rule.
  - Endpoint Applications: The endpoint applications included or excluded from the rule.
  - Endpoint Application Tags: The endpoint application tags included or excluded from the rule.
  - Endpoint Application Risk Level: The endpoint application risk levels included in the rule.
  - Rule Action: The rule action to allow, block, or redirect responses, redirect responses, or resolve domain names of Private Access (ZPA) applications. For a complete list of supported actions, see Configuring the DNS Control Policy.
  - Status: The rule status that indicates whether the rule is enabled or disabled.
  - Description: The description of the rule.
  - Actions: The actions you can perform on a rule, such as editing, duplicating, and deleting.
- Edit, duplicate, or delete a DNS Filtering policy rule.
- The DNS Filtering policy rules are paginated with up to 500 rules displayed per page.
