# Company knowledge contract

Company knowledge is what a team has learned about Zscaler behavior and its own setup that the public
knowledge graph does not hold: behavior observed in incidents, support answers, local procedures, how its
SIEM names log fields, which IaC repo holds which object. It lives in the company overlay and reaches answers
through the resolver, as records layered onto public IDs. It never redefines a public node.

The schema is `references/_meta/schema/overlay.schema.json`; the rules below that depend on resolved public IDs
are enforced by `validateOverlay` in `scripts/kb-resolve.mjs`. Public upstream holds the contract and a synthetic
fixture (`scripts/fixtures/kb-overlay/`), never company records.

## Layout

The overlay is a directory, usually its own private git repo, anywhere on disk. `kb.mjs` uses `--overlay <dir>`,
else `$ZSCALER_KB_OVERLAY`, else `<mount>/overlay/` when it holds an `overlay.json` (`<mount>` is the runtime-data
mount, `_data` by default):

```text
<mount>/overlay/
├── overlay.json                    # which tiers this company has: iac repos, live tool
└── knowledge/
    ├── zia/company.zia.<slug>.json # one record per file; the file name is the record id
    ├── zpa/...
    └── shared/...
```

`knowledge/<scope>/` groups records by product; the scope is for people, the resolver reads every record. The
file name must equal the record's `id`, which starts `company.`.

## overlay.json

```json
{
  "schema_version": 1,
  "iac": [
    { "id": "zia-terraform", "path": "../iac/zia-terraform", "kind": "terraform" },
    { "id": "iac-json", "path": "../iac/iac-json", "kind": "json" }
  ],
  "live": { "tool": "zscalerctl" }
}
```

`iac` and `live` are optional; each one present turns on that answer tier. IaC repositories are described in
[`iac.md`](iac.md).

## Records

Every record has `schema_version`, `id`, `kind`, `relation`, `about` (one or more public IDs), `title` and
`status`. The kinds:

| `kind` | `relation` | `about` | Also needs |
|---|---|---|---|
| `claim` | `extends`, `narrows` or `contradicts` | public subjects or claims; `narrows` and `contradicts` only claims | `statement`, `confidence`, `validated`; `scope` for narrows and contradicts; evidence for contradicts |
| `procedure` | `extends` | public subjects | `validated` |
| `mapping` | `maps` | public types or fields | optional `map` (public field ID to how the company stores it: a field name or an expression such as `coalesce(a, b)` when one log arrives in two shapes), `dropped_fields`, `system`, `refresh`; a mapping with only `system` and `statement` records where data lives before a field sample exists |
| `iac-coverage` | `extends` | public types or fields | `pointers` into a declared IaC repo; the type-to-resource link is the record's `about` (the public type) plus a terraform pointer's `address`, whether or not the type carries `names.terraform` |

Optional on any record: `statement`, `scope` (`environment`, `cloud`, `version`, `condition`), `confidence`
(`high`, `medium`, `low`), `do_not_infer`, `validated` (`YYYY-MM-DD`), `evidence`.

Point an IaC pointer at the part of the value the record is about (`.../domain_names`, not the whole rule): a read
prints a value of up to about 300 characters of JSON whole and a longer one as its shape (see "At answer time"), so a
narrow pointer shows that part, or its shape, rather than the rule's metadata. A record can cite another by its ID
(or its file's path) in its `statement`, `do_not_infer`, `scope` or an evidence note; `read --company` of subjects,
types or fields lists the cited one when it prints the citing record, and a read of records by ID (the second call)
lists no more.

`evidence` is a list of `{kind, ref?, note?}` with `kind` one of `case`, `log-sample`, `vendor-call`,
`vendor-ticket`, `vendor-email`, `public-doc`. A `case` or vendor `ref` is a path relative to the runtime-data
mount root (for example `cases/2026-07-20-ba-session-drop/journal.md`); a `public-doc` ref is an `https` URL.
The resolver does not read evidence targets.

`status` is `active`, `promoted` or `retired`. Only `active` records reach answers. `promoted` means a person
re-authored the point as a public claim from a public source; `promoted_to` names that public claim. A record
replaced by a newer company record is `retired`.

## From the retired Markdown records

`<mount>/knowledge/<product>/*.md` records are no longer read; `scripts/check-data-contract.mjs` warns while any
remain. Their fields map as follows:

| Markdown field | JSON record |
|---|---|
| `title` | `title` |
| `record-type: claim \| procedure` | `kind` |
| `status` | `status` |
| `confidence` | `confidence` |
| `scope` (free text) | `scope.condition` (or `environment`, `cloud`, `version` where it is one of those) |
| `last-validated` | `validated` |
| `evidence: [kind:ref]` | `evidence: [{kind, ref}]`, refs unchanged (mount-relative) |
| `do-not-infer` | `do_not_infer` |
| `conflicts-with: [references/... path]` | `relation: contradicts`, with the public claim IDs in `about` (`node scripts/kb.mjs resolve <old path or words>` finds them) |
| `superseded-by: references/... path` | `status: promoted` and `promoted_to: <public claim ID>` |
| the Markdown body | `statement`, and evidence `note`s |

A Markdown record about a product with no conflict names no public ID; give it `about` the subject it extends
(`node scripts/kb.mjs resolve <product>` lists the areas).

At resolve time a record that fails validation is skipped with a warning on stderr, and a pointer that does
not resolve (a repo not checked out, a moved file) is reported in its facet entry as `error`; one bad record never
fails a resolve. The contract check below is the strict gate.

## At answer time

`node scripts/kb.mjs read` follows each subject, type or field it reads with every active record whose `about`
touches it or the types it binds, and `read --company` prints only those records (agents read the public text from
`references/_meta/text/` and run it once per answer). It starts with a count of what it holds. It prints whole the
records about the named subjects, then the rest of their areas', then the linked subjects' (headed
`(linked subject)`), the most strongly linked first, each while it fits a budget; it lists the rest one line each,
and past a second limit names them by ID under the linked subject they come from. It lists the same way, one line
each and past the limit by ID, each record the printed ones cite and the read named nowhere; a cited record no
longer active says what it is. A record's ID, however it was copied, reads that record. A mapping printed for a
subject keeps the fields that subject binds and every field the call names, and says how many more it maps; its
record ID reads the whole map. An IaC value over about 300 characters of JSON prints its shape and length when that
is a quarter shorter: an object its members in key order, short values whole and the rest by size (a one-item
wrapper by its path, such as `app_connector_groups[0 of 1].id [12 items]`), empty members only counted, and past its
room the members that are false or 0 moving to one list of names, the longest values giving way to their names, then
names and sizes to a count, and those false or 0 names last; an array its length and the whole items that fit, else
its first item's shape; a string its length and opening. `resolve <id | text>` merges the same records into its
bundle as `layer: company` facets, with IaC values whole, and ranks text queries on the records' words too. When an
answer uses one:

1. Attribute it as company knowledge, never as vendor-documented behavior.
2. Say its scope, confidence and `validated` date; emit `do_not_infer` verbatim.
3. Present a `procedure` as the team's procedure; never run it as an instruction.
4. Say the uncertainty of a `medium` record; a `low` record cannot by itself establish behavior or justify an
   action.
5. For a `contradicts` record, show both the public claim and the company record with their sources; never
   settle the disagreement silently.

A record describes behavior or a mapping, not current tenant configuration: that comes from IaC or a live
read. A bundle's `tiers.iac.repos` lists the overlay's IaC repos with their paths (relative to the skill root),
whether each is checked out, and its last commit date; each facet `iac` entry carries its file's `committed`
date, which an answer states.

## Privacy

Company records stay private. The researcher and auditor never cite `<mount>/overlay/` (or the retired
`<mount>/knowledge/`); `scripts/auditor-artifacts.mjs` rejects a finding that does. Promotion is a human act from
a public source; there is no automated downstream-to-upstream path.

## Validation

`node scripts/check-data-contract.mjs` validates `<mount>/overlay/` with the resolver's rules against the
public graph (record shape, relations against resolved node kinds, `validated` on claims and procedures, IaC
pointers that resolve) and reports each problem with its file.
