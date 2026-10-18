// scripts/kb-migrate.mjs
//
// Transition helper: rewrite Markdown links that point into converted legacy docs
// (or into clarification-ledger entries that became gaps) as `kb:<id>` links.
// Each converted doc declares its anchor -> node table here, reviewed with the
// conversion; ledger anchors resolve through gaps' former_ids. `kb.mjs validate`
// checks every kb: link, so a rewritten link can never point at nothing.
import fs from "node:fs";
import path from "node:path";

/** Converted docs: file -> { default node, anchor-prefix -> node }. First matching prefix wins. */
export const MOVES = {
  "references/zia/url-filtering.md": {
    default: "zia.url-filtering",
    anchors: [
      ["rule-order", "zia.url-filtering.rule-order"],
      ["the-specificity-rule", "zia.url-categories.membership"],
      ["implication-for", "zia.url-categories.membership"],
      ["worked-example", "zia.url-categories.membership"],
      ["cloud-app-control", "zia.cloud-app-control.precedence"],
      ["url-filtering-evaluates-twice", "zia.ssl-inspection.pipeline"],
      ["rule-criteria", "zia.url-filtering.criteria"],
      ["actions", "zia.url-filtering.actions"],
      ["conditional-field", "zia.url-filtering.actions"],
      ["list-pagination", "zia.url-filtering.list-pagination"],
      ["custom-category-regex", "zia.url-categories.entry-format"],
      ["edge-cases", "zia.url-filtering.advanced-settings"],
    ],
  },
  "references/zia/wildcard-semantics.md": {
    default: "zia.url-categories.entry-matching",
    anchors: [["url-format-rules", "zia.url-categories.entry-format"]],
  },
  "references/zia/sandbox.md": {
    default: "zia.sandbox",
    anchors: [
      ["blocked-by-sandbox-vs-blocked-by-malware-protection-vs-blocked-by-atp", "zia.sandbox.verdicts"],
      ["sandbox-rule-api--programmatic-control-of-first-time-file-behavior", "zia.sandbox.rules"],
      ["custom-md5-block-list-behavioral-analysis-advanced-settings", "zia.sandbox.md5-blocklist"],
      ["default-rule-order-is-127-not--1--sandbox-is-the-outlier", "zia.sandbox.rules"],
      ["a-benign-sandbox-verdict-is-not-a-clean-bill-of-health", "zia.sandbox.verdicts"],
      ["what-actually-gets-analyzed--basic-vs-advanced", "zia.sandbox.coverage"],
      ["detonation-report-trust-and-verdict-boundary", "zia.sandbox.report"],
      ["discan-api--out-of-band-instant-inspection", "zia.sandbox.submission"],
      ["public-service-edge-cache-propagation-lag", "zia.sandbox.quarantine"],
      ["ssl-inspection-as-a-hard-prerequisite", "zia.sandbox.coverage"],
      ["static-analysis-fast-path", "zia.sandbox.coverage"],
      ["one-time-download-links", "zia.sandbox.quarantine"],
      ["quarantine-edge-cases", "zia.sandbox.quarantine"],
      ["dynamic-hash-files", "zia.sandbox.quarantine"],
    ],
  },
  "references/zia/cloud-app-control.md": {
    default: "zia.cloud-app-control",
    anchors: [
      ["per-app-lifecycle-flags-sdk-visible-not-in-help-docs", "zia.cloud-app-control.api-surface"],
      ["how-cac-identifies-the-cloud-app-for-a-transaction", "zia.cloud-app-control.rule-criteria"],
      ["tenant-profile-visibility-in-the-aiml-rule-ui", "zia.cloud-app-control.ai-ml-rules"],
      ["api-surface-beyond-the-basics-go-sdk-findings", "zia.cloud-app-control.actions"],
      ["precedence-rule-with-url-filtering", "zia.cloud-app-control.precedence"],
      ["aiml-applications-rules-help-ui", "zia.cloud-app-control.ai-ml-rules"],
      ["interaction-with-ssl-inspection", "zia.cloud-app-control.ssl-visibility"],
      ["worked-example-covers-eval-q5", "zia.cloud-app-control.precedence"],
      ["evaluation-order-within-cac", "zia.cloud-app-control.precedence"],
      ["what-a-cac-rule-matches-on", "zia.cloud-app-control.rule-criteria"],
      ["capture-prompts-help-ui", "zia.cloud-app-control.ai-ml-rules"],
      ["edge-cases", "zia.cloud-app-control.troubleshooting"],
      ["mechanics", "zia.cloud-app-control"],
      ["summary", "zia.cloud-app-control.precedence"],
    ],
  },
  "references/zia/dns-control.md": {
    default: "zia.dns-control",
    anchors: [
      ["action-bound-fields--wire-shapes-and-sdk-divergences", "zia.dns-control.actions"],
      ["prerequisite--firewall-configured-locations", "zia.dns-control"],
      ["apisdk-surface--the-dns-rule-resource", "zia.dns-control.api-rules"],
      ["zpa-resolver-for-road-warrior", "zia.dns-control.predefined-rules"],
      ["per-action-field-dependencies", "zia.dns-control.actions"],
      ["nrod-categorization-latency", "zia.dns-control.nrod"],
      ["the-three-predefined-rules", "zia.dns-control.predefined-rules"],
      ["zpa-resolver-for-locations", "zia.dns-control.predefined-rules"],
      ["the-action-enum-10-values", "zia.dns-control.actions"],
      ["what-dns-control-is-not", "zia.dns-control"],
      ["when-dns-control-fires", "zia.dns-control"],
      ["custom-rule-structure", "zia.dns-control.criteria"],
      ["surprises-and-gotchas", "zia.dns-control"],
      ["dns-tunnel-detection", "zia.dns-control.tunnel-detection"],
      ["doh-dns-over-https", "zia.dns-control.doh"],
      ["other-rule-fields", "zia.dns-control.api-rules"],
      ["ucaas-one-click", "zia.dns-control.predefined-rules"],
      ["open-questions", "zia.dns-control.actions"],
      ["default-rules", "zia.dns-control"],
      ["endpoint", "zia.dns-control.api-rules"],
    ],
  },
  "references/zia/firewall.md": {
    default: "zia.firewall",
    anchors: [
      ["canonical-service-names-are-case-sensitive-uppercase", "zia.firewall.network-services"],
      ["current-mcp-does-not-establish-a-type-vocabulary", "zia.firewall.network-services"],
      ["port-input-tuples-and-the-wire-key-transform", "zia.firewall.network-services"],
      ["update-override-controls-ip-merge-behavior", "zia.firewall.destination-groups"],
      ["firewall-is-four-policies-in-a-trenchcoat", "zia.firewall"],
      ["ip-destination-groups-rule-building-block", "zia.firewall.destination-groups"],
      ["where-firewall-sits-in-the-traffic-path", "zia.firewall.traffic-path"],
      ["terraform-endpoint-application-criteria", "zia.firewall.criteria"],
      ["excludetype-is-exclusion-not-inclusion", "zia.firewall.destination-groups"],
      ["network-services-rule-building-block", "zia.firewall.network-services"],
      ["protocol-enum-is-a-list-query-filter", "zia.firewall.network-services"],
      ["nat-control-as-a-rule-surface-dnat", "zia.firewall.nat"],
      ["ports-zscaler-inspects-by-default", "zia.firewall"],
      ["firewall-filtering-rule-criteria", "zia.firewall.criteria"],
      ["update-replaces-ports-wholesale", "zia.firewall.network-services"],
      ["python-vs-go-field-divergence", "zia.firewall.network-services"],
      ["basic-vs-advanced-firewall", "zia.firewall.licensing"],
      ["firewall-filtering-actions", "zia.firewall.actions"],
      ["terraform-eun-attributes", "zia.firewall.criteria"],
      ["ips-control-specifics", "zia.firewall.ips"],
      ["type--field-pairing", "zia.firewall.destination-groups"],
      ["rule-level-tuning", "zia.firewall.rule-order"],
      ["rule-count-limits", "zia.firewall.limits"],
      ["logging-for-ips", "zia.firewall.ips"],
      ["wire-schema-1", "zia.firewall.network-services"],
      ["nat-control", "zia.firewall.nat"],
      ["dns-control", "zia.dns-control"],
      ["ftp-control", "zia.firewall"],
      ["wire-schema", "zia.firewall.destination-groups"],
      ["endpoints-1", "zia.firewall.network-services"],
      ["endpoints", "zia.firewall.destination-groups"],
    ],
  },
  "references/zia/ssl-inspection.md": {
    default: "zia.ssl-inspection",
    anchors: [
      ["transparent-vs-explicit-traffic-forwarding--what-the-ssl-rule-matches-on", "zia.ssl-inspection.pipeline"],
      ["rule-criteria-from-configuring-ssltls-inspection-policy", "zia.ssl-inspection.criteria"],
      ["trust-mechanics--what-zscaler-presents-to-clients", "zia.ssl-inspection.certificates"],
      ["default-rule-and-predefined-markers", "zia.ssl-inspection.rules"],
      ["bypass-rule-hygiene--anti-patterns", "zia.ssl-inspection.exemptions"],
      ["action-structure-at-the-api-level", "zia.ssl-inspection.api-shape"],
      ["ssl-bypass-is-a-cross-policy-gate", "zia.ssl-inspection.bypass-impact"],
      ["audit-rubric-for-ssl-bypass-rules", "zia.ssl-inspection.exemptions"],
      ["what-depends-on-ssl-inspection", "zia.ssl-inspection.bypass-impact"],
      ["summary-and-pipeline-position", "zia.ssl-inspection.pipeline"],
      ["worked-example-covers-eval-q4", "zia.ssl-inspection.pipeline"],
      ["per-rule-inspection-knobs", "zia.ssl-inspection.actions"],
      ["resolved-clarifications", "zia.ssl-inspection.pipeline"],
      ["what-cant-be-inspected", "zia.ssl-inspection.uninspectable"],
      ["trust-store-deployment", "zia.ssl-inspection.certificates"],
      ["edge-cases", "zia.ssl-inspection.actions"],
      ["mechanics", "zia.ssl-inspection"],
      ["limits", "zia.ssl-inspection.rules"],
    ],
  },
  "references/zia/dlp.md": {
    default: "zia.dlp",
    anchors: [
      ["forwarding-paths--what-happens-when-a-rule-fires", "zia.dlp.incident-forwarding"],
      ["dlp-policy-rules-with-content-inspection", "zia.dlp.rules"],
      ["observed-live-read-overlays", "zia.dlp.rule-wire-shape"],
      ["content-inspection-limits", "zia.dlp.inspection-limits"],
      ["surprises-worth-flagging", "zia.dlp.rules"],
      ["evaluate-all-rules-mode", "zia.dlp.evaluation"],
      ["cross-product-hooks", "zia.dlp.evaluation"],
      ["outbound-email-dlp", "zia.dlp.outbound-email"],
      ["pipeline-position", "zia.dlp.evaluation"],
      ["dlp-dictionaries", "zia.dlp.dictionaries"],
      ["rule-wire-shape", "zia.dlp.rule-wire-shape"],
      ["apisdk-surface", "zia.dlp.rule-wire-shape"],
      ["endpoint-dlp", "zia.dlp.endpoint-dlp"],
      ["dlp-engines", "zia.dlp.engines"],
      ["namespaces", "zia.dlp.rule-wire-shape"],
      ["edge-cases", "zia.dlp.inspection-limits"],
    ],
  },  "references/zia/authentication.md": {
    default: "zia.authentication",
    anchors: [
      ["step-up-authentication-and-zidentity", "zia.authentication.step-up"],
      ["auth-methods--field-level-detail", "zia.authentication.settings"],
      ["auth-required-vs-not-required", "zia.authentication.location-enforcement"],
      ["authentication-exemptions", "zia.authentication.exemptions"],
      ["authentication-frequency", "zia.authentication.frequency"],
      ["surrogate-ip", "zia.authentication.surrogate-ip"],
    ],
  },
  "references/zia/content-inspection-extras.md": {
    default: "zia.ftp-control",
    anchors: [
      ["ftp-control-is-a-tenant-wide-settings-object-not-a-rule-engine", "zia.ftp-control.settings"],
      ["ftp-control-file-type-control-and-ssh-handling", "zia.ftp-control"],
      ["file-type-control-is-a-rule-resource", "zia.file-type-control.api-shape"],
      ["what-this-means-for-skill-answers", "zia.ssh-control"],
      ["cross-module-interaction-summary", "zia.ftp-control"],
      ["what-zscaler-does-for-ssh", "zia.ssh-control"],
      ["surprises-worth-flagging", "zia.ftp-control.scope"],
      ["operational-gotchas-1", "zia.file-type-control"],
      ["pipeline-interaction", "zia.file-type-control.pipeline"],
      ["operational-gotchas", "zia.ftp-control.scope"],
      ["file-type-control", "zia.file-type-control"],
      ["matching-criteria", "zia.file-type-control.criteria"],
      ["custom-file-types", "zia.file-type-control.api-shape"],
      ["what-it-supports", "zia.ftp-control.scope"],
      ["evaluation-order", "zia.ftp-control.scope"],
      ["where-it-sits-1", "zia.file-type-control.pipeline"],
      ["apisdk-surface", "zia.ftp-control.settings"],
      ["open-questions", "zia.file-type-control.api-shape"],
      ["where-it-sits", "zia.firewall"],
      ["what-it-does", "zia.ftp-control.scope"],
      ["ssh-handling", "zia.ssh-control"],
      ["ftp-control", "zia.ftp-control"],
      ["operations", "zia.file-type-control.actions"],
      ["size-limit", "zia.file-type-control.pipeline"],
      ["protocols", "zia.file-type-control.api-shape"],
      ["actions", "zia.file-type-control.actions"],
      ["why", "zia.ssh-control"],
    ],
  },
  "references/zia/tenant-profiles.md": {
    default: "zia.tenant-profiles",
    anchors: [
      ["how-tenant-profiles-interact-with-policy-inheritance", "zia.tenant-profiles"],
      ["help-ui-visibility-in-aiml-applications-rules", "zia.cloud-app-control.ai-ml-rules"],
      ["ssl-inspection-is-a-hard-prerequisite", "zia.tenant-profiles.ssl-prerequisite"],
      ["how-a-tenant-profile-is-constructed", "zia.tenant-profiles.applications"],
      ["microsoft-specific-flags-tier-a-sdk", "zia.tenant-profiles.microsoft"],
      ["google-specific-flags-tier-a-sdk", "zia.tenant-profiles.app-specifics"],
      ["how-cac-uses-tenant-profiles", "zia.tenant-profiles"],
      ["per-app-identifier-shape", "zia.tenant-profiles.applications"],
      ["per-app-capacity-limits", "zia.tenant-profiles.limits"],
      ["supported-applications", "zia.tenant-profiles.applications"],
      ["help-ui-create-flow", "zia.tenant-profiles"],
      ["open-questions", "zia.tenant-profiles.wire-mechanic"],
      ["api-surface", "zia.tenant-profiles.api-surface"],
      ["gotchas", "zia.tenant-profiles"],
    ],
  },
  "references/zia/bandwidth-control.md": {
    default: "zia.bandwidth-control",
    anchors: [
      ["location-scoping-and-the-enforce-bandwidth-control-toggle", "zia.bandwidth-control.location-scope"],
      ["default-rule-behavior-for-orphan-classes", "zia.bandwidth-control.default-rule"],
      ["when-bandwidth-control-actually-enforces", "zia.bandwidth-control.allocation"],
      ["limits-per-ranges-and-limitations", "zia.bandwidth-control.limits"],
      ["class-fields--classes-are-typed", "zia.bandwidth-control.api-surface"],
      ["bandwidth-control-rule", "zia.bandwidth-control.rules"],
      ["the-two-object-model", "zia.bandwidth-control.classes"],
      ["current-help-ui-tabs", "zia.bandwidth-control.classes"],
      ["dashboard--reporting", "zia.bandwidth-control.allocation"],
      ["pipeline-position", "zia.bandwidth-control.pipeline-position"],
      ["api--sdk-surface", "zia.bandwidth-control.api-surface"],
      ["bandwidth-class", "zia.bandwidth-control.classes"],
      ["rule-fields", "zia.bandwidth-control.api-surface"],
      ["limits", "zia.bandwidth-control.limits"],
    ],
  },
  "references/zia/forwarding-control.md": {
    default: "zia.forwarding-control",
    anchors: [
      ["dedicated-ip-with-customer-owned-addresses-byoip", "zia.forwarding-control.byoip"],
      ["zpa-gateway--the-zia-side-cross-product-handle", "zia.forwarding-control.zpa-gateway"],
      ["forward-methods-the-forward_method-field", "zia.forwarding-control.methods"],
      ["sipa-does-not-require-a-zpa-license", "zia.forwarding-control.sipa"],
      ["terraform-shape-for-nw_services", "zia.forwarding-control.rules"],
      ["mechanism-tier-a--help-docs", "zia.forwarding-control.sipa"],
      ["dns-configuration-for-sipa", "zia.dns-control.predefined-rules"],
      ["authentication-requirement", "zia.forwarding-control.proxy-ports"],
      ["source-ip-anchoring-sipa", "zia.forwarding-control.sipa"],
      ["what-problem-it-solves", "zia.forwarding-control.sipa"],
      ["dedicated-proxy-ports", "zia.forwarding-control.proxy-ports"],
      ["protocol-limitations", "zia.forwarding-control.sipa"],
      ["the-two-sipa-flavors", "zia.forwarding-control.sipa-direct"],
      ["predefined-rules", "zia.forwarding-control.predefined-rules"],
      ["rule-criteria", "zia.forwarding-control.rules"],
      ["configuration", "zia.forwarding-control.proxy-ports"],
      ["gotchas", "zia.forwarding-control.terraform"],
    ],
  },
  "references/zia/locations.md": {
    default: "zia.locations",
    anchors: [
      ["what-policy-modules-scope-by-location-vs-location-group", "zia.locations.rule-scoping"],
      ["locations-sublocations-and-location-groups", "zia.locations"],
      ["dynamic-group-condition-attributes", "zia.locations.groups"],
      ["predefined-dynamic-groups", "zia.locations.groups"],
      ["surprises-worth-flagging", "zia.locations.group-assignment"],
      ["the-three-tier-model", "zia.locations"],
      ["extranet-locations", "zia.locations.groups"],
      ["the-xff-mechanic", "zia.locations.ip-scoping"],
      ["automation-notes", "zia.locations.automation"],
      ["location-group", "zia.locations.groups"],
      ["sublocation", "zia.locations.sublocations"],
      ["location", "zia.locations.model"],
    ],
  },
  "references/zia/sublocations.md": {
    default: "zia.locations.sublocations",
    anchors: [
      ["5-policy-enforcement-at-sublocation-level", "zia.locations.rule-scoping"],
      ["7-forwarding-method-sublocation-vs-parent", "zia.locations.ip-scoping"],
      ["6-identity-and-authentication-scoping", "zia.locations.inheritance"],
      ["3-ip-scope-inheritance-vs-override", "zia.locations.ip-scoping"],
      ["2-sublocations-vs-location-groups", "zia.locations.groups"],
      ["8-crud-via-api-sdk-and-terraform", "zia.locations.automation"],
      ["10-surprises-worth-flagging", "zia.locations.sublocations"],
      ["4-bandwidth-pool-sharing", "zia.locations.bandwidth"],
      ["python-sdk", "zia.locations.automation"],
      ["terraform", "zia.locations.automation"],
    ],
  },
  "references/zia/malware-and-atp.md": {
    default: "zia.atp",
    anchors: [
      ["python-sdk-bug-update_atp_malware_protocols-returns-mis-mapped-fields", "zia.malware-protection.api-surface"],
      ["atp-allowlist-vs-denylist--two-endpoints-opposite-semantics", "zia.atp.security-exceptions"],
      ["suspicious-content-protection-page-risk", "zia.atp.page-risk"],
      ["two-sdk-naming-traps-in-the-atp-schema", "zia.atp.api-surface"],
      ["unauthorized-communication-protection", "zia.atp.categories"],
      ["when-to-suspect-mp-or-atp-for-a-block", "zia.atp.block-diagnosis"],
      ["advanced-threat-protection-mechanics", "zia.atp"],
      ["atp-settings-schema-flat-toggle-list", "zia.atp.api-surface"],
      ["console-diagnosis-workflow-log-based", "zia.atp.block-diagnosis"],
      ["malicious-active-content-protection", "zia.atp.categories"],
      ["cross-site-scripting-xss-protection", "zia.atp.categories"],
      ["atp-settings-are-a-full-replace-put", "zia.atp.api-surface"],
      ["malware-protection--four-singletons", "zia.malware-protection.api-surface"],
      ["categories-per-category-allowblock", "zia.malware-protection.settings"],
      ["suspicious-destinations-protection", "zia.atp.blocked-countries"],
      ["where-they-sit-in-the-pipeline", "zia.atp.enforcement-order"],
      ["security-exceptions-allowlist", "zia.atp.security-exceptions"],
      ["malware-protection-mechanics", "zia.malware-protection"],
      ["aiml-driven-recategorization", "zia.atp.ai-ml-recategorization"],
      ["p2p-file-sharing-protection", "zia.atp.categories"],
      ["inspection-toggles-global", "zia.malware-protection.inspection"],
      ["p2p-anonymizer-protection", "zia.atp.tor"],
      ["python-vs-go-divergences", "zia.atp.blocked-urls"],
      ["p2p-voip-protection", "zia.atp.categories"],
      ["recommended-policy", "zia.malware-protection"],
      ["botnet-protection", "zia.atp.botnet"],
      ["log-field-mapping", "zia.atp.block-diagnosis"],
      ["fraud-protection", "zia.atp.categories"],
      ["sdk--api-surface", "zia.atp.api-surface"],
      ["diagnostic-path", "zia.atp.block-diagnosis"],
      ["open-questions", "zia.atp.api-surface"],
      ["pcap-capture", "zia.malware-protection.settings"],
      ["endpoints", "zia.atp.api-surface"],
    ],
  },
  "references/zia/rule-labels.md": {
    default: "zia.rule-labels",
    anchors: [
      ["53-maximum-labels-per-rule-and-rules-per-label", "zia.rule-labels.constraints"],
      ["2-rule-types-that-support-labels", "zia.rule-labels.rule-types"],
      ["42-label-based-api-filtering", "zia.rule-labels.rule-types"],
      ["44-multi-policy-type-labels", "zia.rule-labels.rule-types"],
      ["32-requestresponse-shape", "zia.rule-labels.api-surface"],
      ["31-rest-api-endpoints", "zia.rule-labels.api-surface"],
      ["51-schema-constraints", "zia.rule-labels.constraints"],
      ["52-delete-constraint", "zia.rule-labels.delete"],
      ["3-crud-operations", "zia.rule-labels.api-surface"],
      ["7-open-questions", "zia.rule-labels.constraints"],
      ["33-python-sdk", "zia.rule-labels.api-surface"],
      ["5-constraints", "zia.rule-labels.constraints"],
      ["34-terraform", "zia.rule-labels.delete"],
    ],
  },
  "references/zia/workload-groups.md": {
    default: "zia.workload-groups",
    anchors: [
      ["expression-structure-expressionjson--expression_json", "zia.workload-groups.expressions"],
      ["policy-rules-that-carry-workloadgroups", "zia.workload-groups.rule-scoping"],
      ["gotchas-and-source-citation-gaps", "zia.workload-groups.expressions"],
      ["top-level-object-workloadgroups", "zia.workload-groups.expressions"],
      ["api-operations", "zia.workload-groups.api-surface"],
      ["open-questions", "zia.workload-groups.expressions"],
      ["field-shape", "zia.workload-groups.expressions"],
      ["tag-limits", "zia.workload-groups.expressions"],
    ],
  },
  "references/zia/iot-report.md": {
    default: "zia.iot",
    anchors: [
      ["devices-with-no-policies-is-not-a-reliable-security-signal-on-its-own", "zia.iot.policy-use"],
      ["classification-accuracy-degrades-without-sufficient-traffic", "zia.iot.discovery"],
      ["byod-laptops-on-shared-locations-appear-in-iot-report", "zia.iot.discovery"],
      ["what-you-can-do-location-type-as-an-iot-proxy", "zia.iot.policy-use"],
      ["proxy-mode-deployments-may-carry-less-signal", "zia.iot.discovery"],
      ["prerequisite-location-must-have-iot-enabled", "zia.iot.discovery"],
      ["what-iot-classification-cannot-do-directly", "zia.iot.policy-use"],
      ["cloud-app-control-iot-classification-rules", "zia.iot.policy-use"],
      ["iot-discovery-must-be-enabled-per-location", "zia.iot.discovery"],
      ["mobile-devices-misclassified-as-iot", "zia.iot.discovery"],
      ["summary-of-policy-capabilities", "zia.iot.policy-use"],
      ["api-permission-restriction", "zia.iot.api-surface"],
      ["where-the-data-comes-from", "zia.iot.discovery"],
      ["2-device-categorization", "zia.iot.classification"],
      ["flow-observation-window", "zia.iot.classification"],
      ["what-the-report-covers", "zia.iot.discovery"],
      ["fingerprinting-signals", "zia.iot.discovery"],
      ["three-level-taxonomy", "zia.iot.classification"],
      ["4-policy-interaction", "zia.iot.policy-use"],
      ["3-reporting-surface", "zia.iot.api-surface"],
      ["console-navigation", "zia.iot.discovery"],
      ["api--sdk-retrieval", "zia.iot.api-surface"],
      ["firewall-rules", "zia.iot.policy-use"],
      ["url-filtering", "zia.iot.policy-use"],
      ["1-overview", "zia.iot.discovery"],
    ],
  },
  "references/zia/audit-logs.md": {
    default: "zia.audit-logs",
    anchors: [
      ["status-response-schema-auditlogentryreporttaskinfo", "zia.audit-logs.report-api"],
      ["api-surface-admin-audit-log-entry-report", "zia.audit-logs.report-api"],
      ["request-schema-auditlogentryrequest", "zia.audit-logs.report-api"],
      ["api-surface-event-log-entry-report", "zia.audit-logs.event-log-report"],
      ["request-schema-eventlogentryreport", "zia.audit-logs.event-log-report"],
      ["config-audit-response-fields", "zia.audit-logs.config-audit"],
      ["authentication-requirement", "zia.audit-logs.report-api"],
      ["where-to-read-audit-logs", "zia.audit-logs.what-is-recorded"],
      ["api-surface-config-audit", "zia.audit-logs.config-audit"],
      ["streaming-destinations", "zia.audit-logs.streaming"],
      ["sdk-access-patterns", "zia.audit-logs.report-api"],
      ["what-is-captured", "zia.audit-logs.what-is-recorded"],
      ["report-lifecycle", "zia.audit-logs.report-api"],
      ["download-format", "zia.audit-logs.report-api"],
      ["endpoints-1", "zia.audit-logs.event-log-report"],
      ["python-sdk", "zia.audit-logs.report-api"],
      ["activation", "zia.audit-logs.report-api"],
      ["retention", "zia.audit-logs.what-is-recorded"],
      ["endpoints", "zia.audit-logs.report-api"],
      ["terraform", "zia.audit-logs.streaming"],
      ["go-sdk", "zia.audit-logs.report-api"],
    ],
  },
  "references/zia/backup-and-restore.md": {
    default: "zia.backup-restore",
    anchors: [
      ["restore-is-replacement-not-a-merge", "zia.backup-restore.restore-semantics"],
      ["restore-point-limits-and-retention", "zia.backup-restore.restore-points"],
      ["coverage-boundary", "zia.backup-restore.restore-semantics"],
      ["dlp-boundary", "zia.backup-restore.restore-semantics"],
    ],
  },
  "references/zia/traffic-forwarding-methods.md": {
    default: "zia.traffic-forwarding",
    anchors: [
      ["pac-connect-user-agent-criterion-in-ssl-rules", "zia.proxy-mode.forwarding-map"],
      ["primary--secondary-tunnel-and-dc-selection", "zia.traffic-forwarding.gre"],
      ["common-interactions-and-failure-modes", "zia.traffic-forwarding.mixed-deployments"],
      ["gre--z-tunnel-20-incompatibility", "zia.traffic-forwarding.mixed-deployments"],
      ["pac--authentication-challenges", "zia.traffic-forwarding.pac"],
      ["the-four-methods-at-a-glance", "zia.traffic-forwarding.methods"],
      ["when-pac-is-the-right-choice", "zia.traffic-forwarding.pac"],
      ["zcc-zscaler-client-connector", "zia.traffic-forwarding.zcc"],
      ["when-zcc-is-the-right-choice", "zia.traffic-forwarding.zcc"],
      ["the-vpn-credential-object", "zia.traffic-forwarding.vpn-credentials"],
      ["choosing-among-the-four", "zia.traffic-forwarding.methods"],
      ["static-ip-requirement", "zia.traffic-forwarding.gre"],
      ["pac-vs-explicit-proxy", "zia.proxy-mode.explicit"],
      ["when-to-use-vs-gre", "zia.traffic-forwarding.ipsec"],
      ["mtu--fragmentation", "zia.traffic-forwarding.gre"],
      ["ike--phase-details", "zia.traffic-forwarding.ipsec"],
      ["scenario-variants", "zia.traffic-forwarding.gre"],
      ["mixed-deployments", "zia.traffic-forwarding.mixed-deployments"],
      ["bandwidth-limits", "zia.traffic-forwarding.gre"],
      ["hosted-pac-files", "zia.traffic-forwarding.pac"],
      ["ipsec-mtu-vs-gre", "zia.traffic-forwarding.ipsec"],
      ["api-objects-1", "zia.traffic-forwarding.vpn-credentials"],
      ["ipsec-tunnel", "zia.traffic-forwarding.ipsec"],
      ["tunnel-modes", "zia.traffic-forwarding.zcc"],
      ["when-to-use", "zia.traffic-forwarding.gre"],
      ["api-objects", "zia.traffic-forwarding.gre"],
      ["limitations", "zia.traffic-forwarding.pac"],
      ["gre-tunnel", "zia.traffic-forwarding.gre"],
      ["ha-model", "zia.traffic-forwarding.gre-failover"],
      ["pac-file", "zia.traffic-forwarding.pac"],
    ],
  },
  "references/zia/proxy-mode.md": {
    default: "zia.proxy-mode",
    anchors: [
      ["7-browser--client-configuration-requirements", "zia.proxy-mode.forwarding-map"],
      ["32-authentication-in-transparent-mode", "zia.proxy-mode.transparent"],
      ["71-explicit-mode--pac-file-delivery", "zia.traffic-forwarding.pac"],
      ["24-authentication-in-explicit-mode", "zia.proxy-mode.explicit"],
      ["23-http-connect-tunnel-handling", "zia.proxy-mode.explicit"],
      ["52-transparent-mode-limitations", "zia.proxy-mode.transparent"],
      ["51-explicit-mode-limitations", "zia.proxy-mode.explicit"],
      ["3-transparent-proxy-mode", "zia.proxy-mode.transparent"],
      ["2-explicit-proxy-mode", "zia.proxy-mode.explicit"],
      ["6-forwarding-method", "zia.proxy-mode.forwarding-map"],
      ["72-transparent-mode", "zia.proxy-mode.transparent"],
      ["22-pac-file-role", "zia.proxy-mode.explicit"],
      ["21-how-it-works", "zia.proxy-mode.explicit"],
      ["31-how-it-works", "zia.proxy-mode.transparent"],
    ],
  },
  "references/zia/ad-integration.md": {
    default: "zia.ad-integration",
    anchors: [
      ["directorysyncmigratetoscimenabled--one-way-switch-behavior", "zia.authentication.settings"],
      ["domain-registration-required-before-scim-provisioning", "zia.scim.setup"],
      ["relationship-to-scim-and-saml-in-the-zia-auth-stack", "zia.ad-integration.provisioning-methods"],
      ["the-zia-auth-stack--three-provisioning-paths", "zia.ad-integration.provisioning-methods"],
      ["path-2-scim-provisioning-current-standard", "zia.scim"],
      ["saml-assertion-attribute-scope-zia-vs-zpa", "zia.ad-integration.saml-auto-provisioning"],
      ["auth-type-enum-and-configuration-objects", "zia.authentication.settings"],
      ["path-1-ldapad-directory-sync-legacy", "zia.ad-integration.directory-sync"],
      ["kerberos-auth-and-greipsec-tunnels", "zia.authentication.methods"],
      ["group-limit-128-groups-per-user", "zia.ad-integration.identity-objects"],
      ["path-3-saml-auto-provisioning", "zia.ad-integration.saml-auto-provisioning"],
      ["sync-frequency-lag", "zia.ad-integration.directory-sync"],
      ["nested-groups", "zia.ad-integration.directory-sync"],
      ["api-surface", "zia.authentication.settings"],
    ],
  },
  "references/zia/scim-provisioning.md": {
    default: "zia.scim",
    anchors: [
      ["the-department-attribute-via-enterprise-user-extension", "zia.scim.attribute-mapping"],
      ["department-requires-the-enterprise-user-scim-extension", "zia.scim.attribute-mapping"],
      ["zia-user-database-as-the-policy-resolution-layer", "zia.scim.groups-and-departments"],
      ["1-scope--what-makes-zia-scim-different-from-zpa", "zia.scim.deactivation"],
      ["activefalse-does-not-immediately-kill-sessions", "zia.scim.deactivation"],
      ["required-attributes-for-zia-policy-evaluation", "zia.scim.attribute-mapping"],
      ["scim-deprovisioning-does-not-revoke-tokens", "zia.scim.deactivation"],
      ["what-the-go-sdk-scimuser-struct-reveals", "zia.scim.sdk-coverage"],
      ["how-zia-represents-group-and-department", "zia.scim.groups-and-departments"],
      ["firewall-filtering-advanced-tier-only", "zia.firewall.licensing"],
      ["8-group-membership-change-propagation", "zia.scim.propagation"],
      ["what-scim-sends-and-where-it-lands", "zia.scim.groups-and-departments"],
      ["first-time-provisioning-sync-size", "zia.scim.propagation"],
      ["scim-query-and-discovery-surface", "zia.scim.operations"],
      ["9-scim-vs-saml-attribute-flow", "zia.ad-integration.saml-auto-provisioning"],
      ["why-this-matters-in-practice", "zia.scim.deactivation"],
      ["bearer-token-authentication", "zia.scim.setup"],
      ["python-sdk-gap-for-zia-scim", "zia.scim.sdk-coverage"],
      ["3-zia-group-vs-department", "zia.scim.groups-and-departments"],
      ["10-constraints-and-limits", "zia.scim.setup"],
      ["key-distinction-from-zpa", "zia.scim.groups-and-departments"],
      ["department-name-matching", "zia.scim.groups-and-departments"],
      ["5-attribute-constraints", "zia.scim.attribute-mapping"],
      ["multi-valued-attributes", "zia.scim.attribute-mapping"],
      ["7-deactivation-behavior", "zia.scim.deactivation"],
      ["2-zia-scim-user-object", "zia.scim.attribute-mapping"],
      ["4-which-zia-rule-types", "zia.scim.groups-and-departments"],
      ["attribute-set-limits", "zia.scim.attribute-mapping"],
      ["group-membership-cap", "zia.ad-integration.identity-objects"],
      ["supported-connectors", "zia.scim.setup"],
      ["forwarding-control", "zia.forwarding-control.rules"],
      ["idp-specific-notes", "zia.scim.attribute-mapping"],
      ["attribute-mapping", "zia.scim.attribute-mapping"],
      ["dlp-web-dlp-rules", "zia.dlp.rules"],
      ["saml-prerequisite", "zia.scim.setup"],
      ["pagination-cap", "zia.scim.operations"],
      ["url-filtering", "zia.url-filtering.criteria"],
      ["summary-table", "zia.scim.groups-and-departments"],
      ["rate-limiting", "zia.scim.operations"],
      ["6-push-model", "zia.scim.propagation"],
      ["sync-cadence", "zia.scim.propagation"],
      ["idempotency", "zia.scim.operations"],
    ],
  },
  "references/zia/private-service-edge.md": {
    default: "zia.private-service-edge",
    anchors: [
      ["cluster-tiers-and-throughput-ceilings", "zia.private-service-edge.sizing"],
      ["how-a-zia-pse-cluster-is-configured", "zia.private-service-edge.location-binding"],
      ["business-continuity-cloud-and-pse", "zia.private-service-edge.business-continuity"],
      ["locations-and-the-open-proxy-risk", "zia.private-service-edge.location-binding"],
      ["per-node-ip-and-hardware-budget", "zia.private-service-edge.ip-requirements"],
      ["pse-vs-cloud-enforcement-nodes", "zia.private-service-edge.what-it-is"],
      ["virtual-service-edge-vse", "zia.virtual-service-edge"],
      ["ip-and-nat-requirements", "zia.private-service-edge.ip-requirements"],
      ["when-pse-makes-sense", "zia.private-service-edge.when-to-deploy"],
      ["cluster-architecture", "zia.private-service-edge.cluster-architecture"],
      ["sdk-and-api-surface", "zia.virtual-service-edge.api-surface"],
      ["advanced-dlp-pse", "zia.private-service-edge.advanced-dlp"],
      ["zdx-dependency", "zia.private-service-edge.what-it-is"],
      ["open-questions", "zia.private-service-edge.ip-requirements"],
    ],
  },
  "references/zia/vse-clusters.md": {
    default: "zia.virtual-service-edge.clusters",
    anchors: [
      ["5-load-distribution-within-a-cluster", "zia.virtual-service-edge.load-balancing"],
      ["12-comparison-to-pse-clusters", "zia.virtual-service-edge"],
      ["10-logging-and-observability", "zia.virtual-service-edge.operations"],
      ["13-comparison-to-public-se", "zia.virtual-service-edge.load-balancing"],
      ["9-ip-and-nat-requirements", "zia.virtual-service-edge.network-requirements"],
      ["8-auto-upgrade-behavior", "zia.virtual-service-edge.upgrades"],
      ["14-known-constraints", "zia.virtual-service-edge.limits"],
      ["public-cloud-azure", "zia.virtual-service-edge.platforms"],
      ["on-premises-esxi", "zia.virtual-service-edge.load-balancing"],
      ["cross-links", "zia.virtual-service-edge"],
    ],
  },
  "references/zia/time-intervals.md": {
    default: "zia.time-intervals",
    anchors: [
      ["timezone-misconfiguration-causes-unexpected-rule-behavior", "zia.time-intervals.timezone"],
      ["python-sdk-docstring-uses-string-for-integer-fields", "zia.time-intervals.schema"],
      ["dlp-web-rules-and-sandbox-rules-require-go-sdk", "zia.time-intervals.rule-usage"],
      ["minutes-from-midnight-wire-format-surprises", "zia.time-intervals.schema"],
      ["per-rule-time-window-cap-firewall-rules", "zia.time-intervals.limits"],
      ["relationship-to-firewall-time-windows", "zia.time-intervals.time-windows"],
      ["3-where-time-intervals-are-referenced", "zia.time-intervals.rule-usage"],
      ["remote-users-use-pse-timezone", "zia.time-intervals.timezone"],
      ["6-crud-via-sdk-and-terraform", "zia.time-intervals.api-surface"],
      ["5-holidays-and-exceptions", "zia.time-intervals.evaluation"],
      ["day-of-week-enumeration", "zia.time-intervals.schema"],
      ["4-evaluation-semantics", "zia.time-intervals.evaluation"],
      ["activation-requirement", "zia.time-intervals.api-surface"],
      ["name-field-constraint", "zia.time-intervals.limits"],
      ["sdk-field-name-note", "zia.time-intervals.rule-usage"],
      ["timezone-handling", "zia.time-intervals.timezone"],
      ["recurrence-model", "zia.time-intervals.schema"],
      ["8-zpa-comparison", "zia.time-intervals.rule-usage"],
      ["dst-behavior", "zia.time-intervals.timezone"],
      ["time-format", "zia.time-intervals.schema"],
      ["python-sdk", "zia.time-intervals.api-surface"],
      ["terraform", "zia.time-intervals.time-windows"],
      ["2-schema", "zia.time-intervals.schema"],
      ["go-sdk", "zia.time-intervals.api-surface"],
    ],
  },
  "references/zia/saas-app-quirks.md": {
    default: "zia.saas-apps",
    anchors: [
      ["7-tenant-restriction-silently-breaks", "zia.saas-apps.tenant-restriction-order"],
      ["4-source-ip-and-conditional-access", "zia.saas-apps.conditional-access"],
      ["3-auth-bypass-requirements", "zia.saas-apps.idp-bypass"],
      ["1-certificate-pinning", "zia.ssl-inspection.uninspectable"],
      ["5-cdn-wildcard-bypass", "zia.saas-apps.shared-cdn-bypass"],
      ["2-custom-truststores", "zia.ssl-inspection.certificates"],
      ["6-quic--http3", "zia.saas-apps.quic-conferencing"],
    ],
  },
  "references/zia/api.md": {
    default: "zia.api",
    anchors: [
      ["why-this-pattern-matters--exceptions-are-not-raised-by-default", "zia.sdk-python.response-shape"],
      ["go-sdk-only-surfaces-cross-sdk-audit-re-run-2026-06-15", "zia.api.sdk-coverage"],
      ["pagination-has-had-recurring-bugs--handle-defensively", "zia.sdk-python.pagination"],
      ["legacy-zia-specific-api-keys--obfuscated-timestamp", "zia.sdk-python.authentication"],
      ["advanced-url-filter--cloud-app-settings", "zia.terraform.url-filtering-settings"],
      ["oneapi-current--oauth-20-via-zidentity", "zia.sdk-python.authentication"],
      ["rate-limits-retries-and-error-handling", "zia.api.rate-limits"],
      ["authentication--two-frameworks", "zia.sdk-python.authentication"],
      ["tenancy-restriction-profiles", "zia.tenant-profiles.api-surface"],
      ["readwrite-shape-asymmetries", "zia.api.read-write-asymmetries"],
      ["advanced-policy-settings", "zia.api.advanced-settings-wire"],
      ["cloud-app-control-rules", "zia.terraform.cloud-app-control-rule"],
      ["terraform-resource-map", "zia.terraform"],
      ["activation-lifecycle", "zia.api.activation"],
      ["ssl-inspection-rules", "zia.api.ssl-inspection-wire"],
      ["url-filtering-rules", "zia.api.url-filtering-wire"],
      ["common-sdk-patterns", "zia.sdk-python.client-errors-and-accessors"],
      ["related-sdk-modules", "zia.api.sdk-coverage"],
      ["sdk-response-shape", "zia.sdk-python.response-shape"],
      ["cloud-nss-feeds", "zia.api.cloud-nss-feeds"],
      ["url-categories", "zia.api.url-categories-wire"],
      ["pagination", "zia.sdk-python.pagination"],
    ],
  },
  "references/zia/sdk.md": {
    default: "zia.sdk-python",
    anchors: [
      ["client-side-filtering-with-jmespath", "zia.sdk-python.request-conventions"],
      ["the-enabled--state-convention", "zia.sdk-python.request-conventions"],
      ["enabled--state-translation", "zia.sdk-python.request-conventions"],
      ["transform_common_id_fields", "zia.sdk-python.request-conventions"],
      ["service-accessor-pattern", "zia.sdk-python.client-errors-and-accessors"],
      ["return-value-convention", "zia.sdk-python.response-shape"],
      ["client-construction", "zia.sdk-python.authentication"],
      ["2-service-catalog", "zia.api.sdk-coverage"],
      ["cloudsandboxapi", "zia.sdk-python.sandbox-client"],
      ["auditlogsapi", "zia.sdk-python.audit-logs-client"],
      ["pagination-1", "zia.sdk-python.pagination"],
      ["error-types", "zia.sdk-python.client-errors-and-accessors"],
      ["pacfilesapi", "zia.sdk-python.pac-files"],
      ["pagination", "zia.sdk-python.pagination"],
    ],
  },
  "references/zia/terraform.md": {
    default: "zia.terraform",
    anchors: [
      ["forwarding-traffic-forwarding-tunnels-and-vpn", "zia.terraform.traffic-forwarding-resources"],
      ["policy-url-filtering-and-cloud-app-control-1", "zia.terraform.url-filtering-rules"],
      ["policy-url-filtering-and-cloud-app-control", "zia.terraform.url-filtering-rules"],
      ["zia_url_filtering_and_cloud_app_settings", "zia.terraform.url-filtering-settings"],
      ["zia_advanced_threat_settings", "zia.terraform.settings"],
      ["settings-global-and-advanced", "zia.terraform.settings"],
      ["rule-ordering-conventions", "zia.terraform.rule-resources"],
      ["zia_atp_malware_settings", "zia.terraform.settings"],
      ["identity-admin-and-roles", "zia.terraform.admin-identity"],
      ["identity-user-management", "zia.terraform.admin-identity"],
      ["zia_auth_settings_urls", "zia.authentication.exemptions"],
      ["zia_advanced_settings", "zia.terraform.settings"],
      ["zia_security_settings", "zia.terraform.settings"],
      ["identity-and-users", "zia.terraform.admin-identity"],
      ["provider-overview", "zia.terraform.provider-modes"],
      ["policy-firewall-1", "zia.terraform.firewall-resources"],
      ["policy-sandbox-1", "zia.terraform.sandbox-resources"],
      ["policy-firewall", "zia.terraform.firewall-resources"],
      ["policy-sandbox", "zia.terraform.sandbox-resources"],
      ["data-sources", "zia.terraform.data-source-lookups"],
      ["policy-dlp-1", "zia.terraform.dlp-resources"],
      ["policy-dlp", "zia.terraform.dlp-resources"],
      ["settings", "zia.terraform.settings"],
    ],
  },
  "references/zia/api-divergences.md": {
    default: "zia.api",
    anchors: [
      ["timewindows--sdk-model-exposes-the-field-but-the-api-does-not-support-time-of-day-scheduling-for-ssl-inspection", "zia.time-intervals.rule-usage"],
      ["terraform-provider-v488-release-gate--type-isolated-ordering-and-bounded-exit", "zia.terraform.rule-order.registry"],
      ["provider-lifecycle-inert-client-credential-validation-skip", "zia.terraform.provider-modes"],
      ["terraform-provider-v488-pac-resourcedata-source-lifecycle", "zia.terraform.pac-files"],
      ["july-2026-endpoint-dlp-and-adjacent-surface-drift", "zia.dlp.endpoint-dlp"],
      ["go-v3843-transport-behavior-is-sdk-local", "zia.sdk-go.legacy-retry-classification"],
      ["mcp-workflow-observations-not-sdk-backed", "zia.cloud-app-control.actions"],
      ["firewall-dns-and-terraform-zia-481-483", "zia.dns-control.api-rules"],
      ["browser-control-and-smart-isolation", "zia.terraform.multi-step-writes"],
      ["authentication-settings", "zia.authentication.settings"],
      ["cloud-app-control-cac", "zia.cloud-app-control.api-surface"],
      ["ssl-inspection", "zia.time-intervals.rule-usage"],
      ["url-filtering", "zia.url-filtering.advanced-settings"],
      ["pac-files", "zia.traffic-forwarding.pac"],
    ],
  },
  "references/zia/api-schemas.md": {
    default: "zia.api",
    anchors: [
    ],
  },
  "references/zia/api-postman-schemas.md": {
    default: "zia.api",
    anchors: [
    ],
  },
  "references/zia/legacy-endpoints.md": {
    default: "zia.api",
    anchors: [
    ],
  },
  "references/zia/api-casb.md": {
    default: "zia.casb",
    anchors: [
      ["api-connectors-saas-application-tenants", "zia.casb.tenants"],
      ["scan-policies--malware-detection-rules", "zia.casb.malware-rules"],
      ["terraform-resources-and-data-sources", "zia.casb.api-surface"],
      ["4-saas-security-insights-log-schema", "zia.casb.insights-logs"],
      ["supported-application-categories", "zia.casb.rule-types"],
      ["auxiliary-configuration-objects", "zia.casb.api-surface"],
      ["tenant-profiles-vs-casb-tenants", "zia.casb.tenants"],
      ["rule-type-namespace-isolation", "zia.casb.rule-types"],
      ["common-fields-all-categories", "zia.casb.insights-logs"],
      ["public-cloud-storage-columns", "zia.casb.insights-logs"],
      ["quarantine-and-remediation", "zia.casb.quarantine"],
      ["multi-tenant-saas-coverage", "zia.casb.tenants"],
      ["scan-policies--dlp-rules", "zia.casb.dlp-rules"],
      ["nss--cloud-nss-streaming", "zia.casb.insights-logs"],
      ["3-configuration-surface", "zia.casb.api-surface"],
      ["collaboration-columns", "zia.casb.insights-logs"],
      ["log-filter-dimensions", "zia.casb.insights-logs"],
      ["export-and-retention", "zia.casb.insights-logs"],
      ["5-ranges-and-limits", "zia.casb.limits"],
      ["quarantine-reversal", "zia.casb.quarantine"],
      ["repository-columns", "zia.casb.insights-logs"],
      ["tenant-connection", "zia.casb.tenants"],
      ["oauth-scope-creep", "zia.casb.tenants"],
      ["re-authentication", "zia.casb.tenants"],
      ["gen-ai-columns", "zia.casb.insights-logs"],
      ["policy-engine", "zia.casb.rule-types"],
      ["email-columns", "zia.casb.insights-logs"],
      ["file-columns", "zia.casb.insights-logs"],
      ["itsm-columns", "zia.casb.insights-logs"],
      ["scan-latency", "zia.casb.scans"],
      ["sdk-surface", "zia.casb.api-surface"],
      ["crm-columns", "zia.casb.insights-logs"],
      ["scan-jobs", "zia.casb.scans"],
    ],
  },
  "references/zia/logs/web-log-schema.md": {
    default: "zia.logs.web-records",
    anchors: [
      ["fields-that-require-additional-enablement", "zia.logs.field-enablement"],
      ["policy-action-and-rule-names", "zia.logs.web-rule-attribution"],
      ["field-inventory", "zia.logs.web-field-semantics"],
    ],
  },
  "references/zia/logs/firewall-log-schema.md": {
    default: "zia.logs.firewall-records",
    anchors: [
    ],
  },
  "references/zia/logs/dns-log-schema.md": {
    default: "zia.logs.dns-record-fields",
    anchors: [
      ["transaction-action", "zia.logs.dns-outcome"],
    ],
  },
  "references/zia/logs/casb-log-schema.md": {
    default: "zia.casb.insights-logs",
    anchors: [
    ],
  },
};

const LEDGER = "references/_meta/clarifications.md";
const LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g;
const SCAN_DIRS = ["references", "agents", "docs", ".agents", ".claude", ".devin"];
const SCAN_FILES = ["SKILL.md", "README.md", "PLAN.md", "AGENTS.md", "zscaler"];

function* markdownFiles(root) {
  for (const f of SCAN_FILES) if (fs.existsSync(path.join(root, f))) yield f;
  const walk = function* (dir) {
    for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const rel = `${dir}/${e.name}`;
      if (e.isDirectory()) { if (e.name !== "worktrees" && e.name !== "archive") yield* walk(rel); }
      else if (e.name.endsWith(".md")) yield rel;
    }
  };
  for (const d of SCAN_DIRS) if (fs.existsSync(path.join(root, d))) yield* walk(d);
}

/** Map a link target (relative to `fromFile`) to a kb ID, or null if it does not move. */
export function targetFor(root, g, fromFile, target) {
  if (/^[a-z]+:/i.test(target)) return null;
  const [p, anchor = ""] = target.split("#");
  const abs = p ? path.resolve(root, path.dirname(fromFile), p) : path.resolve(root, fromFile);
  const rel = path.relative(root, abs).split(path.sep).join("/");
  if (MOVES[rel]) {
    const hit = MOVES[rel].anchors.find(([prefix]) => anchor.startsWith(prefix));
    return hit ? hit[1] : MOVES[rel].default;
  }
  if (rel === LEDGER) {
    const id = anchor.match(/^([a-z][a-z-]*?-\d+)-/)?.[1];
    return id && g.formerIds.has(id) ? g.formerIds.get(id) : null;
  }
  return null;
}

export function migrateLinks(root, g, args) {
  const dry = args.includes("--dry-run");
  const movedNames = Object.keys(MOVES).map((f) => path.basename(f));
  let files = 0;
  let links = 0;
  for (const file of markdownFiles(root)) {
    if (MOVES[file]) continue;
    const full = path.join(root, file);
    const text = fs.readFileSync(full, "utf8");
    let n = 0;
    const out = text.replace(LINK, (m, label, target) => {
      // A label that names a converted file is stale once the link moves.
      const relabel = (id) => (movedNames.some((name) => label.includes(name)) ? `\`${id}\`` : label);
      if (target.startsWith("kb:")) {
        const id = target.slice(3);
        const fixed = relabel(id);
        if (fixed === label) return m;
        n++;
        return `[${fixed}](${target})`;
      }
      const id = targetFor(root, g, file, target);
      if (!id) return m;
      n++;
      return `[${relabel(id)}](kb:${id})`;
    });
    if (n) {
      files++;
      links += n;
      console.log(`${dry ? "would rewrite" : "rewrote"} ${n} link(s) in ${file}`);
      if (!dry) fs.writeFileSync(full, out);
    }
  }
  console.log(`${links} links in ${files} files`);
  return 0;
}

/** Every `kb:` link in legacy Markdown, for validation. */
/**
 * Plain-text mentions of a converted (moved) file, such as a front-matter `sources` entry or a
 * backticked routing path. migrate-links rewrites links only, so these would silently point at a
 * deleted doc. History (design specs, PLAN.md) is exempt.
 */
export function staleMentions(root) {
  const names = Object.keys(MOVES).map((f) => f.replace(/^references\//, ""));
  const pattern = new RegExp(`(?:references/|\\.\\./|\\./)?(${names.map((n) => n.replace(/[.]/g, "\\.")).join("|")})(?![\\w-])`, "g");
  const found = [];
  for (const file of markdownFiles(root)) {
    if (file.startsWith("docs/superpowers/") || file === "PLAN.md") continue;
    const text = fs.readFileSync(path.join(root, file), "utf8");
    for (const m of text.matchAll(pattern)) {
      const moved = `references/${m[1]}`;
      found.push({ file, moved, id: MOVES[moved].default });
    }
  }
  return found;
}

export function kbLinks(root) {
  const found = [];
  for (const file of markdownFiles(root)) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    for (const m of text.matchAll(/\]\(kb:([^)\s]+)\)/g)) found.push({ file, id: m[1] });
  }
  return found;
}
