# Windsurf Workflows Documentation

Source: https://docs.windsurf.com/windsurf/cascade/workflows

## How it works

Rules generally provide large language models with guidance by providing persistent, reusable context at the prompt level.

Workflows extend this concept by providing a structured sequence of steps or prompts at the trajectory level, guiding the model through a series of interconnected tasks or actions.

To execute a Workflow, users simply invoke it in Cascade using the `/[workflow-name]` command.

**Tip:** You can call other Workflows from within a Workflow! For example, /workflow-1 can include instructions like "Call /workflow-2" and "Call /workflow-3".

Upon invocation, Cascade sequentially processes each step defined in the Workflow, performing actions or generating responses as specified.

## How to create a Workflow

To get started with Workflows, click on the `Customizations` icon in the top right slider menu in Cascade, then navigate to the `Workflows` panel. Here, you can click on the `+ Workflow` button to create a new Workflow.

Workflows are saved as markdown files within `.windsurf/workflows/` directories and contain a title, description, and a series of steps with specific instructions for Cascade to follow.

## Workflow Discovery

Windsurf automatically discovers workflows from multiple locations to provide flexible organization:

- **Current workspace and sub-directories**: All `.windsurf/workflows/` directories within your current workspace and its sub-directories
- **Git repository structure**: For git repositories, Windsurf also searches up to the git root directory to find workflows in parent directories
- **Multiple workspace support**: When multiple folders are open in the same workspace, workflows are deduplicated and displayed with the shortest relative path

### Workflow Storage Locations

Workflows can be stored in any of these locations:

- `.windsurf/workflows/` in your current workspace directory
- `.windsurf/workflows/` in any sub-directory of your workspace
- `.windsurf/workflows/` in parent directories up to the git root (for git repositories)

When you create a new workflow, it will be saved in the `.windsurf/workflows/` directory of your current workspace, not necessarily at the git root.

**Workflow files are limited to 12,000 characters each.**

### Generate a Workflow with Cascade

You can also ask Cascade to generate Workflows for you! This works particularly well for Workflows involving a series of steps in a particular CLI tool.
