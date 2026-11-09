# Mapping Copilot: the AI-powered mapping assistant, its prerequisites, supported entities, limits and privacy terms (unified.secops-platform.data.mapping-copilot)
Also called: mapping copilot

Mapping Copilot is an AI-powered assistant that recommends mappings and generates mapping logic including Python scripts, and is described as especially useful for unfamiliar schemas such as AnySource and integrations without default mappings. [unified.secops-platform.data.mapping-copilot:cop-purpose]

**Before using it.** Mapping Copilot needs at least one successful source run within the last 90 days and a role with Read and Edit permissions under the Platform - Data Source Mapping resource; account admins can remove access by turning off AI capabilities in Account Settings. [unified.secops-platform.data.mapping-copilot:cop-prereq] Mapping Copilot first analyzes the source file for context, data types and statistics, which can take a few minutes depending on file size, and prompts cannot be sent until it finishes. [unified.secops-platform.data.mapping-copilot:cop-initial-analysis]

**Scope.** Mapping Copilot suggests mappings for Assets, Findings, Components, Org Entities and Global Vulnerabilities, offers only early-stage support for Alerts, IoC and MITRE, and does not support mapping to custom entities. [unified.secops-platform.data.mapping-copilot:cop-entities] Mapping Copilot does not currently support configuring explode for array fields; this must be done manually in the mapping editor. [unified.secops-platform.data.mapping-copilot:cop-no-explode]

**Using the suggestions.** Copilot suggestions are inserted as editable drafts using Apply, which overwrites the current mapping configuration, or Append, which adds mappings without altering existing ones; suggested connections are marked with an AI icon. [unified.secops-platform.data.mapping-copilot:cop-apply-append] Mapping Copilot provides guidance only and does not verify end-to-end correctness or downstream behavior, so suggestions must be tested before saving and the source rerun afterward. [unified.secops-platform.data.mapping-copilot:cop-not-final]

**Privacy.** Data shared with Mapping Copilot is not transmitted to external third parties, and use of the AI-powered features is optional and controlled by admin opt-in. [unified.secops-platform.data.mapping-copilot:cop-privacy]

Area: unified.secops-platform, its subjects in references/_meta/spine/unified/unified.secops-platform.json
