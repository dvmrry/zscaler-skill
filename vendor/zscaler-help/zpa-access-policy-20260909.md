# About Access Policy

Source: https://help.zscaler.com/zpa/about-access-policy
API endpoint: https://help.zscaler.com/zapi/fetch-data?url_alias=/zpa/about-access-policy&view_type=full&cloud=null&domain=help.zscaler.com&applicable_category=&applicable_version=&applicable_parent_version=&applicable_product=&keyword=&language=en&_format=json
**Captured:** 2026-09-09; text extracted from the official Help JSON response (not a browser-rendered article capture).
HTTP status: 200
Help node: 1483656
Help revision: 3232655

## API body.content text extraction

Access policy rules enable you to implement role-based access control. To configure an access policy rule, you must first define the users and then define which applications or segment groups they can access. For example, you would specify the users first (i.e., Sales Staff), then specify which application segments or segment groups they can access (i.e., Sales App and Intranet Group). For a complete list of ranges and limitations for access policy rules, see Ranges & Limitations.
Access policy rules provide the following benefits and enable you to:
Implement role-based access control for your application segments or segment groups.
Use additional criteria to restrict access based on device posture profile conditions, trusted networks, client types, Cloud Connector groups, machine groups, and SAML or SCIM attributes.
If you want to configure application-based access control, you must create an access policy rule for specific application segments or segment groups. When you need to apply different policies to individual applications, create an access policy rule that includes one or more application segments. However, if you want all applications within a group of users who need a similar level of access across those applications, create an access policy rule that includes one or more segment groups.
Private Access (ZPA) evaluates access policy rules using the most specific application segment and a top-down, first-match principle. To learn more, see Policy Evaluation Order.
Access Policy rules are comprised of two main building blocks:
Criteria
Boolean Operators
To view examples of how an organization can configure access policy rules for a variety of scenarios, see Access Policy Configuration Examples.
Access Policies for Federation
Access policy rules can be created by the guest partner admin for Business-to-Business (B2B) Federation for shared access to your tenant's applications. This article describes access policy rules that are defined by your tenant. To learn more about access policy rules that are created by your partner, see About Access Policies Defined by Partners.
About the Defined by My Tenant Page
On the Defined by My Tenant page, you can create and manage access policy rules for internal applications and users, as well as applications federated by the host.
On the Defined by My Tenant page (Private Access > Policy > Access Policy > Defined by My Tenant), you can do the following:
View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view. To learn more, see Using Tables.
Hide the filters on the page by clicking Hide Filters. Click Show Filters to show the filters.
Refresh the Defined by My Tenant page to reflect the most current information.
Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
Add a new access policy rule.
Expand all the displayed rows in the table to see more information about each policy rule.
View a list of all access policy rules that were configured. For each rule, you can see:
Rule Order: The policy evaluation order number for the rule. Private Access applies policy rules based on the order they are listed here. Change the rule order by clicking on the number and manually entering a new value.
Updating the rule order of an access policy configured using Zscaler Deception is not supported. When changing the rule order of a regular access policy and there is an access policy configured using Deception, the rule order of the regular access policy must be greater than the rule order for an access policy configured using Deception.
When the row is expanded, the description is displayed if available and a Criteria section provides a visual representation of the criteria (e.g., SAML attributes, application segments, posture profiles, etc.) and Boolean logic used within the rule.
Name: The name of the rule.
Rule Action: Indicates if the rule will Allow Access, Block Access, or Require Approval.
Modify the columns displayed in the table.
Copy an existing access policy rule's criteria, and use it to create a new rule.
Edit an existing access policy rule.
Delete an access policy rule or view the policy usage details.
If an access policy is configured using Deception, the copy, edit, and delete options are unavailable. If the access policy rule contains a federated application or a federated partner that no longer exists, an inconsistency occurs with the rule criteria, and you must delete the rule to proceed.
Display more rows or a different page of the table.
Go to the Defined by Partners page to view access policy rules that are defined by your partners for your federated applications.
Viewing and managing access policies on the Defined by My Tenant page
Application Segments Example
Segment Groups Example
Application Segments and Segment Groups Boolean operation
Example AND Boolean operators between additional criteria
These are the conditions of a policy rule. A user's application request must match all the conditions within a policy rule.
You can apply any of the following criteria to a policy rule:
Adaptive Access Profiles: The profiles defined by user and device context signals from the Adaptive Access Engine. To learn more, see About Adaptive Access Profiles.
Applications: A grouping of defined applications based upon access type or user privileges. To learn more, see About Applications.
Branch Connector Groups: The group of Branch Connectors to which the policy applies. To learn more, see About Branch Connector Groups.
Chrome Enterprise Browser: Verify if the users are accessing private applications by using the Chrome Enterprise browser. To learn more, see Configuring Chrome Enterprise Browser Connector Settings.
Client Connector Posture Profiles: Zscaler Client Connector device posture profiles are the set of criteria that a user's device must meet to access applications with Private Access. To learn more, see About Device Posture.
Client Connector Trusted Networks: The type of network the user is connected to that Zscaler Client Connector can trust. To learn more, see Configuring Forwarding Profiles for Zscaler Client Connector.
Client Types: The available client types are Zscaler Client Connector, Client Connector for VDI, Client Connector Partner, Branch Connector, Cloud Connector, Machine Tunnel, Web Browser, Internet & SaaS Service Edge, or Extranet. To learn more, see What Is Zscaler Client Connector?, About Branch Connectors, About Cloud Connectors, What Is Zscaler Client Connector for VDI?, About Machine Tunnels, About Browser Access, About Source IP Anchoring, and About Extranet.
Cloud Connector Groups: The group of Cloud Connectors to which the policy applies. To learn more, see About Cloud Connector Groups.
Country Codes: The country that a user's IP address is located in.
In the case of Cloud Connectors, Source IP Anchoring traffic, or Private Access multi-hop, Private Access country criteria policy is applied using the last NATed layer 3 public IP address. For example, SIPA traffic identifies the country based on the Internet & SaaS Public Service Edge’s public IP address.
Extranet: The extranet resources (i.e., extranet locations or extranet sublocations). To learn more, see About Extranet.
Federated Applications: The defined application segments that are created, owned, and managed by the host partner and shared with guest partners. Federated applications are used in combination with access policies for federated applications for access to shared resources. Federated access policies support only the following criteria for the guest partner:
Client Type: The only supported client type is Client Connector.
Client Connector Posture Profiles
Country Codes
Locations
Machine Groups
Platforms
Risk Scores
SAML and SCIM Attributes
Trusted Networks
To learn more, see Understanding Business-to-Business (B2B) Federation.
Locations: The Branch Connector, Cloud Connector, or other locations and sublocations.
Machine Groups: The group of configured machines. To learn more, see About Machine Groups.
Platforms: The user devices to which the policy applies. The available platform types are Windows, macOS, Linux, and Android. To learn more, see Access Policy Use Cases.
Risk Scores: User risk scores from a risk source (e.g., Internet & SaaS). To learn more, see About User Risk Scores.
SAML Attributes: User attributes obtained from the SAML assertion from an IdP. To learn more, see About SAML Attributes.
SCIM Attributes: User attributes learned via SCIM from an IdP. To learn more, see About SCIM.
SCIM Groups: SCIM groups learned via SCIM from an IdP. To learn more, About SCIM Groups.
Segment Groups: The group of configured application segments. To learn more, see About Segment Groups.
Tag Groups: The tags associated with the tag group defined within the application segment. To learn more, see About Tag Management for Application Segments.
Tag Value: The values associated with configured application segments. To learn more, see About Tag Management for Application Segments.
Workload Groups: The Workload Groups from your cloud workloads. To learn more, see About Workload Groups.
To learn more, see Configuring Access Policies.
These are the operands used between criteria. Access Policy rules use AND and OR operators only.
Private Access uses an implicit OR Boolean operator between multiple application segments. For example, the following access policy rule includes three application segments. Private Access evaluates this application segment criteria as "Sales OR QA Site OR Internal Services."
See image.
Similar to application segments, Private Access uses an implicit OR Boolean operator between multiple segment groups. For example, the following policy rule includes three segment groups. Private Access evaluates the segment group criteria as "Acquisition Application Group OR AWS App Connector OR BC Bypass."
See image.
Private Access uses an explicit OR Boolean operator between application segment and segment group criteria. When a user requests access to an application, the policy rule is evaluated to check if an application segment OR its segment group are present. For example, the following policy rule includes three application segments and three segment groups:
See image.
If additional criteria are included, Private Access uses an explicit AND Boolean operator between them. When a user requests access to an application, Private Access verifies the following criteria and logic:
See image.
To learn more about implicit and explicit Boolean operators between and within criteria, see Configuring Access Policies.
