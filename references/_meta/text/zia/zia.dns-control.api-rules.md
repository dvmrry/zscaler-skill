# DNS Control rule resource over the API (zia.dns-control.api-rules)
Also called: firewallDnsRules; firewall dns rules api; dns rule put replace; isWebEUNEnabled; isWebEunEnabled; zpaIpGroup omitempty; enabled to state dns rule; dns rule protocols enum

DNS rules use the dedicated endpoint `/zia/api/v1/firewallDnsRules`, separate from Firewall Filtering. [zia.dns-control.api-rules:endpoint] Updating a DNS rule is a PUT full replacement, not a patch. [zia.dns-control.api-rules:update-is-put] The MCP update tool builds its payload from the supplied fields and sends it straight to the SDK `update_rule`; it does not read the existing rule first. [zia.dns-control.api-rules:mcp-update-no-readback]

**Field encodings.**
- **State.** The Python SDK converts the `enabled` boolean to the wire field `state` with `ENABLED` or `DISABLED`. [zia.dns-control.api-rules:enabled-to-state]
- **Protocols.** The `protocols` values documented in the Go struct are `ANY_RULE`, `SMRULEF_CASCADING_ALLOWED`, `TCP_RULE`, `UDP_RULE`, `DOHTTPS_RULE`; the Python docstring gives only TCP, UDP, DOHTTPS as examples. [zia.dns-control.api-rules:protocols-enum]
- **ZPA IP group.** In Go, `zpaIpGroup` has no `omitempty`, so it is serialized even when nil. [zia.dns-control.api-rules:zpa-ip-group-always-sent]
- **Id-bearing objects in Python.** The Python SDK's request-side id remapping list does not include `dns_gateway`, `zpa_ip_group` or `edns_ecs_object`, so a scalar id given for them is sent as-is rather than wrapped as `{id: ...}`, while the response parser reads them back as objects. [zia.dns-control.api-rules:python-id-wrapping] The Python model assigns `edns_ecs_object` twice, first as a `ResourceReference` and then overwrites it with `CommonBlocks`, so the effective parse type is `CommonBlocks`. [zia.dns-control.api-rules:python-edns-type]

**Category sets.** The sources disagree on whether the request and response category lists must match [divergence:zia.dns-control.api-rules:category-sets-must-match], and whether the API accepts unequal sets is open [gap:zia.dns-control.api-rules:category-mismatch-acceptance].

The Web EUN flag is spelled differently across clients [divergence:zia.dns-control.api-rules:web-eun-key]. Go emits `isWebEUNEnabled` with `omitempty`, so an explicit false is not sent. [zia.dns-control.api-rules:go-web-eun-omitempty] Recorded Python integration responses from the DNS rules endpoint carry the key as `isWebEUNEnabled`. [zia.dns-control.api-rules:recorded-uppercase-eun] The ZIA Ansible module passes `is_web_eun_enabled` into the Python SDK's `update_rule`. [zia.dns-control.api-rules:ansible-uses-python] Terraform provider v4.8.2 upgraded to Go SDK v3.8.44 to pick up the corrected `isWebEUNEnabled` key, and its `is_web_eun_enabled` attribute is expanded into the Go model field `IsWebEUNEnabled`. [zia.dns-control.api-rules:provider-web-eun-corrected-field] What an omitted or explicit false does on update is open [gap:zia.dns-control.api-rules:web-eun-false]. The Go-wide version is in [How the Go SDK encodes ZIA writes (omitted zero values, empty responses)](kb:zia.sdk-go.write-encoding) and [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes).

Which companion fields each action needs, and the action enum, are in [DNS Control actions and what each API action requires](kb:zia.dns-control.actions). Terraform detach and group-delete behavior for DNS rules is in [How the ZIA Terraform provider detaches references before deleting objects](kb:zia.terraform.delete-detach). Rule ordering through Terraform is in [How the ZIA Terraform provider applies rule order](kb:zia.terraform.rule-order).

What to check:
1. Whether an update sends every field, since a PUT replaces the rule and the MCP update tool does not read it first.
2. Which spelling of the Web EUN flag a client sends, since the clients differ.
3. Whether a protocols value is one the Go struct documents, since the Python docstring lists fewer.

Inferred, not quoted (say so when an answer rests on one):
- [zia.dns-control.api-rules:mcp-update-no-readback] Tier B: Rests on reading the tool: no get call appears before update_rule in the function. The omission semantics of build_rule_payload were not read.
- [zia.dns-control.api-rules:python-id-wrapping] Tier B: Rests on the absence of the three keys from reformat_params in zscaler/utils.py, found by searching that list; the transform's behavior for unlisted keys was not re-read.

Sources disagree (name both sides):
- Spelling of the Web EUN wire key [divergence:zia.dns-control.api-rules:web-eun-key]
  - sdk-go: The API value is isWebEUNEnabled; Go was fixed to that in 3.8.44.
  - sdk-python: The Python request dictionary emits isWebEunEnabled.
  Impact: Python and Ansible callers may send a key the API does not recognise, so Web EUN writes may be rejected or ignored (the Go changelog says the misspelling caused payload errors on POST/PUT); compare by reading the rule back.
- Whether destIpCategories and resCategories must match on a DNS rule [divergence:zia.dns-control.api-rules:category-sets-must-match]
  - tf-zia: Retired provider code (now commented out) says the API requires the two sets to match, or it returns INVALID_INPUT_ARGUMENT.
  - tf-zia: Provider v4.8.2 removed the local check as an "old API requirement".
  - tf-zia: The current schema description still tells the operator that both lists must be the same sets.
  Impact: The provider no longer rejects unequal sets, but the descriptions disagree on whether the API does; an unequal pair may still fail at the API.

Not known (open gaps):
- What an omitted or explicit false Web EUN does on update [gap:zia.dns-control.api-rules:web-eun-false]: settled by lab-test. Blocks: knowing whether Go can clear Web EUN and whether Python/Ansible spelling takes effect
- Whether the API accepts different destIpCategories and resCategories [gap:zia.dns-control.api-rules:category-mismatch-acceptance]: settled by lab-test. Blocks: sending unequal request and response category sets on a DNS rule

Area: zia.dns-control, its subjects in references/_meta/spine/zia/zia.dns-control.json

Linked (open a file only if the answer needs it):
- decided-by references/_meta/text/zia/zia.dns-control.criteria.md (What a DNS Control rule can match on), from zia.dns-control: Rule conditions are grouped into categories (Who/Where/When, Source IP, Destination/Resolved IPs, DNS Application); categories combine with AND, and each category has its own AND/OR operators inside. [zia.dns-control.criteria:condition-logic]
- decided-by references/_meta/text/zia/zia.dns-control.predefined-rules.md (Predefined DNS Control rules and the ZPA resolvers), from zia.dns-control: The DNS Control policy has default rules that allow all DNS traffic. They always hold the lowest precedence; their actions can be modified but they cannot be deleted. [zia.dns-control:default-rules]
- depends-on references/_meta/text/zia/zia.firewall.md (ZIA Firewall Control), from zia.dns-control: DNS Control requires the firewall to be configured for locations, and a Firewall Filtering rule that allows DNS traffic (Network Services condition matches DNS). [zia.dns-control:firewall-prereq]
- logged-in references/_meta/text/zia/zia.logs.dns-outcome.md (What happened to a DNS query: rules, actions, response values and errors), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]
- scoped-by references/_meta/text/zia/zia.time-intervals.rule-usage.md (Which ZIA rules take a time interval, and how many), from zia.dns-control: These rule types carry a `timeWindows` list in the API request body: Bandwidth Control, NAT Control (`/dnatRules`), File Type Control, Firewall DNS Control, Firewall Filtering, Firewall IPS Control, Forwarding Control, Sandbox, URL Filtering, Cloud App Control (`/webApplicationRules/{rule_type}`) and Web DLP. [zia.time-intervals.rule-usage:rule-types]
- reached-via references/_meta/text/zia/zia.traffic-forwarding.methods.md (Forwarding methods Zscaler supports and how to choose), from zia.dns-control: The Zscaler service directs users' DNS requests that are forwarded via GRE tunnels, IPSec tunnels, or Zscaler Client Connector using Z-Tunnel 2.0. [zia.dns-control:dns-via-forwarding]
- logged-in references/_meta/text/types/zia/dns-log.md (ZIA DNS log (NSS DNS feed)), from zia.dns-control: The DNS NSS feed gives separate rule and action fields for the request (reqrulelabel, reqaction) and for the response (resrulelabel, resaction), mapped in DNS Insights Logs to Request Rule Name, Request Action, Response Rule Name and Response Action. [zia.logs.dns-outcome:request-response-pairs]
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
- links-to references/_meta/text/zia/zia.dns-control.actions.md (DNS Control actions and what each API action requires)
- links-to references/_meta/text/zia/zia.sdk-go.write-encoding.md (How the Go SDK encodes ZIA writes (omitted zero values, empty responses))
- links-to references/_meta/text/zia/zia.terraform.delete-detach.md (How the ZIA Terraform provider detaches references before deleting objects)
- links-to references/_meta/text/zia/zia.terraform.rule-order.md (How the ZIA Terraform provider applies rule order)
