# About Probes

**Source:** https://help.zscaler.com/zdx/about-probes
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Digital Experience Monitoring (ZDX) Help 
Configuration 
Probes 
About Probes
Digital Experience Monitoring (ZDX)
About Probes
Ask Zscaler

Probes log data pertaining to certain aspects of applications in your organization. Predefined applications have preconfigured probes onboarded with them by default, while custom applications require you to manually create probes. At least one Web probe is required to enable most applications. However, only one Cloud Path probe is required for a Network application. To learn more, see About Applications.

Probes provide the following benefits and enable you to:

Configure Web probes to collect metrics (i.e., Page Fetch Time, DNS Time, Server Response Time, Availability).
Configure Cloud Path probes to provide a summarized visualization between hop points of traffic.
Supported Probe Types

The probe types ZDX supports are Web probes and Cloud Path probes.

Web Probes

Web probes always pull objects from the server and do not do any local caching. They are used to collect the following metrics:

Page Fetch Time: This metric collects the network fetch time of the web page from the URL-specified Web probe. It requests only the top-level page document and does not request all embedded links within the web page. This provides users with a metric similar to other developer tools.
DNS Time: This metric represents the time it took to resolve the DNS name for the hostname specified in the Web probe URL.
Server Response Time: Time to First Byte (TTFB).

Availability (based on the HTTP Response code): If a success code is returned, the availability is either 1 or 0. If the probe times out, the availability defaults to 0.

The Secure Sockets Layer (SSL) policies configured for your organization do not apply to ZDX synthetic Web probes, though all other policies applicable to regular traffic are applied. This exception is to enable the caching of responses, without which the destination servers would experience an excessive surge of probe requests that might consume their resources. To learn more about this feature, see About SSL Inspection.

Cloud Path Probes

A Cloud Path is used to provide a summarized path visualization between the hop points of traffic. It can provide visualization for the case of a direct traffic path, as in Zscaler Client Connector to egress to destination, as well as tunneling through a Public Service Edge for Internet & SaaS (i.e., Zscaler Client Connector to egress to Public Service Edge to destination).

See image.

Close

If the hop is unreachable, it is considered unknown and shows in the path as a dotted arrow.

See image.

Close

Cloud Path probes are used to collect the following metrics:

Hop Count: The number of hops between each hop point on the path.
Packet Loss: The % of packet loss at each hop point on the path.
Latency (Average, Minimum, Maximum, and Standard Deviation): The roundtrip path time measured in milliseconds.
About the Probes Page

On the Probes page (Policies > Digital Experience Monitoring > Configuration > Probes > Select a collection to view applications > Select an application to view probes), you can do the following:

Switch between the views. The default view is End User.

End User: View all the collections of configured applications and their configured probes. The total number of probes are displayed.
Hosted: View all collections of applications with configured applications and their configured Zscaler Hosted probes. The total number of probes are displayed.

Top Private Apps: Search and configure for top private applications based on ports and protocol.

See image.

Close

Depending on your ZDX role and subscription level, you might not see some of the views.

Search through your collections.
Add a collection.
Configuring a collection for end-user applications.
Configuring a collection for Hosted applications.
Sort your collection list in the menu (Latest, A-Z, Z-A).
View the collections panel. Alternatively, you can hide the collections panel if you do not want to view it.
View application metrics with the following information and actions:

Edit: Edit the application name.

If the application is in a default collection (i.e., Unified Communication Collection, Predefined Apps Collection), then you cannot edit the application name.

Status: The status of the application. Toggle to enable or disable the application.
Total: The total number of enabled and disabled probes for the application.
Probes: The number of Web probes and Cloud Path probes for the application.

Edit, delete, or remove the application from the collection.

You cannot delete predefined applications.

Use the filters to view specific probes.
Search in the application for probe information.
Add a probe.
Configuring an End User probe.
Configuring a Zscaler Hosted probe.
View a list with the following information:
Type: The type of the probe.
Name: The name of the probe.
Status: The status of the probe.
Protocol/ Methods: The protocol or method of the probe.
Frequency: The frequency of when the probe runs.
Actions: Edit, delete, or copy the probe, To learn more, see Editing a Probe and Managing Zscaler Hosted Probes.

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
About Probes
Configuring a Probe
Editing a Probe
Understanding Probing Criteria Logic
Using Adaptive Mode
Configuring Zscaler Hosted Probes
Managing Zscaler Hosted Probes
Zscaler Hosted Probe Errors
