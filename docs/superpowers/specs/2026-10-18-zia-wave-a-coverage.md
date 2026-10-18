# ZIA wave A: coverage record

Six legacy docs converted on 2026-10-18 and deleted in the same change. Each conversion had a separate author and verifier, and a revision pass after verification.
Rules applied: substantive behavior is never dropped for lack of a capture. A missing help page was captured. A statement no source supports became a gap whose detail starts
"Unverified legacy statement:". Allowed drops were UI navigation paths, opinion, history, formatting, duplicates and SDK argument plumbing.
The help captures were then recaptured verbatim (`scripts/help_capture.py`) and every quote re-anchored. Statements that the vendor's current text changed carry "Corrected on recapture" in `conditions`.

| Legacy doc | Subjects | Claims | Gaps (of which unverified legacy) | Divergences | Corrected (conversion / recapture) |
|---|---|---|---|---|---|
| `references/zia/firewall.md` | 11 (`zia.firewall.*`) | 86 | 23 (5) | 4 | 0 / 2 |
| `references/zia/dns-control.md` | 8 (`zia.dns-control.*`) | 70 | 15 (9) | 3 | 1 / 0 |
| `references/zia/dlp.md` | 10 (`zia.dlp.*`) | 91 | 29 (16) | 3 | 0 / 5 |
| `references/zia/sandbox.md` | 8 (`zia.sandbox.*`) | 51 | 16 (5) | 1 | 0 / 0 |
| `references/zia/ssl-inspection.md` | 10 (`zia.ssl-inspection.*`) | 95 | 17 (12) | 0 | 1 / 1 |
| `references/zia/cloud-app-control.md` | 10 (`zia.cloud-app-control.*`) | 52 | 10 (1) | 2 | 0 / 6 |

Per-statement coverage tables (each legacy section mapped to a subject:claim, gap, or allowed drop) were produced by the authors and checked by the verifiers.
The legacy text remains in git history at the parent of this change.

Ledger entries migrated: zia-07, zia-09, zia-13, zia-47, zia-48, zia-58, zia-59, zia-60, zia-63, zia-66, zia-71 (see `references/_meta/clarifications.md`).
