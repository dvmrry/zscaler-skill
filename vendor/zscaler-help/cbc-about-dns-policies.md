# About DNS Policies

**Source:** https://help.zscaler.com/cloud-branch-connector/about-dns-policies
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Forwarding 
DNS Policies 
About DNS Policies
Cloud & Branch Connector
About DNS Policies
Ask Zscaler

The Domain Name System (DNS) is a key part of the internet, offering the power of quickly translating between the human language of the URL and the computer language of the IP address. With DNS Policies, you can define rules that control DNS requests and responses.

DNS Policies provide the following benefits and enable you to:

Monitor and apply policies to all DNS requests and responses, irrespective of the protocol and the encryption used. This includes UDP, TCP, and DNS over HTTPS (DoH).
Define granular DNS filtering rules using a number of DNS conditions, such as users, groups or departments, client locations, categorization of domains and IP addresses, DNS record types, the location of resolved IP addresses, etc.
Enforce condition-based actions on DNS traffic, such as allowing or blocking traffic, redirecting requests to specific DNS servers, redirecting users by overwriting DNS responses, etc.
Detect and prevent DNS-based attacks and data exfiltration through DNS tunnels.
Enhance your security posture by using Zscaler Trusted DNS Resolver for domain resolution.

The DNS Policies page has a default rule that allows all DNS traffic. These rules always maintain the lowest precedence. You can modify their actions, but you cannot delete them.

About the DNS Policies Page

On the DNS Policies page (Forwarding > DNS Policies), you can do the following:

Add a DNS Filtering rule.
View a list of all configured DNS Filtering policy rules. For each policy rule, you can view:
Rule Order: The policy rule's order number. DNS Policies rules are evaluated in ascending numerical order.
Rule Name: The name of the rule.
Criteria: A description of the different criteria that have been added to the rule.
Action: Whether the policy is set to Allow, Block, or Resolved by Zscaler Private Access (ZPA).
Status: The status of the rule, which indicates if the rule is enabled or disabled.
Description: A description of the rule.
View a list of predefined policy rules created by Zscaler. They are disabled by default, but you can enable them:
Redirect Resolution of Zscaler Domains to WAN CTR: This policy rule matches Zscaler domains from the predefined Zscaler Cloud Endpoints application service group. It only applies to hardware devices deployed in gateway mode and appears based on the licenses enabled in your tenant. You can only edit certain fields for this rule (i.e., Rule Order, Rule Status, Location/Sublocation, and Cloud & Branch Connector Groups).
Default Connector DNS Rule: The default catch-all rule that permits all DNS queries.
Edit a DNS filtering rule.
Duplicate a DNS filtering rule.
Delete a DNS filtering rule.
Modify the table and its columns.
Search for a DNS Filtering rule.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About DNS Policies
Configuring the DNS Filtering Rule
Modifying the Default DNS Control Rule
