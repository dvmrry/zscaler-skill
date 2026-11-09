# What the Python and Go SDKs send for application segments (zpa.app-segments.sdk-behavior)
Also called: python sdk clientless_app_ids; No matching clientless App found; python sdk enabled default true; cannot use both tcp_port_ranges and tcp_port_range; guestDetails partnerInfo python; bypassOnReauth false dropped go; python update_segment clears port ranges

This subject covers what the Python and Go SDKs and the MCP server send or fail on for application segments.

**Python models and writes.** When the Python `ApplicationSegments` model is built from a dict that has no `enabled` key, it sets `enabled` to True. [zpa.app-segments.sdk-behavior:python-enabled-default] `add_segment` and `update_segment` in the Python SDK return an error when both `tcp_port_ranges` and `tcp_port_range`, or both `udp_port_ranges` and `udp_port_range`, are passed in one request. [zpa.app-segments.sdk-behavior:python-rejects-both-port-forms] `update_segment` in the Python SDK sends `tcpPortRanges`, `tcpPortRange`, `udpPortRanges` and `udpPortRange` as empty lists for any form the caller did not pass. [zpa.app-segments.sdk-behavior:python-update-clears-port-forms] Python SDK issue #580 asked about `update_segment` clearing port ranges the caller did not pass; it was closed as completed on 2026-10-06 with a reply from a member of the repository's organization, signed Zscaler DevRel, that the behavior is intentional (omitted port fields are sent as empty lists so removed ports are cleared, and callers pass the segment's current ports on every update to keep them), and the v1.11.1 changelog lists it as documented. [zpa.app-segments.sdk-behavior:python-port-clearing-intended]

**Browser Access key.** In the Python SDK `update_segment` tests whether the key `clientless_app_ids` is present, not whether it has a value, and a present key triggers a `BROWSER_ACCESS` lookup. At v1.10.0 and v1.11.0 that path returned 'No matching clientless App found with appId' (the v1.11.1 changelog says the update failed whenever `clientless_app_ids` was passed, #581); v1.11.1 matches each supplied app by domain and segment ID and returns 'No matching clientless App found for domain' only for an entry with no match. `add_segment` renames the key to `clientlessApps`. [zpa.app-segments.sdk-behavior:python-clientless-key-presence] The MCP server removed the `clientless_app_ids` parameter from `zpa_create_application_segment` and `zpa_update_application_segment` because passing it for a standard segment triggered a stray `BROWSER_ACCESS` lookup, and serves Browser Access through dedicated `zpa_*_application_segment_ba` tools. [zpa.app-segments.sdk-behavior:mcp-clientless-param-removed] Before MCP server release 0.11.0 `zpa_create_application_segment` and `zpa_update_application_segment` silently dropped `icmp_access_type` and other fields such as `double_encrypt` and `config_space` because they were not declared as parameters; issue #58 reported that no workaround existed through the MCP server and was closed as completed with a reply to upgrade to v0.11.0, which exposes them with every new field defaulting to `None` so that omitting one preserves the existing API value on update. [zpa.app-segments.sdk-behavior:mcp-icmp-and-other-fields-added-0-11-0]

**Federation decoding.** The Python `guestDetails` decoding defect is in [The Python SDK's `GuestDetails` model builds a non-null `partnerInfo` with `common.PartnerInfo`, which the shared models module does not define, so decoding a segment with non-null `partnerInfo` raises an AttributeError; the model defines a local `PartnerInfo` class that it does not use.](kb:zpa.b2b-federation.federate-applications:python-guestdetails-decode-defect), and the field set is in [Application segment fields in the API and SDK models](kb:zpa.app-segments.api-fields).

**Go serialization.** In the Go SDK the base and Browser Access segment models serialize `bypassOnReauth` without omitempty, so an explicit false is sent, while the Inspection and PRA models tag it `omitempty` and drop an explicit false. [zpa.app-segments.sdk-behavior:go-bypass-on-reauth] The always-serialized flags and the Terraform update path are in [What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations](kb:zpa.terraform.app-segment-lifecycle) and [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes); other Go service defects are in [ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input](kb:zpa.sdk-go.service-defects).

The Python application segment model sets enabled to True when it is built from a response dictionary that has no enabled key, and to None when built with no response at all. [zpa.app-segments.sdk-behavior:python-enabled-defaults-true-from-partial-config]

The Python Inspection and PRA create methods do not drop a false flag the way the Go models do: The Python SDK Inspection and PRA add_segment methods use the caller's keyword arguments as the request body of POST /application, so a `bypass_on_reauth=False` argument stays in the body and is not dropped for being false. [zpa.app-segments.sdk-behavior:python-inspection-pra-body-from-kwargs]

Go and Python differ on an explicit false for Inspection and PRA segments [divergence:zpa.app-segments.sdk-behavior:bypass-on-reauth-false-inspection-pra].

The two SDKs identify an existing sub-application differently on update [divergence:zpa.app-segments.sdk-behavior:subapp-id-matching-key].

The mappings entry shape differs between the SDKs [divergence:zpa.app-segments.sdk-behavior:mappings-response-shape].

Whether that endpoint is supported is open [gap:zpa.app-segments.sdk-behavior:provision-endpoint-supported].

An omitted sub-application survives an Inspection update unless the request names it for deletion [gap:zpa.app-segments.sdk-behavior:omitted-subapp-server-behavior].

What to check:
1. Whether a Python update call passes only one port form, since update_segment sends the other as an empty list.
2. Whether a Python update for a standard segment includes the clientless_app_ids key at all, with any value.
3. Which segment kind a Go write sends an explicit bypassOnReauth false for.
4. Whether a segment's guestDetails carries partnerInfo before reading it through the Python model.

Sources disagree (name both sides):
- For Inspection and PRA segments the Go SDK drops an explicit bypassOnReauth false while the Python SDK sends it. [divergence:zpa.app-segments.sdk-behavior:bypass-on-reauth-false-inspection-pra]
  - sdk-go: Go Inspection and PRA models tag bypassOnReauth `omitempty`, so false is omitted.
  - sdk-go: Go PRA model tags bypassOnReauth `omitempty` as well.
  - sdk-python: Python builds the Inspection create body from the caller's keyword arguments.
  Impact: Go cannot send false for these two models; whether an omitted bypassOnReauth keeps or resets the stored value is not shown.
- On update the Go SDK matches existing Inspection and PRA sub-applications to the supplied ones by name, while the Python SDK matches them by domain. [divergence:zpa.app-segments.sdk-behavior:subapp-id-matching-key]
  - sdk-go: Go Inspection update maps existing inspection apps by Name and copies the ID where the supplied entry has the same Name.
  - sdk-go: Go PRA update does the same with PRA apps keyed by Name.
  - sdk-python: Python Inspection update maps the existing sub-applications by domain.
  - sdk-python: Python PRA update maps the existing sub-applications by domain.
  Impact: A sub-application renamed with an unchanged domain gets its ID injected by Python and not by Go; one whose domain changed with an unchanged name gets it from Go and not from Python. Go then lists the unmatched existing ID in deletedPraApps for PRA and, since v3.8.49, in deletedInspectApps for Inspection (zpa.api.app-segments-wire:go-deleted-subapps).
- The Go SDK models a mappings entry as one name and one type, while the Python docstring describes a list of names and a type. [divergence:zpa.app-segments.sdk-behavior:mappings-response-shape]
  - sdk-go: Go ApplicationMappings holds a single Name and a Type.
  - sdk-python: Python docstring says each mapping has `names` (list of strings) and `type`.
  Impact: A caller that reads a names list from the mappings call gets nothing from the Go shape; the live response is not captured.

Not known (open gaps):
- Whether POST /application/provision is a supported ZPA endpoint [gap:zpa.app-segments.sdk-behavior:provision-endpoint-supported]: settled by lab-test. Blocks: recommending the provision call to a Go or raw-HTTP caller

Area: zpa.app-segments, its subjects in references/_meta/spine/zpa/zpa.app-segments.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zpa/zpa.app-segments.bypass.md (The application segment Bypass setting and how it ranks), from zpa.app-segments: The Bypass setting within an application segment always takes precedence over any newly added client forwarding policy rule. [zpa.app-segments.bypass:bypass-beats-cfp]
- decided-by references/_meta/text/zpa/zpa.app-segments.matching.md (Which application segment a destination maps to when several overlap), from zpa.app-segments: Granularity is judged on the domain or address: an exact host is more specific than a wildcard that contains it, and for IPs a /32 host is more specific than the /24 that contains it. [zpa.app-segments.matching:granularity-ranking]
- interacts-with references/_meta/text/zpa/zpa.policy.evaluation-order.md (Evaluation order across ZPA policy types), from zpa.app-segments: When a request arrives, Private Access identifies the matching rule first, choosing the rule that corresponds to the most specific application segment for the domain name or IP address if segments are part of the criteria. [zpa.policy.evaluation-order:segment-then-rules]
- decided-by references/_meta/text/zpa/zpa.policy.multimatch.md (Segment matching and policy search with and without Multimatch), from zpa.app-segments: Multiple matches apply from the most specific application to the least specific, and multimatching stops at the first application that does not support Multimatch. [zpa.policy.multimatch:match-order]
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/zpa/zpa.app-segments.api-fields.md (Application segment fields in the API and SDK models)
- links-to references/_meta/text/zpa/zpa.b2b-federation.federate-applications.md (Federating application segments to a partner)
- links-to references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- links-to references/_meta/text/zpa/zpa.terraform.app-segment-lifecycle.md (What the ZPA Terraform provider sends, keeps and cleans up for application segments and their associations)
