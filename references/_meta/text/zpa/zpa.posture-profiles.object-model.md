# The ZPA posture profile object and where it comes from (zpa.posture-profiles.object-model)
Also called: posture_udid; postureUdid; zpa posture profile fields; posture profile cloud suffix; posture profile read-only; posture profile platform; crlCheckEnabled; nonExportablePrivateKeyEnabled

This subject covers the posture profile object as ZPA exposes it.

**Origin.** Posture profiles for both Internet & SaaS and Private Access are created in the Device Posture section of the Zscaler Client Connector configuration, and they are used for Private Access access policies and for Internet & SaaS posture trust levels. [zpa.posture-profiles.object-model:zcc-defined] The posture profiles configured in the Zscaler Client Connector portal appear in the access policy criteria drop-down menu, where a specific profile can be searched. [zpa.posture-profiles.object-model:appear-in-policy-list] Zscaler's ZPA API overview says the posture profile API resources allow you to read posture profiles. [zpa.posture-profiles.object-model:read-only-docs] How soon a new profile appears is open [gap:zpa.posture-profiles.object-model:appearance-delay]. The machine tunnel flag is in [The ZPA posture profile object carries a boolean `applyToMachineTunnelEnabled`.](kb:zpa.machine-tunnels.posture:api-field).

**Fields.** The ZPA posture profile object has id, name, postureUdid, postureType, platform, rootCert, domain, masterCustomerId, zscalerCustomerId, zscalerCloud, applyToMachineTunnelEnabled, crlCheckEnabled, nonExportablePrivateKeyEnabled, creationTime, modifiedTime and modifiedBy, with only name required. [zpa.posture-profiles.object-model:fields] The specification types a posture profile's platform as an array of strings. [zpa.posture-profiles.object-model:platform-array] The SDKs disagree on its type [divergence:zpa.posture-profiles.object-model:platform-type], and the effect is open [gap:zpa.posture-profiles.object-model:go-platform-decoding]. The Python model defaults applyToMachineTunnelEnabled, crlCheckEnabled and nonExportablePrivateKeyEnabled to False when the key is absent, and the Go struct holds all three as plain bool, so neither SDK can tell an absent key from false. [zpa.posture-profiles.object-model:bool-defaults] The Python model's request_format() writes the key for rootCert with a trailing tab character, so the key it emits is not rootCert. [zpa.posture-profiles.object-model:root-cert-tab]

**Names.** The Go SDK's GetByName removes a trailing parenthesized cloud suffix from both the requested name and each listed profile name and compares the remainder case-insensitively, so the suffix plays no part in the match. [zpa.posture-profiles.object-model:name-suffix-stripped] Two posture profiles whose names differ only in the cloud suffix are not told apart by the Go name lookup, which returns the first listed match. [zpa.posture-profiles.object-model:same-base-name-first-wins] The documentation says otherwise [divergence:zpa.posture-profiles.object-model:cloud-suffix].

What to check:
1. Where the profile is defined: in the Zscaler Client Connector Device Posture section, not through the ZPA API.
2. Which identifier the object carries for policy use: the postureUdid, not the id.
3. Whether the name has a cloud suffix and whether the lookup in use ignores it.
4. Whether a boolean read from an SDK means false or absent, for the three flags.
5. Whether platform is read through the Go SDK, where its type differs from the specification.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.posture-profiles.object-model:same-base-name-first-wins] Tier B: Follows from the code: the loop returns on the first base-name match. Two profiles with the same base name in one tenant are not shown in any source.

Sources disagree (name both sides):
- The type of a posture profile's platform field. [divergence:zpa.posture-profiles.object-model:platform-type]
  - api-specs: platform is an array of strings.
  - sdk-python: The Python model builds platform as a list of strings.
  - sdk-go: The Go struct types platform as a single string.
  Impact: A Go consumer that reads platform from a posture profile depends on how the SDK handles an array decoded into a string, which the sources do not show.
- Whether the cloud suffix in a posture profile name matters when looking it up by name. [divergence:zpa.posture-profiles.object-model:cloud-suffix]
  - tf-zpa: Appending the cloud name is required to query the profiles of a specific cloud.
  - sdk-go: The lookup strips the suffix from both names, so it is ignored.
  Impact: A configuration that relies on the suffix to pick one cloud's profile gets whichever profile the base name matches first.

Not known (open gaps):
- What the Go SDK does when the API returns platform as an array [gap:zpa.posture-profiles.object-model:go-platform-decoding]: settled by lab-test or code-read. Blocks: relying on platform from a Go consumer
- How soon a new ZCC posture profile appears as a ZPA posture profile [gap:zpa.posture-profiles.object-model:appearance-delay]: settled by lab-test. Blocks: saying a missing profile is only a sync delay

Area: zpa.posture-profiles, its subjects in references/_meta/spine/zpa/zpa.posture-profiles.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zcc/zcc.device-posture.md (ZCC device posture profiles): Posture profiles for both Internet & SaaS and Private Access are created in the Device Posture section of the Zscaler Client Connector configuration, and they are used for Private Access access policies and for Internet & SaaS posture trust levels. [zpa.posture-profiles.object-model:zcc-defined]
- links-to references/_meta/text/zpa/zpa.machine-tunnels.posture.md (Device posture on the ZPA machine tunnel)
