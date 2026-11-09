# Terraform sandbox resources: file submission and the MD5 blocklist (zia.terraform.sandbox-resources)
Also called: zia_sandbox_file_submission; zia_sandbox_behavioral_analysis_v2; sandbox_settings import; ZSCALER_SANDBOX_TOKEN; terraform sandbox submit discan

Sandbox file submission is an action rather than managed configuration. `zia_sandbox_file_submission` has a Read that does nothing, because only POST methods exist and the data cannot be fetched again, and it defines no importer. [zia.terraform.sandbox-resources:submission-read-noop] Deleting `zia_sandbox_file_submission` only clears it from state, since the API has no DELETE method. [zia.terraform.sandbox-resources:submission-delete-state-only] A change to `file_path` or `force` makes Update submit the file again. [zia.terraform.sandbox-resources:submission-resubmits-on-change]

**Submitting.** `submission_method` is validated as `submit` or `discan`, and `force` makes the sandbox reanalyze a file that already has a verdict. [zia.terraform.sandbox-resources:submission-methods] Sandbox submission needs the separately licensed Cloud Sandbox, allows up to 100 files per day, and limits each file to 400 MB; the verdict is retrieved from the report endpoint about 10 minutes after submission. [zia.terraform.sandbox-resources:submission-license-and-limits] Platform behavior of submission: [Submitting files to Sandbox and out-of-band inspection (Discan)](kb:zia.sandbox.submission).

**Credentials.** The resource page says the provider requires `ZIA_CLOUD` and `ZIA_SANDBOX_TOKEN` to authenticate to the sandbox. [zia.terraform.sandbox-resources:submission-page-names-legacy-vars] That disagrees with the provider index [divergence:zia.terraform.sandbox-resources:sandbox-token-variable-names]; the real variables are in [ZIA Terraform provider authentication, client modes and rate limiting](kb:zia.terraform.provider-modes).

**MD5 blocklist.** The `_v2` form is an Early Access resource, listed in [The provider documentation marks `zia_url_categories_predefined`, `zia_sandbox_behavioral_analysis_v2`, `zia_extranet`, `zia_dc_exclusions` and `zia_sub_cloud` as Early Access features.](kb:zia.terraform.early-access:early-access-resources). `zia_sandbox_behavioral_analysis_v2` overwrites a previously generated MD5 blocklist. [zia.terraform.sandbox-resources:v2-overwrites-blocklist] Both `zia_sandbox_behavioral_analysis` and its `_v2` form are imported with the literal ID `sandbox_settings`. [zia.terraform.sandbox-resources:blocklist-resources-import-id] What the list is: [Sandbox custom MD5 hash list](kb:zia.sandbox.md5-blocklist).

What to check:
1. Which sandbox variables are set, since the resource page names variables the provider no longer reads.
2. Whether a submission resource was expected to be refreshed or imported, which it cannot be.

Sources disagree (name both sides):
- Which environment variables authenticate the provider to the sandbox. [divergence:zia.terraform.sandbox-resources:sandbox-token-variable-names]
  - tf-zia: The sandbox file submission page says the provider requires `ZIA_CLOUD` and `ZIA_SANDBOX_TOKEN`.
  - tf-zia: The provider index page says those legacy variables are no longer supported since v4.0.0 and the provider reads `ZSCALER_SANDBOX_CLOUD` and `ZSCALER_SANDBOX_TOKEN`.
  Impact: Set ZSCALER_SANDBOX_TOKEN and ZSCALER_SANDBOX_CLOUD (or the provider attributes); the variable names on the resource page are stale.

Area: zia.terraform, its subjects in references/_meta/spine/zia/zia.terraform.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zia/zia.sandbox.submission.md (Submitting files to Sandbox and out-of-band inspection (Discan)): Sandbox submission needs the separately licensed Cloud Sandbox, allows up to 100 files per day, and limits each file to 400 MB; the verdict is retrieved from the report endpoint about 10 minutes after submission. [zia.terraform.sandbox-resources:submission-license-and-limits]
- links-to references/_meta/text/zia/zia.sandbox.md5-blocklist.md (Sandbox custom MD5 hash list)
- links-to references/_meta/text/zia/zia.terraform.early-access.md (Early Access Terraform resources: extranet, data center exclusions, subclouds)
- links-to references/_meta/text/zia/zia.terraform.provider-modes.md (ZIA Terraform provider authentication, client modes and rate limiting)
