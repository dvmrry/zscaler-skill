# URL category API behavior beyond the field list: delete, lookup and the keyword quota figure (zia.api.url-categories-wire)
Also called: url category delete fails; urlLookup 100 urls; SecurityAlert urlLookup; stale keyword quota 30 per category; custom category val editable

The API guide for URL categories holds a few behaviors beyond the field list. The entry syntax and quotas of the console are in [What a URL category entry may contain, and category limits](kb:zia.url-categories.entry-format), and the lookup's relation to cloud applications in [What a Cloud App Control rule matches on](kb:zia.cloud-app-control.rule-criteria).

**Delete.** Predefined URL categories cannot be deleted, and deleting a custom category that a URL policy or NSS feed uses fails. [zia.api.url-categories-wire:delete-blocked-when-referenced]

**Lookup.** POST /urlLookup takes up to 100 URLs per request and each URL may be at most 1,024 characters. [zia.api.url-categories-wire:urllookup-limits] Custom URL classification is not returned by a lookup, and URLs not in a predefined category come back as MISCELLANEOUS_OR_UNKNOWN. [zia.api.url-categories-wire:urllookup-custom-omitted] The /urlLookup response carries a SecurityAlert field whose values include, but are not limited to, a published list such as PHISHING, BOTNET, MALWARE_SITE and PAGE_RISK_INDEX. [zia.api.url-categories-wire:urllookup-security-alert]

**Keyword quota.** The URL Categories API guide says up to 30 keywords per category and up to 1,000 across all categories. [zia.api.url-categories-wire:keyword-quota-pdf] The Ranges and Limitations article allows 256 custom keywords per category, with a maximum of 2,048 across all categories. [zia.api.url-categories-wire:keyword-quota-ranges] The two figures disagree [divergence:zia.api.url-categories-wire:keyword-quota-figures].

**Write shape.** What the API does with echoed server-assigned fields is open [gap:zia.api.url-categories-wire:server-fields-on-write].

What to check:
1. Whether a delete failed because the category is still referenced by a URL policy or NSS feed.
2. Which keyword quota figure applies: the Ranges and Limitations table, not the older 30 and 1,000 in the API guide.
3. Whether a lookup batch stays within 100 URLs of at most 1,024 characters, and that custom classifications never appear in the answer.

Sources disagree (name both sides):
- The URL Categories API guide and the Ranges and Limitations article give different keyword quotas. [divergence:zia.api.url-categories-wire:keyword-quota-figures]
  - zscaler-help: Up to 30 keywords per category and up to 1,000 across all categories.
  - zscaler-help: 256 keywords per category and a maximum of 2,048 across all categories.
  Impact: Planning keyword-heavy categories on the PDF figure under-counts the capacity the limits article gives; the limits article is the maintained table.

Not known (open gaps):
- What the API does with server-assigned category fields sent on update [gap:zia.api.url-categories-wire:server-fields-on-write]: settled by lab-test or support-ticket. Blocks: Whether a read-modify-write of a category can send these fields back safely.

Area: zia.api, its subjects in references/_meta/spine/zia/zia.api.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/shared/shared.oneapi.authentication.md (How a client gets and uses a OneAPI access token), from zia.api: OneAPI uses the OAuth 2.0 Client Credentials flow, with Authentication Service, Zscaler's unified identity platform, as the authorization server: a client exchanges its credentials at the token endpoint for an access token, with no user authentication involved. [shared.oneapi.authentication:client-credentials-flow]
- links-to references/_meta/text/zia/zia.cloud-app-control.rule-criteria.md (What a Cloud App Control rule matches on)
- links-to references/_meta/text/zia/zia.url-categories.entry-format.md (What a URL category entry may contain, and category limits)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/zia/zia.api.md (The ZIA API from a client's side: activation, limits, SDK coverage and wire notes)
