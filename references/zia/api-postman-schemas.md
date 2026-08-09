---
product: zia
topic: "api-postman-schemas"
title: "ZIA API schemas (from Postman collection)"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: vendor
sources:
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZIA API schemas (from Postman collection)

Request and response examples extracted from the Zscaler OneAPI Postman collection.


## Activation > Status - Activate configuration changes

### POST {{ZIABaseUrl}}/status/activate


## Activation > Status - Get activation status

### GET {{ZIABaseUrl}}/status


## Admin & Role Management > Admin Roles  - Get all

### GET {{ZIABaseUrl}}/adminRoles/lite


## Admin & Role Management > Admin Users - Add

### POST {{ZIABaseUrl}}/adminUsers

**Request:**

```json
{
  "loginName": "johnsmith@acme.com",
  "userName": "John Smith",
  "email": "johnsmith@acme.com",
  "role": {
    "id": 2322
  },
  "password": "AeQ9E5w8B$",
  "rank": 7,
  "name": "Read only",
  "policyAccess": "READ_ONLY",
  "dashboardAccess": "READ_WRITE",
  "reportAccess": "READ_WRITE",
  "ana
```


## Admin & Role Management > Admin Users - Delete

### DELETE {{ZIABaseUrl}}/adminUsers/6794036


## Admin & Role Management > Admin Users - Get all

### GET {{ZIABaseUrl}}/adminUsers


## Admin & Role Management > Admin Users - Update

### PUT {{ZIABaseUrl}}/adminUsers/6794036

**Request:**

```json
{
  "loginName": "johnsmith@acme.com",
  "userName": "John Smith",
  "email": "johnsmith@acme.com",
  "role": {
    "id": 2322
  },
  "password": "AeQ9E5w8B$",
  "rank": 7,
  "name": "Read only",
  "policyAccess": "READ_ONLY",
  "dashboardAccess": "READ_WRITE",
  "reportAccess": "READ_WRITE",
  "ana
```


## Admin Audit Logs > Admin Audit Logs (advanced) - Delete

### DELETE {{ZIABaseUrl}}/auditlogEntryReport


## Admin Audit Logs > Admin Audit Logs (advanced) - Filter by actions

### POST {{ZIABaseUrl}}/auditlogEntryReport

**Request:**

```json
{
  "startTime": 1577840401000,
  "endTime": 1583024401000,
  "page": 1,
  "pageSize": 100,
  "actionTypes": [
    "CREATE",
    "DELETE"
  ]
}
```


## Admin Audit Logs > Admin Audit Logs (advanced) - Filter by admin ID

### POST {{ZIABaseUrl}}/auditlogEntryReport

**Request:**

```json
{
  "startTime": 1577840401000,
  "endTime": 1583024401000,
  "page": 1,
  "pageSize": 100,
  "adminName": "read-only"
}
```


## Admin Audit Logs > Admin Audit Logs (advanced) - Filter by category

### POST {{ZIABaseUrl}}/auditlogEntryReport

**Request:**

```json
{
  "startTime": 1577840401000,
  "endTime": 1583024401000,
  "page": 1,
  "pageSize": 100,
  "category": "USER_MANAGEMENT"
}
```


## Admin Audit Logs > Admin Audit Logs (advanced) - Filter by client IP

### POST {{ZIABaseUrl}}/auditlogEntryReport

**Request:**

```json
{
  "startTime": 1577840401000,
  "endTime": 1583024401000,
  "page": 1,
  "pageSize": 100,
  "clientIP": "101.12.13.14"
}
```


## Admin Audit Logs > Admin Audit Logs (advanced) - Filter by interface

### POST {{ZIABaseUrl}}/auditlogEntryReport

**Request:**

```json
{
  "startTime": 1577840401000,
  "endTime": 1583024401000,
  "page": 1,
  "pageSize": 100,
  "actionInterface": "API"
}
```


## Admin Audit Logs > Admin Audit Logs (advanced) - Filter by resource

### POST {{ZIABaseUrl}}/auditlogEntryReport

**Request:**

```json
{
  "startTime": 1577840401000,
  "endTime": 1583024401000,
  "page": 1,
  "pageSize": 100,
  "objectName": "test"
}
```


## Admin Audit Logs > Admin Audit Logs (advanced) - Filter by result

### POST {{ZIABaseUrl}}/auditlogEntryReport

**Request:**

```json
{
  "startTime": 1577840401000,
  "endTime": 1583024401000,
  "page": 1,
  "pageSize": 100,
  "actionResult": "FAILURE"
}
```


## Admin Audit Logs > Admin Audit Logs (advanced) - Filter by sub-categories

### POST {{ZIABaseUrl}}/auditlogEntryReport

**Request:**

```json
{
  "startTime": 1577840401000,
  "endTime": 1583024401000,
  "page": 1,
  "pageSize": 100,
  "subcategories": [
    "DEPARTMENT",
    "USER"
  ]
}
```


## Admin Audit Logs > Admin Audit Logs (advanced) - Get report

### GET {{ZIABaseUrl}}/auditlogEntryReport/download


## Admin Audit Logs > Admin Audit Logs (advanced) - Get status

### GET {{ZIABaseUrl}}/auditlogEntryReport


## Admin Audit Logs > Admin Audit Logs (advanced) - Request all

### POST {{ZIABaseUrl}}/auditlogEntryReport

**Request:**

```json
{
  "startTime": 1577840401000,
  "endTime": 1583024401000,
  "page": 1,
  "pageSize": 100
}
```


## Browser Isolation > Browser Isolation Profile - Get all

### GET {{ZIABaseUrl}}/browserIsolation/profiles


## Data Loss Prevention > DLP Dictionaries > DLP Dictionaries - Add

### POST {{ZIABaseUrl}}/dlpDictionaries

**Request:**

```json
{
  "name": "Your Dictionary Name",
  "description": "Your Description",
  "phrases": [
    {
      "action": "PHRASE_COUNT_TYPE_ALL",
      "phrase": "YourPhrase"
    }
  ],
  "customPhraseMatchType": "MATCH_ALL_CUSTOM_PHRASE_PATTERN_DICTIONARY",
  "patterns": [
    {
      "action": "PATTERN_COUNT
```


## Data Loss Prevention > DLP Dictionaries > DLP Dictionaries - Delete

### DELETE {{ZIABaseUrl}}/dlpDictionaries/1


## Data Loss Prevention > DLP Dictionaries > DLP Dictionaries - Get 1

### GET {{ZIABaseUrl}}/dlpDictionaries/1


## Data Loss Prevention > DLP Dictionaries > DLP Dictionaries - Get all

### GET {{ZIABaseUrl}}/dlpDictionaries


## Data Loss Prevention > DLP Dictionaries > DLP Dictionaries - Get all (lite)

### GET {{ZIABaseUrl}}/dlpDictionaries/lite


## Data Loss Prevention > DLP Dictionaries > DLP Dictionaries - Get predefined identifiers

### GET {{ZIABaseUrl}}/dlpDictionaries/{dictId}/predefinedIdentifiers


## Data Loss Prevention > DLP Dictionaries > DLP Dictionaries - Update

### PUT {{ZIABaseUrl}}/dlpDictionaries/1

**Request:**

```json
{
  "id": 1,
  "name": "Your Dictionary Name",
  "description": "Your Description",
  "phrases": [
    {
      "action": "PHRASE_COUNT_TYPE_ALL",
      "phrase": "YourPhrase"
    }
  ],
  "customPhraseMatchType": "MATCH_ALL_CUSTOM_PHRASE_PATTERN_DICTIONARY",
  "patterns": [
    {
      "action": "PA
```


## Data Loss Prevention > DLP Dictionaries > DLP Dictionaries - Validate pattern

### POST {{ZIABaseUrl}}/dlpDictionaries/validateDlpPattern


## Data Loss Prevention > DLP Engines > DLP Engines - Add

### POST {{ZIABaseUrl}}/dlpEngines

**Request:**

```json
{
  "name": "Your DLP-Engine name",
  "engineExpression": "((D45.S > 0))",
  "customDlpEngine": true,
  "description": "Your Description"
}
```


## Data Loss Prevention > DLP Engines > DLP Engines - Delete

### DELETE {{ZIABaseUrl}}/dlpEngines/25


## Data Loss Prevention > DLP Engines > DLP Engines - Get 1

### GET {{ZIABaseUrl}}/dlpEngines/60


## Data Loss Prevention > DLP Engines > DLP Engines - Get all

### GET {{ZIABaseUrl}}/dlpEngines


## Data Loss Prevention > DLP Engines > DLP Engines - Get all (lite)

### GET {{ZIABaseUrl}}/dlpEngines/lite


## Data Loss Prevention > DLP Engines > DLP Engines - Update

### PUT {{ZIABaseUrl}}/dlpEngines/25

**Request:**

```json
{
  "id": 25,
  "name": "Your DLP-Engine name",
  "engineExpression": "((D45.S > 0))",
  "customDlpEngine": true,
  "description": "Your Description"
}
```


## Data Loss Prevention > DLP Engines > DLP Engines - Validate expression

### POST {{ZIABaseUrl}}/dlpEngines/validateDlpExpr


## Data Loss Prevention > DLP Incident Receiver > ICAP Servers - Get all

### GET {{ZIABaseUrl}}/icapServers


## Data Loss Prevention > DLP Incident Receiver > ICAP Servers - Get all (lite)

### GET {{ZIABaseUrl}}/icapServers/lite


## Data Loss Prevention > DLP Incident Receiver > Incident Receiver Servers - Get all

### GET {{ZIABaseUrl}}/incidentReceiverServers


## Data Loss Prevention > DLP Incident Receiver > Incident Receiver Servers - Get all (lite)

### GET {{ZIABaseUrl}}/incidentReceiverServers/lite


## Data Loss Prevention > DLP Notification Templates > Notification Templates - Add

### POST {{ZIABaseUrl}}/dlpNotificationTemplates

**Request:**

```json
{
  "name": "Your Template  name",
  "subject": "Your Template Subject ",
  "tlsEnabled": false,
  "attachContent": false,
  "plainTextMessage": "Your Template's Plain text Mesage ",
  "htmlMessage": "httml Message "
}
```


## Data Loss Prevention > DLP Notification Templates > Notification Templates - Delete

### DELETE {{ZIABaseUrl}}/dlpNotificationTemplates/48


## Data Loss Prevention > DLP Notification Templates > Notification Templates - Get all

### GET {{ZIABaseUrl}}/dlpNotificationTemplates


## Data Loss Prevention > DLP Notification Templates > Notification Templates - Get all (lite)

### GET {{ZIABaseUrl}}/dlpNotificationTemplates/lite


## Data Loss Prevention > DLP Notification Templates > Notification Templates - Update

### PUT {{ZIABaseUrl}}/dlpNotificationTemplates/48

**Request:**

```json
{
  "id": 48,
  "name": "Your Template  name",
  "subject": "Your Template Subject ",
  "tlsEnabled": false,
  "attachContent": false,
  "plainTextMessage": "Your Template's Plain text Mesage ",
  "htmlMessage": "httml Message "
}
```


## Data Loss Prevention > DLP Rules > DLP Rules - Add (with content inspection)

### POST {{ZIABaseUrl}}/webDlpRules

**Request:**

```json
{
  "accessControl": "READ_WRITE",
  "order": 1,
  "protocols": [
    "FTP_RULE",
    "HTTPS_RULE",
    "HTTP_RULE"
  ],
  "rank": 1,
  "cloudApplications": [],
  "minSize": 0,
  "action": "ALLOW",
  "state": "ENABLED",
  "matchOnly": false,
  "icapServer": {},
  "withoutContentInspection": false,
 
```


## Data Loss Prevention > DLP Rules > DLP Rules - Add (without content inspection)

### POST {{ZIABaseUrl}}/webDlpRules

**Request:**

```json
{
  "accessControl": "READ_WRITE",
  "order": 1,
  "protocols": [
    "FTP_RULE",
    "HTTPS_RULE",
    "HTTP_RULE"
  ],
  "rank": 1,
  "fileTypes": [
    "BZIP2"
  ],
  "cloudApplications": [],
  "minSize": 0,
  "action": "ALLOW",
  "state": "ENABLED",
  "matchOnly": false,
  "icapServer": {},
  "w
```


## Data Loss Prevention > DLP Rules > DLP Rules - Delete

### DELETE {{ZIABaseUrl}}/webDlpRules/27496


## Data Loss Prevention > DLP Rules > DLP Rules - Get all

### GET {{ZIABaseUrl}}/webDlpRules


## Data Loss Prevention > DLP Rules > DLP Rules - Get all (lite)

### GET {{ZIABaseUrl}}/webDlpRules/lite


## Data Loss Prevention > DLP Rules > DLP Rules - Update (with content inspection)

### PUT {{ZIABaseUrl}}/webDlpRules/27496

**Request:**

```json
{
  "accessControl": "READ_WRITE",
  "id": 27496,
  "order": 1,
  "protocols": [
    "HTTP_RULE",
    "FTP_RULE",
    "HTTPS_RULE"
  ],
  "rank": 1,
  "cloudApplications": [],
  "minSize": 0,
  "action": "ALLOW",
  "state": "ENABLED",
  "matchOnly": false,
  "icapServer": {},
  "withoutContentInspec
```


## Data Loss Prevention > DLP Rules > DLP Rules - Update (without content inspection)

### PUT {{ZIABaseUrl}}/webDlpRules/27498

**Request:**

```json
{
  "accessControl": "READ_WRITE",
  "id": 27498,
  "order": 1,
  "protocols": [
    "FTP_RULE",
    "HTTPS_RULE",
    "HTTP_RULE"
  ],
  "rank": 7,
  "fileTypes": [
    "BZIP2"
  ],
  "cloudApplications": [],
  "minSize": 0,
  "action": "ALLOW",
  "state": "ENABLED",
  "matchOnly": false,
  "icapSe
```


## Data Loss Prevention > Index Templates > Exact Data Match - Get all

### GET {{ZIABaseUrl}}/dlpExactDataMatchSchemas


## Data Loss Prevention > Index Templates > Exact Data Match - Get all (lite)

### GET {{ZIABaseUrl}}/dlpExactDataMatchSchemas/lite


## Data Loss Prevention > Index Templates > Indexed Document Match - Get all

### GET {{ZIABaseUrl}}/idmprofile


## Data Loss Prevention > Index Templates > Indexed Document Match - Get all (lite)

### GET {{ZIABaseUrl}}/idmprofile/lite


## Device Groups > Device Groups - Get all

### GET {{ZIABaseUrl}}/deviceGroups


## Device Groups > Devices - Get all

### GET {{ZIABaseUrl}}/deviceGroups/devices


## Event Logs > Event  Logs - Generate report

### POST {{ZIABaseUrl}}/eventlogEntryReport

**Request:**

```json
{
  "page": 0,
  "pageSize": 100,
  "startTime": 1661990400000,
  "endTime": 1662981535290
}
```


## Event Logs > Event Logs  - Get status

### GET {{ZIABaseUrl}}/eventlogEntryReport


## Event Logs > Event Logs - Delete report

### DELETE {{ZIABaseUrl}}/eventlogEntryReport


## Event Logs > Event Logs - Get report

### GET {{ZIABaseUrl}}/eventlogEntryReport/download


## Firewall Policies > Application Service Groups - Get all (lite)

### GET {{ZIABaseUrl}}/appServiceGroups/lite


## Firewall Policies > Application Services - Get all (lite)

### GET {{ZIABaseUrl}}/appServices/lite


## Firewall Policies > Firewall Filtering Rules  - Add

### POST {{ZIABaseUrl}}/firewallFilteringRules

**Request:**

```json
{
  "accessControl": "READ_WRITE",
  "enableFullLogging": false,
  "name": "Your_rule",
  "order": 1,
  "rank": 1,
  "action": "ALLOW",
  "state": "ENABLED",
  "predefined": false,
  "defaultRule": false,
  "description": "Your description"
}
```


## Firewall Policies > Firewall Filtering Rules  - Delete

### DELETE {{ZIABaseUrl}}/firewallFilteringRules/123


## Firewall Policies > Firewall Filtering Rules  - Get 1

### GET {{ZIABaseUrl}}/firewallFilteringRules/1234


## Firewall Policies > Firewall Filtering Rules  - Get all

### GET {{ZIABaseUrl}}/firewallFilteringRules


## Firewall Policies > Firewall Filtering Rules  - Update

### PUT {{ZIABaseUrl}}/firewallFilteringRules/123

**Request:**

```json
{
  "id": 123,
  "accessControl": "READ_WRITE",
  "enableFullLogging": false,
  "name": "Your_rule",
  "order": 1,
  "rank": 1,
  "action": "ALLOW",
  "state": "ENABLED",
  "predefined": false,
  "defaultRule": false,
  "description": "Your description"
}
```


## Firewall Policies > IP Destination Groups  - Get 1

### GET {{ZIABaseUrl}}/ipDestinationGroups/1234


## Firewall Policies > IP Destination Groups  - Get all

### GET {{ZIABaseUrl}}/ipDestinationGroups


## Firewall Policies > IP Destination Groups  - Get all (lite)

### GET {{ZIABaseUrl}}/ipDestinationGroups/lite


## Firewall Policies > IP Destination Groups - Add

### POST {{ZIABaseUrl}}/ipDestinationGroups

**Request:**

```json
{
  "name": "You Group Name",
  "type": "DSTN_IP",
  "addresses": [
    "1.2.3.4"
  ],
  "description": "Your Description",
  "ipCategories": [],
  "countries": [],
  "urlCategories": []
}
```


## Firewall Policies > IP Destination Groups - Delete

### DELETE {{ZIABaseUrl}}/ipDestinationGroups/123


## Firewall Policies > IP Destination Groups - Update

### PUT {{ZIABaseUrl}}/ipDestinationGroups/123

**Request:**

```json
{
  "id": 36862,
  "name": "You Group Name",
  "type": "DSTN_IP",
  "addresses": [
    "1.2.3.4"
  ],
  "description": "Your Description3",
  "ipCategories": [],
  "countries": []
}
```


## Firewall Policies > IP Source Groups  - Get 1

### GET {{ZIABaseUrl}}/ipSourceGroups/1234


## Firewall Policies > IP Source Groups  - Get all

### GET {{ZIABaseUrl}}/ipSourceGroups


## Firewall Policies > IP Source Groups  - Get all (lite)

### GET {{ZIABaseUrl}}/ipSourceGroups/lite


## Firewall Policies > IP Source Groups - Add

### POST {{ZIABaseUrl}}/ipSourceGroups

**Request:**

```json
{
  "name": "Your Group Name",
  "ipAddresses": [
    "1.2.3.4"
  ],
  "description": "Your Description"
}
```


## Firewall Policies > IP Source Groups - Delete

### DELETE {{ZIABaseUrl}}/ipSourceGroups/36872

**Request:**

```json
{
  "id": 36872,
  "name": "Your Group Name",
  "ipAddresses": [
    "1.2.3.4"
  ],
  "description": "Your Description"
}
```


## Firewall Policies > IP Source Groups - Update

### PUT {{ZIABaseUrl}}/ipSourceGroups/36872

**Request:**

```json
{
  "id": 36872,
  "name": "Your Group Name",
  "ipAddresses": [
    "1.2.3.4"
  ],
  "description": "Your Description"
}
```


## Firewall Policies > IPv6 Destination Groups - Get all

### GET {{ZIABaseUrl}}/ipDestinationGroups/ipv6DestinationGroups


## Firewall Policies > IPv6 Destination Groups - Get all (lite)

### GET {{ZIABaseUrl}}/ipDestinationGroups/ipv6DestinationGroups/lite


## Firewall Policies > IPv6 Source Groups - Get all

### GET {{ZIABaseUrl}}/ipSourceGroups/ipv6SourceGroups


## Firewall Policies > IPv6 Source Groups - Get all (lite)

### GET {{ZIABaseUrl}}/ipSourceGroups/ipv6SourceGroups/lite


## Firewall Policies > Network Application Groups  - Add

### POST {{ZIABaseUrl}}/networkApplicationGroups

**Request:**

```json
{
  "name": "network Application group",
  "networkApplications": [
    "APNS"
  ],
  "description": "Your Description"
}
```


## Firewall Policies > Network Application Groups  - Delete

### DELETE {{ZIABaseUrl}}/networkApplicationGroups/123


## Firewall Policies > Network Application Groups  - Get all

### GET {{ZIABaseUrl}}/networkApplicationGroups


## Firewall Policies > Network Application Groups  - Update

### PUT {{ZIABaseUrl}}/networkApplicationGroups/123

**Request:**

```json
{
  "id": 123,
  "name": "network Application group",
  "networkApplications": [
    "APNS"
  ],
  "description": "Your Description"
}
```


## Firewall Policies > Network Applications  - Get all

### GET {{ZIABaseUrl}}/networkApplications


## Firewall Policies > Network Applications  - Get all with description translation

### GET {{ZIABaseUrl}}/networkApplications


## Firewall Policies > Network Service Groups  - Get all

### GET {{ZIABaseUrl}}/networkServiceGroups


## Firewall Policies > Network Service Groups - Add

### POST {{ZIABaseUrl}}/networkServiceGroups

**Request:**

```json
{
  "name": "Network Services",
  "services": [
    {
      "id": 13734,
      "name": "AIM"
    }
  ],
  "description": "Your description"
}
```


## Firewall Policies > Network Service Groups - Delete

### DELETE {{ZIABaseUrl}}/networkServiceGroups/123


## Firewall Policies > Network Service Groups - Update

### PUT {{ZIABaseUrl}}/networkServiceGroups/123

**Request:**

```json
{
  "id": 123,
  "name": "Network Services",
  "services": [
    {
      "id": 13734,
      "name": "AIM"
    }
  ],
  "description": "Your description"
}
```


## Firewall Policies > Network Services  - Add

### POST {{ZIABaseUrl}}/networkServices

**Request:**

```json
{
  "name": "Network Service",
  "srcTcpPorts": [
    {
      "start": 123
    }
  ],
  "destTcpPorts": [
    {
      "start": 123
    }
  ],
  "srcUdpPorts": [
    {
      "start": 123
    }
  ],
  "destUdpPorts": [
    {
      "start": 123
    }
  ],
  "type": "CUSTOM",
  "description": "Your Desc
```


## Firewall Policies > Network Services  - Delete

### DELETE {{ZIABaseUrl}}/networkServices/123


## Firewall Policies > Network Services  - Get all

### GET {{ZIABaseUrl}}/networkServices


## Firewall Policies > Network Services  - Get all with description translation

### GET {{ZIABaseUrl}}/networkServices


## Firewall Policies > Network Services  - Update

### PUT {{ZIABaseUrl}}/networkServices/123

**Request:**

```json
{
  "id": 123,
  "name": "Network Service",
  "srcTcpPorts": [
    {
      "start": 123
    }
  ],
  "destTcpPorts": [
    {
      "start": 123
    }
  ],
  "srcUdpPorts": [
    {
      "start": 123
    }
  ],
  "destUdpPorts": [
    {
      "start": 123
    }
  ],
  "type": "CUSTOM",
  "description
```


## Firewall Policies > Time Windows  - Get all

### GET {{ZIABaseUrl}}/timeWindows


## Firewall Policies > Time Windows  - Get all (lite)

### GET {{ZIABaseUrl}}/timeWindows/lite


## Forwarding Control Policy > Forwarding Control Rule - Add

### POST {{ZIABaseUrl}}/forwardingRules

**Request:**

```json
{
  "accessControl": "READ_WRITE",
  "name": "Your Rule Name",
  "type": "FORWARDING",
  "order": 1,
  "rank": 1,
  "forwardMethod": "DIRECT"
}
```


## Forwarding Control Policy > Forwarding Control Rule - Delete

### DELETE {{ZIABaseUrl}}/forwardingRules/254329


## Forwarding Control Policy > Forwarding Control Rule - Get 1

### GET {{ZIABaseUrl}}/forwardingRules/196633


## Forwarding Control Policy > Forwarding Control Rule - Get all

### GET {{ZIABaseUrl}}/forwardingRules


## Forwarding Control Policy > Forwarding Control Rule - Update

### PUT {{ZIABaseUrl}}/forwardingRules/254329

**Request:**

```json
{
  "accessControl": "READ_WRITE",
  "id": 254329,
  "name": "Your Rule Name",
  "type": "FORWARDING",
  "order": 1,
  "rank": 7,
  "forwardMethod": "DIRECT",
  "state": "ENABLED"
}
```


## Forwarding Control Policy > ZPA Gateway > ZPA Gateway - Add

### POST {{ZIABaseUrl}}/zpaGateways

**Request:**

```json
{
  "name": "YourName",
  "zpaServerGroup": {
    "name": "Your Server Group Name",
    "externalId": "1234567890"
  }
}
```


## Forwarding Control Policy > ZPA Gateway > ZPA Gateway - Delete

### DELETE {{ZIABaseUrl}}/zpaGateways/594407


## Forwarding Control Policy > ZPA Gateway > ZPA Gateway - Get 1

### GET {{ZIABaseUrl}}/zpaGateways/418412


## Forwarding Control Policy > ZPA Gateway > ZPA Gateway - Get all

### GET {{ZIABaseUrl}}/zpaGateways


## Forwarding Control Policy > ZPA Gateway > ZPA Gateway - Update

### PUT {{ZIABaseUrl}}/zpaGateways/594407

**Request:**

```json
{
  "id": 594407,
  "name": "YourName",
  "zpaServerGroup": {
    "name": "YourName",
    "externalId": "1234567890"
  }
}
```


## Intermediate CA Certificates > Intermediate CA Certificates - Add

### POST {{ZIABaseUrl}}/intermediateCaCertificate

**Request:**

```json
{
  "name": "Your Cert Name ",
  "type": "CUSTOM_SW",
  "region": "GLOBAL",
  "status": "ENABLED"
}
```


## Intermediate CA Certificates > Intermediate CA Certificates - Delete

### DELETE {{ZIABaseUrl}}/intermediateCaCertificate/certid


## Intermediate CA Certificates > Intermediate CA Certificates - Download CSR

### GET {{ZIABaseUrl}}/intermediateCaCertificate/downloadCsr/certid


## Intermediate CA Certificates > Intermediate CA Certificates - Download key attestation

### GET {{ZIABaseUrl}}/intermediateCaCertificate/downloadAttestation/certid


## Intermediate CA Certificates > Intermediate CA Certificates - Finalize certificate

### POST {{ZIABaseUrl}}/intermediateCaCertificate/finalizeCert/certid


## Intermediate CA Certificates > Intermediate CA Certificates - Generate CSR

### POST {{ZIABaseUrl}}/intermediateCaCertificate/generateCsr/certid

**Request:**

```json
{
  "csrFileName": "YourFileName",
  "commName": "YourCommon_name",
  "orgName": "YourOrgName",
  "deptName": "YourDept",
  "city": "Your_City",
  "state": "Test",
  "country": "COUNTRY_AF",
  "keySize": 2048,
  "pathLengthConstraint": 0,
  "signatureAlgorithm": "SHA256"
}
```


## Intermediate CA Certificates > Intermediate CA Certificates - Generate key pair

### POST {{ZIABaseUrl}}/intermediateCaCertificate/keyPair/certId


## Intermediate CA Certificates > Intermediate CA Certificates - Get all

### GET {{ZIABaseUrl}}/intermediateCaCertificate


## Intermediate CA Certificates > Intermediate CA Certificates - Get all (lite)

### GET {{ZIABaseUrl}}/intermediateCaCertificate/lite


## Intermediate CA Certificates > Intermediate CA Certificates - Get by certificate ID

### GET {{ZIABaseUrl}}/intermediateCaCertificate/1


## Intermediate CA Certificates > Intermediate CA Certificates - Get ready-to-use certificates

### GET {{ZIABaseUrl}}/intermediateCaCertificate/readyToUse


## Intermediate CA Certificates > Intermediate CA Certificates - Make certificate as default

### PUT {{ZIABaseUrl}}/intermediateCaCertificate/makeDefault/certid


## Intermediate CA Certificates > Intermediate CA Certificates - Show CSR

### GET {{ZIABaseUrl}}/intermediateCaCertificate/showCsr/certid


## Intermediate CA Certificates > Intermediate CA Certificates - Show certificate

### GET {{ZIABaseUrl}}/intermediateCaCertificate/showCert/certid


## Intermediate CA Certificates > Intermediate CA Certificates - Show key pair

### GET {{ZIABaseUrl}}/intermediateCaCertificate/downloadPublicKey/certid


## Intermediate CA Certificates > Intermediate CA Certificates - Update

### PUT {{ZIABaseUrl}}/intermediateCaCertificate/certid

**Request:**

```json
{
  "name": "Your Cert Name Update ",
  "type": "CUSTOM_SW",
  "region": "GLOBAL",
  "status": "ENABLED"
}
```


## Intermediate CA Certificates > Intermediate CA Certificates - Upload intermediate certificate

### POST {{ZIABaseUrl}}/intermediateCaCertificate/uploadCert/certid


## Intermediate CA Certificates > Intermediate CA Certificates - Upload intermediate certificate chain

### POST {{ZIABaseUrl}}/intermediateCaCertificate/uploadCertChain/cerid


## Intermediate CA Certificates > Intermediate CA Certificates - Verify key attestation

### POST {{ZIABaseUrl}}/intermediateCaCertificate/verifyKeyAttestation/certid


## IoT Report > IoT Discovery - Get all categories

### GET {{ZIABaseUrl}}/iotDiscovery/categories


## IoT Report > IoT Discovery - Get all classifications

### GET {{ZIABaseUrl}}/iotDiscovery/classifications


## IoT Report > IoT Discovery - Get all device list

### GET {{ZIABaseUrl}}/iotDiscovery/deviceList


## IoT Report > IoT Discovery - Get all device types

### GET {{ZIABaseUrl}}/iotDiscovery/deviceTypes


## Location Management > GRE Tunnel IP Addresses - Get all

### GET {{ZIABaseUrl}}/orgProvisioning/ipGreTunnelInfo


## Location Management > IP Addresses - Get all

### GET {{ZIABaseUrl}}/ipAddresses


## Location Management > Location Groups > Location Groups - Get 1

### GET {{ZIABaseUrl}}/locations/groups/123


## Location Management > Location Groups > Location Groups - Get all

### GET {{ZIABaseUrl}}/locations/groups


## Location Management > Location Groups > Location Groups - Get all (lite)

### GET {{ZIABaseUrl}}/locations/groups/lite


## Location Management > Location Groups > Location Groups - Get total count

### GET {{ZIABaseUrl}}/locations/groups/count


## Location Management > Locations - Add, Static IP

### POST {{ZIABaseUrl}}/locations

**Request:**

```json
{
  "name": "chicago-hq-gre-1",
  "ipAddresses": [
    "26.9.19.83"
  ]
}
```


## Location Management > Locations - Add, VPN Credentials

### POST {{ZIABaseUrl}}/locations

**Request:**

```json
{
  "name": "sjc-1",
  "vpnCredentials": [
    {
      "id": 12345,
      "type": "UFQDN",
      "fqdn": "sjc-1-2-test@yourcompany.com"
    }
  ]
}
```


## Location Management > Locations - Bulk delete

### POST {{ZIABaseUrl}}/locations/bulkDelete

**Request:**

```json
{
  "ids": [
    1234,
    2345
  ]
}
```


## Location Management > Locations - Delete

### DELETE {{ZIABaseUrl}}/locations/1234


## Location Management > Locations - Get 1

### GET {{ZIABaseUrl}}/locations/1234


## Location Management > Locations - Get all

### GET {{ZIABaseUrl}}/locations


## Location Management > Locations - Get all (lite)

### GET {{ZIABaseUrl}}/locations/lite


## Location Management > Locations - Get all IoT locations

### GET {{ZIABaseUrl}}/locations/lite


## Location Management > Locations - Update

### PUT {{ZIABaseUrl}}/locations/1234

**Request:**

```json
{
  "name": "sjc-2",
  "vpnCredentials": [
    {
      "id": 12345,
      "type": "UFQDN",
      "fqdn": "sjc-1x-2-test@yourcompany.com"
    }
  ]
}
```


## Location Management > Sub-locations - Add

### POST {{ZIABaseUrl}}/locations

**Request:**

```json
{
  "parentId": 6793981,
  "name": "guest-wifi",
  "ipAddresses": [
    "10.131.2.128-10.131.3.255"
  ]
}
```


## Location Management > Sub-locations - Delete

### DELETE {{ZIABaseUrl}}/locations/1234


## Location Management > Sub-locations - Get all

### GET {{ZIABaseUrl}}/locations/1234/sublocations


## Location Management > Sub-locations - Update

### PUT {{ZIABaseUrl}}/locations/6793982

**Request:**

```json
{
  "parentId": 6793981,
  "name": "guest-wifi",
  "ipAddresses": [
    "10.131.2.128-10.131.3.255"
  ],
  "sslScanEnabled": "true"
}
```


## Rule Labels > Rule Labels - Add

### POST {{ZIABaseUrl}}/ruleLabels

**Request:**

```json
{
  "name": "Your Name",
  "description": "Your description"
}
```


## Rule Labels > Rule Labels - Delete

### DELETE {{ZIABaseUrl}}/ruleLabels/64147


## Rule Labels > Rule Labels - Get 1

### GET {{ZIABaseUrl}}/ruleLabels/54079


## Rule Labels > Rule Labels - Get all

### GET {{ZIABaseUrl}}/ruleLabels


## Rule Labels > Rule Labels - Update

### PUT {{ZIABaseUrl}}/ruleLabels/64147

**Request:**

```json
{
  "id": 64147,
  "name": "Your Name",
  "description": "Your description"
}
```


## Sandbox Report > Sandbox Report - Get full

### GET {{ZIABaseUrl}}/sandbox/report/8350dED6D39DF158E51D6CFBE36FB012


## Sandbox Report > Sandbox Report - Get quota

### GET {{ZIABaseUrl}}/sandbox/report/quota


## Sandbox Report > Sandbox Report - Get summary

### GET {{ZIABaseUrl}}/sandbox/report/4EE43B71BB89CB9CBF7784495AE8D0DF


## Sandbox Settings > Custom MD5 Hash Values - Get full

### GET {{ZIABaseUrl}}/behavioralAnalysisAdvancedSettings


## Sandbox Settings > Custom MD5 Hash Values - Get quota

### GET {{ZIABaseUrl}}/behavioralAnalysisAdvancedSettings/fileHashCount


## Sandbox Settings > Custom MD5 Hash Values - Update MD5 list

### PUT {{ZIABaseUrl}}/behavioralAnalysisAdvancedSettings

**Request:**

```json
{
  "fileHashesToBeBlocked": [
    "4EE43B71BB89CB9CBF7784495AE8D0DF",
    "8350dED6D39DF158E51D6CFBE36FB012"
  ]
}
```


## Security Policy Settings > Allowlist URLs - Get all

### GET {{ZIABaseUrl}}/security


## Security Policy Settings > Allowlist URLs - Update

### PUT {{ZIABaseUrl}}/security

**Request:**

```json
{
  "whitelistUrls": [
    "wellsfargo.com",
    "paypal.com"
  ]
}
```


## Security Policy Settings > Denylist URLs - Add incr

### POST {{ZIABaseUrl}}/security/advanced/blacklistUrls

**Request:**

```json
{
  "blacklistUrls": [
    "snapchat.com",
    "tinder.com"
  ]
}
```


## Security Policy Settings > Denylist URLs - Delete incr

### POST {{ZIABaseUrl}}/security/advanced/blacklistUrls

**Request:**

```json
{
  "blacklistUrls": [
    "snapchat.com",
    "instagram.com"
  ]
}
```


## Security Policy Settings > Denylist URLs - Get all

### GET {{ZIABaseUrl}}/security/advanced


## Security Policy Settings > Denylist URLs - Update

### PUT {{ZIABaseUrl}}/security/advanced

**Request:**

```json
{
  "blacklistUrls": [
    "facebook.com",
    "tinder.com"
  ]
}
```


## Shadow IT Report > Cloud Applications > Cloud Applications - Bulk update

### PUT {{ZIABaseUrl}}/cloudApplications/bulkUpdate

**Request:**

```json
{
  "applicationIds": [
    12345
  ],
  "sanctionedState": "SANCTIONED",
  "customTags": [
    {
      "id": 1
    }
  ]
}
```


## Shadow IT Report > Cloud Applications > Cloud Applications - Get all (lite)

### GET {{ZIABaseUrl}}/cloudApplications/lite


## Shadow IT Report > Cloud Applications > Custom Tags - Get all

### GET {{ZIABaseUrl}}/customTags


## Shadow IT Report > Shadow IT Report - Cloud applications

### POST {{ZIABaseUrl}}/shadowIT/applications/export

**Request:**

```json
{
  "duration": "LAST_7_DAYS"
}
```


## Shadow IT Report > Shadow IT Report - Locations for a cloud application

### POST {{ZIABaseUrl}}/shadowIT/applications/LOCATION/exportCsv

**Request:**

```json
{
  "duration": "LAST_7_DAYS",
  "application": [
    "ONSHAPE"
  ]
}
```


## Shadow IT Report > Shadow IT Report - Users for a cloud application

### POST {{ZIABaseUrl}}/shadowIT/applications/USER/exportCsv

**Request:**

```json
{
  "duration": "LAST_7_DAYS",
  "application": [
    "ONSHAPE"
  ]
}
```


## Traffic Forwarding > Data Center VIPs > Data Center VIPs - Get all

### GET {{ZIABaseUrl}}/vips


## Traffic Forwarding > Data Center VIPs > GRE Tunnels - Get available VIPs grouped by data center

### GET {{ZIABaseUrl}}/vips/groupByDatacenter


## Traffic Forwarding > GRE Tunnels > GRE Tunnels - Add

### POST {{ZIABaseUrl}}/greTunnels

**Request:**

```json
{
  "sourceIp": "4.4.4.4",
  "primaryDestVip": {
    "id": 123,
    "virtualIp": "10.66.68.68"
  },
  "secondaryDestVip": {
    "id": 123,
    "virtualIp": "10.66.68.68"
  },
  "internalIpRange": "172.17.0.216",
  "ipUnnumbered": false,
  "comment": "Your Description"
}
```


## Traffic Forwarding > GRE Tunnels > GRE Tunnels - Delete

### DELETE {{ZIABaseUrl}}/greTunnels/123


## Traffic Forwarding > GRE Tunnels > GRE Tunnels - Get 1

### GET {{ZIABaseUrl}}/greTunnels/123


## Traffic Forwarding > GRE Tunnels > GRE Tunnels - Get all

### GET {{ZIABaseUrl}}/greTunnels


## Traffic Forwarding > GRE Tunnels > GRE Tunnels - Get available IPs

### GET {{ZIABaseUrl}}/staticIP


## Traffic Forwarding > GRE Tunnels > GRE Tunnels - Get available VIPs

### GET {{ZIABaseUrl}}/vips/recommendedList


## Traffic Forwarding > GRE Tunnels > GRE Tunnels - Get available internal GRE IP ranges

### GET {{ZIABaseUrl}}/greTunnels/availableInternalIpRanges


## Traffic Forwarding > GRE Tunnels > GRE Tunnels - Update

### PUT {{ZIABaseUrl}}/greTunnels/123

**Request:**

```json
{
  "id": 123,
  "sourceIp": "4.4.4.4",
  "primaryDestVip": {
    "id": 123,
    "virtualIp": "10.66.68.68"
  },
  "secondaryDestVip": {
    "id": 123,
    "virtualIp": "10.66.68.68"
  },
  "internalIpRange": "172.17.0.224",
  "ipUnnumbered": false,
  "comment": "Your Description"
}
```


## Traffic Forwarding > IPv6 > DNS64 Prefix - Get all

### GET {{ZIABaseUrl}}/ipv6config/dns64prefix


## Traffic Forwarding > IPv6 > IPv6 Configuration - Get details

### GET {{ZIABaseUrl}}/ipv6config


## Traffic Forwarding > IPv6 > NAT64 Prefixes - Get all

### GET {{ZIABaseUrl}}/ipv6config/nat64prefix


## Traffic Forwarding > Static IP > City Geo Info - Get by IP address

### GET {{ZIABaseUrl}}/region/byIPAddress/81.8.4.2


## Traffic Forwarding > Static IP > City Geo Info - Get by city name

### GET {{ZIABaseUrl}}/region/search


## Traffic Forwarding > Static IP > City Geo Info - Get by geo-coordinates

### GET {{ZIABaseUrl}}/region/byGeoCoordinates


## Traffic Forwarding > Static IP > Static IPs - Add, Auto region

### POST {{ZIABaseUrl}}/staticIP

**Request:**

```json
{
  "ipAddress": "1.2.3.4",
  "geoOverride": false,
  "comment": "Your Description",
  "routableIP": true
}
```


## Traffic Forwarding > Static IP > Static IPs - Add, Manual region

### POST {{ZIABaseUrl}}/staticIP

**Request:**

```json
{
  "ipAddress": "1.2.3.4",
  "geoOverride": true,
  "latitude": 1,
  "longitude": 1,
  "comment": "Your Description",
  "routableIP": true
}
```


## Traffic Forwarding > Static IP > Static IPs - Delete

### DELETE {{ZIABaseUrl}}/staticIP/123


## Traffic Forwarding > Static IP > Static IPs - Get 1

### GET {{ZIABaseUrl}}/staticIP/1234


## Traffic Forwarding > Static IP > Static IPs - Get all

### GET {{ZIABaseUrl}}/staticIP


## Traffic Forwarding > Static IP > Static IPs - Update

### PUT {{ZIABaseUrl}}/staticIP/123


## Traffic Forwarding > Static IP > Static IPs - Validate

### POST {{ZIABaseUrl}}/staticIP/validate

**Request:**

```json
{
  "ipAddress": "1.2.3.4"
}
```


## Traffic Forwarding > VPN Credentials > VPN Credentials - Add

### POST {{ZIABaseUrl}}/vpnCredentials

**Request:**

```json
{
  "type": "UFQDN",
  "fqdn": "sjc-1-37@yourcompany.com",
  "comments": "created automatically",
  "preSharedKey": "newPassword123!"
}
```


## Traffic Forwarding > VPN Credentials > VPN Credentials - Bulk delete

### POST {{ZIABaseUrl}}/vpnCredentials/bulkDelete

**Request:**

```json
{
  "ids": [
    1234,
    2345
  ]
}
```


## Traffic Forwarding > VPN Credentials > VPN Credentials - Delete

### DELETE {{ZIABaseUrl}}/vpnCredentials/1234


## Traffic Forwarding > VPN Credentials > VPN Credentials - Get 1

### GET {{ZIABaseUrl}}/vpnCredentials/1234


## Traffic Forwarding > VPN Credentials > VPN Credentials - Get all

### GET {{ZIABaseUrl}}/vpnCredentials


## Traffic Forwarding > VPN Credentials > VPN Credentials - Update

### PUT {{ZIABaseUrl}}/vpnCredentials/1234

**Request:**

```json
{
  "type": "UFQDN",
  "fqdn": "sjc-1-37@yourcompany.com",
  "comments": "created automatically",
  "preSharedKey": "newPassword123!"
}
```


## URL Categories > URL Categories - Add

### POST {{ZIABaseUrl}}/urlCategories

**Request:**

```json
{
  "configuredName": "Blogs",
  "customCategory": true,
  "superCategory": "NEWS_AND_MEDIA",
  "keywords": [
    "blog"
  ],
  "urls": [
    "livejournal.com"
  ]
}
```


## URL Categories > URL Categories - Add URLs

### PUT {{ZIABaseUrl}}/urlCategories/MUSIC

**Request:**

```json
{
  "superCategory": "ENTERTAINMENT_AND_RECREATION",
  "urls": [
    "mozart.com"
  ],
  "dbCategorizedUrls": [
    "brahms.com"
  ]
}
```


## URL Categories > URL Categories - Delete

### DELETE {{ZIABaseUrl}}/urlCategories/CUSTOM_01


## URL Categories > URL Categories - Get 1

### GET {{ZIABaseUrl}}/urlCategories/MUSIC


## URL Categories > URL Categories - Get all

### GET {{ZIABaseUrl}}/urlCategories


## URL Categories > URL Categories - Get all (lite)

### GET {{ZIABaseUrl}}/urlCategories/lite


## URL Categories > URL Categories - Get all custom

### GET {{ZIABaseUrl}}/urlCategories


## URL Categories > URL Categories - Quota

### GET {{ZIABaseUrl}}/urlCategories/urlQuota


## URL Categories > URL Categories - Remove URLs

### PUT {{ZIABaseUrl}}/urlCategories/MUSIC

**Request:**

```json
{
  "superCategory": "ENTERTAINMENT_AND_RECREATION",
  "urls": [
    "mozart.com"
  ],
  "dbCategorizedUrls": [
    "brahms.com"
  ]
}
```


## URL Categories > URL Categories - Update

### PUT {{ZIABaseUrl}}/urlCategories/CUSTOM_02

**Request:**

```json
{
  "configuredName": "Sport",
  "customCategory": true,
  "superCategory": "USER_DEFINED",
  "urls": [
    "nhl.com",
    "nba.com"
  ],
  "id": "CUSTOM_02"
}
```


## URL Categories > URL Lookup

### POST {{ZIABaseUrl}}/urlLookup

**Request:**

```json
[
  "google.com",
  "youtube.com",
  "facebook.com",
  "baidu.com",
  "wikipedia.org",
  "yahoo.com",
  "reddit.com",
  "google.co.in",
  "qq.com",
  "taobao.com",
  "amazon.com",
  "tmall.com",
  "twitter.com",
  "google.co.jp",
  "sohu.com",
  "live.com",
  "vk.com",
  "instagram.com",
  "sina.com
```


## URL Filtering Policies > URL Filtering Rules - Add

### POST {{ZIABaseUrl}}/urlFilteringRules


## URL Filtering Policies > URL Filtering Rules - Delete

### DELETE {{ZIABaseUrl}}/urlFilteringRules/{{id}}


## URL Filtering Policies > URL Filtering Rules - Get 1

### GET {{ZIABaseUrl}}/urlFilteringRules/1234


## URL Filtering Policies > URL Filtering Rules - Get all

### GET {{ZIABaseUrl}}/urlFilteringRules


## URL Filtering Policies > URL Filtering Rules - Update

### PUT {{ZIABaseUrl}}/urlFilteringRules/{{ruleid}}

**Request:**

```json
{
  "accessControl": "READ_WRITE",
  "name": "Test - Adult Content",
  "order": 1,
  "protocols": [
    "ANY_RULE"
  ],
  "urlCategories": [
    "OTHER_ADULT_MATERIAL",
    "ADULT_THEMES",
    "LINGERIE_BIKINI",
    "NUDITY",
    "PORNOGRAPHY",
    "SEXUALITY",
    "ADULT_SEX_EDUCATION",
    "K_12_S
```


## User Authentication Settings > Auth Bypass > Auth Bypass - Add to list

### POST {{ZIABaseUrl}}/authSettings/exemptedUrls

**Request:**

```json
{
  "urls": [
    "zscaler.com",
    "google.com",
    "yahoo.com"
  ]
}
```


## User Authentication Settings > Auth Bypass > Auth Bypass - Get all

### GET {{ZIABaseUrl}}/authSettings/exemptedUrls


## User Authentication Settings > Auth Bypass > Auth Bypass - Remove from list

### POST {{ZIABaseUrl}}/authSettings/exemptedUrls

**Request:**

```json
{
  "urls": [
    "google.com",
    "yahoo.com"
  ]
}
```


## User Authentication Settings > SSL Bypass > SSL Bypass - Add to list

### POST {{ZIABaseUrl}}/sslSettings/exemptedUrls

**Request:**

```json
{
  "urls": [
    "zscaler.com",
    "google.com",
    "yahoo.com"
  ]
}
```


## User Authentication Settings > SSL Bypass > SSL Bypass - Get all

### GET {{ZIABaseUrl}}/sslSettings/exemptedUrls


## User Authentication Settings > SSL Bypass > SSL Bypass - Remove from list

### POST {{ZIABaseUrl}}/sslSettings/exemptedUrls

**Request:**

```json
{
  "urls": [
    "google.com",
    "yahoo.com"
  ]
}
```


## User Management > Auditors - Get all

### GET {{ZIABaseUrl}}/users/auditors


## User Management > Departments - Get 1

### GET {{ZIABaseUrl}}/departments/1234


## User Management > Departments - Get all

### GET {{ZIABaseUrl}}/departments


## User Management > Groups - Get 1

### GET {{ZIABaseUrl}}/groups/1234


## User Management > Groups - Get all

### GET {{ZIABaseUrl}}/groups


## User Management > User References - Get all

### GET {{ZIABaseUrl}}/users/references


## User Management > Users - Add

### POST {{ZIABaseUrl}}/users

**Request:**

```json
{
  "name": "guest1234",
  "email": "guest1234@yourcompany.com",
  "groups": [
    {
      "id": 75457,
      "name": "guest-wifi"
    }
  ],
  "department": {
    "id": 75458,
    "name": "guests"
  },
  "comments": "guest wi-fi user",
  "adminUser": false,
  "password": "asd123!!"
}
```


## User Management > Users - Bulk delete

### POST {{ZIABaseUrl}}/users/bulkDelete

**Request:**

```json
{
  "ids": [
    1234,
    2345
  ]
}
```


## User Management > Users - Delete

### DELETE {{ZIABaseUrl}}/users/1234


## User Management > Users - Get 1

### GET {{ZIABaseUrl}}/users/1234


## User Management > Users - Get all

### GET {{ZIABaseUrl}}/users


## User Management > Users - Search by department

### GET {{ZIABaseUrl}}/users


## User Management > Users - Search by group

### GET {{ZIABaseUrl}}/users


## User Management > Users - Search by name

### GET {{ZIABaseUrl}}/users


## User Management > Users - Update

### PUT {{ZIABaseUrl}}/users/1

**Request:**

```json
{
  "name": "guest1234",
  "email": "guest1234@yourcompany.com",
  "groups": [
    {
      "id": 75457,
      "name": "guest-wifi"
    }
  ],
  "department": {
    "id": 75458,
    "name": "guests"
  },
  "comments": "guest wi-fi user",
  "adminUser": false,
  "password": "asd123!!"
}
```


## Workload Groups > Workload Groups - Get all

### GET {{ZIABaseUrl}}/workloadGroups

