Each query can carry a request-stage and a response-stage rule and action. {{request-response-pairs}} {{reqaction-examples}} The value sets and whether both fire together are open {{gap:action-enum-open}}.

**Response value.** {{res-ip-or-name}} How to tell an address from a sentinel is open {{gap:res-sentinels-open}}.

**Errors.** {{error-meaning}} {{empty-resp-both}} The mapping to standard response codes is open {{gap:error-rcode-open}}.

**Categories.** {{request-vs-response-category}} Which one decides when they disagree is open {{gap:category-precedence-open}}.

Field naming and encodings are in [[zia.logs.dns-record-fields]]; the gateway outcome fields are in [[zia.logs.dns-gateway-fields]]; the policy that produces these actions is in [[zia.dns-control.actions]].
