---
product: meta
topic: "clarifications-index"
title: "Clarification index — open questions across references"
content-type: reference
last-verified: "2026-07-16"
verified-against:
  vendor/zscaler-api-specs: b3e1bd909a3486d240e045029961fc44c0cb483b
  vendor/zscaler-help: 35274f67cf10d96d3c6769f6553cbf590223ed92
confidence: high
sources:
  - "vendor/zscaler-help/zia-about-bandwidth-classes-20260909.json"
  - "vendor/zscaler-help/adding-bandwidth-classes.json"
  - "vendor/zscaler-help/zia-large-files-bandwidth-class-20260909.json"
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
- `tenant read` — the company's IaC or a live read-only `zscalerctl` read of the tenant would reveal it
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
   - Your doc: `See [clarification zia-05](clarifications.md#zia-05-admin-rank-order-collision).`
   - This file: `*Origin: references/<product>/<topic>.md § Open questions*` (placeholder path — substitute the real one)
5. **When resolving**: fold the answer into the relevant reference doc body
   (that's where it is useful), update that doc's `last-verified` date, then
   keep this entry in its original position with `Status: resolved` and the
   source-backed answer inline. Never recycle or renumber its stable ID.

---

## Status summary

Skim this before reading the full entries. Summary refreshed 2026-08-14:
8 entries are resolved or clarified, 13 are partially resolved, and 176 are open.
The three exact memberships below are checked against every detailed entry's
explicit `Status`; range notation is inclusive and is expanded by the checker.
Most open entries require lab tests,
tenant reads, operator experience, or vendor confirmation rather than more
public-doc reading.

Entries migrated to the knowledge graph are no longer listed here; they are gaps
with their old ID kept in `former_ids` (resolve with `node scripts/kb.mjs resolve <old-id>`):
`zia-01` → [`zia.url-categories.membership:predefined-vs-custom`](kb:zia.url-categories.membership:predefined-vs-custom); `zia-02` → [`zia.url-categories.membership:same-specificity-collision`](kb:zia.url-categories.membership:same-specificity-collision); `zia-03` → [`zia.url-categories.entry-matching:wildcard-tokenization`](kb:zia.url-categories.entry-matching:wildcard-tokenization); `zia-04` → [`zia.url-filtering.advanced-settings:nrod-lag`](kb:zia.url-filtering.advanced-settings:nrod-lag); `zia-06` → [`zia.cloud-app-control.precedence:cac-disabled-rules`](kb:zia.cloud-app-control.precedence:cac-disabled-rules); `zia-10` → [`zia.cloud-app-control.precedence:default-allow-vs-explicit`](kb:zia.cloud-app-control.precedence:default-allow-vs-explicit); `zia-11` → [`zia.ssl-inspection.pipeline:mixed-forwarding`](kb:zia.ssl-inspection.pipeline:mixed-forwarding); `zia-12` → [`zia.ssl-inspection.pipeline:bypass-and-default-rule`](kb:zia.ssl-inspection.pipeline:bypass-and-default-rule); `zia-14` → [`zia.url-categories.entry-matching:exactly-five-levels`](kb:zia.url-categories.entry-matching:exactly-five-levels); `zia-15` → [`zia.url-categories.entry-matching:console-accepts-asterisk`](kb:zia.url-categories.entry-matching:console-accepts-asterisk); `zia-07` → [`zia.cloud-app-control.risk-profiles:composition`](kb:zia.cloud-app-control.risk-profiles:composition); `zia-09` → [`zia.cloud-app-control.rule-criteria:app-identity`](kb:zia.cloud-app-control.rule-criteria:app-identity); `zia-13` → [`zia.ssl-inspection.pipeline:first-pass-on-domain`](kb:zia.ssl-inspection.pipeline:first-pass-on-domain); `zia-47` → [`zia.dns-control.actions:block-response-code-values`](kb:zia.dns-control.actions:block-response-code-values); `zia-48` → [`zia.dns-control.actions:redirect-ip-binding`](kb:zia.dns-control.actions:redirect-ip-binding); `zia-58` → [`zia.dlp.rule-wire-shape:without-content-inspection-keying`](kb:zia.dlp.rule-wire-shape:without-content-inspection-keying); `zia-59` → [`zia.dns-control.actions:redir-req-gateway`](kb:zia.dns-control.actions:redir-req-gateway); `zia-60` → [`zia.firewall.network-services:type-meanings`](kb:zia.firewall.network-services:type-meanings); `zia-63` → [`zia.sandbox.md5-blocklist:quota-cap`](kb:zia.sandbox.md5-blocklist:quota-cap); `zia-66` → [`zia.ssl-inspection.rules:cap-raisable`](kb:zia.ssl-inspection.rules:cap-raisable); `zia-71` → [`zia.dns-control.api-rules:web-eun-false`](kb:zia.dns-control.api-rules:web-eun-false); `zia-08` → [`zia.tenant-profiles.wire-mechanic:per-app-inspection-detail`](kb:zia.tenant-profiles.wire-mechanic:per-app-inspection-detail); `zia-16` → [`zia.locations.sublocations:cap-2000`](kb:zia.locations.sublocations:cap-2000); `zia-17` → [`zia.locations.sublocations:name-uniqueness-scope`](kb:zia.locations.sublocations:name-uniqueness-scope); `zia-18` → [`zia.locations.sublocations:parent-delete-behavior`](kb:zia.locations.sublocations:parent-delete-behavior); `zia-19` → [`zia.locations.sublocations:reparenting-rules`](kb:zia.locations.sublocations:reparenting-rules); `zia-20` → [`zia.locations.sublocations:depth-limit`](kb:zia.locations.sublocations:depth-limit); `zia-46` → [`zia.locations.group-assignment:tf-dynamic-removal-reason`](kb:zia.locations.group-assignment:tf-dynamic-removal-reason); `zia-56` → [`zia.bandwidth-control.limits:caps-api-enforced`](kb:zia.bandwidth-control.limits:caps-api-enforced); `zia-57` → [`zia.file-type-control.api-shape:filtering-action-dependencies`](kb:zia.file-type-control.api-shape:filtering-action-dependencies); `zia-61` → [`zia.atp.api-surface:tenant-defaults`](kb:zia.atp.api-surface:tenant-defaults); `zia-67` → [`zia.tenant-profiles.microsoft:v1-v2-semantics`](kb:zia.tenant-profiles.microsoft:v1-v2-semantics); `log-04` → [`zia.atp.block-diagnosis:ruletype-values`](kb:zia.atp.block-diagnosis:ruletype-values); `zia-26` → [`zia.rule-labels:audit-log-label-names`](kb:zia.rule-labels:audit-log-label-names); `zia-27` → [`zia.rule-labels.constraints:name-charset`](kb:zia.rule-labels.constraints:name-charset); `zia-28` → [`zia.rule-labels.constraints:name-uniqueness`](kb:zia.rule-labels.constraints:name-uniqueness); `zia-29` → [`zia.rule-labels.constraints:description-max-length`](kb:zia.rule-labels.constraints:description-max-length); `zia-30` → [`zia.rule-labels:duplicate-action`](kb:zia.rule-labels:duplicate-action); `zia-31` → [`zia.rule-labels.rule-types:label-filter-server-support`](kb:zia.rule-labels.rule-types:label-filter-server-support); `zia-32` → [`zia.rule-labels.constraints:tenant-cap`](kb:zia.rule-labels.constraints:tenant-cap); `zia-50` → [`zia.rule-labels.api-surface:rule-type-endpoint-backing`](kb:zia.rule-labels.api-surface:rule-type-endpoint-backing); `zia-69` → [`zia.workload-groups.expressions:runtime-evaluation`](kb:zia.workload-groups.expressions:runtime-evaluation); `zia-55` → [`zia.audit-logs.report-api:pagination`](kb:zia.audit-logs.report-api:pagination); `shared-38` → [`zia.traffic-forwarding.vpn-credentials:psk-live-read`](kb:zia.traffic-forwarding.vpn-credentials:psk-live-read); `zia-39` → [`zia.scim.groups-and-departments:department-no-match`](kb:zia.scim.groups-and-departments:department-no-match); `zia-40` → [`zia.scim.deactivation:session-kill`](kb:zia.scim.deactivation:session-kill); `zia-41` → [`zia.scim.operations:rate-limit`](kb:zia.scim.operations:rate-limit); `zia-42` → [`zia.ad-integration.identity-objects:org-limits`](kb:zia.ad-integration.identity-objects:org-limits); `zia-43` → [`zia.scim.attribute-mapping:per-idp-department-mapping`](kb:zia.scim.attribute-mapping:per-idp-department-mapping); `zia-44` → [`zia.scim.propagation:sync-log-visibility`](kb:zia.scim.propagation:sync-log-visibility); `zia-45` → [`zia.scim.propagation:per-idp-cadence`](kb:zia.scim.propagation:per-idp-cadence); `zia-64` → [`zia.scim.groups-and-departments:department-no-match`](kb:zia.scim.groups-and-departments:department-no-match); `zia-62` → [`zia.private-service-edge.ip-requirements:shared-nat-behavior`](kb:zia.private-service-edge.ip-requirements:shared-nat-behavior); `zia-33` → [`zia.virtual-service-edge.upgrades:cluster-update-sequencing`](kb:zia.virtual-service-edge.upgrades:cluster-update-sequencing); `zia-34` → [`zia.virtual-service-edge.clusters:removal-and-disable-behavior`](kb:zia.virtual-service-edge.clusters:removal-and-disable-behavior); `zia-35` → [`zia.virtual-service-edge.operations:log-identifier`](kb:zia.virtual-service-edge.operations:log-identifier); `zia-36` → [`zia.virtual-service-edge.clusters:cluster-vs-vm-settings`](kb:zia.virtual-service-edge.clusters:cluster-vs-vm-settings); `zia-37` → [`zia.virtual-service-edge.network-requirements:vse-nat-topology`](kb:zia.virtual-service-edge.network-requirements:vse-nat-topology); `zia-38` → [`zia.virtual-service-edge.clusters:public-cloud-cluster-object`](kb:zia.virtual-service-edge.clusters:public-cloud-cluster-object); `zia-21` → [`zia.time-intervals.timezone:dst-handling`](kb:zia.time-intervals.timezone:dst-handling); `zia-22` → [`zia.time-intervals.limits:object-cap`](kb:zia.time-intervals.limits:object-cap); `zia-23` → [`zia.time-intervals.time-windows:terraform-resource-intent`](kb:zia.time-intervals.time-windows:terraform-resource-intent); `zia-24` → [`zia.time-intervals.evaluation:midnight-spanning`](kb:zia.time-intervals.evaluation:midnight-spanning); `zia-25` → [`zia.time-intervals.time-windows:predefined-intervals`](kb:zia.time-intervals.time-windows:predefined-intervals); `zia-49` → [`zia.cloud-app-control.actions:all-vs-available-differs`](kb:zia.cloud-app-control.actions:all-vs-available-differs); `zia-51` → [`zia.api.sdk-coverage:parity-drift`](kb:zia.api.sdk-coverage:parity-drift); `zia-52` → [`zia.api.legacy-ips-signature-wire:import-wire-unconfirmed`](kb:zia.api.legacy-ips-signature-wire:import-wire-unconfirmed); `zia-53` → [`zia.cloud-app-control.actions:per-tuple-validation-contract`](kb:zia.cloud-app-control.actions:per-tuple-validation-contract); `zia-54` → [`zia.cloud-app-control.api-surface:python-risk-profile-runtime`](kb:zia.cloud-app-control.api-surface:python-risk-profile-runtime); `zia-68` → [`zia.terraform.early-access:early-access-eligibility`](kb:zia.terraform.early-access:early-access-eligibility); `zia-72` → [`zia.url-filtering.advanced-settings:creative-commons-backend-effect`](kb:zia.url-filtering.advanced-settings:creative-commons-backend-effect); `log-01` → [`zia.logs.nss-feed-format:format-field-presence`](kb:zia.logs.nss-feed-format:format-field-presence); `log-02` → [`zia.logs.nss-feed-format:vm-conversion-omits`](kb:zia.logs.nss-feed-format:vm-conversion-omits); `log-03` → [`zia.logs.nss-feed-format:multi-feed-timezone`](kb:zia.logs.nss-feed-format:multi-feed-timezone); `log-05` → [`zia.logs.web-rule-attribution:action-values-precedence`](kb:zia.logs.web-rule-attribution:action-values-precedence); `log-06` → [`zia.logs.web-field-semantics:reason-structure`](kb:zia.logs.web-field-semantics:reason-structure); `log-07` → [`zia.logs.web-field-semantics:url-category-fields`](kb:zia.logs.web-field-semantics:url-category-fields); `log-08` → [`zia.logs.web-field-semantics:riskscore-lineage`](kb:zia.logs.web-field-semantics:riskscore-lineage); `log-09` → [`zia.logs.web-field-semantics:byte-counters`](kb:zia.logs.web-field-semantics:byte-counters); `log-10` → [`zia.logs.web-field-semantics:prompt-scope`](kb:zia.logs.web-field-semantics:prompt-scope); `log-11` → [`zia.logs.firewall-records:aggregate-counters`](kb:zia.logs.firewall-records:aggregate-counters); `log-12` → [`zia.logs.firewall-records:action-precedence`](kb:zia.logs.firewall-records:action-precedence); `log-13` → [`zia.logs.firewall-records:nwapp-vs-nwsvc`](kb:zia.logs.firewall-records:nwapp-vs-nwsvc); `log-14` → [`zia.logs.dns-outcome:action-enum-open`](kb:zia.logs.dns-outcome:action-enum-open); `log-15` → [`zia.logs.dns-outcome:res-sentinels-open`](kb:zia.logs.dns-outcome:res-sentinels-open); `log-16` → [`zia.logs.dns-gateway-fields:dnsgw-flags-semantics-open`](kb:zia.logs.dns-gateway-fields:dnsgw-flags-semantics-open); `log-17` → [`zia.casb.insights-logs:record-category-discriminator`](kb:zia.casb.insights-logs:record-category-discriminator); `zpa-02` → [`zpa.app-segments.matching:granularity-ranking`](kb:zpa.app-segments.matching:granularity-ranking); `zpa-03` → [`zpa.app-segments.multimatch:config-conflict`](kb:zpa.app-segments.multimatch:config-conflict); `zpa-04` → [`zpa.app-segments.matching:same-specificity-tie`](kb:zpa.app-segments.matching:same-specificity-tie); `zpa-05` → [`zpa.app-segments.matching:port-mismatch-bypass`](kb:zpa.app-segments.matching:port-mismatch-bypass); `zpa-06` → [`zpa.policy.actions:require-approval-equals-conditional-access`](kb:zpa.policy.actions:require-approval-equals-conditional-access); `zpa-07` → [`zpa.policy.access-rule-order:deception-rule-ordering-rationale`](kb:zpa.policy.access-rule-order:deception-rule-ordering-rationale); `zpa-08` → [`zpa.policy.evaluation-order:wildcard-matches-bare-domain`](kb:zpa.policy.evaluation-order:wildcard-matches-bare-domain); `zpa-11` → [`zpa.machine-groups.api-surface:create-endpoint-absence`](kb:zpa.machine-groups.api-surface:create-endpoint-absence); `zpa-12` → [`zpa.machine-groups.definition:no-group-level-criteria`](kb:zpa.machine-groups.definition:no-group-level-criteria); `zpa-13` → [`zpa.machine-groups.policy-use:api-without-client-type`](kb:zpa.machine-groups.policy-use:api-without-client-type); `zpa-14` → [`zpa.machine-groups.definition:capacity-other-limits`](kb:zpa.machine-groups.definition:capacity-other-limits); `zpa-15` → [`zpa.machine-groups`](kb:zpa.machine-groups); `zpa-20` → [`zpa.app-connectors.health:status-pending-unverified`](kb:zpa.app-connectors.health:status-pending-unverified); `zpa-27` → [`zpa.app-connectors.selection:latency-probe-cadence`](kb:zpa.app-connectors.selection:latency-probe-cadence); `zpa-28` → [`zpa.app-connectors.enrollment:certificate-validity-window`](kb:zpa.app-connectors.enrollment:certificate-validity-window); `zpa-29` → [`zpa.app-connectors.deployment:max-connectors-per-group`](kb:zpa.app-connectors.deployment:max-connectors-per-group); `zpa-30` → [`zpa.app-connectors.provisioning-key-tooling:group-delete-removes-keys`](kb:zpa.app-connectors.provisioning-key-tooling:group-delete-removes-keys); `zpa-31` → [`zpa.app-connectors.provisioning-key-tooling:api-requires-cert-for-connector-key`](kb:zpa.app-connectors.provisioning-key-tooling:api-requires-cert-for-connector-key); `zpa-32` → [`zpa.audit-logs.streaming:field-schema`](kb:zpa.audit-logs.streaming:field-schema); `zpa-33` → [`zpa.audit-logs.streaming:siem-policy-purpose`](kb:zpa.audit-logs.streaming:siem-policy-purpose); `zpa-34` → [`zpa.audit-logs.streaming:microtenant-scoping`](kb:zpa.audit-logs.streaming:microtenant-scoping); `zpa-35` → [`zpa.audit-logs.streaming:audit-filter-api`](kb:zpa.audit-logs.streaming:audit-filter-api); `zpa-36` → [`zpa.browser-access.backend-options:field-setting-mapping`](kb:zpa.browser-access.backend-options:field-setting-mapping); `zpa-40` → [`zpa.log-receivers.log-types:auth-log-1id-label`](kb:zpa.log-receivers.log-types:auth-log-1id-label); `zpa-41` → [`zpa.log-receivers.log-types:format-only-codes`](kb:zpa.log-receivers.log-types:format-only-codes); `zpa-42` → [`zpa.machine-tunnels.requirements:enable-for-all`](kb:zpa.machine-tunnels.requirements:enable-for-all); `zpa-43` → [`zpa.machine-tunnels.requirements:session-lifecycle`](kb:zpa.machine-tunnels.requirements:session-lifecycle); `zpa-44` → [`zpa.machine-tunnels.provisioning-keys:macos-mdm-effect`](kb:zpa.machine-tunnels.provisioning-keys:macos-mdm-effect); `zpa-45` → [`zpa.machine-tunnels.provisioning-keys:separate-key-type`](kb:zpa.machine-tunnels.provisioning-keys:separate-key-type); `zpa-46` → [`zpa.policy.conditions:chrome-operand-form-api-enforcement`](kb:zpa.policy.conditions:chrome-operand-form-api-enforcement); `zpa-47` → [`zpa.private-service-edges.deployment:session-limits`](kb:zpa.private-service-edges.deployment:session-limits); `zpa-49` → [`zpa.private-service-edges.deployment:release-images`](kb:zpa.private-service-edges.deployment:release-images); `zpa-50` → [`zpa.private-service-edges.what-it-is:pse-hardware-sales`](kb:zpa.private-service-edges.what-it-is:pse-hardware-sales); `zpa-51` → [`zpa.private-service-edges.private-cloud-controller:controller-role`](kb:zpa.private-service-edges.private-cloud-controller:controller-role); `zpa-52` → [`zpa.private-service-edges.private-cloud-controller:restart-semantics`](kb:zpa.private-service-edges.private-cloud-controller:restart-semantics); `zpa-53` → [`zpa.private-service-edges.api-surface:schedule-default-cadence`](kb:zpa.private-service-edges.api-surface:schedule-default-cadence); `zpa-54` → [`zpa.private-service-edges.client-selection:location-propagation`](kb:zpa.private-service-edges.client-selection:location-propagation); `zpa-55` → [`zpa.private-service-edges.enrollment:oauth2-prerequisites`](kb:zpa.private-service-edges.enrollment:oauth2-prerequisites); `zpa-56` → [`zpa.private-service-edges.deployment:max-per-group`](kb:zpa.private-service-edges.deployment:max-per-group); `zpa-57` → [`zpa.pra:absent-from-base-zpa`](kb:zpa.pra:absent-from-base-zpa); `zpa-58` → [`zpa.public-service-edges.what-it-is:safe-mode`](kb:zpa.public-service-edges.what-it-is:safe-mode); `zpa-59` → [`zpa.public-service-edges.what-it-is:ca-reconnect-semantics`](kb:zpa.public-service-edges.what-it-is:ca-reconnect-semantics); `zpa-60` → [`zpa.public-service-edges.api-visibility:upgrade-priority`](kb:zpa.public-service-edges.api-visibility:upgrade-priority); `zpa-61` → [`zpa.saml-attributes.registration:zpa-61-limit`](kb:zpa.saml-attributes.registration:zpa-61-limit); `zpa-62` → [`zpa.saml-attributes.api-surface:zpa-62-user-attribute-delta`](kb:zpa.saml-attributes.api-surface:zpa-62-user-attribute-delta); `zpa-63` → [`zpa.scim.group-lifecycle:zpa-63-deleted-group-in-rule`](kb:zpa.scim.group-lifecycle:zpa-63-deleted-group-in-rule); `zpa-64` → [`zpa.scim.api-surface:zpa-64-internal-id`](kb:zpa.scim.api-surface:zpa-64-internal-id); `zpa-65` → [`zpa.scim.policy-criteria:zpa-65-setting-fallback`](kb:zpa.scim.policy-criteria:zpa-65-setting-fallback); `zpa-66` → [`zpa.scim.policy-criteria:zpa-66-case-sensitivity`](kb:zpa.scim.policy-criteria:zpa-66-case-sensitivity); `zpa-67` → [`zpa.scim.provisioning-timing:zpa-67-membership-resolution`](kb:zpa.scim.provisioning-timing:zpa-67-membership-resolution); `zpa-68` → [`zpa.scim.policy-criteria:zpa-68-isolation-scim`](kb:zpa.scim.policy-criteria:zpa-68-isolation-scim); `zpa-69` → [`zpa.segment-groups.api-surface:v2-update-differences`](kb:zpa.segment-groups.api-surface:v2-update-differences); `zpa-70` → [`zpa.segment-groups.api-surface:skip-detailed-app-info-effect`](kb:zpa.segment-groups.api-surface:skip-detailed-app-info-effect); `zpa-71` → [`zpa.segment-groups.api-surface:tcp-keep-alive-enabled-effect`](kb:zpa.segment-groups.api-surface:tcp-keep-alive-enabled-effect); `zpa-72` → [`zpa.segment-groups.api-surface:config-space-meaning`](kb:zpa.segment-groups.api-surface:config-space-meaning); `zpa-78` → [`zpa.trusted-networks.policy-operand:rhs-false-semantics`](kb:zpa.trusted-networks.policy-operand:rhs-false-semantics); `zpa-79` → [`zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks`](kb:zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks); `zpa-80` → [`zpa.trusted-networks.zcc-relationship:signal-path`](kb:zpa.trusted-networks.zcc-relationship:signal-path); `zpa-81` → [`zpa.trusted-networks.service-edge-groups:off-network-fallback`](kb:zpa.trusted-networks.service-edge-groups:off-network-fallback); `zpa-83` → [`zpa.app-segments.api-fields:hbr-sticky-guest-semantics`](kb:zpa.app-segments.api-fields:hbr-sticky-guest-semantics); `log-18` → [`zpa.logs.microsegmentation-flow:enforcement-triple`](kb:zpa.logs.microsegmentation-flow:enforcement-triple); `log-19` → [`zpa.logs.user-status:record-granularity`](kb:zpa.logs.user-status:record-granularity); `log-20` → [`zpa.logs.browser-access:connection-status-values`](kb:zpa.logs.browser-access:connection-status-values); `zpa-01` → [`zpa.logs.user-activity:multi-segment-lss`](kb:zpa.logs.user-activity:multi-segment-lss); `zpa-16` → [`zpa.logs.user-activity:active-cadence`](kb:zpa.logs.user-activity:active-cadence); `zpa-17` → [`zpa.logs.user-activity:byte-counter-reset`](kb:zpa.logs.user-activity:byte-counter-reset); `zpa-18` → [`zpa.logs.user-activity:timing-overlap`](kb:zpa.logs.user-activity:timing-overlap); `zpa-19` → [`zpa.logs.user-activity:server-setup-scope`](kb:zpa.logs.user-activity:server-setup-scope); `zpa-21` → [`zpa.pra.app-segments:contract-application-protocol-enum`](kb:zpa.pra.app-segments:contract-application-protocol-enum); `zpa-22` → [`zpa.api.service-edges-wire:restart-path-canonical`](kb:zpa.api.service-edges-wire:restart-path-canonical); `zpa-23` → [`zpa.api.pra-wire:credential-secrets-on-read`](kb:zpa.api.pra-wire:credential-secrets-on-read); `zpa-24` → [`zpa.api.app-segments-wire:connection-security-values`](kb:zpa.api.app-segments-wire:connection-security-values); `zpa-25` → [`zpa.api.certificates-wire:ba-certificate-put-valid`](kb:zpa.api.certificates-wire:ba-certificate-put-valid); `zpa-26` → [`zpa.api.lss-wire:browser-isolation-accepted`](kb:zpa.api.lss-wire:browser-isolation-accepted); `zpa-37` → [`zpa.api.legacy-endpoints:stepup-write-verbs`](kb:zpa.api.legacy-endpoints:stepup-write-verbs); `zpa-38` → [`zpa.api.base-paths:legacy-host-accepts-zpa-prefix`](kb:zpa.api.base-paths:legacy-host-accepts-zpa-prefix); `zpa-39` → [`zpa.api.legacy-endpoints:assistant-schedule-served`](kb:zpa.api.legacy-endpoints:assistant-schedule-served); `zpa-76` → [`zpa.log-receivers.filtering:tf-other-types-rejected`](kb:zpa.log-receivers.filtering:tf-other-types-rejected); `zpa-77` → [`zpa.terraform.resource-constraints:tag-group-in-policy-conditions`](kb:zpa.terraform.resource-constraints:tag-group-in-policy-conditions); `zpa-82` → [`zpa.pra.tooling:approval-identity-windows`](kb:zpa.pra.tooling:approval-identity-windows); `zpa-84` → [`zpa.api.pagination:mcp-manual-pages`](kb:zpa.api.pagination:mcp-manual-pages); `zcc-01` → [`zcc.api.forwarding-profile-wire:condition-type-values`](kb:zcc.api.forwarding-profile-wire:condition-type-values); `zcc-02` → [`zcc.api.forwarding-profile-wire:network-type-values`](kb:zcc.api.forwarding-profile-wire:network-type-values); `zcc-03` → [`zcc.api.forwarding-profile-wire:action-type-values`](kb:zcc.api.forwarding-profile-wire:action-type-values); `zcc-04` → [`zcc.api.forwarding-profile-wire:primary-transport-values`](kb:zcc.api.forwarding-profile-wire:primary-transport-values); `zcc-05` → [`zcc.forwarding-profiles.internet-actions:system-proxy-vs-action`](kb:zcc.forwarding-profiles.internet-actions:system-proxy-vs-action); `zcc-06` → [`zcc.trusted-networks.object:condition-type-values`](kb:zcc.trusted-networks.object:condition-type-values); `zcc-07` → [`zcc.app-profiles.selection:default-policy`](kb:zcc.app-profiles.selection:default-policy); `zcc-08` → [`zcc.api.rate-limits:body-shape-429`](kb:zcc.api.rate-limits:body-shape-429); `zcc-09` → [`zcc.api.rate-limits:download-cap-scope`](kb:zcc.api.rate-limits:download-cap-scope); `zcc-10` → [`zcc.api.rate-limits:remaining-on-success`](kb:zcc.api.rate-limits:remaining-on-success); `zcc-11` → [`zcc.api.devices-wire:udid-batch-cap`](kb:zcc.api.devices-wire:udid-batch-cap); `zcc-12` → [`zcc.api.rate-limits:oneapi-retry-headers`](kb:zcc.api.rate-limits:oneapi-retry-headers); `zcc-13` → [`zcc.api.rate-limits:bucket-scope`](kb:zcc.api.rate-limits:bucket-scope); `zcc-14` → [`zcc.install.macos-deployment:preference-domain`](kb:zcc.install.macos-deployment:preference-domain); `zcc-15` → [`zcc.install.macos-extensions:profile-timing`](kb:zcc.install.macos-extensions:profile-timing); `zcc-16` → [`zcc.install.macos-deployment:uninstall-script-path`](kb:zcc.install.macos-deployment:uninstall-script-path); `zcc-17` → [`zcc.install.macos-deployment:launchtray-zero-extension`](kb:zcc.install.macos-deployment:launchtray-zero-extension); `zcc-18` → [`zcc.install.macos-deployment:app-store-build`](kb:zcc.install.macos-deployment:app-store-build); `zcc-19` → [`zcc.install.macos-extensions:team-and-bundle-ids`](kb:zcc.install.macos-extensions:team-and-bundle-ids); `zcc-20` → [`zcc.install.macos-extensions:full-disk-access-scope`](kb:zcc.install.macos-extensions:full-disk-access-scope); `zcc-21` → [`zcc.install.macos-deployment:minimum-macos`](kb:zcc.install.macos-deployment:minimum-macos); `zcc-22` → [`zcc.install.macos-deployment:update-channel-key`](kb:zcc.install.macos-deployment:update-channel-key); `zcc-23` → [`zcc.install.macos-deployment:launchtray-zero-extension`](kb:zcc.install.macos-deployment:launchtray-zero-extension); `zcc-24` → [`zcc.notifications.templates:template-schema`](kb:zcc.notifications.templates:template-schema); `zcc-25` → [`zcc.notifications.templates:per-profile-reauth-interval`](kb:zcc.notifications.templates:per-profile-reauth-interval); `zcc-26` → [`zcc.acceptable-use:localization`](kb:zcc.acceptable-use:localization); `zcc-27` → [`zcc.notifications.templates:posture-failure-notification`](kb:zcc.notifications.templates:posture-failure-notification); `zcc-28` → [`zcc.notifications:cert-trust-ux`](kb:zcc.notifications:cert-trust-ux); `zcc-29` → [`zcc.notifications:delivery-logging`](kb:zcc.notifications:delivery-logging); `zcc-30` → [`zcc.notifications.localization:fallback-language`](kb:zcc.notifications.localization:fallback-language); `zcc-31` → [`zcc.notifications.framework:platform-support`](kb:zcc.notifications.framework:platform-support); `zcc-32` → [`zcc.notifications.framework:platform-support`](kb:zcc.notifications.framework:platform-support); `zcc-33` → [`zcc.api.company-wire:set-company-info-go`](kb:zcc.api.company-wire:set-company-info-go); `zcc-34` → [`zcc.support-options:toggle-defaults`](kb:zcc.support-options:toggle-defaults); `zcc-35` → [`zcc.api.web-policy-wire:ui-capture-password-keys`](kb:zcc.api.web-policy-wire:ui-capture-password-keys); `zcc-36` → [`zcc.support-options:bundle-contents`](kb:zcc.support-options:bundle-contents); `zcc-37` → [`zcc.support-options:bundle-contents`](kb:zcc.support-options:bundle-contents); `zcc-38` → [`zcc.support-options:submission-audit`](kb:zcc.support-options:submission-audit); `zcc-39` → [`zcc.firefox.integration:linux`](kb:zcc.firefox.integration:linux); `zcc-40` → [`zcc.firefox.proxy-and-trust:enterprise-roots`](kb:zcc.firefox.proxy-and-trust:enterprise-roots); `zcc-41` → [`zcc.firefox.integration:preference-keys`](kb:zcc.firefox.integration:preference-keys); `zcc-42` → [`zcc.firefox.integration:upgrade-persistence`](kb:zcc.firefox.integration:upgrade-persistence); `zcc-43` → [`zcc.firefox.integration:version-scope`](kb:zcc.firefox.integration:version-scope); `zcc-44` → [`zcc.acceptable-use:redisplay-on-change`](kb:zcc.acceptable-use:redisplay-on-change); `zcc-45` → [`zcc.acceptable-use:decline-and-variants`](kb:zcc.acceptable-use:decline-and-variants); `zcc-46` → [`zcc.acceptable-use:external-links`](kb:zcc.acceptable-use:external-links); `zcc-47` → [`zcc.acceptable-use:decline-and-variants`](kb:zcc.acceptable-use:decline-and-variants); `zcc-48` → [`zcc.acceptable-use:decline-and-variants`](kb:zcc.acceptable-use:decline-and-variants); `zcc-49` → [`zcc.acceptable-use:min-agent-version`](kb:zcc.acceptable-use:min-agent-version); `zcc-50` → [`zcc.acceptable-use:notification-templates-mode`](kb:zcc.acceptable-use:notification-templates-mode); `zcc-51` → [`zcc.acceptable-use:acceptance-logging`](kb:zcc.acceptable-use:acceptance-logging); `zcc-52` → [`zcc.acceptable-use:localization`](kb:zcc.acceptable-use:localization); `zcc-53` → [`zcc.acceptable-use:message-size`](kb:zcc.acceptable-use:message-size); `zcc-54` → [`zcc.acceptable-use:non-interactive-sessions`](kb:zcc.acceptable-use:non-interactive-sessions); `zcc-55` → [`zcc.acceptable-use:config-propagation`](kb:zcc.acceptable-use:config-propagation); `zcc-56` → [`zcc.logging.log-modes:default-mode`](kb:zcc.logging.log-modes:default-mode); `zcc-57` → [`zcc.logging.log-modes:level-vs-mode`](kb:zcc.logging.log-modes:level-vs-mode); `zcc-58` → [`zcc.app-profiles.logging:log-file-size`](kb:zcc.app-profiles.logging:log-file-size); `zcc-59` → [`zcc.web-privacy.collection:unmapped-keys`](kb:zcc.web-privacy.collection:unmapped-keys); `zcc-60` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-61` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-62` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-63` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-64` → [`zcc.logging.user-access:ios-log-access`](kb:zcc.logging.user-access:ios-log-access); `zcc-65` → [`zcc.support-options:bundle-contents`](kb:zcc.support-options:bundle-contents); `zcc-66` → [`zcc.logs.client-log:file-format`](kb:zcc.logs.client-log:file-format); `zcc-67` → [`zcc.logs.client-log:transaction-records`](kb:zcc.logs.client-log:transaction-records); `zcc-68` → [`zcc.logging.collection:log-locations`](kb:zcc.logging.collection:log-locations); `zcc-69` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-70` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-71` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-72` → [`zcc.logging.collection:fetch-logs-permission`](kb:zcc.logging.collection:fetch-logs-permission); `zcc-73` → [`zcc.api.conventions:status-500-label`](kb:zcc.api.conventions:status-500-label); `zcc-74` → [`zcc.troubleshooting:generic-legacy-codes`](kb:zcc.troubleshooting:generic-legacy-codes); `zcc-75` → [`zcc.install.macos-extensions:unapproved-extension`](kb:zcc.install.macos-extensions:unapproved-extension); `zcc-76` → [`zcc.passwords-and-otp.otp:otp-expiry`](kb:zcc.passwords-and-otp.otp:otp-expiry); `zcc-77` → [`zcc.api.web-policy-wire:top-vs-nested-precedence`](kb:zcc.api.web-policy-wire:top-vs-nested-precedence); `zcc-78` → [`zcc.api.web-policy-wire:devicetype-precedence`](kb:zcc.api.web-policy-wire:devicetype-precedence); `zcc-79` → [`zcc.api.web-policy-wire:selected-required`](kb:zcc.api.web-policy-wire:selected-required); `zcc-80` → [`zcc.api.trusted-networks-wire:v1-v2-coexistence`](kb:zcc.api.trusted-networks-wire:v1-v2-coexistence); `zcc-81` → [`zcc.devices.record-fields:zd-vs-zdp`](kb:zcc.devices.record-fields:zd-vs-zdp); `zcc-82` → [`zcc.devices.record-fields:registration-state-vs-state`](kb:zcc.devices.record-fields:registration-state-vs-state); `zcc-83` → [`zcc.devices.record-fields:state-wire-type`](kb:zcc.devices.record-fields:state-wire-type); `zcc-84` → [`zcc.forwarding-profiles:unified-tunnel-semantics`](kb:zcc.forwarding-profiles:unified-tunnel-semantics); `zcc-85` → [`zcc.forwarding-profiles.fail-open:precedence-detail`](kb:zcc.forwarding-profiles.fail-open:precedence-detail); `zcc-86` → [`zcc.sdk-python.return-shapes:web-privacy-get-none`](kb:zcc.sdk-python.return-shapes:web-privacy-get-none); `zcc-87` → [`zcc.sdk-python.client-configuration:oneapi-429-headers`](kb:zcc.sdk-python.client-configuration:oneapi-429-headers); `zcc-88` → [`zcc.api.web-policy-wire:mac-block-read-key`](kb:zcc.api.web-policy-wire:mac-block-read-key); `zcc-89` → [`zcc.api.web-policy-wire:scope-keys-on-read`](kb:zcc.api.web-policy-wire:scope-keys-on-read); `zcc-90` → [`zcc.api.web-policy-wire:devicetype-string-on-read`](kb:zcc.api.web-policy-wire:devicetype-string-on-read); `zcc-91` → [`zcc.support-options:toggle-defaults`](kb:zcc.support-options:toggle-defaults); `zcc-92` → [`zcc.passwords-and-otp.password-api:surface-authority`](kb:zcc.passwords-and-otp.password-api:surface-authority); `zcc-93` → [`zcc.passwords-and-otp.app-profile-passwords:macos-password-key-asymmetry`](kb:zcc.passwords-and-otp.app-profile-passwords:macos-password-key-asymmetry); `zcc-94` → [`zcc.passwords-and-otp.app-profile-passwords:ui-gate-per-os`](kb:zcc.passwords-and-otp.app-profile-passwords:ui-gate-per-os); `zcc-95` → [`zcc.trusted-networks.detection:transition-handling`](kb:zcc.trusted-networks.detection:transition-handling); `zcc-96` → [`zcc.trusted-networks.detection:multiple-networks`](kb:zcc.trusted-networks.detection:multiple-networks); `zcc-97` → [`zcc.forwarding-profiles.assignment:orphan-reference`](kb:zcc.forwarding-profiles.assignment:orphan-reference); `zcc-98` → [`zcc.api.web-policy-wire:join-on-read`](kb:zcc.api.web-policy-wire:join-on-read); `zcc-99` → [`zcc.app-profiles.advanced-settings:drop-quic`](kb:zcc.app-profiles.advanced-settings:drop-quic); `zcc-100` → [`zcc.forwarding-profiles.internet-actions:ipv6-flags`](kb:zcc.forwarding-profiles.internet-actions:ipv6-flags); `zcc-101` → [`zcc.z-tunnel.transport:session-internals`](kb:zcc.z-tunnel.transport:session-internals); `log-21` → [`zcc.logging.log-modes:level-vs-mode`](kb:zcc.logging.log-modes:level-vs-mode).

The 2026-06-18 Automate-contract / rosetta closure pass narrowed several
previously open source-surface questions without settling their runtime
semantics: `zia-49`, `zia-53`, `zia-57`, `cloud-connector-09`, `zcc-80`,
`zbi-02`, `zbi-03`, and `zbi-04`.

The 2026-06-21 Docusaurus-blob snapshot pass promoted the reconstructed
Automate contracts and narrowed two more items without closing their live
behavior: `zdx-35` (the contract confirms the `obfuscation` request field while
the Python wrapper still appears not to send it) and `ai-security-04` (the
contract exposes an AI Guard admin-plane API while client wrappers remain
absent). It also opened static-evidence caveats for adjacent action-path
encoding (`ai-security-05`, `zid-36`), ZCloudConnector default-response success
schema handling (`cloud-connector-25`), and ZDX snapshot base-path encoding
(`zdx-44`).

The 2026-07-20 Automate refresh closed `ai-security-05`: the published AI Guard
contract now uses slash-delimited action subpaths and passes structural path
validation. It also narrowed `zid-36`: the malformed adjacent templates are now
slash-delimited and structurally valid, but they still differ from Postman's
colon-suffix action routes. The same pass opened `ai-security-07` because Help's
User-mode and application provider labels do not map one-to-one to the
admin-plane provider type enum in the captured static sources.

The 2026-07-08 upstream-issue sweep opened `cloud-connector-26` for Cloud
Connector traffic-forwarding rule labels: static sources show a contract field
and a Terraform provider gap, while live write acceptance remains unverified.

The 2026-07-16 MCP v0.13.1 review opened `zero-trust-branch-02`; the 2026-07-22
v0.13.4 refresh found no intervening tool or catalog change. The generated
catalog labels `ztw` as Workload Segmentation while the module and docsrc call it
Zscaler Cloud & Branch Connector; neither surface is the separate ZTB API. It
also opened `zscaler-cellular-02`–`zscaler-cellular-04` for the new ZCell MCP
violation-response shape, SIM-pagination routing, and audit-request contract.

The 2026-08-04 Help and client-source refresh resolved `cloud-connector-07`,
narrowed `cloud-connector-18`, `cloud-connector-22`, `zia-68`, and `zpa-49`,
and opened `cloud-connector-27`, `cloud-connector-28`, `zia-71`, and `zpa-82`.
The remaining questions are bounded to the specific source conflicts and live
API semantics recorded below.

The 2026-08-12 Go SDK v3.8.46 refresh narrowed `zia-49` and `zia-53` again:
Go now exposes both `availableActions` and `allAvailableActions`, with the same
request and flat response shape. Static source does not define their semantic
relationship, single-app completeness, multi-app aggregation, or whether the
new path removes the MCP representative-app concern. Those behaviors and the
atomic mixed-validity create contract still require tenant evidence.

The 2026-08-12 Help refresh expanded resolved `cloud-connector-07` with the
AWS managed-service boundary and opened `cloud-connector-29` for exact Azure
Zero Trust Gateway deployment availability. Generic VNet/ExpressRoute product
positioning remains insufficient to close that cloud-specific question.

The 2026-08-12 upstream-issue sweep opened `zpa-84` for the MCP shared
policy-rule pagination gap and `shared-40` for OneAPI entitlement aliases that
the current MCP mapping omits. It also recorded the AWS App Connector module
v2.0.1 ASG launch-template rotation caveat directly in the operational
reference; that behavior is source-established rather than a new fact question.
The same provider/cloud review opened `zia-72`: provider v4.8.5's serialized
Creative Commons `false` is established, but its effect on a previously enabled
tenant setting remains untested.

The 2026-08-14 MCP v0.15.2 refresh resolves `zpa-84`: all 16 affected list
tools now expose working caller-selected `page` / `page_size` controls, while
remaining explicitly one-request-per-call rather than auto-walking pages. It
partially resolves `shared-40`: the three observed aliases now map correctly
and carry regression coverage, while a canonical, complete cross-tenant alias
taxonomy remains unpublished.

The 2026-08-14 ZCC provider refresh narrows `zcc-06` and `zcc-80` without
closing either one. The provider now maps `ALL` / `ANY` to its v1 numeric
representation and adapts trusted-network operations between v2 and v1, but
those client-side choices do not establish the live backend enum or the
authority, shared-state, and migration relationship between the endpoint
families.

### Resolved

| ID | Title |
|---|---|
| [`zia-05`](#zia-05-admin-rank-order-collision) | Admin rank structurally enforces precedence regardless of order-value collisions |
| [`shared-01`](#shared-01-spl-index-naming-portability) | SPL index names come from env vars (`SPLUNK_INDEX_*`) |
| [`shared-02`](#shared-02-log-query-latency-budget) | Skill never auto-queries — always emits SPL for operator to run |
| [`shared-03`](#shared-03-script-language-choice-for-tenant-data-tooling) | Scripts implemented as Python via `uv run` |
| [`shared-04`](#shared-04-snapshot-auth-pattern) | Credentials via env vars; no `.env` convention |
| [`shared-05`](#shared-05-snapshot-format) | Raw JSON per resource; no paraphrasing |
| [`zpa-48`](#zpa-48-pse-provisioning-key-apiterraform-support) | PSE provisioning keys are supported through the generic Terraform resource |
| [`cloud-connector-07`](#cloud-connector-07-ztg-vs-cloud-connector-group-type-semantics) | AWS and GCP ZTG are Zscaler-managed services; standard Cloud Connector is the customer-deployed VM path |

### Partially resolved

| ID | Title | What's still open |
|---|---|---|
| [`shared-17`](#shared-17-public-service-edge-selection-algorithm) | Public Service Edge selection algorithm | Selection-signal weighting, failover timing, and DC-exclusion mechanics remain open |
| [`shared-18`](#shared-18-end-to-end-authentication-timeline-across-the-request-chain) | End-to-end authentication timeline across the request chain | Auth-source precedence, surrogate-IP clock anchoring, and trusted-network transitions remain open |
| [`shared-19`](#shared-19-modern-http-response-side-re-evaluation-http2-websocket-http3-streaming-rpc) | Modern HTTP response-side re-evaluation | Per-stream and non-DLP inspection semantics for modern protocols remain open |
| [`shared-40`](#shared-40-oneapi-entitlement-prd-aliases-for-ztw-zid-and-zins) | OneAPI entitlement aliases for `ztw`, `zid`, and `zins` | The three observed aliases are mapped and tested; a complete cross-tenant alias taxonomy remains unpublished |
| [`cloud-connector-09`](#cloud-connector-09-forwarding-method-semantics-and-the-true-backend-forwardmethod-enum) | `ENATDEDIP`/`GEOIP`/`PROXYCHAIN` semantics + true `forwardMethod` enum | Automate contract now gives an independent contract enum and records Terraform disagreement; runtime semantics and backend acceptance remain open |
| [`cloud-connector-18`](#cloud-connector-18-ztw-api-surface-gaps-endpoint-paths-azuregcp-discovery-automation-go-zidentity-auth) | ZTW API paths, cloud discovery, and Go auth | Admin/role, activation, Azure discovery, and Go OAuth paths are resolved; only a public GCP discovery REST family remains open |
| [`cloud-connector-22`](#cloud-connector-22-cc-region-coverage-govcloud-china-gcp-deployment-and-wds-vs-ztg-region-set-parity) | CC region coverage and deployment boundaries | GCP ZTG regions and standard deployment architecture are documented; standard-CC regions, WDS/ZTG parity, sovereign clouds, VM-size regionality, and Azure Flex gaps remain open |
| [`zdx-35`](#zdx-35-share_snapshot-obfuscation-transmission) | `share_snapshot` obfuscation transmission | Automate contract now confirms `obfuscation` is a request-body field; Python wrapper transmission remains open |
| [`ai-security-04`](#ai-security-04-ai-guard-admin-plane-programmability) | AI Guard admin-plane programmability | Current Automate publishes 47 operations; Python has 39 callable methods, with remaining wrapper gaps and live acceptance unresolved |
| [`zbi-02`](#zbi-02-cbizpaprofile-vs-isolationprofile-preferred-endpoint) | `cbizpaprofile` vs `isolationprofile` preferred endpoint | Automate contract confirms both paths are first-class documented GET operations; preference and runtime divergence remain open |
| [`zbi-03`](#zbi-03-auto-created-default-profile-lifecycle-and-isdefault-mutability) | Auto-created default profile lifecycle and `isDefault` mutability | ZIA-side `defaultProfile` is documented as Zscaler-set; ZPA-side `isDefault` mutability and lifecycle remain open |
| [`zbi-04`](#zbi-04-copypaste-and-uploaddownload-enum-completeness) | `copyPaste` and `uploadDownload` enum completeness | Automate examples corroborate `all`/`none`; no formal enum or directional values are documented |
| [`zscaler-cellular-01`](#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface) | Zscaler Cellular admin and API surface | Automate contract, Python SDK, and MCP read layer establish public surfaces; live entitlement/backend acceptance and ZIA/ZPA policy-object mapping remain open |

### Open

- **zia**: `zia-65`, `zia-70`
- **log**: `log-22`
- **zpa**: `zpa-09`–`zpa-10`, `zpa-73`–`zpa-75`
- **shared**: `shared-06`–`shared-16`, `shared-20`–`shared-37`, `shared-39`
- **zdx**: `zdx-01`–`zdx-34`, `zdx-36`–`zdx-44`
- **zms**: `zms-01`
- **easm**: `easm-01`, `easm-02`
- **cloud-connector**: `cloud-connector-01`–`cloud-connector-06`, `cloud-connector-08`, `cloud-connector-10`–`cloud-connector-17`, `cloud-connector-19`–`cloud-connector-21`, `cloud-connector-23`–`cloud-connector-29`
- **zid**: `zid-01`–`zid-36`
- **ai-security**: `ai-security-01`–`ai-security-03`, `ai-security-06`–`ai-security-09`
- **risk360**: `risk360-01`, `risk360-02`
- **breach-predictor**: `breach-predictor-01`
- **uvm**: `uvm-01`
- **dspm**: `dspm-01`
- **zbi**: `zbi-01`, `zbi-05`, `zbi-06`
- **zwa**: `zwa-01`–`zwa-05`
- **business-insights**: `business-insights-01`
- **soc-workbench**: `soc-workbench-01`
- **unified**: `unified-01`
- **aem**: `aem-01`
- **deception**: `deception-01`
- **identity-protection**: `identity-protection-01`
- **zero-trust-branch**: `zero-trust-branch-01`, `zero-trust-branch-02`
- **zscaler-cellular**: `zscaler-cellular-02`–`zscaler-cellular-04`

### Refresh history

The vendor-MCP scrape (2026-06-14) added these open behavior questions — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zia-47`](kb:zia.dns-control.actions:block-response-code-values) | DNS Control `block_response_code` accepted-value set | lab test / tenant read |
| [`zia-48`](kb:zia.dns-control.actions:redirect-ip-binding) | DNS Control `redirect_ip` action-binding (all `REDIR_*` vs `REDIR_RES` only) | lab test |
| [`zia-49`](kb:zia.cloud-app-control.actions:all-vs-available-differs) | CAC per-app action validity (which actions a given app accepts) | code read completed; live completeness test remains |
| [`zpa-20`](kb:zpa.app-connectors.health:status-pending-unverified) | Whether `ZPN_STATUS_PENDING` is a real App Connector runtime status | tenant read / lab test |
| [`zcc-76`](kb:zcc.passwords-and-otp.otp:otp-expiry) | Whether ZCC one-time passwords expire server-side (TTL) | lab test / zscaler doc not yet read |
| [`zdx-01`](#zdx-01-probe-id-non-portability-server-behavior) | ZDX probe-ID non-portability — server behavior on a cross-pair probe ID | lab test |
| [`zdx-02`](#zdx-02-concurrent-deeptrace-session-limits) | ZDX concurrent deeptrace session limits per tenant / per device | lab test / zscaler doc not yet read |
| [`zms-01`](#zms-01-fetchall-beyond-policyrules) | Whether ZMS `fetchAll` exists server-side beyond `policyRules` | SDK re-check / lab test |
| [`easm-01`](#easm-01-finding-scan_type-allowed-values) | EASM finding `scan_type` allowed-value set | tenant read / zscaler doc not yet read |
| [`easm-02`](#easm-02-finding-risk-field-value-semantics) | EASM finding risk-field semantics (`risk_level` / `cisa_likelihood` / `epss_likelihood`) | tenant read / zscaler doc not yet read |

The 2026-06-16 ZWA refresh registered these open Workflow Automation behavior/source questions — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zwa-01`](#zwa-01-workflow-configuration-programmability) | Workflow configuration programmability | vendor API documentation / SDK-provider source / lab test |
| [`zwa-02`](#zwa-02-dlp-incident-delete-semantics) | DLP incident delete semantics | lab test / vendor documentation |
| [`zwa-03`](#zwa-03-zwa-audit-log-retention-and-streaming) | ZWA audit-log retention and streaming | vendor documentation / support ticket / tenant read |
| [`zwa-04`](#zwa-04-current-vs-legacy-auth-boundary) | Current-vs-legacy auth boundary | vendor documentation / lab test |
| [`zwa-05`](#zwa-05-trigger-context-query-param-sdk-coverage) | Trigger context query-param SDK coverage | SDK source update / lab test |

The 2026-06-15 ZIA refresh registered these open ZIA behavior/source questions surfaced by the per-doc Open-questions sweep — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zia-50`](kb:zia.rule-labels.api-surface:rule-type-endpoint-backing) | `ruleType` filter endpoint REST backing | zscaler doc not yet read / lab test |
| [`zia-51`](kb:zia.api.sdk-coverage:parity-drift) | Cross-SDK parity drift and Python `devicegroups` write-path | code read / lab test |
| [`zia-52`](kb:zia.api.legacy-ips-signature-wire:import-wire-unconfirmed) | `ipsSignatureRules` import wire behavior and multipart field name | lab test |
| [`zia-53`](kb:zia.cloud-app-control.actions:per-tuple-validation-contract) | CAC atomic-validation contract and representative-app action quirk | lab test |
| [`zia-54`](kb:zia.cloud-app-control.api-surface:python-risk-profile-runtime) | Python `cloudAppRiskProfile` list-vs-single code shape | code read / lab test |
| [`zia-55`](kb:zia.audit-logs.report-api:pagination) | Admin audit report pagination and `targetOrgId` MSP semantics | lab test / tenant read |
| [`zia-56`](kb:zia.bandwidth-control.limits:caps-api-enforced) | Bandwidth class `type` enum vs UI predefined classes, and cap enforcement | zscaler doc not yet read / lab test |
| [`zia-57`](kb:zia.file-type-control.api-shape:filtering-action-dependencies) | FTP and File Type Control field-dependency and enum surfaces | lab test / zscaler doc not yet read |
| [`zia-58`](kb:zia.dlp.rule-wire-shape:without-content-inspection-keying) | DLP web rule action/severity enums, parent/sub-rule composition, EXTERNALDLP behavior | lab test / zscaler doc not yet read |
| [`zia-59`](kb:zia.dns-control.actions:redir-req-gateway) | Plain `REDIR_REQ` `dns_gateway` requirement and `edns_ecs_object`/ZPA pairing | lab test |
| [`zia-60`](kb:zia.firewall.network-services:type-meanings) | Network Service `type` behavior, country/category enums, and caps | lab test / zscaler doc not yet read |
| [`zia-61`](kb:zia.atp.api-surface:tenant-defaults) | ATP/Malware tenant defaults, singleton interdependence, capture-vs-denylist | lab test / zscaler doc not yet read |
| [`zia-62`](kb:zia.private-service-edge.ip-requirements:shared-nat-behavior) | PSE shared-NAT rejection, ZIA-only health monitoring, hardware-PSE API | zscaler doc not yet read / support ticket / code read |
| [`zia-63`](kb:zia.sandbox.md5-blocklist:quota-cap) | Sandbox MD5 blocklist quota, help-portal enum, and the MP/ATP diagnosis API gap | lab test / zscaler doc not yet read |
| [`zia-64`](kb:zia.scim.groups-and-departments:department-no-match) | SCIM department matching, attribute length, `active=false` session-kill, and caps | lab test / zscaler doc not yet read |
| [`zia-65`](#zia-65-ucaas-one-click-toggle-field-location) | UCaaS One-Click toggle field location | tenant read / zscaler doc not yet read |
| [`zia-66`](kb:zia.ssl-inspection.rules:cap-raisable) | Whether the 255 SSL Inspection rule cap is raisable | zscaler doc not yet read / support ticket |
| [`zia-67`](kb:zia.tenant-profiles.microsoft:v1-v2-semantics) | Tenant Profile per-app wire mechanic and v1/v2 protocol semantics | zscaler doc not yet read / lab test |
| [`zia-68`](kb:zia.terraform.early-access:early-access-eligibility) | Terraform `url_categories_predefined` EA gating, sandbox v1/v2 endpoint, static-IP throttle | primary API rate-limit table / lab test |
| [`zia-69`](kb:zia.workload-groups.expressions:runtime-evaluation) | Workload-group runtime expression evaluation, `expressionJson` sync, and tag-type enum | lab test / zscaler doc not yet read |
| [`zia-70`](#zia-70-dlp_web_rules-live-read-returns-undocumented-uctemplateid) | `dlp_web_rules` live read returns undocumented `ucTemplateId` | lab test / zscaler confirmation |
| [`zia-71`](kb:zia.dns-control.api-rules:web-eun-false) | Web-EUN explicit `false`: preserve vs clear on firewall-DNS update | lab test |

The ZPA reference re-verification pass (2026-06-15) registered the remaining `## Open questions` items from the ZPA docs — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zpa-21`](kb:zpa.pra.app-segments:contract-application-protocol-enum) | `PRAApplication.applicationProtocol` full enum citation scope in Postman | code read |
| [`zpa-22`](kb:zpa.api.service-edges-wire:restart-path-canonical) | PrivateCloudController canonical restart path (Go vs Python SDK divergence) | lab test |
| [`zpa-23`](kb:zpa.api.pra-wire:credential-secrets-on-read) | Whether `password` / `private_key` are returned on a Credential GET | tenant read / lab test |
| [`zpa-24`](kb:zpa.api.app-segments-wire:connection-security-values) | `NLA` as a valid PRA sub-app `connectionSecurity` value | lab test |
| [`zpa-25`](kb:zpa.api.certificates-wire:ba-certificate-put-valid) | BaCertificate `update_certificate` (PUT) validity as an API operation | lab test |
| [`zpa-26`](kb:zpa.api.lss-wire:browser-isolation-accepted) | `zpn_client_type_browser_isolation` validity in LSS policy conditions | lab test |
| [`zpa-27`](kb:zpa.app-connectors.selection:latency-probe-cadence) | App Connector-to-app latency probe cadence | zscaler doc not yet read / operator experience |
| [`zpa-28`](kb:zpa.app-connectors.enrollment:certificate-validity-window) | App Connector certificate validity window before re-enrollment | zscaler doc not yet read / operator experience |
| [`zpa-29`](kb:zpa.app-connectors.deployment:max-connectors-per-group) | Maximum App Connectors per group | zscaler doc not yet read / support ticket |
| [`zpa-30`](kb:zpa.app-connectors.provisioning-key-tooling:group-delete-removes-keys) | Provisioning-key auto-delete on group delete (API behavior) | lab test |
| [`zpa-31`](kb:zpa.app-connectors.provisioning-key-tooling:api-requires-cert-for-connector-key) | Whether the API requires an enrollment cert for connector-type keys | lab test |
| [`zpa-32`](kb:zpa.audit-logs.streaming:field-schema) | `zpn_audit_log` LSS field schema | zscaler doc not yet read |
| [`zpa-33`](kb:zpa.audit-logs.streaming:siem-policy-purpose) | `SIEM_POLICY` purpose relative to audit-log streaming | zscaler doc not yet read / lab test |
| [`zpa-34`](kb:zpa.audit-logs.streaming:microtenant-scoping) | Microtenant audit-log scoping (isolated vs parent-visible) | tenant read / lab test |
| [`zpa-35`](kb:zpa.audit-logs.streaming:audit-filter-api) | `LSSConfig.filter` valid expressions for `zpn_audit_log` | zscaler doc not yet read |
| [`zpa-36`](kb:zpa.browser-access.backend-options:field-setting-mapping) | Runtime semantics of `trust_untrusted_cert` / `allow_options` | zscaler doc not yet read / lab test |
| [`zpa-37`](kb:zpa.api.legacy-endpoints:stepup-write-verbs) | `GET /stepupauthlevel` response shape and write-verb support | lab test |
| [`zpa-38`](kb:zpa.api.base-paths:legacy-host-accepts-zpa-prefix) | OAuth2 user-code legacy host `/zpa` path prefix | lab test |
| [`zpa-39`](kb:zpa.api.legacy-endpoints:assistant-schedule-served) | `/assistantSchedule` legacy endpoint — still served vs retired alias | lab test |
| [`zpa-40`](kb:zpa.log-receivers.log-types:auth-log-1id-label) | `zpn_auth_log_1id` human-facing label | zscaler doc not yet read |
| [`zpa-41`](kb:zpa.log-receivers.log-types:format-only-codes) | Format-only log-type codes' acceptance on a receiver's `sourceLogType` | lab test |
| [`zpa-42`](kb:zpa.machine-tunnels.requirements:enable-for-all) | Console path for the global "Enable ZPA Machine Tunnel for All" toggle | tenant read / operator experience |
| [`zpa-43`](kb:zpa.machine-tunnels.requirements:session-lifecycle) | Machine tunnel behavior during user session transitions | lab test / operator experience |
| [`zpa-44`](kb:zpa.machine-tunnels.provisioning-keys:macos-mdm-effect) | macOS MDM (Jamf/Intune) effect on machine-tunnel provisioning | zscaler doc not yet read / lab test |
| [`zpa-45`](kb:zpa.machine-tunnels.provisioning-keys:separate-key-type) | Machine-tunnel provisioning key mechanism | zscaler doc not yet read / tenant read |
| [`zpa-46`](kb:zpa.policy.conditions:chrome-operand-form-api-enforcement) | API enforcement of the CHROME_POSTURE_PROFILE vs CHROME_ENTERPRISE operand-form split | lab test |
| [`zpa-47`](kb:zpa.private-service-edges.deployment:session-limits) | PSE VM sizing and per-instance session limits | zscaler doc not yet read |
| [`zpa-49`](kb:zpa.private-service-edges.deployment:release-images) | Supported hypervisor / cloud-image formats for ZPA PSEs | zscaler doc not yet read / Marketplace capture |
| [`zpa-50`](kb:zpa.private-service-edges.what-it-is:pse-hardware-sales) | ZPA PSE dedicated hardware appliance availability | zscaler doc not yet read / support ticket |
| [`zpa-51`](kb:zpa.private-service-edges.private-cloud-controller:controller-role) | Private Cloud Controller product positioning | zscaler doc not yet read |
| [`zpa-52`](kb:zpa.private-service-edges.private-cloud-controller:restart-semantics) | `restart_private_controller` operational semantics (graceful vs hard) | lab test |
| [`zpa-53`](kb:zpa.private-service-edges.api-surface:schedule-default-cadence) | Service Edge Auto-Delete schedule accepted `frequency` values + defaults | zscaler doc not yet read / lab test |
| [`zpa-54`](kb:zpa.private-service-edges.client-selection:location-propagation) | PSE location / GeoIP update propagation delay | zscaler doc not yet read / operator experience |
| [`zpa-55`](kb:zpa.private-service-edges.enrollment:oauth2-prerequisites) | PSE OAuth2 enrollment licensing prerequisites | zscaler doc not yet read / tenant confirmation |
| [`zpa-56`](kb:zpa.private-service-edges.deployment:max-per-group) | Maximum PSEs per group | zscaler doc not yet read / support ticket |
| [`zpa-57`](kb:zpa.pra:absent-from-base-zpa) | Whether session recording / approval / credential pooling are absent from base ZPA | zscaler doc not yet read |
| [`zpa-58`](kb:zpa.public-service-edges.what-it-is:safe-mode) | ZPA Public-tier-specific behavior (scale / Safe-mode) | zscaler doc not yet read |
| [`zpa-59`](kb:zpa.public-service-edges.what-it-is:ca-reconnect-semantics) | ZPA Public-tier policy-caching / CA-reconnect semantics | zscaler doc not yet read |
| [`zpa-60`](kb:zpa.public-service-edges.api-visibility:upgrade-priority) | `upgrade_priority` allowed values and effect for ZPA service-edge tier | zscaler doc not yet read / lab test |
| [`zpa-61`](kb:zpa.saml-attributes.registration:zpa-61-limit) | Authoritative ZPA SAML attribute limit (is it exactly 100?) | zscaler doc not yet read / lab test |
| [`zpa-62`](kb:zpa.saml-attributes.api-surface:zpa-62-user-attribute-delta) | `userAttribute` and `delta` SAML-attribute field semantics | zscaler doc not yet read / lab test |
| [`zpa-63`](kb:zpa.scim.group-lifecycle:zpa-63-deleted-group-in-rule) | Behavior when a `SCIM_GROUP` operand references a deleted group | lab test |
| [`zpa-64`](kb:zpa.scim.api-surface:zpa-64-internal-id) | SCIM group `internal_id` field semantics | zscaler doc not yet read / tenant read |
| [`zpa-65`](kb:zpa.scim.policy-criteria:zpa-65-setting-fallback) | `enable_scim_based_policy` false fallback behavior | lab test |
| [`zpa-66`](kb:zpa.scim.policy-criteria:zpa-66-case-sensitivity) | SCIM attribute value matching case sensitivity | lab test |
| [`zpa-67`](kb:zpa.scim.provisioning-timing:zpa-67-membership-resolution) | SCIM group membership resolution timing (session vs per-evaluation) | lab test |
| [`zpa-68`](kb:zpa.scim.policy-criteria:zpa-68-isolation-scim) | Isolation policy v2 `SCIM_GROUP` support | code read / lab test |
| [`zpa-69`](kb:zpa.segment-groups.api-surface:v2-update-differences) | Segment Group `update_group_v2` vs v1 behavioral difference | zscaler doc not yet read / lab test |
| [`zpa-70`](kb:zpa.segment-groups.api-surface:skip-detailed-app-info-effect) | Segment Group `skip_detailed_app_info` effect on writes | lab test |
| [`zpa-71`](kb:zpa.segment-groups.api-surface:tcp-keep-alive-enabled-effect) | Segment Group `tcpKeepAliveEnabled` admin/runtime effect | zscaler doc not yet read |
| [`zpa-72`](kb:zpa.segment-groups.api-surface:config-space-meaning) | Segment Group `config_space` accepted values | lab test / zscaler doc not yet read |
| [`zpa-73`](#zpa-73-objecttype-zpn_internal_internet_protocol-and-user-wire-validity) | `objectType` `ZPN_INTERNAL_INTERNET_PROTOCOL` / `USER` wire validity | lab test |
| [`zpa-74`](#zpa-74-tcpkeepalive-literal-wire-token-quoted-string-vs-bare-integer) | `tcpKeepAlive` literal wire token (quoted string vs bare integer) | tenant read |
| [`zpa-75`](#zpa-75-configspace-at-the-segment-top-level) | `configSpace` valid at the segment top level | tenant read |
| [`zpa-76`](kb:zpa.log-receivers.filtering:tf-other-types-rejected) | Which LSS `source_log_type` values require a `policy_rule_resource` block | zscaler doc not yet read / lab test |
| [`zpa-77`](kb:zpa.terraform.resource-constraints:tag-group-in-policy-conditions) | Tag / tag-group membership referenced in policy rule conditions (Early Access) | zscaler doc not yet read / lab test |
| [`zpa-78`](kb:zpa.trusted-networks.policy-operand:rhs-false-semantics) | `TRUSTED_NETWORK` `rhs = "false"` runtime semantics | lab test |
| [`zpa-79`](kb:zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks) | Provisioning trigger that creates ZPA Trusted Network objects | zscaler doc not yet read / operator experience |
| [`zpa-80`](kb:zpa.trusted-networks.zcc-relationship:signal-path) | ZCC→ZPA trusted-network signal at session establishment | zscaler doc not yet read / lab test |
| [`zpa-81`](kb:zpa.trusted-networks.service-edge-groups:off-network-fallback) | PSE routing / off-network fallback when `is_public = false` | zscaler doc not yet read / lab test |
| [`zpa-82`](kb:zpa.pra.tooling:approval-identity-windows) | PRA approval identity when email/application sets match but time windows differ | API read / lab test |
| [`zpa-83`](kb:zpa.app-segments.api-fields:hbr-sticky-guest-semantics) | Application-segment HBR, sticky, and `guestDetails` semantics | API read / lab test |

The ZCC deep-dive refresh (2026-06-15) registered these open behavior questions surfaced in the per-doc **Open questions** sections — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zcc-77`](kb:zcc.api.web-policy-wire:top-vs-nested-precedence) | WebPolicy `*Top` root-level vs nested-block field precedence on write | lab test |
| [`zcc-78`](kb:zcc.api.web-policy-wire:devicetype-precedence) | WebPolicy `DeviceTypeAlt` (int, wire `deviceType`) vs `DeviceType` (int, wire `device_type`) precedence on write | lab test |
| [`zcc-79`](kb:zcc.api.web-policy-wire:selected-required) | Which WebPolicy `*Selected` / `*SelectedOption` form-state fields are required on write | lab test |
| [`zcc-80`](kb:zcc.api.trusted-networks-wire:v1-v2-coexistence) | ZCC v1 vs v2 endpoint coexistence / supersession | zscaler doc not yet read / lab test |
| [`zcc-81`](kb:zcc.devices.record-fields:zd-vs-zdp) | Device `zd*` vs `zdp*` field-prefix service meanings | zscaler doc not yet read / tenant read |
| [`zcc-82`](kb:zcc.devices.record-fields:registration-state-vs-state) | Device `registration_state` vs `state` distinction | tenant read / zscaler doc not yet read |
| [`zcc-83`](kb:zcc.devices.record-fields:state-wire-type) | `DeviceDetails.state` / `type` wire type (int on list vs string on detail) | tenant read |
| [`zcc-84`](kb:zcc.forwarding-profiles:unified-tunnel-semantics) | Unified Tunnel operational semantics vs two separate Z-Tunnels | zscaler doc not yet read / lab test |
| [`zcc-85`](kb:zcc.forwarding-profiles.fail-open:precedence-detail) | App-Profile fail-close vs tenant-global `FailOpenPolicy` precedence | lab test |
| [`zcc-86`](kb:zcc.sdk-python.return-shapes:web-privacy-get-none) | `get_web_privacy` returns `None` on error rather than a result tuple | code read (resolved) |
| [`zcc-87`](kb:zcc.sdk-python.client-configuration:oneapi-429-headers) | ZCC rate-limit header behavior on the OneAPI path | zscaler doc not yet read / lab test |
| [`zcc-88`](kb:zcc.api.web-policy-wire:mac-block-read-key) | WebPolicy read-shape macOS sub-policy key (`macPolicy` vs `macosPolicy`) | tenant read |
| [`zcc-89`](kb:zcc.api.web-policy-wire:scope-keys-on-read) | WebPolicy `groups` / `users` / `deviceGroups` wire shape on `listByCompany` | tenant read |
| [`zcc-90`](kb:zcc.api.web-policy-wire:devicetype-string-on-read) | WebPolicy companion `deviceType` string presence on reads | tenant read |
| [`zcc-91`](kb:zcc.support-options:toggle-defaults) | App Supportability toggle tenant-default values | tenant read / zscaler doc not yet read |
| [`zcc-92`](kb:zcc.passwords-and-otp.password-api:surface-authority) | Per-product disable-password authority (`WebPolicy` vs `manage_pass`) and key mapping | lab test / zscaler doc not yet read |
| [`zcc-93`](kb:zcc.passwords-and-otp.app-profile-passwords:macos-password-key-asymmetry) | macOS password read-key vs write-key (camelCase vs snake_case) API behavior | lab test |
| [`zcc-94`](kb:zcc.passwords-and-otp.app-profile-passwords:ui-gate-per-os) | Which per-platform password gates render as user-facing UI per OS | operator experience / zscaler doc not yet read |
| [`zcc-95`](kb:zcc.trusted-networks.detection:transition-handling) | Trusted-network stateful evaluation across transitions (debounce / cache) | lab test |
| [`zcc-96`](kb:zcc.trusted-networks.detection:multiple-networks) | Precedence when multiple TrustedNetworks partially match in one Forwarding Profile | lab test |
| [`zcc-97`](kb:zcc.forwarding-profiles.assignment:orphan-reference) | `forwarding_profile_id` orphan-reference resolution at enforcement | lab test |
| [`zcc-98`](kb:zcc.api.web-policy-wire:join-on-read) | On-Net policy vs Forwarding Profile evaluation order | lab test |
| [`zcc-99`](kb:zcc.app-profiles.advanced-settings:drop-quic) | `dropQuicTraffic` effect on browser TCP fallback | operator experience / lab test |
| [`zcc-100`](kb:zcc.forwarding-profiles.internet-actions:ipv6-flags) | IPv6-only-network runtime behavior of the three `drop_ipv6*` flags | lab test |
| [`zcc-101`](kb:zcc.z-tunnel.transport:session-internals) | Service-Edge split-landing control-connection behavior | zscaler doc not yet read / operator experience |

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
| [`zdx-12`](#zdx-12-tenant-level-application-inventory) | Whether the app list returns apps with no recent probe data | tenant read / zscaler doc not yet read |
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
| [`zdx-41`](#zdx-41-probe-result-retention-and-aging-granularity) | Probe-result retention period and aging granularity | zscaler doc not yet read / tenant read |
| [`zdx-42`](#zdx-42-adaptive-mode-scoring-comparability) | Whether Adaptive Mode keeps scores comparable across cadences | zscaler doc not yet read / lab test |
| [`zdx-43`](#zdx-43-inventory-time-range-filter-server-support) | Whether the inventory endpoint honors the time-range filter server-side | lab test / zscaler doc not yet read |
| [`zdx-44`](#zdx-44-snapshot-endpoint-base-path-in-the-automate-contract) | Snapshot endpoint base path in the Automate contract | live API trace / vendor spec |

The ZIdentity refresh (2026-06-15) registered these open behavior questions from `references/zidentity/*.md` — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zid-01`](#zid-01-admin-permission-level-enum-restricted-full-restrictive-view) | Admin permission-level enum (Restricted Full / Restrictive View vs Full / View Only / Restricted / None) | zscaler doc not yet read / tenant read |
| [`zid-02`](#zid-02-zidentity-role-to-per-product-scope-inheritance) | ZIdentity role to per-product (ZIA/ZPA) scope inheritance | tenant read / zscaler doc not yet read |
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
| [`zid-14`](#zid-14-jwks-authtype-request-body-unobserved-in-vendored-sources) | JWKS `authType` request body unobserved in vendored sources | tenant read / zscaler doc not yet read |
| [`zid-15`](#zid-15-bare-adminapiv1-prefix-acceptance-on-the-apizsapinet-host) | Bare `/admin/api/v1` prefix acceptance on the `api.zsapi.net` host | live API trace |
| [`zid-16`](#zid-16-which-wire-host-a-live-tenant-actually-serves) | Which wire host a live tenant actually serves | live API trace |
| [`zid-17`](#zid-17-group-dual-flag-semantics-isdynamicgroup-vs-dynamicgroup) | Group dual-flag semantics (`isDynamicGroup` vs `dynamicGroup`) | API spec review / lab test |
| [`zid-18`](#zid-18-dynamic-group-membership-mutation-behavior) | Dynamic-group membership mutation behavior | lab test |
| [`zid-19`](#zid-19-user-deduplication-in-bulk-add) | User deduplication in bulk add | lab test |
| [`zid-20`](#zid-20-scim-sourced-group-mutation-semantics) | SCIM-sourced group mutation semantics | lab test / vendor documentation |
| [`zid-21`](#zid-21-group-source-value-enum-completeness) | Group `source` value enum completeness | vendor documentation / live API enumeration |
| [`zid-22`](#zid-22-group-enableddisabled-flag-on-the-wire) | Group enabled/disabled flag on the wire | tenant read / vendor documentation |
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
| [`zid-36`](#zid-36-zidentity-user-action-path-template-encoding) | ZIdentity user-action path-template encoding | live API trace / vendor spec |

Partial / SDK-mined (resolved via code read or help-doc capture; full lab confirmation pending): `zcc-01`, `zcc-02`, `zcc-03`, `zcc-04`, `zcc-05`, `zcc-06`, `zcc-07`, **`log-04`** (field name + illustrative values confirmed via `web-log-schema.md`; full enum of `ruletype` / `reason` values still needs a tenant export). All six ZCC enum clarifications had their **datatype** (int vs string) resolved by the Go SDK cross-check on 2026-04-24; the integer-to-meaning mapping remains open for `zcc-01` through `zcc-04` and `zcc-06`.

`shared-17`, `shared-18`, `shared-19` — partially resolved by 2026-05-06 doc sweep (refined further the same day). Existing-doc backing now covers: Service Edge re-evaluation triggers + **subcloud override mechanics fully resolved** via `references/shared/subclouds.md`; ZIA auth-frequency + surrogate-IP TTL fields and dependency rules + **ZIdentity step-up timing fully resolved** as synchronous via `vendor/zscaler-help/understanding-step-up-authentication.json`; QUIC handling with ZTunnel-mode interaction, HTTP/2 enable toggle + Bandwidth Control fallback, WebSocket DLP Copilot-only carveout. The remaining sub-questions narrowed substantially: selection-signal weighting and DC-exclusion mechanics (shared-17), surrogate IP clock anchor + auth-source decision tree + trusted-network-transition behavior (shared-18), HTTP/2 per-stream re-evaluation + WebSocket non-DLP inspection coverage + gRPC/SSE/chunked behavior (shared-19).

The Cloud & Branch Connector (ZTW) deep-dive refresh (2026-06-15) added these open behavior questions — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`cloud-connector-01`](#cloud-connector-01-per-region-status-representation-regionstatusstatus) | Per-region `status` representation (boolean vs four console strings) | code read / lab test |
| [`cloud-connector-02`](#cloud-connector-02-aws-workload-discovery-cloudformation-body-eventbridge-iam-sqs) | AWS workload-discovery CloudFormation body (EventBridge / IAM / SQS) | zscaler doc not yet read / operator experience |
| [`cloud-connector-03`](#cloud-connector-03-source-ip-group-size-and-count-limits) | Source IP group member + per-tenant count limits | support ticket / lab test |
| [`cloud-connector-04`](#cloud-connector-04-ipv6-entries-in-ztc_ip_source_groups-vs-a-separate-ipv6-group-object) | IPv6 entries in `ztc_ip_source_groups` vs separate IPv6 group object | lab test / code read |
| [`cloud-connector-05`](#cloud-connector-05-source_ip_group_exclusion-applicability-to-cloud-branch-connector) | `source_ip_group_exclusion` applicability to CC | lab test |
| [`cloud-connector-06`](#cloud-connector-06-zia-origin-source-groups-editability-from-ztc-and-lite-payload-shape) | ZIA-origin group editability from ZTC + `/lite` payload shape | lab test / zscaler doc not yet read |
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
| [`cloud-connector-18`](#cloud-connector-18-ztw-api-surface-gaps-endpoint-paths-azuregcp-discovery-automation-go-zidentity-auth) | ZTW API gap: public GCP discovery REST family | vendor API documentation / lab test |
| [`cloud-connector-19`](#cloud-connector-19-ztw-sdk-method-convention-anomalies-and-oneapi-fedramp-behavior) | ZTW SDK method-convention anomalies + OneAPI FedRAMP behavior | code read / release note / lab test |
| [`cloud-connector-20`](#cloud-connector-20-nss-va-for-cbc-feed-coverage-sizing-certs-ha-and-rule-match-semantics) | NSS VA for CBC: feed coverage / sizing / certs / HA / rule-match | zscaler doc not yet read / lab test |
| [`cloud-connector-21`](#cloud-connector-21-insightstunnel-insights-aggregation-and-byte-count-parity-with-nss-feeds) | Insights/Tunnel-Insights aggregation + byte-count parity with NSS feeds | lab test / zscaler doc not yet read |
| [`cloud-connector-22`](#cloud-connector-22-cc-region-coverage-govcloud-china-gcp-deployment-and-wds-vs-ztg-region-set-parity) | CC region coverage: standard deployment / sovereign clouds / WDS-vs-ZTG parity | tenant read / support ticket / cloud Marketplace checks |
| [`cloud-connector-23`](#cloud-connector-23-dest_workload_groups_ids-binding-to-local_switch-local) | `dest_workload_groups_ids` binding to `LOCAL_SWITCH` / "Local" | lab test |
| [`cloud-connector-24`](#cloud-connector-24-field-character-limit-enforcement-on-dns-and-log-and-control-rules) | Field character-limit enforcement on DNS / Log-and-Control rules | lab test / zscaler doc not yet read |
| [`cloud-connector-25`](#cloud-connector-25-zcloudconnector-default-response-success-schema-semantics) | ZCloudConnector default-response success schema semantics | vendor spec / live response |
| [`cloud-connector-26`](#cloud-connector-26-ztc_traffic_forwarding_rule-label-support) | `ztc_traffic_forwarding_rule` label support | provider source update / lab test |
| [`cloud-connector-27`](#cloud-connector-27-eu-central-2-ztg-region-source-conflict) | `eu-central-2` ZTG region source conflict | Help capture / vendor clarification |
| [`cloud-connector-28`](#cloud-connector-28-gcp-resource-sync-default-cadence-help-vs-terraform-module) | GCP Resource Sync default cadence: Help vs Terraform module | vendor clarification |

---

## Entries

### zia-05 — Admin rank order collision

*Origin: `kb:zia.url-filtering` § Open questions*

Admin rank gates what order values a rule can have. Can two rules at different admin ranks end up with the same numerical order? If so, which evaluates first — the higher-ranked one, the older one, the alphabetically earlier one?

**Status**: resolved (2026-04-23).

**Answer**: Admin rank is a structural precedence guarantee, not a tiebreaker layered on top of rule order. The question's premise (two rules at different admin ranks with the same numerical order) is effectively neutralized by the doc's behavior guarantee.

From *Configuring the URL Filtering Policy* (`vendor/zscaler-help/configuring-url-filtering-policy.json`) p.3:

> **Edit Rule Order**: Policy rules are evaluated in ascending numerical order (Rule 1 before Rule 2, and so on), and the rule order reflects this rule's place in the order. You can change the value, but if you've enabled Admin Rank, your assigned admin rank determines the rule order values you can select.
>
> **Admin Rank**: Enter a value from 0 to 7 (0 is the highest rank). Your assigned admin rank determines the values you can select. You cannot select a rank that is higher than your own. The rule's admin rank determines the value you can select in the rule order, so that **a rule with a higher admin rank always precedes a rule with a lower admin rank**.

Two takeaways:

1. **Structural guarantee**: When Admin Rank is enabled, the console constrains the rule-order values each admin can pick so that a higher-rank rule (lower admin-rank number — 0 = highest) always ends up earlier in the evaluation order than a lower-rank rule.
2. **Functional behavior**: Evaluation order is deterministic and matches admin-rank precedence. Even if the numerical `order` value could somehow be equal across ranks (via API bypass or migration), the higher-rank rule is the one that fires first by design.

Admin Rank is an opt-in feature ("if you've enabled Admin Rank"); without it, rule order is a flat numeric sequence and admin identity doesn't affect evaluation.

Applies to ZIA URL Filtering, SSL Inspection, and other ZIA policy types that expose the Admin Rank field. ZPA access policies don't use the same admin-rank mechanism based on vendored material.

---
### shared-06 — ZPA disabled-rule semantics

*Origin: `references/shared/policy-evaluation.md` § Shared patterns*

ZIA explicitly documents that a disabled URL filtering rule retains its order position and is simply skipped during evaluation (*Configuring the URL Filtering Policy* p.3). No equivalent statement is made in the vendored ZPA access-policy material. Whether a disabled ZPA rule behaves the same (skip-in-place) or differently (removed from the evaluation list entirely) is not stated.

**Resolves with**: lab test OR zscaler doc not yet read (likely "Configuring Access Policies"). **Status**: open. **Low priority** — behavior is almost certainly parity with ZIA.

---

### shared-01 — SPL index naming portability

*Origin: `references/shared/splunk-queries.md`*

Our SPL patterns parameterize on `$INDEX_ZIA_WEB` / `$INDEX_ZPA` etc. Where those values come from in practice — env var, config file, pulled from overlay or IaC metadata — is undecided. Affects how we make SPL patterns tenant-portable when index naming varies between customers.

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

1. Answer the question from `references/` + the overlay's IaC or live `zscalerctl` read (config-derived reasoning).
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
- A snapshot-refresh helper dumped ZIA + ZPA config under a saved snapshot directory. (Both SDK helpers were later removed, and the saved snapshot tier is retired; tenant reads now go through the overlay's IaC or the read-only zscalerctl CLI.)
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

Affects: `.gitignore` correctly excludes `_data/`, and local-scratch paths but not `.env` (no `.env` is ever created by the skill). Script headers document the 4 required env vars in block comments. No onboarding-doc change needed beyond what's already in README step 4.

---

### shared-05 — Snapshot format

*Origin: scaffold discussion; `kb:zia.api`*

Raw JSON dumps from the API are cheap to produce and `jq`-friendly but noisy for model consumption. Paraphrased-to-markdown is model-friendly but goes stale and adds a transformation step. Decide before the first real refresh script ships.

**Status**: resolved (2026-04-24).

**Answer** (historical; the saved snapshot tier is retired, tenant config now comes from the overlay's IaC or a live read-only `zscalerctl` read): **Raw JSON** — one file per resource, plus a per-cloud manifest capturing timestamp + per-resource counts. Wire format (camelCase for ZIA, mixed for ZPA) is preserved as-is; no paraphrasing pass.

Rationale:

- **Faithfulness over friendliness.** Paraphrased markdown risks going stale against API changes or drifting from the SDK's model. Raw JSON is source-of-truth; any transformation is downstream.
- **`jq`-first access.** Skill answers that need tenant data read JSON directly (`jq '.[] | select(.name == "X")'` over the read-only `zscalerctl` output) or via small Python helpers in the scripts. Claude handles JSON well enough that noisy fields aren't a blocker.
- **Model consumption concerns are real but bounded.** Consumers should be selective — extract only the fields relevant to the question rather than passing the full JSON blob to the model. Reasoning docs under `references/` carry the narrative; IaC and live reads answer "what does this tenant actually have configured" in raw form.
- **Field shapes** come from `node scripts/kb.mjs resolve <type-id>` (for example `zia/url-filtering-rules`); the former `snapshot-schema.md` docs are retired (historical rationale in PLAN.md § 4).

A paraphrased-markdown post-processing step remains an option for the future if a fork team wants it, but no current skill answer requires one.

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

Whether the predefined `Fallback mode of ZPA Forwarding` ZIA forwarding rule routes SIPA-destined M365 traffic to PSE egress or drops it when all connectors in the designated SIPA connector group are unhealthy. The predefined rule exists (see `kb:zia.forwarding-control.predefined-rules`) but its exact fallback action for SIPA traffic is not source-confirmed.

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

- `vendor/zscaler-help/what-is-zscaler-client-connector.json` § Service Edge Selection and Re-evaluation: ZCC "regularly checks whether the current Public Service Edge is still optimal." Triggers documented: regular intervals (duration unspecified), network change (e.g., user moves Wi-Fi), app or device restart. Override options exist (specifics not extracted).
- `references/shared/cloud-architecture.md` explicitly states: "Zscaler's 'advanced geo-IP resolution' routes traffic to the nearest edge; the algorithm itself isn't customer-documented." This is the architectural confirmation that the gap is real and Zscaler-side rather than a doc-capture miss.
- `vendor/zscaler-help/zscaler-resilience-marketing.md` mentions "dynamic service edge selection and customer-controlled data center exclusion" as the brownout/blackout mitigation — confirming both autonomous selection and a customer-override mechanism (DC exclusion) exist, but doesn't specify either.
- **Subcloud interaction is fully resolved** by `references/shared/subclouds.md` (Tier A, sourced from `vendor/zscaler-help/understanding-subclouds.json`):
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

The skill has individual refs covering pieces of the auth timeline (`kb:zia.authentication` for the auth gate and frequency model, `kb:zia.authentication.surrogate-ip` for surrogate IP, `shared/oneapi.md` for OAuth, ZIdentity refs for step-up) but no consolidated walk-through of when each event fires across a request's lifetime.

**Doc sweep 2026-05-06** (partial resolution):

`kb:zia.authentication` already covers more than the original framing assumed:

- **Auth-frequency enum is fully documented** with cookie semantics: `ALWAYS` (per browser session, cookie discarded at close), `DAILY_COOKIE` (1 day), `WEEKLY_COOKIE`, `MONTHLY_COOKIE`, `CUSTOM_FREQUENCY` (1–180 days via `authCustomFrequency`). Cited from `authentication_settings.py:41-42, 243`.
- **Surrogate IP TTL fields documented**: `idle_time_in_minutes` (TTL for IP-to-user binding), `surrogate_refresh_time_in_minutes` (revalidation interval), `surrogate_refresh_time_unit` (`MINUTE` / `HOUR` / `DAY`), `surrogate_ip_enforced_for_known_browsers` (force browsers to also re-auth via cookie).
- **Dependency rules** enforced at TF plan time: `surrogate_ip = true` requires `idle_time_in_minutes > 0` AND `auth_required = true`; `surrogate_ip_enforced_for_known_browsers = true` requires `surrogate_ip = true`.
- **Cookie lifetime applies only to browser flows**: non-browser UAs can't follow SAML redirects; alternative paths (Kerberos, no-auth locations, pre-auth proxy) documented.

**Resolved by existing refs**: auth-frequency enum and clock semantics (cookie expiry-based), surrogate IP TTL field names and dependency rules, browser-vs-non-browser flow split.

**Step-up timing — resolved 2026-05-06** by `vendor/zscaler-help/understanding-step-up-authentication.json`:

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

**HTTP/3 / QUIC** — `kb:zia.saas-apps.quic-conferencing` has the canonical answer:

- ZIA's TLS inspection relies on TCP session state.
- Under explicit-proxy forwarding, QUIC bypasses the proxy entirely.
- Z-Tunnel-mode interaction:
  - **Z-Tunnel 2.0** (packet-tunnel) captures UDP 443 — QUIC is intercepted at the tunnel layer.
  - **Z-Tunnel 1.0** (HTTP CONNECT) does not capture UDP — QUIC traffic egresses outside the tunnel.
- Zscaler's recommendation: **block QUIC at the firewall** so browsers fall back to TCP/TLS (which can then be inspected). Cited from *Leading Practices Guide* p.24, *CAC Deployment Guide* troubleshooting section, and `kb:zia.ssl-inspection`.

**HTTP/2** — `kb:zia.ssl-inspection` documents:

- **Per-rule `http2Enabled` toggle** on the SSL Inspection rule controls whether HTTP/2 inspection is enabled.
- **Falls back to HTTP/1.1 for locations where Bandwidth Control is also enabled**, even if HTTP/2 is on in the SSL/TLS rule. Concrete operational gotcha.
- Inspection capability exists; per-stream re-evaluation behavior not stated.

**WebSocket** — `kb:zia.dlp` § 5 has a sharply-scoped answer:

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

`kb:zia.workload-groups` documents Workload Groups as the policy-scope primitive for Cloud Connector traffic — workload-tag-based attribution replaces the user-identity-based attribution that ZCC traffic carries. But the **Service Edge ingress behavior for traffic without a user identity** is not laid out:

1. **Auth gate behavior** — `kb:zia.authentication` records the legacy statement that auth runs before all other policies (unverified: gap `zia.authentication.unauthenticated-traffic:auth-before-policy`). For a workload session arriving via CC's GRE/IPSec tunnel with no user identity to authenticate, does the auth gate skip (workload tag is sufficient), block (non-browser UA fails SAML), or apply a different mechanism? Per-location `auth_required` setting on the CC-fronted location should make this configurable but the actual handling isn't documented.
2. **Surrogate IP behavior on workload IPs** — does a CC-fronted location with `surrogate_ip = true` bind workload identity to source IP? If multiple workloads share a CC's NAT IP, is the binding shared (correct for traffic-volume attribution but wrong for per-workload policy)?
3. **Auth-frequency setting interaction** — workload sessions are typically long-lived (microservice keepalives, persistent connections). What does `MONTHLY_COOKIE` or `ALWAYS` mean for a session that has no user-side cookie?
4. **NSS feed identity-field population** — the `cloud-connector/logs/log-schema.md` ref lists fields like `login`, `dept`, `deviceowner`, `devicehostname` from the ZIA firewall log schema. For workload traffic with no user identity, are these fields empty, populated with a workload-derived value, or populated with a tag-derived stub?

This matters operationally because operators investigating "why is workload X being blocked by ZIA" need to know whether the blocking subsystem evaluated a user-identity-scoped rule that didn't match (because workloads have no user) or a workload-group-scoped rule (which should match).

**Resolves with**: tenant lab walkthrough — deploy a CC, send known workload traffic, observe: (a) auth gate behavior at the per-location setting, (b) NSS feed field population for the workload session, (c) whether Surrogate IP fires. Plus vendor doc consolidating workload identity semantics (the skill currently has it spread across `kb:zia.workload-groups` + `kb:zia.authentication` + `kb:zia.locations`). **Status**: open — 2026-05-06.

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

The high-level auth methods (SAML SSO / Hosted DB / Kerberos) and the Surrogate IP mechanic are well-documented in `kb:zia.authentication`. What's not documented is the **PAC-mode-specific handshake sequence**:

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

The captured guide documents GraphQL introspection support for the Beta cloud environment only (`vendor/zscaler-help/automate-zscaler/working-with-zscaler-analytics.json:31`). Production introspection is not confirmed by this source set; clients should assume it is unavailable unless vendor documentation or a live production test confirms an exception.

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

### shared-39 — ZPA shared-model secret fields live GET population

*Origin: `references/shared/secret-bearing-api-surfaces.md` § Reveals (contract-documented, live population unverified)*

Several ZPA resources reuse one Go struct for Create requests and Get responses, so a secret field's presence on the model does not prove the GET echoes it: ZPA `/apiKeys` `clientSecret` (`vendor/zscaler-sdk-go/zscaler/zpa/services/api_keys/api_keys.go:20` — and **no** Automate contract op was found for this endpoint to confirm the response schema); PRA credential `password`/`passphrase`/`privateKey` (`vendor/zscaler-sdk-go/zscaler/zpa/services/privilegedremoteaccess/pracredential/credential_controller.go:36,39,42`; contract `GET /credential/{id}` lists them at `vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json` op `privileged-credential-management/get-credential`); and enrollment-cert `privateKey` alongside a `privateKeyPresent` boolean and encrypted blobs (`vendor/zscaler-sdk-go/zscaler/zpa/services/enrollmentcert/zpa_enrollmentcert.go:35-41`; contract `GET /enrollmentCert/{id}`). The `privateKeyPresent` boolean in particular suggests the GET may return the flag instead of the raw key for Zscaler-held keys. Whether any of these three surfaces returns a populated (or masked) secret on a live read is unverified. Contrast ZPA provisioning keys, where the Terraform provider's Read demonstrably stores `resp.ProvisioningKey` — a consumer-confirmed cleartext read.

**Status**: open
**Resolves with**: live ZPA reads of an api-key, a PRA credential, and an enrollment cert with a private key present, observing whether each secret field is populated, masked, or empty on GET

---

### shared-40 — OneAPI entitlement `prd` aliases for `ztw`, `zid`, and `zins`

*Origin: `references/shared/mcp-server.md` § OneAPI entitlement filtering and unmapped aliases*

MCP v0.15.2 maps `CLOUD_CONNECTOR` to `ztw`, `ZIAM` to `zid`, and
`ZINSIGHTS` to `zins`, and it now warns with the names of any still-unmapped
`service-info[].prd` values
(`vendor/zscaler-mcp-server/src/zscaler_mcp/security/entitlements.py:53-88`;
`:116-155`). The regression tests exercise all three aliases and the warning
path (`vendor/zscaler-mcp-server/tests/test_entitlements.py:78-124`). Upstream
issue [#95](https://github.com/zscaler/zscaler-mcp-server/issues/95) supplies
the original one-tenant token observation and successful calls with filtering
disabled.

**Status**: partially resolved — last updated 2026-08-14
**Resolves with**: vendor entitlement documentation or additional token captures sufficient to establish the complete supported canonical/alias set across tenants and token generations

**Partial answer (2026-08-14)**: the concrete three-alias compatibility gap is
fixed in the current MCP implementation and protected by tests. What remains is
the deliberately broader taxonomy question: current public evidence does not
establish that these and the existing aliases are exhaustive for every
ZIdentity tenant or token generation.

---

### zpa-48 — PSE provisioning-key API/Terraform support

*Origin: `kb:zpa.private-service-edges` § Enrollment credentials*

The AWS PSE module v2.0.0 confirms that PSE provisioning keys can be managed through Terraform's generic `zpa_provisioning_key` resource. Its provisioning-key submodule fixes `association_type` to `SERVICE_EDGE_GRP`, binds `zcomponent_id` to the PSE Group, and can alternatively read an existing key (`vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-provisioning-key/main.tf:9-23`; `vendor/terraform-aws-zpa-private-service-edge-modules/modules/terraform-zpa-provisioning-key/variables.tf:25-35,43-58`).

**Status**: resolved (2026-07-15)
**Resolved by**: `vendor/terraform-aws-zpa-private-service-edge-modules` v2.0.0 module source

---

### zpa-73 — `objectType: ZPN_INTERNAL_INTERNET_PROTOCOL` and `USER` wire validity

*Origin: retired `references/zpa/snapshot-schema.md` § Open questions (see git history; field shapes now come from `node scripts/kb.mjs resolve <type-id>`)*

An earlier draft of the operand enum listed `ZPN_INTERNAL_INTERNET_PROTOCOL` and `USER`. Neither is recognized by the current Terraform provider operand validators (`vendor/terraform-provider-zpa/zpa/common.go` — confirmed absent), nor found in the SDK Python/Go policy-operand source, nor in the Postman collection. They may be wire-only API enums the TF provider and SDK don't model, or they may be stale.

**Status**: open
**Resolves with**: lab test (a real GET on `access-policy-rules`) or a Postman/API enum citation confirming whether either appears on the wire

---

### zpa-74 — `tcpKeepAlive` literal wire token (quoted string vs bare integer)

*Origin: retired `references/zpa/snapshot-schema.md` § Open questions (see git history; field shapes now come from `node scripts/kb.mjs resolve <type-id>`)*

SDK and TF both treat `tcpKeepAlive` as a string-as-bool `"0"`/`"1"`, but the Postman `<integer>` type hint leaves open whether the GET response returns the quoted string `"0"` or a bare integer `0`.

**Status**: open
**Resolves with**: tenant read (`jq '.list[0].tcpKeepAlive'` over `zscalerctl zpa app-segments list` output)

---

### zpa-75 — `configSpace` at the segment top level

*Origin: retired `references/zpa/snapshot-schema.md` § Open questions (see git history; field shapes now come from `node scripts/kb.mjs resolve <type-id>`)*

Whether `SIEM` is valid for `configSpace` at the application-segment top level, or only in embedded `serverGroups` / `appResource` objects, is unconfirmed.

**Status**: open
**Resolves with**: tenant read (inspect `configSpace` on a real segment object)

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
**Resolves with**: tenant read (read live findings and collect observed `scan_type` values) OR zscaler doc not yet read

---

### easm-02 — Finding risk-field value semantics

*Origin: `references/easm/findings.md` § Open questions*

EASM finding risk fields — `risk_level` / `severity_score` / `status` (`vendor/zscaler-sdk-python/zscaler/zeasm/models/findings.py:82-86`), `cisa_likelihood` (`:70`), and `epss_likelihood` (`:73`) — carry no value enumerations, validators, or docstrings in the SDK model. The CISA-KEV reading of `cisa_likelihood` and the EPSS-probability reading of `epss_likelihood` (0–1?) are not stated in source. The actual value sets and units are unverified, so the skill cannot interpret a finding's risk posture from these fields alone.

**Status**: open
**Resolves with**: tenant read (collect observed values across live findings) OR zscaler doc not yet read

---

### zia-65 — UCaaS One-Click toggle field location

*Origin: retired `references/zia/snapshot-schema.md` § Open questions (see git history; field shapes now come from `node scripts/kb.mjs resolve <type-id>`)*

The snapshot doc's "Check One-Click bypass states" jq query probes `enableMsftO365`, `enableZoom`, `enableWebex` under `advanced-settings.json`, but those exact UCaaS One-Click toggles are listed as absent from the Z2 tenant read and are not present in the current SDK advanced-settings model (a grep of `vendor/zscaler-sdk-python/zscaler/zia/models/advanced_settings.py` returns no such attributes). The query returns `null` for those keys on a real snapshot. Whether these toggles live on a separate endpoint (e.g. a dedicated SaaS / One-Click app-control settings resource) or are tier-gated is unresolved — needs a tenant where they are enabled to confirm the correct field names / location.

**Status**: open
**Resolves with**: tenant read (a tenant with the UCaaS One-Click apps enabled, to locate the real field names/endpoint) OR zscaler doc not yet read

---
### zia-70 — `dlp_web_rules` live read returns undocumented `ucTemplateId`

*Origin: live ZIA `web_dlp_rules` read observation*

A live ZIA `web_dlp_rules` GET returns a flat integer field `ucTemplateId`. The Go SDK models the web-rule notification template as `EUNTemplateID int` (wire `eunTemplateId`, `vendor/zscaler-sdk-go/zscaler/zia/services/dlp/dlp_web_rules/dlp_web_rules.go:78`) plus `NotificationTemplate *common.IDCustom` (`:90`); the Go-Go SDK `WebDLPRules` model carries both `eunTemplateId` and the `notificationTemplate` object; and the Automate contract's `POST /webDlpRules` operation documents `notificationTemplate` as an object with a nested integer `id`, with no flat template id (`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:116456-116468`; `vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:125032-125069`). Python SDK v1.9.39 now models both `eunTemplateId` and `ucTemplateId`, but only on its new endpoint-DLP rule classes (`vendor/zscaler-sdk-python/zscaler/zia/models/endpoint_dlp_rules.py:45-55`, `:478-487`). That establishes the wire name in a related API family, not its meaning on web DLP rules.

**2026-06-21 snapshot check**: the reconstructed Automate contract still models Web DLP rule reads and updates with `notificationTemplate` and nested `notificationTemplate.id` fields (`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:147831-147872`; `vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:182270-182307`) and does not settle the live `ucTemplateId` meaning. Keep this open: the remaining question is whether `ucTemplateId` is a redundant flat alias, a tenant-specific/live rename, or a field emitted only under some notification-template state.

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

The capability distinction is now documented. AWS and GCP Zero Trust Gateway are
Zscaler cloud-native services that secure workload traffic without requiring
the customer to manage the security infrastructure
(`vendor/zscaler-help/cbc-about-amazon-web-services-zero-trust-gateways.json:8-21`;
`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.json:8-17`).
For GCP specifically, intercept endpoint groups provide project access to a Zscaler-managed
security service
(`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.json:51-54`).
Standard GCP Cloud Connector is the customer-deployed VM path: Help directs the
customer to deploy it with Terraform and distinguishes the deployment, VM, and
Cloud Run function service accounts
(`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.json:8-29`).
Whether the backend happens to represent the two surfaces with related group
objects is not a remaining capability question and must not be used to collapse
the managed-service and customer-VM operating models.

**Status**: resolved (2026-08-04; AWS boundary expanded 2026-08-12)
**Answer**: AWS and GCP ZTG are Zscaler-managed SaaS surfaces; standard Cloud
Connector remains the customer-deployed VM surface. Exact cross-cloud operating
contract parity and Azure ZTG deployment availability are separate questions.
**Resolved by**: current AWS/GCP ZTG and GCP Cloud Connector deployment Help

---

### cloud-connector-08 — HA mechanics: cchealth port, fail-open/close toggle, fail-open egress path

*Origin: `references/cloud-connector/overview.md` § Open questions*

Three high-availability mechanics are named in the captured HA help article but not pinned down: (1) whether the `?cchealth` probe port is configurable and over what range — the article says only "configured during deployment" (`vendor/zscaler-help/cbc-understanding-high-availability-and-failover.json:30`); (2) where in the admin portal the fail-open / fail-close toggle lives — the article says "customers can change this configuration" without naming the path (`:51`); (3) what the fail-open egress path actually is — the source says fail-open lets "workloads that are accessing the internet to continue doing so" yet also that "the egressing traffic is flowing through Zscaler for inspection and policy control" (`:51`), two clauses that are hard to reconcile when the fail-open precondition is that no Cloud Connector in the group can reach a Service Edge. Whether fail-open routes direct-to-internet (no inspection) or via a retained/degraded Zscaler path is not resolved; neither reading should be documented as fact.

**Status**: open
**Resolves with**: lab test (trigger a fail-open condition, observe the egress path) OR zscaler doc not yet read (a clearer source on the toggle path and probe-port range)

---

### cloud-connector-09 — Forwarding-method semantics and the true backend forwardMethod enum

*Origin: `references/cloud-connector/forwarding.md` § Open questions; `references/cloud-connector/api-divergences.md` § Open questions*

The console-label and runtime semantics of several `ForwardMethod` enum values are unconfirmed, and the sources disagree on the enum itself. The Go doc-comment lists ten values including `ENATDEDIP`, `GEOIP`, and `PROXYCHAIN` (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:44`), the Terraform validator lists a smaller set, and the wire field is a free string. Specifically unresolved: (1) `ENATDEDIP` (reads as dedicated-IP NAT) and `GEOIP` (reads as geo-based forwarding) have no console label or documented semantics in captures; (2) `PROXYCHAIN`'s full chaining topology — where the proxy gateway sits, auth, failover — is not in source (only the proxy-gateway action field and its TCP-only network-service constraint are sourced); (3) the full set of values the `ecRdr` endpoint actually accepts — and whether `LOCAL_SWITCH`, `ENATDEDIP`, `GEOIP`, `PROXYCHAIN`, and bare `ZPA` are all live — is unknown without a tenant.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: lab test (submit each candidate `forwardMethod` against the `ecRdr` endpoint, observe acceptance and behavior) OR Postman / oneapi-spec cross-check (a third independent source on the enum)

**2026-06-18 narrowing**: the captured Automate contract now gives a third source on the documented `traffic_forwarding_rule.forwardMethod` enum for `POST /ztw/api/v1/ecRules/ecRdr`, and the generated reconciliation records the precise divergence: contract has `INVALID`, `DIRECT`, `PROXYCHAIN`, `ZIA`, `ZPA`, `ECZPA`, `ECSELF`, `DROP`, `ENATDEDIP`, and `GEOIP`, while Terraform accepts `DIRECT`, `LOCAL_SWITCH`, `ZIA`, `ECZPA`, and `DROP` (`vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-divergences.json:2455-2458`, `:2540-2562`). This closes the "Postman / oneapi-spec cross-check" part of the evidence request. It still does not prove which values the backend accepts in a tenant or what `ENATDEDIP` / `GEOIP` / `PROXYCHAIN` do operationally.

---

### cloud-connector-10 — Forwarding rule count limit and Admin Rank ↔ Rule Order interaction

*Origin: `references/cloud-connector/forwarding.md` § Open questions*

Two forwarding-rule capacity/precedence questions: (1) how many traffic forwarding rules a tenant may define is not captured — the wildcard-domain/FQDN-entry caps (16K per org, 8,000 per rule, `vendor/zscaler-help/cbc-configuring-traffic-forwarding-rule.json:108`) are entry limits, not a rule-count limit; (2) CC forwarding rules carry an Admin Rank field (`vendor/zscaler-sdk-go/zscaler/ztw/services/policy_management/forwarding_rules/forwarding_rules.go:41`), but whether admin rank *gates* the editable Rule Order values the way ZIA URL Filtering's admin-rank does is not stated in captured source.

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

Three DNS-gateway behaviors not exposed in the gateway object: (1) whether the secondary resolver is tried before `failureBehavior` fires (and under what conditions) — the SDK carries `primaryIp` / `secondaryIp` / `failureBehavior` but no field describing the try-order; (2) what the default (non-deletable) DNS gateway resolves to and whether it is operator-modifiable — the SDK has no `isDefault` discriminator; (3) whether a LAN- or WAN-referenced resolver slot can carry an IPv6 address — the "IPv4 only" statement in capture is scoped to the Custom DNS Server entry (`vendor/zscaler-help/cbc-configuring-dns-gateway.json:32,40`), and the gateway struct's `primaryIp` / `secondaryIp` are plain strings with no documented address-family constraint. Related: the `ZPA Resolver` predefined DNS rule is treated as predefined/non-deletable by the TF deletion guard (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_dns_rule.go:135-139`) but no captured source describes its default state, match criteria, action, or license/mode gating.

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

The three original items now reduce to one. (1) **Resolved:** current Go source
uses `/ztw/api/v1/adminUsers` and `/ztw/api/v1/adminRoles`
(`vendor/zscaler-sdk-go/zscaler/ztw/services/adminuserrolemgmt/adminusers/adminusers.go:13-15`;
`vendor/zscaler-sdk-go/zscaler/ztw/services/adminuserrolemgmt/adminroles/adminroles.go:14-16`)
and the active activation package uses the status, activate, and forced-activate
paths under `/ztw/api/v1/ecAdminActivateStatus`
(`vendor/zscaler-sdk-go/zscaler/ztw/services/activation/activation.go:10-14`).
The separate `activation_cli` implementation is entirely commented and is not
an additional active service surface
(`vendor/zscaler-sdk-go/zscaler/ztw/services/activation_cli/zconActivator.go:1-76`).
(2) **Partially resolved:** current Help enumerates the Azure
`/publicCloudTenant` and `/discoveryService/azure/...` families
(`vendor/zscaler-help/cbc-release-upgrade-summary-2026.json:44-64`) and documents
the Azure partner-integration behavior
(`vendor/zscaler-help/cbc-about-microsoft-azure-accounts.json:8-28`). No
corresponding public GCP discovery REST family is established by the current
captured API navigation, so only that GCP surface remains open. (3)
**Resolved:** the unified Go client routes ZTW through a dedicated
`ZTWHTTPClient` OAuth2 client
(`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:372-373`); legacy `ZTC_*`
credentials are the backward-compatible alternative.

**Status**: partially resolved — last updated 2026-08-04
**Resolves with**: vendor API documentation or a lab test establishing whether
GCP workload discovery has a public REST family

---

### cloud-connector-19 — ZTW SDK method-convention anomalies and OneAPI FedRAMP behavior

*Origin: `references/cloud-connector/sdk.md` § Open questions*

Two Go SDK convention anomalies remain unconfirmed: (1) `provisioning_url` uses the ZIA-style methods (`service.Client.Create`, not `CreateResource`) for `Create` / `UpdateWithPut` / `Delete`; and (2) `workload_groups.Get` calls `service.Client.Read` rather than the ZTW-typical `ReadResource`. The endpoint may use the older request path intentionally, but source does not explain either choice.

The earlier FedRAMP premise is reopened. The shared Go OneAPI client constructs dedicated `gov` / `govus` ZIdentity and API-gateway routes, and the ZTC provider passes its unrestricted `zscaler_cloud` string into that client (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:404-438`; `vendor/terraform-provider-ztc/ztc/provider.go:44-49`; `vendor/terraform-provider-ztc/ztc/config.go:350-372`). The current provider docs claim FedRAMP support but attach it to `>=v4.7.25`, an impossible threshold for the current v0.2.0 ZTC provider (`vendor/terraform-provider-ztc/docs/index.md:143-152`; `vendor/terraform-provider-ztc/CHANGELOG.md:3-12`). Official Terraform Skills v0.3.1 says the opposite: no released ZTC version supports OneAPI FedRAMP and government tenants should use legacy auth (`vendor/zscaler-terraform-skills/skills/ztc-skill/references/auth-and-providers.md:5-16`). Static source therefore establishes route construction but neither released support nor live ZTW acceptance. The prior categorical gov/ten exclusion and its fallback question are no longer supportable as written.

**Status**: open — last updated 2026-08-09
**Resolves with**: code read (a future SDK release or maintainer note clarifying the method-convention choices) AND a current ZTC release note or vendor API statement explicitly establishing FedRAMP support, or a lab test that authenticates and completes a ZTW operation through OneAPI on `gov` / `govus`

---

### cloud-connector-20 — NSS VA for CBC: feed coverage, sizing, certs, HA, and rule-match semantics

*Origin: `references/cloud-connector/nss-va.md` § Open questions*

Several NSS-VA-for-CBC behaviors are not pinned down in the captured help sources: (1) whether CBC DNS events (from the DNS Forwarding Gateway / DNS policy) appear under the NSS Firewall log type or require a separate feed — generic NSS docs list DNS as a separate type, but CBC NSS guidance references only Firewall; (2) NSS VA sizing numbers for typical CC fleet sizes (the guides point to Zscaler's interactive sizing tool but capture no CBC table); (3) the NSS client certificate's validity period and whether Zscaler offers automated renewal or requires manual re-registration; (4) whether two NSS VAs can consume the same Nanolog partition simultaneously (active-active HA) or the stream targets exactly one VA; (5) whether Log-and-Control Forwarding gateway selection affects the path CC VMs take to upload logs to the Nanolog — i.e. whether a misconfigured log/control rule could starve the Nanolog before the NSS VA can pull; (6) whether JSON is a supported Firewall feed output format for VM-based NSS in CBC (or CSV is the only tested format); (7) whether Log-and-Control Forwarding rule evaluation stops at the first matching rule (first-match-wins) and whether the auto-created default rule holds the terminal catch-all position — captured source confirms ascending-numerical-order evaluation and disabled-rule skip (`vendor/zscaler-help/cbc-configuring-log-and-control-forwarding-rule.json:34,36`) but not the stop-on-first-match semantics.

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

The GCP side is now substantially bounded. Current Help enumerates exactly 16
GCP Zero Trust Gateway regions
(`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.json:31-53`). It
also confirms standard GCP Cloud Connector is deployed with Terraform
(`vendor/zscaler-help/cbc-deploying-zscaler-cloud-connector-google-cloud-platform.json:8-10`),
and the release summary confirms the Terraform package uses a Google Cloud
Marketplace image
(`vendor/zscaler-help/cbc-release-upgrade-summary-2026.json:38-42`). The standard
customer-deployed architecture is documented as separate management and service
VPCs, zonal MIGs, a regional Cloud NAT gateway, a load balancer, custom routes,
and distinct deployment, VM, and function service accounts
(`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.json:8-32,65-76`).

What remains open is narrower: the region matrix for standard customer-deployed
Cloud Connector; whether the workload-discovery region set equals the ZTG set;
AWS/Azure Gov, China, and other sovereign-cloud availability; per-region
Small/Medium/Large VM-size availability; and the Azure Function App Flex
Consumption regional-gap list. None of the confirmed GCP facts establishes
parity among WDS, ZTG, and standard-CC deployment regions.

**Status**: partially resolved — last updated 2026-08-04
**Resolves with**: tenant read (query supported WDS regions and compare with
the ZTG table), cloud Marketplace checks, or vendor confirmation for standard
CC, sovereign-cloud, VM-size, and Azure Flex regional availability

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

### cloud-connector-25 — ZCloudConnector default-response success schema semantics

*Origin: `references/cloud-connector/api-divergences.md` § Contract reconciliation caveat*

The reconstructed OpenAPI snapshot carries 165 ZCloudConnector operations, but the structural validation report flags 124 of them as `default_response_as_success`: the exporter used a schema-bearing `default` response as the success schema because no explicit `2xx` schema was present (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:17`, `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:25`, `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:30-153`). This preserves useful method/path/field metadata for reconciliation, but it does not prove the intended success status code for those operations or whether the embedded `default` response is a success envelope rather than a catch-all envelope.

**Status**: open
**Resolves with**: vendor OpenAPI/spec clarification OR live response capture for representative ZCloudConnector operations that currently rely on `default` response schemas

---

### cloud-connector-26 — ztc_traffic_forwarding_rule label support

*Origin: `references/cloud-connector/terraform.md` § Policy Management — Traffic Forwarding Rules*

Upstream issue [zscaler/terraform-provider-ztc#46](https://github.com/zscaler/terraform-provider-ztc/issues/46) reports GUI support for Cloud Connector traffic-forwarding rule labels and requests Terraform `rule_label` support. The `ztc_traffic_forwarding_rule` provider schema currently exposes no `labels` / `rule_label` field in its top-level schema (`vendor/terraform-provider-ztc/ztc/resource_ztc_traffic_forwarding_rule.go:123-248`). The reconstructed ZCloudConnector contract includes a `labels` array in the request shape for `POST /ecRules/ecRdr`, but its field description explicitly says it is "Not applicable to Cloud & Branch Connector" (`vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json:88559-88571`; `vendor/zscaler-api-specs/automate-zscaler/zcloudconnector-api-reference.json:90749-90756`). Static sources therefore establish the provider omission and a GUI-versus-contract documentation conflict; they do not prove Cloud & Branch Connector API write acceptance, provider implementation timing, or that the generic field applies to this product.

**Status**: open
**Resolves with**: provider source update adding `labels` / `rule_label`, lab test writing labels through the API, or vendor documentation clarifying GUI/API behavior

---

### cloud-connector-27 — `eu-central-2` ZTG region source conflict

*Origin: `references/cloud-connector/regions.md` § Open questions*

The official Cloud & Branch Connector 2025 release summary announced
`eu-central-2` for Zero Trust Gateways on December 15, 2025, alongside
`sa-east-1`, `ca-central-1`, and `eu-west-3`
(`vendor/zscaler-help/cbc-release-upgrade-summary-2025.json:11-18`; [official
release entry](https://help.zscaler.com/cloud-branch-connector/release-upgrade-summary-2025?applicable_category=connector.zscaler.net&deployment_date=2025-12-15&id=1532586)).
The current locally captured AWS ZTG region table includes the other three
regions but omits `eu-central-2`
(`vendor/zscaler-help/cbc-supported-regions-zero-trust-gateways.json:8-29`). The
omission is a source conflict; neither source says whether the region was
withdrawn, and omission alone is not evidence of withdrawal.

**Status**: open
**Resolves with**: current portal, tenant, or vendor confirmation of
`eu-central-2`, including whether support changed after the 2025 announcement

---

### cloud-connector-28 — GCP Resource Sync default cadence: Help vs Terraform module

*Origin: `references/cloud-connector/gcp-deployment.md` § Resource Sync*

Current GCP MIG Help says the Resource Sync Cloud Run function reconciles Admin
Console membership with the MIG and runs every 10 minutes by default
(`vendor/zscaler-help/cbc-understanding-cloud-connector-deployments-google-cloud-platform-managed-instance-groups-autoscaling.json:26-32`).
The pinned official GCP Terraform module instead describes a 30-minute trigger
and configures cron `*/30 * * * *`
(`vendor/terraform-gcp-cloud-connector-modules/modules/terraform-zscc-cloud-function-gcp/main.tf:331-353`).
For a deployment made from that module, 30 minutes is the concrete configured
value. Static source does not establish whether Help describes a different
managed/default template or whether one source is stale.

**Status**: open
**Resolves with**: vendor clarification or a versioned deployment-template
mapping that explains which implementation uses the 10-minute default

---

### cloud-connector-29 — Azure Zero Trust Gateway deployment availability

*Origin: `references/cloud-connector/overview.md` § Current Zero Trust Gateway product surface and availability boundary*

The current generic Zero Trust Gateway product page describes private VPC/VNet
traffic and names Azure ExpressRoute alongside AWS Direct Connect and GCP
Interconnect (`vendor/zscaler-help/zero-trust-gateway-marketing.md:15-20`). That
is connectivity and product-positioning evidence, not a per-cloud deployment
matrix; the page does not state where customers can currently create gateways,
their release stage, tenant entitlement, or an API contract
(`vendor/zscaler-help/zero-trust-gateway-marketing.md:25-31`). The cloud-specific
Help captured in this pass establishes AWS and GCP Zero Trust Gateways as
Limited Availability and Support-enabled, but no equivalent Azure deployment
article or first-party availability matrix was found
(`vendor/zscaler-help/cbc-about-amazon-web-services-zero-trust-gateways.json:8-10`;
`vendor/zscaler-help/cbc-about-google-cloud-platform-zero-trust-gateways.json:8-17`).

**Status**: open
**Resolves with**: a first-party cloud-specific Azure Zero Trust Gateway Help
article, an explicit per-cloud deployment/availability matrix, or tenant/vendor
confirmation that distinguishes Azure-hosted gateway deployment from Azure
ExpressRoute connectivity to a gateway service

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
**Resolves with**: tenant read (compare configured apps against the list response) OR zscaler doc not yet read

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

The vendor help states the ZDX Central Authority design is "similar to that of the Internet & SaaS CA" (`vendor/zscaler-help/understanding-zdx-cloud-architecture.json:48`), which implies active-passive, but the ZDX CA's actual topology (active-passive vs active-active) is not explicitly confirmed.

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

The Python `share_snapshot` docstring documents an `obfuscation` argument with enum values `USER_NAME` / `LOCATION` / `DEVICE_NAME` / `IP_ADDRESS` / `WIFI_NAME` (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:43-45`), but the body-builder copies only `name`, `alert_id`, and the converted `expiry` into the request body (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:95-106`); `obfuscation` is not in the `@zdx_params` shorthand path (`vendor/zscaler-sdk-python/zscaler/utils.py:390`) and is not extracted into the body. The reconstructed Automate contract now independently confirms `obfuscation` as an optional request-body field on both alert and user snapshot creation, with the same enum values (`vendor/zscaler-api-specs/automate-zscaler/zdx-api-reference.json:91575-91588`, `vendor/zscaler-api-specs/automate-zscaler/zdx-api-reference.json:91734-91745`). The remaining question is this Python wrapper's transmission of the field, not the contract vocabulary.

**Status**: partially resolved — last updated 2026-06-21
**Resolves with**: code read (a future SDK release that wires the field) OR lab test (capture the outbound snapshot request body)

---

### zdx-36 — PFT vs Availability score weighting

*Origin: `references/zdx/overview.md` § Open questions; `references/zdx/score.md` § Open questions*

The ZDX Score takes Page Fetch Time and Availability as inputs, but the numerical weighting between them — the formula or relative weight — is not documented (`vendor/zscaler-help/about-zdx-score.json`). PFT is named the primary input and Availability a factor, without quantification.

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
**Resolves with**: zscaler doc not yet read OR tenant read

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

### zdx-44 — Snapshot endpoint base path in the Automate contract

*Origin: `references/zdx/api-divergences.md` § Cross-SDK ergonomics*

The reconstructed Automate contract publishes alert and user snapshot creation as `POST /snapshot/alert` and `POST /snapshot/user`, and the snapshot validation flags both as path-prefix anomalies relative to the usual ZDX `/v1` path prefix (`vendor/zscaler-api-specs/automate-zscaler/zdx-api-reference.json:91526-91538`, `vendor/zscaler-api-specs/automate-zscaler/zdx-api-reference.json:91675-91687`, `vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:154-155`). The Python SDK composes the alert snapshot method with `_zdx_base_endpoint = "/zdx/v1"` plus `/snapshot/alert` (`vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:27`, `vendor/zscaler-sdk-python/zscaler/zdx/snapshot.py:83-87`). Which base path a live OneAPI tenant accepts for the snapshot routes is not confirmed by static sources.

**Status**: open
**Resolves with**: live API trace against the OneAPI gateway OR vendor OpenAPI/spec clarification for ZDX snapshot route base paths

---

### zid-01 — Admin permission-level enum (Restricted Full / Restrictive View)

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

The ZIdentity admin-RBAC capture lists four permission levels — Full / View Only / Restricted / None (`vendor/zscaler-help/admin-rbac-captures.json:124`) — but the extraction report notes shared docs elsewhere reference "Restricted Full" and "Restrictive View" as additional or alternate level names. Which enum is authoritative for ZIdentity admin roles is unresolved from the captured source.

**Status**: open
**Resolves with**: zscaler doc not yet read (re-capture the live Admin Roles & Permissions article — see `zid-35`) OR tenant read

---

### zid-02 — ZIdentity role to per-product scope inheritance

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

It is unclear whether a ZIdentity "User Admin" role combined with Full Administrative Entitlements automatically inherits any ZIA/ZPA admin scope, or whether per-product admin scope must be configured separately in each product console. The captured admin-RBAC source (`vendor/zscaler-help/admin-rbac-captures.json`) describes ZIdentity-side role assignment but does not state how (or whether) it propagates into per-product feature/scope flags.

**Status**: open
**Resolves with**: tenant read (compare a ZIdentity admin's role against the scope they actually receive in ZIA/ZPA) OR zscaler doc not yet read

---

### zid-03 — Role-management APIs absent from the SDK surface

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

Neither SDK exposes an endpoint to list role definitions, create custom roles, assign roles, or query the permission matrix at runtime — the refreshed Go ZIdentity service catalog contains `common`, `api_clients`, `groups`, `resource_servers`, `user_entitlement`, and `users` (see `zid/sdk.md` item 1, resolved), and the Python `zid/` package has no role-management module. Whether role management is portal-only, or served by an admin endpoint the SDKs simply do not wrap, is not determinable from source.

**Status**: open
**Resolves with**: zscaler doc not yet read OR live API trace against a tenant

---

### zid-04 — Admin role-assignment audit trail

*Origin: `references/zidentity/admin-rbac.md` § Open questions*

No audit endpoint for ZIdentity role-assignment changes is wrapped in either SDK (the Python `zid/` package and Go `ziam/services/` catalog carry no audit-log service). Whether ZIdentity records who-assigned-which-role-when, and where that record is read from, is not determinable from the SDK surface.

**Status**: open
**Resolves with**: zscaler doc not yet read OR live API trace against a tenant

---

### zid-05 — `scope` field semantics and value enum

*Origin: `references/zidentity/user-entitlements.md` § Open questions; `references/zidentity/admin-rbac.md` § Open questions*

The entitlement `scope` field is populated by both SDKs (Python `vendor/zscaler-sdk-python/zscaler/zid/models/user_entitlement.py:52-60`; the refreshed Go `Entitlements` struct carries optional `*common.IDNameDisplayName` at `vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:24-28`) but no value enum or operational definition is documented in either SDK. Fixture examples include `Global`, `Limited`, and `AllResources`, yet what `Limited` actually restricts — which resources, at which granularity — is not stated. This is the same field surfaced from two docs (admin-rbac calls it `Entitlement.scope`; user-entitlements calls it `scope`).

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

The refreshed Go SDK returns `[]ServiceEntitlement`, where each element wraps a `Service` object (`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:30-39,61-74`), while the Python SDK constructs a single `Service` object from the raw body at `vendor/zscaler-sdk-python/zscaler/zid/user_entitlement.py:118` (`Service(self.form_response_body(response.get_body()))`). A single `Service.__init__` over an array-shaped body would parse it oddly rather than yield a list. The live wire shape for a user holding multiple service entitlements is undemonstrated in the vendored fixtures, so the Python behavior for that case is unverified.

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

The refreshed Go package no longer declares the old unused `Scope` wrapper. Its `Entitlements` struct carries an optional single `*common.IDNameDisplayName` (`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:24-28`). Whether the wire format could change from a single scope object to a list is still unknown; the current source provides no list-shaped model.

**Status**: open
**Resolves with**: vendor API spec OR changelog review

---

### zid-10 — Entitlement role-name enum completeness

*Origin: `references/zidentity/user-entitlements.md` § Open questions*

Observed entitlement role names in test fixtures (`SuperAdmin`, `Admin`, `ReadOnly`, `PolicyAdmin`, `Auditor`) may not be exhaustive — no enum constants are exported in either SDK; the Go entitlement fields use the shared free-form `IDNameDisplayName` type (`vendor/zscaler-sdk-go/zscaler/ziam/services/user_entitlement/user_entitlement.go:24-28`; `vendor/zscaler-sdk-go/zscaler/ziam/services/common/common.go:14-18`) with no enumeration. The full set of valid role names cannot be confirmed from source.

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
**Resolves with**: tenant read (capture a JWKS-configured API client body) OR zscaler doc not yet read

---

### zid-15 — Bare `/admin/api/v1` prefix acceptance on the `api.zsapi.net` host

*Origin: `references/zidentity/api-divergences.md` § Open questions*

The refreshed SDK sources no longer pair ZIdentity with two different routes: Python and Go both use `/ziam/admin/api/v1` through the OneAPI path. The older Go release used a bare `/admin/api/v1` prefix with a vanity-admin host. Whether a tenant still accepts that legacy alias, or whether it must be migrated to the current OneAPI route, is not determinable from the refreshed source alone (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:385-410,441-455`; `vendor/zscaler-sdk-go/zscaler/oneapiconfig.go:408-449`).

**Status**: open
**Resolves with**: live API trace (send a bare-prefix request to `api.zsapi.net`, observe acceptance)

---

### zid-16 — Which wire host a live tenant actually serves

*Origin: `references/zidentity/resource-servers.md` § Open questions*

The refreshed Go client resolves production ZIAM traffic to the shared OneAPI base (`https://api.zsapi.net`) and maps government/non-production cases separately (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:441-455`), matching the Python production host. Whether a tenant still serves the old `{vanity_domain}-admin.zslogin.net` alias from an earlier Go release, and whether that alias behaves identically, cannot be determined from SDK declarations. This is the host-routing compatibility twin of the legacy-prefix question in `zid-15`.

**Status**: open
**Resolves with**: live API trace against a tenant (resolve both hosts, compare responses)

---

### zid-17 — Group dual-flag semantics (`isDynamicGroup` vs `dynamicGroup`)

*Origin: `references/zidentity/groups.md` § Open questions*

The group record carries two separate dynamic-group booleans — `isDynamicGroup` and `dynamicGroup` (`vendor/zscaler-sdk-go/zscaler/ziam/services/groups/groups.go:26-27`; Python mirrors both at `vendor/zscaler-sdk-python/zscaler/zid/models/groups.py:89-90`). The current Go unit fixtures marshal both as `false` and unmarshal/assert both as `true` (`vendor/zscaler-sdk-go/tests/unit/ziam/services/groups_test.go:21-75`); response fixtures also cover matching false/true pairs (`vendor/zscaler-sdk-go/tests/unit/ziam/services/groups_test.go:109-163`). What the server does when the two flags disagree is undocumented, so their relationship under conflicting values remains unverified.

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

*Origin: retired `references/zidentity/snapshot-schema.md` § Open questions (see git history; field shapes now come from `node scripts/kb.mjs resolve <type-id>`)*

User records expose `status` as a boolean (active/disabled), but the group model carries no `status` field in either SDK. Whether groups have an equivalent enabled/disabled flag that the captured models simply omit, or whether groups have no such concept, is not confirmed from the vendored sources.

**Status**: open
**Resolves with**: tenant read (read a live group record, check for a status field) OR vendor documentation

---

### zid-23 — Empty `serviceScopes` array semantics

*Origin: `references/zidentity/resource-servers.md` § Open questions*

The meaning of a resource server with an empty `serviceScopes` slice (vs a populated one) is not documented in either SDK — whether it means "no scopes available", "all scopes", or "scopes defined elsewhere" is unstated.

**Status**: open
**Resolves with**: tenant-side check (read live resource servers, correlate empty `serviceScopes` with grantable scopes) OR vendor documentation

---

### zid-24 — `defaultApi` flag behavior

*Origin: `references/zidentity/resource-servers.md` § Open questions*

The `defaultApi` boolean on the resource-server record is present in both SDKs (`vendor/zscaler-sdk-go/zscaler/ziam/services/resource_servers/resource_servers.go:16-24`; `vendor/zscaler-sdk-python/zscaler/zid/models/resource_servers.py:90`) but its operational meaning — which clients it applies to, what it overrides — is not described in any vendored source.

**Status**: open
**Resolves with**: vendor documentation OR lab test

---

### zid-25 — Resource-server enumerability (hidden internal entries)

*Origin: `references/zidentity/sdk.md` § Open questions (item 6)*

Whether `list_resource_servers` enumerates *all* resource servers in a tenant, or whether some are Zscaler-internal and hidden from the list, is not confirmed from source. Both SDKs hit the resource-servers endpoint with no filter parameter that would distinguish tenant-created from system-provided entries — using the current OneAPI path (`/ziam/admin/api/v1/resource-servers`) in both SDKs (`vendor/zscaler-sdk-python/zscaler/zid/resource_servers.py`; `vendor/zscaler-sdk-go/zscaler/ziam/services/resource_servers/resource_servers.go:12-14`) and the shared Go API base (`vendor/zscaler-sdk-go/zscaler/oneapiclient.go:441-455`).

**Status**: open
**Resolves with**: tenant-side check (list resource servers on a live tenant, compare against the console) OR vendor documentation

---

### zid-26 — ZIdentity snapshot writer output shape

*Origin: retired `references/zidentity/snapshot-schema.md` § Open questions (see git history; field shapes now come from `node scripts/kb.mjs resolve <type-id>`)*

Whether a future ZIdentity snapshot stores the raw list body (so jq uses `.records[]`) or wraps pages in an array (so jq uses `.[0].records[]`) is a writer decision not yet made — ZIdentity is not currently snapshotted. The doc's jq examples assume the raw single-object body, matching the SDK list models (`vendor/zscaler-sdk-python/zscaler/zid/models/users.py:36-67`); confirm and re-document once the writer exists.

**Status**: open
**Resolves with**: design decision (made when the ZIdentity snapshot writer is built; expected alongside the `linear/dav-19-zidentity-refresh` work)

---

### zid-27 — Secrets snapshot file layout

*Origin: retired `references/zidentity/snapshot-schema.md` § Open questions (see git history; field shapes now come from `node scripts/kb.mjs resolve <type-id>`)*

If API-client secrets are dumped to a saved export, the per-client file/key naming convention (e.g. `api-client-secrets.json` keyed by client id) is undefined. More fundamentally, whether a live `GET /api-clients/{id}/secrets` returns the real secret `value` is unverified: the response **shape** carries a `value` field (`vendor/zscaler-sdk-python/zscaler/zid/models/api_client.py:287-318`, mapped at `:305`) and the Postman sample includes one, but that sample value is a synthetic placeholder and the portal documents the secret as not retrievable after creation. Treat `value` as sensitive and consider excluding it from the export entirely rather than making a layout decision.

**Status**: open
**Resolves with**: a live `GET .../secrets` capture to confirm whether `value` is populated post-creation, plus the snapshot-writer design decision

---

### zid-28 — Authentication levels: per-product or global only

*Origin: `references/zidentity/step-up-authentication.md` § Open questions*

Whether ZIdentity authentication levels can be configured differently per-product or only globally is unresolved; the captured step-up material (`vendor/zscaler-help/understanding-step-up-authentication.json`) describes a single tenant-wide level tree, but does not state whether per-product overrides exist.

**Status**: open
**Resolves with**: zscaler doc not yet read OR tenant-side check

---

### zid-29 — Step-up for SCIM users without a mapped external IdP identity

*Origin: `references/zidentity/step-up-authentication.md` § Open questions*

How step-up interacts with SCIM-provisioned users who lack a mapped external IdP identity — whether such users can step up at all — is not addressed by the captured step-up material (`vendor/zscaler-help/understanding-step-up-authentication.json`).

**Status**: open
**Resolves with**: lab test (attempt a step-up challenge for a SCIM user with no external IdP mapping) OR zscaler doc not yet read

---

### zid-30 — Step-up "message to user" localization

*Origin: `references/zidentity/step-up-authentication.md` § Open questions*

Whether the per-level "message to user" field supports localization (multiple language strings) or only a single string per level is not stated in the captured step-up material (`vendor/zscaler-help/understanding-step-up-authentication.json`).

**Status**: open
**Resolves with**: zscaler doc not yet read OR tenant-side check

---

### zid-31 — Where step-up elevation is logged

*Origin: `references/zidentity/step-up-authentication.md` § Open questions*

Whether step-up elevation is recorded in ZIA Transaction logs or ZPA LSS User Activity logs — and with what field values — is not stated in the captured step-up material (`vendor/zscaler-help/understanding-step-up-authentication.json`). Relevant to "can I see when a user was challenged" questions.

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

The `About Access Tokens` and `Revoking Access Tokens` help articles are named in the related-articles list of `vendor/zscaler-help/zidentity-about-api-clients.json` but are not captured in `vendor/zscaler-help/`. The "revocation takes effect at the next OneAPI call" timing and the post-revocation propagation window are therefore unverified against source. Capturing these pages would also resolve `zid-12`.

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

The authoritative full permission matrix (25+ modules × 4 levels) is explicitly deferred to the live help portal by the capture (`vendor/zscaler-help/admin-rbac-captures.json:128`) and is not present in `vendor/zscaler-help/`. Capturing it would also resolve the permission-level enum question (`zid-01`).

**Status**: open
**Resolves with**: zscaler doc not yet read / capture

---

### zid-36 — ZIdentity user-action path-template encoding

*Origin: `references/zidentity/users.md` § Postman collection endpoints*

The ZIdentity user action operations are corroborated across surfaces, but their URL spelling still differs by source. The Postman surface and refreshed Automate snapshot both use colon-suffix verbs such as `/users/:id:resetpassword` and `/users/{id}:resetpassword`, `/users/:id:setskipmfa` and `/users/{id}:setskipmfa`, and `/users/:id:updatepassword` and `/users/{id}:updatepassword` respectively (`vendor/zscaler-api-specs/automate-zscaler/zid-api-reference.json:5525`, `:5421`, `:5931`; `vendor/zscaler-api-specs/oneapi-postman-collection.json:133834-133842`, `:133972-133980`, `:134152-134160`). The Go SDK still constructs slash-delimited paths (`vendor/zscaler-sdk-go/zscaler/ziam/services/users/users.go:200-241`). This closes the earlier malformed adjacent-template concern and establishes agreement between Postman and the current Automate publication, but leaves a Go-vs-Automate path divergence and live URL spelling/acceptance open; the refreshed contract has no ZID structural issues (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:20`).

**Status**: open
**Resolves with**: live API trace OR vendor OpenAPI/spec clarification for ZIdentity action-route encoding

---

### ai-security-01 — AI Guard direction literal aliases

*Origin: `references/ai-security/api-divergences.md` § Direction value divergence*

The Python SDK docstrings define AI Guard `direction` as `IN` or `OUT` (`vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:57-70`, `:138-150`), and integration docs use `IN`/`OUT` for prompt/response scanning. The DAS Help page examples instead pass `"request"` and `"response"` (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:196`, `:200`, `:204`, `:208`). Whether the live API accepts both literal sets, normalizes them, or treats one set as pseudocode is unverified.

**Status**: open
**Resolves with**: lab test (call both endpoints with `IN`/`OUT` and `request`/`response`) OR vendor API documentation

---

### ai-security-02 — AI Guard execute-policy without policyId

*Origin: `references/ai-security/api-divergences.md` § `policyId` requirement divergence*

The DAS Help page states `policyId` is required for the explicit-policy option (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:78`), while the Python SDK method marks `policy_id` optional and only emits `policyId` when supplied (`vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:57-63`, `:97-104`). It is unclear whether the server rejects `execute-policy` without a policy ID, falls back to resolution, or whether the SDK optionality exists only for payload construction convenience.

**Status**: open
**Resolves with**: lab test (call `/v1/detection/execute-policy` without `policyId`) OR vendor API documentation

---

### ai-security-03 — AI Guard detector taxonomy source of truth

*Origin: `references/ai-security/api-divergences.md` § Detector taxonomy divergence*

The public Help article gives a 15-item capability list (`vendor/zscaler-help/ai-guard-what-is.json:18`-`:46`), while the integration skill/reference says AI Guard has 19 prompt detectors and 21 response detectors (`vendor/zguard-ai-integrations/Anthropic/claude-code-skill/README.md:21`) organized by `IN` and `OUT`. Whether the integration detector list is a console-complete taxonomy, an integration-local reference, or ahead of the captured Help page is not established.

**Status**: open
**Resolves with**: current AI Guard console capture OR vendor Help/API documentation that lists the detector names by direction

---

### ai-security-04 — AI Guard admin-plane programmability

*Origin: `references/ai-security/api-divergences.md` § Automate admin-plane contract vs client surfaces*

The 2026-06-16 refresh found Python SDK runtime policy detection and public DaaS integration examples, but no broad AI Guard admin-plane client wrapper, Go SDK service, Terraform resource, MCP tool, Postman endpoint, or Automation Hub procedure in the inspected source classes. The 2026-07-20 Docusaurus snapshot narrowed that by exposing 47 Automate operations across detection policies, match rules, applications, providers, provider types, and credentials (provider-type discovery at `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7486-7903`). The current 2026-09-07 capture confirms 47 AI Guard operations across 29 paths, matches all 47 with zero schema-changed operations, and records eight colon-action route corrections; it reports no retained publication absences (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-10`; `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:3`, `:9-21`, `:27-28`, `:47-48`, `:119-126`; current route examples at `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:4021-4033`). The [2026-08-12](https://github.com/dvmrry/zscaler-skill/blob/3174c9ac8901b019bc96de5f60af77677f52841d/vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md#L3-L64) no-AI-Guard observation remains dated historical context only; it is not a current publication absence, endpoint-retirement, or backend-availability conclusion. Python SDK v1.9.39 added six OneAPI configuration resources with 39 callable methods (`vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; method inventories in `vendor/zscaler-sdk-python/zscaler/aiguard/policies.py:37-357`, `vendor/zscaler-sdk-python/zscaler/aiguard/policy_match_rules.py:37-338`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:37-457`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:37-362`, `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:37-363`, and `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:37-412`). What remains open is the eight-operation Python-to-current-contract gap tracked in `ai-security-08`, tenant entitlement/live acceptance, and Go SDK, Terraform, MCP, Postman, and Automation Hub wrapper availability.

**Status**: partially resolved — last updated 2026-09-07
**Resolves with**: SDK/provider/MCP/Postman source exposing the remaining operations or vendor confirmation of intended raw-API-only coverage, plus entitled-tenant evidence for live acceptance. Current public Automate publication is confirmed; that part no longer needs restoration.

---

### ai-security-06 — AI Guard DAS endpoint host selection

*Origin: `references/ai-security/api-divergences.md` § Runtime endpoint host divergence*

The captured DAS Help page uses the global host `https://api.zseclipse.net` for both policy execution and policy resolution (`vendor/zscaler-help/ai-guard-test-llm-providers-ai-guard-dasapi-mode.md:50`, `:100`, `:158`). The legacy Python AI Guard client still defaults to `https://api.us1.zseclipse.net`, accepts `AIGUARD_CLOUD`, and constructs `https://api.<cloud>.zseclipse.net` unless an override URL is supplied (`vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:54-81`). Public integration examples also still document region-derived hosts (`vendor/zguard-ai-integrations/Microsoft/README.md:519`; `vendor/zguard-ai-integrations/github-actions/README.md:66`; `vendor/zguard-ai-integrations/github-actions/scripts/scan_policy.py:38-42`). Upstream issue [zguard-ai-integrations#10](https://github.com/zscaler/zguard-ai-integrations/issues/10) reports that the regional policy-resolution host no longer works and the global host does, but this is issue-report context rather than a static vendor specification. Static sources do not establish whether global and regional hosts both work, whether one is preferred, or whether the regional examples are stale.

**Status**: open
**Resolves with**: live API trace across global/regional hosts OR vendor documentation / SDK update that states the preferred AI Guard DAS endpoint host

---

### ai-security-07 — Help provider labels vs Automate provider types

*Origin: `references/ai-security/api-divergences.md` § Help provider labels vs Automate provider types*

The current Automate admin-plane provider-type discovery contract exposes 23 identifiers (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7503-7533`); the current capture publishes 47 AI Guard operations across 29 paths, matches all 47 with zero schema-changed operations, and reports no retained publication absences (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-10`; `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:9-21`, `:27-28`, `:47-48`). The older [2026-08-12](https://github.com/dvmrry/zscaler-skill/blob/3174c9ac8901b019bc96de5f60af77677f52841d/vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md#L3-L64) no-AI-Guard observation remains historical context only. The 2026 Help chronology separately names User-mode or application support for GitHub Copilot, ElevenLabs, Windsurf, Mistral Vibe, Gamma, and Builder.io, none of which appears under those exact identifiers in the current enum (`vendor/zscaler-help/ai-guard-users-release-20260909.json:14-50`; `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:7503-7533`). Static sources do not establish whether those labels are built-in/non-creatable providers, application-level aliases, or contract/Help timing drift.

**Status**: open
**Resolves with**: current provider-management Help article body, tenant provider-type discovery response, or vendor mapping between User-mode application labels and admin-plane provider types

---

### ai-security-08 — Python SDK AI Guard admin-operation gap

*Origin: `references/ai-security/api-divergences.md` § Python SDK coverage gap*

Python SDK v1.9.39 exposes 39 callable operations across policies, policy-match rules, LLM providers, provider credentials, applications, and application credentials (`vendor/zscaler-sdk-python/zscaler/aiguard/aiguard_service.py:26-84`; resource implementations under `vendor/zscaler-sdk-python/zscaler/aiguard/`). The current Automate contract exposes 47 operations across the same administration surface, and the current comparison matches all 47 with zero schema-changed operations while documenting eight colon-action route corrections (`vendor/zscaler-api-specs/automate-zscaler/openapi-validation-report.md:7-10`; `vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:27-28`, `:47-48`, `:119-126`; representative current paths at `vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:477-489`, `:609-621`, `:1469-1481`, `:1954-1966`, `:3956-3968`, `:4021-4033`, `:5229-5241`, `:6142-6154`, `:7166-7178`). The current capture reports no retained publication absences; the older [2026-08-12](https://github.com/dvmrry/zscaler-skill/blob/3174c9ac8901b019bc96de5f60af77677f52841d/vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md#L3-L64) no-AI-Guard observation remains historical context only. Policy enable, disable, referential check, and summaries have no callable SDK methods; four resource referential-check implementations are commented out after maintainer-observed HTTP 404 responses (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_providers.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_provider_credentials.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_applications.py:180-222`; `vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:180-222`). The static sources do not establish whether the live API rejects these contract-documented routes generally, whether the reported 404 was tenant/version-specific, or whether the SDK methods were withdrawn for another reason.

Separately from those eight absent callable methods, the callable Python v1.9.44 application-credential regenerate method constructs `/llm-application-credentials/{credential_id}/regenerate` (`vendor/zscaler-sdk-python/zscaler/aiguard/llm_application_credentials.py:308-312`), whereas current Automate publishes `/llm-application-credentials/{id}:regenerate` (`vendor/zscaler-api-specs/automate-zscaler/aiguard-api-reference.json:4021-4033`). This is an additional wire-path divergence, not a ninth missing method or evidence of runtime failure.

**Status**: open
**Resolves with**: live OneAPI calls for the eight missing operations and the regenerate path discrepancy, SDK integration tests, or a vendor/SDK issue that reconciles the documented routes with runtime acceptance

---

### ai-security-09 — Python SDK legacy policy-detection authentication path

*Origin: `references/ai-security/api-divergences.md` § Legacy runtime static regression cautions*

The v1.9.39 legacy helper can build the AI Guard Bearer header and send a request directly (`vendor/zscaler-sdk-python/zscaler/aiguard/legacy.py:333-410`), but the generic HTTP dispatch path now falls through to the standard session branch for that client (`vendor/zscaler-sdk-python/zscaler/oneapi_http_client.py:318-325`). At the same time, `RequestExecutor` marks an AI Guard legacy helper as legacy, suppresses OAuth, and only injects authorization for non-legacy requests (`vendor/zscaler-sdk-python/zscaler/request_executor.py:35-76`, `:101-107`, `:357-368`). The policy-detection throttling hook also looks for `zguard_legacy_client` while the executor stores `aiguard_legacy_client` (`vendor/zscaler-sdk-python/zscaler/aiguard/policy_detection.py:124-131`; `vendor/zscaler-sdk-python/zscaler/request_executor.py:63-75`). This source-level path looks internally inconsistent, but it has not been exercised against a live endpoint.

**Status**: open
**Resolves with**: a mocked prepared-request test proving the Authorization header and throttling hook, a live legacy policy-detection call, or an upstream SDK correction

---

### risk360-01 — Risk360 programmable API and export surface

*Origin: `references/risk360/overview.md` § Open questions*

Risk360 help captures describe dashboard, factors, asset-level risk, Monte Carlo, log processing, and product positioning (`vendor/zscaler-help/what-risk360.json:8-22`, `vendor/zscaler-help/risk360-about-dashboard.json:8-48`, `vendor/zscaler-help/risk360-monte-carlo.md:12-34`). A Python ZIdentity integration cassette incidentally shows a `ZRA` / `Risk360` resource-server entry with read-only and super-admin role scopes (`vendor/zscaler-sdk-python/tests/integration/zid/cassettes/TestResourceServers.yaml:25-28`, `:132-135`), but this refresh did not find a product-specific Risk360 SDK service, Terraform resource, Ansible module, MCP tool, or Postman endpoint family. Treat Risk360 programmability and export automation as unresolved until a vendor API source is captured.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing Risk360 operations, or tenant-side API discovery

---

### risk360-02 — Risk360 factor catalog, weighting, and peer-benchmark methodology

*Origin: `references/risk360/overview.md` § Open questions*

The captured sources establish that Risk360 uses four attack-stage categories, weighted factors, industry-peer comparison, and a moving factor count (`vendor/zscaler-help/what-risk360.json:8-22`, `vendor/zscaler-help/risk360-about-dashboard.json:8-16`, `vendor/zscaler-help/risk360-about-factors.json:8-20`, `vendor/zscaler-help/risk360-product-marketing.md:18-24`). They do not enumerate the full current factor catalog, disclose per-factor weights, or explain the peer-benchmark cohort methodology.

**Status**: open
**Resolves with**: captured Factors-page export, vendor methodology documentation, tenant read, or support confirmation

---

### breach-predictor-01 — Breach Predictor API, integration, and data-source details

*Origin: `references/breach-predictor/overview.md` § Open questions*

The captured Breach Predictor help states that the product consumes and analyzes data from multiple sources, uses generative AI, and presents breach-probability, Sankey, MITRE ATT&CK, AI Assist, dashboard, findings, events, threat-landscape, ticket, and profile surfaces (`vendor/zscaler-help/bp-what-zscaler-breach-predictor.json:25-48`). This refresh did not find a product-specific SDK service, Terraform resource, Ansible module, MCP tool, or Postman endpoint family, and the source does not enumerate the ingestion sources or integration API details.

**Status**: open
**Resolves with**: vendor API/integration documentation, SDK/provider source, tenant-side integration capture, or support confirmation

---

### uvm-01 — UVM AnySource Upload File API endpoint and broader API surface

*Origin: `references/uvm/overview.md` § Open questions*

The UVM AnySource capture names Upload File, AWS S3, GCP, Webhook, and Upload File API methods for AnySource ingestion (`vendor/zscaler-help/uvm-anysource-connector.json:8-16`), and the marketing capture describes connectors, AnySource, AnyTarget, reporting, and automated workflows (`vendor/zscaler-help/uvm-unified-vulnerability-management-marketing.md:21-35`). This refresh did not find a UVM endpoint schema or SDK/provider/MCP/Postman implementation for the Upload File API or broader UVM administration.

**Status**: open
**Resolves with**: vendor API documentation, captured Upload File API article, SDK/provider source, or tenant-side API discovery

---

### dspm-01 — DSPM programmable/admin API and scanner contract

*Origin: `references/dspm/overview.md` § Open questions*

The DSPM captures establish product behavior, supported provider/on-prem scopes, scan/authentication types, classification, OCR, and data-residency claims (`vendor/zscaler-help/dspm-what-data-security-posture-management.json:8-78`, `vendor/zscaler-help/dspm-marketing.md:48-63`). This refresh did not find a DSPM SDK service, Terraform resource, Ansible module, MCP tool, or Postman endpoint family, and the captures do not provide an endpoint-level admin API or detailed scanner/orchestrator deployment contract.

**Status**: open
**Resolves with**: vendor API documentation, captured setup guide, SDK/provider source, or tenant-side deployment/API discovery

---

### zbi-01 — Manual URL Filter Isolate SSL Inspection prerequisite

*Origin: `references/zbi/policy-integration.md` § ZIA side — URL Filter `Isolate` action*

The Zero Trust Browser traffic-flow article states that HTTP/HTTPS requests matching a URL Filtering policy with isolation are redirected to the isolation profile URL (`vendor/zscaler-help/what-is-zero-trust-browser.json:28`). The Smart Browser Isolation article separately states that Smart Isolation decrypts suspicious sites using SSL/TLS Inspection and auto-creates an editable SSL/TLS Inspection rule (`vendor/zscaler-help/configuring-smart-browser-isolation-policy.json:16`, `:24`). The captured sources do not explicitly state whether a manual URL Filtering `Isolate` rule has the same SSL/TLS Inspection prerequisite, nor the precise behavior for HTTPS traffic in an SSL bypass path.

**Status**: open
**Resolves with**: lab test across HTTPS URLs with inspect vs bypass, plus vendor documentation or API behavior notes for manual URL Filtering `ISOLATE`

---

### zbi-02 — `cbizpaprofile` vs `isolationprofile` preferred endpoint

*Origin: `references/zbi/api.md` § `cbizpaprofile` vs `isolationprofile` — disambiguation note*

The ZPA CBI SDK surface exposes two read-only profile-list paths with overlapping names but different bases and response shapes: `cbizpaprofile` uses `/zpa/cbiconfig/cbi/api/customers/{customerId}/zpaprofiles` (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbizpaprofile/cbizpaprofile.go:13-14`, `:62-70`), while `isolationprofile` uses `/zpa/mgmtconfig/v1/admin/customers/{customerId}/isolation/profiles` (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/isolationprofile/isolationprofile.go:14-15`, `:52-59`). The Postman collection contains both (`vendor/zscaler-api-specs/oneapi-postman-collection.json:19209`, `:61255`). Which endpoint should be preferred for policy workflows, and whether they can diverge at runtime, is not resolved by static source.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: tenant-side comparison of both endpoints across the same profiles OR vendor API documentation naming the preferred policy-reference source

**2026-06-18 narrowing**: the Automate contract confirms both paths are first-class documented GET operations: `get-all-zpa-profiles` uses `/cbiconfig/cbi/api/customers/{customerId}/zpaprofiles`, while `get-profiles-for-customer` uses `/mgmtconfig/v1/admin/customers/{customerId}/isolation/profiles` (`vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:83389-83401`; `vendor/zscaler-api-specs/automate-zscaler/zpa-api-reference.json:83458-83470`). This closes "is one path merely an SDK artifact?" but not "which should policy workflows prefer?" or "can the two datasets diverge at runtime?"

---

### zbi-03 — Auto-created default profile lifecycle and `isDefault` mutability

*Origin: `references/zbi/api.md` § Open questions*

The help article says default isolation profiles are automatically created for organizations with Zero Trust Browser (`vendor/zscaler-help/what-is-zero-trust-browser.json:32`). SDK/provider models expose default flags such as `defaultProfile` / `isDefault` (`vendor/zscaler-sdk-go/zscaler/zia/services/browser_isolation/browser_isolation_profile.go:25-26`, `vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:30`), but static sources do not establish whether those flags are server-managed only, can be changed through profile CRUD, or how default profile creation is triggered.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: tenant-side profile CRUD test around default flags OR vendor documentation on default-profile lifecycle and mutability

**2026-06-18 narrowing**: the ZIA Automate contract describes `defaultProfile` on `GET /browserIsolation/profiles` as "Zscaler sets this field" (`vendor/zscaler-api-specs/automate-zscaler/zia-api-reference.json:29190-29219`). The ZPA CBI OpenAPI example shows profile and certificate `isDefault` flags in a read response (`vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json:1808`), but does not mark ZPA-side profile `isDefault` as readonly or explain create/update behavior. Treat ZIA-side `defaultProfile` as server-set; ZPA-side lifecycle and mutability still need a tenant test or vendor doc.

---

### zbi-04 — `copyPaste` and `uploadDownload` enum completeness

*Origin: `references/zbi/api.md` § Open questions*

The Go `SecurityControls` struct declares `UploadDownload` and `CopyPaste` as strings (`vendor/zscaler-sdk-go/zscaler/zpa/services/cloudbrowserisolation/cbiprofilecontroller/cbiprofilecontroller.go:80`, `:82`), and Python docstrings show example values such as `all` and `none` (`vendor/zscaler-sdk-python/zscaler/zpa/cbi_profile.py:149`, `:151`, `:273`, `:275`). The complete enum set, especially any directional copy/paste or upload/download values, is not enumerated by the inspected source.

**Status**: partially resolved — last updated 2026-06-18
**Resolves with**: vendor API schema/docs OR tenant-side validation tests for likely directional values

**2026-06-18 narrowing**: the reconstructed ZPA OpenAPI examples corroborate the same observed values: a profile read shows `copyPaste=none` and `uploadDownload=none`, while an update request shows `copyPaste=all` and `uploadDownload=all` (`vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json:1808`; `vendor/zscaler-api-specs/automate-zscaler/openapi/zpa.openapi.json:2572`). These are examples, not a formal enum list, so they confirm `all`/`none` but do not close the question of directional or additional values.

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

The captured help article documents predefined/custom workflows and says admins must map a workflow to incident transaction attributes before it triggers (`vendor/zscaler-help/understanding-workflows-workflow-automation.json:27-43`). The inspected SDK surface exposes DLP incident and customer-audit services only in Python (`vendor/zscaler-sdk-python/zscaler/zwa/zwa_service.py:27-41`) and DLP incident/customer-audit packages in Go (`vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:102-350`, `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:36-47`). The first-pass source sweep did not find SDK, MCP, Postman, Terraform, or Ansible create/update/delete/list operations for workflow templates, custom workflows, or workflow mappings. This is an audit-scoped absence, not proof that no private/future API exists.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider/MCP/Postman source exposing workflow configuration operations, or lab test against documented endpoints

---

### zwa-02 — DLP incident delete semantics

*Origin: `references/zwa/api.md` § Open questions*

The Go SDK exposes `DeleteDLPIncident(ctx, service, dlpIncidentID)` as `DELETE /dlp/v1/incidents/{id}` (`vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:255-270`), and the legacy help capture lists DELETE on `/dlp/v1/incidents/{dlpIncidentId}` (`vendor/zscaler-help/dlp-incidents-workflow-automation-api.json:215-244`). Python's inspected `DLPIncidentsAPI` does not expose a delete method; it exposes close/resolve via `incident_close()` instead (`vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:586-645`). Static source does not explain whether DELETE hard-deletes, archives, requires elevated rights, is tenant-disabled, or differs operationally from closing an incident.

**Status**: open
**Resolves with**: lab test on a disposable incident, vendor documentation for DELETE semantics, or SDK issue/release note explaining parity

---

### zwa-03 — ZWA audit-log retention and streaming

*Origin: `references/zwa/audit-logs.md` § Open questions*

Python and Go expose a pull customer-audit API (`POST /customer/audit` / `/dlp/v1/customer/audit`) with field/time filters (`vendor/zscaler-sdk-python/zscaler/zwa/audit_logs.py:33-135`, `vendor/zscaler-sdk-go/zscaler/zwa/services/customeraudit/customeraudit.go:12-47`). The inspected ZWA-specific sources do not document the retention period, supported module/action value sets, or whether ZWA audit logs can be pushed/streamed to a SIEM rather than polled. Cross-product ZIA/ZPA audit-log behavior should not be imported without a ZWA-specific source.

**Status**: open
**Resolves with**: vendor ZWA audit-log documentation, support confirmation, or tenant read/operator evidence showing retention and any configured streaming destination

---

### zwa-04 — Current-vs-legacy auth boundary

*Origin: `references/zwa/api.md` § Open questions*

Python's general OneAPI client exposes `client.zwa` as `ZWAService` when not in legacy mode and uses `ZSCALER_CLIENT_ID`, `ZSCALER_CLIENT_SECRET` or `ZSCALER_PRIVATE_KEY`, and `ZSCALER_VANITY_DOMAIN` for OAuth-style auth (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:165-184`, `:233-244`, `:271-277`). Python also exposes `LegacyZWAClient`, which uses `key_id`, `key_secret`, and `cloud` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:636-656`; `vendor/zscaler-sdk-python/zscaler/zwa/legacy.py:47-65`). Go ZWA uses API key ID/secret and posts to `/v1/auth/api-key/token` (`vendor/zscaler-sdk-go/zscaler/zwa/v2_config.go:45-49`, `:140-180`; `vendor/zscaler-sdk-go/zscaler/zwa/v2_client.go:245-327`), matching the legacy help capture (`vendor/zscaler-help/legacy-api-authentication-workflow-automation-api.json:8-37`). The exact tenant/product migration boundary between current OneAPI access and legacy API-key access is not established by static source alone.

**Status**: open
**Resolves with**: current vendor migration documentation, tenant lab tests for the same operation through both Python client modes, or SDK maintainer clarification

---

### zwa-05 — Trigger context query-param SDK coverage

*Origin: `references/zwa/api.md` § Open questions*

The legacy help capture documents optional `fetchTriggerContext` on `GET /dlp/v1/incidents/{dlpIncidentId}/triggers`, used to include prefix/suffix trigger context (`vendor/zscaler-help/dlp-incidents-workflow-automation-api.json:1592-1617`). The Python `get_incident_triggers(incident_id)` and Go `GetDLPIncidentTriggers(ctx, service, dlpIncidentID)` signatures expose only the incident ID and no query-param argument (`vendor/zscaler-sdk-python/zscaler/zwa/dlp_incidents.py:192-238`; `vendor/zscaler-sdk-go/zscaler/zwa/services/dlp_incidents/dlp_incidents.go:312-330`). It is unclear whether callers can pass this through another SDK path, whether the SDK omits a still-supported server parameter, or whether the help page is ahead/behind the SDK.

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

The captured SOC Workbench help says "Report Export via API" is a documented capability (`vendor/zscaler-help/soc-what-zscaler-soc-workbench.json:62`), but this refresh did not find a SOC Workbench SDK, Terraform, Ansible, MCP, or Postman implementation that names the endpoint, request schema, authentication scope, or response shape. Treat the API as source-backed at the capability level only until the endpoint-level source is captured.

**Status**: open
**Resolves with**: vendor API documentation or captured help page for "Triggering Report Export Through an API"

---

### unified-01 — Experience Center standalone API surface

*Origin: `references/unified/overview.md` § Open questions*

The captured Experience Center help describes a unified administrative and operations console that consolidates management, configuration, monitoring, shared identity, policy, Copilot, and analytics (`vendor/zscaler-help/unified-what-zscaler-experience-center.json:8-18`). This refresh did not find a separate Experience Center SDK, Terraform, Ansible, MCP, or Postman surface. Static source therefore supports "no separate programmable surface found in this audit" rather than a universal claim that Experience Center can never expose its own API.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing an Experience Center service, or explicit vendor confirmation that automation must use the underlying product APIs

---

### aem-01 — AEM AnySource, report, and API endpoint details

*Origin: `references/aem/overview.md` § Open questions*

The AEM refresh established Help-level data-source and connector scope (`vendor/zscaler-help/aem-what-zscaler-security-operations.json:30-41`, `:43-63`) plus CAASM marketing positioning (`vendor/zscaler-help/asset-exposure-management-caasm-marketing.md:20-59`), but found no product-specific Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface in the audited vendor trees. The exact AnySource upload contract, report-export API, query/configuration API, and whether those are public OneAPI surfaces remain unresolved.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing AEM operations, Help capture for report/export API details, or tenant-side API capture

---

### deception-01 — Deception admin API and ZPA-managed object contract

*Origin: `references/deception/overview.md` § Open questions*

The Deception Help capture says Super admin can manage features including APIs, decoys, and audit logs (`vendor/zscaler-help/what-is-zscaler-deception.json:37-43`) and that Deception can integrate with ZPA for ZTN decoys (`vendor/zscaler-help/what-is-zscaler-deception.json:45-47`). ZPA Help and Terraform source show constraints/guards around Deception-configured ZPA access-policy rules (`vendor/zscaler-help/zpa-access-policy-20260909.json:169-177`, `:185-190`; `vendor/terraform-provider-zpa/zpa/resource_zpa_policy_access_rule_reorder.go:258-295`). The public source set does not identify the Deception admin API endpoints, auth model, audit-log export details, or the full lifecycle/ownership contract for ZPA objects created by Deception.

**Status**: open
**Resolves with**: Deception admin API documentation, tenant-side Deception API capture, vendor confirmation, or deeper Help capture for API/audit-log pages

---

### identity-protection-01 — Identity Protection API, integration surface, and legacy ITDR parity

*Origin: `references/identity-protection/overview.md` § Open questions*

The Identity Protection Help capture establishes SecOps/ITDR architecture, ZTE integration, ZCC-dependent detection paths, and a current-vs-legacy UI note (`vendor/zscaler-help/itdr-what-identity-protection.json:35-56`). The refresh found no product-specific Go SDK, Python SDK, Terraform, Ansible, MCP, or Postman surface in the audited vendor trees. The authoritative API surface, connector configuration API, report/export behavior, and exact parity between current SecOps Identity Protection and legacy ITDR remain unresolved.

**Status**: open
**Resolves with**: vendor API documentation, SDK/provider source exposing Identity Protection operations, current Help capture for legacy/current parity, or tenant-side capture

---

### zero-trust-branch-01 — ZTB Python SDK auth-mode divergence and non-Python coverage

*Origin: `references/zero-trust-branch/overview.md` § Open questions*

The Python SDK exposes `client.ztb` through `oneapi_client.py` (`vendor/zscaler-sdk-python/zscaler/oneapi_client.py:279-285`) and `ztb_service.py` says the service is used via the OneAPI authentication path while legacy helpers are for standalone/token access (`vendor/zscaler-sdk-python/zscaler/ztb/ztb_service.py:37-44`). The same repository README says ZTB authenticates by API key and is available only through `LegacyZTBClient`, with OneAPI/OAuth2 not supported (`vendor/zscaler-sdk-python/README.md:1722-1728`, `:1751-1755`). The refresh also found no Go ZTB product service and no Terraform/Ansible/MCP/Postman ZTB product surface. Confirm the supported auth path and whether non-Python surfaces are absent, private, or pending.

**Status**: open
**Resolves with**: SDK maintainer clarification, live tenant auth test against both paths, vendor API documentation, or updated SDK/provider source

---

### zero-trust-branch-02 — MCP `ztw` product label and ZTB boundary

*Origin: `references/zero-trust-branch/overview.md` § Open questions*

MCP v0.15.0's generated tool catalog labels the `ztw` family "Workload Segmentation" (`vendor/zscaler-mcp-server/docs/guides/supported-tools.md:372-396`; label generation at `vendor/zscaler-mcp-server/src/zscaler_mcp/common/docgen.py:194-205`), while the service module and docsrc call it "Zscaler Cloud & Branch Connector" (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/ztw/__init__.py:1-6`; `vendor/zscaler-mcp-server/docsrc/tools/ztw/index.rst:1-4`). The tools call `client.ztw`; no MCP `ztb` registry family, `/ztb/...` path, or `client.ztb` usage was found. Confirm the canonical `ztw` product label and keep it distinct from the Python SDK's separate ZTB product surface until upstream resolves the naming drift.

**Status**: open
**Resolves with**: MCP maintainer clarification or an upstream catalog/module naming fix

---

### zscaler-cellular-01 — Zscaler Cellular admin and API surface

*Origin: `references/zscaler-cellular/overview.md` § Open questions*

The Cellular Help capture describes Zscaler SIM, Cellular Edge, IP/IMEI/IMSI policy identifiers, and Cellular Admin Portal capabilities (`vendor/zscaler-help/cellular-what-zscaler-cellular.json:8`, `:10-15`, `:26-29`, `:45-67`). The captured Automate contract exposes 36 ZCell operations, the Python SDK exposes `client.zcell` as a OneAPI-only service, and MCP v0.15.0 includes 20 read-only tools across nine toolsets (`vendor/zscaler-api-specs/automate-zscaler/docusaurus-snapshot-compare-summary.md:34`; `vendor/zscaler-sdk-python/zscaler/oneapi_client.py:281-287`; `vendor/zscaler-sdk-python/zscaler/zcell/zcell_service.py:37-103`; `vendor/zscaler-mcp-server/docs/guides/supported-tools.md:489-514`; `vendor/zscaler-mcp-server/docs/guides/toolsets.md:141-153`). MCP still guesses the live token's canonical Cellular `prd` claim from three variants (`vendor/zscaler-mcp-server/src/zscaler_mcp/security/entitlements.py:72-79`). The exact tenant entitlement boundary, live backend acceptance, and ZIA/ZPA policy object mapping for IP/IMEI/IMSI identifiers remain unresolved.

**Status**: partially resolved — last updated 2026-07-16
**Resolves with**: tenant-side API capture, vendor entitlement documentation, or vendor documentation mapping Cellular IP/IMEI/IMSI identifiers to ZIA/ZPA policy objects

---

### zscaler-cellular-02 — MCP violation response shape

*Origin: `references/zscaler-cellular/api.md` § MCP v0.15.0 divergences and test boundary*

The Automate contract declares anomaly-policy `/violations` response `content` as an array of ICCID strings (`vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:4900-5003`). The Python SDK's page cleaner retains only dictionary content items while its method tries to instantiate `AnomalyPolicy` models (`vendor/zscaler-sdk-python/zscaler/oneapi_response.py:260-290`; `vendor/zscaler-sdk-python/zscaler/zcell/anomaly_policy.py:363-430`). MCP v0.15.0 no longer projects those results into policy summaries; it passes through whatever decoded SDK models survive (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/anomaly_policy.py:149-177`). Confirm whether offending ICCIDs are lost in a live response and align the contract and SDK cleaner/model before attributing any remaining loss to MCP.

**Status**: open
**Resolves with**: mocked/live SDK response test using the documented string-array payload, followed by an SDK/MCP fix or corrected API schema

---

### zscaler-cellular-03 — MCP SIM pagination routing

*Origin: `references/zscaler-cellular/api.md` § MCP v0.15.0 divergences and test boundary*

The Automate contract places SIM-search `page`, `size`, `sortBy`, and `sortDir` in query parameters and now documents enums for the sorting inputs (`vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:14484-14565`). MCP exposes page/size but puts them into the POST body and exposes no sorting; the SDK likewise forwards those kwargs as body fields (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/sim_handling.py:125-162`; `vendor/zscaler-sdk-python/zscaler/zcell/sim_handling.py:286-315`). Confirm whether the backend accepts body pagination or silently ignores it; the refreshed query contract does not establish that the body form is accepted.

**Status**: open
**Resolves with**: live/mocked request capture against the ZCell SIM search endpoint or vendor clarification

---

### zscaler-cellular-04 — MCP audit request contract

*Origin: `references/zscaler-cellular/api.md` § MCP v0.15.0 divergences and test boundary*

MCP types audit `object_id` as a string and exposes operation/object/name/visibility/user plus page/size filters (`vendor/zscaler-mcp-server/src/zscaler_mcp/tools/zcell/audit_data_handling.py:31-58`). The Automate contract declares `objectId` as `int64`, additionally exposes entry ID, root-customer, and sorting inputs, and now constrains `sortBy` to the documented audit fields and `sortDir` to `ASC`/`DESC` (`vendor/zscaler-api-specs/automate-zscaler/openapi/zcell.openapi.json:25-135`). Confirm accepted runtime typing and decide whether the omitted filters are intentional narrowing or missing coverage; the documented query enums do not prove that MCP/body pagination or sorting is accepted by the backend.

**Status**: open
**Resolves with**: live request capture or MCP/SDK contract tests aligned to the Automate schema

---

## Resolved entries

See the **Status summary** near the top of this file for the list. Entries stay in their original positions above with `Status: resolved` and the answer inline, so anchor links (`clarifications.md#zia-03-wildcard-tokenization` etc.) resolve regardless of resolution state.
