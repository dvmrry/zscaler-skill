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
7 entries are resolved or clarified, 6 are partially resolved, and 120 are open.
The three exact memberships below are checked against every detailed entry's
explicit `Status`; range notation is inclusive and is expanded by the checker.
Most open entries require lab tests,
tenant reads, operator experience, or vendor confirmation rather than more
public-doc reading.

Entries migrated to the knowledge graph are no longer listed here; they are gaps
with their old ID kept in `former_ids` (resolve with `node scripts/kb.mjs resolve <old-id>`):
`zia-01` → [`zia.url-categories.membership:predefined-vs-custom`](kb:zia.url-categories.membership:predefined-vs-custom); `zia-02` → [`zia.url-categories.membership:same-specificity-collision`](kb:zia.url-categories.membership:same-specificity-collision); `zia-03` → [`zia.url-categories.entry-matching:wildcard-tokenization`](kb:zia.url-categories.entry-matching:wildcard-tokenization); `zia-04` → [`zia.url-filtering.advanced-settings:nrod-lag`](kb:zia.url-filtering.advanced-settings:nrod-lag); `zia-06` → [`zia.cloud-app-control.precedence:cac-disabled-rules`](kb:zia.cloud-app-control.precedence:cac-disabled-rules); `zia-10` → [`zia.cloud-app-control.precedence:default-allow-vs-explicit`](kb:zia.cloud-app-control.precedence:default-allow-vs-explicit); `zia-11` → [`zia.ssl-inspection.pipeline:mixed-forwarding`](kb:zia.ssl-inspection.pipeline:mixed-forwarding); `zia-12` → [`zia.ssl-inspection.pipeline:bypass-and-default-rule`](kb:zia.ssl-inspection.pipeline:bypass-and-default-rule); `zia-14` → [`zia.url-categories.entry-matching:exactly-five-levels`](kb:zia.url-categories.entry-matching:exactly-five-levels); `zia-15` → [`zia.url-categories.entry-matching:console-accepts-asterisk`](kb:zia.url-categories.entry-matching:console-accepts-asterisk); `zia-07` → [`zia.cloud-app-control.risk-profiles:composition`](kb:zia.cloud-app-control.risk-profiles:composition); `zia-09` → [`zia.cloud-app-control.rule-criteria:app-identity`](kb:zia.cloud-app-control.rule-criteria:app-identity); `zia-13` → [`zia.ssl-inspection.pipeline:first-pass-on-domain`](kb:zia.ssl-inspection.pipeline:first-pass-on-domain); `zia-47` → [`zia.dns-control.actions:block-response-code-values`](kb:zia.dns-control.actions:block-response-code-values); `zia-48` → [`zia.dns-control.actions:redirect-ip-binding`](kb:zia.dns-control.actions:redirect-ip-binding); `zia-58` → [`zia.dlp.rule-wire-shape:without-content-inspection-keying`](kb:zia.dlp.rule-wire-shape:without-content-inspection-keying); `zia-59` → [`zia.dns-control.actions:redir-req-gateway`](kb:zia.dns-control.actions:redir-req-gateway); `zia-60` → [`zia.firewall.network-services:type-meanings`](kb:zia.firewall.network-services:type-meanings); `zia-63` → [`zia.sandbox.md5-blocklist:quota-cap`](kb:zia.sandbox.md5-blocklist:quota-cap); `zia-66` → [`zia.ssl-inspection.rules:cap-raisable`](kb:zia.ssl-inspection.rules:cap-raisable); `zia-71` → [`zia.dns-control.api-rules:web-eun-false`](kb:zia.dns-control.api-rules:web-eun-false); `zia-08` → [`zia.tenant-profiles.wire-mechanic:per-app-inspection-detail`](kb:zia.tenant-profiles.wire-mechanic:per-app-inspection-detail); `zia-16` → [`zia.locations.sublocations:cap-2000`](kb:zia.locations.sublocations:cap-2000); `zia-17` → [`zia.locations.sublocations:name-uniqueness-scope`](kb:zia.locations.sublocations:name-uniqueness-scope); `zia-18` → [`zia.locations.sublocations:parent-delete-behavior`](kb:zia.locations.sublocations:parent-delete-behavior); `zia-19` → [`zia.locations.sublocations:reparenting-rules`](kb:zia.locations.sublocations:reparenting-rules); `zia-20` → [`zia.locations.sublocations:depth-limit`](kb:zia.locations.sublocations:depth-limit); `zia-46` → [`zia.locations.group-assignment:tf-dynamic-removal-reason`](kb:zia.locations.group-assignment:tf-dynamic-removal-reason); `zia-56` → [`zia.bandwidth-control.limits:caps-api-enforced`](kb:zia.bandwidth-control.limits:caps-api-enforced); `zia-57` → [`zia.file-type-control.api-shape:filtering-action-dependencies`](kb:zia.file-type-control.api-shape:filtering-action-dependencies); `zia-61` → [`zia.atp.api-surface:tenant-defaults`](kb:zia.atp.api-surface:tenant-defaults); `zia-67` → [`zia.tenant-profiles.microsoft:v1-v2-semantics`](kb:zia.tenant-profiles.microsoft:v1-v2-semantics); `log-04` → [`zia.atp.block-diagnosis:ruletype-values`](kb:zia.atp.block-diagnosis:ruletype-values); `zia-26` → [`zia.rule-labels:audit-log-label-names`](kb:zia.rule-labels:audit-log-label-names); `zia-27` → [`zia.rule-labels.constraints:name-charset`](kb:zia.rule-labels.constraints:name-charset); `zia-28` → [`zia.rule-labels.constraints:name-uniqueness`](kb:zia.rule-labels.constraints:name-uniqueness); `zia-29` → [`zia.rule-labels.constraints:description-max-length`](kb:zia.rule-labels.constraints:description-max-length); `zia-30` → [`zia.rule-labels:duplicate-action`](kb:zia.rule-labels:duplicate-action); `zia-31` → [`zia.rule-labels.rule-types:label-filter-server-support`](kb:zia.rule-labels.rule-types:label-filter-server-support); `zia-32` → [`zia.rule-labels.constraints:tenant-cap`](kb:zia.rule-labels.constraints:tenant-cap); `zia-50` → [`zia.rule-labels.api-surface:rule-type-endpoint-backing`](kb:zia.rule-labels.api-surface:rule-type-endpoint-backing); `zia-69` → [`zia.workload-groups.expressions:runtime-evaluation`](kb:zia.workload-groups.expressions:runtime-evaluation); `zia-55` → [`zia.audit-logs.report-api:pagination`](kb:zia.audit-logs.report-api:pagination); `shared-38` → [`zia.traffic-forwarding.vpn-credentials:psk-live-read`](kb:zia.traffic-forwarding.vpn-credentials:psk-live-read); `zia-39` → [`zia.scim.groups-and-departments:department-no-match`](kb:zia.scim.groups-and-departments:department-no-match); `zia-40` → [`zia.scim.deactivation:session-kill`](kb:zia.scim.deactivation:session-kill); `zia-41` → [`zia.scim.operations:rate-limit`](kb:zia.scim.operations:rate-limit); `zia-42` → [`zia.ad-integration.identity-objects:org-limits`](kb:zia.ad-integration.identity-objects:org-limits); `zia-43` → [`zia.scim.attribute-mapping:per-idp-department-mapping`](kb:zia.scim.attribute-mapping:per-idp-department-mapping); `zia-44` → [`zia.scim.propagation:sync-log-visibility`](kb:zia.scim.propagation:sync-log-visibility); `zia-45` → [`zia.scim.propagation:per-idp-cadence`](kb:zia.scim.propagation:per-idp-cadence); `zia-64` → [`zia.scim.groups-and-departments:department-no-match`](kb:zia.scim.groups-and-departments:department-no-match); `zia-62` → [`zia.private-service-edge.ip-requirements:shared-nat-behavior`](kb:zia.private-service-edge.ip-requirements:shared-nat-behavior); `zia-33` → [`zia.virtual-service-edge.upgrades:cluster-update-sequencing`](kb:zia.virtual-service-edge.upgrades:cluster-update-sequencing); `zia-34` → [`zia.virtual-service-edge.clusters:removal-and-disable-behavior`](kb:zia.virtual-service-edge.clusters:removal-and-disable-behavior); `zia-35` → [`zia.virtual-service-edge.operations:log-identifier`](kb:zia.virtual-service-edge.operations:log-identifier); `zia-36` → [`zia.virtual-service-edge.clusters:cluster-vs-vm-settings`](kb:zia.virtual-service-edge.clusters:cluster-vs-vm-settings); `zia-37` → [`zia.virtual-service-edge.network-requirements:vse-nat-topology`](kb:zia.virtual-service-edge.network-requirements:vse-nat-topology); `zia-38` → [`zia.virtual-service-edge.clusters:public-cloud-cluster-object`](kb:zia.virtual-service-edge.clusters:public-cloud-cluster-object); `zia-21` → [`zia.time-intervals.timezone:dst-handling`](kb:zia.time-intervals.timezone:dst-handling); `zia-22` → [`zia.time-intervals.limits:object-cap`](kb:zia.time-intervals.limits:object-cap); `zia-23` → [`zia.time-intervals.time-windows:terraform-resource-intent`](kb:zia.time-intervals.time-windows:terraform-resource-intent); `zia-24` → [`zia.time-intervals.evaluation:midnight-spanning`](kb:zia.time-intervals.evaluation:midnight-spanning); `zia-25` → [`zia.time-intervals.time-windows:predefined-intervals`](kb:zia.time-intervals.time-windows:predefined-intervals); `zia-49` → [`zia.cloud-app-control.actions:all-vs-available-differs`](kb:zia.cloud-app-control.actions:all-vs-available-differs); `zia-51` → [`zia.api.sdk-coverage:parity-drift`](kb:zia.api.sdk-coverage:parity-drift); `zia-52` → [`zia.api.legacy-ips-signature-wire:import-wire-unconfirmed`](kb:zia.api.legacy-ips-signature-wire:import-wire-unconfirmed); `zia-53` → [`zia.cloud-app-control.actions:per-tuple-validation-contract`](kb:zia.cloud-app-control.actions:per-tuple-validation-contract); `zia-54` → [`zia.cloud-app-control.api-surface:python-risk-profile-runtime`](kb:zia.cloud-app-control.api-surface:python-risk-profile-runtime); `zia-68` → [`zia.terraform.early-access:early-access-eligibility`](kb:zia.terraform.early-access:early-access-eligibility); `zia-72` → [`zia.url-filtering.advanced-settings:creative-commons-backend-effect`](kb:zia.url-filtering.advanced-settings:creative-commons-backend-effect); `log-01` → [`zia.logs.nss-feed-format:format-field-presence`](kb:zia.logs.nss-feed-format:format-field-presence); `log-02` → [`zia.logs.nss-feed-format:vm-conversion-omits`](kb:zia.logs.nss-feed-format:vm-conversion-omits); `log-03` → [`zia.logs.nss-feed-format:multi-feed-timezone`](kb:zia.logs.nss-feed-format:multi-feed-timezone); `log-05` → [`zia.logs.web-rule-attribution:action-values-precedence`](kb:zia.logs.web-rule-attribution:action-values-precedence); `log-06` → [`zia.logs.web-field-semantics:reason-structure`](kb:zia.logs.web-field-semantics:reason-structure); `log-07` → [`zia.logs.web-field-semantics:url-category-fields`](kb:zia.logs.web-field-semantics:url-category-fields); `log-08` → [`zia.logs.web-field-semantics:riskscore-lineage`](kb:zia.logs.web-field-semantics:riskscore-lineage); `log-09` → [`zia.logs.web-field-semantics:byte-counters`](kb:zia.logs.web-field-semantics:byte-counters); `log-10` → [`zia.logs.web-field-semantics:prompt-scope`](kb:zia.logs.web-field-semantics:prompt-scope); `log-11` → [`zia.logs.firewall-records:aggregate-counters`](kb:zia.logs.firewall-records:aggregate-counters); `log-12` → [`zia.logs.firewall-records:action-precedence`](kb:zia.logs.firewall-records:action-precedence); `log-13` → [`zia.logs.firewall-records:nwapp-vs-nwsvc`](kb:zia.logs.firewall-records:nwapp-vs-nwsvc); `log-14` → [`zia.logs.dns-outcome:action-enum-open`](kb:zia.logs.dns-outcome:action-enum-open); `log-15` → [`zia.logs.dns-outcome:res-sentinels-open`](kb:zia.logs.dns-outcome:res-sentinels-open); `log-16` → [`zia.logs.dns-gateway-fields:dnsgw-flags-semantics-open`](kb:zia.logs.dns-gateway-fields:dnsgw-flags-semantics-open); `log-17` → [`zia.casb.insights-logs:record-category-discriminator`](kb:zia.casb.insights-logs:record-category-discriminator); `zpa-02` → [`zpa.app-segments.matching:granularity-ranking`](kb:zpa.app-segments.matching:granularity-ranking); `zpa-03` → [`zpa.app-segments.multimatch:config-conflict`](kb:zpa.app-segments.multimatch:config-conflict); `zpa-04` → [`zpa.app-segments.matching:same-specificity-tie`](kb:zpa.app-segments.matching:same-specificity-tie); `zpa-05` → [`zpa.app-segments.matching:port-mismatch-bypass`](kb:zpa.app-segments.matching:port-mismatch-bypass); `zpa-06` → [`zpa.policy.actions:require-approval-equals-conditional-access`](kb:zpa.policy.actions:require-approval-equals-conditional-access); `zpa-07` → [`zpa.policy.access-rule-order:deception-rule-ordering-rationale`](kb:zpa.policy.access-rule-order:deception-rule-ordering-rationale); `zpa-08` → [`zpa.policy.evaluation-order:wildcard-matches-bare-domain`](kb:zpa.policy.evaluation-order:wildcard-matches-bare-domain); `zpa-11` → [`zpa.machine-groups.api-surface:create-endpoint-absence`](kb:zpa.machine-groups.api-surface:create-endpoint-absence); `zpa-12` → [`zpa.machine-groups.definition:no-group-level-criteria`](kb:zpa.machine-groups.definition:no-group-level-criteria); `zpa-13` → [`zpa.machine-groups.policy-use:api-without-client-type`](kb:zpa.machine-groups.policy-use:api-without-client-type); `zpa-14` → [`zpa.machine-groups.definition:capacity-other-limits`](kb:zpa.machine-groups.definition:capacity-other-limits); `zpa-15` → [`zpa.machine-groups`](kb:zpa.machine-groups); `zpa-20` → [`zpa.app-connectors.health:status-pending-unverified`](kb:zpa.app-connectors.health:status-pending-unverified); `zpa-27` → [`zpa.app-connectors.selection:latency-probe-cadence`](kb:zpa.app-connectors.selection:latency-probe-cadence); `zpa-28` → [`zpa.app-connectors.enrollment:certificate-validity-window`](kb:zpa.app-connectors.enrollment:certificate-validity-window); `zpa-29` → [`zpa.app-connectors.deployment:max-connectors-per-group`](kb:zpa.app-connectors.deployment:max-connectors-per-group); `zpa-30` → [`zpa.app-connectors.provisioning-key-tooling:group-delete-removes-keys`](kb:zpa.app-connectors.provisioning-key-tooling:group-delete-removes-keys); `zpa-31` → [`zpa.app-connectors.provisioning-key-tooling:api-requires-cert-for-connector-key`](kb:zpa.app-connectors.provisioning-key-tooling:api-requires-cert-for-connector-key); `zpa-32` → [`zpa.audit-logs.streaming:field-schema`](kb:zpa.audit-logs.streaming:field-schema); `zpa-33` → [`zpa.audit-logs.streaming:siem-policy-purpose`](kb:zpa.audit-logs.streaming:siem-policy-purpose); `zpa-34` → [`zpa.audit-logs.streaming:microtenant-scoping`](kb:zpa.audit-logs.streaming:microtenant-scoping); `zpa-35` → [`zpa.audit-logs.streaming:audit-filter-api`](kb:zpa.audit-logs.streaming:audit-filter-api); `zpa-36` → [`zpa.browser-access.backend-options:field-setting-mapping`](kb:zpa.browser-access.backend-options:field-setting-mapping); `zpa-40` → [`zpa.log-receivers.log-types:auth-log-1id-label`](kb:zpa.log-receivers.log-types:auth-log-1id-label); `zpa-41` → [`zpa.log-receivers.log-types:format-only-codes`](kb:zpa.log-receivers.log-types:format-only-codes); `zpa-42` → [`zpa.machine-tunnels.requirements:enable-for-all`](kb:zpa.machine-tunnels.requirements:enable-for-all); `zpa-43` → [`zpa.machine-tunnels.requirements:session-lifecycle`](kb:zpa.machine-tunnels.requirements:session-lifecycle); `zpa-44` → [`zpa.machine-tunnels.provisioning-keys:macos-mdm-effect`](kb:zpa.machine-tunnels.provisioning-keys:macos-mdm-effect); `zpa-45` → [`zpa.machine-tunnels.provisioning-keys:separate-key-type`](kb:zpa.machine-tunnels.provisioning-keys:separate-key-type); `zpa-46` → [`zpa.policy.conditions:chrome-operand-form-api-enforcement`](kb:zpa.policy.conditions:chrome-operand-form-api-enforcement); `zpa-47` → [`zpa.private-service-edges.deployment:session-limits`](kb:zpa.private-service-edges.deployment:session-limits); `zpa-49` → [`zpa.private-service-edges.deployment:release-images`](kb:zpa.private-service-edges.deployment:release-images); `zpa-50` → [`zpa.private-service-edges.what-it-is:pse-hardware-sales`](kb:zpa.private-service-edges.what-it-is:pse-hardware-sales); `zpa-51` → [`zpa.private-service-edges.private-cloud-controller:controller-role`](kb:zpa.private-service-edges.private-cloud-controller:controller-role); `zpa-52` → [`zpa.private-service-edges.private-cloud-controller:restart-semantics`](kb:zpa.private-service-edges.private-cloud-controller:restart-semantics); `zpa-53` → [`zpa.private-service-edges.api-surface:schedule-default-cadence`](kb:zpa.private-service-edges.api-surface:schedule-default-cadence); `zpa-54` → [`zpa.private-service-edges.client-selection:location-propagation`](kb:zpa.private-service-edges.client-selection:location-propagation); `zpa-55` → [`zpa.private-service-edges.enrollment:oauth2-prerequisites`](kb:zpa.private-service-edges.enrollment:oauth2-prerequisites); `zpa-56` → [`zpa.private-service-edges.deployment:max-per-group`](kb:zpa.private-service-edges.deployment:max-per-group); `zpa-57` → [`zpa.pra:absent-from-base-zpa`](kb:zpa.pra:absent-from-base-zpa); `zpa-58` → [`zpa.public-service-edges.what-it-is:safe-mode`](kb:zpa.public-service-edges.what-it-is:safe-mode); `zpa-59` → [`zpa.public-service-edges.what-it-is:ca-reconnect-semantics`](kb:zpa.public-service-edges.what-it-is:ca-reconnect-semantics); `zpa-60` → [`zpa.public-service-edges.api-visibility:upgrade-priority`](kb:zpa.public-service-edges.api-visibility:upgrade-priority); `zpa-61` → [`zpa.saml-attributes.registration:zpa-61-limit`](kb:zpa.saml-attributes.registration:zpa-61-limit); `zpa-62` → [`zpa.saml-attributes.api-surface:zpa-62-user-attribute-delta`](kb:zpa.saml-attributes.api-surface:zpa-62-user-attribute-delta); `zpa-63` → [`zpa.scim.group-lifecycle:zpa-63-deleted-group-in-rule`](kb:zpa.scim.group-lifecycle:zpa-63-deleted-group-in-rule); `zpa-64` → [`zpa.scim.api-surface:zpa-64-internal-id`](kb:zpa.scim.api-surface:zpa-64-internal-id); `zpa-65` → [`zpa.scim.policy-criteria:zpa-65-setting-fallback`](kb:zpa.scim.policy-criteria:zpa-65-setting-fallback); `zpa-66` → [`zpa.scim.policy-criteria:zpa-66-case-sensitivity`](kb:zpa.scim.policy-criteria:zpa-66-case-sensitivity); `zpa-67` → [`zpa.scim.provisioning-timing:zpa-67-membership-resolution`](kb:zpa.scim.provisioning-timing:zpa-67-membership-resolution); `zpa-68` → [`zpa.scim.policy-criteria:zpa-68-isolation-scim`](kb:zpa.scim.policy-criteria:zpa-68-isolation-scim); `zpa-69` → [`zpa.segment-groups.api-surface:v2-update-differences`](kb:zpa.segment-groups.api-surface:v2-update-differences); `zpa-70` → [`zpa.segment-groups.api-surface:skip-detailed-app-info-effect`](kb:zpa.segment-groups.api-surface:skip-detailed-app-info-effect); `zpa-71` → [`zpa.segment-groups.api-surface:tcp-keep-alive-enabled-effect`](kb:zpa.segment-groups.api-surface:tcp-keep-alive-enabled-effect); `zpa-72` → [`zpa.segment-groups.api-surface:config-space-meaning`](kb:zpa.segment-groups.api-surface:config-space-meaning); `zpa-78` → [`zpa.trusted-networks.policy-operand:rhs-false-semantics`](kb:zpa.trusted-networks.policy-operand:rhs-false-semantics); `zpa-79` → [`zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks`](kb:zpa.trusted-networks.zcc-relationship:zpa-objects-are-zcc-networks); `zpa-80` → [`zpa.trusted-networks.zcc-relationship:signal-path`](kb:zpa.trusted-networks.zcc-relationship:signal-path); `zpa-81` → [`zpa.trusted-networks.service-edge-groups:off-network-fallback`](kb:zpa.trusted-networks.service-edge-groups:off-network-fallback); `zpa-83` → [`zpa.app-segments.api-fields:hbr-sticky-guest-semantics`](kb:zpa.app-segments.api-fields:hbr-sticky-guest-semantics); `log-18` → [`zpa.logs.microsegmentation-flow:enforcement-triple`](kb:zpa.logs.microsegmentation-flow:enforcement-triple); `log-19` → [`zpa.logs.user-status:record-granularity`](kb:zpa.logs.user-status:record-granularity); `log-20` → [`zpa.logs.browser-access:connection-status-values`](kb:zpa.logs.browser-access:connection-status-values); `zpa-01` → [`zpa.logs.user-activity:multi-segment-lss`](kb:zpa.logs.user-activity:multi-segment-lss); `zpa-16` → [`zpa.logs.user-activity:active-cadence`](kb:zpa.logs.user-activity:active-cadence); `zpa-17` → [`zpa.logs.user-activity:byte-counter-reset`](kb:zpa.logs.user-activity:byte-counter-reset); `zpa-18` → [`zpa.logs.user-activity:timing-overlap`](kb:zpa.logs.user-activity:timing-overlap); `zpa-19` → [`zpa.logs.user-activity:server-setup-scope`](kb:zpa.logs.user-activity:server-setup-scope); `zpa-21` → [`zpa.pra.app-segments:contract-application-protocol-enum`](kb:zpa.pra.app-segments:contract-application-protocol-enum); `zpa-22` → [`zpa.api.service-edges-wire:restart-path-canonical`](kb:zpa.api.service-edges-wire:restart-path-canonical); `zpa-23` → [`zpa.api.pra-wire:credential-secrets-on-read`](kb:zpa.api.pra-wire:credential-secrets-on-read); `zpa-24` → [`zpa.api.app-segments-wire:connection-security-values`](kb:zpa.api.app-segments-wire:connection-security-values); `zpa-25` → [`zpa.api.certificates-wire:ba-certificate-put-valid`](kb:zpa.api.certificates-wire:ba-certificate-put-valid); `zpa-26` → [`zpa.api.lss-wire:browser-isolation-accepted`](kb:zpa.api.lss-wire:browser-isolation-accepted); `zpa-37` → [`zpa.api.legacy-endpoints:stepup-write-verbs`](kb:zpa.api.legacy-endpoints:stepup-write-verbs); `zpa-38` → [`zpa.api.base-paths:legacy-host-accepts-zpa-prefix`](kb:zpa.api.base-paths:legacy-host-accepts-zpa-prefix); `zpa-39` → [`zpa.api.legacy-endpoints:assistant-schedule-served`](kb:zpa.api.legacy-endpoints:assistant-schedule-served); `zpa-76` → [`zpa.log-receivers.filtering:tf-other-types-rejected`](kb:zpa.log-receivers.filtering:tf-other-types-rejected); `zpa-77` → [`zpa.terraform.resource-constraints:tag-group-in-policy-conditions`](kb:zpa.terraform.resource-constraints:tag-group-in-policy-conditions); `zpa-82` → [`zpa.pra.tooling:approval-identity-windows`](kb:zpa.pra.tooling:approval-identity-windows); `zpa-84` → [`zpa.api.pagination:mcp-manual-pages`](kb:zpa.api.pagination:mcp-manual-pages); `zcc-01` → [`zcc.api.forwarding-profile-wire:condition-type-values`](kb:zcc.api.forwarding-profile-wire:condition-type-values); `zcc-02` → [`zcc.api.forwarding-profile-wire:network-type-values`](kb:zcc.api.forwarding-profile-wire:network-type-values); `zcc-03` → [`zcc.api.forwarding-profile-wire:action-type-values`](kb:zcc.api.forwarding-profile-wire:action-type-values); `zcc-04` → [`zcc.api.forwarding-profile-wire:primary-transport-values`](kb:zcc.api.forwarding-profile-wire:primary-transport-values); `zcc-05` → [`zcc.forwarding-profiles.internet-actions:system-proxy-vs-action`](kb:zcc.forwarding-profiles.internet-actions:system-proxy-vs-action); `zcc-06` → [`zcc.trusted-networks.object:condition-type-values`](kb:zcc.trusted-networks.object:condition-type-values); `zcc-07` → [`zcc.app-profiles.selection:default-policy`](kb:zcc.app-profiles.selection:default-policy); `zcc-08` → [`zcc.api.rate-limits:body-shape-429`](kb:zcc.api.rate-limits:body-shape-429); `zcc-09` → [`zcc.api.rate-limits:download-cap-scope`](kb:zcc.api.rate-limits:download-cap-scope); `zcc-10` → [`zcc.api.rate-limits:remaining-on-success`](kb:zcc.api.rate-limits:remaining-on-success); `zcc-11` → [`zcc.api.devices-wire:udid-batch-cap`](kb:zcc.api.devices-wire:udid-batch-cap); `zcc-12` → [`zcc.api.rate-limits:oneapi-retry-headers`](kb:zcc.api.rate-limits:oneapi-retry-headers); `zcc-13` → [`zcc.api.rate-limits:bucket-scope`](kb:zcc.api.rate-limits:bucket-scope); `zcc-14` → [`zcc.install.macos-deployment:preference-domain`](kb:zcc.install.macos-deployment:preference-domain); `zcc-15` → [`zcc.install.macos-extensions:profile-timing`](kb:zcc.install.macos-extensions:profile-timing); `zcc-16` → [`zcc.install.macos-deployment:uninstall-script-path`](kb:zcc.install.macos-deployment:uninstall-script-path); `zcc-17` → [`zcc.install.macos-deployment:launchtray-zero-extension`](kb:zcc.install.macos-deployment:launchtray-zero-extension); `zcc-18` → [`zcc.install.macos-deployment:app-store-build`](kb:zcc.install.macos-deployment:app-store-build); `zcc-19` → [`zcc.install.macos-extensions:team-and-bundle-ids`](kb:zcc.install.macos-extensions:team-and-bundle-ids); `zcc-20` → [`zcc.install.macos-extensions:full-disk-access-scope`](kb:zcc.install.macos-extensions:full-disk-access-scope); `zcc-21` → [`zcc.install.macos-deployment:minimum-macos`](kb:zcc.install.macos-deployment:minimum-macos); `zcc-22` → [`zcc.install.macos-deployment:update-channel-key`](kb:zcc.install.macos-deployment:update-channel-key); `zcc-23` → [`zcc.install.macos-deployment:launchtray-zero-extension`](kb:zcc.install.macos-deployment:launchtray-zero-extension); `zcc-24` → [`zcc.notifications.templates:template-schema`](kb:zcc.notifications.templates:template-schema); `zcc-25` → [`zcc.notifications.templates:per-profile-reauth-interval`](kb:zcc.notifications.templates:per-profile-reauth-interval); `zcc-26` → [`zcc.acceptable-use:localization`](kb:zcc.acceptable-use:localization); `zcc-27` → [`zcc.notifications.templates:posture-failure-notification`](kb:zcc.notifications.templates:posture-failure-notification); `zcc-28` → [`zcc.notifications:cert-trust-ux`](kb:zcc.notifications:cert-trust-ux); `zcc-29` → [`zcc.notifications:delivery-logging`](kb:zcc.notifications:delivery-logging); `zcc-30` → [`zcc.notifications.localization:fallback-language`](kb:zcc.notifications.localization:fallback-language); `zcc-31` → [`zcc.notifications.framework:platform-support`](kb:zcc.notifications.framework:platform-support); `zcc-32` → [`zcc.notifications.framework:platform-support`](kb:zcc.notifications.framework:platform-support); `zcc-33` → [`zcc.api.company-wire:set-company-info-go`](kb:zcc.api.company-wire:set-company-info-go); `zcc-34` → [`zcc.support-options:toggle-defaults`](kb:zcc.support-options:toggle-defaults); `zcc-35` → [`zcc.api.web-policy-wire:ui-capture-password-keys`](kb:zcc.api.web-policy-wire:ui-capture-password-keys); `zcc-36` → [`zcc.support-options:bundle-contents`](kb:zcc.support-options:bundle-contents); `zcc-37` → [`zcc.support-options:bundle-contents`](kb:zcc.support-options:bundle-contents); `zcc-38` → [`zcc.support-options:submission-audit`](kb:zcc.support-options:submission-audit); `zcc-39` → [`zcc.firefox.integration:linux`](kb:zcc.firefox.integration:linux); `zcc-40` → [`zcc.firefox.proxy-and-trust:enterprise-roots`](kb:zcc.firefox.proxy-and-trust:enterprise-roots); `zcc-41` → [`zcc.firefox.integration:preference-keys`](kb:zcc.firefox.integration:preference-keys); `zcc-42` → [`zcc.firefox.integration:upgrade-persistence`](kb:zcc.firefox.integration:upgrade-persistence); `zcc-43` → [`zcc.firefox.integration:version-scope`](kb:zcc.firefox.integration:version-scope); `zcc-44` → [`zcc.acceptable-use:redisplay-on-change`](kb:zcc.acceptable-use:redisplay-on-change); `zcc-45` → [`zcc.acceptable-use:decline-and-variants`](kb:zcc.acceptable-use:decline-and-variants); `zcc-46` → [`zcc.acceptable-use:external-links`](kb:zcc.acceptable-use:external-links); `zcc-47` → [`zcc.acceptable-use:decline-and-variants`](kb:zcc.acceptable-use:decline-and-variants); `zcc-48` → [`zcc.acceptable-use:decline-and-variants`](kb:zcc.acceptable-use:decline-and-variants); `zcc-49` → [`zcc.acceptable-use:min-agent-version`](kb:zcc.acceptable-use:min-agent-version); `zcc-50` → [`zcc.acceptable-use:notification-templates-mode`](kb:zcc.acceptable-use:notification-templates-mode); `zcc-51` → [`zcc.acceptable-use:acceptance-logging`](kb:zcc.acceptable-use:acceptance-logging); `zcc-52` → [`zcc.acceptable-use:localization`](kb:zcc.acceptable-use:localization); `zcc-53` → [`zcc.acceptable-use:message-size`](kb:zcc.acceptable-use:message-size); `zcc-54` → [`zcc.acceptable-use:non-interactive-sessions`](kb:zcc.acceptable-use:non-interactive-sessions); `zcc-55` → [`zcc.acceptable-use:config-propagation`](kb:zcc.acceptable-use:config-propagation); `zcc-56` → [`zcc.logging.log-modes:default-mode`](kb:zcc.logging.log-modes:default-mode); `zcc-57` → [`zcc.logging.log-modes:level-vs-mode`](kb:zcc.logging.log-modes:level-vs-mode); `zcc-58` → [`zcc.app-profiles.logging:log-file-size`](kb:zcc.app-profiles.logging:log-file-size); `zcc-59` → [`zcc.web-privacy.collection:unmapped-keys`](kb:zcc.web-privacy.collection:unmapped-keys); `zcc-60` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-61` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-62` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-63` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-64` → [`zcc.logging.user-access:ios-log-access`](kb:zcc.logging.user-access:ios-log-access); `zcc-65` → [`zcc.support-options:bundle-contents`](kb:zcc.support-options:bundle-contents); `zcc-66` → [`zcc.logs.client-log:file-format`](kb:zcc.logs.client-log:file-format); `zcc-67` → [`zcc.logs.client-log:transaction-records`](kb:zcc.logs.client-log:transaction-records); `zcc-68` → [`zcc.logging.collection:log-locations`](kb:zcc.logging.collection:log-locations); `zcc-69` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-70` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-71` → [`zcc.logging.collection:os-log-integration`](kb:zcc.logging.collection:os-log-integration); `zcc-72` → [`zcc.logging.collection:fetch-logs-permission`](kb:zcc.logging.collection:fetch-logs-permission); `zcc-73` → [`zcc.api.conventions:status-500-label`](kb:zcc.api.conventions:status-500-label); `zcc-74` → [`zcc.troubleshooting:generic-legacy-codes`](kb:zcc.troubleshooting:generic-legacy-codes); `zcc-75` → [`zcc.install.macos-extensions:unapproved-extension`](kb:zcc.install.macos-extensions:unapproved-extension); `zcc-76` → [`zcc.passwords-and-otp.otp:otp-expiry`](kb:zcc.passwords-and-otp.otp:otp-expiry); `zcc-77` → [`zcc.api.web-policy-wire:top-vs-nested-precedence`](kb:zcc.api.web-policy-wire:top-vs-nested-precedence); `zcc-78` → [`zcc.api.web-policy-wire:devicetype-precedence`](kb:zcc.api.web-policy-wire:devicetype-precedence); `zcc-79` → [`zcc.api.web-policy-wire:selected-required`](kb:zcc.api.web-policy-wire:selected-required); `zcc-80` → [`zcc.api.trusted-networks-wire:v1-v2-coexistence`](kb:zcc.api.trusted-networks-wire:v1-v2-coexistence); `zcc-81` → [`zcc.devices.record-fields:zd-vs-zdp`](kb:zcc.devices.record-fields:zd-vs-zdp); `zcc-82` → [`zcc.devices.record-fields:registration-state-vs-state`](kb:zcc.devices.record-fields:registration-state-vs-state); `zcc-83` → [`zcc.devices.record-fields:state-wire-type`](kb:zcc.devices.record-fields:state-wire-type); `zcc-84` → [`zcc.forwarding-profiles:unified-tunnel-semantics`](kb:zcc.forwarding-profiles:unified-tunnel-semantics); `zcc-85` → [`zcc.forwarding-profiles.fail-open:precedence-detail`](kb:zcc.forwarding-profiles.fail-open:precedence-detail); `zcc-86` → [`zcc.sdk-python.return-shapes:web-privacy-get-none`](kb:zcc.sdk-python.return-shapes:web-privacy-get-none); `zcc-87` → [`zcc.sdk-python.client-configuration:oneapi-429-headers`](kb:zcc.sdk-python.client-configuration:oneapi-429-headers); `zcc-88` → [`zcc.api.web-policy-wire:mac-block-read-key`](kb:zcc.api.web-policy-wire:mac-block-read-key); `zcc-89` → [`zcc.api.web-policy-wire:scope-keys-on-read`](kb:zcc.api.web-policy-wire:scope-keys-on-read); `zcc-90` → [`zcc.api.web-policy-wire:devicetype-string-on-read`](kb:zcc.api.web-policy-wire:devicetype-string-on-read); `zcc-91` → [`zcc.support-options:toggle-defaults`](kb:zcc.support-options:toggle-defaults); `zcc-92` → [`zcc.passwords-and-otp.password-api:surface-authority`](kb:zcc.passwords-and-otp.password-api:surface-authority); `zcc-93` → [`zcc.passwords-and-otp.app-profile-passwords:macos-password-key-asymmetry`](kb:zcc.passwords-and-otp.app-profile-passwords:macos-password-key-asymmetry); `zcc-94` → [`zcc.passwords-and-otp.app-profile-passwords:ui-gate-per-os`](kb:zcc.passwords-and-otp.app-profile-passwords:ui-gate-per-os); `zcc-95` → [`zcc.trusted-networks.detection:transition-handling`](kb:zcc.trusted-networks.detection:transition-handling); `zcc-96` → [`zcc.trusted-networks.detection:multiple-networks`](kb:zcc.trusted-networks.detection:multiple-networks); `zcc-97` → [`zcc.forwarding-profiles.assignment:orphan-reference`](kb:zcc.forwarding-profiles.assignment:orphan-reference); `zcc-98` → [`zcc.api.web-policy-wire:join-on-read`](kb:zcc.api.web-policy-wire:join-on-read); `zcc-99` → [`zcc.app-profiles.advanced-settings:drop-quic`](kb:zcc.app-profiles.advanced-settings:drop-quic); `zcc-100` → [`zcc.forwarding-profiles.internet-actions:ipv6-flags`](kb:zcc.forwarding-profiles.internet-actions:ipv6-flags); `zcc-101` → [`zcc.z-tunnel.transport:session-internals`](kb:zcc.z-tunnel.transport:session-internals); `log-21` → [`zcc.logging.log-modes:level-vs-mode`](kb:zcc.logging.log-modes:level-vs-mode).; `cloud-connector-01` → [`cloud-connector.workload-discovery.regions:region-status-representation`](kb:cloud-connector.workload-discovery.regions:region-status-representation); `cloud-connector-02` → [`cloud-connector.workload-discovery:cloudformation-body`](kb:cloud-connector.workload-discovery:cloudformation-body); `cloud-connector-03` → [`cloud-connector.source-ip-groups:size-and-count-limits`](kb:cloud-connector.source-ip-groups:size-and-count-limits); `cloud-connector-04` → [`cloud-connector.source-ip-groups:ipv6-entries`](kb:cloud-connector.source-ip-groups:ipv6-entries); `cloud-connector-05` → [`cloud-connector.source-ip-groups.rule-use:exclusion-applicability`](kb:cloud-connector.source-ip-groups.rule-use:exclusion-applicability); `cloud-connector-06` → [`cloud-connector.source-ip-groups:zia-origin-editability`](kb:cloud-connector.source-ip-groups:zia-origin-editability); `cloud-connector-07` → [`cloud-connector.overview.zero-trust-gateways:no-infrastructure`](kb:cloud-connector.overview.zero-trust-gateways:no-infrastructure); `cloud-connector-08` → [`cloud-connector.overview.gateway-failover:fail-open-egress`](kb:cloud-connector.overview.gateway-failover:fail-open-egress); `cloud-connector-09` → [`cloud-connector.forwarding.methods:method-semantics`](kb:cloud-connector.forwarding.methods:method-semantics); `cloud-connector-10` → [`cloud-connector.forwarding.rule-order:rank-and-rule-limit`](kb:cloud-connector.forwarding.rule-order:rank-and-rule-limit); `cloud-connector-11` → [`cloud-connector.dns.policies:response-overwrite`](kb:cloud-connector.dns.policies:response-overwrite); `cloud-connector-12` → [`cloud-connector.dns.policies:criteria-tunnel-doh`](kb:cloud-connector.dns.policies:criteria-tunnel-doh); `cloud-connector-13` → [`cloud-connector.dns.gateways:failover-default-ipv6`](kb:cloud-connector.dns.gateways:failover-default-ipv6); `cloud-connector-14` → [`cloud-connector.terraform.gateways:dns-gateway-type-semantics`](kb:cloud-connector.terraform.gateways:dns-gateway-type-semantics); `cloud-connector-15` → [`cloud-connector.terraform.gateways:subcloud-backend`](kb:cloud-connector.terraform.gateways:subcloud-backend); `cloud-connector-16` → [`cloud-connector.terraform.provider-config:legacy-mode-rule-resources`](kb:cloud-connector.terraform.provider-config:legacy-mode-rule-resources); `cloud-connector-17` → [`cloud-connector.terraform.forwarding-rules:local-switch-wire-value`](kb:cloud-connector.terraform.forwarding-rules:local-switch-wire-value); `cloud-connector-18` → [`cloud-connector.api.partner-integrations-wire:azure-gcp-rest-family`](kb:cloud-connector.api.partner-integrations-wire:azure-gcp-rest-family); `cloud-connector-19` → [`cloud-connector.terraform.provider-config:fedramp-live-acceptance`](kb:cloud-connector.terraform.provider-config:fedramp-live-acceptance); `cloud-connector-20` → [`cloud-connector.nss-va.servers:active-active`](kb:cloud-connector.nss-va.servers:active-active); `cloud-connector-21` → [`cloud-connector.insights.analytics:byte-count-parity`](kb:cloud-connector.insights.analytics:byte-count-parity); `cloud-connector-22` → [`cloud-connector.regions.deployment:standard-cc-regions`](kb:cloud-connector.regions.deployment:standard-cc-regions); `cloud-connector-23` → [`cloud-connector.api.rules-wire:local-switch-acceptance`](kb:cloud-connector.api.rules-wire:local-switch-acceptance); `cloud-connector-24` → [`cloud-connector.forwarding.log-and-control:limit-enforcement`](kb:cloud-connector.forwarding.log-and-control:limit-enforcement); `cloud-connector-25` → [`cloud-connector.api.conventions:default-response-semantics`](kb:cloud-connector.api.conventions:default-response-semantics); `cloud-connector-26` → [`cloud-connector.terraform.forwarding-rules:rule-labels`](kb:cloud-connector.terraform.forwarding-rules:rule-labels); `cloud-connector-27` → [`cloud-connector.regions.zero-trust-gateways:eu-central-2`](kb:cloud-connector.regions.zero-trust-gateways:eu-central-2); `cloud-connector-28` → [`cloud-connector.gcp.mig-autoscaling:resource-sync-default`](kb:cloud-connector.gcp.mig-autoscaling:resource-sync-default); `cloud-connector-29` → [`cloud-connector.overview.zero-trust-gateways:azure-availability`](kb:cloud-connector.overview.zero-trust-gateways:azure-availability); `log-22` → [`cloud-connector.insights.connector-status:vm-status-codes`](kb:cloud-connector.insights.connector-status:vm-status-codes); `shared-06` → [`shared.policy-evaluation:zpa-disabled-rule`](kb:shared.policy-evaluation:zpa-disabled-rule); `shared-07` → [`shared.multi-cluster:flow-stickiness`](kb:shared.multi-cluster:flow-stickiness); `shared-08` → [`shared.multi-cluster:auth-state`](kb:shared.multi-cluster:auth-state); `shared-09` → [`shared.multi-cluster:vip-failure-detection`](kb:shared.multi-cluster:vip-failure-detection); `shared-10` → [`shared.multi-cluster:ztunnel2`](kb:shared.multi-cluster:ztunnel2); `shared-11` → [`shared.multi-cluster:other-clouds`](kb:shared.multi-cluster:other-clouds); `shared-12` → [`shared.m365.troubleshooting:ca-evaluation-timing`](kb:shared.m365.troubleshooting:ca-evaluation-timing); `shared-13` → [`shared.m365.troubleshooting:cae-interaction`](kb:shared.m365.troubleshooting:cae-interaction); `shared-14` → [`shared.m365.troubleshooting:connectors-down`](kb:shared.m365.troubleshooting:connectors-down); `shared-15` → [`shared.m365.troubleshooting:egress-address-drift`](kb:shared.m365.troubleshooting:egress-address-drift); `shared-16` → [`shared.m365.troubleshooting:named-location-cap`](kb:shared.m365.troubleshooting:named-location-cap); `shared-17` → [`shared.cloud-architecture.service-edges:selection-algorithm`](kb:shared.cloud-architecture.service-edges:selection-algorithm); `shared-18` → [`shared.cloud-architecture.service-edges:auth-timeline`](kb:shared.cloud-architecture.service-edges:auth-timeline); `shared-19` → [`shared.policy-evaluation:modern-http`](kb:shared.policy-evaluation:modern-http); `shared-20` → [`shared.cloud-architecture.failure-domains:source-ip-change-mid-session`](kb:shared.cloud-architecture.failure-domains:source-ip-change-mid-session); `shared-21` → [`shared.cloud-architecture.service-edges:workload-identity`](kb:shared.cloud-architecture.service-edges:workload-identity); `shared-22` → [`shared.log-correlation.zia-zpa-join:cross-dc-sessions`](kb:shared.log-correlation.zia-zpa-join:cross-dc-sessions); `shared-23` → [`zia.traffic-forwarding.pac:delivery-methods`](kb:zia.traffic-forwarding.pac:delivery-methods); `shared-24` → [`zia.traffic-forwarding.pac:client-cache`](kb:zia.traffic-forwarding.pac:client-cache); `shared-25` → [`zia.traffic-forwarding.pac:auth-challenge-behavior`](kb:zia.traffic-forwarding.pac:auth-challenge-behavior); `shared-26` → [`shared.pac-files.coverage:non-browser-clients`](kb:shared.pac-files.coverage:non-browser-clients); `shared-27` → [`shared.pac-files.coverage:ipv6`](kb:shared.pac-files.coverage:ipv6); `shared-28` → [`zia.scim.sdk-coverage:python-none`](kb:zia.scim.sdk-coverage:python-none); `shared-29` → [`shared.analytics.graphql-errors-and-limits:rate-limits`](kb:shared.analytics.graphql-errors-and-limits:rate-limits); `shared-30` → [`shared.analytics.graphql:production-introspection`](kb:shared.analytics.graphql:production-introspection); `shared-31` → [`shared.analytics.graphql-queries:pagination`](kb:shared.analytics.graphql-queries:pagination); `shared-32` → [`shared.analytics.graphql-queries:obfuscated-source`](kb:shared.analytics.graphql-queries:obfuscated-source); `shared-33` → [`shared.analytics.graphql-queries:iot-time-range`](kb:shared.analytics.graphql-queries:iot-time-range); `shared-34` → [`shared.analytics.graphql:zdx-linkage`](kb:shared.analytics.graphql:zdx-linkage); `shared-35` → [`shared.analytics.graphql-queries:mutations`](kb:shared.analytics.graphql-queries:mutations); `shared-36` → [`shared.analytics.graphql-queries:bytes-unit`](kb:shared.analytics.graphql-queries:bytes-unit); `shared-37` → [`shared.audit-logs:trace-id-propagation`](kb:shared.audit-logs:trace-id-propagation); `shared-39` → [`shared.secret-surfaces.revealed:zpa-shared-model-secrets`](kb:shared.secret-surfaces.revealed:zpa-shared-model-secrets); `shared-40` → [`shared.mcp-server.tool-inventory:prd-alias-set`](kb:shared.mcp-server.tool-inventory:prd-alias-set)

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
| [`zdx-35`](#zdx-35-share_snapshot-obfuscation-transmission) | `share_snapshot` obfuscation transmission | Automate contract now confirms `obfuscation` is a request-body field; Python wrapper transmission remains open |
| [`ai-security-04`](#ai-security-04-ai-guard-admin-plane-programmability) | AI Guard admin-plane programmability | Current Automate publishes 47 operations; Python has 39 callable methods, with remaining wrapper gaps and live acceptance unresolved |
| [`zbi-02`](#zbi-02-cbizpaprofile-vs-isolationprofile-preferred-endpoint) | `cbizpaprofile` vs `isolationprofile` preferred endpoint | Automate contract confirms both paths are first-class documented GET operations; preference and runtime divergence remain open |
| [`zbi-03`](#zbi-03-auto-created-default-profile-lifecycle-and-isdefault-mutability) | Auto-created default profile lifecycle and `isDefault` mutability | ZIA-side `defaultProfile` is documented as Zscaler-set; ZPA-side `isDefault` mutability and lifecycle remain open |
| [`zbi-04`](#zbi-04-copypaste-and-uploaddownload-enum-completeness) | `copyPaste` and `uploadDownload` enum completeness | Automate examples corroborate `all`/`none`; no formal enum or directional values are documented |
| [`zscaler-cellular-01`](#zscaler-cellular-01-zscaler-cellular-admin-and-api-surface) | Zscaler Cellular admin and API surface | Automate contract, Python SDK, and MCP read layer establish public surfaces; live entitlement/backend acceptance and ZIA/ZPA policy-object mapping remain open |

### Open

- **zia**: `zia-65`, `zia-70`
- **zpa**: `zpa-09`–`zpa-10`, `zpa-73`–`zpa-75`
- **zdx**: `zdx-01`–`zdx-34`, `zdx-36`–`zdx-44`
- **zms**: `zms-01`
- **easm**: `easm-01`–`easm-02`
- **zid**: `zid-01`–`zid-36`
- **ai-security**: `ai-security-01`–`ai-security-03`, `ai-security-06`–`ai-security-09`
- **risk360**: `risk360-01`, `risk360-02`
- **breach-predictor**: `breach-predictor-01`
- **uvm**: `uvm-01`
- **dspm**: `dspm-01`
- **zbi**: `zbi-01`, `zbi-05`–`zbi-06`
- **zwa**: `zwa-01`–`zwa-05`
- **business-insights**: `business-insights-01`
- **soc-workbench**: `soc-workbench-01`
- **unified**: `unified-01`
- **aem**: `aem-01`
- **deception**: `deception-01`
- **identity-protection**: `identity-protection-01`
- **zero-trust-branch**: `zero-trust-branch-01`–`zero-trust-branch-02`
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
