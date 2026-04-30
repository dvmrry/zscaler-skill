# Proposal — cross-persona routing and fit-check, with Windsurf integration

**Status:** Draft proposal, not yet implemented
**Branch:** `windsurf-routing-proposal`
**Audience:** Downstream maintainer(s) of the `/zscaler` Windsurf shim, and anyone reviewing the kit-side routing design.

---

## Context

The Zscaler skill kit defines four agent personas, each invoked as a slash command on Claude Code (`.claude/commands/z-*.md`) and as a parallel workflow on Windsurf (`.windsurf/workflows/z-*.md`):

- `/z-investigate` — hypothesis-driven troubleshooting (discovery journal)
- `/z-audit` — editorial / structural / hygiene lint (audit register)
- `/z-architect` — capacity / scaling design (recommendation register)
- `/z-soc` — security posture review (posture register)

The personas are not a separate primitive — each slash command loads a playbook file (`references/shared/<persona>-prompt.md`) that defines the behavior. Same playbook is loaded from both runtimes; the `.claude/commands/` and `.windsurf/workflows/` files are thin shims that point the agent at the playbook.

Two known UX problems we want to address:

1. **Wrong-command invocations.** A user may type `/z-investigate` when their framing is clearly a SOC posture review, or `/z-audit` for what is actually an investigation. The agent currently proceeds with the wrong persona and produces output that doesn't match user intent.
2. **No front-door router.** Users who don't know which specific command to pick have no `/z` (or equivalent) entry point that classifies their framing and routes to the right persona. On Windsurf, the `/zscaler` shim partially fills this role; on Claude Code, there's no equivalent.

## Constraints driving the design

These are documented in [`references/shared/windsurf-runtime-notes.md`](../references/shared/windsurf-runtime-notes.md):

1. **Windsurf has no `skill` primitive.** Claude Code ships the kit as a skill; Windsurf has no equivalent, which is why the `/zscaler` shim exists — it loads the kit-as-skill via a workflow.
2. **Windsurf workflow files are always fully loaded.** Workflows are short pointer files; the agent reads them in full as soon as the slash command fires.
3. **Windsurf playbook reads are lazy.** When a workflow tells the agent "use the read tool to load `references/shared/<persona>-prompt.md`," weak agents (e.g., SWE-1.6) may load only part of the file. **Anything below the first ~N lines of a playbook is at risk of being skipped.**
4. **No workflow-to-workflow chaining.** A workflow can't invoke another workflow; composability is by file load only.
5. **Frontmatter is display-only.** No reserved keywords change runtime behavior.
6. **`.windsurf/rules/*.md` files are always loaded into session context.** Useful for high-leverage global guidance, but they tax every session's context budget — the kit's discipline is to use sparingly.

The constraints together mean: **anything we want a Windsurf agent to reliably see must live in a fully-loaded surface — workflow file or rule file — not buried in a playbook the agent may lazy-load.**

## Proposed kit-side changes

### 1. Canonical routing rubric — new file

**Path:** `references/_meta/command-routing.md`

A single canonical rubric describing what each persona is for, with framing patterns (markers that suggest persona X) and counter-patterns (markers that suggest persona X is wrong). Used by:

- Engineers reading the kit for guidance
- CC agents that follow cross-links
- Downstream consumers (this proposal, the `/zscaler` shim if it later cites this file)

The rubric is the source of truth for classification; everything else either compresses it (workflow-file fit-checks) or wraps it (CC `/z` router).

### 2. Compact fit-check block in each playbook's Step 1

**Paths:** `references/shared/{investigate,audit,architect,soc}-prompt.md`

Each playbook gains a ~10-line fit-check block at the very top of Step 1 — small enough to survive lazy loading, structurally explicit so weak models can execute it. Format:

```markdown
## Fit check — is /z-<persona> the right command?

Before parsing the framing, verify it fits this persona. If markers below dominate, suggest the alternative and stop instead of proceeding:

| If framing has... | Suggest instead |
|---|---|
| <marker pattern> | /z-<other-persona> |
| <marker pattern> | /z-<other-persona> |

<persona> framing has <symptom-shape>. If those are absent and the markers above dominate, redirect.
```

This is the reliable **playbook-side** lever. Whether or not Windsurf loads this section depends on agent quality.

### 3. Compact fit-check block in each Windsurf workflow file

**Paths:** `.windsurf/workflows/{z-investigate,z-audit,z-architect,z-soc}.md`

The same fit-check block (≈10 lines), inlined at the **top of each Windsurf workflow file** above the read-tool instruction. Because workflow files are always fully loaded, this is the **reliably-visible** surface for Windsurf agents.

The agent's flow becomes:

1. Slash command fires; Windsurf loads the workflow file in full
2. Agent reads the fit-check block first
3. If framing matches a redirect marker, agent outputs the redirect suggestion **and stops** before invoking the read tool
4. If framing matches the persona, agent proceeds to the read-tool instruction and loads the playbook

This is the primary lever for Windsurf — the playbook-side fit-check is a backup if the agent does load enough of the playbook to see it.

### 4. CC `/z` router — new slash command

**Path:** `.claude/commands/z.md`

Claude Code only. A front-door router slash command that:

1. Reads the user's framing
2. Loads `references/_meta/command-routing.md` (CC reads cross-linked files reliably)
3. Classifies the framing per the rubric
4. Loads the target playbook directly and proceeds

For users who don't know which persona to pick, `/z <framing>` does the classification work for them. CC-only because Windsurf has no equivalent surface — the `/zscaler` shim already plays that role for Windsurf users.

## What this means for `/zscaler` (downstream-owned shim)

The `/zscaler` shim is owned and maintained outside this kit. The kit-side changes proposed above are **complete on their own** — they give Windsurf users redirect support per-workflow (via the workflow-file fit-checks) without any change to `/zscaler`.

There are two **optional** ways `/zscaler` could leverage the rubric to improve its own routing:

### Option A — `/zscaler` cites `references/_meta/command-routing.md`

The shim's body is updated to instruct the agent: "use the read tool to load `references/_meta/command-routing.md`, classify the user's framing per the rubric, then load the corresponding kit workflow / playbook."

This effectively turns `/zscaler` into the Windsurf equivalent of CC's `/z` router. Tradeoff: the shim now depends on a kit-side file path that's owned upstream.

### Option B — `/zscaler` inlines the routing heuristic

A compact version of the classification table is inlined directly in the shim body. The shim's classification logic is self-contained; updates to the rubric require updates to the shim.

Tradeoff: shim and rubric can drift; mitigated by a comment pointing at `_meta/command-routing.md` as the source.

### Recommendation

**Option A.** The kit-side rubric is the authoritative routing logic; the shim cites it; rubric updates propagate without shim changes. The cost is an extra read-tool call on every `/zscaler` invocation, which is small.

If Option A isn't feasible (e.g., the shim's host environment can't read kit files reliably), Option B is the fallback.

## Open questions for downstream

1. Does `/zscaler` currently do any routing beyond loading the kit-as-skill? If yes, which patterns trigger which target? (Useful for sanity-checking the rubric we'd ship kit-side covers the existing cases.)
2. Is there appetite for `/zscaler` to incorporate the kit's routing rubric (Option A above)? If so, what's the timeline / process for shim changes?
3. Are there Windsurf-specific framing markers (vocabulary the user community has settled on) that should be added to the rubric beyond what kit-side authors would think of?
4. Should we ship a kit-side `/z` Windsurf workflow as an alternative entry point, or stay shim-only on Windsurf? (Default in this proposal: shim-only — `/z` workflow would compete with `/zscaler` and the user community would have two entry points to choose from.)

## What's NOT in this proposal

- **Mid-flow persona switching.** If a `/z-investigate` session evolves into something that's clearly a SOC concern partway through, can we hot-swap to `/z-soc`? Out of scope for this proposal — front-door routing only.
- **Replacing `/zscaler`.** Whatever the shim does today continues working; this proposal adds a kit-side rubric the shim *could* leverage.
- **Subagent-based routing.** CC has Agent / subagent primitives Windsurf doesn't; this proposal stays portable across both.
- **Wholesale shim refactor.** The kit-side changes don't require any shim changes — they're complete independently.

## Implementation status

This proposal is **not yet implemented kit-side**. Everything described above is design intent. Once downstream feedback lands, implementation is roughly:

- 2 new files (`_meta/command-routing.md`, `.claude/commands/z.md`)
- 8 file edits (4 playbooks + 4 Windsurf workflows, each gains a fit-check block)
- Total: ~80 lines of new content, maintenance burden small (rubric is the single source; fit-check blocks compress it)

Time to ship: ~1 hour kit-side once direction is confirmed.

## References

- [`references/shared/windsurf-runtime-notes.md`](../references/shared/windsurf-runtime-notes.md) — Windsurf primitive constraints
- [`references/shared/investigate-prompt.md`](../references/shared/investigate-prompt.md) — current `/z-investigate` playbook
- [`references/shared/audit-prompt.md`](../references/shared/audit-prompt.md) — current `/z-audit` playbook
- [`references/shared/architect-prompt.md`](../references/shared/architect-prompt.md) — current `/z-architect` playbook
- [`references/shared/soc-prompt.md`](../references/shared/soc-prompt.md) — current `/z-soc` playbook
- [`references/_meta/charter.md`](../references/_meta/charter.md) § 5 — design-for-weakest-model principle that drives the workflow-file inlining choice
