# About Isolation Policy

**Source:** https://help.zscaler.com/zpa/about-isolation-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1484881, revision 3243379

---

Using the isolation policy for Zero Trust Browser within Zscaler Private Access (ZPA), you can create rules that define when application requests are redirected to isolation. This requires having isolation enabled for your organization and creating an isolation profile prior to setting up the isolation policy rule.
Isolation policy rules allow you to:
- Define policies to provide secure clientless access to critical applications via a containerized isolated browser on the Zscaler cloud, ensuring the posture of a user's machine doesn't affect the related applications.
- Reduce the surface area of attacks by providing true application-level Zero Trust access to critical applications (e.g., hiding all application-level transactions between the browser and the related applications).
- Enforce data exfiltration controls by ensuring users are unable to copy, paste, upload, or download files between their computers and the applications they are accessing.
When the user is authenticated, the session timeout value is the minimum timeout across all configured timeout policies. After the timeout happens, the user needs to reauthenticate with Private Access to access applications via isolation.
Along with defining an isolation policy, you also need to define an access policy for the application to be accessible from within the browser isolation environment. Application requests not directed to isolation are reviewed based on access policies.
If Private Access is undergoing a maintenance period, isolation might not be available.
Isolation policy rules are comprised of two main building blocks:
- Criteria: These are the conditions of a policy rule. A user's application request must match all the conditions within a policy rule.
- Boolean Operators: These are the operands used between criteria. Isolation policy rules use AND and OR operators only.
# About the Isolation Policy Page
On the Isolation Policy page (Zero Trust Browser > Browser Isolation Private Access > Isolation Policy), you can do the following:
- Review the default rule. This rule cannot be edited.
- See image.
- Add a new isolation policy rule.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
- Modify the columns displayed in the table.
- View a list of all configured isolation policy rules. For each rule, you can see:
  - Rule Order: The policy evaluation order number for the rule. Private Access applies policy rules based on the order they are listed here. Change the rule order by clicking on the number and manually entering in a new value.
  - Name: The name of the rule. The description is also displayed here, if available.
  - Rule Action: Indicates if the rule is to allow or bypass isolation. When the row is expanded, it provides a visual representation of the criteria (e.g., SAML attributes, application segments, posture profiles, etc.) and Boolean logic used within the rule.
- Edit the rule order.
- Copy an existing isolation policy rule's criteria, and use it to create a new rule.
- Edit an existing isolation policy rule.
- Delete an isolation policy rule.
- Display more rows or a different page of the table.
