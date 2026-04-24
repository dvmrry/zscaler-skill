# Configuring Firewall Policies

**Source:** https://help.zscaler.com/zia/configuring-firewall-policies
**Captured:** 2026-04-24 via Playwright MCP.

---

Configuring firewall policies requires configuring the following policies as applicable: **Firewall Filtering, NAT Control, DNS Control, and IPS Control** policies. For FTP Control settings within Firewall, see *About FTP Control*.

## Steps

1. **Configure the resources that the policies reference:**
   - Users, Groups, Departments, Locations, and Sublocations for your firewall policies.
   - Time Intervals.
   - Network Applications. You can create network application groups as needed.
   - Network Services. You can modify network services to edit services, add custom services, and create groups.
   - Source and Destination IPv4 Groups.
   - IPv6 Configuration.

2. **Define the rules for each policy:**
   - Firewall Filtering Policy
   - NAT Control Policy
   - DNS Control Policy
   - IPS Control Policy

## Default ports Zscaler listens on

| Port | Traffic |
|---|---|
| 80 | HTTP |
| 443 | HTTPS |
| 53 | DNS |
| 21 | FTP |
| 554 | RTSP |
| 1723 | PPTP |

If your organization uses other or additional ports for these types of traffic, configure the service to use **custom ports** for these services.

## Enable the firewall per location

Firewall Control is enabled on a per-Location basis.

**Advanced Firewall is required to configure and apply policies based on users, groups, departments, or network applications.**
