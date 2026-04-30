---
product: zia
topic: rule-labels
title: "ZIA Rule Labels — tagging construct for policy rule organization and automation"
content-type: reference
last-verified: "2026-04-27"
confidence: medium
source-tier: doc
sources:
  - "vendor/zscaler-help/about-rule-labels.md"
  - "vendor/zscaler-sdk-python/zscaler/zia/rule_labels.py"
  - "vendor/zscaler-sdk-python/zscaler/zia/models/rule_labels.py"
  - "vendor/terraform-provider-zia/docs/resources/zia_rule_labels.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_firewall_filtering_rule.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_url_filtering_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_dlp_web_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_forwarding_control_rule.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_ssl_inspection_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_cloud_app_control_rule.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_sandbox_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_bandwidth_control_rule.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_nat_control_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_traffic_capture_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_file_type_control_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_firewall_dns_rule.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_firewall_ips_rule.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_casb_dlp_rules.md"
  - "vendor/terraform-provider-zia/docs/resources/zia_casb_malware_rules.md"
author-status: draft
---

# ZIA Rule Labels

Rule Labels are named metadata objects in ZIA that allow administrators to logically
group and tag policy rules across any policy type. They are a shared configuration
resource, created independently of any specific policy, and then referenced by individual
rules at the time of rule configuration.

---

## 1. What a Rule Label Is

A Rule Label is a lightweight named entity consisting of a name, an optional description,
and a system-assigned numeric ID. Its only function is to act as a tag: attaching the label
to a rule does not alter the rule's matching logic, action, or order. Labels are purely
organizational. (Tier A — vendor/zscaler-help/about-rule-labels.md)

When labels are assigned to rules, the ZIA admin console groups all rules sharing the same
label under that label's heading on the policy page. Administrators can collapse or hide the
labeled group to reduce visual noise when a policy table contains many rules. Rules that
carry no label appear under a system-generated **Untagged** group. (Tier A —
vendor/zscaler-help/about-rule-labels.md)

The Rule Labels page is located at:
**Policies > Common Configuration > Resources > Rule Labels**
(Tier A — vendor/zscaler-help/about-rule-labels.md)

### Visibility in logs and audit trails

Rule Labels are UI and API metadata only. The vendor help text describes them as
controlling "the policy rules displayed under a rule label" and does not mention label names
appearing in traffic logs, NSS streams, or SIEM exports. Whether label names surface in
ZIA audit log entries for rule changes is not confirmed from available sources.
(Open question — see Section 7.)

The label object model returned by the API does expose a `referencedRuleCount` integer
that reflects how many rules currently reference the label. This count is read-only and
maintained by the platform. (Tier B — vendor/zscaler-sdk-python/zscaler/zia/models/rule_labels.py)

---

## 2. Rule Types That Support Labels

The following table lists every ZIA Terraform resource for which the vendor provider
documentation includes a `labels` attribute. Because the Terraform provider schema is
generated from the ZIA REST API, this list reflects the underlying API contract.

| Rule Type | Terraform Resource | Labels Field |
|---|---|---|
| Cloud Firewall filtering | `zia_firewall_filtering_rule` | `labels` (list of `{id}`) |
| Cloud Firewall DNS control | `zia_firewall_dns_rule` | `labels` (list of `{id}`) |
| Cloud Firewall IPS control | `zia_firewall_ips_rule` | `labels` (list of `{id}`) |
| NAT control | `zia_nat_control_rules` | `labels` (list of `{id}`) |
| Traffic capture | `zia_traffic_capture_rules` | `labels` (list of `{id}`) |
| URL filtering | `zia_url_filtering_rules` | `labels` (list of `{id}`) |
| SSL inspection | `zia_ssl_inspection_rules` | `labels` (list of `{id}`) |
| DLP web rules | `zia_dlp_web_rules` | `labels` (list of `{id}`) |
| File type control | `zia_file_type_control_rules` | `labels` (list of `{id}`) |
| Cloud App Control | `zia_cloud_app_control_rule` | `labels` (list of `{id}`) |
| Forwarding control | `zia_forwarding_control_rule` | `labels` (list of `{id}`) |
| Sandbox | `zia_sandbox_rules` | `labels` (list of `{id}`) |
| Bandwidth control | `zia_bandwidth_control_rule` | `labels` (list of `{id}`) |
| SaaS Security (CASB) DLP | `zia_casb_dlp_rules` | `labels` (list of `{id}`) |
| SaaS Security (CASB) malware | `zia_casb_malware_rules` | `labels` (list of `{id}`) |

(Tier B — vendor/terraform-provider-zia/docs/resources/ — individual resource docs listed
in frontmatter.)

The vendor help text identifies the feature as enabling grouping of "all your organization's
policies" without enumerating specific policy types. The Terraform provider source is the
authoritative enumeration. (Tier A — vendor/zscaler-help/about-rule-labels.md; Tier B —
vendor/terraform-provider-zia/)

The Python SDK's `get_rule_type_label` method documents an additional taxonomy of rule types
it accepts as filter values for the `/ruleLabels/ruleType/{rule_type}` endpoint:
`URL_FILTERING`, `FIREWALL`, `CASB_DLP`, `CLOUD_APP_CONTROL`, `DATA_PROTECTION`, `GENAI`,
`INDUSTRY_PEER`, `NEWS_FEED`, `RISK_SCORE`, `SANDBOX`. This enum is defined in the SDK
source and not documented in the vendor help portal. (Tier B —
vendor/zscaler-sdk-python/zscaler/zia/rule_labels.py)

---

## 3. CRUD Operations

### 3.1 REST API Endpoints

| Operation | Method | Path |
|---|---|---|
| List all labels | GET | `/zia/api/v1/ruleLabels` |
| List labels (lite/ID-name pairs) | GET | `/zia/api/v1/ruleLabels/lite` |
| Get single label | GET | `/zia/api/v1/ruleLabels/{id}` |
| Get labels by rule type | GET | `/zia/api/v1/ruleLabels/ruleType/{rule_type}` |
| Create label | POST | `/zia/api/v1/ruleLabels` |
| Update label | PUT | `/zia/api/v1/ruleLabels/{id}` |
| Delete label | DELETE | `/zia/api/v1/ruleLabels/{id}` |

(Tier B — vendor/zscaler-sdk-python/zscaler/zia/rule_labels.py)

### 3.2 Request/Response Shape

The label object has a minimal schema:

| Field | Type | Writeable | Notes |
|---|---|---|---|
| `id` | int | No (assigned on create) | Numeric identifier |
| `name` | string | Yes (required on create) | Label display name |
| `description` | string | Yes (optional) | Free-text notes |
| `lastModifiedTime` | int (epoch) | No | Set by platform |
| `lastModifiedBy` | object | No | `CommonBlocks` name-ID |
| `createdBy` | object | No | Populated on creation |
| `referencedRuleCount` | int | No | Count of rules using this label |

(Tier B — vendor/zscaler-sdk-python/zscaler/zia/models/rule_labels.py)

The `list_labels` endpoint supports `page`, `page_size`, and `search` query parameters.
(Tier B — vendor/zscaler-sdk-python/zscaler/zia/rule_labels.py)

### 3.3 Python SDK

Accessor: `client.zia.rule_labels`
File: `zscaler/zia/rule_labels.py`

| Method | Signature | Endpoint |
|---|---|---|
| `list_labels` | `(query_params=None)` | GET `/ruleLabels` |
| `list_labels_lite` | `()` | GET `/ruleLabels/lite` |
| `get_label` | `(label_id: int)` | GET `/ruleLabels/{id}` |
| `add_label` | `(**kwargs)` | POST `/ruleLabels` |
| `update_label` | `(label_id: int, **kwargs)` | PUT `/ruleLabels/{id}` |
| `delete_label` | `(label_id: int)` | DELETE `/ruleLabels/{id}` |
| `get_rule_type_label` | `(rule_type: str)` | GET `/ruleLabels/ruleType/{rule_type}` |

Go SDK parity: confirmed (`rule_labels/` package). (Tier B —
vendor/zscaler-sdk-python/zscaler/zia/rule_labels.py; references/zia/sdk.md)

**Idempotency and reassignment.** A label can be renamed via `update_label` without
affecting the rules that reference it, because rules reference the label by numeric ID, not
by name. A label can be referenced by any number of rules simultaneously, and the same label
can be assigned to rules across different policy types. (Tier B —
vendor/zscaler-sdk-python/zscaler/zia/models/rule_labels.py)

### 3.4 Terraform

Resource: `zia_rule_labels`
Source: `vendor/terraform-provider-zia/docs/resources/zia_rule_labels.md`

```hcl
resource "zia_rule_labels" "example" {
  name        = "Example"
  description = "Example"
}
```

Argument reference:

| Argument | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | Label display name |
| `description` | String | No | Free-text description |

The resource supports import by numeric ID or by name:

```shell
terraform import zia_rule_labels.example <label_id>
terraform import zia_rule_labels.example <label_name>
```

(Tier B — vendor/terraform-provider-zia/docs/resources/zia_rule_labels.md)

**Referencing a label from a rule resource.**
Rule resources accept a `labels` block containing a list of label IDs. The standard pattern
uses a data source lookup or a direct resource reference:

```hcl
data "zia_rule_labels" "this" {
  name = "RuleLabel01"
}

resource "zia_casb_dlp_rules" "example" {
  # ...
  labels {
    id = [data.zia_rule_labels.this.id]
  }
}
```

(Tier B — vendor/terraform-provider-zia/docs/resources/zia_casb_dlp_rules.md)

**Delete constraint.** A label can be deleted only if it is not currently associated with
any policy rule. Attempting to delete a label that is still referenced returns an error from
the API. This is enforced at the API layer and will surface as a Terraform apply-time error
if a `zia_rule_labels` resource is destroyed while any rule resource still holds a
reference to it. The dependent rule must have its `labels` block cleared (and activation
applied) before the label itself can be removed. (Tier A —
vendor/zscaler-help/about-rule-labels.md)

**Activation.** ZIA requires explicit configuration activation after rule or resource
changes. When managing rule labels alongside rules via Terraform, include
`zia_activation_status` with `depends_on` pointing at all managed resources to trigger
activation after apply. (Tier B — references/zia/terraform.md)

---

## 4. Operational Use Patterns

### 4.1 Visual grouping in the admin console

The primary intended use case is visual organization: an admin assigns the same label to a
cohesive set of rules (for example, all rules belonging to a particular department,
regulatory scope, or location profile). The ZIA policy page collapses rules under their
shared label, making large rule tables manageable. Rules without a label collect under the
**Untagged** label automatically. (Tier A — vendor/zscaler-help/about-rule-labels.md)

The admin console Rule Labels page shows each label's **Name**, **Number of Policies and
Rules Tagged**, **Last Modified By**, **Last Modified On**, and **Description**.
Administrators can sort on any of these columns. From this page labels can be added,
searched, edited, duplicated, or deleted. (Tier A — vendor/zscaler-help/about-rule-labels.md)

### 4.2 Label-based API filtering

The `list_labels` endpoint's `search` parameter performs a server-side name search. The
`get_rule_type_label` endpoint allows filtering to only those labels associated with a
given policy category (e.g., `FIREWALL`, `URL_FILTERING`), which is useful when building
automation that operates on rules within a single policy domain. (Tier B —
vendor/zscaler-sdk-python/zscaler/zia/rule_labels.py)

The `FirewallPolicyAPI.list_rules` method in the Python SDK accepts a `rule_label` query
parameter, enabling server-side filtering of firewall rules by label. Whether equivalent
label-based filtering is available on other rule-type list endpoints is not confirmed from
available sources. (Tier B — references/zia/sdk.md)

### 4.3 Change management workflows

A common automation pattern is to assign a label corresponding to a change ticket or
deployment wave (e.g., `CHG-2024-11-003` or `wave-2`), create or update rules under that
label, then activate. Post-activation the label persists on the rules, providing a durable
tag for audit queries. The label can be renamed to reflect its final steady-state purpose
without disturbing rule references, because rule-to-label bindings are stored by ID.

Label duplication is available from the admin console (the Edit/Duplicate/Delete row
actions on the Rule Labels page), but duplication semantics — whether associated rule
references are copied — are not documented in available sources. (Open question — see
Section 7.)

### 4.4 Multi-policy-type labels

A single label object is shared across all policy types. The same label can simultaneously
tag a firewall rule, a DLP web rule, and a URL filtering rule. The `referencedRuleCount`
field reflects the total count across all policy types. There is no policy-type-scoping on
the label itself. (Tier B —
vendor/zscaler-sdk-python/zscaler/zia/models/rule_labels.py; vendor/terraform-provider-zia/
rule resource docs)

---

## 5. Constraints

### 5.1 Schema constraints

| Constraint | Value | Source |
|---|---|---|
| `name` required on create | Yes | SDK + TF |
| `description` optional | Yes | SDK + TF |
| Max `name` length | Not documented in available sources | Open question |
| Allowed characters in `name` | Not documented in available sources | Open question |
| Max `description` length | Not documented in available sources | Open question |
| Name uniqueness | Not confirmed from available sources | Open question |

(Tier B — vendor/zscaler-sdk-python/zscaler/zia/models/rule_labels.py;
vendor/terraform-provider-zia/docs/resources/zia_rule_labels.md)

### 5.2 Delete constraint

A label may only be deleted when its `referencedRuleCount` is zero. The API enforces this
constraint; the ZIA admin console surfaces it as: "You can delete a rule label only if it's
not associated with any policy rule." (Tier A — vendor/zscaler-help/about-rule-labels.md)

### 5.3 Maximum labels per rule and rules per label

No documented cap on the number of labels that can be assigned to a single rule, or the
number of rules a single label can reference, was found in available sources. (Open question
— see Section 7.)

---

## 6. Cross-Product Comparison: ZPA

ZPA does not have a feature analogous to ZIA Rule Labels. ZPA policy rules are organized
primarily by policy type (Access, Timeout, Forwarding, etc.) and do not support a shared
tagging construct equivalent to ZIA's `ruleLabels` resource. No `rule_label` or equivalent
endpoint or SDK service was found in the ZPA Python SDK or Terraform provider sources.
(Tier B — references/zpa/sdk.md reviewed; no label references found.)

---

## 7. Open Questions

The following items could not be resolved from the available vendor sources and are
registered as deferred questions in [`_meta/clarifications.md`](../_meta/clarifications.md).

| Clarification ID | Question |
|---|---|
| [`zia-26`](../_meta/clarifications.md#zia-26-rule-label-names-in-audit-log-entries) | Do label names appear in ZIA admin audit log entries for rule create/update operations? |
| [`zia-27`](../_meta/clarifications.md#zia-27-rule-label-name-field-constraints) | Are there character-set restrictions or maximum length constraints on the `name` field? |
| [`zia-28`](../_meta/clarifications.md#zia-28-rule-label-name-uniqueness-enforcement) | Is the `name` field unique within a ZIA tenant? Does the API reject duplicate names on create? |
| [`zia-29`](../_meta/clarifications.md#zia-29-rule-label-description-maximum-length) | What is the maximum allowed `description` length? |
| [`zia-30`](../_meta/clarifications.md#zia-30-rule-label-duplicate-action-semantics) | Does the "duplicate" action in the admin console copy label-to-rule associations, or create a fresh unassociated label copy? |
| [`zia-31`](../_meta/clarifications.md#zia-31-rule_label-filter-on-non-firewall-endpoints) | Is label-based filtering (`rule_label` query param) available on rule list endpoints other than firewall filtering? |
| [`zia-32`](../_meta/clarifications.md#zia-32-tenant-cap-on-rule-labels) | Is there a documented cap on the total number of rule labels per tenant? |

---

## 8. Cross-Links

- SDK service catalog: [references/zia/sdk.md](sdk.md) — `RuleLabelsAPI` section
- Terraform resource catalog: [references/zia/terraform.md](terraform.md) — `zia_rule_labels` section
- Open questions: [`_meta/clarifications.md`](../_meta/clarifications.md) — `zia-26` through `zia-32`
- Vendor help: `vendor/zscaler-help/about-rule-labels.md`
- Terraform registry (external): `https://registry.terraform.io/providers/zscaler/zia/latest/docs/resources/zia_rule_labels`
- API documentation (external): `https://help.zscaler.com/zia/rule-labels#/ruleLabels-get`
