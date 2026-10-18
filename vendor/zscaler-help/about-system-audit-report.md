# About the System Audit Report

**Source:** https://help.zscaler.com/zia/about-system-audit-report
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400386, revision 3243686

---

The System Audit Report highlights the status of GRE tunnels, PAC files, authentication frequency, PAC file sizes, Microsoft 365 One Click, and IP visibility. The report runs on the first of every month, and the analysis is presented on everything as of that date. If there are any present issues, the report shows recommendations on how to fix them.
Some issues might involve having no backup or updated GRE tunnels, failing to set up monitoring on the failover tunnel, and not using the ${GATEWAY} MACRO to help forward traffic to Zscaler. These issues might result in traffic inadequately being sent to the Zscaler cloud, which can lead to an internet outage. You might also run into authentication issues and other issues that impact your user experience when sending traffic to Zscaler. For example, the Microsoft-Recommended Microsoft 365 One Click Configuration option ensures a smoother Microsoft 365 experience by automatically exempting the required URLs so that authentication and SSL/TLS Inspection are performed appropriately. If this button is disabled, you might run into user experience issues.
In some cases, the previous month's report will be unavailable to view. In these cases, you'll be shown the month prior to the previous month's report. For example, if you generate your report some time in September, and your August report is unavailable, you'll be shown your July report.
# About the System Audit Report Page
On the System Audit Report page (Analytics > Reports > System Audit Report), you can do the following:
- View your overall grade and grades in each area
- View the High Availability Configuration section:
  - GRE Tunnels
  - In this section, Zscaler aggregates your last month's internet-bound traffic sent in both the Primary or Failover tunnel and detects whether there's any activity on the tunnel. Tunnel activity includes things like GRE Keep-alives, IPSLA, and regular traffic sent to us. The report only shows tunnels with issues and also shows whether there is missing activity on the Primary or Failover tunnel or both. Information is sorted on Failover missing, followed by Primary missing, followed by both tunnels missing.
  - See image.
  - The following table shows the rubric used to grade this section:
| Issues | Grade |
|---|---|
| No GRE tunnels | No Grade |
| Issues with less than 10% of all GRE tunnels | A |
| Other issues between 10% and 90% of all GRE tunnels | B |
| Issues with more than 90% of all GRE tunnels | C |
  - If you receive a grade of B or C, see Best Practices for Deploying GRE Tunnels.
  - Even if the GRE tunnels are shown as zero, and you get a letter grade, it's because Zscaler is seeing traffic from that IP address. You should create a location associated with that IP address.
  - PAC Files
  - In this section, Zscaler checks all PAC files to see if they use a Public Service Edge for Internet & SaaS (ZIA) static FQDN name or VIP address in the return statement. The PAC files can use a Global Public Service Edge IP address, Virtual Service Edge for Internet & SaaS IP address, Private Service Edge for Internet & SaaS (ZIA) IP address, or an on-premises proxy solution, and it's not flagged in this report.
  - See image.
  - You can view all the static IPs of a PAC file by clicking **View All** next to the **Static IP Addresses** column. A window appears listing all the static IPs. You can search for static IPs or download the list as a CSV file.
  - The following table shows the rubric used to grade this section:
| Issues | Grade |
|---|---|
| No PAC files | No Grade |
| Issues with less than 10% of all PAC files | A |
| Other issues between 10% and 90% of all PAC files | B |
| Issues with more than 90% of all PAC files | C |
  - If you receive a grade of B or C, see Best Practices for Writing PAC Files.
- View the User Performance Configuration section:
  - Authentication Frequency
  - In this section, Zscaler checks the authentication frequency configuration. Zscaler also checks to see if authentication is enabled for any location.
  - See image.
  - The following table shows the rubric used to grade this section:
| Status | Grade |
|---|---|
| Authentication Disabled for all locations | No Grade |
| Configured Only Once | A |
| Other (Weekly, Custom, etc.) | B |
| Configured Daily or Once Per Session | C |
  - PAC File Size
  - In this section, Zscaler checks the size of all PAC files and flag files that are greater than 25 KB. Shorter PAC files are evaluated more quickly, enhancing user experience.
  - See image.
  - The following table shows the rubric used to grade this section:
| Issues | Grade |
|---|---|
| No PAC files | No Grade |
| Issues with less than 10% of all PAC files | A |
| Other issues between 10% and 90% of all PAC files | B |
| Issues with more than 90% of all PAC files | C |
  - If you receive a grade of B or C, see Best Practices for Writing PAC Files.
- View the Other Configuration section:
  - Office 365 One Click
  - In this section, Zscaler checks to see if the Microsoft-Recommended Office 365 One Click Configuration is enabled.
  - See image.
  - The following table shows the rubric used to grade this section:
| Status | Grade |
|---|---|
| Enabled | A |
| Disabled | B |
  - IP Visibility
  - In this section, Zscaler checks the overall traffic on each GRE tunnel, and also obtain the overall internal IPs seen inside the tunnel. Zscaler then calculates the approximate number of users for that GRE tunnel. If the difference between the internal IPs and the approximate number of users is high, Zscaler flags the GRE tunnel to say that NAT is performed.
  - See image.
  - The following table shows the rubric used to grade this section:
| Issues | Grade |
|---|---|
| No GRE tunnels | No Grade |
| Tunnels with NAT are less than 10% of all GRE tunnels | A |
| Other issues between 10% and 90% of all GRE tunnels | B |
| Tunnels with NAT are more than 90% of all GRE tunnels | C |
  - If you receive a grade of B or C, see Best Practices for Deploying GRE Tunnels.
The overall grade for each main section is the lowest grade received in that section.
The overall grade for the report is the overall grades for High Availability Configuration and User Performance Configuration combined. It's not dependent on Other Configuration.
