# Index pass, shared Python SDK home, AI Guard integrations: record

## Index pass

The fourteen product `index.md` hubs are deleted (`zia`, `zpa`, `zcc`, `shared`, `cloud-connector`,
`ai-security`, `zdx`, `zidentity`, `zbi`, `zwa`, `zscaler-cellular`, `zms`, `risk360`, `deception`). The
references tree now holds no product Markdown; `references/_meta/` keeps its own documents.

Three workers accounted for every statement in the hubs before deletion: held by a subject, routing (checked
that `resolve` reaches the subject, aliases added where it did not: 25 for ZIA, ZPA, ZCC and shared, more for
the others), moved (cross-product hints and terminology warnings became `checks` or prose in the nearest
subject), stale (status tables, file lists, statements the graph now contradicts), or a new gap. Five new
gaps record "not covered" notes that named real questions; the Canada isolation region note became
`zbi.isolation-profiles:region-list` (its release-summary capture now holds only the introduction).

The hubs' table-of-contents role moved to the resolver: `kb.mjs resolve <product>` (an ID, name or
`products.json` alias, or `shared`) returns `areas`, generated from subject IDs, so no hand-maintained list
remains. A subject that claims the alias exactly still wins (`resolve "AI Guard"` is the subject). The bundle
contract gains the `product` kind and the optional `areas` list. `kb.mjs surface <product>` lists a product's
whole generated surface by name (eighteen subjects told agents to run it, and it returned nothing).

## Shared Python SDK home

Six subjects hold the Python SDK's shared behavior, mirroring `shared.sdk-go.*`:
`shared.sdk-python.client-configuration`, `.request-handling`, `.response-handling`, `.pagination`,
`.retries` and `.errors`. 28 claims that stated an SDK-wide mechanism inside one product's subject moved
there, four of them merged as duplicates (ZIA's and ZPA's retry defaults, ZCC's retry budget and missing-header
claims). Three core claims were written from the code: request-body camel-casing (which leaves ZDX, EASM and
ZTB bodies in snake_case and converts ZCC selectively), query-parameter camel-casing, and response-key
camel-casing. Product claims that apply the mechanism stay where they are and link it.
`zpa.sdk-python.retries-and-rate-limits` held nothing of its own after the move and is retired.

`kb.mjs move-claim <from> <to> [--merge]` (scripts/kb-move.mjs, tested) moves a claim and rewrites every
reference to it: the old subject's inline marker becomes a link, local references are repointed, the moved
claim's own local references are qualified, and the qualified ID is rewritten in subjects, SKILL.md, agents,
evals and docs.

## AI Guard integrations

`vendor/zguard-ai-integrations` is registered as source `zguard-integrations` (rank 4: vendor-published
example code). Two workers converted it per host; the parent `ai-security.ai-guard.integrations` compares
fail posture and interception points across hosts in two tables. 25 subjects, 280 claims (50 Tier B), 12 gaps,
34 divergences. Proposals answered parts of two older gaps (the DAS host form the examples use; the 19 prompt
and 21 response detector list, now sourced at rank 4).

The claim audit (Ling 3.0 Flash, $0.07) flagged 177 of the 260 Tier A claims new since the last commit, 163
of them in the integrations: code-based claims that bundled several behaviors and quoted only some lines. Two
fresh fixers resolved all 177 (139 quoted, 21 narrowed, 13 to Tier B, 4 left on their locator).

Findings worth knowing for an evaluation:

- The root README says every integration fails closed; the code does not hold to it everywhere. The Cursor
  `hooks.json` the README tells users to copy still has `failClosed: false` on all four hooks (only the
  `.example` copy was fixed); Cline and Windsurf allow everything when the API key is missing; the Azure
  example policy sets FailOpen on the prompt leg; the Apigee SharedFlow passes unclassified traffic and
  harness-tagged requests (`x-app: cli`, a client-set header) unscanned.
- Coverage has holes: the Claude Code hooks do not scan Bash, edits or the final reply and truncate a tool
  response to its first 5,000 characters; the Codex `Stop` hook and Cursor's `afterAgentResponse` run after
  the reply is on screen.
- The NeMo rails call `CallZscalerAiGuardAction` while the action registers as `CallZsAiGuardAction`; the
  library plugin imports a module that does not exist and blocks every turn as shipped.
- The examples say the API takes four fields; the SDK also sends `user`, so the AWS, Apigee and Azure examples
  attribute no user.
- The shipped CI suite accepts DETECT on its required cases and marks benign cases optional.

## Left open

- The advisory vendor family-coverage check still looks for citations in Markdown docs and so reports every
  product; it needs a graph-based rewrite.
- The submodule is pinned at d6bf200 (2026-09-22); the findings above are as of that pin.
