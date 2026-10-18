Several web log fields have encodings, fallbacks and conditions that the field list alone does not show. These are the ones the vendor field CSV states.

**Network and destination.** {{sip-blocked}} {{respcode-403}} {{respcode-not-origin}} {{cip-cintip}} {{host-fallback}} {{url-no-scheme}} {{domain-fronting}} The TLS Inspection requirement for df_hostname is in [[zia.logs.field-enablement:df-tls]]. {{isolation-location}}

**Threat and risk.** {{riskscore-factors}} {{severity-from-score}} {{malwarecat-sandbox}} Where the score comes from is open {{gap:riskscore-lineage}}.

**Placeholders.** {{none-sentinels}}

**Rules and DLP.** {{dlp-rule-fields}} The rule-name fields for blocks are covered in [[zia.logs.web-rule-attribution]]. {{reason-pointer}} Its structure is open {{gap:reason-structure}}.

**Categories.** The category fields' relation is open {{gap:url-category-fields}}.

**Sizes.** {{sizes}} Their measurement point is open {{gap:byte-counters}}.

**Client Connector and generative AI.** {{bypass-flag}} What prompt_req records is open {{gap:prompt-scope}}.
