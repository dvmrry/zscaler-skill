# Machine provisioning keys for ZPA machine tunnels (zpa.machine-tunnels.provisioning-keys)
Also called: machine provisioning key; machine token; provisioning key for machine tunnel; machine tunnel enrollment; allow re-enrollment; machine key lost

This subject covers machine provisioning keys.

**What the key is.** A machine provisioning key is a text string generated when the key is added in the Admin Console. Added to a Zscaler Client Connector profile rule, it works as an ID for the machine and lets the Private Access cloud verify the machine's authenticity before Windows or macOS login. [zpa.machine-tunnels.provisioning-keys:key-form] Provisioning keys are to be treated as secrets and protected, because they can create a resource for a tenant, and must not be transmitted or stored in clear text. [zpa.machine-tunnels.provisioning-keys:key-is-secret] A machine provisioning key is its own Admin Console object, tied to a machine group and a signing certificate. It is not one of the association types of the Terraform `zpa_provisioning_key` resource, which are CONNECTOR_GRP, SERVICE_EDGE_GRP, SITE_CONTROLLER_GRP, EXPORTER_GRP and NP_ASSISTANT_GRP. [zpa.machine-tunnels.provisioning-keys:separate-key-type]

**Creating one.** Adding a machine provisioning key takes a name, a status, an Allow Re-Enrollment setting, an existing machine group and a signing certificate. [zpa.machine-tunnels.provisioning-keys:key-fields] A signing certificate is required for enrolling machines and must exist before a new provisioning key is added. [zpa.machine-tunnels.provisioning-keys:signing-cert-first] Allow Re-Enrollment permits machines to re-enrol with the same machine provisioning key, and is off by default. [zpa.machine-tunnels.provisioning-keys:re-enrollment] The option to view or export a key after creation is on by default and cannot be turned on later if it was off at creation. If the key is then not shown and no backup is stored in an external credential vault, a new key must be generated. [zpa.machine-tunnels.provisioning-keys:view-export-once]

**Editing one.** The edit drawer changes the View or Export Provisioning Key After Creation option, Name, Status, Allow Re-Enrollment and Signing Certificate. The view-or-export option is on by default; once disabled it cannot be enabled after creation, but an enabled one can be disabled later. [zpa.machine-tunnels.provisioning-keys:edit-fields] Which keys the table lists is stated two ways [divergence:zpa.machine-tunnels.provisioning-keys:table-visibility].

**Using it.** The key goes into the Client Connector profile rule ([The machine provisioning key must be added to the Zscaler Client Connector profile rule, for Windows or macOS, for machine tunnel enrollment to succeed.](kb:zpa.machine-groups.definition:key-in-profile-rule)), and the tenant switch and authentication options are in [What a ZPA machine tunnel needs before it can connect](kb:zpa.machine-tunnels.requirements). Certificate staging is open [gap:zpa.machine-tunnels.provisioning-keys:certificate-distribution] and macOS MDM is open [gap:zpa.machine-tunnels.provisioning-keys:macos-mdm-effect].

What to check:
1. Whether the key exists, is enabled, and names the intended machine group and a signing certificate.
2. Whether a machine that must enrol again has Allow Re-Enrollment on.
3. Whether the key text is still retrievable; if not, a new key is needed.
4. Whether a Terraform plan was expected to manage the key, which the provider does not.
5. Whether certificate staging or MDM is part of the failure, which no source settles.
6. Whether the key text is stored or sent unprotected; it is a secret.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.machine-tunnels.provisioning-keys:separate-key-type] Tier B: Rests on absence: none of the five association types names a machine group, and the provider has no machine provisioning key resource (searched 2026-10-18).

Sources disagree (name both sides):
- The Editing Machine Provisioning Keys page says both that only keys that can be viewed or exported after creation appear in the table, and that disabling the option hides the key from the Provisioning Key column. [divergence:zpa.machine-tunnels.provisioning-keys:table-visibility]
  - zscaler-help: Only keys that can be viewed or exported after creation appear in the table.
  - zscaler-help: Disabling the option hides the key from the Provisioning Key column of the table and disables copying or downloading the key after creation.
  Impact: Whether a key created with view or export off is listed at all, or listed with its key text hidden, is not settled by the page.

Not known (open gaps):
- Whether MDM-issued certificates on macOS change machine tunnel provisioning [gap:zpa.machine-tunnels.provisioning-keys:macos-mdm-effect]: settled by lab-test or source-read
- How the enrollment certificate reaches the device before Client Connector installs [gap:zpa.machine-tunnels.provisioning-keys:certificate-distribution]: settled by lab-test or operator-experience. Blocks: explaining an enrollment failure by a missing certificate

Area: zpa.machine-tunnels, its subjects in references/_meta/spine/zpa/zpa.machine-tunnels.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.machine-groups.definition.md (What a ZPA machine group is and how machines join it): A machine provisioning key is its own Admin Console object, tied to a machine group and a signing certificate. It is not one of the association types of the Terraform `zpa_provisioning_key` resource, which are CONNECTOR_GRP, SERVICE_EDGE_GRP, SITE_CONTROLLER_GRP, EXPORTER_GRP and NP_ASSISTANT_GRP. [zpa.machine-tunnels.provisioning-keys:separate-key-type]
- depends-on references/_meta/text/zcc/zcc.entitlements.zpa.md (Private Access entitlement and the machine tunnel switch), from zpa.machine-tunnels: With Enable Machine Tunnel For All on, all users whose app profile has a machine token can connect to Private Access without being logged in, on Windows or macOS. [zcc.entitlements.zpa:machine-tunnel-for-all]
- depends-on references/_meta/text/zpa/zpa.machine-groups.md (ZPA machine groups), from zpa.machine-tunnels: Using a machine tunnel takes four things: machine groups and machine provisioning keys configured in the Admin Console, the keys added to Zscaler Client Connector app profile rules for Windows or macOS, and the Private Access machine tunnel enabled for all. [zpa.machine-tunnels.requirements:components]
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.client-type-policy.md (The Machine Tunnel client type in ZPA policy), from zpa.machine-tunnels: An access rule that selects only the Client Connector client type does not select Machine Tunnel, so a machine tunnel session is covered only by a rule that selects Machine Tunnel; a session no rule covers meets the default Block Access outcome. [zpa.machine-tunnels.client-type-policy:machine-tunnel-needs-own-rule]
- logged-in references/_meta/text/zpa/zpa.machine-tunnels.monitoring.md (Machine tunnel status and removal in Client Connector), from zpa.machine-tunnels: A machine tunnel's status is Active, Inactive, Removed or Unregistered. Active, the default, means connected to Private Access before user login; Removed means the configuration was deleted or deactivated in the Admin Console; Unregistered means it is no longer connected to Zscaler services or policies. [zpa.machine-tunnels.monitoring:status-values]
- interacts-with references/_meta/text/zpa/zpa.machine-tunnels.posture.md (Device posture on the ZPA machine tunnel), from zpa.machine-tunnels: An access policy can use posture profile criteria with the Machine Tunnel client type when the device runs Zscaler Client Connector 3.9 or later. [zpa.machine-tunnels.posture:policy-client-version]
- links-to references/_meta/text/zpa/zpa.machine-tunnels.requirements.md (What a ZPA machine tunnel needs before it can connect)
