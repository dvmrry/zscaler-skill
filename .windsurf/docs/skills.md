# Windsurf Skills Documentation

Source: https://docs.windsurf.com/windsurf/cascade/skills

Skills help Cascade handle complex, multi-step tasks.

The hardest engineering tasks often take more than just good prompts. They might require reference scripts, templates, checklists, and other supporting files. Skills let you bundle all of these together into folders that Cascade can invoke (read and use).

Skills are a great way to teach Cascade how to execute multi-step workflows consistently.

Cascade uses **progressive disclosure**: only the skill's `name` and `description` are shown to the model by default. The full `SKILL.md` content and supporting files are loaded **only when Cascade decides to invoke the skill** (or when you `@mention` it). This keeps your context window lean even with many skills defined.

For more details on the Skills specification, visit [agentskills.io](https://agentskills.io/home).

## How to Create a Skill

### Using the UI (easiest)

1. Open the Cascade panel
2. Click the three dots in the top right of the panel to open up the customizations menu
3. Click on the `Skills` section
4. Click `+ Workspace` to create a workspace (project-specific) skill, or `+ Global` to create a global skill
5. Name the skill (lowercase letters, numbers, and hyphens only)

### Manual Creation

**Workspace Skill (project-specific):**

1. Create a directory: `.windsurf/skills/<skill-name>/`
2. Add a `SKILL.md` file with YAML frontmatter

**Global Skill (available in all workspaces):**

1. Create a directory: `~/.codeium/windsurf/skills/<skill-name>/`
2. Add a `SKILL.md` file with YAML frontmatter

## SKILL.md File Format

Each skill requires a `SKILL.md` file with YAML frontmatter containing the skill's metadata.

### Example skill

```markdown
---
name: deploy-to-production
description: Guides the deployment process to production with safety checks
---

## Pre-deployment Checklist
1. Run all tests
2. Check for uncommitted changes
3. Verify environment variables

## Deployment Steps
Follow these steps to deploy safely...

[Reference supporting files in this directory as needed]
```

### Required Frontmatter Fields

- **name**: Unique identifier for the skill (displayed in UI and used for @-mentions)
- **description**: Brief explanation shown to the model to help it decide when to invoke the skill

Examples of valid names: `deploy-to-staging`, `code-review`, `setup-dev-environment`
