**Console actions.** {{console-actions}} Prerequisites for Isolate and Conditional are the same ones URL Filtering has: [[zia.url-filtering.actions]].

**Action strings.** In the API a rule does not carry one action; it carries a list. {{actions-is-a-list}} {{action-string-shape}} {{isolate-not-mixed}}

**Finding the valid strings.** The valid set depends on the application and rule type, so discover it rather than writing strings by hand. {{common-actions-in-console}} {{two-discovery-endpoints}} {{provider-prefers-all-endpoint}} {{python-has-only-old-endpoint}} Two things are open: how the two endpoints differ (gap `all-vs-available-differs`), and what a multi-app request returns (gap `multi-app-aggregation`). For anything that must be exact, ask for one app at a time. Output-shape defects in the data source itself are in [[zia.terraform.data-source-fidelity]].

**Notifications.** {{no-custom-eun}} {{rule-notification-fields}} The two do not obviously agree (gap `custom-eun-meaning`); do not tell an operator that a template set on a CAC rule will or will not be shown without testing.
