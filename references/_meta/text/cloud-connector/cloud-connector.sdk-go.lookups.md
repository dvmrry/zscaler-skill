# How the Go SDK's ZTW packages find objects by name and filter lists (cloud-connector.sdk-go.lookups)
Also called: ztw GetByName; ztw name lookup case insensitive; ztw jmespath filter; ContextWithJMESPath ztw; GetEcGroupLiteByName; ztw lite name filter

ZTW list calls go through one paging helper, and name lookups are built on the list calls. How that helper pages and when it stops early is in [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination); this subject covers what it does after paging and how name lookups match.

**Client-side filter.** After collecting every page, the ZTW `ReadAllPages` helper filters the whole list with a JMESPath expression taken from the context (`ApplyJMESPathFromContext`); a caller sets the expression with `ContextWithJMESPath`. [cloud-connector.sdk-go.lookups:read-all-pages-applies-jmespath]

**Name lookups.** A ZTW name lookup such as the connector group's `GetByName` or the forwarding rule's `GetRulesByName` lists the whole collection through `ReadAllPages` and returns the first item whose name matches with `strings.EqualFold`, a case-insensitive comparison. [cloud-connector.sdk-go.lookups:name-lookup-lists-then-matches] The other ZTW name lookups (gateways, locations, location templates, account groups, public cloud info, supported regions, DNS and log rules, IP and network service groups, provisioning URLs, workload groups) follow the same list-then-case-insensitive-match pattern; the admin role lookup reads one unpaged list instead, and the ZPA-resources lookup sends a `search` parameter and pages itself. [cloud-connector.sdk-go.lookups:same-pattern-elsewhere] The connector group lite and location lite name lookups (`GetEcGroupLiteByName`, `GetLocationLiteByName`) add the name as a `name` query parameter on the lite endpoint, then still check the results with the same case-insensitive match. [cloud-connector.sdk-go.lookups:lite-lookups-send-name]

**Consequences.** Because the filter runs inside `ReadAllPages`, a JMESPath expression on the context also narrows the list a name lookup searches, so a lookup made with such a context can report an existing object as not found. [cloud-connector.sdk-go.lookups:jmespath-narrows-name-lookup] When two objects' names differ only in case, a name lookup returns whichever the list returns first, which may not be the one the caller meant. [cloud-connector.sdk-go.lookups:case-only-duplicates] A lookup can also miss an object that a truncated list leaves out: [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination).

What to check:
1. Whether the context passed to a name lookup carries a JMESPath expression, which filters the list the lookup searches.
2. Whether two objects have names that differ only in case before trusting a name lookup's result.

Inferred, not quoted (say so when an answer rests on one):
- [cloud-connector.sdk-go.lookups:same-pattern-elsewhere] Tier B: Search of every ByName function under zscaler/ztw/services at the pin.
- [cloud-connector.sdk-go.lookups:jmespath-narrows-name-lookup] Tier B: Chain of evidence from the helper and lookup code; not run.
- [cloud-connector.sdk-go.lookups:case-only-duplicates] Tier B: Whether the ZTW API allows names that differ only in case is not shown by any source.

Area: cloud-connector.sdk-go, its subjects in references/_meta/spine/cloud-connector/cloud-connector.sdk-go.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early): The ZTC (ztw) `ReadAllPages` helper requests `pageSize=1000` on every page and stops at the first page with fewer than 1000 items. [shared.sdk-go.list-pagination:ztw-stops-on-page-shorter-than-1000]
