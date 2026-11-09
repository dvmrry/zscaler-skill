# Terraform user agent validation and isolation on URL Filtering rules (zia.terraform.url-filtering-rules)
Also called: BRAVE user agent terraform zia; user_agent_types validation; zia_url_filtering_rules isolate; terraform-provider-zia issue 606

Up to v4.8.8 the provider validated URL Filtering user agents against a shorter list than some of its sources. Before v4.8.9 the provider's `user_agent_types` validator accepted OPERA, FIREFOX, MSIE, MSEDGE, CHROME, SAFARI, MSCHREDGE and OTHER, and omitted BRAVE. v4.8.9 adds BRAVE to the list (#607). [zia.terraform.url-filtering-rules:validator-omits-brave] The shared `getUserAgentTypes()` schema applies that validator, and `zia_url_filtering_rules`, `zia_ssl_inspection_rules` and `zia_cloud_app_control_rule` all use it for `user_agent_types`. [zia.terraform.url-filtering-rules:validator-shared-by-three-resources]

**BRAVE.** Up to v4.8.12 the `user_agent` criterion of `zia_http_header_profile` was validated against a list that includes BRAVE. v4.8.13 makes `user_agent` a free custom user agent string, for use when `user_agent_bitmap` is OTHER, and the list (still including BRAVE) validates `user_agent_bitmap` (#613). [zia.terraform.url-filtering-rules:header-profile-accepts-brave] Before v4.8.9 HCL could not declare BRAVE in `user_agent_types` for URL Filtering, SSL Inspection or Cloud App Control rules, although the HTTP header profile accepted it; from v4.8.9 all three accept it. [zia.terraform.url-filtering-rules:hcl-cannot-declare-brave] Provider issue #606 reported that the ZIA API returned BRAVE in `user_agent_types` for existing rules and that `terraform plan` then failed with the validator error on a list of eight values ending in OTHER. It was closed as completed on 2026-10-01, the day a repository member commented that the latest version, v4.8.9, resolved it. [zia.terraform.url-filtering-rules:issue-606-report] The contract and the provider disagreed on SSL Inspection up to v4.8.8 and disagree on Cloud App Control from v4.8.9 [divergence:zia.terraform.url-filtering-rules:brave-provider-vs-contract]. The URL filtering Read copies the API's `UserAgentTypes` into state. [zia.terraform.url-filtering-rules:read-copies-user-agents] Whether a read can fail on a BRAVE value is not established [gap:zia.terraform.url-filtering-rules:issue-606-read-time-failure].

**Isolation.** Creating a URL Filtering rule with the `ISOLATE` action requires the Cloud Browser Isolation subscription. [zia.terraform.url-filtering-rules:isolate-needs-cbi] For an ISOLATE rule the provider requires a cbi_profile, rejects the user agent type OTHER, and allows only HTTP and HTTPS protocols. [zia.terraform.url-filtering-rules:isolate-validation]

What to check:
1. Whether a rejected `user_agent_types` value is BRAVE, which the provider validator omits for three rule resources.
2. Whether the tenant has Cloud Browser Isolation before configuring an `ISOLATE` rule, and whether the rule has a `cbi_profile`, no OTHER user agent type and only HTTP and HTTPS protocols.

Inferred, not quoted (say so when an answer rests on one):
- [zia.terraform.url-filtering-rules:hcl-cannot-declare-brave] Tier B: Follows from the validator list and the three resources sharing it. Changed upstream in v4.8.9 (checked 2026-10-18): previously "So under v4.8.8 HCL cannot declare BRAVE in `user_agent_types` for URL Filtering, SSL Inspection or Cloud App Control rules, although the HTTP header profile accepts it."

Sources disagree (name both sides):
- Whether BRAVE is an accepted user agent type on SSL Inspection and Cloud App Control rules. [divergence:zia.terraform.url-filtering-rules:brave-provider-vs-contract]
  - api-specs: The captured Automate contract includes BRAVE in the SSL Inspection `userAgentTypes` enum.
  - api-specs: The contract omits BRAVE from the Cloud App Control `userAgentTypes` enum.
  - tf-zia: The provider validator used by both resources omits BRAVE.
  - tf-zia: From v4.8.9 the provider validator used by all three resources includes BRAVE.
  Impact: Under v4.8.8 an SSL Inspection rule that the API allows to carry BRAVE could not be written in HCL. From v4.8.9 the provider accepts BRAVE on SSL Inspection, agreeing with the contract, and also on Cloud App Control, where the contract omits it; whether the API accepts BRAVE there is not established.

Not known (open gaps):
- Whether the API returns BRAVE for existing URL Filtering rules and the provider then fails planning [gap:zia.terraform.url-filtering-rules:issue-606-read-time-failure]: settled by lab-test or tenant-data. Blocks: saying that a URL Filtering plan fails on read for rules with broad browser selections

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zbi/zbi.isolation-profiles.md (Isolation profiles: the object every isolation rule names, its defaults and the open lifecycle questions): For an ISOLATE rule the provider requires a cbi_profile, rejects the user agent type OTHER, and allows only HTTP and HTTPS protocols. [zia.terraform.url-filtering-rules:isolate-validation]
