---
description: Expand a Zscaler skill reference doc with citation-backed content. Uses parse, extract, write, and verify checkpoints to keep operator context out of reference docs.
argument-hint: <target-file-path> [scope: whole-file|section <name>|add <topic>]
---

<!-- adapter-deps:start -->
Load and follow the playbook at @agents/researcher/prompt.md.
<!-- adapter-deps:end -->

The user's researcher scope:

$ARGUMENTS

Use Claude Code subagents for the read-only extraction, writer, and read-only verification phases when available, but keep the canonical writer isolation rule intact.
