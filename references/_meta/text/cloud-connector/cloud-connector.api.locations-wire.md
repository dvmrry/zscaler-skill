# Cloud Connector locations on the wire: the profile values and what Terraform can manage (cloud-connector.api.locations-wire)
Also called: ztw location profile; cloud connector location workload profile; ztc_location_management; ztw location api

Cloud Connector deployment locations are read and written through the ZTW `/location` endpoints, whose paths and fields are generated. This subject records the location `profile` values and the Terraform coverage, which an earlier reading got wrong.

**Profile values.** The contract's location create body takes `profile` as one of `NONE`, `CORPORATE`, `SERVER`, `GUESTWIFI`, `IOT` and `WORKLOAD`. [cloud-connector.api.locations-wire:contract-profile-enum] `EXTRANET`, which the ZIA provider accepts for a ZIA location's profile alongside `WORKLOAD`, is not in that ZTW list. [cloud-connector.api.locations-wire:zia-provider-extranet]

**Terraform.** The ZTC provider registers `ztc_location_management` as a data source and not as a resource, so Terraform reads Cloud Connector locations but does not create, update or delete them. [cloud-connector.api.locations-wire:location-management-data-source-only] The provider's source still has a location management resource file whose `profile` argument accepts `NONE`, `CORPORATE`, `SERVER`, `GUESTWIFI` and `IOT`, described as defaulting to Unassigned when not given. [cloud-connector.api.locations-wire:tf-validator-unregistered] Because that resource is not registered, its five-value list constrains no configuration; it is not evidence that a Cloud Connector location cannot carry the `WORKLOAD` profile, which the contract lists. [cloud-connector.api.locations-wire:validator-applies-to-nothing]

The Go SDK's location write sends an empty VPC information object when none is set: [Creating or updating a location with the VPC information left unset therefore sends `"vpcInfo":{"cloudMeta":{}}` rather than omitting the member. The ZTC provider at v0.2.0 does not reach this: its location management resource is commented out and unregistered, and the location data source only reads.](kb:cloud-connector.sdk-go.service-defects:location-write-emits-empty-vpc-object).

What to check:
1. Whether a Cloud Connector location's profile value is one the ZTW contract lists (it includes WORKLOAD), rather than relying on the five-value list in the provider's unregistered resource.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.api.locations-wire:validator-applies-to-nothing] Tier B: Whether the API accepts WORKLOAD on a Cloud Connector location rests on the contract alone; no client or test exercises it.

Area: cloud-connector.api, its subjects in references/_meta/spine/cloud-connector/cloud-connector.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.service-defects.md (Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects)
