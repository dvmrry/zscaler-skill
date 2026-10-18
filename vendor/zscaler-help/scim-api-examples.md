# SCIM API Examples

**Source:** https://help.zscaler.com/zia/scim-api-examples
**Captured:** 2026-10-18 via help_capture.py (article payload, canonical text)
**Revision:** node 1400836, revision 3218409

---

Using SCIM operations enables you to do things like creating and deleting users and groups. To perform these operations, you need to enable SCIM-based provisioning and have your Base URL and Bearer Token. To learn how to do this, see Configuring SCIM. Most API calls to Zscaler SCIM servers will be authenticated using the Bearer Token. However, there are several API calls (/Schemas, /ServiceProviderConfig, /ResourceTypes) that do not require authentication, as they are informational for the SCIM server and not particular to any company.
For a full list of operations supported by the Zscaler SCIM servers, as well as attribute mappings, see Understanding SCIM.
Zscaler SCIM servers have a rate limit of 5 requests per second. In order to avoid retries, configure your application to comply with this.
# Fetching All Users
**Request**
GET <Base URL>/Users
**Curl example**
curl -v -k <Base URL>/Users -H "Authorization: Bearer <Bearer Token>"
**Response example**
{ "schemas": [ "urn:ietf:params:scim:api:messages:2.0:ListResponse" ], "totalResults": 1, "startIndex": 1, "itemsPerPage": 1, "Resources": [ { "emails": [], "meta": { "location": "<Base URL>/Users/{UserID}", "resourceType": "User" }, "displayName": "DEFAULT ADMIN", "name": { "familyName": "", "givenName": "" }, "groups": [ { "display": "Service Admin", "value": "{GroupID}", "$ref": "<Base URL>/Groups/{GroupID}" } ], "active": true, "id": "{UserID}", "userName": "admin@safemarch.com", "department": "Service Admin", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": { "department": "Service Admin" } } ] }
The Zscaler service generates an accurate number for the totalResults field if the value is under 10K. If the value is over 10K, the Zscaler service provides a rough estimate of the total record count to optimize response times. After the client fetches the last page of results, the totalResults field reflects the precise, final count.
# Creating a User
**Request**
POST <Base URL>/Users
**Curl example**
curl -v -k <Base URL>/Users -d @create_scim_user.json -H "Authorization: Bearer <Bearer Token>" -H "Content-Type: application/scim+json"
Where create_scim_user.json is a file containing the following information about the user in JSON format.
**New user file example**
{ "schemas": [ "urn:ietf:params:scim:schemas:core:2.0:User", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" ], "userName":"scim-example@safemarch.com", "displayName":"scim example", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" : { "department": "scim dept 001" } }
**Response example**
{ "schemas": [ "urn:ietf:params:scim:schemas:core:2.0:User", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" ], "displayName": "scim example", "meta": { "created": "2018-05-02T10:58:54Z", "location": "<Base URL>/Users/{UserID}", "lastModified": "2018-05-02T10:58:54Z", "resourceType": "User" }, "id": "{UserID}", "userName": "scim-example@safemarch.com", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": { "department": "scim dept 001" } }
# Updating a User's Display Name and Department
**Request**
PUT <Base URL>/Users/{UserID} or PATCH <Base URL>/Users/{UserID}
In this example, we use PUT.
**Curl example**
curl -X PUT -v -k <Base URL>/Users/{UserID} -d @updated_user_file_example.json -H "Authorization: Bearer <Bearer Token>"-H "Content-Type: application/scim+json"
**Updated user file example**
{ "schemas": [ "urn:ietf:params:scim:schemas:core:2.0:User", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" ], "userName":"scim-example@safemarch.com", "displayName":"scim update example", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" : { "department": "scim dept 002" } }
**Response example**
{ "schemas": [ "urn:ietf:params:scim:schemas:core:2.0:User", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User" ], "displayName": "scim update example", "meta": { "lastModified": "2018-05-03T09:32:08Z", "resourceType": "User" }, "id": "{UserID}", "userName": "scim-example@safemarch.com", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": { "department": "scim dept 002" } }
# Creating a Group with Members
**Request**
POST /Groups
**Curl example**
curl -v -k <Base URL>/Groups -d @create_scim_group.txt -H "Authorization: Bearer <Bearer Token>" -H "Content-Type: application/scim+json"
**Sample new group file**
{ "schemas": [ "urn:ietf:params:scim:schemas:core:2.0:Group" ], "externalId": "abcde", "displayName":"scim test group 001", "members": [ { "value":"{UserID}" } ] }
**Example response**
{ "schemas": [ "urn:ietf:params:scim:schemas:core:2.0:Group" ], "displayName": "scim test group 001", "meta": { "created": "2018-05-03T09:41:19Z", "location": "<Base URL>/Groups/{GroupID}", "lastModified": "2018-05-03T09:41:19Z", "resourceType": "Group" }, "members": [ { "value": "{UserID}" } ], "externalId": "abcde", "id": "{GroupID}" }
# Updating a Group With a New Member
**Request**
PUT /Groups/{GroupID} or PATCH /Groups/{GroupID}
In this example, we use PATCH.
**Curl example**
curl -v -k -X PATCH <Base URL>/Groups/{GroupID} -d @patch_scim_group_1.txt -H "Authorization: Bearer <Bearer Token>" -H "Content-Type: application/json-patch+json"
**Sample updated group file**
{ "schemas": ["urn:ietf:params:scim:api:messages:2.0:PatchOp"], "Operations":[ { "op":"add", "value": { "members" : [ { "display": "scim test group 001", "value": "{UserID}" } ] } } ] }
**Response**
The server responds with 204 - No Content upon successful operation.
# Deleting a User
**Request**
DELETE /Users/{UserID}
**Curl example**
curl -X DELETE -v -k -H "Authorization: Bearer <Bearer Token>" <Base URL>/Users/{UserID}
**Response**
The server responds with 204 - No Content upon successful operation.
