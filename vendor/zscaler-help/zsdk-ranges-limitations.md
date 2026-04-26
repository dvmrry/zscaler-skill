# Ranges & Limitations

**Source:** https://help.zscaler.com/zsdk/ranges-limitations
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of <article>).

---

Zscaler SDK for Mobile Apps Help 
Getting Started 
Ranges & Limitations
Zscaler SDK for Mobile Apps
Ranges & Limitations
Ask Zscaler

This article lists the ranges and limitations for policies, fields, and other features of Zscaler SDK for Mobile Apps (ZSDK). All values are per organization unless noted otherwise.

If you need to increase the maximum limit for your organization, send a request to Zscaler Support.

Administration

The following table shows the ranges and limitations for administration settings:

Feature	Limit
Admins	1,000 admins
Roles	100 roles

App Connector Management

The following table shows the ranges and limitations for App Connector management:

Feature	Limit
App Connectors	100 App Connectors
App Connector Groups	100 groups
App Connector Provisioning Keys	100 keys

Application Management

The following table shows the ranges and limitations for application management:

Feature	Limit
Applications	
6,000 applications
2,000 applications per application segment
The 2,000 applications per application segment limit applies to both IP addresses and domains. Wildcards also fall in the same category (i.e., every entry for the application in the ZSDK Admin Portal counts as one).
4,000 Source IP Anchoring-enabled domains or IP addresses
DNS resolution can resolve a single domain (such as example.com or host.example.com) to no more than 200 IP addresses on the App Connector.
The ZSDK cloud can only handle up to 100 TXT records for any domain that it looks up. The DNS TXT records are ignored if the lookup surpasses 100 DNS TXT records.

Application Segments	
6,000 segments
240 Source IP Anchoring-enabled segments

DNS Suffixes	50 suffixes
Segment Groups	200 groups
Servers	10,000 servers
Server Groups	1,000 groups

Authentication

The following table shows the ranges and limitations for authentication configuration:

Feature	Limit
IdP Configurations	10 configurations
SAML Attributes	100 attributes

Certificate Management

The following table shows the ranges and limitations for certificate management:

Feature	Limit
(web server) Certificates	1,000 certificates
Enrollment Certificates	1,000 certificates

Organization

The following table shows the organization ranges and limitations for organization management:

Feature	Limit
Admin User Password	100 characters

Access Policies

The following table shows the ranges and limitations for access policy management:

Feature	Limit
Access Policy	
2,000 policy rules
1,000 application segments per policy rule
48 App Connector groups per policy rule
The 48 App Connector groups per policy rule limit applies even if All App Connector groups for the application is selected when configuring an access policy rule.

Device Profiles

The following table shows the ranges and limitations for device profile management:

Feature	Limit
Device Profile	
200 device profiles
50 UUIDs per device profile
10 for all other attributes per profile

ZSDK Private Service Edge Management

The following table shows the ranges and limitations for ZSDK Private Service Edge management:

Feature	Limit
Private Service Edges	100 Private Service Edges
Private Service Edge Groups	100 groups
Private Service Edge Provisioning Keys	100 keys

Was this article helpful? Click an icon below to submit feedback.
Related Articles
 
What Is Zscaler SDK for Mobile Apps?
Understanding ZSDK Cloud Architecture
Step-by-Step Configuration Guide for ZSDK
What Is My Cloud Name for ZSDK?
Ranges & Limitations
