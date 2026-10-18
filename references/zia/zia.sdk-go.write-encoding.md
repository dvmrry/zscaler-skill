These are claims about the Go SDK, the client, not about ZIA. The distinction matters: SDK code proves what the client sends and how it reacts; what ZIA does with that is server behavior that code alone cannot settle.

**Updates and rule booleans.** {{marshals-caller-struct}} {{rule-bools-omitted-when-false}} Whether that makes a field impossible to clear is open {{gap:rule-omission-semantics}}.

**Settings booleans.** {{settings-bools-fixed-3-8-45}} The advanced-settings writes are full-state writes; see [[zia.url-filtering.advanced-settings]].

**Empty replies.** {{empty-body-nil-nil}} {{rule-update-panics-on-empty-body}} Whether the rule update endpoint ever answers with an empty body is open {{gap:rule-update-empty-body}}.
