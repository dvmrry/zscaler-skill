# How the ZPA Terraform provider resolves the enrollment certificate for connector, service edge and private cloud groups (zpa.terraform.group-enrollment)
Also called: enrollment_cert_id empty state; missing.mandatory.params update group; zpa_app_connector_group enrollment_cert_id; zpa_service_edge_group enrollment_cert_id; enrollment certificate auto-resolve

App Connector, Service Edge and Private Cloud groups share one enrollment-certificate resolver. enrollment_cert_id is an Optional and Computed string on the App Connector group, Service Edge group and Private Cloud group resources, and its schema description says the provider looks the certificate up by name when it is not set. [zpa.terraform.group-enrollment:cert-optional-computed]

**What the resolver does.** The shared resolver returns without a lookup when enrollment_cert_id already holds a nonempty string in the resource data. [zpa.terraform.group-enrollment:resolver-keeps-nonempty] When the value is missing or empty, the resolver looks the certificate up by name, fails the operation on a lookup error or an empty ID, and otherwise sets enrollment_cert_id to the resolved ID. [zpa.terraform.group-enrollment:resolver-lookup-by-name] App Connector groups and Private Cloud groups resolve the certificate named Connector, and Service Edge groups resolve the certificate named Service Edge. [zpa.terraform.group-enrollment:cert-names-per-resource]

**When it runs.** The resolver runs on every create and every update of the three group resources; the update-path comment says the API requires enrollmentCertId on update, including for groups whose state has no value. [zpa.terraform.group-enrollment:resolver-runs-every-write] Read copies enrollment_cert_id from the API response into state, and the request expander sends whatever value the resource data currently holds. [zpa.terraform.group-enrollment:read-hydrates-write-sends-state] A refresh only runs Read, which hydrates state from the API response; the resolver runs only inside create and update, so a group whose state holds an empty certificate ID is repaired when an update runs. [zpa.terraform.group-enrollment:refresh-does-not-resolve] The App Connector group importer accepts a numeric ID or a name, resolves the name to an ID, and returns; it does not call the enrollment-certificate resolver. [zpa.terraform.group-enrollment:import-skips-resolver]

**Consequences.** An explicit empty string for enrollment_cert_id does not clear the certificate. The resolver looks the certificate up by name only when the resource data holds no nonempty value, which is on create or on an update of a group whose state is also empty; on other updates the Optional and Computed attribute keeps the ID already in state, so the resolver returns without a lookup and that ID is sent. [zpa.terraform.group-enrollment:empty-string-selects-lookup] Removing an explicit enrollment_cert_id from the configuration can leave the value already in state in place rather than clearing it. [zpa.terraform.group-enrollment:removing-id-retains-value]

The same fix as seen from the product: [App Connector groups](kb:zpa.app-connectors.connector-groups) and [Enrolling a Private Service Edge](kb:zpa.private-service-edges.enrollment). User code verification is separate: [ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps](kb:zpa.terraform.resource-fidelity).

What to check:
1. Whether the group state holds an empty enrollment_cert_id; an update, not a refresh, repairs it.
2. Which certificate name the resource resolves, Connector or Service Edge.
3. Whether the group was imported, since imports skip the resolver.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.terraform.group-enrollment:empty-string-selects-lookup] Tier B: Narrowed after verification: previously said an empty string always selects a lookup, but on update an empty value for an Optional and Computed attribute keeps the state value. It relies on Terraform treating an empty configured string on such an attribute as unset, which is not shown in a captured source.
- [zpa.terraform.group-enrollment:removing-id-retains-value] Tier B: Follows from the attribute being Optional and Computed with Read filling it from the API. It relies on Terraform's usual handling of an Optional and Computed attribute removed from configuration, which is not shown in a captured source.
- [zpa.terraform.group-enrollment:refresh-does-not-resolve] Tier B: Follows from the resolver being called only in the create and update functions. The healing needs an update to be planned for the resource; whether a plain refresh-only plan never does so is Terraform behavior, not shown in a source.

Area: zpa.terraform, its subjects in references/_meta/spine/zpa/zpa.terraform.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.api.certificates-wire.md (Enrollment and Browser Access certificate API: wire keys, paths and client quirks): The Go integration test asserts that GetAll returns enrollment certificates named Root, Client, Connector, Service Edge and Isolation Client. [zpa.api.certificates-wire:system-provisioned-names]
- depends-on references/_meta/text/zpa/zpa.terraform.provider-config.md (ZPA Terraform provider configuration: no-credential mode, authentication framework, clouds and rate limits), from zpa.terraform: The provider chooses the legacy ZPA client when use_legacy_client is true, from the provider attribute or, when that is unset, from ZSCALER_USE_LEGACY_CLIENT being the string true. [zpa.terraform.provider-config:legacy-client-switch]
- links-to references/_meta/text/zpa/zpa.app-connectors.connector-groups.md (App Connector groups)
- links-to references/_meta/text/zpa/zpa.private-service-edges.enrollment.md (Enrolling a Private Service Edge)
- links-to references/_meta/text/zpa/zpa.terraform.resource-fidelity.md (ZPA Terraform resources: fields not sent, not read back, or written in several non-atomic steps)
