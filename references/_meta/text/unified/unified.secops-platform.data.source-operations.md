# Agentic SecOps Platform source operations: suppression rules and tracking data source runs (unified.secops-platform.data.source-operations)
Also called: suppression rules; source runs; tracking data source runs

## Suppression rules

Suppression rules either exclude specific data or include only a targeted subset of the source data, and can be set during initial source setup or after the source has first ingested data. [unified.secops-platform.data.source-operations:sup-purpose] Suppression rules apply only to data ingested after the rules are configured and do not retroactively affect previously ingested data. [unified.secops-platform.data.source-operations:sup-not-retroactive] Suppression rules use the original field names from the third-party source; the field-name drop-down is populated with field names from the source after at least one ingestion run, and on a new source field names can be entered manually. [unified.secops-platform.data.source-operations:sup-field-names]

**Configuring.** A suppression rule takes a scope of Exclude Rows or Include Rows, a field type (for example Text, Date, Number, Boolean) that determines the available operators, a value, and optional AND/OR compound logic; values are case sensitive. [unified.secops-platform.data.source-operations:sup-rule-config] Configuring rules on an existing source follows three steps: configure the rules, delete existing data, and reprocess the data; for a reader not already familiar with the source field names and field types, the help recommends letting the source ingest once without rules. [unified.secops-platform.data.source-operations:sup-existing-source] The step bodies are not in the capture [gap:unified.secops-platform.data.source-operations:sup-steps-not-captured]. Saving a source with suppression rules does not run it; the source runs on its schedule unless processed immediately with the Process Now icon. [unified.secops-platform.data.source-operations:sup-save-not-run]

**Checking that they work.** Suppression can be validated by a decrease in the most recent run's ingested row count or by a Logs query on the suppressed field with the Equals operator, where no results suggests the rule is working. [unified.secops-platform.data.source-operations:sup-validate]

## Source runs

A source run's Status is Completed (no authentication or ingestion issues), Canceled (intentionally stopped by the user) or Failed (an error prevented completion). [unified.secops-platform.data.source-operations:run-status] A source run's Category is Map and Aggregate (data has been unified), Map (data not unified, original raw format) or N/A for canceled or failed runs. [unified.secops-platform.data.source-operations:run-category] Data Retrieval Type shows whether a run retrieved the entire dataset (Full) or only new or updated data (Incremental). [unified.secops-platform.data.source-operations:run-retrieval-type]

**What triggered a run.** A source run is triggered by System (its configured schedule) or User (Process Now or Rerun Last Execution), and its Run type is Source process (manual), Scheduled, or Batched (platform-managed batch process). [unified.secops-platform.data.source-operations:run-trigger-type]

The Entity Management Runs list defines Batched differently [The Agentic SecOps Platform data model: entity types, Data Model Management, field settings, processing and Entity Management Runs](kb:unified.secops-platform.data.model).

**Run detail.** An expanded completed run lists Activities such as Data Retrieval, Mapping and Entities, with nested activities under Entities such as Assets, Findings, Tickets, Merge and Data Manipulation, and shows File Size in megabytes, Number of Files and Total Number of Rows. [unified.secops-platform.data.source-operations:run-activities] An expanded failed run shows an Error type, Error description, Actionable Resolution Steps and the Original Error Message returned by the external system, and the error details can be copied to share with Zscaler Support. [unified.secops-platform.data.source-operations:run-failed-details] The help groups common run failures into authentication, permission, configuration, connectivity, vendor service (unavailable, rate limited or unexpected response) and processing (mapping, merge or data manipulation) errors. [unified.secops-platform.data.source-operations:run-common-errors] How long run history is kept is not stated [gap:unified.secops-platform.data.source-operations:run-history-retention].

Not known (open gaps):
- How long source run history is retained [gap:unified.secops-platform.data.source-operations:run-history-retention]: settled by source-read
- Suppression rule steps 1 to 3 on an existing source [gap:unified.secops-platform.data.source-operations:sup-steps-not-captured]: settled by source-read

Area: unified.secops-platform, its subjects in references/_meta/spine/unified/unified.secops-platform.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/unified/unified.secops-platform.data.model.md (The Agentic SecOps Platform data model: entity types, Data Model Management, field settings, processing and Entity Management Runs)

Configured via and see also (open one only if the answer needs it):
- see-also references/_meta/text/unified/unified.secops-platform.data.md (Agentic SecOps Platform data sources, outegrations and data management: hub (deployment flows, catalogs, outegration wizard))
- see-also references/_meta/text/unified/unified.secops-platform.data.mapping.md (Source mapping in the Agentic SecOps Platform: workspace, value methods, explode, minimum fields, keys, parser types and Explore)
- see-also references/_meta/text/uvm/uvm.data-sources.md (UVM data sources: shared connector facts, availability, and the Jira, Zscaler, Okta, Code42, NetBox, runZero, SecurityScorecard and SFTP connectors)
- see-also references/_meta/text/shared/shared.logs-fair-use.log-retention.md (How long Zscaler keeps the logs of the products on the Logs and Fair Use pages, and where it stores them)
