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
