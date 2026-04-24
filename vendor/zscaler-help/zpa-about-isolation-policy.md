# About Isolation Policy (ZPA)

**Source:** https://help.zscaler.com/zpa/about-isolation-policy
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Private Access (ZPA) Help 
Policies 
Isolation Policy 
About Isolation Policy
Private Access (ZPA)
About Isolation Policy
Ask Zscaler

Using the Isolation policy, you can create rules that define when application requests are redirected to Isolation. This requires having Isolation enabled for your organization and creating an Isolation profile prior to setting up the Isolation policy rule.

Isolation policy rules allow you to:

Define policies to provide secure clientless access to critical applications via a containerized isolated browser on the Zscaler cloud, ensuring the posture of a user's machine doesn't affect the related applications.
Reduce the surface area of attacks by providing true application-level Zero Trust access to critical applications (e.g., hiding all application-level transactions between the browser and the related applications).
Enforce data exfiltration controls by ensuring users are unable to copy, paste, upload, or download files between their computers and the applications they are accessing.

When the user is authenticated, the session timeout value is the minimum timeout across all configured timeout policies. After the timeout happens, the user needs to reauthenticate with ZPA to access applications via Isolation.

Along with defining an Isolation policy, you also need to define an access policy for the application to be accessible from within the browser Isolation environment. Application requests not directed to Isolation are reviewed based on access policies.

If ZPA is undergoing a maintenance period, Isolation might not be available.

Isolation policy rules are comprised of two main building blocks:

Criteria: These are the conditions of a policy rule. A user's application request must match all of the conditions within a policy rule.
Boolean Operators: These are the operands used between criteria. Isolation policy rules use AND and OR operators only.
About the Isolation Policy Page

On the Isolation Policy page (Policy > Isolation Policy), you can do the following:

View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view. To learn more, see Using Tables.
Hide the filters on the page by clicking Hide Filters. Click Show Filters to display the filters.
Refresh the Isolation Policy page to reflect the most current information.
Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
Add a new Isolation policy rule.
Review the default rule. This rule cannot be edited.
See image.
Close
Expand all of the displayed rows in the table to see more information about each policy rule.
View a list of all configured Isolation policy rules. For each rule, you can see:
Rule Order: The policy evaluation order number for the rule. ZPA applies policy rules based on the order they are listed here. Change the rule order by clicking on the number and manually entering in a new value.
Name: The name of the rule. The description is also displayed here, if available.
Rule Action: Indicates if the rule is to allow or bypass Isolation. When the row is expanded, it provides a visual representation of the criteria (e.g., SAML attributes, application segments, posture profiles, etc.) and Boolean logic used within the rule.
Copy an existing Isolation policy rule's criteria, and use it to create a new rule.
Edit an existing Isolation policy rule.
Delete an Isolation policy rule.
Modify the columns displayed in the table.
Display more rows or a different page of the table.
Depending on your ZPA Admin Portal subscriptions, you will see the following ZPA policy options:
Access Policy
Timeout Policy
Client Forwarding Policy
Privileged Policy
Security Policy
Redirection Policy

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Isolation Policy
Configuring Isolation Policies
Editing Isolation Policies
