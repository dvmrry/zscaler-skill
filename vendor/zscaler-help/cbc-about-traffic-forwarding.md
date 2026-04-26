# About Traffic Forwarding

**Source:** https://help.zscaler.com/cloud-branch-connector/about-traffic-forwarding
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler Cloud & Branch Connector Help 
Forwarding 
Traffic Forwarding 
About Traffic Forwarding
Cloud & Branch Connector
About Traffic Forwarding
Ask Zscaler

Traffic Forwarding is used to forward select traffic to specific destinations based on your needs. For example, if you want to forward specific traffic through Zscaler Internet Access (ZIA) or application traffic through Zscaler Private Access (ZPA), use the traffic forwarding method by configuring appropriate rules.

Traffic Forwarding provides the following benefits and enables you to:

Give granular control of traffic forwarding from cloud locations to ZIA or ZPA.
Grant the user the ability to bypass ZIA or ZPA for a portion of workload traffic.
Allow the user the ability to prevent traffic forwarding and drop selected workload traffic.
Facilitate subnet-to-subnet or virtual private cloud (VPC)-to-VPC communication across Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP), allowing you to permit ingress traffic to publicly hosted applications in AWS.

Zscaler is a technology partner with companies that can assist with traffic forwarding (Amazon and Microsoft). To learn more about the Zscaler, Amazon, and Microsoft traffic forwarding integration, see:

Zscaler and AWS Traffic Forwarding Deployment Guide
Zscaler and Azure Traffic Forwarding Deployment Guide
About the Traffic Forwarding Page

On the Traffic Forwarding page (Forwarding > Traffic Forwarding), you can do the following:

Add a traffic forwarding rule.
View a list of all forwarding rules. For each forwarding rule, you can view:
Rule Order: The order of the rule.
Rule Name: The name of the rule.
Criteria: The criteria defined for the rule.
Forwarding Method: The forwarding method used in the rule (Direct, ZIA, ZPA, Drop, or Local).
Status: The status of the rule, which indicates if the rule is enabled or disabled.
Description: Additional notes or information about the gateway.
View a list of predefined forwarding rules created by Zscaler. They are disabled by default, but you can enable them. Predefined rules appear based on the licenses enabled in your tenant:
Direct rule for Zscaler Cloud Endpoints: This rule states that if the destination is a Zscaler Cloud Endpoints application service group, then the forwarding method is set to Direct.
Direct rule for WAN Destinations Group: This rule states that if the destination is a WAN IP group, then the forwarding method is set to Direct.

Direct rule for LAN Destinations Group: This rule states that if the destination is a LAN IP group, then the forwarding method is set to Direct.

Predefined forwarding rules are only applicable to hardware devices deployed in gateway mode. Additionally, you can only enable predefined forwarding rules if you have configured a location or Branch Connector group for them. Zscaler only allows devices deployed in gateway mode to be a part of the mandatory group used for these rules.

Edit a traffic forwarding rule. You can only edit the Rule Order, Rule Status, Location/Sublocation, and Cloud & Branch Connector Groups fields for predefined forwarding rules.
Duplicate a traffic forwarding rule.
Delete a traffic forwarding rule.
Modify the table and its columns.
Search for a traffic forwarding rule.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Traffic Forwarding
Configuring Traffic Forwarding Rules
