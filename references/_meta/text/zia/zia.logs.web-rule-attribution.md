# Which rule decided a web transaction, from the logs (zia.logs.web-rule-attribution)
Also called: which rule fired in the logs; rulelabel empty; urlfilterrulelabel; apprulelabel; validate precedence with logs; siem rule attribution
Former IDs: log-05

Logs are the empirical check on a precedence answer, but the obvious field is a trap. `rulelabel` and `ruletype` are filled only when a Block rule applied; an allowed transaction has neither, so an empty `rulelabel` does not mean no rule matched. [zia.logs.web-rule-attribution:rulelabel-block-only] Use the per-layer fields instead. URL Filtering and Cloud App Control each have their own rule-name field (`urlfilterrulelabel`, `apprulelabel`), so one record can name both when both layers evaluated, and the allow-side rule is visible there even when `rulelabel` is empty. [zia.logs.web-rule-attribution:separate-layer-labels]

**URL category in logs.** `urlcat` records the category of the transaction's destination URL, and `urlcatmethod` records the source of that categorization. [zia.logs.web-rule-attribution:category-source] Because a logged transaction carries both the URL's category and the source of that categorization, the logs show which category a URL was actually placed in, for URLs that have been seen. [zia.logs.web-rule-attribution:category-membership-from-logs] That is the offline substitute for the predefined-membership gap in [Which URL category a URL belongs to](kb:zia.url-categories.membership), as long as the URL has been seen.

What action shows when several policy layers weigh in on one transaction, and its full set of values, is open [gap:zia.logs.web-rule-attribution:action-values-precedence].

What to check:
1. Which field names the SIEM stores for the NSS web log fields, before writing a query against them.
2. Whether a URL's category in the logs (`urlcat`, `urlcatmethod`) answers the membership question for that URL, once the URL has been seen.

Inferred, not quoted (say so when an answer rests on one):
- [zia.logs.web-rule-attribution:separate-layer-labels] Tier B: The fields are documented separately; that both can be filled in one record follows from both policies evaluating one transaction.
- [zia.logs.web-rule-attribution:category-membership-from-logs] Tier B: Inference from the field descriptions; the source does not describe reading category membership from logs.

Not known (open gaps):
- Full set of action values and which subsystem fills action [gap:zia.logs.web-rule-attribution:action-values-precedence] (data gap): filled by operator; settled by tenant-data. Blocks: Counting blocks with action equal to Blocked, or using action to attribute a decision to one policy layer.

Area: zia.logs, its subjects in references/_meta/spine/zia/zia.logs.json

Linked (open a file only if the answer needs it):
- interacts-with references/_meta/text/zia/zia.cloud-app-control.precedence.md (Cloud App Control versus URL Filtering: which applies): URL Filtering and Cloud App Control each have their own rule-name field (`urlfilterrulelabel`, `apprulelabel`), so one record can name both when both layers evaluated, and the allow-side rule is visible there even when `rulelabel` is empty. [zia.logs.web-rule-attribution:separate-layer-labels]
- links-to references/_meta/text/zia/zia.url-categories.membership.md (Which URL category a URL belongs to)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.url-filtering.rule-order.md (URL Filtering rule order and first match)
- see-also references/_meta/text/zia/zia.url-filtering.md (ZIA URL Filtering)
- see-also references/_meta/text/zia/zia.cloud-app-control.md (ZIA Cloud App Control)
