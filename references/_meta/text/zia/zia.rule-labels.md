# ZIA Rule Labels (zia.rule-labels)
Also called: rule labels; rule label; policy label; label a rule; untagged label; ruleLabels; zia_rule_labels; tag policy rules

A rule label is an organizational group for policy rules: the feature has two parts, creating labels and associating them with policy rules. [zia.rule-labels:purpose] On the policy page, rules associated with a label are grouped under it and the group can be collapsed or hidden; rules with no label are grouped under the Untagged label. [zia.rule-labels:grouped-on-policy-page] The Rule Labels page (Internet Access > Resources > Rule Labels) lists each label with Name, Number of Policies and Rules Tagged, Last Modified By, Last Modified On and Description, sortable, and offers search, table modification, add, edit and delete. [zia.rule-labels:console-page]

**Tagging and matching.** The label object holds an id, name, description and audit fields plus a count of referencing rules; it has no member for match criteria, action or order, so tagging a rule adds grouping metadata and does not by itself change how the rule matches. [zia.rule-labels:label-model-is-metadata-only] Rule order and rank are decided elsewhere ([URL Filtering rule order and first match](kb:zia.url-filtering.rule-order), [Firewall rule order, admin rank and predefined rules](kb:zia.firewall.rule-order), [How the ZIA Terraform provider applies rule order](kb:zia.terraform.rule-order)).

1. **Which rule types can carry a label, and how do rules reference one?** [Which ZIA rule types accept rule labels](kb:zia.rule-labels.rule-types).
2. **What does the API expose, and which calls are only in one SDK?** [ZIA rule label API surface](kb:zia.rule-labels.api-surface).
3. **Why can't I delete this label?** [Deleting a ZIA rule label](kb:zia.rule-labels.delete), and for Terraform destroys [How the ZIA Terraform provider detaches references before deleting objects](kb:zia.terraform.delete-detach).
4. **What are the limits on names, descriptions and counts?** [ZIA rule label limits and constraints](kb:zia.rule-labels.constraints).

**Traffic logs.** The `*rulelabel` fields of the NSS web log carry the name of the rule that applied, not a Rule Label object; the field list shows no field for rule labels. [zia.rule-labels:web-log-rulelabel-fields-are-rule-names] For which of those fields fills in when, see [Which rule decided a web transaction, from the logs](kb:zia.logs.web-rule-attribution). Whether the audit log records label names is open [gap:zia.rule-labels:audit-log-label-names]. Terraform writes that stage rather than publish are covered in [When the ZIA Terraform provider activates configuration](kb:zia.terraform.activation).

The "duplicate" action in older notes is open [gap:zia.rule-labels:duplicate-action].

What to check:
1. Which console path leads to the Rule Labels page, before looking for a label.
2. Whether a label is in traffic logs: it is not, since the `*rulelabel` fields carry rule names, so read the per-rule fields instead.

Inferred, not quoted (say so when an answer rests on one):
- [zia.rule-labels:label-model-is-metadata-only] Tier B: Absence claim: the Go SDK struct is the whole model (id, name, description, lastModifiedTime, lastModifiedBy, createdBy, referencedRuleCount) and the OpenAPI response schema has the same members; the effect on enforcement is inferred from that, not stated by a source.
- [zia.rule-labels:web-log-rulelabel-fields-are-rule-names] Tier B: Absence claim over the captured NSS web-log field table: no field description mentions a Rule Label object.

Not known (open gaps):
- Whether the console can duplicate a label and what it would copy [gap:zia.rule-labels:duplicate-action]: settled by lab-test. Blocks: saying whether a duplicated label carries over rule associations
- Whether ZPA has a rule-label feature [gap:zia.rule-labels:zpa-no-analogue]: settled by source-read or support-ticket. Blocks: saying ZPA policy cannot be grouped by label
- Whether label names appear in admin audit log entries for rule changes [gap:zia.rule-labels:audit-log-label-names]: settled by tenant-data or lab-test. Blocks: using the audit log to trace which label a rule change added

Area: zia.rule-labels, its subjects in references/_meta/spine/zia/zia.rule-labels.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zia/zia.firewall.rule-order.md (Firewall rule order, admin rank and predefined rules)
- links-to references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs)
- links-to references/_meta/text/zia/zia.rule-labels.api-surface.md (ZIA rule label API surface)
- links-to references/_meta/text/zia/zia.rule-labels.constraints.md (ZIA rule label limits and constraints)
- links-to references/_meta/text/zia/zia.rule-labels.delete.md (Deleting a ZIA rule label)
- links-to references/_meta/text/zia/zia.rule-labels.rule-types.md (Which ZIA rule types accept rule labels)
- links-to references/_meta/text/zia/zia.terraform.activation.md (When the ZIA Terraform provider activates configuration)
- links-to references/_meta/text/zia/zia.terraform.delete-detach.md (How the ZIA Terraform provider detaches references before deleting objects)
- links-to references/_meta/text/zia/zia.terraform.rule-order.md (How the ZIA Terraform provider applies rule order)
- links-to references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match)
