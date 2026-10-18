A firewall log record describes a firewall session, and one record can stand for several aggregated sessions. Field names also differ from the web log for the same data.

**Aggregated sessions.** {{agg-flag}} {{last-session}} {{undercount}} {{avgduration}} {{srcip-country-agg}} What triggers aggregation and how counters aggregate is open {{gap:aggregate-counters}}. Why allowed aggregates lack a country is open {{gap:srcip-country-aggregate}}.

**Action and threat.** {{action-two-values}} {{rulelabel-unqualified}} Precedence among firewall, IPS and DNAT is open {{gap:action-precedence}}. {{severity-typo}} {{threat-score-source}} {{flags-1-0}}

**Network fields.** {{bytes-direction}} {{nw-fields}} Their relation is open {{gap:nwapp-vs-nwsvc}}. {{country-forms}}

**Names against the web log.** {{names-differ}}

How the feed encodes fields: [[zia.logs.nss-feed-format]]. Web counterpart: [[zia.logs.web-records]].
