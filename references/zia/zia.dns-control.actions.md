What a DNS rule can do depends on whether you are reading the console or the API. {{console-actions}} That page is older; the configuring page lists more. {{console-actions-current}} Plain Block gives no response; it is silent (the older reference said it returns NXDOMAIN or drops the query; see gap `block-returns-nxdomain` for the remaining mapping question). {{response-codes}} {{nxdomain-caution}}

Redirects: {{redirect-response}} {{redirect-protocol-translation}} {{resolve-by-zpa-scope}} {{logging-and-eun}}

The API is wider. {{api-enum}} Some actions need companion fields. {{validator-requirements}} Do not treat that as an API rule yet. {{validator-inactive}} Whether a rule missing a companion field is accepted, rejected or behaves oddly at the service is unverified; when diagnosing, check the companion field for the action first. Intended use cases (split DNS, sinkhole, steering) are unconfirmed (gap `redirect-use-cases`). Field meanings: {{field-comments}} {{edns-general}}

Block with a response: {{block-response-code}} The console codes are known but their API format is not (gap `block-response-code-values`), and the SDKs word the trigger differently (divergence `block-response-wording`). Open binding questions: `redirect-ip-binding`, `redir-req-gateway`, `edns-ecs-zpa-pairing`.

DoH-specific actions and the DoH protocol value are discussed in [[zia.dns-control.doh]]; the ZPA resolver rules are in [[zia.dns-control.predefined-rules]] (no page states which API action they use). Wire keys and client behavior: [[zia.dns-control.api-rules]].
