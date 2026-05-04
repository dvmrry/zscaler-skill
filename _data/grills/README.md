# `_data/grills/` — grill-session synthesis artifacts

Captured output from the `grill-me` skill (and similar interview-style sessions). One file per session: `<YYYY-MM-DD>-<short-slug>.md`.

## Why this exists

`grill-me` is a behavior-modifier skill — it turns the assistant into an interrogator that walks the design tree of a plan or project. The session itself is high-value Q+A, but the skill doesn't prescribe an artifact; without explicit capture, the shared understanding evaporates with the session and memory's compaction.

This directory is where synthesis lives so that:

- Future sessions can pick up at the strategic level rather than re-grilling fundamentals
- Calibrations / recalibrations surfaced during the grill stay accessible
- Action items born from the grill have a home until they're promoted to `IMPROVEMENTS.md` or executed
- The strategic picture survives session compaction and model context loss

## Privacy posture

Default-private (`_data/grills/*` gitignored, matching incidents/). Grill sessions often surface personal, employer, or political context — even when sanitized for the artifact, gitignored ≠ air-gapped. Default to keeping these local.

## Per-session structure (loose template)

```
# Grill session — <date> — <topic>

## Frame
- What was grilled (target / scope)
- Why (what triggered the session)

## Constraint map
- The factual constraints that came out (time budget, deployment surface, etc.)

## Key recalibrations
- What the grill got wrong on the way and what corrected
- Questions / framings the user pushed back on

## Shared understanding (durable framings)
- The non-obvious takes that should survive future sessions

## Action items
- Concrete work that emerged. Promote to IMPROVEMENTS.md when ready

## Branches not grilled
- Open design-tree branches that didn't get walked. Hooks for future grills.
```

Free-form is fine; the template is a starting point, not a hard schema.
