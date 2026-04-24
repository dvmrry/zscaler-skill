# DLP Incidents — Workflow Automation API

**Source:** https://help.zscaler.com/legacy-apis/dlp-incidents-workflow-automation-api
**Captured:** 2026-04-24 via Playwright MCP (bundled chromium rendering the JS-served page; `innerText` extraction of `article`).

---

Legacy Zscaler APIs Help 
Workflow Automation API 
API Developer & Reference Guide 
Reference Guide 
DLP Incidents
Understanding Workflow Automation API
API Developer & Reference Guide
Getting Started
Configuring the Postman REST API Client
Understanding API Rate Limiting
API Response Codes and Error Messages
Reference Guide
Audit Logs
API Authentication
DLP Incidents
/dlp/v1/incidents/transactions/{transactionId}
GET
/dlp/v1/incidents/{dlpIncidentId}
DELETE
GET
/dlp/v1/incidents/{dlpIncidentId}/change-history
GET
/dlp/v1/incidents/{dlpIncidentId}/tickets
GET
/dlp/v1/incidents/{dlpIncidentId}/incident-groups/search
POST
/dlp/v1/incidents/{dlpIncidentId}/close
POST
/dlp/v1/incidents/{dlpIncidentId}/notes
POST
/dlp/v1/incidents/{dlpIncidentId}/labels
POST
/dlp/v1/incidents/search
POST
/dlp/v1/incidents/{dlpIncidentId}/triggers
GET
/dlp/v1/incidents/{dlpIncidentId}/evidence
GET
API Rate Limit Summary
/dlp/v1/incidents/transactions/{transactionId}
GET

Gets the list of all DLP incidents associated with the transaction ID. A transaction ID can contain one or more DLP incidents.

Parameters

Name
Description
transactionId *required
string
(path)

The ID of the transaction that violated the DLP rules.
Model - ZSDLPIncidentList

cursor*
Cursor
incidents*
ZSDLPIncident
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "cursor": {
    "totalPages": 0,
    "currentPageNumber": 0,
    "currentPageSize": 0,
    "pageId": "string",
    "totalElements": 0
  },
  "incidents": [
    {
      "internalId": "string",
      "integrationType": "string",
      "transactionId": "string",
      "sourceType": "string",
      "sourceSubType": "string",
      "sourceActions": [
        "string"
      ],
      "severity": "HIGH",
      "priority": "CRITICAL",
      "matchingPolicies": {
        "engines": [
          {
            "name": "string",
            "rule": "string"
          }
        ],
        "rules": [
          {
            "name": "string"
          }
        ],
        "dictionaries": [
          {
            "name": "string",
            "matchCount": 0,
            "nameMatchCount": "string"
          }
        ]
      },
      "matchCount": 0,
      "createdAt": "2026-04-24T15:16:16.916Z",
      "lastUpdatedAt": "2026-04-24T15:16:16.916Z",
      "sourceFirstObservedAt": "2026-04-24T15:16:16.916Z",
      "sourceLastObservedAt": "string",
      "userInfo": {
        "name": "string",
        "email": "string",
        "clientIP": "string",
        "uniqueIdentifier": "string",
        "userId": 0,
        "department": "string",
        "homeCountry": "string",
        "managerInfo": {
          "id": 0,
          "name": "string",
          "email": "string"
        }
      },
      "applicationInfo": {
        "url": "string",
        "category": "string",
        "name": "string",
        "hostnameOrApplication": "string",
        "additionalInfo": "TBD"
      },
      "contentInfo": {
        "fileName": "string",
        "fileType": "string",
        "additionalInfo": "TBD"
      },
      "networkInfo": {
        "source": "TBD",
        "destination": "TBD"
      },
      "metadataFileUrl": "string",
      "status": "NEW",
      "resolution": "FALSE_POSITIVE",
      "assignedAdmin": {
        "email": "string"
      },
      "lastNotifiedUser": {
        "role": "END_USER",
        "email": "string"
      },
      "notes": [
        {
          "body": "string",
          "createdAt": "2026-04-24T15:16:16.916Z",
          "lastUpdatedAt": "2026-04-24T15:16:16.916Z",
          "createdBy": 0,
          "lastUpdatedBy": 0
        }
      ],
      "closedCode": "string",
      "incidentGroupIds": [
        0
      ],
      "incidentGroups": [
        {
          "id": 0,
          "name": "string",
          "description": "string"
        }
      ],
      "dlpIncidentTickets": [
        {
          "ticketType": "JIRA",
          "ticketingSystemName": "string",
          "projectId": "string",
          "projectName": "string",
          "ticketInfo": {
            "ticketId": "string",
            "ticketUrl": "string",
            "state": "string"
          }
        }
      ],
      "labels": [
        {
          "key": "string",
          "value": "string"
        }
      ]
    }
  ]
}
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Code
500
Description
Failed to process the request
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}
DELETE

Deletes the DLP incident for the specified incident ID.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of the incident.
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}
GET

Gets the DLP incident details based on the incident ID.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of the incident.
fields
array[string]
(query)

The fields associated with the DLP incident. For example, sourceActions, contentInfo, status, resolution, etc.
+
Model - ZSDLPIncident

internalId
string
The internal ID of the incident.
integrationType
string
The integration type of the incident.
transactionId
string
The transaction ID of the incident.
sourceType
string
The source type of the incident.
sourceSubType
string
The source subtype of the incident.
sourceActions
array[string]
The actions that triggered the incident. For example, browsing for a web application that is blocked by firewall rules.
severity
ZSDLPIncidentSeverity
priority*
ZSDLPIncidentPriority
matchingPolicies
ZSDLPIncidentMatchingPolicies
matchCount
integer
The number of times the DLP policies were violated.
createdAt*
string($date-time)
The date and time the incident was created.
lastUpdatedAt*
string($date-time)
The date and time the incident was last modified.
sourceFirstObservedAt*
string($date-time)
The date and time the incident was first observed.
sourceLastObservedAt*
string
The date and time the incident was last observed.
userInfo
ZSDLPIncidentUserInfo
applicationInfo
[...]
contentInfo
[...]
networkInfo
[...]
metadataFileUrl
string
The metadata file URL of the incident.
status
ZSDLPIncidentStatus
resolution
ZSDLPIncidentResolution
assignedAdmin
[...]
lastNotifiedUser
[...]
notes
ZSDLPIncidentNote
closedCode
string
incidentGroupIds
array[integer]
The ID of the incident group.
incidentGroups
ZSDLPIncidentGroupInfoShort
dlpIncidentTickets
ZSDLPIncidentTicket
labels
ZSDLPIncidentLabel
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "internalId": "string",
  "integrationType": "string",
  "transactionId": "string",
  "sourceType": "string",
  "sourceSubType": "string",
  "sourceActions": [
    "string"
  ],
  "severity": "HIGH",
  "priority": "CRITICAL",
  "matchingPolicies": {
    "engines": [
      {
        "name": "string",
        "rule": "string"
      }
    ],
    "rules": [
      {
        "name": "string"
      }
    ],
    "dictionaries": [
      {
        "name": "string",
        "matchCount": 0,
        "nameMatchCount": "string"
      }
    ]
  },
  "matchCount": 0,
  "createdAt": "2026-04-24T15:16:16.921Z",
  "lastUpdatedAt": "2026-04-24T15:16:16.921Z",
  "sourceFirstObservedAt": "2026-04-24T15:16:16.921Z",
  "sourceLastObservedAt": "string",
  "userInfo": {
    "name": "string",
    "email": "string",
    "clientIP": "string",
    "uniqueIdentifier": "string",
    "userId": 0,
    "department": "string",
    "homeCountry": "string",
    "managerInfo": {
      "id": 0,
      "name": "string",
      "email": "string"
    }
  },
  "applicationInfo": {
    "url": "string",
    "category": "string",
    "name": "string",
    "hostnameOrApplication": "string",
    "additionalInfo": "TBD"
  },
  "contentInfo": {
    "fileName": "string",
    "fileType": "string",
    "additionalInfo": "TBD"
  },
  "networkInfo": {
    "source": "TBD",
    "destination": "TBD"
  },
  "metadataFileUrl": "string",
  "status": "NEW",
  "resolution": "FALSE_POSITIVE",
  "assignedAdmin": {
    "email": "string"
  },
  "lastNotifiedUser": {
    "role": "END_USER",
    "email": "string"
  },
  "notes": [
    {
      "body": "string",
      "createdAt": "2026-04-24T15:16:16.921Z",
      "lastUpdatedAt": "2026-04-24T15:16:16.921Z",
      "createdBy": 0,
      "lastUpdatedBy": 0
    }
  ],
  "closedCode": "string",
  "incidentGroupIds": [
    0
  ],
  "incidentGroups": [
    {
      "id": 0,
      "name": "string",
      "description": "string"
    }
  ],
  "dlpIncidentTickets": [
    {
      "ticketType": "JIRA",
      "ticketingSystemName": "string",
      "projectId": "string",
      "projectName": "string",
      "ticketInfo": {
        "ticketId": "string",
        "ticketUrl": "string",
        "state": "string"
      }
    }
  ],
  "labels": [
    {
      "key": "string",
      "value": "string"
    }
  ]
}
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Code
500
Description
Failed to process the request
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}/change-history
GET

Gets the details of updates made to an incident based on the given ID and timeline.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of the incident.
Model - ZSDLPIncidentChangeHistory

incidentId
string
The ID of the incident.
startDate
string($date-time)
The start date and time of an update to the incident
endDate
string($date-time)
The end date and time of the update.
changeHistory
The details of the updates made to the incident.
ZSDLPIncidentChange
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "incidentId": "string",
  "startDate": "2026-04-24T15:16:16.924Z",
  "endDate": "2026-04-24T15:16:16.924Z",
  "changeHistory": [
    {
      "changeType": "CHANGE_STATUS",
      "changedAt": "2026-04-24T15:16:16.924Z",
      "changedByName": "string",
      "changeData": {
        "before": "string",
        "after": "string"
      },
      "comment": "string"
    }
  ]
}
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Code
500
Description
Failed to process the request
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}/tickets
GET

Gets the information of the ticket generated for the incident. For example, ticket type, ticket ID, ticket status, etc.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of the incident.
Model - ZSDLPIncidentTicketList

cursor
Cursor
tickets
ZSDLPIncidentTicket
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "cursor": {
    "totalPages": 0,
    "currentPageNumber": 0,
    "currentPageSize": 0,
    "pageId": "string",
    "totalElements": 0
  },
  "tickets": [
    {
      "ticketType": "JIRA",
      "ticketingSystemName": "string",
      "projectId": "string",
      "projectName": "string",
      "ticketInfo": {
        "ticketId": "string",
        "ticketUrl": "string",
        "state": "string"
      }
    }
  ]
}
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Code
500
Description
Failed to process the request
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}/incident-groups/search
POST

Filters a list of DLP incident groups to which the specified incident ID belongs.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of the incident.
Request Body *required
Example Value
Model
{
  "incidentGroupIds": [
    0
  ]
}

Parameters content type:
application/json

Model - ZSDLPIncidentGroupInfoList

incidentGroups*
ZSDLPIncidentGroupInfo
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "incidentGroups": [
    {
      "id": 0,
      "name": "string",
      "description": "string",
      "status": "ACTIVE",
      "incidentGroupType": "string",
      "isDLPIncidentGroupAlreadyMapped": true,
      "isDLPAdminConfigAlreadyMapped": true
    }
  ]
}
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Code
500
Description
Failed to process the request
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}/close
POST

Updates the status of the incident to resolved and closes the incident with a resolution label and a resolution code.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of the incident.
Request Body *required
Example Value
Model
{
  "resolutionLabel": {
    "key": "string",
    "value": "string"
  },
  "resolutionCode": "FALSE_POSITIVE",
  "notes": "string"
}

Parameters content type:
application/json

Model - ZSDLPIncident

internalId
string
The internal ID of the incident.
integrationType
string
The integration type of the incident.
transactionId
string
The transaction ID of the incident.
sourceType
string
The source type of the incident.
sourceSubType
string
The source subtype of the incident.
sourceActions
array[string]
The actions that triggered the incident. For example, browsing for a web application that is blocked by firewall rules.
severity
ZSDLPIncidentSeverity
priority*
ZSDLPIncidentPriority
matchingPolicies
ZSDLPIncidentMatchingPolicies
matchCount
integer
The number of times the DLP policies were violated.
createdAt*
string($date-time)
The date and time the incident was created.
lastUpdatedAt*
string($date-time)
The date and time the incident was last modified.
sourceFirstObservedAt*
string($date-time)
The date and time the incident was first observed.
sourceLastObservedAt*
string
The date and time the incident was last observed.
userInfo
ZSDLPIncidentUserInfo
applicationInfo
[...]
contentInfo
[...]
networkInfo
[...]
metadataFileUrl
string
The metadata file URL of the incident.
status
ZSDLPIncidentStatus
resolution
ZSDLPIncidentResolution
assignedAdmin
[...]
lastNotifiedUser
[...]
notes
ZSDLPIncidentNote
closedCode
string
incidentGroupIds
array[integer]
The ID of the incident group.
incidentGroups
ZSDLPIncidentGroupInfoShort
dlpIncidentTickets
ZSDLPIncidentTicket
labels
ZSDLPIncidentLabel
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "internalId": "string",
  "integrationType": "string",
  "transactionId": "string",
  "sourceType": "string",
  "sourceSubType": "string",
  "sourceActions": [
    "string"
  ],
  "severity": "HIGH",
  "priority": "CRITICAL",
  "matchingPolicies": {
    "engines": [
      {
        "name": "string",
        "rule": "string"
      }
    ],
    "rules": [
      {
        "name": "string"
      }
    ],
    "dictionaries": [
      {
        "name": "string",
        "matchCount": 0,
        "nameMatchCount": "string"
      }
    ]
  },
  "matchCount": 0,
  "createdAt": "2026-04-24T15:16:16.926Z",
  "lastUpdatedAt": "2026-04-24T15:16:16.926Z",
  "sourceFirstObservedAt": "2026-04-24T15:16:16.926Z",
  "sourceLastObservedAt": "string",
  "userInfo": {
    "name": "string",
    "email": "string",
    "clientIP": "string",
    "uniqueIdentifier": "string",
    "userId": 0,
    "department": "string",
    "homeCountry": "string",
    "managerInfo": {
      "id": 0,
      "name": "string",
      "email": "string"
    }
  },
  "applicationInfo": {
    "url": "string",
    "category": "string",
    "name": "string",
    "hostnameOrApplication": "string",
    "additionalInfo": "TBD"
  },
  "contentInfo": {
    "fileName": "string",
    "fileType": "string",
    "additionalInfo": "TBD"
  },
  "networkInfo": {
    "source": "TBD",
    "destination": "TBD"
  },
  "metadataFileUrl": "string",
  "status": "NEW",
  "resolution": "FALSE_POSITIVE",
  "assignedAdmin": {
    "email": "string"
  },
  "lastNotifiedUser": {
    "role": "END_USER",
    "email": "string"
  },
  "notes": [
    {
      "body": "string",
      "createdAt": "2026-04-24T15:16:16.926Z",
      "lastUpdatedAt": "2026-04-24T15:16:16.926Z",
      "createdBy": 0,
      "lastUpdatedBy": 0
    }
  ],
  "closedCode": "string",
  "incidentGroupIds": [
    0
  ],
  "incidentGroups": [
    {
      "id": 0,
      "name": "string",
      "description": "string"
    }
  ],
  "dlpIncidentTickets": [
    {
      "ticketType": "JIRA",
      "ticketingSystemName": "string",
      "projectId": "string",
      "projectName": "string",
      "ticketInfo": {
        "ticketId": "string",
        "ticketUrl": "string",
        "state": "string"
      }
    }
  ],
  "labels": [
    {
      "key": "string",
      "value": "string"
    }
  ]
}
Code
400
Description
Bad request
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}/notes
POST

Adds notes to the incident during updates or status changes.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of the incident for which the note is added.
Request Body *required
Example Value
Model
{
  "notes": "string"
}

Parameters content type:
application/json

Model - ZSDLPIncident

internalId
string
The internal ID of the incident.
integrationType
string
The integration type of the incident.
transactionId
string
The transaction ID of the incident.
sourceType
string
The source type of the incident.
sourceSubType
string
The source subtype of the incident.
sourceActions
array[string]
The actions that triggered the incident. For example, browsing for a web application that is blocked by firewall rules.
severity
ZSDLPIncidentSeverity
priority*
ZSDLPIncidentPriority
matchingPolicies
ZSDLPIncidentMatchingPolicies
matchCount
integer
The number of times the DLP policies were violated.
createdAt*
string($date-time)
The date and time the incident was created.
lastUpdatedAt*
string($date-time)
The date and time the incident was last modified.
sourceFirstObservedAt*
string($date-time)
The date and time the incident was first observed.
sourceLastObservedAt*
string
The date and time the incident was last observed.
userInfo
ZSDLPIncidentUserInfo
applicationInfo
[...]
contentInfo
[...]
networkInfo
[...]
metadataFileUrl
string
The metadata file URL of the incident.
status
ZSDLPIncidentStatus
resolution
ZSDLPIncidentResolution
assignedAdmin
[...]
lastNotifiedUser
[...]
notes
ZSDLPIncidentNote
closedCode
string
incidentGroupIds
array[integer]
The ID of the incident group.
incidentGroups
ZSDLPIncidentGroupInfoShort
dlpIncidentTickets
ZSDLPIncidentTicket
labels
ZSDLPIncidentLabel
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "internalId": "string",
  "integrationType": "string",
  "transactionId": "string",
  "sourceType": "string",
  "sourceSubType": "string",
  "sourceActions": [
    "string"
  ],
  "severity": "HIGH",
  "priority": "CRITICAL",
  "matchingPolicies": {
    "engines": [
      {
        "name": "string",
        "rule": "string"
      }
    ],
    "rules": [
      {
        "name": "string"
      }
    ],
    "dictionaries": [
      {
        "name": "string",
        "matchCount": 0,
        "nameMatchCount": "string"
      }
    ]
  },
  "matchCount": 0,
  "createdAt": "2026-04-24T15:16:16.928Z",
  "lastUpdatedAt": "2026-04-24T15:16:16.928Z",
  "sourceFirstObservedAt": "2026-04-24T15:16:16.928Z",
  "sourceLastObservedAt": "string",
  "userInfo": {
    "name": "string",
    "email": "string",
    "clientIP": "string",
    "uniqueIdentifier": "string",
    "userId": 0,
    "department": "string",
    "homeCountry": "string",
    "managerInfo": {
      "id": 0,
      "name": "string",
      "email": "string"
    }
  },
  "applicationInfo": {
    "url": "string",
    "category": "string",
    "name": "string",
    "hostnameOrApplication": "string",
    "additionalInfo": "TBD"
  },
  "contentInfo": {
    "fileName": "string",
    "fileType": "string",
    "additionalInfo": "TBD"
  },
  "networkInfo": {
    "source": "TBD",
    "destination": "TBD"
  },
  "metadataFileUrl": "string",
  "status": "NEW",
  "resolution": "FALSE_POSITIVE",
  "assignedAdmin": {
    "email": "string"
  },
  "lastNotifiedUser": {
    "role": "END_USER",
    "email": "string"
  },
  "notes": [
    {
      "body": "string",
      "createdAt": "2026-04-24T15:16:16.928Z",
      "lastUpdatedAt": "2026-04-24T15:16:16.928Z",
      "createdBy": 0,
      "lastUpdatedBy": 0
    }
  ],
  "closedCode": "string",
  "incidentGroupIds": [
    0
  ],
  "incidentGroups": [
    {
      "id": 0,
      "name": "string",
      "description": "string"
    }
  ],
  "dlpIncidentTickets": [
    {
      "ticketType": "JIRA",
      "ticketingSystemName": "string",
      "projectId": "string",
      "projectName": "string",
      "ticketInfo": {
        "ticketId": "string",
        "ticketUrl": "string",
        "state": "string"
      }
    }
  ],
  "labels": [
    {
      "key": "string",
      "value": "string"
    }
  ]
}
Code
400
Description
Bad request
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}/labels
POST

Assign lables (a label name and it's associated value) to DLP incidents.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of DLP incident to which the label is assigned.
Request Body *required
Example Value
Model
{
  "labels": [
    {
      "key": "string",
      "value": "string"
    }
  ]
}

Parameters content type:
application/json

Model - ZSDLPIncident

internalId
string
The internal ID of the incident.
integrationType
string
The integration type of the incident.
transactionId
string
The transaction ID of the incident.
sourceType
string
The source type of the incident.
sourceSubType
string
The source subtype of the incident.
sourceActions
array[string]
The actions that triggered the incident. For example, browsing for a web application that is blocked by firewall rules.
severity
ZSDLPIncidentSeverity
priority*
ZSDLPIncidentPriority
matchingPolicies
ZSDLPIncidentMatchingPolicies
matchCount
integer
The number of times the DLP policies were violated.
createdAt*
string($date-time)
The date and time the incident was created.
lastUpdatedAt*
string($date-time)
The date and time the incident was last modified.
sourceFirstObservedAt*
string($date-time)
The date and time the incident was first observed.
sourceLastObservedAt*
string
The date and time the incident was last observed.
userInfo
ZSDLPIncidentUserInfo
applicationInfo
[...]
contentInfo
[...]
networkInfo
[...]
metadataFileUrl
string
The metadata file URL of the incident.
status
ZSDLPIncidentStatus
resolution
ZSDLPIncidentResolution
assignedAdmin
[...]
lastNotifiedUser
[...]
notes
ZSDLPIncidentNote
closedCode
string
incidentGroupIds
array[integer]
The ID of the incident group.
incidentGroups
ZSDLPIncidentGroupInfoShort
dlpIncidentTickets
ZSDLPIncidentTicket
labels
ZSDLPIncidentLabel
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "internalId": "string",
  "integrationType": "string",
  "transactionId": "string",
  "sourceType": "string",
  "sourceSubType": "string",
  "sourceActions": [
    "string"
  ],
  "severity": "HIGH",
  "priority": "CRITICAL",
  "matchingPolicies": {
    "engines": [
      {
        "name": "string",
        "rule": "string"
      }
    ],
    "rules": [
      {
        "name": "string"
      }
    ],
    "dictionaries": [
      {
        "name": "string",
        "matchCount": 0,
        "nameMatchCount": "string"
      }
    ]
  },
  "matchCount": 0,
  "createdAt": "2026-04-24T15:16:16.932Z",
  "lastUpdatedAt": "2026-04-24T15:16:16.932Z",
  "sourceFirstObservedAt": "2026-04-24T15:16:16.932Z",
  "sourceLastObservedAt": "string",
  "userInfo": {
    "name": "string",
    "email": "string",
    "clientIP": "string",
    "uniqueIdentifier": "string",
    "userId": 0,
    "department": "string",
    "homeCountry": "string",
    "managerInfo": {
      "id": 0,
      "name": "string",
      "email": "string"
    }
  },
  "applicationInfo": {
    "url": "string",
    "category": "string",
    "name": "string",
    "hostnameOrApplication": "string",
    "additionalInfo": "TBD"
  },
  "contentInfo": {
    "fileName": "string",
    "fileType": "string",
    "additionalInfo": "TBD"
  },
  "networkInfo": {
    "source": "TBD",
    "destination": "TBD"
  },
  "metadataFileUrl": "string",
  "status": "NEW",
  "resolution": "FALSE_POSITIVE",
  "assignedAdmin": {
    "email": "string"
  },
  "lastNotifiedUser": {
    "role": "END_USER",
    "email": "string"
  },
  "notes": [
    {
      "body": "string",
      "createdAt": "2026-04-24T15:16:16.932Z",
      "lastUpdatedAt": "2026-04-24T15:16:16.932Z",
      "createdBy": 0,
      "lastUpdatedBy": 0
    }
  ],
  "closedCode": "string",
  "incidentGroupIds": [
    0
  ],
  "incidentGroups": [
    {
      "id": 0,
      "name": "string",
      "description": "string"
    }
  ],
  "dlpIncidentTickets": [
    {
      "ticketType": "JIRA",
      "ticketingSystemName": "string",
      "projectId": "string",
      "projectName": "string",
      "ticketInfo": {
        "ticketId": "string",
        "ticketUrl": "string",
        "state": "string"
      }
    }
  ],
  "labels": [
    {
      "key": "string",
      "value": "string"
    }
  ]
}
Code
400
Description
Bad request
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Try In Postman
/dlp/v1/incidents/search
POST

Filters DLP incidents based on the given time range and the field values. The supported field values are:
Severity
Priority
Transaction ID
Status
Source
Source DLP Type
Labels
To filter DLP incidents based on labels, ensure that you replace the parameter value:[string] with value:[{label_name: [label_value]}] in the request body. You need to provide the label name and its associated value to get accurate results.
Incident Group
Engine
The supported time range values are:
Start date and time
End date and time

Parameters

Name
Description
page
integer
(query)
minimum: 0
Specifies the page number of the incident in a multi-paginated response. This field is not required if page ID field is used.
pageSize
integer
(query)
minimum: 1
Specifies the page size (i.e., number of incidents per page). The maximum page size is 100.
pageId
string
(query)

Specifies the page ID of the incident in a multi-paginated response. It is a unique identifier returned in the first search request. The page ID can be used instead of the page number in subsequent search requests for faster and more efficient results.
Request Body
Example Value
Model
{
  "fields": [
    {
      "name": "severity",
      "value": [
        "string"
      ]
    }
  ],
  "timeRange": {
    "startTime": "2026-04-24T15:16:16.914Z",
    "endTime": "2026-04-24T15:16:16.914Z"
  }
}

Parameters content type:
application/json

Model - ZSDLPIncidentList

cursor*
Cursor
incidents*
ZSDLPIncident
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "cursor": {
    "totalPages": 0,
    "currentPageNumber": 0,
    "currentPageSize": 0,
    "pageId": "string",
    "totalElements": 0
  },
  "incidents": [
    {
      "internalId": "string",
      "integrationType": "string",
      "transactionId": "string",
      "sourceType": "string",
      "sourceSubType": "string",
      "sourceActions": [
        "string"
      ],
      "severity": "HIGH",
      "priority": "CRITICAL",
      "matchingPolicies": {
        "engines": [
          {
            "name": "string",
            "rule": "string"
          }
        ],
        "rules": [
          {
            "name": "string"
          }
        ],
        "dictionaries": [
          {
            "name": "string",
            "matchCount": 0,
            "nameMatchCount": "string"
          }
        ]
      },
      "matchCount": 0,
      "createdAt": "2026-04-24T15:16:17.014Z",
      "lastUpdatedAt": "2026-04-24T15:16:17.014Z",
      "sourceFirstObservedAt": "2026-04-24T15:16:17.014Z",
      "sourceLastObservedAt": "string",
      "userInfo": {
        "name": "string",
        "email": "string",
        "clientIP": "string",
        "uniqueIdentifier": "string",
        "userId": 0,
        "department": "string",
        "homeCountry": "string",
        "managerInfo": {
          "id": 0,
          "name": "string",
          "email": "string"
        }
      },
      "applicationInfo": {
        "url": "string",
        "category": "string",
        "name": "string",
        "hostnameOrApplication": "string",
        "additionalInfo": "TBD"
      },
      "contentInfo": {
        "fileName": "string",
        "fileType": "string",
        "additionalInfo": "TBD"
      },
      "networkInfo": {
        "source": "TBD",
        "destination": "TBD"
      },
      "metadataFileUrl": "string",
      "status": "NEW",
      "resolution": "FALSE_POSITIVE",
      "assignedAdmin": {
        "email": "string"
      },
      "lastNotifiedUser": {
        "role": "END_USER",
        "email": "string"
      },
      "notes": [
        {
          "body": "string",
          "createdAt": "2026-04-24T15:16:17.014Z",
          "lastUpdatedAt": "2026-04-24T15:16:17.014Z",
          "createdBy": 0,
          "lastUpdatedBy": 0
        }
      ],
      "closedCode": "string",
      "incidentGroupIds": [
        0
      ],
      "incidentGroups": [
        {
          "id": 0,
          "name": "string",
          "description": "string"
        }
      ],
      "dlpIncidentTickets": [
        {
          "ticketType": "JIRA",
          "ticketingSystemName": "string",
          "projectId": "string",
          "projectName": "string",
          "ticketInfo": {
            "ticketId": "string",
            "ticketUrl": "string",
            "state": "string"
          }
        }
      ],
      "labels": [
        {
          "key": "string",
          "value": "string"
        }
      ]
    }
  ]
}
Code
400
Description
Bad request
Code
401
Description
Authorization failure
Code
500
Description
Failed to process the request
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}/triggers
GET

Downloads the actual data that triggered the incident.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of the incident for which the trigger data is downloaded.
fetchTriggerContext
boolean
(query)

(Optional) Specifies whether to download the complete incident trigger data, including the prefix and suffix information. Set this field to true to fetch the prefix and suffix data.The default value is false.
--
true
false
Model - ZSDLPIncidentTriggerData

The trigger data of the incident.

ZSDLPIncidentTriggerData
{
   < * >: string
}
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "additionalProp1": "string",
  "additionalProp2": "string",
  "additionalProp3": "string"
}
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Try In Postman
/dlp/v1/incidents/{dlpIncidentId}/evidence
GET

Gets the evidence URL of the incident. The evidence link can be used to view and download the XML file with the actual data that triggered the incident.

Parameters

Name
Description
dlpIncidentId *required
string
(path)

The ID of the incident for which evidence URL is fetched.
Model - ZSDLPIncidentEvidenceInfo

DLP Incident evidence metadata

fileName*
string
The name of the file.
fileType
string
The type or extension of the file.
additionalInfo
Any additional information about the incident.
evidenceURL
string
The evidence URL of the incident.
Responses
Response content type:
application/json
Code
200
Description
Successful operation
Example Value
{
  "fileName": "string",
  "fileType": "string",
  "additionalInfo": "TBD",
  "evidenceURL": "string"
}
Code
401
Description
Authorization failure
Code
404
Description
Resource does not exist
Try In Postman
Was this article helpful? Click an icon below to submit feedback.
