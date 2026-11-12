# CASB rule types: the eight categories and their separate rule lists (zia.casb.rule-types)
Also called: OFLCASB_DLP_ITSM; OFLCASB_AVP_REPO; casb rule type; ruleType; casb rule category; data at rest rule order; dlp vs malware rule namespace
Former IDs: api-casb-05

A rule belongs to one of eight categories, set by its `type`. A Data at Rest Scanning DLP rule has a `type` that selects one of eight categories, OFLCASB_DLP_ followed by FILE, EMAIL, CRM, ITSM, COLLAB, REPO, STORAGE or GENAI; the API also accepts ANY and NONE. [zia.casb.rule-types:dlp-type-tokens] A Data at Rest Scanning Malware Detection rule has a `type` in the same eight categories with the prefix OFLCASB_AVP_, plus ANY and NONE. [zia.casb.rule-types:malware-type-tokens] For DLP rules, the Terraform provider and the Ansible module list only the eight category tokens for `type`, not ANY or NONE; for malware rules the Ansible module omits them too, but the Terraform resource accepts ANY and NONE. [zia.casb.rule-types:terraform-omits-any-none]

**Which applications a category covers.** The Data at Rest Scanning policy consists of the DLP and Malware Detection policies, which can be configured for SaaS application types including Collaboration, File sharing, Gen AI, Public cloud storage and Source code repository. [zia.casb.rule-types:help-application-types] The tenant list call filters by `appType`, whose values are ANY, FILE, EMAIL, CRM, ITSM, COLLAB, REPO, STORAGE, TP_APP, MISC and GENAI. [zia.casb.rule-types:tenant-app-type-values] The category suffix of a rule type (FILE, EMAIL, CRM, ITSM, COLLAB, REPO, STORAGE, GENAI) matches the tenant `appType` values of the same names, so a rule category corresponds to the type of application whose tenants it covers. [zia.casb.rule-types:category-tokens-match-app-type] The Insights logs name Slack among collaboration applications, Salesforce among CRM, Exchange among email, and ChatGPT among Gen AI. [zia.casb.rule-types:app-examples-by-category] The full application-to-category list is open [gap:zia.casb.rule-types:app-to-category-map].

**Separate lists.** DLP rule order is defined relative to other Data at Rest Scanning DLP rules and malware rule order relative to other Data at Rest Scanning Malware rules, so the two kinds are separate ordered lists. [zia.casb.rule-types:order-separate-lists] Both are also separate from the inline Web DLP rule list, whose order is defined on /webDlpRules "with respect to other rules", an endpoint tagged Data Loss Prevention rather than SaaS Security API. [zia.casb.rule-types:web-dlp-order-separate] The Terraform provider keeps one starting-order value for every type, which is a provider defect covered in [SaaS Security DLP and malware rules still use one registry key and one starting-order scalar each (`casb_dlp_rules`, `casb_malware_rules`), while their callbacks and the SDK list and get functions are scoped by a `ruleType` query parameter taken from the registering rule. Not fixed as of v4.8.17.](kb:zia.terraform.rule-order.registry:casb-rules-one-key-for-all-types).

**One provider per rule.** A DLP rule can name tenants from only one SaaS application provider: with a Gmail tenant and an Exchange tenant, one rule cannot cover both. [zia.casb.rule-types:one-provider-per-rule]

**Calls.** The rule endpoints take `ruleType` as an optional query parameter on list, get and delete. The Go SDK's GetByRuleType, GetByRuleID and Delete each send one ruleType, and the Terraform DLP rule resource reads a rule through GetByRuleID with the rule's type and, on create, lists the rules of the new rule's type through GetByRuleType; the Python SDK requires rule_type to list rules and makes it optional on get and delete. [zia.casb.rule-types:ruletype-scoped-calls] Endpoints and SDK behavior are in [CASB API, SDK and Terraform surface](kb:zia.casb.api-surface).

The rule bodies are in [CASB Data at Rest Scanning DLP rules](kb:zia.casb.dlp-rules) and [CASB Data at Rest Scanning malware rules](kb:zia.casb.malware-rules).

What to check:
1. Which category token the rule uses, and that its order is compared only with rules of the same kind (DLP or malware).
2. Whether the rule names tenants of one provider only.
3. Whether the application belongs to the category in question, which no source lists in full.

Inferred, not quoted (say so when an answer rests on one):
- [zia.casb.rule-types:category-tokens-match-app-type] Tier B: Matched by name only; no source states the mapping.
- [zia.casb.rule-types:web-dlp-order-separate] Tier B: Inferred from the contract's layout: /webDlpRules is a different path under a different tag (Data Loss Prevention, where /casbDlpRules is tagged SaaS Security API), and its order description says only "with respect to other rules". No source states that Web DLP rule order and Data at Rest Scanning rule order are separate lists.

Not known (open gaps):
- Which SaaS applications belong to each rule category [gap:zia.casb.rule-types:app-to-category-map] (data gap): filled by operator

Area: zia.casb, its subjects in references/_meta/spine/zia/zia.casb.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.casb.dlp-rules.md (CASB Data at Rest Scanning DLP rules), from zia.casb: Data at Rest Scanning DLP rules are evaluated in ascending rule order, and a disabled rule keeps its place in the order while the service skips it and moves to the next rule. [zia.casb.dlp-rules:rule-order-ascending]
- logged-in references/_meta/text/zia/zia.casb.insights-logs.md (CASB SaaS Security Insights logs: what the records mean, filtering, export and streaming), from zia.casb: SaaS Security Insights logs show every scan performed by the Zscaler SaaS Connector for a SaaS application tenant and are stored for 180 days on the Nanolog servers. [zia.casb.insights-logs:retention-180]
- depends-on references/_meta/text/zia/zia.casb.scans.md (CASB scan schedules: states, historical data, stop and restart), from zia.casb: A configured rule inspects nothing until it is added to a scan schedule: the Zscaler service does not inspect content until a scan is configured. [zia.casb:no-scan-no-inspection]
- depends-on references/_meta/text/zia/zia.casb.tenants.md (CASB tenants: connecting a SaaS application, states and reauthorization), from zia.casb: Zscaler Data at Rest Scanning provides visibility and security for the sanctioned SaaS applications used in the organization, and a SaaS application is authorized with Zscaler by adding it as a tenant. [zia.casb.tenants:tenant-authorizes-app]
- links-to references/_meta/text/zia/zia.casb.api-surface.md (CASB API, SDK and Terraform surface)
- links-to references/_meta/text/zia/zia.casb.malware-rules.md (CASB Data at Rest Scanning malware rules)
- links-to references/_meta/text/zia/zia.terraform.rule-order.registry.md (The ZIA provider's reorder registry: keys, locks and lifecycle across rule resources)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/casb-dlp-rules.md (config type)
- configured-via references/_meta/text/types/zia/casb-malware-rules.md (config type)
- configured-via references/_meta/text/types/zia/casb-tenants.md (config type)
