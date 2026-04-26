# About Segment Groups

**Source:** https://help.zscaler.com/zpa/about-segment-groups
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

You must place each application segment you configure into a segment group. This allows you to configure user access policies based on segment groups. For example, if you have a set of defined applications that you want only users from the "Sales" department to access, you can create a segment group called "Sales Applications" and apply to it all sales-related applications. You can then create an access policy using that segment group.

However, you cannot assign an application segment to multiple segment groups. For example, if you place Salesforce in the "Sales Applications Group," you cannot add Salesforce to another group.

Segment groups provide the following benefits and enable you to:

- Logically group application segments together for easier management.
- Provide a layer of abstraction to simplify access policy configuration.

You can add or modify a segment group while configuring an application segment or you can do so manually at any time.

## About the Segment Groups Page

On the Segment Groups page (Resource Management > Application Management > Segment Groups), you can do the following:

- View and add DNS search domains.
- Expand one or all rows in the table to see more information about each segment group's description and corresponding application segments.

If there are required fields missing, the Incomplete Configuration icon appears next to the indicated item. Edit the segment group to complete the configuration.

- Add a new segment group.
- Filter the information that appears in the table. By default, no filters are applied.
- View a list of all segment groups that were configured for your organization. For each segment group, you can see:
  - Name: The segment group name.
  - Status: Indicates that the segment group is enabled or disabled.
- View a configuration graph of connected objects.
- Edit an existing segment group.
- Delete a segment group.

If a segment group is configured using Zscaler Deception, then the edit and delete options are unavailable.

- Migrate or delete an existing segment group policy.
- Depending on your ZPA Admin Portal subscriptions, you see the following ZPA pages:
  - Application Segments: Define applications as an application segment or manage existing application segments.
  - Browser Access: Manage applications where Browser Access is enabled.
  - AppProtection: Manage applications where AppProtection is enabled.
  - Privileged Remote Access: Manage applications where Privileged Remote Access is enabled.
