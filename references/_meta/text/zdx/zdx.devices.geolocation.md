# ZDX geolocations: active geolocations, geo filters and coordinates (zdx.devices.geolocation)
Also called: zdx geolocation; active_geo; zdx geo filter; geo_id; parent_geo_id; zdx geo_lat; geo_detection; list_geolocations; GetGeoLocations
Former IDs: zdx-26

Geolocation reaches ZDX from Client Connector, [Client Connector provides the device metrics at negligible additional CPU consumption, exchanges information with the Telemetry and Policy Gateway to receive ZDX configuration and report metrics, and provides latitude and longitude for geolocation if the operating system's location services are enabled.](kb:zdx.cloud-architecture:client-connector). The active-geolocations read lists all active geolocations for the time range, the last 2 hours if none is given; state and city data is retrieved only for the US. [zdx.devices.geolocation:active-geo]

**Filtering by geolocation.** The device list filters by geolocation with a `geo` parameter, an array of strings, and also takes `exclude_geo`; the active-geolocations read takes `parent_geo_id` and `q`. [zdx.devices.geolocation:geo-filters] How the nested geolocations are walked, level by level, is not documented [gap:zdx.devices.geolocation:hierarchy-traversal].

**Coordinates and their source.** The user reads return each device's geolocations with a latitude (`geo_lat`) and longitude (`geo_long`) beside city, state, country and region. [zdx.devices.geolocation:coordinates] In the application-users read, a device location's `geo_detection` is described as ip_geo_lookup or device_geo_lookup. [zdx.devices.geolocation:geo-detection] How a region for the score baseline relates to these is open, [What a region is for the baseline and how devices without location data are placed](kb:zdx.score.calculation:region-definition).

**In the console.** ZDX uses a device's location service to determine a user's location, taking the longitude and latitude coordinates and comparing them to Zscaler's geographic IP database; if the location service is not enabled on the device, ZDX uses the device's IP address. If a user's coordinates are closer to the center of another city than their own, the user's location might be misidentified as connecting from the neighboring city. [zdx.devices.geolocation:console-locating] The Performance Dashboard, Applications Overview and Users Overview each say ZDX currently supports Windows, macOS, Android, Android on ChromeOS and iOS devices only. [zdx.devices.geolocation:console-supported-os] The console's Geolocations filter is hierarchical: it includes the continent, country, states and cities within the US, while non-US geolocations show the continent, countries and then cities. [zdx.devices.geolocation:console-hierarchy] The API and the console differ on cities outside the US [divergence:zdx.devices.geolocation:cities-outside-us]. In the Cloud Path, a device location icon confirms that a device's location was determined by latitude and longitude coordinates; if no icon is displayed, the device was located by its IP address. [zdx.devices.geolocation:cloud-path-location-icon]

What to check:
1. Whether a state or city is expected at all, since state and city data is returned only for the US.
2. Whether a location came from the device or from an IP lookup before trusting its city.
3. For a device with no location, whether location collection is switched on both in the User Privacy settings and for the ZDX entitlement, since whether both are needed is open.

Sources disagree (name both sides):
- City data outside the US: the API's active-geolocations description says state and city data is retrieved only for the US, while the console's Geolocations filter shows cities for non-US geolocations. [divergence:zdx.devices.geolocation:cities-outside-us]
  - api-specs: The state and city data is retrieved only for the US.
  - zscaler-help: The console's geolocation hierarchy shows states and cities within the US, and for non-US geolocations the continent, countries and then cities.
  Impact: A client building a geolocation list from the API may find no city for a non-US location that the console shows with one; neither source says whether the API and console differ by design.

Not known (open gaps):
- How the geolocation hierarchy is traversed [gap:zdx.devices.geolocation:hierarchy-traversal]: settled by lab-test. Blocks: building a complete geolocation filter list

Area: zdx.devices, its subjects in references/_meta/spine/zdx/zdx.devices.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zdx/zdx.cloud-architecture.md (ZDX cloud architecture: components, the telemetry path and what is undocumented)
- links-to references/_meta/text/zdx/zdx.score.calculation.md (How the ZDX Score is calculated: 5-minute values, hourly lows and rollups per scope)
