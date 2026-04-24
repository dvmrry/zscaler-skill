# Configuring Source IP Anchoring

**Source:** https://help.zscaler.com/zia/configuring-source-ip-anchoring
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Internet & SaaS (ZIA) Help 
Policies 
Forwarding Control 
Dedicated IP 
Customer-Managed Dedicated IP (Source IP Anchoring) 
Configuring Source IP Anchoring
Internet & SaaS (ZIA)
Configuring Source IP Anchoring
Ask Zscaler

Watch a video about configuring Source IP Anchoring.

Source IP Anchoring uses ZIA forwarding policies and Zscaler Private Access (ZPA) App Connectors to selectively forward the application traffic to the appropriate destination servers. You can configure forwarding rules in the ZIA Admin Portal to forward Source IP Anchored traffic to ZPA through ZIA threat and data protection engines. To learn more, see Understanding Source IP Anchoring.

To enable and configure Source IP Anchoring:

Complete the following steps to do the initial setup on the ZPA Admin Portal if you are using ZPA solely for Source IP Anchoring. You can skip this step if you have already done the initial setup on the ZPA Admin Portal.
Update your company and administrator information.
Configure the enrollment certificates for the App Connectors. For Source IP Anchoring, it is sufficient if you configure the enrollment certificates only for the App Connectors.
(Optional) Configure Single Sign-On Authentication.
Configure your App Connectors.
Configure the following items in the ZPA Admin Portal:

Create and configure an application segment for which you need Source IP Anchoring.

Ensure that you enable the Source IP Anchor option and select Use Client Forwarding Policy under the Bypass field while configuring the application segment.

Configure a client forwarding policy for the application segment. You should create separate client forwarding policy rules for IP address-based and domain-based applications.

For IP address-based applications, select the Only Forward Allowed Applications rule action for Source IP Anchoring application segments.

For domain-based applications, configure the following rules:

Rule 1: Select the Bypass ZPA rule action for Source IP Anchoring Segment Groups and add all client types, except ZIA Service Edge client type.
Rule 2: Select the Forward to ZPA rule action for Source IP Anchoring Segment Groups and add only the ZIA Service Edge client type.

Create and configure an access policy for the application segment. You should create separate access policy rules for IP address-based and domain-based applications.

For IP address-based applications, configure the following rules:

Rule 1: Select the Block Access rule action and add all the client types, except the ZIA Service Edge client type for the application segments. This rule prevents application download on the Zscaler Client Connector.
Rule 2: Select the Allow Access rule action and add only the ZIA Service Edge client type for the application segments.

For domain-based applications, ensure that you allow the Source IP Anchoring client (ZIA Service Edge client type) to access the applications.

If Source IP Anchoring traffic is restricted to certain users in the ZIA Admin Portal, do not add user-based SAML/SCIM criteria when configuring the access policy in the ZPA Admin Portal.

Configure the following items in the ZIA Admin Portal:

To support Source IP Anchoring for Zscaler Tunnel (Z-Tunnel) 1.0 traffic, you must enable the Enable Firewall for Z-Tunnel 1.0 and PAC Road Warriors option under Administration > Advanced Settings.

Configure the ZPA gateway.
Configure the forwarding policies for ZPA. You can also configure rules for source IP-anchored traffic in these ZIA policies
DLP Policy
DLP Policy with Content Inspection
DLP Policy without Content Inspection
File Type Control
Firewall Filtering
IPS Control
Sandbox
SSL Inspection
Close
.
To configure Source IP Anchoring for all traffic forwarded to the ZIA Admin Portal, enable the appropriate pre-configured DNS filtering rule from the Policy > DNS Control page:

For remote users, enable the ZPA Resolver for Road Warrior rule.

Zscaler does not recommend disabling the ZPA Resolver for Road Warrior rule. If disabled, the road warrior traffic falls under the ZPA Resolver for Locations rule instead of blocking the traffic. This leads to the source IP-anchored traffic being resolved by the ZPA Resolver for Locations IP pools and the traffic is not routed as intended.

For location users, enable the ZPA Resolver for Locations rule.

Zscaler recommends the following best practices for forwarding source IP-anchored traffic to ZIA:

The DNS rule order for the ZPA Resolver for Road Warrior rule should be a higher rule than the ZPA Resolver for Locations rule to configure Source IP Anchoring. For example, if ZPA Resolver for Road Warrior is at rule 4, then the ZPA Resolver for Locations should be at rule 5 and later.
The DNS rules are associated with the respective preconfigured IP pools. Any change in the IP pool is reflected in the Action column of the respective DNS rule when the rule is enabled.
Configure open firewall rules for the Source IP Anchoring pools while sending DNS traffic to the Zscaler service for the Source IP Anchoring domains (i.e., the Action column on the Firewall Filtering policy should be set to Allow for the Source IP Anchoring pools).
The client's DNS requests for domain-based non-web traffic should be forwarded to Zscaler service so the predefined ZPA DNS Resolver policies take effect.
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
Understanding Source IP Anchoring
Configuring Source IP Anchoring
About Zscaler Private Access Gateway
Configuring ZPA Gateway
Source IP Anchoring Configuration Guide for Microsoft 365 Conditional Access
