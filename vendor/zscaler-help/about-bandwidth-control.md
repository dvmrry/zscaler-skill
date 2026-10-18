# About Bandwidth Control

**Source:** https://help.zscaler.com/zia/about-bandwidth-control
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1398776, revision 3242270

---

Watch a video about Bandwidth Control including configuring the Bandwidth Control Policy (shows legacy UI).
Bandwidth Control allows you to preserve access to your business-critical applications regardless of your internet pipe consumption. This enables you to do things like adding more restrictive rules around social media and streaming media. For example, you can allocate a maximum of 10% of the bandwidth to the streaming media, social media, or file share bandwidth classes. When bandwidth is restricted, these classes are not guaranteed any bandwidth and are restricted to 10% of the bandwidth when it is available.
Bandwidth Control enables organizations to optimize network performance by prioritizing business-critical applications and limiting non-essential traffic during periods of high bandwidth usage. To see a sample policy for bandwidth management, see the Bandwidth Control Policy Example.
The following sections explain the working methods of Bandwidth Control policy at various levels:
- Bandwidth Control at Two Levels
- Zscaler provides Bandwidth Control at two levels:
  - At the first level, the Zscaler service provides Bandwidth Control by location. You can configure maximum upload and download bandwidth limits for each location in your organization. These limits apply to the traffic that is proxied to Zscaler for Bandwidth Control. Further, you can also control bandwidth management by sublocation. This provides admins with the versatility of configuring different policies for different sublocations. Different sublocations can use bandwidth from the location or, if desired, sublocations can have a specific bandwidth limit enforced. Enforcing limits is particularly useful for guest Wi-Fi networks.
  - The service applies bandwidth controls to traffic from known locations only (i.e., locations that are configured in the Zscaler Admin Console). The Bandwidth Control policy does not apply to remote users because their traffic does not come from a configured location and their source IP address has unknown upload and download bandwidth values.
  - At the second level, for each location, you can configure bandwidth-shaping rules based on bandwidth classes, such as VoIP or Web Conferencing, URL categories, or custom application classes that you define. The Zscaler bandwidth algorithm allows an application class full bandwidth utilization until there is contention for the bandwidth by a traffic class with a higher priority. When application classes compete for bandwidth, the service takes action based on the multiple bandwidth control policies that you configured in the Bandwidth Control policy, as shown below:
- You must configure upload and download bandwidth limits for your locations or sublocations to use the second level of bandwidth controls.
- The Zscaler service rebalances the bandwidth in real time and buffers packets for application classes that hit the bandwidth quota limit during one-second intervals. This behavior ensures that business-critical applications run at full speed, with no deterioration in quality. The Zscaler service applies the policy to all HTTP and HTTPS traffic from the location. You do not need to enable SSL interception because it works at the TCP level. Bandwidth Control only applies to the TCP traffic for the following protocols:
  - HTTP
  - HTTPS
  - HTTP Proxy
  - SSL/TLS
  - Native FTP
  - DNS over HTTPS
  - Tunnel SSL/TLS
- How Bandwidth Control Works
- First, you specify the maximum upload and download bandwidth limits for each location in your organization. About 5–7% of TCP traffic is overhead, such as packet headers. The Zscaler service does not include these in its bandwidth calculations. It only includes the application traffic.
- Next, you define your bandwidth classes, specifying the URL categories and cloud applications to which the bandwidth class applies. You must configure the bandwidth classes before you can reference them in Bandwidth Control policy rules. To configure bandwidth classes, edit the predefined bandwidth classes or add new bandwidth classes by grouping URL categories, cloud applications, or custom domain lists. You can then reference those bandwidth classes in your Bandwidth Control policy, a set of prioritized rules that tell the service how to allocate the bandwidth when contention occurs. Bandwidth is allocated based on the rule order. Therefore, bandwidth classes such as business-critical applications, O365, etc. that require priority Bandwidth Control should be placed at the top of the rule sets. Each rule defines a maximum and minimum bandwidth for the bandwidth classes in the rule along with other parameters, like location and time of day.
- Based on the Bandwidth Control policy, Zscaler distributes the bandwidth to each rule from top to bottom by looking at the minimum bandwidth first. After completion, it passes through each rule a second time to allocate the remaining bandwidth and distribute it based on the maximum bandwidth configuration.
- The maximum bandwidth specifies the maximum percentage of the total bandwidth that the configured bandwidth class can use at a given point in time, and the minimum bandwidth specifies the guaranteed minimum bandwidth percentage that is available for the bandwidth class.
- The maximum bandwidth percentage is applied at all times. Because of this, traffic can only take up to the specified percentage of the location's bandwidth, whether there is any congestion. This is useful to users who wish to suppress, but not block, non-business traffic.
- The minimum bandwidth percentage is only enforced when there is contention on a location's connection and when traffic from the specified bandwidth classes is present. This allows a bandwidth class for full bandwidth utilization until there is contention between the bandwidth by a traffic class with a higher priority. When bandwidth classes compete for bandwidth, the service allocates the guaranteed minimum bandwidth percentage to the bandwidth classes and allocates the remaining bandwidth according to the prioritized rules. Therefore, the total minimum bandwidth must be less than 100%.
- Best Practices for Bandwidth Control policy
- The following are the best practices for setting up the Bandwidth Control policy for locations:
  - You must specify the maximum upload and download bandwidth limits for each location in your organization. Ensure that you exclude UDP traffic sent to Zscaler and traffic not forwarded to Zscaler while specifying the limits.
  - About 5–7% of TCP traffic is overhead, such as packet headers. The Zscaler service does not include these in its bandwidth calculations. It only includes the application traffic that is proxied to Zscaler. Therefore, computing a location's bandwidth is shown in the following equation:
    - (Actual bandwidth) – (10–15% overhead) = Upload and Download bandwidth
  - Only 70–80% of the overall bandwidth per location is the ideal setting for upload and download limits.
- The following are the best practices for setting up the bandwidth control policy for sublocations:
  - If Bandwidth Control is disabled on the main location but enabled on a sublocation, then an admin has to manually enter the upload and download limits for the sublocation.
  - Whenever the main location has Bandwidth Control enabled after a sublocation does, it needs to have upload and download limits added. The value of upload and download limits added to the main location must be greater than or equal to the total value of limits used for all the sublocations.
  - For example, say you first enable Bandwidth Control on the sublocation San Jose and set it to have a download limit of 15 Mbps and an upload limit of 80 Mbps. If you then enable Bandwidth Control on the main location, California, and San Jose is its only sublocation, then California's download and upload limits should be at least 15 Mbps and 80 Mbps respectively.
  - If you manually set the Bandwidth Control on a sublocation to a number that is equal to the bandwidth of the main location, Bandwidth Control is disabled on all other sublocations.
To see how this policy fits into the overall order of policy enforcement, see Understanding Policy Enforcement.
The Bandwidth Control page provides the following benefits:
- Prevents network congestion by limiting or prioritizing bandwidth for specific users, groups, locations, or applications.
- Protects business-critical apps by ensuring important traffic gets sufficient bandwidth instead of being crowded out by non-essential usage.
You can go to the Bandwidth Control dashboard to view your organization's bandwidth usage in real time. You can also go to Interactive Reports to view the standard reports for bandwidth control and to create custom reports as well.
# About the Bandwidth Control Page
On the Bandwidth Control page (Internet Access > Policy > Bandwidth Control), you can:
- Configure a Bandwidth Control policy rule.
- Select one or more Rule Labels to display only the associated Bandwidth Control rules. Clear the selection to display all rules.
- Search for a configured Bandwidth Control policy rule.
- Modify the table and its columns.
- View a list of all configured Bandwidth Control policy rules:
  - Rule Order: The order in which the rules are evaluated. Bandwidth Control rules are evaluated in ascending numerical order and the default rule is evaluated last. You can sort this column.
  - Rule Name: The name of the policy rule. You can sort this column.
  - Admin Rank: The assigned admin rank for the rule. This is only visible if you have enabled admin ranking in the Advanced Settings. You can sort this column.
  - Bandwidth Classes: The bandwidth classes associated with the rule.
  - Rule Action: Displays the configured Bandwidth Control actions of the rule.
  - Rule Status: Indicates whether the rule is Enabled or Disabled.
  - Protocols: The protocols to which the rule applies.
  - Locations: The locations where the rule is applied.
  - Time: The time schedule associated with the rule, if configured.
  - Rule Label: The rule label assigned to the policy, if configured.
- Edit the Bandwidth Control policy rule.
- Delete the Bandwidth Control policy rule.
- Duplicate the Bandwidth Control policy rule.
