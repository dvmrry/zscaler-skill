# Posture profile and trusted network wire details the SDK models drop (zpa.api.posture-trusted-networks-wire)
Also called: python posture profile domain missing; posture profile read-only wire; trusted network python model

Posture profiles and trusted networks are read-only, v2 for lists and v1 for a single object, with the object fields in [The ZPA posture profile object and where it comes from](kb:zpa.posture-profiles.object-model) and [The ZPA trusted network object and how to fetch it](kb:zpa.trusted-networks.object). The Go lookups by posture UDID and by network id read the whole list and compare client-side, see [The posture profile API, SDK and Terraform data source](kb:zpa.posture-profiles.api-surface) and [The ZPA trusted network object and how to fetch it](kb:zpa.trusted-networks.object); the 500-per-page size they use is in [ZPA list pagination, search syntax and client-side filtering](kb:zpa.api.pagination).

**What the Python model hides.** The API document and the Go PostureProfile type both carry a domain field, but the Python PostureProfile model has no domain attribute, so a posture profile read through Python does not expose it. [zpa.api.posture-trusted-networks-wire:python-posture-model-omits-domain] The Python model's tab in the rootCert key and its boolean defaults are in [The ZPA posture profile object and where it comes from](kb:zpa.posture-profiles.object-model).

The platform field is a list in the contract and a string in Go [divergence:zpa.api.posture-trusted-networks-wire:posture-platform-shape].

What to check:
1. Whether a posture profile's domain was read through the Python SDK, whose model does not carry it.

Sources disagree (name both sides):
- The OpenAPI document and the Python SDK give a posture profile's `platform` as a list of strings, while the Go SDK declares it as a single string. [divergence:zpa.api.posture-trusted-networks-wire:posture-platform-shape]
  - api-specs: The contract response has platform as an array of strings.
  - sdk-python: The Python model reads platform as a list of strings.
  - sdk-go: The Go PostureProfile declares Platform as one string.
  Impact: A Go caller decoding a response whose platform is a list gets a decode error or an empty value instead of the platforms; the live response is not captured.

Area: zpa.api, its subjects in references/_meta/spine/zpa/zpa.api.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.posture-profiles.object-model.md (The ZPA posture profile object and where it comes from)
- links-to references/_meta/text/zpa/zpa.trusted-networks.object.md (The ZPA trusted network object and how to fetch it)
- depends-on references/_meta/text/zpa/zpa.api.authentication.md (How a client authenticates to the ZPA API: OneAPI, legacy and government clouds), from zpa.api: The ZPA OpenAPI document declares the server https://api.zsapi.net/zpa, described as "ZPA Endpoints", and an HTTP bearer security scheme. [zpa.api.authentication:oneapi-server]
- links-to references/_meta/text/zpa/zpa.api.pagination.md (ZPA list pagination, search syntax and client-side filtering)
- links-to references/_meta/text/zpa/zpa.posture-profiles.api-surface.md (The posture profile API, SDK and Terraform data source)
