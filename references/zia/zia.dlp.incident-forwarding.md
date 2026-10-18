A rule's own decision and the places a match is reported are separate. Operators moving from another DLP product often expect a third party to be able to overrule the decision; here it cannot.

**The decision.** {{native-action}} The action and its enum are in [[zia.dlp.rules]] and [[zia.dlp.rule-wire-shape]].

**Third-party DLP over ICAP.** {{icap-one-way}} {{icap-needs-matching-rule}}

**Incident Receiver and Cloud-to-Cloud.** {{incident-receiver}} {{cloud-to-cloud}} {{c2c-api}} The rule's `receiver` field carries which of these a rule uses ([[zia.dlp.rule-wire-shape]]). The Cloud-to-Cloud data source exposes credentials as plain strings, covered in [[shared.terraform.credential-handling]].

**Supporting objects.** {{supporting-objects-endpoints}} Terraform data source output for these objects is in [[zia.terraform.data-source-fidelity]].

**Email and end user notification.** {{notification-needs-both}} {{end-user-notification}}

**Workflow Automation.** {{zwa-captures-incidents}} Do not assert how the incidents travel there; the ingest path is an open question (`zwa-ingest-path`).
