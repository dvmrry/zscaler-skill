# Adding Rules to the Cloud App Control Policy

**Source:** https://help.zscaler.com/zia/adding-rules-cloud-app-control-policy
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399401, revision 3239837

---

Click to watch a video about Cloud App Control Policy, including how to add rules to the Cloud App Control policy (shows legacy UI).
You can create rules to control access to specific cloud applications. Cloud apps are organized into categories to facilitate defining rules for similar applications.
Additionally, you can define a daily quota by bandwidth or time. When users browse these sites after their quota has been reached, the Zscaler service displays a message that explains that the content cannot be viewed because they exceeded their daily quota.
# Policy Execution
The Cloud App Control policy supports different rule conditions, grouped into categories. A series of AND and OR logical operators are applied between these criteria to form a combination of rule sets that are used to evaluate for traffic matches. The logical relationship between the categories is AND, and the rule conditions within each category have their own set of logical operators applied, explained as follows:
- **Applications**: [ Cloud Applications OR Cloud Application Instances OR Cloud Application Risk Profile ]
- **Who, Where, & When**: [ (Groups OR Users OR Departments) AND (Location Groups OR Locations) AND Time ]
- **Devices & Agents**: [ Devices OR Device Groups OR Device Trust Level OR CONNECT User-Agent OR User Risk Profile ]
# Adding a Cloud App Control Rule
To add a rule, you can go to **Data Security** > **Inline CASB** > **SaaS/Cloud App Policy** and choose a category.
See image.
Select a cloud application category from the following list to learn more about creating rules for the category:
- AI & ML Applications
- Collaboration & Online Meetings
- Consumer
- Custom Applications
- DNS Over HTTPS Services
- File Sharing
- Finance
- Health Care
- Hosting Providers
- Human Resources
- Instant Messaging
- IT Services
- Legal
- Productivity & CRM Tools
- Sales & Marketing
- Social Networking
- Streaming Media
- System & Development
- Webmail
The Cloud App Control policy rules can also be applied to IoT devices from a location or a sublocation that has the Enforce IoT Policy Control option enabled. You can apply the rules to IoT devices that are identified and classified (e.g., Printers, Sensors, etc.) by the Zscaler AI/ML under the IoT group in the Device Groups criterion.
Zscaler provides the Allow Unauthenticated Traffic for IoT Classifications predefined rules for the preceding cloud application categories. You can enable these rules to temporarily allow unauthenticated traffic that could be blocked by other rules, so that the Zscaler AI/ML can classify devices. These rules are disabled by default and cannot be deleted. You can modify the Rule Order, Rule Status, Rule Label, and Description for these rules and cannot edit other attributes.
For information on the order in which the service enforces all policies, including this policy, see Understanding Policy Enforcement.
