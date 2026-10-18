This subject collects the client-side behavior of the ZTC Terraform provider that is not about rule order: how it configures its SDK client, which arguments it quietly ignores, and where a read or update does something other than what its schema promises. Every claim is about what the provider and the Go SDK send and how they react; what the ZTC API does with it is stated as a gap where it matters.

**Client construction.** {{configure-builds-client-twice}} {{sdk-construction-authenticates}} {{discarded-client-keeps-renewing}} For token handling inside the SDK see [[shared.sdk-go.auth-lifecycle]].

**The parallelism setting.** {{parallelism-not-enforced}}

**Text arguments.** {{multiline-normalizer-doubles-dollar}} {{multiline-diff-suppress-ignores-clears}} {{multiline-helpers-on-nine-resources}} Omitted zero values and empty lists in SDK writes are the broader mechanism behind other clears that cannot be sent; they are in [[shared.sdk-go.zero-value-writes]], not repeated here.

**Accepted but unused arguments.** {{dns-rule-zpa-ip-group-dropped}} {{forwarding-rule-no-nw-application-groups}}

**Reads and updates.** {{forwarding-rule-read-cannot-clear-state}} {{ip-destination-update-gate-wider-than-create}} {{location-read-unguarded-response}} {{location-read-nil-response-reachability}} Update-time list panics and the parking of rules are in [[cloud-connector.terraform.rule-order]]; protection of predefined rules is in [[cloud-connector.terraform.rule-protection]].

**Data sources.** {{location-management-non-editable-never-set}}

**Version reported to the API.** {{version-metadata-user-agent}}

**Reorder coordinator synchronization.** {{reorder-done-channel-read-after-unlock}} {{reorder-race-outcomes}} How the coordinator decides what to write, and what it leaves unwritten, is in [[cloud-connector.terraform.rule-order]]; for the open questions on the server side see that subject's gaps.
