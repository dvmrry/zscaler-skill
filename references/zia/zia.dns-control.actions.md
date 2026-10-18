{{console-actions}} Plain Block is silent, and which API enum value it maps to is open {{gap:block-returns-nxdomain}}. {{console-actions-current}} {{response-codes}} {{nxdomain-caution}}

**Redirects.** {{redirect-response}} {{redirect-protocol-translation}} {{resolve-by-zpa-scope}} {{logging-and-eun}}

{{api-enum}} {{validator-requirements}} {{validator-inactive}} Intended use cases for the redirect actions are open {{gap:redirect-use-cases}}. {{field-comments}} {{edns-general}}

**Block with a response.** {{block-response-code}} The API format of the response codes is open {{gap:block-response-code-values}}, and the SDKs word the trigger differently {{divergence:block-response-wording}}.

Whether redirectIp applies only to REDIR_RES {{gap:redirect-ip-binding}}, whether plain REDIR_REQ needs a gateway {{gap:redir-req-gateway}}, and whether ednsEcsObject must accompany zpaIpGroup {{gap:edns-ecs-zpa-pairing}} are all open.

DoH-specific actions and the DoH protocol value are discussed in [[zia.dns-control.doh]]; the ZPA resolver rules are in [[zia.dns-control.predefined-rules]] (no page states which API action they use). Wire keys and client behavior: [[zia.dns-control.api-rules]].
