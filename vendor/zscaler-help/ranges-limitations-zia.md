# Ranges & Limitations — Internet & SaaS Access (ZIA)

**Source:** https://help.zscaler.com/unified/ranges-limitations (ZIA section only)
**Captured:** 2026-04-23 via Playwright MCP (bundled chromium rendering the JS-served page; all accordion sections expanded before `innerText` extraction from `article`).

**Note:** This capture includes only the ZIA section of a larger unified ranges-and-limitations article. The page is the authoritative source for product quotas; when a topic-specific article disagrees (e.g., *Configuring URL Categories Using API* gives older quota numbers), trust this page.

---

## Active Directory & OpenLDAP Synchronization

| Feature | Limit |
|---|---|
| Primary/Secondary Directory Name | 255 characters |
| Authentication Agent URL | 1,023 characters |
| Directory Server Address | 1,023 characters |
| Port | 0–65,535 ports |
| Bind DN | 255 characters |
| Bind Password | 255 characters |
| Base DN | 1,023 characters |
| User Login | 255 characters |
| User Full Name | 255 characters |
| User Search Filter | 1,023 bytes |
| Department Membership | 255 characters |
| Group Name | 255 characters |
| Group Membership (AD only) | 255 characters |
| Group Search Filter | 1,023 bytes |
| Group Base DN (OpenLDAP only) | 255 characters |
| User Attribute (OpenLDAP only) | 255 characters |
| User Membership (OpenLDAP only) | 255 characters |
| User Entry | 1,023 characters |
| Users/Groups/Departments Search (Synchronization Results) | 255 characters |
| User Authentication Filter | 1,023 bytes |

## Advanced Threat Protection

| Feature | Limit |
|---|---|
| Blocked Malicious URLs | 25K FQDNs, domains, or URLs |

## Data Loss Prevention

| Feature | Limit |
|---|---|
| Custom DLP Dictionaries | 801 dictionaries (with DLP Dictionary Expansion enabled); 160 dictionaries (disabled) |
| Custom DLP Parent Dictionaries | 64 dictionaries |
| Custom DLP Sub-Dictionaries | 63 per parent dictionary |
| Custom DLP Engines | 480 engines (with DLP Engine Expansion enabled); 58 engines (disabled) |
| DLP Incident Evidence Files | 100 MB (larger files replaced with `.txt` placeholder) |

## Departments

| Feature | Limit |
|---|---|
| Departments per Organization | 140K departments |
| Departments per admin with Department Scope | 2,048 departments |
| Department Name | 128 characters |
| Imported Departments per CSV file | 3,000 entries |

## EUNs

| Feature | Limit |
|---|---|
| Custom Messages for Zscaler Client Connector-Based EUNs | 64 custom messages |
| Notification Message Length for CC-Based EUNs | 500 characters |
| Custom Redirect URL | 1,023 characters |
| Notification / AUP / Categorization / Security / DLP / Caution messages | 15K–30K bytes each |

## Extranet

| Feature | Limit |
|---|---|
| Extranet resources | 1,000 extranets |
| Extranet locations | 5,000 extranet locations |
| Traffic selectors per extranet | 16 |
| DNS servers per extranet | 16 |

## Groups

| Feature | Limit |
|---|---|
| Group Name | 128 characters or 127 bytes |
| Imported Groups per CSV file | 3,000 entries |
| Network Services Groups | 121 groups |
| Network Applications Groups | 126 groups |
| Source IP Address Groups | 4,000 groups |
| Destination Groups (IP or FQDN) | 4,000 groups |
| FQDNs or IP Address Entries per Group | 8,000 (subject to overall base IP limit) |

## HTTP Header Control

| Feature | Limit |
|---|---|
| HTTP headers per HTTP Header Profile | 16 |
| HTTP header profiles per Rule | 16 |
| HTTP headers per HTTP Header Insertion Profile | 16 |
| HTTP header insertion profiles per Rule | 16 |
| HTTP header (Key) | 128 characters max |
| HTTP header Value | 1,024 characters max |

## Locations

| Feature | Limit |
|---|---|
| Locations and Sublocations per Organization | 32K locations (contact support to increase to 64K; requires Advanced Firewall) |
| Sublocations per Location | 2,000 |
| IP Address Ranges per Sublocation | 2,000 |
| Workload scope values per sublocation (Namespace/Account) | 10 each |
| Workload scope values per sublocation (VPC/VPC Endpoint) | 50 each |
| Location Name | 128 characters |
| Location State | 128 characters |
| Location Groups per Organization | 256 groups |
| Imported Locations per CSV file | 1,000 entries |

## NSS

| Feature | Limit | Comments |
|---|---|---|
| Users per NSS Feed Filter | 1,024 | |
| Departments per NSS Feed Filter | 1,024 | |
| Locations per NSS Feed Filter | 1,024 | |
| Clients per NSS Feed Filter | 1,024 | |
| Threat Names per NSS Feed Filter | 1,024 | |
| Web Transactions per Nanolog Cluster | 1 billion | More needs additional Nanolog clusters |
| Nanolog Clusters per NSS VM Server | 1 | |

## Organization

| Feature | Limit |
|---|---|
| Admin Users per Organization | 10K admins |
| Admin User Login ID | 128 characters |
| Admin User Email | 254 characters |
| Admin User Name | 256 characters |
| Admin User Password | 100 characters |
| ADP Clients | 16 clients |
| Admin Roles | 64 roles |
| API Roles | 16 roles |
| Identity Providers | 64 identity providers |

## Outbound Email DLP

| Feature | Limit |
|---|---|
| Domain Profiles per Organization | 32 profiles |
| Recipient Profiles per Organization | 32 profiles |
| Recipients per Recipient Profile | 32 (→ 8,192 total via support) |
| Domain Profiles per Rule | 8 |
| Recipient Profiles per Rule | 8 |
| Custom Domains per Domain Profile | 32 (→ 1,024 via support) |
| Outbound Email Policies | 1,024 |

## PAC File

| Feature | Limit |
|---|---|
| File Size | 256 KB |
| PAC Files per Organization | 256 (→ 1,024 via support) |
| Non-ASCII Characters | Up to 12% of file (binary) |

## Policies

| Feature | Limit | Comments |
|---|---|---|
| Bandwidth Control Policy Rules | 125 rules | |
| Cloud App Control Policy Rules per Cloud App Category | 127 rules | (→ 2,048 via support) |
| File Type Control Policy | 2,048 rules | |
| SaaS Security API Scans: Amazon S3 | 1,000 buckets | |
| SaaS Security API Scans: Bitbucket | 32 repositories | |
| SaaS Security API Scans: GCP | 1,000 buckets | |
| SaaS Security API Scans: Microsoft Azure | 1,000 blob containers | |
| DNS Control Policy Rules | 1,000 rules (Advanced DNS Control); 64 (Essential) | |
| NAT Control Policy Rules | 1,023 rules | |
| Firewall Filtering Policy Rules (incl. DNAT) | 1,021 rules (Advanced Firewall); 10 (Standard) | Up to 4,000 with strict criteria |
| Source IP/Destination Groups IP Entries & FQDNs per Org | 16K IP entries | (→ 64K via Advanced Firewall; destination-side via Custom URLs subscription) |
| Destination Groups FQDNs per Org | 5,000 (16K with Advanced Firewall) | |
| Source IP Groups IP Entries per Rule | 8,000 | |
| Destination Groups IP Entries & FQDNs per Rule | 8,000 | |
| Source IP/Destination Groups per Rule | 1,000 | |
| Service Groups/Application Groups per Rule | 1,000 | |
| Destination Groups FQDNs per Rule | 5,000 | |
| Destination Groups IP Entries & FQDNs per Group | 8,000 | |
| Destination Groups FQDNs per Group | 100 (8,000 with Advanced Firewall) | |
| **URL Filtering Policy Rules** | **1,000 rules** | (via support for increase) |
| Forwarding Policy Rules | 1,000 rules | |
| Third-Party Proxies Rules | 8 rules | |
| Gateways for Third-Party Proxies Rules | 8 rules | |
| ZPA Gateways Rules | 55 gateways | |
| Source IP Anchoring Application Segments | 255 segments | |
| **SSL Inspection Policy Rules** | **255 rules (245 custom + 10 predefined)** | |
| All Other Policy Rules (DLP, IPS, etc.) | 1,024 rules | (→ 2,048 via support) |

**All Policy Rule Types** (applies to users, groups, departments, locations, etc. criteria on any rule):

| Feature | Limit |
|---|---|
| Users per Rule | 32 |
| Groups per Rule | 32 |
| Departments per Rule | 32 |
| Locations per Rule | 32 |
| Location Groups per Rule | 32 |
| Rule Labels | 1,024 labels |
| Times per Rule | 8 |
| Devices per Rule | 64 |
| Device Groups per Rule | 8 |
| Workload Groups per Rule | 8 |

| Feature | Limit |
|---|---|
| File Type Control Policy File Size | 400 MB |

## Reporting

| Feature | Limit |
|---|---|
| Interactive Report Name | 50 characters |
| Widget Name | 50 characters |
| Widgets | 20 |
| Favorites per User | 50 |
| Export to CSV | 20 requests/hour |

## SaaS Application Tenants

| Feature | Limit | Comments |
|---|---|---|
| Tenants per SaaS application | 16 | Contact support to increase |
| External trusted domain and user profiles per application | 32 | |

## URL Filtering & Cloud App Control

| Feature | Limit | Comments |
|---|---|---|
| **Custom Keywords per Category** | **256 keywords** | **Max 2,048 across all categories** |
| **Keywords retaining parent category per Category** | **2,048 keywords** | **Max 2,048 retaining-parent across all categories** |
| **Total Custom Keywords and Keywords retaining parent category per Organization** | **2,048 keywords** | |
| Custom URLs/TLDs | 25K | Default; +50K via Custom URLs subscription (up to 5 tranches) |
| Do Not Scan Content from these URLs | 1,024 URLs | |
| Custom Categories/TLD Categories | 64 categories | (→ 1,024 via support) |
| Custom Cloud Applications per Organization | 64 applications | |
| URLs per Custom Cloud Application | 128 URLs | |
| URLs | 253 characters | |
| IP Ranges | 2,048 IP ranges | |
| Cloud Application Instance | 512 instances | (→ 4,096 via support) |
| Instance Identifiers | 1,024 instance identifiers (max 2,048 across all instances; → 8,192 via support) | Each identifier up to 128 chars |
| Cloud Application Instance per Rule | 8 | |
| Cloud Application Tags per Organization | 16 tags | Each tag up to 127 chars |
| Tenant Profiles per Rule | 16 | |

**Per-app tenant profile limits:**

| App | Limit | Comments |
|---|---|---|
| Amazon Web Services | 256 account IDs | 12 digits each; max 2,048 across profiles |
| ChatGPT | 128 workspace IDs | Up to 64 chars; max 16 profiles or 20 workspace IDs per rule |
| Dropbox Team ID | 100 team IDs | Up to 64 chars |
| GitHub | 1 enterprise slug | Up to 256 chars; max 100 profiles per org; 1 profile per rule |
| Google App Domains | 100 domains | Up to 160 chars; max 2,048 across profiles |
| Google Cloud Platform | 100 organization IDs | Up to 64 chars; max 2,048 across profiles |
| IBM SmartCloud | 100 account IDs | Up to 64 chars; max 100 per rule, 256 across profiles |
| Microsoft Login Services (v1) Tenant Directory ID | 1 tenant directory | Up to 64 chars |
| Microsoft Login Services (v2) Tenant Directory ID:Policy ID | 1 | Up to 256 chars |
| Microsoft Login Services (v1) M365 Tenants or Tenant IDs | 500 | Up to 64 chars each |
| Slack Your Workspace ID | 100 workspace IDs | Up to 64 chars |
| Slack Allowed Workspace ID | 256 workspace IDs | Up to 64 chars |
| YouTube Channel ID | 200 channel IDs | Up to 100 chars |
| YouTube School ID | 100 school IDs | Up to 127 chars |
| Webex Login Services | 100 Webex tenants | Max 250 across profiles |
| Zoho Login Services | 120 Zoho IDs | Up to 127 chars; max 2,048 across profiles |
| Zoom | 1 policy label | Up to 64 chars |

## Users

| Feature | Limit |
|---|---|
| Users per Organization | 1,400K users |
| User Name | 128 characters |
| User Password | 255 characters |
| Groups per User | 127 groups by default |
| Imported Users per CSV file | 3,000 entries |
| User Groups per Organization | 140K groups |

## VPN Credentials

| Feature | Limit |
|---|---|
| VPN Credentials per Organization | 16K (→ 64K via Advanced Firewall + support) |
| Imported VPN Credentials per CSV file | 3,000 entries |
| User ID (FQDN auth) | 256 characters |
| Pre-Shared Key | 255 characters |

## Static IPs

| Feature | Limit |
|---|---|
| Static IP Address Entries per Organization | 100 (contact support to increase) |
| Imported Static IPs per CSV file | 3,000 entries |

## Other ZIA Features

| Feature | Limit |
|---|---|
| Source IP and Destination Groups | 4,000 groups |
| IP Address Entries or FQDNs per Group | 8,000 (subject to base IP limit) |
| IP Address Entries per Organization | 16K (raised via Custom URL Categories) |
| Predefined Bandwidth Classes | 8 |
| Custom Bandwidth Classes | 245 |
| Time Intervals | 64 |
| Virtual Service Edge Nodes per Cluster | 16 |
| Exported Transactions | 100K entries |
| Alerts | 128 |
| Firewall Network Services | 832 services |
| Custom IPS Signature Rules | 500 |
| Custom IPS Threat Categories | 64 |
| Admin Audit Log | 1,000 entries |
| Workload Groups | 1,024 entries |
| SCIM Servers | 5 requests/second |
| EDNS Client Subnet (ECS) Prefix Objects per Organization | 128 prefixes |
| DNS Gateways | 254 |
| URL Length in Destination Group | 255 characters |
| Sub-URL Length in Insight Logs display / CSV | 2,041 characters (truncated if exceeded) |
| Remote Assistance View-Only and Full Access | 90 days |
