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
  - "kb:zia.traffic-forwarding"
  - "`kb:zpa.app-segments`"
  - "kb:zia.url-filtering"
  - "kb:zia.ssl-inspection"
  - "`kb:zpa.app-connectors`"
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
| Forwarding | Z-Tunnel down; PAC/DIRECT surprise; GRE/IPsec/Cloud Connector path issue | `references/zcc/index.md`, `kb:zia.traffic-forwarding`, `references/cloud-connector/index.md` | none |
| Identity | user/group/attribute mismatch; SCIM/SAML drift; step-up auth ambiguity | `references/zidentity/index.md`, `references/shared/scim-provisioning.md` | none |
| Service Edge | wrong PoP; PSE/PSEN issue; subcloud/routing concern | `references/shared/cloud-architecture.md`, `kb:zia.private-service-edge` | none |
| Routing | internet vs private-app path is wrong; app segment catches/misses traffic | `kb:zpa.app-segments`, `references/shared/source-ip-anchoring.md` | `grounding/zpa-segment-matching.md` |
| ZIA policy | URL/category/rule/CAC/SSL/DLP/Sandbox outcome looks wrong | `kb:zia.url-filtering`, `kb:zia.ssl-inspection` | `grounding/zia-url-filtering-precedence.md`, `grounding/zia-ssl-inspection-bypass.md` |
| ZPA connector | segment allowed but app not reached; empty `Connector`; no connector eligible | `kb:zpa.app-connectors`, `kb:zpa.server-groups` | `grounding/zpa-connector-assignment.md` |
| Egress/response | destination allowlist/source-IP issue; SIPA; post-CONNECT surprise | `references/shared/source-ip-anchoring.md`, `kb:zia.ssl-inspection` | depends on path |

## Inspect tenant config

Load only the product and types for the stage being tested. Use the overlay's
IaC when `overlay.json` declares `iac`; use live read-only `zscalerctl` only when
IaC cannot answer or for drift:

- ZIA: the overlay's IaC for the relevant `zia/<type-id>`, or `zscalerctl zia <type-id> list`
- ZPA: the overlay's IaC for the relevant `zpa/<type-id>`, or `zscalerctl zpa <type-id> list`
- ZCC: the overlay's IaC for the relevant `zcc/<type-id>`, or `zscalerctl zcc <type-id> list`

Examples: `zia/url-filtering-rules`, `zpa/app-segments`,
`zcc/forwarding-profiles`. Use `node scripts/kb.mjs resolve <type-id>` for field
shapes. Do not collapse multi-cloud tenant state into one view.

## Use runtime logs only when

- The tenant config explains what is configured but not what happened for this request.
- The symptom is time-bound, session-bound, or user-bound.
- You need to prove the request entered a specific stage or path.
