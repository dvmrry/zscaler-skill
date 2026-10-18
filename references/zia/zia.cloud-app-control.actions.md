**Console actions.** {{console-actions}} Prerequisites for Isolate and Conditional are the same ones URL Filtering has: [[zia.url-filtering.actions]].

**Action strings.** {{actions-is-a-list}} {{action-string-shape}} {{isolate-not-mixed}}

**Finding the valid strings.** {{common-actions-in-console}} {{two-discovery-endpoints}} {{provider-prefers-all-endpoint}} {{python-has-only-old-endpoint}} Between v3.8.45 and the pin the Go name `AllAvailableActions` moved onto the new endpoint {{all-available-actions-reassigned}}. The Automate capture describes only the older discovery path {{automate-capture-availableactions-only}}. How the two endpoints differ is open {{gap:all-vs-available-differs}}, and so is what a multi-app request returns {{gap:multi-app-aggregation}}. Output-shape defects in the data source itself are in [[zia.terraform.data-source-fidelity]].

**Notifications.** {{no-custom-eun}} {{rule-notification-fields}} The two do not obviously agree {{gap:custom-eun-meaning}}.

**MCP workflow.** The Python docstring carries the per-category action lists, and two entries look misfiled {{python-docstring-action-vocabulary}}. The MCP tool forwards its inputs to the SDK {{mcp-actions-tool-forwards}}, which the workflow skill does not reflect {{divergence:mcp-representative-app-probing}}. The whole-create rejection is stated only by the MCP workflow skill {{mcp-skill-per-tuple-validation}}, and the product contract is open {{gap:per-tuple-validation-contract}}. Whether discovery needs a category representative app is also open {{gap:representative-app-actions}}.
