---
product: zpa
topic: "api-postman-schemas"
title: "ZPA API schemas (from Postman collection)"
content-type: reference
last-verified: "2026-04-28"
confidence: high
source-tier: vendor
sources:
  - "vendor/zscaler-api-specs/oneapi-postman-collection.json"
author-status: draft
---

# ZPA API schemas (from Postman collection)

Request and response examples extracted from the Zscaler OneAPI Postman collection.


## Application Controller > Adds a new Application Segment for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/application

**Request:**

```json
{
  "name": "<string>",
  "adpEnabled": "<boolean>",
  "apiProtectionEnabled": "<boolean>",
  "appRecommendationId": "<string>",
  "segmentGroupId": "<string>",
  "segmentGroupName": "<string>",
  "autoAppProtectEnabled": "<boolean>",
  "bypassOnReauth": "<boolean>",
  "bypassType": "ALWAYS",
  "cli
```

**Response (201):**

```json
{
  "name": "<string>",
  "adpEnabled": "<boolean>",
  "apiProtectionEnabled": "<boolean>",
  "appRecommendationId": "<string>",
  "segmentGroupId": "<string>",
  "segmentGroupName": "<string>",
  "autoAppProtectEnabled": "<boolean>",
  "bypassOnReauth": "<boolean>",
  "bypassType": "ALWAYS",
  "cli
```


## Application Controller > Deletes the Application Segment for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/application/:applicationId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Application Controller > Get all configured BA/Inspect/PRA Application Segments.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/application/getAppsByType

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "appId": "<long>",
      "applicationPort": "<integer>",
      "applicationProtocol": "NONE",
      "certificateId": "<long>",
      "certificateName": "<string>",
      "description": "<string>",
      "domain": "<string>",
      "enabled": "<bo
```


## Application Controller > Gets all configured Application Segments for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/application

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "adpEnabled": "<boolean>",
      "apiProtectionEnabled": "<boolean>",
      "appRecommendationId": "<string>",
      "segmentGroupId": "<string>",
      "segmentGroupName": "<string>",
      "autoAppProtectEnabled": "<bo
```


## Application Controller > Gets the Application Segment details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/application/:applicationId

**Response (200):**

```json
{
  "name": "<string>",
  "adpEnabled": "<boolean>",
  "apiProtectionEnabled": "<boolean>",
  "appRecommendationId": "<string>",
  "segmentGroupId": "<string>",
  "segmentGroupName": "<string>",
  "autoAppProtectEnabled": "<boolean>",
  "bypassOnReauth": "<boolean>",
  "bypassType": "ALWAYS",
  "cli
```


## Application Controller > Moves application of one microtenant to another

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/application/:applicationId/move

**Request:**

```json
{
  "targetSegmentGroupId": "<long>",
  "targetMicrotenantId": "<long>",
  "targetServerGroupId": "<long>"
}
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Application Controller > Share the Application Segment to microtenants.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/application/:applicationId/share

**Request:**

```json
{
  "shareToMicrotenants": [
    "<long>",
    "<long>"
  ]
}
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Application Controller > Updates the Application Segment details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/application/:applicationId

**Request:**

```json
{
  "name": "<string>",
  "adpEnabled": "<boolean>",
  "apiProtectionEnabled": "<boolean>",
  "appRecommendationId": "<string>",
  "segmentGroupId": "<string>",
  "segmentGroupName": "<string>",
  "autoAppProtectEnabled": "<boolean>",
  "bypassOnReauth": "<boolean>",
  "bypassType": "ALWAYS",
  "cli
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## CBI Banner Controller > Add a CBI Banner for the specified customer.

### POST {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/banner


## CBI Banner Controller > Delete the CBI Banner for the customer based on the specified ID.

### DELETE {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/banners/:bannerId


## CBI Banner Controller > Get all CBI Banners for the specified customer.

### GET {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/banners


## CBI Banner Controller > Get the CBI Banner for the customer based on the specified ID.

### GET {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/banners/:bannerId


## CBI Banner Controller > Update the CBI Banner for the customer based on the specified ID.

### PUT {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/banners/:bannerId


## CBI Certificate Controller > Add a CBI Certificate for the specified customer.

### POST {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/certificate


## CBI Certificate Controller > Delete the CBI Certificate for the customer based on the specified ID.

### DELETE {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/certificates/:certificateId


## CBI Certificate Controller > Get all CBI Certificates for the specified customer.

### GET {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/certificates


## CBI Certificate Controller > Get the CBI Certificate for the customer based on the specified ID.

### GET {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/certificates/:certificateId


## CBI Certificate Controller > Update the CBI Certificate for the customer based on the specified ID.

### PUT {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/certificates/:certificateId


## CBI Profile Controller > Get all CBI Profiles in ZPA for the specified customer.

### GET {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/zpaprofiles


## CBI Profile Controller > add a CBI profile for the specified customer

### POST {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/profiles


## CBI Profile Controller > delete the CBI profile for the customer based on the specified Id

### DELETE {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/profiles/:profileId


## CBI Profile Controller > get all CBI Profiles for the specified customer

### GET {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/profiles


## CBI Profile Controller > get all Regions for the specified customer

### GET {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/regions


## CBI Profile Controller > get the CBI profile for the customer based on the specified Id

### GET {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/profiles/:profileId


## CBI Profile Controller > update the CBI profile for the customer based on the specified Id

### PUT {{ZPABase}}/cbiconfig/cbi/api/customers/:customerId/profiles/:profileId


## Certificate Controller > Adds a certificate with a private key for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/certificate

**Request:**

```json
{
  "certBlob": "<string>",
  "name": "<string>",
  "description": "<string>"
}
```

**Response (201):**

```json
{
  "certificate": "<string>",
  "name": "<string>",
  "certChain": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "getcName": "<string>",
  "id": "<long>",
  "issuedBy": "<string>",
  "issuedTo": "<string>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "publ
```


## Certificate Controller > Deletes the certificate for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/certificate/:certificateId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Certificate Controller > Gets all certificates for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/certificate

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "certificate": "<string>",
      "name": "<string>",
      "certChain": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "getcName": "<string>",
      "id": "<long>",
      "issuedBy": "<string>",
      "issue
```


## Certificate Controller > Gets all issued certificates for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/certificate/issued

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "certificate": "<string>",
      "name": "<string>",
      "certChain": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "getcName": "<string>",
      "id": "<long>",
      "issuedBy": "<string>",
      "issue
```


## Certificate Controller > Gets all issued certificates for the specified customer. This API will be deprecated in a future release.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/clientlessCertificate/issued

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "certificate": "<string>",
      "name": "<string>",
      "certChain": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "getcName": "<string>",
      "id": "<long>",
      "issuedBy": "<string>",
      "issue
```


## Certificate Controller > Gets the certificate details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/certificate/:certificateId

**Response (200):**

```json
{
  "certificate": "<string>",
  "name": "<string>",
  "certChain": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "getcName": "<string>",
  "id": "<long>",
  "issuedBy": "<string>",
  "issuedTo": "<string>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "publ
```


## Certificate Controller > Gets the certificate details for the specified ID. This API will be deprecated in a future release.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/clientlessCertificate/:certificateId

**Response (200):**

```json
{
  "certificate": "<string>",
  "name": "<string>",
  "certChain": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "getcName": "<string>",
  "id": "<long>",
  "issuedBy": "<string>",
  "issuedTo": "<string>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "publ
```


## Cloud Connector Group Controller > Gets all configured Cloud Connector Groups for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/cloudConnectorGroup

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "creationTime": "<integer>",
      "description": "<string>",
      "cloudConnectors": [
        {
          "name": "<string>",
          "creationTime": "<integer>",
          "description": "<string>",
          "enabled": "<boolean>",
       
```


## Cloud Connector Group Controller > Gets the Cloud Connector Group details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/cloudConnectorGroup/:id

**Response (200):**

```json
{
  "creationTime": "<integer>",
  "description": "<string>",
  "cloudConnectors": [
    {
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "enabled": "<boolean>",
      "fingerprint": "<string>",
      "id": "<long>",
      "ipAcl": [
        "<str
```


## Connector Controller > Bulk deletes the App Connectors for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/connector/bulkDelete

**Request:**

```json
{
  "ids": [
    "<long>",
    "<long>"
  ]
}
```

**Response (200):**

```json
{
  "Excepteur306": "<string>"
}
```


## Connector Controller > Configure a App Connector schedule frequency to delete the in active connectors with configured frequency.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/connectorSchedule/:id

**Request:**

```json
{
  "customerId": "<long>",
  "deleteDisabled": "<boolean>",
  "enabled": "<boolean>",
  "frequency": "<string>",
  "frequencyInterval": "<integer>",
  "id": "<long>"
}
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/connectorSchedule

**Request:**

```json
{
  "customerId": "<long>",
  "deleteDisabled": "<boolean>",
  "enabled": "<boolean>",
  "frequency": "<string>",
  "frequencyInterval": "<integer>",
  "id": "<long>"
}
```

**Response (204):**

```json
{
  "customerId": "<long>",
  "deleteDisabled": "<boolean>",
  "enabled": "<boolean>",
  "frequency": "<string>",
  "frequencyInterval": "<integer>",
  "id": "<long>"
}
```


## Connector Controller > Deletes the App Connector for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/connector/:connectorId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Connector Controller > Get a Configured App Connector schedule frequency.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/connectorSchedule

**Response (200):**

```json
{
  "customerId": "<long>",
  "deleteDisabled": "<boolean>",
  "enabled": "<boolean>",
  "frequency": "<string>",
  "frequencyInterval": "<integer>",
  "id": "<long>"
}
```


## Connector Controller > Gets all configured App Connector details for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/connector

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "applicationStartTime": "<long>",
      "appConnectorGroupId": "<string>",
      "appConnectorGroupName": "<string>",
      "assistantVersion": {
        "applicationStartTime": "<long>",
        "appConnectorGroupId": "
```


## Connector Controller > Gets the App Connector details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/connector/:connectorId

**Response (200):**

```json
{
  "name": "<string>",
  "applicationStartTime": "<long>",
  "appConnectorGroupId": "<string>",
  "appConnectorGroupName": "<string>",
  "assistantVersion": {
    "applicationStartTime": "<long>",
    "appConnectorGroupId": "<long>",
    "brokerId": "<long>",
    "creationTime": "<integer>",
    "c
```


## Connector Controller > Updates the App Connector details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/connector/:connectorId

**Request:**

```json
{
  "name": "<string>",
  "applicationStartTime": "<long>",
  "appConnectorGroupId": "<string>",
  "appConnectorGroupName": "<string>",
  "assistantVersion": {
    "applicationStartTime": "<long>",
    "appConnectorGroupId": "<long>",
    "brokerId": "<long>",
    "creationTime": "<integer>",
    "c
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Connector Group Controller > Adds a new App Connector Group for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/appConnectorGroup

**Request:**

```json
{
  "name": "<string>",
  "connectors": [
    {
      "name": "<string>",
      "applicationStartTime": "<long>",
      "appConnectorGroupId": "<string>",
      "appConnectorGroupName": "<string>",
      "assistantVersion": {
        "applicationStartTime": "<long>",
        "appConnectorGroupId": "
```

**Response (201):**

```json
{
  "name": "<string>",
  "connectors": [
    {
      "name": "<string>",
      "applicationStartTime": "<long>",
      "appConnectorGroupId": "<string>",
      "appConnectorGroupName": "<string>",
      "assistantVersion": {
        "applicationStartTime": "<long>",
        "appConnectorGroupId": "
```


## Connector Group Controller > Deletes the App Connector Group for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/appConnectorGroup/:appConnectorGroupId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Connector Group Controller > Gets all configured App Connector Groups for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/appConnectorGroup

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "connectors": [
        {
          "name": "<string>",
          "applicationStartTime": "<long>",
          "appConnectorGroupId": "<string>",
          "appConnectorGroupName": "<string>",
          "assistantVersion"
```


## Connector Group Controller > Gets the App Connector Group details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/appConnectorGroup/:appConnectorGroupId

**Response (200):**

```json
{
  "name": "<string>",
  "connectors": [
    {
      "name": "<string>",
      "applicationStartTime": "<long>",
      "appConnectorGroupId": "<string>",
      "appConnectorGroupName": "<string>",
      "assistantVersion": {
        "applicationStartTime": "<long>",
        "appConnectorGroupId": "
```


## Connector Group Controller > Updates the App Connector Group details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/appConnectorGroup/:appConnectorGroupId

**Request:**

```json
{
  "name": "<string>",
  "connectors": [
    {
      "name": "<string>",
      "applicationStartTime": "<long>",
      "appConnectorGroupId": "<string>",
      "appConnectorGroupName": "<string>",
      "assistantVersion": {
        "applicationStartTime": "<long>",
        "appConnectorGroupId": "
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Credential Controller > Adds a new privileged credential for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/credential

**Request:**

```json
{
  "credentialType": "USERNAME_PASSWORD",
  "name": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "id": "<long>",
  "lastCredentialResetTime": "<integer>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "passphrase": "<string>",
  "password": "<string>",
  "p
```

**Response (201):**

```json
{
  "credentialType": "USERNAME_PASSWORD",
  "name": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "id": "<long>",
  "lastCredentialResetTime": "<integer>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "passphrase": "<string>",
  "password": "<string>",
  "p
```


## Credential Controller > Deletes the privileged credential for the specified ID. 

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/credential/:id

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Credential Controller > Gets all configured privileged credentials for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/credential

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "credentialType": "PASSWORD",
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "id": "<long>",
      "lastCredentialResetTime": "<integer>",
      "modifiedBy": "<long>",
      "modifiedTime": "<
```


## Credential Controller > Gets the privileged credential details for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/credential/:id

**Response (200):**

```json
{
  "credentialType": "USERNAME_PASSWORD",
  "name": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "id": "<long>",
  "lastCredentialResetTime": "<integer>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "passphrase": "<string>",
  "password": "<string>",
  "p
```


## Credential Controller > Move Privileged credential from one microtenant to another microtenant

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/credential/:id/move

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Credential Controller > Updates the privileged credential details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/credential/:id

**Request:**

```json
{
  "credentialType": "USERNAME_PASSWORD",
  "name": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "id": "<long>",
  "lastCredentialResetTime": "<integer>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "passphrase": "<string>",
  "password": "<string>",
  "p
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Customer Controller > Gets the authentication domains for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/authDomains

**Response (200):**

```json
{
  "authDomains": [
    "<string>",
    "<string>"
  ]
}
```


## Customer Version Profile Controller > Gets all visible Version Profiles for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/visible/versionProfiles

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "upgradePriority": "DAY",
      "creationTime": "<integer>",
      "customScopeCustomerIds": [
        {
          "customerId": "<long>",
          "excludeConstellation": "<boolean>",
          "isPartner": "<boolean>"
```


## Emergency Access Controller > Activates the emergency access user for the specified customer.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/emergencyAccess/user/:userId/activate

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Emergency Access Controller > Creates an emergency access user for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/emergencyAccess/user

**Request:**

```json
{
  "emailId": "<string>",
  "firstName": "<string>",
  "lastName": "<string>",
  "activatedOn": "<long>",
  "allowedActivate": "<boolean>",
  "allowedDeactivate": "<boolean>",
  "lastLoginTime": "<long>",
  "updateEnabled": "<boolean>",
  "userId": "<string>",
  "userStatus": "<string>"
}
```

**Response (201):**

```json
{
  "emailId": "<string>",
  "firstName": "<string>",
  "lastName": "<string>",
  "activatedOn": "<long>",
  "allowedActivate": "<boolean>",
  "allowedDeactivate": "<boolean>",
  "lastLoginTime": "<long>",
  "updateEnabled": "<boolean>",
  "userId": "<string>",
  "userStatus": "<string>"
}
```


## Emergency Access Controller > Deactivates the emergency access user for the specified customer.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/emergencyAccess/user/:userId/deactivate

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Emergency Access Controller > Gets all emergency access users for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/emergencyAccess/users

**Response (200):**

```json
{
  "items": [
    {
      "emailId": "<string>",
      "firstName": "<string>",
      "lastName": "<string>",
      "activatedOn": "<long>",
      "allowedActivate": "<boolean>",
      "allowedDeactivate": "<boolean>",
      "lastLoginTime": "<long>",
      "updateEnabled": "<boolean>",
      "user
```


## Emergency Access Controller > Gets the emergency access user for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/emergencyAccess/user/:userId

**Response (200):**

```json
{
  "emailId": "<string>",
  "firstName": "<string>",
  "lastName": "<string>",
  "activatedOn": "<long>",
  "allowedActivate": "<boolean>",
  "allowedDeactivate": "<boolean>",
  "lastLoginTime": "<long>",
  "updateEnabled": "<boolean>",
  "userId": "<string>",
  "userStatus": "<string>"
}
```


## Emergency Access Controller > Updates the emergency access user for the specified customer.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/emergencyAccess/user/:userId

**Request:**

```json
{
  "firstName": "<string>",
  "lastName": "<string>"
}
```

**Response (200):**

```json
{
  "emailId": "<string>",
  "firstName": "<string>",
  "lastName": "<string>",
  "activatedOn": "<long>",
  "allowedActivate": "<boolean>",
  "allowedDeactivate": "<boolean>",
  "lastLoginTime": "<long>",
  "updateEnabled": "<boolean>",
  "userId": "<string>",
  "userStatus": "<string>"
}
```


## Enrollment Certificate Controller > Gets all configured enrollment certificate details for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/enrollmentCert

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "certificate": "<string>",
      "name": "<string>",
      "allowSigning": "<boolean>",
      "clientCertType": "ZAPP_CLIENT",
      "creationTime": "<integer>",
      "csr": "<string>",
      "description": "<string>",
      "getcName": "<string
```


## Enrollment Certificate Controller > Gets the enrollment certificate details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/enrollmentCert/:enrollmentCertId

**Response (200):**

```json
{
  "certificate": "<string>",
  "name": "<string>",
  "allowSigning": "<boolean>",
  "clientCertType": "ZAPP_CLIENT",
  "creationTime": "<integer>",
  "csr": "<string>",
  "description": "<string>",
  "getcName": "<string>",
  "id": "<long>",
  "issuedBy": "<string>",
  "issuedTo": "<string>",
  "m
```


## IdP Controller > Gets all configured IdP details for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/idp

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "adminMetadata": {
        "certificateUrl": "<string>",
        "spBaseUrl": "<string>",
        "spEntityId": "<string>",
        "spMetadataUrl": "<string>",
        "spPostUrl": "<string>"
      },
      "adminSpSign
```


## IdP Controller > Gets details of the IdP for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/idp/:idpId

**Response (200):**

```json
{
  "name": "<string>",
  "adminMetadata": {
    "certificateUrl": "<string>",
    "spBaseUrl": "<string>",
    "spEntityId": "<string>",
    "spMetadataUrl": "<string>",
    "spPostUrl": "<string>"
  },
  "adminSpSigningCertId": "<long>",
  "autoProvision": "<integer>",
  "certificates": [
    {
  
```


## Inspection Control Controller > Add a new custom control for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/custom

**Request:**

```json
{
  "name": "<string>",
  "action": "BLOCK",
  "actionValue": "<string>",
  "associatedInspectionProfileNames": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "controlNumber": "<integer>",
  "controlRuleJson": "<string>
```

**Response (201):**

```json
{
  "name": "<string>",
  "action": "BLOCK",
  "actionValue": "<string>",
  "associatedInspectionProfileNames": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "controlNumber": "<integer>",
  "controlRuleJson": "<string>
```


## Inspection Control Controller > Deletes the custom control for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/custom/:id

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Inspection Control Controller > Get all versions of the predefined inspection controls for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/predefined/versions

**Response (200):**

```json
[
  "<string>",
  "<string>"
]
```


## Inspection Control Controller > Get the predefined control for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/predefined/:id

**Response (200):**

```json
{
  "name": "<string>",
  "action": "BLOCK",
  "actionValue": "<string>",
  "associatedInspectionProfileNames": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "attachment": "<string>",
  "controlGroup": "<string>",
  "c
```


## Inspection Control Controller > Gets all custom controls for a customer and sorts by control number for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/custom

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "action": "BLOCK",
      "actionValue": "<string>",
      "associatedInspectionProfileNames": [
        {
          "id": "<long>",
          "name": "<string>"
        },
        {
          "id": "<long>",
          "n
```


## Inspection Control Controller > Gets all predefined inspection controls for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/predefined

**Response (200):**

```json
[
  {
    "controlGroup": "<string>",
    "defaultGroup": "<boolean>",
    "predefinedInspectionControls": [
      {
        "name": "<string>",
        "action": "REDIRECT",
        "actionValue": "<string>",
        "associatedInspectionProfileNames": [
          {
            "id": "<long>",
    
```


## Inspection Control Controller > Gets the custom control for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/custom/:id

**Response (200):**

```json
{
  "name": "<string>",
  "action": "BLOCK",
  "actionValue": "<string>",
  "associatedInspectionProfileNames": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "controlNumber": "<integer>",
  "controlRuleJson": "<string>
```


## Inspection Control Controller > Gets the insepction profile name for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/custom/:id/profiles

**Response (200):**

```json
[
  {
    "id": "<long>",
    "name": "<string>"
  },
  {
    "id": "<long>",
    "name": "<string>"
  }
]
```


## Inspection Control Controller > Gets the inspection control action types for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/actionTypes

**Response (200):**

```json
[
  "<string>",
  "<string>"
]
```


## Inspection Control Controller > Gets the inspection control severity types for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/severityTypes

**Response (200):**

```json
[
  "<string>",
  "<string>"
]
```


## Inspection Control Controller > Gets the inspection control types for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/controlTypes

**Response (200):**

```json
[
  "<string>",
  "<string>"
]
```


## Inspection Control Controller > Gets the inspection custom control types.

### GET {{ZPABase}}/mgmtconfig/v1/admin/inspectionControls/customControlTypes

**Response (200):**

```json
{
  "nostrud_8a": [
    "RESPONSE_HEADERS",
    "REQUEST_METHOD"
  ]
}
```


## Inspection Control Controller > Gets the supported HTTP methods in custom controls for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/custom/httpMethods

**Response (200):**

```json
[
  "<string>",
  "<string>"
]
```


## Inspection Control Controller > Updates the existing custom control for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionControls/custom/:id

**Request:**

```json
{
  "name": "<string>",
  "action": "BLOCK",
  "actionValue": "<string>",
  "associatedInspectionProfileNames": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "controlNumber": "<integer>",
  "controlRuleJson": "<string>
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Inspection Profile Controller > Adds a new inspection profile for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionProfile

**Request:**

```json
{
  "name": "<string>",
  "paranoiaLevel": "<integer>",
  "apiProfile": "<boolean>",
  "checkControlDeploymentStatus": "<boolean>",
  "controlsInfo": [
    {
      "controlType": "PREDEFINED",
      "count": "<long>"
    },
    {
      "controlType": "API_PREDEFINED",
      "count": "<long>"
    }
 
```

**Response (201):**

```json
{
  "name": "<string>",
  "paranoiaLevel": "<integer>",
  "apiProfile": "<boolean>",
  "checkControlDeploymentStatus": "<boolean>",
  "controlsInfo": [
    {
      "controlType": "PREDEFINED",
      "count": "<long>"
    },
    {
      "controlType": "API_PREDEFINED",
      "count": "<long>"
    }
 
```


## Inspection Profile Controller > Deletes the inspection profile for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionProfile/:inspectionProfileId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Inspection Profile Controller > Gets all configured inspection profiles for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionProfile

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "paranoiaLevel": "<integer>",
      "apiProfile": "<boolean>",
      "checkControlDeploymentStatus": "<boolean>",
      "controlsInfo": [
        {
          "controlType": "CUSTOM",
          "count": "<long>"
        }
```


## Inspection Profile Controller > Gets the inspection profile details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionProfile/:inspectionProfileId

**Response (200):**

```json
{
  "name": "<string>",
  "paranoiaLevel": "<integer>",
  "apiProfile": "<boolean>",
  "checkControlDeploymentStatus": "<boolean>",
  "controlsInfo": [
    {
      "controlType": "PREDEFINED",
      "count": "<long>"
    },
    {
      "controlType": "API_PREDEFINED",
      "count": "<long>"
    }
 
```


## Inspection Profile Controller > Updates the inspection profile and controls for the specified ID.

### PATCH {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionProfile/:inspectionProfileId/patch

**Request:**

```json
{
  "name": "<string>",
  "paranoiaLevel": "<integer>",
  "apiProfile": "<boolean>",
  "checkControlDeploymentStatus": "<boolean>",
  "controlsInfo": [
    {
      "controlType": "PREDEFINED",
      "count": "<long>"
    },
    {
      "controlType": "API_PREDEFINED",
      "count": "<long>"
    }
 
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Inspection Profile Controller > Updates the inspection profile for the specified ID and associates all predefined controls to a profile.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionProfile/:inspectionProfileId/associateAllPredefinedControls

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Inspection Profile Controller > Updates the inspection profile for the specified ID and dissociates all predefined controls from a profile.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionProfile/:inspectionProfileId/dissociateAllPredefinedControls

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Inspection Profile Controller > Updates the inspection profile for the specified ID and dissociates all predefined controls from a profile. This API will be deprecated in a future release.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionProfile/:inspectionProfileId/deAssociateAllPredefinedControls

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Inspection Profile Controller > Updates the inspection profile for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/inspectionProfile/:inspectionProfileId

**Request:**

```json
{
  "name": "<string>",
  "paranoiaLevel": "<integer>",
  "apiProfile": "<boolean>",
  "checkControlDeploymentStatus": "<boolean>",
  "controlsInfo": [
    {
      "controlType": "PREDEFINED",
      "count": "<long>"
    },
    {
      "controlType": "API_PREDEFINED",
      "count": "<long>"
    }
 
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Isolation Profile Controller > Gets all isolation profiles for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/isolation/profiles

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "isolationProfileId": "<string>",
      "isolationTenantId": "<string>",
      "isolationUrl": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "enabled": "<boolean>",
      "id": "<l
```


## Log Streaming Service (LSS) Configuration Controller > Add a new LSS configuration for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/lssConfig

**Request:**

```json
{
  "config": {
    "lssHost": "<string>",
    "lssPort": "<integer>",
    "name": "<string>",
    "auditMessage": "<string>",
    "creationTime": "<integer>",
    "description": "<string>",
    "enabled": "<boolean>",
    "filter": [
      "<string>",
      "<string>"
    ],
    "format": "<string>
```

**Response (201):**

```json
{
  "config": {
    "lssHost": "<string>",
    "lssPort": "<integer>",
    "name": "<string>",
    "auditMessage": "<string>",
    "creationTime": "<integer>",
    "description": "<string>",
    "enabled": "<boolean>",
    "filter": [
      "<string>",
      "<string>"
    ],
    "format": "<string>
```


## Log Streaming Service (LSS) Configuration Controller > Deletes the LSS configuration for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/lssConfig/:lssId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Log Streaming Service (LSS) Configuration Controller > Gets a list of LSS status codes.

### GET {{ZPABase}}/mgmtconfig/v2/admin/lssConfig/statusCodes

**Response (200):**

```json
{
  "empty": "<boolean>"
}
```


## Log Streaming Service (LSS) Configuration Controller > Gets all LSS client types for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v2/admin/lssConfig/customers/:customerId/clientTypes

**Response (200):**

```json
{
  "Excepteur306": "<string>"
}
```


## Log Streaming Service (LSS) Configuration Controller > Gets all LSS client types. This API will be deprecated in a future release.

### GET {{ZPABase}}/mgmtconfig/v2/admin/lssConfig/clientTypes

**Response (200):**

```json
{
  "Excepteur306": "<string>"
}
```


## Log Streaming Service (LSS) Configuration Controller > Gets all LSS configurations for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/lssConfig

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "config": {
        "lssHost": "<string>",
        "lssPort": "<integer>",
        "name": "<string>",
        "auditMessage": "<string>",
        "creationTime": "<integer>",
        "description": "<string>",
        "enabled": "<boolean>",
   
```


## Log Streaming Service (LSS) Configuration Controller > Gets all LSS log formats for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/lssConfig/logType/formats

**Response (200):**

```json
{
  "empty": "<boolean>"
}
```


## Log Streaming Service (LSS) Configuration Controller > Gets all LSS log formats.

### GET {{ZPABase}}/mgmtconfig/v2/admin/lssConfig/logType/formats

**Response (200):**

```json
{
  "empty": "<boolean>"
}
```


## Log Streaming Service (LSS) Configuration Controller > Gets the LSS configuration details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/lssConfig/:lssId

**Response (200):**

```json
{
  "config": {
    "lssHost": "<string>",
    "lssPort": "<integer>",
    "name": "<string>",
    "auditMessage": "<string>",
    "creationTime": "<integer>",
    "description": "<string>",
    "enabled": "<boolean>",
    "filter": [
      "<string>",
      "<string>"
    ],
    "format": "<string>
```


## Log Streaming Service (LSS) Configuration Controller > Updates the LSS configuration for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/lssConfig/:lssId

**Request:**

```json
{
  "config": {
    "lssHost": "<string>",
    "lssPort": "<integer>",
    "name": "<string>",
    "auditMessage": "<string>",
    "creationTime": "<integer>",
    "description": "<string>",
    "enabled": "<boolean>",
    "filter": [
      "<string>",
      "<string>"
    ],
    "format": "<string>
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Machine Group Controller > Get all configured Machine Groups for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/machineGroup

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "enabled": "<boolean>",
      "id": "<long>",
      "machines": [
        {
          "name": "<string>",
          "creationTime": "<integer>",
       
```


## Machine Group Controller > Gets details of the Machine Group for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/machineGroup/:Id

**Response (200):**

```json
{
  "name": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "enabled": "<boolean>",
  "id": "<long>",
  "machines": [
    {
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "fingerprint": "<string>",
      "id": "<long>",
 
```


## Microtenant Controller > Adds a new Microtenant for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/microtenants

**Request:**

```json
{
  "creationTime": "<integer>",
  "criteriaAttribute": "<string>",
  "criteriaAttributeValues": [
    "<string>",
    "<string>"
  ],
  "description": "<string>",
  "enabled": "<boolean>",
  "id": "<string>",
  "modifiedBy": "<string>",
  "modifiedTime": "<integer>",
  "name": "<string>",
  "priori
```

**Response (201):**

```json
{
  "name": "<string>",
  "operator": "OR",
  "creationTime": "<integer>",
  "criteriaAttribute": "<string>",
  "criteriaAttributeValues": [
    "<string>",
    "<string>"
  ],
  "description": "<string>",
  "enabled": "<boolean>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<inte
```


## Microtenant Controller > Deletes the Microtenant for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/microtenants/:microtenantId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Microtenant Controller > Gets all configured Microtenants for the specified customer based on given filters.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/microtenants/search

**Request:**

```json
{
  "filterBy": [
    {
      "commaSepValues": "<string>",
      "filterName": "<string>",
      "operator": "<string>",
      "values": [
        "<string>",
        "<string>"
      ]
    },
    {
      "commaSepValues": "<string>",
      "filterName": "<string>",
      "operator": "<string>",
  
```

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "operator": "OR",
      "creationTime": "<integer>",
      "criteriaAttribute": "<string>",
      "criteriaAttributeValues": [
        "<string>",
        "<string>"
      ],
      "description": "<string>",
      "enabl
```


## Microtenant Controller > Gets all configured Microtenants for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/microtenants

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "operator": "OR",
      "creationTime": "<integer>",
      "criteriaAttribute": "<string>",
      "criteriaAttributeValues": [
        "<string>",
        "<string>"
      ],
      "description": "<string>",
      "enabl
```


## Microtenant Controller > Gets the given Microtenant details for the specified customer

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/microtenants/:microtenantId

**Response (200):**

```json
{
  "name": "<string>",
  "operator": "OR",
  "creationTime": "<integer>",
  "criteriaAttribute": "<string>",
  "criteriaAttributeValues": [
    "<string>",
    "<string>"
  ],
  "description": "<string>",
  "enabled": "<boolean>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<inte
```


## Microtenant Controller > Gets the name and ID of the configured Microtenant for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/microtenants/summary

**Response (200):**

```json
[
  {
    "id": "<long>",
    "name": "<string>"
  },
  {
    "id": "<long>",
    "name": "<string>"
  }
]
```


## Microtenant Controller > Returns the details of the current session.

### GET {{ZPABase}}/mgmtconfig/v1/admin/me

**Response (200):**

```json
{
  "customerId": "<long>",
  "customerName": "<string>",
  "microtenantId": "<long>",
  "microtenantName": "<string>"
}
```


## Microtenant Controller > Updates the Microtenant details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/microtenants/:microtenantId

**Request:**

```json
{
  "creationTime": "<integer>",
  "criteriaAttribute": "<string>",
  "criteriaAttributeValues": [
    "<string>",
    "<string>"
  ],
  "description": "<string>",
  "enabled": "<boolean>",
  "id": "<string>",
  "modifiedBy": "<string>",
  "modifiedTime": "<integer>",
  "name": "<string>",
  "priori
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## PRA Approval Controller > Adds a new privileged approval for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/approval

**Request:**

```json
{
  "applications": [
    {
      "name": "<string>",
      "adpEnabled": "<boolean>",
      "apiProtectionEnabled": "<boolean>",
      "autoAppProtectEnabled": "<boolean>",
      "bypassOnReauth": "<boolean>",
      "bypassType": "ON_NET",
      "cnameConfig": "FLATTEN",
      "configSpace": "DEFAU
```

**Response (201):**

```json
{
  "applications": [
    {
      "name": "<string>",
      "adpEnabled": "<boolean>",
      "apiProtectionEnabled": "<boolean>",
      "autoAppProtectEnabled": "<boolean>",
      "bypassOnReauth": "<boolean>",
      "bypassType": "ON_NET",
      "cnameConfig": "FLATTEN",
      "configSpace": "DEFAU
```


## PRA Approval Controller > Deletes all expired privileged approvals for the specified customer.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/approval/expired

**Response (200):**

```json
{}
```


## PRA Approval Controller > Deletes the privileged approval for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/approval/:id

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## PRA Approval Controller > Gets all configured privileged approvals for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/approval

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "applications": [
        {
          "name": "<string>",
          "adpEnabled": "<boolean>",
          "apiProtectionEnabled": "<boolean>",
          "autoAppProtectEnabled": "<boolean>",
          "bypassOnReauth": "<boolean>",
          "bypa
```


## PRA Approval Controller > Gets the privileged approval details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/approval/:id

**Response (200):**

```json
{
  "applications": [
    {
      "name": "<string>",
      "adpEnabled": "<boolean>",
      "apiProtectionEnabled": "<boolean>",
      "autoAppProtectEnabled": "<boolean>",
      "bypassOnReauth": "<boolean>",
      "bypassType": "ON_NET",
      "cnameConfig": "FLATTEN",
      "configSpace": "DEFAU
```


## PRA Approval Controller > Updates the privileged approval details for the specified ID. 

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/approval/:id

**Request:**

```json
{
  "applications": [
    {
      "name": "<string>",
      "adpEnabled": "<boolean>",
      "apiProtectionEnabled": "<boolean>",
      "autoAppProtectEnabled": "<boolean>",
      "bypassOnReauth": "<boolean>",
      "bypassType": "ON_NET",
      "cnameConfig": "FLATTEN",
      "configSpace": "DEFAU
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## PRA Console Controller > Adds a new privileged console for the specified privileged portal and customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praConsole

**Request:**

```json
{
  "name": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "enabled": "<boolean>",
  "iconText": "<string>",
  "id": "<long>",
  "inconsistentConfigDetails": {
    "application": [
      {
        "name": "<string>",
        "reason": "<string>"
      },
      {
        "n
```

**Response (201):**

```json
{
  "name": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "enabled": "<boolean>",
  "iconText": "<string>",
  "id": "<long>",
  "inconsistentConfigDetails": {
    "application": [
      {
        "name": "<string>",
        "reason": "<string>"
      },
      {
        "n
```


## PRA Console Controller > Creates a list of privileged consoles for the specified privileged portal and customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praConsole/bulk

**Request:**

```json
[
  {
    "name": "<string>",
    "creationTime": "<integer>",
    "description": "<string>",
    "enabled": "<boolean>",
    "iconText": "<string>",
    "id": "<long>",
    "inconsistentConfigDetails": {
      "application": [
        {
          "name": "<string>",
          "reason": "<string>"
 
```

**Response (201):**

```json
[
  {
    "name": "<string>",
    "creationTime": "<integer>",
    "description": "<string>",
    "enabled": "<boolean>",
    "iconText": "<string>",
    "id": "<long>",
    "inconsistentConfigDetails": {
      "application": [
        {
          "name": "<string>",
          "reason": "<string>"
 
```


## PRA Console Controller > Deletes the privileged console for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praConsole/:id

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## PRA Console Controller > Gets all configured privileged consoles for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praConsole

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "enabled": "<boolean>",
      "iconText": "<string>",
      "id": "<long>",
      "inconsistentConfigDetails": {
        "application": [
          {
  
```


## PRA Console Controller > Gets the privileged console details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praConsole/:id

**Response (200):**

```json
{
  "name": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "enabled": "<boolean>",
  "iconText": "<string>",
  "id": "<long>",
  "inconsistentConfigDetails": {
    "application": [
      {
        "name": "<string>",
        "reason": "<string>"
      },
      {
        "n
```


## PRA Console Controller > Gets the privileged consoles for the specified ID of the privileged portal.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praConsole/praPortal/:portalId

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "enabled": "<boolean>",
      "iconText": "<string>",
      "id": "<long>",
      "inconsistentConfigDetails": {
        "application": [
          {
  
```


## PRA Console Controller > Updates the privileged console details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praConsole/:id

**Request:**

```json
{
  "name": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "enabled": "<boolean>",
  "iconText": "<string>",
  "id": "<long>",
  "inconsistentConfigDetails": {
    "application": [
      {
        "name": "<string>",
        "reason": "<string>"
      },
      {
        "n
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## PRA Portal Controller > Adds a new privileged portal for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praPortal

**Request:**

```json
{
  "name": "<string>",
  "certificateId": "<long>",
  "certificateName": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "domain": "<string>",
  "enabled": "<boolean>",
  "getcName": "<string>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "
```

**Response (201):**

```json
{
  "name": "<string>",
  "certificateId": "<long>",
  "certificateName": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "domain": "<string>",
  "enabled": "<boolean>",
  "getcName": "<string>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "
```


## PRA Portal Controller > Deletes the privileged portal for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praPortal/:id

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## PRA Portal Controller > Gets all configured privileged portals for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praPortal

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "certificateId": "<long>",
      "certificateName": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "domain": "<string>",
      "enabled": "<boolean>",
      "getcName": "<string>",

```


## PRA Portal Controller > Gets the privileged portal details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praPortal/:id

**Response (200):**

```json
{
  "name": "<string>",
  "certificateId": "<long>",
  "certificateName": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "domain": "<string>",
  "enabled": "<boolean>",
  "getcName": "<string>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "
```


## PRA Portal Controller > Updates the privileged portal for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/praPortal/:id

**Request:**

```json
{
  "name": "<string>",
  "certificateId": "<long>",
  "certificateName": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "domain": "<string>",
  "enabled": "<boolean>",
  "getcName": "<string>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Policy Set Controller > Add a new policy rule for a given policy.

### POST {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/policySet/:policySetId/rule

**Request:**

```json
{
  "action": "RE_AUTH",
  "name": "<string>",
  "actionId": "<long>",
  "appServerGroups": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "appConnectorGroups": [
    {
      "id": "<long>",
      "name": "<string>"
   
```

**Response (201):**

```json
{
  "action": "NEVER",
  "name": "<string>",
  "operator": "AND",
  "policyType": "<integer>",
  "actionId": "<long>",
  "appServerGroups": [
    {
      "configSpace": "SIEM",
      "enabled": "<boolean>",
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
```


## Policy Set Controller > Adds a new policy rule for the specified policy set.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/policySet/:policySetId/rule

**Request:**

```json
{
  "action": "NEVER",
  "name": "<string>",
  "operator": "AND",
  "policyType": "<integer>",
  "actionId": "<long>",
  "appServerGroups": [
    {
      "configSpace": "SIEM",
      "enabled": "<boolean>",
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
```

**Response (201):**

```json
{
  "action": "NEVER",
  "name": "<string>",
  "operator": "AND",
  "policyType": "<integer>",
  "actionId": "<long>",
  "appServerGroups": [
    {
      "configSpace": "SIEM",
      "enabled": "<boolean>",
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
```


## Policy Set Controller > Bulk reorders all the rules in a policy set. Execute this API only once to reorder the rules

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/policySet/:policySetId/reorder

**Request:**

```json
[
  "<long>",
  "<long>"
]
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Policy Set Controller > Deletes the rule in a policy for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/policySet/:policySetId/rule/:ruleId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Policy Set Controller > Gets all client types for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/clientTypes

**Response (200):**

```json
{
  "Excepteur306": "<string>"
}
```


## Policy Set Controller > Gets all platforms for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/platform

**Response (200):**

```json
{
  "Excepteur306": "<string>"
}
```


## Policy Set Controller > Gets paginated policy rules for the specified policy type.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/policySet/rules/policyType/:policyType

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "action": "NO_DOWNLOAD",
      "name": "<string>",
      "operator": "AND",
      "policyType": "<integer>",
      "actionId": "<long>",
      "appServerGroups": [
        {
          "configSpace": "DEFAULT",
          "enabled": "<boolean>",
  
```


## Policy Set Controller > Gets the policy set for the specified policy type.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/policySet/policyType/:policyType

**Response (200):**

```json
{
  "enabled": "<boolean>",
  "name": "<string>",
  "policyType": "<integer>",
  "creationTime": "<integer>",
  "description": "<string>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "rules": [
    {
      "action": "REDIRECT_DEFAULT",
      "name": "<string>",
     
```


## Policy Set Controller > Gets the rule in a policy for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/policySet/:policySetId/rule/:ruleId

**Response (200):**

```json
{
  "action": "NEVER",
  "name": "<string>",
  "operator": "AND",
  "policyType": "<integer>",
  "actionId": "<long>",
  "appServerGroups": [
    {
      "configSpace": "SIEM",
      "enabled": "<boolean>",
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
```


## Policy Set Controller > Update a rule in a policy.

### PUT {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/policySet/:policySetId/rule/:ruleId

**Request:**

```json
{
  "action": "RE_AUTH",
  "name": "<string>",
  "actionId": "<long>",
  "appServerGroups": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "appConnectorGroups": [
    {
      "id": "<long>",
      "name": "<string>"
   
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Policy Set Controller > Updates the rule in a policy for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/policySet/:policySetId/rule/:ruleId

**Request:**

```json
{
  "action": "NEVER",
  "name": "<string>",
  "operator": "AND",
  "policyType": "<integer>",
  "actionId": "<long>",
  "appServerGroups": [
    {
      "configSpace": "SIEM",
      "enabled": "<boolean>",
      "name": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Policy Set Controller > Updates the rule order for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/policySet/:policySetId/rule/:ruleId/reorder/:newOrder

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Posture Profile Controller > Gets all posture profiles for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/posture

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "applyToMachineTunnelEnabled": "<boolean>",
      "creationTime": "<integer>",
      "crlCheckEnabled": "<boolean>",
      "domain": "<string>",
      "id": "<long>",
      "masterCustomerId": "<string>",
      "modified
```


## Posture Profile Controller > Gets the configured posture profile for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/posture/:id

**Response (200):**

```json
{
  "name": "<string>",
  "applyToMachineTunnelEnabled": "<boolean>",
  "creationTime": "<integer>",
  "crlCheckEnabled": "<boolean>",
  "domain": "<string>",
  "id": "<long>",
  "masterCustomerId": "<string>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "nonExportablePrivateKeyEnable
```


## Provisioning Key Controller > Adds a new Provisioning Key for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/associationType/:associationType/provisioningKey

**Request:**

```json
{
  "enrollmentCertId": "<long>",
  "name": "<string>",
  "creationTime": "<integer>",
  "enabled": "<boolean>",
  "expirationInEpochSec": "<integer>",
  "id": "<long>",
  "ipAcl": [
    "<string>",
    "<string>"
  ],
  "maxUsage": "<integer>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>
```

**Response (200):**

```json
{
  "enrollmentCertId": "<long>",
  "name": "<string>",
  "creationTime": "<integer>",
  "enabled": "<boolean>",
  "expirationInEpochSec": "<integer>",
  "id": "<long>",
  "ipAcl": [
    "<string>",
    "<string>"
  ],
  "maxUsage": "<integer>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>
```


## Provisioning Key Controller > Deletes the Provisioning Key for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/associationType/:associationType/provisioningKey/:provisioningKeyId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Provisioning Key Controller > Gets details of all configured Provisioning Keys for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/associationType/:associationType/provisioningKey

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "enrollmentCertId": "<long>",
      "name": "<string>",
      "creationTime": "<integer>",
      "enabled": "<boolean>",
      "expirationInEpochSec": "<integer>",
      "id": "<long>",
      "ipAcl": [
        "<string>",
        "<string>"
    
```


## Provisioning Key Controller > Gets details of the Provisioning Key for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/associationType/:associationType/provisioningKey/:provisioningKeyId

**Response (200):**

```json
{
  "enrollmentCertId": "<long>",
  "name": "<string>",
  "creationTime": "<integer>",
  "enabled": "<boolean>",
  "expirationInEpochSec": "<integer>",
  "id": "<long>",
  "ipAcl": [
    "<string>",
    "<string>"
  ],
  "maxUsage": "<integer>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>
```


## Provisioning Key Controller > Updates the Provisioning Key details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/associationType/:associationType/provisioningKey/:provisioningKeyId

**Request:**

```json
{
  "enrollmentCertId": "<long>",
  "name": "<string>",
  "creationTime": "<integer>",
  "enabled": "<boolean>",
  "expirationInEpochSec": "<integer>",
  "id": "<long>",
  "ipAcl": [
    "<string>",
    "<string>"
  ],
  "maxUsage": "<integer>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## SAML Attribute Controller > Get all SAML attributes by page.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/samlAttribute

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "idpId": "<long>",
      "name": "<string>",
      "samlName": "<string>",
      "creationTime": "<integer>",
      "delta": "<string>",
      "id": "<long>",
      "idpName": "<string>",
      "modifiedBy": "<long>",
      "modifiedTime": "<inte
```


## SAML Attribute Controller > Gets all SAML attributes configured for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/samlAttribute/idp/:idpId

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "idpId": "<long>",
      "name": "<string>",
      "samlName": "<string>",
      "creationTime": "<integer>",
      "delta": "<string>",
      "id": "<long>",
      "idpName": "<string>",
      "modifiedBy": "<long>",
      "modifiedTime": "<inte
```


## SAML Attribute Controller > Gets the SAML attribute details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/samlAttribute/:attrId

**Response (200):**

```json
{
  "idpId": "<long>",
  "name": "<string>",
  "samlName": "<string>",
  "creationTime": "<integer>",
  "delta": "<string>",
  "id": "<long>",
  "idpName": "<string>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "userAttribute": "<boolean>"
}
```


## SCIM Attribute Header Controller > Gets all SCIM attribute values for the specified ID.

### GET {{ZPABase}}/userconfig/v1/customers/:customerId/scimattribute/idpId/:idpId/attributeId/:attributeId

**Response (200):**

```json
{
  "totalPages": "<integer>",
  "totalCount": "<long>",
  "list": [
    "<string>",
    "<string>"
  ]
}
```


## SCIM Attribute Header Controller > Gets all SCIM attributes for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/idp/:idpId/scimattribute

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "dataType": "<string>",
      "mutability": "<string>",
      "name": "<string>",
      "returned": "<string>",
      "canonicalValues": [
        "<string>",
        "<string>"
      ],
      "caseSensitive": "<boolean>",
      "creationTime": "
```


## SCIM Attribute Header Controller > Gets the SCIM attribute details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/idp/:idpId/scimattribute/:scimAttributeId

**Response (200):**

```json
{
  "dataType": "<string>",
  "mutability": "<string>",
  "name": "<string>",
  "returned": "<string>",
  "canonicalValues": [
    "<string>",
    "<string>"
  ],
  "caseSensitive": "<boolean>",
  "creationTime": "<integer>",
  "delta": "<string>",
  "description": "<string>",
  "id": "<long>",
  "i
```


## SCIM Group Controller > Gets details of all SCIM groups for the specified IdP.

### GET {{ZPABase}}/userconfig/v1/customers/:customerId/scimgroup/idpId/:idpId

**Response (200):**

```json
{
  "totalPages": "<integer>",
  "totalCount": "<long>",
  "list": [
    {
      "idpGroupId": "<string>",
      "idpId": "<long>",
      "name": "<string>",
      "id": "<long>",
      "modifiedTime": "<long>",
      "creationTime": "<long>",
      "internalId": "<string>"
    },
    {
      "idpGr
```


## SCIM Group Controller > Gets the SCIM Group details for the specified ID.

### GET {{ZPABase}}/userconfig/v1/customers/:customerId/scimgroup/:scimGroupId

**Response (200):**

```json
{
  "idpGroupId": "<string>",
  "idpId": "<long>",
  "name": "<string>",
  "id": "<long>",
  "modifiedTime": "<long>",
  "creationTime": "<long>",
  "internalId": "<string>"
}
```


## Segment Group Controller > Adds a new Segment Group for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/segmentGroup

**Request:**

```json
{
  "name": "<string>",
  "applicationNames": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "applications": [
    {
      "name": "<string>",
      "adpEnabled": "<boolean>",
      "apiProtectionEnabled": "<boolean>",

```

**Response (201):**

```json
{
  "name": "<string>",
  "applicationNames": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "applications": [
    {
      "name": "<string>",
      "adpEnabled": "<boolean>",
      "apiProtectionEnabled": "<boolean>",

```


## Segment Group Controller > Deletes the Segment Group for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/segmentGroup/:segmentGroupId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Segment Group Controller > Gets all configured Segment Groups for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/segmentGroup

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "applicationNames": [
        {
          "id": "<long>",
          "name": "<string>"
        },
        {
          "id": "<long>",
          "name": "<string>"
        }
      ],
      "applications": [
        {
    
```


## Segment Group Controller > Gets the Segment Group details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/segmentGroup/:segmentGroupId

**Response (200):**

```json
{
  "name": "<string>",
  "applicationNames": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "applications": [
    {
      "name": "<string>",
      "adpEnabled": "<boolean>",
      "apiProtectionEnabled": "<boolean>",

```


## Segment Group Controller > Updates the Segment Group for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/segmentGroup/:segmentGroupId

**Request:**

```json
{
  "name": "<string>",
  "applicationNames": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "applications": [
    {
      "name": "<string>",
      "adpEnabled": "<boolean>",
      "apiProtectionEnabled": "<boolean>",

```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Server Controller > Adds a new Server for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/server

**Request:**

```json
{
  "enabled": "<boolean>",
  "name": "<string>",
  "address": "<string>",
  "appServerGroupIds": [
    "<string>",
    "<string>"
  ],
  "configSpace": "SIEM",
  "creationTime": "<integer>",
  "description": "<string>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "m
```

**Response (201):**

```json
{
  "enabled": "<boolean>",
  "name": "<string>",
  "address": "<string>",
  "appServerGroupIds": [
    "<string>",
    "<string>"
  ],
  "configSpace": "SIEM",
  "creationTime": "<integer>",
  "description": "<string>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "m
```


## Server Controller > Deletes the Server for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/server/:serverId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Server Controller > Gets all configured Servers for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/server

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "enabled": "<boolean>",
      "name": "<string>",
      "address": "<string>",
      "appServerGroupIds": [
        "<string>",
        "<string>"
      ],
      "configSpace": "DEFAULT",
      "creationTime": "<integer>",
      "description": "<
```


## Server Controller > Gets the Server details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/server/:serverId

**Response (200):**

```json
{
  "enabled": "<boolean>",
  "name": "<string>",
  "address": "<string>",
  "appServerGroupIds": [
    "<string>",
    "<string>"
  ],
  "configSpace": "SIEM",
  "creationTime": "<integer>",
  "description": "<string>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "m
```


## Server Controller > Updates the Server details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/server/:serverId

**Request:**

```json
{
  "enabled": "<boolean>",
  "name": "<string>",
  "address": "<string>",
  "appServerGroupIds": [
    "<string>",
    "<string>"
  ],
  "configSpace": "SIEM",
  "creationTime": "<integer>",
  "description": "<string>",
  "id": "<long>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "m
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Server Group Controller > Add a new Server Group.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serverGroup

**Request:**

```json
{
  "configSpace": "DEFAULT",
  "name": "<string>",
  "applications": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "appConnectorGroups": [
    {
      "name": "<string>",
      "connectors": [
        {
          "nam
```

**Response (201):**

```json
{
  "configSpace": "DEFAULT",
  "name": "<string>",
  "applications": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "appConnectorGroups": [
    {
      "name": "<string>",
      "connectors": [
        {
          "nam
```


## Server Group Controller > Deletes the Server Group for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serverGroup/:groupId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Server Group Controller > Gets all configured Server Groups for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serverGroup

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "configSpace": "DEFAULT",
      "name": "<string>",
      "applications": [
        {
          "id": "<long>",
          "name": "<string>"
        },
        {
          "id": "<long>",
          "name": "<string>"
        }
      ],
      "app
```


## Server Group Controller > Gets the Server Group details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serverGroup/:groupId

**Response (200):**

```json
{
  "configSpace": "DEFAULT",
  "name": "<string>",
  "applications": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "appConnectorGroups": [
    {
      "name": "<string>",
      "connectors": [
        {
          "nam
```


## Server Group Controller > Updates the Server Group for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serverGroup/:groupId

**Request:**

```json
{
  "configSpace": "DEFAULT",
  "name": "<string>",
  "applications": [
    {
      "id": "<long>",
      "name": "<string>"
    },
    {
      "id": "<long>",
      "name": "<string>"
    }
  ],
  "appConnectorGroups": [
    {
      "name": "<string>",
      "connectors": [
        {
          "nam
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Service Edge Controller > Bulk deletes the Service Edges for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdge/bulkDelete

**Request:**

```json
{
  "ids": [
    "<long>",
    "<long>"
  ]
}
```

**Response (200):**

```json
{
  "Excepteur306": "<string>"
}
```


## Service Edge Controller > Configure a ServiceEdge schedule frequency to delete the in active private broker with configured frequency.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdgeSchedule/:id

**Request:**

```json
{
  "customerId": "<long>",
  "deleteDisabled": "<boolean>",
  "enabled": "<boolean>",
  "frequency": "<string>",
  "frequencyInterval": "<integer>",
  "id": "<long>"
}
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdgeSchedule

**Request:**

```json
{
  "customerId": "<long>",
  "deleteDisabled": "<boolean>",
  "enabled": "<boolean>",
  "frequency": "<string>",
  "frequencyInterval": "<integer>",
  "id": "<long>"
}
```

**Response (204):**

```json
{
  "customerId": "<long>",
  "deleteDisabled": "<boolean>",
  "enabled": "<boolean>",
  "frequency": "<string>",
  "frequencyInterval": "<integer>",
  "id": "<long>"
}
```


## Service Edge Controller > Deletes the Service Edge for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdge/:serviceEdgeId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Service Edge Controller > Get a Configured ServiceEdge schedule frequency.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdgeSchedule

**Response (200):**

```json
{
  "customerId": "<long>",
  "deleteDisabled": "<boolean>",
  "enabled": "<boolean>",
  "frequency": "<string>",
  "frequencyInterval": "<integer>",
  "id": "<long>"
}
```


## Service Edge Controller > Gets all the configured Service Edge details for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdge

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "applicationStartTime": "<long>",
      "controlChannelStatus": "ZPN_STATUS_DISCONNECTED",
      "creationTime": "<integer>",
      "ctrlBrokerName": "<string>",
      "currentVersion": "<string>",
      "description": "
```


## Service Edge Controller > Gets the Service Edge details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdge/:serviceEdgeId

**Response (200):**

```json
{
  "name": "<string>",
  "applicationStartTime": "<long>",
  "controlChannelStatus": "UNKNOWN",
  "creationTime": "<integer>",
  "ctrlBrokerName": "<string>",
  "currentVersion": "<string>",
  "description": "<string>",
  "enabled": "<boolean>",
  "expectedUpgradeTime": "<long>",
  "expectedVersion
```


## Service Edge Controller > Updates the Service Edge details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdge/:serviceEdgeId

**Request:**

```json
{
  "name": "<string>",
  "applicationStartTime": "<long>",
  "controlChannelStatus": "UNKNOWN",
  "creationTime": "<integer>",
  "ctrlBrokerName": "<string>",
  "currentVersion": "<string>",
  "description": "<string>",
  "enabled": "<boolean>",
  "expectedUpgradeTime": "<long>",
  "expectedVersion
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Service Edge Group Controller > Adds a new Service Edge Group for the specified customer.

### POST {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdgeGroup

**Request:**

```json
{
  "name": "<string>",
  "altCloud": "<string>",
  "cityCountry": "<string>",
  "countryCode": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "enabled": "<boolean>",
  "geoLocationId": "<long>",
  "graceDistanceEnabled": "<boolean>",
  "graceDistanceValue": "<double>",
  
```

**Response (201):**

```json
{
  "name": "<string>",
  "altCloud": "<string>",
  "cityCountry": "<string>",
  "countryCode": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "enabled": "<boolean>",
  "geoLocationId": "<long>",
  "graceDistanceEnabled": "<boolean>",
  "graceDistanceValue": "<double>",
  
```


## Service Edge Group Controller > Deletes the Service Edge Group for the specified ID.

### DELETE {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdgeGroup/:serviceEdgeGroupId

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Service Edge Group Controller > Get details of all configured Service Edge Groups for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdgeGroup

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "altCloud": "<string>",
      "cityCountry": "<string>",
      "countryCode": "<string>",
      "creationTime": "<integer>",
      "description": "<string>",
      "enabled": "<boolean>",
      "geoLocationId": "<long>",
```


## Service Edge Group Controller > Gets the Service Edge Group details for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdgeGroup/:serviceEdgeGroupId

**Response (200):**

```json
{
  "name": "<string>",
  "altCloud": "<string>",
  "cityCountry": "<string>",
  "countryCode": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "enabled": "<boolean>",
  "geoLocationId": "<long>",
  "graceDistanceEnabled": "<boolean>",
  "graceDistanceValue": "<double>",
  
```


## Service Edge Group Controller > Updates the Service Edge Group details for the specified ID.

### PUT {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/serviceEdgeGroup/:serviceEdgeGroupId

**Request:**

```json
{
  "name": "<string>",
  "altCloud": "<string>",
  "cityCountry": "<string>",
  "countryCode": "<string>",
  "creationTime": "<integer>",
  "description": "<string>",
  "enabled": "<boolean>",
  "geoLocationId": "<long>",
  "graceDistanceEnabled": "<boolean>",
  "graceDistanceValue": "<double>",
  
```

**Response (400):**

```json
{
  "hostname": "<string>",
  "id": "<string>",
  "reason": "<string>"
}
```


## Trusted Network Controller > Gets all trusted networks for the specified customer.

### GET {{ZPABase}}/mgmtconfig/v2/admin/customers/:customerId/network

**Response (200):**

```json
{
  "currentCount": "<long>",
  "list": [
    {
      "name": "<string>",
      "creationTime": "<integer>",
      "domain": "<string>",
      "id": "<long>",
      "masterCustomerId": "<string>",
      "modifiedBy": "<long>",
      "modifiedTime": "<integer>",
      "networkId": "<string>",
      "
```


## Trusted Network Controller > Gets the trusted networks for the specified ID.

### GET {{ZPABase}}/mgmtconfig/v1/admin/customers/:customerId/network/:id

**Response (200):**

```json
{
  "name": "<string>",
  "creationTime": "<integer>",
  "domain": "<string>",
  "id": "<long>",
  "masterCustomerId": "<string>",
  "modifiedBy": "<long>",
  "modifiedTime": "<integer>",
  "networkId": "<string>",
  "zscalerCloud": "<string>"
}
```


## Zscaler Path Cloud Controller > Get all alternate cloud for zpath cloud.

### GET {{ZPABase}}/mgmtconfig/v1/admin/zpathCloud/getAltClouds

**Response (200):**

```json
[
  "<string>",
  "<string>"
]
```

