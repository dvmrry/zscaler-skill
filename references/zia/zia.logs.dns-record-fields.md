Most fields have two names: the NSS format specifier used in raw feed output and the Insights Logs column. {{two-names}} {{nss-only-fields}} {{epoch-no-insights}}

**Time.** {{time-derived}} {{tz-from-feed}} How time zones behave across feeds and regions is open [[zia.logs.nss-feed-format:multi-feed-timezone]].

**Encoding.** {{eedone-escape}} Whether field presence differs by output format is open [[zia.logs.nss-feed-format:format-field-presence]], and so is Cloud NSS field parity [[zia.logs.nss-feed-format:vm-conversion-omits]].

**Identity and capture.** {{cip-internal-or-nat}} {{pcapid-format}} {{devicetype-values}}

**Transport and categories.** {{protocol-values}} Encrypted DNS other than DoH is open {{gap:dot-doq-open}}. {{two-categories}} {{ecs-fields}}

The outcome fields are in [[zia.logs.dns-outcome]] and the gateway fields in [[zia.logs.dns-gateway-fields]].
