# ZIA rule label API surface (zia.rule-labels.api-surface)
Also called: ruleLabels endpoint; rule label fields; get_rule_type_label; ruleType endpoint; list_labels; referencedRuleCount; GetRuleLabelByName

The OpenAPI contract defines list and create on `/ruleLabels` and get, update and delete on `/ruleLabels/{ruleLabelId}`. [zia.rule-labels.api-surface:crud-endpoints] The label itself is small and its server-set members are fixed: `lastModifiedTime`, `lastModifiedBy` and `createdBy` are documented read-only (ignored by PUT) in the Go SDK; `lastModifiedTime` is also documented as ignored by DELETE. `referencedRuleCount` is documented as the number of rules that reference the label. [zia.rule-labels.api-surface:read-only-fields]

Listing: The OpenAPI contract gives the label list two query parameters, `page` and `pageSize`; its text says the default page size is 100 and the maximum 1000 while the schema default is 250. [zia.rule-labels.api-surface:list-params] The Go SDK `GetAll` reads every page of `/zia/api/v1/ruleLabels` through the shared page reader. [zia.rule-labels.api-surface:go-getall-paginates] Page boundaries and truncated reads are covered in [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination). The Python SDK documents one more parameter on the list calls, which the contract does not [divergence:zia.rule-labels.api-surface:list-search-param]. In Go the lookup by name is local: The Go SDK finds a label by name client-side: it lists every label and returns the first whose name equals the argument ignoring case, so a name lookup is case-insensitive and returns one label even if several match. [zia.rule-labels.api-surface:go-name-lookup]

**One call in a single SDK.** The Python SDK has a method that calls `GET /zia/api/v1/ruleLabels/ruleType/{rule_type}`; the OpenAPI contract defines no such path and the Go SDK label package has no corresponding function. [zia.rule-labels.api-surface:python-ruletype-endpoint] Whether that call is a stable surface is open [gap:zia.rule-labels.api-surface:rule-type-endpoint-backing].

What to check:
1. Whether a script uses only the contract calls for labels, since the Python-only ruleType call is unconfirmed.
2. Whether `referencedRuleCount` is read as a count of the rules that reference the label, before a delete.
3. Whether label names are unique before relying on a name: do not infer uniqueness from the by-name lookup.
4. Whether the Python `search` parameter on the label list filters by name before relying on it, since the server honouring it is not shown.

Inferred, not quoted (say so when an answer rests on one):
- [zia.rule-labels.api-surface:python-ruletype-endpoint] Tier B: Absence claim: the path keys of zia.openapi.json contain `/ruleLabels` and `/ruleLabels/{ruleLabelId}` only, and the Go file defines Get, GetRuleLabelByName, Create, Update, Delete and GetAll.

Sources disagree (name both sides):
- The Python SDK documents a `search` parameter on the label list that the OpenAPI contract does not define. [divergence:zia.rule-labels.api-surface:list-search-param]
  - sdk-python: list_labels accepts a `search` query parameter for filtering results.
  - api-specs: The list takes `page` and `pageSize` only.
  Impact: Do not assume a server-side name search. Whether `search` filters by name, and whether the server honours it, is not shown; the Go SDK's own name lookup filters client-side.

Not known (open gaps):
- Whether the ruleType label endpoint is a stable REST surface [gap:zia.rule-labels.api-surface:rule-type-endpoint-backing]: settled by lab-test or source-read. Blocks: building automation on get_rule_type_label

Area: zia.rule-labels, its subjects in references/_meta/spine/zia/zia.rule-labels.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
