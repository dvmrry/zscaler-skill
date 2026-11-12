# Which URL category a URL belongs to (zia.url-categories.membership)
Also called: specificity rule; most specific category wins; custom category precedence; wildcard vs exact category; retain parent category; predefined vs custom category; which url category is a site in; is a site covered by a url category; url category for a domain
Former IDs: zia-01, zia-02

Category membership is resolved before rules are walked: a rule matches a URL through the category the URL resolved to, not through every category with a matching entry. [zia.url-categories.membership:resolved-before-rules]

**Resolution.** When a URL matches entries in more than one custom category, the category with the more specific matching entry wins, and rules referencing the less specific (wildcard) category do not apply to that URL, regardless of rule order. [zia.url-categories.membership:specific-entry-wins] Whether two equally specific entries in different custom categories resolve is open [gap:zia.url-categories.membership:same-specificity-collision]. How entries match, including what counts as "more specific", is in [How URL category entries match requests (wildcards)](kb:zia.url-categories.entry-matching).

**Predefined and custom.** When a URL is added manually to a category, the admin chooses whether it also keeps its original (parent) category. [zia.url-categories.membership:retain-parent-choice] A URL that retains its parent category is covered both by rules referencing the custom category and by rules referencing its original predefined category, so rule order decides which fires. The API holds these URLs in `dbCategorizedUrls`, separate from `urls`. [zia.url-categories.membership:retain-parent-both-match] A URL added to a custom category without retaining its parent is covered by the custom category instead of its original predefined category, so rules on the predefined category stop matching it. [zia.url-categories.membership:without-retain-parent] The API reports retained entries per category through `urlsRetainingParentCategoryCount` and `ipRangesRetainingParentCategoryCount`; there is no `patternsRetainingParentCategoryCount` or `keywordsRetainingParentCategoryCount` field, and the keyword count is `retainParentKeywordCount`. [zia.url-categories.membership:retain-parent-counters] URLs that match custom keywords are added to the custom category but are not retained under their original parent category, while URLs that match keywords retaining parent category are added to the custom category and also retained under their original parent category. IP ranges added to custom IP ranges do not remain mapped to the parent category in the Zscaler URL database, and IP ranges retaining parent category remain mapped to their parent category. [zia.url-categories.membership:keyword-and-range-parent] If already categorized URLs or IP addresses are added to the Miscellaneous or Unknown category in the URLs retaining parent category field, the system categorizes them only under the pre-existing URL category and not under Miscellaneous or Unknown. Keywords retaining parent category and IP ranges retaining parent category on URLs or IP ranges belonging to Miscellaneous or Unknown categorize them only under the respective URL category and not under Miscellaneous or Unknown. [zia.url-categories.membership:misc-unknown-retain-parent] For a transaction, if a TLD matches a custom URL that is linked to a parent category, it matches only the URL categories (the predefined parent category and the custom category) and not the TLD category. In the page's example, the FQDN www.yahoo.co.jp matches only the predefined category (Web Search) and the custom category (Yahoo Japan), not the custom TLD category (Japan). [zia.url-categories.membership:tld-vs-custom-url]

**Managing custom categories.** The Review Matches drop-down menu shows whether the URLs or wildcard domains added in a custom URL category match any other custom categories with either the corresponding wildcard or a specific match, and a matching category can be chosen to add the URLs or wildcard domains to it. [zia.url-categories.membership:review-matches] Who can manage a category is in [Who can manage a custom URL or TLD category: roles and operational scope](kb:zia.url-categories.admin-scope), bulk changes through the tool are in [Bulk URL Upload tool: file operations, config file and exit codes](kb:zia.url-categories.bulk-upload), and checking or disputing a category is in [Looking up and disputing a URL's category: URL Lookup and Site Review](kb:zia.url-categories.lookup).

**Predefined membership.** Which predefined categories a URL belongs to is open [gap:zia.url-categories.membership:predefined-membership]. Bare IP addresses are usually not placed in predefined categories, unless a SaaS or cloud provider dedicates the IP or range to one application. [zia.url-categories.membership:ip-rarely-categorized]

Rule-side mechanics, once membership is known, are in [URL Filtering rule order and first match](kb:zia.url-filtering.rule-order).

What to check:
1. Whether moving an entry from a wildcard to an exact form changes which rule wins, since rules on the less specific category stop applying to that URL.
2. Which setting applies to a precedence question that involves a predefined and a custom category, read from the retained-entry counters or the dbCategorizedUrls list.
3. Whether an earlier rule on a predefined category matches the URL, which needs a live lookup, so the answer stops there rather than skipping to a later rule.

Inferred, not quoted (say so when an answer rests on one):
- [zia.url-categories.membership:resolved-before-rules] Tier B: Chain of evidence: the specificity examples show a higher-ordered wildcard rule not applying, which first-match ordering alone cannot explain.

Not known (open gaps):
- Two custom categories with equally specific matching entries [gap:zia.url-categories.membership:same-specificity-collision]: settled by lab-test or tenant-data. Blocks: deterministic precedence answers when admins have overlapping custom categories
- Which predefined categories a URL belongs to [gap:zia.url-categories.membership:predefined-membership] (data gap): filled by live; run `zscalerctl zia url-lookup <host>`

Area: zia.url-categories, its subjects in references/_meta/spine/zia/zia.url-categories.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.url-categories.entry-matching.md (How URL category entries match requests (wildcards)): An exact entry is more specific than a wildcard entry: for `atlanta.example.com`, a category holding `atlanta.example.com` outranks one holding `.atlanta.example.com` or `.example.com`. [zia.url-categories.entry-matching:exact-beats-wildcard]
- interacts-with references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match): A URL that retains its parent category is covered both by rules referencing the custom category and by rules referencing its original predefined category, so rule order decides which fires. The API holds these URLs in `dbCategorizedUrls`, separate from `urls`. [zia.url-categories.membership:retain-parent-both-match]
- logged-in references/_meta/text/zia/zia.logs.web-rule-attribution.md (Which rule decided a web transaction, from the logs): Because a logged transaction carries both the URL's category and the source of that categorization, the logs show which category a URL was actually placed in, for URLs that have been seen. [zia.logs.web-rule-attribution:category-membership-from-logs]
- links-to references/_meta/text/zia/zia.url-categories.admin-scope.md (Who can manage a custom URL or TLD category: roles and operational scope)
- links-to references/_meta/text/zia/zia.url-categories.bulk-upload.md (Bulk URL Upload tool: file operations, config file and exit codes)
- links-to references/_meta/text/zia/zia.url-categories.lookup.md (Looking up and disputing a URL's category: URL Lookup and Site Review)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/types/zia/url-categories.md (config type)
- configured-via references/_meta/text/zia/zia.api.url-categories-wire.md (URL category API behavior beyond the field list: delete, lookup and the keyword quota figure)
- configured-via references/_meta/text/zia/zia.terraform.url-categories.md (Terraform custom and predefined URL category resources)
- configured-via references/_meta/text/types/zia/url-filtering-rules.md (config type)
