# Activation

**Source:** https://help.zscaler.com/legacy-apis/activation
**Captured:** 2026-04-26 via Playwright MCP (innerText extraction of article).

---

## GET /eusaStatus/latest

Retrieves the End User Subscription Agreement (EUSA) acceptance status. If the status does not exist, it returns a status object with no ID.

Parameters: No parameters

Model - EusaStatus:
- id (integer/$int32): System-generated identifier for the EUSA status. readonly: true
- version* (EntityReference): Specifies the EUSA info ID version. This field is for Zscaler internal use only.
  - EntityReference: This is an immutable reference to an entity that mainly consists of id and name
    - id (integer/$int64): A unique identifier for an entity
    - name (string): The configured name of the entity. readonly: true
    - externalId (string): An external identifier used for an entity that is managed outside of ZIA. Examples include `zpaServerGroup` and `zpaAppSegments`. This field is not applicable to ZIA-managed entities.
    - extensions: Additional information about the entity. `{ < * >: string }`
- acceptedStatus (boolean): A Boolean value that specifies the EUSA status. If set to true, the EUSA is accepted. If set to false, the EUSA is in an 'agreement pending' state. The default value is false.

Responses:
- Code 200: Successful Operation

Example Value:
```json
{ "id": 0, "version": { "id": 0, "name": "string", "externalId": "string", "extensions": { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } }, "acceptedStatus": true }
```

## PUT /eusaStatus/{eusaStatusId}

Updates the EUSA status based on the specified status ID.

Parameters:
- eusaStatusId *required (integer/$int32, path): The EUSA status ID
- body (object, body): The EUSA status details

Example Value:
```json
{ "version": { "id": 0, "externalId": "string", "extensions": { "additionalProp1": "string", "additionalProp2": "string", "additionalProp3": "string" } }, "acceptedStatus": true }
```

Responses:
- Code 200: Successful Operation

## GET /status

Gets the activation status for the saved configuration changes. To learn more about activating configuration changes, see Saving and Activating Changes in the ZIA Admin Portal (`/zia/saving-and-activating-changes-zia-admin-portal`).

Parameters: No parameters

Model - ActivationStatus: Organization Policy Edit/Update Activation status
- status (string): Enum: [3 Items — ACTIVE, PENDING, INPROGRESS]

Responses:
- Code 200: Successful Operation

Example Value:
```json
{ "status": "ACTIVE" }
```

## POST /status/activate

Activates the saved configuration changes. To learn more, see Saving and Activating Changes in the ZIA Admin Portal (`/zia/saving-and-activating-changes-zia-admin-portal`).

Parameters: No parameters

Model - ActivationStatus: Organization Policy Edit/Update Activation status
- status (string): Enum: [3 Items — ACTIVE, PENDING, INPROGRESS]

Responses:
- Code 200: Successful Operation

Example Value:
```json
{ "status": "ACTIVE" }
```

**Note:** This is the critical activation endpoint. ZIA configuration changes are not live until `POST /status/activate` is called. The base URL for legacy ZIA API calls is `https://<cloud>.zscaler.net/api/v1`.

A ZIA Cloud Service Postman collection is available for download at:
`/sites/default/files/zia_cloud_service.postman_collection_06_23_2025.json`
