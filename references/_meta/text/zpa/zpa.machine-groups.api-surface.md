# Machine groups through the ZPA API, SDKs and Terraform (zpa.machine-groups.api-surface)
Also called: can I create a machine group with terraform; machine group api; zpa_machine_group data source; machine group sdk; machine group read only; machine group summary
Former IDs: zpa-11

This subject covers machine groups in the API, the SDKs and Terraform.

**The API.** ZPA's API documentation says machine group API resources allow you to read machine groups. The documented operations are a GET on the collection and a GET on a single group. [zpa.machine-groups.api-surface:api-read-only] The Go and Python SDKs also call `/machineGroup/summary` (the Python SDK with a GET), a name-and-ID listing; the OpenAPI capture does not list that path. [zpa.machine-groups.api-surface:summary-endpoint] The machine group list takes `page` and `pagesize`, with a default page size of 20 and a maximum of 500. [zpa.machine-groups.api-surface:paging] Whether the live API would reject a write is open [gap:zpa.machine-groups.api-surface:create-endpoint-absence].

**The SDKs.** The Go machinegroup package exposes Get, GetByName, GetAll and GetMachineGroupSummary, and the Python MachineGroupsAPI exposes list_machine_groups, list_machine_group_summary and get_group. Neither SDK has a create, update or delete function for machine groups. [zpa.machine-groups.api-surface:sdk-no-writes] The Go SDK's GetByName lists machine groups with the name as a search filter and returns the first result whose name matches case-insensitively. [zpa.machine-groups.api-surface:name-lookup] The Python MachineGroup model reads `id`, `name`, `enabled`, `description`, `creationTime`, `modifiedTime` and `modifiedBy`. It has no attribute for the `machines` list or the microtenant fields. [zpa.machine-groups.api-surface:python-model-omits-machines] How the Go SDK pages these lists: [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination).

**Terraform.** The ZPA Terraform provider has a `zpa_machine_group` data source and no machine group resource. [zpa.machine-groups.api-surface:terraform-data-source-only] The data source exports `id`, `creation_time`, `description`, `enabled`, `modified_by`, `modified_name`, `microtenant_id`, `microtenant_name` and a `machines` list. Each machine entry has `fingerprint`, `issued_cert_id`, `machine_group_id`, `machine_group_name`, `machine_token_id` and `signing_cert`. [zpa.machine-groups.api-surface:data-source-attributes] The provider documents that the machine group data source can be referenced in an access, timeout, forwarding, inspection or isolation policy. [zpa.machine-groups.api-surface:data-source-feeds-policy] The provider asks that search queries for the machine group data source avoid multiple spaces and special characters. [zpa.machine-groups.api-surface:search-note] Data source defects common to the provider: [Which object a ZPA Terraform data source actually returns](kb:zpa.terraform.data-source-selection), [What ZPA Terraform data sources return, drop, or get wrong](kb:zpa.terraform.data-source-fidelity).

**Certificate key.** The per-machine certificate is named differently by the sources [divergence:zpa.machine-groups.api-surface:signing-cert-field-name].

**Microtenants.** For machine groups and machine provisioning keys defined in the Default Microtenant, the Microtenant configuration permissions table gives the Default Microtenant (global administrator) full access to both, and gives a Microtenant read-only access to machine groups while the machine provisioning keys are not visible to it. [zpa.machine-groups.api-surface:microtenant-permissions]

What to check:
1. Whether the task needs to create or change a group, which no documented client does; use the console.
2. Which certificate key a client reads from a machine record.
3. Whether a Python caller needs the machines list, which its model does not carry.
4. Whether the caller is in a custom microtenant, where machine groups defined in the Default Microtenant are read-only.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.machine-groups.api-surface:sdk-no-writes] Tier B: Rests on absence: both files were read in full and define no other public function.
- [zpa.machine-groups.api-surface:terraform-data-source-only] Tier B: Rests on absence: searched the provider's docs/resources and zpa/ directories (2026-10-18) and found data_source_zpa_machine_group.go but no resource file or resource document for machine groups.
- [zpa.machine-groups.api-surface:python-model-omits-machines] Tier B: Rests on absence: the model's __init__ and request_format were read in full and mention no machines or microtenant key.

Sources disagree (name both sides):
- The OpenAPI capture names the per-machine certificate `enrollmentCert`; the SDKs and Terraform call it `signingCert`. [divergence:zpa.machine-groups.api-surface:signing-cert-field-name]
  - api-specs: A machine record carries an `enrollmentCert` object.
  - sdk-go: The Go SDK reads and sends the certificate under `signingCert`.
  - tf-zpa: The Terraform data source exports it as `signing_cert`.
  Impact: A client written from the OpenAPI capture and one written from the SDK read different keys for the same certificate, so a field that is empty in one may be populated in the other.

Not known (open gaps):
- Whether the live API accepts a write on machine groups [gap:zpa.machine-groups.api-surface:create-endpoint-absence]: settled by lab-test. Blocks: saying the API cannot create a group, as opposed to saying no documented client does

Area: zpa.machine-groups, its subjects in references/_meta/spine/zpa/zpa.machine-groups.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-fidelity.md (What ZPA Terraform data sources return, drop, or get wrong)
- links-to references/_meta/text/zpa/zpa.terraform.data-source-selection.md (Which object a ZPA Terraform data source actually returns)
