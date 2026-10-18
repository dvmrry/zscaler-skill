# About AppProtection Policy

**Source:** https://help.zscaler.com/zpa/about-appprotection-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1484926, revision 3243384

---

AppProtection policy rules allow you to set up AppProtection controls for Private Access (ZPA) web applications. For a complete list of ranges and limitations for AppProtection Policy rules, see Ranges & Limitations.
AppProtection policies work similarly to access policies. You can reuse an existing access policy's criteria to create an AppProtection policy. This allows you to match up your AppProtection policies to your access policies. To learn more, see About Access Policy.
AppProtection policy rules enhance your experience by enabling you to:
- Create a policy to inspect traffic to internal web applications based on specific criteria (e.g., application segments, Client Connector posture profiles, and SAML and SCIM attributes).
- Apply a previously created AppProtection profile to a policy with the default actions (Allow, Block, or Redirect) set for each related AppProtection control.
AppProtection policy rules are comprised of two main building blocks:
- Criteria: These are the conditions of a policy rule. A user's application request must match all the conditions within a policy rule.
- Boolean Operators: These are the operands used between criteria. AppProtection policy rules use AND and OR operators.
# About the AppProtection Policy Page
On the AppProtection Policy page (Private Access > Private App Protection > AppProtection Policy), you can do the following:
- View a list of applied filters available from the current and previous user sessions. Applied filters must be saved to the user session first before they can be viewed. Use the drop-down menu to select the applied filters to view. To learn more, see Using Tables.
- Hide the filters on the page by clicking Hide Filters. Click Show Filters to display the filters.
- Refresh the AppProtection Policy page to reflect the most current information.
- Filter the information that appears in the table. By default, no filters are applied. You can also save applied filters to your preferences so that they're visible in future user sessions. To learn more, see Using Tables.
- Add a new AppProtection policy rule.
- Add a dynamic rule to an AppProtection profile.
- Expand all the displayed rows in the table to see more information about each policy rule.
- View a list of all AppProtection policy rules that were configured. For each rule, you can see:
  - Rule Order: The policy evaluation order number for the rule. Private Access applies policy rules based on the order they are listed here. Change the rule order by clicking on the number and manually entering in a new value.
  - Name: The name of the rule. The description is also displayed, if available.
  - Rule Action: Indicates if the rule is to Inspect or Bypass Inspection. When the row is expanded, it provides a visual representation of the Criteria (e.g., SAML attributes, application segments, posture profiles, etc.) and Boolean logic used within the rule.
- Copy an existing AppProtection policy rule's criteria, and use it to create a new rule.
- Edit an existing AppProtection policy rule.
- Delete an AppProtection policy rule.
- Modify the columns displayed in the table.
- Display more rows or a different page of the table.
- Depending on your AppProtection subscription, you see the following Security policy option: Browser Protection.
