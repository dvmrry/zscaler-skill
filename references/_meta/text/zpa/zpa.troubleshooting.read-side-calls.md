# Read-only SDK calls for ZPA triage (zpa.troubleshooting.read-side-calls)
Also called: GetPolicyByApplication; GetApplicationMappings; GetByPostureUDID; list_connector_groups_summary; zpa triage automation sdk; connection_state connector field

Read-only calls can list the rules that reference a segment and look up posture profiles and connectors.

**Policy and segments.** The Go SDK's policysetcontrollerv2.GetPolicyByApplication, given a policy type and an application ID, calls GET .../policySet/rules/policyType/{type}/application/{id} and returns the policy rules for that application. [zpa.troubleshooting.read-side-calls:go-policy-by-application] The Go SDK's applicationsegment.GetApplicationMappings calls GET .../application/{id}/mappings and returns name and type pairs for the objects mapped to the segment. [zpa.troubleshooting.read-side-calls:go-application-mappings]

**Posture.** The Go SDK's postureprofile.GetByPostureUDID lists the posture profiles and returns the one whose postureUDID matches, and when none matches it returns a nil profile with the error 'no posture profile with postureUDID ... was found'. [zpa.troubleshooting.read-side-calls:go-posture-by-udid]

**Connectors.** The Python SDK's list_connector_groups_summary is documented as retrieving all configured App Connector groups' names and IDs. [zpa.troubleshooting.read-side-calls:python-groups-summary] Neither SDK models a connection_state or ConnectionState field on an App Connector: the control connection state is controlChannelStatus. [zpa.troubleshooting.read-side-calls:no-connection-state-field] The sourced connector fields are in [App Connector health, status values and telemetry](kb:zpa.app-connectors.health).

What to check:
1. Which policy rules reference the application segment, with the application ID and the policy type.
2. Whether a posture UDID in a policy operand resolves to a profile, remembering that a miss is returned as an error.
3. Which connector field carries the control connection state, since no connection_state field exists.
4. What the connector groups summary call returns before relying on it for counts or windows.

Inferred, not quoted (say so when an answer rests on one):
- [zpa.troubleshooting.read-side-calls:no-connection-state-field] Tier B: Absence claim. A search of the ZPA packages of the Go and Python SDKs, of the Terraform provider and of the ZPA OpenAPI document found no field named connection_state, connectionState or ConnectionState.

Area: zpa.troubleshooting, its subjects in references/_meta/spine/zpa/zpa.troubleshooting.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/zpa/zpa.app-connectors.health.md (App Connector health, status values and telemetry)

Configured via and see also (open one only if the answer needs it):
- configured-via references/_meta/text/zpa/zpa.sdk-go.service-defects.md (ZPA Go SDK service functions that return partial results, send wrong keys, or reject valid input)
- see-also references/_meta/text/zpa/zpa.troubleshooting.policy-checks.md (Checking policy match, forwarding, posture and timeout for a blocked user)
