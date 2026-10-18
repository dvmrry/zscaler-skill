# About Access Policy

**Source:** https://help.zscaler.com/zsdk/about-access-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1509881, revision 3140358

---

Access policy rules enable you to implement security-based access control for your applications. To configure an access policy rule, you must define which applications or segment groups the client groups can access.
Access policy rules provide the following benefits and enable you to:
- Implement security-based access control for your application segments or segment groups.
- Use additional criteria to restrict access based on client types.
If you want to configure application-based access control, you must create an access policy rule for specific application segments or segment groups. When you need to apply different policies to individual applications, create an access policy rule that includes one or more application segments. However, if you want all applications that need a similar level of access across those applications, create an access policy rule that includes one or more segment groups.
Access policy rules comprise two main building blocks:
- Criteria
- These are the conditions of a policy rule. A user's application request must match all the conditions within a policy rule.
- You can apply any of the following criteria to a policy rule:
  - Applications: A grouping of defined applications based upon access type or user privileges. To learn more, see About Applications.
  - Client Types: The available client types are Prelogin Tunnel and Zero Trust Tunnel. To learn more, see Managing Access Policies.
  - Country Code: A grouping of country codes based upon where your users are accessing your mobile applications. To learn more, see Managing Access Policies.
  - Device Profiles: A grouping of defined device profiles to apply a set of criteria for evaluation. To learn more, see About Device Profile.
- Boolean Operators
- These are the operators used between criteria. Access policy rules use AND and OR operators only.
- ZSDK uses an implicit OR Boolean operator between multiple application segments. For example, the following access policy rule includes three application segments. So, ZSDK evaluates this application segment criteria as "Sales Tools OR QA Application OR All Other Services."
- See image.
- Similar to application segments, ZSDK uses an implicit OR Boolean operator between multiple segment groups. For example, the following policy rule includes three segment groups. So, ZSDK evaluates the segment group criteria as "AD-Servers OR Web Services Group OR Azure Application Group."
- See image.
- ZSDK uses an explicit OR Boolean operator between application segment and segment group criteria. So, when a user requests access to an application, the policy rule is evaluated to check whether an application segment OR its segment group is present. For example, the following policy rule includes three application segments and three segment groups:
- See image.
To view examples of how an organization can configure access policy rules for a variety of scenarios, see Access Policy Configuration Examples.
# About the Access Policy Page
On the Access Policy page (Policy > Access Policy), you can do the following:
- Add a new access policy rule.
- Expand rows in the table.
- You can expand the rows in the table to view access policy details in three different ways.
- In the **Column Menu**, you can:
  - **Expand Displayed Rules**: Expand all the displayed rows in the table to see more information about each policy rule.
  - **Display All Rules**: Show all the rules on the table. The rows remain collapsed.
- Depending on the number of rules, this can take a few minutes. By default, the UI only displays the first 100 rules. Alternatively, you can scroll to see more rules. If there are more than 1,000 rules, the **Display All Rules** button is not visible.
- See image.
- Lastly, if you want to select a single row, you can click the respective row's **Expand** icon.
- See image.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all access policy rules that were configured. For each rule, you can see:
  - **Rule Order**: The policy evaluation order number for the rule. ZSDK applies policy rules based on the order they are listed here. Change the rule order by clicking the number and manually entering a new value.
  - See image.
  - **Name**: The name of the rule. The description is also displayed here, if available.
  - **Rule Action**: The rule action is either **Allow Access**, **Block Access**, or **Require Approval**. When the row is expanded, it provides a visual representation of the **Criteria** and Boolean logic used within the rule.
- Copy an existing access policy rule's criteria.
- Edit an existing access policy rule.
- Delete an access policy rule.
