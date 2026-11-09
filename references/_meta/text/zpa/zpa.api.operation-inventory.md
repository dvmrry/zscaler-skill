# Create operations missing from the Automate contract for ZPA (zpa.api.operation-inventory)
Also called: zpa create operation missing from automate; app connector group POST missing from openapi; automate inventory drift zpa; zpa openapi collection POST absent

The Automate OpenAPI document for ZPA has collection GET and item operations for App Connector Groups, LSS configurations and Private Service Edge Groups but no collection POST. The LSS and Service Edge group absences are held in [Managing ZPA log receivers through the API and SDKs](kb:zpa.log-receivers.api) and [Management API endpoints for Private Service Edges, groups and schedules](kb:zpa.private-service-edges.api-surface).

**What the contract shows.** The ZPA OpenAPI document gives the appConnectorGroup collection path only a GET operation, with no POST for creating a group. [zpa.api.operation-inventory:app-connector-group-collection-get-only]

**What the clients do.** The Go SDK creates an App Connector Group with a POST to the appConnectorGroup collection path. [zpa.api.operation-inventory:go-create-posts-app-connector-group] The Terraform provider creates an App Connector Group by calling the Go SDK Create. [zpa.api.operation-inventory:provider-creates-via-sdk]

**What is open.** Whether the three creates work today, and what they require, is open [gap:zpa.api.operation-inventory:create-runtime-status].

What to check:
1. Before citing a create body for an App Connector Group, LSS configuration or Private Service Edge Group, check whether the contract lists the POST; if not, say the request schema is unconfirmed.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.operation-inventory:app-connector-group-collection-get-only] Tier B: Absence claim: the path item in automate-zscaler/openapi/zpa.openapi.json lists the single method get. The same absence for the LSS configuration and Service Edge group collections is held in zpa.log-receivers.api and zpa.private-service-edges.api-surface.

Not known (open gaps):
- Whether the three create operations are live and what their current request schema requires [gap:zpa.api.operation-inventory:create-runtime-status]: settled by lab-test or support-ticket. Blocks: citing a create request body for these three resources from the contract

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.log-receivers.api.md (Managing ZPA log receivers through the API and SDKs)
- links-to references/_meta/text/zpa/zpa.private-service-edges.api-surface.md (Management API endpoints for Private Service Edges, groups and schedules)
