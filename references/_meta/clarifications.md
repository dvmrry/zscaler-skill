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
7 entries are resolved or clarified, 0 are partially resolved, and 8 are open.
The three exact memberships below are checked against every detailed entry's
explicit `Status`; range notation is inclusive and is expanded by the checker.
Most open entries require lab tests,
tenant reads, operator experience, or vendor confirmation rather than more
public-doc reading.

Entries migrated to the knowledge graph are no longer listed here; they are gaps
with their old ID kept in `former_ids` (resolve with `node scripts/kb.mjs resolve <old-id>`):
`zia-01` → [`zia.url-categories.membership:predefined-vs-custom`](kb:zia.url-categories.membership:predefined-vs-custom); `zia-02` → [`zia.url-categories.membership:same-specificity-collision`](kb:zia.url-categories.membership:same-specificity-collision); `zia-03` → [`zia.url-categories.entry-matching:wildcard-tokenization`](kb:zia.url-categories.entry-matching:wildcard-tokenization); `zia-04` → [`zia.url-filtering.advanced-settings:nrod-lag`](kb:zia.url-filtering.advanced-settings:nrod-lag); `zia-06` → [`zia.cloud-app-control.precedence:cac-disabled-rules`](kb:zia.cloud-app-control.precedence:cac-disabled-rules); `zia-10` → [`zia.cloud-app-control.precedence:default-allow-vs-explicit`](kb:zia.cloud-app-control.precedence:default-allow-vs-explicit); `zia-11` → [`zia.ssl-inspection.pipeline:mixed-forwarding`](kb:zia.ssl-inspection.pipeline:mixed-forwarding); `zia-12` → [`zia.ssl-inspection.pipeline:bypass-and-default-rule`](kb:zia.ssl-inspection.pipeline:bypass-and-default-rule); `zia-14` → [`zia.url-categories.entry-matching:exactly-five-levels`](kb:zia.url-categories.entry-matching:exactly-five-levels); `zia-15` → [`zia.url-categories.entry-matching:console-accepts-asterisk`](kb:zia.url-categories.entry-matching:console-accepts-asterisk); `zia-07` → [`zia.cloud-app-control.risk-profiles:composition`](kb:zia.cloud-app-control.risk-profiles:composition); `zia-09` → [`zia.cloud-app-control.rule-criteria:app-identity`](kb:zia.cloud-app-control.rule-criteria:app-identity); `zia-13` → [`zia.ssl-inspection.pipeline:first-pass-on-domain`](kb:zia.ssl-inspection.pipeline:first-pass-on-domain); `zia-47` → [`zia.dns-control.actions:block-response-code-values`](kb:zia.dns-control.actions:block-response-code-values); `zia-48` → [`zia.dns-control.actions:redirect-ip-binding`](kb:zia.dns-control.actions:redirect-ip-binding); `zia-58` → [`zia.dlp.rule-wire-shape:without-content-inspection-keying`](kb:zia.dlp.rule-wire-shape:without-content-inspection-keying); `zia-59` → [`zia.dns-control.actions:redir-req-gateway`](kb:zia.dns-control.actions:redir-req-gateway); `zia-60` → [`zia.firewall.network-services:type-meanings`](kb:zia.firewall.network-services:type-meanings); `zia-63` → [`zia.sandbox.md5-blocklist:quota-cap`](kb:zia.sandbox.md5-blocklist:quota-cap); `zia-66` → [`zia.ssl-inspection.rules:cap-raisable`](kb:zia.ssl-inspection.rules:cap-raisable); `zia-71` → [`zia.dns-control.api-rules:web-eun-false`](kb:zia.dns-control.api-rules:web-eun-false); `zia-08` → [`zia.tenant-profiles.wire-mechanic:per-app-inspection-detail`](kb:zia.tenant-profiles.wire-mechanic:per-app-inspection-detail); `zia-16` → [`zia.locations.sublocations:cap-2000`](kb:zia.locations.sublocations:cap-2000); `zia-17` → [`zia.locations.sublocations:name-uniqueness-scope`](kb:zia.locations.sublocations:name-uniqueness-scope); `zia-18` → [`zia.locations.sublocations:parent-delete-behavior`](kb:zia.locations.sublocations:parent-delete-behavior); `zia-19` → [`zia.locations.sublocations:reparenting-rules`](kb:zia.locations.sublocations:reparenting-rules); `zia-20` → [`zia.locations.sublocations:depth-limit`](kb:zia.locations.sublocations:depth-limit); `zia-46` → [`zia.locations.group-assignment:tf-dynamic-removal-reason`](kb:zia.locations.group-assignment:tf-dynamic-removal-reason); `zia-56` → [`zia.bandwidth-control.limits:caps-api-enforced`](kb:zia.bandwidth-control.limits:caps-api-enforced); `zia-57` → [`zia.file-type-control.api-shape:filtering-action-dependencies`](kb:zia.file-type-control.api-shape:filtering-action-dependencies); `zia-61` → [`zia.atp.api-surface:tenant-defaults`](kb:zia.atp.api-surface:tenant-defaults); `zia-67` → [`zia.tenant-profiles.microsoft:v1-v2-semantics`](kb:zia.tenant-profiles.microsoft:v1-v2-semantics); `log-04` → [`zia.atp.block-diagnosis:ruletype-values`](kb:zia.atp.block-diagnosis:ruletype-values); `zia-26` → [`zia.rule-labels:audit-log-label-names`](kb:zia.rule-labels:audit-log-label-names); `zia-27` → [`zia.rule-labels.constraints:name-charset`](kb:zia.rule-labels.constraints:name-charset); `zia-28` → [`zia.rule-labels.constraints:name-uniqueness`](kb:zia.rule-labels.constraints:name-uniqueness); `zia-29` → [`zia.rule-labels.constraints:description-max-length`](kb:zia.rule-labels.constraints:description-max-length); `zia-30` → [`zia.rule-labels:duplicate-action`](kb:zia.rule-labels:duplicate-action); `zia-31` → [`zia.rule-labels.rule-types:label-filter-server-support`](kb:zia.rule-labels.rule-types:label-filter-server-support); `zia-32` → [`zia.rule-labels.constraints:tenant-cap`](kb:zia.rule-labels.constraints:tenant-cap); `zia-50` → [`zia.rule-labels.api-surface:rule-type-endpoint-backing`](kb:zia.rule-labels.api-surface:rule-type-endpoint-backing); `zia-69` → [`zia.workload-groups.expressions:runtime-evaluation`](kb:zia.workload-groups.expressions:runtime-evaluation); `zia-55` → [`zia.audit-logs.report-api:pagination`](kb:zia.audit-logs.report-api:pagination); `shared-38` → [`zia.traffic-forwarding.vpn-credentials:psk-live-read`](kb:zia.traffic-forwarding.vpn-credentials:psk-live-read); `zia-39` → [`zia.scim.groups-and-departments:department-no-match`](kb:zia.scim.groups-and-departments:department-no-match); `zia-40` → [`zia.scim.deactivation:session-kill`](kb:zia.scim.deactivation:session-kill); `zia-41` → [`zia.scim.operations:rate-limit`](kb:zia.scim.operations:rate-limit); `zia-42` → [`zia.ad-integration.identity-objects:org-limits`](kb:zia.ad-integration.identity-objects:org-limits); `zia-43` → [`zia.scim.attribute-mapping:per-idp-department-mapping`](kb:zia.scim.attribute-mapping:per-idp-department-mapping); `zia-44` → [`zia.scim.propagation:sync-log-visibility`](kb:zia.scim.propagation:sync-log-visibility); `zia-45` → [`zia.scim.propagation:per-idp-cadence`](kb:zia.scim.propagation:per-idp-cadence); `zia-64` → [`zia.scim.groups-and-departments:department-no-match`](kb:zia.scim.groups-and-departments:department-no-match); `zia-62` → [`zia.private-service-edge.ip-requirements:shared-nat-behavior`](kb:zia.private-service-edge.ip-requirements:shared-nat-behavior); `zia-33` → [`zia.virtual-service-edge.upgrades:cluster-update-sequencing`](kb:zia.virtual-service-edge.upgrades:cluster-update-sequencing); `zia-34` → [`zia.virtual-service-edge.clusters:removal-and-disable-behavior`](kb:zia.virtual-service-edge.clusters:removal-and-disable-behavior); `zia-35` → [`zia.virtual-service-edge.operations:log-identifier`](kb:zia.virtual-service-edge.operations:log-identifier); `zia-36` → [`zia.virtual-service-edge.clusters:cluster-vs-vm-settings`](kb:zia.virtual-service-edge.clusters:cluster-vs-vm-settings); `zia-37` → [`zia.virtual-service-edge.network-requirements:vse-nat-topology`](kb:zia.virtual-service-edge.network-requirements:vse-nat-topology); `zia-38` → [`zia.virtual-service-edge.clusters:public-cloud-cluster-object`](kb:zia.virtual-service-edge.clusters:public-cloud-cluster-object); `zia-21` → [`zia.time-intervals.timezone:dst-handling`](kb:zia.time-intervals.timezone:dst-handling); `zia-22` → [`zia.time-intervals.limits:object-cap`](kb:zia.time-intervals.limits:object-cap); `zia-23` → [`zia.time-intervals.time-windows:terraform-resource-intent`](kb:zia.time-intervals.time-windows:terraform-resource-intent); `zia-24` → [`zia.time-intervals.evaluation:midnight-spanning`](kb:zia.time-intervals.evaluation:midnight-spanning); `zia-25` → [`zia.time-intervals.time-windows:predefined-intervals`](kb:zia.time-intervals.time-windows:predefined-intervals); `zia-49` → [`zia.cloud-app-control.actions:all-vs-available-differs`](kb:zia.cloud-app-control.actions:all-vs-available-differs); `zia-51` → [`zia.api.sdk-coverage:parity-drift`](kb:zia.api.sdk-coverage:parity-drift); `zia-52` → [`zia.api.legacy-ips-signature-wire:import-wire-unconfirmed`](kb:zia.api.legacy-ips-signature-wire:import-wire-unconfirmed); `zia-53` → [`zia.cloud-app-control.actions:per-tuple-validation-contract`](kb:zia.cloud-app-control.actions:per-tuple-validation-contract); `zia-54` → [`zia.cloud-app-control.api-surface:python-risk-profile-runtime`](kb:zia.cloud-app-control.api-surface:python-risk-profile-runtime); `zia-68` → [`zia.terraform.early-access:early-access-eligibility`](kb:zia.terraform.early-access:early-access-eligibility); `zia-72` → [`zia.url-filtering.advanced-settings:creative-commons-backend-effect`](kb:zia.url-filtering.advanced-settings:creative-commons-backend-effect); `log-01` → [`zia.logs.nss-feed-format:format-field-presence`](kb:zia.logs.nss-feed-format:format-field-presence); `log-02` → [`zia.logs.nss-feed-format:vm-conversion-omits`](kb:zia.logs.nss-feed-format:vm-conversion-omits); `log-03` → [`zia.logs.nss-feed-format:multi-feed-timezone`](kb:zia.logs.nss-feed-format:multi-feed-timezone); `log-05` → [`zia.logs.web-rule-attribution:action-values-precedence`](kb:zia.logs.web-rule-attribution:action-values-precedence); `log-06` → [`zia.logs.web-field-semantics:reason-structure`](kb:zia.logs.web-field-semantics:reason-structure); `log-07` → [`zia.logs.web-field-semantics:url-category-fields`](kb:zia.logs.web-field-semantics:url-category-fields); `log-08` → [`zia.logs.web-field-semantics:riskscore-lineage`](kb:zia.logs.web-field-semantics:riskscore-lineage); `log-09` → [`zia.logs.web-field-semantics:byte-counters`](kb:zia.logs.web-field-semantics:byte-counters); `log-10` → [`zia.logs.web-field-semantics:prompt-scope`](kb:zia.logs.web-field-semantics:prompt-scope); `log-11` → [`zia.logs.firewall-records:aggregate-counters`](kb:zia.logs.firewall-records:aggregate-counters); `log-12` → [`zia.logs.firewall-records:action-precedence`](kb:zia.logs.firewall-records:action-precedence); `log-13` → [`zia.logs.firewall-records:nwapp-vs-nwsvc`](kb:zia.logs.firewall-records:nwapp-vs-nwsvc); `log-14` → [`zia.logs.dns-outcome:action-enum-open`](kb:zia.logs.dns-outcome:action-enum-open); `log-15` → [`zia.logs.dns-outcome:res-sentinels-open`](kb:zia.logs.dns-outcome:res-sentinels-open); `log-16` → [`zia.logs.dns-gateway-fields:dnsgw-flags-semantics-open`](kb:zia.logs.dns-gateway-fields:dnsgw-flags-semantics-open); `log-17` → [`zia.casb.insights-logs:record-category-discriminator`](kb:zia.casb.insights-logs:record-category-discriminator); `zpa-02` → [`zpa.app-segments.matching:granularity-ranking`](kb:zpa.app-segments.matching:granularity-ranking); `zpa-03` → [`zpa.app-segments.multimatch:config-conflict`](kb:zpa.app-segments.multimatch:config-conflict); `zpa-04` → [`zpa.app-segments.matching:same-specificity-tie`](kb:zpa.app-segments.matching:same-specificity-tie); `zpa-05` → [`zpa.app-segments.matching:port-mismatch-bypass`](kb:zpa.app-segments.matching:port-mismatch-bypass); `zpa-06` → [`zpa.policy.actions:require-approval-equals-conditional-access`](kb:zpa.policy.actions:require-approval-equals-conditional-access); `zpa-07` → [`zpa.policy.access-rule-order:deception-rule-ordering-rationale`](kb:zpa.policy.access-rule-order:deception-rule-ordering-rationale); `zpa-08` → [`zpa.policy.evaluation-order:wildcard-matches-bare-domain`](kb:zpa.policy.evaluation-order:wildcard-matches-bare-domain); `zpa-11` → [`zpa.machine-groups.api-surface:create-endpoint-absence`](kb:zpa.machine-groups.api-surface:create-endpoint-absence); `zpa-12` → [`zpa.machine-groups.definition:no-group-level-criteria`](kb:zpa.machine-groups.definition:no-group-level-criteria); `zpa-13` → [`zpa.machine-groups.policy-use:api-without-client-type`](kb:zpa.machine-groups.policy-use:api-without-client-type); `zpa-14` → [`zpa.machine-groups.definition:capacity-other-limits`](kb:zpa.machine-groups.definition:capacity-other-limits); `zpa-15` → [`zpa.machine-groups`](kb:zpa.machine-groups); `zpa-20` → [`zpa.app-connectors.health:status-pending-unverified`](kb:zpa.app-connectors.health:status-pending-unverified); `zpa-27` → [`zpa.app-connectors.selection:latency-probe-cadence`](kb:zpa.app-connectors.selection:latency-probe-cadence); `zpa-28` → [`zpa.app-connectors.enrollment:certificate-validity-window`](kb:zpa.app-connectors.enrollment:certificate-validity-window); `zpa-29` → [`zpa.app-connectors.deployment:max-connectors-per-group`](kb:zpa.app-connectors.deployment:max-connectors-per-group); `zpa-30` → [`zpa.app-connectors.provisioning-key-tooling:group-delete-removes-keys`](kb:zpa.app-connectors.provisioning-key-tooling:group-delete-removes-keys); `zpa-31` → [`zpa.app-connectors.provisioning-key-tooling:api-requires-cert-for-connector-key`](kb:zpa.app-connectors.provisioning-key-tooling:api-requires-cert-for-connector-key); `zpa-32` → [`zpa.audit-logs.streaming:field-schema`](kb:zpa.audit-logs.streaming:field-schema); `zpa-33` → [`zpa.audit-logs.streaming:siem-policy-purpose`](kb:zpa.audit-logs.streaming:siem-policy-purpose); `zpa-34` → [`zpa.audit-logs.streaming:microtenant-scoping`](kb:zpa.audit-logs.streaming:microtenant-scoping); `zpa-35` → [`zpa.audit-logs.streaming:audit-filter-api`](kb:zpa.audit-logs.streaming:audit-filter-api); `zpa-36` → [`zpa.browser-access.backend-options:field-setting-mapping`](kb:zpa.browser-access.backend-options:field-setting-mapping); `zpa-40` → [`zpa.log-receivers.log-types:auth-log-1id-label`](kb:zpa.log-receivers.log-types:auth-log-1id-label); `zpa-41` → [`zpa.log-receivers.log-types:format-only-codes`](kb:zpa.log-receivers.log-types:format-only-codes); `zpa-42` → [`zpa.machine-tunnels.requirements:enable-for-all`](kb:zpa.machine-tunnels.requirements:enable-for-all); `zpa-43` → [`zpa.machine-tunnels.requirements:session-lifecycle`](kb:zpa.machine-tunnels.requirements:session-lifecycle); `zpa-44` → [`zpa.machine-tunnels.provisioning-keys:macos-mdm-effect`](kb:zpa.machine-tunnels.provisioning-keys:macos-mdm-effect); `zpa-45` → [`zpa.machine-tunnels.provisioning-keys:separate-key-type`](kb:zpa.machine-tunnels.provisioning-keys:separate-key-type); `zpa-46` → [`zpa.policy.conditions:chrome-operand-form-api-enforcement`](kb:zpa.policy.conditions:chrome-operand-form-api-enforcement); `zpa-47` → [`zpa.private-service-edges.deployment:session-limits`](kb:zpa.private-service-edges.deployment:session-limits); `zpa-49` → [`zpa.private-service-edges.deployment:release-images`](kb:zpa.private-service-edges.deployment:release-images); `zpa-50` → [`zpa.private-service-edges.what-it-is:pse-hardware-sales`](kb:zpa.private-service-edges.what-it-is:pse-hardware-sales); `zpa-51` → [`zpa.private-service-edges.private-cloud-controller:controller-role`](kb:zpa.private-service-edges.private-cloud-controller:controller-role); `zpa-52` → [`zpa.private-service-edges.private-cloud-controller:restart-semantics`](kb:zpa.private-service-edges.private-cloud-controller:restart-semantics); `zpa-53` → [`zpa.private-service-edges.api-surface:schedule-default-cadence`](kb:zpa.private-service-edges.api-surface:schedule-default-cadence); `zpa-54` → [`zpa.private-service-edges.client-selection:location-propagation`](kb:zpa.private-service-edges.client-selection:location-propagation); `zpa-55` → [`zpa.private-service-edges.enrollment:oauth2-prerequisites`](kb:zpa.private-service-edges.enrollment:oauth2-prerequisites); `zpa-56` → [`zpa.private-service-edges.deployment:max-per-group`](kb:zpa.private-service-edges.deployment:max-per-group); `zpa-57` → [`zpa.pra:absent-from-base-zpa`](kb:zpa.pra:absent-from-base-zpa); `zpa-58` → [`zpa.public-service-edges.what-it-is:safe-mode`](kb:zpa.public-service-edges.what-it-is:safe-mode); `zpa-59` → [`zpa.public-service-edges.what-it-is:ca-reconnect-semantics`](kb:zpa.public-service-edges.what-it-is:ca-reconnect-semantics); `zpa-60` → [`zpa.public-service-edges.api-visibility:upgrade-priority`](kb:zpa.public-service-edges.api-visibility:upgrade-priority); `zpa-61` → [`zpa.saml-attributes.registration:zpa-61-limit`](kb:zpa.saml-attributes.registration:zpa-61-limit); `zpa-62` → [`zpa.saml-attributes.api-surface:zpa-62-user-attribute-delta`](kb:zpa.saml-attributes.api-surface:zpa-62-user-attribute-delta); `zpa-63` → [`zpa.scim.group-lifecycle:zpa-63-deleted-group-in-rule`](kb:zpa.scim.group-lifecycle:zpa-63-deleted-group-in-rule); `zpa-64` → [`zpa.scim.api-surface:zpa-64-internal-id`](kb:zpa.scim.api-surface:zpa-64-internal-id); `zpa-65` → [`zpa.scim.policy-criteria:zpa-65-setting-fallback`](kb:zpa.scim.policy-criteria:zpa-65-setting-fallback); `zpa-66` → [`zpa.scim.policy-criteria:zpa-66-case-sensitivity`](kb:zpa.scim.policy-criteria:zpa-66-case-sensitivity); `zpa-67` → [`zpa.scim.provisioning-timing:zpa-67-membership-resolution`](kb:zpa.scim.provisioning-timing:zpa-67-membership-resolution); `zpa-68` → [`zpa.scim.policy-criteria:zpa-68-isolation-scim`](kb:zpa.scim.policy-criteria:zpa-68-isolation-scim); `zpa-69` → [`zpa.segment-groups.api-surface:v2-update-differences`](kb:zpa.segment-groups.api-surface:v2-update-differences); `zpa-70` → [`zpa.segment-groups.api-surface:skip-detailed-app-info-effect`](kb:zpa.segment-groups.api-surface:skip-detailed-app-info-effect); `zpa-71` → [`zpa.segment-groups.api-surface:tcp-keep-alive-enabled-effect`](kb:zpa.segment-groups.api-surface:tcp-keep-alive-enabled-effect); `zpa-72` → [`zpa.segment-groups.api-surface:config-space-meaning`](kb:zpa.segment-groups.api-surface:config-space-meaning); `zpa-78` → [`zpa.trusted-networks.policy-operand:rhs-false-semantics`](kb:zpa.trusted-networks.policy-operand:rhs-false-semantics); `zpa-79` → [`zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks`](kb:zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks); `zpa-80` → [`zpa.trusted-networks.zcc-relationship:signal-path`](kb:zpa.trusted-networks.zcc-relationship:signal-path); `zpa-81` → [`zpa.trusted-networks.service-edge-groups:off-network-fallback`](kb:zpa.trusted-networks.service-edge-groups:off-network-fallback); `zpa-83` → [`zpa.app-segments.api-fields:hbr-sticky-guest-semantics`](kb:zpa.app-segments.api-fields:hbr-sticky-guest-semantics); `log-18` → [`zpa.logs.microsegmentation-flow:enforcement-triple`](kb:zpa.logs.microsegmentation-flow:enforcement-triple); `log-19` → [`zpa.logs.user-status:record-granularity`](kb:zpa.logs.user-status:record-granularity); `log-20` → [`zpa.logs.browser-access:connection-status-values`](kb:zpa.logs.browser-access:connection-status-values); `zpa-01` → [`zpa.logs.user-activity:multi-segment-lss`](kb:zpa.logs.user-activity:multi-segment-lss); `zpa-16` → [`zpa.logs.user-activity:active-cadence`](kb:zpa.logs.user-activity:active-cadence); `zpa-17` → [`zpa.logs.user-activity:byte-counter-reset`](kb:zpa.logs.user-activity:byte-counter-reset); `zpa-18` → [`zpa.logs.user-activity:timing-overlap`](kb:zpa.logs.user-activity:timing-overlap); `zpa-19` → [`zpa.logs.user-activity:server-setup-scope`](kb:zpa.logs.user-activity:server-setup-scope); `zpa-21` → [`zpa.pra.app-segments:contract-application-protocol-enum`](kb:zpa.pra.app-segments:contract-application-protocol-enum); `zpa-22` → [`zpa.api.service-edges-wire:restart-path-canonical`](kb:zpa.api.service-edges-wire:restart-path-canonical); `zpa-23` → [`zpa.api.pra-wire:credential-secrets-on-read`](kb:zpa.api.pra-wire:credential-secrets-on-read); `zpa-24` → [`zpa.api.app-segments-wire:connection-security-values`](kb:zpa.api.app-segments-wire:connection-security-values); `zpa-25` → [`zpa.api.certificates-wire:ba-certificate-put-valid`](kb:zpa.api.certificates-wire:ba-certificate-put-valid); `zpa-26` → [`zpa.api.lss-wire:browser-isolation-accepted`](kb:zpa.api.lss-wire:browser-isolation-accepted); `zpa-37` → [`zpa.api.legacy-endpoints:stepup-write-verbs`](kb:zpa.api.legacy-endpoints:stepup-write-verbs); `zpa-38` → [`zpa.api.base-paths:legacy-host-accepts-zpa-prefix`](kb:zpa.api.base-paths:legacy-host-accepts-zpa-prefix); `zpa-39` → [`zpa.api.legacy-endpoints:assistant-schedule-served`](kb:zpa.api.legacy-endpoints:assistant-schedule-served); `zpa-76` → [`zpa.log-receivers.filtering:tf-other-types-rejected`](kb:zpa.log-receivers.filtering:tf-other-types-rejected); `zpa-77` → [`zpa.terraform.resource-constraints:tag-group-in-policy-conditions`](kb:zpa.terraform.resource-constraints:tag-group-in-policy-conditions); `zpa-82` → [`zpa.pra.tooling:approval-identity-windows`](kb:zpa.pra.tooling:approval-identity-windows); `zpa-84` → [`zpa.api.pagination:mcp-manual-pages`](kb:zpa.api.pagination:mcp-manual-pages); `zcc-01` → [`zcc.api.forwarding-profile-wire:condition-type-values`](kb:zcc.api.forwarding-profile-wire:condition-type-values); `zcc-02` → [`zcc.api.forwarding-profile-wire:network-type-values`](kb:zcc.api.forwarding-profile-wire:network-type-values); `zcc-03` → [`zcc.api.forwarding-profile-wire:action-type-values`](kb:zcc.api.forwarding-profile-wire:action-type-values); `zcc-04` → [`zcc.api.forwarding-profile-wire:primary-transport-values`](kb:zcc.api.forwarding-profile-wire:primary-transport-values); `zcc-05` → [`zcc.forwarding-profiles.internet-actions:system-proxy-vs-action`](kb:zcc.forwarding-profiles.internet-actions:system-proxy-vs-action); `zcc-06` → [`zcc.trusted-networks.object:condition-type-values`](kb:zcc.trusted-networks.object:condition-type-values); `zcc-07` → [`zcc.app-profiles.selection:default-policy`](kb:zcc.app-profiles.selection:default-policy); `zcc-08` → [`zcc.api.rate-limits:body-shape-429`](kb:zcc.api.rate-limits:body-shape-429); `zcc-09` → [`zcc.api.rate-limits:download-cap-scope`](kb:zcc.api.rate-limits:download-cap-scope); `zcc-10` → [`zcc.api.rate-limits:remaining-on-success`](kb:zcc.api.rate-limits:remaining-on-success); `zcc-11` → [`zcc.api.devices-wire:udid-batch-cap`](kb:zcc.api.devices-wire:udid-batch-cap); `zcc-12` → [`zcc.api.rate-limits:oneapi-retry-headers`](kb:zcc.api.rate-limits:oneapi-retry-headers); `zcc-13` → [`zcc.api.rate-limits:bucket-scope`](kb:zcc.api.rate-limits:bucket-scope); `zcc-14` → [`zcc.install.macos-deployment:preference-domain`](kb:zcc.install.macos-deployment:preference-domain); `zcc-15` → [`zcc.install.macos-extensions:profile-timing`](kb:zcc.install.macos-extensions:profile-timing); `zcc-16` → [`zcc.install.macos-deployment:uninstall-script-path`](kb:zcc.install.macos-deployment:uninstall-script-path); `zcc-17` → [`zcc.install.macos-deployment:launchtray-zero-extension`](kb:zcc.install.macos-deployment:launchtray-zero-extension); `zcc-18` → [`zcc.install.macos-deployment:app-store-build`](kb:zcc.install.macos-deployment:app-store-build); `zcc-19` → [`zcc.install.macos-extensions:team-and-bundle-ids`](kb:zcc.install.macos-extensions:team-and-bundle-ids); `zcc-20` → [`zcc.install.macos-extensions:full-disk-access-scope`](kb:zcc.install.macos-extensions:full-disk-access-scope); `zcc-21` → [`zcc.install.macos-deployment:minimum-macos`](kb:zcc.install.macos-deployment:minimum-macos); `zcc-22` → [`zcc.install.macos-deployment:update-channel-key`](kb:zcc.install.macos-deployment:update-channel-key); `zcc-23` → [`zcc.install.macos-deployment:launchtray-zero-extension`](kb:zcc.install.macos-deployment:launchtray-zero-extension); `zcc-24` → [`zcc.notifications.templates:template-schema`](kb:zcc.notifications.templates:template-schema); `zcc-25` → [`zcc.notifications.templates:per-profile-reauth-interval`](kb:zcc.notifications.templates:per-profile-reauth-interval); `zcc-26` → [`zcc.acceptable-use:localization`](kb:zcc.acceptable-use:localization); `zcc-27` → [`zcc.notifications.templates:posture-failure-notification`](kb:zcc.notifications.templates:posture-failure-notification); `zcc-28` → [`zcc.notifications:cert-trust-ux`](kb:zcc.notifications:cert-trust-ux); `zcc-29` → [`zcc.notifications:delivery-logging`](kb:zcc.notifications:delivery-logging); `zcc-30` → [`zcc.notifications.localization:fallback-language`](kb:zcc.notifications.localization:fallback-language); `zcc-31` → [`zcc.notifications.framework:platform-support`](kb:zcc.notifications.framework:platform-support); `zcc-32` → [`zcc.notifications.framework:platform-support`](kb:zcc.notifications.framework:platform-support); `zcc-33` → [`zcc.api.company-wire:set-company-info-go`](kb:zcc.api.company-wire:set-company-info-go); `zcc-34` → [`zcc.support-options:toggle-defaults`](kb:zcc.support-options:toggle-defaults); `zcc-35` → [`zcc.api.web-policy-wire:ui-capture-password-keys`](kb:zcc.api.web-policy-wire:ui-capture-password-keys); `zcc-36` → [`zcc.support-options:bundle-contents`](kb:zcc.support-options:bundle-contents); `zcc-37` → [`zcc.support-options:bundle-contents`](kb:zcc.support-options:bundle-contents); `zcc-38` → [`zcc.support-options:submission-audit`](kb:zcc.support-options:submission-audit); `zcc-39` → [`zcc.firefox.integration:linux`](kb:zcc.firefox.integration:linux); `zcc-40` → [`zcc.firefox.proxy-and-trust:enterprise-roots`](kb:zcc.firefox.proxy-and-trust:enterprise-roots); `zcc-41` → [`zcc.firefox.integration:preference-keys`](kb:zcc.firefox.integration:preference-keys); `zcc-42` → [`zcc.firefox.integration:upgrade-persistence`](kb:zcc.firefox.integration:upgrade-persistence); `zcc-43` → [`zcc.firefox.integration:version-scope`](kb:zcc.firefox.integration:version-scope); `zcc-44` → [`zcc.acceptable-use:redisplay-on-change`](kb:zcc.acceptable-use:redisplay-on-change); `zcc-45` → [`zcc.acceptable-use:decline-and-variants`](kb:zcc.acceptable-use:decline-and-variants); `zcc-46` → [`zcc.acceptable-use:external-links`](kb:zcc.acceptable-use:external-links); `zcc-47` → [`zcc.acceptable-use:decline-and-variants`](kb:zcc.acceptable-use:decline-and-variants); `zcc-48` → [`zcc.acceptable-use:decline-and-variants`](kb:zcc.acceptable-use:decline-and-variants); `zcc-49` → [`zcc.acceptable-use:min-agent-version`](kb:zcc.acceptable-use:min-agent-version); `zcc-50` → [`zcc.acceptable-use:notification-templates-mode`](kb:zcc.acceptable-use:notification-templates-mode); `zcc-51` → [`zcc.acceptable-use:acceptance-logging`](kb:zcc.acceptable-use:acceptance-logging); `zcc-52` → [`zcc.acceptable-use:localization`](kb:zcc.acceptable-use:localization); `zcc-53` → [`zcc.acceptable-use:message-size`](kb:zcc.acceptable-use:message-size); `zcc-54` → [`zcc.acceptable-use:non-interactive-sessions`](kb:zcc.acceptable-use:non-interactive-sessions); `zcc-55` → [`zcc.acceptable-use:config-propagation`](kb:zcc.acceptable-use:config-propagation); `zcc-56` → [`zcc.logging.log-modes:default-mode`](kb:zcc.logging.log-modes:default-mode); `zcc-57` → [`zcc.logging.log-modes:level-vs-mode`](kb:zcc.logging.log-modes:level-vs-mode); `zcc-58` → [`zcc.app-profiles.logging:log-file-size`](kb:zcc.app-profiles.logging:log-file-size); `zcc-59` → [`zcc.web-privacy.collection:unmapped-keys`](kb:zcc.web-privacy.collection:unmapped-keys); `zcc-60` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-61` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-62` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-63` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-64` → [`zcc.logging.user-access:ios-log-access`](kb:zcc.logging.user-access:ios-log-access); `zcc-65` → [`zcc.support-options:bundle-contents`](kb:zcc.support-options:bundle-contents); `zcc-66` → [`zcc.logs.client-log:file-format`](kb:zcc.logs.client-log:file-format); `zcc-67` → [`zcc.logs.client-log:transaction-records`](kb:zcc.logs.client-log:transaction-records); `zcc-68` → [`zcc.logging.collection:log-locations`](kb:zcc.logging.collection:log-locations); `zcc-69` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-70` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-71` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-72` → [`zcc.logging.collection:fetch-logs-permission`](kb:zcc.logging.collection:fetch-logs-permission); `zcc-73` → [`zcc.api.conventions:status-500-label`](kb:zcc.api.conventions:status-500-label); `zcc-74` → [`zcc.troubleshooting:generic-legacy-codes`](kb:zcc.troubleshooting:generic-legacy-codes); `zcc-75` → [`zcc.install.macos-extensions:unapproved-extension`](kb:zcc.install.macos-extensions:unapproved-extension); `zcc-76` → [`zcc.passwords-and-otp.otp:otp-expiry`](kb:zcc.passwords-and-otp.otp:otp-expiry); `zcc-77` → [`zcc.api.web-policy-wire:top-vs-nested-precedence`](kb:zcc.api.web-policy-wire:top-vs-nested-precedence); `zcc-78` → [`zcc.api.web-policy-wire:devicetype-precedence`](kb:zcc.api.web-policy-wire:devicetype-precedence); `zcc-79` → [`zcc.api.web-policy-wire:selected-required`](kb:zcc.api.web-policy-wire:selected-required); `zcc-80` → [`zcc.api.trusted-networks-wire:v1-v2-coexistence`](kb:zcc.api.trusted-networks-wire:v1-v2-coexistence); `zcc-81` → [`zcc.devices.record-fields:zd-vs-zdp`](kb:zcc.devices.record-fields:zd-vs-zdp); `zcc-82` → [`zcc.devices.record-fields:registration-state-vs-state`](kb:zcc.devices.record-fields:registration-state-vs-state); `zcc-83` → [`zcc.devices.record-fields:state-wire-type`](kb:zcc.devices.record-fields:state-wire-type); `zcc-84` → [`zcc.forwarding-profiles:unified-tunnel-semantics`](kb:zcc.forwarding-profiles:unified-tunnel-semantics); `zcc-85` → [`zcc.forwarding-profiles.fail-open:precedence-detail`](kb:zcc.forwarding-profiles.fail-open:precedence-detail); `zcc-86` → [`zcc.sdk-python.return-shapes:web-privacy-get-none`](kb:zcc.sdk-python.return-shapes:web-privacy-get-none); `zcc-87` → [`zcc.sdk-python.client-configuration:oneapi-429-headers`](kb:zcc.sdk-python.client-configuration:oneapi-429-headers); `zcc-88` → [`zcc.api.web-policy-wire:mac-block-read-key`](kb:zcc.api.web-policy-wire:mac-block-read-key); `zcc-89` → [`zcc.api.web-policy-wire:scope-keys-on-read`](kb:zcc.api.web-policy-wire:scope-keys-on-read); `zcc-90` → [`zcc.api.web-policy-wire:devicetype-string-on-read`](kb:zcc.api.web-policy-wire:devicetype-string-on-read); `zcc-91` → [`zcc.support-options:toggle-defaults`](kb:zcc.support-options:toggle-defaults); `zcc-92` → [`zcc.passwords-and-otp.password-api:surface-authority`](kb:zcc.passwords-and-otp.password-api:surface-authority); `zcc-93` → [`zcc.passwords-and-otp.app-profile-passwords:macos-password-key-asymmetry`](kb:zcc.passwords-and-otp.app-profile-passwords:macos-password-key-asymmetry); `zcc-94` → [`zcc.passwords-and-otp.app-profile-passwords:ui-gate-per-os`](kb:zcc.passwords-and-otp.app-profile-passwords:ui-gate-per-os); `zcc-95` → [`zcc.trusted-networks.detection:transition-handling`](kb:zcc.trusted-networks.detection:transition-handling); `zcc-96` → [`zcc.trusted-networks.detection:multiple-networks`](kb:zcc.trusted-networks.detection:multiple-networks); `zcc-97` → [`zcc.forwarding-profiles.assignment:orphan-reference`](kb:zcc.forwarding-profiles.assignment:orphan-reference); `zcc-98` → [`zcc.api.web-policy-wire:join-on-read`](kb:zcc.api.web-policy-wire:join-on-read); `zcc-99` → [`zcc.app-profiles.advanced-settings:drop-quic`](kb:zcc.app-profiles.advanced-settings:drop-quic); `zcc-100` → [`zcc.forwarding-profiles.internet-actions:ipv6-flags`](kb:zcc.forwarding-profiles.internet-actions:ipv6-flags); `zcc-101` → [`zcc.z-tunnel.transport:session-internals`](kb:zcc.z-tunnel.transport:session-internals); `log-21` → [`zcc.logging.log-modes:level-vs-mode`](kb:zcc.logging.log-modes:level-vs-mode).; `cloud-connector-01` → [`cloud-connector.workload-discovery.regions:region-status-representation`](kb:cloud-connector.workload-discovery.regions:region-status-representation); `cloud-connector-02` → [`cloud-connector.workload-discovery:cloudformation-body`](kb:cloud-connector.workload-discovery:cloudformation-body); `cloud-connector-03` → [`cloud-connector.source-ip-groups:size-and-count-limits`](kb:cloud-connector.source-ip-groups:size-and-count-limits); `cloud-connector-04` → [`cloud-connector.source-ip-groups:ipv6-entries`](kb:cloud-connector.source-ip-groups:ipv6-entries); `cloud-connector-05` → [`cloud-connector.source-ip-groups.rule-use:exclusion-applicability`](kb:cloud-connector.source-ip-groups.rule-use:exclusion-applicability); `cloud-connector-06` → [`cloud-connector.source-ip-groups:zia-origin-editability`](kb:cloud-connector.source-ip-groups:zia-origin-editability); `cloud-connector-07` → [`cloud-connector.overview.zero-trust-gateways:no-infrastructure`](kb:cloud-connector.overview.zero-trust-gateways:no-infrastructure); `cloud-connector-08` → [`cloud-connector.overview.gateway-failover:fail-open-egress`](kb:cloud-connector.overview.gateway-failover:fail-open-egress); `cloud-connector-09` → [`cloud-connector.forwarding.methods:method-semantics`](kb:cloud-connector.forwarding.methods:method-semantics); `cloud-connector-10` → [`cloud-connector.forwarding.rule-order:rank-and-rule-limit`](kb:cloud-connector.forwarding.rule-order:rank-and-rule-limit); `cloud-connector-11` → [`cloud-connector.dns.policies:response-overwrite`](kb:cloud-connector.dns.policies:response-overwrite); `cloud-connector-12` → [`cloud-connector.dns.policies:criteria-tunnel-doh`](kb:cloud-connector.dns.policies:criteria-tunnel-doh); `cloud-connector-13` → [`cloud-connector.dns.gateways:failover-default-ipv6`](kb:cloud-connector.dns.gateways:failover-default-ipv6); `cloud-connector-14` → [`cloud-connector.terraform.gateways:dns-gateway-type-semantics`](kb:cloud-connector.terraform.gateways:dns-gateway-type-semantics); `cloud-connector-15` → [`cloud-connector.terraform.gateways:subcloud-backend`](kb:cloud-connector.terraform.gateways:subcloud-backend); `cloud-connector-16` → [`cloud-connector.terraform.provider-config:legacy-mode-rule-resources`](kb:cloud-connector.terraform.provider-config:legacy-mode-rule-resources); `cloud-connector-17` → [`cloud-connector.terraform.forwarding-rules:local-switch-wire-value`](kb:cloud-connector.terraform.forwarding-rules:local-switch-wire-value); `cloud-connector-18` → [`cloud-connector.api.partner-integrations-wire:azure-gcp-rest-family`](kb:cloud-connector.api.partner-integrations-wire:azure-gcp-rest-family); `cloud-connector-19` → [`cloud-connector.terraform.provider-config:fedramp-live-acceptance`](kb:cloud-connector.terraform.provider-config:fedramp-live-acceptance); `cloud-connector-20` → [`cloud-connector.nss-va.servers:active-active`](kb:cloud-connector.nss-va.servers:active-active); `cloud-connector-21` → [`cloud-connector.insights.analytics:byte-count-parity`](kb:cloud-connector.insights.analytics:byte-count-parity); `cloud-connector-22` → [`cloud-connector.regions.deployment:standard-cc-regions`](kb:cloud-connector.regions.deployment:standard-cc-regions); `cloud-connector-23` → [`cloud-connector.api.rules-wire:local-switch-acceptance`](kb:cloud-connector.api.rules-wire:local-switch-acceptance); `cloud-connector-24` → [`cloud-connector.forwarding.log-and-control:limit-enforcement`](kb:cloud-connector.forwarding.log-and-control:limit-enforcement); `cloud-connector-25` → [`cloud-connector.api.conventions:default-response-semantics`](kb:cloud-connector.api.conventions:default-response-semantics); `cloud-connector-26` → [`cloud-connector.terraform.forwarding-rules:rule-labels`](kb:cloud-connector.terraform.forwarding-rules:rule-labels); `cloud-connector-27` → [`cloud-connector.regions.zero-trust-gateways:eu-central-2`](kb:cloud-connector.regions.zero-trust-gateways:eu-central-2); `cloud-connector-28` → [`cloud-connector.gcp.mig-autoscaling:resource-sync-default`](kb:cloud-connector.gcp.mig-autoscaling:resource-sync-default); `cloud-connector-29` → [`cloud-connector.overview.zero-trust-gateways:azure-availability`](kb:cloud-connector.overview.zero-trust-gateways:azure-availability); `log-22` → [`cloud-connector.insights.connector-status:vm-status-codes`](kb:cloud-connector.insights.connector-status:vm-status-codes); `shared-06` → [`shared.policy-evaluation:zpa-disabled-rule`](kb:shared.policy-evaluation:zpa-disabled-rule); `shared-07` → [`shared.multi-cluster:flow-stickiness`](kb:shared.multi-cluster:flow-stickiness); `shared-08` → [`shared.multi-cluster:auth-state`](kb:shared.multi-cluster:auth-state); `shared-09` → [`shared.multi-cluster:vip-failure-detection`](kb:shared.multi-cluster:vip-failure-detection); `shared-10` → [`shared.multi-cluster:ztunnel2`](kb:shared.multi-cluster:ztunnel2); `shared-11` → [`shared.multi-cluster:other-clouds`](kb:shared.multi-cluster:other-clouds); `shared-12` → [`shared.m365.troubleshooting:ca-evaluation-timing`](kb:shared.m365.troubleshooting:ca-evaluation-timing); `shared-13` → [`shared.m365.troubleshooting:cae-interaction`](kb:shared.m365.troubleshooting:cae-interaction); `shared-14` → [`shared.m365.troubleshooting:connectors-down`](kb:shared.m365.troubleshooting:connectors-down); `shared-15` → [`shared.m365.troubleshooting:egress-address-drift`](kb:shared.m365.troubleshooting:egress-address-drift); `shared-16` → [`shared.m365.troubleshooting:named-location-cap`](kb:shared.m365.troubleshooting:named-location-cap); `shared-17` → [`shared.cloud-architecture.service-edges:selection-algorithm`](kb:shared.cloud-architecture.service-edges:selection-algorithm); `shared-18` → [`shared.cloud-architecture.service-edges:auth-timeline`](kb:shared.cloud-architecture.service-edges:auth-timeline); `shared-19` → [`shared.policy-evaluation:modern-http`](kb:shared.policy-evaluation:modern-http); `shared-20` → [`shared.cloud-architecture.failure-domains:source-ip-change-mid-session`](kb:shared.cloud-architecture.failure-domains:source-ip-change-mid-session); `shared-21` → [`shared.cloud-architecture.service-edges:workload-identity`](kb:shared.cloud-architecture.service-edges:workload-identity); `shared-22` → [`shared.log-correlation.zia-zpa-join:cross-dc-sessions`](kb:shared.log-correlation.zia-zpa-join:cross-dc-sessions); `shared-23` → [`zia.traffic-forwarding.pac:delivery-methods`](kb:zia.traffic-forwarding.pac:delivery-methods); `shared-24` → [`zia.traffic-forwarding.pac:client-cache`](kb:zia.traffic-forwarding.pac:client-cache); `shared-25` → [`zia.traffic-forwarding.pac:auth-challenge-behavior`](kb:zia.traffic-forwarding.pac:auth-challenge-behavior); `shared-26` → [`shared.pac-files.coverage:non-browser-clients`](kb:shared.pac-files.coverage:non-browser-clients); `shared-27` → [`shared.pac-files.coverage:ipv6`](kb:shared.pac-files.coverage:ipv6); `shared-28` → [`zia.scim.sdk-coverage:python-none`](kb:zia.scim.sdk-coverage:python-none); `shared-29` → [`shared.analytics.graphql-errors-and-limits:rate-limits`](kb:shared.analytics.graphql-errors-and-limits:rate-limits); `shared-30` → [`shared.analytics.graphql:production-introspection`](kb:shared.analytics.graphql:production-introspection); `shared-31` → [`shared.analytics.graphql-queries:pagination`](kb:shared.analytics.graphql-queries:pagination); `shared-32` → [`shared.analytics.graphql-queries:obfuscated-source`](kb:shared.analytics.graphql-queries:obfuscated-source); `shared-33` → [`shared.analytics.graphql-queries:iot-time-range`](kb:shared.analytics.graphql-queries:iot-time-range); `shared-34` → [`shared.analytics.graphql:zdx-linkage`](kb:shared.analytics.graphql:zdx-linkage); `shared-35` → [`shared.analytics.graphql-queries:mutations`](kb:shared.analytics.graphql-queries:mutations); `shared-36` → [`shared.analytics.graphql-queries:bytes-unit`](kb:shared.analytics.graphql-queries:bytes-unit); `shared-37` → [`shared.audit-logs:trace-id-propagation`](kb:shared.audit-logs:trace-id-propagation); `shared-39` → [`shared.secret-surfaces.revealed:zpa-shared-model-secrets`](kb:shared.secret-surfaces.revealed:zpa-shared-model-secrets); `shared-40` → [`shared.mcp-server.tool-inventory:prd-alias-set`](kb:shared.mcp-server.tool-inventory:prd-alias-set); `aem-01` → [`aem.secops-platform:reporting-api-contract`](kb:aem.secops-platform:reporting-api-contract); `ai-security-01` → [`ai-security.ai-guard.runtime-api:direction-aliases`](kb:ai-security.ai-guard.runtime-api:direction-aliases); `ai-security-02` → [`ai-security.ai-guard.runtime-api:execute-without-policy-id`](kb:ai-security.ai-guard.runtime-api:execute-without-policy-id); `ai-security-03` → [`ai-security.ai-guard.detectors:taxonomy-source`](kb:ai-security.ai-guard.detectors:taxonomy-source); `ai-security-04` → [`ai-security.ai-guard.admin-api:other-clients`](kb:ai-security.ai-guard.admin-api:other-clients); `ai-security-06` → [`ai-security.ai-guard.runtime-api:host-selection`](kb:ai-security.ai-guard.runtime-api:host-selection); `ai-security-07` → [`ai-security.ai-guard.admin-api:provider-labels`](kb:ai-security.ai-guard.admin-api:provider-labels); `ai-security-08` → [`ai-security.ai-guard.admin-api:live-acceptance`](kb:ai-security.ai-guard.admin-api:live-acceptance); `ai-security-09` → [`ai-security.ai-guard.runtime-api:throttle-handling`](kb:ai-security.ai-guard.runtime-api:throttle-handling); `breach-predictor-01` → [`breach-predictor.overview:api-surface`](kb:breach-predictor.overview:api-surface); `business-insights-01` → [`business-insights.api:api-coverage`](kb:business-insights.api:api-coverage); `deception-01` → [`deception.overview:admin-api`](kb:deception.overview:admin-api); `dspm-01` → [`dspm.overview:api-and-scanner-contract`](kb:dspm.overview:api-and-scanner-contract); `easm-01` → [`easm.findings:scan-type-values`](kb:easm.findings:scan-type-values); `easm-02` → [`easm.findings:risk-value-formats`](kb:easm.findings:risk-value-formats); `identity-protection-01` → [`identity-protection.overview:api-and-legacy-parity`](kb:identity-protection.overview:api-and-legacy-parity); `risk360-01` → [`risk360.overview:api-surface`](kb:risk360.overview:api-surface); `risk360-02` → [`risk360.scoring:factor-methodology`](kb:risk360.scoring:factor-methodology); `soc-workbench-01` → [`aem.secops-platform:reporting-api-contract`](kb:aem.secops-platform:reporting-api-contract); `unified-01` → [`unified.overview:api-surface`](kb:unified.overview:api-surface); `uvm-01` → [`uvm.anysource:upload-file-api`](kb:uvm.anysource:upload-file-api); `zbi-01` → [`zbi.policy:manual-isolate-ssl`](kb:zbi.policy:manual-isolate-ssl); `zbi-02` → [`zbi.api:profile-list-choice`](kb:zbi.api:profile-list-choice); `zbi-03` → [`zbi.isolation-profiles:default-lifecycle`](kb:zbi.isolation-profiles:default-lifecycle); `zbi-04` → [`zbi.api:control-value-sets`](kb:zbi.api:control-value-sets); `zbi-05` → [`zbi.isolation-profiles:delete-referenced`](kb:zbi.isolation-profiles:delete-referenced); `zbi-06` → [`zbi.isolation-profiles:update-propagation`](kb:zbi.isolation-profiles:update-propagation); `zdx-01` → [`zdx.diagnostics.start-request:probe-id-portability`](kb:zdx.diagnostics.start-request:probe-id-portability); `zdx-02` → [`zdx.diagnostics.start-request:concurrent-sessions`](kb:zdx.diagnostics.start-request:concurrent-sessions); `zdx-03` → [`zdx.api.hosts-and-auth:token-host-per-tenant`](kb:zdx.api.hosts-and-auth:token-host-per-tenant); `zdx-04` → [`zdx.api.rate-limits:header-family-per-host`](kb:zdx.api.rate-limits:header-family-per-host); `zdx-05` → [`zdx.api.rate-limits:tier-vs-client-limiter`](kb:zdx.api.rate-limits:tier-vs-client-limiter); `zdx-06` → [`zdx.sdk-go.service-defects:device-app-shape-live`](kb:zdx.sdk-go.service-defects:device-app-shape-live); `zdx-07` → [`zdx.sdk-go.service-defects:events-key-live`](kb:zdx.sdk-go.service-defects:events-key-live); `zdx-08` → [`zdx.sdk-python.response-models:call-quality-shape`](kb:zdx.sdk-python.response-models:call-quality-shape); `zdx-09` → [`zdx.administration:time-filter-semantics`](kb:zdx.administration:time-filter-semantics); `zdx-10` → [`zdx.administration:q-vs-search`](kb:zdx.administration:q-vs-search); `zdx-11` → [`zdx.applications:metric-name-values`](kb:zdx.applications:metric-name-values); `zdx-12` → [`zdx.applications:inactive-app-listing`](kb:zdx.applications:inactive-app-listing); `zdx-13` → [`zdx.applications:config-api`](kb:zdx.applications:config-api); `zdx-14` → [`zdx.applications:auto-detection`](kb:zdx.applications:auto-detection); `zdx-15` → [`zdx.cloud-architecture:ca-topology`](kb:zdx.cloud-architecture:ca-topology); `zdx-16` → [`zdx.score.calculation:region-definition`](kb:zdx.score.calculation:region-definition); `zdx-17` → [`zdx.cloud-architecture:data-retention-residency`](kb:zdx.cloud-architecture:data-retention-residency); `zdx-18` → [`zdx.cloud-architecture:tpg-failover`](kb:zdx.cloud-architecture:tpg-failover); `zdx-19` → [`zdx.cloud-architecture:zcc-buffering`](kb:zdx.cloud-architecture:zcc-buffering); `zdx-20` → [`zdx.probes:cloud-path-service-edge`](kb:zdx.probes:cloud-path-service-edge); `zdx-21` → [`zdx.cloud-architecture:call-quality-data-flow`](kb:zdx.cloud-architecture:call-quality-data-flow); `zdx-22` → [`zdx.cloud-architecture:adx-isolation`](kb:zdx.cloud-architecture:adx-isolation); `zdx-23` → [`zdx.devices:wifi-field-population`](kb:zdx.devices:wifi-field-population); `zdx-24` → [`zdx.devices.health-and-events:health-category-list`](kb:zdx.devices.health-and-events:health-category-list); `zdx-25` → [`zdx.devices:os-build`](kb:zdx.devices:os-build); `zdx-26` → [`zdx.devices.geolocation:hierarchy-traversal`](kb:zdx.devices.geolocation:hierarchy-traversal); `zdx-27` → [`zdx.devices.health-and-events:event-categories`](kb:zdx.devices.health-and-events:event-categories); `zdx-28` → [`zdx.devices.call-quality:cqm-scope`](kb:zdx.devices.call-quality:cqm-scope); `zdx-29` → [`zdx.devices:device-groups`](kb:zdx.devices:device-groups); `zdx-30` → [`zdx.diagnostics.session-status:probe-cadence-during-session`](kb:zdx.diagnostics.session-status:probe-cadence-during-session); `zdx-31` → [`zdx.alerts:evaluation-cadence`](kb:zdx.alerts:evaluation-cadence); `zdx-32` → [`zdx.diagnostics.start-request:session-name-key`](kb:zdx.diagnostics.start-request:session-name-key); `zdx-33` → [`zdx.diagnostics.session-records:session-length-key`](kb:zdx.diagnostics.session-records:session-length-key); `zdx-34` → [`zdx.api.conventions:look-back-limit`](kb:zdx.api.conventions:look-back-limit); `zdx-35` → [`zdx.alerts.snapshot:obfuscation-transmission`](kb:zdx.alerts.snapshot:obfuscation-transmission); `zdx-36` → [`zdx.score.calculation:pft-availability-weighting`](kb:zdx.score.calculation:pft-availability-weighting); `zdx-37` → [`zdx.score.calculation:zero-value-handling`](kb:zdx.score.calculation:zero-value-handling); `zdx-38` → [`zdx.score.calculation:metrics-in-score`](kb:zdx.score.calculation:metrics-in-score); `zdx-39` → [`zdx.score.calculation:new-entity-lag`](kb:zdx.score.calculation:new-entity-lag); `zdx-40` → [`zdx.score.calculation:device-vs-user`](kb:zdx.score.calculation:device-vs-user); `zdx-41` → [`zdx.probes:result-retention`](kb:zdx.probes:result-retention); `zdx-42` → [`zdx.probes:adaptive-mode`](kb:zdx.probes:adaptive-mode); `zdx-43` → [`zdx.sdk-python.request-shaping:inventory-time-range`](kb:zdx.sdk-python.request-shaping:inventory-time-range); `zdx-44` → [`zdx.alerts.snapshot:snapshot-path-live`](kb:zdx.alerts.snapshot:snapshot-path-live); `zero-trust-branch-01` → [`zero-trust-branch.api:auth-mode`](kb:zero-trust-branch.api:auth-mode); `zero-trust-branch-02` → [`zero-trust-branch.api:mcp-ztw-label`](kb:zero-trust-branch.api:mcp-ztw-label); `zid-01` → [`zidentity.admin-rbac.permissions:levels`](kb:zidentity.admin-rbac.permissions:levels); `zid-02` → [`zidentity.admin-rbac:product-scope`](kb:zidentity.admin-rbac:product-scope); `zid-03` → [`zidentity.admin-rbac:role-api`](kb:zidentity.admin-rbac:role-api); `zid-04` → [`zidentity.admin-rbac:assignment-audit`](kb:zidentity.admin-rbac:assignment-audit); `zid-05` → [`zidentity.entitlements:scope-meaning`](kb:zidentity.entitlements:scope-meaning); `zid-06` → [`zidentity.entitlements:two-kinds`](kb:zidentity.entitlements:two-kinds); `zid-07` → [`zidentity.entitlements:service-shape`](kb:zidentity.entitlements:service-shape); `zid-08` → [`zidentity.entitlements:by-source`](kb:zidentity.entitlements:by-source); `zid-09` → [`zidentity.entitlements:admin-shape`](kb:zidentity.entitlements:admin-shape); `zid-10` → [`zidentity.entitlements:roles-from-products`](kb:zidentity.entitlements:roles-from-products); `zid-11` → [`zidentity.api-clients:lifetime-unit-on-wire`](kb:zidentity.api-clients:lifetime-unit-on-wire); `zid-12` → [`zidentity.api:no-token-or-policy-paths`](kb:zidentity.api:no-token-or-policy-paths); `zid-13` → [`zidentity.api-clients.secrets:expires-at-range`](kb:zidentity.api-clients.secrets:expires-at-range); `zid-14` → [`zidentity.api-clients:jwks-body-unobserved`](kb:zidentity.api-clients:jwks-body-unobserved); `zid-15` → [`zidentity.api:legacy-go-route`](kb:zidentity.api:legacy-go-route); `zid-16` → [`zidentity.api:legacy-go-route`](kb:zidentity.api:legacy-go-route); `zid-17` → [`zidentity.groups:dual-flag`](kb:zidentity.groups:dual-flag); `zid-18` → [`zidentity.groups:dynamic-manual-add`](kb:zidentity.groups:dynamic-manual-add); `zid-19` → [`zidentity.groups:bulk-add-duplicates`](kb:zidentity.groups:bulk-add-duplicates); `zid-20` → [`zidentity.groups:scim-group-mutation`](kb:zidentity.groups:scim-group-mutation); `zid-21` → [`zidentity.groups:source-values`](kb:zidentity.groups:source-values); `zid-22` → [`zidentity.groups:no-status-flag`](kb:zidentity.groups:no-status-flag); `zid-23` → [`zidentity.resource-servers:empty-service-scopes`](kb:zidentity.resource-servers:empty-service-scopes); `zid-24` → [`zidentity.resource-servers:default-api-behavior`](kb:zidentity.resource-servers:default-api-behavior); `zid-25` → [`zidentity.resource-servers:enumerability`](kb:zidentity.resource-servers:enumerability); `zid-27` → [`shared.secret-surfaces.withheld:zid-full-only-on-create`](kb:shared.secret-surfaces.withheld:zid-full-only-on-create); `zid-28` → [`zidentity.step-up.levels:per-product`](kb:zidentity.step-up.levels:per-product); `zid-29` → [`zidentity.step-up:scim-users`](kb:zidentity.step-up:scim-users); `zid-30` → [`zidentity.step-up.levels:message-localization`](kb:zidentity.step-up.levels:message-localization); `zid-31` → [`zidentity.step-up:elevation-logging`](kb:zidentity.step-up:elevation-logging); `zid-32` → [`zidentity.users:caller-id`](kb:zidentity.users:caller-id); `zid-33` → [`zidentity.api-clients.access-tokens:revoked-states`](kb:zidentity.api-clients.access-tokens:revoked-states); `zid-34` → [`zidentity.api-clients.access-policy:purpose`](kb:zidentity.api-clients.access-policy:purpose); `zid-35` → [`zidentity.admin-rbac.permissions:modules`](kb:zidentity.admin-rbac.permissions:modules); `zid-36` → [`zidentity.sdk-go:user-action-paths`](kb:zidentity.sdk-go:user-action-paths); `zms-01` → [`zms.api:fetch-all-server`](kb:zms.api:fetch-all-server); `zscaler-cellular-01` → [`zscaler-cellular.overview:entitlement-and-policy-mapping`](kb:zscaler-cellular.overview:entitlement-and-policy-mapping); `zscaler-cellular-02` → [`zscaler-cellular.api.wire-notes:violation-shape`](kb:zscaler-cellular.api.wire-notes:violation-shape); `zscaler-cellular-03` → [`zscaler-cellular.api.wire-notes:sim-search-paging`](kb:zscaler-cellular.api.wire-notes:sim-search-paging); `zscaler-cellular-04` → [`zscaler-cellular.mcp:audit-request`](kb:zscaler-cellular.mcp:audit-request); `zwa-01` → [`zwa.workflows:workflow-api`](kb:zwa.workflows:workflow-api); `zwa-02` → [`zwa.api.incidents-wire:delete-semantics`](kb:zwa.api.incidents-wire:delete-semantics); `zwa-03` → [`zwa.audit-logs:retention-and-streaming`](kb:zwa.audit-logs:retention-and-streaming); `zwa-04` → [`zwa.api:auth-boundary`](kb:zwa.api:auth-boundary); `zwa-05` → [`zwa.api.incidents-wire:trigger-context`](kb:zwa.api.incidents-wire:trigger-context)

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

### Partially resolved

| ID | Title | What's still open |
|---|---|---|

### Open

- **zia**: `zia-65`, `zia-70`
- **zpa**: `zpa-09`–`zpa-10`, `zpa-73`–`zpa-75`
- **zid**: `zid-26`

### Refresh history

The vendor-MCP scrape (2026-06-14) added these open behavior questions — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zia-47`](kb:zia.dns-control.actions:block-response-code-values) | DNS Control `block_response_code` accepted-value set | lab test / tenant read |
| [`zia-48`](kb:zia.dns-control.actions:redirect-ip-binding) | DNS Control `redirect_ip` action-binding (all `REDIR_*` vs `REDIR_RES` only) | lab test |
| [`zia-49`](kb:zia.cloud-app-control.actions:all-vs-available-differs) | CAC per-app action validity (which actions a given app accepts) | code read completed; live completeness test remains |
| [`zpa-20`](kb:zpa.app-connectors.health:status-pending-unverified) | Whether `ZPN_STATUS_PENDING` is a real App Connector runtime status | tenant read / lab test |
| [`zcc-76`](kb:zcc.passwords-and-otp.otp:otp-expiry) | Whether ZCC one-time passwords expire server-side (TTL) | lab test / zscaler doc not yet read |
| [`zdx-01`](kb:zdx.diagnostics.start-request:probe-id-portability) | ZDX probe-ID non-portability — server behavior on a cross-pair probe ID | lab test |
| [`zdx-02`](kb:zdx.diagnostics.start-request:concurrent-sessions) | ZDX concurrent deeptrace session limits per tenant / per device | lab test / zscaler doc not yet read |
| [`zms-01`](kb:zms.api:fetch-all-server) | Whether ZMS `fetchAll` exists server-side beyond `policyRules` | SDK re-check / lab test |
| [`easm-01`](kb:easm.findings:scan-type-values) | EASM finding `scan_type` allowed-value set | tenant read / zscaler doc not yet read |
| [`easm-02`](kb:easm.findings:risk-value-formats) | EASM finding risk-field semantics (`risk_level` / `cisa_likelihood` / `epss_likelihood`) | tenant read / zscaler doc not yet read |

The 2026-06-16 ZWA refresh registered these open Workflow Automation behavior/source questions — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zwa-01`](kb:zwa.workflows:workflow-api) | Workflow configuration programmability | vendor API documentation / SDK-provider source / lab test |
| [`zwa-02`](kb:zwa.api.incidents-wire:delete-semantics) | DLP incident delete semantics | lab test / vendor documentation |
| [`zwa-03`](kb:zwa.audit-logs:retention-and-streaming) | ZWA audit-log retention and streaming | vendor documentation / support ticket / tenant read |
| [`zwa-04`](kb:zwa.api:auth-boundary) | Current-vs-legacy auth boundary | vendor documentation / lab test |
| [`zwa-05`](kb:zwa.api.incidents-wire:trigger-context) | Trigger context query-param SDK coverage | SDK source update / lab test |

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
| [`zdx-03`](kb:zdx.api.hosts-and-auth:token-host-per-tenant) | Which ZDX host (`api.zdxcloud.net` vs `api.zsapi.net`) a given tenant authenticates against | lab test / zscaler doc not yet read |
| [`zdx-04`](kb:zdx.api.rate-limits:header-family-per-host) | Whether each ZDX host emits the rate-limit header family its source expects | lab test / support ticket |
| [`zdx-05`](kb:zdx.api.rate-limits:tier-vs-client-limiter) | Whether the server license-tier rate table reconciles with the Go client's flat limiter | zscaler doc not yet read / support ticket |
| [`zdx-06`](kb:zdx.sdk-go.service-defects:device-app-shape-live) | `get_device_app` live response shape (timeseries vs single score) | lab test / zscaler doc not yet read |
| [`zdx-07`](kb:zdx.sdk-go.service-defects:events-key-live) | `DeviceEvents` live response key (`instances` vs `events`) | lab test / zscaler doc not yet read |
| [`zdx-08`](kb:zdx.sdk-python.response-models:call-quality-shape) | `CallQualityMetrics.metrics` live element shape | lab test / zscaler doc not yet read |
| [`zdx-09`](kb:zdx.administration:time-filter-semantics) | Time-filter semantics on department/location org lists | lab test / zscaler doc not yet read |
| [`zdx-10`](kb:zdx.administration:q-vs-search) | `Q` vs `Search` matching behavior on `GetLocationsFilters` | lab test / zscaler doc not yet read |
| [`zdx-11`](kb:zdx.applications:metric-name-values) | Exhaustive `metric_name` value set for app metrics | zscaler doc not yet read / lab test |
| [`zdx-12`](kb:zdx.applications:inactive-app-listing) | Whether the app list returns apps with no recent probe data | tenant read / zscaler doc not yet read |
| [`zdx-13`](kb:zdx.applications:config-api) | Which probes are attached to a given application ID | zscaler doc not yet read / operator experience |
| [`zdx-14`](kb:zdx.applications:auto-detection) | Whether ZDX auto-discovers apps or requires manual config | zscaler doc not yet read / operator experience |
| [`zdx-15`](kb:zdx.cloud-architecture:ca-topology) | ZDX Central Authority topology (active-passive vs active-active) | zscaler doc not yet read / support ticket |
| [`zdx-16`](kb:zdx.score.calculation:region-definition) | Region boundary definition + same-region peer weighting function | zscaler doc not yet read / lab test |
| [`zdx-17`](kb:zdx.cloud-architecture:data-retention-residency) | ZDX data retention period, purge, and data-residency controls | zscaler doc not yet read / support ticket |
| [`zdx-18`](kb:zdx.cloud-architecture:tpg-failover) | TPG geo-distribution, SLA, and failover behavior | zscaler doc not yet read / support ticket |
| [`zdx-19`](kb:zdx.cloud-architecture:zcc-buffering) | ZCC on-device metric buffering when the TPG is unreachable | zscaler doc not yet read / lab test |
| [`zdx-20`](kb:zdx.probes:cloud-path-service-edge) | Whether Cloud Path probe routing through Service Edges is mandatory/optional | zscaler doc not yet read / lab test |
| [`zdx-21`](kb:zdx.cloud-architecture:call-quality-data-flow) | Call Quality Monitoring polling frequency, latency, failure modes | zscaler doc not yet read / support ticket |
| [`zdx-22`](kb:zdx.cloud-architecture:adx-isolation) | ADX-layer tenant isolation mechanism | zscaler doc not yet read / support ticket |
| [`zdx-23`](kb:zdx.devices:wifi-field-population) | Wi-Fi field availability in the device API response | lab test / zscaler doc not yet read |
| [`zdx-24`](kb:zdx.devices.health-and-events:health-category-list) | Exhaustive device health-metric category set | zscaler doc not yet read / lab test |
| [`zdx-25`](kb:zdx.devices:os-build) | Whether `os_build` is present in the device wire response | lab test / zscaler doc not yet read |
| [`zdx-26`](kb:zdx.devices.geolocation:hierarchy-traversal) | Device geolocation hierarchy traversal model | zscaler doc not yet read / lab test |
| [`zdx-27`](kb:zdx.devices.health-and-events:event-categories) | Whether device events span categories beyond Zscaler/Hardware/Software/Network | lab test / zscaler doc not yet read |
| [`zdx-28`](kb:zdx.devices.call-quality:cqm-scope) | Which apps populate call-quality-metrics and which metric labels appear | lab test / zscaler doc not yet read |
| [`zdx-29`](kb:zdx.devices:device-groups) | Whether ZDX supports device grouping / cohorts | zscaler doc not yet read / operator experience |
| [`zdx-30`](kb:zdx.diagnostics.session-status:probe-cadence-during-session) | Per-probe cadence during a Diagnostics Session | zscaler doc not yet read / lab test |
| [`zdx-31`](kb:zdx.alerts:evaluation-cadence) | Alert rule-evaluation interval | zscaler doc not yet read / lab test |
| [`zdx-32`](kb:zdx.diagnostics.start-request:session-name-key) | Deeptrace session-name wire field (`name` vs `session_name`) | lab test / zscaler doc not yet read |
| [`zdx-33`](kb:zdx.diagnostics.session-records:session-length-key) | `session_length` request-vs-response key divergence | lab test / zscaler doc not yet read |
| [`zdx-34`](kb:zdx.api.conventions:look-back-limit) | Maximum probe look-back window and probe-ID expiry | lab test / zscaler doc not yet read |
| [`zdx-35`](kb:zdx.alerts.snapshot:obfuscation-transmission) | Whether the Python `share_snapshot` wires `obfuscation` to the API | code read / lab test |
| [`zdx-36`](kb:zdx.score.calculation:pft-availability-weighting) | Numerical PFT-vs-Availability weighting in the ZDX Score | zscaler doc not yet read / lab test |
| [`zdx-37`](kb:zdx.score.calculation:zero-value-handling) | Zero/null handling in the lowest-value-within-hour rollup | zscaler doc not yet read / lab test |
| [`zdx-38`](kb:zdx.score.calculation:metrics-in-score) | Which retrievable metrics actually feed the composite score | zscaler doc not yet read / lab test |
| [`zdx-39`](kb:zdx.score.calculation:new-entity-lag) | Score-appearance lag for new users/devices | zscaler doc not yet read / operator experience |
| [`zdx-40`](kb:zdx.score.calculation:device-vs-user) | Whether score is per (user, device) or rolled up per user | zscaler doc not yet read / lab test |
| [`zdx-41`](kb:zdx.probes:result-retention) | Probe-result retention period and aging granularity | zscaler doc not yet read / tenant read |
| [`zdx-42`](kb:zdx.probes:adaptive-mode) | Whether Adaptive Mode keeps scores comparable across cadences | zscaler doc not yet read / lab test |
| [`zdx-43`](kb:zdx.sdk-python.request-shaping:inventory-time-range) | Whether the inventory endpoint honors the time-range filter server-side | lab test / zscaler doc not yet read |
| [`zdx-44`](kb:zdx.alerts.snapshot:snapshot-path-live) | Snapshot endpoint base path in the Automate contract | live API trace / vendor spec |

The ZIdentity refresh (2026-06-15) registered these open behavior questions from `references/zidentity/*.md` — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`zid-01`](kb:zidentity.admin-rbac.permissions:levels) | Admin permission-level enum (Restricted Full / Restrictive View vs Full / View Only / Restricted / None) | zscaler doc not yet read / tenant read |
| [`zid-02`](kb:zidentity.admin-rbac:product-scope) | ZIdentity role to per-product (ZIA/ZPA) scope inheritance | tenant read / zscaler doc not yet read |
| [`zid-03`](kb:zidentity.admin-rbac:role-api) | Role-management APIs absent from the SDK surface | zscaler doc not yet read / live API trace |
| [`zid-04`](kb:zidentity.admin-rbac:assignment-audit) | Admin role-assignment audit trail | zscaler doc not yet read / live API trace |
| [`zid-05`](kb:zidentity.entitlements:scope-meaning) | Entitlement `scope` field semantics and value enum (`Global` / `Limited` / `AllResources`) | vendor documentation / tenant-side check |
| [`zid-06`](kb:zidentity.entitlements:two-kinds) | Service vs administrative entitlements: when to use which | vendor documentation / operator experience |
| [`zid-07`](kb:zidentity.entitlements:service-shape) | `get_service_entitlement` return shape for multi-service users | lab test |
| [`zid-08`](kb:zidentity.entitlements:by-source) | Entitlement API behavior by user IdP source (SCIM vs internal) | tenant-side check |
| [`zid-09`](kb:zidentity.entitlements:admin-shape) | Scope forward-compatibility (single object vs list) | vendor API spec / changelog review |
| [`zid-10`](kb:zidentity.entitlements:roles-from-products) | Entitlement role-name enum completeness | vendor documentation / live API enumeration |
| [`zid-11`](kb:zidentity.api-clients:lifetime-unit-on-wire) | `access_token_life_time` field semantics (TTL vs active-flag docstring contradiction) | lab test / vendor documentation |
| [`zid-12`](kb:zidentity.api:no-token-or-policy-paths) | Token revocation via SDK / API and propagation window | zscaler doc not yet read / lab test |
| [`zid-13`](kb:zidentity.api-clients.secrets:expires-at-range) | `add_api_client_secret` `expires_at` behavior (omitted / past / range) | lab test |
| [`zid-14`](kb:zidentity.api-clients:jwks-body-unobserved) | JWKS `authType` request body unobserved in vendored sources | tenant read / zscaler doc not yet read |
| [`zid-15`](kb:zidentity.api:legacy-go-route) | Bare `/admin/api/v1` prefix acceptance on the `api.zsapi.net` host | live API trace |
| [`zid-16`](kb:zidentity.api:legacy-go-route) | Which wire host a live tenant actually serves | live API trace |
| [`zid-17`](kb:zidentity.groups:dual-flag) | Group dual-flag semantics (`isDynamicGroup` vs `dynamicGroup`) | API spec review / lab test |
| [`zid-18`](kb:zidentity.groups:dynamic-manual-add) | Dynamic-group membership mutation behavior | lab test |
| [`zid-19`](kb:zidentity.groups:bulk-add-duplicates) | User deduplication in bulk add | lab test |
| [`zid-20`](kb:zidentity.groups:scim-group-mutation) | SCIM-sourced group mutation semantics | lab test / vendor documentation |
| [`zid-21`](kb:zidentity.groups:source-values) | Group `source` value enum completeness | vendor documentation / live API enumeration |
| [`zid-22`](kb:zidentity.groups:no-status-flag) | Group enabled/disabled flag on the wire | tenant read / vendor documentation |
| [`zid-23`](kb:zidentity.resource-servers:empty-service-scopes) | Empty `serviceScopes` array semantics | tenant-side check / vendor documentation |
| [`zid-24`](kb:zidentity.resource-servers:default-api-behavior) | `defaultApi` flag behavior | vendor documentation / lab test |
| [`zid-25`](kb:zidentity.resource-servers:enumerability) | Resource-server enumerability (hidden internal entries) | tenant-side check / vendor documentation |
| [`zid-26`](#zid-26-zidentity-snapshot-writer-output-shape) | ZIdentity snapshot writer output shape (`.records[]` vs `.[0].records[]`) | design decision |
| [`zid-27`](kb:shared.secret-surfaces.withheld:zid-full-only-on-create) | Secrets snapshot file layout | design decision |
| [`zid-28`](kb:zidentity.step-up.levels:per-product) | Authentication levels: per-product or global only | zscaler doc not yet read / tenant-side check |
| [`zid-29`](kb:zidentity.step-up:scim-users) | Step-up for SCIM users without a mapped external IdP identity | lab test / zscaler doc not yet read |
| [`zid-30`](kb:zidentity.step-up.levels:message-localization) | Step-up "message to user" localization | zscaler doc not yet read / tenant-side check |
| [`zid-31`](kb:zidentity.step-up:elevation-logging) | Where step-up elevation is logged (ZIA Transaction / ZPA LSS) | lab test / zscaler doc not yet read |
| [`zid-32`](kb:zidentity.users:caller-id) | Omitting `id` on user create | lab test / API spec review |
| [`zid-33`](kb:zidentity.api-clients.access-tokens:revoked-states) | About / Revoking Access Tokens articles uncaptured | zscaler doc not yet read / capture |
| [`zid-34`](kb:zidentity.api-clients.access-policy:purpose) | API Client Access Policy article uncaptured | zscaler doc not yet read / capture |
| [`zid-35`](kb:zidentity.admin-rbac.permissions:modules) | Admin Roles & Permissions module × level matrix uncaptured | zscaler doc not yet read / capture |
| [`zid-36`](kb:zidentity.sdk-go:user-action-paths) | ZIdentity user-action path-template encoding | live API trace / vendor spec |

Partial / SDK-mined (resolved via code read or help-doc capture; full lab confirmation pending): `zcc-01`, `zcc-02`, `zcc-03`, `zcc-04`, `zcc-05`, `zcc-06`, `zcc-07`, **`log-04`** (field name + illustrative values confirmed via `web-log-schema.md`; full enum of `ruletype` / `reason` values still needs a tenant export). All six ZCC enum clarifications had their **datatype** (int vs string) resolved by the Go SDK cross-check on 2026-04-24; the integer-to-meaning mapping remains open for `zcc-01` through `zcc-04` and `zcc-06`.

`shared-17`, `shared-18`, `shared-19` — partially resolved by 2026-05-06 doc sweep (refined further the same day). Existing-doc backing now covers: Service Edge re-evaluation triggers + **subcloud override mechanics fully resolved** via `node scripts/kb.mjs resolve shared.subclouds`; ZIA auth-frequency + surrogate-IP TTL fields and dependency rules + **ZIdentity step-up timing fully resolved** as synchronous via `vendor/zscaler-help/understanding-step-up-authentication.json`; QUIC handling with ZTunnel-mode interaction, HTTP/2 enable toggle + Bandwidth Control fallback, WebSocket DLP Copilot-only carveout. The remaining sub-questions narrowed substantially: selection-signal weighting and DC-exclusion mechanics (shared-17), surrogate IP clock anchor + auth-source decision tree + trusted-network-transition behavior (shared-18), HTTP/2 per-stream re-evaluation + WebSocket non-DLP inspection coverage + gRPC/SSE/chunked behavior (shared-19).

The Cloud & Branch Connector (ZTW) deep-dive refresh (2026-06-15) added these open behavior questions — each links to its detailed entry below:

| ID | Title | Resolves with |
|---|---|---|
| [`cloud-connector-01`](kb:cloud-connector.workload-discovery.regions:region-status-representation) | Per-region `status` representation (boolean vs four console strings) | code read / lab test |
| [`cloud-connector-02`](kb:cloud-connector.workload-discovery:cloudformation-body) | AWS workload-discovery CloudFormation body (EventBridge / IAM / SQS) | zscaler doc not yet read / operator experience |
| [`cloud-connector-03`](kb:cloud-connector.source-ip-groups:size-and-count-limits) | Source IP group member + per-tenant count limits | support ticket / lab test |
| [`cloud-connector-04`](kb:cloud-connector.source-ip-groups:ipv6-entries) | IPv6 entries in `ztc_ip_source_groups` vs separate IPv6 group object | lab test / code read |
| [`cloud-connector-05`](kb:cloud-connector.source-ip-groups.rule-use:exclusion-applicability) | `source_ip_group_exclusion` applicability to CC | lab test |
| [`cloud-connector-06`](kb:cloud-connector.source-ip-groups:zia-origin-editability) | ZIA-origin group editability from ZTC + `/lite` payload shape | lab test / zscaler doc not yet read |
| [`cloud-connector-08`](kb:cloud-connector.overview.gateway-failover:fail-open-egress) | HA: `?cchealth` port, fail-open/close toggle path, fail-open egress | lab test / zscaler doc not yet read |
| [`cloud-connector-09`](kb:cloud-connector.forwarding.methods:method-semantics) | `ENATDEDIP`/`GEOIP`/`PROXYCHAIN` semantics + true `forwardMethod` enum | lab test / Postman cross-check |
| [`cloud-connector-10`](kb:cloud-connector.forwarding.rule-order:rank-and-rule-limit) | Forwarding rule-count limit + Admin Rank ↔ Rule Order interaction | support ticket / lab test |
| [`cloud-connector-11`](kb:cloud-connector.dns.policies:response-overwrite) | "Overwrite DNS response" — does a response-rewrite action exist | zscaler doc not yet read / lab test |
| [`cloud-connector-12`](kb:cloud-connector.dns.policies:criteria-tunnel-doh) | DNS rule UI criteria / tunnel detection / DoH interception not in SDK | zscaler doc not yet read / lab test |
| [`cloud-connector-13`](kb:cloud-connector.dns.gateways:failover-default-ipv6) | DNS gateway failover order / default gateway / IPv6 resolvers | lab test / zscaler doc not yet read |
| [`cloud-connector-14`](kb:cloud-connector.terraform.gateways:dns-gateway-type-semantics) | Duplicate DNS gateway packages + `type` field semantics | lab test / code read |
| [`cloud-connector-15`](kb:cloud-connector.terraform.gateways:subcloud-backend) | `subcloud_primary`/`secondary` backend behavior for CC DC proxies | lab test |
| [`cloud-connector-16`](kb:cloud-connector.terraform.provider-config:legacy-mode-rule-resources) | `ztc_traffic_forwarding_rule` OneAPI requirement + ZPA segment-ID parity | lab test |
| [`cloud-connector-17`](kb:cloud-connector.terraform.forwarding-rules:local-switch-wire-value) | "Local" / `LOCAL_SWITCH` forwarding method — real or doc artifact | lab test / Postman cross-check |
| [`cloud-connector-18`](kb:cloud-connector.api.partner-integrations-wire:azure-gcp-rest-family) | ZTW API gap: public GCP discovery REST family | vendor API documentation / lab test |
| [`cloud-connector-19`](kb:cloud-connector.terraform.provider-config:fedramp-live-acceptance) | ZTW SDK method-convention anomalies + OneAPI FedRAMP behavior | code read / release note / lab test |
| [`cloud-connector-20`](kb:cloud-connector.nss-va.servers:active-active) | NSS VA for CBC: feed coverage / sizing / certs / HA / rule-match | zscaler doc not yet read / lab test |
| [`cloud-connector-21`](kb:cloud-connector.insights.analytics:byte-count-parity) | Insights/Tunnel-Insights aggregation + byte-count parity with NSS feeds | lab test / zscaler doc not yet read |
| [`cloud-connector-22`](kb:cloud-connector.regions.deployment:standard-cc-regions) | CC region coverage: standard deployment / sovereign clouds / WDS-vs-ZTG parity | tenant read / support ticket / cloud Marketplace checks |
| [`cloud-connector-23`](kb:cloud-connector.api.rules-wire:local-switch-acceptance) | `dest_workload_groups_ids` binding to `LOCAL_SWITCH` / "Local" | lab test |
| [`cloud-connector-24`](kb:cloud-connector.forwarding.log-and-control:limit-enforcement) | Field character-limit enforcement on DNS / Log-and-Control rules | lab test / zscaler doc not yet read |
| [`cloud-connector-25`](kb:cloud-connector.api.conventions:default-response-semantics) | ZCloudConnector default-response success schema semantics | vendor spec / live response |
| [`cloud-connector-26`](kb:cloud-connector.terraform.forwarding-rules:rule-labels) | `ztc_traffic_forwarding_rule` label support | provider source update / lab test |
| [`cloud-connector-27`](kb:cloud-connector.regions.zero-trust-gateways:eu-central-2) | `eu-central-2` ZTG region source conflict | Help capture / vendor clarification |
| [`cloud-connector-28`](kb:cloud-connector.gcp.mig-autoscaling:resource-sync-default) | GCP Resource Sync default cadence: Help vs Terraform module | vendor clarification |

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
### shared-01 — SPL index naming portability

*Origin: `node scripts/kb.mjs resolve shared.splunk`*

Our SPL patterns parameterize on `$INDEX_ZIA_WEB` / `$INDEX_ZPA` etc. Where those values come from in practice — env var, config file, pulled from overlay or IaC metadata — is undecided. Affects how we make SPL patterns tenant-portable when index naming varies between customers.

**Status**: resolved (2026-04-24).

**Answer**: **Environment variables**, same mechanism as `ZSCALER_*` credentials (see `shared-04`). The operator sets `SPLUNK_INDEX_ZIA_WEB`, `SPLUNK_INDEX_ZIA_FW`, `SPLUNK_INDEX_ZIA_DNS`, `SPLUNK_INDEX_ZPA` (and any others their SIEM uses) in the shell or via a secrets manager; `scripts/splunk-query.sh` substitutes these into pattern templates at run time.

Rationale:

- **Consistency with credential pattern** — operators already have a shell context populated with `ZSCALER_*` vars; SIEM index names fit the same mental model.
- **No config-file convention invented** — avoids a new `.spl-config.toml`-style file that would sit awkwardly next to the env-var-driven SDK scripts.
- **Snapshot metadata is the wrong source** — snapshot captures Zscaler config, not SIEM config. Splunk index naming is external to Zscaler and can't be inferred from tenant dumps.
- **Defaults in `splunk-queries.md`** — the reference doc shows patterns using the `zscaler_*` naming that is conventional out of the box from Zscaler's Splunk-TA; operators with non-default naming override per-pattern via env var.

Threaded into `scripts/splunk-query.sh` header (documents the 4 env vars) and `node scripts/kb.mjs resolve shared.splunk` (§ "Tenant-portable index naming" callout).

---

### shared-02 — Log-query latency budget

*Origin: `node scripts/kb.mjs resolve shared.log-correlation`*

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

Affects: `scripts/splunk-query.sh` is run-on-request by the operator; the skill's job is to produce the right SPL, not to run it. Threaded into `node scripts/kb.mjs resolve shared.log-correlation` § "When the skill recommends a log query vs answers from config".

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
### zid-26 — ZIdentity snapshot writer output shape

*Origin: retired `references/zidentity/snapshot-schema.md` § Open questions (see git history; field shapes now come from `node scripts/kb.mjs resolve <type-id>`)*

Whether a future ZIdentity snapshot stores the raw list body (so jq uses `.records[]`) or wraps pages in an array (so jq uses `.[0].records[]`) is a writer decision not yet made — ZIdentity is not currently snapshotted. The doc's jq examples assume the raw single-object body, matching the SDK list models (`vendor/zscaler-sdk-python/zscaler/zid/models/users.py:36-67`); confirm and re-document once the writer exists.

**Status**: open
**Resolves with**: design decision (made when the ZIdentity snapshot writer is built; expected alongside the `linear/dav-19-zidentity-refresh` work)

---

## Resolved entries

See the **Status summary** near the top of this file for the list. Entries stay in their original positions above with `Status: resolved` and the answer inline, so anchor links (`clarifications.md#zia-03-wildcard-tokenization` etc.) resolve regardless of resolution state.
