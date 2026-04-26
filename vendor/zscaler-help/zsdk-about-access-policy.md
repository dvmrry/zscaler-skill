# About Access Policy

**Source:** https://help.zscaler.com/zsdk/about-access-policy
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Policies 
About Access Policy
Zscaler SDK for Mobile Apps
About Access Policy
Ask Zscaler

Access policy rules enable you to implement security-based access control for your applications. To configure an access policy rule, you must define which applications or segment groups the client groups can access.

Access policy rules provide the following benefits and enable you to:

Implement security-based access control for your application segments or segment groups.

Use additional criteria to restrict access based on client types.

If you want to configure application-based access control, you must create an access policy rule for specific application segments or segment groups. When you need to apply different policies to individual applications, create an access policy rule that includes one or more application segments. However, if you want all applications that need a similar level of access across those applications, create an access policy rule that includes one or more segment groups.

Access policy rules comprise two main building blocks:

Criteria
Boolean Operators

To view examples of how an organization can configure access policy rules for a variety of scenarios, see Access Policy Configuration Examples.

About the Access Policy Page

On the Access Policy page (Policy > Access Policy), you can do the following:

Add a new access policy rule.
Expand rows in the table.
Filter the information that appears in the table. By default, no filters are applied.
View a list of all access policy rules that were configured. For each rule, you can see:

Rule Order: The policy evaluation order number for the rule. ZSDK applies policy rules based on the order they are listed here. Change the rule order by clicking the number and manually entering a new value.

Name: The name of the rule. The description is also displayed here, if available.
Rule Action: The rule action is either Allow Access, Block Access, or Require Approval. When the row is expanded, it provides a visual representation of the Criteria and Boolean logic used within the rule.
Copy an existing access policy rule's criteria.
Edit an existing access policy rule.
Delete an access policy rule.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Access Policy
Managing Access Policies
