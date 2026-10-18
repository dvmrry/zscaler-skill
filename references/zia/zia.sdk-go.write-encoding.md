These are claims about the Go SDK, the client, not about ZIA. The distinction matters: SDK code proves what the client sends and how it reacts; what ZIA does with that is server behavior that code alone cannot settle.

What the client does is clear. {{marshals-caller-struct}} {{rule-bools-omitted-when-false}} Whether that makes the field impossible to clear depends on how the rule endpoint treats an omitted field, and that is not established for rules.

For one endpoint the maintainers answered the question themselves. {{settings-bools-fixed-3-8-45}} That is strong evidence that ZIA keeps an omitted value there, and it is why the advanced-settings writes are full-state writes (see [[zia.url-filtering.advanced-settings]]). It is not evidence for rule endpoints, which still omit their false booleans.

Empty responses are a second client-side trap. {{empty-body-nil-nil}} {{rule-update-panics-on-empty-body}} The panic is conditional on the server's reply, so state it that way: a certain consequence of an empty body, not an observed failure.
