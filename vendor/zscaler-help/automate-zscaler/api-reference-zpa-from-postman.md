# ZPA API Reference (from Postman Collection) | Zscaler OneAPI

**Source:** Postman collection at https://automate.zscaler.com/downloads/OneAPI_postman_collection_03_05_2026.json
**Captured:** 2026-04-24 via Playwright MCP.

---

**Note:** The ZPA API web documentation pages are NOT yet published on automate.zscaler.com (pages return 404). However, the full ZPA API is covered in the official Postman collection.

## ZPA API Base URLs

| Version | Base URL |
|---------|----------|
| v1 | `https://api.zsapi.net/zpa/mgmtconfig/v1/admin/customers/{customerId}` |
| v2 | `https://api.zsapi.net/zpa/mgmtconfig/v2/admin/customers/{customerId}` |
| userconfig | `https://api.zsapi.net/zpa/userconfig/v1/customers/{customerId}` |

**Note:** The `customerId` parameter (ZPA tenant ID) is required in all ZPA API calls.

## Obtaining the ZPA Customer ID

**From ZIdentity:**
1. Go to ZIdentity Admin Portal > Integration > API Resources
2. Click View for Zscaler APIs
3. Click ZPA OneAPI to expand the resource
4. Customer ID is displayed as part of the scope

**From ZPA:**
1. Go to ZPA Admin Portal > Configuration & Control > Public API > API Keys
2. Click Copy Customer ID

## ZPA API Categories (36 total from Postman collection)

1. **Application Controller** - Application segments management
2. **CBI Banner Controller** - Cloud Browser Isolation banners
3. **CBI Certificate Controller** - Cloud Browser Isolation certificates
4. **CBI Profile Controller** - Cloud Browser Isolation profiles
5. **Certificate Controller** - Certificate management
6. **Cloud Connector Group Controller** - Cloud connector groups
7. **Connector Controller** - Connector management
8. **Connector Group Controller** - Connector group management
9. **Credential Controller** - Credential management
10. **Customer Controller** - Customer/tenant management
11. **Customer Version Profile Controller** - Version profiles
12. **Emergency Access Controller** - Emergency access settings
13. **Enrollment Certificate Controller** - Enrollment certificates
14. **IdP Controller** - Identity Provider configuration
15. **Inspection Control Controller** - Inspection control rules
16. **Inspection Profile Controller** - Inspection profiles
17. **Isolation Profile Controller** - Isolation profiles
18. **Log Streaming Service (LSS) Configuration Controller** - Log streaming configuration
19. **Machine Group Controller** - Machine groups
20. **Microtenant Controller** - Microtenant management
21. **Policy Set Controller** - Access policies (the core policy engine)
22. **Posture Profile Controller** - Device posture profiles
23. **PRA Approval Controller** - Privileged Remote Access approvals
24. **PRA Console Controller** - PRA console sessions
25. **PRA Portal Controller** - PRA portal management
26. **Provisioning Key Controller** - Provisioning keys
27. **SAML Attribute Controller** - SAML attribute management
28. **SCIM Attribute Header Controller** - SCIM attribute headers
29. **SCIM Group Controller** - SCIM group management (uses userconfig/v1)
30. **Segment Group Controller** - Segment groups
31. **Server Controller** - Server management
32. **Service Edge Controller** - Service Edge (App Connector) management
33. **Service Edge Group Controller** - Service Edge groups
34. **Server Group Controller** - Server groups
35. **Trusted Network Controller** - Trusted networks
36. **Zscaler Path Cloud Controller** - Zscaler Path cloud settings

## Example ZPA API Call

```python
import requests

url = "https://api.zsapi.net/zpa/mgmtconfig/v1/admin/customers/{customerId}/application"
params = {"page": 1, "pagesize": 100}
headers = {"Authorization": "Bearer <Access Token>"}

response = requests.get(url, headers=headers, params=params)
print(response.json())
```

Response structure:
```json
{
  "totalPages": "1",
  "list": [
    {
      "id": "7207654021241",
      "name": "example",
      "domainNames": ["example.com"],
      "enabled": true,
      "tcpPortRanges": ["443", "443"],
      "bypassType": "NEVER",
      "configSpace": "DEFAULT",
      "segmentGroupId": "...",
      "serverGroups": [...]
    }
  ]
}
```
