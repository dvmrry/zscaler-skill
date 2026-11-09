# What a ZPA machine group is and how machines join it (zpa.machine-groups.definition)
Also called: machine group membership; how does a device join a machine group; machine group matching criteria; machine group limit; machine group provisioning key
Former IDs: zpa-14

This subject covers what a machine group is and how machines join it. A machine group is a set of an organization's internal, local machines that need to connect to Private Access, described as internal directories, such as Active Directory, that organizations want Private Access to connect to before Windows login. [zpa.machine-groups.definition:purpose] Machine groups let an admin associate Zscaler Client Connector with a machine group and enable Machine Tunnels for pre-Windows login, so a device can reach internal applications even when its Zscaler Client Connector is not connected to Private Access. [zpa.machine-groups.definition:benefits]

**Keys tie machines to a group.** Zscaler recommends deploying a new machine group for every machine provisioning key. [zpa.machine-groups.definition:one-key-per-group] After a machine group is created, a machine provisioning key must be assigned to it. [zpa.machine-groups.definition:key-needed-after-create] The machine provisioning key must be added to the Zscaler Client Connector profile rule, for Windows or macOS, for machine tunnel enrollment to succeed. [zpa.machine-groups.definition:key-in-profile-rule] Key creation and the key fields are in [Machine provisioning keys for ZPA machine tunnels](kb:zpa.machine-tunnels.provisioning-keys).

**What a group holds.** A machine group has no matching criteria of its own. Its fields are an identifier, name, description, enabled flag, audit fields, microtenant fields and the `machines` list, and the console form for a new group asks only for a name and a description. [zpa.machine-groups.definition:no-group-level-criteria] A machine group in the API carries a nested `machines` list. Each machine record has `fingerprint`, `issuedCertId`, `machineGroupId`, `machineGroupName` and `machineTokenId`. [zpa.machine-groups.definition:machine-record-fields] A machine appears in a machine group's `machines` list through enrollment with a provisioning key assigned to that group, not through criteria set on the group. [zpa.machine-groups.definition:membership-via-enrollment]

**Managing groups.** A machine group takes a name, which cannot contain special characters other than periods, hyphens and underscores, and an optional description. [zpa.machine-groups.definition:name-rules] The Admin Console adds, lists, filters, edits and deletes machine groups. [zpa.machine-groups.definition:console-actions] In the Edit Machine Group window, any field can be edited. [zpa.machine-groups.definition:edit-any-field] Creating or changing groups outside the console is covered in [Machine groups through the ZPA API, SDKs and Terraform](kb:zpa.machine-groups.api-surface). A ZPA organization can have 100 machine groups. [zpa.machine-groups.definition:group-limit] Other limits are open [gap:zpa.machine-groups.definition:capacity-other-limits].

**Using a group.** Rules that name a machine group are in [Using a machine group in a ZPA policy rule](kb:zpa.machine-groups.policy-use).

What to check:
1. Whether the group has a key assigned and that key is in the profile rule the device receives.
2. Whether a group-level hostname or operating-system rule is being assumed. The group has none.
3. Whether the tenant is near the group limit before adding another group.
4. How many machines or keys a group can take, which no source states.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.machine-groups.definition:no-group-level-criteria] Tier B: Rests on absence: no hostname, operating system or certificate-subject field appears in the API schema, the Go struct, the Python model, or the console form (read in full 2026-10-18).
- [zpa.machine-groups.definition:membership-via-enrollment] Tier B: Inference: no source narrates the enrollment steps. The chain is that the key names a group, the profile rule carries the key, and the machine record points back at its group.

Not known (open gaps):
- Limits on provisioning keys per group and enrolled machines per group [gap:zpa.machine-groups.definition:capacity-other-limits] (data gap): filled by operator; settled by support-ticket or tenant-data. Blocks: saying how many machines one group can hold

Area: zpa.machine-groups, its subjects in references/_meta/spine/zpa/zpa.machine-groups.json

Linked (open a file only if the answer needs it):
- depends-on references/_meta/text/zpa/zpa.machine-tunnels.provisioning-keys.md (Machine provisioning keys for ZPA machine tunnels): After a machine group is created, a machine provisioning key must be assigned to it. [zpa.machine-groups.definition:key-needed-after-create]
- links-to references/_meta/text/zpa/zpa.machine-groups.api-surface.md (Machine groups through the ZPA API, SDKs and Terraform)
- links-to references/_meta/text/zpa/zpa.machine-groups.policy-use.md (Using a machine group in a ZPA policy rule)
