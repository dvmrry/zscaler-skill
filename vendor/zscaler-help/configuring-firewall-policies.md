# Configuring Firewall Policies

**Source:** https://help.zscaler.com/zia/configuring-firewall-policies
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1399871, revision 3243724

---

Watch a video about Firewall Policies (shows legacy UI).
Configuring Firewall policies requires configuring the following policies as applicable: Firewall Filtering, NAT Control, and DNS Control policies. For FTP Control settings within Firewall, see Understanding FTP Control.
Advanced Firewall is required to configure and apply policies based on users, groups, departments, or network applications.
To configure Firewall policies:
- Configure the resources that the policies reference:
  - Users, Groups, Departments, Locations, and Sublocations for your Firewall policies.
  - Time Intervals.
  - Network Applications. You can create network application groups as needed.
  - Network Services. You can modify network services to edit services, add custom services, and create groups.
  - Source and Destination IPv4 Groups.
  - IPv6 Configuration
- Define the rules for each policy:
  - Firewall Filtering Policy
  - NAT Control Policy
  - DNS Control Policy
- By default, the Zscaler service listens to the following ports:
  - Port 80 for HTTP traffic
  - Port 443 for HTTPS traffic
  - Port 53 for DNS traffic
  - Port 21 for FTP traffic
  - Port 554 for RTSP traffic
  - Port 1723 for PPTP traffic
- If your organization uses other or additional ports for these types of traffic, you can configure the service to use custom ports for these services.
- Enable the firewall per location.
