# Activation (Legacy API — ZIA)

**Source:** https://help.zscaler.com/legacy-apis/activation
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Legacy Zscaler APIs Help 
ZIA API 
API Developer & Reference Guide 
Reference Guide 
Activation
Understanding ZIA APIs
API Developer & Reference Guide
Getting Started
Configuring the Postman REST API Client
Understanding Rate Limiting
API Response Codes and Error Messages
Reference Guide
3rd-Party App Governance API
Sandbox Submission API
Activation
/eusaStatus/latest
GET
/eusaStatus/{eusaStatusId}
PUT
/status
GET
/status/activate
POST
Admin Audit Logs
Admin & Role Management
Advanced Settings
Advanced Threat Protection Policy
Alerts
API Authentication
Authentication Settings
Bandwidth Control & Classes
Browser Control Policy
Browser Isolation
Cloud Applications
Cloud App Control Policy
Cloud Nanolog Streaming Service (NSS)
Data Loss Prevention
Device Groups
DNS Control Policy
Email Profiles
End User Notifications
Event Logs
File Type Control Policy
Firewall Policies
Forwarding Control Policy
FTP Control Policy
Intermediate CA Certificates
IoT Report
IPS Control Policy
Location Management
Malware Protection Policy
Mobile Malware Protection Policy
NAT Control Policy
Organization Details
PAC Files
Policy Export
Remote Assistance Support
Rule Labels
SaaS Security API
Sandbox Policy & Settings
Sandbox Report
Security Policy Settings
Service Edges
Shadow IT Report
SSL Inspection Policy
System Audit Report
Time Intervals
Traffic Capture Policy
Traffic Forwarding
URL Categories
URL Filtering Policy
URL & Cloud App Control Policy Settings
User Authentication Settings
User Management
Workload Groups
API Rate Limit Summary
Working with APIs
/eusaStatus/latest
GET

Retrieves the End User Subscription Agreement (EUSA) acceptance status. If the status does not exist, it returns a status object with no ID.

Parameters

No parameters
Model - EusaStatus

id
integer($int32)
System-generated identifier for the EUSA status
readonly: true
version*
Specifies the EUSA info ID version. This field is for Zscaler internal use only.
EntityReference
acceptedStatus
boolean
A Boolean value that specifies the EUSA status. If set to true, the EUSA is accepted. If set to false, the EUSA is in an 'agreement pending' state. The default value is false.
Responses
Response content type:
application/json
Code
200
Description
Successful Operation
Example Value
{
  "id": 0,
  "version": {
    "id": 0,
    "name": "string",
    "externalId": "string",
    "extensions": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  },
  "acceptedStatus": true
}
Try In Postman
/eusaStatus/{eusaStatusId}
PUT

Updates the EUSA status based on the specified status ID

Parameters

Name
Description
eusaStatusId *required
integer($int32)
(path)

The EUSA status ID
body
object
(body)

The EUSA status details
Example Value
Model
{
  "version": {
    "id": 0,
    "externalId": "string",
    "extensions": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  },
  "acceptedStatus": true
}

Parameters content type:
application/json

Model - EusaStatus

id
integer($int32)
System-generated identifier for the EUSA status
readonly: true
version*
Specifies the EUSA info ID version. This field is for Zscaler internal use only.
EntityReference
acceptedStatus
boolean
A Boolean value that specifies the EUSA status. If set to true, the EUSA is accepted. If set to false, the EUSA is in an 'agreement pending' state. The default value is false.
Responses
Response content type:
application/json
Code
200
Description
Successful Operation
Example Value
{
  "id": 0,
  "version": {
    "id": 0,
    "name": "string",
    "externalId": "string",
    "extensions": {
      "additionalProp1": "string",
      "additionalProp2": "string",
      "additionalProp3": "string"
    }
  },
  "acceptedStatus": true
}
Try In Postman
/status
GET

Gets the activation status for the saved configuration changes. To learn more about activating configuration changes, see Saving and Activating Changes in the ZIA Admin Portal.

Parameters

No parameters
Model - ActivationStatus

Organization Policy Edit/Update Activation status

status
string
Enum:
[…]3 Items
Responses
Response content type:
application/json
Code
200
Description
Successful Operation
Example Value
{
  "status": "ACTIVE"
}
Try In Postman
/status/activate
POST

Activates the saved configuration changes. To learn more, see Saving and Activating Changes in the ZIA Admin Portal.

Parameters

No parameters
Model - ActivationStatus

Organization Policy Edit/Update Activation status

status
string
Enum:
[…]3 Items
Responses
Response content type:
application/json
Code
200
Description
Successful Operation
Example Value
{
  "status": "ACTIVE"
}
Try In Postman
Was this article helpful? Click an icon below to submit feedback.
