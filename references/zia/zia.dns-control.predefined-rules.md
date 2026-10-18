{{shipped-rules}} Through the API they are rule records with `predefined` true. {{predefined-flag}} The two pages list different sets; the newer page (2026-10-18) omits UCaaS One Click and the non-fallback resolvers; which applies to a tenant is unverified (divergence `rule-set`). {{current-list}} Check the tenant's records rather than assuming either list. If the Extranet feature is on, there is another. {{extranet-rule}}

They are editable within limits, so (inference, not stated by Zscaler) a first question about odd DNS behavior is whether someone changed them. {{modifiable-keep-high}} {{predefined-editing}}

The two ZPA resolvers are the DNS half of Source IP Anchoring; the forwarding half lives in Forwarding Control (see the shared Source IP Anchoring reference, `references/shared/source-ip-anchoring.md`). Check these in order when anchored traffic leaves from the wrong address:

1. Both resolvers enabled for the populations that use them. {{enable-each}}
2. The Road Warrior rule is above the Locations rule. {{road-warrior-above-locations}}
3. Road Warrior is not disabled. {{dont-disable-road-warrior}} The failure is quiet: traffic is not blocked, it takes the other pool.
4. DNS from clients actually reaches Zscaler. {{dns-must-reach-zscaler}}
5. For remote users: {{road-warrior-location}}
6. The fallback rules are normally off. {{fallback-resolvers}}

The deeper mechanism, what the answer looks like without the resolver rules, is not captured (gap `resolver-mechanism`). Reordering rules through Terraform has its own traps: [[zia.terraform.rule-order]]. General DNS Control prerequisites are in [[zia.dns-control]].
