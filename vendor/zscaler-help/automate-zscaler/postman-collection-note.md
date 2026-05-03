# OneAPI Postman Collection

**Download URL:** https://automate.zscaler.com/downloads/OneAPI_postman_collection_03_05_2026.json
**Collection Name:** "OneAPI Copy 3"
**Schema Version:** Postman v2.1.0
**File Size:** ~14.8 MB
**Captured:** 2026-04-24 via download from automate.zscaler.com.

---

## Coverage

The collection covers ALL 7 Zscaler OneAPI products:

| Product | Subfolder Count |
|---------|----------------|
| Zscaler Internet Access (ZIA) | 23 categories |
| Zscaler Private Access (ZPA) | 36 categories |
| Zscaler Client Connector | 9 categories |
| Zscaler Cloud & Branch Connector | 10 categories |
| Zscaler Digital Experience (ZDX) | 6 categories |
| ZIdentity | 4 categories |
| Zscaler Business Insights | 2 categories |

## ZPA API Categories (from Postman collection - NOT on automate.zscaler.com website)

The ZPA API is documented in the Postman collection but its web pages are not yet published on automate.zscaler.com. Categories covered:

Application Controller, CBI Banner Controller, CBI Certificate Controller, CBI Profile Controller, Certificate Controller, Cloud Connector Group Controller, Connector Controller, Connector Group Controller, Credential Controller, Customer Controller, Customer Version Profile Controller, Emergency Access Controller, Enrollment Certificate Controller, IdP Controller, Inspection Control Controller, Inspection Profile Controller, Isolation Profile Controller, Log Streaming Service (LSS) Configuration Controller, Machine Group Controller, Microtenant Controller, Policy Set Controller, Posture Profile Controller, PRA Approval Controller, PRA Console Controller, PRA Portal Controller, Provisioning Key Controller, SAML Attribute Controller, SCIM Attribute Header Controller, SCIM Group Controller, Segment Group Controller, Server Controller, Service Edge Controller, Service Edge Group Controller, Server Group Controller, Trusted Network Controller, Zscaler Path Cloud Controller

## ZIA API Categories (from Postman collection)

Activation, Admin Audit Logs, Admin & Role Management, Browser Isolation, Data Loss Prevention, Device Groups, Event Logs, Firewall Policies, Forwarding Control Policy, Intermediate CA Certificates, IoT Report, Location Management, Rule Labels, Sandbox Report, Sandbox Settings, Security Policy Settings, Shadow IT Report, Traffic Forwarding, URL Categories, URL Filtering Policies, User Authentication Settings, User Management, Workload Groups

## ZIdentity API Categories (from Postman collection)

api-clients, groups, resource-servers, users

## Note on Collection Name

The collection is named "OneAPI Copy 3" internally - this appears to be a Zscaler internal naming artifact, not user-facing. This is the official published collection at the URL above.

## Authentication Notes

The collection uses the client secret flow. Users must configure:
- `client_id`: from ZIdentity Admin Portal
- `client_secret`: from ZIdentity Admin Portal
- Token URL: `https://<vanity-domain>.zslogin.net/oauth2/v1/token`
- Audience: `https://api.zscaler.com`
