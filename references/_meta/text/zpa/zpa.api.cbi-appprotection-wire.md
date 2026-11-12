# Cloud Browser Isolation and AppProtection API: paths, writes and version handling (zpa.api.cbi-appprotection-wire)
Also called: cbiconfig base path; isolation profile regionIds; browser protection setActive; predefined controls version query; deAssociateAllPredefinedControls deprecated; controlRuleJson; zsDefinedControlChoice; CBI profile id; isolation profile uuid; cbiconfig profiles; isolation profile create status

Wire details of Cloud Browser Isolation (CBI) and AppProtection (inspection) objects beyond the model and policy descriptions in [AppProtection through the API and the Python SDK: versions, Active Directory controls, attach and detach](kb:zpa.appprotection.api-surface) and [AppProtection and the older Inspection names](kb:zpa.appprotection.naming). The OWASP version choice a profile makes is in [AppProtection profiles: control selection, paranoia level, actions and the default profile](kb:zpa.appprotection.profiles).

## Cloud Browser Isolation

The Go cbiregions, cbizpaprofile, cbiprofilecontroller, cbibannercontroller and cbicertificatecontroller packages share the base /zpa/cbiconfig/cbi/api/customers/, while the separate isolationprofile package uses the mgmtconfig v1 path /isolation/profiles; the OpenAPI document lists both families. [zpa.api.cbi-appprotection-wire:cbi-shared-base-path] The Go CBI region, ZPA profile and cbiprofilecontroller isolation profile lists decode the response directly into a slice with no totalPages or list envelope, and the region lookup by name and the ZPA profile lookups by ID and by name list everything and match client-side because the code states the API does not seem to support search; the isolationprofile package instead uses the standard ZPA paging helpers. [zpa.api.cbi-appprotection-wire:cbi-lists-are-flat-arrays] Creating a CBI banner or certificate is a POST to the singular /banner or /certificate path, while get, update, delete and list use the plural /banners or /certificates; the OpenAPI document shows the same split. [zpa.api.cbi-appprotection-wire:cbi-singular-create-path]

The :profileId path parameter on the CBI isolation profile endpoints is a UUID string in the OpenAPI document. [zpa.api.cbi-appprotection-wire:profile-id-uuid] Creating a CBI isolation profile returns 200 OK in the OpenAPI document, not 201 Created. [zpa.api.cbi-appprotection-wire:create-200]

The Go cbiprofilecontroller IsolationProfile carries both regions and regionIds, and both certificates and certificateIds; the Python add_cbi_profile requires region_ids with at least two entries and a certificate_ids list, while update_cbi_profile requires a regions list with at least two entries, a list of certificate objects and a banner with an id. [zpa.api.cbi-appprotection-wire:cbi-profile-id-only-writes] In the Go CBI profile, UserExperience tags sessionPersistence, browserInBrowser, persistIsolationBar and translate without omitempty (false is always sent) but zgpu with omitempty, and ForwardToZia tags enabled and organizationId without omitempty. [zpa.api.cbi-appprotection-wire:cbi-user-experience-omitempty] The Go ZPAProfiles struct tags enabled and cbiUrl without omitempty, and the cbizpaprofile package has only Get, GetByName and GetAll and no write path. [zpa.api.cbi-appprotection-wire:cbi-zpa-profile-no-omitempty] The tags on `enabled` and `cbiUrl` in the Go ZPAProfiles struct never affect a request the cbizpaprofile package sends. [zpa.api.cbi-appprotection-wire:cbi-zpa-profile-tags-inert] The Python CBIProfile model in models/cbi_zpa_profile.py, which neither the cbi_profile nor the cbi_zpa_profile service module imports, emits microtenant_id and microtenant_name as snake_case keys in request_format and defaults microtenant_name to boolean True when absent from a response. [zpa.api.cbi-appprotection-wire:python-cbi-profile-microtenant-keys]

## Browser protection

The Go browser protection service reads the active profile from activeBrowserProtectionProfile and all profiles from browserProtectionProfile, and its only write is a PUT to browserProtectionProfile/setActive/{profileID}; it has no create or delete. [zpa.api.cbi-appprotection-wire:browser-protection-operations]

## AppProtection profiles and controls

The OpenAPI predefined-controls list requires the version query parameter; the Go SDK sends it with every list, flattens the returned control groups into a single list of controls, and its by-name lookup searches name+EQ+name server-side and then matches case-insensitively. [zpa.api.cbi-appprotection-wire:predefined-controls-version-required] The Go inspection profile setVersion fills an empty predefinedControlsVersion from the first attached predefined control that has a version, and uses OWASP_CRS/3.3.0 only when none has; the Python add_profile and update_profile default the version to OWASP_CRS/3.3.0. [zpa.api.cbi-appprotection-wire:profile-default-version-source] The OpenAPI zsDefinedControlChoice enum is ALL (Zscaler handles the ThreatLabZ controls for the profile) and SPECIFIC (the user handles them), and the Python add_profile docstring repeats the two values. [zpa.api.cbi-appprotection-wire:zs-defined-control-choice-values]

The Go InspectionCustomControl reads the rules of a custom control from the controlRuleJson string member by unmarshalling it into the Rules slice on Get, while Create and Update send Rules as a normal slice. [zpa.api.cbi-appprotection-wire:custom-control-rules-json-string] The OpenAPI document marks deAssociateAllPredefinedControls as deprecated and lists dissociateAllPredefinedControls with the same description less the deprecation sentence; the Go SDK and the Python SDK still call deAssociateAllPredefinedControls. [zpa.api.cbi-appprotection-wire:detach-spelling-deprecated]

The camera-and-mic control exists in Python only [divergence:zpa.api.cbi-appprotection-wire:camera-and-mic].

Python lacks three ThreatLabz fields that the contract and Go carry [divergence:zpa.api.cbi-appprotection-wire:threatlabz-extra-fields].

The WebSocket control fields differ between the SDKs and the contract [divergence:zpa.api.cbi-appprotection-wire:websocket-extra-fields].

The Go cbiprofilecontroller IsolationProfile, which its Create and Update send, tags enabled omitempty, so a Go write with enabled false sends no enabled key, while the Python add_cbi_profile sends its keyword arguments as the body, so an enabled false passed to it is sent. The Go isolationprofile package's IsolationProfile tags enabled without omitempty, but that package only reads (GetByName and GetAll). [zpa.api.cbi-appprotection-wire:isolation-profile-enabled-tag]

The control count is a number in the contract and a string in Go [divergence:zpa.api.cbi-appprotection-wire:controls-info-count-type].

Whether the server overwrites a count sent on write is open [gap:zpa.api.cbi-appprotection-wire:controls-info-count-drift].

Whether the stub object is returned is open [gap:zpa.api.cbi-appprotection-wire:cbi-profile-stub-object].

What to check:
1. Which of the two isolation profile families a question refers to: the cbiconfig profiles or the mgmtconfig isolation profiles.
2. Whether a CBI create used the singular path while reads use the plural.
3. Whether a profile's predefinedControlsVersion was empty on write, so the SDK chose it.
4. Whether a detach call used the deprecated spelling.
5. Whether the profile identifier sent is the UUID string rather than a numeric ID.
6. Whether a client treats 200 as success for isolation profile creation instead of requiring 201.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.api.cbi-appprotection-wire:cbi-zpa-profile-tags-inert] Tier B: Follows from the package having only Get, GetByName and GetAll, which send no request body, so the struct is only decoded. Whether another package marshals ZPAProfiles was not searched.

Sources disagree (name both sides):
- The Python CBI profile security controls carry `cameraAndMic`, while the Go SecurityControls struct has no such field. [divergence:zpa.api.cbi-appprotection-wire:camera-and-mic]
  - sdk-python: The Python SecurityControls model reads and writes cameraAndMic.
  - sdk-go: The Go SecurityControls struct ends with copyPaste, localRender and deepLink and has no cameraAndMic.
  Impact: A Go client, and the Terraform provider that uses it, drops cameraAndMic on read and write; the OpenAPI profile list gives only an example string, so the contract does not settle whether the field is current.
- The Go ThreatLabzControls struct and the OpenAPI document carry `ruleMetadata`, `ruleProcessor` and `associatedCustomers`, while the Python ThreatLabzControls model reads none of them. [divergence:zpa.api.cbi-appprotection-wire:threatlabz-extra-fields]
  - api-specs: The contract threatlabzControls items include ruleMetadata.
  - sdk-go: The Go struct declares RuleMetadata, RuleProcessor and AssociatedCustomers.
  - sdk-python: The Python model reads the control number, version and paranoia level among others and not these three.
  Impact: Python callers lose these three fields on read; Go and the contract agree they exist.
- The Python WebSocketControls model carries `controlException`, which the contract has, while the Go WebSocketControls struct carries `zsDefinedControlChoice` and no `controlException`; the contract places `zsDefinedControlChoice` on the profile, not on the WebSocket control. [divergence:zpa.api.cbi-appprotection-wire:websocket-extra-fields]
  - api-specs: The contract websocketControls items include controlException with a domains list.
  - api-specs: The contract puts zsDefinedControlChoice on the inspection profile item.
  - sdk-python: The Python WebSocketControls model reads controlException.
  - sdk-go: The Go WebSocketControls struct declares ZSDefinedControlChoice.
  Impact: Each SDK has a field the other lacks on this object, and the Go field has no counterpart on the contract's WebSocket control; neither SDK is a complete model.
- The OpenAPI document types an AppProtection profile's `controlsInfo[].count` as an int64 integer, while the Go SDK types it as a string. [divergence:zpa.api.cbi-appprotection-wire:controls-info-count-type]
  - api-specs: The contract controlsInfo items have count as an int64.
  - sdk-go: The Go ControlInfoResource declares Count as a string.
  Impact: A Go decode of a bare JSON integer into the string field fails; the live response is not captured.

Not known (open gaps):
- Whether the server overwrites a controlsInfo count sent on an AppProtection profile write [gap:zpa.api.cbi-appprotection-wire:controls-info-count-drift]: settled by lab-test. Blocks: telling whether a client that writes back a read profile can carry a stale count
- Whether an unset CBI profile reference reads back as an object with id 0 and an empty name [gap:zpa.api.cbi-appprotection-wire:cbi-profile-stub-object]: settled by lab-test. Blocks: importing resources that have no CBI profile

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.appprotection.api-surface.md (AppProtection through the API and the Python SDK: versions, Active Directory controls, attach and detach)
- links-to references/_meta/text/zpa/zpa.appprotection.naming.md (AppProtection and the older Inspection names)
- links-to references/_meta/text/zpa/zpa.appprotection.profiles.md (AppProtection profiles: control selection, paranoia level, actions and the default profile)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.microtenants.isolation.md (What a Microtenant isolates)
