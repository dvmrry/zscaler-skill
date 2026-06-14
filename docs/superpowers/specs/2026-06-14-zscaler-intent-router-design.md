# @zscaler intent router + capability registry

**Status:** design (pre-implementation) · **Date:** 2026-06-14 · **Origin:** "grounding + routing layer" / agent-hub front-door discussion

## Problem

`@zscaler` is today an ad-hoc grounded Q&A workflow. Two forces push it toward
being a **front door**:

1. **The skill is becoming a grounding + routing layer** — shedding the *doing*
   (creds/SDK → `zscalerctl` and external repos own execution). Its job is to
   ground answers and point you to the right capability, not to do everything.
2. **Capabilities are federating** — across internal roles (investigator,
   auditor, soc, architect, retro, researcher) and, increasingly, **external
   repos that own their own skills/mcps** (e.g. `zscaler-as-code` for IaC).

Users shouldn't need to know the incantation (`/z-auditor`, `/z-soc`, …) or
which repo owns a thing. `@zscaler` should **load the relevant knowledge and
route by intent** — to an internal role *or* an external owner — without forcing
explicit invocation.

This already exists in embryo: `agents/zscaler/workflow.md` says *"if the
question becomes procedural, offer the relevant `/z-*` handoff instead of
silently switching modes,"* and `AGENTS.md:15-29` is a hardcoded prose list of
"for X → suggest `/z-Y`." This design **turns that prose into a data-driven
registry** and makes `@zscaler` an active, honest router over it.

## Core principle: honest hand-off = no-fabrication applied to *capability*

The roles never fabricate findings; the front door never fabricates *capability*.

- Route on **grounded, high-confidence intent**; when ambiguous, **surface the
  candidate routes and ask** — don't silently pick the wrong door.
- When the registry doesn't know who owns something, **say so** — don't guess an
  owner.
- Be **transparent** about what it's doing: *suggest* vs *load* vs *point-to-external*
  — never silent magic.

This is "answer from artifact" applied to *which capability you invoke*.

## Architecture

### Capability registry (the seam — data, not prose)

A registry of entries, each:

```
{
  id,                       // "auditor", "zscaler-as-code", ...
  kind,                     // "internal-role" | "external-owner"
  intentSignals,           // phrases/cues that indicate this capability
  where,                   // internal: workflow path; external: repo+path or _data mount
  review,                  // what to read/look at
  owner,                   // the skill/mcp that owns it (esp. external)
  engageHow                // "suggest" | "load" | "point" | "invoke"
}
```

- **Internal-role entries** are public-safe (role metadata only) → committed in
  the repo. They supersede the hardcoded `AGENTS.md` list.
- **External-owner entries** are fork/tenant-specific (where *your* IaC lives,
  which external skills own it) → live in a **fork overlay under the `_data`
  mount** (gitignored), exactly like `_data/iac` is the fork mount for
  production-truth IaC. Public base + fork overlay mirrors the `references/`
  (owned) vs `_data/` (fork/tenant) split the repo already uses.

### `@zscaler` router

Loads grounding + the registry, classifies intent, and acts per `engageHow`:

- **internal-role / suggest** → "this looks like an audit — run `/z-auditor`"
  (the formalized AGENTS.md nudge).
- **external-owner / point** → honest hand-off: where it lives, what to review,
  who owns it, how you'd engage it. **No hot-load.**
- **ambiguous** → present the candidate routes, ask one clarifying question.
- **unknown** (not in registry) → admit it; do not invent an owner.

### `engageHow` maturity ladder

The audacious end-state and the humble start are the *same architecture* at
different `engageHow` settings. Flipping a value is additive — no rewrite:

```
suggest  →  load (internal: @zscaler loads the role's workflow)
         →  point (external: provenance hand-off, no execution)
         →  invoke (future: a hub actually drives the external skill/mcp)
```

## Incremental delivery

- **Increment 1 (MVP):** registry-as-data for the **internal roles**, all
  `engageHow: "suggest"`; `@zscaler` consults it and gives intent-aware
  suggestions/hand-off. Formalizes `AGENTS.md:15-29` + the workflow's hand-off
  line into one data-driven router. Smallest shippable slice; `@zscaler` stays a
  prompt-scaffolding workflow (it's a router/loader, not a register-producer — no
  MCP server).
- **Increment 2:** external-owner entries via the `_data` fork overlay +
  honest external hand-off (`engageHow: "point"`).
- **Increment 3:** internal `load` — `@zscaler` loads a routed role's workflow
  directly instead of only suggesting it.
- **Increment 4 (future):** `invoke` — a hub drives external skills/mcps
  (intent-not-power boundary). Out of scope here; the registry is the seam that
  keeps it additive.

Each increment is independently useful and proves itself before the next — the
same discipline that let the meta-retro MVP earn its deferred layers.

## What this retires

The **scaffold-role generator (DAV-11 PR5) is no longer worth building.** The
high-leverage shared substrate is the **registry + router**, not a file-stamping
tool. New roles get *surfaced* via the registry and *built directly* (reusing the
PR1/PR2 shared libs). Recommend closing PR5 in favor of this.

## Non-goals

- Hot-loading / hub invocation (Increment 4, future).
- Owning, editing, or executing external repos' tooling.
- Cross-role linkage (separate deferred thread — related but not required here).
- Turning `@zscaler` into a register-shaped role (it's a router shape).

## Data / privacy

Internal-role registry = public-safe, committed. External-owner registry =
fork-private under the `_data` mount (gitignored), same scrub discipline as the
rest of `_data` (cf. the `scrub-iac-attribution` precedent — reading private
infra location/ownership must not leak into public artifacts).

## Open questions (for review)

1. **Registry format/location** — committed file for internal roles (e.g.
   `agents/_meta/capability-registry.json`) + a fork overlay under `_data`? Lean: yes.
2. **Intent classification** — for Increment 1, lightweight (intent cues in the
   workflow prompt, with "ambiguous → ask"), no new infra. Or a structured
   classifier later? Lean: lightweight first; honesty (offer-when-unsure) makes
   it safe.
3. **Relationship to `AGENTS.md:15-29`** — registry supersedes the prose list;
   AGENTS.md then points at `@zscaler` as the concierge. Confirm.
4. **Does the registry double as the meta-retro / cross-role linkage substrate?**
   It's a capability/ownership map; linkage is an artifact-chain map. Likely
   distinct, but worth noting the overlap before either is built out.
