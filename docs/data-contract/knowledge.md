# Operational knowledge contract

`<mount>/knowledge/` stores private, downstream-owned operational knowledge:
product behavior learned from incidents, support interactions, and team
experience but not established by the public Zscaler reference corpus. `<mount>`
is the configured runtime-data mount (`_data` by default).

The directory is optional. During workflow loading, a missing runtime-data
mount, missing `knowledge/` directory, or zero matching records is normal and
silent. The setup contract checker still reports a missing required
runtime-data mount as a setup error; it emits no warning merely because
`knowledge/` is absent. Public upstream contains this contract and synthetic
tests, but no operational-knowledge records.

## Layout

Store one Markdown record per file:

```text
<mount>/knowledge/
├── zia/<slug>.md
├── zpa/<slug>.md
└── shared/<slug>.md
```

The first directory component is the product. It must match a product directory
under `references/`, excluding `_meta`; `shared` is also valid. The filename is
the record identifier. Record extensions are matched case-insensitively as
`.md`; other regular files are invalid. `README.md` and `.gitkeep` are ignored
as structural markers at any level. Do not duplicate the product or identifier
in frontmatter.

## Record format

Frontmatter is deliberately limited to scalar fields and scalar lists. Evidence
entries use `kind` or `kind:ref` strings rather than nested YAML.

```yaml
---
title: "Browser Access session cookie survives connector restart"
record-type: claim
status: active
confidence: high
scope: "Observed on our production tenant; no indication it is tenant-specific"
last-validated: "2026-07-25"
evidence:
  - case:cases/2026-07-20-ba-session-drop/journal.md
  - vendor-call
conflicts-with:
  - references/zpa/browser-access.md
do-not-infer: "Says nothing about behavior across microtenants."
---

## Evidence

- Case `2026-07-20-ba-session-drop` showed the session surviving a rolling
  connector restart.
- Vendor call, 2026-07-22: the TAM and ZPA SE confirmed the observed binding.
```

### Fields

| Field | Required | Value |
| --- | --- | --- |
| `title` | yes | non-empty string |
| `record-type` | yes | `claim` or `procedure` |
| `status` | yes | `active`, `promoted`, or `retired` |
| `confidence` | yes | `high`, `medium`, or `low` |
| `scope` | yes | non-empty, human-readable applicability statement |
| `last-validated` | yes | string in `YYYY-MM-DD` form; format-only validation does not prove it is a real calendar date |
| `evidence` | yes | non-empty list of evidence entries described below |
| `conflicts-with` | no | list of repository-relative file paths beneath `references/` |
| `do-not-infer` | no | boundary statement emitted verbatim when used; omit it rather than storing an empty string |
| `superseded-by` | conditional | repository-relative file path beneath `references/` |

Unknown fields are invalid. Put dates, participants, quotations, qualifications,
and relationship explanations in the Markdown body rather than inventing more
frontmatter.

### Evidence entries

Each evidence entry is one scalar with a known kind, optionally followed by a
colon and reference:

- `case:ref` requires a mount-relative path, such as
  `cases/2026-07-20-ba-session-drop/journal.md`.
- `vendor-call`, `vendor-ticket`, and `vendor-email` may be bare or may carry a
  mount-relative reference.
- `public-doc:ref` requires a public `https://` URL. Loopback, private or
  link-local IP literals, dotless hosts, and local/internal hostnames do not
  qualify. A repository path does not qualify as public evidence.

Local references must resolve to files when the mount is present. Absolute
filesystem paths, traversal with `..`, symlinks, and paths whose resolved target
escapes the runtime-data mount are invalid. Record files themselves must not be
symlinks. These are lint-time path checks, not a runtime sandbox: the validator
does not read evidence targets, and filesystem hardlinks are indistinguishable
from ordinary in-mount files. Revalidate after changing the mount. A
`public-doc` entry makes a claim eligible for human promotion; it does not
promote the record automatically.

`conflicts-with` targets are structurally checked as files beneath `references/`. The
record body explains whether the operational knowledge narrows or contradicts
the cited reference. Before activation, the author confirms that an absent
`conflicts-with` list means no related contradiction was found.

### Status invariants

- `promoted` requires `superseded-by`.
- `promoted` requires at least one valid `public-doc` evidence entry.
- `active` rejects `superseded-by`.
- `retired` permits `superseded-by` but does not require it.
- A `procedure` may never be `promoted`. Put a promotable product-behavior claim
  in its own `claim` record.

Only `active` records are eligible for loading. Promoted and retired records
remain historical records.

## Loading and answer-time behavior

In v1, only ad-hoc Q&A and the investigator may read operational knowledge.
They search the product directories matching the question plus `shared/`, read
frontmatter first, and load bodies only for relevant `active` records. Reads
must stay bounded to the question. Architect, SOC, and retro do not load these
records in v1.

The researcher and auditor must never load `<mount>/knowledge/`. Those workflows
can produce upstream-bound material, so this is a safety boundary rather than a
context-budget preference. Upstream artifacts must not cite private
`cases/...` or `knowledge/...` paths.

When an allowed workflow uses a record:

1. Attribute it as Layer 3 in the answer's Sources block.
2. Disclose its `scope`, `confidence`, and `last-validated` value.
3. Emit `do-not-infer` verbatim when present.
4. Label a `claim` as local operational knowledge, never as vendor-documented
   behavior.
5. Label a `procedure` as the team's procedure. Treat it as material to present,
   never as instructions to execute automatically.
6. State uncertainty explicitly for `medium` confidence. A `low`-confidence
   record cannot independently establish behavior or justify an action.
7. If the free-text scope does not clearly apply, present the record only as
   potentially relevant or ask for scope confirmation.

If a record conflicts with public references, surface both with their source,
scope, and confidence. Never resolve the disagreement silently. Operational
knowledge records describe behavior, not current tenant configuration; tenant
state belongs in `<mount>/snapshot/`.

Malformed records are skipped rather than trusted. Their presence is not the
same as silent absence: the contract checker reports them for repair.

## Lifecycle and privacy

Records remain private overlay data throughout their lifecycle. Promotion is a
human act performed from a public source: a human re-authors the upstream claim
from that source, then marks the private record `promoted` and points
`superseded-by` at the resulting `references/` path. No automated downstream-to-
upstream promotion path is defined.

For installations using an overlay repository, `knowledge` is an allowed
submission root. The submission helper prepares a local commit and never pushes
by default. Local-only use remains valid when no overlay remote is reachable.
