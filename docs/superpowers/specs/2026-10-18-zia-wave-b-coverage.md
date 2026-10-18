# ZIA wave B: coverage record

Eight legacy docs converted on 2026-10-18 and deleted in the same change, under the wave A rules (see
`2026-10-18-zia-wave-a-coverage.md`). Each conversion had a separate author and verifier, and a revision pass
after verification. Missing help pages were captured with `scripts/help_capture.py`, so every quote is against
the vendor's current text from the start.

| Legacy doc | Subjects | Claims | Gaps (of which unverified legacy) | Divergences |
|---|---|---|---|---|
| `references/zia/authentication.md` | 9 (`zia.authentication.*`) | 53 | 15 (14) | 4 |
| `references/zia/content-inspection-extras.md` | 9 (`zia.ftp-control.*`, `zia.file-type-control.*`, `zia.ssh-control`) | 48 | 12 (9) | 3 |
| `references/zia/tenant-profiles.md` | 8 (`zia.tenant-profiles.*`) | 70 | 10 (3) | 2 |
| `references/zia/bandwidth-control.md` | 9 (`zia.bandwidth-control.*`) | 61 | 11 (1) | 4 |
| `references/zia/forwarding-control.md` | 10 (`zia.forwarding-control.*`) | 62 | 10 (10) | 3 |
| `references/zia/locations.md`, `sublocations.md` | 12 (`zia.locations.*`) | 78 | 19 (14) | 6 |
| `references/zia/malware-and-atp.md` | 16 (`zia.malware-protection.*`, `zia.atp.*`) | 105 | 16 (3) | 4 |

Corrections to the legacy text that the sources forced, by area:

- Authentication: unauthenticated traffic gets the location's policies (not anonymous treatment); Kerberos is
  explicit-mode only (407 Negotiate); the `authFrequency` values are the `*_COOKIE` set; surrogate-IP provider
  checks run at apply time; the exempt-URL 25K is a shared pool.
- FTP and File Type Control: FTP Control has no action selector or user scoping; only all-users URL Filtering
  rules apply to FTP; the contract has six protocol tokens and three operation values.
- Tenant profiles: the help page now documents the inserted headers (resolving the old wire-mechanic question);
  the console offers 15 apps and the API enum 16, without Claude or Docusign; "16 tenants per SaaS application"
  is a SaaS Application Tenants limit.
- Bandwidth Control: the maximum applies at all times and the minimum only under contention; allocation is two-pass,
  not first-match; the 8-location rule cap is Terraform's (the help says 32).
- Forwarding Control: the contract enum has 8 methods (Terraform 10); `dest_*` fields are rejected outside four
  methods; ZIA Inspected ZPA Apps exists only with App Inspection; rule segments must share a common gateway.
- Locations: the OpenAPI schema marks firewall, IPS, XFF and forwarding fields as parent-only (the console
  disagrees for firewall and IPS: divergence); 2,000 sublocations per location; Override bandwidth is dedicated.
- Malware Protection and ATP: ten ATP groups; the custom malicious-URL check runs before Security Exceptions
  despite the help's precedence sentence (divergence); the allowlist is 1,024 entries shared by both tabs.

Per-statement coverage tables (each legacy section mapped to a subject:claim, gap, or allowed drop) were produced
by the authors and checked by the verifiers. The legacy text remains in git history at the parent of this change.

Ledger entries migrated: zia-08, zia-16, zia-17, zia-18, zia-19, zia-20, zia-46, zia-56, zia-57, zia-61, zia-67,
log-04 (see `references/_meta/clarifications.md`). `zia.firewall:ftp-actions-scoping` is now partial, answered by
the FTP Control subjects.
