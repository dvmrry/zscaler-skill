# ZIA wave C: coverage record

Thirteen legacy docs converted on 2026-10-18 and deleted in the same change, under the wave A rules (see
`2026-10-18-zia-wave-a-coverage.md`). Each conversion had a separate author and verifier, and a revision pass
after verification. Missing help pages were captured with `scripts/help_capture.py`.

| Legacy docs (`references/zia/`) | Subjects | Claims | Gaps (of which unverified legacy) | Divergences |
|---|---|---|---|---|
| `rule-labels.md` | 5 (`zia.rule-labels.*`) | 22 | 11 (4) | 2 |
| `workload-groups.md` | 4 (`zia.workload-groups.*`) | 44 | 8 (3) | 1 |
| `iot-report.md` | 5 (`zia.iot.*`) | 33 | 10 (6) | 0 |
| `audit-logs.md`, `backup-and-restore.md` | 9 (`zia.audit-logs.*`, `zia.backup-restore.*`) | 59 | 18 (9) | 2 |
| `traffic-forwarding-methods.md`, `proxy-mode.md` | 14 (`zia.traffic-forwarding.*`, `zia.proxy-mode.*`) | 85 | 25 (24) | 0 |
| `ad-integration.md`, `scim-provisioning.md` | 14 (`zia.ad-integration.*`, `zia.scim.*`) | 67 | 20 (16) | 2 |
| `private-service-edge.md`, `vse-clusters.md` | 20 (`zia.private-service-edge.*`, `zia.virtual-service-edge.*`) | 135 | 22 (15) | 3 |
| `time-intervals.md`, `saas-app-quirks.md` | 14 (`zia.time-intervals.*`, `zia.saas-apps.*`) | 56 | 23 (17) | 3 |

Corrections to the legacy text that the sources forced, by area:

- IoT: rules can take an IoT device group (URL Filtering, Cloud App Control, SSL/TLS, Forwarding); the legacy
  doc said no rule could use IoT classification. Firewall Filtering offers no IoT choice.
- Audit logs: console path; spec request types (the Go SDK carries older types: divergence); the event log
  report has a download endpoint; OAuth admin ID form.
- Traffic forwarding: GRE failover timings had mixed best and worst rows; VPN credential create accepts only IP and
  UFQDN; IKEv1 needs Support for new tenants; IPsec MTU 1400 / MSS 1360; `zia_pac_files` exists; PAC over a tunnel
  is explicit.
- AD and SCIM: LDAP sync is not described as deprecated; SCIM rate limit 5 requests per second; org limits; per-IdP
  bearer token; 127 versus 128 groups per user (divergence); two Go SDK SCIM defects.
- PSE and VSE: deployment thresholds; per-LB-instance upload caps; VSE memory 48 GB; consecutive cluster upgrades;
  Hyper-V cluster support left as an open divergence.
- Time intervals and SaaS apps: day enum includes ANY and NONE; three rule endpoints corrected; SSL Inspection rules
  carry `timeWindows`; 64 intervals per organization; the One Click rule's Evaluate Other Policies option.
- Rule labels: "labels do not affect matching" is an inference (Tier B), not a help statement.

Capture format finding: help pages that mark a recommended value only by emphasis (for example the IPsec
parameter tables) lose that signal in canonical text, which strips emphasis. Claims must not state
recommendations read from formatting; a capture-format change is pending.

`references/shared/pac-files.md` still says the proxy-mode reference "confirms" that proxy-chained traffic is
explicit; that statement is now an open gap (`zia.proxy-mode.forwarding-map:chained-proxy-mode`). The legacy
wording is left for that doc's own conversion, because changing it would require re-verifying the whole doc.

Ledger entries migrated: zia-21 to zia-45, zia-50, zia-55, zia-62, zia-64, zia-69, shared-38 (see
`references/_meta/clarifications.md`).
