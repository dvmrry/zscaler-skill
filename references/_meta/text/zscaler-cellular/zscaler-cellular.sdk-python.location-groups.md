# Python SDK SIM location group writes: the geofence is dropped on create and snake_case keys are ignored (zscaler-cellular.sdk-python.location-groups)
Also called: add_location_group geofence; zcell sim location group create; geo_fence_details dropped; update_sim_location_group tracked_devices; zcell geofence sdk

SIM location groups hold the geofences that anomaly detection checks ([A SIM Location Group defines a geofence and the SIM-enabled devices to be monitored within it, and these groups form the basis for network anomaly detection policies; the Anomaly Dashboard gives visibility into policy configurations and detects anomalies when devices operate beyond the designated geofence area.](kb:zscaler-cellular.monitoring:location-groups)). The SDK reads them correctly but writes them incompletely.

**Reading.** Python SDK 1.9.40 fixed the ZCell `sim_location_groups` model to parse the geofence block. [zscaler-cellular.sdk-python.location-groups:fix-1940] The get-by-ID model reads `geoFenceData`, `linkedPolicies` and the inside-and-tracked, inside-and-untracked and outside-and-tracked ICCID lists. [zscaler-cellular.sdk-python.location-groups:get-model]

**Creating.** Create takes an array of groups, each requiring `name` and `geoFenceDetails` (with required `lat`, `lng` and `radius`); update takes `geoFenceData` and `trackedDevices`. [zscaler-cellular.sdk-python.location-groups:create-contract] `add_location_group` wraps the keyword arguments in `SimLocationGroups`, whose request format emits only `id`, `name` and `trackedDevices`, and the service does not import the `ApiCreateSimLocationGroupRequestBody` model that carries `geoFenceDetails`. [zscaler-cellular.sdk-python.location-groups:create-old-model] Creating a SIM location group through the SDK sends no geofence, even with the docstring's `geo_fence_details` argument, so the request lacks a field the contract requires. [zscaler-cellular.sdk-python.location-groups:create-drops-geofence]

**Key names.** The create model (`SimLocationGroups`) reads only `id`, `name` and the wire-case key `trackedDevices` from its config, and the update model (`UpdateSimLocationGroup`) reads only the wire-case keys `trackedDevices` and `geoFenceData`; the update method builds its model from the keyword arguments before the request is created. [zscaler-cellular.sdk-python.location-groups:wire-case-keys] Passing Python-style `tracked_devices` or `geo_fence_data` to the create or update methods yields empty tracked devices and no geofence; the wire-case names `trackedDevices` and `geoFenceData` work. [zscaler-cellular.sdk-python.location-groups:snake-kwargs-empty]

What to check:
1. For a geofenced group created through the SDK, whether the outgoing body carried geoFenceDetails; if not, send the documented array body with a raw API call.
2. For an SDK update, whether the keyword arguments used the wire names trackedDevices and geoFenceData.

Inferred, not quoted (say so when an answer rests on one):
- [zscaler-cellular.sdk-python.location-groups:create-drops-geofence] Tier B: Follows from create-old-model and create-contract; the server's response to the incomplete body is not observed.
- [zscaler-cellular.sdk-python.location-groups:snake-kwargs-empty] Tier B: Follows from wire-case-keys: the model is built from the raw kwargs, so the request executor's camel-casing of the body never sees the snake_case names.

Area: zscaler-cellular.sdk-python, its subjects in references/_meta/spine/zscaler-cellular/zscaler-cellular.sdk-python.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zscaler-cellular/zscaler-cellular.monitoring.md (Cellular monitoring: network events, geofence anomaly detection and audit logs)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zscaler-cellular/zscaler-cellular.api.md (The Zscaler Cellular (ZCell) API: customer scoping, clients and where the contract and SDK disagree)
