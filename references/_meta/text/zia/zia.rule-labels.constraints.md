# ZIA rule label limits and constraints (zia.rule-labels.constraints)
Also called: rule label name length; rule label description length; rule label limit; max rule labels; duplicate label names; rule label name unique; 1024 labels
Former IDs: zia-27, zia-28, zia-29, zia-32

Sizes first. The Ranges & Limitations page lists "Rule Labels" at 1,024 labels, in the group of limits headed "All Policy Rule Types". [zia.rule-labels.constraints:tenant-limit-listed] What that number counts is not clear from the page (gap `tenant-cap`), and there is a separate per-rule question (gap `per-rule-label-cap`), so size label schemes well under 1,024 until it is settled.

**Provider length checks.** The Terraform provider rejects a label `name` longer than 255 characters and a `description` longer than 10240 characters before calling the API. [zia.rule-labels.constraints:terraform-length-validation] In the console Help, a rule label has a Name and an optional Description that cannot exceed 10,240 characters. [zia.rule-labels.constraints:console-description-limit] Whether the server enforces the same lengths is open [gap:zia.rule-labels.constraints:description-max-length].

**Names.** Nothing registered restricts the characters in a name [gap:zia.rule-labels.constraints:name-charset]. Whether names must be unique is open [gap:zia.rule-labels.constraints:name-uniqueness].

The provider documentation and its schema disagree on whether `name` is required [divergence:zia.rule-labels.constraints:name-required].

For what the API exposes and how name lookups behave, see [ZIA rule label API surface](kb:zia.rule-labels.api-surface); for the rule type whose provider docs set a per-rule limit, [Which ZIA rule types accept rule labels](kb:zia.rule-labels.rule-types).

What to check:
1. Whether label names are unique in the tenant: key on the label ID, not the name, since names may not be unique.
2. Whether `name` is set on every label, since the provider documentation and its schema disagree on whether it is required.

Sources disagree (name both sides):
- The provider documentation calls `name` required while the provider schema marks it optional. [divergence:zia.rule-labels.constraints:name-required]
  - tf-zia: name is required.
  - tf-zia: The schema entry for name sets Optional with a length check, not Required.
  Impact: A configuration without `name` may pass Terraform validation and fail at the API, or create an unnamed label; the contract's own requirement is not stated in the pinned OpenAPI (the create operation has no request body schema).

Not known (open gaps):
- Allowed characters in a rule label name [gap:zia.rule-labels.constraints:name-charset]: settled by lab-test. Blocks: generating label names from ticket IDs or free text without rejections
- Whether label names must be unique in a tenant [gap:zia.rule-labels.constraints:name-uniqueness]: settled by lab-test. Blocks: relying on name lookups, imports by name and Terraform data sources returning one label
- Server-side maximum length of a label description [gap:zia.rule-labels.constraints:description-max-length]: settled by lab-test. Blocks: stating the true limit rather than the provider's
- Whether the 1,024 Rule Labels figure is a tenant-wide cap [gap:zia.rule-labels.constraints:tenant-cap]: settled by lab-test or support-ticket. Blocks: capacity planning for labels used as ticket or wave tags
- Maximum labels on one rule, and rules per label [gap:zia.rule-labels.constraints:per-rule-label-cap]: settled by lab-test or support-ticket. Blocks: stacking several labels on a rule

Area: zia.rule-labels, its subjects in references/_meta/spine/zia/zia.rule-labels.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.rule-labels.api-surface.md (ZIA rule label API surface)
- links-to references/_meta/text/zia/zia.rule-labels.rule-types.md (Which ZIA rule types accept rule labels)
