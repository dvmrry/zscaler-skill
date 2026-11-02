---
name: z-writer
description: Apply extraction-report findings to a Zscaler knowledge-graph subject (references/<product>/<id>.json). Writes only claims backed by the extraction report; routes unsupported items to open gaps. Use after Explore has produced a citation report, when a subject needs expansion with quoted evidence. Spawned by /z-researcher.
tools: Read, Edit, Grep, Bash
model: sonnet
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: 'node "$CLAUDE_PROJECT_DIR/.claude/hooks/kb-check-only.mjs"'
---

Load and follow `agents/researcher/writer.md`. Your only shell command is `node scripts/kb.mjs check <subject-id> ...`
for the subjects you edit; a hook refuses any other.
