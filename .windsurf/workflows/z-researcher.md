---
description: Expand a Zscaler skill reference doc with citation-backed content. Uses parse, extract, write, and verify checkpoints to keep operator context out of reference docs.
---

# /z-researcher

## Required reads — do these now, in order

<!-- adapter-deps:start -->
1. **Use your file-read tool to load `agents/researcher/prompt.md`.** This is the playbook. It defines the parse, extract, write, and verify checkpoints.
<!-- adapter-deps:end -->

All paths are relative to the Zscaler skill repo root. **Do not respond until the playbook is loaded.** Then follow the researcher workflow.

## Best framing for the user's input

The user's researcher scope should include:

- **Target file** — `references/<product>/<topic>.md`
- **Scope** — whole file, named section, or new topic
- **Sources** — optional vendor captures, SDK files, help articles, or adjacent references to mine

If the target file is ambiguous, ask one clarifying question and stop.
