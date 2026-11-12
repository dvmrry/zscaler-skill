# Application segment fields in the API and SDK models (zpa.app-segments.api-fields)
Also called: tcpPortRange vs tcpPortRanges; dual port range formats; tcp_keep_alive string; zpnErId; hbrEnabled stickyEntity stickyGroup guestDetails; inconsistentConfigDetails; readOnly zscalerManaged restrictionType; weightedLoadBalancing fqdnDnsCheck healthCheckType; defaultIdleTimeout defaultMaxAge; appRecommendationId
Former IDs: zpa-74, zpa-75, zpa-83

This subject covers the field names and wire types of an application segment as the API, the SDK models and Terraform expose them.

**Ports.** The API carries ports in two forms, `tcpPortRanges` and `udpPortRanges` as lists of strings in the SDKs (integers in the API spec) and `tcpPortRange` and `udpPortRange` as lists of from/to objects, and the Go model, the Python model and the Terraform schema expose both. [zpa.app-segments.api-fields:port-range-forms] Whether endpoints prefer one form is open [gap:zpa.app-segments.api-fields:port-form-endpoint-preference]. The Terraform schema restricts `tcp_keep_alive` to the strings `"0"` and `"1"`, and the Go model types `tcpKeepAlive` as a string. [zpa.app-segments.api-fields:tcp-keep-alive-values] The spec and the SDK type it differently [divergence:zpa.app-segments.api-fields:tcp-keep-alive-type-differs].

**Enums.** The API field `healthCheckType` takes `DEFAULT` or `NONE`. [zpa.app-segments.api-fields:health-check-type-values] The health reporting values and their meaning are in [Health Reporting makes the App Connector report application health continuously (Continuous), while a user is accessing it (On Access) or not at all (None), and the console default is On Access.](kb:zpa.app-segments.settings:health-reporting-default), and the bypass, ICMP, match style and policy style values are in [The application segment Bypass setting and how it ranks](kb:zpa.app-segments.bypass), [Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring](kb:zpa.app-segments.settings) and [The application segment request field `matchStyle` takes the values EXCLUSIVE and INCLUSIVE.](kb:zpa.policy.multimatch:match-style-values).

**Flags in both SDKs.** Both SDK models carry `bypassOnReauth`, `extranetEnabled`, `apiProtectionEnabled`, `autoAppProtectEnabled`, `adpEnabled`, `weightedLoadBalancing`, `fqdnDnsCheck`, `healthCheckType` and `policyStyle` on the base application segment, and the Python `request_format` writes them. [zpa.app-segments.api-fields:shared-model-fields] The Terraform schema describes `weighted_load_balancing` as designating the segment for weighted load balancing and `api_protection_enabled` as designating it for API traffic inspection. [zpa.app-segments.api-fields:tf-flag-descriptions] What the remaining flags control is open [gap:zpa.app-segments.api-fields:flag-meanings].

**Extranet, recommendations and tags.** `zpnErId` on a segment is the extranet resource: the Go type `ZPNERID` carries ZIA extranet fields (`ziaErId`, `ziaErName`, `ziaOrgId`), and the Terraform provider labels it the extranet resource ID. [zpa.app-segments.api-fields:zpn-er-id] `appRecommendationId` is a string field on the segment in the API spec and the Go model, and the Python SDK reads it on the `AppResource` model nested in its clientless application segment model (`BAAppDto`). [zpa.app-segments.api-fields:app-recommendation-id] A segment's tags are namespace, tag key and tag value objects, which the console assigns by Namespace, Key and Values. [zpa.app-segments.api-fields:tags]

**Session timers.** The timers have different types in the spec and the Go model [divergence:zpa.app-segments.api-fields:session-timer-type-differs].

**Server-reported state.** The API reports `inconsistentConfigDetails` on a segment, a set of name and reason entries for inconsistent configuration of related objects such as the segment group, server group, App Connector group and IdP, and the Python `AppResource` model, nested in the clientless application segment model (`BAAppDto`), carries it. [zpa.app-segments.api-fields:inconsistent-config-details] The Go and Python segment models carry `readOnly`, `zscalerManaged` and `restrictionType`. [zpa.app-segments.api-fields:governance-fields] What the governance flags mean is open [gap:zpa.app-segments.api-fields:governance-meaning].

**Federation fields.** The Go models for the base, Browser Access, Inspection and PRA application segments, and the Python segment model, carry `hbrEnabled`, `stickyEntity` and `stickyGroup`. [zpa.app-segments.api-fields:hbr-sticky-guest-fields] Their accepted values and meaning are open [gap:zpa.app-segments.api-fields:hbr-sticky-guest-semantics]. The guest record shape and the Python decoding defect are in [In the Go SDK the base, Browser Access, Inspection and PRA application segment models carry `guestDetails`, where each guest record has a `federationId` and a `partnerInfo` with approval status, federation status, partner GID, name and scope name.](kb:zpa.b2b-federation.federate-applications:guest-details-shape) and [The Python SDK's `GuestDetails` model builds a non-null `partnerInfo` with `common.PartnerInfo`, which the shared models module does not define, so decoding a segment with non-null `partnerInfo` raises an AttributeError; the model defines a local `PartnerInfo` class that it does not use.](kb:zpa.b2b-federation.federate-applications:python-guestdetails-decode-defect).

The `applications` field is a string on the segment and a list of objects on the segment group: The Go base application segment model types `applications` as a string, while the Go segment group model holds a list of Application objects and the OpenAPI segment group document types `applications` as an array. [zpa.app-segments.api-fields:applications-field-types]

What to check:
1. Whether a port appears in both port forms when reading tenant JSON, before concluding it is configured twice.
2. Which wire type tcpKeepAlive, defaultIdleTimeout and defaultMaxAge are sent as by the tool in use, since the API spec, Go SDK and Terraform schema differ.
3. Whether a segment is read-only or Zscaler-managed before proposing a change to it.
4. Which of the hbrEnabled, stickyEntity and stickyGroup fields a caller can rely on, given that no source defines their values.

Sources disagree (name both sides):
- The API spec, the Go SDK and the Terraform schema type `tcpKeepAlive` differently. [divergence:zpa.app-segments.api-fields:tcp-keep-alive-type-differs]
  - api-specs: The API spec types tcpKeepAlive as a 32-bit integer.
  - tf-zpa: The Terraform schema accepts only the strings "0" and "1"; the Go model also types the field as a string.
  Impact: A caller writing the JSON body directly from the spec may send an integer where the SDK and provider send a string; which literal the API accepts on the wire is not shown by these sources.
- The API spec types `defaultIdleTimeout` as an integer while the Go model types it as a string. [divergence:zpa.app-segments.api-fields:session-timer-type-differs]
  - api-specs: The API spec types defaultIdleTimeout as a 32-bit integer.
  - sdk-go: The Go model types defaultIdleTimeout (and defaultMaxAge) as strings.
  Impact: Code that reads the timers from Go or compares them with spec-typed values must convert between string and integer.

Not known (open gaps):
- Whether some endpoints prefer one port form and how the two forms relate in stored JSON [gap:zpa.app-segments.api-fields:port-form-endpoint-preference]: settled by tenant-data or lab-test. Blocks: saying whether the same ports appearing in both forms in tenant JSON is one setting or two
- What readOnly, zscalerManaged and restrictionType mean for a segment [gap:zpa.app-segments.api-fields:governance-meaning]: settled by tenant-data or lab-test. Blocks: saying a segment cannot be edited because of one of these flags
- What extranetEnabled, autoAppProtectEnabled, adpEnabled, fqdnDnsCheck and healthCheckType control [gap:zpa.app-segments.api-fields:flag-meanings]: settled by tenant-data or lab-test. Blocks: mapping these API flags to console settings
- Accepted values and meaning of hbrEnabled, stickyEntity, stickyGroup and guestDetails [gap:zpa.app-segments.api-fields:hbr-sticky-guest-semantics]: settled by lab-test or tenant-data or support-ticket. Blocks: interpreting or writing these four fields
- Whether a read returns tcpKeepAlive as a quoted string or a bare integer [gap:zpa.app-segments.api-fields:tcp-keep-alive-wire-form]: settled by tenant-data
- Whether SIEM is a valid configSpace on the segment itself [gap:zpa.app-segments.api-fields:config-space-top-level]: settled by tenant-data

Area: zpa.app-segments, its subjects in references/_meta/spine/zpa/zpa.app-segments.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks), from zpa.app-segments: The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- decided-by references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch), from zpa.app-segments: Multiple matches apply from the most specific application to the least specific, and multimatching stops at the first application that does not support Multimatch. [zpa.policy.multimatch:match-order]
- links-to references/_meta/text/zpa/zpa.app-segments.settings.md (Application segment settings that interact: health reporting, connector selection, CNAME, ICMP, encryption and anchoring)
- links-to references/_meta/text/zpa/zpa.b2b-federation.federate-applications.md (Federating application segments to a partner)
- decided-by references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap), from zpa.app-segments: Granularity is judged on the domain or address: an exact host is more specific than a wildcard that contains it, and for IPs a /32 host is more specific than the /24 that contains it. [zpa.app-segments.matching:granularity-ranking]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.app-segments: When a request arrives, Private Access identifies the matching rule first, choosing the rule that corresponds to the most specific application segment for the domain name or IP address if segments are part of the criteria. [zpa.policy.evaluation-order:segment-then-rules]

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zpa/zpa.app-segments.sdk-behavior.md (What the Python and Go SDKs send for application segments)
- see-also references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- see-also references/_meta/text/zpa/zpa.microtenants.share-and-move.md (Sharing and moving between Microtenants)
