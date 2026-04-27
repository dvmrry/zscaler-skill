# Windsurf Skills Documentation

Source: https://docs.windsurf.com/windsurf/cascade/skills

Skills help Cascade handle complex, multi-step tasks.

The hardest engineering tasks often take more than just good prompts. They might require reference scripts, templates, checklists, and other supporting files. Skills let you bundle all of these together into folders that Cascade can invoke (read and use).

Skills are a great way to teach Cascade how to execute multi-step workflows consistently.

Cascade uses **progressive disclosure**: only the skill's `name` and `description` are shown to the model by default. The full `SKILL.md` content and supporting files are loaded **only when Cascade decides to invoke the skill** (or when you `@mention` it). This keeps your context window lean even with many skills defined.

For more details on the Skills specification, visit [agentskills.io](https://agentskills.io/home).
