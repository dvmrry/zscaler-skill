---
name: z-verifier
description: Audit a Zscaler skill reference doc diff against the structured input that produced it. Read-only. Flags claims in the diff that lack backing in the input. Use after z-writer has applied edits, to catch unsourced additions before commit. Spawned by /z-researcher.
tools: Read, Bash, Grep
model: haiku
---

Load and follow `agents/researcher/verifier.md`.
