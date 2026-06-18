---
product: meta
topic: "clarifications-index"
title: "Clarification index — open questions across references"
content-type: reference
last-verified: "2026-06-18"
confidence: high
sources: []
author-status: reviewed
---

# Clarification index

Centralized list of open questions raised across `references/*.md`. Each entry has a stable ID so a human or agent can say "see `zia-03`" without ambiguity and have everyone land in the same place.

## Conventions

**ID format**: `<area>-<num>`.

- `zia-*` — ZIA-scoped behavior question
- `zpa-*` — ZPA-scoped behavior question
- `zcc-*` — ZCC (Client Connector) behavior question
- `zdx-*` — ZDX (Digital Experience) behavior question
- `zms-*` — ZMS (Microsegmentation) behavior question
- `easm-*` — EASM (External Attack Surface Management) behavior question
- `zwa-*` — ZWA (Workflow Automation) behavior question
- `cloud-connector-*` — Cloud & Branch Connector (ZTW) behavior question
- `zid-*` — ZIdentity (identity / API-client / entitlement / admin-RBAC) behavior question
- `shared-*` — cross-product or skill-wide question
- `ai-security-*` — AI Security / AI Guard behavior question
- `business-insights-*` — Business Insights behavior / API-coverage question
- `soc-workbench-*` — SOC Workbench behavior / API-coverage question
- `unified-*` — Zscaler Experience Center / unified-console behavior question
- `risk360-*` — Risk360 behavior / API-coverage question
- `breach-predictor-*` — Breach Predictor behavior / API-coverage question
- `uvm-*` — Unified Vulnerability Management behavior / API-coverage question
- `dspm-*` — Data Security Posture Management behavior / API-coverage question
- `aem-*` — Asset Exposure Management / SecOps data-source behavior question
- `deception-*` — Zscaler Deception admin/API or ZPA integration behavior question
- `identity-protection-*` — Identity Protection / ITDR behavior question
- `zero-trust-branch-*` — Zero Trust Branch (ZTB) behavior question
- `zscaler-cellular-*` — Zscaler Cellular / SIM / Cellular Edge behavior question
- `log-*` — log-schema / NSS / LSS question that spans multiple products

IDs are stable forever. If an entry is resolved, it stays here with its answer — don't renumber.

**Status**:

- `open` — unresolved
- `investigating` — someone is gathering evidence; note who / when
- `resolved` — has been answered; keep the entry with the answer preserved
- `wontfix` — judged not worth resolving (note why)

**Resolves with** — what kind of evidence would close this:

- `lab test` — controlled test tenant required
- `tenant snapshot` — the internal fork's live config would reveal it
- `support ticket` — Zscaler support needs to confirm
- `zscaler doc not yet read` — should be in public docs somewhere, haven't found it
- `operator experience` — someone running this in production can confirm
- `code read` — SDK or TF provider source resolves it
- `design decision` — not a Zscaler fact question; something we need to choose

## Entry shape

Each entry follows this template. Body is narrative — the existing zia-01 entry is a good model.

```
### <area>-<num> — <short title>

*Origin: `references/<path>.md` § Open questions*

<one-paragraph statement of the question>

**Status**: <open | investigating | resolved | wontfix> [— last updated YYYY-MM-DD]
**Resolves with**: <evidence type from the list above>
**Blocks**: <what's blocked or unknowable until resolved> [optional]

[Body — what's been established, sources checked, partial findings, prior sweeps]

[For resolved: **Answer**: paragraph with sources cited]
```

## Workflow for adding a new entry

1. Writing a reference doc, you hit a question the sources don't answer.
2. Add it to your doc's **Open questions** section with a one-line summary.
3. Add the full entry here with a new stable ID, following the entry template above.
4. Link both ways:
   - Your doc: `See [clarification zia-07](clarifications.md#zia-07-cloud-application-risk-profile-composition).`
   - This file: `*Origin: references/<product>/<topic>.md § Open questions*` (placeholder path — substitute the real one)
5. **When resolving**: fold the answer into the relevant reference doc body (that's where it's useful), update the doc's `last-verified` date, then delete the entry from this register. Git history preserves it.
   - **Grandfather rule**: existing pre-2026-04-27 resolved entries (`zia-01`, `zia-03`, `zia-05`–`zia-07`, `zia-10`, `zia-13`, `zpa-02`, `zpa-03`, `zpa-05`–`zpa-08`, `shared-01`–`shared-05`) stay where they are; this policy applies to entries resolved on or after 2026-04-27.

---

## Status summary

Skim this before reading the full entries. Summary refreshed 2026-06-18:
20 entries are resolved or clarified, 25 are partially resolved, and the current
refresh queue has expanded the open register with `zia-50`–`zia-69`,
`zpa-21`–`zpa-81`, `zcc-77`–`zcc-101`, `zdx-03`–`zdx-43`,
`zid-01`–`zid-35`, `cloud-connector-01`–`cloud-connector-24`,
`ai-security-01`–`ai-security-04`, `zbi-01`–`zbi-06`,
`zwa-01`–`zwa-05`, Tier-C insights entries `business-insights-01`,
`soc-workbench-01`, and `unified-01`, Tier-C risk entries
`risk360-01`–`risk360-02`, `breach-predictor-01`, `uvm-01`, and
`dspm-01`, and Tier-C misc entries `aem-01`, `deception-01`,
`identity-protection-01`, `zero-trust-branch-01`, and
`zscaler-cellular-01`.
Most open entries require lab tests,
tenant snapshots, operator experience, or vendor confirmation rather than more
public-doc reading.

The 2026-06-18 Automate-contract / rosetta closure pass narrowed several
previously open source-surface questions without settling their runtime
semantics: `zia-49`, `zia-53`, `zia-57`, `cloud-connector-09`, `zcc-80`,
`zbi-02`, `zbi-03`, and `zbi-04`.

### Resolved

| ID | Title |
|---|---|
| [`zia-01`](#zia-01-predefined-vs-custom-category-specificity) | Predefined-vs-custom via Retain Parent Category toggle |
| [`zia-03`](#zia-03-wildcard-tokenization) | Wildcard tokenization — leading-period only; asterisk invalid |
| [`zia-05`](#zia-05-admin-rank-order-collision) | Admin rank structurally enforces precedence regardless of order-value collisions |
| [`zia-06`](#zia-06-cac-disabled-rule-semantics) | CAC disabled-rule semantic identical to URL Filtering (doc'd verbatim in per-category CAC rule articles) |
| [`zia-07`](#zia-07-cloud-application-risk-profile-composition) | Cloud Application Risk Profile composition — full attribute list documented |
| [`zia-10`](#zia-10-cac-default-allow-all-vs-explicit-allow-for-cascading) | CAC default Allow-All is not "explicit allow" |
| [`zia-13`](#zia-13-explicit-pipeline-order-sourcing) | Pipeline order — firewall → web module two-pass |
| [`zpa-02`](#zpa-02-zpa-more-granular-definition) | "More granular" = most-specific FQDN wins |
| [`zpa-03`](#zpa-03-multimatch-mixed-style-evaluation) | Multimatch mixed style — rejected at config time |
| [`zpa-05`](#zpa-05-no-match-in-segment-criteria) | "No match in segment" = port mismatch specifically |
| [`zpa-06`](#zpa-06-require-approval-action-semantics) | Require Approval = Conditional Access = ZIdentity step-up |
| [`zpa-08`](#zpa-08-when-both-fqdns-are-equal-interpretation) | FQDN-equal first-match ordering confirmed |
| [`shared-01`](#shared-01-spl-index-naming-portability) | SPL index names come from env vars (`SPLUNK_INDEX_*`) |
| [`shared-02`](#shared-02-log-query-latency-budget) | Skill never auto-queries — always emits SPL for operator to run |
| [`shared-03`](#shared-03-script-language-choice-for-tenant-data-tooling) | Scripts implemented as Python via `uv run` |
| [`shared-04`](#shared-04-snapshot-auth-pattern) | Credentials via env vars; no `.env` convention |
| [`shared-05`](#shared-05-snapshot-format) | Raw JSON per resource; no paraphrasing |
| [`zpa-07`](#zpa-07-deception-policy-order-interaction) | Deception = separate Zscaler product; rules must fire before normal access rules to intercept attacker traffic to decoys |
| [`zpa-15`](#zpa-15-machine-groups-file-path-correction) | Machine groups misclassified as ZIA in coverage audit — file moved to `references/zpa/machine-groups.md` |

### Partially resolved

| ID | Title | What's still open |
|---|---|---|
| [`zia-04`](#zia-04-nrod-propagation-lag) | NROD propagation lag | Documented as "within hours of going live" — upper-bound precision unstated |
| [`zia-08`](#zia-08-cac-tenant-restrictions-mechanics) | CAC tenant restrictions mechanics | Supported apps + SSL-Inspection-required mechanic doc'd; per-app token-field inspection details in per-app config articles not yet vendored |
| [`zia-09`](#zia-09-cac-app-identity-when-url-maps-to-multiple-apps) | CAC app-identity when URL maps to multiple apps | URL-Lookup API is the mapping surface; internal URL-to-app resolution logic still undocumented |
| [`zia-11`](#zia-11-transparent-vs-explicit-forwarding-mixed-mode) | Transparent vs explicit forwarding mixed mode | Silent per-session drift for tenants not gating rules by Device/Location Group |
| [`log-01`](#log-01-nss-feed-format-versions) | NSS feed format versions | Exact field-presence differences between CSV/JSON/TSV output templates |
| [`log-02`](#log-02-cloud-nss-vs-legacy-nss-divergence) | Cloud NSS vs legacy NSS divergence | Both source from the same Nanolog — field content parity expected; branching most likely needed for format (Cloud NSS recommends JSON) and per-instance feed-count limits, not field presence |
| [`zia-49`](#zia-49-cac-per-app-action-validity) | CAC per-app action validity | Contract now supplies the category-level `actions` vocabulary; no read path exposes per-app validity |
| [`zia-53`](#zia-53-cac-atomic-validation-contract-and-representative-app-action-quirk) | CAC atomic-validation contract and representative-app quirk | Contract narrows the action vocabulary; whole-create rejection and representative-app behavior remain MCP-observation/lab-test questions |
| [`zia-57`](#zia-57-ftp-and-file-type-control-field-dependency-and-enum-surfaces) | FTP and File Type Control field-dependency and enum surfaces | Contract now supplies the static `fileTypes` vocabulary; field dependencies, protocol acceptance, and FTP per-site scope remain open |
| [`cloud-connector-09`](#cloud-connector-09-forwarding-method-semantics-and-the-true-backend-forwardmethod-enum) | `ENATDEDIP`/`GEOIP`/`PROXYCHAIN` semantics + true `forwardMethod` enum | Automate contract now gives an independent contract enum and records Terraform disagreement; runtime semantics and backend acceptance remain open |
| [`zcc-80`](#zcc-80-zcc-v1-vs-v2-endpoint-coexistence) | ZCC v1 vs v2 endpoint coexistence / supersession | Reconciler confirms Automate currently exposes only older v1 `webTrustedNetwork` while Terraform uses Go SDK v2 trusted networks; supersession/migration remains open |
| [`zbi-02`](#zbi-02-cbizpaprofile-vs-isolationprofile-preferred-endpoint) | `cbizpaprofile` vs `isolationprofile` preferred endpoint | Automate contract confirms both paths are first-class documented GET operations; preference and runtime divergence remain open |
| [`zbi-03`](#zbi-03-auto-created-default-profile-lifecycle-and-isdefault-mutability) | Auto-created default profile lifecycle and `isDefault` mutability | ZIA-side `defaultProfile` is documented as Zscaler-set; ZPA-side `isDefault` mutability and lifecycle remain open |
| [`zbi-04`](#zbi-04-copypaste-and-uploaddownload-enum-completeness) | `copyPaste` and `uploadDownload` enum completeness | Automate examples corroborate `all`/`none`; no formal enum or directional values are documented |

### Open

`zia-02`, `zia-12`, `zia-14`, `zia-15`, `zia-16`–`zia-69`, `zpa-01`, `zpa-04`, `zpa-09`, `zpa-10`, `zpa-11`–`zpa-14`, `zpa-16`–`zpa-81`, `log-03`, `log-05`–`log-22`, `shared-06`, `shared-07`–`shared-16`, `shared-20`–`shared-37`, `zcc-08`–`zcc-101`, `zdx-01`–`zdx-43`, `zid-01`–`zid-35`, `zms-01`, `easm-01`–`easm-02`, `cloud-connector-01`–`cloud-connector-24`, `zwa-01`–`zwa-05`, `business-insights-01`, `soc-workbench-01`, `unified-01`, `risk360-01`–`risk360-02`, `breach-predictor-01`, `uvm-01`, `dspm-01`, `aem-01`, `deception-01`, `identity-protection-01`, `zero-trust-branch-01`, `zscaler-cellular-01`.

The vendor-MCP scrape (2026-06-14) added these open behavior questions — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zia-47`](#zia-47-dns-control-block_response_code-accepted-values) | DNS Control `block_response_code` accepted-value set | lab test / tenant snapshot |
| [`zia-48`](#zia-48-dns-control-redirect_ip-action-binding) | DNS Control `redirect_ip` action-binding (all `REDIR_*` vs `REDIR_RES` only) | lab test |
| [`zia-49`](#zia-49-cac-per-app-action-validity) | CAC per-app action validity (which actions a given app accepts) | lab test |
| [`zpa-20`](#zpa-20-zpn_status_pending-as-a-real-runtime-status) | Whether `ZPN_STATUS_PENDING` is a real App Connector runtime status | tenant snapshot / lab test |
| [`zcc-76`](#zcc-76-otp-expiry-ttl-server-behavior) | Whether ZCC one-time passwords expire server-side (TTL) | lab test / zscaler doc not yet read |
| [`zdx-01`](#zdx-01-probe-id-non-portability-server-behavior) | ZDX probe-ID non-portability — server behavior on a cross-pair probe ID | lab test |
| [`zdx-02`](#zdx-02-concurrent-deeptrace-session-limits) | ZDX concurrent deeptrace session limits per tenant / per device | lab test / zscaler doc not yet read |
| [`zms-01`](#zms-01-fetchall-beyond-policyrules) | Whether ZMS `fetchAll` exists server-side beyond `policyRules` | SDK re-check / lab test |
| [`easm-01`](#easm-01-finding-scan_type-allowed-values) | EASM finding `scan_type` allowed-value set | tenant snapshot / zscaler doc not yet read |
| [`easm-02`](#easm-02-finding-risk-field-value-semantics) | EASM finding risk-field semantics (`risk_level` / `cisa_likelihood` / `epss_likelihood`) | tenant snapshot / zscaler doc not yet read |

The 2026-06-16 ZWA refresh registered these open Workflow Automation behavior/source questions — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zwa-01`](#zwa-01-workflow-configuration-programmability) | Workflow configuration programmability | vendor API documentation / SDK-provider source / lab test |
| [`zwa-02`](#zwa-02-dlp-incident-delete-semantics) | DLP incident delete semantics | lab test / vendor documentation |
| [`zwa-03`](#zwa-03-zwa-audit-log-retention-and-streaming) | ZWA audit-log retention and streaming | vendor documentation / support ticket / tenant snapshot |
| [`zwa-04`](#zwa-04-current-vs-legacy-auth-boundary) | Current-vs-legacy auth boundary | vendor documentation / lab test |
| [`zwa-05`](#zwa-05-trigger-context-query-param-sdk-coverage) | Trigger context query-param SDK coverage | SDK source update / lab test |

The 2026-06-15 ZIA refresh registered these open ZIA behavior/source questions surfaced by the per-doc Open-questions sweep — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zia-50`](#zia-50-ruletype-filter-endpoint-rest-backing) | `ruleType` filter endpoint REST backing | zscaler doc not yet read / lab test |
| [`zia-51`](#zia-51-cross-sdk-parity-drift-and-python-devicegroups-write-path) | Cross-SDK parity drift and Python `devicegroups` write-path | code read / lab test |
| [`zia-52`](#zia-52-ipssignaturerules-import-wire-behavior-and-multipart-field-name) | `ipsSignatureRules` import wire behavior and multipart field name | lab test |
| [`zia-53`](#zia-53-cac-atomic-validation-contract-and-representative-app-action-quirk) | CAC atomic-validation contract and representative-app action quirk (MCP-docstring-only) | lab test |
| [`zia-54`](#zia-54-python-cloudappriskprofile-list-vs-single-shape) | Python `cloudAppRiskProfile` list-vs-single code shape | code read / lab test |
| [`zia-55`](#zia-55-admin-audit-report-pagination-and-targetorgid-semantics) | Admin audit report pagination and `targetOrgId` MSP semantics | lab test / tenant snapshot |
| [`zia-56`](#zia-56-bandwidth-class-type-enum-vs-ui-predefined-classes-and-cap-enforcement) | Bandwidth class `type` enum vs UI predefined classes, and cap enforcement | zscaler doc not yet read / lab test |
| [`zia-57`](#zia-57-ftp-and-file-type-control-field-dependency-and-enum-surfaces) | FTP and File Type Control field-dependency and enum surfaces | lab test / zscaler doc not yet read |
| [`zia-58`](#zia-58-dlp-web-rule-actionseverity-enums-parentsub-rule-composition-externaldlp-behavior) | DLP web rule action/severity enums, parent/sub-rule composition, EXTERNALDLP behavior | lab test / zscaler doc not yet read |
| [`zia-59`](#zia-59-plain-redir_req-dns_gateway-requirement-and-edns_ecs_objectzpa-pairing) | Plain `REDIR_REQ` `dns_gateway` requirement and `edns_ecs_object`/ZPA pairing | lab test |
| [`zia-60`](#zia-60-network-service-type-behavior-countrycategory-enums-and-caps) | Network Service `type` behavior, country/category enums, and caps | lab test / zscaler doc not yet read |
| [`zia-61`](#zia-61-atpmalware-tenant-defaults-singleton-interdependence-capture-vs-denylist) | ATP/Malware tenant defaults, singleton interdependence, capture-vs-denylist | lab test / zscaler doc not yet read |
| [`zia-62`](#zia-62-pse-shared-nat-rejection-zia-only-health-monitoring-hardware-pse-api) | PSE shared-NAT rejection, ZIA-only health monitoring, hardware-PSE API | zscaler doc not yet read / support ticket / code read |
| [`zia-63`](#zia-63-sandbox-md5-blocklist-quota-help-portal-enum-and-the-mpatp-diagnosis-api-gap) | Sandbox MD5 blocklist quota, help-portal enum, and the MP/ATP diagnosis API gap | lab test / zscaler doc not yet read |
| [`zia-64`](#zia-64-scim-department-matching-attribute-length-activefalse-session-kill-and-caps) | SCIM department matching, attribute length, `active=false` session-kill, and caps | lab test / zscaler doc not yet read |
| [`zia-65`](#zia-65-ucaas-one-click-toggle-field-location) | UCaaS One-Click toggle field location | tenant snapshot / zscaler doc not yet read |
| [`zia-66`](#zia-66-whether-the-255-ssl-inspection-rule-cap-is-raisable) | Whether the 255 SSL Inspection rule cap is raisable | zscaler doc not yet read / support ticket |
| [`zia-67`](#zia-67-tenant-profile-per-app-wire-mechanic-and-v1v2-protocol-semantics) | Tenant Profile per-app wire mechanic and v1/v2 protocol semantics | zscaler doc not yet read / lab test |
| [`zia-68`](#zia-68-terraform-url_categories_predefined-ea-gating-sandbox-v1v2-endpoint-static-ip-throttle) | Terraform `url_categories_predefined` EA gating, sandbox v1/v2 endpoint, static-IP throttle | zscaler doc not yet read / lab test |
| [`zia-69`](#zia-69-workload-group-runtime-expression-evaluation-expressionjson-sync-and-tag-type-enum) | Workload-group runtime expression evaluation, `expressionJson` sync, and tag-type enum | lab test / zscaler doc not yet read |
| [`zia-70`](#zia-70-dlp_web_rules-live-read-returns-undocumented-uctemplateid) | `dlp_web_rules` live read returns undocumented `ucTemplateId` | lab test / zscaler confirmation |

The ZPA reference re-verification pass (2026-06-15) registered the remaining `## Open questions` items from the ZPA docs — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zpa-21`](#zpa-21-praapplicationapplicationprotocol-full-enum-citation-scope) | `PRAApplication.applicationProtocol` full enum citation scope in Postman | code read |
| [`zpa-22`](#zpa-22-privatecloudcontroller-canonical-restart-path) | PrivateCloudController canonical restart path (Go vs Python SDK divergence) | lab test |
| [`zpa-23`](#zpa-23-credential-sensitive-fields-in-get-response) | Whether `password` / `private_key` are returned on a Credential GET | tenant snapshot / lab test |
| [`zpa-24`](#zpa-24-nla-as-a-valid-connectionsecurity-value-for-pra-sub-apps) | `NLA` as a valid PRA sub-app `connectionSecurity` value | lab test |
| [`zpa-25`](#zpa-25-bacertificate-update_certificate-validity-as-an-api-operation) | BaCertificate `update_certificate` (PUT) validity as an API operation | lab test |
| [`zpa-26`](#zpa-26-zpn_client_type_browser_isolation-in-lss-policy-conditions) | `zpn_client_type_browser_isolation` validity in LSS policy conditions | lab test |
| [`zpa-27`](#zpa-27-app-connector-to-app-latency-probe-cadence) | App Connector-to-app latency probe cadence | zscaler doc not yet read / operator experience |
| [`zpa-28`](#zpa-28-app-connector-certificate-validity-window-before-re-enrollment) | App Connector certificate validity window before re-enrollment | zscaler doc not yet read / operator experience |
| [`zpa-29`](#zpa-29-maximum-app-connectors-per-group) | Maximum App Connectors per group | zscaler doc not yet read / support ticket |
| [`zpa-30`](#zpa-30-provisioning-key-auto-delete-on-group-delete-api-behavior) | Provisioning-key auto-delete on group delete (API behavior) | lab test |
| [`zpa-31`](#zpa-31-whether-the-zpa-api-requires-an-enrollment-cert-for-connector-type-provisioning-keys) | Whether the API requires an enrollment cert for connector-type keys | lab test |
| [`zpa-32`](#zpa-32-zpn_audit_log-lss-field-schema) | `zpn_audit_log` LSS field schema | zscaler doc not yet read |
| [`zpa-33`](#zpa-33-siem_policy-purpose-relative-to-audit-log-streaming) | `SIEM_POLICY` purpose relative to audit-log streaming | zscaler doc not yet read / lab test |
| [`zpa-34`](#zpa-34-microtenant-audit-log-scoping) | Microtenant audit-log scoping (isolated vs parent-visible) | tenant snapshot / lab test |
| [`zpa-35`](#zpa-35-lssconfigfilter-valid-expressions-for-zpn_audit_log) | `LSSConfig.filter` valid expressions for `zpn_audit_log` | zscaler doc not yet read |
| [`zpa-36`](#zpa-36-runtime-semantics-of-trust_untrusted_cert-and-allow_options) | Runtime semantics of `trust_untrusted_cert` / `allow_options` | zscaler doc not yet read / lab test |
| [`zpa-37`](#zpa-37-get-stepupauthlevel-response-shape-and-write-verb-support) | `GET /stepupauthlevel` response shape and write-verb support | lab test |
| [`zpa-38`](#zpa-38-oauth2-user-code-legacy-host-zpa-path-prefix) | OAuth2 user-code legacy host `/zpa` path prefix | lab test |
| [`zpa-39`](#zpa-39-assistantschedule-legacy-endpoint-still-served-vs-retired-alias) | `/assistantSchedule` legacy endpoint — still served vs retired alias | lab test |
| [`zpa-40`](#zpa-40-zpn_auth_log_1id-human-facing-label) | `zpn_auth_log_1id` human-facing label | zscaler doc not yet read |
| [`zpa-41`](#zpa-41-format-only-log-type-codes-acceptance-on-a-receivers-sourcelogtype) | Format-only log-type codes' acceptance on a receiver's `sourceLogType` | lab test |
| [`zpa-42`](#zpa-42-console-path-for-the-global-enable-zpa-machine-tunnel-for-all-toggle) | Console path for the global "Enable ZPA Machine Tunnel for All" toggle | tenant snapshot / operator experience |
| [`zpa-43`](#zpa-43-machine-tunnel-behavior-during-user-session-transitions) | Machine tunnel behavior during user session transitions | lab test / operator experience |
| [`zpa-44`](#zpa-44-macos-mdm-enrollment-effect-on-machine-tunnel-provisioning) | macOS MDM (Jamf/Intune) effect on machine-tunnel provisioning | zscaler doc not yet read / lab test |
| [`zpa-45`](#zpa-45-machine-tunnel-provisioning-key-mechanism) | Machine-tunnel provisioning key mechanism | zscaler doc not yet read / tenant snapshot |
| [`zpa-46`](#zpa-46-api-enforcement-of-the-chrome_posture_profile-vs-chrome_enterprise-operand-form-split) | API enforcement of the CHROME_POSTURE_PROFILE vs CHROME_ENTERPRISE operand-form split | lab test |
| [`zpa-47`](#zpa-47-private-service-edge-vm-sizing-and-per-instance-session-limits) | PSE VM sizing and per-instance session limits | zscaler doc not yet read |
| [`zpa-48`](#zpa-48-pse-provisioning-key-apiterraform-support) | PSE provisioning-key API/Terraform support | zscaler doc not yet read / lab test |
| [`zpa-49`](#zpa-49-supported-hypervisor-cloud-image-formats-for-zpa-pses) | Supported hypervisor / cloud-image formats for ZPA PSEs | zscaler doc not yet read |
| [`zpa-50`](#zpa-50-zpa-pse-dedicated-hardware-appliance-availability) | ZPA PSE dedicated hardware appliance availability | zscaler doc not yet read / support ticket |
| [`zpa-51`](#zpa-51-private-cloud-controller-product-positioning) | Private Cloud Controller product positioning | zscaler doc not yet read |
| [`zpa-52`](#zpa-52-restart_private_controller-operational-semantics) | `restart_private_controller` operational semantics (graceful vs hard) | lab test |
| [`zpa-53`](#zpa-53-service-edge-auto-delete-schedule-accepted-frequency-values-and-defaults) | Service Edge Auto-Delete schedule accepted `frequency` values + defaults | zscaler doc not yet read / lab test |
| [`zpa-54`](#zpa-54-pse-location-geoip-update-propagation-delay) | PSE location / GeoIP update propagation delay | zscaler doc not yet read / operator experience |
| [`zpa-55`](#zpa-55-pse-oauth2-enrollment-path-licensereplacement-semantics) | PSE OAuth2 enrollment path license/replacement semantics | zscaler doc not yet read / lab test |
| [`zpa-56`](#zpa-56-maximum-pses-per-group) | Maximum PSEs per group | zscaler doc not yet read / support ticket |
| [`zpa-57`](#zpa-57-whether-session-recording-approval-workflow-and-credential-pooling-are-formally-absent-from-base-non-pra-zpa) | Whether session recording / approval / credential pooling are absent from base ZPA | zscaler doc not yet read |
| [`zpa-58`](#zpa-58-zpa-public-tier-specific-behavior-scale-safe-mode) | ZPA Public-tier-specific behavior (scale / Safe-mode) | zscaler doc not yet read |
| [`zpa-59`](#zpa-59-zpa-public-tier-policy-caching-ca-reconnect-semantics) | ZPA Public-tier policy-caching / CA-reconnect semantics | zscaler doc not yet read |
| [`zpa-60`](#zpa-60-upgrade_priority-allowed-values-and-effect-for-the-zpa-service-edge-tier) | `upgrade_priority` allowed values and effect for ZPA service-edge tier | zscaler doc not yet read / lab test |
| [`zpa-61`](#zpa-61-authoritative-zpa-saml-attribute-limit) | Authoritative ZPA SAML attribute limit (is it exactly 100?) | zscaler doc not yet read / lab test |
| [`zpa-62`](#zpa-62-userattribute-and-delta-saml-attribute-field-semantics) | `userAttribute` and `delta` SAML-attribute field semantics | zscaler doc not yet read / lab test |
| [`zpa-63`](#zpa-63-behavior-when-a-scim_group-operand-references-a-deleted-group) | Behavior when a `SCIM_GROUP` operand references a deleted group | lab test |
| [`zpa-64`](#zpa-64-scim-group-internal_id-field-semantics) | SCIM group `internal_id` field semantics | zscaler doc not yet read / tenant snapshot |
| [`zpa-65`](#zpa-65-enable_scim_based_policy-false-fallback-behavior) | `enable_scim_based_policy` false fallback behavior | lab test |
| [`zpa-66`](#zpa-66-scim-attribute-value-matching-case-sensitivity) | SCIM attribute value matching case sensitivity | lab test |
| [`zpa-67`](#zpa-67-scim-group-membership-resolution-timing-session-vs-per-evaluation) | SCIM group membership resolution timing (session vs per-evaluation) | lab test |
| [`zpa-68`](#zpa-68-isolation-policy-v2-scim_group-support) | Isolation policy v2 `SCIM_GROUP` support | code read / lab test |
| [`zpa-69`](#zpa-69-segment-group-update_group_v2-vs-v1-behavioral-difference) | Segment Group `update_group_v2` vs v1 behavioral difference | zscaler doc not yet read / lab test |
| [`zpa-70`](#zpa-70-segment-group-skip_detailed_app_info-effect-on-writes) | Segment Group `skip_detailed_app_info` effect on writes | lab test |
| [`zpa-71`](#zpa-71-segment-group-tcpkeepaliveenabled-adminruntime-effect) | Segment Group `tcpKeepAliveEnabled` admin/runtime effect | zscaler doc not yet read |
| [`zpa-72`](#zpa-72-segment-group-config_space-accepted-values) | Segment Group `config_space` accepted values | lab test / zscaler doc not yet read |
| [`zpa-73`](#zpa-73-objecttype-zpn_internal_internet_protocol-and-user-wire-validity) | `objectType` `ZPN_INTERNAL_INTERNET_PROTOCOL` / `USER` wire validity | lab test |
| [`zpa-74`](#zpa-74-tcpkeepalive-literal-wire-token-quoted-string-vs-bare-integer) | `tcpKeepAlive` literal wire token (quoted string vs bare integer) | tenant snapshot |
| [`zpa-75`](#zpa-75-configspace-at-the-segment-top-level) | `configSpace` valid at the segment top level | tenant snapshot |
| [`zpa-76`](#zpa-76-which-lss-source_log_type-values-require-a-policy_rule_resource-block) | Which LSS `source_log_type` values require a `policy_rule_resource` block | zscaler doc not yet read / lab test |
| [`zpa-77`](#zpa-77-tag-tag-group-membership-referenced-in-policy-rule-conditions) | Tag / tag-group membership referenced in policy rule conditions (Early Access) | zscaler doc not yet read / lab test |
| [`zpa-78`](#zpa-78-trusted_network-rhs-false-runtime-semantics) | `TRUSTED_NETWORK` `rhs = "false"` runtime semantics | lab test |
| [`zpa-79`](#zpa-79-provisioning-trigger-that-creates-zpa-trusted-network-objects) | Provisioning trigger that creates ZPA Trusted Network objects | zscaler doc not yet read / operator experience |
| [`zpa-80`](#zpa-80-zcczpa-trusted-network-signal-at-session-establishment) | ZCC→ZPA trusted-network signal at session establishment | zscaler doc not yet read / lab test |
| [`zpa-81`](#zpa-81-pse-routing-off-network-fallback-when-is_public-false) | PSE routing / off-network fallback when `is_public = false` | zscaler doc not yet read / lab test |

The ZCC deep-dive refresh (2026-06-15) registered these open behavior questions surfaced in the per-doc **Open questions** sections — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zcc-77`](#zcc-77-webpolicy-top-vs-nested-block-precedence-on-write) | WebPolicy `*Top` root-level vs nested-block field precedence on write | lab test |
| [`zcc-78`](#zcc-78-webpolicy-devicetype-vs-device_type-write-precedence) | WebPolicy `DeviceTypeAlt` (int, wire `deviceType`) vs `DeviceType` (int, wire `device_type`) precedence on write | lab test |
| [`zcc-79`](#zcc-79-webpolicy-selected-form-state-fields-required-on-write) | Which WebPolicy `*Selected` / `*SelectedOption` form-state fields are required on write | lab test |
| [`zcc-80`](#zcc-80-zcc-v1-vs-v2-endpoint-coexistence) | ZCC v1 vs v2 endpoint coexistence / supersession | zscaler doc not yet read / lab test |
| [`zcc-81`](#zcc-81-device-zd-vs-zdp-field-prefix-meanings) | Device `zd*` vs `zdp*` field-prefix service meanings | zscaler doc not yet read / tenant snapshot |
| [`zcc-82`](#zcc-82-device-registration_state-vs-state-distinction) | Device `registration_state` vs `state` distinction | tenant snapshot / zscaler doc not yet read |
| [`zcc-83`](#zcc-83-devicedetailsstate-type-wire-type-per-endpoint) | `DeviceDetails.state` / `type` wire type (int on list vs string on detail) | tenant snapshot |
| [`zcc-84`](#zcc-84-unified-tunnel-operational-semantics) | Unified Tunnel operational semantics vs two separate Z-Tunnels | zscaler doc not yet read / lab test |
| [`zcc-85`](#zcc-85-app-profile-fail-close-vs-tenant-failopenpolicy-precedence) | App-Profile fail-close vs tenant-global `FailOpenPolicy` precedence | lab test |
| [`zcc-86`](#zcc-86-get_web_privacy-returns-none-on-error) | `get_web_privacy` returns `None` on error rather than a result tuple | code read (resolved) |
| [`zcc-87`](#zcc-87-zcc-rate-limit-header-behavior-on-the-oneapi-path) | ZCC rate-limit header behavior on the OneAPI path | zscaler doc not yet read / lab test |
| [`zcc-88`](#zcc-88-webpolicy-read-shape-macpolicy-vs-macospolicy-key) | WebPolicy read-shape macOS sub-policy key (`macPolicy` vs `macosPolicy`) | tenant snapshot |
| [`zcc-89`](#zcc-89-webpolicy-groups-users-devicegroups-wire-shape) | WebPolicy `groups` / `users` / `deviceGroups` wire shape on `listByCompany` | tenant snapshot |
| [`zcc-90`](#zcc-90-webpolicy-companion-devicetype-string-presence-on-reads) | WebPolicy companion `deviceType` string presence on reads | tenant snapshot |
| [`zcc-91`](#zcc-91-app-supportability-toggle-tenant-defaults) | App Supportability toggle tenant-default values | tenant snapshot / zscaler doc not yet read |
| [`zcc-92`](#zcc-92-per-product-disable-password-authority-webpolicy-vs-manage_pass) | Per-product disable-password authority (`WebPolicy` vs `manage_pass`) and key mapping | lab test / zscaler doc not yet read |
| [`zcc-93`](#zcc-93-macos-password-read-key-vs-write-key-api-behavior) | macOS password read-key vs write-key (camelCase vs snake_case) API behavior | lab test |
| [`zcc-94`](#zcc-94-per-platform-password-gate-ui-surface-per-os) | Which per-platform password gates render as user-facing UI per OS | operator experience / zscaler doc not yet read |
| [`zcc-95`](#zcc-95-trusted-network-stateful-evaluation-across-transitions) | Trusted-network stateful evaluation across transitions (debounce / cache) | lab test |
| [`zcc-96`](#zcc-96-multiple-trustednetworks-partial-match-precedence) | Precedence when multiple TrustedNetworks partially match in one Forwarding Profile | lab test |
| [`zcc-97`](#zcc-97-forwarding_profile_id-orphan-reference-resolution) | `forwarding_profile_id` orphan-reference resolution at enforcement | lab test |
| [`zcc-98`](#zcc-98-on-net-policy-vs-forwarding-profile-evaluation-order) | On-Net policy vs Forwarding Profile evaluation order | lab test |
| [`zcc-99`](#zcc-99-dropquictraffic-browser-tcp-fallback-effect) | `dropQuicTraffic` effect on browser TCP fallback | operator experience / lab test |
| [`zcc-100`](#zcc-100-ipv6-only-network-behavior-of-the-drop_ipv6-flags) | IPv6-only-network runtime behavior of the three `drop_ipv6*` flags | lab test |
| [`zcc-101`](#zcc-101-service-edge-split-landing-control-connection-behavior) | Service-Edge split-landing control-connection behavior | zscaler doc not yet read / operator experience |

The ZDX deep-dive refresh (2026-06-15) registered these open ZDX-behavior questions from the per-doc Open-questions sweep — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zdx-03`](#zdx-03-zdx-token-host-per-tenant) | Which ZDX host (`api.zdxcloud.net` vs `api.zsapi.net`) a given tenant authenticates against | lab test / zscaler doc not yet read |
| [`zdx-04`](#zdx-04-zdx-rate-limit-header-family-per-host) | Whether each ZDX host emits the rate-limit header family its source expects | lab test / support ticket |
| [`zdx-05`](#zdx-05-zdx-server-tier-table-vs-client-flat-limiter) | Whether the server license-tier rate table reconciles with the Go client's flat limiter | zscaler doc not yet read / support ticket |
| [`zdx-06`](#zdx-06-get_device_app-live-response-shape) | `get_device_app` live response shape (timeseries vs single score) | lab test / zscaler doc not yet read |
| [`zdx-07`](#zdx-07-deviceevents-live-response-key) | `DeviceEvents` live response key (`instances` vs `events`) | lab test / zscaler doc not yet read |
| [`zdx-08`](#zdx-08-callqualitymetricsmetrics-live-shape) | `CallQualityMetrics.metrics` live element shape | lab test / zscaler doc not yet read |
| [`zdx-09`](#zdx-09-org-list-time-filter-semantics) | Time-filter semantics on department/location org lists | lab test / zscaler doc not yet read |
| [`zdx-10`](#zdx-10-q-vs-search-matching-on-getlocationsfilters) | `Q` vs `Search` matching behavior on `GetLocationsFilters` | lab test / zscaler doc not yet read |
| [`zdx-11`](#zdx-11-exhaustive-metric_name-value-set) | Exhaustive `metric_name` value set for app metrics | zscaler doc not yet read / lab test |
| [`zdx-12`](#zdx-12-tenant-level-application-inventory) | Whether the app list returns apps with no recent probe data | tenant snapshot / zscaler doc not yet read |
| [`zdx-13`](#zdx-13-probe-metadata-per-application) | Which probes are attached to a given application ID | zscaler doc not yet read / operator experience |
| [`zdx-14`](#zdx-14-application-auto-detection-vs-manual-config) | Whether ZDX auto-discovers apps or requires manual config | zscaler doc not yet read / operator experience |
| [`zdx-15`](#zdx-15-zdx-ca-topology) | ZDX Central Authority topology (active-passive vs active-active) | zscaler doc not yet read / support ticket |
| [`zdx-16`](#zdx-16-region-boundary-definition-and-geographic-weighting) | Region boundary definition + same-region peer weighting function | zscaler doc not yet read / lab test |
| [`zdx-17`](#zdx-17-data-retention-gdpr-and-data-residency) | ZDX data retention period, purge, and data-residency controls | zscaler doc not yet read / support ticket |
| [`zdx-18`](#zdx-18-tpg-geo-distribution-and-failover) | TPG geo-distribution, SLA, and failover behavior | zscaler doc not yet read / support ticket |
| [`zdx-19`](#zdx-19-zcc-metric-buffering-when-tpg-unreachable) | ZCC on-device metric buffering when the TPG is unreachable | zscaler doc not yet read / lab test |
| [`zdx-20`](#zdx-20-cloud-path-probe-routing-through-service-edges) | Whether Cloud Path probe routing through Service Edges is mandatory/optional | zscaler doc not yet read / lab test |
| [`zdx-21`](#zdx-21-call-quality-monitoring-data-flow) | Call Quality Monitoring polling frequency, latency, failure modes | zscaler doc not yet read / support ticket |
| [`zdx-22`](#zdx-22-adx-tenant-isolation-mechanism) | ADX-layer tenant isolation mechanism | zscaler doc not yet read / support ticket |
| [`zdx-23`](#zdx-23-wi-fi-field-availability-in-device-api-response) | Wi-Fi field availability in the device API response | lab test / zscaler doc not yet read |
| [`zdx-24`](#zdx-24-device-health-metric-category-enumeration) | Exhaustive device health-metric category set | zscaler doc not yet read / lab test |
| [`zdx-25`](#zdx-25-os_build-api-presence) | Whether `os_build` is present in the device wire response | lab test / zscaler doc not yet read |
| [`zdx-26`](#zdx-26-geolocation-hierarchy-traversal) | Device geolocation hierarchy traversal model | zscaler doc not yet read / lab test |
| [`zdx-27`](#zdx-27-device-event-category-enumeration) | Whether device events span categories beyond Zscaler/Hardware/Software/Network | lab test / zscaler doc not yet read |
| [`zdx-28`](#zdx-28-call-quality-metrics-application-scope-and-metric-labels) | Which apps populate call-quality-metrics and which metric labels appear | lab test / zscaler doc not yet read |
| [`zdx-29`](#zdx-29-device-grouping-cohorts) | Whether ZDX supports device grouping / cohorts | zscaler doc not yet read / operator experience |
| [`zdx-30`](#zdx-30-per-probe-cadence-during-a-diagnostics-session) | Per-probe cadence during a Diagnostics Session | zscaler doc not yet read / lab test |
| [`zdx-31`](#zdx-31-alert-rule-evaluation-cadence) | Alert rule-evaluation interval | zscaler doc not yet read / lab test |
| [`zdx-32`](#zdx-32-deeptrace-session-name-wire-field) | Deeptrace session-name wire field (`name` vs `session_name`) | lab test / zscaler doc not yet read |
| [`zdx-33`](#zdx-33-session_length-request-vs-response-key) | `session_length` request-vs-response key divergence | lab test / zscaler doc not yet read |
| [`zdx-34`](#zdx-34-maximum-look-back-window-and-probe-id-expiry) | Maximum probe look-back window and probe-ID expiry | lab test / zscaler doc not yet read |
| [`zdx-35`](#zdx-35-share_snapshot-obfuscation-transmission) | Whether the Python `share_snapshot` wires `obfuscation` to the API | code read / lab test |
| [`zdx-36`](#zdx-36-pft-vs-availability-score-weighting) | Numerical PFT-vs-Availability weighting in the ZDX Score | zscaler doc not yet read / lab test |
| [`zdx-37`](#zdx-37-zero-value-handling-in-the-lowest-value-within-hour-rollup) | Zero/null handling in the lowest-value-within-hour rollup | zscaler doc not yet read / lab test |
| [`zdx-38`](#zdx-38-which-metrics-feed-the-composite-score) | Which retrievable metrics actually feed the composite score | zscaler doc not yet read / lab test |
| [`zdx-39`](#zdx-39-score-recalculation-lag-for-new-users-or-devices) | Score-appearance lag for new users/devices | zscaler doc not yet read / operator experience |
| [`zdx-40`](#zdx-40-device-level-vs-user-level-score-aggregation) | Whether score is per (user, device) or rolled up per user | zscaler doc not yet read / lab test |
| [`zdx-41`](#zdx-41-probe-result-retention-and-aging-granularity) | Probe-result retention period and aging granularity | zscaler doc not yet read / tenant snapshot |
| [`zdx-42`](#zdx-42-adaptive-mode-scoring-comparability) | Whether Adaptive Mode keeps scores comparable across cadences | zscaler doc not yet read / lab test |
| [`zdx-43`](#zdx-43-inventory-time-range-filter-server-support) | Whether the inventory endpoint honors the time-range filter server-side | lab test / zscaler doc not yet read |

The ZIdentity refresh (2026-06-15) registered these open behavior questions from `references/zidentity/*.md` — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zid-01`](#zid-01-admin-permission-level-enum-restricted-full-restrictive-view) | Admin permission-level enum (Restricted Full / Restrictive View vs Full / View Only / Restricted / None) | zscaler doc not yet read / tenant snapshot |
| [`zid-02`](#zid-02-zidentity-role-to-per-product-scope-inheritance) | ZIdentity role to per-product (ZIA/ZPA) scope inheritance | tenant snapshot / zscaler doc not yet read |
| [`zid-03`](#zid-03-role-management-apis-absent-from-the-sdk-surface) | Role-management APIs absent from the SDK surface | zscaler doc not yet read / live API trace |
| [`zid-04`](#zid-04-admin-role-assignment-audit-trail) | Admin role-assignment audit trail | zscaler doc not yet read / live API trace |
| [`zid-05`](#zid-05-scope-field-semantics-and-value-enum) | Entitlement `scope` field semantics and value enum (`Global` / `Limited` / `AllResources`) | vendor documentation / tenant-side check |
| [`zid-06`](#zid-06-service-vs-administrative-entitlements-when-to-use-which) | Service vs administrative entitlements: when to use which | vendor documentation / operator experience |
| [`zid-07`](#zid-07-get_service_entitlement-return-shape-for-multi-service-users) | `get_service_entitlement` return shape for multi-service users | lab test |
| [`zid-08`](#zid-08-entitlement-api-behavior-by-user-idp-source) | Entitlement API behavior by user IdP source (SCIM vs internal) | tenant-side check |
| [`zid-09`](#zid-09-scope-forward-compatibility-single-object-vs-list) | Scope forward-compatibility (single object vs list) | vendor API spec / changelog review |
| [`zid-10`](#zid-10-entitlement-role-name-enum-completeness) | Entitlement role-name enum completeness | vendor documentation / live API enumeration |
| [`zid-11`](#zid-11-access_token_life_time-field-semantics) | `access_token_life_time` field semantics (TTL vs active-flag docstring contradiction) | lab test / vendor documentation |
| [`zid-12`](#zid-12-token-revocation-via-sdk-api) | Token revocation via SDK / API and propagation window | zscaler doc not yet read / lab test |
| [`zid-13`](#zid-13-add_api_client_secret-expires_at-behavior) | `add_api_client_secret` `expires_at` behavior (omitted / past / range) | lab test |
| [`zid-14`](#zid-14-jwks-authtype-request-body-unobserved-in-vendored-sources) | JWKS `authType` request body unobserved in vendored sources | tenant snapshot / zscaler doc not yet read |
| [`zid-15`](#zid-15-bare-adminapiv1-prefix-acceptance-on-the-apizsapinet-host) | Bare `/admin/api/v1` prefix acceptance on the `api.zsapi.net` host | live API trace |
| [`zid-16`](#zid-16-which-wire-host-a-live-tenant-actually-serves) | Which wire host a live tenant actually serves | live API trace |
| [`zid-17`](#zid-17-group-dual-flag-semantics-isdynamicgroup-vs-dynamicgroup) | Group dual-flag semantics (`isDynamicGroup` vs `dynamicGroup`) | API spec review / lab test |
| [`zid-18`](#zid-18-dynamic-group-membership-mutation-behavior) | Dynamic-group membership mutation behavior | lab test |
| [`zid-19`](#zid-19-user-deduplication-in-bulk-add) | User deduplication in bulk add | lab test |
| [`zid-20`](#zid-20-scim-sourced-group-mutation-semantics) | SCIM-sourced group mutation semantics | lab test / vendor documentation |
| [`zid-21`](#zid-21-group-source-value-enum-completeness) | Group `source` value enum completeness | vendor documentation / live API enumeration |
| [`zid-22`](#zid-22-group-enableddisabled-flag-on-the-wire) | Group enabled/disabled flag on the wire | tenant snapshot / vendor documentation |
| [`zid-23`](#zid-23-empty-servicescopes-array-semantics) | Empty `serviceScopes` array semantics | tenant-side check / vendor documentation |
| [`zid-24`](#zid-24-defaultapi-flag-behavior) | `defaultApi` flag behavior | vendor documentation / lab test |
| [`zid-25`](#zid-25-resource-server-enumerability-hidden-internal-entries) | Resource-server enumerability (hidden internal entries) | tenant-side check / vendor documentation |
| [`zid-26`](#zid-26-zidentity-snapshot-writer-output-shape) | ZIdentity snapshot writer output shape (`.records[]` vs `.[0].records[]`) | design decision |
| [`zid-27`](#zid-27-secrets-snapshot-file-layout) | Secrets snapshot file layout | design decision |
| [`zid-28`](#zid-28-authentication-levels-per-product-or-global-only) | Authentication levels: per-product or global only | zscaler doc not yet read / tenant-side check |
| [`zid-29`](#zid-29-step-up-for-scim-users-without-a-mapped-external-idp-identity) | Step-up for SCIM users without a mapped external IdP identity | lab test / zscaler doc not yet read |
| [`zid-30`](#zid-30-step-up-message-to-user-localization) | Step-up "message to user" localization | zscaler doc not yet read / tenant-side check |
| [`zid-31`](#zid-31-where-step-up-elevation-is-logged) | Where step-up elevation is logged (ZIA Transaction / ZPA LSS) | lab test / zscaler doc not yet read |
| [`zid-32`](#zid-32-omitting-id-on-user-create) | Omitting `id` on user create | lab test / API spec review |
| [`zid-33`](#zid-33-about-revoking-access-tokens-articles-uncaptured) | About / Revoking Access Tokens articles uncaptured | zscaler doc not yet read / capture |
| [`zid-34`](#zid-34-api-client-access-policy-article-uncaptured) | API Client Access Policy article uncaptured | zscaler doc not yet read / capture |
| [`zid-35`](#zid-35-admin-roles-permissions-module-level-matrix-uncaptured) | Admin Roles & Permissions module × level matrix uncaptured | zscaler doc not yet read / capture |

Partial / SDK-mined (resolved via code read or help-doc capture; full lab confirmation pending): `zcc-01`, `zcc-02`, `zcc-03`, `zcc-04`, `zcc-05`, `zcc-06`, `zcc-07`, **`log-04`** (field name + illustrative values confirmed via `web-log-schema.md`; full enum of `ruletype` / `reason` values still needs a tenant export). All six ZCC enum clarifications had their **datatype** (int vs string) resolved by the Go SDK cross-check on 2026-04-24; the integer-to-meaning mapping remains open for `zcc-01` through `zcc-04` and `zcc-06`.

`shared-17`, `shared-18`, `shared-19` — partially resolved by 2026-05-06 doc sweep (refined further the same day). Existing-doc backing now covers: Service Edge re-evaluation triggers + **subcloud override mechanics fully resolved** via `references/shared/subclouds.md`; ZIA auth-frequency + surrogate-IP TTL fields and dependency rules + **ZIdentity step-up timing fully resolved** as synchronous via `vendor/zscaler-help/understanding-step-up-authentication-zidentity.md`; QUIC handling with ZTunnel-mode interaction, HTTP/2 enable toggle + Bandwidth Control fallback, WebSocket DLP Copilot-only carveout. The remaining sub-questions narrowed substantially: selection-signal weighting and DC-exclusion mechanics (shared-17), surrogate IP clock anchor + auth-source decision tree + trusted-network-transition behavior (shared-18), HTTP/2 per-stream re-evaluation + WebSocket non-DLP inspection coverage + gRPC/SSE/chunked behavior (shared-19).

The Cloud & Branch Connector (ZTW) deep-dive refresh (2026-06-15) added these open behavior questions — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`cloud-connector-01`](#cloud-connector-01-per-region-status-representation-regionstatusstatus) | Per-region `status` representation (boolean vs four console strings) | code read / lab test |
| [`cloud-connector-02`](#cloud-connector-02-aws-workload-discovery-cloudformation-body-eventbridge-iam-sqs) | AWS workload-discovery CloudFormation body (EventBridge / IAM / SQS) | zscaler doc not yet read / operator experience |
| [`cloud-connector-03`](#cloud-connector-03-source-ip-group-size-and-count-limits) | Source IP group member + per-tenant count limits | support ticket / lab test |
| [`cloud-connector-04`](#cloud-connector-04-ipv6-entries-in-ztc_ip_source_groups-vs-a-separate-ipv6-group-object) | IPv6 entries in `ztc_ip_source_groups` vs separate IPv6 group object | lab test / code read |
| [`cloud-connector-05`](#cloud-connector-05-source_ip_group_exclusion-applicability-to-cloud-branch-connector) | `source_ip_group_exclusion` applicability to CC | lab test |
| [`cloud-connector-06`](#cloud-connector-06-zia-origin-source-groups-editability-from-ztc-and-lite-payload-shape) | ZIA-origin group editability from ZTC + `/lite` payload shape | lab test / zscaler doc not yet read |
| [`cloud-connector-07`](#cloud-connector-07-ztg-vs-cloud-connector-group-type-semantics) | ZTG vs Cloud Connector group type semantics | zscaler doc not yet read / lab test |
| [`cloud-connector-08`](#cloud-connector-08-ha-mechanics-cchealth-port-fail-openclose-toggle-fail-open-egress-path) | HA: `?cchealth` port, fail-open/close toggle path, fail-open egress | lab test / zscaler doc not yet read |
| [`cloud-connector-09`](#cloud-connector-09-forwarding-method-semantics-and-the-true-backend-forwardmethod-enum) | `ENATDEDIP`/`GEOIP`/`PROXYCHAIN` semantics + true `forwardMethod` enum | lab test / Postman cross-check |
| [`cloud-connector-10`](#cloud-connector-10-forwarding-rule-count-limit-and-admin-rank-rule-order-interaction) | Forwarding rule-count limit + Admin Rank ↔ Rule Order interaction | support ticket / lab test |
| [`cloud-connector-11`](#cloud-connector-11-overwrite-dns-response-does-a-response-rewrite-action-exist-at-all) | "Overwrite DNS response" — does a response-rewrite action exist | zscaler doc not yet read / lab test |
| [`cloud-connector-12`](#cloud-connector-12-dns-rule-ui-match-criteria-tunnel-detection-and-doh-interception-not-in-the-sdk) | DNS rule UI criteria / tunnel detection / DoH interception not in SDK | zscaler doc not yet read / lab test |
| [`cloud-connector-13`](#cloud-connector-13-dns-gateway-failover-order-default-gateway-config-and-ipv6-on-referenced-resolvers) | DNS gateway failover order / default gateway / IPv6 resolvers | lab test / zscaler doc not yet read |
| [`cloud-connector-14`](#cloud-connector-14-duplicate-dns-gateway-packages-and-the-type-field-semantics) | Duplicate DNS gateway packages + `type` field semantics | lab test / code read |
| [`cloud-connector-15`](#cloud-connector-15-subcloud_primarysecondary-backend-behavior-for-cc-dc-proxies) | `subcloud_primary`/`secondary` backend behavior for CC DC proxies | lab test |
| [`cloud-connector-16`](#cloud-connector-16-ztc_traffic_forwarding_rule-oneapi-requirement-and-zpa-app-segment-id-equivalence) | `ztc_traffic_forwarding_rule` OneAPI requirement + ZPA segment-ID parity | lab test |
| [`cloud-connector-17`](#cloud-connector-17-local-local_switch-forwarding-method-real-behavior-or-doc-artifact) | "Local" / `LOCAL_SWITCH` forwarding method — real or doc artifact | lab test / Postman cross-check |
| [`cloud-connector-18`](#cloud-connector-18-ztw-api-surface-gaps-endpoint-paths-azuregcp-discovery-automation-go-zidentity-auth) | ZTW API gaps: endpoint paths / Azure-GCP discovery / Go ZIdentity auth | code read / lab test |
| [`cloud-connector-19`](#cloud-connector-19-ztw-sdk-method-convention-anomalies-and-oneapi-govten-exclusion-behavior) | ZTW SDK method-convention anomalies + OneAPI gov/ten exclusion behavior | code read / lab test |
| [`cloud-connector-20`](#cloud-connector-20-nss-va-for-cbc-feed-coverage-sizing-certs-ha-and-rule-match-semantics) | NSS VA for CBC: feed coverage / sizing / certs / HA / rule-match | zscaler doc not yet read / lab test |
| [`cloud-connector-21`](#cloud-connector-21-insightstunnel-insights-aggregation-and-byte-count-parity-with-nss-feeds) | Insights/Tunnel-Insights aggregation + byte-count parity with NSS feeds | lab test / zscaler doc not yet read |
| [`cloud-connector-22`](#cloud-connector-22-cc-region-coverage-govcloud-china-gcp-deployment-and-wds-vs-ztg-region-set-parity) | CC region coverage: GovCloud / China / GCP deploy / WDS-vs-ZTG parity | zscaler doc not yet read / tenant snapshot / support ticket |
| [`cloud-connector-23`](#cloud-connector-23-dest_workload_groups_ids-binding-to-local_switch-local) | `dest_workload_groups_ids` binding to `LOCAL_SWITCH` / "Local" | lab test |
| [`cloud-connector-24`](#cloud-connector-24-field-character-limit-enforcement-on-dns-and-log-and-control-rules) | Field character-limit enforcement on DNS / Log-and-Control rules | lab test / zscaler doc not yet read |

---

## Entries

### zia-01 — Predefined vs custom category specificity

*Origin: `references/zia/url-filtering.md` § Open questions*

If a URL matches both a predefined category (e.g., Social Networking) and a custom category with varying specificity, which one wins at policy evaluation time? Zscaler docs describe specificity-wins-across-custom-categories but are silent on custom-to-predefined comparison.

**Status**: resolved (2026-04-23).

**Answer**: The "both categories" premise is governed by the **Retain Parent Category** setting on each custom-category entry, which controls whether adding a URL to a custom category removes it from its predefined classification.

From *About URL Categories* (`vendor/zscaler-help/About_URL_Categories.txt`) p.19:

> If you manually add a URL or subdomain to an existing super category, category, or custom category, you can also specify whether you want it to retain its original parent category. For example, if you manually add www.google.com to a User-Defined category, you can specify whether you want google.com also to retain its original Web Search category.

Two cases:

- **Retain Parent Category OFF** (default behavior for manually-added URLs in most contexts): the URL is removed from its original predefined classification and belongs *only* to the custom category. Rules against the predefined category do not match. Rules against the custom category do.
- **Retain Parent Category ON**: the URL belongs to **both** the custom and its original predefined category simultaneously. Rules against either can match → **rule order decides** which fires (same first-match-wins principle that governs rule evaluation generally).

*URL Filtering Deployment and Operations Guide* (`vendor/zscaler-help/URL_Filtering_Deployment_and_Operations_Guide.txt`) p.4 confirms the rule-order behavior for the Retain-Parent case explicitly:

> Wrong category is shown on the blocked page: Check logs to see which category is logged for the transaction. Is the URL in question added to a custom category? If the site is added in the Retaining Parent category, check the rule order to make sure that another rule does not block access to this URL first.

This is a *different* resolution mechanism from the custom-to-custom specificity rule. Specificity-wins handles the case where a URL matches multiple custom categories at different specificities — it picks which one the URL "belongs to" before rules evaluate. Retain Parent Category handles the case where a URL is simultaneously in a custom and a predefined category — in that case rule order is the tiebreaker.

Operationally visible via the "No. of URLs Retaining Parent Category" / "No. of Keywords Retaining Parent Category" / "No. of IP Ranges Retaining Parent Category" columns on the URL Categories page (*About URL Categories* pp.21–22), and via the `urlsRetainingParentCategoryCount`, `keywordsRetainingParentCategoryCount`, `ipRangesRetainingParentCategoryCount`, and `patternsRetainingParentCategoryCount` fields in the `/urlCategories` API response (*Configuring URL Categories Using API*).

**Implication for the Q5-style question in `url-filtering.md`**: check the Retain-Parent state of the custom entry. If OFF → URL is only in the custom category, the predefined rule won't match. If ON → URL is in both, rule order resolves which fires. The prior "two plausible outcomes" framing collapses into one deterministic flow once Retain Parent is known.

---

### zia-02 — Same-specificity custom category collision

*Origin: `references/zia/url-filtering.md` § Open questions*

If two custom categories contain the identical exact entry (e.g., both have `www.example.com`), which category wins the URL at category-resolution time? Creation order? Internal category ID? First-rule-that-references-one?

**Resolves with**: lab test OR tenant snapshot. **Status**: open. **Blocks**: deterministic precedence answers when admins have overlapping custom categories.

**Doc sweep 2026-04-23**: Checked *About URL Categories*, *URL Filtering Deployment and Operations Guide*, *Configuring URL Categories Using API*, *Configuring the URL Filtering Policy*. None address two custom categories containing an identical exact entry. The "specific match first" rule (*About URL Categories* p.20) and the "more specific takes precedence" statement (*URL Filtering Ops Guide* p.2) only disambiguate when specificity differs. For equal-specificity collisions, no doc rule fires.

One data point, not a resolution: *Configuring URL Categories Using API* shows each category carries an internal numeric `val` identifier that increments on creation (CUSTOM_05 → val 132, CUSTOM_10 → val 137, CUSTOM_16 → val 143). This suggests ordering information exists internally, but whether category resolution uses it — vs creation-timestamp, vs alphabetical, vs something else — is not stated. Still a lab-test or tenant-snapshot question.

---

### zia-03 — Wildcard tokenization

*Origin: `references/zia/url-filtering.md` § Open questions; feeds `references/zia/wildcard-semantics.md`*

Zscaler's docs show wildcards as `.example.com` (leading dot, no asterisk). Whether `*.example.com`, `*example.com`, bare `example.com` behave differently was unclear.

**Status**: resolved (2026-04-23).

**Answer**: From *URL Format Guidelines* (`vendor/zscaler-help/url-format-guidelines.md`, captured via Playwright from https://help.zscaler.com/zia/url-format-guidelines):

- `*` is **not** a valid wildcard character. `*.safemarch.com` and `*safemarch.com` are explicitly **not permitted**.
- Leading period `.safemarch.com` is the only domain-level wildcard form. It matches: the bare domain, subdomains up to 5 levels deep, and any path under any of those.
- Exact form `safemarch.com` (no leading period) matches only the exact domain, plus implicit right-side path wildcard.
- Right-side (path / port / query-string) matching is implicit — no syntax needed.
- Exact match takes priority over wildcard match across custom categories.

Full semantics codified in `references/zia/wildcard-semantics.md`.

---

### zia-04 — NROD propagation lag

*Origin: `references/zia/url-filtering.md` § Open questions*

How long after a URL is first observed does Newly Registered and Observed Domains classification propagate to URL Filtering evaluation? Affects "why did this brand-new domain slip past our NROD-block rule" questions.

**Status**: partially resolved (2026-04-23).

**Answer**: Zscaler publishes the propagation-lag ceiling as "within hours of going live." From *Configuring Advanced Policy Settings* (`vendor/zscaler-help/Configuring_Advanced_Policy_Settings.txt`) p.1, describing the Enable Suspicious New Domains Lookup toggle:

> Enable this option to provide advanced protection to users against the newly registered and observed domains that are **identified within hours of going live**. This feature also identifies newly revived domains. These domains are often considered potentially malicious until they are well-known or categorized. Identifying them improves the overall security posture. This feature is a prerequisite for using the Newly Registered and Observed Domains and Newly Revived Domains URL categories in a policy rule.

Context from *About URL Categories* (`vendor/zscaler-help/About_URL_Categories.txt`) p.9:

> Sites whose domains were created in the last 30 days and are currently not categorized by Zscaler. ... To determine if a Miscellaneous or Unknown URL belongs in the Newly Registered and Observed Domain (NROD) category, when a URL is found in the Miscellaneous or Unknown category, it is checked against Zscaler's NROD database. If there's a match, the URL is categorized as a Newly Registered and Observed Domain.

So two distinct time windows now have doc-backed values:

- **Propagation lag** (domain goes live → appears in Zscaler's NROD database): "within hours" per Advanced Policy Settings. Not a precise SLA, but Zscaler's own published bound.
- **Eligibility window** (how long a domain stays in NROD after creation): 30 days per About URL Categories.

Related category "Newly Revived Domains" (*About URL Categories* p.18) covers sites reactivated after ~10 days of inactivity; different phenomenon, shares the same lookup toggle.

**Still open**: upper-bound precision. "Within hours" could mean 1, 6, or 24 — affects whether a Block-on-NROD rule reliably catches a domain that went live earlier the same day. Resolves with support ticket OR operator experience (observed delay in practice).

---

### zia-05 — Admin rank order collision

*Origin: `references/zia/url-filtering.md` § Open questions*

Admin rank gates what order values a rule can have. Can two rules at different admin ranks end up with the same numerical order? If so, which evaluates first — the higher-ranked one, the older one, the alphabetically earlier one?

**Status**: resolved (2026-04-23).

**Answer**: Admin rank is a structural precedence guarantee, not a tiebreaker layered on top of rule order. The question's premise (two rules at different admin ranks with the same numerical order) is effectively neutralized by the doc's behavior guarantee.

From *Configuring the URL Filtering Policy* (`vendor/zscaler-help/Configuring_the_URL_Filtering_Policy.txt`) p.3:

> **Edit Rule Order**: Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2, and so on), and the rule order reflects this rule's place in the order. You can change the value, but if you've enabled Admin Rank, your assigned admin rank determines the rule order values you can select.
>
> **Admin Rank**: Enter a value from 0 to 7 (0 is the highest rank). Your assigned admin rank determines the values you can select. You cannot select a rank that is higher than your own. The rule's admin rank determines the value you can select in the rule order, so that **a rule with a higher admin rank always precedes a rule with a lower admin rank**.

Two takeaways:

1. **Structural guarantee**: When Admin Rank is enabled, the console constrains the rule-order values each admin can pick so that a higher-rank rule (lower admin-rank number — 0 = highest) always ends up earlier in the evaluation order than a lower-rank rule.
2. **Functional behavior**: Evaluation order is deterministic and matches admin-rank precedence. Even if the numerical `order` value could somehow be equal across ranks (via API bypass or migration), the higher-rank rule is the one that fires first by design.

Admin Rank is an opt-in feature ("if you've enabled Admin Rank"); without it, rule order is a flat numeric sequence and admin identity doesn't affect evaluation.

Applies to ZIA URL Filtering, SSL Inspection, and other ZIA policy types that expose the Admin Rank field. ZPA access policies don't use the same admin-rank mechanism based on vendored material.

---

### zia-06 — CAC disabled rule semantics

*Origin: `references/zia/cloud-app-control.md` § Mechanics*

For URL Filtering, the docs explicitly state that disabled rules keep their place in the rule order. The CAC Deployment Guide doesn't restate this — whether disabled CAC rules behave identically (skip-in-place) or differently (removed from the evaluation list, changing effective order) is unstated. Very likely identical but unconfirmed.

**Status**: resolved (2026-04-23).

**Answer**: CAC's Rule Status semantic is **identical to URL Filtering's** — doc'd verbatim in the per-category Adding-X-Rule articles.

From *Adding an Instant Messaging Rule for Cloud App Control* (`vendor/zscaler-help/adding-instant-messaging-rule-cloud-app-control.md`), which is the template that all 19 per-category CAC rule-adding articles follow:

> **Rule Status**: An enabled rule is actively enforced. A disabled rule is not actively enforced but does not lose its place in the rule order. The service skips it and moves to the next rule.

This matches *Configuring the URL Filtering Policy* (`Configuring_the_URL_Filtering_Policy.txt`) p.3 word-for-word. CAC-Rule-Status-parity-with-URL-Filtering is now directly documented, not inferred.

Corroborating facts:

- *Adding Rules to the Cloud App Control Policy* (`vendor/zscaler-help/adding-rules-cloud-app-control-policy.md`) describes the predefined *Allow Unauthenticated Traffic for IoT Classifications* rule as "disabled by default and cannot be deleted" with Rule Status as a modifiable field — confirming per-rule Rule Status exists as a first-class CAC field, not just a URL-Filtering-only construct.
- The shared policy-enforcement engine doc (*Understanding Policy Enforcement* pp.1–13, see `zia-13`) covers URL Filtering and CAC under the same evaluation semantics, making cross-module behavioral divergence structurally unlikely.

---

### zia-07 — Cloud Application Risk Profile composition

*Origin: `references/zia/cloud-app-control.md` § Mechanics*

The CAC rule form offers "Cloud Application Risk Profile" as an alternative to enumerated "Cloud Applications." What a Risk Profile consists of — geolocation of data handling, vendor security attestations, encryption posture, published breach history, or something else — isn't described in the vendored docs. Needed to confidently answer "why was this app caught by our Medium-risk block rule?"

**Status**: resolved (2026-04-23).

**Answer**: A Cloud Application Risk Profile is an AND-of-ORs composition over a fixed set of **cloud-application attributes**. The profile matches any cloud application whose attributes satisfy all selected criteria.

From *About Cloud Application Risk Profile* (`vendor/zscaler-help/about-cloud-application-risk-profile.md`) and *Adding a Cloud Application Risk Profile* (`vendor/zscaler-help/adding-cloud-application-risk-profile.md`):

**Core classification attributes** (each can take one or more values; values within an attribute combine with OR):

- **Risk Index** — 1–5 (1 = lowest, 5 = highest). Each cloud application is assigned a Zscaler-computed risk score, with per-app overrides available from the Application Information page. Multi-select supported.
- **Application Status** — `Sanctioned` / `Unsanctioned`. Set per-app by the customer (see *About Cloud Application Status*).
- **Tags** — customer-assigned tags (see *About Cloud Application Tags*).
- **Certificates Supported** — named compliance certifications (e.g., `AICPA`, `GDPR`). Include- or exclude-style membership.
- **Password Strength** — `Good` / `Poor` / `Unknown` (see article for the full criteria definitions).
- **Data Encryption in Transit** — `SSLv2` / `SSLv3` / `TLSv1.0` / `TLSv1.1` / `TLSv1.2` / `TLSv1.3` / `Unknown`.
- **SSL Cert Key Size** — `Any` / `2048 Bits` / `256 Bits` / `3072 Bits` / `384 Bits` / `4096 Bits` / `Unknown`.

**Hosting & security characteristics** (each takes `Yes` / `No` / `Unknown`):

- Poor Terms of Service
- Admin Audit Logs
- Data Breach in 3 Years
- Source IP Restrictions
- MFA Support
- File Sharing
- SSL Pinned
- HTTP Security Header Support
- Evasive
- DNS CAA Policy
- Weak Cipher Support
- Valid SSL Certificate
- Published CVE Vulnerability
- Vulnerable to Heartbleed
- Vulnerable to Poodle
- Vulnerable to Logjam
- Support for WAF
- Remote Access Screen Sharing
- Vulnerability Disclosure Policy
- Sender Policy Framework (SPF)
- DomainKeys Identified Mail (DKIM)
- Domain-Based Message Authentication (DMARC)
- Malware Scanning for Content

**Composition logic**: AND between attributes; OR between multiple values within a multi-select attribute (Risk Index, Certificates Supported, Data Encryption in Transit, SSL Cert Key Size).

Example from the doc: `[Risk Index (1 OR 3 OR 5)] AND [Application Status (Sanctioned)] AND [Certificates Supported (AICPA OR GDPR)] AND [SSL Pinned (Yes)]`.

**Where the per-app attribute values come from**: Zscaler ThreatLabz (the vendor's security research arm) maintains the attribute database for known cloud apps. Customers can override Risk Index per app from the Application Information page. Status and Tags are customer-set.

**Implication for "why was this app caught by our Medium-risk block rule?"**: inspect the rule's attached Risk Profile config, then look up the app's current attribute values on its Application Information page and compare. Any attribute mismatch is the exonerator; an all-match is the culprit.

---

### zia-08 — CAC tenant restrictions mechanics

*Origin: `references/zia/cloud-app-control.md` § Edge cases*

Zscaler supports distinguishing corporate vs personal instances of the same SaaS app on shared hostnames (e.g., corporate Google Workspace vs personal Gmail both under `*.google.com`). The detection mechanism — header inspection post-decrypt, tenant ID parameter, OAuth audience claim, DNS-based hints — isn't described in the vendored CAC guide.

**Status**: partially resolved (2026-04-23).

**Answer**: Feature is called **Tenant Profiles** (or "tenancy restriction"), configured under Administration > Tenant Profiles and attached to Cloud App Control rules.

From *About Tenant Profiles* (`vendor/zscaler-help/about-tenant-profiles.md`) and *Adding Tenant Profiles* (`vendor/zscaler-help/adding-tenant-profiles.md`):

**Supported cloud applications** — the help article *Adding Tenant Profiles* lists 13, but the SDK's `tenancy_restriction_profile.py:146-149` enumerates **16**. SDK is authoritative; help article is stale.

SDK-authoritative `app_type` enum values:

- `YOUTUBE` (help-listed)
- `GOOGLE` (help-listed as "Google Apps")
- `MSLOGINSERVICES` (help-listed as "Microsoft Login Services")
- `SLACK` (help-listed)
- **`BOX`** — SDK-only
- **`FACEBOOK`** — SDK-only
- `AWS` (help-listed as "Amazon Web Services")
- `DROPBOX` (help-listed)
- `WEBEX_LOGIN_SERVICES` (help-listed)
- **`AMAZON_S3`** — SDK-only
- `ZOHO_LOGIN_SERVICES` (help-listed)
- `GOOGLE_CLOUD_PLATFORM` (help-listed)
- `ZOOM` (help-listed)
- `IBMSMARTCLOUD` (help-listed)
- `GITHUB` (help-listed)
- `CHATGPT_AI` (help-listed as "ChatGPT")

**Key mechanics:**

1. **SSL Inspection is required** for tenant restrictions to function. The Tenant Profile article explicitly instructs adding the relevant login-service app as a criterion in an SSL Inspection rule (e.g., for Office 365 tenant restrictions, include "Microsoft Login Services" in an SSL Inspection rule with higher order than the Office 365 One Click Rule). This confirms the detection model: **post-SSL-decrypt inspection of the login/OAuth flow**, not DNS-based or connection-IP-based.
2. **Identifier types are per-app-specific** (from *Ranges & Limitations — URL Filtering & Cloud App Control*, `ranges-limitations-zia.md`):
   - AWS: account IDs (12 digits)
   - ChatGPT: workspace IDs (up to 64 chars)
   - Dropbox: team IDs
   - GitHub: enterprise slugs
   - Google Apps: domains (e.g., `yourcorp.com`)
   - Google Cloud Platform: organization IDs
   - IBM SmartCloud: account IDs
   - Microsoft Login Services v1: Tenant Directory ID; v2: Tenant Directory ID:Policy ID; plus M365 Tenants or Tenant IDs
   - Slack: Workspace ID (both "Your" and "Allowed" flavors)
   - YouTube: Channel ID and School ID
   - Webex Login Services: Webex tenants
   - Zoho Login Services: Zoho IDs
   - Zoom: policy label
3. **Allow-to-block cascading**: allowing a specific tenant automatically blocks other tenants for most apps (subsequent policies not evaluated). **Exceptions**: YouTube and AWS still evaluate subsequent policies, so an **explicit block rule is required** to block other tenants for those two.
4. **One tenant per SaaS application per organization for some apps** (see Ranges & Limitations for the full per-app matrix — GitHub is 1 profile/rule, Microsoft v1/v2 directory IDs are 1 each, Zoom is 1 policy label; most others support 100–500 identifiers per profile).

**Still open**: the per-app inspection logic at the token level (OAuth audience claim, login-request header, SAML assertion attribute, etc.) isn't enumerated in the articles I captured. "Inspected post-decrypt in the login flow" is the mechanism class — the exact token field per app would be in per-app configuration guides (e.g., *Configuring a Microsoft Login Services Tenant Profile*, etc.) that weren't captured in this sweep. Low priority — the high-level mechanism is enough for skill answers, and per-app detail is operator-facing rather than skill-facing.

---

### zia-09 — CAC app-identity when URL maps to multiple apps

*Origin: `references/zia/cloud-app-control.md` § Mechanics*

Many hostnames serve multiple cloud apps (e.g., `*.google.com` covers Drive, Docs, Gmail, Meet). How CAC picks which app identity a given request maps to — URL path, post-decrypt HTTP headers, user agent, some combination — isn't in the vendored material. Affects any "which CAC category applies to this URL" answer.

**Status**: partially resolved (2026-04-23).

**Answer** (partial): URL-to-app resolution is surfaced through the `/urlLookup` API endpoint and the Admin Console URL Lookup tool. From *Understanding Cloud App Categories* (`vendor/zscaler-help/understanding-cloud-app-categories.md`): "You can look up a cloud application for a URL using the URL Lookup tool or the urlLookup API."

Background from *Configuring URL Categories Using API* p.11:

> Custom URL classification is not returned by this request. Any URLs that are not categorized under a predefined URL category returns a value of MISCELLANEOUS_OR_UNKNOWN.

So `/urlLookup` returns **predefined URL categories** (not Cloud App identity directly). For Cloud App identity specifically, the Admin Console URL Lookup tool provides the cloud app name, but that endpoint isn't documented in the API reference articles we've captured.

**What this means operationally**: to answer "what Cloud App does URL X map to," the most-defensible path is (a) run `/urlLookup` for URL category, (b) cross-reference with the tenant's Cloud App Control supported-apps list (see "Viewing Supported Cloud Applications" — Policies > Access Control > SaaS Application Control > Policies), and (c) use the Admin Console URL Lookup tool for authoritative cloud-app identity.

**Still open**: the internal logic Zscaler uses to resolve a shared-hostname URL to a specific cloud-app identity (e.g., how `*.google.com` splits into Drive vs Docs vs Gmail vs Meet) isn't documented. Presumably post-decrypt URL-path / HTTP-header inspection (given the Tenant Profiles model in `zia-08` works the same way), but not explicitly stated. Lab-testable with a few known URLs and the URL Lookup tool.

---

### zia-10 — CAC default Allow-All vs explicit Allow for cascading

*Origin: `references/zia/cloud-app-control.md` § Worked example Case B*

The CAC Deployment Guide says "The default policy behavior is Allow All." The URL Filtering Policy article separately says URL Filtering evaluates when "a user requests a Cloud App for which you have not configured a Cloud App Control policy rule." Tension: does a CAC terminal Allow-All default count as an "explicit allow" (triggering URL Filtering bypass unless cascading is on) or as "no rule applied" (URL Filtering always evaluates)?

**Status**: resolved (2026-04-23).

**Answer**: "No matching CAC rule" means URL Filtering evaluates — CAC's Allow-All default is *not* an explicit allow. From *Understanding Policy Enforcement*, p.3-4:

> If a user requests a cloud app for which you have not configured a Cloud App Control policy rule (for example, the user requests eBay.com, and you don't have a Cloud App Control rule for eBay.com), the service still evaluates and applies the URL filtering policy.

Case B in `cloud-app-control.md` stands correct as originally written.

---

### zia-11 — Transparent vs explicit forwarding mixed mode

*Origin: `references/zia/ssl-inspection.md` § Mechanics*

Under transparent forwarding, SSL Inspection policies evaluate on both SNI and destination IP; under explicit forwarding, only SNI. Many real deployments mix modes (branch offices via GRE, remote users via Zscaler Client Connector explicit proxy). When a user transitions between these paths within the same session, or when a single tenant has both forwarding types active, are SSL Inspection rules evaluated consistently? Specifically: does a rule like "Do Not Inspect: URL Category = Miscellaneous" produce different results for the same user depending on which path the traffic took?

**Status**: partially resolved (2026-04-23).

**Answer (partial)**: Policy evaluation is **deterministic per traffic path, not per user**. A connection is evaluated based on the forwarding method it used — that much is already captured in `zia-13`. The Leading Practices Guide treats this as a design point to plan around, not a hidden gotcha:

From *ZIA SSL Inspection Leading Practices Guide* (`vendor/zscaler-help/ZIA_SSL_Inspection_Leading_Practices_Guide.txt`) p.14:

> You can only use user attributes if the traffic forwarded to Zscaler is from the Zscaler Client Connector (preferred) or if you enable Enforce Surrogate IP and properly work for traffic flowing through GRE or IPSec tunnels to Zscaler. Without Zscaler Client Connector or Surrogate IP, the service cannot identify the user (before inspection) to properly apply user-based policies and determine if inspection is desired. Device Groups (OS Type). You can only identify device groups if the traffic is forwarded to Zscaler via the Zscaler Client Connector.

The recommended pattern (pp.28–30) is to encode path-awareness in rules via **Device Group** (`Client Connector` / `No Client Connector`) or **Location Group** criteria rather than relying on implicit consistency. The worked example on p.29 includes:

> Rule 1: Inspect if Cloud App is OneDrive or SharePoint, Device Group is Android, iOS, Windows, or macOS, and the Location is HQ.
> ...
> Rule 4: Exempt if Device Group is No Client Connector for Location HQ.

A single TCP connection is bound to one forwarding path, so "mid-session transitions" don't exist at the evaluation layer. Successive connections by the same user over different paths will evaluate against the same rule set but can produce different matches — which is the recommended way to encode "inspect on-CC devices, exempt everything else."

**Still open** (low priority): whether a tenant whose rules don't use Device Group or Location Group criteria can suffer **silent per-session drift** when a category-based Do-Not-Inspect rule hits the SNI+IP (transparent) vs SNI-only (explicit) evaluation asymmetry. The canonical example is "Do Not Inspect: URL Category = Miscellaneous": under transparent forwarding this can over-exempt via IP-category matching (most public IPs default to Miscellaneous); under explicit forwarding it affects only actual unknown SNIs. See `references/zia/ssl-inspection.md § Transparent vs explicit traffic forwarding — what the SSL rule matches on` for the established mechanics. Whether this is observable as a "same-user-different-session" artifact is still a lab/operator question.

---

### zia-12 — SSL bypass interaction with URL filtering default rule

*Origin: `references/zia/ssl-inspection.md` § Open questions*

When an SSL rule fires with "Do Not Inspect + Evaluate Other Policies" and traffic proceeds to URL filtering, if no explicit URL filtering rule matches, does the URL filtering default terminal rule still fire? The docs describe the two-variant behavior (Evaluate vs Bypass) but don't explicitly say whether the implicit URL-filtering default counts as "a rule" for the Evaluate path. This matters for tenants relying on a default-Block URL filtering stance to catch anything that slipped past explicit rules on non-inspected traffic.

**Resolves with**: lab test. **Status**: open. **Low priority** — most deployments use default-Allow URL filtering, making this a corner case.

---

### zia-14 — Leading-period wildcard at exactly 5 subdomain levels

*Origin: `references/zia/wildcard-semantics.md` § Worked example*

The *URL Format Guidelines* article says the leading-period wildcard applies "up to 5 subdomain levels deep." Whether a request at exactly 5 subdomain levels (e.g., `serv3.serv2.serv1.atlanta.safemarch.com`, which the article explicitly lists as matching `.safemarch.com`) is inclusive of level 5 or whether 5 is the exclusive cap isn't explicitly stated. The example uses 4 subdomain labels (`serv3.serv2.serv1.atlanta.safemarch.com` is 4 extra segments before `safemarch.com`).

**Resolves with**: lab test. **Status**: open. **Low priority** — 5-level-deep subdomain patterns are uncommon in practice.

---

### zia-15 — Console accepts asterisk despite docs marking it invalid

*Origin: `references/zia/wildcard-semantics.md` § Asterisk is not a valid wildcard character*

The *URL Format Guidelines* article states unambiguously that `*.safemarch.com` and `*safemarch.com` are "not permitted". Operator report (2026-04-23) contradicts this: the ZIA admin console does accept `*` in URL entries at save time without rejecting the input. What's ambiguous:

- Whether the console silently rewrites the entry to the leading-period form under the hood.
- Whether it stores the asterisk literally and treats it as a no-op character (so `*.example.com` matches nothing, or only `example.com` if the `*` and `.` are stripped).
- Whether it's accepted at save time but then fails a downstream validation before becoming effective.
- Whether the docs are stale and asterisk wildcards actually function the way operators intuitively expect.

**Why it matters**: a tenant that has `*.example.com` entries in custom URL categories today may think they're wildcarding subdomains when in fact nothing is being matched. A snapshot-driven lookup that trusts the docs will give a confidently wrong answer.

**Resolves with**: lab test (enter `*.example.com`, re-read via API, observe what's stored; then test matching against `example.com` and `www.example.com`) OR support ticket. **Status**: open.

---

### zia-13 — Explicit pipeline-order sourcing

*Origin: `references/zia/ssl-inspection.md` § Mechanics*

Our three drafts asserted the pipeline is SSL Inspection → URL Filtering → Cloud App Control. No single vendored source stated the full ordering explicitly.

**Status**: resolved (2026-04-23).

**Answer** (from *Understanding Policy Enforcement*, `vendor/zscaler-help/Understanding_Policy_Enforcement.txt`, pp.1–13; canonical URL https://help.zscaler.com/zia/about-policy-enforcement):

The actual flow is more nuanced than the simpler SSL→URL→CAC framing:

1. **Firewall module always evaluates first.** For outbound web traffic, firewall policy runs before the web module sees the transaction. Example from the doc: firewall allows Box.net + web module blocks Box.net → traffic is blocked. Firewall "allow" does not supersede web block; both must pass.
2. **Web module evaluation depends on traffic type and SSL state.** For HTTPS traffic there are **two passes**:
   - **CONNECT/SNI pass** (domain-only): URL Filtering + Cloud App Control + Advanced Threat Protection (known malicious URLs) + Bandwidth Control evaluate using only the destination domain. In explicit-proxy mode, this happens on the CONNECT request; in transparent mode, on the SNI.
   - **SSL Inspection policy decision**: evaluate whether to decrypt.
   - **Full-URL pass** (only if decrypted): the complete policy pipeline runs on the decrypted URL and body — see the 10-step GET order on p.3–5 of the Policy Enforcement doc (Custom Malicious URLs → Cloud App Control → URL Filtering → Security Exceptions → Browser Control → Country Blocking → IPS → Suspicious Content → P2P → Bandwidth).
3. **Per-method policy order differs.** HTTP POST adds Malware Protection, File Type Control, and DLP steps. HTTP GET/POST Response adds Sandbox, Malware, File Type Control, AI/ML Content Categorization.

This means URL Filtering and CAC effectively evaluate **twice** on inspected HTTPS traffic — once domain-only, once full-URL. The drafts' simpler "before/after" framing was roughly right but missed the two-pass nuance. Corrected in `ssl-inspection.md` Mechanics section.

---

### log-01 — NSS feed format versions

*Origin: `references/zia/logs/web-log-schema.md`, `firewall-log-schema.md`, `dns-log-schema.md`*

Zscaler publishes NSS output in multiple formats. Whether field presence and naming differ between them was unclear.

**Status**: partially resolved (2026-04-23).

**Answer**: From *General Guidelines for NSS Feeds and Feed Formats* (`vendor/zscaler-help/General_Guidelines_for_NSS_Feeds_and_Feed_Formats.txt`) pp.1–4:

- Field names are the same across output types — the guidelines confirm a unified format-specifier system (`%s{}`, `%d{}`, `%x{}`) used across all output formats.
- The article lists **ten NSS feed types** (Web, Firewall, DNS, Tunnel, SaaS Security, SaaS Security Activity, Admin Audit, Endpoint DLP, Email DLP, Sandbox Verdict) but we've only vendored three of those field CSVs (Web, Firewall, DNS).
- Recommended ≤50 fields per feed due to syslog message size. If more, verify SIEM can ingest.
- Hex encoding: URL characters ≤ `0x20` or ≥ `0x7F` are encoded as `%HH`. Example: `\n` → `%0A`, space → `%20`.
- Cloud NSS + JSON output: use hex-encoded field variants (e.g., `%s{elogin}` instead of `%s{login}`) and set Feed Escape Character to `,\"` to avoid JSON parsing issues in the SIEM.
- Duplicate Logs setting: buffer replay window before detected-disconnect timestamp, configurable up to 60 minutes.

**Still open**: the article doesn't enumerate which fields differ between CSV/JSON/TSV output templates when the same field name is emitted in each. For our vendored CSVs, we've assumed field presence is identical across output formats — that's consistent with the Guidelines article but not literally stated. Low-priority open question.

---

### log-02 — Cloud NSS vs legacy NSS divergence

*Origin: `references/zia/logs/web-log-schema.md`*

Zscaler Cloud NSS (hosted) and legacy NSS (on-prem appliance) differ in field availability and timestamp behavior. Whether our SPL patterns need to branch on which one produced a record is unknown.

**Status**: partially resolved (2026-04-23).

**Answer**: Both variants source from the **same Nanolog storage**, which significantly reduces the risk of field-presence divergence. From *Understanding Nanolog Streaming Service (NSS)* (`vendor/zscaler-help/understanding-nanolog-streaming-service.md`):

- **VM-based NSS**: "The Nanolog then streams copies of the logs to each NSS in a highly compressed format... When an NSS receives the logs from the Nanolog, it decompresses and detokenizes them, applies the configured filters to exclude unwanted logs, converts the filtered logs to the configured output format so that they can be consumed and parsed by your SIEM, and then streams the logs to your SIEM over a raw TCP connection."
- **Cloud NSS**: HTTPS API feed push model. "You can create one Cloud NSS feed per ZIA log type per Cloud NSS instance. When configuring a Cloud NSS feed, you can customize the feed format; Zscaler recommends using JSON."

Since both decompress/detokenize the same Nanolog records, **field content is equivalent**. What differs is:

- **Transport**: raw TCP (VM) vs HTTPS POST batches (Cloud).
- **Feed-count limits**: up to 16 feeds per NSS server (Web & Firewall capped at 8 each) for VM; **one feed per ZIA log type per Cloud NSS instance** for Cloud.
- **Format recommendation**: customizable on both, but Zscaler recommends **JSON** for Cloud NSS; VM deployments commonly use the VM's configurable flat format.
- **Reliability model**: VM buffers logs in memory for resiliency + one-hour recovery from Nanolog; Cloud uses separate one-hour Nanolog replay capability.

**Implication for SPL patterns**: branching on *field presence* is unlikely needed (same Nanolog source). Branching by **format** (JSON-native vs custom-delimited TCP) is the realistic split — e.g., `spath` vs `rex` extraction upstream. A field-by-field diff test on a live tenant is the definitive way to confirm.

**Still open (minor)**: whether the format-conversion step on the VM side ever omits a field that appears in Cloud NSS's JSON output. Ordinary operator testing closes this.

---

### log-03 — Timestamp timezone handling

*Origin: `references/zia/logs/web-log-schema.md`*

`%s{tz}` is documented as the NSS feed's configured timezone, but the behavior when a tenant has multiple NSS feeds with different TZs, or when Cloud NSS aggregates from multiple regions, isn't stated.

**Resolves with**: lab test OR zscaler doc not yet read. **Status**: open. **Low priority** — most SPL patterns use `_time` which Splunk normalizes to UTC regardless.

---

### zpa-01 — Multi-segment match representation in LSS

*Origin: `references/zpa/logs/access-log-schema.md`*

When a ZPA client resolves to multiple application segments in sequence (e.g., failover, or a sequence of probes), how is that represented in LSS output? One record per segment, a single record with multiple segment IDs, or something else?

**Resolves with**: operator experience OR lab test. **Status**: open — 2026-04-28.

**Doc sweep 2026-04-23** (partial): Confirmed schema shape from *Understanding User Activity Log Fields* (`vendor/zscaler-help/Understanding_User_Activity_Log_Fields.txt`). Key observations:

- Fields like `Application`, `AppGroup`, `Policy`, `Server`, `ServerIP`, `ServerPort`, and timestamps are **singular per record** — no array-valued segment list. This makes "single record with multiple segment IDs" structurally unlikely.
- The example record in the doc's preamble shows `ConnectionID` as a **comma-concatenated pair** (e.g., `SqyZIMkg0JTj7EABsvwA,Q+EjXGdrvbF2lPiBbedm`) where the first part matches `SessionID` exactly. This hints that `ConnectionID` may encode `<SessionID>,<attempt-or-subconnection>` when a TLS session spans multiple ZPA connections — but the field description just says "The application connection ID" without elaboration.
- `SessionID` is documented as "The TLS session ID." So: multiple `ConnectionID` values under the same `SessionID` is plausibly how sequential connection attempts within a session are tied together.

**Doc sweep 2026-04-28**: Reviewed *Understanding User Status Log Fields* PDF, *Understanding the Log Stream Content Format* PDF, and `about-log-streaming-service.md`. None contain an explicit statement about record granularity for multi-segment failover sequences. Available vendored material is exhausted on this question.

**Most-defensible inference** (not yet confirmed by an unambiguous doc statement): multi-segment failover/probe sequences generate **one LSS record per segment attempt**, with records tied together by shared `SessionID` and distinguished by distinct `ConnectionID` suffixes. Correlation via `SessionID` would then group a multi-segment sequence back into a logical session. Requires operator confirmation on a real tenant.

---

### zpa-02 — ZPA "more granular" definition

*Origin: `references/zpa/app-segments.md` § Specificity-wins rule*

*Configuring Defined Application Segments* p.10 says Zscaler Client Connector "attempts to match traffic to the more granular application segment" when two segments cover the same destination. How "more granular" is computed wasn't stated.

**Status**: resolved (2026-04-23).

**Answer**: From *Understanding Application Access* (`vendor/zscaler-help/Understanding_Application_Access.txt`) p.1 and *Using Application Segment Multimatch* (`vendor/zscaler-help/Using_Application_Segment_Multimatch.txt`) p.9: "more granular" means **most-specific FQDN wins** among overlapping segments. The Multimatch article's Example 1 (p.9) shows the specificity stack explicitly: `server1.db.hr.company.com` > `*.db.hr.company.com` > `*.hr.company.com` > `*.company.com` > `*.com`. IP-subnet equivalent (p.10): `/32` host > `/24` subnet. Note the specificity comparison is strictly on the **domain/address** dimension; port-range narrowness does not enter the "granularity" judgment.

---

### zpa-03 — Multimatch mixed-style evaluation

*Origin: `references/zpa/app-segments.md` § Multimatch*

If two overlapping segments set different Multimatch styles on the same domain-set (one INCLUSIVE, one EXCLUSIVE), what happens?

**Status**: resolved (2026-04-23).

**Answer**: From *Using Application Segment Multimatch* (`vendor/zscaler-help/Using_Application_Segment_Multimatch.txt`) p.1:

> Private Access (ZPA) evaluates Multimatch across all application segments that include the same applications. When an administrator enables or disables Multimatch for an application segment, Private Access checks all other application segments that contains any overlapping domains to determine whether the change is allowed. If a domain is found in multiple application segments with different Multimatch settings, there is a conflict and the application segment cannot be updated.

So the config is **rejected at update time**; you cannot get into a mixed-style state. Mixed styles are validated at modification time, not silently reconciled at traffic time.

---

### zpa-04 — Same-FQDN same-Bypass tie-break

*Origin: `references/zpa/app-segments.md` § Bypass precedence*

*Configuring Defined Application Segments* p.12 states that if the same FQDN is in multiple segments and one has `Bypass = Always`, that segment wins. But: if *two* segments both have `Bypass = Always` for the same FQDN, or both have `Bypass = On Corporate Network`, which one is selected? Presumably the most-granular-wins rule resumes, but not stated explicitly.

**Resolves with**: lab test. **Status**: open. **Low priority** — uncommon configuration.

---

### zpa-05 — "No match in segment" criteria

*Origin: `references/zpa/app-segments.md` § Specificity-wins rule*

What does "no match in this application segment" mean precisely — port mismatch, protocol mismatch, segment disabled, server group unavailable, or App Connector health failure?

**Status**: resolved (2026-04-23).

**Answer**: From *Understanding Application Access* (`vendor/zscaler-help/Understanding_Application_Access.txt`) p.1, the "no match" case is specifically the **destination port** not being configured in the selected (most-granular) segment:

> If two or more application segments cover the same destination address, Zscaler Client Connector attempts to match traffic to the more granular application segment. If there is no match in this application segment for the destination port, Zscaler Client Connector bypasses ZPA and sends traffic directly.

Worked example from that same page: Segment 1 = `*.example.com` TCP 1-65535; Segment 2 = `www.example.com` TCP 8843. User requests `www.example.com:80` → matches Segment 2 (more specific FQDN), but port 80 is not in Segment 2's port list → traffic is dropped. *Not* fallback to Segment 1.

Additionally, *Using Application Segment Multimatch* (p.7, p.13) confirms: "Traffic that is dropped at the client level means that traffic matches the hostname, but it does not match the protocol and port. In this condition, traffic is not sent to the cloud for further processing. This means that policy evaluation does not occur, and the user is not able to access the application segment. In this case, traffic is not visible in the Private Access diagnostics."

Note: other failure modes (segment disabled, server group unavailable, connector health failure) are **not** the "no match" case — they would fail downstream of segment selection. The "no match → direct bypass" behavior is specifically port-mismatch.

---

### zpa-06 — Require Approval action semantics

*Origin: `references/zpa/policy-precedence.md` § Rule actions*

*About Access Policy* p.6 lists "Require Approval" as one of three rule actions (Allow Access, Block Access, Require Approval). What does it do?

**Status**: resolved (2026-04-23).

**Answer**: From *Configuring Access Policies* (`vendor/zscaler-help/Configuring_Access_Policies.txt`) p.3 and *Understanding Step-Up Authentication* (`vendor/zscaler-help/understanding-step-up-authentication.md`):

The rule action is actually called **Conditional Access** in the Configuring Access Policies doc. "Require Approval" in About Access Policy is informal terminology for the same thing. Mechanics:

- **Conditional Access** rule action invokes step-up authentication via **ZIdentity**. Requires a ZIdentity subscription.
- Step-up authentication uses **Authentication Levels (AL1 to AL4)**, hierarchical where higher = stronger assurance.
- Flow: user logs in at standard level → attempts access to a Conditional-Access-gated application → ZIdentity checks required level → if insufficient, prompts for reauthentication (typically MFA via Zscaler Client Connector) → on success, access granted.
- **Supported only with OIDC-based external IdP integrations.**
- End-user UX: per *Verifying Access to Applications* (`vendor/zscaler-help/verifying-access-to-applications.md`), user sees a "pending verification" status in Zscaler Client Connector and clicks "Verify Now" to complete the step-up. Requires Client Connector v4.6+ (Windows, ZPA only), v4.7+ (Windows ZIA / macOS both).
- Separate **"Allow with Privileged Approval"** checkbox exists on Allow-action rules for Privileged Remote Access-enabled application segments — different feature, distinct from Conditional Access step-up.

So: "Require Approval" = "Conditional Access" = ZIdentity step-up authentication. Three names for the same behavior. "Allow with Privileged Approval" is a separate PRA-specific capability.

---

### zpa-07 — Deception policy order interaction

*Origin: `references/zpa/policy-precedence.md` § Order and editing constraints*

*About Access Policy* p.6 states: regular access policies must have rule order greater than Deception-configured policies; Deception-configured rules cannot be copied/edited/deleted normally. The doc doesn't explain *what* a Deception access policy is, how it evaluates, or what threat model it addresses.

**Status**: resolved (2026-04-24).

**Answer**: Captured three Zscaler Deception help articles (`vendor/zscaler-help/what-is-zscaler-deception.md`, `about-deception-strategy.md`, `about-zpa-app-connectors-deception.md`).

**What Deception is** — a separate Zscaler product for active-defense threat detection. It deploys realistic **decoys** (fake IT assets — servers, apps, Active Directory objects, endpoints, cloud resources) across the environment. Because no legitimate business traffic should ever touch a decoy, any interaction with one is a high-confidence signal of an ongoing breach. Designed to catch threats that bypass traditional defenses — APTs, ransomware, lateral movement, reconnaissance, supply-chain attacks, SCADA/ICS attacks.

**What a Deception access policy is** — when a tenant integrates Deception with ZPA to deploy **Zero Trust Network (ZTN) decoys**, Deception creates access-policy rules inside ZPA that route attacker traffic to the decoy infrastructure via ZPA App Connectors (hosted by Zscaler, managed from the Deception Admin Portal). These rules are the mechanism Deception uses to intercept attacker traffic without requiring changes to network topology.

**Why they must evaluate first** — ZPA is first-match-wins. If a regular access rule matched attacker traffic first (granting or denying access to a real resource), the decoy would never get the connection, defeating the detection. Ordering Deception rules ahead ensures decoy traffic is captured before normal rules fire.

**Why they can't be copied/edited/deleted normally** — the rules are managed by the Deception Admin Portal as a separate product surface, not by ZPA admins. Editing them from the ZPA console would desynchronize Deception's view of what decoys exist, break the coordinated alert-and-orchestration flow, and let an attacker see changes in the real ZPA admin audit log rather than trigger a silent Deception alert.

**Threat model** — advanced threats that bypass perimeter defenses and reach lateral-movement / discovery phases. Deception provides high-fidelity detection specifically for the inside-the-network phase where traditional policy enforcement has already failed. The ordering constraint exists to preserve detection integrity; it is not a general policy-evaluation feature.

**Operational implication for ZPA admins** — don't try to manage Deception rules via the ZPA policy API or Terraform. Treat them as read-only markers showing "something is running in front of my policy chain." If the Deception product is not licensed, these rules don't exist. See `references/zpa/policy-precedence.md § Order and editing constraints` for the cross-link.

---

### zpa-08 — "When both FQDNs are equal" interpretation

*Origin: `references/zpa/policy-precedence.md` § Specificity-vs-top-down quirk*

*Access Policy Deployment and Operations Guide* pp.2–3 states: "When both FQDNs are equal, ZPA performs a top-down ranking approach. So, if rule 1 is `*.specific.web.com` and rule 2 is `specific.web.com`, then rule 1 would apply, because it's processed first."

**Status**: clarified by *About Policies* / Policy Evaluation Order section (2026-04-23), though the Deployment Guide's example remains oddly phrased.

**Answer**: *About Policies* (`vendor/zscaler-help/About_Policies.txt`) p.2 is the authoritative statement. The "Policy Evaluation Order" section:

> Private Access evaluates policy rules using the most specific application segment and a top-down, first-match principle. For example, when a user requests a specific application, Private Access starts evaluating all of your configured policies, starting with the first rule in a set of policy rules. As soon as it finds a policy that matches the criteria that was specified in a rule, it enforces that policy rule and disregards all other rules that follow, including any potentially conflicting rules.

The "Conflicting Access Policy Rules" examples (pp.3–6) confirm: **when rules overlap (either by broad segment match or by group membership), the first rule in order that matches the user's criteria fires — other rules are never evaluated.** This is the same first-match model as ZIA URL filtering.

Reading back into the Deployment Guide's oddly-worded example: the most defensible interpretation is that "when both FQDNs are equal" informally means "when both rules' criteria would match the same request" — i.e., when specificity doesn't uniquely disambiguate, rule order decides. The doc's example is imprecise language for a correct concept.

**Still open (minor)**: whether `*.specific.web.com` can match the bare `specific.web.com` as a wildcard edge-case. Lab test if it matters for a specific tenant.

There is no standalone "Policy Evaluation Order" article — the content lives as a section within *About Policies*.

---

### shared-06 — ZPA disabled-rule semantics

*Origin: `references/shared/policy-evaluation.md` § Shared patterns*

ZIA explicitly documents that a disabled URL filtering rule retains its order position and is simply skipped during evaluation (*Configuring the URL Filtering Policy* p.3). No equivalent statement is made in the vendored ZPA access-policy material. Whether a disabled ZPA rule behaves the same (skip-in-place) or differently (removed from the evaluation list entirely) is not stated.

**Resolves with**: lab test OR zscaler doc not yet read (likely "Configuring Access Policies"). **Status**: open. **Low priority** — behavior is almost certainly parity with ZIA.

---

### shared-01 — SPL index naming portability

*Origin: `references/shared/splunk-queries.md`*

Our SPL patterns parameterize on `$INDEX_ZIA_WEB` / `$INDEX_ZPA` etc. Where those values come from in practice — env var, config file, pulled from snapshot metadata — is undecided. Affects how we make SPL patterns tenant-portable when index naming varies between customers.

**Status**: resolved (2026-04-24).

**Answer**: **Environment variables**, same mechanism as `ZSCALER_*` credentials (see `shared-04`). The operator sets `SPLUNK_INDEX_ZIA_WEB`, `SPLUNK_INDEX_ZIA_FW`, `SPLUNK_INDEX_ZIA_DNS`, `SPLUNK_INDEX_ZPA` (and any others their SIEM uses) in the shell or via a secrets manager; `scripts/splunk-query.sh` substitutes these into pattern templates at run time.

Rationale:

- **Consistency with credential pattern** — operators already have a shell context populated with `ZSCALER_*` vars; SIEM index names fit the same mental model.
- **No config-file convention invented** — avoids a new `.spl-config.toml`-style file that would sit awkwardly next to the env-var-driven SDK scripts.
- **Snapshot metadata is the wrong source** — snapshot captures Zscaler config, not SIEM config. Splunk index naming is external to Zscaler and can't be inferred from tenant dumps.
- **Defaults in `splunk-queries.md`** — the reference doc shows patterns using the `zscaler_*` naming that is conventional out of the box from Zscaler's Splunk-TA; operators with non-default naming override per-pattern via env var.

Threaded into `scripts/splunk-query.sh` header (documents the 4 env vars) and `references/shared/splunk-queries.md` (§ "Tenant-portable index naming" callout).

---

### shared-02 — Log-query latency budget

*Origin: `references/shared/log-correlation.md`*

We've said logs are a "validation layer" but haven't set an SLO: at what point does a log query get too slow to be worth waiting for (vs. replying "config says X, can validate on request")? Affects when the skill auto-queries vs. defers.

**Status**: resolved (2026-04-24).

**Answer**: **The skill does not auto-query logs.** All log-validation is an explicit operator action, surfaced as a ready-to-run SPL snippet the user can paste. The skill's default loop is:

1. Answer the question from `references/` + `_data/snapshot/` (config-derived reasoning).
2. Note where logs would validate or contradict the config-level answer, and emit the SPL query that would do so.
3. Only if the user explicitly asks ("run it", "what do the logs show?") does a script invocation happen — and even then it's the operator running `scripts/splunk-query.sh`, not the skill auto-executing.

Rationale:

- **Skills are document-only** — `SKILL.md` plus `references/` plus snapshot-JSON read. Script execution is an operator/agent-harness concern, not the skill's.
- **Log-query latency varies wildly** — from seconds (recent narrow-window Splunk search on a hot index) to minutes (broad time range, cold storage). Setting a universal SLO pins the wrong constraint.
- **Config-first answers degrade gracefully** — config reasoning is deterministic and fast; log-validation is the "verify" step, and operators can decide whether they want it based on the question's stakes.
- **Pre-emptive log queries waste tenant query budget** — Splunk license / query quota is finite. The skill should never spend those cycles uninvited.

Affects: `scripts/splunk-query.sh` is run-on-request by the operator; the skill's job is to produce the right SPL, not to run it. Threaded into `references/shared/log-correlation.md` § "When the skill recommends a log query vs answers from config".

---

### shared-03 — Script language choice for tenant-data tooling

*Origin: earlier scaffold discussion (refresh / lookup / splunk tooling)*

Real implementations of the refresh / lookup / splunk-query scripts would need auth, pagination, retry. Bash + curl vs Python + SDK was undecided during scaffolding.

**Status**: resolved (2026-04-23).

**Answer**: Python via `uv run --script` shebang, using the vendored `zscaler-sdk-python`. Implemented:

- A URL-lookup helper mirrored the `investigate-url` workflow from `vendor/zscaler-mcp-server/commands/investigate-url.md`.
- A snapshot-refresh helper dumped ZIA + ZPA config under `_data/snapshot/<cloud>/<product>/`. (Both SDK helpers were later removed; tenant reads now go through the read-only zscalerctl CLI.)
- `scripts/splunk-query.sh` — kept as bash stub (Splunk SDK is Python but the Splunk path is not the critical one and the bash stub matches the legacy pattern).

---

### shared-04 — Snapshot auth pattern

*Origin: snapshot-tooling header comments*

Where credentials come from when running the refresh scripts — env vars, `.env` file, `op read` (1Password CLI), cloud secrets manager — is undecided. Shapes `.gitignore`, script structure, and onboarding docs.

**Status**: resolved (2026-04-24).

**Answer**: **Environment variables**, read directly by the SDK's default constructor. The fork-admin onboarding walkthrough in `README.md § 4. Set up ZIA + ZPA credentials` is the canonical path: `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` (or `ZSCALER_PRIVATE_KEY` for JWT), `ZSCALER_VANITY_DOMAIN`, optional `ZSCALER_CLOUD`. Legacy tenants use `ZSCALER_USE_LEGACY=true` plus product-specific vars documented in `vendor/zscaler-sdk-python/README.md § Legacy API Framework`.

Rationale for env vars over alternatives:

- **No `.env` file** committed — the skill is designed for private forks, and the repo's `.gitignore` doesn't model a `.env` convention. Operators who prefer `.env` can layer one via `direnv`, `dotenv`, or a shell-rc source — none of the scripts block this.
- **No bundled secrets-manager integration** — 1Password (`op read "op://..."`), Vault, AWS Secrets Manager, etc. are fine upstream of the shell. The scripts only consume env vars; how those get populated is the operator's choice. Example pattern for a fork: `eval "$(op read 'op://private/zscaler/.envrc')"` upstream of whatever populates the snapshot.
- **Env vars are what the SDK already expects** — the `zscaler-sdk-python` OneAPI path reads these by default. Forcing a custom config layer would duplicate SDK conventions.

Affects: `.gitignore` correctly excludes `_data/snapshot/`, `_data/schemas/`, and local-scratch paths but not `.env` (no `.env` is ever created by the skill). Script headers document the 4 required env vars in block comments. No onboarding-doc change needed beyond what's already in README step 4.

---

### shared-05 — Snapshot format

*Origin: scaffold discussion; `references/zia/api.md`*

Raw JSON dumps from the API are cheap to produce and `jq`-friendly but noisy for model consumption. Paraphrased-to-markdown is model-friendly but goes stale and adds a transformation step. Decide before the first real refresh script ships.

**Status**: resolved (2026-04-24).

**Answer**: **Raw JSON** — one file per resource under `_data/snapshot/<cloud>/<product>/<resource>.json`, plus a per-cloud `_manifest.json` capturing timestamp + per-resource counts. Wire format (camelCase for ZIA, mixed for ZPA) is preserved as-is; no paraphrasing pass.

Rationale:

- **Faithfulness over friendliness.** Paraphrased markdown risks going stale against API changes or drifting from the SDK's model. Raw JSON is source-of-truth; any transformation is downstream.
- **`jq`-first access.** Skill answers that need tenant data read JSON directly (`jq '.[] | select(.name == "X")' _data/snapshot/<cloud>/zia/url-categories.json`) or via small Python helpers in the scripts. Claude handles JSON well enough that noisy fields aren't a blocker.
- **Model consumption concerns are real but bounded.** Consumers should be selective — extract only the fields relevant to the question rather than passing the full JSON blob to the model. Reasoning docs under `references/` carry the narrative; snapshot answers "what does this tenant actually have configured" in raw form.
- **Deferred `snapshot-schema.md` docs** are the answer to "noisy for model consumption" — once the first fork-admin run produces real output, write camelCase-key tables and jq cheatsheets per-product (tracked in PLAN.md § 4).

A paraphrased-markdown post-processing step remains an option for the future if a fork team wants it, but no current skill answer requires one.

---

### log-04 — MP/ATP blocked-policy-type log field

*Origin: `references/zia/malware-and-atp.md` § Console-only diagnosis workflow*

Malware Protection and Advanced Threat Protection blocks have no public API surface. Diagnosis relies on Web Insights log fields indicating which policy module fired.

**Status**: partially resolved (2026-04-24).

**Answer (partial)**: `references/zia/logs/web-log-schema.md` (derived from Zscaler's NSS web-log CSV reference) documents the Block-only field set:

- **`%s{ruletype}`** — the field name on the wire. Insights column name: `Blocked Policy Type`. Example values from the schema: `File Type Control`, `Data Loss Prevention`, `Sandbox`. The MP/ATP values follow the same pattern — expected strings `Malware Protection` and `Advanced Threat Protection` respectively (not yet confirmed by a live tenant export but matches the pattern).
- **`%s{rulelabel}`** — Block-only rule name (e.g. `URL_Filtering_1`).
- **`%s{reason}`** — carries extended detail. Example values: `Virus/Spyware/Malware Blocked`, `This page is unsafe (high PageRisk index)`, `Not allowed to browse this category`. Likely the MP/ATP sub-category discriminator (Ransomware, Phishing, Botnet, etc.). Not in the Insights CSV column list but present in the NSS output.

**Key property**: `ruletype` and `rulelabel` are **Block-only**. An Allow rule firing produces no value for these fields. Operators filtering logs for "which policy blocked this" should filter on `ruletype` non-null.

**Still open**: the full enum of `ruletype` values (the examples above are illustrative, not exhaustive) and the full enum of `reason` sub-categories. A first fork-admin tenant export with at least one MP and one ATP block confirms the complete list.

---

### log-05 — `action` enum completeness and multi-subsystem precedence

*Origin: `references/zia/logs/web-log-schema.md` § What the spec underspecifies*

The NSS web-log CSV (`vendor/zscaler-help/nss-web-logs.csv`) lists `%s{action}` example values as `Allowed, Blocked` — but real tenant logs commonly contain values like `Cautioned`, `Allowed (Cached)`, `Blocked (Inline)`, etc. The CSV doesn't:

1. Enumerate the full set of possible `action` values.
2. State which subsystem (URL Filter, ATP, DLP, Sandbox, File Type Control, Cloud App Control, Bandwidth Control) populates the field when multiple subsystems weigh in on the same transaction.
3. Specify whether the value reflects the *first* block (early-stop / first-fired) or the *final* outcome after all subsystems evaluated.

This is high-leverage because operators (and agents) will pattern-match `action == "Blocked"` for security analytics; if some block conditions surface as `Cautioned` or as a different value, dashboards undercount.

**Resolves with**: tenant-export sample of ~1k records spanning a deliberately-triggered mix of URL/DLP/ATP/Sandbox blocks, plus vendor confirmation of the precedence rule. **Status**: open — 2026-05-06.

---

### log-06 — `reason` field structure (enum vs templated text)

*Origin: `references/zia/logs/web-log-schema.md` § What the spec underspecifies*

The CSV describes `%s{reason}` as "The action taken and the policy applied, if the transaction was blocked," with examples like `Virus/Spyware/Malware Blocked`, `Not allowed to browse this category`, `This page is unsafe (high PageRisk index)`. These examples are sentence-shaped, not enum-shaped. The CSV does not state:

1. Whether `reason` is a stable enum (finite, versioned set of strings) or a templated string assembled per-incident.
2. Whether the wording is consistent across cloud generations (zscaler.net vs zscalerten vs zscaler.gov) and across SKUs.
3. Whether localization / regional language affects the value.

Operators frequently regex-match `reason` for SIEM enrichment and alert routing — fragile if the strings are templated rather than enumerated.

**Resolves with**: cross-tenant sample comparing `reason` values for the same trigger across two tenants on different cloud generations + a vendor statement on stability. **Status**: open — 2026-05-06.

---

### log-07 — `urlcat` / `urlsupercat` / `urlclass` relationship and multi-category URLs

*Origin: `references/zia/logs/web-log-schema.md` § What the spec underspecifies*

The NSS web-log CSV documents three URL category fields with overlapping examples:

- `%s{urlclass}` — examples: `Bandwidth Loss`, `General Surfing`, `Privacy Risk`
- `%s{urlsupercat}` — examples: `Entertainment/Recreation`, `Travel`, `Security`
- `%s{urlcat}` — examples: `Entertainment`, `Adult Themes`, `Games`, `Spyware Callback`

The CSV doesn't define:

1. The hierarchy — is `urlcat` always a member of `urlsupercat`, or are they orthogonal axes? Does `urlclass` aggregate at a still-higher level (a risk-bucketing roll-up across many supercats)?
2. Multi-category URL behavior — for a URL that matches multiple categories (e.g., a news site with embedded ads → News + Advertisement), do the fields show one (which?), the primary, or all matched as a delimited list?
3. Whether Advanced Threat categories appear in `urlcat`, `urlsupercat`, both, or a different field.

Cross-link: the `categories` skill content under `references/zia/url-filtering.md` covers the configuration side but doesn't translate to log-field semantics.

**Resolves with**: tenant export with 50+ varied URLs spanning known multi-category sites, plus vendor doc on the hierarchy. **Status**: open — 2026-05-06.

---

### log-08 — `riskscore` source and combined-subsystem behavior

*Origin: `references/zia/logs/web-log-schema.md` § What the spec underspecifies*

The CSV defines `%d{riskscore}` as "Page Risk Index score of the destination URL. Range 0–100." `%s{threatseverity}` is deterministically derived from `riskscore` (Critical 90–100, High 75–89, Medium 46–74, Low 1–45, None 0). The CSV doesn't state:

1. Which subsystem produces the score — URL Filter's static reputation only? Or does ATP / Sandbox / behavioral engines contribute (and if so, how is the combined score computed)?
2. Whether the score reflects the URL's reputation alone (URL→score) or the full transaction context (URL + payload + sandbox verdict).
3. How `riskscore` relates to `app_risk_score` (cloud app Risk Index, 1–5 scale, separately documented).

This matters because agents and operators may infer "score 75 → ATP/sandbox detected something" when in fact `riskscore` may be URL-Filter-only and the ATP/Sandbox findings live in `threatname` / `malwarecat` / `malwareclass` instead.

**Resolves with**: deliberate-trigger tenant test (e.g., access a known clean-but-newly-registered domain, then a known-malware URL, then a Sandbox-quarantined file) and observe `riskscore` values vs simultaneous `threatname` / `malwarecat` populations. **Status**: open — 2026-05-06.

---

### log-09 — Byte counter perspective and compression/CONNECT semantics

*Origin: `references/zia/logs/web-log-schema.md` § What the spec underspecifies*

The CSV defines a byte-counter family for HTTP transactions:

- `%d{reqdatasize}`, `%d{reqhdrsize}`, `%d{reqsize}` (= data + headers)
- `%d{respdatasize}`, `%d{resphdrsize}`, `%d{respsize}`
- `%d{totalsize}`

Plus throttle-size pair `%d{throttlereqsize}` / `%d{throttlerespsize}` and the SSL-related fields don't address compression. The CSV doesn't state:

1. Measurement point — bytes as observed at the client wire, at the Service Edge before decryption, after decryption, or at the destination?
2. Compression handling — for HTTP `Content-Encoding: gzip` responses, does `respdatasize` count compressed bytes (network-actual) or decompressed bytes (semantic)?
3. CONNECT method handling — for HTTPS tunneled via CONNECT, does `reqsize` count the CONNECT request itself, or the tunneled application bytes too? If the latter, how does it interact with `ssldecrypted=No` (where Zscaler can't see the inner content)?
4. Truncation thresholds — large transactions exceeding some size cap might be truncated; CSV doesn't say.

Operators sizing bandwidth, building cost models, or doing compliance byte-counting need this. Agents asked "how much data did user X exfiltrate" will assume one interpretation and may be wrong.

**Resolves with**: known-payload upload test (script `dd if=/dev/urandom bs=1M count=10 | curl …`) compared to the resulting log record across plain HTTP, gzipped HTTP, and HTTPS-with-decrypt and HTTPS-without-decrypt scenarios. **Status**: open — 2026-05-06.

---

### log-10 — `prompt_req` content scope, truncation, and sanitization

*Origin: `references/zia/logs/web-log-schema.md` § What the spec underspecifies*

The CSV defines `%s{prompt_req}` as "The prompt entered by the user in the generative AI application" (Insights name: `Prompt`). The example field is empty. Compliance-critical questions the CSV doesn't answer:

1. Is the *full* user prompt logged, or truncated at some byte/char limit?
2. Is the prompt sanitized before logging — sensitive-data stripped (PII, secrets, password-shaped strings), DLP-redacted, or left raw?
3. Does logging happen for all GenAI applications detected by Cloud App Control, or only for applications matched by a specific GenAI policy rule?
4. What's the storage retention for `prompt_req` content — does it follow standard log retention or have separate handling given the potentially-sensitive content?
5. Is the response from the GenAI app logged in a separate field, or only the prompt?

Tenants on regulated industries (healthcare, finance, defense) need to know exactly what GenAI prompt content lands in NSS feeds before they enable GenAI policy. Agents asked "do we have visibility into AI prompts users send?" may answer yes/no without flagging the truncation/sanitization gaps.

**Resolves with**: vendor doc on GenAI logging configuration + tenant test with a long prompt containing distinct markers at start, middle, end to detect truncation/redaction. **Status**: open — 2026-05-06.

---

### log-11 — Firewall aggregate session semantics

*Origin: `references/zia/logs/firewall-log-schema.md` § What the spec underspecifies*

The ZIA Firewall NSS feed CSV (`vendor/zscaler-help/nss-firewall-logs.csv`) marks 8+ fields with the caveat "For aggregated sessions, this is the *X* of the last session in the aggregate" (`csip`, `csport`, `cdip`, `cdport`, `tsip`, `sdport`, `sdip`, `ssip`, `ssport`). The CSV documents `aggregate` as a Yes/No flag and `numsessions` as a count, but doesn't state:

1. **What triggers session aggregation** — idle timeout, volume threshold, hop count, rule configuration, or some combination?
2. **How byte counters behave on aggregates** — `inbytes` / `outbytes` / `durationms` / `avgduration` are not explicitly tagged with the "last-session" caveat. Are they sums across the aggregate, max, last-session-only, or aggregated-with-some-other-rule?
3. **Why `srcip_country` is absent on aggregated allowed sessions but present on aggregated blocked sessions** — the CSV states this exception literally but doesn't explain it. Suggests source-country lookup happens at block time only on aggregates; not confirmed.
4. **Whether aggregation is configurable** at the tenant or rule level, or always-on system behavior.

For SIEM analytics: an aggregated record represents N sessions but exposes only one set of source/destination IPs. Counting unique source IPs from these records will undercount actual session-distinct sources by a factor proportional to aggregation rate.

**Resolves with**: tenant test triggering known aggregation conditions (e.g., burst of N identical sessions to the same destination from the same source) plus vendor doc on the aggregation algorithm. **Status**: open — 2026-05-06.

---

### log-12 — Firewall `action` precedence across FW + IPS + DNAT

*Origin: `references/zia/logs/firewall-log-schema.md` § What the spec underspecifies*

The Firewall NSS log has a single `%s{action}` field with example values `Allowed`, `Blocked`, but the firewall pipeline involves three subsystems that can each block or modify a transaction:

1. FW filter rules (allow/block based on 5-tuple + user/location)
2. IPS engine (signature-based detection, separate `threatcat` / `threat_score` / `ipsrulelabel` fields)
3. DNAT policy (separate `dnat` / `dnatrulelabel` fields)

The CSV doesn't state:

- When FW Allows but IPS Blocks, what's `action`? `Blocked`?
- When DNAT translates AND FW subsequently Blocks, does the record show DNAT translation occurred? `dnat` is `Yes` even on block?
- When IPS surfaces a Critical-severity threat but doesn't block (detect-only mode), is `action` Allowed but `threatcat` populated? Or Blocked?
- Is `action` the *first-fired* outcome (early-stop) or the *final* outcome after all subsystems evaluated?

Same shape as [`log-05`](#log-05-action-enum-completeness-and-multi-subsystem-precedence) for web logs but with different subsystems and different field-population implications.

**Resolves with**: deliberate-trigger tenant test (FW-allow + IPS-block, DNAT + FW-block, IPS-detect-only with Allow) and observe `action` + auxiliary fields per case. **Status**: open — 2026-05-06.

---

### log-13 — Firewall `nwapp` vs `nwsvc` relationship

*Origin: `references/zia/logs/firewall-log-schema.md` § What the spec underspecifies*

The Firewall NSS log has two distinct fields:

- `%s{nwapp}` — "Network application accessed" — example `SSH`
- `%s{nwsvc}` — "Network service used" — example `HTTP`

The CSV labels them differently but doesn't define the conceptual difference, the relationship, or the population rules. Possible interpretations the spec doesn't disambiguate:

1. `nwapp` is the L7 application identification (deep packet inspection result), `nwsvc` is the L4 service identification (port-based mapping). So a session on TCP/22 carrying an SSH-disguised tunnel might show `nwsvc=SSH` (port-derived) while `nwapp=HTTP` (DPI-detected).
2. Or vice versa.
3. Or one of them maps to a tenant-defined service object and the other to a Zscaler-built-in classification.
4. Are both always populated, or can one be absent? What populates them for non-IP-protocol traffic (ICMP)?

Practical impact: agents asked "what application did the user access?" need to know which field is authoritative and why they might disagree.

**Resolves with**: tenant export sample with deliberately ambiguous traffic (e.g., HTTP on a non-standard port, or a tunnel). Vendor doc on the firewall pipeline classification stages would also resolve it. **Status**: open — 2026-05-06.

---

### log-14 — DNS `reqaction` / `resaction` enum and cumulative vs alternative semantics

*Origin: `references/zia/logs/dns-log-schema.md` § What the spec underspecifies*

The DNS NSS feed has two action fields:

- `%s{reqaction}` — "Name of the action applied to the DNS request" — example values `REQ_ALLOW`, `RES_BLOC` (truncated abbreviations)
- `%s{resaction}` — "Name of the action applied to the DNS response" — no example

The CSV doesn't:

1. Enumerate the full set of values for either field.
2. Expand the cryptic prefixes — `REQ_ALLOW` likely means request allowed, but `RES_BLOC` (note: appears as a `reqaction` example, despite the `RES_` prefix) is confusing — is it a typo in the CSV, a valid value indicating "request seen but blocked at response stage," or something else?
3. State whether both `reqaction` and `resaction` are always populated together (so a blocked-by-response-policy DNS query would show `reqaction=REQ_ALLOW`, `resaction=RES_BLOC`), or whether only the action that actually fired populates and the other is empty.
4. Document the relationship between these and the `%s{error}` field (e.g., does `EMPTY_RESP` in `error` correlate with a specific `resaction` value?).

For SIEM rules detecting blocked DNS, the field to filter on is unclear. Filtering only on `reqaction` may miss response-stage blocks; filtering only on `resaction` may miss request-stage blocks; filtering on both may double-count.

**Resolves with**: tenant test with a request-stage block rule + a response-stage block rule (e.g., block on `domcat=Adult` for request stage; block on `respipcat=Malware Sites` for response stage) and observe field population. **Status**: open — 2026-05-06.

---

### log-15 — DNS `res` field overloading (IP vs sentinel string)

*Origin: `references/zia/logs/dns-log-schema.md` § What the spec underspecifies*

The DNS NSS feed has a single `%s{res}` field labeled "Resolved IP or NAME in the DNS response," with example values `192.168.2.200`, `EMPTY_RESP`. The same field carries fundamentally different value types:

1. **Resolved IP address** (IPv4 or IPv6 dotted-quad/colon-hex) — actual DNS A/AAAA response data
2. **Resolved name** (CNAME chain target) — DNS hostname text
3. **Sentinel string** indicating no response or an error (e.g., `EMPTY_RESP`) — Zscaler-specific tokens

The CSV doesn't:

1. Enumerate the sentinel-string set (only `EMPTY_RESP` is shown). What other tokens? Are they consistent across cloud generations?
2. Specify how to programmatically distinguish the three value types — agents/parsers will likely regex on dotted-quad and assume non-matches are sentinels, but CNAME hostnames could collide with sentinel-string patterns.
3. Specify what the field contains for multi-record responses (multiple A records, AAAA + A combined response). One delimited list? Just the first? An aggregate of all answer-section entries?
4. Document how `res` interacts with `restype` — when `res` is a sentinel like `EMPTY_RESP`, is `restype` empty, the requested type, or a sentinel of its own?

Cross-link: relates to [`log-14`](#log-14-dns-reqaction-resaction-enum-and-cumulative-vs-alternative-semantics) — sentinel `res` values likely correlate with specific `resaction` / `error` combinations.

**Resolves with**: tenant export with deliberately-triggered DNS errors (NXDOMAIN, SERVFAIL, REFUSED) plus successful queries with multiple-answer responses; observe `res` field population per case. **Status**: open — 2026-05-06.

---

### log-16 — DNS `dnsgw_flags` semantics and failover state machine

*Origin: `references/zia/logs/dns-log-schema.md` § What the spec underspecifies*

The DNS NSS feed has `%s{dnsgw_flags}` labeled "Flags indicating DNS Gateway status" with example values `PRIMARY_SERVER_RESPONSE_PASS`, `SECONDARY_SERVER_RESPONSE_PASS`, `FO_DEST_PASS`, `FO_DEST_ERR`, `FO_DEST_DROP`, `None`. The CSV doesn't:

1. **Expand "FO"** — presumably failover, but unstated.
2. **State whether values are mutually exclusive** (one flag per record) or **cumulative** (multiple flags concatenated by some delimiter).
3. **Document the failover state machine** — under what conditions does `PRIMARY_SERVER_RESPONSE_PASS` → `SECONDARY_SERVER_RESPONSE_PASS` → `FO_DEST_PASS` → `FO_DEST_ERR` → `FO_DEST_DROP` transition? Is the transition observable per-record or only across multiple records?
4. **Distinguish `FO_DEST_ERR` from `FO_DEST_DROP`** — both seem to indicate failure but with different sub-types unstated. Configured destination unreachable vs configured destination returned an error vs configured destination policy-blocked?
5. **Specify when `None` fires** — DNS Gateway not configured for this transaction? DNS Gateway evaluated but no flag fired? Unclear.

For DNS-tunnel troubleshooting and DNS Gateway routing diagnostics, knowing what each flag actually represents is essential. Agents asked "why did this DNS query fail?" can readily invent meaning for `FO_DEST_ERR` vs `FO_DEST_DROP`.

**Resolves with**: vendor doc on DNS Gateway pipeline + tenant test with a configured failover scenario (intentionally unreachable primary, intentionally policy-blocking secondary). **Status**: open — 2026-05-06.

---

### log-17 — CASB per-record category discriminator field

*Origin: `references/zia/logs/casb-log-schema.md` § Open questions*

ZIA SaaS Security / API CASB logs are organized into eight application categories (Collaboration, CRM, Email, File, Gen AI, ITSM, Public Cloud Storage, Repository), each with its own column set per the SaaS Security Insights Logs UI (`vendor/zscaler-help/about-saas-security-insights-logs.md`). All eight categories share a Cloud NSS feed instance. The CSV doesn't state:

1. **Which field discriminates category-of-record** — `appclass` is a likely candidate (matches the eight-category vocabulary) but unconfirmed.
2. **Whether category-specific fields are absent or null on out-of-category records** — e.g., does a Collaboration record have null `share_type` or omit the field entirely from the JSON output?
3. **Whether multi-category SaaS apps** (e.g., Microsoft 365 spans Collaboration + Email + File) produce one record per category-aspect or a single record with merged fields.
4. **Whether the discriminator is stable across cloud generations** or has changed in newer ZIA versions.

This is high-leverage because every parser of this feed must know the discriminator before extracting category-specific fields. Without it, a SIEM parser either has to (a) try every possible field name and accept many empties, or (b) infer category from `appname` via lookup table — which becomes stale as new SaaS apps are added.

**Resolves with**: tenant CASB feed sample (one record from each category) plus vendor confirmation of the discriminator field name. The eight per-category column captures already noted in `casb-log-schema.md` Open questions are the prerequisite material. **Status**: open — 2026-05-06.

---

### log-18 — Microseg `EnforcementReason` × `EnforcementAction` × `EnforcementDisposition` triple semantics

*Origin: `references/zpa/logs/microsegmentation-flow-log-schema.md` § What the spec underspecifies*

The ZPA Microsegmentation Flow log carries three enforcement-related fields, each with explicit enums:

- `EnforcementReason`: `POLICY_DISABLED`, `RULE`, `NO_POLICY_EXISTS`, `FORCED`
- `EnforcementAction`: `ALLOW`, `BLOCK`, `SIMBLOCK`
- `EnforcementDisposition`: `UNKNOWN`, `CONNECTED`, `REJECTED`, `DROPPED`

The individual enums are documented but the **combinations** are not. Specific gaps:

1. `EnforcementReason=POLICY_DISABLED` + `EnforcementAction=BLOCK` + `EnforcementDisposition=CONNECTED` — does this mean monitor-mode-block-would-have-fired-but-allowed? Or different combination of states?
2. `EnforcementReason=NO_POLICY_EXISTS` + `EnforcementDisposition=DROPPED` — implicit-deny default behavior, or dropped for an unrelated reason (network failure, host firewall, etc.)?
3. `EnforcementAction=SIMBLOCK` paired with `EnforcementDisposition=DROPPED` or `REJECTED` — when does this happen? SIMBLOCK should imply CONNECTED.
4. Does `EnforcementDisposition=UNKNOWN` indicate a transient/incomplete record, or a specific operational state?
5. **Aggregation interaction**: when multiple connections sharing a 4-tuple aggregate (per `SourcePorts` field), do all aggregated connections need to share the same `EnforcementAction` to be aggregated into one record, or can mixed-disposition connections appear?

For SIEM rules detecting "what was actually blocked" vs "what would have been blocked in enforce mode," the safest filter is unclear without disambiguating these combinations.

**Resolves with**: tenant test in monitor mode with deliberately-triggered block-eligible flows; observe field combinations across `EnforcementReason × EnforcementAction × EnforcementDisposition`. Plus vendor doc confirming the meaning of each combination. **Status**: open — 2026-05-06.

---

### log-19 — User Status record granularity and byte counter timing

*Origin: `references/zpa/logs/user-status-log-schema.md` § What the spec underspecifies*

ZPA User Status logs carry `SessionStatus` with three values (`ZPN_STATUS_AUTHENTICATED`, `ZPN_STATUS_AUTH_FAILED`, `ZPN_STATUS_DISCONNECTED`) and per-session byte counters (`TotalBytesRx` / `TotalBytesTx`). The vendor docs don't state:

1. **Record granularity per session lifecycle** — does each session generate one record per status (so a normal login-then-logout produces an AUTHENTICATED record AND a DISCONNECTED record) or one consolidated record with status reflecting the latest state? This determines whether SIEM dashboards counting "authenticated sessions" should match `SessionStatus=AUTHENTICATED` exactly, or should deduplicate by SessionID.
2. **Byte counter population timing** — `TotalBytesRx` / `TotalBytesTx` description says "Total bytes received during the session" but doesn't say when the values are populated. Only on DISCONNECTED records (final tallies)? On every record (running totals at time of emission)? On periodic emissions during the session?
3. **`TimestampUnAuthentication` on AUTHENTICATED records** — populated only on DISCONNECTED records (= disconnect time), or always present (e.g., as expected-expiry on AUTHENTICATED)?
4. **AUTH_FAILED record byte counters** — does an AUTH_FAILED record have `TotalBytes*` populated (likely zero), or are those fields absent?

**Resolves with**: tenant LSS receiver capture across a known session lifecycle (login → activity → idle → logout) with timestamps; observe per-session record cardinality and field population at each event. **Status**: open — 2026-05-06.

---

### log-20 — Browser Access `ConnectionStatus` / `ConnectionReason` enum completeness

*Origin: `references/zpa/logs/browser-access-log-schema.md` § What the spec underspecifies*

ZPA Browser Access logs have:

- `ConnectionStatus` — example value `SUCCESS`, the existing ref lists `SUCCESS` and `FAILED` as illustrative
- `ConnectionReason` — described as "Internal reason code when a connection fails or is blocked," no example values

Neither field's full enum is documented. SIEM rules that route on specific failure types (auth failures, backend unreachable, policy block, certificate validation failure, idle timeout) need the full enum to filter precisely. Without it, alert rules either match too broadly (any non-SUCCESS) or risk missing valid failure modes.

Cross-link: byte-counter perspective and compression questions filed for ZIA web logs ([`log-09`](#log-09-byte-counter-perspective-and-compressionconnect-semantics)) and ZPA User Activity logs ([`zpa-17`](#zpa-17-delta-vs-total-byte-counter-reset-semantics)) likely apply here too.

**Resolves with**: tenant test triggering varied failure conditions (intentionally-bad backend, intentionally-blocked-by-policy URL, intentionally-expired session, intentionally-failed-cert backend) and observe `ConnectionStatus` / `ConnectionReason` value combinations. Plus vendor doc on the full enum. **Status**: open — 2026-05-06.

---

### log-21 — ZCC `log_level` vs `log_mode` relationship

*Origin: `references/zcc/logs/zcc-log-schema.md` § SDK and API surface for log configuration*

The ZCC `WebPolicy` (App Profile) SDK object exposes two seemingly-related but-undocumented-in-relationship fields:

- `log_level` (wire key `logLevel`) — described as "Log level at the policy layer"
- `log_mode` (wire key `logMode`) — accepts `Error`, `Warn`, `Info`, `Debug`

The ref body explicitly flags this: "Relationship to `logMode` not fully resolved — may be the same concept with different naming across API/UI layers." The SDK source doesn't clarify, the help portal docs don't clarify either. Possible interpretations:

1. **Same concept, different name**: `logLevel` is API-side legacy and `logMode` is UI-aligned current. Setting one mirrors the other; the API accepts both for backward compatibility.
2. **Distinct settings with composition**: `logLevel` controls some subset (e.g., authentication subsystem only) while `logMode` controls another (e.g., everything else). Combined effect is intersection / union / max.
3. **Layered**: `logLevel` is a coarse cap (e.g., max verbosity allowed by App Privacy controls), `logMode` is the active value.

This affects automation that tries to set ZCC to a specific verbosity programmatically — operators need to know whether to set both, just one, or one specific to UI vs API path.

**Resolves with**: SDK behavior test — set `logLevel` and `logMode` to different values, observe what ZCC actually logs at, plus what the App Profile UI displays. Plus vendor SDK clarification. **Status**: open — 2026-05-06.

---

### log-22 — Cloud Connector `Status` flags and `UpgradeStatus` codes

*Origin: `references/cloud-connector/logs/log-schema.md` § SDK/API state fields*

The Go SDK `ECVMs` struct (`vendor/zscaler-sdk-go/zscaler/ztw/services/common/common.go`) exposes per-VM observability fields including:

- `Status []string` — "Per-VM status flags" — slice of strings, but enum/value space undocumented
- `UpgradeStatus int` — "Current upgrade state (0 = current; non-zero = in-progress or failed; exact codes undocumented)"

For monitoring automation polling these fields, enum semantics matter:

1. **`Status` flag set** — what flags exist? Are they health flags (`HEALTHY`, `DEGRADED`), tunnel flags (`ZIA_OK`, `ZPA_OK`), upgrade flags (`UPGRADING`), or a mix? Are flags additive (multiple coexist on a healthy VM) or mutually exclusive?
2. **`UpgradeStatus` int → meaning** — `0` = current, but what do `1`, `2`, `3`, etc. represent? In-progress, failed, rollback-in-progress, requires-manual-action? Without the mapping, alerting on non-zero is too broad to be actionable.
3. **Relationship to `OperationalStatus`** — `OperationalStatus` is `Active` / `Inactive` / `Disabled`. How does that interact with the `Status` flags? E.g., is `Active` + `Status=[DEGRADED]` a valid combination?

For SIEM dashboards correlating CC health to traffic anomalies, knowing what each status code means is essential. Without it, dashboards either alert on every non-zero (noisy) or alert on nothing (missed signals).

**Resolves with**: SDK behavior observation across known CC states (healthy, mid-upgrade, post-upgrade-failure) plus vendor doc on the value spaces. **Status**: open — 2026-05-06.

---

### zcc-01 — ForwardingProfile `condition_type` enum

*Origin: `references/zcc/forwarding-profile.md` § Trusted-network evaluation*

The `condition_type` field on a `ForwardingProfile` controls how inline trusted-criteria, referenced TrustedNetworks, and the predefined set combine (AND across all of them? OR? some hybrid?). The Python SDK passes the value through without validation.

**Type confirmed (2026-04-24)**: Cross-SDK check against `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:22` reveals the field is `int`, not string. Earlier candidate-value speculation (`TRUSTED_CRITERIA_AND`, `AND`, `OR`) was wrong — the wire format uses integer codes.

**Resolves with**: lab test (configure a profile with two criteria; toggle `condition_type` between plausible integer values; observe whether both-required vs any-required changes) OR zscaler doc not yet read. **Status**: partially resolved — type known (`int`), semantic mapping still open.

---

### zcc-02 — ForwardingProfile actions `network_type` enum

*Origin: `references/zcc/forwarding-profile.md` § ForwardingProfileActions*

Each item in `forwardingProfileActions` is keyed by `networkType` specifying which network-classification branch it applies to.

**Type confirmed (2026-04-24)**: Go SDK (`forwarding_profile.go:48`) types the field as `int`. Earlier speculation that values might be `TRUSTED` / `UNTRUSTED` strings was wrong — integer codes. Likely 0/1/2/... mapping to Trusted / Untrusted / VPN-Trusted / etc., but the order-to-meaning mapping is unconfirmed.

**Resolves with**: tenant snapshot of a tenant with multiple branches OR lab test. **Status**: partially resolved — type known (`int`), semantic mapping still open.

---

### zcc-03 — ForwardingProfile `action_type` enum

*Origin: `references/zcc/forwarding-profile.md` § ForwardingProfileActions*

The `actionType` field on each network-type action block decides what happens to traffic in that branch.

**Type confirmed (2026-04-24)**: Go SDK (`forwarding_profile.go:49`, `:99`) types the field as `int`. Earlier speculation that values might be string literals like `NONE` / `TUNNEL` / `PAC` was wrong — integer codes. Note: in `UnifiedTunnel` sub-objects, the field is split into `actionTypeZIA` (int) and `actionTypeZPA` (int), indicating ZIA and ZPA traffic can have independent action selections within a shared unified tunnel.

**Resolves with**: tenant snapshot covering multiple profile variants OR zscaler doc not yet read. **Status**: partially resolved — type known (`int`), semantic mapping still open.

---

### zcc-04 — ForwardingProfile `primary_transport` enum

*Origin: `references/zcc/forwarding-profile.md` § ForwardingProfileActions*

The `primaryTransport` field on both ZIA and ZPA actions specifies the transport protocol preference.

**Type confirmed (2026-04-24)**: Go SDK (`forwarding_profile.go:53`, `:100`, plus `UnifiedTunnel.primaryTransport:122` and `PartnerInfo.primaryTransport:115`) types the field as `int`. Earlier speculation that values might be strings like `ZTUNNEL` / `DTLS` / `TLS` was wrong — integer codes. The integer-to-protocol mapping is likely stable across the 5 instances of this field (consistent semantic across contexts) but the specific mapping is still unconfirmed.

**Resolves with**: tenant snapshot OR zscaler doc. **Status**: partially resolved — type known (`int`), semantic mapping still open.

---

### zcc-05 — `systemProxyData` vs native forwarding action precedence

*Origin: `references/zcc/forwarding-profile.md` § Edge cases*

When a forwarding-profile action has `systemProxy=true` with `systemProxyData` specifying a PAC URL or proxy server, and it also specifies `actionType` (e.g. TUNNEL), how does ZCC decide which to honor? In particular: does the system-proxy PAC evaluate before the Z-Tunnel action, or does it only apply when `actionType` is `PAC`-equivalent?

**Resolves with**: lab test OR zscaler doc. **Status**: partially resolved (2026-04-24).

**Partial answer (2026-04-24)**: The *Best Practices for Adding Bypasses for Z-Tunnel 2.0* help article (`vendor/zscaler-help/best-practices-adding-bypasses-z-tunnel-2.0.md`) documents two 3.8+ Windows flags — `Redirect Web Traffic to Zscaler Client Connector Listening Proxy` and `Use Z-Tunnel 2.0 for Proxied Web Traffic` — as the officially-supported way to combine system-proxy-style routing with Z-Tunnel 2.0. The truth table for their interaction is captured in [`../zcc/z-tunnel.md § Domain-based bypasses`](../zcc/z-tunnel.md). SDK fields: `redirect_web_traffic` and `use_tunnel2_for_proxied_web_traffic` on `ForwardingProfileActions`.

Key interaction surfaced by the article: `Use Z-Tunnel 2.0 for Proxied Web Traffic` applies **only to the default return statement in the App Profile PAC**. Traffic matching a specific PAC statement that routes to a particular Service Edge silently uses Z-Tunnel 1.0, regardless of the flag state.

**Remaining gap**: behavior when `systemProxyData` (OS-level proxy settings) is populated AND an `actionType` is set that conflicts with it — e.g., does a system PAC URL override a Tunnel action, or vice versa? Needs lab confirmation on a real tenant.

---

### zcc-06 — TrustedNetwork `condition_type` enum

*Origin: `references/zcc/trusted-networks.md` § `condition_type`*

Parallel to `zcc-01` but at the TrustedNetwork entity level: how do this TrustedNetwork's own criteria (DNS servers, SSIDs, etc.) combine — AND (all required) or OR (any suffices)?

**Type confirmed (2026-04-24)**: Go SDK (`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network/trusted_network.go:28`) types the field as `int`, not string.

**Resolves with**: lab test with two obvious criteria (one correct, one incorrect) toggling `condition_type` between 0 and 1. **Status**: partially resolved — type known (`int`), semantic mapping still open.

---

### zcc-07 — Forwarding-profile assignment to users/devices

*Origin: `references/zcc/api.md` § Open questions*

The SDK's `client.zcc.forwarding_profile` surface exposes CRUD on profile objects but no method for associating a profile with a user, group, or device. ZCC admin UX offers "App Profiles" that select a forwarding profile. The App Profile API is exposed under `client.zcc.application_profiles` (`/application-profiles`, list + get-by-id + PATCH) in both SDKs (Go: `application_profiles/application_profiles.go:296 PatchApplicationProfile`; Python: `zcc_service.py:129-134`). How the full forwarding-profile-to-user/device assignment relationship is managed programmatically remains partly open.

**Resolves with**: partial answer from SDK mining (see below). Full completeness: lab confirmation on a real tenant that WebPolicy is the sole assignment mechanism. **Status**: partially resolved (2026-04-24).

**Partial answer (2026-04-24, revised same-day after help-doc capture)**:

From `vendor/zscaler-help/about-zscaler-client-connector-app-profiles.md` (Zscaler help "About Zscaler Client Connector App Profiles"), the admin-portal object is called an **App Profile**, and one of its first-class functions is: *"Select the forwarding profile for Zscaler Internet Access (ZIA) and Zscaler Private Access (ZPA) services."* App Profiles also carry: policy rule order, scope (all users vs groups), uninstall/disable/logout password gates, SSL cert installation, log generation settings, and a **default policy** (the fallback when no user-matching rule fires).

Mapping to SDK:

- The SDK's `WebPolicy` (`zscaler/zcc/models/webpolicy.py`) has the matching shape: `forwarding_profile_id` field, `rule_order`, scope (`user_ids` / `group_ids` / `device_group_ids`), per-platform sub-policies (Windows / macOS / Linux / iOS / Android), uninstall password gates, `install_ssl_certs`, log settings. The endpoint path — `/zcc/papi/public/v1/webPolicy/...` — uses `webPolicy` on the wire even though the UI calls them "App Profiles."
- **Most likely App Profile in UI == WebPolicy in SDK.** The `web`-prefix naming is a wire/API historical artifact; marketing renamed to "App Profile" after the SDK was written.

Two first-pass-tenant-resolvable sub-questions remain:

1. Confirm the name equivalence by comparing `WebPolicy` snapshot output against an App Profile as displayed in the portal.
2. Identify where the App Profile "default policy" (from the help doc) lives at the API level. Candidates: a WebPolicy flagged as default, a separate tenant-level fallback setting, or the terminal-position Web Policy in `rule_order`.

Also discovered in the help-doc capture: App Profiles carry **per-app bypass lists** (process-based and IP-based) — fields that correspond to the SDK's `WebPolicy.bypass_app_ids` / `bypass_custom_app_ids`. This is the "application bypass" feature (see `about-application-bypass` in the Related Articles list) — a user-noticeable behavior where ZCC skips interception for specific apps. Deserves its own reference doc eventually; not yet written.

**Status updated from "the SDK doesn't expose assignment" to "assignment is in WebPolicy, which is called App Profile in the portal."**

---

### zpa-10 — `policy_type` enum drift between data source and reorder resource

*Origin: `scripts/find-asymmetries.py` Pass 1, intra-provider scan*

*Note: this entry was originally filed as `zpa-08` but renumbered to `zpa-10` after the hygiene checker (`scripts/check-hygiene.py`) caught an ID collision with the existing resolved `zpa-08` ("When both FQDNs are equal" interpretation). New clarification IDs must scan the existing entries before claiming a number.*

The TF data source `data_source_zpa_policy_type` accepts `[ACCESS_POLICY, BYPASS_POLICY, CAPABILITIES_POLICY, CLIENT_FORWARDING_POLICY, CREDENTIAL_POLICY, GLOBAL_POLICY, INSPECTION_POLICY, ISOLATION_POLICY, REAUTH_POLICY, REDIRECTION_POLICY, SIEM_POLICY, TIMEOUT_POLICY]` (12 values). The TF resource `resource_zpa_policy_access_rule_reorder` accepts a 12-value set differing in two values: it has `CLIENTLESS_SESSION_PROTECTION_POLICY` (not in the data source) and lacks `SIEM_POLICY` (which the data source has).

Possible explanations:

1. **`SIEM_POLICY` is read-only at the policy-type level** (no rules to reorder; logs flow through it but it has no rule list). Reorder validator correctly omits it.
2. **`CLIENTLESS_SESSION_PROTECTION_POLICY` is reorderable but is a newer feature** that the data source's enum hasn't picked up yet — stale validator.
3. **Both are intentional but undocumented at the schema level.**

**Resolves with**: API exploration. List policy types via OneAPI and compare against both validators; observe whether SIEM_POLICY actually exposes a rule list; check `CLIENTLESS_SESSION_PROTECTION_POLICY` data source lookup behavior. **Status**: open candidate. Tier-A finding (validator divergence verified) but the *interpretation* is operator-uncertain. Threading deferred until interpretation lands.

---

### zpa-09 — `inspection_custom_controls.control_type` accepts `API_PREDEFINED`; `inspection_profile.control_type` does not

*Origin: `scripts/find-asymmetries.py` Pass 1, intra-provider scan*

`resource_zpa_inspection_custom_controls.go:97` lists `control_type` enum as `[API_PREDEFINED, CUSTOM, PREDEFINED, THREATLABZ, WEBSOCKET_CUSTOM, WEBSOCKET_PREDEFINED]` (6 values). `resource_zpa_inspection_profile.go:93` lists `[CUSTOM, PREDEFINED, THREATLABZ, WEBSOCKET_CUSTOM, WEBSOCKET_PREDEFINED]` (5 values — no `API_PREDEFINED`).

Possible explanations:

1. **API_PREDEFINED controls cannot be added to an inspection profile** — they exist as standalone protections but aren't profile-attachable. Profile validator correctly omits the type.
2. **Profile validator is stale** and needs to be updated to accept API_PREDEFINED.

**Resolves with**: lab test creating an `API_PREDEFINED` custom control and attempting to attach it to an inspection profile via the TF resource. If the API rejects it, explanation 1 holds; if accepted, the profile validator is stale. **Status**: open candidate. Threading deferred until lab confirms.

---

### zia-16 — Sublocation count cap per parent

*Origin: `references/zia/sublocations.md` § Open questions*

Whether a maximum number of sublocations per parent location is enforced by the API. No limit is documented in the vendor help doc, SDK source, or Terraform provider source.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations for locations) OR lab test

---

### zia-17 — Sublocation name uniqueness scope

*Origin: `references/zia/sublocations.md` § Open questions*

Whether sublocation names must be unique within their parent location or across the entire ZIA tenant. No explicit statement found in any available vendor source.

**Status**: open
**Resolves with**: lab test (create two sublocations with the same name under different parents; observe whether the API rejects the second)

---

### zia-18 — Parent location deletion behavior with sublocations

*Origin: `references/zia/sublocations.md` § Open questions*

Whether the API blocks deletion of a parent location that has active sublocations, cascade-deletes them, or returns an error. Not documented in `understanding-sublocations.md`, SDK delete method, or Terraform provider.

**Status**: open
**Resolves with**: lab test

---

### zia-19 — Sublocation reparenting via `parent_id` update

*Origin: `references/zia/sublocations.md` § Open questions*

Whether the API enforces preconditions when a sublocation is promoted to top-level (removing its `parent_id`) — e.g., whether it blocks promotion if the location already has its own sublocations, given the 2-level depth limit.

**Status**: open
**Resolves with**: lab test

---

### zia-20 — Explicit depth-limit prohibition text

*Origin: `references/zia/sublocations.md` § Open questions*

Available vendor sources show only 2-level hierarchy examples; no explicit vendor statement prohibiting sublocations from themselves having sublocations was found. Matters for operators expecting a 3-level hierarchy.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations for locations)

---

### zia-21 — Time interval DST handling

*Origin: `references/zia/time-intervals.md` § Open questions*

Whether `startTime`/`endTime` minute-offset values are evaluated against the location's configured timezone with DST applied (so a 9:00 AM rule stays at 9:00 AM local time year-round), or against a fixed UTC offset. Not documented in any available vendor source.

**Status**: open
**Resolves with**: lab test (set an interval at a DST boundary; observe behavior before/after transition) OR support ticket

---

### zia-22 — Tenant cap on `/timeIntervals` objects

*Origin: `references/zia/time-intervals.md` § Open questions*

Whether a maximum count of user-created time interval objects exists at the tenant level. No limit stated in the help portal, SDK source, or Terraform provider.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations for policy objects)

---

### zia-23 — Terraform `zia_time_interval` resource

*Origin: `references/zia/time-intervals.md` § Open questions*

No `zia_time_interval` resource block exists in the ZIA Terraform provider. Whether this surface is planned, intentionally excluded, or available only via the ZIA API is not confirmed from available provider source.

**Status**: open
**Resolves with**: zscaler doc not yet read (provider changelog or GitHub issues for terraform-provider-zia)

---

### zia-24 — Midnight-spanning time intervals

*Origin: `references/zia/time-intervals.md` § Open questions*

Whether `endTime < startTime` is accepted by the API to represent windows that cross midnight (e.g., 11 PM to 1 AM), or whether two separate objects are required. The Go SDK struct uses plain `int` with no visible constraint.

**Status**: open
**Resolves with**: lab test

---

### zia-25 — Predefined objects in `/timeIntervals`

*Origin: `references/zia/time-intervals.md` § Open questions*

Whether fixed predefined time interval objects (analogous to the `/timeWindows` catalog's "Work hours" and "Weekends" entries) also exist in the `/timeIntervals` endpoint, or whether `/timeIntervals` is entirely user-managed.

**Status**: open
**Resolves with**: tenant snapshot (list `/timeIntervals` on a fresh or known-clean tenant)

---

### zia-26 — Rule label names in audit log entries

*Origin: `references/zia/rule-labels.md` § Open questions*

Whether label names appear in ZIA admin audit log entries for rule create/update operations. Vendor help and SDK sources describe labels as UI/API metadata only; no audit log schema including label names was found in reviewed sources.

**Status**: open
**Resolves with**: tenant snapshot (inspect audit log entries for a rule update that adds a label)

---

### zia-27 — Rule label name field constraints

*Origin: `references/zia/rule-labels.md` § Open questions*

Character-set restrictions and maximum length on the `name` field. Not documented in the SDK model, vendor help, or Terraform provider source; the TF doc only marks the field as Required (String).

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read (Ranges & Limitations)

---

### zia-28 — Rule label name uniqueness enforcement

*Origin: `references/zia/rule-labels.md` § Open questions*

Whether `name` must be unique within a ZIA tenant and whether the API rejects duplicate names on create. Not confirmed from available sources.

**Status**: open
**Resolves with**: lab test

---

### zia-29 — Rule label `description` maximum length

*Origin: `references/zia/rule-labels.md` § Open questions*

Maximum allowed length for the `description` field. Not documented in the SDK model, vendor help, or Terraform provider source.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations) OR lab test

---

### zia-30 — Rule label "duplicate" action semantics

*Origin: `references/zia/rule-labels.md` § Open questions*

The vendor help page lists "duplicate" as an action on the Rule Labels admin console page but does not describe what it copies — whether it duplicates label metadata only (a new unassociated label) or also copies all label-to-rule associations.

**Status**: open
**Resolves with**: lab test (duplicate a label with known rule associations; inspect both the new label and the original rules)

---

### zia-31 — `rule_label` filter on non-firewall endpoints

*Origin: `references/zia/rule-labels.md` § Open questions*

The `rule_label` query parameter is confirmed on `FirewallPolicyAPI.list_rules`. Whether equivalent filtering is available on other policy rule list endpoints (URL Filtering, Cloud App Control, etc.) is not confirmed.

**Status**: open
**Resolves with**: code read (inspect each policy list endpoint in the SDK for a `rule_label` parameter)

---

### zia-32 — Tenant cap on rule labels

*Origin: `references/zia/rule-labels.md` § Open questions*

Whether a documented maximum count of rule labels per ZIA tenant exists. Not found in vendor help or any SDK source.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations)

---

### zia-50 — `ruleType` filter endpoint REST backing

*Origin: `references/zia/rule-labels.md` § Open questions*

The `GET /zia/api/v1/ruleLabels/ruleType/{rule_type}` filter endpoint (Python SDK `get_rule_type_label`) appears **only** in the Python SDK service layer (`vendor/zscaler-sdk-python/zscaler/zia/rule_labels.py:280`). It has no counterpart in the Go SDK (`vendor/zscaler-sdk-go/zscaler/zia/services/rule_labels/rule_labels.go` exposes only Get/GetRuleLabelByName/Create/Update/Delete/GetAll) and is absent from the Postman collection (`vendor/zscaler-api-specs/oneapi-postman-collection.json` "Rule Labels" folder lists only the five CRUD requests). Whether this endpoint is a stable, generally available REST surface — or a Python-SDK convenience over an undocumented/internal path — is unconfirmed. The same uncertainty applies to its `rule_type` enum (`URL_FILTERING`, `FIREWALL`, `CASB_DLP`, `CLOUD_APP_CONTROL`, `DATA_PROTECTION`, `GENAI`, `INDUSTRY_PEER`, `NEWS_FEED`, `RISK_SCORE`, `SANDBOX`), which is documented only in the Python SDK docstring.

**Status**: open
**Resolves with**: zscaler doc not yet read (OneAPI ruleLabels reference) OR lab test (call the endpoint against a live tenant)

---

### zia-33 — VSE cluster upgrade sequencing

*Origin: `references/zia/vse-clusters.md` § Open questions*

Whether maintenance-window auto-upgrades within a VSE cluster are applied as a rolling sequence (one VM at a time, preserving cluster capacity) or simultaneously across all member VMs. The vendor cluster doc describes auto-upgrade at the VM level but does not address cluster-level sequencing.

**Status**: open
**Resolves with**: operator experience OR support ticket

---

### zia-34 — VSE cluster VM drain-before-removal

*Origin: `references/zia/vse-clusters.md` § Open questions*

Whether removing a VM from an active VSE cluster gracefully drains in-flight connections before it leaves the LB pool, or resets sessions immediately. Not described in either VSE vendor doc.

**Status**: open
**Resolves with**: operator experience OR lab test

---

### zia-35 — VSE cluster log entry granularity

*Origin: `references/zia/vse-clusters.md` § Open questions*

Whether NSS/Admin Console analytics log entries for VSE cluster traffic carry a VM-level identifier, a cluster-level identifier, or both. Not addressed in the VSE cluster or VSE VM vendor docs.

**Status**: open
**Resolves with**: tenant snapshot (inspect NSS log entries for traffic routed through a VSE cluster) OR operator experience

---

### zia-36 — VSE cluster-scoped vs VM-scoped settings boundary

*Origin: `references/zia/vse-clusters.md` § Open questions*

Which policy settings are pushed cluster-scoped versus which require per-VM configuration. The Admin Console cluster page shows name, status, members, cluster IP, and IPSec termination settings but does not distinguish scope.

**Status**: open
**Resolves with**: operator experience OR zscaler doc not yet read

---

### zia-37 — VSE NAT topology support

*Origin: `references/zia/vse-clusters.md` § Open questions*

Whether 1:1 static NAT to public IPs is supported for VSE VMs in cluster mode, and whether the IPv6-in-NAT restriction that applies to PSE clusters also applies to VSE. VSE firewall/connectivity docs reference outbound connectivity but do not address inbound NAT topology.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### zia-38 — Public-cloud VSE cluster object semantics

*Origin: `references/zia/vse-clusters.md` § Open questions*

On Azure, AWS, and GCP, whether the Admin Console VSE Cluster object is a purely cosmetic grouping or carries behavioral configuration beyond what the cloud-native LB enforces. Not addressed in available sources.

**Status**: open
**Resolves with**: operator experience OR zscaler doc not yet read

---

### zia-39 — SCIM unknown `department` string handling

*Origin: `references/zia/scim-provisioning.md` § Open questions*

When ZIA receives a `department` attribute via SCIM that does not match any existing ZIA department object by name — whether ZIA auto-creates a new department object, silently drops the association, or returns an error to the IdP. Not described in `understanding-scim-zia.md` or any reviewed source.

**Status**: open
**Resolves with**: lab test OR support ticket
**Blocks**: accurate characterization of SCIM provisioning failure modes for the `department` attribute

---

### zia-40 — SCIM `active=false` session-kill semantics

*Origin: `references/zia/scim-provisioning.md` § Open questions*

Whether `active=false` sent via SCIM immediately terminates active ZIA proxy sessions for the user, or only blocks future authentications (next connect/reauthentication). The vendor doc states `active=false` disables the user but does not describe session-kill semantics.

**Status**: open
**Resolves with**: lab test

---

### zia-41 — ZIA SCIM endpoint rate limits

*Origin: `references/zia/scim-provisioning.md` § Open questions*

Whether ZIA SCIM endpoints (`/Users`, `/Groups`, `/Bulk`) have distinct rate limits from the general ZIA API rate limits (20 GET/10s, 10 write/10s per Go SDK). No SCIM-specific rate limit guidance is published in available vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### zia-42 — SCIM tenant-level object caps

*Origin: `references/zia/scim-provisioning.md` § Open questions*

Whether tenant-level caps exist on the number of SCIM-provisioned users and groups, distinct from the 128 groups/user-membership cap. Not stated in `understanding-scim-zia.md`; no Ranges & Limitations reference for SCIM object counts reviewed.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations)

---

### zia-43 — Per-IdP `department` attribute mapping behavior

*Origin: `references/zia/scim-provisioning.md` § Open questions*

How Entra ID, Okta, PingFederate, and Google Workspace each map or omit the Enterprise User `department` field by default in their SCIM integrations with ZIA. Covered in per-IdP configuration guides referenced by the ZIA vendor doc but those guides were not captured.

**Status**: open
**Resolves with**: zscaler doc not yet read (per-IdP SCIM setup articles for ZIA)

---

### zia-44 — ZIA SCIM sync log visibility

*Origin: `references/zia/scim-provisioning.md` § Open questions*

Whether the ZIA admin console has a SCIM Sync Logs page analogous to the ZPA "About SCIM Sync Logs" article. The ZIA vendor doc's related-articles section lists config and API articles but no dedicated sync log article for ZIA.

**Status**: open
**Resolves with**: zscaler doc not yet read

---

### zia-45 — Per-IdP SCIM push cadence

*Origin: `references/zia/scim-provisioning.md` § Open questions*

The exact sync frequency per IdP (Okta event-triggered vs scheduled batch, Entra ID provisioning cycle timings) for ZIA SCIM provisioning. IdP-controlled behavior not consolidated in any Zscaler vendor source.

**Status**: open
**Resolves with**: zscaler doc not yet read (per-IdP SCIM configuration guides) — the IdP documentation is authoritative for cadence behavior

---

### zia-46 — Terraform provider dynamic location groups removal

*Origin: `references/zia/locations.md` § Surprises worth flagging*

Why did the Terraform provider remove or comment out `dynamic_location_groups`
handling in `zia_location_management` during the v4.6.0 era after earlier
provider work added Manual and Dynamic Location Group attributes? Was the field
deprecated by the ZIA API, temporarily removed due provider drift, moved to a
separate API/resource shape, or intentionally hidden because dynamic membership
is read-only/API-derived?

**Status**: open — last updated 2026-05-30
**Resolves with**: support ticket OR upstream maintainer comment OR code read
against provider history plus live API behavior
**Blocks**: deterministic guidance for managing Dynamic Location Group
membership through Terraform. Public docs still describe Dynamic Location
Groups as a ZIA product feature, so provider removal must not be interpreted as
product deprecation without additional evidence.

Known evidence: [zscaler/terraform-provider-zia#355](https://github.com/zscaler/terraform-provider-zia/issues/355)
states that v2.91.3 added Manual and Dynamic Location Group attributes to
`zia_location_management`. Later v4.6.0 work
([zscaler/terraform-provider-zia#496](https://github.com/zscaler/terraform-provider-zia/pull/496))
removed or commented dynamic-location-group handling while release notes only
call out static location-group drift. The missing rationale is the clarification
gap.

---

### zpa-11 — Machine group creation endpoint

*Origin: `references/zpa/machine-groups.md` § Open questions*

Whether a direct POST `/machineGroup` endpoint exists. Both SDKs expose only read operations; the vendor help doc implies groups are created through Admin Console provisioning key management and enrollment, with no API-level create operation confirmed.

**Status**: open
**Resolves with**: code read (check ZPA API reference for a POST `/machineGroup` path) OR operator experience

---

### zpa-12 — Machine group matching criteria

*Origin: `references/zpa/machine-groups.md` § Open questions*

Whether the machine group definition carries any matching criteria beyond provisioning key linkage — e.g., hostname pattern, OS type, or certificate subject on the group object itself. The Python and Go SDK models show no such fields; the vendor doc does not describe group-level matching attributes.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zpa-13 — `MACHINE_GRP` in user-session access rules

*Origin: `references/zpa/machine-groups.md` § Open questions*

Whether `MACHINE_GRP` can scope user-session ZPA access rules (not just machine-tunnel rules). The vendor doc focuses exclusively on the machine tunnel use case. Not confirmed or denied in reviewed sources.

**Status**: open
**Resolves with**: lab test (create an access rule with `MACHINE_GRP` operand and attempt to match a user-session connection)

---

### zpa-14 — Machine group capacity limits

*Origin: `references/zpa/machine-groups.md` § Open questions*

Capacity limits: machine groups per tenant, provisioning keys per group, and enrolled machines per group. No limit figures found in vendor help doc, SDK, or Terraform provider source.

**Status**: open
**Resolves with**: zscaler doc not yet read (Ranges & Limitations for ZPA) OR support ticket

---

### zpa-15 — Machine groups file path correction

*Origin: `references/zpa/machine-groups.md` § classification*

The coverage audit (`archive/audits/2026-04-26.md`) listed machine groups under "ZIA uncovered." All sources confirm this is a ZPA construct: vendor URL is `help.zscaler.com/zpa/about-machine-groups`; all SDK and Terraform artifacts are ZPA-only.

**Status**: resolved — 2026-04-27

**Answer**: The file was moved from `references/zia/machine-groups.md` to `references/zpa/machine-groups.md` with frontmatter corrected to `product: zpa`. The audit entry was updated to reflect this. Machine groups are a ZPA construct exclusively.

---

### zpa-16 — `ConnectionStatus` `Active` emission cadence on long-lived sessions

*Origin: `references/zpa/logs/access-log-schema.md` § State machine and timing*

ZPA LSS User Activity logs document `ConnectionStatus` values `Open`, `Close`, `Active` (per `vendor/zscaler-help/Understanding_User_Activity_Log_Fields.txt`) but don't state what triggers an `Active` record on a long-lived connection. The delta-byte counter wording "since the last transaction log" implies multiple records per long connection, but the boundary trigger (time interval, byte volume threshold, segment change, other) is not specified.

**Resolves with**: lab test on a long-lived ZPA session (e.g., SSH tunnel sustained for hours) with LSS receiving — observe `Active` record cadence and what events correlate with each emission. Or vendor support thread.

**Status**: open — 2026-05-06.

---

### zpa-17 — Delta vs total byte counter reset semantics

*Origin: `references/zpa/logs/access-log-schema.md` § State machine and timing*

The User Activity log has two byte-counter families per direction: delta (`ZENBytesRxClient`, `ZENBytesTxClient`, `ZENBytesRxConnector`, `ZENBytesTxConnector` — described as "since the last transaction log") and total (`ZENTotalBytesRxClient` etc. — described as "Total bytes received/transmitted"). The vendor PDF doesn't state:

1. Whether the delta counters reset to zero at every `Active` record, or only at some other boundary
2. Whether `ZENTotalBytes*` is the running total since `ConnectionStatus=Open` or since some other anchor (session start, protocol handshake, etc.)
3. What happens to the delta counter on the final `ConnectionStatus=Close` record (final segment of usage, or zero?)

**Resolves with**: lab test correlating a known-volume payload (e.g., scripted upload of N MB) against successive log records. Or vendor doc clarification.

**Status**: open — 2026-05-06.

---

### zpa-18 — Timing phase ordering and overlap

*Origin: `references/zpa/logs/access-log-schema.md` § State machine and timing*

The User Activity log carries six µs-precision timing fields covering connection establishment: `AppLearnTime`, `CAProcessingTime`, `PolicyProcessingTime`, `ConnectorZENSetupTime`, `ConnectionSetupTime`, `ServerSetupTime`. The vendor PDF defines each individually but does not show ordering or overlap:

- Are these strictly sequential phases (so they can be summed for total establishment latency)?
- Or do some overlap (e.g., `PolicyProcessingTime` happens during `CAProcessingTime`)?
- Is `ConnectionSetupTime` ("App Connector to process notification ... and set up the connection to the application server") a superset that includes `ServerSetupTime` ("set up the connection at the server"), or are they disjoint?

The Timestamp* fields (`TimestampCATx`, `TimestampCARx`, `TimestampAppLearnStart`, `TimestampConnectorZENSetupComplete`, etc.) reconstruct part of the sequence but don't fully disambiguate scope of each *Time field.

**Resolves with**: vendor doc explicitly sequencing the phases, or correlated lab measurement using the Timestamp* boundaries to derive each Time field's actual coverage.

**Status**: open — 2026-05-06.

---

### zpa-19 — `ServerSetupTime` scope (TCP only vs TLS end-to-end)

*Origin: `references/zpa/logs/access-log-schema.md` § State machine and timing*

`ServerSetupTime` is described as "Time in µs to set up the connection at the server." The wording is ambiguous between:

1. **TCP three-way handshake only** between App Connector and the application server (~1 RTT)
2. **TCP + TLS handshake** end-to-end if the application uses TLS (~3 RTT)
3. **TCP + TLS + first application-protocol exchange** (e.g., HTTP/1.1 first request-response or HTTP/2 SETTINGS exchange)

This affects how operators interpret the field for latency budgeting and how it composes with `ConnectionSetupTime` (see `zpa-18`). Affects RDP/SSH/HTTPS apps differently from plain TCP apps.

**Resolves with**: vendor doc, or lab measurement comparing `ServerSetupTime` against externally-measured TCP handshake duration on a non-TLS app vs TLS app.

**Status**: open — 2026-05-06.

---

### shared-07 — MCLS session-level stickiness

*Origin: `references/shared/multi-cluster-load-sharing.md` § Session affinity*

Whether the MCLS VIP pool provides per-flow stickiness (all packets of a single TCP flow land on the same service node), or whether a single flow can be distributed across nodes in different clusters. Impacts DLP large-object scanning and file reassembly accuracy.

**Status**: open
**Resolves with**: operator experience OR support ticket

---

### shared-08 — MCLS cross-cluster auth state replication

*Origin: `references/shared/multi-cluster-load-sharing.md` § Identity caching*

When a user authenticated at one service node is subsequently routed to a node in a different cluster within the MCLS pool, whether the CA re-query is transparent (no user re-prompt) or triggers a visible re-authentication event. Likely varies by auth method (IP surrogacy, cookie, Kerberos, SAML).

**Status**: open
**Resolves with**: operator experience OR support ticket

---

### shared-09 — MCLS VIP failure detection timeout

*Origin: `references/shared/multi-cluster-load-sharing.md` § Failure modes*

How long a ZCC or router-terminated GRE/IPSec tunnel takes to detect a full datacenter VIP failure before triggering failover or re-resolution. Not documented in MCLS or architecture vendor sources.

**Status**: open
**Resolves with**: operator experience OR support ticket
**Blocks**: accurate failover SLA documentation for MCLS deployments

---

### shared-10 — Z-Tunnel 2.0 interaction with MCLS

*Origin: `references/shared/multi-cluster-load-sharing.md` § Traffic distribution*

The MCLS documentation lists VPN VIPs but does not specify Z-Tunnel 2.0 explicitly. Whether Z-Tunnel 2.0 stateful TLS multiplexing interacts differently with cross-cluster LB forwarding compared to GRE/IPSec is unconfirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### shared-11 — Government cloud MCLS topology

*Origin: `references/shared/multi-cluster-load-sharing.md` § Constraints*

Whether `zscalergov` and `zspreview` clouds operate an equivalent MCLS model or a different cluster topology. Not documented in available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### shared-12 — Azure AD CA IP evaluation frequency

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

Whether Azure AD Conditional Access re-evaluates source IP on every HTTP request or only at token-issuance time. The SIPA config guide states post-auth traffic uses a token and "does not require being redirected through Source IP Anchoring," implying token-based evaluation, but the exact CA re-evaluation model is Microsoft's documentation responsibility.

**Status**: open
**Resolves with**: zscaler doc not yet read (Microsoft Entra ID / Azure AD CA documentation) — Microsoft-side behavior

---

### shared-13 — Azure AD CAE interaction with SIPA

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

Whether Azure AD Continuous Access Evaluation (CAE) in tenants with IP-binding policies imposes more-frequent re-authentication and what the implications are for SIPA-anchored connections. Not addressed in any Zscaler vendor source reviewed.

**Status**: open
**Resolves with**: zscaler doc not yet read (Microsoft CAE documentation + Zscaler SIPA guidance)

---

### shared-14 — SIPA fallback when all connectors are unhealthy

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

Whether the predefined `Fallback mode of ZPA Forwarding` ZIA forwarding rule routes SIPA-destined M365 traffic to PSE egress or drops it when all connectors in the designated SIPA connector group are unhealthy. The predefined rule exists (see `references/zia/forwarding-control.md`) but its exact fallback action for SIPA traffic is not source-confirmed.

**Status**: open
**Resolves with**: lab test OR operator experience
**Blocks**: accurate disaster-recovery documentation for SIPA deployments

---

### shared-15 — App Connector public IP sync to Azure AD Named Locations

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

Whether an automated mechanism exists (Zscaler-provided or third-party) to sync App Connector public IPs with Azure AD Named Locations when connector IPs change. Available vendor sources state this as operator responsibility only; no automation is documented.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### shared-16 — Azure AD Named Locations IP range cap

*Origin: `references/shared/m365-conditional-access.md` § Open questions*

The maximum number of IP ranges supported per Azure AD Named Location object. This is a Microsoft constraint, not Zscaler's, and was not captured in available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read (Microsoft Entra ID Named Locations documentation) — Microsoft-side constraint

---

### shared-17 — Public Service Edge selection algorithm

*Origin: chain-coverage review 2026-05-06 — request flow phase 3 (ZCC tunnel → Service Edge selection)*

When a ZCC client establishes its tunnel, it connects to "the nearest Public Service Edge" — but the actual selection signals are not laid out in any captured Zscaler documentation. Operators investigating routing surprises ("traffic landing on a far-away Service Edge despite a closer one being available") need to know:

1. **Selection signals** — Anycast-based BGP, geo-IP lookup of the ZCC client public IP, latency probing from ZCC, datacenter exclusion lists, tenant-pinned-cloud assignments, or some combination?
2. **Failover behavior** when the selected Service Edge is unhealthy or congested — automatic re-selection? How fast? Cached for some duration?
3. **Manual override hierarchy** — admin-pinned Service Edge in App Profile / Forwarding Profile vs ZCC's auto-selection; what wins?
4. **Subcloud interaction** — for tenants assigned to a specific subcloud (e.g., `zscloud.net` vs `zscaler.net`), does selection happen within the subcloud's edge set only, or can ZCC fall back to a parent-cloud edge?
5. **Government cloud / Air-gapped cloud restrictions** — `zscalergov` and `zscalerten` likely have stricter edge-set boundaries; not documented.

This affects two operational questions: "why is user X's traffic on Service Edge Y instead of Z?" and "what happens when the customer's preferred edge is in a known outage?".

**Doc sweep 2026-05-06** (partial resolution):

- `vendor/zscaler-help/what-is-zscaler-client-connector.md` § Service Edge Selection and Re-evaluation: ZCC "regularly checks whether the current Public Service Edge is still optimal." Triggers documented: regular intervals (duration unspecified), network change (e.g., user moves Wi-Fi), app or device restart. Override options exist (specifics not extracted).
- `references/shared/cloud-architecture.md` explicitly states: "Zscaler's 'advanced geo-IP resolution' routes traffic to the nearest edge; the algorithm itself isn't customer-documented." This is the architectural confirmation that the gap is real and Zscaler-side rather than a doc-capture miss.
- `vendor/zscaler-help/zscaler-resilience-marketing.md` mentions "dynamic service edge selection and customer-controlled data center exclusion" as the brownout/blackout mitigation — confirming both autonomous selection and a customer-override mechanism (DC exclusion) exist, but doesn't specify either.
- **Subcloud interaction is fully resolved** by `references/shared/subclouds.md` (Tier A, sourced from `vendor/zscaler-help/understanding-subclouds.md`):
  - **Default Zscaler PSE selection is geolocation-based** — explicit statement in `subclouds.md`.
  - **Subclouds OVERRIDE default geolocation selection entirely** — they restrict the eligible edge set to a named subset; geolocation no longer applies once a subcloud is in effect.
  - **Constraint**: a subcloud cannot consist of PSEs in a single data center (≥ 2 DCs required for availability).
  - **Mechanism**: clients resolve subcloud-qualified hosted-PAC variables (e.g., `gateway.subcloud.zscaler.net`) — there is no "preferred region" toggle separate from the subcloud abstraction.
  - **Reasons**: GDPR/data-residency, private-DC-enforcement, surcharge-region opt-in.

**Resolved by sweep**:

- Trigger events that cause re-evaluation (regular intervals + network change + app/device restart).
- Existence of both autonomous and customer-override paths.
- **Subcloud-vs-default behavior** — subclouds REPLACE default geolocation selection within the subcloud's edge set; not a tie-break, not a preference, full override.
- Subcloud minimum-DC constraint (≥ 2 DCs).

**Still open after sweep**:

- Specific selection signals within the eligible edge set (Anycast vs latency probe vs geo-IP — likely a combination but unweighted).
- Re-evaluation interval duration.
- Failover timing on edge unhealth.
- DC-exclusion mechanism details — admin-portal location, per-tenant or per-app-profile, interaction with subclouds.
- Government cloud (`zscalergov`, `zscalerten`) edge-set restrictions — likely stricter than commercial subcloud rules but unverified.

**Resolves the rest with**: vendor doc on the selection algorithm and DC-exclusion mechanism, or lab observation across forced failure scenarios. **Status**: partially resolved — 2026-05-06.

---

### shared-18 — End-to-end authentication timeline across the request chain

*Origin: chain-coverage review 2026-05-06 — request flow phase 4 (Service Edge ingress + auth)*

The skill has individual refs covering pieces of the auth timeline (`zia/authentication.md` for the auth gate and frequency model, `zia/locations.md` for surrogate IP, `shared/oneapi.md` for OAuth, ZIdentity refs for step-up) but no consolidated walk-through of when each event fires across a request's lifetime.

**Doc sweep 2026-05-06** (partial resolution):

`references/zia/authentication.md` already covers more than the original framing assumed:

- **Auth-frequency enum is fully documented** with cookie semantics: `ALWAYS` (per browser session, cookie discarded at close), `DAILY_COOKIE` (1 day), `WEEKLY_COOKIE`, `MONTHLY_COOKIE`, `CUSTOM_FREQUENCY` (1–180 days via `authCustomFrequency`). Cited from `authentication_settings.py:41-42, 243`.
- **Surrogate IP TTL fields documented**: `idle_time_in_minutes` (TTL for IP-to-user binding), `surrogate_refresh_time_in_minutes` (revalidation interval), `surrogate_refresh_time_unit` (`MINUTE` / `HOUR` / `DAY`), `surrogate_ip_enforced_for_known_browsers` (force browsers to also re-auth via cookie).
- **Dependency rules** enforced at TF plan time: `surrogate_ip = true` requires `idle_time_in_minutes > 0` AND `auth_required = true`; `surrogate_ip_enforced_for_known_browsers = true` requires `surrogate_ip = true`.
- **Cookie lifetime applies only to browser flows**: non-browser UAs can't follow SAML redirects; alternative paths (Kerberos, no-auth locations, pre-auth proxy) documented.

**Resolved by existing refs**: auth-frequency enum and clock semantics (cookie expiry-based), surrogate IP TTL field names and dependency rules, browser-vs-non-browser flow split.

**Step-up timing — resolved 2026-05-06** by `vendor/zscaler-help/understanding-step-up-authentication-zidentity.md`:

The step-up flow is **synchronous on the access attempt**:

> When the user attempts to access a high-sensitivity resource (as defined by policies in Internet & SaaS or Private Access), ZIdentity checks the required authentication level. If the user's current authentication level is insufficient (e.g., they logged in with a basic password), ZIdentity prompts the user to reauthenticate, typically using MFA via Zscaler Client Connector. After the user successfully authenticates with the required level, access is granted.

So the request blocks until the user completes the higher-AL authentication. The flow: user attempts access → ZIdentity AL check → if insufficient → prompt via ZCC → user MFA → access granted. Constraint: **OIDC-only** (SAML IdPs do not support step-up). The cross-link in `references/zidentity/step-up-authentication.md` already captures this; updated this clarification to point at the full vendor source.

**Still open after sweep**:

1. **Surrogate IP `idle_time_in_minutes` clock anchor** — does the idle clock start at last activity (so any traffic from the IP within the window resets it), at first auth, or at some other event? Field name implies idle-based, but unconfirmed.
2. **Cookie/token/IP auth-source decision tree** — when the Service Edge has multiple usable auth sources for the same request (ZCC tunnel auth + surrogate IP + SAML cookie), the precedence isn't documented.
3. **Re-auth on traffic-forwarding-method transitions** — ZCC moving on-trusted → off-trusted mid-session: does existing auth state survive?

**Resolves the rest with**: scripted reproduction (force trusted-network transition mid-session, observe whether re-auth fires; load-test surrogate IP at varying activity intervals to confirm idle-clock semantics), or vendor support thread. **Status**: partially resolved — 2026-05-06 (step-up timing now resolved; auth-source decision tree and trusted-network-transition behavior remain).

---

### shared-19 — Modern HTTP response-side re-evaluation (HTTP/2, WebSocket, HTTP/3, streaming RPC)

*Origin: chain-coverage review 2026-05-06 — request flow phase 9 (response path)*

`shared/policy-evaluation.md` documents the ZIA web module pipeline order for HTTP GET, POST, and Response (per *Understanding Policy Enforcement* pp.3–9). The pipeline order assumes a classical request/response model. Modern HTTP behaviors are partially documented across multiple refs but not consolidated.

**Doc sweep 2026-05-06** (substantial partial resolution):

**HTTP/3 / QUIC** — `references/zia/saas-app-quirks.md` § 6 has the canonical answer:

- ZIA's TLS inspection relies on TCP session state.
- Under explicit-proxy forwarding, QUIC bypasses the proxy entirely.
- Z-Tunnel-mode interaction:
  - **Z-Tunnel 2.0** (packet-tunnel) captures UDP 443 — QUIC is intercepted at the tunnel layer.
  - **Z-Tunnel 1.0** (HTTP CONNECT) does not capture UDP — QUIC traffic egresses outside the tunnel.
- Zscaler's recommendation: **block QUIC at the firewall** so browsers fall back to TCP/TLS (which can then be inspected). Cited from *Leading Practices Guide* p.24, *CAC Deployment Guide* troubleshooting section, and `references/zia/ssl-inspection.md`.

**HTTP/2** — `references/zia/ssl-inspection.md` documents:

- **Per-rule `http2Enabled` toggle** on the SSL Inspection rule controls whether HTTP/2 inspection is enabled.
- **Falls back to HTTP/1.1 for locations where Bandwidth Control is also enabled**, even if HTTP/2 is on in the SSL/TLS rule. Concrete operational gotcha.
- Inspection capability exists; per-stream re-evaluation behavior not stated.

**WebSocket** — `references/zia/dlp.md` § 5 has a sharply-scoped answer:

- **WebSocket DLP inspection is Microsoft-Copilot-only.** The WebSocket protocol option for DLP inspection works exclusively for Microsoft Copilot. Adding WebSocket as a protocol expecting it to cover other WebSocket-heavy apps (Slack, Figma, Linear, Notion) yields **zero coverage** for those apps. WebSocket SSL/TLS DLP is similarly Copilot-only. Cited from *Configuring DLP Policy Rules and Content Inspection* line 166.

**Resolved by sweep**:

- QUIC handling end-to-end (recommendation: block at firewall; ZTunnel-mode interaction)
- HTTP/2 enable toggle + Bandwidth Control fallback gotcha
- WebSocket DLP scope (Copilot-only) — answers "does DLP see Slack/Figma WebSocket traffic" with a defensible "no"

**Still open after sweep**:

1. **HTTP/2 per-stream inspection** — when `http2Enabled=true`, is each stream re-evaluated against the response pipeline independently, or is the connection inspected once at upgrade? HPACK header decompression behavior at inspection time also unstated.
2. **WebSocket inspection beyond DLP** — DLP is Copilot-only, but does URL Filter, Cloud App Control, Sandbox, or Malware Protection apply to WebSocket frames for *any* app? Or is the entire WebSocket pipeline post-upgrade L4-byte-forwarding except for the Copilot-DLP carveout?
3. **gRPC / streaming RPC** — gRPC runs over HTTP/2 with binary protobuf framing. DLP-scannable? Treated as opaque bytes? No captured doc addresses this.
4. **Server-Sent Events** (`text/event-stream`) — re-evaluated per event or one-time at connection?
5. **Chunked transfer encoding** — does DLP accumulate chunks for full-payload analysis or scan per-chunk?

**Resolves the rest with**: vendor doc (likely lives in help articles not yet captured) or controlled lab tests with known-payload WebSocket non-Copilot, HTTP/2 multi-stream, and gRPC traffic. **Status**: partially resolved — 2026-05-06.

---

### shared-20 — Cross-PSE session state on customer-side LB failover (GRE source IP change mid-session)

*Origin: chain-coverage soft-test 2026-05-06 — Cloud Connector + 185.x GRE + customer F5 geo-LB walkthrough*

When customer-side architecture introduces multiple GRE-source-IP egress paths (e.g., F5 BIG-IP geo-LB fronting two routers, each terminating its own GRE tunnel to ZIA), a mid-session failover from Router A to Router B changes the GRE source IP that ZIA sees. The skill has good coverage of the building blocks but no single ref addresses the **session-state implications across PSEs** when this happens. Specifically:

1. **Surrogate IP binding survival** — `surrogate_ip` binding is per-(PSE, source-IP) tuple. When the source IP changes, what happens to the existing binding? Is it invalidated immediately on the original PSE? Does the new PSE see a "new user" until re-auth?
2. **Cross-PSE session continuity** — if Router A's primary GRE goes to PSE-DC-A and Router B's goes to PSE-DC-B, a mid-stream failover lands the next packet at a different Service Edge. Does the original PSE's TCP/policy state replicate to the new PSE, or does the session effectively reset from ZIA's perspective?
3. **Long-lived flow handling** — for a stateful client (HTTP/2 multi-stream, WebSocket, gRPC streaming) in flight when failover happens, what behavior does the user perceive? Cleanly reset, silent drop, or continuation if the client tolerates source-IP changes?
4. **Interaction with `shared-07` / `shared-08` / `shared-09`** — those clarifications cover MCLS (multi-cluster within a DC); this is the *cross-DC* failover case driven by customer-side LB topology, which MCLS doesn't address.

This is the canonical "HA-on-HA stacking" question: customer's HA design (F5 + redundant routers) interacts with Zscaler's HA design (multi-PSE / per-DC GRE VIPs) in ways neither side documents.

**Resolves with**: lab test driving deliberate mid-session F5 failover with active flows (long curl, persistent SSH, WebSocket app) and observing the ZIA-side behavior — re-auth, session reset, or continuation. Plus vendor doc on cross-PSE state replication. **Status**: open — 2026-05-06.

---

### shared-21 — Anonymous-workload identity treatment at the Service Edge (Cloud Connector flow)

*Origin: chain-coverage soft-test 2026-05-06 — Cloud Connector flow walkthrough*

`references/zia/workload-groups.md` documents Workload Groups as the policy-scope primitive for Cloud Connector traffic — workload-tag-based attribution replaces the user-identity-based attribution that ZCC traffic carries. But the **Service Edge ingress behavior for traffic without a user identity** is not laid out:

1. **Auth gate behavior** — `zia/authentication.md` says auth runs before all other policies. For a workload session arriving via CC's GRE/IPSec tunnel with no user identity to authenticate, does the auth gate skip (workload tag is sufficient), block (non-browser UA fails SAML), or apply a different mechanism? Per-location `auth_required` setting on the CC-fronted location should make this configurable but the actual handling isn't documented.
2. **Surrogate IP behavior on workload IPs** — does a CC-fronted location with `surrogate_ip = true` bind workload identity to source IP? If multiple workloads share a CC's NAT IP, is the binding shared (correct for traffic-volume attribution but wrong for per-workload policy)?
3. **Auth-frequency setting interaction** — workload sessions are typically long-lived (microservice keepalives, persistent connections). What does `MONTHLY_COOKIE` or `ALWAYS` mean for a session that has no user-side cookie?
4. **NSS feed identity-field population** — the `cloud-connector/logs/log-schema.md` ref lists fields like `login`, `dept`, `deviceowner`, `devicehostname` from the ZIA firewall log schema. For workload traffic with no user identity, are these fields empty, populated with a workload-derived value, or populated with a tag-derived stub?

This matters operationally because operators investigating "why is workload X being blocked by ZIA" need to know whether the blocking subsystem evaluated a user-identity-scoped rule that didn't match (because workloads have no user) or a workload-group-scoped rule (which should match).

**Resolves with**: tenant lab walkthrough — deploy a CC, send known workload traffic, observe: (a) auth gate behavior at the per-location setting, (b) NSS feed field population for the workload session, (c) whether Surrogate IP fires. Plus vendor doc consolidating workload identity semantics (the skill currently has it spread across `zia/workload-groups.md` + `zia/authentication.md` + `zia/locations.md`). **Status**: open — 2026-05-06.

---

### shared-22 — Cross-DC log correlation for sessions spanning multiple PSEs

*Origin: chain-coverage soft-test 2026-05-06 — F5 geo-LB walkthrough surfaced multi-DC session traversal*

`references/shared/log-correlation.md` documents joining ZIA web/firewall/DNS logs to ZPA LSS using `epochtime` + `login` (or `Username`) within a tolerance window, and identifies `zpa_app_seg_name` as the highest-fidelity ZIA→ZPA join field for SIPA. It does **not** address the case where a single user's traffic, within one logical session, lands on **multiple PSEs in different datacenters** (driven by customer-side LB failover, mobile users moving between Wi-Fi networks, or BGP-induced VIP changes). Specific gaps:

1. **PSE-discriminator field** — the `datacenter` field exists in all ZIA NSS feeds, but is it the correlation key for "same user, different DC, same logical session"? Or does the customer SIEM need to reconstruct logical sessions by user + time-window across multiple `datacenter` values?
2. **`recordid` scope** — is `recordid` globally unique across all PSEs (so deduplication across feeds is safe), or per-PSE (so the same `recordid` could appear in two records from different DCs)?
3. **Session-ID-equivalent** — ZIA web logs have no documented session ID; firewall logs have aggregation flags but no session ID either. For "trace this user's full activity across a 30-second F5-failover window" the join key set is unclear.
4. **Cross-PSE Surrogate IP gap** — if Surrogate IP binding doesn't replicate cross-PSE (per `shared-20`), a logical session could appear as two different "users" in the logs after failover (the original IP-bound identity, then anonymous/re-auth on the new PSE).

For SOC analysts reconstructing user activity during incident response, this gap means investigations spanning multiple PSEs may silently undercount or mis-attribute activity unless the SIEM reconstruction logic explicitly handles cross-DC session bridging.

**Resolves with**: tenant lab — drive a deliberate multi-PSE session (e.g., force trusted-network transition or simulate F5 failover), capture NSS feeds from both PSEs, attempt reconstruction. Plus vendor doc on per-record uniqueness guarantees for `recordid`. **Status**: open — 2026-05-06.

---

### shared-23 — WPAD (Web Proxy Auto-Discovery) support with Zscaler-hosted PACs

*Origin: `references/shared/pac-files.md` § WPAD review 2026-05-06*

Many enterprises rely on WPAD for automatic PAC URL distribution to clients — DNS-based (`http://wpad.<domain>/wpad.dat`) or DHCP option 252. Zscaler's available help-portal captures **do not document**:

1. Whether the Zscaler-hosted PAC URL can be served at a `wpad.dat` path or with the `application/x-ns-proxy-autoconfig` MIME type that some browsers require for WPAD discovery.
2. Whether DHCP option 252 is a supported delivery mechanism for the Zscaler-hosted PAC URL.
3. Whether the Zscaler PAC server returns variable-substituted content when fetched as `wpad.dat` (likely yes — substitution is URL-pattern-agnostic — but unconfirmed).
4. Whether redirect-based WPAD (customer's `wpad.<domain>` returning a 302 to the Zscaler-hosted PAC) preserves variable substitution (browser ultimately fetches from Zscaler, so probably yes — but unconfirmed).

This matters because tenants relying on WPAD often default to self-hosting (which loses variable substitution and geolocation) when the Zscaler-hosted PAC URL pattern doesn't fit their WPAD infrastructure.

**Resolves with**: vendor doc on WPAD compatibility or testing the documented workarounds (rename the Zscaler PAC URL to `wpad.dat` via DNS CNAME, observe browser behavior). **Status**: open — 2026-05-06.

---

### shared-24 — Zscaler-hosted PAC cache headers and client refresh behavior

*Origin: `references/shared/pac-files.md` § PAC fetch frequency review 2026-05-06*

`pac-files.md` states "PAC changes are immediate" (server-side) but acknowledges that client-side propagation is gated by browser caching. The specific behavior is undocumented:

1. **Cache-Control / Expires headers** sent by the Zscaler PAC server are not in any captured doc. Operationally observed: PAC changes can take **minutes to ~1 hour** to fully roll out; the bound depends on these headers.
2. **ZCC PAC mode refresh cadence** — when ZCC is in PAC mode (vs Z-Tunnel mode), how often does it re-fetch the PAC? Does ZCC respect HTTP cache headers like a browser, or use its own poll schedule?
3. **Force-refresh mechanism** — is there an admin-portal action that pushes PAC re-fetch to clients (vs waiting for cache expiry)? None documented.
4. **Versioned-URL semantics** — if a PAC is rolled back to a prior version, do clients holding the cached newer version see the rollback only after their cache expires?

For incident response — "we just rolled back a bad PAC, when do we know it's actually deployed everywhere?" — current answer is "wait an hour and check Number-of-Hits." A documented refresh window would be more useful.

**Resolves with**: HTTP HEAD request against a Zscaler-hosted PAC URL to inspect actual cache headers (operator-side), or vendor doc. **Status**: open — 2026-05-06.

---

### shared-25 — PAC-mode authentication handshake specifics

*Origin: `references/shared/pac-files.md` § PAC mode authentication review 2026-05-06*

The high-level auth methods (SAML SSO / Hosted DB / Kerberos) and the Surrogate IP mechanic are well-documented in `references/zia/authentication.md`. What's not documented is the **PAC-mode-specific handshake sequence**:

1. **407 Proxy-Authentication challenge handling** — when a non-cookie-bearing client (curl, script, non-browser) hits the PSE via a PAC-resolved proxy, does the PSE issue a 407 challenge or a 302 SAML redirect? Browser response to each differs; non-browser HTTP clients often fail on either.
2. **Cookie domain / scope** — the ZIA session cookie issued on SAML completion is scoped to the PSE's domain. In PAC mode (where each request hits a `PROXY h:80` resolution), how is the cookie attached to subsequent requests? Browsers handle this transparently but the cookie domain rules aren't documented.
3. **Repeated-challenge symptom in PAC mode vs Z-Tunnel** — operators commonly report that the same user gets re-challenged for auth more frequently in PAC mode than in Z-Tunnel mode for identical traffic. The operational lore is "Surrogate IP + per-location auth-frequency works differently across the two modes" — exact mechanism unconfirmed.
4. **Kerberos challenge port (8800) interaction with non-`kerberos.pac` PAC files** — what happens when a Kerberos-eligible user is on a PAC that returns `:80` instead of `:8800`? Silent fallback to other auth method, or block?

**Resolves with**: instrumented packet capture during a fresh PAC-mode session (force re-auth scenarios), or vendor doc consolidating PAC-mode auth specifics. **Status**: open — 2026-05-06.

---

### shared-26 — Non-browser HTTP client PAC support — Zscaler-side recommendations

*Origin: `references/shared/pac-files.md` § PAC behavior with non-browser HTTP clients review 2026-05-06*

The non-browser-client PAC support matrix is well-known operationally but not Zscaler-documented:

- `curl`, Python `urllib`, Node.js default agent, `apt`, `yum`, Docker, Kubernetes — none have native PAC support.
- Java `HttpURLConnection`, .NET `HttpClient` — partial PAC support via system PAC URL on supported OSes.

The skill's existing material correctly identifies Cloud Connector as the workload-traffic forwarding answer, but the **PAC-vs-CC decision boundary** for environments running both browser users and non-browser workloads is not laid out as Zscaler-side guidance. Specific gaps:

1. Does Zscaler publish guidance on "for these client classes, use proxy-URL config instead of PAC" or "use Cloud Connector for workload traffic"?
2. For environments where Cloud Connector isn't deployed but workload traffic must traverse Zscaler, is there a recommended lightweight pattern (explicit proxy URL pointing at hosted-PAC-resolved-`${GATEWAY}` IP)? Such IPs change over time as Zscaler scales — fragile.
3. For tenants on subclouds, the workload-pinned proxy URL has to use the subcloud-qualified hostname; is there a documented pattern?

**Resolves with**: vendor doc consolidating recommendations for non-browser-client traffic forwarding, or admission that PAC + workload-traffic is operationally a gap that Cloud Connector is the only Zscaler-supported answer for. **Status**: open — 2026-05-06.

---

### shared-27 — Zscaler PAC + IPv6 handling

*Origin: `references/shared/pac-files.md` § PAC + IPv6 review 2026-05-06*

The standard PAC `isInNet` is IPv4-only; the IPv6-aware `isInNetEx` extension exists but support is browser-dependent. Zscaler-side IPv6 handling in PAC is undocumented:

1. **Variable substitution for IPv6** — do `${GATEWAY}` / `${SECONDARY_GATEWAY}` ever resolve to IPv6 addresses? If so, in which clouds / subclouds? If never, IPv6 traffic hitting a PAC-returned IPv4 PROXY directive will fail at the OS network layer.
2. **PSE IPv6 endpoint availability** — do Zscaler Public Service Edges accept IPv6 ingress on the standard PAC-returned ports? `references/cloud-connector/azure-deployment.md` notes that "1:1 NAT disables IPv6" on the CC side — analogous behavior on the PSE side?
3. **Recommended IPv6-bypass pattern** — what's the canonical PAC pattern for tenants with dual-stack networks who want IPv6 to bypass Zscaler? `if (host.indexOf(":") !== -1) return "DIRECT";` is the operationally-conservative fallback (Tier C in `pac-files.md`); a Zscaler-recommended pattern would be more authoritative.
4. **`isInNetEx` browser support matrix** — Zscaler-side recommendations for tenants whose user populations include browsers that don't support `isInNetEx`.

For tenants with growing IPv6 deployments (especially in mobile/cellular and APAC environments where IPv6 is increasingly default), this is an operational concern.

**Resolves with**: vendor doc on IPv6 PAC support / PSE IPv6 ingress, or experimental verification by attempting IPv6-only PAC fetch and observing variable substitution behavior. **Status**: open — 2026-05-06.

---

### shared-28 — Python ZIA SCIM wrapper surface

*Origin: `references/shared/scim-provisioning.md` § Open questions*

The 2026-06-16 shared SCIM refresh verified function-level Go SDK SCIM user/group surfaces and Python ZPA SCIM read surfaces, but did not establish a Python SDK ZIA SCIM provisioning wrapper in the pinned source. Future Python SDK releases may add one, so answers should avoid saying "Python cannot do this" as a product fact. Say instead that this source set verifies the Go SDK SCIM provisioning functions and the REST endpoint surface, and advise Python callers to use direct HTTP or confirm their installed SDK release.

**Status**: open — 2026-06-16
**Resolves with**: code read of the current Python SDK package / generated docs index for ZIA SCIM wrappers, plus line-level citations to any discovered module

---

### shared-29 — ZInsights GraphQL rate limits

*Origin: `references/shared/analytics-graphql.md` § Open questions*

The ZInsights GraphQL endpoint is captured as `https://api.zsapi.net/zins/graphql`, but the rate-limit guide does not list a ZInsights-specific bucket. Whether GraphQL shares a Business Insights or ZIA analytics bucket, has its own bucket, and which response headers expose rate-limit state is unresolved.

**Status**: open — 2026-06-16
**Resolves with**: vendor ZInsights rate-limit documentation or a live 429 capture for `/zins/graphql`

---

### shared-30 — ZInsights production introspection support

*Origin: `references/shared/analytics-graphql.md` § Open questions*

The captured guide documents GraphQL introspection support for the Beta cloud environment only (`vendor/zscaler-help/automate-zscaler/guides-analytics-api.md:31`). Production introspection is not confirmed by this source set; clients should assume it is unavailable unless vendor documentation or a live production test confirms an exception.

**Status**: open — 2026-06-16
**Resolves with**: vendor documentation for production introspection behavior or a live production introspection response capture

---

### shared-31 — ZInsights pagination and truncation behavior

*Origin: `references/shared/analytics-graphql.md` § Open questions*

Captured examples show per-query `limit` arguments but do not show cursor, offset, or total-count pagination. Whether `limit` is the complete pagination model, whether result sets truncate silently, and whether a maximum `limit` exists are unresolved.

**Status**: open — 2026-06-16
**Resolves with**: vendor GraphQL pagination docs or live query tests over a dataset large enough to exceed default and explicit limits

---

### shared-32 — ZInsights `obfuscated` flag source setting

*Origin: `references/shared/analytics-graphql.md` § Open questions*

The GraphQL schema exposes `obfuscated` fields on several response shapes, but the captured source does not identify which tenant privacy setting or report configuration flips the flag. Callers should display the flag defensively and avoid treating masked names as real entity names.

**Status**: open — 2026-06-16
**Resolves with**: vendor privacy-setting documentation tied to ZInsights responses or tenant tests toggling the relevant setting

---

### shared-33 — ZInsights IoT `device_stats` time range

*Origin: `references/shared/analytics-graphql.md` § Open questions*

The multi-domain GraphQL example calls IoT `device_stats` without explicit time-range arguments while most other analytics queries use `start_time` and `end_time`. Whether `device_stats` is time-agnostic or applies an implicit default window is unresolved.

**Status**: open — 2026-06-16
**Resolves with**: vendor IoT domain argument documentation or live queries comparing `device_stats` results across controlled time windows

---

### shared-34 — ZDX trend linkage to ZInsights GraphQL

*Origin: `references/shared/analytics-graphql.md` § Open questions*

The captured ZInsights GraphQL domain list does not include ZDX, and the OneAPI Postman collection exposes ZDX REST trend endpoints for application metrics and device application score trends. The unresolved question is whether any ZDX dashboard uses ZInsights behind the scenes, or whether ZDX trend access is REST-only in the captured public API surface.

**Status**: open — 2026-06-16
**Resolves with**: vendor documentation that maps ZDX dashboards to ZInsights GraphQL, or confirmation that ZDX trend data is exposed only through `/zdx/v1` REST endpoints

---

### shared-35 — ZInsights mutation support

*Origin: `references/shared/analytics-graphql.md` § Open questions*

The introspection query template asks for `mutationType { name }`, but the captured docs provide no introspection output showing mutation fields and no mutation examples. Whether any write operations exist is unresolved.

**Status**: open — 2026-06-16
**Resolves with**: introspection output showing mutation fields plus vendor docs or live tests confirming their behavior

---

### shared-36 — `WebTrafficUnits` `BYTES` validity

*Origin: `references/shared/analytics-graphql.md` § Open questions*

Captured analytics guide examples show `TRANSACTIONS` for `WebTrafficUnits`, but this pass did not find source confirmation that `BYTES` is a valid enum value. SaaS Security UI/reporting exposes byte counters, so `BYTES` is plausible, but it remains unsupported as a GraphQL enum claim.

**Status**: open — 2026-06-16
**Resolves with**: schema introspection output listing `WebTrafficUnits` enum values or a successful live query using `BYTES`

---

### shared-37 — Cross-product Trace ID propagation

*Origin: `references/shared/audit-logs.md` § Open questions*

ZIA audit logs include a Trace ID column, but this pass did not find source confirmation that the same OneAPI Trace ID is present in ZPA, ZIdentity, ZWA, ZDX, or ZCC audit contexts. Until confirmed, cross-product Trace ID correlation should be treated as an investigation candidate rather than a guaranteed join key.

**Status**: open — 2026-06-16
**Resolves with**: vendor audit schema docs or live audit samples showing the same Trace ID across products for one API client action

---

### zcc-08 — ZCC 429 response body shape

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

The exact JSON body shape of ZCC 429 responses — whether the body contains a `message`, `code`, or `Retry-After` field. The vendor doc (`legacy-understanding-rate-limiting-zcc.md`) describes only the `X-Rate-Limit-Retry-After-Seconds` header; response body is not documented.

**Status**: open
**Resolves with**: lab test (trigger a rate limit; inspect the response body)

---

### zcc-09 — Download endpoint rate limit pool scope

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

Whether the 3 calls/day cap for download endpoints (`/downloadDevices`, `/downloadServiceStatus`, `/downloadDisableReasons`) is a combined pool across all three or a per-endpoint cap of 3 each. The vendor doc describes "3 API calls per day" for the group; the Python SDK comment implies per-endpoint; the scoping is not authoritatively confirmed.

**Status**: open
**Resolves with**: lab test OR support ticket

---

### zcc-10 — `X-Rate-Limit-Remaining` header presence on 2xx responses

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

Whether `X-Rate-Limit-Remaining` is present on every ZCC response (proactive header) or only on 429 responses. The vendor doc describes the header in the context of rate-limit enforcement but does not state whether it appears on all 2xx responses.

**Status**: open
**Resolves with**: lab test

---

### zcc-11 — `/forceRemoveDevices` UDID batch size cap

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

The maximum number of UDIDs accepted per `/forceRemoveDevices` or `/removeDevices` call. Not documented in the vendor help or SDK source; the SDK accepts an arbitrary list with no visible client-side cap.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-12 — `RequestExecutor` ZCC rate-limit retry behavior

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

Whether the `RequestExecutor` (shared OneAPI SDK transport) automatically reads and honors `X-Rate-Limit-Retry-After-Seconds` on the modern ZCC API path, or whether only `LegacyZCCClientHelper` implements the retry behavior. Not confirmed from available SDK source.

**Status**: resolved (2026-06-15) — confirmed YES. `RequestExecutor.get_retry_after()` explicitly reads `X-Rate-Limit-Retry-After-Seconds` (then `X-Rate-Limit-Remaining`) under the inline comment "ZCC Specific Rate Limiting Headers (LegacyZCCClientHelper)" (`vendor/zscaler-sdk-python/zscaler/request_executor.py:907,913–915`); `is_retryable_status()` includes 429 (`request_executor.py:745`); default `maxRetries=2` from `config["client"]["rateLimit"]` (`request_executor.py:82`). The modern OneAPI path therefore backs off on the ZCC header. Documented in `references/zcc/api-rate-limits.md § 5`.
**Resolves with**: code read (inspect `RequestExecutor` in the Python SDK for rate-limit header handling) — done

---

### zcc-13 — Rate limit bucket scope: per-IP vs per-credential

*Origin: `references/zcc/api-rate-limits.md` § Open questions*

Whether the 100 calls/hour limit applies per IP address only, or also per API credential pair — i.e., whether two different API keys from the same IP share the same bucket or maintain separate budgets. The vendor doc states "per IP address" with no mention of per-credential sub-buckets.

**Status**: open
**Resolves with**: lab test OR support ticket

---

### zcc-14 — macOS preference domain for ZCC managed preferences

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

The exact preference domain for ZCC managed preferences (the CFBundleIdentifier string used in MDM `PayloadType` or a Jamf plist). The primary vendor doc ("Customizing ZCC with Install Options for macOS") redirected at capture time; the domain was not confirmed in the fallback source.

**Status**: open
**Resolves with**: zscaler doc not yet read (primary macOS customization article or current Zscaler Jamf/Intune deployment guide)

---

### zcc-15 — System Extension profile timing on macOS

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether a reboot is required if a System Extension MDM profile arrives after the ZCC package install (rather than before or simultaneously). macOS behavior varies by version; not confirmed in captured sources.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-16 — ZCC macOS uninstall script path

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

The exact path to the Zscaler-provided uninstall script on macOS. The primary vendor doc was unavailable at capture time; path is typically inside the app bundle but not confirmed from available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-17 — `launchTray = 0` vs system extension activation

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether `launchTray = 0` prevents only the tray UI (menu bar icon) or also prevents system extension activation and tunnel establishment. Not disambiguated in the parameters vendor doc.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-18 — App Store ZCC MDM managed preferences

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether the App Store-distributed ZCC build accepts managed preferences via MDM (plist/managed-app-config) the same way as the `.pkg` build. Not addressed in captured vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-19 — ZCC Team ID and System Extension bundle identifier

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

The current Team ID and System Extension bundle identifier for the ZCC release in use. Version-specific; must be obtained from the installed package or current Zscaler Jamf/Intune deployment guide.

**Status**: open
**Resolves with**: operator experience (inspect installed package) OR zscaler doc not yet read (current deployment guide)

---

### zcc-20 — Full Disk Access PPPC requirement scope

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether Full Disk Access via PPPC (Privacy Preferences Policy Control) is required for all ZCC features or only for specific features such as endpoint DLP and certain posture checks. Not enumerated in captured vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read (macOS deployment guide)

---

### zcc-21 — Minimum supported macOS version

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

An explicit vendor statement of the minimum supported macOS version for ZCC. Not found in captured vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read (ZCC release notes or system requirements article)

---

### zcc-22 — macOS update channel plist key

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

Whether a portal-side plist key controls which macOS ZCC update channel (stable vs. early-access ring) is applied to a device. Not found in captured vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read

---

### zcc-23 — System Extension behavior after `launchTray = 0` on macOS 13+

*Origin: `references/zcc/macos-install-customization.md` § Open questions*

The confirmed behavior of the ZCC System Extension after `launchTray = 0` on macOS 13+ with Login Items management restrictions, which can suppress system extensions at MDM policy boundaries. Not addressed in the vendor parameters doc.

**Status**: open
**Resolves with**: lab test (deploy with `launchTray = 0` on macOS 13+; verify tunnel state independently of UI presence) OR operator experience

---

### zcc-24 — Notification Templates schema and options

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

The field schema for Notification Templates — supported languages, branding/customization options, and whether templates can be scoped per App Profile. The vendor help doc references "Configuring Notification Templates for Zscaler Client Connector" as a related article, but that article was not captured.

**Status**: open
**Resolves with**: zscaler doc not yet read ("Configuring Notification Templates for Zscaler Client Connector")

---

### zcc-25 — Per-App-Profile ZPA reauthentication interval override

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether the global "Show ZPA Reauthentication Notifications Every (In Minutes)" setting can be overridden per App Profile / Web Policy. Not found in the Web Policy SDK model fields or vendor App Profile help doc.

**Status**: open
**Resolves with**: code read (inspect WebPolicy SDK model for a reauthentication-interval field) OR lab test

---

### zcc-26 — AUP multi-language support

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether the ZCC AUP tab supports per-locale templates or only a single HTML blob. Not described in `configuring-acceptable-use-policy-zscaler-app.md`; the Notification Templates doc (not yet captured) may address this.

**Status**: open
**Resolves with**: zscaler doc not yet read (Notification Templates doc)

---

### zcc-27 — Posture-failure OS-level notification

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether ZCC emits a distinct OS-level toast notification when a device posture check fails, or only updates in-app status. Not described in the vendor notification doc; posture failure is not listed as a toast trigger in reviewed sources.

**Status**: open
**Resolves with**: lab test (trigger a posture failure; observe OS notification center) OR zscaler doc not yet read

---

### zcc-28 — Certificate trust failure notification type

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether ZCC emits a ZCC-level OS toast or only a macOS/Windows system-level certificate error dialog when a certificate cannot be trusted. The event type is listed in the vendor notification overview but the exact UX is not confirmed.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-29 — Notification delivery logging

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether "notification shown," "user dismissed," or "AUP acknowledged" events appear in any Zscaler cloud log feed (ZIA analytics, ZPA analytics, ZCC audit, NSS). Not addressed in any reviewed vendor source.

**Status**: open
**Resolves with**: tenant snapshot (inspect available log feeds for notification events) OR operator experience

---

### zcc-30 — Notification Templates localization fallback

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

What language ZCC falls back to if no Notification Template matches the user's OS locale. Requires the Notification Templates doc (not yet captured).

**Status**: open
**Resolves with**: zscaler doc not yet read (Notification Templates doc)

---

### zcc-31 — Linux ZCC desktop notification support

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether ZCC on Linux emits OS-level desktop notifications (e.g., via libnotify / D-Bus), or only updates in-app status. Linux platform is referenced in Web Policy sub-policies but not addressed in the notification framework section.

**Status**: open
**Resolves with**: lab test (install ZCC on Ubuntu/RHEL; trigger a notification event) OR operator experience

---

### zcc-32 — ChromeOS notification behavior

*Origin: `references/zcc/end-user-notifications.md` § Open questions*

Whether ZCC on ChromeOS surfaces OS-level notifications and whether the Android notification framework applies. The vendor notification doc explicitly names only iOS and Android as unsupported, leaving ChromeOS status ambiguous.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-33 — App Supportability API endpoint

*Origin: `references/zcc/support-options.md` § Open questions*

The underlying API endpoint path and request schema for the four App Supportability toggles (Enable Support Access, Admin Email, Zscaler Ticket Submission, Hide Logging Control). The vendor help doc describes the UI flow only; no SDK service module was found for this surface in either Python or Go SDKs.

**Status**: open
**Resolves with**: code read (grep ZCC API reference for a supportability endpoint) OR zscaler doc not yet read

---

### zcc-34 — App Supportability default toggle states

*Origin: `references/zcc/support-options.md` § Open questions*

Whether "Enable Support Access" and "Hide Logging Control" are on or off for a newly provisioned tenant. The vendor doc describes configuration steps, not explicit default values; defaults were inferred but not confirmed.

**Status**: open
**Resolves with**: tenant snapshot (new tenant or factory-reset App Supportability config) OR operator experience

---

### zcc-35 — Mobile platform password gate field availability

*Origin: `references/zcc/support-options.md` § Open questions*

Whether `disable_password` appears in `iosPolicy` and `androidPolicy` sub-policy objects or only `logout_password` on mobile platforms. Available sources detail desktop sub-policies; mobile field enumeration is incomplete in reviewed sources.

**Status**: open
**Resolves with**: code read (inspect iOS/Android sub-policy SDK model fields)

---

### zcc-36 — Diagnostic bundle contents

*Origin: `references/zcc/support-options.md` § Open questions*

The specific files, directories, and log types included in the encrypted diagnostic bundle submitted via Report an Issue. The vendor doc states the bundle contains encrypted logs but does not enumerate contents; PII scope and redaction behavior are not documented.

**Status**: open
**Resolves with**: lab test (submit a Report an Issue bundle; inspect if decryptable) OR zscaler doc not yet read
**Blocks**: accurate PII/data-handling guidance for support bundle submissions

---

### zcc-37 — Diagnostic bundle local staging path

*Origin: `references/zcc/support-options.md` § Open questions*

Whether ZCC stages the diagnostic bundle to a predictable local temp directory before uploading. Relevant to DLP controls that scan outbound email attachments.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-38 — Admin event log for Report an Issue submissions

*Origin: `references/zcc/support-options.md` § Open questions*

Whether ZCC logs the time, device, and user when a Report an Issue form is submitted in any admin-side audit log, separately from the email delivery receipt. No admin-side submission log found in reviewed sources.

**Status**: open
**Resolves with**: tenant snapshot (inspect ZCC portal audit log after a Report an Issue submission)

---

### zcc-39 — ZCC Firefox integration on Linux

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Whether ZCC Firefox integration applies to Linux at all. The vendor doc mentions only "macOS and Windows devices." Linux Firefox snap isolation on Ubuntu adds further complexity.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-40 — `security.enterprise_roots.enabled` and ZCC certificate trust

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Whether ZCC's Firefox integration sets `security.enterprise_roots.enabled` (causing Firefox to inherit the OS certificate store), or whether certificate trust for ZCC's SSL Inspection CA requires a separate enterprise policy step.

**Status**: open
**Resolves with**: lab test (inspect Firefox preference state after enabling ZCC integration) OR operator experience

---

### zcc-41 — Exact Firefox preference keys ZCC writes

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Which Firefox preference keys ZCC sets (e.g., `network.proxy.type`, `network.proxy.autoconfig_url`), and whether settings are delivered via a preference file write, `policies.json`, the Firefox preference API, or another mechanism. The vendor doc states only that ZCC "enables the Use system proxy settings feature in Firefox."

**Status**: open
**Resolves with**: lab test (inspect Firefox profile directory before and after enabling ZCC integration)

---

### zcc-42 — Firefox settings persistence across major version upgrades

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Whether settings pushed by ZCC's Firefox integration mechanism survive a Firefox major-version update, or whether ZCC must re-apply them after each upgrade. Not addressed in available vendor sources; known risk with `prefs.js`-based settings.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-43 — Firefox integration ZCC version scope

*Origin: `references/zcc/firefox-integration.md` § Open questions*

Whether Firefox integration behavior is consistent across ZCC 4.x releases, or whether specific ZCC versions introduced changes to the integration mechanism. No version-specific notes in the vendor doc.

**Status**: open
**Resolves with**: zscaler doc not yet read (ZCC release notes) OR operator experience

---

### zcc-44 — AUP re-display on message change

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether updating the AUP message text in the portal causes ZCC to re-display the AUP to users who have already accepted, independently of the configured frequency setting. The vendor source describes frequency as the only display trigger; policy-change-triggered re-prompt is not mentioned.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-45 — AUP Decline button behavior

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the ZCC AUP screen includes a Decline button, and what happens if the user declines (tunnel blocked, logout forced, or nothing). The vendor source describes the screen as a gate users "must accept" but does not mention a decline path.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-46 — AUP external URL redirect support

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the AUP message field supports a URL redirect to an external policy page, or whether all content must be embedded in the HTML field in the ZCC Portal.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-47 — AUP signature or checkbox confirmation variant

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether ZCC supports a signature-capture or checkbox-confirmation variant of the AUP rather than a simple Accept button. Not described in available vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zcc-48 — AUP Accept-only vs Accept-and-Decline

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the AUP can be configured to show both Accept and Decline as user choices, or whether it is Accept-only. Vendor source framing implies Accept-only; not explicitly confirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zcc-49 — Minimum ZCC agent version for AUP display

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

The minimum ZCC agent version required to display the AUP, and whether older agent versions silently skip the AUP or generate an error. Not documented in the vendor source or install-parameters docs.

**Status**: open
**Resolves with**: zscaler doc not yet read (ZCC release notes)

---

### zcc-50 — AUP tab suppression when Notification Templates are active

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the AUP Settings tab is suppressed when the tenant uses Notification Templates — analogous to the End User Notifications tab being hidden in that mode. The vendor source documents Notifications tab suppression but does not address the AUP tab specifically.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test (enable Notification Templates; verify AUP tab visibility)

---

### zcc-51 — AUP accept/decline event logging

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether ZCC logs individual user AUP accept/decline events in the ZCC portal audit log, ZIA NSS streams, or elsewhere. Not described in the AUP vendor source or shared audit-logs reference.

**Status**: open
**Resolves with**: tenant snapshot (inspect available log feeds for AUP acknowledgment events) OR operator experience

---

### zcc-52 — ZCC AUP single-language-only message

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether ZCC can display the AUP in the user's device locale, or whether only a single-language message is supported. The AUP message field has no documented locale-variant mechanism. Overlaps with `zcc-26`.

**Status**: open
**Resolves with**: zscaler doc not yet read (Notification Templates doc)

---

### zcc-53 — ZCC AUP HTML field size limit

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

The confirmed message size limit for the ZCC AUP HTML field. The ZIA ranges-and-limitations doc records 15K–30K bytes for notification/AUP messages in a ZIA context; direct applicability to ZCC AUP is not explicitly confirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read (ZCC Ranges & Limitations) OR lab test

---

### zcc-54 — AUP behavior in machine-tunnel and kiosk scenarios

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether the AUP is shown before user login in machine-tunnel mode, and whether kiosk or shared-device deployments can bypass the AUP. Not documented in the AUP vendor source or install-parameters docs.

**Status**: open
**Resolves with**: lab test OR zscaler doc not yet read

---

### zcc-55 — AUP config change propagation cadence

*Origin: `references/zcc/acceptable-use-policy.md` § Open questions*

Whether changes to AUP frequency or message content take effect immediately on the next user connect, or only after the agent's next policy refresh cycle (normally on logout/restart).

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-56 — Default `logMode` for a new App Profile

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

The out-of-box default log mode (Info, Warn, or another level) when a new App Profile is created in the ZCC Portal. The vendor help doc describes available log modes but does not state the factory default; the SDK model carries the field without a default annotation.

**Status**: open
**Resolves with**: tenant snapshot (create a fresh App Profile; inspect `logMode` value) OR operator experience

---

### zcc-57 — `logLevel` vs `logMode` distinction

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether `logLevel` and `logMode` on the `WebPolicy` object are the same concept with different naming conventions at API vs UI layers, or represent independent configuration dimensions. Both fields exist on the model; vendor help uses "log mode" only.

**Status**: open
**Resolves with**: code read (inspect WebPolicy model + portal behavior) OR lab test

---

### zcc-58 — `logFileSize` values and rotation semantics

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

The exact units (bytes vs MB), allowed range, default value, and rotation behavior for the `logFileSize` field on `WebPolicy`. The field is untyped in the model; no enumeration of allowed values or rotation behavior was found.

**Status**: open
**Resolves with**: code read (inspect Go SDK for validation or enum) OR lab test

---

### zcc-59 — `enable_auto_log_snippet` field semantics

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

The `enable_auto_log_snippet` parameter appears on `set_web_privacy_info` in the SDK service file but is absent from the `WebPrivacy` model class; its function is not described in any reviewed source.

**Status**: open
**Resolves with**: zscaler doc not yet read OR code read (search across SDK for usages of this parameter)

---

### zcc-60 — Per-platform ZCC log file paths

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

The filesystem paths where ZCC writes log files on Windows, macOS, Linux, Android, and iOS. The vendor doc mentions that "Show/Hide Logs" reveals the path to the user but provides no canonical path table. Overlaps with `zcc-68`.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-61 — Windows Event Log integration

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether ZCC writes events to the Windows Application or System event log in addition to its own log file, and if so which Event IDs it uses. The `WindowsPolicy.flow_logger_config` SDK field hints at a Windows-specific logging subsystem but its relationship to Windows Event Log is not described. Overlaps with `zcc-69`.

**Status**: open
**Resolves with**: lab test (install ZCC on Windows; inspect Event Viewer) OR operator experience

---

### zcc-62 — macOS Unified Log subsystem for ZCC

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether ZCC emits entries to OSLog (subsystem identifier, category) in addition to its own log files on macOS. Not addressed in macOS vendor docs or the SDK model. Overlaps with `zcc-70`.

**Status**: open
**Resolves with**: lab test (`log stream --predicate 'subsystem contains "zscaler"'` with ZCC installed)

---

### zcc-63 — Linux syslog/journald integration

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether ZCC on Linux writes to the system journal (journald), and if so what facility/priority it uses. The `LinuxPolicy` SDK model has no log-configuration fields; Linux-specific logging behavior is not documented.

**Status**: open
**Resolves with**: lab test (install ZCC on Linux; inspect `journalctl` output)

---

### zcc-64 — iOS log access limitations

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether iOS platform sandboxing restricts ZCC from exposing a user-accessible log view, and what the actual iOS-specific capabilities are under the App Supportability toggle. No iOS-specific log caveats found in vendor help.

**Status**: open
**Resolves with**: lab test (iOS device) OR zscaler doc not yet read (iOS-specific ZCC deployment guide)

---

### zcc-65 — Diagnostic bundle file inventory

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Specific files included in the ZIP produced by "Export Logs" and in the encrypted bundle sent via "Report an Issue"; whether the bundle includes OS network configuration, driver info, or other artifacts beyond ZCC log files. Overlaps with `zcc-36`.

**Status**: open
**Resolves with**: lab test (export logs; inspect ZIP contents)

---

### zcc-66 — In-UI log viewer vs exported ZIP consistency

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether the in-app log view and the exported ZIP always reflect the same content, or whether the viewer applies session/mode filters that exclude older rotated log data present in the ZIP.

**Status**: open
**Resolves with**: lab test

---

### zcc-67 — ZIA URL visibility in ZCC log files

*Origin: `references/zcc/user-logging-controls.md` § Open questions*

Whether ZCC operational logs at any verbosity level include URL paths (not just hostnames/IPs), and whether this depends on forwarding mode (PAC vs tunnel). Inferred that ZCC is transport-layer and does not log URL paths, but not explicitly confirmed.

**Status**: open
**Resolves with**: lab test OR operator experience

---

### zcc-68 — ZCC log file paths (Windows and macOS)

*Origin: `references/zcc/troubleshooting.md` § Open questions*

The exact ZCC log file paths on Windows (`%ProgramData%\Zscaler\logs\`) and macOS (`/Library/Application Support/Zscaler/logs/`). Paths are consistent with packaging conventions and community reports but not explicitly stated in captured vendor help sources. Overlaps with `zcc-60`.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zcc-69 — Windows Event Log source name for ZCC

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether the Windows Event Log source name for ZCC events is "Zscaler", "ZscalerApp", or another string. Not documented in captured vendor sources. Overlaps with `zcc-61`.

**Status**: open
**Resolves with**: lab test (inspect Event Viewer source names with ZCC installed)

---

### zcc-70 — macOS Unified Log subsystem identifier

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether the macOS Unified Log subsystem identifier for ZCC is `com.zscaler` or another string. Derived from standard macOS bundle ID conventions; not confirmed in any captured vendor source. Overlaps with `zcc-62`.

**Status**: open
**Resolves with**: lab test (`log stream --predicate 'subsystem contains "zscaler"'`)

---

### zcc-71 — Android logcat tag for ZCC

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether the Android logcat tag for ZCC events is "ZscalerApp" or another string. Not confirmed in captured vendor sources.

**Status**: open
**Resolves with**: lab test (Android device with ZCC installed; `adb logcat | grep -i zscaler`)

---

### zcc-72 — "Fetch Logs" admin permission requirement

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether the "Fetch Logs" action on the ZCC Portal Enrolled Devices Device Details page requires a specific admin role permission beyond read access. Not documented in the app-supportability vendor source.

**Status**: open
**Resolves with**: lab test (attempt "Fetch Logs" with a read-only admin) OR zscaler doc not yet read

---

### zcc-73 — HTTP 500 labeled "Not Implemented" in ZCC API reference

*Origin: `references/zcc/troubleshooting.md` § Open questions*

The `legacy-about-error-codes-zcc.md` vendor doc maps HTTP 500 to "Not Implemented." The conventional HTTP status for "Not Implemented" is 501. Whether this reflects an intentional API distinction from standard HTTP 500 (Internal Server Error) or is a documentation error is not clarified.

**Status**: open
**Resolves with**: support ticket OR operator experience (observe live ZCC 500 responses)

---

### zcc-74 — HTTP 503 on ZCC portal API

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether HTTP 503 is returned by the ZCC portal API during maintenance windows. 503 is documented in the ZIA/ZPA legacy API reference but not in the ZCC-specific API reference; applicability to the ZCC portal API is inferred from shared platform behavior.

**Status**: open
**Resolves with**: operator experience OR support ticket

---

### zcc-75 — macOS Network Extension denial error code

*Origin: `references/zcc/troubleshooting.md` § Open questions*

Whether a macOS user denial of the ZCC Network Extension (in System Settings → Privacy & Security) surfaces a specific ZCC error code or admin-visible alert in the ZCC Portal or audit log. Not described in captured vendor sources.

**Status**: open
**Resolves with**: lab test (deny Network Extension on macOS; observe ZCC error state and portal visibility) OR zscaler doc not yet read

---

### zia-47 — DNS Control block_response_code accepted values

*Origin: `references/zia/dns-control.md` § Open questions*

A DNS Control rule with the `BLOCK` action carries a `block_response_code` field, but no vendored source enumerates which DNS response codes it accepts (NXDOMAIN, REFUSED, specific rcodes, etc.). All three sources describe it only as a free-form "DNS response code" string. Until the accepted set is known, the skill cannot say what a given block rule actually returns to the client resolver.

**Status**: open
**Resolves with**: lab test (configure a BLOCK rule, observe accepted values in the console / API) OR tenant snapshot

---

### zia-48 — DNS Control redirect_ip action binding

*Origin: `references/zia/dns-control.md` § Open questions*

Source disagrees on whether `redirect_ip` binds to all `REDIR_*` actions or only `REDIR_RES`. The commented Go validator binds `redirect_ip` only to `REDIR_RES` (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:286-290`), while the MCP field description claims it applies to all `REDIR_*` (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/cloud_firewall_dns_rules.py:276-279`). Which framing matches actual server validation is unresolved.

**Status**: open
**Resolves with**: lab test (submit `redirect_ip` against each `REDIR_*` action, observe which the API accepts)

---

### zia-49 — CAC per-app action validity

*Origin: `references/zia/api-divergences.md` § Open questions*

For Cloud App Control, which individual actions are valid for a given cloud application is not exposed by any read path in the vendored sources — `availableActions` returns a flat category-level `List[str]` only (`vendor/zscaler-sdk-python/zscaler/zia/cloudappcontrol.py:34`, `:84-91`). The whole-create-rejection contract (`INVALID_INPUT_ARGUMENT` / "Invalid action provided for selected applications") and the one-rule-per-app safe pattern are MCP-docstring claims, confirmed absent from both SDKs. Needs live-tenant probing to resolve which per-app action combinations the API actually accepts.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: lab test (probe a live tenant with per-app action combinations, capture the validation responses)

**2026-06-18 narrowing**: the Automate contract now gives a static category-level `actions` vocabulary for `POST /zia/api/v1/webApplicationRules/:rule_type`, including the generated contract-only action list in the ZIA divergence report (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json:2134-2137`, `:2174-2186`, `:2356-2362`). That closes the "what is the captured documented action vocabulary?" part. It does **not** close per-app validity: the contract still describes a rule body, not a read path that maps each app to its individually accepted actions.

---

### zpa-20 — ZPN_STATUS_PENDING as a real runtime status

*Origin: `references/zpa/app-connector.md` § Open questions*

`ZPN_STATUS_PENDING` appears only in a single SKILL.md status table (`vendor/zscaler-mcp-server/skills/zpa/troubleshoot-app-connector/SKILL.md:102`); it is absent from the `troubleshoot-connector` command doc, all SDK source, and the zscaler-help status-log-field docs. Its existence as a real App Connector runtime status — and the wire-level value (`controlChannelStatus` / `runtime_status`) that would distinguish it from `ZPN_STATUS_NOT_ENROLLED` — is not confirmed beyond that one table. The full `ZPN_STATUS_*` enum can't be enumerated from SDK source because LSS status codes are fetched dynamically at runtime (`vendor/zscaler-sdk-python/zscaler/zpa/lss.py:609`).

**Status**: open
**Resolves with**: tenant snapshot (observe a connector in the pending state via API) OR lab test

---

### zpa-21 — PRAApplication.applicationProtocol full enum citation scope

*Origin: `references/zpa/api-postman-schemas.md` § Open questions*

The report claims `DYNAMIC`, `FTP`, `VNC`, and `WEBSOCKET` are present for `PRAApplication.applicationProtocol` and cites `vendor/zscaler-api-specs/oneapi-postman-collection.json:86512`, but that line shows a PRA Console GET response listing only `HTTP` and `SSH` in the two example instances. The full 10-value enum (`AUTO`, `DYNAMIC`, `FTP`, `HTTP`, `HTTPS`, `NONE`, `RDP`, `SSH`, `VNC`, `WEBSOCKET`) likely appears across multiple PRA endpoints in the collection rather than at a single line — whether every value is actually present is unverified at line level.

**Status**: open
**Resolves with**: code read (grep the full Postman collection for each enum value to confirm completeness)

---

### zpa-22 — PrivateCloudController canonical restart path

*Origin: `references/zpa/api-schemas.md` § Open questions*

The two SDKs build different restart paths for a Private Cloud Controller. The Go SDK constructs `/privateCloudController/restart/{id}` (`vendor/zscaler-sdk-go/zscaler/zpa/services/private_cloud_controller/private_cloud_controller.go:128-129` — `path := endpoint+"/restart"` then appends `/{controllerID}`), while the Python SDK uses `/privateCloudController/{id}/restart` (`vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_controller.py:267`). The Postman collection has no PrivateCloudController entry to settle which path the live API actually serves.

**Status**: open
**Resolves with**: lab test against a live tenant (issue the restart and observe which path the API accepts)

---

### zpa-23 — Credential sensitive fields in GET response

*Origin: `references/zpa/api-schemas.md` § Open questions*

The Python `Credential` model excludes `password` and `private_key` from its response field handling, but the Postman collection shows them present in GET list example bodies. Whether the ZPA API actually returns these sensitive fields on a read, or whether the Postman bodies are placeholder/echo artifacts, is unresolved.

**Status**: open
**Resolves with**: tenant snapshot / lab test (GET a credential object and inspect whether secret fields are returned)

---

### zpa-24 — NLA as a valid `connectionSecurity` value for PRA sub-apps

*Origin: `references/zpa/api-schemas.md` § Open questions*

The Python SDK docstring lists `NLA` among accepted `connection_security` values (`vendor/zscaler-sdk-python/zscaler/zpa/app_segments_pra.py:188`: `ANY`, `NLA`, `NLA_EXT`, `TLS`, `VM_CONNECT`, `RDP`), but `NLA` is not corroborated by a Go SDK struct enum or a Postman example. Whether the API accepts `NLA` as a distinct connection-security mode is unconfirmed.

**Status**: open
**Resolves with**: lab test (create a PRA sub-app with `connectionSecurity=NLA` and observe acceptance)

---

### zpa-25 — BaCertificate `update_certificate` validity as an API operation

*Origin: `references/zpa/api-schemas.md` § Open questions*

The Python SDK exposes `update_certificate` building `PUT /certificate/{id}` (`vendor/zscaler-sdk-python/zscaler/zpa/certificates.py:266`, `:294`), but neither the Go SDK nor the Postman collection has a PUT for a BA certificate. Whether the ZPA API actually supports updating an existing BA certificate (vs. delete-and-recreate only) is unconfirmed.

**Status**: open
**Resolves with**: lab test (attempt a certificate PUT against a live tenant)

---

### zpa-26 — `zpn_client_type_browser_isolation` in LSS policy conditions

*Origin: `references/zpa/api-schemas.md` § Open questions*

`zpn_client_type_browser_isolation` is a defined client type (`vendor/zscaler-sdk-go/zscaler/zpa/services/clienttypes/clienttypes.go:18`) and is listed as a valid `CLIENT_TYPE` value in several TF policy-rule docs, but in the Go LSS-config integration test it appears only inside a commented-out condition block (`vendor/zscaler-sdk-go/zscaler/zpa/services/lssconfigcontroller/zpa_lss_config_controller_test.go:243`). Whether the ZPA API accepts `zpn_client_type_browser_isolation` as a `CLIENT_TYPE` operand on an LSS-config policy condition specifically is not confirmed at the API level.

**Status**: open
**Resolves with**: lab test (configure an LSS policy condition with this client type and observe acceptance)

---

### zpa-27 — App Connector-to-app latency probe cadence

*Origin: `references/zpa/app-connector.md` § Open questions*

How frequently ZPA re-measures App Connector-to-application RTT (the latency signal used in connector/path selection) is not stated in the captured help docs (`vendor/zscaler-help/about-app-connectors.md`; `vendor/zscaler-help/Understanding_App_Connector_Metrics_Log_Fields.txt`). Relevant to "our network path changed — how long until ZPA notices and re-routes" questions.

**Status**: open
**Resolves with**: zscaler doc not yet read / operator experience

---

### zpa-28 — App Connector certificate validity window before re-enrollment

*Origin: `references/zpa/app-connector.md` § Open questions*

How long an App Connector enrollment certificate is valid before re-enrollment is required is not stated in the captured vendor sources. Relevant to planning connector cert-rotation maintenance.

**Status**: open
**Resolves with**: zscaler doc not yet read / operator experience

---

### zpa-29 — Maximum App Connectors per group

*Origin: `references/zpa/app-connector.md` § Open questions*

The captured help docs describe high connector counts per App Connector Group but do not enumerate an explicit maximum. The exact cap (if any) is unconfirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read / support ticket

---

### zpa-30 — Provisioning-key auto-delete on group delete (API behavior)

*Origin: `references/zpa/app-connector.md` § Open questions*

No vendor source states that deleting an App Connector Group or Service Edge Group *actively* auto-deletes its provisioning keys. The only evidence is indirect: the Python group-delete signature carries no cascade/force parameter (`vendor/zscaler-sdk-python/zscaler/zpa/app_connector_groups.py:435`), and the SDK does not document a cascade. Whether the ZPA API itself removes associated provisioning keys when a group is deleted is unconfirmed; treat auto-delete as inferred, not source-stated.

**Status**: open
**Resolves with**: lab test (delete a group with an associated provisioning key and check whether the key is also removed)

---

### zpa-31 — Whether the ZPA API requires an enrollment cert for connector-type provisioning keys

*Origin: `references/zpa/app-connector.md` § Open questions*

The "an enrollment cert is required for a `connector`-type provisioning key" rule is enforced only client-side in the MCP tool (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zpa/provisioning_key.py:103-104`); neither SDK's add/update path enforces or documents a per-key-type cert requirement (the SDK treats `enrollment_cert_id` as a plain optional kwarg). Whether the ZPA API itself rejects a connector-type key created without an enrollment cert is unconfirmed.

**Status**: open
**Resolves with**: lab test (create a connector-type provisioning key without an enrollment cert via the API and observe whether it is rejected)

---

### zpa-32 — `zpn_audit_log` LSS field schema

*Origin: `references/zpa/audit-logs.md` § Open questions*

The specific fields present in a `zpn_audit_log` LSS stream entry are not captured in available sources. The `zpa_lss_config_log_type_formats` data source would carry the authoritative per-field format list but was not available for review.

**Status**: open
**Resolves with**: zscaler doc not yet read (capture the `zpa_lss_config_log_type_formats` output for `zpn_audit_log`)

---

### zpa-33 — `SIEM_POLICY` purpose relative to audit-log streaming

*Origin: `references/zpa/audit-logs.md` § Open questions*

The `siem` key maps to `SIEM_POLICY` in the policy `POLICY_MAP` (`vendor/zscaler-sdk-python/zscaler/zpa/policies.py:69`), and a `data.zpa_policy_type.lss_siem_policy` exists, but the purpose of the SIEM policy type in relation to audit-log streaming is not confirmed from available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-34 — Microtenant audit-log scoping

*Origin: `references/zpa/audit-logs.md` § Open questions*

Whether audit logs generated within a microtenant are isolated to that microtenant's LSS configurations, or are also visible to the parent tenant, is not confirmed from available sources.

**Status**: open
**Resolves with**: tenant snapshot / lab test (compare audit-log visibility across a parent/microtenant boundary)

---

### zpa-35 — `LSSConfig.filter` valid expressions for `zpn_audit_log`

*Origin: `references/zpa/audit-logs.md` § Open questions*

`LSSConfig.filter` is a `[]string`, but the valid filter expressions for the `zpn_audit_log` log type are not documented in available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read (the format/filter lookup for `zpn_audit_log`)

---

### zpa-36 — Runtime semantics of `trust_untrusted_cert` and `allow_options`

*Origin: `references/zpa/browser-access.md` § Open questions*

Both fields are present on the SDK clientless-app model (`vendor/zscaler-sdk-python/zscaler/zpa/models/application_segment.py:771-772`), but the model is a passthrough struct — it does not document what the ZPA service does with each flag. The precise ingress behavior (whether `allow_options` blocks vs forwards an `OPTIONS` preflight to the backend, and whether `trust_untrusted_cert` suppresses the Browser Access web-server certificate error end-to-end or only on the backend leg) is inferred from the field names, not confirmed in vendor source.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test (toggle each flag and observe ingress behavior)

---

### zpa-37 — `GET /stepupauthlevel` response shape and write-verb support

*Origin: `references/zpa/legacy-endpoints.md` § Open questions*

The Go service `GetStepupAuthLevel` deserializes the response into a plain `[]string` (`vendor/zscaler-sdk-go/zscaler/zpa/services/step_up_auth/step_up_auth.go:30-39`) even though the package defines a richer `StepAuthLevel` struct, so the true wire shape is not pinned down by the SDK. No create/update/delete verbs are exposed for step-up auth levels in the Go service — whether the legacy API supports writes is unconfirmed.

**Status**: open
**Resolves with**: lab test (capture a real `GET /stepupauthlevel` response and probe for write verbs)

---

### zpa-38 — OAuth2 user-code legacy host `/zpa` path prefix

*Origin: `references/zpa/legacy-endpoints.md` § Open questions*

The `oauth2_user`, `c2c_ip_ranges`, `api_keys`, and `step_up_auth` Go services build paths from the SDK constant `/zpa/mgmtconfig/v1/admin/customers/`, which carries a `/zpa` prefix not present in the doc's Base-URLs table. Whether the live legacy host expects the `/zpa` prefix (a client-routing detail) is not verified.

**Status**: open
**Resolves with**: lab test (capture the actual request path the legacy host accepts)

---

### zpa-39 — `/assistantSchedule` legacy endpoint — still served vs retired alias

*Origin: `references/zpa/legacy-endpoints.md` § Open questions*

The `appconnectorcontroller` Go package still declares `scheduleEndpoint = "/assistantSchedule"` (`vendor/zscaler-sdk-go/zscaler/zpa/services/appconnectorcontroller/zpa_app_connector_controller.go:16`) but no function references it. Whether the legacy API still serves `/assistantSchedule` or it is a fully retired alias of `/connectorSchedule` cannot be determined from the SDK alone.

**Status**: open
**Resolves with**: lab test (call `/assistantSchedule` against the legacy host and observe the response)

---

### zpa-40 — `zpn_auth_log_1id` human-facing label

*Origin: `references/zpa/log-receivers.md` § Open questions*

The TF data source lists `zpn_auth_log_1id` as a valid format-lookup code (`vendor/terraform-provider-zpa/zpa/data_source_zpa_lss_config_log_types_formats.go:32`), but no source maps it to an operator-facing label. The "User Status (Zidentity)" label used in the doc is inferred from the `auth_log` stem plus the `_1id` (Zidentity / "OneID") suffix; the help doc lists only a single "User Status" with no Zidentity variant.

**Status**: open
**Resolves with**: zscaler doc not yet read (the operator-facing display name for this code)

---

### zpa-41 — Format-only log-type codes' acceptance on a receiver's `sourceLogType`

*Origin: `references/zpa/log-receivers.md` § Open questions*

Eight codes present in the TF format-lookup set are absent from the Python `source_log_map`. Of these, **`zpn_pbroker_comprehensive_stats` is resolved**: the Terraform resource `zpa_lss_config_controller` includes it in its `source_log_type` `ValidateFunc` (`vendor/terraform-provider-zpa/zpa/resource_zpa_lss_config_controller.go:225`), which is strong evidence the ZPA API accepts it on a live receiver. The remaining seven (`zms_flow_log`, `zpn_sitec_comprehensive_stats`, `zpn_sitec_auth_log`, `zpn_auth_log_1id`, `zpn_smb_inspection_log`, `zpn_ldap_inspection_log`, `zpn_krb_inspection_log`) are valid for `GET /lssConfig/logType/formats` but absent from both the Python `source_log_map` and the TF resource's write-time validator — whether the ZPA API rejects them on a receiver's `sourceLogType` is not established in available sources.

**Status**: partial — `zpn_pbroker_comprehensive_stats` resolved (TF resource accepts it); 7 remaining codes still open
**Resolves with**: lab test (configure a receiver with one of the 7 remaining `sourceLogType` values and observe acceptance)

---

### zpa-42 — Console path for the global "Enable ZPA Machine Tunnel for All" toggle

*Origin: `references/zpa/machine-tunnels.md` § Open questions*

The help article `configuring-zpa-machine-tunnel-all` has moved or been removed, so the exact ZPA Admin Portal navigation path for the global machine-tunnel-for-all toggle is not confirmed. Expected location is somewhere within App Profile or ZPA Global Settings.

**Status**: open
**Resolves with**: tenant snapshot / operator experience (confirm the console location)

---

### zpa-43 — Machine tunnel behavior during user session transitions

*Origin: `references/zpa/machine-tunnels.md` § Open questions*

The help notes the machine tunnel is Active before user login and may become Inactive after. The exact lifecycle — whether the machine tunnel remains active alongside the user tunnel post-login, or hands off — is not explicitly documented.

**Status**: open
**Resolves with**: lab test / operator experience (observe tunnel state across a login transition)

---

### zpa-44 — macOS MDM enrollment effect on machine-tunnel provisioning

*Origin: `references/zpa/machine-tunnels.md` § Open questions*

Jamf and Intune are listed as posture types for macOS. Whether they affect the machine-tunnel provisioning flow (e.g. a Jamf-issued certificate serving as the enrollment anchor) is not documented.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-45 — Machine-tunnel provisioning key mechanism

*Origin: `references/zpa/machine-tunnels.md` § Open questions*

The `zpa_provisioning_key` TF resource supports `CONNECTOR_GRP` and `SERVICE_EDGE_GRP` association types. Whether machine-tunnel provisioning uses a different mechanism (an app-profile-embedded key rather than a standard ZPA provisioning-key resource) is not clear from sources.

**Status**: open
**Resolves with**: zscaler doc not yet read / tenant snapshot

---

### zpa-46 — API enforcement of the CHROME_POSTURE_PROFILE vs CHROME_ENTERPRISE operand-form split

*Origin: `references/zpa/policy-precedence.md` § Open questions*

The Terraform provider enforces a form split for two object types: `CHROME_POSTURE_PROFILE` requires `values` and `CHROME_ENTERPRISE` requires `entry_values` (with `lhs="managed"`, `rhs` in {`true`,`false`}) (`vendor/terraform-provider-zpa/zpa/common.go:1212-1234`). Whether the ZPA API backend enforces the same split — or whether the provider validation is stricter than the server — is unconfirmed.

**Status**: open
**Resolves with**: lab test (submit a mismatched operand form directly to the API and observe whether it is rejected)

---

### zpa-47 — Private Service Edge VM sizing and per-instance session limits

*Origin: `references/zpa/private-service-edges.md` § Open questions*

The Deployment Prerequisites document referenced in help sources was not captured. vCPU, vRAM, and disk requirements per PSE VM and per-instance session limits are not confirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read (current Deployment Prerequisites doc)

---

### zpa-48 — PSE provisioning-key API/Terraform support

*Origin: `references/zpa/private-service-edges.md` § Open questions*

There is no `zpa_service_edge_provisioning_key` resource in the captured Terraform provider docs (the App Connector equivalent `zpa_provisioning_key` exists). Whether PSE provisioning keys can be created via the API/Terraform or are Admin-Console-only is unconfirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-49 — Supported hypervisor / cloud-image formats for ZPA PSEs

*Origin: `references/zpa/private-service-edges.md` § Open questions*

VMware (ESXi/vSphere) is confirmed for ZPA PSEs. Whether OVA images are provided for Hyper-V, KVM, or cloud-native VM formats (AWS AMI, Azure image) for ZPA PSEs specifically is not confirmed — ZIA VSEs support those platforms, but ZPA PSEs may differ.

**Status**: open
**Resolves with**: zscaler doc not yet read

---

### zpa-50 — ZPA PSE dedicated hardware appliance availability

*Origin: `references/zpa/private-service-edges.md` § Open questions*

The ZIA PSE product has dedicated hardware appliances (PSE 3, PSE 5 physical clusters). Whether ZPA PSEs are virtual-only or also available as dedicated hardware is not confirmed — the captured help sources describe only VM images.

**Status**: open
**Resolves with**: zscaler doc not yet read / support ticket

---

### zpa-51 — Private Cloud Controller product positioning

*Origin: `references/zpa/private-service-edges.md` § Open questions*

The SDK surface is documented (`/privateCloudControllerGroup` group container and `/privateCloudController` member instance form the same group/instance pairing as `/serviceEdgeGroup` ÷ `/serviceEdge`, with `site_id` and `privateBrokerGroupIds` linking the group to a ZPA site — `vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_group.py:180`, `:201`). What the source does not settle is the product semantics: whether the Private Cloud Controller family is a sovereign/private-cloud ZPA control-plane variant or simply an alternate PSE grouping type, and whether it is in scope for standard PSE deployments using Zscaler's public ZPA CA.

**Status**: open
**Resolves with**: zscaler doc not yet read (ZPA Private Cloud product docs)

---

### zpa-52 — `restart_private_controller` operational semantics

*Origin: `references/zpa/private-service-edges.md` § Open questions*

The Python SDK exposes a restart for a Private Cloud Controller (`vendor/zscaler-sdk-python/zscaler/zpa/private_cloud_controller.py:245`, `:267`), but the source does not state whether the restart is graceful (drains sessions first) or hard, nor whether an equivalent restart action exists for ordinary `serviceEdge` instances (none is present in the captured `service_edges.py`).

**Status**: open
**Resolves with**: lab test (restart a controller and observe session impact)

---

### zpa-53 — Service Edge Auto-Delete schedule accepted `frequency` values and defaults

*Origin: `references/zpa/private-service-edges.md` § Open questions*

`ServiceEdgeScheduleAPI` accepts `frequency` / `frequencyInterval` (`vendor/zscaler-sdk-python/zscaler/zpa/service_edge_schedule.py:121-122`), but the SDK does not enumerate the accepted enum values (e.g. days vs weeks) or the default cadence when the schedule is first enabled.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-54 — PSE location / GeoIP update propagation delay

*Origin: `references/zpa/private-service-edges.md` § Open questions*

The help docs note that if a PSE Group location is updated for an existing active connection, the PSE uses the old location until the next new connection. The propagation delay for location changes across the CA topology is not quantified.

**Status**: open
**Resolves with**: zscaler doc not yet read / operator experience

---

### zpa-55 — PSE OAuth2 enrollment path license/replacement semantics

*Origin: `references/zpa/private-service-edges.md` § Open questions*

The `enrollment_cert_id` + `user_codes` pattern on `zpa_service_edge_group` suggests an OAuth2 enrollment flow distinct from the traditional provisioning-key path. Whether it requires a specific ZPA license tier, and whether it replaces or supplements the provisioning-key flow, is not resolved from available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-56 — Maximum PSEs per group

*Origin: `references/zpa/private-service-edges.md` § Open questions*

Unlike App Connector Groups, no documented maximum PSE count per PSE Group was found in the captured sources.

**Status**: open
**Resolves with**: zscaler doc not yet read / support ticket

---

### zpa-57 — Whether session recording, approval workflow, and credential pooling are formally absent from base (non-PRA) ZPA

*Origin: `references/zpa/privileged-remote-access.md` § Open questions*

The captured help articles, Python SDK, and Terraform provider all document session recording, approval workflow, and credential pooling as PRA-specific constructs, but none directly states they are unavailable in standard ZPA. The dedicated PRA SDK modules and the `SECURE_REMOTE_ACCESS`-only `app_types` enum on the PRA segment resource are strong implicit evidence, but a direct source statement is needed to assert the negative.

**Status**: open
**Resolves with**: zscaler doc not yet read (a source statement scoping these features to PRA)

---

### zpa-58 — ZPA Public-tier-specific behavior (scale / Safe-mode)

*Origin: `references/zpa/public-service-edges.md` § Open questions*

No ZPA-specific *Public* Service Edge help page is present in vendor sources. The earlier draft's quantitative claims about the Public tier (hundreds of thousands of concurrent users, per-second CA heartbeat, Safe-mode, default URL-block policy) came from the *ZIA* page `about-public-service-edges-internet-saas.md` and described ZIA gateway behavior, not ZPA — they have been removed. Whether any of those scale/Safe-mode behaviors apply to the ZPA broker tier is unconfirmed against a ZPA source.

**Status**: open
**Resolves with**: zscaler doc not yet read (a ZPA-specific Public Service Edge source)

---

### zpa-59 — ZPA Public-tier policy-caching / CA-reconnect semantics

*Origin: `references/zpa/public-service-edges.md` § Open questions*

The Private-SE page states a Service Edge registers with the Private Access Cloud, downloads policies/configurations, and caches path-selection decisions (`vendor/zscaler-help/about-private-service-edges.md:12`), but does not specify cache-invalidation, heartbeat cadence, or any fail-open/fail-closed behavior for the ZPA Public tier. Left unstated rather than imported from ZIA.

**Status**: open
**Resolves with**: zscaler doc not yet read (a ZPA-specific source for Public-tier cache/heartbeat behavior)

---

### zpa-60 — `upgrade_priority` allowed values and effect for the ZPA service-edge tier

*Origin: `references/zpa/public-service-edges.md` § Open questions*

The Python `ServiceEdgeGroup` model exposes `upgrade_priority` (`vendor/zscaler-sdk-python/zscaler/zpa/models/service_edge_groups.py:63`), but no vendor source defines its allowed values or effect for the ZPA tier.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-61 — Authoritative ZPA SAML attribute limit

*Origin: `references/zpa/saml-attributes.md` § Open questions*

The 100-attribute limit is taken from the ZSDK ranges document (`vendor/zscaler-help/zsdk-ranges-limitations.md:64`). No captured ZPA-specific source restates this figure for ZPA, and the SDK service layer does not encode a cap (`vendor/zscaler-sdk-python/zscaler/zpa/saml_attributes.py` exposes pagination but no count limit). Whether ZPA enforces exactly 100 — or a different value — is unconfirmed against a ZPA-specific source.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-62 — `userAttribute` and `delta` SAML-attribute field semantics

*Origin: `references/zpa/saml-attributes.md` § Open questions*

The model carries `userAttribute` (bool) and `delta` fields (`vendor/zscaler-sdk-python/zscaler/zpa/models/saml_attributes.py:36`, `:40`), but neither the SDK docstrings nor the captured help docs define what `userAttribute=true` toggles in policy behavior, nor what `delta` tracks. Note the `add`/`update` docstring describing `saml_name` as "Whether to enable the cloud browser isolation banner" (`vendor/zscaler-sdk-python/zscaler/zpa/saml_attributes.py:203`) is a copy-paste error — the real meaning of `samlName` is the IdP assertion attribute name. The `userAttribute`/`delta` semantics need a non-docstring source.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-63 — Behavior when a `SCIM_GROUP` operand references a deleted group

*Origin: `references/zpa/scim-policy-mapping.md` § Open questions*

A `SCIM_GROUP` operand referencing a deleted group is expected to never match, but the docs do not confirm whether ZPA surfaces an error at policy-evaluation time, at rule-read time, or silently passes. The `all_entries` query parameter on the SCIM-group API suggests deleted groups can be retrieved — whether the policy engine uses the same store is not documented.

**Status**: open
**Resolves with**: lab test (reference a deleted SCIM group in a rule and observe evaluation behavior)

---

### zpa-64 — SCIM group `internal_id` field semantics

*Origin: `references/zpa/scim-policy-mapping.md` § Open questions*

`internal_id` is present on both the Go (`ScimGroup.InternalID` — `vendor/zscaler-sdk-go/zscaler/zpa/services/scimgroup/zpa_scim_group.go:27`) and Python SCIM-group models, but is undocumented. Its relationship to `id` and `idp_group_id` is unclear.

**Status**: open
**Resolves with**: zscaler doc not yet read / tenant snapshot (compare the three ID fields on a real SCIM group)

---

### zpa-65 — `enable_scim_based_policy` false fallback behavior

*Origin: `references/zpa/scim-policy-mapping.md` § Open questions*

When `enableScimBasedPolicy` is false on an IdP controller (`vendor/zscaler-sdk-python/zscaler/zpa/models/idp.py:49`), SCIM criteria are not evaluated for users from that IdP. What the policy engine does with those conditions — skip them (treat as not-present, potentially opening access) vs. evaluate them as false (potentially denying access) — is not stated in available documentation.

**Status**: open
**Resolves with**: lab test (disable the flag and observe how SCIM conditions evaluate)

---

### zpa-66 — SCIM attribute value matching case sensitivity

*Origin: `references/zpa/scim-policy-mapping.md` § Open questions*

The `ScimAttributeHeader` struct exposes a `case_sensitive` bool, and the TF docs note `rhs` must exactly match an observed value. Whether "exactly" is case-insensitive when `case_sensitive = false`, or whether the policy engine applies a different matching rule than the SCIM-attribute-values API, is not documented.

**Status**: open
**Resolves with**: lab test (compare matching with `case_sensitive` true vs false)

---

### zpa-67 — SCIM group membership resolution timing (session vs per-evaluation)

*Origin: `references/zpa/scim-policy-mapping.md` § Open questions*

It is not confirmed whether ZPA re-queries the `userconfig` SCIM store on every policy evaluation within a session, or whether group membership is resolved once at session start and cached for the session. This matters for users added to / removed from a SCIM group mid-session.

**Status**: open
**Resolves with**: lab test (change group membership mid-session and observe whether access changes without re-authentication)

---

### zpa-68 — Isolation policy v2 SCIM_GROUP support

*Origin: `references/zpa/scim-policy-mapping.md` § Open questions*

The Isolation rule v2 resource follows the same TF pattern as the other v2 rule families; `SCIM_GROUP` and SCIM support is inferred but not directly confirmed from the isolation-rule v2 TF source read in this pass.

**Status**: open
**Resolves with**: code read (the isolation-rule v2 operand validators) / lab test

---

### zpa-69 — Segment Group `update_group_v2` vs v1 behavioral difference

*Origin: `references/zpa/segment-server-groups.md` § Open questions*

The Segment Group SDK exposes both `update_group` (`/mgmtconfig/v1`) and `update_group_v2` (`/mgmtconfig/v2`) (`vendor/zscaler-sdk-python/zscaler/zpa/segment_groups.py:206`, `:267`). Both bodies are built identically (`body = {}; body.update(kwargs)`), so the source does not reveal what the v2 endpoint changes behaviorally (field handling, app-association write semantics, validation).

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test (compare v1 vs v2 update results)

---

### zpa-70 — Segment Group `skip_detailed_app_info` effect on writes

*Origin: `references/zpa/segment-server-groups.md` § Open questions*

The field is present on the model (`vendor/zscaler-sdk-python/zscaler/zpa/models/segment_group.py:41`) and round-tripped by `request_format()`, but the service layer does no special handling, so whether it is a request-side toggle (suppress detailed app inflation in the response) or a stored attribute is not determinable from the SDK source alone.

**Status**: open
**Resolves with**: lab test (set the field and inspect the response shape)

---

### zpa-71 — Segment Group `tcpKeepAliveEnabled` admin/runtime effect

*Origin: `references/zpa/segment-server-groups.md` § Open questions*

The wire field is confirmed (string-as-bool) and cross-linked to snapshot-schema, but what enabling TCP keep-alive at the Segment Group level actually changes for brokered sessions is not described in the SDK/model source.

**Status**: open
**Resolves with**: zscaler doc not yet read (a help capture or admin-guide reference)

---

### zpa-72 — Segment Group `config_space` accepted values

*Origin: `references/zpa/segment-server-groups.md` § Open questions*

The Server Group `add_group` docstring enumerates `DEFAULT` / `SIEM` for its `config_space` (`vendor/zscaler-sdk-python/zscaler/zpa/server_groups.py:164`), but the Segment Group model exposes `config_space` without an equivalent enumeration in source. Whether the same value set applies to Segment Groups is unconfirmed.

**Status**: open
**Resolves with**: lab test / zscaler doc not yet read

---

### zpa-73 — `objectType: ZPN_INTERNAL_INTERNET_PROTOCOL` and `USER` wire validity

*Origin: `references/zpa/snapshot-schema.md` § Open questions*

An earlier draft of the operand enum listed `ZPN_INTERNAL_INTERNET_PROTOCOL` and `USER`. Neither is recognized by the current Terraform provider operand validators (`vendor/terraform-provider-zpa/zpa/common.go` — confirmed absent), nor found in the SDK Python/Go policy-operand source, nor in the Postman collection. They may be wire-only API enums the TF provider and SDK don't model, or they may be stale.

**Status**: open
**Resolves with**: lab test (a real GET on `access-policy-rules`) or a Postman/API enum citation confirming whether either appears on the wire

---

### zpa-74 — `tcpKeepAlive` literal wire token (quoted string vs bare integer)

*Origin: `references/zpa/snapshot-schema.md` § Open questions*

SDK and TF both treat `tcpKeepAlive` as a string-as-bool `"0"`/`"1"`, but the Postman `<integer>` type hint leaves open whether the GET response returns the quoted string `"0"` or a bare integer `0`.

**Status**: open
**Resolves with**: tenant snapshot (`jq '.list[0].tcpKeepAlive' _data/snapshot/<cloud>/zpa/app-segments.json`)

---

### zpa-75 — `configSpace` at the segment top level

*Origin: `references/zpa/snapshot-schema.md` § Open questions*

Whether `SIEM` is valid for `configSpace` at the application-segment top level, or only in embedded `serverGroups` / `appResource` objects, is unconfirmed.

**Status**: open
**Resolves with**: tenant snapshot (inspect `configSpace` on a real segment object)

---

### zpa-76 — Which LSS `source_log_type` values require a `policy_rule_resource` block

*Origin: `references/zpa/terraform.md` § Open questions*

Only the User Activity (`zpn_trans_log`) and User Status (`zpn_auth_log`) example docs ship a `policy_rule_resource` block (`vendor/terraform-provider-zpa/docs/resources/zpa_lss_config_user_activity.md:77`); the other LSS docs do not. The prior claim that `zpn_ast_auth_log` and `zpn_pbroker_comprehensive_stats` require the block could not be confirmed from any provider doc and was removed. Which `source_log_type` values actually accept or require the block remains open.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test (apply each LSS config type and observe whether the block is required)

---

### zpa-77 — Tag / tag-group membership referenced in policy rule conditions

*Origin: `references/zpa/terraform.md` § Open questions*

Tags and tag groups are Early Access. Whether `zpa_tag_group` IDs can currently be referenced in policy-rule conditions as an `object_type` is not confirmed from available sources.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-78 — `TRUSTED_NETWORK` `rhs = "false"` runtime semantics

*Origin: `references/zpa/trusted-networks.md` § Open questions*

The TF validator accepts `rhs` values of `"true"` or `"false"` for a `TRUSTED_NETWORK` operand (`vendor/terraform-provider-zpa/zpa/common.go:1122-1125`), but what the policy engine *does* with `rhs = "false"` — i.e. whether it genuinely evaluates "user is NOT on this trusted network" — is undocumented in vendor source. The validators are client-side checks; the server-side evaluation semantic is not stated.

**Status**: open
**Resolves with**: lab test (build a rule with `rhs = "false"` and observe on/off-network matching)

---

### zpa-79 — Provisioning trigger that creates ZPA Trusted Network objects

*Origin: `references/zpa/trusted-networks.md` § Open questions*

ZPA Trusted Network objects are provisioned by Zscaler during network registration and are read-only via API (confirmed: TF exposes a data source, no resource). The exact event that *creates* a Trusted Network object (App Connector deployment vs PSE group config vs ZCC ruleset registration) is not derivable from the SDK/TF source.

**Status**: open
**Resolves with**: zscaler doc not yet read / operator experience

---

### zpa-80 — ZCC→ZPA trusted-network signal at session establishment

*Origin: `references/zpa/trusted-networks.md` § Open questions*

The two-layer model describes ZCC evaluating detection criteria and signaling ZPA at tunnel setup, with ZPA evaluating `TRUSTED_NETWORK` conditions against those signals. The `TRUSTED_NETWORK` object type and operand shape are confirmed in `common.go`, but the runtime signaling path between ZCC and ZPA is not present in any vendored SDK/TF source.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test

---

### zpa-81 — PSE routing / off-network fallback when `is_public = false`

*Origin: `references/zpa/trusted-networks.md` § Open questions*

The claim that `is_public = false` causes remote users to fall back to Public Service Edges describes runtime routing. The `is_public` field and its `"TRUE"`/`"FALSE"` serialization are confirmed in source; the resulting connection-routing behavior is inferred from UI help text, not from code.

**Status**: open
**Resolves with**: zscaler doc not yet read / lab test (observe routing for an off-network user with `is_public = false`)

---

### zcc-76 — OTP expiry / TTL server behavior

*Origin: `references/zcc/otp.md` § Open questions*

Neither `OtpResponse` model carries a TTL, expiry timestamp, or validity-window field (`vendor/zscaler-sdk-python/zscaler/zcc/models/secrets_otp.py:33-45`; `vendor/zscaler-sdk-go/zscaler/zcc/services/secrets/getotp/get_otp.go:15-27`). The "short-lived" characterization is MCP-tool docstring prose only. Whether a ZCC one-time password actually expires server-side — and on what window — is an open behavior question; the skill should not assert a TTL it cannot source.

**Status**: open
**Resolves with**: lab test (fetch an OTP, attempt the action after a delay, observe whether it is rejected) OR zscaler doc not yet read

---

### zdx-01 — Probe-ID non-portability server behavior

*Origin: `references/zdx/diagnostics-and-alerts.md` § Open questions*

ZDX `web_probe_id` / `cloudpath_probe_id` are read via device+app-nested paths (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:358-361`, `:486-489`), so a probe ID is implicitly scoped to one (device, app) pair. The non-portability is *inferred* from that nesting, not from a stated validation rule. The actual API behavior when a probe ID from one (device, app) pair is submitted against another pair — silent empty result, error, or cross-match — is not stated in source.

**Status**: open
**Resolves with**: lab test (submit a probe ID against a mismatched device/app pair, observe the API response)

---

### zdx-02 — Concurrent deeptrace session limits

*Origin: `references/zdx/diagnostics-and-alerts.md` § Open questions*

The deeptrace session-length set is resolved (5/15/30/60 min), but how many concurrent deeptrace sessions a tenant — or a single device — may run at once is not stated in any cited source file. Relevant to "why was my new trace rejected while another was running" questions.

**Status**: open
**Resolves with**: lab test (start overlapping deeptrace sessions, observe when one is rejected) OR zscaler doc not yet read

---

### zms-01 — fetchAll beyond policyRules

*Origin: `references/zms/api.md` § Open questions*

ZMS `fetchAll` (Python `fetch_all`) is implemented only on `policyRules` (`vendor/zscaler-sdk-python/zscaler/zms/policy_rules.py:45`, `:55`, `:75`, `:81`). No other ZMS list method (resources, resource_groups, app_zones, app_catalog, tags, agents, agent_groups, nonces) carries the argument, and no source states `fetchAll` exists for them server-side. Whether the GraphQL server actually accepts a `fetchAll` argument on other list queries — i.e. whether this is a client-SDK gap or a true server constraint — is unresolved (single-source Python SDK; no Go ZMS service exists to cross-check).

**Status**: open
**Resolves with**: SDK re-check on a future release OR lab test (issue a `fetchAll` argument against a non-policyRules query, observe whether the server accepts it)

---

### easm-01 — Finding scan_type allowed values

*Origin: `references/easm/findings.md` § Open questions*

EASM finding `scan_type` is present as a model attribute (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:84`) but the source gives no enumeration, validator, or docstring describing its possible values — the model passes through whatever the API returns. The concrete value set is unverified, so the skill cannot map a `scan_type` value to a finding-source meaning.

**Status**: open
**Resolves with**: tenant snapshot (read live findings and collect observed `scan_type` values) OR zscaler doc not yet read

---

### easm-02 — Finding risk-field value semantics

*Origin: `references/easm/findings.md` § Open questions*

EASM finding risk fields — `risk_level` / `severity_score` / `status` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:82-86`), `cisa_likelihood` (`:70`), and `epss_likelihood` (`:73`) — carry no value enumerations, validators, or docstrings in the SDK model. The CISA-KEV reading of `cisa_likelihood` and the EPSS-probability reading of `epss_likelihood` (0–1?) are not stated in source. The actual value sets and units are unverified, so the skill cannot interpret a finding's risk posture from these fields alone.

**Status**: open
**Resolves with**: tenant snapshot (collect observed values across live findings) OR zscaler doc not yet read

---

### zia-51 — Cross-SDK parity drift and Python devicegroups write-path

*Origin: `references/zia/api.md` § Open questions*

Two related ZIA SDK-surface questions. First, cross-SDK parity is a moving target: the 2026-06-15 re-sweep confirmed the Go-only surfaces (`scim_api`, `eventlogentryreport`, `devicegroups`-write, and the now-regressed `email_profiles`) against the current Python tree, but parity drifts release-to-release in both directions (`email_profiles` landing in Python is the example). Whether any surface beyond the four named has since gained a Python counterpart was spot-checked, not exhaustively diffed. Second, Python's `device_management.py` exposes `list_device_groups` (read) only, with no create/update/delete (`vendor/zscaler-sdk-python/zscaler/zia/device_management.py:38`); whether the `/deviceGroups` API supports group-level writes that simply aren't wrapped in the Python SDK yet — vs being a Go-SDK-exclusive capability — is not source-verifiable from the SDK layer alone.

**Status**: open
**Resolves with**: code read (full `vendor/zscaler-sdk-go/zscaler/zia/services/` vs `vendor/zscaler-sdk-python/zscaler/zia/` module diff, re-run each vendor refresh) OR lab test (attempt a `/deviceGroups` write against a live tenant)

---

### zia-52 — ipsSignatureRules import wire behavior and multipart field name

*Origin: `references/zia/api-schemas.md` § Open questions; `references/zia/legacy-endpoints.md` § Open questions*

The Go SDK defines the custom IPS signature rules import + import-status path (`GET`/`POST /ipsSignatureRules/import`) but ships both functions commented out, annotated as broken upstream (`vendor/zscaler-sdk-go/zscaler/zia/services/ips_control_policies/ips_signature_rules/ips_signature_rules.go:296-359`). The struct shapes are documented from source, but the actual wire behavior on a current tenant — and the exact multipart field name the gateway expects (the SDK comment guesses `file`, with `csvFile`/`import`/`uploadFile` as untested alternates) — is not confirmable from source alone.

**Status**: open
**Resolves with**: lab test (call `POST /ipsSignatureRules/import` against a live tenant, capture the accepted multipart field name and response)

---

### zia-53 — CAC atomic-validation contract and representative-app action quirk

*Origin: `references/zia/api-divergences.md` § Open questions*

Two Cloud App Control behaviors are documented only in MCP-server tool docstrings, confirmed absent from both SDKs, and so are observation-only until live-tenant confirmation. First, the atomic-validation contract: a per-app-invalid action is said to reject the whole create with `INVALID_INPUT_ARGUMENT` / "Invalid action provided for selected applications", motivating a one-rule-per-app safe pattern. Second, the representative-app quirk: `list_available_actions(rule_type, cloud_apps)` is said to surface the action list only when `cloud_apps` contains a "representative" app for the category — e.g. `rule_type=SYSTEM_AND_DEVELOPMENT, cloud_apps=[AZURE_DEVOPS]` returns `[]` even though the category has 11 actions, while `cloud_apps=[GITHUB]` returns the full set (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/cloud_app_control.py:311-318`). The "11 actions" count and the AZURE_DEVOPS-vs-GITHUB example are MCP-docstring claims, not in any SDK. This is the API-divergence framing of the same gap `zia-49` tracks at the action-validity level.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: lab test (probe a live tenant: submit a mixed-validity multi-app create to observe the atomic-rejection behavior; call `list_available_actions` with non-representative vs representative apps to confirm the empty-vs-full response)

**2026-06-18 narrowing**: the Automate contract now corroborates a broad category-level Cloud App Control action vocabulary on `webApplicationRules/:rule_type`, with `actions` represented as a contract-only enum in the generated ZIA divergence report (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json:2134-2137`, `:2174-2186`, `:2356-2362`). That improves the static action-vocabulary footing, but the atomic multi-app rejection behavior and the representative-app empty/full response quirk remain MCP-observation-only until tested against a tenant.

---

### zia-54 — Python cloudAppRiskProfile list-vs-single shape

*Origin: `references/zia/api-divergences.md` § Open questions*

In the Python SDK the CAC rule model decodes `cloudAppRiskProfile` as a *list* (`vendor/zscaler-sdk-python/zscaler/zia/models/cloudappcontrol.py:115-117`, `form_list(..., ResourceReference)`) but the request serializer calls `.request_format()` on it as if it were a *single* object (`:220`). This is a code-shape inconsistency observed by reading source; it was not executed to confirm whether it actually raises at runtime (a list has no `.request_format()` method, so it plausibly does) or whether normalization elsewhere papers over it. Until run, the skill should not assert how a `cloudAppRiskProfile` write actually behaves through the Python SDK.

**Status**: open
**Resolves with**: code read / lab test (run the Python SDK path with a `cloudAppRiskProfile` populated, observe whether `.request_format()` raises)

---

### zia-55 — Admin audit report pagination and targetOrgId semantics

*Origin: `references/zia/audit-logs.md` § Open questions*

Two open items on the ZIA admin audit log report endpoint. First, pagination: the request schema carries `page` / `pageSize` (`vendor/zscaler-sdk-go/zscaler/zia/services/eventlogentryreport/eventlogentryreport.go:36-37`), but the admin audit report uses an async request model (POST to queue → poll status → GET download) rather than a direct paginated list, and whether the downloaded CSV itself is paginated or returned in full is not confirmed. Second, `targetOrgId`: the admin-audit-log Go struct includes `TargetOrgId` (`vendor/zscaler-sdk-go/zscaler/zia/services/adminauditlogs/adminauditlogs.go:34`), suggesting MSP/partner-mode audit access across managed organizations, but the full semantics are not confirmed from available sources.

**Status**: open
**Resolves with**: lab test (run an admin audit report export, inspect whether the CSV is full or paged) OR tenant snapshot (MSP-mode tenant to confirm `targetOrgId` behavior)

---

### zia-56 — Bandwidth class type enum vs UI predefined classes, and cap enforcement

*Origin: `references/zia/bandwidth-control.md` § Open questions*

Three open items on Bandwidth Control classes. First, the help docs describe predefined, non-deletable classes (Social Media, Streaming, File Share, Business Apps) while the SDK/TF expose a `type` field with values like `BANDWIDTH_CAT_WEBCONF` / `BANDWIDTH_CAT_VOIP` (`vendor/terraform-provider-zia/zia/resource_zia_bandwidth_classes_web_conferencing.go:94-95`); whether these typed flavors are the same objects as the UI predefined classes or an orthogonal axis is not stated in any source opened in this pass. Second, the full enumeration of class `type` values is not pinned — only the file-size and web-conferencing/VOIP types appear with explicit constants; the general `zia_bandwidth_classes` resource does not pin a `type` constant, so whether other values exist (and the API default for a plain class) is not in captured source. Third, the class-count and rule-count caps (245 custom classes / 8 classes-with-domains / 25,000 domains / 125 rules) come only from the help *Ranges and Limitations* doc; no SDK or TF source encodes or validates them, so whether the API rejects over-limit creates or enforcement is UI-only is unconfirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read (per-class `type` reference) OR lab test (create over the documented caps and a plain class, observe the API default and whether limits are enforced)

---

### zia-57 — FTP and File Type Control field-dependency and enum surfaces

*Origin: `references/zia/content-inspection-extras.md` § Open questions*

Four source-unresolvable items on the content-inspection surfaces. (1) Whether a per-site FTP Control rule layer exists outside the SDK — the help docs describe FTP Control with multiple levels and per-site access (`vendor/zscaler-help/about-ftp-control.md:17-21`) but the SDK exposes only the tenant-wide `/ftpSettings` object (`vendor/zscaler-sdk-python/zscaler/zia/ftp_control_policy.py:35`, `:77`); whether per-site FTP allow/deny lives elsewhere (URL Filtering on FTP-protocol conditions, or a UI-only surface) is not determinable from SDK source. (2) The File Type Control `filtering_action`-to-field dependency contract is not encoded in source — `min_size`/`max_size`/`operation`/`active_content`/`unscannable`/`password_protected` are flat kwargs with no client-side validation tying any to a `filtering_action` value, so which combinations the API accepts/rejects (e.g. whether `active_content` is meaningful with `ALLOW`) is unstated. (3) The full `file_types` enum is not statically available — the model treats it as a free string list (`vendor/zscaler-sdk-python/zscaler/zia/models/filetyperules.py:77`); the complete token set is returned at runtime by `/fileTypeCategories`, not hardcoded. (4) The `protocols` value set is only partially confirmed — `HTTP_RULE`/`HTTPS_RULE`/`FTP_RULE` are confirmed from help (`vendor/zscaler-help/about-file-type-control.md:29`), but the model stores `protocols` as an unconstrained string list (`vendor/zscaler-sdk-python/zscaler/zia/models/filetyperules.py:49`) with no enum, so whether additional tokens are accepted is undeterminable from this source.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: lab test (read `/fileTypeCategories` and probe `filtering_action`/field and `protocols` combinations on a live tenant) OR zscaler doc not yet read (FTP Control configuration reference)

**2026-06-18 narrowing**: the Automate contract/reconciler now captures a static documented `fileTypes` vocabulary for `POST /zia/api/v1/fileTypeRules`; the generated report shows `filteringAction`, `operation`, and `state` as enum matches, and `fileTypes` as a contract-only enum beginning with `ANY`, `NONE`, and `FTCATEGORY_*` values and ending at `FTCATEGORY_TS` (`vendor/zscaler-api-specs/automate-zscaler/zia-divergences.json:4754-4757`, `:4795-4805`, `:5084-5091`). That resolves the "no static enum source" sub-question for `fileTypes`. It does not resolve FTP per-site scope, field-dependency validation, or whether `protocols` accepts any values beyond `HTTP_RULE`, `HTTPS_RULE`, and `FTP_RULE`.

---

### zia-58 — DLP web rule action/severity enums, parent/sub-rule composition, EXTERNALDLP behavior

*Origin: `references/zia/dlp.md` § Open questions*

Several DLP web-rule behaviors are not pinned by SDK source. The `action` and `severity` fields are free strings with no enum declared (`vendor/zscaler-sdk-python/zscaler/zia/models/dlp_web_rules.py:49`, `:61`), so the concrete wire sets (help-doc prose names ALLOW / BLOCK / CONFIRM behaviorally; the severity bands) are unconfirmed from SDK. The rule model exposes a `parent_rule` / `sub_rules` hierarchy (`:62-63`) but the SDK does not document how sub-rule evaluation composes with the flat first-match-wins / Evaluate-All-Rules order from the help docs, nor how a parent match interacts with its sub-rules' actions. The `without_content_inspection` (EXTERNALDLP) variant is SDK-confirmed as a distinct no-content-inspection rule (`:53-55`) but what it keys on instead of payload content, and which forwarding surfaces it pairs with, is not pinned. Adjacent doc-level questions also remain: confidence-score-to-confidence-level numeric mapping for predefined dictionaries, whether MIP label matching requires Microsoft 365 integration on the Zscaler side, Evaluate-All-Rules terminal-action semantics when Block and Allow rules both fire, and EDM operational mechanics — all needing tenant tuning or help articles not yet vendored.

**Status**: open
**Resolves with**: lab test (read live rules to enumerate `action`/`severity` values and observe parent/sub-rule + EXTERNALDLP behavior) OR zscaler doc not yet read (DLP rule and Exact Data Matching reference articles)

---

### zia-59 — Plain REDIR_REQ dns_gateway requirement and edns_ecs_object/ZPA pairing

*Origin: `references/zia/dns-control.md` § Open questions*

Two DNS Control action-binding questions beyond `zia-47`/`zia-48`. First, whether plain `REDIR_REQ` requires a `dns_gateway`: the Go validator binds `dns_gateway` to `REDIR_REQ_KEEP_SENDER`, `REDIR_REQ_DOH`, `REDIR_REQ_TCP`, and `REDIR_REQ_UDP` but *not* to plain `REDIR_REQ` (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:267-280`); whether the bare action needs one is not stated in source. Second, whether `edns_ecs_object` is tied to the `REDIR_ZPA` action: no source binds `edns_ecs_object` to `REDIR_ZPA` (or any action) — it is a general resolution field (`vendor/zscaler-sdk-go/zscaler/zia/services/firewalldnscontrolpolicies/firewalldnscontrolpolicies.go:109-110`), so the `zpa_ip_group` + `edns_ecs_object` pairing for `REDIR_ZPA` is not verifiable from vendor source.

**Status**: open
**Resolves with**: lab test (submit a `REDIR_REQ` rule with and without a `dns_gateway`, and a `REDIR_ZPA` rule with/without `edns_ecs_object`, observe what the API requires)

---

### zia-60 — Network Service type behavior, country/category enums, and caps

*Origin: `references/zia/firewall.md` § Open questions*

Several firewall-surface items could not be backed from any vendor file in this pass. (1) `STANDARD` vs `PREDEFINED` Network Service `type` behavior — no `STANDARD`/`PREDEFINED` literal appears in SDK service/model source; only the MCP docstring lists all three (`vendor/zscaler-mcp-server/zscaler_mcp/tools/zia/network_services.py:136`) and only `CUSTOM` appears as a concrete value, so the wire-level distinction is unverified. (2) Valid country-code format — only example values `COUNTRY_CA` / `COUNTRY_US` appear (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:431`, `:469`); the full `COUNTRY_*` enum is not enumerated. (3) Allowed custom URL-category identifiers — `ip_categories` is documented as "Only Custom categories allowed" with example `CUSTOM_01` (`vendor/zscaler-sdk-python/zscaler/zia/cloud_firewall.py:430`) but no source enumerates or validates the allowed identifiers. (4) `DSTN_DOMAIN` field requirement — it appears only in the four-value enum lists with no example or per-type field rule (vs `DSTN_FQDN` using `addresses`). (5) `tag` and `creatorContext` semantics — both exist on the Python Network Service model (`vendor/zscaler-sdk-python/zscaler/zia/models/cloud_firewall_nw_service.py:34`, `:36`) but carry no description or allowed-values documentation. (6) Caps and ordering — no mined source states a hard cap on addresses per destination group or ports per network service, nor a precedence rule among the four port arrays.

**Status**: open
**Resolves with**: lab test (read live network services / destination groups to observe `type`, country, and category values and any caps) OR zscaler doc not yet read (Network Services and IP Destination Groups reference)

---

### zia-61 — ATP/Malware tenant defaults, singleton interdependence, capture-vs-denylist

*Origin: `references/zia/malware-and-atp.md` § Open questions*

Several Malware Protection / Advanced Threat Protection behaviors are not backed by vendor source. Default tenant state of any ATP/Malware toggle is not stated: the Python ATP model defaults absent fields to `None` (`vendor/zscaler-sdk-python/zscaler/zia/models/advanced_threat_settings.py:113-160`) and the MalwareSettings model defaults to `False` (`vendor/zscaler-sdk-python/zscaler/zia/models/malware_protection_settings.py:62-77`), but these are client-side construction defaults, not stated API/tenant defaults. Server-side validation rules are not stated beyond `risk_tolerance`'s 0-100 range (`vendor/zscaler-sdk-go/zscaler/zia/services/advancedthreatsettings/advancedthreatsettings.go:18-20`) — e.g. whether `blocked_countries` is validated against ISO 3166 server-side is unstated. The interdependence of the four malware singletons is undocumented (source does not say whether turning off inspection direction disables threat-class enforcement; they are independent endpoints per structure only). The relationship between `maliciousUrlsCapture` (a PCAP toggle inside the ATP settings block, `vendor/zscaler-sdk-python/zscaler/zia/models/advanced_threat_settings.py:111`) and the separate `maliciousUrls` denylist endpoint is not explained, and `dgaDomainsCapture` (`:110`) has no `dgaDomainsBlocked` `*Capture` partner — source asserts no significance to the ordering. Whether `cyberThreatProtection` PUTs auto-activate is not stated in the SDK (the "staged until activation" note is MCP-tooling plumbing, not product API behavior). Adjacent: whether MP/ATP PCAP traffic is API-accessible (vs console-only), and the recommended Malware Protection Policy content (image-only on the live help page), are undocumented in captured source.

**Status**: open
**Resolves with**: lab test (read a fresh tenant's ATP/Malware settings to observe shipped defaults and whether PUTs auto-activate; probe `blocked_countries` validation) OR zscaler doc not yet read (ATP/Malware policy reference and recommended-content page)

---

### zia-62 — PSE shared-NAT rejection, ZIA-only health monitoring, hardware-PSE API

*Origin: `references/zia/private-service-edge.md` § Open questions*

Three Private Service Edge questions the captured help pages do not settle. (1) Whether shared / overloaded (PAT) NAT breaks a PSE or only forfeits IPv6 — the source states PSE IPs "must have 1:1 static NAT to a public IP" with IPv6 unsupported in that mode (`vendor/zscaler-help/understanding-private-service-edge-internet-saas.md:99`) but does not explicitly say a shared/overloaded mapping is rejected; the stronger "not supported" claim was removed from the doc pending confirmation. (2) What PSE health monitoring a ZIA-only (no-ZDX) tenant gets — the source confirms the PSE Health Dashboard requires ZDX (`:24`) but does not describe the fallback; an earlier "falls back to Cloud Ops telemetry + standard Admin Console" claim was removed as unbacked. (3) Whether there is an SDK/API surface for hardware PSE (PSE 3 / PSE 5) provisioning — the ZIA SDKs ship `vzen_clusters` / `vzen_nodes` for the Virtual Service Edge but no hardware-appliance provisioning service was found, consistent with the Support-ticket Location-binding path, though worth re-checking against newer SDK releases before treating "no API" as permanent.

**Status**: open
**Resolves with**: zscaler doc not yet read (PSE deployment / NAT and health-monitoring articles) OR support ticket (shared-NAT and ZIA-only monitoring) OR code read (newer SDK release for a hardware-PSE service)

---

### zia-63 — Sandbox MD5 blocklist quota, help-portal enum, and the MP/ATP diagnosis API gap

*Origin: `references/zia/sandbox.md` § Open questions*

Three Sandbox items remain open. (1) MD5 blocklist quota: the SDK exposes `RemainingFileHashes` (`vendor/zscaler-sdk-go/zscaler/zia/services/sandbox/sandbox_settings/sandbox_settings.go:20`, read via `/fileHashCount` at `:80`) but neither SDK encodes the absolute ceiling or whether it is subscription-tiered; the cap is observable per-tenant at runtime but the policy behind it is unbacked by vendored source. (2) Help-portal framing of the custom MD5 block list: the section is SDK-derived (Python + Go); how Zscaler's help portal names/positions this surface, and whether the `type` enum values (`CUSTOM_FILEHASH_DENY` / `CUSTOM_FILEHASH_ALLOW`) are the documented set vs SDK-internal, is not captured — confirm against help before treating the enum as exhaustive. (3) The MCP server documents that there is no API for Malware Protection or ATP block diagnosis (only the console Traffic Capture UI); the skill should surface this gap when users hit either policy type. (The Sandbox quota-units question was resolved 2026-04-24 — `RatingQuota` is a time-bounded report-retrieval count.)

**Status**: open
**Resolves with**: lab test (read `/fileHashCount` on tenants of different Sandbox tiers to bound the MD5 ceiling) OR zscaler doc not yet read (Sandbox custom-hash help article confirming the `type` enum)

---

### zia-64 — SCIM department matching, attribute length, active=false session-kill, and caps

*Origin: `references/zia/scim-provisioning.md` § Open questions*

Five ZIA SCIM behaviors are not backed by any mined vendor file. (1) Department name with no matching ZIA department object — the `department` string is matched by name against an existing ZIA department; whether ZIA matches-or-fails (silent no-association) or matches-or-creates a new department on no match is unstated. (2) Attribute value length limits — no source states a max character length for individual SCIM attribute values such as `displayName` or `department`. (3) Per-IdP Enterprise User extension mapping — how Entra ID vs Okta vs PingFederate populate the enterprise extension for `department` lives in per-IdP configuration guides not captured. (4) `active=false` and live session termination — whether disabling a user via `active=false` immediately terminates that user's active ZIA inspection session, or only blocks future authentication, is undocumented; for immediate revocation, do not rely on SCIM `active=false` alone. (5) SCIM-specific rate limits and tenant caps — no published per-tenant max-users / max-groups cap or SCIM-endpoint rate-limit guidance was found.

**Status**: open
**Resolves with**: lab test (send SCIM operations against a live tenant: unmatched department, oversized attribute, `active=false` mid-session, bulk provisioning to find caps) OR zscaler doc not yet read (per-IdP SCIM configuration guides)

---

### zia-65 — UCaaS One-Click toggle field location

*Origin: `references/zia/snapshot-schema.md` § Open questions*

The snapshot doc's "Check One-Click bypass states" jq query probes `enableMsftO365`, `enableZoom`, `enableWebex` under `advanced-settings.json`, but those exact UCaaS One-Click toggles are listed as absent from the Z2 tenant snapshot and are not present in the current SDK advanced-settings model (a grep of `vendor/zscaler-sdk-python/zscaler/zia/models/advanced_settings.py` returns no such attributes). The query returns `null` for those keys on a real snapshot. Whether these toggles live on a separate endpoint (e.g. a dedicated SaaS / One-Click app-control settings resource) or are tier-gated is unresolved — needs a tenant where they are enabled to confirm the correct field names / location.

**Status**: open
**Resolves with**: tenant snapshot (a tenant with the UCaaS One-Click apps enabled, to locate the real field names/endpoint) OR zscaler doc not yet read

---

### zia-66 — Whether the 255 SSL Inspection rule cap is raisable

*Origin: `references/zia/ssl-inspection.md` § Open questions*

The ranges-and-limitations capture lists "255 rules (245 custom + 10 predefined)" for SSL Inspection Policy Rules with no raise annotation (`vendor/zscaler-help/ranges-limitations-zia.md:190`), whereas the adjacent "All Other Policy Rules" row is explicitly annotated "→ 2,048 via support" (`:191`). Absence of an annotation is not proof the SSL cap is fixed; an earlier doc assertion that "the cap is NOT raisable" had no source and was removed. Whether the 255 SSL Inspection cap can be raised via Support is unverified.

**Status**: open
**Resolves with**: zscaler doc not yet read (a Zscaler limits source stating the SSL Inspection cap is fixed or raisable) OR support ticket

---

### zia-67 — Tenant Profile per-app wire mechanic and v1/v2 protocol semantics

*Origin: `references/zia/tenant-profiles.md` § Open questions*

Tenant-restriction wire mechanics are documented by the SaaS vendors but not by any vendored Zscaler source (a grep of `about-tenant-profiles.md` / `adding-tenant-profiles.md` returns zero hits for "header", "Restrict-Access", "X-GoogApps", or "inject"). (1) Microsoft 365: Microsoft defines the `Restrict-Access-To-Tenants` and `Restrict-Access-Context` request headers, presumed injected by ZIA into the inspected login flow — only the SSL-inspection prerequisite is confirmed in Zscaler source. (2) Google Workspace: Google defines the `X-GoogApps-Allowed-Domains` header for the same purpose — same status. (3) v1 vs v2 protocol semantics: the `ms_login_services_tr_v2` flag selects "v2 for tenant restriction on MSLOGINSERVICES" (`vendor/terraform-provider-zia/zia/resource_zia_tenant_restriction_profile.go:100-103`) and the limits table distinguishes v1 (Tenant Directory ID, up to 64 chars) from v2 (Tenant Directory ID:Policy ID, up to 256 chars — `vendor/zscaler-help/ranges-limitations-zia.md:260-261`), but what the two protocol versions differ in on the wire, and which Microsoft tenants require v2, is not described in vendored source.

**Status**: open
**Resolves with**: zscaler doc not yet read (a Zscaler tenant-restriction header-mechanic article and a v1-vs-v2 configuration guide) OR lab test (capture the injected headers post-decrypt)

---

### zia-68 — Terraform url_categories_predefined EA gating, sandbox v1/v2 endpoint, static-IP throttle

*Origin: `references/zia/terraform.md` § Open questions*

Three Terraform-provider items remain unresolved. (1) `zia_url_categories_predefined` Early Access status and tenant-eligibility criteria are not documented in the provider source; availability may vary by ZIA edition and cloud environment. (2) `zia_sandbox_behavioral_analysis_v2` — the relationship between v1 and v2 (same underlying API endpoint or separate) is not confirmed; both resources import using the same static ID `"sandbox_settings"` (`vendor/terraform-provider-zia/zia/resource_zia_sandbox_behavioral_analysis_advanced_settings.go:41`), which may cause state conflicts if both are declared in one configuration. (3) `zia_traffic_forwarding_static_ip` per-endpoint POST throttle — a prior "1 POST/sec" gotcha was removed (no vendored source backs a per-second figure; it is absent from provider docs, the static-IP resource, both SDKs, and `ranges-limitations-zia.md`, which only caps Static IP Address Entries per Organization at 100). The only SDK-backed limit is the client-wide 10 POST/PUT/DELETE + 20 GET per 10-second window; whether the `/staticIP` POST path carries a stricter per-endpoint throttle is unconfirmed (`-parallelism=1` retained only as conservative bulk-create guidance).

**Status**: open
**Resolves with**: zscaler doc not yet read (URL-categories Early Access eligibility; Sandbox behavioral-analysis v1-vs-v2 endpoint mapping) OR lab test (bulk-POST `/staticIP` to detect any per-endpoint throttle)

---

### zia-69 — Workload-group runtime expression evaluation, expressionJson sync, and tag-type enum

*Origin: `references/zia/workload-groups.md` § Open questions*

Workload-group field shapes are SDK/TF-confirmed but their runtime semantics are not backed by any source. (1) Live-traffic match evaluation — how the ZIA backend evaluates a built expression against actual workload traffic (left-to-right, precedence, short-circuiting) is undocumented across SDK, TF, MCP, and Postman. (2) `expression` (string) vs `expression_json` sync on write — whether ZIA keeps the human-readable string in sync when only the JSON form is written, and whether the JSON form (`vendor/terraform-provider-zia/zia/resource_zia_workload_groups.go:66`) is truly the canonical write form, is not confirmed; the TF resource omits the string form on write. (3) Parentheses runtime behavior — even granting `OPEN_PARENTHESES` / `CLOSE_PARENTHESES` are a TF-only operator enum (`vendor/terraform-provider-zia/zia/resource_zia_workload_groups.go:94`), how ZIA consumes them to build a precedence-grouped expression is unexplained. (4) Whether the 255-groups-per-rule cap is a real API limit — it comes from the shared `setIdNameSchemaCustom(255, ...)` helper used by the policy resources (`vendor/terraform-provider-zia/zia/common.go:113`, applied e.g. at `vendor/terraform-provider-zia/zia/resource_zia_ssl_inspection_rules.go:361`), a TF provider convention; no SDK comment or API reference confirms server-side enforcement. (5) Tag-type enum completeness — the values `ANY`/`VPC`/`SUBNET`/`VM`/`ENI`/`ATTR` come from the TF `ValidateFunc` (`vendor/terraform-provider-zia/zia/resource_zia_workload_groups.go:80-85`); their exact semantics, and whether the list is exhaustive, are inferred from SDK docstring examples, not authoritatively documented.

**Status**: open
**Resolves with**: lab test (build workload-group expressions with parentheses and mixed operators, write JSON-only, read back to observe string sync and any cap enforcement) OR zscaler doc not yet read (workload-group expression-evaluation and tag-type reference)

---

### zia-70 — `dlp_web_rules` live read returns undocumented `ucTemplateId`

*Origin: live ZIA `web_dlp_rules` read observation*

A live ZIA `web_dlp_rules` GET returns a flat integer field `ucTemplateId` that appears in no captured source. The Go SDK models the notification template as `EUNTemplateID int` (wire `eunTemplateId`, `vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_web_rules/dlp_web_rules.go:78`) plus `NotificationTemplate *common.IDCustom` (`:90`); the Postman-derived schema's `WebDLPRules` table carries both `eunTemplateId` and the `notificationTemplate` object (`references/zia/api-schemas.md:1488,:1492`); and the automate.zscaler.com DLP-web-rule reference documents the template as the `notificationTemplate` object, with no flat template id (`vendor/zscaler-help/automate-zscaler/api-reference/zia/data-loss-prevention/web-dlp-rule-resource-add-rule.txt:122`). `ucTemplateId` is in none of them — an API-only name absent from every static surface (SDK, Postman, Automate reference).

**Status**: open
**Resolves with**: lab test (read a DLP web rule with a notification template set; observe whether the payload also carries `notificationTemplate`/`eunTemplateId` with the same id and whether `ucTemplateId` holds a non-zero value — co-occurrence ⇒ redundant flat alias, sole template id ⇒ live rename of `eun_template_id`) OR zscaler confirmation of the field's meaning

---

### cloud-connector-01 — Per-region status representation (RegionStatus.status)

*Origin: `references/cloud-connector/aws-workload-discovery.md` § Open questions*

The Go workload-discovery `RegionStatus.status` field is typed as a boolean, while the captured console help text shows four string states (`Success` / `Disabled` / `Error` / `Starting Discovery`). Whether the API actually returns a richer status that the Go SDK under-models (boolean only) — or the console derives the four strings from a boolean plus other fields — is unresolved. Until this is settled the skill cannot map a workload-discovery region row to one of the four console states from the SDK shape alone.

**Status**: open
**Resolves with**: code read (a future SDK release may widen the type) OR lab test (read a region in each console state via the API, observe the wire value)

---

### cloud-connector-02 — AWS workload-discovery CloudFormation body (EventBridge / IAM / SQS)

*Origin: `references/cloud-connector/aws-workload-discovery.md` § Open questions*

Three AWS workload-discovery details live inside the CloudFormation template that the setup flow deploys, and the template is referenced by URL only — its rendered body is not reproduced as text in any captured source: (1) the EventBridge rule's event-pattern JSON (which EC2/ECS/Lambda event types are matched) and the cross-account target ARN format — the `eventBusName` field is API-modeled but the pattern is not; (2) the IAM permission document the template installs; (3) the SQS permissions added by the "Update the Cloud Connector Role for SQS Permissions" setup step, including the queue-ARN detail. None of these has an SDK or Terraform surface to recover them from.

**Status**: open
**Resolves with**: zscaler doc not yet read (render the linked CloudFormation template body) OR operator experience (inspect a deployed stack)

---

### cloud-connector-03 — Source IP group size and count limits

*Origin: `references/cloud-connector/source-ip-groups.md` § Open questions*

No captured source states an upper bound on (a) the number of address entries a single `ztc_ip_source_groups` group may hold, or (b) the number of source IP groups a tenant may define. The SDK struct and Terraform schema (`vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/ipsourcegroups/ipsourcegroups.go`; `vendor/terraform-provider-ztc/docs/resources/ztc_ip_source_groups.md`) impose no documented cap. Relevant to capacity planning and to explaining a rejected create.

**Status**: open
**Resolves with**: support ticket (Zscaler confirms platform limits) OR lab test (grow a group / group count until the API rejects)

---

### cloud-connector-04 — IPv6 entries in ztc_ip_source_groups vs a separate IPv6 group object

*Origin: `references/cloud-connector/source-ip-groups.md` § Open questions*

Whether the `ip_addresses` field on `ztc_ip_source_groups` accepts IPv6 CIDR notation is unconfirmed. The forwarding-rule struct carries dedicated IPv6 group fields on both sides — `SrcIpv6Groups` and `DestIpv6Groups`, parallel to the IPv4 `SrcIpGroups` / `DestIpGroups` (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:124,132`) — distinct from the IPv4 group fields. It is unclear whether those IPv6 fields reference the same `ztc_ip_source_groups` object type or a separate IPv6-specific group resource, and therefore whether IPv6 source addresses are configured in the same group object or a different one.

**Status**: open
**Resolves with**: lab test (create a group with an IPv6 CIDR, reference it from `srcIpv6Groups`, observe acceptance) OR code read (a future SDK/TF release may expose an IPv6 group type)

---

### cloud-connector-05 — source_ip_group_exclusion applicability to Cloud & Branch Connector

*Origin: `references/cloud-connector/source-ip-groups.md` § Open questions; `references/cloud-connector/api-divergences.md` § Open questions*

The forwarding-rule SDK struct comment marks `SourceIpGroupExclusion` "Not applicable to Cloud & Branch Connector," yet the Terraform provider exposes it as a configurable boolean. Whether the backend honors a set value on a CC `ecRdr` rule, rejects it, or silently ignores it is unresolved — the SDK comment and the TF schema disagree, and the wire behavior is not recoverable from source.

**Status**: open
**Resolves with**: lab test (set `source_ip_group_exclusion` on a CC forwarding rule, observe whether the backend applies, rejects, or ignores it)

---

### cloud-connector-06 — ZIA-origin source groups: editability from ZTC and lite payload shape

*Origin: `references/cloud-connector/source-ip-groups.md` § Open questions*

Two related gaps on source IP groups: (1) whether groups created in ZIA (`creator_context = "ZIA"`) can be modified through the ZTC provider/API or only via ZIA is not confirmed; (2) the `/ipSourceGroups/lite` response is only confirmed to return `id`+`name` — whether it also includes additional fields such as `creator_context` is not documented in captured sources.

**Status**: open
**Resolves with**: lab test (attempt a ZTC update of a ZIA-origin group; read a `/lite` response and inspect its fields) OR zscaler doc not yet read

---

### cloud-connector-07 — ZTG vs Cloud Connector group type semantics

*Origin: `references/cloud-connector/overview.md` § Open questions*

The exact distinction between a "ZTG" group type and a "Cloud Connector" group type is not documented in captured articles. It is likely a naming evolution, but whether the two denote different object types, different capabilities, or simply old vs new terminology for the same construct is unresolved.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test (inspect both group types in a tenant)

---

### cloud-connector-08 — HA mechanics: cchealth port, fail-open/close toggle, fail-open egress path

*Origin: `references/cloud-connector/overview.md` § Open questions*

Three high-availability mechanics are named in the captured HA help article but not pinned down: (1) whether the `?cchealth` probe port is configurable and over what range — the article says only "configured during deployment" (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.md:30`); (2) where in the admin portal the fail-open / fail-close toggle lives — the article says "customers can change this configuration" without naming the path (`:51`); (3) what the fail-open egress path actually is — the source says fail-open lets "workloads that are accessing the internet to continue doing so" yet also that "the egressing traffic is flowing through Zscaler for inspection and policy control" (`:51`), two clauses that are hard to reconcile when the fail-open precondition is that no Cloud Connector in the group can reach a Service Edge. Whether fail-open routes direct-to-internet (no inspection) or via a retained/degraded Zscaler path is not resolved; neither reading should be documented as fact.

**Status**: open
**Resolves with**: lab test (trigger a fail-open condition, observe the egress path) OR zscaler doc not yet read (a clearer source on the toggle path and probe-port range)

---

### cloud-connector-09 — Forwarding-method semantics and the true backend forwardMethod enum

*Origin: `references/cloud-connector/forwarding.md` § Open questions; `references/cloud-connector/api-divergences.md` § Open questions*

The console-label and runtime semantics of several `ForwardMethod` enum values are unconfirmed, and the sources disagree on the enum itself. The Go doc-comment lists ten values including `ENATDEDIP`, `GEOIP`, and `PROXYCHAIN` (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:44`), the Terraform validator lists a smaller set, and the wire field is a free string. Specifically unresolved: (1) `ENATDEDIP` (reads as dedicated-IP NAT) and `GEOIP` (reads as geo-based forwarding) have no console label or documented semantics in captures; (2) `PROXYCHAIN`'s full chaining topology — where the proxy gateway sits, auth, failover — is not in source (only the proxy-gateway action field and its TCP-only network-service constraint are sourced); (3) the full set of values the `ecRdr` endpoint actually accepts — and whether `LOCAL_SWITCH`, `ENATDEDIP`, `GEOIP`, `PROXYCHAIN`, and bare `ZPA` are all live — is unknown without a tenant.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: lab test (submit each candidate `forwardMethod` against the `ecRdr` endpoint, observe acceptance and behavior) OR Postman / oneapi-spec cross-check (a third independent source on the enum)

**2026-06-18 narrowing**: the captured Automate contract now gives a third source on the documented `traffic_forwarding_rule.forwardMethod` enum for `POST /ztw/api/v1/ecRules/ecRdr`, and the generated reconciliation records the precise divergence: contract has `INVALID`, `DIRECT`, `PROXYCHAIN`, `ZIA`, `ZPA`, `ECZPA`, `ECSELF`, `DROP`, `ENATDEDIP`, and `GEOIP`, while Terraform accepts `DIRECT`, `LOCAL_SWITCH`, `ZIA`, `ECZPA`, and `DROP` (`vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.json:2300-2303`, `:2370-2391`). This closes the "Postman / oneapi-spec cross-check" part of the evidence request. It still does not prove which values the backend accepts in a tenant or what `ENATDEDIP` / `GEOIP` / `PROXYCHAIN` do operationally.

---

### cloud-connector-10 — Forwarding rule count limit and Admin Rank ↔ Rule Order interaction

*Origin: `references/cloud-connector/forwarding.md` § Open questions*

Two forwarding-rule capacity/precedence questions: (1) how many traffic forwarding rules a tenant may define is not captured — the wildcard-domain/FQDN-entry caps (16K per org, 8,000 per rule, `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.md:108`) are entry limits, not a rule-count limit; (2) CC forwarding rules carry an Admin Rank field (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:41`), but whether admin rank *gates* the editable Rule Order values the way ZIA URL Filtering's admin-rank does is not stated in captured source.

**Status**: open
**Resolves with**: support ticket OR lab test (grow rule count until rejection; vary admin rank and observe whether Rule Order editability is constrained)

---

### cloud-connector-11 — "Overwrite DNS response" — does a response-rewrite action exist at all?

*Origin: `references/cloud-connector/dns-subsystem.md` § Open questions; `references/cloud-connector/api-divergences.md` § Open questions*

"Overwrite DNS response" is named in help-page capability text but absent from the DNS-rule `action` enum (`ALLOW` / `BLOCK` / `REDIR_REQ` / `REDIR_ZPA`) and from every `*ztw*` SDK/TF source. Whether it is a separate feature with its own object/endpoint, a different rule type, or just marketing wording for one of the `REDIR_*` actions is unresolved — no source establishes it.

**Status**: open
**Resolves with**: zscaler doc not yet read (a source describing the feature's object/endpoint) OR lab test (look for a response-rewrite action in a live DNS-rule config)

---

### cloud-connector-12 — DNS rule UI match criteria, tunnel detection, and DoH interception not in the SDK

*Origin: `references/cloud-connector/dns-subsystem.md` § Open questions*

Several DNS-policy capabilities named in help UI text have no field in the captured `ECDNSRules` struct, which exposes only IP/group/location/ecGroup fields: (1) the UI match dimensions "users/groups/departments," "domain categorization / IP categorization," "DNS record types," and "location of resolved IP addresses" — whether these map to a richer (uncaptured) schema or are ZIA-DNS-Control concepts mislabeled in shared help text is unresolved; (2) DNS tunnel-detection trigger heuristics, thresholds, and response actions are not in captures and not modeled by any SDK field; (3) how CC identifies and handles DoH at the app layer is neither documented in captures nor exposed in the SDK.

**Status**: open
**Resolves with**: zscaler doc not yet read (a DNS-rule schema source naming these criteria) OR lab test (configure each UI criterion, inspect the resulting object)

---

### cloud-connector-13 — DNS gateway failover order, default gateway config, and IPv6 on referenced resolvers

*Origin: `references/cloud-connector/dns-subsystem.md` § Open questions*

Three DNS-gateway behaviors not exposed in the gateway object: (1) whether the secondary resolver is tried before `failureBehavior` fires (and under what conditions) — the SDK carries `primaryIp` / `secondaryIp` / `failureBehavior` but no field describing the try-order; (2) what the default (non-deletable) DNS gateway resolves to and whether it is operator-modifiable — the SDK has no `isDefault` discriminator; (3) whether a LAN- or WAN-referenced resolver slot can carry an IPv6 address — the "IPv4 only" statement in capture is scoped to the Custom DNS Server entry (`vendor/zscaler-help/cbc-configuring-dns-gateway.md:32,40`), and the gateway struct's `primaryIp` / `secondaryIp` are plain strings with no documented address-family constraint. Related: the `ZPA Resolver` predefined DNS rule is treated as predefined/non-deletable by the TF deletion guard (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go:135-139`) but no captured source describes its default state, match criteria, action, or license/mode gating.

**Status**: open
**Resolves with**: lab test (induce primary-resolver failure and observe try-order; inspect the default gateway and the `ZPA Resolver` rule) OR zscaler doc not yet read

---

### cloud-connector-14 — Duplicate DNS gateway packages and the type field semantics

*Origin: `references/cloud-connector/terraform.md` § Open questions; `references/cloud-connector/sdk.md` § Open questions; `references/cloud-connector/api-divergences.md` § Open questions*

Two Go SDK packages — `dns_gateway` and `forwarding_gateways/dns_forwarding_gateway` — both target `/ztw/api/v1/dnsGateways` with no clear deprecation note. The `dns_gateway` package omits `*http.Response` from its `Get`/`Create`/`Update` signatures and omits the `Type` field; the `dns_forwarding_gateway` package includes both, and its `type` carries `ZIA` / `ECSELF` values. Unresolved: (1) which package is canonical for the Terraform provider (`ztc_dns_forwarding_gateway` vs `ztc_dns_gateway`, both targeting the same endpoint); (2) whether the API distinguishes the two by `dnsGatewayType`; (3) whether `type` is required by the backend, optional, or meaningful only for the Log-and-Control ("ECSELF") variant.

**Status**: open
**Resolves with**: lab test (create gateways via each resource and compare the wire payloads / `type` handling) OR code read (a future SDK release may deprecate one package)

---

### cloud-connector-15 — subcloud_primary/secondary backend behavior for CC DC proxies

*Origin: `references/cloud-connector/terraform.md` § Open questions; `references/cloud-connector/api-divergences.md` § Open questions*

The Terraform forwarding-gateway resource registers `subcloud_primary` / `subcloud_secondary` as `id`+`name` blocks and reads/writes them (`vendor/terraform-provider-ztc/ztc/resource_ztc_forwarding_gateway.go:127-128,187-190,250-251`), tying them to a manual DC proxy when the org has subclouds. The SDK struct comment still calls them "Not applicable to Cloud & Branch Connector" (`vendor/zscaler-sdk-go/zscaler/ztw/services/forwarding_gateways/.../zia_forwarding_gateway.go:38-41`). Whether the backend API actually honors subclouds for Cloud & Branch Connector DC proxies (vs the TF schema merely exposing the fields) is not verifiable from source.

**Status**: open
**Resolves with**: lab test (set subcloud blocks on a CC forwarding gateway, observe whether the backend applies them to DC-proxy selection)

---

### cloud-connector-16 — ztc_traffic_forwarding_rule: OneAPI requirement and ZPA App Segment ID equivalence

*Origin: `references/cloud-connector/terraform.md` § Open questions*

Two forwarding-rule questions on the Terraform surface: (1) whether `ztc_traffic_forwarding_rule` requires OneAPI auth or works with both auth frameworks is not confirmed from available sources; (2) the `zparesources` Go package exports `GetZPAApplicationSegments`, returning ZPA Application Segment IDs visible to the CC tenant (`vendor/zscaler-sdk-go/zscaler/ztw/services/policyresources/zparesources/zparesources.go`), but whether those IDs are identical to the IDs returned by the `zpa_application_segment` data source in the ZPA Terraform provider has not been confirmed by a live cross-provider test. The ZTC provider exposes no data source for this lookup.

**Status**: open
**Resolves with**: lab test (run a forwarding-rule create under each auth framework; compare segment IDs from `zparesources` against the ZPA provider data source for the same segment)

---

### cloud-connector-17 — "Local" / LOCAL_SWITCH forwarding method — real behavior or doc artifact

*Origin: `references/cloud-connector/terraform.md` § Open questions; `references/cloud-connector/index.md` § forwarding-method prose*

The Go `ForwardMethod` enum (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:44`) has no `LOCAL_SWITCH` value, yet a `LOCAL_SWITCH` value appears in the Terraform validator and in Python docstrings, and `index.md` prose lists "local" among the forwarding methods. Whether "local switch" / "Local" is a real portal-only or hardware-gateway (Branch Connector) behavior that the Go enum simply does not model, or an erroneous notion that propagated through docs, is unresolved. Until confirmed, the skill should not assert a `LOCAL_SWITCH` enum value against the Go SDK.

**Status**: open
**Resolves with**: lab test (attempt a `LOCAL_SWITCH` / "Local" forwarding rule on a Cloud vs Branch Connector tenant, observe acceptance) OR Postman / oneapi-spec cross-check on the `forwardMethod` enum

---

### cloud-connector-18 — ZTW API surface gaps: endpoint paths, Azure/GCP discovery automation, Go ZIdentity auth

*Origin: `references/cloud-connector/api.md` § Open questions*

Three ZTW API-surface items not resolved in the current pass: (1) the `*Endpoint` consts for the `adminuserrolemgmt` and `activation_cli` Go service packages were not inspected, so their endpoint paths are unverified (the rest of the Go service-surface table now carries verified paths); (2) whether `publicCloudInfo` exposes discovery automation for Azure/GCP — `publicCloudInfo` records carry AWS/Azure/GCP account identities, but the discovery-permission and CloudFormation-template flows in current Go source (`vendor/zscaler-sdk-go/zscaler/ztw/services/partner_integrations/partner_integrations.go:56-82`) are AWS-specific, with no Azure/GCP equivalent of `cloudFormationTemplate` or `discoveryService/{id}/permissions`; (3) ~~whether a ZIdentity OAuth path exists for Go ZTW~~ **RESOLVED**: the unified Go client routes ZTW through a dedicated `ZTWHTTPClient` OAuth2 client (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:382-383`); the legacy `ZTC_*` credential surface (`v2_config.go`) is the *alternative* backward-compat path, not the only one. The Go ZTW config object does not itself embed ZIdentity credentials — that lives in the top-level unified client, not the per-service config. Items (1) and (2) remain open.

**Status**: partially open (items 1 and 2 remain; item 3 resolved)
**Resolves with**: code read (inspect the two service packages' endpoint consts) OR lab test (probe Azure/GCP discovery automation against a tenant)

---

### cloud-connector-19 — ZTW SDK method-convention anomalies and OneAPI gov/ten exclusion behavior

*Origin: `references/cloud-connector/sdk.md` § Open questions*

Two Go SDK convention anomalies whose intent is unconfirmed: (1) `provisioning_url` uses the ZIA-style methods (`service.Client.Create`, not `CreateResource`) for `Create` / `UpdateWithPut` / `Delete` — whether this is intentional or a bug is not stated in source; (2) `workload_groups.Get` calls `service.Client.Read` (not `ReadResource`), inconsistent with the ZTW convention of `ReadResource` for GETs — the endpoint may use the ZIA-compatible request path rather than the Resource-suffixed path, but the reason is not documented. Plus one narrower auth question: OneAPI is confirmed available for ZTW and excluded for the `zscalergov` and `zscalerten` clouds, but whether the SDK surfaces that exclusion as an explicit error or silently falls back to legacy auth for those clouds is not confirmed from source.

**Status**: open
**Resolves with**: code read (a future SDK release or maintainer note clarifying the method-convention choices) OR lab test (invoke ZTW OneAPI against a gov/ten cloud and observe whether it errors or falls back)

---

### cloud-connector-20 — NSS VA for CBC: feed coverage, sizing, certs, HA, and rule-match semantics

*Origin: `references/cloud-connector/nss-va.md` § Open questions*

Several NSS-VA-for-CBC behaviors are not pinned down in the captured help sources: (1) whether CBC DNS events (from the DNS Forwarding Gateway / DNS policy) appear under the NSS Firewall log type or require a separate feed — generic NSS docs list DNS as a separate type, but CBC NSS guidance references only Firewall; (2) NSS VA sizing numbers for typical CC fleet sizes (the guides point to Zscaler's interactive sizing tool but capture no CBC table); (3) the NSS client certificate's validity period and whether Zscaler offers automated renewal or requires manual re-registration; (4) whether two NSS VAs can consume the same Nanolog partition simultaneously (active-active HA) or the stream targets exactly one VA; (5) whether Log-and-Control Forwarding gateway selection affects the path CC VMs take to upload logs to the Nanolog — i.e. whether a misconfigured log/control rule could starve the Nanolog before the NSS VA can pull; (6) whether JSON is a supported Firewall feed output format for VM-based NSS in CBC (or CSV is the only tested format); (7) whether Log-and-Control Forwarding rule evaluation stops at the first matching rule (first-match-wins) and whether the auto-created default rule holds the terminal catch-all position — captured source confirms ascending-numerical-order evaluation and disabled-rule skip (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.md:34,36`) but not the stop-on-first-match semantics.

**Status**: open
**Resolves with**: zscaler doc not yet read (CBC-specific NSS sizing / cert / feed-format guidance) OR lab test (observe DNS-in-Firewall-feed, active-active VA behavior, and rule-match stop semantics in a tenant)

---

### cloud-connector-21 — Insights/Tunnel-Insights aggregation and byte-count parity with NSS feeds

*Origin: `references/cloud-connector/logs/log-schema.md` § Open questions*

Three Insights-surface items the log-schema doc flags but cannot resolve from source: (1) whether a raw log-download API exists for Insights data — none is confirmed (absence of evidence, not evidence of absence); (2) whether the byte counts in Tunnel Insights (DPD / Received / Sent bytes) match `inbytes` / `outbytes` from NSS-firewall records for the same sessions is unverified — no NSS feed equivalent of the Tunnel Insights metrics is confirmed; (3) the exact time-window aggregation behavior of Insights session/DNS/tunnel views at multi-day scale (the UI says it aggregates per day, but the precise semantics are undocumented). The separate `Status` / `UpgradeStatus` SDK value-space question is filed as `log-22`, not here.

**Status**: open
**Resolves with**: lab test (compare Tunnel Insights byte counts against NSS records for the same sessions; observe multi-day aggregation) OR zscaler doc not yet read (a raw-log-download API surface)

---

### cloud-connector-22 — CC region coverage: GovCloud, China, GCP deployment, and WDS-vs-ZTG region-set parity

*Origin: `references/cloud-connector/regions.md` § Open questions*

The captured regions material leaves the deployment-region picture incomplete (the doc's OQ-CCR-01 through OQ-CCR-09): whether the AWS CC AMI and Azure CC Marketplace listing exist in GovCloud / Azure Government and AWS/Azure China; which GCP regions support CC *deployment* (and whether a Google Cloud Marketplace listing exists) plus the GCP-specific networking model; whether AWS opt-in regions support the CC AMI and/or Zero Trust Gateway; per-region availability of CC VM size options (Small/Medium/Large); and the Azure Function App Flex Consumption regional-gap list. Most consequential: the workload-discovery supported-region surface is confirmed programmatically (`GET /ztw/api/v1/publicCloudInfo/supportedRegions` / the `ztc_supported_regions` data source, see § Programmatic region enumeration), but the captured Go/TF source defines only the shape (id/name/cloud_type), not the region values, and does not assert that the WDS set equals the ZTG deployment list or per-cloud CC deployment availability. The relationship between the three region sets (WDS, ZTG, CC-deployment) is unconfirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read (capture the linked GCP/China/GovCloud CC deployment pages) OR tenant snapshot (query `ztc_supported_regions` per cloud and compare against the 16-region ZTG table) OR support ticket (GovCloud / FedRAMP availability)

---

### cloud-connector-23 — dest_workload_groups_ids binding to LOCAL_SWITCH / "Local"

*Origin: `references/cloud-connector/api-divergences.md` § Open questions*

The Python docstring ties destination workload groups (`dest_workload_groups_ids` / `destWorkloadGroups`) to the `LOCAL_SWITCH` forward method, while the help text ties them to the console "Local" method. Whether the backend actually accepts `destWorkloadGroups` only on `LOCAL_SWITCH` / "Local" rules — and rejects or ignores them on other forwarding methods — is unconfirmed (and depends partly on cloud-connector-17, the question of whether `LOCAL_SWITCH` is itself a live method).

**Status**: open
**Resolves with**: lab test (set `dest_workload_groups_ids` on rules of varying forward method, observe which the backend accepts)

---

### cloud-connector-24 — Field character-limit enforcement on DNS and Log-and-Control rules

*Origin: `references/cloud-connector/dns-subsystem.md` § Open questions*

The help pages state character limits for Log-and-Control rule fields (name ≤ 31, description ≤ 10,240), but the captured `ECTrafficLogRules` struct models them as plain string fields with no enforcement. Whether the API actually enforces these limits server-side — and whether the DNS-rule fields carry analogous undocumented limits — is doc-tier until confirmed against the API's validation behavior.

**Status**: open
**Resolves with**: lab test (submit over-length name/description values, observe whether the API rejects them) OR zscaler doc not yet read

---

### zcc-77 — WebPolicy `*Top` vs nested-block precedence on write

*Origin: `references/zcc/api-schemas.md` § Open questions*

The Go `WebPolicy` struct carries many settings twice: a root-level `*Top`-suffixed copy and a counterpart inside a nested block (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:186,209-214,222-243`). The `DefaultMacosWebPolicy` constructor comment explains both copies are seeded from a "known-working UI-generated request body" (`web_policy.go:88-90`) and the SDK faithfully sends both. Which copy the API honours on write when the two disagree — or whether one silently wins — is not stated in source.

**Status**: open
**Resolves with**: lab test (write a WebPolicy with the root-level `*Top` field and its nested counterpart set to conflicting values, read back, observe which persisted)

---

### zcc-78 — WebPolicy `deviceType` vs `device_type` write precedence

*Origin: `references/zcc/api-schemas.md` § Open questions*

`DeviceTypeAlt` (wire `deviceType`, **int**, `vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:323`) coexists with `DeviceType` (wire `device_type`, int, `web_policy.go:99`) on the WebPolicy struct — two distinct int fields. Separately, the SDK comment notes the API returns an unmodelled `deviceType` **string** (e.g. `"DEVICE_TYPE_MAC"`) on reads (`web_policy.go:65-69`); `DeviceTypeAlt` is not that string companion. Which int field a write honours when both are populated is not documented in source.

**Status**: open
**Resolves with**: lab test (submit a WebPolicy write with `device_type` and `deviceType` set to different device types, observe which the API applies)

---

### zcc-79 — WebPolicy `*Selected` form-state fields required on write

*Origin: `references/zcc/api-schemas.md` § Open questions*

The full `WebPolicy` field set is modeled from UI request-body captures (`payload-ios.json` etc.) referenced in the SDK comments, including numerous `*Selected` / `*SelectedOption` form-state fields. The struct tags carry no `omitempty` either way except where explicitly noted (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:88-90`), so whether each form-state field is required on write versus merely echoed on read is not determinable from the struct alone.

**Status**: open
**Resolves with**: lab test (write a minimal WebPolicy omitting the `*Selected` fields, observe whether the API rejects, defaults, or accepts the partial body)

---

### zcc-80 — ZCC v1 vs v2 endpoint coexistence

*Origin: `references/zcc/api.md` § Open questions*

The `/zcc/papi/public/v2` families are confirmed in the Go SDK — notification-templates (`vendor/zscaler-sdk-go/zscaler/zcc/services/notification_template/notification_template.go:15`), zia-posture-profiles (`vendor/zscaler-sdk-go/zscaler/zcc/services/zia_posture/zia_posture.go:15`), and trusted-networks (`vendor/zscaler-sdk-go/zscaler/zcc/services/trusted_network_v2/trusted_network_v2.go:15`). The Python SDK does not expose these v2 services. Whether the v2 endpoints supersede or coexist with their v1 equivalents long-term — and whether a tenant should migrate — is not stated in the SDK source.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: zscaler doc not yet read (vendor API changelog / deprecation notice) OR lab test (compare v1 and v2 responses for the same tenant object)

**2026-06-18 narrowing**: the generated ZCC reconciliation documents the current contract boundary: `zcc_trusted_network` is not reconciled because Terraform uses the Go SDK v2 trusted-network API at `/zcc/papi/public/v2/trusted-networks`, while the captured Automate contract currently exposes only older v1 `webTrustedNetwork` operations (`vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md:30-33`). That confirms the v1/v2 split in the public contract corpus; it does not establish deprecation, supersession, or migration timing.

**2026-06-18 live-fetch data point**: a live ZCC fetch of the v2 endpoints `/zcc/papi/public/v2/notification-templates` and `/zcc/papi/public/v2/zia-posture-profiles` returned HTTP 404 on the tested OneAPI gateway. Both families are exposed as Terraform Plugin Framework resources but have no matching captured Automate contract operation (`vendor/zscaler-api-specs/automate-zscaler/zcc-divergences.md:33`), so the 404 indicates the v2 routes are unavailable on the tested gateway/cloud — not that they are globally unmounted, superseded, or deprecated. It adds a data point to the v1/v2-coexistence question; global availability and any deprecation/supersession timing remain open.

---

### zcc-81 — Device `zd*` vs `zdp*` field-prefix meanings

*Origin: `references/zcc/devices.md` § Open questions*

The Python `DeviceDetails` model carries both a `zd*` set (`zd_enabled` `vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py:335`, `zd_health` `:340`, `zd_last_seen_time` `:344`) and a `zdp*` set (`zdp_version` `:330`, `zdp_enabled` `:336`, `zdp_health` `:341`, `zdp_last_seen_time` `:345`). The SDK source never expands either acronym, so what service each prefix names — and how `zd` differs from `zdp` — is not backed by current sources.

**Status**: open
**Resolves with**: zscaler doc not yet read (help-portal Device Details capture) OR tenant snapshot (read a live device response and correlate the prefixes to enabled services)

---

### zcc-82 — Device `registration_state` vs `state` distinction

*Origin: `references/zcc/devices.md` § Open questions*

Both `registration_state` (`vendor/zscaler-sdk-python/zscaler/zcc/models/devices.py:49`) and `state` (`:51`) exist on the `Device` list model, but the finer-grained distinction between them — what each tracks and how their value sets differ — is not documented in the vendored SDK source.

**Status**: open
**Resolves with**: tenant snapshot (read live device records and compare the two field value sets) OR zscaler doc not yet read

---

### zcc-83 — `DeviceDetails.state` / `type` wire type per endpoint

*Origin: `references/zcc/devices.md` § Open questions*

The Go SDK declares `state` / `type` as `int` on the list endpoint (`vendor/zscaler-sdk-go/zscaler/zcc/services/devices/devices.go:40,42`) but as `string` on the detail endpoint (`devices.go:80,82`). Which type the wire actually returns per endpoint — and whether a caller must handle both forms for the same logical field — is unverified against a live tenant.

**Status**: open
**Resolves with**: tenant snapshot (capture both the list and detail responses, compare the wire type of `state` / `type`)

---

### zcc-84 — Unified Tunnel operational semantics

*Origin: `references/zcc/forwarding-profile.md` § Open questions*

The Unified Tunnel model is confirmed in both SDKs (Go `UnifiedTunnel` struct `vendor/zscaler-sdk-go/zscaler/zcc/services/forwarding_profile/forwarding_profile.go:119`; Python `UnifiedTunnel` class `vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py:299`), carrying shared-transport fields (`actionTypeZIA`, `actionTypeZPA`, `primaryTransport`). What shared-transport actually changes for the user versus running two separate Z-Tunnels — the customer-side operational semantics — has no help-article backing in the captured sources.

**Status**: open
**Resolves with**: zscaler doc not yet read (Unified Tunnel help article) OR lab test (enable Unified Tunnel and observe transport/connection behavior versus the two-tunnel baseline)

---

### zcc-85 — App-Profile fail-close vs tenant `FailOpenPolicy` precedence

*Origin: `references/zcc/forwarding-profile.md` § Open questions*

App-Profile fail-close fields are SDK-confirmed on the application-profile / PolicyExtension surface — `zccAppFailOpenPolicy` (`:474`), `zccTunnelFailPolicy` (`:475`), and the `zccFailCloseSettings*` block (`:449-472`). Note: `reactivateWebSecurityMinutes` (`application_profiles.py:49`) is the time before web security reactivates after a user-initiated disable (`web_policy.py:183` docstring: "Minutes after which Web Security is reactivated when disabled by the user") — it is not a captive-portal grace field; the captive-portal grace field is `captivePortalWebSecDisableMinutes` on `FailOpenPolicy`. Which setting wins when both a per-App-Profile fail-close value and the tenant-global `FailOpenPolicy` are set is not documented in the captured sources.

**Status**: open
**Resolves with**: lab test (set conflicting per-App-Profile and tenant-global fail-close values, induce a tunnel/firewall error, observe which policy applies) OR zscaler doc not yet read

---

### zcc-86 — `get_web_privacy` returns `None` on error

*Origin: `references/zcc/sdk.md` § Open questions*

The Python SDK's `get_web_privacy` returns bare `None` on any error path rather than the result/response/error tuple that every other SDK method returns (`vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py:58,61,65`). This is either an oversight or an intentional deviation; callers must special-case `None` rather than inspecting a third tuple element. (Earlier doc text attributed this to `utils.py`; the deviation actually lives in `web_privacy.py`.)

**Status**: resolved (2026-06-15) — source-confirmed deviation; retained as a caller-behavior note rather than an open ZCC-behavior question.
**Resolves with**: code read (done — the three `return None` paths are in `web_privacy.py`)

**Answer**: Confirmed in current source: `get_web_privacy` returns `None` when request creation fails, when execution fails, and when response-body parsing raises (`vendor/zscaler-sdk-python/zscaler/zcc/web_privacy.py:58,61,65`). This is a Python-SDK API-surface quirk, not a ZCC product behavior; callers must guard for `None`.

---

### zcc-87 — ZCC rate-limit header behavior on the OneAPI path

*Origin: `references/zcc/sdk.md` § Open questions*

The ZCC API's rate-limit response headers (`X-Rate-Limit-Remaining`, `X-Rate-Limit-Retry-After-Seconds`) are consumed by the legacy ZCC client helper, but how — or whether — they are surfaced and honoured on the OneAPI request path is not documented in the SDK source. This overlaps with the rate-limit clarifications `zcc-10` (header presence on 2xx) and `zcc-12` (RequestExecutor retry behavior).

**Status**: open
**Resolves with**: zscaler doc not yet read (OneAPI rate-limit documentation) OR lab test (drive the OneAPI ZCC path to a 429 and inspect the returned headers and client retry behavior)

---

### zcc-88 — WebPolicy read-shape `macPolicy` vs `macosPolicy` key

*Origin: `references/zcc/snapshot-schema.md` § Open questions*

The Python WebPolicy serializer reads and writes the macOS sub-policy under `macPolicy` (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:190,302`), but the documented snapshot example block and the `has_mac` jq query use `macosPolicy`. Whether the `listByCompany` read JSON returns `macPolicy`, `macosPolicy`, or both keys is not confirmed from a captured snapshot.

**Status**: open
**Resolves with**: tenant snapshot (capture `web/policy/listByCompany` JSON and check which macOS sub-policy key appears)

---

### zcc-89 — WebPolicy `groups` / `users` / `deviceGroups` wire shape

*Origin: `references/zcc/snapshot-schema.md` § Open questions*

The Python model splits scope into `groupIds`/`groupNames`, `userIds`/`userNames`, `deviceGroupIds`/`deviceGroupNames` and additionally parses `groups`/`users` into typed objects (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:118-148`). Which of these keys actually appear in the `listByCompany` wire response — and whether `groups`/`users` arrive id-only or as full `{id, loginName, ...}` objects — is not confirmed from a snapshot.

**Status**: open
**Resolves with**: tenant snapshot (capture a `listByCompany` response and record which scope keys appear and their element shape)

---

### zcc-90 — WebPolicy companion `deviceType` string presence on reads

*Origin: `references/zcc/snapshot-schema.md` § Open questions*

The Go SDK comment asserts the API returns a companion `deviceType` string such as `"DEVICE_TYPE_MAC"` alongside the integer `device_type` on reads (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:65-69`), but the field is intentionally not modelled, so its wire presence is inferred from a comment rather than confirmed from a captured response.

**Status**: open
**Resolves with**: tenant snapshot (capture real `web/policy/listByCompany` JSON and confirm whether the `deviceType` string is actually present)

---

### zcc-91 — App Supportability toggle tenant defaults

*Origin: `references/zcc/support-options.md` § Open questions*

The `CompanyInfo` model declares the App Supportability toggles — `supportEnabled` (`vendor/zscaler-sdk-python/zscaler/zcc/models/company_info.py:65`), `supportAdminEmail` (`:64`), `supportTicketEnabled` (`:71`), `disableLoggingControls` (`:74`), and `fetchLogsForAdminsEnabled` (`:67`) — but the SDK does not assert their out-of-box default values. The "Default-on vs default-off" column in the doc is inferred from the help doc's configuration steps, not from source.

**Status**: open
**Resolves with**: tenant snapshot (read `CompanyInfo` on a freshly provisioned tenant) OR zscaler doc not yet read

---

### zcc-92 — Per-product disable-password authority (`WebPolicy` vs `manage_pass`)

*Origin: `references/zcc/support-options.md` § Open questions*

The same logical disable passwords exist on the top-level `WebPolicy` object — `zdDisablePassword` (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:582`), `zdxDisablePassword` (`:583`), `zpaDisablePassword` (`:584`), `zdpDisablePassword` (`:580`), and `exitPassword` (`:558`) — and on the write-only `manage_pass` bulk POST, which uses differently-named fields including `zadDisablePass` (`vendor/zscaler-sdk-go/zscaler/zcc/services/manage_pass/manage_pass.go:24`) and `ziaDisablePass` (`manage_pass.go:27`). The SDK does not state precedence when a value is set on both surfaces, nor how `manage_pass`'s `ziaDisablePass` / `zadDisablePass` reconcile with the WebPolicy keys — WebPolicy has no `ziaDisablePassword`, and its `zdDisablePassword` product mapping versus `zadDisablePass` is not stated in source.

**Status**: open
**Resolves with**: lab test (set a disable password on both the WebPolicy and via `manage_pass`, observe which the agent enforces and how the differently-named fields map) OR zscaler doc not yet read

---

### zcc-93 — macOS password read-key vs write-key API behavior

*Origin: `references/zcc/support-options.md` § Open questions*

`MacOSPolicy` reads the password gates under camelCase keys — `disablePassword` (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:1095`), `logoutPassword` (`:1107`), `uninstallPassword` (`:1111`) — but `request_format()` emits snake_case keys — `disable_password` (`:1135`), `logout_password` (`:1141`), `uninstall_password` (`:1143`). Whether the live API accepts the snake_case write form for macOS, ignores it, or stores it under a different key than it reads back is not determinable from the model alone.

**Status**: open
**Resolves with**: lab test (write a macOS sub-policy via the SDK's snake_case form, read back, confirm the password persisted and under which key)

---

### zcc-94 — Per-platform password-gate UI surface per OS

*Origin: `references/zcc/support-options.md` § Open questions*

All five per-platform sub-policy classes carry the disable / logout / uninstall password fields as model attributes (e.g. macOS `webpolicy.py:1095,1107,1111`; Windows `webpolicy.py:820,841,848`), but the SDK model does not assert which of these gates render as actual user-facing UI actions on each OS — for example whether mobile platforms expose an uninstall-password prompt the same way desktop does.

**Status**: open
**Resolves with**: operator experience (observe the ZCC UI per OS) OR zscaler doc not yet read

---

### zcc-95 — Trusted-network stateful evaluation across transitions

*Origin: `references/zcc/trusted-networks.md` § Open questions*

Whether ZCC's trusted-network evaluation is stateful across network transitions — does the agent debounce rapid network changes, or cache the previous evaluation result — is not surfaced by any SDK field. The model exposes the criteria but no transition-handling or hysteresis configuration.

**Status**: open
**Resolves with**: lab test (rapidly switch a device between a trusted and untrusted network, observe whether ZCC debounces or re-evaluates immediately each time)

---

### zcc-96 — Multiple TrustedNetworks partial-match precedence

*Origin: `references/zcc/trusted-networks.md` § Open questions*

When a single Forwarding Profile references multiple TrustedNetworks and more than one partially matches the current environment, which one wins — and how the partial matches are resolved — is not documented in the SDK source.

**Status**: open
**Resolves with**: lab test (configure a Forwarding Profile with two overlapping TrustedNetworks, place a device where both partially match, observe the effective network determination)

---

### zcc-97 — `forwarding_profile_id` orphan-reference resolution

*Origin: `references/zcc/web-policy.md` § Open questions*

A Web Policy can reference a Forwarding Profile ID (`forwarding_profile_id`, `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:98`) that has since been deleted — the relationship is FK-shaped but not enforced at write time. What ZCC does at enforcement when the referenced profile is missing — fall back to a default, fail silently, or block traffic — is not described in any available source.

**Status**: open
**Resolves with**: lab test (point a Web Policy at a Forwarding Profile ID, delete the profile, observe the agent's enforcement behavior on a device under that policy)

---

### zcc-98 — On-Net policy vs Forwarding Profile evaluation order

*Origin: `references/zcc/web-policy.md` § Open questions*

When both the Python-only `onNetPolicy` block (`vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:220-228`) and the Forwarding Profile's trusted-network configuration are present, which one is evaluated first — and which wins on conflict — is unverified.

**Status**: open
**Resolves with**: lab test (configure conflicting on-net and Forwarding-Profile trusted-network behavior, observe the effective on-network decision)

---

### zcc-99 — `dropQuicTraffic` browser TCP-fallback effect

*Origin: `references/zcc/web-policy.md` § Open questions*

The `dropQuicTraffic` field exists on the WebPolicy (`vendor/zscaler-sdk-go/zscaler/zcc/services/web_policy/web_policy.go:579`; Python `vendor/zscaler-sdk-python/zscaler/zcc/models/webpolicy.py:416`), but whether dropping QUIC reliably forces browsers to fall back to TCP/443 — versus failing the connection — is operator-reported, not verified in source.

**Status**: open
**Resolves with**: operator experience OR lab test (enable `dropQuicTraffic`, drive a QUIC-capable browser, confirm it falls back to TCP rather than failing)

---

### zcc-100 — IPv6-only-network behavior of the `drop_ipv6*` flags

*Origin: `references/zcc/z-tunnel.md` § Open questions*

The forwarding-profile model carries three IPv6-specific flags, all confirmed in source — `drop_ipv6_traffic` (`vendor/zscaler-sdk-python/zscaler/zcc/models/forwardingprofile.py:117`), `drop_ipv6_traffic_in_ipv6_network` (`:118`), and `drop_ipv6_include_traffic_in_t2` (`:136`). The flags exist, but what each one does to traffic on an IPv6-only network — the runtime behavior — is not described in the captured help docs, which focus on IPv4.

**Status**: open
**Resolves with**: lab test (toggle each flag on a device attached to an IPv6-only network, observe the effect on IPv6 traffic and Z-Tunnel 2.0 forwarding)

---

### zcc-101 — Service-Edge split-landing control-connection behavior

*Origin: `references/zcc/z-tunnel.md` § Open questions*

When a Z-Tunnel session re-lands on a different Service Edge (split-landing), whether the control connection stays up while data reroutes — or the whole session tears down and re-establishes — is not documented. Wire-format protocol details (framing, keepalive, session resumption) are likewise not customer-documented.

**Status**: open
**Resolves with**: zscaler doc not yet read (Support / SE-level protocol detail) OR operator experience (observe session continuity during a Service-Edge failover)

---

### zdx-03 — ZDX token host per tenant

*Origin: `references/zdx/api-divergences.md` § Open questions; `references/zdx/api.md` § Open questions*

Two ZDX hosts appear across sources. The legacy Python ZDX client and the Go ZDX v2 client default to `api.zdxcloud.net` (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:55-57` — default cloud `zdxcloud`, URL `https://api.{cloud}.net`; `vendor/zscaler-sdk-go/zscaler/zdx/v2_config.go:150`), while the OneAPI path uses `api.zsapi.net` (`vendor/zscaler-sdk-python/zscaler/request_executor.py:32`; `vendor/zscaler-sdk-go/zscaler/oneapiclient.go:416`). Whether a specific tenant's credentials authenticate against the legacy ZDX host, the OneAPI host, or both is not determinable from source — it depends on how the tenant was provisioned (legacy ZDX API key vs Zidentity OneAPI client).

**Status**: open
**Resolves with**: lab test (authenticate the same tenant against each host, observe which succeeds) OR zscaler doc not yet read

---

### zdx-04 — ZDX rate-limit header family per host

*Origin: `references/zdx/api-divergences.md` § Open questions; `references/zdx/api.md` § Open questions*

The two ZDX hosts are read off two source families with different rate-limit header expectations. The legacy ZDX transport reads `X-Ratelimit-Remaining-Second` / `X-Ratelimit-Limit-Second` (`vendor/zscaler-sdk-python/zscaler/zdx/legacy.py:97-98`), and the help capture documents a `RateLimit-*` family on the OneAPI gateway. Whether each host actually emits the family its source expects — and specifically whether the OneAPI gateway (`api.zsapi.net`) enforces a per-second `X-Ratelimit-*-Second` window or only the `RateLimit-*` family — needs a live response capture; the SDK transport on the gateway path does not parse the `RateLimit-*` form, so the gateway-header claim rests on the help capture alone.

**Status**: open
**Resolves with**: lab test (capture live response headers from each host) OR support ticket

---

### zdx-05 — ZDX server tier table vs client flat limiter

*Origin: `references/zdx/api.md` § Open questions*

The help reference documents a server-side per-tenant rate tier keyed to license count, while the Go ZDX client applies a flat global limiter (`vendor/zscaler-sdk-go/zscaler/zdx/v2_client_ratelimit_test.go:105-107` exercises a 10-req/s global limiter). Whether the client limiter is reconciled with the negotiated server tier anywhere, or is simply a conservative floor independent of the tenant's actual server-side allowance, is not stated in source.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket (confirm the per-tenant negotiated tier and whether the client floor matters)

---

### zdx-06 — get_device_app live response shape

*Origin: `references/zdx/api-divergences.md` § Open questions; `references/zdx/devices.md` § Open questions*

The two SDKs model the same `GET /devices/{deviceID}/apps/{appID}` endpoint with different shapes: Python returns a `DeviceAppScoreTrend` timeseries (`vendor/zscaler-sdk-python/zscaler/zdx/devices.py:314` wraps the body in `DeviceAppScoreTrend`; model at `vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:369`), while Go returns a single `*App` score (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_apps.go:23`). The actual wire shape returned by the endpoint — a trend series, a single score, or a shape that accommodates both — is not determinable from source alone.

**Status**: open
**Resolves with**: lab test (capture the raw response from `GET .../apps/{appID}`) OR zscaler doc not yet read

---

### zdx-07 — DeviceEvents live response key

*Origin: `references/zdx/api-divergences.md` § Open questions*

The two SDKs disagree on the JSON key carrying the device-events collection. Go unmarshals from `instances` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:18` — `Events []Events json:"instances,omitempty"`), while the Python model reads `events` (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:650`). Which key the live API actually returns — or whether both are present — is unverified.

**Status**: open
**Resolves with**: lab test (capture the raw device-events response) OR zscaler doc not yet read

---

### zdx-08 — CallQualityMetrics.metrics live shape

*Origin: `references/zdx/api-divergences.md` § Open questions; `references/zdx/devices.md` § Open questions*

The `metrics` series on the call-quality-metrics response is modeled differently across SDKs: Python forms a list of `CommonMetrics` objects (`vendor/zscaler-sdk-python/zscaler/zdx/models/devices.py:457`), while Go expects structured `[]common.Metric` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go:20`). The actual wire shape of each element in the `metrics` array is unverified.

**Status**: open
**Resolves with**: lab test (capture a raw call-quality-metrics response) OR zscaler doc not yet read

---

### zdx-09 — Org-list time-filter semantics

*Origin: `references/zdx/administration.md` § Open questions*

The departments and locations list helpers accept time filters (`from`/`to` on `GetDepartmentsFilters` / `GetLocationsFilters`, `vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:29-37`; `since` on the Python equivalents in `vendor/zscaler-sdk-python/zscaler/zdx/admin.py`). It is unclear whether the window selects "departments/locations that had active devices in this window" or has some other meaning for reference data that does not change over time. The semantics are not stated in source.

**Status**: open
**Resolves with**: lab test (vary the time window, compare returned org lists) OR zscaler doc not yet read

---

### zdx-10 — Q vs Search matching on GetLocationsFilters

*Origin: `references/zdx/administration.md` § Open questions*

`GetLocationsFilters` carries both a `Search` and a `Q` field (`vendor/zscaler-sdk-go/zscaler/zdx/services/administration/administration.go:33,35`), while `GetDepartmentsFilters` carries only `Search` (`:29-31`). Both location fields appear to filter by name or ID, but whether they differ in matching behavior — exact vs partial, case sensitivity, name-vs-ID scope — is not documented in source.

**Status**: open
**Resolves with**: lab test (submit each field independently, compare results) OR zscaler doc not yet read

---

### zdx-11 — Exhaustive metric_name value set

*Origin: `references/zdx/applications.md` § Open questions*

The valid `metric_name` values for application metric retrieval are documented only by example, not as an enumerated set. The Python docstring names `pft`, `dns`, `availability` for Web Probes, and the Go docstring names the Web-Probe and CloudPath metric labels in prose (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go:38-41`). Neither source provides an enumerated type or exhaustive list of every valid `metric_name`.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test (enumerate accepted `metric_name` values against the endpoint)

---

### zdx-12 — Tenant-level application inventory

*Origin: `references/zdx/applications.md` § Open questions*

It is unverified whether the SDK application-list surface can return applications that have no recent probe data — i.e. configured-but-inactive or unconfigured apps — or whether the list is limited to apps with telemetry in the requested window. The list methods (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py`) do not state inactive-app behavior.

**Status**: open
**Resolves with**: tenant snapshot (compare configured apps against the list response) OR zscaler doc not yet read

---

### zdx-13 — Probe metadata per application

*Origin: `references/zdx/applications.md` § Open questions*

No SDK endpoint surfaces which probes (Web or Cloud Path) are attached to a given application ID — probe-to-application binding appears portal-only. The application surface (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py`) exposes metrics and scores but no probe-attachment listing.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience (confirm probe-attachment is portal-only)

---

### zdx-14 — Application auto-detection vs manual config

*Origin: `references/zdx/applications.md` § Open questions*

Whether ZDX automatically discovers monitored applications or requires manual configuration in the portal is not surfaced in SDK source. The read-only application API (`vendor/zscaler-sdk-python/zscaler/zdx/apps.py`) returns whatever apps the tenant has, without revealing how they came to be monitored.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zdx-15 — ZDX CA topology

*Origin: `references/zdx/cloud-architecture.md` § Open questions*

The vendor help states the ZDX Central Authority design is "similar to that of the Internet & SaaS CA" (`vendor/zscaler-help/understanding-zdx-cloud-architecture.md:48`), which implies active-passive, but the ZDX CA's actual topology (active-passive vs active-active) is not explicitly confirmed.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### zdx-16 — Region boundary definition and geographic weighting

*Origin: `references/zdx/cloud-architecture.md` § Open questions; `references/zdx/score.md` § Open questions*

ZDX computes a "weighted average of peers in the same region," but the region boundary is undefined: how ZDX converts lat/long or IP to a region (continent vs country vs city, or a geolocation ID), what fallback applies when OS location services are off, and the weighting function over same-region peers are all unstated in vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zdx-17 — Data retention, GDPR, and data residency

*Origin: `references/zdx/cloud-architecture.md` § Open questions*

No vendor source documents a ZDX telemetry retention period, purge policy, or data-residency / data-location configuration option. The Microsoft Azure Data Explorer (ADX) storage dependency may be material for customers with cloud-provider or data-residency constraints, but the controls (if any) are not documented.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### zdx-18 — TPG geo-distribution and failover

*Origin: `references/zdx/cloud-architecture.md` § Open questions*

The Transaction Processing Gateway's stateless design is documented, but its SLA, regional deployment footprint, and failure-domain handling are not. Whether the TPG is regionally distributed, how a client selects one, and what happens on a regional TPG outage are unstated.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### zdx-19 — ZCC metric buffering when TPG unreachable

*Origin: `references/zdx/cloud-architecture.md` § Open questions; `references/zdx/overview.md` § Open questions*

When ZCC cannot reach the TPG (transient cloud-unreachable), it is presumed that metrics are buffered on-device and flushed on reconnect, but whether buffering happens at all, the buffer size/retention, and the flush behavior are not documented in vendor sources.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test (induce TPG unreachability, observe gap-fill on reconnect)

---

### zdx-20 — Cloud Path probe routing through Service Edges

*Origin: `references/zdx/cloud-architecture.md` § Open questions*

Vendor sources note Cloud Path probes can visualize tunneling through a Public Service Edge, but whether routing through a Service Edge is mandatory, conditional on the network path, or per-probe-config optional is not documented.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zdx-21 — Call Quality Monitoring data flow

*Origin: `references/zdx/cloud-architecture.md` § Open questions*

The polling frequency, latency, and failure modes of ZDX's Call Quality Monitoring integration with Microsoft Graph / Zoom are not documented. The call-quality-metrics surface exists in the SDK (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go:25`), but how the underlying meeting telemetry is ingested is unstated.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### zdx-22 — ADX tenant isolation mechanism

*Origin: `references/zdx/cloud-architecture.md` § Open questions*

ZDX stores telemetry in Microsoft Azure Data Explorer, but the specific tenant-isolation mechanism at the ADX layer (per-tenant partitioning, RBAC, encryption boundaries) is not documented.

**Status**: open
**Resolves with**: zscaler doc not yet read OR support ticket

---

### zdx-23 — Wi-Fi field availability in device API response

*Origin: `references/zdx/devices.md` § Open questions*

The Go device `Network` struct exposes `wifi_adapter` / `wifi_type` / `ssid` / `bssid` (and channel) (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/devices.go:50-54`), but the Python device model does not surface them. Whether these fields are present in the API response for all device types or only for wireless-capable devices (and whether Python silently drops them) is unverified.

**Status**: open
**Resolves with**: lab test (capture device responses across wired and wireless devices) OR zscaler doc not yet read

---

### zdx-24 — Device health-metric category enumeration

*Origin: `references/zdx/devices.md` § Open questions*

The Go health-metrics docstring lists CPU, Memory, Disk I/O, Network I/O, Wi-Fi, Network Bandwidth, "etc." as supported categories (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go:28`), but this is a prose comment ending in "etc.", not an enumerated type. The exhaustive supported-category set is unverified.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test (enumerate accepted metric categories against the endpoint)

---

### zdx-25 — os_build API presence

*Origin: `references/zdx/devices.md` § Open questions*

The Python device model surfaces `os_build` while Go does not, implying the field is in the API response but silently dropped by Go. Whether `os_build` is actually present in the wire response is unconfirmed without a raw sample.

**Status**: open
**Resolves with**: lab test (capture a raw device response and check for `os_build`) OR zscaler doc not yet read

---

### zdx-26 — Geolocation hierarchy traversal

*Origin: `references/zdx/devices.md` § Open questions*

`DeviceActiveGeo.children` holds nested `Children` objects, and recursive traversal of the geolocation tree via repeated `parent_geo_id`-filtered calls is implied by the nesting rather than stated. Whether callers are expected to traverse the embedded children or re-query per level, and how deep the hierarchy goes, is not documented.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zdx-27 — Device-event category enumeration

*Origin: `references/zdx/devices.md` § Open questions*

The Go `GetEvents` docstring comment lists only Zscaler, Hardware, Software, Network as event categories (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_events.go:30`); no SDK model or vendored help capture enumerates a fixed category set. Whether the API also emits Location, User, or other event categories is unconfirmed.

**Status**: open
**Resolves with**: lab test (collect observed event categories from a raw response) OR zscaler doc not yet read

---

### zdx-28 — Call-quality-metrics application scope and metric labels

*Origin: `references/zdx/devices.md` § Open questions*

The call-quality-metrics surface carries `meet_id` / `meet_session_id` / `meet_subject` (`vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_quality_metrics.go:17-19`), implying meeting-application (Teams/Zoom) scope, but which applications actually populate this surface and which metric labels appear in the `metrics` series are not enumerated in source. (Distinct from `zdx-08`, which is about the wire *shape* of each `metrics` element; this entry is about *which* labels and *which* apps.)

**Status**: open
**Resolves with**: lab test (capture call-quality-metrics across meeting apps) OR zscaler doc not yet read

---

### zdx-29 — Device grouping / cohorts

*Origin: `references/zdx/devices.md` § Open questions*

Neither SDK exposes device grouping or cohort constructs; grouping may be a portal-only feature. Whether ZDX supports device cohorts at all, and if so where they surface, is unverified.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zdx-30 — Per-probe cadence during a Diagnostics Session

*Origin: `references/zdx/diagnostics-and-alerts.md` § Open questions; `references/zdx/probes.md` § Open questions*

The deeptrace session-length set is resolved (5/15/30/60 min) and a help doc states session data is "updated every minute," but the per-probe cadence *during* a session — whether it remains the steady-state 5-minute interval or intensifies to a faster rate — is not stated in any cited source.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test (run a session, observe inter-sample spacing)

---

### zdx-31 — Alert rule-evaluation cadence

*Origin: `references/zdx/diagnostics-and-alerts.md` § Open questions*

Alerts fire "when condition crosses threshold," but the evaluation interval — every score update, hourly, or continuously — is not stated in any cited source. This governs alert-latency expectations.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zdx-32 — Deeptrace session-name wire field

*Origin: `references/zdx/diagnostics-and-alerts.md` § Open questions*

No source enumerates the on-wire JSON field the start endpoint expects for the session name. The Python `TraceDetails.request_format` maps `session_name` → `name` (`vendor/zscaler-sdk-python/zscaler/zdx/models/troubleshooting.py:120`), but `start_deeptrace` builds the POST body straight from kwargs with key `session_name` (`vendor/zscaler-sdk-python/zscaler/zdx/troubleshooting.py:182`), and the Go start payload also uses `session_name` (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:42`). Whether the live API expects `name` or `session_name` is not confirmable from source.

**Status**: open
**Resolves with**: lab test (submit each key, observe which the API honors) OR zscaler doc not yet read

---

### zdx-33 — session_length request-vs-response key

*Origin: `references/zdx/diagnostics-and-alerts.md` § Open questions*

The start payloads use key `session_length_minutes` (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:46`), but the Go response struct `TraceDetails` reads `session_length` (`vendor/zscaler-sdk-go/zscaler/zdx/services/troubleshooting/deeptrace/deeptrace.go:37`). Whether the request and response deliberately use different keys for the same field, or one of the tags is stale, is not confirmable from source beyond these struct tags.

**Status**: open
**Resolves with**: lab test (start a session, inspect the response key) OR zscaler doc not yet read

---

### zdx-34 — Maximum look-back window and probe-ID expiry

*Origin: `references/zdx/diagnostics-and-alerts.md` § Open questions*

Only the 2-hour default look-back is documented for the probe-read endpoints (default behavior noted in the Go health-metrics docstring, `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/devices/device_health_metrics.go:27`). No source states a maximum `since` / look-back window, nor whether probe IDs expire after the look-back window elapses.

**Status**: open
**Resolves with**: lab test (request progressively older windows; re-use an aged probe ID) OR zscaler doc not yet read

---

### zdx-35 — share_snapshot obfuscation transmission

*Origin: `references/zdx/diagnostics-and-alerts.md` § Open questions*

The Python `share_snapshot` docstring documents an `obfuscation` argument with enum values `USER_NAME` / `LOCATION` / `DEVICE_NAME` / `IP_ADDRESS` / `WIFI_NAME` (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:43-45`), but the body-builder copies only `name`, `alert_id`, and the converted `expiry` into the request body (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:95-106`); `obfuscation` is not in the `@zdx_params` shorthand path (`vendor/zscaler-sdk-python/zscaler/utils.py:390`) and is not extracted into the body. From source alone it is unclear whether an `obfuscation` value passed by a caller reaches the API in this SDK version. The API contract and enum set themselves are not in question — only this Python client's transmission of the field.

**Status**: open
**Resolves with**: code read (a future SDK release that wires the field) OR lab test (capture the outbound snapshot request body)

---

### zdx-36 — PFT vs Availability score weighting

*Origin: `references/zdx/overview.md` § Open questions; `references/zdx/score.md` § Open questions*

The ZDX Score takes Page Fetch Time and Availability as inputs, but the numerical weighting between them — the formula or relative weight — is not documented (`vendor/zscaler-help/about-zdx-score.md`). PFT is named the primary input and Availability a factor, without quantification.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zdx-37 — Zero-value handling in the lowest-value-within-hour rollup

*Origin: `references/zdx/overview.md` § Open questions; `references/zdx/score.md` § Open questions*

The hourly score rollup selects the "lowest value within the hour," but whether probe failures (zero or null values) are included or excluded in that selection is unstated. The answer materially affects how a probe outage propagates into the availability component of the score.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test (induce a probe failure, observe the hourly rollup)

---

### zdx-38 — Which metrics feed the composite score

*Origin: `references/zdx/score.md` § Open questions*

The full retrievable metric set is resolved from the Go SDK (Web Probes: Page Fetch Time, Server Response Time, DNS Time, Availability; CloudPath: End to End, Client–Egress, Egress–Application, ZIA Service Edge–Egress, ZIA Service Edge–Application — `vendor/zscaler-sdk-go/zscaler/zdx/services/reports/applications/application_score_metrics.go:38-41`). What remains unverified is *which* of these actually feed the composite ZDX Score versus being trend-only retrievable metrics. The help doc names PFT and Availability but does not state whether Server Response Time, DNS Time, or the CloudPath latency metrics contribute to the score.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zdx-39 — Score recalculation lag for new users or devices

*Origin: `references/zdx/score.md` § Open questions*

When a new user or device comes online, the lag before it appears in user-level / device-level scores is not documented. Relevant to "I onboarded this device but ZDX shows no score yet" questions.

**Status**: open
**Resolves with**: zscaler doc not yet read OR operator experience

---

### zdx-40 — Device-level vs user-level score aggregation

*Origin: `references/zdx/score.md` § Open questions*

The source mentions scores over "all users, their devices, and their locations" but does not clarify whether the score is computed per (user, device) pair or rolled up per user across that user's devices. The aggregation grain is unverified.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test (compare a user's score against per-device scores)

---

### zdx-41 — Probe-result retention and aging granularity

*Origin: `references/zdx/probes.md` § Open questions*

Whether probe results are retained indefinitely or aged out, and at what time granularity older results are down-sampled, is not documented in the vendored help captures.

**Status**: open
**Resolves with**: zscaler doc not yet read OR tenant snapshot

---

### zdx-42 — Adaptive Mode scoring comparability

*Origin: `references/zdx/probes.md` § Open questions*

Help articles reference an "Adaptive Mode" that dynamically adjusts probe frequency, but how this affects scoring — specifically whether scores remain comparable across different probe cadences — is not documented.

**Status**: open
**Resolves with**: zscaler doc not yet read OR lab test

---

### zdx-43 — Inventory time-range filter server support

*Origin: `references/zdx/sdk.md` § Open questions*

`list_softwares` applies the `@zdx_params` decorator (`vendor/zscaler-sdk-python/zscaler/zdx/inventory.py:33`), which converts a `since` argument into a `from`/`to` epoch pair, so the client attaches the time-range filter when provided. Whether the inventory endpoint server-side actually honors the time-range filter — returning only software seen within the window — is not confirmable from source; the decorator attaches the params, but server support needs hands-on verification.

**Status**: open
**Resolves with**: lab test (compare inventory results across time windows) OR zscaler doc not yet read

---

### zid-01 — Admin permission-level enum (Restricted Full / Restrictive View)

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

The ZIdentity admin-RBAC capture lists four permission levels — Full / View Only / Restricted / None (`vendor/zscaler-help/admin-rbac-captures.md:124`) — but the extraction report notes shared docs elsewhere reference "Restricted Full" and "Restrictive View" as additional or alternate level names. Which enum is authoritative for ZIdentity admin roles is unresolved from the captured source.

**Status**: open
**Resolves with**: zscaler doc not yet read (re-capture the live Admin Roles & Permissions article — see `zid-35`) OR tenant snapshot

---

### zid-02 — ZIdentity role to per-product scope inheritance

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

It is unclear whether a ZIdentity "User Admin" role combined with Full Administrative Entitlements automatically inherits any ZIA/ZPA admin scope, or whether per-product admin scope must be configured separately in each product console. The captured admin-RBAC source (`vendor/zscaler-help/admin-rbac-captures.md`) describes ZIdentity-side role assignment but does not state how (or whether) it propagates into per-product feature/scope flags.

**Status**: open
**Resolves with**: tenant snapshot (compare a ZIdentity admin's role against the scope they actually receive in ZIA/ZPA) OR zscaler doc not yet read

---

### zid-03 — Role-management APIs absent from the SDK surface

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

Neither SDK exposes an endpoint to list role definitions, create custom roles, assign roles, or query the permission matrix at runtime — the Go ZIdentity service catalog contains only `common`, `groups`, `resource_servers`, `user_entitlement`, and `users` (see `zid/sdk.md` item 1, resolved), and the Python `zid/` package has no role-management module. Whether role management is portal-only, or served by an admin endpoint the SDKs simply do not wrap, is not determinable from source.

**Status**: open
**Resolves with**: zscaler doc not yet read OR live API trace against a tenant

---

### zid-04 — Admin role-assignment audit trail

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

No audit endpoint for ZIdentity role-assignment changes is wrapped in either SDK (the Python `zid/` package and Go `zid/services/` catalog carry no audit-log service). Whether ZIdentity records who-assigned-which-role-when, and where that record is read from, is not determinable from the SDK surface.

**Status**: open
**Resolves with**: zscaler doc not yet read OR live API trace against a tenant

---

### zid-05 — `scope` field semantics and value enum

*Origin: `references/zidentity/user-entitlements.md` § Open questions; `references/zidentity/admin-rbac.md` § Open questions*

The entitlement `scope` field is populated by both SDKs (Python `vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py:52-60`; the Go `Entitlements` struct carries `Scope common.IDNameDisplayName`) but no value enum or operational definition is documented in either SDK. Fixture examples include `Global`, `Limited`, and `AllResources`, yet what `Limited` actually restricts — which resources, at which granularity — is not stated. This is the same field surfaced from two docs (admin-rbac calls it `Entitlement.scope`; user-entitlements calls it `scope`).

**Status**: open
**Resolves with**: vendor documentation OR tenant-side check (read live entitlements and correlate each `scope` value with the access it grants)

---

### zid-06 — Service vs administrative entitlements: when to use which

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

Both `get_service_entitlement` and `get_admin_entitlement` exist in the Python SDK (`vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:37,81`). The response-shape difference is resolved (see `zid/sdk.md` item 5: admin entitlements answer "what can this user do?"; service entitlements answer "which tenant/service is this account tied to?"). What remains open is the *usage* guidance — whether a caller diagnosing a given access problem should read one, the other, or both — which no vendor source documents.

**Status**: open
**Resolves with**: vendor documentation OR operator experience

---

### zid-07 — `get_service_entitlement` return shape for multi-service users

*Origin: `references/zidentity/user-entitlements.md` § Open questions*

The Go SDK returns `[]Service` for service entitlements, but the Python SDK constructs a single `Service` object from the raw body at `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:118` (`Service(self.form_response_body(response.get_body()))`). A single `Service.__init__` over an array-shaped body would parse it oddly rather than yield a list. The live wire shape for a user holding multiple service entitlements is undemonstrated in the vendored fixtures, so the Python behavior for that case is unverified.

**Status**: open
**Resolves with**: lab test (read service entitlements for a multi-service user, observe the body shape)

---

### zid-08 — Entitlement API behavior by user IdP source

*Origin: `references/zidentity/user-entitlements.md` § Open questions*

Whether the entitlement endpoints return different results for SCIM-provisioned vs ZIdentity-internal users is not addressed by either SDK. The `source` field on the user record (`vendor/zscaler-sdk-python/zscaler/zid/users.py:187` — `UI`/`API`/`SCIM`/`JIT`) gives user origin, but no entitlement endpoint accepts or exposes `source`, so any source-dependent behavior is invisible at the SDK layer.

**Status**: open
**Resolves with**: tenant-side check (compare entitlement responses for a SCIM user vs an internal user)

---

### zid-09 — Scope forward-compatibility (single object vs list)

*Origin: `references/zidentity/user-entitlements.md` § Open questions*

The Go SDK declares an unused `Scope` struct wrapping a *list* — `type Scope struct { Scope []common.IDNameDisplayName }` (`vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go:21-23`) — while the live `Entitlements` struct carries a single `Scope common.IDNameDisplayName` object. The unused list-shaped struct suggests a list-of-scopes design was considered or planned. Whether the wire format will change from a single scope object to a list is unknown.

**Status**: open
**Resolves with**: vendor API spec OR changelog review

---

### zid-10 — Entitlement role-name enum completeness

*Origin: `references/zidentity/user-entitlements.md` § Open questions*

Observed entitlement role names in test fixtures (`SuperAdmin`, `Admin`, `ReadOnly`, `PolicyAdmin`, `Auditor`) may not be exhaustive — no enum constants are exported in either SDK (`vendor/zscaler-sdk-go/zscaler/zid/services/user_entitlement/user_entitlement.go` uses `omitempty` strings with no enumeration). The full set of valid role names cannot be confirmed from source.

**Status**: open
**Resolves with**: vendor role documentation OR live API enumeration

---

### zid-11 — `access_token_life_time` field semantics

*Origin: `references/zidentity/api-clients.md` § Open questions*

`add_api_client` accepts `access_token_life_time` with an example value of `86400` (= 24h, `vendor/zscaler-sdk-python/zscaler/zid/api_client.py:195`), but the field's own docstring at `vendor/zscaler-sdk-python/zscaler/zid/api_client.py:164` reads "Whether the client is active (true) or inactive (false)" — a description that fits an active-flag, not a token TTL, and contradicts the field name. Whether this is a per-client token-TTL override (and how it interacts with the tenant Authentication Session default) is unresolved from source.

**Status**: open
**Resolves with**: lab test (set distinct `access_token_life_time` values, observe issued-token lifetime) OR vendor documentation

---

### zid-12 — Token revocation via SDK / API

*Origin: `references/zidentity/api-clients.md` § Open questions*

The Python SDK exposes API-client and secret CRUD (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:156-530`) but no token-revocation endpoint. Whether outstanding access tokens can be revoked programmatically (vs portal-only), and the post-revocation propagation window, is unconfirmed in SDK source. The "revocation takes effect at the next OneAPI call" timing is asserted from the help related-articles list but the source articles are uncaptured (see `zid-33`).

**Status**: open
**Resolves with**: zscaler doc not yet read (capture the Revoking Access Tokens article — see `zid-33`) OR lab test

---

### zid-13 — `add_api_client_secret` `expires_at` behavior

*Origin: `references/zidentity/sdk.md` § Open questions (item 2)*

`add_api_client_secret` accepts `expires_at` as a string Unix epoch; the only SDK docstring example shows `'1785643102'` (a valid future epoch, `vendor/zscaler-sdk-python/zscaler/zid/api_client.py:458`). The API behavior when `expires_at` is omitted or set to a past value is not documented, and the acceptable range is not stated, so neither can be confirmed from source.

**Status**: open
**Resolves with**: lab test (create secrets with omitted / past / far-future `expires_at`, observe acceptance and resulting expiry)

---

### zid-14 — JWKS `authType` request body unobserved in vendored sources

*Origin: `references/zidentity/api-divergences.md` § Open questions*

The `JWKS` `authType` value is documented in the Python SDK docstring (`vendor/zscaler-sdk-python/zscaler/zid/api_client.py:167`, alongside `SECRET` and `PUBKEYCERT`), but the captured Postman samples exercise only `SECRET` and `PUBKEYCERT` bodies. No live `JWKS`-configured client body was observed in the vendored sources, so the exact required fields for a JWKS client (e.g. `clientJWKsUrl` vs `publicKeys[]`) are inferred from the model, not seen on the wire.

**Status**: open
**Resolves with**: tenant snapshot (capture a JWKS-configured API client body) OR zscaler doc not yet read

---

### zid-15 — Bare `/admin/api/v1` prefix acceptance on the `api.zsapi.net` host

*Origin: `references/zidentity/api-divergences.md` § Open questions*

The two SDKs pair a path prefix with a host and neither crosses over: the Python SDK uses `api.zsapi.net` with a `/ziam/admin/api/v1` prefix, while the Go SDK uses `{vanity}-admin.zslogin.net` with a bare `/admin/api/v1` prefix (no `/ziam`). Whether the API accepts the bare `/admin/api/v1` prefix on the `api.zsapi.net` host (or only on the vanity-login host) is not determinable from source alone.

**Status**: open
**Resolves with**: live API trace (send a bare-prefix request to `api.zsapi.net`, observe acceptance)

---

### zid-16 — Which wire host a live tenant actually serves

*Origin: `references/zidentity/resource-servers.md` § Open questions*

The Go SDK builds requests against `{vanity_domain}-admin.zslogin.net` (`vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:402-414`) while the Python SDK uses `https://api.zsapi.net` as its base (`vendor/zscaler-sdk-python/zscaler/request_executor.py:32`). Both hosts are present in current vendor source, so both are presumably live, but whether a tenant routes them identically (one an edge/login-host alias, the other a gateway alias) or whether one is transitional cannot be determined from the SDKs alone. This is the host-routing twin of the prefix question in `zid-15`.

**Status**: open
**Resolves with**: live API trace against a tenant (resolve both hosts, compare responses)

---

### zid-17 — Group dual-flag semantics (`isDynamicGroup` vs `dynamicGroup`)

*Origin: `references/zidentity/groups.md` § Open questions*

The group record carries two separate dynamic-group booleans — `isDynamicGroup` and `dynamicGroup` (`vendor/zscaler-sdk-go/zscaler/zid/services/groups/groups.go:26-27`; Python mirrors both at `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py:89-90`). What the server does when the two flags disagree is undocumented; the Go test only ever sets `DynamicGroup: true`, so the relationship between the two is unverified.

**Status**: open
**Resolves with**: API spec review OR lab test (set the two flags to conflicting values, observe server behavior)

---

### zid-18 — Dynamic-group membership mutation behavior

*Origin: `references/zidentity/groups.md` § Open questions*

Whether `add_user_to_group` (`vendor/zscaler-sdk-python/zscaler/zid/groups.py`) on a *dynamic* group is rejected server-side or silently succeeds is unknown — dynamic groups derive membership from rules, so a manual add is logically ambiguous, and no source states which way the server resolves it.

**Status**: open
**Resolves with**: lab test (call a manual add against a dynamic group, observe accept vs reject)

---

### zid-19 — User deduplication in bulk add

*Origin: `references/zidentity/groups.md` § Open questions*

Whether duplicate user IDs in `add_users_to_group` (`vendor/zscaler-sdk-python/zscaler/zid/groups.py`) result in rejection, deduplication, or silent ignore is unknown from source.

**Status**: open
**Resolves with**: lab test (submit a bulk add with repeated user IDs, observe the result)

---

### zid-20 — SCIM-sourced group mutation semantics

*Origin: `references/zidentity/groups.md` § Open questions*

Whether SDK CRUD operations on SCIM-provisioned groups (`source: SCIM`) are rejected by the server — on the principle that the IdP owns the record — is undocumented. The `source` field exists (`vendor/zscaler-sdk-python/zscaler/zid/groups.py:167` lists `'SCIM'`, `'MANUAL'`) but no source states whether it gates mutation.

**Status**: open
**Resolves with**: lab test OR vendor documentation

---

### zid-21 — Group `source` value enum completeness

*Origin: `references/zidentity/sdk.md` § Open questions (item 7)*

For *users*, the `source` enum is fully documented — `UI`, `API`, `SCIM`, `JIT` (`vendor/zscaler-sdk-python/zscaler/zid/users.py:187`). For *groups*, the docstring lists only `'SCIM'` and `'MANUAL'` as examples (`vendor/zscaler-sdk-python/zscaler/zid/groups.py:167`) and the Go struct uses `omitempty` with no enumeration. Whether groups share the full user enum (and whether `JIT` / `API` / `UI` are valid group sources) cannot be confirmed from source.

**Status**: open
**Resolves with**: vendor documentation OR live API enumeration

---

### zid-22 — Group enabled/disabled flag on the wire

*Origin: `references/zidentity/snapshot-schema.md` § Open questions*

User records expose `status` as a boolean (active/disabled), but the group model carries no `status` field in either SDK. Whether groups have an equivalent enabled/disabled flag that the captured models simply omit, or whether groups have no such concept, is not confirmed from the vendored sources.

**Status**: open
**Resolves with**: tenant snapshot (read a live group record, check for a status field) OR vendor documentation

---

### zid-23 — Empty `serviceScopes` array semantics

*Origin: `references/zidentity/resource-servers.md` § Open questions*

The meaning of a resource server with an empty `serviceScopes` slice (vs a populated one) is not documented in either SDK — whether it means "no scopes available", "all scopes", or "scopes defined elsewhere" is unstated.

**Status**: open
**Resolves with**: tenant-side check (read live resource servers, correlate empty `serviceScopes` with grantable scopes) OR vendor documentation

---

### zid-24 — `defaultApi` flag behavior

*Origin: `references/zidentity/resource-servers.md` § Open questions*

The `defaultApi` boolean on the resource-server record is present in both SDKs (`vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go:22`; `vendor/zscaler-sdk-python/zscaler/zid/models/resource_servers.py:90`) but its operational meaning — which clients it applies to, what it overrides — is not described in any vendored source.

**Status**: open
**Resolves with**: vendor documentation OR lab test

---

### zid-25 — Resource-server enumerability (hidden internal entries)

*Origin: `references/zidentity/sdk.md` § Open questions (item 6)*

Whether `list_resource_servers` enumerates *all* resource servers in a tenant, or whether some are Zscaler-internal and hidden from the list, is not confirmed from source. Both SDKs hit the resource-servers endpoint with no filter parameter that would distinguish tenant-created from system-provided entries — via different host+prefix (Python `api.zsapi.net/ziam/admin/api/v1/resource-servers`, `vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py`; Go `{vanity}-admin.zslogin.net/admin/api/v1/resource-servers`, `vendor/zscaler-sdk-go/zscaler/zid/services/resource_servers/resource_servers.go` + `oneapiconfig.go:404-414`).

**Status**: open
**Resolves with**: tenant-side check (list resource servers on a live tenant, compare against the console) OR vendor documentation

---

### zid-26 — ZIdentity snapshot writer output shape

*Origin: `references/zidentity/snapshot-schema.md` § Open questions*

Whether a future ZIdentity snapshot stores the raw list body (so jq uses `.records[]`) or wraps pages in an array (so jq uses `.[0].records[]`) is a writer decision not yet made — ZIdentity is not currently snapshotted. The doc's jq examples assume the raw single-object body, matching the SDK list models (`vendor/zscaler-sdk-python/zscaler/zid/models/users.py:36-67`); confirm and re-document once the writer exists.

**Status**: open
**Resolves with**: design decision (made when the ZIdentity snapshot writer is built; expected alongside the `linear/dav-19-zidentity-refresh` work)

---

### zid-27 — Secrets snapshot file layout

*Origin: `references/zidentity/snapshot-schema.md` § Open questions*

If API-client secrets are dumped to a snapshot, the per-client file/key naming convention (e.g. `api-client-secrets.json` keyed by client id) is undefined. More fundamentally, whether a live `GET /api-clients/{id}/secrets` returns the real secret `value` is unverified: the response **shape** carries a `value` field (`vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py:287-318`, mapped at `:305`) and the Postman sample includes one, but that sample value is a synthetic placeholder and the portal documents the secret as not retrievable after creation. Treat `value` as sensitive and consider excluding it from the snapshot entirely rather than making a layout decision.

**Status**: open
**Resolves with**: a live `GET .../secrets` capture to confirm whether `value` is populated post-creation, plus the snapshot-writer design decision

---

### zid-28 — Authentication levels: per-product or global only

*Origin: `references/zidentity/step-up-authentication.md` § Open questions*

Whether ZIdentity authentication levels can be configured differently per-product or only globally is unresolved; the captured step-up material (`vendor/zscaler-help/understanding-step-up-authentication-zidentity.md`) describes a single tenant-wide level tree, but does not state whether per-product overrides exist.

**Status**: open
**Resolves with**: zscaler doc not yet read OR tenant-side check

---

### zid-29 — Step-up for SCIM users without a mapped external IdP identity

*Origin: `references/zidentity/step-up-authentication.md` § Open questions*

How step-up interacts with SCIM-provisioned users who lack a mapped external IdP identity — whether such users can step up at all — is not addressed by the captured step-up material (`vendor/zscaler-help/understanding-step-up-authentication-zidentity.md`).

**Status**: open
**Resolves with**: lab test (attempt a step-up challenge for a SCIM user with no external IdP mapping) OR zscaler doc not yet read

---

### zid-30 — Step-up "message to user" localization

*Origin: `references/zidentity/step-up-authentication.md` § Open questions*

Whether the per-level "message to user" field supports localization (multiple language strings) or only a single string per level is not stated in the captured step-up material (`vendor/zscaler-help/understanding-step-up-authentication-zidentity.md`).

**Status**: open
**Resolves with**: zscaler doc not yet read OR tenant-side check

---

### zid-31 — Where step-up elevation is logged

*Origin: `references/zidentity/step-up-authentication.md` § Open questions*

Whether step-up elevation is recorded in ZIA Transaction logs or ZPA LSS User Activity logs — and with what field values — is not stated in the captured step-up material (`vendor/zscaler-help/understanding-step-up-authentication-zidentity.md`). Relevant to "can I see when a user was challenged" questions.

**Status**: open
**Resolves with**: lab test (trigger a step-up, search ZIA/ZPA logs for a corresponding record) OR zscaler doc not yet read

---

### zid-32 — Omitting `id` on user create

*Origin: `references/zidentity/users.md` § Open questions*

The `add_user` docstring example passes `id` explicitly (`vendor/zscaler-sdk-python/zscaler/zid/users.py`). Whether omitting `id` triggers server-side auto-generation or returns an error is unverified from source.

**Status**: open
**Resolves with**: lab test (create a user with no `id`, observe auto-generation vs error) OR API spec review

---

### zid-33 — About / Revoking Access Tokens articles uncaptured

*Origin: `references/zidentity/api-clients.md` § Open questions*

The `About Access Tokens` and `Revoking Access Tokens` help articles are named in the related-articles list of `vendor/zscaler-help/zidentity-about-api-clients.md` but are not captured in `vendor/zscaler-help/`. The "revocation takes effect at the next OneAPI call" timing and the post-revocation propagation window are therefore unverified against source. Capturing these pages would also resolve `zid-12`.

**Status**: open
**Resolves with**: zscaler doc not yet read / capture

---

### zid-34 — API Client Access Policy article uncaptured

*Origin: `references/zidentity/api-clients.md` § Open questions*

The API Client Access Policy is referenced in the captured API-clients help page, but the dedicated policy article is not in `vendor/zscaler-help/`. The specific knobs (source-IP / time-of-day / other conditions) are currently inferred by analogy to admin IP restriction, not read from source.

**Status**: open
**Resolves with**: zscaler doc not yet read / capture

---

### zid-35 — Admin Roles & Permissions module × level matrix uncaptured

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

The authoritative full permission matrix (25+ modules × 4 levels) is explicitly deferred to the live help portal by the capture (`vendor/zscaler-help/admin-rbac-captures.md:128`) and is not present in `vendor/zscaler-help/`. Capturing it would also resolve the permission-level enum question (`zid-01`).

**Status**: open
**Resolves with**: zscaler doc not yet read / capture

---

### ai-security-01 — AI Guard direction literal aliases

*Origin: `references/ai-security/api-divergences.md` § Direction value divergence*

The Python SDK docstrings define AI Guard `direction` as `IN` or `OUT` (`vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:51`, `:131`), and integration docs use `IN`/`OUT` for prompt/response scanning. The DAS Help page examples instead pass `"request"` and `"response"` (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:196`, `:200`, `:204`, `:208`). Whether the live API accepts both literal sets, normalizes them, or treats one set as pseudocode is unverified.

**Status**: open
**Resolves with**: lab test (call both endpoints with `IN`/`OUT` and `request`/`response`) OR vendor API documentation

---

### ai-security-02 — AI Guard execute-policy without policyId

*Origin: `references/ai-security/api-divergences.md` § `policyId` requirement divergence*

The DAS Help page states `policyId` is required for the explicit-policy option (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:78`), while the Python SDK method marks `policy_id` optional and only emits `policyId` when supplied (`vendor/zscaler-sdk-python/zscaler/zaiguard/policy_detection.py:43`, `:84`). It is unclear whether the server rejects `execute-policy` without a policy ID, falls back to resolution, or whether the SDK optionality exists only for payload construction convenience.

**Status**: open
**Resolves with**: lab test (call `/v1/detection/execute-policy` without `policyId`) OR vendor API documentation

---

### ai-security-03 — AI Guard detector taxonomy source of truth

*Origin: `references/ai-security/api-divergences.md` § Detector taxonomy divergence*

The public Help article gives a 15-item capability list (`vendor/zscaler-help/ai-guard-what-is.md:18`-`:46`), while the integration skill/reference says AI Guard has 19 prompt detectors and 21 response detectors (`vendor/zguard-ai-integrations/Anthropic/claude-code-skill/README.md:21`) organized by `IN` and `OUT`. Whether the integration detector list is a console-complete taxonomy, an integration-local reference, or ahead of the captured Help page is not established.

**Status**: open
**Resolves with**: current AI Guard console capture OR vendor Help/API documentation that lists the detector names by direction

---

### ai-security-04 — AI Guard admin-plane programmability

*Origin: `references/ai-security/api-divergences.md` § Source classes with no AI Guard admin-plane hit*

This refresh found Python SDK runtime policy detection and public DaaS integration examples, but no broad AI Guard admin-plane API, Go SDK service, Terraform resource, MCP tool, Postman endpoint, or Automation Hub procedure in the inspected source classes. This is an audit-scoped absence, not proof that no private or future admin automation surface exists.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing admin-plane operations, or explicit vendor confirmation

---

### risk360-01 — Risk360 programmable API and export surface

*Origin: `references/risk360/overview.md` § Open questions*

Risk360 help captures describe dashboard, factors, asset-level risk, Monte Carlo, log processing, and product positioning (`vendor/zscaler-help/what-risk360.md:8-22`, `vendor/zscaler-help/risk360-about-dashboard.md:8-48`, `vendor/zscaler-help/risk360-monte-carlo.md:12-34`). A Python ZIdentity integration cassette incidentally shows a `ZRA` / `Risk360` resource-server entry with read-only and super-admin role scopes (`vendor/zscaler-sdk-python/tests/integration/zid/cassettes/TestResourceServers.yaml:25-28`, `:132-135`), but this refresh did not find a product-specific Risk360 SDK service, Terraform resource, Ansible module, MCP tool, or Postman endpoint family. Treat Risk360 programmability and export automation as unresolved until a vendor API source is captured.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing Risk360 operations, or tenant-side API discovery

---

### risk360-02 — Risk360 factor catalog, weighting, and peer-benchmark methodology

*Origin: `references/risk360/overview.md` § Open questions*

The captured sources establish that Risk360 uses four attack-stage categories, weighted factors, industry-peer comparison, and a moving factor count (`vendor/zscaler-help/what-risk360.md:8-22`, `vendor/zscaler-help/risk360-about-dashboard.md:8-16`, `vendor/zscaler-help/risk360-about-factors.md:8-20`, `vendor/zscaler-help/risk360-product-marketing.md:18-24`). They do not enumerate the full current factor catalog, disclose per-factor weights, or explain the peer-benchmark cohort methodology.

**Status**: open
**Resolves with**: captured Factors-page export, vendor methodology documentation, tenant snapshot, or support confirmation

---

### breach-predictor-01 — Breach Predictor API, integration, and data-source details

*Origin: `references/breach-predictor/overview.md` § Open questions*

The captured Breach Predictor help states that the product consumes and analyzes data from multiple sources, uses generative AI, and presents breach-probability, Sankey, MITRE ATT&CK, AI Assist, dashboard, findings, events, threat-landscape, ticket, and profile surfaces (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.md:25-48`). This refresh did not find a product-specific SDK service, Terraform resource, Ansible module, MCP tool, or Postman endpoint family, and the source does not enumerate the ingestion sources or integration API details.

**Status**: open
**Resolves with**: vendor API/integration documentation, SDK/provider source, tenant-side integration capture, or support confirmation

---

### uvm-01 — UVM AnySource Upload File API endpoint and broader API surface

*Origin: `references/uvm/overview.md` § Open questions*

The UVM AnySource capture names Upload File, AWS S3, GCP, Webhook, and Upload File API methods for AnySource ingestion (`vendor/zscaler-help/uvm-anysource-connector.md:8-16`), and the marketing capture describes connectors, AnySource, AnyTarget, reporting, and automated workflows (`vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:21-35`). This refresh did not find a UVM endpoint schema or SDK/provider/MCP/Postman implementation for the Upload File API or broader UVM administration.

**Status**: open
**Resolves with**: vendor API documentation, captured Upload File API article, SDK/provider source, or tenant-side API discovery

---

### dspm-01 — DSPM programmable/admin API and scanner contract

*Origin: `references/dspm/overview.md` § Open questions*

The DSPM captures establish product behavior, supported provider/on-prem scopes, scan/authentication types, classification, OCR, and data-residency claims (`vendor/zscaler-help/dspm-what-data-security-posture-management.md:8-78`, `vendor/zscaler-help/dspm-marketing.md:48-63`). This refresh did not find a DSPM SDK service, Terraform resource, Ansible module, MCP tool, or Postman endpoint family, and the captures do not provide an endpoint-level admin API or detailed scanner/orchestrator deployment contract.

**Status**: open
**Resolves with**: vendor API documentation, captured setup guide, SDK/provider source, or tenant-side deployment/API discovery

---

### zbi-01 — Manual URL Filter Isolate SSL Inspection prerequisite

*Origin: `references/zbi/policy-integration.md` § ZIA side — URL Filter `Isolate` action*

The Zero Trust Browser traffic-flow article states that HTTP/HTTPS requests matching a URL Filtering policy with isolation are redirected to the isolation profile URL (`vendor/zscaler-help/what-is-zero-trust-browser.md:28`). The Smart Browser Isolation article separately states that Smart Isolation decrypts suspicious sites using SSL/TLS Inspection and auto-creates an editable SSL/TLS Inspection rule (`vendor/zscaler-help/configuring-smart-browser-isolation-policy.md:16`, `:24`). The captured sources do not explicitly state whether a manual URL Filtering `Isolate` rule has the same SSL/TLS Inspection prerequisite, nor the precise behavior for HTTPS traffic in an SSL bypass path.

**Status**: open
**Resolves with**: lab test across HTTPS URLs with inspect vs bypass, plus vendor documentation or API behavior notes for manual URL Filtering `ISOLATE`

---

### zbi-02 — `cbizpaprofile` vs `isolationprofile` preferred endpoint

*Origin: `references/zbi/api.md` § `cbizpaprofile` vs `isolationprofile` — disambiguation note*

The ZPA CBI SDK surface exposes two read-only profile-list paths with overlapping names but different bases and response shapes: `cbizpaprofile` uses `/zpa/cbiconfig/cbi/api/customers/{customerId}/zpaprofiles` (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go:13-14`, `:62-70`), while `isolationprofile` uses `/zpa/mgmtconfig/v1/admin/customers/{customerId}/isolation/profiles` (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go:14-15`, `:52-59`). The Postman collection contains both (`vendor/zscaler-api-specs/oneapi-postman-collection.json:19209`, `:61255`). Which endpoint should be preferred for policy workflows, and whether they can diverge at runtime, is not resolved by static source.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: tenant-side comparison of both endpoints across the same profiles OR vendor API documentation naming the preferred policy-reference source

**2026-06-18 narrowing**: the Automate contract confirms both paths are first-class documented GET operations: `get-all-zpa-profiles` uses `/zpa/cbiconfig/cbi/api/customers/:customerId/zpaprofiles`, while `get-profiles-for-customer` uses `/zpa/mgmtconfig/v1/admin/customers/:customerId/isolation/profiles` (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:10602-10608`, `:10640-10646`). This closes "is one path merely an SDK artifact?" but not "which should policy workflows prefer?" or "can the two datasets diverge at runtime?"

---

### zbi-03 — Auto-created default profile lifecycle and `isDefault` mutability

*Origin: `references/zbi/api.md` § Open questions*

The help article says default isolation profiles are automatically created for organizations with Zero Trust Browser (`vendor/zscaler-help/what-is-zero-trust-browser.md:32`). SDK/provider models expose default flags such as `defaultProfile` / `isDefault` (`vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go:25-26`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:30`), but static sources do not establish whether those flags are server-managed only, can be changed through profile CRUD, or how default profile creation is triggered.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: tenant-side profile CRUD test around default flags OR vendor documentation on default-profile lifecycle and mutability

**2026-06-18 narrowing**: the ZIA Automate contract describes `defaultProfile` on `GET /zia/api/v1/browserIsolation/profiles` as "Zscaler sets this field" (`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:11483-11488`). The ZPA CBI contract examples show `isDefault=false` / certificate `isDefault` flags in profile responses (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:10760-10766`), but do not mark ZPA-side profile `isDefault` as readonly or explain create/update behavior. Treat ZIA-side `defaultProfile` as server-set; ZPA-side lifecycle and mutability still need a tenant test or vendor doc.

---

### zbi-04 — `copyPaste` and `uploadDownload` enum completeness

*Origin: `references/zbi/api.md` § Open questions*

The Go `SecurityControls` struct declares `UploadDownload` and `CopyPaste` as strings (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:80`, `:82`), and Python docstrings show example values such as `all` and `none` (`vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:149`, `:151`, `:273`, `:275`). The complete enum set, especially any directional copy/paste or upload/download values, is not enumerated by the inspected source.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: vendor API schema/docs OR tenant-side validation tests for likely directional values

**2026-06-18 narrowing**: the Automate contract examples corroborate the same observed values: profile reads show `copyPaste=none` and `uploadDownload=none`, and update examples show `copyPaste=all` and `uploadDownload=all` (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:10760-10766`, `:10805-10812`). These are examples, not a formal enum list, so they confirm `all`/`none` but do not close the question of directional or additional values.

---

### zbi-05 — Deleting a referenced isolation profile

*Origin: `references/zbi/policy-integration.md` § Open questions*

ZPA and Terraform expose CBI profile delete operations (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:155-162`, `vendor/terraform-provider-zpa/zpa/resource_zpa_cloud_browser_isolation_external_profile.go:372-378`), and policy rules can reference `zpn_isolation_profile_id` (`vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_isolation_rule.go:81-84`, `:242-249`). Static sources do not state whether deleting a profile referenced by an isolation rule is blocked at delete time, leaves a dangling reference, or changes runtime behavior.

**Status**: open
**Resolves with**: lab test deleting or attempting to delete a referenced profile, plus vendor documentation if available

---

### zbi-06 — Profile update propagation to active isolated sessions

*Origin: `references/zbi/policy-integration.md` § Open questions*

SDKs and Terraform expose profile update operations (`vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:248-349`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:146-153`, `vendor/terraform-provider-zpa/zpa/resource_zpa_cloud_browser_isolation_external_profile.go:344-369`), but captured sources do not say whether active isolated sessions continue with old settings, adopt the new profile settings live, restart, or fail when a referenced profile changes.

**Status**: open
**Resolves with**: tenant-side test updating visible and enforcement-affecting profile settings while an isolated session is active

---

### zwa-01 — Workflow configuration programmability

*Origin: `references/zwa/api.md` § Open questions*

The captured help article documents predefined/custom workflows and says admins must map a workflow to incident transaction attributes before it triggers (`vendor/zscaler-help/understanding-workflows-workflow-automation.md:27-43`). The inspected SDK surface exposes DLP incident and customer-audit services only in Python (`vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py:27-41`) and DLP incident/customer-audit packages in Go (`vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:102-350`, `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:36-47`). The first-pass source sweep did not find SDK, MCP, Postman, Terraform, or Ansible create/update/delete/list operations for workflow templates, custom workflows, or workflow mappings. This is an audit-scoped absence, not proof that no private/future API exists.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider/MCP/Postman source exposing workflow configuration operations, or lab test against documented endpoints

---

### zwa-02 — DLP incident delete semantics

*Origin: `references/zwa/api.md` § Open questions*

The Go SDK exposes `DeleteDLPIncident(ctx, service, dlpIncidentID)` as `DELETE /dlp/v1/incidents/{id}` (`vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:255-270`), and the legacy help capture lists DELETE on `/dlp/v1/incidents/{dlpIncidentId}` (`vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:215-244`). Python's inspected `DLPIncidentsAPI` does not expose a delete method; it exposes close/resolve via `incident_close()` instead (`vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:586-645`). Static source does not explain whether DELETE hard-deletes, archives, requires elevated rights, is tenant-disabled, or differs operationally from closing an incident.

**Status**: open
**Resolves with**: lab test on a disposable incident, vendor documentation for DELETE semantics, or SDK issue/release note explaining parity

---

### zwa-03 — ZWA audit-log retention and streaming

*Origin: `references/zwa/audit-logs.md` § Open questions*

Python and Go expose a pull customer-audit API (`POST /customer/audit` / `/dlp/v1/customer/audit`) with field/time filters (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:33-135`, `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:12-47`). The inspected ZWA-specific sources do not document the retention period, supported module/action value sets, or whether ZWA audit logs can be pushed/streamed to a SIEM rather than polled. Cross-product ZIA/ZPA audit-log behavior should not be imported without a ZWA-specific source.

**Status**: open
**Resolves with**: vendor ZWA audit-log documentation, support confirmation, or tenant snapshot/operator evidence showing retention and any configured streaming destination

---

### zwa-04 — Current-vs-legacy auth boundary

*Origin: `references/zwa/api.md` § Open questions*

Python's general OneAPI client exposes `client.zwa` as `ZWAService` when not in legacy mode and uses `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` or `ZSCALER_PRIVATE_KEY`, and `ZSCALER_VANITY_DOMAIN` for OAuth-style auth (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:165-184`, `:233-244`, `:271-277`). Python also exposes `LegacyZWAClient`, which uses `key_id`, `key_secret`, and `cloud` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:636-656`; `vendor/zscaler-sdk-python/zscaler/zwa/legacy.py:47-65`). Go ZWA uses API key ID/secret and posts to `/v1/auth/api-key/token` (`vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go:45-49`, `:140-180`; `vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:212-294`), matching the legacy help capture (`vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.md:8-37`). The exact tenant/product migration boundary between current OneAPI access and legacy API-key access is not established by static source alone.

**Status**: open
**Resolves with**: current vendor migration documentation, tenant lab tests for the same operation through both Python client modes, or SDK maintainer clarification

---

### zwa-05 — Trigger context query-param SDK coverage

*Origin: `references/zwa/api.md` § Open questions*

The legacy help capture documents optional `fetchTriggerContext` on `GET /dlp/v1/incidents/{dlpIncidentId}/triggers`, used to include prefix/suffix trigger context (`vendor/zscaler-help/dlp-incidents-workflow-automation-api.md:1592-1617`). The Python `get_incident_triggers(incident_id)` and Go `GetDLPIncidentTriggers(ctx, service, dlpIncidentID)` signatures expose only the incident ID and no query-param argument (`vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:192-238`; `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:312-330`). It is unclear whether callers can pass this through another SDK path, whether the SDK omits a still-supported server parameter, or whether the help page is ahead/behind the SDK.

**Status**: open
**Resolves with**: SDK source update, direct HTTP lab test with `fetchTriggerContext=true`, or vendor documentation/issue explaining intended SDK coverage

---

### business-insights-01 — Business Insights API coverage beyond custom apps and reports

*Origin: `references/business-insights/overview.md` § Open questions*

The Python SDK exposes Business Insights `client.zbi` REST surfaces for custom applications, report configurations, and report listing/download (`vendor/zscaler-sdk-python/zscaler/zbi/zbi_service.py:23-51`, `vendor/zscaler-sdk-python/zscaler/zbi/custom_apps.py:26-34`, `vendor/zscaler-sdk-python/zscaler/zbi/report_configs.py:26-34`, `vendor/zscaler-sdk-python/zscaler/zbi/reports.py:28-36`). The Postman collection mirrors those families under `{{ZBIBaseUrl}}/api/v1/...` (`vendor/zscaler-api-specs/oneapi-postman-collection.json:134314-134343`, `:135164-135176`). The audited sources do not establish whether additional public APIs exist for SaaS connector setup, workplace-utilization dashboards, subscription metadata ingestion, or portal/RBAC administration.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing additional Business Insights modules, or tenant-side API discovery

---

### soc-workbench-01 — SOC Workbench report-export API details

*Origin: `references/soc-workbench/overview.md` § Open questions*

The captured SOC Workbench help says "Report Export via API" is a documented capability (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.md:62`), but this refresh did not find a SOC Workbench SDK, Terraform, Ansible, MCP, or Postman implementation that names the endpoint, request schema, authentication scope, or response shape. Treat the API as source-backed at the capability level only until the endpoint-level source is captured.

**Status**: open
**Resolves with**: vendor API documentation or captured help page for "Triggering Report Export Through an API"

---

### unified-01 — Experience Center standalone API surface

*Origin: `references/unified/overview.md` § Open questions*

The captured Experience Center help describes a unified administrative and operations console that consolidates management, configuration, monitoring, shared identity, policy, Copilot, and analytics (`vendor/zscaler-help/unified-what-zscaler-experience-center.md:8-18`). This refresh did not find a separate Experience Center SDK, Terraform, Ansible, MCP, or Postman surface. Static source therefore supports "no separate programmable surface found in this audit" rather than a universal claim that Experience Center can never expose its own API.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing an Experience Center service, or explicit vendor confirmation that automation must use the underlying product APIs

---

### aem-01 — AEM AnySource, report, and API endpoint details

*Origin: `references/aem/overview.md` § Open questions*

The AEM refresh established Help-level data-source and connector scope (`vendor/zscaler-help/aem-what-zscaler-security-operations.md:30-41`, `:43-63`) plus CAASM marketing positioning (`vendor/zscaler-help/asset-exposure-management-caasm-marketing.md:20-59`), but found no product-specific Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface in the audited vendor trees. The exact AnySource upload contract, report-export API, query/configuration API, and whether those are public OneAPI surfaces remain unresolved.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing AEM operations, Help capture for report/export API details, or tenant-side API capture

---

### deception-01 — Deception admin API and ZPA-managed object contract

*Origin: `references/deception/overview.md` § Open questions*

The Deception Help capture says Super admin can manage features including APIs, decoys, and audit logs (`vendor/zscaler-help/what-is-zscaler-deception.md:37-43`) and that Deception can integrate with ZPA for ZTN decoys (`vendor/zscaler-help/what-is-zscaler-deception.md:45-47`). ZPA Help and Terraform source show constraints/guards around Deception-configured ZPA access-policy rules (`vendor/zscaler-help/About_Access_Policy.txt:169-177`, `:185-190`; `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule_reorder.go:258-295`). The public source set does not identify the Deception admin API endpoints, auth model, audit-log export details, or the full lifecycle/ownership contract for ZPA objects created by Deception.

**Status**: open
**Resolves with**: Deception admin API documentation, tenant-side Deception API capture, vendor confirmation, or deeper Help capture for API/audit-log pages

---

### identity-protection-01 — Identity Protection API, integration surface, and legacy ITDR parity

*Origin: `references/identity-protection/overview.md` § Open questions*

The Identity Protection Help capture establishes SecOps/ITDR architecture, ZTE integration, ZCC-dependent detection paths, and a current-vs-legacy UI note (`vendor/zscaler-help/itdr-what-identity-protection.md:35-56`). The refresh found no product-specific Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface in the audited vendor trees. The authoritative API surface, connector configuration API, report/export behavior, and exact parity between current SecOps Identity Protection and legacy ITDR remain unresolved.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing Identity Protection operations, current Help capture for legacy/current parity, or tenant-side capture

---

### zero-trust-branch-01 — ZTB Python SDK auth-mode divergence and non-Python coverage

*Origin: `references/zero-trust-branch/overview.md` § Open questions*

The Python SDK exposes `client.ztb` through `oneapi_client.py` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:279-285`) and `ztb_service.py` says the service is used via the OneAPI authentication path while legacy helpers are for standalone/token access (`vendor/zscaler-sdk-python/zscaler/ztb/ztb_service.py:37-44`). The same repository README says ZTB authenticates by API key and is available only through `LegacyZTBClient`, with OneAPI/OAuth2 not supported (`vendor/zscaler-sdk-python/README.md:1722-1728`, `:1751-1755`). The refresh also found no Go ZTB product service and no Terraform/Ansible/MCP/Postman ZTB product surface. Confirm the supported auth path and whether non-Python surfaces are absent, private, or pending.

**Status**: open
**Resolves with**: SDK maintainer clarification, live tenant auth test against both paths, vendor API documentation, or updated SDK/provider source

---

### zscaler-cellular-01 — Zscaler Cellular admin and API surface

*Origin: `references/zscaler-cellular/overview.md` § Open questions*

The Cellular Help capture describes Zscaler SIM, Cellular Edge, IP/IMEI/IMSI policy identifiers, and Cellular Admin Portal capabilities (`vendor/zscaler-help/cellular-what-zscaler-cellular.md:8`, `:10-15`, `:26-29`, `:45-67`). The refresh found no product-specific Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface in the audited vendor trees. Public sources do not identify a Cellular Admin Portal API, SIM lifecycle endpoint set, eSIM activation API, Cellular Edge deployment API, or the exact ZIA/ZPA policy object mapping for IP/IMEI/IMSI identifiers.

**Status**: open
**Resolves with**: vendor API documentation, Help capture for Cellular admin/API pages, SDK/provider source exposing Cellular operations, or tenant-side API capture

---

## Resolved entries

See the **Status summary** near the top of this file for the list. Entries stay in their original positions above with `Status: resolved` and the answer inline, so anchor links (`clarifications.md#zia-03-wildcard-tokenization` etc.) resolve regardless of resolution state.
