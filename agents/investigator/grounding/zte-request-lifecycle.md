---
role: investigator
artifact: grounding
title: "ZTE request lifecycle — investigation grounding card"
content-type: reference
last-verified: "2026-05-15"
confidence: medium
source-tier: practice
sources:
  - "references/shared/cloud-architecture.md"
  - "references/zcc/index.md"
  - "references/zia/traffic-forwarding-methods.md"
  - "references/zpa/app-segments.md"
  - "references/zia/url-filtering.md"
  - "references/zia/ssl-inspection.md"
  - "references/zpa/app-connector.md"
author-status: draft
---

# ZTE request lifecycle

Use this only when the symptom is broad, cross-product, or poorly framed. Its
job is orientation: place the failure on the request path, then load the
specific grounding card or product reference for that stage. Do not load every
file listed here.

## Use when

- The user says "Zscaler is blocking / bypassing / not reaching X" without a clear product boundary.
- The symptom may cross ZCC, ZIA, and ZPA.
- A weaker agent is jumping straight to policy without first asking whether traffic entered the right path.

## Lifecycle

```text
Origin -> Forwarding -> Identity -> Service Edge -> Routing
                                                   |-> ZIA policy -> Egress -> Response
                                                   `-> ZPA connector -> Egress -> Response
```

## How to use the map

Start upstream and stop at the first stage that is not proven. Do not explain a
policy outcome until the request path is known.

Fast triage:

- **No Zscaler log at all** -> start at Origin / Forwarding / Routing.
- **ZIA web log exists** -> the request reached the ZIA policy path; focus on SSL, URL filtering, CAC, DLP, Sandbox, or response-stage behavior.
- **ZPA access log exists** -> the request reached the ZPA path; focus on segment match, access policy, connector eligibility, or connector-to-app reachability.
- **Both ZIA and ZPA evidence appear relevant** -> check Routing and Source IP Anchoring before assuming either policy stack is wrong.

## Stage cues

| Stage | Failure cues | First docs | Related grounding |
|---|---|---|---|
| Origin | DNS points somewhere unexpected; host override; suffix issue | `references/shared/terminology.md` | none |
| Forwarding | Z-Tunnel down; PAC/DIRECT surprise; GRE/IPsec/Cloud Connector path issue | `references/zcc/index.md`, `references/zia/traffic-forwarding-methods.md`, `references/cloud-connector/index.md` | none |
| Identity | user/group/attribute mismatch; SCIM/SAML drift; step-up auth ambiguity | `references/zidentity/index.md`, `references/shared/scim-provisioning.md` | none |
| Service Edge | wrong PoP; PSE/PSEN issue; subcloud/routing concern | `references/shared/cloud-architecture.md`, `references/zia/private-service-edge.md` | none |
| Routing | internet vs private-app path is wrong; app segment catches/misses traffic | `references/zpa/app-segments.md`, `references/shared/source-ip-anchoring.md` | `grounding/zpa-segment-matching.md` |
| ZIA policy | URL/category/rule/CAC/SSL/DLP/Sandbox outcome looks wrong | `references/zia/url-filtering.md`, `references/zia/ssl-inspection.md` | `grounding/zia-url-filtering-precedence.md`, `grounding/zia-ssl-inspection-bypass.md` |
| ZPA connector | segment allowed but app not reached; empty `Connector`; no connector eligible | `references/zpa/app-connector.md`, `references/zpa/segment-server-groups.md` | `grounding/zpa-connector-assignment.md` |
| Egress/response | destination allowlist/source-IP issue; SIPA; post-CONNECT surprise | `references/shared/source-ip-anchoring.md`, `references/zia/ssl-inspection.md` | depends on path |

## Inspect snapshot

Load only the cloud and product path for the stage being tested:

- ZIA: `_data/snapshot/<cloud>/zia/`
- ZPA: `_data/snapshot/<cloud>/zpa/`
- ZCC: `_data/snapshot/<cloud>/zcc/`

Examples: `_data/snapshot/zs1/zia/`, `_data/snapshot/zs2/zpa/`,
`_data/snapshot/beta/zcc/`.

If a fork also has a product-first export from older public scripts
(`_data/snapshot/zia/...`), treat it only as user-pointed scratch evidence. Do
not treat it as canonical tenant truth, and do not collapse multi-cloud tenant
state into that layout.

## Use runtime logs only when

- The snapshot explains what is configured but not what happened for this request.
- The symptom is time-bound, session-bound, or user-bound.
- You need to prove the request entered a specific stage or path.
