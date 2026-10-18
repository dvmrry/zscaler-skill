# ZIA wave E: coverage record (log schemas)

Four legacy docs retired on 2026-10-18: `references/zia/logs/{web,firewall,dns,casb}-log-schema.md`.

- **Field inventories are generated.** `scripts/gen-log-types.mjs` turns the captured NSS feed-format CSVs
  (`vendor/zscaler-help/nss-{web,firewall,dns}-logs.csv`) into `references/zia/types/{web,firewall,dns}-log.json`:
  155, 70 and 55 fields, one per CSV row, keyed by NSS token, labelled with the Insights column, each with the
  row as evidence. The full gate fails when they drift. (The previous web-log type was a hand-written 9-field
  slice.) CASB SaaS Security logs have no captured table and no type.
- **Behavior is extracted** into eight `zia.logs.*` subjects: web records and field semantics, firewall
  records, DNS record fields, DNS outcome and DNS gateway fields, field enablement, and the NSS feed format,
  plus additions to `zia.casb.insights-logs` and `zia.logs.web-rule-attribution`. An independent verifier
  checked every item, including all 230 field bindings; its fixes are applied.
- **Corrections:** the CSV gives a meaning for each `dnsgw_flags` value (the legacy doc guessed); the
  firewall `threat_severity` description names the web field; the firewall `rulelabel` has no Block-only
  qualifier; the legacy CASB "likely present" field tables were extrapolations and are not carried over;
  whether Shadow IT discovery appears in the Insights logs is an open gap.

Ledger entries migrated: log-01 to log-03, log-05 to log-17.
