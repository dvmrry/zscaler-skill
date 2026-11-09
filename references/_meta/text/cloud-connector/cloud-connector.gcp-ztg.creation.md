# Creating a GCP Zero Trust Gateway: region, zones, location, IAM principals (cloud-connector.gcp-ztg.creation)
Also called: add gcp zero trust gateway; gcp ztg iam principal; gcp ztg change region; gcp ztg availability zones; gcp ztg location template; gcp ztg connection not allowed

A GCP gateway is created in the Admin Console with a configuration tab and an IAM principals tab. What each setting commits to is below; the service boundary is in [GCP Zero Trust Gateway: managed service boundary and restrictions](kb:cloud-connector.gcp-ztg).

**Placement.** A GCP gateway is deployed in exactly one GCP region, and the region cannot be modified after the gateway is created. [cloud-connector.gcp-ztg.creation:one-region-immutable] Creating a GCP gateway requires selecting at least two availability zones for its components. [cloud-connector.gcp-ztg.creation:two-zones-minimum]

**Location.** The location name is optional; when set, the location object is visible in every policy where location objects are available and is created and synced between Cloud Connector and Internet & SaaS policy pages. [cloud-connector.gcp-ztg.creation:location-optional-synced] The location template selected at creation is the template used to create the gateway's location. [cloud-connector.gcp-ztg.creation:location-template]

**Who may connect.** IAM principals are added with a principal value and a type of User, Group or Service Account, and the principal is associated with the customer's VPC. [cloud-connector.gcp-ztg.creation:iam-principals] On a connection request the Zscaler service checks the incoming connection and allows it from an intercept endpoint group associated with an added IAM principal. [cloud-connector.gcp-ztg.creation:principal-allows-endpoint-group]

What to check:
1. Whether the gateway was created in the intended region, since the region cannot be changed afterwards.
2. Whether the intercept endpoint group that is being refused belongs to a project whose IAM principal is listed on the gateway.
3. Whether a location name was set, which decides whether policies can reference the gateway's location.

Area: cloud-connector.gcp-ztg, its subjects in references/_meta/spine/cloud-connector/cloud-connector.gcp-ztg.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.gcp-ztg.md (GCP Zero Trust Gateway: managed service boundary and restrictions)
