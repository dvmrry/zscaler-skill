# Understanding Source IP Anchoring Direct

**Source:** https://help.zscaler.com/zpa/understanding-source-ip-anchoring-direct
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Private Access (ZPA) Help 
Application Management 
Application Segments 
Understanding Source IP Anchoring Direct
Private Access (ZPA)
Understanding Source IP Anchoring Direct
Ask Zscaler

Source IP Anchoring Direct is a set of ZPA configurations that supports Source IP Anchoring forwarding policies when Zscaler Internet Access (ZIA) is in disaster recovery mode. When ZIA is configured for disaster recovery, the ZPA Source IP Anchoring configurations must be changed to the Source IP Anchoring Direct configurations to ensure proper forwarding during a ZIA disaster recovery event.

To configure ZPA Source IP Anchoring client policies for Source IP Anchoring Direct, you must change or verify the following configurations for the duration of a ZIA disaster recovery event:

Client Forwarding Policy Configuration

The Client Forwarding Policy rule configured for Source IP Anchoring must be changed as follows:

Go to Policy > Client Forwarding Policy.
Change the client forwarding policy rules:

For the domain-based application rule with Segment Groups and Client Types > Client Connector criteria, change the Rule Action from Bypass ZPA to Forward to ZPA.

See image.

Close

For the IP address-based application rule with Segment Groups, change the Rule Action from Only Forward Allowed Applications to Forward to ZPA.
Close
Access Policy Configuration

Some Access Policy configurations support Source IP Anchoring but do not support Source IP Anchoring Direct. The following Access Policy configurations prevent Source IP Anchoring Direct from working:

Any Access Policy rule that blocks access to Zscaler Client Connectors. For example, Application Segment (or Segment Groups) and Client Type > Client Connector with the Block Access rule action enabled.
Any Access Policy rule that results in the Default Rule.
Close

If you plan to use the Source IP Anchoring Direct configurations, Zscaler recommends that you ensure there is an Access Policy that allows access to the applications from Zscaler Client Connectors. To learn more, see Configuring Access Policies.

Restoring Source IP Anchoring after Source IP Anchoring Direct

When the ZIA disaster recovery event ends, revert the Client Forwarding Policy rule and Access Policy rule configured for Source IP Anchoring Direct back to the Source IP Anchoring configuration as follows:

Client Forwarding Policy Configuration

The Client Forwarding Policy rule configured for Source IP Anchoring Direct must be changed as follows:

Go to Policy > Client Forwarding Policy.
Change the client forwarding policy rules:
For the domain-based application rule with Segment Groups and Client Types > Client Connector criteria, change the Rule Action from Forward to ZPA to Bypass ZPA.
For the IP address-based application rule with Segment Groups, change the Rule Action from Forward to ZPA to Only Forward Allowed Applications.

See image.

Close

Close
Access Policy Configuration

The Access Policy rule configured for Source IP Anchoring Direct must be changed as follows:

Go to Policy > Access Policy.
Change the Access Policy rules:
For domain-based applications, ensure that you allow the Source IP Anchoring client (ZIA Service Edge client type) to access the applications.
For IP address-based applications, configure the following rules:
Rule 1: Select the Block Access rule action and add all the client types, except the ZIA Service Edge client type for the Source IP Anchoring application segments. This rule prevents application download on the Zscaler Client Connector.
Rule 2: Select the Allow Access rule action and add only the ZIA Service Edge client type for the Source IP Anchoring application segments.
Close
Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Applications
Configuring Defined Application Segments
Editing Defined Application Segments
About AI-Powered Recommendations for Application Segments
Configuring AI-Powered Recommendations
Merging AI-Powered Recommendations
Sharing Defined Application Segments
Configuring AI-Powered Recommendations Settings
Validating a Client Hostname
Adding DNS Search Domains
Setting Application Segment Configuration Warnings
About AppProtection Applications
About Privileged Remote Access Applications
Understanding Application Discovery
Understanding Application Access
Understanding Double Encryption
Understanding Health Reporting
Defining a Dynamically Discovered Application
Configuring Bypass Settings
Configuring Private Link Domains
Disabling Access to Applications
Understanding Source IP Anchoring Direct
Configuring Application Load Balancing and High Availability
Using Application Segment Multimatch
Using Pattern Matching for Application Segments
