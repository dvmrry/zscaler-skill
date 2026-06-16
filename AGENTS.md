# Zscaler Skill Runtime Guide

This repository is a Zscaler skill and workflow knowledge base. When working in
this repo, treat the product references, agent playbooks, scripts, and runtime
adapters as separate layers.

Canonical workflow logic lives under `agents/`. Portable Agent Skills under
`.agents/skills/` are open-standard loaders for those canonical workflows.
Runtime-specific files under `.claude/`, `.devin/`, or other adapter
directories should stay thin where the runtime can follow the canonical
workflow directly. Adapters may reinforce a canonical harness when a weaker
runtime needs explicit checkpoint or output-shape discipline, but the harness
contract belongs under `agents/`.

For Zscaler questions:

- Do not answer Zscaler policy, API, log, or tenant-specific questions from
  memory.
- For ad-hoc Q&A, read `agents/zscaler/prompt.md` and follow it.
<!-- capability-routing:start -->

<!-- GENERATED from agents/_meta/capability-registry.json — do not edit by hand. -->

- /z-investigator — symptom, affected-scope, timeframe, why is, broken, failing, intermittent, regression
- /z-auditor — audit, hygiene, lint the refs, structural review, reference quality
- /z-soc — posture, threat, exposure, least-privilege, attack surface, blast radius, telemetry coverage, detection, RBAC, defensible
- /z-architect — capacity, scaling, sizing, design, recommendation, SPOF, growth, topology, will this scale, single point of failure
- /z-retro — existing-journal, postmortem, retro, lessons, warning ledger, decision gate, after the incident
- /z-researcher — expand the reference, citation-backed, document behavior, mine sources, reference expansion, SDK divergences, drift in the reference, add a section
- @zscaler-skill-setup — _data mount, runtime-data mount, set up the _data, repair the _data, check-data-contract, overlay submission

<!-- capability-routing:end -->
- Portable Agent Skills (`zscaler-investigator`, `zscaler-soc`) under `.agents/skills/` are
  open-standard loaders for the canonical workflows; prefer the slash commands above for direct
  invocation.
- Load only the files needed for the current question.
- Tenant-specific truth lives in `_data/snapshot/` and `_data/iac/`.
- Do not read `vendor/` unless the loaded prompt or current question
  specifically requires it.

Downstream installations may generate, replace, or omit runtime adapter files.
Do not treat generated adapter files as the source of truth.
