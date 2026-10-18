# ZPA wave 1: coverage record

Twenty-two legacy docs retired on 2026-10-18 (all under `references/zpa/`): `app-connector`, `app-segments`,
`segment-groups`, `segment-server-groups`, `policy-precedence`, `private-service-edges`, `public-service-edges`,
`browser-access`, `privileged-remote-access`, `appprotection`, `emergency-access`, `machine-groups`,
`machine-tunnels`, `trusted-networks`, `microtenants`, `b2b-federation`, `saml-attributes`,
`scim-policy-mapping`, `posture-profiles`, `audit-logs`, `log-receivers` and `troubleshooting`.

## How

Ten workers converted the docs in parallel, each with a coverage table (every statement and where it went),
an anchor map and a ledger mapping. A consolidation pass made each fact live in one subject (about 25 duplicate
claims and 3 duplicate gaps folded into links). Five independent verifiers then checked every Tier B claim,
divergence and gap, most Tier A claims, and every row the authors marked **Corrected** or **Dropped**, searching
`vendor/` before accepting any "no source states" gap. They found no fabricated claim and no wrong correction;
about 60 wording, evidence and link problems were fixed by the authors.

167 subjects: 1,116 claims, 256 gaps, 49 divergences, in `zpa.app-connectors`, `.app-segments`,
`.segment-groups`, `.server-groups`, `.policy`, `.private-service-edges`, `.public-service-edges`,
`.browser-access`, `.pra`, `.appprotection`, `.emergency-access`, `.machine-groups`, `.machine-tunnels`,
`.trusted-networks`, `.microtenants`, `.b2b-federation`, `.saml-attributes`, `.scim`, `.posture-profiles`,
`.audit-logs`, `.log-receivers` and `.troubleshooting`.

## Sources added along the way

- The legacy Private Service Edge doc rested on ZSDK pages for enrollment, cloning and HA pairs. ZSDK pages
  mirror the ZPA component docs and link to the ZPA originals, which were captured
  (`zpa-about-deploying-service-edges`, `zpa-service-edge-deployment-prerequisites`, and the App Connector
  equivalents); the claims cite those.
- The vendored Terraform deployment modules (App Connector, Private Service Edge, Cloud Connector; AWS, Azure,
  GCP) are registered sources, so module defaults are claims rather than unverified gaps.

## Corrections the sources forced (selected)

- `select_connector_close_to_app` is an application-segment field, not a server-group one.
- A connector is offline when its control session (`ZPN_ASSISTANT_BROKER_CONTROL`) is down; zero M-Tunnels is
  data-plane traffic. No `connectionStatus` / `connection_state` field exists anywhere in the SDKs, provider or spec.
- Machine tunnel removal is `POST /zcc/papi/public/v1/removeMachineTunnel`, not a DELETE.
- The AppProtection default profile is "Recommended OWASP Top 10 Profile"; Active Directory detections log
  under their own Kerberos, LDAP and SMB log types.
- Emergency access is not Okta-only (Authentication Service IdPs for migrated tenants). New defects: the Python
  SDK `add_user` drops the microtenant ID, and the Terraform resource cannot set `microtenant_id`.
- Private Service Edge disaster recovery is activated by DNS TXT records; the host OS is Enterprise Linux 9; the
  Azure module default is `Standard_D4s_v3`; `override_version_profile` defaults differ between docs and schema.
- Microtenant admins manage their own App Connectors; moves can go back to Default; the B2B routes are in the
  OpenAPI; the B2B token TTL minimum differs within the spec (33,600 in the description, 3600 in the schema).
- PRA recording statuses are Enqueued, Transcode Now, Enqueued On Priority, Ready for Streaming and
  Transcoding Failed; the ZPA timeout default rule is 7 days with no idle expiry.

Ledger: 60 `zpa-*` entries migrated (gaps carry them in `former_ids`; entries resolved by a claim are listed with
it). The 21 still open belong to the API, SDK, Terraform and log-schema docs (wave 2) and two AppProtection
items.
