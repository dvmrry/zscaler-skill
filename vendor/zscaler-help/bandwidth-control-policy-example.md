# Bandwidth Control Policy Example

**Source:** https://help.zscaler.com/zia/bandwidth-control-policy-example
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398826, revision 3243775

---

The Bandwidth Control policy specifies how an organization's bandwidth is allocated, which is relevant during periods of contention. Contention occurs when bandwidth is saturated between the location and Zscaler, which typically happens at predictable periods on any given weekday. So, if there are bandwidth issues between 8:00 AM and 10:00 AM on a Monday, then it is likely to occur every Monday or even every day of the week. These are episodic aspects of traffic management, but it helps to observe the traffic patterns for a while and then create time-based policies to address these contention periods. To learn more, see About Bandwidth Control.
For instructions on how to configure Bandwidth Control policy rules, see Configuring the Bandwidth Control Policy.
To see how this policy fits into the overall order of policy enforcement, see Understanding Policy Enforcement.
The following examples contain sample policies for bandwidth management:
- Example 1
- The following example is a sample Bandwidth Control policy for an organization that has a 100 Mbps bandwidth:
- In this policy:
  - The Productivity Applications bandwidth class is a custom bandwidth class that includes business-critical apps, such as Salesforce, Microsoft 365 apps, NetSuite, and Box. It is always guaranteed 30% of the bandwidth and can use up to 100%.
  - The Business & Economy bandwidth class is a custom bandwidth class that includes the Business & Economy category and other domains related to the business. It is always guaranteed 20% of the bandwidth and can use up to 100%.
  - The Large Files bandwidth class is always guaranteed a minimum of 10% of the bandwidth and can use up to 100%.
  - The default rule, which includes all other internet traffic, is not guaranteed any bandwidth, but it can consume up to 100% of the bandwidth, when available. You cannot change the priority of the default rule. The service always applies this rule last. However, you can edit its minimum and maximum bandwidth limits.
- When bandwidth contention occurs, the service always guarantees the specified minimum bandwidth. Therefore, in this example, the Productivity class is guaranteed 30% (30 Mbps), the Business & Economy class is guaranteed 20% (20 Mbps), and the Large Files class is guaranteed 10% (10 Mbps). The service allocates the remaining 40% of the bandwidth (40 Mbps) based on traffic from other application classes during each one-second interval. When an application class uses less than its minimum bandwidth, then the service allocates the idle bandwidth to the other classes, based on the prioritized rules.
# Scenarios
- The following scenarios illustrate how the service allocates bandwidth as bandwidth requirements change within a day:
- Scenario 1: It's 9:00 AM and all the employees are in the office. The apps in the Productivity bandwidth class need all the available bandwidth. The Productivity class is guaranteed 30 Mbps. If there is no contention from other application classes, then the Productivity class can utilize 100 Mbps, because it is the first rule and its maximum percentage value is 100%. But if apps in the Business & Economy class need bandwidth, then the service allocates at least 20 Mbps to this class and allocates the remaining bandwidth to the Productivity class when needed.
- Scenario 2: It's 11:00 AM and the bandwidth requirements change. The Productivity class needs 40%, the Business & Economy class needs 30%, and the Large Files class only needs 10%. The service allocates the remaining 20% of the bandwidth to the default class.
- Scenario 3: It's 12:30 PM and most employees are out to lunch. Bandwidth usage changes yet again. The Productivity class, Business & Economy class, and the Large Files class only need 10%. The service then allocates the remaining bandwidth, which is 90%, to the default bandwidth class.
- Example 2
- The following example is a sample Bandwidth Control policy for an organization that has a 100 Mbps bandwidth:
- In this policy:
  - The Microsoft 365 bandwidth class is a custom bandwidth class that includes Microsoft 365 apps, Teams, etc. It is always guaranteed 40% of the bandwidth and can use up to 100%.
  - The Business Critical applications' bandwidth class is a custom bandwidth class that includes Zoom, Google Drive, Google docs, WebEx, etc. It is always guaranteed 30% of the bandwidth and can use up to 100%.
  - The Streaming Media bandwidth class is a custom bandwidth class that includes YouTube, Video Streaming Websites, etc. It is always guaranteed 10% of the bandwidth and can use up to 25%.
  - The Large Files bandwidth class is always guaranteed a minimum of 10% of the bandwidth and can use up to 50%.
  - The default rule, which includes all other internet traffic, is guaranteed 10% of the bandwidth and can consume up to 100% of the bandwidth when available. You cannot change the priority of the default rule. The service always applies this rule last. However, you can edit its minimum and maximum bandwidth limits.
- When bandwidth contention occurs, in this example, the Microsoft 365 class is guaranteed 40% (40 Mbps), the Business Critical Apps class is guaranteed 30% (30 Mbps), the Streaming Media class is guaranteed 10% (10 Mbps), and the Large Files class is guaranteed 10% (10 Mbps). The service allocates the remaining 10% of the bandwidth (10 Mbps) based on traffic from other application classes during each one-second interval to the default class. When an application class uses less than its minimum bandwidth, the service allocates the idle bandwidth to the other classes, based on the prioritized rules.
## Scenarios
- The following scenarios illustrate how the service allocates bandwidth as bandwidth requirements change within a day:
- Scenario 1: It's 9:00 AM and all the employees are in the office. The apps in the Microsoft 365 bandwidth class need all the available bandwidth. The Productivity class is guaranteed 40 Mbps. If there is no contention from other application classes, then the Microsoft Office 365 class can utilize 100 Mbps, because it is the first rule and its maximum percentage value is 100%. But if apps in the Business Critical Apps class or the Streaming Media class need bandwidth, then the service allocates at least 30 Mbps and 10 Mbps, respectively, to these classes and allocates the remaining bandwidth to the Microsoft Office 365 class when needed.
- Scenario 2: It's 11:30 AM and the bandwidth requirements change. The Microsoft 365 class needs 40%, the Business Critical Apps class needs 30%, the Streaming Media class needs 10%, and the Large Files class only needs 10%. The service allocates the remaining 10% of the bandwidth to the default class.
- Scenario 3: It's 1:00 PM and almost lunchtime. Now, the Microsoft 365 class, Business Critical Apps, Streaming Media class, and Large Files classes only need 10%. The service then allocates the remaining bandwidth, which is 90%, to the default class.
