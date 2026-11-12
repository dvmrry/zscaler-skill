# The Go SDK against Cloud and Branch Connector (ZTW): where its behavior is described (cloud-connector.sdk-go)
Also called: ztw go sdk; zscaler-sdk-go ztw; cloud connector go sdk; zscaler/ztw/services

Package and function tables are generated: run `node scripts/kb.mjs surface ztw` for each Go package's exported functions and the endpoints they call. These subjects hold the client behavior around them; the API itself is in [The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes](kb:cloud-connector.api).

**Reaching the API.** OneAPI routing, the legacy client and its ZTC_* settings are in [Reaching and signing in to the Cloud Connector API: OneAPI, legacy ZTC credentials and government clouds](kb:cloud-connector.api.authentication); client-side rate limits in [Cloud Connector API rate limits and how the Go and Python clients back off and retry](kb:cloud-connector.api.rate-limits); government clouds in [ZTC Terraform provider configuration: OneAPI or legacy credentials, environment variables, defaults and government clouds](kb:cloud-connector.terraform.provider-config).

**Reading.** Paging and early stops are in [How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early](kb:shared.sdk-go.list-pagination); name lookups and JMESPath filtering in [How the Go SDK's ZTW packages find objects by name and filter lists](kb:cloud-connector.sdk-go.lookups).

**Writing.** Request and response handling is in [How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes](kb:shared.sdk-go.request-handling), omitted zero values in [Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes](kb:shared.sdk-go.zero-value-writes), retries in [How the Go SDK retries requests (and replays writes)](kb:shared.sdk-go.retries), and ZTW service defects (legacy misrouting, unchecked assertions) in [Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects](kb:cloud-connector.sdk-go.service-defects).

**Gaps in coverage.** Commented-out functions, activation, connector-group operations and missing fields are in [What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation](kb:cloud-connector.sdk-go.coverage); the activate calls themselves in [Reading Cloud & Branch Connector activation status](kb:shared.activation.cbc).

Area: cloud-connector.sdk-go, its subjects in references/_meta/spine/cloud-connector/cloud-connector.sdk-go.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/cloud-connector/cloud-connector.api.md (The Cloud Connector (ZTW) API from a client's side: hosts, sign-in, limits, coverage and wire notes)
- links-to references/_meta/text/cloud-connector/cloud-connector.api.authentication.md (Reaching and signing in to the Cloud Connector API: OneAPI, legacy ZTC credentials and government clouds)
- links-to references/_meta/text/cloud-connector/cloud-connector.api.rate-limits.md (Cloud Connector API rate limits and how the Go and Python clients back off and retry)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.coverage.md (What the Go SDK's ZTW packages leave out: commented-out functions, uncovered endpoints and activation)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.lookups.md (How the Go SDK's ZTW packages find objects by name and filter lists)
- links-to references/_meta/text/cloud-connector/cloud-connector.sdk-go.service-defects.md (Cloud Connector (ztw) Go SDK service functions with wrong assertions, nil payloads, or routing defects)
- links-to references/_meta/text/cloud-connector/cloud-connector.terraform.provider-config.md (ZTC Terraform provider configuration: OneAPI or legacy credentials, environment variables, defaults and government clouds)
- links-to references/_meta/text/shared/shared.activation.cbc.md (Reading Cloud & Branch Connector activation status)
- links-to references/_meta/text/shared/shared.sdk-go.list-pagination.md (How the Go SDK pages through ZPA, ZCC and ZTC lists, and when it stops early)
- links-to references/_meta/text/shared/shared.sdk-go.request-handling.md (How the Go SDK builds requests and interprets responses: client options, bodies, status codes, bulk deletes)
- links-to references/_meta/text/shared/shared.sdk-go.retries.md (How the Go SDK retries requests (and replays writes))
- links-to references/_meta/text/shared/shared.sdk-go.zero-value-writes.md (Why Terraform cannot clear some fields: omitted zero values and empty objects in SDK writes)
