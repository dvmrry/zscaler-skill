A scan schedule is what makes a policy inspect anything. {{schedule-needs-policy}}

**What a schedule holds.** {{schedule-columns}} {{actions-vary-by-app}}

**States.** {{scan-states}} {{initialized-is-not-started}} The integer behind the scan action is open {{gap:scan-action-encoding}}.

**Active and historical data.** {{active-vs-historical}} {{rule-edits-reset-date}} {{historical-options}}

**Stopping and restarting.** {{stop-flushes-queue}} {{restart-options}} The run and scan identifiers that show where a scan stopped are in [[zia.casb.insights-logs]].

**How current findings are.** How far behind an upload a finding can be is open {{gap:scan-latency}}.

The tenant a schedule names is in [[zia.casb.tenants]]; what quarantine does to a file is in [[zia.casb.quarantine]].
